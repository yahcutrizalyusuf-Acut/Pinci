import { bagian, contoh, isian, pg } from './bantu';
import type { SumberKelas } from './peta';

/**
 * Gudang Ilmu kelas 3, tahap 1: 4 kartu Matematika dan 2 kartu Bahasa Indonesia.
 * Ditulis sendiri (belum diperiksa guru). Kunci Matematika dihitung ulang oleh uji.
 */
export const SUMBER_K3: SumberKelas = {
  kelas: 3,
  versi: '0.1.0',
  dibuat: '2026-10-31',
  petaMat: [
    { id: 'mat3-kali-bagi', judul: 'Perkalian dan pembagian', ringkas: 'Bagi adalah kebalikan kali.' },
    { id: 'mat3-pecahan-sederhana', judul: 'Pecahan sederhana', ringkas: 'Setengah, sepertiga, dan seperempat.', prasyarat: ['mat3-kali-bagi'], bersamaOrtu: true },
    { id: 'mat3-panjang', judul: 'Sentimeter dan meter', ringkas: '1 meter = 100 sentimeter.', bersamaOrtu: true },
    { id: 'mat3-jam', judul: 'Jam dan menit', ringkas: '1 jam = 60 menit.' },
    { id: 'mat3-ribuan', judul: 'Bilangan sampai 1.000', ringkas: 'Ratusan, puluhan, dan satuan.' },
    { id: 'mat3-keliling', judul: 'Keliling bangun', ringkas: 'Jumlah panjang semua sisi.', prasyarat: ['mat3-panjang'] },
    { id: 'mat3-piktogram', judul: 'Piktogram', ringkas: 'Data dengan gambar.' },
    { id: 'mat3-berat', judul: 'Berat benda', ringkas: 'Kilogram dan gram.', bersamaOrtu: true },
  ],
  petaBi: [
    { id: 'bi3-tanda-baca', judul: 'Titik, tanda tanya, dan tanda seru', ringkas: 'Tanda di akhir kalimat.' },
    { id: 'bi3-gagasan-utama', judul: 'Gagasan utama paragraf', ringkas: 'Hal yang paling banyak dibicarakan.' },
    { id: 'bi3-kata-tanya', judul: 'Kata tanya', ringkas: 'Apa, siapa, di mana, kapan, mengapa, bagaimana.' },
    { id: 'bi3-dongeng', judul: 'Tokoh dongeng', ringkas: 'Sifat tokoh dari perbuatannya.', bersamaOrtu: true },
  ],
  kartuMat: [
    {
      topik: 'mat3-kali-bagi',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Pembagian adalah membagi sama banyak. 12 : 3 artinya 12 dibagi menjadi 3 kelompok sama besar.', { jenis: 'petak', baris: 3, kolom: 4, terisi: 12 }),
        bagian('Pembagian adalah kebalikan perkalian. Karena 3 × 4 = 12, maka 12 : 3 = 4.'),
      ],
      contoh: [
        contoh('7 × 8 = ?', ['Ingat: 7 × 8 = 56.', 'Periksa: 56 : 8 = 7.'], '56'),
        contoh('Ada 24 jeruk dibagi rata ke 4 keranjang. Berapa jeruk tiap keranjang?', ['Kalimat baginya 24 : 4.', '4 × 6 = 24, jadi 24 : 4 = 6.'], '6'),
      ],
      soal: [
        isian('Berapa hasil 6 × 7?', '42', ['6 × 7 artinya 7 ditambah 6 kali.', '6 × 7 sama dengan 7 × 6.', 'Loncat tujuh: 7, 14, 21, 28, 35, 42.'], '6 × 7 = 42.', '6 * 7'),
        isian('Berapa hasil 35 : 5?', '7', ['Cari bilangan yang dikali 5 hasilnya 35.', '5 × 7 = 35.', 'Jadi 35 : 5 = ...'], '5 × 7 = 35, jadi 35 : 5 = 7.', '35 / 5'),
        pg('Kalimat mana yang benar?', ['9 × 6 = 56', '9 × 6 = 54', '9 × 6 = 45', '9 × 6 = 63'], 1, ['Hitung 9 × 6 dulu.', '9 × 6 = 10 × 6 − 6.', '60 − 6 = 54.'], '9 × 6 = 54.'),
        isian('Ibu membuat 48 kue timphan. Kue dimasukkan ke 6 kotak sama banyak. Berapa kue tiap kotak?', '8', ['Kata "sama banyak" artinya dibagi.', '48 : 6.', '6 × 8 = 48.'], '48 : 6 = 8 kue tiap kotak.', '48 / 6'),
        isian('Faris membeli 3 bungkus kelereng. Tiap bungkus berisi 9 kelereng. Kelereng itu dibagi rata kepada 3 temannya. Berapa kelereng yang didapat setiap teman?', '9', ['Hitung dulu semua kelereng: 3 × 9.', '3 × 9 = 27, lalu dibagi 3.', '27 : 3 = ?'], '3 × 9 = 27 kelereng. 27 : 3 = 9 kelereng untuk setiap teman.', '3 * 9 / 3'),
      ],
    },
    {
      topik: 'mat3-pecahan-sederhana',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Pecahan menunjukkan bagian dari satu benda utuh. Satu kue dibagi 4 sama besar, satu bagian adalah 1/4.', { jenis: 'pecahan', a: 1, b: 4 }),
        bagian('Angka bawah adalah banyak bagian. Angka atas adalah bagian yang diambil.'),
      ],
      contoh: [
        contoh('Pita dibagi 2 sama panjang. Satu bagian adalah ....', ['Dibagi 2, jadi angka bawah 2.', 'Diambil 1, jadi angka atas 1.'], '1/2'),
        contoh('Mana lebih besar, 1/2 atau 1/4?', ['Kue dibagi 2 potongannya besar.', 'Kue dibagi 4 potongannya lebih kecil.'], '1/2'),
      ],
      soal: [
        pg('Gambar menunjukkan pecahan ....', ['1/3', '1/2', '1/4'], 0, ['Hitung semua bagian.', 'Ada 3 bagian, 1 diwarnai.', 'Angka bawah 3, angka atas 1.'], 'Ada 3 bagian sama besar dan 1 diwarnai, jadi 1/3.', { gambar: { jenis: 'pecahan', a: 1, b: 3 } }),
        pg('Gambar menunjukkan pecahan ....', ['2/4', '3/4', '1/4'], 1, ['Hitung semua bagian dan bagian yang diwarnai.', 'Ada 4 bagian, 3 diwarnai.', 'Angka bawah 4, angka atas 3.'], 'Ada 4 bagian dan 3 diwarnai, jadi 3/4.', { gambar: { jenis: 'pecahan', a: 3, b: 4 } }),
        pg('Mana yang lebih besar?', ['1/3', '1/6'], 0, ['Bayangkan satu kue yang sama.', 'Dibagi 3 potongannya lebih besar daripada dibagi 6.', 'Makin besar angka bawah, makin kecil potongannya.'], '1/3 lebih besar dari 1/6, karena dibagi 3 potongannya lebih besar.', 'maks(1/3, 1/6)'),
        isian('Sebuah semangka dipotong 8 sama besar. Laila makan 3 potong. Pecahan bagian yang dimakan Laila adalah ...', '3/8', ['Semangka dibagi menjadi berapa bagian?', 'Angka bawah 8.', 'Laila makan 3 bagian, jadi angka atas 3.'], 'Semangka dibagi 8 bagian, dimakan 3 bagian. Jadi 3/8.', '3/8'),
        isian('Setengah dari 10 jambu adalah berapa jambu?', '5', ['Setengah artinya dibagi 2 sama banyak.', '10 : 2.', '10 : 2 = 5.'], 'Setengah dari 10 = 10 : 2 = 5 jambu.', '10 / 2'),
      ],
    },
    {
      topik: 'mat3-panjang',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Panjang pensil diukur dengan sentimeter, ditulis cm. Panjang kelas diukur dengan meter, ditulis m.'),
        bagian('1 meter sama dengan 100 sentimeter.'),
      ],
      contoh: [
        contoh('2 m = ... cm', ['1 m = 100 cm.', '2 m = 2 × 100 = 200 cm.'], '200'),
        contoh('Tali 1 m dipotong 35 cm. Sisanya berapa cm?', ['1 m = 100 cm.', '100 − 35 = 65.'], '65'),
      ],
      soal: [
        isian('3 m = ... cm', '300', ['1 m = 100 cm.', '3 m artinya 3 kali 100 cm.', '3 × 100 = ?'], '3 × 100 = 300 cm.', '3 * 100'),
        pg('Satuan yang tepat untuk mengukur panjang penghapus adalah ....', ['meter', 'sentimeter', 'kilogram'], 1, ['Penghapus itu kecil.', 'Meter dipakai untuk benda panjang seperti kelas.', 'Kilogram untuk berat, bukan panjang.'], 'Penghapus kecil, jadi diukur dengan sentimeter.'),
        isian('Pita merah 45 cm. Pita biru 38 cm. Berapa panjang kedua pita jika disambung?', '83', ['Disambung artinya dijumlahkan.', '45 + 38.', 'Satuan 5 + 8 = 13, simpan 1.'], '45 + 38 = 83 cm.', '45 + 38'),
        isian('Tinggi Putri 1 m 25 cm. Tinggi Putri adalah ... cm', '125', ['Ubah 1 m ke cm dulu.', '1 m = 100 cm.', '100 + 25 = ?'], '1 m = 100 cm. 100 + 25 = 125 cm.', '100 + 25'),
        isian('Ayah punya tali 2 m. Ayah memotong 4 potong, masing-masing 30 cm. Berapa cm sisa tali?', '80', ['Ubah 2 m ke cm: 200 cm.', 'Yang dipotong: 4 × 30 = 120 cm.', '200 − 120 = ?'], '2 m = 200 cm. 4 × 30 = 120 cm. 200 − 120 = 80 cm.', '2 * 100 - 4 * 30'),
      ],
    },
    {
      topik: 'mat3-jam',
      sumber: 'K3-mat',
      penjelasan: [
        bagian('Jarum pendek menunjukkan jam. Jarum panjang menunjukkan menit.'),
        bagian('1 jam sama dengan 60 menit. Setengah jam sama dengan 30 menit.'),
      ],
      contoh: [
        contoh('Pukul 07.00 ditambah 2 jam menjadi pukul berapa?', ['7 + 2 = 9.', 'Jadi pukul 09.00.'], '09.00'),
        contoh('Berapa menit dalam 2 jam?', ['1 jam = 60 menit.', '2 × 60 = 120.'], '120 menit'),
      ],
      soal: [
        isian('Berapa menit dalam setengah jam?', '30', ['1 jam = 60 menit.', 'Setengah artinya dibagi 2.', '60 : 2 = ?'], '60 : 2 = 30 menit.', '60 / 2'),
        isian('Berapa menit dalam 3 jam?', '180', ['1 jam = 60 menit.', '3 jam = 3 × 60.', '3 × 60 = ?'], '3 × 60 = 180 menit.', '3 * 60'),
        pg('Zaki berangkat pukul 06.30. Ia sampai di sekolah 30 menit kemudian. Pukul berapa ia sampai?', ['06.60', '07.00', '07.30'], 1, ['30 menit lagi dari 06.30.', '06.30 + 30 menit = 06.60?', '60 menit = 1 jam, jadi menjadi pukul 07.00.'], '06.30 ditambah 30 menit adalah pukul 07.00. Tidak ada pukul 06.60.'),
        isian('Nanda belajar dari pukul 15.00 sampai pukul 16.30. Berapa menit Nanda belajar?', '90', ['Dari 15.00 ke 16.00 berapa menit?', '15.00 ke 16.00 = 60 menit. 16.00 ke 16.30 = 30 menit.', '60 + 30 = ?'], '60 menit + 30 menit = 90 menit.', '60 + 30'),
        isian('Kue dipanggang 45 menit. Ibu mulai memanggang pukul 10.30. Kue matang berapa menit setelah pukul 11.00?', '15', ['Dari 10.30 ke 11.00 ada 30 menit.', 'Masih kurang 45 − 30 = 15 menit.', '11.00 ditambah 15 menit.'], '10.30 + 30 menit = 11.00. Sisa 45 − 30 = 15 menit, jadi kue matang pukul 11.15.', '45 - 30'),
      ],
    },
  ],
  kartuBi: [
    {
      topik: 'bi3-tanda-baca',
      sumber: 'K3-bi',
      penjelasan: [
        bagian('Tanda titik (.) dipakai di akhir kalimat berita. Tanda tanya (?) dipakai di akhir kalimat tanya.'),
        bagian('Tanda seru (!) dipakai di akhir kalimat perintah atau seruan.'),
      ],
      contoh: [
        contoh('Tanda yang tepat: "Siapa namamu ..."', ['Kalimat ini bertanya.', 'Kalimat tanya diakhiri tanda tanya.'], '?'),
        contoh('Tanda yang tepat: "Tolong tutup pintu ..."', ['Kalimat ini menyuruh.', 'Kalimat perintah diakhiri tanda seru.'], '!'),
      ],
      soal: [
        pg('Tanda yang tepat: "Ayah membaca koran ..."', ['.', '?', '!'], 0, ['Apakah kalimat ini bertanya?', 'Kalimat ini memberi kabar.', 'Kalimat berita diakhiri titik.'], 'Kalimat berita diakhiri tanda titik.'),
        pg('Tanda yang tepat: "Kapan kamu pulang ..."', ['.', '?', '!'], 1, ['Ada kata kapan.', 'Kapan adalah kata tanya.', 'Kalimat tanya diakhiri tanda tanya.'], 'Kalimat tanya diakhiri tanda tanya.'),
        pg('Tanda yang tepat: "Ayo, buang sampah pada tempatnya ..."', ['.', '?', '!'], 2, ['Kalimat ini mengajak atau menyuruh.', 'Ada kata ayo.', 'Kalimat ajakan diakhiri tanda seru.'], 'Kalimat ajakan atau perintah diakhiri tanda seru.'),
        pg('Kalimat mana yang tanda bacanya benar?', ['Di mana rumahmu.', 'Di mana rumahmu?', 'Di mana rumahmu!'], 1, ['Ada kata "di mana".', 'Kalimat ini bertanya.', 'Kalimat tanya diakhiri tanda tanya.'], '"Di mana rumahmu?" adalah kalimat tanya.'),
        pg('Kalimat mana yang tanda bacanya salah?', ['Wah, indah sekali pantai ini!', 'Mira suka menggambar.', 'Apakah kamu sudah makan.'], 2, ['Periksa satu per satu.', 'Kalimat ketiga diawali kata apakah.', 'Kalimat tanya seharusnya diakhiri tanda tanya.'], '"Apakah kamu sudah makan" adalah kalimat tanya, seharusnya diakhiri tanda tanya.'),
      ],
    },
    {
      topik: 'bi3-gagasan-utama',
      sumber: 'K3-bi',
      penjelasan: [
        bagian('Gagasan utama adalah hal yang paling banyak dibicarakan dalam paragraf.'),
        bagian('Gagasan utama sering ada di kalimat pertama. Kalimat lain menjelaskannya.'),
      ],
      contoh: [
        contoh(
          '"Kucing Nanda sangat lucu. Bulunya putih bersih. Matanya bulat. Ia suka bermain bola benang." Gagasan utamanya adalah ....',
          ['Kalimat pertama: kucing Nanda lucu.', 'Kalimat lain menjelaskan kucing itu.'],
          'Kucing Nanda yang lucu',
        ),
        contoh(
          '"Pasar pagi selalu ramai. Banyak orang membeli sayur. Pedagang ikan berteriak menawarkan dagangan." Gagasan utamanya adalah ....',
          ['Kalimat pertama: pasar pagi ramai.', 'Kalimat lain menjelaskan keramaian itu.'],
          'Pasar pagi yang ramai',
        ),
      ],
      soal: [
        pg('"Sepeda Faris baru. Warnanya biru. Bannya besar. Faris memakainya ke sekolah." Gagasan utamanya adalah ....', ['warna biru', 'sepeda baru Faris', 'ban besar'], 1, ['Hal apa yang dibicarakan semua kalimat?', 'Warna dan ban adalah bagian dari sepeda.', 'Semua kalimat membicarakan sepeda Faris.'], 'Semua kalimat menjelaskan sepeda baru Faris.', { bacaan: 'Sepeda Faris baru. Warnanya biru. Bannya besar. Faris memakainya ke sekolah.' }),
        pg('"Kebun kakek luas. Ada pohon mangga dan rambutan. Ada juga kolam ikan." Gagasan utamanya adalah ....', ['kolam ikan', 'pohon mangga', 'kebun kakek yang luas'], 2, ['Cari kalimat yang dijelaskan kalimat lain.', 'Pohon dan kolam ada di dalam kebun.', 'Kalimat pertama membicarakan kebun.'], 'Kalimat pertama "Kebun kakek luas" dijelaskan oleh kalimat lain.'),
        pg('Kalimat mana yang paling cocok menjadi gagasan utama?', ['Rambutnya panjang.', 'Adikku bernama Cut Mira.', 'Ia suka menyanyi.'], 1, ['Gagasan utama bersifat umum.', 'Rambut dan menyanyi menjelaskan adik.', 'Kalimat tentang adik adalah yang umum.'], 'Kalimat lain menjelaskan adik, jadi "Adikku bernama Cut Mira" adalah gagasan utama.'),
        pg('"Hujan turun deras sejak pagi. Jalan di depan rumah tergenang. Anak-anak memakai jas hujan." Kalimat utamanya ada di kalimat ke ....', ['1', '2', '3'], 0, ['Kalimat utama berisi gagasan utama.', 'Genangan dan jas hujan terjadi karena hujan.', 'Hujan disebut di kalimat pertama.'], 'Kalimat pertama tentang hujan deras. Kalimat lain akibatnya.'),
        pg('"Burung rangkong punya paruh besar. Di atas paruhnya ada tanduk. Bulunya hitam dan putih. Burung ini tinggal di hutan." Judul yang paling cocok adalah ....', ['Hutan yang Lebat', 'Burung Rangkong', 'Paruh yang Besar'], 1, ['Judul memuat gagasan utama.', 'Paruh dan bulu adalah bagian burung.', 'Semua kalimat membicarakan burung rangkong.'], 'Semua kalimat menjelaskan burung rangkong, jadi judulnya "Burung Rangkong".'),
      ],
    },
  ],
};
