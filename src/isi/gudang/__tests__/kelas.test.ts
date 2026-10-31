import * as fs from 'fs';
import * as path from 'path';
import { bacaBilangan, hitungEkspresi, sama, teksRasional } from '../hitung';
import type { PaketGudang } from '../jenis';
import { SUMBER_KELAS } from '../sumber/kelas';
import { bangunPaketKelas } from '../sumber/peta';

/** Paket Gudang Ilmu kelas 2–5 (tahap 1). Aturan sama dengan kelas 6, jumlah kartu lebih sedikit. */
const banyakKalimat = (teks: string) => (teks.match(/[.!?](?=\s|$)/g) ?? []).length;

describe.each([2, 3, 4, 5])('paket gudang-k%i', (kelas) => {
  const berkas = path.join(__dirname, `../../../../assets/paket/gudang-k${kelas}.json`);
  const paket: PaketGudang = JSON.parse(fs.readFileSync(berkas, 'utf8'));
  const topik = paket.mapel.flatMap((m) => m.topik);
  const kartu = topik.flatMap((t) => (t.kartu ? [t.kartu] : []));
  const soal = kartu.flatMap((k) => k.soal);
  const soalMat = paket.mapel.find((m) => m.kode === 'mat')!.topik.flatMap((t) => t.kartu?.soal ?? []);

  test('identitas dan sama dengan hasil pembangkit', () => {
    expect(paket.id).toBe(`gudang-k${kelas}`);
    expect(paket.kelas).toBe(kelas);
    expect(paket).toEqual(bangunPaketKelas(SUMBER_KELAS.find((s) => s.kelas === kelas)!));
  });

  test('tahap 1: minimal 4 kartu Matematika dan 2 kartu Bahasa Indonesia', () => {
    for (const [kode, min] of [['mat', 4], ['bi', 2]] as const) {
      expect(paket.mapel.find((m) => m.kode === kode)!.topik.filter((t) => t.kartu).length).toBeGreaterThanOrEqual(min);
    }
  });

  test('id unik, berawalan mapel dan kelas, prasyarat merujuk topik sebelumnya', () => {
    const id = [...topik.map((t) => t.id), ...kartu.map((k) => k.id), ...soal.map((s) => s.id)];
    expect(new Set(id).size).toBe(id.length);
    for (const m of paket.mapel) {
      const urutan = new Map(m.topik.map((t) => [t.id, t.urutan]));
      for (const t of m.topik) {
        expect(t.id.startsWith(`${m.kode}${kelas}-`)).toBe(true);
        expect(t.segera).toBe(t.kartu === undefined);
        for (const p of t.prasyarat) expect(urutan.get(p)).toBeLessThan(t.urutan);
      }
    }
  });

  test('kartu: status belum_diperiksa, penjelasan pendek, 2 contoh, 5–10 soal, 3 petunjuk', () => {
    for (const k of kartu) {
      expect(k.status).toBe('belum_diperiksa');
      expect(k.sumber).toMatch(new RegExp(`^K${kelas}-(mat|bi)$`));
      expect(k.penjelasan.length).toBeGreaterThanOrEqual(2);
      expect(k.penjelasan.length).toBeLessThanOrEqual(4);
      for (const b of k.penjelasan) {
        expect(b.teks.length).toBeLessThanOrEqual(160);
        expect(banyakKalimat(b.teks)).toBeGreaterThanOrEqual(1);
        expect(banyakKalimat(b.teks)).toBeLessThanOrEqual(2);
      }
      expect(k.contohJadi).toHaveLength(2);
      expect(k.soal.length).toBeGreaterThanOrEqual(5);
      expect(k.soal.length).toBeLessThanOrEqual(10);
    }
    for (const s of soal) {
      expect(new Set(s.petunjuk).size).toBe(3);
      expect(s.pembahasan.trim().length).toBeGreaterThan(0);
      if (s.bentuk === 'pg') {
        const p = s.pilihan ?? [];
        expect(p.length).toBeGreaterThanOrEqual(2);
        expect(p.length).toBeLessThanOrEqual(4);
        expect(new Set(p).size).toBe(p.length);
        expect(p).toContain(s.kunci);
      } else {
        expect(s.pilihan).toBeUndefined();
      }
    }
  });

  test('kunci Matematika dihitung ulang oleh kode (≥ 70% soal) dan cocok', () => {
    expect(soalMat.filter((s) => s.hitung !== undefined).length / soalMat.length).toBeGreaterThanOrEqual(0.7);
    for (const s of soalMat.filter((x) => x.bentuk === 'isian')) {
      const b = bacaBilangan(s.kunci);
      expect({ id: s.id, terbaca: b !== null && b.sisa === '' }).toEqual({ id: s.id, terbaca: true });
    }
    const salah: string[] = [];
    for (const s of soal) {
      if (s.hitung === undefined) continue;
      const nilai = hitungEkspresi(s.hitung);
      const kunci = bacaBilangan(s.kunci);
      if (!kunci || !sama(nilai, kunci.nilai)) salah.push(`${s.id}: hitung ${s.hitung} = ${teksRasional(nilai)}, kunci ${s.kunci}`);
      if (s.bentuk === 'pg') {
        const cocok = (s.pilihan ?? []).filter((p) => {
          const b = bacaBilangan(p);
          return b !== null && sama(b.nilai, nilai);
        });
        if (cocok.length !== 1) salah.push(`${s.id}: ${cocok.length} pilihan bernilai sama dengan hasil hitung`);
      }
    }
    expect(salah).toEqual([]);
  });

  test('tanpa istilah Inggris dan tanpa isi keagamaan', () => {
    const terlarang =
      /\b(game|online|download|level|skor|score|oke|ok|update|link|pizza|masjid|mushala|meunasah|doa|salat|shalat|sholat|puasa|ramadan|lebaran|mengaji|subuh|allah|tuhan)\b/gi;
    expect(JSON.stringify(paket).match(terlarang) ?? []).toEqual([]);
  });
});
