/**
 * Uji struktur paket TKA hasil `npx tsx scripts/impor-tka.ts` (assets/paket/tka-k6.json).
 * Jumlah di bawah mencerminkan isi bahan: 36 modul, 5 paket simulasi × 30 butir, 36 teks × 2 pertanyaan.
 */
import * as fs from 'fs';
import * as path from 'path';

import type { StatusPeriksa } from '../../jenis';
import type { Bagian, Butir, PaketTka } from '../jenis';
import { semuaButir } from '../pemuat';

const berkas = path.join(__dirname, '../../../../assets/paket/tka-k6.json');
const laporan = fs.readFileSync(path.join(__dirname, '../../../../docs/LAPORAN-IMPOR-TKA.md'), 'utf8');
const paket: PaketTka = JSON.parse(fs.readFileSync(berkas, 'utf8'));
const butir = semuaButir(paket);
const STATUS: StatusPeriksa[] = ['belum_diperiksa', 'perlu_dicek', 'layak'];
const pad = (n: number): string => String(n).padStart(2, '0');

describe('identitas paket', () => {
  test('id, versi, tanggal, sidik jari', () => {
    expect(paket.id).toBe('tka-k6');
    expect(paket.versi).toMatch(/^\d+\.\d+\.\d+$/);
    expect(paket.dibuat).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(paket.sidikJari).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('jumlah isi', () => {
  test('36 topik: M01–M24 (mat) dan B01–B12 (bi)', () => {
    expect(paket.topik).toHaveLength(36);
    const mat = paket.topik.filter((t) => t.mapel === 'mat').map((t) => t.id);
    const bi = paket.topik.filter((t) => t.mapel === 'bi').map((t) => t.id);
    expect(mat).toEqual(Array.from({ length: 24 }, (_, i) => `M${pad(i + 1)}`));
    expect(bi).toEqual(Array.from({ length: 12 }, (_, i) => `B${pad(i + 1)}`));
  });

  test('setiap topik: judul, sasaran, 3 salah paham, contoh jadi, 8 soal ● dan 4 soal ○', () => {
    for (const t of paket.topik) {
      expect(t.judul.length).toBeGreaterThan(3);
      expect(t.sasaran.length).toBeGreaterThan(20);
      expect(t.salahPaham).toHaveLength(3);
      expect(t.contohJadi.length).toBeGreaterThanOrEqual(1);
      for (const c of t.contohJadi) {
        expect(c.soal.length).toBeGreaterThan(0);
        expect(c.langkah.length).toBeGreaterThan(0);
        expect(c.penjelasan).toHaveLength(c.langkah.length);
        expect(c.jawaban.length).toBeGreaterThan(0);
      }
      expect(t.soalKelas).toHaveLength(8);
      expect(t.soalCadangan).toHaveLength(4);
      expect(t.tiket).toHaveLength(3);
    }
  });

  test('latihan rumah = soal ○, kecuali M01, B01, dan pertemuan simulasi', () => {
    for (const t of paket.topik) {
      if (t.id === 'M01' || t.id === 'B01' || t.simulasi) expect(t.latihanRumah).toEqual([]);
      else expect(t.latihanRumah).toEqual(t.soalCadangan.map((b) => b.id));
    }
    // 29 lembar latihan rumah menurut STATUS.md (36 − M01 − B01 − 5 simulasi)
    expect(paket.topik.filter((t) => t.latihanRumah.length > 0)).toHaveLength(29);
  });

  test('diagnostik hanya di M01 (16 soal) dan B01 (10 soal)', () => {
    const ada = paket.topik.filter((t) => t.diagnostik.length > 0).map((t) => [t.id, t.diagnostik.length]);
    expect(ada).toEqual([
      ['M01', 16],
      ['B01', 10],
    ]);
  });

  test('5 simulasi × 30 butir, 75 menit, PG 18 · PG kompleks 6 · PG kategori 6', () => {
    expect(paket.simulasi.map((s) => s.id)).toEqual(['S1', 'S2', 'S3', 'S4', 'S5']);
    expect(paket.simulasi.map((s) => s.mapel)).toEqual(['mat', 'mat', 'mat', 'mat', 'bi']);
    for (const s of paket.simulasi) {
      expect(s.butir).toHaveLength(30);
      expect(s.waktuMenit).toBe(75);
      expect(s.butir.map((b) => b.id)).toEqual(Array.from({ length: 30 }, (_, i) => `${s.id}-${pad(i + 1)}`));
      const bentuk = (x: Butir['bentuk']): number => s.butir.filter((b) => b.bentuk === x).length;
      expect([bentuk('pg'), bentuk('pgk'), bentuk('pgkat')]).toEqual([18, 6, 6]);
    }
  });

  test('S5 memakai 7 teks bersama (A–G) dan setiap butirnya bertopik B02–B11', () => {
    const s5 = paket.simulasi[4];
    expect(new Set(s5.butir.map((b) => b.grupStimulus))).toEqual(new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((h) => `S5-${h}`)));
    for (const b of s5.butir) expect(b.topik).toMatch(/^B(0[2-9]|1[01])$/);
  });

  test('36 teks T01–T36, masing-masing 2 pertanyaan dan 150–200 kata', () => {
    expect(paket.teks.map((t) => t.id)).toEqual(Array.from({ length: 36 }, (_, i) => `T${pad(i + 1)}`));
    for (const t of paket.teks) {
      expect(t.pertanyaan.map((b) => b.id)).toEqual([`${t.id}-q1`, `${t.id}-q2`]);
      expect(t.jumlahKata).toBeGreaterThanOrEqual(150);
      expect(t.jumlahKata).toBeLessThanOrEqual(200);
      expect(t.isi.length).toBeGreaterThan(0);
      expect(t.jenis.length).toBeGreaterThan(0);
    }
  });

  test('jumlah butir sama dengan judul soal di bahan (982)', () => {
    // 432 soal halaman 5 + 120 kuis + 74 terbimbing + 108 tiket + 26 diagnostik + 150 butir simulasi + 72 pertanyaan teks
    expect(butir).toHaveLength(982);
  });
});

function cekBagian(b: Bagian): void {
  switch (b.jenis) {
    case 'teks':
      expect(b.isi.length).toBeGreaterThan(0);
      break;
    case 'tabel':
      expect(b.baris.length).toBeGreaterThan(0);
      for (const r of b.baris) for (const sel of r) expect(typeof sel).toBe('string');
      break;
    case 'denah':
      expect(b.petak.length).toBeGreaterThan(0);
      for (const r of b.petak) {
        expect(r).toHaveLength(b.petak[0].length);
        for (const n of r) expect(Number.isInteger(n) && n >= 0).toBe(true);
      }
      break;
    case 'gambar_teks':
      expect(b.baris.length).toBeGreaterThan(0);
      break;
  }
}

describe('setiap butir', () => {
  test('id unik', () => {
    const ids = butir.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('status termasuk jenis StatusPeriksa', () => {
    for (const b of butir) expect(STATUS).toContain(b.status);
  });

  test('kunci sah untuk bentuknya', () => {
    for (const b of butir) {
      const huruf = b.pilihan.map((p) => p.huruf);
      expect(new Set(huruf).size).toBe(huruf.length);
      switch (b.bentuk) {
        case 'pg':
          expect(b.kunci).toMatch(/^[A-D]$/);
          expect(huruf).toContain(b.kunci);
          break;
        case 'pgk':
          expect(b.kunci.length).toBeGreaterThanOrEqual(2);
          expect(b.kunci.length).toBeLessThan(huruf.length);
          for (const k of b.kunci) expect(huruf).toContain(k);
          expect(new Set(b.kunci).size).toBe(b.kunci.length);
          break;
        case 'pgkat':
          expect(b.kategori).toEqual(['Benar', 'Salah']);
          expect(b.kunci).toHaveLength(b.pilihan.length);
          expect(b.pilihan.length).toBeGreaterThanOrEqual(2);
          for (const k of b.kunci) expect(['B', 'S']).toContain(k);
          expect(huruf).toEqual(b.pilihan.map((_, i) => String(i + 1)));
          break;
      }
    }
  });

  test('pertanyaan, pilihan, dan alasan pengecoh hanya untuk pilihan yang salah', () => {
    for (const b of butir) {
      expect(b.pertanyaan.length).toBeGreaterThan(0);
      for (const p of b.pilihan) expect(p.teks.length).toBeGreaterThan(0);
      const salah =
        b.bentuk === 'pg'
          ? b.pilihan.filter((p) => p.huruf !== b.kunci)
          : b.bentuk === 'pgk'
            ? b.pilihan.filter((p) => !b.kunci.includes(p.huruf))
            : b.pilihan.filter((_, i) => b.kunci[i] === 'S');
      for (const k of Object.keys(b.pengecoh)) expect(salah.map((p) => p.huruf)).toContain(k);
      for (const p of Object.values(b.pengecoh)) {
        expect(p.alasan.length).toBeGreaterThan(0);
        if (p.kode) expect(['B', 'H', 'S']).toContain(p.kode);
      }
    }
  });

  test('setiap PG punya alasan untuk ketiga pengecoh', () => {
    for (const b of butir) if (b.bentuk === 'pg') expect(Object.keys(b.pengecoh)).toHaveLength(3);
  });

  test('bagian stimulus berbentuk sah', () => {
    for (const b of butir) for (const bg of b.stimulus ?? []) cekBagian(bg);
    for (const t of paket.teks) for (const bg of t.isi) cekBagian(bg);
    for (const t of paket.topik) for (const c of t.contohJadi) for (const bg of c.soal) cekBagian(bg);
  });

  test('pecahan di pertanyaan dan pilihan memakai penanda {a/b}', () => {
    const mentah = /(?<![{\d/ ])\d+\/\d+(?![\d}])/;
    for (const b of butir) {
      expect(b.pertanyaan).not.toMatch(mentah);
      for (const p of b.pilihan) expect(p.teks).not.toMatch(mentah);
    }
  });

  test('topik butir berupa kode topik, prasyarat, atau kode teks', () => {
    for (const b of butir) expect(b.topik).toMatch(/^(M\d{2}|B\d{2}|PR-[MB]\d+|T\d{2})$/);
  });

  test('setiap butir punya Petunjuk dan pembahasan (Langkah)', () => {
    for (const b of butir) {
      expect(b.petunjuk?.length).toBe(1);
      expect((b.pembahasan ?? '').length).toBeGreaterThan(0);
    }
  });
});

describe('sebaran kunci PG (04-standar-soal.md bagian 2 aturan 8)', () => {
  // Kalau sebaran tidak sesuai standar, uji TIDAK gagal: yang diuji hanya bahwa laporan mencatatnya.
  test('setiap topik yang timpang (>4 huruf sama di soal PG halaman 5) tercatat di laporan', () => {
    for (const t of paket.topik) {
      const hit: Record<string, number> = {};
      for (const b of [...t.soalKelas, ...t.soalCadangan]) if (b.bentuk === 'pg') hit[b.kunci] = (hit[b.kunci] ?? 0) + 1;
      const timpang = Math.max(0, ...Object.values(hit)) > 4;
      const baris = laporan.split('\n').find((l) => l.startsWith(`| ${t.id} | A `));
      expect(baris).toBeDefined();
      expect(baris?.includes('**tidak**')).toBe(timpang);
    }
  });
});
