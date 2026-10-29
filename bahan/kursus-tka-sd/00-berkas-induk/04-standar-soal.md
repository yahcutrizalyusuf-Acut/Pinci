# 04 — Standar Soal

Cara menulis **ketiga bentuk pilihan ganda TKA**, dengan format tulis baku yang dipakai di semua modul, teks baca cepat, dan paket simulasi.

**Format ini bukan soal selera.** Lembar kerja anak dan pemeriksa kunci jawaban **dibangkitkan otomatis** dari format ini. Soal yang menyimpang dari format tidak akan tercetak atau tidak akan terperiksa.

Label: **[FAKTA]** · **[HITUNGAN]** · **[ASUMSI]** · **[PERLU DICEK]**.

---

## 1. Aturan umum — berlaku untuk semua soal

| # | Aturan |
|---|---|
| 1 | **Hanya tiga bentuk**: PG, PG kompleks, PG kategori. Nol isian, nol uraian, nol menjodohkan, nol "isilah titik-titik" |
| 2 | **Kalimat soal pendek**: paling banyak 12 kata per kalimat. Pertanyaan diakhiri tanda tanya |
| 3 | Kata penentu dicetak tebal: **paling banyak**, **paling sedikit**, **tidak**, **semua**, **selisih**, **sisa** |
| 4 | Hindari kalimat negatif. Kalau terpaksa, "tidak" dicetak tebal. **Nol negatif ganda** |
| 5 | Konteks lokal Banda Aceh (`01-spesifikasi-program.md` Bagian 10). Nama anak laki-laki dan perempuan bergantian |
| 6 | Angka wajar untuk anak kelas 6: hasil akhir biasanya ≤ 100.000, pecahan berpenyebut ≤ 24 kecuali topiknya menuntut |
| 7 | **Semua notasi persis** `03-standar-istilah.md` Bagian 7 |
| 8 | **Nol gambar bebas.** Gambar hanya boleh berupa: (a) tabel markdown, (b) blok teks berhuruf sama lebar, lebar ≤ 40 kolom dan tinggi ≤ 15 baris, memakai karakter `█ ▓ ░ ■ □ ● ○ ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`, (c) **denah angka** untuk susunan kubus (angka di tiap kotak = banyak kubus bertumpuk). Semua ukuran yang dibutuhkan **ditulis sebagai angka**, jangan diukur dari gambar |
| 9 | Materi dilarang: Peluang, Aljabar (variabel huruf), dan soal menulis pada BI |
| 10 | Satu soal = satu kemampuan. Kalau soal gagal, pengajar harus tahu **apa** yang gagal |

### Soal kelas (●) dan soal cadangan (○)

| | Soal kelas ● | Soal cadangan ○ |
|---|---|---|
| Panjang | Matematika: maksimal **2 kalimat** sebelum pertanyaan. Bahasa Indonesia: teks pendek maksimal **5 kalimat** (boleh dipakai 2–3 soal ●) | Boleh berstimulus panjang (teks, tabel, cerita) |
| Langkah | **1–2 langkah** | Boleh 3–4 langkah |
| Waktu sasaran | **±45 detik** | ±2,5 menit (patokan TKA) |
| Alasan | 8 soal harus muat dalam menit 33–39 (Keputusan K3) | Melatih tempo TKA |

---

## 2. Aturan pengecoh

Pengecoh adalah **jawaban salah yang menangkap salah paham tertentu**. Pengecoh yang cuma angka acak tidak memberi tahu pengajar apa pun.

