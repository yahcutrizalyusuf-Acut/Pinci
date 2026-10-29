# Prompt RCTOR — Pembangunan Aplikasi Pintar Main

> **Cara pakai:** buka Claude Code web, pilih repo **yahcutrizalyusuf-Acut/Pinci**, lalu tempel seluruh isi dari `## R — ROLE` sampai akhir sebagai pesan pertama. Prompt ini berjalan sendiri sampai selesai. Kalau sesi terputus atau batas pemakaian habis, buka sesi baru di repo yang sama dan ketik: **"Lanjutkan pembangunan dari KEMAJUAN.md."**
>
> Disusun 29 Oktober 2026. Format: Role · Context · Task · Output · Refine.

---

## R — ROLE

Kamu adalah tim pembangun aplikasi lengkap yang bekerja sendiri tanpa ditunggui. Kamu memegang tujuh keahlian sekaligus, dan memakai yang tepat di tiap langkah:

1. **Arsitek aplikasi mobile:** Expo, React Native, TypeScript, aplikasi yang tetap jalan tanpa sinyal.
2. **Pembuat game anak:** gerak yang empuk, sentuhan responsif, tanpa rasa kalah.
3. **Penyusun materi SD:** Matematika dan Bahasa Indonesia kelas 6, TKA SD, Bahasa Inggris Fase B dan C.
4. **Perancang tampilan:** menerjemahkan desain menjadi layar yang setia sampai ke ukuran dan warnanya.
5. **Penguji:** uji otomatis, pemeriksa kunci jawaban, pemeriksa tampilan.
6. **Penjaga privasi anak:** Kebijakan Keluarga Google Play, data seminim mungkin.
7. **Penulis laporan untuk orang awam:** Acut tidak menulis kode. Laporan untuknya ditulis dalam Bahasa Indonesia yang lugas.

## C — CONTEXT

**Pemilik:** Acut, Banda Aceh, punya anak kelas 4 dan kelas 6. Rancangan sistem sudah selesai (267 halaman), dan desain sudah dibuat di Claude Design. Sekarang aplikasinya dibangun.

**Bahan di repo ini (baca dulu, jangan dikarang ulang):**

| Folder atau berkas | Isi | Cara memakai |
|---|---|---|
| `CLAUDE.md` | Aturan tetap: teknologi, larangan, cara kerja | Wajib dipatuhi |
| `docs/rancangan/gabungan/Rancangan-Sistem-Pintar-Main-v1.4-ringan.md` | Ringkasan seluruh rancangan | Baca utuh pertama kali |
| `docs/rancangan/keputusan.md` | Semua keputusan Acut | Penentu bila ada pertentangan |
| `docs/rancangan/01-produk/04-mesin-lancar.md` | Aturan mesin Lancar | Dasar Tahap 2 |
| `docs/rancangan/01-produk/05-bahasa-indonesia.md` | Baca Ulang | Dasar Tahap 6 |
| `docs/rancangan/01-produk/06-persiapan-tka.md` | TKA: jalur mandiri, latihan rumah, simulasi, mini try out, rencana minggu ini, rapor | Dasar Tahap 3 |
| `docs/rancangan/01-produk/07-fitur-orang-tua-dan-anak.md` | Mode orang tua, Mode Dampingi, pesan | Dasar Tahap 5 |
| `docs/rancangan/01-produk/10-gudang-ilmu-bimbingan-dan-waktu.md` | Gudang Ilmu, tanda bimbingan, batas waktu | Dasar Tahap 5 dan 8 |
| `docs/rancangan/01-produk/11-belajar-bahasa-inggris.md` | Paket Bahasa Inggris tingkat 3–6 | Dasar Tahap 7 |
| `docs/rancangan/02-rancangan/` | Arsitektur, basis data, tahan putus sinyal, paket isi, pembuat soal, privasi | Dasar Tahap 1 dan 9 |
| `docs/rancangan/03-antarmuka/` | Daftar layar dan alur, kerangka layar, aturan tampilan, identitas merek, brief desain | Dasar semua layar |
| `desain/gambar-layar/*.png` | 31 gambar desain (360 × 800) | Acuan visual. Bandingkan dengan tangkapan layarmu |
| `desain/dari-claude-design/*.dc.html` | Sumber desain: SVG Pinci, warna, ukuran, logika interaksi | Ambil SVG dan angka dari sini |
| `bahan/kursus-tka-sd/` | Paket Siap TKA SD milik Acut: 24 modul Matematika, 12 modul Bahasa Indonesia, 5 simulasi, 36 teks baca cepat, standar soal, laporan pemeriksaan mutu | **Sumber utama materi TKA dan Baca Ulang kelas 6** |
| `bahan/kursus-tka-sd/_alat/periksa.py` | Pembaca format soal baku (`blok_soal`) dan pemeriksa kunci yang sudah dipakai | Tiru logikanya di skrip impor |
| `bahan/purwarupa-lancar-v5/` | Purwarupa Lancar versi 5 (HTML) dan dokumen Metode LANCAR | Pindahkan pembuat soal dan aturan naik-turun level dari sini |
| `arsip-flutter/` | Percobaan tahap 1 dengan Flutter (4.840 baris): layar anak, PIN, Kabar, Rapor, Pengaturan waktu, catatan pengembang. **Tidak dipakai lagi** karena aplikasi dibangun dengan Expo | Acuan perilaku saja. Pertahankan aturan desain di `arsip-flutter/README.md` bagian "Aturan desain yang dijaga di kode". Jangan menyalin kodenya, dan jangan memakai Firebase |

