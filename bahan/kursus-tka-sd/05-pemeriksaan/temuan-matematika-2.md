# Temuan Pemeriksaan Mutu — Matematika 2 (M15–M19, M21–M24, S4)

Diperiksa: 17 September 2026 · Pemeriksa: agen mutu (hanya membaca, tidak mengubah modul).
Berkas: `01-modul-matematika/` M15, M16, M17, M18, M19, M21, M22, M23, M24, dan `simulasi/S4-matematika-akhir.md`.
Skrip verifikasi independen: `05-pemeriksaan/verifikasi/verif_M15_M24_S4.py` (jalankan dengan `PYTHONIOENCODING=utf-8 python verif_M15_M24_S4.py`).

## 0. Hasil pemeriksa struktur (`_alat/periksa.py`)

| Berkas | Soal | Periksa benar | SALAH | galat/format | tanpa hitungan |
|---|---|---|---|---|---|
| M15 | 21 | 27 | 0 | 0 | 0 |
| M16 | 21 | 25 | 0 | 0 | 0 |
| M17 | 21 | 27 | 0 | 0 | 0 |
| M18 | 21 | 27 | 0 | 0 | 0 |
| M19 | 21 | 22 | 0 | 0 | 1 (Soal 10) |
| M21 | 22 | 29 | 0 | 0 | 0 |
| M22 | 22 | 29 | 0 | 0 | 0 |
| M23 | 21 | 43 | 0 | 0 | 0 |
| M24 | 17 | 21 | 0 | 0 | 2 (Terbimbing 1–2) |
| S4 (`--simulasi`) | 30 | 53 | 0 | 0 | 0 |

Pemeriksa struktur tidak melaporkan pelanggaran struktur, menit, komposisi, tiket, kata terlarang, atau contoh jadi. Semua temuan di bawah berasal dari pembacaan dan verifikasi independen.

## 1. Tabel ringkas

| Butir | Hasil | Berkas bermasalah | Rincian singkat |
|---|---|---|---|
| 1 Struktur 7 halaman | Lolos (catatan) | M23, M24 | Urutan 7 halaman sama di semua modul. Rujukan teks baca cepat masih berupa `T34-….md` / `T35-….md` tanpa nama berkas |
| 2 Alur menit | Lolos (catatan) | M24 | Semua modul 45 menit, M24 100 menit sesuai Bagian 6. M24 menyebut "Terbimbing 1 dan 2 tidak dikerjakan" padahal keduanya tidak punya slot di tabel menit |
| 3 Komposisi 12 soal | Lolos | — | 5/4/3, 8 ● (4/2/2), nomor 1 bukan "hari ini", tidak ada 3 berurutan, sebaran kunci ≤ 4 |
| 4 Kunci jawaban | Lolos | — | 217 blok soal, semuanya punya Kunci, Petunjuk, Langkah, alasan pengecoh |
| 5 Peta spiral | Lolos (catatan) | M21, M22, M23, S4 | Kuis, minggu lalu (termasuk pembagian 2/1/1), bulan lalu, dan isi soal cocok dengan P22–P35. S4 cocok dengan bobot Bagian 6 (12/12/6; PG 18 · kompleks 6 · kategori 6). M21–M23 tidak menulis baris "Uji tunda Mxx" |
| 6 Keterulangan | (dilewati) | — | — |
| 7 Bentuk soal | Lolos | — | Nol isian, uraian, menjodohkan |
| 8 Cakupan domain | Lolos (catatan) | S4 | Nol Peluang, nol Aljabar, nol median/modus sebagai materi. S4 Butir 26 memakai "data di tengah setelah diurutkan" hanya sebagai alasan pengecoh |
| 9 Keseragaman istilah | **Tidak** | M23, M24, S4, M16, M17, M19, M15, M21 | "Benar-Salah" dipakai sebagai nama bentuk (6 tempat); "sisi berimpit" tanpa "yang" (11 baris); "lajur" bersaing dengan "kolom"; notasi `2×2×2=8` dan `1000`; "12.30" untuk menit ujian; "hari-orang"; singkatan "BELAKNG" |
| 10 Tiga salah paham | Lolos | — | Ada di halaman 1 dan dibongkar satu per satu di halaman 4 (M24: versi simulasi) |
| 11 Contoh jadi polos | Lolos | — | Tidak ada perintah menjelaskan; anak "melihat dan mendengar, tidak ditanya" |
| 12 Baca cepat | (dilewati) | — | — |
| 13 Tiket keluar | Lolos (catatan) | M24 | 3 soal + ambang di semua modul. M24: tiket disebut "kembaran" butir 5 (PG kategori), tetapi Tiket 1 berbentuk PG; soal tambal "nomor 9 untuk Tiket 3" bukan soal berbalik nilai |
| 14 Laporan orang tua | Lolos | — | Semua punya kalimat cara membantu tanpa mengambil alih |
| 15 Larangan | Lolos | — | Nol papan peringkat, hadiah, gaya belajar, janji angka, trik bermerek. M24 hanya menyebut skor per anak secara pribadi, tanpa perbandingan |
| 16 Kebenaran matematika | **Lolos untuk kunci** (catatan pengecoh) | M21, M22, M23, M24, S4 | 215 blok soal + 36 contoh jadi/kartu/soal pemeriksa dihitung ulang: **0 kunci salah**. Ada 3 alasan pengecoh yang hitungannya tidak cocok, 6 soal diagram/piktogram yang pengecohnya "kebetulan benar", dan beberapa baris `Periksa` lemah |
| 17 Bahasa | **Tidak** (ringan) | M21, M22, M18, M15, S4, M15–M22 | Label "kelompok A/B/C", "perahu A/B/C" bertabrakan dengan huruf pilihan; beberapa kalimat soal > 12 kata; satu soal ● berisi 3 kalimat sebelum pertanyaan; naskah menyebut topik soal padahal kolom sebelahnya melarang |

