import { GudangMemori } from '../gudang';
import type { AnggotaKelas, CatatanPengawas, ItemAntrean, NamaTabel, Sesi, Tugas } from '../jenis';
import { Repositori, sesiMenyelesaikan, type PengirimSinkron } from '../repositori';

type Baris = { id: string } & Record<string, unknown>;

/**
 * Server tiruan untuk kelas: pengawas menulis catatan dan tugas langsung di server;
 * HP keluarga hanya boleh menandai "dibaca" dan "selesai" (seperti fungsi server).
 */
class ServerKelas {
  tabel = new Map<NamaTabel, Map<string, { baris: Baris; diubah: string }>>();
  kelas: AnggotaKelas[] = [];
  tolakTanda = false;
  private jam = Date.parse('2026-11-02T01:00:00Z');

  tulis(tabel: NamaTabel, baris: Baris) {
    const t = this.tabel.get(tabel) ?? new Map();
    this.tabel.set(tabel, t);
    this.jam += 1000;
    t.set(baris.id, { baris: JSON.parse(JSON.stringify(baris)), diubah: new Date(this.jam).toISOString() });
  }

  baris(tabel: NamaTabel, id: string) {
    return this.tabel.get(tabel)?.get(id)?.baris;
  }

  pengirim(): PengirimSinkron {
    return {
      kirim: async (item: { antrean: ItemAntrean; baris: object }[]) => {
        const diterima: string[] = [];
        for (const i of item) {
          const b = i.baris as Baris;
          if (i.antrean.tabel === 'catatan_pengawas' || i.antrean.tabel === 'tugas') {
            if (this.tolakTanda) continue;
            const kolom = i.antrean.tabel === 'tugas' ? 'selesai' : 'dibaca';
            const lama = this.baris(i.antrean.tabel, b.id);
            if (lama && !lama[kolom] && b[kolom]) this.tulis(i.antrean.tabel, { ...lama, [kolom]: b[kolom] });
          } else {
            this.tulis(i.antrean.tabel, b);
          }
          diterima.push(i.antrean.id);
        }
        return diterima;
      },
      tarik: async (tabel, { sejak, offset, batas }) => {
        const semua = [...(this.tabel.get(tabel)?.values() ?? [])]
          .filter((x) => !sejak || Date.parse(x.diubah) >= Date.parse(sejak))
          .sort((a, b) => a.diubah.localeCompare(b.diubah));
        const halaman = semua.slice(offset, offset + batas);
        return { baris: halaman.map((x) => x.baris), kursorMaks: halaman.length ? halaman[halaman.length - 1].diubah : null };
      },
      jawabanUntuk: async () => [],
      kelasKeluarga: async () => this.kelas,
    };
  }
}

async function siapkan() {
  const server = new ServerKelas();
  const repo = new Repositori(new GudangMemori(), server.pengirim());
  await repo.siapkan();
  const kel = await repo.buatKeluarga('1234', 'Bunda');
  const rani = await repo.tambahAnak({ nama: 'Rani', kelas: 6, hewan: 'kucing' });
  await repo.sinkron();
  return { server, repo, kel, rani };
}

const tugas = (anakId: string, kel: string, lain: Partial<Tugas> = {}): Tugas => ({
  id: 'tg-1',
  keluarga_id: kel,
  anak_id: anakId,
  kelasId: 'k1',
  jenis: 'tka',
  rujukan: 'M03',
  judul: 'Ulang topik pecahan',
  dibuat: '2026-11-02T01:00:00.000Z',
  ...lain,
});

const sesi = (anakId: string, lain: Partial<Sesi> = {}): Omit<Sesi, 'id' | 'urutanHp'> => ({
  anak_id: anakId,
  jenis: 'tka',
  mode: 'sendiri',
  kelas: 6,
  rujukan: 'M03-rumah',
  mulai: '2026-11-02T08:00:00.000Z',
  selesai: '2026-11-02T08:10:00.000Z',
  durasiDetik: 600,
  benar: 5,
  jumlah: 6,
  ...lain,
});