**Keputusan untuk pembangunan ini:**

| Hal | Keputusan |
|---|---|
| Cakupan | Kelas 6 dulu: Lancar Matematika kelas 6, Baca Ulang kelas 6, Persiapan TKA Matematika dan Bahasa Indonesia, Gudang Ilmu kelas 6, Belajar Bahasa Inggris tingkat 3–6, mode orang tua, Mode Dampingi, 4 game. Anak kelas lain tetap bisa dibuat profilnya. Mereka mendapat Bahasa Inggris, game, dan tulisan "Paket kelasmu sedang disiapkan" |
| Layar TKA | Isi TKA dibuka di aplikasi ini juga. Siapkan saklar tanggal buka (`TKA_BUKA=2027-01-04`) yang bisa dimatikan untuk uji |
| Server | Lokal dulu. Data di HP (SQLite). Skema dan adaptor Supabase ditulis lengkap tetapi mati |
| Akun | Mode lokal: buat keluarga di HP, PIN orang tua 4 angka, tambah anak (nama panggilan, kelas, hewan profil). Layar masuk lewat email disiapkan untuk mode Supabase |
| Suara | Mesin suara HP (expo-speech) untuk Bahasa Indonesia dan Inggris. Suara rekaman Pinci menyusul |
| Coba di HP | APK otomatis lewat **GitHub Actions** (tanpa akun Expo), ditambah Expo Go lewat EAS Update kalau `EXPO_TOKEN` tersedia |
| Repo | `yahcutrizalyusuf-Acut/Pinci`, privat. Nama aplikasi di layar: **Pintar Main**. Paket Android: `id.pintarmain.app` |

## T — TASK

Bangun aplikasi Pintar Main dalam **sekali jalan**, tahap demi tahap, tanpa berhenti untuk bertanya. Prioritas utama: **materi dan game harus maksimal.**

### Cara bekerja sepanjang tugas

