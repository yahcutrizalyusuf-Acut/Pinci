# Draf Kertas Kerja Penilaian Mandiri Profil Risiko

**Ringkas:** (1) Draf kertas kerja menurut Kepmenkomdigi 142/2026 untuk aplikasi Pintar Main. Aplikasi ini memenuhi indikator "layanan yang dapat diakses anak", sebab memang ditujukan untuk anak. (2) Untuk aspek a–d, yang parameternya terbaca dari teks resmi, **semua parameter berstatus "tidak ditemukan"**, masing-masing dengan konfigurasi teknis dan bukti. Perkiraan bobot ditemukan 0%, jauh di bawah batas 50%. (3) Aspek e–g (adiksi, gangguan psikologis, gangguan fisiologis) **belum bisa diisi per parameter**, sebab teksnya belum terbaca. Yang ada baru daftar mitigasi kami, dan bagian ini wajib dilengkapi dari lampiran resmi sebelum pengajuan. **Draf, belum diperiksa ahli hukum.**

Disusun 19 Oktober 2026. Bobot dari teks Kepmenkomdigi 142/2026 Lampiran II yang terbaca lewat JDIH Komdigi; sebagian baris terbaca tidak konsisten (DP03, DP04, DP06, KN06, EK03) dan **wajib dicocokkan dengan dokumen resmi**.

---

## A. Identitas

| Hal | Isi |
|---|---|
| PSE | [NAMA PENGENDALI — diputuskan Jumat 6 Nov], NIB [ … — diurus Senin 9 Nov lewat OSS], TDPSE [ … — atau **nomor permohonan** kalau tanda daftar belum terbit pada 13 Nov; nomor TDPSE dikirim menyusul saat klarifikasi] |
| Produk, layanan, fitur (PLF) | Aplikasi Android "Pintar Main" + halaman rapor web |
| Narahubung | Acut — [jabatan] — [email] — [WhatsApp] |
| Tim penilai | Acut (produk, kebijakan), Acut2 (teknis, perlindungan data, dibantu AI), [ahli hukum] |
| Tanggal penilaian | [ … ] |

## B. Identifikasi indikator layanan yang dapat diakses anak

| Indikator (Lampiran I) | Terpenuhi? | Bukti |
|---|---|---|
| 1. Syarat atau dokumen yang menunjukkan layanan ditujukan untuk anak | **Ya** | Kebijakan privasi bagian 2; deskripsi Play Store |
| 2. ≥ 25 pengguna anak secara rutin | Akan terpenuhi pada masa uji (± 50 anak) | — |
| 3. Penargetan iklan kepada anak | Tidak | Tanpa iklan |
| 4. Desain visual dan interaksi menarik bagi anak | Ya | Kartu satwa, hewan profil, warna cerah |
| 5. Fungsi serupa produk yang dipakai anak | Ya | Aplikasi belajar anak |

**Kesimpulan:** layanan dapat diakses anak → wajib penilaian mandiri.

---

## C. Aspek a — Berkontak dengan orang tidak dikenal

| Kode | Parameter (ringkas) | Bobot % | Status | Konfigurasi teknis | Bukti |
|---|---|---|---|---|---|
| KK01 | Rekomendasi akun anak ke pengguna lain atau sebaliknya | 20,22 | **Tidak ditemukan** | Tidak ada fitur rekomendasi akun; akun hanya terlihat di dalam keluarga | Spesifikasi `01-produk/07` bagian 3.5 |
| KK02 | Pengguna luar menemukan dan memulai kontak lewat mesin pencari eksternal | 19,66 | Tidak ditemukan | Tidak ada halaman profil publik | Rancangan basis data, aturan akses per keluarga |
| KK03 | Pesan langsung oleh akun tidak terhubung | 14,04 | Tidak ditemukan | Pesan hanya antaranggota satu keluarga; anak hanya mengirim stiker pilihan. Orang tua kedua hanya bisa bergabung lewat undangan yang diikat ke email tujuan, dengan batas percobaan, dan **wajib disetujui pemilik** sebelum melihat atau mengirim apa pun (ditambah 20 Okt) | `01-produk/07` 2.3; `02-rancangan/02` bagian 7a |
| KK04 | Pencarian internal menampilkan konten anak ke pengguna tidak terhubung | 13,48 | Tidak ditemukan | Tidak ada pencarian pengguna atau konten | — |
| KK05 | Konten anak terindeks mesin pencari eksternal | 10,11 | Tidak ditemukan | Halaman rapor diberi tanda "jangan diindeks", berisi token rahasia, bisa dicabut | `01-produk/07` 2.4 |
| KK06 | Pencarian internal menampilkan akun anak | 8,99 | Tidak ditemukan | Tidak ada pencarian akun | — |
| KK07 | Grup, forum, ruang yang menghubungkan anak dengan orang asing | 5,62 | Tidak ditemukan | Tidak ada grup atau forum | — |
| KK08 | Pengirim bisa menghapus/mengubah pesan yang sudah diterima anak | 5,06 | Tidak ditemukan | Pesan tidak bisa diubah setelah terkirim **[keputusan teknis — dikunci di Tahap 3]** | — |
| KK09 | Akun anak terindeks mesin pencari | 2,81 | Tidak ditemukan | Anak tidak punya akun publik | — |
| | **Jumlah ditemukan** | | **0%** | | |

