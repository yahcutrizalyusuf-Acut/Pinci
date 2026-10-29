/**
 * Adaptor Supabase (mati selama EXPO_PUBLIC_DATA_MODE=lokal). Dilengkapi di Tahap 9.
 */
import type { PengirimSinkron } from './repositori';

export interface OpsiSupabase {
  url: string;
  kunciAnon: string;
  fetchFn?: typeof fetch;
  ambilToken?: () => Promise<string | null>;
}

export function buatPengirimSupabase(opsi: OpsiSupabase): PengirimSinkron {
  const f = opsi.fetchFn ?? fetch;
  return {
    async kirim(item) {
      const perTabel = new Map<string, { idAntrean: string; baris: object }[]>();
      for (const i of item) {
        const d = perTabel.get(i.antrean.tabel) ?? [];
        d.push({ idAntrean: i.antrean.id, baris: i.baris });
        perTabel.set(i.antrean.tabel, d);
      }
      const diterima: string[] = [];
      const token = (await opsi.ambilToken?.()) ?? opsi.kunciAnon;
      for (const [tabel, daftar] of perTabel) {
        const res = await f(`${opsi.url}/rest/v1/${tabel}?on_conflict=id`, {
          method: 'POST',
          headers: {
            apikey: opsi.kunciAnon,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=ignore-duplicates,return=minimal',
          },
          body: JSON.stringify(daftar.map((d) => d.baris)),
        });
        if (res.ok) diterima.push(...daftar.map((d) => d.idAntrean));
      }
      return diterima;
    },
  };
}
