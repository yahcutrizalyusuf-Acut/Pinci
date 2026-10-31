import k2 from '../../../assets/paket/gudang-k2.json';
import k3 from '../../../assets/paket/gudang-k3.json';
import k4 from '../../../assets/paket/gudang-k4.json';
import k5 from '../../../assets/paket/gudang-k5.json';
import data from '../../../assets/paket/gudang-k6.json';
import type { PaketGudang } from './jenis';

export const paketGudang: PaketGudang = data as unknown as PaketGudang;

/** Paket Gudang Ilmu per kelas (kelas 2–6). */
export const PAKET_GUDANG: Record<number, PaketGudang> = {
  2: k2 as unknown as PaketGudang,
  3: k3 as unknown as PaketGudang,
  4: k4 as unknown as PaketGudang,
  5: k5 as unknown as PaketGudang,
  6: paketGudang,
};

/** Paket Gudang Ilmu untuk kelas anak, atau null bila belum ada (kelas 1). */
export function paketGudangKelas(kelas: number): PaketGudang | null {
  return PAKET_GUDANG[kelas] ?? null;
}

/** Paket yang memuat topik ini (id topik diawali "mat2-", "bi5-", dan seterusnya). */
export function paketGudangTopik(id: string): PaketGudang {
  const m = /^(?:kartu-)?(?:mat|bi)(\d)-/.exec(id);
  return (m && PAKET_GUDANG[Number(m[1])]) || paketGudang;
}
