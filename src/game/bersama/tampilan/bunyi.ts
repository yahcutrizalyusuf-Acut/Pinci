/** Bunyi game (memakai efek bunyi aplikasi) tanpa perlu repositori. */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

type Nama = 'plop' | 'ting' | 'pesta';
const SUMBER: Record<Nama, number> = {
  plop: require('../../../../assets/bunyi/plop.wav'),
  ting: require('../../../../assets/bunyi/ting.wav'),
  pesta: require('../../../../assets/bunyi/pesta.wav'),
};
const pemutar = new Map<Nama, AudioPlayer>();

export function bunyiGame(nama: Nama, nyala: boolean) {
  if (!nyala) return;
  try {
    let p = pemutar.get(nama);
    if (!p) {
      p = createAudioPlayer(SUMBER[nama]);
      pemutar.set(nama, p);
    }
    p.seekTo(0);
    p.play();
  } catch {
    // abaikan
  }
}
