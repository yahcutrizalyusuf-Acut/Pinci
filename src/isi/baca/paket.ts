import type { Teks } from '../tka/jenis';
import { paketTka } from '../tka/paket';
import { TEKS_K2, TEKS_K3 } from './teks-k2-k3';
import { TEKS_K4, TEKS_K5 } from './teks-k4-k5';

/** Teks Baca Ulang per kelas. Kelas 6 memakai teks bahan TKA (T01–T36). */
export const TEKS_BACA: Record<number, Teks[]> = { 2: TEKS_K2, 3: TEKS_K3, 4: TEKS_K4, 5: TEKS_K5 };

export function teksBacaKelas(kelas: number): Teks[] {
  if (kelas === 6) return paketTka.teks;
  return TEKS_BACA[kelas] ?? [];
}

/** Cari teks dari semua kelas (id kelas 2–5 diawali "K2-" … "K5-", kelas 6 "T01" …). */
export function ambilTeksBaca(id: string): Teks | undefined {
  const m = /^K(\d)-/.exec(id);
  return m ? TEKS_BACA[Number(m[1])]?.find((t) => t.id === id) : paketTka.teks.find((t) => t.id === id);
}
