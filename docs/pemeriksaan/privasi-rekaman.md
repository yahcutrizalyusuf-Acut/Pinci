# Pemeriksaan privasi: rekaman suara anak dan Ceritakan Lagi

Tanggal: 11 Nov 2026. Pemeriksa: Claude (pemeriksa bebas). Acuan: CLAUDE.md aturan 1, 2, 12; rancangan 13 bagian 4.

Yang diperiksa: commit `4838337` ditambah perubahan yang **belum di-commit** di folder kerja saat pemeriksaan
(`src/layanan/rekaman.ts`, `src/app/ortu/waktu/[id].tsx`, `src/layanan/__tests__/rekaman.test.ts`, yaitu fungsi
`hapusAnak` untuk rekaman). Nomor baris mengikuti isi folder kerja itu.

## Ringkasan singkat

Dasarnya sudah baik. Rekaman dan alamat berkasnya tidak pernah masuk tabel data, antrean sinkron, atau server.
Tombol rekam hanya muncul bila Izin 8 menyala. Batas 20 detik dan 2 menit ada. Tidak ada tombol bagikan dan tidak
ada penilaian ucapan oleh mesin.

Celah yang perlu ditutup:

| No | Temuan | Tingkat |
|---|---|---|
| P1 | Rekaman yang terputus di tengah jalan tertinggal di folder sementara dan lolos dari semua aturan hapus | **penting** |
| P2 | Hapus profil anak tidak menghapus rekamannya (sudah diperbaiki di folder kerja, belum di-commit) | **penting** (sampai di-commit) |
| S1 | `allowBackup: false` tidak menghentikan pindah data antar-HP di Android 12 ke atas | **sedang** |
| S2 | Batas kenangan 5 **per anak**, padahal aturan dan teks Izin 8 berkata paling banyak 5 | **sedang** |
| S3 | Rekaman yatim (anak sudah dihapus, daftar rusak, gagal hapus) tidak pernah dibersihkan dan tidak terlihat orang tua | **sedang** |
| K1–K8 | Hal kecil (lihat bawah) | kecil |

---

## Jawaban enam pertanyaan

### 1. Bisakah rekaman atau alamat berkasnya bocor ke antrean, server, log, atau halaman staf?

**Tidak, untuk jalur biasa.**

- Catatan rekaman disimpan di `daftar.json` di folder pribadi aplikasi, bukan di SQLite: `src/layanan/rekaman.ts:51-91`.
  Tidak ada tabel `rekaman` di `NamaTabel`/`TABEL_SINKRON`: `src/data/jenis.ts:331`.
- Izin 8 disimpan di tabel `nilai` (`src/layanan/rekaman.ts:185-201`). Tabel `nilai` tidak ada di `TABEL_SINKRON`
  (`src/data/jenis.ts:331`) dan tidak ada di `TABEL_TARIK` (`src/data/repositori.ts:57`). `antrekan` menolak tabel di
  luar daftar: `src/data/repositori.ts:181`.
- Ceritakan Lagi hanya mengirim `adaRekaman` ya/tidak: `src/app/dampingi/cerita.tsx:92`, `src/data/repositori.ts:861-883`.
  Pengirim Supabase hanya memakai kolom yang terdaftar (`src/data/supabase.ts:41`, `barisServer` di `:107-117`),
  jadi kolom tambahan apa pun tidak ikut terkirim.
- Server: tabel `cerita_ulang` tidak punya kolom rekaman (`supabase/migrations/20261111000000_cerita_ulang.sql:5-20`),
  diuji di `20261111000100_uji_cerita_ulang.sql` (cek nama kolom). Aturan baca hanya untuk keluarga sendiri dan HP anak
  keluarga itu (`:31-34`). Tidak ada aturan baca untuk staf, pengawas, mitra, atau guru (bandingkan
  `20261101000000_kelas_pengawas.sql:258-260` yang hanya untuk sesi, jawaban, kemajuan_topik, pemakaian).
