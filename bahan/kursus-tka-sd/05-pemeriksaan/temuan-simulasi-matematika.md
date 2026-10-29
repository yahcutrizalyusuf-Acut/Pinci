# Temuan Pemeriksaan Mutu — Simulasi Matematika 1–3

Diperiksa: 17 September 2026 · Pemeriksa: agen pemeriksa mutu (hanya membaca, tidak mengubah berkas).

Berkas: `01-modul-matematika/M08-simulasi-1.md`, `M14-simulasi-2.md`, `M20-simulasi-3.md`, `simulasi/S1-matematika.md`, `S2-matematika.md`, `S3-matematika.md`.

Alat:
- `_alat/periksa.py` (3 modul): Periksa benar 69, SALAH 0, galat 0, format 0, tanpa hitungan 1 (M20 Terbimbing 1, memang penalaran).
- `_alat/periksa.py --simulasi`: S1 54/0, S2 54/0, S3 52/0 (1 lewati: S3 butir 3, penalaran).
- Verifikasi independen: `05-pemeriksaan/verifikasi/verif_simulasi_S1_S3.py` (tidak memakai baris `Periksa` penulis; kunci diturunkan dari hitungan sendiri, lalu dicocokkan dengan kunci hasil parse berkas; ditambah cek tabel kunci ringkas, pemetaan, tabel Halaman 2, peta soal Halaman 5, bobot, bentuk, panjang kalimat).

---

## Tabel ringkas

| Butir | Lolos/Tidak | Berkas bermasalah | Rincian |
|---|---|---|---|
| 1 Struktur 7 halaman | Lolos | — | Ketiga modul punya Halaman 1–7 dengan judul persis spesifikasi Bagian 7 |
| 2 Alur tepat 100 menit | Lolos dengan catatan | M08, M14, M20 | Jumlah menit tepat 100, ujian 7–82 = 75 menit. Menit 5–7 terlalu padat (T-2.1) |
| 3 Halaman 5: 12 soal 5/4/3 teracak | Lolos | — | Blok sesuai peta Bagian 6; 8 ● / 4 ○; ● per kelompok 4/2/2; nomor 1 bukan "hari ini"; sebaran huruf PG ≤ 4 |
| 4 Setiap soal/butir punya kunci | Lolos | — | 90 butir + 36 soal + 9 tiket + 6 terbimbing, semua berkunci; contoh jadi punya "Jawaban" |
| 5 Bobot, bentuk, isi sesuai label | **Tidak** | S3, S2, M14 | Bobot dan bentuk 18/6/6 persis peta. Tetapi 4 butir menguji isi yang **tidak diajarkan** di modul topiknya (T-5.1, T-5.2) |
| 7 Nol isian/uraian/menjodohkan | Lolos | (M14) | Nol. Satu kalimat soal berbau isian (T-7.1, kecil) |
| 8 Nol Peluang, nol Aljabar | Lolos | — | Tidak ada. Satu alasan pengecoh memakai bilangan negatif (T-16.8) |
| 9 Istilah & notasi | **Tidak** (ringan) | semua | "sesi", "Lihat bacaan A" vs format baku, pilihan tidak urut, urutan huruf stimulus, "sisi miring" pada segitiga tak siku-siku (T-9.1–T-9.6) |
| 10 Tiga salah paham hal. 1 dibongkar hal. 4 | Lolos | — | Ketiganya ada dan dibongkar satu per satu di ketiga modul, termasuk 3 keadaan (panik, berhenti di satu soal, selesai lebih awal) |
| 11 Contoh jadi polos | Lolos | — | Tidak ada perintah menjelaskan di Halaman 3. **Catatan integritas**: contoh jadi menit 5–7 membocorkan butir ujian (T-X.3) |
| 13 Tiket 3 soal + ambang | Lolos dengan catatan | M08, M14, M20 | Ada, kembaran 3 butir tersulit. Ambang menyimpang kecil dari spesifikasi Bagian 8 (T-13.1) |
| 14 Kalimat membantu tanpa mengambil alih | Lolos | — | Ketiganya hanya bertanya lalu mendengarkan |
| 15 Nol peringkat/umumkan skor/hadiah/janji angka | Lolos | — | Skor hanya disampaikan berdua ke orang tua, dibandingkan dengan diri sendiri; larangan tertulis eksplisit |
| **16 Kebenaran matematika** | **Lolos kunci; Tidak untuk ambiguitas** | S1, S2, S3, M20 | **141 kunci diverifikasi, 0 salah.** 4 butir ambigu (satu bisa punya dua jawaban), 1 bangun tak mungkin, 5 alasan pengecoh keliru (T-16.x) |
| 17 Bahasa anak 11 tahun | Lolos dengan catatan | S2, S3, M14 | 1 kalimat 13 kata; beberapa kalimat janggal (T-17.1) |
| Tambahan: soal sama/nyaris sama | **Tidak** (sebagian) | S1, S2, S3 | 1 butir menyalin contoh jadi M12; 8 kelompok butir isomorfik antarpaket/dalam paket (T-X.1) |
| Tambahan: kesulitan setara TKA | Lolos dengan catatan | S1 terutama | ±1/3 butir satu langkah tanpa stimulus; paket lebih ringan dari tempo 2,5 menit (T-X.2) |

