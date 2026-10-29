# Temuan Pemeriksaan Mutu — Bahasa Indonesia 1 (B01–B06, T01–T18)

Diperiksa: 17 September 2026 · Pemeriksa: agen mutu (guru BI SD + perancang asesmen membaca) · **Tidak ada berkas modul/teks yang diubah.**

Dasar: `01-spesifikasi-program.md`, `02-peta-spiral.md`, `03-standar-istilah.md` (Bagian 6–8), `04-standar-soal.md`.

Alat yang dijalankan:
- `python _alat/periksa.py 02-modul-bahasa-indonesia/B0[1-6]*.md` → 136 soal, Periksa benar 4 (kuis Matematika B01), SALAH 0, galat 0, format 0, tanpa baris 0.
- `python _alat/periksa.py --teks 03-bank-teks-baca-cepat` → T01–T18: 151–188 kata, 2 soal per teks, Periksa SALAH 0.
- Skrip bantu (scratchpad) untuk panjang kalimat teks T01–T18 dan panjang kalimat pertanyaan; hitungan data di teks diulang dengan Python (semua cocok).

---

## 1. Tabel ringkas

| Butir | Lolos/Tidak | Berkas bermasalah | Rincian |
|---|---|---|---|
| 1 Struktur 7 halaman | Lolos | — | Keenam modul lengkap Hal. 1–7 dengan judul baku |
| 2 Alur tepat 45 menit | Lolos (catatan) | B01 | B01 alur khusus sesuai spesifikasi; B02–B06 tepat 45 menit. Catatan: aturan tambal B01 Hal. 5 menyebut "±6 menit, sebelum kuis" di B02/B03 → menambah durasi (T-2.1) |
| 3 Hal. 5: 12 soal 5/4/3 teracak | Lolos | — | Semua modul 8 ● + 4 ○, komposisi ●/○ per kelompok benar, no. 1 bukan "hari ini", sebaran kunci PG ≤ 4 per huruf |
| 4 Setiap soal punya kunci | Lolos | — | 136 soal modul + 36 pertanyaan teks, semua berkunci lengkap |
| 5 Kesesuaian peta spiral + isi sesuai label | **Tidak (ringan)** | B01, B02, (B05), (T18) | Kuis/minggu lalu/bulan lalu/pertanyaan 2 sesuai tabel P03–P18. Tetapi 6 soal isinya tidak melatih topik labelnya (T-5.1 s.d. T-5.4) |
| 7 Nol isian/uraian/menjodohkan | Lolos | — | Hanya PG, PG kompleks, PG kategori |
| 8 Nol materi menulis | Lolos | — | Tidak ada surat, pidato, poster, kuitansi, daftar pustaka, melengkapi kalimat |
| 9 Istilah persis standar | **Tidak** | B02, B05, B06, B03 | "menebak" dipakai sebagai pengganti "menyimpulkan" di 6 baris (T-9.1); "ikhtisar", "bagan" belum baku (T-9.2). "stimulus" tidak muncul di bagian yang dibaca anak |
| 10 Tiga salah paham dibongkar | Lolos | — | Ketiga salah paham tiap modul punya tabel pembongkaran + soal pemeriksa di Hal. 4 |
| 11 Contoh jadi polos | Lolos (catatan) | B02 | Tidak ada perintah menjelaskan. Catatan: pemodelan B02 CJ1 langkah 5 salah menunjuk kalimat (T-11.1) |
| 12 Teks T01–T18 | Lolos | — | 151–188 kata; **semua kalimat 3–7 kata**; 12 teks hari Matematika memuat angka/data; 2 pertanyaan (1 tersurat, 1 tersirat) dengan kolom "melatih" cocok peta |
| 13 Tiket 3 soal + ambang | Lolos | — | Semua modul |
| 14 Kalimat membantu tanpa mengambil alih | Lolos (catatan) | B02 | Isinya tidak mengambil alih, tetapi B02 memakai kata "menebak" (lihat T-9.1) |
| 15 Nol peringkat/hadiah/gaya belajar/janji angka | Lolos | — | Hal. 7 tanpa peringkat; tidak ada poin/hadiah/gaya belajar/janji angka |
| 17 Bahasa anak 11 tahun | **Tidak (ringan)** | B01, B03 | 5 kalimat pertanyaan > 12 kata (T-17.1) |
| Kosakata murni tidak dicampur | Lolos (catatan) | B01, B02, B04, B06 | Semua soal kosakata berbasis konteks; 4 soal bisa dijawab tanpa konteks (T-16.5) |
| **16 (membaca) Ketepatan kunci** | **Tidak** | B04, T11, + pola lintas modul | **0 kunci salah · 2 ambigu** (1 serius, 1 ringan) · beberapa soal lemah + pola "kunci = pilihan terpanjang" (T-16.1 s.d. T-16.7) |

