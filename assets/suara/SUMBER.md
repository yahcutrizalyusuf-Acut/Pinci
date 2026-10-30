# Sumber Rekaman Suara Inggris

Berkas `en/<kunci>.mp3` adalah rekaman setiap kata dan kalimat Bahasa Inggris di aplikasi. Tombol 🔊 memutar rekaman ini, jadi pengucapannya sama bagusnya di semua HP tanpa perlu mengatur apa pun. Teks yang belum punya rekaman memakai mesin suara HP seperti sebelumnya.

## Cara dibuat

- Dibuat oleh `npm run suara` (`scripts/buat-suara.ts` dan `scripts/buat-suara.py`) di komputer, tanpa internet saat berjalan.
- Mesin suara: **Kokoro-82M** versi ONNX (`kokoro-onnx`). Bobot model berlisensi **Apache-2.0**, dan pustakanya berlisensi MIT. Suara yang dipakai: `af_heart` (perempuan, logat Amerika), kecepatan 0,85.
- Hasilnya diolah dengan ffmpeg: mono, 24 kHz, MP3 48 kbps, hening dipangkas, dan kerasnya diratakan.
- Tidak ada suara orang sungguhan dan tidak ada rekaman suara anak.

## Mengganti dengan rekaman manusia

Kalau nanti ada guru atau penutur asli yang merekam:

1. Lihat `daftar-en.json`. Setiap baris berisi `kunci` dan `teks`.
2. Rekam teks itu, lalu simpan sebagai `en/<kunci>.mp3`, menimpa berkas lama.
3. Jalankan `npm run suara -- --peta-saja`, lalu commit.

Perekam perlu memberi izin tertulis bahwa suaranya dipakai di aplikasi.

## Kalau teks Inggris diubah

Kunci dihitung dari teks, jadi teks yang berubah akan mendapat kunci baru. Jalankan lagi `npm run suara` supaya rekaman yang kurang dibuat. Uji `src/isi/suara/__tests__/kunci.test.ts` gagal kalau ada ucapan yang belum punya rekaman.