**Catatan berkas induk (di luar berkas yang diperiksa):** `01-spesifikasi-program.md` baris 242 dan 289 merujuk "peta spiral Bagian 5" untuk bobot simulasi, padahal bobot ada di `02-peta-spiral.md` **Bagian 6**. Modul sudah memakai Bagian 6 dengan benar. Usul: ganti kedua rujukan menjadi "Bagian 6".

---

## Butir 16 — Kebenaran matematika (paling penting)

### Ringkasan verifikasi

| Berkas | Diverifikasi | Kunci salah | Ambigu / bermasalah |
|---|---|---|---|
| S1 | 30 butir | 0 | Butir 2 (dua jawaban mungkin), butir 13 pernyataan 3 |
| S2 | 30 butir | 0 | Butir 12 (konteks bertentangan dengan pilihan) |
| S3 | 30 butir | 0 | Butir 29 (persen sebagai berat), butir 15 (daya beda), butir 24 (mengulang 23) |
| M08 | 12 soal + 3 tiket + 2 terbimbing + 2 contoh jadi | 0 | — |
| M14 | 12 soal + 3 tiket + 2 terbimbing + 2 contoh jadi | 0 | — |
| M20 | 12 soal + 3 tiket + 2 terbimbing + 2 contoh jadi | 0 | Soal 3 (segitiga tak mungkin) |
| **Jumlah** | **141 kunci** (+ 6 hitungan contoh jadi) | **0** | 7 |

Tabel `Kunci ringkas` (huruf, topik, bentuk) cocok 90/90 dengan kunci di butir. Tabel `Pemetaan analisis kesalahan`, tabel analisis per anak di Halaman 2 ketiga modul, dan `Peta soal` Halaman 5 (lambang, kelompok, bentuk) cocok semua. Sebaran kunci PG: S1 A5·B5·C4·D4 · S2 A5·B5·C4·D4 · S3 A3·B5·C5·D5 (sesuai klaim berkas). Semua PG kompleks punya 2–3 jawaban benar; semua PG kategori punya minimal satu Benar dan satu Salah.

### T-16.1 · S1 butir 2 — soal FPB bisa dijawab 60 (serius)

- **Berkas/baris:** `S1-matematika.md` baris 61.
- **Kutipan:** "Koperasi punya 24 pensil dan 36 penghapus. Semua dimasukkan ke kantong. Isi setiap kantong sama."
- **Masalah:** "Isi setiap kantong sama" tidak mengharuskan setiap kantong berisi pensil **dan** penghapus dalam banyak yang sama. Anak yang teliti bisa membuat 60 kantong berisi 1 barang (isinya sama: satu barang). Pilihan C (60) jadi bisa dibela. Kunci B hanya benar dengan tafsiran FPB.
- **Usulan:** pakai pola yang sudah benar di M08 Soal 3: "Semua pensil dan penghapus dimasukkan ke kantong. Setiap kantong berisi banyak pensil yang sama. Setiap kantong juga berisi banyak penghapus yang sama." Hapus juga "Lihat bacaan A" karena butir ini tidak memakai daftar harga.

### T-16.2 · S1 butir 13 pernyataan 3 — "antara" ambigu

- **Baris:** 280. **Kutipan:** "Antara pukul 07.00 dan 08.00, bus B lewat 3 kali."
- **Masalah:** Bus B lewat pukul 07.00, 07.18, 07.36, 07.54. Kalau 07.00 dihitung, jawabannya 4 kali (Salah). Kunci memakai tafsiran tanpa 07.00 (Benar).
- **Usulan:** "Sesudah pukul 07.00 sampai sebelum 08.00, bus B lewat 3 kali."

### T-16.3 · S2 butir 12 — konteks bertentangan dengan pilihan

- **Baris:** 252. **Kutipan:** "Setiap cabang membentuk dua sudut bersebelahan di sisi jalan."
- **Masalah:** Dua sudut bersebelahan pada jalan lurus **pasti** berjumlah 180°. Jadi pasangan A, C, E (jumlah 90° dan 190°) tidak mungkin muncul dari cerita itu. Anak yang membaca konteks bisa bingung.
- **Usulan:** buang kalimat konteks: "Kak Rafli menulis lima pasang sudut di papan. Pilih **semua** pasangan sudut yang **berpelurus**."

### T-16.4 · S3 butir 29 — persen disebut sebagai berat

- **Baris:** 573–578. **Kutipan:** "Pilih **semua** bentuk yang sama dengan berat tepung yang dipakai (dalam kg)." Pilihan D "75%".
- **Masalah:** 75% bukan besaran berat. Anak yang teliti bisa menolak D, lalu salah karena tidak ada nilai sebagian.
- **Usulan:** "Pilih **semua** bilangan yang sama dengan 0,6 × 1 1/4." Kunci tetap B, D, E.

### T-16.5 · M20 Halaman 5 Soal 3 — segitiga dengan "sisi miring" lebih pendek dari alas

