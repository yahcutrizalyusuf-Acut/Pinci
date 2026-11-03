import { GudangMemori } from '../gudang';
import type { ItemAntrean } from '../jenis';
import { Repositori, type PengirimSinkron } from '../repositori';

type Baris = { id: string } & Record<string, unknown>;

/** Server sederhana: satu keluarga, menyimpan anak dan pengaturan, bisa menghapus anak. */
function serverSederhana(gagalHapus = { nyala: false }) {
  const anak = new Map<string, Baris>();
  let jam = Date.parse('2026-11-01T08:00:00Z');
  const diubah = new Map<string, string>();
  const p: PengirimSinkron = {
    kirim: async (item: { antrean: ItemAntrean; baris: object }[]) => {
      for (const i of item) {
        if (i.antrean.tabel === 'anak') {
          const b = i.baris as Baris;
          anak.set(b.id, b);
          jam += 1000;
          diubah.set(b.id, new Date(jam).toISOString());
        }
      }
      return item.map((i) => i.antrean.id);
    },
    tarik: async (tabel) => {
      if (tabel !== 'anak') return { baris: [], kursorMaks: null };
      return { baris: [...anak.values()], kursorMaks: [...diubah.values()].sort().at(-1) ?? null };
    },
    hapusAnak: async (id) => {
      if (gagalHapus.nyala) return false;
      anak.delete(id);
      return true;
    },
  };
  return { p, anak };
}

test('profil kembar (nama dan kelas sama) tidak dibuat dua kali', async () => {
  const r = new Repositori(new GudangMemori());
  await r.buatKeluarga('1234');
  const a = await r.tambahAnak({ nama: 'Jinan', kelas: 6, hewan: 'kucing' });
  const b = await r.tambahAnak({ nama: ' jinan ', kelas: 6, hewan: 'ikan' });
  expect(b.id).toBe(a.id);
  expect(await r.daftarAnak()).toHaveLength(1);
  // Nama sama tetapi kelas berbeda tetap boleh (kakak beradik dengan nama panggilan sama jarang, tetapi mungkin).
  await r.tambahAnak({ nama: 'Jinan', kelas: 3, hewan: 'kucing' });
  expect(await r.daftarAnak()).toHaveLength(2);
});

test('hapus profil anak: hilang dari HP dan server, tidak muncul lagi saat sinkron', async () => {
  const s = serverSederhana();
  const r = new Repositori(new GudangMemori(), s.p);
  await r.buatKeluarga('1234');
  const a = await r.tambahAnak({ nama: 'Jinan', kelas: 6, hewan: 'kucing' });
  await r.sinkronDuaArah();
  expect(s.anak.has(a.id)).toBe(true);
  await r.hapusAnak(a.id);
  expect(await r.daftarAnak()).toHaveLength(0);
  expect(s.anak.has(a.id)).toBe(false);
  await r.sinkronDuaArah();
  expect(await r.daftarAnak()).toHaveLength(0);
});

test('hapus saat server tidak terjangkau: tidak ditarik lagi, penghapusan diulang saat sinkron', async () => {
  const gagal = { nyala: true };
  const s = serverSederhana(gagal);
  const r = new Repositori(new GudangMemori(), s.p);
  await r.buatKeluarga('1234');
  const a = await r.tambahAnak({ nama: 'Jinan', kelas: 6, hewan: 'kucing' });
  await r.sinkronDuaArah();
  await r.hapusAnak(a.id);
  await r.sinkronDuaArah();
  expect(await r.daftarAnak()).toHaveLength(0);
  expect(s.anak.has(a.id)).toBe(true);
  gagal.nyala = false;
  await r.sinkronDuaArah();
  expect(s.anak.has(a.id)).toBe(false);
});

test('pasang ulang: keluarga dipulihkan dengan id lama, profil anak lama ditarik kembali (tanpa kembar)', async () => {
  const s = serverSederhana();
  const lama = new Repositori(new GudangMemori(), s.p);
  const kel = await lama.buatKeluarga('1234');
  await lama.tambahAnak({ nama: 'Jinan', kelas: 6, hewan: 'kucing' });
  await lama.sinkronDuaArah();
  // HP yang sama setelah aplikasi dipasang ulang: gudang kosong, keluarga dipulihkan dari server.
  const baru = new Repositori(new GudangMemori(), s.p);
  const k2 = await baru.buatKeluarga('9999', 'Bunda', kel.id);
  expect(k2.id).toBe(kel.id);
  await baru.sinkronDuaArah();
  expect((await baru.daftarAnak()).map((a) => a.nama)).toEqual(['Jinan']);
});
