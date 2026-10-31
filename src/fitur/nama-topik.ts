/** Nama topik yang mudah dibaca orang tua, diambil dari paket isi. */
import { PAKET_INGGRIS } from '../isi/inggris/paket';
import { PAKET_GUDANG } from '../isi/gudang/paket';
import { paketTka } from '../isi/tka/paket';

let daftar: Map<string, string> | null = null;

function siapkan(): Map<string, string> {
  if (daftar) return daftar;
  const d = new Map<string, string>();
  for (const t of paketTka.topik) d.set(`tka:${t.id}`, `${t.judul} (${t.id})`);
  for (const p of Object.values(PAKET_GUDANG)) for (const m of p.mapel) for (const t of m.topik) d.set(`gudang:${t.id}`, t.judul);
  for (const p of Object.values(PAKET_INGGRIS)) for (const u of p.unit) d.set(`ing:${u.id}`, `Bahasa Inggris T${p.tingkat} · ${u.tema}`);
  daftar = d;
  return d;
}

export function namaTopik(mapel: string, topik: string): string {
  return siapkan().get(`${mapel}:${topik}`) ?? topik;
}
