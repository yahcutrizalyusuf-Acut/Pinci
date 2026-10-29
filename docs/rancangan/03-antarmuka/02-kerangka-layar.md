# Kerangka Layar Penting

**Ringkas:** (1) Dua puluh layar terpenting digambar sebagai kerangka teks: apa yang tampil, tombol apa saja, apa yang terjadi saat ditekan, dan apa yang dibacakan untuk kelas 1–2. Termasuk layar pertanyaan masukan untuk orang tua (O8) dan ketukan anak (K7). (2) Tiga aturan berlaku di semua layar anak: **satu tugas per layar**, **tombol utama di bawah dalam jangkauan ibu jari**, dan **umpan balik langsung** untuk setiap ketukan (warna + ikon + suara pendek), sebab anak sering mengetuk dua kali kalau tidak yakin ketukannya diterima. (3) Kerangka ini bukan desain warna atau gambar akhir; itu dikerjakan saat purwarupa, mengikuti `03-aturan-tampilan.md`.

Tahap 4, butir 2. Disusun 19 Oktober 2026. Kode layar dari `01-daftar-layar-dan-alur.md`. 🔊 = dibacakan otomatis untuk kelas 1–2 dan bisa diputar ulang di semua kelas.

---

## A3 — Kode dari email

```
┌──────────────────────────────┐
│  ← Kembali                   │
│                              │
│  Masukkan kode dari email    │
│  ayah.aisyah@gmail.com       │
│                              │
│   [ 4 ][ 8 ][ 2 ][ _ ][ _ ][ _ ] │
│                              │
│  Belum masuk? Periksa folder │
│  Spam atau Promosi.          │
│                              │
│  Kirim ulang (0:42)          │
│  Ganti email                 │
└──────────────────────────────┘
```

| Elemen | Saat ditekan / aturan |
|---|---|
| Kotak kode | Papan angka terbuka otomatis; kode dari email bisa ditempel sekali ketuk |
| Kirim ulang | Aktif setelah 60 detik; paling banyak 5 kali per jam |
| Salah 5 kali | "Coba lagi 15 menit lagi" |
| Benar | Lanjut ke A4 Izin data |

---

## A4 — Satu kartu izin

