# Draf Kebijakan Privasi — Pintar Main

**Ringkas:** (1) Draf kebijakan privasi untuk aplikasi Android dan halaman rapor web, ditulis untuk orang tua dalam bahasa sehari-hari, ditambah satu bagian pendek untuk anak. (2) Isinya mengikuti data yang benar-benar dikumpulkan menurut rancangan (`02-rancangan/11-privasi-dan-keamanan.md` bagian 3), sebab Google Play mewajibkan kebijakan yang akurat. (3) Bagian bertanda `[…]` diisi setelah badan usaha dan pejabat pelindungan data ditetapkan. **Draf, belum diperiksa ahli hukum.**

Versi draf 0.1 — 19 Oktober 2026. Berlaku mulai: [TANGGAL].

---

## Kebijakan Privasi Pintar Main

### 1. Siapa kami

Pintar Main adalah aplikasi latihan belajar untuk anak SD dan orang tuanya. Aplikasi ini dikelola oleh **[NAMA BADAN USAHA]**, [alamat lengkap], sebagai pengendali data pribadi.

Pejabat pelindungan data: **[nama]** — [email] — WhatsApp [nomor].

### 2. Untuk siapa aplikasi ini

Aplikasi ini untuk **anak usia 6–12 tahun** yang didampingi orang tua atau wali. Anak **tidak bisa mendaftar sendiri**. Hanya orang tua atau wali berusia 18 tahun ke atas yang membuat akun, membuat profil anak, dan memberi izin penggunaan data.

### 3. Data yang kami kumpulkan

| Data | Dari siapa | Untuk apa | Wajib? |
|---|---|---|---|
| Email | Orang tua | Masuk ke akun lewat kode | Ya |
| Nomor WhatsApp, pesan dan pesan suara yang Anda kirim kepada kami | Orang tua | Kabar dari kami, pengingat pertanyaan, dan Keluarga Perintis | Tidak — hanya dengan Izin 7 |
| Nama panggilan orang tua | Orang tua | Sapaan di aplikasi | Ya |
| Nama panggilan, bulan dan tahun lahir, kelas, hewan profil anak | Orang tua | Memilih isi sesuai kelas dan usia, rapor | Ya |
| Hasil latihan: jawaban, benar/salah, waktu per soal, level | Anak, saat latihan | Menyesuaikan soal, rapor kemajuan | Ya |
| Kecepatan membaca dan kata yang sulit | Anak dan orang tua (saat Dengar Bacaan) | Rapor membaca | Ya, bila fitur dipakai |
| Pesan di dalam keluarga | Orang tua dan anak (stiker) | Komunikasi orang tua–anak | Ya, bila fitur dipakai |
| PIN orang tua dan PIN anak | Orang tua | Mengunci mode orang tua dan profil anak (disimpan teracak) | PIN anak tidak wajib |
| Catatan pemakaian (bagian yang dibuka, latihan yang ditinggalkan) | Aplikasi | Memperbaiki aplikasi | Hanya dengan izin |
| Jawaban pertanyaan masukan | Orang tua dan anak | Memperbaiki aplikasi | Hanya dengan izin |
| Data teknis: versi aplikasi, waktu terakhir tersambung, jumlah hasil yang belum terkirim | Aplikasi | Memastikan hasil latihan tidak hilang | Ya |
| Token pemberitahuan **HP orang tua** (pengenal acak yang dibuat layanan pemberitahuan) | Aplikasi di mode orang tua | Mengirim kabar rapor ke HP Anda | Hanya kalau Anda menyalakan pemberitahuan. HP yang dipakai dalam mode anak **tidak** mendaftar pemberitahuan |

**Yang tidak pernah kami kumpulkan:** nama lengkap anak, foto, video, rekaman suara anak, nama sekolah, alamat, lokasi, NIK/NISN, daftar kontak, pengenal iklan, atau pengenal perangkat tetap (IMEI, MAC, nomor seri).

### 4. Dasar kami memakai data

Kami memakai data berdasarkan **persetujuan Anda sebagai orang tua atau wali**, yang Anda berikan per tujuan saat mendaftar dan bisa Anda ubah kapan saja. Untuk bukti persetujuan dan menanggapi kebocoran data, kami juga memproses data karena **kewajiban hukum**. [Diperiksa ahli hukum: dasar pemrosesan menurut UU 27/2022 Ps. 20]

### 5. Hal yang tidak kami lakukan

- Tidak menampilkan iklan.
- Tidak menjual atau menyewakan data.
- Tidak membuat profil anak untuk iklan, penawaran, atau penjualan.
- Tidak membiarkan anak berkomunikasi dengan orang di luar keluarganya.
- Tidak membiarkan anak membeli apa pun. Pembelian (nanti, kalau ada) hanya bisa dilakukan orang tua di mode orang tua.
- Tidak memakai notifikasi atau trik desain untuk membuat anak terus membuka aplikasi.

### 6. Siapa yang bisa melihat data

