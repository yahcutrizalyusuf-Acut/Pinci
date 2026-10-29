# Rancangan Sistem — Pintar Main (versi ringan v1.4)

**Aplikasi Android keluarga untuk Matematika dan Bahasa Indonesia kelas 1–6 SD, plus Persiapan TKA kelas 6 dan Belajar Bahasa Inggris** · maskot Pinci, Si Kancil Pintar · *"Belajar dulu, main kemudian!"* (dulu Belajar Menarik, nama kerja Pandu Anak)

Versi 1.4 · 29 Oktober 2026 (memuat keputusan Acut 20 Okt, penegasan 28 Okt, keputusan 28 Okt sore, merek Pintar Main, dan keputusan 29 Okt dari perbandingan dengan Edufic) · Disusun Acut2 (Claude) bersama Acut · Sudah diperiksa pemeriksa terpisah (`pemeriksaan-akhir.md`)

**Ringkas:** (1) Dokumen ini menggabungkan seluruh rancangan Tahap 0–5 dalam satu berkas: pemahaman awal, produk, rancangan teknis, antarmuka, uji, rilis dan uang, catatan keputusan, dan hasil pemeriksaan akhir. Paket draf hukum dan riset penguat menjadi lampiran. (2) Rilis 1 dirancang tayang **22 Desember 2026** (cadangan 31 Desember), isi TKA dan kartu ilmu Matematika kelas 6 pada 4 Januari 2027, Baca Ulang + Belajar Bahasa Inggris 1 Februari, dan gerbang berbayar dievaluasi **paling cepat ± 26 April 2027**. (3) Keputusan Acut 20 dan 28 Oktober sudah masuk (kelas 6 dulu di Gudang Ilmu, paket Bahasa Inggris tingkat 3–6, guru sekolah hanya lihat + komentar); yang paling mendesak sekarang adalah nama pengendali data (Jumat 6 Nov).

Label yang dipakai di seluruh dokumen: **[FAKTA + sumber]** · **[ESTIMASI + cara hitung]** · **[ASUMSI — perlu diuji]**.

---

## Ringkasan untuk pengambil keputusan

### Apa yang dibangun

| Lapis | Isi | Rilis |
|---|---|---|
| Merek | **Pintar Main**, maskot **Pinci** (pemandu, penyemangat, penjaga waktu); aksesori Pinci dan kartu satwa sebagai kejutan acak | R1 |
| Lancar Matematika | Hitung cepat Metode LANCAR, 6 level per kelas, 2 lembar sehari (2–5 menit), tanpa kalkulator | R1 · 22 Des 2026 |
| Keluarga | Akun orang tua (email + kode), anak tanpa akun; tiga cara terlibat: Mode Dampingi, mode orang tua dari jauh, link rapor | R1 |
| Masukan | 19 pertanyaan orang tua + 5 ketukan anak, masing-masing terhubung ke satu keputusan; paling sering dua minggu sekali; Keluarga Perintis 5–10 keluarga | R1 |
| Persiapan TKA | 36 latihan rumah, 5 simulasi 75 menit, rapor penyebab salah; pendamping kelas luring dan Jalur Mandiri | Layar di R1, isi 4 Jan 2027 |
| Gudang Ilmu | Peta lengkap semua topik SD kelas 1–6 + kartu ilmu per topik (penjelasan, contoh jadi, latihan berjenjang). **Kelas 6 diisi dulu** (fokus TKA) | Peta R1; kartu kelas 6 4 Jan–1 Feb 2027; kelas lain bertahap 2027 |
| Tanda bimbingan | Tiap topik: mandiri · perlu bimbingan orang tua · perlu bimbingan guru | R1 |
| Bimbingan Guru | Diundang dan disetujui orang tua. **Guru sekolah:** lihat kemampuan + komentar ke orang tua. **Guru les:** tugas + catatan, terlihat orang tua | R3 · 22 Mar 2027 |
| Belajar Bahasa Inggris | Paket tingkat 3–6 bebas dipilih semua anak kelas 1–6: kosakata bersuara, pola kalimat, dengar lalu pilih, permainan kata; tanpa AI suara | Tingkat 3–4 R2 · 1 Feb 2027; 5–6 R3 |
| Bahasa Indonesia | Baca ulang harian dengan contoh suara dan kata per menit | R2 · 1 Feb 2027 |
| Tambahan 29 Okt | Pinci menyapa dengan nama (R1); mini try out TKA mingguan 15 menit dan "Rencana minggu ini" (R1.1); Peta Perjalanan untuk orang tua, Cerita Ulang, Ucapkan ke Bunda, Hari Pamer bulanan (R2) | R1–R2 |
| Paham Matematika | Modul kelas 4–6 untuk topik TKA | R3 · 22 Mar 2027 |

### Keputusan teknis utama

| Keputusan | Sebab |
|---|---|
| Expo (React Native) + Supabase Singapura | Bisa dipakai ulang dari proyek lain, SQL cocok untuk rapor dan gerbang; lapisan data terpisah supaya bisa pindah ke Jakarta |
| Semua latihan dibuat dan dinilai di HP; hasil diantrekan dan dikirim tanpa ganda | Sinyal di Aceh tidak selalu ada; hasil latihan tidak boleh hilang |
| Hanya isi kelas anak yang diunduh (kecuali Bahasa Inggris: tingkat yang dipilih); belajar ≤ 10 menit × kelas per hari, game 20–30 menit sesudahnya (disetujui Acut 28 Okt) | Aplikasi ringan di HP murah; waktu belajar dan main mengikuti riset |
| Data anak minimal: nama panggilan, bulan-tahun lahir, kelas | Profil risiko rendah (PP Tunas, Kepmenkomdigi 142/2026) dan UU PDP |
| Anak tidak berinteraksi dengan AI; AI hanya menulis rapor cerita untuk orang tua, dan setiap angkanya dicek kode | Panduan layanan anak; keluaran AI bisa tidak berdasar |

### Angka yang menentukan berhasil-tidaknya

Sumber induk: `06-rilis/02-angka-keberhasilan.md`.

| Ukuran | Target | Cadangan |
|---|---|---|
| Keluarga aktif di minggu ke-4 | 30 | 20 |
| Anak latihan lagi pada hari 30–36 | ≥ 60% | ≥ 45% |
| Hari latihan per minggu | ≥ 5 | ≥ 4 |
| Kecepatan tes tetap (awal → minggu ke-8) | turun 30% | turun 15% |
| Tanggapan per putaran pertanyaan | ≥ 60% | ≥ 45% |
| Gerbang berbayar: keluarga aktif "terpenuhi" (satu janji data + satu janji orang tua) | ≥ 70% | ≥ 60% |

### Uang

| Skala | Biaya per bulan | Catatan |
|---|---|---|
| Masa gratis (batas atas ± 50 keluarga) | ± Rp478 ribu (Des–Jan); ± Rp1,44 juta (Feb–Mei) | Desember–Januari hanya teknologi, sebab Acut memeriksa isi sendiri; guru mulai Februari |
| 500 keluarga | ± Rp1,44 juta | Titik impas pada Rp49 ribu: **39 keluarga membayar**; 87 kalau langganan Claude Acut ikut ditutup |
| 1.000 keluarga | ± Rp2,55 juta | Titik impas: 68 keluarga |

### Empat titik jadwal yang tidak boleh mundur

| Tanggal | Titik |
|---|---|
| Jumat 6 Nov 2026 | Nama pengendali data diputuskan (diskusi khusus 2) |
| Jumat 13 Nov 2026 | Penilaian mandiri profil risiko diajukan ke Komdigi |
| Selasa 24 Nov 2026 | Rilis uji tertutup diunggah dan 12 penguji diundang |
| Jumat 27 Nov 2026 | Pembangunan Rilis 1 selesai |

Kalau verifikasi Komdigi dihitung dalam hari kerja, profil risiko baru ± 17 Desember, dan keluarga uji masuk ± 4 Januari lewat jalur uji tertutup.

### Tiga risiko terbesar

| Risiko | Tanda awal | Penjaga |
|---|---|---|
| Pembangunan 5 minggu tidak cukup | Jumat 6 Nov Lancar + tahan putus belum jalan di HP Acut | Urutan pembangunan mendahulukan yang tidak boleh dipotong; fitur Penting dipotong lebih dulu |
| Penilaian mandiri terlambat atau profil bukan "rendah" | Pengajuan belum terkirim 13 Nov | Kertas kerja sudah menjelaskan parameter yang rawan; jawaban klarifikasi disiapkan dalam 1 hari |
| Keluarga berhenti di minggu ke-3–4 | Hari latihan < 3 per minggu; kembali hari 7–13 < 55% | Kejutan, pilihan jalur, kegiatan Dampingi mingguan, pesan "Kami dengar, kami ubah" |

### Yang perlu diputuskan sekarang

Tujuh keputusan dijawab Acut 20 Oktober (`keputusan.md` bagian B7): versi 5 sudah dipasang, A5 menjadi "gratis, dibayar dengan masukan sukarela", lembar tetap 20 soal (2–5 menit), target 30 keluarga aktif, jalur gampong hanya kontak pribadi, Acut memeriksa isi sendiri sampai Rilis 2. Tiga keputusan lagi dijawab 28 Oktober (bagian B9): batas waktu disetujui, Gudang Ilmu kelas 6 dulu + paket Belajar Bahasa Inggris Februari 2027, guru sekolah hanya lihat + komentar. Yang masih terbuka:

| # | Keputusan | Tenggat |
|---|---|---|
| 1 | Nama pengendali data dan penerbit (diskusi khusus 2) | Jumat 6 Nov |
| 2 | Guru pemeriksa isi untuk mulai Februari | Jumat 15 Jan 2027 |
| 3 | Pengajar dan tanggal pertemuan pertama kelas luring TKA | Jumat 11 Des |
| 4 | Aksen suara Bahasa Inggris (Amerika atau Inggris) | Jumat 4 Des |
| 5 | Guru Bahasa Inggris pemeriksa isi | Selasa 15 Des |
| 6 | Cek nama Pintar Main di Play Store dan PDKI (nama ikut diajukan 13 Nov) | Jumat 6 Nov |
| 7 | Paket "Siap SMP" (jembatan sesudah TKA) | Diskusi khusus berbayar, paling lambat 29 Jan 2027 |
| 8 | Unduh PDF asli Perka BSKAP 047/H/AN/2025 (kisi-kisi TKA) | Jumat 6 Nov |

Diskusi khusus 3 (ahli hukum) sebaiknya Jumat 6 Nov dan paling lambat Senin 30 Nov; diskusi khusus 1 (berbayar) paling lambat Jumat 29 Jan 2027. Semua tenggat ada di `keputusan.md` bagian J.

### Tentang versi ringan ini

Versi ringan memuat **ringkasan pengambil keputusan**, **isi lengkap 7 berkas inti** (fitur per rilis, Metode LANCAR, fitur orang tua dan anak, Gudang Ilmu dan waktu belajar, Belajar Bahasa Inggris, daftar layar, identitas merek), dan **ringkasan 3 baris** untuk semua berkas lain. Gambar alur, kerangka layar, riset penguat, dan pemeriksaan akhir dilepas. Versi lengkap: `Rancangan-Sistem-Pintar-Main.md` (± 590 KB) atau PDF v1.4 (267 halaman).

Berkas bertanda **(lengkap)** dimuat utuh; yang lain hanya ringkasannya.


# Bagian 1 — Produk


## Ringkasan Tahap 2 — Rancangan Produk

**Ringkas:** (1) Rancangan produk selesai dalam 9 berkas. Intinya: Rilis 1 (± 22 Des 2026) berisi Lancar Matematika kelas 1–6, akun keluarga dengan tiga cara orang tua terlibat, sistem masukan, dan mesin soal TKA. Isi TKA menyusul 4 Januari 2027, Baca Ulang Bahasa Indonesia 1 Februari, dan berbayar paling cepat tahun ajaran baru (Juli 2027). (2) Ada **empat keputusan besar** untuk Acut: syarat lembut (usul: tanpa menahan apa pun), game dikunci atau tidak, bentuk dan waktu berbayar, dan ganti arah latihan Bahasa Indonesia ke baca ulang. (3) Yang paling mendesak dalam dua minggu bukan menulis, tetapi tiga tindakan Acut: menyetujui cetakan isi (26 Okt), mengirim berkas TKA (31 Okt), dan menunjuk guru pemeriksa (Jumat 13 Nov).


## Profil Pengguna dan Perjalanan Pengguna

**Ringkas:** (1) Ada empat jenis pengguna: orang tua (yang nanti membayar), anak kelas 1–6 dalam tiga kelompok umur, saudara yang berbagi satu HP, dan Keluarga Perintis. (2) Perjalanan ditulis untuk enam momen (hari pertama, minggu pertama, minggu ke-8, saat ditanya, naik kelas, akhir masa gratis), terpisah untuk orang tua dan anak, dan untuk ketiga cara orang tua terlibat. (3) Titik paling rawan ada di **hari ke-3 sampai ke-10** dan **minggu ke-4**, sebab di situlah rasa baru pudar dan orang tua berhenti menyuruh.


## Daftar Fitur per Rilis (lengkap)

**Ringkas:** (1) Target tayang dipecah menjadi lima rilis kecil yang masing-masing sudah berguna, dimulai dari **Rilis 1 (tayang ± 22 Desember 2026)**: akun keluarga, Lancar Matematika kelas 1–6, tiga cara orang tua terlibat, sistem masukan, tahan putus sinyal, dan **mesin soal TKA**. (2) **Isi Persiapan TKA masuk sebagai paket isi pada 4 Januari 2027 (Rilis 1.1) tanpa rilis aplikasi baru**, sebab kelas luring mulai saat semester genap dan TKA kemungkinan April. (3) Jadwal ini ketat: kalau terlambat, yang dipotong lebih dulu adalah fitur berlabel Penting, dan kelas luring TKA tetap aman karena lembar latihan rumah PDF sudah ada.

Tahap 2, butir 3. Disusun 19 Oktober 2026. Prioritas: **W** = Wajib (tanpa ini rilis tidak berguna atau melanggar aturan) · **P** = Penting (dipotong kalau terlambat) · **N** = Nanti.

---

### 1. Peta rilis

| Rilis | Tayang (target · cadangan) | Inti | Kenapa urutannya begini |
|---|---|---|---|
| **R1 — Lancar dan Keluarga** | 22 Des 2026 · 31 Des 2026 | Akun keluarga, Lancar Matematika kelas 1–6, tiga cara orang tua, masukan v1, tahan putus sinyal, persetujuan data, mesin soal TKA; **(29 Okt)** Pinci menyapa dengan nama (suara nama dibuat sekali di server) | Metode LANCAR sudah jadi dan teruji (8.100 lembar, 0 kunci salah); keluarga uji butuh sesuatu yang berguna sejak hari pertama |
| **R1.1 — Paket Siap TKA** (paket isi, bukan rilis aplikasi) | 4 Jan 2027 · 11 Jan 2027 | 36 latihan rumah digital, 5 simulasi bertempo, **mini try out mingguan 15 menit** dan **"Rencana minggu ini"** untuk orang tua (29 Okt), rapor kesiapan TKA, **kartu Gudang Ilmu Matematika kelas 6** (ditambah 28 Okt) | Kelas luring mulai semester genap (4 Jan); TKA 2026 berlangsung akhir April **[FAKTA — Rumah Pendidikan]** |
| **R2 — Bahasa Indonesia harian** | 1 Feb 2027 · 22 Feb 2027 | Baca berulang harian kelas 1–6, Mode Dampingi "dengar bacaan", masukan v2, **kartu Gudang Ilmu Bahasa Indonesia kelas 6**, **paket Belajar Bahasa Inggris tingkat 3–4** (tingkat 5–6 menyusul 22 Mar; tanpa AI suara; ditambah 28 Okt) | Butuh teks baru untuk kelas 1–5; Ramadan mulai ± 8 Feb, jadi lebih baik tayang sebelumnya |
| **R3 — Paham Matematika** | 22 Mar 2027 · 5 Apr 2027 | Modul Paham kelas 4–6 (topik yang dipakai TKA dulu) sekaligus kartu Gudang Ilmu Matematika kelas 4–5, Bahasa Inggris tingkat 5–6, **Bimbingan Guru dengan persetujuan orang tua** (guru sekolah: lihat + komentar; guru les: tugas + catatan; ditambah 28 Okt), papan angka dan game lapangan akhir pekan | Setelah libur Idulfitri (8–19 Mar); butuh pemeriksaan guru |
| **R4 — Dunia dan naik kelas** | 14 Jun 2027 · 5 Jul 2027 | Gampong yang tumbuh, game di luar jam belajar ("waktu main" setelah inti harian, 20–30 menit, maks. 60), kartu Gudang Ilmu Matematika kelas 1–3, modul Bahasa Indonesia, paket kelas baru otomatis, rapor setahun | Harus siap sebelum tahun ajaran baru (± 12 Juli 2027) |
| **R5 — Bahasa Inggris bersuara AI** | Agustus 2027 (kalau uji suara lulus) | Ngobrol dengan AI, koreksi lembut, rapor ucapan dalam Bahasa Indonesia. Paket Belajar Bahasa Inggris tanpa AI sudah ada sejak R2 (`11-belajar-bahasa-inggris.md`) | Bahasa Inggris wajib mulai kelas 3 SD tahun ajaran 2027/2028; uji suara 5 anak dulu (Januari–Februari) |

**Gerbang berbayar** paling cepat dievaluasi ± 26 April 2027 (12 minggu setelah gelombang 3); rinciannya di `09-gerbang-berbayar.md` (usulan, menunggu diskusi berbayar).

---

### 2. Rilis 1 — Lancar dan Keluarga

#### 2.1 Fitur

| Bagian | Fitur | Prioritas |
|---|---|---|
| **Akun dan privasi** | Daftar orang tua (email + kode; nomor WhatsApp opsional untuk kabar) | W |
| | Persetujuan orang tua terpisah per tujuan (latihan, data pemakaian, masukan, rapor buatan AI) + kebijakan privasi | W |
| | Profil anak (nama panggilan, bulan dan tahun lahir, kelas, hewan profil), beberapa anak per keluarga | W |
| | Pilih profil di HP bersama + PIN anak opsional; PIN orang tua untuk Mode Dampingi | W |
| | Hubungkan HP kedua lewat kode keluarga | W |
| | Hapus akun dan unduh data (hak subjek data) | W |
| **Lancar Matematika** | Mesin LANCAR versi aplikasi: tes penempatan, layar jurus, 6 level per kelas, campur 70/30, soal salah diulang, uji daya tahan 3 minggu | W |
| | Perbaikan dari Tahap 1: lambang bagi ":", level kelas 6 L2–L3 diganti | W |
| | Suara untuk semua petunjuk dan layar jurus kelas 1–2 | W |
| | Peta jenis salah sederhana untuk rapor | P |
| | Jurus Sulap Angka (kejutan setelah lulus kelas) | N (R3) |
| **Mesin soal TKA** | Tampilan dan penilaian PG, PG kompleks, PG kategori; soal bergrup dengan bacaan; mode bertempo 75 menit dengan jeda; **layar rapor TKA (O4) dan pengawas simulasi (D7)** — semua layar TKA harus ada di aplikasi R1, sebab R1.1 hanya paket isi (diperjelas 20 Okt, `03-antarmuka/01` bagian 7) | W |
| **Orang tua [D]** | Mode Dampingi: jurus + kunci terlihat, naskah petunjuk, Tantang Ayah | W |
| **Orang tua [J]** | Beranda kabar, rapor mingguan, kirim semangat (pilihan pesan siap pakai), lihat latihan sedang berlangsung | W |
| | Memberi tugas (misal "1 lembar tambahan hari Sabtu") | P |
| **Orang tua [L]** | Halaman rapor lewat link WhatsApp, tanpa instal, link bisa dicabut | W |
| **Anak** | Kartu satwa Aceh sebagai kejutan, pilihan 2–4 jalur, rekor pribadi | P |
| | Pesan dari orang tua tampil di beranda anak | W |
| **Masukan v1** | Pertanyaan pilihan untuk orang tua sesuai jadwal 8 minggu; satu ketukan anak; data pemakaian (dengan izin) | W |
| | Pesan "Kami dengar, kami ubah" tiap 2 minggu | W |
| **Gudang Ilmu** (ditambah 28 Okt) | Peta topik lengkap semua mapel SD kelas anak, topik yang belum siap bertanda "segera" (`01-produk/10` bagian 2) | W |
| **Tanda bimbingan** (ditambah 28 Okt) | Tiga tingkat per topik: mandiri · perlu bimbingan orang tua · perlu bimbingan guru, dengan kabar ke orang tua dan ringkasan untuk guru (`01-produk/10` bagian 3) | W |
| **Waktu belajar** (ditambah 28 Okt) | Batas belajar per hari 10 menit × kelas, blok ≤ 15 menit dengan jeda, inti harian singkat (`01-produk/10` bagian 5) | W |
| **Tahan putus sinyal** | Semua latihan jalan tanpa sinyal; hasil antre di HP; tanda "belum terkirim" yang jelas; kirim ulang otomatis tanpa ganda | W |
| **Pengelola (Acut)** | Panel di HP: ringkasan pemakaian, jawaban masukan, ubah jadwal pertanyaan, pasang paket isi | W |
| **Aturan** | Penilaian mandiri PP Tunas dan penilaian dampak selesai **sebelum** keluarga uji memakai | W |

#### 2.2 Yang sengaja tidak ada di Rilis 1