| # | Aturan |
|---|---|
| 1 | **Setiap pengecoh = satu salah paham yang bisa disebut namanya.** Contoh: 14 pada soal KPK 6 dan 8 = "menjumlahkan, bukan mencari kelipatan" |
| 2 | Utamakan salah paham di halaman 1 modul itu. Minimal **satu pengecoh per soal** berasal dari daftar salah paham halaman 1 |
| 3 | Tulis alasan tiap pengecoh di kunci: **"Kenapa pengecoh menarik"** |
| 4 | Pilihan angka **diurutkan dari kecil ke besar**. Pilihan kata diurutkan dari pendek ke panjang |
| 5 | Panjang pilihan kira-kira sama. Jawaban benar **tidak boleh** selalu yang paling panjang atau paling rinci |
| 6 | **Dilarang**: "semua benar", "semua salah", "tidak ada jawaban", "A dan B benar" |
| 7 | Satuan pada pengecoh harus masuk akal (pengecoh "24 cm²" pada soal keliling justru bagus, karena menangkap tertukarnya keliling dan luas) |
| 8 | Sebaran kunci per modul: dari 12 soal PG di halaman 5, **tidak ada huruf yang menjadi kunci lebih dari 4 kali** |

---

## 3. Format tulis baku

### 3.1 Judul soal

```
#### <Jenis> <nomor> <lambang> · <bentuk>
```

| Bagian | Nilai yang boleh |
|---|---|
| Jenis | `Soal` (halaman 5) · `Tiket` (halaman 6) · `Kuis` (halaman 2) · `Terbimbing` (soal latihan terbimbing, halaman 3) · `Contoh` (hanya contoh di berkas induk ini) · `Pertanyaan` (bank teks baca cepat) · `Butir` (paket simulasi) · `Diagnostik` (M01, B01) |
| Nomor | 1, 2, 3, … |
| Lambang | **Hanya untuk `Soal`**: `●` soal kelas · `○` soal cadangan. Jenis lain tanpa lambang |
| Bentuk | `PG` · `PG kompleks` · `PG kategori` |

Contoh: `#### Soal 7 ● · PG kompleks` · `#### Tiket 2 · PG` · `#### Butir 14 · PG kategori`

### 3.2 Badan soal

Semua yang ada **di antara judul dan baris kunci pertama** akan dicetak ke lembar anak. Karena itu **tidak boleh ada petunjuk untuk pengajar di badan soal.**

- **PG / PG kompleks**: kalimat soal, baris kosong, lalu pilihan `A. …` `B. …` masing-masing satu baris.
- **PG kategori**: kalimat soal, baris kosong, lalu tabel:

```
| Pernyataan | Benar | Salah |
|---|---|---|
| 1. … | ☐ | ☐ |
| 2. … | ☐ | ☐ |
```

### 3.3 Blok kunci (untuk pengajar, **tidak tercetak** di lembar anak)

Setiap baris kunci diawali `> `. Urutannya tetap:

```
> **Kunci:** C
> **Kelompok:** hari ini (M02)            ← hanya untuk Soal halaman 5 dan Butir simulasi (tulis kode topik)
> **Petunjuk:** <pertanyaan pancingan, tidak membuka jawaban>
> **Langkah:** <penyelesaian ringkas, langkah demi langkah>
> **Kenapa pengecoh menarik:** A — …; B — …; D — …
> **Periksa:** `<ekspresi Python yang bernilai True>`
```

| Baris | Wajib? | Aturan |
|---|---|---|
| Kunci | **Selalu** | PG: satu huruf. PG kompleks: huruf dipisah koma, urut (`A, C, D`). PG kategori: `1-B, 2-S, 3-B, 4-S` |
| Kelompok | Soal halaman 5, Butir simulasi | `hari ini (Mxx)` · `minggu lalu (Mxx)` · `bulan lalu (Mxx)` · untuk prasyarat `bulan lalu (PR-M2)` · untuk simulasi cukup kode topik `(M05)` |
| Petunjuk | Selalu | **Kunci berjenjang, tingkat 1** — satu pertanyaan pancingan |
| Langkah | Selalu | **Tingkat 2** — cara lengkap, ringkas |
| Kenapa pengecoh menarik | Selalu (PG kategori: "Kenapa pernyataan salah menarik") | Satu alasan per pengecoh, sebut salah pahamnya |
| Periksa | **Wajib untuk setiap soal Matematika yang jawabannya bilangan atau yang pernyataannya memuat hitungan** | Lihat 3.4. Boleh lebih dari satu baris `Periksa` |

