# Cara Menyambung Supabase

> **Status 29 Okt 2026: sudah tersambung.**
>
> - Proyek: `pintar-main` di organisasi Pintar Main, region Southeast Asia (Singapore), alamat `https://nammubdjdjznpyodroel.supabase.co`.
> - Skema awal dan uji RLS sudah dijalankan, dan uji RLS lulus.
> - Masuk lewat email memakai kode 6 angka yang berlaku 10 menit, dikirim lewat SMTP Brevo. Uji kirim sudah sampai ke kotak masuk.
> - Uji di HP 30 Okt: orang tua berhasil masuk dengan kode 6 angka dan membuat profil anak.
> - Variabel GitHub sudah diisi: `EXPO_PUBLIC_DATA_MODE=supabase`, URL, dan anon key. APK dari proses Bangun APK sekarang memakai Supabase.

Saat ini aplikasi berjalan **lokal**: semua data tersimpan di HP, tidak dikirim ke mana pun. Kalau nanti ingin orang tua melihat hasil anak dari HP lain, sambungkan ke Supabase dengan langkah di bawah. Kodenya sudah siap. Acut hanya perlu membuat proyek, mengisi dua kunci, dan mengubah satu saklar.

## Yang perlu disiapkan

- Akun Supabase (gratis untuk uji): <https://supabase.com>
- Pengirim email sendiri (SMTP), misalnya Brevo (gratis 300 email per hari). Pengirim bawaan Supabase hanya untuk uji dan dibatasi.

## Langkah

1. **Buat proyek baru** di Supabase.
   - Nama: `pintar-main`
   - Region: **Southeast Asia (Singapore)**
   - Simpan kata sandi basis data di tempat aman.
2. **Pasang skema dan aturan akses.** Buka menu **SQL Editor**, lalu tempel dan jalankan isi berkas berikut, berurutan:
   1. `supabase/migrations/20261029000000_skema_awal.sql` (tabel, aturan akses per keluarga, fungsi pendaftaran)
   2. `supabase/migrations/20261029000100_uji_rls.sql` (uji: harus selesai tanpa pesan "RLS bocor")
3. **Nyalakan masuk lewat email.**
   - Buka **Authentication → Providers → Email**, nyalakan.
   - Panjang kode: **6**. Masa berlaku: **600 detik** (10 menit).
   - Buka **Authentication → Email Templates**. Template **Magic Link**, **Confirm signup**, **Invite user**, dan **Reauthentication** harus memakai `{{ .Token }}` (kode 6 angka), bukan tautan. Pendaftar baru menerima *Confirm signup*; kalau template itu masih bawaan, orang tua menerima tautan ke `localhost` dan tidak bisa masuk.
   - Buka **Authentication → URL Configuration**, lalu ganti Site URL menjadi `pintarmain://`.
   - Buka **Project Settings → Auth → SMTP**, isi data pengirim email (Brevo).
4. **Ambil dua kunci.** Buka **Project Settings → API**, lalu salin:
   - **Project URL**, misalnya `https://abcd.supabase.co`
   - **anon public key** (bukan service_role)
5. **Isi kunci dan ubah saklar.**
   - Di GitHub: buka repo, pilih **Settings → Secrets and variables → Actions → Variables**, lalu tambah tiga variabel:
     - `EXPO_PUBLIC_DATA_MODE` = `supabase`
     - `EXPO_PUBLIC_SUPABASE_URL` = Project URL
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - Untuk menjalankan di komputer: salin `.env.contoh` menjadi `.env`, lalu isi tiga baris yang sama.
6. **Bangun ulang APK.** Jalankan lagi proses **Bangun APK** di tab Actions. Lihat `docs/CARA-MEMBUAT-APK.md`.

## Setelah tersambung

- Orang tua masuk dengan email dan kode 6 angka. Layar masuk baru muncul setelah saklar diubah.
- Hasil latihan tetap disimpan dulu di HP, lalu dikirim saat ada sinyal. Pengiriman diulang dengan jeda 1, 2, 5, lalu 15 menit.
- Layar akhir lembar menampilkan **Tersimpan ✓**, lalu **Terkirim ✓✓** setelah server menerima.
- Orang tua hanya bisa membaca data keluarganya sendiri. Aturan ini dijaga di server (Row Level Security).

## Kembali ke mode lokal

Ubah `EXPO_PUBLIC_DATA_MODE` menjadi `lokal`, lalu bangun ulang APK. Data yang sudah ada di HP tetap ada.

## Menghubungkan HP anak dengan HP orang tua

