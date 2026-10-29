import {
  ALASAN_PERNYATAAN_BENAR,
  ALASAN_TERLEWAT,
  ambilSimulasi,
  ambilTeks,
  ambilTopik,
  buatMiniTryOut,
  cariButir,
  daftarSimulasi,
  daftarTopik,
  latihanRumah,
  penyebabSalah,
  periksaJawaban,
  soalBerjenjang,
} from '../pemuat';
import type { ButirPG, ButirPGK, ButirPGKat } from '../jenis';
import { paketTka } from '../paket';

describe('ambil isi', () => {
  test('topik, soal berjenjang, latihan rumah', () => {
    expect(daftarTopik(paketTka, 'mat')).toHaveLength(24);
    expect(daftarTopik(paketTka, 'bi')).toHaveLength(12);
    expect(ambilTopik(paketTka, 'M02')?.judul).toMatch(/KPK/);
    expect(ambilTopik(paketTka, 'X99')).toBeUndefined();
    const j = soalBerjenjang(paketTka, 'M02');
    expect(j.kelas).toHaveLength(8);
    expect(j.cadangan).toHaveLength(4);
    expect(j.terbimbing.length).toBeGreaterThan(0);
    expect(soalBerjenjang(paketTka, 'X99')).toEqual({ terbimbing: [], kelas: [], cadangan: [] });
    expect(latihanRumah(paketTka, 'M02').map((b) => b.id)).toEqual(['M02-k03', 'M02-k06', 'M02-k09', 'M02-k12']);
    expect(latihanRumah(paketTka, 'M01')).toEqual([]);
  });

  test('simulasi, teks, cari butir', () => {
    expect(daftarSimulasi(paketTka, 'bi').map((s) => s.id)).toEqual(['S5']);
    expect(ambilSimulasi(paketTka, 'S1')?.butir).toHaveLength(30);
    expect(ambilTeks(paketTka, 'T05')?.judul).toBe('Tabungan Kelas Enam');
    expect(cariButir(paketTka, 'S1-12')?.sumber).toBe('S1');
    expect(cariButir(paketTka, 'T05-q2')?.asal).toBe('baca_cepat');
  });
});

describe('buatMiniTryOut', () => {
  const opsi = { benih: 2027, topikBaru: ['M05', 'M06'], topikLama: ['M01', 'M02'] };

  test('6 soal: 4 dari topik baru + 2 dari topik lama, tanpa kembar, 15 menit', () => {
    const m = buatMiniTryOut(paketTka, opsi);
    expect(m.soal).toHaveLength(6);
    expect(m.waktuMenit).toBe(15);
    const baru = m.soal.filter((s) => s.asal === 'baru');
    const lama = m.soal.filter((s) => s.asal === 'lama');
    expect(baru).toHaveLength(4);
    expect(lama).toHaveLength(2);
    for (const s of baru) expect(opsi.topikBaru).toContain(s.butir.topik);
    for (const s of lama) expect(opsi.topikLama).toContain(s.butir.topik);
    const ids = m.soal.map((s) => s.butir.id);
    expect(new Set(ids).size).toBe(6);
    for (const s of m.soal) expect(s.butir.status).not.toBe('perlu_dicek');
  });

  test('topik baru tersebar (kedua topik baru muncul)', () => {
    const m = buatMiniTryOut(paketTka, opsi);
    expect(new Set(m.soal.filter((s) => s.asal === 'baru').map((s) => s.butir.topik))).toEqual(new Set(['M05', 'M06']));
  });

  test('benih sama → soal sama; benih lain → biasanya berbeda', () => {
    const a = buatMiniTryOut(paketTka, opsi).soal.map((s) => s.butir.id);
    const b = buatMiniTryOut(paketTka, opsi).soal.map((s) => s.butir.id);
    const c = buatMiniTryOut(paketTka, { ...opsi, benih: 'minggu-7' }).soal.map((s) => s.butir.id);
    expect(a).toEqual(b);
    expect(c).not.toEqual(a);
  });

  test('banyak benih: selalu komposisi 4 + 2 tanpa kembar', () => {
    for (let benih = 0; benih < 50; benih++) {
      const m = buatMiniTryOut(paketTka, { benih, topikBaru: ['B05', 'B06'], topikLama: ['B02', 'B03', 'B04'] });
      expect(m.soal.filter((s) => s.asal === 'baru')).toHaveLength(4);
      expect(m.soal.filter((s) => s.asal === 'lama')).toHaveLength(2);
      expect(new Set(m.soal.map((s) => s.butir.id)).size).toBe(6);
    }
  });

  test('soal di `kecuali` tidak dipakai lagi; topik di kedua daftar dianggap baru', () => {
    const pertama = buatMiniTryOut(paketTka, opsi).soal.map((s) => s.butir.id);
    const kedua = buatMiniTryOut(paketTka, { ...opsi, kecuali: pertama }).soal.map((s) => s.butir.id);
    expect(kedua).toHaveLength(6);
    for (const id of kedua) expect(pertama).not.toContain(id);
    const tumpang = buatMiniTryOut(paketTka, { benih: 1, topikBaru: ['M05'], topikLama: ['M05', 'M01'] });
    for (const s of tumpang.soal.filter((x) => x.asal === 'lama')) expect(s.butir.topik).toBe('M01');
  });

  test('bank kurang → hasil lebih sedikit, tidak diisi dari kelompok lain', () => {
    const m = buatMiniTryOut(paketTka, { benih: 3, topikBaru: ['M05'], topikLama: [] });
    expect(m.soal.filter((s) => s.asal === 'lama')).toHaveLength(0);
    expect(m.soal).toHaveLength(4);
    expect(m.waktuMenit).toBe(10);
  });
});

