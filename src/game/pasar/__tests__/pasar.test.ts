import {
  DETIK_BABAK_MAKS,
  DETIK_BABAK_MIN,
  DETIK_TIAP_BABAK_MAKS,
  DETIK_TIAP_BABAK_MIN,
  BANYAK_BENIH,
  SEMUA_KOMBINASI,
  median,
  simulasikan,
} from '../../bersama/__tests__/bantu-simulasi';
import { kelompokKelas, type Kelas, type Tingkat } from '../../bersama/jenis';
import {
  aksiSah,
  buatBabak,
  langkah,
  pecahUang,
  pesananSekarang,
  ringkasan,
  selesai,
  type AksiPasar,
  type KeadaanPasar,
} from '../logika';

const mesin = { langkah, selesai, aksiSah };

/** Pemain yang tahu jawaban: bayar dengan uang serakah, pilih kembalian benar. */
function pilihBenar(k: KeadaanPasar): AksiPasar {
  const p = pesananSekarang(k);
  if (k.fase === 'terima') return { jenis: 'lanjut' };
  if (k.fase === 'kembalian') return { jenis: 'pilih_kembalian', nilai: k.total - p.harga };
  if (k.total >= p.harga) return { jenis: 'serahkan' };
  return { jenis: 'ketuk_uang', nilai: pecahUang(p.harga - k.total, k.uangTersedia)[0] };
}

function hargaMaks(kelas: Kelas, tingkat: Tingkat): number {
  const g = kelompokKelas(kelas);
  if (g === 'awal') return 10000;
  if (g === 'tengah') return 50000;
  return tingkat === 'seru' ? 100000 : 50000;
}

describe.each(SEMUA_KOMBINASI)('Pasar Gampong kelas %i %s', (kelas, tingkat) => {
  it(`${BANYAK_BENIH} babak selalu selesai, tidak buntu, isi tidak berulang, lama wajar`, () => {
    const lama: number[] = [];
    for (let benih = 0; benih < BANYAK_BENIH; benih++) {
      const awal = buatBabak({ kelas, tingkat, benih });
      const { akhir } = simulasikan(mesin, awal, pilihBenar, benih, benih < 3);
      expect(selesai(akhir)).toBe(true);
      expect(aksiSah(akhir)).toEqual([]);
      expect(akhir.catatan.pesananSelesai).toBe(awal.daftarPesanan.length);
      expect(awal.daftarPesanan.length).toBeGreaterThanOrEqual(5);
      expect(awal.daftarPesanan.length).toBeLessThanOrEqual(8);

      const tanda = awal.daftarPesanan.map((p) => p.baris.map((b) => `${b.barangId}×${b.jumlah}`).sort().join('+'));
      expect(new Set(tanda).size).toBe(tanda.length);
      expect(new Set(awal.daftarPesanan.map((p) => p.pembeli.id)).size).toBe(awal.daftarPesanan.length);

      for (const p of awal.daftarPesanan) {
        // Kunci dihitung ulang di uji.
        const kotor = p.baris.reduce((a, b) => a + b.hargaSatuan * b.jumlah, 0);
        expect(p.hargaSebelumDiskon).toBe(kotor);
        expect(p.harga).toBe(kotor - (kotor * p.diskonPersen) / 100);
        expect(p.harga % 500).toBe(0);
        expect(p.harga).toBeLessThanOrEqual(hargaMaks(kelas, tingkat));
        if (kelompokKelas(kelas) === 'atas') expect(p.baris.length).toBeGreaterThanOrEqual(2);
        else expect(p.baris.length).toBe(1);
        if (kelompokKelas(kelas) === 'atas' && tingkat === 'seru') expect(p.diskonPersen).toBeGreaterThan(0);
        else expect(p.diskonPersen).toBe(0);
      }
      lama.push(akhir.perkiraanDetik);
      expect(akhir.perkiraanDetik).toBeGreaterThanOrEqual(DETIK_TIAP_BABAK_MIN);
      expect(akhir.perkiraanDetik).toBeLessThanOrEqual(DETIK_TIAP_BABAK_MAKS);
      expect(ringkasan(akhir).halDikerjakan[0]).toBe(`Melayani ${awal.daftarPesanan.length} pembeli`);
    }
    expect(median(lama)).toBeGreaterThanOrEqual(DETIK_BABAK_MIN);
    expect(median(lama)).toBeLessThanOrEqual(DETIK_BABAK_MAKS);
  });

  it('bayar kurang memantul; petunjuk muncul setelah 2 kali', () => {
    let benih = 0;
    let k = buatBabak({ kelas, tingkat, benih });
    while (pesananSekarang(k).harga < 1000) k = buatBabak({ kelas, tingkat, benih: ++benih });
    k = langkah(k, { jenis: 'ketuk_uang', nilai: 500 });
    expect(k.total).toBe(500);
    k = langkah(k, { jenis: 'serahkan' });
    expect(k.pantul).toEqual({ jenis: 'nampan' });
    expect(k.salah).toBe(1);
    expect(k.petunjuk).toBeNull();
    expect(k.total).toBe(500);
    k = langkah(k, { jenis: 'serahkan' });
    expect(k.salah).toBe(2);
    expect(typeof k.petunjuk).toBe('string');
    expect(k.petunjuk).toContain('kurang');
    expect(k.fase).toBe('bayar');
  });
});

