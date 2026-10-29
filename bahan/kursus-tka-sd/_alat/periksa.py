"""Pemeriksa otomatis modul, teks, dan paket simulasi Paket Siap TKA SD.

Pemakaian:
  python periksa.py <berkas atau folder> [...]      -> laporan ringkas
  python periksa.py --rinci <berkas>                -> laporan per soal

Yang diperiksa:
  A. Baris `Periksa` dijalankan sebagai ekspresi Python (butir 16).
  B. Struktur tujuh halaman dan judul wajib (butir 1).
  C. Tabel menit berjumlah 45 (atau 100 untuk simulasi) (butir 2).
  D. Halaman 5: 12 soal, 8 ●, 4 ○, 5/4/3 kelompok, acak (butir 3).
  E. Setiap soal punya Kunci, Petunjuk, Langkah, alasan pengecoh (butir 4).
  F. Tiket keluar 3 soal + ambang (butir 13); kalimat membantu tanpa mengambil alih (butir 14).
  G. Kata terlarang (butir 7, 8, 11, 15).
"""
import re, sys, os, glob
from fractions import Fraction as F
from math import gcd, lcm

HALAMAN = ["Halaman 1 — Sasaran", "Halaman 2 — Naskah sesi", "Halaman 3 — Contoh jadi",
           "Halaman 4 — Kalau anak macet", "Halaman 5 — Latihan campur-aduk",
           "Halaman 6 — Tiket keluar", "Halaman 7 — Kalimat laporan orang tua"]
SUB_WAJIB = {
    0: ["Sasaran", "Prasyarat", "Tiga salah paham", "Model pembelajaran utama"],
    1: ["Kalimat pembuka", "Tabel menit per menit", "Kalimat penutup"],
    3: ["Pertanyaan pancingan", "Penjelasan alternatif 1", "Penjelasan alternatif 2"],
    4: ["Peta soal", "Soal", "Catatan kesalahan umum"],
    5: ["Ambang penguasaan"],
    6: ["Kalimat siap pakai", "Cara membantu di rumah tanpa mengambil alih"],
}
SIM_KODE = {"M08", "M14", "M20", "M24", "B12"}
JUDUL_SOAL = re.compile(r"^####\s+(Soal|Tiket|Kuis|Terbimbing|Contoh|Pertanyaan|Butir|Diagnostik)\s+(\d+)\s*([●○])?\s*·\s*(PG kompleks|PG kategori|PG)\s*$")
TERLARANG = [
    (r"isilah titik|isian singkat|\buraian\b(?! kata)|jodohkan|menjodohkan", "bentuk soal terlarang"),
    (r"\bpeluang\b", "materi Peluang"),
    (r"papan peringkat|leaderboard|\branking\b|peringkat \d|juara kelas", "peringkat"),
    (r"\bstreak\b|poin ditukar|tukar poin|hadiah (?:bagi|untuk) (?:yang|anak)", "hadiah/streak"),
    (r"gaya belajar (?:visual|auditori|kinestetik)|tipe visual|anak visual", "gaya belajar"),
    (r"jarimatika|sempoa|vedic|the king|\bgasing\b", "trik hitung bermerek"),
    (r"naik \d+ poin|2 sigma|dua sigma|dijamin (?:naik|lulus)", "janji angka"),
    (r"\bmenulis surat\b|\bmenulis pidato\b|\bkuitansi\b|daftar pustaka", "materi menulis BI"),
]


def potong_halaman(teks):
    idx = [(m.start(), m.group(1).strip()) for m in re.finditer(r"^## (.+)$", teks, re.M)]
    hal = {}
    for i, (pos, judul) in enumerate(idx):
        akhir = idx[i + 1][0] if i + 1 < len(idx) else len(teks)
        hal[judul] = teks[pos:akhir]
    return hal


