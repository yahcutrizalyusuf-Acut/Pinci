# Daftar Fitur per Rilis

**Ringkas:** (1) Target tayang dipecah menjadi lima rilis kecil yang masing-masing sudah berguna, dimulai dari **Rilis 1 (tayang ± 22 Desember 2026)**: akun keluarga, Lancar Matematika kelas 1–6, tiga cara orang tua terlibat, sistem masukan, tahan putus sinyal, dan **mesin soal TKA**. (2) **Isi Persiapan TKA masuk sebagai paket isi pada 4 Januari 2027 (Rilis 1.1) tanpa rilis aplikasi baru**, sebab kelas luring mulai saat semester genap dan TKA kemungkinan April. (3) Jadwal ini ketat: kalau terlambat, yang dipotong lebih dulu adalah fitur berlabel Penting, dan kelas luring TKA tetap aman karena lembar latihan rumah PDF sudah ada.

Tahap 2, butir 3. Disusun 19 Oktober 2026. Prioritas: **W** = Wajib (tanpa ini rilis tidak berguna atau melanggar aturan) · **P** = Penting (dipotong kalau terlambat) · **N** = Nanti.

---

## 1. Peta rilis

| Rilis | Tayang (target · cadangan) | Inti | Kenapa urutannya begini |
|---|---|---|---|
| **R1 — Lancar dan Keluarga** | 22 Des 2026 · 31 Des 2026 | Akun keluarga, Lancar Matematika kelas 1–6, tiga cara orang tua, masukan v1, tahan putus sinyal, persetujuan data, mesin soal TKA; **(29 Okt)** Pinci menyapa dengan nama (suara nama dibuat sekali di server) | Metode LANCAR sudah jadi dan teruji (8.100 lembar, 0 kunci salah); keluarga uji butuh sesuatu yang berguna sejak hari pertama |
| **R1.1 — Paket Siap TKA** (paket isi, bukan rilis aplikasi) | 4 Jan 2027 · 11 Jan 2027 | 36 latihan rumah digital, 5 simulasi bertempo, **mini try out mingguan 15 menit** dan **"Rencana minggu ini"** untuk orang tua (29 Okt), rapor kesiapan TKA, **kartu Gudang Ilmu Matematika kelas 6** (ditambah 28 Okt) | Kelas luring mulai semester genap (4 Jan); TKA 2026 berlangsung akhir April **[FAKTA — Rumah Pendidikan]** |
| **R2 — Bahasa Indonesia harian** | 1 Feb 2027 · 22 Feb 2027 | Baca berulang harian kelas 1–6, Mode Dampingi "dengar bacaan", masukan v2, **kartu Gudang Ilmu Bahasa Indonesia kelas 6**, **paket Belajar Bahasa Inggris tingkat 3–4** (tingkat 5–6 menyusul 22 Mar; tanpa AI suara; ditambah 28 Okt) | Butuh teks baru untuk kelas 1–5; Ramadan mulai ± 8 Feb, jadi lebih baik tayang sebelumnya |
| **R3 — Paham Matematika** | 22 Mar 2027 · 5 Apr 2027 | Modul Paham kelas 4–6 (topik yang dipakai TKA dulu) sekaligus kartu Gudang Ilmu Matematika kelas 4–5, Bahasa Inggris tingkat 5–6, **Bimbingan Guru dengan persetujuan orang tua** (guru sekolah: lihat + komentar; guru les: tugas + catatan; ditambah 28 Okt), papan angka dan game lapangan akhir pekan | Setelah libur Idulfitri (8–19 Mar); butuh pemeriksaan guru |
| **R4 — Dunia dan naik kelas** | 14 Jun 2027 · 5 Jul 2027 | Gampong yang tumbuh, game di luar jam belajar ("waktu main" setelah inti harian, 20–30 menit, maks. 60), kartu Gudang Ilmu Matematika kelas 1–3, modul Bahasa Indonesia, paket kelas baru otomatis, rapor setahun | Harus siap sebelum tahun ajaran baru (± 12 Juli 2027) |
| **R5 — Bahasa Inggris bersuara AI** | Agustus 2027 (kalau uji suara lulus) | Ngobrol dengan AI, koreksi lembut, rapor ucapan dalam Bahasa Indonesia. Paket Belajar Bahasa Inggris tanpa AI sudah ada sejak R2 (`11-belajar-bahasa-inggris.md`) | Bahasa Inggris wajib mulai kelas 3 SD tahun ajaran 2027/2028; uji suara 5 anak dulu (Januari–Februari) |

