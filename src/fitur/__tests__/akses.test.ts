import type { AnggotaKelas } from '../../data/jenis';
import { aksesAnak } from '../akses';

const anggota = (lain: Partial<AnggotaKelas>): AnggotaKelas => ({ id: 'a', anak_id: 'x', kelasId: 'k', kelasNama: 'K', paket: 'dasar', masuk: '', cobaSampai: '', ...lain });

test('tanpa kelas: semua yang tersedia untuk kelas sekolahnya terbuka', () => {
  expect(aksesAnak(6, null)).toEqual({ lancar: true, baca: true, gudang: true, inggris: true, tka: true, game: true });
  expect(aksesAnak(3, null)).toMatchObject({ baca: true, gudang: true, tka: false });
  expect(aksesAnak(1, null)).toMatchObject({ baca: false, gudang: false, tka: false, lancar: true });
});

test('paket menentukan bagian yang terbuka', () => {
  expect(aksesAnak(6, anggota({ paket: 'dasar' }))).toMatchObject({ lancar: true, baca: true, game: true, gudang: false, inggris: false, tka: false });
  expect(aksesAnak(6, anggota({ paket: 'lengkap' }))).toMatchObject({ gudang: true, inggris: true, tka: false });
  expect(aksesAnak(6, anggota({ paket: 'siap_tka' }))).toMatchObject({ gudang: true, inggris: true, tka: true });
  expect(aksesAnak(4, anggota({ paket: 'siap_tka' })).tka).toBe(false);
});

test('langganan berhenti: hanya latihan inti dan game', () => {
  expect(aksesAnak(6, anggota({ paket: 'siap_tka', status: 'berhenti' }))).toMatchObject({ lancar: true, baca: true, game: true, gudang: false, inggris: false, tka: false });
  expect(aksesAnak(6, anggota({ paket: 'siap_tka', status: 'tenggang' })).tka).toBe(true);
});
