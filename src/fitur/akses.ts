/**
 * Bagian aplikasi yang terbuka untuk anak menurut paket kelasnya (08-model-usaha/01 bagian 2a).
 * - Belum ikut kelas (mode lokal, uji keluarga): semua bagian yang tersedia untuk kelasnya terbuka.
 * - Dasar: Lancar Matematika, Baca Ulang, game. Lengkap: + Bahasa Inggris, Gudang Ilmu. Siap TKA: + Persiapan TKA.
 * - Langganan berhenti: hanya latihan inti (Lancar, Baca Ulang) dan game; riwayat tidak dihapus.
 * Di layar anak tidak ada ajakan membeli (CLAUDE.md, rancangan 08 bagian 9).
 */
import { useData, useMuat } from '../data/konteks';
import type { AnggotaKelas } from '../data/jenis';
import { adaBacaGudang, paketLengkap } from './konfig';

export interface Akses {
  lancar: boolean;
  baca: boolean;
  gudang: boolean;
  inggris: boolean;
  tka: boolean;
  game: boolean;
}

export function aksesAnak(kelasSekolah: number, anggota: AnggotaKelas | null): Akses {
  const tersedia: Akses = { lancar: true, baca: adaBacaGudang(kelasSekolah), gudang: adaBacaGudang(kelasSekolah), inggris: true, tka: paketLengkap(kelasSekolah), game: true };
  if (!anggota) return tersedia;
  const paket = anggota.status === 'berhenti' ? 'dasar' : anggota.paket;
  return {
    ...tersedia,
    gudang: tersedia.gudang && paket !== 'dasar',
    inggris: paket !== 'dasar',
    tka: tersedia.tka && paket === 'siap_tka',
  };
}

/** Kalimat netral untuk bagian yang terkunci (tanpa ajakan membeli). */
export const TEKS_TERKUNCI = 'Bagian ini belum dibuka untukmu.';

/** Akses anak yang sedang aktif. Selama memuat, semua yang tersedia dianggap terbuka (tidak berkedip terkunci). */
export function useAkses(): Akses {
  const { anakAktif } = useData();
  const kelas = anakAktif?.kelas ?? 6;
  const anggota = useMuat(async (r) => (anakAktif ? r.kelasAnak(anakAktif.id) : null), null, [anakAktif?.id]);
  return aksesAnak(kelas, anggota);
}
