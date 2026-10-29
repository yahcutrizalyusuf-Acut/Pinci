# S4 — Simulasi Akhir Matematika (M24 · P35)

| Hal | Ketentuan |
|---|---|
| Cakupan | M01–M23 (bobot `02-peta-spiral.md` Bagian 6, S4): Bilangan 12 · Geometri & Pengukuran 12 · Data 6 |
| Banyak butir | 30 |
| Waktu | 75 menit (menit 7–82 pertemuan M24) |
| Bentuk | PG 18 · PG kompleks 6 · PG kategori 6 |
| Dipakai di | `M24-latihan-bertempo-dan-simulasi-akhir.md` |

**Untuk pengajar.** Bagian `## Petunjuk ujian`, `## Naskah soal`, dan `## Lembar jawaban` difotokopi untuk anak. Blok kunci (baris berawalan `>`), `## Kunci ringkas`, dan `## Pemetaan uji tunda` **tidak** ikut difotokopi. Angka jarak dan jadwal di soal adalah angka soal, bukan data resmi **[ASUMSI]**.

---

## Petunjuk ujian

*Dibacakan pengajar di menit 5–7, apa adanya.*

1. Ada **30 soal**. Waktumu **75 menit**.
2. Kerjakan sendiri. Selama ujian, tidak ada yang bicara. Kakak tidak menjawab pertanyaan tentang soal.
3. Ada tiga bentuk soal:
   - "Pilih satu jawaban yang benar." Tulis **satu huruf**.
   - "Pilih **semua** jawaban yang benar. Jawaban benar bisa lebih dari satu." Tulis **semua hurufnya**, dipisah koma. Contoh: **A, C**.
   - "Tentukan **Benar** atau **Salah** untuk setiap pernyataan." Tulis nomor dan B atau S. Contoh: **1-B, 2-S, 3-B**.
4. Tulis jawabanmu di **lembar jawaban**, bukan di naskah soal. Naskah soal boleh dicoret-coret.
5. Setiap soal kira-kira **2,5 menit**. Kalau sudah 2,5 menit dan kamu belum menemukan jalan: pilih jawaban sementara, **lingkari nomornya** di lembar jawaban, lalu lanjut. Kembali ke soal berlingkar setelah nomor 30.
6. Kakak menulis **sisa waktu** di papan setiap 15 menit. Lihat patokan nomor di papan.
7. Soal yang jawabannya lebih dari satu dan soal yang meminta Benar atau Salah untuk setiap pernyataan: tutup pilihan lain dengan kertas, periksa satu per satu sampai yang terakhir.
8. Kalau sudah selesai sebelum waktu habis, periksa lagi. Jangan mengganggu teman.

---

## Naskah soal

#### Butir 1 · PG
Menjelang meugang, toko sepatu di Pasar Aceh memberi potongan harga 25%. Salsabila membeli sepatu seharga Rp240.000 sebelum potongan.

Berapa uang yang dibayar Salsabila?

A. Rp60.000
B. Rp180.000
C. Rp215.000
D. Rp300.000

> **Kunci:** B
> **Kelompok:** (M04)
> **Petunjuk:** Berapa rupiah potongannya? Potongan itu dikurangkan atau ditambahkan?
> **Langkah:** Potongan 25% × Rp240.000 = Rp60.000. Dibayar Rp240.000 − Rp60.000 = Rp180.000.
> **Kenapa pengecoh menarik:** A — berhenti di besar potongan, salah baca soal; C — 25% dibaca Rp25.000; D — potongan ditambahkan.
> **Periksa:** `240000 - 240000 * 25 / 100 == 180000`

#### Butir 2 · PG
Denah angka ini menunjukkan susunan kubus. Angka di kotak adalah banyak kubus yang bertumpuk.

| | Kiri | Tengah | Kanan |
|---|---|---|---|
| Belakang | 3 | 1 | 2 |
| Depan | 1 | 2 | 1 |

Berapa banyak persegi pada gambar tampak depan?

A. 4
B. 6
C. 7
D. 10

> **Kunci:** C
> **Kelompok:** (M17)
> **Petunjuk:** Dari depan, setiap kolom kiri, tengah, kanan setinggi tumpukan yang mana?
> **Langkah:** Kolom kiri: tertinggi 3. Kolom tengah: tertinggi 2. Kolom kanan: tertinggi 2. 3 + 2 + 2 = 7 persegi.
> **Kenapa pengecoh menarik:** A — hanya baris depan (1 + 2 + 1); B — hanya baris belakang (3 + 1 + 2); D — menghitung semua kubus, bukan tampak depan.
> **Periksa:** `max(3, 1) + max(1, 2) + max(2, 1) == 7`

#### Butir 3 · PG kategori
Bus Trans Koetaradja jurusan Lampulo berangkat dari halte setiap 12 menit. Bus jurusan Darussalam berangkat dari halte yang sama setiap 18 menit. Keduanya berangkat bersama pukul 06.00.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Kedua bus berangkat bersama lagi pukul 06.36. | ☐ | ☐ |
| 2. Waktu berangkat bersama lagi dicari dengan FPB. | ☐ | ☐ |
| 3. Bus jurusan Lampulo juga berangkat pukul 06.24. | ☐ | ☐ |
| 4. Kedua bus berangkat bersama pukul 07.00. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B, 4-S
> **Kelompok:** (M02)
> **Petunjuk:** Kejadiannya berulang dan bertemu lagi. Kelipatan atau faktor?
> **Langkah:** KPK(12, 18) = 36. (1) 06.00 + 36 menit = 06.36 → Benar. (2) Yang dipakai KPK → Salah. (3) 24 kelipatan 12 → Benar. (4) Bersama pada menit ke-36, 72, …; 60 bukan kelipatan 36 → Salah.
> **Kenapa pernyataan salah menarik:** 2 — KPK dan FPB tertukar; 4 — pukul 07.00 terasa "bulat", anak menebak tanpa memeriksa kelipatan 36.
> **Periksa:** `lcm(12, 18) == 36`
> **Periksa:** `24 % 12 == 0`
> **Periksa:** `60 % lcm(12, 18) != 0`

