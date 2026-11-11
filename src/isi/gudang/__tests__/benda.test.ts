import * as fs from 'fs';
import * as path from 'path';

import { nilaiDicari, periksaBenda, periksaModelBatang, tandaGaris } from '../benda';
import { bacaBilangan, hitungEkspresi, sama, teksRasional } from '../hitung';
import type { PaketGudang } from '../jenis';

const paket: PaketGudang = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../assets/paket/gudang-k6.json'), 'utf8'));
const topikMat = paket.mapel.find((m) => m.kode === 'mat')?.topik ?? [];
const kartu = topikMat.flatMap((t) => (t.kartu ? [t.kartu] : []));

describe('Matematika benda → gambar → angka (kelas 6)', () => {
  it('setiap kartu punya pancingan orang tua dan satu soal cerita belum diperiksa dengan kunci dihitung kode', () => {
    for (const k of kartu) {
      expect(k.pancingan?.length).toBeGreaterThan(10);
      const cerita = k.soal.filter((s) => s.cerita);
      expect(cerita).toHaveLength(1);
      expect(cerita[0].status).toBe('belum_diperiksa');
      expect(cerita[0].hitung).toBeTruthy();
      const nilai = hitungEkspresi(cerita[0].hitung ?? '');
      expect({ id: cerita[0].id, cocok: sama(nilai, bacaBilangan(cerita[0].kunci)?.nilai ?? { p: -1n, q: 1n }) }).toEqual({ id: cerita[0].id, cocok: true });
    }
  });

  it('nilai di model batang selalu cocok dengan kunci soal', () => {
    const salah: string[] = [];
    for (const k of kartu)
      for (const s of k.soal) {
        if (!s.modelBatang) continue;
        salah.push(...periksaModelBatang(s.modelBatang).map((x) => `${s.id}: ${x}`));
        const d = nilaiDicari(s.modelBatang);
        const kunci = bacaBilangan(s.kunci);
        if (!d || !kunci || !sama(d, kunci.nilai)) salah.push(`${s.id}: dicari ${d ? teksRasional(d) : '-'} ≠ kunci ${s.kunci}`);
      }
    expect(salah).toEqual([]);
  });

  it('soal cerita pecahan, perbandingan, dan persen memakai model batang', () => {
    for (const id of ['mat6-pecahan-senilai', 'mat6-banding-pecahan', 'mat6-persen', 'mat6-tambah-kurang-pecahan', 'mat6-kali-pecahan', 'mat6-rasio', 'mat6-senilai-berbalik']) {
      const t = topikMat.find((x) => x.id === id);
      expect({ id, ada: !!t?.kartu?.soal.find((s) => s.cerita)?.modelBatang }).toEqual({ id, ada: true });
    }
  });

  it('Coba dengan benda: benda sah, jawaban dihitung kode, gambar batang cocok dengan jawaban', () => {
    const dengan = kartu.filter((k) => k.cobaBenda);
    expect(dengan.length).toBeGreaterThanOrEqual(18);
    const salah: string[] = [];
    for (const k of dengan) {
      const c = k.cobaBenda!;
      salah.push(...periksaBenda(c.benda).map((x) => `${k.id}: ${x}`));
      const j = hitungEkspresi(c.hitung);
      if (teksRasional(j) !== c.jawaban.replace(/\./g, '')) salah.push(`${k.id}: jawaban ${c.jawaban} ≠ ${teksRasional(j)}`);
      if (c.gambar.jenis === 'batang') {
        salah.push(...periksaModelBatang(c.gambar.data).map((x) => `${k.id} gambar: ${x}`));
        const d = nilaiDicari(c.gambar.data);
        if (!d || !sama(d, j)) salah.push(`${k.id}: gambar ${d ? teksRasional(d) : '-'} ≠ jawaban ${teksRasional(j)}`);
      } else if (tandaGaris(c.gambar.data).length > 13) salah.push(`${k.id}: garis lebih dari 13 tanda`);
    }
    expect(salah).toEqual([]);
  });
});
