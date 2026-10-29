# 02 — Peta Spiral 36 Pertemuan

**Berkas paling penting di antara berkas induk.** Latihan campur-aduk tidak bisa ditulis modul per modul secara terpisah. Soal daur ulang di setiap modul **diambil dari tabel ini, tidak dikarang sendiri**.

Label: **[FAKTA]** · **[HITUNGAN]** · **[ASUMSI]** · **[PERLU DICEK]**.
Tabel ini dihasilkan dan diperiksa dengan skrip `_alat/peta_final.py`. Kalau tabel diubah, jalankan ulang skripnya.

---

## 1. Cara membaca

| Istilah di tabel | Arti |
|---|---|
| **P01–P36** | Urutan pertemuan keseluruhan (satuan jarak dalam aturan daur ulang) |
| **M01–M24 / B01–B12** | Kode modul per mapel |
| **Minggu lalu** | Topik untuk **4 soal** kelompok "minggu lalu" di halaman 5. Topik pertama di daftar = topik pertemuan lalu (mapel yang sama). Kalau ada 2–3 topik, 4 soal dibagi serata mungkin, dan topik pertama mendapat sisanya |
| **Bulan lalu** | Topik untuk **3 soal** kelompok "bulan lalu" di halaman 5. **Mulai P13, kolom ini sekaligus menjadi uji tunda** rapor penguasaan (1 soal kuis + 2 soal ● bulan lalu) |
| **Kuis pembuka** | Topik keempat soal kuis: 2 dari pertemuan lalu, 1 minggu lalu, 1 bulan lalu |
| **Pertanyaan 2 baca cepat** | Kemampuan membaca yang dilatih pertanyaan ke-2 (pertanyaan tersirat) pada teks T-nomor-pertemuan. Inilah jalur daur ulang BI di hari Matematika (Keputusan K5) |
| **PR-M1…PR-M6, PR-B1, PR-B2** | Kategori prasyarat kelas 3–4. Isinya ada di `01-spesifikasi-program.md` Bagian 5 |

---

## 2. Tabel utama

