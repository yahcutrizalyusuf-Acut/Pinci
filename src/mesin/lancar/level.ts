/**
 * Definisi 6 level per kelas (kelas 1–6). Isi mengikuti purwarupa v5 dan
 * `docs/rancangan/01-produk/04-mesin-lancar.md` bagian 4 dan 4.1.
 */
import type { Acak } from './acak';
import {
  bagi,
  bagiBelasan,
  bagiPuluhan,
  campur,
  duaPuluhan,
  kali,
  kali11Dan25,
  kali2d1Besar,
  kali2d1Kecil,
  kaliPuluhan,
  kpkFpb,
  kuadrat15,
  kuadratDanAkar,
  kurang10,
  kurang20,
  kurang2d1,
  kurang2d2,
  pecahanDari,
  pecahanPersenDesimal,
  persenMudah,
  puluhan,
  ratusan,
  tambah10,
  tambah20,
  tambah2d1,
  tambah2d2,
  tambahBelasan,
  urutanOperasi,
  type PembuatSoal,
  type SoalMentah,
} from './pembuat-soal';

export const JUMLAH_KELAS = 6;
export const LEVEL_PER_KELAS = 6;
/** Banyak calon soal yang dibuat per level sebelum dipilih untuk lembar. */
export const UKURAN_KUMPULAN = 24;

export interface DefinisiLevel {
  kelas: number;
  level: number;
  nama: string;
  /** Keterangan singkat untuk anak dan orang tua. */
  keterangan: string;
  contoh: string;
  /** Target detik per soal (04-mesin-lancar.md bagian 4.1). */
  targetDetik: number;
  /** Pembuat soal: kumpulan soal unik, urut dari mudah ke sulit. */
  buatKumpulan: (r: Acak) => SoalMentah[];
}

type Isian = Omit<DefinisiLevel, 'kelas' | 'level'>;

const satu =
  (p: PembuatSoal) =>
  (r: Acak): SoalMentah[] =>
    p(r, UKURAN_KUMPULAN);

const TABEL_3_9 = [3, 4, 6, 7, 8, 9] as const;
const TABEL_2_9 = [2, 3, 4, 5, 6, 7, 8, 9] as const;

