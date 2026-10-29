/**
 * Pemeriksa kunci Matematika (CLAUDE.md aturan 10: kunci dihitung ulang oleh kode).
 *
 * Tiga lapis pemeriksaan untuk setiap butir:
 * 1. **Ekspresi Periksa** — setiap baris `Periksa` bahan dihitung ulang dengan bilangan rasional
 *    (ekspresi-python.ts). Hasil harus `True`, sama seperti `_alat/periksa.py`.
 * 2. **Kaitan ke kunci** (PG) — nilai di sisi kiri `… == …` dicocokkan dengan angka pada pilihan.
 *    Kalau nilai itu hanya cocok dengan pilihan yang BUKAN kunci, kunci perlu dicek.
 * 3. **Hitung mandiri** (PG) — soal yang polanya dikenali (operasi hitung, KPK/FPB, persen,
 *    pecahan↔persen/desimal, luas/keliling, volume, rata-rata, konversi satuan) dihitung
 *    langsung dari kalimat soal dengan pola regex + aritmetika rasional, tanpa memakai
 *    baris Periksa penulis.
 */
import { jalankanPeriksa, type HasilEkspresi } from './ekspresi-python';
import type { Bagian, Butir } from './jenis';
import {
  bagi,
  buatRasional,
  dariBulat,
  dariDesimal,
  fpbRasional,
  kali,
  keTeks,
  kpkRasional,
  kurang,
  samaDengan,
  tambah,
  type Rasional,
} from './rasional';

export interface HasilEkspresiButir {
  teks: string;
  hasil: HasilEkspresi;
  pesan?: string;
}

export interface HitungMandiri {
  /** nama pola yang dipakai, misal "operasi hitung", "KPK", "luas persegi panjang" */
  pola: string;
  /** nilai hitungan kode (tulisan rasional ringkas) */
  nilai: string;
  /** huruf pilihan yang cocok dengan nilai, atau null kalau tidak ada yang cocok */
  pilihanCocok: string | null;
  hasil: 'cocok' | 'beda' | 'tidak_ada_pilihan';
}

export interface HasilPeriksaKunci {
  butirId: string;
  ekspresi: HasilEkspresiButir[];
  /** PG saja: apakah nilai Periksa menunjuk pilihan kunci */
  kaitan: 'cocok' | 'beda' | 'tidak_terkait';
  hitungMandiri: HitungMandiri | null;
  /** true kalau kunci benar-benar dihitung ulang (lihat `dihitungUlang` di bawah) */
  dihitungUlang: boolean;
  /** daftar ketidakcocokan; tidak kosong → status butir 'perlu_dicek' */
  temuan: string[];
}

// ───────────────────────────── angka di teks soal ─────────────────────────────

/** "{1 1/2}" → "1 1/2", "{3/4}" → "3/4" (kembali ke tulisan bahan) */
function lepasPenanda(s: string): string {
  return s.replace(/\{(\d+ )?(\d+)\/(\d+)\}/g, (_m, b: string | undefined, p: string, q: string) => `${b ?? ''}${p}/${q}`);
}

/** Angka gaya Indonesia: "3.500" = 3500, "3,5" = 7/2, "4.089" = 4089. */
export function angkaIndonesia(s: string): Rasional | null {
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) return dariDesimal(s.replace(/\./g, '').replace(',', '.'));
  if (/^\d+(,\d+)?$/.test(s)) return dariDesimal(s.replace(',', '.'));
  return null;
}

interface TokenAngka {
  nilai: Rasional;
  persen: boolean;
  /** teks satuan tepat sesudah angka, misal "cm²", "km", "kg" */
  satuan: string;
  mulai: number;
  akhir: number;
}

const POLA_ANGKA = /(\d+) (\d+)\/(\d+)|(\d+)\/(\d+)|\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;

/** Semua angka di teks (pecahan campuran, pecahan, desimal, ribuan) beserta tanda persen/satuan. */
export function cariAngka(teksAsli: string): TokenAngka[] {
  const teks = lepasPenanda(teksAsli).replace(/Rp\s?/g, '');
  const hasil: TokenAngka[] = [];
  for (const m of teks.matchAll(POLA_ANGKA)) {
    const mulai = m.index;
    // jangan pecah kata seperti "M02" atau "P11"
    if (mulai > 0 && /[A-Za-z]/.test(teks[mulai - 1])) continue;
    let nilai: Rasional | null;
    if (m[1] !== undefined) nilai = tambah(dariBulat(BigInt(m[1])), buatRasional(BigInt(m[2]), BigInt(m[3])));
    else if (m[4] !== undefined) nilai = Number(m[5]) === 0 ? null : buatRasional(BigInt(m[4]), BigInt(m[5]));
    else nilai = angkaIndonesia(m[0]);
    if (!nilai) continue;
    const akhir = mulai + m[0].length;
    const sesudah = teks.slice(akhir);
    const persen = /^\s?%/.test(sesudah);
    const satuan = /^\s?([A-Za-z]+[²³]?)/.exec(sesudah)?.[1] ?? '';
    hasil.push({ nilai, persen, satuan: persen ? '%' : satuan, mulai, akhir });
  }
  return hasil;
}

