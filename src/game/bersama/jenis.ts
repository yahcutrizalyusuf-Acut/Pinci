/** Jenis data bersama untuk keempat game. Murni data, tanpa React. */

export type Kelas = 1 | 2 | 3 | 4 | 5 | 6;
export type Tingkat = 'santai' | 'seru';

/** Kelompok isi: kelas 1–2 (awal), 3–4 (tengah), 5–6 (atas). */
export type KelompokKelas = 'awal' | 'tengah' | 'atas';

export interface OpsiBabakDasar {
  kelas: Kelas;
  tingkat: Tingkat;
  /** Benih acak. Benih sama → babak sama persis. */
  benih: number;
}

/** Setelah sekian kali belum tepat pada langkah yang sama, Pinci memberi petunjuk. */
export const BATAS_SALAH_PETUNJUK = 2;

/** Rentang lama babak yang dituju (detik): 2–4 menit. */
export const DETIK_BABAK_MIN = 120;
export const DETIK_BABAK_MAKS = 240;

export const SEMUA_KELAS: readonly Kelas[] = [1, 2, 3, 4, 5, 6];
export const SEMUA_TINGKAT: readonly Tingkat[] = ['santai', 'seru'];

export function kelompokKelas(kelas: Kelas): KelompokKelas {
  if (kelas <= 2) return 'awal';
  if (kelas <= 4) return 'tengah';
  return 'atas';
}

/** Kelas 1–2 hanya ketuk. Kelas 3–6 boleh seret (dengan magnet). Logika tidak pernah mensyaratkan seret. */
export function bolehSeret(kelas: Kelas): boolean {
  return kelas >= 3;
}

/** Format uang gaya layar: 3000 → "Rp3.000". */
export function formatRupiah(n: number): string {
  return 'Rp' + formatAngka(n);
}

/** 12500 → "12.500". */
export function formatAngka(n: number): string {
  const tanda = n < 0 ? '−' : '';
  return tanda + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
