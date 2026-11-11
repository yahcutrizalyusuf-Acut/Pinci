/**
 * Pemanasan 3 soal lama dan tes paham 8 minggu (PROMPT-LANJUTAN-KOMIK tahap 7 butir 6). Di balik saklar
 * FITUR_PEMANASAN dan FITUR_TES_PAHAM (bawaan mati). Fungsi murni; layar memakainya bila saklar dinyalakan.
 */
import type { KemajuanTopik } from '../data/jenis';
import type { PaketGudang, SoalKartu } from '../isi/gudang/jenis';
import { buatAcak } from '../mesin/lancar';
import { acak } from './inggris';

const HARI = 24 * 60 * 60 * 1000;
/** Jarak pengulangan, sama dengan jadwal uji daya tahan: 1, 7, dan 21 hari setelah dikuasai. */
export const JARAK_PEMANASAN = [1, 7, 21] as const;
/** Kelonggaran (hari) di sekitar tiap jarak. */
const LONGGAR = [0.5, 2, 4];
export const TES_PAHAM_HARI = 56;

/** Satu topik dikuasai per jarak (1, 7, 21 hari lalu), diambil yang paling dekat jaraknya; paling banyak 3. */
export function topikPemanasan(kemajuan: KemajuanTopik[], mapel: string, sekarang: number): string[] {
  const kuasai = kemajuan.filter((k) => k.mapel === mapel && k.status === 'kuasai');
  const dipakai = new Set<string>();
  const hasil: string[] = [];
  JARAK_PEMANASAN.forEach((jarak, i) => {
    const calon = kuasai
      .map((k) => ({ k, selisih: Math.abs((sekarang - new Date(k.terakhir).getTime()) / HARI - jarak) }))
      .filter((x) => x.selisih <= LONGGAR[i] && !dipakai.has(x.k.topik))
      .sort((a, b) => a.selisih - b.selisih)[0];
    if (calon) {
      dipakai.add(calon.k.topik);
      hasil.push(calon.k.topik);
    }
  });
  return hasil;
}

/** Soal pemanasan: soal mudah pertama dari kartu tiap topik. */
export function soalPemanasan(paket: PaketGudang, topik: string[]): SoalKartu[] {
  const semua = paket.mapel.flatMap((m) => m.topik);
  return topik.flatMap((id) => {
    const s = semua.find((t) => t.id === id)?.kartu?.soal.find((x) => x.tingkat === 'mudah');
    return s ? [s] : [];
  });
}

/** Tes paham jatuh tempo bila belum pernah atau sudah ≥ 8 minggu sejak tes terakhir. */
export function tesPahamJatuh(terakhirIso: string | null, sekarang: number): boolean {
  if (!terakhirIso) return true;
  return sekarang - new Date(terakhirIso).getTime() >= TES_PAHAM_HARI * HARI;
}

/** 8 soal tes paham: soal cerita atau bergambar (model batang/gambar) dari kartu Matematika, susunan dari benih. */
export function soalTesPaham(paket: PaketGudang, benih: string): SoalKartu[] {
  const kandidat = (paket.mapel.find((m) => m.kode === 'mat')?.topik ?? []).flatMap((t) => (t.kartu?.soal ?? []).filter((s) => s.cerita || s.modelBatang || s.gambar));
  return acak(kandidat, buatAcak(benih)).slice(0, 8);
}