def blok_soal(teks):
    """Kembalikan list dict soal: jenis, nomor, lambang, bentuk, badan, kunci(dict), periksa(list)."""
    baris = teks.splitlines()
    out = []
    i = 0
    while i < len(baris):
        m = JUDUL_SOAL.match(baris[i])
        if not m:
            i += 1
            continue
        j = i + 1
        badan, kunci_baris = [], []
        while j < len(baris) and not baris[j].startswith(("#### ", "### ", "## ")):
            if baris[j].startswith(">"):
                kunci_baris.append(baris[j][1:].strip())
            elif not kunci_baris:
                badan.append(baris[j])
            j += 1
        kunci, periksa = {}, []
        for kb in kunci_baris:
            mm = re.match(r"\*\*(.+?):\*\*\s*(.*)", kb)
            if mm:
                k, v = mm.group(1).strip(), mm.group(2).strip()
                if k == "Periksa":
                    periksa.append(v)
                else:
                    kunci[k] = v
        out.append(dict(jenis=m.group(1), nomor=int(m.group(2)), lambang=m.group(3), bentuk=m.group(4),
                        badan="\n".join(badan).strip(), kunci=kunci, periksa=periksa, baris=i + 1))
        i = j
    return out


def jalankan_periksa(ekspr):
    e = ekspr.strip()
    if e.lower().startswith("tidak ada hitungan"):
        return "lewati", None
    m = re.fullmatch(r"`(.+)`", e)
    if not m:
        return "format", "baris Periksa tidak diapit backtick"
    kode = m.group(1)
    if re.fullmatch(r"\s*(\d+)\s*==\s*\1\s*", kode):
        return "format", "hanya menulis ulang jawaban"
    try:
        hasil = eval(kode, {"__builtins__": {}}, dict(F=F, gcd=gcd, lcm=lcm, sum=sum, min=min, max=max,
                                                      abs=abs, round=round, len=len, all=all, any=any, sorted=sorted))
    except Exception as ex:  # noqa
        return "galat", f"{type(ex).__name__}: {ex}"
    return ("benar", None) if hasil is True else ("SALAH", f"bernilai {hasil!r}")


def cek_kunci_bentuk(s):
    masalah = []
    k = s["kunci"].get("Kunci", "")
    if not k:
        return ["tanpa Kunci"]
    if s["bentuk"] == "PG":
        if not re.fullmatch(r"[A-D]", k):
            masalah.append(f"kunci PG tidak valid: {k}")
        pil = re.findall(r"^([A-E])\. ", s["badan"], re.M)
        if pil and pil != ["A", "B", "C", "D"]:
            masalah.append(f"pilihan PG bukan A–D: {pil}")
    elif s["bentuk"] == "PG kompleks":
        hs = [h.strip() for h in k.split(",")]
        if len(hs) < 2 or not all(re.fullmatch(r"[A-E]", h) for h in hs):
            masalah.append(f"kunci PG kompleks tidak valid: {k}")
    else:
        pasang = re.findall(r"(\d+)-([BS])", k)
        n_baris = len(re.findall(r"^\|\s*\d+\.", s["badan"], re.M))
        if len(pasang) < 3:
            masalah.append(f"kunci PG kategori < 3 pernyataan: {k}")
        elif n_baris and n_baris != len(pasang):
            masalah.append(f"jumlah pernyataan ({n_baris}) ≠ kunci ({len(pasang)})")
        if pasang and len({b for _, b in pasang}) < 2:
            masalah.append("PG kategori tanpa campuran Benar dan Salah")
    for w in ("Petunjuk", "Langkah"):
        if w not in s["kunci"]:
            masalah.append(f"tanpa {w}")
    if not any(x.startswith("Kenapa") for x in s["kunci"]):
        masalah.append("tanpa alasan pengecoh")
    return masalah


