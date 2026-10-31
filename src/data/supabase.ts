/**
 * Adaptor Supabase (Singapura). Mati selama EXPO_PUBLIC_DATA_MODE=lokal (bawaan).
 * Memakai REST bawaan Supabase (PostgREST + GoTrue) lewat fetch, tanpa pustaka tambahan.
 *
 * - Kirim: baris lokal (camelCase) diubah ke kolom server (snake_case) + keluarga_id, lalu upsert.
 *   Sesi dan jawaban "abaikan kalau sudah ada" (hanya ditambah); tabel lain "timpa" (status terbaru).
 * - Masuk orang tua: email + kode 6 angka (02-akun-keluarga.md).
 * Skema dan RLS: supabase/migrations/.
 */
import type { NamaTabel } from './jenis';
import type { PengirimSinkron } from './repositori';

export interface OpsiSupabase {
  url: string;
  kunciAnon: string;
  fetchFn?: typeof fetch;
  /** token akses orang tua (atau perangkat anak); tanpa token, kiriman ditolak RLS */
  ambilToken?: () => Promise<string | null>;
  /** keluarga pemilik baris (ditambahkan ke setiap baris yang dikirim) */
  ambilKeluargaId?: () => Promise<string | null>;
  /** peran HP ini. "anak" = HP anak yang dihubungkan dengan kode (hak lebih sempit di server). Bawaan "ortu". */
  ambilPeran?: () => Promise<'ortu' | 'anak'>;
  /** id pengguna masuk (HP anak: pengguna anonim yang tercatat di tabel perangkat) */
  ambilPenggunaId?: () => Promise<string | null>;
}

/** Kolom yang diterima server per tabel (supabase/migrations/20261029000000_skema_awal.sql). */
const KOLOM: Partial<Record<NamaTabel, string[]>> = {
  anak: ['id', 'keluarga_id', 'nama', 'kelas', 'hewan', 'tingkat_inggris', 'dibuat'],
  sesi: ['id', 'keluarga_id', 'anak_id', 'jenis', 'mode', 'kelas', 'level', 'rujukan', 'mulai', 'selesai', 'durasi_detik', 'benih', 'hasil', 'benar', 'jumlah', 'perasaan', 'urutan_hp', 'tambahan'],
  jawaban: ['id', 'keluarga_id', 'sesi_id', 'anak_id', 'urutan', 'soal', 'butir_id', 'kunci', 'jawaban', 'benar', 'detik', 'hapus_n', 'ulang', 'kode_salah', 'topik', 'petunjuk_dipakai'],
  kemajuan_topik: ['id', 'keluarga_id', 'anak_id', 'mapel', 'topik', 'status', 'benar', 'salah', 'petunjuk', 'terakhir', 'tanda', 'alasan'],
  pesan: ['id', 'keluarga_id', 'anak_id', 'dari', 'jenis', 'isi', 'waktu', 'dibaca'],
  pengaturan_waktu: ['id', 'keluarga_id', 'anak_id', 'belajar_menit', 'game_menit', 'game_setelah_inti', 'jam_tenang', 'jam_bangun', 'bunyi'],
  pemakaian: ['id', 'keluarga_id', 'anak_id', 'tanggal', 'belajar_detik', 'main_detik', 'blok_detik', 'istirahat_sampai', 'inti_selesai'],
};

/** Kolom lokal (camelCase) per tabel yang ditarik dari server. Kolom server lain (keluarga_id, diubah, …) dibuang. */
const KUNCI_LOKAL: Partial<Record<NamaTabel, string[]>> = {
  anak: ['id', 'keluarga_id', 'nama', 'kelas', 'hewan', 'dibuat', 'tingkatInggris'],
  sesi: ['id', 'anak_id', 'jenis', 'mode', 'kelas', 'level', 'rujukan', 'mulai', 'selesai', 'durasiDetik', 'benih', 'hasil', 'benar', 'jumlah', 'perasaan', 'urutanHp', 'tambahan'],
  jawaban: ['id', 'sesi_id', 'anak_id', 'urutan', 'soal', 'butirId', 'kunci', 'jawaban', 'benar', 'detik', 'hapusN', 'ulang', 'kodeSalah', 'topik', 'petunjukDipakai'],
  kemajuan_topik: ['id', 'anak_id', 'mapel', 'topik', 'status', 'benar', 'salah', 'petunjuk', 'terakhir', 'tanda', 'alasan'],
  pesan: ['id', 'keluarga_id', 'anak_id', 'dari', 'jenis', 'isi', 'waktu', 'dibaca'],
  pengaturan_waktu: ['id', 'anak_id', 'belajarMenit', 'gameMenit', 'gameSetelahInti', 'jamTenang', 'jamBangun', 'bunyi'],
  pemakaian: ['id', 'anak_id', 'tanggal', 'belajarDetik', 'mainDetik', 'blokDetik', 'istirahatSampai', 'intiSelesai'],
};