describe('Pasar Gampong: aturan bayar', () => {
  it('kelas 1–2 hanya uang kecil; kelas 1–2 Seru harus pas (uang kebanyakan memantul)', () => {
    const k0 = buatBabak({ kelas: 1, tingkat: 'seru', benih: 4 });
    expect(k0.uangTersedia).not.toContain(20000);
    expect(k0.uangTersedia).not.toContain(50000);
    expect(k0.aturanBayar).toBe('harus_pas');
    const p = pesananSekarang(k0);
    const besar = k0.uangTersedia.find((u) => u > p.harga);
    if (besar === undefined) throw new Error('uji perlu uang lebih besar dari harga');
    const k1 = langkah(k0, { jenis: 'ketuk_uang', nilai: besar });
    expect(k1.total).toBe(0);
    expect(k1.pantul).toEqual({ jenis: 'uang', nilai: besar });
    expect(buatBabak({ kelas: 2, tingkat: 'santai', benih: 1 }).uangTersedia).toEqual([500, 1000, 2000, 5000]);
  });

  it('Santai: bayar lebih diterima, kembalian dihitung Pinci', () => {
    let k = buatBabak({ kelas: 3, tingkat: 'santai', benih: 2 });
    const p = pesananSekarang(k);
    k = langkah(k, { jenis: 'ketuk_uang', nilai: 20000 });
    while (k.total < p.harga) k = langkah(k, { jenis: 'ketuk_uang', nilai: 5000 });
    k = langkah(k, { jenis: 'serahkan' });
    expect(k.fase).toBe('terima');
    expect(k.kembalian).toBe(k.total - p.harga);
    if (k.kembalian > 0) expect(k.kembalianOlehPinci).toBe(true);
  });

  it('Seru kelas 3–6: anak memilih kembalian; salah 2 kali → petunjuk, tinggal pilihan benar', () => {
    let benih = 0;
    let k = buatBabak({ kelas: 4, tingkat: 'seru', benih });
    while (pesananSekarang(k).harga >= 50000) k = buatBabak({ kelas: 4, tingkat: 'seru', benih: ++benih });
    const p = pesananSekarang(k);
    k = langkah(k, { jenis: 'ketuk_uang', nilai: 50000 });
    k = langkah(k, { jenis: 'serahkan' });
    expect(k.fase).toBe('kembalian');
    const benar = 50000 - p.harga;
    expect(k.pilihanKembalian).toHaveLength(3);
    expect(k.pilihanKembalian).toContain(benar);
    const keliru = k.pilihanKembalian.filter((n) => n !== benar);
    k = langkah(k, { jenis: 'pilih_kembalian', nilai: keliru[0] });
    expect(k.petunjuk).toBeNull();
    expect(k.pantul).toEqual({ jenis: 'kembalian', nilai: keliru[0] });
    k = langkah(k, { jenis: 'pilih_kembalian', nilai: keliru[1] });
    expect(k.petunjuk).not.toBeNull();
    expect(aksiSah(k)).toEqual([{ jenis: 'pilih_kembalian', nilai: benar }]);
    k = langkah(k, { jenis: 'pilih_kembalian', nilai: benar });
    expect(k.fase).toBe('terima');
    expect(k.kembalianOlehPinci).toBe(false);
  });

  it('kelas 5–6 Seru: harga akhir disembunyikan, ada diskon', () => {
    const k = buatBabak({ kelas: 6, tingkat: 'seru', benih: 3 });
    k.daftarPesanan.forEach((p) => {
      expect(p.tampilkanHarga).toBe(false);
      expect(p.kalimat).toMatch(/diskon \d+%/);
    });
  });

  it('aksi tidak sah tidak mengubah keadaan; langkah tidak mengubah keadaan lama', () => {
    const k = buatBabak({ kelas: 1, tingkat: 'santai', benih: 1 });
    expect(langkah(k, { jenis: 'lanjut' })).toBe(k);
    expect(langkah(k, { jenis: 'serahkan' })).toBe(k);
    const salinan = JSON.stringify(k);
    langkah(k, { jenis: 'ketuk_uang', nilai: 500 });
    expect(JSON.stringify(k)).toBe(salinan);
  });

  it('benih sama → babak sama', () => {
    expect(buatBabak({ kelas: 5, tingkat: 'seru', benih: 77 })).toEqual(buatBabak({ kelas: 5, tingkat: 'seru', benih: 77 }));
  });
});
