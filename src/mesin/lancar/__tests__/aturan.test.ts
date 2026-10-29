import {
  HARI_DAYA_TAHAN,
  hitungKemajuan,
  levelDayaTahanBerikut,
  nilaiLembar,
  opsiLembarBerikut,
  tentukanHasil,
} from '../aturan';
import type { SesiLancar } from '../jenis';
import { buatLembar } from '../lembar';
import { AWAL, HARI, JAM, sesiLatihan, sesiPenempatan } from './bantu';

const TEPAT = { salah: 1, kecepatan: 0.9 };
const KILAT = { salah: 0, kecepatan: 0.5 };
const TETAP = { salah: 3, kecepatan: 0.9 };

describe('tentukanHasil', () => {
  it('kilat, tepat, tetap, turun', () => {
    expect(tentukanHasil(0, 66, 100)).toBe('kilat');
    expect(tentukanHasil(0, 67, 100)).toBe('tepat');
    expect(tentukanHasil(1, 50, 100)).toBe('tepat');
    expect(tentukanHasil(1, 100, 100)).toBe('tepat');
    expect(tentukanHasil(0, 101, 100)).toBe('tetap');
    expect(tentukanHasil(2, 50, 100)).toBe('tetap');
    expect(tentukanHasil(5, 50, 100)).toBe('tetap');
    expect(tentukanHasil(6, 50, 100)).toBe('turun');
  });

  it('nilaiLembar menghitung ulang benar/salah, mengabaikan isian `benar`', () => {
    const s = sesiLatihan({ level: 1, mulai: AWAL, salah: 0, kecepatan: 0.5 });
    const dipalsukan = s.jawaban.map((j, i) => (i < 6 ? { ...j, jawaban: '9999', benar: true } : j));
    expect(nilaiLembar(dipalsukan).hasil).toBe('turun');
    expect(nilaiLembar(s.jawaban.slice(0, 10), 20)).toMatchObject({ selesai: false, hasil: 'tetap' });
  });
});

