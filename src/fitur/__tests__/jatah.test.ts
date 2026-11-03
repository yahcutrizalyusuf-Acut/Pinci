import { jatahHabis, jatahTerpakai, teksJatahHabis } from '../jatah';

const s = (jenis: string, mulai: string) => ({ jenis: jenis as never, mulai: new Date(mulai).toISOString() });
// Rabu 4 Nov 2026, 10.00 waktu setempat.
const kini = new Date(2026, 10, 4, 10, 0);

test('latihan harian: 1 lembar per hari, besok terbuka lagi', () => {
  expect(jatahHabis('lancar', [], kini)).toBe(false);
  expect(jatahHabis('lancar', [s('lancar', '2026-11-03T08:00:00')], kini)).toBe(false);
  expect(jatahHabis('lancar', [s('lancar', new Date(2026, 10, 4, 7, 0).toISOString())], kini)).toBe(true);
  expect(jatahHabis('baca', [s('lancar', new Date(2026, 10, 4, 7, 0).toISOString())], kini)).toBe(false);
});

test('Gudang Ilmu: 1 kartu per minggu (Senin sampai Minggu)', () => {
  const senin = new Date(2026, 10, 2, 9, 0).toISOString();
  const mingguLalu = new Date(2026, 10, 1, 9, 0).toISOString();
  expect(jatahHabis('gudang', [s('kartu', senin)], kini)).toBe(true);
  expect(jatahHabis('gudang', [s('kartu', mingguLalu)], kini)).toBe(false);
});

test('TKA: semua jenis TKA dihitung, 1 per bulan', () => {
  const awalBulan = new Date(2026, 10, 1, 9, 0).toISOString();
  expect(jatahTerpakai('tka', [s('mini_tryout', awalBulan), s('simulasi', new Date(2026, 9, 30).toISOString())], kini)).toBe(1);
  expect(jatahHabis('tka', [s('simulasi', new Date(2026, 9, 30).toISOString())], kini)).toBe(false);
});

test('kalimat untuk anak tanpa harga dan tanpa ajakan membeli', () => {
  for (const b of ['lancar', 'baca', 'inggris', 'gudang', 'tka'] as const) {
    const t = teksJatahHabis(b);
    expect(`${t.judul} ${t.teks}`).not.toMatch(/rp|bayar|beli|langganan|harga|ayah|bunda/i);
  }
});
