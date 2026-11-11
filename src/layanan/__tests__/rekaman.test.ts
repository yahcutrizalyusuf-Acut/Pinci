import { GudangMemori } from '../../data/gudang';
import { TABEL_SINKRON } from '../../data/jenis';
import { Repositori } from '../../data/repositori';
import { aturIzin8, GudangRekaman, izin8Nyala, PenyimpanMemori } from '../rekaman';

async function siap() {
  const r = new Repositori(new GudangMemori(), null);
  await r.siapkan();
  await r.buatKeluarga('1234', 'Bunda');
  const a = await r.tambahAnak({ nama: 'Rani', kelas: 4, hewan: 'kucing' });
  return { r, a };
}

describe('penyimpanan rekaman hanya di HP', () => {
  it('Izin 8 bawaan mati; mencabutnya menghapus semua rekaman', async () => {
    const { r, a } = await siap();
    const p = new PenyimpanMemori();
    const g = new GudangRekaman(p);
    expect(await izin8Nyala(r)).toBe(false);
    await aturIzin8(r, true, g);
    expect(await izin8Nyala(r)).toBe(true);
    await g.tambah({ anak_id: a.id, komikId: 't3-u01-komik', panelId: 't3-u01-p1', jenis: 'kalimat', alamatSementara: 'file:///cache/x.m4a', detik: 8 });
    await g.tambah({ anak_id: a.id, komikId: 't3-u01-komik', panelId: null, jenis: 'utuh', alamatSementara: 'file:///cache/y.m4a', detik: 70 });
    expect(await g.semua()).toHaveLength(2);
    expect(p.berkas.size).toBe(2);
    await aturIzin8(r, false, g);
    expect(await izin8Nyala(r)).toBe(false);
    expect(await g.semua()).toHaveLength(0);
    expect(p.berkas.size).toBe(0);
  });

  it('rekaman tidak pernah masuk antrean sinkron; yang dikirim hanya ada_rekaman ya/tidak', async () => {
    const { r, a } = await siap();
    const g = new GudangRekaman(new PenyimpanMemori());
    await aturIzin8(r, true, g);
    const c = await g.tambah({ anak_id: a.id, komikId: 't3-u01-komik', panelId: 't3-u01-p1', jenis: 'kalimat', alamatSementara: 'file:///cache/x.m4a', detik: 8 });
    await r.simpanCeritaUlang({ anak_id: a.id, komikId: 't3-u01-komik', centangTokoh: true, centangUrutan: false, centangInggris: true, centangSelesai: true, kataTargetDicentang: ['hello'], adaRekaman: true });
    const antre = await r.antreanBelumTerkirim();
    const teks = JSON.stringify(antre);
    expect(teks).not.toContain(c.berkas);
    expect(teks).not.toContain('file://');
    expect(antre.every((x) => TABEL_SINKRON.includes(x.tabel))).toBe(true);
    expect(antre.find((x) => x.tabel === 'cerita_ulang')).toBeTruthy();
    const [baris] = await r.daftarCeritaUlang(a.id);
    expect(JSON.stringify(baris)).not.toContain('file://');
    expect(Object.keys(baris).sort()).toEqual(
      ['adaRekaman', 'anak_id', 'centangInggris', 'centangSelesai', 'centangTokoh', 'centangUrutan', 'id', 'kataTargetDicentang', 'keluarga_id', 'komikId', 'mode', 'tanggal', 'waktu'].sort(),
    );
    // Izin 8 disimpan di tabel nilai yang tidak pernah disinkron
    expect(TABEL_SINKRON).not.toContain('nilai');
  });

  it('penghapusan otomatis saat aplikasi dibuka (30 hari)', async () => {
    const p = new PenyimpanMemori();
    const g = new GudangRekaman(p);
    const lama = new Date('2026-10-01T00:00:00Z');
    await g.tambah({ anak_id: 'a1', komikId: 'k', panelId: 'p', jenis: 'kalimat', alamatSementara: 'x', detik: 5 }, lama);
    expect(await g.rapikan(new Date('2026-10-30T00:00:00Z'))).toBe(0);
    expect(await g.rapikan(new Date('2026-11-01T00:00:00Z'))).toBe(1);
    expect(await g.semua()).toHaveLength(0);
  });

  it('hapus profil anak = rekamannya ikut terhapus, rekaman anak lain tetap', async () => {
    const p = new PenyimpanMemori();
    const g = new GudangRekaman(p);
    await g.tambah({ anak_id: 'a1', komikId: 'k', panelId: 'p', jenis: 'kalimat', alamatSementara: 'x', detik: 5 });
    await g.tambah({ anak_id: 'a2', komikId: 'k', panelId: 'p', jenis: 'kalimat', alamatSementara: 'y', detik: 5 });
    await g.hapusAnak('a1');
    expect((await g.semua()).map((c) => c.anak_id)).toEqual(['a2']);
    expect(p.berkas.size).toBe(1);
  });

  it('saat aplikasi dibuka: rekaman profil yang sudah dihapus dibuang dan berkas sementara dibersihkan', async () => {
    const p = new PenyimpanMemori();
    const g = new GudangRekaman(p);
    await g.tambah({ anak_id: 'hilang', komikId: 'k', panelId: 'p', jenis: 'kalimat', alamatSementara: 'x', detik: 5 });
    await g.tambah({ anak_id: 'a1', komikId: 'k', panelId: 'p', jenis: 'kalimat', alamatSementara: 'y', detik: 5 });
    expect(await g.rapikan(new Date(), ['a1'])).toBe(1);
    expect((await g.semua()).map((c) => c.anak_id)).toEqual(['a1']);
    expect(p.sementaraDibersihkan).toBeGreaterThan(0);
  });

  it('sematan ditolak setelah 5 kenangan', async () => {
    const g = new GudangRekaman(new PenyimpanMemori());
    const ids: string[] = [];
    for (let i = 0; i < 6; i++) ids.push((await g.tambah({ anak_id: 'a1', komikId: 'k', panelId: null, jenis: 'utuh', alamatSementara: `x${i}`, detik: 60 })).id);
    for (let i = 0; i < 5; i++) expect(await g.sematkan(ids[i], true)).toBe(true);
    expect(await g.sematkan(ids[5], true)).toBe(false);
  });
});
