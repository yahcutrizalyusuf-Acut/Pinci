/**
 * Server tiruan Supabase untuk menguji aplikasi tanpa internet (login email, masuk anonim, kode hubung HP anak,
 * tabel dengan aturan akses seperti supabase/migrations). Hanya untuk pengembangan dan uji, bukan untuk dipakai sungguhan.
 *
 *   node scripts/server-tiruan.cjs            # port 9999
 *   PORT=9000 ANON=0 node scripts/server-tiruan.cjs   # ANON=0: masuk anonim ditolak (seperti fitur belum dinyalakan)
 *
 * Kode masuk email selalu 123456.
 */
const http = require('node:http');
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

const PORT = Number(process.env.PORT || 9999);
const ANON = process.env.ANON !== '0';

const orangTua = new Map(); // userId -> keluargaId
const keluarga = new Map(); // id -> { sapaan_ortu }
const perangkat = new Map(); // userId -> baris perangkat
const tabel = new Map(); // nama -> Map(id -> baris)
let kodeHubung = []; // { kode, keluarga_id, anak_ids, berlaku_sampai, dipakai }
let percobaan = []; // { auth_id, waktu }

const uuid = () => crypto.randomUUID();
const dari = (email) => 'u-' + crypto.createHash('sha1').update(email).digest('hex').slice(0, 12);
const tabelDari = (nama) => {
  if (!tabel.has(nama)) tabel.set(nama, new Map());
  return tabel.get(nama);
};
const TABEL = ['anak', 'sesi', 'jawaban', 'kemajuan_topik', 'pesan', 'pengaturan_waktu', 'pemakaian'];

function kirimJson(res, status, isi) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'apikey, authorization, content-type, prefer, accept, x-client-info, range',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  });
  res.end(isi === undefined ? '' : JSON.stringify(isi));
}

function sesiDari(uid, refresh) {
  return { access_token: `tok:${uid}`, refresh_token: `ref:${uid}`, expires_in: 3600, token_type: 'bearer', user: { id: uid, is_anonymous: !!refresh } };
}

function pengguna(req) {
  const m = /^Bearer tok:(.+)$/.exec(req.headers.authorization || '');
  return m ? m[1] : null;
}

function peranDari(uid) {
  if (!uid) return null;
  if (orangTua.has(uid)) return { jenis: 'ortu', keluarga: orangTua.get(uid) };
  const p = perangkat.get(uid);
  if (p && !p.diputus) return { jenis: 'anak', keluarga: p.keluarga_id, anak: p.anak_ids };
  return { jenis: 'tanpa' };
}

function terlihat(peran, nama, baris) {
  if (peran.jenis === 'ortu') return baris.keluarga_id === peran.keluarga;
  if (peran.jenis === 'anak') return nama === 'anak' ? peran.anak.includes(baris.id) : peran.anak.includes(baris.anak_id);
  return false;
}

function bolehTulis(peran, nama, baris, ada) {
  if (peran.jenis === 'ortu') return baris.keluarga_id === peran.keluarga;
  if (peran.jenis !== 'anak') return false;
  if (!peran.anak.includes(baris.anak_id) || baris.keluarga_id !== peran.keluarga) return false;
  if (['sesi', 'jawaban', 'kemajuan_topik', 'pemakaian'].includes(nama)) return true;
  if (nama === 'pesan') return !ada && baris.dari === 'anak' && ['stiker', 'bantu_aku'].includes(baris.jenis);
  return false;
}

function saring(daftar, url) {
  let hasil = daftar;
  for (const [k, v] of url.searchParams) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict'].includes(k)) continue;
    const [op, ...sisa] = v.split('.');
    const nilai = sisa.join('.');
    if (op === 'eq') hasil = hasil.filter((b) => String(b[k]) === nilai);
    else if (op === 'gte') hasil = hasil.filter((b) => Date.parse(b[k]) >= Date.parse(nilai));
    else if (op === 'in') {
      const set = new Set(nilai.replace(/^\(|\)$/g, '').split(','));
      hasil = hasil.filter((b) => set.has(String(b[k])));
    }
  }
  const urut = url.searchParams.get('order');
  if (urut) {
    const kunci = urut.split(',').map((x) => x.split('.'));
    hasil = [...hasil].sort((a, b) => {
      for (const [kol, arah] of kunci) {
        const x = a[kol] ?? '';
        const y = b[kol] ?? '';
        const c = String(x).localeCompare(String(y));
        if (c !== 0) return arah === 'desc' ? -c : c;
      }
      return 0;
    });
  }
  const offset = Number(url.searchParams.get('offset') || 0);
  const batas = Math.min(1000, Number(url.searchParams.get('limit') || 1000));
  return hasil.slice(offset, offset + batas);
}

