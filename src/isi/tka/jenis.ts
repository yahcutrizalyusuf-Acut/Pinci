import type { StatusPeriksa } from '../jenis';

/**
 * Paket isi Persiapan TKA kelas 6 (assets/paket/tka-k6.json).
 * Dibangkitkan oleh `npx tsx scripts/impor-tka.ts` dari `bahan/kursus-tka-sd/`.
 * Rancangan: docs/rancangan/01-produk/06-persiapan-tka.md
 *
 * ── Konvensi teks (berlaku untuk SEMUA string yang tampil ke anak) ──────────────
 * - Pecahan biasa ditulis dengan penanda kurung kurawal: "{3/4}" = tiga per empat.
 * - Pecahan campuran: "{1 1/2}" = satu satu per dua. Komponen layar menggambar
 *   pembilang di atas penyebut; teks di luar kurung kurawal tampil apa adanya.
 * - Desimal memakai koma ("3,5"), ribuan memakai titik ("3.500"), uang "Rp12.000",
 *   pangkat satuan memakai huruf naik Unicode ("cm²", "cm³"), bagi ":" dan kali "×",
 *   persis seperti di bahan (03-standar-istilah.md Bagian 7).
 * - "**kata**" = kata penentu yang dicetak tebal (paling banyak, tidak, selisih, ...).
 *   "*kata*" = miring. Penanda lain dari Markdown tidak dipakai.
 * - Baris baru "\n" di dalam satu bagian teks dipertahankan (misal larik puisi).
 *
 * ── Konvensi bagian stimulus (lihat `Bagian`) ──────────────────────────────────
 * - Tabel: { jenis: 'tabel', baris: string[][] } — baris pertama adalah judul kolom.
 * - Denah angka susunan kubus: { jenis: 'denah', petak: number[][] } — dilihat dari atas,
 *   baris pertama = paling belakang, baris terakhir = paling DEPAN; angka di tiap petak
 *   = banyak kubus bertumpuk (0 = kosong). `atas`/`bawah` menyimpan tulisan di atas/bawah
 *   denah bila ada (biasanya "belakang"/"depan"), `kolom` dan `labelBaris` bila denah
 *   berasal dari tabel ("Kiri/Tengah/Kanan", "Belakang/Depan").
 * - Gambar teks berhuruf sama lebar (diagram batang, piktogram, tampak kubus, garis
 *   bilangan): { jenis: 'gambar_teks', baris: string[] } — ditampilkan dengan huruf
 *   sama lebar tanpa diubah, maksimal 40 kolom × 15 baris (04-standar-soal.md aturan 8).
 */

export type Mapel = 'mat' | 'bi';

/** Kode penyebab salah untuk rapor (06-persiapan-tka.md bagian 7). W (waktu) tidak berasal dari pengecoh. */
export type KodePenyebab = 'B' | 'H' | 'S';

export type Bagian =
  | { jenis: 'teks'; isi: string }
  | { jenis: 'tabel'; baris: string[][] }
  | {
      jenis: 'denah';
      petak: number[][];
      atas?: string;
      bawah?: string;
      kolom?: string[];
      labelBaris?: string[];
    }
  | { jenis: 'gambar_teks'; baris: string[] };

export interface Pilihan {
  /** "A".."E" untuk PG dan PG kompleks; "1".."4" (nomor pernyataan) untuk PG kategori */
  huruf: string;
  teks: string;
}

export interface Pengecoh {
  /** alasan dari baris "Kenapa pengecoh menarik" (atau "Kenapa pernyataan salah menarik") */
  alasan: string;
  /**
   * Kode penyebab salah. DITEBAK MESIN dari kata kunci alasan (belum diperiksa guru),
   * kosong bila tidak ada kata kunci yang jelas.
   */
  kode?: KodePenyebab;
  /** nomor salah paham di halaman 1 topik (1–3) bila alasan menyebutnya */
  salahPaham?: number;
}

/** Asal butir di dalam bahan. */
export type AsalButir =
  | 'soal_kelas' // Soal ● halaman 5
  | 'soal_cadangan' // Soal ○ halaman 5 (juga latihan rumah)
  | 'kuis' // Kuis pembuka halaman 2
  | 'terbimbing' // latihan terbimbing halaman 3
  | 'tiket' // tiket keluar halaman 6 (tetap di kertas menurut rancangan)
  | 'diagnostik' // tes awal M01/B01
  | 'simulasi' // Butir S1–S5
  | 'baca_cepat'; // Pertanyaan teks T01–T36

