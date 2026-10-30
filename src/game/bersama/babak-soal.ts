/**
 * Mesin babak bersama untuk game berjenjang yang berupa rangkaian soal pilihan
 * (Kebun Pinci, Lompat Batu, Balap Perahu). TypeScript murni, tanpa React.
 *
 * Aturan rasa game: tanpa kalah, tanpa nyawa, tanpa hitung mundur. Pilihan yang belum tepat
 * memantul kembali; setelah 2 kali belum tepat di soal yang sama, Pinci memberi petunjuk.
 */
import { buatAcak } from './acak';
import { BATAS_SALAH_PETUNJUK, type Kelas } from './jenis';
import { pilihKejutan, type Kejutan } from './kejutan';
import type { Level } from './level';

/** Soal pilihan: kunci sudah dihitung oleh pembuatnya. */
export interface SoalPilih {
  id: string;
  teks: string;
  jawaban: number;
  pilihan: number[];
  petunjuk: string;
}

export interface KeadaanBabakSoal {
  kelas: Kelas;
  level: Level;
  soal: readonly SoalPilih[];
  indeks: number;
  /** belum tepat di soal sekarang */
  salah: number;
  petunjuk: string | null;
  /** pilihan yang baru saja memantul (untuk gerak), atau null */
  pantul: number | null;
  /** jawaban tepat terakhir (untuk gerak maju), bertambah tiap soal */
  maju: number;
  fase: 'main' | 'selesai';
  kejutan: Kejutan | null;
  benihAcak: number;
  perkiraanDetik: number;
  catatan: { benar: number; petunjuk: number };
}

/** Perkiraan detik per langkah, untuk menjaga babak 2–4 menit. */
export const DETIK_BABAK_SOAL = { jawab: 8, pantul: 3 } as const;

export function buatBabakSoal(kelas: Kelas, level: Level, soal: readonly SoalPilih[], benih: number): KeadaanBabakSoal {
  return {
    kelas,
    level,
    soal,
    indeks: 0,
    salah: 0,
    petunjuk: null,
    pantul: null,
    maju: 0,
    fase: 'main',
    kejutan: null,
    benihAcak: benih >>> 0,
    perkiraanDetik: 0,
    catatan: { benar: 0, petunjuk: 0 },
  };
}

export function soalSekarang(k: KeadaanBabakSoal): SoalPilih {
  return k.soal[Math.min(k.indeks, k.soal.length - 1)];
}

/** Anak memilih satu jawaban. Keadaan baru dikembalikan; keadaan lama tidak diubah. */
export function jawab(k: KeadaanBabakSoal, nilai: number): KeadaanBabakSoal {
  if (k.fase === 'selesai') return k;
  const s = soalSekarang(k);
  if (!s.pilihan.includes(nilai)) return k;
  const acak = buatAcak(k.benihAcak);
  const kejutan = pilihKejutan(acak, k.kejutan);
  if (nilai !== s.jawaban) {
    const salah = k.salah + 1;
    const beriPetunjuk = salah >= BATAS_SALAH_PETUNJUK;
    return {
      ...k,
      salah,
      pantul: nilai,
      petunjuk: beriPetunjuk ? s.petunjuk : k.petunjuk,
      kejutan,
      benihAcak: acak.keadaan,
      perkiraanDetik: k.perkiraanDetik + DETIK_BABAK_SOAL.pantul,
      catatan: { ...k.catatan, petunjuk: k.catatan.petunjuk + (beriPetunjuk && !k.petunjuk ? 1 : 0) },
    };
  }
  const indeks = k.indeks + 1;
  return {
    ...k,
    indeks,
    salah: 0,
    petunjuk: null,
    pantul: null,
    maju: k.maju + 1,
    fase: indeks >= k.soal.length ? 'selesai' : 'main',
    kejutan,
    benihAcak: acak.keadaan,
    perkiraanDetik: k.perkiraanDetik + DETIK_BABAK_SOAL.jawab,
    catatan: { ...k.catatan, benar: k.catatan.benar + 1 },
  };
}

/** Sisa soal yang belum dijawab. */
export function sisaSoal(k: KeadaanBabakSoal): number {
  return Math.max(0, k.soal.length - k.indeks);
}
