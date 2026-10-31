import { GudangMemori } from '../gudang';
import type { ItemAntrean, NamaTabel, Pemakaian } from '../jenis';
import { gabungPemakaian, Repositori, samaIsi, type PengirimSinkron } from '../repositori';

type Baris = { id: string } & Record<string, unknown>;

/** Server tiruan: menyimpan baris dengan "diubah" yang naik, membatasi apa yang dilihat HP anak. */
class ServerTiruan {
  tabel = new Map<NamaTabel, Map<string, { baris: Baris; diubah: string }>>();
  private jam = Date.parse('2026-11-01T08:00:00Z');
  gagalJawaban = 0;
  gagalTarik = new Set<NamaTabel>();

  tulis(tabel: NamaTabel, baris: Baris, hanyaTambah = false) {
    const t = this.tabel.get(tabel) ?? new Map();
    this.tabel.set(tabel, t);
    if (hanyaTambah && t.has(baris.id)) return;
    this.jam += 1000;
    t.set(baris.id, { baris: JSON.parse(JSON.stringify(baris)), diubah: new Date(this.jam).toISOString() });
  }

  pengirim(peran: 'ortu' | 'anak', anakBoleh: string[] = []): PengirimSinkron {
    const lihat = (tabel: NamaTabel, b: Baris) => peran === 'ortu' || (tabel === 'anak' ? anakBoleh.includes(b.id) : anakBoleh.includes(String(b.anak_id)));
    return {
      kirim: async (item: { antrean: ItemAntrean; baris: object }[]) => {
        const diterima: string[] = [];
        for (const i of item) {
          const b = i.baris as Baris;
          if (peran === 'anak' && (i.antrean.tabel === 'anak' || i.antrean.tabel === 'pengaturan_waktu')) continue;
          this.tulis(i.antrean.tabel, b, i.antrean.tabel === 'sesi' || i.antrean.tabel === 'jawaban');
          diterima.push(i.antrean.id);
        }
        return diterima;
      },
      tarik: async (tabel, { sejak, offset, batas }) => {
        if (this.gagalTarik.has(tabel)) throw new Error('putus');
        const semua = [...(this.tabel.get(tabel)?.values() ?? [])]
          .filter((x) => lihat(tabel, x.baris) && (!sejak || Date.parse(x.diubah) >= Date.parse(sejak)))
          .sort((a, b) => a.diubah.localeCompare(b.diubah) || a.baris.id.localeCompare(b.baris.id));
        const halaman = semua.slice(offset, offset + batas);
        return { baris: halaman.map((x) => x.baris), kursorMaks: halaman.length ? halaman[halaman.length - 1].diubah : null };
      },
      jawabanUntuk: async (ids) => {
        if (this.gagalJawaban > 0) {
          this.gagalJawaban--;
          throw new Error('putus');
        }
        return [...(this.tabel.get('jawaban')?.values() ?? [])].map((x) => x.baris).filter((b) => ids.includes(String(b.sesi_id)) && lihat('jawaban', b));
      },
    };
  }
}

async function buat(pengirim: PengirimSinkron | null) {
  const r = new Repositori(new GudangMemori(), pengirim);
  await r.siapkan();
  return r;
}

const SESI = { jenis: 'lancar', mode: 'sendiri', kelas: 6, mulai: '2026-11-02T08:00:00.000Z', selesai: '2026-11-02T08:03:00.000Z', durasiDetik: 180, benar: 2, jumlah: 2 } as const;
const JAWABAN = (n: number) => Array.from({ length: n }, (_, i) => ({ urutan: i + 1, soal: `${i} + 1`, kunci: String(i + 1), jawaban: String(i + 1), benar: true, detik: 2.5, hapusN: 0 }));

