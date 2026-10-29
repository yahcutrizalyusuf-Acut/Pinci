import type {
  BagianPenjelasan,
  ContohJadi,
  GambarSederhana,
  KartuIlmu,
  PetunjukBertahap,
  SoalKartu,
  TingkatSoal,
} from '../jenis';

/**
 * Alat bantu menulis kartu ilmu. Dipakai oleh scripts/buat-gudang.ts, tidak dimuat aplikasi.
 * id soal, id kartu, tingkat, dan status diisi otomatis supaya penulisan tetap ringkas.
 */

export type SoalMentah = Omit<SoalKartu, 'id' | 'tingkat'>;

export interface Tambahan {
  hitung?: string;
  bacaan?: string;
  gambar?: GambarSederhana;
}

/** Soal pilihan ganda. `benar` = indeks pilihan yang benar (mulai 0). */
export function pg(
  pertanyaan: string,
  pilihan: string[],
  benar: number,
  petunjuk: PetunjukBertahap,
  pembahasan: string,
  tambahan: Tambahan | string = {},
): SoalMentah {
  const kunci = pilihan[benar];
  if (kunci === undefined) throw new Error(`Indeks kunci ${benar} di luar pilihan: ${pertanyaan}`);
  const t: Tambahan = typeof tambahan === 'string' ? { hitung: tambahan } : tambahan;
  return { ...isiTambahan(t), pertanyaan, bentuk: 'pg', pilihan, kunci, petunjuk, pembahasan };
}

/** Soal isian singkat. `kunci` ditulis dengan tulisan bilangan Indonesia. */
export function isian(
  pertanyaan: string,
  kunci: string,
  petunjuk: PetunjukBertahap,
  pembahasan: string,
  tambahan: Tambahan | string = {},
): SoalMentah {
  const t: Tambahan = typeof tambahan === 'string' ? { hitung: tambahan } : tambahan;
  return { ...isiTambahan(t), pertanyaan, bentuk: 'isian', kunci, petunjuk, pembahasan };
}

function isiTambahan(t: Tambahan): Partial<SoalMentah> {
  const hasil: Partial<SoalMentah> = {};
  if (t.bacaan !== undefined) hasil.bacaan = t.bacaan;
  if (t.gambar !== undefined) hasil.gambar = t.gambar;
  if (t.hitung !== undefined) hasil.hitung = t.hitung;
  return hasil;
}

export function contoh(soal: string, langkah: string[], jawaban: string): ContohJadi {
  return { soal, langkah, jawaban };
}

export function bagian(teks: string, gambar?: GambarSederhana): BagianPenjelasan {
  return gambar ? { teks, gambar } : { teks };
}

export interface KartuMentah {
  /** id topik pemilik kartu */
  topik: string;
  sumber: string;
  penjelasan: BagianPenjelasan[];
  contoh: ContohJadi[];
  soal: SoalMentah[];
  petunjukOrtu?: string;
}

/** Tingkat menurut posisi: sepertiga awal mudah, tengah sedang, akhir sulit. */
export function tingkatMenurutUrutan(indeks: number, banyak: number): TingkatSoal {
  if (indeks < banyak / 3) return 'mudah';
  if (indeks < (2 * banyak) / 3) return 'sedang';
  return 'sulit';
}

export function buatKartu(m: KartuMentah): KartuIlmu {
  const soal: SoalKartu[] = m.soal.map((s, i) => ({
    id: `${m.topik}-s${i + 1}`,
    ...s,
    tingkat: tingkatMenurutUrutan(i, m.soal.length),
  }));
  const kartu: KartuIlmu = {
    id: `kartu-${m.topik}`,
    penjelasan: m.penjelasan,
    contohJadi: m.contoh,
    soal,
    status: 'belum_diperiksa',
    sumber: m.sumber,
  };
  if (m.petunjukOrtu) kartu.petunjukOrtu = m.petunjukOrtu;
  return kartu;
}
