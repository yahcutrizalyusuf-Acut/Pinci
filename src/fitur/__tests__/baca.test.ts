import type { Sesi } from '../../data/jenis';
import { paketTka } from '../../isi/tka/paket';
import { hitungKpm, patokanKpm, pecahKata, teksBerikut, terlaluCepat } from '../baca';

test('patokan dan kpm', () => {
  const t = paketTka.teks[0];
  expect(patokanKpm(t)).toBe(Math.round((t.jumlahKata * 60) / (t.sasaranDetik ?? 180)));
  expect(hitungKpm(150, 90)).toBe(100);
  expect(hitungKpm(150, 0)).toBe(0);
});

test('penjaga curang', () => {
  expect(terlaluCepat(130, 60)).toBe(true);
  expect(terlaluCepat(260, 200)).toBe(true);
  expect(terlaluCepat(90, 60)).toBe(false);
});

test('teks berikut: urut, lalu yang paling lama', () => {
  const s = (rujukan: string, mulai: string): Sesi => ({ id: rujukan, anak_id: 'a', jenis: 'baca', mode: 'sendiri', kelas: 6, rujukan, mulai, selesai: mulai, durasiDetik: 1, benar: 0, jumlah: 0, urutanHp: 1 });
  expect(teksBerikut(paketTka.teks, []).id).toBe('T01');
  expect(teksBerikut(paketTka.teks, [s('T01', '2026-11-01')]).id).toBe('T02');
  const semua = paketTka.teks.map((t, i) => s(t.id, `2026-11-${String(i + 1).padStart(2, '0')}`));
  semua[5] = s('T06', '2026-10-01');
  expect(teksBerikut(paketTka.teks, semua).id).toBe('T06');
});

test('36 teks punya isi paragraf yang bisa dipecah', () => {
  expect(paketTka.teks).toHaveLength(36);
  for (const t of paketTka.teks) {
    const kata = t.isi.flatMap((b) => (b.jenis === 'teks' ? pecahKata(b.isi) : []));
    expect(kata.length).toBeGreaterThan(50);
    expect(t.pertanyaan.length).toBeGreaterThanOrEqual(1);
  }
});
