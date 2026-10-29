/**
 * Pencocok jawaban anak.
 *
 * ATURAN (ditulis jelas supaya bisa diperiksa guru):
 * 1. Spasi diabaikan. Titik dianggap koma ("0.5" = "0,5"), sebab papan angka
 *    bergaya Indonesia memakai koma.
 * 2. Jawaban kosong atau `null` selalu salah.
 * 3. Soal `bilangan` dan `desimal`: jawaban harus berupa angka desimal
 *    (angka, boleh satu koma). Nilainya dibandingkan, jadi nol di depan atau
 *    di belakang koma tidak berpengaruh: "0,50" = "0,5" = ",5"; "07" = "7";
 *    "40,0" = "40". Jawaban berbentuk pecahan ("1/2") TIDAK diterima untuk
 *    soal bilangan/desimal, sebab soal meminta bentuk itu.
 * 4. Soal `pecahan`: jawaban harus berbentuk "p/q" dengan q > 0, nilainya
 *    sama dengan kunci, DAN sudah paling sederhana (FPB p dan q = 1).
 *    Semua soal pecahan di mesin ini menulis "(pecahan paling sederhana)",
 *    jadi "2/4" untuk kunci "1/2" dianggap belum tepat. Bila nilai kunci
 *    bilangan bulat, bilangan bulat biasa juga diterima.
 */
import type { BentukJawaban, SoalLancar } from './jenis';
import { fpb, samaDengan, uraiAngka } from './rasional';

/** Merapikan ketikan: buang spasi, titik menjadi koma. */
export function rapikanJawaban(teks: string): string {
  return teks.replace(/\s+/g, '').replace(/\./g, ',');
}

const POLA_DESIMAL = /^\d*(?:,\d*)?$/;
const POLA_PECAHAN = /^(\d+)\/(\d+)$/;

export function cocokJawaban(
  soal: Pick<SoalLancar, 'kunci' | 'bentukJawaban'>,
  jawabanAnak: string | null | undefined,
): boolean {
  if (jawabanAnak === null || jawabanAnak === undefined) return false;
  const jawab = rapikanJawaban(jawabanAnak);
  if (jawab === '' || !/\d/.test(jawab)) return false;
  const kunci = uraiAngka(soal.kunci);
  if (!kunci) return false;

  if (soal.bentukJawaban === 'pecahan') {
    const cocokPola = POLA_PECAHAN.exec(jawab);
    if (!cocokPola) {
      // Bilangan bulat diterima hanya bila kuncinya bilangan bulat.
      if (kunci.q !== 1 || !POLA_DESIMAL.test(jawab)) return false;
      const nilai = uraiAngka(jawab);
      return nilai !== null && samaDengan(nilai, kunci);
    }
    const p = Number(cocokPola[1]);
    const q = Number(cocokPola[2]);
    if (q === 0 || fpb(p, q) !== 1) return false;
    const nilai = uraiAngka(jawab);
    return nilai !== null && samaDengan(nilai, kunci);
  }

  if (!POLA_DESIMAL.test(jawab)) return false;
  const nilai = uraiAngka(jawab);
  return nilai !== null && samaDengan(nilai, kunci);
}

/** Tombol tambahan yang perlu ada di papan angka untuk bentuk jawaban ini. */
export function tombolTambahan(bentuk: BentukJawaban): readonly (',' | '/')[] {
  if (bentuk === 'desimal') return [','];
  if (bentuk === 'pecahan') return ['/'];
  return [];
}
