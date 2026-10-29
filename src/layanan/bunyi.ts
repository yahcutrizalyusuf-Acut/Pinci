/**
 * Efek bunyi pendek dari assets/bunyi (dibuat skrip, tanpa berkas berlisensi).
 * Orang tua bisa mematikannya di Pengaturan waktu (kolom `bunyi`).
 */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import type { Repositori } from '../data/repositori';

export type NamaBunyi = 'plop' | 'ting' | 'pesta';

const SUMBER: Record<NamaBunyi, number> = {
  plop: require('../../assets/bunyi/plop.wav'),
  ting: require('../../assets/bunyi/ting.wav'),
  pesta: require('../../assets/bunyi/pesta.wav'),
};

const pemutar = new Map<NamaBunyi, AudioPlayer>();

function putar(nama: NamaBunyi) {
  try {
    let p = pemutar.get(nama);
    if (!p) {
      p = createAudioPlayer(SUMBER[nama]);
      pemutar.set(nama, p);
    }
    p.seekTo(0);
    p.play();
  } catch {
    // perangkat tanpa audio: abaikan
  }
}

/** Mainkan bunyi bila orang tua tidak mematikannya untuk anak ini. */
export async function mainkanBunyi(repo: Repositori, anakId: string | undefined, nama: NamaBunyi) {
  if (anakId) {
    try {
      const p = await repo.pengaturan(anakId);
      if (!p.bunyi) return;
    } catch {
      // tetap mainkan
    }
  }
  putar(nama);
}
