/**
 * Pemeriksa kunci (CLAUDE.md aturan 10: kunci Matematika dihitung ulang oleh kode).
 *
 * Cara kerjanya SENGAJA berbeda dari pembuat soal: pembuat soal menghitung
 * kunci dari angka acaknya dengan aritmetika bilangan bulat, sedangkan
 * pemeriksa ini hanya membaca TEKS soal, mengurainya dengan pengurai
 * ekspresi sendiri (tokenizer + recursive descent), lalu menghitung dengan
 * aritmetika rasional. KPK dicari dengan menelusuri kelipatan, FPB dengan
 * mencoba pembagi dari yang terbesar, akar dengan mencari bilangan yang
 * kuadratnya pas.
 */
import type { BentukJawaban, SoalLancar } from './jenis';
import {
  bagi,
  kali,
  keTeksDesimal,
  keTeksPecahan,
  kurang,
  rasional,
  tambah,
  type Rasional,
} from './rasional';

class GalatUrai extends Error {}

type Token =
  | { jenis: 'angka'; nilai: Rasional }
  | { jenis: 'simbol'; nilai: '+' | '-' | '*' | ':' | '/' | '(' | ')' | '²' | '%' | '√' };

function pecahToken(teks: string): Token[] {
  const token: Token[] = [];
  let i = 0;
  while (i < teks.length) {
    const c = teks.charAt(i);
    if (c === ' ') {
      i++;
      continue;
    }
    if (c >= '0' && c <= '9') {
      let utuh = '';
      while (i < teks.length && teks.charAt(i) >= '0' && teks.charAt(i) <= '9') utuh += teks.charAt(i++);
      let pecah = '';
      if (teks.charAt(i) === ',' && teks.charAt(i + 1) >= '0' && teks.charAt(i + 1) <= '9') {
        i++;
        while (i < teks.length && teks.charAt(i) >= '0' && teks.charAt(i) <= '9') pecah += teks.charAt(i++);
      }
      // Bangun nilai digit demi digit (bukan Number(teks)).
      let p = 0;
      for (const d of utuh + pecah) p = p * 10 + (d.charCodeAt(0) - 48);
      let q = 1;
      for (let k = 0; k < pecah.length; k++) q *= 10;
      token.push({ jenis: 'angka', nilai: rasional(p, q) });
      continue;
    }
    const peta: Record<string, Token['nilai']> = {
      '+': '+',
      '−': '-',
      '-': '-',
      '×': '*',
      ':': ':',
      '/': '/',
      '(': '(',
      ')': ')',
      '²': '²',
      '%': '%',
      '√': '√',
    };
    const s = peta[c];
    if (s === undefined || typeof s !== 'string') throw new GalatUrai(`Lambang tidak dikenal: "${c}"`);
    token.push({ jenis: 'simbol', nilai: s });
    i++;
  }
  return token;
}

/** Akar kuadrat dengan mencari bilangan bulat yang kuadratnya pas. */
function akarPas(r: Rasional): Rasional {
  if (r.q !== 1 || r.p < 0) throw new GalatUrai('Akar hanya untuk bilangan cacah.');
  for (let s = 0; s * s <= r.p; s++) if (s * s === r.p) return rasional(s);
  throw new GalatUrai(`${r.p} bukan bilangan kuadrat.`);
}

/** Pengurai ekspresi: ekspresi := suku (± suku)*; suku := faktor ((× : /) faktor)*. */
class Pengurai {
  private pos = 0;
  constructor(private readonly token: Token[]) {}

  urai(): Rasional {
    const nilai = this.ekspresi();
    if (this.pos !== this.token.length) throw new GalatUrai('Sisa teks tidak terbaca.');
    return nilai;
  }

  private lihat(): Token | undefined {
    return this.token[this.pos];
  }

  private simbol(s: Token['nilai']): boolean {
    const t = this.lihat();
    if (t && t.jenis === 'simbol' && t.nilai === s) {
      this.pos++;
      return true;
    }
    return false;
  }

  private ekspresi(): Rasional {
    let nilai = this.suku();
    for (;;) {
      if (this.simbol('+')) nilai = tambah(nilai, this.suku());
      else if (this.simbol('-')) nilai = kurang(nilai, this.suku());
      else return nilai;
    }
  }

  private suku(): Rasional {
    let nilai = this.faktor();
    for (;;) {
      if (this.simbol('*')) nilai = kali(nilai, this.faktor());
      else if (this.simbol(':') || this.simbol('/')) nilai = bagi(nilai, this.faktor());
      else return nilai;
    }
  }

  private faktor(): Rasional {
    if (this.simbol('√')) return akarPas(this.faktor());
    let nilai = this.atom();
    for (;;) {
      if (this.simbol('²')) nilai = kali(nilai, nilai);
      else if (this.simbol('%')) nilai = bagi(nilai, rasional(100));
      else return nilai;
    }
  }

