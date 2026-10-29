"""Perbaikan temuan 05-pemeriksaan/verifikasi-akhir.md (prioritas 1–5 + ringan tanpa ubah huruf kunci)."""
import glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import periksa as P

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
LOG = []


def f(pola):
    h = glob.glob(pola)
    assert len(h) == 1, pola
    return h[0]


def ganti(pola, lama, baru, semua=False, regex=False):
    p = f(pola)
    s = open(p, encoding="utf-8").read()
    if regex:
        t, n = re.subn(lama, baru, s, flags=re.M)
    else:
        n = s.count(lama)
        t = s.replace(lama, baru)
    if n == 0 or (n > 1 and not semua):
        print(f"GAGAL {os.path.basename(p)} ({n}×): {lama[:80]!r}")
        return
    open(p, "w", encoding="utf-8").write(t)
    LOG.append(os.path.basename(p))


M = "01-modul-matematika/"
B = "02-modul-bahasa-indonesia/"

# 5.1 B07 ucapan kunci
ganti(B + "B07*.md", '*"Nomor 1, C. Nomor 2, B. …"*', '*"Nomor 1, C. Nomor 2, C. …"*')

# 3.5 S2 Butir 4 pernyataan 1
ganti(M + "simulasi/S2*.md", "| 1. Dari yang paling sedikit, urutannya naik sepeda, naik becak motor, jalan kaki. |",
      "| 1. Urutan dari yang paling sedikit: mobil, sepeda, becak motor, jalan kaki. |")
ganti(M + "simulasi/S2*.md", "(1) 20 < 30 < 35 → Benar.", "(1) Mobil 15 < sepeda 20 < becak motor 30 < jalan kaki 35 → Benar.")
ganti(M + "simulasi/S2*.md", "> **Periksa:** `F(1,5) < F(30,100) < F('0.35')`",
      "> **Periksa:** `1 - F('0.35') - F(1,5) - F(30,100) < F(1,5) < F(30,100) < F('0.35')`")
# 3.10
ganti(M + "simulasi/S2*.md", "> **Periksa:** `F(30,100) < F('0.35')`", "> **Periksa:** `not (F(30,100) > F('0.35'))`")
ganti(M + "simulasi/S2*.md", "`2 * 1000 > 750`", "`not (2 * 1000 < 750)`")

# 5.4 B11 Terbimbing 2
ganti(B + "B11*.md", "senyumnya selalu hangat.  \nAku bangun", "aku suka senyumnya yang hangat.  \nAku bangun")
ganti(B + "B11*.md", "A. senyumnya selalu hangat\nB. ingin memikul", "A. aku suka senyumnya yang hangat\nB. ingin memikul")
ganti(B + "B11*.md", "A — \"hangat\" adalah rasa \"aku\" saat melihat senyum Ibu → sayang.",
      "A — kata \"aku suka\" menunjukkan rasa sayang \"aku\" kepada Ibu.")
# 5.5 B11 Soal 8
ganti(B + "B11*.md", "C. cemas\nD. sakit perut", "C. cemas\nD. marah")
ganti(B + "B11*.md", "D — larik terakhir diartikan apa adanya (salah paham 1).",
      "D — \"berdetak keras\" dibaca sebagai tanda marah, padahal tidak ada tokoh atau kejadian yang membuat marah (salah paham 3).")

# 3.1–3.2 M08/M14/M20 Terbimbing 1
for kode in ("M08", "M14", "M20"):
    ganti(M + kode + "*.md", "Terbimbing 1 **tidak** dijalankan di hari simulasi; soal itu dipakai sebagai soal cadangan di pertemuan Matematika berikutnya.",
          "Terbimbing 1 **tidak** dijalankan di hari simulasi; soal itu dibawa pulang sebagai latihan mandiri bersama lembar hasil simulasi.")