## 2. Temuan rinci

Urutan: paling berdampak lebih dulu. Semua usulan hanya usulan; modul tidak diubah.

### 2.1 Butir 16 — Kebenaran matematika

**Kunci jawaban: nol yang salah.** Temuan di bawah menyangkut alasan pengecoh dan daya diagnosis pengecoh.

| # | Berkas · baris | Kutipan | Masalah | Usulan perbaikan |
|---|---|---|---|---|
| 16-1 | M22 · 417 (Soal 1) | "B — membulatkan ke ratusan, lalu dibulatkan ke bawah; C — membulatkan ke ratusan terdekat" | 3.749 ke ratusan terdekat = **3.700** (angka puluhan 4 < 5), bukan 3.800. Jadi alasan C salah, dan B serta C memakai alasan yang memberi angka sama | "B — membulatkan ke ratusan terdekat, bukan ke ribuan; C — pembulatan berantai: 3.749 → 3.750 → 3.800" |
| 16-2 | S4 · 346 (Butir 16) | "A — menghitung gambar tanpa kunci (13 gambar × 3.000)" | Piktogram berisi 12 ■ + 2 □ = **14 gambar** → Rp42.000, bukan Rp39.000 | Ganti pilihan A menjadi **Rp42.000** dengan alasan "14 gambar × Rp3.000, kunci piktogram diabaikan" |
| 16-3 | M23 · 211 (Terbimbing 1) | "D — pembilang dan penyebut ditulis berjejer lalu diberi tanda persen" | 2 dan 5 ditulis berjejer menjadi **25%**, bukan 2,5% | Ganti pilihan D menjadi **25%**, atau ubah alasan D menjadi "2/5 ditulis 2,5 (pembilang–koma–penyebut) lalu diberi tanda persen" |
| 16-4 | M21 · 256–275 (Terbimbing 2) | Ditanya jumlah Senin + Rabu = 50; batang **Selasa = 50** | Anak yang salah membaca hari (salah paham 3) justru mendapat jawaban benar. Pengajar tidak bisa melihat salah pahamnya | Ubah Selasa menjadi 40 (4 baris); pilihan D menjadi 90 (jumlah tiga hari) |
| 16-5 | M21 · 483–503 (Soal 4) | Selisih B − C = 6; batang **C = 6** | Anak yang menjawab nilai C saja mendapat jawaban benar | Ubah C menjadi 4 (2 baris); kunci 8; pilihan 4 (selisih baris 6 − 2) · 8 · 12 (B saja) · 16 (B + C) |
| 16-6 | M21 · 201–222 (Terbimbing 1) | Selisih Selasa − Rabu = 12; **Senin = 12** | Salah baris tetap benar | Senin 4 gambar (16 buku) |
| 16-7 | M22 · 616–643 (Soal 12) | Jawaban 30 = batang **M4 = 30** | Anak yang hanya membaca M4 mendapat jawaban benar | M1 menjadi 10 (2 baris): kunci 55 − 20 = 35; pilihan disusun ulang (baris: (5 + 6) − (2 + 2) = 7 · 20 · 35 · 75) |
| 16-8 | M23 · 372–398 (Soal 1) | Minggu − Sabtu = 40; **Jumat = 40** | Salah batang tetap benar | Jumat menjadi 20 atau 80 |
| 16-9 | M24 · 443–469 (Soal 8) | Iqbal − Rizki = 15; **Dafa = 15** | Salah batang tetap benar | Dafa menjadi 20 |
| 16-10 | M15 · 457–460 (Soal 6, pernyataan 4 Salah) | `> **Periksa:** \`50 * 30 == 1500\`` | Menurut 04-standar-soal 3.4, pernyataan Salah ditulis dengan `!=`/`not`. Baris ini bernilai True untuk pernyataan Salah, jadi tidak memeriksa apa pun | Hapus, atau tulis `50 * 30 == 1500` di Langkah dan `Periksa: tidak ada hitungan` untuk bagian satuan |
| 16-11 | M22 · 583 (Soal 9, pernyataan 4) | Periksa sama persis dengan baris 581 | Pernyataan 4 (Kamis = rata-rata) tidak benar-benar diperiksa | `` `30 == (20 + 35 + 25 + 30 + 40) / 5` `` |
| 16-12 | S4 · 629 (Butir 30, pernyataan 1); M23 · 687 (Tiket 3); S4 · 588 (Butir 28) | `2 * 3 - 1 != 6`; `min([10, 4]) != 10`; `6 * 8 != 6 * 8 / 2` | Periksa tidak dihitung dari makna pernyataan, jadi tidak akan menangkap salah tulis | Butir 30: `` `sum(1 for x in [2, 0, 1, 3, 1, 1] if x > 0) != 6` ``; lainnya tulis perbandingan yang sesuai pernyataan |

