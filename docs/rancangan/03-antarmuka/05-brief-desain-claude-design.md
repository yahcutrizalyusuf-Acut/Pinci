# Brief Desain — Pintar Main

> Untuk Claude Design. Lampirkan berkas ini, lalu ketik: **"Kerjakan Tahap 1 dulu."** Setelah Tahap 1 disetujui, lanjut dengan "Kerjakan Tahap 2", dan seterusnya.
>
> **Diperbarui 29 Oktober 2026:** Tahap 3 bertambah 4 layar (nomor 10–13: Peta Perjalanan, Cerita Ulang, Ucapkan ke Bunda, Hari Pamer), dan Pinci menyapa anak dengan namanya. Kalau Tahap 1 dan 2 sudah selesai, sistem desainnya tidak perlu diulang. Cukup ketik: **"Kerjakan Tahap 3 dengan sistem desain yang sudah ada."**

Pintar Main adalah aplikasi Android belajar untuk anak SD kelas 1–6 (Matematika, Bahasa Indonesia, Bahasa Inggris, Persiapan TKA kelas 6) dengan maskot **Pinci, Si Kancil Pintar**. Aplikasi punya dua mode di satu HP: **mode anak** dan **mode orang tua**. Disusun 28 Oktober 2026.

---

## Cara kerja untuk Claude Design

1. Kerjakan **satu tahap per permintaan**, urut dari Tahap 1 sampai Tahap 4.
2. Semua layar memakai **bingkai HP Android 360 × 800 dp**, tema terang.
3. Tahap 1 disimpan sebagai **sistem desain**, lalu Tahap 2–4 memakai komponen yang sama.
4. Aturan di bagian "Wajib" dan "Dilarang" berlaku di **semua tahap**.

---

## Arah desain

**Seakrab WhatsApp, seceria hutan Pinci.**

- **Mode orang tua** terasa seperti kotak obrolan keluarga yang tenang: tab di bawah, daftar obrolan dengan avatar bulat, gelembung pesan, tombol bulat mengambang, centang terkirim. Bersih, latar abu terang, huruf Nunito.
- **Mode anak** terasa seperti taman bermain di hutan tropis Indonesia yang rapi: latar krem, kartu besar berwarna, sudut membulat, Pinci menyapa. Tombol besar untuk jari anak.
- Yang ditiru dari WhatsApp hanya **cara kerjanya**. **Jangan** memakai logo, ikon, atau warna hijau khas WhatsApp.

| Prinsip | Wujud di layar |
|---|---|
| Satu layar, satu tugas | Satu soal per layar, satu tombol utama per layar |
| Lega | Banyak ruang kosong, paling banyak 4 pilihan per layar |
| Hangat | Latar krem, sudut membulat, ilustrasi hutan flat 2D |
| Tenang di layar soal | Tanpa hiasan bergerak; perayaan hanya di layar akhir, ≤ 1,5 detik |
| Ringan | Ilustrasi vektor sederhana, tanpa video, cocok untuk HP murah |
| Ramah semua kelas | Kelas 1–2: ikon besar + tombol suara 🔊, sedikit tulisan. Kelas 3–6: tulisan + ikon |

---

## Warna

**WAJIB: teks di atas tombol Hijau Daun dan Oranye Jeruk berwarna Biru Tinta #2D3142, bukan putih** (teks putih di atas kedua warna itu tidak terbaca).

| Peran | Nama | Hex | Dipakai untuk |
|---|---|---|---|
| Primer | Hijau Daun | #3BB273 | Tombol utama, tab aktif, Gudang Ilmu |
| Teks hijau | Hijau Tua | #1F7A4D | Judul hijau, tautan, tombol mengambang (ikon putih) |
| Sekunder | Oranye Jeruk | #FF9F1C | Mode Dampingi, tombol Waktu main, aksen |
| Teks | Biru Tinta | #2D3142 | Semua teks dan angka soal |
| Latar anak | Krem Lembut | #FFF6E5 | Latar mode anak |
| Latar orang tua | Abu Terang | #F5F7FA | Latar mode orang tua, kartu putih di atasnya |
| Benar | Hijau Segar | #2E9E5B | Kilatan dan tanda ✓, selalu bersama simbol |
| Perhatian | Koral Lembut | #FF6B6B | Kotak bergetar saat jawaban belum tepat |
| Info | Biru Langit | #4EA8DE | Kotak petunjuk (teks Biru Tinta) |
| Maskot | Cokelat Kancil | #A0673A | Tubuh Pinci saja |