- Halaman staf (`src/app/staf/*`, `src/komponen/staf.tsx`) tidak menyebut rekaman atau cerita_ulang. Rapor yang membaca
  cerita_ulang hanya di mode orang tua: `src/app/ortu/(tab)/rapor.tsx:56`.
- Tidak ada `console.*` di kode rekaman.

Celah kecil: alamat berkas bisa masuk catatan teknis lewat pesan galat (K1).

### 2. Tombol rekam, mikrofon, tanda merekam, batas waktu

- Tombol rekam hanya dipasang bila Izin 8 menyala: `src/app/dampingi/cerita.tsx:129` dan `:160`,
  `src/app/dampingi/dengar.tsx:82-84` dan `:84-95`. Nilai bawaan `false` sampai terbaca (`useMuat(..., false)`),
  jadi gagal = tertutup. Izin 8 bawaan mati: `src/layanan/rekaman.ts:194-196`. Diuji di
  `src/app/dampingi/__tests__/rekam-izin8.test.tsx:59-75`.
- Layar Dampingi dan layar Izin 8 terkunci PIN: `src/app/dampingi/_layout.tsx` (`if (!ortuTerbuka) return <Redirect ...>`),
  `src/app/ortu/_layout.tsx`. Di HP anak yang dihubungkan, mode orang tua tidak ada, jadi Izin 8 tidak bisa dinyalakan di sana.
- Mikrofon baru menyala setelah tombol ditekan (`src/komponen/rekam/Perekam.tsx:96-105`). Mode rekam dimatikan lagi
  sesudah berhenti (`:83`).
- Tanda merekam: lingkaran merah berdenyut, waktu berjalan "Merekam… 0:05 / 0:20", dan kalimat "Mikrofon menyala"
  (`Perekam.tsx:139-144`). Jelas.
- Batas: 20 detik dan 120 detik (`src/fitur/rekaman.ts:30-42`), ditegakkan dua kali: `record({ forDuration })`
  (`Perekam.tsx:105`) dan pengecek waktu tiap 250 ms (`:110-114`).

Catatan: `Perekam` sendiri tidak memeriksa Izin 8, hanya bergantung pada layar (K5). Saat aplikasi kembali dari latar
belakang, perekam melanjutkan sendiri (K3).

### 3. Penghapusan

- 30 hari dan 50 MB: `src/fitur/rekaman.ts:61-84`, dijalankan saat aplikasi dibuka (`src/app/_layout.tsx:35-37`) dan
  setiap rekaman baru (`src/layanan/rekaman.ts:118`). Diuji.
- Cabut Izin 8 = semua terhapus: `src/layanan/rekaman.ts:199-201`, `hapusSemua` menghapus berkas dan folder (`:132-138`).
- Hapus semua data keluarga ikut menghapus rekaman: `src/app/ortu/(tab)/atur.tsx:95-96`.
- Profil anak lain tidak bisa memutar: Dengar Bedanya memakai `daftarAnak(anakId)` (`src/app/dampingi/dengar.tsx:59-64`,
  `src/fitur/rekaman.ts:95-97`). Ceritakan Lagi hanya memutar rekaman sesi itu sendiri.

Celah: P1, P2, S2, S3, K2, K4.

### 4. allowBackup, izin mikrofon, bagikan

- `"allowBackup": false` ada: `app.json:33`. Tetapi lihat S1 (pindah data antar-HP).
- Izin mikrofon diminta saat tombol rekam ditekan, bukan saat aplikasi dibuka: `Perekam.tsx:98`. Penolakan ditangani dengan
  ramah (`:145`). Teks izin HP: `app.json:53`. Latar belakang mati: `app.json:55-56` (jadi tidak ada izin
  `FOREGROUND_SERVICE_MICROPHONE` atau `POST_NOTIFICATIONS`).
- Tidak ada tombol bagikan atau ekspor. Tidak ada `Share`, `expo-sharing`, atau `Linking` untuk berkas di `src/`.
  Penyedia berkas dari expo-file-system tidak diekspor (`exported="false"`), dan izin penyimpanan luar diblokir
  (`app.json:28-29`).

### 5. Pustaka baru

