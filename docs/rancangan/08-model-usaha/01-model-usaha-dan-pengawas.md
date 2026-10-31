# Model Usaha Baru: Belajar Mandiri dengan Pengawas

**Ringkas:**

1. Pintar Main tidak lagi gratis tanpa batas. Setiap anak belajar **dengan pengawas**, paling sedikit secara daring. Harganya **Rp50–70 ribu per bulan**, dengan **14 hari gratis** untuk mencoba.
2. Anak dikelompokkan dalam **kelas berisi 1–8 anak**. Kelas sekolahnya boleh campur. Pengawas memantau pada **Senin, Rabu, dan Jumat**: melihat kemajuan, menulis catatan untuk orang tua, dan memberi tugas ke anak. Tidak ada video dan tidak ada obrolan dengan anak.
3. Sasaran pertama: **kelas 5–6, fokus Siap TKA**.
4. Ada tiga jalur:
   - **Daring:** keluarga membayar langsung.
   - **Mitra les (opsi B):** les kecil memakai sistem kita. Kita menagih Rp70 ribu per murid per bulan, dan guru les sendiri yang menjadi pengawas.
   - **Tatap muka sendiri (opsi A):** dibuka pelan-pelan nanti, dengan harga di bawah Kumon.
5. Pembayaran berjalan bertahap. Tahap awal: **bayar di luar aplikasi** dengan QRIS, lalu admin mengecek dan mengaktifkan akun. Potongan Google 0%. Tahap berikutnya: langganan Google Play ditambahkan kalau banyak orang tua kesulitan membayar lewat web.
6. Ada empat peran di web: **super admin, admin, mitra les, dan pengawas**. Haknya berbeda-beda.

Status: **usulan untuk disetujui Acut** (31 Okt 2026). Belum ada kode yang dibangun. Bagian yang sudah diputuskan Acut dicatat di `keputusan.md` bagian L.

---

## 1. Kenapa arah ini berubah

| Dulu | Sekarang | Alasan |
|---|---|---|
| Gratis, dibayar dengan masukan sukarela (Arah besar A4, A5) | Berbayar Rp50–70 ribu dengan 14 hari gratis | Aplikasi harus dipakai **dan dibayar** banyak orang supaya bisa bertahan |
| Celah "manusia" ditambal lewat orang tua (B11 no. 0) | Ada pengawas sungguhan, tetapi orang tua tetap ikut | Keberhasilan butuh dua pihak: sistem dengan pengawas, dan dukungan orang tua |
| Tidak ada akun guru; akun pengajar ditunda | Akun pengawas, mitra les, admin, dan super admin di web | Pengawas dan les mitra perlu alat kerja |
| Berbayar paling cepat Juli 2027 (`01-produk/09`) | Berbayar sejak dibuka | Uji keluarga tetap dulu, lalu dibuka dengan masa coba |

**Yang tidak berubah:** kebijakan keluarga Google Play, data anak seminim mungkin, game tanpa kalah, bintang hanya tanda selesai, batas waktu, dan aturan agama (bagian K).

---

## 2. Layanan yang dijual

**Nama kerja: "Belajar Mandiri Berpengawas".** Yang didapat keluarga setiap bulan:

| Bagian | Isi |
|---|---|
| Aplikasi lengkap | Lancar Matematika, Baca Ulang, Persiapan TKA, Gudang Ilmu, Bahasa Inggris, dan game |
| Kelas kecil | 1–8 anak dengan satu pengawas tetap |
| Pantauan 3 kali seminggu | Senin, Rabu, Jumat. Pengawas memeriksa siapa yang belum latihan, topik yang masih lemah, dan hasil mini try out |
| Catatan ke orang tua | Paling sedikit 1 catatan per minggu per anak, berisi apa yang baik, apa yang perlu dibantu, dan satu saran |
| Tugas ke anak | Pengawas memilih topik atau latihan. Anak melihatnya sebagai "Tugas dari Kak Pengawas" |
| Laporan bulanan | Ringkasan kemajuan yang bisa dibagikan ke WhatsApp (nama panggilan dan hewan profil saja) |

**Yang tidak termasuk:** video, obrolan dengan anak, dan janji nilai pasti naik.

### Tugas pengawas per hari kerja (± 20–30 menit per kelas)

