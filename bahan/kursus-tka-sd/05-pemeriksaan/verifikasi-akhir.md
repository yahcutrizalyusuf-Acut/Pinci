# Verifikasi Akhir — soal dan teks yang diubah selama perbaikan

Dikerjakan 17 September 2026 oleh agen verifikasi akhir. Hanya membaca; tidak ada berkas modul yang diubah.

- Skrip hitung ulang: `05-pemeriksaan/verifikasi/verif_akhir.py` (satu blok per soal, komentar berkas + nomor). Skrip menghitung dari angka soal versi sekarang, **bukan** dari baris Periksa penulis.
- Tingkat masalah: **KUNCI SALAH** · **AMBIGU** · **INKONSISTENSI** · **RINGAN**.

## 0. Hasil alat bawaan (dijalankan ulang)

| Perintah | Hasil |
|---|---|
| `periksa.py 01-modul-matematika 02-modul-bahasa-indonesia` | benar 688 · SALAH 0 · galat 0 · format 0 · lewati 241, tanpa temuan struktur |
| `periksa.py --simulasi …` | S1 54/0 · S2 54/0 · S3 52/0 (1 lewati) · S4 53/0 · S5 7/0 (26 lewati) |
| `periksa.py --teks 03-bank-teks-baca-cepat` | T01–T36 SALAH 0, galat 0, format 0, tanpa temuan |

Pemeriksaan turunan lintas semua berkas (bagian global skrip):

- `Peta soal` Halaman 5 cocok dengan lambang, kelompok, topik, dan bentuk tiap soal di **36 modul**.
- Sebaran huruf kunci PG Halaman 5 ≤ 4 per huruf di semua modul.
- Tabel menit berjumlah 45 (modul biasa) dan 100 (M08, M14, M20, M24, B12).
- `Kunci ringkas` S1–S5 cocok dengan kunci, topik, dan bentuk **150/150 butir**. Bentuk 18/6/6 di kelima paket.
- Klaim sebaran huruf tertulis cocok dengan hitungan: S1 A5·B5·C4·D4, S2 A5·B5·C4·D4, S3 A5·B5·C5·D3, S5 A4·B4·C5·D5. S4 tidak menulis klaim; hitungannya A4·B5·C5·D4.

---

## 1. Kelompok 1 — perbaikan Matematika-1 (T-01 s.d. T-17, `_alat/perbaikan_mat1.py`)

**Diverifikasi: 14 soal berkunci dan 13 perubahan teks lain.**

- **Soal berkunci (14):**
  - M01 Diagnostik 3
  - M02 Soal 6 ○, Tiket 3
  - M06 Soal 3 ○
  - M09 Kuis 1, Terbimbing 1, Soal 7 ●, Tiket 2
  - M10 Soal 8 ●
  - M11 Terbimbing 2, Soal 5 ●
  - M12 Terbimbing 2, Soal 10 ○
  - M13 Kuis 4
- **Perubahan teks lain (13):**
  - garis bilangan M13
  - ucapan menit 5–8 M10
  - tag di Contoh jadi 1 M10
  - kotak papan dan istilah pembilang/penyebut: M06, M03, M05
  - "pojok": M12 (7 tempat), M11
  - "bilangan bulat": M13 (2 tempat)
  - "volumenya": M09 baris 263
  - Catatan kesalahan umum: M05, M09, M12
  - kalimat ucapan latihan campur-aduk M02–M13

**Hasil skrip:** 110 OK · 5 MASALAH.

Semua huruf kunci tepat. Hasil hitung ulang:

- Tidak ada pengecoh yang juga benar.
- Semua pilihan angka urut dan setiap angka pengecoh cocok dengan alasannya.
- Contoh: M06 Soal 3 A = 130 : 96 → 1 · C = 130 : 20 → 6 · D = 130 : 4 → 32. Batas 130 detik tidak jatuh tepat pada kedipan bersama.
- M12 Terbimbing 2 A = 90 − 80 · D = 180 − 35.
- M02 Soal 6: dari hari ke-1 sampai 30, kelipatan 9 ada 3.
- Garis bilangan M13: `├` kolom 4 · `┼` kolom 18 · `┬` kolom 21 · `┤` kolom 32. Letak seharusnya ±21,4, jadi titik 3.462 sudah lewat tengah dan `│` tepat di bawah `┬`.
- Tidak ada sisa teks lama di modul yang diubah. Soal asli yang kembarannya diganti (M03 Kuis 1, M05 Terbimbing 1, M06 Soal 9, M07 Soal 2) memang tetap di modul asalnya.

### Masalah

**1.1 · INKONSISTENSI — M09 Terbimbing 1, rujukan salah paham pengecoh C**

- **Letak:** `01-modul-matematika/M09-satuan-panjang-berat-volume.md` · baris 200
- **Kutipan:** "C — 1,5 kg dikira 150 g, dikali 100 seperti m ke cm (jumlah anak tangga salah hitung, **salah paham 3**)."
- **Masalah:** perbaikan T-17 memindahkan rujukan dari salah paham 1 ke salah paham 3, tetapi keduanya tidak cocok. Salah paham 3 M09 (baris 37) adalah "**Arah tangga terbalik: turun malah dibagi**". Pengecoh C arahnya benar (dikali), hanya jumlah anak tangganya kurang. Tidak ada salah paham Halaman 1 M09 yang persis "jumlah anak tangga salah hitung".
- **Usulan:** "C — 1,5 kg dikira 150 g: dikali 100 seperti m ke cm, turun 2 anak tangga padahal 3 (tanpa nomor salah paham)." Pola "tanpa nomor salah paham" sudah dipakai di B11.

**1.2 · INKONSISTENSI — M09 Catatan kesalahan umum, "urut dari kiri"**

- **Letak:** `M09` · baris 562
- **Kutipan:** "| Operasi campuran dikerjakan urut dari kiri | 3, 5, 10 | … Anak yang salah di Soal 5 dan Soal 10 → rapat mutu |"
- **Masalah:** nomor 10 ditambahkan supaya cocok dengan kalimat di sel. Namun Soal 10 ● (8 × 14 − 27) tidak punya pengecoh "urut dari kiri": A = jumlah semua, C = berhenti di langkah 1, D = ditambah. Dikerjakan urut dari kiri pun hasilnya tetap 85 (benar). Soal 3 ○ juga tidak memuat pengecoh urut dari kiri; pengecoh D-nya "bagi dikerjakan dulu tanpa kurung". Hanya Soal 5 yang menangkap salah paham ini (A).
- **Usulan:** "| Urutan operasi keliru (urut dari kiri, atau kurung diabaikan) | 3, 5 | **Catat untuk uji tunda M01.** Anak yang salah di Soal 3 dan Soal 5 → rapat mutu |"

**1.3 · INKONSISTENSI (ringan) — dua versi kalimat ucapan latihan campur-aduk**

