import { sha256 } from '../alat';
import { GudangMemori } from '../gudang';
import type { ItemAntrean } from '../jenis';
import { Repositori, type PengirimSinkron } from '../repositori';

async function siap(pengirim: PengirimSinkron | null = null) {
  const r = new Repositori(new GudangMemori(), pengirim);
  await r.siapkan();
  await r.buatKeluarga('1234', 'Bunda');
  return r;
}

test('sha256 sesuai nilai baku', () => {
  expect(sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

test('PIN disimpan sebagai sidik, bukan angka asli', async () => {
  const r = await siap();
  const kel = await r.keluarga();
  expect(kel?.pinHash).not.toContain('1234');
  expect(await r.periksaPin('1234')).toBe(true);
  expect(await r.periksaPin('0000')).toBe(false);
  await r.gantiPin('9876');
  expect(await r.periksaPin('9876')).toBe(true);
});

test('tambah anak membuat pengaturan waktu bawaan', async () => {
  const r = await siap();
  const a = await r.tambahAnak({ nama: 'Aisyah', kelas: 4, hewan: 'gajah' });
  const p = await r.pengaturan(a.id);
  expect(p.belajarMenit).toBe(40);
  expect(p.gameMenit).toBe(30);
  expect(p.gameSetelahInti).toBe(true);
  const b = await r.tambahAnak({ nama: 'Rani', kelas: 1, hewan: 'kucing' });
  expect((await r.pengaturan(b.id)).gameMenit).toBe(20);
});

test('pengaturan dijaga dalam batas', async () => {
  const r = await siap();
  const a = await r.tambahAnak({ nama: 'Rani', kelas: 2, hewan: 'kucing' });
  await r.aturPengaturan({ ...(await r.pengaturan(a.id)), belajarMenit: 90, gameMenit: 120 });
  const p = await r.pengaturan(a.id);
  expect(p.belajarMenit).toBe(20);
  expect(p.gameMenit).toBe(60);
});

test('sesi + jawaban tersimpan dulu, terkirim saat ada pengirim (tanpa ganda)', async () => {
  const diterimaServer = new Map<string, object>();
  let gagal = true;
  const pengirim: PengirimSinkron = {
    async kirim(item: { antrean: ItemAntrean; baris: object }[]) {
      if (gagal) throw new Error('putus');
      for (const i of item) diterimaServer.set(`${i.antrean.tabel}:${i.antrean.barisId}`, i.baris);
      return item.map((i) => i.antrean.id);
    },
  };
  const r = await siap(pengirim);
  const a = await r.tambahAnak({ nama: 'Aisyah', kelas: 6, hewan: 'gajah' });
  const jawaban = Array.from({ length: 20 }, (_, i) => ({
    urutan: i + 1,
    soal: `${i} + 1`,
    kunci: String(i + 1),
    jawaban: String(i + 1),
    benar: true,
    detik: 3,
    hapusN: 0,
  }));
  const s = await r.simpanSesi(
    { anak_id: a.id, jenis: 'lancar', mode: 'sendiri', kelas: 6, level: 1, mulai: new Date().toISOString(), selesai: new Date().toISOString(), durasiDetik: 60, benar: 20, jumlah: 20 },
    jawaban,
  );
  expect(await r.statusBaris(s.id)).toBe('tersimpan');
  const t0 = new Date();
  const hasil1 = await r.sinkron(200, t0);
  expect(hasil1.terkirim).toBe(0);
  expect(await r.statusBaris(s.id)).toBe('tersimpan');
  // jeda: tidak dicoba lagi sebelum 1 menit
  gagal = false;
  expect((await r.sinkron(200, new Date(t0.getTime() + 10_000))).terkirim).toBe(0);
  const hasil2 = await r.sinkron(200, new Date(t0.getTime() + 61_000));
  expect(hasil2.sisa).toBe(0);
  expect(await r.statusBaris(s.id)).toBe('terkirim');
  const jumlahJawaban = [...diterimaServer.keys()].filter((k) => k.startsWith('jawaban:')).length;
  expect(jumlahJawaban).toBe(20);
  // kirim ulang tidak menambah apa pun
  await r.sinkron(200, new Date(t0.getTime() + 3_600_000));
  expect([...diterimaServer.keys()].filter((k) => k.startsWith('jawaban:')).length).toBe(20);
});

test('mode lokal: sesi tetap tersimpan tanpa pengirim', async () => {
  const r = await siap(null);
  const a = await r.tambahAnak({ nama: 'Rani', kelas: 3, hewan: 'penyu' });
  await r.simpanSesi({ anak_id: a.id, jenis: 'lancar', mode: 'sendiri', kelas: 3, mulai: '2026-11-02T08:00:00Z', selesai: '2026-11-02T08:03:00Z', durasiDetik: 180, benar: 18, jumlah: 20 }, []);
  expect(await r.daftarSesi(a.id)).toHaveLength(1);
  expect((await r.antreanBelumTerkirim()).length).toBeGreaterThan(0);
});

test('tanda bimbingan topik', async () => {
  const r = await siap();
  const a = await r.tambahAnak({ nama: 'Aisyah', kelas: 6, hewan: 'gajah' });
  let k = await r.catatTopik(a.id, 'tka', 'M03', 1, 5);
  expect(k.tanda).toBe('merah');
  k = await r.catatTopik(a.id, 'tka', 'M04', 3, 2);
  expect(k.tanda).toBe('kuning');
  k = await r.catatTopik(a.id, 'tka', 'M05', 9, 1);
  expect(k.tanda).toBe('hijau');
  expect(k.status).toBe('kuasai');
});

test('pesan dua arah dan tanda dibaca', async () => {
  const r = await siap();
  const a = await r.tambahAnak({ nama: 'Aisyah', kelas: 6, hewan: 'gajah' });
  await r.kirimPesan({ anak_id: a.id, dari: 'orang_tua', jenis: 'teks', isi: 'Semangat!' });
  await r.kirimPesan({ anak_id: a.id, dari: 'anak', jenis: 'stiker', isi: '😊' });
  await r.tandaiDibaca(a.id, 'orang_tua');
  const p = await r.daftarPesan(a.id);
  expect(p).toHaveLength(2);
  expect(p.find((x) => x.dari === 'orang_tua')?.dibaca).toBeTruthy();
  expect(p.find((x) => x.dari === 'anak')?.dibaca).toBeFalsy();
});
