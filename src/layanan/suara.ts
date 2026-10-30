/**
 * Suara Pinci lewat mesin suara HP (expo-speech) untuk Bahasa Indonesia dan Inggris.
 * Tanpa rekaman suara anak.
 */
import * as Speech from 'expo-speech';

export type BahasaSuara = 'id-ID' | 'en-US';

/** Suara terbaik yang terpasang di HP per bahasa; dicari sekali lalu diingat. */
const suaraTerpilih: Partial<Record<BahasaSuara, string | null>> = {};

function rapikanBahasa(b: string): string {
  return b.replace('_', '-').toLowerCase();
}

/** Pilih suara berkualitas tinggi untuk bahasa itu. Tanpa suara yang cocok, mesin bawaan HP dipakai. */
async function pilihSuara(bahasa: BahasaSuara): Promise<string | null> {
  if (bahasa in suaraTerpilih) return suaraTerpilih[bahasa] ?? null;
  let hasil: string | null = null;
  try {
    const daftar = await Speech.getAvailableVoicesAsync();
    const cocok = daftar.filter((v) => rapikanBahasa(v.language) === rapikanBahasa(bahasa));
    const terbaik = cocok.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ?? cocok[0];
    hasil = terbaik?.identifier ?? null;
  } catch {
    hasil = null;
  }
  suaraTerpilih[bahasa] = hasil;
  return hasil;
}

export function ucapkan(teks: string, bahasa: BahasaSuara = 'id-ID', opsi: { pelan?: boolean; selesai?: () => void } = {}) {
  const bersih = teks.replace(/[*_#]/g, '').replace(/\{(\d+)\/(\d+)\}/g, '$1 per $2').trim();
  if (!bersih) return;
  try {
    Speech.stop();
  } catch {
    // abaikan
  }
  void pilihSuara(bahasa).then((suara) => {
    try {
      Speech.speak(bersih, {
        language: bahasa,
        ...(suara ? { voice: suara } : {}),
        rate: opsi.pelan ? 0.75 : bahasa === 'en-US' ? 0.85 : 0.95,
        pitch: 1.05,
        onDone: opsi.selesai,
      });
    } catch {
      // Mesin suara tidak tersedia (mis. HP tanpa data suara): diam saja.
    }
  });
}

export function hentikanSuara() {
  try {
    Speech.stop();
  } catch {
    // abaikan
  }
}
