import type { PembangkitAcak } from './acak';

/**
 * Kejutan lucu yang kadang muncul di tengah babak (aturan rasa game no. 7).
 * Bukan hadiah: tidak bisa dikumpulkan dan tidak dihitung.
 */
export type Kejutan = 'rangkong_lewat' | 'pinci_bersin' | 'ikan_melompat';

export const DAFTAR_KEJUTAN: readonly Kejutan[] = ['rangkong_lewat', 'pinci_bersin', 'ikan_melompat'];

/** Peluang kejutan muncul pada satu langkah. Kecil supaya tetap terasa kejutan. */
export const PELUANG_KEJUTAN = 0.06;

/**
 * Memilih kejutan untuk satu langkah, atau `null` bila tidak ada.
 * Kejutan yang sama tidak muncul dua kali berturut-turut.
 */
export function pilihKejutan(
  acak: PembangkitAcak,
  sebelumnya: Kejutan | null = null,
  peluang: number = PELUANG_KEJUTAN,
): Kejutan | null {
  if (!acak.peluang(peluang)) return null;
  const calon = DAFTAR_KEJUTAN.filter((k) => k !== sebelumnya);
  return acak.pilih(calon);
}
