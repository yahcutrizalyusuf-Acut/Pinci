# S2 — Simulasi 2 Matematika (M14 · P20)

| Hal | Isi |
|---|---|
| Dipakai di | M14 · P20 · Minggu 7 · Rabu |
| Cakupan | M01–M13 |
| Banyak butir | 30 (PG 18 · PG kompleks 6 · PG kategori 6) |
| Waktu | 75 menit (±2,5 menit per butir, sudah termasuk membaca) |
| Bobot topik | Terbaru: M09 3 · M10 3 · M11 3 · M12 3 · M13 3 · Lama: M01 1 · M02 2 · M03 2 · M04 2 · M05 3 · M06 2 · M07 3 (peta spiral Bagian 6) |
| Stimulus bergrup | A: butir 6–8 · B: butir 15–17 |

Blok kunci (baris berawalan `>`) hanya untuk pengajar. Lembar anak mencetak badan butir saja.

## Petunjuk ujian

Tercetak di halaman depan lembar soal dan dibaca anak sendiri di menit 5–7. Pengajar hanya mengucapkan satu kalimat petunjuk (lihat tabel menit modul simulasi).

*"Ini simulasi kedua. Sama seperti simulasi pertama: 30 soal, 75 menit."*

*"Ada tiga bentuk soal. Pilih satu jawaban yang benar. Pilih **semua** jawaban yang benar — bisa lebih dari satu. Atau tentukan Benar atau Salah untuk setiap pernyataan."*

*"Tulis jawabanmu di lembar jawaban. Coretan boleh di lembar soal. Tulis menit mulai di pojok soal yang terasa sulit."*

*"Selama ujian, kita diam. Kakak tidak menjawab pertanyaan tentang soal."*

*"Ingat aturan kita: tiga menit tanpa jalan, lingkari, lompati, kembali nanti. Semua soal nilainya sama."*

*"Kakak menulis sisa waktu di papan setiap 15 menit. Mulai!"*

## Naskah soal

#### Butir 1 · PG
Rafli berjalan 1 2/5 km ke sekolah. Sepulang sekolah, ia berjalan 2 1/4 km ke rumah nenek.

Berapa km jarak yang ditempuh Rafli seluruhnya?

A. 13/20
B. 17/20
C. 3 3/9
D. 3 13/20

> **Kunci:** D
> **Kelompok:** (M05)
> **Petunjuk:** Jumlahkan bilangan cacahnya dulu. Pecahannya perlu disamakan penyebutnya ke berapa?
> **Langkah:** 1 + 2 = 3. 2/5 + 1/4 = 8/20 + 5/20 = 13/20. Jumlah 3 13/20 km.
> **Kenapa pengecoh menarik:** A — bilangan cacahnya terlupa; B — menghitung selisih, bukan jumlah (salah baca soal); C — pembilang dan penyebut dijumlah langsung: (2 + 1)/(5 + 4) (salah paham 1/2 + 1/3 = 2/5).
> **Periksa:** `F(7,5) + F(9,4) == F(73,20)`

#### Butir 2 · PG
Jam dinding di meunasah menunjukkan pukul 10.30.

Berapa besar sudut terkecil antara jarum panjang dan jarum pendek?

A. 120°
B. 135°
C. 150°
D. 225°

> **Kunci:** B
> **Kelompok:** (M12)
> **Petunjuk:** Pukul 10.30, jarum pendek tepat di angka 10, atau sudah bergeser?
> **Langkah:** Jarak dua angka di jam = 30°. Jarum panjang di angka 6. Jarum pendek di tengah angka 10 dan 11. Dari angka 6 ke tengah 10–11 ada 4 1/2 angka. 4 1/2 × 30° = 135°.
> **Kenapa pengecoh menarik:** A — gerak jarum pendek diabaikan, jarum pendek dianggap tepat di angka 10 (4 × 30°); C — jarum pendek dianggap sudah di angka 11 (5 × 30°); D — menghitung sudut yang besar, bukan yang terkecil (360° − 135°).
> **Periksa:** `abs(F(21,2) * 30 - 6 * 30) == 135 and 360 - 135 == 225`

#### Butir 3 · PG
Rafli punya dua tali. Panjangnya 42 m dan 56 m. Kedua tali dipotong sama panjang, sepanjang mungkin, tanpa sisa.

Berapa potong tali yang didapat seluruhnya?

A. 7
B. 14
C. 98
D. 168

> **Kunci:** A
> **Kelompok:** (M02)
> **Petunjuk:** Tali dibagi sama panjang tanpa sisa. Kita mencari faktor atau kelipatan? Setelah itu, apa yang ditanya?
> **Langkah:** FPB dari 42 dan 56 = 14 m (panjang satu potong). 42 : 14 = 3 potong. 56 : 14 = 4 potong. Seluruhnya 7 potong.
> **Kenapa pengecoh menarik:** B — berhenti di panjang satu potong, tidak membaca pertanyaan sampai habis; C — menjumlahkan panjang kedua tali; D — memakai KPK, salah paham KPK–FPB tertukar.
> **Periksa:** `42 // gcd(42, 56) + 56 // gcd(42, 56) == 7`

#### Butir 4 · PG kategori
Ada 40 anak di SD Lampineung. Tabel ini menunjukkan cara mereka berangkat ke sekolah.