Supaya anak belajar di HP-nya sendiri dan hasilnya terlihat di HP orang tua (rapor, pesan, pengaturan waktu).

### Pemasangan sekali saja (Acut)

1. Buka **SQL Editor** di Supabase, tempel dan jalankan isi `supabase/migrations/20261030000000_hubungkan_hp_anak.sql`.
2. Jalankan juga `supabase/migrations/20261030000100_uji_hubungkan.sql`. Hasilnya harus selesai tanpa tulisan **GAGAL**. Berkas ini hanya menguji lalu membatalkan perubahannya sendiri, jadi data tidak berubah.
3. Buka **Authentication → Sign In / Providers**, lalu nyalakan **Allow anonymous sign-ins**. HP anak masuk tanpa email lewat cara ini. Bila tidak dinyalakan, HP anak menampilkan "Belum tersambung".
4. Bangun ulang APK (tab Actions → Bangun APK) dan pasang di kedua HP.

### Cara memakai

1. **HP orang tua:** gembok, PIN, tab **Atur**, **Hubungkan HP anak**. Pilih anak, lalu **Buat kode**. Muncul kode 6 angka yang berlaku 10 menit.
2. **HP anak:** pasang Pintar Main, ketuk **Ini HP anak**, lalu ketik kode. HP anak butuh internet saat menghubungkan.
3. Selesai. Sesudah itu:
   - hasil latihan anak muncul di HP orang tua (Kabar, Rapor, ruang anak),
   - pesan dan stiker saling terkirim,
   - pengaturan waktu dari HP orang tua berlaku di HP anak,
   - tiap menit, dan saat aplikasi dibuka kembali, kedua HP saling bertukar data. Tanpa internet, semuanya tetap disimpan dulu lalu terkirim kemudian.
4. Di **Hubungkan HP anak** orang tua melihat HP yang terhubung, kapan terakhir sinkron, dan bisa **Putuskan** kapan saja. HP yang diputus tetap bisa dipakai belajar, tetapi tidak lagi terhubung.

### Aturan keamanan

- Kode 6 angka hanya berlaku 10 menit dan sekali pakai. Salah 5 kali, HP itu ditunda 10 menit.
- HP anak hanya bisa membaca dan menulis data anak yang dipilih orang tua. Tidak bisa membuat atau mengubah profil dan pengaturan, tidak bisa mengirim pesan teks bebas (hanya stiker), dan tidak punya mode orang tua.
- Akun orang tua tidak bisa dipakai sebagai HP anak.

### Kalau ada dua HP yang mengubah hal yang sama

- Hasil latihan (sesi dan jawaban) hanya ditambah, tidak pernah berubah.
- Perubahan di HP ini yang belum terkirim tidak ditimpa data dari server.
- Waktu pemakaian hari itu: angka terbesar dari kedua HP dipakai.
- Profil, pengaturan waktu, dan pesan: yang terakhir dikirim ke server dipakai.

## Kelas dengan pengawas (staf, kelas, catatan, tugas)

Rancangan: `docs/rancangan/08-model-usaha/`. Orang tua memasukkan **kode kelas**, pengawas memantau lewat **halaman staf**.

### Pemasangan sekali saja (Acut)

1. Supabase → **SQL Editor** → tempel isi `supabase/migrations/20261101000000_kelas_pengawas.sql` → **Run**.
2. Tempel isi `supabase/migrations/20261101000100_uji_kelas.sql` → **Run**. Lulus kalau tidak ada pesan "GAGAL" (semua data uji dibatalkan otomatis).
3. Jadikan email Acut super admin. Ganti alamat email di bawah, lalu **Run**:

   ```sql
   insert into undangan_staf (email, peran, nama) values ('emailacut@contoh.com', 'super_admin', 'Acut');
   ```

4. Bangun ulang APK (tab Actions → Bangun APK).

### Cara memakai

1. **Staf masuk:** di aplikasi, tab **Atur** → **Masuk sebagai pengawas atau admin**. Atau buka alamat web aplikasi + `/staf` di laptop. Masuk dengan email yang diundang dan kode 6 angka.
2. **Buat kelas** (super admin, admin, mitra les): **Kelola kelas dan staf** → isi nama kelas, pilih pengawas → **Buat kelas**. Muncul **kode kelas** 6 huruf/angka untuk orang tua.
3. **Undang staf:** di halaman yang sama, isi email dan nama panggilan. Staf itu lalu masuk sendiri dengan emailnya.
4. **Orang tua:** tab **Atur** → **Kelas dan pengawas** → **Masukkan kode kelas** → pilih paket → setujui. Masa coba 14 hari dimulai.
5. **Pengawas (Senin, Rabu, Jumat):** buka kelas → lihat penanda (belum latihan, topik lemah, perlu dipuji) → ketuk anak → tulis catatan untuk orang tua dan beri tugas → kembali → **Pantauan selesai**.
6. Catatan muncul di **Kabar** orang tua. Tugas muncul di beranda anak sebagai **Tugas dari Kak Pengawas**, dan selesai otomatis saat anak mengerjakan latihan yang cocok.

