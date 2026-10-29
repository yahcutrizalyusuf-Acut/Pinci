# Hitungan Uang

**Ringkas:** (1) Selama masa gratis (dihitung untuk ± 50 keluarga sebagai batas atas; target resmi sekarang 30), biaya bulanan **± Rp478 ribu di Desember–Januari** (hanya teknologi, sebab Acut memeriksa isi sendiri sampai R2) dan **± Rp1,44 juta di Februari–Mei** (teknologi + honor guru). Rata-rata ± Rp1,29 juta di rencana lama turun menjadi ± Rp1,1 juta. Pada 500 keluarga ± Rp1,44 juta, dan pada 1.000 keluarga ± Rp2,55 juta per bulan. Jadi biaya teknologi tidak menjadi alasan membatasi fitur. (2) Titik impas setelah berbayar (skenario Rp49 ribu per keluarga per bulan, diterima ± 77% setelah potongan Play dan PPN) adalah **39 keluarga membayar** pada skala 500 keluarga. Kalau langganan Claude Acut (dengan PPN) ikut ditutup, angkanya naik menjadi **87 keluarga**. (3) Harga final menunggu diskusi khusus berbayar. Tabel di sini menyiapkan tiga skenario harga (Rp39, 49, dan 59 ribu) supaya diskusi itu cepat.

Tahap 5, butir 4. Disusun 19 Oktober 2026. Kurs Rp16.500 per US$1. PPN layanan luar negeri dihitung 11% **[ASUMSI — tarif efektif, dicek konsultan pajak]**. Semua angka **[ESTIMASI]** dengan cara hitung tertulis. Diperbaiki 20 Okt setelah pemeriksaan akhir (jam guru, pembulatan titik impas, PPN langganan Claude, hak Perintis).

---

## 1. Dasar hitungan

| Hal | Angka | Sumber |
|---|---|---|
| Anak per keluarga | 1,5 | **[ASUMSI]** |
| Supabase Pro | US$25/bulan, termasuk kredit komputasi US$10 (ukuran terkecil); basis data 8 GB, lebih US$0,125/GB; komputasi ukuran kecil US$15, sedang US$60; lalu lintas keluar (egress) 250 GB | **[FAKTA — supabase.com/pricing; Makerkit]** |
| Expo EAS | Gratis sampai 1.000 pemakai aktif pembaruan; paket Starter (berbayar terkecil) US$19 untuk 3.000 | **[FAKTA — expo.dev/pricing]** |
| Rapor cerita | Haiku 5.5 ± Rp35, Sonnet 5.5 ± Rp715 per anak per bulan | `01-produk/riset-penguat.md` bagian 8 |
| Ringkasan mingguan | Rp0 (tugas terjadwal) sampai ± Rp16 ribu (Opus lewat API) | `02-rancangan/07` |
| Kode masuk email | Rp0 (Brevo gratis 300 email per hari) | `02-rancangan/02` |
| Halaman rapor dan panel | Rp0 (Cloudflare Pages) | `02-rancangan/01` |
| Nama domain | ± Rp200 ribu per tahun ≈ Rp17 ribu per bulan | **[ASUMSI]** |
| Honor guru pemeriksa | **Diubah 20 Okt:** Nov–Jan Rp0 (Acut memeriksa sendiri ± 39 jam); Feb–Mei ± 77 jam ≈ Rp3,9 juta (± Rp960 ribu per bulan); dibayar per butir (setara Rp50 ribu per jam); sesudahnya ± 10–15 jam per bulan | `01-produk/03` bagian 6.2a. **Ditambah 28 Okt:** guru Bahasa Inggris ± 18 jam ≈ Rp800 ribu sekali (Jan–Mar) + suara Bahasa Inggris ± Rp0–200 ribu sekali (`01-produk/11` bagian 4) |
| Potongan Google Play | 15% untuk langganan berulang; pengembang menerima ± 77% harga setelah PPN | **[FAKTA — Google Play]**; 77% dari catatan proyek Peta Belajar, dicek ulang |

---

## 2. Biaya bulanan per skenario

