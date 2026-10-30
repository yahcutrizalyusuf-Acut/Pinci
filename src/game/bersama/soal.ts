/**
 * Pembuat soal hitung untuk game berjenjang (Kebun Pinci, Lompat Batu, Pasangkan Kartu, Balap Perahu).
 * Kunci jawaban selalu dihitung kode dari bentuk soal (CLAUDE.md aturan 10), bukan ditulis tangan.
 * Tingkat soal mengikuti kelas anak dan level game: level naik → angka dan operasi naik.
 */
import type { PembangkitAcak } from './acak';
import { kelompokKelas, type Kelas } from './jenis';
import type { Level } from './level';

export type Operasi = 'tambah' | 'kurang' | 'kali' | 'bagi' | 'pecahan' | 'persen' | 'kpk' | 'fpb' | 'campuran';

/** Bentuk soal: data yang dipakai untuk menghitung kunci dan menulis teks. */
export interface BentukSoal {
  op: Operasi;
  a: number;
  b: number;
  /** pecahan: pembilang; campuran: bilangan ketiga */
  c?: number;
}

export interface SoalHitung {
  id: string;
  bentuk: BentukSoal;
  teks: string;
  jawaban: number;
  /** pilihan jawaban (berisi jawaban), urutan acak */
  pilihan: number[];
  petunjuk: string;
}

function fpb(a: number, b: number): number {
  return b === 0 ? a : fpb(b, a % b);
}

/** Kunci jawaban dari bentuk soal. */
export function hitung(s: BentukSoal): number {
  switch (s.op) {
    case 'tambah':
      return s.a + s.b;
    case 'kurang':
      return s.a - s.b;
    case 'kali':
      return s.a * s.b;
    case 'bagi':
      return s.a / s.b;
    case 'pecahan':
      // (c/b) dari a
      return ((s.c ?? 1) * s.a) / s.b;
    case 'persen':
      return (s.b * s.a) / 100;
    case 'kpk':
      return (s.a * s.b) / fpb(s.a, s.b);
    case 'fpb':
      return fpb(s.a, s.b);
    case 'campuran':
      // a + b × c (perkalian dulu)
      return s.a + s.b * (s.c ?? 0);
  }
}

export function teksSoal(s: BentukSoal): string {
  switch (s.op) {
    case 'tambah':
      return `${s.a} + ${s.b}`;
    case 'kurang':
      return `${s.a} − ${s.b}`;
    case 'kali':
      return `${s.a} × ${s.b}`;
    case 'bagi':
      return `${s.a} : ${s.b}`;
    case 'pecahan':
      return `${s.c ?? 1}/${s.b} dari ${s.a}`;
    case 'persen':
      return `${s.b}% dari ${s.a}`;
    case 'kpk':
      return `KPK ${s.a} dan ${s.b}`;
    case 'fpb':
      return `FPB ${s.a} dan ${s.b}`;
    case 'campuran':
      return `${s.a} + ${s.b} × ${s.c ?? 0}`;
  }
}

function petunjukSoal(s: BentukSoal): string {
  switch (s.op) {
    case 'tambah':
      return `Mulai dari ${s.a}, lalu hitung maju ${s.b} langkah.`;
    case 'kurang':
      return `Mulai dari ${s.a}, lalu hitung mundur ${s.b} langkah.`;
    case 'kali':
      return `${s.a} × ${s.b} artinya ${s.b} ditambahkan ${s.a} kali.`;
    case 'bagi':
      return `Cari angka yang kalau dikali ${s.b} hasilnya ${s.a}.`;
    case 'pecahan':
      return `Bagi ${s.a} menjadi ${s.b} bagian sama besar, lalu ambil ${s.c ?? 1} bagian.`;
    case 'persen':
      return `${s.b}% artinya ${s.b} dari setiap 100. Mulai dari 10% dulu.`;
    case 'kpk':
      return `Tulis kelipatan ${s.a} dan kelipatan ${s.b}. Cari yang sama paling kecil.`;
    case 'fpb':
      return `Cari angka terbesar yang bisa membagi ${s.a} dan ${s.b} tanpa sisa.`;
    case 'campuran':
      return `Kerjakan perkalian dulu: ${s.b} × ${s.c ?? 0}, baru ditambah ${s.a}.`;
  }
}

