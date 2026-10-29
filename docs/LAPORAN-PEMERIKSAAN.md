# Laporan Pemeriksaan

Pada Tahap 10, dua pemeriksa bebas memeriksa aplikasi. Keduanya subagen baru yang tidak ikut membangun, dan keduanya hanya membaca kode serta isi. Setelah itu ada uji otomatis dan uji tanpa sinyal.

## Ringkasan

| Pemeriksaan | Hasil |
|---|---|
| `npm run periksa` (tsc + eslint + jest) | Lulus, 384 uji |
| Cakupan uji mesin Lancar, impor TKA, logika game (`npm run cakupan`) | 92,9% baris perintah (syarat ≥ 80%) |
| Lembar Lancar dibangkitkan dan kuncinya dihitung ulang | 8.100 lembar lulus |
| Pemeriksa produk | 12 temuan, tanpa pelanggaran berat Kebijakan Keluarga atau data anak. 10 diperbaiki, 2 dicatat |
| Pemeriksa materi (60 butir acak) | **0 kunci salah**, 12 butir diberi catatan. Semua catatan pada isi buatan sendiri diperbaiki; catatan pada bahan TKA milik Acut diteruskan ke guru |
| Tangkapan layar 360 × 800 | 34 layar, tanpa galat konsol. Lihat `docs/BANDING-DESAIN.md` |
| Uji tanpa sinyal | Lulus (lihat bagian akhir) |

## Pemeriksa produk

Pemeriksa produk mencocokkan aplikasi dengan `CLAUDE.md`, `keputusan.md`, dan aturan rasa game.

| No | Temuan | Tindakan |
|---|---|---|
| 1 | Layar Pembahasan TKA menampilkan kata "Salah membaca soal" ke anak (`tka/pembahasan.tsx`, `fitur/tka-rapor.ts`) | **Diperbaiki.** Anak melihat kalimat ramah (`fitur/teks-anak.ts`, misalnya "Baca soalnya pelan-pelan, ya"). Kode penyebab lengkap tetap ada di rapor orang tua |
| 2 | Alasan pengecoh di bahan TKA ditulis untuk guru ("salah paham 3", "Anak yang…") dan tampil apa adanya ke anak | **Diperbaiki.** `alasanUntukAnak()` membuang bagian untuk guru sebelum ditampilkan. Bahan asli tidak diubah |
| 3 | Blok 15 menit dan batas harian hanya diperiksa saat layar dibuka | **Diperbaiki.** `useHitungWaktu` memeriksa setiap kali menyimpan waktu, lalu membuka layar Istirahat atau Cukup di tengah latihan |
| 4 | Batas belajar tidak ikut turun saat kelas anak diubah | **Diperbaiki.** Saat dibaca, batas dipotong menjadi ≤ 10 menit × kelas (`repositori.ts`, `penjaga-waktu.ts`) |
| 5 | Layar orang tua di luar tab bisa dibuka lewat tautan tanpa PIN; "PIN lama" di Ganti PIN bisa ditebak tanpa batas | **Diperbaiki.** Penjaga PIN dipindah ke `ortu/_layout.tsx` sehingga semua layar orang tua terjaga. Ganti PIN memakai kunci 5 kali salah yang sama |
| 6 | Tantang Ayah menghitung bintang per orang, jadi bintang berubah menjadi skor | **Diperbaiki.** Hitungan per orang dihapus; akhir permainan menampilkan "… menjawab N soal dengan tepat bersama!" |
| 7 | Tips orang tua memuat "setelah salat" | **Diperbaiki.** Diganti kegiatan umum |
| 8 | Bahan TKA milik Acut memuat latar keagamaan (meunasah, mengaji, salat, dan lainnya) | **Diputuskan Acut:** dipakai apa adanya. Lihat bagian "Keputusan Acut" |
| 9 | Layar Waktu main berjudul "Belajar dulu, ya" dan menampilkan daftar syarat | **Diperbaiki.** Kalimat diganti; daftar syarat dihapus |
| 10 | Istilah Inggris di layar: Level, game, Mini try out, Skor, Spam | **Sebagian.** "Skor" diganti "Hasil". "Level", "game", dan "Mini try out" tetap karena dipakai rancangan dan desain. "Spam" ada di layar masuk orang tua (mode Supabase, belum aktif) |
| 11 | Orang tua bisa mematikan jam tenang; simulasi TKA tidak memeriksa jam tenang | **Dicatat.** Rancangan memberi orang tua pilihan ini. Perlu ketegasan Acut: apakah 21.00 batas mutlak? |
| 12 | `expo-haptics` terpasang tetapi tidak dipakai | **Diperbaiki.** Pustaka dihapus |

