import { PAKET_INGGRIS } from '../../isi/inggris/paket';
import { acakSusun, buatTesTingkat, jatuhTempo, perbaruiUlang, saranTingkat, soalDengarSesi } from '../inggris';

const HARI = 86_400_000;

test('pengulangan berjarak 1 → 3 → 7 hari lalu lulus', () => {
  let a = perbaruiUlang([], 'k1', 'u1', false, 0);
  expect(a[0].jatuhTempo).toBe(HARI);
  expect(jatuhTempo(a, HARI - 1)).toHaveLength(0);
  a = perbaruiUlang(a, 'k1', 'u1', true, HARI);
  expect(a[0].jatuhTempo).toBe(HARI + 3 * HARI);
  a = perbaruiUlang(a, 'k1', 'u1', true, 4 * HARI);
  expect(a[0].jatuhTempo).toBe(11 * HARI);
  a = perbaruiUlang(a, 'k1', 'u1', true, 11 * HARI);
  expect(a).toHaveLength(0);
  expect(perbaruiUlang([], 'k2', 'u1', true, 0)).toHaveLength(0);
});

test('tes tingkat: 8 soal, 2 per tingkat, kunci ada di pilihan', () => {
  const t = buatTesTingkat(PAKET_INGGRIS, 'x');
  expect(t).toHaveLength(8);
  for (const s of t) {
    expect(s.pilihan.map((p) => p.id)).toContain(s.kunci.id);
    expect(s.pilihan.length).toBeGreaterThanOrEqual(3);
  }
});

test('saran tingkat', () => {
  expect(saranTingkat({ 3: 1 })).toBe(3);
  expect(saranTingkat({ 3: 2, 4: 1 })).toBe(4);
  expect(saranTingkat({ 3: 2, 4: 2, 5: 2, 6: 2 })).toBe(6);
});

test('susun kata diacak tetapi kata sama', () => {
  for (const u of PAKET_INGGRIS[4].unit) {
    for (const s of u.susun) {
      const a = acakSusun(s.kalimat, s.id);
      expect([...a].sort()).toEqual(s.kalimat.split(' ').sort());
      expect(a.join(' ')).not.toBe(s.kalimat);
    }
  }
});

test('soal dengar sesi menyelipkan kata ulang', () => {
  const p = PAKET_INGGRIS[3];
  const u2 = p.unit[1];
  const ulang = [{ kataId: p.unit[0].dengar[0].kunci, unitId: p.unit[0].id, tahap: 0, jatuhTempo: 0 }];
  const s = soalDengarSesi(u2, p, ulang);
  expect(s.length).toBe(u2.dengar.length + 1);
});
