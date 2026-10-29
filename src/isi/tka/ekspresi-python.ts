/**
 * Penilai ekspresi baris `Periksa` dari bahan TKA.
 *
 * Bahan menulis baris Periksa sebagai ekspresi Python kecil (lihat `04-standar-soal.md` 3.4),
 * misalnya `lcm(6, 8) == 24` atau `F(3,4) / F(1,8) == 6`. Modul ini meniru `jalankan_periksa`
 * di `_alat/periksa.py` tanpa menjalankan Python: ekspresinya diurai sendiri lalu dihitung
 * dengan bilangan rasional tepat. Yang didukung hanya bagian Python yang dipakai bahan:
 * `+ - * / // % **`, kurung, daftar/tupel, indeks, perbandingan berantai, `and`/`or`/`not`, `in`,
 * pemahaman daftar sederhana (`1 for x in [..] if x > 30`), dan fungsi
 * F, gcd, lcm, sum, min, max, abs, round, len, all, any, sorted.
 */
import {
  bagi,
  bagiBulat,
  banding,
  bulatkan,
  dariBulat,
  dariDesimal,
  fpbRasional,
  kali,
  keTeks,
  kpkRasional,
  kurang,
  mutlak,
  negatif,
  pangkat,
  samaDengan,
  sisaBagi,
  tambah,
  type Rasional,
} from './rasional';

export type Nilai =
  | { t: 'angka'; v: Rasional }
  | { t: 'bool'; v: boolean }
  | { t: 'teks'; v: string }
  | { t: 'daftar'; v: Nilai[] };

type Token = { j: 'angka' | 'teks' | 'nama' | 'op'; s: string };

type Simpul =
  | { k: 'angka'; v: Rasional }
  | { k: 'teks'; v: string }
  | { k: 'nama'; n: string }
  | { k: 'daftar'; isi: Simpul[] }
  | { k: 'pahami'; elemen: Simpul; variabel: string; sumber: Simpul; syarat: Simpul | null }
  | { k: 'panggil'; n: string; arg: Simpul[] }
  | { k: 'indeks'; obj: Simpul; i: Simpul }
  | { k: 'tunggal'; op: string; x: Simpul }
  | { k: 'biner'; op: string; a: Simpul; b: Simpul }
  | { k: 'banding'; ops: string[]; xs: Simpul[] }
  | { k: 'dan' | 'atau'; a: Simpul; b: Simpul }
  | { k: 'bukan'; x: Simpul };

const OPERATOR = ['**', '//', '==', '!=', '<=', '>=', '<', '>', '+', '-', '*', '/', '%', '(', ')', '[', ']', ','];

