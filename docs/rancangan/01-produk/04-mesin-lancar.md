# Mesin Belajar Metode LANCAR — Versi Aplikasi

**Ringkas:** (1) Purwarupa versi 5 dipertahankan sebagai inti, sebab sudah lolos 8.100 lembar uji otomatis dengan 0 kunci salah, dan sebagian besar aturannya sudah sesuai Metode LANCAR. (2) Ada 12 celah yang ditutup di versi aplikasi. Yang terbesar: dua level kelas 6 di luar materi SD, belum ada penyelipan fakta baru secara bertahap, belum ada penjaga "terlalu rumit / terlalu mudah" selain turun level, dan lembar yang dikerjakan bersama orang tua ikut dihitung untuk naik level. (3) Semua angka ambang di sini adalah **[ASUMSI]** awal yang dikalibrasi ulang dari data minggu ke-4.

Tahap 2, butir 5. Disusun 19 Oktober 2026. Dasar: `bahan/latihan-v5-lancar.html`, `claude/metode-lancar.md`, `rancangan/01-produk/riset-penguat.md`.

---

## 1. Yang dipertahankan dari versi 5

| Bagian | Cara kerja di versi 5 | Kenapa dipertahankan |
|---|---|---|
| Pembuat soal dengan benih acak | Soal dibuat kode, bukan disalin; tiap soal unik dalam satu lembar; urut dari mudah ke sulit | Tidak menjiplak lembar siapa pun; kunci selalu benar (8.100 lembar diuji) |
| 6 level per kelas | Sesuai `latihan-hitung-cepat-level-per-kelas.md` | Keputusan 19 Okt |
| Tes penempatan | 4 soal per level dari Level 1; berhenti di level pertama yang belum lancar (4/4 benar dan di bawah target waktu); ada tombol "Belum bisa" dan pilihan "lewati, mulai Level 1" | Prinsip L: mulai dari level anak |
| Layar jurus | Satu layar per level: inti jurus, 2–3 contoh jadi polos, catatan ingat; bisa dibuka lagi | Prinsip A; contoh jadi tanpa disuruh menjelaskan (β = −0,24 bila disuruh) |
| Susunan lembar | 20 soal: 14 level ini + 6 level sebelumnya (Level ≥ 3: 4 dari level −1, 2 dari level −2) | Prinsip C |
| Naik level | 2 lembar **tepat** berturut-turut (salah ≤ 1 dan waktu ≤ target); **kilat** (0 salah dan ≤ 66% target) langsung naik | Prinsip N |
| Turun level | Salah ≥ 6 dalam satu lembar | Mencegah anak tenggelam |
| Pengulangan soal | Sampai 4 soal yang salah atau terlalu lama (> 2× target) muncul lagi di lembar berikutnya | Umpan balik korektif |
| Uji daya tahan | 3 minggu setelah lulus, 6 soal level itu menggantikan soal lama; dianggap ingat bila salah ≤ 1 | Prinsip "penguasaan dihitung kalau masih bisa 3 minggu kemudian" |
| Data per soal | Soal, jawaban, benar/salah, detik, jumlah hapus, level asal, tanda pengulangan | Prinsip R: rapor per soal, bukan per lembar |

---

## 2. Celah di versi 5 dan perbaikannya

