"""Mengganti rujukan teks baca cepat yang belum lengkap (mis. `T13-….md`, **T13** tanpa judul)
di modul dengan nama berkas dan judul yang sebenarnya dari 03-bank-teks-baca-cepat/."""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
teks = {}
for f in glob.glob(os.path.join(ROOT, "03-bank-teks-baca-cepat", "T??-*.md")):
    n = os.path.basename(f)[:3]
    judul = re.search(r"^# (.+)$", open(f, encoding="utf-8").read(), re.M).group(1)
    teks[n] = (os.path.basename(f), judul.split("—", 1)[-1].strip())

ubah = 0
for f in glob.glob(os.path.join(ROOT, "0[12]-modul-*", "*.md")):
    s = open(f, encoding="utf-8").read()
    asli = s
    s = re.sub(r"(T\d\d)-(?:…|\.\.\.|<[^>]*>|\*)+\.md",
               lambda m: teks[m.group(1)][0] if m.group(1) in teks else m.group(0), s)
    s = re.sub(r"\*\*(T\d\d)\*\* \(lihat",
               lambda m: f"**{m.group(1)} — {teks[m.group(1)][1]}** (lihat" if m.group(1) in teks else m.group(0), s)
    s = re.sub(r"\*\*(T\d\d) — <judul>\*\*",
               lambda m: f"**{m.group(1)} — {teks[m.group(1)][1]}**" if m.group(1) in teks else m.group(0), s)
    if s != asli:
        open(f, "w", encoding="utf-8").write(s)
        ubah += 1
        print("dirapikan", os.path.basename(f))
print("berkas diubah:", ubah)