---

## 2. Temuan rinci — KETEPATAN KUNCI (paling penting)

### T-16.1 · SERIUS · Ambigu — B04 Soal 9 ○ (PG kategori), pernyataan 1

- **Berkas/baris:** `B04-ide-pokok-dan-gagasan-pendukung.md` baris 529 (teks), 541 (pernyataan), 546 (kunci 1-B).
- **Kutipan teks paragraf 1:** "Warung kopi Bang Rafli selalu ramai. Pagi hari, petani singgah sebelum ke sawah. Siang hari, pedagang pasar beristirahat di sana. Malam hari, bapak-bapak menonton bola bersama. Warung itu menjadi tempat warga bertemu."
- **Masalah:** kalimat pertama ("selalu ramai") **juga** memayungi kalimat 2–4 (petani, pedagang, bapak-bapak datang bergantian = ramai). Paragraf punya dua calon ide pokok. Anak yang memilih kalimat pertama dengan uji payung yang benar akan menandai pernyataan 1 **Salah** dan kehilangan seluruh soal (PG kategori tanpa nilai sebagian). Ini juga bertentangan dengan pesan modul sendiri: "letak tidak dipakai untuk menebak".
- **Usulan perbaikan:** ubah kalimat pertama paragraf 1 menjadi rincian yang bukan payung, mis. **"Warung kopi Bang Rafli ada di dekat Pasar Aceh."** Kunci tetap 1-B.

### T-16.2 · Ringan · Ambigu — T11 Pertanyaan 2

- **Berkas/baris:** `T11-lomba-lari-blang-padang.md` baris 45–55.
- **Masalah:** "Siapa yang paling depan sebelum Aisyah mempercepat lari?" Kunci A (Rizki) hanya benar dengan **asumsi** tidak ada saling salip yang tidak diceritakan. Teks hanya menulis "Rizki dan Keumala pun menyusulnya" tanpa urutan Rizki–Keumala; tidak ada kalimat dasar jawaban yang menyebut Rizki memimpin. Anak yang teliti bisa ragu antara A dan B.
- **Usulan perbaikan:** tambah satu kalimat di paragraf 3, mis. ganti "Rizki dan Keumala pun menyusulnya." menjadi **"Rizki menyusul dan memimpin."** + **"Keumala berlari di belakangnya."** (tetap 3–7 kata; jumlah kata naik 2 → 154). Langkah diganti menunjuk kalimat itu.

### T-16.3 · Lemah — pengecoh atau kunci yang bisa diperdebatkan

| Berkas · soal · baris | Masalah | Usulan |
|---|---|---|
| B06 Soal 11 ● · baris 579–592 | Pengecoh C "karena ia suka menanam bunga" dekat dengan sebab yang tertulis ("Mereka menanam bunga bersama"); Langkah sendiri menyebut sebab = berteman **dan** menanam bunga | Ubah C menjadi **"karena sekolah barunya dekat rumah"** (tidak ada di teks) |
| B06 Soal 12 ○ · baris 602, 610 | Kunci A "Dengarkan nasihat orang tua dan guru" — teks hanya memuat larangan **ustaz**; tidak ada nasihat orang tua | Ubah A menjadi **"Patuhilah larangan guru mengaji."** |
| B03 Tiket 2 · baris 671 | Kunci B "Setiap anggota keluarga merawat tanaman" — "setiap" mengandaikan keluarga hanya tiga orang | Ubah B menjadi **"Keluarga Salsabila bersama-sama merawat kebun."** |
| B04 Kuis 4 · baris 151–163 | Soal strategi tanpa teks: D "warna" juga bisa dibela sebagai kata yang dicari (teks jawaban sering memuat "berwarna") | Ganti pilihan D "warna" menjadi **"sekolah"** (kata umum yang muncul di banyak kalimat); alasan pengecoh D disesuaikan |
| B03 Soal 7 ● · baris 513–523 | Kata paling wajar dicari ("kambing") tidak ada di pilihan, sehingga kunci "ekor" terasa dipaksakan; C "Pak Ridwan" bisa dibela karena pertanyaan memuat nama itu | Ubah pertanyaan menjadi **"Kalimat mana yang menjawab 'Berapa ekor kambing Pak Ridwan?'"** dengan pilihan kalimat ke-1/ke-2/ke-3/ke-4, kunci C (kalimat ke-3) |
| B01 Soal 11 ● · baris 759–772 | "Apa yang dilakukan kakak?" — jawaban harfiah "menjemur" tidak ada; kunci D adalah definisi dan **paling panjang** | Ubah pertanyaan menjadi **"Apa arti kata menjemur pada teks itu?"** dengan pilihan setara panjang: A. mencuci baju · B. melipat baju · C. mengeringkan baju · D. menyetrika baju |

