# Tahap 0 — Pemahaman, Pertentangan, dan Pertanyaan

**Ringkas:** (1) Yang dirancang adalah satu aplikasi keluarga untuk Matematika dan Bahasa Indonesia kelas 1–6 plus Persiapan TKA kelas 6, gratis selama orang tua memberi masukan. (2) Bahan yang sudah matang baru dua: mesin hitung cepat Matematika (Metode LANCAR versi 5) dan Paket Siap TKA SD, tetapi Paket TKA dibuat untuk kelas tatap muka dengan pengajar, bukan untuk belajar di HP. (3) Ada 12 pertentangan; yang paling menentukan adalah jadwal TKA 2027 lawan urutan rilis, bahan TKA yang bergantung pada pengajar, dan versi 4 yang sampai malam ini belum menyimpan satu hasil pun.

Disusun 19 Oktober 2026 malam. Label: **[FAKTA + sumber]** · **[ESTIMASI + cara hitung]** · **[ASUMSI — perlu diuji]**.

---

## 0. Yang sudah dibaca

| Bahan | Status |
|---|---|
| 21 dokumen Project (prompt, catatan diskusi, Metode LANCAR, level per kelas, purwarupa versi 5, program TKA, 6 berkas induk TKA, status, daftar isi, 4 riset, peta mapel, modul interaktif, susunan folder, kelemahan rencana lama) | Dibaca semua |
| Halaman Latihan Hitung Cepat versi 4 dan basis datanya | Dibaca; **tidak diubah** |
| Laporan Ide Pandu Anak (dokumen) | Dibaca utuh |
| Bank Ide: `pandu-anak`, `peta-belajar`, `sistem-belajar-4-akun` | Dibaca |
| Folder laptop `D:\00 New App 2026\0 APP Dukungan Belajar Siswa` | **Belum bisa dibaca.** Laptop tersambung ke sesi ini, tetapi folder itu belum dibagikan. Dicatat di `pertanyaan-terbuka.md` |

---

## 1. Yang saya pahami

| Hal | Pemahaman |
|---|---|
| **Apa** | Satu aplikasi Android. Anak latihan; orang tua terlibat lewat tiga cara: duduk bersama (Mode Dampingi, PIN), dari jauh (mode orang tua di HP sendiri), atau sekadar melihat rapor lewat link WhatsApp |
| **Yang dijual** | Kepuasan orang tua karena kemajuan anak **terlihat dan terukur**, ditambah anak senang belajar. Hasil akhirnya diserahkan kepada Allah |
| **Isi saat tayang** | Matematika (tiga lapis: Lancar, Paham, Siap TKA) dan Bahasa Indonesia kelas 1–6, plus Persiapan TKA kelas 6. Bahasa Inggris dan game menyusul |
| **Mesin Matematika** | Metode LANCAR: tes penempatan, layar jurus, 6 level per kelas, 20 soal per lembar, 3–7 detik per soal, 70% level ini + 30% level lalu, soal salah atau lambat diulang, uji daya tahan 3 minggu |
| **Uang** | Gratis untuk waktu yang belum ditentukan. "Bayarannya" adalah masukan orang tua. Berbayar baru dibuka setelah orang tua tidak akan kecewa |
| **Skala masa gratis** | ± 50 pemakai aktif dari 100–150 keluarga yang diajak lewat WhatsApp, tanpa tatap muka |
| **Biaya** | [ESTIMASI Acut2, catatan 19 Okt] Di bawah ± Rp1 juta per bulan untuk 50 anak; yang mahal adalah isi dan waktu Acut |

### Keadaan nyata malam ini

| Hal | Keadaan |
|---|---|
| Latihan Hitung Cepat versi 4 | **[FAKTA — basis data halaman, dibaca 19 Okt ± 18.20 WIB]** Koleksi `hasil` dan `anak` masih **kosong: 0 lembar, 0 anak**. Uji angka awal 19–25 Okt belum menghasilkan data yang bisa dibaca dari sini |
| Versi 5 (LANCAR) | Jadi, lolos uji otomatis, belum dipasang. Rencana dipasang ± 26 Okt **setelah** ada angka awal versi 4 |
| Paket Siap TKA SD | 36 modul, 5 simulasi, 36 teks baca cepat, rapor, pelatihan pengajar: selesai 17 Sep, **bentuknya kelas luring** |
| Proyek lain | Jeumpa dan Peta Belajar sama-sama menuju Play Store; Peta Belajar menargetkan tayang akhir November |

