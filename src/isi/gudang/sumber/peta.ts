import type { KodeMapel, MapelGudang, PaketGudang, TopikGudang } from '../jenis';
import { buatKartu, type KartuMentah } from './bantu';
import { KARTU_BI } from './bi';
import { KARTU_MAT_BILANGAN } from './mat-bilangan';
import { KARTU_MAT_DATA } from './mat-data';
import { KARTU_MAT_UKUR } from './mat-ukur';

/**
 * Peta topik Gudang Ilmu kelas 6. Urutan di daftar = urutan di peta.
 * Topik tanpa kartu otomatis `segera: true`.
 */

interface TopikMentah {
  id: string;
  judul: string;
  ringkas: string;
  prasyarat?: string[];
  bersamaOrtu?: boolean;
}

const PETA_MAT: TopikMentah[] = [
  { id: 'mat6-urutan-hitung', judul: 'Operasi hitung campuran', ringkas: 'Kurung dulu, lalu kali-bagi, lalu tambah-kurang.' },
  {
    id: 'mat6-bilangan-bulat',
    judul: 'Bilangan bulat negatif',
    ringkas: 'Bilangan di bawah nol pada garis bilangan.',
    prasyarat: ['mat6-urutan-hitung'],
  },
  { id: 'mat6-faktor-kelipatan', judul: 'Faktor dan kelipatan', ringkas: 'Pembagi habis, loncat hitung, dan bilangan prima.' },
  { id: 'mat6-kpk-fpb', judul: 'KPK dan FPB', ringkas: 'Bertemu lagi pakai KPK, membagi rata pakai FPB.', prasyarat: ['mat6-faktor-kelipatan'] },
  { id: 'mat6-pecahan-senilai', judul: 'Pecahan senilai', ringkas: 'Angka beda, besarnya sama.', prasyarat: ['mat6-faktor-kelipatan'] },
  {
    id: 'mat6-banding-pecahan',
    judul: 'Membandingkan pecahan',
    ringkas: 'Samakan penyebut, lalu bandingkan.',
    prasyarat: ['mat6-pecahan-senilai', 'mat6-kpk-fpb'],
  },
  { id: 'mat6-pecahan-desimal', judul: 'Pecahan dan desimal', ringkas: 'Per sepuluh dan per seratus.', prasyarat: ['mat6-pecahan-senilai'] },
  { id: 'mat6-persen', judul: 'Persen', ringkas: 'Persen artinya per seratus.', prasyarat: ['mat6-pecahan-desimal'] },
  {
    id: 'mat6-tambah-kurang-pecahan',
    judul: 'Tambah dan kurang pecahan',
    ringkas: 'Samakan penyebut, lalu hitung pembilang.',
    prasyarat: ['mat6-banding-pecahan'],
  },
  { id: 'mat6-kali-pecahan', judul: 'Perkalian pecahan', ringkas: 'Atas kali atas, bawah kali bawah.', prasyarat: ['mat6-pecahan-senilai'] },
  { id: 'mat6-bagi-pecahan', judul: 'Pembagian pecahan', ringkas: 'Balik pembagi, lalu kalikan.', prasyarat: ['mat6-kali-pecahan'] },
  {
    id: 'mat6-hitung-campuran-bentuk',
    judul: 'Hitung pecahan, desimal, dan persen',
    ringkas: 'Samakan bentuk dulu, lalu hitung.',
    prasyarat: ['mat6-urutan-hitung', 'mat6-persen', 'mat6-tambah-kurang-pecahan', 'mat6-bagi-pecahan'],
  },
  {
    id: 'mat6-satuan-panjang-berat',
    judul: 'Satuan panjang dan berat',
    ringkas: 'Tangga satuan km sampai mm, kg sampai g.',
    prasyarat: ['mat6-pecahan-desimal'],
    bersamaOrtu: true,
  },
  {
    id: 'mat6-satuan-volume',
    judul: 'Satuan volume dan liter',
    ringkas: '1 L = 1.000 mL = 1.000 cm³.',
    prasyarat: ['mat6-satuan-panjang-berat'],
    bersamaOrtu: true,
  },
  { id: 'mat6-lama-waktu', judul: 'Lama waktu', ringkas: 'Jam, menit, dan menghitung lama perjalanan.', bersamaOrtu: true },
  {
    id: 'mat6-kecepatan',
    judul: 'Kecepatan, jarak, dan waktu',
    ringkas: 'Kecepatan = jarak : waktu.',
    prasyarat: ['mat6-lama-waktu', 'mat6-satuan-panjang-berat'],
  },
  { id: 'mat6-laju-perubahan', judul: 'Laju perubahan', ringkas: 'Naik atau turun tetap setiap selang waktu.', prasyarat: ['mat6-kecepatan'] },
  {
    id: 'mat6-keliling-luas',
    judul: 'Keliling dan luas',
    ringkas: 'Pagar untuk keliling, ubin untuk luas.',
    prasyarat: ['mat6-urutan-hitung'],
    bersamaOrtu: true,
  },
  {
    id: 'mat6-luas-segitiga-segi4',
    judul: 'Luas segitiga, jajargenjang, dan trapesium',
    ringkas: 'Alas, tinggi, dan bangun gabungan.',
    prasyarat: ['mat6-keliling-luas'],
  },
  { id: 'mat6-lingkaran', judul: 'Lingkaran', ringkas: 'Jari-jari, diameter, keliling, dan luas lingkaran.', prasyarat: ['mat6-luas-segitiga-segi4'] },
  { id: 'mat6-sudut', judul: 'Sudut', ringkas: 'Garis lurus 180°, segitiga 180°, jarum jam.' },
  { id: 'mat6-kekongruenan', judul: 'Kekongruenan', ringkas: 'Bentuk dan ukuran sama persis.', prasyarat: ['mat6-sudut'] },
  { id: 'mat6-pembulatan', judul: 'Pembulatan dan penaksiran', ringkas: 'Bulatkan, lalu taksir hasilnya.', prasyarat: ['mat6-urutan-hitung'] },
  {
    id: 'mat6-volume-kubus-balok',
    judul: 'Volume kubus dan balok',
    ringkas: 'Panjang × lebar × tinggi.',
    prasyarat: ['mat6-keliling-luas'],
    bersamaOrtu: true,
  },
  { id: 'mat6-luas-permukaan', judul: 'Luas permukaan', ringkas: 'Kertas pembungkus kubus dan balok.', prasyarat: ['mat6-volume-kubus-balok'] },
  {
    id: 'mat6-tampak-kubus',
    judul: 'Susunan kubus dan tampak',
    ringkas: 'Denah angka, tampak depan, samping, dan atas.',
    prasyarat: ['mat6-volume-kubus-balok'],
    bersamaOrtu: true,
  },
  { id: 'mat6-koordinat', judul: 'Koordinat', ringkas: 'Letak titik pada bidang berpetak.', prasyarat: ['mat6-tampak-kubus'] },
  { id: 'mat6-rasio', judul: 'Rasio dan perbandingan', ringkas: 'Model batang untuk bagian, jumlah, dan selisih.', prasyarat: ['mat6-kpk-fpb', 'mat6-pecahan-senilai'] },
  {
    id: 'mat6-senilai-berbalik',
    judul: 'Perbandingan senilai dan berbalik nilai',
    ringkas: 'Sama-sama naik, atau satu naik satu turun.',
    prasyarat: ['mat6-rasio'],
  },
  {
    id: 'mat6-skala',
    judul: 'Skala peta',
    ringkas: 'Jarak di peta dan jarak sebenarnya.',
    prasyarat: ['mat6-senilai-berbalik', 'mat6-satuan-panjang-berat'],
    bersamaOrtu: true,
  },
  { id: 'mat6-diagram', judul: 'Piktogram, diagram batang, dan tabel', ringkas: 'Baca kunci dan garis tegak lebih dulu.' },
  { id: 'mat6-rata-rata', judul: 'Rata-rata', ringkas: 'Jumlah data dibagi banyak data.', prasyarat: ['mat6-diagram'] },
  { id: 'mat6-modus-median', judul: 'Modus dan median', ringkas: 'Data terbanyak dan data tengah.', prasyarat: ['mat6-rata-rata'] },
];