### Stimulus A: Buku yang dibaca saat libur

Tabel frekuensi ini menunjukkan banyak buku yang dibaca 20 anak kelas 6 selama libur sekolah.

| Banyak buku | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Banyak anak | 3 | 6 | 5 | 4 | 2 |

#### Butir 4 · PG
Berdasarkan tabel A, berapa anak yang membaca **paling sedikit** 3 buku?

A. 5
B. 6
C. 9
D. 11

> **Kunci:** D
> **Kelompok:** (M21)
> **Petunjuk:** "Paling sedikit 3 buku" artinya 3 buku ikut atau tidak?
> **Langkah:** Paling sedikit 3 buku = 3, 4, atau 5 buku. Banyak anak 5 + 4 + 2 = 11.
> **Kenapa pengecoh menarik:** A — hanya kolom 3 buku; B — 3 buku tidak ikut dihitung (4 + 2), salah baca "paling sedikit"; C — menghitung anak yang membaca kurang dari 3 buku (3 + 6).
> **Periksa:** `5 + 4 + 2 == 11`

#### Butir 5 · PG kategori
Berdasarkan tabel A, tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Banyak anak di tabel 20 orang. | ☐ | ☐ |
| 2. Jumlah semua buku yang dibaca 15 buku. | ☐ | ☐ |
| 3. Lebih dari separuh anak membaca kurang dari 3 buku. | ☐ | ☐ |
| 4. Tanpa 2 anak pembaca 5 buku, rata-ratanya lebih kecil daripada semula. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-S, 4-B
> **Kelompok:** (M22)
> **Petunjuk:** Tutup pernyataan lain. Angka 6 di bawah "2 buku" artinya apa?
> **Langkah:** (1) 3 + 6 + 5 + 4 + 2 = 20 → Benar. (2) 1 × 3 + 2 × 6 + 3 × 5 + 4 × 4 + 5 × 2 = 56 buku → Salah. (3) Kurang dari 3 buku: 3 + 6 = 9 anak, tidak lebih dari 10 → Salah. (4) Rata-rata 20 anak = 56 : 20 = 2,8. Tanpa 2 anak itu: 46 : 18 ≈ 2,56 → lebih kecil → Benar.
> **Kenapa pernyataan salah menarik:** 2 — frekuensi tidak dikalikan (1 + 2 + 3 + 4 + 5 = 15); 3 — 9 anak terasa banyak, anak menaksir tanpa membandingkan dengan separuh dari 20.
> **Periksa:** `3 + 6 + 5 + 4 + 2 == 20`
> **Periksa:** `1*3 + 2*6 + 3*5 + 4*4 + 5*2 != 15`
> **Periksa:** `(3 + 6) * 2 <= 20`
> **Periksa:** `F(1*3 + 2*6 + 3*5 + 4*4, 18) < F(1*3 + 2*6 + 3*5 + 4*4 + 5*2, 20)`

#### Butir 6 · PG
Berdasarkan tabel A, berapa rata-rata banyak buku yang dibaca setiap anak?

A. 0,75
B. 2,8
C. 3
D. 11,2

> **Kunci:** B
> **Kelompok:** (M22)
> **Petunjuk:** Nilai dikali banyak anaknya dulu. Lalu dibagi banyak anak atau banyak kolom?
> **Langkah:** Jumlah buku 3 + 12 + 15 + 16 + 10 = 56. Banyak anak 20. 56 : 20 = 2,8.
> **Kenapa pengecoh menarik:** A — frekuensi tidak dikalikan: 15 : 20; C — frekuensi tidak dikalikan dan dibagi 5 kolom: 15 : 5; D — dibagi 5 kolom: 56 : 5.
> **Periksa:** `F(1*3 + 2*6 + 3*5 + 4*4 + 5*2, 20) == F('2.8')`

### Butir lepas (nomor 7–10)

#### Butir 7 · PG
Kebun Pak Raihan berbentuk persegi panjang, 18 m × 15 m. Di pojok kebun dibuat kolam berbentuk persegi dengan sisi 5 m.

Berapa luas kebun yang **tidak** menjadi kolam?

A. 66 m
B. 245 m²
C. 260 m²
D. 270 m²

> **Kunci:** B
> **Kelompok:** (M11)
> **Petunjuk:** Luas kebun seluruhnya berapa? Luas kolam berapa?
> **Langkah:** Kebun 18 × 15 = 270 m². Kolam 5 × 5 = 25 m². 270 − 25 = 245 m².
> **Kenapa pengecoh menarik:** A — menghitung keliling kebun 2 × (18 + 15), tertukar antara keliling dan luas; C — luas kolam dihitung 5 × 2 = 10 m²; D — lupa mengurangkan kolam.
> **Periksa:** `18 * 15 - 5 * 5 == 245`

#### Butir 8 · PG
Zahra punya 3 kg tepung. Ia memakai 1 1/2 kg untuk timphan dan 3/4 kg untuk bolu.

Berapa kg sisa tepung Zahra?

A. 3/4
B. 1 1/3
C. 1 1/2
D. 2 1/4

> **Kunci:** A
> **Kelompok:** (M05)
> **Petunjuk:** Berapa kg tepung yang dipakai seluruhnya? Samakan penyebut dulu.
> **Langkah:** 1 1/2 + 3/4 = 6/4 + 3/4 = 9/4 = 2 1/4 kg. Sisa 3 − 2 1/4 = 3/4 kg.
> **Kenapa pengecoh menarik:** B — 1/2 + 3/4 dihitung (1 + 3)/(2 + 4) = 4/6, jadi dipakai 1 2/3 kg; C — hanya tepung timphan yang dikurangkan; D — berhenti di jumlah tepung yang dipakai.
> **Periksa:** `3 - (F(3,2) + F(3,4)) == F(3,4)`