### Aturan keamanan

- Pengawas hanya melihat anak di kelasnya sendiri. Mitra les hanya melihat kelas lesnya. Admin melihat kelas Pintar Main. Super admin melihat semuanya.
- Pengawas tidak bisa mengirim apa pun ke HP anak selain tugas. Catatan hanya untuk orang tua.
- Tindakan penting (membuat kelas, mengganti pengawas, menghentikan staf, admin membuka papan kelas orang lain) tercatat di tabel `catatan_kegiatan`.
- Tebakan kode kelas dibatasi 5 kali salah per 10 menit.

## Langganan, masukan, pendaftar, laporan (pasang sesudah bagian kelas)

1. Supabase → **SQL Editor** → tempel isi `supabase/migrations/20261102000000_langganan_masukan.sql` → **Run**.
2. Tempel `supabase/migrations/20261102000100_uji_langganan.sql` → **Run**. Lulus kalau tidak ada pesan "GAGAL".
3. Harga awal hanya contoh (Dasar Rp50.000, Lengkap Rp60.000, Siap TKA Rp70.000, mitra Rp70.000 per murid). Ubah di halaman staf → **Harga dan tagihan**.

Yang bisa dipakai sesudahnya:

- **Langganan** (super admin, admin): daftar anak dengan status (masa coba, aktif, tenggang, berhenti), email orang tua untuk mengirim cara bayar, dan tombol **Catat pembayaran** → **Aktifkan**. Perpanjangan dihitung dari akhir masa coba atau akhir langganan sebelumnya.
- **Kunci paket di HP anak:** Dasar = Lancar, Baca Ulang, game. Lengkap = + Bahasa Inggris, Gudang Ilmu. Siap TKA = + TKA. Langganan berhenti = hanya Lancar, Baca Ulang, dan game. Bagian yang terkunci tampil redup dengan gembok, tanpa ajakan membeli.
- **Kirim masukan** (orang tua, menu Atur) dan **pertanyaan mingguan** di Kabar → terbaca di **Laporan mingguan** staf.
- **Catatan pemakaian** hanya dikirim bila orang tua mencentangnya (di layar Kelas dan pengawas; bisa dimatikan kapan saja). **Catatan masalah teknis** (pesan galat, versi, jenis HP) dikirim otomatis tanpa data pribadi.
- **Pendaftar** dari halaman penjelasan, **Laporan mingguan**, dan **Tagihan les mitra** per bulan (murid aktif = latihan minimal 1 hari di bulan itu).

## Halaman penjelasan dan brosur

Folder `halaman/`: halaman keluarga (`index.html`), halaman mitra (`mitra.html`), dan brosur cetak (`brosur.html`). Tanpa kuki dan tanpa pelacak; asal pengunjung dicatat dari tautan, misalnya `…/index.html?dari=fb-tka-1`.

1. GitHub → **Settings → Pages → Source: GitHub Actions**. (Untuk repo pribadi, Pages butuh paket berbayar. Pilihan lain: unggah isi folder `halaman/` ke Cloudflare Pages atau Netlify, lalu isi `halaman/config.js` dengan URL dan kunci anon Supabase.)
2. Boleh isi variabel repo `WA_ADMIN` (format 628…) untuk tombol "Tanya lewat WhatsApp".
3. Jalankan **Actions → Terbitkan halaman penjelasan**. Alamatnya muncul di hasil alur.
4. Isi variabel repo `EXPO_PUBLIC_HALAMAN_URL` dengan alamat itu, lalu bangun ulang APK. Menu **Brosur untuk orang tua** muncul di halaman staf (super admin dan mitra).
5. Harga di halaman diubah di `halaman/config.js` (bagian `harga`).

## Yang belum dibuat (menyusul)

- Langganan lewat Google Play (tahap 2 pembayaran) dan gerbang bayar otomatis (tahap 3), sesuai syarat di rancangan bagian 6c.
- Email otomatis hari ke-10 masa coba: untuk sementara admin mengirimnya sendiri dari halaman Langganan.

- Orang tua kedua dan link rapor lewat WhatsApp, serta panel pengelola.
- Menghapus anak di satu HP belum ikut terhapus di HP lain.
