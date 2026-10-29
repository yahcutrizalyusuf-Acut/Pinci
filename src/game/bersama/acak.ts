/**
 * Pembangkit acak berbenih untuk semua game.
 * Memakai algoritme mulberry32: cepat, kecil, dan hasilnya sama untuk benih yang sama,
 * jadi setiap babak bisa diulang persis di dalam uji.
 *
 * Keadaan game menyimpan `benihAcak` (angka). Fungsi `langkah` membuat pembangkit dari
 * angka itu, memakainya, lalu menyimpan `keadaan` pembangkit yang baru. Dengan begitu
 * `langkah` tetap fungsi murni.
 */
export class PembangkitAcak {
  private s: number;

  constructor(benih: number) {
    this.s = benih >>> 0;
  }

  /** Angka keadaan pembangkit saat ini, untuk disimpan di keadaan game. */
  get keadaan(): number {
    return this.s;
  }

  /** Bilangan acak 0 ≤ x < 1. */
  berikut(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Bilangan bulat acak dari `min` sampai `maks` (keduanya termasuk). */
  bulat(min: number, maks: number): number {
    return min + Math.floor(this.berikut() * (maks - min + 1));
  }

  /** `true` dengan peluang `p` (0–1). */
  peluang(p: number): boolean {
    return this.berikut() < p;
  }

  /** Satu unsur acak dari daftar yang tidak kosong. */
  pilih<T>(daftar: readonly T[]): T {
    if (daftar.length === 0) throw new Error('Daftar kosong tidak bisa dipilih.');
    return daftar[Math.floor(this.berikut() * daftar.length)];
  }

  /** Salinan daftar dengan urutan diacak (Fisher–Yates). */
  acakUrutan<T>(daftar: readonly T[]): T[] {
    const hasil = daftar.slice();
    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(this.berikut() * (i + 1));
      const tmp = hasil[i];
      hasil[i] = hasil[j];
      hasil[j] = tmp;
    }
    return hasil;
  }

  /** `n` unsur berbeda (berdasarkan posisi) dari daftar, urutan acak. */
  ambilBeberapa<T>(daftar: readonly T[], n: number): T[] {
    return this.acakUrutan(daftar).slice(0, Math.min(n, daftar.length));
  }
}

/** Membuat pembangkit dari benih. */
export function buatAcak(benih: number): PembangkitAcak {
  return new PembangkitAcak(benih);
}

/** Mengubah benih apa pun (mis. Date.now()) menjadi benih 32 bit. */
export function rapikanBenih(benih: number): number {
  return Math.abs(Math.floor(benih)) >>> 0;
}
