# Pemeriksaan Akhir — Rancangan Sistem "Pintar Main"

**Ringkas:** (1) Pemeriksa terpisah (sub-agen yang tidak ikut menyusun rancangan) membaca 48 berkas pada 20 Oktober 2026 dan menemukan **40 masalah: 9 Tinggi, 25 Sedang, 6 Rendah**. Kesimpulannya: gagasan rancangan kuat, tetapi jadwal belum bisa dijalankan, gerbang berbayar tidak bisa dinilai jujur pada 29 Maret, dan ada celah privasi anak yang membantah klaim profil risiko "0%". (2) Setelah dicek satu per satu, **31 temuan sudah diperbaiki** di berkasnya, **9 diperbaiki tetapi masih menunggu satu keputusan atau bukti** dari Acut atau dari dokumen resmi, dan tidak ada yang ditolak. Ada 4 temuan yang diperbaiki dengan cara lain dari usulan pemeriksa, dan alasannya ditulis di bagian 3. (3) Ada **7 keputusan untuk Acut** (bagian 4). Yang paling mendesak adalah rumusan A5 bersama penyempitan imbalan B (Senin 26 Okt) dan nama pengendali data (Jumat 6 Nov).

Disusun 20 Oktober 2026. Laporan asli pemeriksa disimpan utuh di bagian 6. Semua perubahan juga dicatat di `keputusan.md` bagian C (ganti arah) dan J (tenggat yang disatukan).

---

## 1. Cara pemeriksaan

| Hal | Isi |
|---|---|
| Pemeriksa | Sub-agen terpisah tanpa akses ke percakapan penyusunan, sehingga rancangan tidak menilai dirinya sendiri |
| Yang dibaca | 48 berkas di `rancangan/` (`catatan-riset-sementara.md` sengaja tidak dibaca, sebab isinya bahan mentah) |
| Yang dicari | Pertentangan antarberkas, keputusan terkunci yang dilanggar, salah hitung, ketergantungan jadwal yang terbalik, celah privasi dan hukum, pertanyaan masukan yang tidak terhubung ke keputusan |
| Cara cek | Tanggal dan nama hari dicek dengan skrip; hitungan diulang di kolom Bukti; kutipan diambil langsung dari berkas |
| Perbaikan | Dikerjakan Acut2 berurutan dari tingkat Tinggi. Setiap perbaikan dicek ulang: hitungan dijalankan dengan Python, 22 gambar Mermaid dirender ulang tanpa galat, nama hari dicek dengan skrip |

---

## 2. Tabel 40 temuan dan statusnya

Status: **✓ Diperbaiki** · **◐ Diperbaiki, menunggu keputusan atau bukti** (rancangan sudah memakai jalan teraman sampai keputusan datang).

