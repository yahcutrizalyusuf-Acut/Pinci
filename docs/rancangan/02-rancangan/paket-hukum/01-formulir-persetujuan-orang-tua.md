# Draf Formulir Persetujuan Orang Tua

**Ringkas:** (1) Persetujuan diminta **per tujuan**, terpisah dari syarat dan ketentuan, dan setiap tujuan bisa disetujui atau ditolak sendiri (PP 33/2026). (2) Hanya tujuan **inti** yang wajib untuk memakai aplikasi, sebab tanpa data itu latihan dan rapor tidak bisa berjalan. Enam tujuan lain (termasuk kabar WhatsApp, dipisah 20 Okt) boleh ditolak tanpa mengurangi mutu layanan. (3) Setiap layar memuat tujuh informasi yang diwajibkan UU PDP Ps. 21, dalam kalimat pendek untuk layar HP, dengan tautan ke kebijakan privasi lengkap. **Draf, belum diperiksa ahli hukum.**

Disusun 19 Oktober 2026. Tanda `[…]` = diisi kemudian.

---

## 1. Layar pembuka

> **Sebelum mulai, kami perlu izin Anda**
>
> Pintar Main dibuat untuk anak 6–12 tahun. Karena anak Anda masih di bawah umur, **Anda** yang memutuskan data apa yang boleh kami simpan dan untuk apa.
>
> Ada 1 izin wajib (supaya aplikasi bisa dipakai) dan 6 izin pilihan. Izin pilihan boleh Anda tolak, dan aplikasi tetap bekerja penuh. Semua izin bisa diubah kapan saja di **Pengaturan → Izin data**.
>
> Pengelola data: [NAMA BADAN USAHA], [alamat]. Pejabat pelindungan data: [nama], [email], [WhatsApp].
>
> ☐ Saya orang tua atau wali anak yang akan memakai aplikasi ini, dan saya berusia 18 tahun ke atas.
>
> [Lanjut]

---

## 2. Izin per tujuan

Setiap izin tampil sebagai satu kartu dengan dua tombol yang sama besar: **Setuju** dan **Tidak**. (Untuk izin wajib: **Setuju** dan **Batal mendaftar**.)

### Izin 1 — Latihan dan rapor (WAJIB)

| Unsur Ps. 21 | Teks di layar |
|---|---|
| Tujuan | Menjalankan latihan, menyesuaikan tingkat soal, dan menampilkan rapor kemajuan untuk Anda |
| Data | Nama panggilan, bulan dan tahun lahir, kelas anak; hasil setiap soal (jawaban, benar/salah, detik); kecepatan membaca; email Anda untuk masuk. **Nomor WhatsApp tidak termasuk di sini** (lihat Izin 7) |
| Relevansi | Tanpa data ini, aplikasi tidak bisa memilih soal yang pas dan tidak bisa menunjukkan kemajuan anak |
| Legalitas | Persetujuan Anda sebagai orang tua (UU 27/2022 Ps. 20 dan 25) |
| Tempat dan transfer | Disimpan di HP dan di server Supabase di **Singapura**. Dasar pengiriman ke luar negeri: Singapura punya undang-undang pelindungan data, **dan** kami terikat perjanjian pemrosesan data dengan Supabase yang mewajibkan perlindungan setara (UU PDP Ps. 56 ayat 2–3: pelindungan yang memadai dan mengikat). Dasar transfer **bukan** persetujuan Anda, supaya aplikasi tetap bisa dipakai tanpa izin transfer terpisah. [Diperiksa ahli hukum, pertanyaan 11] |
| Pihak lain yang ikut memproses | Supabase (penyimpanan, Singapura); Brevo (pengirim email kode masuk, Uni Eropa) **[ASUMSI — wilayah server Brevo dicek]**; Expo dan Google Firebase Cloud Messaging hanya untuk **HP orang tua** (pemberitahuan rapor). HP yang dipakai dalam mode anak **tidak** mendaftar pemberitahuan |
| Masa simpan | Selama akun aktif. Saat akun dihapus, data dihapus dalam 30 hari; cadangan terhapus otomatis setelah 7 hari |
| Hak Anda | Melihat, mengunduh, membetulkan, menghapus data, dan menarik izin (menarik izin wajib = menghapus akun) |

