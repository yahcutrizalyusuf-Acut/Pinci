-- Hitung Kilat (12 Nov 2026): jenis sesi baru `kilat` untuk latihan cepat hitung dasar di bawah 10.
-- Hanya memperluas daftar jenis yang diterima tabel sesi; tidak ada tabel atau data lain yang diubah.
alter table sesi drop constraint if exists sesi_jenis_check;
alter table sesi add constraint sesi_jenis_check
  check (jenis in ('penempatan', 'lancar', 'tka', 'simulasi', 'mini_tryout', 'baca', 'inggris', 'kartu', 'game', 'kilat'));
