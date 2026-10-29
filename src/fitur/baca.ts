/**
 * Baca Ulang kelas 6 (05-bahasa-indonesia.md): baca dingin → dengar contoh → baca lagi (panas) → 2 pertanyaan.
 * Kata per menit dicatat; penjaga curang membuang hasil yang terlalu cepat.
 */
import type { Sesi } from '../data/jenis';
import type { Teks } from '../isi/tka/jenis';

export const KPM_MAKS = 250;

/** Patokan kata per menit teks ini dari sasaran waktu bahan (cadangan 60 kpm untuk kelas 6). */
export function patokanKpm(t: Teks): number {
  return t.sasaranDetik ? Math.round((t.jumlahKata * 60) / t.sasaranDetik) : 60;
}

export function hitungKpm(jumlahKata: number, detik: number): number {
  return detik > 0 ? Math.round((jumlahKata * 60) / detik) : 0;
}

/** Terlalu cepat untuk benar-benar membaca: > 2 × patokan atau > 250 kpm. */
export function terlaluCepat(kpm: number, patokan: number): boolean {
  return kpm > KPM_MAKS || kpm > 2 * patokan;
}

/** Kata-kata paragraf untuk penyorotan saat contoh dibacakan. */
export function pecahKata(isi: string): string[] {
  return isi.split(/\s+/).filter(Boolean);
}

/** Teks berikutnya: yang belum pernah dibaca (urut T01…T36); setelah semua, mulai lagi dari yang paling lama. */
export function teksBerikut(semua: Teks[], sesiBaca: Sesi[]): Teks {
  const dibaca = new Map<string, string>();
  for (const s of sesiBaca) if (s.rujukan) dibaca.set(s.rujukan, s.mulai);
  const belum = semua.find((t) => !dibaca.has(t.id));
  if (belum) return belum;
  return [...semua].sort((a, b) => (dibaca.get(a.id) ?? '').localeCompare(dibaca.get(b.id) ?? ''))[0];
}

/** Rekor kpm bacaan dingin yang sah. */
export function rekorKpm(sesiBaca: Sesi[]): number | null {
  const nilai = sesiBaca.filter((s) => !s.tambahan?.curang).map((s) => Number(s.tambahan?.kpmDingin ?? 0)).filter((n) => n > 0);
  return nilai.length ? Math.max(...nilai) : null;
}