describe('hitungKemajuan', () => {
  it('riwayat kosong → kelas 1 level 1', () => {
    expect(hitungKemajuan([])).toMatchObject({ kelas: 1, level: 1, sudahPenempatan: false });
  });

  it('penempatan menentukan level awal dan mencatat level lancar sebagai lulus', () => {
    const k = hitungKemajuan([sesiPenempatan(6, 2, AWAL)]);
    expect(k.level).toBe(3);
    expect(k.sudahPenempatan).toBe(true);
    expect(Object.keys(k.lulus).map(Number)).toEqual([1, 2]);
  });

  it('kilat langsung naik', () => {
    const k = hitungKemajuan([sesiLatihan({ level: 1, mulai: AWAL, ...KILAT })]);
    expect(k.level).toBe(2);
    expect(k.catatan[0]).toMatchObject({ hasil: 'kilat', arah: 'naik', dihitung: true });
  });

  it('2 lembar tepat dari dua sesi berjeda ≥ 1 jam → naik', () => {
    const a = sesiLatihan({ level: 1, mulai: AWAL, ...TEPAT });
    const b = sesiLatihan({ level: 1, mulai: a.selesai + JAM, ...TEPAT });
    expect(hitungKemajuan([a]).level).toBe(1);
    expect(hitungKemajuan([a]).tepatTertunda?.sesiId).toBe(a.id);
    expect(hitungKemajuan([a, b]).level).toBe(2);
  });

  it('2 lembar tepat berjeda < 1 jam tidak naik; lembar tepat ketiga ≥ 1 jam sesudah yang pertama → naik', () => {
    const a = sesiLatihan({ level: 1, mulai: AWAL, ...TEPAT });
    const b = sesiLatihan({ level: 1, mulai: a.selesai + 30 * 60 * 1000, ...TEPAT });
    const k = hitungKemajuan([a, b]);
    expect(k.level).toBe(1);
    expect(k.catatan[1]).toMatchObject({ hasil: 'tepat', dihitung: false, alasan: 'jeda_kurang_1_jam' });
    const c = sesiLatihan({ level: 1, mulai: AWAL + HARI, ...TEPAT });
    expect(hitungKemajuan([a, b, c]).level).toBe(2);
  });

  it('tepat lalu tetap lalu tepat: rangkaian putus, belum naik', () => {
    const a = sesiLatihan({ level: 1, mulai: AWAL, ...TEPAT });
    const b = sesiLatihan({ level: 1, mulai: AWAL + 2 * JAM, ...TETAP });
    const c = sesiLatihan({ level: 1, mulai: AWAL + HARI, ...TEPAT });
    const k = hitungKemajuan([a, b, c]);
    expect(k.level).toBe(1);
    expect(k.tepatTertunda?.sesiId).toBe(c.id);
  });

  it('salah 6 → turun satu level; di Level 1 tetap Level 1', () => {
    const tes = sesiPenempatan(6, 2, AWAL);
    const t = sesiLatihan({ level: 3, mulai: AWAL + JAM, salah: 6 });
    const k = hitungKemajuan([tes, t]);
    expect(k.level).toBe(2);
    expect(k.catatan[1]).toMatchObject({ hasil: 'turun', arah: 'turun' });
    expect(hitungKemajuan([sesiLatihan({ level: 1, mulai: AWAL, salah: 10 })]).level).toBe(1);
  });

  it('lembar Mode Dampingi tidak dihitung naik/turun dan tidak memutus rangkaian', () => {
    const kilatDampingi = sesiLatihan({ level: 1, mulai: AWAL, ...KILAT, mode: 'dampingi' });
    const k1 = hitungKemajuan([kilatDampingi]);
    expect(k1.level).toBe(1);
    expect(k1.catatan[0]).toMatchObject({ hasil: 'kilat', dihitung: false, alasan: 'dampingi' });

    const tes = sesiPenempatan(6, 2, AWAL);
    const turunDampingi = sesiLatihan({ level: 3, mulai: AWAL + JAM, salah: 8, mode: 'dampingi' });
    expect(hitungKemajuan([tes, turunDampingi]).level).toBe(3);

    const a = sesiLatihan({ level: 1, mulai: AWAL, ...TEPAT });
    const d = sesiLatihan({ level: 1, mulai: AWAL + 2 * JAM, ...TETAP, mode: 'dampingi' });
    const b = sesiLatihan({ level: 1, mulai: AWAL + 4 * JAM, ...TEPAT });
    expect(hitungKemajuan([a, d, b]).level).toBe(2);
    // dua lembar tepat yang keduanya didampingi juga tidak menaikkan level
    const a2 = sesiLatihan({ level: 1, mulai: AWAL, ...TEPAT, mode: 'dampingi' });
    const b2 = sesiLatihan({ level: 1, mulai: AWAL + 4 * JAM, ...TEPAT, mode: 'dampingi' });
    expect(hitungKemajuan([a2, b2]).level).toBe(1);
  });

  it('lembar ke-3 di hari yang sama tidak dihitung untuk naik', () => {
    const a = sesiLatihan({ level: 1, mulai: AWAL, ...TETAP });
    const b = sesiLatihan({ level: 1, mulai: AWAL + 2 * JAM, ...TETAP });
    const c = sesiLatihan({ level: 1, mulai: AWAL + 4 * JAM, ...KILAT });
    const k = hitungKemajuan([a, b, c]);
    expect(k.level).toBe(1);
    expect(k.catatan[2]).toMatchObject({ alasan: 'lembar_ke3_hari_ini', dihitung: false });
    const d = sesiLatihan({ level: 1, mulai: AWAL + HARI, ...KILAT });
    expect(hitungKemajuan([a, b, c, d]).level).toBe(2);
  });

  it('lembar yang tidak selesai tidak dihitung', () => {
    const s = sesiLatihan({ level: 1, mulai: AWAL, salah: 8, dijawab: 12 });
    const k = hitungKemajuan([s]);
    expect(k.level).toBe(1);
    expect(k.catatan[0]).toMatchObject({ hasil: null, alasan: 'belum_selesai' });
  });

  it('level dihitung ulang dari riwayat: urutan masukan tidak berpengaruh', () => {
    const daftar: SesiLancar[] = [];
    let t = AWAL;
    for (let i = 0; i < 4; i++) {
      daftar.push(sesiLatihan({ level: i + 1, mulai: t, ...KILAT }));
      t += HARI;
    }
    daftar.push(sesiLatihan({ level: 5, mulai: t, salah: 7 }));
    const maju = hitungKemajuan(daftar);
    const acak = hitungKemajuan([daftar[3], daftar[0], daftar[4], daftar[2], daftar[1]] as SesiLancar[]);
    expect(maju.level).toBe(4);
    expect(acak).toEqual(maju);
  });

  it('sesi kelas lain diabaikan; level 6 lulus → tamat', () => {
    const daftar: SesiLancar[] = [sesiPenempatan(6, 5, AWAL)];
    daftar.push(sesiLatihan({ kelas: 5, level: 1, mulai: AWAL + JAM, salah: 10 }));
    daftar.push(sesiLatihan({ level: 6, mulai: AWAL + HARI, ...KILAT }));
    const k = hitungKemajuan(daftar, { kelas: 6 });
    expect(k).toMatchObject({ kelas: 6, level: 6, tamat: true });
  });

  it('soal salah lalu soal lambat masuk pengulangan (paling banyak 4); kosong bila naik', () => {
    const s = sesiLatihan({ level: 2, mulai: AWAL, salah: 2, kecepatan: 0.9 });
    // dua soal benar dibuat sangat lambat
    const j = s.jawaban.map((x, i) => (i === 10 ? { ...x, detik: x.soal.targetDetik * 3 } : i === 11 ? { ...x, detik: x.soal.targetDetik * 5 } : x));
    const tes = sesiPenempatan(6, 1, AWAL - HARI);
    const k = hitungKemajuan([tes, { ...s, jawaban: j }]);
    expect(k.soalUlang.map((x) => x.teks)).toEqual([j[0]?.soal.teks, j[1]?.soal.teks, j[11]?.soal.teks, j[10]?.soal.teks]);
    const lembar = buatLembar(opsiLembarBerikut(k, 'lanjut', AWAL + HARI));
    expect(lembar.soal.filter((x) => x.asal === 'ulang')).toHaveLength(4);
    const naik = sesiLatihan({ level: 2, mulai: AWAL + HARI, ...KILAT });
    expect(hitungKemajuan([tes, { ...s, jawaban: j }, naik]).soalUlang).toEqual([]);
  });
});

