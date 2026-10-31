# Keputusan Pembangunan

Keputusan yang diambil sendiri selama pembangunan, beserta alasannya. Rancangan (`docs/rancangan/keputusan.md`) dan `CLAUDE.md` tetap berlaku di atas berkas ini.

| # | Keputusan | Alasan |
|---|---|---|
| 1 | Expo SDK 58 (terbaru stabil per 29 Okt 2026), React Native 0.88, expo-router 58 | `CLAUDE.md`: SDK stabil terbaru |
| 2 | Rute ada di `src/app/`, bukan `app/` | Susunan bawaan Expo SDK 58. Isinya sama dengan yang diminta prompt |
| 3 | Pustaka dipasang dengan versi dari `expo/bundledNativeModules.json`, bukan `npx expo install` | Layanan versi Expo diblokir dari sesi cloud. Hasilnya sama: versi yang cocok dengan SDK 58 |
| 4 | Izin Android: rekaman suara, kamera, lokasi, kontak, dan ID iklan diblokir di `app.json` | Kebijakan Keluarga dan data anak seminim mungkin |
| 5 | Lapisan data: tabel SQLite per tabel rancangan dengan kolom saring terindeks (keluarga_id, anak_id, sesi_id, jenis, tanggal) + kolom `data` JSON berisi baris lengkap | Satu pola untuk semua tabel, mudah diuji; kolom lengkap tetap ada di skema Supabase (Tahap 9) |
| 6 | Pratinjau web dan uji memakai gudang memori (web: disimpan di localStorage); HP memakai SQLite | expo-sqlite di web butuh tajuk khusus; tangkapan layar Playwright memakai build web |
| 7 | Mode lokal tidak punya pengirim: layar hanya menampilkan "Tersimpan ✓". "Terkirim ✓✓" muncul setelah mode Supabase dinyalakan | Jujur: tidak ada server di mode lokal |
| 8 | PIN disimpan sebagai sidik SHA-256 bergaram (kode sendiri, tanpa pustaka). Salah 5 kali → terkunci 5 menit. Mode orang tua tertutup sendiri setelah 15 menit | Rancangan D1; tanpa pustaka tambahan |
| 9 | Jam tenang menghentikan belajar **dan** game di mode anak (layar "Sudah malam") | Anjuran IDAI: berhenti memakai gawai 1 jam sebelum tidur |
| 10 | Inti harian: 1 lembar Lancar; kelas 6 ditambah 1 Baca Ulang + 1 latihan TKA (TKA hanya bila isinya sudah dibuka) | `10-gudang-ilmu…` bagian 5.2 |
| 11 | Istirahat 2 menit setelah blok 15 menit; tombol "Aku sudah siap lagi" terbuka setelah 2 menit | Desain A07 |
| 12 | Lancar — Level 1 kelas 2–6 mengambil 6 soal lama dari Level 6 kelas sebelumnya; kelas 1 Level 1 berisi 20 soal level itu | Belum ada level sebelumnya |
| 13 | Lancar — selipan bertahap: lembar ke-1 di level baru 8 + 12, ke-2 11 + 9, sesudahnya 14 + 6 | Celah #3 di `04-mesin-lancar.md` |
| 14 | Lancar — kelas 6 L2 dijawab dengan papan angka bertombol "," dan "/" | Perintah tugas meminta pecahan ↔ persen ↔ desimal |
| 15 | Lancar — lembar Dampingi dan lembar ke-3 di hari yang sama tidak dihitung untuk naik; turun tetap berlaku pada lembar ke-3 | `04-mesin-lancar.md` + keputusan B3 no. 5 |
| 16 | Lancar — rekor sendiri hanya dari lembar mode sendiri dengan salah ≤ 1 | Rekor tidak boleh dari lembar yang banyak salah |
| 17 | Game Pasar: kelas 1–2 Seru harus bayar pas; Santai bayar lebih diterima dan kembalian dihitung Pinci; kelas 3–6 Seru memilih kembalian; kelas 5–6 Seru memakai diskon 10/20/25/50% | Desain G03 + tabel prompt |
| 18 | Game Ular Tangga: hanya sulur naik (tanpa perosotan); jawaban salah memantul, setelah 2 kali tinggal jawaban benar; batas putaran supaya babak 2–4 menit | Desain G04; aturan game tanpa kalah |
| 19 | Babak game baru hanya dimulai bila sisa waktu main ≥ 60 detik; babak berjalan tidak dipotong | G08 "babak yang berjalan diselesaikan dulu" |
| 20 | Gudang Ilmu: modul simulasi (M08, M14, M20, M23, M24) tidak dijadikan kartu; 9 modul materi dipecah dua kartu → 28 kartu Matematika + 13 kartu Bahasa Indonesia | ≥ 24 kartu topik materi |
| 21 | TKA: petunjuk dari bahan hanya satu tahap (Petunjuk) + Langkah sebagai pembahasan; aplikasi menurunkan tahap 2/3 dari langkah pembahasan, tidak mengarang | Bahan tidak punya 3 tahap |
| 22 | TKA: kode penyebab salah B/H/S ditebak mesin dari alasan pengecoh, belum diperiksa guru | Bahan tidak memberi kode di semua pengecoh |
| 23 | Bahasa Inggris: kosakata harus bisa digambar emoji; nama hari/bulan dan angka 20–100 hanya muncul di kalimat, bukan kosakata bergambar | Desain B05 berbasis gambar |
| 24 | ~~Butir dan teks TKA yang memuat istilah keagamaan ditandai `perlu_dicek`~~ → **Diganti keputusan Acut 29 Okt:** bahan dipakai apa adanya; istilahnya hanya dicatat di `docs/LAPORAN-IMPOR-TKA.md` bagian 8 | `keputusan.md` bagian K no. 1 |
| 25 | Penjaga waktu memeriksa blok 15 menit dan batas harian setiap kali waktu disimpan, lalu membuka Istirahat atau Cukup di tengah layar | Temuan pemeriksa produk: tanpa ini anak bisa bertahan di satu layar melewati batas |
| 26 | Alasan pengecoh TKA disaring sebelum tampil ke anak (`alasanUntukAnak`): bagian untuk guru dan kata "salah" dibuang; alasan lengkap tetap di rapor orang tua | Aturan tampilan: tanpa kata "salah" di layar anak; bahan asli tidak diubah |
| 27 | Batas belajar dipotong ≤ 10 menit × kelas saat dibaca, bukan hanya saat disimpan | Kelas anak bisa diubah tanpa membuka pengaturan waktu |
| 28 | Penjaga PIN dipasang di `ortu/_layout.tsx` (semua layar orang tua kecuali layar PIN) | Layar di luar tab bisa dibuka lewat tautan |
| 29 | Tab bawah memakai `navigateToTab` dari expo-router, bukan `navigation.emit` | Bilah tab kustom expo-router 58 tidak memberi `navigation`; tab tidak bisa berpindah |
| 30 | Tantang Ayah menampilkan jumlah soal tepat bersama, tanpa hitungan per orang | Aturan 4: bintang bukan skor pembanding |
| 31 | `expo-haptics` dihapus | Tidak dipakai, dan izin getar diblokir |
| 32 | Expo Go/EAS Update dilewati; caranya ditulis di `docs/CARA-MEMBUAT-APK.md` | `EXPO_TOKEN` tidak tersedia |
| 33 | "Level", "game", dan "Mini try out" tetap dipakai di layar; "Skor" diganti "Hasil" | Dikukuhkan Acut 29 Okt (`keputusan.md` bagian K no. 3) |
| 34 | Jam tenang boleh dimatikan orang tua (bawaan tetap 21.00) | Dikukuhkan Acut 29 Okt (`keputusan.md` bagian K no. 2) |
| 35 | Suara Inggris memakai rekaman yang dibundel di aplikasi (`assets/suara/en`), dibuat dengan Kokoro-82M (Apache-2.0); expo-speech tetap dipakai untuk Bahasa Indonesia dan untuk teks Inggris yang belum punya rekaman | Banyak HP orang tua tidak punya data suara Inggris yang baik, dan mengatur mesin suara terlalu rumit bagi mereka. Isi Inggris terbatas (±560 ucapan), jadi rekaman bawaan cukup kecil. Berkas bisa ditimpa rekaman guru tanpa mengubah kode |
| 36 | Susun Kubus: kubus putus-putus bisa diketuk untuk menaruh kubus; Santai hanya memakai kartu tampak depan di semua kelas | Uji di HP: anak dan orang tua kesulitan menaruh kubus di tampilan miring dan membaca tiga kartu sekaligus |
| 37 | Empat game baru (Kebun Pinci, Lompat Batu, Pasangkan Kartu, Balap Perahu) memakai level 1–5. Level berikutnya terbuka setelah level sebelumnya selesai; bintang hanya tanda selesai. Game lama tetap Santai/Seru | Permintaan Acut: game berjenjang. Tanpa kalah, jadi menyelesaikan babak = menyelesaikan level |
| 38 | Soal game baru dibuat kode per kelas dan level; kunci dihitung dari bentuk soal dan diuji ulang dari teks | Aturan 10: kunci Matematika dihitung kode |
| 39 | Balap Perahu: perahu teman (Rangkong) selalu sedikit di belakang lalu sampai bersama | Lomba tanpa kalah (aturan 3) |
| 40 | HP anak masuk ke Supabase sebagai pengguna anonim (`Allow anonymous sign-ins`) dan dicatat di tabel `perangkat` (id = id pengguna); akses dibatasi aturan baris lewat `anak_perangkat()` | Klaim JWT khusus (`perangkat_id`) butuh server tambahan untuk menandatangani token; pengguna anonim bawaan Supabase cukup dan aman |
| 41 | Kode hubung 6 angka, berlaku 10 menit, sekali pakai; salah 5 kali dalam 10 menit ditunda; 100 salah di seluruh server dalam 10 menit juga ditunda | Mencegah tebak-tebakan; ruang 1 juta kode dengan sangat sedikit kode aktif |
| 42 | Sinkron dua arah: tarik dengan kursor waktu mundur 5 menit, per halaman 500; sesi dan jawaban hanya ditambah, perubahan lokal yang belum terkirim tidak ditimpa, pemakaian angka terbesar, kemajuan topik yang terbaru | Aman diulang kapan saja; hasil sama di kedua HP; tidak ada data hilang bila tarik gagal di tengah |
| 43 | HP anak tanpa PIN dan tanpa mode orang tua (`Keluarga.hp = 'anak'`) | Pengaturan dan rapor dilakukan dari HP orang tua; mencegah anak mengubah batas waktu |
| 44 | Staf (super admin, admin, mitra les, pengawas) disimpan di tabel `staf`; staf baru lewat undangan email (`undangan_staf`) yang dipakai saat staf pertama kali masuk. Super admin pertama dibuat dari SQL Editor | Tanpa server tambahan untuk mengirim undangan; email masuk yang sama dengan orang tua (kode 6 angka) |
| 45 | Semua tulisan ke kelas, keanggotaan, staf, dan pantauan lewat fungsi server (RPC) yang memeriksa peran dan mencatat kegiatan; catatan dan tugas boleh ditulis langsung oleh staf dengan aturan baris yang memeriksa kelas, anak aktif, keluarga, dan nama staf | Hak akses dijaga di server, bukan di layar (rancangan bagian 4) |
| 46 | HP keluarga hanya mengirim tanda "dibaca" (catatan) dan "selesai" (tugas) lewat fungsi server; tanda di HP tidak pernah mundur saat menarik data | Pengawas pemilik isi catatan dan tugas; tanda tidak hilang walau kiriman sempat gagal |
| 47 | Tugas selesai otomatis saat anak menyimpan sesi yang cocok (jenis sama; rujukan topik/teks/level cocok bila diisi; sesi sesudah tugas dibuat) | Anak tidak perlu menekan "selesai"; pengawas melihat hasil nyata |
| 48 | Tarik data keluarga selalu disaring `keluarga_id` HP ini | Akun yang sekaligus staf (Acut) bisa membaca anak lain lewat aturan server; HP keluarga tidak boleh menyimpannya |
| 49 | Daftar kelas anak ditarik utuh lewat `kelas_keluarga()` (nama kelas dan pengawas ikut), keanggotaan yang hilang dihapus dari HP | Tabel kecil; nama pengawas tidak boleh dibaca langsung dari tabel staf oleh keluarga |
| 50 | Masa coba 14 hari hanya sekali per anak: keluar lalu masuk kelas lagi tidak mengulang masa coba | Mencegah masa coba tanpa batas |
| 51 | Aplikasi tidak menampilkan harga; layar persetujuan menulis "Biaya dan cara bayar dikirim ke email Anda" | Aturan Google Play untuk aplikasi tanpa pembelian di dalamnya (rancangan bagian 6b) |
| 52 | Halaman staf memakai kode aplikasi yang sama (rute `/staf`), dipakai di HP dan di laptop lewat build web | Satu kode untuk aplikasi dan web admin (rancangan bagian 10) |
| 53 | Baca Ulang kelas 2–5: patokan 30/40/45/50 kata per menit, panjang ± 30/48/60/78 kata; jumlah kata dan sasaran waktu dihitung kode **[ASUMSI]** | Belum ada patokan resmi; kelas 3 nasional 64–69 kpm dan anak Aceh ± 17–20 kpm lebih lambat. Dinilai ulang dengan data uji keluarga |
| 54 | Gudang Ilmu kelas 2–5 dibangkitkan dari sumber bertipe (`src/isi/gudang/sumber/k2.ts` … `k5.ts`) seperti kelas 6; tahap 1 = 4 kartu Matematika + 2 kartu Bahasa Indonesia per kelas, topik lain tampil "segera" | Pola yang sudah teruji; kunci Matematika dihitung ulang oleh uji |
| 55 | Isi kelas 2–5 diperiksa Acut lebih dulu lewat `docs/periksa-isi/Periksa-Isi-Kelas-2-5.pdf`; status tetap `belum_diperiksa` | Keputusan Acut 31 Okt (keputusan.md L no. 15) |
| 56 | Status langganan dihitung server dari `coba_sampai` dan `berlaku_sampai` (coba, aktif, tenggang 7 hari, berhenti, mitra); pembayaran dicatat manual oleh super admin/admin dan memperpanjang dari tanggal paling akhir | Tahap 1 pembayaran: QRIS dengan cek manual (keputusan.md L no. 9) |
| 57 | Harga hanya bisa dibaca dan diubah super admin; admin mencatat jumlah yang diterima tetapi tidak melihat daftar harga atau laporan uang | Rancangan bagian 4: admin tanpa uang |
| 58 | Kunci paket dihitung di HP dari keanggotaan kelas; tanpa kelas (mode lokal, uji keluarga) semua isi kelasnya tetap terbuka | Uji keluarga dan mode lokal tidak boleh terkunci; bagian terkunci netral tanpa ajakan membeli |
| 59 | Masukan, jawaban pertanyaan, catatan pemakaian, dan catatan teknis memakai antrean sinkron yang sama (hanya dikirim); kiriman yang ditolak server (misalnya persetujuan dicabut) dibuang | Tahan putus sinyal; tidak ada antrean yang macet selamanya |
| 60 | Catatan pemakaian hanya dibuat bila orang tua setuju untuk anak itu; persetujuan terbaru menang dan disalin ke HP anak lewat `kelas_keluarga` | PP 33/2026 Ps. 35(1); bisa dimatikan tanpa kehilangan layanan |
| 61 | Penangkap galat aplikasi mengirim pesan galat, satu baris tempat, versi, dan jenis HP; pesan yang sama paling banyak sekali per 10 menit | Data pribadi tidak ikut; tanpa layanan pihak ketiga |
| 62 | Halaman penjelasan statis (`halaman/`) dengan huruf disajikan sendiri dan formulir ke fungsi `daftar_minat` (dibatasi 3 kali per email per hari, 300 per jam) | Tanpa pelacak dan tanpa pustaka luar; kunci anon aman karena tabel pendaftar hanya bisa ditulis lewat fungsi |
| 63 | Pertanyaan mingguan berputar tiap Senin WIB dari 6 pertanyaan berkode tetap; jawaban dikirim dengan kode + nomor minggu | Bisa dibandingkan antarminggu, sekali jawab per minggu |
| 64 | Isi kelas 2–5 tahap 2: semua topik di peta kini punya kartu (12 kartu, 60 soal per kelas) dan 12 teks Baca Ulang per kelas; panjang teks kelas 4–5 tahap 2 sedikit lebih pendek, rentang uji disesuaikan **[ASUMSI]** | Target ± 12 teks dan 12 kartu per kelas sebelum 4 Januari (keputusan.md L no. 14) |