/** Nilai satu pilihan jawaban; null kalau pilihan bukan satu angka (jam, rasio, gambar, kalimat). */
export function nilaiPilihan(teks: string): TokenAngka | null {
  const polos = lepasPenanda(teks);
  if (/pukul|:|\bjam\b.*\bmenit\b/i.test(polos)) return null;
  const angka = cariAngka(teks);
  if (angka.length !== 1) return null;
  // pilihan harus hampir seluruhnya angka + satuan pendek (bukan kalimat yang kebetulan berangka)
  const sisa = polos
    .replace(/Rp\s?/g, '')
    .replace(POLA_ANGKA, '')
    .replace(/[%²³\s.,-]/g, '');
  if (sisa.length > 12) return null;
  return angka[0];
}

function cocokNilai(target: Rasional, p: TokenAngka, harapSatuan?: string): boolean {
  if (harapSatuan !== undefined && p.satuan && !satuanSama(p.satuan, harapSatuan)) return false;
  if (samaDengan(p.nilai, target)) return true;
  return p.persen && samaDengan(bagi(p.nilai, dariBulat(100)), target);
}

function satuanSama(a: string, b: string): boolean {
  const baku = (s: string): string => SINONIM_SATUAN[s.toLowerCase()] ?? s.toLowerCase();
  if (b === '²') return a.includes('²');
  if (b === '³') return a.includes('³') || /^(l|liter|ml)$/i.test(a);
  if (b === '¹') return !a.includes('²') && !a.includes('³');
  return baku(a) === baku(b);
}

/** huruf-huruf pilihan yang nilainya sama dengan target */
function pilihanBernilai(butir: Butir, target: Rasional, harapSatuan?: string): string[] {
  const hasil: string[] = [];
  for (const p of butir.pilihan) {
    const v = nilaiPilihan(p.teks);
    if (v && cocokNilai(target, v, harapSatuan)) hasil.push(p.huruf);
  }
  return hasil;
}

// ───────────────────────────── ekspresi hitung bahasa Indonesia ─────────────────────────────

type TokOp = { j: 'angka'; v: Rasional } | { j: 'op'; s: string };

