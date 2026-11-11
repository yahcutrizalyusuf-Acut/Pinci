/**
 * Cerita Komik Bahasa Inggris (rancangan docs/rancangan/01-produk/13-cerita-komik-bahasa-inggris.md bagian 8).
 *
 * - Nama tokoh HANYA ada di assets/paket/tokoh.json. Naskah memakai penanda `{id}` (misal `{robi}`), yang diganti
 *   nama dari tokoh.json saat ditampilkan dan diucapkan. Mengganti nama di tokoh.json mengganti nama di seluruh aplikasi.
 * - Teks gelembung ditulis aplikasi di atas gambar, tidak pernah dicetak di dalam gambar (CLAUDE.md aturan 13).
 * - Gambar panel dirakit dari `latar` + daftar `tokoh` (pose, posisi). Kalau `gambar` (berkas WebP) diisi, gambar itu
 *   menggantikan rakitan SVG sementara tanpa mengubah kode.
 */
import type { StatusPeriksa } from '../jenis';

// ---------- tokoh ----------

export interface PengaturanSuara {
  bahasa: 'en-US' | 'en-GB';
  /** nada mesin suara (expo-speech `pitch`), 0,5–2 */
  nada: number;
  /** kecepatan dasar (expo-speech `rate`); dikalikan faktor tingkat (± 0,85 tingkat 3–4, ± 0,95 tingkat 5–6) */
  kecepatan: number;
}

export type PeranTokoh = 'anak' | 'robot' | 'misteri' | 'dewasa' | 'narator';

export interface Tokoh {
  /** id tetap, dipakai di naskah sebagai `{id}`; tidak pernah tampil di layar */
  id: string;
  /** nama yang tampil dan diucapkan; satu-satunya tempat nama ditulis */
  nama: string;
  peran: PeranTokoh;
  umur?: number;
  kelas?: number;
  /** sifat singkat (untuk perakit dan guru), Bahasa Indonesia */
  sifat: string;
  /** warna utama, misal baju (hex) */
  warna: string;
  suara: PengaturanSuara;
}

export interface PaketTokoh {
  versi: string;
  /** dunia cerita, misal "Gampong Bungong" */
  latarCerita: string;
  tokoh: Tokoh[];
}

// ---------- panel ----------

export type Pose = 'berdiri' | 'melambai' | 'menunjuk' | 'kaget' | 'gembira' | 'jongkok';
export type Latar = 'sawah' | 'sungai' | 'lapangan' | 'kedai' | 'rumah' | 'kelas' | 'jalan' | 'sore';
export type PosisiTokoh = 'kiri' | 'tengah_kiri' | 'tengah' | 'tengah_kanan' | 'kanan';
export type PosisiGelembung = 'kiri_atas' | 'tengah_atas' | 'kanan_atas' | 'kiri_bawah' | 'kanan_bawah';
export type ArahEkor = 'kiri' | 'tengah' | 'kanan';

export interface TokohDiPanel {
  /** id tokoh dari tokoh.json */
  tokoh: string;
  pose: Pose;
  posisi: PosisiTokoh;
  /** menghadap ke kiri (cermin) */
  balik?: boolean;
  /** varian khusus, misal "super" untuk Super Robi */
  varian?: 'super' | 'kotor' | 'sedih';
}

export interface Gelembung {
  /** id tetap, misal "t3-u01-p2-g1" */
  id: string;
  /** id tokoh yang berbicara (suara memakai pengaturan tokoh ini); "narator" untuk kotak narasi */
  tokoh: string;
  /** kalimat Inggris; nama tokoh ditulis `{id}` */
  teks: string;
  /** arti Bahasa Indonesia (tombol "Artinya?") */
  arti: string;
  posisi: PosisiGelembung;
  ekor: ArahEkor;
}

export interface PanelKomik {
  /** id tetap, misal "t3-u01-p1" */
  id: string;
  nomor: number;
  /** gambaran adegan untuk perakit panel dan guru (Bahasa Indonesia) */
  adegan: string;
  latar: Latar;
  tokoh: TokohDiPanel[];
  /** berkas WebP panel asli (opsional); kalau ada, menggantikan rakitan SVG */
  gambar?: string;
  /** true selama panel masih rakitan SVG sementara */
  gambar_sementara: boolean;
  gelembung: Gelembung[];
  /** 2–4 kepingan kata untuk Ceritakan Lagi (bisa diketuk untuk didengar) */
  kataBantu: string[];
  /** 1–2 tips bunyi jebakan untuk Dengar Bedanya (Bahasa Indonesia) */
  tipsBunyi: string[];
}

