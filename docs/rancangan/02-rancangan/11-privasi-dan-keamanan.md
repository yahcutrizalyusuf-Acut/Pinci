# Privasi dan Keamanan Anak

**Ringkas:** (1) Rancangan ini menyasar **profil risiko rendah**. Dari parameter resmi penilaian mandiri (Kepmenkomdigi 142/2026) yang sudah terbaca, hampir semua parameter berstatus "tidak ditemukan", sebab tidak ada kontak dengan orang asing, rekomendasi berbasis perilaku, iklan, pembelian oleh anak, atau data anak yang tampil ke publik. (2) Ada **temuan jadwal yang serius**: penilaian mandiri harus disampaikan ke Komdigi dan diverifikasi sebelum anak memakai aplikasi. Pemeriksaan kelengkapannya bisa memakan sampai 14 hari, ditambah klarifikasi 7 hari. Ahli hukum baru direncanakan dipilih akhir November, padahal uji keluarga dijadwalkan Desember. Usulnya: **Acut menyampaikan sendiri draf kita paling lambat Jumat 13 Nov**, ahli hukum memeriksa sejajar, dan sampai profil risiko ditetapkan hanya anak-anak Acut sendiri yang memakai aplikasi. (3) Daftar periksa sebelum tayang dan paket draf untuk ahli hukum ada di folder `paket-hukum/`.

Tahap 3, butir 9. Disusun 19 Oktober 2026. **Bukan nasihat hukum**; semua draf wajib diperiksa ahli hukum.

---

## 1. Aturan yang mengikat

| Aturan | Isi yang mengikat aplikasi ini | Sumber |
|---|---|---|
| **UU 27/2022 (PDP)** Ps. 25 | Data anak wajib persetujuan orang tua/wali | **[FAKTA — pasal.id]** |
| Ps. 21 | Saat meminta persetujuan wajib disampaikan: legalitas, tujuan, jenis dan relevansi data, masa simpan, rincian data yang dikumpulkan, jangka waktu pemrosesan, hak subjek data; perubahan diberitahukan **sebelum** terjadi | **[FAKTA — pasal.id, Ps. 21]** |
| Ps. 34 | Penilaian dampak bila berisiko tinggi | **[FAKTA — pasal.id]** |
| Ps. 46 | Kegagalan pelindungan data → pemberitahuan tertulis **≤ 3 × 24 jam** ke subjek data dan lembaga, berisi data yang terungkap, kapan dan bagaimana, serta upaya penanganan | **[FAKTA — pasal.id, Ps. 46]** |
| Ps. 56 | Transfer ke luar negeri: negara setara → pelindungan memadai dan mengikat → persetujuan subjek data | **[FAKTA — Hukumonline]** |
| **PP 33/2026** | Berlaku 16 Jan 2027; persetujuan bebas, spesifik, tidak digabung dengan syarat dan ketentuan, ada buktinya; layanan tidak diturunkan mutunya bagi yang menolak | **[FAKTA — RSM; Bisnis.com]** |
| **PP 17/2025 (PP Tunas)** | Persetujuan orang tua; privasi tinggi sejak awal; fitur sesuai usia; edukasi; pejabat pelindungan data; penilaian dampak; informasi tidak menyesatkan. **Dilarang:** profiling anak, lokasi tidak patut, teknik dorongan | **[FAKTA — Bisnis.com 5 Mei 2026]** |
| **Permenkomdigi 9/2026** | Penilaian mandiri profil risiko **disahkan sebelum anak dapat mengakses**; anak < 13 tahun hanya produk berprofil risiko rendah dengan persetujuan orang tua | **[FAKTA — pasal.id]** |
| **Kepmenkomdigi 142/2026** | Indikator "layanan dapat diakses anak" (cukup satu: misal ditujukan untuk anak); **tujuh aspek risiko** berbobot; satu aspek > 50% → profil tinggi; Kertas Kerja Penilaian Mandiri + bukti; disampaikan ke Direktur Jenderal lewat sistem elektronik Komdigi; periksa kelengkapan ≤ 14 hari, klarifikasi ≤ 7 hari, profil ditetapkan Dirjen Pengawasan Ruang Digital dan diumumkan | **[FAKTA — veritask.ai, 26 Mar 2026; teks Kepmen di JDIH Komdigi, terbaca sebagian]** |
| **Pendaftaran PSE** | Sebelum sistem digunakan pengguna; per aplikasi/situs; lewat OSS | **[FAKTA — izin.co.id, Jul 2026]** |
| **Kebijakan Keluarga Google Play** | Tanpa pustaka pihak ketiga (SDK) yang tidak disetujui untuk anak, tanpa AAID/IMEI/MAC/lokasi, kebijakan privasi akurat, patuh hukum yang berlaku | **[FAKTA — Bantuan Play Console]** |