const ISI: readonly (readonly Isian[])[] = [
  // ---------- kelas 1 ----------
  [
    { nama: 'Tambah sampai 10', keterangan: 'Penjumlahan dua bilangan, hasilnya paling besar 10.', contoh: '4 + 5', targetDetik: 3, buatKumpulan: satu(tambah10) },
    { nama: 'Kurang sampai 10', keterangan: 'Pengurangan dari bilangan paling besar 10.', contoh: '9 − 4', targetDetik: 3, buatKumpulan: satu(kurang10) },
    { nama: 'Tambah belasan', keterangan: 'Bilangan belasan ditambah satuan, tanpa lewat 20.', contoh: '13 + 5', targetDetik: 3, buatKumpulan: satu(tambahBelasan) },
    { nama: 'Tambah sampai 20', keterangan: 'Penjumlahan dua satuan yang hasilnya lewat 10.', contoh: '8 + 7', targetDetik: 3.5, buatKumpulan: satu(tambah20) },
    { nama: 'Kurang sampai 20', keterangan: 'Pengurangan dari bilangan belasan.', contoh: '15 − 7', targetDetik: 3.5, buatKumpulan: satu(kurang20) },
    { nama: 'Campur sampai 20', keterangan: 'Tambah dan kurang sampai 20 dicampur.', contoh: '9 + 6, 14 − 8', targetDetik: 3.5, buatKumpulan: (r) => campur(r, [[tambah20, 12], [kurang20, 12]]) },
  ],
  // ---------- kelas 2 ----------
  [
    { nama: 'Tambah dan kurang puluhan', keterangan: 'Puluhan bulat ditambah atau dikurangi.', contoh: '30 + 40, 70 − 20', targetDetik: 3, buatKumpulan: satu(puluhan) },
    { nama: '2 angka tambah 1 angka', keterangan: 'Bilangan 2 angka ditambah satuan.', contoh: '34 + 5, 47 + 8', targetDetik: 3.5, buatKumpulan: satu(tambah2d1) },
    { nama: '2 angka kurang 1 angka', keterangan: 'Bilangan 2 angka dikurangi satuan.', contoh: '36 − 4, 43 − 7', targetDetik: 3.5, buatKumpulan: satu(kurang2d1) },
    { nama: 'Kali 2, 5, dan 10', keterangan: 'Perkalian dengan 2, 5, dan 10.', contoh: '7 × 5', targetDetik: 3, buatKumpulan: satu(kali([2, 5, 10])) },
    { nama: 'Bagi 2, 5, dan 10', keterangan: 'Pembagian dengan 2, 5, dan 10.', contoh: '35 : 5', targetDetik: 3, buatKumpulan: satu(bagi([2, 5, 10])) },
    { nama: 'Campur kelas 2', keterangan: 'Tambah kurang puluhan, kali, dan bagi dicampur.', contoh: '45 + 30, 6 × 5, 40 : 10', targetDetik: 4, buatKumpulan: (r) => campur(r, [[duaPuluhan, 12], [kali([2, 5, 10]), 6], [bagi([2, 5, 10]), 6]]) },
  ],
  // ---------- kelas 3 ----------
  [
    { nama: 'Kali 3 dan 4', keterangan: 'Perkalian dengan 3 dan 4.', contoh: '7 × 4', targetDetik: 3, buatKumpulan: satu(kali([3, 4], 2)) },
    { nama: 'Kali 6 dan 7', keterangan: 'Perkalian dengan 6 dan 7.', contoh: '8 × 6', targetDetik: 3, buatKumpulan: satu(kali([6, 7], 2)) },
    { nama: 'Kali 8 dan 9', keterangan: 'Perkalian dengan 8 dan 9.', contoh: '7 × 9', targetDetik: 3, buatKumpulan: satu(kali([8, 9], 2)) },
    { nama: 'Bagi dari tabel', keterangan: 'Pembagian yang dibalik dari tabel perkalian.', contoh: '56 : 7', targetDetik: 3.5, buatKumpulan: satu(bagi(TABEL_3_9, 2)) },
    { nama: 'Tambah dan kurang 2 angka', keterangan: 'Bilangan 2 angka ditambah atau dikurangi bilangan 2 angka.', contoh: '36 + 25, 64 − 28', targetDetik: 6, buatKumpulan: (r) => campur(r, [[tambah2d2, 12], [kurang2d2, 12]]) },
    { nama: 'Campur kali dan bagi', keterangan: 'Perkalian dan pembagian tabel dicampur.', contoh: '6 × 8, 63 : 9', targetDetik: 3.5, buatKumpulan: (r) => campur(r, [[kali(TABEL_2_9, 2), 12], [bagi(TABEL_2_9, 2), 12]]) },
  ],
  // ---------- kelas 4 ----------
  [
    { nama: 'Pemanasan tabel', keterangan: 'Perkalian dan pembagian tabel untuk pemanasan.', contoh: '7 × 8, 54 : 6', targetDetik: 3, buatKumpulan: (r) => campur(r, [[kali(TABEL_3_9, 2), 12], [bagi(TABEL_3_9, 2), 12]]) },
    { nama: 'Kali puluhan dan ratusan', keterangan: 'Kalikan angka depannya, lalu tempel nolnya.', contoh: '4 × 30, 20 × 30', targetDetik: 4, buatKumpulan: satu(kaliPuluhan) },
    { nama: '2 angka kali 1 angka', keterangan: 'Bilangan 2 angka dikali satuan, hasil paling besar 150.', contoh: '14 × 3, 23 × 4', targetDetik: 6, buatKumpulan: satu(kali2d1Kecil) },
    { nama: 'Bagi hasil belasan', keterangan: 'Pembagian yang hasilnya bilangan belasan.', contoh: '48 : 4, 75 : 5', targetDetik: 6, buatKumpulan: satu(bagiBelasan) },
    { nama: 'Tambah dan kurang ratusan', keterangan: 'Ratusan dan puluhan ditambah atau dikurangi.', contoh: '250 + 130, 400 − 150', targetDetik: 6, buatKumpulan: satu(ratusan) },
    { nama: 'Campur kelas 4', keterangan: 'Kali puluhan, 2 angka kali 1 angka, dan bagi dicampur.', contoh: '6 × 40, 18 × 3, 84 : 6', targetDetik: 5, buatKumpulan: (r) => campur(r, [[kaliPuluhan, 8], [kali2d1Kecil, 8], [bagiBelasan, 8]]) },
  ],
  // ---------- kelas 5 ----------
  [
    { nama: '2 angka kali 1 angka', keterangan: 'Bilangan 2 angka dikali satuan, hasil paling besar 200.', contoh: '24 × 6, 35 × 4', targetDetik: 6, buatKumpulan: satu(kali2d1Besar) },
    { nama: 'Bagi puluhan', keterangan: 'Pembagian yang hasilnya puluhan atau belasan.', contoh: '240 : 6, 96 : 4', targetDetik: 5, buatKumpulan: satu(bagiPuluhan) },
    { nama: 'Kali 11 dan kali 25', keterangan: 'Jurus cepat kali 11 dan kali 25.', contoh: '23 × 11, 12 × 25', targetDetik: 5, buatKumpulan: satu(kali11Dan25) },
    { nama: 'Bilangan kuadrat', keterangan: 'Bilangan dikali dirinya sendiri, sampai 15.', contoh: '12 × 12, 7²', targetDetik: 4, buatKumpulan: satu(kuadrat15) },
    { nama: 'Pecahan dari bilangan', keterangan: 'Setengah, sepertiga, seperempat, dan lainnya dari sebuah bilangan.', contoh: '1/2 dari 18, 3/4 dari 24', targetDetik: 5, buatKumpulan: satu(pecahanDari) },
    { nama: 'Campur kelas 5', keterangan: 'Kali, bagi, kali 11 dan 25, serta pecahan dicampur.', contoh: '26 × 5, 1/3 dari 27, 23 × 11', targetDetik: 5.5, buatKumpulan: (r) => campur(r, [[kali2d1Besar, 6], [bagiPuluhan, 6], [kali11Dan25, 6], [pecahanDari, 6]]) },
  ],
  // ---------- kelas 6 ----------
  [
    { nama: 'Kuadrat dan akar', keterangan: 'Kuadrat dan akar kuadrat sampai 15.', contoh: '15², √144', targetDetik: 4, buatKumpulan: satu(kuadratDanAkar) },
    { nama: 'Pecahan, persen, desimal', keterangan: 'Ubah pecahan, persen, dan desimal yang setara.', contoh: '3/4 = … %, 0,4 = … %', targetDetik: 5, buatKumpulan: satu(pecahanPersenDesimal) },
    { nama: 'KPK dan FPB', keterangan: 'KPK dan FPB dua bilangan kecil.', contoh: 'KPK 4 dan 6, FPB 12 dan 18', targetDetik: 6, buatKumpulan: satu(kpkFpb) },
    { nama: 'Persen mudah', keterangan: 'Persen dari sebuah bilangan.', contoh: '25% dari 80', targetDetik: 5, buatKumpulan: satu(persenMudah) },
    { nama: 'Urutan operasi', keterangan: 'Kurung dulu, lalu kali dan bagi, baru tambah dan kurang.', contoh: '3 + 4 × 5', targetDetik: 7, buatKumpulan: satu(urutanOperasi) },
    { nama: 'Campur kelas 6', keterangan: 'Semua jenis soal kelas 6 dicampur.', contoh: '√81, 1/4 = … %, KPK 3 dan 4, 50% dari 64', targetDetik: 5.5, buatKumpulan: (r) => campur(r, [[kuadratDanAkar, 5], [pecahanPersenDesimal, 5], [kpkFpb, 5], [persenMudah, 5], [urutanOperasi, 4]]) },
  ],
];

