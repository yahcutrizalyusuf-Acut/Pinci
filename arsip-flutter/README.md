# Pintar Main

Aplikasi Android belajar untuk anak SD kelas 1–6 bersama **Pinci, Si Kancil Pintar**.
Satu HP, dua mode: **mode anak** dan **mode orang tua**. Dibangun dengan Flutter.

## Status

| Bagian | Status |
|---|---|
| Sistem desain (warna, huruf, tombol, Pinci) | Selesai |
| Mode anak: Selamat datang, Pilih profil, Beranda, Jurus, Lembar Lancar, Akhir lembar, Istirahat, Pesan | Selesai (tahap 1) |
| Mode orang tua: PIN, Kabar, Ruang anak, Rapor mingguan, Bimbingan (versi awal), Pengaturan waktu, Anak dan profil | Selesai (tahap 1) |
| Catatan pengembang (pemakaian aplikasi, bisa disalin) | Selesai |
| Gudang Ilmu, Kartu ilmu, Baca Ulang, Bahasa Inggris, Siap TKA, Mode Dampingi, Kelola guru | Tahap 2 |
| Kirim data ke Firebase dan pantau dari HP orang tua | Tahap 3 |
| Waktu main dan 4 game | Tahap 4 |

Desain lengkap ada di canvas Claude Design "Pintar Main — Sistem Desain".

## Cara mendapatkan APK tanpa memasang apa pun

Setiap kali kode masuk ke cabang `main`, GitHub Actions membangun APK otomatis.

1. Buka tab **Actions** di repo ini.
2. Pilih proses **Bangun APK** paling atas yang bertanda centang hijau.
3. Di bagian **Artifacts**, unduh `pintar-main-apk`, lalu ekstrak.
4. Kirim file `app-release.apk` ke HP Android, lalu pasang (izinkan "pasang dari sumber tidak dikenal").

## Cara menjalankan di komputer (untuk pengembang)

```bash
flutter create --org id.kanalcyber --project-name pintar_main --platforms android .
flutter pub get
flutter run
```

Perintah pertama hanya membuat folder `android/` yang belum ada; kode di `lib/` tidak ditimpa.

## Susunan kode

```
lib/
  main.dart                 titik masuk aplikasi
  theme/pm_theme.dart       warna, huruf, ukuran per kelas
  data/models.dart          data anak, pesan, hasil latihan, pengaturan
  data/curriculum.dart      level Lancar Matematika dan jurusnya
  data/store.dart           penyimpanan di HP + ringkasan rapor + catatan pemakaian
  widgets/pinci.dart        gambar Pinci (5 ekspresi + 3 ukuran)
  widgets/pm_widgets.dart   tombol, tab bawah, tombol suara, kotak bergetar, dll.
  screens/child/            layar mode anak
  screens/parent/           layar mode orang tua
test/                       uji otomatis
```

## Aturan desain yang dijaga di kode

- Teks di tombol hijau dan oranye berwarna Biru Tinta, bukan putih.
- Anak sampai ke soal pertama dalam 2 ketukan dari beranda.
- Layar soal tanpa jam berjalan; hanya batang kemajuan.
- Jawaban belum tepat: kotak bergetar halus dan jawaban benar tampil, tanpa kata "salah".
- Tanpa poin, koin, toko, bintang nilai, peringkat, atau hari beruntun.
- Mode anak tanpa papan ketik; anak membalas dengan stiker.

## Catatan

- ID aplikasi sementara: `id.kanalcyber.pintar_main`. Bisa diganti sebelum rilis pertama di Play Store.
- Soal dan jurus di `lib/data/curriculum.dart` masih contoh awal; sesuaikan dengan kurikulum.
- Huruf diunduh dari Google Fonts saat pertama dibuka. Sebelum rilis, huruf sebaiknya disertakan di aplikasi supaya jalan penuh tanpa internet.
