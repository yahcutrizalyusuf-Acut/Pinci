# Temuan Pemeriksaan Mutu — Matematika bagian 1

**Cakupan:** M01, M02, M03, M04, M05, M06, M07, M09, M10, M11, M12, M13 (12 modul)
**Diperiksa:** 17 September 2026 · agen pemeriksa mutu · **modul tidak diubah**
**Acuan:** `00-berkas-induk/01`–`04` (dibaca penuh), `05`–`06` (sekilas)
**Alat:**
- `_alat/periksa.py` (struktur, alur, komposisi, kunci, kata terlarang)
- `05-pemeriksaan/verifikasi/verif_M01_M13.py` (hitungan ulang independen, **tidak** memakai baris `Periksa` modul)
- pemindai istilah dan panjang kalimat (dijalankan sekali, tidak disimpan)

---

## 1. Hasil pemeriksa struktur (`periksa.py`)

| Modul | Soal | Periksa benar | SALAH | Galat | Format | Tanpa hitungan |
|---|---|---|---|---|---|---|
| M01 | 33 | 34 | 0 | 0 | 0 | 2 |
| M02–M07, M09–M13 | 21 per modul | 23–28 | 0 | 0 | 0 | 0 |
| **Total** | **264** | **332** | **0** | **0** | **0** | **2** |

Tidak ada laporan struktur, alur menit, komposisi, kunci, tiket, atau kata terlarang yang gagal.

---

## 2. Tabel ringkas

| Butir | Hasil | Berkas bermasalah | Rincian singkat |
|---|---|---|---|
| 1 Struktur 7 halaman | **Lolos** | — | 7 halaman dengan judul dan urutan sama di 12 modul |
| 2 Alur menit | **Lolos** | — | Semua 45 menit. M01 alur khusus 5+5+20+1+9+5 = 45 |
| 3 Komposisi 12 soal | **Lolos** | — | 5/4/3, 8 ● + 4 ○, no. 1 bukan "hari ini", tidak ada 3 berurutan sekelompok. Tidak ada huruf kunci lebih dari 4 kali |
| 4 Kunci jawaban | **Lolos** | — | 264 soal, semua punya Kunci, Petunjuk, Langkah, dan alasan pengecoh |
| 5 Kesesuaian peta spiral | **Tidak** | M12, M09, M10, M13 | Baris P01–P19 cocok semua. Tapi 1 soal isinya tidak sesuai label (T-07), dan 4 soal kembar dipakai ulang di slot daur ulang/uji tunda (T-08) |
| 6 Keterulangan topik | Dilewati | — | Diperiksa koordinator |
| 7 Bentuk soal | **Lolos** | — | Hanya PG, PG kompleks, PG kategori |
| 8 Cakupan domain | **Lolos** | — | Tidak ada Peluang. Tidak ada variabel huruf |
| 9 Keseragaman istilah | **Tidak** | M03, M05, M06, M07, M09, M10, M11, M12, M13 | "atas × atas", "angka bawah", "pojok", "bilangan bulat", "isi" untuk volume, "dibalik", dan 1 kalimat yang bertentangan dengan tangga volume (T-06, T-09–T-13) |
| 10 Tiga salah paham | **Lolos** | — | Ada di halaman 1 dan dibongkar satu per satu di halaman 4 |
| 11 Contoh jadi polos | **Lolos** | — | Tidak ada perintah menjelaskan. Pertanyaan di tabel contoh jadi (M04 b.175, M06 b.210) retoris, tidak ditujukan ke anak |
| 12 Baca cepat | Dilewati | — | Diperiksa terpisah |
| 13 Tiket keluar | **Lolos** | — | 3 soal + tabel ambang di 12 modul |
| 14 Laporan orang tua | **Lolos** | — | Ada kalimat "Cara membantu di rumah tanpa mengambil alih" di 12 modul |
| 15 Larangan | **Lolos** | — | Nol peringkat, hadiah, gaya belajar, janji angka, dan trik hitung bermerek |
| 16 Kebenaran matematika | **Lolos untuk kunci, Tidak untuk kejelasan** | M02, M06, M11, M12, M13 | **0 kunci salah dari 264 soal.** Ada 1 gambar garis bilangan yang salah letak (T-01), 3 soal ambigu (T-02–T-04), 1 soal kurang keterangan (T-05), dan 1 alasan pengecoh salah label (T-17) |
| 17 Bahasa | **Lolos dengan catatan** | M01, M02, M10 | Satu pernyataan 13 kata dan cerita 3 kalimat di sel tabel (T-14). Tag [ASUMSI] tercampur di kalimat soal (T-15). Satu kalimat janggal (T-16) |

