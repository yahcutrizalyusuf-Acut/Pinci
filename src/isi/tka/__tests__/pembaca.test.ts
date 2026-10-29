import { bacaModul, blokSoal, susunButir, tandaiPecahan, uraiBadan, uraiKunci, uraiPengecoh, type MasalahBaca } from '../pembaca';

describe('tandaiPecahan', () => {
  test.each([
    ['Pita 3/4 m', 'Pita {3/4} m'],
    ['1 1/2 kg dan 2/3', '{1 1/2} kg dan {2/3}'],
    ['60 km/jam', '60 km/jam'],
    ['pukul 07.00', 'pukul 07.00'],
    ['(2 × 2)/(3 × 2)', '(2 × 2)/(3 × 2)'],
  ])('%s → %s', (a, b) => expect(tandaiPecahan(a)).toBe(b));
});

describe('uraiKunci', () => {
  test('tiga bentuk', () => {
    expect(uraiKunci('C', 'PG')).toEqual({ bentuk: 'pg', kunci: 'C' });
    expect(uraiKunci('A, B, E', 'PG kompleks')).toEqual({ bentuk: 'pgk', kunci: ['A', 'B', 'E'] });
    expect(uraiKunci('1-B, 2-S, 3-B', 'PG kategori')).toEqual({ bentuk: 'pgkat', kunci: ['B', 'S', 'B'] });
    expect(uraiKunci('E', 'PG')).toBeNull();
    expect(uraiKunci('A', 'PG kompleks')).toBeNull();
    expect(uraiKunci('1-B, 3-S', 'PG kategori')).toBeNull();
  });
});

describe('uraiPengecoh', () => {
  test('alasan per huruf, gabungan "A dan B", salah paham, kode tebakan', () => {
    const p = uraiPengecoh('A dan D — fakta tetangga (7 × 6 = 42); B — memakai FPB, salah paham 1; C — menjawab jumlah belanja, padahal yang ditanya kembalian.');
    expect(Object.keys(p)).toEqual(['A', 'D', 'B', 'C']);
    expect(p.A.kode).toBe('H');
    expect(p.B).toEqual({ alasan: 'memakai FPB, salah paham 1', kode: 'S', salahPaham: 1 });
    expect(p.C.kode).toBe('B');
  });
});

describe('uraiBadan', () => {
  test('PG kategori: tabel pernyataan menjadi pilihan bernomor', () => {
    const b = uraiBadan(
      'Tabel ini menunjukkan tangkapan.\n\n| Hari | Senin |\n|---|---|\n| kg | 12 |\n\nTentukan **Benar** atau **Salah**.\n\n| Pernyataan | Benar | Salah |\n|---|---|---|\n| 1. Satu. | ☐ | ☐ |\n| 2. Dua 1/2. | ☐ | ☐ |',
      'PG kategori',
    );
    expect(typeof b).not.toBe('string');
    if (typeof b === 'string') return;
    expect(b.pertanyaan).toBe('Tentukan **Benar** atau **Salah**.');
    expect(b.pilihan).toEqual([
      { huruf: '1', teks: 'Satu.' },
      { huruf: '2', teks: 'Dua {1/2}.' },
    ]);
    expect(b.stimulus[1]).toEqual({ jenis: 'tabel', baris: [['Hari', 'Senin'], ['kg', '12']] });
  });

  test('denah kotak menjadi petak angka', () => {
    const b = uraiBadan('Perhatikan denah.\n\n```\n  belakang\n┌───┬───┐\n│ 3 │ 1 │\n├───┼───┤\n│ 1 │ 2 │\n└───┴───┘\n   depan\n```\n\nBerapa kubus?\n\nA. 5\nB. 6\nC. 7\nD. 8', 'PG');
    if (typeof b === 'string') throw new Error(b);
    expect(b.stimulus[1]).toEqual({ jenis: 'denah', petak: [[3, 1], [1, 2]], atas: 'belakang', bawah: 'depan' });
  });
});

describe('butir rusak dicatat, tidak dibuang diam-diam', () => {
  const teks = [
    '#### Soal 1 ● · PG',
    'Berapa 2 + 2?',
    '',
    'A. 3',
    'B. 4',
    'C. 5',
    'D. 6',
    '',
    '> **Kunci:** E',
    '> **Petunjuk:** hitung',
    '',
    '#### Soal 2 ● PG',
    'rusak',
  ].join('\n');

  test('kunci tidak sah dan judul tidak berformat masuk daftar masalah', () => {
    const { soal, judulRusak } = blokSoal(teks);
    expect(soal).toHaveLength(1);
    expect(judulRusak).toEqual([{ baris: 12, isi: '#### Soal 2 ● PG' }]);
    const masalah: MasalahBaca[] = [];
    const b = susunButir(soal[0], { berkas: 'x.md', sumber: 'M99', id: 'M99-k01', asal: 'soal_kelas', topik: 'M99', masalah });
    expect(b).toBeNull();
    expect(masalah[0]).toMatchObject({ berkas: 'x.md', baris: 1, tingkat: 'gagal' });
  });

  test('bacaModul melaporkan judul rusak sebagai gagal', () => {
    const h = bacaModul(`# M99 — Uji\n\n## Halaman 5 — Latihan campur-aduk\n\n### Soal\n\n${teks}`, 'M99-uji.md');
    expect(h.masalah.filter((m) => m.tingkat === 'gagal')).toHaveLength(2);
  });
});
