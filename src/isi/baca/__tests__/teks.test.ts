import { KPM_KELAS, PANJANG_KELAS, hitungKata } from '../bantu';
import { TEKS_BACA, ambilTeksBaca, teksBacaKelas } from '../paket';

describe.each([2, 3, 4, 5])('teks Baca Ulang kelas %i', (kelas) => {
  const daftar = TEKS_BACA[kelas];

  test('tahap 1: minimal 6 teks, id unik dan urut', () => {
    expect(daftar.length).toBeGreaterThanOrEqual(6);
    daftar.forEach((t, i) => expect(t.id).toBe(`K${kelas}-T${String(i + 1).padStart(2, '0')}`));
  });

  test('panjang sesuai kelas, jumlah kata dan sasaran waktu dihitung kode', () => {
    const [min, maks] = PANJANG_KELAS[kelas];
    for (const t of daftar) {
      const kata = hitungKata(t.isi.map((b) => (b.jenis === 'teks' ? b.isi : '')));
      expect({ id: t.id, kata: t.jumlahKata }).toEqual({ id: t.id, kata });
      expect(t.jumlahKata).toBeGreaterThanOrEqual(min);
      expect(t.jumlahKata).toBeLessThanOrEqual(maks);
      expect(t.sasaranDetik).toBe(Math.round((kata * 60) / KPM_KELAS[kelas]));
      expect(t.status).toBe('belum_diperiksa');
    }
  });

  test('tiap teks 2 pertanyaan pilihan ganda dengan kunci, petunjuk, pembahasan, dan alasan pengecoh', () => {
    for (const t of daftar) {
      expect(t.pertanyaan).toHaveLength(2);
      for (const b of t.pertanyaan) {
        expect(b.bentuk).toBe('pg');
        const huruf = b.pilihan.map((p) => p.huruf);
        expect(huruf).toContain(b.kunci as string);
        expect(new Set(b.pilihan.map((p) => p.teks)).size).toBe(b.pilihan.length);
        // setiap pilihan salah punya alasan, pilihan benar tidak
        expect(Object.keys(b.pengecoh).sort()).toEqual(huruf.filter((h) => h !== b.kunci).sort());
        expect(b.petunjuk?.[0]?.length).toBeGreaterThan(0);
        expect(b.pembahasan?.length).toBeGreaterThan(0);
        expect(b.topik).toBe('baca');
      }
    }
  });

  test('tanpa istilah Inggris dan tanpa isi keagamaan', () => {
    const terlarang = /\b(game|online|download|level|skor|oke|update|link|pizza|masjid|mushala|meunasah|doa|salat|shalat|sholat|puasa|ramadan|lebaran|mengaji|subuh|allah|tuhan|kenduri)\b/gi;
    expect(JSON.stringify(daftar).match(terlarang) ?? []).toEqual([]);
  });
});

test('teks per kelas dan pencarian lintas kelas', () => {
  expect(teksBacaKelas(6)[0].id).toBe('T01');
  expect(teksBacaKelas(3)[0].id).toBe('K3-T01');
  expect(teksBacaKelas(1)).toEqual([]);
  expect(ambilTeksBaca('K5-T02')?.judul).toBe('Hemat Air');
  expect(ambilTeksBaca('T01')?.id).toBe('T01');
  expect(ambilTeksBaca('K9-T01')).toBeUndefined();
});
