import { paketGudang } from '../../isi/gudang/paket';
import { FITUR_MAIN_PERAN, FITUR_PEMANASAN, FITUR_TES_PAHAM } from '../konfig';
import { soalPemanasan, soalTesPaham, tesPahamJatuh, topikPemanasan } from '../pemanasan';

const HARI = 24 * 60 * 60 * 1000;
const kini = new Date('2026-11-11T08:00:00Z').getTime();
const kt = (topik: string, hariLalu: number, status: 'kuasai' | 'belajar' = 'kuasai') =>
  ({ id: topik, keluarga_id: 'k', anak_id: 'a', mapel: 'gudang', topik, status, benar: 5, salah: 0, petunjuk: 0, terakhir: new Date(kini - hariLalu * HARI).toISOString(), tanda: 'hijau' }) as never;

test('saklar pemanasan, tes paham, dan main peran bawaan mati', () => {
  expect(FITUR_PEMANASAN).toBe(false);
  expect(FITUR_TES_PAHAM).toBe(false);
  expect(FITUR_MAIN_PERAN).toBe(false);
});

test('pemanasan memilih topik yang dikuasai sekitar 1, 7, dan 21 hari lalu', () => {
  const k = [kt('mat6-persen', 1), kt('mat6-kpk-fpb', 6.5), kt('mat6-rasio', 22), kt('mat6-skala', 12), kt('mat6-kali-pecahan', 1, 'belajar')];
  expect(topikPemanasan(k, 'gudang', kini)).toEqual(['mat6-persen', 'mat6-kpk-fpb', 'mat6-rasio']);
  expect(topikPemanasan([kt('mat6-skala', 12)], 'gudang', kini)).toEqual([]);
});

test('soal pemanasan dan tes paham diambil dari kartu', () => {
  const paket = paketGudang;
  expect(soalPemanasan(paket, ['mat6-persen', 'mat6-rasio']).every((s) => s.tingkat === 'mudah')).toBe(true);
  const tes = soalTesPaham(paket, 'benih');
  expect(tes).toHaveLength(8);
  expect(tes.every((s) => s.cerita || s.modelBatang || s.gambar)).toBe(true);
  expect(tesPahamJatuh(null, kini)).toBe(true);
  expect(tesPahamJatuh(new Date(kini - 55 * HARI).toISOString(), kini)).toBe(false);
  expect(tesPahamJatuh(new Date(kini - 56 * HARI).toISOString(), kini)).toBe(true);
});