| Cara berangkat | Bagian anak |
|---|---|
| Jalan kaki | 0,35 |
| Naik sepeda | 1/5 |
| Naik becak motor | 30% |
| Diantar mobil | sisanya |

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Urutan dari yang paling sedikit: mobil, sepeda, becak motor, jalan kaki. | ☐ | ☐ |
| 2. Bagian 1/5 sama dengan 0,15. | ☐ | ☐ |
| 3. Anak yang diantar mobil ada 6 orang. | ☐ | ☐ |
| 4. Anak yang naik becak motor lebih banyak daripada anak yang jalan kaki. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B, 4-S
> **Kelompok:** (M04)
> **Petunjuk:** Ubah setiap bagian ke per seratus dulu. Periksa satu pernyataan saja.
> **Langkah:** Jalan kaki 35/100, sepeda 20/100, becak motor 30/100. (1) Mobil 15 < sepeda 20 < becak motor 30 < jalan kaki 35 → Benar. (2) 1/5 = 20/100 = 0,2 → Salah. (3) Diantar mobil 100/100 − 85/100 = 15/100; 15/100 × 40 = 6 → Benar. (4) 30/100 < 35/100 → Salah.
> **Kenapa pernyataan salah menarik:** 2 — penyebut 5 ditulis sesudah angka 1 dan koma, mirip salah paham 1/4 dikira 0,14; 4 — angka 30 dibandingkan dengan 0,35 tanpa menyamakan bentuk, jadi 30 terlihat lebih besar.
> **Periksa:** `1 - F('0.35') - F(1,5) - F(30,100) < F(1,5) < F(30,100) < F('0.35')`
> **Periksa:** `F(1,5) != F('0.15')`
> **Periksa:** `(1 - F('0.35') - F(1,5) - F(30,100)) * 40 == 6`
> **Periksa:** `not (F(30,100) > F('0.35'))`

#### Butir 5 · PG kompleks
Hasil panen padi Kakek ditimbang. Beratnya dibulatkan ke ratusan kg terdekat. Hasil pembulatannya 2.700 kg.

Pilih **semua** berat panen yang mungkin.

A. 2.649 kg
B. 2.650 kg
C. 2.695 kg
D. 2.719 kg
E. 2.751 kg

> **Kunci:** B, C, D
> **Kelompok:** (M13)
> **Petunjuk:** Untuk membulatkan ke ratusan, angka di tempat mana yang dilihat? Lihat angka itu saja.
> **Langkah:** Lihat angka puluhan. A: 2.649, puluhan 4 → 2.600 ✗. B: 2.650, puluhan 5 → 2.700 ✓. C: 2.695, puluhan 9 → 2.700 ✓. D: 2.719, puluhan 1 → 2.700 ✓. E: 2.751, puluhan 5 → 2.800 ✗.
> **Kenapa pengecoh menarik:** A — dibulatkan bertahap: 2.649 ke puluhan dulu menjadi 2.650, lalu ke ratusan menjadi 2.700 (pembulatan di tengah, bukan sekali di akhir); E — angka ratusannya 7, anak mengira semua 2.7xx menjadi 2.700.
> **Periksa:** `(2650 + 50) // 100 * 100 == 2700 and (2719 + 50) // 100 * 100 == 2700 and (2695 + 50) // 100 * 100 == 2700`
> **Periksa:** `(2649 + 50) // 100 * 100 != 2700 and (2751 + 50) // 100 * 100 != 2700`

### Stimulus A: Sepeda santai hari Minggu

Rombongan sepeda santai berangkat dari Blang Padang menuju Ulee Lheue. Tabel ini mencatat perjalanan mereka.

| Tempat | Pukul | Jarak dari tempat sebelumnya |
|---|---|---|
| Blang Padang (berangkat) | 06.45 | — |
| Pos 1 (tiba, lalu istirahat) | 07.00 | 3 km |
| Pos 1 (berangkat lagi) | 07.15 | — |
| Pos 2 Ulee Lheue (tiba) | 08.00 | 9 km |

#### Butir 6 · PG
Berdasarkan teks A, berapa kecepatan rombongan dari Pos 1 ke Pos 2?

A. 0,2 km/jam
B. 9 km/jam
C. 12 km/jam
D. 20 km/jam

> **Kunci:** C
> **Kelompok:** (M10)
> **Petunjuk:** Berapa lama perjalanan dari Pos 1 ke Pos 2? Tulis dalam jam.
> **Langkah:** Pukul 07.15 sampai 08.00 = 45 menit = 45/60 jam = 3/4 jam. Kecepatan = 9 : 3/4 = 9 × 4/3 = 12 km/jam.
> **Kenapa pengecoh menarik:** A — 9 : 45 memakai menit, tetapi satuan ditulis km/jam (satuan tidak disamakan); B — melihat pukul 07 ke 08 lalu menganggap waktunya 1 jam; D — 45 menit ditulis 0,45 jam (mirip salah paham 1,5 jam ditulis 1 jam 50 menit).
> **Periksa:** `9 / F(45,60) == 12`

