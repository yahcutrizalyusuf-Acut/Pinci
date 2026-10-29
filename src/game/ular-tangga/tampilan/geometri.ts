/**
 * Geometri papan G04 dalam satuan petak (1 = lebar satu petak), supaya tidak bergantung ukuran layar.
 * Mengikuti desain G04: petak 1 di pojok kiri atas, 100 di kanan bawah, angka kiri → kanan di setiap baris
 * (baris = `koordinatPetak(n).baris`, digambar dari atas).
 */
import { koordinatPetak, type Pemain } from '../logika';

export interface Titik {
  x: number;
  y: number;
}

/** Empat titik kurva Bézier kubik sebuah sulur (satuan petak). */
export interface KurvaSulur {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

export const UKURAN_PAPAN_MAKS = 328;

/** Titik tengah petak n. */
export function pusatPetak(n: number): Titik {
  const { baris, kolom } = koordinatPetak(n);
  return { x: kolom + 0.5, y: baris + 0.5 };
}

/** Geser pion di dalam petak: anak di kiri bawah, Pinci di kanan bawah (seperti desain). */
export const GESER_PION: Record<Pemain, Titik> = {
  anak: { x: -0.2, y: 0.14 },
  pinci: { x: 0.22, y: 0.16 },
};

const batas = (v: number) => Math.min(9.85, Math.max(0.15, v));

/** Sulur melengkung seperti huruf S dari petak `bawah` ke petak `atas`. */
export function kurvaSulur(bawah: number, atas: number): KurvaSulur {
  const a = pusatPetak(bawah);
  const b = pusatPetak(atas);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const panjang = Math.max(0.001, Math.hypot(dx, dy));
  const lebar = Math.min(1, panjang * 0.3);
  const nx = (-dy / panjang) * lebar;
  const ny = (dx / panjang) * lebar;
  return {
    x0: a.x,
    y0: a.y,
    x1: batas(a.x + dx * 0.33 + nx),
    y1: batas(a.y + dy * 0.33 + ny),
    x2: batas(a.x + dx * 0.66 - nx),
    y2: batas(a.y + dy * 0.66 - ny),
    x3: b.x,
    y3: b.y,
  };
}

/** Titik pada kurva di t (0–1). Dipakai juga di utas gerak (worklet). */
export function titikKurva(k: KurvaSulur, t: number): Titik {
  'worklet';
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * k.x0 + b * k.x1 + c * k.x2 + d * k.x3,
    y: a * k.y0 + b * k.y1 + c * k.y2 + d * k.y3,
  };
}

/** Atribut `d` path SVG untuk sulur, dalam piksel. */
export function jalurSvg(k: KurvaSulur, petak: number): string {
  const p = (v: number) => (v * petak).toFixed(1);
  return `M${p(k.x0)} ${p(k.y0)} C ${p(k.x1)} ${p(k.y1)}, ${p(k.x2)} ${p(k.y2)}, ${p(k.x3)} ${p(k.y3)}`;
}
