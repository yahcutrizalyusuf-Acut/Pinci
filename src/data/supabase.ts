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

export function buatPengirimSupabase(opsi: OpsiSupabase): PengirimSinkron {
  const f = opsi.fetchFn ?? fetch;
  return {
    async kirim(item) {
      const token = (await opsi.ambilToken?.()) ?? null;
      if (!token) return [];
      const keluargaId = (await opsi.ambilKeluargaId?.()) ?? null;
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
      const urutan: NamaTabel[] = ['anak', 'pengaturan_waktu', 'sesi', 'jawaban', 'kemajuan_topik', 'pesan', 'pemakaian'];
      for (const tabel of urutan) {
        const daftar = perTabel.get(tabel);
        if (!daftar?.length) continue;
        try {
          const res = await f(`${opsi.url}/rest/v1/${tabel}?on_conflict=id`, {
            method: 'POST',
            headers: {
              apikey: opsi.kunciAnon,
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Prefer: `resolution=${HANYA_TAMBAH.has(tabel) ? 'ignore' : 'merge'}-duplicates,return=minimal`,
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
