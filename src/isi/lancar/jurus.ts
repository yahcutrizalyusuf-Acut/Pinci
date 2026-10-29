/**
 * Isi layar jurus (Metode LANCAR huruf A: "Ajarkan jurus dulu") untuk 36 level
 * Lancar Matematika. Satu layar per level: inti jurus, 2–3 contoh jadi, dan
 * satu catatan ingat (04-mesin-lancar.md; desain A04-Jurus).
 *
 * Dasar isi: purwarupa v5 (`bahan/purwarupa-lancar-v5`), disesuaikan dengan
 * level di `src/mesin/lancar/level.ts` (kelas 6 L2 dan L3 sudah diganti).
 * Jurus Sulap Angka (× 11, × 25, kuadrat berakhiran 5) memakai sifat bilangan
 * yang bisa dijelaskan, tanpa nama Veda (keputusan B 19 Okt).
 *
 * Cara menulis langkah: `[…]` menandai angka bantu (disorot biru) dan `{…}`
 * menandai hasil (disorot hijau). Tanda itu dibuang dari `teks`.
 */
import type { StatusPeriksa } from '../jenis';

export interface LangkahJurus {
  /** Satu baris matematika pendek (≤ 22 karakter). */
  teks: string;
  /** Bagian yang disorot biru (angka bantu). Selalu ada di dalam `teks`. */
  sorot?: string;
  /** Hasil yang disorot hijau. Selalu ada di dalam `teks`. */
  hasil?: string;
}

export interface ContohJurus {
  langkah: LangkahJurus[];
  catatan?: string;
}

export interface Jurus {
  kelas: number;
  level: number;
  /** Kalimat pendek sesudah "Pinci punya jurus:", diakhiri titik. */
  inti: string;
  /** 2–3 contoh jadi. Contoh pertama 3 langkah. */
  contoh: ContohJurus[];
  /** Catatan ingat, 1 kalimat. */
  ingat: string;
  status: Extract<StatusPeriksa, 'belum_diperiksa'>;
}

/** Ubah "8 + [2] = 10" atau "10 + 3 = {13}" menjadi langkah bersorot. */
function l(tulis: string): LangkahJurus {
  const sorot = /\[([^\]]+)\]/.exec(tulis)?.[1];
  const hasil = /\{([^}]+)\}/.exec(tulis)?.[1];
  const teks = tulis.replace(/[[\]{}]/g, '');
  const langkah: LangkahJurus = { teks };
  if (sorot !== undefined) langkah.sorot = sorot;
  if (hasil !== undefined) langkah.hasil = hasil;
  return langkah;
}

/** Contoh jadi: catatan (boleh kosong) lalu baris-baris langkah. */
function c(catatan: string | null, ...langkah: string[]): ContohJurus {
  const contoh: ContohJurus = { langkah: langkah.map(l) };
  if (catatan) contoh.catatan = catatan;
  return contoh;
}

type Isian = [kelas: number, level: number, inti: string, ingat: string, contoh: ContohJurus[]];

