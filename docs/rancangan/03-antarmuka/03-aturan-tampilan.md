# Aturan Tampilan untuk Anak 6–12 Tahun dan HP Murah

**Ringkas:** (1) Tombol anak dibuat **jauh lebih besar dari batas umum Android (48dp)**: ≥ 64dp untuk kelas 1–2 dan ≥ 56dp untuk kelas 3–6. Sebab anak 7–10 tahun meleset pada ± 30% sasaran berukuran 6,4 mm, dan makin muda anak, makin besar sasaran yang dibutuhkan. (2) Satu temuan mengoreksi rancangan sebelumnya: **mode gelap bukan pilihan terbaik untuk malam**. Pada malam hari, tampilan terang justru menghasilkan kinerja membaca lebih baik. Karena itu bawaan aplikasi adalah tema terang yang lembut (latar krem, tidak putih menyilaukan), dengan mode gelap sebagai pilihan. (3) Tidak ada musik latar dan tidak ada animasi di layar soal, sebab suara dan hiasan yang tidak berhubungan dengan pelajaran terbukti menurunkan hasil belajar.

Tahap 4, butir 3. Disusun 19 Oktober 2026. Label: **[FAKTA + sumber] · [ESTIMASI] · [ASUMSI — diuji di purwarupa]**.

---

## 1. Ukuran tombol dan sasaran sentuh

| Temuan | Sumber |
|---|---|
| Batas umum Android: sasaran sentuh ≥ 48 × 48dp, berjarak ≥ 8dp | **[FAKTA — Bantuan Aksesibilitas Android]** |
| Anak 7–10 tahun meleset ± 30% pada sasaran 6,4 mm (0,25 inci); sasaran 3,2 mm meleset ± separuh pada semua umur | **[FAKTA — Anthony dkk. 2013, 44 anak 6–17 tahun]** |
| "Makin muda anak, makin besar sasaran yang dibutuhkan"; perluas area aktif supaya sentuhan yang sedikit meleset tetap terhitung; hindari sasaran kecil di tepi layar; beri umpan balik yang jelas supaya anak tidak mengetuk ulang | **[FAKTA — Anthony dkk., ringkasan 5 tahun proyek MTAGIC, IJHCS 2019]** |
| Hindari seret-lepas (drag-and-drop) dan cubit-perbesar untuk anak | **[FAKTA — sama]** |

| Unsur | Kelas 1–2 | Kelas 3–6 | Orang tua | Dasar |
|---|---|---|---|---|
| Tombol utama (Mulai, Aku siap, Kirim) | Tinggi ≥ 72dp, selebar layar | ≥ 64dp, selebar layar | ≥ 48dp | **[ASUMSI]** diturunkan dari temuan di atas; diuji dengan anak sendiri |
| Tombol papan angka | ≥ 72 × 64dp | ≥ 64 × 56dp | — | sama |
| Pilihan jawaban (PG, kartu jalur) | ≥ 64dp tinggi | ≥ 56dp | ≥ 48dp | sama |
| Jarak antartombol | ≥ 12dp | ≥ 8dp | ≥ 8dp | Android ≥ 8dp; lebih lega untuk anak kecil |
| Area aktif | Diperluas ± 8dp di luar bentuk tombol | sama | — | MTAGIC: sentuhan meleset biasanya dekat sasaran |
| Tepi layar | Tombol penting tidak diletakkan sebagai sasaran kecil di tepi; tombol lebar sampai tepi diperbolehkan | sama | — | MTAGIC |
| Gerakan | Hanya ketuk; tanpa seret, geser rumit, atau cubit | Ketuk + gulir biasa | Bebas | MTAGIC |
| Ketukan ganda | Ketukan kedua di tempat sama dalam ± 0,3 detik diabaikan | sama | — | MTAGIC: ketukan tertinggal |

**Tombol berbahaya untuk anak** (masuk Mode Dampingi, pengaturan) justru dibuat **kecil dan pucat** di pojok, dan selalu dilindungi PIN.

---

## 2. Huruf dan teks

| Temuan | Sumber |
|---|---|
| Andika: huruf yang dirancang untuk program literasi dan pembaca pemula; lisensi terbuka (SIL OFL), gratis | **[FAKTA — Wikipedia, Andika (typeface)]** |
| Sejumlah peneliti menyebut ukuran yang nyaman dibaca di layar mulai ± 14 poin; pada anak 10–12 tahun (huruf Arab) ukuran 16–18 lebih terbaca daripada yang lebih kecil | **[FAKTA — Abubaker & Lu 2012, Univ. Huddersfield]**; data untuk huruf Latin anak 6–8 tahun tidak ditemukan |