- **Letak:** tabel menit, baris "Latihan campur-aduk"
- **Masalah:** ada dua versi kalimat.
  - M02–M07 dan M09–M13: *"Delapan soal. Soalnya campur. Sebelum mengerjakan, tanya dirimu: ini soal apa? Baru pilih caranya."*
  - M15–M19, M21, M22 (perbaikan 17-8 Matematika-2): *"Delapan soal. Soalnya campur. Kenali dulu soalnya soal apa, baru kerjakan."*
  - Versi kedua janggal ("soalnya soal apa"). Dua koordinator menulis kalimat berbeda untuk tujuan yang sama.
- **Usulan:** samakan M15–M22 dengan versi M02–M13. B07–B11 dilaporkan di Kelompok 5.

**1.4 · RINGAN — M12 Halaman 4, salah paham berpelurus/berpenyiku**

- **Letak:** `M12` · baris 291
- **Kutipan:** "Sudut di garis lurus dihitung dari 90°. **Sudut di dalam sudut siku-siku** dihitung dari 180°"
- **Masalah:** frasa hasil ganti "pojok" → "sudut" menjadi berulang dan sulit dipahami pengajar.
- **Usulan:** "Dua sudut yang membentuk garis lurus dihitung dari 90°. Dua sudut yang membentuk sudut siku-siku dihitung dari 180°."

**1.5 · RINGAN — M02 Tiket 3, nama "Lampu A/B" di dalam "Cerita A/B"**

- **Letak:** `M02` · baris 597–599
- **Kutipan:** "Cerita B: Lampu A menyala setiap 3 menit. Lampu B …"
- **Masalah:** huruf A/B dipakai untuk dua hal sekaligus. Anak bisa membaca "Cerita A" sebagai cerita tentang Lampu A. Kunci tidak terpengaruh.
- **Usulan:** "Cerita B: Lampu merah menyala setiap 3 menit. Lampu hijau menyala setiap 5 menit. Kapan keduanya menyala bersama lagi?"

**1.6 · RINGAN — M13 Kuis 4 (uji tunda M05) sama dengan bagian pecahan S2 Butir 1**

- **Letak:** `M13` · baris 143 (P19) dan `simulasi/S2-matematika.md` Butir 1 (P20)
- **Kutipan:** "Berapa hasil 2/5 + 1/4?"
- **Masalah:** S2 Butir 1 (1 2/5 + 2 1/4) memuat penjumlahan pecahan yang persis sama, dan 13/20 bahkan menjadi pilihan A. Soal pengganti T-08 dibuat supaya anak tidak cukup mengingat jawaban, tetapi sekarang jawaban itu muncul lagi satu pertemuan kemudian.
- **Usulan (dicek skrip, kunci tetap D):**
  - Soal: "Berapa hasil 3/5 + 1/4?" A. 4/20 · B. 4/9 · C. 13/20 · D. 17/20
  - Langkah: 12/20 + 5/20 = 17/20
  - Alasan pengecoh: A (3 + 1)/20; B (3 + 1)/(5 + 4); C 12/20 + 1/20
  - Periksa: `F(3,5) + F(1,4) == F(17,20)`

**1.7 · RINGAN — M06 Soal 3, baris Periksa**

- **Letak:** `M06` · baris 403
- **Kutipan:** "`130 // lcm(8, 12) == 5 and 130 // 4 == 32`"
- **Masalah:** angka 4 (FPB) ditulis langsung, tidak dihitung dari angka soal.
- **Usulan:** "`130 // lcm(8, 12) == 5 and 130 // gcd(8, 12) == 32`"

---

## 2. Kelompok 2 — perbaikan Matematika-2 (M15–M19, M21–M24, S4)

**Diverifikasi: 34 soal berkunci dan 9 perubahan teks lain.**

- **Soal berkunci (34):**
  - M15 Soal 6, Soal 10
  - M16 Soal 9
  - M17 Soal 4, Tiket 3
  - M18 Kuis 1, Kuis 2, Soal 3, Tiket 3
  - M21 Terbimbing 1, Terbimbing 2, Kuis 2, Soal 4, Soal 6, Tiket 2
  - M22 Soal 1, Soal 9, Soal 12
  - M23 Terbimbing 1, Soal 1, Tiket 3
  - M24 Soal 8, Soal 12, Tiket 2
  - S4 Butir 2, 3, 5, 7, 13, 15, 16, 26, 28, 30
- **Perubahan teks lain (9):**
  - baris uji tunda M21, M22, M23
  - rujukan stimulus A–D di S4
  - soal tambal M24 Halaman 6
  - kotak papan M15 (38 kolom)
  - jaring-jaring M16 (34 kolom; 2 × 80 + 2 × 50 + 2 × 40 = 340)
  - langkah 5 Contoh jadi 2 M17
  - soal pemeriksa M23 Halaman 4
  - pemetaan uji tunda S4
  - ucapan latihan campur-aduk

**Hasil skrip:** 234 OK · 3 MASALAH (2.2–2.4).

Skrip membaca data langsung dari gambar di berkas, bukan dari Langkah:

- **Diagram batang:** tinggi batang di kolom label. Skrip juga memastikan tiap batang utuh dan sekolom dengan labelnya.
- **Piktogram:** gambar dihitung dengan kunci piktogram.
- **Denah:** dibaca dari tabel Belakang/Depan. Tampak depan = maksimum tiap kolom. Tampak samping kanan dari kiri ke kanan = baris depan lalu baris belakang, sama dengan Petunjuk M18 Kuis 2.

Hasilnya:

- **Kunci:** semua huruf kunci tepat, tidak ada pengecoh yang juga benar, dan semua pilihan angka urut.
- **Angka pengecoh:** cocok dengan alasannya. Contoh:
  - S4 Butir 16: A = 14 gambar × Rp3.000, B = □ diabaikan (96 kg), D = □ dihitung 8 kg (112 kg).
  - M22 Soal 12: A = (5 + 6) − (2 + 2) = 7.
  - M18 Kuis 2: B = 4, 6 (jumlah tiap baris) · C = 2, 3, 2 (tampak depan) · D = 3, 4, 3 (jumlah tiap kolom).
  - S4 Butir 26: A = 27 baris : 5 = 5,4 · B = data tengah 50 · D = 270 : 4 = 67,5.
- **Klaim "huruf kunci tidak ada yang berubah":** benar.
- **Uji tunda:** Soal di baris uji tunda M21 (Soal 3, 7), M22 (Soal 1, 10), dan M23 (Soal 3, 7) memang berkelompok "bulan lalu" dengan topik M12, M13, dan M15. Kuis 4 masing-masing juga bertopik sama.
- **Soal tambal M24 Halaman 6:** Tiket 3 (berbalik nilai) dirujuk ke M19 Soal 4 (berbalik nilai), jadi cocok.
- **Rujukan stimulus S4:** cocok (tabel A, cerita B, cerita C, diagram D). Butir 13 tidak lagi merujuk stimulus.
- **Ucapan latihan campur-aduk:** lihat masalah 1.3.

### Masalah

**2.1 · RINGAN — M22 Soal 9, Periksa pernyataan 4**