**Jumlah temuan per butir:** butir 5 = 2 · butir 9 = 6 · butir 16 = 6 · butir 17 = 3 · butir lain = 0. **Total 17 temuan.** Tingkat keparahan: 0 tinggi, 7 sedang, 10 rendah.

---

## 3. Butir 5 — pemeriksaan baris peta spiral

| P | Modul | Minggu lalu (peta → modul) | Bulan lalu | Kuis (peta → modul) | Isi soal sesuai label? |
|---|---|---|---|---|---|
| P01 | M01 | diagnostik → PR-M1–M3 (4) | PR-M4–M6 (3) | diganti diagnostik 16 soal | Ya |
| P02 | M02 | M01 → M01 ×4 | PR-M2 ×3 | M01×2 · PR-M1 · PR-M2 → sama | Ya |
| P04 | M03 | M02 · M01 → 2+2 | PR-M4 ×3 | M02×2 · M01 · PR-M4 → sama | Ya |
| P05 | M04 | M03 · M01 → 2+2 | PR-M1 ×3 | M03×2 · M01 · PR-M1 → sama | Ya |
| P07 | M05 | M04 · M02 → 2+2 | M01 ×3 | M04×2 · M02 · M01 → sama | Ya |
| P08 | M06 | M05 · M03 → 2+2 | M02 ×3 | M05×2 · M03 · M02 → sama | Ya |
| P10 | M07 | M06 · M04 → 2+2 | M03 ×3 | M06×2 · M04 · M03 → sama | Ya |
| P13 | M09 | M07 · M06 · M05 → 2+1+1 | M01 ×3 (uji tunda) | M07×2 · M05 · M01 → sama | Ya (tapi Soal 7 kembar, T-08) |
| P14 | M10 | M09 · M07 → 2+2 | M02 ×3 (uji tunda) | M09×2 · M07 · M02 → sama | Ya (tapi Soal 8 kembar, T-08) |
| P16 | M11 | M10 · M09 → 2+2 | M03 ×3 (uji tunda) | M10×2 · M09 · M03 → sama | Ya |
| P17 | M12 | M11 · M09 → 2+2 | M04 ×3 (uji tunda) | M11×2 · M09 · M04 → sama | **Soal 10 tidak sesuai (T-07)** |
| P19 | M13 | M12 · M10 → 2+2 | M05 ×3 (uji tunda) | M12×2 · M10 · M05 → sama | Ya (tapi Kuis 4 kembar, T-08) |

Soal uji tunda (Kuis 4 + dua soal ● bulan lalu) di M09–M13 sesuai spesifikasi Bagian 8.

---

## 4. Temuan rinci

Format tiap temuan: **berkas · baris** — kutipan — masalah — **usulan perbaikan**.

### T-01 · butir 16 · Sedang — gambar garis bilangan salah letak

**`M13-penaksiran-dan-pembulatan.md` · baris 274–277** (Halaman 4, Penjelasan alternatif 1 "Rumah di jalan")

Kutipan: `    ├────────┬────┼─────────────┤` dengan label `3.462` di bawah `┬`.

**Masalahnya:** skrip mengukur letak kolomnya: `├` (3.400) di kolom 4, `┼` (tengah 3.450) di kolom 18, `┤` (3.500) di kolom 32. Titik 3.462 (`┬`) ada di kolom 13, jadi **sebelum** tengah. Padahal kalimat pengajar di baris 281 berbunyi *"sudah lewat tengah"*. Anak yang sedang bingung naik-turun malah melihat gambar yang menunjukkan "turun".

**Usulan:** pindahkan `┬`, `│` (baris 276), dan label `3.462` (baris 277) ke kolom 21. Contoh:
```
rumah 3.400    tengah    rumah 3.500
    ├─────────────┼──┬──────────┤
                     │
                   3.462
```

