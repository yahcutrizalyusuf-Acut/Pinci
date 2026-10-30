/**
 * Logika Lompat Batu. TypeScript murni, tanpa React.
 * Pinci menyeberangi sungai lewat baris-baris batu. Tiap baris punya satu batu yang tepat:
 * hasil soal hitung, atau bilangan yang memenuhi aturan (genap, ganjil, kelipatan, lebih dari).
 * Batu yang belum tepat bergoyang (Pinci tidak jatuh). Sampai seberang = babak selesai.
 */
import { buatAcak, type PembangkitAcak } from '../bersama/acak';
import { buatBabakSoal, jawab, type KeadaanBabakSoal, type SoalPilih } from '../bersama/babak-soal';
import { kelompokKelas, type Kelas } from '../bersama/jenis';
import { tingkatDariLevel, type Level } from '../bersama/level';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';
import { buatSoalHitung } from '../bersama/soal';

export const BARIS_BATU: Record<Level, number> = { 1: 5, 2: 6, 3: 7, 4: 8, 5: 10 };
export const BATU_PER_BARIS: Record<Level, number> = { 1: 2, 2: 3, 3: 3, 4: 3, 5: 4 };

export type JenisAturan = 'genap' | 'ganjil' | 'kelipatan' | 'lebih';

export interface Aturan {
  jenis: JenisAturan;
  /** kelipatan berapa, atau batas "lebih dari" */
  n: number;
}

/** Kunci aturan dihitung kode. */
export function memenuhi(a: Aturan, x: number): boolean {
  switch (a.jenis) {
    case 'genap':
      return x % 2 === 0;
    case 'ganjil':
      return x % 2 === 1;
    case 'kelipatan':
      return x % a.n === 0;
    case 'lebih':
      return x > a.n;
  }
}

function teksAturan(a: Aturan): string {
  switch (a.jenis) {
    case 'genap':
      return 'Lompat ke bilangan genap';
    case 'ganjil':
      return 'Lompat ke bilangan ganjil';
    case 'kelipatan':
      return `Lompat ke kelipatan ${a.n}`;
    case 'lebih':
      return `Lompat ke bilangan lebih dari ${a.n}`;
  }
}

function petunjukAturan(a: Aturan): string {
  switch (a.jenis) {
    case 'genap':
      return 'Bilangan genap berakhiran 0, 2, 4, 6, atau 8.';
    case 'ganjil':
      return 'Bilangan ganjil berakhiran 1, 3, 5, 7, atau 9.';
    case 'kelipatan':
      return `Kelipatan ${a.n} bisa dibagi ${a.n} tanpa sisa. Coba hitung lompat ${a.n}-${a.n}.`;
    case 'lebih':
      return `Cari bilangan yang lebih besar dari ${a.n}.`;
  }
}

/** Satu baris aturan dengan tepat satu batu yang memenuhi. */
export function buatBarisAturan(acak: PembangkitAcak, kelas: Kelas, level: Level, nBatu: number, id: string): SoalPilih {
  const kelompok = kelompokKelas(kelas);
  const maks = kelompok === 'awal' ? (level <= 2 ? 20 : 50) : kelompok === 'tengah' ? 100 : 200;
  const calonAturan: Aturan[] = [{ jenis: 'genap', n: 2 }, { jenis: 'ganjil', n: 2 }, { jenis: 'lebih', n: acak.bulat(Math.floor(maks / 4), Math.floor(maks / 2)) }];
  if (kelompok !== 'awal' || level >= 4) calonAturan.push({ jenis: 'kelipatan', n: acak.pilih(kelompok === 'atas' ? [3, 4, 6, 7, 9] : [2, 3, 5, 10]) });
  const aturan = acak.pilih(calonAturan);
  let jawaban = acak.bulat(1, maks);
  for (let i = 0; i < 200 && !memenuhi(aturan, jawaban); i++) jawaban = acak.bulat(1, maks);
  const pengecoh: number[] = [];
  for (let i = 0; i < 500 && pengecoh.length < nBatu - 1; i++) {
    const x = acak.bulat(1, maks);
    if (!memenuhi(aturan, x) && !pengecoh.includes(x)) pengecoh.push(x);
  }
  return { id, teks: teksAturan(aturan), jawaban, pilihan: acak.acakUrutan([jawaban, ...pengecoh]), petunjuk: petunjukAturan(aturan) };
}

export interface KeadaanLompatBatu extends KeadaanBabakSoal {
  game: 'lompat_batu';
}

export type AksiLompatBatu = { jenis: 'jawab'; nilai: number };

export function buatBabak(opsi: { kelas: Kelas; level: Level; benih: number }): KeadaanLompatBatu {
  const acak = buatAcak(opsi.benih);
  const n = BARIS_BATU[opsi.level];
  const nBatu = BATU_PER_BARIS[opsi.level];
  // Baris genap: soal hitung; baris ganjil: aturan bilangan. Selang-seling supaya tidak bosan.
  const soal: SoalPilih[] = Array.from({ length: n }, (_, i) =>
    i % 2 === 0 ? buatSoalHitung(acak, opsi.kelas, opsi.level, nBatu, `batu-${i + 1}`) : buatBarisAturan(acak, opsi.kelas, opsi.level, nBatu, `batu-${i + 1}`),
  );
  return { ...buatBabakSoal(opsi.kelas, opsi.level, soal, acak.keadaan), game: 'lompat_batu' };
}

export function langkah(k: KeadaanLompatBatu, aksi: AksiLompatBatu): KeadaanLompatBatu {
  const baru = jawab(k, aksi.nilai);
  return baru === k ? k : { ...baru, game: 'lompat_batu' };
}

export function ringkasan(k: KeadaanLompatBatu): RingkasanBabak {
  const hal = [`Melompati ${k.catatan.benar} batu`, 'Sampai di seberang sungai'];
  return { ...buatRingkasan('lompat_batu', k.kelas, tingkatDariLevel(k.level), hal, 'Pinci sampai di seberang. Lompatanmu hebat!', 'Sampai seberang!'), level: k.level };
}
