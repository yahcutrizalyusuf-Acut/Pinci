import type { ButirPG, Teks } from '../tka/jenis';

/**
 * Alat bantu menulis teks Baca Ulang kelas 2–5 (05-bahasa-indonesia.md). Jumlah kata dan
 * sasaran waktu dihitung oleh kode, bukan ditulis tangan.
 */

/**
 * Patokan kata per menit bacaan dingin per kelas [ASUMSI]. Belum ada patokan resmi; kelas 3 nasional
 * 64–69 kpm dan anak Aceh ± 17–20 kpm lebih lambat (riset-penguat.md bagian 3). Kelas 6 memakai sasaran bahan TKA.
 */
export const KPM_KELAS: Record<number, number> = { 2: 30, 3: 40, 4: 45, 5: 50 };

/** Rentang panjang teks per kelas (jumlah kata). Bacaan dingin ± 1–1,5 menit; kelas 6 (bahan TKA) ± 3 menit. */
export const PANJANG_KELAS: Record<number, [number, number]> = { 2: [20, 45], 3: [40, 70], 4: [45, 95], 5: [50, 120] };

export interface PertanyaanMentah {
  tanya: string;
  pilihan: string[];
  /** indeks pilihan yang benar (mulai 0) */
  benar: number;
  petunjuk: string;
  pembahasan: string;
  /** alasan tiap pilihan salah menarik, menurut indeks */
  alasan: Record<number, string>;
}

const HURUF = ['A', 'B', 'C', 'D'];

export function hitungKata(paragraf: string[]): number {
  return paragraf.join(' ').split(/\s+/).filter(Boolean).length;
}

export function buatTeks(kelas: number, nomor: number, judul: string, jenis: string, paragraf: string[], pertanyaan: PertanyaanMentah[]): Teks {
  const id = `K${kelas}-T${String(nomor).padStart(2, '0')}`;
  const jumlahKata = hitungKata(paragraf);
  return {
    id,
    judul,
    jenis,
    pertemuan: '-',
    mapelHari: 'bi',
    isi: paragraf.map((isi) => ({ jenis: 'teks', isi })),
    jumlahKata,
    sasaranDetik: Math.round((jumlahKata * 60) / KPM_KELAS[kelas]),
    pertanyaan: pertanyaan.map((p, i): ButirPG => {
      const pengecoh: ButirPG['pengecoh'] = {};
      for (const [k, alasan] of Object.entries(p.alasan)) pengecoh[HURUF[Number(k)]] = { alasan };
      return {
        id: `${id}-q${i + 1}`,
        asal: 'baca_cepat',
        sumber: id,
        baris: 0,
        topik: 'baca',
        pertanyaan: p.tanya,
        pilihan: p.pilihan.map((teks, j) => ({ huruf: HURUF[j], teks })),
        pengecoh,
        petunjuk: [p.petunjuk],
        pembahasan: p.pembahasan,
        status: 'belum_diperiksa',
        bentuk: 'pg',
        kunci: HURUF[p.benar],
      };
    }),
    status: 'belum_diperiksa',
  };
}
