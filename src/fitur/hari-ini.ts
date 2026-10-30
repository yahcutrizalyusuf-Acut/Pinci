/** Ringkasan kegiatan anak hari ini: dasar inti harian dan tanda di beranda. */
import { tanggalLokal } from '../data/alat';
import type { Anak, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import { intiSelesai, sisaInti, type SyaratInti } from '../layanan/penjaga-waktu';
import { tkaTerbukaUntuk } from './konfig';

export interface HariIni {
  syarat: SyaratInti;
  inti: boolean;
  sisa: string[];
  sesi: Sesi[];
}

export function sesiHariIni(sesi: Sesi[], tanggal = tanggalLokal()): Sesi[] {
  return sesi.filter((s) => tanggalLokal(new Date(s.mulai)) === tanggal);
}

export async function hariIni(repo: Repositori, anak: Anak, sekarang = new Date()): Promise<HariIni> {
  const semua = sesiHariIni(await repo.daftarSesi(anak.id), tanggalLokal(sekarang));
  const sendiri = semua.filter((s) => s.jenis !== 'game');
  const syarat: SyaratInti = {
    kelas: anak.kelas,
    lancarHariIni: sendiri.filter((s) => s.jenis === 'lancar').length,
    bacaHariIni: sendiri.filter((s) => s.jenis === 'baca').length,
    tkaHariIni: sendiri.filter((s) => s.jenis === 'tka' || s.jenis === 'simulasi' || s.jenis === 'mini_tryout').length,
    tkaTerbuka: await tkaTerbukaUntuk(repo, anak.id, sekarang),
  };
  return { syarat, inti: intiSelesai(syarat), sisa: sisaInti(syarat), sesi: semua };
}

/** Perbarui tanda intiSelesai di catatan pemakaian (dipanggil setelah sesi tersimpan). */
export async function perbaruiInti(repo: Repositori, anak: Anak) {
  const h = await hariIni(repo, anak);
  const p = await repo.pemakaian(anak.id);
  if (p.intiSelesai !== h.inti) await repo.simpanPemakaian({ ...p, intiSelesai: h.inti });
  return h;
}