| Tidak ada | Sebab |
|---|---|
| Jalur buku + foto | Keputusan Acut 19 Okt: layar dulu |
| Bahasa Indonesia | Teks kelas 1–5 belum ada |
| Modul Paham | Butuh pemeriksaan guru |
| Game di luar jam belajar, Gampong penuh | Paling mahal dibangun; buktinya untuk hasil belajar lemah; risiko dianggap teknik dorongan |
| Obrolan bebas | Menaikkan profil risiko PP Tunas; pesan orang tua–anak berupa pilihan siap pakai + teks pendek dari orang tua |
| Pembayaran | Masa gratis |

---

### 3. Di mana Persiapan TKA masuk, dan kenapa

| Pilihan | Untung | Rugi | Putusan |
|---|---|---|---|
| TKA penuh di R1 | Satu kali rilis | Menambah beban 5 minggu pembangunan yang sudah ketat | ✗ |
| **Mesin soal TKA di R1, isi di R1.1 (4 Jan) sebagai paket isi** | Kelas luring dan isi TKA tidak menunggu rilis aplikasi; isi bisa diperbaiki tanpa uji ulang Play Store | Mesin soal TKA harus jadi di R1 walau belum dipakai | **✓ Diusulkan**, sebab paket isi per kelas memang sudah diputuskan bisa diperbarui tanpa rilis baru |
| TKA di R3 (Maret) | Lebih longgar | Terlalu dekat dengan TKA April; tidak mendampingi kelas luring sejak awal | ✗ |

**Cadangan kalau R1 terlambat:** kelas luring tetap jalan dengan lembar latihan rumah PDF yang sudah ada (29 lembar, `06-siap-pakai/lembar-kerja-anak/`). Aplikasi menyusul tanpa mengganggu kelas.

---

### 4. Rilis 2–5 — ringkas

| Rilis | Fitur W | Fitur P | Fitur N |
|---|---|---|---|
| **R2** | Baca berulang harian kelas 1–6 (bacaan bersuara untuk kelas 1–2); kata per menit; 2 pertanyaan pemahaman; Mode Dampingi "dengar bacaan"; **Belajar Bahasa Inggris tingkat 3–4** (kosakata bersuara, pola kalimat, dengar lalu pilih, permainan kata); **(29 Okt)** Peta Perjalanan untuk orang tua; Cerita Ulang dan Ucapkan ke Bunda di Mode Dampingi; Hari Pamer bulanan | Peta kata sulit; masukan v2 (pertanyaan dipicu kejadian) | Rekaman Dengar Bedanya (butuh izin khusus) |
| **R3** | Modul Paham kelas 4–6 untuk topik TKA (pecahan, KPK/FPB, pengukuran, data); model batang | Papan angka dan ular tangga cetak; survei game lapangan akhir pekan | Jurus Sulap Angka |
| **R4** | Paket kelas baru otomatis; rapor setahun; modul Bahasa Indonesia kelas 3–6 | Gampong yang tumbuh; game di luar jam belajar dengan batas waktu | ~~Hari Pamer bersuara~~ (dimajukan ke R2, 29 Okt) |
| **R5** | Ngobrol Bahasa Inggris dengan AI (topik terkunci), rapor ucapan dalam Bahasa Indonesia | Perintah gerak Bahasa Inggris | — |

---

### 5. Aturan memotong kalau terlambat

1. **Yang tidak pernah dipotong:** persetujuan data dan penilaian mandiri, tahan putus sinyal, mesin LANCAR, akun keluarga, sistem masukan, mesin soal TKA. Sebab tanpa itu rilis melanggar aturan, kehilangan data seperti 17–18 Oktober, atau tidak menghasilkan masukan.
2. **Dipotong lebih dulu:** fitur P (kartu satwa, memberi tugas, peta jenis salah) → pindah ke rilis berikutnya.
3. **Tanggal tayang R1 boleh mundur sampai 31 Desember**; lebih dari itu, keluarga uji mulai bertahap mulai 4 Januari dengan keluarga yang sudah siap.

**[ASUMSI — dihitung di Tahap 5]** Jadwal R1 hanya mungkin kalau rancangan Tahap 3–5 selesai paling lambat akhir Oktober dan pembangunan berjalan ± 5 minggu (27 Okt–27 Nov), lalu uji tertutup sejak unggah Selasa 24 Nov (`06-rilis/04`).


## Rencana Isi — Siapa Membuat Apa, Kapan, dan Berapa Biayanya

**Ringkas:** (1) Isi tahun pertama dibuat dengan tiga cara: **buatan mesin** (soal Lancar, tangga suku kata), **disusun AI lalu diperiksa mesin dan guru** (teks bacaan, layar jurus, modul Paham), dan **bahan TKA yang sudah ada** dipindahkan ke HP tanpa diketik ulang. (2) Sampai Mei 2027 dibutuhkan ± **114 jam guru pemeriksa (± Rp5,7 juta; cadangan Rp8,5 juta)**, dibayar **per butir/topik** sesuai keputusan 19 Okt, dan biaya AI ± Rp330 ribu, sebab pekerjaan terbesar adalah memeriksa 252 teks bacaan, bukan menulisnya. (3) Yang paling mendesak bukan menulis, tetapi dua hal yang menunggu Acut: **berkas TKA dari laptop paling lambat 31 Oktober**, dan pemeriksaan isi oleh **Acut sendiri sampai Rilis 2** (keputusan 20 Okt); guru pemeriksa dipilih paling lambat Jumat 15 Januari 2027 dan mulai bekerja Februari (bagian 6.2a).


## Mesin Belajar Metode LANCAR — Versi Aplikasi (lengkap)

**Ringkas:** (1) Purwarupa versi 5 dipertahankan sebagai inti, sebab sudah lolos 8.100 lembar uji otomatis dengan 0 kunci salah, dan sebagian besar aturannya sudah sesuai Metode LANCAR. (2) Ada 12 celah yang ditutup di versi aplikasi. Yang terbesar: dua level kelas 6 di luar materi SD, belum ada penyelipan fakta baru secara bertahap, belum ada penjaga "terlalu rumit / terlalu mudah" selain turun level, dan lembar yang dikerjakan bersama orang tua ikut dihitung untuk naik level. (3) Semua angka ambang di sini adalah **[ASUMSI]** awal yang dikalibrasi ulang dari data minggu ke-4.

Tahap 2, butir 5. Disusun 19 Oktober 2026. Dasar: `bahan/latihan-v5-lancar.html`, `claude/metode-lancar.md`, `rancangan/01-produk/riset-penguat.md`.

---

### 1. Yang dipertahankan dari versi 5

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

### 2. Celah di versi 5 dan perbaikannya

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

### 3. Aturan lengkap versi aplikasi

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

### 4. Level per kelas — usulan revisi

Yang berubah dari versi 4/5 ditandai **tebal**.

| Kelas | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| 1 | Tambah sampai 10 | Kurang sampai 10 | Belasan (13 + 5) | Tambah sampai 20 | Kurang sampai 20 | Campur |
| 2 | Puluhan (30 + 40) | 2 angka + 1 angka | 2 angka − 1 angka | ×2 ×5 ×10 | :2 :5 :10 | Campur |
| 3 | ×3 ×4 | ×6 ×7 | ×8 ×9 | Bagi dari tabel (56 : 7) | Tambah/kurang 2 angka | Campur kali bagi |
| 4 | Pemanasan tabel | Kali puluhan/ratusan | 2 angka × 1 angka, hasil ≤ 150 | Bagi hasil belasan | Ratusan | Campur |
| 5 | **2 angka × 1 angka, hasil ≤ 200** (diturunkan 20 Okt dari ≤ 400) | Bagi puluhan | ×11 dan ×25 | Kuadrat ≤ 15 | ½ ¼ ⅓ ¾ dari bilangan | Campur |
| 6 | Kuadrat dan akar ≤ 15 | **Pecahan ↔ persen ↔ desimal setara** (½ = …%, 0,4 = …%) | **KPK dan FPB bilangan kecil** (KPK 4 dan 6; FPB 12 dan 18) | Persen mudah (25% dari 80) | Urutan operasi | Campur |

#### 4.1 Target detik per soal dan lama latihan harian (ditambah 20 Okt)

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

### 5. Penjaga "tidak terlalu rumit, tidak terlalu mudah"

#### 5.1 Untuk tiap anak

| Tanda | Batas **[ASUMSI]** | Tindakan otomatis |
|---|---|---|
| **Terlalu mudah** | Kilat di lembar pertama level baru, atau 3 lembar berturut-turut 0 salah dan < 66% target | Naik langsung, atau tawarkan tes loncat level |
| **Terlalu rumit — tenggelam** | Salah ≥ 6 | Turun satu level (versi 5) |
| **Terlalu rumit — macet** | 4 lembar berturut-turut "tetap" tanpa kemajuan waktu | Tampilkan jurus lagi; persempit lembar ke keluarga fakta yang belum hafal (misal hanya ×7, bukan ×6 dan ×7); kabari orang tua dengan saran Mode Dampingi |
| **Ditinggalkan** | 2 lembar berturut-turut tidak diselesaikan | Lembar berikutnya dibuat lebih pendek (10 soal) dan dimulai dari soal termudah |
| **Kelelahan** | Waktu per soal di 5 soal terakhir > 2× rata-rata 5 soal pertama | Catat; bila berulang 3 hari, sarankan pindah jam latihan |

#### 5.2 Untuk tiap level (dilihat Acut di panel pengelola)

| Tanda | Batas **[ASUMSI]** | Arti | Tindakan |
|---|---|---|---|
| Lembar sampai lulus | Median > 8 lembar | Level terlalu besar | Pecah jadi dua level |
| Lembar sampai lulus | > 50% anak lulus dalam 2 lembar pertama | Level terlalu kecil | Gabung dengan level berikutnya |
| Benar di lembar pertama | Median < 70% | Lompatan terlalu jauh | Tambah jurus atau level antara |
| Target waktu | > 30% anak yang benar ≥ 95% tetap lewat target | Target terlalu ketat | Naikkan target level itu |

Dengan ± 50 anak yang tersebar di 6 kelas, tiap level hanya berisi beberapa anak. **[ESTIMASI]** Penyesuaian level baru layak setelah minimal 5 anak menyelesaikan level itu.

---

### 6. Peta jenis salah

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

### 7. Data yang dicatat per soal

| Data | Untuk apa |
|---|---|
| Soal, kunci, jawaban, benar/salah, detik, jumlah hapus | Sama dengan versi 5 |
| Level asal soal, tanda pengulangan, tanda daya tahan | Menghitung daya tahan dan efek campuran |
| **Kode jenis salah** | Peta jenis salah |
| **Jumlah jeda dan lamanya** | Memisahkan lambat karena terganggu dari lambat karena belum hafal |
| **Mode (sendiri / didampingi)** | Celah #5 |
| **Dimulai oleh** (anak sendiri / setelah pesan orang tua / setelah pengingat) | Ukuran "belajar tanpa disuruh" untuk gerbang berbayar |

---

### 8. Ukuran keberhasilan mesin

Diambil dari `claude/metode-lancar.md` Bagian 5 (sudah ditetapkan), dihitung pada **tes tetap** (lembar 20 soal campuran level kelas, dikerjakan di hari ke-1–3 lalu tiap 4 minggu; `09-gerbang-berbayar.md` bagian 1). Tabel induk semua target ada di `06-rilis/02-angka-keberhasilan.md`.

| Ukuran | Target | Cadangan |
|---|---|---|
| Kecepatan (detik per soal) | Turun 30% | Turun 15% |
| Ketepatan | ≥ 95% | ≥ 90% |
| Daya tahan 3 minggu | ≥ 90% tetap benar | ≥ 80% |
| Hari latihan per minggu | ≥ 5 | ≥ 4 |
| Anak masih latihan di minggu ke-4 | 8 dari 10 | 6 dari 10 |

---

### 9. Keputusan Acut (19 Okt ± 21.50: semua usul disetujui)

| # | Keputusan | Usul Acut2 |
|---|---|---|
| 1 | Ganti kelas 6 L2 dan L3 dengan "pecahan ↔ persen ↔ desimal" dan "KPK dan FPB bilangan kecil" | Setuju, sebab keduanya materi SD dan TKA |
| 2 | Kelas 2 L2–L5 dipertahankan walau mendahului CP | Dipertahankan, jurus mengajar dari nol |
| 3 | Lembar Mode Dampingi tidak dihitung untuk naik level | Ya |
| 4 | Dua lembar tepat harus dari sesi berbeda (jeda ≥ 1 jam) | Ya; kilat tetap langsung naik |
| 5 | Kapan perubahan ini dipasang ke halaman yang sudah dibagikan | Perbaikan #1 (lambang bagi) dan #2 (level kelas 6) bisa ikut saat versi 5 dipasang ± 26 Okt, **kalau Acut menyetujui**; sisanya langsung di aplikasi |


## Latihan Harian Bahasa Indonesia — "Baca Ulang"

**Ringkas:** (1) Latihan harian Bahasa Indonesia adalah **baca ulang**: anak membaca teks pendek, mendengar contoh bacaan, membaca lagi, lalu menjawab pertanyaan. Kata per menit dicatat. Cara ini dipilih karena buktinya paling kuat (efek 0,75 untuk kelancaran dan 0,73 untuk pemahaman). (2) Kecepatan harian diukur dengan anak menekan tombol mulai dan selesai sendiri. **Angka rapor untuk semua keluarga adalah bacaan dingin dengan tombol** (hasil yang ditandai curang dibuang); **Dengar Bacaan** orang tua di Mode Dampingi seminggu sekali menjadi penguat yang lebih tepat (kata *benar* per menit), sebab mendampingi adalah pilihan dan sebagian besar keluarga tidak mendampingi (diubah 20 Okt). Tidak perlu AI suara dan tidak ada rekaman suara anak. (3) Celah terbesar: anak bisa menekan "selesai" tanpa membaca, dan kelas 1 di semester 2 sebagian belum bisa membaca. Keduanya punya penjaga di bagian 6 dan 4.


## Persiapan TKA Kelas 6 di Aplikasi

**Ringkas:** (1) TKA di aplikasi melayani **dua kelompok**: murid kelas luring (aplikasi menjadi pendamping kelas: latihan rumah, simulasi bertempo, rapor kesiapan) dan anak kelas 6 di luar kelas luring (**Jalur Mandiri**: 36 topik yang sama, dipelajari sendiri dengan kunci berjenjang). (2) Bahan tidak diketik ulang: berkas Markdown modul sudah berformat baku yang bisa dibaca mesin, sehingga ± 1.050 butir diubah otomatis menjadi data dan diperiksa ulang kuncinya. Mesin soal masuk Rilis 1, isinya masuk 4 Januari 2027 sebagai paket isi. (3) Pembeda terbesar adalah **rapor penyebab salah**: setiap pengecoh di bahan TKA sudah punya nama salah paham, jadi aplikasi bisa memberi tahu orang tua *kenapa* anak salah (salah baca, salah hitung, salah paham, atau kehabisan waktu), bukan hanya skornya.


## Fitur Orang Tua dan Fitur Anak (lengkap)

**Ringkas:** (1) Fitur orang tua dibangun di atas dua bukti: keterlibatan yang berupa **kegiatan singkat terarah dan pesan positif** menaikkan hasil (+4 bulan), sedangkan **membantu PR dan mengontrol tidak** atau bahkan merusak. Karena itu Mode Dampingi berupa satu kegiatan ± 10 menit seminggu, mode jauh berisi kabar positif dan satu langkah berikutnya, dan tidak ada fitur "bantu PR". (2) Fitur anak bertumpu pada rasa mampu, pilihan 2–4 jalur, dan **kejutan yang tidak dijanjikan**. Tidak ada rangkaian hari beruntun, papan peringkat, notifikasi ke anak, toko, atau obrolan bebas, sebab semuanya berisiko dianggap teknik dorongan yang dilarang PP Tunas atau terbukti merusak minat. (3) Satu keputusan besar untuk Acut: **apakah game di luar jam belajar dikunci sampai latihan selesai**. Usul Acut2: tidak dikunci, tetapi diberi batas waktu harian yang diatur orang tua.

Tahap 2, butir 8–9. Disusun 19 Oktober 2026. Kode cara terlibat: **[D]** Mode Dampingi · **[J]** mode orang tua dari jauh · **[L]** link rapor WhatsApp. Prioritas: **W** Wajib · **P** Penting · **N** Nanti.

---

### 1. Prinsip yang mengikat semua fitur

| Prinsip | Sebab |
|---|---|
| Orang tua diberi **strategi dan pesan positif**, bukan daftar kesalahan | Bentuk keterlibatan yang terbukti (+4 bulan) **[FAKTA — EEF Toolkit]** |
| Kegiatan bersama **± sekali seminggu** | Sekali seminggu sudah cukup; dua kali atau lebih tidak menambah banyak **[FAKTA — Berkowitz dkk. 2015]** |
| **Tidak ada fitur bantu PR sekolah** | Melibatkan orang tua dalam PR umumnya tidak menaikkan hasil **[FAKTA — EEF Toolkit]** |
| Rapor tidak mendorong orang tua mengontrol | Mengontrol −0,153; dukungan otonomi +0,133 **[FAKTA — `bahan/riset-metode-belajar.md`]** |
| Hadiah untuk anak selalu **kejutan** | Hadiah yang dijanjikan merusak minat anak −0,43; kejutan ≈ 0 **[FAKTA — Deci, Koestner & Ryan 2001]** |
| Anak memilih dari **2–4 jalur** | Paling kuat pada anak, dengan 2–4 pilihan **[FAKTA — Patall dkk. 2008]** |
| Pesan hanya di dalam keluarga; tanpa iklan, lokasi, profiling, teknik dorongan | Supaya profil risiko PP Tunas tetap **rendah** (syarat untuk anak < 13 tahun) **[FAKTA — `riset-penguat.md` bagian 9]** |
| Anak tidak pernah diberi tahu soal uang | Anak tidak boleh dijadikan alat menekan orang tua (kasus Prodigy, `01-profil-dan-perjalanan.md` 2.6) |

---

### 2. Fitur orang tua

#### 2.1 Peta fitur per cara terlibat

| Kebutuhan | [D] Mode Dampingi (HP anak, PIN orang tua) | [J] Mode orang tua (HP orang tua) | [L] Link rapor (tanpa instal) | Rilis · prioritas |
|---|---|---|---|---|
| **Memantau** | — | Beranda kabar: sudah/belum latihan hari ini, rekor, satu langkah berikutnya | Rapor satu layar | R1 · W |
| **Memantau langsung** | — | Status "sedang latihan · Level 3 · soal 12 dari 20" (tanpa benar/salah per soal) | — | R1 · P |
| **Memeriksa** | Jurus dan kunci terlihat; tombol "petunjuk untuk diucapkan" | Rapor mingguan; peta jenis salah per keluarga fakta; rapor TKA (B/H/S/W) | Rapor mingguan | R1 · W (peta jenis salah: P) |
| **Memberi tugas** | — | Ajakan siap pakai, paling banyak 1 per hari | — | R1 · P |
| **Berkomunikasi** | Bicara langsung | Kirim semangat (pilihan siap pakai + teks ≤ 60 huruf); terima pesan anak | — | R1 · W |
| **Kegiatan bersama** | Tantang Ayah (R1), Dengar Bacaan (R2), **Cerita Ulang dan Ucapkan ke Bunda (R2, 29 Okt)**, Soal Cerita Bersama (R3), Pengawas Simulasi TKA (R1.1) | Jadwalkan kegiatan Dampingi | — | Sesuai rilis · W |
| **Kejutan** | Hari Pamer bulanan (**R2**, dimajukan 29 Okt) | Kabar "lulus level" dan "masih ingat setelah 3 minggu"; rapor "Satu tahun bersama" (R4) | Sama, versi singkat | R1 · W |
| **Game lapangan akhir pekan** | Dimainkan bersama | Survei pilihan: game mana Sabtu ini | — | R3 · P |
| **Rapor ke WhatsApp** | — | Tombol "kirim ke WhatsApp": gambar rapor atau link | Link itu sendiri | R1 · W (gambar: P) |
| **Pengaturan** | Batas waktu game, jam tenang | Sama + PIN, cabut link, persetujuan data | — | R1 · W |

#### 2.2 Mode Dampingi [D]