function tokenHitung(s: string): TokOp[] | null {
  const hasil: TokOp[] = [];
  let i = 0;
  const t = s.trim();
  while (i < t.length) {
    const c = t[i];
    if (c === ' ') {
      i++;
      continue;
    }
    const sisa = t.slice(i);
    const campuran = /^(\d+) (\d+)\/(\d+)/.exec(sisa);
    if (campuran) {
      hasil.push({ j: 'angka', v: tambah(dariBulat(BigInt(campuran[1])), buatRasional(BigInt(campuran[2]), BigInt(campuran[3]))) });
      i += campuran[0].length;
      continue;
    }
    const pecahan = /^(\d+)\/(\d+)/.exec(sisa);
    if (pecahan) {
      if (Number(pecahan[2]) === 0) return null;
      hasil.push({ j: 'angka', v: buatRasional(BigInt(pecahan[1]), BigInt(pecahan[2])) });
      i += pecahan[0].length;
      continue;
    }
    const angka = /^(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(\s?%)?/.exec(sisa);
    if (angka) {
      const v = angkaIndonesia(angka[1]);
      if (!v) return null;
      hasil.push({ j: 'angka', v: angka[2] ? bagi(v, dariBulat(100)) : v });
      i += angka[0].length;
      continue;
    }
    const peta: Record<string, string> = { '+': '+', '-': '-', '−': '-', '×': '*', x: '*', '·': '*', ':': '/', '÷': '/', '(': '(', ')': ')' };
    if (peta[c]) {
      hasil.push({ j: 'op', s: peta[c] });
      i++;
      continue;
    }
    return null;
  }
  return hasil;
}

/** Hitung "48 : 6 + 2 × 3", "3/4 + 1 1/2" dengan urutan pengerjaan baku (kali-bagi dulu, kurung paling dulu). */
export function hitungEkspresiIndonesia(s: string): Rasional | null {
  const tk = tokenHitung(lepasPenanda(s));
  if (!tk || tk.length < 3 || !tk.some((t) => t.j === 'op' && t.s !== '(' && t.s !== ')')) return null;
  let i = 0;
  const lihat = (): TokOp | undefined => tk[i];
  const jumlah = (): Rasional => {
    let a = kaliBagi();
    for (let t = lihat(); t && t.j === 'op' && (t.s === '+' || t.s === '-'); t = lihat()) {
      i++;
      const b = kaliBagi();
      a = t.s === '+' ? tambah(a, b) : kurang(a, b);
    }
    return a;
  };
  const kaliBagi = (): Rasional => {
    let a = atom();
    for (let t = lihat(); t && t.j === 'op' && (t.s === '*' || t.s === '/'); t = lihat()) {
      i++;
      const b = atom();
      a = t.s === '*' ? kali(a, b) : bagi(a, b);
    }
    return a;
  };
  const atom = (): Rasional => {
    const t = tk[i++];
    if (!t) throw new Error('terpotong');
    if (t.j === 'angka') return t.v;
    if (t.s === '(') {
      const v = jumlah();
      const tutup = tk[i++];
      if (!tutup || tutup.j !== 'op' || tutup.s !== ')') throw new Error('kurung');
      return v;
    }
    throw new Error('token');
  };
  try {
    const v = jumlah();
    return i === tk.length ? v : null;
  } catch {
    return null;
  }
}

// ───────────────────────────── pola hitung mandiri ─────────────────────────────

function teksBagian(b: Bagian): string {
  switch (b.jenis) {
    case 'teks':
      return b.isi;
    case 'tabel':
      return b.baris.map((r) => r.join(' ')).join('\n');
    case 'denah':
      return b.petak.map((r) => r.join(' ')).join('\n');
    case 'gambar_teks':
      return b.baris.join('\n');
  }
}

const SINONIM_SATUAN: Record<string, string> = {
  meter: 'm',
  sentimeter: 'cm',
  centimeter: 'cm',
  kilometer: 'km',
  milimeter: 'mm',
  desimeter: 'dm',
  kilogram: 'kg',
  gram: 'g',
  ons: 'hg',
  liter: 'l',
  mililiter: 'ml',
  cc: 'ml',
  'dm³': 'l',
  'cm³': 'ml',
  'm³': 'kl',
  jam: 'jam',
  menit: 'menit',
  detik: 'detik',
  kuintal: 'kuintal',
  ton: 'ton',
};

/** satuan → [besaran, faktor terhadap satuan dasar] */
const SATUAN: Record<string, [string, Rasional]> = {
  km: ['panjang', dariBulat(1000)],
  hm: ['panjang', dariBulat(100)],
  dam: ['panjang', dariBulat(10)],
  m: ['panjang', dariBulat(1)],
  dm: ['panjang', buatRasional(BigInt(1), BigInt(10))],
  cm: ['panjang', buatRasional(BigInt(1), BigInt(100))],
  mm: ['panjang', buatRasional(BigInt(1), BigInt(1000))],
  ton: ['berat', dariBulat(1000)],
  kuintal: ['berat', dariBulat(100)],
  kg: ['berat', dariBulat(1)],
  hg: ['berat', buatRasional(BigInt(1), BigInt(10))],
  dag: ['berat', buatRasional(BigInt(1), BigInt(100))],
  g: ['berat', buatRasional(BigInt(1), BigInt(1000))],
  kl: ['volume', dariBulat(1000)],
  l: ['volume', dariBulat(1)],
  dl: ['volume', buatRasional(BigInt(1), BigInt(10))],
  ml: ['volume', buatRasional(BigInt(1), BigInt(1000))],
  jam: ['waktu', dariBulat(3600)],
  menit: ['waktu', dariBulat(60)],
  detik: ['waktu', dariBulat(1)],
};

function bakuSatuan(s: string): string {
  const k = s.toLowerCase();
  return SINONIM_SATUAN[k] ?? k;
}

const KATA_PENGUBAH =
  /\b(dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|beberapa)\b|disusun|ditempel|berjajar|digabung|bertumpuk|setengah|separuh|sisa|dikurangi|ditambah|tambahan|berisi|terisi|diisi|tanpa tutup|terbuka|bagian|dipotong|dibagi|lagi\b|masing-masing|setiap|tiap|kali lipat/i;

type Penghitung = (b: Butir, teksSemua: string, tanya: string) => { pola: string; nilai: Rasional; satuan?: string } | null;

const POLA_MANDIRI: Penghitung[] = [
  // 1. operasi hitung langsung: "Berapa hasil 48 : 6 + 2 × 3?"
  (b, _semua, tanya) => {
    const m = /^(?:Berapa(?: hasil| nilai)?(?: dari)?|Hasil(?: dari)?)\s+(.+?)\s*(?:\?|\s+adalah\b)/.exec(lepasPenanda(tanya).trim());
    if (!m || (b.stimulus && b.stimulus.length > 0)) return null;
    if (!/^[\d\s.,+\-−×x:÷()/]+$/.test(m[1])) return null;
    const v = hitungEkspresiIndonesia(m[1]);
    return v ? { pola: 'operasi hitung', nilai: v } : null;
  },
  // 2. KPK / FPB
  (_b, _semua, tanya) => {
    const m = /\b(KPK|FPB)\s+(?:dari\s+)?(\d[\d.]*)(?:\s*,\s*(\d[\d.]*))?\s+dan\s+(\d[\d.]*)\s*\?/.exec(tanya);
    if (!m) return null;
    const xs = [m[2], m[3], m[4]].filter((x): x is string => !!x).map((x) => angkaIndonesia(x));
    if (xs.some((x) => !x)) return null;
    const ys = xs as Rasional[];
    const f = m[1] === 'KPK' ? kpkRasional : fpbRasional;
    return { pola: m[1], nilai: ys.reduce((a, c) => f(a, c)) };
  },
  // 3. "Berapa 25% dari Rp80.000?"
  (b, _semua, tanya) => {
    const m = /^Berapa(?: hasil| nilai)?\s+(\d+(?:,\d+)?)\s*%\s+dari\s+(?:Rp\s?)?(\d[\d.,]*)\s*\??$/.exec(tanya.trim());
    if (!m || (b.stimulus && b.stimulus.length > 0)) return null;
    const p = angkaIndonesia(m[1]);
    const n = angkaIndonesia(m[2]);
    return p && n ? { pola: 'persen dari', nilai: bagi(kali(p, n), dariBulat(100)) } : null;
  },
  // 4. ubah bentuk: pecahan/desimal → persen, → desimal, persen → pecahan
  (b, _semua, tanya) => {
    if (b.stimulus && b.stimulus.length > 0) return null;
    const angka = cariAngka(tanya);
    if (angka.length !== 1) return null;
    const a = angka[0];
    const nilaiAsli = a.persen ? bagi(a.nilai, dariBulat(100)) : a.nilai;
    if (/berapa persen|bentuk persen|dalam persen/i.test(tanya) && !a.persen) {
      return { pola: 'ubah ke persen', nilai: nilaiAsli, satuan: '%' };
    }
    if (/(bentuk|pecahan) desimal|berapa desimal|sama dengan desimal/i.test(tanya)) return { pola: 'ubah ke desimal', nilai: nilaiAsli };
    if (/pecahan (biasa|paling sederhana)|bentuk pecahan/i.test(tanya) && a.persen) return { pola: 'persen ke pecahan', nilai: nilaiAsli };
    return null;
  },
  // 5. luas/keliling persegi panjang, persegi, segitiga; volume/luas permukaan kubus dan balok
  (_b, semua, tanya) => {
    if (KATA_PENGUBAH.test(semua)) return null;
    const angka = cariAngka(semua);
    const nilaiDari = (re: RegExp): Rasional | null => {
      const m = re.exec(lepasPenanda(semua));
      return m ? angkaIndonesia(m[1]) : null;
    };
    const tanyaLuas = /\bluas(nya)?\b/i.test(tanya) && !/luas permukaan/i.test(tanya);
    const tanyaKeliling = /\bkeliling(nya)?\b/i.test(tanya);
    const tanyaVolume = /\bvolume(nya)?\b/i.test(tanya);
    const tanyaLP = /luas permukaan/i.test(tanya);
    if (/persegi panjang/i.test(semua) && angka.length === 2) {
      const p = nilaiDari(/panjang(?:nya)?\s+(\d[\d.,]*)/i);
      const l = nilaiDari(/lebar(?:nya)?\s+(\d[\d.,]*)/i);
      if (p && l) {
        if (tanyaLuas) return { pola: 'luas persegi panjang', nilai: kali(p, l), satuan: '²' };
        if (tanyaKeliling) return { pola: 'keliling persegi panjang', nilai: kali(dariBulat(2), tambah(p, l)), satuan: '¹' };
      }
    }
    if (/\bpersegi\b(?! panjang)/i.test(semua) && !/persegi panjang/i.test(semua) && angka.length === 1) {
      const s = nilaiDari(/sisi(?:nya)?\s+(\d[\d.,]*)/i);
      if (s) {
        if (tanyaLuas) return { pola: 'luas persegi', nilai: kali(s, s), satuan: '²' };
        if (tanyaKeliling) return { pola: 'keliling persegi', nilai: kali(dariBulat(4), s), satuan: '¹' };
      }
    }
    if (/segitiga/i.test(semua) && angka.length === 2 && tanyaLuas) {
      const a = nilaiDari(/alas(?:nya)?\s+(\d[\d.,]*)/i);
      const t = nilaiDari(/tinggi(?:nya)?\s+(\d[\d.,]*)/i);
      if (a && t) return { pola: 'luas segitiga', nilai: bagi(kali(a, t), dariBulat(2)), satuan: '²' };
    }
    if (/kubus/i.test(semua) && angka.length === 1) {
      const r = nilaiDari(/rusuk(?:nya)?\s+(\d[\d.,]*)/i);
      if (r) {
        if (tanyaVolume && /liter|\bL\b/.test(tanya)) {
          const keDm = SATUAN[bakuSatuan(angka[0].satuan)]?.[0] === 'panjang' ? bagi(SATUAN[bakuSatuan(angka[0].satuan)][1], SATUAN.dm[1]) : null;
          if (!keDm) return null;
          const sisiDm = kali(r, keDm);
          return { pola: 'volume kubus (liter)', nilai: kali(kali(sisiDm, sisiDm), sisiDm), satuan: 'l' };
        }
        if (tanyaVolume) return { pola: 'volume kubus', nilai: kali(kali(r, r), r), satuan: '³' };
        if (tanyaLP) return { pola: 'luas permukaan kubus', nilai: kali(dariBulat(6), kali(r, r)), satuan: '²' };
      }
    }
    if (/balok/i.test(semua) || /\d\s*cm\s*×\s*\d/.test(semua)) {
      const m = /(\d[\d.,]*)\s*(?:cm|m|dm)?\s*×\s*(\d[\d.,]*)\s*(?:cm|m|dm)?\s*×\s*(\d[\d.,]*)/.exec(lepasPenanda(semua));
      let dims: (Rasional | null)[] = m ? [angkaIndonesia(m[1]), angkaIndonesia(m[2]), angkaIndonesia(m[3])] : [];
      if (!m) dims = [nilaiDari(/panjang(?:nya)?\s+(\d[\d.,]*)/i), nilaiDari(/lebar(?:nya)?\s+(\d[\d.,]*)/i), nilaiDari(/tinggi(?:nya)?\s+(\d[\d.,]*)/i)];
      if (angka.length === 3 && dims.length === 3 && dims.every((d) => d)) {
        const [p, l, t] = dims as Rasional[];
        if (tanyaVolume && /liter|\bL\b/.test(tanya)) return null;
        if (tanyaVolume) return { pola: 'volume balok', nilai: kali(kali(p, l), t), satuan: '³' };
        if (tanyaLP)
          return { pola: 'luas permukaan balok', nilai: kali(dariBulat(2), tambah(tambah(kali(p, l), kali(p, t)), kali(l, t))), satuan: '²' };
      }
    }
    return null;
  },
  // 6. rata-rata dari daftar bilangan di kalimat: "12, 15, 9, dan 20"
  (_b, semua, tanya) => {
    if (!/rata-rata/i.test(tanya)) return null;
    const m = /(\d[\d.,]*(?:\s*,\s*\d[\d.,]*)+\s*,?\s*dan\s+\d[\d.,]*)/.exec(lepasPenanda(semua));
    if (!m) return null;
    const daftar = m[1].split(/\s*,\s*(?:dan\s+)?|\s+dan\s+/).map((x) => angkaIndonesia(x.trim()));
    if (daftar.length < 2 || daftar.some((x) => !x)) return null;
    if (cariAngka(semua).length !== daftar.length) return null;
    const xs = daftar as Rasional[];
    return { pola: 'rata-rata', nilai: bagi(xs.reduce((a, c) => tambah(a, c)), dariBulat(xs.length)) };
  },
  // 7. konversi satuan: satu besaran di soal, ditanya "Berapa meter …?"
  (_b, semua, tanya) => {
    const angka = cariAngka(semua);
    if (angka.length !== 1 || KATA_PENGUBAH.test(semua)) return null;
    const asal = SATUAN[bakuSatuan(angka[0].satuan)];
    const t = /[Bb]erapa\s+([A-Za-z]+[²³]?)/.exec(tanya);
    if (!asal || !t) return null;
    const tujuanKode = bakuSatuan(t[1]);
    const tujuan = SATUAN[tujuanKode];
    if (!tujuan || tujuan[0] !== asal[0] || bakuSatuan(angka[0].satuan) === tujuanKode) return null;
    return { pola: `konversi ${angka[0].satuan} ke ${t[1]}`, nilai: bagi(kali(angka[0].nilai, asal[1]), tujuan[1]), satuan: tujuanKode };
  },
];

// ── pola yang langsung menunjuk huruf (pilihan bukan satu angka biasa) ──

type PenunjukHuruf = (b: Butir, teksSemua: string, tanya: string) => { pola: string; nilai: string; cocok: string[] } | null;

const MENIT_SEHARI = 24 * 60;

/** "pukul 08.20" → 500 (menit sejak tengah malam) */
function jamKeMenit(jam: string, menit: string): number {
  return Number(jam) * 60 + Number(menit);
}

/** "1 jam 30 menit" / "2 jam" / "45 menit" → menit; null kalau bukan lama waktu */
function lamaKeMenit(s: string): number | null {
  const m = /^(?:(\d+) jam)?(?:\s*(\d+) menit)?$/.exec(s.trim());
  if (!m || (m[1] === undefined && m[2] === undefined)) return null;
  return Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0);
}

