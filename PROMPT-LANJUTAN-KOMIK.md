# Prompt RCTOR — Lanjutan: Riset Model Belajar dan Cerita Komik Bahasa Inggris

> **Cara pakai:** berkas bahan sudah dimasukkan ke repo **yahcutrizalyusuf-Acut/Pinci** (11 Nov 2026). Buka Claude Code web, pilih repo itu, lalu tempel seluruh isi dari `## R — ROLE` sampai akhir sebagai pesan pertama. Kalau sesi terputus atau batas pemakaian habis, buka sesi baru di repo yang sama dan ketik: **"Lanjutkan pekerjaan PROMPT-LANJUTAN-KOMIK dari KEMAJUAN.md."**
>
> Disusun 11 November 2026. Format: Role · Context · Task · Output · Refine.

---

## R — ROLE

Kamu adalah tim pembangun yang bekerja sendiri tanpa ditunggui, melanjutkan aplikasi Pintar Main yang sudah ada di repo ini. Keahlian yang kamu pakai:

1. **Pengembang Expo / React Native:** menambah fitur ke kode yang sudah ada tanpa merusaknya.
2. **Penulis cerita anak dan guru Bahasa Inggris SD (pelajar bahasa asing):** naskah komik pendek, lucu, hangat, dengan kosakata yang dikendalikan ketat dan satu pesan akhlak per komik.
3. **Perancang belajar Matematika:** benda → gambar → angka, model batang, soal cerita sehari-hari.
4. **Ilustrator SVG sederhana:** gambar sementara bergaya flat 2D yang rapi.
5. **Penjaga privasi anak:** rekaman suara hanya di HP, Kebijakan Keluarga Google Play.
6. **Penguji dan penulis laporan untuk orang awam:** Acut tidak menulis kode.

## C — CONTEXT

**Keadaan repo (per 11 Nov 2026):** tahap 0–24 di `KEMAJUAN.md` sudah selesai: aplikasi Expo SDK 58, 48 unit Bahasa Inggris (`assets/paket/inggris-t3.json` … `t6.json`, layar `src/app/inggris/`), Mode Dampingi (`src/app/dampingi/`), mode orang tua (`src/app/ortu/`), Supabase tersambung, kelas dan pengawas, halaman staf, langganan, dan masa coba. Baca `KEMAJUAN.md`, `KEPUTUSAN-PEMBANGUNAN.md`, dan `git log` sebelum mulai. **Bangun di atas kode yang ada**: perluas berkas paket dan layar yang sudah ada, jangan membuat modul Bahasa Inggris atau Dampingi kedua, dan jangan menulis ulang modul yang sudah lulus uji. Catat pekerjaan ini di `KEMAJUAN.md` sebagai **Tahap 25 — Riset model belajar dan Cerita Komik** (dengan sub-tahap 0–9 di bawah).

**Bahan baru (wajib dibaca utuh sebelum mulai):**

| Berkas | Isi |
|---|---|
| `CLAUDE.md` (diperbarui 11 Nov) | Aturan 2, 9, 10, 12, dan 13 diperbarui: rekaman suara, akhlak, dan komik |
| `docs/rancangan/01-produk/12-penerapan-riset-model-belajar.md` | Daftar perubahan: Matematika M1–M7, Bahasa Inggris E1–E8, lintas L1–L3, layar baru K30–K32 dan D10–D11, ukuran keberhasilan |
| `docs/rancangan/01-produk/13-cerita-komik-bahasa-inggris.md` | **Rancangan utama komik:** dunia cerita dan tokoh, petualangan per tingkat, pesan akhlak, alur layar, daftar centang orang tua, rekaman dan Dengar Bedanya, cara rakit panel, suara, bunyi jebakan, bentuk data, **contoh jadi komik "Hello, Robi!"** |
| `docs/rancangan/01-produk/11-belajar-bahasa-inggris.md` (diperbarui 11 Nov) | Bentuk unit baru (Sesi A Kenal, Sesi B Pakai, Bersama orang tua) |

**Keputusan yang berlaku untuk pekerjaan ini:**

