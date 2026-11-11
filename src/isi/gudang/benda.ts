/**
 * Aturan model batang dan garis bilangan (rancangan 12 bagian 2, M2), fungsi murni supaya bisa diuji dan dipakai komponen.
 */
import { hitungEkspresi, rasional, tambah, type Rasional } from './hitung';
import type { BendaInteraktif, GarisBilanganData, ModelBatangData } from './jenis';

const r = (n: number): Rasional => hitungEkspresi(String(n));

/** Nilai yang dicari di model batang (jumlah ruas `dicari`, atau keseluruhan bila keseluruhan dicari), dibagi penyebut. */
export function nilaiDicari(m: ModelBatangData): Rasional | null {
  let jumlah: Rasional | null = null;
  if (m.keseluruhan?.dicari) jumlah = r(m.keseluruhan.nilai);
  else
    for (const b of m.baris)
      for (const s of b.ruas)
        if (s.dicari) jumlah = jumlah ? tambah(jumlah, r(s.nilai)) : r(s.nilai);
  if (!jumlah) return null;
  return m.penyebut ? rasional(jumlah.p, jumlah.q * BigInt(m.penyebut)) : jumlah;
}

/** Daftar pelanggaran aturan model batang (kosong = sah). */
export function periksaModelBatang(m: ModelBatangData): string[] {
  const salah: string[] = [];
  if (m.baris.length < 1 || m.baris.length > 2) salah.push('baris harus 1–2');
  let barisDicari = 0;
  for (const b of m.baris) {
    const idx = b.ruas.map((s, i) => (s.dicari ? i : -1)).filter((i) => i >= 0);
    if (idx.length) {
      barisDicari += 1;
      if (idx[idx.length - 1] - idx[0] + 1 !== idx.length) salah.push('ruas dicari harus berdampingan');
    }
    for (const s of b.ruas) if (!(s.nilai > 0)) salah.push('nilai ruas harus positif');
  }
  if (barisDicari > 1) salah.push('ruas dicari hanya di satu baris');
  if (m.keseluruhan) {
    const total = m.baris.flatMap((b) => b.ruas).reduce((a, s) => a + s.nilai, 0);
    if (Math.abs(total - m.keseluruhan.nilai) > 1e-9) salah.push(`keseluruhan ${m.keseluruhan.nilai} ≠ jumlah ruas ${total}`);
    if (m.keseluruhan.dicari && barisDicari) salah.push('keseluruhan dan ruas tidak boleh sama-sama dicari');
  }
  if (!nilaiDicari(m)) salah.push('tidak ada yang dicari');
  return salah;
}

/** Tanda-tanda garis bilangan dari mulai sampai akhir. */
export function tandaGaris(g: GarisBilanganData): number[] {
  const n = Math.round((g.akhir - g.mulai) / g.langkah);
  return Array.from({ length: n + 1 }, (_, i) => Math.round((g.mulai + i * g.langkah) * 1e6) / 1e6);
}

/** Tulisan satu tanda garis (pecahan bila ada penyebut). */
export function tulisTanda(n: number, penyebut?: number): string {
  if (penyebut) {
    const a = Math.round(n * penyebut);
    if (a % penyebut === 0) return String(a / penyebut);
    return `${a}/${penyebut}`;
  }
  return Number.isInteger(n) ? n.toLocaleString('id-ID') : String(n).replace('.', ',');
}

/** Daftar pelanggaran benda interaktif (kosong = sah). */
export function periksaBenda(b: BendaInteraktif): string[] {
  const salah: string[] = [];
  if (b.jenis === 'blok' && !(Number.isInteger(b.target) && b.target >= 1 && b.target <= 999)) salah.push('target blok 1–999');
  if (b.jenis === 'potongan' && !(b.bagian >= 2 && b.bagian <= 12 && b.target >= 1 && b.target <= b.bagian)) salah.push('potongan: bagian 2–12, target ≤ bagian');
  if (b.jenis === 'uang') {
    const kecil = Math.min(...b.pilihan);
    if (b.target % kecil !== 0) salah.push('uang: target tidak bisa dibentuk');
  }
  if (b.jenis === 'lompat') {
    const t = tandaGaris(b.garis);
    if (t.length > 13) salah.push('garis lebih dari 13 tanda');
    const k = (b.target - b.garis.mulai) / b.lompat;
    if (Math.abs(k - Math.round(k)) > 1e-9 || k < 1) salah.push('lompat: target tidak tercapai');
    if (b.target > b.garis.akhir + 1e-9) salah.push('lompat: target di luar garis');
  }
  return salah;
}