- **Baris:** 354. **Kutipan:** "Alasnya 16 m dan tingginya 9 m. Sisi miringnya 12 m."
- **Masalah:** "Sisi miring" di SD dipahami sebagai sisi terpanjang segitiga siku-siku. Sisi miring 12 m lebih pendek dari alas 16 m, jadi tidak mungkin untuk segitiga siku-siku. Segitiga tak siku-siku dengan ukuran itu memang ada, tetapi istilahnya menyesatkan.
- **Usulan:** pakai ukuran siku-siku yang sah: "Alasnya 16 m dan tingginya 12 m. Sisi miringnya 20 m." Kunci menjadi Rp96.000; pengecoh: 48 (keliling) → Rp48.000, 16 × 20 : 2 = 160 → Rp160.000, lupa bagi dua → Rp192.000.

### T-16.6 · S3 butir 15 — kunci sama dengan baris "Depan" denah

- **Baris:** 307–318. **Masalah:** Tampak depan (3, 1, 1) kebetulan sama persis dengan baris Depan denah. Anak yang hanya menyalin baris depan tetap benar, jadi butir tidak membedakan paham dan tidak paham. Pilihan C ("dua kolom saja: 3 dan 2") juga jawaban butir 16A.
- **Usulan:** ganti denah menjadi Belakang 3, 1, 0 · Depan 2, 1, 1 (8 kubus tetap). Tampak depan 3, 1, 1 ≠ baris depan (2, 1, 1). Sesuaikan butir 16: tampak samping kanan "dua kolom setinggi 2 dan 3". Sesuaikan juga pilihan dan alasan pengecoh butir 14 (baris depan saja = 4) dan butir 15 (A = baris belakang 3, 1, 0), serta M20 Halaman 4 Penjelasan alternatif 2 langkah 1.

### T-16.7 · S3 butir 24 mengulang butir 23 pernyataan 4

- **Baris:** 466, 479–493. **Masalah:** Butir 23(4) sudah menguji selisih (jawabannya 4), dan butir 22 + 23(2) memberi 20 dan 16. Butir 24 hanya meminta selisih yang sama.
- **Usulan:** ubah butir 24 menjadi perubahan yang menuntut hitungan baru: "4 anak laki-laki baru masuk kelas 6B. Berapa perbandingan laki-laki dan perempuan sekarang?" (20 : 20 = 1 : 1; pengecoh 8 : 5, 5 : 4, 4 : 5).

### T-16.8 · Alasan pengecoh yang keliru (kunci tidak terpengaruh)

| Berkas · butir · baris | Tertulis | Masalah | Usulan |
|---|---|---|---|
| S3 · 21 · 432 | B — "(3 − 5)/(4 − 6) = 1" | Memakai bilangan negatif, di luar SD; anak tidak akan menghitung begitu | "B — hanya bilangan cacah yang dikurangi: 2 − 1 = 1, pecahan diabaikan" |
| S3 · 30 · 603 | B — "lebar dihitung 70 − 20 = 50" | Kalau lebar 50, luasnya 1.000, bukan 50 | Ganti pilihan B menjadi 1.000, atau alasan "B — menjawab 70 − 20 = 50 sebagai luas" |
| S3 · 14 · 301 | B (6) — "setiap kotak dihitung satu kubus" | Kotak berisi kubus ada 5, bukan 6; alasan A (5) dan B tumpang tindih | "B — kotak kosong ikut dihitung satu kubus (6 kotak)" |
| S3 · 11 · 240 | C (100) — "keliling dan luas tertukar" | Jumlah dua diagonal bukan keliling | "C — kedua diagonal dijumlahkan, bukan dikalikan" |
| S1 · 27 · 578 | A — "membandingkan selisih pembilang dan penyebut" | Selisih 1, 4, 5 diurutkan naik memberi B, bukan A | "A — selisih terbesar dikira isi paling sedikit (5, 4, 1)" |

---

## Butir 5 — Isi butir tidak sesuai yang diajarkan di topik labelnya

Bobot per topik (S1 7 topik, S2 12 topik, S3 17 topik) dan komposisi PG 18 · PG kompleks 6 · PG kategori 6 **persis** peta spiral Bagian 6 di ketiga paket (dicek skrip). Masalahnya ada pada **isi**.

### T-5.1 · S3 butir 11 (label M11) — luas layang-layang dan dm² tidak pernah diajarkan

- **Baris:** 226–242. **Kutipan:** "Panjang diagonalnya 60 cm dan 40 cm." · "Luasnya sama dengan 12 dm²."
- **Masalah:** M11 hanya mengajarkan keliling dan luas segitiga, jajargenjang, trapesium, dan bangun gabungan (M11 baris 21). Kata "layang-layang" dan "diagonal" tidak ada di M01–M19. Satuan luas dm² juga tidak ada di M09 maupun M11. Butir ini menguji dua hal yang belum diajarkan, sehingga kode B di butir ini tidak bisa ditindaklanjuti dengan soal tambal M11.
- **Usulan:** ganti dengan trapesium: "Taman berbentuk trapesium. Sisi sejajarnya 12 m dan 18 m. Tingginya 8 m." Pilih semua yang benar: A. Luasnya 240 m² (lupa bagi dua) · B. Luasnya 120 m² ✓ · C. Luasnya 38 m² (dijumlah) · D. Luasnya 144 m² (hanya sisi sejajar terpanjang × tinggi: 18 × 8) · E. Luasnya sama dengan luas persegi panjang 15 m × 8 m ✓. Kunci B, E.

