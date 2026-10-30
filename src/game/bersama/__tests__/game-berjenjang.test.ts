/**
 * Uji bersama tiga game soal berjenjang: selalu bisa diselesaikan, pilihan belum tepat memantul,
 * petunjuk setelah 2 kali, tanpa kata kalah, dan kunci setiap baris dihitung benar.
 */
import { soalSekarang, type KeadaanBabakSoal } from '../babak-soal';
import { SEMUA_KELAS } from '../jenis';
import { JUMLAH_LEVEL, type Level } from '../level';
import type { RingkasanBabak } from '../ringkasan';
import * as kebun from '../../kebun/logika';
import * as lompat from '../../lompat-batu/logika';
import * as perahu from '../../perahu/logika';

type Game = {
  nama: string;
  buat: (o: { kelas: (typeof SEMUA_KELAS)[number]; level: Level; benih: number }) => KeadaanBabakSoal;
  langkah: (k: never, a: { jenis: 'jawab'; nilai: number }) => KeadaanBabakSoal;
  ringkasan: (k: never) => RingkasanBabak;
  panjang: Record<Level, number>;
};

const GAME: Game[] = [
  { nama: 'kebun', buat: kebun.buatBabak, langkah: kebun.langkah as Game['langkah'], ringkasan: kebun.ringkasan as Game['ringkasan'], panjang: kebun.PETAK_KEBUN },
  { nama: 'lompat_batu', buat: lompat.buatBabak, langkah: lompat.langkah as Game['langkah'], ringkasan: lompat.ringkasan as Game['ringkasan'], panjang: lompat.BARIS_BATU },
  { nama: 'perahu', buat: perahu.buatBabak, langkah: perahu.langkah as Game['langkah'], ringkasan: perahu.ringkasan as Game['ringkasan'], panjang: perahu.JARAK_PERAHU },
];

const KATA_TERLARANG = /kalah|game over|nyawa|gagal|salah/i;

describe.each(GAME)('$nama', (g) => {
  test('selalu bisa diselesaikan di semua kelas dan level; panjang naik per level', () => {
    for (const kelas of SEMUA_KELAS) {
      for (let level = 1 as Level; level <= JUMLAH_LEVEL; level = (level + 1) as Level) {
        for (const benih of [1, 42, 999]) {
          let k = g.buat({ kelas, level, benih });
          expect(k.soal).toHaveLength(g.panjang[level]);
          for (const s of k.soal) {
            expect(s.pilihan).toContain(s.jawaban);
            expect(new Set(s.pilihan).size).toBe(s.pilihan.length);
            expect(s.teks).not.toMatch(KATA_TERLARANG);
          }
          let jaga = 0;
          while (k.fase !== 'selesai' && jaga++ < 50) k = g.langkah(k as never, { jenis: 'jawab', nilai: soalSekarang(k).jawaban });
          expect(k.fase).toBe('selesai');
          const r = g.ringkasan(k as never);
          expect(r.level).toBe(level);
          expect([r.judul, r.kalimat, ...r.halDikerjakan].join(' ')).not.toMatch(KATA_TERLARANG);
        }
      }
      expect(g.panjang[5]).toBeGreaterThan(g.panjang[1]);
    }
  });

  test('pilihan belum tepat memantul, tidak maju; petunjuk setelah 2 kali', () => {
    const k0 = g.buat({ kelas: 3, level: 3, benih: 7 });
    const s = soalSekarang(k0);
    const keliru = s.pilihan.find((p) => p !== s.jawaban)!;
    const k1 = g.langkah(k0 as never, { jenis: 'jawab', nilai: keliru });
    expect(k1.indeks).toBe(0);
    expect(k1.pantul).toBe(keliru);
    expect(k1.petunjuk).toBeNull();
    const k2 = g.langkah(k1 as never, { jenis: 'jawab', nilai: keliru });
    expect(k2.petunjuk).toBe(s.petunjuk);
    const k3 = g.langkah(k2 as never, { jenis: 'jawab', nilai: s.jawaban });
    expect(k3.indeks).toBe(1);
    expect(k3.petunjuk).toBeNull();
  });

  test('benih sama → babak sama', () => {
    expect(g.buat({ kelas: 5, level: 4, benih: 123 }).soal).toEqual(g.buat({ kelas: 5, level: 4, benih: 123 }).soal);
  });
});

test('Lompat Batu: baris aturan punya tepat satu batu yang memenuhi', () => {
  for (const kelas of SEMUA_KELAS) {
    for (let level = 1 as Level; level <= JUMLAH_LEVEL; level = (level + 1) as Level) {
      const k = lompat.buatBabak({ kelas, level, benih: kelas * 10 + level });
      k.soal.forEach((s, i) => {
        if (i % 2 === 0) return;
        const m = s.teks.match(/genap|ganjil|kelipatan (\d+)|lebih dari (\d+)/)!;
        const aturan: lompat.Aturan = m[0] === 'genap' ? { jenis: 'genap', n: 2 } : m[0] === 'ganjil' ? { jenis: 'ganjil', n: 2 } : m[1] ? { jenis: 'kelipatan', n: +m[1] } : { jenis: 'lebih', n: +m[2] };
        expect(s.pilihan.filter((x) => lompat.memenuhi(aturan, x))).toEqual([s.jawaban]);
      });
    }
  }
});

test('Balap Perahu: teman tidak pernah mendahului dan sampai bersama', () => {
  let k = perahu.buatBabak({ kelas: 6, level: 5, benih: 5 });
  while (k.fase !== 'selesai') {
    expect(perahu.posisiTeman(k)).toBeLessThanOrEqual(Math.max(perahu.posisiPinci(k), 0.04));
    k = perahu.langkah(k, { jenis: 'jawab', nilai: soalSekarang(k).jawaban });
  }
  expect(perahu.posisiPinci(k)).toBe(1);
  expect(perahu.posisiTeman(k)).toBe(1);
});