**Visualisasi spasial (M17 dan butir terkait).** Setiap denah angka di-parse dari blok teks, lalu tampak depan (angka terbesar tiap kolom), tampak samping kanan (angka terbesar tiap baris, kiri gambar = baris depan), tampak atas, dan banyak kubus dihitung ulang. Tinggi setiap gambar pilihan dihitung dari posisi karakter ■. Hasil: M17 Contoh jadi 1–2, Terbimbing 1–2, Soal 2, 4, 6, 8, 10, Tiket 1–3; M18 Kuis 1–2, Soal 3, 9; M21 Kuis 3, Soal 9; M24 Soal 12; S4 Butir 2, 30 — **semua kunci cocok, dan setiap gambar pengecoh memang sama dengan salah paham yang disebut** (tampak samping, baris depan saja, kolom kanan saja, jumlah sekolom/sebaris). Aturan arah dijelaskan di kotak sudut papan M17 (baris 63–68), Contoh jadi 2 langkah 1, Halaman 5 (baris 409), dan Penjelasan alternatif 2, dan dipakai konsisten. Catatan kecil: arah gambar tampak atas (baris atas gambar = belakang) tidak pernah ditulis eksplisit (M17 · 259).

**Diagram dan piktogram (M21–M22, M23, M24, S4).** Panjang batang di-parse per baris dan dicocokkan dengan angka sumbu; semua batang rata ke 0 dan kelipatannya benar. Piktogram dihitung dari banyak simbol × kunci (termasuk □ setengah). Semua angka di Langkah cocok, kecuali alasan pengecoh 16-2.