| Hal | Keputusan |
|---|---|
| Tokoh komik | Fathan, Nisa, Dafi, Lina, Bima, Robi, Mister Kabut, Nek Ijah, Kak Fajar, di Gampong Bungong (`13` bagian 2.1). Nama dan sifat **belum final** (disetujui Acut paling lambat 20 Nov), jadi simpan semua nama tokoh di **satu berkas data** `assets/paket/tokoh.json` supaya bisa diganti tanpa mengubah kode atau naskah |
| Jumlah komik | **12 komik dulu:** tingkat 3 unit 1–6 dan tingkat 4 unit 1–6. Komik unit lain menyusul. Unit tanpa komik tetap bisa dipakai |
| Gambar panel | Belum ada gambar asli. Buat **gambar sementara** SVG (bagian Tahap 3). Gambar dimuat dari paket, jadi panel asli nanti tinggal ditukar |
| Rekaman | Dibangun sekarang, mengikuti `CLAUDE.md` aturan 12 dan `13` bagian 4. Dibuka lewat Izin 8 di mode orang tua (bawaan mati) |
| Suara tokoh | expo-speech, dibedakan dengan nada (`pitch`) dan kecepatan (`rate`) per tokoh, kecepatan ± 0,85 untuk tingkat 3–4 dan ± 0,95 untuk tingkat 5–6. Pengaturan suara per tokoh disimpan di `tokoh.json` |
| Belum dibangun | Lembar cetak mingguan (M6) dan Tingkat Pemula (E8) menunggu keputusan Acut. Chant (E5) menunggu. Jangan dibangun |
| Fitur rilis berikutnya | Main Peran (K32), pemanasan 3 soal lama (M3), jurus jari (M5), dan tes paham (M7): **bangun di balik saklar fitur** dalam keadaan mati, kecuali yang disebut aktif di tahap |

## T — TASK

Kerjakan tahap 0–9 berurutan, tanpa berhenti untuk bertanya.

### Cara bekerja sepanjang tugas

- **Daftar tugas:** buat daftar tugas (TaskCreate) berisi tahap 0–9, lalu tandai selesai satu per satu.
- **Subagen (Agent):** kerjakan paralel pekerjaan yang tidak saling bergantung. Contoh: satu subagen menulis 6 naskah komik tingkat 3, satu lagi 6 naskah tingkat 4, satu lagi membangun komponen Matematika. Beri tiap subagen berkas yang boleh diubah dan perintah uji yang harus lulus.
- **Skill:** muat skill yang tersedia sebelum dipakai, misalnya `frontend-design` untuk tampilan. Pakai ToolSearch untuk alat yang belum termuat.
- **Tidak bertanya:** kalau ada yang tidak jelas, ambil pilihan yang paling sesuai rancangan, catat di `KEPUTUSAN-PEMBANGUNAN.md`, lalu lanjut.
- **Simpan kemajuan:** setiap tahap selesai, jalankan `npm run periksa`, commit, push, dan perbarui `KEMAJUAN.md` (bagian baru "Lanjutan Komik").

### Tahap 0 — Membaca dan merencanakan

1. Baca utuh semua berkas di tabel "Bahan baru", lalu `KEMAJUAN.md` dan kode modul Bahasa Inggris, Gudang Ilmu, Mode Dampingi, dan pengaturan orang tua yang sudah ada.
2. Tulis `docs/RENCANA-LANJUTAN-KOMIK.md`: layar baru dan rutenya (K30, K31, K32, D10, D11, pengaturan Izin 8), perubahan pada layar lama, bentuk data baru, dan pembagian kerja subagen.

### Tahap 1 — Bentuk data dan pemeriksa naskah

1. Buat `assets/paket/tokoh.json`: id, nama, umur, kelas, sifat singkat, warna utama, pengaturan suara (bahasa, nada, kecepatan).
2. Tambahkan `komik` ke paket `inggris-t3.json` dan `inggris-t4.json` yang sudah ada (atau berkas `komik-t3.json`, `komik-t4.json` kalau lebih rapi), tanpa mengubah id unit dan kosakata yang sudah ada sesuai `13` bagian 8: per komik ada unit, judul, pesan akhlak, **Pesan Hari Ini** (Inggris + arti), panel (gambar, gelembung: id tokoh, teks, arti, posisi, arah ekor), kata target, kata bantu per panel, tips bunyi per panel, soal Cek Paham, naskah orang tua (termasuk pertanyaan renungan), ajakan perbuatan baik, `status: "belum_diperiksa"`.
3. Tambahkan per unit: **Bunyi Hari Ini** (bunyi, kata contoh dari unit, tips singkat dalam Bahasa Indonesia) dan **gerakan** untuk kata kerja atau perintah.
4. **Pemeriksa naskah otomatis** (`scripts/periksa-komik.ts` + uji Jest), gagal kalau:
   - jumlah panel di luar batas tingkat (tingkat 3: 4–5; tingkat 4: 5–6),
   - kata per gelembung melebihi batas (tingkat 3: 6; tingkat 4: 8),
   - ada kata target unit yang tidak muncul di komik,
   - kata di luar daftar kata unit ini dan unit sebelumnya lebih dari 2 per komik (abaikan nama tokoh dan kata seru),
   - ada panel tanpa kata bantu, komik tanpa pesan akhlak, atau soal Cek Paham yang jawabannya tidak cocok dengan isi komik,
   - ada kata dari daftar terlarang (senjata, darah, bunuh, dan sejenisnya) atau nama tokoh kartun yang sudah ada.

