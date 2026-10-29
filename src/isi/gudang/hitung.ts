/**
 * Aritmetika rasional sendiri untuk memeriksa kunci Matematika (CLAUDE.md aturan 10).
 *
 * - `hitungEkspresi("3/4 * 120")` menghitung ekspresi `hitung` di data soal secara eksak.
 * - `bacaBilangan("Rp26.000")` membaca bilangan di awal teks kunci (tulisan Indonesia).
 *
 * Fungsi murni, tanpa `eval`.
 */

export interface Rasional {
  /** pembilang (bisa negatif) */
  p: bigint;
  /** penyebut, selalu > 0 */
  q: bigint;
}

const NOL = BigInt(0);
const SATU = BigInt(1);
const DUA = BigInt(2);

function mutlak(x: bigint): bigint {
  return x < NOL ? -x : x;
}

function fpbBulat(a: bigint, b: bigint): bigint {
  let x = mutlak(a);
  let y = mutlak(b);
  while (y !== NOL) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function rasional(p: bigint, q: bigint = SATU): Rasional {
  if (q === NOL) throw new Error('Pembagian dengan nol');
  const tanda = q < NOL ? -SATU : SATU;
  const f = fpbBulat(p, q) || SATU;
  return { p: (tanda * p) / f, q: (tanda * q) / f };
}

export const tambah = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.q + b.p * a.q, a.q * b.q);
export const kurang = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.q - b.p * a.q, a.q * b.q);
export const kali = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.p, a.q * b.q);
export const bagi = (a: Rasional, b: Rasional): Rasional => rasional(a.p * b.q, a.q * b.p);
export const sama = (a: Rasional, b: Rasional): boolean => a.p === b.p && a.q === b.q;
const banding = (a: Rasional, b: Rasional): number => {
  const s = a.p * b.q - b.p * a.q;
  return s < NOL ? -1 : s > NOL ? 1 : 0;
};

/** Teks pecahan sederhana untuk pesan uji, misal "3/4" atau "12". */
export function teksRasional(r: Rasional): string {
  return r.q === SATU ? r.p.toString() : `${r.p}/${r.q}`;
}

function bulatSaja(r: Rasional, nama: string): bigint {
  if (r.q !== SATU) throw new Error(`${nama} hanya untuk bilangan bulat`);
  return r.p;
}

function akarBulat(n: bigint, pangkat: number): bigint {
  if (n < NOL) throw new Error('Akar bilangan negatif');
  // cari bilangan bulat k dengan k^pangkat = n
  let bawah = NOL;
  let atas = n + SATU;
  const pangkatkan = (k: bigint): bigint => {
    let h = SATU;
    for (let i = 0; i < pangkat; i++) h *= k;
    return h;
  };
  while (atas - bawah > SATU) {
    const tengah = (bawah + atas) / DUA;
    if (pangkatkan(tengah) <= n) bawah = tengah;
    else atas = tengah;
  }
  if (pangkatkan(bawah) !== n) throw new Error(`Akar pangkat ${pangkat} dari ${n} tidak bulat`);
  return bawah;
}

type FungsiHitung = (arg: Rasional[]) => Rasional;

const FUNGSI: Record<string, FungsiHitung> = {
  fpb: (a) => rasional(a.map((x) => bulatSaja(x, 'fpb')).reduce((x, y) => fpbBulat(x, y))),
  kpk: (a) =>
    rasional(
      a
        .map((x) => bulatSaja(x, 'kpk'))
        .reduce((x, y) => mutlak(x * y) / fpbBulat(x, y)),
    ),
  /** bulat(x, k): bulatkan x ke kelipatan k terdekat; setengah dibulatkan ke atas */
  bulat: ([x, k]) => {
    if (!x || !k || k.p <= NOL) throw new Error('bulat(x, k) perlu dua argumen, k > 0');
    const hasilBagi = bagi(x, k);
    const geser = tambah(hasilBagi, rasional(SATU, DUA));
    // lantai dari geser
    let lantai = geser.p / geser.q;
    if (geser.p < NOL && geser.p % geser.q !== NOL) lantai -= SATU;
    return kali(rasional(lantai), k);
  },
  akar2: ([x]) => {
    if (!x) throw new Error('akar2 perlu satu argumen');
    return rasional(akarBulat(bulatSaja(x, 'akar2'), 2));
  },
  akar3: ([x]) => {
    if (!x) throw new Error('akar3 perlu satu argumen');
    return rasional(akarBulat(bulatSaja(x, 'akar3'), 3));
  },
  maks: (a) => a.reduce((x, y) => (banding(x, y) >= 0 ? x : y)),
  min: (a) => a.reduce((x, y) => (banding(x, y) <= 0 ? x : y)),
  banyakfaktor: ([x]) => {
    if (!x) throw new Error('banyakfaktor perlu satu argumen');
    const n = bulatSaja(x, 'banyakfaktor');
    let jumlah = NOL;
    for (let d = SATU; d <= n; d += SATU) if (n % d === NOL) jumlah += SATU;
    return rasional(jumlah);
  },
};

type Token =
  | { j: 'angka'; nilai: Rasional }
  | { j: 'nama'; nama: string }
  | { j: 'tanda'; t: string };

