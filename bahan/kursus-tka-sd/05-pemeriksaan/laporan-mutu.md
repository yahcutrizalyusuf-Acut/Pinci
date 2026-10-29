# Laporan Mutu — Paket Siap TKA SD

Tanggal: 17 September 2026 · Cakupan: 36 modul, 5 paket simulasi, 36 teks baca cepat, 7 berkas petunjuk.

**Cara pemeriksaan.** Empat agen pemeriksa terpisah hanya membaca dan melapor. Mereka tidak menulis modul yang diperiksanya. Setiap kunci Matematika dihitung ulang dengan skrip Python milik pemeriksa sendiri, tanpa memakai baris `Periksa` penulis soal. Setiap kunci Bahasa Indonesia ditentukan dari teks sebelum kunci dibaca. Temuan diperbaiki koordinator dan agen perbaikan, **bukan** oleh agen pemeriksanya. Satu agen verifikasi akhir lalu memeriksa ulang setiap soal yang berubah, dan sisa temuannya diperbaiki koordinator.

| Laporan rinci | Isi |
|---|---|
| `temuan-matematika-1.md` | M01–M13 |
| `temuan-matematika-2.md` | M15–M24, S4 |
| `temuan-simulasi-matematika.md` | M08, M14, M20, S1–S3 |
| `temuan-bahasa-indonesia-1.md` | B01–B06, T01–T18 |
| `temuan-bahasa-indonesia-2.md` | B07–B12, S5, T19–T36 |
| `verifikasi-akhir.md` | Soal yang berubah selama perbaikan + tindak lanjut |
| `verifikasi/*.py` | Skrip hitung ulang independen |

---

## Tabel 17 butir