#### Butir 9 · PG kompleks
Di kelas 6A ada 12 anak laki-laki dan 18 anak perempuan.

Pilih **semua** jawaban yang benar. Jawaban benar bisa lebih dari satu.

A. Laki-laki : perempuan = 2 : 3
B. Perempuan : laki-laki = 2 : 3
C. Laki-laki : semua anak = 2 : 5
D. Perempuan : semua anak = 3 : 2
E. Laki-laki : perempuan = 12 : 30

> **Kunci:** A, C
> **Kelompok:** (M18)
> **Petunjuk:** Periksa urutan di setiap rasio. Semua anak ada berapa?
> **Langkah:** (A) 12 : 18 = 2 : 3 ✓. (B) perempuan : laki-laki = 18 : 12 = 3 : 2 ✗. (C) 12 : 30 = 2 : 5 ✓. (D) 18 : 30 = 3 : 5 ✗. (E) perempuan 18, bukan 30 ✗.
> **Kenapa pengecoh menarik:** B — urutan rasio dibalik; D — urutan dibalik dan semua anak tertukar dengan laki-laki; E — banyak semua anak dipakai sebagai banyak perempuan. Anak yang berhenti setelah A juga salah.
> **Periksa:** `F(12, 18) == F(2, 3) and F(12, 12 + 18) == F(2, 5)`
> **Periksa:** `F(18, 12) != F(2, 3) and F(18, 12 + 18) != F(3, 2)`

#### Butir 10 · PG kompleks
Sebotol sirup berisi 1,25 L. Sirup dituang ke 5 gelas sama banyak.

Pilih **semua** yang sama dengan isi satu gelas. Jawaban benar bisa lebih dari satu.

A. 250 mL
B. 25 mL
C. 250 cm³
D. 0,025 L
E. 0,25 dm³

> **Kunci:** A, C, E
> **Kelompok:** (M09)
> **Petunjuk:** Satu gelas berisi berapa liter? 1 L sama dengan berapa mL, berapa cm³, berapa dm³?
> **Langkah:** 1,25 : 5 = 0,25 L. 0,25 L = 250 mL ✓ = 250 cm³ ✓ = 0,25 dm³ ✓. 25 mL ✗. 0,025 L ✗.
> **Kenapa pengecoh menarik:** B — 1,25 L dikira 125 mL, lalu dibagi 5; D — koma digeser satu tempat terlalu jauh saat membagi. Anak yang berhenti setelah A juga salah.
> **Periksa:** `F('1.25') / 5 * 1000 == 250 and F('1.25') / 5 == F('0.25')`
> **Periksa:** `F('1.25') / 5 * 1000 != 25 and F('1.25') / 5 != F('0.025')`

### Stimulus B: Kapal cepat ke Sabang

Kapal cepat berangkat dari Pelabuhan Ulee Lheue pukul 08.00. Kapal tiba di Pelabuhan Balohan, Sabang, pukul 08.45. Jarak kedua pelabuhan 30 km.

#### Butir 11 · PG
Berdasarkan cerita B, jarak kedua pelabuhan digambar di peta berskala 1 : 1.500.000.

Berapa jaraknya di peta?

A. 0,2 cm
B. 2 cm
C. 20 cm
D. 200 cm

> **Kunci:** B
> **Kelompok:** (M19)
> **Petunjuk:** 30 km sama dengan berapa cm? Lalu dibagi atau dikali skalanya?
> **Langkah:** 30 km = 3.000.000 cm. 3.000.000 : 1.500.000 = 2 cm.
> **Kenapa pengecoh menarik:** A — km ke cm dikali 10.000 (satu nol kurang); C — km ke cm dikali 1.000.000 (satu nol lebih); D — km ke cm dikali 10.000.000. Semuanya salah tangga satuan. **[ASUMSI — jarak 30 km adalah angka soal; PERLU DICEK kalau ingin dipakai sebagai fakta]**
> **Periksa:** `30 * 100000 / 1500000 == 2`

#### Butir 12 · PG kategori
Berdasarkan cerita B, tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Lama perjalanan kapal 45 menit. | ☐ | ☐ |
| 2. Kecepatan rata-rata kapal 30 km/jam. | ☐ | ☐ |
| 3. Dengan kecepatan tetap, 30 menit pertama kapal menempuh 20 km. | ☐ | ☐ |
| 4. Dengan kecepatan 60 km/jam, perjalanan itu 30 menit. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B, 4-B
> **Kelompok:** (M10)
> **Petunjuk:** Tutup pernyataan lain. 45 menit sama dengan berapa jam?
> **Langkah:** (1) 08.00 ke 08.45 = 45 menit → Benar. (2) 45 menit = 3/4 jam. 30 : 3/4 = 40 km/jam → Salah. (3) 40 km/jam × 1/2 jam = 20 km → Benar. (4) 30 : 60 = 1/2 jam = 30 menit → Benar.
> **Kenapa pernyataan salah menarik:** 2 — jarak dianggap sama dengan kecepatan karena 45 menit "hampir satu jam". Anak yang menemukan Salah di nomor 2 lalu menebak pola bisa keliru di nomor 3 atau 4.
> **Periksa:** `8*60+45 - 8*60 == 45`
> **Periksa:** `F(30, 45) * 60 != 30`
> **Periksa:** `F(30, 45) * 60 * F(1, 2) == 20`
> **Periksa:** `F(30, 60) * 60 == 30`

### Butir lepas (nomor 13–18)

#### Butir 13 · PG
Rombongan anak menyewa perahu wisata di Sabang. Biaya sewa dibagi rata. Kalau rombongan 12 orang, setiap orang membayar Rp150.000.