### T-5.2 · S2 butir 27, S3 butir 25, M14 Tiket 3 (label M13) — pembulatan desimal tidak diajarkan

- **Baris:** S2 537–560 ("dibulatkan ke satuan terdekat" untuk 2,45; 3,62; 1,46) · S3 496–512 ("Dibulatkan ke persepuluhan terdekat, luasnya 9,7 m²") · M14 571–585 (1,48 + 2,37 ke satuan).
- **Masalah:** M13 baris 21 menetapkan sasaran "membulatkan bilangan ke **puluhan, ratusan, atau ribuan** terdekat". Pembulatan desimal ke satuan tidak pernah dicontohkan, dan "persepuluhan" tidak ada di M13 maupun `03-standar-istilah.md`. S3 butir 25 juga menuntut perkalian desimal 2,48 × 3,9 (tiga angka di belakang koma), yang tidak ada di M01–M13.
- **Usulan:** pertahankan konsep "bulatkan di akhir, bukan di tengah", tetapi pakai bilangan cacah. Contoh S2 butir 27: tabel berat sampah **245 kg, 362 kg, 146 kg**, pernyataan "Jumlah dibulatkan ke ratusan terdekat adalah 700 kg" (Salah: 753 → 800), "Jumlah sebenarnya 753 kg" (Benar), dst. Contoh S3 butir 25: "Panjang papan 248 cm, lebar 39 cm" dengan pembulatan ke ratusan/ribuan cm². Ubah M14 Tiket 3 dengan pola yang sama (148 + 237, ke ratusan).
- **Catatan tambahan S3 butir 25:** "Panjangnya 2,48 m dan lebarnya 3,9 m" — panjang lebih pendek dari lebar. Tukar kedua angka.

### T-5.3 · S1 butir 9 (label M03) — juga menuntut M05 (ringan)

- **Baris:** 201–216. **Masalah:** Untuk tahu bagian jagung, anak harus menghitung 1 − (1/3 + 1/4 + 1/8) — itu M05, dan persis sama dengan butir 10 (M05). Kalau anak salah di butir 9, pengajar tidak tahu apakah M03 atau M05 yang gagal (standar soal aturan 10, "satu soal = satu kemampuan").
- **Usulan:** ubah pertanyaan menjadi "Di antara cabai, tomat, dan bayam, tanaman apa yang lahannya **paling luas**?" dengan pilihan tiga tanaman + satu pengecoh "tomat dan cabai sama luas".

---

## Butir 2 — Alur 100 menit

Jumlah menit ketiga modul tepat 100: 0–5 baca cepat · 5–7 aturan · 7–82 ujian (75) · 82–85 jeda · 85–88 kunci + contoh jadi 2 · 88–93 kode · 93–95 penutup analisis · 95–99 tiket · 99–100 penutup. Sisa waktu di papan pada menit 22, 37, 52, 67 benar (60/45/30/15). Patokan nomor soal (menit 37 → nomor 12, menit 52 → nomor 18) benar.

### T-2.1 · Menit 5–7 terlalu padat (M08 baris 89, 147; M14 baris 75, 138; M20 baris 76, 140)

- **Masalah:** dalam 2 menit pengajar harus mengumpulkan teks, membacakan `Petunjuk ujian` (6 paragraf), memperagakan Contoh jadi 1 (±60 detik), menjalankan Terbimbing 1 dengan papan jawaban, dan anak menulis nama. Realistisnya ±4–5 menit. Modul sendiri menandai [ASUMSI].
- **Usulan:** pindahkan Terbimbing 1 ke awal pertemuan Matematika sesudahnya (M09/M15/M21, sebelum kuis), atau pindahkan Contoh jadi 1 ke menit 33–40 pertemuan sebelum simulasi (M07/M13/M19) seperti cadangan yang sudah ditulis M08 baris 147. Menit 5–7 cukup berisi petunjuk ujian.

---

## Butir 7, 9, 13, 17 — Temuan ringan

### T-7.1 · M14 Halaman 5 Soal 10 — kalimat berbau isian

- **Baris:** 468. **Kutipan:** "Bentuk desimal dari 8% adalah?"
- **Masalah:** pola "… adalah?" meniru soal isian titik-titik; standar soal aturan 2 meminta kalimat tanya.
- **Usulan:** "Apa bentuk desimal dari 8%?"

### T-9.1 · Kata "sesi" (dilarang; baku "pertemuan")

- **Baris:** M08 102, M14 88, M20 89. **Kutipan:** "Kalau orang tua menolak sesi 100 menit".
- **Usulan:** "Kalau orang tua menolak pertemuan 100 menit". (Judul "Naskah sesi" tetap, karena judul halaman dipakai persis spesifikasi.)

### T-9.2 · Rujukan stimulus tidak mengikuti format baku

- **Baris:** mis. S1 44, 78, 202; S2 143, 182; S3 129, 288, 440 (semua butir bergrup).
- **Kutipan:** "Lihat bacaan A."
- **Masalah:** `04-standar-soal.md` Bagian 7: "Setiap butir menulis 'Berdasarkan teks <huruf>, …'". Pemeriksa otomatis/pembangkit lembar anak bisa mengandalkan pola ini.
- **Usulan:** ganti semua menjadi "Berdasarkan teks A, …" (atau ubah standar soal kalau "Lihat bacaan A" memang dipilih — tetapi satu saja).