describe('jawaban dan penyebab salah', () => {
  const pg: ButirPG = {
    id: 'U-1',
    asal: 'soal_kelas',
    sumber: 'U',
    baris: 1,
    topik: 'M02',
    pertanyaan: 'Berapa KPK dari 6 dan 8?',
    pilihan: [
      { huruf: 'A', teks: '2' },
      { huruf: 'B', teks: '14' },
      { huruf: 'C', teks: '24' },
      { huruf: 'D', teks: '48' },
    ],
    pengecoh: {
      A: { alasan: 'memakai FPB (salah paham 1)', kode: 'S', salahPaham: 1 },
      B: { alasan: 'menjumlahkan' },
      D: { alasan: 'mengalikan langsung', kode: 'S' },
    },
    status: 'belum_diperiksa',
    bentuk: 'pg',
    kunci: 'C',
  };
  const pgk: ButirPGK = { ...pg, id: 'U-2', bentuk: 'pgk', kunci: ['A', 'C'], pengecoh: { B: { alasan: 'tambah', kode: 'B' }, D: { alasan: 'kali' } } };
  const pgkat: ButirPGKat = {
    ...pg,
    id: 'U-3',
    bentuk: 'pgkat',
    pilihan: [
      { huruf: '1', teks: 'a' },
      { huruf: '2', teks: 'b' },
      { huruf: '3', teks: 'c' },
    ],
    kategori: ['Benar', 'Salah'],
    kunci: ['B', 'S', 'B'],
    pengecoh: { '2': { alasan: 'pelaku ditukar', kode: 'B' } },
  };

  test('periksaJawaban semua-atau-tidak', () => {
    expect(periksaJawaban(pg, 'C')).toBe(true);
    expect(periksaJawaban(pg, 'A')).toBe(false);
    expect(periksaJawaban(pgk, ['C', 'A'])).toBe(true);
    expect(periksaJawaban(pgk, ['A'])).toBe(false);
    expect(periksaJawaban(pgk, ['A', 'C', 'D'])).toBe(false);
    expect(periksaJawaban(pgkat, ['B', 'S', 'B'])).toBe(true);
    expect(periksaJawaban(pgkat, ['B', 'B', 'B'])).toBe(false);
  });

  test('PG: alasan dan kode pengecoh pilihan anak; jawaban benar → kosong', () => {
    expect(penyebabSalah(pg, 'C')).toEqual([]);
    expect(penyebabSalah(pg, 'A')).toEqual([{ pilihan: 'A', alasan: 'memakai FPB (salah paham 1)', kode: 'S', salahPaham: 1 }]);
    expect(penyebabSalah(pg, 'B')).toEqual([{ pilihan: 'B', alasan: 'menjumlahkan' }]);
  });

  test('PG kompleks: pilihan salah yang dipilih + kunci yang terlewat', () => {
    expect(penyebabSalah(pgk, ['A', 'B'])).toEqual([
      { pilihan: 'B', alasan: 'tambah', kode: 'B' },
      { pilihan: 'C', alasan: ALASAN_TERLEWAT, kode: 'S' },
    ]);
  });

  test('PG kategori: pernyataan Salah yang dinilai Benar memakai alasan pengecoh', () => {
    expect(penyebabSalah(pgkat, ['B', 'B', 'S'])).toEqual([
      { pilihan: '2', alasan: 'pelaku ditukar', kode: 'B' },
      { pilihan: '3', alasan: ALASAN_PERNYATAAN_BENAR },
    ]);
  });

  test('butir sungguhan M02-k08: pilihan A (FPB) → salah paham 1', () => {
    const b = cariButir(paketTka, 'M02-k08');
    expect(b).toBeDefined();
    if (!b) return;
    const p = penyebabSalah(b, 'A');
    expect(p).toHaveLength(1);
    expect(p[0].salahPaham).toBe(1);
    expect(p[0].kode).toBe('S');
  });
});