function rpc(nama, uid, badan) {
  const peran = peranDari(uid);
  const kini = Date.now();
  if (nama === 'daftarkan_keluarga') {
    if (!uid) return { status: 401 };
    if (orangTua.has(uid)) return { status: 200, isi: orangTua.get(uid) === badan.p_id };
    if ([...orangTua.values()].includes(badan.p_id)) return { status: 200, isi: false };
    keluarga.set(badan.p_id, { sapaan_ortu: badan.p_sapaan });
    orangTua.set(uid, badan.p_id);
    return { status: 200, isi: true };
  }
  if (nama === 'buat_kode_hubung') {
    if (!peran || peran.jenis !== 'ortu') return { status: 403 };
    const anak = [...new Set(badan.p_anak_ids || [])];
    const ada = anak.filter((id) => tabelDari('anak').get(id)?.keluarga_id === peran.keluarga);
    if (anak.length === 0 || anak.length > 6 || ada.length !== anak.length) return { status: 400, isi: { message: 'anak_tidak_valid' } };
    kodeHubung = kodeHubung.filter((k) => k.dipakai || (k.keluarga_id !== peran.keluarga && k.berlaku_sampai > kini));
    let kode;
    do kode = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
    while (kodeHubung.some((k) => k.kode === kode && !k.dipakai));
    const berlaku = kini + 10 * 60_000;
    kodeHubung.push({ kode, keluarga_id: peran.keluarga, anak_ids: anak, berlaku_sampai: berlaku, dipakai: false });
    return { status: 200, isi: { kode, berlaku_sampai: new Date(berlaku).toISOString() } };
  }
  if (nama === 'tukar_kode_hubung') {
    if (!uid) return { status: 401 };
    if (orangTua.has(uid)) return { status: 200, isi: { ok: false, alasan: 'akun_orang_tua' } };
    percobaan = percobaan.filter((p) => p.waktu > kini - 3_600_000);
    const mnt10 = percobaan.filter((p) => p.waktu > kini - 600_000);
    if (mnt10.filter((p) => p.auth_id === uid).length >= 5 || mnt10.length >= 100) return { status: 200, isi: { ok: false, alasan: 'terlalu_sering' } };
    const k = kodeHubung.find((x) => x.kode === badan.p_kode && !x.dipakai && x.berlaku_sampai > kini);
    if (!k) {
      percobaan.push({ auth_id: uid, waktu: kini });
      return { status: 200, isi: { ok: false, alasan: 'salah' } };
    }
    k.dipakai = true;
    perangkat.set(uid, { id: uid, keluarga_id: k.keluarga_id, jenis: 'anak', anak_ids: k.anak_ids, terakhir_sinkron: new Date(kini).toISOString(), antrean_belum_kirim: 0, versi_aplikasi: badan.p_versi || null, diputus: false });
    return { status: 200, isi: { ok: true, keluarga_id: k.keluarga_id, sapaan: keluarga.get(k.keluarga_id)?.sapaan_ortu ?? null, anak_ids: k.anak_ids } };
  }
  if (nama === 'catat_sinkron') {
    const p = perangkat.get(uid);
    if (p && !p.diputus) {
      p.terakhir_sinkron = new Date(kini).toISOString();
      p.antrean_belum_kirim = Math.max(0, badan.p_antrean || 0);
    }
    return { status: 204 };
  }
  if (nama === 'tandai_pesan_dibaca') {
    if (!peran || peran.jenis !== 'anak') return { status: 403 };
    let n = 0;
    for (const id of badan.p_ids || []) {
      const b = tabelDari('pesan').get(id);
      if (b && b.dari === 'orang_tua' && peran.anak.includes(b.anak_id)) {
        b.dibaca = b.dibaca || badan.p_waktu || new Date(kini).toISOString();
        b.diubah = new Date(kini).toISOString();
        n++;
      }
    }
    return { status: 200, isi: n };
  }
  return { status: 404 };
}