- **Daftar tugas:** buat daftar tugas (TaskCreate) berisi tahap 0–11 di bawah, lalu tandai selesai satu per satu.
- **Subagen (Agent):** kerjakan secara paralel pekerjaan yang tidak saling bergantung. Contohnya impor modul Matematika dan Bahasa Indonesia, menulis 4 tingkat Bahasa Inggris, dan membangun 4 game. Beri tiap subagen tugas yang jelas, berkas yang boleh diubah, dan perintah uji yang harus lulus. Satu subagen hanya mengubah folder miliknya.
- **Skill:** muat skill yang tersedia sebelum dipakai. Contohnya `frontend-design` untuk mutu tampilan, dan skill pemeriksa atau penguji bila ada. Pakai ToolSearch untuk menemukan alat yang belum termuat.
- **Tidak bertanya:** kalau ada yang tidak jelas, ambil pilihan yang paling sesuai rancangan, catat di `KEPUTUSAN-PEMBANGUNAN.md`, lalu lanjut. Satu-satunya alasan berhenti: tindakan yang tidak bisa dibatalkan di luar repo ini.
- **Simpan kemajuan:** setiap tahap selesai, jalankan `npm run periksa`, commit, push, dan perbarui `KEMAJUAN.md`. Isinya: tahap terakhir yang selesai, yang sedang dikerjakan, dan langkah berikutnya, supaya sesi baru bisa melanjutkan.
- **Bila sesi terputus:** sesi baru membaca `KEMAJUAN.md` dan `git log`, lalu melanjutkan dari tahap yang belum selesai, tanpa mengulang tahap yang sudah lulus.

### Tahap 0 — Persiapan repo

1. Pastikan sesi berada di repo `yahcutrizalyusuf-Acut/Pinci` dan bahan di tabel Context ada. **Kalau dijalankan di laptop dan repo belum ada**, buat repo dengan `gh repo create yahcutrizalyusuf-Acut/Pinci --private --source=. --remote=origin --push`. Kalau pembuatan repo ditolak (sesi cloud tidak diizinkan membuat repo), catat di laporan dan lanjutkan di repo yang sedang dipakai.
2. Baca utuh `CLAUDE.md`, versi ringan rancangan, `keputusan.md`, `03-antarmuka/01-daftar-layar-dan-alur.md`, dan lihat semua gambar di `desain/gambar-layar/`.
3. Tulis `docs/RENCANA-PEMBANGUNAN.md`: daftar layar yang dibangun (kode layar rancangan ↔ berkas desain ↔ rute expo-router), daftar paket isi, dan pembagian kerja subagen.

### Tahap 1 — Fondasi

1. Buat proyek Expo TypeScript dengan expo-router. Pasang pustaka sesuai `CLAUDE.md`, dan periksa tiap pustaka terhadap aturan Kebijakan Keluarga.
2. **Sistem desain sebagai kode** (`src/desain/`): token warna, huruf, ukuran, radius, dan bayangan diambil dari `Main.dc.html`. Komponen dasar: Tombol (utama, garis tepi, besar 64–72 px), Kartu, Gelembung Pinci, Bilah kemajuan, Papan angka, Navigasi bawah gaya WhatsApp (Belajar · Gudang Ilmu · Main · Pesan), Kepala layar, Tombol 🔊.
3. **Pinci sebagai komponen SVG** dengan ekspresi: menyapa, melambai, semangat, merayakan, berpikir, minum (istirahat), menguap (waktu habis), bersin. Gerakan kecil berulang memakai reanimated: berkedip, telinga bergerak.
4. **Lapisan data:** antarmuka repositori dengan adaptor SQLite (aktif) dan adaptor Supabase (mati). Antrean sinkron sesuai `04-tahan-putus-sinyal.md`, berupa tanda "Tersimpan ✓ / Terkirim ✓✓".
5. Tabel lokal sesuai `03-basis-data.md`, cukup yang dibutuhkan cakupan ini: keluarga, anak, sesi latihan, jawaban per soal, kemajuan level, kemajuan topik, pesan, pengaturan waktu, catatan pemakaian waktu.
6. Alur awal: A01 Selamat datang → buat keluarga dan PIN → tambah anak → A02 Pilih profil → A03 Beranda Belajar. Kunci mode orang tua dengan PIN.
7. **Penjaga waktu:** layanan yang menghitung menit belajar dan menit main per anak per hari, blok 15 menit → layar Istirahat (A07), batas harian → Cukup belajar hari ini (A07b), jam tenang.
8. Efek bunyi pendek (plop, ting, pesta kecil) dibuat dengan skrip Node ke berkas WAV kecil di `assets/bunyi/`. Bisa dimatikan orang tua.
9. Skrip `npm run periksa` = `tsc --noEmit && eslint . && jest`.

### Tahap 2 — Lancar Matematika kelas 6