def periksa_modul(path, rinci=False):
    teks = open(path, encoding="utf-8").read()
    nama = os.path.basename(path)
    kode = nama[:3]
    lap = []  # (butir, pesan)
    hal = potong_halaman(teks)
    # B. struktur
    judul_ada = [j for j in hal if j.startswith("Halaman")]
    if judul_ada != HALAMAN:
        lap.append((1, f"struktur halaman: {judul_ada}"))
    for n, subs in SUB_WAJIB.items():
        isi = hal.get(HALAMAN[n], "")
        for sub in subs:
            if not re.search(rf"^### {re.escape(sub)}\s*$", isi, re.M):
                lap.append((1, f"{HALAMAN[n]}: tanpa '### {sub}'"))
    # tiga salah paham
    h1 = hal.get(HALAMAN[0], "")
    sp = re.findall(r"^\|\s*[123]\s*\|", h1, re.M)
    if len(sp) < 3:
        lap.append((10, "halaman 1: kurang dari 3 salah paham"))
    h4 = hal.get(HALAMAN[3], "")
    n_bongkar = len(re.findall(r"^### Membongkar salah paham [123]", h4, re.M))
    if n_bongkar < 3 and kode not in SIM_KODE:
        lap.append((10, f"halaman 4: membongkar salah paham {n_bongkar}/3"))
    n_pancing = len(re.findall(r"^\d+\.\s", h4.split("### Penjelasan alternatif 1")[0], re.M))
    if n_pancing < 8:
        lap.append((1, f"halaman 4: pertanyaan pancingan {n_pancing}/8"))
    # C. menit
    h2 = hal.get(HALAMAN[1], "")
    menit = re.findall(r"^\|\s*(\d+)\s*[–-]\s*(\d+)\s*\|", h2, re.M)
    if menit:
        total = sum(int(b) - int(a) for a, b in menit)
        target = 100 if kode in SIM_KODE else 45
        kontinu = all(int(menit[i][1]) == int(menit[i + 1][0]) for i in range(len(menit) - 1))
        if total != target or int(menit[0][0]) != 0 or not kontinu:
            lap.append((2, f"tabel menit total {total} (target {target}), kontinu={kontinu}"))
    else:
        lap.append((2, "tabel menit tidak ditemukan"))
    # D. halaman 5
    h5 = hal.get(HALAMAN[4], "")
    soal5 = [s for s in blok_soal(h5) if s["jenis"] == "Soal"]
    if len(soal5) != 12:
        lap.append((3, f"halaman 5: {len(soal5)} soal (harus 12)"))
    kel = []
    for s in soal5:
        g = s["kunci"].get("Kelompok", "")
        kel.append("hari ini" if g.startswith("hari ini") else "minggu lalu" if g.startswith("minggu lalu")
                   else "bulan lalu" if g.startswith("bulan lalu") else "?")
    if soal5:
        n_isi = sum(1 for s in soal5 if s["lambang"] == "●")
        if n_isi != 8:
            lap.append((3, f"halaman 5: {n_isi} soal ● (harus 8)"))
        from collections import Counter
        c = Counter(kel)
        if (c["hari ini"], c["minggu lalu"], c["bulan lalu"]) != (5, 4, 3):
            lap.append((3, f"halaman 5 komposisi {dict(c)}"))
        ci = Counter(k for k, s in zip(kel, soal5) if s["lambang"] == "●")
        if (ci["hari ini"], ci["minggu lalu"], ci["bulan lalu"]) != (4, 2, 2):
            lap.append((3, f"halaman 5 soal ● per kelompok {dict(ci)} (harus 4/2/2)"))
        if kel and kel[0] == "hari ini":
            lap.append((3, "halaman 5: soal nomor 1 adalah 'hari ini'"))
        for i in range(len(kel) - 2):
            if kel[i] == kel[i + 1] == kel[i + 2]:
                lap.append((3, f"halaman 5: tiga soal berurutan '{kel[i]}' mulai nomor {i + 1}"))
        # sebaran huruf kunci PG
        huruf = Counter(s["kunci"].get("Kunci") for s in soal5 if s["bentuk"] == "PG")
        if huruf and max(huruf.values()) > 4:
            lap.append((4, f"halaman 5: sebaran kunci PG timpang {dict(huruf)}"))
    # F. tiket
    h6 = hal.get(HALAMAN[5], "")
    tiket = [s for s in blok_soal(h6) if s["jenis"] == "Tiket"]
    if len(tiket) != 3:
        lap.append((13, f"tiket keluar {len(tiket)} soal (harus 3)"))
    h7 = hal.get(HALAMAN[6], "")
    if "[nama]" not in h7:
        lap.append((14, "halaman 7 tanpa [nama]"))
    # E + A. semua soal
    semua = blok_soal(teks)
    stat = dict(benar=0, SALAH=0, galat=0, format=0, lewati=0, tanpa=0)
    for s in semua:
        if s["jenis"] == "Contoh":
            continue
        for m in cek_kunci_bentuk(s):
            lap.append((4, f"{s['jenis']} {s['nomor']} (baris {s['baris']}): {m}"))
        if not s["periksa"]:
            if kode.startswith("M") or "angka" in s["badan"]:
                lap.append((16, f"{s['jenis']} {s['nomor']} (baris {s['baris']}): tanpa baris Periksa"))
            stat["tanpa"] += 1
        for e in s["periksa"]:
            st, pesan = jalankan_periksa(e)
            stat[st] += 1
            if st in ("SALAH", "galat", "format"):
                lap.append((16, f"{s['jenis']} {s['nomor']} (baris {s['baris']}): Periksa {st} — {e} — {pesan}"))
    # G. kata terlarang (di luar tabel larangan pengajar)
    for pola, label in TERLARANG:
        for m in re.finditer(pola, teks, re.I):
            awal = teks.rfind("\n", 0, m.start()) + 1
            akhir = teks.find("\n", m.end())
            konteks = teks[awal:akhir].strip()
            if re.search(r"tidak|jangan|dilarang|bukan|nol|tanpa|tidak ada", konteks, re.I):
                continue
            lap.append((15 if label not in ("bentuk soal terlarang", "materi Peluang", "materi menulis BI") else 7,
                        f"kata terlarang ({label}): …{konteks[:90]}…"))
    # H. contoh jadi polos
    h3 = hal.get(HALAMAN[2], "")
    h3_contoh = re.split(r"^#### Terbimbing", h3, flags=re.M)[0] if h3 else ""
    for bagian in re.split(r"^### Contoh jadi", h3, flags=re.M)[1:]:
        bagian = bagian.split("#### Terbimbing")[0]
        if re.search(r"jelaskan|kenapa (?:kamu|begitu)|mengapa (?:kamu|begitu)|coba terangkan", bagian, re.I):
            lap.append((11, "halaman 3: ada perintah menjelaskan di contoh jadi"))
    return lap, stat, len(semua)