### Tahap 2 — Menulis 12 naskah komik

1. Tulis 12 komik petualangan **"Halo, Robi!"** (tingkat 3, unit 1–6) dan **"Kabut Misterius"** (tingkat 4, unit 1–6), sesuai tema unit di `11` bagian 2 dan garis cerita di `13` bagian 2.2. Komik tingkat 3 unit 1 **memakai contoh jadi di `13` bagian 9 apa adanya**.
2. Aturan naskah di `13` bagian 2 dan 2.3: satu kejadian per panel, setiap komik selesai sendiri, satu pesan akhlak lewat perbuatan tokoh, tokoh boleh berbuat salah lalu meminta maaf, lucu dan hangat, tanpa isi agama, Mister Kabut tidak menakutkan. Tingkat 3 bernuansa kehidupan kampung (menemukan dan berteman dengan Robi). Tingkat 4 mulai memunculkan kabut dan **Super Robi** pertama kali (unit 4–6).
3. Tips bunyi memakai daftar bunyi jebakan di `13` bagian 7.
4. Semua naskah lulus `periksa-komik`. Tulis juga `docs/NASKAH-KOMIK-UNTUK-GURU.md`: setiap komik dalam tabel panel (gelembung Inggris, arti, tips bunyi), siap diperiksa guru Bahasa Inggris.

### Tahap 3 — Gambar sementara

1. Buat komponen SVG flat 2D untuk tiap tokoh dengan ciri di `13` bagian 2.1 (warna baju, kerudung Nisa kuning, kerudung Lina biru muda, kacamata Dafi, kaus bola Bima, Robi bundar bermata layar biru). Paling sedikit 6 pose: berdiri, melambai, menunjuk, kaget, gembira, berjongkok.
2. Buat 8 latar sederhana: sawah, tepi sungai, lapangan bola, kedai Nek Ijah, rumah panggung, kelas, jalan gampong, sore hari.
3. Panel dirakit dari data (`latar` + daftar `tokoh, pose, posisi`), sehingga panel sementara dan panel asli memakai bentuk data yang sama. Tambahkan kolom `gambar` (berkas WebP) yang, kalau ada, menggantikan rakitan SVG.
4. Gaya sesuai `03-antarmuka/04-identitas-merek.md`: garis tepi cokelat tua, bayangan satu tingkat, warna lembut. Wajah anak khas Indonesia dan tidak mirip tokoh kartun mana pun. Tandai semua panel `gambar_sementara: true`.

### Tahap 4 — Unit Bahasa Inggris bentuk baru

Ubah layar unit yang sudah ada (`src/app/inggris/[unit].tsx`, rancangan B05 / K28) menjadi dua sesi sesuai `11` bagian 2:

1. **Sesi A — Kenal:** Kenal Kata (kata kerja menampilkan gerakan yang ditirukan anak: Pinci atau tokoh SVG bergerak pelan ≤ 1,5 detik) → **Bunyi Hari Ini** → Pola Kalimat → **Cerita Komik** (K30).
2. **Sesi B — Pakai:** **Cek Paham** (K31) → Dengar lalu Pilih → Susun Kata (tingkat 4–6) → Permainan Kata.
3. Sesi A dan B terhitung sebagai blok terpisah di penjaga waktu. Unit yang belum punya komik melewati langkah komik.
4. **Cek Dengar** setiap 4 unit: 8 soal dengar-lalu-pilih dari kata 4 unit terakhir, susunan tetap, hasilnya masuk rapor.
5. Kata yang salah di Cek Paham dan kata target yang tidak dicentang di Ceritakan Lagi masuk antrean pengulangan berjarak yang sudah ada.

### Tahap 5 — Layar Cerita Komik (K30) dan Cek Paham (K31)

Sesuai `13` bagian 3.1–3.2:

