# CLAUDE.md — Pintar Main

Aturan tetap untuk setiap sesi Claude Code di repo ini. Perintah kerja ada di `PROMPT-RCTOR.md` (pembangunan pertama) dan `PROMPT-LANJUTAN-KOMIK.md` (riset model belajar dan Cerita Komik, 11 Nov 2026). Kemajuan terakhir ada di `KEMAJUAN.md` (baca berkas ini dulu kalau ada).

## Produk

Pintar Main adalah aplikasi Android belajar untuk anak SD dan orang tuanya. Maskotnya **Pinci, Si Kancil Pintar**. Pemiliknya Acut (Banda Aceh), yang tidak menulis kode dan membaca hasil dalam Bahasa Indonesia sederhana.

- Mode anak dan mode orang tua ada di satu aplikasi. Mode orang tua dikunci dengan PIN.
- Pembangunan ini mencakup **kelas 6 dulu**: Lancar Matematika, Baca Ulang, Persiapan TKA (Matematika dan Bahasa Indonesia), Gudang Ilmu kelas 6, Belajar Bahasa Inggris tingkat 3–6 (boleh dibuka semua kelas), mode orang tua, Mode Dampingi, dan 4 game.
- **Ditambah 11 Nov 2026:** Bahasa Inggris memakai **Cerita Komik** di setiap unit, dengan tokoh anak-anak **Gampong Bungong** (Fathan, Nisa, Dafi, Lina, Bima), robot **Robi**, dan **Mister Kabut**. Pinci tetap maskot aplikasi dan muncul di komik sebagai boneka Nisa. Rincian: `docs/rancangan/01-produk/12-penerapan-riset-model-belajar.md` dan `13-cerita-komik-bahasa-inggris.md`.
- Rancangan lengkap ada di `docs/rancangan/`. Kalau rancangan dan berkas ini bertentangan, yang berlaku `docs/rancangan/keputusan.md`, lalu berkas ini, lalu berkas rancangan terbaru (tanggal paling akhir).

## Teknologi (diputuskan, jangan diganti)

- Expo (SDK stabil terbaru) + React Native + TypeScript mode ketat + expo-router
- Data di HP: expo-sqlite, di balik **lapisan data** (antarmuka repositori). Adaptor lokal aktif sekarang. Adaptor Supabase (Singapura) ditulis tetapi mati lewat `EXPO_PUBLIC_DATA_MODE=lokal`.
- Gerak dan sentuhan: react-native-reanimated + react-native-gesture-handler. Gambar: react-native-svg.
- Suara: expo-speech (id-ID dan en-US) untuk 🔊. Efek bunyi pendek dibuat sendiri dengan skrip (tanpa berkas berlisensi).
- **Rekam suara (11 Nov):** pustaka rekam resmi Expo untuk SDK yang dipakai (expo-audio; expo-av hanya kalau SDK belum punya expo-audio) + expo-file-system. Hanya untuk fitur Dengar Bedanya, aturan 12.
- Huruf: Baloo 2 (judul), Andika (soal, bacaan, dan gelembung komik), Nunito (mode orang tua), lewat @expo-google-fonts.
- Uji: Jest + @testing-library/react-native. Tangkapan layar: build web Expo + Playwright (sudah terpasang, jangan dipasang ulang).

## Aturan yang tidak boleh dilanggar

