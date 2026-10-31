import type { AnakPapan } from '../../data/staf';
import { contohCatatan, formatKodeKelas, paketUntukKelas, penandaAnak, pesanGabung, rapikanKodeKelas, ruteTugas, sisaHariCoba, teksPersetujuan, urutkanPapan } from '../kelas';
import { hariPantau, hariWib, lamaHari } from '../staf';

const KINI = new Date('2026-11-04T03:00:00Z'); // Rabu 10.00 WIB

function anak(lain: Partial<AnakPapan>): AnakPapan {
  return {
    anakId: 'a',
    nama: 'Rani',
    kelas: 6,
    hewan: 'kucing',
    paket: 'dasar',
    cobaSampai: '2026-11-16T00:00:00Z',
    masuk: '2026-11-02T00:00:00Z',
    terakhirLatihan: '2026-11-04T01:00:00Z',
    hariLatihan7: 4,
    hariLatihan4: 3,
    topikLemah: [],
    catatanTerakhir: null,
    tugasTerbuka: 0,
    ...lain,
  };
}

test('kode kelas dirapikan dan ditampilkan dua kelompok', () => {
  expect(rapikanKodeKelas(' knc-4r7 ')).toBe('KNC4R7');
  expect(formatKodeKelas('knc4r7')).toBe('KNC 4R7');
  expect(formatKodeKelas('AB')).toBe('AB');
});

test('paket Siap TKA hanya untuk kelas 6', () => {
  expect(paketUntukKelas(6)).toEqual(['dasar', 'lengkap', 'siap_tka']);
  expect(paketUntukKelas(3)).toEqual(['dasar', 'lengkap']);
});

test('teks persetujuan tidak menyebut harga (aturan Google Play) dan memuat hak berhenti', () => {
  const teks = teksPersetujuan('Kancil', 'Kak Nisa').join(' ');
  expect(teks).toContain('kelas Kancil dengan pengawas Kak Nisa');
  expect(teks).not.toMatch(/Rp|rupiah|\d{2}\.\d{3}/i);
  expect(teks).toContain('berhenti kapan saja');
  expect(teks).toContain('tidak bisa mengobrol dengan anak');
});

test('pesan gabung kelas mudah dimengerti', () => {
  expect(pesanGabung('penuh')).toContain('penuh');
  expect(pesanGabung('terlalu_sering')).toContain('10 menit');
  expect(pesanGabung('jaringan')).toContain('internet');
});

test('sisa hari masa coba', () => {
  expect(sisaHariCoba('2026-11-16T00:00:00Z', KINI)).toBe(12);
  expect(sisaHariCoba('2026-11-01T00:00:00Z', KINI)).toBe(0);
});

test('penanda papan kelas', () => {
  expect(penandaAnak(anak({}), KINI)).toEqual(['perlu_dipuji']);
  expect(penandaAnak(anak({ terakhirLatihan: '2026-11-01T00:00:00Z', hariLatihan4: 0 }), KINI)).toEqual(['belum_latihan']);
  expect(penandaAnak(anak({ terakhirLatihan: null, hariLatihan4: 0 }), KINI)).toEqual(['belum_latihan']);
  expect(penandaAnak(anak({ topikLemah: [{ mapel: 'tka', topik: 'M03', persen: 40 }] }), KINI)).toEqual(['topik_lemah']);
});

test('papan diurutkan: belum latihan dulu, lalu topik lemah', () => {
  const urut = urutkanPapan(
    [anak({ nama: 'Cici' }), anak({ nama: 'Budi', topikLemah: [{ mapel: 'tka', topik: 'M03', persen: 40 }] }), anak({ nama: 'Ade', terakhirLatihan: null, hariLatihan4: 0 })],
    KINI,
  );
  expect(urut.map((a) => a.nama)).toEqual(['Ade', 'Budi', 'Cici']);
});

test('contoh catatan memakai nama topik yang mudah dibaca', () => {
  const c = contohCatatan({ nama: 'Rani', hariLatihan7: 0, topikLemah: [{ mapel: 'tka', topik: 'zzz', persen: 30 }] });
  expect(c.some((x) => x.includes('belum latihan minggu ini'))).toBe(true);
  expect(c.some((x) => x.includes('Topik zzz'))).toBe(true);
  expect(c.some((x) => x.includes('Terima kasih'))).toBe(false);
  expect(contohCatatan({ nama: 'Rani', hariLatihan7: 5, topikLemah: [] })[0]).toContain('5 hari dalam 7 hari terakhir');
});

test('rute tugas', () => {
  expect(ruteTugas('tka', 'M03')).toBe('/tka/topik/M03');
  expect(ruteTugas('kartu')).toBe('/anak/gudang');
  expect(ruteTugas('lancar')).toBe('/lancar/lembar');
});

test('hari pantau Senin, Rabu, Jumat menurut WIB', () => {
  expect(hariPantau(KINI)).toEqual({ tanggal: '2026-11-04' });
  expect(hariPantau(new Date('2026-11-05T03:00:00Z'))).toBeNull(); // Kamis
  // Selasa 23.30 UTC = Rabu 06.30 WIB
  expect(hariWib(new Date('2026-11-03T23:30:00Z'))).toEqual({ tanggal: '2026-11-04', hari: 3 });
  expect(lamaHari('2026-11-04T00:30:00Z', KINI)).toBe('hari ini');
  expect(lamaHari('2026-11-03T10:00:00Z', KINI)).toBe('kemarin');
  expect(lamaHari('2026-11-01T10:00:00Z', KINI)).toBe('3 hari lalu');
  expect(lamaHari(null, KINI)).toBe('belum pernah');
});