`expo-audio ~58.0.10` dan `expo-file-system ~58.0.13` (`package.json:11,13`) adalah modul resmi Expo, MIT, tanpa iklan,
tanpa analitik, tanpa pengiriman data. Izin yang ditambahkan: `RECORD_AUDIO` (`app.json:19`) dan `MODIFY_AUDIO_SETTINGS`
(dari manifest expo-audio). expo-file-system menambah `INTERNET` (sudah ada) dan izin penyimpanan luar yang sudah diblokir.
**Aman untuk Kebijakan Keluarga Google Play.** Yang perlu disiapkan di Play Console: alasan izin mikrofon, dan formulir
Keamanan Data (rekaman hanya diproses di HP, tidak "dikumpulkan"). Lihat juga K7 soal catatan keputusan.

### 6. Penilaian ucapan oleh mesin

**Tidak ada.** Tidak ada pengenal suara, AI, atau `fetch` di `Perekam.tsx`, `layanan/rekaman.ts`, `fitur/rekaman.ts`,
`dampingi/cerita.tsx`, `dampingi/dengar.tsx`. Penilaian hanya tombol "Sudah mirip"/"Coba lagi" yang diketuk sendiri
(`src/app/dampingi/dengar.tsx:104-107`) dan tidak disimpan.

---

## Rincian temuan

### P1. Rekaman terputus tertinggal di folder sementara — **penting**

**Masalah.** expo-audio menulis rekaman lebih dulu ke folder sementara `cache/Audio/recording-<acak>.m4a`
(`node_modules/expo-audio/android/.../AudioRecorder.kt:278-294`). Berkas baru dipindah ke folder `rekaman/` di
`berhenti()` (`Perekam.tsx:75-94` → `src/layanan/rekaman.ts:75-80`). Kalau komponen hilang saat masih merekam, pembersih
hanya mematikan pengecek waktu (`Perekam.tsx:67-73`), tidak memanggil `stop()` dan tidak menghapus berkas sementara.
Ini mudah terjadi:

- Anak atau orang tua menekan **"Panel berikut"** atau "Sebelumnya" saat masih merekam. `Perekam` diberi `key={panel.id}`
  (`src/app/dampingi/cerita.tsx:132`; di Dengar Bedanya `key={`${panel.id}-${ulang}`}`), jadi perekam lama dilepas.
- Menekan "Selesai bercerita" saat cerita utuh sedang direkam (`cerita.tsx:147-163`).
- Menekan "Selesai" di kepala Mode Dampingi, atau Dampingi keluar sendiri.
- `berhenti()` gagal (`Perekam.tsx:91-92`) atau pemindahan berkas gagal.

Berkas suara anak itu **tidak tercatat di daftar**, jadi tidak ikut terhapus 30 hari, tidak ikut batas 50 MB,
**tidak terhapus saat Izin 8 dicabut** atau saat "Hapus semua rekaman" (`hapusFolder` hanya menghapus `rekaman/`,
`src/layanan/rekaman.ts:85-88`). Folder cache memang pribadi dan tidak dicadangkan, tetapi Android hanya mengosongkannya
kalau ruang HP sempit. Ini melanggar aturan 12 "Menarik Izin 8 = semua rekaman langsung dihapus".

**Saran perbaikan.**
1. Di `Perekam`, saat dilepas ketika `keadaan === 'merekam'`: panggil `perekam.stop()`, lalu hapus `perekam.uri`
   (jangan disimpan, karena anak tidak menekan berhenti). Simpan status merekam di `useRef` supaya terbaca di pembersih.
2. Di `berhenti()`, bila `tambah()` gagal, hapus berkas sementara.
3. Tambah `hapusSementara()` di `PenyimpanRekaman` yang menghapus `new Directory(Paths.cache, 'Audio')`, dan panggil dari
   `hapusSemua()` dan `rapikan()` (berkas di sana yang lebih tua dari beberapa menit pasti yatim).
4. Lebih rapi lagi: rekam langsung ke folder pribadi dengan `RecordingOptions.directory = 'document'` (ada di
   AudioRecorder.kt:284-286) supaya tidak ada salinan di cache.
