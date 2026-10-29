import { bagian, contoh, pg, type KartuMentah } from './bantu';

/** Kartu Bahasa Indonesia kelas 6 (modul B01–B11). Semua teks dan puisi ditulis sendiri. */

const TEKS_KEBUN_PALA =
  'Setiap Sabtu, Teuku membantu ayahnya di kebun pala. Mereka berangkat pukul tujuh pagi dengan sepeda motor. Di kebun, Teuku memungut buah pala yang jatuh. Ayahnya memanjat pohon untuk memetik buah yang sudah tua.';

const TEKS_KOPI =
  '(1) Kopi Gayo ditanam di dataran tinggi Aceh Tengah. (2) Tanaman kopi tumbuh baik di tempat yang sejuk. (3) Petani memetik buah kopi yang sudah merah. (4) Buah itu lalu dijemur di bawah sinar matahari selama beberapa hari.';

const TEKS_LAYANG =
  'Pagi itu Nayla membuat layang-layang. Mula-mula ia memotong bambu menjadi bilah tipis. Lalu ia mengikat bilah itu membentuk kerangka. Setelah itu, kerangka ditutup kertas minyak. Sore harinya, Nayla menerbangkan layang-layang di lapangan.';

const TEKS_MIE =
  'Mie Aceh terkenal karena rasanya yang pedas. Bumbunya terdiri atas banyak rempah. Mie dimasak bersama daging atau udang. Banyak orang dari luar daerah mencari mie Aceh saat berkunjung.';

const TEKS_SEHAT =
  'Tidur cukup membuat tubuh segar. Makan sayur membuat tubuh kuat. Berolahraga membuat otot sehat. Jadi, ada banyak cara menjaga kesehatan tubuh.';

const TEKS_SALWA =
  'Dulu Salwa tidak suka membaca. Ia lebih senang menonton televisi. Suatu hari, bibinya memberi buku cerita tentang kancil. Salwa membacanya sampai habis. Kini Salwa meminjam buku di perpustakaan setiap minggu.';

const TEKS_NELAYAN =
  'Pagi itu langit cerah dan para nelayan berangkat melaut dengan riang. Menjelang siang, awan hitam datang dan angin bertiup kencang. Para nelayan cemas dan bergegas pulang.';

const TEKS_BUAH = 'Diagram batang buah yang terjual di warung hari Minggu: jeruk 20, pisang 35, salak 25, mangga 10.';

const TEKS_HEMAT_AIR =
  'Infografik "Hemat Air di Rumah": 1) Tutup keran saat menggosok gigi. 2) Mandi memakai gayung secukupnya. 3) Siram tanaman dengan air bekas cucian sayur.';

const TEKS_LOMBA =
  '(1) Sekolah Dafa mengadakan lomba kebersihan kelas. (2) Setiap kelas membersihkan lantai, jendela, dan taman kecil. (3) Kelas 6 membuat tempat sampah dari ember bekas. (4) Juri menilai kebersihan dan kerapian kelas.';

const PUISI_HUJAN =
  'Hujan turun di atap rumah / Tik tik tik bernyanyi ramah / Adik tertawa di jendela / Pelangi datang membawa warna';

const PUISI_SAWAH =
  'Sawah Ayah kering retak / Padi layu tak bergerak / Ayah menatap langit diam / Menunggu hujan sejak malam';