| Pihak | Yang dilihat |
|---|---|
| Anda dan orang tua kedua yang Anda undang | Semua data anak di keluarga Anda |
| Penerima link rapor (kalau Anda membuatnya) | Rapor satu anak |
| Pengajar kelas Paket Siap TKA (kalau Anda mengizinkan) | Ringkasan latihan rumah anak Anda |
| Tim kami | Ringkasan gabungan. Data satu keluarga hanya dibuka untuk menyelesaikan masalah teknis, dan setiap pembukaan tercatat |
| Penyedia layanan kami | Lihat bagian 7 |
| Pihak berwenang | Hanya kalau diwajibkan hukum |

### 7. Penyedia layanan dan transfer ke luar negeri

| Penyedia | Untuk apa | Lokasi |
|---|---|---|
| Supabase | Server dan basis data | Singapura |
| Anthropic (Claude) | Rapor cerita, hanya dengan izin Anda dan tanpa nama anak | Amerika Serikat; dihapus dalam 30 hari |
| Brevo (atau penyedia email lain) | Mengirim kode masuk ke email Anda | [lokasi] |
| Cloudflare | Menampilkan halaman rapor web | [lokasi] |
| Google (layanan suara) | Membuat suara bacaan sekali saat paket isi disusun (tanpa data siapa pun); membuat suara **nama panggilan anak** sekali saat profil dibuat, dan (kalau dipakai) suara pesan dari orang tua untuk anak kelas 1–2. Yang dikirim hanya teks itu, tanpa data lain | [lokasi] **[ASUMSI — dicek di perjanjian pemrosesan Google Cloud]** |
| Expo dan Google Firebase Cloud Messaging | Mengirim pemberitahuan ke **HP orang tua** dan memasang pembaruan isi aplikasi | Amerika Serikat **[ASUMSI — dicek]** |
| WhatsApp (Meta Platforms) | Kabar, pengingat, dan percakapan Keluarga Perintis — hanya dengan Izin 7 | Di luar Indonesia, sesuai ketentuan WhatsApp |
| Anthropic (Claude, langganan pengelola) | Membantu menyusun ringkasan mingguan dari **angka gabungan tanpa nomor keluarga** | Amerika Serikat |

Transfer ke luar Indonesia untuk layanan inti (Supabase, Brevo, Cloudflare, Expo) dilakukan karena negara tujuan punya pelindungan yang setara atau memadai, **dan** kami terikat perjanjian pemrosesan data yang mewajibkan perlindungan itu. Transfer untuk tujuan pilihan (rapor cerita AI, WhatsApp) dilakukan berdasarkan izin pilihan Anda. [Diperiksa ahli hukum: UU 27/2022 Ps. 56] (Diperbaiki 20 Okt: daftar pemroses lama belum memuat Expo/Firebase, WhatsApp, dan langganan Claude pengelola.)

### 8. Berapa lama data disimpan

| Data | Lama |
|---|---|
| Akun, profil, hasil latihan, jawaban masukan | Selama akun aktif |
| Pesan dalam keluarga | 12 bulan |
| Catatan pemakaian | Rinci 12 bulan, lalu hanya ringkasan |
| Setelah akun dihapus | Dihapus dalam 30 hari; cadangan terhapus otomatis dalam 7 hari berikutnya |
| Bukti persetujuan | Selama akun aktif dan [5] tahun setelahnya, untuk memenuhi kewajiban hukum |

### 9. Hak Anda

Anda berhak: mendapat informasi tentang pemakaian data; melihat dan mendapat salinan data; membetulkan data; menghapus data dan akun; menarik izin; membatasi atau menunda pemakaian; memindahkan data; dan mengajukan keberatan. [Diperiksa ahli hukum: rujukan UU 27/2022 Ps. 5–13]

Caranya: **Pengaturan → Data keluarga** di aplikasi, atau halaman [tautan hapus akun], atau hubungi pejabat pelindungan data. Kami menanggapi paling lambat [3 × 24 jam / sesuai ketentuan].

### 10. Keamanan

Data dikirim lewat sambungan terenkripsi; akses dibatasi per keluarga; PIN disimpan teracak; kunci rahasia hanya di server; cadangan harian. Kalau terjadi kebocoran, kami memberi tahu Anda dan lembaga yang berwenang **paling lambat 3 × 24 jam**, berisi data yang terungkap, kapan dan bagaimana, serta langkah penanganan (UU 27/2022 Ps. 46).

### 11. Perubahan kebijakan

Kalau kami mengubah cara memakai data, kami memberi tahu Anda di aplikasi dan lewat email atau WhatsApp **sebelum** perubahan berlaku. Untuk tujuan baru, kami meminta izin baru.

### 12. Untuk kamu, anak-anak

> Halo! Aplikasi ini mencatat jawaban latihanmu supaya soalnya pas, tidak terlalu susah dan tidak terlalu gampang. Ayah atau Bunda bisa melihat kemajuanmu.
> Kami **tidak** menyimpan fotomu, suaramu, atau tempat tinggalmu. Kamu hanya bisa berkirim pesan dengan keluargamu.
> Kalau ada yang membuatmu tidak nyaman, ceritakan ke Ayah atau Bunda.

### 13. Hubungi kami

[Nama pejabat pelindungan data] — [email] — WhatsApp [nomor] — [alamat].