/** HP orang tua dengan satu anak sudah terkirim ke server, dan HP anak yang sudah dihubungkan. */
async function siapkanDuaHp() {
  const server = new ServerTiruan();
  const ortu = await buat(server.pengirim('ortu'));
  const kel = await ortu.buatKeluarga('1234', 'Bunda');
  const rani = await ortu.tambahAnak({ nama: 'Rani', kelas: 6, hewan: 'kucing' });
  await ortu.sinkron();
  const anak = await buat(server.pengirim('anak', [rani.id]));
  await anak.pasangKeluargaHpAnak(kel.id, 'Bunda');
  await anak.tarik();
  return { server, ortu, anak, rani, kel };
}

test('HP anak menarik profil dan pengaturan setelah dihubungkan, tanpa PIN', async () => {
  const { anak, rani, kel } = await siapkanDuaHp();
  expect((await anak.daftarAnak()).map((a) => a.nama)).toEqual(['Rani']);
  expect((await anak.pengaturan(rani.id)).belajarMenit).toBe(60);
  const k = await anak.keluarga();
  expect(k).toMatchObject({ id: kel.id, hp: 'anak', sapaanOrtu: 'Bunda' });
  expect(await anak.periksaPin('')).toBe(false);
  expect(await anak.periksaPin('1234')).toBe(false);
});

test('hasil latihan anak sampai ke HP orang tua beserta jawabannya', async () => {
  const { anak, ortu, rani } = await siapkanDuaHp();
  const s = await anak.simpanSesi({ ...SESI, anak_id: rani.id }, JAWABAN(20));
  await anak.sinkron();
  expect(await ortu.daftarSesi(rani.id)).toHaveLength(0);
  expect(await ortu.tarik()).toBeGreaterThan(0);
  expect((await ortu.daftarSesi(rani.id)).map((x) => x.id)).toEqual([s.id]);
  expect(await ortu.jawabanSesi(s.id)).toHaveLength(20);
  // tarik ulang tidak mengubah apa pun (kursor mundur 5 menit mengambil baris yang sama, penggabungan idempoten)
  expect(await ortu.tarik()).toBe(0);
  expect(await ortu.daftarSesi(rani.id)).toHaveLength(1);
});

test('pesan dua arah dan tanda dibaca', async () => {
  const { anak, ortu, rani } = await siapkanDuaHp();
  await ortu.kirimPesan({ anak_id: rani.id, dari: 'orang_tua', jenis: 'teks', isi: 'Bangga sama kamu' });
  await ortu.sinkron();
  await anak.tarik();
  expect((await anak.daftarPesan(rani.id)).map((p) => p.isi)).toEqual(['Bangga sama kamu']);
  await anak.tandaiDibaca(rani.id, 'orang_tua');
  await anak.kirimPesan({ anak_id: rani.id, dari: 'anak', jenis: 'stiker', isi: 'rekor' });
  await anak.sinkron();
  await ortu.tarik();
  const pesan = await ortu.daftarPesan(rani.id);
  expect(pesan.map((p) => p.isi).sort()).toEqual(['Bangga sama kamu', 'rekor']);
  expect(pesan.find((p) => p.dari === 'orang_tua')?.dibaca).toBeTruthy();
});

test('pengaturan waktu dari orang tua berlaku di HP anak', async () => {
  const { anak, ortu, rani } = await siapkanDuaHp();
  await ortu.aturPengaturan({ ...(await ortu.pengaturan(rani.id)), gameMenit: 15, jamTenang: '20:00' });
  await ortu.sinkron();
  await anak.tarik();
  expect(await anak.pengaturan(rani.id)).toMatchObject({ gameMenit: 15, jamTenang: '20:00' });
});