#### Butir 7 · PG kategori
Berdasarkan teks A, tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Dari Blang Padang sampai Pos 2 lamanya 1 jam 15 menit. | ☐ | ☐ |
| 2. Waktu 1,25 jam sama dengan 1 jam 25 menit. | ☐ | ☐ |
| 3. Kecepatan dari Blang Padang ke Pos 1 adalah 12 km/jam. | ☐ | ☐ |
| 4. Dengan kecepatan 12 km/jam, jarak 6 km ditempuh 2 jam. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B, 4-S
> **Kelompok:** (M10)
> **Petunjuk:** Ubah semua waktu ke menit dulu. Periksa satu pernyataan saja.
> **Langkah:** (1) 06.45 sampai 08.00 = 75 menit = 1 jam 15 menit → Benar. (2) 0,25 jam = 1/4 × 60 = 15 menit, jadi 1,25 jam = 1 jam 15 menit → Salah. (3) 3 km dalam 15 menit; 15 menit = 1/4 jam; 3 : 1/4 = 12 km/jam → Benar. (4) Waktu = 6 : 12 = 1/2 jam → Salah.
> **Kenapa pernyataan salah menarik:** 2 — angka di belakang koma dibaca sebagai menit (salah paham 1,5 jam ditulis 1 jam 50 menit); 4 — rumus dibalik: 12 : 6 = 2.
> **Periksa:** `(8 * 60) - (6 * 60 + 45) == 75`
> **Periksa:** `F('1.25') * 60 != 60 + 25`
> **Periksa:** `3 / F(15,60) == 12`
> **Periksa:** `F(6,12) != 2`

#### Butir 8 · PG
Berdasarkan teks A, panitia membagikan air kepada 45 peserta. Setiap peserta mendapat satu botol 600 mL.

Berapa liter air yang dibagikan seluruhnya?

A. 2,7 L
B. 27 L
C. 270 L
D. 27.000 L

> **Kunci:** B
> **Kelompok:** (M09)
> **Petunjuk:** Hitung dulu dalam mL. Lalu 1 L sama dengan berapa mL?
> **Langkah:** 45 × 600 = 27.000 mL. 1 L = 1.000 mL. 27.000 : 1.000 = 27 L.
> **Kenapa pengecoh menarik:** A — dibagi 10.000, turun terlalu banyak anak tangga; C — dibagi 100 seperti cm ke m (tangga volume dikira sama dengan tangga panjang); D — satuan mL tidak diubah, hanya ditulis L.
> **Periksa:** `45 * 600 / 1000 == 27`

#### Butir 9 · PG
Harga beras di Pasar Aceh Rp14.000 per kg. Bu Intan membeli 2,5 kg beras. Ia mendapat potongan harga 10%.

Berapa rupiah yang dibayar Bu Intan?

A. Rp3.500
B. Rp27.720
C. Rp31.500
D. Rp38.500

> **Kunci:** C
> **Kelompok:** (M07)
> **Petunjuk:** Hitung dulu harga 2,5 kg. Lalu potongan 10% itu berapa rupiah?
> **Langkah:** 2,5 × Rp14.000 = Rp35.000. Potongan 10/100 × Rp35.000 = Rp3.500. Dibayar Rp35.000 − Rp3.500 = Rp31.500.
> **Kenapa pengecoh menarik:** A — menjawab potongannya saja (tidak membaca soal sampai habis); B — 2,5 dikira 2 1/5 (bentuk tidak disamakan dengan benar); D — potongan malah ditambahkan.
> **Periksa:** `14000 * F('2.5') * (1 - F(10,100)) == 31500`

#### Butir 10 · PG kompleks
Kak Intan menulis lima pecahan di papan.

Pilih **semua** pecahan yang **lebih besar** dari 3/5.

A. 6/11
B. 4/7
C. 5/8
D. 2/3
E. 7/10

> **Kunci:** C, D, E
> **Kelompok:** (M03)
> **Petunjuk:** Bandingkan setiap pecahan dengan 3/5 satu per satu. Ubah keduanya ke penyebut yang sama.
> **Langkah:** A: 30/55 < 33/55 ✗. B: 20/35 < 21/35 ✗. C: 25/40 > 24/40 ✓. D: 10/15 > 9/15 ✓. E: 7/10 > 6/10 ✓.
> **Kenapa pengecoh menarik:** A — penyebut 11 paling besar, dikira nilainya besar; B — penyebut 7 lebih besar dari 5, dikira nilainya lebih besar. Anak yang berhenti setelah C juga salah.
> **Periksa:** `F(5,8) > F(3,5) and F(2,3) > F(3,5) and F(7,10) > F(3,5)`
> **Periksa:** `F(4,7) < F(3,5) and F(6,11) < F(3,5)`

#### Butir 11 · PG
Bu Salsabila punya kain 4 1/2 m. Kain dipotong untuk taplak meja. Setiap taplak membutuhkan 3/4 m kain.

Berapa taplak yang bisa dibuat?

A. 1/6
B. 3 3/8
C. 5 1/3
D. 6

> **Kunci:** D
> **Kelompok:** (M06)
> **Petunjuk:** Ubah 4 1/2 menjadi pecahan biasa dulu. Berapa kali 3/4 masuk ke dalamnya?
> **Langkah:** 4 1/2 = 9/2. 9/2 : 3/4 = 9/2 × 4/3 = 36/6 = 6 taplak.
> **Kenapa pengecoh menarik:** A — yang dibalik bilangan yang dibagi: 2/9 × 3/4; B — lupa membalik: 9/2 × 3/4 (mengira pembagian selalu mengecilkan); C — pecahan 1/2 terlupa: 4 : 3/4.
> **Periksa:** `F(9,2) / F(3,4) == 6`

#### Butir 12 · PG kompleks
Kak Rafli menulis lima pasang sudut di papan.

Pilih **semua** pasangan sudut yang **berpelurus**.

