# Ringkasan Tahap 3 — Rancangan Teknis

**Ringkas:** (1) Rancangan teknis selesai dalam 11 berkas + paket draf hukum (9 berkas). Usul utamanya **Expo + Supabase (Singapura)**, latihan berjalan sepenuhnya di HP, hasil diantrekan dan dikirim tanpa ganda, dan isi diperbarui lewat paket tanpa rilis aplikasi. Biaya teknologi masa gratis ± **Rp415–465 ribu per bulan** sejak Desember (Tahap 5 menghitung ulang: ± Rp478 ribu, `06-rilis/03`). (2) **Temuan terbesar Tahap 3 adalah soal jadwal, bukan teknis.** Penilaian mandiri profil risiko harus diajukan dan diverifikasi Komdigi (± 24 hari) sebelum anak dari keluarga lain memakai aplikasi. Karena itu pengajuan harus ± **13 November**, dan ahli hukum sebaiknya dipilih **Jumat 6 November** (paling lambat Senin 30 November, `keputusan.md` bagian J), bukan akhir November. (3) Empat keputusan untuk Acut: pilihan teknologi, cara mengajukan penilaian mandiri, badan usaha penerbit, dan cara orang tua masuk.

Disusun 19 Oktober 2026 malam.

---

## 1. Isi Tahap 3

| Berkas | Isi | Usul terpenting |
|---|---|---|
| `01-arsitektur.md` | Gambar besar, perbandingan 3 pilihan teknologi, biaya, aturan Play | Expo + Supabase; lapisan data terpisah supaya bisa pindah ke Firebase Jakarta |
| `02-akun-keluarga.md` | Peran, cara masuk, alur daftar, PIN, satu HP banyak anak | Masuk lewat email + kode; anak tanpa akun; cukup bulan-tahun lahir |
| `03-basis-data.md` | Dua gambar tabel, aturan akses per keluarga, ukuran, masa simpan | Nomor dibuat di HP; level dihitung ulang dari riwayat |
| `04-tahan-putus-sinyal.md` | Antrean kirim, tanda tersimpan/terkirim, dua HP, 6 skenario uji | Simpan dulu, kirim kemudian; server "abaikan kalau sudah ada" |
| `05-paket-isi.md` | Jenis paket, versi, kanal uji → umum, pemulihan | Pengaturan level Lancar di paket → kalibrasi tanpa rilis |
| `06-pembuat-soal-dan-bank-soal.md` | Pembuat soal + bank soal + uji otomatis | Bahan TKA dipindah dari Markdown, dicocokkan dengan `periksa.py` lama |
| `07-layanan-ai.md` | Pekerjaan AI, aturan rapor cerita, biaya | Anak tidak berbicara dengan AI; angka dicek kode; ± Rp11–70 ribu/bulan pada 75 anak |
| `08-pembayaran.md` | Jalur Play, QRIS, pembayaran alternatif, pajak | Hanya tabel hak dan saklar fitur yang dibangun sekarang |
| `09-panel-pengelola.md` | 9 menu, tanda peringatan dini, keamanan | ± 2–2,5 jam Acut per minggu; ± 9 hari kerja bangun |
| `10-catatan-kejadian.md` | Kejadian ↔ ukuran, definisi ukuran utama | Tanpa analitik pihak ketiga; tanpa profiling |
| `11-privasi-dan-keamanan.md` | Aturan, perkiraan profil risiko, data, pengamanan, jadwal kepatuhan, daftar periksa | Profil rendah; ajukan Jumat 13 Nov |
| `paket-hukum/00`–`08` | Pengantar, persetujuan, kebijakan privasi, kertas kerja, syarat dan ketentuan, penilaian dampak, 25 pertanyaan, bahan memilih ahli hukum, cetakan kebocoran | Siap dikirim ke ahli hukum setelah badan usaha diputuskan |

## 2. Kenapa rancangan teknis ini bisa gagal — dan penjaganya

