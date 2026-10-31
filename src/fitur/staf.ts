/** Bantuan waktu untuk staf. Jam kerja pengawas mengikuti WIB (Banda Aceh). */

/** Tanggal (YYYY-MM-DD) dan hari dalam minggu menurut WIB. */
export function hariWib(sekarang = new Date()): { tanggal: string; hari: number } {
  const wib = new Date(sekarang.getTime() + 7 * 3_600_000);
  return { tanggal: wib.toISOString().slice(0, 10), hari: wib.getUTCDay() };
}

/** Senin, Rabu, dan Jumat adalah hari pantauan. null = bukan hari pantauan. */
export function hariPantau(sekarang = new Date()): { tanggal: string } | null {
  const { tanggal, hari } = hariWib(sekarang);
  return hari === 1 || hari === 3 || hari === 5 ? { tanggal } : null;
}

/** "hari ini", "kemarin", "3 hari lalu", atau "belum pernah". */
export function lamaHari(waktu: string | null, sekarang = new Date()): string {
  if (!waktu) return 'belum pernah';
  const a = hariWib(new Date(waktu)).tanggal;
  const b = hariWib(sekarang).tanggal;
  const selisih = Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
  if (selisih <= 0) return 'hari ini';
  if (selisih === 1) return 'kemarin';
  return `${selisih} hari lalu`;
}
