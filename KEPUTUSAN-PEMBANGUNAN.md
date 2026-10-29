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