| P | Mgg · Hari | Kode | Topik hari ini | Daur ulang "minggu lalu" | Daur ulang "bulan lalu" (= uji tunda) | Kuis pembuka (4 soal) | Pertanyaan 2 baca cepat melatih | Teks |
|---|---|---|---|---|---|---|---|---|
| P01 | 1 · Sen | **M01** | Diagnostik + operasi bilangan cacah | — (tes diagnostik) | — | Diganti tes diagnostik | umum (tersirat) | T01 |
| P02 | 1 · Rab | **M02** | Faktor, kelipatan, KPK, FPB | M01 | PR-M2 | M01 ×2 · PR-M1 · PR-M2 | umum (tersirat) | T02 |
| P03 | 1 · Jum | **B01** | Diagnostik + membaca soal berstimulus | — (tes diagnostik) | — | Lintas mapel: M01 ×2 · M02 ×2 (lihat spesifikasi) | umum (tersirat) | T03 |
| P04 | 2 · Sen | **M03** | Pecahan senilai & membandingkan pecahan | M02 · M01 | PR-M4 | M02 ×2 · M01 · PR-M4 | B01 | T04 |
| P05 | 2 · Rab | **M04** | Pecahan, desimal, persen | M03 · M01 | PR-M1 | M03 ×2 · M01 · PR-M1 | B01 | T05 |
| P06 | 2 · Jum | **B02** | Informasi tersurat & kosakata dari konteks | B01 | PR-B1 | B01 ×2 · PR-B2 · PR-B1 | B01 | T06 |
| P07 | 3 · Sen | **M05** | Penjumlahan & pengurangan pecahan | M04 · M02 | M01 | M04 ×2 · M02 · M01 | B02 | T07 |
| P08 | 3 · Rab | **M06** | Perkalian & pembagian pecahan | M05 · M03 | M02 | M05 ×2 · M03 · M02 | B02 | T08 |
| P09 | 3 · Jum | **B03** | Menyusun ulang informasi | B02 · B01 | PR-B2 | B02 ×2 · B01 · PR-B2 | B02 | T09 |
| P10 | 4 · Sen | **M07** | Operasi campuran lintas bentuk | M06 · M04 | M03 | M06 ×2 · M04 · M03 | B03 | T10 |
| P11 | 4 · Rab | **M08** | **SIMULASI 1 (M01-M07)** | — (simulasi) | — | Tidak ada — simulasi | B03 | T11 |
| P12 | 4 · Jum | **B04** | Ide pokok & gagasan pendukung | B03 · B02 | B01 | B03 ×2 · B02 · B01 | B03 | T12 |
| P13 | 5 · Sen | **M09** | Satuan panjang, berat, volume | M07 · M06 · M05 | M01 | M07 ×2 · M05 · M01 | B04 | T13 |
| P14 | 5 · Rab | **M10** | Waktu, kecepatan, laju perubahan | M09 · M07 | M02 | M09 ×2 · M07 · M02 | B04 | T14 |
| P15 | 5 · Jum | **B05** | Tokoh, peristiwa, amanat | B04 · B03 | B01 | B04 ×2 · B03 · B01 | B04 | T15 |
| P16 | 6 · Sen | **M11** | Keliling & luas bangun datar | M10 · M09 | M03 | M10 ×2 · M09 · M03 | B05 | T16 |
| P17 | 6 · Rab | **M12** | Sudut & kekongruenan | M11 · M09 | M04 | M11 ×2 · M09 · M04 | B05 | T17 |
| P18 | 6 · Jum | **B06** | Perubahan pada tokoh & latar | B05 · B04 | B02 | B05 ×2 · B04 · B02 | B05 | T18 |
| P19 | 7 · Sen | **M13** | Penaksiran & pembulatan | M12 · M10 | M05 | M12 ×2 · M10 · M05 | B06 | T19 |
| P20 | 7 · Rab | **M14** | **SIMULASI 2 (M01-M13)** | — (simulasi) | — | Tidak ada — simulasi | B06 | T20 |
| P21 | 7 · Jum | **B07** | Makna ungkapan, idiom, majas | B06 · B05 | B03 | B06 ×2 · B05 · B03 | B06 | T21 |
| P22 | 8 · Sen | **M15** | Volume kubus & balok | M13 · M12 · M11 | M06 | M13 ×2 · M11 · M06 | B07 | T22 |
| P23 | 8 · Rab | **M16** | Luas permukaan & bangun ruang gabungan | M15 · M13 | M07 | M15 ×2 · M13 · M07 | B07 | T23 |
| P24 | 8 · Jum | **B08** | Fakta & opini | B07 · B06 | B04 | B07 ×2 · B06 · B04 | B07 | T24 |
| P25 | 9 · Sen | **M17** | Visualisasi spasial | M16 · M15 | M09 | M16 ×2 · M15 · M09 | B08 | T25 |
| P26 | 9 · Rab | **M18** | Rasio & perbandingan | M17 · M15 | M10 | M17 ×2 · M15 · M10 | B08 | T26 |
| P27 | 9 · Jum | **B09** | Membaca infografik, grafik, tabel | B08 · B07 | B05 | B08 ×2 · B07 · B05 | B08 | T27 |
| P28 | 10 · Sen | **M19** | Perbandingan senilai, berbalik nilai, skala | M18 · M16 | M11 | M18 ×2 · M16 · M11 | B09 | T28 |
| P29 | 10 · Rab | **M20** | **SIMULASI 3 (M01-M19)** | — (simulasi) | — | Tidak ada — simulasi | B09 | T29 |
| P30 | 10 · Jum | **B10** | Menilai relevansi & kesesuaian | B09 · B08 | B06 | B09 ×2 · B08 · B06 | B09 | T30 |
| P31 | 11 · Sen | **M21** | Piktogram, diagram batang, tabel frekuensi | M19 · M18 · M17 | M12 | M19 ×2 · M17 · M12 | B10 | T31 |
| P32 | 11 · Rab | **M22** | Menafsirkan data & rata-rata | M21 · M19 | M13 | M21 ×2 · M19 · M13 | B10 | T32 |
| P33 | 11 · Jum | **B11** | Puisi & respons emosional | B10 · B09 | B07 | B10 ×2 · B09 · B07 | B10 | T33 |
| P34 | 12 · Sen | **M23** | Latihan PG kompleks & kategori | M22 · M21 | M15 | M22 ×2 · M21 · M15 | B11 | T34 |
| P35 | 12 · Rab | **M24** | **Latihan bertempo + SIMULASI AKHIR (M01-M23)** | — (simulasi) | — | Tidak ada — simulasi | B11 | T35 |
| P36 | 12 · Jum | **B12** | **Latihan bentuk soal + bertempo + SIMULASI AKHIR (B01-B11)** | — (simulasi) | — | Tidak ada — simulasi | B11 | T36 |