1. **Kebijakan Keluarga Google Play:** tanpa iklan, tanpa analytics atau pelacak pihak ketiga, tanpa SDK yang tidak disetujui untuk layanan anak. Periksa setiap pustaka sebelum dipasang.
2. **Data anak seminim mungkin:** nama panggilan, kelas, hewan profil. Tanpa foto, lokasi, atau nomor HP anak. Rekaman suara anak **hanya** boleh lewat aturan 12.
3. **Game tanpa kalah:** tanpa nyawa, tanpa "game over", tanpa skor merah, tanpa hitung mundur di dalam babak. Jawaban belum tepat membuat benda memantul kembali, dan setelah 2 kali Pinci memberi petunjuk.
4. **Bintang hanya tanda selesai**, tidak bisa ditukar. Aksesori Pinci muncul sebagai kejutan acak, bukan hadiah poin.
5. Jangan pernah menulis kalimat "selesaikan latihan untuk dapat game". Waktu main muncul setelah inti harian selesai (bawaan), dan orang tua bisa memilih "selalu terbuka".
6. Batas waktu: belajar ≤ 10 menit × kelas per hari, dibagi blok ≤ 15 menit dengan layar istirahat. Game: kelas 1–2 20 menit, kelas 3–6 30 menit, orang tua bisa mengatur 0–60 menit. Jam tenang bawaan mulai 21.00.
7. Uang di Pasar Gampong **bergaya sederhana, bukan tiruan uang Rupiah asli**.
8. Layar anak memakai slogan "Pintar itu seru!". Slogan "Belajar dulu, main kemudian!" hanya untuk orang tua dan Play Store.
9. Belum ada isi keagamaan buatan sendiri. Bahan TKA milik Acut dipakai apa adanya (latar budaya). **Setiap kata yang berhubungan dengan agama ditanyakan dulu ke Acut sebelum ditulis** (`keputusan.md` bagian K). Akhlak umum di komik (jujur, sopan, menolong, berbagi, minta maaf, memaafkan, hormat pada orang tua dan guru, menjaga kebersihan dan alam) **boleh dan diharapkan**, sebab bukan ajaran agama. Anak perempuan berkerudung adalah gambaran keseharian, bukan isi agama.
10. Setiap soal, teks, dan naskah komik buatan sendiri diberi status `belum_diperiksa` sampai guru memeriksanya. Kunci jawaban Matematika **dihitung ulang oleh kode**, tidak cukup ditulis tangan.
11. Bahasa di layar: Bahasa Indonesia baku yang sederhana, kalimat pendek, tanpa istilah Inggris (kecuali isi pelajaran Bahasa Inggris).
12. **Rekaman suara anak (Dengar Bedanya):** tombol rekam hanya tampil kalau orang tua menyalakan **Izin 8** di mode orang tua. Rekaman disimpan **hanya di folder pribadi aplikasi di HP**: tidak pernah dikirim ke server, tidak masuk antrean sinkron, tidak ikut cadangan Android (`allowBackup` mati), tidak bisa dibagikan keluar aplikasi, dan tidak pernah terlihat oleh staf, pengawas, mitra les, atau guru. Terhapus otomatis 30 hari setelah direkam, kecuali paling banyak 5 kenangan yang disematkan orang tua. Batas 50 MB (yang tertua terhapus lebih dulu). Menarik Izin 8 = semua rekaman langsung dihapus. Mikrofon hanya menyala saat tombol rekam ditekan, dengan tanda merekam yang jelas, maksimal 20 detik per kalimat dan 2 menit per cerita utuh. Tidak ada penilaian ucapan oleh mesin atau AI.
13. **Komik:** tokoh tidak boleh meniru tokoh kartun mana pun (nama, wajah, pakaian, kalimat khas). Upin & Ipin hanya acuan suasana. Penjahat tidak menakutkan: tanpa darah, senjata, atau pukul-memukul; Robi melindungi dengan cahaya dan perisai. **Teks gelembung ditulis aplikasi di atas gambar, tidak pernah dicetak di dalam gambar.** Pesan akhlak tidak dinilai dan tidak diberi hadiah.

## Desain

- Acuan visual: `desain/gambar-layar/*.png` (31 gambar) dan sumbernya `desain/dari-claude-design/*.dc.html`. Logika interaksi di dalam `<script data-dc-script>` tiap berkas menunjukkan perilaku yang dimaksud.
- Sistem desain (warna, huruf, ukuran, komponen): `desain/dari-claude-design/Main.dc.html` dan gambarnya `desain/gambar-layar/00-Sistem-Desain.png`.
- Brief: `docs/rancangan/03-antarmuka/05-brief-desain-claude-design.md`. Aturan tampilan: `docs/rancangan/03-antarmuka/03-aturan-tampilan.md`.
- Pinci dan ilustrasi digambar ulang sebagai komponen SVG dari kode SVG di berkas desain. Jangan memakai gambar berlisensi dari internet.
- Panel komik asli (dari desainer dan alat gambar AI) belum ada. Sampai ada, pakai **gambar sementara** SVG buatan sendiri yang ditandai `gambar_sementara: true` dan bisa diganti lewat paket isi tanpa mengubah kode.

## Cara bekerja

- Commit kecil dan sering, pesan commit dalam Bahasa Indonesia. Push setiap tahap selesai.
- Perbarui `KEMAJUAN.md` setiap tahap: apa yang selesai, apa yang berikutnya, perintah untuk melanjutkan.
- Keputusan yang diambil sendiri dicatat di `KEPUTUSAN-PEMBANGUNAN.md` beserta alasannya.
- `npm run periksa` (tsc + eslint + jest) harus lulus sebelum tahap dianggap selesai.
