/**
 * Logika Cerita Komik dan Cek Dengar (PROMPT-LANJUTAN-KOMIK tahap 4–5), tanpa React supaya mudah diuji.
 *
 * Sorotan kata: expo-speech `onBoundary` tidak dijamin ada di Android, jadi waktu tiap kata DIPERKIRAKAN dari panjang
 * kata dan kecepatan suara (keputusan pembangunan 76). Kalau `onBoundary` datang, layar memakai posisi huruf dari HP.
 */
import type { Kosakata, PaketInggris, SoalDengar, UnitInggris } from '../isi/inggris/jenis';
import type { Komik, SoalCekPaham } from '../isi/inggris/komik';
import { buatAcak } from '../mesin/lancar';
import { acak } from './inggris';

export interface KepinganKata {
  /** teks yang tampil, termasuk tanda baca yang menempel */
  tampil: string;
  /** kata bersih huruf kecil untuk kamus dan suara ("" untuk tanda baca saja) */
  kata: string;
  /** posisi huruf pertama di kalimat (untuk onBoundary) */
  mulai: number;
}

/** Pecah kalimat (nama sudah diisi) menjadi kepingan kata yang bisa diketuk dan disorot. */
export function kepingKalimat(kalimat: string): KepinganKata[] {
  const hasil: KepinganKata[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(kalimat))) {
    const kata = m[0]
      .toLowerCase()
      .replace(/^[^a-z']+|[^a-z']+$/g, '')
      .replace(/^'+|'+$/g, '');
    hasil.push({ tampil: m[0], kata, mulai: m.index });
  }
  return hasil;
}

/**
 * Perkiraan waktu mulai tiap kata (ms sejak suara mulai). Dasar ± 330 ms per kata + 45 ms per huruf pada kecepatan 1,
 * jeda 250 ms setelah tanda baca akhir, dibagi kecepatan suara.
 */
export function perkiraanWaktuKata(kepingan: KepinganKata[], kecepatan: number): number[] {
  const waktu: number[] = [];
  let t = 150;
  const k = kecepatan > 0 ? kecepatan : 1;
  for (const p of kepingan) {
    waktu.push(Math.round(t));
    t += (330 + 45 * p.kata.length) / k;
    if (/[.!?,]$/.test(p.tampil)) t += 250 / k;
  }
  return waktu;
}

/** Indeks kata yang sedang diucapkan dari posisi huruf onBoundary. */
export function indeksDariHuruf(kepingan: KepinganKata[], hurufKe: number): number {
  let idx = 0;
  for (let i = 0; i < kepingan.length; i++) if (kepingan[i].mulai <= hurufKe) idx = i;
  return idx;
}

/** Kamus kata → arti dari kosakata tingkat ini dan tingkat di bawahnya (kata tunggal dan frasa). */
export function buatKamus(paketSemua: PaketInggris[], tingkat: number): Map<string, Kosakata> {
  const kamus = new Map<string, Kosakata>();
  for (const p of paketSemua) {
    if (p.tingkat > tingkat) continue;
    for (const u of p.unit) for (const k of [...u.kosakata, ...(u.kataKomik ?? [])]) if (!kamus.has(k.kata.toLowerCase())) kamus.set(k.kata.toLowerCase(), k);
  }
  return kamus;
}

/** Arti satu kata di kamus (mencoba bentuk jamak sederhana). */
export function artiKata(kamus: Map<string, Kosakata>, kata: string): Kosakata | undefined {
  const k = kata.toLowerCase();
  return kamus.get(k) ?? (k.endsWith('es') ? kamus.get(k.slice(0, -2)) : undefined) ?? (k.endsWith('s') ? kamus.get(k.slice(0, -1)) : undefined);
}

/** Urutan panel yang diacak untuk soal urutkan; dijamin tidak sama dengan urutan benar. */
export function acakPanel(soal: Extract<SoalCekPaham, { jenis: 'urutkan' }>, benih: string): string[] {
  const r = buatAcak(benih);
  for (let coba = 0; coba < 10; coba++) {
    const a = acak(soal.panel, r);
    if (a.join() !== soal.panel.join()) return a;
  }
  return [...soal.panel].reverse();
}

/** Pindahkan satu butir dari indeks `dari` ke `ke` (seret untuk mengurutkan). */
export function pindahkan<T>(daftar: T[], dari: number, ke: number): T[] {
  const a = [...daftar];
  const [x] = a.splice(dari, 1);
  a.splice(Math.max(0, Math.min(a.length, ke)), 0, x);
  return a;
}

/** Kata target dari soal yang salah di Cek Paham (untuk antrean pengulangan berjarak). */
export function kataDariSoal(komik: Komik, soal: SoalCekPaham): string[] {
  const teks = (gid: string) => komik.panel.flatMap((p) => p.gelembung).find((g) => g.id === gid)?.teks.toLowerCase() ?? '';
  if (soal.jenis === 'urutkan') return [];
  if (soal.jenis === 'lengkapi') return komik.kataTarget.filter((k) => k.toLowerCase() === soal.kataHilang.toLowerCase());
  const t = teks(soal.gelembung);
  return komik.kataTarget.filter((k) => t.includes(k.toLowerCase()));
}

// ---------- Cek Dengar setiap 4 unit ----------

/** Nomor Cek Dengar untuk unit ke-n (unit 1–4 → 1, 5–8 → 2, 9–12 → 3). */
export function nomorCekDengar(nomorUnit: number): number {
  return Math.ceil(nomorUnit / 4);
}

/** Unit yang diuji di Cek Dengar ke-`ke`. */
export function unitCekDengar(paket: PaketInggris, ke: number): UnitInggris[] {
  return paket.unit.filter((u) => nomorCekDengar(u.nomor) === ke);
}

/** 8 soal dengar-lalu-pilih, susunan TETAP: 2 soal pertama dari tiap 4 unit, berurutan. */
export function soalCekDengar(paket: PaketInggris, ke: number): SoalDengar[] {
  return unitCekDengar(paket, ke).flatMap((u) => u.dengar.slice(0, 2)).slice(0, 8);
}

/** Cek Dengar terbuka setelah 4 unitnya pernah diselesaikan. */
export function cekDengarTerbuka(paket: PaketInggris, ke: number, unitSelesai: Set<string | undefined>): boolean {
  const u = unitCekDengar(paket, ke);
  return u.length === 4 && u.every((x) => unitSelesai.has(x.id));
}

/** Rujukan sesi Cek Dengar, misal "t3-cek1". */
export function rujukanCekDengar(tingkat: number, ke: number): string {
  return `t${tingkat}-cek${ke}`;
}