| # | Celah | Akibat kalau dibiarkan | Perbaikan di aplikasi |
|---|---|---|---|
| 1 | Lambang bagi **÷** | Berbeda dengan buku sekolah dan standar TKA (":") | Ganti ":" di semua soal dan jurus |
| 2 | Kelas 6 L2 (pangkat tiga) dan L3 (bilangan negatif) | Materi SMP **[FAKTA — CP 032/2024; Buku Guru Kelas VII]**; tidak membantu TKA | Ganti (lihat bagian 4) |
| 3 | Fakta baru dikenalkan sekaligus satu keluarga | Bertentangan dengan prinsip "selipkan" di Metode LANCAR | Lembar pertama level baru 8 soal baru + 12 lama; lembar kedua 11 + 9; sesudahnya 14 + 6 |
| 4 | Dua lembar boleh dikerjakan berturut-turut tanpa jeda dan langsung dihitung naik | **[FAKTA — ringkasan Peltier, belum ditelaah sejawat; lewat `claude/metode-lancar.md`]** jeda 10 menit terlalu pendek, jeda 3 jam membantu | Dua lembar tepat harus dari **dua sesi berbeda (jeda ≥ 1 jam)** untuk dihitung naik; kilat tetap langsung naik |
| 5 | Lembar yang dikerjakan di Mode Dampingi tetap dihitung | Orang tua bisa membantu, sehingga level naik palsu | Lembar Mode Dampingi ditandai dan **tidak dihitung untuk naik level** (tetap dihitung untuk latihan) |
| 6 | Tidak ada tombol jeda | Azan, tamu, atau adik menangis membuat waktu membengkak dan anak "gagal" | Tombol jeda menyembunyikan soal dan menghentikan waktu; paling banyak 2 kali per lembar |
| 7 | Uji daya tahan gagal hanya menjadwalkan ulang 3 minggu lagi | Fakta yang mulai lupa tidak dilatih | Bila gagal: soal level itu masuk antrean pengulangan 3 lembar berikutnya, lalu diuji ulang **1 minggu** kemudian |
| 8 | Uji daya tahan hilang saat ganti kelas | Level kelas lama tidak pernah dicek lagi | Minggu pertama kelas baru: semua level kelas lama yang lulus diuji sekali |
| 9 | Penjaga "terlalu rumit / terlalu mudah" hanya turun level dan kilat | Anak bisa macet berminggu-minggu di salah 2–5 tanpa kemajuan | Penjaga lengkap di bagian 5 |
| 10 | Kesalahan hanya dicatat per soal | Rapor tidak bisa menjelaskan **kenapa** salah | Peta jenis salah (bagian 6) |
| 11 | Tes penempatan dihitung lancar hanya kalau 4/4 | Satu salah ketik menempatkan anak terlalu rendah (terlalu mudah) | Tetap 4/4 untuk "lancar", tetapi bila anak kilat di 2 lembar pertama, aplikasi menawarkan tes loncat level |
| 12 | Setelah Level 6 lulus, anak harus pindah kelas secara manual | Anak bingung, atau maju jauh melampaui sekolah tanpa sepengetahuan orang tua | Mode "Lembar Jaga": 1 lembar campur semua level per hari (Jurus Sulap Angka ikut terbuka mulai Rilis 3); pindah ke kelas berikutnya hanya kalau orang tua memilih |

---

## 3. Aturan lengkap versi aplikasi

| Aturan | Isi | Dasar |
|---|---|---|
| Takaran | 2 lembar per hari, sebaiknya sore dan malam; lembar ke-3 boleh tetapi tidak dihitung untuk naik level. Lama latihan **2–5 menit per hari** (diputuskan Acut 20 Okt) | Takaran 2–5 menit per hari **[FAKTA — Duhon 2022; Peltier]** |
| Panjang lembar | **20 soal untuk semua level** (keputusan Acut 20 Okt; usul lembar 15 soal tidak dipakai) | Kelas 1: 20 × 3 detik = 1 menit + mengetik. **[ASUMSI]** Cukup pendek untuk umur 6; dicek di uji keluarga. Level terberat ± 4,7 menit untuk dua lembar, masih di dalam takaran 2–5 menit |
| Susunan lembar | Lihat celah #3; soal lama ditaruh di posisi tersebar, bukan di belakang | Prinsip C |
| Target waktu | Jumlah target per soal di lembar itu (3–7 detik per soal, sesuai level) | Jawaban dari ingatan ± 2–3 detik **[FAKTA — Rocket Math]** |
| Tepat | Salah ≤ 1 **dan** waktu ≤ target | Versi 5 |
| Naik | 2 lembar tepat dari 2 sesi berbeda, atau 1 lembar kilat | Celah #4 |
| Tetap | Salah 2–5, atau tepat tapi lewat waktu | Versi 5 |
| Turun | Salah ≥ 6 | Versi 5 |
| Pengulangan | Sampai 4 soal yang salah atau > 2× target muncul lagi di lembar berikutnya | Versi 5 |
| Daya tahan | 21 hari setelah lulus; ingat bila salah ≤ 1 dari 6 | Versi 5 + celah #7–8 |
| Jeda | Paling banyak 2 kali per lembar, soal disembunyikan | Celah #6 |
| Mode Dampingi | Tidak dihitung untuk naik level | Celah #5 |