**Kunci berjenjang** dipakai begini **[FAKTA — Rohrer dkk. 2020: umpan balik korektif adalah syarat latihan campur-aduk]**: saat anak salah, pengajar membacakan **Petunjuk** dulu. Kalau anak masih salah, baru **Langkah**. Jawaban tidak pernah disebut lebih dulu.

### 3.4 Baris Periksa — aturan ekspresi Python

Pemeriksa otomatis menjalankan setiap ekspresi dan melaporkan yang bernilai `False`.

| Boleh dipakai | Contoh |
|---|---|
| `+ - * / // % **`, kurung | `(12 + 15 + 9 + 20) / 4 == 14` |
| `F(a, b)` = pecahan `Fraction`; `F('0.75')` untuk desimal | `F(1,2) + F(1,3) == F(5,6)` |
| `gcd(a, b)`, `lcm(a, b)` | `lcm(6, 8) == 24` |
| `sum`, `min`, `max`, `abs`, `round` | `max([12, 15, 9, 20]) == 20` |
| Perbandingan dan `and` / `or` / `not` | `F(3,4) > F(2,3)` |

**Aturan:**
- Ekspresi harus menghitung **dari angka di soal**, bukan sekadar menulis ulang jawaban (`24 == 24` dilarang).
- Desimal ditulis sebagai `F('0.75')`, **bukan** `0.75`, supaya tidak ada galat pembulatan komputer.
- Untuk pengecoh, **tidak perlu** Periksa. Untuk PG kategori, tulis satu Periksa per pernyataan yang memuat hitungan, dan untuk pernyataan **Salah** tulis dengan `!=` atau `not`.
- Soal tanpa hitungan (mis. memilih jenis perbandingan, visualisasi tampak) menulis `> **Periksa:** tidak ada hitungan`.

---

## 4. PG — pilihan ganda biasa

**Ciri:** satu jawaban benar dari empat pilihan (A–D).
**Kapan dipakai:** kemampuan tunggal yang jelas benar-salahnya.

### Contoh jadi PG-1 — Matematika (M02, KPK)

**Langkah menyusun:**

| Langkah | Keputusan |
|---|---|
| 1. Sasaran | Anak memakai **KPK** untuk kejadian yang berulang bersamaan |
| 2. Salah paham yang dipancing | KPK tertukar FPB · menjumlahkan · mengalikan langsung |
| 3. Hitung jawaban benar | KPK(6, 8) = 24 |
| 4. Hitung tiap pengecoh dari salah pahamnya | FPB = 2 · 6 + 8 = 14 · 6 × 8 = 48 |
| 5. Urutkan pilihan | 2, 14, 24, 48 |

#### Contoh 1 · PG
Lampu hijau berkedip setiap 6 detik. Lampu kuning berkedip setiap 8 detik. Keduanya baru saja berkedip bersamaan.

Setelah berapa detik keduanya berkedip bersamaan lagi?

A. 2
B. 14
C. 24
D. 48

> **Kunci:** C
> **Petunjuk:** Kejadiannya berulang dan kita mencari saat pertama bertemu lagi. Kita perlu kelipatan atau faktor?
> **Langkah:** Kelipatan 6: 6, 12, 18, **24**. Kelipatan 8: 8, 16, **24**. Kelipatan persekutuan terkecil = 24.
> **Kenapa pengecoh menarik:** A — memakai FPB karena mengira "bersamaan" berarti membagi; B — menjumlahkan kedua waktu; D — mengalikan langsung, padahal 48 bukan kelipatan persekutuan yang **terkecil**.
> **Periksa:** `lcm(6, 8) == 24`

