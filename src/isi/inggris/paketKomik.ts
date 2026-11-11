/** Paket komik dan tokoh yang dibawa di aplikasi (tanpa unduhan, jalan tanpa sinyal). */
import k3 from '../../../assets/paket/komik-t3.json';
import k4 from '../../../assets/paket/komik-t4.json';
import tokohJson from '../../../assets/paket/tokoh.json';
import { isiNama, type Komik, type PaketKomik, type PaketTokoh, type Tokoh } from './komik';

export const PAKET_TOKOH = tokohJson as unknown as PaketTokoh;

export const PAKET_KOMIK: Partial<Record<3 | 4 | 5 | 6, PaketKomik>> = {
  3: k3 as unknown as PaketKomik,
  4: k4 as unknown as PaketKomik,
};

/** Peta id tokoh → nama (satu-satunya sumber nama tokoh). */
export const NAMA_TOKOH: Record<string, string> = Object.fromEntries(PAKET_TOKOH.tokoh.map((t) => [t.id, t.nama]));

export function cariTokoh(id: string): Tokoh | undefined {
  return PAKET_TOKOH.tokoh.find((t) => t.id === id);
}

/** Komik untuk unit ini, atau undefined bila unit belum punya komik. */
export function komikUnit(unitId: string): Komik | undefined {
  const t = Number(unitId.slice(1, 2)) as 3 | 4 | 5 | 6;
  return PAKET_KOMIK[t]?.komik.find((k) => k.unit === unitId);
}

/** Komik berdasarkan id, misal "t3-u01-komik". */
export function cariKomik(id: string): Komik | undefined {
  for (const p of Object.values(PAKET_KOMIK)) {
    const k = p?.komik.find((x) => x.id === id);
    if (k) return k;
  }
  return undefined;
}

/** Ganti penanda nama di teks naskah dengan nama dari tokoh.json. */
export function teksTokoh(teks: string): string {
  return isiNama(teks, NAMA_TOKOH);
}

/** Pengaturan suara satu tokoh di tingkat tertentu (kecepatan ± 0,85 tingkat 3–4, ± 0,95 tingkat 5–6). */
export function suaraTokoh(id: string, tingkat: number): { bahasa: string; nada: number; kecepatan: number } {
  const t = cariTokoh(id) ?? cariTokoh('narator');
  const faktor = tingkat <= 4 ? 0.85 : 0.95;
  return { bahasa: t?.suara.bahasa ?? 'en-US', nada: t?.suara.nada ?? 1, kecepatan: Math.round((t?.suara.kecepatan ?? 1) * faktor * 100) / 100 };
}