1. **Tonton:** panel muncul satu per satu, tiap gelembung dibacakan dengan suara tokohnya, kata disorot saat diucapkan. Pakai `onBoundary` expo-speech kalau tersedia di Android; kalau tidak, perkirakan waktu tiap kata dari panjang kata dan kecepatan suara (catat cara yang dipakai di `KEPUTUSAN-PEMBANGUNAN.md`). Panel berikut muncul setelah suara selesai, atau anak menggeser.
2. **Baca:** tanpa putar otomatis. Ketuk gelembung untuk mendengar, ketuk satu kata untuk mendengar kata itu + arti di kotak kecil. Tombol "Artinya?" menampilkan terjemahan kalimat (tidak tampil otomatis). Kelas 1–2: tombol 🔊 besar di tiap gelembung.
3. Kartu **Pesan Hari Ini** di akhir komik, dibacakan Pinci.
4. Gelembung dan teks digambar aplikasi di atas panel (huruf Andika ≥ 20sp). Panel diam tanpa animasi; yang bergerak hanya sorotan kata.
5. **Cek Paham:** urutkan panel (seret untuk kelas 3–6, ketuk berurutan untuk kelas 1–2), "siapa yang bilang?" (pilih wajah tokoh), dengar lalu pilih panel. Jawaban belum tepat: panel bergetar pelan dan menunjukkan tempatnya, lalu lanjut. Tanpa skor merah.

### Tahap 6 — Mode Dampingi: Ceritakan Lagi (D10), Dengar Bedanya (D11), Tebak Gerak

1. **Ceritakan Lagi** di menu Mode Dampingi yang sudah ada (`src/app/dampingi/index.tsx`) dan sebagai ajakan setelah komik selesai ("Ceritakan ke Ayah/Bunda, yuk!", dibuka dengan PIN). Isinya sesuai `13` bagian 3.3–3.4: panel tanpa teks + kata bantu yang bisa diketuk, naskah orang tua di atas layar, tombol "Dengar contoh panel ini", bantuan bertingkat per tingkat, **pertanyaan renungan**, lalu **daftar centang** (tokoh, urutan, kata target dengan tombol 🔊 untuk diketuk, sebagian besar Bahasa Inggris, bercerita sampai selesai). Simpan ke tabel `cerita_ulang` (`13` bagian 8), termasuk `ada_rekaman` (ya/tidak, tanpa isi), di SQLite dan sebagai migrasi Supabase baru dengan aturan baris per keluarga seperti tabel lain. Pasang SQL-nya menjadi tugas Acut yang dicatat di `docs/CARA-MENYAMBUNG-SUPABASE.md`.
2. **Izin 8 di mode orang tua** (`src/app/ortu/`): layar izin dengan teks di `13` bagian 4.3, saklar bawaan mati, tombol "Hapus semua rekaman", daftar rekaman tersimpan dengan tombol hapus dan sematkan (maksimal 5).
3. **Perekam** (hanya kalau Izin 8 menyala): tombol 🎙 per panel (≤ 20 detik) dan rekam cerita utuh (≤ 2 menit), lingkaran merah berdenyut + waktu berjalan, berhenti sendiri di batas waktu. Minta izin mikrofon Android **saat pertama kali tombol rekam ditekan**, bukan saat aplikasi dibuka.
4. **Dengar Bedanya:** per panel, tombol **🔊 Contoh** dan **🎙 Suaraku** bersebelahan, 1–2 tips bunyi dari naskah, tombol "Sudah mirip" / "Coba lagi" (Coba lagi langsung membuka perekam). Tanpa skor mesin.
5. **Penyimpanan sesuai `CLAUDE.md` aturan 12:** folder pribadi aplikasi, daftar lokal (komik, panel, tanggal, disematkan, terhapus_pada), penghapusan otomatis 30 hari saat aplikasi dibuka, batas 50 MB, tidak masuk antrean sinkron, `android.allowBackup: false` di `app.json`, tanpa tombol bagikan. Profil anak lain di HP yang sama tidak bisa memutar rekaman. Rekaman dan isinya tidak pernah tampil di halaman staf, pengawas, mitra les, atau guru; yang boleh terlihat di sana hanya `ada_rekaman` ya/tidak, kalau memang ditampilkan.
6. **Tebak Gerak** di menu Mode Dampingi: aplikasi menampilkan dan membacakan perintah Bahasa Inggris dari daftar perintah dasar (± 20 perintah, misal *Jump! Clap your hands! Sit down!*) dan kata kerja unit yang sudah dipelajari, status `belum_diperiksa`, anak bergerak, orang tua mengetuk "Sudah"; lalu bergantian (anak memilih perintah untuk orang tua). Tanpa kamera, tanpa rekaman.
7. **Rapor mingguan:** tambahkan kalimat kemajuan Bahasa Inggris dari Ceritakan Lagi (jumlah komik yang diceritakan dan kata target yang dicentang) dan hasil Cek Dengar. Tambahkan "satu cara membantu" dari pertanyaan pancingan komik. Ajakan "perbuatan baik minggu ini" tampil sebagai pilihan di mode orang tua, tanpa nilai atau hadiah.
8. **Uji Jest:** aturan penghapusan 30 hari, batas 5 sematan, batas 50 MB, hapus semua saat Izin 8 dimatikan, rekaman tidak pernah masuk antrean sinkron, tombol rekam tidak tampil tanpa Izin 8.

