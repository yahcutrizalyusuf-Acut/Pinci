/**
 * Server tiruan Supabase untuk menguji aplikasi tanpa internet (login email, masuk anonim, kode hubung HP anak,
 * tabel dengan aturan akses seperti supabase/migrations). Hanya untuk pengembangan dan uji, bukan untuk dipakai sungguhan.
 *
 *   node scripts/server-tiruan.cjs            # port 9999
 *   PORT=9000 ANON=0 node scripts/server-tiruan.cjs   # ANON=0: masuk anonim ditolak (seperti fitur belum dinyalakan)
 *
 * Kode masuk email selalu 123456.
 * Kelas dan pengawas: email super@contoh.id sudah diundang sebagai super admin (bisa diganti lewat SUPER=email).
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
const emailDari = new Map(); // userId -> email
const staf = new Map(); // userId -> { id, peran, mitra_id, nama, aktif }
let undangan = [{ email: (process.env.SUPER || 'super@contoh.id').toLowerCase(), peran: 'super_admin', mitra_id: null, nama: 'Acut', dipakai: false }];
const mitra = new Map(); // id -> { id, nama, kota }
const kelas = new Map(); // id -> { id, nama, mitra_id, pengawas_id, kode, kapasitas, aktif }
let anggota = []; // { id, kelas_id, anak_id, keluarga_id, paket, masuk, keluar, coba_sampai }
const pantauan = new Set(); // kelas_id + ':' + tanggal

const uuid = () => crypto.randomUUID();
const dari = (email) => 'u-' + crypto.createHash('sha1').update(email).digest('hex').slice(0, 12);
const tabelDari = (nama) => {
  if (!tabel.has(nama)) tabel.set(nama, new Map());
  return tabel.get(nama);
};
const TABEL = ['anak', 'sesi', 'jawaban', 'kemajuan_topik', 'pesan', 'pengaturan_waktu', 'pemakaian', 'catatan_pengawas', 'tugas', 'masukan', 'jawaban_pertanyaan', 'catatan_pemakaian', 'catatan_teknis'];
const harga = { dasar: 50000, lengkap: 60000, siap_tka: 70000, mitra: 70000 };
const pembayaran = []; // { anak_id, bulan, jumlah, cara, waktu }
let pendaftar = []; // baris pendaftar dari halaman penjelasan
const setujuPakai = new Map(); // anak_id -> boolean

function statusAnggota(a) {
  const k = kelas.get(a.kelas_id);
  const kini = Date.now();
  if (k && k.mitra_id) return 'mitra';
  if (a.berlaku_sampai && Date.parse(a.berlaku_sampai) > kini) return 'aktif';
  if (Date.parse(a.coba_sampai) > kini) return 'coba';
  const akhir = Math.max(Date.parse(a.coba_sampai), a.berlaku_sampai ? Date.parse(a.berlaku_sampai) : 0);
  return akhir + 7 * 86_400_000 > kini ? 'tenggang' : 'berhenti';
}
const bolehUang = (uid) => ['super_admin', 'admin'].includes(stafAktif(uid)?.peran);
const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const hariWib = (ms = Date.now()) => new Date(ms + 7 * 3_600_000).toISOString().slice(0, 10);

function stafAktif(uid) {
  const s = staf.get(uid);
  return s && s.aktif ? s : null;
}

function kelasSaya(uid) {
  const s = stafAktif(uid);
  if (!s) return [];
  return [...kelas.values()].filter(
    (k) =>
      s.peran === 'super_admin' ||
      (s.peran === 'admin' && !k.mitra_id) ||
      (s.peran === 'mitra' && k.mitra_id === s.mitra_id) ||
      (s.peran === 'pengawas' && k.pengawas_id === s.id),
  );
}

const anggotaAktif = () => anggota.filter((a) => !a.keluar);

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
  if (nama === 'catatan_pengawas' && peran.jenis === 'anak') return false;
  if (peran.jenis === 'ortu') return baris.keluarga_id === peran.keluarga;
  if (peran.jenis === 'anak') return nama === 'anak' ? peran.anak.includes(baris.id) : peran.anak.includes(baris.anak_id);
  return false;
}

function bolehTulis(peran, nama, baris, ada) {
  if (nama === 'catatan_pemakaian' && setujuPakai.get(baris.anak_id) !== true) return false;
  if (peran.jenis === 'ortu') return baris.keluarga_id === peran.keluarga;
  if (peran.jenis !== 'anak') return false;
  if (!peran.anak.includes(baris.anak_id) || baris.keluarga_id !== peran.keluarga) return false;
  if (['sesi', 'jawaban', 'kemajuan_topik', 'pemakaian'].includes(nama)) return true;
  if (nama === 'pesan') return !ada && baris.dari === 'anak' && ['stiker', 'bantu_aku'].includes(baris.jenis);
  return false;
}

/** Staf menulis catatan/tugas untuk anak aktif di kelas yang boleh dilihatnya, atas namanya sendiri. */
function stafBolehTulis(uid, baris) {
  const k = kelasSaya(uid).map((x) => x.id);
  return baris.staf_id === uid && k.includes(baris.kelas_id) && anggotaAktif().some((a) => a.kelas_id === baris.kelas_id && a.anak_id === baris.anak_id && a.keluarga_id === baris.keluarga_id);
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
  // ---------- kelas dan pengawas ----------
  if (nama === 'terima_undangan') {
    if (!uid) return { status: 401 };
    const email = emailDari.get(uid);
    const u = undangan.find((x) => x.email === email && !x.dipakai);
    if (u) {
      staf.set(uid, { id: uid, peran: u.peran, mitra_id: u.mitra_id, nama: u.nama, aktif: true });
      u.dipakai = true;
    }
    const s = staf.get(uid);
    return { status: 200, isi: s && s.aktif ? { ok: true, peran: s.peran, nama: s.nama, mitra_id: s.mitra_id } : { ok: false } };
  }
  if (nama === 'undang_staf') {
    const s = stafAktif(uid);
    if (!s) return { status: 403, isi: { message: 'bukan_staf' } };
    let { p_peran: peranBaru, p_mitra_id: m } = badan;
    if (s.peran !== 'super_admin') {
      if (peranBaru !== 'pengawas') return { status: 403, isi: { message: 'tidak_boleh' } };
      m = s.peran === 'mitra' ? s.mitra_id : null;
    }
    const email = String(badan.p_email).trim().toLowerCase();
    undangan = undangan.filter((x) => x.dipakai || x.email !== email);
    undangan.push({ email, peran: peranBaru, mitra_id: m || null, nama: badan.p_nama, dipakai: false });
    return { status: 200, isi: { ok: true } };
  }
  if (nama === 'buat_mitra') {
    if (stafAktif(uid)?.peran !== 'super_admin') return { status: 403, isi: { message: 'tidak_boleh' } };
    const id = uuid();
    mitra.set(id, { id, nama: badan.p_nama, kota: badan.p_kota || null });
    return { status: 200, isi: id };
  }
  if (nama === 'buat_kelas') {
    const s = stafAktif(uid);
    if (!s || s.peran === 'pengawas') return { status: 403, isi: { message: 'tidak_boleh' } };
    const m = s.peran === 'admin' ? null : s.peran === 'mitra' ? s.mitra_id : badan.p_mitra_id || null;
    if (badan.p_pengawas_id && (stafAktif(badan.p_pengawas_id)?.mitra_id ?? null) !== m) return { status: 400, isi: { message: 'pengawas_tidak_cocok' } };
    let kode;
    do kode = Array.from(crypto.randomBytes(6), (b) => HURUF_KODE[b % 31]).join('');
    while ([...kelas.values()].some((k) => k.kode === kode));
    const id = uuid();
    kelas.set(id, { id, nama: badan.p_nama, mitra_id: m, pengawas_id: badan.p_pengawas_id || null, kode, kapasitas: 8, aktif: true });
    return { status: 200, isi: { id, kode } };
  }
  if (nama === 'ubah_kelas') {
    const k = kelas.get(badan.p_id);
    if (!k || !kelasSaya(uid).includes(k) || stafAktif(uid).peran === 'pengawas') return { status: 403, isi: { message: 'tidak_boleh' } };
    Object.assign(k, { nama: badan.p_nama, pengawas_id: badan.p_pengawas_id, aktif: badan.p_aktif });
    return { status: 204 };
  }
  if (nama === 'atur_staf_aktif') {
    if (stafAktif(uid)?.peran !== 'super_admin' || badan.p_staf_id === uid) return { status: 403, isi: { message: 'tidak_boleh' } };
    const t = staf.get(badan.p_staf_id);
    if (t) t.aktif = badan.p_aktif;
    return { status: 204 };
  }
  if (nama === 'daftar_kelas_saya') {
    return {
      status: 200,
      isi: kelasSaya(uid).map((k) => ({
        ...k,
        pengawas_nama: staf.get(k.pengawas_id)?.nama ?? null,
        jumlah_anak: anggotaAktif().filter((a) => a.kelas_id === k.id).length,
        pantauan_terakhir: [...pantauan].filter((x) => x.startsWith(k.id + ':')).map((x) => x.split(':')[1]).sort().pop() ?? null,
      })),
    };
  }
  if (nama === 'catat_pantauan') {
    if (!kelasSaya(uid).some((k) => k.id === badan.p_kelas_id)) return { status: 403, isi: { message: 'tidak_boleh' } };
    pantauan.add(`${badan.p_kelas_id}:${hariWib()}`);
    return { status: 200, isi: { tanggal: hariWib() } };
  }
  if (nama === 'papan_kelas') {
    const k = kelasSaya(uid).find((x) => x.id === badan.p_kelas_id);
    if (!k) return { status: 403, isi: { message: 'tidak_boleh' } };
    const sesi = [...tabelDari('sesi').values()];
    const hariSesi = (anakId, n) => new Set(sesi.filter((x) => x.anak_id === anakId && Date.parse(x.mulai) >= kini - n * 86_400_000).map((x) => hariWib(Date.parse(x.mulai)))).size;
    const isi = anggotaAktif()
      .filter((a) => a.kelas_id === k.id)
      .map((a) => {
        const an = tabelDari('anak').get(a.anak_id) || {};
        const lemah = [...tabelDari('kemajuan_topik').values()]
          .filter((t) => t.anak_id === a.anak_id && t.benar + t.salah >= 5 && t.benar / (t.benar + t.salah) < 0.7)
          .map((t) => ({ mapel: t.mapel, topik: t.topik, persen: Math.round((100 * t.benar) / (t.benar + t.salah)) }))
          .slice(0, 3);
        const milik = sesi.filter((x) => x.anak_id === a.anak_id).map((x) => x.selesai).sort();
        const catatan = [...tabelDari('catatan_pengawas').values()].filter((c) => c.anak_id === a.anak_id && c.kelas_id === k.id).map((c) => c.waktu).sort();
        return {
          anak_id: a.anak_id,
          nama: an.nama,
          kelas: an.kelas,
          hewan: an.hewan,
          paket: a.paket,
          coba_sampai: a.coba_sampai,
          masuk: a.masuk,
          terakhir_latihan: milik.pop() ?? null,
          hari_latihan_7: hariSesi(a.anak_id, 7),
          hari_latihan_4: hariSesi(a.anak_id, 4),
          topik_lemah: lemah,
          catatan_terakhir: catatan.pop() ?? null,
          tugas_terbuka: [...tabelDari('tugas').values()].filter((g) => g.anak_id === a.anak_id && g.kelas_id === k.id && !g.selesai && !g.dibatalkan).length,
        };
      });
    return { status: 200, isi: { kelas: k, hari_ini: hariWib(), pantauan_hari_ini: pantauan.has(`${k.id}:${hariWib()}`), anak: isi } };
  }
  if (nama === 'gabung_kelas') {
    if (!peran || peran.jenis !== 'ortu') return { status: 403, isi: { message: 'bukan_orang_tua' } };
    const an = tabelDari('anak').get(badan.p_anak_id);
    if (!an || an.keluarga_id !== peran.keluarga) return { status: 200, isi: { ok: false, alasan: 'anak_tidak_valid' } };
    if (badan.p_paket === 'siap_tka' && an.kelas !== 6) return { status: 200, isi: { ok: false, alasan: 'paket_tidak_cocok' } };
    const kode = String(badan.p_kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const k = [...kelas.values()].find((x) => x.kode === kode && x.aktif);
    if (!k) return { status: 200, isi: { ok: false, alasan: 'kode_salah' } };
    let a = anggotaAktif().find((x) => x.anak_id === an.id);
    if (a && a.kelas_id !== k.id) return { status: 200, isi: { ok: false, alasan: 'sudah_di_kelas_lain' } };
    if (!a) {
      if (anggotaAktif().filter((x) => x.kelas_id === k.id).length >= k.kapasitas) return { status: 200, isi: { ok: false, alasan: 'penuh' } };
      a = { id: uuid(), kelas_id: k.id, anak_id: an.id, keluarga_id: peran.keluarga, paket: badan.p_paket, masuk: new Date(kini).toISOString(), keluar: null, coba_sampai: new Date(kini + 14 * 86_400_000).toISOString() };
      anggota.push(a);
    }
    a.paket = badan.p_paket;
    setujuPakai.set(an.id, !!badan.p_setuju_pemakaian);
    return { status: 200, isi: { ok: true, anggota_id: a.id, kelas_id: k.id, kelas_nama: k.nama, pengawas_nama: staf.get(k.pengawas_id)?.nama ?? null, paket: a.paket, coba_sampai: a.coba_sampai } };
  }
  if (nama === 'ganti_paket') {
    const a = anggotaAktif().find((x) => x.anak_id === badan.p_anak_id && x.keluarga_id === peran?.keluarga);
    if (!a) return { status: 200, isi: { ok: false, alasan: 'belum_di_kelas' } };
    a.paket = badan.p_paket;
    return { status: 200, isi: { ok: true } };
  }
  if (nama === 'keluar_kelas') {
    let n = 0;
    for (const a of anggotaAktif()) if (a.anak_id === badan.p_anak_id && a.keluarga_id === peran?.keluarga) { a.keluar = new Date(kini).toISOString(); n++; }
    return { status: 200, isi: n };
  }
  if (nama === 'kelas_keluarga') {
    const milik = anggotaAktif().filter((a) => (peran?.jenis === 'ortu' && a.keluarga_id === peran.keluarga) || (peran?.jenis === 'anak' && peran.anak.includes(a.anak_id)));
    return {
      status: 200,
      isi: milik.map((a) => ({ anggota_id: a.id, anak_id: a.anak_id, kelas_id: a.kelas_id, kelas_nama: kelas.get(a.kelas_id).nama, pengawas_nama: staf.get(kelas.get(a.kelas_id).pengawas_id)?.nama ?? null, paket: a.paket, masuk: a.masuk, coba_sampai: a.coba_sampai, berlaku_sampai: a.berlaku_sampai ?? null, status: statusAnggota(a), setuju_pemakaian: setujuPakai.get(a.anak_id) === true })),
    };
  }
  if (nama === 'status_anak_kelas') {
    if (!kelasSaya(uid).some((k) => k.id === badan.p_kelas_id)) return { status: 200, isi: {} };
    return { status: 200, isi: Object.fromEntries(anggotaAktif().filter((a) => a.kelas_id === badan.p_kelas_id).map((a) => [a.anak_id, statusAnggota(a)])) };
  }
  if (nama === 'atur_persetujuan_pemakaian') {
    const an = tabelDari('anak').get(badan.p_anak_id);
    if (!an || an.keluarga_id !== peran?.keluarga) return { status: 403, isi: { message: 'anak_tidak_valid' } };
    setujuPakai.set(an.id, !!badan.p_setuju);
    return { status: 204 };
  }
  if (nama === 'daftar_langganan') {
    if (!bolehUang(uid)) return { status: 200, isi: [] };
    const k = kelasSaya(uid).filter((x) => !x.mitra_id).map((x) => x.id);
    return {
      status: 200,
      isi: anggotaAktif()
        .filter((a) => k.includes(a.kelas_id))
        .map((a) => {
          const an = tabelDari('anak').get(a.anak_id) || {};
          const ortu = [...orangTua.entries()].find(([, kel]) => kel === a.keluarga_id);
          return { anak_id: a.anak_id, anak_nama: an.nama, kelas: an.kelas, kelas_nama: kelas.get(a.kelas_id).nama, paket: a.paket, coba_sampai: a.coba_sampai, berlaku_sampai: a.berlaku_sampai ?? null, status: statusAnggota(a), email_ortu: ortu ? emailDari.get(ortu[0]) ?? null : null, sapaan: keluarga.get(a.keluarga_id)?.sapaan_ortu ?? null };
        }),
    };
  }
  if (nama === 'aktifkan_langganan') {
    if (!bolehUang(uid)) return { status: 403, isi: { message: 'tidak_boleh' } };
    const a = anggotaAktif().find((x) => x.anak_id === badan.p_anak_id);
    if (!a) return { status: 400, isi: { message: 'tidak_di_kelas' } };
    const dasar = Math.max(kini, Date.parse(a.coba_sampai), a.berlaku_sampai ? Date.parse(a.berlaku_sampai) : 0);
    const d = new Date(dasar);
    d.setMonth(d.getMonth() + badan.p_bulan);
    a.berlaku_sampai = d.toISOString();
    pembayaran.push({ anak_id: a.anak_id, bulan: badan.p_bulan, jumlah: badan.p_jumlah, cara: badan.p_cara, waktu: kini });
    return { status: 200, isi: { berlaku_sampai: a.berlaku_sampai } };
  }
  if (nama === 'daftar_harga') return { status: 200, isi: stafAktif(uid)?.peran === 'super_admin' ? harga : {} };
  if (nama === 'atur_harga') {
    if (stafAktif(uid)?.peran !== 'super_admin') return { status: 403, isi: { message: 'tidak_boleh' } };
    harga[badan.p_paket] = badan.p_harga;
    return { status: 204 };
  }
  if (nama === 'tagihan_mitra') {
    const s = stafAktif(uid);
    const boleh = [...mitra.values()].filter((m) => s?.peran === 'super_admin' || (s?.peran === 'mitra' && s.mitra_id === m.id));
    return { status: 200, isi: boleh.map((m) => ({ mitra_id: m.id, nama: m.nama, murid_aktif: 0, tarif: harga.mitra, total: 0 })) };
  }
  if (nama === 'daftar_minat') {
    pendaftar.unshift({ id: uuid(), jenis: badan.p_jenis, nama_ortu: badan.p_nama_ortu, email: String(badan.p_email || '').toLowerCase(), wa: badan.p_wa, kelas_anak: badan.p_kelas_anak, nama_anak: badan.p_nama_anak, nama_les: badan.p_nama_les, sumber: badan.p_sumber, status: 'baru', catatan: null, waktu: new Date(kini).toISOString() });
    return { status: 200, isi: { ok: true } };
  }
  if (nama === 'daftar_pendaftar') return { status: 200, isi: bolehUang(uid) ? pendaftar : [] };
  if (nama === 'ubah_pendaftar') {
    const p = pendaftar.find((x) => x.id === badan.p_id);
    if (p && bolehUang(uid)) Object.assign(p, { status: badan.p_status, catatan: badan.p_catatan });
    return { status: 204 };
  }
  if (nama === 'daftar_masukan') {
    if (!bolehUang(uid)) return { status: 200, isi: null };
    const m = [...tabelDari('masukan').values()].map((x) => ({ id: x.id, jenis: x.jenis, isi: x.isi, waktu: x.waktu, versi: x.versi_aplikasi ?? null, dibaca: !!x.dibaca, sapaan: keluarga.get(x.keluarga_id)?.sapaan_ortu ?? null }));
    const teknis = [...tabelDari('catatan_teknis').values()].map((x) => ({ pesan: x.pesan, jumlah: 1, terakhir: x.waktu }));
    return { status: 200, isi: { masukan: m, teknis } };
  }
  if (nama === 'tandai_masukan_dibaca') {
    for (const id of badan.p_ids || []) if (tabelDari('masukan').get(id)) tabelDari('masukan').get(id).dibaca = true;
    return { status: 204 };
  }
  if (nama === 'laporan_mingguan') {
    if (!bolehUang(uid)) return { status: 403, isi: { message: 'tidak_boleh' } };
    const status = {};
    for (const a of anggotaAktif()) status[statusAnggota(a)] = (status[statusAnggota(a)] || 0) + 1;
    return {
      status: 200,
      isi: { sejak: new Date(kini - 7 * 86_400_000).toISOString(), keluarga_aktif: new Set([...tabelDari('sesi').values()].map((x) => x.keluarga_id)).size, anak_aktif: new Set([...tabelDari('sesi').values()].map((x) => x.anak_id)).size, rata_hari_latihan: null, status, anak_berhenti_latihan: 0, keluar_kelas: 0, masuk_kelas: anggotaAktif().length, pendaftar_baru: pendaftar.length, pendaftar_per_sumber: {}, masukan_baru: tabelDari('masukan').size, masalah_teknis: tabelDari('catatan_teknis').size, kelas_tanpa_pantauan: [], pantauan_minggu_ini: pantauan.size, uang_minggu_ini: stafAktif(uid).peran === 'super_admin' ? pembayaran.reduce((n, x) => n + x.jumlah, 0) : null, bayar_minggu_ini: pembayaran.length },
    };
  }
  if (nama === 'tandai_catatan_dibaca' || nama === 'tandai_tugas_selesai') {
    const t = tabelDari(nama === 'tandai_tugas_selesai' ? 'tugas' : 'catatan_pengawas');
    const kolom = nama === 'tandai_tugas_selesai' ? 'selesai' : 'dibaca';
    let n = 0;
    for (const id of badan.p_ids || []) {
      const b = t.get(id);
      const boleh = b && ((peran?.jenis === 'ortu' && b.keluarga_id === peran.keluarga) || (kolom === 'selesai' && peran?.jenis === 'anak' && peran.anak.includes(b.anak_id)));
      if (boleh && !b[kolom]) {
        b[kolom] = badan.p_waktu || new Date(kini).toISOString();
        b.diubah = new Date(kini).toISOString();
        n++;
      }
    }
    return { status: 200, isi: n };
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
      const email = String(b.email).toLowerCase();
      emailDari.set(dari(email), email);
      return kirimJson(res, 200, sesiDari(dari(email), false));
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
    if (nama === 'staf' || nama === 'mitra' || nama === 'anggota_kelas') {
      if (req.method !== 'GET') return kirimJson(res, 403, { code: '42501' });
      const s = stafAktif(uid);
      let semua = [];
      if (nama === 'staf' && s) semua = [...staf.values()].filter((x) => x.id === uid || s.peran === 'super_admin' || (s.peran === 'admin' && !x.mitra_id) || (s.peran === 'mitra' && x.mitra_id === s.mitra_id));
      if (nama === 'mitra' && s) semua = [...mitra.values()].filter((x) => s.peran === 'super_admin' || s.peran === 'admin' || x.id === s.mitra_id);
      if (nama === 'anggota_kelas') {
        const k = kelasSaya(uid).map((x) => x.id);
        semua = anggota.filter((a) => k.includes(a.kelas_id) || a.keluarga_id === peran.keluarga).map((a) => ({ ...a, keluar: a.keluar ?? 'null' }));
        semua = saring(semua, new URL(url.href.replace('keluar=is.null', 'keluar=eq.null')));
        return kirimJson(res, 200, semua);
      }
      return kirimJson(res, 200, saring(semua, url));
    }
    if (!TABEL.includes(nama)) return kirimJson(res, 404, { message: 'tabel tidak dikenal' });
    const t = tabelDari(nama);
    const tabelStaf = nama === 'catatan_pengawas' || nama === 'tugas';

    if (req.method === 'PATCH' && nama === 'tugas' && stafAktif(uid)) {
      const b = await badanDari(req);
      const k = kelasSaya(uid).map((x) => x.id);
      for (const x of saring([...t.values()].filter((y) => k.includes(y.kelas_id)), url)) Object.assign(x, b, { diubah: new Date().toISOString() });
      return kirimJson(res, 204);
    }
    if (req.method === 'GET') {
      const k = tabelStaf ? kelasSaya(uid).map((x) => x.id) : [];
      const tanpaSaringBool = new URL(url.href.replace(/&?dibatalkan=is\.false/, ''));
      const semua = [...t.values()].filter((b) => terlihat(peran, nama, b) || k.includes(b.kelas_id)).filter((b) => !(url.search.includes('dibatalkan=is.false') && b.dibatalkan));
      return kirimJson(res, 200, saring(semua, tanpaSaringBool));
    }
    if (req.method === 'POST' && tabelStaf) {
      const b = await badanDari(req);
      if (!stafBolehTulis(uid, b)) return kirimJson(res, 403, { code: '42501', message: 'melanggar aturan akses' });
      t.set(b.id, { dibatalkan: false, ...b, diubah: new Date().toISOString() });
      return kirimJson(res, 201);
    }
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