A. 45° dan 45°
B. 120° dan 60°
C. 70° dan 20°
D. 95° dan 85°
E. 100° dan 90°

> **Kunci:** B, D
> **Kelompok:** (M12)
> **Petunjuk:** Sudut berpelurus jumlahnya berapa derajat? Jumlahkan setiap pasangan.
> **Langkah:** Berpelurus = jumlah 180°. A: 90° ✗. B: 180° ✓. C: 90° ✗. D: 180° ✓. E: 190° ✗.
> **Kenapa pengecoh menarik:** A dan C — jumlahnya 90°, sudut berpelurus dan berpenyiku tertukar; E — sudah dekat 180°, anak menjumlah terburu-buru.
> **Periksa:** `120 + 60 == 180 and 95 + 85 == 180`
> **Periksa:** `45 + 45 != 180 and 70 + 20 != 180 and 100 + 90 != 180`

#### Butir 13 · PG
Panitia kenduri memesan 12 kotak air gelas. Setiap kotak berisi 24 gelas. Sebanyak 150 gelas sudah diminum. Sisa gelas dibagi sama banyak ke 6 meja.

Berapa gelas di setiap meja?

A. 23
B. 48
C. 138
D. 263

> **Kunci:** A
> **Kelompok:** (M01)
> **Petunjuk:** Berapa gelas yang tersisa sebelum dibagi ke meja?
> **Langkah:** 12 × 24 = 288 gelas. Sisa 288 − 150 = 138. Per meja 138 : 6 = 23 gelas. Kalimat matematikanya (12 × 24 − 150) : 6.
> **Kenapa pengecoh menarik:** B — lupa mengurangi gelas yang sudah diminum: 288 : 6; C — berhenti sebelum membagi ke meja; D — kurung diabaikan: 12 × 24 − 150 : 6.
> **Periksa:** `(12 * 24 - 150) / 6 == 23`

#### Butir 14 · PG
Bu Syifa membeli 3 kg ikan tongkol. Harganya Rp38.500 per kg.

Berapa total belanja, dibulatkan ke ribuan terdekat?

A. Rp115.500
B. Rp116.000
C. Rp117.000
D. Rp120.000

> **Kunci:** B
> **Kelompok:** (M13)
> **Petunjuk:** Hitung dulu total yang sebenarnya. Kapan pembulatan dilakukan?
> **Langkah:** 3 × Rp38.500 = Rp115.500. Dibulatkan ke ribuan: angka ratusan 5, jadi naik → Rp116.000.
> **Kenapa pengecoh menarik:** A — tidak dibulatkan (tidak membaca soal sampai habis); C — pembulatan dilakukan di tengah: Rp38.500 dibulatkan dulu menjadi Rp39.000, lalu dikali 3; D — dibulatkan ke puluhan ribu.
> **Periksa:** `(3 * 38500 + 500) // 1000 * 1000 == 116000`

### Stimulus B: Halaman meunasah

Halaman meunasah berbentuk persegi panjang. Panjangnya 24 m dan lebarnya 15 m. Di halaman itu ada taman berbentuk segitiga siku-siku. Sisa halaman ditanami rumput.

| Bagian | Ukuran |
|---|---|
| Halaman (persegi panjang) | panjang 24 m, lebar 15 m |
| Taman (segitiga siku-siku) | alas 8 m, tinggi 6 m, sisi miring 10 m |

#### Butir 15 · PG kompleks
Berdasarkan teks B, pilih **semua** pernyataan yang benar tentang halaman meunasah.

A. Luas halaman 360 m².
B. Keliling halaman 39 m.
C. Luas halaman 78 m².
D. Keliling halaman 360 m.
E. Keliling halaman 78 m.

> **Kunci:** A, E
> **Kelompok:** (M11)
> **Petunjuk:** Keliling memakai satuan m, luas memakai satuan m². Hitung keduanya terpisah.
> **Langkah:** Luas = 24 × 15 = 360 m² → A ✓. Keliling = 2 × (24 + 15) = 78 m → E ✓. B, C, D salah.
> **Kenapa pengecoh menarik:** B — panjang dan lebar hanya dijumlah sekali, lupa dikali 2; C dan D — keliling dan luas tertukar.
> **Periksa:** `24 * 15 == 360 and 2 * (24 + 15) == 78`
> **Periksa:** `24 + 15 != 78 and 2 * (24 + 15) != 360`

#### Butir 16 · PG kategori
Berdasarkan teks B, tentukan **Benar** atau **Salah** untuk setiap pernyataan tentang taman.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Luas taman 24 m². | ☐ | ☐ |
| 2. Luas taman 48 m². | ☐ | ☐ |
| 3. Luas taman 40 m². | ☐ | ☐ |
| 4. Keliling taman 24 m. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-S, 4-B
> **Kelompok:** (M11)
> **Petunjuk:** Luas segitiga memakai alas dan tinggi yang saling tegak lurus. Sisi mana yang tegak lurus dengan alas?
> **Langkah:** (1) 8 × 6 : 2 = 24 m² → Benar. (2) 48 m² lupa dibagi 2 → Salah. (3) 8 × 10 : 2 = 40 memakai sisi miring → Salah. (4) 8 + 6 + 10 = 24 m → Benar.
> **Kenapa pernyataan salah menarik:** 2 — lupa bagi dua; 3 — tinggi dikira sisi miring.
> **Periksa:** `8 * 6 / 2 == 24`
> **Periksa:** `8 * 6 / 2 != 48`
> **Periksa:** `8 * 6 / 2 != 8 * 10 / 2`
> **Periksa:** `8 + 6 + 10 == 24`

