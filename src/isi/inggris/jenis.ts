import type { StatusPeriksa } from '../jenis';

/**
 * Paket Belajar Bahasa Inggris (assets/paket/inggris-t3.json … inggris-t6.json).
 * Rancangan: docs/rancangan/01-produk/11-belajar-bahasa-inggris.md
 */

export interface Kosakata {
  /** id tetap, misal "t3-u01-k03" */
  id: string;
  /** kata Inggris, huruf kecil kecuali nama diri, misal "cat" */
  kata: string;
  /** arti Bahasa Indonesia, misal "kucing" */
  arti: string;
  /** satu emoji sistem yang menggambarkan kata, atau kosong bila memakai ikon */
  emoji: string;
  /** nama ikon SVG buatan sendiri bila emoji tidak cocok (lihat src/isi/inggris/ikon.ts), opsional */
  ikon?: string;
  status: StatusPeriksa;
}

export interface PolaKalimat {
  id: string;
  /** kalimat Inggris lengkap, misal "This is my cat." */
  kalimat: string;
  /** arti Bahasa Indonesia */
  arti: string;
  status: StatusPeriksa;
}

/** Dengar lalu pilih: anak mendengar `ucapan`, memilih gambar/kata yang benar. */
export interface SoalDengar {
  id: string;
  /** teks yang diucapkan mesin suara (en-US) */
  ucapan: string;
  /** id kosakata yang benar */
  kunci: string;
  /** 2–3 id kosakata pengecoh dari unit yang sama */
  pengecoh: string[];
  status: StatusPeriksa;
}

/** Susun kata (tingkat 4–6): kata diacak, anak menyusun kalimat. */
export interface SoalSusun {
  id: string;
  /** kalimat benar; kata dipisah spasi, tanda baca menempel di kata terakhir */
  kalimat: string;
  arti: string;
  status: StatusPeriksa;
}

/** Permainan kata: cocokkan pasangan kata Inggris ↔ gambar/arti. */
export interface PermainanKata {
  id: string;
  jenis: 'cocokkan' | 'tebak_gambar';
  /** id kosakata yang dipakai (4–6) */
  kata: string[];
  status: StatusPeriksa;
}

export interface UnitInggris {
  /** misal "t3-u01" */
  id: string;
  nomor: number;
  /** judul Inggris singkat, misal "Hello!" */
  judul: string;
  /** tema Bahasa Indonesia, misal "Salam dan perkenalan" */
  tema: string;
  kosakata: Kosakata[];
  pola: PolaKalimat[];
  dengar: SoalDengar[];
  /** kosong untuk tingkat 3 */
  susun: SoalSusun[];
  permainan: PermainanKata[];
}

export interface PaketInggris {
  id: string; // "inggris-t3"
  versi: string;
  tingkat: 3 | 4 | 5 | 6;
  fase: 'B' | 'C';
  unit: UnitInggris[];
}
