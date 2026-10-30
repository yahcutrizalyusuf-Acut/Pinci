/**
 * Geometri gambar Susun Kubus (murni, tanpa React).
 *
 * Proyeksi miring sederhana: sisi depan kubus menghadap anak persis seperti kartu tampak depan,
 * sisi atas dan sisi kanan terlihat miring ke kanan atas. Baris 0 = paling belakang (geser kanan atas),
 * baris terakhir = paling depan. Kolom 0 = paling kiri.
 */
import type { Petak } from '../logika';

export type Titik = readonly [number, number];

export interface Geometri {
  /** panjang rusuk kubus (dp) */
  s: number;
  /** geser kedalaman per baris (dp) */
  dx: number;
  dy: number;
  /** pojok kiri bawah depan petak baris terakhir, kolom 0 */
  ox: number;
  oy: number;
  /** tebal papan alas */
  tebal: number;
  baris: number;
  kolom: number;
}

export const RASIO_DX = 0.42;
export const RASIO_DY = 0.3;

export function buatGeometri(lebar: number, tinggi: number, baris: number, kolom: number, tinggiMaks: number): Geometri {
  const sLebar = (lebar - 16) / (kolom + baris * RASIO_DX);
  // ruang di atas tumpukan tertinggi untuk kubus jatuh dan memantul
  const sTinggi = (tinggi - 12) / (tinggiMaks + baris * RASIO_DY + 0.3 + 0.9);
  const s = Math.max(16, Math.min(72, sLebar, sTinggi));
  const dx = s * RASIO_DX;
  const dy = s * RASIO_DY;
  const tebal = s * 0.3;
  const lebarGambar = kolom * s + baris * dx;
  return { s, dx, dy, ox: (lebar - lebarGambar) / 2, oy: tinggi - tebal - 8, tebal, baris, kolom };
}

/** Pojok kiri bawah depan dari kubus di (b, k) pada tingkat z (0 = di atas petak). */
export function pojok(g: Geometri, b: number, k: number, z: number): Titik {
  const mundur = g.baris - 1 - b;
  return [g.ox + k * g.s + mundur * g.dx, g.oy - mundur * g.dy - z * g.s];
}

export interface SisiKubus {
  depan: Titik[];
  atas: Titik[];
  kanan: Titik[];
}

export function sisiKubus(g: Geometri, b: number, k: number, z: number): SisiKubus {
  const [x, y] = pojok(g, b, k, z);
  const { s, dx, dy } = g;
  return {
    depan: [
      [x, y],
      [x + s, y],
      [x + s, y - s],
      [x, y - s],
    ],
    atas: [
      [x, y - s],
      [x + s, y - s],
      [x + s + dx, y - s - dy],
      [x + dx, y - s - dy],
    ],
    kanan: [
      [x + s, y],
      [x + s + dx, y - dy],
      [x + s + dx, y - s - dy],
      [x + s, y - s],
    ],
  };
}

/** Jajaran genjang petak alas (b, k). */
export function ubinPetak(g: Geometri, b: number, k: number): Titik[] {
  const [x, y] = pojok(g, b, k, 0);
  return [
    [x, y],
    [x + g.s, y],
    [x + g.s + g.dx, y - g.dy],
    [x + g.dx, y - g.dy],
  ];
}

/** Garis luar seluruh tumpukan (b, k) setinggi `t` kubus (t = 0 → ubin saja). */
export function siluetTumpukan(g: Geometri, b: number, k: number, t: number): Titik[] {
  const [x, y] = pojok(g, b, k, 0);
  const h = t * g.s;
  const { s, dx, dy } = g;
  return [
    [x, y],
    [x + s, y],
    [x + s + dx, y - dy],
    [x + s + dx, y - dy - h],
    [x + dx, y - dy - h],
    [x, y - h],
  ];
}

/** Titik tengah sisi atas tumpukan (tempat kubus berikutnya mendarat). */
export function pusatAtas(g: Geometri, b: number, k: number, t: number): Titik {
  const [x, y] = pojok(g, b, k, t);
  return [x + (g.s + g.dx) / 2, y - g.dy / 2];
}

export function keTeksTitik(titik: readonly Titik[]): string {
  return titik.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export function dalamPoligon([px, py]: Titik, poli: readonly Titik[]): boolean {
  let dalam = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i];
    const [xj, yj] = poli[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) dalam = !dalam;
  }
  return dalam;
}

/** Urutan gambar: belakang → depan, kiri → kanan, bawah → atas. */
export function urutanGambar(g: Geometri, b: number, k: number, z: number): number {
  return (b * g.kolom + k) * 100 + z;
}

/**
 * Petak yang diketuk: tumpukan paling depan yang memuat titik, atau petak terdekat
 * (dalam jarak `toleransi` dari pusat atas tumpukan) supaya jari anak tidak harus tepat.
 */
export function petakDiTitik(g: Geometri, petak: Petak, titik: Titik, toleransi = g.s * 0.9): [number, number] | null {
  for (let b = g.baris - 1; b >= 0; b--) {
    for (let k = g.kolom - 1; k >= 0; k--) {
      if (dalamPoligon(titik, siluetTumpukan(g, b, k, petak[b]?.[k] ?? 0))) return [b, k];
    }
  }
  return petakTerdekat(g, petak, titik, toleransi);
}

/** Magnet: petak yang pusat atas tumpukannya paling dekat dengan titik, dalam jarak `radius`. */
export function petakTerdekat(g: Geometri, petak: Petak, [px, py]: Titik, radius: number): [number, number] | null {
  let terbaik: [number, number] | null = null;
  let jarakTerbaik = radius;
  for (let b = 0; b < g.baris; b++) {
    for (let k = 0; k < g.kolom; k++) {
      const [cx, cy] = pusatAtas(g, b, k, petak[b]?.[k] ?? 0);
      const d = Math.hypot(px - cx, py - cy);
      if (d <= jarakTerbaik) {
        jarakTerbaik = d;
        terbaik = [b, k];
      }
    }
  }
  return terbaik;
}

/** Kubus bayangan (garis putus-putus) yang menunjukkan tinggi yang masih kurang. */
export interface TandaKubus {
  kunci: string;
  b: number;
  k: number;
  z: number;
  arah: 'depan' | 'kanan';
}

/**
 * Bayangan yang diketuk: titik di dalam sisi bayangan, atau paling dekat dengan pusatnya
 * (dalam jarak `toleransi`). Mengembalikan petak tempat kubus ditaruh, atau null.
 */
export function bayanganDiTitik(g: Geometri, tanda: readonly TandaKubus[], titik: Titik, toleransi = g.s * 0.7): [number, number] | null {
  let terbaik: [number, number] | null = null;
  let jarakTerbaik = Infinity;
  for (const t of tanda) {
    const sisi = sisiKubus(g, t.b, t.k, t.z);
    const poligon = t.arah === 'kanan' ? sisi.kanan : sisi.depan;
    const cx = poligon.reduce((n, p) => n + p[0], 0) / poligon.length;
    const cy = poligon.reduce((n, p) => n + p[1], 0) / poligon.length;
    const d = Math.hypot(titik[0] - cx, titik[1] - cy);
    const kena = dalamPoligon(titik, poligon) || d <= toleransi;
    if (kena && d < jarakTerbaik) {
      jarakTerbaik = d;
      terbaik = [t.b, t.k];
    }
  }
  return terbaik;
}