### T-16.4 · Pernyataan PG kategori berisi dua klaim atau klaim yang tidak tertulis (`04-standar-soal` §6)

| Berkas · soal · baris | Kutipan | Usulan |
|---|---|---|
| B02 Tiket 3 · baris 667 | "Kata **jinak** berarti tidak takut dan tidak lari dari manusia." — dua klaim; "tidak takut" tidak ada di teks | **"Kata jinak berarti tidak lari ketika didekati."** |
| B02 Soal 6 ○ · baris 482 | "Kata **lantang** berarti suara yang keras dan jelas." — "jelas" tidak didukung teks | **"Kata lantang berarti suara yang keras."** |
| B05 Soal 9 ○ · baris 544 | "Watak Rizki sombong karena ia duduk sendirian." — watak + alasan | **"Watak Rizki sombong."** (kunci tetap S) |

### T-16.5 · Soal kosakata yang dapat dijawab tanpa membaca konteks (lemah, butir e)

B01 Soal 7 "ramai" (baris 687; pengecoh A "sepi" = lawan kata) · B02 Soal 11 "melimpah" (baris 569) · B04 Kuis 3 "gembira" (baris 137) · B06 Soal 10 "letih" (baris 562; **ini butir uji tunda B02**). Kata-kata ini dikenal anak kelas 6 tanpa kalimat sekitar, sehingga tidak mengukur "arti kata dari konteks".
**Usulan:** ganti kata sasaran dengan kata yang jarang dikenal tetapi jelas dari konteks, mis. B06 Soal 10 **"lunglai"**, B02 Soal 11 **"sarat"** ("Perahunya sarat ikan. Dua keranjang besar penuh ikan tongkol."), B01 Soal 7 **"riuh"**, B04 Kuis 3 **"girang"**. Untuk butir uji tunda (B06 Soal 10) perbaikan ini diprioritaskan.

### T-16.6 · Pola lintas modul — kunci soal arti kata hampir selalu pilihan terpanjang

`04-standar-soal` §2 aturan 5: jawaban benar **tidak boleh selalu** yang paling panjang/rinci. Pada soal arti kata, pengecoh umumnya satu kata, sedangkan kunci dua–empat kata. Anak yang belajar "pilih yang paling panjang" akan benar tanpa membaca.

| Berkas · soal (baris) | Kunci (terpanjang) | Pengecoh |
|---|---|---|
| B01 Soal 3 (616) | A "baru dan belum busuk" | dingin karena es · besar dan berat · murah harganya |
| B01 Soal 7 (689) | D "banyak orang" | sepi · bersih · mahal |
| B01 Soal 11 (763) | D "mengeringkan pakaian di bawah matahari" | mencuci/melipat/menyetrika pakaian |
| B02 CJ2 (233) | D "gelisah dan takut" | marah · lelah · senang |
| B02 Soal 4 (433) | D "diberikan untuk sementara" | dijual · diberikan selamanya · dibuat sendiri |
| B02 Soal 11 (571) | B "sangat banyak" | sedikit · busuk · mahal |
| B03 Kuis 2 (120) | C "banyak dibeli orang" | enak · mahal · sedikit jumlahnya |
| B03 Soal 10 (572) | C "indah dan segar" | besar · mewah · ramai |
| B04 Kuis 3 (139) | B "senang sekali" | marah · lelah · takut |
| B04 Soal 5 (457) | D "ingin sekali bertemu" | marah · lelah · bosan |
| B06 Soal 6 (483) | D "berhati-hati dan bersiap" | panik · sedih · santai |
| B06 Soal 10 (564) | C "lelah sekali" | lapar · senang · kotor |
| T08 Pertanyaan 2 (42) | D "hewan kecil perusak tanaman" | pupuk tanaman · obat semprot · daun yang menguning |

**Usulan:** samakan panjang pengecoh dengan kunci, tetap dari salah paham yang bernama. Contoh B04 Soal 5: A. **marah kepada ayah** · B. **lelah di perjalanan** · C. **bosan di rumah** · D. ingin sekali bertemu. Contoh B06 Soal 6: A. **panik dan berlari** · B. **sedih dan menangis** · C. **santai dan tenang** · D. berhati-hati dan bersiap. Terapkan pola yang sama pada 11 soal lain di tabel.

### T-16.7 · Kebocoran jawaban antar-soal di Hal. 5 yang sama

