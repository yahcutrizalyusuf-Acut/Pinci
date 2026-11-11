# Laporan Lanjutan Komik untuk Acut

11 November 2026 · Tahap 25 · cabang `ccr-324ce0b7-o7lyr8`

## 1. Yang sudah jadi

| Fitur | Isinya |
|---|---|
| **Cerita Komik** (Bahasa Inggris) | 12 komik tingkat 3–4. Anak menonton dulu: gelembung dibacakan dengan suara tiap tokoh dan kata disorot. Lalu membaca sendiri: ketuk kata untuk artinya. Di akhir ada kartu Pesan Hari Ini |
| **Cek Paham** | Urutkan panel, siapa yang bilang, dengar lalu pilih panel, lengkapi kalimat. Jawaban belum tepat: panel bergoyang pelan, tanpa skor merah |
| **Unit Bahasa Inggris baru** | Sesi A (kenal kata + gerakan Pinci, Bunyi Hari Ini, pola, komik) dan Sesi B (Cek Paham dan latihan). Cek Dengar 8 soal setiap 4 unit |
| **Ceritakan Lagi** (Mode Dampingi) | Anak menceritakan komik ke Ayah/Bunda. Ada naskah untuk orang tua, kata bantu, contoh suara, daftar centang, dan pertanyaan renungan. Tidak menjadi nilai |
| **Dengar Bedanya + Izin 8** | Anak mendengar contoh, merekam suaranya, lalu membandingkan sendiri. Tombol rekam hanya muncul kalau Izin 8 dinyalakan di Atur → Rekaman suara. Rekaman **hanya di HP**: tidak dikirim ke server, terhapus sendiri setelah 30 hari, paling banyak 5 kenangan. Mencabut izin = semua rekaman langsung terhapus |
| **Tebak Gerak** | 20 perintah Bahasa Inggris (*Jump! Clap your hands!*), anak dan orang tua bergantian bergerak |
| **Rapor** | Kalimat kemajuan Bahasa Inggris, satu cara membantu, dan ajakan perbuatan baik (tanpa nilai atau hadiah) |
| **Matematika kelas 6** | Langkah "Coba dengan benda" (benda → gambar → angka) di 20 kartu, 28 soal cerita berlatar Aceh (kuncinya dihitung komputer), dan pertanyaan pancingan untuk orang tua |
| **Gambar** | 9 tokoh dan 8 latar gambar sementara. Gambar asli dari desainer bisa dipasang nanti tanpa mengubah aplikasi |

## 2. Dua belas komik

| Komik | Judul | Pesan akhlak |
|---|---|---|
| T3-1 | Hello, Robi! | Ramah kepada yang baru dikenal, berani walau takut |
| T3-2 | One, Two, Three! | Berbagi walau milik sendiri sedikit |
| T3-3 | Count to Twenty | Bekerja sama membantu guru, sabar saat ada yang salah |
| T3-4 | Lina's Colors | Jujur mengakui kesalahan dan minta maaf |
| T3-5 | Meet My Family | Sopan dan hormat kepada orang tua dan nenek |
| T3-6 | My Red Pencil | Jujur mengembalikan barang orang lain |
| T4-1 | Touch Your Nose! | Tolong-menolong saat teman kesusahan |
| T4-2 | Yummy Food | Mengambil makanan secukupnya |
| T4-3 | Nisa's Birthday | Sabar walau keadaan tidak sesuai harapan |
| T4-4 | Super Robi! | Disiplin bangun pagi |
| T4-5 | How Do You Feel? | Tidak mengejek teman, berani minta maaf |
| T4-6 | Light in the House | Menjaga rumah bersih bersama |

## 3. Cara mencoba di HP

1. Buka GitHub → **Actions** → **Bangun APK** → pilih proses terbaru di cabang ini → unduh **pintar-main-apk**, lalu pasang di HP.
2. Masuk sebagai orang tua, buat profil anak (kelas 3–6). Buka **Bahasa Inggris** → unit 1 → ikuti Sesi A sampai komik.
3. Di mode orang tua: **Atur → Mode Dampingi → Ceritakan Lagi**.
4. Untuk merekam: **Atur → Rekaman suara (Izin 8)** → nyalakan, lalu buka **Dengar Bedanya**.
5. Matematika: profil kelas 6 → Gudang Ilmu → misalnya "Perkalian pecahan".

## 4. Yang belum jadi

- **Gambar komik asli** belum ada (menunggu desainer). Sekarang memakai gambar sementara.
- **Komik tingkat 5–6** belum ditulis. Prompt meminta 12 komik dulu.
- **Main Peran** (K32), **pemanasan 3 soal lama**, dan **tes paham 8 minggu** masih dimatikan.
- "Coba dengan benda" belum ada untuk bangun datar, bangun ruang, sudut, dan diagram. Bendanya perlu bisa diputar dan disusun.

## 5. Hasil uji dan pemeriksaan

- **588 uji otomatis lulus.** Uji database juga lulus.
- Aplikasi berjalan penuh **tanpa sinyal**.
- Ada dua pemeriksa bebas, satu untuk naskah dan satu untuk privasi. Semua temuan penting sudah diperbaiki: beberapa kalimat Inggris, pengecoh soal, sisa rekaman yang terputus, rekaman anak yang profilnya dihapus, dan pindah data antar-HP. Rinciannya ada di `docs/LAPORAN-PEMERIKSAAN-KOMIK.md`.
- Semua naskah berstatus **belum diperiksa guru**. Daftarnya: `docs/DAFTAR-PERIKSA-GURU.md` bagian 6–8 dan `docs/NASKAH-KOMIK-UNTUK-GURU.md`.

## 6. Jawaban Acut (11 Nov 2026)

1. **Kenduri** boleh dipakai: kata ini dikembalikan ke adegan T4-1 dan T4-2.
2. **Pesta ulang tahun** (T4-3) tetap dipakai.
3. **Magic** (T4-4) diganti: Robi sekarang menjawab *"You are welcome! Super Robi!"* (Sama-sama!).

Keputusan yang saya ambil sendiri ada di `KEPUTUSAN-PEMBANGUNAN.md` nomor 74–89. Contohnya: batas kenangan rekaman 5 untuk satu HP, dan hasil Ceritakan Lagi yang terkirim ke server hanya centang serta ada/tidaknya rekaman.

## 7. Tiga langkah berikutnya

| Langkah | Siapa |
|---|---|
| Pasang 2 berkas SQL di Supabase (urutan di `docs/CARA-MENYAMBUNG-SUPABASE.md`) | Acut |
| Guru Bahasa Inggris memeriksa 12 naskah komik. Guru Matematika memeriksa 28 soal cerita | Guru, lewat Acut |
| Desainer menggambar 5 anak dan Robi untuk menggantikan gambar sementara | Desainer, paling lambat 11 Des 2026 |