- **Letak:** `M22` · baris 585
- **Kutipan:** "`30 == (20 + 35 + 25 + 30 + 40) / 5`"
- **Masalah:** angka 30 di ruas kiri adalah data Kamis, tetapi ekspresinya sama persis dengan Periksa pernyataan 2. Kalau data Kamis berubah, baris ini tidak ikut gagal. Kunci tidak terpengaruh.
- **Usulan:** "`[20, 35, 25, 30, 40][3] == sum([20, 35, 25, 30, 40]) / 5`"

**2.2 · RINGAN — M23 Soal 1 ●, selisih pasangan lain sama dengan kunci**

- **Letak:** `M23` · baris 373–400
- **Masalah:** perbaikan 16-8 membuat data Jumat 20, Sabtu 60, Minggu 100. Sekarang Sabtu − Jumat = 40, sama dengan kunci (Minggu − Sabtu = 40). Anak yang memilih pasangan batang yang salah (salah paham 3 M21) tetap mendapat jawaban benar. Kebocoran seperti ini sengaja dihindari agen perbaikan di M21 Soal 4.
- **Usulan:** Jumat = 80 (4 baris batang, sumbu tetap naik 20). Kunci tetap B = 40, pilihan 2 · 40 · 60 · 100 tidak berubah. Dengan data ini, selisih pasangan lain adalah 20, dan tidak ada batang bernilai 40.

**2.3 · INKONSISTENSI (ringan) — S4 Butir 7–8 masih di bawah judul Stimulus A**

- **Letak:** `simulasi/S4-matematika-akhir.md` · baris 95–187
- **Masalah:** Butir 7 (kebun) dan Butir 8 (tepung) tidak memakai tabel A, tetapi masih di bawah judul "### Stimulus A: Buku yang dibaca saat libur". Judul "### Butir lepas (nomor 9–10)" baru muncul sesudah Butir 8. Ini masalah yang sama dengan 17-7, tetapi perbaikannya baru dikerjakan untuk Butir 13.
- **Usulan:** pindahkan judul ke atas Butir 7 dan ubah menjadi "### Butir lepas (nomor 7–10)".

**2.4 · RINGAN (istilah) — M16 Tiket 3, Langkah**

- **Letak:** `M16` · baris 628
- **Kutipan:** "Sisi yang berimpit **tertutup**, tidak terbungkus"
- **Masalah:** `03-standar-istilah.md` baris 125 mencantumkan "sisi yang tertutup" sebagai bentuk yang jangan dipakai.
- **Usulan:** "Sisi yang berimpit tidak terlihat dari luar, jadi tidak dibungkus → Benar."


---

## 3. Kelompok 3 — perbaikan simulasi Matematika (M08, M14, M20, S1–S3)

**Diverifikasi: 36 soal berkunci dan 8 perubahan teks lain.**

- **Soal berkunci (36):**
  - S1 Butir 2, 6, 9, 13, 27, 28, 30
  - S2 Butir 2, 4, 5, 10, 12, 17, 20, 24, 27
  - S3 Butir 1, 8, 11, 12, 14, 15, 16, 19, 21, 24, 25, 26, 29, 30
  - M08 Tiket 3
  - M14 Contoh jadi 1, Soal 10, Soal 11, Tiket 3
  - M20 Soal 3
- **Perubahan teks lain (8):**
  - baris menit 5–7 dan paragraf "Kapan dipakai" di M08, M14, M20
  - rujukan butir di M08 Halaman 4 dan 6
  - M20 Halaman 1 salah paham 2
  - M20 Penjelasan alternatif 2
  - M20 Halaman 4
  - "pertemuan 100 menit"
  - kalimat Benar/Salah M14
  - rujukan "Berdasarkan teks X"

**Hasil skrip:** 190 OK · 13 MASALAH.

Semua huruf kunci tepat, dan tidak ada pengecoh yang juga benar.

- **Batas:** tidak ambigu lagi. S1 Butir 13(3) "sesudah 07.00 sampai sebelum 08.00" → 07.18, 07.36, 07.54. S3 Butir 19: 150 bukan kelipatan 60.
- **Bangun:** sah. Trapesium siku-siku S3 Butir 11 (8² + 15² = 17²) dan segitiga M20 Soal 3 (12² + 16² = 20²).
- **Denah S3:** belakang 3, 1, 0 · depan 2, 1, 1. Hasilnya 8 kubus, tampak depan 3-1-1, samping kanan 2 dan 3, tampak atas 5 persegi, 3 kubus tersembunyi.
- **Angka pengecoh:** cocok dengan alasannya. Contoh:
  - M08 Tiket 3: B = 1/4 dikira 0,14 → Rp49.200; D = 0,45 dikira 4,5% → Rp84.600.
  - S2 Butir 17: B = 8 × 10 : 2.
  - S3 Butir 21: B = 5 − 3 8/10 = 1 1/5.
- **Konsistensi turunan:** `Kunci ringkas` 90/90, bentuk 18/6/6, sebaran huruf sesuai klaim, dan Peta soal M08/M14/M20 cocok (lihat bagian 0).
- **Sisa teks lama:** tidak ada "layang-layang", "dm²", "Lihat bacaan", atau "sesi" di keenam berkas.

### Masalah

**3.1 · INKONSISTENSI — Terbimbing 1 simulasi "dipakai sebagai soal cadangan di pertemuan Matematika berikutnya", tetapi tidak ada di modul berikutnya**

- **Letak:** `M08` baris 147 · `M14` baris 138 · `M20` baris 140
- **Masalah:** koordinator menulis ulang "Kapan dipakai" menjadi "Contoh jadi 1 diperagakan ringkas di menit 5–7 (±90 detik) … Terbimbing 1 **tidak** dijalankan di hari simulasi; soal itu dipakai sebagai soal cadangan di pertemuan Matematika berikutnya". Namun M09, M15, dan M21 tidak menyebut Terbimbing 1 M08/M14/M20 sama sekali, jadi soal itu tidak punya tempat.
- **Laporan temuan juga keliru:** `temuan-simulasi-matematika.md` baris T-2.1 masih mengklaim "Contoh jadi 1 + Terbimbing 1 dipindah ke menit 33–40 M07/M13/M19". Klaim itu tidak benar lagi; menit 33–39 di M07/M13/M19 berisi latihan campur-aduk.
- **Usulan:**
  - Kalimat di ketiga modul menjadi: "Terbimbing 1 **tidak** dijalankan di hari simulasi. Pakai sebagai soal ○ tambahan di Halaman 5 pertemuan Matematika berikutnya (M09/M15/M21) bagi anak yang selesai lebih dulu. **[PERLU DICEK — belum tertulis di M09/M15/M21]**"
  - Baris T-2.1 di laporan temuan menjadi: "Menit 5–7: satu kalimat petunjuk + Contoh jadi 1 ringkas (±90 detik); petunjuk ujian tercetak dan dibaca anak sendiri."

**3.2 · INKONSISTENSI — tanda [PERLU DICEK] M08 masih merujuk M07**

- **Letak:** `M08` · baris 147
- **Kutipan:** "**[PERLU DICEK — penempatan di M07 belum tertulis di modul M07; …]**"
- **Masalah:** paragraf ini tidak lagi menempatkan apa pun di M07. M14 dan M20 sudah memakai tanda [ASUMSI] yang baru.
- **Usulan:** samakan dengan M14/M20: "**[ASUMSI — waktu peragaan sangat pendek; langkah lain dibaca pengajar sebagai persiapan]**"

