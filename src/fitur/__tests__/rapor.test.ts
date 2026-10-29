import type { Jawaban, Sesi } from '../../data/jenis';
import { grafikKecepatan, penyebabSalah, ringkasMinggu, salahTerbanyak, seninDari } from '../rapor';

const sesi = (id: string, mulai: string, jenis: Sesi['jenis'] = 'lancar'): Sesi => ({
  id,
  anak_id: 'a',
  jenis,
  mode: 'sendiri',
  kelas: 6,
  mulai,
  selesai: mulai,
  durasiDetik: 60,
  benar: 0,
  jumlah: 0,
  urutanHp: 1,
});
const jw = (sesi_id: string, benar: boolean, detik: number, topik?: string, kodeSalah?: string): Jawaban => ({
  id: Math.random().toString(),
  sesi_id,
  anak_id: 'a',
  urutan: 1,
  soal: '',
  kunci: '',
  jawaban: '',
  benar,
  detik,
  hapusN: 0,
  topik,
  kodeSalah,
});

test('Senin dari minggu', () => {
  expect(seninDari(new Date(2026, 10, 1)).getDate()).toBe(26); // Minggu 1 Nov → Senin 26 Okt
  expect(seninDari(new Date(2026, 10, 2)).getDate()).toBe(2);
});

test('ringkasan minggu', () => {
  const s = [sesi('s1', new Date(2026, 10, 2, 16).toISOString()), sesi('s2', new Date(2026, 10, 3, 16).toISOString())];
  const j = [jw('s1', true, 3), jw('s1', false, 5), jw('s2', true, 4)];
  const r = ringkasMinggu(s, j, [], new Date(2026, 10, 2));
  expect(r.hariLatihan).toBe(2);
  expect(r.lembarLancar).toBe(2);
  expect(r.detikPerSoal).toBe(4);
  expect(r.persenBenar).toBe(67);
});

test('grafik 8 minggu dan salah terbanyak', () => {
  const s = [sesi('s1', new Date(2026, 10, 2, 16).toISOString())];
  const j = [jw('s1', false, 6, '×8'), jw('s1', false, 6, '×8'), jw('s1', false, 6, '×7'), jw('s1', true, 3, '×7')];
  const g = grafikKecepatan(s, j, new Date(2026, 10, 4));
  expect(g).toHaveLength(8);
  expect(g[7]).toBe(5.3);
  expect(salahTerbanyak(j)[0]).toEqual({ topik: '×8', salah: 2, total: 2 });
  expect(penyebabSalah([jw('s', false, 1, 'M03', 'S2'), jw('s', false, 1, 'M03', 'S2'), jw('s', true, 1, 'M03', 'S1')])).toEqual([{ kode: 'S2', jumlah: 2 }]);
});