### T-9.3 · Pilihan angka tidak urut kecil ke besar (standar soal, aturan pengecoh 4)

| Berkas · butir · baris | Urutan sekarang | Usulan urutan |
|---|---|---|
| S2 · 5 · 117–121 | 2.649 · 2.650 · 2.719 · 2.751 · 2.695 | 2.649 · 2.650 · 2.695 · 2.719 · 2.751 (kunci menjadi B, C, D) |
| S2 · 10 · 220–224 | 5/8 · 4/7 · 2/3 · 6/11 · 7/10 | 6/11 · 4/7 · 5/8 · 2/3 · 7/10 (kunci menjadi C, D, E) |

Kalau diubah, perbarui `Kunci ringkas`, `Periksa`, dan M14 Halaman 4 bila merujuk huruf.

### T-9.4 · Urutan huruf stimulus S3 melompat

- **Baris:** S3 10, 278, 435. **Kutipan:** "A: butir 6–8 · C: butir 14–16 · B: butir 22–24".
- **Usulan:** tukar huruf: susunan kubus = **Stimulus B** (butir 14–16), kelas 6B = **Stimulus C** (butir 22–24). Perbarui rujukan "bacaan B/C" di butir, M20 Halaman 1 baris 39, Halaman 4 baris 261 dan 264.

### T-9.5 · Spasi sebelum %

- **Baris:** S1 628. **Kutipan:** "300/8 % = 37,5%". **Usulan:** "300/8% = 37,5%" atau "3/8 × 100% = 37,5%".

### T-9.6 · "Sisi miring" pada segitiga yang bukan siku-siku

- **Baris:** M20 354 (lihat T-16.5). **Usulan:** pakai segitiga siku-siku bertiga-angka sah, atau ganti kata menjadi "sisi yang lain".

### T-13.1 · Ambang tiket menyimpang kecil dari spesifikasi Bagian 8

- **Baris:** M08 604–606, M14 591–593, M20 616–618.
- **Masalah:** (1) baris 3 dari 3 menulis "Catat 3 di lembar Tiket Keluar", spesifikasi menulis "Catat hijau muda"; (2) baris 0–1 tidak memuat aturan "Dua kali berturut-turut merah → pengajar menelepon orang tua malam itu".
- **Usulan:** tambahkan kalimat itu di baris 0–1 ketiga modul, dan pakai "Catat hijau muda (3) di lembar Tiket Keluar".

### T-17.1 · Bahasa

| Berkas · baris | Kutipan | Masalah | Usulan |
|---|---|---|---|
| S2 · 481 | "Ia membeli 2 kg bawang merah, 750 g cabai, dan 1,25 kg tomat." | 13 kata (> 12) | "Ia membeli 2 kg bawang merah dan 750 g cabai. Ia juga membeli 1,25 kg tomat." |
| S3 · 226 | "Layang-layang Haikal berbentuk layang-layang." | Kalimat berulang, membingungkan | Lihat T-5.1 (butir diganti) |
| S2 · 408 | "Jarak lari Dafa 175% dari 1 km." | Persen jarak janggal untuk anak | "Dafa berlari 175% dari jarak 1 km." |
| S2 · 252 | "Setiap cabang membentuk dua sudut bersebelahan di sisi jalan." | Sulit dibayangkan tanpa gambar | Lihat T-16.3 |
| M14 · 483 | "Harga satu buku gambar Rp398." | Harga tidak wajar 2026 (spesifikasi Bagian 10) | "Harga satu buku tulis Rp4.980. Kelas membeli 21 buku. Harga dibulatkan ke ribuan, banyak buku ke puluhan." (taksiran 5.000 × 20 = Rp100.000) |
| S3 · 590 | "Keliling lapangan badminton di Kajhu 70 m. Panjang lapangan 20 m." | Lapangan badminton sebenarnya ±13 m × 6 m | "Keliling halaman meunasah di Kajhu 70 m." |

---

## Tambahan — Soal sama/nyaris sama, kebocoran, dan tingkat kesulitan

### T-X.1 · Butir yang sama atau nyaris sama

Angka dan nama berbeda, tetapi **konteks, langkah, dan pengecohnya identik**. Untuk membandingkan S1 → S2 → S3 ini wajar sebagian; yang bermasalah adalah salinan contoh jadi dan pasangan dalam satu paket.

