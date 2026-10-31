import { GudangMemori } from '../gudang';
import { Repositori } from '../repositori';
import {
  barisServer,
  buatKodeHubung,
  buatPengirimSupabase,
  daftarkanKeluarga,
  daftarPerangkat,
  gabungKelas,
  gantiPaket,
  keluarKelas,
  keLokal,
  keSnake,
  masukAnonim,
  mintaKodeEmail,
  putuskanPerangkat,
  tukarKodeHubung,
  verifikasiKode,
} from '../supabase';

type Panggilan = { url: string; init: RequestInit };

function fetchTiruan(jawab: (p: Panggilan) => { ok: boolean; status?: number; json?: unknown }) {
  const panggilan: Panggilan[] = [];
  const f = (async (url: string, init: RequestInit) => {
    const p = { url, init };
    panggilan.push(p);
    const j = jawab(p);
    return { ok: j.ok, status: j.status ?? (j.ok ? 200 : 500), json: async () => j.json } as Response;
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

// ---------- tarik data dan hubungkan HP anak ----------

test('baris server (snake_case, kolom kosong, jam Postgres) menjadi baris lokal', () => {
  const sesi = keLokal('sesi', {
    id: 's1',
    keluarga_id: 'k1',
    anak_id: 'a1',
    jenis: 'lancar',
    mode: 'sendiri',
    kelas: 6,
    level: null,
    mulai: '2026-11-02T08:00:00+00:00',
    selesai: '2026-11-02T08:03:00.250+00:00',
    durasi_detik: 180,
    urutan_hp: 4,
    tambahan: { kpm: 90 },
    diterima_server: '2026-11-02T08:03:01+00:00',
  });
  expect(sesi).toEqual({ id: 's1', anak_id: 'a1', jenis: 'lancar', mode: 'sendiri', kelas: 6, mulai: '2026-11-02T08:00:00.000Z', selesai: '2026-11-02T08:03:00.250Z', durasiDetik: 180, urutanHp: 4, tambahan: { kpm: 90 } });
  expect(keLokal('pengaturan_waktu', { id: 'a1', anak_id: 'a1', keluarga_id: 'k', belajar_menit: 40, game_menit: 20, game_setelah_inti: true, jam_tenang: '21:00', jam_bangun: '06:00', bunyi: false, diubah: 'x' })).toEqual({
    id: 'a1',
    anak_id: 'a1',
    belajarMenit: 40,
    gameMenit: 20,
    gameSetelahInti: true,
    jamTenang: '21:00',
    jamBangun: '06:00',
    bunyi: false,
  });
  expect(keLokal('jawaban', { id: 'j', sesi_id: 's', anak_id: 'a', keluarga_id: 'k', urutan: 1, soal: '1+1', butir_id: null, kunci: '2', jawaban: '2', benar: true, detik: 2.5, hapus_n: 0, kode_salah: 'B', petunjuk_dipakai: 1 })).toMatchObject({ detik: 2.5, hapusN: 0, kodeSalah: 'B', petunjukDipakai: 1 });
  expect(keLokal('nilai', { id: 'x' })).toBeNull();
});

test('tarik: minta hanya yang baru dengan kursor, urut, per halaman; kursor jadi ISO', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true, json: [{ id: 'a', keluarga_id: 'k', anak_id: 'x', diubah: '2026-11-02T08:00:00+00:00', belajar_menit: 40 }, { id: 'b', anak_id: 'x', diubah: '2026-11-02T08:05:00.5+00:00' }] }));
  const p = buatPengirimSupabase({ url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok' });
  const h = await p.tarik!('pengaturan_waktu', { sejak: '2026-11-02T07:55:00.000Z', offset: 500, batas: 500 });
  expect(h.baris).toHaveLength(2);
  expect(h.kursorMaks).toBe('2026-11-02T08:05:00.500Z');
  const url = panggilan[0].url;
  expect(url).toContain('/rest/v1/pengaturan_waktu?select=*');
  expect(url).toContain(`diubah=gte.${encodeURIComponent('2026-11-02T07:55:00.000Z')}`);
  expect(url).toContain('order=diubah.asc,id.asc');
  expect(url).toContain('limit=500&offset=500');
  expect((panggilan[0].init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  // sesi memakai kursor diterima_server
  await p.tarik!('sesi', { sejak: null, offset: 0, batas: 500 });
  expect(panggilan[1].url).toContain('order=diterima_server.asc,id.asc');
  expect(panggilan[1].url).not.toContain('gte');
});

test('tarik tanpa token melempar galat (putaran dilewati), gagal HTTP juga', async () => {
  const { f } = fetchTiruan(() => ({ ok: false }));
  const tanpaToken = buatPengirimSupabase({ url: 'u', kunciAnon: 'a', fetchFn: f, ambilToken: async () => null });
  await expect(tanpaToken.tarik!('anak', { sejak: null, offset: 0, batas: 10 })).rejects.toThrow();
  const gagal = buatPengirimSupabase({ url: 'u', kunciAnon: 'a', fetchFn: f, ambilToken: async () => 't' });
  await expect(gagal.tarik!('anak', { sejak: null, offset: 0, batas: 10 })).rejects.toThrow();
  await expect(gagal.jawabanUntuk!(['s1'])).rejects.toThrow();
});

test('jawaban ditarik per sepuluh sesi dan per halaman 1000', async () => {
  const ids = Array.from({ length: 23 }, (_, i) => `s${i}`);
  const { f, panggilan } = fetchTiruan((p) => ({ ok: true, json: p.url.includes('s0,') && p.url.includes('offset=0') ? Array.from({ length: 1000 }, (_, i) => ({ id: `j${i}`, sesi_id: 's0' })) : [{ id: 'j-akhir', sesi_id: 's0' }] }));
  const p = buatPengirimSupabase({ url: 'u', kunciAnon: 'a', fetchFn: f, ambilToken: async () => 't' });
  const hasil = await p.jawabanUntuk!(ids);
  expect(panggilan.filter((x) => x.url.includes('offset=0'))).toHaveLength(3); // 10 + 10 + 3 sesi
  expect(panggilan.some((x) => x.url.includes('offset=1000'))).toBe(true);
  expect(hasil.length).toBeGreaterThan(1000);
  expect(panggilan[0].url).toContain('sesi_id=in.(s0,s1,s2,s3,s4,s5,s6,s7,s8,s9)');
});

test('HP anak: stiker terkirim (abaikan ganda); pesan orang tua hanya ditandai dibaca lewat fungsi server; profil tidak dikirim', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true }));
  const p = buatPengirimSupabase({ url: 'https://x', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilKeluargaId: async () => 'kel', ambilPeran: async () => 'anak' });
  const antre = (id: string, tabel: 'pesan' | 'anak' | 'pengaturan_waktu' | 'sesi', baris: object) => ({ antrean: { id, tabel, barisId: id, dibuat: '', coba: 0 }, baris });
  const hasil = await p.kirim([
    antre('q1', 'pesan', { id: 'p1', anak_id: 'a', dari: 'anak', jenis: 'stiker', isi: 'rekor', waktu: '2026-11-02T08:00:00.000Z' }),
    antre('q2', 'pesan', { id: 'p2', anak_id: 'a', dari: 'orang_tua', jenis: 'teks', isi: 'Bangga', waktu: '2026-11-02T07:00:00.000Z', dibaca: '2026-11-02T08:10:00.000Z' }),
    antre('q3', 'pesan', { id: 'p3', anak_id: 'a', dari: 'orang_tua', jenis: 'teks', isi: 'Belum dibaca', waktu: '2026-11-02T07:00:00.000Z' }),
    antre('q4', 'anak', { id: 'a', nama: 'Rani', kelas: 6, hewan: 'kucing' }),
    antre('q5', 'pengaturan_waktu', { id: 'a', anak_id: 'a' }),
  ]);
  const url = panggilan.map((x) => x.url.split('/rest/v1/')[1].split('?')[0]);
  expect(url).toEqual(['rpc/tandai_pesan_dibaca', 'pesan']);
  const rpc = JSON.parse(panggilan[0].init.body as string);
  expect(rpc.p_ids).toEqual(['p2']);
  const kirim = panggilan[1];
  expect((kirim.init.headers as Record<string, string>).Prefer).toContain('ignore-duplicates');
  expect(JSON.parse(kirim.init.body as string).map((b: { id: string }) => b.id)).toEqual(['p1']);
  // q4 dan q5 tidak pernah dikirim HP anak; q3 (belum dibaca) tidak perlu dikirim
  expect(hasil.sort()).toEqual(['q1', 'q2', 'q3']);
});

