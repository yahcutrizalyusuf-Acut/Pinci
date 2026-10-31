/**
 * Alat kerja staf (super admin, admin, mitra les, pengawas) lewat server. Selalu daring:
 * papan kelas dan catatan dibaca langsung dari server, tidak disimpan di HP.
 * Sesi masuk staf disimpan terpisah dari sesi orang tua ('sesi_staf'), jadi satu HP bisa dipakai keduanya.
 * Hak akses dijaga aturan baris di server (supabase/migrations/20261101000000_kelas_pengawas.sql).
 */
import { buatId, kiniMs, sekarangIso } from './alat';
import type { JenisTugas, PaketKelas, StatusLangganan } from './jenis';
import type { Repositori } from './repositori';
import { opsiSupabase } from './sinkron';
import { segarkanSesi, type OpsiSupabase, type Sesimasuk } from './supabase';

export type PeranStaf = 'super_admin' | 'admin' | 'mitra' | 'pengawas';

export const NAMA_PERAN: Record<PeranStaf, string> = {
  super_admin: 'Super admin',
  admin: 'Admin',
  mitra: 'Mitra les',
  pengawas: 'Pengawas',
};

export const KUNCI_SESI_STAF = 'sesi_staf';
export const KUNCI_PROFIL_STAF = 'profil_staf';

/** Pengaturan server untuk staf (token dari sesi staf); null bila mode server mati. */
export function opsiStaf(repo: Repositori): OpsiSupabase | null {
  const o = opsiSupabase();
  if (process.env.EXPO_PUBLIC_DATA_MODE !== 'supabase' || !o) return null;
  return {
    ...o,
    ambilToken: async () => {
      const sesi = await repo.nilai<Sesimasuk>(KUNCI_SESI_STAF);
      if (!sesi) return null;
      if (sesi.berakhir - kiniMs() > 60_000) return sesi.tokenAkses;
      const baru = await segarkanSesi(o, sesi.tokenSegar).catch(() => null);
      if (!baru) return null;
      await repo.aturNilai(KUNCI_SESI_STAF, baru);
      return baru.tokenAkses;
    },
    ambilPenggunaId: async () => (await repo.nilai<Sesimasuk>(KUNCI_SESI_STAF))?.penggunaId ?? null,
  };
}

/** Galat yang bisa dijelaskan ke staf. */
export class GalatStaf extends Error {
  constructor(public alasan: 'belum_masuk' | 'tidak_boleh' | 'jaringan' | 'ditolak', pesan?: string) {
    super(pesan ?? alasan);
  }
}

async function minta<T>(opsi: OpsiSupabase, jalur: string, init: { method?: string; body?: unknown; prefer?: string } = {}): Promise<T> {
  const f = opsi.fetchFn ?? fetch;
  const token = (await opsi.ambilToken?.()) ?? null;
  if (!token) throw new GalatStaf('belum_masuk');
  let res: Response;
  try {
    res = await f(`${opsi.url}${jalur}`, {
      method: init.method ?? 'GET',
      headers: {
        apikey: opsi.kunciAnon,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.prefer ? { Prefer: init.prefer } : {}),
      },
      ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
    });
  } catch {
    throw new GalatStaf('jaringan');
  }
  if (res.status === 401) throw new GalatStaf('belum_masuk');
  if (res.status === 403) throw new GalatStaf('tidak_boleh');
  if (!res.ok) {
    let pesan = '';
    try {
      pesan = ((await res.json()) as { message?: string }).message ?? '';
    } catch {
      // badan jawaban kosong
    }
    throw new GalatStaf(pesan === 'tidak_boleh' ? 'tidak_boleh' : 'ditolak', pesan);
  }
  const teks = await res.text();
  return (teks ? JSON.parse(teks) : null) as T;
}

const rpc = <T>(opsi: OpsiSupabase, nama: string, isi: object = {}) => minta<T>(opsi, `/rest/v1/rpc/${nama}`, { method: 'POST', body: isi });

// ---------- akun staf ----------

export interface ProfilStaf {
  peran: PeranStaf;
  nama: string;
  mitraId: string | null;
}