**Warna mata pelajaran** (untuk pita, ikon, dan latar kartu yang dimudakan; bukan untuk teks kecil):

| Bagian | Warna | Hex | Latar kartu |
|---|---|---|---|
| Matematika | Biru Laut | #3A86FF | #E6F0FF |
| Bahasa Indonesia | Merah Bata | #E85D5D | #FDECEC |
| Bahasa Inggris | Ungu Anggur | #8E6CCF | #F1ECFA |
| Mode Dampingi | Oranye Jeruk | #FF9F1C | #FFF0D9 |
| Gudang Ilmu | Hijau Daun | #3BB273 | #E4F4EB |
| Siap TKA | Warna mapel soalnya + lencana "TKA" | — | — |

---

## Huruf

| Unsur | Huruf | Kelas 1–2 | Kelas 3–4 | Kelas 5–6 | Orang tua |
|---|---|---|---|---|---|
| Logo, judul layar | Baloo 2 Bold/ExtraBold | 28sp | 26sp | 24sp | 22sp |
| Soal hitung | Andika | 44sp | 40sp | 36sp | — |
| Teks bacaan | Andika | 26sp | 22sp | 20sp | — |
| Petunjuk dan label | Andika | 20sp | 18sp | 16sp | — |
| Isi mode orang tua | Nunito Regular/SemiBold | — | — | — | 16sp; nama 17sp tebal; jam 13sp |

---

## Bentuk, jarak, ikon

| Unsur | Aturan |
|---|---|
| Kisi jarak | Kelipatan 8dp; tepi layar 16dp |
| Sudut | Tombol dan kartu 16dp; kartu besar mode anak 24dp; tombol mengambang dan stiker bulat penuh |
| Bayangan | Satu tingkat, lembut (elevasi 2dp) |
| Ilustrasi | Flat 2D, garis tepi cokelat tua tebal dan lembut, bentuk membulat |
| Ikon | Garis membulat 2dp, selalu bersama kata |
| Avatar anak | Lingkaran berisi hewan (gajah, harimau, penyu, rangkong) di atas warna lembut |
| Latar ilustrasi | Hutan tropis Indonesia: pohon, sungai, bunga, rumah panggung gampong; hanya di beranda, layar akhir, dan game |

---

## Tombol dan komponen

| Komponen | Kelas 1–2 | Kelas 3–6 | Orang tua | Bentuk |
|---|---|---|---|---|
| Tombol utama | Tinggi ≥ 72dp, selebar layar | ≥ 64dp, selebar layar | ≥ 48dp | Hijau Daun, teks Biru Tinta tebal, di bawah layar |
| Tombol kedua | ≥ 56dp | ≥ 48dp | ≥ 40dp | Tanpa isi, garis tepi tipis |
| Papan angka 3 × 4 | ≥ 72 × 64dp per tombol | ≥ 64 × 56dp | — | Kotak putih besar, ✓ di kanan bawah |
| Kartu pilihan | ≥ 64dp | ≥ 56dp | ≥ 48dp | Latar warna mapel dimudakan, ikon besar di kiri |
| Jarak antartombol | ≥ 12dp | ≥ 8dp | ≥ 8dp | — |
| Tab bawah | 72dp, ikon 32dp | 64dp, ikon 28dp | 64dp, ikon 24dp | Tab aktif: ikon terisi + kapsul hijau muda |
| Stiker anak | ≥ 72dp | ≥ 64dp | — | Lingkaran besar, emoji + kata |
| Tombol mengambang | — | — | 56dp | Lingkaran Hijau Tua, ikon putih, kanan bawah |

**Keadaan tombol:** biasa · ditekan (mengecil 96% + lebih gelap) · nonaktif (abu, tetap terbaca) · memuat (titik bergerak di dalam tombol).

