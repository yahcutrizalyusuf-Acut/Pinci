"""Perubahan non-waktu dari bantahan guru SD (#5, #6, #7, #8, #10). 17 Sep 2026."""
import glob, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
gagal = 0


def g(pola, lama, baru, regex=False):
    global gagal
    p = glob.glob(pola)[0]
    s = open(p, encoding="utf-8").read()
    if regex:
        t, n = re.subn(lama, baru, s, count=1, flags=re.M | re.S)
    else:
        n = s.count(lama)
        t = s.replace(lama, baru)
    if n != 1:
        print(f"GAGAL ({n}×) {os.path.basename(p)}: {lama[:70]!r}")
        gagal += 1
        return
    open(p, "w", encoding="utf-8").write(t)


M02 = "01-modul-matematika/M02-*.md"

# ------------------------------------------------ #7 bahan papan dicetak/ditempel (M02)
g(M02, "- **Kartu berburu kesalahan** (Halaman 4, Membongkar salah paham 1) sudah ditulis di kertas besar atau di sudut papan, ditutup.",
  "- **Kartu berburu kesalahan** (Halaman 4, Membongkar salah paham 1) sudah ditulis dengan spidol besar di **kertas A4 atau karton**, ditempel di dinding dekat papan, ditutup kertas. **Jangan ditulis di papan** — papan dipakai untuk kuis dan contoh jadi.")
g(M02, "- Tulis di sudut kanan atas papan, **biarkan terlihat sepanjang pertemuan**:",
  "- Kotak di bawah ini ditulis dengan spidol besar di **kertas A4 atau karton**, lalu **ditempel di dinding di samping papan**, terlihat sepanjang pertemuan. Kertas ini dipakai ulang di M03 dan pertemuan lain yang memakai KPK/FPB:")
g(M02, "- 8 papan jawaban, 8 spidol, 8 penghapus.",
  "- 8 papan jawaban, 8 spidol, 8 penghapus.\n- **Kartu fakta perkalian** (`06-siap-pakai/kartu-fakta-perkalian.pdf`) untuk anak yang skor tes awal Matematikanya 7–11. Diletakkan di meja anak itu sebelum kelas, tanpa diumumkan.")
g(M02, "Tunjuk kotak KPK/FPB di sudut papan", "Tunjuk kertas kotak KPK/FPB di dinding")
g(M02, "Hapus papan kecuali kotak KPK/FPB", "Hapus papan")
g(M02, "Centang di kotak sudut: 12 ≥ 6 ✓", "Tunjuk kertas kotak di dinding: 12 ≥ 6 ✓")
g(M02, "Centang di kotak sudut: 6 ≤ 18 ✓", "Tunjuk kertas kotak di dinding: 6 ≤ 18 ✓")

# ------------------------------------------------ #10 ucapan latihan campur-aduk + tiket 2 hari
g(M02, '*"Delapan soal. Soalnya campur. Sebelum mengerjakan, tanya dirimu: ini soal apa? Baru pilih caranya."*',
  '*"Delapan soal. Soalnya campur. Sebelum mengerjakan, tanya dirimu: ini soal apa? Baru pilih caranya. Yang belum selesai, dikerjakan di rumah bersama latihan rumah."*')

