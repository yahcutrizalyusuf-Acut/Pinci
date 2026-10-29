import { cocokJawaban } from '../jawaban';
import type { SoalLancar } from '../jenis';
import { buatLembar, komposisiLembar, sumberLama } from '../lembar';
import { ambilLevel, LEVEL_LANCAR } from '../level';
import { periksaKunci } from '../periksa-kunci';

const BENIH_PER_LEVEL = 225; // 6 kelas × 6 level × 225 benih = 8.100 lembar

describe('8.100 lembar acak', () => {
  it('semua kunci lulus pemeriksa, tanpa soal kembar, urut mudah→sulit, 20 soal 14 + 6', () => {
    let jumlahLembar = 0;
    let jumlahSoal = 0;
    const gagal: string[] = [];
    for (let kelas = 1; kelas <= 6; kelas++) {
      for (let level = 1; level <= 6; level++) {
        const sumber = sumberLama(kelas, level, 6);
        for (let b = 0; b < BENIH_PER_LEVEL; b++) {
          const lembar = buatLembar({ kelas, level, benih: b });
          jumlahLembar++;
          const { soal } = lembar;
          expect(soal).toHaveLength(20);
          expect(new Set(soal.map((s) => s.teks)).size).toBe(20);
          expect(new Set(soal.map((s) => s.id)).size).toBe(20);
          for (let i = 1; i < soal.length; i++) {
            if ((soal[i] as SoalLancar).tingkat < (soal[i - 1] as SoalLancar).tingkat) gagal.push(`urutan K${kelas}L${level} benih ${b}`);
          }
          const baru = soal.filter((s) => s.asal === 'baru');
          const lama = soal.filter((s) => s.asal === 'lama');
          if (sumber.length === 0) {
            expect(baru).toHaveLength(20);
          } else {
            expect(baru).toHaveLength(14);
            expect(lama).toHaveLength(6);
            for (const sb of sumber) {
              expect(lama.filter((s) => s.kelas === sb.kelas && s.level === sb.level)).toHaveLength(sb.n);
            }
          }
          expect(baru.every((s) => s.kelas === kelas && s.level === level)).toBe(true);
          for (const s of soal) {
            jumlahSoal++;
            const h = periksaKunci(s);
            if (!h.lulus) gagal.push(`${s.teks} [${s.kunci}] ${h.alasan ?? ''}`);
            if (s.teks.includes('÷')) gagal.push(`÷ di ${s.teks}`);
            if (!cocokJawaban(s, s.kunci)) gagal.push(`kunci tidak cocok sendiri: ${s.teks}`);
            if (!(s.tingkat > 0 && s.tingkat < 1)) gagal.push(`tingkat ${s.tingkat} di ${s.teks}`);
            if (s.targetDetik !== ambilLevel(s.kelas, s.level).targetDetik) gagal.push(`target ${s.teks}`);
          }
        }
      }
    }
    expect(jumlahLembar).toBe(8100);
    expect(jumlahSoal).toBe(162000);
    expect(gagal.slice(0, 20)).toEqual([]);
  });
});

describe('benih', () => {
  it('benih sama → lembar sama (angka dan teks)', () => {
    const a = buatLembar({ kelas: 6, level: 2, benih: 'abc' });
    const b = buatLembar({ kelas: 6, level: 2, benih: 'abc' });
    expect(b).toEqual(a);
    expect(buatLembar({ kelas: 3, level: 4, benih: 42 })).toEqual(buatLembar({ kelas: 3, level: 4, benih: 42 }));
    expect(buatLembar({ kelas: 3, level: 4, benih: 42 })).toEqual(buatLembar({ kelas: 3, level: 4, benih: '42' }));
  });
  it('benih berbeda → lembar berbeda', () => {
    const a = buatLembar({ kelas: 6, level: 2, benih: 'abc' }).soal.map((s) => s.teks);
    const b = buatLembar({ kelas: 6, level: 2, benih: 'abd' }).soal.map((s) => s.teks);
    expect(b).not.toEqual(a);
  });
});