**Catatan baris.**
- **P02–P10, kolom "bulan lalu"**, belum bisa menjadi uji tunda karena belum ada topik yang berumur ≥10 pertemuan. Isinya prasyarat (P02, P04, P05, P06, P09) atau topik terlama yang tersedia (P07 M01, P08 M02, P10 M03). **Uji tunda sungguhan untuk M01 terjadi di P13 (M09).**
- **P13 (M09)** datang sesudah simulasi. "Pertemuan lalu" untuk kuisnya = **M07**, topik isi terakhir sebelum simulasi. Begitu juga P22 (M15 → kuis dari M13) dan P31 (M21 → kuis dari M19).
- **M23** tidak punya materi baru. "Topik hari ini" = **bentuk soal** PG kompleks dan PG kategori. Lima soal hari ini boleh berisi topik lama mana pun, asal bentuknya PG kompleks atau PG kategori.
- **Simulasi** (M08, M14, M20, M24, B12) tidak punya kuis pembuka. Isi daur ulangnya ada di Bagian 6.

---

## 3. Aturan daur ulang

Tiap topik isi harus muncul kembali **minimal tiga kali** setelah pertemuan aslinya:

| Jendela | Jarak dari pertemuan asli | Tempat kemunculan |
|---|---|---|
| **J1** | 1–2 pertemuan | Matematika: kuis + "minggu lalu" pertemuan Matematika berikutnya. BI: **pertanyaan 2 baca cepat** di hari-hari sesudahnya (K5) |
| **J2** | 4–6 pertemuan | Kelompok "minggu lalu" + slot kuis minggu lalu |
| **J3** | 10–14 pertemuan (±3,3–4,7 minggu) | Kelompok "bulan lalu" + slot kuis bulan lalu = **uji tunda** |

**[FAKTA — *Tahap 2*, Latimier dkk. 2021]** Jarak seragam sama baiknya dengan jarak yang makin melebar (g = 0,034). Karena itu jendela dibuat tetap, tidak adaptif.

**[FAKTA — *Tahap 2B*]** Latihan campur-aduk **merugikan** materi berupa kata (g = −0,39). Program ini tidak punya latihan kosakata murni. Soal kosakata **dari konteks** (B02) adalah soal membaca, bukan hafalan, jadi boleh dicampur. **Kalau ada pengajar yang menambah daftar kosakata untuk dihafal, daftar itu diblok per tema, tidak dicampur.**

---

## 4. Tabel kebalikan — memeriksa tidak ada topik terlewat

Kolom "cara": **latihan** = masuk kelompok minggu lalu/bulan lalu halaman 5 (dan kuis) · **kuis** = hanya di kuis · **baca cepat** = pertanyaan 2 baca cepat · **simulasi** = butir paket simulasi.