/** Kolom berisi waktu: dirapikan ke ISO supaya urutan teks sama dengan urutan waktu. */
const KOLOM_WAKTU: Partial<Record<NamaTabel, string[]>> = {
  anak: ['dibuat'],
  sesi: ['mulai', 'selesai'],
  pesan: ['waktu', 'dibaca'],
  pemakaian: ['istirahatSampai'],
  kemajuan_topik: ['terakhir'],
};

/** Ubah baris server (snake_case) menjadi baris lokal. Kolom kosong (null) dibuang. */
export function keLokal(tabel: NamaTabel, baris: Record<string, unknown>): Record<string, unknown> | null {
  const kunci = KUNCI_LOKAL[tabel];
  if (!kunci) return null;
  const peta = new Map(kunci.map((k) => [keSnake(k), k]));
  const waktu = new Set(KOLOM_WAKTU[tabel] ?? []);
  const hasil: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(baris)) {
    const lokal = peta.get(k);
    if (!lokal || v === null || v === undefined) continue;
    hasil[lokal] = waktu.has(lokal) && typeof v === 'string' ? new Date(v).toISOString() : v;
  }
  return hasil;
}

/** Tabel yang barisnya tidak pernah berubah: kiriman ulang diabaikan. */
const HANYA_TAMBAH = new Set<NamaTabel>(['sesi', 'jawaban']);

export function keSnake(nama: string): string {
  return nama.replace(/[A-Z]/g, (h) => `_${h.toLowerCase()}`);
}

/** Ubah baris lokal ke bentuk server: snake_case, hanya kolom yang dikenal, ditambah keluarga_id. */
export function barisServer(tabel: NamaTabel, baris: object, keluargaId: string | null): Record<string, unknown> | null {
  const kolom = KOLOM[tabel];
  if (!kolom) return null;
  const hasil: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(baris)) {
    const s = keSnake(k);
    if (kolom.includes(s) && v !== undefined) hasil[s] = v;
  }
  if (kolom.includes('keluarga_id') && !hasil.keluarga_id && keluargaId) hasil.keluarga_id = keluargaId;
  return hasil;
}

/** Kolom waktu yang dipakai sebagai kursor tarik per tabel. */
function kolomKursor(tabel: NamaTabel): string {
  return tabel === 'sesi' ? 'diterima_server' : 'diubah';
}

const URUTAN_KIRIM: NamaTabel[] = ['anak', 'pengaturan_waktu', 'sesi', 'jawaban', 'kemajuan_topik', 'pesan', 'pemakaian'];

