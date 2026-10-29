import type { StatusPeriksa } from '../jenis';

test('jest berjalan', () => {
  const s: StatusPeriksa = 'belum_diperiksa';
  expect(s).toBe('belum_diperiksa');
});