| Topik | Diajarkan | Muncul kembali (pertemuan · cara) | Jml | J1 (+1–2) | J2 (+4–6) | J3 (+10–14) |
|---|---|---|---|---|---|---|
| **M01** | P01 | P02 M02 (latihan) · P04 M03 (latihan) · P05 M04 (latihan) · P07 M05 (latihan) · P11 M08 (simulasi) · P13 M09 (latihan) · P20 M14 (simulasi) · P29 M20 (simulasi) · P35 M24 (simulasi) | 9 | ✅ | ✅ | ✅ |
| **M02** | P02 | P04 M03 (latihan) · P07 M05 (latihan) · P08 M06 (latihan) · P11 M08 (simulasi) · P14 M10 (latihan) · P20 M14 (simulasi) · P29 M20 (simulasi) · P35 M24 (simulasi) | 8 | ✅ | ✅ | ✅ |
| **M03** | P04 | P05 M04 (latihan) · P08 M06 (latihan) · P10 M07 (latihan) · P11 M08 (simulasi) · P16 M11 (latihan) · P20 M14 (simulasi) · P29 M20 (simulasi) · P35 M24 (simulasi) | 8 | ✅ | ✅ | ✅ |
| **M04** | P05 | P07 M05 (latihan) · P10 M07 (latihan) · P11 M08 (simulasi) · P17 M12 (latihan) · P20 M14 (simulasi) · P29 M20 (simulasi) · P35 M24 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **M05** | P07 | P08 M06 (latihan) · P11 M08 (simulasi) · P13 M09 (latihan) · P19 M13 (latihan) · P20 M14 (simulasi) · P29 M20 (simulasi) · P35 M24 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **M06** | P08 | P10 M07 (latihan) · P11 M08 (simulasi) · P13 M09 (latihan) · P20 M14 (simulasi) · P22 M15 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **M07** | P10 | P11 M08 (simulasi) · P13 M09 (latihan) · P14 M10 (latihan) · P20 M14 (simulasi) · P23 M16 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **M09** | P13 | P14 M10 (latihan) · P16 M11 (latihan) · P17 M12 (latihan) · P20 M14 (simulasi) · P25 M17 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **M10** | P14 | P16 M11 (latihan) · P19 M13 (latihan) · P20 M14 (simulasi) · P26 M18 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **M11** | P16 | P17 M12 (latihan) · P20 M14 (simulasi) · P22 M15 (latihan) · P28 M19 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **M12** | P17 | P19 M13 (latihan) · P20 M14 (simulasi) · P22 M15 (latihan) · P29 M20 (simulasi) · P31 M21 (latihan) · P35 M24 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **M13** | P19 | P20 M14 (simulasi) · P22 M15 (latihan) · P23 M16 (latihan) · P29 M20 (simulasi) · P32 M22 (latihan) · P35 M24 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **M15** | P22 | P23 M16 (latihan) · P25 M17 (latihan) · P26 M18 (latihan) · P29 M20 (simulasi) · P34 M23 (latihan) · P35 M24 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **M16** | P23 | P25 M17 (latihan) · P28 M19 (latihan) · P29 M20 (simulasi) · P35 M24 (simulasi) | 4 | ✅ | ✅ | ✅ |
| **M17** | P25 | P26 M18 (latihan) · P29 M20 (simulasi) · P31 M21 (latihan) · P35 M24 (simulasi) | 4 | ✅ | ✅ | ✅ |
| **M18** | P26 | P28 M19 (latihan) · P29 M20 (simulasi) · P31 M21 (latihan) · P35 M24 (simulasi) | 4 | ✅ | ✅ | ❌ |
| **M19** | P28 | P29 M20 (simulasi) · P31 M21 (latihan) · P32 M22 (latihan) · P35 M24 (simulasi) | 4 | ✅ | ✅ | ❌ |
| **M21** | P31 | P32 M22 (latihan) · P34 M23 (latihan) · P35 M24 (simulasi) | 3 | ✅ | ✅ | ❌ |
| **M22** | P32 | P34 M23 (latihan) · P35 M24 (simulasi) | 2 | ✅ | ❌ | ❌ |
| **B01** | P03 | P04 M03 (baca cepat) · P05 M04 (baca cepat) · P06 B02 (baca cepat) · P06 B02 (latihan) · P09 B03 (latihan) · P12 B04 (latihan) · P15 B05 (latihan) · P36 B12 (simulasi) | 8 | ✅ | ✅ | ✅ |
| **B02** | P06 | P07 M05 (baca cepat) · P08 M06 (baca cepat) · P09 B03 (baca cepat) · P09 B03 (latihan) · P12 B04 (latihan) · P18 B06 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B03** | P09 | P10 M07 (baca cepat) · P11 M08 (baca cepat) · P12 B04 (baca cepat) · P12 B04 (latihan) · P15 B05 (latihan) · P21 B07 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B04** | P12 | P13 M09 (baca cepat) · P14 M10 (baca cepat) · P15 B05 (baca cepat) · P15 B05 (latihan) · P18 B06 (latihan) · P24 B08 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B05** | P15 | P16 M11 (baca cepat) · P17 M12 (baca cepat) · P18 B06 (baca cepat) · P18 B06 (latihan) · P21 B07 (latihan) · P27 B09 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B06** | P18 | P19 M13 (baca cepat) · P20 M14 (baca cepat) · P21 B07 (baca cepat) · P21 B07 (latihan) · P24 B08 (latihan) · P30 B10 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B07** | P21 | P22 M15 (baca cepat) · P23 M16 (baca cepat) · P24 B08 (baca cepat) · P24 B08 (latihan) · P27 B09 (latihan) · P33 B11 (latihan) · P36 B12 (simulasi) | 7 | ✅ | ✅ | ✅ |
| **B08** | P24 | P25 M17 (baca cepat) · P26 M18 (baca cepat) · P27 B09 (baca cepat) · P27 B09 (latihan) · P30 B10 (latihan) · P36 B12 (simulasi) | 6 | ✅ | ✅ | ✅ |
| **B09** | P27 | P28 M19 (baca cepat) · P29 M20 (baca cepat) · P30 B10 (baca cepat) · P30 B10 (latihan) · P33 B11 (latihan) · P36 B12 (simulasi) | 6 | ✅ | ✅ | ❌ |
| **B10** | P30 | P31 M21 (baca cepat) · P32 M22 (baca cepat) · P33 B11 (baca cepat) · P33 B11 (latihan) · P36 B12 (simulasi) | 5 | ✅ | ✅ | ❌ |
| **B11** | P33 | P34 M23 (baca cepat) · P35 M24 (baca cepat) · P36 B12 (baca cepat) · P36 B12 (simulasi) | 4 | ✅ | ❌ | ❌ |