---

## 2. Keputusan yang dikunci

Tidak diulang di sini; daftar lengkap dengan tanggal dan sebabnya ada di `keputusan.md`. Intinya: enam arah besar, Metode LANCAR, tiga lapis Matematika, satu aplikasi dengan paket isi per kelas, tiga cara orang tua terlibat, isi dibangun bertahap, sistem masukan berbentuk pilihan dengan syarat lembut, Keluarga Perintis, kemampuan tidak dibatasi biaya, server Supabase.

## 3. Yang belum diputuskan

| Hal | Siapa yang memutuskan |
|---|---|
| Jadwal per mapel per minggu | Acut, setelah usulan Tahap 2 |
| Rilis ke berapa Persiapan TKA masuk | Acut (lihat Pertanyaan 1) |
| Batas anggaran bulanan dan angka peringatan dini | Acut, di Tahap 5 |
| Lama masa gratis dan angka gerbang berbayar | Acut, setelah usulan Tahap 2 |
| Bentuk latihan harian Bahasa Indonesia | Acut, setelah riset Tahap 1 |
| Jalur kertas + foto (AI membaca tulisan tangan) | Acut (Pertanyaan 5) |
| Apa yang dimaksud "game di luar jam belajar" dan batas waktunya | Acut, setelah usulan Tahap 2 |
| Kelas 1–2 ikut sejak awal atau menyusul | Acut (Pertanyaan 4) |
| Pilihan teknologi | Acut, di Tahap 3 |
| Siapa guru pemeriksa isi dan honornya | Acut |
| Nama aplikasi — **dijawab 28 Okt: Pintar Main**, maskot Pinci (`03-antarmuka/04-identitas-merek.md`) | Acut |

---

## 4. Pertentangan antar-bahan

### P1. "Latihan mengingat lemah untuk Matematika" lawan hitung cepat yang bertumpu pada hafal fakta — **sebagian besar tidak bertentangan, tetapi ada celah**

- **Riset teknik Matematika:** **[FAKTA — Murray dkk. 2025]** latihan mengingat khusus Matematika g = 0,18, tidak kokoh, hanya 7 studi. **[FAKTA — Yang dkk. 2021]** di SD efeknya paling kecil (0,328).
- **Metode LANCAR:** **[FAKTA — Fuchs dkk. 2010]** jurus ditambah 4–6 menit latihan terarah paling baik untuk kelancaran fakta dasar kelas 3; **[FAKTA — McNeil dkk. 2025]** kelancaran memprediksi kemajuan Matematika selanjutnya.
- **Penilaian:** angka 0,18 mengukur kuis mengingat **materi pelajaran** (konsep dan prosedur). Bukti fakta dasar berasal dari kumpulan penelitian lain. Jadi lapis Lancar sah bertumpu pada latihan mengingat fakta, sebab yang dilatih memang fakta.
- **Celah yang nyata:**
  1. Bukti fakta dasar hanya untuk tambah, kurang, kali, bagi satu angka (kira-kira kelas 1–4). Level kelas 5–6 (×11, ×25, kuadrat, pangkat tiga, persen, urutan operasi) **bukan fakta dasar**. **[ASUMSI]** Manfaatnya untuk kelas 5–6 belum punya dasar penelitian.
  2. Angka campur-aduk d = 0,83 berasal dari kelas 7 yang harus **memilih cara** menyelesaikan soal. Pada lembar fakta, manfaat utama campuran 70/30 kemungkinan pengulangan berjarak (g = 0,28), bukan 0,83.
- **Akibat:** jangan menjual lapis Lancar kelas 5–6 dengan angka Fuchs atau 0,83, sebab keduanya tidak menguji isi itu.

### P2. Isi Lancar kelas 6 lawan kurikulum dan TKA

