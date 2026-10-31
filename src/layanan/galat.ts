/**
 * Penangkap galat aplikasi → catatan masalah teknis di server sendiri (tanpa pihak ketiga, tanpa data pribadi).
 * Hanya pesan galat, tempat singkat, versi aplikasi, dan jenis HP. Penangkap bawaan tetap dipanggil.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { Repositori } from '../data/repositori';

type Penangan = (galat: unknown, fatal?: boolean) => void;
interface PenggantiGalat {
  getGlobalHandler?: () => Penangan;
  setGlobalHandler?: (f: Penangan) => void;
}

let terpasang = false;

function pesanDari(galat: unknown): { pesan: string; tempat?: string } {
  if (galat instanceof Error) {
    const baris = (galat.stack ?? '').split('\n').find((b) => b.includes('at ') && !b.includes('node_modules'));
    return { pesan: `${galat.name}: ${galat.message}`, tempat: baris?.trim().slice(0, 80) };
  }
  return { pesan: String(galat) };
}

export function pasangPenangkapGalat(repo: Repositori) {
  if (terpasang) return;
  terpasang = true;
  const versi = Constants.expoConfig?.version;
  const perangkat = `${Platform.OS} ${String(Platform.Version ?? '')}`.trim();
  const catat = (galat: unknown) => {
    const { pesan, tempat } = pesanDari(galat);
    repo.catatTeknis(pesan, tempat, versi, perangkat).catch(() => undefined);
  };
  const eu = (globalThis as { ErrorUtils?: PenggantiGalat }).ErrorUtils;
  if (eu?.setGlobalHandler) {
    const lama = eu.getGlobalHandler?.();
    eu.setGlobalHandler((galat, fatal) => {
      catat(galat);
      lama?.(galat, fatal);
    });
  }
  const w = globalThis as { addEventListener?: (n: string, f: (e: { error?: unknown; reason?: unknown; message?: string }) => void) => void };
  if (Platform.OS === 'web' && w.addEventListener) {
    w.addEventListener('error', (e) => catat(e.error ?? e.message));
    w.addEventListener('unhandledrejection', (e) => catat(e.reason));
  }
}