### T-02 · butir 16 · Sedang — soal ambigu, dua jawaban bisa benar

**`M12-sudut-dan-kekongruenan.md` · baris 229** (Terbimbing 2)

Kutipan: "Sudut K = 35° dan sudut Y = 65°. Y, Z, dan W segaris."

**Masalahnya:** tidak disebut bahwa W ada di **perpanjangan** YZ. Kalau W terletak di antara Y dan Z, sudut XZW = sudut Z = **80° (pilihan B)**, bukan 100°. Soal kembarannya di Contoh jadi 2 (baris 211) dan Tiket 2 (baris 585) memakai kata "diperpanjang", tetapi Terbimbing 2 tidak.

**Usulan:** ganti kalimat terakhir menjadi "Sisi YZ diperpanjang sampai titik W, sehingga Y, Z, dan W segaris."

### T-03 · butir 16 · Sedang — dua pernyataan PG kategori ambigu

**`M02-faktor-kelipatan-kpk-fpb.md` · baris 440 dan 443** (Soal 6 ○)

- Pernyataan 1: "Kapal Cut Meutia berlabuh **lagi** 12 hari dari sekarang." Kunci **B**. Kapal itu berlabuh lagi **pertama kali** 6 hari dari sekarang. Anak yang membaca "lagi" sebagai "berikutnya" menjawab **S** dengan alasan yang benar.
- Pernyataan 4: "**Dalam 30 hari**, kapal Seulanga berlabuh 3 kali." Kunci **B** (hari ke-9, 18, 27). Soal menyebut kedua kapal berlabuh **hari ini**. Kalau hari ini ikut dihitung, jawabannya 4 kali (dicek skrip).

**Usulan:**
- Pernyataan 1: "Kapal Cut Meutia juga berlabuh pada hari ke-12 dari sekarang."
- Pernyataan 4: "Dari hari ke-1 sampai hari ke-30, kapal Seulanga berlabuh 3 kali."

### T-04 · butir 16 · Rendah — batas waktu jatuh tepat di ujung

**`M06-perkalian-dan-pembagian-pecahan.md` · baris 391** (Soal 3 ○)

Kutipan: "Dalam 2 menit berikutnya, berapa kali keduanya berkedip bersamaan lagi?" Kunci B = 5.

**Masalahnya:** kedipan bersama yang ke-5 jatuh **tepat** di detik ke-120. Kalau batasnya tidak ikut dihitung, jawabannya 4, dan 4 tidak ada di pilihan. Anak jadi ragu di soal yang seharusnya melatih KPK.

**Usulan:** ubah "2 menit" menjadi "130 detik". Kunci tetap **B = 5** (130 : 24 dibulatkan ke bawah = 5). Pengecoh dihitung ulang: A = 1 (hasil kali 96 detik, tetap), C = 6 (jumlah 20 detik, tetap), D berubah **dari 30 menjadi 32** (FPB 4 detik). Petunjuk dan Langkah menyesuaikan: "130 : 24 = 5 sisa 10".

### T-05 · butir 16 · Rendah — bentuk trapesium tidak disebut

**`M11-keliling-dan-luas-bangun-datar.md` · baris 224** (Terbimbing 2)

Kutipan: "Sebuah taman berbentuk trapesium. Sisi sejajarnya 12 m dan 18 m. Tingginya 8 m dan sisi miringnya 10 m."

**Masalahnya:** "sisi miringnya" (tunggal) dan pengecoh A (12 + 18 + **8** + 10, tinggi dihitung sebagai sisi) hanya masuk akal untuk trapesium **siku-siku**. Angkanya memang cocok (6² + 8² = 10², dicek skrip), tetapi kata "siku-siku" tidak ada. Soal 10 (baris 537) dan M12 Soal 11 menulisnya lengkap.

**Usulan:** "Sebuah taman berbentuk trapesium siku-siku."

### T-06 · butir 9 · Sedang — kalimat pengajar bertentangan dengan tangga volume

**`M10-waktu-kecepatan-laju-perubahan.md` · baris 78** (Tabel menit, Bahas kuis)

Kutipan: *"Beberapa papan menulis 25. Lihat baris ini: dari L ke mL, satu anak tangga atau tiga?"*

