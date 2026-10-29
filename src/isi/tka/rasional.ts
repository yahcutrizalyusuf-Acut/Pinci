/**
 * Bilangan rasional tepat (pembilang/penyebut BigInt) untuk pemeriksa kunci TKA.
 * Dipakai supaya hitungan pecahan dan desimal tidak terkena galat pembulatan komputer
 * (sama dengan `Fraction` di `_alat/periksa.py`).
 */

const NOL = BigInt(0);
const SATU = BigInt(1);
const DUA = BigInt(2);
const SEPULUH = BigInt(10);

export interface Rasional {
  readonly p: bigint;
  /** selalu positif */
  readonly q: bigint;
}

function mutlakBig(a: bigint): bigint {
  return a < NOL ? -a : a;
}

export function fpbBig(a: bigint, b: bigint): bigint {
  let x = mutlakBig(a);
  let y = mutlakBig(b);
  while (y !== NOL) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function buatRasional(p: bigint, q: bigint = SATU): Rasional {
  if (q === NOL) throw new Error('pembagian dengan nol');
  if (q < NOL) {
    p = -p;
    q = -q;
  }
  const g = fpbBig(p, q);
  return g > SATU ? { p: p / g, q: q / g } : { p, q };
}

export function dariBulat(n: number | bigint): Rasional {
  return { p: BigInt(n), q: SATU };
}

/** "0.75", "3,5", "12", "-2.25" → rasional tepat. Mengembalikan null kalau bukan angka desimal. */
export function dariDesimal(teks: string): Rasional | null {
  const t = teks.trim().replace(',', '.');
  const m = /^([+-]?)(\d*)(?:\.(\d+))?$/.exec(t);
  if (!m || (m[2] === '' && m[3] === undefined)) return null;
  const tanda = m[1] === '-' ? -SATU : SATU;
  const bulat = m[2] === '' ? '0' : m[2];
  const pecahan = m[3] ?? '';
  const q = SEPULUH ** BigInt(pecahan.length);
  return buatRasional(tanda * BigInt(bulat + pecahan), q);
}

export const tambah = (a: Rasional, b: Rasional): Rasional => buatRasional(a.p * b.q + b.p * a.q, a.q * b.q);
export const kurang = (a: Rasional, b: Rasional): Rasional => buatRasional(a.p * b.q - b.p * a.q, a.q * b.q);
export const kali = (a: Rasional, b: Rasional): Rasional => buatRasional(a.p * b.p, a.q * b.q);
export const bagi = (a: Rasional, b: Rasional): Rasional => {
  if (b.p === NOL) throw new Error('pembagian dengan nol');
  return buatRasional(a.p * b.q, a.q * b.p);
};
export const negatif = (a: Rasional): Rasional => ({ p: -a.p, q: a.q });
export const mutlak = (a: Rasional): Rasional => ({ p: mutlakBig(a.p), q: a.q });

/** pembulatan ke bawah (seperti `//` Python) */
export function lantai(a: Rasional): Rasional {
  let h = a.p / a.q;
  if (a.p % a.q !== NOL && a.p < NOL) h -= SATU;
  return { p: h, q: SATU };
}

export const bagiBulat = (a: Rasional, b: Rasional): Rasional => lantai(bagi(a, b));
export const sisaBagi = (a: Rasional, b: Rasional): Rasional => kurang(a, kali(b, bagiBulat(a, b)));

export function pangkat(a: Rasional, n: Rasional): Rasional {
  if (n.q !== SATU) throw new Error('pangkat harus bilangan bulat');
  const e = n.p;
  if (e >= NOL) return buatRasional(a.p ** e, a.q ** e);
  return buatRasional(a.q ** -e, a.p ** -e);
}

/** -1, 0, 1 */
export function banding(a: Rasional, b: Rasional): number {
  const s = a.p * b.q - b.p * a.q;
  return s === NOL ? 0 : s < NOL ? -1 : 1;
}

export const samaDengan = (a: Rasional, b: Rasional): boolean => a.p === b.p && a.q === b.q;
export const adalahBulat = (a: Rasional): boolean => a.q === SATU;

/**
 * Pembulatan seperti `round(x, n)` Python 3: setengah dibulatkan ke genap terdekat.
 * n boleh negatif (round(4672, -2) = 4700).
 */
export function bulatkan(a: Rasional, n = 0): Rasional {
  const skala = n >= 0 ? buatRasional(SEPULUH ** BigInt(n)) : buatRasional(SATU, SEPULUH ** BigInt(-n));
  const x = kali(a, skala);
  const bawah = lantai(x);
  const sisa = kurang(x, bawah);
  const setengah = buatRasional(SATU, DUA);
  const c = banding(sisa, setengah);
  let hasil = bawah;
  if (c > 0 || (c === 0 && bawah.p % DUA !== NOL)) hasil = tambah(bawah, dariBulat(1));
  return bagi(hasil, skala);
}

export function fpbRasional(a: Rasional, b: Rasional): Rasional {
  if (!adalahBulat(a) || !adalahBulat(b)) throw new Error('FPB hanya untuk bilangan bulat');
  return dariBulat(fpbBig(a.p, b.p));
}

export function kpkRasional(a: Rasional, b: Rasional): Rasional {
  if (!adalahBulat(a) || !adalahBulat(b)) throw new Error('KPK hanya untuk bilangan bulat');
  if (a.p === NOL || b.p === NOL) return dariBulat(0);
  return dariBulat(mutlakBig((a.p / fpbBig(a.p, b.p)) * b.p));
}

/** Tulisan ringkas: "3/4", "12", "-5/2". */
export function keTeks(a: Rasional): string {
  return a.q === SATU ? a.p.toString() : `${a.p.toString()}/${a.q.toString()}`;
}