- **Versi 4/5:** level 2 kelas 6 = pangkat tiga dan akar pangkat tiga; level 3 = bilangan negatif.
- **Spesifikasi TKA:** **[FAKTA — kerangka asesmen, lewat 01-spesifikasi]** domain TKA SD hanya Bilangan (cacah, pecahan, desimal, persen, KPK/FPB, rasio), Geometri & Pengukuran, dan Data. Negatif dan pangkat tiga tidak disebut.
- **[ASUMSI — dicek di Tahap 1 terhadap Capaian Pembelajaran Fase C]** Kalau keduanya materi SMP, dua dari enam level kelas 6 menyimpang dari "berstandar", sementara kelancaran yang dibutuhkan TKA (pecahan ↔ desimal ↔ persen, faktor kecil) belum ada di Lancar kelas 6.

### P3. Lambang bagi

- **Versi 4/5:** memakai **÷**.
- **Standar istilah TKA §7:** bagi ditulis **:**, lambang ÷ dilarang.
- **[ASUMSI]** Buku sekolah memakai ":", jadi anak kelas 2–3 bisa bingung. Murah diperbaiki di versi 5 sebelum dipasang.

### P4. Bahan TKA dibuat untuk kelas tatap muka; aplikasi untuk belajar di rumah — **pertentangan terbesar soal isi**

- **Spesifikasi TKA:** 6–8 anak, 45 menit, 3× seminggu, pengajar membaca naskah, papan jawaban serentak, dua anak menjelaskan, halaman "Kalau anak macet" untuk pengajar.
- **Riset teknik:** **[FAKTA — meta-analisis ALEKS]** aplikasi sebagai **pengganti** pengajar g = 0,05; sebagai **pelengkap** g = 0,43. **[FAKTA — NBER w35620]** Khanmigo 0,05 SD per tahun.
- **Susunan folder:** "bangun aplikasi sesudah angkatan pertama berjalan, bukan sebelumnya". **Modul interaktif:** buka luring dulu.
- **Bank Ide:** "aplikasi tinggal memindahkannya".
- **Penilaian:** yang bisa pindah utuh ke HP adalah contoh jadi (hal. 3), soal campur-aduk (hal. 5), tiket keluar (hal. 6), simulasi, 36 teks, peta spiral, dan aturan warna rapor. Yang tidak bisa pindah tanpa dirancang ulang: naskah 45 menit, papan jawaban, anak menjelaskan, dan halaman "Kalau anak macet". **[ESTIMASI]** Jadi TKA di aplikasi adalah pekerjaan merancang ulang, bukan memindahkan, sebab satu modul ± 5.300 kata disusun untuk 45 menit dengan pengajar, sedangkan sesi di HP 10–20 menit tanpa pengajar.

### P5. Jadwal TKA 2027 lawan urutan rilis

- **[FAKTA — BBPMP Jatim, lewat riset pasar]** TKA SD 2026 berlangsung 20–30 April. Program 12 minggu harus mulai awal Januari.
- **Prompt:** rilis dimulai dari LANCAR + akun keluarga + sistem masukan; **[FAKTA — catatan Peta Belajar]** uji tertutup Play Store wajib 12 penguji selama 14 hari; Jeumpa dan Peta Belajar juga membutuhkan penguji.
- **[ESTIMASI]** Kalau TKA masuk rilis ke-3 atau lebih, ia hampir pasti lewat dari TKA April 2027, termasuk untuk anak Acut yang kelas 6. Angkatan berikutnya baru April 2028. → **Pertanyaan 1 dan 2.**

### P6. Peran orang tua

- **Keputusan 19 Okt:** orang tua membimbing adalah nilai utama; mode jauh bisa **melihat anak latihan secara langsung**.
- **Riset metode belajar:** **[FAKTA — Nickow dkk., 96 uji acak]** orang tua sebagai pendamping memberi efek terlemah (0,20–0,25). **[FAKTA — Frontiers 2023, 16.338 siswa]** keterlibatan yang mengontrol −0,153, menyela atau membantu tanpa diminta −0,149, dua kali lebih besar dari manfaat keterlibatan suportif (+0,076); dukungan otonomi +0,133 paling kuat. Di SD kerusakannya lebih kecil (−0,093).
- **Keputusan 17 Okt** "cukup menyuruh" dan **19 Okt** "membimbing adalah nilai utama" sama-sama dikunci. Keduanya bisa hidup berdampingan, tetapi pesan jualnya harus memilih satu kalimat.
- **Tidak diubah.** Akibat untuk rancangan: Mode Dampingi dan mode jauh harus mendorong orang tua memberi petunjuk, bukan jawaban, dan tidak menyela saat soal berwaktu, sebab di situlah kerusakannya terjadi.