/** Setelah masuk dengan email: pakai undangan yang cocok. null = email ini belum terdaftar sebagai staf. */
export async function terimaUndangan(opsi: OpsiSupabase): Promise<ProfilStaf | null> {
  const d = await rpc<{ ok: boolean; peran?: PeranStaf; nama?: string; mitra_id?: string | null }>(opsi, 'terima_undangan');
  if (!d.ok || !d.peran) return null;
  return { peran: d.peran, nama: d.nama ?? '', mitraId: d.mitra_id ?? null };
}

export async function undangStaf(opsi: OpsiSupabase, data: { email: string; peran: PeranStaf; nama: string; mitraId?: string | null }) {
  await rpc(opsi, 'undang_staf', { p_email: data.email, p_peran: data.peran, p_nama: data.nama, p_mitra_id: data.mitraId ?? null });
}

export interface Staf {
  id: string;
  peran: PeranStaf;
  nama: string;
  mitraId: string | null;
  aktif: boolean;
}

export async function daftarStaf(opsi: OpsiSupabase): Promise<Staf[]> {
  const d = await minta<{ id: string; peran: PeranStaf; nama: string; mitra_id: string | null; aktif: boolean }[]>(opsi, '/rest/v1/staf?select=id,peran,nama,mitra_id,aktif&order=nama.asc');
  return d.map((s) => ({ id: s.id, peran: s.peran, nama: s.nama, mitraId: s.mitra_id, aktif: s.aktif }));
}

export async function aturStafAktif(opsi: OpsiSupabase, stafId: string, aktif: boolean) {
  await rpc(opsi, 'atur_staf_aktif', { p_staf_id: stafId, p_aktif: aktif });
}

export interface Mitra {
  id: string;
  nama: string;
  kota: string | null;
}

export async function daftarMitra(opsi: OpsiSupabase): Promise<Mitra[]> {
  return minta<Mitra[]>(opsi, '/rest/v1/mitra?select=id,nama,kota&order=nama.asc');
}

export async function buatMitra(opsi: OpsiSupabase, nama: string, kota: string): Promise<string> {
  return rpc<string>(opsi, 'buat_mitra', { p_nama: nama, p_kota: kota });
}

// ---------- kelas ----------

export interface RingkasKelas {
  id: string;
  nama: string;
  kode: string;
  kapasitas: number;
  aktif: boolean;
  mitraId: string | null;
  pengawasId: string | null;
  pengawasNama: string | null;
  jumlahAnak: number;
  pantauanTerakhir: string | null;
}

export async function daftarKelasSaya(opsi: OpsiSupabase): Promise<RingkasKelas[]> {
  const d = await rpc<
    {
      id: string;
      nama: string;
      kode: string;
      kapasitas: number;
      aktif: boolean;
      mitra_id: string | null;
      pengawas_id: string | null;
      pengawas_nama: string | null;
      jumlah_anak: number;
      pantauan_terakhir: string | null;
    }[]
  >(opsi, 'daftar_kelas_saya');
  return d.map((k) => ({
    id: k.id,
    nama: k.nama,
    kode: k.kode,
    kapasitas: k.kapasitas,
    aktif: k.aktif,
    mitraId: k.mitra_id,
    pengawasId: k.pengawas_id,
    pengawasNama: k.pengawas_nama,
    jumlahAnak: k.jumlah_anak,
    pantauanTerakhir: k.pantauan_terakhir,
  }));
}

export async function buatKelas(opsi: OpsiSupabase, data: { nama: string; pengawasId: string | null; mitraId?: string | null }): Promise<{ id: string; kode: string }> {
  return rpc(opsi, 'buat_kelas', { p_nama: data.nama, p_pengawas_id: data.pengawasId, p_mitra_id: data.mitraId ?? null });
}

export async function ubahKelas(opsi: OpsiSupabase, data: { id: string; nama: string; pengawasId: string | null; aktif: boolean }) {
  await rpc(opsi, 'ubah_kelas', { p_id: data.id, p_nama: data.nama, p_pengawas_id: data.pengawasId, p_aktif: data.aktif });
}