---

## 4. Level per kelas — usulan revisi

Yang berubah dari versi 4/5 ditandai **tebal**.

| Kelas | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| 1 | Tambah sampai 10 | Kurang sampai 10 | Belasan (13 + 5) | Tambah sampai 20 | Kurang sampai 20 | Campur |
| 2 | Puluhan (30 + 40) | 2 angka + 1 angka | 2 angka − 1 angka | ×2 ×5 ×10 | :2 :5 :10 | Campur |
| 3 | ×3 ×4 | ×6 ×7 | ×8 ×9 | Bagi dari tabel (56 : 7) | Tambah/kurang 2 angka | Campur kali bagi |
| 4 | Pemanasan tabel | Kali puluhan/ratusan | 2 angka × 1 angka, hasil ≤ 150 | Bagi hasil belasan | Ratusan | Campur |
| 5 | **2 angka × 1 angka, hasil ≤ 200** (diturunkan 20 Okt dari ≤ 400) | Bagi puluhan | ×11 dan ×25 | Kuadrat ≤ 15 | ½ ¼ ⅓ ¾ dari bilangan | Campur |
| 6 | Kuadrat dan akar ≤ 15 | **Pecahan ↔ persen ↔ desimal setara** (½ = …%, 0,4 = …%) | **KPK dan FPB bilangan kecil** (KPK 4 dan 6; FPB 12 dan 18) | Persen mudah (25% dari 80) | Urutan operasi | Campur |

### 4.1 Target detik per soal dan lama latihan harian (ditambah 20 Okt)

Pemeriksa menemukan bahwa target per level tidak tertulis di rancangan, dan level atas melewati takaran 2–4 menit yang waktu itu dikunci. **Acut memutuskan 20 Okt: lembar tetap 20 soal dan takaran menjadi 2–5 menit.** Angka di bawah diambil dari versi 5 (`bahan/latihan-v5-lancar.html`), kecuali kelas 5 L1 dan kelas 6 L2–L3 yang levelnya baru.

| Kelas | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| 1 | 3 | 3 | 3 | 3,5 | 3,5 | 3,5 |
| 2 | 3 | 3,5 | 3,5 | 3 | 3 | 4 |
| 3 | 3 | 3 | 3 | 3,5 | **6** | 3,5 |
| 4 | 3 | 4 | **6** | **6** | **6** | **5** |
| 5 | **6** | **5** | **5** | 4 | 5 | **5,5** |
| 6 | 4 | 5 (baru) | **6 (baru)** | **5** | **7** | **5,5** |

Angka = target detik per soal. **Tebal** = level yang target 20 soalnya (termasuk soal level lama) > 100 detik; level ini yang paling dekat ke batas 5 menit, jadi dipantau di laporan minggu ke-4.

| Hitungan **[ESTIMASI]** | Lembar 20 soal | Lembar 15 soal |
|---|---|---|
| Level terberat (kelas 6 L5): 14 × 7 + 4 × 5 + 2 × 6 | 130 detik | 98 detik |
| Dua lembar pada kecepatan target, + 20% untuk membaca jurus dan hasil | 2 × 130 × 1,2 = **5,2 menit** ✗ | 2 × 98 × 1,2 = **3,9 menit** ✓ |
| Level teringan (kelas 1 L1) | 2 × 60 × 1,2 = 2,4 menit | — |

Anak yang belum lancar bekerja lebih lambat dari target, jadi lama sebenarnya bisa ± 1,5× angka ini di minggu pertama sebuah level. Itu diterima, sebab level itu justru sedang dilatih, dan penjaga "macet" (5.1) mempersempit lembar kalau anak terlalu lama.