**3.3 · INKONSISTENSI — Petunjuk ujian S1–S3 bertentangan dengan menit 5–7 baru**

- **Letak:** `simulasi/S1-matematika.md`, `S2-matematika.md`, `S3-matematika.md` · baris 16
- **Kutipan:** "Dibacakan pengajar apa adanya di menit 5–7."
- **Masalah:** tabel menit M08/M14/M20 kini berbunyi "Ucapkan satu kalimat petunjuk (petunjuk lengkap tercetak di halaman depan naskah) … Baca sendiri sebelum mulai". Pengajar yang membuka paket akan membacakan seluruh petunjuk, sehingga peragaan Contoh jadi 1 tidak muat dalam 2 menit.
- **Usulan:** "Tercetak di halaman depan lembar soal dan dibaca anak sendiri di menit 5–7. Pengajar hanya mengucapkan satu kalimat petunjuk (lihat tabel menit M08/M14/M20)."

**3.4 · INKONSISTENSI (ringan) — papan saat peragaan menit 5–7 (M14, M20)**

- **Letak:** `M14` baris 138 · `M20` baris 61 dan 140
- **Kutipan M14:** "Di hari simulasi, hanya patokan tempo (langkah 6) yang ada di sudut papan."
- **Kutipan M20:** "urutan putaran kedua … ditutup kertas sampai menit 67"
- **Masalah:** peragaan Contoh jadi 1 di menit 5–7 menulis langkah-langkahnya di papan, termasuk urutan putaran kedua.
- **Usulan:**
  - M14: "Sesudah peragaan, papan dihapus kecuali patokan tempo (langkah 6)."
  - M20: "Sesudah peragaan, papan dihapus; urutan putaran kedua ditulis ulang kecil di sudut papan dan ditutup kertas sampai menit 67."

**3.5 · AMBIGU — S2 Butir 4, pernyataan 1**

- **Letak:** `simulasi/S2-matematika.md` · baris 97
- **Kutipan:** "Dari yang paling sedikit, urutannya naik sepeda, naik becak motor, jalan kaki."
- **Masalah:** kunci **B**, tetapi yang paling sedikit adalah **diantar mobil** (sisanya 15% = 6 anak, dihitung skrip). Anak yang teliti bisa menjawab Salah karena urutannya tidak dimulai dari mobil.
- **Usulan:** "Urutan dari yang paling sedikit: mobil, sepeda, becak motor, jalan kaki." (10 kata, kunci tetap B)
  - Langkah (1): 15 < 20 < 30 < 35
  - Periksa: `1 - F('0.35') - F(1,5) - F(30,100) < F(1,5) < F(30,100) < F('0.35')`

**3.6 · RINGAN — S3 Butir 1, alasan pengecoh C**

- **Letak:** `S3` · baris 46
- **Kutipan:** "C — penyebut 13 paling besar dikira nilainya paling besar"
- **Masalah:** penyebut terbesar adalah 15 (Farhan), bukan 13.
- **Usulan:** "C — setengah dari 13 dikira 6, jadi 6/13 dianggap sudah lebih dari setengah."

**3.7 · RINGAN — S3 Butir 24, pilihan rasio tidak urut nilainya**

- **Letak:** `S3` · baris 471–474
- **Kutipan:** "A. 1 : 1 · B. 4 : 5 · C. 5 : 4 · D. 8 : 5"
- **Masalah:** 1 : 1 (= 1) ditaruh sebelum 4 : 5 (= 0,8). Aturan pengecoh 4 meminta urutan kecil ke besar.
- **Usulan:** urutkan menjadi A. 4 : 5 · B. 1 : 1 · C. 5 : 4 · D. 8 : 5, dengan kunci **B**.
  - Perbarui `Kunci ringkas` no. 24 dan klaim sebaran S3 menjadi A 4 · B 6 · C 5 · D 3.
  - Kalau kunci ringkas ingin tetap, biarkan A sebagai kunci dan beri catatan pengecualian.

**3.8 · RINGAN — M14 Soal 11 ● terlalu panjang**

- **Letak:** `M14` · baris 483
- **Masalah:** ada 4 kalimat sebelum pertanyaan, padahal soal kelas ● paling banyak 2 kalimat (`04-standar-soal`, tabel ●/○).
- **Usulan:** "Kelas membeli 21 buku tulis seharga Rp4.980 per buku. Bulatkan harga ke ribuan dan banyak buku ke puluhan." Kunci dan pengecoh tetap.

**3.9 · RINGAN — S1 Butir 2 di grup teks A tanpa rujukan**

- **Letak:** `S1` · baris 61
- **Masalah:** butir 1–3 berada di bawah Stimulus A. Butir 1 dan 3 memakai "Berdasarkan teks A", tetapi Butir 2 langsung "Koperasi punya …". Butir ini memang tidak memakai tabel harga.
- **Usulan:** "Berdasarkan teks A, koperasi juga menyimpan 24 pensil dan 36 penghapus."

**3.10 · RINGAN — Periksa pernyataan Salah tanpa `!=`/`not` (S2)**

- **Letak:** `S2` baris 110 (Butir 4 p4) dan baris 491 (Butir 24 p3)
- **Kutipan:** "`F(30,100) < F('0.35')`" · "`2 * 1000 > 750`"
- **Usulan:** "`not (F(30,100) > F('0.35'))`" · "`not (2 * 1000 < 750)`"

**3.11 · RINGAN — M08 Halaman 6 dan S1 berbeda soal "butir paling sulit"**

- **Letak:** `M08` · baris 545
- **Kutipan:** "kembaran butir S1 yang diperkirakan paling sulit: butir 10 …, butir 20 …, dan butir 8"
- **Masalah:** S1 baris 717 menyebut butir tersulit 10, 20, **28**, lalu menulis bahwa Tiket 3 kembaran butir 8.
- **Usulan:** "Tiket 1 dan 2 kembaran butir tersulit 10 dan 20; Tiket 3 kembaran butir 8 (tiga bentuk bilangan dalam satu cerita)."

**3.12 · RINGAN — M20 Halaman 4 mengutip frasa dari S2**

- **Letak:** `M20` · baris 268
- **Kutipan:** "Kata kecil seperti 'tanpa tutup' atau 'dari muatan awal'"
- **Masalah:** "dari muatan awal" ada di S2, tidak ada di S3.
- **Usulan:** "Kata kecil seperti 'tanpa tutup' atau 'diisi penuh' mengubah seluruh hitungan." Kedua frasa ada di S3 (teks A dan Butir 12).

**3.13 · RINGAN — S3 Butir 21, kalimat tanya janggal**

- **Letak:** `S3` · baris 413
- **Kutipan:** "Berapa km lagi jarak yang **kurang** dari keinginan Kakek?"
- **Usulan:** "Berapa km lagi Kakek harus berjalan agar genap 5 km?"


---