| Berkas · soal | Masalah | Usulan |
|---|---|---|
| B06 Soal 4 ● ↔ Soal 7 ● (baris 444–455, 497–508) | Soal 7 memuat ulang pilihan Soal 4 hampir kata per kata ("Suasana berubah dari ramai menjadi sunyi" / "dari sunyi menjadi ramai" / "siang menjadi sore"). Dua soal ● melatih hal yang sama dan saling membuka jawaban | Soal 7 memakai teks lain (mis. teks Terbimbing 2 versi baru tentang kebun/rumah) **atau** ganti fokusnya ke **tempat dan waktu saja** tanpa pilihan suasana |
| B03 Soal 2 ● ↔ Soal 4 ● (baris 412–451) | Pilihan Soal 4 (urutan lengkap, kunci diawali "menyapu") membuka jawaban Soal 2 ("paling dulu") | Ubah Soal 2 menjadi **"Apa yang dilakukan Aisyah paling akhir?"** (kunci C sarapan) |
| B04 Soal 2 ● ↔ Soal 4 ● (baris 401–447) | Pilihan C Soal 4 menulis ulang kalimat ide pokok Soal 2 | Ringan; boleh dibiarkan, atau Soal 4 memakai paragraf lain |

### Catatan pemeriksaan data berangka (butir f)

Semua angka di teks dan kunci dihitung ulang dengan Python dan **cocok**: T01 2 × Rp15.000 = Rp30.000 (pengecoh C); T04 40 : 4 = 10, 40 : 2 = 20; T05 200.000 + 180.000 + 215.000 + 155.000 = 750.000 = 75% dari 1.000.000; T07 selisih 8.000; T08 600 : 2 = 300, 600 : 3 = 200, sisa 100; T10 180.000 : 2 = 90.000; T13 200 + 250 < 600; T14 95.000 > 35.000; T16 keliling 2 × (6 + 4) = 20, luas 24; T17 3 × 30° = 90°, 4 × 30° = 120°; B01 Kuis 1–4 (24, 60, FPB 4, KPK 30 → pukul 08.30; 150 menit → 10.30).

### Rujukan "teks di soal nomor …" (butir g)

Semua benar: B01 Soal 4→2, Soal 9→1, Diagnostik 2–5→1, 7–10→6 · B02 Soal 4→2, 11→8 · B03 Soal 4→2 · B04 Soal 4→2 · B05 Soal 7→4 · B06 Soal 7→4. Nomor kalimat yang disebut di "Langkah" dicocokkan dengan teks: semua benar.

> **Perhatian sebaran kunci B03:** kalau usulan T-16.3 (Soal 7 kunci A→C) dan T-16.7 (Soal 2 kunci B→C) diterapkan bersama, huruf C menjadi kunci 5 kali (melanggar batas ≤ 4). Terapkan salah satu, atau ubah urutan pilihan Soal 2 agar "sarapan bersama adik" jatuh di huruf B.

---

## 3. Temuan rinci — butir lain

### T-5 · Isi soal tidak melatih topik yang dilabelkan (butir 5)

Kolom kuis, minggu lalu, bulan lalu, dan pertanyaan 2 baca cepat **cocok** dengan `02-peta-spiral.md` baris P03–P18 (B01: M01×2·M02×2; B02: B01×2·PR-B2·PR-B1; B03: B02×2·B01·PR-B2; B04: B03×2·B02·B01; B05: B04×2·B03·B01; B06: B05×2·B04·B02; T04–T06 B01, T07–T09 B02, T10–T12 B03, T13–T15 B04, T16–T18 B05). Uji tunda B05 (B01) dan B06 (B02) memakai 1 kuis + 2 soal ● sesuai spesifikasi Bagian 8. Masalahnya ada pada **isi** beberapa soal:

| # | Berkas · soal · baris | Label | Isi sebenarnya | Usulan |
|---|---|---|---|---|
| T-5.1 | B02 Soal 5 ○ (446–462) dan Soal 12 ○ (584–599) | minggu lalu (B01) | Informasi tersurat murni (topik **hari ini** B02) — jarak daur ulang B01 hilang | Ubah keduanya ke bentuk strategi B01 seperti Soal 1 dan 9: mis. Soal 12 → **"Kalimat mana yang menjawab 'Apa tugas Iqbal?'"** (kunci kalimat ke-7) |
| T-5.2 | B02 Soal 10 ● (550–565) | bulan lalu (PR-B1, kosakata) | Pertanyaan "Di mana" = PR-B2 | Ganti menjadi arti kata sehari-hari dari kalimat pendek, mis. **"Uangnya dimasukkan ke celengan bambu. Apa arti kata celengan?"** |
| T-5.3 | B01 Soal 2 ● (590–607) dan Soal 10 ● (737–754) | hari ini (B01) | Pertanyaan tersurat "naik apa"/"siapa" = sama dengan PR-B2 (Soal 1, 5, 9, 12). Tidak ada unsur "baca pertanyaan dulu" yang teramati | Ubah ke bentuk strategi seperti Soal 4 dan 6: mis. Soal 10 → **"Untuk menjawab 'Siapa yang memetik cabai?', kata apa yang dicari lebih dulu?"** (A. Keumala · B. memetik · C. cabai · D. halaman; kunci B) |
| T-5.4 | B01 Soal 11 ● (756–772) | bulan lalu (PR-B1) | Menanyakan kegiatan, kunci berupa definisi | Lihat T-16.3 (jadikan soal arti kata "menjemur") |
| T-5.5 (catatan) | B02 Kuis 2 (114–128) | B01 | Tersurat (pelaku tertukar) | Boleh; kalau direvisi, ubah ke "kata kunci apa yang dicari" |
| T-5.6 (catatan) | B05 keseluruhan | Topik "Tokoh, **peristiwa**, amanat" | Contoh jadi, terbimbing, dan tiket hanya watak dan amanat; "peristiwa" hanya Soal 11 dan Soal 9 pernyataan 2 | Pertimbangkan Tiket 3 memuat satu pernyataan peristiwa (sebab–akibat) |
| T-5.7 (catatan) | T18 Pertanyaan 2 (36–46) | B05 (tokoh dan peristiwa) | Sebenarnya sebab **perubahan** tokoh (topik B06, diajarkan hari yang sama sesudah baca cepat). Catatan pengajar sudah menyebutnya | Boleh dibiarkan; atau ganti ke watak Nenek/Putroe agar murni B05 |