function bentukUntuk(acak: PembangkitAcak, kelas: Kelas, level: Level): BentukSoal {
  const r = (a: number, b: number) => acak.bulat(a, b);
  const kelompok = kelompokKelas(kelas);
  const tambahKurang = (maks: number): BentukSoal => {
    if (acak.peluang(0.5)) {
      const a = r(1, maks - 1);
      return { op: 'tambah', a, b: r(1, maks - a) };
    }
    const a = r(2, maks);
    return { op: 'kurang', a, b: r(1, a - 1) };
  };
  const kali = (dari: number, sampai: number): BentukSoal => ({ op: 'kali', a: r(dari, sampai), b: r(2, 10) });
  const bagi = (dari: number, sampai: number): BentukSoal => {
    const b = r(dari, sampai);
    return { op: 'bagi', a: b * r(2, 10), b };
  };
  if (kelompok === 'awal') {
    if (level === 1) {
      const a = r(1, 8);
      return { op: 'tambah', a, b: r(1, 10 - a) };
    }
    if (level === 2) return tambahKurang(10);
    if (level === 3) return tambahKurang(20);
    if (level === 4) return tambahKurang(50);
    return acak.peluang(0.6) ? tambahKurang(100) : { op: 'kali', a: acak.pilih([2, 5, 10]), b: r(1, 10) };
  }
  if (kelompok === 'tengah') {
    if (level === 1) return tambahKurang(100);
    if (level === 2) return { op: 'kali', a: r(2, 5), b: r(2, 10) };
    if (level === 3) return kali(2, 10);
    if (level === 4) return acak.peluang(0.5) ? bagi(2, 10) : kali(2, 10);
    return acak.peluang(0.5) ? { op: 'campuran', a: r(2, 20), b: r(2, 9), c: r(2, 9) } : tambahKurang(1000);
  }
  if (level === 1) return acak.peluang(0.5) ? kali(6, 12) : bagi(6, 12);
  if (level === 2) return { op: 'kali', a: r(11, 25), b: r(2, 9) };
  if (level === 3) {
    const b = acak.pilih([2, 3, 4, 5]);
    const c = b === 2 ? 1 : r(1, b - 1);
    return { op: 'pecahan', a: b * r(2, 12), b, c };
  }
  if (level === 4) {
    const b = acak.pilih([10, 20, 25, 50]);
    const kel = b === 25 ? 4 : b === 20 ? 5 : b === 50 ? 2 : 10;
    return { op: 'persen', a: kel * r(2, 20), b };
  }
  if (acak.peluang(0.5)) {
    const [a, b] = acak.pilih([[4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [9, 12], [10, 15], [12, 18], [3, 4], [5, 6]] as const);
    return { op: acak.peluang(0.5) ? 'kpk' : 'fpb', a, b };
  }
  return { op: 'campuran', a: r(5, 40), b: r(3, 12), c: r(3, 12) };
}

/** Pilihan pengecoh yang dekat dan masuk akal (paling kecil 1, tidak kembar). */
export function buatPilihan(acak: PembangkitAcak, s: BentukSoal, jawaban: number, n: number): number[] {
  const calon = [jawaban + 1, jawaban - 1, jawaban + 2, jawaban - 2, jawaban + 10, jawaban - 10, jawaban + s.b, jawaban - s.b];
  if (s.op === 'kali' || s.op === 'campuran') calon.push(s.a + s.b, (s.a + s.b) * (s.c ?? 1));
  if (s.op === 'kpk') calon.push(s.a * s.b, Math.max(s.a, s.b));
  if (s.op === 'fpb') calon.push(Math.min(s.a, s.b), 1);
  const pengecoh: number[] = [];
  for (const c of acak.acakUrutan(calon)) {
    if (pengecoh.length >= n - 1) break;
    if (Number.isInteger(c) && c >= 1 && c !== jawaban && !pengecoh.includes(c)) pengecoh.push(c);
  }
  let tambah = 3;
  while (pengecoh.length < n - 1) {
    const c = jawaban + tambah++;
    if (!pengecoh.includes(c)) pengecoh.push(c);
  }
  return acak.acakUrutan([jawaban, ...pengecoh]);
}

/** Satu soal hitung berkunci (dihitung) dengan `nPilihan` pilihan. */
export function buatSoalHitung(acak: PembangkitAcak, kelas: Kelas, level: Level, nPilihan = 3, id = 'soal'): SoalHitung {
  let bentuk = bentukUntuk(acak, kelas, level);
  // Jawaban selalu bulat dan tidak negatif.
  for (let i = 0; i < 50 && !(Number.isInteger(hitung(bentuk)) && hitung(bentuk) >= 0); i++) bentuk = bentukUntuk(acak, kelas, level);
  const jawaban = hitung(bentuk);
  return { id, bentuk, teks: teksSoal(bentuk), jawaban, pilihan: buatPilihan(acak, bentuk, jawaban, nPilihan), petunjuk: petunjukSoal(bentuk) };
}

/** Beberapa soal berbeda (teks tidak kembar). */
export function buatDaftarSoal(acak: PembangkitAcak, kelas: Kelas, level: Level, jumlah: number, nPilihan = 3): SoalHitung[] {
  const hasil: SoalHitung[] = [];
  const teks = new Set<string>();
  for (let coba = 0; hasil.length < jumlah && coba < jumlah * 30; coba++) {
    const s = buatSoalHitung(acak, kelas, level, nPilihan, `soal-${hasil.length + 1}`);
    if (teks.has(s.teks)) continue;
    teks.add(s.teks);
    hasil.push(s);
  }
  while (hasil.length < jumlah) hasil.push(buatSoalHitung(acak, kelas, level, nPilihan, `soal-${hasil.length + 1}`));
  return hasil;
}
