# Temuan Pemeriksaan Mutu — Bahasa Indonesia 2 (B07–B12, S5, T19–T36)

Diperiksa: 17 September 2026 · Pemeriksa: agen mutu (guru BI SD + perancang asesmen membaca) · **Tidak ada berkas modul/teks/paket yang diubah.**

Dasar: `01-spesifikasi-program.md` (termasuk Bagian 6–8), `02-peta-spiral.md` (termasuk Bagian 6 S5), `03-standar-istilah.md`, `04-standar-soal.md`; `05` sekilas.

Alat yang dijalankan:
- `python _alat/periksa.py 02-modul-bahasa-indonesia/B07…B12` → 122 soal; Periksa benar 33, SALAH 0, galat 0, format 0, tanpa baris 0. Tidak ada laporan struktur/alur/komposisi/tiket/kata terlarang.
- `python _alat/periksa.py --simulasi 02-modul-bahasa-indonesia/simulasi` → S5: 30 butir, bentuk 18/6/6, bobot topik cocok peta, Periksa SALAH 0.
- `python _alat/periksa.py --teks 03-bank-teks-baca-cepat` → T19–T36: 150–173 kata, 2 pertanyaan per teks, semua kalimat 3–7 kata, Periksa SALAH 0.
- `05-pemeriksaan/pemeriksaBI2-hitung.py` → jumlah kata/panjang kalimat tiap teks S5 (tidak diperiksa `periksa.py`), cocok-tidaknya kolom "Jumlah kata" T19–T36, dan **32 hitungan data diulang dengan Python** (31 cocok, 1 tidak — lihat L-3).
- `05-pemeriksaan/pemeriksaBI2-soal.py` → panjang bacaan soal ● dan kalimat soal > 12 kata.

Semua jawaban soal (termasuk contoh jadi) ditentukan ulang **dari teks saja** sebelum dibandingkan dengan kunci.

---

## 1. Tabel ringkas

| Butir | Lolos/Tidak | Berkas bermasalah | Rincian |
|---|---|---|---|
| 1 Struktur 7 halaman | Lolos | — | B07–B12 lengkap Hal. 1–7 dengan judul baku |
| 2 Alur tepat 45 menit (B12 = 100) | Lolos (catatan) | B12 | B07–B11 tepat 45. B12: 0–5–7–82–85–88–95–99–100 = 100. Catatan: menit 5–7 memuat petunjuk ujian + contoh jadi ringkas + Terbimbing 1 (padat, L-12) |
| 3 Hal. 5: 12 soal 5/4/3 teracak | Lolos (catatan) | B07–B12 | Semua 8 ● + 4 ○, no. 1 bukan "hari ini", ● tersebar, huruf kunci PG ≤ 4. B12 blok terbaru/sebelumnya/terlama 5/4/3 benar. Catatan: 34 soal ● berbacaan 3–5 kalimat (standar ● maks. 2 kalimat), L-11 |
| 4 Setiap soal punya kunci | Lolos | — | 122 soal modul + 30 butir S5 + 36 pertanyaan teks + 12 contoh jadi; semua berkunci, Petunjuk, Langkah, alasan pengecoh |
| 5 Kesesuaian peta spiral + isi sesuai label | **Tidak (ringan)** | B09, B07, B10, S5, T32 | Kuis, minggu lalu, bulan lalu, uji tunda, dan kolom "Pertanyaan 2 melatih" P19–P36 cocok semua. Tetapi 5 soal/pernyataan isinya melatih topik lain (L-8) |
| 7 Nol isian/uraian/menjodohkan | Lolos | — | Hanya PG, PG kompleks, PG kategori |
| 8 Nol materi menulis | Lolos | — | Tidak ada tugas menulis. B11 dan S5 teks D: puisi hanya dibaca |
| 9 Istilah persis standar | **Tidak** | B07, B09, B10, B11, B12, S5 | "menebak" untuk menyimpulkan (B07 b.681); "baris" untuk larik (B11, 6 baris); "keterangan" untuk kunci piktogram (B09–B12, S5); "sesuai" dipakai sebagai kata soal, bukan penjelasan; "alamat" sebagai sinonim kalimat dasar jawaban (L-1, L-2). "stimulus" hanya di judul berkas pengajar S5, dengan catatan dicetak "Teks A…" → lolos |
| 10 Tiga salah paham di hal. 1 dibongkar di hal. 4 | Lolos | — | Keenam modul: tiga tabel pembongkaran + soal pemeriksa |
| 11 Contoh jadi polos | Lolos (catatan) | B09 | Tidak ada perintah menjelaskan di Hal. 3. Catatan: teks Contoh jadi 1 B09 bertentangan dengan gambarnya (L-3) |
| 13 Tiket 3 soal + ambang | Lolos (catatan) | B12 | Semua modul. Catatan: Tiket 1 B12 ambigu (K-2); Tiket 3 B12 disebut kembaran butir 8 padahal lebih cocok butir 7/9 (L-10) |
| 14 Kalimat membantu tanpa mengambil alih | Lolos (catatan) | B07 | Isinya tepat di semua modul; B07 memakai kata "menebak" (L-1) |
| 15 Nol peringkat/umumkan skor/hadiah/gaya belajar/janji angka | Lolos | — | Hal. 7 tanpa peringkat; B12 menyampaikan skor per anak, melarang mengumumkan skor dan janji nilai |
| 17 Bahasa anak 11 tahun | Lolos (catatan) | S5 | Soal modul pendek dan jelas. S5: 34 kalimat teks 8–9 kata (L-6); butir 9 dan 20 berkalimat 13 kata |
| Puisi tidak dijelaskan baris per baris; puisi tulisan sendiri | Lolos | — | B11 memakai "baca utuh + lingkari kata". Tidak ada puisi yang tampak kutipan puisi terkenal (B11 ×12 puisi, S5 "Dapur Nenek", T36) |
| **S5** 30 butir · bobot · bentuk · teks · kunci ringkas · uji tunda | **Tidak (sebagian)** | S5 | 30 butir ✓; bobot B02 4 · B03 4 · B04 3 · B05 3 · B06 2 · B07 2 · B08 3 · B09 4 · B10 3 · B11 2 = persis peta ✓; 18/6/6 ✓; 7 teks 153–162 kata ✓ (puisi D, infografik C, fakta-opini B ✓); 3–5 butir per teks ✓; kunci ringkas = kunci tiap butir 30/30 ✓; pemetaan uji tunda cocok peta dan B12 Hal. 7 ✓. **Tidak:** butir 19 ambigu (K-1), 34 kalimat teks > 7 kata (L-6), butir 7 dan 9 menguji kalimat yang sama (L-7) |
| **Teks T19–T36** | Lolos (catatan) | T32 | 18 teks 150–173 kata (kolom "Jumlah kata" cocok semua); semua kalimat 3–7 kata; 12 teks hari Matematika memuat angka/data; 2 pertanyaan; pertanyaan 2 melatih kode yang tepat (B06 ×3, B07 ×3, B08 ×3, B09 ×3, B10 ×3, B11 ×3). Catatan: T32 pertanyaan 1 bukan tersurat murni (L-8) |
| **Ketepatan kunci** | **Tidak** | S5, B12, B09, B11, B08, B10 | **0 kunci salah · 11 ambigu (2 serius, 3 sedang, 6 ringan)** + 1 pola soal ungkapan yang bisa dijawab dari ingatan (K-12) |