### T-9 · Istilah tidak persis standar (butir 9)

**T-9.1 — "menebak" dipakai untuk "menyimpulkan".** `03-standar-istilah.md` Bagian 6: *menyimpulkan* — jangan dipakai **menebak**. Pelanggaran (kata diucapkan pengajar atau dikirim ke orang tua):

| Berkas · baris | Kutipan | Ganti menjadi |
|---|---|---|
| B05 · 78 (kalimat pembuka) | "kalian bisa **menebak** sifat tokoh dari perbuatannya" | "kalian bisa **menyimpulkan** watak tokoh dari perbuatannya" |
| B05 · 295 (Penjelasan alternatif 1, judul) | "**Tebak** teman dari perbuatannya." | "**Simpulkan** watak teman dari perbuatannya." |
| B05 · 301 | "Kita sudah bisa **menebak** sifat teman" | "Kita sudah bisa **menyimpulkan** watak teman" |
| B05 · 708 (Hal. 7) | "sudah bisa **menebak** sifat tokoh" | "sudah bisa **menyimpulkan** watak tokoh" |
| B06 · 78 (kalimat pembuka) | "Jumat lalu kita **menebak** watak tokoh" | "Jumat lalu kita **menyimpulkan** watak tokoh" |
| B02 · 703 (Hal. 7, cara membantu) | "biarkan [nama] yang **menebak** dan memeriksa sendiri" | "biarkan [nama] yang **menemukan artinya dari kalimat itu** dan memeriksa sendiri" — juga menghilangkan pertentangan dengan salah paham 2 B02 ("arti kata **ditebak**") |

Catatan: "sifat" di B05 baris 78/301/708 sebaiknya ditulis **watak** (istilah baku) saat membicarakan tokoh. Pemakaian "menebak" untuk **menggambarkan kebiasaan keliru** (mis. "arti kata ditebak tanpa membaca kalimat sekitar", "tidak menebak dari letaknya") tidak dihitung sebagai pelanggaran.

**T-9.2 — Istilah belum baku.** B03 baris 23 memakai **"ikhtisar"** dan **"bagan"** dan sudah menandainya [PERLU DICEK]. Keputusan perlu diambil di `03-standar-istilah.md` Bagian 6 sebelum B12/S5 ditulis, supaya B03, B04 (Kuis 2), dan simulasi memakai kata yang sama.

**T-9.3 — "stimulus": lolos.** Hanya muncul di judul berkas B01 (baris 1) dan kolom metadata T04–T06 baris 5 ("membaca soal berstimulus") — keduanya untuk pengajar, tidak tercetak di lembar anak. Kalau judul modul ikut tercetak di lembar kerja, ganti judul B01 menjadi "Cara Membaca Soal dengan Bacaan".

Istilah lain diperiksa dan **bersih**: tidak ada gagasan utama, pikiran pokok, ide utama, kalimat penjelas, karakter, perwatakan, setting, alur, moral/hikmah, bukti, kalimat kunci, eksplisit/implisit, wacana, alinea, skimming, pemanasan, contoh soal, latihan acak, soal bonus.

### T-11.1 · Pemodelan contoh jadi melewatkan kalimat (butir 11, catatan)

