import { bagian, contoh, isian, pg, type KartuMentah } from './bantu';

/** Gudang Ilmu tahap 2, kelas 4 dan 5: kartu untuk topik yang sebelumnya "segera". Belum diperiksa guru. */

export const T2_K4: { mat: KartuMentah[]; bi: KartuMentah[] } = {
  mat: [
    {
      topik: 'mat4-bilangan-besar',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Bilangan empat angka punya ribuan, ratusan, puluhan, dan satuan.'),
        bagian('Pada 3.472, angka 3 bernilai 3.000 dan angka 4 bernilai 400.'),
      ],
      contoh: [
        contoh('Nilai angka 5 pada 5.218 adalah ....', ['5 di tempat ribuan.', '5 ribuan = 5.000.'], '5.000'),
        contoh('4.000 + 300 + 60 + 2 = ?', ['Gabungkan sesuai tempatnya.'], '4.362'),
      ],
      soal: [
        isian('Nilai angka 7 pada 2.745 adalah ...', '700', ['7 di tempat kedua dari kiri.', 'Itu tempat ratusan.', '7 ratusan = 700.'], 'Angka 7 di tempat ratusan, bernilai 700.', '700'),
        isian('6.000 + 500 + 30 + 9 = ...', '6.539', ['Gabungkan saja.', '6 ribuan, 5 ratusan, 3 puluhan, 9 satuan.', 'Tulis 6.539.'], '6.000 + 500 + 30 + 9 = 6.539.', '6000 + 500 + 30 + 9'),
        pg('Urutan dari yang terkecil adalah ....', ['3.098; 3.809; 3.890', '3.890; 3.809; 3.098', '3.809; 3.098; 3.890'], 0, ['Ribuan semuanya 3.', 'Bandingkan ratusan: 0, 8, 8.', 'Untuk 3.809 dan 3.890 bandingkan puluhan.'], '3.098 < 3.809 < 3.890.'),
        isian('Berapa hasil 2.450 + 1.375?', '3.825', ['Jumlahkan dari satuan.', 'Satuan 0 + 5 = 5, puluhan 5 + 7 = 12 (simpan 1).', 'Ratusan 4 + 3 + 1 = 8, ribuan 2 + 1 = 3.'], '2.450 + 1.375 = 3.825.', '2450 + 1375'),
        isian('Sebuah desa punya 5.000 bibit pohon. Sebanyak 2.350 sudah ditanam. Berapa bibit yang belum ditanam?', '2.650', ['Belum ditanam = semua − sudah ditanam.', '5.000 − 2.350.', 'Hasilnya 2.650.'], '5.000 − 2.350 = 2.650 bibit.', '5000 - 2350'),
      ],
    },
    {
      topik: 'mat4-desimal',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Pecahan per sepuluh bisa ditulis desimal. 3/10 ditulis 0,3.', { jenis: 'petak', baris: 1, kolom: 10, terisi: 3 }),
        bagian('Pecahan per seratus memakai dua angka di belakang koma. 25/100 ditulis 0,25.'),
      ],
      contoh: [
        contoh('Tulis 7/10 sebagai desimal.', ['Per sepuluh: satu angka di belakang koma.'], '0,7'),
        contoh('Tulis 0,45 sebagai pecahan.', ['Dua angka di belakang koma: per seratus.'], '45/100'),
      ],
      soal: [
        isian('Tulis 9/10 sebagai desimal.', '0,9', ['Per sepuluh.', 'Satu angka di belakang koma.', '9 per sepuluh = 0,9.'], '9/10 = 0,9.', '9/10'),
        isian('Tulis 0,6 sebagai pecahan per sepuluh. (tulis pecahannya)', '6/10', ['0,6 artinya 6 per sepuluh.', 'Angka bawah 10.', 'Angka atas 6.'], '0,6 = 6/10.', '0.6'),
        pg('Mana yang lebih besar?', ['0,5', '0,35'], 0, ['Samakan banyak angka di belakang koma.', '0,5 = 0,50.', 'Bandingkan 50 dan 35.'], '0,50 lebih besar dari 0,35.', 'maks(0.5, 0.35)'),
        isian('Berapa hasil 0,4 + 0,3?', '0,7', ['Jumlahkan seperti biasa.', '4 per sepuluh + 3 per sepuluh.', '7 per sepuluh.'], '0,4 + 0,3 = 0,7.', '0.4 + 0.3'),
        isian('Pita 1 meter dipotong 0,25 meter. Berapa meter sisanya?', '0,75', ['1 meter = 1,00 meter.', '1,00 − 0,25.', 'Hasilnya 0,75.'], '1 − 0,25 = 0,75 meter.', '1 - 0.25'),
      ],
    },
    {
      topik: 'mat4-sudut',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Sudut siku-siku seperti pojok buku. Besarnya 90 derajat.'),
        bagian('Sudut lancip lebih kecil dari siku-siku. Sudut tumpul lebih besar dari siku-siku.'),
      ],
      contoh: [
        contoh('Sudut 45 derajat termasuk sudut ....', ['45 lebih kecil dari 90.'], 'lancip'),
        contoh('Sudut 120 derajat termasuk sudut ....', ['120 lebih besar dari 90.'], 'tumpul'),
      ],
      soal: [
        pg('Pojok papan tulis membentuk sudut ....', ['lancip', 'siku-siku', 'tumpul'], 1, ['Pojok papan tulis seperti pojok buku.', 'Pojok buku besarnya 90 derajat.', '90 derajat adalah siku-siku.'], 'Pojok papan tulis siku-siku.'),
        pg('Sudut 30 derajat termasuk sudut ....', ['lancip', 'siku-siku', 'tumpul'], 0, ['Bandingkan dengan 90.', '30 lebih kecil dari 90.', 'Lebih kecil dari siku-siku disebut lancip.'], '30 derajat < 90 derajat, jadi lancip.'),
        pg('Sudut 150 derajat termasuk sudut ....', ['lancip', 'siku-siku', 'tumpul'], 2, ['Bandingkan dengan 90.', '150 lebih besar dari 90.', 'Lebih besar dari siku-siku disebut tumpul.'], '150 derajat > 90 derajat, jadi tumpul.'),
        isian('Dua sudut siku-siku digabung. Berapa derajat besarnya?', '180', ['Satu siku-siku 90 derajat.', '90 + 90.', '90 + 90 = 180.'], '90 + 90 = 180 derajat (garis lurus).', '90 + 90'),
        isian('Jarum jam menunjuk pukul 3 tepat. Berapa derajat sudut antara jarum pendek dan panjang?', '90', ['Jarum panjang di 12, pendek di 3.', 'Bentuknya seperti pojok buku.', 'Itu siku-siku.'], 'Pukul 3 tepat membentuk sudut siku-siku, 90 derajat.', '90'),
      ],
    },
    {
      topik: 'mat4-diagram-batang',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Diagram batang menunjukkan data dengan batang. Makin tinggi batang, makin banyak datanya.', { jenis: 'batang', nilai: [4, 7, 5], label: ['Sen', 'Sel', 'Rab'] }),
        bagian('Baca angka di garis tegak untuk tahu tinggi batang.'),
      ],
      contoh: [
        contoh('Senin 4, Selasa 7, Rabu 5. Hari apa paling banyak?', ['Cari batang paling tinggi.', 'Selasa 7.'], 'Selasa'),
        contoh('Berapa selisih Selasa dan Senin?', ['7 − 4 = 3.'], '3'),
      ],
      soal: [
        isian('Diagram: Senin 4, Selasa 7, Rabu 5 anak. Berapa anak semuanya?', '16', ['Jumlahkan semua batang.', '4 + 7 + 5.', '4 + 7 = 11, 11 + 5 = 16.'], '4 + 7 + 5 = 16 anak.', { hitung: '4 + 7 + 5', gambar: { jenis: 'batang', nilai: [4, 7, 5], label: ['Sen', 'Sel', 'Rab'] } }),
        pg('Buah kesukaan: jeruk 6, apel 3, pisang 8. Buah mana paling disukai?', ['Jeruk', 'Apel', 'Pisang'], 2, ['Cari angka terbesar.', '8 paling besar.', 'Itu pisang.'], 'Pisang 8, paling banyak.', { gambar: { jenis: 'batang', nilai: [6, 3, 8], label: ['Jeruk', 'Apel', 'Pisang'] } }),
        isian('Buah kesukaan: jeruk 6, apel 3, pisang 8. Berapa selisih pisang dan apel?', '5', ['Selisih artinya dikurangi.', '8 − 3.', '8 − 3 = 5.'], '8 − 3 = 5.', { hitung: '8 - 3', gambar: { jenis: 'batang', nilai: [6, 3, 8], label: ['Jeruk', 'Apel', 'Pisang'] } }),
        isian('Sampah plastik terkumpul: Kelas 4A 12 kg, 4B 9 kg, 4C 15 kg. Berapa kg semuanya?', '36', ['Jumlahkan ketiga kelas.', '12 + 9 = 21.', '21 + 15 = ?'], '12 + 9 + 15 = 36 kg.', { hitung: '12 + 9 + 15', gambar: { jenis: 'batang', nilai: [12, 9, 15], label: ['4A', '4B', '4C'] } }),
        pg('Kelas 4A 12 kg, 4B 9 kg, 4C 15 kg. Pernyataan yang benar adalah ....', ['4B paling banyak', '4C 3 kg lebih banyak dari 4A', '4A dan 4B sama'], 1, ['Periksa pernyataan satu per satu.', '15 − 12 = 3.', 'Jadi 4C 3 kg lebih banyak dari 4A.'], '4C (15) − 4A (12) = 3 kg.'),
      ],
    },
  ],
  bi: [
    {
      topik: 'bi4-kalimat-saran',
      sumber: 'K4-bi',
      penjelasan: [
        bagian('Kalimat saran memberi usul. Biasanya memakai kata sebaiknya atau lebih baik.'),
        bagian('Kalimat ajakan mengajak orang lain. Biasanya memakai kata ayo atau mari.'),
      ],
      contoh: [
        contoh('"Sebaiknya kamu tidur lebih awal." Kalimat apa ini?', ['Ada kata sebaiknya.'], 'kalimat saran'),
        contoh('"Mari kita bersihkan kelas!" Kalimat apa ini?', ['Ada kata mari.'], 'kalimat ajakan'),
      ],
      soal: [
        pg('"Ayo kita tanam pohon di halaman!" termasuk kalimat ....', ['saran', 'ajakan', 'berita'], 1, ['Ada kata ayo.', 'Ayo dipakai untuk mengajak.', 'Itu kalimat ajakan.'], 'Kata ayo menunjukkan kalimat ajakan.'),
        pg('"Sebaiknya kamu membawa payung." termasuk kalimat ....', ['saran', 'tanya', 'ajakan'], 0, ['Ada kata sebaiknya.', 'Sebaiknya memberi usul.', 'Itu kalimat saran.'], 'Kata sebaiknya menunjukkan kalimat saran.'),
        pg('Saran yang tepat untuk teman yang sering terlambat adalah ....', ['Kamu memang pemalas.', 'Sebaiknya kamu bangun lebih pagi.', 'Aku tidak peduli.'], 1, ['Saran harus sopan dan membantu.', 'Mengejek bukan saran.', 'Pilih yang memakai sebaiknya.'], '"Sebaiknya kamu bangun lebih pagi" sopan dan membantu.'),
        pg('Kalimat ajakan menjaga kebersihan sungai adalah ....', ['Sungai itu kotor.', 'Mari jaga sungai kita dari sampah!', 'Siapa yang membuang sampah?'], 1, ['Ajakan memakai mari atau ayo.', 'Kalimat pertama berita, ketiga pertanyaan.', 'Pilih yang memakai mari.'], '"Mari jaga sungai kita dari sampah!" adalah ajakan.'),
        pg('Poster hemat air yang paling tepat adalah ....', ['Air itu cair.', 'Ayo tutup keran setelah dipakai!', 'Keran rumahku warnanya perak.'], 1, ['Poster biasanya mengajak.', 'Pilih kalimat yang mengajak berhemat.', 'Ayo tutup keran.'], 'Poster hemat air mengajak menutup keran.'),
      ],
    },
    {
      topik: 'bi4-puisi',
      sumber: 'K4-bi',
      penjelasan: [
        bagian('Puisi disusun dalam larik dan bait. Larik adalah baris, bait adalah kumpulan larik.'),
        bagian('Pilihan kata dalam puisi menunjukkan perasaan penulis, misalnya senang, sedih, atau kagum.'),
      ],
      contoh: [
        contoh('Puisi dengan 3 kelompok baris punya berapa bait?', ['Satu kelompok baris adalah satu bait.'], '3 bait'),
        contoh('"Pelangi indah di langit biru, hatiku riang melihatmu." Perasaan penulis adalah ....', ['Ada kata riang.'], 'senang'),
      ],
      soal: [
        pg('Baris dalam puisi disebut ....', ['bait', 'larik', 'judul'], 1, ['Ada dua istilah: larik dan bait.', 'Bait adalah kumpulan baris.', 'Satu baris disebut larik.'], 'Satu baris dalam puisi disebut larik.'),
        pg('"Ibu, kasihmu sepanjang masa, tak pernah lelah menjaga kami." Perasaan penulis kepada ibu adalah ....', ['marah', 'sayang', 'takut'], 1, ['Perhatikan kata kasihmu dan menjaga.', 'Penulis berterima kasih kepada ibu.', 'Itu perasaan sayang.'], 'Kata kasih dan menjaga menunjukkan rasa sayang.', { bacaan: 'Ibu, kasihmu sepanjang masa,\ntak pernah lelah menjaga kami.' }),
        pg('"Daun gugur satu per satu, pohon sendiri tanpa teman." Suasana puisi ini adalah ....', ['gembira', 'sepi dan sedih', 'ramai'], 1, ['Perhatikan kata gugur dan sendiri.', 'Sendiri tanpa teman terasa sepi.', 'Suasananya sepi dan sedih.'], 'Kata sendiri tanpa teman menimbulkan suasana sepi.', { bacaan: 'Daun gugur satu per satu,\npohon sendiri tanpa teman.' }),
        pg('Puisi dengan 4 larik dalam setiap bait, dan ada 2 bait. Berapa larik semuanya?', ['4', '6', '8'], 2, ['Satu bait 4 larik.', 'Ada 2 bait.', '4 + 4 = 8.'], '2 bait × 4 larik = 8 larik.', '2 * 4'),
        pg('"Ombak berlari mengejar pantai." Kata berlari di sini artinya ....', ['ombak punya kaki', 'ombak bergerak cepat ke pantai', 'ombak berhenti'], 1, ['Ombak tidak punya kaki.', 'Penulis membandingkan ombak dengan orang berlari.', 'Artinya ombak bergerak cepat.'], 'Ombak "berlari" artinya bergerak cepat menuju pantai.'),
      ],
    },
  ],
};