---

## 2. Temuan rinci — KETEPATAN KUNCI (paling penting)

### K-1 · SERIUS · Ambigu — S5 Butir 19 (PG, B03)

- **Berkas/baris:** `simulasi/S5-bahasa-indonesia-akhir.md` b.397 (teks E paragraf 2), b.405–425.
- **Kutipan:** "Sisa sayur itu dipotong kecil-kecil. … Setelah dipotong, sampah dan tanah disusun berselang-seling di ember. Sebelum itu, dasar ember sudah diberi lapisan tanah."
- **Masalah:** teks hanya memastikan (2) memotong → (1) menyusun dan (3) lapisan dasar → (1) menyusun. Urutan (2) dan (3) **tidak ditentukan** teks. Kunci C (2),(3),(1),(4) dan pengecoh D (3),(2),(1),(4) **sama-sama sesuai teks**. Alasan pengecoh D ("tidak membaca kata 'Pertama'") keliru: "Pertama" menunjuk kegiatan mengumpulkan sayur, bukan memotong. Butir ini masuk skor simulasi (tanpa nilai sebagian).
- **Usulan perbaikan:** ganti pilihan D menjadi **"(3), (1), (2), (4)"** (bertentangan dengan "Setelah dipotong", tetap menangkap salah paham "menyiapkan ember paling awal"). Alasan pengecoh D: "ember disiapkan paling awal lalu langsung disusun; kata 'Setelah dipotong' dilewati". Kunci tetap C.

### K-2 · SERIUS · Ambigu — B12 Tiket 1 (PG, kembaran butir 19)

- **Berkas/baris:** `B12-…md` b.597–616.
- **Kutipan:** "Ia memotong semangka dan melon. Setelah dipotong, buah dimasukkan ke mangkuk. Sebelum itu, mangkuk sudah diisi es batu."
- **Masalah:** pola sama dengan K-1. Kunci D (2),(3),(1),(4) dan pengecoh C (3),(2),(1),(4) sama-sama sesuai teks. Tiket ini menentukan warna tiket keluar dan tindakan tambal.
- **Usulan perbaikan:** ganti pilihan C menjadi **"(3), (1), (2), (4)"**; alasan pengecoh C: "mangkuk disiapkan paling awal, kata 'Setelah dipotong' dilewati". Kunci tetap D.

### K-3 · SEDANG · Ambigu — B09 Soal 11 ● (PG, B09)

- **Berkas/baris:** `B09-…md` b.630 (bacaan), b.634 (tabel), b.645–649 (kunci B).
- **Kutipan:** "Setiap Senin sore, Intan mengaji di meunasah." Tabel: Tari Saman Senin 15.00–16.00.
- **Masalah:** jam mengaji tidak ditulis. "Sore" bisa pukul 16.30 atau 17.00, sehingga latihan Senin 15.00–16.00 tidak pasti bertabrakan. Anak yang teliti bisa membela A (Senin pukul 15.00).
- **Usulan perbaikan:** ubah kalimat kedua menjadi **"Setiap Senin pukul 15.00, Intan mengaji di meunasah."** Kunci tetap B.

### K-4 · SEDANG · Ambigu — B11 Terbimbing 2 (PG kompleks), pilihan A vs C