- **Berkas/baris:** B02 baris 184 (teks) dan 199 (langkah 5).
- **Kutipan:** "Kakak cari kata 'menang'. Ada di kalimat 5: 'kelas enam tidak menang.'" — padahal kalimat 7 **"Pemenangnya kelas empat"** juga memuat "menang". Contoh jadi berlapis Terkunci dan diucapkan kata per kata; anak yang jeli akan melihat pengajar melewatkan satu kalimat, bertentangan dengan pesan "cari **setiap** kata kunci".
- **Usulan:** langkah 5 diganti: *"Kakak cari kata 'menang'. Ada di kalimat 5 dan kalimat 7. Kalimat 5: kelas enam tidak menang. Kalimat 7: pemenangnya kelas empat. Keduanya tidak menyebut hadiah."* Tulisan papan: "Lingkari *menang* di kalimat 5 dan 7".

### T-2.1 · Aturan tambal B01 menambah waktu pertemuan (butir 2, catatan)

- **Berkas/baris:** B01 baris 543: "8 soal ● sebagai lembar tambal di awal B02 dan B03 (**±6 menit, sebelum kuis**, atau di rumah …)".
- **Masalah:** B02 dan B03 harus tepat 45 menit; 6 menit sebelum kuis membuat pertemuan 51 menit atau memotong kuis (yang tidak boleh dipotong). B02 baris 55 sendiri hanya menyebut "dikerjakan di rumah".
- **Usulan:** hapus pilihan "±6 menit, sebelum kuis". Tulis: **"8 soal ● dikerjakan di rumah; kunci dibacakan Jumat berikutnya sesudah kelas (±5 menit, di luar 45 menit)."**

### T-17.1 · Kalimat pertanyaan lebih dari 12 kata (butir 17, ringan)

`04-standar-soal` §1 aturan 2: kalimat soal paling banyak 12 kata.

| Berkas · baris | Kata | Kutipan | Usulan |
|---|---|---|---|
| B01 · 201 | 13 | "Berdasarkan teks A di soal Diagnostik 1, mengapa Pak Teungku membawa teh hangat?" | "Menurut teks A, mengapa Pak Teungku membawa teh hangat?" |
| B01 · 231 | 16 | "Berdasarkan teks A di soal Diagnostik 1, apa yang ditunjukkan Rafli dengan mencium tangan Pak Teungku?" | "Menurut teks A, Rafli mencium tangan Pak Teungku. Apa artinya?" |
| B01 · 297 | 13 | "Berdasarkan teks B di soal Diagnostik 6, mengapa warga menanam kelapa di kebun?" | "Menurut teks B, mengapa warga menanam kelapa di kebun?" |
| B01 · 312 | 15 | "Berdasarkan teks B …, bagian kelapa mana yang dipakai untuk menyalakan api?" | "Menurut teks B, bagian kelapa mana untuk menyalakan api?" |
| B03 · 513 | 14 | "Untuk menjawab 'Berapa ekor kambing Pak Ridwan?', kata apa yang sebaiknya dicari lebih dulu?" | Lihat usulan T-16.3 |

Selain itu bahasa modul dan teks wajar untuk anak 11 tahun: kalimat pendek, nama dan tempat lokal Banda Aceh, tidak ada konteks yang menyinggung.

### Catatan kecil (tidak mengubah status butir)

- **B01 Diagnostik 5** (baris 231–243) sebagian bisa dijawab dari adat (mencium tangan = hormat) tanpa teks; **Diagnostik 9** (baris 297–309) berlabel tersirat tetapi jawabannya hampir tersurat ("Karena itu …"). Skor kemampuan "tersirat" di Tabel 1 diagnostik jadi kurang tajam. Usulan: hapus kalimat "Karena itu, warga menanam kelapa di kebun." dari teks B, lalu Diagnostik 9 bertanya **"Apa yang dapat disimpulkan tentang pohon kelapa bagi warga?"** dengan kunci "Pohon kelapa sangat membantu kehidupan warga" dan pengecoh dari pengetahuan sendiri; pastikan pilihan tidak sama dengan kunci Diagnostik 8.
- **B01 Tabel 1** (baris 337) menulis tersirat "catat untuk B02 dan B05" — tersirat bukan topik B02. Usulan: "catat untuk B05 dan B06".
- **Pilihan "Syifa anak yang paling pintar di kelas"** (B04 baris 408) dan "Nayla anak yang pintar" (B05 baris 126) hanya pengecoh, bukan pujian pengajar — tidak melanggar butir 15, tetapi "paling pintar di kelas" sebaiknya diganti **"Syifa suka bermain di luar"** agar modul bebas dari bahasa perbandingan antar-anak.

---

## 4. Ringkasan ketepatan kunci

