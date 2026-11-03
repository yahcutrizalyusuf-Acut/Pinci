import type { AnggotaKelas } from '../../data/jenis';
import { aksesAnak } from '../akses';

const anggota = (lain: Partial<AnggotaKelas>): AnggotaKelas => ({ id: 'a', anak_id: 'x', kelasId: 'k', kelasNama: 'K', paket: 'dasar', masuk: '', cobaSampai: '', ...lain });
const semuaJatah = { lancar: true, baca: true, inggris: true, gudang: true, tka: true, game: true };

test('mode lokal tanpa kelas: semua yang tersedia terbuka penuh', () => {
  expect(aksesAnak(6, null)).toEqual({ lancar: true, baca: true, gudang: true, inggris: true, tka: true, game: true, jatah: {} });
  expect(aksesAnak(3, null)).toMatchObject({ baca: true, gudang: true, tka: false });
  expect(aksesAnak(1, null)).toMatchObject({ baca: false, gudang: false, tka: false, lancar: true });
});

test('mode server tanpa kelas: Gratis selamanya, semua bagian dengan jatah', () => {
  expect(aksesAnak(6, null, { gratisTanpaKelas: true })).toMatchObject({ lancar: true, gudang: true, tka: true, jatah: semuaJatah });
});

test('pelajaran pilihan menentukan bagian yang penuh; sisanya dicicipi dengan jatah', () => {
  expect(aksesAnak(6, anggota({ paket: 'dasar' })).jatah).toEqual({ inggris: true, gudang: true, tka: true });
  expect(aksesAnak(6, anggota({ paket: 'lengkap' })).jatah).toEqual({ tka: true });
  expect(aksesAnak(6, anggota({ paket: 'siap_tka' })).jatah).toEqual({});
  expect(aksesAnak(6, anggota({ paket: 'lengkap', pelajaran: ['inggris'] })).jatah).toEqual({ gudang: true, tka: true });
  expect(aksesAnak(4, anggota({ paket: 'siap_tka' })).tka).toBe(false);
  // Latihan inti dan game selalu penuh selama di kelas.
  expect(aksesAnak(6, anggota({ paket: 'dasar' })).jatah.lancar).toBeUndefined();
});

test('langganan berhenti: turun ke Gratis, tidak terkunci', () => {
  expect(aksesAnak(6, anggota({ paket: 'siap_tka', status: 'berhenti' }))).toMatchObject({ lancar: true, tka: true, jatah: semuaJatah });
  expect(aksesAnak(6, anggota({ paket: 'siap_tka', status: 'tenggang' })).jatah).toEqual({});
});
