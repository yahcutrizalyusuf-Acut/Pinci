/**
 * Rekaman suara Inggris yang dibawa di aplikasi (assets/suara/en/<kunci>.mp3).
 * Nama berkas diturunkan dari teks ucapannya, jadi teks yang diubah otomatis butuh rekaman baru.
 */
import type { PaketInggris } from '../inggris/jenis';

/** Rapikan teks sebelum dicari: spasi berlebih dibuang, huruf kecil. */
export function rapikanUcapan(teks: string): string {
  return teks.replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Kunci pendek dan tetap (FNV-1a 32-bit) dari teks ucapan. */
export function kunciUcapan(teks: string): string {
  let h = 0x811c9dc5;
  for (const c of rapikanUcapan(teks)) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Semua ucapan Inggris yang bisa diputar aplikasi: kosakata, pola, dengar, dan susun kalimat. */
export function daftarUcapan(paket: readonly PaketInggris[]): { kunci: string; teks: string }[] {
  const hasil = new Map<string, string>();
  const tambah = (t: string) => {
    if (t.trim()) hasil.set(kunciUcapan(t), t.replace(/\s+/g, ' ').trim());
  };
  for (const p of paket) {
    for (const u of p.unit) {
      u.kosakata.forEach((k) => tambah(k.kata));
      u.pola.forEach((k) => tambah(k.kalimat));
      u.dengar.forEach((k) => tambah(k.ucapan));
      u.susun.forEach((k) => tambah(k.kalimat));
    }
  }
  return [...hasil].map(([kunci, teks]) => ({ kunci, teks })).sort((a, b) => a.kunci.localeCompare(b.kunci));
}
