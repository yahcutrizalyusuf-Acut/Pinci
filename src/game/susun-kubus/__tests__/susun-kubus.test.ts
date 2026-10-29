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
import type { PembangkitAcak } from '../../bersama/acak';
import {
  aksiSah,
  bagianBelumCocok,
  batasTinggi,
  buatBabak,
  cocok,
  kartuDari,
  langkah,
  petakBisaDitambah,
  ringkasan,
  selesai,
  tampakAtas,
  tampakDepan,
  tampakSamping,
  tekaTekiSekarang,
  type AksiSusunKubus,
  type KeadaanSusunKubus,
  type Petak,
} from '../logika';

const mesin = { langkah, selesai, aksiSah };

/** Pemain yang menyusun menuju contoh jawaban; kalau kelebihan kubus, ia mengurung. */
function pilihBenar(k: KeadaanSusunKubus, acak: PembangkitAcak): AksiSusunKubus {
  if (k.fase === 'cocok') return { jenis: 'lanjut' };
  const t = tekaTekiSekarang(k);
  const kurang: AksiSusunKubus[] = [];
  t.contohJawaban.forEach((b, i) =>
    b.forEach((h, j) => {
      if (k.petak[i][j] < h) kurang.push({ jenis: 'tambah', baris: i, kolom: j });
    }),
  );
  return kurang.length > 0 ? acak.pilih(kurang) : acak.pilih(aksiSah(k));
}

describe('fungsi tampak (contoh tangan)', () => {
  // Denah: baris 0 = belakang, baris 1 = depan.
  //   belakang: 0 2 1
  //   depan:    1 1 0
  const petak: Petak = [
    [0, 2, 1],
    [1, 1, 0],
  ];

  it('tampak depan = tertinggi tiap kolom', () => {
    expect(tampakDepan(petak)).toEqual([1, 2, 1]);
  });

  it('tampak samping (dari kanan) = tertinggi tiap baris, baris depan dulu', () => {
    expect(tampakSamping(petak)).toEqual([1, 2]);
  });

  it('tampak atas = petak berisi', () => {
    expect(tampakAtas(petak)).toEqual([
      [false, true, true],
      [true, true, false],
    ]);
  });

  it('contoh desain G05: satu baris [1, 3, 2, 1]', () => {
    const satuBaris: Petak = [[1, 3, 2, 1]];
    expect(tampakDepan(satuBaris)).toEqual([1, 3, 2, 1]);
    expect(tampakSamping(satuBaris)).toEqual([3]);
    expect(cocok([[1, 1, 2, 0]], { depan: [1, 3, 2, 1] })).toBe(false);
    expect(bagianBelumCocok([[1, 1, 2, 0]], { depan: [1, 3, 2, 1] }).kolomDepan).toEqual([1, 3]);
    expect(cocok(satuBaris, { depan: [1, 3, 2, 1] })).toBe(true);
  });

  it('3 × 3 bertumpuk', () => {
    const p: Petak = [
      [3, 0, 1],
      [0, 2, 0],
      [1, 1, 2],
    ];
    expect(tampakDepan(p)).toEqual([3, 2, 2]);
    expect(tampakSamping(p)).toEqual([2, 2, 3]);
    const target = kartuDari(p, ['depan', 'samping', 'atas']);
    expect(cocok(p, target)).toBe(true);
    // Susunan lain dengan tampak sama juga diterima.
    const lain: Petak = [
      [3, 0, 1],
      [0, 2, 0],
      [1, 2, 2],
    ];
    expect(cocok(lain, target)).toBe(true);
    const kurang: Petak = [
      [3, 0, 1],
      [0, 1, 0],
      [1, 1, 2],
    ];
    expect(cocok(kurang, target)).toBe(false);
    const bc = bagianBelumCocok(kurang, target);
    expect(bc.kolomDepan).toEqual([1]);
    expect(bc.barisSamping).toEqual([1]);
    expect(bc.petakAtas).toEqual([]);
  });
});

