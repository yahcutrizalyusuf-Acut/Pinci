/**
 * Token sistem desain Pintar Main.
 * Sumber: desain/dari-claude-design/Main.dc.html (Tahap 1, 28 Okt 2026).
 */

export const warna = {
  // Warna utama
  hijauDaun: '#3BB273',
  hijauTua: '#1F7A4D',
  hijauGelap: '#15502F',
  oranye: '#FF9F1C',
  oranyeTua: '#D97F10',
  biruTinta: '#2D3142',
  cokelatKancil: '#A0673A',
  cokelatGaris: '#6B4423',
  kremLembut: '#FFF6E5',
  kremGaris: '#F1E6CF',
  kremTombol: '#F1E6D5',
  kremBatang: '#EDE3CF',
  abuTerang: '#F5F7FA',
  abuGaris: '#E6E9F0',
  hijauSegar: '#2E9E5B',
  koral: '#FF6B6B',
  biruLangit: '#4EA8DE',
  putih: '#FFFFFF',
  kuning: '#FFC93C',
  kuningEmas: '#F4C542',

  // Teks
  teks: '#2D3142',
  teksKedua: '#5B6072',
  teksRedup: '#868C9E',
  ikonRedup: '#6B6F80',
  nonaktif: '#D9DDE6',

  // Latar lembut
  hijauMuda: '#E4F4EB',
  hijauPil: '#D9F0E2',
  oranyeMuda: '#FFF0D9',
  koralMuda: '#FFF0F0',
  biruMuda: '#E8F4FC',
} as const;

/** Warna mata pelajaran dan bagian. */
export const warnaMapel = {
  mat: { utama: '#3A86FF', muda: '#E6F0FF', teks: '#2A5DB0', nama: 'Matematika' },
  bi: { utama: '#E85D5D', muda: '#FDECEC', teks: '#B03C3C', nama: 'Bahasa Indonesia' },
  ing: { utama: '#8E6CCF', muda: '#F1ECFA', teks: '#6A4BA8', nama: 'Bahasa Inggris' },
  dampingi: { utama: '#FF9F1C', muda: '#FFF0D9', teks: '#B86E00', nama: 'Mode Dampingi' },
  gudang: { utama: '#3BB273', muda: '#E4F4EB', teks: '#1F7A4D', nama: 'Gudang Ilmu' },
} as const;

export type KodeMapel = keyof typeof warnaMapel;

export const huruf = {
  judul: 'Baloo2_800ExtraBold',
  judulTebal: 'Baloo2_700Bold',
  judulSedang: 'Baloo2_600SemiBold',
  anak: 'Andika_400Regular',
  anakTebal: 'Andika_700Bold',
  ortu: 'Nunito_400Regular',
  ortuSedang: 'Nunito_600SemiBold',
  ortuTebal: 'Nunito_700Bold',
} as const;

export const radius = {
  kecil: 10,
  sedang: 14,
  tombol: 16,
  kartu: 20,
  besar: 24,
  pil: 999,
} as const;

export const jarak = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const bayangan = {
  kartu: {
    shadowColor: '#2D3142',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ringan: {
    shadowColor: '#2D3142',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;

/** Ukuran huruf per kelompok kelas (sp). */
export function ukuranKelas(kelas: number) {
  if (kelas <= 2) return { judul: 28, soal: 44, bacaan: 26, petunjuk: 20, tombol: 72 };
  if (kelas <= 4) return { judul: 26, soal: 40, bacaan: 22, petunjuk: 18, tombol: 68 };
  return { judul: 24, soal: 36, bacaan: 20, petunjuk: 16, tombol: 64 };
}

/** Lama gerak (ms) — aturan rasa: 200–400 ms dengan pegas. */
export const gerak = {
  cepat: 200,
  sedang: 300,
  lambat: 400,
  pegas: { damping: 14, stiffness: 180, mass: 0.8 },
} as const;
