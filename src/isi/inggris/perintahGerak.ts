/**
 * Daftar perintah dasar Tebak Gerak (PROMPT-LANJUTAN-KOMIK tahap 6 butir 6). Buatan sendiri, status belum_diperiksa.
 * Ditambah kata kerja dari unit yang sudah dipelajari anak (gerakan di paket Bahasa Inggris).
 */
import type { JenisGerak } from './komik';
import { PAKET_INGGRIS } from './paket';

export interface PerintahGerak {
  id: string;
  inggris: string;
  arti: string;
  jenis: JenisGerak;
  status: 'belum_diperiksa' | 'diperiksa';
}

const p = (id: string, inggris: string, arti: string, jenis: JenisGerak): PerintahGerak => ({ id, inggris, arti, jenis, status: 'belum_diperiksa' });

export const PERINTAH_DASAR: PerintahGerak[] = [
  p('g01', 'Jump!', 'Lompat!', 'lompat'),
  p('g02', 'Clap your hands!', 'Tepuk tangan!', 'tepuk'),
  p('g03', 'Sit down!', 'Duduk!', 'duduk'),
  p('g04', 'Stand up!', 'Berdiri!', 'berdiri'),
  p('g05', 'Wave your hand!', 'Lambaikan tangan!', 'lambai'),
  p('g06', 'Point to the door!', 'Tunjuk pintu!', 'tunjuk'),
  p('g07', 'Touch your nose!', 'Sentuh hidungmu!', 'sentuh'),
  p('g08', 'Touch your head!', 'Sentuh kepalamu!', 'sentuh'),
  p('g09', 'Nod your head!', 'Anggukkan kepala!', 'angguk'),
  p('g10', 'Eat rice!', 'Makan nasi!', 'makan'),
  p('g11', 'Drink water!', 'Minum air!', 'minum'),
  p('g12', 'Sleep!', 'Tidur!', 'tidur'),
  p('g13', 'Brush your teeth!', 'Sikat gigi!', 'sikat'),
  p('g14', 'Wash your hands!', 'Cuci tangan!', 'cuci'),
  p('g15', 'Read a book!', 'Baca buku!', 'baca'),
  p('g16', 'Write your name!', 'Tulis namamu!', 'tulis'),
  p('g17', 'Run!', 'Lari di tempat!', 'lari'),
  p('g18', 'Turn around!', 'Berputar!', 'putar'),
  p('g19', 'Open the window!', 'Buka jendela!', 'buka'),
  p('g20', 'Touch your toes!', 'Sentuh jari kakimu!', 'sentuh'),
];

/** Perintah dasar + kata kerja dari unit tingkat anak (gerakan di paket), tanpa kembar. */
export function daftarPerintah(tingkat: 3 | 4 | 5 | 6): PerintahGerak[] {
  const tambahan: PerintahGerak[] = [];
  for (const p of Object.values(PAKET_INGGRIS)) {
    if (p.tingkat > tingkat) continue;
    for (const u of p.unit) {
      for (const g of u.gerakan ?? []) {
        const k = u.kosakata.find((x) => x.id === g.kata);
        if (!k) continue;
        const inggris = `${k.kata.charAt(0).toUpperCase()}${k.kata.slice(1)}!`;
        if ([...PERINTAH_DASAR, ...tambahan].some((x) => x.inggris.toLowerCase() === inggris.toLowerCase())) continue;
        tambahan.push({ id: `u-${k.id}`, inggris, arti: g.petunjuk, jenis: g.jenis, status: 'belum_diperiksa' });
      }
    }
  }
  return [...PERINTAH_DASAR, ...tambahan];
}