**[HITUNGAN — hasil skrip]** 29 topik isi diperiksa. 28 topik muncul kembali ≥3 kali. 22 topik memenuhi ketiga jendela.

**Pengecualian — dicatat terbuka (Keputusan K6):**

| Topik | Masalah | Pengganti |
|---|---|---|
| M18, M19, M21 | Jendela J3 (P+10) jatuh setelah P36 | Uji tunda diambil dari butir simulasi akhir M24 |
| **M22** | Hanya muncul kembali 2× (M23, M24). J2 dan J3 tidak terpenuhi | Uji tunda dari M24. **Dasar rapor M22 paling lemah** — sampaikan ke orang tua sebagai "baru bisa", bukan "kuasai" |
| B09, B10 | J3 jatuh setelah P36 | Uji tunda dari simulasi akhir B12 |
| **B11** | J2 dan J3 tidak terpenuhi. Muncul lewat baca cepat P34, P35, P36 + simulasi B12 | Sama seperti M22 |

---

## 5. Pertemuan awal (P01–P03)

| Pertemuan | Masalah | Aturan pengganti — tegas |
|---|---|---|
| **P01 (M01)** | Tidak ada pertemuan lalu, minggu lalu, maupun bulan lalu | **Kuis pembuka diganti tes diagnostik** 16 soal (PR-M1–PR-M6). Halaman 5 berisi 5 soal operasi bilangan cacah + 4 soal PR-M1–PR-M3 + 3 soal PR-M4–PR-M6. Soal ● **tidak dikerjakan di kelas**, dipakai sebagai soal tambal minggu 1–2 untuk anak dengan skor diagnostik 7–11 |
| **P02 (M02)** | "Minggu lalu" hanya M01; "bulan lalu" belum ada | Minggu lalu = **M01**. Bulan lalu = **PR-M2 (fakta perkalian & pembagian)**, karena itu prasyarat langsung faktor dan kelipatan. Kuis: M01 ×2 · PR-M1 · PR-M2 |
| **P03 (B01)** | BI belum punya materi sama sekali | Kuis pembuka lintas mapel (M01 ×2, M02 ×2), karena menit 0–5 tetap harus pengulangan. Tes diagnostik BI 10 soal. Halaman 5: 5 soal "baca pertanyaan dulu" + 4 soal PR-B2 + 3 soal PR-B1, untuk tambal |
| P04–P12 | "Bulan lalu" belum berumur 10 pertemuan | Pakai **prasyarat yang paling dekat dengan topik hari ini** (lihat tabel utama). Mulai P07 pakai topik terlama yang tersedia |

**Prinsipnya** **[FAKTA — Rey dkk. 2019]**: memecah materi tidak menolong anak berpengetahuan awal rendah (d = −0,12). Selama topik lama belum ada, yang didaur ulang adalah **prasyarat yang terbukti bolong di diagnostik**.

---

## 6. Bobot simulasi