- **Berkas/baris:** `B11-…md` b.291–310.
- **Masalah:** A "senyumnya selalu hangat" dan C "Tangannya kasar, langkahnya cepat" **sama-sama gambaran tentang Ibu** yang diamati "aku". Kalau A dianggap rasa sayang "aku", C juga bisa dibela: "aku" memperhatikan tangan kasar Ibu lalu "ingin memikul keranjang itu". Kunci A, B bergantung pada tafsir. Karena ini soal yang dimodelkan berpasangan, anak belajar kriteria yang kabur.
- **Usulan perbaikan:** ubah larik 3 puisi dan pilihan C menjadi **"Keranjangnya penuh, langkahnya cepat"** (gambaran kegiatan murni). Kunci tetap A, B; alasan pengecoh C disesuaikan ("gambaran kegiatan Ibu dikira perasaan 'aku'").

### K-5 · SEDANG · Pernyataan bergantung — B11 Soal 4 ● (PG kategori), pernyataan 3

- **Berkas/baris:** `B11-…md` b.489–496.
- **Kutipan:** "3. Perasaan itu terlihat dari kata 'pelan-pelan'."
- **Masalah:** "Perasaan itu" merujuk pernyataan 1. Anak yang menjawab pernyataan 1 Salah tidak punya acuan untuk pernyataan 3 (melanggar "setiap pernyataan menguji satu hal"). Selain itu, dasar yang paling kuat adalah "tak ingin kotor/lecet", bukan "pelan-pelan", sehingga anak yang teliti bisa ragu menandai Benar.
- **Usulan perbaikan:** **"3. Kata 'tak ingin lecet' menunjukkan 'aku' menjaga sepatunya."** Kunci tetap 1-B, 2-S, 3-B.

### K-6 s.d. K-11 · RINGAN · Ambigu

| No | Berkas · soal · baris | Masalah | Usulan perbaikan |
|---|---|---|---|
| K-6 | B08 Soal 12 ○ · b.579 | "4. Intan berubah karena ayahnya pindah kerja." — tidak jelas perubahan yang mana. Pindah kerja memang menyebabkan Intan berubah menjadi pendiam di minggu pertama | **"4. Intan menjadi ceria karena ayahnya pindah kerja."** Kunci tetap S |
| K-7 | B10 Soal 9 ○ · b.535, 546 | "Kenaikan pada bulan Juni kemungkinan berhubungan dengan kulkas baru." Teks menulis kulkas lama diberikan ke nenek, jadi kulkas hanya **diganti**. Anak yang bernalar bisa menandai Salah | Ganti kalimat teks menjadi **"Pada bulan Juni, mereka membeli kulkas kedua. Kulkas lama tetap dipakai di dapur."** Kunci tetap B |
| K-8 | B08 Soal 8 ● · b.502 | A "Kelas kami punya dua jendela **besar**." "Besar" bisa dibela sebagai penilaian, sehingga A dan B sama-sama berkata menilai | **"A. Kelas kami punya dua jendela."** Alasan pengecoh A disesuaikan |
| K-9 | B11 Tiket 1 · b.719 | Puisi "Kucing Hilang": perasaan khawatir/takut kehilangan juga masuk akal, jadi C "takut" bisa dibela di samping D "sedih" | Ganti C menjadi **"bangga"** |
| K-10 | S5 Butir 29 · b.598 vs b.600 | Pernyataan 2 memakai alasan **simpulan** ("karena pohon itu hasil kerja mereka" → B), sedangkan pernyataan 4 menuntut alasan yang **disebut teks** (→ S). Dua patokan dalam satu butir; anak bisa menandai 2 Salah karena "karena …" tidak tertulis | **"2. Murid kelas 6 ingin kembali melihat pohon yang mereka tanam."** Kunci tetap B |
| K-11 | B11 Contoh jadi 2 · b.270, 280 | "Berubah dari gugup menjadi **bangga**": larik "aku sudah berani berlari" lebih tepat "lega/percaya diri"; bangga masih bisa diperdebatkan di contoh yang dimodelkan | **"3. Perasaan dalam puisi berubah dari gugup menjadi percaya diri."** Ucapan langkah 6 disesuaikan |

### K-12 · POLA · Soal ungkapan bisa dijawab dari ingatan (butir e)

- **Berkas:** B07 Soal 2, 8, 11, Tiket 1; B08 Kuis 1, Soal 1, 9; B09 Kuis 3, Soal 7, 12; B11 Kuis 4, Soal 3, 10; B12 Soal 7; S5 Butir 4; T22 P2; T24 P2.
- **Masalah:** semua kunci = arti kamus yang lazim ("buah tangan", "kutu buku", "kambing hitam", "gulung tikar", "banting tulang", "buah hati", …). Anak yang hafal arti ungkapan bisa menjawab **tanpa membaca teks**. Salah paham 2 B07 ("arti dari ingatan, bukan dari konteks") hanya dibongkar di Hal. 4 ("angkat tangan") dan **tidak pernah diuji** di latihan, tiket, atau S5. Selain itu, B07 Soal 11 memakai kalimat yang **sama persis** dengan soal pemeriksa Hal. 4 (b.322), dan B11 Soal 8 memakai "perutku terasa diikat tali" yang sudah diberi arti di Hal. 4 (b.352).
- **Usulan perbaikan:** (1) jadikan satu soal "hari ini" B07 dan S5 Butir 4 soal yang konteksnya **menolak** arti hafalan, mis. *"Bu guru bertanya siapa yang sudah selesai. Rafli angkat tangan. Ia maju mengumpulkan kertasnya."* — "Apa arti 'angkat tangan'?" A. menyerah · B. mengangkat tangan sungguhan · …, kunci B; (2) ganti ungkapan B07 Soal 11 dengan ungkapan yang tidak dipakai di Hal. 4, mis. *"Bang Iqbal adalah **tulang punggung** bengkel Pak Hasan."* (pilihan dan Langkah disesuaikan); (3) ganti frasa B11 Soal 8 menjadi "perutku terasa **melilit**".