# ------------------------------------------------ #5 pertanyaan pancingan
g(M02, r"1\. \*\"Coba baca lagi kalimat terakhir soalnya\. Apa yang ditanya\?\"\*\n2\. .*?\n8\. \*\"Lihat kotak di sudut papan\. Jawabanmu harus lebih besar atau lebih kecil dari bilangan di soal\?\"\*",
  """1. *"Coba baca lagi kalimat terakhir soalnya. Apa yang ditanya?"*
2. *"Kira-kira jawabannya nanti lebih besar atau lebih kecil dari bilangan-bilangan di soal?"*
3. *"Lihat kertas kotak di dinding. Kalau jawabannya harus lebih besar, kita cari KPK atau FPB?"*
4. *"Di cerita ini, ada yang berulang lalu bertemu lagi, atau ada yang dipotong atau dibagi menjadi bagian yang sama?"*
5. *"Coba tulis tiga kelipatan pertama dari bilangan yang lebih besar."*
6. *"Bilangan berapa saja yang bisa membagi [bilangan] tanpa sisa? Mulai dari 1."*
7. *"Bilangan mana yang ada di kedua daftarmu?"*
8. *"Bayangkan jawabanmu terjadi sungguhan. Masuk akal?"*

**Kenapa pancingan 2 diletakkan sebelum kata di cerita:** soal TKA tidak selalu memakai kata "bersama lagi" atau "dibagi sama rata". Pita yang *dipotong sama panjang* adalah soal FPB; tumpukan yang *harus sama tinggi* adalah soal KPK. Yang selalu berlaku: **KPK tidak pernah lebih kecil dari bilangan terbesar, FPB tidak pernah lebih besar dari bilangan terkecil.**

**Kalau anak memakai pohon faktor.** Sebagian sekolah mengajarkan KPK dan FPB kelas 5 dengan pohon faktor **[PERLU DICEK — cara di buku sekolah sasaran]**.
- Kalau hasilnya **benar**, biarkan: *"Pohon faktor juga boleh. Hasilnya sama. Di sini Kakak memakai cara mendaftar supaya bisa dicek di papan."*
- Kalau hasilnya **salah**, jangan membahas pohon faktornya. Minta anak mencocokkan dengan cara mendaftar untuk bilangan yang sama.
- **Jangan** mengajarkan pohon faktor ke anak lain hari ini. Dua cara baru sekaligus membingungkan anak yang belum punya satu pun.""", regex=True)

# ------------------------------------------------ #5 Soal 6 ○ tanpa kata kunci biasa
g(M02, r"#### Soal 6 ○ · PG kategori\n.*?> \*\*Periksa:\*\* `30 // 9 == 3`",
  """#### Soal 6 ○ · PG kategori
Pak Hasan punya bambu 45 dm dan 60 dm. Kedua bambu dipotong. Semua potongan sama panjang dan tidak ada sisa. Potongannya dibuat **sepanjang mungkin**.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Panjang setiap potongan 15 dm. | ☐ | ☐ |
| 2. Bambu 45 dm menjadi 3 potongan. | ☐ | ☐ |
| 3. Untuk soal ini kita memakai KPK. | ☐ | ☐ |
| 4. Panjang setiap potongan bisa 180 dm. | ☐ | ☐ |

> **Kunci:** 1-B, 2-B, 3-S, 4-S
> **Kelompok:** hari ini (M02)
> **Petunjuk:** Satu potongan bisa lebih panjang dari bambunya? Jadi jawabannya lebih besar atau lebih kecil dari 45?
> **Langkah:** Potongan tidak mungkin lebih panjang dari bambu, jadi jawabannya ≤ 45 → faktor → FPB. Faktor 45: 1, 3, 5, 9, **15**, 45. Faktor 60: 1, 2, 3, 4, 5, 6, 10, 12, **15**, 20, 30, 60. FPB = 15. (1) 15 dm → Benar. (2) 45 : 15 = 3 → Benar. (3) Yang dipakai FPB → Salah. (4) 180 dm lebih panjang dari bambunya → Salah.
> **Kenapa pernyataan salah menarik:** 3 — tidak ada kata "dibagi sama rata", dan kata "sepanjang mungkin" terdengar seperti mencari yang besar, jadi anak memilih KPK (salah paham 1); 4 — 180 adalah KPK dari 45 dan 60, hasil anak yang tertukar.
> **Periksa:** `gcd(45, 60) == 15`
> **Periksa:** `45 // gcd(45, 60) == 3`
> **Periksa:** `lcm(45, 60) == 180 and lcm(45, 60) > 60`""", regex=True)