HARI_MAT = {p for p in range(1, 37) if p % 3 != 0}
BOBOT_SIM = {
    "S1": {"M01": 3, "M02": 4, "M03": 4, "M04": 5, "M05": 5, "M06": 5, "M07": 4},
    "S2": {"M09": 3, "M10": 3, "M11": 3, "M12": 3, "M13": 3, "M01": 1, "M02": 2, "M03": 2, "M04": 2, "M05": 3, "M06": 2, "M07": 3},
    "S3": {"M15": 3, "M16": 3, "M17": 3, "M18": 3, "M19": 2, "M09": 1, "M10": 2, "M11": 2, "M12": 1, "M13": 2,
           "M01": 1, "M02": 1, "M03": 1, "M04": 1, "M05": 1, "M06": 1, "M07": 2},
    "S4": {"M01": 1, "M02": 1, "M03": 1, "M04": 1, "M05": 1, "M06": 1, "M07": 1, "M13": 1, "M18": 2, "M19": 2,
           "M09": 1, "M10": 2, "M11": 2, "M12": 1, "M15": 2, "M16": 2, "M17": 2, "M21": 3, "M22": 3},
    "S5": {"B02": 4, "B03": 4, "B04": 3, "B05": 3, "B06": 2, "B07": 2, "B08": 3, "B09": 4, "B10": 3, "B11": 2},
}


def kata(s):
    return re.findall(r"[0-9A-Za-zÀ-ÿ][0-9A-Za-zÀ-ÿ.,%/'’\-]*", s)


def periksa_soal_saja(path):
    teks = open(path, encoding="utf-8").read()
    lap = []
    stat = dict(benar=0, SALAH=0, galat=0, format=0, lewati=0, tanpa=0)
    semua = [s for s in blok_soal(teks) if s["jenis"] != "Contoh"]
    for s in semua:
        for m in cek_kunci_bentuk(s):
            lap.append((4, f"{s['jenis']} {s['nomor']} (baris {s['baris']}): {m}"))
        if not s["periksa"]:
            stat["tanpa"] += 1
        for e in s["periksa"]:
            st, pesan = jalankan_periksa(e)
            stat[st] += 1
            if st in ("SALAH", "galat", "format"):
                lap.append((16, f"{s['jenis']} {s['nomor']} (baris {s['baris']}): Periksa {st} — {e} — {pesan}"))
    return teks, semua, lap, stat