test('HP orang tua mengirim pesan dengan merge (agar tanda dibaca dari anak ikut tersimpan)', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true }));
  const p = buatPengirimSupabase({ url: 'https://x', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilKeluargaId: async () => 'kel', ambilPeran: async () => 'ortu' });
  await p.kirim([{ antrean: { id: 'q', tabel: 'pesan', barisId: 'p', dibuat: '', coba: 0 }, baris: { id: 'p', anak_id: 'a', dari: 'orang_tua', jenis: 'teks', isi: 'Hai', waktu: '2026-11-02T08:00:00.000Z' } }]);
  expect((panggilan[0].init.headers as Record<string, string>).Prefer).toContain('merge-duplicates');
});

test('masuk anonim, tukar kode, buat kode, daftar dan putuskan perangkat', async () => {
  const { f, panggilan } = fetchTiruan((p) => {
    if (p.url.endsWith('/auth/v1/signup')) return { ok: true, json: { access_token: 'A', refresh_token: 'R', expires_in: 3600, user: { id: 'u-anak' } } };
    if (p.url.includes('tukar_kode_hubung')) {
      const kode = JSON.parse(p.init.body as string).p_kode;
      const isi = kode === '123456' ? { ok: true, keluarga_id: 'k1', sapaan: 'Bunda', anak_ids: ['a1'] } : kode === '999999' ? { ok: false, alasan: 'terlalu_sering' } : { ok: false, alasan: 'salah' };
      return { ok: true, json: isi };
    }
    if (p.url.includes('buat_kode_hubung')) return JSON.parse(p.init.body as string).p_anak_ids[0] === 'belum' ? { ok: false, status: 400 } : { ok: true, json: { kode: '482913', berlaku_sampai: '2026-11-02T08:10:00+00:00' } };
    if (p.url.includes('/perangkat?select')) return { ok: true, json: [{ id: 'p1', anak_ids: ['a1'], terakhir_sinkron: '2026-11-02T08:00:00+00:00', antrean_belum_kirim: 2, versi_aplikasi: '1.0', diputus: false }] };
    return { ok: true };
  });
  const o = { url: 'https://x', kunciAnon: 'anon', fetchFn: f };
  const sesi = await masukAnonim(o);
  expect(sesi).toMatchObject({ tokenAkses: 'A', penggunaId: 'u-anak' });
  expect(JSON.parse(panggilan[0].init.body as string)).toEqual({ data: {} });

  const oAnak = { ...o, ambilToken: async () => 'A' };
  expect(await tukarKodeHubung(oAnak, ' 123456 ', '1.0')).toEqual({ ok: true, keluargaId: 'k1', sapaan: 'Bunda', anakIds: ['a1'] });
  expect(JSON.parse(panggilan[1].init.body as string)).toEqual({ p_kode: '123456', p_versi: '1.0' });
  expect(await tukarKodeHubung(oAnak, '000000', '1.0')).toEqual({ ok: false, alasan: 'salah' });
  expect(await tukarKodeHubung(oAnak, '999999', '1.0')).toEqual({ ok: false, alasan: 'terlalu_sering' });
  expect(await tukarKodeHubung({ ...o, ambilToken: async () => null }, '123456', '1.0')).toEqual({ ok: false, alasan: 'jaringan' });

  const oOrtu = { ...o, ambilToken: async () => 'T' };
  expect(await buatKodeHubung(oOrtu, ['a1'])).toEqual({ ok: true, kode: '482913', berlakuSampai: '2026-11-02T08:10:00+00:00' });
  expect(await buatKodeHubung(oOrtu, ['belum'])).toEqual({ ok: false, alasan: 'anak_belum_terkirim' });
  expect(await buatKodeHubung({ ...o, ambilToken: async () => null }, ['a1'])).toEqual({ ok: false, alasan: 'belum_masuk' });

  expect(await daftarPerangkat(oOrtu)).toEqual([{ id: 'p1', anakIds: ['a1'], terakhirSinkron: '2026-11-02T08:00:00.000Z', antreanBelumKirim: 2, versiAplikasi: '1.0', diputus: false }]);
  expect(await putuskanPerangkat(oOrtu, 'p1')).toBe(true);
  const putus = panggilan[panggilan.length - 1];
  expect(putus.url).toContain('/rest/v1/perangkat?id=eq.p1');
  expect(putus.init.method).toBe('PATCH');
  expect(JSON.parse(putus.init.body as string)).toEqual({ diputus: true });
});