| # | Butir | Kemiripan | Tingkat | Usulan |
|---|---|---|---|---|
| 1 | **S2 butir 2** (baris 50) ↔ **M12 Contoh jadi** (M12 baris 172) ↔ S3 butir 18(3) | Soal persis sama: "pukul 04.30", jawaban 45°, pengecoh 60° "jarum pendek dianggap tetap". Anak yang ingat contoh jadi menjawab tanpa berpikir | **Serius** | Ganti S2 butir 2 ke jam lain yang belum dipakai, mis. pukul 10.30 (135°; pengecoh 150° jarum pendek tetap, 120°, 225°) |
| 2 | S1 butir 8 (174) ↔ S1 butir 28 (582) — **dalam satu paket** | Sisa uang sesudah "pecahan + desimal"; pengecoh sama (pecahan dikira 0,14/0,25; desimal dikira %; jawab yang terpakai). S3 butir 17 dan S2 butir 30 memakai pola yang sama | Sedang | Ganti S1 butir 28 dengan M07 bentuk lain, mis. membandingkan harga "0,4 kg Rp14.000" dan "1/4 kg Rp9.000" per kg |
| 3 | S1 butir 4 (100) · S1 butir 29 (599) · S2 butir 11 (235) · S3 butir 12 (245) | "Berapa kali pecahan masuk"; pengecoh A dibalik yang salah, B lupa membalik, C pecahan campuran terlupa. S2-11 dan S3-12 hampir kembar | Sedang | S3 butir 12 diganti pembagian dengan konteks sisa, mis. "2 3/4 L dibagi ke gelas 1/3 L. Berapa gelas **penuh**?" (8 gelas) |
| 4 | S1 butir 25 (531) ↔ S3 butir 21 (419) | Pengurangan pecahan campuran dengan meminjam; pengecoh sama (dikurangi terbalik, dijumlah) | Ringan | S3 butir 21 diubah ke PG kategori perbandingan dua jarak + selisih |
| 5 | S1 butir 27 (565) ↔ S3 butir 1 (33) ↔ M08 Soal 12 | "Botol/toples sama besar terisi …", mengurutkan/mencari terbesar | Ringan | S3 butir 1: bandingkan dengan patokan 1/2 ("siapa yang lebih dari setengah?") |
| 6 | S1 butir 26 (548) ↔ S3 butir 19 (380); juga S1-13, S2-21 | KPK kejadian berulang; pengecoh FPB/jumlah/hasil kali persis sama | Ringan | S3 butir 19: tanya "berapa kali bersamaan dalam 120 hari?" (2 kali) |
| 7 | S1 butir 24 (502) ↔ S2 butir 4 (84) | PG kategori "bagian anak" desimal/pecahan/persen dari n anak; salah paham 0,5→5% dan 1/4→0,14 | Ringan | S2 butir 4 ubah jadi mengurutkan tiga bagian lalu satu pernyataan banyak anak |
| 8 | S1 butir 16 (335) ↔ S3 butir 26(3) (523) | "Tas Rp80.000" potongan | Ringan | Ganti barang/harga di S3 (mis. sepatu Rp120.000) |
| 9 | M14 Contoh jadi 1 (M14 144) ↔ S2 butir 15 (313) | Pilihan luas/keliling persegi panjang dengan pengecoh "sekali dijumlah" dan satuan tertukar — diperagakan **2 menit sebelum** butir 15 dikerjakan | Sedang | Lihat T-X.3 |

### T-X.2 · Tingkat kesulitan dibanding TKA (berstimulus, ±2,5 menit)

| Paket | Penilaian singkat |
|---|---|
| **S1** | Paling ringan. ±11 butir satu langkah tanpa stimulus yang selesai < 1 menit (4, 6, 7, 16, 18, 25, 26, 27, 29, 30, dan 2). Tiga stimulus bergrup baik (koperasi, kebun, resep). Perkiraan waktu kerja ±50–55 menit, jadi latihan "tahan duduk 75 menit" belum teruji. Usul: jadikan 4–5 butir pendek berstimulus dua langkah (mis. butir 6 dan 30 diberi tabel dan pertanyaan lanjutan). |
| **S2** | Sedang. Stimulus A (perjalanan) dan B (halaman meunasah) setara TKA. Butir pendek: 14, 18, 22, 23, 25 (butir 25 sangat mudah, ±30 detik). Butir 15–17 saling membocorkan (luas 360 dan 24 muncul di 15 dan 16, lalu dipakai di 17). Usul: butir 17 minta biaya rumput Rp5.000/m², bukan luas. |
| **S3** | Paling mendekati TKA: 3 stimulus, bangun ruang, denah, rasio. Butir pendek: 4, 12, 13, 19, 27, 28. Beberapa butir saling membocorkan (22 → 23(2) → 24; 15C = 16A). |

Semua penilaian **[ASUMSI — belum diuji pada anak]**; data waktu nyata dari pojok soal di M08 bisa dipakai untuk menguji.

### T-X.3 · Contoh jadi menit 5–7 membocorkan cara dan isi butir ujian

- **M20 baris 146–158:** Contoh jadi 1 memakai **nomor butir S3 yang asli** beserta isinya: "8 (PG kategori tentang luas kaca …), 14 (denah kubus: berapa banyak kubus …), 23 (PG kategori rasio …), 27 (luas permukaan kotak kado …)". Langkah 3 (yang **diucapkan** di menit 5–7): "Nomor 14 hanya menjumlahkan angka di denah." Itu cara menjawab butir 14 yang dibacakan sebelum ujian.
- **M14 baris 144–153:** Contoh jadi 1 (luas 216 m² / keliling 30 m / keliling 60 m / luas 60 m²) berpola sama dengan S2 butir 15, dan langkah 3 diucapkan di menit 5–7.
- **M08 baris 153–166:** Contoh jadi 1 "2/5 bagian … lalu 0,25 dari sisa" dekat dengan S1 butir 8/28 (bedanya: di S1 dari uang awal). Ringan.
- **Usulan:** (1) M20: ganti nomor dan isi dengan soal fiktif yang tidak ada di S3 ("nomor 5 tabel suhu, nomor 11 skala, nomor 19 KPK, nomor 26 persen"), dan jangan menyebut cara menyelesaikannya — cukup urutan putaran kedua. (2) M14: ganti soal Contoh jadi 1 ke topik yang tidak diuji dalam bentuk sama di S2, mis. PG kompleks faktor 36 ("pilih semua faktor 36").

