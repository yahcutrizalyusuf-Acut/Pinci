# Laporan Impor Bahan TKA

Dibuat otomatis oleh `npx tsx scripts/impor-tka.ts` pada 2026-10-29. Jangan disunting tangan; jalankan ulang skripnya.

- Paket: `assets/paket/tka-k6.json` · versi 1.0.0 · sidik jari bahan `c9c11b1ec3037d8d`
- Berkas dibaca: 36 modul, 5 paket simulasi, 36 teks baca cepat
- Semua butir berstatus `belum_diperiksa` (CLAUDE.md aturan 10), kecuali yang ditandai pemeriksa kunci menjadi `perlu_dicek`.

## 1. Ringkasan jumlah

| Isi | Jumlah |
|---|---|
| Topik | 36 (24 Matematika + 12 Bahasa Indonesia) |
| Simulasi | 5 (S1: 30 · S2: 30 · S3: 30 · S4: 30 · S5: 30 butir) |
| Teks baca cepat | 36 (72 pertanyaan) |
| Butir seluruhnya | 982 — PG 783 · PG kompleks 78 · PG kategori 121 |
| Soal kelas ● / cadangan ○ | 288 / 144 |
| Latihan rumah (id soal ○) | 116 butir di 29 topik |
| Terbimbing · kuis · tiket · diagnostik | 74 · 120 · 108 · 26 |
| Contoh jadi | 72 |
| Butir gagal dibaca (tidak masuk paket) | **0** |
| Peringatan (masuk paket) | 0 |

### Per topik

| Topik | Judul | ● | ○ | Rumah | Terbimbing | Kuis | Tiket | Diag. | Contoh jadi | Salah paham | PG/PGK/PGKat |
|---|---|---|---|---|---|---|---|---|---|---|---|
| M01 | Diagnostik dan Operasi Bilangan Cacah | 8 | 4 | 0 | 2 | 0 | 3 | 16 | 2 | 3 | 31/1/1 |
| M02 | Faktor, Kelipatan, KPK, dan FPB | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M03 | Pecahan Senilai dan Membandingkan Pecahan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M04 | Pecahan, Desimal, dan Persen | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M05 | Penjumlahan dan Pengurangan Pecahan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M06 | Perkalian dan Pembagian Pecahan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M07 | Operasi Campuran Lintas Bentuk | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M08 | Simulasi 1 | 8 | 4 | 0 | 2 | 0 | 3 | 0 | 2 | 3 | 13/1/3 |
| M09 | Satuan Panjang, Berat, dan Volume | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M10 | Waktu, Kecepatan, dan Laju Perubahan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M11 | Keliling dan Luas Bangun Datar | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M12 | Sudut dan Kekongruenan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M13 | Penaksiran dan Pembulatan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M14 | Simulasi 2 | 8 | 4 | 0 | 2 | 0 | 3 | 0 | 2 | 3 | 13/1/3 |
| M15 | Volume Kubus dan Balok | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M16 | Luas Permukaan dan Bangun Ruang Gabungan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M17 | Visualisasi Spasial | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M18 | Rasio dan Perbandingan | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M19 | Perbandingan Senilai, Berbalik Nilai, dan Skala | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| M20 | Simulasi 3 | 8 | 4 | 0 | 2 | 0 | 3 | 0 | 2 | 3 | 12/2/3 |
| M21 | Piktogram, Diagram Batang, dan Tabel Frekuensi | 8 | 4 | 4 | 3 | 4 | 3 | 0 | 2 | 3 | 18/1/3 |
| M22 | Menafsirkan Data dan Rata-rata | 8 | 4 | 4 | 3 | 4 | 3 | 0 | 2 | 3 | 19/0/3 |
| M23 | Latihan PG Kompleks dan PG Kategori | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 8/6/7 |
| M24 | Latihan Bertempo dan Simulasi Akhir Matematika | 8 | 4 | 0 | 2 | 0 | 3 | 0 | 2 | 3 | 14/1/2 |
| B01 | Diagnostik dan Cara Membaca Soal Berstimulus | 8 | 4 | 0 | 2 | 4 | 3 | 10 | 2 | 3 | 28/1/2 |
| B02 | Informasi Tersurat dan Arti Kata dari Konteks | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| B03 | Menyusun Ulang Informasi | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| B04 | Ide Pokok dan Gagasan Pendukung | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| B05 | Tokoh, Peristiwa, dan Amanat | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| B06 | Perubahan pada Tokoh dan Latar | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 18/1/2 |
| B07 | Makna Ungkapan, Idiom, dan Majas | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 17/1/3 |
| B08 | Fakta dan Opini | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 16/2/3 |
| B09 | Membaca Infografik, Grafik, dan Tabel | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 17/1/3 |
| B10 | Menilai Relevansi dan Kesesuaian | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 16/2/3 |
| B11 | Puisi dan Respons Emosional | 8 | 4 | 4 | 2 | 4 | 3 | 0 | 2 | 3 | 16/2/3 |
| B12 | Latihan Bentuk Soal dan Simulasi Akhir | 8 | 4 | 0 | 2 | 0 | 3 | 0 | 2 | 3 | 12/2/3 |

