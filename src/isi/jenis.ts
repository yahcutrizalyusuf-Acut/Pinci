/** Jenis bersama untuk semua paket isi. */

/** Status pemeriksaan isi oleh guru (CLAUDE.md aturan 10). */
export type StatusPeriksa = 'belum_diperiksa' | 'perlu_dicek' | 'layak';

export interface InfoPaket {
  id: string;
  versi: string;
  dibuat: string;
  sumber: string;
}
