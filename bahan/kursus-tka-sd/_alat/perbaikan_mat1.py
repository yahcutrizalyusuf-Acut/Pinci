"""Perbaikan temuan 05-pemeriksaan/temuan-matematika-1.md (T-01 s.d. T-17)."""
import glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, "01-modul-matematika")


def f(kode):
    return glob.glob(os.path.join(M, kode + "-*.md"))[0]


R = {}  # berkas -> list (lama, baru, jumlah|None)


def ganti(kode, lama, baru, semua=False):
    R.setdefault(kode, []).append((lama, baru, semua))


# T-01
ganti("M13", """rumah 3.400    tengah    rumah 3.500
    ├────────┬────┼─────────────┤
             │
           3.462""", """rumah 3.400    tengah    rumah 3.500
    ├─────────────┼──┬──────────┤
                     │
                   3.462""")
# T-02
ganti("M12", "Sudut K = 35° dan sudut Y = 65°. Y, Z, dan W segaris.\n\nBerapa besar sudut XZW?",
      "Sudut K = 35° dan sudut Y = 65°. Sisi YZ diperpanjang sampai titik W.\n\nBerapa besar sudut XZW?")
# T-03
ganti("M02", "| 1. Kapal Cut Meutia berlabuh lagi 12 hari dari sekarang. |",
      "| 1. Kapal Cut Meutia juga berlabuh pada hari ke-12 dari sekarang. |")
ganti("M02", "| 4. Dalam 30 hari, kapal Seulanga berlabuh 3 kali. |",
      "| 4. Dari hari ke-1 sampai hari ke-30, kapal Seulanga berlabuh 3 kali. |")
ganti("M02", "(4) Seulanga berlabuh hari ke-9, 18, 27. Hari ke-36 sudah lewat 30 → 3 kali → Benar.",
      "(4) Dari hari ke-1 sampai ke-30, Seulanga berlabuh hari ke-9, 18, 27. Hari ke-36 sudah lewat 30 → 3 kali → Benar.")
# T-04
ganti("M06", "Dalam 2 menit berikutnya, berapa kali keduanya berkedip bersamaan lagi?\n\nA. 1\nB. 5\nC. 6\nD. 30",
      "Dalam 130 detik berikutnya, berapa kali keduanya berkedip bersamaan lagi?\n\nA. 1\nB. 5\nC. 6\nD. 32")
ganti("M06", "> **Petunjuk:** Setiap berapa detik keduanya berkedip bersamaan? 2 menit itu berapa detik?",
      "> **Petunjuk:** Setiap berapa detik keduanya berkedip bersamaan? Berapa kali angka itu muat dalam 130 detik?")
ganti("M06", "> **Langkah:** KPK 8 dan 12 = 24 detik. 2 menit = 120 detik. 120 : 24 = 5 kali.",
      "> **Langkah:** KPK 8 dan 12 = 24 detik. 130 : 24 = 5 sisa 10. Jadi 5 kali (detik ke-24, 48, 72, 96, 120).")
ganti("M06", "C — memakai jumlah 8 + 12 = 20 detik; D — memakai FPB 4 detik, KPK dan FPB tertukar.\n> **Periksa:** `(2 * 60) // lcm(8, 12) == 5`",
      "C — memakai jumlah 8 + 12 = 20 detik; D — memakai FPB 4 detik (130 : 4 = 32 sisa 2), KPK dan FPB tertukar.\n> **Periksa:** `130 // lcm(8, 12) == 5 and 130 // 4 == 32`")
# T-05
ganti("M11", "Sebuah taman berbentuk trapesium. Sisi sejajarnya 12 m dan 18 m.",
      "Sebuah taman berbentuk trapesium siku-siku. Sisi sejajarnya 12 m dan 18 m.")
# T-06
ganti("M10", "Lihat baris ini: dari L ke mL, satu anak tangga atau tiga?",
      "Lihat baris ini: dari L ke mL, dikali 10 atau dikali 1.000?")
