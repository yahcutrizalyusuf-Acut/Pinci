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

## Berikutnya

1. Keputusan Acut 29 Okt sudah diterapkan (`docs/rancangan/keputusan.md` bagian K).
2. Terapkan hasil pemeriksaan guru (`docs/DAFTAR-PERIKSA-GURU.md`). Untuk TKA: perbaiki bahan, lalu jalankan `npm run impor-tka`.
3. Pasang SQL hubungkan HP anak di Supabase, lalu uji dua HP sungguhan (orang tua dan anak).
4. Acut memeriksa `docs/rancangan/08-model-usaha/`. Setelah disetujui, bangun urutan di bagian 10 berkas 01.
5. Lanjut ke kelas 1–5.

**Perintah untuk melanjutkan:** "Lanjutkan pembangunan dari KEMAJUAN.md."

**Cara memeriksa:** `npm run periksa`. Pratinjau web: `EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist && node scripts/sajikan-web.cjs dist 8081`. Tangkapan layar: `node scripts/tangkap-layar.cjs`. Daftar guru: `node scripts/buat-daftar-guru.cjs`.
