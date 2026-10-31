import { bagian, contoh, isian, pg, type KartuMentah } from './bantu';

/** Gudang Ilmu tahap 2, kelas 2 dan 3: kartu untuk topik yang sebelumnya "segera". Belum diperiksa guru. */

export const T2_K2: { mat: KartuMentah[]; bi: KartuMentah[] } = {
  mat: [
    {
      topik: 'mat2-bagi-rata',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Membagi rata artinya setiap orang mendapat sama banyak.', { jenis: 'emoji', isi: '🍬🍬🍬🍬🍬🍬' }),
        bagian('6 permen dibagi rata untuk 2 anak. Setiap anak mendapat 3 permen.'),
      ],
      contoh: [
        contoh('8 kue dibagi rata untuk 2 anak. Berapa kue tiap anak?', ['Bagikan satu per satu bergantian.', 'Setiap anak mendapat 4 kue.'], '4'),
        contoh('9 jeruk dibagi rata ke 3 piring. Berapa jeruk tiap piring?', ['Taruh satu-satu di tiap piring sampai habis.', 'Tiap piring berisi 3 jeruk.'], '3'),
      ],
      soal: [
        isian('4 kelereng dibagi rata untuk 2 anak. Berapa kelereng tiap anak?', '2', ['Bagikan bergantian satu-satu.', 'Anak pertama 1, anak kedua 1, lalu ulangi.', 'Tiap anak mendapat 2.'], '4 dibagi 2 = 2 kelereng.', '4 / 2'),
        isian('10 pensil dibagi rata ke 2 kotak. Berapa pensil tiap kotak?', '5', ['Bagi menjadi 2 kelompok sama banyak.', '5 + 5 = 10.', 'Jadi tiap kotak 5.'], '10 dibagi 2 = 5 pensil.', '10 / 2'),
        isian('12 telur dibagi rata ke 3 keranjang. Berapa telur tiap keranjang?', '4', ['Cari bilangan yang ditambah 3 kali menjadi 12.', '4 + 4 + 4 = 12.', 'Jadi tiap keranjang 4.'], '12 dibagi 3 = 4 telur.', '12 / 3'),
        pg('15 buku dibagi rata untuk 5 anak. Berapa buku tiap anak?', ['3', '5', '10', '20'], 0, ['5 anak, buku harus sama banyak.', '3 + 3 + 3 + 3 + 3 = 15.', 'Jadi tiap anak 3 buku.'], '15 dibagi 5 = 3 buku.', '15 / 5'),
        isian('Ibu punya 20 kue. Ibu menyimpan 4 kue. Sisanya dibagi rata untuk 4 anak. Berapa kue tiap anak?', '4', ['Kurangi dulu kue yang disimpan.', '20 − 4 = 16.', '16 dibagi rata untuk 4 anak.'], '20 − 4 = 16. 16 dibagi 4 = 4 kue.', '(20 - 4) / 4'),
      ],
    },
    {
      topik: 'mat2-panjang',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Panjang benda diukur dengan penggaris. Satuannya sentimeter, ditulis cm.'),
        bagian('Mulai mengukur dari angka 0 di penggaris, bukan dari ujung penggaris.'),
      ],
      contoh: [
        contoh('Pensil dari angka 0 sampai angka 12. Berapa panjangnya?', ['Ujung pensil di 0.', 'Ujung lainnya di 12.'], '12 cm'),
        contoh('Pita A 8 cm, pita B 5 cm. Mana yang lebih panjang?', ['Bandingkan 8 dan 5.', '8 lebih besar dari 5.'], 'Pita A'),
      ],
      soal: [
        isian('Penghapus dari angka 0 sampai angka 4. Berapa cm panjangnya?', '4', ['Lihat angka di ujung penghapus.', 'Ujung pertama di 0.', 'Ujung kedua di 4.'], 'Dari 0 sampai 4 artinya 4 cm.', '4 - 0'),
        pg('Mana yang lebih panjang?', ['Tali 15 cm', 'Tali 9 cm'], 0, ['Bandingkan angkanya.', '15 lebih besar dari 9.', 'Yang angkanya lebih besar lebih panjang.'], '15 cm lebih panjang dari 9 cm.'),
        isian('Krayon dari angka 2 sampai angka 9. Berapa cm panjangnya?', '7', ['Ujung krayon tidak di 0.', 'Hitung dari 2 sampai 9.', '9 − 2 = ?'], '9 − 2 = 7 cm.', '9 - 2'),
        isian('Dua pita disambung. Panjangnya 10 cm dan 6 cm. Berapa cm panjang semuanya?', '16', ['Disambung artinya dijumlah.', '10 + 6.', '10 + 6 = 16.'], '10 + 6 = 16 cm.', '10 + 6'),
        isian('Lidi 20 cm dipatahkan. Satu bagian 8 cm. Berapa cm bagian yang lain?', '12', ['Panjang semua dikurangi bagian yang diketahui.', '20 − 8.', '20 − 8 = 12.'], '20 − 8 = 12 cm.', '20 - 8'),
      ],
    },
    {
      topik: 'mat2-jam',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Jam punya dua jarum. Jarum pendek menunjuk jam, jarum panjang menunjuk menit.'),
        bagian('Kalau jarum panjang di angka 12, artinya tepat. Jarum pendek di 7 berarti pukul 7 tepat.'),
      ],
      contoh: [
        contoh('Jarum pendek di 3, jarum panjang di 12. Pukul berapa?', ['Jarum panjang di 12 artinya tepat.', 'Jarum pendek di 3.'], 'Pukul 3'),
        contoh('Jarum panjang di 6. Artinya ....', ['Angka 6 ada di tengah bawah.', 'Itu berarti setengah.'], 'lewat setengah jam'),
      ],
      soal: [
        isian('Jarum pendek di 9, jarum panjang di 12. Pukul berapa? (tulis angkanya)', '9', ['Jarum panjang di 12 artinya tepat.', 'Lihat jarum pendek.', 'Jarum pendek di 9.'], 'Pukul 9 tepat.', '9'),
        pg('Pukul 6 pagi, jarum pendek menunjuk angka ....', ['12', '6', '3'], 1, ['Jarum pendek menunjuk jam.', 'Jamnya 6.', 'Jarum pendek di angka 6.'], 'Pukul 6, jarum pendek di angka 6.', '6'),
        pg('Kegiatan mana yang biasanya pada pagi hari?', ['Tidur malam', 'Berangkat sekolah', 'Melihat bintang'], 1, ['Pikirkan kapan kamu ke sekolah.', 'Sekolah dimulai pagi.', 'Tidur malam dan bintang ada di malam hari.'], 'Berangkat sekolah biasanya pagi hari.'),
        isian('Nanda bangun pukul 6. Satu jam kemudian ia berangkat. Pukul berapa ia berangkat? (tulis angkanya)', '7', ['Satu jam kemudian artinya ditambah 1.', '6 + 1.', '6 + 1 = 7.'], '6 + 1 = pukul 7.', '6 + 1'),
        isian('Faris bermain dari pukul 3 sampai pukul 5 sore. Berapa jam ia bermain?', '2', ['Hitung dari 3 ke 5.', '3 ke 4 satu jam, 4 ke 5 satu jam.', '1 + 1 = 2.'], 'Dari pukul 3 sampai 5 adalah 2 jam.', '5 - 3'),
      ],
    },
    {
      topik: 'mat2-bangun-datar',
      sumber: 'K2-mat',
      penjelasan: [
        bagian('Segitiga punya 3 sisi dan 3 sudut. Segi empat punya 4 sisi dan 4 sudut.'),
        bagian('Lingkaran tidak punya sudut. Bentuknya bulat seperti roda.'),
      ],
      contoh: [
        contoh('Berapa sisi segitiga?', ['Segi tiga artinya tiga sisi.'], '3'),
        contoh('Benda apa yang berbentuk lingkaran?', ['Cari benda yang bulat.', 'Roda sepeda bulat.'], 'Roda'),
      ],
      soal: [
        isian('Berapa sisi segi empat?', '4', ['Segi empat artinya empat sisi.', 'Hitung sisi papan tulis.', 'Ada 4.'], 'Segi empat punya 4 sisi.', '4'),
        pg('Bentuk mana yang tidak punya sudut?', ['Segitiga', 'Persegi', 'Lingkaran'], 2, ['Sudut adalah pojok.', 'Segitiga dan persegi punya pojok.', 'Lingkaran bulat tanpa pojok.'], 'Lingkaran tidak punya sudut.'),
        pg('Bentuk permukaan buku tulis adalah ....', ['Lingkaran', 'Segi empat', 'Segitiga'], 1, ['Hitung pojok buku.', 'Buku punya 4 pojok.', 'Bangun dengan 4 sisi adalah segi empat.'], 'Buku tulis berbentuk segi empat.'),
        isian('Ada 2 segitiga. Berapa semua sisinya?', '6', ['Satu segitiga punya 3 sisi.', 'Ada 2 segitiga: 3 + 3.', '3 + 3 = 6.'], '3 + 3 = 6 sisi.', '2 * 3'),
        isian('Ada 1 segitiga dan 2 segi empat. Berapa semua sudutnya?', '11', ['Segitiga 3 sudut, segi empat 4 sudut.', '3 + 4 + 4.', '3 + 8 = 11.'], '3 + 4 + 4 = 11 sudut.', '3 + 2 * 4'),
      ],
    },
  ],
  bi: [
    {
      topik: 'bi2-tanda-baca',
      sumber: 'K2-bi',
      penjelasan: [
        bagian('Kalimat berita diakhiri tanda titik. Contoh: Adik tidur.'),
        bagian('Kalimat tanya diakhiri tanda tanya. Contoh: Di mana bukuku?'),
      ],
      contoh: [
        contoh('"Kakak membaca buku ..." Tanda apa yang tepat?', ['Kalimat ini memberi kabar.'], 'titik (.)'),
        contoh('"Siapa namamu ..." Tanda apa yang tepat?', ['Kalimat ini bertanya.'], 'tanda tanya (?)'),
      ],
      soal: [
        pg('"Ayah pergi ke kebun ..." Tanda yang tepat adalah ....', ['.', '?'], 0, ['Apakah kalimat ini bertanya?', 'Kalimat ini memberi kabar.', 'Kalimat berita memakai titik.'], 'Kalimat berita diakhiri titik.'),
        pg('"Apa warna kucingmu ..." Tanda yang tepat adalah ....', ['.', '?'], 1, ['Ada kata apa.', 'Kalimat ini bertanya.', 'Kalimat tanya memakai tanda tanya.'], 'Kalimat tanya diakhiri tanda tanya.'),
        pg('Kalimat mana yang benar?', ['Kapan kamu datang.', 'Kapan kamu datang?'], 1, ['Kapan adalah kata tanya.', 'Kalimat tanya memakai tanda tanya.', 'Pilih yang berakhir dengan ?'], '"Kapan kamu datang?" benar.'),
        pg('Kalimat mana yang benar?', ['Ibu memasak nasi.', 'Ibu memasak nasi?'], 0, ['Kalimat ini memberi kabar.', 'Kalimat berita memakai titik.', 'Pilih yang berakhir dengan titik.'], '"Ibu memasak nasi." benar.'),
        pg('Kalimat tanya yang benar adalah ....', ['di mana sepatuku?', 'Di mana sepatuku?', 'Di mana sepatuku.'], 1, ['Periksa huruf awal dan tanda akhir.', 'Awal kalimat huruf kapital.', 'Kalimat tanya diakhiri tanda tanya.'], 'Huruf awal kapital dan diakhiri tanda tanya.'),
      ],
    },
    {
      topik: 'bi2-urutan-cerita',
      sumber: 'K2-bi',
      penjelasan: [
        bagian('Cerita punya urutan. Kata mula-mula, lalu, dan akhirnya membantu kita tahu urutannya.'),
        bagian('Mula-mula untuk awal, lalu untuk tengah, dan akhirnya untuk penutup.'),
      ],
      contoh: [
        contoh('Urutkan: makan, mencuci tangan, mencuci piring.', ['Sebelum makan, cuci tangan.', 'Sesudah makan, cuci piring.'], 'mencuci tangan, makan, mencuci piring'),
        contoh('Kata untuk bagian akhir cerita adalah ....', ['Bagian penutup memakai kata akhirnya.'], 'akhirnya'),
      ],
      soal: [
        pg('Kata untuk awal cerita adalah ....', ['akhirnya', 'mula-mula', 'lalu'], 1, ['Awal artinya permulaan.', 'Akhirnya untuk penutup.', 'Mula-mula untuk awal.'], 'Mula-mula dipakai di awal cerita.'),
        pg('Yang dilakukan lebih dulu adalah ....', ['memakai sepatu', 'memakai kaus kaki'], 1, ['Bayangkan saat bersiap ke sekolah.', 'Kaus kaki dipakai sebelum sepatu.', 'Sepatu menutupi kaus kaki.'], 'Kaus kaki dipakai lebih dulu, lalu sepatu.'),
        pg('"Mula-mula Ikram menanam biji. Lalu ia menyiram. ...." Kalimat akhir yang cocok adalah ....', ['Akhirnya biji tumbuh menjadi tunas.', 'Mula-mula ia bangun tidur.', 'Lalu ia membeli biji.'], 0, ['Kalimat akhir memakai kata akhirnya.', 'Setelah ditanam dan disiram, biji tumbuh.', 'Pilih kalimat dengan akhirnya.'], 'Penutup cerita: "Akhirnya biji tumbuh menjadi tunas."'),
        pg('Urutan yang benar saat mandi adalah ....', ['handuk, sabun, air', 'air, sabun, handuk', 'sabun, handuk, air'], 1, ['Apa yang dipakai pertama?', 'Badan dibasahi air, lalu disabun.', 'Terakhir dikeringkan dengan handuk.'], 'Air dulu, lalu sabun, terakhir handuk.'),
        pg('"Lalu Mira memasukkan buku ke tas." Kata lalu menunjukkan bagian ....', ['awal', 'tengah', 'akhir'], 1, ['Mula-mula untuk awal, akhirnya untuk akhir.', 'Lalu ada di antara keduanya.', 'Itu bagian tengah.'], 'Kata lalu dipakai di bagian tengah cerita.'),
      ],
    },
  ],
};