5. Uji: lepas `Perekam` saat merekam → `stop` dipanggil dan berkas sementara dihapus.

### P2. Hapus profil anak tidak menghapus rekamannya — **penting sampai di-commit**

**Masalah.** Di commit `4838337`, `Repositori.hapusAnak` (`src/data/repositori.ts:654-669`) menghapus semua tabel anak,
tetapi rekaman ada di luar SQLite dan tidak ikut terhapus. Rekaman anak yang sudah dihapus juga tidak tampil di layar
Izin 8 karena daftar disusun per anak yang masih ada (`src/app/ortu/rekaman.tsx:92-94`). Kenangan yang disematkan akan
tinggal selamanya tanpa terlihat.

**Status.** Folder kerja sudah punya perbaikan **yang belum di-commit**: `GudangRekaman.hapusAnak`
(`src/layanan/rekaman.ts:140-147`), dipanggil di `src/app/ortu/waktu/[id].tsx:97`, dengan uji di
`src/layanan/__tests__/rekaman.test.ts:63-71`. Perbaikannya benar.

**Saran.** Commit perbaikan itu. Lalu (a) panggil `gudangRekaman().hapusAnak(id)` **sebelum** atau di dalam
`try/finally` bersama `repo.hapusAnak`, supaya galat di salah satu tidak meninggalkan rekaman; (b) tutup sisa celah lewat
S3 (pembersih yatim).

### S1. Pindah data antar-HP di Android 12+ tidak dihentikan oleh `allowBackup: false` — **sedang**

**Masalah.** `app.json:33` hanya memasang `allowBackup="false"`. Untuk aplikasi yang menargetkan Android 12 (API 31) ke
atas, `allowBackup=false` mematikan cadangan ke Google Drive, tetapi **pemindahan langsung antar-HP (device-to-device,
misalnya lewat kabel atau Pindahkan Data saat ganti HP) tetap berjalan** kecuali ada `android:dataExtractionRules`.
Folder `files/rekaman/` (tempat `Paths.document`) ikut terbawa ke HP baru. Aturan 12 meminta rekaman tidak ikut cadangan
Android; tujuannya jelas rekaman tidak keluar dari HP itu.

**Saran.** Buat plugin konfigurasi kecil (misal `plugins/tanpaPindahData.js`) yang menambah
`android:dataExtractionRules="@xml/aturan_ekstraksi"` dan `android:fullBackupContent="false"` di `<application>`, dengan
berkas `res/xml/aturan_ekstraksi.xml`:

```xml
<data-extraction-rules>
  <cloud-backup><exclude domain="root" path="."/><exclude domain="file" path="."/><exclude domain="database" path="."/><exclude domain="sharedpref" path="."/><exclude domain="external" path="."/></cloud-backup>
  <device-transfer><exclude domain="root" path="."/><exclude domain="file" path="."/><exclude domain="database" path="."/><exclude domain="sharedpref" path="."/><exclude domain="external" path="."/></device-transfer>
</data-extraction-rules>
```

Pasang di `plugins` `app.json`, lalu periksa `AndroidManifest.xml` hasil `npx expo prebuild` dan tambahkan uji yang
membaca app.json. Minimal kecualikan `file/rekaman/`; mengecualikan semuanya juga melindungi SQLite data anak.

### S2. Batas kenangan 5 per anak, bukan 5 total — **sedang**

**Masalah.** `bisaSematkan` menghitung sematan per anak (`src/fitur/rekaman.ts:86-92`), dan layar menulis "per anak"
(`src/app/ortu/rekaman.tsx:89`). Aturan 12 berkata "paling banyak 5 kenangan", rancangan 13 bagian 4.1 dan 4.2 berkata
"paling banyak 5 rekaman cerita utuh", dan **teks Izin 8 yang disetujui orang tua** juga berkata "paling banyak 5
rekaman" (`src/app/ortu/rekaman.tsx:23`). Dengan 3 anak, bisa ada 15 rekaman yang tidak pernah terhapus. Layar dan teks
izin saling bertentangan. Tidak ada catatan keputusan untuk "per anak" di `KEPUTUSAN-PEMBANGUNAN.md`.