1. Pindahkan pembuat soal dari `bahan/purwarupa-lancar-v5/latihan-hitung-cepat-v5.html` ke TypeScript murni (`src/mesin/lancar/`): benih acak, 6 level kelas 6 (kuadrat dan akar ≤ 15 · pecahan ↔ persen ↔ desimal setara · KPK dan FPB bilangan kecil · persen mudah · urutan operasi · campur), target detik per soal dari `04-mesin-lancar.md` bagian 4.1.
2. Aturan lengkap: tes penempatan (4 soal per level), lembar 20 soal (14 level ini + 6 level sebelumnya), naik 2 lembar tepat berturut-turut atau kilat, turun bila salah ≥ 6, soal salah atau lambat diulang, uji daya tahan 3 minggu, data per soal. Bila ada pembuat soal kelas 1–5 di purwarupa, pindahkan juga, karena mesinnya sama.
3. Layar: A04 Jurus (satu jurus per level: inti, 2–3 contoh jadi, catatan ingat), A05 Lembar Lancar (papan angka besar, tanpa hitung mundur, Pinci menemani), A06 Akhir lembar (benar, waktu, rekor sendiri, pilihan perasaan hewan).
4. **Uji wajib:** 8.100 lembar acak lulus pemeriksa kunci (kunci dihitung ulang dengan cara berbeda), tidak ada soal kembar dalam satu lembar, urut dari mudah ke sulit, aturan naik dan turun diuji dengan data buatan.

### Tahap 3 — Persiapan TKA (materi terpenting)

1. **Skrip impor** `scripts/impor-tka.ts`: baca semua `bahan/kursus-tka-sd/01-modul-matematika/*.md`, `02-modul-bahasa-indonesia/*.md`, `*/simulasi/*.md`, dan `03-bank-teks-baca-cepat/*.md` dengan format baku `00-berkas-induk/04-standar-soal.md` (tiru `blok_soal` di `_alat/periksa.py`). Hasilnya `assets/paket/tka-k6.json`: topik (36), salah paham per topik, contoh jadi, soal kelas ●, soal cadangan ○, latihan rumah, simulasi S1–S5 (5 × 30 butir), teks T01–T36 beserta pertanyaannya. Tiap butir punya id tetap, bentuk (PG · PG kompleks · PG kategori), kunci, alasan pengecoh, topik, dan status.
2. **Uji impor:** jumlah topik 36, simulasi 5 × 30, teks 36. Tiap soal punya kunci yang valid untuk bentuknya, dan sebaran kunci sesuai standar. Butir yang gagal dibaca dicatat di `docs/LAPORAN-IMPOR-TKA.md`, bukan dibuang diam-diam.
3. **Pemeriksa kunci Matematika:** untuk butir yang angkanya bisa dihitung (operasi, pecahan, persen, KPK/FPB, satuan, luas, volume, rata-rata, perbandingan), hitung ulang kuncinya dengan kode. Ketidakcocokan dicatat sebagai temuan dan butirnya diberi status `perlu_dicek`.
4. Layar dan fitur (lihat `06-persiapan-tka.md`):
   - B06 Siap TKA: peta 36 topik dan kesiapan per topik.
   - Jalur Mandiri per topik: sasaran → salah paham → contoh jadi → soal berjenjang dengan **petunjuk bertahap 1/3, 2/3, 3/3**, dan penjelasan pengecoh sesudah menjawab.
   - Latihan rumah digital.
   - Simulasi bertempo 30 butir (tempo terlihat tenang, bukan hitung mundur merah), tampilan mendekati layar komputer ujian.
   - **Mini try out mingguan:** 6 soal campuran, 15 menit, 4 dari topik 1–2 minggu terakhir + 2 dari ≥ 3 minggu lalu, bawaan hari Sabtu, tidak di minggu simulasi.
   - **Rencana minggu ini** (tiap Senin, untuk orang tua): 1 topik baru, 1–2 topik lemah, 1 ulang uji tunda, dan hari mini try out.
   - Rapor kesiapan TKA dengan **penyebab salah** (dari pengecoh yang dipilih), bukan hanya nilai.
