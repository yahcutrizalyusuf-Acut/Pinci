import { bacaBilangan, hitungEkspresi, rasional, sama, teksRasional } from '../hitung';

const h = (e: string): string => teksRasional(hitungEkspresi(e));
const b = (t: string): string | null => {
  const r = bacaBilangan(t);
  return r ? teksRasional(r.nilai) : null;
};

describe('hitungEkspresi', () => {
  test('urutan pengerjaan dan kurung', () => {
    expect(h('8 + 6 * 3')).toBe('26');
    expect(h('50 - 30 / 5')).toBe('44');
    expect(h('72 / 8 * 3')).toBe('27');
    expect(h('120 - (4 + 6) * 9 / 3')).toBe('90');
    expect(h('-3 + 5')).toBe('2');
  });

  test('pecahan dan desimal eksak', () => {
    expect(h('1/2 + 1/3')).toBe('5/6');
    expect(h('0.1 + 0.2')).toBe('3/10');
    expect(h('3/4 * 120')).toBe('90');
    expect(h('(4/5) / 2')).toBe('2/5');
  });

  test('fungsi bantu', () => {
    expect(h('kpk(6, 8)')).toBe('24');
    expect(h('fpb(18, 24)')).toBe('6');
    expect(h('bulat(2350, 100)')).toBe('2400');
    expect(h('bulat(14499, 1000)')).toBe('14000');
    expect(h('akar3(1000)')).toBe('10');
    expect(h('akar2(36)')).toBe('6');
    expect(h('maks(2/3, 5/6, 3/4)')).toBe('5/6');
    expect(h('min(5/8, 1/2)')).toBe('1/2');
    expect(h('banyakfaktor(16)')).toBe('5');
  });

  test('ekspresi tidak sah ditolak', () => {
    expect(() => hitungEkspresi('1 / 0')).toThrow();
    expect(() => hitungEkspresi('2 +')).toThrow();
    expect(() => hitungEkspresi('akar3(10)')).toThrow();
    expect(() => hitungEkspresi('tidakada(1)')).toThrow();
    expect(() => hitungEkspresi('1 ^ 2')).toThrow();
  });
});

describe('bacaBilangan', () => {
  test('tulisan bilangan Indonesia', () => {
    expect(b('2.400')).toBe('2400');
    expect(b('0,75')).toBe('3/4');
    expect(b('3/4')).toBe('3/4');
    expect(b('3 3/4')).toBe('15/4');
    expect(b('2 : 3')).toBe('2/3');
    expect(b('Rp26.000')).toBe('26000');
    expect(b('49 cm²')).toBe('49');
    expect(b('90°')).toBe('90');
    expect(b('40%')).toBe('40');
    expect(b('1 : 300.000')).toBe('1/300000');
  });

  test('bukan bilangan', () => {
    expect(b('Rabu')).toBeNull();
    expect(b('07.36')).toBeNull();
  });

  test('sama membandingkan nilai', () => {
    expect(sama(rasional(BigInt(2), BigInt(4)), rasional(BigInt(1), BigInt(2)))).toBe(true);
  });
});