| Unsur | Kelas 1–2 | Kelas 3–4 | Kelas 5–6 | Orang tua |
|---|---|---|---|---|
| Huruf | Andika | Andika | Andika | **Nunito** (diubah 28 Okt; dulu huruf bawaan sistem) |
| Judul dan logo | Baloo 2 | Baloo 2 | Baloo 2 | Baloo 2 |
| Soal Lancar | 44sp | 40sp | 36sp | — |
| Teks Baca Ulang | 26sp, jarak baris 1,6 | 22sp, 1,5 | 20sp, 1,5 | — |
| Teks soal TKA | — | — | 18sp, 1,5 | — |
| Petunjuk dan label | 20sp | 18sp | 16sp | 16sp |
| Panjang baris teks bacaan | ≤ 30 huruf | ≤ 40 huruf | ≤ 50 huruf | — |

Semua ukuran **[ASUMSI]**, diuji dengan anak kelas 4 dan kelas 6 Acut di HP murah pada minggu pertama purwarupa. Ukuran huruf **mengikuti setelan besar huruf di HP** sampai 1,3× tanpa merusak tata letak.

| Aturan bahasa | Contoh |
|---|---|
| Kalimat pendek, kata sehari-hari, tanpa istilah Inggris | "Lanjut nanti", bukan "Resume later" |
| Ikon selalu bersama kata (kecuali kelas 1–2, yang dibantu suara) | 🔢 Lancar |
| Tidak ada kata yang mempermalukan | Tidak memakai "Salah!", "Gagal", "Payah" |
| Angka besar dan jelas; tanda bagi ":"; desimal dengan koma | 0,5 dan 25 : 5 |

---

## 3. Warna dan tema

| Temuan | Sumber |
|---|---|
| Pada pengguna berpenglihatan normal, tampilan terang (huruf gelap di latar terang) umumnya menghasilkan kinerja lebih baik; **pada malam hari tampilan terang juga lebih baik**, dan huruf kecil jauh lebih sulit dibaca di mode gelap pada malam hari | **[FAKTA — Nielsen Norman Group, Feb 2020]** |
| Tetap sarankan menyediakan pilihan mode gelap | **[FAKTA — sama]** |
| Kontras teks biasa ≥ 4,5 : 1 (standar aksesibilitas WCAG) | **[FAKTA — WCAG 2.x]** |

| Aturan | Isi | Sebab |
|---|---|---|
| **Bawaan: tema terang lembut** | Latar krem hangat, bukan putih murni; teks hampir hitam | Terang lebih baik untuk membaca, juga di malam hari; krem mengurangi silau di kamar remang **[ASUMSI]** |
| Mode gelap | Pilihan di Pengaturan, bukan bawaan | Sebagian anak dan orang tua menyukainya |
| Kecerahan | Mengikuti kecerahan HP; aplikasi tidak memaksa terang penuh | — |
| Kontras | Teks ≥ 4,5 : 1; angka soal ≥ 7 : 1 | WCAG; HP murah sering redup |
| Benar dan salah | **Tidak hanya warna**: hijau + ✓ + bunyi; salah: kotak bergetar + jawaban benar tampil | Sebagian anak laki-laki buta warna merah-hijau **[ASUMSI — prevalensi umum, tidak dicari ulang]** |
| Warna bagian | **Diubah 28 Okt mengikuti merek Pintar Main:** Matematika Biru Laut, Bahasa Indonesia Merah Bata, Bahasa Inggris Ungu Anggur, Dampingi Oranye Jeruk, Gudang Ilmu Hijau Daun, TKA memakai warna mapel + lencana (`04-identitas-merek.md` bagian 3) | Anak mengenali bagian tanpa membaca |
| Teks di atas warna merek | Tombol hijau dan oranye memakai **teks Biru Tinta `#2D3142`, bukan putih** (putih hanya 2,1–2,7 : 1); teks hijau memakai Hijau Tua `#1F7A4D` | WCAG ≥ 4,5 : 1 |
| Hindari | Merah untuk "belum latihan" atau "turun level" | Tidak menekan anak atau memancing orang tua mengontrol |

**Koreksi rancangan sebelumnya:** `02-rancangan/01-arsitektur.md` bagian 4, `01-produk/07` bagian 4, dan kertas kerja penilaian mandiri menyebut "mode gelap untuk malam". Berdasarkan temuan di atas, ketiganya diubah menjadi "tema terang lembut sebagai bawaan, mode gelap pilihan, jam tenang".

---

## 4. Suara

