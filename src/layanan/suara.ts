/**
 * Suara Pinci lewat mesin suara HP (expo-speech) untuk Bahasa Indonesia dan Inggris.
 * Tanpa rekaman suara anak.
 */
import * as Speech from 'expo-speech';

export type BahasaSuara = 'id-ID' | 'en-US';

export function ucapkan(teks: string, bahasa: BahasaSuara = 'id-ID', opsi: { pelan?: boolean; selesai?: () => void } = {}) {
  const bersih = teks.replace(/[*_#]/g, '').replace(/\{(\d+)\/(\d+)\}/g, '$1 per $2').trim();
  if (!bersih) return;
  try {
    Speech.stop();
    Speech.speak(bersih, {
      language: bahasa,
      rate: opsi.pelan ? 0.75 : bahasa === 'en-US' ? 0.85 : 0.95,
      pitch: 1.05,
      onDone: opsi.selesai,
    });
  } catch {
    // Mesin suara tidak tersedia (mis. HP tanpa data suara): diam saja.
  }
}

export function hentikanSuara() {
  try {
    Speech.stop();
  } catch {
    // abaikan
  }
}