**Komponen lain:** kartu anak (avatar, nama, kelas, kabar hari ini, satu langkah berikutnya, dua tombol) · gelembung pesan kiri dan kanan · gelembung kartu hasil · batang kemajuan soal (bukan jam) · kotak petunjuk dengan 🔊 · lencana "Segera" (abu), "Baru" (oranye), "TKA" · tanda bimbingan hijau, kuning, merah (mode orang tua) · pita "Tanpa internet — data sampai 19.40" (mode orang tua) · ikon awan kecil (mode anak).

---

## Pinci, Si Kancil Pintar

| Bagian | Isi |
|---|---|
| Bentuk | Kancil mungil gaya chibi, kepala besar |
| Warna | Cokelat #A0673A, perut dan dada krem, bintik putih di punggung |
| Mata dan telinga | Mata besar bulat berbinar; telinga besar yang ekspresif |
| Aksesori tetap | Ransel kecil oranye, syal hijau |
| Lima ekspresi | Senang · Semangat · Berpikir · Empati · Merayakan |
| Sifat | Penasaran, cerdik tetapi jujur, ceria, sabar; memberi petunjuk, bukan jawaban. Bicara seperti kakak yang hangat: menyapa dengan nama anak ("Halo, Rani!"), ingat kejadian kemarin ("Kemarin kamu lulus Level 3!"), mengakui yang sulit ("×8 memang licin") |
| Tiga ukuran | Penuh (beranda, layar akhir) · sedang (jurus, ajakan) · kecil dan diam (pojok layar soal) |

Logo: tulisan "Pintar Main" dengan Baloo 2 ExtraBold, "Pintar" Hijau Tua dan "Main" oranye, dengan kepala Pinci kecil. Ikon aplikasi: kepala Pinci tersenyum di atas latar Hijau Daun, tanpa teks.

---

## Menu: empat tab di bawah, seperti WhatsApp

**Mode anak** (latar krem): **Belajar · Gudang Ilmu · Main · Pesan**

| Tab | Isi |
|---|---|
| Belajar (beranda) | Sapaan Pinci, pesan terbaru dari orang tua dengan 🔊, 2–4 kartu jalur hari ini (Lancar Matematika, Baca Ulang, Bahasa Inggris, TKA untuk kelas 6), gembok kecil pucat di pojok kanan atas untuk mode orang tua |
| Gudang Ilmu | Peta topik berbentuk jalan setapak di hutan, per mapel; status belum · belajar · kuasai · segera |
| Main | Album kartu satwa, lemari aksesori Pinci, dan (mulai Juni 2027) Waktu main + 4 game. Terbuka setelah latihan hari ini |
| Pesan | Gelembung pesan orang tua + stiker balasan anak. **Tanpa papan ketik** |

**Mode orang tua** (latar abu terang, Nunito): **Kabar · Rapor · Bimbingan · Atur**

| Tab | Isi |
|---|---|
| Kabar (beranda) | Daftar seperti obrolan WhatsApp, satu baris per anak. Ketuk anak → **Ruang anak**: linimasa kartu hasil, pesan, dan stiker, dengan kolom ketik di bawah |
| Rapor | Rapor mingguan per anak, rapor TKA, **Peta Perjalanan** per paket, kirim rapor atau peta ke WhatsApp |
| Bimbingan | Topik bertanda kuning (perlu bimbingan orang tua) dan merah (perlu bimbingan guru), Mulai Dampingi (termasuk Cerita Ulang dan Ucapkan ke Bunda), kartu Tips Ayah Bunda, Kelola guru |
| Atur | Anak dan profil, HP terhubung, PIN, pengaturan waktu, izin data |

---

## Wajib di semua tahap

- Teks di tombol hijau dan oranye berwarna **Biru Tinta**, bukan putih.
- Anak sampai ke soal pertama dalam **≤ 2 ketukan** dari beranda.
- Tombol anak **minimal 64dp**.
- Layar soal **tanpa jam berjalan dan tanpa hiasan bergerak**; yang ada hanya batang kemajuan.
- Jawaban belum tepat: kotak bergetar halus + jawaban benar tampil, **tanpa kata "salah"**.
- Kalimat pendek, bahasa sehari-hari, tanpa istilah Inggris (kecuali isi pelajaran Bahasa Inggris).

## Dilarang di semua tahap