| No | Tingkat | Masalah (ringkas) | Status | Perbaikan dan tempatnya |
|---|---|---|---|---|
| 1 | Tinggi | Pengajuan penilaian mandiri butuh NIB, TDPSE, dan bukti layar yang belum ada | ✓ | NIB + permohonan TDPSE Senin 9 Nov; pengajuan boleh memakai nomor permohonan; layar izin data, PIN, hapus akun dibangun minggu 2–3 — `06-rilis/04`, `paket-hukum/03` A dan I |
| 2 | Tinggi | Lama verifikasi Komdigi mungkin hari kerja; tanpa cadangan | ◐ | Jalur cadangan: profil ± 17 Des → gelombang 1 ± 4 Jan, gelombang 2 ± 18 Jan — `06-rilis/04` bagian 3. **Menunggu:** arti "hari" dari lampiran Kepmen 142 (Acut unduh 26 Okt) |
| 3 | Tinggi | Jadwal Play tidak menghitung dua tinjauan Google | ✓ | Unggah uji tertutup Selasa 24 Nov versi apa adanya; gelombang boleh lewat jalur uji tertutup kalau produksi belum tayang — `05-uji/01`, `06-rilis/04` |
| 4 | Tinggi | Gerbang 29 Mar: terlalu sedikit keluarga 12 minggu; jendela ukur Ramadan | ✓ | Evaluasi paling cepat ± 26 Apr; G1 per keluarga dalam minggu kalender; minggu Ramadan–Idulfitri tidak dihitung — `01-produk/09` |
| 5 | Tinggi | Gerbang per keluarga terlalu longgar | ✓ | Satu janji data **dan** satu janji orang tua; janji 2 = ≥ 2 sesi dimulai sendiri per minggu + O06; selang kepercayaan dilaporkan; tes tetap memuat 5 soal pembanding — `01-produk/09` bagian 1–2 |
| 6 | Tinggi | Arah besar A5 bertentangan dengan B3 no. 1; baris B lama belum dicoret | ◐ | Baris B dicoret dengan rujukan ke C; A5 diberi catatan dan usul rumusan — `keputusan.md` A, B. **Menunggu:** konfirmasi Acut (26 Okt) |
| 7 | Tinggi | Kode undangan orang tua kedua dan kode keluarga tanpa batas percobaan | ✓ | Undangan diikat ke email tujuan, batas percobaan per akun/IP/undangan, persetujuan pemilik wajib, kabar ke pemilik; peluang tebak 0,001% — `02-rancangan/02` bagian 7 dan 7a; KK03 di `paket-hukum/03` |
| 8 | Tinggi | Jalur pengajar kelas luring tanpa mekanisme | ◐ | Latihan rumah dibuka menurut tanggal pertemuan di panel; tabel `kelas_luring` dan `anggota_kelas`; link rapor kelas lewat fungsi server; pernyataan kerahasiaan pengajar — `01-produk/06` bagian 2 dan 8, `02-rancangan/02`, `02-rancangan/03`. **Menunggu:** nama pengajar dan tanggal pertemuan pertama (11 Des) |
| 9 | Tinggi | Izin wajib menggabungkan WhatsApp dan transfer luar negeri | ✓ | WhatsApp dan Perintis menjadi Izin 7 (pilihan); dasar transfer ke Singapura = pelindungan memadai + perjanjian pemrosesan yang mengikat — `paket-hukum/01`, `02`, `06` no. 11, `02-rancangan/11` |
| 10 | Sedang | Pertanyaan pemicu bisa membuat 2 pertanyaan dalam 14 hari | ✓ | Pemicu masuk antrean putaran berikutnya; tombol 👍👎 rapor pertama tidak dihitung pertanyaan — `01-produk/08` bagian 5.3 |
| 11 | Sedang | Mode Dampingi keluar setelah 15 menit diam, padahal simulasi 75 menit | ✓ | Pengawas simulasi keluar dari Mode Dampingi: PIN sekali di awal, tanpa batas diam — `01-produk/06` bagian 6, `07` 2.2, `02-rancangan/02` bagian 5, `03-antarmuka/01` D7 |
| 12 | Sedang | Aspek e–g dinilai "Rendah" sebelum parameternya terbaca | ◐ | Menjadi "belum dinilai"; simulasi 75 menit dicatat sebagai pengecualian beralasan; batas rendah/sedang disebut belum diketahui — `01-produk/07` bagian 4, `paket-hukum/03` G–H, `02-rancangan/11` bagian 2. **Menunggu:** lampiran Kepmen 142 |
| 13 | Sedang | Pemroses data tidak lengkap (Expo/FCM, WhatsApp, langganan Claude) | ◐ | Ditambahkan ke kebijakan privasi, formulir persetujuan, penilaian dampak, inventaris data; HP mode anak tidak mendaftar token; ekspor tugas terjadwal hanya angka gabungan; isian terbuka lewat API — `paket-hukum/01`, `02`, `05`, `02-rancangan/07`, `11`. **Menunggu:** pemeriksaan pustaka Firebase di HP anak (Rabu 4 Nov) |
| 14 | Sedang | Teks bebas orang tua tidak bisa dibacakan untuk kelas 1–2 | ✓ | Pesan siap pakai dibacakan dari suara di paket; teks bebas memakai ikon "minta Ayah/Bunda membacakan" — `01-produk/07`, `03-antarmuka/02` K3 |
| 15 | Sedang | Angka rapor membaca hanya dari Dengar Bacaan (pilihan) | ✓ | Angka rapor dan janji 1b = bacaan dingin dengan tombol untuk semua; Dengar Bacaan penguat; "belum diukur orang tua" — `01-produk/05` bagian 3 dan 5, `07` 2.5, `09` |
| 16 | Sedang | Guru per topik lawan per jam; batas AI menghentikan rapor | ✓ | Guru dibayar per butir (diturunkan dari setara Rp50 ribu per jam); batas AI menjadi peringatan, batas keras US$50 hanya pengaman kesalahan program — `01-produk/03` 6.2, `02-rancangan/07` bagian 5, `06-rilis/03` |
| 17 | Sedang | Angka target saling bertentangan | ✓ | `06-rilis/02` menjadi satu-satunya sumber; `04-mesin` bagian 8 dan `09` merujuk ke sana; corong 75% diberi keterangan; jadwal ditulis 11 minggu dengan empat titik tetap |
| 18 | Sedang | Tenggat ahli hukum dan diskusi berbayar berbeda-beda; penilaian dampak tergantung ahli hukum | ✓ | Satu tabel tenggat di `keputusan.md` bagian J; syarat (3) penilaian dampak boleh diganti catatan tertulis Acut — `paket-hukum/05` bagian 5 |
| 19 | Sedang | Rapor kecepatan tidak setara antarlevel | ✓ | Kecepatan per keluarga fakta yang sama; tes tetap sebagai grafik utama — `01-produk/07` 2.5, `01-profil` 2.2–2.3 |
| 20 | Sedang | Dasar pembanding janji 1a tidak terdefinisi | ✓ | Tes tetap awal hari ke-1–3 (20 soal + 5 pembanding), lalu tiap 4 minggu — `01-produk/09`, `01-profil` 2.2, `03-antarmuka/01` K4 |
| 21 | Sedang | Putaran per keluarga dan kerja WhatsApp Acut belum dihitung | ✓ | Putaran pada Senin minggu ganjil kalender; keluarga baru ikut putaran ≥ 14 hari setelah daftar; jam Acut ± 7–8 di minggu ajakan — `01-produk/08` 5.2, `06-rilis/03` bagian 3 |
| 22 | Sedang | A05 berbau hadiah Gampong; ukuran ketukan mustahil; penyesuaian per anak | ✓ | A05 = "Besok mau lebih banyak apa?"; ukuran = hari dengan ketukan ÷ hari latihan; penyesuaian ditulis sebagai fungsi layanan — `01-produk/08` bagian 4 dan 12, `paket-hukum/03` KN03 |
| 23 | Sedang | Tidak semua pertanyaan terhubung ke satu keputusan | ✓ | O08/K7 dihapus; K1, K2, K6 masing-masing satu keputusan; K8/O03 = pengingat ke Ayah, Ibu, atau keduanya — `01-produk/08` bagian 2–3, `09` janji 4 |
| 24 | Sedang | Imbalan B mengaitkan keuntungan dengan data; S&K bertentangan | ◐ | Imbalan penjawab = terima kasih + kabar; fitur lebih awal hanya Perintis yang diundang; Perintis tidak dipilih dari jumlah jawaban — `01-produk/08` 6–7, `paket-hukum/01` Izin 3, `04` 5.2 dan 6.1, `06` no. 10, `06-rilis/01` bagian 5. **Menunggu:** konfirmasi Acut, sebab menyempitkan pilihan B yang dikunci |
| 25 | Sedang | Hitungan layar R1 salah; layar TKA bertanda R1.1 | ✓ | 47 layar di aplikasi R1 (layar TKA ikut R1, isinya 4 Jan); baris pembangunan R2–R3 ada di jadwal — `03-antarmuka/01` bagian 7, `00-ringkasan-tahap-4`, `01-produk/02`, `06-rilis/04` |
| 26 | Sedang | Perjanjian hak cipta modul TKA dan perjanjian pemrosesan data tidak ada di tindak lanjut | ✓ | Baris 27 (Jumat 27 Nov) dan 31 (Selasa 15 Des) — `06-rilis/06` |
| 27 | Sedang | Jurus wajib diperiksa guru, padahal guru baru ditunjuk 15 Nov; jam guru kurang | ✓ | Jurus R1 diperiksa Acut sendiri dulu, guru menyusul (13 Nov); + ± 8 jam butir pendek; sampel penanda pengecoh 20% — `01-produk/03`, `06`, `02-rancangan/06` |
| 28 | Sedang | Bacaan dingin kelas 6 tidak sah untuk murid luring | ✓ | Satu bacaan dingin terpisah per minggu dari 72 teks tambahan; hanya itu yang dipakai untuk 1b — `01-produk/05` bagian 4 |
| 29 | Sedang | Titik impas dibulatkan ke bawah; PPN langganan Claude dan hak Perintis terlewat | ✓ | Dibulatkan ke atas; PPN 11% pada langganan Claude; baris pendapatan yang dilepas. Hasil Rp49 ribu: 39 keluarga (500 keluarga), 87 kalau langganan Claude ikut ditutup; 68 dan 117 pada 1.000 keluarga — `06-rilis/03` bagian 5.2, `06-rilis/00` |
| 30 | Sedang | Lama latihan level atas melewati 2–4 menit; target per level tidak tertulis | ◐ | Tabel target detik per kelas dan level; kelas 5 L1 diturunkan ke hasil ≤ 200; lembar 15 soal di level yang targetnya > 100 detik (3,9 menit) — `01-produk/04` bagian 3 dan 4.1. **Menunggu:** pilihan Acut, lembar 15 soal atau takaran 2–5 menit (30 Okt) |
| 31 | Sedang | Kartu satwa terlalu dapat ditebak (± 1 per level) | ✓ | Acak ± 1 dari 3 kejadian penguasaan — `01-produk/07` 3.1–3.2, `03-antarmuka/01` |
| 32 | Sedang | Layar kelas 1–2 baru diuji setelah 10 Des | ◐ | Baris uji kelas 1–2 sebelum gelombang 1 — `05-uji/01`. Uji lebih awal dengan kerabat Acut menunggu ahli hukum (pertanyaan 4) |
| 33 | Sedang | Jalur gampong berisiko benturan kepentingan | ◐ | Ditahan; hanya kontak pribadi; cadangan 30 keluarga dari jalur lain — `06-rilis/01` bagian 2. **Menunggu:** keputusan Acut setelah cek aturan etik (6 Nov) |
| 34 | Sedang | Pemegang link rapor bisa menjawab atas nama keluarga | ✓ | Jawaban dari link ditandai `sumber = link` dan dihitung terpisah — `02-rancangan/03`, `01-produk/08` 5.2, `paket-hukum/01` Izin 5 |
| 35 | Rendah | Salah hitung ukuran basis data dan satuan; dasar anak berbeda | ✓ | Dasar 50 keluarga = 75 anak; Pro penuh ± 9 bulan pada 1.000 keluarga; US$0,125/GB; biaya AI ± Rp11–70 ribu — `02-rancangan/03` bagian 5, `07`, `01-arsitektur` |
| 36 | Rendah | Urutan sesi memakai jam terima; logika level ditulis dua kali | ✓ | Penghitung urutan + jam monoton sejak sinkron; satu pustaka LANCAR TypeScript untuk HP dan server — `02-rancangan/03` bagian 3, `04` bagian 5 |
| 37 | Rendah | Masih tertulis "tanggal lahir" | ✓ | "Bulan dan tahun lahir" — `01-produk/01`, `02` |
| 38 | Rendah | Nama hari keliru; tenggat jatuh di akhir pekan | ✓ | Tenggat dipindah ke hari kerja dan ditulis harinya — `06-rilis/04`, `06`, `keputusan.md` |
| 39 | Rendah | Aturan lembar 10 soal Mode Ramadan belum ada | ✓ | Target = jumlah target 10 soal; dua lembar 10 soal tepat = satu lembar 20 soal tepat; tanpa kilat; turun kalau salah ≥ 3; tes tetap digeser — `03-antarmuka/02` O10 |
| 40 | Rendah | Istilah Inggris tanpa padanan | ✓ | Lalu lintas keluar, kiriman sekaligus, kode sekali pakai, pustaka pihak ketiga, paket berbayar terkecil — `01-arsitektur`, `07`, `09-panel`, `11`, `03-rencana-isi`, `06-rilis/03` |

