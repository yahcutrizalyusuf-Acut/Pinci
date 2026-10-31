import { formatKode, lamaLalu, namaAnak, pesanBuatKode, pesanTukarKode, sisaMenit } from '../hubungkan';

const SEKARANG = Date.parse('2026-11-02T08:00:00Z');

test('kode ditampilkan 3 + 3 angka', () => {
  expect(formatKode('482913')).toBe('482 913');
  expect(formatKode('123')).toBe('123');
});

test('sisa menit dibulatkan ke atas dan tidak negatif', () => {
  expect(sisaMenit('2026-11-02T08:10:00Z', SEKARANG)).toBe(10);
  expect(sisaMenit('2026-11-02T08:00:30Z', SEKARANG)).toBe(1);
  expect(sisaMenit('2026-11-02T07:59:00Z', SEKARANG)).toBe(0);
});

test('lama lalu dalam bahasa sederhana', () => {
  expect(lamaLalu(null, SEKARANG)).toBe('belum pernah');
  expect(lamaLalu('2026-11-02T07:59:30Z', SEKARANG)).toBe('baru saja');
  expect(lamaLalu('2026-11-02T07:45:00Z', SEKARANG)).toBe('15 menit lalu');
  expect(lamaLalu('2026-11-02T05:00:00Z', SEKARANG)).toBe('3 jam lalu');
  expect(lamaLalu('2026-10-30T08:00:00Z', SEKARANG)).toBe('3 hari lalu');
});

test('nama anak untuk satu HP', () => {
  const nama = new Map([['a', 'Rani'], ['b', 'Budi'], ['c', 'Sari']]);
  expect(namaAnak({ anakIds: ['a'] }, nama)).toBe('Rani');
  expect(namaAnak({ anakIds: ['a', 'b'] }, nama)).toBe('Rani dan Budi');
  expect(namaAnak({ anakIds: ['a', 'b', 'c'] }, nama)).toBe('Rani, Budi dan Sari');
  expect(namaAnak({ anakIds: ['x'] }, nama)).toBe('Anak');
});

test('pesan galat tanpa istilah Inggris dan tanpa kata menyalahkan anak', () => {
  const semua = [
    ...(['salah', 'terlalu_sering', 'akun_orang_tua', 'jaringan'] as const).map(pesanTukarKode),
    ...(['anak_belum_terkirim', 'belum_masuk', 'jaringan'] as const).map(pesanBuatKode),
  ];
  for (const p of semua) {
    expect(p.length).toBeGreaterThan(10);
    expect(p).not.toMatch(/error|server error|token|login|sync/i);
  }
});