describe.each(SEMUA_KOMBINASI)('Susun Kubus kelas %i %s', (kelas, tingkat) => {
  it(`${BANYAK_BENIH} babak selalu selesai, tanpa buntu, teka-teki tidak berulang dan bertingkat`, () => {
    const lama: number[] = [];
    for (let benih = 0; benih < BANYAK_BENIH; benih++) {
      const awal = buatBabak({ kelas, tingkat, benih });
      const daftar = awal.daftarTekaTeki;
      expect(new Set(daftar.map((t) => JSON.stringify(t.target))).size).toBe(daftar.length);
      for (let i = 0; i < daftar.length; i++) {
        const t = daftar[i];
        expect(cocok(t.contohJawaban, t.target)).toBe(true);
        expect(cocok(batasTinggi(t), t.target)).toBe(true);
        // Bertingkat: dari satu baris ke denah bertumpuk; pada jumlah baris sama, petak tidak berkurang.
        if (i > 0) {
          const lalu = daftar[i - 1];
          expect(t.baris).toBeGreaterThanOrEqual(lalu.baris);
          if (t.baris === lalu.baris) expect(t.baris * t.kolom).toBeGreaterThanOrEqual(lalu.baris * lalu.kolom);
        }
      }
      if (kelas <= 2) expect(daftar[0].contohJawaban.flat().reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(6);

      const cek = (x: KeadaanSusunKubus) => {
        if (x.fase === 'menyusun') expect(petakBisaDitambah(x).length).toBeGreaterThan(0);
      };
      cek(awal);
      const { akhir } = simulasikan(
        mesin,
        awal,
        (x, acak) => {
          cek(x);
          return pilihBenar(x, acak);
        },
        benih,
        benih < 3,
      );
      expect(selesai(akhir)).toBe(true);
      expect(akhir.catatan.tekaTekiSelesai).toBe(daftar.length);
      lama.push(akhir.perkiraanDetik);
      expect(akhir.perkiraanDetik).toBeGreaterThanOrEqual(DETIK_TIAP_BABAK_MIN);
      expect(akhir.perkiraanDetik).toBeLessThanOrEqual(DETIK_TIAP_BABAK_MAKS);
      expect(ringkasan(akhir).halDikerjakan[0]).toContain(`${daftar.length} bangunan`);
    }
    expect(median(lama)).toBeGreaterThanOrEqual(DETIK_BABAK_MIN);
    expect(median(lama)).toBeLessThanOrEqual(DETIK_BABAK_MAKS);
  });

  it('kubus kelebihan memantul; petunjuk setelah 2 kali; urung mengembalikan', () => {
    let k = buatBabak({ kelas, tingkat, benih: 5 });
    const t = tekaTekiSekarang(k);
    const batas = batasTinggi(t);
    // Cari petak dengan batas ≥ 1 dan isi sampai batas tanpa membuat cocok.
    let b0 = 0;
    let k0 = 0;
    outer: for (let b = 0; b < t.baris; b++) {
      for (let kol = 0; kol < t.kolom; kol++) {
        if (batas[b][kol] >= 1) {
          b0 = b;
          k0 = kol;
          break outer;
        }
      }
    }
    for (let i = 0; i < batas[b0][k0]; i++) k = langkah(k, { jenis: 'tambah', baris: b0, kolom: k0 });
    expect(k.fase).toBe('menyusun');
    const sebelum = k.petak;
    k = langkah(k, { jenis: 'tambah', baris: b0, kolom: k0 });
    expect(k.petak).toEqual(sebelum);
    expect(k.pantul).toEqual([b0, k0]);
    expect(k.petunjuk).toBeNull();
    k = langkah(k, { jenis: 'tambah', baris: b0, kolom: k0 });
    expect(k.salah).toBe(2);
    expect(typeof k.petunjuk).toBe('string');
    expect(k.belumCocok.kolomDepan.length + k.belumCocok.barisSamping.length + k.belumCocok.petakAtas.length).toBeGreaterThan(0);
    const n = k.petak[b0][k0];
    k = langkah(k, { jenis: 'urung' });
    expect(k.petak[b0][k0]).toBe(n - 1);
  });

  it('semua aksi bisa dengan ketuk saja (tambah per petak, urung, lanjut)', () => {
    const k = buatBabak({ kelas, tingkat, benih: 1 });
    aksiSah(k).forEach((a) => expect(['tambah', 'urung', 'lanjut']).toContain(a.jenis));
  });
});