### Contoh jadi PG-2 — Bahasa Indonesia (B04, ide pokok)

| Langkah | Keputusan |
|---|---|
| 1. Sasaran | Menemukan ide pokok yang **tidak** berada di kalimat pertama |
| 2. Salah paham | Ide pokok selalu kalimat pertama · memilih rincian yang menarik |
| 3. Tulis teks | Kalimat pertama berisi rincian. Ide pokok ada di kalimat terakhir |
| 4. Pengecoh | A = kalimat pertama · B = satu rincian · D = kesimpulan yang melebar di luar teks |

#### Contoh 2 · PG
Bacalah paragraf berikut.

Pukul lima pagi, perahu merapat di Lampulo. Ikan tongkol diturunkan dalam keranjang. Pedagang datang dari Peunayong dan Lambaro. Mereka menawar harga dengan cepat. Ikan cepat berpindah tangan. **Pagi di Lampulo selalu ramai jual beli.**

Apa ide pokok paragraf tersebut?

A. Perahu merapat pukul lima pagi.
B. Pedagang datang dari Peunayong dan Lambaro.
C. Pagi di Lampulo selalu ramai jual beli.
D. Nelayan Aceh adalah nelayan yang paling rajin.

> **Kunci:** C
> **Petunjuk:** Hal apa yang dibicarakan oleh **semua** kalimat?
> **Langkah:** Setiap kalimat menceritakan kegiatan jual beli ikan di pagi hari. Kalimat terakhir merangkum semuanya.
> **Kenapa pengecoh menarik:** A — ini kalimat pertama, dan anak mengira ide pokok selalu di awal; B — rincian yang benar di teks, tetapi hanya satu bagian; D — terdengar bagus, tetapi tidak dibicarakan teks.
> **Periksa:** tidak ada hitungan

**Catatan untuk penulis:** kalimat ide pokok dicetak tebal **hanya di contoh ini** untuk memperlihatkan letaknya. Di soal sungguhan, tidak ada cetak tebal pada teks.

---

## 5. PG kompleks — jawaban benar lebih dari satu

**Ciri:** 4–5 pilihan, **2–3 benar**. Tidak ada nilai sebagian: satu saja terlewat atau berlebih = salah.
**Kapan dipakai:** kemampuan memeriksa **setiap** kemungkinan, bukan berhenti di jawaban pertama.
**Salah paham yang paling sering:** anak berhenti setelah menemukan satu yang benar.

**Aturan tambahan:**
- Perintah baku: "Pilih **semua** jawaban yang benar." Jangan menyebut jumlahnya.
- Jawaban benar **tidak berurutan** (hindari kunci A, B saja atau C, D saja terus-menerus).
- Setiap pilihan salah menangkap salah paham berbeda.

### Contoh jadi PGK-1 — Matematika (M03, pecahan senilai)

| Langkah | Keputusan |
|---|---|
| 1. Sasaran | Mengenali pecahan senilai: pembilang dan penyebut **dikali bilangan yang sama** |
| 2. Salah paham | Pembilang dan penyebut **ditambah** bilangan yang sama |
| 3. Jawaban benar | 4/6 (×2), 6/9 (×3), 10/15 (×5) |
| 4. Pengecoh | 3/4 (+1), 4/5 (+2) |

#### Contoh 3 · PG kompleks
Pilih **semua** pecahan yang senilai dengan 2/3.

A. 4/6
B. 6/9
C. 3/4
D. 4/5
E. 10/15

