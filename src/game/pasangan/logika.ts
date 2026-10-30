/**
 * Logika Pasangkan Kartu (memori). TypeScript murni, tanpa React.
 * Kartu tertutup dibuka dua-dua. Pasangan cocok tetap terbuka; yang belum cocok menutup lagi
 * (tanpa hukuman). Setelah 2 kali belum cocok berturut-turut, Pinci menyorot satu kartu yang
 * pasangannya sudah pernah dibuka. Semua pasangan ditemukan = babak selesai.
 *
 * Level ganjil: soal hitung ↔ hasilnya (kunci dihitung kode). Level genap: kata Inggris ↔ gambar.
 */
import type { PaketInggris } from '../../isi/inggris/jenis';
import { buatAcak, type PembangkitAcak } from '../bersama/acak';
import { BATAS_SALAH_PETUNJUK, type Kelas } from '../bersama/jenis';
import { pilihKejutan, type Kejutan } from '../bersama/kejutan';
import { tingkatDariLevel, type Level } from '../bersama/level';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';
import { buatSoalHitung } from '../bersama/soal';

export const PASANGAN_PER_LEVEL: Record<Level, number> = { 1: 3, 2: 4, 3: 6, 4: 8, 5: 10 };

export interface KartuMemori {
  /** indeks kartu di meja */
  id: number;
  /** kunci pasangan: dua kartu dengan kunci sama adalah pasangan */
  pasangan: string;
  isi: string;
  jenis: 'soal' | 'hasil' | 'kata' | 'gambar';
  /** kata Inggris untuk diucapkan saat kartu dibuka */
  ucapan?: string;
}

export interface KeadaanPasangan {
  game: 'pasangan';
  kelas: Kelas;
  level: Level;
  tema: 'hitung' | 'inggris';
  kartu: readonly KartuMemori[];
  /** kartu terbuka yang belum cocok (0–2) */
  terbuka: readonly number[];
  /** kunci pasangan yang sudah ditemukan */
  ditemukan: readonly string[];
  /** kartu yang pernah dibuka (untuk petunjuk) */
  dilihat: readonly number[];
  salahBeruntun: number;
  /** kartu yang disorot Pinci, atau null */
  sorot: number | null;
  petunjuk: string | null;
  fase: 'main' | 'tunggu_tutup' | 'selesai';
  kejutan: Kejutan | null;
  benihAcak: number;
  perkiraanDetik: number;
  catatan: { pasangan: number; buka: number; petunjuk: number };
}

export type AksiPasangan = { jenis: 'buka'; id: number } | { jenis: 'tutup' };

export const DETIK_PASANGAN = { buka: 3, tutup: 1 } as const;

function pasanganHitung(acak: PembangkitAcak, kelas: Kelas, level: Level, n: number): [string, string, string][] {
  const hasil: [string, string, string][] = [];
  const dipakai = new Set<number>();
  for (let coba = 0; hasil.length < n && coba < n * 60; coba++) {
    const s = buatSoalHitung(acak, kelas, level, 2);
    if (dipakai.has(s.jawaban)) continue;
    dipakai.add(s.jawaban);
    hasil.push([`h${s.jawaban}`, s.teks, String(s.jawaban)]);
  }
  return hasil;
}

function tingkatInggris(kelas: Kelas): 3 | 4 | 5 | 6 {
  return kelas <= 3 ? 3 : (kelas as 4 | 5 | 6);
}

function pasanganInggris(acak: PembangkitAcak, paket: PaketInggris, n: number): [string, string, string][] {
  const semua = paket.unit.flatMap((u) => u.kosakata).filter((k) => k.emoji);
  const unik = new Map<string, (typeof semua)[number]>();
  for (const k of semua) if (![...unik.values()].some((x) => x.emoji === k.emoji)) unik.set(k.kata, k);
  return acak.ambilBeberapa([...unik.values()], n).map((k) => [`k-${k.kata}`, k.kata, k.emoji]);
}

