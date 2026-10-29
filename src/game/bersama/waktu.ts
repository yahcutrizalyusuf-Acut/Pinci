import type { Kelas } from './jenis';

/**
 * Logika waktu main (aturan rasa game no. 8 dan 9).
 * - Sisa waktu tampil sebagai matahari kecil yang bergerak pelan di pojok atas.
 * - Dua menit terakhir langit jingga senja. Tanpa kedip merah atau alarm.
 * - Saat waktu habis, babak yang sedang berjalan diselesaikan dulu, lalu langit malam.
 */

/** Dua menit terakhir = langit senja. */
export const DETIK_SENJA = 120;

/**
 * Babak baru hanya boleh dimulai bila sisa waktu paling sedikit 60 detik.
 * Babak 2–4 menit; memulai babak dengan sisa < 1 menit membuat waktu main
 * molor jauh melewati batas yang diatur orang tua.
 */
export const DETIK_MIN_MULAI_BABAK = 60;

/** Batas atas mutlak waktu game per hari (menit), walau orang tua mengatur lebih. */
export const BATAS_MUTLAK_MENIT = 60;

export type SuasanaLangit = 'siang' | 'senja' | 'malam';

/** Batas bawaan waktu game per hari: kelas 1–2 20 menit, kelas 3–6 30 menit. */
export function batasBawaanMenit(kelas: Kelas): number {
  return kelas <= 2 ? 20 : 30;
}

/** Batas yang dipakai: pengaturan orang tua (0–60) atau bawaan kelas. */
export function batasMenitDipakai(kelas: Kelas, aturanOrangTua?: number | null): number {
  if (aturanOrangTua === undefined || aturanOrangTua === null || Number.isNaN(aturanOrangTua)) {
    return batasBawaanMenit(kelas);
  }
  return Math.min(BATAS_MUTLAK_MENIT, Math.max(0, Math.round(aturanOrangTua)));
}

/** Sisa detik waktu main hari ini (tidak pernah negatif). */
export function sisaDetikWaktuMain(batasMenit: number, terpakaiDetik: number): number {
  return Math.max(0, Math.round(batasMenit * 60 - terpakaiDetik));
}

/**
 * Posisi matahari dalam persen lintasan: 0 = baru mulai (terbit), 100 = waktu habis (terbenam).
 * Bergerak sebanding dengan waktu yang sudah terpakai.
 */
export function posisiMatahari(sisaDetik: number, totalDetik: number): number {
  if (totalDetik <= 0) return 100;
  const sisa = Math.min(Math.max(sisaDetik, 0), totalDetik);
  return Math.round(((totalDetik - sisa) / totalDetik) * 1000) / 10;
}

/** `true` di dua menit terakhir (sisa > 0 dan ≤ 120 detik). */
export function langitSenja(sisaDetik: number): boolean {
  return sisaDetik > 0 && sisaDetik <= DETIK_SENJA;
}

export function suasanaLangit(sisaDetik: number): SuasanaLangit {
  if (sisaDetik <= 0) return 'malam';
  return langitSenja(sisaDetik) ? 'senja' : 'siang';
}

/** Boleh memulai babak baru? Babak yang sedang berjalan tidak pernah dipotong. */
export function bolehMulaiBabakBaru(sisaDetik: number): boolean {
  return sisaDetik >= DETIK_MIN_MULAI_BABAK;
}

/**
 * Dipanggil saat sebuah babak selesai: `true` berarti tampilkan layar Waktu habis (G08)
 * — langit malam, Pinci menguap — bukan tombol "Main lagi".
 */
export function harusBerhentiSetelahBabak(sisaDetik: number): boolean {
  return !bolehMulaiBabakBaru(sisaDetik);
}

/** Kalimat layar Waktu habis (G08). */
export const KALIMAT_WAKTU_HABIS = 'Waktunya selesai main. Sampai besok, ya!';
