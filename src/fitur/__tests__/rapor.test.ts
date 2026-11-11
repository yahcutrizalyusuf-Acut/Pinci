import type { Jawaban, Sesi } from '../../data/jenis';
import { grafikKecepatan, penyebabSalah, ringkasMinggu, salahTerbanyak, seninDari } from '../rapor';

const sesi = (id: string, mulai: string, jenis: Sesi['jenis'] = 'lancar'): Sesi => ({
  id,
  anak_id: 'a',
  jenis,
  mode: 'sendiri',
  kelas: 6,
  mulai,
  selesai: mulai,
  durasiDetik: 60,
  benar: 0,
  jumlah: 0,
  urutanHp: 1,
});
const jw = (sesi_id: string, benar: boolean, detik: number, topik?: string, kodeSalah?: string): Jawaban => ({
  id: Math.random().toString(),
  sesi_id,
  anak_id: 'a',
  urutan: 1,
  soal: '',
  kunci: '',
  jawaban: '',
  benar,
  detik,
  hapusN: 0,
  topik,
  kodeSalah,
});

test('Senin dari minggu', () => {
  expect(seninDari(new Date(2026, 10, 1)).getDate()).toBe(26); // Minggu 1 Nov → Senin 26 Okt
  expect(seninDari(new Date(2026, 10, 2)).getDate()).toBe(2);
});

test('ringkasan minggu', () => {
  const s = [sesi('s1', new Date(2026, 10, 2, 16).toISOString()), sesi('s2', new Date(2026, 10, 3, 16).toISOString())];
  const j = [jw('s1', true, 3), jw('s1', false, 5), jw('s2', true, 4)];
  const r = ringkasMinggu(s, j, [], new Date(2026, 10, 2));
  expect(r.hariLatihan).toBe(2);
  expect(r.lembarLancar).toBe(2);
  expect(r.detikPerSoal).toBe(4);
  expect(r.persenBenar).toBe(67);
});

test('grafik 8 minggu dan salah terbanyak', () => {
  const s = [sesi('s1', new Date(2026, 10, 2, 16).toISOString())];
  const j = [jw('s1', false, 6, '×8'), jw('s1', false, 6, '×8'), jw('s1', false, 6, '×7'), jw('s1', true, 3, '×7')];
  const g = grafikKecepatan(s, j, new Date(2026, 10, 4));
  expect(g).toHaveLength(8);
  expect(g[7]).toBe(5.3);
  expect(salahTerbanyak(j)[0]).toEqual({ topik: '×8', salah: 2, total: 2 });
  expect(penyebabSalah([jw('s', false, 1, 'M03', 'S2'), jw('s', false, 1, 'M03', 'S2'), jw('s', true, 1, 'M03', 'S1')])).toEqual([{ kode: 'S2', jumlah: 2 }]);
});

describe('rapor Bahasa Inggris (Ceritakan Lagi dan Cek Dengar)', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { raporInggris } = require('../rapor') as typeof import('../rapor');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cariKomik, teksTokoh } = require('../../isi/inggris/paketKomik') as typeof import('../../isi/inggris/paketKomik');
  const senin = new Date(2026, 10, 9);
  const cu = (tanggal: string, komikId: string, kata: string[]) => ({ id: tanggal + komikId, keluarga_id: 'k', anak_id: 'a', komikId, tanggal, waktu: `${tanggal}T10:00:00Z`, mode: 'dampingi' as const, centangTokoh: true, centangUrutan: true, centangInggris: false, centangSelesai: true, kataTargetDicentang: kata, adaRekaman: false });

  it('kalimat kemajuan dari Ceritakan Lagi minggu ini, tanpa nilai', () => {
    const r = raporInggris('Rani', [cu('2026-11-10', 't3-u01-komik', ['hello', 'robot']), cu('2026-11-11', 't3-u02-komik', ['one', 'hello']), cu('2026-11-01', 't3-u03-komik', ['ten'])], [], senin, cariKomik, teksTokoh);
    expect(r.cerita).toBe('Minggu ini Rani menceritakan 2 komik dan memakai 3 kata baru: hello, robot, one.');
    expect(r.membantu).toBeNull();
  });

  it('hasil Cek Dengar dan satu cara membantu dari komik terakhir', () => {
    const sesi = [
      { id: 's1', anak_id: 'a', jenis: 'inggris', mode: 'sendiri', kelas: 4, level: 1, rujukan: 't3-u01', mulai: '2026-11-10T09:00:00Z', selesai: '', durasiDetik: 60, benar: 0, jumlah: 0, tambahan: { sesi: 'a', komik: 't3-u01-komik' } },
      { id: 's2', anak_id: 'a', jenis: 'inggris', mode: 'sendiri', kelas: 4, level: 1, rujukan: 't3-cek1', mulai: '2026-11-11T09:00:00Z', selesai: '', durasiDetik: 60, benar: 7, jumlah: 8, tambahan: { cekDengar: true, ke: 1 } },
    ] as unknown as Parameters<typeof raporInggris>[2];
    const r = raporInggris('Rani', [], sesi, senin, cariKomik, teksTokoh);
    expect(r.cerita).toBeNull();
    expect(r.cekDengar).toBe('Cek Dengar 1: Rani mengenali 7 dari 8 kata yang didengar.');
    expect(r.membantu).toContain('Who is in the story?');
    expect(r.perbuatanBaik).toContain('Hello!');
  });
});
