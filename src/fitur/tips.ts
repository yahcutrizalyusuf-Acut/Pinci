/**
 * 30 kartu "Tips Ayah Bunda" — ditulis dari rancangan (membantu tanpa mengambil alih,
 * pujian usaha, waktu belajar singkat, Mode Dampingi). Status: belum_diperiksa.
 */
import type { StatusPeriksa } from '../isi/jenis';

export interface KartuTips {
  id: string;
  judul: string;
  isi: string;
  status: StatusPeriksa;
}

const T = (n: number, judul: string, isi: string): KartuTips => ({ id: `tips-${String(n).padStart(2, '0')}`, judul, isi, status: 'belum_diperiksa' });

export const TIPS: KartuTips[] = [
  T(1, 'Puji usahanya', 'Katakan "Ayah lihat kamu tidak menyerah", bukan "Kamu pintar". Pujian usaha membuat anak berani mencoba soal sulit.'),
  T(2, 'Cukup menyuruh dan menyemangati', 'Anak tidak harus selalu didampingi. Mengingatkan dengan ramah setiap hari sudah sangat membantu.'),
  T(3, 'Singkat tapi setiap hari', 'Latihan 5 menit setiap hari lebih kuat daripada 1 jam sekali seminggu.'),
  T(4, 'Tanya caranya', 'Saat anak salah, tanya "Bagaimana caramu tadi?" sebelum menjelaskan. Sering anak menemukan sendiri kesalahannya.'),
  T(5, 'Jangan langsung memberi jawaban', 'Beri satu petunjuk kecil dulu. Biarkan anak menyelesaikan langkah terakhirnya sendiri.'),
  T(6, 'Rekor sendiri, bukan teman', 'Bandingkan anak dengan dirinya kemarin, bukan dengan kakak atau temannya.'),
  T(7, 'Waktu yang sama setiap hari', 'Pilih satu waktu tetap, misalnya setelah mandi sore atau setelah makan malam, supaya latihan menjadi kebiasaan.'),
  T(8, 'Istirahat itu bagian dari belajar', 'Setelah 15 menit, biarkan anak minum dan bergerak. Otak anak lebih segar setelah jeda.'),
  T(9, 'Game bukan hadiah', 'Hindari kalimat "kalau selesai belajar, boleh main". Cukup katakan waktu main datang setelah belajar, seperti istirahat di sekolah.'),
  T(10, 'Matikan layar sebelum tidur', 'Jauhkan HP satu jam sebelum tidur. Jam tenang di aplikasi membantu Ayah Bunda.'),
  T(11, 'Benda nyata untuk pecahan', 'Potong roti atau kue menjadi bagian sama besar. Pecahan lebih mudah dipahami dengan benda di tangan.'),
  T(12, 'Belanja sambil berhitung', 'Ajak anak menghitung total belanja di kedai dan kembaliannya. Itu latihan Matematika yang nyata.'),
  T(13, 'Baca bersama 10 menit', 'Baca satu cerita pendek bersama, lalu minta anak menceritakan ulang dengan kata-katanya sendiri.'),
  T(14, 'Tanya "ini tentang apa?"', 'Setelah membaca satu paragraf, tanyakan intinya. Ini melatih menemukan ide pokok untuk TKA.'),
  T(15, 'Tantang Ayah', 'Sesekali kerjakan soal Lancar bergantian dengan anak. Biarkan anak menang sesekali dan merasakan bangga.'),
  T(16, 'Salah itu biasa', 'Tunjukkan bahwa Ayah Bunda juga pernah salah hitung. Anak belajar bahwa salah adalah bagian dari belajar.'),
  T(17, 'Tanda kuning bukan nilai jelek', 'Tanda kuning di Bimbingan hanya berarti anak butuh teman sebentar. Buka Mode Dampingi dan kerjakan 3 soal bersama.'),
  T(18, 'Dengarkan anak membaca', 'Di Mode Dampingi, dengarkan anak membaca nyaring. Tandai kata yang tersandung tanpa memotong bacaannya.'),
  T(19, 'Bertanya tentang pelajaran', 'Tanya "Apa yang paling seru hari ini?" alih-alih "Berapa nilaimu?". Anak akan lebih terbuka bercerita.'),
  T(20, 'Jaga semangat saat lelah', 'Kalau anak mengirim stiker "Aku capek", cukupkan latihan hari itu. Besok bisa dilanjutkan.'),
  T(21, 'Kirim pesan semangat', 'Satu pesan pendek di aplikasi membuat anak merasa diperhatikan, walau Ayah Bunda sedang bekerja.'),
  T(22, 'Persiapan TKA tenang', 'Simulasi bukan ujian sungguhan. Yang dicari adalah topik yang perlu diulang, bukan nilai sempurna.'),
  T(23, 'Lihat penyebab salah', 'Di rapor TKA ada penyebab salah. Bantu anak pada penyebab itu, misalnya kurang teliti membaca soal.'),
  T(24, 'Ulangi topik lama', 'Mini try out mengambil soal dari topik beberapa minggu lalu. Mengulang membuat ingatan bertahan lama.'),
  T(25, 'Kosakata Inggris di rumah', 'Sebut nama benda di rumah dalam Bahasa Inggris bersama anak, misalnya "door", "chair", "water".'),
  T(26, 'Contoh dulu, baru latihan', 'Sebelum anak mencoba, perlihatkan satu contoh jadi. Anak lebih percaya diri setelah melihat caranya.'),
  T(27, 'Tempat belajar yang tenang', 'Matikan televisi saat anak latihan. Lima menit tanpa gangguan lebih berharga daripada setengah jam yang ramai.'),
  T(28, 'Rayakan kemajuan kecil', 'Saat rekor anak naik satu detik pun, katakan bangga. Kemajuan kecil yang dirayakan membuat anak terus mencoba.'),
  T(29, 'Biarkan anak memilih', 'Biarkan anak memilih mau mulai dari Lancar atau Bahasa Inggris. Rasa memilih membuat anak lebih bersemangat.'),
  T(30, 'Hubungi guru bila perlu', 'Bila tanda merah bertahan lebih dari dua minggu, ceritakan kepada guru di sekolah supaya dijelaskan dengan cara lain.'),
];

export function tipsHariIni(tanggal = new Date()): KartuTips {
  const hari = Math.floor(tanggal.getTime() / 86_400_000);
  return TIPS[hari % TIPS.length];
}
