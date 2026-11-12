import { cocokJawaban } from '../lancar';
import { buatLembarKilat, detikPerSoal, hitungKilat, jumlahSoal, rekorTahap, semuaSoal, TAHAP_KILAT, tahapMaks, tahapSekarang, targetDetik, tulisWaktu, type HasilLembarKilat } from '../kilat';

describe('mesin Hitung Kilat', () => {
  it('7 tahap; kelas 1–2 berhenti di tahap 3 dengan 30 soal, kelas 3–6 sampai tahap 7 dengan 50 soal', () => {
    expect(TAHAP_KILAT.map((t) => t.no)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect([tahapMaks(1), tahapMaks(2), tahapMaks(3), tahapMaks(6)]).toEqual([3, 3, 7, 7]);
    expect([jumlahSoal(2), jumlahSoal(4)]).toEqual([30, 50]);
    expect([targetDetik(1), targetDetik(5)]).toEqual([4, 3]);
  });

  it('semua bilangan di soal di bawah 10 (pembagian: pembagi dan hasil di bawah 10), hasil bilangan cacah', () => {
    for (const op of ['+', '-', '×', ':'] as const) {
      for (const [a, b] of semuaSoal(op)) {
        const h = hitungKilat(a, op, b);
        expect(Number.isInteger(h) && h >= 0).toBe(true);
        if (op === ':') {
          expect(b).toBeLessThan(10);
          expect(h).toBeLessThan(10);
        } else {
          expect(a).toBeLessThan(10);
          expect(b).toBeLessThan(10);
        }
      }
    }
    expect(semuaSoal('×')).toHaveLength(81);
    expect(semuaSoal(':')).toHaveLength(81);
  });

  it('lembar: jumlah sesuai kelas, operasi sesuai tahap, kunci dihitung kode, tidak ada dua soal sama berurutan, tetap untuk benih sama', () => {
    for (const t of TAHAP_KILAT) {
      const l = buatLembarKilat(t.no, 4, 'uji');
      expect(l).toHaveLength(50);
      for (let i = 0; i < l.length; i++) {
        const [a, op, b] = l[i].teks.split(' ');
        expect(t.operasi).toContain(op);
        expect(l[i].kunci).toBe(String(hitungKilat(Number(a), op as never, Number(b))));
        expect(cocokJawaban(l[i], l[i].kunci)).toBe(true);
        if (i) expect(l[i].teks).not.toBe(l[i - 1].teks);
      }
      expect(buatLembarKilat(t.no, 4, 'uji').map((s) => s.teks)).toEqual(l.map((s) => s.teks));
    }
    expect(buatLembarKilat(1, 2, 'x')).toHaveLength(30);
    expect(new Set(buatLembarKilat(7, 5, 'campur').map((s) => s.teks.split(' ')[1])).size).toBe(4);
  });

  const h = (tahap: number, benar: number, detik: number, hari: number): HasilLembarKilat => ({ tahap, benar, jumlah: 50, detik, mulai: new Date(2026, 10, hari).toISOString() });

  it('naik tahap setelah 2 lembar berturut ≥ 95% tepat dan ≤ target detik; tidak pernah turun', () => {
    expect(tahapSekarang([], 4)).toBe(1);
    expect(tahapSekarang([h(1, 49, 140, 1)], 4)).toBe(1);
    expect(tahapSekarang([h(1, 49, 140, 1), h(1, 48, 145, 2)], 4)).toBe(2);
    // lembar lambat (4 dtk/soal) memutus hitungan
    expect(tahapSekarang([h(1, 49, 140, 1), h(1, 50, 200, 2), h(1, 49, 140, 3)], 4)).toBe(1);
    // kurang tepat memutus hitungan
    expect(tahapSekarang([h(1, 49, 140, 1), h(1, 40, 100, 2), h(1, 49, 140, 3)], 4)).toBe(1);
    // lembar tahap lama tidak memengaruhi
    expect(tahapSekarang([h(1, 49, 140, 1), h(1, 49, 140, 2), h(1, 10, 400, 3)], 4)).toBe(2);
    // kelas 2 berhenti di tahap 3 (target 4 dtk, 30 soal)
    const k2 = (t: number, d: number) => ({ tahap: t, benar: 30, jumlah: 30, detik: 100, mulai: new Date(2026, 10, d).toISOString() });
    expect(tahapSekarang([k2(1, 1), k2(1, 2), k2(2, 3), k2(2, 4), k2(3, 5), k2(3, 6)], 2)).toBe(3);
  });

  it('rekor hanya dari lembar ≥ 95% tepat; tulisan waktu dan detik per soal', () => {
    expect(rekorTahap([h(1, 40, 90, 1), h(1, 49, 130, 2), h(1, 50, 120, 3)], 1)).toBe(120);
    expect(rekorTahap([h(1, 40, 90, 1)], 1)).toBeNull();
    expect(tulisWaktu(125)).toBe('2:05');
    expect(detikPerSoal({ detik: 125, jumlah: 50 })).toBe(2.5);
  });
});
