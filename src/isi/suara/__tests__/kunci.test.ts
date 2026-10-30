import { existsSync } from 'node:fs';
import path from 'node:path';

import { PAKET_INGGRIS } from '../../inggris/paket';
import { daftarUcapan, kunciUcapan } from '../kunci';
import { PETA_SUARA_EN } from '../peta-en';

const paket = Object.values(PAKET_INGGRIS);
const daftar = daftarUcapan(paket);

test('kunci tetap dan tidak peka spasi/huruf besar', () => {
  expect(kunciUcapan('This is my cat.')).toBe(kunciUcapan('  this  is my CAT. '));
  expect(kunciUcapan('cat')).not.toBe(kunciUcapan('cats'));
  expect(kunciUcapan('cat')).toMatch(/^[0-9a-f]{8}$/);
});

test('setiap ucapan berbeda punya kunci berbeda (tanpa tabrakan)', () => {
  const teks = new Set<string>();
  for (const p of paket) for (const u of p.unit) {
    u.kosakata.forEach((k) => teks.add(k.kata.replace(/\s+/g, ' ').trim().toLowerCase()));
    u.pola.forEach((k) => teks.add(k.kalimat.replace(/\s+/g, ' ').trim().toLowerCase()));
    u.dengar.forEach((k) => teks.add(k.ucapan.replace(/\s+/g, ' ').trim().toLowerCase()));
    u.susun.forEach((k) => teks.add(k.kalimat.replace(/\s+/g, ' ').trim().toLowerCase()));
  }
  expect(daftar.length).toBe(teks.size);
  expect(daftar.length).toBeGreaterThan(400);
});

test('peta hanya menunjuk berkas yang ada', () => {
  for (const k of Object.keys(PETA_SUARA_EN)) {
    expect(existsSync(path.join(process.cwd(), 'assets/suara/en', `${k}.mp3`))).toBe(true);
  }
});

test('kalau rekaman sudah dibuat, semua ucapan punya rekaman', () => {
  if (Object.keys(PETA_SUARA_EN).length === 0) return;
  const kurang = daftar.filter((d) => PETA_SUARA_EN[d.kunci] === undefined).map((d) => d.teks);
  expect(kurang).toEqual([]);
});