| Cara gagal | Tanda awal | Penjaga |
|---|---|---|
| Penilaian mandiri belum ditetapkan saat uji keluarga mau mulai | 13 Nov lewat tanpa pengajuan | Pengajuan oleh Acut berdasarkan draf kita; ahli hukum memeriksa sejajar |
| Ahli hukum menyatakan data anak wajib di Indonesia | Jawaban pertanyaan 11 | Lapisan data terpisah; pindah ke Firebase Jakarta (± 1–2 minggu) |
| Antrean tanpa sinyal menghasilkan data ganda atau hilang | Skenario uji 1–6 gagal | Bagian ini tidak boleh dipotong; diuji sebelum keluarga lain memakai |
| Aplikasi ditolak Kebijakan Keluarga karena pustaka tersembunyi | Penolakan saat uji tertutup | Pemeriksaan manifes dan daftar pustaka sebelum dikirim |
| Orang tua kesulitan dengan kode email | > 20% pendaftar berhenti di layar kode | Petunjuk "periksa Spam", kirim ulang; kode WhatsApp dinilai ulang |
| Bahan TKA dari laptop tidak datang | 31 Okt lewat | R1.1 mulai dengan 5 simulasi; PDF tetap untuk kelas luring |

## 3. Keputusan Acut

> **Jawaban Acut 19 Okt:** (1) teknologi **Expo + Supabase Singapura**; (2) penilaian mandiri **diajukan sendiri Jumat 13 Nov**, urusan ahli hukum dibahas dan dicari solusinya nanti; (3) penerbit dan pengendali data **dibahas khusus**: badan usaha terkendala nomor D-U-N-S (jalur cepat ± Rp3 juta), atas nama pribadi dulu sedang dipertimbangkan; (4) orang tua masuk dengan **email saja dulu**. Rincian di `keputusan.md` B4.

**Empat keputusan utama** (ditanyakan sekarang):

| # | Keputusan | Usul Acut2 | Di berkas |
|---|---|---|---|
| 1 | Pilihan teknologi | A: Expo + Supabase Singapura | `01` bagian 2 |
| 2 | Cara mengajukan penilaian mandiri | A: Acut mengajukan sendiri Jumat 13 Nov; ahli hukum memeriksa sejajar; sampai ditetapkan, hanya anak-anak Acut yang memakai | `11` bagian 6 |
| 3 | Badan usaha penerbit dan pengendali data | PT yang sudah ada atau badan baru, diputuskan paling lambat 31 Okt | `11` bagian 5 |
| 4 | Cara orang tua masuk | WhatsApp + kode, cadangan email | `02` bagian 2 |

**Usul lain** (disetujui sekaligus kecuali dikoreksi):

| Usul | Di berkas |
|---|---|
| Halaman rapor dan panel di Cloudflare Pages | `01` bagian 3 |
| Sasaran usia Play: anak + dewasa, pendaftaran orang tua sebagai penyaring | `01` bagian 5 |
| Profil anak diisi orang tua, cukup bulan-tahun lahir | `02` bagian 4 |
| Orang tua kedua tidak bisa menghapus akun atau mengubah izin | `02` bagian 1 |
| Ringkasan mingguan lewat tugas terjadwal Claude (Rp0) | `07` bagian 3 |
| Keluarga yang menolak izin data pemakaian tidak dihitung dalam ukuran mana pun | `10` bagian 3 |
| Ahli hukum dipilih paling lambat 6 Nov (dipercepat dari akhir Nov) | `paket-hukum/07` |

## 4. Tindak lanjut

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| ~~Menjawab 4 keputusan utama~~ | Acut | **Selesai 19 Okt** (badan usaha → diskusi khusus) | `keputusan.md` B4 |
| Mengunduh Kepmenkomdigi 142/2026 lengkap dengan lampiran (JDIH Komdigi) dan mengirimnya ke percakapan | Acut | 26 Okt | Berkas PDF |
| Membahas solusi ahli hukum (keputusan Acut: dibahas nanti) | Acut + Acut2 | Sebelum 6 Nov kalau ingin diperiksa sebelum pengajuan | `keputusan.md` |
| Diskusi khusus: atas nama pribadi atau badan usaha (D-U-N-S) | Acut + Acut2 | 6 Nov | `keputusan.md` |
| Mengirim berkas TKA dari laptop | Acut | 31 Okt | Zip di percakapan |
| Melengkapi kertas kerja aspek e–g | Acut2 | 2 Nov | Kertas kerja v0.2 |
| Mengajukan penilaian mandiri | Acut | Jumat 13 Nov | Tanda bukti penerimaan |
| Pendaftaran PSE | Acut | Jumat 20 Nov | Nomor TDPSE |
| Memulai Tahap 4 (antarmuka) | Acut2 | Setelah Tahap 3 disetujui | Berkas di `rancangan/03-antarmuka/` |