  private atom(): Rasional {
    const t = this.lihat();
    if (!t) throw new GalatUrai('Teks berakhir terlalu cepat.');
    if (t.jenis === 'angka') {
      this.pos++;
      return t.nilai;
    }
    if (this.simbol('(')) {
      const nilai = this.ekspresi();
      if (!this.simbol(')')) throw new GalatUrai('Kurung tutup hilang.');
      return nilai;
    }
    throw new GalatUrai('Angka atau kurung diharapkan.');
  }
}

/** Menghitung nilai ekspresi teks soal; "A dari B" berarti A × B. */
export function hitungEkspresi(teks: string): Rasional {
  const bagian = teks.split(' dari ');
  if (bagian.length > 2) throw new GalatUrai('Terlalu banyak "dari".');
  const nilai = bagian.map((b) => new Pengurai(pecahToken(b)).urai());
  const [kiri, kanan] = nilai;
  if (!kiri) throw new GalatUrai('Soal kosong.');
  return kanan ? kali(kiri, kanan) : kiri;
}

function kpkTelusur(a: number, b: number): number {
  for (let m = Math.max(a, b); m <= a * b; m++) if (m % a === 0 && m % b === 0) return m;
  throw new GalatUrai('KPK tidak ditemukan.');
}

function fpbCoba(a: number, b: number): number {
  for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d;
  throw new GalatUrai('FPB tidak ditemukan.');
}

const POLA_KPK_FPB = /^(KPK|FPB) (\d+) dan (\d+)$/;
const POLA_UBAH = /^(.+) = … (%|\(desimal\)|\(pecahan paling sederhana\))$/;

function bilanganCacah(r: Rasional): string {
  if (r.q !== 1 || r.p < 0) throw new GalatUrai('Hasil bukan bilangan cacah.');
  return String(r.p);
}

/** Menghitung kunci dari teks soal saja. Melempar galat bila soal tidak bisa dihitung. */
export function hitungKunci(teks: string, bentuk: BentukJawaban): string {
  if (teks.includes('÷')) throw new GalatUrai('Lambang bagi harus ":", bukan "÷".');
  const kf = POLA_KPK_FPB.exec(teks);
  if (kf) {
    const a = Number(kf[2]);
    const b = Number(kf[3]);
    if (bentuk !== 'bilangan') throw new GalatUrai('KPK/FPB harus dijawab bilangan.');
    return String(kf[1] === 'KPK' ? kpkTelusur(a, b) : fpbCoba(a, b));
  }
  const ubah = POLA_UBAH.exec(teks);
  if (ubah) {
    const nilai = hitungEkspresi(ubah[1] ?? '');
    const sasaran = ubah[2];
    if (sasaran === '%') {
      if (bentuk !== 'bilangan') throw new GalatUrai('Soal "… %" harus dijawab bilangan.');
      return bilanganCacah(kali(nilai, rasional(100)));
    }
    if (sasaran === '(desimal)') {
      if (bentuk !== 'desimal') throw new GalatUrai('Soal "(desimal)" harus dijawab desimal.');
      const d = keTeksDesimal(nilai);
      if (d === null) throw new GalatUrai('Desimal tidak berhenti.');
      return d;
    }
    if (bentuk !== 'pecahan') throw new GalatUrai('Soal pecahan harus dijawab pecahan.');
    return keTeksPecahan(nilai);
  }
  if (bentuk !== 'bilangan') throw new GalatUrai('Soal hitung harus dijawab bilangan.');
  return bilanganCacah(hitungEkspresi(teks));
}

const POLA_KETIK: Record<BentukJawaban, RegExp> = {
  bilangan: /^(0|[1-9]\d*)$/,
  desimal: /^\d+,\d*[1-9]$/,
  pecahan: /^[1-9]\d*\/[1-9]\d*$/,
};

export interface HasilPeriksaKunci {
  lulus: boolean;
  kunciHitung: string | null;
  alasan: string | null;
}

/**
 * Memeriksa satu soal: kunci harus bisa diketik di papan angka dalam bentuk
 * baku, dan harus sama persis dengan kunci yang dihitung ulang dari teks.
 */
export function periksaKunci(soal: Pick<SoalLancar, 'teks' | 'kunci' | 'bentukJawaban'>): HasilPeriksaKunci {
  let kunciHitung: string;
  try {
    kunciHitung = hitungKunci(soal.teks, soal.bentukJawaban);
  } catch (e) {
    return { lulus: false, kunciHitung: null, alasan: e instanceof Error ? e.message : String(e) };
  }
  if (!POLA_KETIK[soal.bentukJawaban].test(soal.kunci)) {
    return { lulus: false, kunciHitung, alasan: `Kunci "${soal.kunci}" bukan bentuk baku ${soal.bentukJawaban}.` };
  }
  if (soal.kunci !== kunciHitung) {
    return { lulus: false, kunciHitung, alasan: `Kunci "${soal.kunci}" berbeda dengan hitungan ulang "${kunciHitung}".` };
  }
  return { lulus: true, kunciHitung, alasan: null };
}

