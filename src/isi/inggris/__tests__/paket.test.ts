import * as fs from 'fs';
import * as path from 'path';
import type { PaketInggris } from '../jenis';

const folder = path.join(__dirname, '../../../../assets/paket');
const tingkat = [3, 4, 5, 6] as const;

for (const t of tingkat) {
  const berkas = path.join(folder, `inggris-t${t}.json`);
  const ada = fs.existsSync(berkas);
  (ada ? describe : describe.skip)(`paket inggris-t${t}`, () => {
    const paket: PaketInggris = ada ? JSON.parse(fs.readFileSync(berkas, 'utf8')) : (null as never);

    test('identitas paket', () => {
      expect(paket.id).toBe(`inggris-t${t}`);
      expect(paket.tingkat).toBe(t);
      expect(paket.fase).toBe(t <= 4 ? 'B' : 'C');
    });

    test('12 unit bernomor 1–12', () => {
      expect(paket.unit).toHaveLength(12);
      paket.unit.forEach((u, i) => {
        expect(u.nomor).toBe(i + 1);
        expect(u.id).toBe(`t${t}-u${String(i + 1).padStart(2, '0')}`);
      });
    });

    test('tiap unit lengkap', () => {
      for (const u of paket.unit) {
        expect(u.kosakata.length).toBeGreaterThanOrEqual(8);
        expect(u.kosakata.length).toBeLessThanOrEqual(10);
        expect(u.pola.length).toBeGreaterThanOrEqual(2);
        expect(u.pola.length).toBeLessThanOrEqual(3);
        expect(u.dengar.length).toBeGreaterThanOrEqual(4);
        expect(u.permainan.length).toBeGreaterThanOrEqual(1);
        if (t >= 4) expect(u.susun.length).toBeGreaterThanOrEqual(2);
        else expect(u.susun).toHaveLength(0);
      }
    });

    test('semua id unik dan berstatus belum_diperiksa', () => {
      const ids = new Set<string>();
      for (const u of paket.unit) {
        const semua = [...u.kosakata, ...u.pola, ...u.dengar, ...u.susun, ...u.permainan];
        for (const b of semua) {
          expect(ids.has(b.id)).toBe(false);
          ids.add(b.id);
          expect(b.status).toBe('belum_diperiksa');
        }
      }
    });

    test('kosakata punya gambar dan arti; kata tidak kembar dalam unit', () => {
      for (const u of paket.unit) {
        const kata = new Set<string>();
        for (const k of u.kosakata) {
          expect(k.kata.trim()).not.toBe('');
          expect(k.arti.trim()).not.toBe('');
          expect(Boolean(k.emoji) || Boolean(k.ikon)).toBe(true);
          expect(kata.has(k.kata.toLowerCase())).toBe(false);
          kata.add(k.kata.toLowerCase());
        }
      }
    });

    test('soal dengar merujuk kosakata unit yang sama', () => {
      for (const u of paket.unit) {
        const ids = new Set(u.kosakata.map((k) => k.id));
        for (const d of u.dengar) {
          expect(ids.has(d.kunci)).toBe(true);
          expect(d.pengecoh.length).toBeGreaterThanOrEqual(2);
          expect(d.pengecoh).not.toContain(d.kunci);
          d.pengecoh.forEach((p) => expect(ids.has(p)).toBe(true));
        }
        for (const p of u.permainan) {
          expect(p.kata.length).toBeGreaterThanOrEqual(4);
          p.kata.forEach((k) => expect(ids.has(k)).toBe(true));
        }
      }
    });

    test('susun kata 3–10 kata', () => {
      for (const u of paket.unit) {
        for (const s of u.susun) {
          const n = s.kalimat.split(' ').length;
          expect(n).toBeGreaterThanOrEqual(3);
          expect(n).toBeLessThanOrEqual(10);
        }
      }
    });
  });
}
