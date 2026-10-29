import * as fs from 'fs';
import * as path from 'path';

import { hitungEkspresi, jalankanPeriksa } from '../ekspresi-python';
import type { Butir, ButirPG, PaketTka } from '../jenis';
import { butirMatematika, hitungEkspresiIndonesia, periksaKunci } from '../periksa-kunci';
import { semuaButir } from '../pemuat';
import { bulatkan, dariBulat, dariDesimal, keTeks } from '../rasional';

const paket: PaketTka = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../assets/paket/tka-k6.json'), 'utf8'));
const butir = semuaButir(paket);

describe('penilai ekspresi Periksa (tiruan periksa.py)', () => {
  test.each([
    ['`lcm(6, 8) == 24`', 'benar'],
    ['`gcd(45, 60) == 15`', 'benar'],
    ["`F(3,4) / F(1,8) == 6`", 'benar'],
    ["`F('0.75') == F(3, 4)`", 'benar'],
    ['`(12 + 15 + 9 + 20) / 4 == 14`', 'benar'],
    ['`4725 // 100 % 10 * 100 == 700`', 'benar'],
    ['`round(4672, -2) == 4700`', 'benar'],
    ['`round(F(\'2.5\')) == 2`', 'benar'], // Python: setengah ke genap
    ['`sum(1 for x in [2, 0, 1, 3, 1, 1] if x > 0) != 6`', 'benar'],
    ['`sorted([7, 5, 9, 4])[-2] == 7`', 'benar'],
    ['`[max(3, 1), max(1, 2)] == [3, 2]`', 'benar'],
    ['`max([F(2, 3), F(3, 4), F(5, 6), F(7, 12)]) == F(5, 6)`', 'benar'],
    ['`(2, 1, 1) != (3, 1, 1)`', 'benar'],
    ['`12 + 15 + 9 + 20 == 55`', 'salah'],
    ['`24 == 24`', 'format'],
    ['lcm(6, 8) == 24', 'format'],
    ['tidak ada hitungan', 'lewati'],
    ['`foo(1) == 1`', 'galat'],
  ])('%s → %s', (baris, hasil) => {
    expect(jalankanPeriksa(baris).hasil).toBe(hasil);
  });

  test('hasil yang bukan True dianggap salah, sama seperti periksa.py', () => {
    expect(jalankanPeriksa('`3 + 4`').hasil).toBe('salah');
    expect(hitungEkspresi('1 + 1')).toEqual({ t: 'angka', v: dariBulat(2) });
  });

  test('pembulatan setengah ke genap', () => {
    expect(keTeks(bulatkan(dariDesimal('0.5') ?? dariBulat(0)))).toBe('0');
    expect(keTeks(bulatkan(dariDesimal('1.5') ?? dariBulat(0)))).toBe('2');
    expect(keTeks(bulatkan(dariBulat(250), -2))).toBe('200');
  });
});

describe('hitungan bahasa Indonesia', () => {
  test.each([
    ['48 : 6 + 2 × 3', '14'],
    ['(36 − 6) : 3', '10'],
    ['3/4 + 1 1/2', '9/4'],
    ['{3/4} : {1/8}', '6'],
    ['3,5 × 1.000', '3500'],
    ['0,5 + 5%', '11/20'],
  ])('%s = %s', (e, v) => {
    const h = hitungEkspresiIndonesia(e);
    expect(h && keTeks(h)).toBe(v);
  });
});

describe('periksaKunci pada butir buatan', () => {
  const dasar: ButirPG = {
    id: 'U-1',
    asal: 'soal_kelas',
    sumber: 'M02',
    baris: 1,
    topik: 'M02',
    pertanyaan: 'Berapa KPK dari 4 dan 10?',
    pilihan: [
      { huruf: 'A', teks: '2' },
      { huruf: 'B', teks: '14' },
      { huruf: 'C', teks: '20' },
      { huruf: 'D', teks: '40' },
    ],
    pengecoh: {},
    periksa: ['`lcm(4, 10) == 20`'],
    status: 'belum_diperiksa',
    bentuk: 'pg',
    kunci: 'C',
  };

  test('kunci benar → dihitung ulang tanpa temuan', () => {
    const h = periksaKunci(dasar);
    expect(h.temuan).toEqual([]);
    expect(h.dihitungUlang).toBe(true);
    expect(h.hitungMandiri?.hasil).toBe('cocok');
    expect(h.kaitan).toBe('cocok');
  });

  test('kunci salah tulis → temuan dari hitung mandiri dan kaitan Periksa', () => {
    const h = periksaKunci({ ...dasar, kunci: 'D' });
    expect(h.temuan.length).toBe(2);
    expect(h.dihitungUlang).toBe(false);
  });

  test('baris Periksa yang bernilai salah menjadi temuan', () => {
    const h = periksaKunci({ ...dasar, periksa: ['`lcm(4, 10) == 40`'] });
    expect(h.temuan.some((t) => t.startsWith('Periksa salah'))).toBe(true);
  });

  test('soal tanpa hitungan tidak bisa dihitung ulang, tetapi bukan temuan', () => {
    const h = periksaKunci({ ...dasar, pertanyaan: 'Bangun apakah itu?', pilihan: dasar.pilihan.map((p) => ({ ...p, teks: `gambar ${p.huruf}` })), periksa: ['tidak ada hitungan'] });
    expect(h.temuan).toEqual([]);
    expect(h.dihitungUlang).toBe(false);
  });

  test('PG kompleks dinilai per pilihan', () => {
    const b: Butir = {
      ...dasar,
      bentuk: 'pgk',
      pertanyaan: 'Pilih **semua** bilangan yang merupakan kelipatan 6.',
      pilihan: ['3', '12', '16', '30', '36'].map((teks, i) => ({ huruf: 'ABCDE'[i], teks })),
      kunci: ['B', 'D', 'E'],
      periksa: [],
    };
    expect(periksaKunci(b).hitungMandiri?.hasil).toBe('cocok');
    expect(periksaKunci({ ...b, kunci: ['B', 'D'] }).temuan.length).toBe(1);
  });
});

describe('paket sungguhan', () => {
  const mat = butir.filter(butirMatematika);

  test('semua baris Periksa di paket bernilai benar', () => {
    for (const b of butir) for (const e of b.periksa ?? []) expect(['benar', 'lewati']).toContain(jalankanPeriksa(e).hasil);
  });

  test('status perlu_dicek hanya dan selalu untuk butir bertemuan pemeriksa kunci', () => {
    for (const b of mat) {
      const ada = periksaKunci(b).temuan.length > 0;
      if (ada) expect(b.status).toBe('perlu_dicek');
    }
    for (const b of butir) if (b.status === 'perlu_dicek') expect(b.catatan?.some((c) => c.startsWith('pemeriksa kunci') || c.startsWith('memuat istilah keagamaan'))).toBe(true);
  });

  test('sebagian besar kunci Matematika dihitung ulang (≥ 85%)', () => {
    const berhasil = mat.filter((b) => periksaKunci(b).dihitungUlang).length;
    expect(berhasil / mat.length).toBeGreaterThanOrEqual(0.85);
  });

  test('uji mutasi: kunci PG yang dihitung ulang langsung ketahuan bila hurufnya diganti', () => {
    for (const b of mat) {
      if (b.bentuk !== 'pg') continue;
      const h = periksaKunci(b);
      if (!h.dihitungUlang) continue;
      const lain = b.pilihan.find((p) => p.huruf !== b.kunci)?.huruf ?? 'A';
      expect(periksaKunci({ ...b, kunci: lain }).temuan.length).toBeGreaterThan(0);
    }
  });
});
