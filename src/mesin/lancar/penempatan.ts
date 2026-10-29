/**
 * Tes penempatan (prinsip L: mulai dari level anak).
 * 4 soal per level mulai Level 1. Tes berhenti di level pertama yang belum
 * lancar; lancar = 4/4 benar DAN jumlah detik ≤ jumlah target. Anak mulai
 * berlatih di level itu. Bila semua 6 level lancar, anak mulai di Level 6.
 * Tombol "Belum bisa" dicatat sebagai jawaban `null` (salah).
 * Pilihan "lewati, mulai Level 1" = sesi penempatan tanpa jawaban → Level 1.
 */
import { buatAcak } from './acak';
import { cocokJawaban } from './jawaban';
import type { JawabanLancar, SoalLancar } from './jenis';
import { ambilLevel, LEVEL_PER_KELAS } from './level';
import { ambilSebar, jadikanSoal, VERSI_BENIH } from './lembar';

export const SOAL_PER_LEVEL_TES = 4;

export interface OpsiTes {
  kelas: number;
  benih: string | number;
}

/** 24 soal: 4 per level, urut Level 1 → 6, di dalam level urut mudah → sulit. */
export function buatTesPenempatan(opsi: OpsiTes): SoalLancar[] {
  const keluar: SoalLancar[] = [];
  const ada = new Set<string>();
  for (let level = 1; level <= LEVEL_PER_KELAS; level++) {
    const def = ambilLevel(opsi.kelas, level);
    const kumpulan = def.buatKumpulan(buatAcak(`${VERSI_BENIH}|tes|${opsi.kelas}|${level}|${String(opsi.benih)}`));
    const pilihan = ambilSebar(kumpulan, SOAL_PER_LEVEL_TES, ada, Math.floor(kumpulan.length / 5));
    pilihan.sort((a, b) => a.tingkat - b.tingkat);
    for (const m of pilihan) keluar.push(jadikanSoal(m, def, 'tes'));
  }
  return keluar;
}

export interface NilaiBagianTes {
  level: number;
  jumlah: number;
  benar: number;
  detik: number;
  targetDetik: number;
  lancar: boolean;
}

/** Menilai satu bagian tes (jawaban satu level). Benar/salah dihitung ulang. */
export function nilaiBagianTes(level: number, jawaban: readonly JawabanLancar[]): NilaiBagianTes {
  const item = jawaban.filter((j) => j.soal.level === level);
  const benar = item.filter((j) => cocokJawaban(j.soal, j.jawaban)).length;
  const detik = item.reduce((t, j) => t + j.detik, 0);
  const targetDetik = item.reduce((t, j) => t + j.soal.targetDetik, 0);
  return {
    level,
    jumlah: item.length,
    benar,
    detik,
    targetDetik,
    lancar: item.length >= SOAL_PER_LEVEL_TES && benar === item.length && detik <= targetDetik,
  };
}

export interface HasilPenempatan {
  levelAwal: number;
  /** Level yang lancar di tes (dicatat lulus, lalu diuji daya tahan 21 hari kemudian). */
  levelLancar: number[];
  bagian: NilaiBagianTes[];
}

export function tentukanLevelAwal(jawaban: readonly JawabanLancar[]): HasilPenempatan {
  const bagian: NilaiBagianTes[] = [];
  const levelLancar: number[] = [];
  for (let level = 1; level <= LEVEL_PER_KELAS; level++) {
    const n = nilaiBagianTes(level, jawaban);
    if (n.jumlah === 0) return { levelAwal: level, levelLancar, bagian };
    bagian.push(n);
    if (!n.lancar) return { levelAwal: level, levelLancar, bagian };
    levelLancar.push(level);
  }
  return { levelAwal: LEVEL_PER_KELAS, levelLancar, bagian };
}

/**
 * Apakah tes harus berhenti sekarang? Benar bila ada bagian level yang sudah
 * lengkap (4 soal) tetapi belum lancar, atau semua soal sudah dijawab.
 */
export function tesSelesai(jawaban: readonly JawabanLancar[]): boolean {
  for (let level = 1; level <= LEVEL_PER_KELAS; level++) {
    const n = nilaiBagianTes(level, jawaban);
    if (n.jumlah < SOAL_PER_LEVEL_TES) return false;
    if (!n.lancar) return true;
  }
  return true;
}