test('masuk anonim gagal (fitur belum dinyalakan di Supabase) mengembalikan null', async () => {
  const { f } = fetchTiruan(() => ({ ok: false, status: 422 }));
  expect(await masukAnonim({ url: 'https://x', kunciAnon: 'anon', fetchFn: f })).toBeNull();
});

test('tanda dibaca (catatan) dan selesai (tugas) dikirim lewat fungsi server, dikelompokkan per waktu', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true, json: 1 }));
  const p = buatPengirimSupabase({ url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilKeluargaId: async () => 'kel' });
  const item = (tabel: 'tugas' | 'catatan_pengawas', id: string, baris: object) => ({ antrean: { id: `q-${id}`, tabel, barisId: id, dibuat: '', coba: 0 }, baris: { id, ...baris } });
  const diterima = await p.kirim([
    item('tugas', 't1', { selesai: '2026-11-02T08:00:00.000Z' }),
    item('tugas', 't2', { selesai: '2026-11-02T08:00:00.000Z' }),
    item('tugas', 't3', { selesai: '2026-11-03T08:00:00.000Z' }),
    item('tugas', 't4', {}),
    item('catatan_pengawas', 'c1', { dibaca: '2026-11-02T09:00:00.000Z', isi: 'jangan dikirim' }),
  ]);
  expect(diterima.sort()).toEqual(['q-c1', 'q-t1', 'q-t2', 'q-t3', 'q-t4']);
  const rpc = panggilan.map((x) => ({ fungsi: x.url.split('/rpc/')[1], isi: JSON.parse(x.init.body as string) }));
  expect(rpc).toEqual([
    { fungsi: 'tandai_catatan_dibaca', isi: { p_ids: ['c1'], p_waktu: '2026-11-02T09:00:00.000Z' } },
    { fungsi: 'tandai_tugas_selesai', isi: { p_ids: ['t1', 't2'], p_waktu: '2026-11-02T08:00:00.000Z' } },
    { fungsi: 'tandai_tugas_selesai', isi: { p_ids: ['t3'], p_waktu: '2026-11-03T08:00:00.000Z' } },
  ]);
  // Tidak pernah menulis langsung ke tabel tugas/catatan (hanya pengawas yang boleh).
  expect(panggilan.some((x) => /\/rest\/v1\/(tugas|catatan_pengawas)\?/.test(x.url))).toBe(false);
});

