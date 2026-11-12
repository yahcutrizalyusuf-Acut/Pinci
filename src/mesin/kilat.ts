/**
 * Mesin Hitung Kilat: latihan cepat hitung dasar dengan bilangan di bawah 10 (keputusan Acut 12 Nov 2026).
 * Tujuan: kecepatan berpikir, menjaga dan memperpanjang konsentrasi, hasil tercatat. Murni data, tanpa React.
 *
 * - 7 tahap: tambah → kurang → tambah-kurang → kali → bagi → kali-bagi → campur semua. Kelas 1–2 berhenti di tahap 3.
 * - Satu lembar: 30 soal (kelas 1–2) atau 50 soal (kelas 3–6). Waktu berjalan maju dan dicatat (bukan hitung mundur).
 * - Naik tahap: 2 lembar terakhir di tahap itu ≥ 95% benar dan rata-rata ≤ target detik per soal.
 * - Kunci dihitung kode (CLAUDE.md aturan 10).
 */
import type { SoalLancar } from './lancar';
import { buatAcak } from './lancar';

export type OperasiKilat = '+' | '-' | '×' | ':';

export interface TahapKilat {
  no: number;
  nama: string;
  operasi: OperasiKilat[];
}

export const TAHAP_KILAT: TahapKilat[] = [
  { no: 1, nama: 'Tambah', operasi: ['+'] },
  { no: 2, nama: 'Kurang', operasi: ['-'] },
  { no: 3, nama: 'Tambah dan kurang', operasi: ['+', '-'] },
  { no: 4, nama: 'Kali', operasi: ['×'] },
  { no: 5, nama: 'Bagi', operasi: [':'] },
  { no: 6, nama: 'Kali dan bagi', operasi: ['×', ':'] },
  { no: 7, nama: 'Campur semua', operasi: ['+', '-', '×', ':'] },
];

/** Persen benar minimal dan banyak lembar berturut-turut untuk naik tahap. */
export const SYARAT_NAIK = { persen: 95, lembar: 2 } as const;

export function tahapMaks(kelas: number): number {
  return kelas <= 2 ? 3 : TAHAP_KILAT.length;
}

export function jumlahSoal(kelas: number): number {
  return kelas <= 2 ? 30 : 50;
}

/** Target rata-rata detik per soal untuk naik tahap. */
export function targetDetik(kelas: number): number {
  return kelas <= 2 ? 4 : 3;
}

export function tahapKilat(no: number): TahapKilat {
  return TAHAP_KILAT[Math.min(Math.max(no, 1), TAHAP_KILAT.length) - 1];
}

/** Hitung hasil satu operasi (kunci dihitung kode). */
export function hitungKilat(a: number, op: OperasiKilat, b: number): number {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×') return a * b;
  if (b === 0) throw new Error('Pembagian dengan nol');
  return a / b;
}

/** Semua soal yang mungkin untuk satu operasi: bilangan di bawah 10, hasil bilangan cacah. */
export function semuaSoal(op: OperasiKilat): [number, number][] {
  const hasil: [number, number][] = [];
  for (let a = 1; a <= 9; a++)
    for (let b = 1; b <= 9; b++) {
      if (op === '+' || op === '×') hasil.push([a, b]);
      else if (op === '-' && a >= b) hasil.push([a, b]);
      else if (op === ':') hasil.push([a * b, b]); // hasil bagi a, pembagi b: 1–9
    }
  return hasil;
}

/** Satu lembar Hitung Kilat dari benih (susunan sama untuk benih yang sama). Soal berurutan tidak sama persis. */
export function buatLembarKilat(tahap: number, kelas: number, benih: string, jumlah = jumlahSoal(kelas)): SoalLancar[] {
  const t = tahapKilat(tahap);
  const acak = buatAcak(`kilat-${tahap}-${benih}`);
  const kolam = t.operasi.map((op) => ({ op, soal: semuaSoal(op) }));
  const lembar: SoalLancar[] = [];
  let sebelum = '';
  while (lembar.length < jumlah) {
    const k = acak.pilih(kolam);
    const [a, b] = acak.pilih(k.soal);
    const teks = `${a} ${k.op} ${b}`;
    if (teks === sebelum) continue;
    sebelum = teks;
    lembar.push({
      id: `kilat-${tahap}-${lembar.length + 1}`,
      teks,
      kunci: String(hitungKilat(a, k.op, b)),
      bentukJawaban: 'bilangan',
      tingkat: 0.5,
      level: tahap,
      kelas,
      keluarga: `${k.op}${b}`,
      targetDetik: targetDetik(kelas),
      asal: 'baru',
    });
  }
  return lembar;
}

export interface HasilLembarKilat {
  tahap: number;
  benar: number;
  jumlah: number;
  /** jumlah detik semua soal (jeda tidak dihitung) */
  detik: number;
  /** ISO */
  mulai: string;
}

export function persenBenar(h: Pick<HasilLembarKilat, 'benar' | 'jumlah'>): number {
  return h.jumlah ? Math.round((h.benar / h.jumlah) * 100) : 0;
}

export function detikPerSoal(h: Pick<HasilLembarKilat, 'detik' | 'jumlah'>): number {
  return h.jumlah ? Math.round((h.detik / h.jumlah) * 10) / 10 : 0;
}

/** Lembar ini memenuhi syarat naik (tepat dan cukup cepat). */
export function lembarLulus(h: HasilLembarKilat, kelas: number): boolean {
  return persenBenar(h) >= SYARAT_NAIK.persen && detikPerSoal(h) <= targetDetik(kelas);
}

/**
 * Tahap yang sedang dilatih dari riwayat (urut waktu). Mulai di tahap 1; naik bila 2 lembar terakhir di tahap tertinggi
 * yang dicapai lulus. Tidak pernah turun. Paling tinggi `tahapMaks(kelas)`.
 */
export function tahapSekarang(riwayat: HasilLembarKilat[], kelas: number): number {
  const maks = tahapMaks(kelas);
  let tahap = 1;
  let berturut = 0;
  for (const h of [...riwayat].sort((a, b) => a.mulai.localeCompare(b.mulai))) {
    if (h.tahap !== tahap) continue;
    berturut = lembarLulus(h, kelas) ? berturut + 1 : 0;
    if (berturut >= SYARAT_NAIK.lembar && tahap < maks) {
      tahap += 1;
      berturut = 0;
    }
  }
  return Math.min(tahap, maks);
}

/** Rekor: waktu tercepat di tahap ini dari lembar yang ≥ 95% benar, atau null. */
export function rekorTahap(riwayat: HasilLembarKilat[], tahap: number): number | null {
  const lulus = riwayat.filter((h) => h.tahap === tahap && persenBenar(h) >= SYARAT_NAIK.persen);
  if (!lulus.length) return null;
  return Math.min(...lulus.map((h) => h.detik));
}

/** Tulisan waktu "1:05" dari detik. */
export function tulisWaktu(detik: number): string {
  const d = Math.max(0, Math.round(detik));
  return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`;
}
