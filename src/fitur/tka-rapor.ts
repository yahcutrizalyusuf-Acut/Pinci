/** Rapor kesiapan TKA untuk orang tua (O4/O11): peta topik, grafik mini try out, penyebab salah, rencana minggu ini. */
import type { Anak } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import { paketTka } from '../isi/tka/paket';
import { penyebabSalah as hitungPenyebab } from './rapor';
import { kalimatRencana, MAPEL_TKA, rencanaMinggu } from './tka';

export const ARTI_KODE: Record<string, string> = {
  B: 'Salah membaca soal atau teks — minta anak menunjuk kata penting sebelum menjawab',
  H: 'Cara benar, hitungan meleset — latihan Lancar harian membantu',
  S: 'Konsep masih keliru — buka topik ini bersama di Mode Dampingi',
  W: 'Tidak terjawab saat waktu habis — latih melompati soal sulit lalu kembali',
};

export interface RaporTka {
  jumlahTopik: number;
  kuasai: number;
  belajar: number;
  miniTryout: (number | null)[];
  simulasi: { id: string; persen: number }[];
  penyebab: { kode: string; teks: string; jumlah: number }[];
  rencana: string[] | null;
}

export async function raporTka(repo: Repositori, anak: Anak, sekarang = new Date()): Promise<RaporTka> {
  const topik = await repo.kemajuanTopik(anak.id, MAPEL_TKA);
  const sesi = await repo.daftarSesi(anak.id);
  const sesiTka = sesi.filter((s) => s.jenis === 'tka' || s.jenis === 'simulasi' || s.jenis === 'mini_tryout');
  const idTka = new Set(sesiTka.map((s) => s.id));
  const jawaban = (await repo.jawabanAnak(anak.id)).filter((j) => idTka.has(j.sesi_id));
  const ids = new Set(paketTka.topik.map((t) => t.id));
  return {
    jumlahTopik: paketTka.topik.length,
    kuasai: topik.filter((t) => ids.has(t.topik) && t.status === 'kuasai').length,
    belajar: topik.filter((t) => ids.has(t.topik) && t.status === 'belajar').length,
    miniTryout: sesi.filter((s) => s.jenis === 'mini_tryout').slice(-8).map((s) => s.benar),
    simulasi: sesi.filter((s) => s.jenis === 'simulasi').map((s) => ({ id: s.rujukan ?? '', persen: Math.round((s.benar / Math.max(1, s.jumlah)) * 100) })),
    penyebab: hitungPenyebab(jawaban)
      .slice(0, 3)
      .map((p) => ({ ...p, teks: ARTI_KODE[p.kode] ?? p.kode })),
    rencana: sesiTka.length ? kalimatRencana(rencanaMinggu(paketTka, topik, sesiTka, sekarang)) : null,
  };
}