**Catatan:** riset Tahap 1 menyebut enam dimensi risiko; Kepmenkomdigi 142/2026 merincinya menjadi **tujuh aspek** (gangguan psikologis dan fisiologis dipisah). `01-produk/07-fitur-orang-tua-dan-anak.md` bagian 4 diperbarui mengikuti ini.

---

## 2. Penilaian mandiri — perkiraan awal

Parameter aspek a–d terbaca dari teks Kepmen; aspek e–g (adiksi, psikologis, fisiologis) **belum terbaca** dan harus dilengkapi dari dokumen resmi. Kertas kerja lengkap ada di `paket-hukum/03-kertas-kerja-penilaian-mandiri.md`.

| Aspek | Parameter yang **ditemukan** di rancangan | Perkiraan bobot ditemukan **[ESTIMASI]** | Batas profil tinggi |
|---|---|---|---|
| a. Kontak dengan orang tak dikenal | Tidak ada (pesan hanya dalam keluarga; tanpa pencarian, rekomendasi akun, grup, atau indeks mesin pencari) | 0% | > 50% |
| b. Paparan isi tidak sesuai | Tidak ada rekomendasi otomatis, forum, komentar, atau iklan. KN06 (fitur blokir dan pelaporan) dinilai sebagai mitigasi: ada tombol "laporkan soal ini salah" | ± 0% (bergantung cara KN06 dinilai) | > 50% |
| c. Eksploitasi sebagai konsumen | EK06 (perpanjangan langganan otomatis) **bisa ditemukan** saat berbayar; mitigasi: pembelian hanya di mode orang tua dengan PIN | 0% masa gratis; ± 9,5% setelah berbayar | > 50% |
| d. Keamanan data | DP03–DP06 dipenuhi lewat rancangan ini (keamanan, penilaian dampak, pengawasan orang tua, pemberitahuan privasi mudah dipahami) | ± 0% | > 50% |
| e–g. Adiksi, psikologis, fisiologis | Parameter belum terbaca. Mitigasi yang sudah ada: tanpa rangkaian hari, tanpa notifikasi ke anak, batas waktu game, sesi ≤ 10/15/20 menit, tanpa perbandingan antaranak, jam tenang, tema terang lembut | Belum bisa dihitung | > 50% |

**Dua batas yang belum diketahui (ditambah 20 Okt):** (1) batas antara profil rendah dan sedang — yang terbaca baru "satu aspek > 50% = tinggi", jadi KN03 17,91% belum pasti "rendah"; (2) parameter e–g. Keduanya dicari di lampiran Kepmen 142. Simulasi TKA 75 menit dicatat sebagai **pengecualian beralasan** atas batas sesi (meniru ujian, ≤ 5 kali setahun, pilihan orang tua).

---

## 3. Data yang disimpan

| Data | Tujuan | Dasar | Disimpan di | Dilihat oleh | Masa simpan |
|---|---|---|---|---|---|
| Email orang tua | Masuk (kode) | Persetujuan inti | Supabase (Singapura) | Sistem; Acut hanya untuk bantuan teknis | Selama akun aktif |
| Nomor WhatsApp orang tua; pesan dan pesan suara ke Acut | Kabar dari Acut, pengingat, Keluarga Perintis | **Izin 7 (pilihan)** — dipisah dari persetujuan inti 20 Okt | Supabase (Singapura); pesan di WhatsApp (Meta) | Acut | Nomor: sampai izin ditarik; pesan suara: dihapus setelah poinnya diketik, ≤ 14 hari |
| Nama panggilan, bulan-tahun lahir, kelas, hewan anak | Menyesuaikan isi dan rapor | Persetujuan inti (orang tua) | Supabase + HP | Keluarga | Selama akun aktif |
| Hasil latihan per soal, waktu, level | Latihan dan rapor | Persetujuan inti | Supabase + HP | Keluarga; pengajar kalau disetujui | Selama akun aktif |
| Kata per menit dan kata yang tersandung | Rapor membaca | Persetujuan inti | Supabase + HP | Keluarga | Selama akun aktif |
| Pesan dalam keluarga | Komunikasi orang tua–anak | Persetujuan inti | Supabase + HP | Keluarga | 12 bulan **[ASUMSI]** |
| Catatan pemakaian | Pengembangan, ukuran | Persetujuan "data pemakaian" | Supabase | Acut dalam bentuk jumlah | Rinci 12 bulan, lalu dirangkum |
| Jawaban masukan | Pengembangan | Persetujuan "masukan" | Supabase | Acut, Acut2 dalam bentuk ringkasan | Selama akun aktif |
| Angka ringkas untuk rapor cerita (tanpa nama) | Rapor cerita | Persetujuan "rapor buatan AI" | Dikirim ke Anthropic (AS) | Tidak ada manusia | Dihapus Anthropic ≤ 30 hari |
| Bukti persetujuan | Kepatuhan | Kewajiban hukum | Supabase | Acut, ahli hukum, otoritas | Selama akun aktif + 5 tahun **[ASUMSI]** |
| Token pemberitahuan HP orang tua | Kabar rapor | Persetujuan inti (bisa dimatikan) | Supabase; dikirim lewat Expo + Firebase Cloud Messaging (AS) | Sistem | Sampai HP diputus atau pemberitahuan dimatikan |
| Ekspor mingguan untuk ringkasan (angka gabungan, jawaban pilihan **tanpa** nomor keluarga) | Ringkasan Senin | Persetujuan "masukan" dan "data pemakaian" | Dibaca langganan Claude Acut (syarat konsumen) | Acut, Acut2 | Berkas ekspor dihapus setelah ringkasan selesai |

