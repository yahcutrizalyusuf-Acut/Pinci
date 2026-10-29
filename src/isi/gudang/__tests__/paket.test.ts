import * as fs from 'fs';
import * as path from 'path';
import { bacaBilangan, hitungEkspresi, sama, teksRasional } from '../hitung';
import type { GambarSederhana, KartuIlmu, PaketGudang, SoalKartu, TopikGudang } from '../jenis';
import { bangunPaketGudang } from '../sumber/peta';

const berkas = path.join(__dirname, '../../../../assets/paket/gudang-k6.json');
const paket: PaketGudang = JSON.parse(fs.readFileSync(berkas, 'utf8'));

const semuaTopik: TopikGudang[] = paket.mapel.flatMap((m) => m.topik);
const kartuMapel = (kode: 'mat' | 'bi'): KartuIlmu[] =>
  (paket.mapel.find((m) => m.kode === kode)?.topik ?? []).flatMap((t) => (t.kartu ? [t.kartu] : []));
const kartuMat = kartuMapel('mat');
const kartuBi = kartuMapel('bi');
const soalMat: SoalKartu[] = kartuMat.flatMap((k) => k.soal);
const semuaKartu = [...kartuMat, ...kartuBi];
const semuaSoal = semuaKartu.flatMap((k) => k.soal);

function banyakKalimat(teks: string): number {
  return (teks.match(/[.!?](?=\s|$)/g) ?? []).length;
}

function periksaGambar(g: GambarSederhana): void {
  switch (g.jenis) {
    case 'emoji':
      expect(g.isi.length).toBeGreaterThan(0);
      expect([...g.isi].length).toBeLessThanOrEqual(20);
      expect(g.isi).not.toMatch(/[A-Za-z0-9]/);
      break;
    case 'pecahan':
      expect(Number.isInteger(g.a) && Number.isInteger(g.b)).toBe(true);
      expect(g.b).toBeGreaterThanOrEqual(1);
      expect(g.b).toBeLessThanOrEqual(12);
      expect(g.a).toBeGreaterThanOrEqual(0);
      expect(g.a).toBeLessThanOrEqual(g.b);
      break;
    case 'batang':
      expect(g.nilai.length).toBeGreaterThanOrEqual(2);
      expect(g.nilai.length).toBeLessThanOrEqual(6);
      for (const n of g.nilai) expect(Number.isInteger(n) && n >= 0).toBe(true);
      if (g.label) expect(g.label).toHaveLength(g.nilai.length);
      break;
    case 'petak':
      for (const n of [g.baris, g.kolom]) expect(Number.isInteger(n) && n >= 1 && n <= 10).toBe(true);
      expect(g.terisi).toBeGreaterThanOrEqual(0);
      expect(g.terisi).toBeLessThanOrEqual(g.baris * g.kolom);
      break;
  }
}