export interface TopikLemah {
  mapel: string;
  topik: string;
  persen: number;
}

export interface AnakPapan {
  anakId: string;
  nama: string;
  kelas: number;
  hewan: string;
  paket: PaketKelas;
  cobaSampai: string;
  masuk: string;
  terakhirLatihan: string | null;
  hariLatihan7: number;
  hariLatihan4: number;
  topikLemah: TopikLemah[];
  catatanTerakhir: string | null;
  tugasTerbuka: number;
  status?: StatusLangganan;
}

export interface PapanKelas {
  kelas: { id: string; nama: string; kode: string; kapasitas: number; aktif: boolean; pengawasId: string | null };
  hariIni: string;
  pantauanHariIni: boolean;
  anak: AnakPapan[];
}

export async function papanKelas(opsi: OpsiSupabase, kelasId: string): Promise<PapanKelas> {
  const d = await rpc<{
    kelas: { id: string; nama: string; kode: string; kapasitas: number; aktif: boolean; pengawas_id: string | null };
    hari_ini: string;
    pantauan_hari_ini: boolean;
    anak: {
      anak_id: string;
      nama: string;
      kelas: number;
      hewan: string;
      paket: PaketKelas;
      coba_sampai: string;
      masuk: string;
      terakhir_latihan: string | null;
      hari_latihan_7: number;
      hari_latihan_4: number;
      topik_lemah: TopikLemah[];
      catatan_terakhir: string | null;
      tugas_terbuka: number;
    }[];
  }>(opsi, 'papan_kelas', { p_kelas_id: kelasId });
  // Status langganan tiap anak (fungsi tambahan; papan tetap tampil bila belum terpasang).
  const status = await rpc<Record<string, StatusLangganan>>(opsi, 'status_anak_kelas', { p_kelas_id: kelasId }).catch(() => ({}) as Record<string, StatusLangganan>);
  return {
    kelas: { id: d.kelas.id, nama: d.kelas.nama, kode: d.kelas.kode, kapasitas: d.kelas.kapasitas, aktif: d.kelas.aktif, pengawasId: d.kelas.pengawas_id },
    hariIni: d.hari_ini,
    pantauanHariIni: d.pantauan_hari_ini,
    anak: d.anak.map((a) => ({
      anakId: a.anak_id,
      nama: a.nama,
      kelas: a.kelas,
      hewan: a.hewan,
      paket: a.paket,
      cobaSampai: a.coba_sampai,
      masuk: a.masuk,
      terakhirLatihan: a.terakhir_latihan,
      hariLatihan7: a.hari_latihan_7,
      hariLatihan4: a.hari_latihan_4,
      topikLemah: a.topik_lemah ?? [],
      catatanTerakhir: a.catatan_terakhir,
      tugasTerbuka: a.tugas_terbuka,
      ...(status[a.anak_id] ? { status: status[a.anak_id] } : {}),
    })),
  };
}

export async function catatPantauan(opsi: OpsiSupabase, kelasId: string) {
  await rpc(opsi, 'catat_pantauan', { p_kelas_id: kelasId });
}

// ---------- catatan dan tugas ----------

/** Keluarga pemilik anak di kelas ini (dibutuhkan saat menulis catatan dan tugas). */
async function keluargaAnggota(opsi: OpsiSupabase, kelasId: string, anakId: string): Promise<string> {
  const d = await minta<{ keluarga_id: string }[]>(
    opsi,
    `/rest/v1/anggota_kelas?select=keluarga_id&kelas_id=eq.${encodeURIComponent(kelasId)}&anak_id=eq.${encodeURIComponent(anakId)}&keluar=is.null`,
  );
  if (!d[0]) throw new GalatStaf('tidak_boleh');
  return d[0].keluarga_id;
}

export interface CatatanStaf {
  id: string;
  isi: string;
  waktu: string;
  dibaca: string | null;
}

