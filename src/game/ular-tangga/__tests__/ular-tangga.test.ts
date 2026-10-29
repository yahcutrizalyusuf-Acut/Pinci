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
import { buatAcak } from '../../bersama/acak';
import { SEMUA_KELAS } from '../../bersama/jenis';
import {
  PETAK_AKHIR,
  SULUR_SANTAI,
  SULUR_SERU,
  aksiSah,
  buatBabak,
  buatSoal,
  koordinatPetak,
  langkah,
  ringkasan,
  selesai,
  type AksiUlarTangga,
  type KeadaanUlarTangga,
} from '../logika';

const mesin = { langkah, selesai, aksiSah };

function pilihBenar(k: KeadaanUlarTangga): AksiUlarTangga {
  if (k.fase === 'soal' && k.soal) return { jenis: 'jawab', pilihan: k.soal.jawaban };
  return aksiSah(k)[0];
}

describe.each(SEMUA_KOMBINASI)('Ular Tangga kelas %i %s', (kelas, tingkat) => {
  it(`${BANYAK_BENIH} babak selalu selesai, tanpa buntu, soal tidak berulang, lama wajar`, () => {
    const lama: number[] = [];
    let anakSampai = 0;
    for (let benih = 0; benih < BANYAK_BENIH; benih++) {
      const { akhir } = simulasikan(mesin, buatBabak({ kelas, tingkat, benih }), pilihBenar, benih, benih < 3);
      expect(selesai(akhir)).toBe(true);
      expect(aksiSah(akhir)).toEqual([]);
      expect(akhir.putaran).toBeLessThanOrEqual(akhir.batasPutaran);
      if (akhir.pemenang !== null) expect(akhir.posisi[akhir.pemenang]).toBe(PETAK_AKHIR);
      else expect(akhir.putaran).toBe(akhir.batasPutaran);
      if (akhir.pemenang === 'anak') anakSampai++;
      expect(Math.max(akhir.posisi.anak, akhir.posisi.pinci)).toBeLessThanOrEqual(PETAK_AKHIR);
      expect(new Set(akhir.idSoalTerpakai).size).toBe(akhir.idSoalTerpakai.length);
      if (tingkat === 'seru') expect(akhir.catatan.soalTerjawab).toBe(akhir.putaran);
      else expect(akhir.idSoalTerpakai).toHaveLength(0);
      lama.push(akhir.perkiraanDetik);
      expect(akhir.perkiraanDetik).toBeGreaterThanOrEqual(DETIK_TIAP_BABAK_MIN);
      expect(akhir.perkiraanDetik).toBeLessThanOrEqual(DETIK_TIAP_BABAK_MAKS);
      const r = ringkasan(akhir);
      expect(r.kalimat).not.toMatch(/kalah|game over/i);
    }
    expect(anakSampai).toBeGreaterThan(0);
    expect(median(lama)).toBeGreaterThanOrEqual(DETIK_BABAK_MIN);
    expect(median(lama)).toBeLessThanOrEqual(DETIK_BABAK_MAKS);
  });

  if (tingkat === 'seru') {
    it('soal Seru: salah memantul, petunjuk setelah 2 kali, tinggal jawaban benar, lalu tetap melangkah', () => {
      let k = langkah(buatBabak({ kelas, tingkat, benih: 3 }), { jenis: 'lempar_dadu' });
      expect(k.fase).toBe('soal');
      const soal = k.soal;
      if (soal === null) throw new Error('soal kosong');
      expect(soal.pilihan).toHaveLength(3);
      expect(new Set(soal.pilihan).size).toBe(3);
      const keliru = soal.pilihan.filter((p) => p !== soal.jawaban);
      k = langkah(k, { jenis: 'jawab', pilihan: keliru[0] });
      expect(k.pantul).toBe(keliru[0]);
      expect(k.petunjuk).toBeNull();
      k = langkah(k, { jenis: 'jawab', pilihan: keliru[1] });
      expect(k.petunjuk).toBe(soal.petunjuk);
      expect(aksiSah(k)).toEqual([{ jenis: 'jawab', pilihan: soal.jawaban }]);
      const dari = k.posisi.anak;
      k = langkah(k, { jenis: 'jawab', pilihan: soal.jawaban });
      expect(k.posisi.anak).toBeGreaterThan(dari);
      expect(k.fase === 'giliran_pinci' || k.fase === 'selesai').toBe(true);
    });
  }
});

