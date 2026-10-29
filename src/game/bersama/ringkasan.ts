import type { Kelas, Tingkat } from './jenis';

export type NamaGame = 'pasar' | 'ular_tangga' | 'susun_kubus' | 'tebak_kata';

/**
 * Data untuk layar Akhir babak (G07). Tanpa skor, tanpa hitungan salah, tanpa warna merah:
 * hanya hal yang sudah dikerjakan. Pesta kecil ≤ 1,5 detik urusan tampilan.
 */
export interface RingkasanBabak {
  game: NamaGame;
  kelas: Kelas;
  tingkat: Tingkat;
  /** Judul besar, mis. "Hore, selesai!". */
  judul: string;
  /** Kalimat Pinci yang hangat. */
  kalimat: string;
  /** Daftar hal yang dikerjakan, mis. ["Melayani 6 pembeli", "Menghitung kembalian 3 kali"]. */
  halDikerjakan: string[];
  /** Pilihan sesudah babak (G07). */
  pilihan: readonly ['main_lagi', 'ganti_game'];
}

export function buatRingkasan(
  game: NamaGame,
  kelas: Kelas,
  tingkat: Tingkat,
  halDikerjakan: string[],
  kalimat = 'Seru sekali tadi.',
  judul = 'Hore, selesai!',
): RingkasanBabak {
  return { game, kelas, tingkat, judul, kalimat, halDikerjakan, pilihan: ['main_lagi', 'ganti_game'] };
}