| Kelompok | Jumlah diperiksa | Kunci salah | Ambigu | Lemah (dapat diperdebatkan / tanpa teks / klaim ganda) |
|---|---|---|---|---|
| B01 (4 kuis Mat + 10 diagnostik + 2 terbimbing + 12 soal + 3 tiket) | 31 | 0 | 0 | 4 (Soal 7, Soal 11, Diagnostik 5, Diagnostik 9) |
| B02 (4 kuis + 2 terbimbing + 12 soal + 3 tiket) | 21 | 0 | 0 | 3 (Soal 6 p3, Soal 11, Tiket 3 p3) |
| B03 | 21 | 0 | 0 | 2 (Soal 7, Tiket 2) |
| B04 | 21 | 0 | **1 serius** (Soal 9 p1) | 2 (Kuis 3, Kuis 4) |
| B05 | 21 | 0 | 0 | 1 (Soal 9 p4) |
| B06 | 21 | 0 | 0 | 3 (Soal 10, Soal 11, Soal 12) |
| T01–T18 (2 pertanyaan per teks) | 36 | 0 | **1 ringan** (T11 P2) | 0 |
| Contoh jadi B01–B06 (tidak dinilai sebagai soal) | 12 | 0 | 0 | 1 kesalahan pemodelan (B02 CJ1) |
| **Jumlah** | **172 soal + 12 contoh jadi** | **0** | **2** | **15** |

Ditambah dua pola lintas modul: **13 soal** arti kata dengan kunci = pilihan terpanjang (T-16.6) dan **3 pasang** soal yang saling membuka jawaban (T-16.7).

**Urutan perbaikan yang disarankan:** (1) B04 Soal 9 pernyataan 1; (2) pola kunci terpanjang pada soal arti kata, dimulai dari butir uji tunda B06 Soal 10; (3) istilah "menebak" di B02/B05/B06; (4) label topik B01 Soal 2/10/11 dan B02 Soal 5/10/12; (5) T11 Pertanyaan 2; (6) sisanya.

---

## 5. Tindak lanjut perbaikan

Dikerjakan 17 September 2026 (koordinator: T-16.1, T-16.2; agen perbaikan: sisanya). Sesudah perbaikan: `periksa.py` B01–B06 → SALAH 0, galat 0, format 0, nol temuan struktur; `periksa.py --teks` → nol temuan (T08 172 kata, T11 155 kata). Sebaran kunci PG Halaman 5 sesudah perbaikan: B01 A2·B4·C3·D1 · B02 A2·B2·C4·D2 · B03 A2·B3·C3·D2 · B04 A2·B3·C3·D2 · B05 tetap · B06 A3·B3·C3·D1 (semua ≤ 4).