test('perubahan di HP ini yang belum terkirim tidak ditimpa server', async () => {
  const { server, ortu, rani } = await siapkanDuaHp();
  // pengaturan di server berubah (mis. dari HP lain)
  const lama = (await ortu.pengaturan(rani.id)) as unknown as Baris;
  server.tulis('pengaturan_waktu', { ...lama, gameMenit: 5 });
  // orang tua mengubah di HP ini tapi belum sempat mengirim
  await ortu.aturPengaturan({ ...(await ortu.pengaturan(rani.id)), gameMenit: 45 });
  await ortu.tarik();
  expect((await ortu.pengaturan(rani.id)).gameMenit).toBe(45);
  await ortu.sinkron();
  expect(server.tabel.get('pengaturan_waktu')?.get(rani.id)?.baris.gameMenit).toBe(45);
  // setelah terkirim, perubahan server berikutnya diterima
  server.tulis('pengaturan_waktu', { ...(server.tabel.get('pengaturan_waktu')!.get(rani.id)!.baris as Baris), gameMenit: 10 });
  await ortu.tarik();
  expect((await ortu.pengaturan(rani.id)).gameMenit).toBe(10);
});

test('pemakaian dari dua HP digabung: terbesar menang, hasil sama di kedua HP', async () => {
  const { anak, ortu, rani } = await siapkanDuaHp();
  const tgl = '2026-11-02';
  await ortu.simpanPemakaian({ id: `${rani.id}:${tgl}`, anak_id: rani.id, tanggal: tgl, belajarDetik: 100, mainDetik: 0, blokDetik: 100, intiSelesai: false });
  await ortu.sinkron();
  await anak.simpanPemakaian({ id: `${rani.id}:${tgl}`, anak_id: rani.id, tanggal: tgl, belajarDetik: 300, mainDetik: 60, blokDetik: 200, intiSelesai: true, istirahatSampai: '2026-11-02T09:00:00.000Z' });
  await anak.sinkron();
  await ortu.tarik();
  await ortu.sinkron();
  await anak.tarik();
  const a = await ortu.pemakaian(rani.id, tgl);
  const b = await anak.pemakaian(rani.id, tgl);
  expect(a).toMatchObject({ belajarDetik: 300, mainDetik: 60, intiSelesai: true });
  expect(samaIsi(a, b)).toBe(true);
  expect(await ortu.tarik()).toBe(0);
  expect(await anak.tarik()).toBe(0);
});

test('gabungPemakaian: komutatif dan idempoten', () => {
  const x: Pemakaian = { id: 'a:d', anak_id: 'a', tanggal: 'd', belajarDetik: 10, mainDetik: 50, blokDetik: 5, intiSelesai: false, istirahatSampai: '2026-11-02T09:00:00.000Z' };
  const y: Pemakaian = { id: 'a:d', anak_id: 'a', tanggal: 'd', belajarDetik: 30, mainDetik: 20, blokDetik: 9, intiSelesai: true };
  expect(samaIsi(gabungPemakaian(x, y), gabungPemakaian(y, x))).toBe(true);
  expect(samaIsi(gabungPemakaian(gabungPemakaian(x, y), y), gabungPemakaian(x, y))).toBe(true);
  expect(gabungPemakaian(x, y)).toMatchObject({ belajarDetik: 30, mainDetik: 50, blokDetik: 9, intiSelesai: true, istirahatSampai: '2026-11-02T09:00:00.000Z' });
});

test('tarik gagal di tengah jalan: tidak ada yang hilang, putaran berikut melengkapi', async () => {
  const { server, anak, ortu, rani } = await siapkanDuaHp();
  const s = await anak.simpanSesi({ ...SESI, anak_id: rani.id }, JAWABAN(5));
  await anak.sinkron();
  // jawaban gagal ditarik: sesi tidak boleh masuk setengah jalan
  server.gagalJawaban = 1;
  await ortu.tarik();
  expect(await ortu.daftarSesi(rani.id)).toHaveLength(0);
  await ortu.tarik();
  expect((await ortu.daftarSesi(rani.id)).map((x) => x.id)).toEqual([s.id]);
  expect(await ortu.jawabanSesi(s.id)).toHaveLength(5);
  // tabel yang gagal tidak menghentikan tabel lain
  server.gagalTarik.add('pesan');
  await anak.kirimPesan({ anak_id: rani.id, dari: 'anak', jenis: 'stiker', isi: 'rekor' });
  await anak.sinkron();
  const s2 = await anak.simpanSesi({ ...SESI, anak_id: rani.id, mulai: '2026-11-03T08:00:00.000Z' }, JAWABAN(2));
  await anak.sinkron();
  await ortu.tarik();
  expect((await ortu.daftarSesi(rani.id)).map((x) => x.id)).toContain(s2.id);
  expect(await ortu.daftarPesan(rani.id)).toHaveLength(0);
  server.gagalTarik.clear();
  await ortu.tarik();
  expect(await ortu.daftarPesan(rani.id)).toHaveLength(1);
});