export async function daftarCatatanAnak(opsi: OpsiSupabase, kelasId: string, anakId: string): Promise<CatatanStaf[]> {
  return minta<CatatanStaf[]>(
    opsi,
    `/rest/v1/catatan_pengawas?select=id,isi,waktu,dibaca&kelas_id=eq.${encodeURIComponent(kelasId)}&anak_id=eq.${encodeURIComponent(anakId)}&order=waktu.desc&limit=20`,
  );
}

export async function kirimCatatan(opsi: OpsiSupabase, data: { kelasId: string; anakId: string; isi: string }) {
  const stafId = (await opsi.ambilPenggunaId?.()) ?? null;
  if (!stafId) throw new GalatStaf('belum_masuk');
  const keluargaId = await keluargaAnggota(opsi, data.kelasId, data.anakId);
  await minta(opsi, '/rest/v1/catatan_pengawas', {
    method: 'POST',
    prefer: 'return=minimal',
    body: { id: buatId(), kelas_id: data.kelasId, anak_id: data.anakId, keluarga_id: keluargaId, staf_id: stafId, isi: data.isi.trim(), waktu: sekarangIso() },
  });
}

export interface TugasStaf {
  id: string;
  jenis: JenisTugas;
  rujukan: string | null;
  judul: string;
  pesan: string | null;
  dibuat: string;
  selesai: string | null;
}

export async function daftarTugasAnak(opsi: OpsiSupabase, kelasId: string, anakId: string): Promise<TugasStaf[]> {
  return minta<TugasStaf[]>(
    opsi,
    `/rest/v1/tugas?select=id,jenis,rujukan,judul,pesan,dibuat,selesai&kelas_id=eq.${encodeURIComponent(kelasId)}&anak_id=eq.${encodeURIComponent(anakId)}&dibatalkan=is.false&order=dibuat.desc&limit=20`,
  );
}

export async function beriTugas(opsi: OpsiSupabase, data: { kelasId: string; anakId: string; jenis: JenisTugas; judul: string; rujukan?: string; pesan?: string }) {
  const stafId = (await opsi.ambilPenggunaId?.()) ?? null;
  if (!stafId) throw new GalatStaf('belum_masuk');
  const keluargaId = await keluargaAnggota(opsi, data.kelasId, data.anakId);
  await minta(opsi, '/rest/v1/tugas', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      id: buatId(),
      kelas_id: data.kelasId,
      anak_id: data.anakId,
      keluarga_id: keluargaId,
      staf_id: stafId,
      jenis: data.jenis,
      rujukan: data.rujukan?.trim() || null,
      judul: data.judul.trim(),
      pesan: data.pesan?.trim() || null,
      dibuat: sekarangIso(),
    },
  });
}

export async function batalkanTugas(opsi: OpsiSupabase, tugasId: string) {
  await minta(opsi, `/rest/v1/tugas?id=eq.${encodeURIComponent(tugasId)}`, { method: 'PATCH', prefer: 'return=minimal', body: { dibatalkan: true } });
}

// ---------- langganan dan uang (super admin dan admin) ----------

export interface Langganan {
  anakId: string;
  anakNama: string;
  kelas: number;
  kelasNama: string;
  paket: PaketKelas;
  cobaSampai: string;
  berlakuSampai: string | null;
  status: StatusLangganan;
  emailOrtu: string | null;
  sapaan: string | null;
}

export async function daftarLangganan(opsi: OpsiSupabase): Promise<Langganan[]> {
  const d = await rpc<
    { anak_id: string; anak_nama: string; kelas: number; kelas_nama: string; paket: PaketKelas; coba_sampai: string; berlaku_sampai: string | null; status: StatusLangganan; email_ortu: string | null; sapaan: string | null }[]
  >(opsi, 'daftar_langganan');
  return d.map((x) => ({
    anakId: x.anak_id,
    anakNama: x.anak_nama,
    kelas: x.kelas,
    kelasNama: x.kelas_nama,
    paket: x.paket,
    cobaSampai: x.coba_sampai,
    berlakuSampai: x.berlaku_sampai,
    status: x.status,
    emailOrtu: x.email_ortu,
    sapaan: x.sapaan,
  }));
}

export type CaraBayar = 'qris' | 'transfer' | 'tunai' | 'play';

