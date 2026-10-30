/**
 * Suara Pinci untuk Bahasa Indonesia dan Inggris. Tanpa rekaman suara anak.
 * Inggris: rekaman bawaan aplikasi (assets/suara/en) lebih dulu, supaya pengucapan bagus di semua HP
 * tanpa pengaturan apa pun. Teks yang belum punya rekaman memakai mesin suara HP (expo-speech).
 */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

import { kunciUcapan } from '../isi/suara/kunci';
import { PETA_SUARA_EN } from '../isi/suara/peta-en';

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

let pemutarRekaman: AudioPlayer | null = null;

function hentikanRekaman() {
  try {
    pemutarRekaman?.remove();
  } catch {
    // abaikan
  }
  pemutarRekaman = null;
}

/** Putar rekaman bawaan bila ada. Mengembalikan false bila tidak ada rekaman untuk teks ini. */
function putarRekaman(teks: string, selesai?: () => void): boolean {
  const sumber = PETA_SUARA_EN[kunciUcapan(teks)];
  if (sumber === undefined) return false;
  try {
    const p = createAudioPlayer(sumber);
    pemutarRekaman = p;
    p.addListener('playbackStatusUpdate', (st) => {
      if (st.didJustFinish) selesai?.();
    });
    p.play();
    return true;
  } catch {
    hentikanRekaman();
    return false;
  }
}

export function ucapkan(teks: string, bahasa: BahasaSuara = 'id-ID', opsi: { pelan?: boolean; selesai?: () => void } = {}) {
  const bersih = teks.replace(/[*_#]/g, '').replace(/\{(\d+)\/(\d+)\}/g, '$1 per $2').trim();
  if (!bersih) return;
  try {
    Speech.stop();
  } catch {
    // abaikan
  }
  hentikanRekaman();
  if (bahasa === 'en-US' && !opsi.pelan && putarRekaman(bersih, opsi.selesai)) return;
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
  hentikanRekaman();
  try {
    Speech.stop();
  } catch {
    // abaikan
  }
}
