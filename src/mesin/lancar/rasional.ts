/**
 * Aritmetika bilangan rasional kecil (pembilang/penyebut bilangan bulat).
 * Dipakai oleh pencocok jawaban dan pemeriksa kunci.
 */

export interface Rasional {
  /** Pembilang (boleh negatif). */
  readonly p: number;
  /** Penyebut, selalu > 0. Pecahan selalu dalam bentuk paling sederhana. */
  readonly q: number;
}

export function fpb(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function rasional(p: number, q = 1): Rasional {
  if (q === 0) throw new RangeError('Penyebut tidak boleh nol.');
  if (!Number.isSafeInteger(p) || !Number.isSafeInteger(q)) throw new RangeError('Di luar jangkauan bilangan bulat aman.');
  const tanda = q < 0 ? -1 : 1;
  const g = fpb(p, q) || 1;
  return { p: (tanda * p) / g, q: (tanda * q) / g };
}

export const tambah = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.q + b.p * a.q, a.q * b.q);
export const kurang = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.q - b.p * a.q, a.q * b.q);
export const kali = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.p, a.q * b.q);
export const bagi = (a: Rasional, b: Rasional): Rasional => {
  if (b.p === 0) throw new RangeError('Pembagian dengan nol.');
  return rasional(a.p * b.q, a.q * b.p);
};
export const samaDengan = (a: Rasional, b: Rasional): boolean => a.p === b.p && a.q === b.q;
export const bulat = (a: Rasional): boolean => a.q === 1;

/**
 * Mengurai teks angka: "12", "0,25", ",5", "0.5", "3/4". Spasi diabaikan.
 * Mengembalikan `null` bila bukan angka yang sah.
 */
export function uraiAngka(teks: string): Rasional | null {
  const t = teks.replace(/\s+/g, '').replace(/\./g, ',');
  const pecahan = /^(\d+)\/(\d+)$/.exec(t);
  if (pecahan) {
    const q = Number(pecahan[2]);
    if (q === 0) return null;
    return rasional(Number(pecahan[1]), q);
  }
  const desimal = /^(\d*)(?:,(\d*))?$/.exec(t);
  if (!desimal) return null;
  const utuh = desimal[1] ?? '';
  const pecah = desimal[2] ?? '';
  if (utuh.length + pecah.length === 0) return null;
  if (pecah.length > 12) return null;
  const q = 10 ** pecah.length;
  return rasional(Number(utuh || '0') * q + Number(pecah || '0'), q);
}

/**
 * Menulis bilangan rasional sebagai desimal berkoma tanpa nol di belakang
 * (mis. 1/4 → "0,25", 3 → "3"). `null` bila desimalnya tidak berhenti.
 */
export function keTeksDesimal(r: Rasional): string | null {
  const negatif = r.p < 0;
  let sisa = Math.abs(r.p) % r.q;
  const utuh = Math.floor(Math.abs(r.p) / r.q);
  let angka = '';
  for (let i = 0; i < 12 && sisa !== 0; i++) {
    sisa *= 10;
    angka += String(Math.floor(sisa / r.q));
    sisa %= r.q;
  }
  if (sisa !== 0) return null;
  return (negatif ? '-' : '') + String(utuh) + (angka ? ',' + angka : '');
}

/** Menulis bilangan rasional sebagai "p/q" paling sederhana (bilangan bulat ditulis tanpa "/"). */
export function keTeksPecahan(r: Rasional): string {
  return r.q === 1 ? String(r.p) : `${r.p}/${r.q}`;
}
