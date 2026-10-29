/**
 * Saklar fitur. Bisa diubah lewat variabel lingkungan saat membangun.
 * - EXPO_PUBLIC_TKA_BUKA: tanggal isi TKA dibuka (bawaan 2027-01-04). Isi "mati" untuk
 *   membuka sekarang (uji). Rancangan: isi TKA terbuka 4 Januari 2027.
 * - EXPO_PUBLIC_FITUR_GURU: "nyala" untuk menampilkan Kelola guru (R3, bawaan tersembunyi).
 */
export const TKA_BUKA = process.env.EXPO_PUBLIC_TKA_BUKA ?? '2027-01-04';

export function tkaTerbuka(sekarang = new Date()): boolean {
  if (TKA_BUKA === 'mati' || TKA_BUKA === '') return true;
  const t = new Date(`${TKA_BUKA}T00:00:00`);
  return Number.isNaN(t.getTime()) ? true : sekarang.getTime() >= t.getTime();
}

export const FITUR_GURU = process.env.EXPO_PUBLIC_FITUR_GURU === 'nyala';

/** Paket lengkap baru tersedia untuk kelas 6 (cakupan pembangunan ini). */
export function paketLengkap(kelas: number) {
  return kelas === 6;
}