describe('Ular Tangga: papan dan aturan', () => {
  it('papan lurus: tiap baris kiri → kanan, bukan zig-zag', () => {
    expect(koordinatPetak(1)).toEqual({ baris: 0, kolom: 0 });
    expect(koordinatPetak(10)).toEqual({ baris: 0, kolom: 9 });
    expect(koordinatPetak(11)).toEqual({ baris: 1, kolom: 0 });
    expect(koordinatPetak(20)).toEqual({ baris: 1, kolom: 9 });
    expect(koordinatPetak(100)).toEqual({ baris: 9, kolom: 9 });
  });

  it('sulur hanya membawa naik, tidak ada petak turun', () => {
    for (const peta of [SULUR_SANTAI, SULUR_SERU]) {
      for (const [dari, ke] of Object.entries(peta)) {
        expect(ke).toBeGreaterThan(Number(dari));
        expect(ke).toBeLessThan(PETAK_AKHIR);
      }
    }
  });

  it('lewat 100 dihitung sampai 100', () => {
    const awal = buatBabak({ kelas: 2, tingkat: 'santai', benih: 1 });
    const k = langkah({ ...awal, posisi: { anak: 99, pinci: 50 } }, { jenis: 'lempar_dadu' });
    expect(k.posisi.anak).toBe(100);
    expect(k.pemenang).toBe('anak');
    expect(selesai(k)).toBe(true);
    expect(ringkasan(k).kalimat).toContain('duluan');
  });

  it('bila Pinci sampai duluan, ringkasan tetap menyemangati', () => {
    const awal = buatBabak({ kelas: 4, tingkat: 'santai', benih: 1 });
    const k = langkah({ ...awal, fase: 'giliran_pinci', posisi: { anak: 60, pinci: 99 } }, { jenis: 'giliran_pinci' });
    expect(k.pemenang).toBe('pinci');
    const r = ringkasan(k);
    expect(r.kalimat).toMatch(/hebat/i);
    expect(r.kalimat).toContain('Ayo main lagi');
  });

  it('giliran bergantian: anak lalu Pinci', () => {
    let k = buatBabak({ kelas: 1, tingkat: 'santai', benih: 8 });
    expect(aksiSah(k)).toEqual([{ jenis: 'lempar_dadu' }]);
    k = langkah(k, { jenis: 'lempar_dadu' });
    expect(aksiSah(k)).toEqual([{ jenis: 'giliran_pinci' }]);
    expect(langkah(k, { jenis: 'lempar_dadu' })).toBe(k);
    k = langkah(k, { jenis: 'giliran_pinci' });
    expect(k.fase).toBe('lempar');
  });

  it('kunci soal dihitung benar untuk semua kelas', () => {
    const acak = buatAcak(123);
    for (const kelas of SEMUA_KELAS) {
      for (let i = 0; i < 300; i++) {
        const s = buatSoal(acak, kelas, acak.bulat(1, 99), acak.bulat(1, 6));
        expect(s.pilihan).toContain(s.jawaban);
        expect(new Set(s.pilihan).size).toBe(3);
        const [jenis, a, b] = s.id.split('-');
        const x = Number(a);
        const y = Number(b);
        const kunci: Record<string, number> = {
          tambah: x + y,
          kali: x * y,
          setengah: x / 2,
          persen10: x / 10,
          persen25: x / 4,
          kuadrat: x * x,
        };
        expect(s.jawaban).toBe(kunci[jenis]);
        expect(Number.isInteger(s.jawaban)).toBe(true);
      }
    }
  });
});
