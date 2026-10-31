/**
 * Memilih pengirim sinkron menurut saklar EXPO_PUBLIC_DATA_MODE.
 * - "lokal" (bawaan): tanpa server; data hanya di HP, tanda "Tersimpan ✓".
 * - "supabase": kirim ke Supabase (lihat docs/CARA-MENYAMBUNG-SUPABASE.md).
 */
import type { PengirimSinkron } from './repositori';
import { buatPengirimSupabase, type OpsiSupabase } from './supabase';

export function modeData(): 'lokal' | 'supabase' {
  return process.env.EXPO_PUBLIC_DATA_MODE === 'supabase' && opsiSupabase() !== null ? 'supabase' : 'lokal';
}

export function opsiSupabase(): Pick<OpsiSupabase, 'url' | 'kunciAnon'> | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const kunciAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && kunciAnon ? { url, kunciAnon } : null;
}

/** Penyedia identitas untuk berbicara dengan server (token, keluarga, peran HP). */
export interface PenyediaServer {
  ambilToken: () => Promise<string | null>;
  ambilKeluargaId: () => Promise<string | null>;
  ambilPeran: () => Promise<'ortu' | 'anak'>;
  ambilPenggunaId: () => Promise<string | null>;
}

/** Pengaturan lengkap untuk berbicara dengan server; null bila mode lokal. */
export function opsiServer(p: PenyediaServer): OpsiSupabase | null {
  const o = opsiSupabase();
  if (process.env.EXPO_PUBLIC_DATA_MODE !== 'supabase' || !o) return null;
  return { ...o, ...p };
}

export function buatPengirim(p: PenyediaServer): PengirimSinkron | null {
  const o = opsiServer(p);
  return o ? buatPengirimSupabase(o) : null;
}