5. Teks dan simbol matematika (pecahan, persen, satuan, tabel, denah kubus, blok teks) dirender rapi di HP: pecahan bertumpuk, tabel bisa digeser, denah kubus digambar sebagai petak.

### Tahap 4 — Empat game (fokus mutu rasa main)

Ikuti aturan rasa game di brief desain (`05-brief-desain-claude-design.md`, Tahap 4) dan gambar G01–G08. Tiap game: tingkat **Santai** dan **Seru**, isi disesuaikan kelas anak 1–6, babak 2–4 menit, pesta kecil ≤ 1,5 detik, "Main lagi" / "Ganti game", kejutan lucu acak (rangkong lewat, Pinci bersin, ikan melompat), dan matahari kecil penunjuk sisa waktu. Langit menjadi senja di 2 menit terakhir.

| Game | Inti | Isi per tingkat |
|---|---|---|
| G03 Pasar Gampong | Membayar dengan uang bergaya sederhana. Total terhitung sambil diketuk. Kembalian di tingkat Seru | Kelas 1–2: ≤ Rp10.000 · 3–4: ≤ Rp50.000 + kembalian · 5–6: belanja 2–3 barang, diskon atau persen mudah |
| G04 Ular Tangga Lurus 1–100 | Papan 10 × 10 berurutan kiri ke kanan tiap baris, sulur ramah sebagai pengganti ular, dadu besar, melawan Pinci | Santai: maju sesuai dadu · Seru: sebelum melangkah jawab satu soal singkat sesuai kelas (salah tidak menghukum, Pinci memberi petunjuk) |
| G05 Susun Kubus | Susun kubus agar cocok dengan kartu tampak depan / atas / samping. Seret dengan magnet, tombol urung, garis putus-putus untuk yang belum cocok | Bertingkat dari 3 kubus sampai denah 3 × 3 bertumpuk (bahan TKA visualisasi spasial M17) |
| G06 Tebak Kata | Gambar + 🔊, pilih suku kata atau huruf | Kelas 1–2: suku kata · 3–4: kata berimbuhan · 5–6: kata baku atau kosakata Inggris dari tingkat yang dipilih |

- Logika tiap game dipisah dari tampilan (`src/game/<nama>/logika.ts`) dan diuji Jest: babak selalu bisa diselesaikan, tidak ada keadaan buntu, isi tidak berulang dalam satu babak.
- Respons sentuh ≤ 100 ms, gerak 200–400 ms dengan pegas, 60 fps (reanimated di UI thread). Kelas 1–2 hanya ketuk, kelas 3–6 boleh seret.
- G01 Waktu main (peta Gampong 4 tempat), G02 Pilih tingkat, G07 Akhir babak, G08 Waktu habis (babak yang berjalan diselesaikan dulu).
- Bawaan: waktu main terbuka setelah inti harian selesai. Orang tua bisa memilih "selalu terbuka".

### Tahap 5 — Mode orang tua dan Mode Dampingi

1. O09 Kabar: kabar harian tiap anak dalam satu layar gaya WhatsApp.
2. O10 Ruang anak, O11 Rapor mingguan (per mapel, penyebab salah, rekor, menit belajar), O12 Pengaturan waktu, P08 Bimbingan (tanda hijau/kuning/merah beserta alasan, tombol "Mulai Dampingi"), P09 Kelola guru (dibangun tetapi disembunyikan dengan saklar fitur, karena masuk R3).
3. A08 Pesan: orang tua mengirim pesan teks atau stiker. Anak membalas stiker. Tanpa kontak dari luar keluarga.
4. B07 Mode Dampingi untuk TKA, Lancar, dan Baca Ulang (Dengar Bacaan: orang tua menandai kata yang salah).
5. Kartu "Tips Ayah Bunda": tulis 30 kartu singkat berdasarkan rancangan, status `belum_diperiksa`.

### Tahap 6 — Baca Ulang kelas 6

Alur sesuai `05-bahasa-indonesia.md`: baca dingin dengan tombol mulai/selesai → dengar contoh (mesin suara) → baca lagi → jawab pertanyaan. Kata per menit dicatat, dengan penjaga curang (terlalu cepat dibuang). Teks dari T01–T36 beserta pertanyaannya. Layar B03.

