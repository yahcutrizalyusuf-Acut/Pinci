# Kemajuan Pembangunan

Sesi baru: baca berkas ini, `KEPUTUSAN-PEMBANGUNAN.md`, dan `git log`, lalu lanjutkan dari tahap yang belum selesai.

| Tahap | Status | Catatan |
|---|---|---|
| 0 Persiapan repo | Selesai | `docs/RENCANA-PEMBANGUNAN.md` |
| 1 Fondasi | Selesai | Expo SDK 58, desain, Pinci, data, penjaga waktu, bunyi |
| 2 Lancar Matematika | Selesai | mesin kelas 1–6, jurus 36 level, layar A04–A06, tes penempatan |
| 3 Persiapan TKA | Sedang | paket `tka-k6.json` sudah diimpor; layar sedang dibangun |
| 4 Empat game | Sedang | logika selesai dan teruji; layar belum |
| 5 Mode orang tua | Sedang | PIN, Kabar, Ruang anak, Rapor, Bimbingan, Atur, Pengaturan waktu, Kelola guru jadi; Mode Dampingi belum |
| 6 Baca Ulang | Belum | teks T01–T36 ada di `tka-k6.json` |
| 7 Bahasa Inggris | Sedang | 4 paket (48 unit) selesai; layar belum |
| 8 Gudang Ilmu | Sedang | paket 41 kartu selesai; layar belum |
| 9 Supabase | Belum | |
| 10 Uji menyeluruh | Belum | |
| 11 APK | Belum | ikon dan layar pembuka sudah dibuat |

**Perintah untuk melanjutkan:** "Lanjutkan pembangunan dari KEMAJUAN.md."

**Cara memeriksa:** `npm run periksa` (tsc + eslint + jest). Pratinjau web: `EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist && node scripts/sajikan-web.cjs dist 8081`.