> **Kunci:** A, B, E
> **Petunjuk:** Untuk mendapat pecahan senilai, pembilang dan penyebut diapakan dengan bilangan yang sama?
> **Langkah:** 2/3 = (2 × 2)/(3 × 2) = 4/6; (2 × 3)/(3 × 3) = 6/9; (2 × 5)/(3 × 5) = 10/15. Periksa C dan D: 3/4 dan 4/5 tidak bisa diperoleh dengan mengalikan.
> **Kenapa pengecoh menarik:** C — pembilang dan penyebut sama-sama **ditambah** 1; D — sama-sama ditambah 2. Anak yang berhenti setelah A juga akan salah.
> **Periksa:** `F(2,3) == F(4,6) and F(2,3) == F(6,9) and F(2,3) == F(10,15)`
> **Periksa:** `F(2,3) != F(3,4) and F(2,3) != F(4,5)`

### Contoh jadi PGK-2 — Bahasa Indonesia (B08, fakta dan opini)

#### Contoh 4 · PG kompleks
Bacalah teks berikut.

Museum Tsunami Aceh dibuka tahun 2009. Bangunannya dirancang oleh Ridwan Kamil. Atapnya berbentuk seperti kapal. Menurut Intan, museum itu paling menyentuh. Pengunjung datang dari banyak kota. Rafli merasa lorong gelapnya terlalu menakutkan.

Pilih **semua** kalimat yang berisi **fakta**.

A. Museum Tsunami Aceh dibuka tahun 2009.
B. Atapnya berbentuk seperti kapal.
C. Museum itu paling menyentuh.
D. Lorong gelapnya terlalu menakutkan.

> **Kunci:** A, B
> **Petunjuk:** Kalimat mana yang bisa dibuktikan benar atau salah oleh siapa pun?
> **Langkah:** A bisa dicek di catatan sejarah. B bisa dilihat langsung. C dan D berisi perasaan orang tertentu ("menurut Intan", "Rafli merasa").
> **Kenapa pengecoh menarik:** C — ditulis dengan yakin dan tentang tempat nyata, jadi terasa seperti fakta; D — "lorong gelap" memang ada, tetapi "terlalu menakutkan" adalah perasaan.
> **Periksa:** tidak ada hitungan

**[PERLU DICEK]** Tahun pembukaan (2009) dan perancang (Ridwan Kamil) Museum Tsunami Aceh ditulis dari pengetahuan umum. Cocokkan dengan sumber resmi sebelum dicetak.

---

## 6. PG kategori — Benar/Salah per pernyataan

**Ciri:** tabel 3–4 pernyataan, tiap pernyataan dinilai Benar atau Salah. Satu saja keliru = soal salah. Peluang menebak benar semua pada 4 pernyataan = **1/16** **[HITUNGAN]**.
**Kapan dipakai:** membaca data, memeriksa beberapa klaim tentang satu stimulus.

**Aturan tambahan:**
- Minimal **satu Benar dan satu Salah** di setiap soal.
- Setiap pernyataan menguji **satu** hal. Nol "dan" yang menggabungkan dua klaim.
- Pernyataan Salah harus **hampir benar** — berasal dari salah paham, bukan dari angka acak.
- Nomori pernyataan 1, 2, 3, 4 di sel pertama.

### Contoh jadi PGK-3 — Matematika (M21/M22, tabel dan rata-rata)

#### Contoh 5 · PG kategori
Tabel ini menunjukkan hasil tangkapan ikan Pak Hasan.

| Hari | Senin | Selasa | Rabu | Kamis |
|---|---|---|---|---|
| Berat ikan (kg) | 12 | 15 | 9 | 20 |

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Tangkapan paling banyak pada hari Kamis. | ☐ | ☐ |
| 2. Selisih tangkapan Senin dan Selasa adalah 3 kg. | ☐ | ☐ |
| 3. Jumlah tangkapan empat hari adalah 55 kg. | ☐ | ☐ |
| 4. Rata-rata tangkapan per hari adalah 14 kg. | ☐ | ☐ |