Kalau rombongan 18 orang, berapa yang dibayar setiap orang?

A. Rp100.000
B. Rp144.000
C. Rp225.000
D. Rp1.800.000

> **Kunci:** A
> **Kelompok:** (M19)
> **Petunjuk:** Orangnya bertambah. Bagian setiap orang bertambah atau berkurang?
> **Langkah:** Berbalik nilai. Biaya sewa 12 × Rp150.000 = Rp1.800.000. Setiap orang Rp1.800.000 : 18 = Rp100.000.
> **Kenapa pengecoh menarik:** B — dikurangi Rp6.000 karena orangnya bertambah 6; C — dikerjakan sebagai perbandingan senilai (150.000 × 18 : 12); D — berhenti di biaya sewa seluruhnya.
> **Periksa:** `12 * 150000 / 18 == 100000`

#### Butir 14 · PG
Panitia buka puasa bersama menerima 45 dus air mineral. Setiap dus berisi 24 botol. Semua botol dibagi sama banyak ke 8 meunasah. Setiap meunasah memakai 60 botol.

Berapa botol yang tersisa di setiap meunasah?

A. 75
B. 127
C. 135
D. 1.020

> **Kunci:** A
> **Kelompok:** (M01)
> **Petunjuk:** Berapa botol semuanya? Berapa botol yang diterima satu meunasah?
> **Langkah:** 45 × 24 = 1.080 botol. 1.080 : 8 = 135 botol per meunasah. 135 − 60 = 75 botol.
> **Kenapa pengecoh menarik:** B — dikurangi 8, banyak meunasah dipakai sebagai banyak botol; C — berhenti sebelum mengurangkan 60; D — 60 dikurangkan dari semua botol, lupa membagi ke 8 meunasah.
> **Periksa:** `45 * 24 / 8 - 60 == 75`

#### Butir 15 · PG kompleks
Dua kubus berusuk 3 cm ditempel sisi ke sisi. Hasilnya satu bangun ruang gabungan.

Pilih **semua** pernyataan yang benar. Jawaban benar bisa lebih dari satu.

A. Volumenya 54 cm³.
B. Luas permukaannya 108 cm².
C. Ada 2 sisi yang berimpit.
D. Bangun gabungan itu berbentuk kubus.
E. Luas permukaannya 90 cm².

> **Kunci:** A, C, E
> **Kelompok:** (M16)
> **Petunjuk:** Sisi yang berimpit terlihat dari luar atau tidak? Satu tempelan berisi berapa sisi?
> **Langkah:** (A) 2 × 27 = 54 cm³ ✓. (B) 2 × 54 = 108 cm² belum dikurangi sisi yang berimpit ✗. (C) Satu sisi dari tiap kubus menempel: 2 sisi ✓. (D) Ukurannya 6 cm × 3 cm × 3 cm, jadi balok ✗. (E) 108 − 2 × 9 = 90 cm² ✓.
> **Kenapa pengecoh menarik:** B — sisi yang berimpit tidak dikurangkan; D — dua kubus dikira tetap kubus. Anak yang berhenti setelah A juga salah.
> **Periksa:** `2 * 3 * 3 * 3 == 54 and 2 * 6 * 3 * 3 - 2 * 3 * 3 == 90`
> **Periksa:** `2 * 6 * 3 * 3 - 2 * 3 * 3 != 108`

#### Butir 16 · PG
Piktogram ini menunjukkan sampah plastik yang dikumpulkan tiga kelas.

```
Sampah plastik terkumpul
Kelas 4  ■ ■ ■ □
Kelas 5  ■ ■ ■ ■ ■
Kelas 6  ■ ■ ■ ■ □
Kunci: ■ = 8 kg
       □ = 4 kg
```

Semua plastik dijual Rp3.000 per kg. Berapa uang yang diperoleh ketiga kelas?

A. Rp42.000
B. Rp288.000
C. Rp312.000
D. Rp336.000

> **Kunci:** C
> **Kelompok:** (M21)
> **Petunjuk:** Ada dua gambar di kunci. Berapa kg setiap kelas?
> **Langkah:** Kelas 4: 3 × 8 + 4 = 28 kg. Kelas 5: 5 × 8 = 40 kg. Kelas 6: 4 × 8 + 4 = 36 kg. Jumlah 104 kg. 104 × Rp3.000 = Rp312.000.
> **Kenapa pengecoh menarik:** A — kunci piktogram diabaikan, setiap gambar dihitung 1 kg (14 gambar × Rp3.000); B — gambar □ diabaikan (96 kg); D — gambar □ dihitung 8 kg (112 kg).
> **Periksa:** `((3 * 8 + 4) + 5 * 8 + (4 * 8 + 4)) * 3000 == 312000`

#### Butir 17 · PG kompleks
Keumala menuang jus ke gelas. Isinya harus lebih dari 1/2 gelas. Isinya juga harus kurang dari 3/4 gelas.

Pilih **semua** isi gelas yang memenuhi. Jawaban benar bisa lebih dari satu.

A. 3/8 gelas
B. 4/7 gelas
C. 2/3 gelas
D. 7/9 gelas
E. 5/6 gelas

> **Kunci:** B, C
> **Kelompok:** (M03)
> **Petunjuk:** Bandingkan setiap pecahan dengan 1/2, lalu dengan 3/4. Samakan penyebut atau ubah ke desimal.
> **Langkah:** (A) 3/8 < 4/8 = 1/2 ✗. (B) 4/7 > 1/2 karena 8/14 > 7/14; 4/7 < 3/4 karena 16/28 < 21/28 ✓. (C) 2/3 = 8/12, di antara 6/12 dan 9/12 ✓. (D) 7/9 = 28/36 > 27/36 = 3/4 ✗. (E) 5/6 = 10/12 > 9/12 ✗.
> **Kenapa pengecoh menarik:** A — penyebut 8 besar, dikira nilainya besar; D — pembilang dan penyebut besar, dikira dekat dengan 3/4; E — selisih pembilang dan penyebut sama-sama 1 seperti 3/4, dikira senilai. Anak yang berhenti setelah B juga salah.
> **Periksa:** `F(1,2) < F(4,7) < F(3,4) and F(1,2) < F(2,3) < F(3,4)`
> **Periksa:** `not F(1,2) < F(3,8) and not F(7,9) < F(3,4) and not F(5,6) < F(3,4)`