---

## Daftar perbaikan menurut prioritas

1. **S1 butir 2** — kalimat FPB yang membuka jawaban 60 (T-16.1).
2. **S2 butir 2** — salinan contoh jadi M12 (T-X.1 no. 1).
3. **S3 butir 11** — layang-layang dan dm² belum diajarkan (T-5.1).
4. **S2 butir 27, S3 butir 25, M14 Tiket 3** — pembulatan desimal belum diajarkan (T-5.2).
5. **M20 Contoh jadi 1** — membocorkan butir 14 S3 sebelum ujian (T-X.3).
6. **S3 butir 29, S1 butir 13(3), S2 butir 12, M20 Soal 3** — ambiguitas (T-16.2–T-16.5).
7. **S3 butir 15 dan 24** — daya beda lemah / mengulang (T-16.6, T-16.7).
8. Sisanya: istilah, urutan pilihan, alasan pengecoh, bahasa, ambang (T-9, T-13, T-16.8, T-17).

**Ringkasan butir 16:** 141 kunci diverifikasi independen (90 butir paket + 36 soal Halaman 5 + 9 tiket + 6 terbimbing) ditambah 6 hitungan contoh jadi. **Kunci salah: 0.** Tabel kunci ringkas dan pemetaan: 0 selisih. Butir ambigu/bangun bermasalah: 7. Alasan pengecoh keliru: 5.

---

## Tindak lanjut perbaikan

Dikerjakan 17 September 2026 oleh agen perbaikan. Hanya enam berkas yang disunting: M08, M14, M20, S1, S2, S3. Semua butir yang diubah dihitung ulang dengan Python; Kunci, Petunjuk, Langkah, alasan pengecoh, Periksa, `Kunci ringkas`, dan sebaran kunci ikut disesuaikan. Kode topik (Kelompok) dan bentuk soal tidak berubah (18/6/6 per paket).

