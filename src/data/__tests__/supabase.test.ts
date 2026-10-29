import { GudangMemori } from '../gudang';
import { Repositori } from '../repositori';
import { barisServer, buatPengirimSupabase, daftarkanKeluarga, keSnake, mintaKodeEmail, verifikasiKode } from '../supabase';

type Panggilan = { url: string; init: RequestInit };

function fetchTiruan(jawab: (p: Panggilan) => { ok: boolean; json?: unknown }) {
  const panggilan: Panggilan[] = [];
  const f = (async (url: string, init: RequestInit) => {
    const p = { url, init };
    panggilan.push(p);
    const j = jawab(p);
    return { ok: j.ok, json: async () => j.json } as Response;
  }) as unknown as typeof fetch;
  return { f, panggilan };
}

test('camelCase ke snake_case dan hanya kolom server', () => {
  expect(keSnake('durasiDetik')).toBe('durasi_detik');
  const b = barisServer('sesi', { id: 's', anak_id: 'a', durasiDetik: 30, urutanHp: 2, asing: 1 }, 'kel');
  expect(b).toEqual({ id: 's', anak_id: 'a', durasi_detik: 30, urutan_hp: 2, keluarga_id: 'kel' });
  expect(barisServer('nilai', { id: 'x' }, 'kel')).toBeNull();
});

test('sinkron penuh lewat Supabase tiruan: urutan tabel, upsert, token', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true }));
  let repo: Repositori;
  const pengirim = buatPengirimSupabase({ url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilKeluargaId: async () => (await repo.keluarga())?.id ?? null });
  repo = new Repositori(new GudangMemori(), pengirim);
  await repo.siapkan();
  const kel = await repo.buatKeluarga('1234');
  const anak = await repo.tambahAnak({ nama: 'Rafli', kelas: 6, hewan: 'harimau' });
  await repo.simpanSesi({ anak_id: anak.id, jenis: 'lancar', mode: 'sendiri', kelas: 6, mulai: '2026-11-02T08:00:00Z', selesai: '2026-11-02T08:03:00Z', durasiDetik: 180, benar: 1, jumlah: 1 }, [
    { urutan: 1, soal: '6 × 7', kunci: '42', jawaban: '42', benar: true, detik: 3, hapusN: 0 },
  ]);
  const h = await repo.sinkron();
  expect(h.sisa).toBe(0);
  const tabel = panggilan.map((p) => p.url.split('/rest/v1/')[1].split('?')[0]);
  expect(tabel.indexOf('anak')).toBeLessThan(tabel.indexOf('sesi'));
  expect(tabel.indexOf('sesi')).toBeLessThan(tabel.indexOf('jawaban'));
  const sesi = panggilan.find((p) => p.url.includes('/sesi?'))!;
  expect((sesi.init.headers as Record<string, string>).Prefer).toContain('ignore-duplicates');
  expect((sesi.init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  const isi = JSON.parse(sesi.init.body as string);
  expect(isi[0].keluarga_id).toBe(kel.id);
  expect(isi[0].durasi_detik).toBe(180);
  expect((panggilan.find((p) => p.url.includes('/pengaturan_waktu?'))!.init.headers as Record<string, string>).Prefer).toContain('merge-duplicates');
  expect(await repo.statusBaris(anak.id)).toBe('terkirim');
});

test('tanpa token tidak mengirim apa pun; sesi gagal → jawaban ditunda', async () => {
  const kosong = fetchTiruan(() => ({ ok: true }));
  const p1 = buatPengirimSupabase({ url: 'u', kunciAnon: 'a', fetchFn: kosong.f, ambilToken: async () => null });
  expect(await p1.kirim([])).toEqual([]);
  const gagal = fetchTiruan((p) => ({ ok: !p.url.includes('/sesi?') }));
  const p2 = buatPengirimSupabase({ url: 'u', kunciAnon: 'a', fetchFn: gagal.f, ambilToken: async () => 't' });
  const hasil = await p2.kirim([
    { antrean: { id: 'q1', tabel: 'sesi', barisId: 's', dibuat: '', coba: 0 }, baris: { id: 's' } },
    { antrean: { id: 'q2', tabel: 'jawaban', barisId: 'j', dibuat: '', coba: 0 }, baris: { id: 'j' } },
  ]);
  expect(hasil).toEqual([]);
  expect(gagal.panggilan.some((p) => p.url.includes('/jawaban?'))).toBe(false);
});

test('masuk dengan email + kode dan pendaftaran keluarga atomik', async () => {
  const { f, panggilan } = fetchTiruan((p) =>
    p.url.endsWith('/verify')
      ? { ok: true, json: { access_token: 'A', refresh_token: 'R', expires_in: 3600, user: { id: 'u1' } } }
      : p.url.includes('/rpc/')
        ? { ok: true, json: true }
        : { ok: true },
  );
  const o = { url: 'https://x', kunciAnon: 'anon', fetchFn: f };
  expect(await mintaKodeEmail(o, ' Ayah@Contoh.ID ')).toBe(true);
  expect(JSON.parse(panggilan[0].init.body as string).email).toBe('ayah@contoh.id');
  const s = await verifikasiKode(o, 'ayah@contoh.id', '123456');
  expect(s?.tokenAkses).toBe('A');
  expect(await daftarkanKeluarga(o, s!, { id: 'k1', sapaanOrtu: 'Ayah' })).toBe(true);
  expect(panggilan[2].url).toContain('/rest/v1/rpc/daftarkan_keluarga');
});