**Kelas 5 L1 diturunkan** menjadi hasil ≤ 200 (misal 24 × 6, 35 × 4), sebab hasil sampai 400 dalam ≤ 6 detik bukan lagi jawaban dari ingatan (± 2–3 detik **[FAKTA — Rocket Math]**) dan berisiko "terlalu rumit" (aturan 4). Hasil sampai 400 tetap muncul di soal Paham, bukan Lancar.

**Diputuskan Acut 20 Okt: (b)** — lembar tetap 20 soal, takaran 2–5 menit (masih di dalam rentang riset Duhon 2–5 menit). Kolom "Lembar 15 soal" di tabel hitungan di atas tidak dipakai, hanya disimpan sebagai cadangan kalau data minggu ke-4 menunjukkan anak kelas 4–6 kelelahan atau meninggalkan lembar (tanda "kelelahan" dan "ditinggalkan" di bagian 5.1).

**Kenapa dua penggantinya ini:** keduanya ada di CP Fase C dan di muatan TKA SD **[FAKTA — CP 032/2024; program TKA]**, dan bisa dijawab dengan angka bulat di papan angka (tanpa tombol koma). Contoh: "¾ = …%" dijawab 75; "KPK 4 dan 6" dijawab 12.

**Catatan kelas 2:** L2–L5 mendahului CP Fase A, yang hanya sampai "tambah dan kurang sampai 20" dan belum menyebut kali dan bagi **[FAKTA — CP 032/2024, lihat `riset-penguat.md` bagian 2]**. Usul: **dipertahankan**, sebab menyiapkan kelancaran kelas 3. Jurus L4–L5 harus mengajarkan dari nol ("kali = tambah berulang", dengan gambar). Keputusan di tangan Acut.

---

## 5. Penjaga "tidak terlalu rumit, tidak terlalu mudah"

### 5.1 Untuk tiap anak

| Tanda | Batas **[ASUMSI]** | Tindakan otomatis |
|---|---|---|
| **Terlalu mudah** | Kilat di lembar pertama level baru, atau 3 lembar berturut-turut 0 salah dan < 66% target | Naik langsung, atau tawarkan tes loncat level |
| **Terlalu rumit — tenggelam** | Salah ≥ 6 | Turun satu level (versi 5) |
| **Terlalu rumit — macet** | 4 lembar berturut-turut "tetap" tanpa kemajuan waktu | Tampilkan jurus lagi; persempit lembar ke keluarga fakta yang belum hafal (misal hanya ×7, bukan ×6 dan ×7); kabari orang tua dengan saran Mode Dampingi |
| **Ditinggalkan** | 2 lembar berturut-turut tidak diselesaikan | Lembar berikutnya dibuat lebih pendek (10 soal) dan dimulai dari soal termudah |
| **Kelelahan** | Waktu per soal di 5 soal terakhir > 2× rata-rata 5 soal pertama | Catat; bila berulang 3 hari, sarankan pindah jam latihan |

### 5.2 Untuk tiap level (dilihat Acut di panel pengelola)

| Tanda | Batas **[ASUMSI]** | Arti | Tindakan |
|---|---|---|---|
| Lembar sampai lulus | Median > 8 lembar | Level terlalu besar | Pecah jadi dua level |
| Lembar sampai lulus | > 50% anak lulus dalam 2 lembar pertama | Level terlalu kecil | Gabung dengan level berikutnya |
| Benar di lembar pertama | Median < 70% | Lompatan terlalu jauh | Tambah jurus atau level antara |
| Target waktu | > 30% anak yang benar ≥ 95% tetap lewat target | Target terlalu ketat | Naikkan target level itu |

Dengan ± 50 anak yang tersebar di 6 kelas, tiap level hanya berisi beberapa anak. **[ESTIMASI]** Penyesuaian level baru layak setelah minimal 5 anak menyelesaikan level itu.

---

## 6. Peta jenis salah

