/**
 * Penyusun lembar latihan (prinsip C: campur dan selipkan).
 *
 * Lembar = 20 soal: 14 soal level ini + 6 soal level sebelumnya
 * (Level ≥ 3: 4 dari level −1 dan 2 dari level −2; Level 2: 6 dari Level 1;
 * Level 1 kelas ≥ 2: 6 dari Level 6 (campur) kelas sebelumnya; Level 1 kelas 1:
 * 20 soal Level 1 karena belum ada level sebelumnya).
 * Celah #3 (selipan bertahap): lembar ke-1 di level baru 8 + 12, lembar ke-2
 * 11 + 9, sesudahnya 14 + 6 (lewat `lembarKe`; bawaan 14 + 6).
 * Sampai 4 soal ulang (salah/lambat di lembar lalu) menggantikan soal level ini.
 * Seluruh lembar diurutkan dari mudah ke sulit menurut `tingkat`.
 */
import { buatAcak } from './acak';
import type { AsalSoal, SoalLancar } from './jenis';
import { ambilLevel, type DefinisiLevel } from './level';
import type { SoalMentah } from './pembuat-soal';

export const SOAL_PER_LEMBAR = 20;
export const MAKS_SOAL_ULANG = 4;
/** Versi resep benih. Naikkan bila pembuat soal berubah supaya lembar lama tidak tertukar. */
export const VERSI_BENIH = 'lancar-v1';

export interface OpsiLembar {
  kelas: number;
  level: number;
  benih: string | number;
  /** Soal yang salah atau lambat di lembar sebelumnya (paling banyak 4 dipakai). */
  soalUlang?: readonly SoalLancar[];
  /** Level yang diuji daya tahannya: 6 soal lama diambil dari level ini. */
  levelDayaTahan?: number | null;
  /** Lembar keberapa di level ini (1 = pertama). Bawaan: 14 + 6. */
  lembarKe?: number;
}

export interface LembarLancar {
  kelas: number;
  level: number;
  benih: string;
  levelDayaTahan: number | null;
  soal: SoalLancar[];
  /** Target lembar = jumlah target per soal (detik). */
  targetDetik: number;
}

export interface Komposisi {
  baru: number;
  lama: number;
}

/** Banyak soal level ini dan soal lama menurut urutan lembar di level itu. */
export function komposisiLembar(lembarKe?: number): Komposisi {
  if (lembarKe === 1) return { baru: 8, lama: 12 };
  if (lembarKe === 2) return { baru: 11, lama: 9 };
  return { baru: 14, lama: 6 };
}

export interface SumberLama {
  kelas: number;
  level: number;
  n: number;
}

/** Dari level mana soal lama diambil (perbandingan 2 : 1 untuk level ≥ 3). */
export function sumberLama(kelas: number, level: number, nLama: number): SumberLama[] {
  if (nLama <= 0) return [];
  if (level >= 3) {
    const dariSatu = Math.round((nLama * 2) / 3);
    return [
      { kelas, level: level - 1, n: dariSatu },
      { kelas, level: level - 2, n: nLama - dariSatu },
    ];
  }
  if (level === 2) return [{ kelas, level: 1, n: nLama }];
  if (kelas > 1) return [{ kelas: kelas - 1, level: 6, n: nLama }];
  return [];
}

/**
 * Ambil n soal tersebar dari kumpulan yang urut mudah→sulit, mulai dari
 * indeks `mulaiDari`, melewati soal yang sudah ada (cara purwarupa).
 */
export function ambilSebar(kumpulan: readonly SoalMentah[], n: number, ada: Set<string>, mulaiDari: number): SoalMentah[] {
  const keluar: SoalMentah[] = [];
  if (n <= 0 || kumpulan.length === 0) return keluar;
  const urut: number[] = [];
  for (let j = 0; j < n; j++) {
    urut.push(Math.min(kumpulan.length - 1, Math.round(mulaiDari + ((j + 0.5) * (kumpulan.length - mulaiDari)) / n)));
  }
  for (let i = 0; i < kumpulan.length; i++) if (!urut.includes(i)) urut.push(i);
  for (const i of urut) {
    if (keluar.length >= n) break;
    const s = kumpulan[i];
    if (s && !ada.has(s.teks)) {
      ada.add(s.teks);
      keluar.push(s);
    }
  }
  return keluar;
}