1. Buka papan kelas. Sistem sudah menandai tiga hal: anak yang belum latihan 2 hari, topik yang ketepatannya di bawah 70%, dan anak yang sedang lancar (perlu pujian).
2. Tulis catatan untuk orang tua yang perlu. Sistem menyediakan contoh kalimat, tetapi pengawas harus memilih dan menyesuaikannya sendiri.
3. Beri atau perbarui tugas untuk anak yang perlu.
4. Tandai "Pantauan selesai". Ini tercatat supaya super admin tahu jadwal ditepati.

**Kalau anak tidak latihan 1 minggu:** pengawas mengirim catatan khusus ke orang tua. Kalau 2 minggu, admin ikut menanyakan.

---

## 3. Kelas

| Aturan | Isi |
|---|---|
| Ukuran | 1–8 anak. Kelas dibuka walau baru 1 anak |
| Kelas sekolah | Boleh campur (misalnya kelas 5 dan 6 dalam satu kelas). Latihan tetap mengikuti kelas masing-masing anak |
| Pengawas | Satu pengawas tetap per kelas. Admin bisa menggantinya, dan orang tua diberi tahu |
| Masuk kelas | Lewat **kode kelas** yang dimasukkan orang tua di mode orang tua, atau ditambahkan admin dari web |
| Keluar | Orang tua bisa keluar kapan saja. Riwayat anak tidak dihapus dari HP |
| Les mitra | Kelas milik les mitra hanya terlihat oleh mitra itu, guru-gurunya, dan super admin |

---

## 4. Peran dan hak akses (web, dan sebagian di aplikasi)

| Hak | Super admin | Admin | Mitra les | Pengawas |
|---|---|---|---|---|
| Siapa | Acut | Staf pengelola | Pemilik les mitra | Pengawas kita atau guru les mitra |
| Lihat kemajuan anak | Semua | Semua kelas kita | Kelas lesnya | Kelasnya sendiri |
| Catatan ke orang tua dan tugas ke anak | Ya | Ya | Ya | Kelasnya sendiri |
| Buat dan ubah kelas | Ya | Ya | Kelas lesnya | Tidak |
| Tambah atau hapus pengawas | Ya | Ya | Guru lesnya | Tidak |
| Aktifkan langganan (cek QRIS) | Ya | Ya | Tidak | Tidak |
| Harga, tagihan mitra, laporan uang | Ya | Tidak | Lihat tagihannya sendiri | Tidak |
| Tambah admin dan mitra | Ya | Tidak | Tidak | Tidak |
| Laporan pemakaian dan masukan | Semua | Semua | Lesnya | Tidak |

**Aturan keamanan:**

- Semua akun web masuk dengan email dan kode sekali pakai, sama seperti orang tua sekarang.
- Super admin dan admin wajib memakai email yang sudah diverifikasi.
- Setiap tindakan penting dicatat di **catatan kegiatan**: aktifkan langganan, ubah harga, hapus pengawas, dan lihat data di luar kelas sendiri.
- Hak akses dijaga di server dengan aturan baris (RLS), bukan hanya disembunyikan di layar.

**Syarat pengawas kita:** lulusan D3 atau S1 jurusan apa saja. Syarat lainnya:

- lolos tes singkat Matematika dan Bahasa Indonesia kelas 6;
- membaca panduan pengawas;
- menandatangani perjanjian kerahasiaan data anak.

Guru les mitra mengikuti syarat pemilik lesnya, tetapi tetap menandatangani perjanjian kerahasiaan.

---

## 5. Tiga jalur

### 5a. Daring langsung (jalur utama sekarang)

Orang tua mendaftar, mencoba 14 hari gratis, lalu membayar Rp50–70 ribu per bulan. Pengawasnya pengawas kita (Acut untuk sementara).

### 5b. Mitra les (jalur tumbuh paling cepat)

| Hal | Isi |
|---|---|
| Untuk siapa | Les kecil (± 10–60 murid) yang belum punya aplikasi latihan |
| Yang didapat mitra | Akun mitra, akun untuk guru-gurunya, kelas untuk murid lesnya, laporan untuk orang tua, dan **brosur promosi yang bisa diunduh** dengan nama lesnya |
| Harga | Kita menagih **Rp70 ribu per murid aktif per bulan**. Mitra bebas menambahkannya ke biaya lesnya (contoh: Rp150 ribu menjadi Rp220 ribu) |
| Murid aktif | Murid yang latihan paling sedikit 1 hari di bulan itu. Murid yang tidak memakai tidak ditagih |
| Penagihan | Tagihan bulanan otomatis ke mitra tanggal 1. Dibayar dengan QRIS atau transfer paling lambat tanggal 10 |
| Pengawas | Guru les mitra. Kita tidak membayar pengawas, jadi marginnya lebih besar |
| Perjanjian | Perjanjian kerja sama tertulis: harga, perlindungan data anak, larangan menjual ulang akun, dan cara berhenti (pemberitahuan 30 hari) |
| Masa coba mitra | 1 bulan gratis untuk 1 kelas |

