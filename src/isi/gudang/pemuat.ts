import type { KartuIlmu, KodeMapel, PaketGudang, TopikGudang } from './jenis';

/**
 * Pemuat Gudang Ilmu: fungsi murni di atas PaketGudang.
 * Layar B01 (peta topik) memakai `petaTopik`, layar B02 (kartu ilmu) memakai `ambilKartu`.
 */

/** Tingkat kemajuan anak per topik (tabel kemajuan_topik). */
export type TingkatKemajuan = 'belum' | 'belajar' | 'kuasai';

/** Status yang tampil di peta. `segera` = kartu belum ada. */
export type StatusTopik = TingkatKemajuan | 'segera';

/** Kemajuan anak: id topik → tingkat. Topik yang tidak tercatat dianggap `belum`. */
export type KemajuanTopik = Readonly<Partial<Record<string, TingkatKemajuan>>>;

export const JUDUL_MAPEL: Record<KodeMapel, string> = {
  mat: 'Matematika',
  bi: 'Bahasa Indonesia',
};

export interface TopikPeta {
  id: string;
  judul: string;
  ringkas: string;
  urutan: number;
  status: StatusTopik;
  bersamaOrtu: boolean;
  prasyarat: string[];
  /** prasyarat yang belum berstatus `kuasai` (untuk saran mundur ke topik dasar) */
  prasyaratBelumKuasai: string[];
}

export interface PetaMapel {
  kode: KodeMapel;
  judul: string;
  /** urut menurut `urutan` */
  topik: TopikPeta[];
  jumlah: Record<StatusTopik, number>;
  /** topik yang diberi tombol "Lanjutkan", atau null bila tidak ada */
  lanjutkan: string | null;
}

function statusTopik(topik: TopikGudang, kemajuan: KemajuanTopik): StatusTopik {
  if (topik.segera || !topik.kartu) return 'segera';
  return kemajuan[topik.id] ?? 'belum';
}

/**
 * Peta topik per mapel dengan status masing-masing.
 * Aturan "Lanjutkan": topik `belajar` pertama; bila tidak ada, topik `belum` pertama yang
 * semua prasyaratnya sudah dikuasai (atau berstatus segera); bila tidak ada, topik `belum` pertama.
 */
export function petaTopik(paket: PaketGudang, kemajuan: KemajuanTopik): PetaMapel[] {
  return paket.mapel.map((mapel) => {
    const statusPer = new Map<string, StatusTopik>();
    for (const t of mapel.topik) statusPer.set(t.id, statusTopik(t, kemajuan));

    const topik: TopikPeta[] = [...mapel.topik]
      .sort((a, b) => a.urutan - b.urutan)
      .map((t) => ({
        id: t.id,
        judul: t.judul,
        ringkas: t.ringkas,
        urutan: t.urutan,
        status: statusPer.get(t.id) ?? 'segera',
        bersamaOrtu: t.bersamaOrtu,
        prasyarat: [...t.prasyarat],
        prasyaratBelumKuasai: t.prasyarat.filter((p) => {
          const s = statusPer.get(p);
          return s !== 'kuasai' && s !== 'segera';
        }),
      }));

    const jumlah: Record<StatusTopik, number> = { belum: 0, belajar: 0, kuasai: 0, segera: 0 };
    for (const t of topik) jumlah[t.status] += 1;

    const sedang = topik.find((t) => t.status === 'belajar');
    const siap = topik.find((t) => t.status === 'belum' && t.prasyaratBelumKuasai.length === 0);
    const belum = topik.find((t) => t.status === 'belum');
    const lanjutkan = (sedang ?? siap ?? belum)?.id ?? null;

    return { kode: mapel.kode, judul: JUDUL_MAPEL[mapel.kode], topik, jumlah, lanjutkan };
  });
}

export interface KartuTerambil {
  mapel: KodeMapel;
  topik: TopikGudang;
  kartu: KartuIlmu;
}

/**
 * Ambil kartu ilmu menurut id topik ("mat6-kpk-fpb") atau id kartu ("kartu-mat6-kpk-fpb").
 * Mengembalikan null bila tidak ada atau topiknya masih `segera`.
 */
export function ambilKartu(paket: PaketGudang, id: string): KartuTerambil | null {
  for (const mapel of paket.mapel) {
    for (const topik of mapel.topik) {
      if (topik.id !== id && topik.kartu?.id !== id) continue;
      if (topik.segera || !topik.kartu) return null;
      return { mapel: mapel.kode, topik, kartu: topik.kartu };
    }
  }
  return null;
}
