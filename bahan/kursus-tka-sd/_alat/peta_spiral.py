"""Menyusun dan memeriksa peta spiral Paket Siap TKA SD.

Satuan jarak = pertemuan keseluruhan (P01-P36).
Minggu k: Senin P(3k-2) = M(2k-1), Rabu P(3k-1) = M(2k), Jumat P(3k) = B(k).
Jendela daur ulang tiap topik yang diajarkan di P:
  J1 = P+1..P+2, J2 = P+4..P+6, J3 = P+10..P+14.
"""
import json, sys

MAT = {
 1:"Diagnostik + operasi bilangan cacah", 2:"Faktor, kelipatan, KPK, FPB",
 3:"Pecahan senilai & membandingkan pecahan", 4:"Pecahan, desimal, persen",
 5:"Penjumlahan & pengurangan pecahan", 6:"Perkalian & pembagian pecahan",
 7:"Operasi campuran lintas bentuk", 8:"SIMULASI 1",
 9:"Satuan panjang, berat, volume", 10:"Waktu, kecepatan, laju perubahan",
 11:"Keliling & luas bangun datar", 12:"Sudut & kekongruenan",
 13:"Penaksiran & pembulatan", 14:"SIMULASI 2",
 15:"Volume kubus & balok", 16:"Luas permukaan & bangun ruang gabungan",
 17:"Visualisasi spasial", 18:"Rasio & perbandingan",
 19:"Perbandingan senilai, berbalik nilai, skala", 20:"SIMULASI 3",
 21:"Piktogram, diagram batang, tabel frekuensi", 22:"Menafsirkan data & rata-rata",
 23:"Latihan PG kompleks & kategori", 24:"Latihan bertempo + simulasi akhir",
}
BI = {
 1:"Diagnostik + membaca soal berstimulus", 2:"Informasi tersurat & kosakata dari konteks",
 3:"Menyusun ulang informasi", 4:"Ide pokok & gagasan pendukung",
 5:"Tokoh, peristiwa, amanat", 6:"Perubahan pada tokoh & latar",
 7:"Makna ungkapan, idiom, majas", 8:"Fakta & opini",
 9:"Membaca infografik, grafik, tabel", 10:"Menilai relevansi & kesesuaian",
 11:"Puisi & respons emosional", 12:"Latihan bentuk soal + bertempo + simulasi akhir",
}
SIM_M = {8, 14, 20, 24}
SIM_B = {12}

def p_of_m(j):
    k = (j + 1) // 2
    return 3 * k - 2 if j % 2 == 1 else 3 * k - 1

def p_of_b(k):
    return 3 * k

sesi = {}  # P -> dict
for j in MAT:
    sesi[p_of_m(j)] = dict(kode=f"M{j:02d}", mapel="Matematika", topik=MAT[j], sim=j in SIM_M, n=j)
for k in BI:
    sesi[p_of_b(k)] = dict(kode=f"B{k:02d}", mapel="Bahasa Indonesia", topik=BI[k], sim=k in SIM_B, n=k)

# topik isi yang wajib didaur ulang (bukan simulasi / latihan bentuk)
ISI_M = [j for j in MAT if j not in SIM_M and j != 23]
ISI_B = [k for k in BI if k not in SIM_B]

def windows(P):
    return {"J1": range(P + 1, P + 3), "J2": range(P + 4, P + 7), "J3": range(P + 10, P + 15)}

# Penugasan: untuk tiap topik & jendela, pilih pertemuan TERAWAL di jendela itu
# pada aliran mapel yang sama yang BUKAN simulasi. Kalau hanya ada simulasi, simulasi dihitung.
tugas = {P: {"J1": [], "J2": [], "J3": []} for P in sesi}
kembali = {}  # kode topik -> list (P, jendela, cara)
catatan_pengecualian = []

def aliran(mapel):
    return sorted(P for P, s in sesi.items() if s["mapel"] == mapel)

