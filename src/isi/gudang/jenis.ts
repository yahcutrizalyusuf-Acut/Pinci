import type { StatusPeriksa } from '../jenis';

/**
 * Paket Gudang Ilmu per kelas (assets/paket/gudang-k2.json … gudang-k6.json).
 * Rancangan: docs/rancangan/01-produk/10-gudang-ilmu-bimbingan-dan-waktu.md bagian 2 dan 3.
 * Desain: desain/dari-claude-design/B01-Gudang-Ilmu.dc.html dan B02-Kartu-Ilmu.dc.html.
 *
 * Paket dibangkitkan dari sumber bertipe di src/isi/gudang/sumber/ dengan
 * `npx tsx scripts/buat-gudang.ts`. Jangan menyunting berkas JSON dengan tangan.
 */

export type KodeMapel = 'mat' | 'bi';

/**
 * Gambar sederhana yang digambar ulang oleh aplikasi (tanpa berkas gambar).
 *
 * Konvensi:
 * - `emoji`: `isi` berisi 1–10 emoji sistem, ditampilkan besar dalam satu baris.
 *   Dipakai untuk benda yang dihitung atau suasana (🍊🍊🍊, ⚖️).
 * - `pecahan`: satu batang dibagi `b` bagian sama besar, `a` bagian pertama diwarnai.
 *   Syarat: bilangan bulat, 0 ≤ a ≤ b, 1 ≤ b ≤ 12.
 * - `batang`: diagram batang tegak. `nilai` bilangan bulat ≥ 0 (2–6 batang).
 *   `label` (opsional) sama panjang dengan `nilai`, teks pendek di bawah batang.
 * - `petak`: kisi `baris` × `kolom` petak (masing-masing 1–10). `terisi` petak pertama
 *   diwarnai, dihitung baris demi baris dari kiri atas. Syarat: 0 ≤ terisi ≤ baris × kolom.
 */
export type GambarSederhana =
  | { jenis: 'emoji'; isi: string }
  | { jenis: 'pecahan'; a: number; b: number }
  | { jenis: 'batang'; nilai: number[]; label?: string[] }
  | { jenis: 'petak'; baris: number; kolom: number; terisi: number };

/** Satu bagian penjelasan: satu layar kecil yang dibacakan mesin suara (id-ID). */
export interface BagianPenjelasan {
  /** paling banyak 2 kalimat pendek */
  teks: string;
  gambar?: GambarSederhana;
}

export interface ContohJadi {
  soal: string;
  /** langkah demi langkah, satu kalimat per langkah */
  langkah: string[];
  jawaban: string;
}

export type TingkatSoal = 'mudah' | 'sedang' | 'sulit';

/** Tiga petunjuk bertahap: 1/3 arah berpikir, 2/3 langkah pertama, 3/3 hampir jawaban. */
export type PetunjukBertahap = [string, string, string];

export interface SoalKartu {
  /** misal "mat6-kpk-fpb-s3" */
  id: string;
  /** bacaan pendek (teks, puisi, tabel dalam kalimat) bila soal memerlukannya */
  bacaan?: string;
  gambar?: GambarSederhana;
  pertanyaan: string;
  bentuk: 'pg' | 'isian';
  /** hanya untuk `pg`: 2–4 pilihan, salah satunya sama persis dengan `kunci` */
  pilihan?: string[];
  /**
   * Kunci jawaban. Untuk `pg`: teks pilihan yang benar.
   * Untuk `isian` Matematika: bilangan saja dengan tulisan Indonesia
   * (ribuan bertitik "2.400", desimal berkoma "0,75", pecahan "3/4", campuran "3 3/4").
   */
  kunci: string;
  /**
   * Ekspresi hitung untuk memeriksa kunci Matematika oleh kode (CLAUDE.md aturan 10).
   * Tata tulis: bilangan memakai titik desimal ("1.5"), operator + - * / dan kurung,
   * serta fungsi fpb, kpk, bulat(x, kelipatan), akar2, akar3, maks, min, banyakfaktor.
   * Nilainya harus sama dengan bilangan di awal `kunci` (lihat src/isi/gudang/hitung.ts).
   */
  hitung?: string;
  petunjuk: PetunjukBertahap;
  pembahasan: string;
  tingkat: TingkatSoal;
  /** true = soal cerita berlatar Aceh/kehidupan sehari-hari (M4), kuncinya dihitung pembangkit */
  cerita?: boolean;
  /** model batang pendukung soal cerita (M2); bagian yang `dicari` bernilai sama dengan kunci */
  modelBatang?: ModelBatangData;
  /** status pemeriksaan guru untuk soal tambahan buatan sendiri */
  status?: StatusPeriksa;
}

/**
 * Model batang (M2). Setiap baris berisi ruas yang lebarnya sebanding dengan `nilai`.
 * Aturan (diuji): ruas `dicari` berdampingan di satu baris; bila `keseluruhan` ada,
 * nilainya = jumlah semua ruas; nilai yang dicari (jumlah ruas `dicari`, atau
 * `keseluruhan` bila `keseluruhan.dicari`) = kunci soal.
 */
