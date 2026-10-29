/**
 * Jenis data lokal. Mengikuti docs/rancangan/02-rancangan/03-basis-data.md,
 * hanya bagian yang dibutuhkan cakupan pembangunan ini.
 * Nomor (id) selalu dibuat di HP supaya kiriman ulang tidak menghasilkan data ganda.
 */

export type HewanProfil = 'gajah' | 'kancil' | 'harimau' | 'rangkong' | 'penyu' | 'kucing' | 'ikan' | 'kupu';

export const HEWAN: Record<HewanProfil, { emoji: string; nama: string; latar: string }> = {
  gajah: { emoji: '🐘', nama: 'Gajah', latar: '#E6F0FF' },
  kancil: { emoji: '🦌', nama: 'Kancil', latar: '#FFF0D9' },
  harimau: { emoji: '🐯', nama: 'Harimau', latar: '#FFF0D9' },
  rangkong: { emoji: '🐦', nama: 'Rangkong', latar: '#FDECEC' },
  penyu: { emoji: '🐢', nama: 'Penyu', latar: '#E4F4EB' },
  kucing: { emoji: '🐱', nama: 'Kucing', latar: '#F1ECFA' },
  ikan: { emoji: '🐟', nama: 'Ikan', latar: '#E8F4FC' },
  kupu: { emoji: '🦋', nama: 'Kupu-kupu', latar: '#F1ECFA' },
};

export interface Keluarga {
  id: string;
  dibuat: string;
  /** sidik PIN orang tua (SHA-256 dengan garam), tidak pernah PIN asli */
  pinHash: string;
  garam: string;
  /** penanda nama panggilan orang tua untuk pesan, mis. "Ayah" atau "Bunda" */
  sapaanOrtu: string;
  modeData: 'lokal' | 'supabase';
}

export interface Anak {
  id: string;
  keluarga_id: string;
  /** nama panggilan saja (data seminim mungkin) */
  nama: string;
  kelas: number;
  hewan: HewanProfil;
  dibuat: string;
  tingkatInggris?: 3 | 4 | 5 | 6;
}

export type JenisSesi =
  | 'penempatan'
  | 'lancar'
  | 'tka'
  | 'simulasi'
  | 'mini_tryout'
  | 'baca'
  | 'inggris'
  | 'kartu'
  | 'game';

export interface Sesi {
  id: string;
  anak_id: string;
  jenis: JenisSesi;
  mode: 'sendiri' | 'dampingi';
  kelas: number;
  /** level Lancar, nomor unit Inggris, atau kosong */
  level?: number;
  /** topik/teks/simulasi/kartu yang dikerjakan */
  rujukan?: string;
  mulai: string;
  selesai: string;
  durasiDetik: number;
  benih?: string;
  hasil?: string;
  benar: number;
  jumlah: number;
  /** ketukan perasaan anak di akhir lembar */
  perasaan?: string;
  /** penghitung yang hanya naik (urutan_hp) */
  urutanHp: number;
  /** data tambahan per jenis (kpm Baca Ulang, nilai simulasi, dll.) */
  tambahan?: Record<string, string | number | boolean | null>;
}

export interface Jawaban {
  id: string;
  sesi_id: string;
  anak_id: string;
  urutan: number;
  soal: string;
  butirId?: string;
  kunci: string;
  jawaban: string;
  benar: boolean;
  detik: number;
  hapusN: number;
  ulang?: boolean;
  /** kode penyebab salah dari pengecoh (TKA) atau keluarga fakta (Lancar) */
  kodeSalah?: string;
  /** topik TKA/kartu ilmu atau keluarga fakta */
  topik?: string;
  petunjukDipakai?: number;
}

export interface Pesan {
  id: string;
  keluarga_id: string;
  anak_id: string;
  dari: 'orang_tua' | 'anak';
  jenis: 'teks' | 'stiker' | 'siap_pakai' | 'bantu_aku';
  isi: string;
  waktu: string;
  dibaca?: string;
}

export interface PengaturanWaktu {
  id: string; // = anak_id
  anak_id: string;
  /** batas belajar per hari, menit (≤ 10 × kelas) */
  belajarMenit: number;
  /** batas game per hari, menit (0–60) */
  gameMenit: number;
  /** true = waktu main terbuka setelah inti harian (bawaan); false = selalu terbuka */
  gameSetelahInti: boolean;
  /** "HH:MM" */
  jamTenang: string;
  jamBangun: string;
  bunyi: boolean;
}

export interface Pemakaian {
  id: string; // anak_id + tanggal
  anak_id: string;
  tanggal: string; // YYYY-MM-DD
  belajarDetik: number;
  mainDetik: number;
  /** detik belajar di blok berjalan (≤ 15 menit lalu istirahat) */
  blokDetik: number;
  istirahatSampai?: string;
  intiSelesai: boolean;
}

export type StatusTopik = 'belum' | 'belajar' | 'kuasai';
export type TandaBimbingan = 'hijau' | 'kuning' | 'merah';

export interface KemajuanTopik {
  id: string; // anak_id:mapel:topik
  anak_id: string;
  mapel: string;
  topik: string;
  status: StatusTopik;
  benar: number;
  salah: number;
  petunjuk: number;
  terakhir: string;
  tanda: TandaBimbingan;
  alasan?: string;
}

export interface ItemAntrean {
  id: string;
  tabel: NamaTabel;
  barisId: string;
  dibuat: string;
  terkirim?: string;
  coba: number;
  berikutnya?: string;
}

export interface Nilai {
  id: string;
  anak_id?: string;
  isi: string; // JSON
}

export type NamaTabel =
  | 'keluarga'
  | 'anak'
  | 'sesi'
  | 'jawaban'
  | 'pesan'
  | 'pengaturan_waktu'
  | 'pemakaian'
  | 'kemajuan_topik'
  | 'antrean'
  | 'nilai';

export interface PetaTabel {
  keluarga: Keluarga;
  anak: Anak;
  sesi: Sesi;
  jawaban: Jawaban;
  pesan: Pesan;
  pengaturan_waktu: PengaturanWaktu;
  pemakaian: Pemakaian;
  kemajuan_topik: KemajuanTopik;
  antrean: ItemAntrean;
  nilai: Nilai;
}

/** Tabel yang dikirim ke server lewat antrean sinkron. */
export const TABEL_SINKRON: NamaTabel[] = ['anak', 'sesi', 'jawaban', 'pesan', 'pengaturan_waktu', 'pemakaian', 'kemajuan_topik'];