#### Butir 17 · PG
Berdasarkan teks B, rumput ditanam di sisa halaman. Biaya menanam rumput Rp5.000 setiap m².

Berapa rupiah biaya menanam rumput di halaman meunasah?

A. Rp1.560.000
B. Rp1.600.000
C. Rp1.680.000
D. Rp1.920.000

> **Kunci:** C
> **Kelompok:** (M11)
> **Petunjuk:** Rumput ada di halaman, kecuali di taman. Luas apa dikurangi luas apa?
> **Langkah:** Luas halaman 24 × 15 = 360 m². Luas taman 8 × 6 : 2 = 24 m². Rumput 360 − 24 = 336 m². Biaya 336 × Rp5.000 = Rp1.680.000.
> **Kenapa pengecoh menarik:** A — luas taman lupa dibagi dua (360 − 48 = 312); B — tinggi taman dikira sisi miring (360 − 40 = 320); D — luas taman ditambahkan, bukan dikurangkan (360 + 24 = 384).
> **Periksa:** `(24 * 15 - 8 * 6 / 2) * 5000 == 1680000`

#### Butir 18 · PG
Ember Keumala berisi 7/8 L air. Ia memakai 1/3 L air untuk menyiram bunga.

Berapa L sisa air di ember?

A. 6/24
B. 13/24
C. 1 1/5
D. 29/24

> **Kunci:** B
> **Kelompok:** (M05)
> **Petunjuk:** Penyebut 8 dan 3 disamakan menjadi berapa?
> **Langkah:** 7/8 = 21/24. 1/3 = 8/24. 21/24 − 8/24 = 13/24 L.
> **Kenapa pengecoh menarik:** A — pembilang dikurangi, penyebut dikali tanpa menyamakan; C — pembilang dikurangi pembilang, penyebut dikurangi penyebut: (7 − 1)/(8 − 3) (salah paham 1/2 + 1/3 = 2/5 untuk pengurangan); D — dijumlah, padahal yang ditanya sisa.
> **Periksa:** `F(7,8) - F(1,3) == F(13,24)`

#### Butir 19 · PG kompleks
Sebotol besar sirup berisi 2,5 L.

Pilih **semua** ukuran yang sama dengan 2,5 L.

A. 250 mL
B. 2.500 mL
C. 25 cm³
D. 2,5 dm³
E. 2.500 cm³

> **Kunci:** B, D, E
> **Kelompok:** (M09)
> **Petunjuk:** 1 L sama dengan berapa mL? 1 mL sama dengan berapa cm³?
> **Langkah:** 1 L = 1.000 mL = 1 dm³. 2,5 L = 2.500 mL ✓ = 2,5 dm³ ✓. 1 mL = 1 cm³, jadi 2.500 mL = 2.500 cm³ ✓.
> **Kenapa pengecoh menarik:** A — dikali 100 seperti m ke cm (tangga volume dikira sama dengan tangga panjang); C — cm³ tidak dikenali sama dengan mL, dikali 10 saja.
> **Periksa:** `F('2.5') * 1000 == 2500 and F('2.5') * 1000 / 1000 == F('2.5')`
> **Periksa:** `F('2.5') * 1000 != 250 and F('2.5') * 1000 != 25`

#### Butir 20 · PG kategori
Tiga anak berlari pagi di Blang Padang. Iqbal berlari 1 3/4 km. Putroe berlari 1,8 km. Dafa berlari 175% dari jarak 1 km.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Jarak lari Iqbal sama dengan 1,34 km. | ☐ | ☐ |
| 2. Putroe berlari paling jauh. | ☐ | ☐ |
| 3. Selisih jarak Putroe dan Dafa adalah 0,5 km. | ☐ | ☐ |
| 4. Iqbal dan Dafa berlari sama jauh. | ☐ | ☐ |

> **Kunci:** 1-S, 2-B, 3-S, 4-B
> **Kelompok:** (M07)
> **Petunjuk:** Ubah ketiga jarak ke bentuk desimal dulu.
> **Langkah:** Iqbal 1 3/4 = 1,75. Putroe 1,8 = 1,80. Dafa 175% = 1,75. (1) 1,75, bukan 1,34 → Salah. (2) 1,80 paling besar → Benar. (3) 1,80 − 1,75 = 0,05 → Salah. (4) 1,75 = 1,75 → Benar.
> **Kenapa pernyataan salah menarik:** 1 — pembilang dan penyebut 3/4 ditulis berjajar sesudah koma (bentuk tidak disamakan, mirip 1/4 dikira 0,14); 3 — 1,8 dan 1,75 dikurangkan tanpa menyamakan banyak angka di belakang koma.
> **Periksa:** `F(7,4) != F('1.34')`
> **Periksa:** `F('1.8') > F(7,4) and F('1.8') > F(175,100)`
> **Periksa:** `F('1.8') - F(175,100) != F('0.5')`
> **Periksa:** `F(7,4) == F(175,100)`

#### Butir 21 · PG
Toko roti di Peunayong memanggang roti setiap 45 menit. Toko sebelahnya memanggang kue setiap 30 menit. Keduanya mulai memanggang pukul 06.00.

Pukul berapa keduanya memanggang bersamaan lagi?

A. pukul 06.15
B. pukul 07.15
C. pukul 07.30
D. pukul 07.50