def periksa_teks(path):
    teks, semua, lap, stat = periksa_soal_saja(path)
    nama = os.path.basename(path)
    m = re.match(r"T(\d\d)-", nama)
    P = int(m.group(1)) if m else 0
    bagian = re.split(r"^## ", teks, flags=re.M)
    isi = next((b for b in bagian if b.startswith("Teks")), "")
    isi = "\n".join(l for l in isi.splitlines()[1:] if not l.startswith(("|", "```", "#")))
    n = len(kata(isi))
    if not 150 <= n <= 200:
        lap.append((12, f"jumlah kata teks {n} (harus 150–200)"))
    kal = [k for k in re.split(r"(?<=[.!?])\s+|\n+", isi) if k.strip()]
    panjang = [len(kata(k)) for k in kal]
    luar = [(k.strip()[:50], p) for k, p in zip(kal, panjang) if not 3 <= p <= 7]
    if luar:
        lap.append((17, f"{len(luar)}/{len(kal)} kalimat di luar 3–7 kata: {luar[:4]}"))
    if P in HARI_MAT and not re.search(r"\d", isi):
        lap.append((12, "teks hari Matematika tanpa angka"))
    pert = [s for s in semua if s["jenis"] == "Pertanyaan"]
    if len(pert) != 2:
        lap.append((12, f"{len(pert)} pertanyaan (harus 2)"))
    if not re.search(r"[Ss]asaran waktu baca", teks):
        lap.append((12, "tanpa sasaran waktu baca"))
    return lap, stat, len(semua), n


def periksa_simulasi(path):
    teks, semua, lap, stat = periksa_soal_saja(path)
    nama = os.path.basename(path)
    butir = [s for s in semua if s["jenis"] == "Butir"]
    if len(butir) != 30:
        lap.append((3, f"{len(butir)} butir (harus 30)"))
    from collections import Counter
    bentuk = Counter(s["bentuk"] for s in butir)
    if (bentuk["PG"], bentuk["PG kompleks"], bentuk["PG kategori"]) != (18, 6, 6):
        lap.append((7, f"sebaran bentuk {dict(bentuk)} (harus PG 18, PG kompleks 6, PG kategori 6)"))
    topik = Counter()
    for s in butir:
        mm = re.search(r"\b([MB]\d\d)\b", s["kunci"].get("Kelompok", ""))
        topik[mm.group(1) if mm else "?"] += 1
    kode = nama[:2]
    if kode in BOBOT_SIM and dict(topik) != BOBOT_SIM[kode]:
        beda = {k: (topik.get(k, 0), v) for k, v in BOBOT_SIM[kode].items() if topik.get(k, 0) != v}
        lebih = {k: v for k, v in topik.items() if k not in BOBOT_SIM[kode]}
        lap.append((5, f"bobot topik tidak sesuai peta (ada, harus): {beda} · di luar peta: {lebih}"))
    return lap, stat, len(semua)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    rinci = "--rinci" in sys.argv
    if "--teks" in sys.argv or "--simulasi" in sys.argv:
        berkas = []
        for a in args:
            berkas += sorted(glob.glob(os.path.join(a, "*.md"))) if os.path.isdir(a) else [a]
        for b in berkas:
            if "--teks" in sys.argv:
                lap, stat, n, nk = periksa_teks(b)
                print(f"\n== {os.path.basename(b)} — {nk} kata · {n} soal · Periksa {stat}")
            else:
                lap, stat, n = periksa_simulasi(b)
                print(f"\n== {os.path.basename(b)} — {n} soal · Periksa {stat}")
            for butir, pesan in lap:
                print(f"  [butir {butir:2d}] {pesan}")
        sys.exit(0)
    berkas = []
    for a in args:
        berkas += sorted(glob.glob(os.path.join(a, "*.md"))) if os.path.isdir(a) else [a]
    total = dict(benar=0, SALAH=0, galat=0, format=0, lewati=0, tanpa=0)
    for b in berkas:
        lap, stat, n = periksa_modul(b, rinci)
        for k in total:
            total[k] += stat[k]
        print(f"\n== {os.path.basename(b)} — {n} soal · Periksa benar {stat['benar']}, SALAH {stat['SALAH']}, "
              f"galat {stat['galat']}, format {stat['format']}, tanpa hitungan {stat['lewati']}, tanpa baris {stat['tanpa']}")
        for butir, pesan in lap:
            print(f"  [butir {butir:2d}] {pesan}")
    print("\nTOTAL:", total)