test('banyak halaman: semua sesi ikut ditarik', async () => {
  const { anak, ortu, rani } = await siapkanDuaHp();
  for (let i = 0; i < 12; i++) {
    await anak.simpanSesi({ ...SESI, anak_id: rani.id, mulai: `2026-11-${String(2 + (i % 20)).padStart(2, '0')}T08:${String(i).padStart(2, '0')}:00.000Z` }, JAWABAN(1));
  }
  await anak.sinkron();
  await ortu.tarik();
  expect(await ortu.daftarSesi(rani.id)).toHaveLength(12);
});

test('HP anak tidak pernah mengirim profil atau pengaturan, dan tidak melihat anak lain', async () => {
  const { server, ortu, anak, kel } = await siapkanDuaHp();
  const budi = await ortu.tambahAnak({ nama: 'Budi', kelas: 3, hewan: 'gajah' });
  await ortu.sinkron();
  await anak.tarik();
  expect((await anak.daftarAnak()).map((a) => a.nama)).toEqual(['Rani']);
  expect(server.tabel.get('anak')?.has(budi.id)).toBe(true);
  expect(kel.id).toBeTruthy();
  expect(await anak.antreanBelumTerkirim()).toHaveLength(0);
});

test('tanpa pengirim (mode lokal) tarik tidak melakukan apa pun', async () => {
  const lokal = await buat(null);
  expect(await lokal.tarik()).toBe(0);
  expect(await lokal.sinkronDuaArah()).toEqual({ terkirim: 0, sisa: 0, ditarik: 0 });
});

test('kirim otomatis: pesan langsung dikirim sekitar 1,5 detik kemudian, banyak simpanan jadi satu kali', async () => {
  jest.useFakeTimers();
  try {
    const server = new ServerTiruan();
    const dasar = server.pengirim('ortu');
    let jumlahKirim = 0;
    const r = await buat({
      ...dasar,
      kirim: async (item) => {
        jumlahKirim++;
        return dasar.kirim(item);
      },
    });
    await r.buatKeluarga('1234');
    const a = await r.tambahAnak({ nama: 'Rani', kelas: 6, hewan: 'kucing' });
    // dimatikan secara bawaan: tidak ada pengiriman sendiri
    await jest.advanceTimersByTimeAsync(5000);
    expect(jumlahKirim).toBe(0);
    r.aturKirimOtomatis(true);
    await r.kirimPesan({ anak_id: a.id, dari: 'orang_tua', jenis: 'teks', isi: 'Hai' });
    await r.kirimPesan({ anak_id: a.id, dari: 'orang_tua', jenis: 'teks', isi: 'Hai lagi' });
    await jest.advanceTimersByTimeAsync(1000);
    expect(jumlahKirim).toBe(0);
    await jest.advanceTimersByTimeAsync(1000);
    expect(jumlahKirim).toBe(1);
    expect([...(server.tabel.get('pesan')?.values() ?? [])]).toHaveLength(2);
    expect(await r.antreanBelumTerkirim()).toHaveLength(0);
    r.aturKirimOtomatis(false);
  } finally {
    jest.useRealTimers();
  }
});