export const T2_K3: { mat: KartuMentah[]; bi: KartuMentah[] } = {
  mat: [
    {
      topik: 'mat3-ribuan',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Bilangan tiga angka punya ratusan, puluhan, dan satuan.'),
        bagian('Pada 456, angka 4 bernilai 400, angka 5 bernilai 50, dan angka 6 bernilai 6.'),
      ],
      contoh: [
        contoh('Nilai angka 7 pada 372 adalah ....', ['7 ada di tempat puluhan.', '7 puluhan = 70.'], '70'),
        contoh('300 + 20 + 5 = ?', ['Gabungkan ratusan, puluhan, satuan.', '3 ratusan, 2 puluhan, 5 satuan.'], '325'),
      ],
      soal: [
        isian('Nilai angka 8 pada 815 adalah ...', '800', ['8 ada di tempat paling kiri.', 'Tempat paling kiri adalah ratusan.', '8 ratusan = 800.'], '8 ratusan bernilai 800.', '800'),
        isian('500 + 40 + 3 = ...', '543', ['Gabungkan saja.', '5 ratusan, 4 puluhan, 3 satuan.', 'Tulis 5, 4, 3 berurutan.'], '500 + 40 + 3 = 543.', '500 + 40 + 3'),
        pg('Bilangan mana yang paling besar?', ['489', '498', '849', '894'], 3, ['Bandingkan ratusan dulu.', '849 dan 894 punya 8 ratusan.', 'Bandingkan puluhan: 9 lebih besar dari 4.'], '894 paling besar.', 'maks(489, 498, 849, 894)'),
        isian('Berapa hasil 250 + 130?', '380', ['Ratusan: 2 + 1.', 'Puluhan: 5 + 3.', 'Satuan 0 + 0.'], '250 + 130 = 380.', '250 + 130'),
        isian('Sekolah punya 625 buku. Sebanyak 210 buku dipinjam. Berapa buku yang masih di perpustakaan?', '415', ['Dipinjam artinya dikurangi.', '625 − 210.', 'Ratusan 6 − 2, puluhan 2 − 1, satuan 5 − 0.'], '625 − 210 = 415 buku.', '625 - 210'),
      ],
    },
    {
      topik: 'mat3-keliling',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Keliling adalah jumlah panjang semua sisi bangun.'),
        bagian('Bayangkan semut berjalan mengelilingi pinggir bangun sampai kembali ke awal.'),
      ],
      contoh: [
        contoh('Segitiga bersisi 3 cm, 4 cm, dan 5 cm. Berapa kelilingnya?', ['Jumlahkan semua sisi.', '3 + 4 + 5 = 12.'], '12 cm'),
        contoh('Persegi sisinya 5 cm. Berapa kelilingnya?', ['Persegi punya 4 sisi sama panjang.', '5 + 5 + 5 + 5 = 20.'], '20 cm'),
      ],
      soal: [
        isian('Segitiga bersisi 6 cm, 6 cm, dan 6 cm. Berapa cm kelilingnya?', '18', ['Jumlahkan ketiga sisi.', '6 + 6 + 6.', '6 + 6 + 6 = 18.'], '6 + 6 + 6 = 18 cm.', '6 + 6 + 6'),
        isian('Persegi sisinya 4 cm. Berapa cm kelilingnya?', '16', ['Persegi punya 4 sisi sama panjang.', '4 + 4 + 4 + 4.', 'Atau 4 × 4.'], '4 × 4 = 16 cm.', '4 * 4'),
        isian('Persegi panjang panjangnya 7 cm dan lebarnya 3 cm. Berapa cm kelilingnya?', '20', ['Ada 2 sisi panjang dan 2 sisi lebar.', '7 + 3 + 7 + 3.', '10 + 10 = 20.'], '7 + 3 + 7 + 3 = 20 cm.', '7 + 3 + 7 + 3'),
        pg('Pak Harun memasang pagar di pinggir kebun. Yang ia hitung adalah ....', ['keliling', 'berat', 'jumlah pohon'], 0, ['Pagar dipasang di pinggir.', 'Panjang semua pinggir adalah keliling.', 'Pilih keliling.'], 'Pagar mengelilingi kebun, jadi yang dihitung keliling.'),
        isian('Taman berbentuk persegi panjang 10 m × 6 m. Laila berlari mengelilinginya 2 kali. Berapa meter jarak larinya?', '64', ['Hitung keliling dulu.', 'Keliling = 10 + 6 + 10 + 6 = 32 m.', '2 kali: 32 + 32.'], 'Keliling 32 m. Dua kali: 64 m.', '2 * (10 + 6 + 10 + 6)'),
      ],
    },
    {
      topik: 'mat3-piktogram',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Piktogram adalah data yang ditulis dengan gambar.'),
        bagian('Baca kunci gambar dulu. Kalau satu gambar berarti 2, maka 3 gambar berarti 6.'),
      ],
      contoh: [
        contoh('Kunci: satu 🍎 = 2 buah. Ada 4 🍎. Berapa buah?', ['Satu gambar 2 buah.', '4 gambar = 2 + 2 + 2 + 2.'], '8'),
        contoh('Senin 3 🍎, Selasa 5 🍎. Hari apa paling banyak?', ['Bandingkan banyak gambar.', '5 lebih banyak dari 3.'], 'Selasa'),
      ],
      soal: [
        isian('Kunci: satu ⭐ = 1 anak. Ada 6 ⭐. Berapa anak?', '6', ['Satu gambar berarti 1 anak.', 'Hitung gambarnya.', 'Ada 6 gambar.'], '6 gambar × 1 = 6 anak.', { hitung: '6 * 1', gambar: { jenis: 'emoji', isi: '⭐⭐⭐⭐⭐⭐' } }),
        isian('Kunci: satu 📘 = 2 buku. Ada 5 📘. Berapa buku?', '10', ['Satu gambar berarti 2 buku.', '5 gambar: 2 + 2 + 2 + 2 + 2.', 'Atau 5 × 2.'], '5 × 2 = 10 buku.', { hitung: '5 * 2', gambar: { jenis: 'emoji', isi: '📘📘📘📘📘' } }),
        isian('Kunci: satu 🐟 = 5 ikan. Ada 3 🐟. Berapa ikan?', '15', ['Satu gambar 5 ikan.', '3 gambar: 5 + 5 + 5.', '5 + 5 + 5 = 15.'], '3 × 5 = 15 ikan.', { hitung: '3 * 5', gambar: { jenis: 'emoji', isi: '🐟🐟🐟' } }),
        pg('Kunci satu 🍌 = 10 pisang. Kebun A 4 🍌, kebun B 2 🍌. Selisih pisangnya ....', ['2', '20', '60'], 1, ['Selisih gambar dulu: 4 − 2.', 'Selisih 2 gambar.', '2 gambar = 2 × 10.'], 'Selisih 2 gambar = 20 pisang.', '(4 - 2) * 10'),
        isian('Kunci satu 🚲 = 4 siswa. Kelas A 3 🚲, kelas B 5 🚲. Berapa siswa bersepeda dari kedua kelas?', '32', ['Jumlahkan gambar dulu.', '3 + 5 = 8 gambar.', '8 × 4 = ?'], '8 gambar × 4 = 32 siswa.', '(3 + 5) * 4'),
      ],
    },
    {
      topik: 'mat3-berat',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Berat benda diukur dengan timbangan. Satuannya kilogram (kg) dan gram (g).'),
        bagian('1 kilogram sama dengan 1.000 gram.'),
      ],
      contoh: [
        contoh('2 kg = ... g', ['1 kg = 1.000 g.', '2 × 1.000 = 2.000.'], '2.000'),
        contoh('Mana lebih berat, 1 kg kapas atau 1 kg besi?', ['Keduanya 1 kg.', 'Beratnya sama.'], 'Sama berat'),
      ],
      soal: [
        isian('3 kg = ... g', '3.000', ['1 kg = 1.000 g.', '3 × 1.000.', '3 × 1.000 = 3.000.'], '3 kg = 3.000 g.', '3 * 1000'),
        pg('Satuan yang tepat untuk berat sekarung beras adalah ....', ['gram', 'kilogram', 'sentimeter'], 1, ['Sekarung beras berat.', 'Gram untuk benda ringan.', 'Sentimeter untuk panjang.'], 'Beras sekarung diukur dengan kilogram.'),
        isian('Ibu membeli 2 kg gula dan 3 kg beras. Berapa kg semuanya?', '5', ['Jumlahkan beratnya.', '2 + 3.', '2 + 3 = 5.'], '2 + 3 = 5 kg.', '2 + 3'),
        isian('Tepung 1 kg dipakai 400 g. Berapa gram sisanya?', '600', ['Ubah 1 kg menjadi gram.', '1 kg = 1.000 g.', '1.000 − 400 = ?'], '1.000 − 400 = 600 g.', '1000 - 400'),
        pg('Mana yang paling berat?', ['900 g', '1 kg', '750 g'], 1, ['Ubah 1 kg ke gram.', '1 kg = 1.000 g.', 'Bandingkan 900, 1.000, dan 750.'], '1 kg = 1.000 g, paling berat.'),
      ],
    },
  ],
  bi: [
    {
      topik: 'bi3-kata-tanya',
      sumber: 'K3-bi',
      penjelasan: [
        bagian('Apa untuk benda, siapa untuk orang, dan di mana untuk tempat.'),
        bagian('Kapan untuk waktu, mengapa untuk alasan, dan bagaimana untuk cara.'),
      ],
      contoh: [
        contoh('"... nama adikmu?" Kata tanya yang tepat adalah ....', ['Yang ditanyakan nama orang.'], 'Siapa'),
        contoh('"... kamu terlambat?" jika menanyakan alasan.', ['Alasan memakai mengapa.'], 'Mengapa'),
      ],
      soal: [
        pg('"... kamu tinggal?" Kata tanya yang tepat adalah ....', ['Kapan', 'Di mana', 'Siapa'], 1, ['Yang ditanyakan tempat tinggal.', 'Tempat memakai di mana.', 'Pilih di mana.'], 'Tempat ditanyakan dengan di mana.'),
        pg('"... kamu berangkat sekolah?" untuk menanyakan waktu.', ['Kapan', 'Apa', 'Bagaimana'], 0, ['Yang ditanyakan waktu.', 'Waktu memakai kapan.', 'Pilih kapan.'], 'Waktu ditanyakan dengan kapan.'),
        pg('"... cara membuat layang-layang?"', ['Siapa', 'Bagaimana', 'Di mana'], 1, ['Yang ditanyakan cara.', 'Cara memakai bagaimana.', 'Pilih bagaimana.'], 'Cara ditanyakan dengan bagaimana.'),
        pg('"Rani menangis karena jatuh." Pertanyaan yang jawabannya "karena jatuh" adalah ....', ['Siapa yang menangis?', 'Mengapa Rani menangis?', 'Di mana Rani menangis?'], 1, ['Karena menunjukkan alasan.', 'Alasan ditanyakan dengan mengapa.', 'Pilih pertanyaan dengan mengapa.'], 'Jawaban "karena jatuh" menjawab pertanyaan mengapa.'),
        pg('"Pak Harun memperbaiki sepeda di bengkel." Pertanyaan yang jawabannya "di bengkel" adalah ....', ['Siapa memperbaiki sepeda?', 'Apa yang diperbaiki?', 'Di mana Pak Harun memperbaiki sepeda?'], 2, ['Di bengkel adalah tempat.', 'Tempat ditanyakan dengan di mana.', 'Pilih pertanyaan dengan di mana.'], '"Di bengkel" menjawab pertanyaan di mana.'),
      ],
    },
    {
      topik: 'bi3-dongeng',
      sumber: 'K3-bi',
      penjelasan: [
        bagian('Tokoh dongeng punya sifat. Sifat terlihat dari perbuatan dan ucapannya.'),
        bagian('Tokoh yang suka menolong bersifat baik hati. Tokoh yang suka mengejek bersifat sombong.'),
      ],
      contoh: [
        contoh('Kancil membantu kura-kura menyeberang sungai. Sifat kancil adalah ....', ['Membantu artinya menolong.', 'Suka menolong berarti baik hati.'], 'baik hati'),
        contoh('Gajah berkata, "Aku paling kuat, kalian semua lemah!" Sifat gajah adalah ....', ['Ia merasa paling hebat.', 'Merasa paling hebat berarti sombong.'], 'sombong'),
      ],
      soal: [
        pg('Semut berbagi makanan dengan belalang yang lapar. Sifat semut adalah ....', ['pelit', 'suka berbagi', 'pemalas'], 1, ['Lihat perbuatan semut.', 'Ia memberi makanan.', 'Memberi berarti suka berbagi.'], 'Semut suka berbagi.'),
        pg('Kura-kura terus berjalan walau lambat sampai garis akhir. Sifat kura-kura adalah ....', ['pantang menyerah', 'penakut', 'sombong'], 0, ['Ia terus berjalan.', 'Tidak berhenti walau lambat.', 'Itu sifat pantang menyerah.'], 'Kura-kura pantang menyerah.'),
        pg('Kelinci tidur di tengah lomba karena merasa pasti menang. Sifat kelinci adalah ....', ['rajin', 'sombong', 'jujur'], 1, ['Ia merasa pasti menang.', 'Merasa paling hebat.', 'Itu sifat sombong.'], 'Kelinci sombong karena meremehkan lawan.'),
        pg('Burung bangau mengembalikan dompet yang ia temukan. Sifat bangau adalah ....', ['jujur', 'malas', 'pemarah'], 0, ['Ia mengembalikan barang milik orang lain.', 'Tidak mengambilnya.', 'Itu sifat jujur.'], 'Mengembalikan barang temuan adalah sifat jujur.'),
        pg('Pesan dongeng kelinci dan kura-kura adalah ....', ['Jangan sombong, terus berusaha.', 'Tidur siang itu penting.', 'Berlari harus cepat.'], 0, ['Siapa yang menang?', 'Kura-kura menang karena terus berusaha.', 'Kelinci kalah karena sombong.'], 'Pesannya: jangan sombong dan teruslah berusaha.'),
      ],
    },
  ],
};
