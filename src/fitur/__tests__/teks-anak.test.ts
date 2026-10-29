import { paketTka } from '../../isi/tka/paket';
import { alasanUntukAnak } from '../teks-anak';

test('alasan pengecoh untuk anak tanpa kata "salah" dan tanpa rujukan guru', () => {
  expect(alasanUntukAnak('menjumlahkan semua, menghasilkan 20, salah paham 3. Anak yang berhenti setelah A juga salah')).toBe('Menjumlahkan semua, menghasilkan 20.');
  expect(alasanUntukAnak('Anak berhenti di tengah.')).toBe('Pilihan ini belum tepat.');
  for (const t of paketTka.topik)
    for (const b of t.soalKelas)
      for (const p of Object.values(b.pengecoh)) {
        const a = alasanUntukAnak(p.alasan);
        expect(a).not.toMatch(/\bsalah\b/i);
        expect(a).not.toMatch(/salah paham/i);
      }
});
