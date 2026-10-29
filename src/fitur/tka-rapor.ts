/** Rapor kesiapan TKA untuk orang tua (diisi lengkap saat paket TKA tersedia). */
import type { Anak } from '../data/jenis';
import type { Repositori } from '../data/repositori';

export interface RaporTka {
  jumlahTopik: number;
  kuasai: number;
  belajar: number;
  miniTryout: (number | null)[];
  penyebab: { kode: string; teks: string; jumlah: number }[];
  rencana: string[] | null;
}

export async function raporTka(repo: Repositori, anak: Anak): Promise<RaporTka> {
  const topik = await repo.kemajuanTopik(anak.id, 'tka');
  return {
    jumlahTopik: 36,
    kuasai: topik.filter((t) => t.status === 'kuasai').length,
    belajar: topik.filter((t) => t.status === 'belajar').length,
    miniTryout: [],
    penyebab: [],
    rencana: null,
  };
}