export function buatPengirimSupabase(opsi: OpsiSupabase): PengirimSinkron {
  const f = opsi.fetchFn ?? fetch;
  return {
    async kirim(item) {
      const token = (await opsi.ambilToken?.()) ?? null;
      if (!token) return [];
      const keluargaId = (await opsi.ambilKeluargaId?.()) ?? null;
      const hpAnak = (await opsi.ambilPeran?.()) === 'anak';
      const perTabel = new Map<NamaTabel, { idAntrean: string; baris: Record<string, unknown> }[]>();
      for (const i of item) {
        const b = barisServer(i.antrean.tabel, i.baris, keluargaId);
        if (!b) continue;
        const d = perTabel.get(i.antrean.tabel) ?? [];
        d.push({ idAntrean: i.antrean.id, baris: b });
        perTabel.set(i.antrean.tabel, d);
      }
      const diterima: string[] = [];
      // Urutan penting untuk kunci asing: anak dulu, sesi sebelum jawaban.
      for (const tabel of URUTAN_KIRIM) {
        let daftar = perTabel.get(tabel);
        if (!daftar?.length) continue;
        if (hpAnak && (tabel === 'anak' || tabel === 'pengaturan_waktu')) continue; // HP anak hanya membaca profil dan pengaturan
        if (hpAnak && tabel === 'pesan') {
          // HP anak hanya mengirim stiknya sendiri; pesan orang tua hanya boleh ditandai dibaca (fungsi khusus di server).
          const dariOrtu = daftar.filter((d) => d.baris.dari === 'orang_tua');
          daftar = daftar.filter((d) => d.baris.dari === 'anak');
          const dibaca = dariOrtu.filter((d) => d.baris.dibaca);
          if (dibaca.length) {
            try {
              const waktu = dibaca.map((d) => String(d.baris.dibaca)).sort()[0];
              const res = await f(`${opsi.url}/rest/v1/rpc/tandai_pesan_dibaca`, {
                method: 'POST',
                headers: kepala(opsi, token),
                body: JSON.stringify({ p_ids: dibaca.map((d) => d.baris.id), p_waktu: waktu }),
              });
              if (res.ok) diterima.push(...dariOrtu.map((d) => d.idAntrean));
            } catch {
              // dicoba lagi nanti
            }
          } else {
            diterima.push(...dariOrtu.map((d) => d.idAntrean));
          }
          if (!daftar.length) continue;
        }
        const abaikan = HANYA_TAMBAH.has(tabel) || (hpAnak && tabel === 'pesan');
        try {
          const res = await f(`${opsi.url}/rest/v1/${tabel}?on_conflict=id`, {
            method: 'POST',
            headers: {
              apikey: opsi.kunciAnon,
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Prefer: `resolution=${abaikan ? 'ignore' : 'merge'}-duplicates,return=minimal`,
            },
            body: JSON.stringify(daftar.map((d) => d.baris)),
          });
          if (res.ok) diterima.push(...daftar.map((d) => d.idAntrean));
          else if (tabel === 'sesi') break; // jawaban butuh sesinya; coba lagi nanti
        } catch {
          if (tabel === 'sesi') break;
        }
      }
      return diterima;
    },

    async tarik(tabel, { sejak, offset, batas }) {
      if (!KUNCI_LOKAL[tabel]) return { baris: [], kursorMaks: null };
      const token = (await opsi.ambilToken?.()) ?? null;
      if (!token) throw new Error('belum masuk');
      const kolom = kolomKursor(tabel);
      const saring = sejak ? `&${kolom}=gte.${encodeURIComponent(sejak)}` : '';
      const res = await f(`${opsi.url}/rest/v1/${tabel}?select=*${saring}&order=${kolom}.asc,id.asc&limit=${batas}&offset=${offset}`, { headers: kepala(opsi, token) });
      if (!res.ok) throw new Error(`tarik ${tabel} gagal`);
      const data = (await res.json()) as Record<string, unknown>[];
      let kursorMaks: string | null = null;
      const baris: object[] = [];
      for (const d of data) {
        const b = keLokal(tabel, d);
        if (b) baris.push(b);
        const w = d[kolom];
        if (typeof w === 'string' && (kursorMaks === null || Date.parse(w) > Date.parse(kursorMaks))) kursorMaks = w;
      }
      return { baris, kursorMaks: kursorMaks === null ? null : new Date(kursorMaks).toISOString() };
    },

    async jawabanUntuk(sesiIds) {
      const token = (await opsi.ambilToken?.()) ?? null;
      if (!token) throw new Error('belum masuk');
      const hasil: object[] = [];
      // Sepuluh sesi sekali minta; server membatasi 1000 baris sekali jawab, jadi dibaca per halaman.
      for (let i = 0; i < sesiIds.length; i += 10) {
        const ids = sesiIds.slice(i, i + 10).join(',');
        for (let offset = 0; ; offset += 1000) {
          const res = await f(`${opsi.url}/rest/v1/jawaban?select=*&sesi_id=in.(${ids})&order=id.asc&limit=1000&offset=${offset}`, { headers: kepala(opsi, token) });
          if (!res.ok) throw new Error('tarik jawaban gagal');
          const data = (await res.json()) as Record<string, unknown>[];
          for (const d of data) {
            const b = keLokal('jawaban', d);
            if (b) hasil.push(b);
          }
          if (data.length < 1000) break;
        }
      }
      return hasil;
    },

    async catatSinkron(sisaAntrean) {
      if ((await opsi.ambilPeran?.()) !== 'anak') return;
      const token = (await opsi.ambilToken?.()) ?? null;
      if (!token) return;
      await f(`${opsi.url}/rest/v1/rpc/catat_sinkron`, { method: 'POST', headers: kepala(opsi, token), body: JSON.stringify({ p_antrean: sisaAntrean }) });
    },

    async perangkatDiputus() {
      if ((await opsi.ambilPeran?.()) !== 'anak') return false;
      const token = (await opsi.ambilToken?.()) ?? null;
      const uid = (await opsi.ambilPenggunaId?.()) ?? null;
      if (!token || !uid) return false;
      const res = await f(`${opsi.url}/rest/v1/perangkat?select=diputus&id=eq.${encodeURIComponent(uid)}`, { headers: kepala(opsi, token) });
      if (!res.ok) return false;
      const data = (await res.json()) as { diputus: boolean }[];
      return data[0]?.diputus === true;
    },
  };
}