**Masalahnya:** tangga volume di M09 (baris 65–68) menulis **L → mL = satu anak tangga × 1.000**. Langkah Kuis 1 M10 (baris 108) juga "dikali 1.000". Kalimat ini menyiratkan tiga anak tangga, seperti tangga panjang. Itu persis salah paham 1 M09 yang sedang dibongkar.

**Usulan:** *"Beberapa papan menulis 25. Lihat baris ini: dari L ke mL, dikali 10 atau dikali 1.000?"*

### T-07 · butir 5 · Sedang — isi soal tidak sesuai label topik

**`M12-sudut-dan-kekongruenan.md` · baris 502–516** (Soal 10 ○, `Kelompok: bulan lalu (M04)`)

Kutipan: "Harga tas … Rp80.000. Toko memberi diskon 15%. Salsabila juga memakai kupon potongan Rp5.000 setelah diskon."

**Masalahnya:** M04 melatih **mengubah bentuk** pecahan, desimal, dan persen. Soal ini adalah **persen dari harga + dua langkah**, yang merupakan isi M07 (salah paham 3 M07, contoh jadi 2 M07). Catatan kesalahan umum M12 (baris 560) juga menyebut soal 10 sebagai "membandingkan desimal dan persen", padahal bukan. Soal ini ○, jadi tidak masuk skor uji tunda. Tapi rapor topik M04 jadi tercampur M07.

**Usulan:** ganti dengan soal M04 yang sudah dicek skrip:
"Pecahan 3/20 sama dengan berapa persen?" A. 0,15% · B. 1,5% · C. 15% · D. 32% — **Kunci C**. Pengecoh: A — 0,15 benar lalu tanda % ditempel; B — dikali 10, bukan 100; D — pembilang dan penyebut ditempel (0,320). Periksa: `F(3, 20) * 100 == 15`.

### T-08 · butir 5 · Sedang — soal kembar dipakai ulang di slot daur ulang dan uji tunda

Pengulangan berjarak menguji **mengingat cara**, bukan mengingat jawaban. Soal yang sama persis membuat anak cukup mengingat hurufnya. Ini paling berbahaya di slot **uji tunda** karena skornya masuk rapor hijau.

| Soal ulang | Sama persis dengan | Slot | Usulan pengganti (dicek skrip) |
|---|---|---|---|
| **M10 Soal 8 ●** (b. 471–484) "KPK dari 8 dan 12", A 4 · B 20 · C 24 · D 96 | M03 Kuis 1 (b. 97–109), batang soal dan pilihan identik | **uji tunda M02** | "Berapa KPK dari 6 dan 15?" A. 3 · B. 21 · C. 30 · D. 90 — **Kunci C** (FPB 3, jumlah 21, hasil kali 90) |
| **M13 Kuis 4** (b. 143–154) "2/3 + 1/4" | M05 Terbimbing 1 (b. 197), batang soal sama | **uji tunda M05** | "Berapa hasil 2/5 + 1/4?" A. 3/20 · B. 3/9 · C. 9/20 · D. 13/20 — **Kunci D** (A pembilang tidak diubah; B atas+atas, bawah+bawah; C hanya pecahan pertama diubah) |
| **M09 Soal 7 ●** (b. 454–467) "3/4 : 3/8", pilihan identik | M06 Soal 9 (b. 491–504) | minggu lalu (M06) | "Berapa hasil 2/3 : 4/9?" A. 8/27 · B. 2/3 · C. 1 1/2 · D. 27/8 — **Kunci C** (A tanpa membalik; B yang dibalik pecahan pertama; D keduanya dibalik) |
| **M09 Kuis 1** (b. 100–112) "0,5 + 1/4" | M07 Soal 2 (b. 374), batang soal sama | kuis (M07) | "Berapa hasil 0,5 + 1/5?" A. 2/7 · B. 2/5 · C. 7/10 · D. 1 — **Kunci C** (A 1/2 + 1/5 atas+atas, bawah+bawah; B 0,5 dibaca 1/5; D 1/5 dibaca 0,5) |

### T-09 · butir 9 · Sedang — "atas/bawah" dan "angka atas/angka bawah" menggantikan pembilang/penyebut

Standar (`03` Bagian 3): **pembilang** — jangan "angka atas"; **penyebut** — jangan "angka bawah".

