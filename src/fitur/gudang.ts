/** Gudang Ilmu: pemeriksa jawaban isian (bandingkan nilai, bukan teks) dan kemajuan topik. */
import type { KemajuanTopik as BarisKemajuan } from '../data/jenis';
import { bacaBilangan, sama } from '../isi/gudang/hitung';
import type { SoalKartu } from '../isi/gudang/jenis';
import type { KemajuanTopik } from '../isi/gudang/pemuat';

export const MAPEL_GUDANG = 'gudang';

/** "65000" = "65.000"; "15/4" = "3 3/4"; "0.75" = "0,75" = "3/4". */
export function cocokIsian(soal: SoalKartu, jawaban: string): boolean {
  const j = jawaban.trim();
  if (!j) return false;
  if (soal.bentuk === 'pg') return j === soal.kunci;
  const kunci = bacaBilangan(soal.kunci);
  const anak = bacaBilangan(j.replace('.', ',').replace(/^(\d+),(\d{3})$/, '$1$2'));
  const anakPolos = bacaBilangan(j.replace(/\./g, ''));
  if (kunci && (anak || anakPolos)) return (anak && sama(kunci.nilai, anak.nilai)) || (anakPolos !== null && sama(kunci.nilai, anakPolos.nilai));
  return j.toLowerCase().replace(/\s+/g, ' ') === soal.kunci.toLowerCase().replace(/\s+/g, ' ');
}

export function petaKemajuan(baris: BarisKemajuan[]): KemajuanTopik {
  const hasil: Record<string, 'belum' | 'belajar' | 'kuasai'> = {};
  for (const b of baris) if (b.mapel === MAPEL_GUDANG) hasil[b.topik] = b.status;
  return hasil;
}