### 5c. Tatap muka sendiri (nanti, pelan-pelan)

Dibuka setelah jalur daring dan mitra berjalan. Harganya di bawah Kumon untuk satu mata pelajaran. Rancangannya ditulis terpisah saat waktunya tiba.

---

## 6. Masa coba, persetujuan, dan pembayaran

### 6a. Alur keluarga daring

1. Orang tua menemukan **halaman penjelasan** (landing page) dari iklan atau kiriman teman.
2. Orang tua mengisi formulir singkat: nama panggilan orang tua, email, nomor WhatsApp orang tua, kelas anak, dan nama panggilan anak.
3. Admin menempatkan anak di kelas, lalu mengirim **kode kelas** lewat email atau WhatsApp orang tua.
4. Orang tua memasang aplikasi, memasukkan kode kelas di mode orang tua, membaca layar **penawaran dan persetujuan**, lalu menekan "Setuju". Teks dan waktu persetujuan dicatat.
5. Masa coba **14 hari** dimulai. Di hari ke-10, orang tua menerima email dan WhatsApp berisi laporan singkat dan cara membayar.
6. Orang tua membayar dengan **QRIS di halaman web**. Admin mencocokkan pembayaran lalu menekan "Aktifkan" di web admin.
7. Kalau belum membayar setelah hari ke-14, ada **masa tenggang 7 hari**. Setelah itu pantauan pengawas berhenti. Latihan inti tetap bisa dibuka dan riwayat anak tidak dihapus.

### 6b. Aturan Google Play (dicek 31 Okt 2026)

