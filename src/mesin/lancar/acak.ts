/**
 * Pembangkit acak berbenih (mulberry32). Benih yang sama selalu menghasilkan
 * deret yang sama, sehingga lembar bisa dibuat ulang dari benihnya.
 */

export interface Acak {
  /** Bilangan acak 0 ≤ x < 1. */
  berikut(): number;
  /** Bilangan bulat acak min ≤ x ≤ maks. */
  bulat(min: number, maks: number): number;
  /** Satu anggota acak dari daftar (daftar tidak boleh kosong). */
  pilih<T>(daftar: readonly T[]): T;
}

/** Mengubah benih teks menjadi bilangan 32-bit (campuran gaya cyrb). */
function hashBenih(teks: string): number {
  let h1 = 0xdeadbeef ^ teks.length;
  let h2 = 0x41c6ce57 ^ teks.length;
  for (let i = 0; i < teks.length; i++) {
    const c = teks.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

export function buatAcak(benih: string | number): Acak {
  let a = hashBenih(String(benih));
  const berikut = (): number => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    berikut,
    bulat(min, maks) {
      return min + Math.floor(berikut() * (maks - min + 1));
    },
    pilih<T>(daftar: readonly T[]): T {
      if (daftar.length === 0) throw new RangeError('Daftar kosong tidak bisa dipilih.');
      return daftar[Math.floor(berikut() * daftar.length)] as T;
    },
  };
}