function pilihanBulat(b: Butir): { huruf: string; n: bigint }[] | null {
  const hasil: { huruf: string; n: bigint }[] = [];
  for (const p of b.pilihan) {
    const v = nilaiPilihan(p.teks);
    if (!v || v.nilai.q !== BigInt(1) || v.persen) return null;
    hasil.push({ huruf: p.huruf, n: v.nilai.p });
  }
  return hasil;
}

const POLA_HURUF: PenunjukHuruf[] = [
  // rasio paling sederhana: "Berapa bentuk paling sederhana dari rasio 18 : 12?"
  (b, _semua, tanya) => {
    const m = /rasio (\d+) : (\d+)/.exec(tanya);
    if (!m || !/paling sederhana/.test(tanya)) return null;
    const r = fpbRasional(dariBulat(BigInt(m[1])), dariBulat(BigInt(m[2]))).p;
    const target = `${BigInt(m[1]) / r} : ${BigInt(m[2]) / r}`;
    return { pola: 'rasio paling sederhana', nilai: target, cocok: b.pilihan.filter((p) => p.teks.trim() === target).map((p) => p.huruf) };
  },
  // pecahan paling sederhana: "Bentuk paling sederhana dari {4/6} adalah?"
  (b, _semua, tanya) => {
    const m = /paling sederhana dari \{(\d+)\/(\d+)\}/.exec(tanya);
    if (!m) return null;
    const r = buatRasional(BigInt(m[1]), BigInt(m[2]));
    const target = r.q === BigInt(1) ? r.p.toString() : `{${r.p}/${r.q}}`;
    return { pola: 'pecahan paling sederhana', nilai: target, cocok: b.pilihan.filter((p) => p.teks.trim() === target).map((p) => p.huruf) };
  },
  // rusuk kubus dari volume
  (b, semua, tanya) => {
    const m = /(?:bervolume|[Vv]olume(?:nya)?) (\d[\d.]*) cm³/.exec(semua);
    if (!m || !/kubus/.test(semua) || !/rusuk/.test(tanya) || cariAngka(semua).length !== 1) return null;
    const v = angkaIndonesia(m[1]);
    if (!v || v.q !== BigInt(1)) return null;
    const n = Math.round(Math.cbrt(Number(v.p)));
    if (BigInt(n) ** BigInt(3) !== v.p) return null;
    return { pola: 'rusuk kubus dari volume', nilai: String(n), cocok: pilihanBernilai(b, dariBulat(n)) };
  },
  // faktor / kelipatan (persekutuan): "Manakah yang merupakan faktor dari 20?"
  (b, _semua, tanya) => {
    const m = /[Mm]anakah (?:yang merupakan )?(?:\*\*)?(faktor|kelipatan)(?:\*\*)?( persekutuan)? dari (\d+)(?: dan (\d+))?\s*\?/.exec(tanya);
    if (!m) return null;
    if (m[2] && !m[4]) return null;
    const angka = [BigInt(m[3]), ...(m[4] ? [BigInt(m[4])] : [])];
    const pil = pilihanBulat(b);
    if (!pil) return null;
    const nol = BigInt(0);
    const lolos = pil.filter(({ n }) => n > nol && angka.every((a) => (m[1] === 'faktor' ? a % n === nol : n % a === nol)));
    return { pola: `${m[1]}${m[2] ?? ''}`, nilai: lolos.map((x) => x.n.toString()).join(', ') || '-', cocok: lolos.map((x) => x.huruf) };
  },
  // nilai paling besar/kecil, atau lebih kecil/besar dari X, di antara pilihan berangka
  (b, _semua, tanya) => {
    const t = tanya.replace(/\*\*/g, '');
    const m = /(?:[Bb]ilangan|[Pp]ecahan) manakah yang (?:nilainya )?(paling|lebih) (besar|kecil)(?: dari (\S+?))?\s*\?/.exec(t);
    if (!m) return null;
    const nilai: { huruf: string; v: Rasional }[] = [];
    for (const p of b.pilihan) {
      const v = nilaiPilihan(p.teks);
      if (!v) return null;
      nilai.push({ huruf: p.huruf, v: v.persen ? bagi(v.nilai, dariBulat(100)) : v.nilai });
    }
    const besar = m[2] === 'besar';
    if (m[1] === 'paling') {
      const urut = [...nilai].sort((x, y) => (besar ? -1 : 1) * bandingR(x.v, y.v));
      if (urut.length > 1 && bandingR(urut[0].v, urut[1].v) === 0) return null;
      return { pola: `paling ${m[2]}`, nilai: keTeks(urut[0].v), cocok: [urut[0].huruf] };
    }
    if (!m[3]) return null;
    const batas = cariAngka(m[3]);
    if (batas.length !== 1) return null;
    const x = batas[0].persen ? bagi(batas[0].nilai, dariBulat(100)) : batas[0].nilai;
    const lolos = nilai.filter((n) => (besar ? bandingR(n.v, x) > 0 : bandingR(n.v, x) < 0));
    return { pola: `lebih ${m[2]} dari ${keTeks(x)}`, nilai: lolos.map((n) => keTeks(n.v)).join(', ') || '-', cocok: lolos.map((n) => n.huruf) };
  },
  // lama perjalanan dari dua jam: "berangkat pukul 06.50 dan tiba pukul 08.20. Berapa lama …?"
  (b, semua, tanya) => {
    if (!/[Bb]erapa lama/.test(tanya)) return null;
    const jam = [...semua.matchAll(/pukul (\d{1,2})\.(\d{2})/g)];
    if (jam.length !== 2 || cariAngka(semua.replace(/pukul \d{1,2}\.\d{2}/g, '')).length !== 0) return null;
    let lama = jamKeMenit(jam[1][1], jam[1][2]) - jamKeMenit(jam[0][1], jam[0][2]);
    if (lama < 0) lama += MENIT_SEHARI;
    const cocok = b.pilihan.filter((p) => lamaKeMenit(p.teks) === lama).map((p) => p.huruf);
    return { pola: 'lama waktu', nilai: `${lama} menit`, cocok };
  },
  // jam tiba dari jam berangkat + lama: "berangkat pukul 13.30 … 1 jam 45 menit. Pukul berapa tiba?"
  (b, semua, tanya) => {
    if (!/[Pp]ukul berapa/.test(tanya) || !/tiba|sampai|selesai/.test(tanya)) return null;
    const jam = [...semua.matchAll(/pukul (\d{1,2})\.(\d{2})/g)];
    const tanpaJam = semua.replace(/pukul \d{1,2}\.\d{2}/g, '');
    const lama = /(?:(\d+(?:,\d+)?) jam)?\s*(?:(\d+) menit)?/g;
    const temuLama = [...tanpaJam.matchAll(lama)].filter((x) => x[1] !== undefined || x[2] !== undefined);
    if (jam.length !== 1 || temuLama.length !== 1 || cariAngka(tanpaJam).length !== (temuLama[0][1] && temuLama[0][2] ? 2 : 1)) return null;
    const jamLama = temuLama[0][1] ? angkaIndonesia(temuLama[0][1]) : dariBulat(0);
    if (!jamLama) return null;
    const menitLama = kali(jamLama, dariBulat(60));
    if (menitLama.q !== BigInt(1)) return null;
    const tiba = (jamKeMenit(jam[0][1], jam[0][2]) + Number(menitLama.p) + Number(temuLama[0][2] ?? 0)) % MENIT_SEHARI;
    const tulis = `pukul ${String(Math.floor(tiba / 60)).padStart(2, '0')}.${String(tiba % 60).padStart(2, '0')}`;
    return { pola: 'jam tiba', nilai: tulis, cocok: b.pilihan.filter((p) => p.teks.trim() === tulis).map((p) => p.huruf) };
  },
];