**Tidak pernah dikumpulkan:** nama lengkap anak, foto, rekaman suara anak, sekolah, alamat, lokasi, NISN/NIK, pengenal iklan atau pengenal perangkat tetap, kontak di HP.

**Pustaka pemberitahuan di HP anak (ditambah 20 Okt, perlu dicek):** pemberitahuan Expo di Android berjalan lewat Firebase Cloud Messaging, jadi pustaka Firebase ikut di aplikasi yang sama yang dipasang di HP anak. Penjaganya: (1) aplikasi **tidak meminta izin pemberitahuan dan tidak mendaftarkan token** selama HP dalam mode anak atau terhubung sebagai "HP anak"; (2) Acut2 mengecek apakah pustaka itu termasuk daftar pustaka yang disertifikasi sendiri untuk Kebijakan Keluarga Google Play, dan apakah pustaka itu mengirim data walaupun token tidak didaftarkan — Rabu 4 Nov, bukti: catatan pemeriksaan manifes dan lalu lintas jaringan HP uji. Kalau gagal, pemberitahuan orang tua diganti email saja di R1.

---

## 4. Pengamanan

| Lapis | Pengamanan |
|---|---|
| Perjalanan data | Semua lewat HTTPS |
| Penyimpanan server | Enkripsi saat tersimpan di layanan awan **[ASUMSI — dicek di dokumentasi Supabase]**; cadangan harian 7 hari |
| Akses | Aturan per baris per keluarga (`03-basis-data.md` bagian 4); uji "keluarga A tidak bisa membaca keluarga B" wajib lulus |
| PIN dan kode | Disimpan sebagai acak satu arah; dikunci setelah 5 kali salah |
| Kunci rahasia | Kunci layanan dan API hanya di fungsi server, tidak pernah di aplikasi atau peramban |
| Panel | Masuk dua langkah; akses data per keluarga wajib alasan dan tercatat |
| HP hilang | Orang tua memutus HP dari jauh; data lokal terhapus saat HP itu tersambung |
| Pustaka pihak ketiga | Daftar pustaka diperiksa terhadap Kebijakan Keluarga sebelum setiap rilis |

### Kalau terjadi kebocoran

| Waktu | Tindakan | Siapa |
|---|---|---|
| Jam 0 | Hentikan sumber (cabut kunci, matikan fungsi yang bocor) | Acut + Acut2 |
| ≤ 24 jam | Catat data apa, berapa keluarga, kapan dan bagaimana | Acut2 |
| **≤ 72 jam** | Pemberitahuan tertulis ke keluarga terdampak dan lembaga: data yang terungkap, kapan dan bagaimana, upaya penanganan (UU PDP Ps. 46) | Acut sebagai pejabat pelindungan data |
| Sesudahnya | Perbaikan + catatan di `keputusan.md` | Acut |

Cetakan pemberitahuan disiapkan di paket hukum.

---

## 5. Peran yang harus diisi