#### Butir 18 · PG
Segitiga KLM dan segitiga XYZ kongruen. Sudut K bersesuaian dengan X, L dengan Y, M dengan Z. Besar sudut K = 40° dan sudut L = 75°.

Berapa besar sudut Z?

A. 40°
B. 65°
C. 75°
D. 115°

> **Kunci:** B
> **Kelompok:** (M12)
> **Petunjuk:** Sudut Z sama besar dengan sudut apa di segitiga KLM? Jumlah sudut segitiga berapa?
> **Langkah:** Z bersesuaian dengan M. Sudut M = 180° − (40° + 75°) = 65°. Karena kongruen, sudut Z = 65°.
> **Kenapa pengecoh menarik:** A — memakai sudut K, salah membaca pasangan yang bersesuaian; C — memakai sudut L; D — berhenti di 40° + 75°.
> **Periksa:** `180 - (40 + 75) == 65`

### Stimulus C: Kolam lele Pak Farhan

Kolam lele Pak Farhan berbentuk balok tanpa tutup. Panjangnya 3 m, lebarnya 2 m, dalamnya 1 m. Pak Farhan juga punya kolam kedua berbentuk kubus dengan rusuk 2 m.

#### Butir 19 · PG
Berdasarkan cerita C, kolam balok diisi air sampai 3/4 bagian.

Berapa liter air di kolam balok?

A. 450 L
B. 1.500 L
C. 4.500 L
D. 6.000 L

> **Kunci:** C
> **Kelompok:** (M15)
> **Petunjuk:** Volume kolam penuh berapa m³? 1 m³ sama dengan berapa liter?
> **Langkah:** Volume 3 × 2 × 1 = 6 m³ = 6.000 L. 3/4 × 6.000 = 4.500 L.
> **Kenapa pengecoh menarik:** A — 1 m³ dikira 100 L, salah tangga satuan; B — menghitung bagian yang masih kosong (1/4); D — kolam dianggap penuh, 3/4 terlewat.
> **Periksa:** `3 * 2 * 1 * 1000 * F(3,4) == 4500`

#### Butir 20 · PG
Berdasarkan cerita C, seluruh dinding dan alas bagian dalam kolam balok dicat.

Berapa luas bagian yang dicat?

A. 6 m³
B. 10 m²
C. 11 m²
D. 16 m²

> **Kunci:** D
> **Kelompok:** (M16)
> **Petunjuk:** Kolam tanpa tutup punya berapa sisi? Sebutkan satu per satu.
> **Langkah:** Alas 3 × 2 = 6 m². Dua dinding panjang 2 × (3 × 1) = 6 m². Dua dinding pendek 2 × (2 × 1) = 4 m². Jumlah 6 + 6 + 4 = 16 m².
> **Kenapa pengecoh menarik:** A — menghitung volume, tertukar antara volume dan luas permukaan; B — alas terlupa, hanya dinding; C — setiap jenis sisi dihitung sekali saja (6 + 3 + 2).
> **Periksa:** `3 * 2 + 2 * (3 * 1) + 2 * (2 * 1) == 16`

#### Butir 21 · PG kategori
Berdasarkan cerita C, tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Volume kolam kubus 8 m³. | ☐ | ☐ |
| 2. Volume kolam kubus lebih besar daripada kolam balok. | ☐ | ☐ |
| 3. Volume kolam kubus 6 m³. | ☐ | ☐ |
| 4. Selisih volume kedua kolam 2.000 L. | ☐ | ☐ |

> **Kunci:** 1-B, 2-B, 3-S, 4-B
> **Kelompok:** (M15)
> **Petunjuk:** Tutup pernyataan lain. Volume kubus = rusuk × rusuk × rusuk.
> **Langkah:** (1) 2 × 2 × 2 = 8 m³ → Benar. (2) 8 m³ > 6 m³ → Benar. (3) 6 m³ didapat dari 2 × 3, rusuk dikali 3 → Salah. (4) 8 − 6 = 2 m³ = 2.000 L → Benar.
> **Kenapa pernyataan salah menarik:** 3 — rusuk dikali 3, bukan dipangkatkan tiga, dan angka 6 sudah terlihat sebagai volume kolam balok. Anak yang menebak "sudah dua Benar, pasti ada Salah" di nomor 4 akan keliru.
> **Periksa:** `2 * 2 * 2 == 8`
> **Periksa:** `2 * 2 * 2 > 3 * 2 * 1`
> **Periksa:** `2 * 2 * 2 != 2 * 3`
> **Periksa:** `(2 * 2 * 2 - 3 * 2 * 1) * 1000 == 2000`

### Butir lepas (nomor 22–24)

#### Butir 22 · PG kategori
Harga 1 kg ikan tongkol di TPI Lampulo Rp40.000. Bu Intan membeli 2,5 kg. Ia mendapat potongan 10% dari harga seluruhnya.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Harga sebelum potongan Rp100.000. | ☐ | ☐ |
| 2. Besar potongannya Rp10.000. | ☐ | ☐ |
| 3. Uang yang dibayar Bu Intan Rp96.000. | ☐ | ☐ |
| 4. Kalau Bu Intan membayar dengan uang Rp100.000, kembaliannya Rp20.000. | ☐ | ☐ |