### Tahap 7 — Belajar Bahasa Inggris tingkat 3–6

1. Tulis isi 4 tingkat × 12 unit sesuai tema di `11-belajar-bahasa-inggris.md` bagian 2 (Fase B untuk tingkat 3–4, Fase C untuk tingkat 5–6). Tiap unit berisi 8–10 kosakata, 2–3 pola kalimat dengan arti, dengar lalu pilih, susun kata (tingkat 4–6), dan permainan kata. Kerjakan dengan 4 subagen paralel, satu per tingkat.
2. Gambar kosakata: emoji sistem bila cocok, atau ikon SVG sederhana buatan sendiri. Pilih kata yang bisa digambar.
3. B04 Pilih tingkat (tes singkat ± 2 menit yang menyarankan tingkat, semua tingkat bebas dipilih), B05 Unit. Kata yang salah diulang berjarak.
4. Satu berkas paket per tingkat (`assets/paket/inggris-t3.json` dan seterusnya). Semua butir berstatus `belum_diperiksa`.

### Tahap 8 — Gudang Ilmu kelas 6

B01 peta topik kelas 6 per mapel (belum · belajar · kuasai · segera). B02 kartu ilmu: penjelasan bergambar dan bersuara → 2 contoh jadi → 5–10 soal berjenjang dengan kunci bertahap. **Buat kartu ilmu untuk semua topik Matematika kelas 6** dari isi modul TKA (paling sedikit 24 kartu) dan topik Bahasa Indonesia sebanyak mungkin. Tanda "lebih seru bersama Ayah/Bunda" pada topik yang cocok.

### Tahap 9 — Supabase siap disambung

`supabase/migrations/*.sql` sesuai `03-basis-data.md`, termasuk Row Level Security per keluarga (bagian 4). Adaptor Supabase lengkap dan diuji dengan tiruan. `docs/CARA-MENYAMBUNG-SUPABASE.md` berisi langkah untuk Acut: buat proyek Singapura, isi dua kunci, ubah satu saklar.

### Tahap 10 — Uji menyeluruh dan pemeriksaan bebas

1. `npm run periksa` lulus. Cakupan uji mesin Lancar, impor TKA, dan logika game ≥ 80%.
2. **Tangkapan layar:** jalankan build web Expo, lalu ambil tangkapan setiap layar dengan Playwright pada 360 × 800. Simpan di `docs/tangkapan/`, lalu letakkan berdampingan dengan gambar desain yang sesuai di `docs/BANDING-DESAIN.md`. Lihat sendiri hasilnya dan perbaiki yang menyimpang (warna, ukuran, jarak, huruf).
3. **Pemeriksa bebas:** jalankan dua subagen baru yang tidak ikut membangun.
   - **Pemeriksa produk:** cocokkan aplikasi dengan `CLAUDE.md`, `keputusan.md`, dan aturan rasa game. Daftar pelanggaran disertai berkas dan baris.
   - **Pemeriksa materi:** ambil 60 butir acak (TKA, Lancar, Inggris, kartu ilmu), kerjakan sendiri, lalu laporkan kunci salah, bahasa kaku, atau isi di luar kelas.
   - Perbaiki semua temuan yang benar, lalu catat di `docs/LAPORAN-PEMERIKSAAN.md`.
4. Uji alur tanpa sinyal: semua latihan jalan tanpa jaringan dan antrean sinkron tersimpan.

### Tahap 11 — APK dan Expo Go

1. `app.json`: nama Pintar Main, paket `id.pintarmain.app`, ikon dan layar pembuka dari Pinci, izin Android seminim mungkin (tanpa lokasi, kamera, atau mikrofon). `eas.json` dengan profil `preview` (APK) dan `production` (AAB) untuk nanti.
2. **APK tanpa akun Expo:** buat `.github/workflows/bangun-apk.yml` yang berjalan setiap ada push ke `main` dan bisa dijalankan manual: pasang Node dan Java 17, `npm ci`, `npx expo prebuild -p android --no-install`, `./gradlew assembleRelease` (ditandatangani kunci debug untuk uji), lalu unggah `pintar-main-apk` sebagai artifact. Pastikan langkah ini benar-benar lulus: cek hasil Actions dengan `gh run list` dan `gh run view`, lalu perbaiki sampai hijau.
3. **Expo Go:** kalau variabel `EXPO_TOKEN` tersedia, jalankan `eas update --branch preview --message "Pembangunan pertama"`, lalu catat tautan halaman Expo (kode QR) di laporan. Kalau tidak ada, lewati dan tulis caranya di `docs/CARA-MEMBUAT-APK.md`.
4. Buka pull request ke `main` (kalau sesi bekerja di cabang lain) dengan ringkasan isi, supaya Actions membangun APK setelah Acut menekan Merge.

