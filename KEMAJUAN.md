# Kemajuan Pembangunan

Sesi baru: baca berkas ini, `KEPUTUSAN-PEMBANGUNAN.md`, dan `git log`, lalu lanjutkan.

| Tahap | Status | Catatan |
|---|---|---|
| 0 Persiapan repo | Selesai | `docs/RENCANA-PEMBANGUNAN.md` |
| 1 Fondasi | Selesai | Expo SDK 58, desain, Pinci, data, penjaga waktu, bunyi |
| 2 Lancar Matematika | Selesai | Mesin kelas 1–6, 36 jurus, tes penempatan, 8.100 lembar teruji |
| 3 Persiapan TKA | Selesai | 36 topik, 5 simulasi, mini try out, rapor penyebab. `docs/LAPORAN-IMPOR-TKA.md` |
| 4 Empat game | Selesai | Pasar Gampong, Ular Tangga Lurus, Susun Kubus, Tebak Kata |
| 5 Mode orang tua dan Dampingi | Selesai | PIN, Kabar, Rapor, Bimbingan, Atur, Mode Dampingi |
| 6 Baca Ulang | Selesai | 36 teks, pengukur kecepatan baca |
| 7 Bahasa Inggris | Selesai | 48 unit, tingkat 3–6 |
| 8 Gudang Ilmu | Selesai | 41 kartu kelas 6 |
| 9 Supabase | Tersambung (29 Okt) | Proyek `pintar-main` (Singapura), SMTP Brevo, variabel GitHub `supabase`. Lihat `docs/CARA-MENYAMBUNG-SUPABASE.md` |
| 10 Uji menyeluruh | Selesai | `docs/BANDING-DESAIN.md`, `docs/LAPORAN-PEMERIKSAAN.md` |
| 11 APK | Selesai | Bangun APK hijau, artifact `pintar-main-apk`. Expo Go dilewati (belum ada `EXPO_TOKEN`) |
| 12 Game tambahan | Selesai (30 Okt) | Susun Kubus dipermudah; 4 game baru berjenjang level 1–5 |
| 13 Hubungkan HP anak | Selesai (31 Okt), perlu pasang SQL | Kode 6 angka, sinkron dua arah, HP anak tanpa PIN. Pasang `20261030000000_hubungkan_hp_anak.sql` dan nyalakan Allow anonymous sign-ins. Lihat `docs/CARA-MENYAMBUNG-SUPABASE.md` |
| 14 Model usaha baru | Rancangan (31 Okt), menunggu persetujuan Acut | Kelas dengan pengawas, peran web, mitra les, pembayaran bertahap, pemasaran. `docs/rancangan/08-model-usaha/` |
| 15 Minggu 1: kelas dan pengawas | Selesai (31 Okt), perlu pasang SQL | Kode kelas, persetujuan, paket, catatan pengawas di Kabar, tugas di beranda anak, halaman staf `/staf` (papan kelas, kelola kelas dan staf). Pasang `20261101000000_kelas_pengawas.sql` dan undang super admin. Lihat `docs/CARA-MENYAMBUNG-SUPABASE.md` |
| 16 Isi kelas 2–5 tahap 1 | Selesai (31 Okt), perlu diperiksa | 24 teks Baca Ulang dan 24 kartu Gudang Ilmu. Lembar periksa: `docs/periksa-isi/Periksa-Isi-Kelas-2-5.pdf` |
| 17 Langganan dan masukan | Selesai (31 Okt), perlu pasang SQL | Kunci paket, status langganan, catat pembayaran QRIS, harga, tagihan mitra, Kirim masukan, pertanyaan mingguan, catatan pemakaian (dengan izin) dan teknis, pendaftar, laporan mingguan. Pasang `20261102000000_langganan_masukan.sql` |
| 18 Halaman penjelasan dan brosur | Selesai (31 Okt), perlu diterbitkan | Folder `halaman/` dan alur "Terbitkan halaman penjelasan". Lihat `docs/CARA-MENYAMBUNG-SUPABASE.md` |
| 19 Isi kelas 2–5 tahap 2 | Selesai (31 Okt), perlu diperiksa | 12 teks dan 12 kartu per kelas. Lembar periksa: `docs/periksa-isi/Periksa-Isi-Kelas-2-5.pdf` (91 halaman) |

## Berikutnya

1. Keputusan Acut 29 Okt sudah diterapkan (`docs/rancangan/keputusan.md` bagian K).
2. Terapkan hasil pemeriksaan guru (`docs/DAFTAR-PERIKSA-GURU.md`). Untuk TKA: perbaiki bahan, lalu jalankan `npm run impor-tka`.
3. Pasang SQL hubungkan HP anak di Supabase, lalu uji dua HP sungguhan (orang tua dan anak).
4. Semua yang bisa dibangun sebelum 4 Januari sudah selesai (rancangan 08 bagian 10a). Tersisa pekerjaan Acut: pasang SQL (kelas, lalu langganan), undang super admin, periksa isi kelas 2–5, terbitkan halaman penjelasan, siapkan QRIS, uji tertutup Google Play, uji keluarga.
5. Setelah uji keluarga: hitung ulang harga, perbaiki isi dari catatan Acut/guru, lalu langganan Google Play bila syaratnya terpenuhi.
6. Kelas 1 menyusul setelah kelas 2–6 berjalan.

**Perintah untuk melanjutkan:** "Lanjutkan pembangunan dari KEMAJUAN.md."

**Cara memeriksa:** `npm run periksa`. Pratinjau web: `EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist && node scripts/sajikan-web.cjs dist 8081`. Tangkapan layar: `node scripts/tangkap-layar.cjs`. Daftar guru: `node scripts/buat-daftar-guru.cjs`.
