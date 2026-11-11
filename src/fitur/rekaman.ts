/**
 * Aturan rekaman suara anak (CLAUDE.md aturan 12, rancangan 13 bagian 4), tanpa React dan tanpa berkas supaya mudah diuji.
 *
 * - Hanya di HP: catatan rekaman TIDAK disimpan di tabel data (tidak bisa masuk antrean sinkron), melainkan di berkas
 *   daftar di folder pribadi aplikasi bersama rekamannya (src/layanan/rekaman.ts).
 * - Terhapus 30 hari setelah direkam, kecuali paling banyak 5 cerita utuh yang disematkan orang tua.
 * - Batas 50 MB: yang tertua (dan tidak disematkan) terhapus lebih dulu.
 * - Maksimal 20 detik per kalimat (panel) dan 2 menit per cerita utuh.
 */

export type JenisRekaman = 'kalimat' | 'utuh';

export interface CatatanRekaman {
  id: string;
  anak_id: string;
  komikId: string;
  /** panel yang diucapkan; null untuk cerita utuh */
  panelId: string | null;
  jenis: JenisRekaman;
  /** alamat berkas di folder pribadi aplikasi */
  berkas: string;
  /** ukuran berkas dalam byte */
  ukuran: number;
  detik: number;
  /** ISO */
  dibuat: string;
  disematkan: boolean;
}

export const ATURAN_REKAMAN = {
  hari: 30,
  sematan: 5,
  byte: 50 * 1024 * 1024,
  detikKalimat: 20,
  detikUtuh: 120,
} as const;

const HARI_MS = 24 * 60 * 60 * 1000;

export function batasDetik(jenis: JenisRekaman): number {
  return jenis === 'utuh' ? ATURAN_REKAMAN.detikUtuh : ATURAN_REKAMAN.detikKalimat;
}

/** Waktu rekaman akan terhapus otomatis (ISO), atau null kalau disematkan. */
export function terhapusPada(c: CatatanRekaman): string | null {
  if (c.disematkan) return null;
  return new Date(new Date(c.dibuat).getTime() + ATURAN_REKAMAN.hari * HARI_MS).toISOString();
}

/** Sisa hari sebelum terhapus (dibulatkan ke atas, minimal 0), atau null kalau disematkan. */
export function sisaHari(c: CatatanRekaman, kini: Date): number | null {
  const t = terhapusPada(c);
  if (!t) return null;
  return Math.max(0, Math.ceil((new Date(t).getTime() - kini.getTime()) / HARI_MS));
}

/**
 * Pilah rekaman yang disimpan dan yang harus dihapus: (1) lewat 30 hari dan tidak disematkan; (2) kalau total masih
 * di atas 50 MB, hapus yang tertua lebih dulu (sematan dihapus paling akhir, hanya kalau sematan saja sudah > 50 MB).
 */
export function rapikanRekaman(daftar: CatatanRekaman[], kini: Date): { simpan: CatatanRekaman[]; hapus: CatatanRekaman[] } {
  const hapus: CatatanRekaman[] = [];
  let simpan = daftar.filter((c) => {
    const t = terhapusPada(c);
    if (t && new Date(t).getTime() <= kini.getTime()) {
      hapus.push(c);
      return false;
    }
    return true;
  });
  let total = simpan.reduce((a, c) => a + c.ukuran, 0);
  if (total > ATURAN_REKAMAN.byte) {
    const urut = [...simpan].sort((a, b) => Number(a.disematkan) - Number(b.disematkan) || a.dibuat.localeCompare(b.dibuat));
    const buang = new Set<string>();
    for (const c of urut) {
      if (total <= ATURAN_REKAMAN.byte) break;
      buang.add(c.id);
      total -= c.ukuran;
      hapus.push(c);
    }
    simpan = simpan.filter((c) => !buang.has(c.id));
  }
  return { simpan, hapus };
}

/** Rekaman boleh disematkan kalau berupa cerita utuh dan sematan anak ini belum 5. */
export function bisaSematkan(daftar: CatatanRekaman[], id: string): boolean {
  const c = daftar.find((x) => x.id === id);
  if (!c || c.jenis !== 'utuh') return false;
  if (c.disematkan) return true;
  return daftar.filter((x) => x.disematkan && x.anak_id === c.anak_id).length < ATURAN_REKAMAN.sematan;
}

/** Hanya rekaman profil anak ini (kakak tidak bisa memutar rekaman adik dari profilnya). */
export function rekamanAnak(daftar: CatatanRekaman[], anakId: string): CatatanRekaman[] {
  return daftar.filter((c) => c.anak_id === anakId).sort((a, b) => b.dibuat.localeCompare(a.dibuat));
}

export function formatDetik(detik: number): string {
  const d = Math.max(0, Math.floor(detik));
  return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`;
}
