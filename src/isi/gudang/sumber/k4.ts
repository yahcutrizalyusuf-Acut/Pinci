import { bagian, contoh, isian, pg } from './bantu';
import type { SumberKelas } from './peta';

/**
 * Gudang Ilmu kelas 4, tahap 1: 4 kartu Matematika dan 2 kartu Bahasa Indonesia.
 * Ditulis sendiri (belum diperiksa guru). Kunci Matematika dihitung ulang oleh uji.
 */
export const SUMBER_K4: SumberKelas = {
  kelas: 4,
  versi: '0.1.0',
  dibuat: '2026-10-31',
  petaMat: [
    { id: 'mat4-faktor-kelipatan', judul: 'Faktor dan kelipatan', ringkas: 'Pembagi habis dan loncat hitung.' },
    { id: 'mat4-pecahan-senilai', judul: 'Pecahan senilai', ringkas: '1/2 = 2/4 = 3/6.', prasyarat: ['mat4-faktor-kelipatan'] },
    { id: 'mat4-keliling-luas', judul: 'Keliling dan luas persegi panjang', ringkas: 'Keliling untuk pagar, luas untuk ubin.', bersamaOrtu: true },
    { id: 'mat4-pembulatan', judul: 'Pembulatan', ringkas: 'Bulatkan ke puluhan dan ratusan terdekat.' },
    { id: 'mat4-bilangan-besar', judul: 'Bilangan sampai 10.000', ringkas: 'Ribuan, ratusan, puluhan, satuan.' },
    { id: 'mat4-desimal', judul: 'Pecahan desimal', ringkas: 'Per sepuluh dan per seratus.', prasyarat: ['mat4-pecahan-senilai'] },
    { id: 'mat4-sudut', judul: 'Sudut', ringkas: 'Siku-siku, lancip, dan tumpul.' },
    { id: 'mat4-diagram-batang', judul: 'Diagram batang', ringkas: 'Membaca tinggi batang.' },
  ],
  petaBi: [
    { id: 'bi4-gagasan-utama', judul: 'Gagasan utama dan pendukung', ringkas: 'Kalimat utama dan kalimat penjelas.' },
    { id: 'bi4-kata-baku', judul: 'Kata baku', ringkas: 'Memilih kata yang sesuai kaidah.' },
    { id: 'bi4-kalimat-saran', judul: 'Kalimat saran dan ajakan', ringkas: 'Sebaiknya, ayo, mari.' },
    { id: 'bi4-puisi', judul: 'Puisi anak', ringkas: 'Larik, bait, dan perasaan.', bersamaOrtu: true },
  ],
  kartuMat: [
    {
      topik: 'mat4-faktor-kelipatan',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Faktor adalah bilangan yang membagi habis. Faktor 8 adalah 1, 2, 4, dan 8.'),
        bagian('Kelipatan adalah hasil loncat hitung. Kelipatan 3 adalah 3, 6, 9, 12, dan seterusnya.'),
      ],
      contoh: [
        contoh('Sebutkan faktor 10.', ['Cari pasangan yang dikali hasilnya 10.', '1 × 10 dan 2 × 5.'], '1, 2, 5, 10'),
        contoh('Kelipatan 4 yang ketiga adalah ....', ['Loncat empat: 4, 8, 12.', 'Yang ketiga adalah 12.'], '12'),
      ],
      soal: [
        pg('Mana yang merupakan faktor 12?', ['5', '6', '8', '24'], 1, ['Faktor membagi habis.', 'Coba 12 : 6.', '12 : 6 = 2, habis.'], '12 : 6 = 2 tanpa sisa, jadi 6 faktor 12. 24 adalah kelipatan 12.'),
        isian('Kelipatan 5 yang keempat adalah ...', '20', ['Loncat lima mulai dari 5.', '5, 10, 15, ...', 'Yang keempat sama dengan 4 × 5.'], '5, 10, 15, 20. Yang keempat adalah 20.', '4 * 5'),
        isian('Berapa banyak faktor dari 18?', '6', ['Cari semua pasangan yang dikali hasilnya 18.', '1 × 18, 2 × 9, 3 × 6.', 'Hitung semua angka di pasangan itu.'], 'Faktor 18: 1, 2, 3, 6, 9, 18. Ada 6 faktor.', 'banyakfaktor(18)'),
        pg('Bilangan mana yang kelipatan 3 dan juga kelipatan 4?', ['8', '9', '12', '16'], 2, ['Kelipatan 3: 3, 6, 9, 12, ...', 'Kelipatan 4: 4, 8, 12, ...', 'Cari bilangan yang ada di keduanya.'], '12 adalah kelipatan 3 (3 × 4) dan kelipatan 4 (4 × 3).', 'kpk(3, 4)'),
        isian('Lampu merah menyala setiap 6 detik. Lampu biru setiap 9 detik. Keduanya menyala bersama sekarang. Berapa detik lagi keduanya menyala bersama lagi?', '18', ['Cari kelipatan 6 dan kelipatan 9.', 'Kelipatan 6: 6, 12, 18. Kelipatan 9: 9, 18.', 'Bilangan pertama yang sama adalah ...'], 'Kelipatan sekutu terkecil dari 6 dan 9 adalah 18. Jadi 18 detik lagi.', 'kpk(6, 9)'),
      ],
    },
    {
      topik: 'mat4-pecahan-senilai',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Pecahan senilai punya angka berbeda tetapi besarnya sama.', { jenis: 'pecahan', a: 2, b: 4 }),
        bagian('Kalikan atau bagi atas dan bawah dengan bilangan yang sama. 1/2 = 2/4 = 3/6.'),
      ],
      contoh: [
        contoh('1/3 = .../6', ['Bawah: 3 dikali 2 menjadi 6.', 'Atas juga dikali 2: 1 × 2 = 2.'], '2/6'),
        contoh('Sederhanakan 4/8.', ['Atas dan bawah sama-sama dibagi 4.', '4 : 4 = 1 dan 8 : 4 = 2.'], '1/2'),
      ],
      soal: [
        isian('1/2 = .../8 (tulis pecahannya)', '4/8', ['Bawah: 2 dikali berapa menjadi 8?', '2 × 4 = 8.', 'Atas juga dikali 4: 1 × 4.'], '2 × 4 = 8, jadi atas 1 × 4 = 4. Pecahannya 4/8.', '1/2'),
        pg('Pecahan yang senilai dengan 2/3 adalah ....', ['4/6', '3/4', '2/6', '4/5'], 0, ['Kalikan atas dan bawah dengan bilangan yang sama.', '2 × 2 = 4 dan 3 × 2 = 6.', 'Hasilnya 4/6.'], '2/3 = (2 × 2)/(3 × 2) = 4/6.', '2/3'),
        isian('Sederhanakan 6/9.', '2/3', ['Cari bilangan yang membagi 6 dan 9.', '6 dan 9 sama-sama habis dibagi 3.', '6 : 3 = 2 dan 9 : 3 = 3.'], '6/9 = (6 : 3)/(9 : 3) = 2/3.', '6/9'),
        pg('Pecahan mana yang senilai dengan 3/4? Lihat gambar.', ['6/8', '3/8', '4/6'], 0, ['Kalikan atas dan bawah 3/4 dengan 2.', '3 × 2 = 6 dan 4 × 2 = 8.', 'Hasilnya 6/8.'], '3/4 = 6/8. Gambar: 6 dari 8 bagian.', { hitung: '3/4', gambar: { jenis: 'pecahan', a: 6, b: 8 } }),
        isian('Dara makan 2/8 kue bolu. Adik makan 1/4 kue yang sama. Kalau bagian Adik ditulis per delapan, berapa angka atasnya?', '2', ['Ubah 1/4 menjadi per delapan.', 'Bawah: 4 × 2 = 8. Atas juga dikali 2.', '1 × 2 = 2, jadi 1/4 = 2/8.'], '1/4 = 2/8. Jadi Dara dan Adik makan sama banyak.', '1/4 * 8'),
      ],
    },
    {
      topik: 'mat4-keliling-luas',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Keliling adalah jumlah panjang semua sisi. Keliling persegi panjang = 2 × (panjang + lebar).'),
        bagian('Luas adalah banyak petak di dalam bangun. Luas persegi panjang = panjang × lebar.', { jenis: 'petak', baris: 3, kolom: 5, terisi: 15 }),
      ],
      contoh: [
        contoh('Persegi panjang 5 cm × 3 cm. Berapa kelilingnya?', ['Panjang + lebar = 5 + 3 = 8.', '2 × 8 = 16.'], '16 cm'),
        contoh('Persegi panjang 5 cm × 3 cm. Berapa luasnya?', ['Luas = panjang × lebar.', '5 × 3 = 15.'], '15 cm²'),
      ],
      soal: [
        isian('Persegi panjang panjangnya 6 cm dan lebarnya 4 cm. Berapa cm² luasnya?', '24', ['Luas = panjang × lebar.', '6 × 4.', '6 × 4 = 24.'], 'Luas = 6 × 4 = 24 cm².', '6 * 4'),
        isian('Persegi panjang panjangnya 6 cm dan lebarnya 4 cm. Berapa cm kelilingnya?', '20', ['Keliling = 2 × (panjang + lebar).', '6 + 4 = 10.', '2 × 10 = ?'], '2 × (6 + 4) = 2 × 10 = 20 cm.', '2 * (6 + 4)'),
        isian('Persegi sisinya 7 cm. Berapa cm kelilingnya?', '28', ['Persegi punya 4 sisi sama panjang.', 'Keliling = 4 × sisi.', '4 × 7 = ?'], 'Keliling persegi = 4 × 7 = 28 cm.', '4 * 7'),
        pg('Ayah ingin memasang pagar di sekeliling kebun. Yang harus dihitung adalah ....', ['luas kebun', 'keliling kebun', 'berat kebun'], 1, ['Pagar dipasang di pinggir kebun.', 'Pinggir kebun dihitung dengan keliling.', 'Luas untuk menutup seluruh permukaan.'], 'Pagar mengelilingi kebun, jadi yang dihitung adalah keliling.'),
        isian('Lantai kamar berukuran 4 m × 3 m. Satu ubin luasnya 1 m². Ubin dijual per kotak isi 5. Berapa kotak ubin yang dibeli agar cukup?', '3', ['Hitung luas lantai: 4 × 3.', 'Luas 12 m², jadi butuh 12 ubin.', '2 kotak = 10 ubin, belum cukup. Perlu satu kotak lagi.'], 'Luas 4 × 3 = 12 m², perlu 12 ubin. 2 kotak berisi 10 ubin, kurang. Jadi beli 3 kotak.', 'bulat(12 / 5 + 1/2, 1)'),
      ],
    },
    {
      topik: 'mat4-pembulatan',
      sumber: 'K4-mat',
      penjelasan: [
        bagian('Membulatkan ke puluhan terdekat: lihat angka satuan.'),
        bagian('Satuan 5 atau lebih dibulatkan ke atas. Satuan kurang dari 5 dibulatkan ke bawah.'),
      ],
      contoh: [
        contoh('Bulatkan 47 ke puluhan terdekat.', ['Satuannya 7, lebih dari 5.', 'Bulatkan ke atas menjadi 50.'], '50'),
        contoh('Bulatkan 632 ke ratusan terdekat.', ['Lihat angka puluhan: 3.', '3 kurang dari 5, bulatkan ke bawah menjadi 600.'], '600'),
      ],
      soal: [
        isian('Bulatkan 34 ke puluhan terdekat.', '30', ['Lihat angka satuan.', 'Satuannya 4, kurang dari 5.', 'Bulatkan ke bawah.'], 'Satuan 4 < 5, jadi 34 dibulatkan menjadi 30.', 'bulat(34, 10)'),
        isian('Bulatkan 85 ke puluhan terdekat.', '90', ['Lihat angka satuan.', 'Satuannya 5.', '5 dibulatkan ke atas.'], 'Satuan 5 dibulatkan ke atas, jadi 85 menjadi 90.', 'bulat(85, 10)'),
        isian('Bulatkan 451 ke ratusan terdekat.', '500', ['Ke ratusan: lihat angka puluhan.', 'Angka puluhan 451 adalah 5.', '5 dibulatkan ke atas.'], 'Puluhan 5, dibulatkan ke atas menjadi 500.', 'bulat(451, 100)'),
        pg('Taksiran terbaik untuk 29 + 42 adalah ....', ['60', '70', '80'], 1, ['Bulatkan masing-masing ke puluhan.', '29 menjadi 30, 42 menjadi 40.', '30 + 40 = ?'], '29 ≈ 30 dan 42 ≈ 40. 30 + 40 = 70.', 'bulat(29, 10) + bulat(42, 10)'),
        isian('Sekolah punya 238 siswa kelas bawah dan 361 siswa kelas atas. Bulatkan masing-masing ke ratusan, lalu jumlahkan. Berapa taksirannya?', '600', ['238 ke ratusan terdekat menjadi berapa?', '238 ≈ 200, 361 ≈ 400.', '200 + 400 = ?'], '238 ≈ 200 dan 361 ≈ 400. Taksirannya 200 + 400 = 600 siswa.', 'bulat(238, 100) + bulat(361, 100)'),
      ],
    },
  ],
  kartuBi: [
    {
      topik: 'bi4-gagasan-utama',
      sumber: 'K4-bi',
      penjelasan: [
        bagian('Kalimat utama berisi gagasan utama paragraf. Letaknya sering di awal, kadang di akhir.'),
        bagian('Kalimat penjelas memberi keterangan tentang gagasan utama.'),
      ],
      contoh: [
        contoh(
          '"Kopi Gayo terkenal sampai ke luar negeri. Rasanya harum. Petani menanamnya di dataran tinggi. Banyak orang asing membelinya." Gagasan utamanya adalah ....',
          ['Kalimat pertama paling umum.', 'Kalimat lain menjelaskan kopi Gayo.'],
          'Kopi Gayo terkenal sampai ke luar negeri',
        ),
        contoh(
          '"Sampah plastik menyumbat selokan. Air hujan tidak bisa mengalir. Jalan menjadi tergenang. Jadi, sampah plastik bisa menyebabkan banjir." Kalimat utamanya di ....',
          ['Kalimat terakhir menyimpulkan semua kalimat.', 'Kalimat utama di akhir paragraf.'],
          'kalimat terakhir',
        ),
      ],
      soal: [
        pg('"Gajah Sumatra hidup berkelompok. Mereka mencari makan bersama. Induk gajah menjaga anaknya. Kelompok gajah dipimpin gajah betina tertua." Gagasan utamanya adalah ....', ['gajah mencari makan', 'gajah Sumatra hidup berkelompok', 'induk gajah menjaga anak', 'gajah betina tertua'], 1, ['Cari kalimat yang dijelaskan kalimat lain.', 'Mencari makan bersama dan dipimpin betina adalah ciri hidup berkelompok.', 'Kalimat pertama paling umum.'], 'Kalimat lain menjelaskan cara gajah hidup berkelompok.'),
        pg('Kalimat mana yang BUKAN kalimat penjelas untuk gagasan "Pantai Lampuuk indah."?', ['Pasirnya putih.', 'Airnya jernih.', 'Pak Rizki berjualan sepatu di kota.', 'Ombaknya tenang.'], 2, ['Kalimat penjelas harus membicarakan pantai.', 'Pasir, air, dan ombak adalah bagian pantai.', 'Berjualan sepatu di kota tidak membicarakan pantai.'], 'Kalimat tentang berjualan sepatu tidak menjelaskan keindahan pantai.'),
        pg('"Pagi ini Ikram bangun cepat. Ia membereskan tempat tidur. Ia membantu Ibu menyapu halaman. Ikram memang anak yang rajin." Kalimat utamanya ada di ....', ['awal paragraf', 'tengah paragraf', 'akhir paragraf'], 2, ['Cari kalimat yang menyimpulkan.', 'Bangun cepat, membereskan, dan menyapu adalah contoh.', 'Kalimat terakhir menyimpulkan: Ikram rajin.'], 'Kalimat terakhir merangkum semua contoh, jadi kalimat utama di akhir.'),
        pg('Gagasan utama "Menanam pohon banyak manfaatnya." Kalimat penjelas yang cocok adalah ....', ['Pohon membuat udara sejuk.', 'Saya suka bermain bola.', 'Harga sepatu naik.'], 0, ['Kalimat penjelas harus membahas manfaat pohon.', 'Bermain bola dan sepatu tidak berhubungan.', 'Udara sejuk adalah manfaat pohon.'], '"Pohon membuat udara sejuk" menjelaskan manfaat menanam pohon.'),
        pg('"Penyu bertelur di pantai pada malam hari. Telurnya ditimbun pasir. Setelah sekitar dua bulan, tukik keluar dari pasir. Tukik langsung berjalan ke laut." Judul yang paling cocok adalah ....', ['Malam di Pantai', 'Perjalanan Telur Penyu', 'Pasir yang Hangat', 'Laut yang Biru'], 1, ['Judul memuat gagasan utama seluruh paragraf.', 'Paragraf menceritakan telur sampai tukik ke laut.', 'Pilih judul yang mencakup semuanya.'], 'Paragraf menceritakan telur penyu sampai menjadi tukik, jadi judulnya "Perjalanan Telur Penyu".'),
      ],
    },
    {
      topik: 'bi4-kata-baku',
      sumber: 'K4-bi',
      penjelasan: [
        bagian('Kata baku adalah kata yang ditulis sesuai kaidah bahasa Indonesia.'),
        bagian('Contoh: nasihat (baku), nasehat (tidak baku). Kata baku dipakai dalam tulisan resmi.'),
      ],
      contoh: [
        contoh('Mana yang baku: apotek atau apotik?', ['Bentuk yang sesuai kamus adalah apotek.'], 'apotek'),
        contoh('Mana yang baku: telur atau telor?', ['Bentuk yang sesuai kamus adalah telur.'], 'telur'),
      ],
      soal: [
        pg('Kata baku yang benar adalah ....', ['sabtu', 'Sabtu', 'saptu'], 1, ['Ini nama hari.', 'Nama hari diawali huruf kapital.', 'Penulisan yang benar memakai huruf b.'], 'Nama hari ditulis Sabtu.'),
        pg('Kata baku yang benar adalah ....', ['karir', 'karier'], 1, ['Salah satu bentuk memakai huruf e.', 'Bentuk baku: karier.', 'Karir adalah bentuk tidak baku.'], 'Bentuk baku adalah karier.'),
        pg('Kata baku yang benar adalah ....', ['resiko', 'risiko', 'rasiko'], 1, ['Bentuk baku memakai huruf i dua kali.', 'r-i-s-i-k-o.', 'Resiko tidak baku.'], 'Bentuk baku adalah risiko.'),
        pg('Kalimat yang memakai kata baku adalah ....', ['Kakak pergi ke apotik.', 'Kakak pergi ke apotek.', 'Kakak pigi ke apotek.'], 1, ['Periksa setiap kata.', 'Apotik tidak baku. Pigi tidak baku.', 'Pilih kalimat dengan apotek dan pergi.'], '"Kakak pergi ke apotek." memakai kata baku semua.'),
        pg('Kata tidak baku dalam kalimat "Ibu memberi nasehat agar kami rajin belajar." adalah ....', ['memberi', 'nasehat', 'rajin', 'belajar'], 1, ['Periksa satu per satu.', 'Memberi, rajin, dan belajar sudah baku.', 'Bentuk baku dari nasehat adalah nasihat.'], 'Nasehat tidak baku. Bentuk bakunya nasihat.'),
      ],
    },
  ],
};
