import { bagian, contoh, isian, pg } from './bantu';
import type { SumberKelas } from './peta';

/**
 * Gudang Ilmu kelas 5, tahap 1: 4 kartu Matematika dan 2 kartu Bahasa Indonesia.
 * Ditulis sendiri (belum diperiksa guru). Kunci Matematika dihitung ulang oleh uji.
 */
export const SUMBER_K5: SumberKelas = {
  kelas: 5,
  versi: '0.1.0',
  dibuat: '2026-10-31',
  petaMat: [
    { id: 'mat5-kpk-fpb', judul: 'KPK dan FPB', ringkas: 'Bertemu lagi pakai KPK, membagi rata pakai FPB.' },
    { id: 'mat5-tambah-kurang-pecahan', judul: 'Tambah dan kurang pecahan', ringkas: 'Samakan penyebut dulu.', prasyarat: ['mat5-kpk-fpb'] },
    { id: 'mat5-desimal-persen', judul: 'Desimal dan persen', ringkas: 'Persen artinya per seratus.', prasyarat: ['mat5-tambah-kurang-pecahan'] },
    { id: 'mat5-volume', judul: 'Volume kubus dan balok', ringkas: 'Panjang × lebar × tinggi.', bersamaOrtu: true },
    { id: 'mat5-kali-pecahan', judul: 'Perkalian pecahan', ringkas: 'Atas kali atas, bawah kali bawah.', prasyarat: ['mat5-tambah-kurang-pecahan'] },
    { id: 'mat5-kecepatan', judul: 'Kecepatan', ringkas: 'Jarak dibagi waktu.' },
    { id: 'mat5-sudut-segitiga', judul: 'Sudut segitiga', ringkas: 'Jumlah sudut segitiga 180°.' },
    { id: 'mat5-rata-rata', judul: 'Rata-rata data', ringkas: 'Jumlah data dibagi banyak data.' },
  ],
  petaBi: [
    { id: 'bi5-informasi-penting', judul: 'Informasi penting', ringkas: 'Siapa, apa, di mana, kapan, mengapa, bagaimana.' },
    { id: 'bi5-fakta-opini', judul: 'Fakta dan opini', ringkas: 'Bisa dibuktikan atau hanya pendapat?' },
    { id: 'bi5-kalimat-efektif', judul: 'Kalimat efektif', ringkas: 'Kalimat yang jelas dan tidak berlebihan.' },
    { id: 'bi5-iklan', judul: 'Iklan dan poster', ringkas: 'Ajakan, gambar, dan tujuan.', bersamaOrtu: true },
  ],
  kartuMat: [
    {
      topik: 'mat5-kpk-fpb',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('KPK adalah kelipatan persekutuan terkecil. Pakai KPK untuk soal "bertemu lagi" atau "bersama lagi".'),
        bagian('FPB adalah faktor persekutuan terbesar. Pakai FPB untuk soal "dibagi rata sebanyak-banyaknya".'),
      ],
      contoh: [
        contoh('KPK dari 4 dan 6 adalah ....', ['Kelipatan 4: 4, 8, 12, 16.', 'Kelipatan 6: 6, 12, 18.', 'Yang sama paling kecil: 12.'], '12'),
        contoh('FPB dari 12 dan 18 adalah ....', ['Faktor 12: 1, 2, 3, 4, 6, 12.', 'Faktor 18: 1, 2, 3, 6, 9, 18.', 'Yang sama paling besar: 6.'], '6'),
      ],
      soal: [
        isian('Berapa KPK dari 3 dan 5?', '15', ['Tulis kelipatan 3 dan kelipatan 5.', 'Kelipatan 3: 3, 6, 9, 12, 15. Kelipatan 5: 5, 10, 15.', 'Cari yang sama paling kecil.'], 'Kelipatan yang sama paling kecil adalah 15.', 'kpk(3, 5)'),
        isian('Berapa FPB dari 16 dan 24?', '8', ['Tulis faktor 16 dan faktor 24.', 'Faktor 16: 1, 2, 4, 8, 16. Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24.', 'Cari yang sama paling besar.'], 'Faktor yang sama paling besar adalah 8.', 'fpb(16, 24)'),
        pg('Andi berenang setiap 3 hari. Bima berenang setiap 4 hari. Hari ini mereka berenang bersama. Berapa hari lagi mereka berenang bersama lagi?', ['7 hari', '12 hari', '1 hari', '24 hari'], 1, ['"Bersama lagi" artinya pakai KPK.', 'Kelipatan 3: 3, 6, 9, 12. Kelipatan 4: 4, 8, 12.', 'KPK dari 3 dan 4.'], 'KPK dari 3 dan 4 adalah 12. Jadi 12 hari lagi.', 'kpk(3, 4)'),
        isian('Ada 20 jeruk dan 30 salak. Buah dibagi ke beberapa kantong. Isi tiap kantong harus sama. Paling banyak berapa kantong?', '10', ['"Paling banyak kantong dengan isi sama" artinya FPB.', 'Faktor 20: 1, 2, 4, 5, 10, 20. Faktor 30: 1, 2, 3, 5, 6, 10, 15, 30.', 'Cari faktor sama yang paling besar.'], 'FPB dari 20 dan 30 adalah 10. Jadi 10 kantong, tiap kantong 2 jeruk dan 3 salak.', 'fpb(20, 30)'),
        isian('Bus A berangkat setiap 15 menit. Bus B setiap 20 menit. Keduanya berangkat bersama pukul 07.00. Berapa menit kemudian keduanya berangkat bersama lagi?', '60', ['"Bersama lagi" artinya KPK.', 'Kelipatan 15: 15, 30, 45, 60. Kelipatan 20: 20, 40, 60.', 'KPK dari 15 dan 20.'], 'KPK dari 15 dan 20 adalah 60. Jadi 60 menit kemudian, pukul 08.00.', 'kpk(15, 20)'),
      ],
    },
    {
      topik: 'mat5-tambah-kurang-pecahan',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Pecahan berpenyebut sama: tambahkan atau kurangkan pembilangnya saja. 2/7 + 3/7 = 5/7.'),
        bagian('Penyebut berbeda: samakan dulu dengan KPK penyebut. Lalu hitung pembilangnya.'),
      ],
      contoh: [
        contoh('1/2 + 1/3 = ?', ['KPK dari 2 dan 3 adalah 6.', '1/2 = 3/6 dan 1/3 = 2/6.', '3/6 + 2/6 = 5/6.'], '5/6'),
        contoh('3/4 − 1/2 = ?', ['KPK dari 4 dan 2 adalah 4.', '1/2 = 2/4.', '3/4 − 2/4 = 1/4.'], '1/4'),
      ],
      soal: [
        isian('Berapa hasil 2/9 + 5/9?', '7/9', ['Penyebutnya sudah sama.', 'Tambahkan pembilangnya saja.', '2 + 5 = 7.'], '2/9 + 5/9 = 7/9.', '2/9 + 5/9'),
        isian('Berapa hasil 5/6 − 1/6? Tulis dalam bentuk paling sederhana.', '2/3', ['Penyebut sama. Kurangkan pembilangnya.', '5 − 1 = 4, jadi 4/6.', 'Sederhanakan 4/6: bagi atas dan bawah dengan 2.'], '5/6 − 1/6 = 4/6 = 2/3.', '5/6 - 1/6'),
        isian('Berapa hasil 1/4 + 2/3?', '11/12', ['Samakan penyebut. KPK dari 4 dan 3?', 'KPK = 12. 1/4 = 3/12, 2/3 = 8/12.', '3/12 + 8/12 = ?'], '1/4 + 2/3 = 3/12 + 8/12 = 11/12.', '1/4 + 2/3'),
        pg('Ibu punya 3/4 kg gula. Ibu memakai 1/3 kg untuk membuat kue. Berapa kg sisa gula?', ['2/1 kg', '5/12 kg', '2/7 kg', '1/2 kg'], 1, ['Sisa artinya dikurangi: 3/4 − 1/3.', 'KPK 4 dan 3 = 12. 3/4 = 9/12, 1/3 = 4/12.', '9/12 − 4/12 = ?'], '3/4 − 1/3 = 9/12 − 4/12 = 5/12 kg. Jawaban 2/1 muncul kalau atas dikurangi atas dan bawah dikurangi bawah.', '3/4 - 1/3'),
        isian('Laila membaca 1/3 buku pada hari Senin dan 1/4 buku pada hari Selasa. Berapa bagian buku yang belum dibaca?', '5/12', ['Hitung dulu yang sudah dibaca: 1/3 + 1/4.', '1/3 + 1/4 = 4/12 + 3/12 = 7/12.', 'Satu buku utuh = 12/12. 12/12 − 7/12 = ?'], 'Sudah dibaca 7/12. Belum dibaca 1 − 7/12 = 5/12.', '1 - (1/3 + 1/4)'),
      ],
    },
    {
      topik: 'mat5-desimal-persen',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Desimal satu angka di belakang koma artinya per sepuluh. 0,3 = 3/10.'),
        bagian('Persen artinya per seratus. 25% = 25/100 = 1/4.', { jenis: 'petak', baris: 10, kolom: 10, terisi: 25 }),
      ],
      contoh: [
        contoh('Ubah 3/5 menjadi persen.', ['Ubah penyebut menjadi 100: 5 × 20 = 100.', 'Pembilang: 3 × 20 = 60.', '60/100 = 60%.'], '60%'),
        contoh('Berapa 50% dari 40?', ['50% = 1/2.', 'Setengah dari 40 adalah 20.'], '20'),
      ],
      soal: [
        isian('Tulis 7/10 dalam bentuk desimal.', '0,7', ['Per sepuluh: satu angka di belakang koma.', '7 per sepuluh.', 'Tulis 0 koma 7.'], '7/10 = 0,7.', '7/10'),
        isian('Tulis 1/4 dalam bentuk persen. (tulis angkanya saja)', '25', ['Ubah penyebut menjadi 100.', '4 × 25 = 100, jadi pembilang 1 × 25.', '25/100 = 25%.'], '1/4 = 25/100 = 25%.', '1/4 * 100'),
        isian('Berapa 10% dari 80?', '8', ['10% = 1/10.', '80 dibagi 10.', '80 : 10 = ?'], '10% dari 80 = 80 : 10 = 8.', '10/100 * 80'),
        pg('Mana yang paling besar?', ['0,5', '40%', '3/10'], 0, ['Ubah semua ke bentuk yang sama, misalnya persen.', '0,5 = 50%, 3/10 = 30%.', 'Bandingkan 50%, 40%, dan 30%.'], '0,5 = 50%, lebih besar dari 40% dan 30%.'),
        isian('Harga tas Rp80.000. Toko memberi potongan 25%. Berapa rupiah harga tas setelah dipotong? (tulis angkanya saja)', '60.000', ['Hitung potongannya dulu: 25% dari 80.000.', '25% = 1/4. 80.000 : 4 = 20.000.', '80.000 − 20.000 = ?'], 'Potongan 25% × 80.000 = 20.000. Harga baru 80.000 − 20.000 = 60.000.', '80000 - 25/100 * 80000'),
      ],
    },
    {
      topik: 'mat5-volume',
      sumber: 'K5-mat',
      penjelasan: [
        bagian('Volume adalah banyak kubus satuan yang mengisi bangun.'),
        bagian('Volume balok = panjang × lebar × tinggi. Volume kubus = sisi × sisi × sisi.'),
      ],
      contoh: [
        contoh('Balok 5 cm × 3 cm × 2 cm. Berapa volumenya?', ['5 × 3 = 15.', '15 × 2 = 30.'], '30 cm³'),
        contoh('Kubus sisinya 4 cm. Berapa volumenya?', ['4 × 4 = 16.', '16 × 4 = 64.'], '64 cm³'),
      ],
      soal: [
        isian('Kubus sisinya 3 cm. Berapa cm³ volumenya?', '27', ['Volume kubus = sisi × sisi × sisi.', '3 × 3 = 9.', '9 × 3 = ?'], '3 × 3 × 3 = 27 cm³.', '3 * 3 * 3'),
        isian('Balok panjang 6 cm, lebar 4 cm, tinggi 5 cm. Berapa cm³ volumenya?', '120', ['Volume balok = p × l × t.', '6 × 4 = 24.', '24 × 5 = ?'], '6 × 4 × 5 = 120 cm³.', '6 * 4 * 5'),
        isian('Sebuah kotak diisi kubus kecil. Panjangnya 5 kubus, lebarnya 2 kubus, tingginya 3 kubus. Berapa kubus kecil semuanya?', '30', ['Satu lapis: 5 × 2 kubus.', 'Satu lapis 10 kubus. Ada 3 lapis.', '10 × 3 = ?'], '5 × 2 = 10 kubus per lapis. 3 lapis: 10 × 3 = 30 kubus.', '5 * 2 * 3'),
        pg('Kubus A sisinya 2 cm. Kubus B sisinya 4 cm. Volume B berapa kali volume A?', ['2 kali', '4 kali', '8 kali', '16 kali'], 2, ['Hitung volume masing-masing.', 'A: 2 × 2 × 2 = 8. B: 4 × 4 × 4 = 64.', '64 : 8 = ?'], 'Volume A = 8 cm³, volume B = 64 cm³. 64 : 8 = 8 kali.', '(4 * 4 * 4) / (2 * 2 * 2)'),
        isian('Akuarium berbentuk balok 50 cm × 30 cm × 40 cm. Akuarium diisi air sampai penuh. Berapa liter air di dalamnya? (1 liter = 1.000 cm³)', '60', ['Hitung volume dalam cm³ dulu.', '50 × 30 × 40 = 60.000 cm³.', '60.000 : 1.000 = ?'], 'Volume = 50 × 30 × 40 = 60.000 cm³ = 60 liter.', '50 * 30 * 40 / 1000'),
      ],
    },
  ],
  kartuBi: [
    {
      topik: 'bi5-informasi-penting',
      sumber: 'K5-bi',
      penjelasan: [
        bagian('Informasi penting menjawab pertanyaan siapa, apa, di mana, kapan, mengapa, dan bagaimana.'),
        bagian('Baca pertanyaan dulu. Lalu cari kalimat di teks yang memuat jawabannya.'),
      ],
      contoh: [
        contoh('"Pada hari Sabtu, siswa kelas 5 menanam bakau di pantai Ulee Lheue." Di mana siswa menanam bakau?', ['Kata "di" menunjukkan tempat.', 'Tempatnya pantai Ulee Lheue.'], 'Di pantai Ulee Lheue'),
        contoh('"Mereka menanam bakau agar pantai tidak terkikis ombak." Mengapa mereka menanam bakau?', ['Kata "agar" menunjukkan alasan.', 'Alasannya supaya pantai tidak terkikis.'], 'Agar pantai tidak terkikis ombak'),
      ],
      soal: [
        pg('Kapan lomba layang-layang diadakan?', ['Hari Minggu pagi', 'Di lapangan desa', 'Anak-anak desa', 'Karena angin kencang'], 0, ['Kapan menanyakan waktu.', 'Cari keterangan waktu di bacaan.', 'Hari Minggu pagi adalah waktu.'], 'Kapan menanyakan waktu. Jawabannya hari Minggu pagi.', { bacaan: 'Hari Minggu pagi, lomba layang-layang diadakan di lapangan desa. Anak-anak desa ikut bersama. Mereka senang karena angin bertiup kencang.' }),
        pg('Di mana lomba diadakan?', ['Hari Minggu pagi', 'Di lapangan desa', 'Anak-anak desa'], 1, ['Di mana menanyakan tempat.', 'Cari kata "di" yang diikuti tempat.', 'Lapangan desa adalah tempat.'], 'Di mana menanyakan tempat: lapangan desa.', { bacaan: 'Hari Minggu pagi, lomba layang-layang diadakan di lapangan desa. Anak-anak desa ikut bersama. Mereka senang karena angin bertiup kencang.' }),
        pg('Mengapa anak-anak senang?', ['Karena hari Minggu', 'Karena angin bertiup kencang', 'Karena di lapangan'], 1, ['Mengapa menanyakan alasan.', 'Cari kata "karena".', 'Lihat kalimat terakhir.'], 'Kalimat terakhir: mereka senang karena angin bertiup kencang.', { bacaan: 'Hari Minggu pagi, lomba layang-layang diadakan di lapangan desa. Anak-anak desa ikut bersama. Mereka senang karena angin bertiup kencang.' }),
        pg('Bagaimana cara membuat sirup jeruk menurut bacaan?', ['Membeli di toko', 'Memeras jeruk, lalu dicampur air dan gula', 'Menanam pohon jeruk'], 1, ['Bagaimana menanyakan cara.', 'Cari langkah-langkah di bacaan.', 'Langkahnya: peras, campur air, tambah gula.'], 'Bacaan menyebut langkah: peras jeruk, campur air, tambahkan gula.', { bacaan: 'Kak Dara membuat sirup jeruk. Mula-mula ia memeras lima buah jeruk. Lalu air jeruk dicampur dengan dua gelas air. Terakhir ia menambahkan dua sendok gula.' }),
        pg('Informasi mana yang TIDAK ada dalam bacaan?', ['Kak Dara membuat sirup', 'Ada lima buah jeruk', 'Harga jeruk di pasar', 'Ditambah dua sendok gula'], 2, ['Periksa pilihan satu per satu dengan bacaan.', 'Sirup, lima jeruk, dan gula disebut.', 'Harga jeruk tidak disebut sama sekali.'], 'Bacaan tidak menyebut harga jeruk.', { bacaan: 'Kak Dara membuat sirup jeruk. Mula-mula ia memeras lima buah jeruk. Lalu air jeruk dicampur dengan dua gelas air. Terakhir ia menambahkan dua sendok gula.' }),
      ],
    },
    {
      topik: 'bi5-fakta-opini',
      sumber: 'K5-bi',
      penjelasan: [
        bagian('Fakta adalah hal yang benar-benar terjadi dan bisa dibuktikan.'),
        bagian('Opini adalah pendapat seseorang. Opini sering memakai kata menurut saya, paling, indah, atau enak.'),
      ],
      contoh: [
        contoh('"Banda Aceh adalah ibu kota Provinsi Aceh." Fakta atau opini?', ['Bisa dibuktikan dari peta dan buku.'], 'Fakta'),
        contoh('"Mi Aceh adalah makanan paling enak." Fakta atau opini?', ['Enak menurut setiap orang bisa berbeda.'], 'Opini'),
      ],
      soal: [
        pg('"Satu minggu ada tujuh hari." Kalimat ini adalah ....', ['fakta', 'opini'], 0, ['Apakah bisa dibuktikan?', 'Lihat kalender.', 'Semua orang setuju ada tujuh hari.'], 'Bisa dibuktikan dengan kalender, jadi fakta.'),
        pg('"Menurut saya, pelajaran menggambar paling seru." Kalimat ini adalah ....', ['fakta', 'opini'], 1, ['Ada kata "menurut saya".', 'Itu pendapat satu orang.', 'Orang lain bisa berbeda pendapat.'], 'Kata "menurut saya" dan "paling seru" menunjukkan pendapat, jadi opini.'),
        pg('Kalimat yang merupakan fakta adalah ....', ['Pantai itu sangat indah.', 'Gajah adalah hewan yang menyusui.', 'Kue ini enak sekali.'], 1, ['Fakta bisa dibuktikan.', 'Indah dan enak tergantung pendapat orang.', 'Gajah menyusui anaknya, bisa dibuktikan.'], 'Gajah hewan menyusui bisa dibuktikan, jadi fakta.'),
        pg('Kalimat yang merupakan opini adalah ....', ['Air mendidih pada suhu 100 derajat.', 'Sekolah kami punya 12 kelas.', 'Seragam baru itu terlihat bagus.'], 2, ['Cari kalimat yang berisi pendapat.', 'Suhu dan jumlah kelas bisa diukur.', 'Bagus tergantung selera.'], '"Terlihat bagus" adalah pendapat, jadi opini.'),
        pg('"(1) Pasar ikan Lampulo buka sejak pukul lima pagi. (2) Ikan di sana paling segar. (3) Nelayan membawa ikan dari laut." Kalimat opini ada di nomor ....', ['1', '2', '3'], 1, ['Periksa kalimat satu per satu.', 'Kalimat 1 dan 3 bisa dibuktikan dengan melihat langsung.', 'Kata "paling segar" adalah pendapat.'], 'Kalimat 2 memakai "paling segar", itu pendapat. Jadi opini.'),
      ],
    },
  ],
};