- Poin, koin, permata, toko, atau "kumpulkan untuk membuka".
- Nilai 1–3 bintang, peringkat, papan juara, "siapa paling cepat". (Bintang hanya boleh sebagai tanda selesai.)
- Rangkaian hari beruntun (api, "7 hari berturut-turut").
- Hitung mundur di layar soal dan di dalam game.
- Kata "Salah!" atau "Gagal", tanda silang merah besar, wajah sedih di setiap soal.
- Lencana angka merah atau notifikasi di mode anak (cukup titik lembut).
- Iklan, tombol beli, harga, ajakan berlangganan di mode anak.
- Papan ketik, foto, atau kolom bebas di mode anak.
- Logo, ikon, atau warna khas WhatsApp.
- Slogan "Belajar dulu, main kemudian!" di layar anak (slogan itu hanya untuk orang tua dan Play Store; di layar anak pakai "Pintar itu seru!").

---

## TAHAP 1 — Sistem desain

Buat satu halaman sistem desain Pintar Main berisi:

1. Palet warna dan warna mata pelajaran (bagian Warna), dengan contoh tombol hijau dan oranye bertuliskan Biru Tinta.
2. Contoh huruf: Baloo 2 (judul), Andika (soal dan bacaan), Nunito (orang tua) pada ukuran di bagian Huruf.
3. Semua komponen di bagian Tombol dan komponen, lengkap dengan keadaannya (biasa, ditekan, nonaktif, memuat).
4. Tab bawah mode anak dan mode orang tua.
5. Gelembung pesan kiri/kanan, gelembung kartu hasil, stiker bulat.
6. Pinci dengan 5 ekspresi dan 3 ukuran.
7. Logo dan ikon aplikasi.

Simpan hasilnya sebagai sistem desain supaya Tahap 2–4 memakainya.

---

## TAHAP 2 — 12 layar inti (gelombang 1)

**Mode anak** (latar krem, tab bawah: Belajar, Gudang Ilmu, Main, Pesan):

1. **Selamat datang**: Pinci melambai, dua pilihan besar "Saya orang tua" dan "Ini HP anak".
2. **Pilih profil**: 3 avatar hewan besar — gajah "Aisyah", harimau "Rafli", penyu "Nisa".
3. **Beranda Belajar**: Pinci menyapa "Halo, Aisyah! Yuk, kita cari tahu hari ini." Gelembung pesan "Dari Ayah: Ayah bangga kamu tidak menyerah di ×8" dengan 🔊. Tiga kartu jalur besar: Lancar Matematika (Level 3), Baca Ulang, Bahasa Inggris. Gembok kecil pucat di pojok kanan atas.
4. **Jurus**: Pinci ukuran sedang, "Pinci punya jurus: genapkan ke 10 dulu." Contoh: 8 + 5 → 8 + 2 = 10 → 10 + 3 = 13. Tombol "Aku siap!".
5. **Lembar Lancar**: soal "7 × 8 = ?" sangat besar di tengah, kotak jawaban, batang kemajuan "7 / 20" di atas (bukan jam), papan angka besar di bawah, tombol ⏸ Jeda dan 💡 kecil di atas. Pinci kecil diam. Tanpa hiasan bergerak.
6. **Akhir lembar**: "Selesai!", "19 dari 20 benar", "1 menit 12 detik", "Rekor baru! (tadi 1:31)", "Tersimpan ✓ Terkirim ✓✓", pertanyaan "Latihan tadi rasanya seperti hewan apa?" dengan 4 hewan (burung terbang, rusa lincah, penyu pelan, gajah ngantuk), satu tombol "Kembali ke beranda".
7. **Istirahat**: Pinci minum air, "Istirahat 2 menit, minum dulu." Buat juga versi "Cukup belajar hari ini" dengan Pinci melambai.
8. **Pesan**: gelembung pesan Ayah (kiri, dengan 🔊), 6 stiker besar di bawah: Aku lulus level · Lihat rekorku · Bantu aku dong · Terima kasih · Aku capek hari ini · Ayo Tantang Ayah. Tanpa papan ketik.

**Mode orang tua** (latar abu terang, Nunito, tab bawah: Kabar, Rapor, Bimbingan, Atur):