ganti(M + "M08*.md", r"\*\*\[PERLU DICEK — penempatan di M07 belum tertulis di modul M07; diteruskan ke penyusun modul itu\. Waktu pe[^\]]*\]\*\*",
      "**[ASUMSI — waktu peragaan sangat pendek; langkah lain dibaca pengajar sebagai persiapan]**", regex=True)
# 3.3 S1–S3 petunjuk
for s in ("S1", "S2", "S3"):
    ganti(M + f"simulasi/{s}*.md", "Dibacakan pengajar apa adanya di menit 5–7.",
          "Tercetak di halaman depan lembar soal dan dibaca anak sendiri di menit 5–7. Pengajar hanya mengucapkan satu kalimat petunjuk (lihat tabel menit modul simulasi).")
# 3.4
ganti(M + "M14*.md", "Di hari simulasi, hanya patokan tempo (langkah 6) yang ada di sudut papan.",
      "Sesudah peragaan, papan dihapus kecuali patokan tempo (langkah 6).")
ganti(M + "M20*.md", "- Urutan putaran kedua dari Contoh jadi 1 (Halaman 3, langkah 2) ditulis kecil di sudut papan, ditutup kertas sampai menit 67.",
      "- Sesudah peragaan menit 5–7, papan dihapus. Urutan putaran kedua dari Contoh jadi 1 (Halaman 3, langkah 2) ditulis ulang kecil di sudut papan, ditutup kertas sampai menit 67.")
ganti(M + "M20*.md", "Di hari simulasi, urutan putaran kedua hanya ditulis di sudut papan (menit 67).",
      "Sesudah peragaan, papan dihapus; urutan putaran kedua ditulis ulang kecil di sudut papan dan dibuka di menit 67.")

# 5.3 B12 / S5 rujukan menit
ganti(B + "B12*.md", "**baru dibuka di menit 85**", "**baru dibuka di menit 88**")
ganti(B + "B12*.md", "(ditutup kertas sampai menit 85)", "(ditutup kertas sampai menit 82)")
ganti(B + "simulasi/S5*.md", "(diisi anak di menit 85–95,", "(diisi anak di menit 88–95,")
ganti(B + "simulasi/S5*.md", "Dibacakan di menit 85 atau ditempel di papan.", "Dibacakan di menit 88 atau ditempel di papan.")

# 5.2 B12 Soal 2
ganti(B + "B12*.md", "| KM Sabang | 07.00 | 10.00 |", "| KM Sabang | 06.15 | 10.00 |")
ganti(B + "B12*.md", "C — tepat 10.00 dikira \"sebelum 10.00\";",
      "C — tepat 10.00 dikira \"sebelum 10.00\", lalu KM Sabang (06.15) terpilih karena paling pagi;")

# 1.1 / 1.2 M09
ganti(M + "M09*.md", "C — 1,5 kg dikira 150 g, dikali 100 seperti m ke cm (jumlah anak tangga salah hitung, salah paham 3).",
      "C — 1,5 kg dikira 150 g: dikali 100 seperti m ke cm, turun 2 anak tangga padahal 3 (tanpa nomor salah paham).")
ganti(M + "M09*.md", r"^\| Operasi campuran dikerjakan urut dari kiri \| 3, 5, 10 \|(.*)Soal 5 dan Soal 10(.*)$",
      r"| Urutan operasi keliru (urut dari kiri, atau kurung diabaikan) | 3, 5 |\1Soal 3 dan Soal 5\2", regex=True)
# 1.3 kalimat campur-aduk M15–M22
for p in glob.glob(M + "M1[5-9]*.md") + glob.glob(M + "M2[12]*.md"):
    s = open(p, encoding="utf-8").read()
    t = s.replace('*"Delapan soal. Soalnya campur. Kenali dulu soalnya soal apa, baru kerjakan."*',
                  '*"Delapan soal. Soalnya campur. Sebelum mengerjakan, tanya dirimu: ini soal apa? Baru pilih caranya."*')
    if t != s:
        open(p, "w", encoding="utf-8").write(t)
        LOG.append(os.path.basename(p))