export const KARTU_BI: KartuMentah[] = [
  {
    topik: 'bi6-membaca-soal',
    sumber: 'B01',
    penjelasan: [
      bagian('Baca pertanyaan dan pilihan jawaban lebih dulu. Dengan begitu, kamu tahu apa yang dicari.'),
      bagian('Lalu baca teksnya. Tandai kalimat yang menjawab pertanyaan.'),
      bagian('Pilih jawaban yang punya dasar di teks. Jangan pilih yang hanya terdengar benar.'),
    ],
    contoh: [
      contoh(
        'Teks: "Pasar Peunayong buka sejak pukul lima pagi. Pedagang ikan datang paling awal." Siapa yang datang paling awal?',
        ['Baca pertanyaannya dulu. Yang dicari adalah siapa.', 'Cari kalimat yang memuat kata "paling awal".', 'Kalimat kedua menyebut pedagang ikan.'],
        'Pedagang ikan',
      ),
      contoh(
        'Teks: "Rani menyiram bunga setiap sore. Bunga melatinya kini mekar." Kapan Rani menyiram bunga?',
        ['Yang dicari adalah waktu.', 'Kalimat pertama memuat kata "setiap sore".'],
        'Setiap sore',
      ),
    ],
    soal: [
      pg(
        'Kapan Teuku membantu ayahnya?',
        ['Setiap Sabtu', 'Setiap pagi', 'Setiap Minggu', 'Setiap sore'],
        0,
        ['Yang dicari adalah waktu.', 'Cari kata yang menunjukkan hari.', 'Lihat awal kalimat pertama.'],
        'Kalimat pertama dimulai dengan "Setiap Sabtu".',
        { bacaan: TEKS_KEBUN_PALA },
      ),
      pg(
        'Pukul berapa mereka berangkat?',
        ['Pukul enam pagi', 'Pukul tujuh pagi', 'Pukul tujuh malam', 'Pukul delapan pagi'],
        1,
        ['Yang dicari adalah jam.', 'Cari kata "berangkat" di teks.', 'Kalimat kedua menyebut jam berangkat.'],
        'Kalimat kedua: "Mereka berangkat pukul tujuh pagi."',
        { bacaan: TEKS_KEBUN_PALA },
      ),
      pg(
        'Apa yang dikerjakan Teuku di kebun?',
        ['Memanjat pohon', 'Memungut buah pala yang jatuh', 'Memetik buah yang sudah tua', 'Mengendarai sepeda motor'],
        1,
        ['Yang dicari adalah kegiatan Teuku, bukan ayahnya.', 'Cari kalimat yang dimulai dengan "Di kebun".', 'Kalimat ketiga menyebut pekerjaan Teuku.'],
        'Kalimat ketiga: "Di kebun, Teuku memungut buah pala yang jatuh." Memanjat adalah pekerjaan ayahnya.',
        { bacaan: TEKS_KEBUN_PALA },
      ),
      pg(
        'Siapa yang memanjat pohon?',
        ['Teuku', 'Ayah Teuku', 'Teuku dan ayahnya', 'Tetangga Teuku'],
        1,
        ['Cari kata "memanjat" di teks.', 'Kata itu ada di kalimat terakhir.', 'Lihat siapa pelakunya di kalimat itu.'],
        'Kalimat terakhir: "Ayahnya memanjat pohon."',
        { bacaan: TEKS_KEBUN_PALA },
      ),
      pg(
        'Langkah pertama yang tepat saat mengerjakan soal bacaan adalah …',
        ['Membaca pertanyaan lebih dulu', 'Memilih jawaban yang paling panjang', 'Menebak dari judul saja', 'Melewati teksnya'],
        0,
        ['Ingat cara yang dipelajari di kartu ini.', 'Kita perlu tahu dulu apa yang dicari.', 'Apa yang memberi tahu kita hal yang dicari?'],
        'Membaca pertanyaan lebih dulu membuat kita tahu apa yang harus dicari di teks.',
      ),
    ],
  },
  {
    topik: 'bi6-informasi-tersurat',
    sumber: 'B02',
    penjelasan: [
      bagian('Informasi tersurat adalah informasi yang tertulis jelas di teks.'),
      bagian('Jawabannya bisa ditunjuk pada satu kalimat. Kalimat itu disebut kalimat dasar jawaban.'),
    ],
    contoh: [
      contoh(
        'Teks: "Museum Tsunami Aceh berada di Banda Aceh. Museum ini dibuka untuk umum pada tahun 2009." Di kota mana museum itu berada?',
        ['Cari kata "berada di".', 'Kalimat pertama: berada di Banda Aceh.'],
        'Banda Aceh',
      ),
      contoh(
        'Teks yang sama. Tahun berapa museum itu dibuka untuk umum?',
        ['Cari kata "dibuka".', 'Kalimat kedua menyebut tahun 2009.'],
        'Tahun 2009',
      ),
    ],
    soal: [
      pg(
        'Di mana kopi Gayo ditanam?',
        ['Di pantai Aceh', 'Di dataran tinggi Aceh Tengah', 'Di Banda Aceh', 'Di Pulau Weh'],
        1,
        ['Yang dicari adalah tempat.', 'Cari kata "ditanam".', 'Lihat kalimat (1).'],
        'Kalimat (1): "Kopi Gayo ditanam di dataran tinggi Aceh Tengah."',
        { bacaan: TEKS_KOPI },
      ),
      pg(
        'Tanaman kopi tumbuh baik di tempat yang …',
        ['panas', 'sejuk', 'berpasir', 'kering'],
        1,
        ['Cari kata "tumbuh baik".', 'Kata itu ada di kalimat (2).', 'Lihat kata sesudah "tempat yang".'],
        'Kalimat (2): "Tanaman kopi tumbuh baik di tempat yang sejuk."',
        { bacaan: TEKS_KOPI },
      ),
      pg(
        'Buah kopi seperti apa yang dipetik?',
        ['Yang masih hijau', 'Yang sudah merah', 'Yang sudah jatuh', 'Yang paling kecil'],
        1,
        ['Cari kata "memetik".', 'Kata itu ada di kalimat (3).', 'Lihat warna buah yang disebut.'],
        'Kalimat (3): "Petani memetik buah kopi yang sudah merah."',
        { bacaan: TEKS_KOPI },
      ),
      pg(
        'Apa yang dilakukan pada buah kopi setelah dipetik?',
        ['Dijemur di bawah sinar matahari', 'Langsung direbus', 'Ditanam lagi', 'Dibuang kulitnya di kebun'],
        0,
        ['Cari kata penanda urutan "lalu".', 'Kata "lalu" ada di kalimat (4).', 'Apa yang terjadi pada buah di kalimat itu?'],
        'Kalimat (4): "Buah itu lalu dijemur di bawah sinar matahari."',
        { bacaan: TEKS_KOPI },
      ),
      pg(
        'Kalimat mana yang menjadi dasar jawaban "buah kopi dijemur"?',
        ['Kalimat (1)', 'Kalimat (2)', 'Kalimat (3)', 'Kalimat (4)'],
        3,
        ['Kalimat dasar jawaban memuat kata yang sama dengan jawaban.', 'Cari kata "dijemur".', 'Lihat nomor kalimatnya.'],
        'Kata "dijemur" ada di kalimat (4).',
        { bacaan: TEKS_KOPI },
      ),
    ],
  },
  {
    topik: 'bi6-arti-kata',
    sumber: 'B02',
    penjelasan: [
      bagian('Kalau ada kata yang belum kamu kenal, jangan berhenti. Baca kalimat sebelum dan sesudahnya.'),
      bagian('Coba ganti kata itu dengan pilihan jawaban. Pilih yang paling cocok dengan isi kalimat.'),
    ],
    contoh: [
      contoh(
        'Teks: "Nenek sangat gembira. Wajahnya berseri-seri saat cucunya datang." Apa arti berseri-seri?',
        ['Kalimat sebelumnya: nenek sangat gembira.', 'Wajah orang yang gembira tampak cerah.'],
        'Tampak cerah dan senang',
      ),
      contoh(
        'Teks: "Jalan itu licin setelah hujan. Banyak pengendara tergelincir." Apa arti tergelincir?',
        ['Kalimat sebelumnya: jalan licin.', 'Di jalan licin, orang mudah terpeleset.', 'Coba ganti: banyak pengendara terpeleset. Cocok.'],
        'Terpeleset',
      ),
    ],
    soal: [
      pg(
        'Arti kering kerontang adalah …',
        ['sangat kering', 'agak basah', 'penuh air', 'subur'],
        0,
        ['Baca kalimat sesudahnya.', 'Hujan tidak turun selama tiga bulan.', 'Sawah tanpa hujan tiga bulan menjadi seperti apa?'],
        'Tiga bulan tanpa hujan membuat sawah sangat kering.',
        { bacaan: 'Sawah itu kering kerontang. Sudah tiga bulan hujan tidak turun.' },
      ),
      pg(
        'Arti tekun adalah …',
        ['malas', 'rajin dan sungguh-sungguh', 'cepat bosan', 'pemarah'],
        1,
        ['Baca kalimat sesudahnya.', 'Dafa tidak pernah bolos walau lelah.', 'Orang yang tidak pernah bolos itu seperti apa?'],
        'Berlatih setiap hari dan tidak pernah bolos menunjukkan rajin dan sungguh-sungguh.',
        { bacaan: 'Dafa tekun berlatih rapai setiap hari. Ia tidak pernah bolos latihan walau lelah.' },
      ),
      pg(
        'Arti riuh adalah …',
        ['sepi', 'ramai dan berisik', 'bersih', 'sempit'],
        1,
        ['Baca kalimat sesudahnya.', 'Pedagang dan pembeli berbicara keras bersamaan.', 'Banyak orang bicara keras, suasananya seperti apa?'],
        'Banyak orang berbicara keras bersamaan berarti ramai dan berisik.',
        { bacaan: 'Pasar itu riuh sekali. Pedagang dan pembeli berbicara keras bersamaan.' },
      ),
      pg(
        'Arti iba adalah …',
        ['kasihan', 'marah', 'takut', 'bangga'],
        0,
        ['Lihat apa yang dilakukan Cut Salwa.', 'Ia memberi makan kucing yang kelaparan.', 'Perasaan apa yang membuat orang menolong hewan lapar?'],
        'Cut Salwa memberi makan karena kasihan melihat kucing kelaparan.',
        { bacaan: 'Cut Salwa memberi nasi kepada kucing yang kurus itu. Ia iba melihat kucing itu kelaparan.' },
      ),
      pg(
        'Arti keruh adalah …',
        ['jernih', 'tidak bening', 'dingin', 'dalam'],
        1,
        ['Baca kalimat sesudahnya.', 'Airnya cokelat dan penuh lumpur.', 'Air cokelat berlumpur itu bening atau tidak?'],
        'Air yang cokelat dan berlumpur tidak bening, jadi keruh artinya tidak bening.',
        { bacaan: 'Sungai itu keruh setelah banjir. Airnya cokelat dan penuh lumpur.' },
      ),
    ],
  },
  {
    topik: 'bi6-urutan-peristiwa',
    sumber: 'B03',
    penjelasan: [
      bagian('Kata penanda waktu membantu menyusun urutan. Contohnya mula-mula, lalu, setelah itu, dan akhirnya.'),
      bagian('Ikhtisar adalah ringkasan isi teks. Isinya harus sesuai dengan urutan di teks.'),
    ],
    contoh: [
      contoh(
        'Teks: "Mula-mula Bunda mencuci beras. Setelah itu, beras dimasak. Akhirnya nasi dihidangkan." Bagaimana urutannya?',
        ['Cari penanda: mula-mula, setelah itu, akhirnya.', 'Susun sesuai penanda itu.'],
        'Mencuci beras, memasak, menghidangkan',
      ),
      contoh(
        'Teks: "Ayah pergi ke pasar setelah sarapan. Sebelum sarapan, Ayah berolahraga." Apa kegiatan pertama Ayah?',
        ['"Sebelum sarapan" berarti terjadi lebih dulu daripada sarapan.', 'Urutannya: berolahraga, sarapan, ke pasar.'],
        'Berolahraga',
      ),
    ],
    soal: [
      pg(
        'Apa yang dilakukan Nayla pertama kali?',
        ['Mengikat bilah bambu', 'Memotong bambu', 'Menutup kerangka', 'Menerbangkan layang-layang'],
        1,
        ['Cari kata penanda urutan pertama.', 'Penandanya "mula-mula".', 'Lihat kalimat yang dimulai dengan "Mula-mula".'],
        '"Mula-mula ia memotong bambu menjadi bilah tipis."',
        { bacaan: TEKS_LAYANG },
      ),
      pg(
        'Apa yang dilakukan setelah kerangka jadi?',
        ['Kerangka ditutup kertas minyak', 'Bambu dipotong', 'Layang-layang diterbangkan pagi hari', 'Bilah bambu dicat'],
        0,
        ['Cari penanda "setelah itu".', 'Kalimat itu datang sesudah kerangka diikat.', 'Apa yang dilakukan pada kerangka?'],
        '"Setelah itu, kerangka ditutup kertas minyak."',
        { bacaan: TEKS_LAYANG },
      ),
      pg(
        'Kapan layang-layang diterbangkan?',
        ['Pagi hari', 'Siang hari', 'Sore hari', 'Malam hari'],
        2,
        ['Cari kata "menerbangkan".', 'Lihat kata waktu di awal kalimat itu.', 'Kalimat terakhir dimulai dengan "Sore harinya".'],
        'Kalimat terakhir: "Sore harinya, Nayla menerbangkan layang-layang."',
        { bacaan: TEKS_LAYANG },
      ),
      pg(
        'Urutan kegiatan yang benar adalah …',
        [
          'memotong, mengikat, menutup, menerbangkan',
          'mengikat, memotong, menutup, menerbangkan',
          'memotong, menutup, mengikat, menerbangkan',
          'menutup, memotong, mengikat, menerbangkan',
        ],
        0,
        ['Urutkan dengan penanda: mula-mula, lalu, setelah itu, sore harinya.', 'Mula-mula memotong, lalu mengikat.', 'Setelah itu menutup, sore harinya menerbangkan.'],
        'Penanda waktu menunjukkan urutan: memotong, mengikat, menutup, menerbangkan.',
        { bacaan: TEKS_LAYANG },
      ),
      pg(
        'Ikhtisar yang sesuai dengan teks adalah …',
        [
          'Nayla membeli layang-layang lalu menerbangkannya.',
          'Nayla membuat layang-layang dari bambu dan kertas, lalu menerbangkannya sore hari.',
          'Nayla menerbangkan layang-layang di pantai.',
          'Nayla membantu ayahnya memotong bambu.',
        ],
        1,
        ['Ikhtisar harus sesuai isi dan urutan teks.', 'Periksa setiap pilihan: apakah Nayla membeli? Di pantai?', 'Pilih yang menyebut membuat lalu menerbangkan.'],
        'Nayla membuat layang-layang sendiri dan menerbangkannya di lapangan pada sore hari.',
        { bacaan: TEKS_LAYANG },
      ),
    ],
  },
  {
    topik: 'bi6-ide-pokok',
    sumber: 'B04',
    penjelasan: [
      bagian('Ide pokok adalah hal yang paling banyak dibicarakan dalam satu paragraf.'),
      bagian('Kalimat lain disebut gagasan pendukung. Kalimat itu menjelaskan ide pokok.'),
      bagian('Ide pokok bisa ada di awal atau di akhir paragraf. Bisa juga tersebar di seluruh paragraf.'),
    ],
    contoh: [
      contoh(
        'Paragraf: "Pohon bakau banyak manfaatnya. Akarnya menahan ombak. Daunnya menjadi makanan hewan. Batangnya menjadi rumah kepiting." Apa ide pokoknya?',
        ['Semua kalimat membicarakan manfaat bakau.', 'Kalimat pertama merangkum semuanya.'],
        'Pohon bakau banyak manfaatnya',
      ),
      contoh(
        'Paragraf: "Rani menyapu halaman. Adiknya menyiram tanaman. Ayah memotong rumput. Hari itu seluruh keluarga bergotong royong membersihkan rumah." Apa ide pokoknya?',
        ['Tiga kalimat pertama berisi kegiatan.', 'Kalimat terakhir merangkum: gotong royong membersihkan rumah.'],
        'Keluarga bergotong royong membersihkan rumah',
      ),
    ],
    soal: [
      pg(
        'Ide pokok paragraf itu adalah …',
        ['Bumbu mie Aceh', 'Mie Aceh yang terkenal', 'Pengunjung dari luar daerah', 'Cara memasak udang'],
        1,
        ['Hal apa yang dibicarakan di semua kalimat?', 'Setiap kalimat membicarakan mie Aceh.', 'Kalimat pertama merangkum isi paragraf.'],
        'Kalimat pertama, "Mie Aceh terkenal karena rasanya yang pedas," dijelaskan oleh kalimat lain.',
        { bacaan: TEKS_MIE },
      ),
      pg(
        'Kalimat "Bumbunya terdiri atas banyak rempah" adalah …',
        ['ide pokok', 'gagasan pendukung', 'judul', 'amanat'],
        1,
        ['Apakah kalimat itu merangkum seluruh paragraf?', 'Kalimat itu hanya menjelaskan satu hal tentang mie Aceh.', 'Kalimat yang menjelaskan ide pokok disebut apa?'],
        'Kalimat itu menjelaskan ide pokok, jadi termasuk gagasan pendukung.',
        { bacaan: TEKS_MIE },
      ),
      pg(
        'Ide pokok paragraf itu adalah …',
        ['Tidur yang cukup', 'Makan sayur', 'Banyak cara menjaga kesehatan tubuh', 'Otot yang sehat'],
        2,
        ['Tiga kalimat pertama membicarakan hal yang berbeda.', 'Apa persamaan tidur, makan sayur, dan berolahraga?', 'Lihat kalimat yang dimulai dengan "Jadi".'],
        'Kalimat terakhir merangkum ketiga kalimat sebelumnya: banyak cara menjaga kesehatan.',
        { bacaan: TEKS_SEHAT },
      ),
      pg(
        'Di mana letak kalimat utama paragraf itu?',
        ['Di awal', 'Di tengah', 'Di akhir', 'Tidak ada'],
        2,
        ['Kalimat utama berisi ide pokok.', 'Ide pokoknya: banyak cara menjaga kesehatan.', 'Kalimat itu ada di urutan ke berapa?'],
        'Kalimat utama "Jadi, ada banyak cara menjaga kesehatan tubuh" ada di akhir paragraf.',
        { bacaan: TEKS_SEHAT },
      ),
      pg(
        'Ide pokok paragraf itu adalah …',
        ['Gajah sumatra dan kebutuhan makannya', 'Hutan Aceh yang luas', 'Buah-buahan di hutan', 'Berat gajah dewasa'],
        0,
        ['Ide pokok tidak selalu tertulis dalam satu kalimat.', 'Semua kalimat membicarakan gajah dan makanannya.', 'Pilih yang merangkum seluruh kalimat.'],
        'Setiap kalimat membicarakan gajah sumatra dan makanannya. Pilihan lain hanya sebagian kecil isi.',
        {
          bacaan:
            'Gajah sumatra hidup di hutan Aceh. Hewan ini makan rumput, daun, dan buah. Seekor gajah dewasa bisa makan lebih dari 100 kg sehari. Karena makannya banyak, gajah perlu hutan yang luas.',
        },
      ),
    ],
  },
  {
    topik: 'bi6-watak-tokoh',
    sumber: 'B05',
    penjelasan: [
      bagian('Tokoh adalah pelaku dalam cerita. Watak adalah sifat tokoh.'),
      bagian('Watak sering tidak ditulis langsung. Lihat perbuatan dan ucapan tokoh.'),
    ],
    contoh: [
      contoh(
        'Teks: "Farhan menemukan dompet di jalan. Ia segera menyerahkannya kepada pemiliknya." Bagaimana watak Farhan?',
        ['Lihat perbuatannya: mengembalikan dompet.', 'Orang yang mengembalikan barang temuan adalah orang jujur.'],
        'Jujur',
      ),
      contoh(
        'Teks: "Setiap pagi Salwa membantu ibunya sebelum berangkat sekolah, tanpa disuruh." Bagaimana watak Salwa?',
        ['Perbuatannya: membantu tanpa disuruh.', 'Itu tanda rajin dan suka menolong.'],
        'Rajin dan suka menolong',
      ),
    ],
    soal: [
      pg(
        'Watak Dafa adalah …',
        ['suka menolong', 'sombong', 'penakut', 'pemalas'],
        0,
        ['Lihat perbuatan Dafa.', 'Dafa membantu temannya berdiri.', 'Orang yang membantu teman yang jatuh disebut apa?'],
        'Dafa berlari mendekat dan membantu temannya berdiri. Itu tanda suka menolong.',
        { bacaan: 'Dafa melihat temannya jatuh dari sepeda. Ia berlari mendekat dan membantu temannya berdiri.' },
      ),
      pg(
        'Watak Nayla adalah …',
        ['malas', 'bersungguh-sungguh', 'pemarah', 'pelupa'],
        1,
        ['Lihat perbuatan Nayla saat hujan.', 'Nayla tetap berangkat latihan walau hujan.', 'Ia ingin tampil baik. Sifat apa itu?'],
        'Tetap berlatih walau hujan menunjukkan Nayla bersungguh-sungguh.',
        { bacaan: 'Meski hujan, Nayla tetap berangkat ke latihan menari. Ia ingin tampil baik di acara sekolah.' },
      ),
      pg(
        'Watak Iqbal adalah …',
        ['dermawan', 'rendah hati', 'sombong', 'sabar'],
        2,
        ['Lihat ucapan Iqbal.', 'Iqbal berkata bukunya paling bagus.', 'Orang yang merasa miliknya paling hebat disebut apa?'],
        'Ucapan "Bukuku paling bagus" dan tidak mau meminjamkan menunjukkan sifat sombong.',
        { bacaan: 'Iqbal tidak mau meminjamkan bukunya. "Bukuku paling bagus, kalian jangan menyentuhnya," katanya.' },
      ),
      pg(
        'Watak Rani adalah …',
        ['pemarah', 'sabar', 'penakut', 'ceroboh'],
        1,
        ['Lihat ucapan Rani saat bukunya basah.', 'Rani berkata "Tidak apa-apa".', 'Rani tidak marah. Sifat apa itu?'],
        'Rani menahan diri dan mengajak menjemur buku bersama. Itu tanda sabar.',
        { bacaan: 'Adik menumpahkan air di buku Rani. Rani menarik napas, lalu berkata, "Tidak apa-apa, nanti kita jemur bersama."' },
      ),
      pg(
        'Kalimat yang paling menunjukkan watak jujur adalah …',
        [
          'Teuku mengaku telah memecahkan pot bunga.',
          'Teuku bermain bola di lapangan.',
          'Teuku makan siang di rumah.',
          'Teuku pergi ke sekolah naik sepeda.',
        ],
        0,
        ['Watak terlihat dari perbuatan.', 'Jujur berarti berkata benar walau sulit.', 'Perbuatan mana yang berani berkata benar?'],
        'Mengakui kesalahan sendiri menunjukkan watak jujur. Pilihan lain kegiatan biasa.',
      ),
    ],
  },
  {
    topik: 'bi6-amanat',
    sumber: 'B05',
    penjelasan: [
      bagian('Amanat adalah pesan yang ingin disampaikan penulis.'),
      bagian('Lihat apa yang dialami tokoh dan akibat perbuatannya. Dari situ kita belajar sesuatu.'),
    ],
    contoh: [
      contoh(
        'Cerita: "Kancil malas belajar berenang. Saat banjir datang, ia kesulitan menyeberang sungai. Sejak itu ia rajin berlatih." Apa amanatnya?',
        ['Perbuatan: malas berlatih.', 'Akibat: kesulitan saat banjir.', 'Pelajaran: rajinlah berlatih.'],
        'Rajinlah berlatih agar siap menghadapi kesulitan',
      ),
      contoh(
        'Cerita: "Cut dan Rani berebut mainan. Setelah bermain bergantian, mereka tertawa bersama." Apa amanatnya?',
        ['Masalah selesai saat mereka bergantian.', 'Pesannya tentang berbagi.'],
        'Berbagilah dengan teman agar semua senang',
      ),
    ],
    soal: [
      pg(
        'Amanat cerita itu adalah …',
        ['Bernyanyi itu menyenangkan', 'Bersiaplah sejak awal untuk masa sulit', 'Semut lebih kuat dari belalang', 'Musim hujan itu dingin'],
        1,
        ['Bandingkan perbuatan semut dan belalang.', 'Semut mengumpulkan makanan, belalang hanya bernyanyi.', 'Apa akibatnya saat musim hujan?'],
        'Semut yang bersiap punya makanan, belalang kelaparan. Pesannya: bersiaplah sejak awal.',
        {
          bacaan:
            'Semut mengumpulkan makanan sepanjang musim kemarau. Belalang hanya bernyanyi. Saat musim hujan, semut punya makanan, sedangkan belalang kelaparan.',
        },
      ),
      pg(
        'Amanat cerita itu adalah …',
        ['Kerjakan tugas tepat waktu', 'Bermain itu penting', 'Guru selalu marah', 'Rasa malu itu wajar'],
        0,
        ['Apa kebiasaan Teuku?', 'Teuku selalu menunda tugas.', 'Akibatnya ia malu. Apa pelajarannya?'],
        'Menunda tugas membuat Teuku malu. Pesannya: kerjakan tugas tepat waktu.',
        { bacaan: 'Teuku selalu menunda tugas rumahnya. Pada hari pengumpulan, tugasnya belum selesai dan ia merasa malu.' },
      ),
      pg(
        'Amanat cerita itu adalah …',
        ['Kerja bakti itu melelahkan', 'Kejujuran membuat kita dipercaya', 'Orang sakit harus ke dokter', 'Teman suka marah'],
        1,
        ['Apa yang dilakukan Nayla?', 'Nayla berbohong.', 'Apa akibat kebohongannya?'],
        'Karena berbohong, Nayla tidak dipercaya lagi. Pesannya: jujurlah agar dipercaya.',
        { bacaan: 'Nayla berbohong bahwa ia sakit agar tidak ikut kerja bakti. Teman-temannya kemudian tidak percaya lagi kepadanya.' },
      ),
      pg(
        'Amanat cerita itu adalah …',
        ['Sepeda itu mahal', 'Menabung sedikit demi sedikit lama-lama menjadi banyak', 'Setahun itu lama', 'Belanja itu menyenangkan'],
        1,
        ['Apa yang dilakukan Iqbal setiap hari?', 'Iqbal menabung sedikit demi sedikit.', 'Apa hasilnya setelah setahun?'],
        'Tabungan kecil setiap hari membuat Iqbal bisa membeli sepeda. Itulah pesannya.',
        { bacaan: 'Iqbal menabung sedikit demi sedikit setiap hari. Setelah setahun, ia bisa membeli sepeda sendiri.' },
      ),
      pg(
        'Amanat adalah …',
        ['pelaku dalam cerita', 'tempat terjadinya cerita', 'pesan yang ingin disampaikan penulis', 'urutan kejadian dalam cerita'],
        2,
        ['Ingat arti istilah di kartu ini.', 'Pelaku disebut tokoh. Tempat disebut latar.', 'Pesan penulis disebut apa?'],
        'Amanat adalah pesan yang ingin disampaikan penulis kepada pembaca.',
      ),
    ],
  },
  {
    topik: 'bi6-perubahan-tokoh-latar',
    sumber: 'B06',
    penjelasan: [
      bagian('Latar adalah tempat, waktu, dan suasana cerita.'),
      bagian('Bandingkan kalimat di awal dan di akhir cerita. Apa yang berbeda?'),
      bagian('Bedakan perubahan dengan penyebabnya. Penyebab adalah hal yang membuat perubahan terjadi.'),
    ],
    contoh: [
      contoh(
        'Cerita: "Dafa takut berbicara di depan kelas. Ia berlatih setiap malam. Akhirnya Dafa berani bercerita di depan teman-temannya." Apa yang berubah?',
        ['Awal: Dafa takut.', 'Akhir: Dafa berani.', 'Berlatih adalah penyebab, bukan perubahan.'],
        'Dafa berubah dari takut menjadi berani',
      ),
      contoh(
        'Cerita: "Pantai itu penuh sampah. Warga membersihkannya bersama. Kini pantai itu bersih dan ramai pengunjung." Apa yang berubah?',
        ['Awal: pantai kotor.', 'Akhir: pantai bersih dan ramai.'],
        'Pantai berubah dari kotor menjadi bersih',
      ),
    ],
    soal: [
      pg(
        'Apa yang berubah pada Salwa?',
        [
          'Dari tidak suka membaca menjadi suka membaca',
          'Dari suka televisi menjadi suka bermain',
          'Dari malas menjadi pemarah',
          'Dari sedih menjadi takut',
        ],
        0,
        ['Bandingkan kalimat awal dan kalimat akhir.', 'Awal: Salwa tidak suka membaca.', 'Akhir: Salwa meminjam buku setiap minggu.'],
        'Awalnya Salwa tidak suka membaca. Akhirnya ia rajin meminjam buku.',
        { bacaan: TEKS_SALWA },
      ),
      pg(
        'Apa penyebab perubahan pada Salwa?',
        ['Salwa menonton televisi', 'Bibi memberi buku cerita', 'Perpustakaan tutup', 'Salwa sakit'],
        1,
        ['Cari kejadian di tengah cerita.', 'Ada orang yang memberi Salwa sesuatu.', 'Sesudah itu Salwa mulai membaca.'],
        'Buku cerita dari bibi membuat Salwa mulai suka membaca.',
        { bacaan: TEKS_SALWA },
      ),
      pg(
        'Latar waktu di awal cerita adalah …',
        ['Malam', 'Pagi', 'Sore', 'Tengah malam'],
        1,
        ['Latar waktu menjawab kapan.', 'Lihat kalimat pertama.', 'Kalimat pertama dimulai dengan "Pagi itu".'],
        'Kalimat pertama menyebut "Pagi itu".',
        { bacaan: TEKS_NELAYAN },
      ),
      pg(
        'Bagaimana suasana cerita berubah?',
        ['Dari riang menjadi cemas', 'Dari cemas menjadi riang', 'Dari sedih menjadi gembira', 'Suasananya tidak berubah'],
        0,
        ['Suasana dilihat dari perasaan tokoh.', 'Awal: nelayan berangkat dengan riang.', 'Akhir: nelayan cemas.'],
        'Awalnya nelayan riang. Sesudah awan hitam datang, mereka cemas.',
        { bacaan: TEKS_NELAYAN },
      ),
      pg(
        'Perubahan latar dalam cerita itu adalah …',
        [
          'Kampung berubah dari gelap menjadi terang pada malam hari',
          'Warga berubah dari malas menjadi rajin',
          'Anak-anak berubah dari pintar menjadi malas',
          'Kampung berubah dari ramai menjadi sepi',
        ],
        0,
        ['Latar adalah tempat, waktu, dan suasana.', 'Awal: kampung gelap pada malam hari.', 'Akhir: jalan kampung terang.'],
        'Kampung yang dulu gelap kini terang. Memasang lampu adalah penyebabnya.',
        {
          bacaan:
            'Kampung itu dulu gelap pada malam hari. Warga lalu memasang lampu tenaga surya bersama-sama. Sekarang jalan kampung terang dan anak-anak bisa belajar kelompok pada malam hari.',
        },
      ),
    ],
  },
  {
    topik: 'bi6-ungkapan-majas',
    sumber: 'B07',
    penjelasan: [
      bagian('Ungkapan adalah gabungan kata yang artinya bukan arti kata per kata. Contohnya buah tangan, artinya oleh-oleh.'),
      bagian('Majas adalah gaya bahasa. Contohnya angin berbisik, seolah angin bisa berbicara.'),
      bagian('Temukan artinya dari kalimat di sekitarnya, bukan dari hafalan.'),
    ],
    contoh: [
      contoh(
        'Teks: "Paman pulang dari Medan membawa buah tangan. Kami senang menerima kue bolu darinya." Apa arti buah tangan?',
        ['Kalimat berikutnya: kami menerima kue bolu.', 'Kue yang dibawa dari perjalanan disebut oleh-oleh.'],
        'Oleh-oleh',
      ),
      contoh(
        'Teks: "Ombak berkejaran menuju pantai." Apa makna ombak berkejaran?',
        ['Ombak tidak punya kaki untuk berkejaran.', 'Maknanya ombak datang terus-menerus, susul-menyusul.'],
        'Ombak datang susul-menyusul',
      ),
    ],
    soal: [
      pg(
        'Arti buah bibir adalah …',
        ['bahan pembicaraan', 'buah yang manis', 'bibir yang merah', 'orang pendiam'],
        0,
        ['Baca kalimat sesudahnya.', 'Semua orang membicarakan Farhan.', 'Orang yang dibicarakan banyak orang disebut apa?'],
        'Kalimat kedua menjelaskan bahwa semua orang membicarakan Farhan. Jadi buah bibir artinya bahan pembicaraan.',
        { bacaan: 'Farhan menjadi buah bibir di sekolah. Semua orang membicarakan kemenangannya di lomba catur.' },
      ),
      pg(
        'Arti membanting tulang adalah …',
        ['bekerja keras', 'mematahkan tulang', 'bermain', 'beristirahat'],
        0,
        ['Baca kalimat sesudahnya.', 'Bunda berjualan dari pagi buta sampai sore.', 'Bekerja selama itu disebut apa?'],
        'Berjualan dari pagi buta sampai sore menunjukkan bekerja keras.',
        { bacaan: 'Bunda membanting tulang agar kami bisa sekolah. Ia berjualan kue dari pagi buta sampai sore.' },
      ),
      pg(
        'Arti naik daun adalah …',
        ['memanjat pohon', 'sedang terkenal', 'sedang sakit', 'sedang sedih'],
        1,
        ['Baca kalimat sesudahnya.', 'Lagu Rani diputar di banyak acara.', 'Orang yang lagunya diputar di mana-mana itu sedang apa?'],
        'Lagu yang diputar di banyak acara menunjukkan Rani sedang terkenal.',
        { bacaan: 'Rani sedang naik daun. Lagu ciptaannya diputar di banyak acara sekolah.' },
      ),
      pg(
        'Makna "matahari tersenyum" adalah …',
        ['matahari punya mulut', 'matahari bersinar cerah', 'matahari terbenam', 'hari mendung'],
        1,
        ['Matahari tidak bisa tersenyum seperti manusia.', 'Orang tersenyum tampak cerah dan senang.', 'Matahari yang tampak cerah berarti apa?'],
        'Ini majas. Matahari digambarkan seperti manusia yang tersenyum, artinya bersinar cerah.',
        { bacaan: 'Matahari tersenyum di balik awan pagi itu. Anak-anak bergegas bermain di halaman.' },
      ),
      pg(
        'Arti bagai pinang dibelah dua adalah …',
        ['sangat mirip', 'selalu bertengkar', 'suka makan pinang', 'berbeda jauh'],
        0,
        ['Baca kalimat sesudahnya.', 'Wajah mereka mirip sampai guru sering tertukar.', 'Pinang yang dibelah dua, kedua belahannya seperti apa?'],
        'Guru sering tertukar karena wajah mereka mirip. Jadi artinya sangat mirip.',
        { bacaan: 'Dafa dan Iqbal bagai pinang dibelah dua. Wajah mereka mirip sekali sampai guru sering tertukar.' },
      ),
    ],
  },
  {
    topik: 'bi6-fakta-opini',
    sumber: 'B08',
    penjelasan: [
      bagian('Fakta adalah pernyataan yang bisa dibuktikan benar atau salah.'),
      bagian('Opini adalah pendapat, perasaan, atau penilaian seseorang. Kata indah, enak, dan sebaiknya sering menandai opini.'),
      bagian('Kalimat berangka atau ucapan ahli belum tentu fakta. Tetap periksa, bisa dibuktikan atau tidak.'),
    ],
    contoh: [
      contoh(
        'Kalimat: "Pulau Weh terletak di ujung utara Pulau Sumatra." Fakta atau opini?',
        ['Bisakah dibuktikan? Bisa, dengan melihat peta.', 'Jadi kalimat ini fakta.'],
        'Fakta',
      ),
      contoh(
        'Kalimat: "Pantai di Pulau Weh adalah pantai paling indah." Fakta atau opini?',
        ['Kata "paling indah" adalah penilaian.', 'Orang lain bisa punya pendapat berbeda.'],
        'Opini',
      ),
    ],
    soal: [
      pg(
        'Manakah kalimat fakta?',
        ['Banda Aceh adalah ibu kota Provinsi Aceh.', 'Banda Aceh adalah kota yang paling nyaman.', 'Kopi Aceh paling enak.', 'Sebaiknya semua orang berkunjung ke Aceh.'],
        0,
        ['Fakta bisa dibuktikan.', 'Cari kata penilaian: nyaman, enak, sebaiknya.', 'Pilih kalimat tanpa kata penilaian yang bisa diperiksa.'],
        'Ibu kota provinsi bisa diperiksa kebenarannya. Kalimat lain berisi penilaian atau saran.',
      ),
      pg(
        'Manakah kalimat opini?',
        ['Satu minggu ada tujuh hari.', 'Daun bayam berwarna hijau.', 'Pelajaran menggambar sangat menyenangkan.', 'Air mendidih pada suhu 100 °C.'],
        2,
        ['Opini berisi perasaan atau penilaian.', 'Cari kata yang menunjukkan perasaan.', 'Kata "menyenangkan" bisa berbeda bagi setiap orang.'],
        '"Sangat menyenangkan" adalah perasaan. Orang lain bisa merasa berbeda.',
      ),
      pg(
        'Sebanyak 30 murid ikut lomba kebersihan kelas tahun ini. Kalimat itu termasuk …',
        ['fakta', 'opini', 'pertanyaan', 'perintah'],
        0,
        ['Bisakah kalimat itu dibuktikan?', 'Banyak murid bisa dihitung dari daftar peserta.', 'Kalimat yang bisa dibuktikan disebut apa?'],
        'Banyak peserta bisa diperiksa dari daftar, jadi kalimat itu fakta.',
      ),
      pg(
        'Kalimat itu termasuk …',
        ['fakta, karena diucapkan dokter', 'opini, karena berisi saran "sebaiknya"', 'fakta, karena ada angka', 'bukan fakta dan bukan opini'],
        1,
        ['Ucapan ahli belum tentu fakta.', 'Perhatikan kata "sebaiknya".', 'Saran adalah pendapat seseorang.'],
        'Kata "sebaiknya" menunjukkan saran atau pendapat. Ada angka dan ada dokter tidak membuatnya menjadi fakta.',
        { bacaan: 'Menurut seorang dokter, anak-anak sebaiknya tidur sembilan jam setiap malam.' },
      ),
      pg(
        'Manakah kalimat fakta yang memuat angka?',
        ['Harga 2 kg beras di warung itu Rp26.000.', 'Harga beras itu terlalu mahal.', 'Beras itu enak sekali.', 'Seharusnya harga beras turun.'],
        0,
        ['Cari kalimat yang memuat angka.', 'Periksa: bisakah harganya dibuktikan?', 'Harga bisa dilihat di warung.'],
        'Harga Rp26.000 bisa diperiksa di warung. Kalimat lain berisi penilaian atau harapan.',
      ),
    ],
  },
  {
    topik: 'bi6-infografik',
    sumber: 'B09',
    petunjukOrtu: 'Baca bersama jadwal, label kemasan, atau grafik di koran. Ajukan satu pertanyaan yang jawabannya ada di gambar itu.',
    penjelasan: [
      bagian('Infografik menggabungkan tulisan, angka, dan gambar.'),
      bagian('Baca judul dan keterangannya dulu. Lalu cari bagian gambar yang menjawab pertanyaan.', {
        jenis: 'batang',
        nilai: [12, 8, 15, 5],
        label: ['Sen', 'Sel', 'Rab', 'Kam'],
      }),
    ],
    contoh: [
      contoh(
        'Diagram batang buku yang dibaca kelas 6: Senin 12, Selasa 8, Rabu 15, Kamis 5. Hari apa paling banyak?',
        ['Lihat batang yang paling tinggi.', 'Batang Rabu paling tinggi, yaitu 15.'],
        'Rabu',
      ),
      contoh(
        'Tabel jadwal: Senin pramuka, Rabu menari, Jumat sepak bola. Kapan latihan menari?',
        ['Cari kata "menari" di tabel.', 'Menari ada di baris Rabu.'],
        'Rabu',
      ),
    ],
    soal: [
      pg(
        'Buah apa yang paling banyak terjual?',
        ['Jeruk', 'Pisang', 'Salak', 'Mangga'],
        1,
        ['Lihat batang yang paling tinggi.', 'Bandingkan angkanya: 20, 35, 25, 10.', 'Angka terbesar milik buah apa?'],
        'Pisang terjual 35, paling banyak.',
        { bacaan: TEKS_BUAH, gambar: { jenis: 'batang', nilai: [20, 35, 25, 10], label: ['Jeruk', 'Pisang', 'Salak', 'Mangga'] } },
      ),
      pg(
        'Berapa selisih penjualan pisang dan mangga?',
        ['10', '15', '25', '45'],
        2,
        ['Cari angka pisang dan angka mangga.', 'Pisang 35, mangga 10.', 'Selisih berarti dikurangi.'],
        '35 − 10 = 25.',
        { bacaan: TEKS_BUAH, gambar: { jenis: 'batang', nilai: [20, 35, 25, 10], label: ['Jeruk', 'Pisang', 'Salak', 'Mangga'] }, hitung: '35 - 10' },
      ),
      pg(
        'Menurut infografik, air bekas cucian sayur dipakai untuk …',
        ['mandi', 'menyiram tanaman', 'mencuci piring', 'memasak'],
        1,
        ['Cari kata "air bekas cucian sayur".', 'Kata itu ada di butir 3.', 'Apa yang dilakukan dengan air itu?'],
        'Butir 3: "Siram tanaman dengan air bekas cucian sayur."',
        { bacaan: TEKS_HEMAT_AIR },
      ),
      pg(
        'Apa tujuan infografik itu?',
        ['Mengajak menghemat air', 'Menjual keran', 'Mengajarkan memasak', 'Menceritakan banjir'],
        0,
        ['Baca judulnya.', 'Judulnya "Hemat Air di Rumah".', 'Semua butir berisi cara melakukan apa?'],
        'Judul dan ketiga butirnya berisi cara menghemat air.',
        { bacaan: TEKS_HEMAT_AIR },
      ),
      pg(
        'Kapal dari Sabang ke Banda Aceh pada sore hari berangkat pukul …',
        ['08.00', '10.00', '14.00', '16.00'],
        3,
        ['Cari baris "Sabang ke Banda Aceh".', 'Jam di baris itu 10.00 dan 16.00.', 'Mana yang sore hari?'],
        'Dari Sabang berangkat pukul 10.00 dan 16.00. Yang sore pukul 16.00.',
        { bacaan: 'Tabel jadwal kapal. Banda Aceh ke Sabang: pukul 08.00 dan 14.00. Sabang ke Banda Aceh: pukul 10.00 dan 16.00.' },
      ),
    ],
  },
  {
    topik: 'bi6-relevansi',
    sumber: 'B10',
    penjelasan: [
      bagian('Relevan artinya berhubungan dan masuk akal dengan isi teks.'),
      bagian('Untuk setiap pilihan, tanyakan: pilihan ini beralasan dari kalimat nomor berapa?'),
      bagian('Pilihan yang tidak punya alasan di teks berarti tidak relevan.'),
    ],
    contoh: [
      contoh(
        'Teks: "(1) Banjir melanda kampung Rani. (2) Air masuk ke rumah warga. (3) Warga mengungsi ke sekolah." Judul apa yang relevan?',
        ['Semua kalimat tentang banjir dan akibatnya.', 'Judul harus mewakili seluruh isi.'],
        'Banjir di Kampung Rani',
      ),
      contoh(
        'Teks yang sama. Apakah kalimat "Warga menanam padi bersama" relevan?',
        ['Cari alasannya di kalimat (1) sampai (3).', 'Tidak ada kalimat tentang menanam padi.'],
        'Tidak relevan',
      ),
    ],
    soal: [
      pg(
        'Judul yang paling relevan untuk teks itu adalah …',
        ['Lomba Kebersihan Kelas', 'Cara Membuat Ember', 'Liburan ke Pantai', 'Juri yang Galak'],
        0,
        ['Judul harus mewakili seluruh isi teks.', 'Kalimat (1) sampai (4) membicarakan apa?', 'Semua kalimat tentang lomba kebersihan.'],
        'Kalimat (1) menyebut lomba kebersihan kelas, dan kalimat lain menjelaskannya.',
        { bacaan: TEKS_LOMBA },
      ),
      pg(
        'Kalimat "Kelas 6 membuat tempat sampah dari ember bekas" beralasan dari kalimat nomor …',
        ['(1)', '(2)', '(3)', '(4)'],
        2,
        ['Cari kata "ember bekas".', 'Periksa kalimat satu per satu.', 'Kata itu ada di kalimat ketiga.'],
        'Kalimat (3) menyebut ember bekas.',
        { bacaan: TEKS_LOMBA },
      ),
      pg(
        'Pernyataan yang relevan dengan teks adalah …',
        ['Kelas 6 memanfaatkan barang bekas.', 'Kelas 6 pergi berkemah.', 'Juri menilai lomba menyanyi.', 'Sekolah libur selama lomba.'],
        0,
        ['Untuk setiap pilihan, cari alasannya di teks.', 'Adakah kalimat tentang berkemah, menyanyi, atau libur?', 'Kalimat (3) menyebut ember bekas.'],
        'Kalimat (3) menjadi alasannya. Pilihan lain tidak punya dasar di teks.',
        { bacaan: TEKS_LOMBA },
      ),
      pg(
        'Tindakan mana yang relevan untuk memenangkan lomba itu?',
        [
          'Merapikan meja dan membuang sampah pada tempatnya',
          'Membawa mainan ke kelas',
          'Menambah banyak kursi',
          'Menutup jendela rapat-rapat',
        ],
        0,
        ['Apa yang dinilai juri?', 'Kalimat (4): juri menilai kebersihan dan kerapian.', 'Tindakan mana yang membuat kelas bersih dan rapi?'],
        'Juri menilai kebersihan dan kerapian, jadi merapikan meja dan membuang sampah adalah tindakan yang relevan.',
        { bacaan: TEKS_LOMBA },
      ),
      pg(
        'Kalimat manakah yang tidak relevan dengan teks?',
        ['Taman kecil ikut dibersihkan.', 'Juri menilai kerapian kelas.', 'Kelas 5 juara lomba menyanyi.', 'Lantai kelas dibersihkan.'],
        2,
        ['Cari pilihan yang tidak punya alasan di teks.', 'Periksa: taman, juri, dan lantai disebut di kalimat mana?', 'Adakah kalimat tentang lomba menyanyi?'],
        'Teks tidak membicarakan lomba menyanyi, jadi kalimat itu tidak relevan.',
        { bacaan: TEKS_LOMBA },
      ),
    ],
  },
  {
    topik: 'bi6-puisi',
    sumber: 'B11',
    petunjukOrtu: 'Bacakan puisi bergantian dengan anak, satu larik seorang. Tanyakan kata mana yang membuatnya merasa senang atau sedih.',
    penjelasan: [
      bagian('Puisi tersusun dari larik dan bait. Larik adalah satu baris puisi, bait adalah kelompok larik.'),
      bagian('Perasaan dalam puisi muncul dari pilihan kata. Lingkari kata yang membawa perasaan.'),
      bagian('Kata riang dan tertawa membawa rasa gembira. Kata sepi dan pilu membawa rasa sedih.'),
    ],
    contoh: [
      contoh(
        'Puisi: "Ombak menari di pantai biru / Burung camar bernyanyi merdu / Hatiku riang tak menentu." Apa perasaan dalam puisi itu?',
        ['Lingkari kata: menari, bernyanyi, riang.', 'Semua kata itu membawa rasa senang.'],
        'Gembira',
      ),
      contoh(
        'Puisi: "Rumah kosong tanpa suara / Kursi Nenek diam saja / Aku rindu cerita lama." Apa perasaan dalam puisi itu?',
        ['Lingkari kata: kosong, diam, rindu.', 'Kata-kata itu membawa rasa sedih dan rindu.'],
        'Rindu dan sedih',
      ),
    ],
    soal: [
      pg(
        'Perasaan dalam puisi itu adalah …',
        ['gembira', 'marah', 'takut', 'sedih'],
        0,
        ['Baca puisinya utuh.', 'Lingkari kata yang membawa perasaan.', 'Ada kata bernyanyi, tertawa, dan pelangi.'],
        'Kata bernyanyi ramah, tertawa, dan pelangi membawa rasa gembira.',
        { bacaan: PUISI_HUJAN },
      ),
      pg(
        'Kata yang paling menunjukkan perasaan itu adalah …',
        ['atap', 'tertawa', 'jendela', 'rumah'],
        1,
        ['Perasaan gembira muncul dari kata tertentu.', 'Atap, jendela, dan rumah adalah nama benda.', 'Kata mana yang menunjukkan orang senang?'],
        'Kata tertawa menunjukkan rasa senang. Kata lain hanya nama benda.',
        { bacaan: PUISI_HUJAN },
      ),
      pg(
        'Ada berapa larik dalam puisi itu?',
        ['2', '3', '4', '5'],
        2,
        ['Larik adalah satu baris puisi.', 'Tanda garis miring memisahkan larik.', 'Hitung larik dari awal sampai akhir.'],
        'Puisi itu punya 4 larik dalam satu bait.',
        { bacaan: PUISI_HUJAN },
      ),
      pg(
        'Perasaan dalam puisi itu adalah …',
        ['riang', 'cemas dan sedih', 'bangga', 'lucu'],
        1,
        ['Lingkari kata yang membawa perasaan.', 'Ada kata kering retak, layu, dan diam.', 'Kata-kata itu membawa rasa senang atau sedih?'],
        'Sawah kering, padi layu, dan Ayah menatap langit diam membawa rasa cemas dan sedih.',
        { bacaan: PUISI_SAWAH },
      ),
      pg(
        'Larik yang menunjukkan Ayah berharap adalah …',
        ['Sawah Ayah kering retak', 'Padi layu tak bergerak', 'Ayah menatap langit diam', 'Menunggu hujan sejak malam'],
        3,
        ['Berharap berarti menginginkan sesuatu datang.', 'Apa yang diinginkan Ayah untuk sawahnya?', 'Cari larik yang memuat kata menunggu.'],
        'Larik "Menunggu hujan sejak malam" menunjukkan Ayah berharap hujan turun.',
        { bacaan: PUISI_SAWAH },
      ),
    ],
  },
];
