"""Peta spiral FINAL (hasil penyesuaian manual atas peta_spiral.py) + pemeriksa aturan daur ulang.
Jalankan: python peta_final.py  -> mencetak tabel utama, tabel kebalikan, dan hasil pemeriksaan.
"""
import json, sys

# P: (kode, topik singkat, minggu_lalu, bulan_lalu, kuis[4], baca_cepat_q2)
R = {
 1:("M01","Diagnostik + operasi bilangan cacah",[],[],["DIAGNOSTIK"],None),
 2:("M02","Faktor, kelipatan, KPK, FPB",["M01"],["PR-M2"],["M01","M01","PR-M1","PR-M2"],None),
 3:("B01","Diagnostik + membaca soal berstimulus",[],[],["DIAGNOSTIK"],None),
 4:("M03","Pecahan senilai & membandingkan pecahan",["M02","M01"],["PR-M4"],["M02","M02","M01","PR-M4"],"B01"),
 5:("M04","Pecahan, desimal, persen",["M03","M01"],["PR-M1"],["M03","M03","M01","PR-M1"],"B01"),
 6:("B02","Informasi tersurat & kosakata dari konteks",["B01"],["PR-B1"],["B01","B01","PR-B2","PR-B1"],"B01"),
 7:("M05","Penjumlahan & pengurangan pecahan",["M04","M02"],["M01"],["M04","M04","M02","M01"],"B02"),
 8:("M06","Perkalian & pembagian pecahan",["M05","M03"],["M02"],["M05","M05","M03","M02"],"B02"),
 9:("B03","Menyusun ulang informasi",["B02","B01"],["PR-B2"],["B02","B02","B01","PR-B2"],"B02"),
 10:("M07","Operasi campuran lintas bentuk",["M06","M04"],["M03"],["M06","M06","M04","M03"],"B03"),
 11:("M08","SIMULASI 1 (M01-M07)",[],[],["SIMULASI"],"B03"),
 12:("B04","Ide pokok & gagasan pendukung",["B03","B02"],["B01"],["B03","B03","B02","B01"],"B03"),
 13:("M09","Satuan panjang, berat, volume",["M07","M06","M05"],["M01"],["M07", "M07", "M05", "M01"],"B04"),
 14:("M10","Waktu, kecepatan, laju perubahan",["M09","M07"],["M02"],["M09", "M09", "M07", "M02"],"B04"),
 15:("B05","Tokoh, peristiwa, amanat",["B04","B03"],["B01"],["B04","B04","B03","B01"],"B04"),
 16:("M11","Keliling & luas bangun datar",["M10","M09"],["M03"],["M10", "M10", "M09", "M03"],"B05"),
 17:("M12","Sudut & kekongruenan",["M11","M09"],["M04"],["M11", "M11", "M09", "M04"],"B05"),
 18:("B06","Perubahan pada tokoh & latar",["B05","B04"],["B02"],["B05","B05","B04","B02"],"B05"),
 19:("M13","Penaksiran & pembulatan",["M12","M10"],["M05"],["M12", "M12", "M10", "M05"],"B06"),
 20:("M14","SIMULASI 2 (M01-M13)",[],[],["SIMULASI"],"B06"),
 21:("B07","Makna ungkapan, idiom, majas",["B06","B05"],["B03"],["B06","B06","B05","B03"],"B06"),
 22:("M15","Volume kubus & balok",["M13","M12","M11"],["M06"],["M13", "M13", "M11", "M06"],"B07"),
 23:("M16","Luas permukaan & bangun ruang gabungan",["M15","M13"],["M07"],["M15", "M15", "M13", "M07"],"B07"),
 24:("B08","Fakta & opini",["B07","B06"],["B04"],["B07","B07","B06","B04"],"B07"),
 25:("M17","Visualisasi spasial",["M16","M15"],["M09"],["M16", "M16", "M15", "M09"],"B08"),
 26:("M18","Rasio & perbandingan",["M17","M15"],["M10"],["M17", "M17", "M15", "M10"],"B08"),
 27:("B09","Membaca infografik, grafik, tabel",["B08","B07"],["B05"],["B08","B08","B07","B05"],"B08"),
 28:("M19","Perbandingan senilai, berbalik nilai, skala",["M18","M16"],["M11"],["M18", "M18", "M16", "M11"],"B09"),
 29:("M20","SIMULASI 3 (M01-M19)",[],[],["SIMULASI"],"B09"),
 30:("B10","Menilai relevansi & kesesuaian",["B09","B08"],["B06"],["B09","B09","B08","B06"],"B09"),
 31:("M21","Piktogram, diagram batang, tabel frekuensi",["M19","M18","M17"],["M12"],["M19", "M19", "M17", "M12"],"B10"),
 32:("M22","Menafsirkan data & rata-rata",["M21","M19"],["M13"],["M21", "M21", "M19", "M13"],"B10"),
 33:("B11","Puisi & respons emosional",["B10","B09"],["B07"],["B10","B10","B09","B07"],"B10"),
 34:("M23","Latihan PG kompleks & kategori",["M22","M21"],["M15"],["M22", "M22", "M21", "M15"],"B11"),
 35:("M24","Latihan bertempo + SIMULASI AKHIR (M01-M23)",[],[],["SIMULASI"],"B11"),
 36:("B12","Latihan bentuk soal + bertempo + SIMULASI AKHIR (B01-B11)",[],[],["SIMULASI"],"B11"),
}
SIM = {"M08": range(1, 8), "M14": range(1, 14), "M20": range(1, 20), "M24": range(1, 24), "B12": range(1, 12)}
ISI_M = [f"M{j:02d}" for j in range(1, 23) if j not in (8, 14, 20)]
ISI_B = [f"B{k:02d}" for k in range(1, 12)]
P_OF = {v[0]: p for p, v in R.items()}

def muncul(kode):
    """Semua kemunculan kembali: (P, cara)."""
    out = []
    for p, (kd, _, ml, bl, kuis, bc) in R.items():
        if p <= P_OF[kode]:
            continue
        if kode in ml or kode in bl:
            out.append((p, "latihan"))
        elif kode in kuis:
            out.append((p, "kuis"))
        if bc == kode:
            out.append((p, "baca cepat"))
        if kd in SIM and int(kode[1:]) in SIM[kd] and kd[0] == kode[0]:
            out.append((p, "simulasi"))
    return sorted(set(out))

def cek():
    hasil = []
    for kode in ISI_M + ISI_B:
        P0 = P_OF[kode]
        ps = [p for p, _ in muncul(kode)]
        w = {"J1 (1-2)": any(P0 + 1 <= p <= P0 + 2 for p in ps),
             "J2 (4-6)": any(P0 + 4 <= p <= P0 + 6 for p in ps),
             "J3 (10-14)": any(P0 + 10 <= p <= P0 + 14 for p in ps)}
        hasil.append((kode, P0, len(ps), w))
    return hasil

if __name__ == "__main__":
    print("P | kode | ML | BL | kuis | BC")
    for p, v in R.items():
        print(p, v[0], v[2], v[3], v[4], v[5])
    print("\nKEBALIKAN + CEK")
    for kode, P0, n, w in cek():
        ok = "OK " if n >= 3 else "KURANG"
        print(f"{kode} P{P0:02d} muncul={n:2d} {ok} " + " ".join(f"{k}:{'ya' if v else 'TIDAK'}" for k, v in w.items()),
              [f"P{p:02d}/{R[p][0]}/{c}" for p, c in muncul(kode)])
    json.dump({"R": R, "muncul": {k: muncul(k) for k in ISI_M + ISI_B}}, open("peta_final.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
