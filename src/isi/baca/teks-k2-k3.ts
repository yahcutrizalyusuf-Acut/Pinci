import type { Teks } from '../tka/jenis';
import { buatTeks } from './bantu';

/** Teks Baca Ulang kelas 2 dan 3, tahap 1. Ditulis sendiri, belum diperiksa guru. */

export const TEKS_K2: Teks[] = [
  buatTeks(2, 1, 'Kucing Kecil', 'cerita', ['Nanda punya kucing kecil. Namanya Belang. Bulunya putih dan hitam.', 'Setiap pagi Belang minum susu. Lalu ia tidur di dekat jendela. Nanda suka mengelus kepala Belang.'], [
    { tanya: 'Siapa nama kucing Nanda?', pilihan: ['Nanda', 'Belang', 'Putih'], benar: 1, petunjuk: 'Cari kata "Namanya".', pembahasan: 'Kalimat kedua: "Namanya Belang."', alasan: { 0: 'Nanda adalah pemilik kucing.', 2: 'Putih adalah warna bulu.' } },
    { tanya: 'Di mana Belang tidur?', pilihan: ['Di dekat jendela', 'Di dapur', 'Di halaman'], benar: 0, petunjuk: 'Cari kata "tidur".', pembahasan: 'Paragraf kedua: "ia tidur di dekat jendela."', alasan: { 1: 'Dapur tidak disebut di teks.', 2: 'Halaman tidak disebut di teks.' } },
  ]),
  buatTeks(2, 2, 'Menanam Cabai', 'cerita', ['Kakek menanam cabai di kebun. Ikram membantu kakek. Ikram menyiram tanah dengan air.', 'Beberapa minggu kemudian, pohon cabai tumbuh tinggi. Buahnya merah dan banyak. Ikram senang sekali. Nenek memasak sambal dari cabai itu.'], [
    { tanya: 'Apa yang dilakukan Ikram?', pilihan: ['Memasak sambal', 'Menyiram tanah', 'Memetik mangga'], benar: 1, petunjuk: 'Cari kalimat tentang Ikram membantu kakek.', pembahasan: '"Ikram menyiram tanah dengan air."', alasan: { 0: 'Yang memasak sambal adalah nenek.', 2: 'Mangga tidak disebut di teks.' } },
    { tanya: 'Apa warna buah cabai?', pilihan: ['Hijau', 'Kuning', 'Merah'], benar: 2, petunjuk: 'Cari kata "Buahnya".', pembahasan: '"Buahnya merah dan banyak."', alasan: { 0: 'Hijau tidak disebut di teks.', 1: 'Kuning tidak disebut di teks.' } },
  ]),
  buatTeks(2, 3, 'Hujan Sore', 'cerita', ['Sore itu langit gelap. Angin bertiup kencang. Tidak lama kemudian, hujan turun deras.', 'Mira dan adiknya masuk ke rumah. Mereka melihat hujan dari jendela. Ibu membuat teh hangat. Mereka minum teh bersama sambil menunggu hujan reda.'], [
    { tanya: 'Kapan hujan turun?', pilihan: ['Pagi', 'Siang', 'Sore'], benar: 2, petunjuk: 'Lihat kalimat pertama.', pembahasan: '"Sore itu langit gelap." Hujan turun sore hari.', alasan: { 0: 'Pagi tidak disebut di teks.', 1: 'Siang tidak disebut di teks.' } },
    { tanya: 'Apa yang dibuat Ibu?', pilihan: ['Kue', 'Teh hangat', 'Nasi'], benar: 1, petunjuk: 'Cari kata "Ibu".', pembahasan: '"Ibu membuat teh hangat."', alasan: { 0: 'Kue tidak disebut di teks.', 2: 'Nasi tidak disebut di teks.' } },
  ]),
  buatTeks(2, 4, 'Ke Pantai', 'cerita', ['Hari Minggu, keluarga Faris pergi ke pantai. Mereka naik mobil. Di pantai, Faris membuat istana pasir.', 'Adiknya mencari kerang. Ayah dan Ibu duduk di bawah pohon. Ombak datang pelan-pelan. Faris pulang dengan baju penuh pasir.'], [
    { tanya: 'Apa yang dibuat Faris di pantai?', pilihan: ['Istana pasir', 'Layang-layang', 'Perahu kertas'], benar: 0, petunjuk: 'Cari kata "membuat".', pembahasan: '"Faris membuat istana pasir."', alasan: { 1: 'Layang-layang tidak disebut.', 2: 'Perahu kertas tidak disebut.' } },
    { tanya: 'Mengapa baju Faris penuh pasir?', pilihan: ['Karena ia jatuh di jalan', 'Karena ia bermain di pantai', 'Karena hujan turun'], benar: 1, petunjuk: 'Ingat apa yang Faris lakukan di pantai.', pembahasan: 'Faris bermain dan membuat istana pasir, jadi bajunya penuh pasir.', alasan: { 0: 'Teks tidak bercerita Faris jatuh.', 2: 'Teks tidak menyebut hujan.' } },
  ]),
  buatTeks(2, 5, 'Sepatu Baru', 'cerita', ['Putri punya sepatu baru. Warnanya biru. Putri memakainya ke sekolah.', 'Di jalan ada genangan air. Putri melompat hati-hati. Sepatunya tetap bersih. Sampai di sekolah, temannya berkata, "Sepatumu bagus!" Putri tersenyum.'], [
    { tanya: 'Apa warna sepatu baru Putri?', pilihan: ['Merah', 'Biru', 'Hitam'], benar: 1, petunjuk: 'Cari kata "Warnanya".', pembahasan: '"Warnanya biru."', alasan: { 0: 'Merah tidak disebut.', 2: 'Hitam tidak disebut.' } },
    { tanya: 'Mengapa sepatu Putri tetap bersih?', pilihan: ['Karena tidak ada air', 'Karena Putri melompat hati-hati', 'Karena Putri naik sepeda'], benar: 1, petunjuk: 'Baca kalimat tentang genangan air.', pembahasan: 'Ada genangan air, tetapi Putri melompat hati-hati, jadi sepatunya bersih.', alasan: { 0: 'Teks menyebut ada genangan air.', 2: 'Teks tidak menyebut sepeda.' } },
  ]),
  buatTeks(2, 6, 'Rusa di Hutan', 'teks informasi', ['Rusa hidup di hutan. Rusa makan daun dan rumput. Rusa jantan punya tanduk.', 'Rusa bisa berlari cepat. Kalau ada bahaya, rusa langsung lari. Anak rusa tinggal dekat induknya.'], [
    { tanya: 'Apa makanan rusa?', pilihan: ['Daging dan ikan', 'Daun dan rumput', 'Buah dan madu'], benar: 1, petunjuk: 'Cari kata "makan".', pembahasan: '"Rusa makan daun dan rumput."', alasan: { 0: 'Daging dan ikan tidak disebut.', 2: 'Buah dan madu tidak disebut.' } },
    { tanya: 'Rusa mana yang punya tanduk?', pilihan: ['Rusa jantan', 'Anak rusa', 'Semua rusa'], benar: 0, petunjuk: 'Cari kata "tanduk".', pembahasan: '"Rusa jantan punya tanduk."', alasan: { 1: 'Teks tidak menyebut anak rusa bertanduk.', 2: 'Teks hanya menyebut rusa jantan.' } },
  ]),
];