## 4. Kelompok 4 — perbaikan Bahasa Indonesia-1 (B01–B06, T01–T18)

**Diverifikasi: 39 soal berkunci dan 6 perubahan teks lain.**

Jawaban setiap soal ditentukan dari teks sebelum kunci dibaca.

- **Soal berkunci (39):**
  - B01 Diagnostik 3, 5, 7, 8, 9, 10 · Soal 2, 3, 7, 10, 11
  - B02 Soal 4, 5, 6, 8, 10, 11, 12 · Tiket 3
  - B03 Kuis 2 · Soal 2, 4, 7, 10 · Tiket 2
  - B04 Kuis 3, 4 · Soal 2, 4, 5, 9
  - B05 Tiket 3
  - B06 Soal 4, 7, 10, 11, 12
  - T08 Pertanyaan 2 · T11 Pertanyaan 2
- **Perubahan teks lain (6):**
  - teks B B01
  - T11 paragraf 3
  - "bagan" → "tabel" di B03–B05
  - definisi B03 baris 23
  - aturan tambal B01
  - istilah "menyimpulkan watak"

**Hasil skrip:** 44 OK · 21 MASALAH. Skrip memeriksa hal yang bisa dihitung: kutipan Langkah ada di teks, urutan dan panjang pilihan, klaim sebaran, rujukan catatan, dan panjang kalimat.

### Hasil pembacaan

- **Kunci:** tidak ada kunci salah, dan tidak ada pengecoh yang bisa dibela anak yang membaca cermat.
  - **B04 Soal 9 p1:** kalimat pertama kini hanya menyebut letak warung, dan payungnya jelas kalimat terakhir.
  - **T11 P2:** "Rizki menyusul dan memimpin. Keumala berlari di belakangnya." Kalimat ini membuat Rizki satu-satunya yang paling depan sebelum Aisyah mempercepat lari.
  - **B02 Soal 5:** kalimat ke-2, 6, 7 memang semua benda bawaan Cut Nabila; kalimat ke-3 milik ayah.
  - **B02 Soal 11:** "sarat" dibela kalimat "Dua keranjang besar penuh ikan tongkol." di teks Soal 8.
  - **B03 Soal 2 dan 4:** "Sebelum itu" dan "Setelah mandi/menyiram" hanya menghasilkan satu urutan.
  - **B06 Soal 11:** hanya B yang tertulis sebagai sebab.
  - **B06 Soal 12:** hanya A yang mengikat pilihan dan akibat Alif.
- **Kutipan Langkah:** semua kutipan ada kata per kata di teksnya, termasuk teks yang dirujuk soal lain (B02 Soal 4 → teks Soal 2, Soal 11 → teks Soal 8; B01 Diagnostik 6–10 → teks B).
- **Konsistensi:** Peta soal dan sebaran huruf ≤ 4 di B01–B06 cocok (bagian 0).
- **Istilah:** tidak ada sisa "bagan" di B03–B05.

### Masalah

**4.1 · INKONSISTENSI — klaim "Sebaran kunci PG" di Halaman 5 tidak diperbarui (5 berkas)**

Hitungan skrip sama dengan tabel tindak lanjut di laporan temuan, tetapi baris di modul masih versi lama.

| Berkas · baris | Tertulis | Seharusnya |
|---|---|---|
| B01 · 567 | A 1 · B 4 · C 2 · D 3 | **A 2 · B 4 · C 3 · D 1** |
| B02 · 371 | A 3 · B 2 · C 3 · D 2 | **A 2 · B 2 · C 4 · D 2** |
| B03 · 384 | A 3 · B 2 · C 3 · D 2 | **A 2 · B 3 · C 3 · D 2** |
| B04 · 375 | A 2 · B 3 · C 2 · D 3 | **A 2 · B 3 · C 3 · D 2** |
| B06 · 378 | A 3 · B 2 · C 3 · D 2 | **A 3 · B 3 · C 3 · D 1** |

**4.2 · INKONSISTENSI — B01 Catatan kesalahan umum belum mengikuti Soal 2 dan 10 yang baru**

- **Letak:** `B01` · baris 800–802
- **Masalah:** Soal 2 dan 10 kini soal "kata apa yang dicari lebih dulu". Pengecohnya: kata tanya, nama tokoh yang ada di banyak kalimat (teks terbaca dari awal), dan kata tempat. Namun:
  - baris "Menjawab dari pengetahuan sendiri" masih memuat 2 dan 10;
  - baris "Memilih kata … untuk orang atau hal lain" masih memuat 10;
  - baris "Membaca ulang teks dari awal" tidak memuat keduanya.
- **Usulan:**
  - Baris 800 → "3, 8 (pernyataan 4), 12"
  - Baris 801 → "1, 8 (pernyataan 2), 9"
  - Baris 802 → "2, 4, 5, 8, 10, 12"

**4.3 · INKONSISTENSI — definisi "Tabel" merujuk ke Bagian 6 yang tidak memuatnya**

- **Letak:** `B03` · baris 23, dan `00-berkas-induk/03-standar-istilah.md` · baris 168
- **Kutipan:** "**Tabel** = kotak berbaris dan berkolom untuk menyusun isi teks (`03-standar-istilah.md` Bagian 6)"
- **Masalah:** Bagian 6 hanya punya baris "**bagan** — gambar kotak dan panah", sedangkan kata itu sudah diganti "tabel" di B03–B05.
- **Usulan:** tambah baris di Bagian 6: "| **tabel** (menyusun ulang informasi) | Kotak berbaris dan berkolom untuk menyusun isi teks | bagan (untuk tabel) |". Catatan sisa di `temuan-bahasa-indonesia-1.md` (baris "B03 masih memakai kata 'bagan'") juga diberi keterangan "selesai".

**4.4 · INKONSISTENSI (ringan) — B04 Catatan kesalahan umum, Soal 4**

- **Letak:** `B04` · baris 620
- **Kutipan:** "| Memilih rincian bukan ide pokok | 2, 4, 9 (pernyataan 2), 11 |"
- **Masalah:** Soal 4 baru (PG kompleks gagasan pendukung) punya pengecoh C "ide pokok dan gagasan pendukung tertukar" dan E "pengetahuan sendiri". Tidak ada pengecoh "rincian".
- **Usulan:** hapus 4 dari baris itu. Tambah baris "| Ide pokok ikut dipilih sebagai gagasan pendukung | 4 | *"Kalimat ini payung atau isi payung?"* |".

**4.5 · RINGAN — B01 Diagnostik 9: kata "warga" tidak ada lagi di teks B, dan kunci pilihan terpanjang**

- **Letak:** `B01` · baris 297–307
- **Masalah:** kalimat "Karena itu, warga menanam kelapa…" sudah dihapus. Pertanyaan ("bagi warga") dan kunci A ("kehidupan warga") masih memakai kata itu. Jawabannya tetap dapat disimpulkan, tetapi kunci A (45 huruf) adalah pilihan terpanjang.
- **Usulan:**
  - Kalimat ke-4 teks B: "Santan dipakai warga untuk memasak kuah."
  - Kunci A: "Pohon kelapa sangat membantu warga." (35 huruf)
  - Cek ulang kutipan Diagnostik 8 C ("Santan dipakai untuk memasak kuah.") menjadi "Santan dipakai warga untuk memasak kuah."