| Temuan | Diperbaiki | Yang diubah |
|---|---|---|
| T-16.1 B04 Soal 9 p1 | ya (koordinator) | Kalimat 1 paragraf 1 → "Warung kopi Bang Rafli ada di dekat Pasar Aceh." Kunci tetap 1-B |
| T-16.2 T11 Pertanyaan 2 | ya (koordinator) | "Rizki menyusul dan memimpin. Keumala berlari di belakangnya."; Langkah dan jumlah kata diperbarui |
| T-16.3 B06 Soal 11 | ya | C → "karena sekolah barunya dekat rumah"; alasan C disesuaikan |
| T-16.3 B06 Soal 12 | ya | A → "Patuhilah larangan guru mengaji."; Langkah disesuaikan |
| T-16.3 B03 Tiket 2 | ya | B → "Keluarga Salsabila bersama-sama merawat kebun." |
| T-16.3 B04 Kuis 4 | ya | D "warna" → "sekolah"; Langkah dan alasan D disesuaikan |
| T-16.3 B03 Soal 7 | ya | Jadi "Kalimat mana yang menjawab …?" (kalimat ke-1 s.d. ke-4), kunci A → C; Petunjuk, Langkah, alasan baru |
| T-16.3 B01 Soal 11 | ya | Jadi soal arti kata **menjemur**; pilihan setara panjang, kunci D → A (lihat T-16.6) |
| T-16.4 B02 Tiket 3 p3 | ya | "Kata jinak berarti tidak lari ketika didekati." |
| T-16.4 B02 Soal 6 p3 | ya | "Kata lantang berarti suara yang keras."; Langkah (3) disesuaikan |
| T-16.4 B05 Soal 9 p4 | ya | "Watak Rizki sombong." Kunci tetap S |
| T-16.5 B06 Soal 10 | ya | letih → **lunglai** ("tubuh Haikal lunglai"); pilihan, Langkah, alasan baru. Kunci tetap C |
| T-16.5 B02 Soal 11 | ya | Teks Soal 8: "Hari ini perahunya sarat ikan."; Soal 11 arti **sarat**, kunci B → C |
| T-16.5 B01 Soal 7 | ya | ramai → **riuh** (kalimat teks dipendekkan jadi 7 kata); kunci D → C |
| T-16.5 B04 Kuis 3 | ya | gembira → **girang**; pilihan dua–tiga kata, kunci tetap B |
| T-16.6 (13 soal arti kata) | ya | Pengecoh dipanjangkan setara kunci, tiap pengecoh tetap berlabel salah paham. Kunci **bukan** lagi pilihan terpanjang di: B01 S3, B01 S7, B01 S11, B02 CJ2, B02 S11, B03 Kuis 2, B03 S10, B04 Kuis 3, B04 S5, B06 S6, B06 S10, T08 P2. Huruf kunci berubah: B01 S7 D→C, B01 S11 D→A, B02 S11 B→C, B03 S10 C→B, B04 S5 D→C, B06 S6 D→B, T08 P2 D→C. B02 S4 kunci tetap D, panjang pilihan hampir sama (selisih 1 huruf) |
| T-16.7 B06 Soal 4 ↔ 7 | ya | Soal 7 hanya tentang tempat dan waktu (tanpa pilihan suasana); kunci tetap A, C |
| T-16.7 B03 Soal 2 ↔ 4 | ya | Usulan "paling akhir" tetap membuka jawaban, jadi Soal 2 diberi teks baru (Rafli, 3 kalimat) dan teks Aisyah dipindah ke Soal 4. Kunci tetap B dan D |
| T-16.7 B04 Soal 2 ↔ 4 | ya | Soal 4 memakai paragraf baru (kebun sekolah, 4 kalimat); kunci tetap A, B, D |
| T-5.1 B02 Soal 5 dan 12 | ya | Diubah ke bentuk "kalimat mana yang menjawab …" (B01). Soal 5 kunci A, D, E; Soal 12 kunci C. Penjelasan alternatif 1 langkah 6 kini memakai Soal 8 |
| T-5.2 B02 Soal 10 | ya | Arti kata **celengan** (PR-B1), kunci A → B |
| T-5.3 B01 Soal 2 dan 10 | ya | Bentuk strategi "kata apa yang dicari lebih dulu"; kunci tetap D dan B |
| T-5.4 B01 Soal 11 | ya | Lihat T-16.3 |
| T-5.5 B02 Kuis 2 (catatan) | tidak | Pemeriksa menyatakan boleh dibiarkan |
| T-5.6 B05 Tiket 3 | ya | Pernyataan 4 "Lampu sepeda pecah karena Raihan menabrak pagar." (B); kunci 1-B, 2-S, 3-S, 4-B; baris "Yang diuji" diperbarui |
| T-5.7 T18 Pertanyaan 2 (catatan) | tidak | Pemeriksa menyatakan boleh dibiarkan; catatan pengajar sudah ada |
| T-9.1 menebak / sifat | ya | B05 baris 78, 295, 301, 708 → "menyimpulkan watak"; B06 baris 78 → "menyimpulkan"; B02 Hal. 7 → "menemukan artinya dari kalimat itu" |
| T-9.2 ikhtisar, bagan | ya | Dua baris ditambah di `03-standar-istilah.md` Bagian 6; definisi B03 baris 23 diselaraskan, tanda [PERLU DICEK] dihapus |
| T-9.3 stimulus | tidak perlu | Lolos |
| T-11.1 B02 CJ1 langkah 5 | ya | Lingkari *menang* di kalimat 5 dan 7; ucapan pengajar sesuai usulan |
| T-2.1 aturan tambal B01 | ya | "dikerjakan di rumah; kunci dibacakan Jumat berikutnya sesudah kelas (±5 menit, di luar 45 menit)" |
| T-17.1 (5 kalimat > 12 kata) | ya | B01 Diagnostik 3, 5, 10 → "Menurut teks …"; Diagnostik 9 diganti (lihat catatan kecil); B03 Soal 7 (lihat T-16.3) |
| Catatan kecil B01 Diagnostik 9 + teks B | ya | Kalimat "Karena itu, warga menanam kelapa di kebun." dihapus; Diagnostik 9 → "apa yang dapat disimpulkan tentang pohon kelapa bagi warga?", kunci A "Pohon kelapa sangat membantu kehidupan warga." (berbeda dari kunci Diagnostik 8); alasan C Diagnostik 7 disesuaikan |
| Catatan kecil B01 Diagnostik 5 (adat) | tidak | Hanya kalimat pertanyaan dipendekkan (T-17.1); isi soal tidak termasuk daftar perbaikan koordinator |
| Catatan kecil B01 Tabel 1 | ya | "catat untuk B05 dan B06" |
| Catatan kecil "paling pintar di kelas" | ya | B04 Soal 2 D → "Syifa suka bermain di luar."; alasan D disesuaikan |

**Catatan sisa:** B03 masih memakai kata "bagan" untuk tabel (salah paham 3, Contoh jadi 2, Tiket 3), sedangkan definisi baku kini "gambar kotak dan panah". Perlu diputuskan apakah tabel penyusunan ulang disebut "tabel" saja.