| Berkas · baris | Kutipan | Ganti menjadi |
|---|---|---|
| M06 · 60–61 (kotak sudut papan, terlihat sepanjang pertemuan) | "KALI → atas × atas, bawah × bawah" | "KALI → pembilang × pembilang, penyebut × penyebut" |
| M06 · 177 (contoh jadi 1) | "Atas kali atas … Bawah kali bawah" | "Pembilang kali pembilang … Penyebut kali penyebut" |
| M06 · 214 (contoh jadi 2) | "Atas kali atas: dua belas. Bawah kali bawah: tiga." | sama seperti di atas |
| M06 · 199 (Terbimbing 1 Petunjuk) · 256 (pancingan 6) · 531 (Soal 11 Petunjuk) | "Atas dikali apa? Bawah dikali apa?" | "Pembilang dikali apa? Penyebut dikali apa?" |
| M03 · 651 (laporan orang tua) | "pecahan dengan **angka bawah** lebih besar pasti lebih besar" | "pecahan dengan penyebut lebih besar pasti lebih besar" |
| M05 · 637 (laporan orang tua) | "menjumlahkan **angka atas** dengan atas dan **angka bawah** dengan bawah" | "menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut" |

### T-10 · butir 9 · Rendah — "pojok" untuk sudut

Standar (`03` Bagian 4): sisi, titik sudut — jangan "pojok, ujung".

- **M12 · baris 260, 281, 282, 283, 291, 293, 556:** "pojok siku-siku", "membentuk pojok", "Pojok ini sudut siku-siku".
  - Usulan: "sudut siku-siku" (baris 260, 291, 293, 556); "sampai membentuk sudut siku-siku" (281); "sama dengan dua sudut siku-siku" (282); "dari titik sudut … Sudut siku-siku terbagi dua" (283).
- **M11 · baris 647:** "bagian pojok dihitung dua kali".
  - Usulan: "bagian yang bertumpuk dihitung dua kali".

("Pojok kertas" dan "pojok papan" di M01–M02 bukan istilah geometri, jadi tidak dilaporkan.)

### T-11 · butir 9 · Rendah — "bilangan bulat"

- **M13 · baris 28:** "Perkalian **bilangan bulat** puluhan dan ratusan". Usulan: "Perkalian bilangan puluhan dan ratusan".
- **M13 · baris 260** (pancingan 5, diucapkan ke anak): "di antara dua **bilangan bulat** mana?". Usulan: *"Bilangan ini ada di antara dua ratusan (atau ribuan) yang mana?"*

### T-12 · butir 9 · Rendah — "isi" untuk volume, di lembar anak

Standar: volume — jangan "isi, kapasitas".

- **M09 · baris 587** (Tiket 2): "Berapa cm³ isinya?" → "Berapa cm³ volume minyak itu?"
- **M11 · baris 454** (Soal 5 ●): "Berapa mL isi botol itu?" → "Berapa mL volume sirup itu?"
- M09 · baris 263 (ucapan pengajar): "isinya 1 dm³" → "volumenya 1 dm³".

### T-13 · butir 9 · Rendah (perlu keputusan) — "dibalik"

Standar (`03` Bagian 3) mencantumkan **dibalik** di kolom *Jangan dipakai* untuk "membalik pecahan". Bentuk ini dipakai di:
- **M06** baris 213, 236, 254, 255, 308, 314, 501, 503, 558, 594, 596, 641
- **M07** baris 121, 123, 401, 536
- **M09** baris 466

Contoh: "Pecahan pembagi dibalik menjadi apa?", "Pecahan mana yang dibalik?"

**Usulan:** pilih satu, lalu tulis keputusannya di `03`:
- (a) ganti menjadi bentuk aktif: "Pecahan mana yang harus kita balik?", "lupa membalik pecahan pembagi"; atau
- (b) hapus "dibalik" dari kolom terlarang, karena itu hanya bentuk pasif dari istilah baku.

Pemeriksa condong ke (b). Yang sebenarnya perlu dicegah adalah "kebalikan" dan "invers".

### T-14 · butir 17 · Rendah — pernyataan PG kategori terlalu panjang

**`M02` · baris 601–603** (Tiket 3)