| Peran | Usul | Sebab |
|---|---|---|
| **Pengendali data** (nama di kebijakan privasi, PSE, Play Store) | **Dibahas dalam diskusi khusus** (keputusan Acut 19 Okt). Pilihan: atas nama pribadi Acut dulu, atau badan usaha. Kendala badan usaha: akun Play organisasi butuh nomor D-U-N-S — gratis dari Dun & Bradstreet tetapi bisa sampai 30 hari **[FAKTA — Bantuan Play Console]**; jalur cepat yang pernah dicoba Acut ± Rp3 juta. UU PDP menyebut pengendali data bisa "Setiap Orang", badan publik, atau organisasi internasional **[FAKTA — UU 27/2022 Ps. 19, lewat pasal.id]**, jadi atas nama pribadi dimungkinkan **[ASUMSI — PSE perorangan dicek]** | Satu nama untuk semua dokumen |
| **Pejabat pelindungan data** | Acut (sementara) | Diwajibkan PP Tunas; UU PDP Ps. 53 untuk kondisi tertentu |
| **Narahubung penilaian mandiri** | Acut | Diwajibkan Kepmenkomdigi 142/2026 |
| **Pemroses data** | Supabase, Anthropic, penyedia email (Brevo), Google (suara: saat membuat paket, dan sekali untuk nama panggilan anak serta pesan orang tua bagi kelas 1–2, keputusan 29 Okt) | Perjanjian pemrosesan data masing-masing diperiksa |

---

## 6. Jadwal kepatuhan — temuan yang mengubah rencana

| Langkah | Paling lambat (usul) | Sebab |
|---|---|---|
| Nama pengendali data diputuskan (diskusi khusus: pribadi atau badan usaha) | 6 Nov | Dibutuhkan untuk PSE dan semua dokumen pengajuan |
| Draf kertas kerja + kebijakan privasi + formulir persetujuan + penilaian dampak **selesai** | 6 Nov (Acut2) | — |
| **Penilaian mandiri disampaikan** lewat sistem Komdigi — **diputuskan Acut 19 Okt: diajukan sendiri** | **Jumat 13 Nov** | Periksa kelengkapan ≤ 14 hari + klarifikasi ≤ 7 hari + penetapan ≤ 3 hari ≈ **± 24 hari** → siap ± 8 Des |
| Pendaftaran PSE (aplikasi; halaman rapor kalau diwajibkan) | Jumat 20 Nov | Sebelum sistem digunakan pengguna |
| Ahli hukum memeriksa paket (sejajar, bukan sebelum) | Dipilih secepatnya, paling lambat 30 Nov | Rencana lama "dipilih akhir November" terlalu lambat untuk menjadi syarat pengajuan |
| Uji keluarga (anak dari keluarga lain) | **Setelah profil risiko ditetapkan** | Permenkomdigi 9/2026 |
| Sampai profil ditetapkan | Hanya anak-anak Acut sendiri; 12 penguji Play Store mencoba sebagai orang dewasa **[ASUMSI — ditanyakan ke ahli hukum]** | — |

**Pilihan untuk Acut:**

| Pilihan | Isi | Risiko |
|---|---|---|
| **A. Ajukan sendiri Jumat 13 Nov, ahli hukum memeriksa sejajar** (usul) | Draf kita diajukan; kalau ahli hukum menemukan perbaikan, dokumen diperbarui (Kepmen mengizinkan pembaruan) | Draf awal mungkin perlu klarifikasi |
| B. Tunggu ahli hukum dulu, baru ajukan | Lebih rapi | Uji keluarga mundur ke Januari atau lebih |
| C. Uji keluarga Desember tanpa menunggu profil | Jadwal tetap | **Melanggar** syarat "sebelum anak dapat mengakses"; tidak disarankan |

---

## 7. Daftar periksa sebelum anak dari keluarga lain memakai aplikasi

| # | Periksa | Bukti selesai |
|---|---|---|
| 1 | Profil risiko ditetapkan Komdigi (rendah) | Surel penetapan / nama di daftar publik |
| 2 | Tanda daftar PSE terbit | Nomor TDPSE |
| 3 | Kebijakan privasi diterbitkan di halaman web dan di aplikasi | Tautan |
| 4 | Formulir persetujuan per tujuan berjalan dan tercatat | Uji: 6 tujuan tersimpan dengan versi teks |
| 5 | Penilaian dampak pelindungan data selesai | Berkas bertanggal |
| 6 | Pejabat pelindungan data dan narahubung ditunjuk | Nama di kebijakan privasi |
| 7 | Manifes Android tanpa izin AD_ID, lokasi, kontak; daftar pustaka diperiksa | Laporan pemeriksaan |
| 8 | Formulir Keamanan Data dan sasaran usia di Play Console diisi sesuai kenyataan | Tangkapan layar |
| 9 | Uji akses antarkeluarga lulus | Laporan uji |
| 10 | Hapus akun dari aplikasi dan dari halaman web berjalan | Uji |
| 11 | Cetakan pemberitahuan kebocoran siap | Berkas |
| 12 | Perjanjian pemrosesan data Supabase dan Anthropic dibaca dan disimpan | Berkas |