test('tugas dari pengawas sampai di HP, selesai otomatis saat anak mengerjakan topik itu, dan tanda selesai sampai ke server', async () => {
  const { server, repo, kel, rani } = await siapkan();
  server.tulis('tugas', tugas(rani.id, kel.id) as unknown as Baris);
  await repo.tarik();
  expect((await repo.tugasTerbuka(rani.id)).map((t) => t.judul)).toEqual(['Ulang topik pecahan']);

  // Latihan lain tidak menyelesaikan tugas.
  await repo.simpanSesi(sesi(rani.id, { jenis: 'lancar', rujukan: undefined }), []);
  await repo.simpanSesi(sesi(rani.id, { rujukan: 'M07' }), []);
  expect(await repo.tugasTerbuka(rani.id)).toHaveLength(1);

  // Latihan rumah topik M03 menyelesaikannya.
  await repo.simpanSesi(sesi(rani.id), []);
  expect(await repo.tugasTerbuka(rani.id)).toHaveLength(0);
  expect((await repo.semuaTugas(rani.id))[0].selesai).toBe('2026-11-02T08:10:00.000Z');

  await repo.sinkron();
  expect(server.baris('tugas', 'tg-1')?.selesai).toBe('2026-11-02T08:10:00.000Z');
  // Tarik ulang tidak membuka lagi tugas yang sudah selesai.
  await repo.tarik();
  expect(await repo.tugasTerbuka(rani.id)).toHaveLength(0);
});

test('tanda selesai di HP tidak hilang walau server belum menerimanya, lalu dikirim ulang', async () => {
  const { server, repo, kel, rani } = await siapkan();
  server.tulis('tugas', tugas(rani.id, kel.id) as unknown as Baris);
  await repo.tarik();
  server.tolakTanda = true;
  await repo.simpanSesi(sesi(rani.id), []);
  await repo.sinkron(); // ditolak → tetap di antrean
  // Pengawas mengubah judul tugas di server; HP menarik perubahan itu.
  server.tulis('tugas', { ...(server.baris('tugas', 'tg-1') as Baris), judul: 'Ulang pecahan, ya' });
  await repo.tarik();
  const lokal = (await repo.semuaTugas(rani.id))[0];
  expect(lokal.judul).toBe('Ulang pecahan, ya');
  expect(lokal.selesai).toBeTruthy();
  server.tolakTanda = false;
  await repo.sinkron(200, new Date(Date.now() + 60 * 60_000));
  expect(server.baris('tugas', 'tg-1')?.selesai).toBeTruthy();
});

test('catatan pengawas: tampil terbaru dulu, ditandai dibaca sekali saja, tanda sampai ke server', async () => {
  const { server, repo, kel, rani } = await siapkan();
  const catatan = (id: string, waktu: string): CatatanPengawas => ({ id, keluarga_id: kel.id, anak_id: rani.id, kelasId: 'k1', isi: `Catatan ${id}`, waktu });
  server.tulis('catatan_pengawas', catatan('c1', '2026-11-02T03:00:00.000Z') as unknown as Baris);
  server.tulis('catatan_pengawas', catatan('c2', '2026-11-04T03:00:00.000Z') as unknown as Baris);
  await repo.tarik();
  expect((await repo.catatanPengawas()).map((c) => c.id)).toEqual(['c2', 'c1']);

  let ubah = 0;
  repo.dengar(() => ubah++);
  await repo.tandaiCatatanDibaca();
  expect(ubah).toBe(1);
  await repo.tandaiCatatanDibaca(); // tidak ada yang berubah → layar tidak dimuat ulang (mencegah muat tanpa henti)
  expect(ubah).toBe(1);
  expect((await repo.catatanPengawas()).every((c) => c.dibaca)).toBe(true);

  await repo.sinkron();
  expect(server.baris('catatan_pengawas', 'c1')?.dibaca).toBeTruthy();
  expect(server.baris('catatan_pengawas', 'c2')?.dibaca).toBeTruthy();
});

test('daftar kelas ditarik utuh: kelas baru masuk, kelas yang ditinggalkan hilang', async () => {
  const { server, repo, rani } = await siapkan();
  const anggota: AnggotaKelas = { id: 'ag1', anak_id: rani.id, kelasId: 'k1', kelasNama: 'Kancil', pengawasNama: 'Kak Nisa', paket: 'siap_tka', masuk: '2026-11-02T01:00:00.000Z', cobaSampai: '2026-11-16T01:00:00.000Z' };
  server.kelas = [anggota];
  expect(await repo.tarikKelas()).toBe(1);
  expect(await repo.kelasAnak(rani.id)).toMatchObject({ kelasNama: 'Kancil', pengawasNama: 'Kak Nisa' });
  expect(await repo.tarikKelas()).toBe(0);
  server.kelas = [];
  await repo.sinkronDuaArah();
  expect(await repo.kelasAnak(rani.id)).toBeNull();
});

test('pasangAnggotaKelas mengganti keanggotaan lama anak yang sama', async () => {
  const { repo, rani } = await siapkan();
  const a: AnggotaKelas = { id: 'ag1', anak_id: rani.id, kelasId: 'k1', kelasNama: 'Kancil', paket: 'dasar', masuk: '2026-11-02T01:00:00.000Z', cobaSampai: '2026-11-16T01:00:00.000Z' };
  await repo.pasangAnggotaKelas(a);
  await repo.pasangAnggotaKelas({ ...a, id: 'ag2', kelasNama: 'Rangkong' });
  expect((await repo.daftarKelasAnak()).map((x) => x.kelasNama)).toEqual(['Rangkong']);
  await repo.hapusAnggotaKelas(rani.id);
  expect(await repo.daftarKelasAnak()).toHaveLength(0);
});