| Butir | Lolos/Tidak | Berkas bermasalah (saat diperiksa) | Yang diperbaiki |
|---|---|---|---|
| 1 Struktur 7 halaman | **Lolos** | — | — |
| 2 Alur menit | **Lolos** (setelah perbaikan) | M08, M14, M20, B12 (menit 5–7 terlalu padat; rujukan menit tidak cocok) | Menit 5–7 simulasi = satu kalimat petunjuk + contoh jadi ringkas; petunjuk ujian tercetak di naskah; rujukan menit B12/S5 dibetulkan. Total 45/100 menit di 36 modul |
| 3 Komposisi 12 soal | **Lolos** | — | Klaim sebaran kunci B01–B06 dihitung ulang |
| 4 Kunci jawaban | **Lolos** | — | Semua soal berkunci lengkap (Kunci, Petunjuk, Langkah, alasan pengecoh) |
| 5 Kesesuaian peta spiral | **Lolos** (setelah perbaikan) | M09, M10, M12, M13, B01, B02, S2, S3, M14, B07–B11 | Soal kembar di slot uji tunda diganti; soal yang isinya tidak sesuai label diganti; butir simulasi yang menguji materi belum diajarkan (luas layang-layang, dm², pembulatan desimal) diganti |
| 6 Keterulangan topik | **Lolos dengan pengecualian tercatat** | M18, M19, M21, M22, B09, B10, B11 | Tidak dapat diperbaiki tanpa menambah pertemuan (Keputusan K6). Uji tunda diambil dari simulasi akhir. **M22 dan B11 hanya muncul kembali 2–3 kali** |
| 7 Bentuk soal | **Lolos** | — | Nol isian, uraian, menjodohkan |
| 8 Cakupan domain | **Lolos** | — | Nol Peluang, nol Aljabar, nol materi menulis |
| 9 Keseragaman istilah | **Lolos** (setelah perbaikan) | M03, M05, M06, M09–M13, M15–M24, S4, M14, B02–B12, S5 | "atas/bawah" → pembilang/penyebut; "pojok" → sudut; "isi" → volume; "menebak" → menyimpulkan; "Benar-Salah" sebagai nama bentuk → PG kategori; "keterangan" → kunci piktogram; "baris" puisi → larik; "bagan" untuk tabel → tabel. `03-standar-istilah.md` diperbarui: "dibalik" diizinkan; baris baru "ikhtisar", "bagan", "tabel" |
| 10 Tiga salah paham | **Lolos** | — | — |
| 11 Contoh jadi polos | **Lolos** | — | Contoh jadi M20 yang membocorkan butir ujian diganti |
| 12 Baca cepat | **Lolos** | — | 36 teks, 150–188 kata, kalimat 3–7 kata, 24 teks hari Matematika memuat angka. T11 Pertanyaan 2 diperjelas |
| 13 Tiket keluar | **Lolos** | — | 3 soal + ambang di 36 modul |
| 14 Laporan orang tua | **Lolos** | — | Kalimat "cara membantu tanpa mengambil alih" ada di 36 modul |
| 15 Larangan | **Lolos** | — | Nol peringkat, hadiah, gaya belajar, janji angka, trik hitung bermerek. Pengecoh "paling pintar di kelas" diganti |
| 16 Kebenaran matematika | **Lolos** | Kunci: tidak ada. Kejelasan: M02, M06, M11, M12, M13 (ambigu), M13 (gambar garis bilangan), M21–M23, S4 (diagram yang bisa dijawab benar dengan salah baca), S1, S2 (ambigu) | **0 kunci salah** dari ±620 soal dan butir Matematika yang dihitung ulang (264 + 215 + 141). Semua soal ambigu diperjelas; gambar garis bilangan dibetulkan; angka diagram diubah supaya salah paham terlihat. Hasil akhir `periksa.py`: **688 ekspresi Periksa benar, 0 salah** di modul, dan **220 benar, 0 salah** di paket simulasi |
| 17 Bahasa | **Lolos** (setelah perbaikan) | M01, M02, M10, M14, B01, B03, B06, B10, S5 | Kalimat > 12 kata dipendekkan; soal ● Matematika maks 2 kalimat; 31 kalimat teks S5 dipecah |
| Tambahan: ketepatan kunci BI | **Lolos** (setelah perbaikan) | B04 Soal 9, T11 (ambigu); 13 soal arti kata (kunci selalu pilihan terpanjang); S5 Butir 7, 9, 19; B11 Terbimbing 2 & Soal 8; B12 Tiket 1 | **0 kunci salah** dari ±372 soal BI. Semua soal ambigu diperbaiki; panjang pengecoh soal arti kata disamakan; soal yang saling membuka jawaban dipisah |
| Tambahan: latihan campur-aduk | **Lolos** (setelah perbaikan) | M02–M22, B07–B11 | Kalimat pengajar saat membagikan soal ● menyebut topik soal, sehingga efek campur-aduk hilang. Dinetralkan di semua modul |

---

## Yang sengaja tidak diperbaiki (ringan)

| Temuan | Alasan |
|---|---|
| S3 Butir 24, S5 Butir 22 & 24, B11 Tiket 1, B03 Soal 2, B04 Kuis 4, B06 Soal 11 — urutan/panjang pilihan belum ideal | Perbaikannya mengubah huruf kunci, kunci ringkas, ucapan kunci pengajar, dan klaim sebaran. Risiko inkonsistensi baru lebih besar daripada manfaatnya. Kunci semuanya benar dan tidak ambigu |
| S3 Butir 22–23 berbagi satu stimulus dan saling memberi petunjuk | Wajar untuk soal bergrup TKA |
| B01 Diagnostik 5 sebagian bisa dijawab dari adat | Diagnostik, bukan butir rapor |
| Tingkat kesulitan S1 paling ringan | Disengaja untuk simulasi pertama; dua butir dijadikan dua langkah |

---

## Satu hal yang tidak dapat diverifikasi siapa pun di sini

Tingkat kesulitan dan proporsi bentuk soal **dibandingkan TKA sungguhan**. Paket disusun dari reproduksi pihak ketiga atas kerangka asesmen. Proporsi PG 18 / PG kompleks 6 / PG kategori 6 dan proporsi domain di S4 berstatus **[ASUMSI]**. Pembandingnya adalah simulasi resmi "Ayo Coba TKA".