test('tarik disaring keluarga HP ini (akun yang juga staf tidak menarik anak keluarga lain)', async () => {
  const { f, panggilan } = fetchTiruan(() => ({ ok: true, json: [] }));
  const p = buatPengirimSupabase({ url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilKeluargaId: async () => 'kel-1' });
  await p.tarik!('sesi', { sejak: null, offset: 0, batas: 500 });
  await p.tarik!('tugas', { sejak: '2026-11-02T00:00:00.000Z', offset: 0, batas: 500 });
  expect(panggilan[0].url).toContain('&keluarga_id=eq.kel-1');
  expect(panggilan[1].url).toContain('diubah=gte.');
  expect(panggilan[1].url).toContain('&keluarga_id=eq.kel-1');
});

test('baris tugas dan catatan server menjadi baris lokal', () => {
  expect(keLokal('tugas', { id: 't', keluarga_id: 'k', anak_id: 'a', kelas_id: 'kl', staf_id: 's', jenis: 'tka', rujukan: null, judul: 'J', pesan: null, dibuat: '2026-11-02 01:00:00+00', selesai: null, dibatalkan: false, diubah: 'x' })).toEqual({
    id: 't',
    keluarga_id: 'k',
    anak_id: 'a',
    kelasId: 'kl',
    jenis: 'tka',
    judul: 'J',
    dibuat: '2026-11-02T01:00:00.000Z',
    dibatalkan: false,
  });
  expect(keLokal('catatan_pengawas', { id: 'c', keluarga_id: 'k', anak_id: 'a', kelas_id: 'kl', isi: 'I', waktu: '2026-11-02T01:00:00Z', dibaca: null })).toMatchObject({ kelasId: 'kl', isi: 'I' });
});