---

## 3. Temuan rinci — lainnya

### L-1 · Istilah — "menebak", "baris", "alamat"

| Berkas · baris | Kutipan | Masalah | Usulan |
|---|---|---|---|
| B07 · b.681 (Hal. 7) | "biarkan [nama] **menebak** artinya sendiri dari kalimat itu" | "menebak" dilarang sebagai pengganti "menyimpulkan" | "biarkan [nama] **menemukan** artinya sendiri dari kalimat itu" |
| B11 · b.24, 40, 185, 317, 360 | "Puisi (tidak) dijelaskan **baris** per baris" | "baris" dilarang untuk larik; b.25 berkas yang sama bahkan menulis "jangan disebut 'baris'" | "**larik** demi larik" |
| B11 · b.805 (Hal. 7, untuk orang tua) | "menjelaskan artinya baris demi baris" | sama | "larik demi larik (satu per satu)" |
| B09 · b.169; B10 · b.187, 302–310 | "dua **alamat**", "kartu alamat", "punya alamat" | Sinonim baru untuk **kalimat dasar jawaban** yang diucapkan ke anak; standar melarang sinonim (bukti, kalimat kunci) | Pertahankan kegiatannya, tetapi kalimat pengajar memakai "kalimat dasar jawaban"; mis. "kartu kalimat dasar", "setiap pilihan harus punya kalimat dasar jawaban" |

### L-2 · Istilah — "keterangan" dan "sesuai" di lembar anak

- **"Keterangan: ■ = … "** dipakai di B09 (Contoh jadi 2, Soal 6, 8, Tiket 1, 3), B10 Kuis 1 (b.108), B11 Soal 12 (b.668), B12 Tiket 2 (b.629), S5 teks C (b.239) dan Butir 14 pilihan D (b.299). `03-standar-istilah.md` Bagian 5: **kunci piktogram**, jangan dipakai "keterangan". Pola ini juga ada di M21, jadi ini keputusan tingkat program. **Usulan:** koordinator memutuskan satu: (a) ganti semua menjadi "Kunci piktogram: ■ = …", atau (b) tambahkan "keterangan (gambar data di teks BI)" sebagai istilah yang diizinkan di `03`. Jangan dibiarkan dua istilah.
- **"sesuai"** dipakai sebagai kata soal, bukan penjelasan: B10 b.223, 265, 412, 485, 518, 634, 650; B11 b.106, 422, 537; B12 b.539; S5 b.428 (Butir 20). Di soal lain B10/S5 dipakai "relevan" (B10 b.201, 452, 579; S5 b.309, 531). Satu topik memakai dua kata soal. **Usulan:** kata soal baku "**paling relevan**" / "**relevan dengan isi teks**"; "sesuai" hanya di Langkah atau ucapan penjelasan. S5 Butir 20 cukup: "pilih **semua** pernyataan yang **benar** tentang urutan waktu di teks."

### L-3 · Contoh jadi berisi teks yang bertentangan dengan gambar — B09 Contoh jadi 1

- **Berkas/baris:** `B09-…md` b.181 (kalimat 3), b.187 (batang), b.203 dan 205 (ucapan).
- **Kutipan:** "(3) Sebagian besar diantar orang tua." Gambar: Diantar motor 14 dari 32 murid.
- **Masalah:** 14 dari 32 = 43,75% — **bukan sebagian besar** (dihitung ulang dengan Python). Langkah 4 pengajar malah berkata "Cocok dengan tulisan". Modul yang mengajarkan "cek: tulisan & gambar cocok?" memodelkan tulisan yang tidak cocok.
- **Usulan:** kalimat 3 menjadi **"Paling banyak diantar orang tua."** (4 kata). Hitungan lain tidak berubah.

### L-4 · B12 Soal 2 ● — nama kapal bertabrakan dengan huruf pilihan

- **Berkas/baris:** `B12-…md` b.357–377.
- **Masalah:** pilihan "B. Kapal C" dan "C. Kapal B". Anak yang tahu jawabannya "Kapal B" mudah menulis huruf **B** (kesalahan S yang dibuat soal, bukan anak). Alasan pengecoh B ("baris terakhir yang dibaca") juga keliru: baris terakhir tabel adalah Kapal D. Syarat "paling pagi" tidak berperan karena hanya satu kapal memenuhi syarat tiba.
- **Usulan:** beri kapal nama, mis. **KM Seulawah, KM Weh, KM Rondo, KM Sabang**, dan buat dua kapal tiba sebelum 10.00 (mis. KM Rondo 06.30 → 09.50) supaya syarat "paling pagi" benar-benar dipakai. Perbaiki alasan pengecoh.

### L-5 · B12 Soal 12 ○ — pernyataan membuka jawabannya