export function buatBabak(opsi: { kelas: Kelas; level: Level; benih: number; paketInggris?: Partial<Record<3 | 4 | 5 | 6, PaketInggris>> }): KeadaanPasangan {
  const acak = buatAcak(opsi.benih);
  const n = PASANGAN_PER_LEVEL[opsi.level];
  const paket = opsi.paketInggris?.[tingkatInggris(opsi.kelas)];
  const tema = opsi.level % 2 === 0 && paket ? 'inggris' : 'hitung';
  const pasang = tema === 'inggris' && paket ? pasanganInggris(acak, paket, n) : pasanganHitung(acak, opsi.kelas, opsi.level, n);
  const kartuAwal = pasang.flatMap(([kunci, a, b]): Omit<KartuMemori, 'id'>[] =>
    tema === 'inggris'
      ? [
          { pasangan: kunci, isi: a, jenis: 'kata', ucapan: a },
          { pasangan: kunci, isi: b, jenis: 'gambar', ucapan: a },
        ]
      : [
          { pasangan: kunci, isi: a, jenis: 'soal' },
          { pasangan: kunci, isi: b, jenis: 'hasil' },
        ],
  );
  const kartu = acak.acakUrutan(kartuAwal).map((k, id) => ({ ...k, id }));
  return {
    game: 'pasangan',
    kelas: opsi.kelas,
    level: opsi.level,
    tema,
    kartu,
    terbuka: [],
    ditemukan: [],
    dilihat: [],
    salahBeruntun: 0,
    sorot: null,
    petunjuk: null,
    fase: 'main',
    kejutan: null,
    benihAcak: acak.keadaan,
    perkiraanDetik: 0,
    catatan: { pasangan: 0, buka: 0, petunjuk: 0 },
  };
}

/** Kartu ini sedang terlihat (terbuka atau sudah ditemukan)? */
export function terlihat(k: KeadaanPasangan, id: number): boolean {
  return k.terbuka.includes(id) || k.ditemukan.includes(k.kartu[id]?.pasangan ?? '');
}

/** Kartu yang pasangannya sudah pernah dilihat dan belum ditemukan: bahan petunjuk. */
function cariSorot(k: KeadaanPasangan, dilihat: readonly number[], ditemukan: readonly string[]): number | null {
  for (const a of dilihat) {
    const ka = k.kartu[a];
    if (!ka || ditemukan.includes(ka.pasangan)) continue;
    const b = dilihat.find((x) => x !== a && k.kartu[x]?.pasangan === ka.pasangan);
    if (b !== undefined) return a;
  }
  return null;
}

export function langkah(k: KeadaanPasangan, aksi: AksiPasangan): KeadaanPasangan {
  if (k.fase === 'selesai') return k;
  if (aksi.jenis === 'tutup') {
    if (k.fase !== 'tunggu_tutup') return k;
    return { ...k, terbuka: [], fase: 'main', perkiraanDetik: k.perkiraanDetik + DETIK_PASANGAN.tutup };
  }
  if (k.fase !== 'main' || terlihat(k, aksi.id) || !k.kartu[aksi.id]) return k;
  const acak = buatAcak(k.benihAcak);
  const kejutan = pilihKejutan(acak, k.kejutan);
  const terbuka = [...k.terbuka, aksi.id];
  const dilihat = k.dilihat.includes(aksi.id) ? k.dilihat : [...k.dilihat, aksi.id];
  const dasar = {
    ...k,
    terbuka,
    dilihat,
    kejutan,
    benihAcak: acak.keadaan,
    perkiraanDetik: k.perkiraanDetik + DETIK_PASANGAN.buka,
    catatan: { ...k.catatan, buka: k.catatan.buka + 1 },
  };
  if (terbuka.length < 2) return { ...dasar, sorot: k.sorot === aksi.id ? null : k.sorot };
  const [a, b] = terbuka;
  if (k.kartu[a].pasangan === k.kartu[b].pasangan) {
    const ditemukan = [...k.ditemukan, k.kartu[a].pasangan];
    const habis = ditemukan.length * 2 >= k.kartu.length;
    return {
      ...dasar,
      terbuka: [],
      ditemukan,
      salahBeruntun: 0,
      sorot: null,
      petunjuk: null,
      fase: habis ? 'selesai' : 'main',
      catatan: { ...dasar.catatan, pasangan: dasar.catatan.pasangan + 1 },
    };
  }
  const salahBeruntun = k.salahBeruntun + 1;
  if (salahBeruntun < BATAS_SALAH_PETUNJUK) return { ...dasar, salahBeruntun, fase: 'tunggu_tutup' };
  const sorot = cariSorot(k, dilihat, k.ditemukan);
  return {
    ...dasar,
    salahBeruntun,
    fase: 'tunggu_tutup',
    sorot,
    petunjuk: sorot === null ? 'Ingat-ingat letak kartu yang sudah dibuka, ya.' : 'Kartu yang bersinar punya pasangan yang pernah kamu buka.',
    catatan: { ...dasar.catatan, petunjuk: dasar.catatan.petunjuk + (sorot === null ? 0 : 1) },
  };
}

export function ringkasan(k: KeadaanPasangan): RingkasanBabak {
  const hal = [`Menemukan ${k.catatan.pasangan} pasangan`, k.tema === 'inggris' ? 'Mencocokkan kata Inggris dengan gambar' : 'Mencocokkan soal dengan hasilnya'];
  return { ...buatRingkasan('pasangan', k.kelas, tingkatDariLevel(k.level), hal, 'Ingatanmu tajam sekali!', 'Semua cocok!'), level: k.level };
}