# ------------------------------------------------ #5 Tiket 3 tanpa kata kunci biasa
g(M02, r"#### Tiket 3 · PG kategori\n.*?> \*\*Periksa:\*\* `lcm\(3, 5\) >= max\(3, 5\) and gcd\(24, 36\) <= min\(24, 36\)`",
  """#### Tiket 3 · PG kategori
Cerita A: Kak Intan punya pita merah 36 cm dan pita biru 48 cm. Kedua pita dipotong sama panjang tanpa sisa. Ia ingin potongan yang paling panjang.

Cerita B: Rafli menumpuk kotak setinggi 15 cm. Nayla menumpuk kotak setinggi 20 cm. Tumpukan mereka harus sama tinggi. Mereka mencari tinggi yang paling rendah.

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Cerita A memakai FPB. | ☐ | ☐ |
| 2. Cerita B memakai FPB. | ☐ | ☐ |
| 3. Jawaban Cerita A **tidak** mungkin lebih dari 36 cm. | ☐ | ☐ |

> **Kunci:** 1-B, 2-S, 3-B
> **Petunjuk:** Untuk tiap cerita, tanyakan: jawabannya harus lebih besar atau lebih kecil dari bilangan di cerita?
> **Langkah:** (1) Potongan tidak mungkin lebih panjang dari pitanya → lebih kecil → faktor → FPB (12 cm) → Benar. (2) Tumpukan sama tinggi dibuat dari kotak 15 cm dan 20 cm, jadi tingginya kelipatan keduanya → lebih besar → KPK (60 cm) → Salah. (3) FPB tidak pernah lebih besar dari bilangan terkecil, 36 → Benar.
> **Kenapa pernyataan salah menarik:** 2 — kata "paling rendah" terdengar kecil, jadi anak memilih FPB. Tidak ada kata "bersama lagi" (salah paham 1).
> **Periksa:** `gcd(36, 48) == 12 and gcd(36, 48) <= 36`
> **Periksa:** `lcm(15, 20) == 60 and lcm(15, 20) >= 20`""", regex=True)
g(M02, "**Tiket 3 memutuskan KPK atau FPB dari cerita — ini sasaran utama pertemuan.**",
  "**Tiket 3 memutuskan KPK atau FPB dari cerita yang tidak memakai kata \"bersama lagi\" atau \"dibagi sama rata\" — ini sasaran utama pertemuan.**")

# ------------------------------------------------ catatan kesalahan umum M02
g(M02, "| Menjawab FPB untuk soal KPK, atau sebaliknya | 6, 8, 11 | Tunjuk kotak sudut papan: *\"Jawabanmu harus lebih besar atau lebih kecil?\"* |",
  "| Menjawab FPB untuk soal KPK, atau sebaliknya | 6 (pernyataan 3 dan 4), 8, 11 | Tunjuk kertas kotak di dinding: *\"Jawabanmu harus lebih besar atau lebih kecil?\"* |\n| Hanya mencari kata \"bersama lagi\" atau \"dibagi sama rata\" | 6 | Pancingan 2: *\"Kira-kira jawabannya lebih besar atau lebih kecil dari bilangan di soal?\"* |\n| Memakai pohon faktor | semua | Kalau benar, biarkan. Lihat Halaman 4, di bawah pertanyaan pancingan |")
g(M02, "| Menjawab hasil kali sebagai KPK | 6 (pernyataan 2), 8 | Halaman 4, salah paham 3 |",
  "| Menjawab hasil kali sebagai KPK | 8 | Halaman 4, salah paham 3 |")
g(M02, "| Fakta perkalian lambat (menghitung dengan jari) | 5, 10 | **Jangan dikomentari di depan kelas.** Catat nama → rapat mutu → soal PR-M2 di kuis |",
  "| Fakta perkalian lambat (menghitung dengan jari) | 5, 10 | **Jangan dikomentari di depan kelas.** Letakkan kartu fakta perkalian di mejanya. Catat nama → rapat mutu → soal PR-M2 di kuis |")

# ------------------------------------------------ halaman 7 cara membantu
g(M02, "cukup tanyakan balik: *'Di soal ini, ada yang dibagi sama rata, atau ada yang berulang lalu bertemu lagi?'*",
  "cukup tanyakan balik: *'Jawabannya nanti harus lebih besar atau lebih kecil dari angka di soal?'*")

# ------------------------------------------------ #7 #8 #10 berkas induk dan petunjuk
SPES = "00-berkas-induk/01-spesifikasi-program.md"
g(SPES, "| 7–11 | Ikut alur biasa + soal tambal halaman 5 M01 minggu 1–2 + dipantau ketat di rapat mutu |",
  "| 7–11 | Ikut alur biasa + soal tambal halaman 5 M01 minggu 1–2 + **kartu fakta perkalian 1–10 boleh dilihat** selama latihan dan tiket keluar minggu 1–2 (tidak saat kuis soal PR-M2) + dipantau ketat di rapat mutu |")