Setiap jawaban salah diberi satu kode secara otomatis. Aturannya sederhana dan bisa diperiksa.

| Kode | Arti | Cara mengenali | Kalimat di rapor orang tua |
|---|---|---|---|
| **TUKAR** | Operasi tertukar | Jawaban = hasil operasi lain dengan angka yang sama (misal 6 × 4 dijawab 10) | "Kadang tanda + dan × tertukar" |
| **SELISIH 1** | Meleset satu | Selisih jawaban dan kunci = 1 | "Masih menghitung dengan jari di beberapa soal" |
| **PULUHAN** | Salah simpan atau pinjam | Selisih = 10, atau angka satuan benar tapi puluhan salah | "Perlu latihan menyimpan puluhan" |
| **TERBALIK** | Angka terbalik | Angka jawaban kebalikan kunci (42 ↔ 24) | "Kadang menulis angka terbalik" |
| **TETANGGA** | Fakta tetangga | Jawaban = a × (b ± 1) | "×7 dan ×8 masih tertukar" |
| **LAMBAT** | Benar tapi > 2× target | Bukan salah, tetapi belum dari ingatan | "Benar, tapi masih dihitung, belum diingat" |
| **LAIN** | Tidak masuk pola | — | (tidak disebut per soal) |

Rapor menampilkan **per keluarga fakta**, bukan daftar semua salah, sebab daftar panjang mendorong orang tua mengontrol.

---

## 7. Data yang dicatat per soal

| Data | Untuk apa |
|---|---|
| Soal, kunci, jawaban, benar/salah, detik, jumlah hapus | Sama dengan versi 5 |
| Level asal soal, tanda pengulangan, tanda daya tahan | Menghitung daya tahan dan efek campuran |
| **Kode jenis salah** | Peta jenis salah |
| **Jumlah jeda dan lamanya** | Memisahkan lambat karena terganggu dari lambat karena belum hafal |
| **Mode (sendiri / didampingi)** | Celah #5 |
| **Dimulai oleh** (anak sendiri / setelah pesan orang tua / setelah pengingat) | Ukuran "belajar tanpa disuruh" untuk gerbang berbayar |

---

## 8. Ukuran keberhasilan mesin

Diambil dari `claude/metode-lancar.md` Bagian 5 (sudah ditetapkan), dihitung pada **tes tetap** (lembar 20 soal campuran level kelas, dikerjakan di hari ke-1–3 lalu tiap 4 minggu; `09-gerbang-berbayar.md` bagian 1). Tabel induk semua target ada di `06-rilis/02-angka-keberhasilan.md`.

| Ukuran | Target | Cadangan |
|---|---|---|
| Kecepatan (detik per soal) | Turun 30% | Turun 15% |
| Ketepatan | ≥ 95% | ≥ 90% |
| Daya tahan 3 minggu | ≥ 90% tetap benar | ≥ 80% |
| Hari latihan per minggu | ≥ 5 | ≥ 4 |
| Anak masih latihan di minggu ke-4 | 8 dari 10 | 6 dari 10 |

---

## 9. Keputusan Acut (19 Okt ± 21.50: semua usul disetujui)

| # | Keputusan | Usul Acut2 |
|---|---|---|
| 1 | Ganti kelas 6 L2 dan L3 dengan "pecahan ↔ persen ↔ desimal" dan "KPK dan FPB bilangan kecil" | Setuju, sebab keduanya materi SD dan TKA |
| 2 | Kelas 2 L2–L5 dipertahankan walau mendahului CP | Dipertahankan, jurus mengajar dari nol |
| 3 | Lembar Mode Dampingi tidak dihitung untuk naik level | Ya |
| 4 | Dua lembar tepat harus dari sesi berbeda (jeda ≥ 1 jam) | Ya; kilat tetap langsung naik |
| 5 | Kapan perubahan ini dipasang ke halaman yang sudah dibagikan | Perbaikan #1 (lambang bagi) dan #2 (level kelas 6) bisa ikut saat versi 5 dipasang ± 26 Okt, **kalau Acut menyetujui**; sisanya langsung di aplikasi |