export function jadikanSoal(m: SoalMentah, def: DefinisiLevel, asal: AsalSoal): SoalLancar {
  return {
    id: `${def.kelas}-${def.level}-${m.teks}`,
    teks: m.teks,
    kunci: m.kunci,
    bentukJawaban: m.bentukJawaban,
    tingkat: m.tingkat,
    level: def.level,
    kelas: def.kelas,
    keluarga: m.keluarga,
    targetDetik: def.targetDetik,
    asal,
  };
}

/**
 * Ambil n soal unik dari satu level. Bila kumpulan pertama kurang (karena
 * soal kembar sudah terpakai), kumpulan cadangan dibuat dengan benih turunan.
 */
function ambilDariLevel(
  def: DefinisiLevel,
  n: number,
  ada: Set<string>,
  benihDasar: string,
  bagianMulai: number,
  asal: AsalSoal,
): SoalLancar[] {
  const keluar: SoalLancar[] = [];
  for (let coba = 0; coba < 12 && keluar.length < n; coba++) {
    const kumpulan = def.buatKumpulan(buatAcak(coba === 0 ? benihDasar : `${benihDasar}|cadangan${coba}`));
    const mulai = coba === 0 ? Math.floor(kumpulan.length * bagianMulai) : 0;
    for (const m of ambilSebar(kumpulan, n - keluar.length, ada, mulai)) keluar.push(jadikanSoal(m, def, asal));
  }
  return keluar;
}

export function buatLembar(opsi: OpsiLembar): LembarLancar {
  const { kelas, level } = opsi;
  const def = ambilLevel(kelas, level);
  const benih = String(opsi.benih);
  const dasar = `${VERSI_BENIH}|${kelas}|${level}|${benih}`;
  const ada = new Set<string>();

  const levelDayaTahan = opsi.levelDayaTahan ?? null;
  if (levelDayaTahan !== null && (!Number.isInteger(levelDayaTahan) || levelDayaTahan < 1 || levelDayaTahan > level)) {
    throw new RangeError(`Level daya tahan ${levelDayaTahan} harus antara 1 dan ${level}.`);
  }

  // Soal ulang: hanya dari kelas sebelumnya atau level ≤ level ini (tidak ada soal yang lebih sulit).
  const ulang: SoalLancar[] = [];
  for (const s of opsi.soalUlang ?? []) {
    if (ulang.length >= MAKS_SOAL_ULANG) break;
    const boleh = s.kelas < kelas || (s.kelas === kelas && s.level <= level);
    if (!boleh || ada.has(s.teks)) continue;
    ada.add(s.teks);
    ulang.push({ ...s, asal: 'ulang' });
  }

  const komposisi = komposisiLembar(opsi.lembarKe);
  const sumber: SumberLama[] =
    levelDayaTahan !== null ? [{ kelas, level: levelDayaTahan, n: 6 }] : sumberLama(kelas, level, komposisi.lama);
  const nLama = sumber.reduce((t, s) => t + s.n, 0);
  const nBaru = SOAL_PER_LEMBAR - nLama - ulang.length;

  const baru = ambilDariLevel(def, nBaru, ada, `${dasar}|ini`, 0, 'baru');
  const lama: SoalLancar[] = [];
  for (const s of sumber) {
    const defLama = ambilLevel(s.kelas, s.level);
    const asal: AsalSoal = levelDayaTahan !== null ? 'daya_tahan' : 'lama';
    lama.push(...ambilDariLevel(defLama, s.n, ada, `${dasar}|lama|${s.kelas}|${s.level}`, 0.25, asal));
  }

  const soal = [...ulang, ...baru, ...lama];
  if (soal.length !== SOAL_PER_LEMBAR) {
    throw new Error(`Lembar kelas ${kelas} level ${level} benih ${benih} hanya berisi ${soal.length} soal.`);
  }
  soal.sort((a, b) => a.tingkat - b.tingkat);
  return {
    kelas,
    level,
    benih,
    levelDayaTahan,
    soal,
    targetDetik: soal.reduce((t, s) => t + s.targetDetik, 0),
  };
}