export interface RuasBatang {
  nilai: number;
  /** teks di dalam ruas; bila kosong, nilainya yang ditulis (atau kosong bila dicari) */
  label?: string;
  dicari?: boolean;
}

export interface BarisBatang {
  /** nama baris, misal "Rani" */
  label?: string;
  ruas: RuasBatang[];
}

export interface ModelBatangData {
  /** 1–2 baris */
  baris: BarisBatang[];
  keseluruhan?: { nilai: number; label?: string; dicari?: boolean };
  /** tulisan di depan nilai, misal "Rp" */
  depan?: string;
  /** tulisan sesudah nilai, misal "kg" */
  satuan?: string;
  /** tulis nilai sebagai pecahan berpenyebut ini (disederhanakan), misal 4 → "3/4" */
  penyebut?: number;
}

/**
 * Garis bilangan dengan titik dan lompatan. Tanda garis dari `mulai` sampai `akhir`
 * setiap `langkah` (paling banyak 13 tanda). `penyebut` = tulis tanda sebagai pecahan k/penyebut.
 */
export interface GarisBilanganData {
  mulai: number;
  akhir: number;
  langkah: number;
  penyebut?: number;
  titik?: { nilai: number; label?: string }[];
  lompatan?: { dari: number; ke: number; label?: string }[];
  satuan?: string;
}

/** Benda yang dimainkan anak di layar "Coba dengan benda" (M1). */
export type BendaInteraktif =
  /** blok puluhan: susun bilangan `target` (1–999) dari ratusan, puluhan, satuan */
  | { jenis: 'blok'; target: number }
  /** potongan pecahan: warnai `target` dari `bagian` potong */
  | { jenis: 'potongan'; bentuk: 'lingkaran' | 'batang'; bagian: number; target: number }
  /** uang gaya Pasar Gampong: kumpulkan uang sampai `target` */
  | { jenis: 'uang'; pilihan: number[]; target: number }
  /** garis bilangan: lompat sejauh `lompat` dari `garis.mulai` sampai `target` */
  | { jenis: 'lompat'; garis: GarisBilanganData; lompat: number; target: number };

export type GambarLangkah = { jenis: 'batang'; data: ModelBatangData } | { jenis: 'garis'; data: GarisBilanganData };

/** Langkah "Coba dengan benda": 1 layar benda → 1 layar gambar → angka (M1). */
export interface CobaBenda {
  /** situasi singkat (≤ 2 kalimat) */
  soal: string;
  /** perintah di layar benda, misal "Warnai 3 potong." */
  perintah: string;
  benda: BendaInteraktif;
  /** kalimat di layar gambar */
  teksGambar: string;
  gambar: GambarLangkah;
  /** kalimat hitung yang tampil, misal "3/4 × 12 = 9" */
  kalimat: string;
  /** ekspresi hitung (tata tulis `SoalKartu.hitung`) */
  hitung: string;
  /** dihitung pembangkit dari `hitung` */
  jawaban: string;
}

export interface KartuIlmu {
  /** misal "kartu-mat6-kpk-fpb" */
  id: string;
  penjelasan: BagianPenjelasan[];
  /** tepat 2 contoh jadi */
  contohJadi: ContohJadi[];
  /** 5–10 soal, berjenjang dari mudah ke sulit */
  soal: SoalKartu[];
  /** saran singkat untuk orang tua (bahan Mode Dampingi), terutama untuk topik bersamaOrtu */
  petunjukOrtu?: string;
  /** langkah "Coba dengan benda" sebelum contoh jadi (M1), opsional per kartu */
  cobaBenda?: CobaBenda;
  /** pertanyaan pancingan untuk orang tua (L1), tampil di Mode Dampingi */
  pancingan?: string;
  status: StatusPeriksa;
  /** kode modul TKA sumber, misal "M03" atau "B05" */
  sumber: string;
}

export interface TopikGudang {
  /** misal "mat6-kpk-fpb" */
  id: string;
  judul: string;
  ringkas: string;
  /** urutan di peta, mulai 1 per mapel */
  urutan: number;
  /** id topik di paket yang sama yang sebaiknya dikuasai dulu */
  prasyarat: string[];
  /** anak melihat "Topik ini lebih seru dikerjakan bersama Ayah/Bunda" */
  bersamaOrtu: boolean;
  /** true = kartu belum ada, tampil "segera" */
  segera: boolean;
  kartu?: KartuIlmu;
}

export interface MapelGudang {
  kode: KodeMapel;
  topik: TopikGudang[];
}

export interface PaketGudang {
  /** "gudang-k2" … "gudang-k6" */
  id: string;
  versi: string;
  kelas: number;
  dibuat: string;
  sumber: string;
  mapel: MapelGudang[];
}