for mapel, isi, kode_fn, pfn in (("Matematika", ISI_M, lambda j: f"M{j:02d}", p_of_m),
                                  ("Bahasa Indonesia", ISI_B, lambda k: f"B{k:02d}", p_of_b)):
    for t in isi:
        P0 = pfn(t); kd = kode_fn(t)
        kembali[kd] = []
        for jn, rg in windows(P0).items():
            kand = [P for P in rg if P in sesi and sesi[P]["mapel"] == mapel]
            non_sim = [P for P in kand if not sesi[P]["sim"]]
            if mapel == "Bahasa Indonesia" and not kand:
                # BI 1x seminggu: J1 dijalankan lewat pertanyaan ke-2 baca cepat hari Matematika
                mat_days = [P for P in rg if P in sesi]
                if mat_days:
                    kembali[kd].append((mat_days[0], jn, "baca cepat"))
                    tugas[mat_days[0]].setdefault("BC", []).append(kd)
                    continue
            if non_sim:
                P = non_sim[0]
                tugas[P][jn].append(kd); kembali[kd].append((P, jn, "modul"))
            elif kand:
                P = kand[0]
                kembali[kd].append((P, jn, "simulasi"))
            else:
                catatan_pengecualian.append((kd, jn))

# Pengecualian: topik yang jendelanya lewat P36 -> muncul di simulasi akhir & sisa pertemuan
for kd, jn in catatan_pengecualian:
    mapel = "Matematika" if kd[0] == "M" else "Bahasa Indonesia"
    P0 = [P for P, s in sesi.items() if s["kode"] == kd][0]
    already = {x[0] for x in kembali[kd]}
    later = [P for P in aliran(mapel) if P > P0 + 2 and P not in already]
    if later:
        P = later[-1]
        cara = "simulasi" if sesi[P]["sim"] else "modul"
        kembali[kd].append((P, jn + "*", cara))
        if cara == "modul":
            tugas[P][jn].append(kd)

# Penyangga: pertemuan yang belum punya topik minggu lalu / bulan lalu
# pakai topik isi terdekat yang sudah lewat >= 3 pertemuan, atau prasyarat kelas 4.
def isi_sebelum(P, mapel, jarak_min):
    lst = [Q for Q in aliran(mapel) if Q <= P - jarak_min and not sesi[Q]["sim"]
           and sesi[Q]["kode"] not in ("M23",)]
    return [sesi[Q]["kode"] for Q in lst]

tabel = []
for P in sorted(sesi):
    s = sesi[P]; t = tugas[P]
    mapel = s["mapel"]
    prev = [Q for Q in aliran(mapel) if Q < P]
    prev_kode = sesi[prev[-1]]["kode"] if prev else None
    ml = sorted(set(t["J1"] + t["J2"]))
    bl = sorted(set(t["J3"]))
    pengganti_ml = pengganti_bl = False
    if not s["sim"]:
        if not ml:
            cand = isi_sebelum(P, mapel, 1)
            ml = cand[-1:] if cand else ["PRASYARAT"]; pengganti_ml = True
        if not bl:
            cand = [c for c in isi_sebelum(P, mapel, 6) if c not in ml]
            bl = cand[:1] if cand else ["PRASYARAT"]; pengganti_bl = True
    tabel.append(dict(P=P, **s, minggu_lalu=ml, bulan_lalu=bl, bc=t.get("BC", []),
                      pengganti_ml=pengganti_ml, pengganti_bl=pengganti_bl, prev=prev_kode))

if __name__ == "__main__":
    for r in tabel:
        print(f"P{r['P']:02d} {r['kode']} {r['topik'][:38]:38s} ML={r['minggu_lalu']}{'*' if r['pengganti_ml'] else ''} "
              f"BL={r['bulan_lalu']}{'*' if r['pengganti_bl'] else ''} BC={r['bc']} prev={r['prev']}")
    print()
    for kd, lst in kembali.items():
        print(kd, [(f"P{p:02d}", sesi[p]['kode'], j, c) for p, j, c in lst])
    print("\nPENGECUALIAN:", catatan_pengecualian)
    json.dump(dict(tabel=tabel, kembali={k: [(p, sesi[p]['kode'], j, c) for p, j, c in v] for k, v in kembali.items()}),
              open(sys.argv[1] if len(sys.argv) > 1 else "peta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
