# Cara Membuat dan Memasang APK

## A. Unduh APK dari GitHub (tanpa akun Expo)

APK dibangun otomatis oleh proses **Bangun APK** (`.github/workflows/bangun-apk.yml`). Proses ini berjalan pada tiga keadaan:

- setiap ada push ke `main`,
- setiap ada pull request ke `main`,
- saat dijalankan manual.

Langkah mengunduh:

1. Buka repo di GitHub, lalu pilih tab **Actions**.
2. Pilih **Bangun APK** di kiri, lalu klik baris paling atas yang bertanda centang hijau.
3. Gulir ke bagian **Artifacts**, lalu klik **pintar-main-apk**. Yang terunduh berkas ZIP.
4. Buka ZIP itu, lalu kirim `app-release.apk` ke HP Android, misalnya lewat Google Drive atau kabel.
5. Di HP, buka berkas APK. Kalau diminta, izinkan "Pasang aplikasi tidak dikenal" untuk aplikasi pembuka berkas itu.
6. Ketuk **Pasang**, lalu buka **Pintar Main**.

Untuk menjalankan manual: buka tab Actions, pilih **Bangun APK**, tekan **Run workflow**, lalu pilih cabang.

Catatan:

- APK ini ditandatangani **kunci debug**. Cukup untuk diuji di HP sendiri, tetapi tidak bisa diunggah ke Play Store.
- Artifact disimpan 30 hari.

## B. Pengaturan lewat Variables

Buka **Settings → Secrets and variables → Actions → Variables**. Semua isian di bawah boleh dikosongkan.

| Nama | Isi | Bawaan |
|---|---|---|
| `EXPO_PUBLIC_DATA_MODE` | `lokal` atau `supabase` | `lokal` |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | dari proyek Supabase (lihat `CARA-MENYAMBUNG-SUPABASE.md`) | kosong |
| `EXPO_PUBLIC_TKA_BUKA` | tanggal Persiapan TKA dibuka, atau `mati` supaya langsung terbuka | `2027-01-04` |
| `EXPO_PUBLIC_FITUR_GURU` | `nyala` untuk menampilkan Kelola guru | mati |

## C. Expo Go (lihat tanpa memasang APK)

Variabel `EXPO_TOKEN` tidak tersedia di sesi pembangunan, jadi langkah ini belum dijalankan. Caranya:

1. Buat akun gratis di expo.dev.
2. Buat token di **Account settings → Access tokens**, lalu simpan sebagai secret repo bernama `EXPO_TOKEN`.
3. Di komputer yang sudah memasang Node 22, jalankan dari folder repo:
   ```
   npm ci
   npx eas-cli login
   npx eas-cli update:configure
   npx eas-cli update --branch preview --message "Pembangunan pertama"
   ```
4. Halaman Expo akan menampilkan kode QR. Pasang **Expo Go** dari Play Store, lalu pindai kode itu.

## D. Untuk Play Store (nanti)

`eas.json` sudah berisi dua profil:

- `preview`: menghasilkan APK.
- `production`: menghasilkan AAB untuk Play Store.

Perintahnya: `npx eas-cli build -p android --profile production`. Langkah ini butuh akun Expo, dan EAS akan membuatkan kunci tanda tangan resmi. Simpan kunci itu baik-baik.

Sebelum mengunggah ke Play Store, isi formulir **Kebijakan Keluarga** dan **Keamanan Data** dengan isi berikut:

- tanpa iklan,
- tanpa analytics,
- data anak: nama panggilan dan kelas saja, tersimpan di HP.

## E. Membangun di komputer sendiri

Butuh Node 22, Java 17, dan Android SDK.

```
npm ci
npx expo prebuild -p android --no-install
cd android && ./gradlew assembleRelease
```

Hasilnya ada di `android/app/build/outputs/apk/release/app-release.apk`.