export const TEKS_K3: Teks[] = [
  buatTeks(3, 1, 'Pasar Pagi', 'cerita', ['Pagi-pagi sekali, Laila ikut Ibu ke pasar. Pasar sudah ramai. Ada pedagang sayur, ikan, dan buah. Suara orang menawar terdengar di mana-mana.', 'Ibu membeli bayam, tomat, dan ikan tongkol. Laila membawa kantong sayur. Sebelum pulang, Ibu membeli dua buah pepaya. Laila senang karena pepaya adalah buah kesukaannya.'], [
    { tanya: 'Ikan apa yang dibeli Ibu?', pilihan: ['Ikan bandeng', 'Ikan tongkol', 'Ikan lele'], benar: 1, petunjuk: 'Cari kata "ikan" di paragraf kedua.', pembahasan: '"Ibu membeli bayam, tomat, dan ikan tongkol."', alasan: { 0: 'Bandeng tidak disebut.', 2: 'Lele tidak disebut.' } },
    { tanya: 'Mengapa Laila senang?', pilihan: ['Karena pasar ramai', 'Karena Ibu membeli pepaya', 'Karena ia membawa kantong'], benar: 1, petunjuk: 'Cari kata "karena" di kalimat terakhir.', pembahasan: 'Laila senang karena pepaya buah kesukaannya, dan Ibu membelinya.', alasan: { 0: 'Pasar ramai bukan alasan Laila senang.', 2: 'Membawa kantong bukan alasan ia senang.' } },
  ]),
  buatTeks(3, 2, 'Layang-Layang Zaki', 'cerita', ['Zaki membuat layang-layang dari bambu dan kertas minyak. Ayah membantu mengikat bambu dengan benang. Layang-layang itu berwarna kuning.', 'Sore harinya, Zaki menerbangkannya di lapangan. Angin bertiup kencang. Layang-layang naik tinggi sekali. Tiba-tiba benangnya putus. Zaki berlari mengejar. Untung layang-layang itu tersangkut di pohon rendah.'], [
    { tanya: 'Dari apa layang-layang Zaki dibuat?', pilihan: ['Plastik dan kayu', 'Bambu dan kertas minyak', 'Kain dan tali'], benar: 1, petunjuk: 'Lihat kalimat pertama.', pembahasan: '"Zaki membuat layang-layang dari bambu dan kertas minyak."', alasan: { 0: 'Plastik tidak disebut.', 2: 'Kain tidak disebut.' } },
    { tanya: 'Apa yang terjadi saat layang-layang naik tinggi?', pilihan: ['Hujan turun', 'Benangnya putus', 'Ayah datang'], benar: 1, petunjuk: 'Cari kata "Tiba-tiba".', pembahasan: '"Tiba-tiba benangnya putus."', alasan: { 0: 'Teks tidak menyebut hujan.', 2: 'Ayah membantu saat membuat, bukan saat terbang.' } },
  ]),
  buatTeks(3, 3, 'Gajah Sumatra', 'teks informasi', ['Gajah Sumatra adalah hewan besar yang hidup di hutan Sumatra. Telinganya lebar. Belalainya panjang dan kuat. Gajah memakai belalai untuk mengambil makanan dan minum air.', 'Gajah makan banyak sekali. Seekor gajah bisa makan rumput dan daun sepanjang hari. Sekarang jumlah gajah Sumatra makin sedikit. Kita perlu menjaga hutan supaya gajah tetap punya rumah.'], [
    { tanya: 'Untuk apa gajah memakai belalainya?', pilihan: ['Untuk berlari', 'Untuk mengambil makanan dan minum', 'Untuk mendengar'], benar: 1, petunjuk: 'Cari kata "belalai".', pembahasan: '"Gajah memakai belalai untuk mengambil makanan dan minum air."', alasan: { 0: 'Berlari memakai kaki.', 2: 'Mendengar memakai telinga.' } },
    { tanya: 'Mengapa kita perlu menjaga hutan?', pilihan: ['Supaya gajah tetap punya rumah', 'Supaya gajah makan sedikit', 'Supaya gajah pindah ke kota'], benar: 0, petunjuk: 'Lihat kalimat terakhir.', pembahasan: '"Kita perlu menjaga hutan supaya gajah tetap punya rumah."', alasan: { 1: 'Teks tidak menyebut alasan ini.', 2: 'Teks tidak menyebut kota.' } },
  ]),
  buatTeks(3, 4, 'Kue untuk Nenek', 'cerita', ['Hari ini nenek berulang tahun. Dara dan Ibu membuat kue bolu. Dara memecahkan telur. Ibu mencampur tepung, gula, dan mentega.', 'Kue dipanggang selama setengah jam. Harumnya tercium sampai ke teras. Setelah dingin, Dara menghias kue dengan buah stroberi. Sore harinya mereka mengantar kue ke rumah nenek. Nenek memeluk Dara erat-erat.'], [
    { tanya: 'Apa tugas Dara saat membuat kue?', pilihan: ['Memanggang kue', 'Memecahkan telur', 'Membeli tepung'], benar: 1, petunjuk: 'Cari kalimat yang diawali kata "Dara".', pembahasan: '"Dara memecahkan telur."', alasan: { 0: 'Teks tidak menyebut Dara yang memanggang.', 2: 'Membeli tepung tidak disebut.' } },
    { tanya: 'Berapa lama kue dipanggang?', pilihan: ['Lima menit', 'Setengah jam', 'Dua jam'], benar: 1, petunjuk: 'Cari kata "dipanggang".', pembahasan: '"Kue dipanggang selama setengah jam."', alasan: { 0: 'Lima menit tidak disebut.', 2: 'Dua jam tidak disebut.' } },
  ]),
  buatTeks(3, 5, 'Perpustakaan Sekolah', 'cerita', ['Sekolah kami punya perpustakaan kecil. Bukunya banyak dan rapi. Ada buku cerita, buku binatang, dan buku tentang laut.', 'Setiap hari Rabu, kelas tiga boleh meminjam buku. Bu Rina, penjaga perpustakaan, mencatat nama peminjam. Buku harus dikembalikan dalam satu minggu. Kalau buku rusak, peminjam harus memperbaikinya.'], [
    { tanya: 'Kapan kelas tiga boleh meminjam buku?', pilihan: ['Setiap hari Senin', 'Setiap hari Rabu', 'Setiap hari Jumat'], benar: 1, petunjuk: 'Cari nama hari di teks.', pembahasan: '"Setiap hari Rabu, kelas tiga boleh meminjam buku."', alasan: { 0: 'Senin tidak disebut.', 2: 'Jumat tidak disebut.' } },
    { tanya: 'Siapa yang mencatat nama peminjam?', pilihan: ['Kepala sekolah', 'Bu Rina', 'Ketua kelas'], benar: 1, petunjuk: 'Cari kata "mencatat".', pembahasan: '"Bu Rina, penjaga perpustakaan, mencatat nama peminjam."', alasan: { 0: 'Kepala sekolah tidak disebut.', 2: 'Ketua kelas tidak disebut.' } },
  ]),
  buatTeks(3, 6, 'Penyu Bertelur', 'teks informasi', ['Penyu adalah hewan laut. Penyu betina datang ke pantai untuk bertelur. Biasanya penyu datang pada malam hari. Ia menggali lubang di pasir dengan kakinya.', 'Telur dimasukkan ke lubang, lalu ditutup pasir. Setelah kira-kira dua bulan, anak penyu menetas. Anak penyu disebut tukik. Tukik langsung berjalan menuju laut.'], [
    { tanya: 'Kapan biasanya penyu datang ke pantai?', pilihan: ['Pagi hari', 'Siang hari', 'Malam hari'], benar: 2, petunjuk: 'Cari kata "datang pada".', pembahasan: '"Biasanya penyu datang pada malam hari."', alasan: { 0: 'Pagi tidak disebut.', 1: 'Siang tidak disebut.' } },
    { tanya: 'Apa nama anak penyu?', pilihan: ['Tukik', 'Kerang', 'Anak ikan'], benar: 0, petunjuk: 'Cari kata "disebut".', pembahasan: '"Anak penyu disebut tukik."', alasan: { 1: 'Kerang adalah hewan lain.', 2: 'Teks menyebut nama khusus anak penyu.' } },
  ]),
];
