import { paketTka } from '../../isi/tka/paket';
import { daftarKelompok, idPeriksa, laporanPeriksa, pilihanKunci, ringkasPeriksa, teksKunci, type HasilPeriksa } from '../periksa-tka';

const kelompok = daftarKelompok(paketTka);

test('semua butir TKA masuk daftar periksa tepat sekali', () => {
  const id = kelompok.flatMap((k) => k.butir.map((x) => x.b.id));
  expect(new Set(id).size).toBe(id.length);
  expect(id.length).toBe(982);
  expect(kelompok.filter((k) => k.jenis === 'simulasi')).toHaveLength(5);
  expect(kelompok.filter((k) => k.jenis === 'teks')).toHaveLength(36);
});

test('ringkasan dan laporan menghitung tanda periksa', () => {
  const k = kelompok.find((x) => x.id === 'T01')!;
  const [teksId, b1, b2] = idPeriksa(k);
  const hasil = new Map<string, HasilPeriksa>([
    [teksId, { status: 'layak', waktu: '2026-10-30T00:00:00Z' }],
    [b1, { status: 'perlu_diperbaiki', catatan: 'pilihan B kurang jelas', waktu: '2026-10-30T00:00:00Z' }],
  ]);
  expect(ringkasPeriksa(k, hasil)).toEqual({ total: k.butir.length + 1, layak: 1, perlu: 1, belum: k.butir.length - 1 });
  const lap = laporanPeriksa(kelompok, hasil);
  expect(lap).toContain(`- ${b1} (T01`);
  expect(lap).toContain('pilihan B kurang jelas');
  expect(lap).toContain('Perlu diperbaiki: 1');
  expect(b2 === undefined || !lap.includes(`- ${b2} `)).toBe(true);
});

test('kunci ditulis sesuai bentuk soal', () => {
  const semua = kelompok.flatMap((k) => k.butir.map((x) => x.b));
  const pg = semua.find((b) => b.bentuk === 'pg')!;
  expect(teksKunci(pg)).toMatch(/^[A-E]$/);
  expect(pg.pilihan.filter((p) => pilihanKunci(pg, p.huruf))).toHaveLength(1);
  const pgk = semua.find((b) => b.bentuk === 'pgk')!;
  expect(teksKunci(pgk)).toMatch(/^[A-E](, [A-E])+$/);
  const kat = semua.find((b) => b.bentuk === 'pgkat')!;
  expect(teksKunci(kat)).toMatch(/1: (Benar|Salah)/);
});