function bandingR(a: Rasional, b: Rasional): number {
  const s = a.p * b.q - b.p * a.q;
  return s === BigInt(0) ? 0 : s < BigInt(0) ? -1 : 1;
}

/** Satuan yang diharapkan dari kata tanya: volume → ³, luas → ², keliling/panjang → tanpa pangkat. */
function satuanHarapan(tanya: string): string | undefined {
  if (/volume/i.test(tanya)) return '³';
  if (/luas/i.test(tanya)) return '²';
  if (/keliling|panjang|jarak|tinggi/i.test(tanya)) return '¹';
  return undefined;
}

// ── PG kompleks: setiap pilihan dinilai satu per satu ──

/** Besaran bersatuan "2 kg 500 g", "1 jam 30 menit", "1 dm³" → [besaran, nilai dalam satuan dasar] */
function nilaiBesaran(teks: string): [string, Rasional] | null {
  const t = lepasPenanda(teks).trim();
  const bagian = [...t.matchAll(/(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*([A-Za-z]+[²³]?)/g)];
  if (bagian.length === 0 || bagian.map((x) => x[0]).join(' ') !== t.replace(/\s+/g, ' ')) return null;
  let besaran = '';
  let jumlah = dariBulat(0);
  for (const [, angka, satuan] of bagian) {
    const v = angkaIndonesia(angka);
    const s = SATUAN[bakuSatuan(satuan)];
    if (!v || !s || (besaran && s[0] !== besaran)) return null;
    besaran = s[0];
    jumlah = tambah(jumlah, kali(v, s[1]));
  }
  return [besaran, jumlah];
}

/** Nilai satu ungkapan: besaran bersatuan, bilangan, atau hitungan ("0,5 + 5%", "6 : {3/4}"). */
function nilaiUngkapan(teks: string): { besaran: string; v: Rasional } | null {
  const b = nilaiBesaran(teks);
  if (b) return { besaran: b[0], v: b[1] };
  const polos = lepasPenanda(teks).trim();
  const h = hitungEkspresiIndonesia(polos);
  if (h) return { besaran: '', v: h };
  if (/^(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s?%$|^(\d+ )?\d+\/\d+$|^(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)$/.test(polos)) {
    const a = cariAngka(polos);
    if (a.length === 1) return { besaran: '', v: a[0].persen ? bagi(a[0].nilai, dariBulat(100)) : a[0].nilai };
  }
  return null;
}

function adalahPrima(n: bigint): boolean {
  if (n < BigInt(2)) return false;
  for (let d = BigInt(2); d * d <= n; d++) if (n % d === BigInt(0)) return false;
  return true;
}

function hitungMandiriPGK(b: Butir): HitungMandiri | null {
  if (b.bentuk !== 'pgk') return null;
  const tanya = lepasPenanda(b.pertanyaan.replace(/\*\*/g, '')).replace(/\s*Jawaban benar bisa lebih dari satu\.?/, '').trim();
  let uji: ((teks: string) => boolean | null) | null = null;
  let pola = '';
  const banding = /yang (?:hasilnya|nilainya) (lebih besar|lebih kecil) dari (.+?)\.?$|(?:pecahan|bilangan|hitungan) yang (?:hasilnya )?(lebih besar|lebih kecil) dari (.+?)\.?$/.exec(tanya);
  const sama = /(?:yang|bentuk yang|bilangan yang|ukuran yang) (?:hasilnya|nilainya )?(?:sama dengan )?(.+?)\.?$/.exec(tanya);
  const kelipatan = /bilangan yang merupakan (kelipatan|faktor) (\d+)\.?$/.exec(tanya);
  if (/[Pp]ilih semua bilangan prima/.test(tanya)) {
    pola = 'bilangan prima';
    uji = (t) => {
      const v = nilaiUngkapan(t);
      return v && v.v.q === BigInt(1) ? adalahPrima(v.v.p) : null;
    };
  } else if (kelipatan) {
    const n = BigInt(kelipatan[2]);
    pola = `${kelipatan[1]} ${n}`;
    uji = (t) => {
      const v = nilaiUngkapan(t);
      if (!v || v.v.q !== BigInt(1) || v.v.p <= BigInt(0)) return null;
      return kelipatan[1] === 'kelipatan' ? v.v.p % n === BigInt(0) : n % v.v.p === BigInt(0);
    };
  } else if (banding) {
    const arah = banding[1] ?? banding[3];
    const x = nilaiUngkapan(banding[2] ?? banding[4]);
    if (!x) return null;
    pola = `${arah} dari ${keTeks(x.v)}`;
    uji = (t) => {
      const v = nilaiUngkapan(t);
      if (!v || v.besaran !== x.besaran) return null;
      const c = bandingR(v.v, x.v);
      return arah === 'lebih besar' ? c > 0 : c < 0;
    };
  } else if (sama && /hasilnya|nilainya|sama dengan/.test(tanya)) {
    const x = nilaiUngkapan(sama[1]);
    if (!x) return null;
    pola = `sama dengan ${keTeks(x.v)}${x.besaran ? ` (${x.besaran})` : ''}`;
    uji = (t) => {
      const v = nilaiUngkapan(t);
      if (!v || v.besaran !== x.besaran) return null;
      return samaDengan(v.v, x.v);
    };
  }
  if (!uji) return null;
  const benar: string[] = [];
  for (const p of b.pilihan) {
    const h = uji(p.teks);
    if (h === null) return null; // ada pilihan yang tidak bisa dinilai → jangan memutuskan
    if (h) benar.push(p.huruf);
  }
  const nilai = benar.join(', ') || '-';
  const cocok = benar.length === b.kunci.length && benar.every((h) => b.kunci.includes(h));
  return { pola: `PG kompleks: ${pola}`, nilai, pilihanCocok: nilai, hasil: cocok ? 'cocok' : 'beda' };
}

function hitungMandiri(b: Butir): HitungMandiri | null {
  if (b.bentuk === 'pgk') return hitungMandiriPGK(b);
  if (b.bentuk !== 'pg') return null;
  const tanya = b.pertanyaan.replace(/\*\*/g, '');
  const semua = [...(b.stimulus ?? []).map(teksBagian), b.pertanyaan].join('\n').replace(/\*\*/g, '');
  const putuskan = (pola: string, nilai: string, cocok: string[]): HitungMandiri | null => {
    if (cocok.length === 1) return { pola, nilai, pilihanCocok: cocok[0], hasil: cocok[0] === b.kunci ? 'cocok' : 'beda' };
    if (cocok.length === 0) return { pola, nilai, pilihanCocok: null, hasil: 'tidak_ada_pilihan' };
    return null; // lebih dari satu pilihan cocok → tidak bisa diputuskan
  };
  for (const pola of POLA_MANDIRI) {
    const r = pola(b, semua, tanya);
    if (!r) continue;
    const h = putuskan(r.pola, keTeks(r.nilai), pilihanBernilai(b, r.nilai, r.satuan));
    if (h) return h;
  }
  for (const pola of POLA_HURUF) {
    const r = pola(b, semua, b.pertanyaan);
    if (!r) continue;
    const h = putuskan(r.pola, r.nilai, r.cocok);
    if (h) return h;
  }
  return null;
}

// ───────────────────────────── pemeriksa utama ─────────────────────────────

/** Apakah butir ini butir Matematika (topik M.., PR-M.., atau paket simulasi S1–S4). */
export function butirMatematika(b: Butir): boolean {
  return /^(M\d|PR-M)/.test(b.topik) || /^S[1-4]$/.test(b.sumber);
}

export function periksaKunci(butir: Butir): HasilPeriksaKunci {
  const temuan: string[] = [];
  const ekspresi: HasilEkspresiButir[] = [];
  const nilaiSama: { nilai: Rasional; tunggal: boolean }[] = [];
  for (const baris of butir.periksa ?? []) {
    const h = jalankanPeriksa(baris);
    const e: HasilEkspresiButir = { teks: baris, hasil: h.hasil };
    if (h.pesan) e.pesan = h.pesan;
    ekspresi.push(e);
    nilaiSama.push(...h.nilaiSama);
    if (h.hasil === 'salah' || h.hasil === 'galat' || h.hasil === 'format') {
      temuan.push(`Periksa ${h.hasil}: ${baris}${h.pesan ? ` (${h.pesan})` : ''}`);
    }
  }

  // Kaitan hanya untuk PG Matematika. Di teks baca cepat, baris Periksa memeriksa kecocokan data
  // di dalam teks (misal jumlah tabel = total), bukan jawaban, jadi tidak dikaitkan ke pilihan.
  let kaitan: HasilPeriksaKunci['kaitan'] = 'tidak_terkait';
  if (butir.bentuk === 'pg' && butirMatematika(butir) && nilaiSama.length > 0) {
    let keKunci = false;
    const keLain = new Set<string>();
    for (const { nilai, tunggal } of nilaiSama) {
      let cocok = pilihanBernilai(butir, nilai);
      // nilai sama pada dua pilihan yang hanya beda satuan (42 cm³ dan 42 cm²): pakai satuan dari kata tanya
      if (cocok.length > 1) cocok = pilihanBernilai(butir, nilai, satuanHarapan(butir.pertanyaan));
      if (cocok.length !== 1) continue;
      // hanya perbandingan tunggal yang menjadi bukti (klausa `and` bisa memeriksa pengecoh)
      if (cocok[0] === butir.kunci) keKunci = keKunci || tunggal;
      else if (tunggal) keLain.add(cocok[0]);
    }
    if (keKunci) kaitan = 'cocok';
    else if (keLain.size > 0) {
      kaitan = 'beda';
      temuan.push(`nilai baris Periksa menunjuk pilihan ${[...keLain].join(', ')}, padahal kunci ${butir.kunci}`);
    }
  }

  const mandiri = hitungMandiri(butir);
  if (mandiri?.hasil === 'beda') {
    const kunci = butir.bentuk === 'pgkat' ? butir.kunci.join(', ') : butir.bentuk === 'pgk' ? butir.kunci.join(', ') : butir.kunci;
    temuan.push(`hitung ulang (${mandiri.pola}) = ${mandiri.nilai} → pilihan ${mandiri.pilihanCocok}, padahal kunci ${kunci}`);
  }

  const semuaEkspresiBenar = ekspresi.length > 0 && ekspresi.every((e) => e.hasil === 'benar' || e.hasil === 'lewati') && ekspresi.some((e) => e.hasil === 'benar');
  const dihitungUlang =
    temuan.length === 0 && (mandiri?.hasil === 'cocok' || kaitan === 'cocok' || (butir.bentuk !== 'pg' && semuaEkspresiBenar));
  return { butirId: butir.id, ekspresi, kaitan, hitungMandiri: mandiri, dihitungUlang, temuan };
}

