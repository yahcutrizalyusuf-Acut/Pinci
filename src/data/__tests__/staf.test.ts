import { GalatStaf, beriTugas, kirimCatatan, papanKelas, terimaUndangan, undangStaf } from '../staf';
import type { OpsiSupabase } from '../supabase';

type Panggilan = { url: string; init: RequestInit };

function opsiTiruan(jawab: (p: Panggilan) => { status: number; json?: unknown }) {
  const panggilan: Panggilan[] = [];
  const f = (async (url: string, init: RequestInit) => {
    const p = { url, init };
    panggilan.push(p);
    const j = jawab(p);
    const teks = j.json === undefined ? '' : JSON.stringify(j.json);
    return { ok: j.status < 300, status: j.status, text: async () => teks, json: async () => j.json } as Response;
  }) as unknown as typeof fetch;
  const opsi: OpsiSupabase = { url: 'https://x.supabase.co', kunciAnon: 'anon', fetchFn: f, ambilToken: async () => 'tok', ambilPenggunaId: async () => 'staf-1' };
  return { opsi, panggilan };
}

test('terima undangan: staf terdaftar atau belum', async () => {
  let isi: unknown = { ok: true, peran: 'pengawas', nama: 'Kak Nisa', mitra_id: null };
  const { opsi } = opsiTiruan(() => ({ status: 200, json: isi }));
  expect(await terimaUndangan(opsi)).toEqual({ peran: 'pengawas', nama: 'Kak Nisa', mitraId: null });
  isi = { ok: false };
  expect(await terimaUndangan(opsi)).toBeNull();
});

test('galat server menjadi alasan yang bisa dijelaskan', async () => {
  const { opsi } = opsiTiruan(() => ({ status: 403, json: { message: 'tidak_boleh' } }));
  await expect(undangStaf(opsi, { email: 'a@b.id', peran: 'admin', nama: 'A' })).rejects.toMatchObject({ alasan: 'tidak_boleh' });
  const tanpaToken = { ...opsi, ambilToken: async () => null };
  await expect(undangStaf(tanpaToken, { email: 'a@b.id', peran: 'admin', nama: 'A' })).rejects.toBeInstanceOf(GalatStaf);
  const { opsi: o2 } = opsiTiruan(() => ({ status: 400, json: { message: 'pengawas_tidak_cocok' } }));
  await expect(undangStaf(o2, { email: 'a@b.id', peran: 'pengawas', nama: 'A' })).rejects.toMatchObject({ alasan: 'ditolak', message: 'pengawas_tidak_cocok' });
});

test('papan kelas dari server menjadi bentuk aplikasi', async () => {
  const { opsi, panggilan } = opsiTiruan(() => ({
    status: 200,
    json: {
      kelas: { id: 'k', nama: 'Kancil', kode: 'KNC4R7', kapasitas: 8, aktif: true, pengawas_id: 'staf-1' },
      hari_ini: '2026-11-04',
      pantauan_hari_ini: false,
      anak: [{ anak_id: 'a', nama: 'Rani', kelas: 6, hewan: 'kucing', paket: 'siap_tka', coba_sampai: 'x', masuk: 'y', terakhir_latihan: null, hari_latihan_7: 0, hari_latihan_4: 0, topik_lemah: null, catatan_terakhir: null, tugas_terbuka: 2 }],
    },
  }));
  const p = await papanKelas(opsi, 'k');
  expect(JSON.parse(panggilan[0].init.body as string)).toEqual({ p_kelas_id: 'k' });
  expect(p.kelas.pengawasId).toBe('staf-1');
  expect(p.anak[0]).toMatchObject({ anakId: 'a', topikLemah: [], tugasTerbuka: 2, hariLatihan7: 0 });
});

test('catatan dan tugas ditulis atas nama staf yang masuk, untuk keluarga pemilik anak', async () => {
  const { opsi, panggilan } = opsiTiruan((p) => (p.url.includes('/anggota_kelas?') ? { status: 200, json: [{ keluarga_id: 'kel-a' }] } : { status: 201 }));
  await kirimCatatan(opsi, { kelasId: 'k', anakId: 'a', isi: '  Rani rajin.  ' });
  await beriTugas(opsi, { kelasId: 'k', anakId: 'a', jenis: 'tka', judul: 'Ulang pecahan', rujukan: 'M03', pesan: '' });
  const catatan = panggilan.find((p) => p.url.endsWith('/catatan_pengawas'))!;
  expect(JSON.parse(catatan.init.body as string)).toMatchObject({ kelas_id: 'k', anak_id: 'a', keluarga_id: 'kel-a', staf_id: 'staf-1', isi: 'Rani rajin.' });
  const tugas = panggilan.find((p) => p.url.endsWith('/tugas'))!;
  expect(JSON.parse(tugas.init.body as string)).toMatchObject({ keluarga_id: 'kel-a', staf_id: 'staf-1', jenis: 'tka', rujukan: 'M03', pesan: null });
  expect(panggilan[0].url).toContain('keluar=is.null');

  // Anak tidak (lagi) di kelas ini → ditolak sebelum menulis.
  const { opsi: o2, panggilan: p2 } = opsiTiruan(() => ({ status: 200, json: [] }));
  await expect(kirimCatatan(o2, { kelasId: 'k', anakId: 'a', isi: 'x' })).rejects.toMatchObject({ alasan: 'tidak_boleh' });
  expect(p2).toHaveLength(1);
});