### P7. Game dan hadiah

- **Deskripsi Project:** game interaktif di luar jam belajar.
- **Laporan Ide:** "permainannya harus pelajaran itu sendiri, bukan hadiah setelah belajar".
- **Riset:** **[FAKTA — Deci dkk. 1999]** hadiah karena menyelesaikan tugas d = −0,36 terhadap minat melanjutkan sendiri; hadiah tak terduga ≈ 0. **[FAKTA — Sala dkk.]** latihan otak: perpindahan jauh g = 0,001. **[FAKTA — EdWeek 2021]** Prodigy diadukan ke FTC karena iklan dan dorongan membeli.
- **Keputusan yang menyentuhnya:** kartu satwa dibuka saat lulus level, barang Gampong sebagai imbalan menjawab pertanyaan dan memainkan game akhir pekan.
- **[ASUMSI — dicek Tahap 1]** Benda maya yang dijanjikan di muka kemungkinan bekerja seperti hadiah yang dijanjikan; bukti di atas berasal dari hadiah berwujud. Selain itu ukuran gerbang "latihan dimulai anak sendiri" bisa tercemar, sebab anak membuka aplikasi untuk main, bukan belajar.

### P8. Gratis lama dan syarat lembut

- **Riset metode belajar:** **[FAKTA — Reich & Ruipérez-Valiente 2019, pelajar dewasa]** kursus gratis diselesaikan 3,13%, berbayar 46%; 30% pendaftar tidak pernah mulai. **Laporan Ide:** siklus gratis bisa jadi bumerang.
- **Arah besar 4:** gratis tanpa batas waktu. **Tidak diubah.**
- **Pertentangan di dalam keputusan sendiri:** syarat lembut menahan **rapor lengkap** kalau orang tua melewatkan dua putaran, padahal rapor terukur adalah hasil yang dijual dan bukti yang nanti membuat orang tua mau membayar. Menahannya berarti menahan bukti. Usul untuk Tahap 2 (tanpa mengubah kunci): yang ditahan adalah fitur tambahan lain, bukan rapor.

### P9. Patokan "40% sangat kecewa" dengan ± 50 pemakai

- **[ESTIMASI]** Kalau 30 orang tua menjawab, selang kepercayaan 95% untuk angka 40% adalah ± 18 poin (1,96 × √(0,4 × 0,6 ÷ 30) ≈ 0,18). Angka itu tidak bisa membedakan 25% dari 55%.
- **Akibat:** gerbang berbayar tidak boleh bertumpu pada satu angka ini; perlu digabung dengan ukuran kemajuan anak yang terukur.

### P10. Latihan harian Bahasa Indonesia

- **Catatan diskusi:** latihan harian BI buatan mesin = ejaan, imbuhan, kosakata dari daftar kata.
- **Program TKA:** **[FAKTA — kerangka asesmen]** TKA Bahasa Indonesia hanya menguji membaca. **Pustaka model:** **[FAKTA — Brunmair & Richter 2019]** kosakata murni yang dicampur justru merugikan (g = −0,39), jadi harus diblok per tema. **Laporan Ide:** baca nyaring berwaktu (kata per menit), yang menuntut rekaman suara anak.
- **[ASUMSI]** Yang paling mudah dibuat mesin (ejaan, imbuhan) belum tentu yang menggerakkan kemampuan membaca. Dijawab riset Tahap 1 butir 3.

### P11. Kelas 1–2

- **Peta mapel:** kelas 1–2 sebaiknya calistung terpadu; jenjang paling sulit dijalankan lewat layar; butuh pendamping di sebelahnya; sesi 25–30 menit.
- **Arah besar 2:** kelas 1–6 untuk tayang. **[ASUMSI]** Anak kelas 1 belum lancar membaca petunjuk, jadi semua layar butuh suara. → **Pertanyaan 4.**

