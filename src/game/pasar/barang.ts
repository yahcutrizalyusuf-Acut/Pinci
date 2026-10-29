/**
 * Barang dagangan dan pembeli Pasar Gampong.
 * Barang khas gampong Aceh, tanpa isi keagamaan. Harga per satuan dalam kelipatan 500
 * supaya selalu bisa dibayar pas dengan uang yang ada.
 * Status isi: belum_diperiksa.
 */

export interface Barang {
  id: string;
  nama: string;
  emoji: string;
  satuan: string;
  /** Harga terendah dan tertinggi per satuan (kelipatan 500). */
  hargaMin: number;
  hargaMaks: number;
}

export interface Pembeli {
  id: string;
  /** Nama panggilan di layar, mis. "Bu Rusa". */
  nama: string;
  emoji: string;
}

export const STATUS_ISI_PASAR = 'belum_diperiksa' as const;

export const DAFTAR_BARANG: readonly Barang[] = [
  { id: 'pisang', nama: 'pisang', emoji: '🍌', satuan: 'buah', hargaMin: 500, hargaMaks: 2000 },
  { id: 'telur', nama: 'telur', emoji: '🥚', satuan: 'butir', hargaMin: 1500, hargaMaks: 2500 },
  { id: 'timphan', nama: 'timphan', emoji: '🫔', satuan: 'buah', hargaMin: 1000, hargaMaks: 2500 },
  { id: 'kopi', nama: 'kopi', emoji: '☕', satuan: 'gelas', hargaMin: 2500, hargaMaks: 6000 },
  { id: 'kelapa', nama: 'kelapa', emoji: '🥥', satuan: 'buah', hargaMin: 4000, hargaMaks: 10000 },
  { id: 'mangga', nama: 'mangga', emoji: '🥭', satuan: 'buah', hargaMin: 2000, hargaMaks: 8000 },
  { id: 'ikan', nama: 'ikan', emoji: '🐟', satuan: 'ekor', hargaMin: 5000, hargaMaks: 25000 },
  { id: 'jagung', nama: 'jagung', emoji: '🌽', satuan: 'tongkol', hargaMin: 1500, hargaMaks: 4000 },
  { id: 'tomat', nama: 'tomat', emoji: '🍅', satuan: 'buah', hargaMin: 500, hargaMaks: 1500 },
  { id: 'cabai', nama: 'cabai', emoji: '🌶️', satuan: 'bungkus', hargaMin: 2000, hargaMaks: 6000 },
  { id: 'nanas', nama: 'nanas', emoji: '🍍', satuan: 'buah', hargaMin: 5000, hargaMaks: 12000 },
  { id: 'semangka', nama: 'semangka', emoji: '🍉', satuan: 'buah', hargaMin: 10000, hargaMaks: 30000 },
  { id: 'ubi', nama: 'ubi', emoji: '🍠', satuan: 'buah', hargaMin: 1000, hargaMaks: 3000 },
  { id: 'kacang', nama: 'kacang', emoji: '🥜', satuan: 'bungkus', hargaMin: 2000, hargaMaks: 5000 },
];

export const DAFTAR_PEMBELI: readonly Pembeli[] = [
  { id: 'rusa', nama: 'Bu Rusa', emoji: '🦌' },
  { id: 'gajah', nama: 'Pak Gajah', emoji: '🐘' },
  { id: 'penyu', nama: 'Kak Penyu', emoji: '🐢' },
  { id: 'rangkong', nama: 'Bu Rangkong', emoji: '🐦' },
  { id: 'harimau', nama: 'Pak Harimau', emoji: '🐅' },
  { id: 'kucing', nama: 'Dik Kucing', emoji: '🐈' },
  { id: 'kerbau', nama: 'Pak Kerbau', emoji: '🐃' },
  { id: 'bebek', nama: 'Bu Bebek', emoji: '🦆' },
  { id: 'kambing', nama: 'Kak Kambing', emoji: '🐐' },
  { id: 'tupai', nama: 'Dik Tupai', emoji: '🐿️' },
];
