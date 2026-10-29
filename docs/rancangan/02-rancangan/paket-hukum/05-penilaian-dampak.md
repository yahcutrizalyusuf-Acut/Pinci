# Draf Penilaian Dampak Pelindungan Data Pribadi

**Ringkas:** (1) Penilaian dampak disusun karena aplikasi memproses **data anak** (UU PDP Ps. 25 dan 34; PP Tunas; parameter DP04 Kepmenkomdigi 142/2026) dan memakai **keputusan otomatis** untuk menentukan tingkat soal. (2) Dari 12 risiko yang dinilai, setelah mitigasi tidak ada yang tinggi. Tiga yang tersisa di tingkat **sedang**: transfer ke luar negeri, link rapor yang diteruskan, dan kebocoran server. (3) Kesimpulan sementara: pemrosesan boleh dimulai setelah daftar periksa `11-privasi-dan-keamanan.md` bagian 7 terpenuhi. **Draf, belum diperiksa ahli hukum.**

Versi draf 0.1 — 19 Oktober 2026. Penilai: Acut2 (dibantu AI), untuk diperiksa Acut dan ahli hukum.

---

## 1. Gambaran pemrosesan

| Hal | Isi |
|---|---|
| Pengendali | [NAMA BADAN USAHA] |
| Subjek data | Orang tua/wali (dewasa) dan anak 6–12 tahun |
| Jumlah | ± 50 keluarga masa uji; ± 500–1.000 setelah promosi |
| Data | `11-privasi-dan-keamanan.md` bagian 3 |
| Tujuan | Latihan, rapor, komunikasi keluarga, pengembangan (dengan izin), rapor cerita AI (dengan izin) |
| Pemroses | Supabase (Singapura), Anthropic API (AS, dengan izin), penyedia email, Cloudflare, Expo + Firebase Cloud Messaging (pemberitahuan HP orang tua; HP mode anak tidak mendaftar), WhatsApp/Meta (Izin 7), langganan Claude pengelola (angka gabungan tanpa nomor keluarga). Dilengkapi 20 Okt |
| Keputusan otomatis | Naik/turun level dan pemilihan soal ulangan berdasarkan jawaban anak |

## 2. Perlu dan sepadan?

| Pertanyaan | Jawaban |
|---|---|
| Apakah setiap data diperlukan untuk tujuannya? | Ya; data yang tidak perlu (nama lengkap, tanggal lahir lengkap, foto, sekolah, lokasi) sengaja tidak dikumpulkan |
| Bisakah tujuan dicapai dengan data lebih sedikit? | Bulan-tahun lahir menggantikan tanggal lengkap; rapor cerita memakai angka tanpa nama |
| Apakah keputusan otomatis merugikan anak? | Tidak menimbulkan akibat hukum; hanya menentukan tingkat latihan. Orang tua melihat level dan bisa meminta penyesuaian; anak tidak pernah "dihukum" |
| Apakah anak dan orang tua tahu? | Ya, lewat formulir persetujuan, kebijakan privasi, dan bagian "Untuk kamu" |

## 3. Risiko dan mitigasi

Skala: kemungkinan (R = rendah, S = sedang, T = tinggi) × dampak.

| # | Risiko | Sebelum mitigasi | Mitigasi | Sesudah |
|---|---|---|---|---|
| 1 | Keluarga lain membaca data anak | S × T | Aturan akses per baris per keluarga; uji wajib | R × T → **rendah** |
| 2 | Kebocoran server | R × T | Enkripsi, kunci di server, cadangan, rencana 3 × 24 jam | R × T → **sedang** |
| 3 | Transfer ke Singapura/AS tanpa dasar cukup | S × S | Data minimal; persetujuan per tujuan; perjanjian pemrosesan data; ahli hukum | R × S → **sedang** |
| 4 | Link rapor diteruskan ke orang luar | S × S | Izin terpisah, peringatan, bisa dicabut, isi minimal | S × R → **sedang** |
| 5 | Anak masuk mode orang tua dan mengubah izin | S × S | PIN, kunci setelah 5 kali salah, riwayat pembukaan | R × S → **rendah** |
| 6 | Rapor cerita AI berisi klaim salah tentang anak | S × S | Angka dicek kode; kata terlarang; label AI; cetakan cadangan | R × R → **rendah** |
| 7 | Catatan pemakaian dipakai untuk profiling | R × T | Hanya jumlah gabungan; izin terpisah; larangan tertulis | R × S → **rendah** |
| 8 | Teknik dorongan membuat anak kecanduan | S × S | Tanpa rangkaian hari, notifikasi anak, ancaman kehilangan; batas game | R × S → **rendah** |
| 9 | Pesan keluarga dipakai untuk kontak orang asing | R × T | Hanya dalam keluarga; anak hanya stiker; teks orang tua tanpa link | R × R → **rendah** |
| 10 | HP hilang membuka data anak | S × R | Putus HP dari jauh; data lokal terhapus | R × R → **rendah** |
| 11 | Pengajar melihat data tanpa izin | R × S | Izin per anak; hanya ringkasan latihan rumah | R × R → **rendah** |
| 12 | Panel pengelola disalahgunakan | R × T | Dua langkah masuk; akses per keluarga wajib alasan dan tercatat | R × S → **rendah** |

## 4. Hak subjek data — cara dipenuhi

| Hak | Cara |
|---|---|
| Informasi | Formulir persetujuan, kebijakan privasi |
| Akses dan salinan | Unduh data keluarga di aplikasi |
| Membetulkan | Ubah profil anak |
| Menghapus | Hapus akun di aplikasi dan halaman web |
| Menarik persetujuan | Pengaturan → Izin data |
| Keberatan atas keputusan otomatis | Orang tua bisa meminta level disesuaikan lewat pesan ke pejabat pelindungan data **[usul: tombol "level terasa tidak pas" di mode orang tua]** |

## 5. Kesimpulan sementara

Pemrosesan **boleh dimulai** setelah: (1) profil risiko rendah ditetapkan Komdigi, (2) daftar periksa sebelum tayang terpenuhi, dan (3) ahli hukum memeriksa risiko #3 (transfer), **atau**, kalau ahli hukum belum ada, Acut menandatangani catatan tertulis bahwa ia menerima risiko #3 sampai ahli hukum memeriksanya (diubah 20 Okt, sebab ahli hukum belum dipilih dan syarat ini akan menahan uji keluarga tanpa batas). Penilaian ini diperbarui setiap ada fitur baru yang menambah data, misalnya foto lembar buku, suara Bahasa Inggris, atau pembayaran.
