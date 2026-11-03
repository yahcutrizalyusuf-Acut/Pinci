/**
 * Bagian aplikasi yang terbuka untuk anak, dan bagian yang memakai jatah Gratis
 * (rancangan 08-model-usaha/03-gratis-ke-berbayar.md, keputusan Acut 3 Nov 2026).
 *
 * - Mode lokal tanpa kelas (uji keluarga): semua bagian yang tersedia untuk kelasnya terbuka penuh.
 * - Mode server tanpa kelas, atau langganan berhenti: Gratis selamanya. Semua bagian terbuka dengan jatah
 *   (lihat `JATAH_GRATIS` di fitur/jatah.ts).
 * - Masa coba, aktif, tenggang, mitra: latihan inti dan game penuh; Bahasa Inggris, Gudang Ilmu, dan TKA penuh bila
 *   dipilih orang tua, selain itu tetap bisa dicicipi dengan jatah Gratis.
 * Di layar anak tidak ada ajakan membeli dan tidak ada harga (CLAUDE.md, kebijakan Keluarga Google Play).
 */
import { useData, useMuat } from '../data/konteks';
import type { Anak, AnggotaKelas, PaketKelas, Pelajaran } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import { modeData } from '../data/sinkron';
import { adaBacaGudang, paketLengkap } from './konfig';

export type BagianJatah = 'lancar' | 'baca' | 'inggris' | 'gudang' | 'tka' | 'game';

export interface Akses {
  lancar: boolean;
  baca: boolean;
  gudang: boolean;
  inggris: boolean;
  tka: boolean;
  game: boolean;
  /** bagian yang dibatasi jatah Gratis (tidak ada = penuh) */
  jatah: Partial<Record<BagianJatah, true>>;
}

export function pelajaranDariPaket(paket: PaketKelas): Pelajaran[] {
  if (paket === 'siap_tka') return ['inggris', 'gudang', 'tka'];
  if (paket === 'lengkap') return ['inggris', 'gudang'];
  return [];
}

const SEMUA_JATAH: Akses['jatah'] = { lancar: true, baca: true, inggris: true, gudang: true, tka: true, game: true };

export function aksesAnak(kelasSekolah: number, anggota: AnggotaKelas | null, opsi: { gratisTanpaKelas?: boolean } = {}): Akses {
  const tersedia = {
    lancar: true,
    baca: adaBacaGudang(kelasSekolah),
    gudang: adaBacaGudang(kelasSekolah),
    inggris: true,
    tka: paketLengkap(kelasSekolah),
    game: true,
  };
  if (!anggota) return { ...tersedia, jatah: opsi.gratisTanpaKelas ? { ...SEMUA_JATAH } : {} };
  if (anggota.status === 'berhenti') return { ...tersedia, jatah: { ...SEMUA_JATAH } };
  const pilih = anggota.pelajaran ?? pelajaranDariPaket(anggota.paket);
  const jatah: Akses['jatah'] = {};
  if (!pilih.includes('inggris')) jatah.inggris = true;
  if (!pilih.includes('gudang')) jatah.gudang = true;
  if (!pilih.includes('tka')) jatah.tka = true;
  return { ...tersedia, jatah };
}

/** Kalimat netral untuk bagian yang terkunci (tanpa ajakan membeli). */
export const TEKS_TERKUNCI = 'Bagian ini belum dibuka untukmu.';

/** Akses anak yang sedang aktif. Selama memuat, semua yang tersedia dianggap terbuka (tidak berkedip terkunci). */
export function useAkses(): Akses {
  const { anakAktif } = useData();
  const kelas = anakAktif?.kelas ?? 6;
  const anggota = useMuat(async (r) => (anakAktif ? r.kelasAnak(anakAktif.id) : null), null, [anakAktif?.id]);
  return aksesAnak(kelas, anggota, { gratisTanpaKelas: modeData() === 'supabase' });
}

/** Akses anak dibaca langsung dari gudang (untuk fungsi di luar layar, misalnya penjaga waktu game). */
export async function aksesUntuk(repo: Pick<Repositori, 'kelasAnak'>, anak: Pick<Anak, 'id' | 'kelas'>): Promise<Akses> {
  return aksesAnak(anak.kelas, await repo.kelasAnak(anak.id), { gratisTanpaKelas: modeData() === 'supabase' });
}
