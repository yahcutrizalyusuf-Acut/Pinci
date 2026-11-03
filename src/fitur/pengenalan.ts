/**
 * Pendaftaran masa coba 14 hari: pelajaran pilihan, tujuan orang tua, pertanyaan pengenalan anak,
 * permintaan telepon, dan izin (keputusan Acut 3 Nov 2026; rancangan 08-model-usaha/03-gratis-ke-berbayar.md).
 * Pertanyaan yang sama dipakai di website (halaman/daftar.js); kode jawaban harus sama persis.
 * Tanpa data kesehatan atau diagnosis. Semua pertanyaan pengenalan boleh dilewati.
 */
import type { Pelajaran } from '../data/jenis';

export const VERSI_DAFTAR = 'daftar-2026-11-03';

export const PILIHAN_PELAJARAN: { kode: Pelajaran; judul: string; isi: string; hanyaKelas6?: boolean }[] = [
  { kode: 'inggris', judul: 'Bahasa Inggris', isi: 'Kosakata dan kalimat sehari-hari, dengan suara.' },
  { kode: 'gudang', judul: 'Gudang Ilmu', isi: 'Kartu materi sekolah: penjelasan, contoh, dan soal.' },
  { kode: 'tka', judul: 'Persiapan TKA', isi: 'Latihan, mini try out, dan simulasi TKA.', hanyaKelas6: true },
];

export const CONTOH_TUJUAN = ['Lancar membaca', 'Hafal perkalian', 'Nilai sekolah naik', 'Siap TKA', 'Lebih percaya diri'];

export interface PertanyaanPengenalan {
  kode: string;
  tanya: string;
  pilihan: { kode: string; teks: string }[];
}

export const PERTANYAAN_PENGENALAN: PertanyaanPengenalan[] = [
  {
    kode: 'cara_belajar',
    tanya: 'Anak paling mudah paham kalau…',
    pilihan: [
      { kode: 'gambar', teks: 'Melihat gambar atau contoh' },
      { kode: 'dengar', teks: 'Mendengar penjelasan atau cerita' },
      { kode: 'coba', teks: 'Mencoba langsung' },
      { kode: 'belum_tahu', teks: 'Belum tahu' },
    ],
  },
  {
    kode: 'suka',
    tanya: 'Pelajaran yang paling disukai',
    pilihan: [
      { kode: 'mat', teks: 'Matematika' },
      { kode: 'bind', teks: 'Bahasa Indonesia' },
      { kode: 'bing', teks: 'Bahasa Inggris' },
      { kode: 'lain', teks: 'Pelajaran lain' },
    ],
  },
  {
    kode: 'perlu_bantu',
    tanya: 'Pelajaran yang paling perlu dibantu',
    pilihan: [
      { kode: 'mat', teks: 'Matematika' },
      { kode: 'bind', teks: 'Membaca dan Bahasa Indonesia' },
      { kode: 'bing', teks: 'Bahasa Inggris' },
      { kode: 'lain', teks: 'Pelajaran lain' },
    ],
  },
  {
    kode: 'lama_betah',
    tanya: 'Berapa lama anak betah belajar tanpa diingatkan?',
    pilihan: [
      { kode: 'kurang_5', teks: 'Kurang dari 5 menit' },
      { kode: 'lima_15', teks: '5 sampai 15 menit' },
      { kode: 'lima_belas_30', teks: '15 sampai 30 menit' },
      { kode: 'lebih_30', teks: 'Lebih dari 30 menit' },
    ],
  },
  {
    kode: 'soal_sulit',
    tanya: 'Saat bertemu soal sulit, anak biasanya…',
    pilihan: [
      { kode: 'terus', teks: 'Terus mencoba' },
      { kode: 'tanya', teks: 'Bertanya' },
      { kode: 'berhenti', teks: 'Berhenti dulu' },
      { kode: 'kesal', teks: 'Mudah kesal' },
    ],
  },
  {
    kode: 'waktu_segar',
    tanya: 'Kapan anak paling segar untuk belajar?',
    pilihan: [
      { kode: 'pagi', teks: 'Pagi' },
      { kode: 'siang', teks: 'Siang' },
      { kode: 'sore', teks: 'Sore' },
      { kode: 'malam', teks: 'Malam' },
    ],
  },
  {
    kode: 'menemani',
    tanya: 'Siapa yang biasanya menemani belajar di rumah?',
    pilihan: [
      { kode: 'ortu', teks: 'Ayah atau Bunda' },
      { kode: 'saudara', teks: 'Kakak atau saudara' },
      { kode: 'guru_les', teks: 'Guru les' },
      { kode: 'sendiri', teks: 'Belajar sendiri' },
    ],
  },
  {
    kode: 'semangat',
    tanya: 'Anak paling semangat kalau…',
    pilihan: [
      { kode: 'dipuji', teks: 'Dipuji usahanya' },
      { kode: 'tantangan', teks: 'Diberi tantangan' },
      { kode: 'teman', teks: 'Belajar bersama teman' },
      { kode: 'main', teks: 'Belajar sambil bermain' },
    ],
  },
];

export const WAKTU_TELEPON = [
  { kode: 'pagi', teks: 'Pagi (08.00–11.00)' },
  { kode: 'siang', teks: 'Siang (11.00–14.00)' },
  { kode: 'sore', teks: 'Sore (15.00–18.00)' },
  { kode: 'malam', teks: 'Malam (19.00–21.00)' },
] as const;

export const TEKS_TATAP_MUKA = {
  judul: 'Kelas tatap muka belum tersedia',
  isi:
    'Kelas tatap muka akan dibuka di sebuah kota setelah jumlah pendaftarnya cukup. Sambil menunggu, anak bisa langsung belajar di kelas online bersama pengawas.',
  antre: 'Antre kelas tatap muka dan daftar kelas online',
  antreIsi:
    'Anak belajar di kelas online sekarang dan masuk antrean kelas tatap muka di kota Anda. Biaya kelas tatap muka diumumkan sebelum kelas dibuka, dan Anda bebas memilih ikut atau tidak.',
  online: 'Daftar kelas online saja',
  onlineIsi: 'Anak belajar di aplikasi bersama pengawas yang memantau dari jauh.',
};

export const IZIN_KONTAK =
  'Saya setuju dihubungi pengawas Pintar Main lewat WhatsApp atau email untuk masa coba ini. Data anak hanya dipakai untuk mendampingi belajarnya.';
export const IZIN_PENGEMBANGAN =
  'Saya mengizinkan jawaban dan hasil belajar anak dipakai, tanpa nama, untuk memperbaiki cara belajar di Pintar Main. Boleh tidak dicentang.';

/** Pelajaran yang boleh dipilih untuk kelas ini (TKA hanya kelas 6). */
export function pelajaranUntukKelas(kelas: number) {
  return PILIHAN_PELAJARAN.filter((p) => !p.hanyaKelas6 || kelas === 6);
}

/** Nomor WhatsApp Indonesia yang masuk akal: 9–15 angka, boleh diawali +62, 62, atau 0. */
export function waSah(wa: string): boolean {
  const angka = wa.replace(/[^0-9]/g, '');
  return angka.length >= 9 && angka.length <= 15 && /^(\+?62|0)/.test(wa.trim());
}

export function emailSah(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
}