# T-07
ganti("M12", """Harga tas sekolah di sebuah toko di Lampineung Rp80.000. Toko memberi diskon 15%. Salsabila juga memakai kupon potongan Rp5.000 setelah diskon.

Berapa uang yang dibayar Salsabila?

A. Rp12.000
B. Rp63.000
C. Rp68.000
D. Rp75.000

> **Kunci:** B
> **Kelompok:** bulan lalu (M04)
> **Petunjuk:** Berapa besar diskonnya dulu? Kupon dipakai sebelum atau sesudah diskon?
> **Langkah:** Diskon: 15% × Rp80.000 = Rp12.000. Setelah diskon: Rp68.000. Setelah kupon: Rp68.000 − Rp5.000 = Rp63.000.
> **Kenapa pengecoh menarik:** A — menjawab besar diskonnya saja; C — kupon terlupa; D — diskon terlupa, hanya kupon yang dikurangkan.
> **Periksa:** `80000 - 80000 * F(15, 100) - 5000 == 63000`""",
      """Salsabila menghabiskan 3/20 bagian uang jajannya untuk membeli pensil.

Pecahan 3/20 sama dengan berapa persen?

A. 0,15%
B. 1,5%
C. 15%
D. 60%

> **Kunci:** C
> **Kelompok:** bulan lalu (M04)
> **Petunjuk:** Supaya menjadi persen, penyebutnya diubah menjadi berapa?
> **Langkah:** 3/20 = (3 × 5)/(20 × 5) = 15/100 = 15%.
> **Kenapa pengecoh menarik:** A — 3/20 = 0,15 benar, lalu tanda % langsung ditempel; B — dikali 10, bukan 100; D — pembilang dikali penyebut: 3 × 20.
> **Periksa:** `F(3, 20) * 100 == 15`""")
ganti("M12", "| Membandingkan desimal dan persen tanpa mengubah bentuk | 3, 8, 10 |",
      "| Membandingkan atau mengubah pecahan, desimal, dan persen tanpa menyamakan bentuk | 3, 8, 10 |")