### 2.2 Butir 9 — Keseragaman istilah

| # | Berkas · baris | Kutipan | Masalah | Usulan |
|---|---|---|---|---|
| 9-1 | M23 · 75, 266, 711, 712; M24 · 273; S4 · 28 | "soal Benar-Salah" | 03-standar-istilah Bagian 2: "benar-salah" **dilarang** sebagai nama bentuk. S4 baris 28 tercetak di lembar anak; M23 711–712 masuk laporan orang tua | "soal Benar atau Salah untuk setiap pernyataan" (anak dan orang tua) atau "pilihan ganda kategori" (pengajar) |
| 9-2 | M16 · 37, 233, 252, 253, 322, 333, 513, 573, 613, 628, 640; M17 · 125, 608, 682; M19 · 526 | "sisi berimpit" | Istilah baku "**sisi yang berimpit**" | Tambah "yang" di semua tempat, terutama judul salah paham 3 M16 (baris 37, 333) yang dibacakan |
| 9-3 | M24 · 539–541; S4 · 69–70, 627 | "lajur kiri", "2 lajur" | M17 memakai "kolom" untuk bagian gambar tampak. Anak yang belajar "kolom" di M17 bertemu "lajur" di simulasi | Ganti "lajur" dengan "kolom" |
| 9-4 | M15 · 64–65, 224 | `2×2×2=8`, `10×10×10=1000`, `5×5×5=125` | Notasi baku: spasi di kiri-kanan `×` dan `=`, pemisah ribuan titik | `2 × 2 × 2 = 8` … `10 × 10 × 10 = 1.000` (kalau kotak terlalu sempit, pecah menjadi dua baris) |
| 9-5 | M24 · 132, 135 | "mulai 10.00", "Lihat jam: 12.30" | Format `hh.mm` dicadangkan untuk **pukul**. Di sini maksudnya menit ujian ke-10 dan 12 menit 30 detik, dan soal di sebelahnya memuat pukul 16.50 | "mulai menit ke-10", "menit ke-12 lewat 30 detik" |
| 9-6 | M21 · 120 (Kuis 2) | "72 hari-orang" | Istilah di luar standar, sulit bagi anak | "6 × 12 = 72. Pekerjaan itu sama dengan 72 hari kerja untuk 1 orang." |
| 9-7 | M16 · 188 | "BELAKNG" | Singkatan salah eja di gambar jaring-jaring contoh jadi | "BLKG" dengan keterangan, atau lebarkan kotak menjadi "BELAKANG" |
| 9-8 | M16 · 506 (Soal 9) | "Ada 12 sisi yang tertutup kertas." | "sisi yang tertutup" tercantum sebagai sinonim terlarang untuk *sisi yang berimpit*; di sini maknanya lain (terbungkus), bisa membingungkan | "Ada 12 sisi yang terbungkus kertas." |


### 2.3 Butir 17 — Bahasa dan kejelasan soal