### Izin 2 — Data pemakaian untuk pengembangan (PILIHAN)

| Unsur | Teks |
|---|---|
| Tujuan | Mempelajari cara aplikasi dipakai (misalnya bagian yang sering ditinggalkan) supaya kami bisa memperbaikinya |
| Data | Catatan kapan aplikasi dibuka, bagian yang dibuka, latihan yang ditinggalkan, kegagalan kirim data. **Tanpa** pengenal perangkat, lokasi, atau iklan |
| Dipakai bagaimana | Hanya dalam bentuk jumlah gabungan. **Tidak** untuk membuat profil anak dan **tidak** untuk menawarkan apa pun |
| Kalau ditolak | Semua fitur tetap jalan. Keluarga Anda tidak masuk hitungan statistik kami |
| Masa simpan | Rinci 12 bulan, lalu dirangkum |

### Izin 3 — Pertanyaan masukan (PILIHAN)

| Unsur | Teks |
|---|---|
| Tujuan | Paling sering **2 minggu sekali**, kami bertanya 1–3 pertanyaan pilihan kepada Anda (semua pertanyaan, termasuk yang muncul setelah Anda mencoba fitur baru, digabung dalam satu kesempatan itu). Anak bisa mengetuk satu gambar setelah latihan, paling banyak sekali sehari. Tujuannya supaya kami tahu apa yang perlu diubah |
| Data | Jawaban pilihan Anda dan ketukan anak |
| Sukarela | Menjawab atau tidak, **tidak ada fitur yang ditahan dan tidak ada hadiah** selain ucapan terima kasih dan kabar perubahan. Keluarga Perintis dipilih atas undangan kami, bukan dari jumlah jawaban (lihat Syarat dan Ketentuan 6) |
| Kalau ditolak | Pertanyaan tidak pernah muncul |

### Izin 4 — Rapor cerita dengan bantuan AI (PILIHAN)

| Unsur | Teks |
|---|---|
| Tujuan | Menulis ringkasan mingguan dalam kalimat yang mudah dibaca |
| Data yang dikirim | Hanya angka ringkas (hari latihan, kecepatan, ketepatan, level). **Nama dan tanggal lahir anak tidak dikirim** |
| Ke mana | Layanan AI Claude milik Anthropic, di **Amerika Serikat**. Anthropic menghapus data ini dalam 30 hari |
| Kalau ditolak | Rapor tetap ada dengan angka yang sama, ditulis dengan kalimat baku |

### Izin 5 — Rapor lewat link (PILIHAN)

| Unsur | Teks |
|---|---|
| Tujuan | Membuat link rapor yang bisa dibuka tanpa memasang aplikasi, misalnya untuk dikirim ke pasangan lewat WhatsApp |
| Data | Nama panggilan, hewan profil, dan rapor satu anak |
| Peringatan | Siapa pun yang memegang link bisa membuka rapor. Kirim hanya ke keluarga. Link bisa dicabut kapan saja |
| Jawaban dari link | Pertanyaan masukan yang dijawab lewat link dicatat sebagai "dari link", terpisah dari jawaban Anda di aplikasi |
| Kalau ditolak | Rapor hanya terlihat di aplikasi orang tua |

### Izin 6 — Rapor untuk pengajar kelas (PILIHAN, hanya muncul untuk murid kelas luring)

*(Mulai R3, izin ini diperluas menjadi **Izin 6b — Bimbingan guru** untuk guru yang diundang orang tua, dengan dua jenis: **guru sekolah** melihat kemampuan anak pada mapel yang diizinkan dan menulis komentar untuk orang tua (tidak ada jalur ke anak); **guru les** juga memberi tugas dari Gudang Ilmu dan menulis catatan pendek ke anak yang selalu terlihat orang tua. Satu izin per guru, bisa dicabut kapan saja. Lihat `01-produk/10` bagian 4.)*

