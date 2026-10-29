import { LEVEL_LANCAR } from '../../../mesin/lancar/level';
import { ambilJurus, JURUS, type Jurus } from '../jurus';

// ---------- aritmetika rasional kecil untuk memeriksa langkah ----------
interface Rasional {
  p: bigint;
  q: bigint;
}

const fpb = (a: bigint, b: bigint): bigint => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x === 0n ? 1n : x;
};

function rasional(p: bigint, q: bigint): Rasional {
  if (q === 0n) throw new Error('pembagian dengan nol');
  const s = q < 0n ? -1n : 1n;
  const g = fpb(p, q);
  return { p: (s * p) / g, q: (s * q) / g };
}

const tambah = (a: Rasional, b: Rasional) => rasional(a.p * b.q + b.p * a.q, a.q * b.q);
const kurang = (a: Rasional, b: Rasional) => rasional(a.p * b.q - b.p * a.q, a.q * b.q);
const kali = (a: Rasional, b: Rasional) => rasional(a.p * b.p, a.q * b.q);
const bagi = (a: Rasional, b: Rasional) => rasional(a.p * b.q, a.q * b.p);

/** Bilangan: bulat, desimal berkoma ("0,4"), atau pecahan rapat ("3/4"). */
function bacaBilangan(t: string): Rasional {
  const pecahan = /^(\d+)\/(\d+)$/.exec(t);
  if (pecahan) return rasional(BigInt(pecahan[1] ?? '0'), BigInt(pecahan[2] ?? '1'));
  const [bulat = '0', koma = ''] = t.split(',');
  return rasional(BigInt(bulat + koma), 10n ** BigInt(koma.length));
}

/** Hitung ekspresi dengan + − - × : dan kurung (kali/bagi lebih dulu). */
function hitung(ekspresi: string): Rasional {
  const token = ekspresi.match(/\d+\/\d+|\d+(?:,\d+)?|[+\-−×:()]/g) ?? [];
  if (token.join('') !== ekspresi.replace(/\s+/g, '')) throw new Error(`tidak terbaca: ${ekspresi}`);
  let i = 0;
  const lihat = () => token[i];
  const ambil = () => token[i++];

  const faktor = (): Rasional => {
    const t = ambil();
    if (t === undefined) throw new Error(`ekspresi terpotong: ${ekspresi}`);
    if (t === '(') {
      const v = jumlah();
      if (ambil() !== ')') throw new Error(`kurung tidak ditutup: ${ekspresi}`);
      return v;
    }
    if (t === '-' || t === '−') return kurang(rasional(0n, 1n), faktor());
    if (!/^\d/.test(t)) throw new Error(`token tak terduga "${t}": ${ekspresi}`);
    return bacaBilangan(t);
  };
  const suku = (): Rasional => {
    let v = faktor();
    while (lihat() === '×' || lihat() === ':') v = ambil() === '×' ? kali(v, faktor()) : bagi(v, faktor());
    return v;
  };
  const jumlah = (): Rasional => {
    let v = suku();
    while (lihat() === '+' || lihat() === '-' || lihat() === '−') v = ambil() === '+' ? tambah(v, suku()) : kurang(v, suku());
    return v;
  };

  const hasil = jumlah();
  if (i !== token.length) throw new Error(`sisa token: ${ekspresi}`);
  return hasil;
}

/** Langkah yang diperiksa: hanya angka, operator, kurung, koma, dan "=". */
const BISA_DIHITUNG = /^[\d\s+\-−×:()/,=]+$/;

// ---------- data ----------
const SEMUA: Jurus[] = Object.values(JURUS);
const semuaLangkah = SEMUA.flatMap((j) =>
  j.contoh.flatMap((c, ic) => c.langkah.map((l, il) => ({ kunci: `${j.kelas}-${j.level} contoh ${ic + 1} langkah ${il + 1}`, ...l }))),
);

describe('aritmetika rasional untuk uji', () => {
  it('menghitung dengan benar', () => {
    expect(hitung('3 + 4 × 5')).toEqual(rasional(23n, 1n));
    expect(hitung('(2 + 3) × 4')).toEqual(rasional(20n, 1n));
    expect(hitung('3/4')).toEqual(hitung('75/100'));
    expect(hitung('0,4')).toEqual(rasional(2n, 5n));
    expect(hitung('24 : 6 + 7 − 1')).toEqual(rasional(10n, 1n));
  });
});

describe('isi jurus Lancar', () => {
  it('ada 36 jurus, satu untuk setiap level', () => {
    expect(SEMUA).toHaveLength(36);
    for (const daftar of LEVEL_LANCAR) {
      for (const def of daftar) {
        const j = ambilJurus(def.kelas, def.level);
        expect(j).not.toBeNull();
        expect(j?.kelas).toBe(def.kelas);
        expect(j?.level).toBe(def.level);
      }
    }
    expect(ambilJurus(7, 1)).toBeNull();
    expect(ambilJurus(1, 0)).toBeNull();
  });

  it('bentuk tiap jurus sesuai aturan', () => {
    for (const j of SEMUA) {
      const nama = `${j.kelas}-${j.level}`;
      expect({ nama, status: j.status }).toEqual({ nama, status: 'belum_diperiksa' });
      expect(j.contoh.length).toBeGreaterThanOrEqual(2);
      expect(j.contoh.length).toBeLessThanOrEqual(3);
      expect({ nama, langkahPertama: j.contoh[0]?.langkah.length }).toEqual({ nama, langkahPertama: 3 });
      for (const c of j.contoh) {
        expect(c.langkah.length).toBeGreaterThanOrEqual(2);
        expect(c.langkah.length).toBeLessThanOrEqual(3);
      }
      expect(j.inti).toMatch(/\.$/);
      expect(j.ingat).toMatch(/[.?]$/);
      expect(j.inti.length).toBeLessThanOrEqual(70);
    }
  });

  it('langkah pendek, sorot dan hasil ada di teks', () => {
    for (const l of semuaLangkah) {
      expect({ kunci: l.kunci, panjang: l.teks.length <= 22 }).toEqual({ kunci: l.kunci, panjang: true });
      if (l.sorot !== undefined) expect({ kunci: l.kunci, ada: l.teks.includes(l.sorot) }).toEqual({ kunci: l.kunci, ada: true });
      if (l.hasil !== undefined) expect({ kunci: l.kunci, ada: l.teks.includes(l.hasil) }).toEqual({ kunci: l.kunci, ada: true });
      expect(l.teks).not.toMatch(/[[\]{}]/);
    }
  });

  it('tidak memakai lambang ÷ atau *', () => {
    const semuaTeks = JSON.stringify(JURUS);
    expect(semuaTeks).not.toContain('÷');
    expect(semuaTeks).not.toContain('*');
  });

  it('setiap persamaan angka dihitung ulang dan benar', () => {
    let diperiksa = 0;
    for (const l of semuaLangkah) {
      if (!l.teks.includes('=') || !BISA_DIHITUNG.test(l.teks)) continue;
      const sisi = l.teks.split('=').map((s) => hitung(s.trim()));
      for (const s of sisi.slice(1)) expect({ kunci: l.kunci, teks: l.teks, nilai: s }).toEqual({ kunci: l.kunci, teks: l.teks, nilai: sisi[0] });
      diperiksa++;
    }
    expect(diperiksa).toBeGreaterThan(60);
  });
});