- **Berkas/baris:** `B12-…md` b.565. "4. **Pendapat** Pak Hasan tentang kopi itu berisi fakta karena ia pelanggan setia."
- **Masalah:** kata "pendapat" sudah menyatakan opini; tanpa memeriksa isi kalimat pun anak tahu jawabannya Salah.
- **Usulan:** "4. **Kalimat** Pak Hasan tentang kopi itu berisi fakta karena ia pelanggan setia."

### L-6 · S5 — kalimat teks lebih dari 7 kata

- **Berkas:** `S5-…md` teks A–G. Hitungan skrip (cara hitung sama dengan `periksa.py`): A 1, B 6, C 3, D 2, E 5, F 4, **G 10** kalimat berpanjang 8–9 kata (±34 dari ±190 kalimat). Jumlah kata tiap teks 153–162 ✓.
- **Contoh:** G "Semua murid kelas 4 sampai kelas 6 ikut serta." (9) · "Bibit mangga, jambu, dan ketapang disumbang orang tua murid." (9) · E "Kelas 6 SD Lampineung membuat kompos dari sampah dapur." (9) · B "Timphan sebaiknya dikenalkan lebih luas kepada anak muda." (8).
- **Masalah:** spesifikasi Bagian 2 dan standar soal: kalimat 3–7 kata. T19–T36 patuh semua; paket simulasi tidak.
- **Usulan:** pecah atau pangkas, mis. "Murid kelas 4–6 ikut serta." · "Bibitnya mangga, jambu, dan ketapang. Orang tua murid menyumbangnya." · "Kelas 6 SD Lampineung membuat kompos." Tambahkan pemeriksaan panjang kalimat teks ke `periksa.py --simulasi` (skrip `pemeriksaBI2-hitung.py` bisa dipakai sebagai contoh).

### L-7 · S5 — uji tunda B08 memakai kalimat yang sama dua kali

- **Berkas/baris:** Butir 7 pilihan B (b.163) dan Butir 9 (b.192) sama-sama menguji "Kata Nek Salamah, timphan srikaya paling lezat."
- **Masalah:** skor uji tunda B08 diambil dari butir 7, 8, 9. Dua dari tiga butir bergantung pada satu kalimat, sehingga satu salah paham ("pendapat ahli") bisa menjatuhkan dua butir sekaligus.
- **Usulan:** ganti pilihan B Butir 7 menjadi **"Kini timphan juga dijual di toko oleh-oleh."** (fakta) → **kunci Butir 7 menjadi A, B, C**. Perbarui kunci ringkas (b.682) dan Langkah.

### L-8 · Isi soal tidak melatih topik labelnya

| Berkas · soal · baris | Label | Yang sebenarnya dilatih | Usulan |
|---|---|---|---|
| B09 Soal 5 ● · b.493–508 | B05 (bulan lalu = uji tunda B05) | Urutan peristiwa "sesudah" = **B03** | Ganti pertanyaan: **"Bagaimana watak Salsabila?"** (A. pelit · B. suka menolong · C. pemalu · D. suka pamer), kunci B; atau "Apa amanat cerita tersebut?" |
| B07 Soal 12 ○ · b.575 | B05 | Pernyataan 1 menguji **latar** (B06) | "1. Tokoh yang mendapat ide adalah Keumala." (B) |
| B10 Contoh jadi 2 · b.246 | B10 (contoh jadi hari ini) | Pernyataan 1 menguji **watak** (B05), tanpa kata relevan | "1. Mengajak regu lain berteduh adalah tindakan yang relevan saat tenda mereka bocor." (B) |
| S5 Butir 20 · b.433 | B03 (urutan waktu) | Pilihan D menguji informasi tersurat "plastik tidak boleh", bukan urutan | "D. Ember ditutup sebelum sampah disusun." (salah) |
| T32 Pertanyaan 1 · b.33–41 | Pertanyaan 1 = tersurat | Membandingkan 5 baris tabel dengan rata-rata (bukan tersurat) | "Berapa tinggi tanaman di polibag E?" (A. 11 cm …), atau terima sebagai catatan karena T32 hari Matematika |

### L-9 · Catatan kecil (tidak mengubah kunci)

| Berkas · baris | Masalah | Usulan |
|---|---|---|
| B07 Soal 8 · b.508 | Petunjuk: "Bagaimana keadaan lantai dan **meja**?" — meja tidak ada di bacaan | "Bagaimana keadaan lantai dan ruangan?" |
| B11 Soal 8 · b.592 | Alasan pengecoh A: "suasana **malam**" — puisi tidak menyebut malam | "ditebak dari kata 'buku' dan 'satu halaman lagi' (salah paham 2)" |
| B11 Terbimbing 2 b.310 · Soal 11 b.652 | "larik pertama dikira paling penting" diberi label **salah paham 1** (padahal salah paham 1 = menjelaskan per larik) | Hapus label atau tulis "tanpa nomor salah paham" |
| B11 Hal. 7 · b.800 | "akan muncul lagi di **latihan** pekan depan" — pekan depan hanya ada simulasi B12 | "akan muncul lagi di simulasi akhir pekan depan" |
| B07 Hal. 7 · b.675 | "diuji ulang sekitar **tiga** minggu lagi" — uji tunda B07 di P33 = 4 minggu kemudian | "sekitar empat minggu lagi" |
| B11 Soal 12 ○ · b.682 | Alasan pengecoh A tidak menghasilkan A (kalau 10 ikut dihitung, jawabannya tiga minuman) | "A — hanya dua baris pertama yang dibaca, lalu berhenti" |
| S5 Butir 18 · b.381 | Pernyataan 1 menggabungkan dua klaim: "hangat **dan** gembira" | "1. Bait pertama menggambarkan suasana gembira." |
| S5 Butir 9 b.192 · Butir 20 b.428 | Kalimat soal 13 kata (> 12) | Butir 9: "Berdasarkan teks B, kalimat berikut termasuk apa?" lalu kutipan di baris sendiri |
| B08 Soal 2 C b.396 · S5 Butir 7 E b.166 | "Semua orang (Aceh) pasti …" — menurut definisi "bisa dibuktikan benar atau salah", klaim "semua orang" secara ketat bisa diuji; diterima sebagai opini karena memuat kata penilaian, tetapi rawan dibela anak kritis | Pastikan tetap ada kata penilaian jelas: "Semua orang Aceh pasti **paling** merindukan timphan" atau ganti "Timphan adalah kue Lebaran paling istimewa." |