**Jumlah:** 31 ✓ · 9 ◐ · 0 ditolak.

---

## 3. Yang diperbaiki dengan cara lain dari usulan pemeriksa

| No | Usul pemeriksa | Yang dipilih | Alasan |
|---|---|---|---|
| 10 | Gabungkan pemicu ke putaran, **atau** ubah aturan dua minggu secara terbuka | Gabungkan ke putaran (antre) | Aturan "paling sering dua minggu sekali" dikunci Acut; tidak dibuka ulang |
| 27 | Majukan penunjukan guru ke 1 Nov, atau jurus R1 diperiksa Acut dulu | Jurus R1 diperiksa Acut dulu; guru Jumat 13 Nov | Acut belum punya calon guru; memaksa 1 Nov berisiko memilih tergesa |
| 30 | Ubah takaran menjadi 2–5 menit secara terbuka | Lembar 15 soal di level berat (takaran 2–4 menit tetap), dengan pilihan 2–5 menit ditawarkan ke Acut | Takaran 2–4 menit dikunci; lembar 15 soal menjaga keputusan itu tanpa mengurangi latihan di level mudah |
| 34 | Tandai jawaban dari link, **atau** minta kode sekali pakai lewat email | Tandai dan hitung terpisah | Kode lewat email menambah langkah bagi orang tua [L] yang memang memilih jalur paling ringan |

