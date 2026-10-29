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

export function buatPengirim(ambilToken: () => Promise<string | null>, ambilKeluargaId: () => Promise<string | null>): PengirimSinkron | null {
  const o = opsiSupabase();
  if (process.env.EXPO_PUBLIC_DATA_MODE !== 'supabase' || !o) return null;
  return buatPengirimSupabase({ ...o, ambilToken, ambilKeluargaId });
}