### Tahap 7 — Matematika: benda → gambar → angka di kartu ilmu kelas 6

Sesuai `12` bagian 2 (M1, M2, M4, dan L1):

1. Buat komponen benda interaktif yang bisa dipakai ulang di `src/komponen/benda/`: **Blok Puluhan** (satuan, puluhan, ratusan, bisa digeser dan dikelompokkan), **Potongan Pecahan** (lingkaran atau batang yang bisa dibagi), **Model Batang** (batang keseluruhan dan bagian, label nilai, tanda tanya), **Garis Bilangan**, dan **Uang Sederhana** (memakai uang gaya Pasar Gampong, bukan tiruan Rupiah).
2. Ubah cetakan kartu ilmu: sebelum contoh jadi, tambahkan langkah **"Coba dengan benda"** (1 layar benda interaktif → 1 layar gambar: batang atau garis bilangan → angka). Pasang ke semua kartu Matematika kelas 6 yang topiknya cocok (pecahan, persen, perbandingan, KPK/FPB, operasi hitung, satuan, rata-rata). Topik yang tidak cocok dicatat di laporan.
3. Pakai **model batang** untuk soal cerita pecahan, perbandingan, dan persen di kartu kelas 6.
4. Tambahkan **satu soal cerita berlatar Aceh atau kehidupan sehari-hari** di setiap kartu kelas 6 (pasar, ongkos labi-labi, panen di sawah, jarak ke pantai). Kuncinya dihitung ulang oleh kode, status `belum_diperiksa`.
5. Tambahkan **pertanyaan pancingan untuk orang tua** di setiap kartu (misal "Minta ia menjelaskan cara menggambar batangnya"), tampil di Mode Dampingi.
6. Di balik saklar fitur (mati): **pemanasan 3 soal lama** di awal kartu (topik yang dikuasai 1, 7, dan 21 hari lalu, memakai jadwal uji daya tahan Lancar) dan **tes paham** 8 soal cerita dan gambar tiap 8 minggu, hasilnya masuk rapor.
7. **Uji:** komponen benda bisa dipakai dengan sentuhan dan dengan pembaca layar, nilai di model batang selalu cocok dengan kunci soal.

### Tahap 8 — Uji menyeluruh dan pemeriksaan bebas

1. `npm run periksa` lulus. `periksa-komik` lulus untuk 12 komik.
2. Tangkapan layar Playwright (360 × 800) untuk K30 (Tonton dan Baca), K31, D10, D11, layar Izin 8, Tebak Gerak, dan satu kartu ilmu dengan "Coba dengan benda". Simpan di `docs/tangkapan/` dan lihat sendiri. Perbaiki yang tidak rapi.
3. **Pemeriksa bebas**, dua subagen baru yang tidak ikut membangun:
   - **Pemeriksa naskah:** baca 12 komik sebagai guru Bahasa Inggris SD dan sebagai orang tua di Aceh. Laporkan Bahasa Inggris yang salah atau tidak wajar, kata terlalu sulit, pesan akhlak yang menggurui, adegan menakutkan, isi agama, atau kemiripan dengan tokoh kartun yang sudah ada.
   - **Pemeriksa privasi:** pastikan rekaman tidak bisa keluar dari HP (tidak ada jalur sinkron, Supabase, halaman staf, cadangan, bagikan, atau log), izin mikrofon hanya diminta saat dibutuhkan, dan semua aturan 12 di `CLAUDE.md` terpenuhi. Laporkan berkas dan baris.
   - Perbaiki semua temuan yang benar, lalu catat di `docs/LAPORAN-PEMERIKSAAN-KOMIK.md`.
