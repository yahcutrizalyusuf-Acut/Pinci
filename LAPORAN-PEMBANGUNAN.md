# Laporan Pembangunan Pintar Main

Untuk Acut, 29 Oktober 2026.

## 1. Yang sudah jadi

| Bagian | Isi |
|---|---|
| Mulai | Selamat datang, buat PIN orang tua, profil anak (nama panggilan, kelas, hewan), pilih profil |
| Lancar Matematika | Tes penempatan, jurus Pinci, lembar 20 soal tanpa jam berjalan, akhir lembar dengan rekor sendiri. Kelas 1–6 |
| Persiapan TKA | Peta 36 topik, latihan dengan petunjuk 3 tahap, latihan rumah, mini try out mingguan, 5 simulasi bertempo, pembahasan. Terbuka mulai 4 Januari 2027 (bisa diubah) |
| Baca Ulang | 36 teks, membaca dengan suara, pengukur kecepatan baca, pertanyaan |
| Bahasa Inggris | Tingkat 3–6, tes singkat, kosakata bergambar, pola kalimat, dengar, susun kalimat. Bisa dibuka semua kelas |
| Gudang Ilmu | Jalan topik kelas 6, kartu penjelasan dan soal |
| Waktu main | 4 game tanpa kalah: Pasar Gampong, Ular Tangga Lurus, Susun Kubus, Tebak Kata. Ada tingkat Santai dan Seru |
| Batas waktu | Belajar ≤ 10 menit × kelas, blok 15 menit dengan istirahat, game 20/30 menit (orang tua bisa mengatur 0–60), jam tenang 21.00 |
| Mode orang tua (PIN) | Kabar, ruang anak dan pesan, rapor mingguan, bimbingan, tips, pengaturan waktu, ganti PIN, Kelola guru (masih disembunyikan) |
| Mode Dampingi | Lembar didampingi, Tantang Ayah/Bunda, baca bersama, TKA bersama |
| Data | Semua tersimpan di HP dan jalan tanpa sinyal. Penyambung Supabase sudah ditulis tetapi masih mati |

Semua 30 layar di gambar desain punya padanan di aplikasi (gambar ke-31 adalah sistem desain). Perbandingan berdampingan ada di `docs/BANDING-DESAIN.md`.

## 2. Jumlah materi

| Paket | Jumlah |
|---|---|
| Persiapan TKA (dari bahan Acut) | 36 topik, 982 butir, 5 simulasi (150 soal), 36 teks (72 pertanyaan) |
| Gudang Ilmu kelas 6 | 41 kartu (28 Matematika, 13 Bahasa Indonesia), 233 soal |
| Bahasa Inggris | 48 unit (12 per tingkat), 463 kosakata |
| Lancar Matematika | 36 jurus. Soal dibuat mesin; 8.100 lembar sudah diuji |

Semua isi berstatus **belum diperiksa guru**. Daftarnya ada di `docs/DAFTAR-PERIKSA-GURU.md`.

## 3. Cara mencoba di HP

1. Buka repo di GitHub, lalu pilih tab **Actions**.
2. Pilih **Bangun APK**, lalu klik baris teratas yang bertanda centang hijau.
3. Di bagian **Artifacts**, unduh **pintar-main-apk** (berkas ZIP).
4. Buka ZIP itu, lalu kirim `app-release.apk` ke HP Android.
5. Buka berkas itu di HP, izinkan pemasangan, lalu ketuk **Pasang**.

Expo Go belum disiapkan karena belum ada token Expo. Caranya ada di `docs/CARA-MEMBUAT-APK.md`.

## 4. Yang belum jadi

- **Penyambungan ke internet (Supabase)**: kodenya sudah ada, tetapi masih mati. Proyek Supabase perlu dibuat atas nama Acut. Langkahnya ada di `docs/CARA-MENYAMBUNG-SUPABASE.md`.
- **Kelas 1–5** untuk Baca Ulang, TKA, dan Gudang Ilmu: memang di luar cakupan tahap ini. Lancar Matematika dan Bahasa Inggris sudah bisa dipakai kelas lain.
- **Expo Go**: belum ada token.
- **APK untuk Play Store**: butuh kunci tanda tangan resmi dan akun Expo.

## 5. Hasil uji dan pemeriksaan

- 384 uji otomatis lulus. Cakupan uji bagian inti 93%.
- Pemeriksa materi mengerjakan 60 soal acak dan menemukan **0 kunci salah**. Catatan bahasa sudah diperbaiki.
- Pemeriksa produk memberi 12 temuan. 10 sudah diperbaiki: penjaga waktu, PIN, kata "salah" di layar anak, dan lainnya. Tidak ada pelanggaran Kebijakan Keluarga Google Play.
- Tanpa iklan, analytics, atau pelacak. Izin Android hanya internet dan pengaturan suara; kamera, mikrofon, dan lokasi diblokir.
- Rincian ada di `docs/LAPORAN-PEMERIKSAAN.md`.

## 6. Perlu keputusan Acut

1. **Latar keagamaan di bahan TKA.** Ada 63 soal dan 10 teks dengan kata seperti meunasah, mengaji, salat, atau Ramadan. Bahannya tidak saya ubah, tetapi untuk sementara tidak dipakai di latihan harian. Pilihannya: dibiarkan sebagai budaya Aceh, atau kalimatnya dinetralkan.
2. **Jam tenang 21.00.** Apakah orang tua boleh mematikannya?
3. **Istilah "Level", "game", dan "Mini try out"** masih dipakai di layar. Apakah perlu diganti?

Keputusan lain yang saya ambil sendiri (33 butir) ada di `KEPUTUSAN-PEMBANGUNAN.md`.

## 7. Tiga langkah berikutnya

| Langkah | Siapa |
|---|---|
| Coba APK di HP bersama anak, lalu catat yang membingungkan | Acut |
| Periksa isi memakai `docs/DAFTAR-PERIKSA-GURU.md`, mulai dari TKA | Guru pemeriksa |
| Putuskan tiga hal di bagian 6 dan buat proyek Supabase, lalu sesi Claude berikutnya menerapkan dan menyambungkan | Acut, lalu Claude Code |