| Unsur | Teks |
|---|---|
| Tujuan | Pengajar kelas Paket Siap TKA melihat latihan rumah anak Anda, supaya bisa membahas bagian yang sulit di pertemuan berikutnya |
| Data | Latihan rumah yang selesai, topik yang paling banyak salah, jenis kesalahan |
| Siapa | Pengajar kelas anak Anda saja: [nama pengajar]. Pengajar menandatangani pernyataan menjaga kerahasiaan sebelum menerima link |
| Kalau ditolak | Pengajar tidak melihat apa pun dari aplikasi. Latihan rumah tetap terbuka menurut tanggal pertemuan |

### Izin 7 — Kabar lewat WhatsApp dan Keluarga Perintis (PILIHAN)

| Unsur | Teks |
|---|---|
| Tujuan | Mengirim kabar perubahan aplikasi, pengingat pertanyaan masukan, dan (kalau Anda kami undang dan bersedia) percakapan Keluarga Perintis |
| Data | Nomor WhatsApp Anda; pesan dan pesan suara yang Anda kirim kepada kami |
| Pihak lain | WhatsApp (Meta Platforms), di luar Indonesia. Pesan melewati layanan WhatsApp sesuai ketentuan WhatsApp |
| Data anak | **Tidak** dikirim lewat WhatsApp. Kami tidak meminta foto, suara, atau nama lengkap anak |
| Kalau ditolak | Kabar tetap muncul di aplikasi. Anda tidak diundang menjadi Keluarga Perintis |
| Masa simpan | Nomor dihapus saat izin ditarik atau akun dihapus; pesan suara dihapus setelah poinnya diketik (paling lama 14 hari) |

---

## 3. Layar penutup

> **Ringkasan izin Anda**
> Latihan dan rapor ✓ · Data pemakaian ✓/✗ · Pertanyaan masukan ✓/✗ · Rapor cerita AI ✓/✗ · Rapor lewat link ✓/✗ · Rapor untuk pengajar ✓/✗ · Kabar WhatsApp ✓/✗
>
> Anda bisa mengubahnya kapan saja. Kalau kami mengubah cara memakai data, kami memberi tahu Anda **sebelum** perubahan berlaku.
>
> [Baca kebijakan privasi lengkap] [Selesai]

---

## 4. Bukti persetujuan yang disimpan

| Kolom | Isi |
|---|---|
| Orang tua | Nomor akun |
| Tujuan | Salah satu dari 7 |
| Setuju / tidak | — |
| Versi teks | Nomor versi kartu yang dilihat |
| Waktu | Waktu server |
| Cara | Ketukan di aplikasi |
| Perubahan | Setiap perubahan menjadi baris baru, baris lama tidak dihapus |

---

## 5. Catatan untuk ahli hukum

1. Apakah dasar transfer ke Singapura (Izin 1: pelindungan memadai + perjanjian pemrosesan yang mengikat, **bukan** persetujuan) dan ke AS (Izin 4: persetujuan, sebab izin itu pilihan) sudah cukup menurut UU PDP Ps. 56? (Diubah 20 Okt: pemeriksa menemukan Izin 1 lama menggabungkan nomor WhatsApp dan transfer dengan tujuan wajib, sehingga orang tua yang menolak transfer tidak bisa memakai aplikasi.)
2. Apakah centang "saya orang tua/wali, 18+" cukup sebagai verifikasi untuk Permenkomdigi 9/2026?
3. Apakah Izin 6 perlu persetujuan pengajar juga (sebagai penerima data)?
4. Apakah persetujuan ini juga harus disampaikan dengan cara yang dipahami anak 10–12 tahun (parameter DP06 Kepmenkomdigi 142/2026)? Usul kami: satu layar "Untuk kamu" bergambar di mode anak.