function pecahToken(kode: string): Token[] {
  const hasil: Token[] = [];
  let i = 0;
  while (i < kode.length) {
    const c = kode[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const angka = /^\d+(?:\.\d+)?/.exec(kode.slice(i));
    if (angka) {
      hasil.push({ j: 'angka', s: angka[0] });
      i += angka[0].length;
      continue;
    }
    if (c === "'" || c === '"') {
      const akhir = kode.indexOf(c, i + 1);
      if (akhir < 0) throw new Error('tanda kutip tidak ditutup');
      hasil.push({ j: 'teks', s: kode.slice(i + 1, akhir) });
      i = akhir + 1;
      continue;
    }
    const nama = /^[A-Za-z_][A-Za-z_0-9]*/.exec(kode.slice(i));
    if (nama) {
      hasil.push({ j: 'nama', s: nama[0] });
      i += nama[0].length;
      continue;
    }
    const op = OPERATOR.find((o) => kode.startsWith(o, i));
    if (!op) throw new Error(`lambang tidak dikenal: ${c}`);
    hasil.push({ j: 'op', s: op });
    i += op.length;
  }
  return hasil;
}

class Pengurai {
  private i = 0;
  constructor(private readonly t: Token[]) {}

  private lihat(geser = 0): Token | undefined {
    return this.t[this.i + geser];
  }
  private adalah(s: string, geser = 0): boolean {
    const tk = this.lihat(geser);
    return tk !== undefined && (tk.j === 'op' || tk.j === 'nama') && tk.s === s;
  }
  private makan(s: string): void {
    if (!this.adalah(s)) throw new Error(`diharapkan '${s}'`);
    this.i++;
  }

  urai(): Simpul {
    const s = this.atau();
    if (this.i < this.t.length) throw new Error(`sisa token: ${this.t[this.i].s}`);
    return s;
  }

  private atau(): Simpul {
    let a = this.dan();
    while (this.adalah('or')) {
      this.i++;
      a = { k: 'atau', a, b: this.dan() };
    }
    return a;
  }
  private dan(): Simpul {
    let a = this.bukan();
    while (this.adalah('and')) {
      this.i++;
      a = { k: 'dan', a, b: this.bukan() };
    }
    return a;
  }
  private bukan(): Simpul {
    if (this.adalah('not')) {
      this.i++;
      return { k: 'bukan', x: this.bukan() };
    }
    return this.perbandingan();
  }
  private perbandingan(): Simpul {
    const xs = [this.aritmetika()];
    const ops: string[] = [];
    for (;;) {
      const tk = this.lihat();
      if (!tk) break;
      if (tk.j === 'op' && ['==', '!=', '<', '>', '<=', '>='].includes(tk.s)) {
        this.i++;
        ops.push(tk.s);
      } else if (this.adalah('in')) {
        this.i++;
        ops.push('in');
      } else if (this.adalah('not') && this.adalah('in', 1)) {
        this.i += 2;
        ops.push('not in');
      } else break;
      xs.push(this.aritmetika());
    }
    return ops.length === 0 ? xs[0] : { k: 'banding', ops, xs };
  }
  private aritmetika(): Simpul {
    let a = this.suku();
    while (this.adalah('+') || this.adalah('-')) {
      const op = this.t[this.i++].s;
      a = { k: 'biner', op, a, b: this.suku() };
    }
    return a;
  }
  private suku(): Simpul {
    let a = this.faktor();
    while (this.adalah('*') || this.adalah('/') || this.adalah('//') || this.adalah('%')) {
      const op = this.t[this.i++].s;
      a = { k: 'biner', op, a, b: this.faktor() };
    }
    return a;
  }
  private faktor(): Simpul {
    if (this.adalah('-') || this.adalah('+')) {
      const op = this.t[this.i++].s;
      return { k: 'tunggal', op, x: this.faktor() };
    }
    const dasar = this.belakang();
    if (this.adalah('**')) {
      this.i++;
      return { k: 'biner', op: '**', a: dasar, b: this.faktor() };
    }
    return dasar;
  }
  private belakang(): Simpul {
    let x = this.atom();
    for (;;) {
      if (this.adalah('[')) {
        this.i++;
        const i = this.atau();
        this.makan(']');
        x = { k: 'indeks', obj: x, i };
      } else if (this.adalah('(') && x.k === 'nama') {
        this.i++;
        const arg = this.daftarIsi(')');
        x = { k: 'panggil', n: x.n, arg: arg.isi.length === 1 && arg.pahami ? [arg.pahami] : arg.isi };
      } else break;
    }
    return x;
  }
  /** isi di antara kurung: beberapa ekspresi dipisah koma, atau satu pemahaman daftar */
  private daftarIsi(tutup: string): { isi: Simpul[]; pahami: Simpul | null; adaKoma: boolean } {
    const isi: Simpul[] = [];
    let adaKoma = false;
    if (this.adalah(tutup)) {
      this.i++;
      return { isi, pahami: null, adaKoma };
    }
    const pertama = this.atau();
    if (this.adalah('for')) {
      this.i++;
      const v = this.lihat();
      if (!v || v.j !== 'nama') throw new Error('nama variabel diharapkan');
      this.i++;
      this.makan('in');
      const sumber = this.atau();
      let syarat: Simpul | null = null;
      if (this.adalah('if')) {
        this.i++;
        syarat = this.atau();
      }
      this.makan(tutup);
      const p: Simpul = { k: 'pahami', elemen: pertama, variabel: v.s, sumber, syarat };
      return { isi: [p], pahami: p, adaKoma };
    }
    isi.push(pertama);
    while (this.adalah(',')) {
      adaKoma = true;
      this.i++;
      if (this.adalah(tutup)) break;
      isi.push(this.atau());
    }
    this.makan(tutup);
    return { isi, pahami: null, adaKoma };
  }
  private atom(): Simpul {
    const tk = this.lihat();
    if (!tk) throw new Error('ekspresi terpotong');
    if (tk.j === 'angka') {
      this.i++;
      const r = dariDesimal(tk.s);
      if (!r) throw new Error(`angka tidak sah: ${tk.s}`);
      return { k: 'angka', v: r };
    }
    if (tk.j === 'teks') {
      this.i++;
      return { k: 'teks', v: tk.s };
    }
    if (tk.j === 'nama') {
      this.i++;
      return { k: 'nama', n: tk.s };
    }
    if (tk.s === '(') {
      this.i++;
      const r = this.daftarIsi(')');
      if (r.pahami) return r.pahami;
      if (r.isi.length === 1 && !r.adaKoma) return r.isi[0];
      return { k: 'daftar', isi: r.isi };
    }
    if (tk.s === '[') {
      this.i++;
      const r = this.daftarIsi(']');
      return r.pahami ?? { k: 'daftar', isi: r.isi };
    }
    throw new Error(`token tak terduga: ${tk.s}`);
  }
}

function keAngka(n: Nilai): Rasional {
  if (n.t === 'angka') return n.v;
  if (n.t === 'bool') return dariBulat(n.v ? 1 : 0);
  throw new Error('bukan angka');
}

function benar(n: Nilai): boolean {
  switch (n.t) {
    case 'bool':
      return n.v;
    case 'angka':
      return n.v.p !== BigInt(0);
    case 'teks':
      return n.v.length > 0;
    case 'daftar':
      return n.v.length > 0;
  }
}

function sama(a: Nilai, b: Nilai): boolean {
  if (a.t === 'daftar' || b.t === 'daftar') {
    return a.t === 'daftar' && b.t === 'daftar' && a.v.length === b.v.length && a.v.every((x, i) => sama(x, b.v[i]));
  }
  if (a.t === 'teks' || b.t === 'teks') return a.t === 'teks' && b.t === 'teks' && a.v === b.v;
  return samaDengan(keAngka(a), keAngka(b));
}

function urutan(a: Nilai, b: Nilai): number {
  return banding(keAngka(a), keAngka(b));
}

function keDaftar(n: Nilai): Nilai[] {
  if (n.t !== 'daftar') throw new Error('bukan daftar');
  return n.v;
}

const angka = (v: Rasional): Nilai => ({ t: 'angka', v });
const bool = (v: boolean): Nilai => ({ t: 'bool', v });

function argUrut(arg: Nilai[]): Nilai[] {
  return arg.length === 1 && arg[0].t === 'daftar' ? arg[0].v : arg;
}

function panggil(nama: string, arg: Nilai[]): Nilai {
  switch (nama) {
    case 'F': {
      if (arg.length === 1) {
        const a = arg[0];
        if (a.t === 'teks') {
          const r = dariDesimal(a.v);
          if (!r) throw new Error(`F('${a.v}') tidak sah`);
          return angka(r);
        }
        return angka(keAngka(a));
      }
      return angka(bagi(keAngka(arg[0]), keAngka(arg[1])));
    }
    case 'gcd':
      return angka(arg.map(keAngka).reduce((x, y) => fpbRasional(x, y)));
    case 'lcm':
      return angka(arg.map(keAngka).reduce((x, y) => kpkRasional(x, y)));
    case 'sum':
      return angka(keDaftar(arg[0]).map(keAngka).reduce((x, y) => tambah(x, y), dariBulat(0)));
    case 'min':
    case 'max': {
      const xs = argUrut(arg);
      if (xs.length === 0) throw new Error(`${nama}() kosong`);
      return xs.reduce((x, y) => {
        const c = urutan(y, x);
        return nama === 'max' ? (c > 0 ? y : x) : c < 0 ? y : x;
      });
    }
    case 'abs':
      return angka(mutlak(keAngka(arg[0])));
    case 'round': {
      const n = arg.length > 1 ? Number(keAngka(arg[1]).p) : 0;
      return angka(bulatkan(keAngka(arg[0]), n));
    }
    case 'len':
      return angka(dariBulat(keDaftar(arg[0]).length));
    case 'all':
      return bool(keDaftar(arg[0]).every(benar));
    case 'any':
      return bool(keDaftar(arg[0]).some(benar));
    case 'sorted':
      return { t: 'daftar', v: [...keDaftar(arg[0])].sort(urutan) };
    default:
      throw new Error(`fungsi tidak dikenal: ${nama}`);
  }
}

function hitung(s: Simpul, env: Map<string, Nilai>): Nilai {
  switch (s.k) {
    case 'angka':
      return angka(s.v);
    case 'teks':
      return { t: 'teks', v: s.v };
    case 'nama': {
      if (s.n === 'True') return bool(true);
      if (s.n === 'False') return bool(false);
      const v = env.get(s.n);
      if (!v) throw new Error(`nama tidak dikenal: ${s.n}`);
      return v;
    }
    case 'daftar':
      return { t: 'daftar', v: s.isi.map((x) => hitung(x, env)) };
    case 'pahami': {
      const hasil: Nilai[] = [];
      for (const x of keDaftar(hitung(s.sumber, env))) {
        const env2 = new Map(env);
        env2.set(s.variabel, x);
        if (s.syarat && !benar(hitung(s.syarat, env2))) continue;
        hasil.push(hitung(s.elemen, env2));
      }
      return { t: 'daftar', v: hasil };
    }
    case 'panggil':
      return panggil(
        s.n,
        s.arg.map((a) => hitung(a, env)),
      );
    case 'indeks': {
      const xs = keDaftar(hitung(s.obj, env));
      let i = Number(keAngka(hitung(s.i, env)).p);
      if (i < 0) i += xs.length;
      if (i < 0 || i >= xs.length) throw new Error('indeks di luar daftar');
      return xs[i];
    }
    case 'tunggal': {
      const x = keAngka(hitung(s.x, env));
      return angka(s.op === '-' ? negatif(x) : x);
    }
    case 'biner': {
      const a = keAngka(hitung(s.a, env));
      const b = keAngka(hitung(s.b, env));
      switch (s.op) {
        case '+':
          return angka(tambah(a, b));
        case '-':
          return angka(kurang(a, b));
        case '*':
          return angka(kali(a, b));
        case '/':
          return angka(bagi(a, b));
        case '//':
          return angka(bagiBulat(a, b));
        case '%':
          return angka(sisaBagi(a, b));
        case '**':
          return angka(pangkat(a, b));
      }
      throw new Error(`operator tidak dikenal: ${s.op}`);
    }
    case 'banding': {
      const xs = s.xs.map((x) => hitung(x, env));
      for (let i = 0; i < s.ops.length; i++) {
        const a = xs[i];
        const b = xs[i + 1];
        let ok: boolean;
        switch (s.ops[i]) {
          case '==':
            ok = sama(a, b);
            break;
          case '!=':
            ok = !sama(a, b);
            break;
          case '<':
            ok = urutan(a, b) < 0;
            break;
          case '>':
            ok = urutan(a, b) > 0;
            break;
          case '<=':
            ok = urutan(a, b) <= 0;
            break;
          case '>=':
            ok = urutan(a, b) >= 0;
            break;
          case 'in':
            ok = keDaftar(b).some((x) => sama(a, x));
            break;
          default:
            ok = !keDaftar(b).some((x) => sama(a, x));
        }
        if (!ok) return bool(false);
      }
      return bool(true);
    }
    case 'dan': {
      const a = hitung(s.a, env);
      return benar(a) ? hitung(s.b, env) : a;
    }
    case 'atau': {
      const a = hitung(s.a, env);
      return benar(a) ? a : hitung(s.b, env);
    }
    case 'bukan':
      return bool(!benar(hitung(s.x, env)));
  }
}

export type HasilEkspresi = 'benar' | 'salah' | 'galat' | 'format' | 'lewati';

export interface HasilPeriksaEkspresi {
  hasil: HasilEkspresi;
  pesan?: string;
  /**
   * nilai sisi kiri perbandingan `kiri == kanan` tingkat atas yang berupa angka (untuk mengaitkan
   * ke pilihan). `tunggal` = perbandingan itu satu-satunya klausa baris (tidak dirangkai `and`).
   */
  nilaiSama: { nilai: Rasional; tunggal: boolean }[];
}

/** Urai satu ekspresi; dipakai juga oleh uji. */
export function uraiEkspresi(kode: string): Simpul {
  return new Pengurai(pecahToken(kode)).urai();
}

/** Hitung ekspresi Python mentah (tanpa backtick). */
export function hitungEkspresi(kode: string): Nilai {
  return hitung(uraiEkspresi(kode), new Map());
}

function kumpulkanSama(s: Simpul, keluar: { nilai: Rasional; tunggal: boolean }[], tunggal = true): void {
  if (s.k === 'dan') {
    kumpulkanSama(s.a, keluar, false);
    kumpulkanSama(s.b, keluar, false);
    return;
  }
  if (s.k === 'banding' && s.ops.length === 1 && s.ops[0] === '==') {
    try {
      const v = hitung(s.xs[0], new Map());
      if (v.t === 'angka') keluar.push({ nilai: v.v, tunggal });
    } catch {
      // abaikan: bagian ini memang tidak bisa dikaitkan ke pilihan
    }
  }
}

/**
 * Jalankan satu baris Periksa persis seperti `jalankan_periksa` di periksa.py:
 * "tidak ada hitungan" dilewati, ekspresi wajib diapit backtick, `24 == 24` ditolak,
 * dan hasil harus tepat `True`.
 */
export function jalankanPeriksa(baris: string): HasilPeriksaEkspresi {
  const e = baris.trim();
  if (e.toLowerCase().startsWith('tidak ada hitungan')) return { hasil: 'lewati', nilaiSama: [] };
  const m = /^`(.+)`$/.exec(e);
  if (!m) return { hasil: 'format', pesan: 'baris Periksa tidak diapit backtick', nilaiSama: [] };
  const kode = m[1];
  if (/^\s*(\d+)\s*==\s*\1\s*$/.test(kode)) return { hasil: 'format', pesan: 'hanya menulis ulang jawaban', nilaiSama: [] };
  try {
    const pohon = uraiEkspresi(kode);
    const v = hitung(pohon, new Map());
    const nilaiSama: { nilai: Rasional; tunggal: boolean }[] = [];
    kumpulkanSama(pohon, nilaiSama);
    if (v.t === 'bool' && v.v) return { hasil: 'benar', nilaiSama };
    const tulis = v.t === 'angka' ? keTeks(v.v) : v.t === 'bool' ? String(v.v) : v.t;
    return { hasil: 'salah', pesan: `bernilai ${tulis}`, nilaiSama };
  } catch (galat) {
    return { hasil: 'galat', pesan: galat instanceof Error ? galat.message : String(galat), nilaiSama: [] };
  }
}