| Fakta | Akibat untuk kita |
|---|---|
| Aplikasi boleh **"hanya dipakai"**: masuk dan memakai layanan yang dibayar di luar, asal tidak ada pembelian di dalam aplikasi ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en)) | Tahap awal: aplikasi **tanpa tombol beli, tanpa harga, dan tanpa tautan ke halaman bayar**. Penawaran harga hanya ada di halaman web, email, dan WhatsApp ke orang tua |
| Pengecualian layanan berbayar 1:1 hanya berlaku untuk layanan **antara dua orang yang tidak bisa diputar ulang** ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en)) | Pantauan kelas kita (1 pengawas untuk banyak anak, tanpa siaran langsung) **tidak masuk** pengecualian ini. Kalau dibayar di dalam aplikasi, wajib lewat Google |
| Langganan lewat Google Play dipotong **15%**. Di Indonesia ada jalur "pilihan pengguna" dengan potongan **4% lebih rendah** (11%) ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/13821247?hl=en), [pilot](https://support.google.com/googleplay/android-developer/answer/12570971?hl=en)) | Tahap 2: langganan Google Play di mode orang tua (di balik PIN). Rp60 ribu menjadi ± Rp51 ribu bersih sebelum pajak |
| Mahkamah Agung menolak banding Google atas putusan KPPU (Maret 2026) ([TechCrunch](https://techcrunch.com/2025/01/22/google-hit-with-12-6m-fine-in-indonesia-for-monopolistic-practices-in-payment-system), [InvestorTrust](https://investortrust.id/business/56379/google-appeals-kppu-ruling-on-alleged-google-play-monopoly)) | Aturan di Indonesia bisa makin longgar. Dicek ulang di Play Console sebelum tahap 2 |

**Belum terbaca langsung:** halaman kebijakan resmi tidak bisa dibuka dari sesi ini karena jaringannya dibatasi. Fakta di atas berasal dari hasil pencarian yang mengutip halaman Google. **Sebelum dibuka ke umum, isi Play Console dan formulir Families dicek ulang langsung oleh Acut.**

### 6c. Tahapan pembayaran

| Tahap | Cara | Potongan | Kapan pindah |
|---|---|---|---|
| 1 | QRIS usaha milik Acut, cek manual, tombol "Aktifkan" di web admin | QRIS usaha mikro ± 0–0,3% **[perlu dicek ke bank]** | Sejak dibuka |
| 2 | Tambah langganan Google Play di mode orang tua | 15% (11% lewat jalur pilihan) | Kalau lebih dari 30% orang tua yang selesai masa coba tidak jadi membayar karena merasa repot, **atau** lebih dari 50 keluarga membayar sehingga cek manual terlalu berat |
| 3 (bila perlu) | Gerbang bayar otomatis (Midtrans/Xendit) untuk QRIS web | ± 0,7% per transaksi | Kalau cek manual lewat dari ± 2 jam per minggu |

Mitra les selalu ditagih di luar aplikasi (tahap 1 atau 3).

---

## 7. Hitungan uang

Angka di bawah memakai **harga contoh Rp60 ribu** (tengah-tengah Rp50–70 ribu). Semuanya **[ASUMSI]** dan dihitung ulang setelah uji keluarga.

### 7a. Per kelas daring penuh (8 anak, bayar lewat QRIS)

| Pos | Per bulan |
|---|---|
| Pendapatan 8 × Rp60.000 | Rp480.000 |
| Honor pengawas (Rp20.000 per anak aktif, ± 33%) | − Rp160.000 |
| Bagian biaya server, domain, dan email (dibagi rata) | − ± Rp20.000 |
| Pajak penghasilan UMKM 0,5% dari pendapatan **[perlu dicek ke konsultan pajak]** | − Rp2.400 |
| **Sisa untuk pengembangan dan iklan** | **± Rp297.600** |

Kalau dibayar lewat Google Play, pendapatan bersih turun ± Rp72.000 per kelas (15%).

### 7b. Beban kerja pengawas

| Hal | Angka |
|---|---|
| Waktu per kelas per hari kerja | ± 25 menit |
| Per kelas per minggu (3 hari) | ± 75 menit |
| Kapasitas awal satu pengawas paruh waktu | **5 kelas** (± 40 anak, ± 6–7 jam per minggu) |
| Honor 40 anak × Rp20.000 | Rp800.000 per bulan, ± Rp30.000 per jam |

Kapasitas bisa naik ke 8 kelas kalau papan kelas sudah menandai semuanya dengan baik. Ini diukur saat Acut menjadi pengawas pertama.

### 7c. Mitra les

| Pos | Per murid per bulan |
|---|---|
| Tagihan ke mitra | Rp70.000 |
| Honor pengawas | Rp0 (guru les) |
| Server | ± Rp2.500 |
| **Sisa** | **± Rp67.000** |

Satu les dengan 30 murid aktif memberi ± Rp2 juta per bulan. Inilah alasan mitra les menjadi jalur tumbuh utama.

### 7d. Titik impas biaya tetap

Biaya tetap ± Rp1 juta per bulan: Supabase Pro ± USD 25, domain, dan cadangan. Biaya ini tertutup oleh **± 4 kelas daring penuh, atau 15 murid mitra**. Anggaran iklan dihitung terpisah di `02-pemasaran-dan-penjualan.md`.

---

## 8. Pemantauan dan masukan (dengan izin orang tua)

Ini lanjutan permintaan Acut untuk uji keluarga, dan berlaku juga setelah dibuka.

| Bagian | Isi | Data yang dikirim |
|---|---|---|
| Catatan pemakaian | Layar yang dibuka, lama latihan, latihan selesai atau berhenti di tengah | Id anak acak, jenis layar, waktu. **Tanpa** isi ketikan, lokasi, atau id iklan |
| Catatan masalah teknis | Galat aplikasi dan sinkron yang gagal | Pesan galat, versi aplikasi, jenis HP |
| Tombol "Kirim masukan" | Di mode orang tua: pilih jenis (masalah, saran, pujian), tulis kalimat, kirim | Teks dari orang tua |
| Pertanyaan mingguan | 1–2 pertanyaan pilihan untuk orang tua, tidak wajib | Jawaban pilihan |
| Laporan mingguan | Ringkasan otomatis untuk super admin: keluarga aktif, hari latihan, anak berhenti, masalah teknis terbanyak, dan masukan baru | — |

**Aturan:**

- Semua data masuk ke server kita sendiri (Supabase). **Tanpa** analytics atau pelacak pihak ketiga.
- Catatan pemakaian hanya menyala kalau orang tua setuju. Orang tua bisa mematikannya kapan saja tanpa kehilangan layanan. Ini sesuai PP 33/2026 Ps. 35(1) (`keputusan.md` bagian C).
- Catatan masalah teknis menyala bawaan karena tidak memuat data pribadi anak, tetapi disebutkan di teks persetujuan.

---

## 9. Teks persetujuan orang tua (usulan, versi 1)

> **Sebelum mulai**
>
> Anak Anda akan belajar di kelas **[nama kelas]** dengan pengawas **[nama pengawas]**.
>
> Pengawas bisa melihat nama panggilan, kelas, dan hasil latihan anak Anda. Pengawas memantau setiap Senin, Rabu, dan Jumat, lalu mengirim catatan kepada Anda dan memberi tugas latihan kepada anak. Pengawas tidak bisa mengobrol dengan anak.
>
> Kami tidak menyimpan foto, suara, lokasi, atau nomor HP anak. Kami tidak memasang iklan atau pelacak.
>
> Masa coba 14 hari, gratis. Setelah itu biayanya Rp[harga] per bulan. Anda bisa berhenti kapan saja.
>
> ☐ Saya setuju anak saya ikut kelas ini.
> ☐ Boleh kirim catatan pemakaian aplikasi untuk memperbaiki Pintar Main (boleh tidak dicentang).
>
> [Setuju dan mulai]

Catatan:

- Kalimat "Rp[harga] per bulan" **tidak** ditampilkan di dalam aplikasi selama tahap 1 (aturan Google Play di 6b). Di aplikasi tertulis "Biaya dan cara bayar dikirim ke email Anda". Kalimat ini juga dicek ulang terhadap aturan Google.
- Teks lengkap disimpan dengan nomor versi. Persetujuan dicatat bersama versi dan waktunya.
- Teks diperiksa ahli hukum sebelum dibuka ke umum (`02-rancangan/paket-hukum`).

---

## 10. Yang perlu dibangun (urutan usulan)

| No | Bagian | Perkiraan |
|---|---|---|
| 1 | Tabel server: `kelas`, `anggota_kelas`, `staf` (peran), `mitra`, `langganan`, `tagihan_mitra`, `catatan_pengawas`, `tugas`, `persetujuan`, `masukan`, `catatan_teknis`, `catatan_kegiatan`, beserta aturan baris per peran | 3–4 hari |
| 2 | Aplikasi: masukkan kode kelas, layar persetujuan, "Tugas dari Kak Pengawas" di layar anak, catatan pengawas di Kabar orang tua, tombol Kirim masukan, catatan pemakaian dan masalah teknis | 4–5 hari |
| 3 | Web admin: papan kelas pengawas, kelola kelas, aktifkan langganan, kelola mitra dan tagihan, laporan mingguan. Dibangun dengan Expo web yang sama supaya kodenya dipakai bersama | 6–8 hari |
| 4 | Halaman penjelasan dan formulir daftar (web statis) | 2 hari |
| 5 | Brosur mitra yang bisa diunduh (PDF dengan nama les) | 1 hari |
| 6 | Uji keluarga dengan 8–9 anak sebagai kelas pertama, Acut sebagai pengawas | 3–4 minggu |
| 7 | Langganan Google Play (tahap 2 pembayaran) | 2–3 hari, nanti |

**Kekurangan isi:** sasaran kelas 5–6, tetapi Baca Ulang dan Gudang Ilmu baru tersedia untuk kelas 6. Lancar Matematika sudah kelas 1–6. Pilihannya:

- buka untuk kelas 6 dulu dan kelas 5 menyusul; atau
- tambahkan Baca Ulang dan Gudang kelas 5 sebelum dibuka (± 1–2 minggu).

---

## 11. Risiko utama

| Risiko | Penangkal |
|---|---|
| Orang tua tidak mau membayar setelah masa coba | Laporan hari ke-10 yang jelas, catatan pengawas yang terasa pribadi, dan ukuran "jadi bayar" dipantau tiap minggu |
| Pengawas tidak menepati Senin/Rabu/Jumat | Tanda "Pantauan selesai" tercatat. Laporan mingguan menandai kelas yang terlewat |
| Mitra les menjual ulang akun atau tidak membayar | Perjanjian tertulis. Akun kelas dibekukan setelah tanggal 20 kalau tagihan belum dibayar (anak tetap bisa latihan inti) |
| Aturan Google Play ditafsirkan berbeda | Tahap 1 tanpa harga dan tautan bayar di aplikasi. Dicek ulang sebelum dibuka |
| Data anak terlihat oleh orang yang tidak berhak | Aturan baris per peran, catatan kegiatan, dan perjanjian kerahasiaan |
| Sasaran kelas 6 berhenti setelah TKA (April) | Tawarkan lanjutan Bahasa Inggris tingkat 5–6 dan kelas 5 sejak awal |
