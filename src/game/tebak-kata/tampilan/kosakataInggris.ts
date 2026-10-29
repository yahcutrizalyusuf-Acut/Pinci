/**
 * Kosakata Inggris ber-emoji untuk Tebak Kata kelas 5–6 tingkat Seru,
 * diambil dari paket Belajar Bahasa Inggris (tingkat 5 dan 6).
 */
import paketT5 from '../../../../assets/paket/inggris-t5.json';
import paketT6 from '../../../../assets/paket/inggris-t6.json';
import type { Kelas, Tingkat } from '../../bersama/jenis';
import type { KataInggris } from '../bank';

interface PaketKosakata {
  unit: readonly { kosakata: readonly { kata: string; arti: string; emoji: string }[] }[];
}

/** Hanya kata tunggal huruf kecil yang punya emoji (mis. "clock" 🕰️), agar muat di ubin. */
export function kosakataDariPaket(paket: PaketKosakata): KataInggris[] {
  return paket.unit
    .flatMap((u) => u.kosakata)
    .filter((k) => k.emoji !== '' && /^[a-z]{2,10}$/.test(k.kata))
    .map((k) => ({ inggris: k.kata, indonesia: k.arti, emoji: k.emoji }));
}

/** Daftar kata Inggris untuk babak, atau `undefined` bila babak memakai kata baku. */
export function kataInggrisUntuk(kelas: Kelas, tingkat: Tingkat): KataInggris[] | undefined {
  if (tingkat !== 'seru' || kelas < 5) return undefined;
  return kosakataDariPaket(kelas === 5 ? paketT5 : paketT6);
}
