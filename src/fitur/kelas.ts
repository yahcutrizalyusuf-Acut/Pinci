/**
 * Kelas dengan pengawas: teks, paket, dan penanda papan kelas (08-model-usaha/01).
 * Semua teks buatan sendiri; status isi: belum_diperiksa.
 */
import type { JenisTugas, PaketKelas } from '../data/jenis';
import type { AlasanGabung } from '../data/supabase';
import type { AnakPapan } from '../data/staf';
import { namaTopik } from './nama-topik';

/** Versi teks persetujuan. Naikkan setiap kali teks diubah (persetujuan dicatat bersama versinya). */
export const VERSI_PERSETUJUAN = 'kelas-v1';

export const PAKET: Record<PaketKelas, { nama: string; isi: string }> = {
  dasar: { nama: 'Dasar', isi: 'Lancar Matematika, Baca Ulang, game, dan pengawas' },
  lengkap: { nama: 'Lengkap', isi: 'Dasar ditambah Bahasa Inggris dan Gudang Ilmu' },
  siap_tka: { nama: 'Siap TKA', isi: 'Lengkap ditambah Persiapan TKA (khusus kelas 6)' },
};

/** Paket yang boleh dipilih untuk anak di kelas sekolah ini. */
export function paketUntukKelas(kelas: number): PaketKelas[] {
  return kelas === 6 ? ['dasar', 'lengkap', 'siap_tka'] : ['dasar', 'lengkap'];
}

/**
 * Teks persetujuan orang tua (08-model-usaha/01 bagian 9). Harga TIDAK ditulis di aplikasi
 * (aturan Google Play untuk aplikasi tanpa pembelian di dalamnya).
 */
export function teksPersetujuan(kelasNama: string | null, pengawasNama: string | null): string[] {
  return [
    `Anak Anda akan belajar di ${kelasNama ? `kelas ${kelasNama}` : 'kelas ini'}${pengawasNama ? ` dengan pengawas ${pengawasNama}` : ''}.`,
    'Pengawas bisa melihat nama panggilan, kelas, dan hasil latihan anak Anda. Pengawas memantau setiap Senin, Rabu, dan Jumat, lalu mengirim catatan kepada Anda dan memberi tugas latihan kepada anak. Pengawas tidak bisa mengobrol dengan anak.',
    'Kami tidak menyimpan foto, suara, lokasi, atau nomor HP anak. Kami tidak memasang iklan atau pelacak.',
    'Masa coba 14 hari, gratis. Biaya dan cara bayar dikirim ke email Anda. Anda bisa berhenti kapan saja.',
  ];
}

export const SETUJU_KELAS = 'Saya setuju anak saya ikut kelas ini.';
export const SETUJU_PEMAKAIAN = 'Boleh kirim catatan pemakaian aplikasi untuk memperbaiki Pintar Main (boleh tidak dicentang).';

export function pesanGabung(alasan: AlasanGabung): string {
  switch (alasan) {
    case 'kode_salah':
      return 'Kode kelas tidak ditemukan. Periksa lagi huruf dan angkanya.';
    case 'penuh':
      return 'Kelas ini sudah penuh. Minta kode kelas lain kepada admin.';
    case 'sudah_di_kelas_lain':
      return 'Anak ini sudah ada di kelas lain. Keluar dari kelas itu dulu.';
    case 'paket_tidak_cocok':
      return 'Paket Siap TKA hanya untuk kelas 6.';
    case 'anak_tidak_valid':
      return 'Profil anak belum sampai ke server. Tunggu sebentar, lalu coba lagi.';
    case 'terlalu_sering':
      return 'Terlalu banyak kode salah. Tunggu 10 menit, lalu coba lagi.';
    case 'belum_masuk':
      return 'HP ini perlu masuk dengan email Anda lebih dulu.';
    default:
      return 'Belum tersambung ke server. Periksa internet, lalu coba lagi.';
  }
}