> **Kunci:** C
> **Kelompok:** (M02)
> **Petunjuk:** Kejadiannya berulang lalu bertemu lagi. Kita mencari KPK atau FPB?
> **Langkah:** Kelipatan 45: 45, **90**. Kelipatan 30: 30, 60, **90**. KPK = 90 menit = 1 jam 30 menit. Pukul 06.00 + 1 jam 30 menit = pukul 07.30.
> **Kenapa pengecoh menarik:** A — memakai FPB 15 menit (KPK–FPB tertukar); B — menjumlahkan 45 + 30 = 75 menit; D — 90 menit = 1,5 jam ditulis 1 jam 50 menit.
> **Periksa:** `lcm(45, 30) == 90 and 6 * 60 + lcm(45, 30) == 7 * 60 + 30`

#### Butir 22 · PG
Bak mandi berisi air setinggi 10 cm. Keran dibuka. Tinggi air naik 3 cm setiap 2 menit.

Berapa cm tinggi air setelah 12 menit?

A. 13
B. 18
C. 22
D. 28

> **Kunci:** D
> **Kelompok:** (M10)
> **Petunjuk:** Dalam 12 menit, ada berapa kali "2 menit"?
> **Langkah:** 12 : 2 = 6 kali. Naik 6 × 3 = 18 cm. Tinggi air 10 + 18 = 28 cm.
> **Kenapa pengecoh menarik:** A — hanya menambah satu kali kenaikan; B — lupa tinggi air mula-mula; C — 12 menit langsung ditambahkan ke 10 cm (satuan tidak disamakan: menit dianggap cm).
> **Periksa:** `10 + 3 * (12 // 2) == 28`

#### Butir 23 · PG
Haikal menggambar sudut siku-siku di kertas. Ia membagi sudut itu menjadi dua sudut. Satu sudut besarnya 62°.

Berapa besar sudut yang lain?

A. 28°
B. 62°
C. 118°
D. 298°

> **Kunci:** A
> **Kelompok:** (M12)
> **Petunjuk:** Sudut siku-siku besarnya berapa derajat?
> **Langkah:** Dua sudut berpenyiku jumlahnya 90°. 90° − 62° = 28°.
> **Kenapa pengecoh menarik:** B — mengira kedua sudut sama besar; C — memakai 180°, sudut berpelurus dan berpenyiku tertukar; D — memakai 360° satu putaran.
> **Periksa:** `90 - 62 == 28`

#### Butir 24 · PG kategori
Ayah berbelanja di Pasar Aceh. Ia membeli 2 kg bawang merah dan 750 g cabai. Ia juga membeli 1,25 kg tomat.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Berat tomat 125 g. | ☐ | ☐ |
| 2. Berat cabai 0,75 kg. | ☐ | ☐ |
| 3. Bawang merah lebih ringan daripada cabai. | ☐ | ☐ |
| 4. Berat semua belanjaan 4 kg. | ☐ | ☐ |

> **Kunci:** 1-S, 2-B, 3-S, 4-B
> **Kelompok:** (M09)
> **Petunjuk:** Ubah semua berat ke satuan yang sama dulu. Pilih kg atau g.
> **Langkah:** 1 kg = 1.000 g. (1) 1,25 kg = 1.250 g → Salah. (2) 750 g = 750 : 1.000 = 0,75 kg → Benar. (3) 2 kg = 2.000 g, lebih berat dari 750 g → Salah. (4) 2 + 0,75 + 1,25 = 4 kg → Benar.
> **Kenapa pernyataan salah menarik:** 1 — dikali 100, bukan 1.000; 3 — angka 2 dibandingkan dengan 750 tanpa menyamakan satuan.
> **Periksa:** `F('1.25') * 1000 != 125`
> **Periksa:** `F(750,1000) == F('0.75')`
> **Periksa:** `not (2 * 1000 < 750)`
> **Periksa:** `2 + F('0.75') + F('1.25') == 4`

#### Butir 25 · PG
Nayla mengerjakan 18 dari 24 soal latihan.

Pecahan manakah yang senilai dengan 18/24?

A. 3/4
B. 20/26
C. 4/3
D. 6/4

> **Kunci:** A
> **Kelompok:** (M03)
> **Petunjuk:** Pembilang dan penyebut harus dibagi dengan bilangan yang sama. Bilangan berapa yang membagi 18 dan 24?
> **Langkah:** FPB dari 18 dan 24 = 6. 18 : 6 = 3. 24 : 6 = 4. Jadi 18/24 = 3/4.
> **Kenapa pengecoh menarik:** B — pembilang dan penyebut sama-sama ditambah 2, dikira tetap senilai; C — pembilang dan penyebut tertukar setelah disederhanakan; D — pembilang dan penyebut dibagi bilangan yang berbeda (18 : 3 dan 24 : 6).
> **Periksa:** `F(18,24) == F(3,4)`

#### Butir 26 · PG
Ayah membeli 3/4 kg daging untuk meugang. Sebanyak 2/3 bagian daging itu dimasak menjadi rendang.

Berapa kg daging yang dimasak menjadi rendang?

A. 1/2
B. 5/7
C. 1 1/8
D. 1 5/12

