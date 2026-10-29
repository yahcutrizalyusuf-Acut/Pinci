import { buatTesPenempatan, tentukanLevelAwal, tesSelesai } from '../penempatan';
import { periksaKunci } from '../periksa-kunci';
import { jawab } from './bantu';

describe('tes penempatan', () => {
  it('4 soal per level, urut level 1 → 6, kunci benar, tanpa kembar', () => {
    for (let kelas = 1; kelas <= 6; kelas++) {
      const soal = buatTesPenempatan({ kelas, benih: 'p' });
      expect(soal).toHaveLength(24);
      expect(soal.map((s) => s.level)).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6]);
      expect(new Set(soal.map((s) => s.teks)).size).toBe(24);
      expect(soal.every((s) => periksaKunci(s).lulus && s.asal === 'tes')).toBe(true);
    }
    expect(buatTesPenempatan({ kelas: 6, benih: 1 })).toEqual(buatTesPenempatan({ kelas: 6, benih: 1 }));
  });

  it('berhenti di level pertama yang belum lancar', () => {
    const soal = buatTesPenempatan({ kelas: 6, benih: 'q' });
    // L1–L2 lancar, L3 satu salah
    const j = soal.filter((s) => s.level <= 3).map((s, i) => jawab(s, i !== 9, s.targetDetik * 0.5));
    expect(tesSelesai(j)).toBe(true);
    const h = tentukanLevelAwal(j);
    expect(h.levelAwal).toBe(3);
    expect(h.levelLancar).toEqual([1, 2]);
  });

  it('benar semua tetapi lewat target = belum lancar', () => {
    const soal = buatTesPenempatan({ kelas: 6, benih: 'r' });
    const j = soal.filter((s) => s.level === 1).map((s) => jawab(s, true, s.targetDetik * 1.5));
    expect(tentukanLevelAwal(j).levelAwal).toBe(1);
  });

  it('semua lancar → Level 6; dilewati (tanpa jawaban) → Level 1', () => {
    const soal = buatTesPenempatan({ kelas: 6, benih: 's' });
    const j = soal.map((s) => jawab(s, true, s.targetDetik * 0.5));
    expect(tentukanLevelAwal(j)).toMatchObject({ levelAwal: 6, levelLancar: [1, 2, 3, 4, 5, 6] });
    expect(tentukanLevelAwal([]).levelAwal).toBe(1);
    expect(tesSelesai(j.slice(0, 5))).toBe(false);
  });

  it('jawaban "Belum bisa" (null) dihitung salah', () => {
    const soal = buatTesPenempatan({ kelas: 2, benih: 't' }).filter((s) => s.level === 1);
    const j = soal.map((s, i) => ({ ...jawab(s, true, 1), jawaban: i === 0 ? null : s.kunci }));
    expect(tentukanLevelAwal(j).levelAwal).toBe(1);
  });
});