| # | Berkas · baris | Kutipan | Masalah | Usulan |
|---|---|---|---|---|
| 17-1 | M21 · 483–509 (Soal 4); M21 · 718–744 (Tiket 2) | "kelompok B dan kelompok C" dengan pilihan "A. 3 B. 6 …"; "perahu A dan perahu B" | Nama kelompok/perahu memakai huruf yang sama dengan huruf pilihan. Di Soal 4 kuncinya **B** dan yang ditanya juga "kelompok B". Anak mudah tertukar saat menulis jawaban, dan di tiket keluar kesalahan ini tercatat sebagai gagal membaca diagram | Kelompok Melati/Mawar/Anggrek; perahu milik Pak Hasan/Pak Iqbal/Pak Rafli |
| 17-2 | M22 · 631 (Soal 12) | "Berapa kg panen minggu ke-2 dan ke-4 lebih banyak daripada minggu ke-1 dan ke-3?" | 14 kata, satu kalimat memuat dua penjumlahan dan satu selisih | "Jumlahkan panen minggu ke-2 dan ke-4. Jumlahkan juga minggu ke-1 dan ke-3. Berapa kg **selisih** kedua jumlah itu?" |
| 17-3 | M15 · 511 (Soal 10 ●) | "Sebuah kotak diisi kubus satuan 1 cm³. Lapisan bawahnya berisi 12 kubus. Ada 4 lapisan sama. Berapa volume kotak?" | Soal ● maksimal 2 kalimat sebelum pertanyaan (04-standar-soal Bagian 1); di sini 3 | "Lapisan bawah kotak berisi 12 kubus satuan 1 cm³. Ada 4 lapisan sama. Berapa volume kotak?" |
| 17-4 | M17 · 479; M17 · 760; M18 · 96, 110, 387 | "Denah angka susunan kubus: baris belakang 2, 1, 3 dan baris depan 1, 2, 1." (13–15 kata) | Denah ditulis sebagai deret angka dalam kalimat; panjang dan menuntut anak menyusun denah di kepala | Tulis sebagai denah angka berkotak atau tabel Belakang/Depan seperti M21 Kuis 3 |
| 17-5 | M18 · 625 (Tiket 3, pernyataan 1); M18 · 628 | "Pensil adalah 2/3 dari semua alat tulis Intan." · "Kalau semuanya 20 …" | "Semua alat tulis" mengandaikan Intan hanya punya pensil dan pulpen. Kunci tetap Salah, tetapi alasannya bisa diperdebatkan | "… dari jumlah pensil dan pulpen Intan." · "Kalau pensil dan pulpen seluruhnya 20 …" |
| 17-6 | S4 · 126 (Butir 5, pernyataan 4) | "Tanpa 2 anak yang membaca 5 buku, rata-ratanya lebih kecil." | Pembanding "lebih kecil" tidak disebut | "… rata-ratanya lebih kecil daripada rata-rata 20 anak." |
| 17-7 | S4 · 269 (Butir 13) | "Berdasarkan cerita C, rombongan anak menyewa perahu wisata …" | Butir tidak memakai satu pun data cerita C; label "berdasarkan" menyesatkan anak yang mencari angka di cerita | Pindahkan ke butir lepas tanpa "Berdasarkan cerita C", atau hubungkan dengan data kapal |
| 17-8 | M15 · 86; M16 · 85; M17 · 89; M18 · 84; M19 · 87; M21 · 83; M22 · 86 | "**Jangan memberi tahu topik soal.**" di kolom pengajar, lalu diucapkan "Soalnya campur: ada volume, ada pembulatan, ada pecahan." | Naskah terkunci bertentangan dengan dirinya sendiri di baris yang sama; menyebut topik menghapus latihan mengenali jenis soal (inti latihan campur-aduk). M23 sudah benar | Ganti kalimat ucapan dengan versi M23: "Delapan soal campur. Kenali dulu soalnya soal apa." |

### 2.4 Catatan butir lain (tidak menggagalkan butir)

