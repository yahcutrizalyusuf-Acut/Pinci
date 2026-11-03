import * as fs from 'fs';
import * as path from 'path';

import { PERTANYAAN_PENGENALAN, emailSah, pelajaranUntukKelas, waSah } from '../pengenalan';

test('8 pertanyaan pengenalan, kode cocok dengan aturan server (pengenalan_sah)', () => {
  expect(PERTANYAAN_PENGENALAN).toHaveLength(8);
  for (const q of PERTANYAAN_PENGENALAN) {
    expect(q.kode).toMatch(/^[a-z_]{2,20}$/);
    expect(q.pilihan.length).toBeGreaterThanOrEqual(2);
    for (const p of q.pilihan) expect(p.kode).toMatch(/^[a-z0-9_]{1,20}$/);
  }
});

test('tanpa pertanyaan kesehatan atau diagnosis', () => {
  const semua = JSON.stringify(PERTANYAAN_PENGENALAN).toLowerCase();
  expect(semua).not.toMatch(/sakit|obat|diagnos|adhd|autis|disleksia|kesehatan|agama/);
});

test('TKA hanya untuk kelas 6', () => {
  expect(pelajaranUntukKelas(6).map((p) => p.kode)).toEqual(['inggris', 'gudang', 'tka']);
  expect(pelajaranUntukKelas(4).map((p) => p.kode)).toEqual(['inggris', 'gudang']);
});

test('nomor WhatsApp dan email', () => {
  expect(waSah('0812-3456-7890')).toBe(true);
  expect(waSah('+62 812 3456 7890')).toBe(true);
  expect(waSah('12345')).toBe(false);
  expect(emailSah('a@b.id')).toBe(true);
  expect(emailSah('a@b')).toBe(false);
});

test('layar pendaftaran di aplikasi tidak memuat harga atau link bayar (aturan Google Play)', () => {
  const isi = fs
    .readFileSync(path.join(__dirname, '../../app/ortu/coba.tsx'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  expect(isi).not.toMatch(/Rp\s?\d|harga|bayar|Linking|https?:\/\//i);
});