**4.6 · RINGAN — B06 Soal 7: kalimat soal 14 kata dan memakai "sesuai"**

- **Letak:** `B06` · baris 497
- **Kutipan:** "Berdasarkan cerita di soal nomor 4, pilih **semua** pernyataan yang sesuai tentang perubahan latar."
- **Usulan:** "Menurut cerita nomor 4, pilih **semua** pernyataan yang benar tentang latar." (11 kata)

**4.7 · RINGAN — urutan pilihan belum pendek → panjang, atau kunci jadi terpanjang sesudah pengecoh diganti**

| Soal · baris | Panjang (huruf) | Usulan |
|---|---|---|
| B02 Soal 10 · 556–559 | 19 · 21 · 20 · 23 | C → "pohon bambu di halaman" (22); kunci tetap B |
| B03 Soal 2 · 414–417 | 14 · 18 · 17 · 21 | Tukar B dan C, kunci menjadi **C**. Ubah juga ucapan kunci pengajar "Nomor 2, …" di tabel menit dan klaim sebaran (A 2 · B 2 · C 4 · D 2) |
| B04 Kuis 4 · 155–158 | 3 · 5 · 8 · 7 | Tukar C dan D, kunci menjadi **D**; huruf di alasan pengecoh disesuaikan |
| B06 Soal 11 · 583–586 | 28 · 33 · 34 · 29 | Urutkan A pindah (28) · B tidak mau berbicara (29) · C Nayla (33) · D sekolah (34); kunci menjadi **C**. Sebaran B06 menjadi A 3 · B 2 · C 4 · D 1 |
| B03 Tiket 2 · 675 | kunci B terpanjang (46) | B → "Keluarga Salsabila merawat kebun bersama." (40) |
| B04 Soal 2 · 408 | kunci C terpanjang (40), sejak D dipendekkan (27) | D → "Syifa suka bermain di luar bersama teman." (40) |

**4.8 · RINGAN — T11 Pertanyaan 2, alasan pengecoh B**

- **Letak:** `03-bank-teks-baca-cepat/T11-lomba-lari-blang-padang.md` · baris 55
- **Kutipan:** "B — Keumala juga menyusul Alif, tetapi ia tiba sesudah Rizki"
- **Masalah:** kalimat tentang Keumala menyusul Alif sudah diganti koordinator. Teks kini menulis "Keumala berlari di belakangnya."
- **Usulan:** "B — Keumala juga berada di depan Alif yang berhenti, tetapi ia berlari di belakang Rizki."

**4.9 · RINGAN — B01 aturan tambal, susunan kalimat**

- **Letak:** `B01` · baris 543
- **Kutipan:** "8 soal ● sebagai lembar tambal selama B02 dan B03: dikerjakan di rumah; kunci dibacakan …, soal ○ untuk an[ak …]"
- **Masalah:** kalimat ini memakai dua tanda titik dua dan bagian soal ○ menggantung.
- **Usulan:** "8 soal ● dikerjakan di rumah selama B02 dan B03. Kunci dibacakan Jumat berikutnya sesudah kelas (±5 menit, di luar 45 menit). Soal ○ diberikan kepada anak yang sudah benar semua soal ●."


---

## 5. Kelompok 5 — perbaikan Bahasa Indonesia-2 (B07–B12, S5, T19–T36)

**Diverifikasi: 20 soal dibaca langsung dari teks, dan 30 butir S5 dicek turunannya.**

- **Dibaca langsung dari teks (20 soal):**
  - B07 Soal 1, 2, 11
  - B09 Contoh jadi 1
  - B10 Soal 4
  - B11 Terbimbing 2 · Soal 8, 12 · Tiket 1
  - B12 Soal 2
  - S5 Butir 3, 4, 7, 19, 22, 24
  - T32 Pertanyaan 1, 2
- **Dicek turunannya:** 30 butir S5 (Kunci ringkas, bentuk, sebaran), jumlah kata teks S5 A–G, ucapan kunci menit 39–40 B07–B11, tabel menit B12, dan sisa istilah lama.

**Hasil skrip:** 47 OK · 13 MASALAH.

### Hasil pembacaan

- **Kunci:** tidak ada kunci salah.
  - **S5 Butir 4:** "angkat tangan" kini jelas dibela "Nayla membalas lambaian itu".
  - **S5 Butir 7:** hanya D dan E yang berisi penilaian ("terlalu murah", "paling istimewa").
  - **S5 Butir 19:** hanya C yang tidak bertentangan dengan "Setelah dipotong" dan "Sebelum itu".
  - **B07 Soal 2:** "panjang tangan" dipakai dalam arti sebenarnya, dibela kalimat 2–3.
  - **B12 Soal 2:** hanya KM Rondo yang memenuhi kedua syarat.
  - **T32 P1:** tabel E = 11 cm.
- **Jumlah kata S5:** teks A–G cocok dengan klaim (±3, perbedaan cara hitung penggalan ucapan).
- **Kunci ringkas S5:** 30/30. Bentuk 18/6/6, sebaran A 4 · B 4 · C 5 · D 5.
- **Tabel menit B12:** total 100.
- **Ucapan latihan campur-aduk B07–B11:** sama di kelima modul dan cocok untuk BI ("pertanyaan ini menanyakan apa?").
- **Istilah:** tidak ada sisa "keterangan" untuk kunci piktogram atau "alamat jawaban".

### Masalah

**5.1 · INKONSISTENSI (penting) — B07 kunci yang dibacakan pengajar salah**

- **Letak:** `02-modul-bahasa-indonesia/B07-makna-ungkapan-idiom-majas.md` · baris 88 (menit 39–40)
- **Kutipan:** *"Nomor 1, C. Nomor 2, **B**. …"*
- **Masalah:** Soal 2 ● diganti (K-12, "panjang tangan"), dan kuncinya kini **C**. Anak yang menjawab benar akan mencoret jawabannya sendiri.
- **Usulan:** *"Nomor 1, C. Nomor 2, C. …"*

**5.2 · INKONSISTENSI — B12 Soal 2, alasan pengecoh C tidak menghasilkan C**

- **Letak:** `B12` · baris 356–377
- **Kutipan:** "C — tepat 10.00 dikira 'sebelum 10.00'"
- **Masalah:** kalau KM Sabang (tiba 10.00) ikut dihitung, kapal yang berangkat paling pagi tetap KM Rondo (06.30 < 07.00). Salah paham itu menghasilkan kunci, bukan C (dicek skrip).
- **Usulan:** jadwal KM Sabang berangkat **06.15** (tiba tetap 10.00).
  - Dengan tafsiran "tepat 10.00 boleh", pilihan jatuh ke KM Sabang (C).
  - Kunci tetap B, dan D (KM Seulawah 06.00, tiba 10.30) tetap berlaku.
  - Tambah Periksa: `"06.15" < "06.30"`.

**5.3 · INKONSISTENSI — rujukan "menit 85" sesudah tabel menit B12 diubah (L-12)**