| Temuan | Diperbaiki (ya/tidak) | Yang diubah |
|---|---|---|
| T-16.1 S1 butir 2 (60 bisa dibela) | ya | Kalimat pola M08 Soal 3 (banyak pensil sama, banyak penghapus sama); "Lihat bacaan A" dihapus; alasan C diperjelas |
| T-X.1 no. 1 S2 butir 2 (salinan contoh jadi M12) | ya | Pukul 10.30 → 135°; pilihan 120° · 135° · 150° · 225°; kunci tetap B |
| T-5.1 S3 butir 11 (layang-layang, dm²) | ya | Trapesium siku-siku 16 m, 24 m, tinggi 15 m, sisi miring 17 m (angka beda dari M11 Terbimbing 2); luas 300 m², keliling 72 m; kunci A, E |
| T-5.2 S2 butir 27 | ya | Bilangan cacah 245, 362, 146 kg; pembulatan ke ratusan; kunci tetap 1-S, 2-B, 3-B, 4-S |
| T-5.2 S3 butir 25 | ya | Papan 248 cm × 39 cm = 9.672 cm²; ke ratusan/ribuan; kunci A, C, E; panjang > lebar |
| T-5.2 M14 Tiket 3 | ya | 148 kg + 237 kg, dibulatkan ke ratusan → 400 kg; kunci tetap D |
| T-X.3 M20 Contoh jadi 1 | ya | Nomor dan isi rekaan (6, 12, 21, 29), bukan butir S3; tanpa denah dan tanpa cara menjawab |
| T-X.3 M14 Contoh jadi 1 | ya | Diganti PG kompleks faktor 36 (A, C, D) |
| T-X.3 M08 Contoh jadi 1 | ya (tidak diganti isinya) | Tidak lagi diperagakan tepat sebelum ujian (lihat T-2.1); S1 butir 28 sudah berbeda pola |
| T-2.1 Menit 5–7 terlalu padat | ya, dengan catatan | Menit 5–7 hanya petunjuk ujian di ketiga modul; Contoh jadi 1 + Terbimbing 1 dipindah ke menit 33–40 M07/M13/M19 **[PERLU DICEK — modul itu belum memuatnya; di luar berkas yang boleh disunting]** |
| T-16.2 S1 butir 13(3) | ya | "Sesudah pukul 07.00 sampai sebelum 08.00" |
| T-16.3 S2 butir 12 | ya | Kalimat konteks jalan dibuang |
| T-16.4 S3 butir 29 | ya | "Pilih semua bilangan yang sama dengan 0,6 × 1 1/4" |
| T-16.5 / T-9.6 M20 Soal 3 | ya | Segitiga siku-siku 16, 12, 20 m; Rp96.000; kunci tetap B |
| T-16.6 S3 butir 15 | ya | Denah Belakang 3, 1, 0 · Depan 2, 1, 1; pilihan C = baris depan; butir 14 (A = 4), butir 16 (2 dan 3), M20 Penjelasan alternatif 2 disesuaikan |
| T-16.7 S3 butir 24 | ya | 4 anak laki-laki masuk → 1 : 1; kunci A; M20 Halaman 1 salah paham 2 disesuaikan |
| T-16.8 alasan pengecoh (5) | ya | S1-27 A diperbaiki; S3-14 B diperbaiki; S3-30 B diperbaiki; S3-11 dan S3-21 butirnya diganti (alasan baru tanpa bilangan negatif) |
| T-5.3 S1 butir 9 | ya | Hanya cabai, tomat, bayam; pengecoh D "tomat dan cabai sama luas" |
| T-X.1 no. 2 S1 butir 28 | ya | 25% dari uang buku (2/5 × Rp200.000) = Rp20.000; M08 Tiket 3 kini dinyatakan kembaran butir 8; M08 Halaman 4 merujuk butir 28 |
| T-X.1 no. 3 S3 butir 12 | ya | 2 3/4 L : 1/3 L → 8 gelas penuh; kunci C |
| T-X.1 no. 4 S3 butir 21 | ya (tetap PG) | Kekurangan dari target 5 km = 5/12 km; tidak diubah ke PG kategori supaya bentuk 18/6/6 tetap |
| T-X.1 no. 5 S3 butir 1 | ya | Patokan 1/2: hanya 5/9 lebih dari setengah; kunci A |
| T-X.1 no. 6 S3 butir 19 | ya | "Dalam 150 hari ke depan, berapa kali lagi" → 2 (150 dipilih supaya batas tidak ambigu); kunci B |
| T-X.1 no. 7 S2 butir 4 | ya | Pernyataan urutan, banyak anak diantar mobil, dan perbandingan becak–jalan kaki; kunci tetap |
| T-X.1 no. 8 S3 butir 26(3) | ya | Sepatu Rp120.000 |
| T-X.1 no. 9 M14 Contoh jadi 1 | ya | Lihat T-X.3 |
| T-X.2 S1 tingkat kesulitan | sebagian | Butir 6 dan 30 jadi dua langkah; catatan kesulitan + saran memakai menit selesai ditambahkan di S1; butir lain tidak ditambah stimulus |
| T-X.2 S2 butir 17 | ya | Ditanya biaya rumput Rp5.000/m² (Rp1.680.000) |
| T-X.2 S3 saling membocorkan | sebagian | 15C ≠ 16A dan butir 24 tidak lagi mengulang 23(4); 22 → 23(2) tetap (butir bergrup) |
| T-7.1 M14 Soal 10 | ya | "Apa bentuk desimal dari 8%?" |
| T-9.1 "sesi" | ya | "pertemuan 100 menit" di M08, M14, M20 |
| T-9.2 "Lihat bacaan" | ya | Semua menjadi "Berdasarkan teks <huruf>, …" di S1–S3 |
| T-9.3 urutan pilihan S2 butir 5 dan 10 | ya | Diurutkan; kunci B, C, D dan C, D, E |
| T-9.4 huruf stimulus S3 | ya | Kubus = B (14–16), kelas 6B = C (22–24); rujukan M20 Halaman 1 dan 4 disesuaikan |
| T-9.5 spasi sebelum % | ya | Langkah S1 butir 30 ditulis ulang |
| T-13.1 ambang tiket | ya | "Catat hijau muda (3)" + kalimat "Dua kali berturut-turut merah → pengajar menelepon orang tua malam itu" di ketiga modul |
| T-17.1 bahasa (6) | ya | S2-24 dipecah; S2-20 "Dafa berlari 175% dari jarak 1 km"; M14 Soal 11 buku tulis Rp4.980 (Rp100.000); S3-30 halaman balai desa; S3-11 dan S2-12 lihat di atas; dua kalimat baru > 12 kata dipecah (S1-9, S3-8) |
| Tambahan koordinator: "Benar-Salah" | ya | M14 Halaman 4 pancingan 3 memakai kalimat baku "tentukan Benar atau Salah untuk setiap pernyataan"; tidak ada di berkas lain |
| Catatan berkas induk (spesifikasi "Bagian 5") | tidak | Di luar berkas yang boleh disunting |

**Hasil alat sesudah perbaikan.** `_alat/periksa.py` (M08, M14, M20): benar 69, SALAH 0, galat 0, format 0, nol temuan. `_alat/periksa.py --simulasi`: S1 54/0, S2 54/0, S3 52/0 (1 lewati: butir 3, penalaran), nol temuan. Sebaran kunci PG: S1 A5·B5·C4·D4 · S2 A5·B5·C4·D4 · S3 A5·B5·C5·D3. `Kunci ringkas` cocok 90/90 (cek skrip).

**Catatan skrip verifikasi.** `verifikasi/verif_simulasi_S1_S3.py` menyimpan angka butir lama, jadi melaporkan "SALAH" pada butir yang diganti (S1-28, S2-2, S2-17, S3-1, 11, 12, 19, 21) dan berhenti di S3-24 (pilihan rasio). Itu selisih dengan versi lama, bukan kunci salah. Skrip perlu diperbarui pemeriksa bila ingin dijalankan ulang.