describe('sesiMenyelesaikan', () => {
  const t = tugas('a', 'k');
  const s = (lain: Partial<Sesi>): Sesi => ({ ...sesi('a'), id: 's', urutanHp: 1, ...lain });
  test('jenis dan rujukan harus cocok', () => {
    expect(sesiMenyelesaikan(t, s({ rujukan: 'M03' }))).toBe(true);
    expect(sesiMenyelesaikan(t, s({ jenis: 'mini_tryout', rujukan: 'mini' }))).toBe(false);
    expect(sesiMenyelesaikan({ ...t, rujukan: undefined }, s({ jenis: 'mini_tryout', rujukan: 'mini' }))).toBe(true);
    expect(sesiMenyelesaikan(t, s({ jenis: 'baca' }))).toBe(false);
  });
  test('level Lancar dan game berlevel', () => {
    expect(sesiMenyelesaikan({ ...t, jenis: 'lancar', rujukan: '3' }, s({ jenis: 'lancar', rujukan: undefined, level: 3 }))).toBe(true);
    expect(sesiMenyelesaikan({ ...t, jenis: 'game', rujukan: 'kebun' }, s({ jenis: 'game', rujukan: 'kebun:L2' }))).toBe(true);
  });
  test('sesi sebelum tugas dibuat, anak lain, atau tugas dibatalkan tidak dihitung', () => {
    expect(sesiMenyelesaikan(t, s({ rujukan: 'M03', selesai: '2026-11-01T08:00:00.000Z' }))).toBe(false);
    expect(sesiMenyelesaikan(t, s({ rujukan: 'M03', anak_id: 'b' }))).toBe(false);
    expect(sesiMenyelesaikan({ ...t, dibatalkan: true }, s({ rujukan: 'M03' }))).toBe(false);
  });
});

describe('masukan dan catatan', () => {
  test('catatan pemakaian hanya dibuat bila orang tua setuju; aplikasi dibuka dicatat sekali sehari', async () => {
    const { server, repo, rani } = await siapkan();
    await repo.simpanSesi(sesi(rani.id, { jenis: 'lancar', rujukan: undefined }), []);
    await repo.bukaAplikasi(rani.id);
    expect(await repo.antreanBelumTerkirim().then((a) => a.filter((x) => x.tabel === 'catatan_pemakaian'))).toHaveLength(0);

    server.kelas = [{ id: 'ag1', anak_id: rani.id, kelasId: 'k1', kelasNama: 'Kancil', paket: 'dasar', masuk: '2026-11-02T01:00:00.000Z', cobaSampai: '2026-11-16T01:00:00.000Z', setujuPemakaian: true }];
    await repo.tarikKelas();
    await repo.simpanSesi(sesi(rani.id, { jenis: 'lancar', rujukan: undefined, durasiDetik: 200 }), []);
    await repo.bukaAplikasi(rani.id);
    await repo.bukaAplikasi(rani.id);
    const catatan = (await repo.antreanBelumTerkirim()).filter((x) => x.tabel === 'catatan_pemakaian');
    expect(catatan).toHaveLength(2);

    // Persetujuan dicabut di server → HP berhenti mencatat.
    server.kelas = [{ ...server.kelas[0], setujuPemakaian: false }];
    await repo.tarikKelas();
    await repo.simpanSesi(sesi(rani.id, { jenis: 'lancar', rujukan: undefined }), []);
    expect((await repo.antreanBelumTerkirim()).filter((x) => x.tabel === 'catatan_pemakaian')).toHaveLength(2);
  });

  test('masukan dan jawaban pertanyaan tersimpan lalu terkirim; catatan teknis yang sama tidak berulang', async () => {
    const { server, repo } = await siapkan();
    await repo.kirimMasukan('saran', '  Tambah soal cerita  ', '0.2.0');
    await repo.jawabPertanyaan('O01-m1', 'Pas');
    expect(await repo.nilai('masukan:O01-m1')).toBe('Pas');
    await repo.catatTeknis('TypeError: x');
    await repo.catatTeknis('TypeError: x');
    await repo.sinkron();
    expect([...(server.tabel.get('masukan')?.values() ?? [])].map((x) => x.baris.isi)).toEqual(['Tambah soal cerita']);
    expect(server.tabel.get('jawaban_pertanyaan')?.size).toBe(1);
    expect(server.tabel.get('catatan_teknis')?.size).toBe(1);
  });
});
