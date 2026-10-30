/**
 * Game berjenjang: setiap game baru punya 5 level. Level berikutnya terbuka setelah level
 * sebelumnya selesai dimainkan sampai akhir. Tanpa kalah: setiap babak selalu bisa diselesaikan,
 * jadi selesai babak = level selesai. Bintang hanya tanda "sudah pernah selesai", bukan poin.
 */
import type { Tingkat } from './jenis';
import type { NamaGame } from './ringkasan';

export const JUMLAH_LEVEL = 5;

export type Level = 1 | 2 | 3 | 4 | 5;

/** Game yang memakai level (game lama tetap memakai Santai/Seru). */
export const GAME_BERJENJANG: readonly NamaGame[] = ['kebun', 'lompat_batu', 'pasangan', 'perahu'];

export function berjenjang(game: NamaGame): boolean {
  return GAME_BERJENJANG.includes(game);
}

export function rapikanLevel(n: unknown): Level {
  const x = Math.round(Number(n));
  if (!Number.isFinite(x)) return 1;
  return Math.min(JUMLAH_LEVEL, Math.max(1, x)) as Level;
}

/** Untuk ringkasan dan catatan: level 1–2 terasa santai, 3–5 seru. */
export function tingkatDariLevel(level: Level): Tingkat {
  return level <= 2 ? 'santai' : 'seru';
}

/** Kemajuan level satu anak untuk satu game. */
export interface KemajuanLevel {
  /** level tertinggi yang boleh dimainkan */
  terbuka: Level;
  /** level yang sudah pernah selesai (tanda bintang) */
  selesai: Level[];
}

export const KEMAJUAN_AWAL: KemajuanLevel = { terbuka: 1, selesai: [] };

/** Kemajuan setelah satu level selesai: level itu diberi tanda, level berikutnya terbuka. */
export function setelahSelesai(k: KemajuanLevel, level: Level): KemajuanLevel {
  const selesai = [...new Set([...k.selesai, level])].sort((a, b) => a - b) as Level[];
  const terbuka = rapikanLevel(Math.max(k.terbuka, Math.min(JUMLAH_LEVEL, level + 1)));
  return { terbuka, selesai };
}

/** Kunci penyimpanan (tabel nilai) per anak per game. */
export function kunciKemajuan(anakId: string, game: NamaGame): string {
  return `game-level:${anakId}:${game}`;
}
