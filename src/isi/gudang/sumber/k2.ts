import { bagian, contoh, isian, pg } from './bantu';
import type { SumberKelas } from './peta';

/**
 * Gudang Ilmu kelas 2, tahap 1: 4 kartu Matematika dan 2 kartu Bahasa Indonesia.
 * Ditulis sendiri (belum diperiksa guru). Kunci Matematika dihitung ulang oleh uji.
 */
export const SUMBER_K2: SumberKelas = {
  kelas: 2,
  versi: '0.1.0',
  dibuat: '2026-10-31',
  petaMat: [
    { id: 'mat2-nilai-tempat', judul: 'Puluhan dan satuan', ringkas: '45 artinya 4 puluhan dan 5 satuan.' },
    { id: 'mat2-tambah-100', judul: 'Penjumlahan sampai 100', ringkas: 'Satuan dulu, lalu puluhan.', prasyarat: ['mat2-nilai-tempat'] },
    { id: 'mat2-kurang-100', judul: 'Pengurangan sampai 100', ringkas: 'Kalau satuan kurang, pinjam satu puluhan.', prasyarat: ['mat2-tambah-100'] },
    { id: 'mat2-kali-ulang', judul: 'Perkalian sebagai tambah berulang', ringkas: '3 × 4 artinya 4 + 4 + 4.', prasyarat: ['mat2-tambah-100'], bersamaOrtu: true },
    { id: 'mat2-bagi-rata', judul: 'Membagi rata', ringkas: 'Bagikan sama banyak.', prasyarat: ['mat2-kali-ulang'] },
    { id: 'mat2-panjang', judul: 'Mengukur panjang', ringkas: 'Penggaris dan satuan sentimeter.', bersamaOrtu: true },
    { id: 'mat2-jam', judul: 'Membaca jam', ringkas: 'Jarum pendek untuk jam, jarum panjang untuk menit.' },
    { id: 'mat2-bangun-datar', judul: 'Bangun datar', ringkas: 'Segi tiga, segi empat, dan lingkaran.' },
  ],
  petaBi: [
    { id: 'bi2-huruf-kapital', judul: 'Huruf kapital', ringkas: 'Awal kalimat dan nama orang memakai huruf besar.' },
    { id: 'bi2-kata-sifat', judul: 'Kata sifat', ringkas: 'Kata yang menjelaskan keadaan benda.' },
    { id: 'bi2-tanda-baca', judul: 'Titik dan tanda tanya', ringkas: 'Akhir kalimat berita dan kalimat tanya.', prasyarat: ['bi2-huruf-kapital'] },
    { id: 'bi2-urutan-cerita', judul: 'Urutan cerita', ringkas: 'Mula-mula, lalu, akhirnya.', bersamaOrtu: true },
  ],
  kartuMat: [
    {
      topik: 'mat2-nilai-tempat',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Bilangan dua angka punya puluhan dan satuan. Angka kiri adalah puluhan.', { jenis: 'petak', baris: 3, kolom: 10, terisi: 23 }),
        bagian('Angka kanan adalah satuan. 23 artinya 2 puluhan dan 3 satuan.'),
      ],
      contoh: [
        contoh('Berapa puluhan pada bilangan 47?', ['Angka kiri adalah 4.', 'Jadi ada 4 puluhan.'], '4'),
        contoh('3 puluhan dan 6 satuan adalah bilangan berapa?', ['3 puluhan = 30.', '30 + 6 = 36.'], '36'),
      ],
      soal: [
        isian('Berapa satuan pada bilangan 58?', '8', ['Satuan ada di sebelah kanan.', 'Lihat angka paling kanan pada 58.', 'Angka paling kanan adalah 8.'], 'Angka kanan 58 adalah 8, jadi ada 8 satuan.', '58 - 50'),
        isian('5 puluhan dan 2 satuan adalah bilangan berapa?', '52', ['1 puluhan sama dengan 10.', '5 puluhan = 50.', 'Tambahkan 2 satuan ke 50.'], '5 puluhan = 50. 50 + 2 = 52.', '5 * 10 + 2'),
        pg('Bilangan manakah yang punya 7 puluhan?', ['17', '70', '107', '7'], 1, ['Puluhan ada di angka kiri bilangan dua angka.', 'Cari bilangan dua angka yang angka kirinya 7.', '70 = 7 puluhan dan 0 satuan.'], '70 punya 7 puluhan. Pada 17, angka 7 adalah satuan.'),
        isian('Nanda punya 4 ikat lidi. Satu ikat berisi 10 lidi. Ia juga punya 9 lidi lepas. Berapa semua lidinya?', '49', ['Satu ikat = 1 puluhan.', '4 ikat = 40 lidi.', '40 + 9 = ?'], '4 ikat = 40 lidi. 40 + 9 = 49 lidi.', '4 * 10 + 9'),
        pg('Mana yang lebih besar, 61 atau 59?', ['61', '59'], 0, ['Bandingkan puluhannya dulu.', '61 punya 6 puluhan, 59 punya 5 puluhan.', '6 puluhan lebih banyak dari 5 puluhan.'], '61 punya 6 puluhan, lebih banyak dari 5 puluhan pada 59. Jadi 61 lebih besar.', 'maks(61, 59)'),
      ],
    },
    {
      topik: 'mat2-tambah-100',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Jumlahkan satuan dengan satuan, lalu puluhan dengan puluhan.'),
        bagian('Kalau satuan lebih dari 9, simpan 1 puluhan. Tambahkan ke puluhan.'),
      ],
      contoh: [
        contoh('34 + 25 = ?', ['Satuan: 4 + 5 = 9.', 'Puluhan: 3 + 2 = 5.', 'Hasilnya 59.'], '59'),
        contoh('27 + 18 = ?', ['Satuan: 7 + 8 = 15. Tulis 5, simpan 1.', 'Puluhan: 2 + 1 + 1 = 4.', 'Hasilnya 45.'], '45'),
      ],
      soal: [
        isian('Berapa hasil 42 + 15?', '57', ['Satuan dulu: 2 + 5.', '2 + 5 = 7. Puluhan: 4 + 1.', '4 + 1 = 5. Jadi 5 puluhan dan 7 satuan.'], 'Satuan 2 + 5 = 7, puluhan 4 + 1 = 5. Hasilnya 57.', '42 + 15'),
        isian('Berapa hasil 30 + 40?', '70', ['30 adalah 3 puluhan, 40 adalah 4 puluhan.', '3 puluhan + 4 puluhan = 7 puluhan.', '7 puluhan = 70.'], '3 puluhan + 4 puluhan = 7 puluhan = 70.', '30 + 40'),
        isian('Berapa hasil 36 + 27?', '63', ['Satuan: 6 + 7 lebih dari 9.', '6 + 7 = 13. Tulis 3, simpan 1.', 'Puluhan: 3 + 2 + 1 = 6.'], '6 + 7 = 13, tulis 3 simpan 1. 3 + 2 + 1 = 6. Hasilnya 63.', '36 + 27'),
        pg('Mira memetik 45 jambu. Adiknya memetik 38 jambu. Berapa jambu mereka semuanya?', ['73', '83', '713', '7'], 1, ['Kata "semuanya" artinya dijumlahkan.', 'Satuan: 5 + 8 = 13. Tulis 3, simpan 1.', 'Puluhan: 4 + 3 + 1 = 8.'], '45 + 38 = 83. Jawaban 73 muncul kalau lupa menyimpan 1 puluhan.', '45 + 38'),
        isian('Di kebun ada 28 pohon pisang, 19 pohon pepaya, dan 30 pohon kelapa. Berapa semua pohon?', '77', ['Jumlahkan dua bilangan dulu, lalu tambah yang ketiga.', '28 + 19 = 47.', '47 + 30 = ?'], '28 + 19 = 47, lalu 47 + 30 = 77 pohon.', '28 + 19 + 30'),
      ],
    },
    {
      topik: 'mat2-kurang-100',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Kurangkan satuan dengan satuan, lalu puluhan dengan puluhan.'),
        bagian('Kalau satuan atas lebih kecil, pinjam 1 puluhan. 1 puluhan sama dengan 10 satuan.'),
      ],
      contoh: [
        contoh('68 − 25 = ?', ['Satuan: 8 − 5 = 3.', 'Puluhan: 6 − 2 = 4.', 'Hasilnya 43.'], '43'),
        contoh('52 − 17 = ?', ['Satuan 2 lebih kecil dari 7. Pinjam 1 puluhan, jadi 12.', '12 − 7 = 5.', 'Puluhan tinggal 4. 4 − 1 = 3. Hasilnya 35.'], '35'),
      ],
      soal: [
        isian('Berapa hasil 79 − 34?', '45', ['Satuan dulu: 9 − 4.', '9 − 4 = 5. Puluhan: 7 − 3.', '7 − 3 = 4.'], '9 − 4 = 5 dan 7 − 3 = 4. Hasilnya 45.', '79 - 34'),
        isian('Berapa hasil 90 − 50?', '40', ['90 adalah 9 puluhan, 50 adalah 5 puluhan.', '9 puluhan − 5 puluhan = 4 puluhan.', '4 puluhan = 40.'], '9 puluhan − 5 puluhan = 4 puluhan = 40.', '90 - 50'),
        isian('Berapa hasil 63 − 28?', '35', ['Satuan 3 lebih kecil dari 8. Pinjam 1 puluhan.', '13 − 8 = 5.', 'Puluhan tinggal 5. 5 − 2 = 3.'], 'Pinjam: 13 − 8 = 5. Puluhan 5 − 2 = 3. Hasilnya 35.', '63 - 28'),
        pg('Ikram punya 50 kelereng. Ia memberi 16 kelereng kepada temannya. Berapa sisa kelerengnya?', ['34', '46', '66', '44'], 0, ['Kata "memberi" dan "sisa" artinya dikurangi.', 'Satuan 0 lebih kecil dari 6. Pinjam: 10 − 6 = 4.', 'Puluhan tinggal 4. 4 − 1 = 3.'], '50 − 16 = 34. Jawaban 46 muncul kalau satuan dikurangi terbalik (6 − 0).', '50 - 16'),
        isian('Dalam bus ada 42 orang. Di halte, 15 orang turun dan 9 orang naik. Berapa orang di dalam bus sekarang?', '36', ['Kurangi dulu yang turun, lalu tambah yang naik.', '42 − 15 = 27.', '27 + 9 = ?'], '42 − 15 = 27, lalu 27 + 9 = 36 orang.', '42 - 15 + 9'),
      ],
    },
    {
      topik: 'mat2-kali-ulang',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Perkalian adalah tambah berulang. 3 × 4 artinya 4 ditambah 3 kali.', { jenis: 'petak', baris: 3, kolom: 4, terisi: 12 }),
        bagian('4 + 4 + 4 = 12. Jadi 3 × 4 = 12.'),
      ],
      contoh: [
        contoh('2 × 5 = ?', ['2 × 5 artinya 5 + 5.', '5 + 5 = 10.'], '10'),
        contoh('Ada 4 piring. Tiap piring berisi 3 kue. Berapa semua kue?', ['4 piring berisi 3 kue: 3 + 3 + 3 + 3.', 'Kalimat kalinya 4 × 3.', '4 × 3 = 12.'], '12'),
      ],
      soal: [
        isian('Berapa hasil 3 × 2?', '6', ['3 × 2 artinya 2 ditambah 3 kali.', '2 + 2 + 2.', '2 + 2 + 2 = 6.'], '3 × 2 = 2 + 2 + 2 = 6.', '3 * 2'),
        pg('Penjumlahan mana yang sama dengan 4 × 5?', ['4 + 5', '5 + 5 + 5 + 5', '4 + 4 + 4', '5 + 4 + 5'], 1, ['4 × 5 artinya 5 ditambah berapa kali?', '5 ditambah 4 kali.', 'Cari pilihan dengan empat angka 5.'], '4 × 5 artinya 5 + 5 + 5 + 5 = 20.'),
        isian('Ada 5 kandang. Tiap kandang berisi 2 ayam. Berapa semua ayam?', '10', ['Tiap kandang 2 ayam, ada 5 kandang.', '2 + 2 + 2 + 2 + 2.', 'Atau 5 × 2.'], '5 × 2 = 2 + 2 + 2 + 2 + 2 = 10 ayam.', '5 * 2'),
        isian('Berapa hasil 6 × 3?', '18', ['6 × 3 artinya 3 ditambah 6 kali.', '3 + 3 + 3 + 3 + 3 + 3.', 'Hitung sambil loncat tiga: 3, 6, 9, 12, 15, 18.'], '6 × 3 = 18.', '6 * 3'),
        isian('Dara membeli 4 bungkus permen. Tiap bungkus berisi 5 permen. Ia memberi 3 permen kepada adik. Berapa permen Dara sekarang?', '17', ['Hitung dulu semua permen, lalu kurangi yang diberikan.', '4 × 5 = 20 permen.', '20 − 3 = ?'], '4 × 5 = 20, lalu 20 − 3 = 17 permen.', '4 * 5 - 3'),
      ],
    },
  ],
  kartuBi: [
    {
      topik: 'bi2-huruf-kapital',
      sumber: 'K2-bi',
      penjelasan: [
        bagian('Huruf kapital adalah huruf besar. Huruf kapital dipakai di awal kalimat.'),
        bagian('Nama orang, nama kota, dan nama hari juga memakai huruf kapital.'),
      ],
      contoh: [
        contoh('Perbaiki kalimat: "adik bermain di halaman."', ['Kalimat harus diawali huruf kapital.', 'Huruf a diganti A.'], 'Adik bermain di halaman.'),
        contoh('Perbaiki: "Kami pergi ke banda aceh."', ['Banda Aceh adalah nama kota.', 'Huruf awal tiap kata nama kota memakai huruf kapital.'], 'Kami pergi ke Banda Aceh.'),
      ],
      soal: [
        pg('Kalimat mana yang benar?', ['ibu memasak sayur.', 'Ibu memasak sayur.', 'ibu Memasak sayur.'], 1, ['Lihat huruf pertama kalimat.', 'Awal kalimat memakai huruf kapital.', 'Cari kalimat yang diawali huruf I besar.'], 'Awal kalimat memakai huruf kapital: "Ibu memasak sayur."'),
        pg('Kata mana yang harus ditulis dengan huruf kapital?', ['meja', 'nanda', 'buku', 'pensil'], 1, ['Cari nama orang.', 'Meja, buku, dan pensil adalah nama benda biasa.', 'Nanda adalah nama orang.'], 'Nanda adalah nama orang, jadi ditulis Nanda.'),
        pg('Nama hari yang benar adalah ....', ['senin', 'Senin', 'sENIN'], 1, ['Nama hari diawali huruf kapital.', 'Hanya huruf pertama yang besar.', 'Huruf lainnya kecil.'], 'Nama hari ditulis Senin: huruf pertama kapital, lainnya kecil.'),
        pg('Kalimat mana yang benar?', ['Kakek tinggal di Sabang.', 'kakek tinggal di Sabang.', 'Kakek tinggal di sabang.'], 0, ['Periksa awal kalimat dan nama tempat.', 'Kakek di awal kalimat harus kapital.', 'Sabang adalah nama kota, juga kapital.'], 'Awal kalimat dan nama kota memakai huruf kapital: "Kakek tinggal di Sabang."'),
        pg('Kata mana yang salah tulis dalam kalimat ini: "Hari minggu Faris bermain bola."', ['Hari', 'minggu', 'Faris', 'bola'], 1, ['Ada nama hari di kalimat itu.', 'Nama hari harus diawali huruf kapital.', 'Kata minggu ditulis dengan m kecil.'], '"minggu" adalah nama hari, harus ditulis Minggu.'),
      ],
    },
    {
      topik: 'bi2-kata-sifat',
      sumber: 'K2-bi',
      penjelasan: [
        bagian('Kata sifat menjelaskan keadaan benda. Contohnya besar, kecil, manis, dan bersih.'),
        bagian('Kata sifat menjawab pertanyaan: seperti apa?'),
      ],
      contoh: [
        contoh('Kata sifat pada "Gajah itu besar." adalah ....', ['Gajah itu seperti apa?', 'Gajah itu besar.'], 'besar'),
        contoh('Lawan kata panas adalah ....', ['Panas adalah kata sifat.', 'Lawannya adalah keadaan yang tidak panas.'], 'dingin'),
      ],
      soal: [
        pg('Kata sifat pada kalimat "Mangga itu manis." adalah ....', ['mangga', 'itu', 'manis'], 2, ['Mangga itu seperti apa?', 'Cari kata yang menjelaskan rasa.', 'Rasanya manis.'], 'Manis menjelaskan rasa mangga, jadi manis adalah kata sifat.'),
        pg('Mana yang termasuk kata sifat?', ['berlari', 'tinggi', 'sepatu'], 1, ['Kata sifat menjelaskan keadaan.', 'Berlari adalah kegiatan, sepatu adalah benda.', 'Tinggi menjelaskan keadaan.'], 'Tinggi menjelaskan keadaan, misalnya "pohon itu tinggi".'),
        pg('Lawan kata bersih adalah ....', ['rapi', 'kotor', 'baru'], 1, ['Bersih artinya tidak ada debu atau sampah.', 'Lawannya penuh debu atau sampah.', 'Kata itu adalah kotor.'], 'Lawan kata bersih adalah kotor.'),
        pg('Kata yang tepat untuk "Batu itu sangat ...." adalah ....', ['keras', 'lembut', 'cair'], 0, ['Bayangkan saat memegang batu.', 'Batu tidak bisa ditekan dengan jari.', 'Batu itu keras.'], 'Batu tidak bisa ditekan, jadi batu itu keras.'),
        pg('"Rumah Zaki baru dicat. Warnanya hijau terang." Kata sifat pada kalimat kedua adalah ....', ['warnanya', 'hijau', 'terang', 'hijau dan terang'], 3, ['Cari kata yang menjelaskan warna.', 'Hijau menjelaskan warna, terang juga.', 'Ada dua kata sifat.'], 'Hijau dan terang sama-sama menjelaskan warna rumah.'),
      ],
    },
  ],
};