**Gerbang berbayar** paling cepat dievaluasi ± 26 April 2027 (12 minggu setelah gelombang 3); rinciannya di `09-gerbang-berbayar.md` (usulan, menunggu diskusi berbayar).

---

## 2. Rilis 1 — Lancar dan Keluarga

### 2.1 Fitur

| Bagian | Fitur | Prioritas |
|---|---|---|
| **Akun dan privasi** | Daftar orang tua (email + kode; nomor WhatsApp opsional untuk kabar) | W |
| | Persetujuan orang tua terpisah per tujuan (latihan, data pemakaian, masukan, rapor buatan AI) + kebijakan privasi | W |
| | Profil anak (nama panggilan, bulan dan tahun lahir, kelas, hewan profil), beberapa anak per keluarga | W |
| | Pilih profil di HP bersama + PIN anak opsional; PIN orang tua untuk Mode Dampingi | W |
| | Hubungkan HP kedua lewat kode keluarga | W |
| | Hapus akun dan unduh data (hak subjek data) | W |
| **Lancar Matematika** | Mesin LANCAR versi aplikasi: tes penempatan, layar jurus, 6 level per kelas, campur 70/30, soal salah diulang, uji daya tahan 3 minggu | W |
| | Perbaikan dari Tahap 1: lambang bagi ":", level kelas 6 L2–L3 diganti | W |
| | Suara untuk semua petunjuk dan layar jurus kelas 1–2 | W |
| | Peta jenis salah sederhana untuk rapor | P |
| | Jurus Sulap Angka (kejutan setelah lulus kelas) | N (R3) |
| **Mesin soal TKA** | Tampilan dan penilaian PG, PG kompleks, PG kategori; soal bergrup dengan bacaan; mode bertempo 75 menit dengan jeda; **layar rapor TKA (O4) dan pengawas simulasi (D7)** — semua layar TKA harus ada di aplikasi R1, sebab R1.1 hanya paket isi (diperjelas 20 Okt, `03-antarmuka/01` bagian 7) | W |
| **Orang tua [D]** | Mode Dampingi: jurus + kunci terlihat, naskah petunjuk, Tantang Ayah | W |
| **Orang tua [J]** | Beranda kabar, rapor mingguan, kirim semangat (pilihan pesan siap pakai), lihat latihan sedang berlangsung | W |
| | Memberi tugas (misal "1 lembar tambahan hari Sabtu") | P |
| **Orang tua [L]** | Halaman rapor lewat link WhatsApp, tanpa instal, link bisa dicabut | W |
| **Anak** | Kartu satwa Aceh sebagai kejutan, pilihan 2–4 jalur, rekor pribadi | P |
| | Pesan dari orang tua tampil di beranda anak | W |
| **Masukan v1** | Pertanyaan pilihan untuk orang tua sesuai jadwal 8 minggu; satu ketukan anak; data pemakaian (dengan izin) | W |
| | Pesan "Kami dengar, kami ubah" tiap 2 minggu | W |
| **Gudang Ilmu** (ditambah 28 Okt) | Peta topik lengkap semua mapel SD kelas anak, topik yang belum siap bertanda "segera" (`01-produk/10` bagian 2) | W |
| **Tanda bimbingan** (ditambah 28 Okt) | Tiga tingkat per topik: mandiri · perlu bimbingan orang tua · perlu bimbingan guru, dengan kabar ke orang tua dan ringkasan untuk guru (`01-produk/10` bagian 3) | W |
| **Waktu belajar** (ditambah 28 Okt) | Batas belajar per hari 10 menit × kelas, blok ≤ 15 menit dengan jeda, inti harian singkat (`01-produk/10` bagian 5) | W |
| **Tahan putus sinyal** | Semua latihan jalan tanpa sinyal; hasil antre di HP; tanda "belum terkirim" yang jelas; kirim ulang otomatis tanpa ganda | W |
| **Pengelola (Acut)** | Panel di HP: ringkasan pemakaian, jawaban masukan, ubah jadwal pertanyaan, pasang paket isi | W |
| **Aturan** | Penilaian mandiri PP Tunas dan penilaian dampak selesai **sebelum** keluarga uji memakai | W |

### 2.2 Yang sengaja tidak ada di Rilis 1