describe('paket gudang-k6', () => {
  test('identitas paket', () => {
    expect(paket.id).toBe('gudang-k6');
    expect(paket.kelas).toBe(6);
    expect(paket.versi).toMatch(/^\d+\.\d+\.\d+$/);
    expect(paket.mapel.map((m) => m.kode)).toEqual(['mat', 'bi']);
  });

  test('JSON sama dengan hasil pembangkit (jalankan npx tsx scripts/buat-gudang.ts bila beda)', () => {
    expect(paket).toEqual(bangunPaketGudang());
  });

  test('jumlah kartu: Matematika ≥ 24, Bahasa Indonesia ≥ 10', () => {
    expect(kartuMat.length).toBeGreaterThanOrEqual(24);
    expect(kartuBi.length).toBeGreaterThanOrEqual(10);
  });

  test('topik tanpa kartu bertanda segera, topik berkartu tidak', () => {
    for (const t of semuaTopik) expect(t.segera).toBe(t.kartu === undefined);
    expect(semuaTopik.some((t) => t.segera)).toBe(true);
    expect(semuaTopik.some((t) => t.bersamaOrtu)).toBe(true);
  });

  test('id unik di seluruh paket', () => {
    const id = [...semuaTopik.map((t) => t.id), ...semuaKartu.map((k) => k.id), ...semuaSoal.map((s) => s.id)];
    expect(new Set(id).size).toBe(id.length);
    for (const t of semuaTopik) {
      if (!t.kartu) continue;
      expect(t.kartu.id).toBe(`kartu-${t.id}`);
      t.kartu.soal.forEach((s, i) => expect(s.id).toBe(`${t.id}-s${i + 1}`));
    }
  });

  test('urutan berurutan dan prasyarat merujuk topik sebelumnya di mapel yang sama', () => {
    for (const m of paket.mapel) {
      const urutan = new Map(m.topik.map((t) => [t.id, t.urutan]));
      m.topik.forEach((t, i) => {
        expect(t.urutan).toBe(i + 1);
        expect(t.id.startsWith(`${m.kode}6-`)).toBe(true);
        for (const p of t.prasyarat) {
          expect(urutan.has(p)).toBe(true);
          expect(urutan.get(p)).toBeLessThan(t.urutan);
        }
      });
    }
  });

  test('status belum_diperiksa dan sumber modul sesuai mapel', () => {
    for (const k of kartuMat) {
      expect(k.status).toBe('belum_diperiksa');
      expect(k.sumber).toMatch(/^M(0[1-9]|1\d|2[0-4])$/);
    }
    for (const k of kartuBi) {
      expect(k.status).toBe('belum_diperiksa');
      expect(k.sumber).toMatch(/^B(0[1-9]|1[0-2])$/);
    }
  });

  test('penjelasan: 2–4 bagian, tiap teks ≤ 2 kalimat, gambar sah', () => {
    for (const k of semuaKartu) {
      expect(k.penjelasan.length).toBeGreaterThanOrEqual(2);
      expect(k.penjelasan.length).toBeLessThanOrEqual(4);
      for (const b of k.penjelasan) {
        expect(b.teks.length).toBeGreaterThan(0);
        expect(b.teks.length).toBeLessThanOrEqual(160);
        expect(banyakKalimat(b.teks)).toBeGreaterThanOrEqual(1);
        expect(banyakKalimat(b.teks)).toBeLessThanOrEqual(2);
        if (b.gambar) periksaGambar(b.gambar);
      }
    }
  });

  test('tiap kartu punya 2 contoh jadi dan 5–10 soal berjenjang', () => {
    const urutanTingkat = { mudah: 0, sedang: 1, sulit: 2 };
    for (const k of semuaKartu) {
      expect(k.contohJadi).toHaveLength(2);
      for (const c of k.contohJadi) {
        expect(c.soal.length).toBeGreaterThan(0);
        expect(c.langkah.length).toBeGreaterThanOrEqual(1);
        expect(c.jawaban.length).toBeGreaterThan(0);
      }
      expect(k.soal.length).toBeGreaterThanOrEqual(5);
      expect(k.soal.length).toBeLessThanOrEqual(10);
      const t = k.soal.map((s) => urutanTingkat[s.tingkat]);
      expect(t).toEqual([...t].sort((a, b) => a - b));
      expect(t[0]).toBe(0);
    }
  });

  test('tiap soal: 3 petunjuk, pembahasan, dan bentuk yang sah', () => {
    for (const s of semuaSoal) {
      expect(s.petunjuk).toHaveLength(3);
      for (const p of s.petunjuk) expect(p.trim().length).toBeGreaterThan(0);
      expect(new Set(s.petunjuk).size).toBe(3);
      expect(s.pembahasan.trim().length).toBeGreaterThan(0);
      expect(s.kunci.trim().length).toBeGreaterThan(0);
      if (s.gambar) periksaGambar(s.gambar);
      if (s.bentuk === 'pg') {
        expect(s.pilihan).toBeDefined();
        const pilihan = s.pilihan ?? [];
        expect(pilihan.length).toBeGreaterThanOrEqual(2);
        expect(pilihan.length).toBeLessThanOrEqual(4);
        expect(new Set(pilihan).size).toBe(pilihan.length);
        expect(pilihan).toContain(s.kunci);
      } else {
        expect(s.pilihan).toBeUndefined();
      }
    }
  });

  test('kunci isian Matematika berupa bilangan saja', () => {
    for (const s of soalMat.filter((x) => x.bentuk === 'isian')) {
      const b = bacaBilangan(s.kunci);
      expect({ id: s.id, terbaca: b !== null && b.sisa === '' }).toEqual({ id: s.id, terbaca: true });
    }
  });

  test('minimal 70% soal Matematika kuncinya dihitung ulang', () => {
    const berhitung = soalMat.filter((s) => s.hitung !== undefined).length;
    expect(berhitung / soalMat.length).toBeGreaterThanOrEqual(0.7);
  });

  test('ekspresi hitung cocok dengan kunci (aritmetika rasional)', () => {
    const salah: string[] = [];
    for (const s of semuaSoal) {
      if (s.hitung === undefined) continue;
      const nilai = hitungEkspresi(s.hitung);
      const kunci = bacaBilangan(s.kunci);
      if (!kunci) {
        salah.push(`${s.id}: kunci "${s.kunci}" tidak terbaca sebagai bilangan`);
        continue;
      }
      if (!sama(nilai, kunci.nilai)) {
        salah.push(`${s.id}: hitung ${s.hitung} = ${teksRasional(nilai)}, kunci ${s.kunci}`);
      }
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
      /\b(game|online|download|level|skor|score|oke|ok|update|link|pizza|masjid|mushala|meunasah|doa|salat|shalat|sholat|puasa|ramadan|lebaran|mengaji|subuh|allah|tuhan)\b/i;
    const teksSemua = JSON.stringify(paket);
    const temu = teksSemua.match(new RegExp(terlarang.source, 'gi')) ?? [];
    expect(temu).toEqual([]);
  });
});
