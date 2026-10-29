/**
 * Bantuan uji: menjalankan satu babak dengan pemain otomatis yang kadang salah,
 * sambil memeriksa aturan "tidak pernah buntu" dan "fungsi murni".
 */
import { buatAcak, type PembangkitAcak } from '../acak';
import { DETIK_BABAK_MAKS, DETIK_BABAK_MIN, SEMUA_KELAS, SEMUA_TINGKAT, type Kelas, type Tingkat } from '../jenis';

export const BANYAK_BENIH = 200;
export const PELUANG_SALAH = 0.15;
export const BATAS_LANGKAH = 3000;

export interface MesinGame<K, A> {
  langkah: (k: K, a: A) => K;
  selesai: (k: K) => boolean;
  aksiSah: (k: K) => A[];
}

export interface HasilSimulasi<K> {
  akhir: K;
  jumlahLangkah: number;
}

/** Membekukan objek sampai ke dalam supaya perubahan di tempat (mutasi) langsung gagal. */
export function bekukanDalam<T>(o: T): T {
  if (o !== null && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o as Record<string, unknown>)) bekukanDalam(v);
  }
  return o;
}

/**
 * `pilihBenar` = aksi pemain yang tahu jawaban. Dengan peluang `PELUANG_SALAH`
 * pemain memilih aksi sah acak (bisa salah).
 */
export function simulasikan<K, A>(
  mesin: MesinGame<K, A>,
  awal: K,
  pilihBenar: (k: K, acak: PembangkitAcak) => A,
  benih: number,
  bekukan = false,
): HasilSimulasi<K> {
  const acak = buatAcak(benih ^ 0x5bd1e995);
  let k = bekukan ? bekukanDalam(awal) : awal;
  let n = 0;
  while (!mesin.selesai(k)) {
    const sah = mesin.aksiSah(k);
    if (sah.length === 0) throw new Error('Buntu: tidak ada aksi sah.');
    const a = acak.peluang(PELUANG_SALAH) ? acak.pilih(sah) : pilihBenar(k, acak);
    const berikut = mesin.langkah(k, a);
    if (berikut === k) throw new Error('Aksi pemain tidak sah: ' + JSON.stringify(a));
    k = bekukan ? bekukanDalam(berikut) : berikut;
    n++;
    if (n > BATAS_LANGKAH) throw new Error('Babak tidak selesai.');
  }
  return { akhir: k, jumlahLangkah: n };
}

export const SEMUA_KOMBINASI: [Kelas, Tingkat][] = SEMUA_KELAS.flatMap((kelas) =>
  SEMUA_TINGKAT.map((tingkat): [Kelas, Tingkat] => [kelas, tingkat]),
);

export function median(xs: number[]): number {
  const urut = xs.slice().sort((a, b) => a - b);
  return urut[Math.floor(urut.length / 2)];
}

/** Rentang lama babak yang diterima uji: tiap babak 1,5–4,5 menit, nilai tengah 2–4 menit. */
export const DETIK_TIAP_BABAK_MIN = 90;
export const DETIK_TIAP_BABAK_MAKS = 270;
export { DETIK_BABAK_MAKS, DETIK_BABAK_MIN };
