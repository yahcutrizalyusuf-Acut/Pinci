# Cara Menyambung Supabase

> **Status 29 Okt 2026: sudah tersambung.**
>
> - Proyek: `pintar-main` di organisasi Pintar Main, region Southeast Asia (Singapore), alamat `https://nammubdjdjznpyodroel.supabase.co`.
> - Skema awal dan uji RLS sudah dijalankan, dan uji RLS lulus.
> - Masuk lewat email memakai kode 6 angka yang berlaku 10 menit, dikirim lewat SMTP Brevo. Uji kirim sudah sampai ke kotak masuk.
> - Uji di HP 30 Okt: orang tua berhasil masuk dengan kode 6 angka dan membuat profil anak.
> - Variabel GitHub sudah diisi: `EXPO_PUBLIC_DATA_MODE=supabase`, URL, dan anon key. APK dari proses Bangun APK sekarang memakai Supabase.

Saat ini aplikasi berjalan **lokal**: semua data tersimpan di HP, tidak dikirim ke mana pun. Kalau nanti ingin orang tua melihat hasil anak dari HP lain, sambungkan ke Supabase dengan langkah di bawah. Kodenya sudah siap. Acut hanya perlu membuat proyek, mengisi dua kunci, dan mengubah satu saklar.

## Yang perlu disiapkan

- Akun Supabase (gratis untuk uji): <https://supabase.com>
- Pengirim email sendiri (SMTP), misalnya Brevo (gratis 300 email per hari). Pengirim bawaan Supabase hanya untuk uji dan dibatasi.

## Langkah

1. **Buat proyek baru** di Supabase.
   - Nama: `pintar-main`
   - Region: **Southeast Asia (Singapore)**
   - Simpan kata sandi basis data di tempat aman.
2. **Pasang skema dan aturan akses.** Buka menu **SQL Editor**, lalu tempel dan jalankan isi berkas berikut, berurutan:
   1. `supabase/migrations/20261029000000_skema_awal.sql` (tabel, aturan akses per keluarga, fungsi pendaftaran)
   2. `supabase/migrations/20261029000100_uji_rls.sql` (uji: harus selesai tanpa pesan "RLS bocor")
3. **Nyalakan masuk lewat email.**
   - Buka **Authentication → Providers → Email**, nyalakan.
   - Panjang kode: **6**. Masa berlaku: **600 detik** (10 menit).
   - Buka **Authentication → Email Templates**. Template **Magic Link**, **Confirm signup**, **Invite user**, dan **Reauthentication** harus memakai `{{ .Token }}` (kode 6 angka), bukan tautan. Pendaftar baru menerima *Confirm signup*; kalau template itu masih bawaan, orang tua menerima tautan ke `localhost` dan tidak bisa masuk.
   - Buka **Authentication → URL Configuration**, lalu ganti Site URL menjadi `pintarmain://`.
   - Buka **Project Settings → Auth → SMTP**, isi data pengirim email (Brevo).
4. **Ambil dua kunci.** Buka **Project Settings → API**, lalu salin:
   - **Project URL**, misalnya `https://abcd.supabase.co`
   - **anon public key** (bukan service_role)
5. **Isi kunci dan ubah saklar.**
   - Di GitHub: buka repo, pilih **Settings → Secrets and variables → Actions → Variables**, lalu tambah tiga variabel:
     - `EXPO_PUBLIC_DATA_MODE` = `supabase`
     - `EXPO_PUBLIC_SUPABASE_URL` = Project URL
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - Untuk menjalankan di komputer: salin `.env.contoh` menjadi `.env`, lalu isi tiga baris yang sama.
6. **Bangun ulang APK.** Jalankan lagi proses **Bangun APK** di tab Actions. Lihat `docs/CARA-MEMBUAT-APK.md`.

## Setelah tersambung

- Orang tua masuk dengan email dan kode 6 angka. Layar masuk baru muncul setelah saklar diubah.
- Hasil latihan tetap disimpan dulu di HP, lalu dikirim saat ada sinyal. Pengiriman diulang dengan jeda 1, 2, 5, lalu 15 menit.
- Layar akhir lembar menampilkan **Tersimpan ✓**, lalu **Terkirim ✓✓** setelah server menerima.
- Orang tua hanya bisa membaca data keluarganya sendiri. Aturan ini dijaga di server (Row Level Security).

## Kembali ke mode lokal

Ubah `EXPO_PUBLIC_DATA_MODE` menjadi `lokal`, lalu bangun ulang APK. Data yang sudah ada di HP tetap ada.

## Menghubungkan HP anak dengan HP orang tua

Supaya anak belajar di HP-nya sendiri dan hasilnya terlihat di HP orang tua (rapor, pesan, pengaturan waktu).

### Pemasangan sekali saja (Acut)

1. Buka **SQL Editor** di Supabase, tempel dan jalankan isi `supabase/migrations/20261030000000_hubungkan_hp_anak.sql`.
2. Jalankan juga `supabase/migrations/20261030000100_uji_hubungkan.sql`. Hasilnya harus selesai tanpa tulisan **GAGAL**. Berkas ini hanya menguji lalu membatalkan perubahannya sendiri, jadi data tidak berubah.
3. Buka **Authentication → Sign In / Providers**, lalu nyalakan **Allow anonymous sign-ins**. HP anak masuk tanpa email lewat cara ini. Bila tidak dinyalakan, HP anak menampilkan "Belum tersambung".
4. Bangun ulang APK (tab Actions → Bangun APK) dan pasang di kedua HP.

### Cara memakai

1. **HP orang tua:** gembok, PIN, tab **Atur**, **Hubungkan HP anak**. Pilih anak, lalu **Buat kode**. Muncul kode 6 angka yang berlaku 10 menit.
2. **HP anak:** pasang Pintar Main, ketuk **Ini HP anak**, lalu ketik kode. HP anak butuh internet saat menghubungkan.
3. Selesai. Sesudah itu:
   - hasil latihan anak muncul di HP orang tua (Kabar, Rapor, ruang anak),
   - pesan dan stiker saling terkirim,
   - pengaturan waktu dari HP orang tua berlaku di HP anak,
   - tiap menit, dan saat aplikasi dibuka kembali, kedua HP saling bertukar data. Tanpa internet, semuanya tetap disimpan dulu lalu terkirim kemudian.
4. Di **Hubungkan HP anak** orang tua melihat HP yang terhubung, kapan terakhir sinkron, dan bisa **Putuskan** kapan saja. HP yang diputus tetap bisa dipakai belajar, tetapi tidak lagi terhubung.

### Aturan keamanan

- Kode 6 angka hanya berlaku 10 menit dan sekali pakai. Salah 5 kali, HP itu ditunda 10 menit.
- HP anak hanya bisa membaca dan menulis data anak yang dipilih orang tua. Tidak bisa membuat atau mengubah profil dan pengaturan, tidak bisa mengirim pesan teks bebas (hanya stiker), dan tidak punya mode orang tua.
- Akun orang tua tidak bisa dipakai sebagai HP anak.

### Kalau ada dua HP yang mengubah hal yang sama

- Hasil latihan (sesi dan jawaban) hanya ditambah, tidak pernah berubah.
- Perubahan di HP ini yang belum terkirim tidak ditimpa data dari server.
- Waktu pemakaian hari itu: angka terbesar dari kedua HP dipakai.
- Profil, pengaturan waktu, dan pesan: yang terakhir dikirim ke server dipakai.

## Yang belum dibuat (menyusul)

- Orang tua kedua dan link rapor lewat WhatsApp, serta panel pengelola.
- Menghapus anak di satu HP belum ikut terhapus di HP lain.
