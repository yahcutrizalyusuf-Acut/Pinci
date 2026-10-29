# Rencana Pembangunan

Disusun 29 Oktober 2026, Tahap 0. Kode layar mengikuti berkas desain (A, B, G, O, P). Kode rancangan (K, D, O) di `docs/rancangan/03-antarmuka/01-daftar-layar-dan-alur.md` ditulis di kolom kedua.

## 1. Layar

| Desain | Rancangan | Layar | Rute expo-router (`src/app/`) |
|---|---|---|---|
| A01 | A1 | Selamat datang | `selamat-datang.tsx` |
| — | A5, A7 | Buat PIN orang tua, tambah anak | `daftar/pin.tsx`, `daftar/anak.tsx` |
| A02 | K1 | Pilih profil | `profil.tsx` |
| A03 | K3 | Beranda Belajar | `anak/index.tsx` (tab Belajar) |
| — | K4 | Tes penempatan Lancar | `lancar/penempatan.tsx` |
| A04 | K5 | Jurus | `lancar/jurus.tsx` |
| A05 | K6 | Lembar Lancar | `lancar/lembar.tsx` |
| A06 | K7 | Akhir lembar | `lancar/akhir.tsx` |
| A07 | K24 | Istirahat | `istirahat.tsx` |
| A07b | K24 | Cukup belajar hari ini / jam tenang | `cukup.tsx` |
| A08 | K10 | Pesan anak | `anak/pesan.tsx` (tab Pesan) |
| B01 | K22 | Gudang Ilmu | `anak/gudang.tsx` (tab Gudang Ilmu) |
| B02 | K23 | Kartu ilmu | `gudang/[id].tsx` |
| B03 | K16–K18 | Baca Ulang | `baca/index.tsx`, `baca/[id].tsx` |
| B04 | K27 | Bahasa Inggris, pilih tingkat | `inggris/tingkat.tsx` |
| B05 | K28 | Unit Bahasa Inggris | `inggris/index.tsx`, `inggris/[unit].tsx` |
| B06 | K13 | Siap TKA, peta 36 topik | `tka/index.tsx` |
| — | K14 | Jalur Mandiri per topik | `tka/topik/[id].tsx` |
| — | K15 | Simulasi dan mini try out | `tka/simulasi.tsx` |
| B07 | D1–D6 | Mode Dampingi | `dampingi/index.tsx` dan anak rutenya |
| G01 | K25 | Waktu main (peta Gampong) | `anak/main.tsx` (tab Main) |
| G02 | K25 | Pilih tingkat game | `game/[nama]/index.tsx` |
| G03–G06 | K25 | Pasar Gampong, Ular Tangga, Susun Kubus, Tebak Kata | `game/[nama]/main.tsx` |
| G07 | K25 | Akhir babak | `game/akhir.tsx` |
| G08 | K25 | Waktu habis | `game/habis.tsx` |
| — | D1 | PIN orang tua | `ortu/pin.tsx` |
| O09 | O1 | Kabar | `ortu/index.tsx` (tab Kabar) |
| O10 | O7 | Ruang anak (riwayat + pesan) | `ortu/anak/[id].tsx` |
| O11 | O2, O4 | Rapor mingguan + rapor TKA | `ortu/rapor.tsx` |
| P08 | O18 | Bimbingan | `ortu/bimbingan.tsx` |
| O12 | O20 | Pengaturan waktu | `ortu/waktu/[id].tsx` |
| — | O10 | Atur (anak, PIN, bunyi, data) | `ortu/atur.tsx` |
| P09 | O19 | Kelola guru (saklar fitur, tersembunyi) | `ortu/guru.tsx` |

## 2. Paket isi

| Paket | Berkas | Sumber |
|---|---|---|
| Lancar Matematika kelas 1–6 | dibuat kode (`src/mesin/lancar/`) | `bahan/purwarupa-lancar-v5/` + `04-mesin-lancar.md` |
| Siap TKA kelas 6 | `assets/paket/tka-k6.json` (dibuat `npm run impor-tka`) | `bahan/kursus-tka-sd/` |
| Baca Ulang kelas 6 | teks T01–T36 di dalam `tka-k6.json` | `bahan/kursus-tka-sd/03-bank-teks-baca-cepat/` |
| Gudang Ilmu kelas 6 | `assets/paket/gudang-k6.json` | modul M01–M24 dan B01–B12 |
| Belajar Bahasa Inggris | `assets/paket/inggris-t3.json` … `inggris-t6.json` | ditulis sendiri sesuai `11-belajar-bahasa-inggris.md` |
| Tebak Kata (game) | `src/game/tebak-kata/bank.ts` | ditulis sendiri |
| Tips Ayah Bunda | `assets/paket/tips-ortu.json` | ditulis sendiri dari rancangan |

## 3. Pembagian kerja subagen

| Subagen | Folder miliknya | Uji yang harus lulus |
|---|---|---|
| Mesin Lancar | `src/mesin/lancar/` | `npx jest src/mesin/lancar` (8.100 lembar) |
| Impor TKA | `scripts/impor-tka.ts`, `src/isi/tka/`, `assets/paket/tka-k6.json`, `docs/LAPORAN-IMPOR-TKA.md` | `npx jest src/isi/tka` |
| Logika 4 game | `src/game/` | `npx jest src/game` |
| Bahasa Inggris tingkat 3, 4, 5, 6 (4 subagen) | `assets/paket/inggris-tN.json` | `npx jest src/isi/inggris` |
| Kartu Gudang Ilmu | `src/isi/gudang/`, `assets/paket/gudang-k6.json` | `npx jest src/isi/gudang` |
| Pengendali utama | fondasi, semua layar, data, layanan | `npm run periksa` |

Subagen tidak menjalankan git; pengendali utama yang meng-commit.