interface ButirDasar {
  /**
   * id tetap:
   *   "M02-k07"  Soal nomor 7 halaman 5 (● maupun ○; nomor sama dengan modul)
   *   "M02-kz1"  Kuis pembuka 1 · "M02-tb1" Terbimbing 1 · "M02-tk1" Tiket 1
   *   "M01-d05"  Diagnostik 5 · "S1-12" Butir 12 simulasi S1 · "T05-q2" Pertanyaan 2 teks T05
   */
  id: string;
  asal: AsalButir;
  /** modul/berkas sumber: "M02", "S1", "T05" */
  sumber: string;
  /** baris judul soal di berkas sumber (untuk dicocokkan guru) */
  baris: number;
  /** topik yang diuji: kode dari baris Kelompok ("M01", "B05", "PR-M2"), atau topik modul */
  topik: string;
  /** hanya untuk soal halaman 5: hari ini / minggu lalu / bulan lalu */
  kelompok?: 'hari_ini' | 'minggu_lalu' | 'bulan_lalu';
  /** stimulus milik soal ini (teks, tabel, denah) yang tampil di atas pertanyaan */
  stimulus?: Bagian[];
  /** judul stimulus bersama di simulasi, misal "Teks A: Koperasi sekolah" */
  judulStimulus?: string;
  /** id stimulus bersama di simulasi, misal "S1-A" (butir dengan id sama memakai teks yang sama) */
  grupStimulus?: string;
  pertanyaan: string;
  pilihan: Pilihan[];
  /** kunci pilihan/pernyataan → alasan pengecoh; hanya pilihan yang salah */
  pengecoh: Record<string, Pengecoh>;
  /**
   * Kunci berjenjang tahap 1 (baris "Petunjuk" bahan: satu pertanyaan pancingan).
   * Bahan hanya punya dua tingkat (Petunjuk lalu Langkah); tingkat berikutnya diturunkan
   * aplikasi dari `pembahasan`. Kosong bila bahan tidak memuatnya.
   */
  petunjuk?: string[];
  /** baris "Langkah" bahan: cara lengkap (kunci berjenjang tahap 2) */
  pembahasan?: string;
  /** baris `Periksa` mentah (ekspresi Python) untuk pemeriksaan ulang */
  periksa?: string[];
  /** catatan pemeriksaan (temuan pemeriksa kunci, temuan tercatat di 05-pemeriksaan) */
  catatan?: string[];
  status: StatusPeriksa;
}

/** PG biasa: satu jawaban benar dari empat pilihan. */
export interface ButirPG extends ButirDasar {
  bentuk: 'pg';
  /** satu huruf, misal "C" */
  kunci: string;
}

/** PG kompleks: 2–3 jawaban benar dari 4–5 pilihan, dinilai semua-atau-tidak. */
export interface ButirPGK extends ButirDasar {
  bentuk: 'pgk';
  /** huruf urut, misal ["A", "C", "E"] */
  kunci: string[];
}

/** PG kategori: setiap pernyataan (di `pilihan`, huruf = nomor) dinilai Benar atau Salah. */
export interface ButirPGKat extends ButirDasar {
  bentuk: 'pgkat';
  /** nama kategori, urut sesuai nilai kunci: ["Benar", "Salah"] */
  kategori: string[];
  /** satu nilai per pernyataan, urut sama dengan `pilihan`: "B" = Benar, "S" = Salah */
  kunci: ('B' | 'S')[];
}

export type Butir = ButirPG | ButirPGK | ButirPGKat;

export interface SalahPaham {
  /** nomor di tabel "Tiga salah paham" ("1".."3") */
  kode?: string;
  teks: string;
  /** "Seperti apa di jawaban anak" */
  contoh?: string;
}

export interface ContohJadi {
  /** soal contoh (bisa memuat teks bacaan, tabel, pilihan) */
  soal: Bagian[];
  /** kolom "Yang ditulis di papan" */
  langkah: string[];
  /** kolom "Yang diucapkan pengajar", sejajar dengan `langkah` (untuk dibacakan layar) */
  penjelasan: string[];
  jawaban: string;
}

export interface Topik {
  /** "M01".."M24", "B01".."B12" */
  id: string;
  mapel: Mapel;
  judul: string;
  /** "P02" */
  pertemuan: string;
  /** minggu ke- dalam program 12 minggu */
  minggu: number;
  /** teks baca cepat pertemuan ini, misal "T02" */
  teksBacaCepat?: string;
  /** apakah pertemuan simulasi (M08, M14, M20, M24, B12) */
  simulasi: boolean;
  /** isi bagian "### Sasaran" */
  sasaran: string;
  salahPaham: SalahPaham[];
  contohJadi: ContohJadi[];
  /** Soal ● halaman 5 (soal kelas, pendek, ±45 detik) */
  soalKelas: Butir[];
  /** Soal ○ halaman 5 (soal cadangan, boleh berstimulus panjang) */
  soalCadangan: Butir[];
  /**
   * id butir latihan rumah = soal ○ halaman 5 (01-spesifikasi-program.md "Latihan rumah").
   * Kosong untuk M01, B01, dan pertemuan simulasi, sama dengan lembar kerja anak bagian D.
   */
  latihanRumah: string[];
  /** latihan terbimbing halaman 3 (soal kembaran contoh jadi) */
  terbimbing: Butir[];
  kuis: Butir[];
  tiket: Butir[];
  /** tes awal (hanya M01 dan B01) */
  diagnostik: Butir[];
}

export interface Simulasi {
  /** "S1".."S5" */
  id: string;
  mapel: Mapel;
  judul: string;
  /** modul tempat simulasi dipakai, misal "M08" */
  dipakaiDi: string;
  waktuMenit: number;
  butir: Butir[];
}

export interface Teks {
  /** "T01".."T36" */
  id: string;
  judul: string;
  /** isi kolom "Jenis teks", misal "teks informasi berangka dengan tabel" */
  jenis: string;
  pertemuan: string;
  mapelHari: Mapel;
  /** paragraf (dan tabel bila ada) */
  isi: Bagian[];
  /** jumlah kata menurut bahan */
  jumlahKata: number;
  /** "3 menit 0 detik" → 180 */
  sasaranDetik?: number;
  /** topik yang dilatih Pertanyaan 2, misal "B01" */
  melatih?: string;
  pertanyaan: Butir[];
}

export interface PaketTka {
  id: 'tka-k6';
  versi: string;
  /** tanggal pembuatan (YYYY-MM-DD) */
  dibuat: string;
  /** sidik jari isi bahan (16 huruf heksadesimal); berubah hanya bila bahan berubah */
  sidikJari: string;
  sumber: string;
  topik: Topik[];
  simulasi: Simulasi[];
  teks: Teks[];
}