```
┌──────────────────────────────┐
│  Izin 4 dari 6   ● ● ● ○ ○ ○ │
│                              │
│  Rapor cerita dengan         │
│  bantuan AI        (pilihan) │
│                              │
│  Untuk apa: ringkasan minggu │
│  dalam kalimat mudah dibaca  │
│  Data dikirim: angka saja,   │
│  tanpa nama anak             │
│  Ke mana: Anthropic, AS;     │
│  dihapus dalam 30 hari       │
│  Kalau tidak: rapor tetap    │
│  ada dengan angka yang sama  │
│                              │
│  Selengkapnya ›              │
│                              │
│  [   Tidak   ]  [  Setuju  ] │
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Tombol Setuju dan Tidak **sama besar dan sama warna** | Tanpa trik desain yang mendorong persetujuan (parameter EK04) |
| Tidak ada centang yang sudah terisi | Persetujuan harus tindakan nyata (PP 33/2026) |
| Isi kartu mengikuti `02-rancangan/paket-hukum/01-formulir-persetujuan-orang-tua.md` | — |

---

## K3 — Beranda anak

```
┌──────────────────────────────┐
│ 🐘 Aisyah                ⋯ 🔒 │  ← tombol kecil (Mode Dampingi)
│ ┌──────────────────────────┐ │
│ │ 💬 Dari Ayah:            │ │
│ │ "Ayah bangga kamu tidak  │ │
│ │  menyerah di ×8" 🔊      │ │
│ └──────────────────────────┘ │
│  Mau mulai dari mana?   🔊   │
│ ┌────────────┐┌────────────┐ │
│ │  🔢        ││  📖        │ │
│ │  Lancar    ││  Baca Ulang│ │
│ │  Level 3   ││  (R2)      │ │
│ └────────────┘└────────────┘ │
│ ┌────────────┐               │
│ │ ✉ Ajakan   │               │
│ │ dari Ayah  │               │
│ └────────────┘               │
│                              │
│  [🃏 Album]        [💬 Pesan] │
│  ☁ 2 lembar belum terkirim   │  ← hanya kalau ada antrean
└──────────────────────────────┘
```

| Elemen | Isi | Saat ditekan |
|---|---|---|
| Pesan orang tua | Pesan terbaru yang belum dibaca. Pesan siap pakai: 🔊 dibacakan (suara ada di paket). Teks bebas untuk kelas 1–2: ikon "🔊 minta Ayah/Bunda membacakan", sebab tidak ada mesin suara saat aplikasi berjalan | Ketuk = baca semua di K10 |
| Pilihan jalur | 2–4 kartu besar; jalur yang belum tayang tidak ditampilkan | Langsung ke K5 (level baru) atau K6 |
| Ajakan | Muncul hanya kalau ada ajakan hari ini | Membuka kegiatan yang diajak |
| Album, Pesan | Tombol bawah | K9, K10 |
| ☁ antrean | Muncul kalau ada hasil belum terkirim; setelah 24 jam berubah jadi spanduk (`02-rancangan/04` bagian 3) | Penjelasan singkat: "Minta Ayah/Bunda menyalakan internet sebentar" |
| 🔒 kecil | Pojok kanan atas, kecil dan pucat | D1 PIN orang tua |

**Yang tidak ada di K3:** angka rangkaian hari, peringkat, pemberitahuan merah, hitungan mundur, atau tombol beli.

---

## K5 — Layar jurus

```
┌──────────────────────────────┐
│  Jurus baru! Level 4  🔊     │
│                              │
│  Genapkan ke 10 dulu,        │
│  baru tambah sisanya.        │
│                              │
│   8 + 5                      │
│   8 + 2 = 10                 │
│   10 + 3 = 13   ✓            │
│                              │
│   7 + 6                      │
│   7 + 3 = 10                 │
│   10 + 3 = 13   ✓            │
│                              │
│  Ingat: 7 + 7 = 14,          │
│  jadi 7 + 8 = 15             │
│                              │
│  [      Aku siap!       ]    │
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Contoh muncul satu per satu (ketuk untuk langkah berikutnya), lalu semua terlihat | Beban ingatan kecil; anak mengikuti langkah |
| Tidak ada pertanyaan "jelaskan caramu" | Contoh jadi polos (`01-produk/04` bagian 1) |
| Bisa dibuka lagi dari lembar lewat tombol 💡 | Jurus tersedia saat dibutuhkan |
| Saat pertama kali: ketukan A03 "💡 Paham / 🤔 Masih bingung" | `01-produk/08` bagian 4 |

---

## K6 — Lembar Lancar

```
┌──────────────────────────────┐
│ ⏸ Jeda        7 / 20     💡  │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░         │  ← kemajuan, bukan hitungan mundur
│                              │
│                              │
│          7 × 8 = ?           │  ← huruf besar
│                              │
│         [   56   ]           │
│                              │
│  ┌─────┬─────┬─────┐         │
│  │  1  │  2  │  3  │         │
│  ├─────┼─────┼─────┤         │
│  │  4  │  5  │  6  │         │
│  ├─────┼─────┼─────┤         │
│  │  7  │  8  │  9  │         │
│  ├─────┼─────┼─────┤         │
│  │  ⌫  │  0  │  ✓  │         │
│  └─────┴─────┴─────┘         │
└──────────────────────────────┘
```