> **Kunci:** A
> **Kelompok:** (M06)
> **Petunjuk:** "2/3 bagian dari 3/4 kg" dikerjakan dengan kali, bagi, atau tambah?
> **Langkah:** 2/3 × 3/4 = 6/12 = 1/2 kg.
> **Kenapa pengecoh menarik:** B — pembilang dan penyebut dijumlah; C — dikerjakan sebagai pembagian 3/4 : 2/3, padahal "bagian dari" berarti kali; D — kedua pecahan dijumlahkan. Cek akal sehat: daging yang dimasak tidak mungkin lebih berat dari 3/4 kg.
> **Periksa:** `F(2,3) * F(3,4) == F(1,2)`

#### Butir 27 · PG kategori
Bank sampah di Ulee Lheue mengumpulkan sampah plastik selama tiga hari.

| Hari | Senin | Selasa | Rabu |
|---|---|---|---|
| Berat sampah (kg) | 245 | 362 | 146 |

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Jumlah sampah dibulatkan ke ratusan terdekat adalah 700 kg. | ☐ | ☐ |
| 2. Jumlah sampah sebenarnya 753 kg. | ☐ | ☐ |
| 3. Sampah hari Selasa dibulatkan ke ratusan terdekat menjadi 400 kg. | ☐ | ☐ |
| 4. Sampah hari Rabu dibulatkan ke ratusan terdekat menjadi 200 kg. | ☐ | ☐ |

> **Kunci:** 1-S, 2-B, 3-B, 4-S
> **Kelompok:** (M13)
> **Petunjuk:** Kalau yang dibulatkan jumlahnya, kapan pembulatan dilakukan: sebelum atau sesudah menjumlah?
> **Langkah:** (2) 245 + 362 + 146 = 753 → Benar. (1) 753 dibulatkan ke ratusan: angka puluhan 5 → naik → 800 kg, bukan 700 → Salah. (3) 362: puluhan 6 → naik → 400 → Benar. (4) 146: puluhan 4 → turun → 100, bukan 200 → Salah.
> **Kenapa pernyataan salah menarik:** 1 — pembulatan dilakukan di tengah: 200 + 400 + 100 = 700, bukan membulatkan hasil akhir; 4 — pembulatan berantai: 146 → 150 → 200.
> **Periksa:** `(245 + 362 + 146 + 50) // 100 * 100 != 700 and (245 + 50) // 100 * 100 + (362 + 50) // 100 * 100 + (146 + 50) // 100 * 100 == 700`
> **Periksa:** `245 + 362 + 146 == 753`
> **Periksa:** `(362 + 50) // 100 * 100 == 400`
> **Periksa:** `(146 + 50) // 100 * 100 != 200`

#### Butir 28 · PG
Tiga anak menabung sebagian uang sakunya. Intan menabung 0,45 bagian. Fathan menabung 2/5 bagian. Syifa menabung 42% uang sakunya.

Bagaimana urutan bagian tabungan dari yang **paling sedikit**?

A. Intan, Fathan, Syifa
B. Fathan, Intan, Syifa
C. Intan, Syifa, Fathan
D. Fathan, Syifa, Intan

> **Kunci:** D
> **Kelompok:** (M04)
> **Petunjuk:** Ubah ketiganya ke per seratus dulu.
> **Langkah:** Intan 0,45 = 45/100. Fathan 2/5 = 40/100. Syifa 42% = 42/100. Dari paling sedikit: 40, 42, 45 → Fathan, Syifa, Intan.
> **Kenapa pengecoh menarik:** A — 0,45 dikira 4,5% (mirip salah paham 0,5 dikira 5%), sehingga Intan dianggap paling sedikit; B — 42% dibaca 42, dianggap paling besar; C — diurutkan dari paling banyak (tidak membaca kata "paling sedikit").
> **Periksa:** `F(2,5) < F(42,100) < F('0.45')`

#### Butir 29 · PG kompleks
Kak Zahra punya pita 3 1/2 m. Ia memakai 1 3/4 m pita untuk kado. Ia memakai 5/6 m pita untuk bunga hias.

Pilih **semua** pernyataan yang benar.

A. Pita yang terpakai 2 7/12 m.
B. Pita yang terpakai 1 8/10 m.
C. Sisa pita 11/12 m.
D. Pita untuk kado 11/12 m lebih panjang daripada untuk bunga.
E. Sisa pita 1 3/4 m.

> **Kunci:** A, C, D
> **Kelompok:** (M05)
> **Petunjuk:** Samakan penyebut 2, 4, dan 6 dulu. Penyebut berapa yang cocok?
> **Langkah:** Penyebut 12: 3 1/2 = 42/12, 1 3/4 = 21/12, 5/6 = 10/12. A: 21/12 + 10/12 = 31/12 = 2 7/12 ✓. C: 42/12 − 31/12 = 11/12 ✓. D: 21/12 − 10/12 = 11/12 ✓. B dan E salah.
> **Kenapa pengecoh menarik:** B — pembilang dan penyebut dijumlah: 1 (3 + 5)/(4 + 6) (salah paham 1/2 + 1/3 = 2/5); E — hanya pita kado yang dikurangkan (tidak membaca soal sampai habis).
> **Periksa:** `F(7,4) + F(5,6) == F(31,12) and F(7,2) - F(31,12) == F(11,12) and F(7,4) - F(5,6) == F(11,12)`
> **Periksa:** `F(7,4) + F(5,6) != F(18,10) and F(7,2) - F(31,12) != F(7,4)`

#### Butir 30 · PG
Truk membawa 3/5 ton pasir. Sebanyak 0,25 ton diturunkan di Lamteumen. Lalu 20% dari muatan awal diturunkan di Kajhu.

