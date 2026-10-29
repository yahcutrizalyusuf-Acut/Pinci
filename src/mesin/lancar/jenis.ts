/**
 * Jenis data mesin Lancar Matematika (Metode LANCAR).
 * Semua jenis di sini murni data: tanpa React, tanpa expo.
 */

/**
 * Bentuk jawaban yang diketik anak di papan angka.
 * - `bilangan`: bilangan cacah, hanya tombol 0–9.
 * - `desimal`: memakai koma gaya Indonesia (mis. "0,25"); papan angka perlu tombol ",".
 * - `pecahan`: "p/q" paling sederhana (mis. "3/4"); papan angka perlu tombol "/".
 */
export type BentukJawaban = 'bilangan' | 'pecahan' | 'desimal';

/**
 * Asal soal di dalam lembar.
 * - `baru`: soal level yang sedang dilatih.
 * - `lama`: soal level sebelumnya (prinsip C, campur dan selipkan).
 * - `ulang`: soal yang salah atau terlalu lama di lembar sebelumnya.
 * - `daya_tahan`: soal uji daya tahan level yang sudah lulus 3 minggu lalu.
 * - `tes`: soal tes penempatan.
 */
export type AsalSoal = 'baru' | 'lama' | 'ulang' | 'daya_tahan' | 'tes';

export interface SoalLancar {
  /** Pengenal stabil: `${kelas}-${level}-${teks}`. Unik di dalam satu lembar. */
  id: string;
  /** Teks soal, mis. "7 × 8", "56 : 7", "3/4 = … %". Lambang bagi ":" (bukan "÷"). */
  teks: string;
  /** Kunci jawaban dalam bentuk baku yang bisa diketik di papan angka. */
  kunci: string;
  bentukJawaban: BentukJawaban;
  /**
   * Kesulitan relatif di dalam levelnya, 0 < tingkat < 1 (0 = paling mudah).
   * Dipakai untuk mengurutkan lembar dari mudah ke sulit; karena dinormalkan
   * per level, soal level lama otomatis tersebar di sepanjang lembar.
   */
  tingkat: number;
  /** Level asal soal (1–6). */
  level: number;
  /** Kelas asal soal (1–6). */
  kelas: number;
  /** Keluarga fakta untuk rapor dan peta jenis salah, mis. "×8", ":7", "KPK". */
  keluarga: string;
  /** Target detik untuk soal ini (dari level asalnya, 04-mesin-lancar.md bagian 4.1). */
  targetDetik: number;
  asal: AsalSoal;
}

/** Mode pengerjaan lembar. Lembar `dampingi` tidak dihitung untuk naik/turun level. */
export type ModeLembar = 'sendiri' | 'dampingi';

export type JenisSesi = 'latihan' | 'penempatan';

/** Data per soal yang dicatat (04-mesin-lancar.md bagian 7). */
export interface JawabanLancar {
  soal: SoalLancar;
  /** Jawaban yang diketik anak; `null` bila anak menekan "Belum bisa" atau tidak menjawab. */
  jawaban: string | null;
  /**
   * Benar/salah saat dijawab (untuk tampilan). Mesin aturan MENGHITUNG ULANG
   * benar/salah dengan `cocokJawaban`, jadi nilai ini bukan sumber kebenaran.
   */
  benar: boolean;
  /** Lama menjawab soal ini dalam detik (waktu jeda tidak dihitung). */
  detik: number;
  /** Berapa kali anak menekan tombol hapus di soal ini (kolom `hapus_n`). */
  hapusN: number;
}

/** Satu sesi (satu lembar latihan, atau satu tes penempatan). */
export interface SesiLancar {
  id: string;
  jenis: JenisSesi;
  kelas: number;
  /** Level lembar saat dibuat (untuk tes penempatan: 1). */
  level: number;
  mode: ModeLembar;
  /** Waktu mulai, milidetik sejak epoch. */
  mulai: number;
  /** Waktu selesai, milidetik sejak epoch. */
  selesai: number;
  /** Banyak soal di lembar (20 untuk latihan, 24 untuk tes penempatan penuh). */
  jumlahSoal: number;
  /** Level yang diuji daya tahannya di lembar ini, atau `null`. */
  levelDayaTahan: number | null;
  jawaban: JawabanLancar[];
}

/** Hasil satu lembar latihan. */
export type HasilLembar = 'kilat' | 'tepat' | 'tetap' | 'turun';