const PETA_BI: TopikMentah[] = [
  { id: 'bi6-membaca-soal', judul: 'Membaca soal bacaan', ringkas: 'Baca pertanyaan dulu, lalu cari di teks.' },
  { id: 'bi6-informasi-tersurat', judul: 'Informasi tersurat', ringkas: 'Jawaban yang tertulis jelas di teks.', prasyarat: ['bi6-membaca-soal'] },
  { id: 'bi6-arti-kata', judul: 'Arti kata dari konteks', ringkas: 'Temukan arti dari kalimat di sekitarnya.', prasyarat: ['bi6-informasi-tersurat'] },
  { id: 'bi6-kata-baku', judul: 'Kata baku', ringkas: 'Memilih kata yang sesuai kaidah.', prasyarat: ['bi6-arti-kata'] },
  { id: 'bi6-urutan-peristiwa', judul: 'Urutan peristiwa dan ikhtisar', ringkas: 'Kata penanda waktu dan ringkasan.', prasyarat: ['bi6-informasi-tersurat'] },
  { id: 'bi6-ide-pokok', judul: 'Ide pokok', ringkas: 'Hal yang paling banyak dibicarakan.', prasyarat: ['bi6-informasi-tersurat'] },
  { id: 'bi6-jenis-teks', judul: 'Jenis teks', ringkas: 'Cerita, laporan, petunjuk, dan ajakan.', prasyarat: ['bi6-ide-pokok'] },
  { id: 'bi6-kalimat-efektif', judul: 'Kalimat efektif', ringkas: 'Kalimat yang jelas dan tidak berlebihan.', prasyarat: ['bi6-ide-pokok'] },
  { id: 'bi6-watak-tokoh', judul: 'Watak tokoh', ringkas: 'Sifat tokoh dari perbuatan dan ucapannya.', prasyarat: ['bi6-informasi-tersurat'] },
  { id: 'bi6-amanat', judul: 'Amanat cerita', ringkas: 'Pesan yang ingin disampaikan penulis.', prasyarat: ['bi6-watak-tokoh'] },
  {
    id: 'bi6-perubahan-tokoh-latar',
    judul: 'Perubahan tokoh dan latar',
    ringkas: 'Bandingkan awal dan akhir cerita.',
    prasyarat: ['bi6-watak-tokoh'],
  },
  { id: 'bi6-ungkapan-majas', judul: 'Ungkapan dan majas', ringkas: 'Arti kiasan dari kalimat di sekitarnya.', prasyarat: ['bi6-arti-kata'] },
  { id: 'bi6-fakta-opini', judul: 'Fakta dan opini', ringkas: 'Bisa dibuktikan atau hanya pendapat?', prasyarat: ['bi6-informasi-tersurat'] },
  {
    id: 'bi6-infografik',
    judul: 'Membaca infografik dan tabel',
    ringkas: 'Hubungkan tulisan dengan gambar.',
    prasyarat: ['bi6-informasi-tersurat'],
    bersamaOrtu: true,
  },
  { id: 'bi6-relevansi', judul: 'Relevan atau tidak', ringkas: 'Cari alasannya di nomor kalimat.', prasyarat: ['bi6-ide-pokok'] },
  { id: 'bi6-simpulan', judul: 'Menyimpulkan isi teks', ringkas: 'Mengambil keputusan dari beberapa informasi.', prasyarat: ['bi6-relevansi'] },
  { id: 'bi6-puisi', judul: 'Puisi dan perasaan', ringkas: 'Perasaan dari pilihan kata.', prasyarat: ['bi6-arti-kata'], bersamaOrtu: true },
];

