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
| 20 PDF riset cara belajar | Selesai (3 Nov) | 12 temuan, versi HP dan laptop di `halaman/unduh/`. Dibuat dengan `node scripts/buat-riset-pdf.cjs` |
| 21 Gratis selamanya dan masa coba | Selesai (3 Nov), perlu pasang SQL | Jatah harian Gratis, pelajaran pilihan, harga per pelajaran dan promo, jalan bayar B. Rancangan `docs/rancangan/08-model-usaha/03-gratis-ke-berbayar.md`. Pasang `20261103000000_gratis_pendaftaran.sql` |
| 22 Pendaftaran masa coba | Selesai (3 Nov), perlu pasang SQL | Online atau antre tatap muka, 8 pertanyaan pengenalan, telepon, izin. Halaman staf Pendaftar. Uji `scripts/uji-coba.cjs` |
| 23 Perbaikan profil anak kembar | Selesai (3 Nov) | Profil kembar ditolak, tombol hapus profil anak, keluarga lama dipulihkan saat masuk ulang |
| 24 Tim merah | Laporan (3 Nov) | Nilai 17/30, saran: uji 10 keluarga dan 2 les sebelum menambah fitur. https://claude.ai/artifact/EMxagKcTjHTJgJmMVfGwxY |
| 25 Lanjutan Komik | Selesai (11 Nov), SQL terpasang (11 Nov), perlu diperiksa guru | 12 Cerita Komik (tingkat 3–4), unit Inggris Sesi A/B, Cek Dengar, Ceritakan Lagi, Dengar Bedanya + Izin 8 (rekaman hanya di HP), Tebak Gerak, rapor Inggris, Matematika benda → gambar → angka. Laporan: `LAPORAN-LANJUTAN-KOMIK.md`. SQL `20261104000000_batas_pendaftaran.sql` dan `20261111000000_cerita_ulang.sql` sudah terpasang dan lulus uji di Supabase |

## Lanjutan Komik (Tahap 25, 11 Nov 2026)

| Sub-tahap | Status | Hasil |
|---|---|---|
| 25.0 Rencana | Selesai | `docs/RENCANA-LANJUTAN-KOMIK.md` |
| 25.1 Bentuk data, tokoh, pemeriksa naskah | Selesai | `assets/paket/tokoh.json`, `src/isi/inggris/komik.ts`, `npx tsx scripts/periksa-komik.ts` |
| 25.2 12 naskah | Selesai, belum diperiksa guru | `assets/paket/komik-t3.json`, `komik-t4.json`, `docs/NASKAH-KOMIK-UNTUK-GURU.md` (sumber: `scripts/buat-komik.py`) |
| 25.3 Gambar sementara | Selesai | 9 tokoh × 6 pose, 8 latar; pratinjau `/pratinjau/komik` |
| 25.4 Unit Inggris baru | Selesai | Sesi A/B, Bunyi Hari Ini, gerakan, Cek Dengar tiap 4 unit |
| 25.5 Cerita Komik + Cek Paham | Selesai | K30, K31 |
| 25.6 Dampingi | Selesai | Ceritakan Lagi, Dengar Bedanya, Izin 8, perekam, Tebak Gerak, rapor; tabel `cerita_ulang` |
| 25.7 Matematika benda | Selesai | 5 benda, 20 kartu "Coba dengan benda", 28 soal cerita Aceh, pancingan orang tua |
| 25.8 Pemeriksaan | Selesai | `docs/LAPORAN-PEMERIKSAAN-KOMIK.md`, tangkapan layar `docs/tangkapan/komik/` |
| 25.9 APK dan laporan | Lihat `LAPORAN-LANJUTAN-KOMIK.md` | |

**Mengubah naskah komik:** ubah `scripts/buat-komik.py`, lalu `git checkout assets/paket/inggris-t3.json assets/paket/inggris-t4.json assets/paket/inggris-t5.json assets/paket/inggris-t6.json && python3 scripts/buat-komik.py && npx tsx scripts/periksa-komik.ts && npx tsx scripts/buat-naskah-guru.ts`.

**Tangkapan layar komik:** `node scripts/tangkap-komik.cjs` dan `node scripts/tangkap-dampingi.cjs` (setelah build web).

## Berikutnya

0. SQL batas pendaftaran dan `cerita_ulang` sudah terpasang (11 Nov). Guru memeriksa `docs/NASKAH-KOMIK-UNTUK-GURU.md`. Website baru dan halaman sambutan ditunda sampai Acut memutuskan (saran tim merah: uji ke pembeli dulu).
1. Keputusan Acut 29 Okt sudah diterapkan (`docs/rancangan/keputusan.md` bagian K).
2. Terapkan hasil pemeriksaan guru (`docs/DAFTAR-PERIKSA-GURU.md`). Untuk TKA: perbaiki bahan, lalu jalankan `npm run impor-tka`.
3. Pasang SQL hubungkan HP anak di Supabase, lalu uji dua HP sungguhan (orang tua dan anak).
4. Semua yang bisa dibangun sebelum 4 Januari sudah selesai (rancangan 08 bagian 10a). Tersisa pekerjaan Acut: pasang SQL (kelas, lalu langganan), undang super admin, periksa isi kelas 2–5, terbitkan halaman penjelasan, siapkan QRIS, uji tertutup Google Play, uji keluarga.
5. Setelah uji keluarga: hitung ulang harga, perbaiki isi dari catatan Acut/guru, lalu langganan Google Play bila syaratnya terpenuhi.
6. Kelas 1 menyusul setelah kelas 2–6 berjalan.

**Perintah untuk melanjutkan:** "Lanjutkan pembangunan dari KEMAJUAN.md."

**Cara memeriksa:** `npm run periksa`. Pratinjau web: `EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist && node scripts/sajikan-web.cjs dist 8081`. Tangkapan layar: `node scripts/tangkap-layar.cjs`. Daftar guru: `node scripts/buat-daftar-guru.cjs`.
