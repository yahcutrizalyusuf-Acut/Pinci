# Pembayaran (Disiapkan, Belum Dibangun)

**Ringkas:** (1) Selama masa gratis, pembayaran **tidak dibangun**. Yang disiapkan hanya tabel hak akses dan saklar fitur, supaya saat berbayar dibuka tidak ada perombakan. (2) Jalur utama nanti adalah **langganan Google Play** (potongan 15% untuk langganan berulang). Jalur kedua adalah **QRIS lewat halaman web** untuk orang tua (biaya ± 0,7%), kalau aturan Google Play di Indonesia mengizinkan. Mahkamah Agung sudah menguatkan putusan KPPU (Maret 2026) yang mewajibkan Google membuka pembayaran alternatif, tetapi pelaksanaannya belum terkonfirmasi. (3) Harga, bentuk, dan waktu berbayar menunggu **diskusi khusus** (keputusan Acut 19 Okt). Pajak dan badan usaha penerima uang masuk daftar pertanyaan ahli hukum dan konsultan pajak.

Tahap 3, butir 8. Disusun 19 Oktober 2026.

---

## 1. Jalur pembayaran

| Jalur | Potongan | Untung | Rugi | Status |
|---|---|---|---|---|
| **Langganan Google Play** | 15% untuk langganan berulang, berapa pun pendapatan pengembang **[FAKTA — halaman biaya layanan Google Play]** | Orang tua membayar dengan pulsa, e-wallet, atau kartu yang sudah tersambung ke Play; perpanjangan dan pembatalan diurus Google | Potongan 15%; pengembang menerima ± 77% setelah PPN **[catatan proyek Peta Belajar, dicek ulang]** | Jalur utama |
| **QRIS lewat halaman web** (gerbang pembayaran) | MDR 0,7% per transaksi untuk pedagang reguler **[FAKTA — Midtrans]** | Potongan jauh lebih kecil; akrab bagi orang tua | Perpanjangan bulanan harus dibayar manual (QRIS bukan tagihan otomatis); aturan Google soal menautkan pembayaran luar dari aplikasi harus dipatuhi | Bergantung aturan Play di Indonesia |
| Pembayaran alternatif di dalam aplikasi (User Choice Billing) | Di Korea Selatan dan India: 4% lebih rendah dari tarif Play **[FAKTA — halaman biaya Google Play]** | Pilihan bagi orang tua | Belum jelas di Indonesia | Dipantau |

**Status Indonesia:** Mahkamah Agung menolak permohonan Google (berita 17 Mar 2026). Kewajiban Google: menghapus kewajiban Google Play Billing, membuka pembayaran alternatif, menurunkan biaya layanan, dan mengumumkannya ke pengembang. Pelaksanaannya belum dilaporkan per tanggal berita itu **[FAKTA — InvestorTrust, 17 Mar 2026]**. **Dicek ulang di Play Console saat diskusi khusus berbayar.**

---

## 2. Yang disiapkan sekarang (masa gratis)

| Bagian | Isi | Biaya bangun **[ESTIMASI]** |
|---|---|---|
| Tabel `langganan` | `keluarga_id`, `sumber` (play · qris · perintis · uji), `status` (aktif · masa tenggang · berhenti), `berlaku_sampai`, `potongan` | ± 0,5 hari |
| Saklar fitur | Setiap fitur berbayar dibungkus satu pemeriksaan "apakah keluarga ini punya hak?"; selama masa gratis semua keluarga punya hak | ± 0,5 hari |
| Catatan hak Perintis | `keluarga.perintis` + tanggal mulai, dipakai saat peralihan | Sudah ada di basis data |

**Kenapa disiapkan sekarang:** kalau saklar baru ditambahkan saat berbayar, setiap layar harus disentuh ulang dan risiko salah mengunci latihan anak lebih besar.

---

## 3. Aturan yang sudah pasti, apa pun harganya

| Aturan | Sebab |
|---|---|
| Pembayaran **hanya di mode orang tua**, tidak pernah di mode anak | Anak tidak boleh menjadi sasaran penjualan (dimensi risiko eksploitasi konsumen, Permenkomdigi 9/2026) |
| Hak akses diperiksa **di server** (bukti pembelian Play diverifikasi lewat layanan Google), lalu disalin ke HP untuk dipakai tanpa sinyal | Mencegah hak palsu; anak tetap bisa latihan tanpa sinyal |
| Masa tenggang 7 hari setelah gagal bayar **[ASUMSI]** | Kartu atau pulsa gagal bukan alasan anak berhenti mendadak |
| Bagian gratis tidak pernah terkunci, apa pun status langganan | Keputusan bentuk berbayar menunggu diskusi khusus, tetapi riwayat anak tidak pernah dihapus (`01-produk/09` bagian 5) |
| Harga ditulis lengkap, bulanan, bisa berhenti dari aplikasi | Keluhan utama pada pesaing (`riset-pasar-dan-pesaing.md`) |

---

## 4. Pajak dan badan usaha — pertanyaan, bukan jawaban

| Pertanyaan | Kenapa penting | Untuk |
|---|---|---|
| Lewat Google Play, siapa yang memungut PPN dan apa kewajiban penerbit? | Menentukan harga bersih | Konsultan pajak |
| Lewat QRIS langsung, kapan badan usaha wajib menjadi PKP, dan tarif PPh yang berlaku (misal tarif UMKM) | Arus kas dan harga | Konsultan pajak |
| Uang masuk ke rekening badan usaha mana, dan apakah nama penerbit di Play harus sama | Kebijakan privasi, PSE, dan pembayaran memakai satu nama | Ahli hukum |
| Hak Keluarga Perintis (potongan terkunci) | Janji yang mengikat di syarat dan ketentuan | Ahli hukum |

Pembangunan pembayaran (± 4–6 hari kerja termasuk uji **[ESTIMASI]**) dijadwalkan setelah diskusi khusus dan sebelum tanggal berbayar yang diputuskan.