9. **Kabar**: daftar seperti obrolan WhatsApp. Baris 1: avatar gajah, "Aisyah · Kelas 4", "2 lembar hari ini · rekor baru di ×7", "19.40", lencana. Baris 2: avatar harimau, "Rafli · Kelas 6", "Belum latihan hari ini" (ditulis netral, tanpa merah). Kartu "1 pertanyaan, 30 detik" dengan tombol Jawab dan Nanti. Tombol mengambang "Kirim semangat".
10. **Ruang anak (Aisyah)**: linimasa seperti obrolan — kartu hasil lembar (gelembung khusus dengan angka dan rekor), pesan Ayah di kanan, stiker anak "Lihat rekorku" di kiri. Di bawah: baris pesan siap pakai ("Wah, rekor baru! Ayah bangga.") dan kolom ketik.
11. **Rapor mingguan**: tiga angka besar — "5 hari latihan", "3,4 detik per soal (turun dari 5,1)", "96% benar" — dengan panah. Grafik garis kecepatan 8 minggu. Satu kalimat kemajuan, satu langkah berikutnya, satu cara membantu. Tombol "Kirim ke WhatsApp".
12. **Pengaturan waktu**: batas belajar per hari (kelas 4: 40 menit), penggeser waktu game 0–60 menit (bawaan 30), pilihan "Game setelah latihan hari ini" atau "Selalu terbuka", jam tenang mulai 21.00.

---

## TAHAP 3 — Layar isi lain (gelombang 2)

**Mode anak** (latar krem):

1. **Gudang Ilmu**: peta jalan setapak di hutan, tab Matematika (biru) dan Bahasa Indonesia (merah bata); tiap topik berupa batu loncatan berlabel belum / belajar / kuasai / segera.
2. **Kartu ilmu "Pecahan Senilai"**: penjelasan bergambar dengan 🔊 → 2 contoh jadi langkah demi langkah → latihan dari mudah ke sulit.
3. **Baca Ulang**: teks besar huruf Andika, kata disorot mengikuti suara, tombol "Mulai" dan "Selesai".
4. **Belajar Bahasa Inggris — pilih tingkat**: empat kartu ungu (Tingkat 3, 4, 5, 6) dengan saran "Pinci menyarankan Tingkat 3". Semua tingkat bisa dipilih.
5. **Unit Bahasa Inggris**: kenal kata bergambar (cat, dog, bird) dengan 🔊, lalu "dengar lalu pilih gambar".
6. **Siap TKA (kelas 6)**: soal pilihan ganda dengan lencana TKA dan tombol petunjuk bertahap.
7. **Mode Dampingi**: bingkai oranye tanda "sedang didampingi Ayah/Bunda", naskah untuk diucapkan orang tua di atas soal.

**Mode orang tua** (latar abu terang):

8. **Bimbingan**: daftar topik bertanda kuning ("perlu bimbingan orang tua") dan merah ("perlu bimbingan guru") dengan alasan singkat, tombol "Mulai Dampingi" dan "Minta bantuan guru".
9. **Kelola guru**: undang guru lewat email, pilih jenis "Guru sekolah (lihat + komentar)" atau "Guru les (tugas + catatan)", tombol Izinkan dan Cabut.
10. **Peta Perjalanan (Aisyah, Lancar Matematika)**: jalan berliku di hutan dengan 6 titik level. Level 1–2 berwarna Hijau Daun (sudah lulus), Pinci berdiri di Level 3 ("sekarang di sini"), Level 4–6 abu muda. Tiap titik punya satu kalimat isi level (misal "Level 3: tambah sampai 20, genapkan ke 10"). Di atas ada tab paket (Lancar · Baca Ulang · Bahasa Inggris · TKA), di bawah tombol "Kirim ke WhatsApp". Gambar yang dikirim hanya memuat nama panggilan dan hewan profil.

**Mode Dampingi** (bingkai oranye, naskah untuk orang tua di atas):

11. **Cerita Ulang**: setelah Baca Ulang, layar berkata "Minta Rani menceritakan isi bacaan tadi, 1 menit." Ada pengatur waktu 1 menit yang tenang (bukan hitung mundur merah), lalu 3 kotak centang besar untuk orang tua: **Tokoh** · **Kejadian** · **Akhir cerita**, dan tombol "Selesai". Tanpa rekaman suara.
12. **Ucapkan ke Bunda (Bahasa Inggris)**: 5 kartu kata bergambar berurutan (cat, dog, bird, fish, book), masing-masing dengan tombol 🔊 sebagai contoh. Anak mengucapkan, orang tua menekan **"Jelas"** (hijau) atau **"Coba lagi"** (garis tepi). Di akhir: "4 dari 5 jelas — hebat!" Tanpa rekaman suara.

