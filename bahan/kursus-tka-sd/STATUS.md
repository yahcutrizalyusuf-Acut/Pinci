# Status Produksi — Paket Siap TKA SD

Diperbarui: 17 September 2026 — **semua tahap selesai**

| Tahap | Pekerjaan | Status |
|---|---|---|
| 0 | Enam berkas induk (`00-berkas-induk/`) | ✅ |
| 1 | Modul cetakan M02 + pemeriksaan sendiri | ✅ |
| 2 | 36 modul (`01-`, `02-`), 5 paket simulasi (`*/simulasi/`), 36 teks baca cepat (`03-`) | ✅ |
| 3 | Petunjuk pelaksanaan (`04-petunjuk/`, 7 berkas) | ✅ |
| 4 | Pemeriksaan mutu 17 butir → `05-pemeriksaan/laporan-mutu.md` + laporan rinci + verifikasi akhir | ✅ 0 kunci salah; semua temuan prioritas diperbaiki |
| 5 | Berkas siap pakai (`06-siap-pakai/`) | ✅ |
| Lanjutan | Bahan pelatihan pengajar 12 jam (`07-pelatihan-pengajar/`, 7 berkas) | ✅ 17 Sep 2026 |
| Lanjutan | Naskah video V01 (`08-konten-video/`), promosi WhatsApp + halaman pendaftaran (`09-promosi/`) | ✅ 17 Sep 2026 |
| Lanjutan | Bantahan M02 oleh guru SD (`05-pemeriksaan/bantahan-M02-guru-sd.md`): nomor soal lembar kerja, perubahan non-waktu dikerjakan; **perubahan waktu menunggu kelas uji coba** | ⏳ |

## Isi `06-siap-pakai/`

| Berkas | Jumlah |
|---|---|
| `modul-docx/` | 36 modul Word (A4, huruf 12pt, tiap halaman modul mulai di halaman baru, lampiran teks baca cepat) |
| `modul-pdf/` | 36 modul PDF |
| `lembar-kerja-anak/` | 36 PDF: baca cepat + soal ● bernomor sama dengan modul (M01/B01: tes awal) + tiket keluar di halaman potong + **D. Latihan rumah** dengan halaman kunci (29 lembar; tidak ada di M01, B01, simulasi). Huruf 14pt, hitam-putih |
| `kartu-fakta-perkalian.pdf` | Kartu perkalian 1–10 untuk anak dengan skor tes awal Matematika 7–11, minggu 1–2 |
| `simulasi/` | 5 paket × 2 PDF: `-naskah` (petunjuk + 30 soal + lembar jawaban) dan `-kunci` (untuk pengajar) |
| `rapor-penguasaan.xlsx` | Petunjuk · Data Murid · Tiket Keluar · Penguasaan Topik · Kehadiran · Survei Murid · Laporan Orang Tua |
| `buku-pegangan-pengajar.pdf` | 7 berkas petunjuk dalam satu buku dengan daftar isi |
| `pelatihan-pengajar/` | `bahan-pelatihan-pengajar.pdf` (113 halaman: panduan, naskah Sesi 1–4, ujian dan lembar penilaian) · `kartu-dan-lembar-peserta.pdf` (70 halaman: K1–K5, L1–L3, satu kartu per halaman) · versi .docx keduanya |

## Isi `10-berkas-word/`

| Folder | Isi |
|---|---|
| `01-modul-matematika/` | 24 modul .docx (M01–M24) + `paket-simulasi/` S1–S4 lengkap dengan kunci |
| `02-modul-bahasa-indonesia/` | 12 modul .docx (B01–B12) + `paket-simulasi/` S5 lengkap dengan kunci |
| `03-bank-teks-baca-cepat/` | 36 teks .docx (T01–T36, dengan pertanyaan dan kunci) + `00-bank-teks-baca-cepat-lengkap.docx` |
| `04-lembar-kerja-anak/` | 36 lembar kerja anak .docx (LK-P01-M01 … LK-P36-B12), isi sama dengan PDF di `06-siap-pakai/lembar-kerja-anak/` |
| `05-buku-pegangan-pengajar/` | `buku-pegangan-pengajar.docx` (sampul + daftar isi + 7 petunjuk) + `petunjuk-terpisah/` 7 berkas .docx |
| `06-bahan-pelatihan-pengajar/` | `bahan-pelatihan-pengajar.docx` (sampul + daftar isi + panduan, naskah Sesi 1–4, ujian) · `kartu-dan-lembar-peserta.docx` (K1–K5, L1–L3, satu kartu per halaman) · `berkas-terpisah/` 6 berkas .docx |
| `07-materi-promosi/` | `01-pesan-whatsapp-orang-tua.docx` (pesan A–H, balasan cepat, teks poster) · `03-cara-memasang-halaman.docx`. Halaman pendaftaran tetap HTML di `09-promosi/` |

Dibangun ulang dengan `python _alat/bangun.py word`, lalu `python _alat/perbarui_daftar_isi.py 10-berkas-word/05-buku-pegangan-pengajar/buku-pegangan-pengajar.docx` dan `…/06-bahan-pelatihan-pengajar/bahan-pelatihan-pengajar.docx` supaya daftar isinya terisi.

## Alat (`_alat/`)

| Berkas | Guna |
|---|---|
| `peta_final.py` | Peta spiral + pemeriksa aturan daur ulang |
| `periksa.py` | Pemeriksa modul, `--teks`, `--simulasi` |
| `bangun.py` | Membangun docx (modul, lembar kerja, simulasi, buku); `bangun.py pelatihan` untuk bahan pelatihan |
| `konversi.py` | docx → PDF lewat Microsoft Word |
| `rapor_xlsx.py` | Membangun workbook rapor |
| `rapikan_rujukan_teks.py` | Melengkapi rujukan teks baca cepat di modul |

**Kalau ada modul yang diubah:** jalankan `python _alat/periksa.py <berkas>`, lalu `python _alat/bangun.py semua`, lalu `konversi.py` untuk folder yang berubah.