---

## 4. Keputusan untuk Acut

| # | Keputusan | Usul Acut2 | Tenggat |
|---|---|---|---|
| 1 | Rumusan A5 diganti "Gratis, dibayar dengan masukan sukarela"? | Ya | Senin 26 Okt |
| 2 | Imbalan B disempitkan: penjawab mendapat terima kasih + kabar; fitur lebih awal hanya Perintis yang diundang? | Ya, sebab sesuai S&K dan lebih aman terhadap PP 33/2026 Ps. 35(1) | Senin 26 Okt |
| 3 | Lembar 15 soal di level berat, atau takaran 2–5 menit? | Lembar 15 soal | Jumat 30 Okt |
| 4 | Akun Play Console pribadi Anda dibuat sebelum atau sesudah 13 Nov 2023? (Menentukan syarat 12 penguji × 14 hari, dan ikut menentukan pilihan penerbit) | — | Jumat 6 Nov, bersama diskusi 2 |
| 5 | Jalur gampong: hanya kontak pribadi Anda, atau tidak dipakai? | Kontak pribadi saja, setelah aturan etik pendamping desa dicek | Jumat 6 Nov |
| 6 | Pengajar kelas luring TKA, dan cukupkah latihan rumah dibuka menurut tanggal pertemuan (tanpa pengajar menandai di aplikasi)? | Ya, menurut tanggal | Jumat 11 Des |
| 7 | Guru pemeriksa: setuju dibayar per butir (jurus Rp12.500 per layar, teks Rp12.500, modul Rp100.000, butir pendek Rp1.700)? | Ya; angka akhir disepakati dengan guru | Jumat 13 Nov |

---

## 5. Yang dinilai pemeriksa sudah baik dan tidak diubah

1. Prinsip "simpan dulu, kirim kemudian": nomor dibuat di HP, data hanya ditambah, level dihitung ulang dari riwayat, dan ada 6 skenario uji wajib.
2. Data anak minimal: anak tanpa akun, cukup bulan-tahun lahir, tanpa foto/suara/lokasi. Anak hanya mengirim stiker. Tanpa notifikasi ke anak, tanpa rangkaian hari, tanpa peringkat.
3. Pertanyaan masukan berbentuk pilihan dengan pilihan jujur ("Belum terlihat"), penanda jawaban asal, dan aturan selalu menulis "n dari N".
4. Rapor cerita AI: setiap angka dicek kode, dan ada kalimat cetakan cadangan dengan angka yang sama, jadi tidak ada penurunan mutu bagi yang menolak.
5. Paket isi bernomor versi, dengan sidik berkas, kanal uji, dan pulihkan satu ketuk. Soal Lancar dibuat kode dengan benih yang bisa diulang.

---

## 6. Laporan asli pemeriksa

Disimpan sebagai bukti, tanpa diubah, di `rancangan/pemeriksaan-akhir-laporan-asli.md`.