> **Kunci:** 1-B, 2-B, 3-S, 4-B
> **Petunjuk:** Periksa satu pernyataan saja dulu. Jangan membaca pernyataan berikutnya sebelum yang ini selesai.
> **Langkah:** (1) 20 paling besar → Benar. (2) 15 − 12 = 3 → Benar. (3) 12 + 15 + 9 + 20 = 56, bukan 55 → Salah. (4) 56 : 4 = 14 → Benar.
> **Kenapa pernyataan salah menarik:** 3 — selisih satu angka dari jawaban benar; anak yang menjumlah terburu-buru, atau yang langsung percaya karena pernyataan 1 dan 2 benar, akan memilih Benar.
> **Periksa:** `max([12, 15, 9, 20]) == 20`
> **Periksa:** `15 - 12 == 3`
> **Periksa:** `12 + 15 + 9 + 20 != 55`
> **Periksa:** `(12 + 15 + 9 + 20) / 4 == 14`

### Contoh jadi PGK-4 — Bahasa Indonesia (B02, informasi tersurat dan tersirat)

#### Contoh 6 · PG kategori
Bacalah teks berikut.

Hari Minggu, Zahra ikut ayah ke sawah. Padi sudah menguning. Ayah membawa sabit dan karung. Zahra membawa bekal nasi dan air. Siang hari, mereka makan di pondok kecil. Sore itu, lima karung gabah terkumpul. Ayah tersenyum lebar.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan berdasarkan teks.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Zahra dan ayah pergi ke sawah pada hari Minggu. | ☐ | ☐ |
| 2. Zahra membawa sabit dan karung. | ☐ | ☐ |
| 3. Ayah senang dengan hasil panen hari itu. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B
> **Petunjuk:** Untuk setiap pernyataan, tunjuk kalimat di teks yang menjadi dasar jawabanmu.
> **Langkah:** (1) Kalimat 1 menyebut hari Minggu → Benar. (2) Kalimat 3: yang membawa sabit dan karung adalah **ayah** → Salah. (3) Tidak tertulis "senang", tetapi "ayah tersenyum lebar" setelah lima karung terkumpul → Benar (informasi tersirat).
> **Kenapa pernyataan salah menarik:** 2 — semua bendanya ada di teks, hanya pelakunya ditukar. Anak yang membaca sekilas mencocokkan kata, bukan maknanya.
> **Periksa:** tidak ada hitungan

---

## 7. Soal berstimulus dan soal bergrup (simulasi dan BI)

| Aturan | Keterangan |
|---|---|
| Stimulus di depan | Teks, tabel, atau gambar teks ditulis sekali, di bawah judul `### Stimulus <huruf>: <judul>` |
| Soal bergrup | 3–6 butir memakai satu stimulus. Setiap butir menulis "Berdasarkan teks <huruf>, …" |
| Panjang teks BI | 150–200 kata, kalimat 3–7 kata **[FAKTA — kerangka asesmen, PERLU DICEK]** |
| Stimulus Matematika | Cerita pendek 2–5 kalimat, tabel, atau denah angka. Semua bilangan yang dibutuhkan tertulis |
| Butir berdiri sendiri | Setiap butir harus bisa dijawab **tanpa** jawaban butir lain |

---

## 8. Daftar periksa penulis — sebelum soal dianggap jadi

| # | Periksa |
|---|---|
| 1 | Bentuknya salah satu dari tiga, judulnya mengikuti format 3.1 |
| 2 | Badan soal tidak memuat petunjuk pengajar |
| 3 | Setiap pengecoh punya nama salah paham di "Kenapa pengecoh menarik" |
| 4 | Kunci berjenjang lengkap: Kunci, Petunjuk, Langkah, alasan pengecoh |
| 5 | Soal Matematika berangka punya baris `Periksa` yang dihitung dari angka soal |
| 6 | Istilah dan notasi persis `03-standar-istilah.md` |
| 7 | Kalimat ≤ 12 kata, kata penentu tebal |
| 8 | Soal ● muat ±45 detik |
| 9 | Nama dan tempat lokal, wajar, tidak menyinggung |
| 10 | Tidak ada Peluang, Aljabar, atau materi menulis |
