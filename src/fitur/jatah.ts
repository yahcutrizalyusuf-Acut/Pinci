/**
 * Jatah Gratis selamanya (rancangan 08-model-usaha/03-gratis-ke-berbayar.md bagian 4, keputusan Acut 3 Nov 2026).
 * Dihitung dari sesi yang tersimpan di HP. Batas harian sejalan dengan riset "sedikit tapi sering".
 * Saat jatah habis, anak melihat "Latihan hari ini selesai!" tanpa harga dan tanpa ajakan membeli.
 */
import { tanggalLokal } from '../data/alat';
import type { Anak, JenisSesi, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import { aksesUntuk, type BagianJatah } from './akses';

type Periode = 'hari' | 'minggu' | 'bulan';
type BagianSesi = Exclude<BagianJatah, 'game'>;

export const JATAH_GRATIS: Record<BagianSesi, { jumlah: number; per: Periode; jenis: JenisSesi[] }> = {
  lancar: { jumlah: 1, per: 'hari', jenis: ['lancar'] },
  baca: { jumlah: 1, per: 'hari', jenis: ['baca'] },
  inggris: { jumlah: 1, per: 'hari', jenis: ['inggris'] },
  gudang: { jumlah: 1, per: 'minggu', jenis: ['kartu'] },
  tka: { jumlah: 1, per: 'bulan', jenis: ['tka', 'simulasi', 'mini_tryout'] },
};

/** Menit game per hari untuk Gratis (orang tua tetap bisa memilih lebih sedikit). */
export const MENIT_GAME_GRATIS = 10;

/** Senin di minggu tanggal ini (tanggal lokal YYYY-MM-DD). */
function seninDari(d: Date): string {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return tanggalLokal(s);
}

function samaPeriode(per: Periode, a: Date, b: Date): boolean {
  if (per === 'hari') return tanggalLokal(a) === tanggalLokal(b);
  if (per === 'minggu') return seninDari(a) === seninDari(b);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Jumlah sesi yang sudah dipakai dalam periode jatah bagian ini. */
/**
 * Sesi Bahasa Inggris dihitung sekali per unit: Sesi B (lanjutan Sesi A) dan Cek Dengar tidak memakai jatah,
 * supaya anak Gratis tetap bisa menyelesaikan satu unit utuh per hari.
 */
function dihitungJatah(s: Pick<Sesi, 'jenis' | 'mulai'> & { tambahan?: Sesi['tambahan'] }): boolean {
  if (s.jenis !== 'inggris') return true;
  return s.tambahan?.sesi !== 'b' && s.tambahan?.cekDengar !== true;
}

export function jatahTerpakai(bagian: BagianSesi, sesi: (Pick<Sesi, 'jenis' | 'mulai'> & { tambahan?: Sesi['tambahan'] })[], sekarang = new Date()): number {
  const j = JATAH_GRATIS[bagian];
  return sesi.filter((s) => j.jenis.includes(s.jenis) && dihitungJatah(s) && samaPeriode(j.per, new Date(s.mulai), sekarang)).length;
}

export function jatahHabis(bagian: BagianSesi, sesi: (Pick<Sesi, 'jenis' | 'mulai'> & { tambahan?: Sesi['tambahan'] })[], sekarang = new Date()): boolean {
  return jatahTerpakai(bagian, sesi, sekarang) >= JATAH_GRATIS[bagian].jumlah;
}

/** true bila anak memakai Gratis untuk bagian ini dan jatahnya sudah habis. */
export async function cekJatahHabis(repo: Repositori, anak: Anak, bagian: BagianSesi, sekarang = new Date()): Promise<boolean> {
  const akses = await aksesUntuk(repo, anak);
  if (!akses.jatah[bagian]) return false;
  return jatahHabis(bagian, await repo.daftarSesi(anak.id), sekarang);
}

/** Kalimat untuk anak saat jatah habis. Positif, tanpa harga. */
export function teksJatahHabis(bagian: BagianSesi): { judul: string; teks: string } {
  const per = JATAH_GRATIS[bagian].per;
  const kapan = per === 'hari' ? 'besok' : per === 'minggu' ? 'minggu depan' : 'bulan depan';
  return { judul: 'Latihan hari ini selesai!', teks: `Hebat, kamu sudah berlatih. Sampai ${kapan}, ya. Sekarang istirahat dulu atau main game.` };
}