> **Kunci:** 1-B, 2-B, 3-S, 4-S
> **Kelompok:** (M07)
> **Petunjuk:** Tutup pernyataan lain. Potongan 10% dihitung dari harga 1 kg atau harga seluruhnya?
> **Langkah:** (1) 2,5 × Rp40.000 = Rp100.000 → Benar. (2) 10% × Rp100.000 = Rp10.000 → Benar. (3) Yang dibayar Rp100.000 − Rp10.000 = Rp90.000, bukan Rp96.000 → Salah. (4) Kembalian Rp100.000 − Rp90.000 = Rp10.000, bukan Rp20.000 → Salah.
> **Kenapa pernyataan salah menarik:** 3 — potongan dihitung dari harga 1 kg (10% × Rp40.000 = Rp4.000), salah baca "dari harga seluruhnya"; 4 — potongan dikurangkan dua kali. Anak yang sudah menemukan satu Salah lalu menebak "sisanya Benar" keliru di nomor 4.
> **Periksa:** `40000 * F('2.5') == 100000`
> **Periksa:** `40000 * F('2.5') * 10 / 100 == 10000`
> **Periksa:** `40000 * F('2.5') * 90 / 100 != 96000`
> **Periksa:** `100000 - 40000 * F('2.5') * 90 / 100 != 20000`

#### Butir 23 · PG
Tinggi air di tandon rumah Nayla 120 cm. Karena dipakai, tinggi air turun 4 cm setiap 15 menit.

Setelah berapa lama tinggi air tinggal 72 cm?

A. 3 jam
B. 4 jam 30 menit
C. 7 jam 30 menit
D. 12 jam

> **Kunci:** A
> **Kelompok:** (M10)
> **Petunjuk:** Air harus turun berapa cm? Setiap 4 cm butuh berapa menit?
> **Langkah:** Turun 120 − 72 = 48 cm. 48 : 4 = 12 kali. 12 × 15 menit = 180 menit = 3 jam.
> **Kenapa pengecoh menarik:** B — memakai 72 cm sebagai besar penurunan (72 : 4 × 15 = 270 menit); C — memakai 120 cm (120 : 4 × 15 = 450 menit); D — 12 kali dibaca 12 jam, lupa dikali 15 menit.
> **Periksa:** `(120 - 72) / 4 * 15 == 180`

#### Butir 24 · PG
Perbandingan uang Nayla dan uang Rafli 3 : 5. Uang Rafli Rp24.000 lebih banyak daripada uang Nayla.

Berapa uang Rafli?

A. Rp12.000
B. Rp36.000
C. Rp40.000
D. Rp60.000

> **Kunci:** D
> **Kelompok:** (M18)
> **Petunjuk:** Selisih uang mereka sama dengan berapa bagian?
> **Langkah:** Selisih 5 − 3 = 2 bagian = Rp24.000. 1 bagian = Rp12.000. Uang Rafli 5 × Rp12.000 = Rp60.000.
> **Kenapa pengecoh menarik:** A — berhenti di nilai 1 bagian; B — menjawab uang Nayla, salah baca soal; C — Rp24.000 dianggap 3 bagian (24.000 × 5 : 3).
> **Periksa:** `24000 / (5 - 3) * 5 == 60000`

### Stimulus D: Kelapa muda Pak Iqbal

Diagram batang ini menunjukkan kelapa muda yang terjual di lapak Pak Iqbal, Pantai Ulee Lheue.

```
Kelapa muda terjual
(buah)
90 │                     ███
80 │                     ███
70 │                     ███
60 │           ███       ███
50 │           ███  ███  ███
40 │ ███       ███  ███  ███
30 │ ███  ███  ███  ███  ███
20 │ ███  ███  ███  ███  ███
10 │ ███  ███  ███  ███  ███
 0 └─────────────────────────
     Sen  Sel  Rab  Kam  Jum
```

#### Butir 25 · PG kompleks
Berdasarkan diagram D, pilih **semua** pernyataan yang benar. Jawaban benar bisa lebih dari satu.

A. Kamis terjual 50 buah.
B. Selisih Jumat dan Kamis 40 buah.
C. Senin sampai Rabu terjual 13 buah.
D. Penjualan Rabu 2 kali penjualan Selasa.
E. Penjualan Jumat 2 kali penjualan Senin.

> **Kunci:** A, B, D
> **Kelompok:** (M21)
> **Petunjuk:** Sumbu tegaknya naik berapa-berapa? Periksa setiap pilihan sampai E.
> **Langkah:** Sumbu tegak naik 10. Sen 40, Sel 30, Rab 60, Kam 50, Jum 90. (A) 50 ✓. (B) 90 − 50 = 40 ✓. (C) 40 + 30 + 60 = 130, bukan 13 ✗. (D) 60 = 2 × 30 ✓. (E) 2 × 40 = 80, bukan 90 ✗.
> **Kenapa pengecoh menarik:** C — menghitung baris batang tanpa membaca sumbu (4 + 3 + 6); E — batang Jumat terlihat "kira-kira dua kali" batang Senin, anak menaksir tanpa membaca angka. Anak yang berhenti setelah A juga salah.
> **Periksa:** `90 - 50 == 40 and 60 == 2 * 30`
> **Periksa:** `40 + 30 + 60 != 13 and 90 != 2 * 40`

#### Butir 26 · PG
Berdasarkan diagram D, berapa rata-rata kelapa muda yang terjual per hari?

A. 5,4
B. 50
C. 54
D. 67,5

> **Kunci:** C
> **Kelompok:** (M22)
> **Petunjuk:** Jumlahkan semua data dulu. Ada berapa hari?
> **Langkah:** 40 + 30 + 60 + 50 + 90 = 270. 270 : 5 = 54 buah.
> **Kenapa pengecoh menarik:** A — memakai banyak baris batang (27 : 5), sumbu tidak dibaca; B — memilih data yang di tengah setelah diurutkan, mengira itu rata-rata (saat analisis kesalahan cukup sebut "data yang di tengah", tanpa nama istilah lain); D — dibagi 4, banyak hari salah hitung.
> **Periksa:** `(40 + 30 + 60 + 50 + 90) / 5 == 54`

