import { paketGudang } from '../../isi/gudang/paket';
import type { SoalKartu } from '../../isi/gudang/jenis';
import { cocokIsian } from '../gudang';

const soal = (kunci: string): SoalKartu => ({ id: 'x', pertanyaan: '', bentuk: 'isian', kunci, petunjuk: ['a', 'b', 'c'], pembahasan: '', tingkat: 'mudah' });

test('isian dibandingkan sebagai bilangan', () => {
  expect(cocokIsian(soal('65.000'), '65000')).toBe(true);
  expect(cocokIsian(soal('65.000'), '65.000')).toBe(true);
  expect(cocokIsian(soal('3 3/4'), '15/4')).toBe(true);
  expect(cocokIsian(soal('0,75'), '0.75')).toBe(true);
  expect(cocokIsian(soal('0,75'), '3/4')).toBe(true);
  expect(cocokIsian(soal('26'), '25')).toBe(false);
  expect(cocokIsian(soal('26'), '')).toBe(false);
});

test('semua kunci isian cocok dengan dirinya sendiri dan tanpa titik ribuan', () => {
  for (const m of paketGudang.mapel)
    for (const t of m.topik)
      for (const s of t.kartu?.soal ?? []) {
        expect(cocokIsian(s, s.kunci)).toBe(true);
        if (s.bentuk === 'isian') expect(cocokIsian(s, s.kunci.replace(/\./g, ''))).toBe(true);
      }
});
