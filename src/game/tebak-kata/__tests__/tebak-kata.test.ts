import {
  BANYAK_BENIH,
  DETIK_BABAK_MAKS,
  DETIK_BABAK_MIN,
  DETIK_TIAP_BABAK_MAKS,
  DETIK_TIAP_BABAK_MIN,
  SEMUA_KOMBINASI,
  median,
  simulasikan,
} from '../../bersama/__tests__/bantu-simulasi';
import { BANK_KELAS_12, BANK_KELAS_34, BANK_KELAS_56, type KataInggris } from '../bank';
import {
  aksiSah,
  buatBabak,
  langkah,
  pengecohImbuhan,
  pengecohSukuKata,
  potonganBerikut,
  ringkasan,
  selesai,
  soalSekarang,
  type AksiTebakKata,
  type KeadaanTebakKata,
} from '../logika';

const mesin = { langkah, selesai, aksiSah };

function pilihBenar(k: KeadaanTebakKata): AksiTebakKata {
  if (k.fase === 'benar') return { jenis: 'lanjut' };
  const harap = potonganBerikut(k);
  if (harap === null) throw new Error('tidak ada potongan berikut');
  return { jenis: 'pilih', teks: harap };
}

const INGGRIS: KataInggris[] = [
  { inggris: 'cat', indonesia: 'kucing', emoji: '🐈' },
  { inggris: 'dog', indonesia: 'anjing', emoji: '🐕' },
  { inggris: 'book', indonesia: 'buku', emoji: '📖' },
  { inggris: 'apple', indonesia: 'apel', emoji: '🍎' },
  { inggris: 'fish', indonesia: 'ikan', emoji: '🐟' },
  { inggris: 'sun', indonesia: 'matahari', emoji: '☀️' },
];

describe('bank kata', () => {
  it('≥ 40 kata per kelompok kelas, status belum_diperiksa, id unik', () => {
    for (const bank of [BANK_KELAS_12, BANK_KELAS_34, BANK_KELAS_56]) {
      expect(bank.length).toBeGreaterThanOrEqual(40);
      expect(new Set(bank.map((k) => k.id)).size).toBe(bank.length);
      bank.forEach((k) => {
        expect(k.status).toBe('belum_diperiksa');
        expect(k.emoji.length).toBeGreaterThan(0);
      });
    }
  });

  it('kelas 1–2: Santai 2 suku kata, Seru 3 suku kata; potongan kecil semua', () => {
    BANK_KELAS_12.forEach((k) => {
      expect(k.potongan).toHaveLength(k.tingkat === 'santai' ? 2 : 3);
      k.potongan.forEach((p) => expect(p).toMatch(/^[a-z]+$/));
    });
  });

  it('kelas 3–4: setiap kata punya pengecoh imbuhan yang bukan potongannya', () => {
    BANK_KELAS_34.forEach((k) => {
      const pc = pengecohImbuhan(k.potongan);
      expect(pc.length).toBeGreaterThan(0);
      pc.forEach((p) => expect(k.potongan).not.toContain(p));
    });
  });

  it('kelas 5–6: bentuk tidak baku berbeda dari bentuk baku dan berbeda satu sama lain', () => {
    BANK_KELAS_56.forEach((k) => {
      expect(k.tidakBaku[0]).not.toBe(k.baku);
      expect(k.tidakBaku[1]).not.toBe(k.baku);
      expect(k.tidakBaku[0]).not.toBe(k.tidakBaku[1]);
    });
  });

  it('pengecoh suku kata mengganti vokal (ba·ju → bu, bi, …)', () => {
    const pc = pengecohSukuKata(['ba', 'ju']);
    expect(pc).toContain('bu');
    expect(pc).not.toContain('ba');
    expect(pc).not.toContain('ju');
  });
});