| Hal | Aturan |
|---|---|
| Masuk | Tombol kecil di layar anak → PIN orang tua 4 angka; keluar otomatis setelah 15 menit tanpa sentuhan. **Pengawas Simulasi bukan bagian Mode Dampingi** (lihat tabel kegiatan di bawah), sebab simulasi 75 menit tanpa sentuhan orang tua |
| Yang terlihat | Jurus level ini, kunci soal, **naskah kegiatan** di atas layar ("Ucapkan ini… Tanyakan ini… Jangan beri jawabannya") |
| Petunjuk untuk diucapkan | Satu tombol per soal: menampilkan satu kalimat pancingan, bukan jawaban (misal "Coba genapkan ke 10 dulu") |
| Hitungan | Lembar di Mode Dampingi **tidak dihitung untuk naik level** (`04-mesin-lancar.md` celah #5) |
| Jadwal | Disarankan sekali seminggu; aplikasi mengingatkan **orang tua** (bukan anak) di hari yang dipilih |

**Kegiatan Dampingi**

| Kegiatan | Isi | Lama | Kenapa |
|---|---|---|---|
| **Tantang Ayah** | Anak memilih 10 soal dari level yang **sudah ia lulus**; anak dan ayah/bunda bergantian menjawab; anak biasanya menang | ± 10 menit | Rasa mampu; orang tua melihat kemampuan anak tanpa menguji |
| **Dengar Bacaan** | Orang tua mendengar anak membaca dan mengetuk kata yang salah (`05-bahasa-indonesia.md` bagian 5) | ± 3–5 menit | Angka resmi kata per menit; tanpa rekaman suara |
| **Soal Cerita Bersama** | Satu soal cerita dari topik Paham; naskah tanya-jawab untuk orang tua | ± 10 menit | Pola aplikasi orang tua–anak Berkowitz (sekali seminggu) |
| **Pengawas Simulasi** (bukan Mode Dampingi) | Orang tua memasukkan PIN sekali di awal sebagai tanda "diawasi", lalu memastikan suasana tenang. HP anak menjalankan simulasi tanpa batas diam; HP orang tua (kalau berbeda) hanya menampilkan sisa waktu dan nomor soal, tanpa kunci (layar D7) | 75 menit | `06-persiapan-tka.md` bagian 6 |

#### 2.3 Mode orang tua dari jauh [J]

| Fitur | Isi | Batas yang sengaja dipasang |
|---|---|---|
| **Beranda kabar** | Satu kartu per anak: hari ini sudah/belum, rekor terbaru, **satu langkah berikutnya** ("Minggu ini ×7 mulai lancar. Coba Tantang Ayah Sabtu.") | Tidak menampilkan daftar soal salah di beranda |
| **Kirim semangat** | ± 40 pesan siap pakai ("Ayah bangga kamu tidak menyerah di ×8") + teks pendek ≤ 60 huruf | Pesan siap pakai menonjolkan **usaha**, bukan kecepatan; teks bebas tidak bisa berisi link atau nomor HP. **Kelas 1–2:** pesan siap pakai dibacakan dengan suara yang sudah ada di paket; teks bebas tampil dengan ikon "🔊 minta Ayah/Bunda membacakan", sebab aplikasi tidak punya mesin suara saat berjalan dan suara bawaan HP murah sering tanpa Bahasa Indonesia (`03-rencana-isi.md` bagian 5) |
| **Ajakan (memberi tugas)** | Pilihan siap: 1 lembar tambahan · baca ulang teks kemarin · Tantang Ayah hari Sabtu · ulang satu topik TKA | Paling banyak 1 ajakan per hari; ajakan **tidak pernah mengunci** apa pun; di layar anak tampil sebagai "Ajakan dari Ayah" |
| **Pengingat untuk orang tua** | Orang tua memilih jam pengingat (misal 16.30) | Pengingat dikirim ke **HP orang tua**, tidak pernah ke anak |
| **Kabar kejadian** | Lulus level; uji daya tahan "masih ingat"; 2 hari tidak latihan (ajakan lembut); anak menekan "Bantu aku" | Paling banyak 1 kabar per hari, kecuali "Bantu aku" |
| **Rapor mingguan** | Lihat 2.5 | — |

**Pesan dari anak ke orang tua:** anak memilih dari 6 stiker pesan ("Aku lulus level!", "Lihat rekorku", "Bantu aku dong", "Terima kasih, Ayah", "Aku capek hari ini", "Ayo Tantang Ayah"). "Bantu aku dong" mengirim kabar ke orang tua beserta saran Mode Dampingi untuk soal yang macet. **Tidak ada ketik bebas dari anak**, sebab obrolan bebas menaikkan profil risiko dan pesan anak cukup berupa pilihan.

#### 2.4 Link rapor [L]

| Hal | Aturan |
|---|---|
| Bentuk | Halaman web satu layar, terbuka tanpa instal dan tanpa kata sandi |
| Link | Unik per anak, panjang dan tidak bisa ditebak; **bisa dicabut** orang tua kapan saja; berlaku 90 hari lalu diperbarui otomatis di mode orang tua **[ASUMSI — dinilai di Tahap 3]** |
| Isi | Nama panggilan dan hewan profil saja; tanpa foto, nama sekolah, tanggal lahir |
| Risiko dan penjaganya | Link diteruskan ke grup WhatsApp sehingga rapor terbaca orang luar → tujuan "rapor lewat link" punya persetujuan tersendiri, ada peringatan "link ini hanya untuk keluarga", dan link bisa dicabut |
| Jalan naik | Di bawah rapor: "Ingin melihat anak latihan dan mengirim semangat? Pasang aplikasinya" — sebab orang tua tidak boleh hanya lewat link (koreksi Acut 19 Okt) |

#### 2.5 Isi rapor mingguan

| Bagian | Isi | Sebab |
|---|---|---|
| Tiga angka | Hari latihan · kecepatan **pada keluarga fakta yang sama** (misal ×6 dan ×7, detik per soal) · ketepatan (% benar), dibanding minggu lalu dan saat keluarga fakta itu pertama dilatih | Kemajuan terukur adalah yang paling diutamakan orang tua. **Diubah 20 Okt:** rata-rata detik per soal dari semua lembar tidak setara antarlevel, jadi rapor akan terlihat memburuk saat anak naik level |
| Grafik utama | Waktu **tes tetap** (setiap 4 minggu, susunan sama; `09-gerbang-berbayar.md` bagian 1) | Satu-satunya angka yang setara dari awal sampai akhir |
| Satu kalimat kemajuan | "Kecepatan ×6 dan ×7 naik dari 5,1 ke 3,4 detik per soal" | Pesan positif personal; selalu menyebut keluarga fakta yang dibandingkan |
| Satu langkah berikutnya | "Minggu depan ×8 dikenalkan" | Pesan positif = keberhasilan + langkah berikutnya **[FAKTA — EEF]** |
| Satu cara membantu tanpa mengambil alih | "Kalau ia ragu, tanyakan 'jurus apa yang cocok?', jangan sebut jawabannya" | Mencegah orang tua mengontrol |
| Baca Ulang (mulai R2) | Kata per menit bacaan dingin dengan tombol (semua keluarga); kata benar per menit dari Dengar Bacaan kalau orang tua mendampingi, atau tulisan "belum diukur orang tua" kalau tidak | `05-bahasa-indonesia.md` |
| TKA (kelas 6) | Peta 36 topik, penyebab salah B/H/S/W | `06-persiapan-tka.md` |
| Latihan yang dimulai anak sendiri | "4 dari 9 latihan minggu ini dimulai Aisyah sendiri" | Ukuran semangat belajar untuk gerbang berbayar |

**Rapor cerita buatan AI** (P, R1): kalimat disusun dari angka di basis data, angka di kalimat diperiksa ulang oleh kode, dan diberi tanda "ditulis dengan bantuan AI", sebab ± seperempat kalimat umpan balik AI bisa tidak berdasar **[FAKTA — EDM 2024]**. Kalau persetujuan "rapor buatan AI" tidak diberikan, rapor memakai kalimat cetakan biasa **dengan isi angka yang sama** (tidak diturunkan mutunya, PP 33/2026 Ps. 35(1)).

#### 2.6 Game lapangan akhir pekan (R3)

Setelah anak menyelesaikan 5–10 sesi, orang tua menerima satu pertanyaan pilihan pada hari Kamis: "Mau main apa Sabtu ini?" dengan 3 pilihan yang disusun dari materi yang **sudah** dilatih anak.

| Contoh game | Materi | Bahan |
|---|---|---|
| Belanja Pasar | Tambah, kurang, uang kembalian | Uang mainan atau uang asli |
| Lompat Garis Bilangan | Tambah/kurang, kelipatan | Kapur di lantai, angka berurutan lurus (papan lurus, bukan melingkar **[FAKTA — Siegler & Ramani]**) |
| Berburu Angka di Jalan | Jumlah angka pelat nomor, ×2 ×5 | Perjalanan naik motor atau labi-labi |
| Tebak Jam | Waktu, durasi | Jam dinding |
| Detektif Kata | Kata dari teks Baca Ulang minggu ini | Teks di aplikasi |

Aplikasi memberi petunjuk satu layar, lalu Senin menanyakan satu ketukan: "Jadi dimainkan? Seru / Biasa / Tidak sempat". Jawabannya menentukan game yang ditawarkan berikutnya.

---

### 3. Fitur anak

#### 3.1 Peta fitur

| Fitur | Isi | Rilis · prioritas |
|---|---|---|
| **Beranda anak** | Pesan dari orang tua (dibacakan untuk kelas 1–2), pilihan jalur hari ini, album kartu | R1 · W |
| **Pilihan 2–4 jalur** | "Mau mulai dari mana?" Lancar · Baca Ulang · Ajakan Ayah · Tantangan (setelah R3) | R1 · P |
| **Rekor pribadi** | Rekor waktu per level; "Tadi 62, sekarang 81" | R1 · W |
| **Kartu satwa Aceh** | Muncul **kadang-kadang, acak** (± 1 dari 3 kejadian penguasaan: lulus level, lulus uji daya tahan, naik tingkat teks) | R1 · P |
| **Tombol "Bantu aku"** | Mengirim kabar ke orang tua (2.3) | R1 · W |
| **Satu ketukan perasaan** | Seperti permainan; rinci di `08-sistem-masukan.md` | R1 · W |
| **Jurus Sulap Angka** | Sifat bilangan (×11, ×25, ×5, ×9 dengan jari) terbuka sebagai kejutan setelah lulus level kelas | R3 · P |
| **Gampong yang tumbuh** | Dunia anak tumbuh dari **penguasaan** | R4 · P |
| **Game di luar jam belajar** | Lihat 3.4 | R4 · P |

#### 3.2 Kartu satwa Aceh

| Aturan | Sebab |
|---|---|
| Muncul secara acak di sekitar **1 dari 3 kejadian penguasaan** (lulus level, lulus uji daya tahan, naik tingkat teks); tidak ada tulisan "lulus = kartu" (diubah 20 Okt: versi lama ± 1 kartu per level, sehingga anak cepat belajar bahwa lulus selalu berarti kartu) | Hadiah tak terduga tidak merusak minat (0,01); hadiah yang dijanjikan merusak minat anak (−0,43) **[FAKTA — Deci, Koestner & Ryan 2001]** |
| Setiap kartu unik, **tanpa tingkat kelangkaan**, tanpa tukar-menukar, tanpa beli | Kelangkaan acak mirip undian; jual-beli = eksploitasi anak sebagai konsumen (dimensi risiko Permenkomdigi 9/2026) |
| Setiap kartu memuat satu fakta singkat tentang satwa itu (gajah sumatra, rangkong, penyu belimbing, dan lain-lain) | Kartu ikut menjadi bacaan pendek |
| ± 36 kartu tahun pertama **[ASUMSI]** | Kejadian penguasaan setahun ± 36 level + ± 20 uji daya tahan + naik tingkat teks ≈ 60–100; sepertiganya ≈ 20–35 kartu **[ESTIMASI]** |

**Ditambah 28 Okt (merek Pintar Main):** kejutan kini bergantian antara **kartu satwa** dan **aksesori Pinci** (topi, syal, ransel berwarna lain), dengan aturan yang sama: acak ± 1 dari 3 kejadian penguasaan, tanpa poin, tanpa toko, tanpa kelangkaan. Bintang hanya tanda selesai satu lembar atau unit, sama untuk semua anak, tidak bisa ditukar (`03-antarmuka/04-identitas-merek.md` bagian 2).

#### 3.3 Gampong yang tumbuh (R4)

| Aturan | Sebab |
|---|---|
| Bangunan baru muncul dari kejadian **penguasaan** (lulus level, masih ingat setelah 3 minggu, naik tingkat teks) | Tumbuh karena kemampuan, bukan karena rajin membuka aplikasi |
| **Tidak pernah layu, mundur, atau hilang** saat anak tidak latihan | Ancaman kehilangan adalah teknik dorongan **[ASUMSI — `riset-penguat.md` bagian 9: daftar resmi belum ada]** |
| Anak memilih di mana bangunan diletakkan (2–4 pilihan) | Pilihan = pengungkit motivasi |
| Tidak bisa dikunjungi anak lain | Tanpa kontak dengan orang di luar keluarga |

#### 3.4 Game di luar jam belajar (R4)

| Hal | Usul |
|---|---|
| Arti | Permainan yang memakai kemampuan yang sudah dilatih: Pasar Gampong (hitung uang), Ular Tangga Lurus 1–100, Susun Kubus (tampak atas/depan/samping), Tebak Kata |
| Batas waktu | **Diubah 28 Okt berdasarkan riset:** bawaan kelas 1–2 **20 menit**, kelas 3–6 **30 menit** per hari; orang tua bisa mengubah 0–60 menit, tidak lebih (`10-gudang-ilmu-bimbingan-dan-waktu.md` bagian 5) |
| Jam tenang | Orang tua bisa mematikan game pada jam tertentu (bawaan: setelah 21.00) |
| Akhir sesi | Game berhenti di akhir babak dengan "Cukup untuk hari ini, sampai besok" — tanpa "satu babak lagi", tanpa putar otomatis |
| Hubungan dengan latihan | Lihat pilihan di bawah |

**Keputusan untuk Acut: apakah game dikunci sampai latihan selesai?**

| Pilihan | Untung | Rugi |
|---|---|---|
| **A. Game terbuka setelah latihan harian selesai** | Orang tua senang: latihan dulu, main kemudian | Game menjadi hadiah yang dijanjikan atas tugas (−0,44 pada hadiah berwujud **[FAKTA — Deci dkk. 2001]**; untuk hadiah maya belum ada data); anak bisa terburu-buru menyelesaikan latihan |
| **B. Game selalu terbuka dengan batas waktu** | Tidak mengikat latihan dengan hadiah | Sebagian anak main dulu dan tidak latihan |
| **C. Bawaan B, orang tua boleh memilih A** (usul) | Orang tua yang memutuskan; data kedua kelompok bisa dibandingkan | Pengaturan bertambah satu |

**Diputuskan Acut 19 Okt: C.** Usul Acut2 semula **C**, sebab buktinya belum cukup untuk melarang A, dan pilihan orang tua sekaligus menjadi data. Bandingkan "latihan yang dimulai anak sendiri" pada kedua kelompok setelah 4 minggu.

**Diubah Acut 28 Okt: bawaan menjadi A** (game tampil sebagai "Waktu main" setelah inti harian selesai), orang tua boleh memilih B. Penjaganya: tidak ada kalimat "selesaikan latihan untuk dapat game", dan inti harian dibuat singkat supaya tidak dikerjakan terburu-buru (`10-gudang-ilmu-bimbingan-dan-waktu.md` bagian 5.2).

#### 3.5 Yang sengaja tidak ada

| Tidak ada | Sebab |
|---|---|
| Rangkaian hari beruntun ("api 7 hari") | Tanpa bukti manfaat belajar; berisiko dianggap teknik dorongan |
| Papan peringkat antaranak, "siapa lebih cepat" antarsaudara | Hadiah berbasis kinerja yang tidak didapat semua anak −0,88 |
| Notifikasi ke anak | Semua pengingat lewat orang tua |
| Toko, koin, pembelian di dalam mode anak | Eksploitasi anak sebagai konsumen |
| Obrolan bebas, teman, kunjungan antarakun | Kontak dengan orang asing |
| Fitur foto atau kamera di mode anak | Jalur buku + foto ditunda (keputusan Acut 19 Okt) |

---

### 4. Fitur dan profil risiko PP Tunas

Aspek risiko dari Permenkomdigi 9/2026, dirinci menjadi tujuh aspek di Kepmenkomdigi 142/2026 **[FAKTA — `riset-penguat.md` bagian 9; `02-rancangan/11-privasi-dan-keamanan.md`]**:

| Dimensi | Fitur yang menyentuh | Penjaga | Perkiraan tingkat **[ASUMSI — dinilai ulang di penilaian mandiri, Tahap 3]**. Diubah 20 Okt: tiga aspek terakhir "belum dinilai" sampai parameter di lampiran Kepmen 142 dibaca |
|---|---|---|---|
| Kontak dengan orang asing | Pesan orang tua–anak, link rapor | Pesan hanya dalam keluarga; anak hanya stiker; link bisa dicabut | Rendah |
| Paparan isi | Teks, jurus, kartu, game | Semua isi dibuat dan diperiksa kita; tidak ada isi dari pengguna lain | Rendah |
| Eksploitasi sebagai konsumen | Pembayaran nanti | Pembayaran hanya di mode orang tua; tanpa toko di mode anak | Rendah |
| Keamanan data | Hasil per soal, kata per menit, pesan | Persetujuan per tujuan; tanpa lokasi dan pengenal iklan; dirinci di Tahap 3 | Rendah–sedang |
| Kecanduan | Game, kartu, Gampong | Batas waktu, tanpa rangkaian hari, tanpa ancaman kehilangan, tanpa notifikasi ke anak | **Belum dinilai** (penjaga diharapkan menghasilkan rendah) |
| Gangguan psikologis | Tekanan, perbandingan | Tanpa perbandingan dengan anak lain; rapor tanpa label negatif; target waktu sebagai rekor pribadi | **Belum dinilai** |
| Gangguan fisiologis | Lama menatap layar | Sesi ≤ 10/15/20 menit; batas waktu game; jam tenang; tema terang lembut (mode gelap pilihan). **Pengecualian beralasan:** simulasi TKA 75 menit, paling banyak 5 kali setahun, meniru ujian sebenarnya, dimulai atas pilihan orang tua, dianjurkan Sabtu pagi | **Belum dinilai** |

---

### 5. Persetujuan yang dibutuhkan fitur ini

| Tujuan (persetujuan terpisah) | Fitur | Kalau tidak disetujui |
|---|---|---|
| Latihan dan rapor (inti layanan) | Semua latihan, rapor angka | Aplikasi tidak bisa dipakai, sebab datanya memang diperlukan |
| Data pemakaian untuk pengembangan | Analisis pola pemakaian, sistem masukan | Latihan dan rapor tetap penuh |
| Rapor buatan AI | Rapor cerita | Rapor cetakan dengan angka yang sama |
| Rapor lewat link | [L] | Rapor hanya di aplikasi orang tua |
| Rapor dilihat pengajar kelas luring | `06-persiapan-tka.md` bagian 8 | Pengajar tidak melihat apa pun |
| Rekaman suara anak | Dengar Bedanya (Nanti) | Fitur tidak muncul |

---

### 6. Keputusan Acut (19 Okt ± 21.50: semua disetujui)

| # | Keputusan | Usul Acut2 |
|---|---|---|
| 1 | Game dikunci sampai latihan selesai? (3.4) | Pilihan **C**: bawaan terbuka dengan batas waktu, orang tua boleh mengunci |
| 2 | Anak hanya mengirim stiker pesan, tanpa ketik bebas | Ya |
| 3 | Status "sedang latihan" tanpa benar/salah per soal secara langsung | Ya, supaya orang tua tidak menyela |
| 4 | Kartu satwa tanpa tingkat kelangkaan | Ya |


## Sistem Masukan — Bayaran dari Masa Gratis

**Ringkas:** (1) Setiap pertanyaan dipasangkan dengan satu keputusan dan satu ambang ("kalau ≥ X% menjawab begini, kami melakukan itu"). Yang bisa dijawab data pemakaian **tidak ditanyakan**. Hasilnya, bank pertanyaan dipangkas menjadi 19 pertanyaan orang tua (O08 dihapus 20 Okt) dan 5 ketukan anak. (2) Jadwal 8 minggu mengikuti keputusan "paling sering dua minggu sekali": pendaftaran, lalu empat putaran pada **Senin minggu ganjil kalender** (≥ 14 hari setelah mendaftar). Pertanyaan yang dipicu kejadian **masuk antrean putaran berikutnya**, tidak muncul sendiri (diperbaiki 20 Okt). Ini juga memperbaiki satu pertentangan di bahan lama: catatan 19 Okt menjadwalkan pertanyaan di hari ke-7, padahal itu kurang dari dua minggu. (3) Syarat lembut: **Acut memilih B** (19 Okt): tidak ada yang ditahan; penjawab mendapat kartu terima kasih dan kabar perubahan. Hak "fitur lebih awal" hanya untuk Keluarga Perintis yang diundang (disempitkan 20 Okt supaya sesuai Syarat dan Ketentuan).


## Gerbang Menuju Berbayar

**Ringkas:** (1) Arah besar 6 berbunyi "anak makin pintar **atau** semangat belajar naik **atau** tugas sekolah lebih mudah". Karena itu gerbang dihitung **per keluarga**: satu keluarga dianggap "terpenuhi" kalau **minimal satu janji kemampuan terukur dari data (1a, 1b, atau 1c) dan minimal satu janji yang dirasakan orang tua (2 atau 3)** tercapai untuk anaknya (diperketat 20 Okt setelah pemeriksaan akhir). Tombol berlangganan dibuka kalau **≥ 70% keluarga aktif terpenuhi (cadangan 60%)**, ditambah syarat jumlah, lama pakai, dan "sangat kecewa". (2) Evaluasi paling cepat **± 26 April 2027** (12 minggu setelah gelombang 3 masuk, dan minggu Ramadan–Idulfitri tidak dihitung), atau pertengahan Mei setelah TKA. Pada 29 Maret baru ± 28–30 keluarga yang sudah memakai 12 minggu, terlalu sedikit untuk dinilai. Usulnya, berbayar dimulai bersama **tahun ajaran baru (Juli 2027)**, sebab keluarga kelas 6 cenderung berhenti setelah TKA. (3) Usul harga: inti Lancar Matematika dan rapor ringkas **tetap gratis selamanya**; Paket Keluarga **± Rp49 ribu per bulan untuk semua anak** (diuji dengan pertanyaan harga, diputuskan di Tahap 5); Keluarga Perintis mendapat 3 bulan gratis tambahan dan harga 50% selama 12 bulan.


## Lima Penegasan Acut (28 Okt) — Gudang Ilmu, Bimbingan, Waktu Belajar, dan Isi per Kelas (lengkap)

**Ringkas:** (1) Dari lima poin yang ditegaskan Acut 28 Oktober, **satu sudah lengkap** di rancangan (isi dan fasilitas hanya untuk kelas anak, poin 5), **dua sebagian** (belajar sambil bermain dan mandiri, poin 2; menu bimbingan dibuka orang tua, poin 3), dan **dua belum ada** (gudang ilmu SD lengkap, poin 1; batas waktu belajar dan game berdasarkan riset, poin 4). Berkas ini menambahkan semuanya. (2) Hasil riset poin 4: waktu belajar efektif **tidak sama untuk semua kelas**. Patokannya **10 menit × kelas** per hari (kelas 1 = 10 menit, kelas 6 = 60 menit), dipecah menjadi blok pendek. Sesudah itu game **paling lama 30 menit** (kelas 1–2: 20 menit), dan orang tua boleh menaikkannya sampai 60 menit, tidak lebih. (3) Tambahan terbesar adalah **Gudang Ilmu**: peta lengkap semua topik SD kelas 1–6 sejak awal, lalu diisi bertahap. Matematika dan Bahasa Indonesia lebih dulu, mata pelajaran lain menyusul atas keputusan Acut. Isinya **tidak mungkin lengkap di Rilis 1**: ± 360 topik untuk dua mapel butuh ± 120 jam pemeriksaan.

**Pembaruan keputusan Acut 28 Okt (sore):** (a) batas waktu belajar dan game di bagian 5.2 **disetujui**; (b) kartu Gudang Ilmu **kelas 6 diisi lebih dulu** (Matematika 4 Jan, Bahasa Indonesia 1 Feb 2027, fokus TKA), kelas lain menyusul, dan aplikasi tetap untuk kelas 1–6; (c) Bahasa Inggris menjadi paket tersendiri **"Belajar Bahasa Inggris"** tingkat 3–6 yang bebas dipilih semua anak, mulai 1 Feb 2027 tanpa AI suara (`11-belajar-bahasa-inggris.md`); (d) **guru sekolah hanya melihat kemampuan dan memberi komentar**, sedangkan **guru les** boleh memberi tugas dan catatan (bagian 4.1).

Disusun 28 Oktober 2026 atas permintaan Acut. Label: **[FAKTA + sumber] · [ESTIMASI + cara hitung] · [ASUMSI — perlu diuji]**.

---

### 1. Pemeriksaan lima poin terhadap rancangan

| # | Permintaan Acut | Status sebelum 28 Okt | Yang ditambahkan di berkas ini |
|---|---|---|---|
| 1 | Gudang data ilmu pelajaran SD **lengkap**, kelas 1–6 | **Belum.** Tahun pertama hanya latihan harian 2 mapel, TKA, dan 12 topik Paham; Paham kelas 1–3 dan modul Bahasa Indonesia kelas 1–2 ditunda (`03-rencana-isi.md` bagian 2) | Gudang Ilmu: peta topik lengkap + kartu ilmu per topik + jadwal pengisian (bagian 2) |
| 2 | Belajar sambil bermain, anak diarahkan mandiri; yang tidak bisa diberi tanda **perlu bimbingan orang tua** atau **perlu bimbingan guru** | **Sebagian.** Ada Mode Dampingi, saran "coba Mode Dampingi" saat macet, dan tombol "Bantu aku". Belum ada tanda tiga tingkat dan belum ada jalur ke guru | Tanda bimbingan tiga tingkat dengan aturan yang jelas (bagian 3) |
| 3 | Menu bimbingan orang tua dan guru baru terbuka di akun anak **setelah disetujui orang tua** | **Sebagian.** Mode Dampingi sudah dibuka dengan PIN orang tua. Bimbingan guru belum ada (hanya link baca untuk pengajar kelas luring) | Bimbingan guru dengan persetujuan orang tua (bagian 4) |
| 4 | Waktu belajar efektif (30 menit atau 1 jam, sesuai riset), sesudahnya game dengan batas waktu yang sesuai riset | **Belum berdasar riset.** Batas sesi 10/15/20 menit dan game 10/15 menit masih [ASUMSI]; game bawaannya terbuka kapan saja | Batas waktu dari riset + urutan "belajar dulu, lalu main" (bagian 5) |
| 5 | Isi dan fasilitas hanya untuk kelas yang didaftarkan, supaya aplikasi ringan | **Sudah.** Keputusan 19 Okt: satu aplikasi, paket isi per kelas diunduh sesuai kelas, otomatis berganti saat naik kelas (`02-rancangan/05-paket-isi.md`) | Penegasan daftar fasilitas per kelas dan ukuran unduhan (bagian 6) |

---

### 2. Gudang Ilmu — peta lengkap SD, diisi bertahap

#### 2.1 Bentuknya

Gudang Ilmu adalah **perpustakaan pelajaran** di dalam aplikasi. Setiap topik SD punya satu **kartu ilmu**, disusun menurut Capaian Pembelajaran Kurikulum Merdeka Fase A (kelas 1–2), Fase B (kelas 3–4), dan Fase C (kelas 5–6).

| Isi satu kartu ilmu | Untuk apa |
|---|---|
| Penjelasan singkat bergambar (1–2 layar, bersuara untuk kelas 1–2) | Anak belajar sendiri |
| 2 contoh jadi, langkah demi langkah | Cara paling kuat untuk materi baru (contoh jadi sebelum latihan) |
| 5–10 soal latihan berjenjang, dengan kunci bertahap | Belajar mandiri, soal muncul dari mudah ke sulit |
| Salah paham yang sering terjadi | Mesin tahu kenapa anak salah, rapor bisa menjelaskan |
| Petunjuk untuk orang tua ("tanyakan ini, jangan sebut jawabannya") | Bahan Mode Dampingi |
| Prasyarat (topik kelas di bawahnya yang harus dikuasai dulu) | Mesin bisa mundur ke topik dasar kalau anak macet |

**Peta lengkap, isi bertahap:** semua topik kelas 1–6 sudah tercantum sejak awal, jadi Acut, orang tua, dan anak bisa melihat seluruh peta pelajaran. Topik yang kartunya belum siap ditandai **"segera"**, sebab menulis dan memeriksa ratusan kartu sekaligus tidak mungkin dilakukan dengan baik dalam 5 minggu pembangunan.

#### 2.2 Berapa banyak dan berapa lama

| Mapel | Topik **[ESTIMASI — ± 30 per kelas, angka di Prompt RCTOR]** | Sudah ada bahannya | Jam pemeriksaan **[ESTIMASI — 20 menit per kartu]** |
|---|---|---|---|
| Matematika kelas 1–6 | ± 180 | 24 modul TKA (kelas 4–6) + 36 jurus Lancar | ± 60 jam |
| Bahasa Indonesia kelas 1–6 | ± 180 | 12 modul TKA + 36 teks baca cepat | ± 60 jam |
| **Jumlah dua mapel** | **± 360** | | **± 120 jam ≈ Rp6 juta** kalau oleh guru (setara Rp50 ribu per jam) |
| Bahasa Inggris tingkat 3–6 | 48 unit (paket tersendiri, bukan kartu per kelas) | Belum ada | ± 16 jam (`11-belajar-bahasa-inggris.md`) |
| IPAS (kelas 3–6) dan Pendidikan Pancasila (kelas 1–6) | ± 240–300 | Belum ada | ± 80–100 jam |

Biaya AI menyusun draf kartu: ± Rp1–2 ribu per kartu dengan Sonnet lewat kiriman sekaligus, atau Rp0 kalau disusun di langganan Claude Acut **[ESTIMASI — ± 3.000 token masuk + 2.000 keluar per kartu]**.

#### 2.3 Urutan pengisian (keputusan Acut 28 Okt: kelas 6 dulu)

| Tahap | Isi | Kartu **[ESTIMASI]** | Siap | Pemeriksa | Sebab |
|---|---|---|---|---|---|
| A | **Peta topik lengkap** semua mapel SD kelas 1–6 (judul, kode CP, urutan, prasyarat) | — | Rilis 1, 22 Des 2026 | Acut (sampel) | Kerangka murah (± 6 jam), dan langsung berguna untuk mesin dan rapor |
| B1 | **Kartu Matematika kelas 6** (fokus topik TKA) | ± 30 | **R1.1, 4 Jan 2027** (bersama isi TKA) | Acut, ± 10 jam di Desember | Bahan 24 modul TKA sudah ada, tinggal diubah bentuk; anak kelas 6 butuh sebelum TKA April |
| B2 | **Kartu Bahasa Indonesia kelas 6** (fokus TKA: ide pokok, simpulan, jenis teks, kalimat efektif) | ± 30 | **R2, 1 Feb 2027** | Acut, ± 10 jam di Januari | 12 modul TKA dan teks baca cepat sudah ada |
| C | Kartu Matematika kelas 4–5 | ± 60 | R3, 22 Mar 2027 | Guru pemeriksa | Sebagian bahan dari modul TKA (topik kelas 4–5 yang diuji) |
| D | Kartu Matematika kelas 1–3 | ± 90 | R4, Juni 2027 | Guru pemeriksa | Belum ada bahan; disusun AI, diperiksa guru |
| E | Kartu Bahasa Indonesia kelas 1–5 | ± 150 | Desember 2027 | Guru pemeriksa | Baca Ulang harian sudah jalan sejak Februari; kartu topik (ejaan, imbuhan, jenis teks) melengkapinya |
| F | IPAS dan Pendidikan Pancasila | — | 2028, **atas keputusan Acut** | — | Dinilai setelah gerbang berbayar |

Bahasa Inggris **tidak** masuk urutan ini, sebab sudah menjadi paket tersendiri dengan tingkat yang bebas dipilih (`11-belajar-bahasa-inggris.md`).

**Akibat untuk Acut:** memeriksa ± 60 kartu kelas 6 (± 20 jam) di Desember–Januari, di samping isi TKA dan Baca Ulang. Kalau tidak terkejar, B2 bergeser ke 22 Feb (cadangan R2) dan diperiksa guru yang mulai Februari.

**Kenapa tidak semua sekaligus:** kartu yang salah lebih merusak daripada kartu yang belum ada, sebab anak belajar sendiri dan orang tua percaya pada isinya. Setiap kartu wajib dibaca manusia sebelum terbit. Dengan guru ± 30 jam per bulan, dua mapel selesai ± 4 bulan kerja guru, yang dipecah di sepanjang 2027.

#### 2.4 Data

Tabel baru di basis data (melengkapi `02-rancangan/03-basis-data.md`):

| Tabel | Kolom penting |
|---|---|
| `topik` | kode (misal `MAT-4-07`), mapel, kelas, fase, kode CP, judul, urutan, status (`segera` · `uji` · `terbit`) |
| `prasyarat` | topik, topik_prasyarat |
| `kartu_ilmu` | topik_id, versi, isi (penjelasan, contoh, petunjuk orang tua, salah paham), diperiksa_oleh, terbit |
| `kemajuan_topik` | anak_id, topik_id, tingkat (`belum` · `belajar` · `kuasai`), tanda_bimbingan (`mandiri` · `orang_tua` · `guru`), diperbarui |

Soal latihan di kartu memakai bank soal yang sudah dirancang (`02-rancangan/06-pembuat-soal-dan-bank-soal.md`), jadi tidak perlu jalur baru.

---

### 3. Belajar sambil bermain, mandiri dulu, dan tanda bimbingan tiga tingkat

#### 3.1 Yang sudah ada dan tetap berlaku

Latihan pendek di level yang pas, jurus sebelum level baru, kejutan yang tidak dijanjikan (kartu satwa, Jurus Sulap Angka), Gampong yang tumbuh, pilihan jalur, tanpa peringkat dan tanpa rangkaian hari beruntun (`07-fitur-orang-tua-dan-anak.md` bagian 3). Semua latihan bisa dikerjakan anak sendiri.

#### 3.2 Tanda bimbingan

Setiap topik di `kemajuan_topik` punya satu tanda. Tanda **tidak pernah ditampilkan ke anak sebagai kegagalan**. Anak hanya melihat "Topik ini lebih seru dikerjakan bersama Ayah/Bunda". Orang tua melihat tandanya dengan alasan.

| Tanda | Kapan diberikan otomatis **[ASUMSI — ambang dikalibrasi di laporan minggu ke-4]** | Yang terjadi |
|---|---|---|
| 🟢 **Mandiri** | Bawaan semua topik | Anak belajar sendiri |
| 🟡 **Perlu bimbingan orang tua** | Topik macet: 4 lembar berturut-turut tanpa kemajuan, **atau** "Masih bingung" pada jurus dua kali, **atau** salah ≥ 60% di kartu ilmu setelah jurus dibuka ulang | Kabar ke orang tua: "Rani macet di ×7. Coba kegiatan Dampingi 10 menit, naskahnya sudah disiapkan." Di HP anak muncul ajakan "kerjakan bersama Ayah/Bunda" yang terbuka setelah orang tua memasukkan PIN |
| 🔴 **Perlu bimbingan guru** | Masih macet setelah **2 kegiatan Dampingi** pada topik yang sama, **atau** celah prasyarat ≥ 2 kelas di bawah (misal anak kelas 5 belum menguasai perkalian dasar), **atau** rapor TKA menunjukkan "salah paham konsep" di ≥ 3 topik | Kabar ke orang tua: "Topik ini sebaiknya dibantu guru." Disertai ringkasan satu layar yang bisa dikirim ke guru sekolah atau guru les (bagian 4). Latihan anak **tidak dikunci**; mesin memberi latihan topik prasyarat sambil menunggu |

**Penjaga:** tanda kuning dan merah paling banyak 1 kabar per topik per minggu, supaya orang tua tidak merasa dikejar. Kalau anak berhasil, tanda kembali hijau dan orang tua mendapat kabar positif ("×7 sudah lancar lagi").

---

### 4. Menu bimbingan baru terbuka setelah disetujui orang tua

| Menu di HP anak | Cara terbuka | Siapa yang memberi persetujuan | Rilis |
|---|---|---|---|
| **Belajar bersama Ayah/Bunda** (Mode Dampingi) | Orang tua memasukkan PIN di HP anak, atau menyalakannya dari HP orang tua untuk satu topik | Orang tua pemilik atau orang tua kedua | R1 (sudah dirancang) |
| **Bimbingan Guru** | Orang tua mengundang guru dari mode orang tua dan memilih jenisnya (**guru sekolah** atau **guru les**), guru menerima, lalu orang tua menekan "Izinkan" | **Hanya orang tua pemilik** | **R3, Maret 2027** (setelah profil risiko ditetapkan dan penilaian mandiri diperbarui) |

#### 4.1 Bimbingan Guru — dua jenis guru (keputusan Acut 28 Okt)

| Hal | **Guru sekolah** — lihat + komentar | **Guru les** — tugas + catatan |
|---|---|---|
| Melihat kemampuan anak (peta topik, tanda bimbingan, ringkasan Lancar dan TKA) untuk mapel yang dipilih orang tua | ✓ | ✓ |
| Menulis **komentar** (≤ 200 huruf) | ✓ **ditujukan ke orang tua**, tampil di mode orang tua. Orang tua boleh meneruskannya ke HP anak dengan satu ketukan | ✓ |
| Memberi **tugas** dari Gudang Ilmu ("kerjakan kartu Pecahan Senilai sampai Jumat") | — | ✓ |
| Menulis **catatan** yang tampil di menu Bimbingan Guru anak, **selalu terlihat oleh orang tua** | — | ✓ |
| Menandai topik "sudah dibantu" (tanda merah kembali kuning atau hijau) | — | ✓ |
| Ada menu di HP anak | Tidak. Anak hanya melihat komentar yang diteruskan orang tua | Ya, menu "Bimbingan Guru" |
| Anak membalas | — | Hanya stiker ("Sudah", "Masih bingung", "Terima kasih") |
| Sebab | Tidak ada jalur langsung dari orang dewasa luar keluarga ke anak, jadi risiko aturan paling kecil (permintaan Acut) | Guru les dibayar dan dipilih orang tua untuk mengajar; tugas dan catatan memang pekerjaannya |

**Yang tidak bisa dilakukan kedua jenis guru:** melihat pesan keluarga, data akun, atau anak lain di keluarga; mengirim isi buatan sendiri, tautan, foto, atau nomor HP; mengobrol dengan anak; mengubah level atau nilai anak.

**Siapa gurunya:** guru sekolah anak, guru les, atau pengajar kelas luring TKA (masuk sebagai guru les), **dipilih dan diundang sendiri oleh orang tua**. Aplikasi tidak menyediakan atau mencarikan guru. Masuknya lewat link undangan dan email guru, dengan batas percobaan yang sama seperti undangan orang tua kedua (`02-rancangan/02-akun-keluarga.md` bagian 7a). Persetujuan bisa dicabut kapan saja, dan menu langsung hilang dari HP anak.

**Hubungan dengan keputusan sebelumnya:** akun pengajar penuh sengaja ditunda ke tahun kedua (`keputusan.md` bagian F), dan gagasan guru melatih sistem sudah dibatalkan Acut 20 Okt. Bimbingan Guru di sini **bukan** keduanya. Ini akses terbatas atas undangan orang tua, dimajukan ke R3 atas permintaan Acut 28 Okt.

**Risiko hukum:** guru les adalah orang dewasa di luar keluarga yang bisa menulis catatan untuk anak. Itu menyentuh parameter "kontak dengan orang tidak dikenal" di penilaian mandiri PP Tunas (KK03, bobot 14,04%). Guru sekolah tidak menyentuhnya secara langsung, sebab komentarnya sampai ke orang tua, bukan ke anak. Penjaga untuk guru les: diundang orang tua dengan izin tersendiri, tidak ada obrolan, semua catatan terlihat orang tua, dan bisa dicabut. Karena itu fitur ini tetap **wajib masuk pembaruan penilaian mandiri** dan pertanyaan ahli hukum sebelum tayang (`paket-hukum/06`, pertanyaan no. 26). Kalau Komdigi menilai jalur guru les menaikkan profil, guru les diturunkan menjadi seperti guru sekolah (lihat + komentar ke orang tua), dan tugas dikirim lewat orang tua.

**Biaya dan waktu [ESTIMASI]:** ± 5–7 hari kerja pembangunan (undangan, persetujuan, menu anak, halaman guru), tanpa biaya server tambahan yang berarti.

---

### 5. Waktu belajar efektif dan batas game — hasil riset

#### 5.1 Yang ditemukan

| Temuan | Angka | Sumber |
|---|---|---|
| Waktu belajar di rumah yang wajar per hari bertambah menurut kelas: **"aturan 10 menit"** | Kelas 1 ± 10 menit, kelas 2 ± 20 menit, dan seterusnya bertambah ± 10 menit per kelas | **[FAKTA — Harris Cooper, Duke University, 2009]** ([Duke Today](https://today.duke.edu/2009/08/school_tip.html)) |
| Satu jam pelajaran SD di sekolah | 35 menit | **[FAKTA — struktur Kurikulum Merdeka SD/MI]** ([dokumen struktur kurikulum](https://mmc.tirto.id/documents/2024/07/15/2634-struktur-kurikulum-merdeka-sd-mi-compress.pdf?x=2676)) |
| Anak yang main game **kurang dari 1 jam per hari** lebih baik penyesuaian sosial-emosionalnya daripada yang tidak main; yang **≥ 3 jam** paling buruk | ± 5.000 anak usia 10–15 tahun | **[FAKTA — Przybylski, *Pediatrics* 2014]** ([Universitas Oxford](https://www.ox.ac.uk/node/21944)) |
| Batas waktu layar untuk hiburan (bukan sekolah) anak 5–17 tahun | **Paling banyak 2 jam per hari** | **[FAKTA — Pedoman Gerak 24 Jam Australia, 2021]** ([Kemenkes Australia](https://www.health.gov.au/sites/default/files/documents/2021/05/24-hour-movement-guidelines-children-and-young-people-5-to-17-years-fact-sheet.pdf)) |
| Rekomendasi IDAI untuk anak usia sekolah | Tidak ditemukan angka khusus di sumber yang terbaca; yang terbaca hanya usia di bawah 6 tahun (≤ 1 jam) dan berhenti memakai gawai 1 jam sebelum tidur | **[FAKTA — IDAI lewat Metro TV, 25 Feb 2026]** ([Metro TV](https://www.metrotvnews.com/read/bJECjn44-bahaya-screen-time-berlebih-pada-anak-idai-ingatkan-dampaknya)) |

**Batas jujurnya:** aturan 10 menit adalah pedoman PR dari penelitian Amerika, bukan uji coba aplikasi. Penelitian game Przybylski berupa survei (hubungan, bukan sebab-akibat) dan usianya 10–15 tahun. Keduanya dipakai sebagai **batas atas yang wajar**, lalu diuji dengan data keluarga kita.

#### 5.2 Jawaban untuk pertanyaan "30 menit atau 1 jam?"

**Tidak satu angka untuk semua.** 1 jam pas untuk kelas 6 dan terlalu berat untuk kelas 1. Aturannya:

| Kelas | Batas belajar per hari di aplikasi | Dipecah menjadi | Game sesudahnya (bawaan) | Batas game yang bisa diatur orang tua |
|---|---|---|---|---|
| 1 | 10–15 menit | 2 blok pendek | 20 menit | 0–60 menit |
| 2 | 20 menit | 2 blok × 10 menit | 20 menit | 0–60 menit |
| 3 | 30 menit | 2–3 blok | 30 menit | 0–60 menit |
| 4 | 40 menit | 3 blok | 30 menit | 0–60 menit |
| 5 | 50 menit | 3–4 blok | 30 menit | 0–60 menit |
| 6 | 60 menit (hari simulasi TKA: 75 menit, ≤ 5 kali setahun) | 4 blok | 30 menit | 0–60 menit |

| Aturan | Isi | Sebab |
|---|---|---|
| **Inti harian wajib singkat** | Lancar 2–5 menit + Baca Ulang ± 5 menit (+ latihan TKA ± 10 menit untuk kelas 6) | Itu yang dihitung untuk kemajuan dan rapor; anak yang hanya mengerjakan inti tetap maju |
| **Sisa waktu belajar adalah pilihan** | Kartu Gudang Ilmu, tugas guru, Paham, mengulang topik | "10 menit × kelas" adalah **batas atas**, bukan target. Kalau ada PR sekolah, waktu itu dipakai untuk PR |
| **Satu blok paling lama 15 menit** | Setelah 15 menit muncul jeda: "Istirahat 2 menit, minum dulu" | Anak SD lebih mudah fokus dalam blok pendek; 1 jam pelajaran di sekolah pun hanya 35 menit |
| **Belajar dulu, lalu main** | Game terbuka setelah **inti harian** selesai: 1 lembar Lancar + 1 sesi Baca Ulang (mulai R2) + latihan TKA hari itu untuk kelas 6. Lembar Lancar kedua (sore/malam) tidak menahan game. Bukan setelah seluruh batas belajar | Permintaan Acut 28 Okt. Kalau syaratnya seluruh 60 menit belajar, game menjadi hadiah besar yang dikejar terburu-buru |
| **Game bukan hadiah yang dijanjikan** | Tidak ada tulisan "selesaikan latihan untuk dapat game". Game tampil sebagai "Waktu main" setelah latihan, seperti istirahat di sekolah | Hadiah yang dijanjikan merusak minat (−0,43) **[FAKTA — Deci, Koestner & Ryan 2001]** |
| **Batas atas mutlak** | Game ≤ 60 menit per hari walau orang tua mengatur lebih; belajar + game kelas 6 ≤ 1,5 jam | Di bawah "kurang dari 1 jam" (Przybylski) dan di bawah 2 jam layar hiburan |
| **Jam tenang** | Game mati otomatis setelah 21.00 dan 1 jam sebelum jam tidur yang diatur orang tua | Anjuran berhenti memakai gawai 1 jam sebelum tidur (IDAI) |

**Kapan berlaku:** pengatur waktu belajar (blok ≤ 15 menit, jeda, batas harian per kelas) dibangun di **R1**. Game di luar jam belajar baru ada di **R4 (Juni 2027)**, jadi aturan "waktu main" baru terasa saat itu. Sebelum R4, setelah inti harian anak melihat Tantang Ayah dan kartu satwa yang sudah dikumpulkan, bukan game.

**Ganti arah:** ini mengubah keputusan 19 Okt (B3 no. 2: game bawaannya terbuka kapan saja, orang tua boleh memilih "setelah latihan"). Sekarang bawaannya **"setelah inti harian"**, dan orang tua boleh memilih "selalu terbuka". Batas game naik dari 10/15 menit menjadi 20/30 menit, sebab angka lama hanya asumsi dan riset mendukung sampai di bawah 1 jam. Kelompok "setelah latihan" dan "selalu terbuka" tetap dibandingkan di laporan minggu ke-4.

---

### 6. Isi dan fasilitas hanya untuk kelas yang didaftarkan (sudah ada, ditegaskan)

| Hal | Aturan |
|---|---|
| Saat mendaftar | Orang tua mengisi kelas anak. Aplikasi hanya mengunduh **paket kelas itu**: Lancar, Baca Ulang, Gudang Ilmu, dan (khusus kelas 6) Siap TKA |
| Ukuran unduhan per anak **[ESTIMASI]** | Aplikasi ± 25–35 MB + paket satu kelas ± 15–40 MB (terbesar karena suara bacaan kelas 1–2). Bandingkan dengan semua kelas sekaligus ± 150–200 MB |
| Satu pengecualian: Bahasa Inggris | Paket Belajar Bahasa Inggris memakai **tingkat yang dipilih**, bukan kelas anak. Hanya tingkat itu yang diunduh (± 10–15 MB), dan tingkat lain diunduh saat dipilih |
| Topik kelas di bawah | Tidak diunduh semua. Hanya kartu **prasyarat** yang dibutuhkan, saat mesin menemukan celah (tanda merah karena prasyarat), ± 1–3 MB |
| Naik kelas | Paket kelas baru terunduh otomatis saat orang tua mengubah kelas (atau ditawarkan pada Juli). Paket lama dihapus setelah 30 hari; riwayat dan rapor tetap tersimpan |
| Kakak-adik satu HP | HP mengunduh paket untuk setiap kelas anak yang memakai HP itu, dan setiap anak hanya melihat isi kelasnya |
| Fasilitas per kelas | Lihat tabel di bawah |

| Fasilitas | Kelas 1–2 | Kelas 3–5 | Kelas 6 |
|---|---|---|---|
| Lancar Matematika | ✓ | ✓ | ✓ |
| Baca Ulang | ✓ + tangga suku kata dan suara penuh | ✓ | ✓ (+ teks TKA) |
| Gudang Ilmu kelasnya | ✓ (kartu Juni 2027) | ✓ (Matematika kelas 4–5 Maret 2027) | ✓ **lebih dulu**: Matematika 4 Jan, Bahasa Indonesia 1 Feb 2027 |
| Belajar Bahasa Inggris (tingkat 3–6, bebas dipilih) | ✓ dengan suara penuh | ✓ | ✓ |
| Siap TKA (latihan rumah, simulasi, rapor penyebab salah) | — | — | ✓ |
| Petunjuk bersuara di semua layar | ✓ | Bisa dinyalakan | Bisa dinyalakan |
| Game | Game hitung dan kata dasar | Game sesuai kelas | Game sesuai kelas |

---

### 7. Yang perlu diputuskan Acut

Ketiganya **sudah dijawab Acut 28 Okt** (`keputusan.md` bagian B9):

| # | Keputusan | Jawaban Acut |
|---|---|---|
| 1 | Mapel di Gudang Ilmu selain Matematika dan Bahasa Indonesia | Kelas 6 diisi dulu (fokus TKA). Bahasa Inggris menjadi paket "Belajar Bahasa Inggris" tingkat 3–6, bebas dipilih semua anak, mulai 1 Feb 2027 tanpa AI suara. IPAS dan Pancasila tetap 2028 |
| 2 | Bimbingan Guru | Guru sekolah: lihat kemampuan + komentar. Guru les: tugas + catatan |
| 3 | Batas waktu belajar dan game di bagian 5.2 | Setuju |

---

### 8. Tindak lanjut

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| Peta topik lengkap Matematika dan Bahasa Indonesia kelas 1–6 (kode CP, urutan, prasyarat) | Acut2 menyusun, Acut memeriksa sampel | Jumat 11 Des 2026 | Berkas peta di Project; paket `ilmu-k1`–`k6` (kerangka) di kanal uji |
| Peta topik mapel lain (judul saja) | Acut2 | Jumat 18 Des 2026 | Berkas peta |
| Aturan tanda bimbingan dan batas waktu masuk ke pembangunan R1 | Acut2 (sesi pembangunan) | Jumat 27 Nov 2026 | Uji otomatis tanda kuning/merah dan pengatur waktu lulus |
| Pertanyaan ahli hukum no. 26 (Bimbingan Guru) dan pembaruan penilaian mandiri | Acut2 menyiapkan, Acut mengajukan | Sebelum pembangunan R3, Jumat 29 Jan 2027 | Draf pertanyaan dan kertas kerja v0.3 |
| Kartu Matematika kelas 6 (± 30) | Acut2 menyusun, Acut memeriksa | Jumat 18 Des 2026 | Paket `ilmu-k6` (Matematika) di kanal uji |
| Kartu Bahasa Indonesia kelas 6 (± 30) | Acut2 menyusun, Acut memeriksa | Jumat 15 Jan 2027 | Paket `ilmu-k6` (Bahasa Indonesia) di kanal uji |
| Kartu Matematika kelas 4–5 | Acut2 menyusun, guru memeriksa | Senin 22 Mar 2027 | Paket di kanal umum |
| Paket Belajar Bahasa Inggris | lihat `11-belajar-bahasa-inggris.md` bagian 7 | 15 Des 2026 – 5 Mar 2027 | Paket `inggris-t3`–`t6` |

Sumber riset bagian 5: [Duke Today — Harris Cooper](https://today.duke.edu/2009/08/school_tip.html) · [Universitas Oxford — Przybylski 2014](https://www.ox.ac.uk/node/21944) · [Pedoman Gerak 24 Jam Australia](https://www.health.gov.au/sites/default/files/documents/2021/05/24-hour-movement-guidelines-children-and-young-people-5-to-17-years-fact-sheet.pdf) · [Metro TV — IDAI](https://www.metrotvnews.com/read/bJECjn44-bahaya-screen-time-berlebih-pada-anak-idai-ingatkan-dampaknya) · [Struktur Kurikulum Merdeka SD/MI](https://mmc.tirto.id/documents/2024/07/15/2634-struktur-kurikulum-merdeka-sd-mi-compress.pdf?x=2676)


## Paket Belajar Bahasa Inggris — Tingkat 3 sampai 6 (lengkap)

**Ringkas:** (1) Atas keputusan Acut 28 Okt, Bahasa Inggris dimajukan dari Agustus 2027 menjadi **satu paket "Belajar Bahasa Inggris"** dengan empat tingkat tetap yang setara kelas 3, 4, 5, dan 6 SD. Paket ini **boleh dibuka semua anak kelas 1–6**, dan tingkatnya **bebas dipilih**. Ini satu-satunya isi yang tidak terikat kelas anak. (2) Paket dibuka **1 Februari 2027 tanpa AI suara**: kosakata bergambar dengan suara rekaman, pola kalimat, dengar lalu pilih, susun kata, dan permainan kata. Tingkat 3 dan 4 siap 1 Februari, tingkat 5 dan 6 menyusul 22 Maret. Ngobrol dengan AI tetap menunggu uji suara (R5, Agustus 2027). (3) Risiko terbesarnya: Acut memeriksa isi sendiri sampai Rilis 2, padahal **isi Bahasa Inggris harus diperiksa orang yang mahir Bahasa Inggris**. Usulnya, satu guru Bahasa Inggris dipilih paling lambat **Selasa 15 Des 2026** untuk memeriksa ± 48 unit (± 16 jam ≈ Rp800 ribu).

Disusun 28 Oktober 2026. Label: **[FAKTA + sumber] · [ESTIMASI + cara hitung] · [ASUMSI — perlu diuji]**.

---

### 1. Bentuk paket

| Hal | Aturan |
|---|---|
| Nama di aplikasi | **Belajar Bahasa Inggris** |
| Tingkat | Tingkat 3, 4, 5, 6 (setara kelas 3–6 SD; mengikuti Capaian Pembelajaran Bahasa Inggris Fase B untuk tingkat 3–4 dan Fase C untuk tingkat 5–6) |
| Siapa boleh membuka | **Semua anak kelas 1–6** (keputusan Acut). Kelas 1–2 mendapat suara penuh dan petunjuk bergambar, sebab mereka belum lancar membaca |
| Memilih tingkat | Bebas. Saat pertama dibuka ada **tes singkat ± 2 menit** yang menyarankan tingkat; anak atau orang tua boleh memilih tingkat lain. Anak kelas 6 boleh mulai dari tingkat 3 |
| Pengecualian dari aturan "isi sesuai kelas" | Ya, khusus paket ini. Hanya **tingkat yang dipilih** yang diunduh (± 10–15 MB per tingkat karena suara), bukan keempatnya |
| Waktu | Dihitung di dalam batas belajar harian (10 menit × kelas, `10-gudang-ilmu-bimbingan-dan-waktu.md` bagian 5). Satu sesi ± 5–8 menit |

### 2. Isi per tingkat

| Tingkat | Unit **[ESTIMASI — 12 tema per tingkat]** | Contoh tema | Siap |
|---|---|---|---|
| 3 | 12 | Salam dan perkenalan, angka 1–20, warna, anggota keluarga, benda di kelas, hewan | **1 Feb 2027** |
| 4 | 12 | Bagian tubuh, makanan dan minuman, hari dan bulan, kegiatan sehari-hari, perasaan, rumah | **1 Feb 2027** |
| 5 | 12 | Jam dan waktu, pekerjaan, tempat di kota, cuaca, hobi, kata kerja sehari-hari | 22 Mar 2027 |
| 6 | 12 | Arah dan lokasi, kegiatan kemarin, membandingkan benda, cerita pendek, kesehatan, rencana | 22 Mar 2027 |

**Satu unit berisi:**

| Bagian | Isi | Lama |
|---|---|---|
| Kenal kata | 8–10 kosakata bergambar, diketuk untuk mendengar suara | ± 2 menit |
| Pola kalimat | 2–3 kalimat pola ("This is my …", "I like …") dengan suara dan arti dalam Bahasa Indonesia | ± 1 menit |
| Dengar lalu pilih | Mendengar kata atau kalimat, memilih gambar yang benar | ± 1–2 menit |
| Susun kata | Menyusun kata menjadi kalimat (tingkat 4–6) | ± 1 menit |
| Permainan kata | Cocokkan pasangan, tebak gambar; muncul lagi untuk kata yang sering salah | ± 1–2 menit |

Kata yang salah diulang di sesi berikutnya dengan cara yang sama seperti Lancar (pengulangan berjarak). **Tidak ada rekaman suara anak** di R2, jadi tidak ada data sensitif baru.

### 3. Suara

Suara dibuat sekali saat paket disusun dengan layanan suara Google (aksen Amerika atau Inggris, dipilih satu dan dipakai konsisten), lalu disimpan di paket. Tidak memakai data anak. Biaya ± Rp0–200 ribu sekali **[ESTIMASI — ± 600 kata dan ± 150 kalimat per tingkat; masih di dalam batas gratis bulanan layanan suara]**.

### 4. Siapa memeriksa

| Isi | Pemeriksa | Jam **[ESTIMASI — 20 menit per unit]** | Biaya |
|---|---|---|---|
| 48 unit (kosakata, kalimat, terjemahan, kecocokan gambar) | **Guru Bahasa Inggris** (bukan Acut, sebab Bahasa Inggris tulis Acut masih lemah) | ± 16 jam | ± Rp800 ribu (setara Rp50 ribu per jam, dibayar per unit ± Rp17 ribu) |
| Suara (pelafalan) | Guru yang sama mendengarkan sampel 20% | ± 2 jam | termasuk |
| Kecocokan gambar dan tampilan | Acut, dari HP | ± 2 jam | — |

Guru Bahasa Inggris ini bisa orang yang sama dengan guru pemeriksa isi mulai Februari, kalau ia mahir Bahasa Inggris. Kalau tidak, dua orang berbeda.

### 5. Akibat ke jadwal dan biaya

| Hal | Akibat |
|---|---|
| R2 (1 Feb 2027) | Rilis aplikasi R2 sekarang memuat **layar Baca Ulang + layar Belajar Bahasa Inggris** (± 5 layar baru, ± 5–7 hari pembangunan tambahan di 14 Des – 22 Jan). Cadangan tetap 22 Feb |
| R5 (Agustus 2027) | Tinggal **ngobrol dengan AI** dan rapor ucapan, kalau uji suara 5 anak lulus |
| Biaya | Honor pemeriksa ± Rp800 ribu sekali (Jan–Mar), suara ± Rp0–200 ribu, ukuran unduhan ± 10–15 MB per tingkat |
| Risiko | Kalau guru Bahasa Inggris belum ada pada 15 Des, tingkat 3–4 mundur ke 22 Feb dan tingkat 5–6 ke April |

### 6. Ukuran keberhasilan

| Ukuran | Target | Cadangan |
|---|---|---|
| Anak yang membuka paket Bahasa Inggris dan menyelesaikan ≥ 3 unit dalam 4 minggu | ≥ 40% dari keluarga aktif | ≥ 25% |
| Ketepatan "dengar lalu pilih" pada kata yang sudah dipelajari, setelah 3 minggu | ≥ 85% | ≥ 75% |
| Tanggapan orang tua "Bahasa Inggris bermanfaat" (pertanyaan masukan putaran 3) | ≥ 60% | ≥ 45% |

### 7. Tindak lanjut

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| Memilih guru Bahasa Inggris pemeriksa | Acut | Selasa 15 Des 2026 | Nama + kesediaan tertulis |
| Daftar tema dan kosakata tingkat 3–6 sesuai CP Fase B dan C | Acut2 | Jumat 4 Des 2026 | Berkas di Project |
| Unit tingkat 3–4 + suara, diperiksa guru | Acut2 menyusun, guru memeriksa | Jumat 15 Jan 2027 | Paket `inggris-t3`, `inggris-t4` di kanal uji |
| Unit tingkat 5–6 + suara, diperiksa guru | Acut2 menyusun, guru memeriksa | Jumat 5 Mar 2027 | Paket `inggris-t5`, `inggris-t6` di kanal uji |


# Bagian 2 — Rancangan Teknis


## Ringkasan Tahap 3 — Rancangan Teknis

**Ringkas:** (1) Rancangan teknis selesai dalam 11 berkas + paket draf hukum (9 berkas). Usul utamanya **Expo + Supabase (Singapura)**, latihan berjalan sepenuhnya di HP, hasil diantrekan dan dikirim tanpa ganda, dan isi diperbarui lewat paket tanpa rilis aplikasi. Biaya teknologi masa gratis ± **Rp415–465 ribu per bulan** sejak Desember (Tahap 5 menghitung ulang: ± Rp478 ribu, `06-rilis/03`). (2) **Temuan terbesar Tahap 3 adalah soal jadwal, bukan teknis.** Penilaian mandiri profil risiko harus diajukan dan diverifikasi Komdigi (± 24 hari) sebelum anak dari keluarga lain memakai aplikasi. Karena itu pengajuan harus ± **13 November**, dan ahli hukum sebaiknya dipilih **Jumat 6 November** (paling lambat Senin 30 November, `keputusan.md` bagian J), bukan akhir November. (3) Empat keputusan untuk Acut: pilihan teknologi, cara mengajukan penilaian mandiri, badan usaha penerbit, dan cara orang tua masuk.


## Arsitektur dan Pilihan Teknologi

**Ringkas:** (1) Usulnya **Expo (React Native) + Supabase di Singapura**, sebab sama dengan proyek Peta Belajar (bisa dipakai ulang), memakai basis data SQL yang cocok untuk rapor dan hitungan gerbang berbayar, dan paling mudah dibangun dengan bantuan AI. Pembandingnya Flutter + Firebase di Jakarta, yang unggul di letak data dan dukungan tanpa sinyal tetapi berarti belajar teknologi baru dari nol. (2) Semua latihan dibuat dan dinilai **di HP** dari paket isi yang sudah diunduh, jadi aplikasi tetap jalan tanpa sinyal. Server hanya menyimpan, menyinkronkan, dan menyajikan rapor. (3) Biaya selama masa gratis: **± Rp0** sampai keluarga uji masuk, lalu **± Rp415–465 ribu per bulan** (terutama Supabase Pro). **Diputuskan Acut 19 Okt: pilihan A.** Risiko terbesarnya bukan biaya, tetapi data yang disimpan di luar negeri. Karena itu data anak dibuat seminim mungkin, dan dasar hukumnya masuk paket ahli hukum.


## Akun Keluarga

**Ringkas:** (1) Hanya orang tua yang punya akun masuk. Anak **tidak punya akun, email, atau nomor HP**; anak adalah profil di bawah akun keluarga, sebab data anak harus seminimal mungkin dan persetujuan datang dari orang tua. (2) Orang tua masuk dengan **email + kode 6 angka** (keputusan Acut 19 Okt: email saja dulu), lewat layanan email gratis (Brevo 300 email per hari). Nomor WhatsApp **boleh diisi** untuk kabar dan Keluarga Perintis, tetapi tidak dipakai untuk masuk. HP anak dihubungkan dengan **kode keluarga 6 angka atau QR** yang berlaku 10 menit. (3) Celah yang ditutup: anak masuk ke mode orang tua (PIN orang tua, terkunci setelah 5 kali salah), kakak mengerjakan lembar adik (pilih profil + PIN anak opsional), dan HP hilang (orang tua bisa memutus HP dari jauh).


## Rancangan Basis Data

**Ringkas:** (1) Basis data disusun di sekitar **keluarga**: setiap baris yang menyangkut anak membawa nomor keluarga, sehingga aturan akses per baris cukup satu pola ("hanya keluarga sendiri"). (2) Hasil latihan disimpan **per soal** (jawaban, detik, jumlah hapus, kode salah), sebab rapor, peta jenis salah, penjaga terlalu rumit/mudah, dan gerbang berbayar semuanya dihitung dari situ. Nomor setiap sesi dan jawaban **dibuat di HP**, jadi pengiriman ulang tidak menghasilkan data ganda. (3) Level anak **tidak disimpan sebagai angka yang bisa diubah sembarangan**, tetapi dihitung ulang dari riwayat sesi. Dengan begitu, hasil dari dua HP atau yang terlambat terkirim tetap menghasilkan level yang sama.


## Tahan Putus Sinyal

**Ringkas:** (1) Setiap hasil **disimpan dulu di HP**, baru dikirim. Pengirimannya diulang otomatis sampai server menjawab "diterima", dan nomor yang dibuat di HP membuat kiriman ulang tidak pernah menghasilkan data ganda. (2) Kegagalan versi 4 (dua malam hasil hilang) dicegah di tiga lapis: hasil tidak bergantung pada akun di peramban, ada tanda "tersimpan / terkirim" di layar anak, dan orang tua melihat "HP Aisyah terakhir terhubung 2 hari lalu, 4 lembar belum terkirim". (3) Celah yang tetap ada: kalau aplikasi dihapus atau data HP dibersihkan **sebelum** hasil terkirim, hasil itu hilang. Penjaganya: peringatan setelah 24 jam belum terkirim dan tombol "Salin hasil" seperti versi 4.


## Paket Isi per Kelas

**Ringkas:** (1) Isi aplikasi dikirim sebagai **paket berkas per mapel dan kelas** (misal `lancar-k4`, `baca-k2`, `tka-k6`) yang diunduh sekali, disimpan di HP, dan dipakai tanpa sinyal. Paket bisa diperbarui kapan saja **tanpa rilis aplikasi baru** dan tanpa uji tertutup Play Store. (2) Setiap paket punya nomor versi, sidik berkas untuk memastikan unduhan utuh, dan batas versi aplikasi minimum. Paket baru hanya dipakai setelah terunduh utuh, sehingga paket lama tetap jalan kalau unduhan putus. (3) Setiap paket lewat **kanal uji** (HP Acut dan penguji) sebelum terbit ke semua keluarga, dan versi sebelumnya bisa dipulihkan dengan satu ketuk di panel. Ini penting karena isi akan sering diubah mengikuti masukan.


## Pembuat Soal dan Bank Soal

**Ringkas:** (1) Ada dua sumber soal. **Soal Lancar dibuat kode** di HP dengan benih acak, memindahkan pembuat soal versi 5 yang sudah lolos 8.100 lembar uji. Benihnya disimpan, sehingga setiap lembar bisa dibuat ulang persis untuk diperiksa. **Soal TKA, teks, dan modul berasal dari bank soal** yang diperiksa manusia. (2) Bahan TKA dipindah dari **berkas Markdown** (sumber asli; berkas Word dibangun dari Markdown), jadi tidak ada yang diketik ulang. Pemindahannya memakai format baku yang sudah dipakai pemeriksa kunci yang ada. (3) Setiap perubahan pada pembuat soal atau bank soal melewati **uji otomatis** sebelum paket dibangun: kunci dihitung ulang, batas angka, tanpa soal kembar, istilah baku, dan sebaran kunci.


## Layanan AI

**Ringkas:** (1) Di Rilis 1–4, **anak tidak pernah berbicara dengan AI**. AI dipakai di tiga tempat: **rapor cerita** untuk orang tua (Haiku 5.5, ± Rp35 per anak per bulan), **ringkasan masukan mingguan** untuk Acut, dan **menyusun isi** sebelum diperiksa guru. Biaya AI saat aplikasi berjalan untuk ± 50 keluarga (75 anak): **± Rp11–70 ribu per bulan** (dihitung ulang 20 Okt dengan dasar 75 anak, sama dengan `06-rilis/03`). (2) Setiap angka di rapor cerita **diperiksa ulang oleh kode** terhadap basis data. Kalau tidak cocok, atau layanan AI mati, rapor memakai kalimat cetakan dengan angka yang sama, jadi orang tua tidak pernah kehilangan rapor. (3) Yang dikirim ke AI hanya angka ringkas tanpa nama dan tanpa tanggal lahir, sebab data dikirim ke luar negeri (Amerika Serikat) dan karena panduan Anthropic untuk layanan yang menyentuh anak.


## Pembayaran (Disiapkan, Belum Dibangun)

**Ringkas:** (1) Selama masa gratis, pembayaran **tidak dibangun**. Yang disiapkan hanya tabel hak akses dan saklar fitur, supaya saat berbayar dibuka tidak ada perombakan. (2) Jalur utama nanti adalah **langganan Google Play** (potongan 15% untuk langganan berulang). Jalur kedua adalah **QRIS lewat halaman web** untuk orang tua (biaya ± 0,7%), kalau aturan Google Play di Indonesia mengizinkan. Mahkamah Agung sudah menguatkan putusan KPPU (Maret 2026) yang mewajibkan Google membuka pembayaran alternatif, tetapi pelaksanaannya belum terkonfirmasi. (3) Harga, bentuk, dan waktu berbayar menunggu **diskusi khusus** (keputusan Acut 19 Okt). Pajak dan badan usaha penerima uang masuk daftar pertanyaan ahli hukum dan konsultan pajak.


## Panel Pengelola (Ramah HP)

**Ringkas:** (1) Panel adalah halaman web pribadi yang dibuka Acut dari HP, untuk **melihat, memutuskan, dan menyetujui tanpa menyentuh kode**: ringkasan harian, keputusan mingguan, jadwal pertanyaan, Meja Periksa, Meja Masukan, paket isi, biaya, dan pesan "Kami dengar, kami ubah". (2) Acut butuh **± 2–2,5 jam per minggu** di panel selama masa gratis. Guru pemeriksa hanya bisa membuka Meja Periksa. (3) Panel juga menjadi tempat **tanda peringatan dini**: biaya, antrean yang tidak terkirim, tanggapan yang turun, dan anak yang kewalahan muncul di bagian atas, bukan tersembunyi di laporan.


## Catatan Kejadian untuk Mengukur

**Ringkas:** (1) Sebagian besar ukuran dihitung dari tabel yang sudah ada (sesi, jawaban, bacaan, jawaban masukan). Tabel `kejadian` hanya mencatat hal yang **tidak** tercatat di tempat lain: aplikasi dibuka, rapor dibuka, pesan dibaca, pertanyaan dilewati, dan kegagalan sinkron. (2) Setiap kejadian terhubung ke **ukuran keberhasilan atau ukuran gerbang** yang sudah ditetapkan di Tahap 2. Kejadian yang tidak dipakai untuk satu ukuran pun tidak dicatat. (3) Catatan dibuat sendiri di basis data kita, **tanpa analitik pihak ketiga dan tanpa pengenal perangkat**, sesuai Kebijakan Keluarga Google Play, dan dipakai dalam bentuk jumlah, bukan untuk membuat profil anak.


## Privasi dan Keamanan Anak

**Ringkas:** (1) Rancangan ini menyasar **profil risiko rendah**. Dari parameter resmi penilaian mandiri (Kepmenkomdigi 142/2026) yang sudah terbaca, hampir semua parameter berstatus "tidak ditemukan", sebab tidak ada kontak dengan orang asing, rekomendasi berbasis perilaku, iklan, pembelian oleh anak, atau data anak yang tampil ke publik. (2) Ada **temuan jadwal yang serius**: penilaian mandiri harus disampaikan ke Komdigi dan diverifikasi sebelum anak memakai aplikasi. Pemeriksaan kelengkapannya bisa memakan sampai 14 hari, ditambah klarifikasi 7 hari. Ahli hukum baru direncanakan dipilih akhir November, padahal uji keluarga dijadwalkan Desember. Usulnya: **Acut menyampaikan sendiri draf kita paling lambat Jumat 13 Nov**, ahli hukum memeriksa sejajar, dan sampai profil risiko ditetapkan hanya anak-anak Acut sendiri yang memakai aplikasi. (3) Daftar periksa sebelum tayang dan paket draf untuk ahli hukum ada di folder `paket-hukum/`.


# Bagian 3 — Antarmuka


## Ringkasan Tahap 4 — Antarmuka

**Ringkas:** (1) Antarmuka dirancang dalam 3 berkas: 55 layar dengan alurnya (65 setelah tambahan 28 Okt, termasuk Gudang Ilmu, Bimbingan Guru, dan Belajar Bahasa Inggris; 51 di aplikasi Rilis 1, termasuk layar TKA yang isinya terbuka 4 Januari; diperbaiki 20 Okt), kerangka 20 layar terpenting, dan aturan tampilan untuk anak 6–12 tahun di HP murah. (2) Empat keputusan desain paling berpengaruh: **waktu tidak ditampilkan berjalan saat lembar Lancar** (hanya rekor di akhir), **turun level tidak diumumkan**, **tombol anak jauh lebih besar dari batas umum Android**, dan **tema terang lembut sebagai bawaan**. Yang terakhir ini mengoreksi rancangan sebelumnya yang menyebut mode gelap untuk malam. (3) Langkah yang paling berguna berikutnya adalah menguji kerangka ini di tangan anak-anak Acut sendiri pada minggu pertama purwarupa, sebab semua ukuran huruf dan tombol masih asumsi.


## Daftar Layar dan Alur Antarlayar (lengkap)

**Ringkas:** (1) Aplikasi punya **55 layar** (menjadi **65** setelah tambahan 28 Okt di bagian 8) dalam empat bagian: awal dan akun (10), mode anak (21), Mode Dampingi (7), dan mode orang tua (17). Ditambah 4 keadaan halaman rapor lewat link; panel pengelola sudah dirinci di `02-rancangan/09`. (2) Prinsip alurnya: anak **paling banyak 2 ketukan** dari beranda ke soal pertama, dan orang tua **paling banyak 2 ketukan** dari beranda ke rapor atau kirim semangat. Tidak ada jalan keluar dari mode anak ke mode orang tua tanpa PIN. (3) Setiap layar diberi kode (A, K, D, O, L) yang dipakai di kerangka layar dan rencana uji.

Tahap 4, butir 1. Disusun 19 Oktober 2026. Kolom "Rilis" mengikuti `01-produk/02-fitur-per-rilis.md`.

---

### 1. Peta besar

---

### 2. Awal dan akun (A)

| Kode | Layar | Rilis |
|---|---|---|
| A1 | Selamat datang: "Saya orang tua" / "Ini HP anak" | R1 |
| A2 | Masuk: alamat email (+ nomor WhatsApp opsional) | R1 |
| A3 | Kode 6 angka dari email (petunjuk "periksa Spam", kirim ulang 60 detik) | R1 |
| A4 | Izin data: pembuka → 6 kartu tujuan → ringkasan | R1 |
| A5 | Profil anak: nama panggilan, bulan-tahun lahir, kelas, hewan (bisa tambah anak) | R1 |
| A6 | Cara terlibat: Duduk bersama / Dari jauh / Cukup rapor lewat link | R1 |
| A7 | PIN orang tua (buat + ulangi) | R1 |
| A8 | Anak memakai HP lain? → kode keluarga + QR / "Serahkan HP ini ke anak" | R1 |
| A9 | Mengunduh paket isi (ukuran, sisa waktu, bisa lanjut nanti) | R1 |
| A10 | HP anak: masukkan kode keluarga / pindai QR → pilih profil yang memakai HP ini | R1 |

---

### 3. Mode anak (K)

| Kode | Layar | Rilis |
|---|---|---|
| K1 | Pilih profil (hewan besar per anak) | R1 |
| K2 | PIN anak (kalau dipasang) | R1 |
| K3 | **Beranda anak**: pesan orang tua, ajakan, pilihan jalur hari ini, album kartu | R1 |
| K4 | Tes penempatan (pengantar bersuara → soal). Layar yang sama dipakai untuk **tes tetap** ("lembar tantangan" 20 + 5 soal, hari ke-1–3 lalu tiap 4 minggu; ditambah 20 Okt) | R1 |
| K5 | Layar jurus (sebelum level baru; bisa dibuka lagi) | R1 |
| K6 | **Lembar Lancar** (soal + papan angka) | R1 |
| K7 | **Akhir lembar**: hasil, rekor, tersimpan/terkirim, ketukan perasaan | R1 |
| K8 | Kartu kejutan (muncul tak terduga) | R1 |
| K9 | Album kartu satwa | R1 |
| K10 | Pesan: pesan dari orang tua + kirim stiker (termasuk "Bantu aku") | R1 |
| K11 | Jeda (tutup soal, waktu berhenti) | R1 |
| K12 | "Untuk kamu": penjelasan privasi bergambar | R1 |
| K13 | TKA: daftar topik / latihan rumah; tanda "minggu ini" dari Rencana minggu ini (29 Okt) | R1 (isi R1.1) |
| K14 | TKA: soal dengan petunjuk dan langkah bertahap | R1 (isi R1.1) |
| K15 | TKA: simulasi (pengantar, soal dengan tab Teks/Soal, daftar soal + ragu, kumpulkan, hasil); juga dipakai untuk **mini try out mingguan 6 soal / 15 menit** (29 Okt) | R1 (isi R1.1) |
| K16 | Baca Ulang: bacaan dingin (tombol mulai–selesai) | R2 |
| K17 | Baca Ulang: dengar contoh (kata disorot) | R2 |
| K18 | Baca Ulang: bacaan panas + 2 pertanyaan + rekor | R2 |
| K19 | Tangga suku kata (kelas 1) | R2 |
| K20 | Modul Paham (contoh jadi → latihan) | R3 |
| K21 | Game dan Gampong (dengan batas waktu) | R4 |

**Aturan alur mode anak:**

| Aturan | Sebab |
|---|---|
| Dari K3 ke soal pertama ≤ 2 ketukan | Sesi pendek dan langsung |
| Tidak ada tombol "keluar ke orang tua" yang besar; hanya tombol kecil berPIN | Anak tidak masuk mode orang tua |
| Layar soal (K6, K14, K16, K18) tanpa pesan, kartu, atau iklan internal yang menyela | Perhatian penuh pada soal |
| Tombol kembali Android di tengah lembar → K11 Jeda, bukan keluar | Lembar tidak hilang karena salah tekan |
| Anak bisa berhenti kapan saja dari K11 ("Lanjut nanti") | Tidak memaksa |

---

### 4. Mode Dampingi (D)

| Kode | Layar | Rilis |
|---|---|---|
| D1 | PIN orang tua (dari tombol kecil di K3) | R1 |
| D2 | Menu kegiatan: Tantang Ayah · Dengar Bacaan · Soal Cerita · Lembar didampingi · Pengawas simulasi | R1 |
| D3 | Tantang Ayah (anak memilih 10 soal → bergantian → hasil) | R1 |
| D4 | Lembar didampingi: soal + kunci + "petunjuk untuk diucapkan" + jurus | R1 |
| D5 | Laporkan soal ("soal ini salah / membingungkan") | R1 |
| D6 | Dengar Bacaan (teks yang bisa diketuk, naskah di atas) | R2 |
| D7 | Pengawas simulasi (tanpa kunci; waktu dan nomor soal saja). Dibuka dari D2, tetapi setelah dimulai **keluar dari Mode Dampingi**: tidak ada batas 15 menit diam, simulasi berjalan 75 menit di K15 dengan tanda "diawasi" | R1 (isi R1.1) |

---

### 5. Mode orang tua (O)

| Kode | Layar | Rilis |
|---|---|---|
| O1 | **Beranda kabar**: kartu per anak, kartu pertanyaan masukan, kartu "Kami dengar" | R1 |
| O2 | **Rapor anak** (mingguan): 3 angka, kemajuan, langkah berikutnya, cara membantu, tombol "level terasa tidak pas" | R1 |
| O3 | Rincian: peta jenis salah per keluarga fakta, riwayat lembar | R1 (P) |
| O4 | Rapor TKA: peta 36 topik, simulasi, penyebab salah; **Rencana minggu ini** dan grafik skor mini try out (29 Okt) | R1 (isi R1.1) |
| O5 | Kirim semangat (pesan siap pakai + teks pendek) | R1 |
| O6 | Ajakan (pilihan siap, 1 per hari) | R1 (P) |
| O7 | Pesan (riwayat pesan dua arah, stiker anak) | R1 |
| O8 | **Pertanyaan masukan** (1 pertanyaan → "mau 2 lagi?") | R1 |
| O9 | Kami dengar, kami ubah (edisi terbaru + arsip) | R1 |
| O10 | Pengaturan: anak dan profil · HP terhubung · PIN · batas game dan jam tenang · Mode Ramadan | R1 |
| O11 | Izin data (6 tujuan, bisa diubah) | R1 |
| O12 | Link rapor: buat, salin, kirim ke WhatsApp, cabut | R1 |
| O13 | Orang tua kedua: undang dengan kode | R1 |
| O14 | Data keluarga: unduh, hapus akun | R1 |
| O15 | Panduan singkat "membantu tanpa mengambil alih" (5 kartu) | R1 |
| O16 | Hubungi kami / laporkan masalah (dengan "Salin hasil") | R1 |
| O17 | Masa gratis dan berlangganan | Setelah diskusi berbayar |

**Navigasi orang tua:** bilah bawah 4 tombol — **Kabar** (O1) · **Rapor** (O2) · **Pesan** (O7) · **Pengaturan** (O10). Semua layar lain dibuka dari keempatnya.

---

### 6. Halaman rapor lewat link (L)

| Kode | Keadaan | Isi |
|---|---|---|
| L1 | Rapor | Rapor satu layar (O2 versi ringkas) + "data sampai …" |
| L2 | Pertanyaan | Kartu pertanyaan masukan di bawah rapor (kalau ada putaran dan izin masukan diberikan) |
| L3 | Link dicabut atau kedaluwarsa | "Link ini sudah tidak berlaku. Minta link baru ke orang tua yang membagikannya." |
| L4 | Ajakan | "Ingin melihat anak latihan dan mengirim semangat? Pasang aplikasinya" + tautan Play Store |

---

### 7. Hitungan layar

Diperbaiki 20 Okt. Hitungan lama (43) salah jumlah, dan layar TKA ditandai R1.1 padahal R1.1 hanya paket isi tanpa rilis aplikasi. Karena itu layar TKA (K13–K15, D7, O4) **harus ada di aplikasi R1**; isinya baru terbuka 4 Januari lewat paket `tka-k6`.

| Bagian | Jumlah | Di aplikasi R1 | Rilis aplikasi berikutnya |
|---|---|---|---|
| Awal dan akun (A) | 10 | 10 | — |
| Mode anak (K) | 21 | 15 (K1–K15) | R2: K16–K19 · R3: K20 · R4: K21 |
| Mode Dampingi (D) | 7 | 6 (D1–D5, D7) | R2: D6 |
| Mode orang tua (O) | 17 | 16 (O1–O16; O3 dan O6 Penting) | Setelah diskusi berbayar: O17 |
| **Jumlah layar aplikasi** | **55** | **47** | R2 = 5 layar baru → rilis aplikasi + tinjauan Play (pembangunan 14 Des – 22 Jan, `06-rilis/04`) |
| Halaman rapor (L) | 4 keadaan | 4 |

---

### 8. Layar tambahan dari penegasan Acut 28 Okt

Rincian aturan di `01-produk/10-gudang-ilmu-bimbingan-dan-waktu.md`.

| Kode | Layar | Rilis |
|---|---|---|
| K22 | **Gudang Ilmu**: peta topik kelas anak per mapel, status tiap topik (belum · belajar · kuasai · segera), tanda "lebih seru bersama Ayah/Bunda" | R1 (peta), kartu bertahap |
| K23 | **Kartu ilmu**: penjelasan bergambar dan bersuara → 2 contoh jadi → 5–10 soal berjenjang dengan kunci bertahap | Bertahap 2027 |
| K24 | **Istirahat dulu** (setelah blok 15 menit) dan **Cukup belajar hari ini** (batas harian tercapai) | R1 |
| K25 | **Waktu main**: game setelah inti harian, sisa menit terlihat, berhenti di akhir babak | R4 |
| K26 | **Bimbingan Guru** di HP anak (hanya untuk **guru les**): tugas dari guru, catatan guru, balasan stiker; komentar guru sekolah yang diteruskan orang tua juga tampil di sini. Hanya muncul setelah orang tua menyetujui | R3 |
| K27 | **Belajar Bahasa Inggris — pilih tingkat**: tes singkat ± 2 menit, saran tingkat, empat pilihan tingkat 3–6 (bebas dipilih) | R2 |
| K28 | **Unit Bahasa Inggris**: kenal kata bersuara → pola kalimat → dengar lalu pilih → susun kata → permainan kata | R2 |
| O18 | **Tanda bimbingan** di mode orang tua: daftar topik kuning/merah dengan alasan, tombol "Mulai Dampingi" dan "Minta bantuan guru" | R1 |
| O19 | **Kelola guru**: undang guru (email), pilih jenis (**guru sekolah** · **guru les**) dan mapel yang diizinkan, Izinkan / Cabut, baca komentar guru sekolah dan teruskan ke anak, lihat semua tugas dan catatan guru les | R3 |
| O20 | **Pengaturan waktu**: batas belajar per hari, game 0–60 menit, "game setelah inti harian" atau "selalu terbuka", jam tenang | R1 (belajar), R4 (game) |
| O21 | **Peta Perjalanan** (29 Okt): jalan berliku per paket (Lancar 6 level, Baca Ulang, Bahasa Inggris 3–6, TKA 36 topik), titik lulus berwarna, posisi anak ditandai Pinci; tombol kirim gambar ke WhatsApp | R2 |
| D8 | **Cerita Ulang** (29 Okt): setelah Baca Ulang, anak menceritakan isi teks 1 menit; orang tua mencentang tokoh · kejadian · akhir cerita | R2 |
| D9 | **Ucapkan ke Bunda** (29 Okt): anak mengucapkan 5 kata/kalimat Bahasa Inggris; orang tua menekan "jelas" / "coba lagi"; tombol 🔊 contoh | R2 |
| K29 | **Hari Pamer** (29 Okt): ajakan akhir bulan, anak memilih yang dipamerkan, orang tua mengetuk "sudah ditonton", kartu kenangan ke album | R2 |
| G1–G3 | **Halaman guru** (web, lewat link undangan): daftar anak bimbingan, kemampuan per topik, tulis komentar untuk orang tua; tombol beri tugas dan catatan **hanya untuk guru les** | R3 |

Jumlah layar aplikasi bertambah 10 (K22–K28, O18–O20); 4 di antaranya ada di aplikasi R1 (K22, K24, O18, O20), jadi aplikasi R1 menjadi **51 layar** dan seluruh aplikasi **65 layar**. K27–K28 (Belajar Bahasa Inggris, keputusan Acut 28 Okt) masuk R2.

**Ditambah 29 Okt:** O21, D8, D9, K29 (semuanya R2), jadi seluruh aplikasi **69 layar**; aplikasi R1 tetap 51 layar.


## Kerangka Layar Penting

**Ringkas:** (1) Dua puluh layar terpenting digambar sebagai kerangka teks: apa yang tampil, tombol apa saja, apa yang terjadi saat ditekan, dan apa yang dibacakan untuk kelas 1–2. Termasuk layar pertanyaan masukan untuk orang tua (O8) dan ketukan anak (K7). (2) Tiga aturan berlaku di semua layar anak: **satu tugas per layar**, **tombol utama di bawah dalam jangkauan ibu jari**, dan **umpan balik langsung** untuk setiap ketukan (warna + ikon + suara pendek), sebab anak sering mengetuk dua kali kalau tidak yakin ketukannya diterima. (3) Kerangka ini bukan desain warna atau gambar akhir; itu dikerjakan saat purwarupa, mengikuti `03-aturan-tampilan.md`.


## Aturan Tampilan untuk Anak 6–12 Tahun dan HP Murah

**Ringkas:** (1) Tombol anak dibuat **jauh lebih besar dari batas umum Android (48dp)**: ≥ 64dp untuk kelas 1–2 dan ≥ 56dp untuk kelas 3–6. Sebab anak 7–10 tahun meleset pada ± 30% sasaran berukuran 6,4 mm, dan makin muda anak, makin besar sasaran yang dibutuhkan. (2) Satu temuan mengoreksi rancangan sebelumnya: **mode gelap bukan pilihan terbaik untuk malam**. Pada malam hari, tampilan terang justru menghasilkan kinerja membaca lebih baik. Karena itu bawaan aplikasi adalah tema terang yang lembut (latar krem, tidak putih menyilaukan), dengan mode gelap sebagai pilihan. (3) Tidak ada musik latar dan tidak ada animasi di layar soal, sebab suara dan hiasan yang tidak berhubungan dengan pelajaran terbukti menurunkan hasil belajar.


## Identitas Merek — Pintar Main dan Pinci (lengkap)

**Ringkas:** (1) Mulai 28 Okt 2026 nama resmi aplikasi adalah **Pintar Main**, dengan maskot **Pinci, Si Kancil Pintar**. Nama ini menggantikan "Belajar Menarik" dan nama kerja "Pandu Anak" di seluruh rancangan. Sumbernya dokumen branding Acut (`pintar-main-branding.md`). Bagian 1–3 dokumen itu dipakai apa adanya, dengan **empat penyesuaian** yang diputuskan Acut 28 Okt supaya tidak bertabrakan dengan aturan yang sudah dikunci. (2) Penyesuaiannya: aksesori Pinci menjadi **kejutan acak**, bukan poin yang ditukar; slogan "Belajar dulu, main kemudian!" **hanya untuk orang tua dan Play Store**, bukan di layar anak; bintang hanya **tanda selesai**, bukan nilai 1–3; huruf **gabungan** (Baloo 2 untuk judul, Andika untuk soal dan bacaan, Nunito untuk orang tua). (3) Pemeriksaan kontras menemukan satu masalah palet: **teks putih di atas Hijau Daun dan Oranye Jeruk tidak terbaca** (kontras 2,7 dan 2,1, padahal batasnya 4,5). Tombol memakai teks Biru Tinta, dan teks hijau memakai Hijau Tua `#1F7A4D`. Nama harus dicek di Play Store dan PDKI **paling lambat Jumat 6 Nov**, sebab nama aplikasi ikut diajukan dalam penilaian mandiri 13 Nov.

Disusun 28 Oktober 2026. Label: **[FAKTA + sumber] · [ESTIMASI] · [ASUMSI — perlu diuji]**.

---

### 1. Yang dipakai apa adanya

| Unsur | Isi | Sumber |
|---|---|---|
| Nama aplikasi | **Pintar Main** | Branding bagian 1 |
| Maskot | **Pinci**, Si Kancil Pintar (Pin-tar + Kan-ci-l). "Si Kancil Pintar" hanya julukan | Branding bagian 3 |
| Kepribadian Pinci | Penasaran, cerdik (memberi petunjuk, bukan jawaban), ceria, sabar dan empatik, disiplin yang ramah | Branding bagian 3 |
| Peran Pinci | Pemandu pelajaran, penyemangat, penjaga waktu | Branding bagian 3 |
| Di mode anak dan mode orang tua | Mode anak: Pinci tampil penuh dan bersuara. Mode orang tua: Pinci hanya ikon kecil, tampilan bersih | Branding bagian 3 |
| Gaya ilustrasi | Flat 2D membulat, garis tepi cokelat tua, bayangan satu tingkat, dunia hutan tropis Indonesia | Branding 4.3 |
| Desain Pinci | Kancil mungil bergaya chibi, cokelat `#A0673A`, perut krem, bintik putih, mata besar, ransel oranye, syal hijau | Branding 4.4 |
| Lima ekspresi awal | Senang, semangat, berpikir, empati, merayakan; mengantuk dan terkejut menyusul | Branding 4.5 |
| Logo dan ikon | Wordmark Baloo 2 ExtraBold ("Pintar" hijau, "Main" oranye) + kepala Pinci; ikon Play Store kepala Pinci di latar hijau tanpa teks | Branding 4.6 |
| Trio Penjelajah | Ditunda; rilis awal cukup Pinci | Branding bagian 3 |

**Dunia Pinci dan Gampong:** hutan tropis tempat Pinci berpetualang menjadi latar Gampong yang tumbuh (R4) dan kartu satwa. Profil anak tetap memakai lambang hewan pilihan anak (🐘, 🐢, dan seterusnya), sebab itu tanda pengenal anak, bukan maskot.

**Satu catatan cerita:** dalam dongeng, kancil juga dikenal suka mengakali (misalnya mencuri timun). Pinci **cerdik tetapi jujur**: tidak menipu, tidak mengejek, dan cerita Pinci tidak memakai kisah kancil mencuri. Ini dijaga di naskah kegiatan dan pesan semangat.

### 2. Empat penyesuaian (keputusan Acut 28 Okt)

| # | Di dokumen branding | Dipakai di rancangan | Sebab |
|---|---|---|---|
| 1 | Anak mendandani Pinci dengan **poin dari belajar** | **Aksesori Pinci menjadi kejutan acak**, bergantian dengan kartu satwa, ± 1 dari 3 kejadian penguasaan. Tidak ada poin, tidak ada toko, tidak ada tulisan "kumpulkan poin untuk topi" | Hadiah yang dijanjikan menurunkan minat (−0,43); kejutan ≈ 0 **[FAKTA — Deci, Koestner & Ryan 2001]** (`01-produk/07` bagian 3) |
| 2 | Slogan "Belajar dulu, main kemudian!" untuk anak | **Hanya untuk orang tua**: Play Store, promosi, mode orang tua. Di layar anak dipakai "Pintar itu seru!" dan "Belajar jadi petualangan." | Rancangan melarang tulisan "selesaikan latihan untuk dapat game" di layar anak (`01-produk/10` bagian 5.2). Aturan "game setelah inti harian" tetap berlaku, hanya tidak diucapkan sebagai janji |
| 3 | "Kamu dapat 3 bintang!"; slogan "Satu langkah, satu bintang" | **Bintang hanya tanda selesai**: satu bintang untuk setiap lembar atau unit yang selesai, sama untuk semua anak, tidak bisa ditukar. Tidak ada nilai 1–3 bintang. Slogan "Satu langkah, satu bintang" tidak dipakai | Nilai bintang adalah hadiah berbasis kinerja yang tidak didapat semua anak (−0,88), dan bertabrakan dengan aturan "tanpa peringkat" |
| 4 | Baloo 2 + Nunito untuk semua teks | **Baloo 2** untuk logo dan judul; **Andika** untuk soal, bacaan, dan petunjuk anak; **Nunito** untuk mode orang tua | Andika dirancang untuk pembaca pemula (bentuk "a" dan "g" seperti tulisan tangan anak) **[FAKTA — Wikipedia, Andika (typeface)]**; Nunito memakai "a" bertingkat dua yang lebih sulit untuk kelas 1–2 |

**Penyesuaian kecil tanpa keputusan baru:**

| Di dokumen branding | Dipakai | Sebab |
|---|---|---|
| "Akun anak" | **Mode anak** atau **profil anak** | Anak tidak punya akun (data minimal, PP Tunas); yang punya akun hanya orang tua (`02-rancangan/02-akun-keluarga.md`) |
| Pinci beranimasi aktif di semua layar | Pinci **bergerak** di layar awal, jurus, ajakan, dan layar akhir (≤ 1,5 detik, bisa dilewati). Di layar soal (K6, K14, K16, K18) Pinci **diam dan kecil**, dan muncul dengan ekspresi "berpikir" hanya saat tombol "Bantu aku" ditekan | Hiasan bergerak di layar soal menurunkan hasil belajar **[FAKTA — Sundararajan 2018, lewat Learning Scientists]** (`03-aturan-tampilan.md` bagian 5) |
| Ekspresi "sedih" saat jawaban salah | Tidak muncul per soal. Ekspresi empati dipakai di layar akhir lembar yang berat dan saat jurus dibuka ulang | Soal salah sudah ditandai kotak bergetar + jawaban benar; wajah sedih tiap soal membuat anak merasa diawasi |
| Slogan "Bahasa Indonesia, Matematika, English: seru dalam satu aplikasi" | "Bahasa Indonesia, Matematika, Bahasa Inggris: seru dalam satu aplikasi" | Aturan bahasa: tanpa istilah Inggris di pesan ke orang tua |

### 3. Palet warna dan aturan kontras

Hitungan kontras memakai rumus WCAG 2.x **[FAKTA — WCAG]**; angkanya dihitung Acut2 dari kode warna.

| Warna | Hex | Teks putih di atasnya | Teks Biru Tinta di atasnya | Aturan pakai |
|---|---|---|---|---|
| Hijau Daun (primer) | `#3BB273` | 2,7 ✗ | **4,8** ✓ | Tombol utama dengan **teks Biru Tinta**, bukan putih |
| Oranye Jeruk (sekunder) | `#FF9F1C` | 2,1 ✗ | **6,3** ✓ | Tombol Dampingi dan aksen, teks Biru Tinta |
| Cokelat Kancil | `#A0673A` | 4,7 ✓ | 2,8 ✗ | Tubuh Pinci saja, bukan latar teks |
| Krem Lembut (latar anak) | `#FFF6E5` | — | **12,0** ✓ | Latar mode anak; cocok dengan aturan "tema terang lembut" |
| Abu Terang (latar orang tua) | `#F5F7FA` | — | **12,0** ✓ | Latar mode orang tua |
| Biru Tinta (teks) | `#2D3142` | — | — | Semua teks dan angka soal (≥ 7 : 1 terpenuhi) |
| Hijau Segar (sukses) | `#2E9E5B` | 3,4 | 3,8 | Hanya untuk tanda ✓ dan garis, selalu bersama simbol, bukan latar teks kecil |
| Koral Lembut (perhatian) | `#FF6B6B` | 2,8 ✗ | 4,6 ✓ | Kotak bergetar saat salah; tidak dipakai untuk "belum latihan" |
| Biru Langit (info) | `#4EA8DE` | 2,6 ✗ | 4,9 ✓ | Kotak petunjuk dengan teks Biru Tinta |
| **Hijau Tua (tambahan)** | `#1F7A4D` | 5,3 ✓ | — | Teks hijau di latar krem (4,95), tautan, judul hijau |

**Warna per bagian** (menggantikan "Lancar biru, Baca Ulang hijau, TKA ungu, Dampingi oranye" di `03-aturan-tampilan.md`):

| Bagian | Warna | Hex | Catatan |
|---|---|---|---|
| Matematika (Lancar, Paham, kartu Matematika) | Biru Laut | `#3A86FF` | Kontras dengan Biru Tinta 3,7: dipakai sebagai pita, ikon, dan kartu dengan teks besar (≥ 24sp), tidak untuk teks kecil |
| Bahasa Indonesia (Baca Ulang, kartu Bahasa Indonesia) | Merah Bata | `#E85D5D` | Sama, pita dan ikon |
| Belajar Bahasa Inggris | Ungu Anggur | `#8E6CCF` | Sama |
| Siap TKA | Warna mapel soalnya + lencana "TKA" | — | Ungu sudah dipakai Bahasa Inggris |
| Mode Dampingi | Oranye Jeruk | `#FF9F1C` | Sama dengan rancangan lama |
| Gudang Ilmu | Hijau Daun | `#3BB273` | — |

### 4. Huruf

| Unsur | Huruf | Ukuran (dari `03-aturan-tampilan.md`) |
|---|---|---|
| Logo, judul layar, nama bagian | **Baloo 2** Bold/ExtraBold | Judul ≥ 24sp |
| Soal Lancar, teks Baca Ulang, soal TKA, petunjuk anak | **Andika** | Tetap: soal 36–44sp, bacaan 20–26sp, petunjuk 16–20sp |
| Mode orang tua, rapor, halaman guru | **Nunito** Regular/SemiBold | ≥ 16sp |

Ketiganya berlisensi terbuka (SIL OFL) dan disertakan di aplikasi supaya jalan tanpa sinyal. Tambahan ukuran unduhan ± 1–1,5 MB **[ESTIMASI — ukuran berkas huruf]**.

### 5. Gaya bahasa

Dipakai apa adanya dari branding 4.7 dan cocok dengan aturan bahasa yang sudah ada: kalimat pendek, ajakan positif, tanpa "Salah!" atau "Gagal!". Contoh baru untuk Pinci:

| Saat | Kalimat Pinci |
|---|---|
| Membuka aplikasi | "Halo, Rani! Yuk, kita cari tahu hari ini." |
| Jurus baru | "Pinci punya jurus. Lihat caranya, ya." |
| Tombol "Bantu aku" | "Coba lihat angka yang di depan dulu." (petunjuk, bukan jawaban) |
| Inti harian selesai | "Hebat! Sekarang waktunya istirahat." (tanpa menyebut game sebagai hadiah) |
| Waktu main habis | "Waktunya selesai main. Sampai besok, ya!" |
| Jam tenang | "Pinci sudah mengantuk. Kita lanjut besok." |

### 6. Tindak lanjut

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| Cek nama "Pintar Main" di Play Store dan pangkalan merek PDKI (pdki-indonesia.dgip.go.id), serta "Pinci" di Google dan YouTube. Pencarian web awal Acut2 28 Okt **tidak menemukan** aplikasi atau kartun dengan nama sama **[FAKTA — pencarian web, belum menyeluruh]** | Acut | **Jumat 6 Nov 2026** (sebelum penilaian mandiri 13 Nov memuat nama aplikasi) | Tangkapan layar hasil pencarian Play Store dan PDKI |
| Cek domain (pintarmain.id / .com) dan nama akun Instagram, TikTok, YouTube | Acut | Jumat 6 Nov 2026 | Daftar ketersediaan |
| Pertanyaan hukum no. 17 diperbarui ke nama Pintar Main dan Pinci | Acut2 | Selesai 28 Okt | `paket-hukum/06` |
| Desain Pinci (5 ekspresi) dan ikon aplikasi oleh desainer | Acut memilih desainer | Jumat 20 Nov 2026 (ikon dibutuhkan untuk unggah uji tertutup 24 Nov) | Berkas gambar PNG + sumber |
| Daftarkan merek "Pintar Main" dan karakter Pinci ke DJKI | Acut (badan usaha atau pribadi sesuai diskusi khusus 2) | Setelah nama pengendali data diputuskan, Desember 2026 | Bukti pengajuan |
| Suara Pinci: satu suara buatan yang dipakai di semua petunjuk | Acut2 memilih 3 contoh, Acut memilih | Jumat 13 Nov 2026 | Contoh suara di Project |


# Bagian 4 — Uji


## Rencana Uji

**Ringkas:** (1) Ada empat lapis uji, berurutan: **uji otomatis** (setiap perubahan kode dan paket), **uji keluarga sendiri** (anak kelas 4 dan kelas 6 Acut, 2–29 November), **uji tertutup Play Store** (12 penguji dewasa, diunggah **Selasa 24 November** dengan versi apa adanya), dan **uji 10 keluarga** (cadangan 5) lewat jalur uji tertutup yang sama **setelah profil risiko ditetapkan** (target ± 8 Desember, cadangan ± 17 Desember). (2) Tayang 22 Desember hanya mungkin kalau unggahan pertama lolos tinjauan dan 12 penguji ikut sejak ± 26–27 November, sebab Google mewajibkan 14 hari berturut-turut, lalu meninjau permohonan akses produksi (≤ 7 hari) dan rilis produksinya. (3) Setiap lapis punya syarat lulus. Kalau tidak lulus, tanggal mundur ke cadangan (31 Desember), bukan syaratnya yang diturunkan; keluarga tetap bisa memakai aplikasi lewat jalur uji tertutup.


# Bagian 5 — Rilis dan Uang


## Ringkasan Tahap 5 — Uji, Rilis, dan Uang

**Ringkas:** (1) Rilis 1 bisa tayang **22 Desember 2026** (cadangan 31 Desember) kalau empat titik tetap terpenuhi: nama pengendali data **Jumat 6 Nov**, pengajuan penilaian mandiri **Jumat 13 Nov**, unggah uji tertutup **Selasa 24 Nov** (versi apa adanya), dan pembangunan R1 selesai **Jumat 27 Nov**. Kalau verifikasi Komdigi dihitung dalam hari kerja, profil risiko baru ± 17 Des dan keluarga uji masuk ± 4 Jan lewat jalur uji tertutup. (2) Masa gratis menghabiskan **± Rp478 ribu per bulan di Desember–Januari** (Acut memeriksa isi sendiri) dan **± Rp1,44 juta per bulan di Februari–Mei** (ditambah honor guru); dihitung untuk ± 50 keluarga sebagai batas atas. Setelah berbayar, pada 500 keluarga dan harga Rp49 ribu, titik impasnya **39 keluarga membayar**, atau **87 keluarga** kalau langganan Claude Acut (dengan PPN) ikut ditutup. (3) Target **30 keluarga aktif (cadangan 20)**, diturunkan Acut 20 Okt; tetap mengajak ± 150 keluarga dalam tiga gelombang lewat WhatsApp, tanpa tatap muka. Gerbang berbayar dievaluasi **paling cepat ± 26 April 2027**, bukan 29 Maret.


## Rencana Mendapat Pemakai Aktif Tanpa Tatap Muka (target 30 keluarga)

**Ringkas:** (1) Target **30 keluarga aktif di minggu ke-4** (cadangan 20; diturunkan Acut 20 Okt dari 50 · 30) didapat dengan tetap mengajak **± 150 keluarga dalam tiga gelombang**, supaya ada ruang kalau corong lebih rendah dari perkiraan lewat WhatsApp: 10 keluarga uji (± 10 Des), 60 ajakan bersama paket TKA (± 4 Jan), dan 80 ajakan bersama Baca Ulang (± 1 Feb). (2) Semua jalur memakai jaringan yang sudah dimiliki Acut (kontak pribadi, grup orang tua sekolah anak, orang tua kelas luring TKA, kontak pribadi Acut di gampong), ditambah ajakan berantai dari keluarga yang puas. Tidak ada langkah tatap muka. (3) Pesan ajakan dibuat jujur: gratis selama masa uji, imbalannya pendapat orang tua, data anak minimal, tanpa iklan, dan **tanpa janji nilai naik**.


## Angka Keberhasilan dan Patokan Sehat

**Ringkas:** (1) Satu tabel memuat semua angka yang dipantau masa gratis: kembali latihan setelah 7 dan 30 hari, lembar per minggu, kecepatan dan ketepatan, daya tahan, kepuasan orang tua, tanggapan pertanyaan masukan, dan ukuran gerbang berbayar. Setiap angka punya target, cadangan, dan cara hitung. (2) Angka dibagi tiga warna di panel: **sehat** (≥ target), **waspada** (antara target dan cadangan), **bahaya** (< cadangan). Bahaya selalu masuk temuan mingguan. (3) **Tabel ini adalah satu-satunya sumber angka target**; berkas lain merujuk ke sini (diputuskan 20 Okt setelah pemeriksaan menemukan angka yang berbeda-beda). Semua patokan **[ASUMSI]** awal, kecuali yang diambil dari `claude/metode-lancar.md` dan riset. Dinilai ulang di minggu ke-4 dan ke-8, tetapi angka gerbang berbayar dikunci sebelum data terlihat.


## Hitungan Uang

**Ringkas:** (1) Selama masa gratis (dihitung untuk ± 50 keluarga sebagai batas atas; target resmi sekarang 30), biaya bulanan **± Rp478 ribu di Desember–Januari** (hanya teknologi, sebab Acut memeriksa isi sendiri sampai R2) dan **± Rp1,44 juta di Februari–Mei** (teknologi + honor guru). Rata-rata ± Rp1,29 juta di rencana lama turun menjadi ± Rp1,1 juta. Pada 500 keluarga ± Rp1,44 juta, dan pada 1.000 keluarga ± Rp2,55 juta per bulan. Jadi biaya teknologi tidak menjadi alasan membatasi fitur. (2) Titik impas setelah berbayar (skenario Rp49 ribu per keluarga per bulan, diterima ± 77% setelah potongan Play dan PPN) adalah **39 keluarga membayar** pada skala 500 keluarga. Kalau langganan Claude Acut (dengan PPN) ikut ditutup, angkanya naik menjadi **87 keluarga**. (3) Harga final menunggu diskusi khusus berbayar. Tabel di sini menyiapkan tiga skenario harga (Rp39, 49, dan 59 ribu) supaya diskusi itu cepat.


## Jadwal per Minggu sampai Tayang di Play Store

**Ringkas:** (1) Jadwal berjalan **11 minggu** (19 Okt – 3 Jan) sampai **tayang Rilis 1 pada 22 Desember 2026** (cadangan 31 Desember), lalu paket TKA 4 Januari 2027. Kalau verifikasi Komdigi dihitung dalam hari kerja, keluarga uji baru masuk ± 4 Januari; jadwal ini memuat jalur cadangan itu. (2) Ada empat titik yang tidak boleh mundur: **nama pengendali data Jumat 6 November**, **pengajuan penilaian mandiri Jumat 13 November**, **unggah uji tertutup Selasa 24 November** (versi apa adanya, supaya hitungan 14 hari dan dua tinjauan Google tidak memakan Desember), dan **pembangunan Rilis 1 selesai Jumat 27 November**. (3) Kalau produksi belum tayang pada 4 Januari, gelombang ajakan tetap jalan **lewat jalur uji tertutup**, jadi kelas luring TKA tidak bergantung pada tanggal tayang.


## Tujuh Risiko Terbesar

**Ringkas:** (1) Tujuh risiko diurutkan dari yang paling mungkin menggagalkan rancangan: jadwal pembangunan yang ketat, penilaian mandiri Komdigi, nama pengendali data dan PSE, keluarga yang berhenti di minggu ke-3 sampai ke-4, isi yang tidak siap, data hilang atau bocor, dan masa gratis yang tidak pernah menjadi pendapatan. (2) Setiap risiko punya tanda awal yang **bisa dilihat di panel atau di kalender**, bukan perasaan, dan satu tindakan pencegah yang sudah ada di rancangan. (3) Tiga di antaranya bergantung pada tindakan Acut dalam 4 minggu ke depan: nama pengendali data (6 Nov), pengajuan Komdigi (13 Nov), dan berkas TKA (31 Okt).


## Tabel Tindak Lanjut

**Ringkas:** (1) Semua tindak lanjut dari Tahap 0–5 digabung dalam satu tabel berurutan tanggal: **apa, siapa, kapan, dan bukti selesai**. (2) Dari 40 baris, 32 melibatkan Acut, dan hampir semuanya bisa dikerjakan dari HP. Tugas yang paling menentukan jatuh dalam tiga minggu pertama: cetakan isi, berkas TKA, nama pengendali data, dan pengajuan Komdigi. (3) Tabel ini diperbarui setiap Senin bersama ringkasan mingguan. Baris yang selesai dicoret, bukan dihapus.


# Bagian 6 — Keputusan


## Catatan Keputusan — Pintar Main (dulu Belajar Menarik, nama kerja Pandu Anak)

**Ringkas:** (1) Semua keputusan yang sudah dikunci sampai 20 Oktober 2026, beserta sebabnya; perbaikan setelah pemeriksaan akhir dicatat di bagian C dan J. (2) Setiap ganti arah dicatat dengan tanggal, apa yang berubah, dan sebabnya. (3) Di akhir setiap tahap ada daftar hal yang sengaja ditunda.

Keputusan terbaru (20–28 Okt) dimuat utuh:

### B7. Jawaban Acut atas pertanyaan pilihan (20 Okt 2026, ± 11.50 WIB)

| # | Keputusan | Akibat langsung untuk rancangan |
|---|---|---|
| 1 | **Versi 5 dipasang sekarang** ke link versi 4 yang sudah dibagikan | Dipasang 20 Okt, apa adanya (lambang "÷" dan level kelas 6 lama tetap; keduanya diganti di aplikasi Android). Data profil anak versi 4 terbawa |
| 2 | **A5 = "Gratis, dibayar dengan masukan sukarela"; imbalan B disempitkan** | Penjawab mendapat kartu terima kasih + kabar perubahan; fitur lebih awal hanya Perintis yang diundang |
| 3 | **Lembar tetap 20 soal; takaran Lancar 2–5 menit** | `01-produk/04` bagian 3 dan 4.1; pesan ajakan menyebut "2–5 menit sehari" |
| 4 | **Target turun menjadi 30 keluarga aktif (cadangan 20)** | `06-rilis/01`, `06-rilis/02`, `01-produk/09` (G2 ≥ 30 · ≥ 20; G8 cerita Perintis); ajakan tetap ± 150 |
| 5 | **Jalur gampong hanya lewat kontak pribadi Acut** | Bukan grup perangkat desa atau saluran resmi; aturan etik pendamping desa tetap dicek |
| 6 | **Akun Play Console pribadi dibuat Oktober 2026**; satu aplikasi (Jeumpa) sedang uji tertutup, sisa 12 dari 14 hari per 20 Okt | Syarat 12 penguji × 14 hari **berlaku** untuk akun ini; jadwal uji tertutup tetap. Penguji yang sama boleh dipakai lagi **[ASUMSI — dicek apakah persetujuan akses produksi berlaku per aplikasi]** |
| 7 | **Acut memeriksa isi sendiri sampai Rilis 2**; guru mulai Februari 2027 | `01-produk/03` bagian 6.2a; honor Nov–Jan Rp0; beban Acut ± 3 jam per minggu tambahan |
| 8 | **Pengajar kelas luring: belum ada, diputuskan nanti** | Tenggat tetap Jumat 11 Des; sampai itu latihan rumah TKA mengikuti Jalur Mandiri |

### B8. Penegasan Acut 28 Okt 2026 (lima poin)

| # | Penegasan | Akibat langsung untuk rancangan |
|---|---|---|
| 1 | Sistem harus punya **gudang data ilmu SD yang lengkap**, kelas 1–6 | Gudang Ilmu: peta topik lengkap di R1, kartu ilmu diisi bertahap 2027 (`01-produk/10` bagian 2) |
| 2 | Belajar sambil bermain, anak diarahkan mandiri; yang tidak bisa diberi tanda **perlu bimbingan orang tua** atau **perlu bimbingan guru** | Tanda bimbingan tiga tingkat (`01-produk/10` bagian 3) |
| 3 | Menu bimbingan orang tua dan guru baru terbuka di akun anak **setelah disetujui orang tua** | Mode Dampingi dengan PIN (sudah ada); Bimbingan Guru dengan undangan + persetujuan orang tua pemilik, R3 (`01-produk/10` bagian 4) |
| 4 | Waktu belajar efektif sesuai riset, sesudahnya game dengan batas waktu sesuai riset | Belajar ≤ 10 menit × kelas dalam blok ≤ 15 menit; game setelah inti harian 20–30 menit, maks. 60 (`01-produk/10` bagian 5) |
| 5 | Isi dan fasilitas hanya untuk kelas yang didaftarkan | Sudah ada sejak 19 Okt; ditegaskan dengan tabel fasilitas per kelas (`01-produk/10` bagian 6) |

### B9. Keputusan Acut 28 Okt 2026 (sore) — tiga pertanyaan dari penegasan

| # | Keputusan | Akibat untuk rancangan |
|---|---|---|
| 1 | **Batas waktu belajar dan game disetujui** | Belajar ≤ 10 menit × kelas, blok ≤ 15 menit; game setelah inti harian 20/30 menit, orang tua mengatur 0–60; jam tenang 21.00 (`01-produk/10` bagian 5.2) |
| 2a | **Gudang Ilmu kelas 6 diisi dulu**, fokus TKA; aplikasi tetap untuk kelas 1–6 | Kartu Matematika kelas 6 R1.1 (4 Jan), Bahasa Indonesia kelas 6 R2 (1 Feb 2027), diperiksa Acut; kelas lain menyusul (`01-produk/10` bagian 2.3) |
| 2b | **Paket "Belajar Bahasa Inggris"** tingkat tetap 3–6, **bebas dipilih**; anak kelas 6 boleh mulai dari tingkat 3; boleh dibuka **semua anak kelas 1–6** | `01-produk/11-belajar-bahasa-inggris.md`; paket `inggris-t3…t6` diunduh menurut tingkat yang dipilih |
| 2c | Bahasa Inggris tersedia **Februari 2027, tanpa AI suara** | Tingkat 3–4 R2 (1 Feb), tingkat 5–6 R3 (22 Mar); ngobrol AI tetap R5 setelah uji suara; guru Bahasa Inggris pemeriksa dipilih paling lambat 15 Des |
| 3 | **Guru sekolah hanya melihat kemampuan dan memberi komentar**; **guru les** boleh memberi tugas dan catatan | Komentar guru sekolah sampai ke orang tua, tidak ada jalur ke anak; guru les seperti rancangan sebelumnya (`01-produk/10` bagian 4.1, Izin 6b, pertanyaan hukum no. 26) |

### B10. Merek Pintar Main (Acut, 28 Okt 2026)

| # | Keputusan | Akibat untuk rancangan |
|---|---|---|
| 1 | **Nama resmi: Pintar Main**, maskot **Pinci, Si Kancil Pintar**, menggantikan Belajar Menarik / Pandu Anak di semua berkas | `03-antarmuka/04-identitas-merek.md`; pertanyaan hukum no. 17 diperbarui; cek Play Store dan PDKI paling lambat 6 Nov |
| 2 | **Aksesori Pinci menjadi kejutan acak**, bukan poin dari belajar | Bergantian dengan kartu satwa (`01-produk/07` bagian 3.2) |
| 3 | **Slogan "Belajar dulu, main kemudian!" hanya untuk orang tua**; bintang hanya tanda selesai | Layar anak memakai "Pintar itu seru!"; tidak ada nilai 1–3 bintang |
| 4 | **Huruf gabungan**: Baloo 2 judul, Andika soal dan bacaan anak, Nunito mode orang tua | `03-antarmuka/03-aturan-tampilan.md` bagian 2 |

### B11. Keputusan Acut 29 Okt 2026 — dari perbandingan dengan Edufic

Dasar: `07-banding/01-edufic-vs-pintar-main.md`.

| # | Keputusan | Akibat untuk rancangan |
|---|---|---|
| 0 | **Pintar Main belum punya guru les sendiri.** Kelas sungguhan dengan guru dibuka di kemudian hari, waktunya belum ditentukan, saat peluangnya ada dan kuat | Celah "manusia" sementara ditambal lewat orang tua. Jalur guru (Bimbingan Guru R3, jenis guru les) disiapkan untuk guru Pintar Main kelak; tanda peluang diukur lewat pertanyaan masukan Mei 2027 (`07-banding/01` S4) |
| 1 | **Belum ada isi bernilai Islami, baik sisipan maupun paket.** Isi agama harus dari ahlinya; berhati-hati pada hal sensitif | Isi tetap umum + kearifan lokal Aceh. Dibahas lagi hanya kalau sudah ada ahli agama yang memeriksa |
| 2 | **Peta Perjalanan untuk orang tua di R2 (1 Feb 2027)** | Layar O21 + gambar untuk WhatsApp (nama panggilan dan hewan profil saja) |
| 3 | **Suara nama anak dibuat sekali lewat server** dengan suara Pinci saat profil dibuat, lalu disimpan di HP | Pinci menyapa "Halo, Rani!" tanpa internet. Google (layanan suara) masuk daftar pemroses untuk nama panggilan; cara yang sama boleh dipakai untuk pesan bebas orang tua bagi anak kelas 1–2 (P) |
| 4 | **Cerita Ulang + Ucapkan ke Bunda (Mode Dampingi) dan Hari Pamer bulanan masuk R2** | Hari Pamer dimajukan dari R4; dipotong lebih dulu kalau pembangunan R2 tidak muat |
| 5 | **Paket "Siap SMP" diputuskan di diskusi khusus berbayar** (paling lambat Jumat 29 Jan 2027) | Bahasa Inggris tingkat 5–6 ditawarkan ke kelas 6 sebagai lanjutan sesudah TKA |
| 6 | **Pesan suara WhatsApp bulanan dari Acut ke orang tua** (Izin 7), sampai 60 keluarga | ± 30 menit per bulan untuk 30 keluarga; lewat 60 keluarga diganti pesan tertulis |

### B12. Paket TKA diperkuat (Acut, 29 Okt 2026)

Dasar: penawaran "TKA Edufic Daily Drill" yang diterima Acut 29 Okt (`07-banding/01` bagian 1a).

| # | Keputusan | Akibat |
|---|---|---|
| 1 | **Mini try out mingguan 15 menit** masuk paket TKA | 6 soal campuran, skor masuk grafik rapor TKA (`01-produk/06` bagian 6a) |
| 2 | **"Rencana minggu ini"** untuk orang tua | Disusun otomatis tiap Senin dari topik anak yang masih lemah (`01-produk/06` bagian 6b) |
| 3 | **Kisi-kisi pola bilangan dicek** | Tidak termasuk kisi-kisi TKA SD (Perka BSKAP 047/H/AN/2025); 36 topik tetap (`01-produk/06` bagian 6c) |


## Pertanyaan Terbuka — Pintar Main

**Ringkas:** (1) Daftar hal yang belum diputuskan beserta siapa yang memutuskan dan kapan dibutuhkan. (2) Lima pertanyaan Tahap 0 sudah dijawab Acut 19 Okt dan dipindah ke `keputusan.md` bagian B2. (3) Baris dihapus begitu dijawab, dan jawabannya pindah ke `keputusan.md`.


# Bagian 7 — Perbandingan dengan Edufic


## Edufic dan Pintar Main — Perbandingan, Penilaian, dan Saran Pengembangan

**Ringkas:**

1. **Edufic dan Pintar Main bukan pesaing langsung.** Edufic menjual **waktu guru** (kelas live 3–6 anak) untuk pelajaran nilai dan keterampilan: coding, Bahasa Inggris, adab, sirah, bercerita. Pintar Main menjual **latihan harian mandiri** untuk pelajaran sekolah: Matematika, Bahasa Indonesia, TKA, Bahasa Inggris. Keduanya hanya bersinggungan di Bahasa Inggris dan di anggaran belajar orang tua.
2. **Untuk tujuan Pintar Main, metode kita lebih tepat dan lebih kuat buktinya**, jadi metode inti tidak perlu diganti. Tujuan itu adalah kemajuan Matematika dan Bahasa Indonesia yang terukur, murah, dan jalan tanpa sinyal. Edufic unggul di dua hal yang tidak bisa dibuat mesin:
   - **hubungan dengan manusia**: bimbingan langsung adalah salah satu cara belajar paling kuat, dengan efek 0,37 simpangan baku (Nickow dkk.);
   - **keterampilan menghasilkan**: berbicara, bercerita, dan membuat karya.

   Saran saya: untuk sekarang tambal kedua celah itu **lewat orang tua** (dan guru les milik keluarga, kalau ada). Pintar Main belum punya guru sendiri; **kelas sungguhan dibuka nanti saat peluangnya kuat** (penegasan Acut 29 Okt, lihat S4).
3. **Berkas usulan (12 usulan) sebagian besar layak diambil, tetapi ada 7 koreksi:**
   - klaim "semua celah Edufic sudah dijawab" berlebihan;
   - usul Kartu Jurusku bertentangan dengan bukti yang kita pakai;
   - suara Pinci tidak bisa menyebut nama anak;
   - usul pembayaran melupakan Google Play sebagai jalur utama;
   - R1.1 bukan rilis aplikasi, jadi layar baru tidak bisa masuk ke sana;
   - tiga usulan sebagian sudah ada di rancangan;
   - usul nilai Islami perlu pemeriksa agama.

   Saya juga menambahkan **6 saran baru**. Saran terpenting: **jembatan sesudah TKA**, sebab keputusan "kelas 6 dulu" membuat keluarga terbanyak kita berpotensi berhenti tepat saat gerbang berbayar (April–Juli 2027).


# Lampiran — Paket Draf Hukum


## Pengantar untuk Ahli Hukum — Paket Draf Aplikasi "Pintar Main"

**Ringkas:** (1) Paket ini berisi tujuh draf dokumen untuk aplikasi belajar anak SD yang menghubungkan orang tua dan anak. Semua draf disusun dengan bantuan AI dan **belum pernah diperiksa ahli hukum**. (2) Kami tidak meminta Anda menulis dari nol, tetapi **memeriksa, memperbaiki, dan menjawab 25 pertanyaan** di `06-daftar-pertanyaan-hukum.md`. Pekerjaan bisa sepenuhnya lewat email atau WhatsApp. (3) Ada satu tenggat keras: penilaian mandiri profil risiko (Permenkomdigi 9/2026, Kepmenkomdigi 142/2026) direncanakan diajukan **Jumat 13 Nov**, supaya anak dari keluarga lain bisa mulai memakai aplikasi setelah profil risiko ditetapkan.


## Draf Formulir Persetujuan Orang Tua

**Ringkas:** (1) Persetujuan diminta **per tujuan**, terpisah dari syarat dan ketentuan, dan setiap tujuan bisa disetujui atau ditolak sendiri (PP 33/2026). (2) Hanya tujuan **inti** yang wajib untuk memakai aplikasi, sebab tanpa data itu latihan dan rapor tidak bisa berjalan. Enam tujuan lain (termasuk kabar WhatsApp, dipisah 20 Okt) boleh ditolak tanpa mengurangi mutu layanan. (3) Setiap layar memuat tujuh informasi yang diwajibkan UU PDP Ps. 21, dalam kalimat pendek untuk layar HP, dengan tautan ke kebijakan privasi lengkap. **Draf, belum diperiksa ahli hukum.**


## Draf Kebijakan Privasi — Pintar Main

**Ringkas:** (1) Draf kebijakan privasi untuk aplikasi Android dan halaman rapor web, ditulis untuk orang tua dalam bahasa sehari-hari, ditambah satu bagian pendek untuk anak. (2) Isinya mengikuti data yang benar-benar dikumpulkan menurut rancangan (`02-rancangan/11-privasi-dan-keamanan.md` bagian 3), sebab Google Play mewajibkan kebijakan yang akurat. (3) Bagian bertanda `[…]` diisi setelah badan usaha dan pejabat pelindungan data ditetapkan. **Draf, belum diperiksa ahli hukum.**


## Draf Kertas Kerja Penilaian Mandiri Profil Risiko

**Ringkas:** (1) Draf kertas kerja menurut Kepmenkomdigi 142/2026 untuk aplikasi Pintar Main. Aplikasi ini memenuhi indikator "layanan yang dapat diakses anak", sebab memang ditujukan untuk anak. (2) Untuk aspek a–d, yang parameternya terbaca dari teks resmi, **semua parameter berstatus "tidak ditemukan"**, masing-masing dengan konfigurasi teknis dan bukti. Perkiraan bobot ditemukan 0%, jauh di bawah batas 50%. (3) Aspek e–g (adiksi, gangguan psikologis, gangguan fisiologis) **belum bisa diisi per parameter**, sebab teksnya belum terbaca. Yang ada baru daftar mitigasi kami, dan bagian ini wajib dilengkapi dari lampiran resmi sebelum pengajuan. **Draf, belum diperiksa ahli hukum.**


## Draf Syarat dan Ketentuan — Pintar Main

**Ringkas:** (1) Draf syarat dan ketentuan untuk orang tua, **terpisah** dari persetujuan data (PP 33/2026 melarang persetujuan digabung dengan syarat). (2) Tiga janji yang mengikat ditulis hati-hati: **masa gratis** (tanpa tanggal akhir, dengan pemberitahuan ≥ 30 hari sebelum berakhir), **masukan yang sukarela** (keputusan Acut 19 Okt: tidak ada fitur yang ditahan), dan **hak Keluarga Perintis** (bentuknya dikunci 19 Okt, angkanya menunggu diskusi khusus berbayar). (3) Tidak ada janji kenaikan nilai sekolah atau TKA. **Draf, belum diperiksa ahli hukum.**


## Draf Penilaian Dampak Pelindungan Data Pribadi

**Ringkas:** (1) Penilaian dampak disusun karena aplikasi memproses **data anak** (UU PDP Ps. 25 dan 34; PP Tunas; parameter DP04 Kepmenkomdigi 142/2026) dan memakai **keputusan otomatis** untuk menentukan tingkat soal. (2) Dari 12 risiko yang dinilai, setelah mitigasi tidak ada yang tinggi. Tiga yang tersisa di tingkat **sedang**: transfer ke luar negeri, link rapor yang diteruskan, dan kebocoran server. (3) Kesimpulan sementara: pemrosesan boleh dimulai setelah daftar periksa `11-privasi-dan-keamanan.md` bagian 7 terpenuhi. **Draf, belum diperiksa ahli hukum.**


## Daftar Pertanyaan untuk Ahli Hukum

**Ringkas:** (1) 25 pertanyaan, dikelompokkan dalam sembilan bidang yang disepakati 19 Oktober. Setiap pertanyaan menyebut keputusan apa yang bergantung pada jawabannya, supaya jawaban langsung bisa dipakai. (2) Enam pertanyaan bertanda **★ mendesak**, sebab memengaruhi pengajuan penilaian mandiri Jumat 13 Nov atau uji keluarga Desember. (3) Jawaban dicatat di `keputusan.md`.