#### Butir 27 · PG
Berdasarkan diagram D, Pak Iqbal menaksir uang penjualan hari Jumat. Harga satu kelapa muda Rp9.800. Harga itu dibulatkan ke ribuan terdekat.

Berapa taksiran uang penjualan hari Jumat?

A. Rp810.000
B. Rp882.000
C. Rp900.000
D. Rp980.000

> **Kunci:** C
> **Kelompok:** (M13)
> **Petunjuk:** Rp9.800 dibulatkan ke ribuan terdekat menjadi berapa? Hari Jumat terjual berapa buah?
> **Langkah:** Rp9.800 ≈ Rp10.000. Jumat 90 buah. Taksiran 90 × Rp10.000 = Rp900.000.
> **Kenapa pengecoh menarik:** A — Rp9.800 dibulatkan ke bawah menjadi Rp9.000; B — menghitung hasil pasti, bukan taksiran; D — batang Jumat dibaca 100 buah, lalu dikali Rp9.800.
> **Periksa:** `90 * round(9800, -3) == 900000`

### Butir lepas (nomor 28–30)

#### Butir 28 · PG kompleks
Taman bunga di halaman sekolah berbentuk segitiga siku-siku. Panjang dua sisi siku-sikunya 6 m dan 8 m. Sisi miringnya 10 m.

Pilih **semua** pernyataan yang benar. Jawaban benar bisa lebih dari satu.

A. Kelilingnya 24 m.
B. Luasnya 48 m².
C. Luasnya 24 m².
D. Luasnya 24 m.

> **Kunci:** A, C
> **Kelompok:** (M11)
> **Petunjuk:** Untuk luas segitiga, alas dan tinggi yang mana? Jangan lupa satuannya.
> **Langkah:** (A) 6 + 8 + 10 = 24 m ✓. (B) 6 × 8 = 48 belum dibagi 2 ✗. (C) 6 × 8 : 2 = 24 m² ✓. (D) Angka benar, satuan keliling ✗.
> **Kenapa pengecoh menarik:** B — luas segitiga lupa dibagi 2; D — angka luas benar tetapi satuannya salah. Anak yang berhenti setelah A juga salah.
> **Periksa:** `6 + 8 + 10 == 24 and 6 * 8 / 2 == 24`
> **Periksa:** `6 * 8 / 2 != 48`

#### Butir 29 · PG
Sebotol sirup berisi 1 1/2 L. Sirup dituang ke gelas-gelas kecil. Setiap gelas berisi 1/4 L.

Berapa gelas yang terisi penuh?

A. 3/8
B. 1 3/4
C. 4
D. 6

> **Kunci:** D
> **Kelompok:** (M06)
> **Petunjuk:** Ada berapa 1/4 di dalam 1 1/2?
> **Langkah:** 1 1/2 : 1/4 = 3/2 : 1/4 = 3/2 × 4/1 = 6 gelas.
> **Kenapa pengecoh menarik:** A — dikali, bukan dibagi (3/2 × 1/4); B — dijumlahkan (1 1/2 + 1/4); C — bagian 1/2 diabaikan, hanya 1 : 1/4.
> **Periksa:** `F(3,2) / F(1,4) == 6`

#### Butir 30 · PG kategori
Denah angka ini menunjukkan susunan kubus. Angka di kotak adalah banyak kubus yang bertumpuk. Angka 0 berarti kotak itu kosong.

| | Kiri | Tengah | Kanan |
|---|---|---|---|
| Belakang | 2 | 0 | 1 |
| Depan | 3 | 1 | 1 |

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Gambar tampak atas terdiri dari 6 persegi. | ☐ | ☐ |
| 2. Banyak kubus seluruhnya 8. | ☐ | ☐ |
| 3. Gambar tampak depan terdiri dari 5 persegi. | ☐ | ☐ |
| 4. Tumpukan paling tinggi terdiri dari 3 kubus. | ☐ | ☐ |

> **Kunci:** 1-S, 2-B, 3-B, 4-B
> **Kelompok:** (M17)
> **Petunjuk:** Tutup pernyataan lain. Kotak berangka 0 terlihat dari atas atau tidak?
> **Langkah:** (1) Kotak berisi kubus ada 5, kotak 0 kosong → tampak atas 5 persegi → Salah. (2) 2 + 0 + 1 + 3 + 1 + 1 = 8 → Benar. (3) Kolom kiri 3, tengah 1, kanan 1 → 5 → Benar. (4) Tumpukan tertinggi 3 → Benar.
> **Kenapa pernyataan salah menarik:** 1 — semua kotak denah dihitung, termasuk kotak kosong. Anak yang mengira "harus ada Salah di akhir" bisa keliru di nomor 4.
> **Periksa:** `sum(1 for x in [2, 0, 1, 3, 1, 1] if x > 0) != 6`
> **Periksa:** `2 + 0 + 1 + 3 + 1 + 1 == 8`
> **Periksa:** `max(2, 3) + max(0, 1) + max(1, 1) == 5`
> **Periksa:** `max([2, 0, 1, 3, 1, 1]) == 3`

---

## Lembar jawaban

Nama: ______________________ · Tanggal: ____________

Lingkari nomor soal yang ingin kamu datangi lagi.

| No | Jawaban |
|---|---|
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |
| 6 | |
| 7 | |
| 8 | |
| 9 | |
| 10 | |
| 11 | |
| 12 | |
| 13 | |
| 14 | |
| 15 | |
| 16 | |
| 17 | |
| 18 | |
| 19 | |
| 20 | |
| 21 | |
| 22 | |
| 23 | |
| 24 | |
| 25 | |
| 26 | |
| 27 | |
| 28 | |
| 29 | |
| 30 | |

---

## Kunci ringkas

