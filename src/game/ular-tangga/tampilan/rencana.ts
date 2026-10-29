/**
 * Rencana waktu satu aksi anak sampai giliran anak berikutnya (atau babak selesai).
 * Murni: tampilan tinggal menjadwalkan setiap peristiwa pada `pada` milidetik.
 */
import {
  langkah,
  ringkasan,
  type AksiUlarTangga,
  type GerakTerakhir,
  type KeadaanUlarTangga,
  type Pemain,
} from '../logika';
import type { RingkasanBabak } from '../../bersama/ringkasan';

export const WAKTU = {
  /** dadu berguling (≤ 600 ms) */
  putarDadu: 500,
  /** angka dadu tampil sesudah berguling */
  tampilDadu: 550,
  /** pion melompat satu petak */
  perPetak: 250,
  jedaSulur: 150,
  naikSulur: 700,
  /** jeda sebelum Pinci melempar */
  jedaPinci: 700,
  jedaPesta: 250,
  /** pesta kecil ≤ 1,5 detik */
  pesta: 1400,
} as const;

export type Peristiwa =
  | { jenis: 'putar_dadu'; siapa: Pemain }
  | { jenis: 'keadaan'; keadaan: KeadaanUlarTangga }
  | { jenis: 'mendarat'; keadaan: KeadaanUlarTangga }
  | { jenis: 'ting' }
  | { jenis: 'pinci_bicara'; nyala: boolean }
  | { jenis: 'pesta' }
  | { jenis: 'selesai'; ringkasan: RingkasanBabak }
  | { jenis: 'bebas' };

export interface Terjadwal {
  pada: number;
  peristiwa: Peristiwa;
}

/** Lama pion berjalan (dan naik sulur bila ada). */
export function durasiGerak(g: GerakTerakhir): number {
  return (g.sampai - g.dari) * WAKTU.perPetak + (g.naikSulur ? WAKTU.jedaSulur + WAKTU.naikSulur : 0);
}

/** Setelah sebuah gerak dimulai pada `t`: tunggu mendarat, lalu giliran Pinci / selesai / anak bebas lagi. */
function lanjutan(k: KeadaanUlarTangga, t: number, hasil: Terjadwal[]): void {
  let w = t;
  if (k.gerakTerakhir) {
    w += durasiGerak(k.gerakTerakhir);
    hasil.push({ pada: w, peristiwa: { jenis: 'mendarat', keadaan: k } });
  }
  if (k.fase === 'selesai') {
    hasil.push({ pada: w + WAKTU.jedaPesta, peristiwa: { jenis: 'pesta' } });
    hasil.push({ pada: w + WAKTU.jedaPesta + WAKTU.pesta, peristiwa: { jenis: 'selesai', ringkasan: ringkasan(k) } });
    return;
  }
  if (k.fase === 'giliran_pinci') {
    hasil.push({ pada: w + 100, peristiwa: { jenis: 'pinci_bicara', nyala: true } });
    const lempar = w + WAKTU.jedaPinci;
    hasil.push({ pada: lempar, peristiwa: { jenis: 'putar_dadu', siapa: 'pinci' } });
    const k2 = langkah(k, { jenis: 'giliran_pinci' });
    const t2 = lempar + WAKTU.tampilDadu;
    hasil.push({ pada: t2, peristiwa: { jenis: 'pinci_bicara', nyala: false } });
    hasil.push({ pada: t2, peristiwa: { jenis: 'keadaan', keadaan: k2 } });
    lanjutan(k2, t2, hasil);
    return;
  }
  hasil.push({ pada: w, peristiwa: { jenis: 'bebas' } });
}

export function rencanaAksi(k: KeadaanUlarTangga, aksi: AksiUlarTangga): Terjadwal[] {
  const hasil: Terjadwal[] = [];
  const k1 = langkah(k, aksi);
  if (k1 === k) return hasil;
  if (aksi.jenis === 'lempar_dadu') {
    hasil.push({ pada: 0, peristiwa: { jenis: 'putar_dadu', siapa: 'anak' } });
    hasil.push({ pada: WAKTU.tampilDadu, peristiwa: { jenis: 'keadaan', keadaan: k1 } });
    if (k1.fase === 'soal') {
      hasil.push({ pada: WAKTU.tampilDadu, peristiwa: { jenis: 'bebas' } });
      return hasil;
    }
    lanjutan(k1, WAKTU.tampilDadu, hasil);
    return hasil;
  }
  if (aksi.jenis === 'jawab') {
    if (k1.fase === 'soal') {
      // belum tepat: pilihan memantul, anak boleh mencoba lagi
      hasil.push({ pada: 0, peristiwa: { jenis: 'keadaan', keadaan: k1 } });
      hasil.push({ pada: 0, peristiwa: { jenis: 'bebas' } });
      return hasil;
    }
    hasil.push({ pada: 0, peristiwa: { jenis: 'ting' } });
    hasil.push({ pada: 0, peristiwa: { jenis: 'keadaan', keadaan: k1 } });
    lanjutan(k1, 0, hasil);
    return hasil;
  }
  // giliran_pinci dipicu oleh rencana sendiri, bukan oleh anak
  hasil.push({ pada: 0, peristiwa: { jenis: 'keadaan', keadaan: k1 } });
  lanjutan(k1, 0, hasil);
  return hasil;
}