## D. Aspek b — Paparan konten tidak sesuai usia

| Kode | Parameter | Bobot % | Status | Konfigurasi teknis | Bukti |
|---|---|---|---|---|---|
| KN01 | Rekomendasi atau distribusi otomatis yang menampilkan konten tidak sesuai | 26,12 | Tidak ditemukan | Semua isi dibuat dan diperiksa kami (guru 100% untuk teks); tidak ada isi dari pengguna lain | `01-produk/03` bagian 4 |
| KN02 | Forum/kegiatan tanpa penyaringan usia | 18,66 | Tidak ditemukan | Tidak ada forum | — |
| KN03 | Rekomendasi konten berbasis profil atau perilaku anak | 17,91 | **Perlu dijelaskan** | Mesin menyesuaikan **tingkat soal** dari jawaban anak (naik/turun level). Ini penyesuaian belajar, bukan rekomendasi konten; semua isi dari bank yang sama yang sudah diperiksa. Pilihan isi berikutnya dari ketukan anak ("Besok mau lebih banyak apa?") adalah **fungsi layanan atas permintaan anak saat itu**: tidak ada ciri anak yang disimpan untuk tujuan lain | `01-produk/04-mesin-lancar.md` — **pertanyaan untuk ahli hukum** |
| KN04 | Pesan langsung yang bisa mengirim konten tidak sesuai | 14,93 | Tidak ditemukan | Anak hanya stiker; teks orang tua ≤ 60 huruf tanpa link | `01-produk/07` 2.3 |
| KN05 | Interaksi terbuka (komentar) tanpa penyaringan | 11,19 | Tidak ditemukan | Tidak ada kolom komentar | — |
| KN06 | Fitur blokir dan pelaporan | 7,46 | **Dipenuhi sebagai mitigasi** | Tombol "laporkan soal ini" di Mode Dampingi; orang tua mengatur semua fitur sosial | — |
| KN07 | Iklan bermuatan tidak sesuai usia | 3,73 | Tidak ditemukan | Tanpa iklan | Manifes tanpa pustaka iklan (SDK iklan) |
| | **Jumlah ditemukan** | | **0% (17,91% kalau KN03 dianggap ditemukan)** | | |

## E. Aspek c — Eksploitasi anak sebagai konsumen

| Kode | Parameter | Bobot % | Status | Konfigurasi teknis | Bukti |
|---|---|---|---|---|---|
| EK01 | Pihak lain menawarkan barang/jasa kepada anak | 21,43 | Tidak ditemukan | Tanpa toko, iklan, atau penjual | — |
| EK02 | Pemrofilan anak untuk iklan, harga, penjualan | 19,05 | Tidak ditemukan | Data dipakai hanya untuk latihan dan rapor; catatan pemakaian hanya dalam jumlah | `02-rancangan/10` bagian 3 |
| EK03 | [Redaksi perlu dicek di dokumen asli] | 16,67 | [ … ] | | |
| EK04 | Desain yang mendorong anak membeli, berlangganan, membagikan data | 14,29 | Tidak ditemukan | Anak tidak pernah diberi tahu soal uang | `01-produk/07` bagian 1 |
| EK05 | Pembayaran oleh anak tanpa verifikasi orang tua | 11,90 | Tidak ditemukan | Pembayaran hanya di mode orang tua dengan PIN | `02-rancangan/08` bagian 3 |
| EK06 | Perpanjangan langganan otomatis tanpa persetujuan orang tua | 9,52 | Tidak ditemukan (masa gratis) | Saat berbayar: langganan dibuat dan disetujui orang tua di mode orang tua; **dinilai ulang saat berbayar** | — |
| EK07 | Anak dilibatkan dalam kegiatan yang menguntungkan PSE atau pihak ketiga | 7,14 | **Perlu dijelaskan** | Ketukan masukan anak (sukarela, dengan izin orang tua, tanpa hadiah) dipakai untuk memperbaiki aplikasi | **Pertanyaan untuk ahli hukum** |
| | **Jumlah ditemukan** | | **0% (7,14% kalau EK07 dianggap ditemukan)** | | |

## F. Aspek d — Keamanan data pribadi anak

