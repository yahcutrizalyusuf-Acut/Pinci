import { buatAcak } from '../acak';
import { SEMUA_KELAS } from '../jenis';
import { JUMLAH_LEVEL, setelahSelesai, KEMAJUAN_AWAL, rapikanLevel, type Level } from '../level';
import { buatDaftarSoal, buatSoalHitung, hitung } from '../soal';

/** Hitung ulang kunci langsung dari teks soal (tidak memakai fungsi `hitung`). */
function dariTeks(t: string): number {
  const fpb = (a: number, b: number): number => (b === 0 ? a : fpb(b, a % b));
  let m = t.match(/^(\d+) \+ (\d+) × (\d+)$/);
  if (m) return +m[1] + +m[2] * +m[3];
  m = t.match(/^(\d+) ([+−×:]) (\d+)$/);
  if (m) return { '+': +m[1] + +m[3], '−': +m[1] - +m[3], '×': +m[1] * +m[3], ':': +m[1] / +m[3] }[m[2] as '+']!;
  m = t.match(/^(\d+)\/(\d+) dari (\d+)$/);
  if (m) return (+m[1] * +m[3]) / +m[2];
  m = t.match(/^(\d+)% dari (\d+)$/);
  if (m) return (+m[1] * +m[2]) / 100;
  m = t.match(/^(KPK|FPB) (\d+) dan (\d+)$/);
  if (m) return m[1] === 'FPB' ? fpb(+m[2], +m[3]) : (+m[2] * +m[3]) / fpb(+m[2], +m[3]);
  throw new Error(`Teks tidak dikenal: ${t}`);
}

test('kunci soal dihitung benar untuk semua kelas dan level (dicek ulang dari teks)', () => {
  for (const kelas of SEMUA_KELAS) {
    for (let level = 1; level <= JUMLAH_LEVEL; level++) {
      const acak = buatAcak(kelas * 100 + level);
      for (let i = 0; i < 300; i++) {
        const s = buatSoalHitung(acak, kelas, level as Level, 4);
        expect(s.jawaban).toBe(hitung(s.bentuk));
        expect(dariTeks(s.teks)).toBe(s.jawaban);
        expect(Number.isInteger(s.jawaban) && s.jawaban >= 1).toBe(true);
        expect(s.pilihan).toContain(s.jawaban);
        expect(new Set(s.pilihan).size).toBe(4);
        expect(s.pilihan.every((p) => Number.isInteger(p) && p >= 1)).toBe(true);
      }
    }
  }
});

test('kelas 1 level 1 hanya penjumlahan sampai 10', () => {
  const acak = buatAcak(7);
  for (let i = 0; i < 200; i++) {
    const s = buatSoalHitung(acak, 1, 1);
    expect(s.bentuk.op).toBe('tambah');
    expect(s.jawaban).toBeLessThanOrEqual(10);
  }
});

test('daftar soal tanpa teks kembar', () => {
  const d = buatDaftarSoal(buatAcak(3), 6, 3, 8);
  expect(new Set(d.map((s) => s.teks)).size).toBe(8);
});

test('kemajuan level: selesai membuka level berikutnya, tidak lewat 5', () => {
  let k = setelahSelesai(KEMAJUAN_AWAL, 1);
  expect(k).toEqual({ terbuka: 2, selesai: [1] });
  k = setelahSelesai(k, 1);
  expect(k.terbuka).toBe(2);
  k = setelahSelesai({ terbuka: 5, selesai: [1, 2, 3, 4] }, 5);
  expect(k).toEqual({ terbuka: 5, selesai: [1, 2, 3, 4, 5] });
  expect(rapikanLevel('9')).toBe(5);
  expect(rapikanLevel(undefined)).toBe(1);
});