4. Uji tanpa sinyal: komik, Ceritakan Lagi, dan Dengar Bedanya jalan penuh tanpa jaringan.

### Tahap 9 — APK dan laporan

1. `app.json`: **pindahkan `android.permission.RECORD_AUDIO` dari `blockedPermissions` ke `permissions`** (sekarang izin ini masih diblokir). Izin lain di `blockedPermissions` (kamera, lokasi, kontak, AD_ID, dan seterusnya) tetap diblokir. Tambahkan alasan izin mikrofon dalam Bahasa Indonesia dan `android.allowBackup: false`. Pastikan APK hasil build benar-benar memuat izin mikrofon (cek manifest hasil prebuild).
2. Jalankan proses **Bangun APK** di GitHub Actions sampai hijau (`gh run list`, `gh run view`), lalu catat cara mengunduhnya.
3. Perbarui `docs/DAFTAR-PERIKSA-GURU.md`: tambahkan 12 naskah komik, Bunyi Hari Ini, tips bunyi, dan soal cerita kartu kelas 6, semua berstatus `belum_diperiksa`.
4. Buka pull request ke `main` (kalau bekerja di cabang lain) dengan ringkasan isi.

## O — OUTPUT

| Berkas | Isi |
|---|---|
| Kode | Layar K30, K31, D10, D11, Izin 8, Tebak Gerak; unit Bahasa Inggris bentuk baru; komponen benda Matematika; tokoh dan latar SVG sementara |
| `assets/paket/` | `tokoh.json`, 12 komik di paket tingkat 3 dan 4, Bunyi Hari Ini dan gerakan per unit |
| `LAPORAN-LANJUTAN-KOMIK.md` | **Untuk Acut, Bahasa Indonesia lugas, maksimal 2 halaman:** apa yang sudah jadi (tabel layar dan fitur), daftar 12 judul komik beserta pesan akhlaknya, cara mencoba di HP (langkah bernomor), apa yang belum jadi dan alasannya, hasil uji dan pemeriksaan, keputusan yang diambil sendiri, dan 3 langkah berikutnya beserta siapa yang mengerjakan |
| `docs/NASKAH-KOMIK-UNTUK-GURU.md` | 12 naskah siap diperiksa guru |
| `docs/RENCANA-LANJUTAN-KOMIK.md`, `docs/LAPORAN-PEMERIKSAAN-KOMIK.md` | Seperti dijelaskan di tahap |
| `KEMAJUAN.md`, `KEPUTUSAN-PEMBANGUNAN.md`, `docs/DAFTAR-PERIKSA-GURU.md` | Diperbarui |

Pesan terakhir di sesi: ringkasan 5–8 baris berisi apa yang jadi, cara mengunduh APK, dan langkah berikutnya untuk Acut.

## R — REFINE

Sebelum menyatakan selesai, periksa satu per satu dan perbaiki yang belum:

- [ ] 12 komik ada, lulus `periksa-komik`, dan komik tingkat 3 unit 1 sama dengan contoh jadi "Hello, Robi!".
- [ ] Setiap komik punya pesan akhlak, Pesan Hari Ini, pertanyaan renungan, kata bantu per panel, dan tips bunyi.
- [ ] Nama tokoh hanya ditulis di `tokoh.json`. Mengganti satu nama di sana mengganti nama itu di seluruh aplikasi dan naskah.
- [ ] Teks gelembung tidak ada di dalam gambar; kata bisa disorot dan diketuk.
- [ ] Ceritakan Lagi bisa dipakai tanpa Izin 8. Tombol rekam hanya muncul dengan Izin 8.
- [ ] Rekaman tidak pernah keluar dari HP, terhapus otomatis 30 hari, maksimal 5 sematan, hilang semua saat Izin 8 dimatikan.
- [ ] Izin Android hanya bertambah `RECORD_AUDIO`; tanpa lokasi dan kamera; `allowBackup` mati.
- [ ] Tidak ada isi agama, adegan menakutkan, senjata, kemiripan dengan tokoh kartun, skor merah, atau hadiah untuk pesan akhlak.
- [ ] Kartu ilmu Matematika kelas 6 yang cocok punya langkah "Coba dengan benda", dan kunci soal cerita baru dihitung ulang oleh kode.
- [ ] Semua jalan tanpa sinyal, `npm run periksa` lulus, **Bangun APK** hijau, semua sudah di-push, dan `LAPORAN-LANJUTAN-KOMIK.md` bisa dipahami orang yang tidak menulis kode.