- Pernyataan 1 dan 2 masing-masing memuat cerita 3 kalimat di dalam sel tabel (23 dan 22 kata).
- Pernyataan 3 satu kalimat **13 kata**: "KPK dari dua bilangan **tidak** mungkin lebih kecil dari bilangan yang lebih besar."

Standar: ≤ 12 kata per kalimat. Setiap pernyataan menguji satu hal, dan bacaan soal ditulis di atas tabel.

**Usulan:**
- Tulis dua cerita pendek (A: pensil dan buku; B: lampu 3 dan 5 menit) di atas tabel.
- Pernyataan menjadi: "1. Cerita A memakai FPB." · "2. Cerita B memakai FPB." · "3. KPK dua bilangan tidak pernah lebih kecil dari bilangan terbesarnya." (10 kata)

### T-15 · butir 17 · Rendah — tag penyusun di dalam kalimat soal

**`M10` · baris 174** (Contoh jadi 1). Kutipan: "Jaraknya 45 km **[ASUMSI — jarak cerita, fiktif]**. Paman berangkat…"

Soal contoh jadi ditulis pengajar di papan apa adanya, jadi tag ini bisa ikut tertulis.

**Usulan:** hapus tag dari kalimat soal. Pindahkan ke catatan di bawah tabel langkah.

### T-16 · butir 17 · Rendah — kalimat tanya janggal

**`M01` · baris 129** (Diagnostik 3). Kutipan: "Bilangan 6.000 + 400 + 9 ditulis sebagai?"

**Usulan:** "6.000 + 400 + 9 sama dengan bilangan berapa?"

### T-17 · butir 16 · Rendah — alasan pengecoh dan catatan salah rujuk

- **M09 · baris 200** (Terbimbing 1, soal berat): pengecoh C diberi label "salah paham 1, tangga yang tertukar". Salah paham 1 M09 adalah tangga **volume**. Usulan: "C — dikali 100 seperti m ke cm; jumlah anak tangga salah hitung (salah paham 3)".
- **M05 · baris 555** (Catatan kesalahan umum): "0,08 dan 0,8 tertukar | **3**, 8". Soal 3 tidak memuat desimal itu (17/20 = 85%). Usulan: "8".
- **M09 · baris 562:** "Operasi campuran dikerjakan urut dari kiri | 3, **5**", tetapi kalimat di sel yang sama merujuk "Soal 5 dan Soal 10". Usulan: "3, 5, 10".

---

## 5. Ringkasan butir 16 — kebenaran matematika

| Hal | Jumlah |
|---|---|
| Soal diverifikasi ulang dengan Python (Diagnostik 16 + Kuis 44 + Terbimbing 24 + Soal 132 + Tiket 36) | **264** (262 berangka + 2 tanpa hitungan, dicek dengan logika sifat bangun) |
| — PG | 229 (termasuk M07 Kuis 4 yang dicek dengan syarat "senilai dan FPB = 1") |
| — PG kompleks | 12 (himpunan pilihan benar = kunci; tidak ada pilihan salah yang ikut) |
| — PG kategori | 23 (setiap pernyataan B/S dihitung ulang) |
| Contoh jadi (angka antara di tabel langkah) | 24 blok + pilihan contoh jadi 2 M13 |
| Cek tambahan: angka di halaman 4, konsistensi ukuran bangun (Heron, Pythagoras, denah tangga), alur menit, gambar garis bilangan | 30 |
| **Kunci salah** | **0** |
| **Pengecoh yang ternyata juga benar** | **0** |
| **Angka antara salah di Langkah atau contoh jadi** | **0** |
| **Gambar dengan angka yang salah letak** | **1** (T-01) |
| **Soal ambigu atau kurang keterangan** | **4** (T-02, T-03, T-04, T-05) |

Cara menjalankan ulang:

```
cd 05-pemeriksaan/verifikasi
PYTHONIOENCODING=utf-8 python verif_M01_M13.py
```

Keluaran terakhir: 319 blok. Satu blok GAGAL, yaitu gambar M13 (T-01). Tiga blok berlabel "catatan" untuk ambiguitas T-02, T-03, dan T-04.

Semua usulan angka pengganti di T-04, T-07, dan T-08 sudah dihitung dengan Python sebelum ditulis.
