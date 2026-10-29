/** Jurus per level dengan cadangan dari definisi level bila isi jurus belum ada. */
import { ambilJurus, type Jurus } from '../isi/lancar/jurus';
import { ambilLevel } from '../mesin/lancar';

export function ambilJurusAman(kelas: number, level: number): { jurus: Jurus | null; petunjuk: string; nama: string } {
  const def = ambilLevel(kelas, level);
  const jurus = ambilJurus(kelas, level);
  const petunjuk = jurus ? `Ingat jurus: ${jurus.inti} ${jurus.ingat}` : `${def.keterangan}. Contoh: ${def.contoh}.`;
  return { jurus, petunjuk, nama: def.nama };
}
