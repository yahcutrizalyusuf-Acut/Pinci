import { daftarPerintah, PERINTAH_DASAR } from '../perintahGerak';

test('Tebak Gerak: ± 20 perintah dasar belum diperiksa, ditambah kata kerja unit tanpa kembar', () => {
  expect(PERINTAH_DASAR.length).toBeGreaterThanOrEqual(18);
  expect(PERINTAH_DASAR.every((p) => p.status === 'belum_diperiksa')).toBe(true);
  const semua = daftarPerintah(6);
  expect(semua.length).toBeGreaterThanOrEqual(PERINTAH_DASAR.length);
  const nama = semua.map((p) => p.inggris.toLowerCase());
  expect(new Set(nama).size).toBe(nama.length);
  expect(new Set(semua.map((p) => p.id)).size).toBe(semua.length);
});