describe('susunan lembar', () => {
  it('selipan bertahap: lembar ke-1 8 + 12, ke-2 11 + 9, sesudahnya 14 + 6', () => {
    expect(komposisiLembar(1)).toEqual({ baru: 8, lama: 12 });
    expect(komposisiLembar(2)).toEqual({ baru: 11, lama: 9 });
    expect(komposisiLembar(3)).toEqual({ baru: 14, lama: 6 });
    for (const [ke, nBaru] of [[1, 8], [2, 11], [5, 14]] as const) {
      for (let b = 0; b < 30; b++) {
        const l = buatLembar({ kelas: 4, level: 4, benih: b, lembarKe: ke });
        expect(l.soal).toHaveLength(20);
        expect(l.soal.filter((s) => s.asal === 'baru')).toHaveLength(nBaru);
        expect(l.soal.every((s) => periksaKunci(s).lulus)).toBe(true);
      }
    }
  });

  it('level 1 kelas 2–6 mengambil 6 soal dari level 6 kelas sebelumnya', () => {
    const l = buatLembar({ kelas: 6, level: 1, benih: 1 });
    const lama = l.soal.filter((s) => s.asal === 'lama');
    expect(lama).toHaveLength(6);
    expect(lama.every((s) => s.kelas === 5 && s.level === 6)).toBe(true);
  });

  it('soal ulang diselipkan (paling banyak 4), menggantikan soal level ini', () => {
    const lalu = buatLembar({ kelas: 3, level: 3, benih: 'lalu' }).soal;
    const ulang = lalu.slice(0, 6);
    const l = buatLembar({ kelas: 3, level: 3, benih: 'kini', soalUlang: ulang });
    const disisip = l.soal.filter((s) => s.asal === 'ulang');
    expect(disisip).toHaveLength(4);
    expect(disisip.map((s) => s.teks).sort()).toEqual(ulang.slice(0, 4).map((s) => s.teks).sort());
    expect(l.soal).toHaveLength(20);
    expect(new Set(l.soal.map((s) => s.teks)).size).toBe(20);
    expect(l.soal.filter((s) => s.asal === 'baru')).toHaveLength(10);
    expect(l.soal.filter((s) => s.asal === 'lama')).toHaveLength(6);
  });

  it('soal ulang dari level yang lebih tinggi tidak diselipkan', () => {
    const tinggi = buatLembar({ kelas: 3, level: 5, benih: 'x' }).soal.filter((s) => s.level === 5);
    const l = buatLembar({ kelas: 3, level: 3, benih: 'y', soalUlang: tinggi });
    expect(l.soal.some((s) => s.asal === 'ulang')).toBe(false);
  });

  it('lembar daya tahan: 6 soal dari level yang diuji', () => {
    const l = buatLembar({ kelas: 6, level: 5, benih: 'dt', levelDayaTahan: 1 });
    const dt = l.soal.filter((s) => s.asal === 'daya_tahan');
    expect(dt).toHaveLength(6);
    expect(dt.every((s) => s.level === 1)).toBe(true);
    expect(l.soal.filter((s) => s.asal === 'baru')).toHaveLength(14);
  });

  it('target lembar = jumlah target per soal', () => {
    const l = buatLembar({ kelas: 6, level: 5, benih: 7 });
    // 14 × 7 + 4 × 5 + 2 × 6 = 130 (04-mesin-lancar.md bagian 4.1)
    expect(l.targetDetik).toBe(130);
  });

  it('kelas 6 sesuai keputusan: L2 pecahan/persen/desimal, L3 KPK/FPB', () => {
    const k6 = LEVEL_LANCAR[5] ?? [];
    expect(k6.map((d) => d.targetDetik)).toEqual([4, 5, 6, 5, 7, 5.5]);
    const l2 = buatLembar({ kelas: 6, level: 2, benih: 3 }).soal.filter((s) => s.asal === 'baru');
    expect(l2.every((s) => / = … /.test(s.teks))).toBe(true);
    const l3 = buatLembar({ kelas: 6, level: 3, benih: 3 }).soal.filter((s) => s.asal === 'baru');
    expect(l3.every((s) => /^(KPK|FPB) \d+ dan \d+$/.test(s.teks))).toBe(true);
    expect(LEVEL_LANCAR.map((k) => k.length)).toEqual([6, 6, 6, 6, 6, 6]);
  });
});