describe.each(SEMUA_KOMBINASI)('Tebak Kata kelas %i %s', (kelas, tingkat) => {
  it(`${BANYAK_BENIH} babak selalu selesai, tanpa buntu, kata tidak berulang, lama wajar`, () => {
    const lama: number[] = [];
    for (let benih = 0; benih < BANYAK_BENIH; benih++) {
      const awal = buatBabak({ kelas, tingkat, benih });
      expect(new Set(awal.daftarSoal.map((s) => s.id)).size).toBe(awal.daftarSoal.length);
      for (const s of awal.daftarSoal) {
        expect(s.pilihan.length).toBeGreaterThanOrEqual(2);
        expect(s.pilihan.length).toBeLessThanOrEqual(4);
        expect(new Set(s.pilihan).size).toBe(s.pilihan.length);
        s.jawaban.forEach((j) => expect(s.pilihan).toContain(j));
        if (kelas <= 4) expect(s.pilihan.length).toBeGreaterThan(new Set(s.jawaban).size);
        if (kelas >= 5) expect(s.pilihan).toHaveLength(tingkat === 'seru' ? 3 : 2);
      }
      const { akhir } = simulasikan(mesin, awal, pilihBenar, benih, benih < 3);
      expect(selesai(akhir)).toBe(true);
      expect(akhir.catatan.kataSelesai).toBe(awal.daftarSoal.length);
      lama.push(akhir.perkiraanDetik);
      expect(akhir.perkiraanDetik).toBeGreaterThanOrEqual(DETIK_TIAP_BABAK_MIN);
      expect(akhir.perkiraanDetik).toBeLessThanOrEqual(DETIK_TIAP_BABAK_MAKS);
      expect(ringkasan(akhir).halDikerjakan[0]).toContain(String(awal.daftarSoal.length));
    }
    expect(median(lama)).toBeGreaterThanOrEqual(DETIK_BABAK_MIN);
    expect(median(lama)).toBeLessThanOrEqual(DETIK_BABAK_MAKS);
  });

  it('pilihan salah memantul; petunjuk dan sorotan setelah 2 kali', () => {
    let k = buatBabak({ kelas, tingkat, benih: 9 });
    const s = soalSekarang(k);
    const harap = potonganBerikut(k);
    const keliru = s.pilihan.filter((p) => p !== harap);
    k = langkah(k, { jenis: 'pilih', teks: keliru[0] });
    expect(k.pantul).toBe(keliru[0]);
    expect(k.terisi).toEqual([]);
    expect(k.petunjuk).toBeNull();
    k = langkah(k, { jenis: 'pilih', teks: keliru[keliru.length > 1 ? 1 : 0] });
    expect(k.salah).toBe(2);
    expect(k.petunjuk).toBe(s.petunjuk);
    expect(k.sorotan).toBe(harap);
    expect(aksiSah(k)).toContainEqual({ jenis: 'pilih', teks: harap });
  });
});

describe('Tebak Kata: jenis per kelas', () => {
  it('kelas 1–2 suku kata, 3–4 imbuhan, 5–6 baku', () => {
    expect(buatBabak({ kelas: 1, tingkat: 'santai', benih: 1 }).jenis).toBe('suku_kata');
    expect(buatBabak({ kelas: 4, tingkat: 'seru', benih: 1 }).jenis).toBe('imbuhan');
    expect(buatBabak({ kelas: 6, tingkat: 'seru', benih: 1 }).jenis).toBe('baku');
  });

  it('kelas 5–6 dengan daftar kata Inggris dari luar memakai kosakata Inggris', () => {
    const k = buatBabak({ kelas: 5, tingkat: 'santai', benih: 2, kataInggris: INGGRIS });
    expect(k.jenis).toBe('inggris');
    expect(k.daftarSoal).toHaveLength(INGGRIS.length);
    k.daftarSoal.forEach((s) => {
      expect(s.bahasaUcapan).toBe('en-US');
      expect(s.pilihan).toHaveLength(3);
      expect(s.teksBantu).not.toBeNull();
    });
    expect(buatBabak({ kelas: 3, tingkat: 'santai', benih: 2, kataInggris: INGGRIS }).jenis).toBe('imbuhan');
    expect(buatBabak({ kelas: 5, tingkat: 'santai', benih: 2, kataInggris: INGGRIS.slice(0, 2) }).jenis).toBe('baku');
  });

  it('kata utuh selesai disusun berurutan', () => {
    let k = buatBabak({ kelas: 2, tingkat: 'seru', benih: 4 });
    const s = soalSekarang(k);
    for (const p of s.jawaban) k = langkah(k, { jenis: 'pilih', teks: p });
    expect(k.fase).toBe('benar');
    expect(k.terisi.join('')).toBe(s.ucapan);
    expect(aksiSah(k)).toEqual([{ jenis: 'lanjut' }]);
  });
});
