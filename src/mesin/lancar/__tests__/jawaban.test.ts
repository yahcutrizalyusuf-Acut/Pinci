import { buatAcak } from '../acak';
import { cocokJawaban, tombolTambahan } from '../jawaban';

describe('cocokJawaban', () => {
  it('bilangan: nilai sama diterima, nol di depan/di belakang koma tidak berpengaruh', () => {
    const s = { kunci: '56', bentukJawaban: 'bilangan' as const };
    expect(cocokJawaban(s, '56')).toBe(true);
    expect(cocokJawaban(s, ' 56 ')).toBe(true);
    expect(cocokJawaban(s, '056')).toBe(true);
    expect(cocokJawaban(s, '56,0')).toBe(true);
    expect(cocokJawaban(s, '65')).toBe(false);
    expect(cocokJawaban(s, '')).toBe(false);
    expect(cocokJawaban(s, null)).toBe(false);
    expect(cocokJawaban(s, '112/2')).toBe(false);
    expect(cocokJawaban({ kunci: '0', bentukJawaban: 'bilangan' }, '0')).toBe(true);
  });

  it('desimal: "0,50" = "0,5" = ",5" = "0.5"', () => {
    const s = { kunci: '0,5', bentukJawaban: 'desimal' as const };
    for (const j of ['0,5', '0,50', ',5', '0.5', '0,500']) expect(cocokJawaban(s, j)).toBe(true);
    for (const j of ['5', '0,05', '1/2', ',', '0,5,0']) expect(cocokJawaban(s, j)).toBe(false);
    expect(cocokJawaban({ kunci: '0,25', bentukJawaban: 'desimal' }, '0,250')).toBe(true);
  });

  it('pecahan: harus paling sederhana', () => {
    const s = { kunci: '3/4', bentukJawaban: 'pecahan' as const };
    expect(cocokJawaban(s, '3/4')).toBe(true);
    expect(cocokJawaban(s, ' 3 / 4 ')).toBe(true);
    expect(cocokJawaban(s, '6/8')).toBe(false);
    expect(cocokJawaban(s, '0,75')).toBe(false);
    expect(cocokJawaban(s, '3/0')).toBe(false);
    expect(cocokJawaban(s, '4/3')).toBe(false);
  });

  it('tombol tambahan papan angka', () => {
    expect(tombolTambahan('bilangan')).toEqual([]);
    expect(tombolTambahan('desimal')).toEqual([',']);
    expect(tombolTambahan('pecahan')).toEqual(['/']);
  });
});

describe('buatAcak', () => {
  it('benih sama → deret sama; benih angka = benih teks', () => {
    const a = buatAcak('x');
    const b = buatAcak('x');
    const c = buatAcak(7);
    const d = buatAcak('7');
    for (let i = 0; i < 50; i++) {
      expect(a.berikut()).toBe(b.berikut());
      expect(c.bulat(1, 100)).toBe(d.bulat(1, 100));
    }
  });
  it('bulat tetap dalam batas', () => {
    const r = buatAcak('batas');
    for (let i = 0; i < 1000; i++) {
      const x = r.bulat(3, 5);
      expect(x).toBeGreaterThanOrEqual(3);
      expect(x).toBeLessThanOrEqual(5);
    }
    expect(() => r.pilih([])).toThrow();
  });
});