| Tidak ada | Sebab |
|---|---|
| Jalur buku + foto | Keputusan Acut 19 Okt: layar dulu |
| Bahasa Indonesia | Teks kelas 1–5 belum ada |
| Modul Paham | Butuh pemeriksaan guru |
| Game di luar jam belajar, Gampong penuh | Paling mahal dibangun; buktinya untuk hasil belajar lemah; risiko dianggap teknik dorongan |
| Obrolan bebas | Menaikkan profil risiko PP Tunas; pesan orang tua–anak berupa pilihan siap pakai + teks pendek dari orang tua |
| Pembayaran | Masa gratis |

---

## 3. Di mana Persiapan TKA masuk, dan kenapa

| Pilihan | Untung | Rugi | Putusan |
|---|---|---|---|
| TKA penuh di R1 | Satu kali rilis | Menambah beban 5 minggu pembangunan yang sudah ketat | ✗ |
| **Mesin soal TKA di R1, isi di R1.1 (4 Jan) sebagai paket isi** | Kelas luring dan isi TKA tidak menunggu rilis aplikasi; isi bisa diperbaiki tanpa uji ulang Play Store | Mesin soal TKA harus jadi di R1 walau belum dipakai | **✓ Diusulkan**, sebab paket isi per kelas memang sudah diputuskan bisa diperbarui tanpa rilis baru |
| TKA di R3 (Maret) | Lebih longgar | Terlalu dekat dengan TKA April; tidak mendampingi kelas luring sejak awal | ✗ |

**Cadangan kalau R1 terlambat:** kelas luring tetap jalan dengan lembar latihan rumah PDF yang sudah ada (29 lembar, `06-siap-pakai/lembar-kerja-anak/`). Aplikasi menyusul tanpa mengganggu kelas.

---

## 4. Rilis 2–5 — ringkas

| Rilis | Fitur W | Fitur P | Fitur N |
|---|---|---|---|
| **R2** | Baca berulang harian kelas 1–6 (bacaan bersuara untuk kelas 1–2); kata per menit; 2 pertanyaan pemahaman; Mode Dampingi "dengar bacaan"; **Belajar Bahasa Inggris tingkat 3–4** (kosakata bersuara, pola kalimat, dengar lalu pilih, permainan kata); **(29 Okt)** Peta Perjalanan untuk orang tua; Cerita Ulang dan Ucapkan ke Bunda di Mode Dampingi; Hari Pamer bulanan | Peta kata sulit; masukan v2 (pertanyaan dipicu kejadian) | Rekaman Dengar Bedanya (butuh izin khusus) |
| **R3** | Modul Paham kelas 4–6 untuk topik TKA (pecahan, KPK/FPB, pengukuran, data); model batang | Papan angka dan ular tangga cetak; survei game lapangan akhir pekan | Jurus Sulap Angka |
| **R4** | Paket kelas baru otomatis; rapor setahun; modul Bahasa Indonesia kelas 3–6 | Gampong yang tumbuh; game di luar jam belajar dengan batas waktu | ~~Hari Pamer bersuara~~ (dimajukan ke R2, 29 Okt) |
| **R5** | Ngobrol Bahasa Inggris dengan AI (topik terkunci), rapor ucapan dalam Bahasa Indonesia | Perintah gerak Bahasa Inggris | — |

---

## 5. Aturan memotong kalau terlambat

1. **Yang tidak pernah dipotong:** persetujuan data dan penilaian mandiri, tahan putus sinyal, mesin LANCAR, akun keluarga, sistem masukan, mesin soal TKA. Sebab tanpa itu rilis melanggar aturan, kehilangan data seperti 17–18 Oktober, atau tidak menghasilkan masukan.
2. **Dipotong lebih dulu:** fitur P (kartu satwa, memberi tugas, peta jenis salah) → pindah ke rilis berikutnya.
3. **Tanggal tayang R1 boleh mundur sampai 31 Desember**; lebih dari itu, keluarga uji mulai bertahap mulai 4 Januari dengan keluarga yang sudah siap.

**[ASUMSI — dihitung di Tahap 5]** Jadwal R1 hanya mungkin kalau rancangan Tahap 3–5 selesai paling lambat akhir Oktober dan pembangunan berjalan ± 5 minggu (27 Okt–27 Nov), lalu uji tertutup sejak unggah Selasa 24 Nov (`06-rilis/04`).
