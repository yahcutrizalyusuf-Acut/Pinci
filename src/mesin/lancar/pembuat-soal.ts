/**
 * Pembuat soal (dipindahkan dari purwarupa v5, `latihan-hitung-cepat-v5.html`).
 * Perubahan dari purwarupa: lambang bagi ":" (bukan "÷"), pecahan ditulis
 * "1/2" (bukan "½"), kelas 5 L1 hasil ≤ 200, kelas 6 L2–L3 diganti
 * (pecahan ↔ persen ↔ desimal; KPK dan FPB), dan setiap soal membawa
 * keluarga fakta serta tingkat kesulitan.
 *
 * Kunci di sini dihitung dengan aritmetika bilangan bulat biasa. Pemeriksa
 * kunci (`periksa-kunci.ts`) menghitung ulang dengan cara lain.
 */
import type { Acak } from './acak';
import type { BentukJawaban } from './jenis';

export const MIN = '−';
export const KALI = '×';
export const BAGI = ':';

/** Soal sebelum diberi kelas, level, dan target. */
export interface SoalMentah {
  teks: string;
  kunci: string;
  bentukJawaban: BentukJawaban;
  /** 0 < tingkat < 1, peringkat kesulitan di dalam kumpulannya. */
  tingkat: number;
  keluarga: string;
}

/** Membuat paling banyak n soal unik, sudah urut dari mudah ke sulit. */
export type PembuatSoal = (r: Acak, n: number) => SoalMentah[];

interface Calon {
  teks: string;
  kunci: string;
  bentukJawaban: BentukJawaban;
  /** Perkiraan kesulitan mentah (skala bebas per jenis soal). */
  z: number;
  keluarga: string;
}

const BATAS_COBA = 5000;

function bil(teks: string, nilai: number, z: number, keluarga: string): Calon {
  return { teks, kunci: String(nilai), bentukJawaban: 'bilangan', z, keluarga };
}

function fpbBulat(a: number, b: number): number {
  return b === 0 ? a : fpbBulat(b, a % b);
}

/**
 * n soal unik, diurutkan kira-kira dari mudah ke sulit (dengan sedikit acak,
 * seperti purwarupa). Tingkat = peringkat / banyak soal, jadi tersebar rata 0–1.
 */
export function kumpul(r: Acak, n: number, buat: () => Calon | null): SoalMentah[] {
  const hasil: Calon[] = [];
  const ada = new Set<string>();
  for (let t = 0; t < BATAS_COBA && hasil.length < n; t++) {
    const c = buat();
    if (c && !ada.has(c.teks)) {
      ada.add(c.teks);
      hasil.push(c);
    }
  }
  if (hasil.length === 0) return [];
  const zs = hasil.map((c) => c.z);
  const sebar = Math.max(1, (Math.max(...zs) - Math.min(...zs)) * 0.3);
  const berkunci = hasil.map((c) => ({ c, k: c.z + r.berikut() * sebar }));
  berkunci.sort((x, y) => x.k - y.k);
  return berkunci.map(({ c }, i) => ({
    teks: c.teks,
    kunci: c.kunci,
    bentukJawaban: c.bentukJawaban,
    keluarga: c.keluarga,
    tingkat: (i + 0.5) / berkunci.length,
  }));
}

/** Gabungan beberapa jenis soal; hasilnya tetap urut menurut tingkat. */
export function campur(r: Acak, daftar: readonly (readonly [PembuatSoal, number])[]): SoalMentah[] {
  const ada = new Set<string>();
  const keluar: SoalMentah[] = [];
  for (const [pembuat, n] of daftar) {
    for (const s of pembuat(r, n)) {
      if (!ada.has(s.teks)) {
        ada.add(s.teks);
        keluar.push(s);
      }
    }
  }
  return keluar.sort((a, b) => a.tingkat - b.tingkat);
}

// ---------- kelas 1 ----------
export const tambah10: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(1, 9);
    const b = r.bulat(1, 9);
    if (a + b > 10) return null;
    return bil(`${a} + ${b}`, a + b, a + b, '+ sampai 10');
  });

export const kurang10: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 10);
    const b = r.bulat(1, a - 1);
    return bil(`${a} ${MIN} ${b}`, a - b, a, '− sampai 10');
  });

export const tambahBelasan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const x = r.bulat(0, 8);
    const b = r.bulat(1, 9);
    if (x + b > 9) return null;
    const a = 10 + x;
    return r.berikut() < 0.75
      ? bil(`${a} + ${b}`, a + b, b, '+ belasan')
      : bil(`${b} + ${a}`, a + b, b + 2, '+ belasan');
  });

