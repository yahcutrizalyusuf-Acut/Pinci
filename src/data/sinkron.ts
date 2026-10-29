/**
 * Memilih pengirim sinkron menurut saklar EXPO_PUBLIC_DATA_MODE.
 * - "lokal" (bawaan): tanpa server; data hanya di HP, tanda "Tersimpan ✓".
 * - "supabase": kirim ke Supabase (lihat docs/CARA-MENYAMBUNG-SUPABASE.md).
 */
import type { PengirimSinkron } from './repositori';
import { buatPengirimSupabase } from './supabase';

export function modeData(): 'lokal' | 'supabase' {
  return process.env.EXPO_PUBLIC_DATA_MODE === 'supabase' ? 'supabase' : 'lokal';
}

export function buatPengirim(): PengirimSinkron | null {
  if (modeData() !== 'supabase') return null;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const kunci = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !kunci) return null;
  return buatPengirimSupabase({ url, kunciAnon: kunci });
}