Berapa ton pasir yang masih ada di truk?

A. 0,15
B. 0,23
C. 0,28
D. 0,35

> **Kunci:** B
> **Kelompok:** (M07)
> **Petunjuk:** Ubah 3/5 dan 20% ke desimal dulu. 20% dihitung dari muatan yang mana?
> **Langkah:** 3/5 = 0,6 ton. 20% × 0,6 = 0,12 ton. Sisa 0,6 − 0,25 − 0,12 = 0,23 ton.
> **Kenapa pengecoh menarik:** A — 20% dianggap 0,2 ton, bukan 20% dari muatan (bentuk tidak disamakan); C — 20% dihitung dari sisa 0,35 ton, padahal soal menyebut muatan awal (salah baca soal); D — hanya 0,25 ton yang dikurangkan.
> **Periksa:** `F(3,5) - F('0.25') - F(20,100) * F(3,5) == F('0.23')`

## Lembar jawaban

Nama: ______________________ Tanggal: ____________

Untuk PG kompleks, tulis semua hurufnya. Untuk PG kategori, tulis B atau S di tiap nomor pernyataan.

| No | Jawaban |
|---|---|
| 1 | |
| 2 | |
| 3 | |
| 4 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 5 | |
| 6 | |
| 7 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 8 | |
| 9 | |
| 10 | |
| 11 | |
| 12 | |
| 13 | |
| 14 | |
| 15 | |
| 16 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 17 | |
| 18 | |
| 19 | |
| 20 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 21 | |
| 22 | |
| 23 | |
| 24 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 25 | |
| 26 | |
| 27 | 1 ☐ 2 ☐ 3 ☐ 4 ☐ |
| 28 | |
| 29 | |
| 30 | |

## Kunci ringkas

Dibacakan pengajar di menit 85–88. Satu butir dihitung benar hanya kalau **seluruh** jawabannya tepat.

| No | Kunci | Topik | Bentuk |
|---|---|---|---|
| 1 | D | M05 | PG |
| 2 | B | M12 | PG |
| 3 | A | M02 | PG |
| 4 | 1-B, 2-S, 3-B, 4-S | M04 | PG kategori |
| 5 | B, C, D | M13 | PG kompleks |
| 6 | C | M10 | PG |
| 7 | 1-B, 2-S, 3-B, 4-S | M10 | PG kategori |
| 8 | B | M09 | PG |
| 9 | C | M07 | PG |
| 10 | C, D, E | M03 | PG kompleks |
| 11 | D | M06 | PG |
| 12 | B, D | M12 | PG kompleks |
| 13 | A | M01 | PG |
| 14 | B | M13 | PG |
| 15 | A, E | M11 | PG kompleks |
| 16 | 1-B, 2-S, 3-S, 4-B | M11 | PG kategori |
| 17 | C | M11 | PG |
| 18 | B | M05 | PG |
| 19 | B, D, E | M09 | PG kompleks |
| 20 | 1-S, 2-B, 3-S, 4-B | M07 | PG kategori |
| 21 | C | M02 | PG |
| 22 | D | M10 | PG |
| 23 | A | M12 | PG |
| 24 | 1-S, 2-B, 3-S, 4-B | M09 | PG kategori |
| 25 | A | M03 | PG |
| 26 | A | M06 | PG |
| 27 | 1-S, 2-B, 3-B, 4-S | M13 | PG kategori |
| 28 | D | M04 | PG |
| 29 | A, C, D | M05 | PG kompleks |
| 30 | B | M07 | PG |

**[HITUNGAN]** Sebaran kunci 18 butir PG: A 5 · B 5 · C 4 · D 4.

## Pemetaan analisis kesalahan

Dipakai pengajar untuk mengisi tabel B/H/S/W per anak (lihat `M14-simulasi-2.md` Halaman 2).

| Topik | Nomor butir | Banyak butir | Blok untuk soal tambal (Halaman 5 M14) |
|---|---|---|---|
| M01 · Operasi bilangan cacah | 13 | 1 | terlama |
| M02 · Faktor, kelipatan, KPK, FPB | 3, 21 | 2 | terlama |
| M03 · Pecahan senilai & membandingkan | 10, 25 | 2 | terlama |
| M04 · Pecahan, desimal, persen | 4, 28 | 2 | terlama |
| M05 · Penjumlahan & pengurangan pecahan | 1, 18, 29 | 3 | terlama |
| M06 · Perkalian & pembagian pecahan | 11, 26 | 2 | terlama |
| M07 · Operasi campuran lintas bentuk | 9, 20, 30 | 3 | terlama |
| M09 · Satuan panjang, berat, volume | 8, 19, 24 | 3 | sebelumnya |
| M10 · Waktu, kecepatan, laju perubahan | 6, 7, 22 | 3 | sebelumnya |
| M11 · Keliling & luas bangun datar | 15, 16, 17 | 3 | terbaru |
| M12 · Sudut & kekongruenan | 2, 12, 23 | 3 | terbaru |
| M13 · Penaksiran & pembulatan | 5, 14, 27 | 3 | terbaru |
| **Jumlah** | | **30** | |

**Butir yang diperkirakan paling sulit** **[ASUMSI — belum diuji pada anak]**: 7 (waktu dan kecepatan dalam empat pernyataan), 17 (luas gabungan persegi panjang dan segitiga, lalu biaya), 27 (kapan pembulatan dilakukan). Tiket keluar M14 adalah kembaran ketiga butir ini.