function susunMapel(kode: KodeMapel, peta: TopikMentah[], kartu: KartuMentah[]): MapelGudang {
  const kartuPer = new Map<string, KartuMentah>();
  for (const k of kartu) {
    if (kartuPer.has(k.topik)) throw new Error(`Kartu ganda untuk ${k.topik}`);
    if (!peta.some((t) => t.id === k.topik)) throw new Error(`Kartu ${k.topik} tidak ada di peta`);
    kartuPer.set(k.topik, k);
  }
  const topik: TopikGudang[] = peta.map((t, i) => {
    const mentah = kartuPer.get(t.id);
    const hasil: TopikGudang = {
      id: t.id,
      judul: t.judul,
      ringkas: t.ringkas,
      urutan: i + 1,
      prasyarat: t.prasyarat ?? [],
      bersamaOrtu: t.bersamaOrtu ?? false,
      segera: mentah === undefined,
    };
    if (mentah) hasil.kartu = buatKartu(mentah);
    return hasil;
  });
  return { kode, topik };
}

export const VERSI_GUDANG = '1.0.0';
export const TANGGAL_GUDANG = '2026-10-29';

export function bangunPaketGudang(): PaketGudang {
  return {
    id: 'gudang-k6',
    versi: VERSI_GUDANG,
    kelas: 6,
    dibuat: TANGGAL_GUDANG,
    sumber: 'Ditulis ulang dari modul kursus TKA SD M01–M24 dan B01–B12 (bahan/kursus-tka-sd).',
    mapel: [
      susunMapel('mat', PETA_MAT, [...KARTU_MAT_BILANGAN, ...KARTU_MAT_UKUR, ...KARTU_MAT_DATA]),
      susunMapel('bi', PETA_BI, KARTU_BI),
    ],
  };
}