Tabel menit baru: jeda 82–84 (pohon kode dibuka), Terbimbing + Contoh jadi 2 di 84–88, analisis kesalahan 88–95.

| Letak | Kutipan | Usulan |
|---|---|---|
| `B12` · 66 | "baru dibuka di menit 85" | "baru dibuka di menit 88" |
| `B12` · 87 | "ditutup kertas sampai menit 85" | "ditutup kertas sampai menit 82" |
| `simulasi/S5-bahasa-indonesia-akhir.md` · 668 | "diisi anak di menit 85–95" | "diisi anak di menit 88–95" |
| `S5` · 674 | "Dibacakan di menit 85" | "Dibacakan di menit 88" |

**5.4 · AMBIGU (sedang) — B11 Terbimbing 2, pilihan A**

- **Letak:** `B11` · baris 286–310
- **Kutipan:** larik "senyumnya selalu hangat" (kunci A, B)
- **Masalah:** C sudah diperbaiki menjadi gambaran. Namun A juga gambaran tentang Ibu, bukan kata perasaan "aku". Petunjuk sendiri meminta anak membedakan "larik berisi rasa" dari "yang hanya menggambarkan". Anak yang mengikuti Petunjuk bisa hanya memilih B.
- **Usulan:**
  - Larik 4 dan pilihan A menjadi "aku suka senyumnya yang hangat" (kunci tetap A, B).
  - Langkah A: "kata 'aku suka' menunjukkan rasa sayang".

**5.5 · AMBIGU (ringan) — B11 Soal 8, pilihan D "sakit perut"**

- **Letak:** `B11` · baris 573–592
- **Kutipan:** larik "perutku terasa melilit" · D. sakit perut
- **Masalah:** "melilit" secara harfiah memang sakit perut, dan puisinya tidak memuat penanda cemas lain selain "berdetak keras". Anak bisa membela D.
- **Usulan:**
  - D → "marah" (alasan: "berdetak keras" dibaca sebagai marah, salah paham 3), atau
  - larik 2 → "besok ujian pertamaku," supaya sebab cemas tertulis.

**5.6 · RINGAN — B09 Contoh jadi 1, label gambar tidak sama dengan tulisan**

- **Letak:** `B09` · baris 181 dan 187
- **Kutipan:** tulisan "Paling banyak diantar orang tua." · gambar "Diantar motor │… 14"
- **Masalah:** Langkah 4 berkata "Cocok dengan tulisan". Data 14 dari 32 memang terbanyak, tetapi labelnya berbeda.
- **Usulan:** label batang "Diantar orang tua". Lebar gambar tetap ≤ 40 kolom kalau label lain dirapikan.

**5.7 · RINGAN — B11 Soal 12, alasan pengecoh A**

- **Letak:** `B11` · baris 682
- **Kutipan:** "A — hanya dua baris pertama yang dibaca, lalu berhenti"
- **Masalah:** dua baris pertama (10 dan 12) hanya memberi "jus buah", karena 10 tidak lebih dari 10.
- **Usulan:** "A — hanya dua baris pertama yang dibaca, dan tepat 10 dikira 'lebih dari seperempat'."

**5.8 · RINGAN — S5 Butir 3, Petunjuk merujuk kata yang tidak ada**

- **Letak:** `S5` · baris 96
- **Kutipan:** "Cari kalimat 'dulu' dan kalimat 'sejak hari itu'."
- **Masalah:** kata "dulu" tidak ada di teks A.
- **Usulan:** "Cari kalimat 'sering merengek' dan kalimat 'Sejak hari itu'."

**5.9 · RINGAN — S5 Butir 22 dan 24, kunci jelas paling panjang (butir yang diperbarui L-6)**

| Butir · baris | Panjang pilihan (huruf) | Usulan |
|---|---|---|
| Butir 22 · 463–466 | A 9 · **B 28** · C 14 · D 13 | A. hancur · B. terpotong · C. tercium baunya · D. tersusun rapi; kunci A |
| Butir 24 · 504–507 | **A 20** · B 7 · C 12 · D 11 | A. sabar · B. pemarah · C. suka memuji · D. tidak peduli; kunci A |

Karena kunci Butir 22 berubah dari B ke A, `Kunci ringkas` dan klaim sebaran S5 menjadi A 5 · B 3 · C 5 · D 5. Alasan pengecoh (huruf) juga disesuaikan.

**5.10 · RINGAN — pernyataan/pilihan lain**

- **B10 Soal 4** · baris 452–453: pernyataan 1 dan 2 masing-masing 13 kata (> 12). Usulan: "Menyiram lebih sering relevan untuk masalah di kalimat 4." dan "Membeli pot bunga baru relevan untuk masalah di kalimat 4."
- **B11 Tiket 1** · baris 717–720: pilihan marah · senang · bangga · sedih belum urut panjang. Usulan: A marah · B sedih · C bangga · D senang, kunci menjadi **B**. Huruf di alasan pengecoh ikut diubah.
- **B07 Soal 11** · baris 550: tokoh dan tempat ("Bang Iqbal … bengkel Pak Hasan") sama dengan soal pemeriksa Halaman 4 "tangan kanan". Artinya juga mirip, sehingga soal bisa dijawab dari ingatan pembahasan. Usulan: ganti tokoh dan tempat, mis. "Kak Nurul … warung Bu Salma".

---

## 6. Ringkasan dan kesimpulan

### Jumlah yang diverifikasi

| Kelompok | Soal/butir berkunci diverifikasi | Perubahan teks lain | Hasil skrip (OK · MASALAH) |
|---|---|---|---|
| 1 · Matematika-1 (M01–M13) | 14 | 13 | 110 · 5 |
| 2 · Matematika-2 (M15–M24, S4) | 34 | 9 | 234 · 3 |
| 3 · Simulasi M08/M14/M20, S1–S3 | 36 | 8 | 190 · 13 |
| 4 · BI-1 (B01–B06, T08, T11) | 39 | 6 | 44 · 21 |
| 5 · BI-2 (B07–B12, S5, T32) | 20 (+ 30 butir S5 dicek turunan) | 5 | 47 · 13 |
| Global (semua berkas) | Peta soal 36 modul · Kunci ringkas 150 butir · tabel menit 36 modul | — | 0 masalah |
| **Jumlah** | **143** | **41** | **625 · 55** |

"MASALAH" skrip dihitung per pemeriksaan, jadi satu masalah di laporan bisa muncul beberapa kali. Contoh: klaim sebaran 5 berkas = 5 baris skrip = 1 masalah laporan.

### Jumlah masalah per tingkat

| Tingkat | Jumlah | Nomor |
|---|---|---|
| **KUNCI SALAH** | **0** | — |
| **AMBIGU** | **3** | 3.5 (S2 Butir 4 p1), 5.4 (B11 Terbimbing 2), 5.5 (B11 Soal 8) |
| **INKONSISTENSI** | **15** | 1.1, 1.2, 1.3, 2.3, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3 |
| **RINGAN** | **25** | 1.4–1.7, 2.1, 2.2, 2.4, 3.6–3.13, 4.5–4.9, 5.6–5.10 |
| **Jumlah** | **43** | |

