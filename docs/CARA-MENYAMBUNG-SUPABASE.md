# Cara Menyambung Supabase

> **Status 29 Okt 2026: sudah tersambung.**
>
> - Proyek: `pintar-main` di organisasi Pintar Main, region Southeast Asia (Singapore), alamat `https://nammubdjdjznpyodroel.supabase.co`.
> - Skema awal dan uji RLS sudah dijalankan, dan uji RLS lulus.
> - Masuk lewat email memakai kode 6 angka yang berlaku 10 menit, dikirim lewat SMTP Brevo. Uji kirim sudah sampai ke kotak masuk.
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
   - Buka **Authentication → Email Templates → Magic Link** dan pastikan isinya memakai `{{ .Token }}` (kode 6 angka), bukan tautan.
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

## Yang belum dibuat (menyusul)

- Menghubungkan HP anak lewat kode keluarga atau QR (perlu fungsi server pembuat token perangkat).
- Orang tua kedua, link rapor lewat WhatsApp, dan panel pengelola.