# 1.4 M12
ganti(M + "M12*.md", "Sudut di garis lurus dihitung dari 90°. Sudut di dalam sudut siku-siku dihitung dari 180°",
      "Dua sudut yang membentuk garis lurus dihitung dari 90°. Dua sudut yang membentuk sudut siku-siku dihitung dari 180°")
# 1.5 M02
ganti(M + "M02*.md", "Cerita B: Lampu A menyala setiap 3 menit. Lampu B menyala setiap 5 menit.",
      "Cerita B: Lampu merah menyala setiap 3 menit. Lampu hijau menyala setiap 5 menit.")
# 1.6 M13 Kuis 4
ganti(M + "M13*.md", "Berapa hasil 2/5 + 1/4?\n\nA. 3/20\nB. 3/9\nC. 9/20\nD. 13/20",
      "Berapa hasil 3/5 + 1/4?\n\nA. 4/20\nB. 4/9\nC. 13/20\nD. 17/20")
ganti(M + "M13*.md", "> **Langkah:** Penyebut 20: 2/5 = 8/20 dan 1/4 = 5/20. 8/20 + 5/20 = 13/20.",
      "> **Langkah:** Penyebut 20: 3/5 = 12/20 dan 1/4 = 5/20. 12/20 + 5/20 = 17/20.")
ganti(M + "M13*.md", "A — penyebut diubah ke 20, tetapi kedua pembilang dibiarkan: (2 + 1)/20; B — pembilang ditambah pembilang, penyebut ditambah penyebut; C — hanya pembilang pecahan pertama yang ikut diubah: 8/20 + 1/20.",
      "A — penyebut diubah ke 20, tetapi kedua pembilang dibiarkan: (3 + 1)/20; B — pembilang ditambah pembilang, penyebut ditambah penyebut; C — hanya pembilang pecahan pertama yang ikut diubah: 12/20 + 1/20.")
ganti(M + "M13*.md", "`F(2,5) + F(1,4) == F(13,20)`", "`F(3,5) + F(1,4) == F(17,20)`")
# 1.7, 2.1
ganti(M + "M06*.md", "`130 // lcm(8, 12) == 5 and 130 // 4 == 32`", "`130 // lcm(8, 12) == 5 and 130 // gcd(8, 12) == 32`")
ganti(M + "M22*.md", "`30 == (20 + 35 + 25 + 30 + 40) / 5`", "`[20, 35, 25, 30, 40][3] == sum([20, 35, 25, 30, 40]) / 5`")
# 2.3 S4 judul butir lepas
p = f(M + "simulasi/S4*.md")
s = open(p, encoding="utf-8").read()
assert s.count("### Butir lepas (nomor 9–10)\n") == 1 and s.count("#### Butir 7 ·") == 1
s = s.replace("### Butir lepas (nomor 9–10)\n", "", 1)
s = re.sub(r"^(#### Butir 7 ·)", "### Butir lepas (nomor 7–10)\n\n\\1", s, count=1, flags=re.M)
open(p, "w", encoding="utf-8").write(s)
LOG.append(os.path.basename(p))
# 2.4 M16
ganti(M + "M16*.md", "Sisi yang berimpit tertutup, tidak terbungkus", "Sisi yang berimpit tidak terlihat dari luar, jadi tidak dibungkus")
# 3.6 S3 Butir 1
ganti(M + "simulasi/S3*.md", "C — penyebut 13 paling besar dikira nilainya paling besar",
      "C — setengah dari 13 dikira 6, jadi 6/13 dianggap sudah lebih dari setengah")