### Per simulasi

| Simulasi | Judul | Dipakai di | Waktu | Butir | PG/PGK/PGKat | Butir berstimulus bersama |
|---|---|---|---|---|---|---|
| S1 | Simulasi 1 Matematika (M08 · P11) | M08 | 75 menit | 30 | 18/6/6 | 10 |
| S2 | Simulasi 2 Matematika (M14 · P20) | M14 | 75 menit | 30 | 18/6/6 | 6 |
| S3 | Simulasi 3 Matematika (M20 · P29) | M20 | 75 menit | 30 | 18/6/6 | 9 |
| S4 | Simulasi Akhir Matematika (M24 · P35) | M24 | 75 menit | 30 | 18/6/6 | 11 |
| S5 | Simulasi Akhir Bahasa Indonesia (B12 · P36) | B12 | 75 menit | 30 | 18/6/6 | 30 |

### Teks baca cepat

36 teks, 72 pertanyaan; jumlah kata 150–188 menurut kepala berkas.

Jumlah kata di kepala berkas cocok (selisih ≤ 3) dengan hitungan ulang untuk semua teks.

## 2. Butir yang gagal dibaca

Tidak ada. Semua judul soal berformat baku terbaca menjadi butir yang sah.

### Peringatan (butir tetap masuk paket)

Tidak ada.

### Stimulus yang disalin dari soal lain

Butir yang hanya menulis "teks A" atau "di soal nomor 4" diberi salinan teks yang dirujuk, supaya setiap butir bisa tampil sendiri.

- B01-d02: stimulus diambil dari B01-d01
- B01-d03: stimulus Teks A disalin
- B01-d04: stimulus diambil dari B01-d01
- B01-d05: stimulus Teks A disalin
- B01-d07: stimulus diambil dari B01-d06
- B01-d08: stimulus diambil dari B01-d06
- B01-d09: stimulus Teks B disalin
- B01-d10: stimulus Teks B disalin
- B01-k09: stimulus diambil dari B01-k01
- B02-k04: stimulus diambil dari B02-k02
- B02-k11: stimulus diambil dari B02-k08
- B05-k07: stimulus diambil dari B05-k04

## 3. Sebaran kunci PG

Standar (`04-standar-soal.md` bagian 2 aturan 8): dari soal PG halaman 5 satu modul, **tidak ada huruf yang menjadi kunci lebih dari 4 kali**. Untuk simulasi, sebaran dibandingkan dengan klaim di berkas.