**Mode anak** (latar krem):

13. **Hari Pamer**: ajakan akhir bulan dengan Pinci memegang panggung kecil dari kayu: "Hari Pamer! Mau tunjukkan apa ke keluarga?" Tiga kartu pilihan besar: Hitung cepat 10 soal · Bacakan teks favorit · 5 kata Bahasa Inggris. Setelah tampil, orang tua mengetuk "Sudah ditonton 👏", lalu kartu kenangan bergambar panggung masuk album. Tanpa nilai, tanpa bintang.

---

## TAHAP 4 — Waktu main dan game

Game harus **nyaman, tidak kaku, dan menyenangkan**. Gaya flat 2D hutan tropis Indonesia yang ceria.

**Aturan rasa game:**

| # | Aturan | Wujud |
|---|---|---|
| 1 | Tidak ada kalah | Tanpa nyawa, tanpa "game over", tanpa skor merah. Jawaban belum tepat membuat benda memantul kembali; setelah 2 kali, Pinci memberi petunjuk |
| 2 | Tidak ada tekanan waktu di dalam babak | Tanpa hitung mundur |
| 3 | Empuk dan hidup | Setiap ketukan dijawab dalam ± 0,1 detik: benda membal sedikit, kelopak bunga kecil beterbangan, bunyi "plop" pendek. Gerak 200–400 milidetik, melambat di akhir seperti pegas |
| 4 | Satu jari | Kelas 1–2 hanya ketuk. Kelas 3–6 boleh seret, dengan magnet: benda menempel sendiri kalau dilepas dekat tempatnya |
| 5 | Babak pendek | 2–4 menit, diakhiri pesta kecil ≤ 1,5 detik, lalu pilihan "Main lagi" atau "Ganti game" |
| 6 | Anak memilih | 4 game, 2 tingkat: Santai dan Seru |
| 7 | Kejutan lucu, bukan hadiah | Kadang rangkong lewat, Pinci bersin, ikan melompat. Tidak bisa dikumpulkan |
| 8 | Waktu terlihat tanpa menakut-nakuti | Sisa waktu main berupa **matahari kecil** yang bergerak pelan di pojok atas; dua menit terakhir langit jingga senja. Tanpa kedip merah atau alarm |
| 9 | Berhenti dengan lembut | Babak yang berjalan diselesaikan dulu, lalu langit malam dan Pinci menguap |

**Layar yang dibuat:**

1. **Waktu main**: peta Gampong dari atas dengan 4 tempat yang bisa diketuk — warung (Pasar Gampong), lapangan (Ular Tangga), bengkel kayu (Susun Kubus), pondok baca (Tebak Kata). Pinci di tengah, matahari kecil di pojok.
2. **Pilih tingkat**: dua kartu besar "Santai" dan "Seru".
3. **Pasar Gampong**: warung kayu, pembeli rusa tersenyum minta 2 pisang, harga Rp3.000, koin dan uang kertas **bergaya sederhana (bukan tiruan uang Rupiah asli)** untuk diketuk; totalnya tampil sambil dihitung.
4. **Ular Tangga Lurus 1–100**: papan 10 × 10 dengan angka berurutan kiri ke kanan di setiap baris, **sulur pohon yang ramah** sebagai ganti ular, dadu besar, avatar anak dan Pinci.
5. **Susun Kubus**: petak kayu, kubus kayu, kartu "tampak depan" yang harus dicocokkan, tombol urung besar; bagian yang belum cocok bergaris putus-putus (bukan tanda silang).
6. **Tebak Kata**: gambar baju dengan 🔊, tiga pilihan suku kata besar (ba · ju · bu).
7. **Akhir babak**: pesta kecil kelopak bunga, tombol "Main lagi" dan "Ganti game".
8. **Waktu habis**: langit malam berbintang, Pinci menguap, "Waktunya selesai main. Sampai besok, ya!", satu tombol "Kembali ke beranda".