function pecahToken(teks: string): Token[] {
  const hasil: Token[] = [];
  let i = 0;
  while (i < teks.length) {
    const c = teks.charAt(i);
    if (c === ' ') {
      i++;
      continue;
    }
    const angka = /^\d+(\.\d+)?/.exec(teks.slice(i));
    if (angka) {
      const [bulat, desimal = ''] = angka[0].split('.');
      const q = BigInt(10) ** BigInt(desimal.length);
      hasil.push({ j: 'angka', nilai: rasional(BigInt(bulat + desimal), q) });
      i += angka[0].length;
      continue;
    }
    const nama = /^[a-z][a-z0-9]*/.exec(teks.slice(i));
    if (nama) {
      hasil.push({ j: 'nama', nama: nama[0] });
      i += nama[0].length;
      continue;
    }
    if ('+-*/(),'.includes(c)) {
      hasil.push({ j: 'tanda', t: c });
      i++;
      continue;
    }
    throw new Error(`Huruf tidak dikenal "${c}" di "${teks}"`);
  }
  return hasil;
}

/** Hitung ekspresi secara eksak. Melempar galat bila ekspresi tidak sah. */
export function hitungEkspresi(teks: string): Rasional {
  const token = pecahToken(teks);
  let pos = 0;
  const lihat = (): Token | undefined => token[pos];
  const tandaIni = (t: string): boolean => {
    const k = lihat();
    return k !== undefined && k.j === 'tanda' && k.t === t;
  };
  const harus = (t: string): void => {
    if (!tandaIni(t)) throw new Error(`Diharapkan "${t}" di "${teks}"`);
    pos++;
  };

  const ekspr = (): Rasional => {
    let kiri = suku();
    while (tandaIni('+') || tandaIni('-')) {
      const plus = tandaIni('+');
      pos++;
      const kanan = suku();
      kiri = plus ? tambah(kiri, kanan) : kurang(kiri, kanan);
    }
    return kiri;
  };
  const suku = (): Rasional => {
    let kiri = faktor();
    while (tandaIni('*') || tandaIni('/')) {
      const kaliIni = tandaIni('*');
      pos++;
      const kanan = faktor();
      kiri = kaliIni ? kali(kiri, kanan) : bagi(kiri, kanan);
    }
    return kiri;
  };
  const faktor = (): Rasional => {
    const k = lihat();
    if (k === undefined) throw new Error(`Ekspresi terputus: "${teks}"`);
    if (k.j === 'tanda' && k.t === '-') {
      pos++;
      return kurang(rasional(NOL), faktor());
    }
    if (k.j === 'angka') {
      pos++;
      return k.nilai;
    }
    if (k.j === 'nama') {
      const f = FUNGSI[k.nama];
      if (!f) throw new Error(`Fungsi tidak dikenal "${k.nama}"`);
      pos++;
      harus('(');
      const arg: Rasional[] = [ekspr()];
      while (tandaIni(',')) {
        pos++;
        arg.push(ekspr());
      }
      harus(')');
      return f(arg);
    }
    if (k.t === '(') {
      pos++;
      const isi = ekspr();
      harus(')');
      return isi;
    }
    throw new Error(`Tanda "${k.t}" tidak pada tempatnya di "${teks}"`);
  };

  const hasil = ekspr();
  if (pos !== token.length) throw new Error(`Sisa ekspresi tidak terbaca di "${teks}"`);
  return hasil;
}

function bilanganId(teks: string): Rasional {
  // "2.400" (titik ribuan), "0,75" (koma desimal), "-3"
  const negatif = teks.startsWith('-');
  const isi = negatif ? teks.slice(1) : teks;
  const [bulat, desimal = ''] = isi.replace(/\./g, '').split(',');
  const r = rasional(BigInt(bulat + desimal), BigInt(10) ** BigInt(desimal.length));
  return negatif ? kurang(rasional(NOL), r) : r;
}

const POLA_BULAT = '-?(?:\\d{1,3}(?:\\.\\d{3})+|\\d+)(?:,\\d+)?';
const POLA_CAMPURAN = new RegExp(`^(-?\\d+) (\\d+)/(\\d+)`);
const POLA_PECAHAN = new RegExp(`^(-?\\d+)/(\\d+)`);
const POLA_RASIO = new RegExp(`^(${POLA_BULAT}) : (${POLA_BULAT})`);
const POLA_DESIMAL = new RegExp(`^(${POLA_BULAT})`);

export interface BilanganTerbaca {
  nilai: Rasional;
  /** teks sesudah bilangan, misal " cm²" atau "%" */
  sisa: string;
}

/**
 * Baca bilangan di awal teks kunci atau pilihan. Bentuk yang dikenal:
 * campuran "3 3/4", pecahan "3/4", rasio "2 : 3" (dibaca 2/3), bilangan "2.400" / "0,75",
 * boleh diawali "Rp". Sisa teks harus kosong, satuan sesudah spasi, atau "%" / "°".
 * Mengembalikan null bila teks tidak diawali bilangan yang sah.
 */
export function bacaBilangan(teksAsli: string): BilanganTerbaca | null {
  const teks = teksAsli.trim().replace(/^Rp/, '');
  const coba: [RegExp, (m: RegExpExecArray) => Rasional][] = [
    [POLA_CAMPURAN, (m) => {
      const utuh = BigInt(m[1]);
      const pecah = rasional(BigInt(m[2]), BigInt(m[3]));
      return utuh < NOL ? kurang(rasional(utuh), pecah) : tambah(rasional(utuh), pecah);
    }],
    [POLA_PECAHAN, (m) => rasional(BigInt(m[1]), BigInt(m[2]))],
    [POLA_RASIO, (m) => bagi(bilanganId(m[1]), bilanganId(m[2]))],
    [POLA_DESIMAL, (m) => bilanganId(m[1])],
  ];
  for (const [pola, ubah] of coba) {
    const m = pola.exec(teks);
    if (!m) continue;
    const sisa = teks.slice(m[0].length);
    if (sisa !== '' && !/^( \S|%|°)/.test(sisa)) return null;
    return { nilai: ubah(m), sisa };
  }
  return null;
}
