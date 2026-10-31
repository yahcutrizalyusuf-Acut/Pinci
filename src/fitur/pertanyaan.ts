/**
 * Pertanyaan pilihan untuk orang tua, satu per minggu, tidak wajib (08-model-usaha/01 bagian 8).
 * Kode tetap supaya jawaban bisa dibandingkan dari minggu ke minggu. Isi buatan sendiri, belum diperiksa.
 */
export interface Pertanyaan {
  kode: string;
  teks: string;
  pilihan: string[];
}

export const DAFTAR_PERTANYAAN: Pertanyaan[] = [
  { kode: 'O01', teks: 'Bagaimana lama latihan anak minggu ini?', pilihan: ['Terlalu singkat', 'Pas', 'Terlalu lama'] },
  { kode: 'O06', teks: 'Berapa kali anak mulai latihan sendiri tanpa disuruh minggu ini?', pilihan: ['Belum pernah', '1–2 kali', '3 kali atau lebih'] },
  { kode: 'O07', teks: 'Bagaimana tugas sekolah anak minggu ini?', pilihan: ['Lebih mudah', 'Sama saja', 'Lebih sulit', 'Tidak ada tugas'] },
  { kode: 'O10', teks: 'Apakah catatan pengawas membantu Anda?', pilihan: ['Sangat membantu', 'Sedikit', 'Belum terasa'] },
  { kode: 'O11', teks: 'Bagaimana suasana hati anak saat latihan?', pilihan: ['Senang', 'Biasa', 'Terpaksa'] },
  { kode: 'O12', teks: 'Seberapa mungkin Anda mengajak keluarga lain memakai Pintar Main?', pilihan: ['Sangat mungkin', 'Mungkin', 'Belum'] },
];

/** Nomor minggu sejak Senin, 5 Jan 1970 (WIB), untuk memutar pertanyaan. */
export function mingguKe(sekarang = new Date()): number {
  const wib = sekarang.getTime() + 7 * 3_600_000;
  return Math.floor((wib - 4 * 86_400_000) / (7 * 86_400_000));
}

/** Pertanyaan minggu ini. Kode jawaban memuat minggunya supaya tiap minggu bisa dijawab sekali. */
export function pertanyaanMingguIni(sekarang = new Date()): Pertanyaan & { kodeJawab: string } {
  const m = mingguKe(sekarang);
  const p = DAFTAR_PERTANYAAN[m % DAFTAR_PERTANYAAN.length];
  return { ...p, kodeJawab: `${p.kode}-m${m}` };
}