export const tambah20: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 9);
    const b = r.bulat(2, 9);
    if (a + b < 11) return null;
    return bil(`${a} + ${b}`, a + b, a + b, '+ lewat 10');
  });

export const kurang20: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(11, 19);
    const b = r.bulat(2, 9);
    const pinjam = a % 10 < b;
    if (!pinjam && r.berikut() < 0.6) return null;
    return bil(`${a} ${MIN} ${b}`, a - b, (pinjam ? 10 : 0) + b, pinjam ? '− lewat 10' : '− belasan');
  });

// ---------- kelas 2 ----------
export const puluhan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(1, 9);
    const b = r.bulat(1, 9);
    if (r.berikut() < 0.5) {
      if (a + b > 10) return null;
      return bil(`${a * 10} + ${b * 10}`, (a + b) * 10, a + b, '+ puluhan');
    }
    if (a <= b) return null;
    return bil(`${a * 10} ${MIN} ${b * 10}`, (a - b) * 10, a, '− puluhan');
  });

export const tambah2d1: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(11, 89);
    const b = r.bulat(2, 9);
    if (a % 10 === 0) return null;
    const simpan = (a % 10) + b >= 10;
    return bil(`${a} + ${b}`, a + b, (simpan ? 10 : 0) + b, simpan ? '2 angka + 1 angka, simpan' : '2 angka + 1 angka');
  });

export const kurang2d1: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(21, 99);
    const b = r.bulat(2, 9);
    if (a % 10 === 0) return null;
    const pinjam = a % 10 < b;
    return bil(`${a} ${MIN} ${b}`, a - b, (pinjam ? 10 : 0) + b, pinjam ? '2 angka − 1 angka, pinjam' : '2 angka − 1 angka');
  });

/** Perkalian tabel: keluarga `fams`, pengali dari d sampai s. */
export const kali =
  (fams: readonly number[], d = 1, s = 10): PembuatSoal =>
  (r, n) =>
    kumpul(r, n, () => {
      const b = r.pilih(fams);
      const x = r.bulat(d, s);
      return r.berikut() < 0.8
        ? bil(`${x} ${KALI} ${b}`, x * b, x * b, `${KALI}${b}`)
        : bil(`${b} ${KALI} ${x}`, x * b, x * b + 3, `${KALI}${b}`);
    });

/** Pembagian dari tabel perkalian. */
export const bagi =
  (fams: readonly number[], d = 1, s = 10): PembuatSoal =>
  (r, n) =>
    kumpul(r, n, () => {
      const b = r.pilih(fams);
      const x = r.bulat(d, s);
      return bil(`${x * b} ${BAGI} ${b}`, x, x * b, `${BAGI}${b}`);
    });

export const duaPuluhan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(11, 69);
    const b = r.bulat(1, 3) * 10;
    if (a % 10 === 0) return null;
    if (r.berikut() < 0.5) {
      if (a + b > 99) return null;
      return bil(`${a} + ${b}`, a + b, a, '+ puluhan');
    }
    if (a - b < 1) return null;
    return bil(`${a} ${MIN} ${b}`, a - b, a, '− puluhan');
  });

// ---------- kelas 3 ----------
export const tambah2d2: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(12, 69);
    const b = r.bulat(11, 29);
    if (a + b > 99 || a % 10 === 0 || b % 10 === 0) return null;
    const simpan = (a % 10) + (b % 10) >= 10;
    return bil(`${a} + ${b}`, a + b, (simpan ? 30 : 0) + a + b, simpan ? '2 angka + 2 angka, simpan' : '2 angka + 2 angka');
  });

export const kurang2d2: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(31, 99);
    const b = r.bulat(11, 29);
    if (a - b < 5 || a % 10 === 0 || b % 10 === 0) return null;
    const pinjam = a % 10 < b % 10;
    return bil(`${a} ${MIN} ${b}`, a - b, (pinjam ? 30 : 0) + a, pinjam ? '2 angka − 2 angka, pinjam' : '2 angka − 2 angka');
  });

// ---------- kelas 4 ----------
export const kaliPuluhan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 9);
    const b = r.bulat(2, 9);
    const jenis = r.pilih([0, 0, 1, 2]);
    if (jenis === 0) return bil(`${a} ${KALI} ${b * 10}`, a * b * 10, a * b, `${KALI} puluhan`);
    if (jenis === 1) {
      if (b > 5) return null;
      return bil(`${a} ${KALI} ${b * 100}`, a * b * 100, a * b + 20, `${KALI} ratusan`);
    }
    if (a * b > 30) return null;
    return bil(`${a * 10} ${KALI} ${b * 10}`, a * b * 100, a * b + 30, `puluhan ${KALI} puluhan`);
  });