## O — OUTPUT

Di akhir, repo berisi:

| Berkas | Isi |
|---|---|
| Kode aplikasi | `app/` (rute), `src/` (desain, komponen, mesin, game, data), `assets/paket/` (isi), `scripts/`, `supabase/` |
| `LAPORAN-PEMBANGUNAN.md` | **Untuk Acut, Bahasa Indonesia lugas, maksimal 2 halaman:** apa yang sudah jadi (tabel layar dan fitur), jumlah materi per paket (soal, teks, unit, kartu), cara mencoba di HP (unduh APK dari tab Actions, dan Expo Go bila ada; langkah bernomor), apa yang belum jadi dan alasannya, hasil uji dan pemeriksaan, keputusan yang diambil sendiri, dan 3 langkah berikutnya beserta siapa yang mengerjakan |
| `KEMAJUAN.md` | Status tiap tahap |
| `KEPUTUSAN-PEMBANGUNAN.md` | Keputusan sendiri beserta alasannya |
| `docs/RENCANA-PEMBANGUNAN.md`, `docs/LAPORAN-IMPOR-TKA.md`, `docs/BANDING-DESAIN.md`, `docs/LAPORAN-PEMERIKSAAN.md`, `docs/CARA-MENYAMBUNG-SUPABASE.md`, `docs/CARA-MEMBUAT-APK.md` | Seperti dijelaskan di tiap tahap |
| `docs/DAFTAR-PERIKSA-GURU.md` | Daftar semua isi berstatus `belum_diperiksa`, dikelompokkan per paket, siap dibagikan ke guru pemeriksa |

Pesan terakhir di sesi: ringkasan 5–8 baris berisi apa yang jadi, tautan APK/Expo (kalau ada), dan langkah berikutnya untuk Acut.

## R — REFINE

Sebelum menyatakan selesai, periksa daftar ini satu per satu, dan perbaiki yang belum:

- [ ] Semua layar di `desain/gambar-layar/` punya padanan di aplikasi, dan tampilannya sudah dibandingkan.
- [ ] 36 topik TKA, 5 simulasi, dan 36 teks masuk aplikasi, atau kekurangannya tercatat beserta alasannya.
- [ ] Kunci Matematika yang bisa dihitung sudah dihitung ulang oleh kode, dan 8.100 lembar Lancar lulus.
- [ ] 4 game bisa dimainkan dari awal sampai akhir di tingkat Santai dan Seru, tanpa kalah, tanpa hitung mundur, dan berhenti lembut saat waktu habis.
- [ ] 48 unit Bahasa Inggris dan paling sedikit 24 kartu ilmu Matematika kelas 6 ada.
- [ ] Batas waktu belajar dan main, jam tenang, PIN orang tua, dan "waktu main setelah inti harian" bekerja.
- [ ] Tidak ada pustaka iklan, analytics, atau pelacak. Izin Android seminim mungkin. Tidak ada rekaman suara anak.
- [ ] Tidak ada kalimat "selesaikan latihan untuk dapat game", tidak ada isi keagamaan, dan tidak ada tiruan uang Rupiah asli.
- [ ] Aplikasi jalan penuh tanpa sinyal.
- [ ] Proses **Bangun APK** di GitHub Actions hijau, dan artifact `pintar-main-apk` bisa diunduh.
- [ ] `npm run periksa` lulus, semua sudah di-push, dan `LAPORAN-PEMBANGUNAN.md` bisa dipahami orang yang tidak menulis kode.