| Topik | Sebaran PG halaman 5 | Sesuai standar |
|---|---|---|
| M01 | A 1 · B 4 · C 4 · D 1 | ya |
| M02 | A 2 · B 4 · C 4 · D 0 | ya |
| M03 | A 3 · B 3 · C 3 · D 1 | ya |
| M04 | A 2 · B 4 · C 3 · D 1 | ya |
| M05 | A 4 · B 3 · C 1 · D 2 | ya |
| M06 | A 1 · B 3 · C 4 · D 2 | ya |
| M07 | A 0 · B 4 · C 3 · D 3 | ya |
| M08 | A 2 · B 2 · C 3 · D 3 | ya |
| M09 | A 3 · B 4 · C 3 · D 0 | ya |
| M10 | A 2 · B 3 · C 4 · D 1 | ya |
| M11 | A 2 · B 4 · C 1 · D 3 | ya |
| M12 | A 1 · B 3 · C 4 · D 2 | ya |
| M13 | A 3 · B 3 · C 2 · D 2 | ya |
| M14 | A 1 · B 4 · C 3 · D 2 | ya |
| M15 | A 0 · B 4 · C 4 · D 2 | ya |
| M16 | A 1 · B 4 · C 3 · D 2 | ya |
| M17 | A 2 · B 2 · C 4 · D 2 | ya |
| M18 | A 2 · B 4 · C 1 · D 3 | ya |
| M19 | A 3 · B 4 · C 2 · D 1 | ya |
| M20 | A 2 · B 3 · C 3 · D 2 | ya |
| M21 | A 1 · B 4 · C 4 · D 1 | ya |
| M22 | A 1 · B 4 · C 4 · D 2 | ya |
| M23 | A 2 · B 2 · C 0 · D 0 | ya |
| M24 | A 2 · B 4 · C 4 · D 1 | ya |
| B01 | A 2 · B 4 · C 3 · D 1 | ya |
| B02 | A 2 · B 2 · C 4 · D 2 | ya |
| B03 | A 2 · B 3 · C 3 · D 2 | ya |
| B04 | A 2 · B 3 · C 3 · D 2 | ya |
| B05 | A 3 · B 2 · C 3 · D 2 | ya |
| B06 | A 3 · B 3 · C 3 · D 1 | ya |
| B07 | A 2 · B 2 · C 3 · D 2 | ya |
| B08 | A 2 · B 2 · C 3 · D 2 | ya |
| B09 | A 2 · B 3 · C 2 · D 3 | ya |
| B10 | A 2 · B 3 · C 2 · D 2 | ya |
| B11 | A 2 · B 3 · C 3 · D 1 | ya |
| B12 | A 2 · B 3 · C 2 · D 2 | ya |

Semua 36 topik sesuai standar.

| Simulasi | Sebaran PG (dihitung) | Klaim di berkas | Cocok |
|---|---|---|---|
| S1 | A 5 · B 5 · C 4 · D 4 | A 5 · B 5 · C 4 · D 4. | ya |
| S2 | A 5 · B 5 · C 4 · D 4 | A 5 · B 5 · C 4 · D 4. | ya |
| S3 | A 5 · B 5 · C 5 · D 3 | A 5 · B 5 · C 5 · D 3. | ya |
| S4 | A 4 · B 5 · C 5 · D 4 | — | — |
| S5 | A 4 · B 4 · C 5 · D 5 | — | — |

Seluruh paket (783 butir PG): A 154 (20%) · B 253 (32%) · C 238 (30%) · D 138 (18%). Sebaran ideal ±25% per huruf.

## 4. Pemeriksa kunci Matematika (`src/isi/tka/periksa-kunci.ts`)

Tiga lapis: (1) setiap baris `Periksa` bahan dihitung ulang dengan bilangan rasional tepat; (2) untuk PG, nilai `… == …` dicocokkan ke angka pada pilihan dan harus menunjuk huruf kunci; (3) untuk PG yang polanya dikenali, kunci dihitung langsung dari kalimat soal tanpa memakai baris Periksa.

| Ukuran | Jumlah |
|---|---|
| Butir Matematika diperiksa | 626 |
| **Berhasil dihitung ulang** | **573** |
| — lewat hitung mandiri dari kalimat soal (PG, PG kompleks) | 173 |
| — lewat kaitan nilai Periksa ↔ pilihan kunci (PG) | 286 |
| — lewat semua ekspresi Periksa benar (PG kompleks/kategori; ekspresi penulis dihitung ulang, belum dikaitkan langsung ke huruf kunci) | 114 |
| **Tidak bisa dihitung ulang** (tanpa hitungan, gambar/tampak, jam, rasio, kalimat) | **53** |
| Butir non-Matematika berbaris Periksa (teks baca cepat) | 42 |
| Ekspresi Periksa dijalankan | 942: benar 935 · salah 0 · galat 0 · format 0 · tanpa hitungan 7 |
| **Temuan (status → perlu_dicek)** | **0** |

Pola hitung mandiri yang cocok: operasi hitung 74 · PG kompleks dinilai per pilihan 18 · konversi satuan 14 · paling besar 8 · volume balok 8 · KPK 7 · FPB 6 · luas permukaan balok 6 · paling kecil 4 · rusuk kubus dari volume 4 · volume kubus 3 · rasio paling sederhana 3 · lama waktu 2 · jam tiba 2 · keliling persegi 2 · luas permukaan kubus 2 · faktor 1 · kelipatan persekutuan 1 · ubah ke persen 1 · faktor persekutuan 1 · pecahan paling sederhana 1 · lebih kecil dari 1/2 1 · ubah ke desimal 1 · luas segitiga 1 · rata-rata 1 · volume kubus (liter) 1.