Semua paket berisi **30 soal / 75 menit**. Komposisi bentuk di setiap paket: **PG 18 · PG kompleks 6 · PG kategori 6**. **[ASUMSI — proporsi resmi per bentuk tidak ada di sumber. PERLU DICEK terhadap "Ayo Coba TKA"]**

Setiap butir di kunci **wajib diberi label kode topik** (mis. `M05`). Tanpa label, analisis kesalahan dan uji tunda tidak bisa dihitung.

### S1 — M08 (P11), cakupan M01–M07

| Topik | M01 | M02 | M03 | M04 | M05 | M06 | M07 | **Jumlah** |
|---|---|---|---|---|---|---|---|---|
| Soal | 3 | 4 | 4 | 5 | 5 | 5 | 4 | **30** |

Blok untuk halaman 5 (tambal): terbaru M05–M07 (5 soal) · sebelumnya M03–M04 (4 soal) · terlama M01–M02 (3 soal).

### S2 — M14 (P20), cakupan M01–M13

| Blok | Topik dan soal | Jumlah |
|---|---|---|
| Terbaru | M09 3 · M10 3 · M11 3 · M12 3 · M13 3 | 15 |
| Lama | M01 1 · M02 2 · M03 2 · M04 2 · M05 3 · M06 2 · M07 3 | 15 |
| | | **30** |

Blok halaman 5: terbaru M11–M13 (5) · sebelumnya M09–M10 (4) · terlama M01–M07 (3).

### S3 — M20 (P29), cakupan M01–M19

| Blok | Topik dan soal | Jumlah |
|---|---|---|
| Terbaru | M15 3 · M16 3 · M17 3 · M18 3 · M19 2 | 14 |
| Tengah | M09 1 · M10 2 · M11 2 · M12 1 · M13 2 | 8 |
| Lama | M01 1 · M02 1 · M03 1 · M04 1 · M05 1 · M06 1 · M07 2 | 8 |
| | | **30** |

Blok halaman 5: terbaru M17–M19 (5) · sebelumnya M15–M16 (4) · terlama M01–M13 (3).

### S4 — M24 (P35), simulasi akhir Matematika, cakupan M01–M23

Disusun **per domain TKA**. **[ASUMSI — proporsi domain resmi TKA SD tidak ada di sumber; PERLU DICEK terhadap Perka BSKAP 047/H/AN/2025]**

| Domain | Topik dan soal | Jumlah |
|---|---|---|
| Bilangan | M01 1 · M02 1 · M03 1 · M04 1 · M05 1 · M06 1 · M07 1 · M13 1 · M18 2 · M19 2 | 12 |
| Geometri & Pengukuran | M09 1 · M10 2 · M11 2 · M12 1 · M15 2 · M16 2 · M17 2 | 12 |
| Data | M21 3 · M22 3 | 6 |
| | | **30** |

**Uji tunda dari S4** untuk M16, M17, M18, M19 (2 butir): 2 benar → 3 · 1 benar → 1 · 0 → 0. Untuk M21, M22 (3 butir): jumlah benar langsung.

Blok halaman 5: terbaru M21–M23 (5) · sebelumnya M15–M19 (4) · terlama M01–M13 (3).

### S5 — B12 (P36), simulasi akhir Bahasa Indonesia, cakupan B01–B11

30 soal atas **6–7 teks** (soal bergrup, 3–6 soal per teks), panjang tiap teks 150–200 kata.

| Topik | B02 | B03 | B04 | B05 | B06 | B07 | B08 | B09 | B10 | B11 | **Jumlah** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Soal | 4 | 4 | 3 | 3 | 2 | 2 | 3 | 4 | 3 | 2 | **30** |

B01 (strategi membaca soal) tidak diberi butir sendiri karena dipakai di semua butir. Minimal 1 teks puisi (B11), 1 infografik/tabel (B09), dan 1 teks informasi berisi fakta dan opini (B08).

**Uji tunda dari S5** untuk B08 dan B10 (3 butir): jumlah benar. B09 (4 butir): 4 → 3 · 3 → 2 · 2 → 1 · ≤1 → 0. B11 (2 butir): 2 → 3 · 1 → 1 · 0 → 0.

Blok halaman 5: terbaru B09–B11 (5) · sebelumnya B06–B08 (4) · terlama B01–B05 (3).