export async function aktifkanLangganan(opsi: OpsiSupabase, data: { anakId: string; bulan: number; jumlah: number; cara: CaraBayar; catatan?: string }): Promise<string> {
  const d = await rpc<{ berlaku_sampai: string }>(opsi, 'aktifkan_langganan', { p_anak_id: data.anakId, p_bulan: data.bulan, p_jumlah: data.jumlah, p_cara: data.cara, p_catatan: data.catatan ?? null });
  return d.berlaku_sampai;
}

export type HargaPaket = Partial<Record<PaketKelas | 'mitra', number>>;

export async function daftarHarga(opsi: OpsiSupabase): Promise<HargaPaket> {
  return rpc<HargaPaket>(opsi, 'daftar_harga');
}

export async function aturHarga(opsi: OpsiSupabase, paket: PaketKelas | 'mitra', harga: number) {
  await rpc(opsi, 'atur_harga', { p_paket: paket, p_harga: harga });
}

export interface TagihanMitra {
  mitraId: string;
  nama: string;
  muridAktif: number;
  tarif: number;
  total: number;
}

/** Tagihan les mitra untuk bulan `bulan` (YYYY-MM-01). */
export async function tagihanMitra(opsi: OpsiSupabase, bulan: string): Promise<TagihanMitra[]> {
  const d = await rpc<{ mitra_id: string; nama: string; murid_aktif: number; tarif: number; total: number }[]>(opsi, 'tagihan_mitra', { p_bulan: bulan });
  return d.map((x) => ({ mitraId: x.mitra_id, nama: x.nama, muridAktif: x.murid_aktif, tarif: x.tarif, total: x.total }));
}

// ---------- pendaftar, masukan, laporan ----------

export type StatusPendaftar = 'baru' | 'dihubungi' | 'masuk_kelas' | 'batal';

export interface Pendaftar {
  id: string;
  jenis: 'keluarga' | 'mitra';
  nama_ortu: string;
  email: string;
  wa: string | null;
  kelas_anak: number | null;
  nama_anak: string | null;
  nama_les: string | null;
  sumber: string | null;
  status: StatusPendaftar;
  catatan: string | null;
  waktu: string;
}

export async function daftarPendaftar(opsi: OpsiSupabase): Promise<Pendaftar[]> {
  return rpc<Pendaftar[]>(opsi, 'daftar_pendaftar');
}

export async function ubahPendaftar(opsi: OpsiSupabase, id: string, status: StatusPendaftar, catatan: string) {
  await rpc(opsi, 'ubah_pendaftar', { p_id: id, p_status: status, p_catatan: catatan });
}

export interface MasukanStaf {
  masukan: { id: string; jenis: 'masalah' | 'saran' | 'pujian'; isi: string; waktu: string; versi: string | null; dibaca: boolean; sapaan: string | null }[];
  teknis: { pesan: string; jumlah: number; terakhir: string }[];
}

export async function daftarMasukanStaf(opsi: OpsiSupabase): Promise<MasukanStaf> {
  return (await rpc<MasukanStaf | null>(opsi, 'daftar_masukan')) ?? { masukan: [], teknis: [] };
}

export async function tandaiMasukanDibaca(opsi: OpsiSupabase, ids: string[]) {
  await rpc(opsi, 'tandai_masukan_dibaca', { p_ids: ids });
}

export interface LaporanMingguan {
  sejak: string;
  keluarga_aktif: number;
  anak_aktif: number;
  rata_hari_latihan: number | null;
  status: Partial<Record<StatusLangganan, number>>;
  anak_berhenti_latihan: number;
  keluar_kelas: number;
  masuk_kelas: number;
  pendaftar_baru: number;
  pendaftar_per_sumber: Record<string, number>;
  masukan_baru: number;
  masalah_teknis: number;
  kelas_tanpa_pantauan: string[];
  pantauan_minggu_ini: number;
  uang_minggu_ini: number | null;
  bayar_minggu_ini: number;
}

export async function laporanMingguan(opsi: OpsiSupabase): Promise<LaporanMingguan> {
  return rpc<LaporanMingguan>(opsi, 'laporan_mingguan');
}