| Kode | Parameter | Bobot % | Status | Konfigurasi teknis | Bukti |
|---|---|---|---|---|---|
| DP01 | Anak bisa mengubah pengaturan privasi tanpa persetujuan orang tua | 29,66 | Tidak ditemukan | Semua pengaturan dan izin hanya di mode orang tua, dikunci PIN | `02-rancangan/02` bagian 5 |
| DP02 | Bawaan menampilkan data anak ke publik | 25,42 | Tidak ditemukan | Tidak ada tampilan publik; link rapor hanya dibuat orang tua | — |
| DP03 | Keamanan tidak sesuai sifat data anak | 12,71 | Tidak ditemukan | Enkripsi perjalanan, akses per keluarga, PIN teracak, kunci di server | `02-rancangan/11` bagian 4 |
| DP04 | Kepatuhan UU PDP termasuk penilaian dampak | 12,71 | Tidak ditemukan (dipenuhi) | Penilaian dampak disusun | `paket-hukum/05-penilaian-dampak.md` |
| DP05 | Pemrosesan data anak tanpa pengawasan orang tua | 8,47 | Tidak ditemukan | Anak tanpa akun; semua data di bawah akun orang tua dengan izin per tujuan | `paket-hukum/01` |
| DP06 | Pemberitahuan privasi yang mudah dipahami anak dan orang tua | 6,78 | Tidak ditemukan (dipenuhi) | Kebijakan privasi bahasa sehari-hari + bagian "Untuk kamu" | `paket-hukum/02` bagian 12 |
| | **Jumlah ditemukan** | | **0%** (teks terbaca berjumlah 95,75%; parameter sisa dicek) | | |

## G. Aspek e–g — Adiksi, gangguan psikologis, gangguan fisiologis

**Parameter resmi belum terbaca, jadi ketiga aspek ini berstatus "belum dinilai"**, bukan "rendah" (diperbaiki 20 Okt). Batas antara profil rendah dan sedang juga belum diketahui; yang terbaca baru "satu aspek > 50% = profil tinggi". Keduanya dicari di lampiran Kepmen 142 (tindak lanjut 26 Okt). Mitigasi yang sudah ada di rancangan, untuk dipetakan ke parameter resmi:

| Mitigasi | Untuk aspek | Bukti |
|---|---|---|
| Tanpa rangkaian hari beruntun, tanpa ancaman kehilangan (Gampong tidak pernah layu) | Adiksi | `01-produk/07` 3.3, 3.5 |
| Tanpa notifikasi ke anak; semua pengingat ke orang tua | Adiksi | `01-produk/07` 2.3 |
| Batas waktu game harian (10/15 menit, diatur orang tua), jam tenang, tanpa "satu babak lagi" | Adiksi, fisiologis | `01-produk/07` 3.4 |
| Hadiah sebagai kejutan, tanpa kelangkaan acak dan tanpa beli | Adiksi | `01-produk/07` 3.2 |
| Sesi latihan ≤ 10/15/20 menit menurut kelompok umur | Fisiologis | `01-produk/01` 1.2 |
| **Pengecualian beralasan:** simulasi TKA 75 menit — meniru ujian sebenarnya, paling banyak 5 kali setahun, hanya kelas 6, dimulai atas pilihan orang tua, dianjurkan Sabtu pagi | Fisiologis | `01-produk/06` bagian 6 |
| Tema terang lembut bawaan, mode gelap pilihan, jam tenang | Fisiologis | `03-antarmuka/03` bagian 3 |
| Tanpa papan peringkat atau perbandingan antaranak; rekor pribadi saja | Psikologis | `01-produk/07` 3.5 |
| Rapor tanpa label negatif (daftar kata terlarang) | Psikologis | `02-rancangan/07` bagian 2 |
| Penjaga "terlalu rumit": turun level, jurus ulang, saran Mode Dampingi | Psikologis | `01-produk/04` bagian 5 |

---

## H. Ringkasan dan klasifikasi

| Aspek | Bobot ditemukan **[ESTIMASI]** | Tingkat |
|---|---|---|
| a. Kontak orang tak dikenal | 0% | Rendah |
| b. Paparan konten | 0–17,91% | Rendah |
| c. Eksploitasi konsumen | 0–7,14% | Rendah |
| d. Data pribadi | 0% | Rendah |
| e–g | Belum dinilai | Belum dinilai |
| **Profil yang dituju** | | **Rendah** — dengan catatan: batas rendah/sedang belum diketahui, jadi KN03 17,91% belum pasti "rendah" |

## I. Yang harus dilakukan sebelum diajukan

| Apa | Siapa | Kapan | Bukti selesai |
|---|---|---|---|
| Unduh Kepmenkomdigi 142/2026 lengkap dengan lampiran dari JDIH Komdigi | Acut | 26 Okt | Berkas PDF di percakapan |
| Lengkapi aspek e–g dan cocokkan bobot DP03, DP04, DP06, KN06, EK03 | Acut2 | 2 Nov | Kertas kerja v0.2 |
| Siapkan bukti per parameter (tangkapan layar purwarupa, potongan spesifikasi). Layar izin data, PIN, dan hapus akun dibangun minggu 2–3 supaya bisa difoto | Acut2 | Selasa 10 Nov | Folder bukti |
| Cari tahu alamat sistem elektronik pengajuan | Acut | 6 Nov | Tautan dan akun |
| Ajukan | Acut (narahubung) | Jumat 13 Nov | Tanda bukti penerimaan |
