"""Menyusun 00-berkas-induk/02-peta-spiral.md dari tabel_peta.md (hasil peta_final.py)."""
t = open('tabel_peta.md', encoding='utf-8').read().strip().split('\n\n')
main, rev = t[0], t[1]

head = '''# 02 — Peta Spiral 36 Pertemuan

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

'''

mid = '''

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

'''

tail = '''

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
'''

open('../00-berkas-induk/02-peta-spiral.md', 'w', encoding='utf-8').write(head + main + mid + rev + tail)
print("ok")