export const T2_K5: { mat: KartuMentah[]; bi: KartuMentah[] } = {
  mat: [
    {
      topik: 'mat5-kali-pecahan',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Kalikan pecahan: pembilang kali pembilang, penyebut kali penyebut. 2/3 × 1/4 = 2/12 = 1/6.'),
        bagian('Bilangan bulat kali pecahan: kalikan dengan pembilangnya. 3 × 2/5 = 6/5.'),
      ],
      contoh: [
        contoh('1/2 × 3/5 = ?', ['Atas: 1 × 3 = 3.', 'Bawah: 2 × 5 = 10.'], '3/10'),
        contoh('1/4 dari 20 = ?', ['"Dari" artinya dikali.', '20 × 1/4 = 20 : 4 = 5.'], '5'),
      ],
      soal: [
        isian('Berapa hasil 1/3 × 2/5?', '2/15', ['Atas kali atas.', '1 × 2 = 2. Bawah: 3 × 5 = 15.', 'Hasilnya 2/15.'], '1/3 × 2/5 = 2/15.', '1/3 * 2/5'),
        isian('Berapa 1/2 dari 18?', '9', ['"Dari" artinya dikali.', '18 × 1/2.', '18 : 2 = 9.'], '1/2 dari 18 = 9.', '1/2 * 18'),
        isian('Berapa hasil 4 × 3/8? Tulis dalam bentuk paling sederhana.', '3/2', ['Kalikan 4 dengan pembilang.', '4 × 3 = 12, jadi 12/8.', 'Sederhanakan: bagi 4. Hasilnya 3/2.'], '4 × 3/8 = 12/8 = 3/2 (atau 1 1/2).', '4 * 3/8'),
        pg('3/4 dari 40 siswa suka menggambar. Berapa siswa yang suka menggambar?', ['10', '30', '43', '120'], 1, ['"Dari" artinya dikali.', '40 : 4 = 10, lalu × 3.', '10 × 3 = 30.'], '3/4 × 40 = 30 siswa.', '3/4 * 40'),
        isian('Ayah punya 2/3 kg daging. Setengahnya dimasak hari ini. Berapa kg daging yang dimasak?', '1/3', ['Setengah dari 2/3 artinya 1/2 × 2/3.', 'Atas: 1 × 2 = 2. Bawah: 2 × 3 = 6.', '2/6 disederhanakan menjadi 1/3.'], '1/2 × 2/3 = 2/6 = 1/3 kg.', '1/2 * 2/3'),
      ],
    },
    {
      topik: 'mat5-kecepatan',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Kecepatan menunjukkan jarak yang ditempuh setiap satu satuan waktu.'),
        bagian('Kecepatan = jarak : waktu. Jarak = kecepatan × waktu.'),
      ],
      contoh: [
        contoh('Sepeda menempuh 30 km dalam 2 jam. Berapa kecepatannya?', ['30 : 2 = 15.'], '15 km per jam'),
        contoh('Motor melaju 40 km per jam selama 3 jam. Berapa jaraknya?', ['40 × 3 = 120.'], '120 km'),
      ],
      soal: [
        isian('Bus menempuh 120 km dalam 3 jam. Berapa km per jam kecepatannya?', '40', ['Kecepatan = jarak : waktu.', '120 : 3.', '120 : 3 = 40.'], '120 : 3 = 40 km per jam.', '120 / 3'),
        isian('Mobil melaju 60 km per jam selama 2 jam. Berapa km jaraknya?', '120', ['Jarak = kecepatan × waktu.', '60 × 2.', '60 × 2 = 120.'], '60 × 2 = 120 km.', '60 * 2'),
        isian('Zaki bersepeda 10 km per jam. Jarak ke pasar 5 km. Berapa menit waktunya?', '30', ['Waktu = jarak : kecepatan.', '5 : 10 = 1/2 jam.', '1/2 jam = 30 menit.'], '5 : 10 = 1/2 jam = 30 menit.', '5 / 10 * 60'),
        pg('Kereta A 80 km per jam, kereta B 65 km per jam. Dalam 2 jam, selisih jarak keduanya adalah ....', ['15 km', '30 km', '145 km'], 1, ['Hitung jarak masing-masing dalam 2 jam.', 'A: 160 km. B: 130 km.', '160 − 130 = ?'], 'A 160 km, B 130 km. Selisihnya 30 km.', '(80 - 65) * 2'),
        isian('Perahu nelayan berangkat pukul 05.00 dan tiba pukul 07.30. Jaraknya 25 km. Berapa km per jam kecepatannya?', '10', ['Hitung lama perjalanan dulu.', '05.00 sampai 07.30 = 2,5 jam.', '25 : 2,5 = ?'], 'Waktu 2,5 jam. 25 : 2,5 = 10 km per jam.', '25 / 2.5'),
      ],
    },
    {
      topik: 'mat5-sudut-segitiga',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Jumlah ketiga sudut segitiga selalu 180 derajat.'),
        bagian('Kalau dua sudut diketahui, sudut ketiga = 180 − jumlah dua sudut itu.'),
      ],
      contoh: [
        contoh('Sudut segitiga 50° dan 60°. Berapa sudut ketiga?', ['50 + 60 = 110.', '180 − 110 = 70.'], '70°'),
        contoh('Segitiga siku-siku punya satu sudut ....', ['Siku-siku = 90 derajat.'], '90°'),
      ],
      soal: [
        isian('Sudut segitiga 40° dan 80°. Berapa derajat sudut ketiga?', '60', ['Jumlah sudut segitiga 180.', '40 + 80 = 120.', '180 − 120 = ?'], '180 − 120 = 60°.', '180 - (40 + 80)'),
        isian('Segitiga siku-siku punya sudut 35°. Berapa derajat sudut yang lain (selain 90°)?', '55', ['Satu sudut 90°.', '90 + 35 = 125.', '180 − 125 = ?'], '180 − 90 − 35 = 55°.', '180 - 90 - 35'),
        isian('Ketiga sudut segitiga sama besar. Berapa derajat setiap sudut?', '60', ['Jumlahnya 180.', 'Dibagi 3 sama besar.', '180 : 3 = ?'], '180 : 3 = 60°.', '180 / 3'),
        pg('Bisakah segitiga punya sudut 100° dan 90°?', ['Bisa', 'Tidak bisa'], 1, ['Jumlahkan dua sudut itu.', '100 + 90 = 190.', 'Lebih dari 180, jadi tidak mungkin.'], '100 + 90 = 190 > 180, jadi tidak bisa.'),
        isian('Sudut segitiga: sudut A dua kali sudut B, dan sudut C 30°. Berapa derajat sudut A?', '100', ['A + B = 180 − 30 = 150.', 'A dua kali B, jadi B + 2B = 150.', '3B = 150, B = 50, A = 100.'], 'A + B = 150. B = 50, A = 100°.', '(180 - 30) / 3 * 2'),
      ],
    },
    {
      topik: 'mat5-rata-rata',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Rata-rata = jumlah semua data dibagi banyak data.'),
        bagian('Rata-rata nilai 6, 8, dan 10 adalah (6 + 8 + 10) : 3 = 8.'),
      ],
      contoh: [
        contoh('Rata-rata dari 4, 6, 8 adalah ....', ['Jumlah: 18.', 'Banyak data: 3.', '18 : 3 = 6.'], '6'),
        contoh('Rata-rata dari 10, 20 adalah ....', ['Jumlah 30, banyak 2.', '30 : 2 = 15.'], '15'),
      ],
      soal: [
        isian('Berapa rata-rata dari 5, 7, dan 9?', '7', ['Jumlahkan dulu.', '5 + 7 + 9 = 21.', '21 : 3 = ?'], '21 : 3 = 7.', '(5 + 7 + 9) / 3'),
        isian('Nilai Mira: 80, 90, 70, 80. Berapa rata-ratanya?', '80', ['Jumlahkan keempat nilai.', '80 + 90 + 70 + 80 = 320.', '320 : 4 = ?'], '320 : 4 = 80.', '(80 + 90 + 70 + 80) / 4'),
        isian('Hasil panen cabai 5 hari: 12, 15, 10, 13, 15 kg. Berapa kg rata-ratanya?', '13', ['Jumlahkan semua.', '12 + 15 + 10 + 13 + 15 = 65.', '65 : 5 = ?'], '65 : 5 = 13 kg.', '(12 + 15 + 10 + 13 + 15) / 5'),
        pg('Rata-rata 3 anak membaca 6 buku. Berapa buku yang dibaca semuanya?', ['2', '9', '18'], 2, ['Jumlah = rata-rata × banyak data.', '6 × 3.', '6 × 3 = 18.'], 'Jumlah = 6 × 3 = 18 buku.', '6 * 3'),
        isian('Rata-rata nilai 4 ulangan Faris 75. Agar rata-rata 5 ulangan menjadi 78, berapa nilai ulangan kelima?', '90', ['Jumlah 4 ulangan = 75 × 4 = 300.', 'Jumlah 5 ulangan harus 78 × 5 = 390.', '390 − 300 = ?'], 'Perlu 390 − 300 = 90.', '78 * 5 - 75 * 4'),
      ],
    },
  ],
  bi: [
    {
      topik: 'bi5-kalimat-efektif',
      sumber: 'K5-bi',
      penjelasan: [
        bagian('Kalimat efektif jelas dan tidak memakai kata yang berlebihan.'),
        bagian('Kalimat "Para siswa-siswa berbaris" tidak efektif. Yang efektif: Para siswa berbaris.'),
      ],
      contoh: [
        contoh('Perbaiki: "Kami saling tolong-menolong."', ['Saling dan tolong-menolong artinya sama.', 'Pakai salah satu.'], 'Kami tolong-menolong.'),
        contoh('Perbaiki: "Banyak anak-anak bermain di lapangan."', ['Banyak sudah menunjukkan jumlah.', 'Tidak perlu diulang.'], 'Banyak anak bermain di lapangan.'),
      ],
      soal: [
        pg('Kalimat yang efektif adalah ....', ['Para guru-guru rapat di kantor.', 'Para guru rapat di kantor.', 'Para guru-guru sedang rapat-rapat.'], 1, ['Para sudah menunjukkan banyak.', 'Tidak perlu diulang menjadi guru-guru.', 'Pilih "Para guru".'], '"Para guru rapat di kantor." efektif.'),
        pg('Kalimat yang efektif adalah ....', ['Ia naik ke atas loteng.', 'Ia naik ke loteng.'], 1, ['Naik sudah berarti ke atas.', 'Kata "ke atas" berlebihan.', 'Pilih yang lebih singkat.'], '"Naik ke atas" berlebihan. Cukup "naik ke loteng".'),
        pg('Kalimat yang efektif adalah ....', ['Sejak dari pagi hujan turun.', 'Sejak pagi hujan turun.'], 1, ['Sejak dan dari artinya mirip.', 'Pakai salah satu.', 'Pilih "Sejak pagi".'], '"Sejak dari" berlebihan. Cukup "Sejak pagi".'),
        pg('Kata yang berlebihan dalam "Kami mundur ke belakang agar barisan rapi." adalah ....', ['Kami', 'ke belakang', 'barisan'], 1, ['Mundur sudah berarti ke belakang.', 'Kata yang mengulang arti harus dibuang.', 'Itu "ke belakang".'], 'Mundur sudah berarti ke belakang.'),
        pg('Kalimat yang paling jelas untuk pengumuman adalah ....', ['Besok semua siswa harap datang pukul 07.00 memakai seragam olahraga.', 'Besok itu semua siswa-siswa harap datang pagi-pagi sekali pukul 07.00 pagi.', 'Siswa besok seragam olahraga 07.00.'], 0, ['Pengumuman harus jelas dan lengkap.', 'Pilihan kedua berlebihan, ketiga tidak lengkap.', 'Pilih yang jelas tanpa kata berlebih.'], 'Pilihan pertama jelas dan tidak berlebihan.'),
      ],
    },
    {
      topik: 'bi5-iklan',
      sumber: 'K5-bi',
      penjelasan: [
        bagian('Iklan dan poster bertujuan mengajak atau memberi tahu. Kalimatnya singkat dan menarik.'),
        bagian('Saat membaca iklan, cari tujuannya dan siapa yang diajak.'),
      ],
      contoh: [
        contoh('Poster: "Ayo cuci tangan pakai sabun!" Tujuannya adalah ....', ['Ada kata ayo.', 'Mengajak hidup bersih.'], 'mengajak mencuci tangan'),
        contoh('Iklan: "Pameran buku murah, 10–12 Desember, di Balai Kota." Informasi tempatnya adalah ....', ['Cari kata di.'], 'Balai Kota'),
      ],
      soal: [
        pg('Poster: "Buanglah sampah pada tempatnya!" Tujuan poster ini adalah ....', ['menjual tempat sampah', 'mengajak menjaga kebersihan', 'memberi tahu harga sampah'], 1, ['Poster ini menyuruh membuang sampah dengan benar.', 'Tujuannya agar lingkungan bersih.', 'Itu ajakan menjaga kebersihan.'], 'Poster mengajak menjaga kebersihan.'),
        pg('Iklan: "Lomba mewarnai untuk anak SD, Minggu 7 Desember, di lapangan desa. Gratis!" Siapa yang diajak?', ['Orang dewasa', 'Anak SD', 'Pedagang'], 1, ['Cari kata yang menyebut peserta.', '"untuk anak SD".', 'Yang diajak anak SD.'], 'Lomba ditujukan untuk anak SD.', { bacaan: 'Lomba mewarnai untuk anak SD, Minggu 7 Desember, di lapangan desa. Gratis!' }),
        pg('Kapan lomba mewarnai diadakan?', ['Minggu 7 Desember', 'Di lapangan desa', 'Gratis'], 0, ['Kapan menanyakan waktu.', 'Cari nama hari dan tanggal.', 'Minggu 7 Desember.'], 'Waktunya Minggu 7 Desember.', { bacaan: 'Lomba mewarnai untuk anak SD, Minggu 7 Desember, di lapangan desa. Gratis!' }),
        pg('Kalimat poster hemat listrik yang paling menarik adalah ....', ['Listrik dipakai untuk lampu.', 'Matikan lampu jika tidak dipakai, yuk hemat listrik!', 'Lampu di rumah ada sepuluh.'], 1, ['Poster harus mengajak.', 'Pilihan lain hanya memberi kabar.', 'Pilih yang memakai ajakan yuk.'], 'Pilihan kedua mengajak dan singkat.'),
        pg('Iklan yang jujur adalah iklan yang ....', ['berjanji berlebihan agar orang membeli', 'memberi informasi yang benar', 'menjelekkan barang lain'], 1, ['Iklan yang baik tidak berbohong.', 'Janji berlebihan bisa menipu.', 'Pilih yang memberi informasi benar.'], 'Iklan yang jujur memberi informasi yang benar.'),
      ],
    },
  ],
};