export const kali2d1Kecil: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(11, 25);
    const b = r.bulat(2, 6);
    if (a % 10 === 0 || a * b > 150) return null;
    return bil(`${a} ${KALI} ${b}`, a * b, a * b, `2 angka ${KALI}${b}`);
  });

export const bagiBelasan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const q = r.bulat(11, 19);
    const b = r.bulat(2, 6);
    if (q * b > 99) return null;
    return bil(`${q * b} ${BAGI} ${b}`, q, q * b, `2 angka ${BAGI}${b}`);
  });

export const ratusan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const jenis = r.pilih([0, 1, 2]);
    if (jenis === 0) {
      const a = r.bulat(11, 60) * 10;
      const b = r.bulat(11, 40) * 10;
      if (a + b > 1000) return null;
      return bil(`${a} + ${b}`, a + b, a + b, '+ ratusan');
    }
    if (jenis === 1) {
      const a = r.bulat(2, 9) * 100;
      const b = r.bulat(3, 19) * 10;
      if (b >= a) return null;
      return bil(`${a} ${MIN} ${b}`, a - b, a, '− ratusan');
    }
    const a = r.bulat(21, 79);
    const b = r.bulat(12, 29);
    if (a + b > 99 || a % 10 === 0 || b % 10 === 0) return null;
    return bil(`${a} + ${b}`, a + b, a + b, '2 angka + 2 angka');
  });

// ---------- kelas 5 ----------
/** 2 angka × 1 angka, hasil ≤ 200 (diturunkan 20 Okt dari ≤ 400). */
export const kali2d1Besar: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(12, 49);
    const b = r.bulat(3, 9);
    if (a % 10 === 0 || a * b > 200) return null;
    return bil(`${a} ${KALI} ${b}`, a * b, a * b, `2 angka ${KALI}${b}`);
  });

export const bagiPuluhan: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const b = r.bulat(2, 9);
    if (r.berikut() < 0.6) {
      const x = r.bulat(2, 9) * 10;
      return bil(`${x * b} ${BAGI} ${b}`, x, x * b, `puluhan ${BAGI}${b}`);
    }
    const q = r.bulat(11, 25);
    if (q * b > 150 || b > 6) return null;
    return bil(`${q * b} ${BAGI} ${b}`, q, q * b + 50, `2 angka ${BAGI}${b}`);
  });

export const kali11Dan25: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    if (r.berikut() < 0.5) {
      const a = r.bulat(12, 45);
      const jumlahAngka = Math.floor(a / 10) + (a % 10);
      if (jumlahAngka > 9 || a % 10 === 0) return null;
      return bil(`${a} ${KALI} 11`, a * 11, a, `${KALI}11`);
    }
    const a = r.pilih([2, 3, 4, 5, 6, 8, 10, 12, 16, 20]);
    return r.berikut() < 0.7
      ? bil(`${a} ${KALI} 25`, a * 25, a * 2, `${KALI}25`)
      : bil(`25 ${KALI} ${a}`, a * 25, a * 2 + 2, `${KALI}25`);
  });

export const kuadrat15: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 15);
    return r.berikut() < 0.75
      ? bil(`${a} ${KALI} ${a}`, a * a, a, 'kuadrat')
      : bil(`${a}²`, a * a, a + 1, 'kuadrat');
  });

const PECAHAN_DARI: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 2],
  [1, 4],
  [1, 3],
  [1, 5],
  [3, 4],
  [2, 3],
];

export const pecahanDari: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const [pembilang, penyebut] = r.pilih(PECAHAN_DARI);
    const dasar = penyebut * r.bulat(2, penyebut === 2 ? 30 : 12);
    const hasil = (dasar / penyebut) * pembilang;
    return bil(`${pembilang}/${penyebut} dari ${dasar}`, hasil, hasil + (pembilang > 1 ? 20 : 0), `${pembilang}/${penyebut} dari`);
  });

// ---------- kelas 6 ----------
export const kuadratDanAkar: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 15);
    return r.berikut() < 0.5 ? bil(`${a}²`, a * a, a, 'kuadrat') : bil(`√${a * a}`, a, a, 'akar');
  });

/** Pecahan sederhana yang setara dengan persen bulat dan desimal pendek. */
const PECAHAN_SETARA: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [1, 10],
  [3, 10],
  [7, 10],
  [9, 10],
];

/** Persen bulat (< 100) → teks desimal berkoma, mis. 75 → "0,75", 40 → "0,4". */
function persenKeDesimal(persen: number): string {
  if (persen % 10 === 0) return `0,${persen / 10}`;
  return `0,${String(persen).padStart(2, '0')}`;
}

