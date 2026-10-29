import { GudangMemori } from '../../data/gudang';
import type { KemajuanTopik } from '../../data/jenis';
import { Repositori } from '../../data/repositori';
import { paketTka } from '../../isi/tka/paket';
import { periksaJawaban } from '../../isi/tka/pemuat';
import { kalimatRencana, miniMingguIni, petunjukBertahap, rencanaMinggu, simpanLatihanTka, soalMiniTryOut, soalSesi, topikButir } from '../tka';

const kem = (topik: string, benar: number, salah: number, status: KemajuanTopik['status'], hariLalu: number): KemajuanTopik => ({
  id: `a:tka:${topik}`,
  anak_id: 'a',
  mapel: 'tka',
  topik,
  status,
  benar,
  salah,
  petunjuk: 0,
  terakhir: new Date(Date.now() - hariLalu * 86_400_000).toISOString(),
  tanda: 'hijau',
});

test('petunjuk selalu 3 tahap dan tidak kosong', () => {
  for (const t of paketTka.topik) {
    for (const b of [...t.soalKelas, ...t.terbimbing].slice(0, 5)) {
      const p = petunjukBertahap(b);
      expect(p).toHaveLength(3);
      p.forEach((x) => expect(x.trim().length).toBeGreaterThan(0));
    }
  }
});

test('soal sesi Jalur Mandiri ≤ 10 dan ada untuk semua topik non-simulasi', () => {
  for (const t of paketTka.topik.filter((x) => !x.simulasi)) {
    const s = soalSesi(t.id, false);
    expect(s.length).toBeGreaterThan(0);
    expect(s.length).toBeLessThanOrEqual(10);
  }
});

test('topik butir memakai kode TKA atau halaman', () => {
  const b = paketTka.topik[2].soalKelas[0];
  expect(topikButir({ ...b, topik: 'PR-M4' }, 'M03')).toBe('M03');
  expect(topikButir({ ...b, topik: 'M01' }, 'M03')).toBe('M01');
});

test('rencana minggu ini: topik baru, lemah, ulang, hari mini try out', () => {
  const k = [kem('M01', 9, 1, 'kuasai', 30), kem('M02', 3, 3, 'belajar', 3), kem('M03', 7, 3, 'belajar', 2)];
  const r = rencanaMinggu(paketTka, k, [], new Date());
  expect(r.topikBaru?.id).toBe('B01');
  expect(r.lemah.map((l) => l.topik.id)).toEqual(['M02', 'M03']);
  expect(r.ulang?.id).toBe('M01');
  expect(r.hariMini).toBe('Sabtu');
  expect(kalimatRencana(r).length).toBeGreaterThanOrEqual(4);
});

test('mini try out 6 soal tanpa kembar, juga tanpa riwayat', () => {
  const tanpa = soalMiniTryOut(paketTka, [], new Date(), 'x');
  expect(tanpa).toHaveLength(6);
  expect(new Set(tanpa.map((s) => s.butir.id)).size).toBe(6);
  const k = ['M02', 'M03', 'M04', 'M05'].map((t) => kem(t, 3, 1, 'belajar', 5)).concat([kem('M01', 8, 0, 'kuasai', 30)]);
  expect(soalMiniTryOut(paketTka, k, new Date(), 'y')).toHaveLength(6);
});

test('simpan latihan TKA: kode salah dari pengecoh, W untuk kosong, kemajuan topik tercatat', async () => {
  const repo = new Repositori(new GudangMemori());
  await repo.siapkan();
  await repo.buatKeluarga('1234');
  const anak = await repo.tambahAnak({ nama: 'Rafli', kelas: 6, hewan: 'harimau' });
  const soal = soalSesi('M03', false).slice(0, 3);
  const salah = soal[0].bentuk === 'pg' ? soal[0].pilihan.find((p) => !periksaJawaban(soal[0], p.huruf))!.huruf : [];
  const sesi = await simpanLatihanTka(repo, anak, { jenis: 'mini_tryout', rujukan: 'mini', mode: 'sendiri', mulai: Date.now() - 60_000, halaman: 'M03' }, [
    { butir: soal[0], jawaban: salah, detik: 30, petunjuk: 0 },
    { butir: soal[1], jawaban: '', detik: 10, petunjuk: 0 },
    { butir: soal[2], jawaban: typeof soal[2].kunci === 'string' ? soal[2].kunci : soal[2].bentuk === 'pgk' ? soal[2].kunci : soal[2].kunci, detik: 20, petunjuk: 1 },
  ]);
  const j = await repo.jawabanSesi(sesi.id);
  expect(j).toHaveLength(3);
  expect(j[1].kodeSalah).toBe('W');
  expect(j[2].benar).toBe(true);
  expect((await repo.kemajuanTopik(anak.id, 'tka')).length).toBeGreaterThan(0);
  expect(miniMingguIni(await repo.daftarSesi(anak.id), new Date())).toBe(true);
});
