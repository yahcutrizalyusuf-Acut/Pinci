/** Pembuat data buatan untuk uji mesin Lancar. */
import type { JawabanLancar, ModeLembar, SesiLancar, SoalLancar } from '../jenis';
import { buatLembar } from '../lembar';
import { buatTesPenempatan } from '../penempatan';

export const JAM = 60 * 60 * 1000;
export const HARI = 24 * JAM;
/** 1 Okt 2026 08.00 WIB. */
export const AWAL = Date.UTC(2026, 9, 1, 1, 0, 0);

let nomor = 0;

export interface OpsiSesiBuatan {
  kelas?: number;
  level: number;
  mulai: number;
  /** Banyak soal yang dijawab salah. */
  salah?: number;
  /** Detik per soal sebagai kelipatan target soal (1 = tepat di target). */
  kecepatan?: number;
  mode?: ModeLembar;
  levelDayaTahan?: number | null;
  /** Banyak soal daya tahan yang dijawab salah. */
  salahDayaTahan?: number;
  /** Banyak soal yang dijawab (bawaan semua). */
  dijawab?: number;
}

export function jawab(soal: SoalLancar, benar: boolean, detik: number): JawabanLancar {
  return { soal, jawaban: benar ? soal.kunci : '9999', benar, detik, hapusN: 0 };
}

export function sesiLatihan(o: OpsiSesiBuatan): SesiLancar {
  const kelas = o.kelas ?? 6;
  const lembar = buatLembar({ kelas, level: o.level, benih: `uji-${nomor}`, levelDayaTahan: o.levelDayaTahan ?? null });
  const kecepatan = o.kecepatan ?? 0.8;
  let sisaSalah = o.salah ?? 0;
  let sisaSalahDT = o.salahDayaTahan ?? 0;
  const jawaban = lembar.soal.slice(0, o.dijawab ?? lembar.soal.length).map((s) => {
    let benar = true;
    if (s.asal === 'daya_tahan' && sisaSalahDT > 0) {
      sisaSalahDT--;
      benar = false;
    } else if (s.asal !== 'daya_tahan' && sisaSalah > 0) {
      sisaSalah--;
      benar = false;
    }
    return jawab(s, benar, s.targetDetik * kecepatan);
  });
  const durasi = jawaban.reduce((t, j) => t + j.detik, 0) * 1000;
  nomor++;
  return {
    id: `sesi-${nomor}`,
    jenis: 'latihan',
    kelas,
    level: o.level,
    mode: o.mode ?? 'sendiri',
    mulai: o.mulai,
    selesai: o.mulai + durasi,
    jumlahSoal: lembar.soal.length,
    levelDayaTahan: lembar.levelDayaTahan,
    jawaban,
  };
}

/** Sesi tes penempatan: level 1..lancarSampai dijawab lancar, level berikutnya salah semua. */
export function sesiPenempatan(kelas: number, lancarSampai: number, mulai: number): SesiLancar {
  const soal = buatTesPenempatan({ kelas, benih: `tes-${nomor}` });
  const jawaban = soal
    .filter((s) => s.level <= lancarSampai + 1)
    .map((s) => jawab(s, s.level <= lancarSampai, s.targetDetik * 0.5));
  nomor++;
  return { id: `tes-${nomor}`, jenis: 'penempatan', kelas, level: 1, mode: 'sendiri', mulai, selesai: mulai + 60000, jumlahSoal: soal.length, levelDayaTahan: null, jawaban };
}