**Temuan:** tidak ada. Tidak satu pun kunci bertentangan dengan hitungan ulang kode.

## 5. Temuan yang sudah dicatat di `05-pemeriksaan/`

Laporan mutu menyatakan **0 kunci salah** dari ±620 soal Matematika dan ±372 soal Bahasa Indonesia. Temuan ringan yang sengaja tidak diperbaiki penyusun dibawa ke paket sebagai `catatan` pada butirnya (status tetap `belum_diperiksa`, sebab kuncinya benar):

- **S3-24** — verifikasi-akhir 3.7: urutan rasio pada pilihan belum kecil → besar; sengaja tidak diperbaiki, kunci benar
- **S3-22** — laporan-mutu: S3 Butir 22–23 berbagi satu stimulus dan saling memberi petunjuk (wajar untuk soal bergrup)
- **S3-23** — laporan-mutu: S3 Butir 22–23 berbagi satu stimulus dan saling memberi petunjuk (wajar untuk soal bergrup)
- **S5-22** — verifikasi-akhir 5.9: kunci jelas pilihan paling panjang; sengaja tidak diperbaiki
- **S5-24** — verifikasi-akhir 5.9: kunci jelas pilihan paling panjang; sengaja tidak diperbaiki
- **B11-tk1** — verifikasi-akhir 5.10: urutan pilihan belum pendek → panjang; sengaja tidak diperbaiki
- **B03-k02** — verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki
- **B04-kz4** — verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki
- **B06-k11** — verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki
- **B01-d09** — verifikasi-akhir 4.5: teks B tidak diubah, jawaban tetap dapat disimpulkan (diperbaiki sebagian)
- **B01-d05** — laporan-mutu: sebagian bisa dijawab dari pengetahuan adat (diagnostik, bukan butir rapor)

Di luar butir: bantahan guru SD untuk M02 (`bantahan-M02-guru-sd.md`) — perubahan **waktu** kelas masih menunggu kelas uji coba. Ini menyangkut tabel menit pengajar, bukan isi soal, jadi tidak memengaruhi paket.

## 6. Kode penyebab salah pada pengecoh

2739 alasan pengecoh terbaca. Kode **ditebak mesin** dari kata kunci alasan (belum diperiksa guru; rancangan meminta sampel 20% diperiksa guru): B (baca) 400 · H (hitung) 23 · S (salah paham) 1068 · tanpa kode 1248.

## 7. Keputusan impor

- **Id tetap:** `M02-k07` Soal 7 halaman 5 (● dan ○ memakai awalan sama supaya id tidak berubah kalau lambang diganti) · `M02-kz1` Kuis · `M02-tb1` Terbimbing · `M02-tk1` Tiket · `M01-d05` Diagnostik · `S1-05` Butir simulasi · `T05-q2` Pertanyaan teks.
- **Topik butir** diambil dari baris `Kelompok` (topik yang benar-benar diuji, mis. soal "minggu lalu (M01)" di modul M02 bertopik M01; prasyarat `PR-M2` tetap `PR-M2`). Kuis memakai kalimat "Kuis 1–2 dari M01…". Pertanyaan 2 teks memakai kolom "Pertanyaan 2 melatih"; Pertanyaan 1 bertopik kode teksnya.
- **Latihan rumah** = id soal ○ halaman 5, kecuali M01, B01, dan pertemuan simulasi (sama dengan lembar kerja anak bagian D).
- **Petunjuk** berisi satu tahap (baris Petunjuk bahan); baris Langkah menjadi `pembahasan`. Bahan tidak memuat tahap ketiga, jadi tidak dikarang.
- **Stimulus bersama simulasi** disalin ke setiap butirnya (`grupStimulus` menandai butir yang berbagi teks), supaya butir bisa dipakai sendiri.
- Kuis, terbimbing, tiket, dan diagnostik ikut diimpor (terpisah dari soal halaman 5); rancangan menyatakan tiket tetap di kertas, jadi aplikasi boleh tidak menampilkannya.

