# Rencana Lanjutan: Riset Model Belajar dan Cerita Komik (Tahap 25)

Disusun 11 Nov 2026 dari `PROMPT-LANJUTAN-KOMIK.md`, `CLAUDE.md` (11 Nov), dan rancangan `01-produk/11`, `12`, `13`.

## 1. Layar dan rute

| Kode | Layar | Rute | Pemilik |
|---|---|---|---|
| K28 (diubah) | Unit Bahasa Inggris: **Sesi A Kenal** (Kenal Kata + gerakan → Bunyi Hari Ini → Pola Kalimat → Cerita Komik) dan **Sesi B Pakai** (Cek Paham → Dengar lalu Pilih → Susun Kata → Permainan Kata) | `/inggris/[unit]?sesi=a\|b` | utama |
| K30 | Cerita Komik: Tonton (bersuara, kata disorot) dan Baca (ketuk gelembung/kata, "Artinya?"), kartu Pesan Hari Ini | bagian dari Sesi A, juga `/inggris/komik?unit=` | utama |
| K31 | Cek Paham: urutkan panel, siapa yang bilang, dengar lalu pilih panel, lengkapi gelembung (tingkat 4) | bagian dari Sesi B | utama |
| — | Cek Dengar setiap 4 unit (8 soal tetap) | `/inggris/cek-dengar?tingkat=&ke=` | utama |
| D10 | Ceritakan Lagi (panel tanpa teks, kata bantu, naskah orang tua, renungan, daftar centang) | `/dampingi/cerita?komik=` | subagen D |
| D11 | Dengar Bedanya (🔊 Contoh / 🎙 Suaraku, tips bunyi, "Sudah mirip"/"Coba lagi") | `/dampingi/dengar-bedanya?komik=` | subagen D |
| — | Tebak Gerak | `/dampingi/tebak-gerak` | subagen D |
| — | Izin 8 dan daftar rekaman | `/ortu/rekaman` (dari tab Atur) | subagen D |
| K32 | Main Peran — di balik saklar `FITUR_MAIN_PERAN` (mati) | — | utama |

## 2. Bentuk data

- `src/isi/inggris/komik.ts`: tipe `Tokoh`, `Komik`, `PanelKomik`, `Gelembung`, `SoalCekPaham`, `BunyiHariIni`, `Gerakan`, dan `isiNama`.
- `assets/paket/tokoh.json`: satu-satunya tempat nama tokoh dan pengaturan suara. Naskah memakai penanda `{id}`.
- `assets/paket/komik-t3.json`, `komik-t4.json`: 12 komik (unit 1–6). Paket `inggris-tN.json` diperluas dengan `bunyiHariIni` dan `gerakan` per unit; kosakata baru hanya **ditambahkan** (id lama tidak diubah).
- Panel dirakit dari `latar` + `tokoh[]` (pose, posisi); `gambar` (WebP) menggantikan rakitan kalau ada; `gambar_sementara: true`.
- Tabel `cerita_ulang` (SQLite + migrasi Supabase, aturan baris per keluarga): anak, komik, tanggal, centang, kata target dicentang, `ada_rekaman` (ya/tidak saja).
- Rekaman: berkas `.m4a` di folder pribadi aplikasi + daftar lokal di nilai HP. Tidak pernah masuk antrean sinkron.
- Cek Dengar disimpan sebagai sesi `inggris` dengan `tambahan.cekDengar = true`, supaya rapor bisa membacanya tanpa jenis sesi baru.

## 3. Pemeriksa naskah

`src/isi/inggris/periksaKomik.ts` + `scripts/periksa-komik.ts` + uji Jest: batas panel dan kata per tingkat, kata target, kata di luar daftar (≤ 2, kata fungsi dan kata seru diabaikan), kata bantu, tips bunyi, pesan akhlak, Pesan Hari Ini, renungan, Cek Paham cocok dengan isi, kata terlarang, nama kartun, nama tokoh harus lewat penanda.

## 4. Pembagian kerja

| Pekerja | Berkas yang boleh diubah | Uji yang harus lulus |
|---|---|---|
| Utama | `src/app/inggris/**`, `src/fitur/inggris.ts`, `src/komponen/komik/Gelembung*.tsx`, `src/komponen/GerakPinci.tsx`, `src/isi/inggris/komik.ts`, pemeriksa | `npm run periksa` |
| A — naskah | `assets/paket/komik-t3.json`, `komik-t4.json`, tambahan di `inggris-t3…t6.json`, `docs/NASKAH-KOMIK-UNTUK-GURU.md` | `npx tsx scripts/periksa-komik.ts`, `npx jest src/isi` |
| B — gambar | `src/komponen/komik/**` kecuali `Gelembung*` | `npx jest src/komponen/komik` |
| C — Matematika | `src/komponen/benda/**`, kartu ilmu (`src/app/gudang/[id].tsx`, `src/isi/gudang/**`, `scripts/buat-gudang.ts`, `assets/paket/gudang-k6.json`) | `npx jest src/komponen/benda src/isi/gudang` |
| D — Dampingi | `src/app/dampingi/**`, `src/app/ortu/rekaman.tsx`, tab Atur, `src/layanan/rekaman.ts`, `src/fitur/ceritaUlang.ts`, lapisan data untuk `cerita_ulang`, migrasi baru, rapor, `app.json` | uji perekam dan aturan 12 |