| # | Butir | Berkas · baris | Temuan | Usulan |
|---|---|---|---|---|
| L-1 | 5 | M21 setelah 420; M22 setelah 401; M23 setelah 367 | M15–M19 menulis baris "**Uji tunda Mxx:** Kuis 4 + Soal … + Soal …". M21 (uji tunda M12), M22 (M13), M23 (M15) tidak menulisnya, padahal soal ● bulan lalunya ada | M21: "Uji tunda M12: Kuis 4 + Soal 3 + Soal 7". M22: "Uji tunda M13: Kuis 4 + Soal 1 + Soal 10". M23: "Uji tunda M15: Kuis 4 + Soal 3 + Soal 7" |
| L-2 | 5 | S4 · 95, 227, 385, 501 | Stimulus muncul berurutan A, C, D, B | Beri huruf sesuai urutan muncul: A, B, C, D (sesuaikan "cerita C", "diagram B") |
| L-3 | 5/16 | S4 · 154 vs M15 · 494 | S4 Butir 7 memakai angka yang sama persis dengan M15 Soal 9 (20 m × 12 m dikurangi persegi 4 m, kunci 224 m²) | Ganti angka S4 Butir 7 (mis. 18 m × 15 m, kolam 5 m → 245 m²) supaya simulasi tidak mengukur ingatan jawaban |
| L-4 | 1 | M23 · 163; M24 · 105 | Rujukan teks `T34-….md` dan `T35-….md` belum bernama (M15–M22 sudah lengkap) | Isi judul teks setelah T34/T35 ditulis |
| L-5 | 11/17 | M23 · 315, 317 | Kalimat pengajar "Soal TKA tidak punya aturan harus ada Salah" dan soal pemeriksa semua Benar, padahal 04-standar-soal Bagian 6 mewajibkan **setiap** PG kategori program ini memuat minimal satu Benar dan satu Salah. Anak yang jeli bisa belajar pola "pasti ada Salah" dari soal program sendiri | Keputusan untuk tim penyusun: longgarkan aturan standar (sesekali boleh semua Benar/semua Salah di simulasi) **atau** ubah kalimat pengajar agar tidak bertentangan |
| L-6 | 2 | M24 · 95 | "(2) Terbimbing 1 dan 2 tidak dikerjakan" — keduanya tidak punya slot di tabel menit | Beri slot (mis. Terbimbing 1 di menit 5–7, Terbimbing 2 di menit 85–87) atau hapus butir (2) |
| L-7 | 13 | M24 · 561, 627 | Tiket disebut kembaran butir 5 (PG kategori) tetapi Tiket 1 berbentuk PG; soal tambal "nomor 9 untuk Tiket 3" adalah soal skala, bukan berbalik nilai | Ubah bentuk Tiket 1 atau tulis "kembaran isi butir 5"; untuk Tiket 3 rujuk "M19 halaman 5 Soal 4" |
| L-8 | 8 | S4 · 550 (Butir 26) | Alasan pengecoh B "memilih data yang di tengah setelah diurutkan" = konsep median, tanpa nama | Boleh dipertahankan; pastikan pengajar tidak menyebut istilah median saat analisis kesalahan |
| L-9 | 16 | M17 · 259 | Orientasi gambar tampak atas (baris atas gambar = belakang) tidak ditulis | Tambahkan di langkah 5: "Baris atas gambar = baris belakang denah." |

## 3. Ringkasan butir 16

| Hal | Jumlah |
|---|---|
| Blok soal berangka di berkas (Kuis, Terbimbing, Soal, Tiket, Butir) | 217 |
| Diverifikasi independen dengan Python | **215** (2 dilewati karena tanpa hitungan: M24 Terbimbing 1–2; M19 Soal 10 tetap diperiksa lewat logika arah perubahan) |
| Contoh jadi halaman 3, kartu berburu kesalahan, soal pemeriksa halaman 4, klaim angka halaman 1 | 36 |
| **Total item diverifikasi** | **251** |
| Gambar/denah/diagram/piktogram/tabel yang di-parse dari berkas | ±50 blok |
| Alasan pengecoh (PG) ikut dihitung ulang | ±470 pengecoh |
| **Kunci salah** (huruf menunjuk nilai salah, ada dua pilihan benar, atau kunci PG kompleks/kategori tidak lengkap) | **0** |
| Alasan pengecoh yang hitungannya tidak cocok dengan pilihan | 3 (M22 Soal 1, S4 Butir 16, M23 Terbimbing 1) |
| Soal diagram/piktogram yang pengecohnya kebetulan benar (salah baca batang/baris tetap mendapat kunci) | 6 (M21 Terbimbing 1, M21 Terbimbing 2, M21 Soal 4, M22 Soal 12, M23 Soal 1, M24 Soal 8) |
| Baris `Periksa` lemah atau tidak memeriksa pernyataannya | 5 (M15 Soal 6, M22 Soal 9, M23 Tiket 3, S4 Butir 28, S4 Butir 30) |

