/**
 * Logika Balap Perahu. TypeScript murni, tanpa React.
 * Perahu Pinci maju satu kayuhan setiap jawaban tepat. Perahu teman (Rangkong) berlayar santai
 * dan selalu menunggu di garis akhir: tidak ada yang kalah, sampai bersama lalu merayakan.
 * Tanpa hitung mundur. Level menambah jarak dan tingkat soal.
 */
import { buatAcak } from '../bersama/acak';
import { buatBabakSoal, jawab, type KeadaanBabakSoal } from '../bersama/babak-soal';
import type { Kelas } from '../bersama/jenis';
import { tingkatDariLevel, type Level } from '../bersama/level';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';
import { buatDaftarSoal } from '../bersama/soal';

export const JARAK_PERAHU: Record<Level, number> = { 1: 5, 2: 6, 3: 8, 4: 10, 5: 12 };
export const PILIHAN_PERAHU: Record<Level, number> = { 1: 3, 2: 3, 3: 3, 4: 4, 5: 4 };

export interface KeadaanPerahu extends KeadaanBabakSoal {
  game: 'perahu';
}

export type AksiPerahu = { jenis: 'jawab'; nilai: number };

export function buatBabak(opsi: { kelas: Kelas; level: Level; benih: number }): KeadaanPerahu {
  const acak = buatAcak(opsi.benih);
  const soal = buatDaftarSoal(acak, opsi.kelas, opsi.level, JARAK_PERAHU[opsi.level], PILIHAN_PERAHU[opsi.level]);
  return { ...buatBabakSoal(opsi.kelas, opsi.level, soal, acak.keadaan), game: 'perahu' };
}

export function langkah(k: KeadaanPerahu, aksi: AksiPerahu): KeadaanPerahu {
  const baru = jawab(k, aksi.nilai);
  return baru === k ? k : { ...baru, game: 'perahu' };
}

/** Posisi perahu Pinci, 0 (garis mulai) sampai 1 (garis akhir). */
export function posisiPinci(k: KeadaanPerahu): number {
  return k.maju / k.soal.length;
}

/**
 * Posisi perahu teman: berlayar santai, sedikit di belakang Pinci, lalu sampai bersama di akhir.
 * Tidak pernah mendahului jauh, tidak pernah ditinggal jauh.
 */
export function posisiTeman(k: KeadaanPerahu): number {
  if (k.fase === 'selesai') return 1;
  const p = posisiPinci(k);
  return Math.max(0, Math.min(0.95, p - 0.08 + 0.04 * (k.indeks % 2)));
}

export function ringkasan(k: KeadaanPerahu): RingkasanBabak {
  const hal = [`Mendayung ${k.catatan.benar} kali sampai garis akhir`, 'Sampai bersama Rangkong'];
  return { ...buatRingkasan('perahu', k.kelas, tingkatDariLevel(k.level), hal, 'Kalian sampai bersama. Seru sekali!', 'Sampai!'), level: k.level };
}