**Saran.** Pilih salah satu dan tulis jelas:
- Ikuti aturan: ubah syarat di `src/fitur/rekaman.ts:91` menjadi `daftar.filter((x) => x.disematkan).length < 5`,
  ubah teks `rekaman.tsx:89` dan pesan `:115`, ubah uji `src/fitur/__tests__/rekaman.test.ts:29`.
- Atau tanyakan ke Acut dulu; kalau "per anak" disetujui, catat di `keputusan.md` dan ubah teks Izin 8 baris 23 menjadi
  "paling banyak 5 rekaman per anak".

### S3. Rekaman yatim tidak pernah dibersihkan — **sedang**

**Masalah.** Beberapa jalan membuat rekaman atau berkas tidak terhubung lagi:
- Rekaman anak yang sudah dihapus sebelum perbaikan P2, atau bila `gudangRekaman().hapusAnak` gagal setelah
  `repo.hapusAnak` berhasil (`src/app/ortu/waktu/[id].tsx:96-97`). Tidak tampil di layar Izin 8 (`rekaman.tsx:92-94`);
  yang disematkan tidak pernah terhapus.
- `daftar.json` rusak: `bacaDaftar` mengembalikan `[]` (`src/layanan/rekaman.ts:62-68`), lalu tulisan berikutnya menimpa
  daftar. Semua berkas `.m4a` di `rekaman/` menjadi yatim, tidak ikut 30 hari atau 50 MB.
- Berkas di `cache/Audio` (lihat P1).

**Saran.** Di `GudangRekaman.rapikan`, tambahkan langkah pembersih:
1. Terima daftar id anak yang masih ada (dari `repo.daftarAnak()`) dan hapus catatan rekaman milik anak yang tidak ada.
2. Daftar isi folder `rekaman/` dan hapus berkas yang tidak ada di `daftar.json` (kecuali `daftar.json` sendiri).
3. Bersihkan `cache/Audio` (P1).
Di layar Izin 8, tampilkan juga kelompok "Profil yang sudah dihapus" bila ada rekaman tanpa pemilik, supaya orang tua bisa
melihat dan menghapusnya.

### K1. Alamat berkas bisa masuk catatan teknis lewat pesan galat — **kecil**

Penangkap galat mengirim `galat.message` ke tabel `catatan_teknis` yang disinkron dan dibaca admin
(`src/layanan/galat.ts:18-34`, `src/data/repositori.ts:535-549`, `20261102000000_langganan_masukan.sql:153`). Galat dari
expo-file-system atau expo-audio biasanya memuat alamat `file:///data/user/0/id.pintarmain.app/files/rekaman/<id>.m4a`.
Beberapa janji tidak punya `.catch` (`src/app/dampingi/dengar.tsx:59-64`, `src/app/ortu/rekaman.tsx:116,120,130`,
`src/app/ortu/waktu/[id].tsx:97`). Di web penolakan tak tertangani ditangkap (`galat.ts:46`). Isinya hanya alamat
dengan id acak, bukan suara, tetapi tetap "alamat berkas rekaman sampai ke staf".

Saran: di `catatTeknis`, ganti setiap `file://…`, `content://…`, `blob:…` dengan `[berkas]`
(`ringkas.replace(/(file|content|blob):\S+/g, '[berkas]')`), dan beri `.catch(() => undefined)` pada janji di atas.

### K2. Pencabutan Izin 8 atau hapus semua data yang gagal di tengah tidak diulang — **kecil**

`aturIzin8` menulis "mati" lebih dulu, baru menghapus (`src/layanan/rekaman.ts:199-201`); `atur.tsx:95-96` mengosongkan
data (termasuk Izin 8) lalu menghapus rekaman. Kalau penghapusan berkas gagal, Izin 8 sudah mati tetapi rekaman masih ada,
dan tidak ada yang mengulang. Saran: di `rapikan`, kalau Izin 8 mati dan daftar tidak kosong, panggil `hapusSemua()`.
(Perlu `repo` sebagai parameter `rapikan`.)