// ---------- masuk orang tua: email + kode 6 angka ----------

export interface Sesimasuk {
  tokenAkses: string;
  tokenSegar: string;
  penggunaId: string;
  berakhir: number;
}

function kepala(opsi: OpsiSupabase, token?: string): Record<string, string> {
  return { apikey: opsi.kunciAnon, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

/** Kirim kode 6 angka ke email orang tua. */
export async function mintaKodeEmail(opsi: OpsiSupabase, email: string): Promise<boolean> {
  const f = opsi.fetchFn ?? fetch;
  const res = await f(`${opsi.url}/auth/v1/otp`, { method: 'POST', headers: kepala(opsi), body: JSON.stringify({ email: email.trim().toLowerCase(), create_user: true }) });
  return res.ok;
}

/** Periksa kode; berhasil → sesi masuk. */
export async function verifikasiKode(opsi: OpsiSupabase, email: string, kode: string): Promise<Sesimasuk | null> {
  const f = opsi.fetchFn ?? fetch;
  const res = await f(`${opsi.url}/auth/v1/verify`, { method: 'POST', headers: kepala(opsi), body: JSON.stringify({ type: 'email', email: email.trim().toLowerCase(), token: kode.trim() }) });
  if (!res.ok) return null;
  const d = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number; user: { id: string } };
  return { tokenAkses: d.access_token, tokenSegar: d.refresh_token, penggunaId: d.user.id, berakhir: Date.now() + d.expires_in * 1000 };
}

/** Perbarui token akses sebelum berakhir. */
export async function segarkanSesi(opsi: OpsiSupabase, tokenSegar: string): Promise<Sesimasuk | null> {
  const f = opsi.fetchFn ?? fetch;
  const res = await f(`${opsi.url}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: kepala(opsi), body: JSON.stringify({ refresh_token: tokenSegar }) });
  if (!res.ok) return null;
  const d = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number; user: { id: string } };
  return { tokenAkses: d.access_token, tokenSegar: d.refresh_token, penggunaId: d.user.id, berakhir: Date.now() + d.expires_in * 1000 };
}

/** Pertama kali masuk: daftarkan keluarga (dibuat di HP) dan orang tua pemilik lewat fungsi server atomik. */
export async function daftarkanKeluarga(opsi: OpsiSupabase, sesi: Sesimasuk, keluarga: { id: string; sapaanOrtu: string }): Promise<boolean> {
  const f = opsi.fetchFn ?? fetch;
  const res = await f(`${opsi.url}/rest/v1/rpc/daftarkan_keluarga`, {
    method: 'POST',
    headers: kepala(opsi, sesi.tokenAkses),
    body: JSON.stringify({ p_id: keluarga.id, p_sapaan: keluarga.sapaanOrtu }),
  });
  if (!res.ok) return false;
  return (await res.json()) === true;
}

// ---------- hubungkan HP anak dengan kode 6 angka ----------

/** HP anak masuk anonim (tanpa email). Perlu "Allow anonymous sign-ins" menyala di Supabase. */
export async function masukAnonim(opsi: OpsiSupabase): Promise<Sesimasuk | null> {
  const f = opsi.fetchFn ?? fetch;
  const res = await f(`${opsi.url}/auth/v1/signup`, { method: 'POST', headers: kepala(opsi), body: JSON.stringify({ data: {} }) });
  if (!res.ok) return null;
  const d = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number; user: { id: string } };
  if (!d.access_token || !d.user?.id) return null;
  return { tokenAkses: d.access_token, tokenSegar: d.refresh_token, penggunaId: d.user.id, berakhir: Date.now() + d.expires_in * 1000 };
}

export type HasilTukarKode =
  | { ok: true; keluargaId: string; sapaan: string; anakIds: string[] }
  | { ok: false; alasan: 'salah' | 'terlalu_sering' | 'akun_orang_tua' | 'jaringan' };

/** HP anak: tukar kode dari HP orang tua dengan akses ke anak yang dipilih. */
export async function tukarKodeHubung(opsi: OpsiSupabase, kode: string, versi: string): Promise<HasilTukarKode> {
  const f = opsi.fetchFn ?? fetch;
  const token = (await opsi.ambilToken?.()) ?? null;
  if (!token) return { ok: false, alasan: 'jaringan' };
  try {
    const res = await f(`${opsi.url}/rest/v1/rpc/tukar_kode_hubung`, { method: 'POST', headers: kepala(opsi, token), body: JSON.stringify({ p_kode: kode.trim(), p_versi: versi }) });
    if (!res.ok) return { ok: false, alasan: 'jaringan' };
    const d = (await res.json()) as { ok: boolean; alasan?: string; keluarga_id?: string; sapaan?: string; anak_ids?: string[] };
    if (d.ok && d.keluarga_id) return { ok: true, keluargaId: d.keluarga_id, sapaan: d.sapaan ?? 'Ayah', anakIds: d.anak_ids ?? [] };
    const alasan = d.alasan === 'terlalu_sering' || d.alasan === 'akun_orang_tua' ? d.alasan : 'salah';
    return { ok: false, alasan };
  } catch {
    return { ok: false, alasan: 'jaringan' };
  }
}

export type HasilBuatKode = { ok: true; kode: string; berlakuSampai: string } | { ok: false; alasan: 'anak_belum_terkirim' | 'belum_masuk' | 'jaringan' };

/** Orang tua: buat kode 6 angka (berlaku 10 menit) untuk satu atau beberapa anak. */
export async function buatKodeHubung(opsi: OpsiSupabase, anakIds: string[]): Promise<HasilBuatKode> {
  const f = opsi.fetchFn ?? fetch;
  const token = (await opsi.ambilToken?.()) ?? null;
  if (!token) return { ok: false, alasan: 'belum_masuk' };
  try {
    const res = await f(`${opsi.url}/rest/v1/rpc/buat_kode_hubung`, { method: 'POST', headers: kepala(opsi, token), body: JSON.stringify({ p_anak_ids: anakIds }) });
    if (res.status === 400) return { ok: false, alasan: 'anak_belum_terkirim' };
    if (res.status === 401 || res.status === 403) return { ok: false, alasan: 'belum_masuk' };
    if (!res.ok) return { ok: false, alasan: 'jaringan' };
    const d = (await res.json()) as { kode: string; berlaku_sampai: string };
    return { ok: true, kode: d.kode, berlakuSampai: d.berlaku_sampai };
  } catch {
    return { ok: false, alasan: 'jaringan' };
  }
}

export interface PerangkatAnak {
  id: string;
  anakIds: string[];
  terakhirSinkron: string | null;
  antreanBelumKirim: number;
  versiAplikasi: string | null;
  diputus: boolean;
}

/** Orang tua: daftar HP anak yang pernah dihubungkan (yang diputus tetap tampil, bertanda). */
export async function daftarPerangkat(opsi: OpsiSupabase): Promise<PerangkatAnak[] | null> {
  const f = opsi.fetchFn ?? fetch;
  const token = (await opsi.ambilToken?.()) ?? null;
  if (!token) return null;
  try {
    const res = await f(`${opsi.url}/rest/v1/perangkat?select=id,anak_ids,terakhir_sinkron,antrean_belum_kirim,versi_aplikasi,diputus&jenis=eq.anak&order=terakhir_sinkron.desc.nullslast`, { headers: kepala(opsi, token) });
    if (!res.ok) return null;
    const data = (await res.json()) as { id: string; anak_ids: string[]; terakhir_sinkron: string | null; antrean_belum_kirim: number; versi_aplikasi: string | null; diputus: boolean }[];
    return data.map((d) => ({
      id: d.id,
      anakIds: d.anak_ids,
      terakhirSinkron: d.terakhir_sinkron ? new Date(d.terakhir_sinkron).toISOString() : null,
      antreanBelumKirim: d.antrean_belum_kirim,
      versiAplikasi: d.versi_aplikasi,
      diputus: d.diputus,
    }));
  } catch {
    return null;
  }
}

/** Orang tua: putuskan satu HP anak. HP itu tidak bisa lagi membaca atau mengirim data. */
export async function putuskanPerangkat(opsi: OpsiSupabase, id: string): Promise<boolean> {
  const f = opsi.fetchFn ?? fetch;
  const token = (await opsi.ambilToken?.()) ?? null;
  if (!token) return false;
  try {
    const res = await f(`${opsi.url}/rest/v1/perangkat?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...kepala(opsi, token), Prefer: 'return=minimal' },
      body: JSON.stringify({ diputus: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