/** Kode kelas dirapikan: huruf besar, tanpa spasi atau tanda hubung. */
export function rapikanKodeKelas(kode: string): string {
  return kode.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** Kode kelas ditampilkan dalam dua kelompok, misalnya "KNC 4R7". */
export function formatKodeKelas(kode: string): string {
  const k = rapikanKodeKelas(kode);
  return k.length === 6 ? `${k.slice(0, 3)} ${k.slice(3)}` : k;
}

/** Sisa hari masa coba (0 = sudah habis). */
export function sisaHariCoba(cobaSampai: string, sekarang = new Date()): number {
  return Math.max(0, Math.ceil((Date.parse(cobaSampai) - sekarang.getTime()) / 86_400_000));
}

// ---------- papan kelas (pengawas) ----------

export type Penanda = 'belum_latihan' | 'topik_lemah' | 'perlu_dipuji';

export const NAMA_PENANDA: Record<Penanda, { label: string; warna: string; latar: string }> = {
  belum_latihan: { label: 'Belum latihan 2 hari', warna: '#B03C3C', latar: '#FDECEC' },
  topik_lemah: { label: 'Ada topik lemah', warna: '#B86E00', latar: '#FFF0D9' },
  perlu_dipuji: { label: 'Sedang lancar, puji', warna: '#1F7A4D', latar: '#E4F4EB' },
};

/**
 * Penanda papan kelas (08-model-usaha/01 bagian 2): belum latihan 2 hari, topik dengan ketepatan
 * di bawah 70%, dan anak yang sedang lancar (latihan ≥ 3 dari 4 hari terakhir tanpa topik lemah).
 */
export function penandaAnak(a: AnakPapan, sekarang = new Date()): Penanda[] {
  const hasil: Penanda[] = [];
  const duaHari = 2 * 86_400_000;
  if (!a.terakhirLatihan || sekarang.getTime() - Date.parse(a.terakhirLatihan) >= duaHari) hasil.push('belum_latihan');
  if (a.topikLemah.length > 0) hasil.push('topik_lemah');
  if (a.hariLatihan4 >= 3 && a.topikLemah.length === 0) hasil.push('perlu_dipuji');
  return hasil;
}

/** Anak yang perlu perhatian lebih dulu: belum latihan, lalu topik lemah, lalu sisanya. */
export function urutkanPapan(anak: AnakPapan[], sekarang = new Date()): AnakPapan[] {
  const bobot = (a: AnakPapan) => {
    const p = penandaAnak(a, sekarang);
    return p.includes('belum_latihan') ? 0 : p.includes('topik_lemah') ? 1 : 2;
  };
  return [...anak].sort((x, y) => bobot(x) - bobot(y) || x.nama.localeCompare(y.nama));
}

/** Contoh kalimat catatan. Pengawas memilih lalu menyesuaikan sendiri. */
export function contohCatatan(a: Pick<AnakPapan, 'nama' | 'topikLemah' | 'hariLatihan7'>): string[] {
  const contoh: string[] = [];
  if (a.hariLatihan7 > 0) contoh.push(`${a.nama} latihan ${a.hariLatihan7} hari dalam 7 hari terakhir. Terima kasih sudah mengingatkan di rumah.`);
  if (a.topikLemah[0]) contoh.push(`Topik ${namaTopik(a.topikLemah[0].mapel, a.topikLemah[0].topik)} masih perlu diulang. Saya beri tugas latihan topik ini.`);
  if (a.hariLatihan7 === 0) contoh.push(`${a.nama} belum latihan minggu ini. Bisa dibantu mengingatkan 15 menit sehari?`);
  contoh.push(`Saran minggu ini: tanyakan kepada ${a.nama} apa yang dipelajari hari ini.`);
  return contoh;
}

export const NAMA_TUGAS: Record<JenisTugas, string> = {
  lancar: 'Lancar Matematika',
  baca: 'Baca Ulang',
  tka: 'Persiapan TKA',
  inggris: 'Bahasa Inggris',
  kartu: 'Gudang Ilmu',
  game: 'Game',
};

/** Mapel kemajuan topik yang cocok untuk tiap jenis tugas (topik lemah yang bisa dijadikan rujukan tugas). */
export const MAPEL_TUGAS: Record<JenisTugas, string | null> = {
  lancar: null,
  baca: null,
  tka: 'tka',
  inggris: 'ing',
  kartu: 'gudang',
  game: null,
};

/** Rute tempat anak mengerjakan tugas. */
export function ruteTugas(jenis: JenisTugas, rujukan?: string): string {
  switch (jenis) {
    case 'lancar':
      return '/lancar/lembar';
    case 'baca':
      return rujukan ? `/baca/${rujukan}` : '/baca';
    case 'tka':
      return rujukan ? `/tka/topik/${rujukan}` : '/tka';
    case 'inggris':
      return rujukan ? `/inggris/${rujukan}` : '/inggris';
    case 'kartu':
      return rujukan ? `/gudang/${rujukan}` : '/anak/gudang';
    default:
      return '/anak/main';
  }
}
