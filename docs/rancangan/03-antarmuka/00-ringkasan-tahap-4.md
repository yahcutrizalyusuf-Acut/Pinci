# Ringkasan Tahap 4 — Antarmuka

**Ringkas:** (1) Antarmuka dirancang dalam 3 berkas: 55 layar dengan alurnya (65 setelah tambahan 28 Okt, termasuk Gudang Ilmu, Bimbingan Guru, dan Belajar Bahasa Inggris; 51 di aplikasi Rilis 1, termasuk layar TKA yang isinya terbuka 4 Januari; diperbaiki 20 Okt), kerangka 20 layar terpenting, dan aturan tampilan untuk anak 6–12 tahun di HP murah. (2) Empat keputusan desain paling berpengaruh: **waktu tidak ditampilkan berjalan saat lembar Lancar** (hanya rekor di akhir), **turun level tidak diumumkan**, **tombol anak jauh lebih besar dari batas umum Android**, dan **tema terang lembut sebagai bawaan**. Yang terakhir ini mengoreksi rancangan sebelumnya yang menyebut mode gelap untuk malam. (3) Langkah yang paling berguna berikutnya adalah menguji kerangka ini di tangan anak-anak Acut sendiri pada minggu pertama purwarupa, sebab semua ukuran huruf dan tombol masih asumsi.

Disusun 19 Oktober 2026 malam.

---

## 1. Isi Tahap 4

| Berkas | Isi | Keputusan desain terpenting |
|---|---|---|
| `01-daftar-layar-dan-alur.md` | 55 layar berkode (A, K, D, O) + 4 keadaan link rapor; 5 gambar alur | Anak ≤ 2 ketukan ke soal pertama; keluar dari mode anak hanya dengan PIN |
| `02-kerangka-layar.md` | Kerangka teks 20 layar: isi, tombol, aksi, suara | Waktu tidak tampak di tengah lembar; salah tanpa kata "salah"; tombol Setuju/Tidak sama besar di izin data |
| `03-aturan-tampilan.md` | Ukuran tombol, huruf, warna, suara, animasi, HP murah, daftar periksa | Tombol ≥ 64–72dp untuk kelas 1–2; huruf Andika; tanpa musik latar; tanpa animasi hiasan di layar soal |

## 2. Hal yang ditunda dari Tahap 2–3 dan sudah ditutup di sini

| Hal | Di mana |
|---|---|
| Mode Ramadan | `02-kerangka-layar.md` O10 |
| Tombol "level terasa tidak pas" (hak keberatan atas keputusan otomatis) | `02-kerangka-layar.md` O2 |
| Penjelasan privasi untuk anak (parameter DP06) | Layar K12 "Untuk kamu" |
| Paket Lancar bawaan di dalam aplikasi supaya tes pertama jalan tanpa sinyal | `02-kerangka-layar.md`, keadaan khusus |

## 3. Kenapa antarmuka ini bisa gagal — dan penjaganya

| Cara gagal | Tanda awal | Penjaga |
|---|---|---|
| Anak kelas 1–2 tidak bisa mulai sendiri | Anak menunggu dibacakan di uji pertama | Semua petunjuk bersuara; uji dengan anak kelas 1–2 sebelum keluarga lain |
| Tanpa jam berjalan, anak tidak merasa ditantang | Ketukan "gajah mengantuk" (bosan) tinggi di minggu 1–2 | Pilihan "tampilkan waktu" di Pengaturan bisa ditambah tanpa rilis besar **[ASUMSI]** |
| Ukuran huruf dan tombol terlalu besar sehingga soal panjang tidak muat (TKA) | Teks soal terpotong | Ukuran per kelas; teks TKA 18sp dengan gulir |
| Orang tua tidak menemukan pertanyaan masukan | Tanggapan < 45% | Kartu di beranda + di bawah link rapor |
| HP sangat murah tersendat | Pindah layar > 1 detik di HP 2 GB | Tanpa animasi hiasan, tanpa video, gambar dikompresi |

## 4. Keputusan Acut

> **19 Okt malam: keempat keputusan disetujui Acut** (`keputusan.md` B5).

| # | Keputusan | Usul Acut2 | Di berkas |
|---|---|---|---|
| 1 | Saat lembar Lancar, waktu **tidak** ditampilkan berjalan; hanya batang kemajuan dan rekor di akhir | Setuju, sebab anak bersaing dengan rekornya sendiri tanpa tekanan jam | `02` K6 |
| 2 | Turun level tidak diumumkan ke anak | Setuju | `02` K7 |
| 3 | Tema terang lembut sebagai bawaan, mode gelap pilihan (koreksi dari "mode gelap untuk malam") | Setuju, sebab buktinya | `03` bagian 3 |
| 4 | Mode Ramadan (lembar 10 soal, target mingguan diturunkan, pengingat digeser) | Setuju, diuji Februari 2027 | `02` O10 |

## 5. Tindak lanjut

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| ~~Menjawab 4 keputusan Tahap 4~~ | Acut | **Selesai 19 Okt** | `keputusan.md` B5 |
| Memulai Tahap 5 (uji, rilis, uang) | Acut2 | Setelah Tahap 4 disetujui | Berkas di `rancangan/05-uji/` dan `06-rilis/` |
| Uji kerangka di tangan anak kelas 4 dan kelas 6 Acut | Acut | Minggu pertama purwarupa (± 3 Nov) | Catatan + video layar |
