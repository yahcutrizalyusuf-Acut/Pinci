/**
 * Logika Kebun Pinci. TypeScript murni, tanpa React.
 * Setiap petak tanah punya satu soal hitung. Anak memilih kaleng air berangka yang tepat;
 * tanaman tumbuh di petak itu. Semua petak tumbuh = kebun mekar = babak selesai.
 * Level menambah petak, pilihan, dan tingkat soal.
 */
import { buatAcak } from '../bersama/acak';
import { buatBabakSoal, jawab, type KeadaanBabakSoal } from '../bersama/babak-soal';
import type { Kelas } from '../bersama/jenis';
import { tingkatDariLevel, type Level } from '../bersama/level';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';
import { buatDaftarSoal } from '../bersama/soal';

export const PETAK_KEBUN: Record<Level, number> = { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8 };
export const PILIHAN_KEBUN: Record<Level, number> = { 1: 2, 2: 3, 3: 3, 4: 4, 5: 4 };
export const TANAMAN = ['🌻', '🌷', '🌽', '🍅', '🥕', '🌼', '🍆', '🥬'] as const;

export interface KeadaanKebun extends KeadaanBabakSoal {
  game: 'kebun';
  /** tanaman yang akan tumbuh di tiap petak */
  tanaman: readonly string[];
}

export type AksiKebun = { jenis: 'jawab'; nilai: number };

export function buatBabak(opsi: { kelas: Kelas; level: Level; benih: number }): KeadaanKebun {
  const acak = buatAcak(opsi.benih);
  const n = PETAK_KEBUN[opsi.level];
  const soal = buatDaftarSoal(acak, opsi.kelas, opsi.level, n, PILIHAN_KEBUN[opsi.level]);
  const tanaman = acak.ambilBeberapa(TANAMAN, n);
  return { ...buatBabakSoal(opsi.kelas, opsi.level, soal, acak.keadaan), game: 'kebun', tanaman };
}

export function langkah(k: KeadaanKebun, aksi: AksiKebun): KeadaanKebun {
  const baru = jawab(k, aksi.nilai);
  return baru === k ? k : { ...baru, game: 'kebun', tanaman: k.tanaman };
}

export function ringkasan(k: KeadaanKebun): RingkasanBabak {
  const hal = [`Menanam ${k.catatan.benar} tanaman`, `Menghitung ${k.catatan.benar} soal`];
  return { ...buatRingkasan('kebun', k.kelas, tingkatDariLevel(k.level), hal, 'Kebunnya mekar. Terima kasih sudah menyiram!', 'Kebun mekar!'), level: k.level };
}
