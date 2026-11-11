import { PAKET_INGGRIS } from '../../isi/inggris/paket';
import { acakPanel, artiKata, buatKamus, cekDengarTerbuka, indeksDariHuruf, kepingKalimat, nomorCekDengar, perkiraanWaktuKata, pindahkan, rujukanCekDengar, soalCekDengar } from '../komik';

test('kepingan kata: tanda baca menempel, kata bersih huruf kecil, posisi huruf', () => {
  const k = kepingKalimat('Hi, Robi! I am Dafi.');
  expect(k.map((x) => x.tampil)).toEqual(['Hi,', 'Robi!', 'I', 'am', 'Dafi.']);
  expect(k.map((x) => x.kata)).toEqual(['hi', 'robi', 'i', 'am', 'dafi']);
  expect(k[1].mulai).toBe(4);
  expect(indeksDariHuruf(k, 10)).toBe(2);
});

test('perkiraan waktu kata naik terus dan lebih lambat bila kecepatan kecil', () => {
  const k = kepingKalimat('Hello! I am Robi.');
  const cepat = perkiraanWaktuKata(k, 1);
  const lambat = perkiraanWaktuKata(k, 0.85);
  expect(cepat.every((t, i) => i === 0 || t > cepat[i - 1])).toBe(true);
  expect(lambat[3]).toBeGreaterThan(cepat[3]);
});

test('kamus arti kata dari kosakata, termasuk jamak', () => {
  const kamus = buatKamus(Object.values(PAKET_INGGRIS), 3);
  expect(artiKata(kamus, 'hello')?.arti).toBe('halo');
  expect(artiKata(kamus, 'books')?.kata).toBe('book');
});

test('acak panel tidak pernah sama dengan urutan benar; pindahkan menggeser butir', () => {
  const soal = { id: 's', jenis: 'urutkan' as const, panel: ['p2', 'p4', 'p5'] };
  for (const b of ['a', 'b', 'c', 'd']) expect(acakPanel(soal, b).join()).not.toBe('p2,p4,p5');
  expect(pindahkan(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  expect(pindahkan(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
});

test('Cek Dengar: 8 soal tetap dari 4 unit, terbuka setelah 4 unit selesai', () => {
  const p = PAKET_INGGRIS[3];
  expect(nomorCekDengar(4)).toBe(1);
  expect(nomorCekDengar(5)).toBe(2);
  const s = soalCekDengar(p, 1);
  expect(s).toHaveLength(8);
  expect(soalCekDengar(p, 1).map((x) => x.id)).toEqual(s.map((x) => x.id));
  expect(cekDengarTerbuka(p, 1, new Set(['t3-u01', 't3-u02', 't3-u03']))).toBe(false);
  expect(cekDengarTerbuka(p, 1, new Set(['t3-u01', 't3-u02', 't3-u03', 't3-u04']))).toBe(true);
  expect(rujukanCekDengar(3, 1)).toBe('t3-cek1');
});