### P12. Angka yang saling bertentangan di bahan

| Hal | Bahan A | Bahan B | Dipakai sementara |
|---|---|---|---|
| Rerata TKA SD 2026 Bahasa Indonesia | Riset metode belajar: 69,14 | Program TKA: **60,14** (siaran pers Kemendikdasmen 15444) | 60,14, dicek ulang di Tahap 1 |
| IPA di TKA SD 2027 | Peta mapel: "mulai 2027 ditambah IPA" | Riset pasar dan program TKA: masih usulan, belum ada peraturan | Masih usulan, dicek di Tahap 1 butir 7 |
| Beban isi | Prompt: ± 360 topik × 1–2 jam | Modul TKA nyata: ± 3 jam per modul, lalu pemeriksaan mutu menemukan 23 kelemahan tinggi dan sedang | **[ESTIMASI]** 1–2 jam per topik kemungkinan terlalu rendah bila termasuk pemeriksaan manusia; dihitung ulang di Tahap 2 |

---

## 5. Kenapa rancangan ini bisa gagal

| # | Jalan menuju gagal | Tanda awal yang sudah terlihat |
|---|---|---|
| 1 | **Tidak ada angka awal**, jadi kenaikan tidak pernah bisa dibuktikan dan gerbang berbayar tidak pernah lolos dengan jujur | Versi 4: 0 hasil tersimpan per 19 Okt malam |
| 2 | **TKA 2027 terlewat**, padahal itu satu-satunya tenggat yang memaksa orang tua bergerak | Urutan rilis menaruh TKA di belakang; tiga aplikasi rebutan penguji |
| 3 | **Isi kebesaran**: 2 mapel × 6 kelas + TKA membuat rilis molor, keluarga uji keburu pergi | Bank Ide pernah menyimpan "Sistem Belajar 4 Akun" karena terlalu besar |
| 4 | **50 pemakai tidak datang**: tanpa tatap muka dan tanpa promosi, 100–150 keluarga harus diajak lewat WhatsApp | Belum ada daftar keluarga |
| 5 | **Masukan berhenti mengalir** setelah minggu ke-2 sampai ke-4, saat rasa baru pudar | **[FAKTA — riset gamifikasi]** efek kebaruan menurun setelah minggu ke-4 |
| 6 | **Fokus Acut terbelah** antara Jeumpa, Peta Belajar, dan aplikasi ini | Laporan Ide 17 Okt: bangun aplikasi ini setelah Jeumpa tayang |

---

## 6. Pertanyaan (maksimal 5)

Hanya hal yang belum dikunci dan yang jawabannya mengubah rancangan.

1. **TKA untuk angkatan April 2027 (termasuk anak Acut kelas 6):** harus bisa dipakai di aplikasi ± awal Januari 2027, atau boleh dilayani lewat jalur lain dulu dan aplikasinya menyasar TKA 2028?
2. **Paket Siap TKA SD luring** (kelas di rumah pengajar, rencana mulai Januari): jalan, ditunda, atau batal? Ini menentukan apakah TKA di aplikasi menggantikan pengajar atau mendampingi kelas, dan siapa yang bisa jadi guru pemeriksa.
3. **Urutan dan bentuk rilis:** aplikasi ini didahulukan, setelah Jeumpa, atau setelah Jeumpa dan Peta Belajar? Dan bolehkah masa uji ± 50 keluarga memakai versi web yang dibuka lewat link (bisa dipasang di layar HP dan tetap jalan tanpa sinyal) sebelum masuk Play Store?
4. **Kelas 1–2:** ikut sejak rilis awal, atau menyusul setelah kelas 3–6 berjalan?
5. **Kertas + foto:** latihan harian di layar saja dulu (seperti versi 5), atau jalur buku + foto yang diperiksa AI ikut sejak awal?

---

**Langkah berikutnya:** Acut menjawab lima pertanyaan di atas; setelah itu Tahap 1 (riset penguat lewat pencarian web) dimulai.