| Temuan | Sumber |
|---|---|
| Musik latar dan suara tambahan yang tidak berhubungan dengan pelajaran menurunkan ingatan dan kemampuan menerapkan; kelompok yang hanya mendengar penjelasan lebih unggul | **[FAKTA — Moreno & Mayer 2000]** |

| Aturan | Isi |
|---|---|
| Petunjuk bersuara | Kelas 1–2: semua petunjuk dibacakan otomatis. Kelas 3–6: tombol 🔊 untuk memutar |
| **Tanpa musik latar** | Di semua layar latihan; game (R4) boleh punya musik yang bisa dimatikan |
| Efek suara | Hanya untuk umpan balik (benar, selesai, kartu), ≤ 0,5 detik, bisa dimatikan |
| Tanpa suara | Semua yang dibacakan juga tertulis; aplikasi bisa dipakai dengan suara mati (misal saat adik tidur) |
| Volume | Mengikuti HP; tidak ada suara keras tiba-tiba |
| Suara contoh Baca Ulang | Suara buatan yang sudah diperiksa Acut (`01-produk/03` bagian 5); kecepatan bisa diperlambat untuk kelas 1–2 |

---

## 5. Animasi dan gerak

| Temuan | Sumber |
|---|---|
| Hiasan menarik yang tidak berhubungan dengan tujuan belajar (teks, gambar, suara, animasi) menurunkan hasil belajar ("seductive details") | **[FAKTA — Learning Scientists, meringkas meta-analisis 72 perbandingan (Sundararajan 2018)]** |

| Aturan | Isi |
|---|---|
| **Layar soal tanpa animasi hiasan** | Tidak ada maskot bergerak, latar bergerak, atau konfeti di K6, K14, K16, K18. **Pinci** di layar ini diam dan kecil; ekspresi "berpikir" muncul hanya saat "Bantu aku" ditekan (`04-identitas-merek.md` bagian 2) |
| Transisi antarlayar | ≤ 250 milidetik, sederhana (geser atau pudar) |
| Perayaan | Hanya di layar akhir, ≤ 1,5 detik, bisa dilewati |
| Animasi yang mengajar | Boleh, kalau bagian dari pelajaran (misal langkah jurus muncul bertahap, kata disorot mengikuti suara) |
| Setelan HP "hapus animasi" | Diikuti: semua animasi menjadi perubahan langsung |
| Target kelancaran | Bergerak mulus di HP 2 GB **[ASUMSI — diuji di HP murah]** |

---

## 6. HP murah dan keadaan di rumah

| Batas | Aturan | Dasar |
|---|---|---|
| RAM | Diuji di HP 2 GB | Android (Go edition) untuk Android 13 berjalan di RAM minimum 2 GB **[FAKTA — developer.android.com]** |
| Layar | Tata letak untuk layar 5,5–6,7 inci, resolusi 720p ke atas | **[ASUMSI]** HP murah yang umum |
| Huruf | Andika disertakan di aplikasi | Jalan tanpa sinyal |
| Gambar | Gambar kartu dan ikon dikompresi; tanpa video di R1–R3 | Ukuran aplikasi dan kuota |
| Orientasi | Tegak saja | Lebih mudah untuk anak; sesuai pegangan satu tangan |
| Layar menyala | Layar tidak mati sendiri selama lembar berjalan | Anak membaca soal tanpa menyentuh |
| Gangguan | Tombol kembali Android → Jeda, bukan keluar | `02-kerangka-layar.md` K6 |
| Malam | Tema terang lembut; jam tenang untuk game | Bagian 3 |
| HP bersama | Pilih profil besar dengan hewan; PIN opsional | `02-rancangan/02` bagian 6 |

---

## 7. Daftar periksa tampilan sebelum uji keluarga

| # | Periksa | Cara | Bukti |
|---|---|---|---|
| 1 | Anak kelas 4 dan kelas 6 Acut menyelesaikan lembar tanpa salah ketuk lebih dari 1 kali | Diamati Acut | Catatan + video layar |
| 2 | Anak kelas 1–2 (dari keluarga Acut atau kenalan, setelah profil risiko ditetapkan) bisa mulai latihan tanpa dibacakan orang tua | Diamati | Catatan |
| 3 | Semua teks lolos kontras 4,5 : 1 | Alat pemeriksa kontras | Laporan |
| 4 | Huruf 1,3× tidak merusak tata letak | Setelan HP | Tangkapan layar |
| 5 | Aplikasi mulus di HP 2 GB | HP murah | Catatan waktu buka dan pindah layar |
| 6 | Bisa dipakai tanpa suara | Suara dimatikan | Catatan |
| 7 | Tidak ada animasi hiasan di layar soal | Diperiksa per layar | Daftar layar |