| Elemen | Aturan |
|---|---|
| Soal | Satu soal per layar; huruf sangat besar; tanda bagi ":" |
| Waktu | **Tidak ditampilkan sebagai jam yang berjalan**; hanya batang kemajuan soal. Waktu dicatat diam-diam dan ditunjukkan di akhir sebagai rekor, supaya tekanan waktu tidak tampak di tengah soal dan anak bersaing dengan rekornya sendiri |
| Papan angka | Tombol besar, rapat ke bawah layar; tombol ✓ paling kanan bawah, dalam jangkauan ibu jari. Papan ketik bawaan HP tidak dipakai, sebab bisa menutupi soal dan berbeda di tiap HP |
| Benar | Kilatan hijau + ✓ + bunyi pendek, langsung soal berikutnya (≤ 0,4 detik) |
| Salah | Kotak bergetar halus + jawaban benar tampil 1,5 detik ("7 × 8 = 56") tanpa kata "salah", lalu lanjut; soal masuk antrean ulang. Koreksi tanpa mempermalukan |
| ⏸ Jeda / tombol kembali Android | K11: soal disembunyikan, waktu berhenti; "Lanjut" / "Lanjut nanti" (`01-produk/04` celah #6) |
| 💡 | Membuka jurus level ini; dicatat di data |
| Ketukan ganda | Ketukan kedua di tempat sama dalam ± 0,3 detik diabaikan, sebab anak sering menekan dua kali **[FAKTA — Anthony dkk., ketukan tertinggal (holdover touches)]**; angka 0,3 detik **[ASUMSI]** |

---

## K7 — Akhir lembar + ketukan perasaan

```
┌──────────────────────────────┐
│        Selesai! 🎉   🔊      │
│                              │
│   19 dari 20 benar           │
│   1 menit 12 detik           │
│   🏅 Rekor baru! (tadi 1:31) │
│                              │
│   Tersimpan ✓  Terkirim ✓✓   │
│                              │
│  Latihan tadi rasanya        │
│  seperti hewan apa?  🔊      │
│  🐦      🦌      🐢      🐘   │
│  terbang lincah  pelan ngantuk│
│                  (lewati ›)  │
│                              │
│  [   Kembali ke beranda   ]  │
└──────────────────────────────┘
```

| Elemen | Aturan |
|---|---|
| Hasil | Benar, waktu, dan **rekor pribadi**; tanpa nilai huruf atau perbandingan dengan anak lain |
| Naik level | Kalimat "Kamu naik ke Level 5!" hanya muncul kalau naik; turun level **tidak diumumkan**, lembar berikutnya saja yang menyesuaikan |
| Tersimpan / Terkirim | Selalu tampil; terkirim ✓✓ menyala saat server menerima |
| Ketukan hewan (A01) | Paling banyak 1 kali sehari; tanpa hadiah; bisa dilewati |
| Kartu kejutan | Kadang muncul sesudah layar ini (K8), tidak pernah dijanjikan sebelumnya |
| Perayaan | ≤ 1,5 detik dan bisa dilewati dengan satu ketuk |

---

## K10 — Pesan dan stiker

```
┌──────────────────────────────┐
│ ← Pesan                      │
│  Ayah, 19.02:                │
│  "Ayah bangga kamu tidak     │
│   menyerah di ×8"   🔊       │
│  Kamu, 19.30: 🏅 Lihat rekorku│
│                              │
│  Kirim ke Ayah/Bunda:        │
│  [🏅 Aku lulus level!] [👀 Lihat rekorku] │
│  [🙋 Bantu aku dong]  [🙏 Terima kasih] │
│  [😴 Aku capek hari ini] [⚔ Ayo Tantang Ayah] │
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Anak hanya memilih stiker; tidak ada papan ketik | Profil risiko rendah; tidak ada info pribadi yang bisa dikirim |
| "Bantu aku dong" menyertakan soal yang macet | Orang tua tahu apa yang harus dibantu |
| Pesan hanya dari dan ke orang tua di keluarga yang sama | Tanpa kontak orang asing |

---

## K14 — Soal TKA dengan kunci berjenjang

```
┌──────────────────────────────┐
│ M03 · Soal 4 dari 8   [Teks] │
│ Pilih semua pecahan yang     │
│ senilai dengan 2/3.          │
│  ☐ A. 4/6                    │
│  ☐ B. 6/9                    │
│  ☐ C. 3/4                    │
│  ☐ D. 4/5                    │
│  ☐ E. 10/15                  │
│                              │
│ [        Periksa        ]    │
├──────────────────────────────┤
│ Belum tepat. Petunjuk:       │  ← setelah salah pertama
│ "Pembilang dan penyebut      │
│  diapakan dengan bilangan    │
│  yang sama?"  [Coba lagi]    │
└──────────────────────────────┘
```

| Bentuk soal | Cara menjawab |
|---|---|
| PG | Satu pilihan (bulatan) |
| PG kompleks | Kotak centang; teks "Pilih **semua** jawaban yang benar" tanpa menyebut jumlah |
| PG kategori | Tabel pernyataan dengan dua tombol Benar / Salah per baris |
| Soal bergrup | Tab **Teks** dan **Soal** di tempat yang sama; posisi gulir teks diingat |

| Langkah | Yang tampil |
|---|---|
| Salah pertama | **Petunjuk** (pertanyaan pancingan) + Coba lagi |
| Salah kedua | **Langkah** penyelesaian; butir masuk antrean ulang 3 hari |
| PG kategori dijawab | Baris yang keliru ditandai, supaya anak melihat "hampir benar" |

---

## K15 — Simulasi TKA

| Bagian | Isi |
|---|---|
| Pengantar | "30 soal · 75 menit · boleh lompat dan menandai ragu"; Mode Latihan (S1–S3, boleh jeda 3 kali) atau Mode Ujian (S4–S5, tanpa jeda); tombol "Minta Ayah/Bunda mengawasi" (membuka D7 di HP yang sama atau HP orang tua) |
| Soal | Seperti K14 tetapi **tanpa umpan balik**; bilah atas: sisa waktu (di simulasi waktu memang ditampilkan, seperti ujian sebenarnya), nomor soal, tombol 🚩 ragu |
| Daftar soal | Kisi 1–30: terjawab, kosong, ragu; ketuk untuk lompat |
| Kumpulkan | Konfirmasi "Masih ada 3 soal kosong. Kumpulkan?" |
| Hasil | Persen benar (dengan keterangan "bukan nilai TKA"), per bentuk soal, penyebab salah B/H/S/W, lalu pembahasan per soal dengan Langkah |

---

## K16–K18 — Baca Ulang (R2)

```
K16 Bacaan dingin                K18 Bacaan panas
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Baca nyaring, ya!   🔊       │ │ Baca sekali lagi! 🔊          │
│                              │ │ (teks yang sama)             │
│ Pukul lima pagi, perahu      │ │ ...                          │
│ merapat di Lampulo. Ikan     │ │                              │
│ tongkol diturunkan ...       │ │ [ Mulai ]      [ Selesai ]   │
│                              │ │                              │
│ [ Mulai ]      [ Selesai ]   │ │ Tadi 62 → sekarang 81        │
│ [ baca dalam hati ]          │ │ kata per menit 🏅            │
└──────────────────────────────┘ │ Pertanyaan 1 dari 2 🔊        │
                                 │ ...                          │
                                 └──────────────────────────────┘
```

| Aturan | Isi |
|---|---|
| Huruf | Lebih besar dari teks biasa; baris pendek; jarak baris lega (`03-aturan-tampilan.md`) |
| K17 Dengar contoh | Suara contoh, kata disorot satu per satu mengikuti suara; tombol ulang |
| Mulai/Selesai | Tombol besar terpisah jauh supaya tidak tertekan bersamaan |
| Terlalu cepat (> 250 kata per menit) | "Coba baca lagi pelan-pelan, ya" — sekali, tanpa nada menegur |
| Kelas 1–2 | Urutan berbeda: dengar dulu → baca bersama suara → baca sendiri (`01-produk/05` bagian 2) |

---

## D3 — Tantang Ayah

| Bagian | Isi | Saat ditekan |
|---|---|---|
| Pilih soal | Anak memilih level yang **sudah lulus**; aplikasi menyiapkan 10 soal | "Mulai tantangan" |
| Giliran | Layar dibagi: nama anak dan "Ayah" bergantian; papan angka sama | Jawaban dicatat per pemain |
| Hasil | "Aisyah 10 benar, 41 detik · Ayah 9 benar, 58 detik" + kalimat untuk orang tua: "Tanyakan jurus apa yang ia pakai" | Selesai → D2 |
| Data | Hanya hasil anak yang disimpan (mode dampingi, tidak dihitung naik level); hasil orang tua tidak disimpan | — |

---

## D4 — Lembar didampingi

| Elemen | Isi |
|---|---|
| Naskah atas | "Biarkan ia mencoba dulu. Kalau diam lebih dari 5 detik, ketuk 💬 dan ucapkan petunjuknya." |
| Soal + kunci kecil | Kunci tampil kecil di pojok, hanya terlihat orang tua yang duduk di samping |
| 💬 Petunjuk untuk diucapkan | Satu kalimat pancingan dari jurus, bukan jawaban |
| ⚑ Laporkan soal | D5: "Soal ini salah / membingungkan / terlalu sulit" + catatan opsional → Meja Periksa |

---

## D6 — Dengar Bacaan (R2)

```
┌──────────────────────────────┐
│ Naskah: jangan memotong.     │
│ Ketuk kata yang salah atau   │
│ macet > 3 detik.             │
│                              │
│ Pukul lima pagi, [perahu]    │  ← kata yang diketuk ditandai
│ merapat di Lampulo. Ikan     │
│ tongkol diturunkan ...       │
│                              │
│ [ Mulai ]          [Selesai] │
│                              │
│ Hasil: 74 kata benar/menit   │
│ Sering tersandung: perahu    │
│ Puji satu hal yang ia        │
│ lakukan dengan baik.         │
└──────────────────────────────┘
```

Tanpa rekaman suara; hanya waktu dan kata yang diketuk disimpan.

---

## O1 — Beranda kabar (orang tua)

```
┌──────────────────────────────┐
│ Kabar                    ⚙   │
│ ┌──────────────────────────┐ │
│ │ 🐘 Aisyah · Kelas 4      │ │
│ │ Hari ini: 2 lembar ✓     │ │
│ │ Rekor baru di ×7: 1:12   │ │
│ │ Langkah berikutnya:      │ │
│ │ ×8 dikenalkan minggu ini │ │
│ │ [Kirim semangat] [Rapor] │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ 🐯 Rafli · Kelas 6       │ │
│ │ Belum latihan hari ini   │ │
│ │ HP terakhir terhubung    │ │
│ │ 2 hari lalu · 4 lembar   │ │
│ │ menunggu di HP           │ │
│ │ [Ajak latihan] [Rapor]   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ 💭 1 pertanyaan, 30 detik │ │
│ │ [Jawab]   [Nanti]        │ │
│ └──────────────────────────┘ │
│ Kabar · Rapor · Bimbingan · Atur│
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Satu kartu per anak dengan **satu langkah berikutnya** | Pesan positif + langkah berikutnya **[FAKTA — EEF]** |
| "Belum latihan" ditulis netral, dengan tombol ajakan, tanpa warna merah | Mencegah orang tua mengontrol |
| Kartu pertanyaan hanya saat ada putaran; bisa ditunda | `01-produk/08` bagian 5 |
| Tidak ada daftar soal salah di beranda | `01-produk/07` 2.3 |
| **28 Okt:** beranda bergaya daftar obrolan WhatsApp; pesan pindah ke Ruang anak, tab ketiga menjadi Bimbingan | Brief desain Pintar Main bagian 4 dan 6 |

---

## O2 — Rapor anak (mingguan)

| Bagian | Isi |
|---|---|
| Tiga angka | Hari latihan · detik per soal · % benar, dengan panah dibanding minggu lalu dan minggu pertama |
| Grafik kecil | Kecepatan 8 minggu (garis sederhana) |
| Kalimat kemajuan | Satu kalimat (rapor cerita AI bertanda, atau kalimat cetakan) |
| Langkah berikutnya | Satu kalimat |
| Cara membantu tanpa mengambil alih | Satu kalimat + "Lihat panduan" (O15) |
| Dimulai sendiri | "4 dari 9 latihan dimulai Aisyah sendiri" |
| Tombol | Rincian (O3) · Kirim ke WhatsApp (gambar atau link) · **"Level terasa tidak pas?"** → pilihan "terlalu mudah / terlalu sulit" → dicatat dan dipakai penjaga mesin |

---

## O5 — Kirim semangat

| Elemen | Isi |
|---|---|
| Pesan siap pakai | 6–8 pilihan yang disesuaikan dengan kejadian minggu ini (misal sesudah rekor: "Wah, rekor baru! Ayah bangga.") — menonjolkan usaha |
| Teks sendiri | ≤ 60 huruf; link dan nomor HP ditolak |
| Kirim | Pesan tampil di K3 saat anak membuka aplikasi; tanpa sinyal → "akan terkirim" |

---

## O8 — Pertanyaan masukan (orang tua)

```
┌──────────────────────────────┐
│ 💭 Satu pertanyaan           │
│                              │
│ Dibanding 2 minggu lalu,     │
│ cara Aisyah menghitung …     │
│                              │
│ ( ) Lebih cepat              │
│ ( ) Sama                     │
│ ( ) Lebih lambat             │
│ ( ) Belum terlihat           │
│                              │
│ [        Kirim        ]      │
├──────────────────────────────┤  ← setelah dikirim
│ Terima kasih! Jawaban ini    │
│ kami pakai untuk memeriksa   │
│ apakah rapor menunjukkan     │
│ kemajuan dengan jelas.       │
│ Mau 2 pertanyaan lagi?       │
│ (± 30 detik)                 │
│ [ Boleh ]      [ Cukup ]     │
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Satu pertanyaan dulu; dua lagi hanya kalau orang tua mau | Tanggapan terbaik dengan 1 pertanyaan **[FAKTA — Refiner]** |
| Setelah menjawab: satu kalimat "apa yang kami lakukan dengan jawaban ini" | Menutup lingkaran |
| Pilihan jujur ("Belum terlihat") selalu ada | Tidak mendorong jawaban menyenangkan |
| Isian terbuka di akhir, boleh dilewati, + "kirim pesan suara ke WhatsApp" | `01-produk/08` bagian 3 |
| **Tidak ada fitur yang terkunci** kalau tidak menjawab | Keputusan Acut 19 Okt (pilihan B) |

---

## O10 — Pengaturan (bagian anak)

| Pengaturan | Pilihan | Bawaan |
|---|---|---|
| Batas game per hari (R4) | 0–60 menit | Kelas 1–2: 20 · kelas 3–6: 30 (diubah 28 Okt, `01-produk/10` bagian 5.2) |
| Game setelah inti harian (R4) | Ya / Tidak (selalu terbuka) | **Ya** (diubah Acut 28 Okt; dulu Tidak) |
| Jam tenang | Jam mulai–selesai | 21.00–05.00 |
| Pengingat untuk orang tua | Jam | Mengikuti jawaban O14 |
| PIN anak | Pasang / hapus | Tidak dipasang |
| **Mode Ramadan** | Ya / Tidak | Tidak; kalau Ya: lembar Lancar 10 soal, target hari latihan per minggu diturunkan untuk rapor, pengingat digeser ke jam yang dipilih (misal setelah berbuka) **[ASUMSI — diuji Februari 2027]**. Aturan lembar 10 soal (ditambah 20 Okt): soal disusun 7 level ini + 3 level lama; **target waktu = jumlah target 10 soal itu**; "tepat" = salah ≤ 1 dan di bawah target; dua lembar 10 soal tepat dihitung sama dengan **satu** lembar 20 soal tepat (jadi naik level butuh empat); "kilat" tidak berlaku; turun level kalau salah ≥ 3. **Tes tetap tidak dikerjakan di Mode Ramadan**, digeser ke minggu sesudah Idulfitri |
| Suara | Petunjuk bersuara ya/tidak, efek suara ya/tidak | Kelas 1–2: petunjuk ya; semua: efek ya |

---

## L1 — Halaman rapor lewat link

```
┌──────────────────────────────┐
│ Pintar Main                  │
│ Rapor 🐘 Aisyah · minggu ini │
│ Data sampai Senin 19.40      │
│                              │
│ 5 hari latihan · 3,4 detik/  │
│ soal (↓ dari 5,1) · 96% benar│
│ Kemajuan: ×6 dan ×7 makin    │
│ lancar.                      │
│ Langkah berikutnya: ×8.      │
│ Cara membantu: tanyakan      │
│ "jurus apa yang cocok?"      │
│                              │
│ 💭 Satu pertanyaan (30 detik)│
│ ...                          │
│ Ingin mengirim semangat?     │
│ Pasang aplikasinya ›         │
│ Link ini hanya untuk keluarga│
└──────────────────────────────┘
```

| Aturan | Sebab |
|---|---|
| Tanpa nama lengkap, foto, sekolah | Data minimal |
| Halaman diberi tanda "jangan diindeks mesin pencari" | Parameter KK05 |
| Ringan (< 100 KB), terbaca di HP murah dan sinyal lemah | Orang tua [L] |

---

## Keadaan khusus yang berlaku di semua layar

| Keadaan | Yang tampil |
|---|---|
| Tanpa sinyal (mode anak) | Tidak ada pesan apa pun; semua latihan jalan. Ikon ☁ kecil kalau ada antrean |
| Tanpa sinyal (mode orang tua) | Pita tipis "Tanpa internet — data sampai …" |
| Paket isi belum terunduh | "Isi sedang disiapkan" + kemajuan unduhan. Tes penempatan dan lembar Lancar tetap bisa, sebab **salinan bawaan paket `lancar-k1`–`k6` (< 2 MB per kelas) ikut di dalam aplikasi**; paket yang lebih baru menggantikannya saat terunduh |
| Kesalahan aplikasi | Bahasa biasa: "Ada masalah. Hasil latihan aman tersimpan di HP." + tombol "Laporkan" (O16) |
| Jam tenang (game) | "Sekarang jam istirahat. Sampai besok!" |
