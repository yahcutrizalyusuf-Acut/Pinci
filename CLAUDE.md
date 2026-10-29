# CLAUDE.md — Pintar Main

Aturan tetap untuk setiap sesi Claude Code di repo ini. Perintah kerja lengkap ada di `PROMPT-RCTOR.md`. Kemajuan terakhir ada di `KEMAJUAN.md` (baca berkas ini dulu kalau ada).

## Produk

Pintar Main adalah aplikasi Android belajar untuk anak SD dan orang tuanya. Maskotnya **Pinci, Si Kancil Pintar**. Pemiliknya Acut (Banda Aceh), yang tidak menulis kode dan membaca hasil dalam Bahasa Indonesia sederhana.

- Mode anak dan mode orang tua ada di satu aplikasi. Mode orang tua dikunci dengan PIN.
- Pembangunan ini mencakup **kelas 6 dulu**: Lancar Matematika, Baca Ulang, Persiapan TKA (Matematika dan Bahasa Indonesia), Gudang Ilmu kelas 6, Belajar Bahasa Inggris tingkat 3–6 (boleh dibuka semua kelas), mode orang tua, Mode Dampingi, dan 4 game.
- Rancangan lengkap ada di `docs/rancangan/`. Kalau rancangan dan berkas ini bertentangan, yang berlaku `docs/rancangan/keputusan.md`, lalu berkas ini.

## Teknologi (diputuskan, jangan diganti)

- Expo (SDK stabil terbaru) + React Native + TypeScript mode ketat + expo-router
- Data di HP: expo-sqlite, di balik **lapisan data** (antarmuka repositori). Adaptor lokal aktif sekarang. Adaptor Supabase (Singapura) ditulis tetapi mati lewat `EXPO_PUBLIC_DATA_MODE=lokal`.
- Gerak dan sentuhan: react-native-reanimated + react-native-gesture-handler. Gambar: react-native-svg.
- Suara: expo-speech (id-ID dan en-US) untuk 🔊. Efek bunyi pendek dibuat sendiri dengan skrip (tanpa berkas berlisensi).
- Huruf: Baloo 2 (judul), Andika (soal dan bacaan anak), Nunito (mode orang tua), lewat @expo-google-fonts.
- Uji: Jest + @testing-library/react-native. Tangkapan layar: build web Expo + Playwright (sudah terpasang, jangan dipasang ulang).

## Aturan yang tidak boleh dilanggar

1. **Kebijakan Keluarga Google Play:** tanpa iklan, tanpa analytics atau pelacak pihak ketiga, tanpa SDK yang tidak disetujui untuk layanan anak. Periksa setiap pustaka sebelum dipasang.
2. **Data anak seminim mungkin:** nama panggilan, kelas, hewan profil. Tanpa rekaman suara anak, foto, lokasi, atau nomor HP anak.
3. **Game tanpa kalah:** tanpa nyawa, tanpa "game over", tanpa skor merah, tanpa hitung mundur di dalam babak. Jawaban belum tepat membuat benda memantul kembali, dan setelah 2 kali Pinci memberi petunjuk.
4. **Bintang hanya tanda selesai**, tidak bisa ditukar. Aksesori Pinci muncul sebagai kejutan acak, bukan hadiah poin.
5. Jangan pernah menulis kalimat "selesaikan latihan untuk dapat game". Waktu main muncul setelah inti harian selesai (bawaan), dan orang tua bisa memilih "selalu terbuka".
6. Batas waktu: belajar ≤ 10 menit × kelas per hari, dibagi blok ≤ 15 menit dengan layar istirahat. Game: kelas 1–2 20 menit, kelas 3–6 30 menit, orang tua bisa mengatur 0–60 menit. Jam tenang bawaan mulai 21.00.
7. Uang di Pasar Gampong **bergaya sederhana, bukan tiruan uang Rupiah asli**.
8. Layar anak memakai slogan "Pintar itu seru!". Slogan "Belajar dulu, main kemudian!" hanya untuk orang tua dan Play Store.
9. Belum ada isi keagamaan. Jangan menambahkannya.
10. Setiap soal dan teks buatan sendiri diberi status `belum_diperiksa` sampai guru memeriksanya. Kunci jawaban Matematika **dihitung ulang oleh kode**, tidak cukup ditulis tangan.
11. Bahasa di layar: Bahasa Indonesia baku yang sederhana, kalimat pendek, tanpa istilah Inggris (kecuali isi pelajaran Bahasa Inggris).

## Desain

- Acuan visual: `desain/gambar-layar/*.png` (31 gambar) dan sumbernya `desain/dari-claude-design/*.dc.html`. Logika interaksi di dalam `<script data-dc-script>` tiap berkas menunjukkan perilaku yang dimaksud.
- Sistem desain (warna, huruf, ukuran, komponen): `desain/dari-claude-design/Main.dc.html` dan gambarnya `desain/gambar-layar/00-Sistem-Desain.png`.
- Brief: `docs/rancangan/03-antarmuka/05-brief-desain-claude-design.md`. Aturan tampilan: `docs/rancangan/03-antarmuka/03-aturan-tampilan.md`.
- Pinci dan ilustrasi digambar ulang sebagai komponen SVG dari kode SVG di berkas desain. Jangan memakai gambar berlisensi dari internet.

## Cara bekerja

- Commit kecil dan sering, pesan commit dalam Bahasa Indonesia. Push setiap tahap selesai.
- Perbarui `KEMAJUAN.md` setiap tahap: apa yang selesai, apa yang berikutnya, perintah untuk melanjutkan.
- Keputusan yang diambil sendiri dicatat di `KEPUTUSAN-PEMBANGUNAN.md` beserta alasannya.
- `npm run periksa` (tsc + eslint + jest) harus lulus sebelum tahap dianggap selesai.