g(SPES, "**Yang dipotong kalau terlambat**",
  """### Latihan rumah (±10 menit)

Ditambahkan 17 September 2026 sesudah bantahan guru SD (`05-pemeriksaan/bantahan-M02-guru-sd.md` #10). **[FAKTA — *Tahap 2*]** Latihan rumah 10–15 menit mendukung pengulangan berjarak.

| Hal | Ketentuan |
|---|---|
| Isi | Soal ● yang belum selesai di kelas + **4 soal cadangan ○** halaman 5. Tercetak di lembar kerja anak bagian **D. Latihan rumah**, dengan kunci dan petunjuk di halaman terakhir |
| Koreksi | Anak mencocokkan sendiri dengan kunci. **Tidak dinilai dan tidak masuk rapor** |
| Orang tua | **Tidak** diminta mengajari atau memeriksa. Cukup mengingatkan waktunya (aturan keterlibatan orang tua: mendukung, bukan mengontrol) |
| Tidak berlaku | M01 dan B01 (soal ● sudah menjadi soal tambal) dan pertemuan simulasi |
| Di kelas | Tidak ada waktu kelas untuk membahas latihan rumah. Soal yang banyak salah muncul lagi lewat kuis pembuka |

**Yang dipotong kalau terlambat**""")

PERL = "04-petunjuk/07-perlengkapan-dan-persiapan.md"
g(PERL, "| 3 | Papan tulis besar (±60 × 90 cm) — kalau rumah belum punya | 1 | Rp 100.000–200.000 | Soal kuis, contoh jadi, kotak pengingat sudut | **[ASUMSI — kisaran pasar]** |",
  "| 3 | Papan tulis besar (**minimal 90 × 120 cm**) — kalau rumah belum punya | 1 | Rp 200.000–350.000 | Soal kuis dan contoh jadi. Kotak pengingat dan kartu berburu kesalahan **tidak** ditulis di papan, tetapi di kertas yang ditempel (butir 15) | **[ASUMSI — kisaran pasar; ukuran dinaikkan dari 60 × 90 cm sesudah bantahan guru SD #7]** |")
g(PERL, "| Rumah **belum** punya papan tulis besar | Rp 464.000 | Rp 715.000 |",
  "| Rumah **belum** punya papan tulis besar | Rp 564.000 | Rp 865.000 |")
g(PERL, "**Kalau ruang lesehan tanpa meja:**",
  """**Tambahan sesudah bantahan guru SD (belum masuk hitungan di atas):**

| # | Barang | Jumlah | Perkiraan harga | Dipakai untuk | Label |
|---|---|---|---|---|---|
| 15 | Karton putih A4 atau kertas HVS tebal + selotip kertas | 20 lembar | Rp 15.000–25.000 | Kotak pengingat (mis. KPK/FPB) dan kartu berburu kesalahan, ditulis spidol besar dan **ditempel di dinding**, dipakai ulang | **[ASUMSI]** |
| 16 | Kartu fakta perkalian 1–10 (`06-siap-pakai/kartu-fakta-perkalian.pdf`), dicetak dan dilaminating | 3 | Rp 10.000–15.000 | Anak dengan skor tes awal Matematika 7–11, minggu 1–2 | **[ASUMSI]** |

Lembar kerja anak kini juga memuat **D. Latihan rumah** dan halaman kunci latihan rumah. Hitung ulang jumlah halaman fotokopi di Bagian 2.2 dari PDF lembar kerja yang baru **[PERLU DICEK]**.

**Kalau ruang lesehan tanpa meja:**""")
g(PERL, "| ☐ | Kotak pengingat di sudut papan (kalau modul memintanya) sudah ditulis |",
  "| ☐ | Kotak pengingat dan kartu berburu kesalahan (kalau modul memintanya) sudah **ditempel di dinding** di samping papan, bukan ditulis di papan |\n| ☐ | Kartu fakta perkalian sudah di meja anak yang memerlukannya (minggu 1–2) |")

BUKU = "04-petunjuk/01-buku-pegangan-pengajar.md"
g(BUKU, "**Tiket keluar yang dinilai besok pagi sudah terlambat.**",
  "**Latihan rumah.** Lembar kerja anak memuat bagian **D. Latihan rumah (±10 menit)**: soal ● yang belum selesai di kelas dan soal ○, dengan kunci di halaman terakhir. Anak mencocokkan sendiri. Tidak dinilai, tidak masuk rapor, dan orang tua tidak diminta mengajari (spesifikasi Bagian 5).\n\n**Tiket keluar yang dinilai besok pagi sudah terlambat.**")

print("gagal:", gagal)