Untuk pengajar. Saat analisis kesalahan (menit 87–95), anak hanya diberi kolom **No** dan **Kunci**. Kolom kode B/H/S/W ditulis anak di lembar jawabannya sendiri.

| No | Kunci | Topik | Bentuk | Domain |
|---|---|---|---|---|
| 1 | B | M04 | PG | Bilangan |
| 2 | C | M17 | PG | Geometri & Pengukuran |
| 3 | 1-B, 2-S, 3-B, 4-S | M02 | PG kategori | Bilangan |
| 4 | D | M21 | PG | Data |
| 5 | 1-B, 2-S, 3-S, 4-B | M22 | PG kategori | Data |
| 6 | B | M22 | PG | Data |
| 7 | B | M11 | PG | Geometri & Pengukuran |
| 8 | A | M05 | PG | Bilangan |
| 9 | A, C | M18 | PG kompleks | Bilangan |
| 10 | A, C, E | M09 | PG kompleks | Geometri & Pengukuran |
| 11 | B | M19 | PG | Bilangan |
| 12 | 1-B, 2-S, 3-B, 4-B | M10 | PG kategori | Geometri & Pengukuran |
| 13 | A | M19 | PG | Bilangan |
| 14 | A | M01 | PG | Bilangan |
| 15 | A, C, E | M16 | PG kompleks | Geometri & Pengukuran |
| 16 | C | M21 | PG | Data |
| 17 | B, C | M03 | PG kompleks | Bilangan |
| 18 | B | M12 | PG | Geometri & Pengukuran |
| 19 | C | M15 | PG | Geometri & Pengukuran |
| 20 | D | M16 | PG | Geometri & Pengukuran |
| 21 | 1-B, 2-B, 3-S, 4-B | M15 | PG kategori | Geometri & Pengukuran |
| 22 | 1-B, 2-B, 3-S, 4-S | M07 | PG kategori | Bilangan |
| 23 | A | M10 | PG | Geometri & Pengukuran |
| 24 | D | M18 | PG | Bilangan |
| 25 | A, B, D | M21 | PG kompleks | Data |
| 26 | C | M22 | PG | Data |
| 27 | C | M13 | PG | Bilangan |
| 28 | A, C | M11 | PG kompleks | Geometri & Pengukuran |
| 29 | D | M06 | PG | Bilangan |
| 30 | 1-S, 2-B, 3-B, 4-B | M17 | PG kategori | Geometri & Pengukuran |

**[HITUNGAN]** Bilangan 12 (nomor 1, 3, 8, 9, 11, 13, 14, 17, 22, 24, 27, 29) · Geometri & Pengukuran 12 (nomor 2, 7, 10, 12, 15, 18, 19, 20, 21, 23, 28, 30) · Data 6 (nomor 4, 5, 6, 16, 25, 26). PG 18 · PG kompleks 6 (9, 10, 15, 17, 25, 28) · PG kategori 6 (3, 5, 12, 21, 22, 30). Kunci PG: A 4 · B 5 · C 5 · D 4.

**Penilaian.** Satu butir bernilai 1 kalau jawabannya **tepat sama** dengan kunci. PG kompleks dengan satu huruf kurang atau lebih = 0. PG kategori dengan satu pernyataan keliru = 0. Tidak ada nilai sebagian.

---

## Pemetaan uji tunda

Aturan dari `02-peta-spiral.md` Bagian 6 (S4) dan `01-spesifikasi-program.md` Bagian 8. Uji tunda dari S4 **hanya** untuk topik yang jendela J3-nya jatuh setelah P36 atau yang belum sempat diuji tunda: **M16, M17, M18, M19, M21, M22**.

| Topik | Nomor butir | Aturan skala 0–3 | Masuk rapor penguasaan |
|---|---|---|---|
| M16 · Luas permukaan & bangun ruang gabungan | 15, 20 | 2 benar → 3 · 1 benar → 1 · 0 benar → 0 | Uji tunda |
| M17 · Visualisasi spasial | 2, 30 | 2 benar → 3 · 1 benar → 1 · 0 benar → 0 | Uji tunda |
| M18 · Rasio & perbandingan | 9, 24 | 2 benar → 3 · 1 benar → 1 · 0 benar → 0 | Uji tunda |
| M19 · Perbandingan senilai, berbalik nilai, skala | 11, 13 | 2 benar → 3 · 1 benar → 1 · 0 benar → 0 | Uji tunda |
| M21 · Piktogram, diagram batang, tabel frekuensi | 4, 16, 25 | Jumlah benar langsung (0–3) | Uji tunda |
| M22 · Menafsirkan data & rata-rata | 5, 6, 26 | Jumlah benar langsung (0–3) | Uji tunda. **Walaupun 3, sampaikan ke orang tua sebagai "baru bisa"** — dasar rapor M22 paling lemah (`02-peta-spiral.md` Bagian 4) |

**Topik lain — bukan uji tunda, dipakai untuk analisis kesalahan saja.** Uji tunda topik ini sudah diambil di pertemuan "bulan lalu" masing-masing.

| Topik | Nomor butir |
|---|---|
| M01 | 14 |
| M02 | 3 |
| M03 | 17 |
| M04 | 1 |
| M05 | 8 |
| M06 | 29 |
| M07 | 22 |
| M09 | 10 |
| M10 | 12, 23 |
| M11 | 7, 28 |
| M12 | 18 |
| M13 | 27 |
| M15 | 19, 21 |

**M23 (bentuk soal)** tidak punya butir sendiri. Untuk melihat hasil M23, pengajar menghitung benar di 12 butir PG kompleks dan PG kategori (nomor 3, 5, 9, 10, 12, 15, 17, 21, 22, 25, 28, 30) dan memperhatikan kode **S** di butir-butir itu. Angka ini **tidak** masuk rapor penguasaan sebagai uji tunda **[ASUMSI]**.