# T-08
ganti("M10", """Berapa KPK dari 8 dan 12?

A. 4
B. 20
C. 24
D. 96

> **Kunci:** C
> **Kelompok:** bulan lalu (M02)
> **Petunjuk:** Daftar kelipatan 12, lalu periksa mana yang juga kelipatan 8.
> **Langkah:** Kelipatan 12: 12, **24**. Kelipatan 8: 8, 16, **24**. KPK = 24.
> **Kenapa pengecoh menarik:** A — FPB dari 8 dan 12, KPK dan FPB tertukar; B — menjumlahkan; D — hasil kali 8 × 12, KPK dikira selalu hasil kali.
> **Periksa:** `lcm(8, 12) == 24`""", """Berapa KPK dari 6 dan 15?

A. 3
B. 21
C. 30
D. 90

> **Kunci:** C
> **Kelompok:** bulan lalu (M02)
> **Petunjuk:** Daftar kelipatan 15, lalu periksa mana yang juga kelipatan 6.
> **Langkah:** Kelipatan 15: 15, **30**. Kelipatan 6: 6, 12, 18, 24, **30**. KPK = 30.
> **Kenapa pengecoh menarik:** A — FPB dari 6 dan 15, KPK dan FPB tertukar; B — menjumlahkan; D — hasil kali 6 × 15, KPK dikira selalu hasil kali.
> **Periksa:** `lcm(6, 15) == 30`""")
ganti("M13", """Berapa hasil 2/3 + 1/4?

A. 3/12
B. 3/7
C. 9/12
D. 11/12

> **Kunci:** D
> **Petunjuk:** Samakan penyebutnya dulu. Pembilangnya ikut diubah?
> **Langkah:** Penyebut 12: 2/3 = 8/12 dan 1/4 = 3/12. 8/12 + 3/12 = 11/12.
> **Kenapa pengecoh menarik:** A — penyebut diubah ke 12, tetapi kedua pembilang dibiarkan: (2 + 1)/12; B — pembilang ditambah pembilang, penyebut ditambah penyebut; C — hanya pembilang pecahan pertama yang ikut diubah: 8/12 + 1/12.
> **Periksa:** `F(2,3) + F(1,4) == F(11,12)`""", """Berapa hasil 2/5 + 1/4?

A. 3/20
B. 3/9
C. 9/20
D. 13/20

> **Kunci:** D
> **Petunjuk:** Samakan penyebutnya dulu. Pembilangnya ikut diubah?
> **Langkah:** Penyebut 20: 2/5 = 8/20 dan 1/4 = 5/20. 8/20 + 5/20 = 13/20.
> **Kenapa pengecoh menarik:** A — penyebut diubah ke 20, tetapi kedua pembilang dibiarkan: (2 + 1)/20; B — pembilang ditambah pembilang, penyebut ditambah penyebut; C — hanya pembilang pecahan pertama yang ikut diubah: 8/20 + 1/20.
> **Periksa:** `F(2,5) + F(1,4) == F(13,20)`""")
ganti("M09", """Berapa hasil 3/4 : 3/8?

A. 9/32
B. 1/2
C. 2
D. 32/9

> **Kunci:** C
> **Kelompok:** minggu lalu (M06)
> **Petunjuk:** Membagi dengan pecahan sama dengan mengalikan dengan apa?
> **Langkah:** 3/4 : 3/8 = 3/4 × 8/3 = 24/12 = 2.
> **Kenapa pengecoh menarik:** A — dikali tanpa membalik pecahan: 3/4 × 3/8; B — yang dibalik pecahan pertama: 4/3 × 3/8; D — kedua pecahan dibalik: 4/3 × 8/3.
> **Periksa:** `F(3,4) / F(3,8) == 2`""", """Berapa hasil 2/3 : 4/9?

A. 8/27
B. 2/3
C. 1 1/2
D. 27/8

> **Kunci:** C
> **Kelompok:** minggu lalu (M06)
> **Petunjuk:** Membagi dengan pecahan sama dengan mengalikan dengan apa?
> **Langkah:** 2/3 : 4/9 = 2/3 × 9/4 = 18/12 = 3/2 = 1 1/2.
> **Kenapa pengecoh menarik:** A — dikali tanpa membalik pecahan: 2/3 × 4/9; B — yang dibalik pecahan pertama: 3/2 × 4/9; D — kedua pecahan dibalik: 3/2 × 9/4.
> **Periksa:** `F(2,3) / F(4,9) == F(3,2)`""")
ganti("M09", """Berapa hasil 0,5 + 1/4?

A. 2/6
B. 9/20
C. 3/4
D. 9/10

> **Kunci:** C
> **Petunjuk:** Ubah dulu supaya bentuknya sama. 0,5 sama dengan pecahan berapa?
> **Langkah:** 0,5 = 1/2 = 2/4. Lalu 2/4 + 1/4 = 3/4.
> **Kenapa pengecoh menarik:** A — 0,5 ditulis 1/2, lalu pembilang ditambah pembilang dan penyebut ditambah penyebut: (1 + 1)/(2 + 4); B — 0,5 dibaca 1/5, lalu 1/5 + 1/4 = 9/20; D — 1/4 dibaca 0,4, lalu 0,5 + 0,4 = 0,9.
> **Periksa:** `F('0.5') + F(1,4) == F(3,4)`""", """Berapa hasil 0,5 + 1/5?

A. 2/7
B. 2/5
C. 7/10
D. 1

> **Kunci:** C
> **Petunjuk:** Ubah dulu supaya bentuknya sama. 0,5 sama dengan pecahan berapa?
> **Langkah:** 0,5 = 1/2 = 5/10. 1/5 = 2/10. Lalu 5/10 + 2/10 = 7/10.
> **Kenapa pengecoh menarik:** A — 0,5 ditulis 1/2, lalu pembilang ditambah pembilang dan penyebut ditambah penyebut: (1 + 1)/(2 + 5); B — 0,5 dibaca 1/5, lalu 1/5 + 1/5; D — 1/5 dibaca 0,5, lalu 0,5 + 0,5.
> **Periksa:** `F('0.5') + F(1,5) == F(7,10)`""")
# T-09
ganti("M06", "│ KALI → atas × atas,          │\n│        bawah × bawah         │",
      "│ KALI → pembilang × pembilang,│\n│        penyebut × penyebut   │")
ganti("M06", "Atas kali atas: dua kali tiga, enam. Bawah kali bawah: tiga kali empat, dua belas.",
      "Pembilang kali pembilang: dua kali tiga, enam. Penyebut kali penyebut: tiga kali empat, dua belas.")
ganti("M06", "Atas kali atas: dua belas. Bawah kali bawah: tiga.", "Pembilang kali pembilang: dua belas. Penyebut kali penyebut: tiga.")
ganti("M06", "Atas dikali apa? Bawah dikali apa?", "Pembilang dikali apa? Penyebut dikali apa?", semua=True)
ganti("M06", "9 ditulis per berapa? Atas dikali apa?", "9 ditulis per berapa? Pembilang dikali apa?")
ganti("M03", "pecahan dengan angka bawah lebih besar pasti lebih besar", "pecahan dengan penyebut lebih besar pasti lebih besar")
ganti("M05", "menjumlahkan angka atas dengan atas dan angka bawah dengan bawah",
      "menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut")
# T-10
ganti("M12", "di satu garis lurus atau di satu pojok siku-siku?", "di satu garis lurus atau di satu sudut siku-siku?")
ganti("M12", "melipat kertas bekas dua kali sampai membentuk pojok. *\"Pojok ini sudut siku-siku, 90 derajat.\"*",
      "melipat kertas bekas dua kali sampai membentuk sudut siku-siku. *\"Sudut ini sudut siku-siku, 90 derajat.\"*")