### L-10 · B12 — rujukan ke S5

Diperiksa satu per satu dan **cocok**: teks C satu-satunya tempat kode H (butir 11–14); puisi di teks D; PG kompleks 5, 7, 13, 20, 26, 30; PG kategori 3, 8, 12, 18, 23, 29; butir B02 = 1, 10, 22, 30; teks E lima butir; uji tunda B08 7–9 · B09 11–14 · B10 15, 26, 29 · B11 16, 18; butir 13 memang syarat angka + gambar; butir 19 memang "sebelum itu".
**Tidak cocok (ringan):**
- Hal. 6 b.593: Tiket 3 disebut kembaran **butir 8** "fakta dan opini dengan angka dan nama orang". Butir 8 tidak memuat nama orang maupun angka; yang cocok **butir 7/9**. Usulan: tulis "butir 7 dan 9".
- Hal. 1 b.49: "Butir 9–10 benar" pada anak yang tidak membaca teks. Butir 10 membutuhkan teks B. Usulan: "Butir 9 benar".

### L-11 · Catatan pola — bacaan soal ● lebih dari 2 kalimat

`04-standar-soal.md` Bagian 1: soal ● maksimal 2 kalimat sebelum pertanyaan. Di B07–B12, 34 dari 48 soal ● berbacaan 3–5 kalimat (mis. B07 Soal 1, 4, 7, 8; B08 Soal 1, 4, 5, 7, 10; B10 Soal 2, 4, 5, 8). Kalimatnya pendek (3–7 kata, total ±15–30 kata), jadi sasaran ±45 detik kemungkinan masih terpenuhi. Pola yang sama sudah ada di B01–B06 dan tidak dilaporkan di pemeriksaan BI-1. **Usulan:** koordinator memutuskan pengecualian tertulis untuk BI (mis. "soal ● BI: maks. 4 kalimat pendek / 30 kata"), supaya aturan dan isi modul tidak bertentangan.

### L-12 · B12 menit 5–7 terlalu padat

`B12-…md` b.112: dalam 2 menit pengajar membacakan Petunjuk ujian (±90 kata), Contoh jadi 1 versi ringkas (3 langkah), dan Terbimbing 1 dengan papan jawaban. Tim penyusun sudah menandai [PERLU DICEK] di b.128. **Usulan:** pindahkan Terbimbing 1 ke menit 85–88 bersama Terbimbing 2, atau terima geser ±2 menit dari jeda (82–85 menjadi 82–84).

---

## 4. Ringkasan ketepatan kunci

| Berkas | Soal diperiksa | Kunci salah | Ambigu | Rincian ambigu |
|---|---|---|---|---|
| B07 | 21 + 2 contoh jadi | 0 | 0 | — (pola K-12) |
| B08 | 21 + 2 | 0 | 2 ringan | K-6, K-8 |
| B09 | 21 + 2 | 0 | 1 sedang | K-3 (+ teks contoh jadi keliru, L-3) |
| B10 | 21 + 2 | 0 | 1 ringan | K-7 |
| B11 | 21 + 2 | 0 | 2 sedang, 2 ringan | K-4, K-5, K-9, K-11 |
| B12 | 17 + 2 (contoh jadi 1 berisi 3 pertanyaan) | 0 | 1 serius | K-2 |
| S5 | 30 | 0 | 1 serius, 1 ringan | K-1, K-10 |
| T19–T36 | 36 | 0 | 0 | — |
| **Jumlah** | **188 soal berkunci + 12 contoh jadi = 200** | **0** | **11** (2 serius · 3 sedang · 6 ringan) | |

**Yang sudah diperiksa di setiap soal:** jawaban ditentukan ulang dari teks saja; setiap pengecoh diuji apakah bisa dibela benar; PG kompleks diperiksa semua pilihan; PG kategori setiap pernyataan; "Langkah" menunjuk kalimat yang memang ada; soal yang bisa dijawab tanpa teks (pola K-12; soal fakta/opini satu kalimat memang dirancang tanpa teks panjang dan diterima); rujukan "butir …/teks …" di B12 (L-10).