export const PECAHAN_SEDERHANA = '(pecahan paling sederhana)';

/**
 * Kelas 6 L2: pecahan ↔ persen ↔ desimal setara. Enam arah:
 * pecahan→persen, desimal→persen (jawab bilangan), persen→desimal,
 * pecahan→desimal (jawab desimal), desimal→pecahan, persen→pecahan
 * (jawab pecahan paling sederhana).
 */
export const pecahanPersenDesimal: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const [p, q] = r.pilih(PECAHAN_SETARA);
    const persen = (p * 100) / q;
    const desimal = persenKeDesimal(persen);
    const arah = r.pilih([0, 0, 1, 2, 3, 4, 5]);
    switch (arah) {
      case 0: {
        // kadang ditulis dalam bentuk tidak sederhana, mis. 2/4, 6/10
        const k = q <= 5 && r.berikut() < 0.3 ? 2 : 1;
        return bil(`${p * k}/${q * k} = … %`, persen, q + (k > 1 ? 3 : 0), 'pecahan → persen');
      }
      case 1:
        return bil(`${desimal} = … %`, persen, 5 + q, 'desimal → persen');
      case 2:
        return { teks: `${persen}% = … (desimal)`, kunci: desimal, bentukJawaban: 'desimal', z: 10 + q, keluarga: 'persen → desimal' };
      case 3:
        return { teks: `${p}/${q} = … (desimal)`, kunci: desimal, bentukJawaban: 'desimal', z: 12 + q, keluarga: 'pecahan → desimal' };
      case 4:
        return { teks: `${desimal} = … ${PECAHAN_SEDERHANA}`, kunci: `${p}/${q}`, bentukJawaban: 'pecahan', z: 18 + q, keluarga: 'desimal → pecahan' };
      default:
        return { teks: `${persen}% = … ${PECAHAN_SEDERHANA}`, kunci: `${p}/${q}`, bentukJawaban: 'pecahan', z: 20 + q, keluarga: 'persen → pecahan' };
    }
  });

/** Kelas 6 L3: KPK dan FPB bilangan kecil (KPK ≤ 60, bilangan ≤ 60). */
export const kpkFpb: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    if (r.berikut() < 0.5) {
      const a = r.bulat(2, 12);
      const b = r.bulat(2, 12);
      if (a >= b) return null;
      const kpk = (a * b) / fpbBulat(a, b);
      if (kpk > 60) return null;
      if (b % a === 0 && r.berikut() < 0.7) return null;
      return bil(`KPK ${a} dan ${b}`, kpk, kpk, 'KPK');
    }
    const g = r.bulat(2, 9);
    const m = r.bulat(1, 5);
    const k = r.bulat(2, 6);
    if (m >= k || fpbBulat(k, m) !== 1) return null;
    const a = g * m;
    const b = g * k;
    if (b > 60) return null;
    if (m === 1 && r.berikut() < 0.7) return null;
    return bil(`FPB ${a} dan ${b}`, g, b, 'FPB');
  });

export const persenMudah: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const p = r.pilih([10, 10, 20, 25, 50, 50, 75]);
    const kelipatan: Record<number, number> = { 10: 10, 20: 5, 25: 4, 50: 2, 75: 4 };
    const dasar = (kelipatan[p] ?? 1) * r.bulat(2, p === 10 ? 30 : 20);
    if (dasar > 400) return null;
    const hasil = (dasar * p) / 100;
    return bil(`${p}% dari ${dasar}`, hasil, hasil + (p === 75 ? 30 : 0), `${p}%`);
  });

export const urutanOperasi: PembuatSoal = (r, n) =>
  kumpul(r, n, () => {
    const a = r.bulat(2, 20);
    const b = r.bulat(2, 9);
    const c = r.bulat(2, 9);
    const j = r.pilih([0, 1, 2, 3, 4]);
    const kel = 'urutan operasi';
    if (j === 0) return bil(`${a} + ${b} ${KALI} ${c}`, a + b * c, a + b * c, kel);
    if (j === 1) {
      if (a + 20 - b * c < 0) return null;
      return bil(`${a + 20} ${MIN} ${b} ${KALI} ${c}`, a + 20 - b * c, 30 + b * c, kel);
    }
    if (j === 2) return bil(`${b} ${KALI} ${c} + ${a}`, b * c + a, a + b * c, kel);
    if (j === 3) return bil(`${b * c} ${BAGI} ${b} + ${a}`, c + a, a + c + 10, kel);
    if (b + c > 12) return null;
    const m = r.bulat(2, 5);
    return bil(`(${b} + ${c}) ${KALI} ${m}`, (b + c) * m, 40, kel);
  });