async function badanDari(req) {
  const potong = [];
  for await (const c of req) potong.push(c);
  const teks = Buffer.concat(potong).toString('utf8');
  return teks ? JSON.parse(teks) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return kirimJson(res, 204);
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    const uid = pengguna(req);

    // ---------- auth ----------
    if (p === '/auth/v1/otp') return kirimJson(res, 200, {});
    if (p === '/auth/v1/verify') {
      const b = await badanDari(req);
      if (b.token !== '123456') return kirimJson(res, 400, { error: 'invalid' });
      return kirimJson(res, 200, sesiDari(dari(String(b.email).toLowerCase()), false));
    }
    if (p === '/auth/v1/signup') {
      if (!ANON) return kirimJson(res, 422, { msg: 'Anonymous sign-ins are disabled' });
      return kirimJson(res, 200, sesiDari('anon-' + uuid().slice(0, 8), true));
    }
    if (p === '/auth/v1/token') {
      const b = await badanDari(req);
      const m = /^ref:(.+)$/.exec(b.refresh_token || '');
      return m ? kirimJson(res, 200, sesiDari(m[1], m[1].startsWith('anon-'))) : kirimJson(res, 400, { error: 'invalid' });
    }

    // ---------- rpc ----------
    const mRpc = /^\/rest\/v1\/rpc\/(.+)$/.exec(p);
    if (mRpc) {
      const r = rpc(mRpc[1], uid, await badanDari(req));
      return kirimJson(res, r.status, r.isi);
    }

    // ---------- tabel ----------
    const mTab = /^\/rest\/v1\/(.+)$/.exec(p);
    if (!mTab) return kirimJson(res, 404, { message: 'tidak ada' });
    const nama = mTab[1];
    if (!uid) return kirimJson(res, 401, { message: 'perlu masuk' });
    const peran = peranDari(uid);

    if (nama === 'perangkat') {
      if (req.method === 'GET') {
        const semua = [...perangkat.values()].filter((x) => (peran.jenis === 'ortu' ? x.keluarga_id === peran.keluarga : x.id === uid));
        return kirimJson(res, 200, saring(semua, url));
      }
      if (req.method === 'PATCH' && peran.jenis === 'ortu') {
        const b = await badanDari(req);
        for (const x of saring([...perangkat.values()].filter((y) => y.keluarga_id === peran.keluarga), url)) Object.assign(x, b);
        return kirimJson(res, 204);
      }
      return kirimJson(res, 403, { code: '42501' });
    }
    if (!TABEL.includes(nama)) return kirimJson(res, 404, { message: 'tabel tidak dikenal' });
    const t = tabelDari(nama);

    if (req.method === 'GET') {
      const semua = [...t.values()].filter((b) => terlihat(peran, nama, b));
      return kirimJson(res, 200, saring(semua, url));
    }
    if (req.method === 'POST') {
      const baris = await badanDari(req);
      const daftar = Array.isArray(baris) ? baris : [baris];
      const abaikan = String(req.headers.prefer || '').includes('ignore-duplicates');
      for (const b of daftar) {
        const ada = t.has(b.id);
        if (!bolehTulis(peran, nama, b, ada)) return kirimJson(res, 403, { code: '42501', message: 'melanggar aturan akses' });
      }
      const waktu = new Date().toISOString();
      for (const b of daftar) {
        if (t.has(b.id) && abaikan) continue;
        const baru = { ...(t.get(b.id) || {}), ...b };
        if (nama === 'sesi') baru.diterima_server = baru.diterima_server || waktu;
        else baru.diubah = waktu;
        t.set(b.id, baru);
      }
      return kirimJson(res, 201);
    }
    return kirimJson(res, 405, { message: 'metode tidak didukung' });
  } catch (e) {
    return kirimJson(res, 500, { message: String(e && e.message) });
  }
});

server.listen(PORT, () => console.log(`Server tiruan Supabase di http://localhost:${PORT} (masuk anonim ${ANON ? 'nyala' : 'mati'})`));