describe('uji daya tahan 3 minggu', () => {
  const lulusL1 = sesiLatihan({ level: 1, mulai: AWAL, ...KILAT });
  const waktuLulus = lulusL1.selesai;

  it('jatuh tempo 21 hari setelah lulus', () => {
    const k = hitungKemajuan([lulusL1]);
    expect(k.dayaTahan[1]).toMatchObject({ status: 'menunggu', jatuhTempo: waktuLulus + HARI_DAYA_TAHAN * HARI });
    expect(levelDayaTahanBerikut(k, waktuLulus + 20 * HARI)).toBeNull();
    expect(levelDayaTahanBerikut(k, waktuLulus + 21 * HARI)).toBe(1);
    expect(opsiLembarBerikut(k, 'b', waktuLulus + 22 * HARI)).toMatchObject({ level: 2, levelDayaTahan: 1, lembarKe: 1 });
  });

  it('salah ≤ 1 dari 6 → ingat; tidak diuji lagi', () => {
    const uji = sesiLatihan({ level: 2, mulai: waktuLulus + 22 * HARI, salah: 3, levelDayaTahan: 1, salahDayaTahan: 1 });
    const k = hitungKemajuan([lulusL1, uji]);
    expect(k.dayaTahan[1]?.status).toBe('ingat');
    expect(k.catatan[1]?.dayaTahan).toEqual({ level: 1, ingat: true });
    expect(levelDayaTahanBerikut(k, waktuLulus + 60 * HARI)).toBeNull();
  });

  it('salah ≥ 2 → perlu diulang, soal salah masuk pengulangan, diuji lagi 7 hari kemudian', () => {
    const uji = sesiLatihan({ level: 2, mulai: waktuLulus + 22 * HARI, salah: 3, levelDayaTahan: 1, salahDayaTahan: 2 });
    const k = hitungKemajuan([lulusL1, uji]);
    expect(k.dayaTahan[1]).toMatchObject({ status: 'perlu_ulang', jatuhTempo: uji.selesai + 7 * HARI });
    const salahDT = uji.jawaban.filter((j) => j.soal.asal === 'daya_tahan' && j.jawaban === '9999').map((j) => j.soal.teks);
    expect(k.soalUlang.slice(0, 2).map((s) => s.teks)).toEqual(salahDT);
    expect(levelDayaTahanBerikut(k, uji.selesai + 6 * HARI)).toBeNull();
    expect(levelDayaTahanBerikut(k, uji.selesai + 7 * HARI)).toBe(1);
  });

  it('uji daya tahan di lembar Dampingi tidak dicatat', () => {
    const uji = sesiLatihan({ level: 2, mulai: waktuLulus + 22 * HARI, levelDayaTahan: 1, salahDayaTahan: 4, mode: 'dampingi' });
    expect(hitungKemajuan([lulusL1, uji]).dayaTahan[1]?.status).toBe('menunggu');
  });
});