// ---------- Cek Paham (K31) ----------

export type SoalCekPaham =
  | {
      id: string;
      jenis: 'urutkan';
      /** id panel dalam urutan BENAR (3–4 panel); aplikasi yang mengacak */
      panel: string[];
    }
  | {
      id: string;
      jenis: 'siapa';
      /** id gelembung yang dibacakan */
      gelembung: string;
      /** id tokoh pilihan (wajah), termasuk kunci */
      pilihan: string[];
      kunci: string;
    }
  | {
      id: string;
      jenis: 'dengar_panel';
      gelembung: string;
      /** id panel pilihan, termasuk kunci */
      pilihan: string[];
      kunci: string;
    }
  | {
      id: string;
      jenis: 'lengkapi';
      gelembung: string;
      /** kata yang dihilangkan dari gelembung (harus ada di teks gelembung) */
      kataHilang: string;
      /** 3 pilihan, termasuk kataHilang */
      pilihan: string[];
    };

// ---------- komik ----------

export interface NaskahOrangTua {
  /** langkah untuk orang tua (Bahasa Indonesia, kalimat Inggris boleh disisipkan) */
  langkah: string[];
  /** pertanyaan renungan tentang pesan akhlak */
  renungan: string;
  /** pertanyaan pancingan untuk rapor ("satu cara membantu") */
  pancingan: string;
}

export interface Komik {
  /** misal "t3-u01-komik" */
  id: string;
  /** id unit di paket inggris-tN, misal "t3-u01" */
  unit: string;
  tingkat: 3 | 4 | 5 | 6;
  /** urutan di petualangan (1–12) */
  nomor: number;
  /** judul Inggris, boleh memakai `{id}` */
  judul: string;
  /** pesan akhlak (Bahasa Indonesia), ditunjukkan lewat perbuatan tokoh */
  pesanAkhlak: string;
  /** kartu akhir yang dibacakan Pinci */
  pesanHariIni: { inggris: string; arti: string };
  /** 4–8 kata target, semuanya ada di kosakata unit (kata persis) */
  kataTarget: string[];
  panel: PanelKomik[];
  cekPaham: SoalCekPaham[];
  naskahOrangTua: NaskahOrangTua;
  /** ajakan perbuatan baik minggu ini untuk orang tua (tanpa nilai atau hadiah) */
  perbuatanBaik: string;
  status: StatusPeriksa;
}

export interface PaketKomik {
  id: string; // "komik-t3"
  versi: string;
  tingkat: 3 | 4 | 5 | 6;
  /** nama petualangan, misal "Halo, Robi!" */
  petualangan: string;
  komik: Komik[];
}

// ---------- tambahan per unit (dipakai di paket inggris-tN) ----------

/** Bunyi Hari Ini (phonics, ± 1 menit per unit). Urutan dari daftar bunyi jebakan, `13` bagian 7. */
export interface BunyiHariIni {
  /** nomor di daftar bunyi jebakan (1–13) */
  jebakan: number;
  /** nama bunyi singkat, misal "huruf e bisu" */
  bunyi: string;
  /** 2–4 kata contoh dari unit ini */
  kata: string[];
  /** tips singkat Bahasa Indonesia */
  tips: string;
  status: StatusPeriksa;
}

export type JenisGerak =
  | 'lambai'
  | 'tepuk'
  | 'lompat'
  | 'duduk'
  | 'berdiri'
  | 'tunjuk'
  | 'sentuh'
  | 'angguk'
  | 'makan'
  | 'minum'
  | 'tidur'
  | 'sikat'
  | 'cuci'
  | 'baca'
  | 'tulis'
  | 'lari'
  | 'putar'
  | 'buka';

/** Gerakan untuk kata kerja atau perintah di Kenal Kata (TPR): Pinci memperagakan ≤ 1,5 detik, anak menirukan. */
export interface Gerakan {
  /** id kosakata di unit ini */
  kata: string;
  jenis: JenisGerak;
  /** petunjuk singkat untuk anak, misal "Lompat di tempat!" */
  petunjuk: string;
}

/** Ganti penanda `{id}` dengan nama tokoh. Penanda yang tidak dikenal dibiarkan tanpa kurung kurawal. */
export function isiNama(teks: string, nama: Record<string, string>): string {
  return teks.replace(/\{([a-z_]+)\}/g, (_, id: string) => nama[id] ?? id);
}