**Hitungan diulang dengan Python (32 hitungan):** B09 (Contoh jadi 1–2, Terbimbing 1–2, Soal 6, 8, Tiket 1–3), B10 Kuis 1, Soal 1, 9; B11 Soal 7, 12; B12 Soal 6, Tiket 2; S5 teks C (total 30, butir 12–13); T19, T22, T25, T28, T29, T31, T32, T34, T35. **Semua angka jawaban benar.** Satu-satunya ketidakcocokan adalah klaim kata "sebagian besar" di B09 Contoh jadi 1 (L-3).

**Pola ambiguitas yang perlu diwaspadai penulis:**
1. Soal urutan dengan "Sebelum itu" yang hanya mengikat satu pasangan kegiatan (K-1, K-2). Periksa bahwa **setiap** pengecoh bertentangan dengan minimal satu kalimat teks.
2. Perasaan puisi: pengecoh yang bertetangga makna (takut–sedih, bangga–lega, gambaran–perasaan) (K-4, K-9, K-11).
3. PG kategori relevansi yang mencampur alasan "tersurat" dan "simpulan" dalam satu butir (K-10).

## 5. Urutan perbaikan yang disarankan

1. **K-1 (S5 Butir 19) dan K-2 (B12 Tiket 1)** — cukup ganti satu pilihan; kunci tidak berubah.
2. **L-7** (S5 Butir 7, kunci berubah menjadi A, B, C — perbarui kunci ringkas) dan **L-3** (B09 Contoh jadi 1).
3. K-3, K-4, K-5, L-4.
4. Keputusan istilah tingkat program: "keterangan" vs "kunci piktogram", "sesuai" vs "relevan", pengecualian panjang soal ● BI (L-2, L-11).
5. L-6 (kalimat S5 > 7 kata), lalu sisanya.

Skrip bantu: `05-pemeriksaan/pemeriksaBI2-hitung.py`, `05-pemeriksaan/pemeriksaBI2-soal.py` (jalankan dari ROOT dengan `PYTHONIOENCODING=utf-8`).

---

## Tindak lanjut perbaikan

Dikerjakan 17 September 2026 oleh agen perbaikan BI-2, berdasarkan keputusan koordinator: istilah baku **kunci piktogram**; soal ● BI boleh berbacaan maks. 5 kalimat (dicek ulang: tidak ada soal ● B07–B12 yang lebih dari 5 kalimat, jadi L-11 tidak perlu pemendekan). Hasil akhir `periksa.py`: B07–B12 SALAH 0 · galat 0 · format 0, tanpa laporan; S5 30 butir, bentuk 18/6/6, bobot cocok, SALAH 0; T19–T36 tanpa laporan.