| Pos | 50 keluarga (75 anak) — masa gratis | 500 keluarga (750 anak) | 1.000 keluarga (1.500 anak) |
|---|---|---|---|
| Supabase | Rp412.500 (Pro, ukuran terkecil) | Rp495.000 (Pro + komputasi kecil) | Rp1.241.625 (Pro + komputasi sedang + ± 2 GB tambahan) |
| Expo | Rp0 | Rp313.500 (Starter) | Rp313.500 (Starter) |
| AI rapor cerita (Haiku) | Rp2.625 | Rp26.250 | Rp52.500 |
| Email, Cloudflare, ringkasan | Rp0 | Rp0 | Rp0 |
| Domain | Rp17.000 | Rp17.000 | Rp17.000 |
| PPN 11% layanan luar negeri | Rp45.664 | Rp91.823 | Rp176.839 |
| **Teknologi** | **± Rp478 ribu** | **± Rp944 ribu** | **± Rp1,80 juta** |
| Honor guru pemeriksa | Rp814.286 | Rp500.000 | Rp750.000 |
| **Jumlah (target)** | **± Rp1,29 juta** | **± Rp1,44 juta** | **± Rp2,55 juta** |
| **Cadangan** (Sonnet untuk rapor, Opus untuk ringkasan, guru 1,5×) | ± Rp1,77 juta | ± Rp2,28 juta | ± Rp4,08 juta |

**Cara hitung cadangan 50 keluarga:** Supabase Rp412.500 + Sonnet 75 × Rp715 = Rp53.625 + ringkasan Rp16.000 + PPN 11% dari ketiganya (Rp53.034) + domain Rp17.000 + guru 1,5 × Rp814.286 = Rp1.221.429 → ± Rp1.773.588.

**Tidak dihitung bulanan (sekali bayar):**

| Pos | Biaya | Catatan |
|---|---|---|
| AI menyusun isi tahun pertama | ± Rp330 ribu (Rp0 kalau lewat langganan Claude Acut) | `01-produk/03` 6.1 |
| Ahli hukum | Menunggu penawaran (diskusi khusus 3) | Tidak ada data publik; `paket-hukum/07` bagian 5 |
| Nomor D-U-N-S | Rp0 (jalur gratis, ± 30 hari) atau ± Rp3 juta (jalur cepat yang pernah dicoba Acut) | Diskusi khusus 2 |
| Pendaftaran PSE | Rp0 (tanpa PNBP) | **[FAKTA — izin.co.id]** |
| Akun Play Console | Sudah ada | — |

**Masa gratis Desember–Juni (7 bulan), setelah keputusan 20 Okt:** teknologi 7 × Rp478 ribu ≈ Rp3,35 juta + honor guru Feb–Mei Rp3,9 juta + Juni ± Rp625 ribu ≈ **Rp7,9 juta** (rencana lama Rp9,0 juta; cadangan dengan guru 1,5× dan model AI lebih mahal ± Rp11 juta), ditambah biaya sekali di atas. Tabel bagian 2 di atas masih memakai honor rata-rata rencana lama (Rp814 ribu per bulan) sebagai pembanding.

---

## 3. Waktu Acut

| Masa | Pekerjaan | Jam per minggu **[ESTIMASI]** |
|---|---|---|
| 19 Okt – 29 Nov (rancangan + pembangunan) | Mencoba purwarupa bersama anak, memutuskan, menyetujui isi, urusan hukum dan PSE | ± 10–13 |
| November – Januari (tambahan: memeriksa isi sendiri, `01-produk/03` 6.2a) | Jurus, pesan, sampel TKA, 50 teks Baca Ulang pertama | **+ ± 3** |
| Desember – Juni (masa gratis, target 30 keluarga) | Panel (± 2–2,5 jam), WhatsApp keluarga dan Perintis (± 1,5 jam), cek isi (sudah termasuk panel) | ± 4–5; **± 7–8 di minggu ajakan** (± 150 ajakan, balasan, Pesan D, pengingat putaran) |
| Setelah berbayar (± 500 keluarga) | Ditambah bantuan pelanggan | ± 8–10 **[ASUMSI]** |

Waktu Acut tidak dirupiahkan di tabel, sebab tidak dibayar tunai. Tetapi kalau bantuan pelanggan melewati 10 jam per minggu, itu tanda perlu orang kedua.

---

## 4. Tanda peringatan dini biaya

Fitur **tidak dibatasi karena biaya** (keputusan 19 Okt). Yang dipasang adalah peringatan, supaya kenaikan tak terduga ketahuan sebelum menjadi tagihan besar.

| Tanda | Waspada | Bertindak | Tindakan |
|---|---|---|---|
| Biaya teknologi masa gratis per bulan | > Rp600 ribu | > Rp800 ribu | Cari pos yang naik di panel Biaya |
| Belanja AI | > US$10 dalam sebulan | > US$50 (batas pengaman kesalahan program, bukan pembatasan biaya) | Periksa penyebab; Acut memutuskan apakah batas dinaikkan |
| Basis data | > 5 GB | > 7 GB | Rangkum tabel `kejadian` |
| Lalu lintas keluar (egress) | > 150 GB per bulan | > 220 GB | Periksa unduhan paket berulang |
| Pemakai aktif pembaruan Expo | > 900 | > 1.000 | Naik ke Starter (US$19), memang direncanakan |
| Email kode masuk | > 200 per hari | > 280 per hari | Periksa percobaan masuk mencurigakan; pindah ke paket email berbayar kalau wajar |