### Prioritas perbaikan

1. **5.1** — B07 menit 39–40 membacakan kunci Nomor 2 = B, padahal kuncinya C. Ini satu-satunya kesalahan yang langsung membuat anak mencoret jawaban benar.
2. **3.5, 5.4, 5.5** — tiga soal yang kuncinya bisa dibantah anak yang membaca cermat.
3. **3.1–3.4, 5.3** — alur menit hari simulasi (M08/M14/M20 dengan S1–S3, B12 dengan S5) tidak lagi saling cocok sesudah tabel menit diubah. Pengajar akan membaca petunjuk atau membuka amplop kunci di menit yang salah.
4. **4.1, 4.2, 4.4, 1.2** — klaim sebaran dan Catatan kesalahan umum yang belum diperbarui (tidak mengubah kunci, tetapi menyesatkan rapat mutu).
5. **5.2, 1.1, 2.2, 2.3, 4.3** — alasan pengecoh, rujukan salah paham, dan istilah baku.
6. Sisanya ringan (urutan dan panjang pilihan, panjang kalimat, Periksa).

### Kesimpulan

- **Kunci:** perbaikan tidak memasukkan kunci salah. Setiap soal Matematika yang berubah dihitung ulang dari angka soal. Semua kunci tepat, tidak ada pengecoh yang juga benar, PG kompleks lengkap, dan tiap pernyataan PG kategori benar. Semua baris Periksa bernilai benar dan dihitung dari angka soal (kecuali catatan ringan 1.7 dan 2.1).
- **Konsistensi global:** Peta soal, sebaran huruf ≤ 4, tabel menit 45/100, dan `Kunci ringkas` S1–S5 konsisten di semua berkas.
- **Sisa masalah:** tiga soal masih ambigu, dan sejumlah teks turunan belum ikut diperbarui. Yang paling berdampak adalah ucapan kunci B07, rujukan menit pada hari simulasi, dan klaim sebaran BI.
- **Rekomendasi:** paket **layak dipakai sesudah masalah prioritas 1–3 diperbaiki**. Prioritas 4–6 dapat dikerjakan bersamaan tanpa menghitung ulang kunci, kecuali usulan yang mengubah huruf kunci (3.7, 4.7, 5.9, 5.10). Usulan itu wajib diikuti pembaruan `Kunci ringkas`, klaim sebaran, dan ucapan kunci pengajar.
- Sesudah perbaikan, jalankan ulang `05-pemeriksaan/verifikasi/verif_akhir.py` dan ketiga perintah `_alat/periksa.py`.

---

## 7. Tindak lanjut perbaikan (koordinator, 17 September 2026)

Skrip: `_alat/perbaikan_akhir.py` + penggantian langsung. Sesudahnya `periksa.py` dijalankan ulang pada semua modul, paket, dan teks: **SALAH 0, tanpa temuan**. Catatan: `verif_akhir.py` menyimpan data soal versi lama sebagai pembanding, jadi baris "MASALAH" untuk M13 Kuis 4, M23 Soal 1, S2 Butir 4, S3 Butir 1, dan M08/M14/M20 Terbimbing 1 kini menunjuk ke versi sebelum perbaikan. Kehadiran perbaikan dicek langsung di berkas.

| Temuan | Diperbaiki | Yang diubah |
|---|---|---|
| 5.1 B07 ucapan kunci | ya | "Nomor 2, C" |
| 3.5 S2 Butir 4 p1 | ya | Pernyataan + Langkah + Periksa (urutan dimulai dari mobil) |
| 5.4 B11 Terbimbing 2 | ya | Larik 4 dan pilihan A "aku suka senyumnya yang hangat" |
| 5.5 B11 Soal 8 | ya | D → "marah" + alasan |
| 3.1 Terbimbing 1 simulasi | ya | Dibawa pulang sebagai latihan mandiri bersama lembar hasil simulasi |
| 3.2 M08 tanda PERLU DICEK | ya | Diganti [ASUMSI] seperti M14/M20 |
| 3.3 Petunjuk ujian S1–S3 | ya | Tercetak di halaman depan, dibaca anak sendiri |
| 3.4 Papan saat peragaan M14/M20 | ya | Papan dihapus sesudah peragaan |
| 5.3 B12/S5 rujukan menit | ya | 85 → 88 / 82 |
| 5.2 B12 Soal 2 pengecoh C | ya | KM Sabang berangkat 06.15 |
| 1.1, 1.2 M09 | ya | Alasan pengecoh C; catatan "urutan operasi keliru" soal 3, 5 |
| 1.3 Kalimat campur-aduk M15–M22 | ya | Disamakan dengan M02–M13 |
| 1.4 M12 · 1.5 M02 · 1.6 M13 · 1.7 M06 | ya | Sesuai usulan (M13 Kuis 4 kini 3/5 + 1/4 = 17/20) |
| 2.1 M22 · 2.2 M23 · 2.3 S4 · 2.4 M16 | ya | Periksa; Jumat = 80; judul "Butir lepas (nomor 7–10)"; istilah |
| 3.6 S3 Butir 1 · 3.8 M14 Soal 11 · 3.9 S1 Butir 2 · 3.10 S2 Periksa · 3.12 M20 · 3.13 S3 Butir 21 | ya | Sesuai usulan |
| 3.7 S3 Butir 24 urutan rasio | tidak | Mengubah huruf kunci, kunci ringkas, dan sebaran; manfaatnya kecil |
| 3.11 M08 butir tersulit | tidak | Isi M08 sudah menyebut Tiket 3 kembaran butir 8; perbedaan hanya di catatan S1 |
| 4.1 Klaim sebaran B01–B06 | ya | Dihitung ulang otomatis dari kunci |
| 4.2 B01 · 4.4 B04 catatan kesalahan umum | ya | Nomor soal diperbarui; baris baru B04 |
| 4.3 Istilah "tabel" | ya | Baris baru di `03-standar-istilah.md` Bagian 6 |
| 4.5 B01 Diagnostik 9 | sebagian | Kunci A dipendekkan; teks B tidak diubah (jawaban tetap dapat disimpulkan) |
| 4.6 B06 Soal 7 · 4.8 T11 · 4.9 B01 aturan tambal | ya | Sesuai usulan |
| 4.7 Urutan/panjang pilihan | sebagian | B02 Soal 10, B03 Tiket 2, B04 Soal 2 dikerjakan; B03 Soal 2, B04 Kuis 4, B06 Soal 11 tidak (mengubah huruf kunci) |
| 5.6 B09 · 5.7 B11 · 5.8 S5 | ya | Label "Orang tua"; alasan pengecoh; Petunjuk |
| 5.9 S5 Butir 22, 24 | tidak | Mengubah huruf kunci dan kunci ringkas; ringan |
| 5.10 B10 · B07 Soal 11 | ya | Pernyataan dipendekkan; tokoh/tempat diganti Kak Nurul · warung Bu Salma |
| 5.10 B11 Tiket 1 urutan | tidak | Mengubah huruf kunci; ringan |