const ISI: Isian[] = [
  // ---------- kelas 1 ----------
  [1, 1, 'mulai dari angka yang besar, lalu hitung maju.', 'Pasangan sepuluh: 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5.', [
    c('Mulai dari 6, maju 3 langkah.', '3 + 6', '6 … [7, 8, 9]', '6 + 3 = {9}'),
    c('Mulai dari 8, maju 2 langkah: 9, 10.', '2 + 8', '8 + 2 = {10}'),
  ]],
  [1, 2, 'ubah kurang jadi tambah.', 'Tanya dirimu: tambah berapa supaya pas?', [
    c('4 ditambah 5 jadi 9.', '9 − 4', '4 + [5] = 9', '9 − 4 = {5}'),
    c('3 dan 7 pasangan sepuluh.', '10 − 3', '3 + [7] = 10', '10 − 3 = {7}'),
  ]],
  [1, 3, 'jumlahkan satuannya, sepuluhnya tetap.', 'Angka belasan itu 10 dan satuannya.', [
    c('13 itu 10 dan 3.', '13 + 5', '3 + 5 = [8]', '10 + 8 = {18}'),
    c('Tukar dulu jadi 12 + 4.', '4 + 12', '2 + 4 = [6]', '10 + 6 = {16}'),
  ]],
  [1, 4, 'genapkan ke 10 dulu.', 'Ingat pasangan sepuluh: 8 butuh 2, 9 butuh 1.', [
    c('5 dipecah jadi 2 dan 3.', '8 + 5', '8 + [2] = 10', '10 + 3 = {13}'),
    c('6 dipecah jadi 1 dan 5.', '9 + 6', '9 + [1] = 10', '10 + 5 = {15}'),
    c('Pakai angka kembar, lalu tambah 1.', '7 + 8', '[7 + 7] = 14', '14 + 1 = {15}'),
  ]],
  [1, 5, 'turun ke 10 dulu.', 'Kurang 9 sama dengan kurang 10, lalu tambah 1.', [
    c('7 dipecah jadi 5 dan 2.', '15 − 7', '15 − [5] = 10', '10 − 2 = {8}'),
    c('Kurang 10 dulu, lalu tambah 1.', '13 − 9', '13 − [10] = 3', '3 + 1 = {4}'),
  ]],
  [1, 6, 'lihat tandanya dulu, lalu pakai jurus 10.', 'Tambah naik ke 10, kurang turun ke 10.', [
    c('Tanda +, genapkan ke 10.', '9 + 6', '9 + [1] = 10', '10 + 5 = {15}'),
    c('Tanda −, turun ke 10.', '14 − 8', '14 − [4] = 10', '10 − 4 = {6}'),
  ]],
  // ---------- kelas 2 ----------
  [2, 1, 'hitung angka puluhannya, lalu tempel nol.', 'Puluhan dihitung seperti satuan, lalu tambah nol.', [
    c('3 puluh dan 4 puluh jadi 7 puluh.', '30 + 40', '3 + 4 = [7]', '30 + 40 = {70}'),
    c('7 puluh kurang 2 puluh, sisa 5 puluh.', '70 − 20', '7 − 2 = [5]', '70 − 20 = {50}'),
  ]],
  [2, 2, 'jumlahkan satuannya, genapkan bila lewat 10.', 'Satuan dulu, puluhannya menyusul.', [
    c('8 dipecah jadi 3 dan 5.', '47 + 8', '47 + [3] = 50', '50 + 5 = {55}'),
    c('Puluhannya tetap 30.', '34 + 5', '4 + 5 = [9]', '34 + 5 = {39}'),
  ]],
  [2, 3, 'kurangi satuannya, atau turun ke puluhan dulu.', 'Kalau satuannya kurang, turun ke puluhan bulat dulu.', [
    c('7 dipecah jadi 3 dan 4.', '43 − 7', '43 − [3] = 40', '40 − 4 = {36}'),
    c('Puluhannya tetap 30.', '36 − 4', '6 − 4 = [2]', '36 − 4 = {32}'),
  ]],
  [2, 4, 'kali artinya tambah berulang.', '× 2 dobel, × 10 tempel nol, × 5 setengah dari × 10.', [
    c('4 × 2 artinya dua kali 4.', '4 × 2', '[4 + 4] = 8', '4 × 2 = {8}'),
    c('× 5 itu setengah dari × 10.', '7 × 5', '7 × 10 = [70]', '70 : 2 = {35}'),
    c('× 10: tempel satu nol di belakang.', '6 × 10', '6 × 10 = {60}'),
  ]],
  [2, 5, 'bagi itu kali yang dibalik.', 'Bagi: cari perkalian yang hasilnya pas.', [
    c('5 dikali berapa supaya jadi 35?', '35 : 5', '5 × [7] = 35', '35 : 5 = {7}'),
    c('16 dibagi dua sama rata.', '16 : 2', '[8 + 8] = 16', '16 : 2 = {8}'),
    c(': 10 artinya buang satu nol.', '60 : 10', '60 : 10 = {6}'),
  ]],
  [2, 6, 'lihat tandanya dulu, lalu pilih jurus.', 'Baca tandanya sebelum menghitung.', [
    c('Puluhan dulu, satuan 5 menyusul.', '45 + 30', '40 + 30 = [70]', '70 + 5 = {75}'),
    c('× 5 itu setengah dari × 10.', '6 × 5', '6 × 10 = [60]', '60 : 2 = {30}'),
    c(': 10 artinya buang satu nol.', '40 : 10', '40 : 10 = {4}'),
  ]],
  // ---------- kelas 3 ----------
  [3, 1, '× 4 itu dobel, lalu dobel lagi.', '× 3 itu × 2, lalu tambah satu kali lagi.', [
    c('Dobel 7 jadi 14, dobel 14 jadi 28.', '7 × 4', '7 + 7 = [14]', '14 + 14 = {28}'),
    c('× 3 itu × 2 ditambah satu kali lagi.', '6 × 3', '6 × 2 = [12]', '12 + 6 = {18}'),
  ]],
  [3, 2, 'pakai × 5, lalu tambah sisanya.', '× 6 itu × 5 tambah satu kali, × 7 itu × 5 tambah dua kali.', [
    c('8 × 6 itu 8 × 5 ditambah satu 8.', '8 × 6', '8 × 5 = [40]', '40 + 8 = {48}'),
    c('Tambah dua 7, yaitu 14.', '7 × 7', '7 × 5 = [35]', '35 + 14 = {49}'),
  ]],
  [3, 3, '× 9 itu × 10 dikurangi satu kali.', '× 9 itu × 10 kurang satu kali, × 8 itu × 4 lalu dobel.', [
    c('Kurangi satu 7.', '7 × 9', '7 × 10 = [70]', '70 − 7 = {63}'),
    c('× 8 itu × 4, lalu dobel.', '6 × 8', '6 × 4 = [24]', '24 + 24 = {48}'),
  ]],
  [3, 4, 'cari perkaliannya.', 'Setiap bagi punya pasangan kali.', [
    c('7 dikali berapa supaya jadi 56?', '56 : 7', '7 × [8] = 56', '56 : 7 = {8}'),
    c('9 dikali berapa supaya jadi 54?', '54 : 9', '9 × [6] = 54', '54 : 9 = {6}'),
  ]],
  [3, 5, 'pecah angka kedua jadi puluhan dan satuan.', 'Puluhan dulu, baru satuan.', [
    c('25 dipecah jadi 20 dan 5.', '36 + 25', '36 + [20] = 56', '56 + 5 = {61}'),
    c('28 hampir 30. Kelebihan 2, kembalikan.', '64 − 28', '64 − [30] = 34', '34 + 2 = {36}'),
  ]],
  [3, 6, 'lihat tandanya, untuk bagi pikirkan perkaliannya.', 'Kali dan bagi itu pasangan.', [
    c('Tambah tiga 6, yaitu 18.', '6 × 8', '6 × 5 = [30]', '30 + 18 = {48}'),
    c('9 dikali berapa supaya jadi 63?', '63 : 9', '9 × [7] = 63', '63 : 9 = {7}'),
  ]],
  // ---------- kelas 4 ----------
  [4, 1, 'ingat lagi jurus × 5, × 9, dan dobel.', 'Fakta yang sudah hafal jadi jalan pintas.', [
    c('× 8 itu × 4, lalu dobel.', '7 × 8', '7 × 4 = [28]', '28 + 28 = {56}'),
    c('6 dikali berapa supaya jadi 54?', '54 : 6', '6 × [9] = 54', '54 : 6 = {9}'),
    c('× 9 itu × 10 kurang satu kali.', '9 × 6', '10 × 6 = [60]', '60 − 6 = {54}'),
  ]],
  [4, 2, 'kalikan angka depannya, lalu tempel nolnya.', 'Semua nol ikut ditempel di belakang.', [
    c('Tempel satu nol.', '4 × 30', '4 × 3 = [12]', '4 × 30 = {120}'),
    c('Tempel dua nol.', '20 × 30', '2 × 3 = [6]', '20 × 30 = {600}'),
  ]],
  [4, 3, 'pecah jadi puluhan dan satuan, lalu jumlahkan.', 'Puluhan dikali, satuan dikali, lalu jumlahkan.', [
    c('14 dipecah jadi 10 dan 4.', '14 × 3', '[10 × 3] + 4 × 3', '30 + 12 = {42}'),
    c('23 dipecah jadi 20 dan 3.', '23 × 4', '[20 × 4] + 3 × 4', '80 + 12 = {92}'),
  ]],
  [4, 4, 'pecah angka yang dibagi jadi bagian yang mudah.', 'Ambil dulu bagian yang mudah dibagi, misalnya 40 untuk : 4.', [
    c('48 dipecah jadi 40 dan 8.', '48 : 4', '[40] : 4 + [8] : 4', '10 + 2 = {12}'),
    c('75 dipecah jadi 50 dan 25.', '75 : 5', '[50] : 5 + 25 : 5', '10 + 5 = {15}'),
  ]],
  [4, 5, 'lepas nolnya dulu, lalu kembalikan.', 'Nol yang dilepas harus dikembalikan.', [
    c('25 puluh tambah 13 puluh jadi 38 puluh.', '250 + 130', '25 + 13 = [38]', '250 + 130 = {380}'),
    c('40 puluh kurang 15 puluh, sisa 25 puluh.', '400 − 150', '40 − 15 = [25]', '400 − 150 = {250}'),
  ]],
  [4, 6, 'lihat soalnya, lalu pilih jurus yang cocok.', 'Ada nol, tempel nol; ada puluhan, pecah dulu.', [
    c('Tempel satu nol.', '6 × 40', '6 × 4 = [24]', '6 × 40 = {240}'),
    c('18 dipecah jadi 10 dan 8.', '18 × 3', '[10 × 3] + 8 × 3', '30 + 24 = {54}'),
    c('84 dipecah jadi 60 dan 24.', '84 : 6', '[60] : 6 + 24 : 6', '10 + 4 = {14}'),
  ]],
  // ---------- kelas 5 ----------
  [5, 1, 'pecah puluhan dan satuan, atau dobel dua kali.', '× 4 itu dobel dua kali, × 5 setengah dari × 10.', [
    c('24 dipecah jadi 20 dan 4.', '24 × 6', '[20 × 6] + 4 × 6', '120 + 24 = {144}'),
    c('× 4 itu dobel, lalu dobel lagi.', '35 × 4', '35 + 35 = [70]', '70 + 70 = {140}'),
    c('× 5 itu setengah dari × 10.', '26 × 5', '26 × 10 = [260]', '260 : 2 = {130}'),
  ]],
  [5, 2, 'lepas nolnya, bagi, lalu kembalikan nolnya.', 'Nol yang dilepas di awal, kembalikan di akhir.', [
    c('Kembalikan satu nol.', '240 : 6', '24 : 6 = [4]', '240 : 6 = {40}'),
    c('Atau pecah jadi bagian yang mudah dibagi.', '96 : 4', '[80] : 4 + 16 : 4', '20 + 4 = {24}'),
  ]],
  [5, 3, 'jumlahkan dua angkanya untuk × 11, pakai 100 untuk × 25.', 'Empat kali 25 sama dengan 100.', [
    c('5 ditaruh di antara 2 dan 3.', '23 × 11', '2 + 3 = [5]', '23 × 11 = {253}'),
    c('× 25 itu × 100, lalu : 4.', '12 × 25', '12 × 100 = [1200]', '1200 : 4 = {300}'),
    c('Bisa juga : 4 dulu, lalu × 100.', '8 × 25', '8 : 4 = [2]', '2 × 100 = {200}'),
  ]],
  [5, 4, 'kuadrat artinya dikali dirinya sendiri.', 'Hafalkan 11² sampai 15²: 121, 144, 169, 196, 225.', [
    c('13 × 3 = 39, lalu tambahkan.', '13 × 13', '13 × 10 = [130]', '130 + 39 = {169}'),
    c('Angka kecil di atas artinya dikali dirinya.', '7²', '7² = [7 × 7]', '7 × 7 = {49}'),
  ]],
  [5, 5, 'bagi dengan angka bawah, kali dengan angka atas.', 'Angka bawah membagi, angka atas mengali.', [
    c('Bagi 4 dulu, lalu kali 3.', '3/4 dari 24', '24 : 4 = [6]', '6 × 3 = {18}'),
    c('Setengah artinya bagi 2.', '1/2 dari 18', '18 : 2 = {9}'),
    c('Bagi 3 dulu, lalu kali 2.', '2/3 dari 15', '15 : 3 = [5]', '5 × 2 = {10}'),
  ]],
  [5, 6, 'kenali jenis soalnya, lalu pakai jurusnya.', 'Baca soal sampai habis sebelum menghitung.', [
    c('× 5 itu setengah dari × 10.', '26 × 5', '26 × 10 = [260]', '260 : 2 = {130}'),
    c('Sepertiga artinya bagi 3.', '1/3 dari 27', '27 : 3 = {9}'),
    c('5 ditaruh di antara 2 dan 3.', '23 × 11', '2 + 3 = [5]', '23 × 11 = {253}'),
  ]],
  // ---------- kelas 6 ----------
  [6, 1, 'kuadrat: angka dikali dirinya sendiri; akar adalah kebalikannya.', 'Kuadrat dan akar saling membalik.', [
    c('Angka berapa dikali dirinya jadi 144?', '√144', '[12] × 12 = 144', '√144 = {12}'),
    c('Berakhiran 5: angka depan 1 dikali angka sesudahnya 2, hasilnya 2, lalu tempel 25.', '15²', '1 × 2 = [2]', '15² = {225}'),
    c(null, '√81', '[9] × 9 = 81', '√81 = {9}'),
  ]],
  [6, 2, 'ubah dulu ke per seratus.', 'Persen artinya per seratus.', [
    c('75 per seratus sama dengan 75%.', '3/4 = … %', '3/4 = [75/100]', '3/4 = {75%}'),
    c('40 per seratus sama dengan 40%.', '0,4 = … %', '0,4 = [40/100]', '0,4 = {40%}'),
    c('20 per seratus sama dengan 0,2.', '20% = … (desimal)', '20% = [20/100]', '20/100 = {0,2}'),
  ]],
  [6, 3, 'tulis kelipatan atau pembagi, lalu cari yang sama.', 'KPK tidak pernah lebih kecil dari angka yang terbesar.', [
    c('12 muncul di kedua baris.', 'KPK 4 dan 6', '4 → 4, 8, [12]', '6 → 6, {12}'),
    c('6 pembagi terbesar yang membagi habis keduanya.', 'FPB 12 dan 18', '12 : [6] = 2', '18 : {6} = 3'),
  ]],
  [6, 4, 'ubah persen jadi bagi yang mudah.', '10% bagi 10, 50% bagi 2, 25% bagi 4, 20% bagi 5.', [
    c('25% sama dengan seperempat.', '25% dari 80', '25% = [1/4]', '80 : 4 = {20}'),
    c('75% itu bagi 4, lalu kali 3.', '75% dari 40', '40 : 4 = [10]', '10 × 3 = {30}'),
    c('10% artinya bagi 10.', '10% dari 70', '70 : 10 = {7}'),
  ]],
  [6, 5, 'kurung dulu, lalu kali dan bagi, baru tambah dan kurang.', 'Kurung, lalu × dan :, baru + dan −.', [
    c('× dikerjakan sebelum +.', '3 + 4 × 5', '[4 × 5] = 20', '3 + 20 = {23}'),
    c('Kurung paling dulu.', '(2 + 3) × 4', '[2 + 3] = 5', '5 × 4 = {20}'),
    c(': dikerjakan sebelum +.', '24 : 6 + 7', '[24 : 6] = 4', '4 + 7 = {11}'),
  ]],
  [6, 6, 'kenali jenis soalnya dulu, lalu pakai jurusnya.', 'Setiap jenis soal punya jurusnya sendiri.', [
    c('Angka berapa dikali dirinya jadi 81?', '√81', '[9] × 9 = 81', '√81 = {9}'),
    c('25 per seratus sama dengan 25%.', '1/4 = … %', '1/4 = [25/100]', '1/4 = {25%}'),
    c('50% artinya setengah.', '50% dari 64', '64 : 2 = {32}'),
  ]],
];

export const JURUS: Record<string, Jurus> = Object.fromEntries(
  ISI.map(([kelas, level, inti, ingat, contoh]) => [
    `${kelas}-${level}`,
    { kelas, level, inti, contoh, ingat, status: 'belum_diperiksa' } satisfies Jurus,
  ]),
);

export function ambilJurus(kelas: number, level: number): Jurus | null {
  return JURUS[`${kelas}-${level}`] ?? null;
}
