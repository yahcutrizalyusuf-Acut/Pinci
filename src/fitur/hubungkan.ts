/** Teks dan hitungan kecil untuk layar Hubungkan HP anak. Murni, tanpa React. */
import type { PerangkatAnak, HasilBuatKode, HasilTukarKode } from '../data/supabase';

/** "482913" → "482 913" supaya mudah dibaca dan diketik. */
export function formatKode(kode: string): string {
  return kode.length === 6 ? `${kode.slice(0, 3)} ${kode.slice(3)}` : kode;
}

/** Tinggal berapa menit lagi (dibulatkan ke atas), 0 bila sudah lewat. */
export function sisaMenit(berlakuSampai: string, sekarang: number): number {
  return Math.max(0, Math.ceil((Date.parse(berlakuSampai) - sekarang) / 60_000));
}

/** "baru saja", "5 menit lalu", "3 jam lalu", "2 hari lalu". */
export function lamaLalu(iso: string | null, sekarang: number): string {
  if (!iso) return 'belum pernah';
  const menit = Math.max(0, Math.floor((sekarang - Date.parse(iso)) / 60_000));
  if (menit < 2) return 'baru saja';
  if (menit < 60) return `${menit} menit lalu`;
  if (menit < 60 * 24) return `${Math.floor(menit / 60)} jam lalu`;
  return `${Math.floor(menit / (60 * 24))} hari lalu`;
}

export function pesanTukarKode(alasan: Exclude<HasilTukarKode, { ok: true }>['alasan']): string {
  switch (alasan) {
    case 'salah':
      return 'Kode belum tepat atau sudah lewat 10 menit. Minta kode baru di HP orang tua.';
    case 'terlalu_sering':
      return 'Terlalu banyak percobaan. Tunggu 10 menit, lalu coba lagi.';
    case 'akun_orang_tua':
      return 'HP ini sudah dipakai untuk akun orang tua. Hubungkan lewat HP lain.';
    case 'jaringan':
      return 'Belum tersambung. Periksa internet, lalu coba lagi.';
  }
}

export function pesanBuatKode(alasan: Exclude<HasilBuatKode, { ok: true }>['alasan']): string {
  switch (alasan) {
    case 'anak_belum_terkirim':
      return 'Data anak belum sampai ke server. Periksa internet, tunggu sebentar, lalu coba lagi.';
    case 'belum_masuk':
      return 'Masuk dulu dengan email supaya HP ini terhubung ke akun.';
    case 'jaringan':
      return 'Belum tersambung. Periksa internet, lalu coba lagi.';
  }
}

/** Nama anak untuk satu HP, mis. "Rani dan Budi". */
export function namaAnak(perangkat: Pick<PerangkatAnak, 'anakIds'>, nama: ReadonlyMap<string, string>): string {
  const n = perangkat.anakIds.map((id) => nama.get(id)).filter((x): x is string => !!x);
  if (n.length === 0) return 'Anak';
  if (n.length === 1) return n[0];
  return `${n.slice(0, -1).join(', ')} dan ${n[n.length - 1]}`;
}