Pemeriksa produk juga memastikan hal-hal ini:

- Tidak ada iklan, analytics, atau pelacak.
- Izin kamera, mikrofon, lokasi, kontak, dan ID iklan diblokir.
- Data anak hanya nama panggilan, kelas, dan hewan.
- Game tanpa nyawa dan tanpa hitung mundur.
- Uang Pasar Gampong sederhana.
- Kalimat terlarang tidak ada.
- Slogan "Pintar itu seru!" dipakai di layar anak.
- Semua isi berstatus `belum_diperiksa`.

## Pemeriksa materi

Pemeriksa mengambil 60 butir acak dengan benih 20261029: 20 TKA, 15 Lancar, 15 Bahasa Inggris, dan 10 Gudang Ilmu. Semua butir dikerjakan sendiri. **Tidak ada kunci yang salah.**

| Catatan | Tindakan |
|---|---|
| Jurus 6-1: inti hanya membahas akar | **Diperbaiki:** "kuadrat: angka dikali dirinya sendiri; akar adalah kebalikannya." |
| Inggris t3-u10-k05: *heart* = "hati" bisa dikira organ tubuh | **Diperbaiki:** "bentuk hati" |
| Inggris t6-u10-s03: "with the keyboard" kurang alami | **Diperbaiki:** "Type your name on the keyboard." |
| Gudang bi6-puisi-s5: satu pengecoh bisa dianggap benar | **Diperbaiki:** pengecoh diganti |
| Gudang bi6-watak-tokoh-s4: "menumpahkan air di buku" | **Diperbaiki:** "ke buku" |
| Gudang bi6-perubahan-tokoh-latar-s3: huruf awal pilihan tidak seragam | **Diperbaiki:** semua pilihan huruf kecil |
| TKA T35-q2: kutipan tidak sama dengan teks; ungkapan disebut "kata" | **Diteruskan ke guru** (bahan Acut) |
| TKA M17-k10: kalimat petunjuk denah ada di kolom pertanyaan | **Diteruskan ke guru** |
| TKA M12-k07, M12-tb2: kongruen dan sudut pelurus condong ke SMP | **Diteruskan ke guru:** cocokkan dengan kisi-kisi TKA SD |
| TKA T06, S5-11, S5-16: latar keagamaan | **Dipakai apa adanya** (keputusan Acut) |

## Keputusan Acut: latar keagamaan di bahan TKA

Bahan TKA milik Acut memakai latar cerita seperti meunasah, mengaji, salat, Ramadan, dan Teungku. Pada 29 Okt 2026 Acut memutuskan bahan ini **dipakai apa adanya** (`docs/rancangan/keputusan.md` bagian K).

- Penanda `perlu_dicek` dicabut, dan semua butir serta teks kembali dipakai.
- Daftar istilahnya tetap dicatat di `docs/LAPORAN-IMPOR-TKA.md` bagian 8.
- Syarat dari Acut: kata yang berhubungan dengan agama di isi baru ditanyakan dulu sebelum ditulis.

Jam tenang (temuan no. 11) dan istilah Inggris (no. 10) juga sudah diputuskan Acut: dibiarkan seperti sekarang.

## Uji tanpa sinyal

- Semua isi (TKA, Gudang, Inggris, teks Baca Ulang) dibawa di dalam aplikasi (`assets/paket/`). Data tersimpan di HP (expo-sqlite).
- Mode data bawaan `lokal`, jadi aplikasi tidak menghubungi jaringan sama sekali.
- Uji `src/data/__tests__/repositori.test.ts` membuktikan dua hal:
  - Sesi dan jawaban tetap **tersimpan** saat pengiriman gagal karena putus jaringan. Antrean mencoba lagi dengan jeda 1, 2, 5, lalu 15 menit, dan mengirim tanpa ganda setelah tersambung.
  - Tanpa pengirim (mode lokal), antrean tetap tersimpan.
- Skrip tangkapan layar membuka beranda anak dalam keadaan jaringan dimatikan (`setOffline`) tanpa galat.