# 3.13 S3 Butir 21
ganti(M + "simulasi/S3*.md", "Berapa km lagi jarak yang kurang dari keinginan Kakek?", "Berapa km lagi Kakek harus berjalan agar genap 5 km?")
# 3.12 M20
ganti(M + "M20*.md", "'dari muatan awal'", "'diisi penuh'")
# 4.2 B01 catatan kesalahan umum
ganti(B + "B01*.md", "| Menjawab dari pengetahuan sendiri | 2, 3, 8 (pernyataan 4), 10, 12 |", "| Menjawab dari pengetahuan sendiri | 3, 8 (pernyataan 4), 12 |")
ganti(B + "B01*.md", "| Memilih kata yang ada di teks tetapi untuk orang atau hal lain | 1, 8 (pernyataan 2), 9, 10 |",
      "| Memilih kata yang ada di teks tetapi untuk orang atau hal lain | 1, 8 (pernyataan 2), 9 |")
ganti(B + "B01*.md", "| Membaca ulang teks dari awal, soal ○ tidak sempat | 4, 5, 8, 12 |", "| Membaca ulang teks dari awal, soal ○ tidak sempat | 2, 4, 5, 8, 10, 12 |")
# 4.4 B04
ganti(B + "B04*.md", "| Memilih rincian bukan ide pokok | 2, 4, 9 (pernyataan 2), 11 | Halaman 4, salah paham 2 |",
      "| Memilih rincian bukan ide pokok | 2, 9 (pernyataan 2), 11 | Halaman 4, salah paham 2 |\n| Ide pokok ikut dipilih sebagai gagasan pendukung | 4 | *\"Kalimat ini payung atau isi payung?\"* |")
# 4.6 B06 Soal 7
ganti(B + "B06*.md", "Berdasarkan cerita di soal nomor 4, pilih **semua** pernyataan yang sesuai tentang perubahan latar.",
      "Menurut cerita nomor 4, pilih **semua** pernyataan yang benar tentang latar.")
# 4.8 T11
ganti("03-bank-teks-baca-cepat/T11*.md", "B — Keumala juga menyusul Alif, tetapi ia tiba sesudah Rizki",
      "B — Keumala juga berada di depan Alif yang berhenti, tetapi ia berlari di belakang Rizki")
# 5.6 B09
ganti(B + "B09*.md", "Diantar motor │██████████████ 14", "Diantar ortu  │██████████████ 14")
# 5.7 B11
ganti(B + "B11*.md", "A — hanya dua baris pertama yang dibaca, lalu berhenti",
      "A — hanya dua baris pertama yang dibaca, dan tepat 10 dikira \"lebih dari seperempat\"")
# 5.8 S5
ganti(B + "simulasi/S5*.md", "Cari kalimat 'dulu' dan kalimat 'sejak hari itu'.", "Cari kalimat 'sering merengek' dan kalimat 'Sejak hari itu'.")
# 5.10 B10
ganti(B + "B10*.md", r"^\| 1\. [^|]*relevan[^|]*kalimat 4[^|]*\|", None or "", regex=False) if False else None

# 4.1 klaim sebaran kunci PG B01–B06 (dihitung ulang)
from collections import Counter
for p in sorted(glob.glob(B + "B0[1-6]*.md")):
    s = open(p, encoding="utf-8").read()
    h5 = P.potong_halaman(s).get(P.HALAMAN[4], "")
    c = Counter(x["kunci"].get("Kunci") for x in P.blok_soal(h5) if x["jenis"] == "Soal" and x["bentuk"] == "PG")
    n = sum(c.values())
    klaim = f"**Sebaran kunci PG ({n} soal):** A {c['A']} · B {c['B']} · C {c['C']} · D {c['D']}."
    t = re.sub(r"\*\*Sebaran kunci PG \(\d+ soal\):\*\* A \d+ · B \d+ · C \d+ · D \d+\.", klaim, s, count=1)
    if t != s:
        open(p, "w", encoding="utf-8").write(t)
        LOG.append(os.path.basename(p) + " (sebaran)")
    print(os.path.basename(p)[:3], klaim)

print("diubah:", len(LOG))