test('kelas keluarga, gabung kelas, ganti paket, keluar kelas', async () => {
  const jawaban: Record<string, { ok: boolean; status?: number; json?: unknown }> = {
    kelas_keluarga: { ok: true, json: [{ anggota_id: 'ag', anak_id: 'a', kelas_id: 'k', kelas_nama: 'Kancil', pengawas_nama: null, paket: 'dasar', masuk: '2026-11-02 01:00:00+00', coba_sampai: '2026-11-16 01:00:00+00' }] },
    gabung_kelas: { ok: true, json: { ok: true, anggota_id: 'ag', kelas_id: 'k', kelas_nama: 'Kancil', pengawas_nama: 'Kak Nisa', paket: 'lengkap', coba_sampai: '2026-11-16T01:00:00Z' } },
    ganti_paket: { ok: true, json: { ok: true } },
    keluar_kelas: { ok: true, json: 1 },
  };
  const { f, panggilan } = fetchTiruan((x) => jawaban[x.url.split('/rpc/')[1]] ?? { ok: false });
  const opsi = { url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok' };
  const k = await buatPengirimSupabase(opsi).kelasKeluarga!();
  expect(k).toEqual([{ id: 'ag', anak_id: 'a', kelasId: 'k', kelasNama: 'Kancil', paket: 'dasar', masuk: '2026-11-02T01:00:00.000Z', cobaSampai: '2026-11-16T01:00:00.000Z' }]);
  const g = await gabungKelas(opsi, { kode: 'knc4r7', anakId: 'a', paket: 'lengkap', versiTeks: 'kelas-v1', setujuPemakaian: true });
  expect(g).toMatchObject({ ok: true, anggota: { kelasNama: 'Kancil', pengawasNama: 'Kak Nisa', paket: 'lengkap', cobaSampai: '2026-11-16T01:00:00.000Z' } });
  expect(JSON.parse(panggilan[1].init.body as string)).toEqual({ p_kode: 'knc4r7', p_anak_id: 'a', p_paket: 'lengkap', p_versi_teks: 'kelas-v1', p_setuju_pemakaian: true });
  expect(await gantiPaket(opsi, 'a', 'dasar')).toBe(true);
  expect(await keluarKelas(opsi, 'a')).toBe(true);

  jawaban.gabung_kelas = { ok: true, json: { ok: false, alasan: 'penuh' } };
  expect(await gabungKelas(opsi, { kode: 'X', anakId: 'a', paket: 'dasar', versiTeks: 'v', setujuPemakaian: false })).toEqual({ ok: false, alasan: 'penuh' });
  jawaban.gabung_kelas = { ok: false, status: 500 };
  expect(await gabungKelas(opsi, { kode: 'X', anakId: 'a', paket: 'dasar', versiTeks: 'v', setujuPemakaian: false })).toEqual({ ok: false, alasan: 'jaringan' });
  expect(await gabungKelas({ ...opsi, ambilToken: async () => null }, { kode: 'X', anakId: 'a', paket: 'dasar', versiTeks: 'v', setujuPemakaian: false })).toEqual({ ok: false, alasan: 'belum_masuk' });
});