Batas anggaran bulanan masih **belum diputuskan Acut** (`pertanyaan-terbuka.md`). Usul: **Rp1,5 juta per bulan** selama masa gratis (di antara target Rp1,29 juta dan cadangan Rp1,77 juta). Kalau terlewati, Acut memutuskan pos mana yang diubah; fitur tidak dikurangi karena biaya (keputusan 19 Okt). Diputuskan bersama diskusi berbayar.

---

## 5. Setelah berbayar — skenario harga dan titik impas

**Status:** bentuk dan harga berbayar menunggu **diskusi khusus 1**. Tabel ini hanya bahan diskusi.

### 5.1 Uang diterima per keluarga

| Harga per keluarga per bulan | Diterima (± 77%) |
|---|---|
| Rp39.000 | Rp30.030 |
| Rp49.000 | Rp37.730 |
| Rp59.000 | Rp45.430 |

Pembanding: median harga langganan India dan Asia Tenggara ± Rp62 ribu per bulan **[FAKTA — RevenueCat 2026]**; Kumon ± Rp430–480 ribu per mapel per bulan; guru privat ± Rp54 ribu per jam.

### 5.2 Titik impas (keluarga membayar)

| Skala | Biaya bulanan | Rp39 ribu | Rp49 ribu | Rp59 ribu |
|---|---|---|---|---|
| 500 keluarga | Rp1,44 juta | 49 | **39** | 32 |
| 500 keluarga + langganan Claude Acut (± Rp1,65 juta + PPN 11% = Rp1,83 juta **[ASUMSI: Max 5×, US$100 per bulan — dicek di support.claude.com]**) | Rp3,28 juta | 110 | **87** | 73 |
| 1.000 keluarga | Rp2,55 juta | 85 | 68 | 57 |
| 1.000 keluarga + langganan Claude Acut | Rp4,38 juta | 146 | 117 | 97 |

### 5.3 Hasil bersih per bulan pada 500 keluarga aktif

| Persen yang membayar | Rp39 ribu | Rp49 ribu | Rp59 ribu |
|---|---|---|---|
| 10% (50 keluarga) | + Rp58 ribu | + Rp443 ribu | + Rp828 ribu |
| 20% (100 keluarga) | + Rp1,56 juta | + Rp2,33 juta | + Rp3,10 juta |
| 40% (200 keluarga) | + Rp4,56 juta | + Rp6,10 juta | + Rp7,64 juta |

(Pendapatan bersih dikurangi biaya bulanan Rp1,44 juta; belum dikurangi langganan Claude Acut dan pajak penghasilan.)

**Patokan persen membayar:** di India dan Asia Tenggara, 15,2% uji coba berlanjut membayar, dan hanya 0,7% pengunduh yang membayar dalam 35 hari **[FAKTA — RevenueCat 2026]**. Keluarga kita adalah pemakai aktif yang sudah merasakan manfaat, jadi **20% dipakai sebagai skenario tengah [ASUMSI]**. Pada skenario itu, langganan Claude Acut (tujuan Acut sejak awal) tertutup di harga Rp49 ribu kalau ada 87 keluarga membayar.

**Pendapatan yang dilepas karena hak peralihan** (usulan `01-produk/09` bagian 5, Rp49 ribu): Keluarga Perintis 10 × Rp49.000 = Rp490 ribu per bulan selama 3 bulan, lalu 10 × Rp24.500 = Rp245 ribu per bulan selama 12 bulan; keluarga masa gratis lain 40 × Rp12.250 = Rp490 ribu per bulan selama 6 bulan. Jadi 3 bulan pertama berbayar ± Rp980 ribu per bulan dilepas, bulan 4–6 ± Rp735 ribu, sesudahnya ± Rp245 ribu.

### 5.4 Yang ditunjukkan hitungan ini

| Temuan | Akibat |
|---|---|
| Biaya teknologi kecil dibanding pendapatan pada skala 500 | Harga bisa ditentukan dari nilai bagi orang tua dan pembanding pasar, bukan dari biaya |
| Dengan hanya ± 50 keluarga masa gratis, berbayar tidak menutup biaya (20% × 50 = 10 keluarga, ditambah hak peralihan yang dilepas) | Promosi setelah berbayar (rencana Acut) memang syarat; masa gratis adalah biaya belajar |
| Pos terbesar masa gratis adalah honor guru, bukan server | Kalau anggaran ketat, yang dibahas adalah sumber dana, bukan memotong: fitur dan isi tidak dikurangi karena biaya (keputusan B 19 Okt). Kalau Acut tetap memilih memperlambat isi baru, itu dicatat sebagai ganti arah di `keputusan.md` bagian C |
