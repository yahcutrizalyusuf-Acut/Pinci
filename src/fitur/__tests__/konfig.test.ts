import { GudangMemori } from '../../data/gudang';
import { Repositori } from '../../data/repositori';
import { kunciTkaAwal, tkaTerbuka, tkaTerbukaUntuk } from '../konfig';

test('TKA terkunci sebelum tanggal buka, kecuali orang tua membukanya untuk anak itu', async () => {
  const repo = new Repositori(new GudangMemori(), null);
  await repo.siapkan();
  const sebelum = new Date('2026-11-01T08:00:00');
  expect(tkaTerbuka(sebelum)).toBe(false);
  expect(await tkaTerbukaUntuk(repo, 'anak-1', sebelum)).toBe(false);
  await repo.aturNilai(kunciTkaAwal('anak-1'), true, 'anak-1');
  expect(await tkaTerbukaUntuk(repo, 'anak-1', sebelum)).toBe(true);
  expect(await tkaTerbukaUntuk(repo, 'anak-2', sebelum)).toBe(false);
  await repo.aturNilai(kunciTkaAwal('anak-1'), false, 'anak-1');
  expect(await tkaTerbukaUntuk(repo, 'anak-1', sebelum)).toBe(false);
  expect(await tkaTerbukaUntuk(repo, 'anak-2', new Date('2027-01-04T07:00:00'))).toBe(true);
});
