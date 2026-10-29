/**
 * Penjaga waktu (fungsi murni). Aturan: docs/rancangan/01-produk/10-gudang-ilmu-bimbingan-dan-waktu.md bagian 5.
 * - Belajar ≤ 10 menit × kelas per hari, dibagi blok ≤ 15 menit, lalu istirahat 2 menit.
 * - Game setelah inti harian (bawaan) atau selalu terbuka; 0–60 menit; batas mutlak 60 menit.
 * - Jam tenang (bawaan 21.00): aplikasi anak berhenti sampai jam bangun.
 */
import type { Pemakaian, PengaturanWaktu } from '../data/jenis';

export const BLOK_DETIK = 15 * 60;
export const ISTIRAHAT_DETIK = 2 * 60;
export const BATAS_GAME_MUTLAK_MENIT = 60;

export type StatusBelajar =
  | { jenis: 'boleh'; sisaDetik: number; sisaBlokDetik: number }
  | { jenis: 'istirahat'; sampai: Date }
  | { jenis: 'cukup' }
  | { jenis: 'jam_tenang' };

export type StatusMain =
  | { jenis: 'boleh'; sisaDetik: number }
  | { jenis: 'tunggu_inti' }
  | { jenis: 'habis' }
  | { jenis: 'mati' }
  | { jenis: 'jam_tenang' };

function menitDariJam(jam: string): number {
  const [h, m] = jam.split(':').map((x) => parseInt(x, 10));
  return (h || 0) * 60 + (m || 0);
}

/** true bila `sekarang` berada di jam tenang (mis. 21.00 – 06.00). */
export function diJamTenang(p: Pick<PengaturanWaktu, 'jamTenang' | 'jamBangun'>, sekarang: Date): boolean {
  const t = sekarang.getHours() * 60 + sekarang.getMinutes();
  const mulai = menitDariJam(p.jamTenang);
  const bangun = menitDariJam(p.jamBangun);
  if (mulai === bangun) return false;
  return mulai > bangun ? t >= mulai || t < bangun : t >= mulai && t < bangun;
}

export function statusBelajar(pakai: Pemakaian, atur: PengaturanWaktu, sekarang: Date): StatusBelajar {
  if (diJamTenang(atur, sekarang)) return { jenis: 'jam_tenang' };
  const batas = atur.belajarMenit * 60;
  if (pakai.belajarDetik >= batas) return { jenis: 'cukup' };
  if (pakai.istirahatSampai && new Date(pakai.istirahatSampai).getTime() > sekarang.getTime()) {
    return { jenis: 'istirahat', sampai: new Date(pakai.istirahatSampai) };
  }
  return {
    jenis: 'boleh',
    sisaDetik: batas - pakai.belajarDetik,
    sisaBlokDetik: BLOK_DETIK - pakai.blokDetik,
  };
}

/** Tambahkan detik belajar. Blok penuh → mulai istirahat 2 menit. */
export function tambahBelajar(pakai: Pemakaian, detik: number, sekarang: Date): Pemakaian {
  const d = Math.max(0, Math.round(detik));
  let blok = pakai.blokDetik + d;
  let istirahatSampai = pakai.istirahatSampai;
  if (blok >= BLOK_DETIK) {
    blok = 0;
    istirahatSampai = new Date(sekarang.getTime() + ISTIRAHAT_DETIK * 1000).toISOString();
  }
  return { ...pakai, belajarDetik: pakai.belajarDetik + d, blokDetik: blok, istirahatSampai };
}

/** Lewati istirahat lebih awal tidak diizinkan; ini hanya untuk menutup istirahat yang sudah lewat. */
export function selesaiIstirahat(pakai: Pemakaian, sekarang: Date): Pemakaian {
  if (pakai.istirahatSampai && new Date(pakai.istirahatSampai).getTime() <= sekarang.getTime()) {
    return { ...pakai, istirahatSampai: undefined };
  }
  return pakai;
}

export function batasGameDetik(atur: PengaturanWaktu): number {
  return Math.max(0, Math.min(BATAS_GAME_MUTLAK_MENIT, atur.gameMenit)) * 60;
}

export function statusMain(pakai: Pemakaian, atur: PengaturanWaktu, sekarang: Date): StatusMain {
  if (diJamTenang(atur, sekarang)) return { jenis: 'jam_tenang' };
  const batas = batasGameDetik(atur);
  if (batas === 0) return { jenis: 'mati' };
  if (atur.gameSetelahInti && !pakai.intiSelesai) return { jenis: 'tunggu_inti' };
  if (pakai.mainDetik >= batas) return { jenis: 'habis' };
  return { jenis: 'boleh', sisaDetik: batas - pakai.mainDetik };
}

export function tambahMain(pakai: Pemakaian, detik: number): Pemakaian {
  return { ...pakai, mainDetik: pakai.mainDetik + Math.max(0, Math.round(detik)) };
}

export interface SyaratInti {
  kelas: number;
  lancarHariIni: number;
  bacaHariIni: number;
  tkaHariIni: number;
  /** isi TKA sudah dibuka (saklar TKA_BUKA) */
  tkaTerbuka: boolean;
}

/**
 * Inti harian: 1 lembar Lancar; kelas 6 ditambah 1 Baca Ulang dan latihan TKA hari itu
 * (TKA hanya bila isinya sudah dibuka).
 */
export function intiSelesai(s: SyaratInti): boolean {
  if (s.lancarHariIni < 1) return false;
  if (s.kelas === 6) {
    if (s.bacaHariIni < 1) return false;
    if (s.tkaTerbuka && s.tkaHariIni < 1) return false;
  }
  return true;
}

/** Bagian inti yang belum, untuk ditampilkan lembut di beranda. */
export function sisaInti(s: SyaratInti): string[] {
  const sisa: string[] = [];
  if (s.lancarHariIni < 1) sisa.push('Lancar Matematika');
  if (s.kelas === 6 && s.bacaHariIni < 1) sisa.push('Baca Ulang');
  if (s.kelas === 6 && s.tkaTerbuka && s.tkaHariIni < 1) sisa.push('Siap TKA');
  return sisa;
}