Hasil lengkap per item dicetak skrip (`=== RINGKASAN ===`, `=== BUKAN OK ===`, dan daftar kalimat soal > 12 kata).

## Tindak lanjut perbaikan

Dikerjakan 17 September 2026 oleh agen perbaikan. Semua angka yang berubah dihitung ulang dengan Python; huruf kunci tidak ada yang berubah, jadi sebaran kunci Halaman 5, `Kunci ringkas` S4, dan pemetaan uji tunda S4 tetap sah. Skrip `verifikasi/verif_M15_M24_S4.py` ikut disesuaikan di baris yang soalnya berubah (label batang baru, denah tabel, angka S4 Butir 7, huruf stimulus) dan dijalankan ulang: 269 OK · 0 kunci salah · 0 BUKAN OK.

| Temuan | Diperbaiki | Yang diubah |
|---|---|---|
| 16-1 | ya | M22 Soal 1: alasan B = ratusan terdekat (3.700), C = pembulatan berantai 3.749 → 3.750 → 3.800 |
| 16-2 | ya | S4 Butir 16: pilihan A menjadi Rp42.000 (14 gambar × Rp3.000, kunci piktogram diabaikan) |
| 16-3 | ya | M23 Terbimbing 1: pilihan D menjadi 25%; Langkah, alasan, dan Periksa (`F(25, 100)`) disesuaikan |
| 16-4 | ya | M21 Terbimbing 2: Selasa 40 (4 baris, baris 50 di sumbu dihapus); pilihan D 90 = tiga hari |
| 16-5 | ya | M21 Soal 4: Jeumpa 10, Cempaka 4, kunci tetap B (6); pilihan 3 · 6 · 10 · 14. Menyimpang sedikit dari usulan (C = 4, kunci 8) supaya nilai batang Cempaka tidak sama dengan pengecoh selisih baris |
| 16-6 | ya | M21 Terbimbing 1: Senin 4 gambar (16 buku) |
| 16-7 | ya | M22 Soal 12: M1 = 10; kunci C = 35; pilihan 7 · 20 · 35 · 75; Langkah, alasan, Periksa disesuaikan |
| 16-8 | ya | M23 Soal 1: Jumat 20 |
| 16-9 | ya | M24 Soal 8: Dafa 20 |
| 16-10 | ya | M15 Soal 6: baris Periksa `50 * 30 == 1500` untuk pernyataan Salah dihapus (hitungannya tetap di Langkah) |
| 16-11 | ya | M22 Soal 9: Periksa pernyataan 4 menjadi `30 == (20 + 35 + 25 + 30 + 40) / 5` |
| 16-12 | ya | S4 Butir 30: `sum(1 for x in [...] if x > 0) != 6`; S4 Butir 28: `6 * 8 / 2 != 48`; M23 Tiket 3: `[10, 4, 10, 4] != [10, 10, 10, 10]` |
| 9-1 | ya | "Benar-Salah" diganti "soal yang meminta Benar atau Salah untuk setiap pernyataan": S4 Petunjuk ujian 7, M23 kalimat pembuka, pertanyaan pancingan 1, laporan orang tua (2 baris), M24 kalimat pengajar |
| 9-2 | ya | "sisi berimpit" → "sisi yang berimpit": M16 (11), M17 (4), M19 (1) |
| 9-3 | ya | "lajur" → "kolom": M24 Soal 12 (Petunjuk, Langkah, alasan), S4 Butir 2 dan Butir 30 |
| 9-4 | ya | M15 kotak sudut papan ditulis ulang dengan spasi dan `1.000` (dipecah menjadi 4 baris); Contoh jadi baris 5 |
| 9-5 | ya | M24 Contoh jadi 1: "mulai menit ke-10", "menit ke-12 lewat 30 detik" |
| 9-6 | ya | M21 Kuis 2: "6 × 12 = 72. Pekerjaan itu sama dengan 72 hari kerja untuk 1 orang." |
| 9-7 | ya | M16 jaring-jaring: kotak dilebarkan, "BELAKANG" |
| 9-8 | ya | M16 Soal 9 dan laporan orang tua: "terbungkus kertas" |
| 17-1 | ya | M21 Soal 4: kelompok Seulanga/Jeumpa/Cempaka; Tiket 2: perahu Pak Hasan/Pak Iqbal/Pak Rafli. S4 Butir 3: "rute A/B" → bus jurusan Lampulo/Darussalam |
| 17-2 | ya | M22 Soal 12 dipecah: "Jumlahkan … Jumlahkan juga … Berapa kg **selisih** kedua jumlah itu?" |
| 17-3 | ya | M15 Soal 10: 2 kalimat sebelum pertanyaan |
| 17-4 | ya | Denah dalam kalimat diganti tabel Belakang/Depan: M17 Soal 4, Tiket 3; M18 Kuis 1, Kuis 2, Soal 3 |
| 17-5 | ya | M18 Tiket 3 pernyataan 1 dan 4: "jumlah pensil dan pulpen" |
| 17-6 | ya | S4 Butir 5 pernyataan 4: "… lebih kecil daripada semula" (11 kata; versi usulan 14 kata) |
| 17-7 | ya | S4 Butir 13: "Berdasarkan cerita C" dihapus; judul "Butir lepas (nomor 13–18)" dipindah ke atas Butir 13 |
| 17-8 | ya | M15, M16, M17, M18, M19, M21, M22: kalimat ucapan menjadi *"Delapan soal. Soalnya campur. Kenali dulu soalnya soal apa, baru kerjakan."* |
| 17 (kalimat > 12 kata) | sebagian | Dipendekkan: M21 Soal 6, M24 Tiket 2, S4 Butir 15. Dibiarkan: M16 Terbimbing 1, M17 Soal 12, M22 Tiket 1, S4 Butir 11 — panjangnya dari notasi/daftar data (`6 cm × 4 cm × 3 cm`, `1 : 1.500.000`), bukan dari kalimat |
| L-1 | ya | Baris uji tunda: M21 (M12: Kuis 4 + Soal 3 + Soal 7), M22 (M13: Kuis 4 + Soal 1 + Soal 10), M23 (M15: Kuis 4 + Soal 3 + Soal 7) |
| L-2 | ya | S4 stimulus berurutan A (tabel), B (kapal), C (kolam), D (diagram); semua rujukan "cerita/diagram" disesuaikan |
| L-3 | ya | S4 Butir 7: 18 m × 15 m, kolam 5 m → 245 m²; pilihan 66 m · 245 m² · 260 m² · 270 m², kunci tetap B |
| L-4 | tidak perlu | Saat diperbaiki, M23 dan M24 sudah menulis judul dan nama berkas T34/T35 lengkap |
| L-5 | ya | Keputusan: aturan standar (minimal satu Benar dan satu Salah) dipertahankan. M23 kalimat pengajar menjadi "Letak Salah tidak punya pola…"; soal pemeriksa menjadi 1-B, 2-S, 3-B |
| L-6 | ya | M24 "Kalau terlambat": butir Terbimbing 1–2 dihapus, butir berikutnya dinomori ulang |
| L-7 | ya | M24 Halaman 6: "kembaran **isi** butir S4", keterangan "PG kategori" dihapus; soal tambal Tiket 3 dirujuk ke M19 halaman 5 Soal 4 |
| L-8 | ya | S4 Butir 26: alasan B diberi catatan agar pengajar cukup menyebut "data yang di tengah" |
| L-9 | ya | M17 Contoh jadi 2 langkah 5: "baris atas gambar = baris belakang denah" (papan dan ucapan) |

**Hasil `_alat/periksa.py` sesudah perbaikan:** M15–M19, M21–M24: benar 249 · SALAH 0 · galat 0 · format 0 (3 soal "tidak ada hitungan" seperti sebelumnya). S4 (`--simulasi`): benar 53 · SALAH 0 · galat 0 · format 0.

**Di luar cakupan, belum diubah:** M14 · 222 masih memakai "Benar-Salah" sebagai nama bentuk.