### K3. Perekam lanjut sendiri setelah aplikasi kembali dari latar belakang — **kecil**

Dengan rekam latar belakang mati, expo-audio menjeda saat aplikasi ke latar belakang lalu **melanjutkan sendiri** saat
kembali (`AudioModule.kt:478-516`, `AudioRecorder.kt:171-182`). Tanda merekam tetap tampil, jadi masih bisa diterima,
tetapi mikrofon menyala lagi tanpa ketukan baru, dan waktu di layar dihitung dari jam dinding sehingga bisa langsung
berhenti. Saran: dengarkan `AppState`; saat ke latar belakang, panggil `berhenti()` (simpan yang sudah terekam) supaya
mikrofon hanya menyala dari ketukan.

### K4. Penghapusan otomatis hanya saat aplikasi dibuka dari awal — **kecil**

`rapikan()` dipanggil sekali di `src/app/_layout.tsx:35-37` (dan saat rekaman baru). Android sering menyimpan aplikasi
di memori berhari-hari, sehingga rekaman bisa tersimpan lebih dari 30 hari. Layar Izin 8 lalu menampilkan "terhapus dalam
0 hari". Saran: panggil juga saat `AppState` menjadi `active` dan saat layar Izin 8 dibuka.

### K5. `Perekam` tidak memeriksa Izin 8 sendiri — **kecil**

Penjaga hanya di layar (`cerita.tsx:129,160`, `dengar.tsx:82-84`). Layar baru yang memakai `Perekam` bisa lupa. Saran:
di `rekam()`, baca `izin8Nyala(repo)` dulu dan tolak bila mati; atau buat uji yang mencari semua pemakai `<Perekam`
dan memastikan ada syarat `izin8`.

### K6. Dua perekam bisa jalan bersamaan di panel terakhir — **kecil**

Di panel terakhir Ceritakan Lagi ada perekam kalimat dan perekam cerita utuh (`cerita.tsx:131-141` dan `:160-165`).
Keduanya bisa ditekan bersamaan. Saran: nonaktifkan yang lain saat satu sedang merekam (angkat status ke `Alur`).

### K7. Catatan keputusan belum diperbarui — **kecil**

`KEPUTUSAN-PEMBANGUNAN.md:10` (keputusan no. 4) masih berkata izin rekaman suara diblokir di `app.json`, padahal sekarang
`RECORD_AUDIO` diizinkan (`app.json:19`). Belum ada catatan pemeriksaan pustaka `expo-audio` dan `expo-file-system`
(aturan 1 meminta setiap pustaka diperiksa). Saran: tambah keputusan baru: izin mikrofon dibuka hanya untuk Dengar Bedanya
dan Ceritakan Lagi di balik Izin 8; kedua pustaka modul resmi Expo, MIT, tanpa jaringan dan pelacak.

### K8. Data Ceritakan Lagi di server — **kecil (catatan)**

Yang dikirim: komik, tanggal, 4 centang, kata target yang dicentang, dan `ada_rekaman` (`src/data/supabase.ts:41`).
Tidak ada data pribadi baru dan hanya keluarga sendiri yang bisa membaca. `ada_rekaman` sebenarnya tidak dipakai rapor
server dan hanya memberi tahu bahwa anak pernah merekam. Kalau ingin lebih minim, kolom ini bisa disimpan di HP saja.
Tidak wajib.

---

## Yang sudah baik (tidak perlu diubah)

- Rekaman tidak pernah di tabel data; daftar rekaman dan Izin 8 tidak masuk antrean atau tarikan.
- Daftar kolom server tegas, diuji dengan pemeriksaan nama kolom di SQL.
- Izin mikrofon diminta saat pertama menekan rekam; penolakan tidak menghalangi Ceritakan Lagi.
- Tanda merekam jelas; batas waktu ditegakkan dua lapis.
- Tidak ada bagikan atau ekspor; penyedia berkas tidak diekspor; penyimpanan luar diblokir.
- Profil anak lain tidak bisa memutar rekaman di Dengar Bedanya.
- Tidak ada penilaian ucapan oleh mesin.
