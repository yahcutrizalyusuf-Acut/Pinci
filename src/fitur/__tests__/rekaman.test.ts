import { ATURAN_REKAMAN, batasDetik, bisaSematkan, rapikanRekaman, rekamanAnak, sisaHari, terhapusPada, type CatatanRekaman } from '../rekaman';

const HARI = 24 * 60 * 60 * 1000;
const kini = new Date('2026-11-11T08:00:00Z');
let n = 0;
function rek(o: Partial<CatatanRekaman> = {}): CatatanRekaman {
  n += 1;
  return { id: `r${n}`, anak_id: 'a1', komikId: 't3-u01-komik', panelId: 't3-u01-p1', jenis: 'kalimat', berkas: `f${n}`, ukuran: 100_000, detik: 10, dibuat: kini.toISOString(), disematkan: false, ...o };
}
const lalu = (hari: number) => new Date(kini.getTime() - hari * HARI).toISOString();

describe('aturan rekaman suara (CLAUDE.md aturan 12)', () => {
  it('batas waktu 20 detik per kalimat dan 2 menit per cerita utuh', () => {
    expect(batasDetik('kalimat')).toBe(20);
    expect(batasDetik('utuh')).toBe(120);
  });

  it('terhapus otomatis 30 hari setelah direkam, kecuali disematkan', () => {
    const tua = rek({ dibuat: lalu(30) });
    const muda = rek({ dibuat: lalu(29) });
    const kenangan = rek({ jenis: 'utuh', panelId: null, dibuat: lalu(200), disematkan: true });
    const { simpan, hapus } = rapikanRekaman([tua, muda, kenangan], kini);
    expect(hapus.map((c) => c.id)).toEqual([tua.id]);
    expect(simpan.map((c) => c.id)).toEqual([muda.id, kenangan.id]);
    expect(terhapusPada(kenangan)).toBeNull();
    expect(sisaHari(muda, kini)).toBe(1);
  });

  it('paling banyak 5 sematan per anak, hanya cerita utuh', () => {
    const utuh = Array.from({ length: 6 }, (_, i) => rek({ jenis: 'utuh', panelId: null, disematkan: i < 5 }));
    expect(bisaSematkan(utuh, utuh[5].id)).toBe(false);
    expect(bisaSematkan(utuh, utuh[0].id)).toBe(true);
    const kalimat = rek();
    expect(bisaSematkan([kalimat], kalimat.id)).toBe(false);
    // sematan anak lain tidak dihitung
    const lain = rek({ anak_id: 'a2', jenis: 'utuh', panelId: null });
    expect(bisaSematkan([...utuh, lain], lain.id)).toBe(true);
  });

  it('batas 50 MB: yang tertua dan tidak disematkan dihapus lebih dulu', () => {
    const MB = 1024 * 1024;
    const kenangan = rek({ jenis: 'utuh', panelId: null, ukuran: 10 * MB, dibuat: lalu(20), disematkan: true });
    const a = rek({ ukuran: 20 * MB, dibuat: lalu(10) });
    const b = rek({ ukuran: 20 * MB, dibuat: lalu(5) });
    const c = rek({ ukuran: 5 * MB, dibuat: lalu(1) });
    const { simpan, hapus } = rapikanRekaman([kenangan, a, b, c], kini);
    expect(hapus.map((x) => x.id)).toEqual([a.id]);
    expect(simpan.reduce((t, x) => t + x.ukuran, 0)).toBeLessThanOrEqual(ATURAN_REKAMAN.byte);
    expect(simpan.some((x) => x.id === kenangan.id)).toBe(true);
  });

  it('profil anak lain tidak melihat rekaman', () => {
    const milikA = rek({ anak_id: 'a1' });
    const milikB = rek({ anak_id: 'a2' });
    expect(rekamanAnak([milikA, milikB], 'a2').map((c) => c.id)).toEqual([milikB.id]);
  });
});