| Temuan | Diperbaiki (ya/tidak) | Yang diubah |
|---|---|---|
| K-1 S5 Butir 19 | ya | Pilihan D → (3), (1), (2), (4); Langkah memakai dua kalimat pengikat; alasan pengecoh D diganti. Kunci tetap C |
| K-2 B12 Tiket 1 | ya | Pilihan C → (3), (1), (2), (4); Langkah dan alasan pengecoh C disesuaikan. Kunci tetap D |
| K-3 B09 Soal 11 | ya | "Setiap Senin pukul 15.00, Intan mengaji…"; Langkah disesuaikan. Kunci tetap B |
| K-4 B11 Terbimbing 2 | ya | Larik 3 dan pilihan C → "Keranjangnya penuh, langkahnya cepat"; Langkah dan alasan C disesuaikan |
| K-5 B11 Soal 4 | ya | Pernyataan 3 → "Kata 'tak ingin lecet' menunjukkan 'aku' menjaga sepatunya."; Langkah (3) disesuaikan |
| K-6 B08 Soal 12 | ya | Pernyataan 4 → "Intan menjadi ceria karena ayahnya pindah kerja." |
| K-7 B10 Soal 9 | ya | Teks: "membeli kulkas kedua. Kulkas lama tetap dipakai di dapur."; pernyataan 2 dan Langkah disesuaikan |
| K-8 B08 Soal 8 | ya | A → "Kelas kami punya dua jendela."; alasan pengecoh A diganti |
| K-9 B11 Tiket 1 | ya | C "takut" → "bangga"; alasan pengecoh A dan C disesuaikan |
| K-10 S5 Butir 29 | ya | Pernyataan 2 → "Murid kelas 6 ingin kembali melihat pohon yang mereka tanam."; Langkah (2) disesuaikan |
| K-11 B11 Contoh jadi 2 | ya | Pernyataan 3 dan ucapan langkah 6 → "percaya diri"; soal pemeriksa Hal. 4 ("Garis Start") ikut disesuaikan |
| K-12 pola ungkapan | ya | B07 Soal 2 diganti: "panjang tangan" dalam konteks arti sebenarnya (kunci C, pengecoh A = arti hafalan); S5 Butir 4 diganti: "angkat tangan" untuk menyapa (teks A ditambah 2 kalimat, kunci A → C, kunci ringkas dan sebaran huruf diperbarui); B07 Soal 11 → "tulang punggung"; B11 Soal 8 → "perutku terasa melilit". B07 Soal 8, B08–B12 lain, T22, T24 tidak diubah (usulan laporan hanya untuk tiga soal ini) |
| L-1 "menebak" B07 | ya | Hal. 7: "menemukan artinya sendiri" |
| L-1 "baris" B11 | ya | 5× "larik demi larik"; Hal. 7 orang tua: "larik demi larik (satu per satu)" |
| L-1 "alamat" B09, B10 | ya | B09 penutup: "dua dasar jawaban"; B10: "Kartu kalimat dasar", ucapan memakai "kalimat dasar jawaban"; rujukan di B12 Hal. 5 ikut diganti |
| L-2 "keterangan" | ya | Semua makna kunci piktogram → "Kunci piktogram" di B09 (seluruh berkas, kotak aturan papan dirapikan), B10 Kuis 1 + Hal. 2, B11 Soal 12, B12 Tiket 2 + Hal. 6–7, S5 teks C, Butir 11, 12, 14 (pilihan D) |
| L-2 "sesuai" sebagai kata soal | ya | → "relevan" di B10 (8 kalimat soal/pernyataan), B11 Kuis 1 dan Soal 1, B12 Soal 11, T32 P2, T33 P2; "benar tentang" di B11 Soal 6, S5 Butir 5 dan 20 |
| L-3 B09 Contoh jadi 1 | ya | Kalimat 3 → "Paling banyak diantar orang tua."; ucapan langkah 2 disesuaikan (14 dari 32 = paling banyak, dicek Python) |
| L-4 B12 Soal 2 | ya | Kapal diberi nama KM Seulawah/Weh/Sabang/Rondo; dua kapal tiba sebelum 10.00, KM Sabang tepat 10.00; kunci C → B (KM Rondo); Langkah, alasan pengecoh, dua baris Periksa baru. Sebaran huruf Hal. 5 B12: A 2 · B 3 · C 2 · D 2 |
| L-5 B12 Soal 12 | ya | "Pendapat Pak Hasan" → "Kalimat Pak Hasan" |
| L-6 S5 kalimat > 7 kata | ya | 31 kalimat 8–9 kata dipecah/dipangkas (A 1, B 6, C 3, D 2, E 5, F 4, G 10). Jumlah kata: A 171 · B 153 · C 153 · D 152 · E 155 · F 157 · G 152. Sisa kalimat < 3 kata hanya penggalan ucapan ("tanyanya.", "bisiknya.") yang terpisah oleh cara hitung. Butir terkait diperbarui: 7, 8, 19, 20, 22, 23, 24, 28, 29, 30. Pemeriksaan otomatis panjang kalimat di `periksa.py --simulasi` **tidak ditambahkan** (berkas `_alat` di luar izin agen ini) |
| L-7 S5 uji tunda B08 | ya | Butir 7 pilihan B → "Kini timphan juga dijual di toko oleh-oleh."; E → "Timphan adalah kue Lebaran paling istimewa."; kunci A, C → A, B, C; Langkah dan alasan pengecoh; kunci ringkas; catatan di pemetaan uji tunda |
| L-8 B09 Soal 5 | ya | Pertanyaan watak Salsabila (pelit/pemalu/suka pamer/suka menolong), kunci tetap D |
| L-8 B07 Soal 12 | ya | Pernyataan 1 → "Tokoh yang mendapat ide adalah Keumala."; Langkah (1) |
| L-8 B10 Contoh jadi 2 | ya | Pernyataan 1 → tindakan relevan saat tenda bocor; papan dan ucapan langkah 2 |
| L-8 S5 Butir 20 | ya | D → "Ember ditutup sebelum sampah disusun."; Langkah dan alasan D |
| L-8 T32 Pertanyaan 1 | ya | → PG tersurat "Berapa tinggi tanaman di polibag E?" (kunci A, 11 cm); Periksa dan catatan pengajar diperbarui. Jumlah kata teks tidak berubah (157) |
| L-9 B07 Soal 8 | ya | Petunjuk "lantai dan ruangan" |
| L-9 B11 Soal 8 | ya | Alasan pengecoh A tanpa "malam" |
| L-9 B11 Terbimbing 2 dan Soal 11 | ya | Label "salah paham 1" dihapus ("tanpa nomor salah paham") |
| L-9 B11 Hal. 7 | ya | "simulasi akhir pekan depan"; "menebak perasaan" → "menentukan perasaan" |
| L-9 B07 Hal. 7 | ya | "sekitar empat minggu lagi" |
| L-9 B11 Soal 12 | ya | Alasan pengecoh A: "hanya dua baris pertama yang dibaca, lalu berhenti" |
| L-9 S5 Butir 18 | ya | Pernyataan 1: "suasana gembira" |
| L-9 S5 Butir 9 dan 20 (13 kata) | ya | Butir 9: kalimat soal pendek + kutipan di baris sendiri; Butir 20: 10 kata |
| L-9 B08 Soal 2 C · S5 Butir 7 E | ya (S5) / tidak perlu (B08) | S5 E diganti kalimat berpenilaian jelas. B08 Soal 2 C sudah memuat "paling harum", tidak diubah |
| L-10 B12 rujukan S5 | ya | Hal. 6: "butir 7 dan 9"; Hal. 1: "Butir 9 benar" |
| L-11 soal ● > 2 kalimat | ya (keputusan koordinator) | Batas BI 5 kalimat; dicek skrip: nol soal ● B07–B12 di atas 5 kalimat, tidak ada yang dipendekkan |
| L-12 B12 menit 5–7 | ya | Terbimbing 1 dipindah ke menit 84–88 (bersama Contoh jadi 2 dan Terbimbing 2); jeda 82–84; aturan "Kalau terlambat" dan catatan [PERLU DICEK] disesuaikan. Total tetap 100 menit |