export function periksaKelasLevel(kelas: number, level: number): void {
  if (!Number.isInteger(kelas) || kelas < 1 || kelas > JUMLAH_KELAS) throw new RangeError(`Kelas ${kelas} tidak ada (1–${JUMLAH_KELAS}).`);
  if (!Number.isInteger(level) || level < 1 || level > LEVEL_PER_KELAS) throw new RangeError(`Level ${level} tidak ada (1–${LEVEL_PER_KELAS}).`);
}

/** Semua level, berindeks [kelas - 1][level - 1]. */
export const LEVEL_LANCAR: readonly (readonly DefinisiLevel[])[] = ISI.map((daftar, ik) =>
  daftar.map((isi, il) => ({ ...isi, kelas: ik + 1, level: il + 1 })),
);

export function ambilLevel(kelas: number, level: number): DefinisiLevel {
  periksaKelasLevel(kelas, level);
  const def = LEVEL_LANCAR[kelas - 1]?.[level - 1];
  if (!def) throw new RangeError(`Level ${level} kelas ${kelas} tidak ada.`);
  return def;
}

export function daftarLevel(kelas: number): readonly DefinisiLevel[] {
  periksaKelasLevel(kelas, 1);
  return LEVEL_LANCAR[kelas - 1] ?? [];
}