ganti("M12", "sama dengan dua pojok siku-siku.", "sama dengan dua sudut siku-siku.")
ganti("M12", "Robek kertas sepanjang satu garis miring dari pojok. *\"Pojok siku-siku terbagi dua sudut.",
      "Robek kertas sepanjang satu garis miring dari titik sudut. *\"Sudut siku-siku terbagi dua sudut.")
ganti("M12", "Sudut di pojok siku-siku dihitung dari 180°", "Sudut di dalam sudut siku-siku dihitung dari 180°")
ganti("M12", "ada di garis lurus atau di pojok siku-siku?", "ada di garis lurus atau di sudut siku-siku?")
ganti("M12", "*\"Garis lurus atau pojok siku-siku?\"*", "*\"Garis lurus atau sudut siku-siku?\"*")
ganti("M11", "bagian pojok dihitung dua kali", "bagian yang bertumpuk dihitung dua kali")
# T-11
ganti("M13", "| Perkalian bilangan bulat puluhan dan ratusan", "| Perkalian bilangan puluhan dan ratusan")
ganti("M13", "*\"Bilangan ini ada di antara dua bilangan bulat mana?\"*",
      "*\"Bilangan ini ada di antara dua ratusan (atau ribuan) yang mana?\"*")
# T-12
ganti("M09", "Botol minyak berisi 1,5 L. Berapa cm³ isinya?", "Botol minyak berisi 1,5 L. Berapa cm³ volume minyak itu?")
ganti("M11", "Berapa mL isi botol itu?", "Berapa mL volume sirup itu?")
ganti("M09", "ini isinya 1 dm³.", "ini volumenya 1 dm³.")
# T-14
ganti("M02", """Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Bu Intan membagi 24 pensil dan 36 buku ke beberapa kelompok. Isi tiap kelompok sama. Untuk mencari kelompok **paling banyak**, kita memakai FPB. | ☐ | ☐ |
| 2. Lampu A menyala setiap 3 menit. Lampu B menyala setiap 5 menit. Untuk mencari kapan keduanya menyala bersama lagi, kita memakai FPB. | ☐ | ☐ |
| 3. KPK dari dua bilangan **tidak** mungkin lebih kecil dari bilangan yang lebih besar. | ☐ | ☐ |""",
      """Cerita A: Bu Intan membagi 24 pensil dan 36 buku ke beberapa kelompok. Isi tiap kelompok sama. Bu Intan ingin kelompok **paling banyak**.

Cerita B: Lampu A menyala setiap 3 menit. Lampu B menyala setiap 5 menit. Kapan keduanya menyala bersama lagi?

Tentukan **Benar** atau **Salah** untuk setiap pernyataan.

| Pernyataan | Benar | Salah |
|---|---|---|
| 1. Cerita A memakai FPB. | ☐ | ☐ |
| 2. Cerita B memakai FPB. | ☐ | ☐ |
| 3. KPK dua bilangan **tidak** pernah lebih kecil dari bilangan terbesarnya. | ☐ | ☐ |""")
# T-15
ganti("M10", "Jaraknya 45 km **[ASUMSI — jarak cerita, fiktif]**. Paman berangkat", "Jaraknya 45 km. Paman berangkat")
# T-16
ganti("M01", "Bilangan 6.000 + 400 + 9 ditulis sebagai?", "6.000 + 400 + 9 sama dengan bilangan berapa?")
# T-17
ganti("M09", "C — 1,5 kg dikira 150 g, dikali 100 seperti m ke cm (salah paham 1, tangga yang tertukar).",
      "C — 1,5 kg dikira 150 g, dikali 100 seperti m ke cm (jumlah anak tangga salah hitung, salah paham 3).")
ganti("M05", "| 0,08 dan 0,8 tertukar | 3, 8 |", "| 0,08 dan 0,8 tertukar | 8 |")
ganti("M09", "| Operasi campuran dikerjakan urut dari kiri | 3, 5 |", "| Operasi campuran dikerjakan urut dari kiri | 3, 5, 10 |")

gagal = 0
for kode, daftar in R.items():
    p = f(kode)
    s = open(p, encoding="utf-8").read()
    for lama, baru, semua in daftar:
        n = s.count(lama)
        if n == 0 or (n > 1 and not semua):
            print(f"GAGAL {kode}: ditemukan {n}× — {lama[:70]!r}")
            gagal += 1
            continue
        s = s.replace(lama, baru)
    open(p, "w", encoding="utf-8").write(s)
print("selesai, gagal:", gagal)
