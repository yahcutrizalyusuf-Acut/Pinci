/** Logika Siap TKA di aplikasi: kunci bertahap, simpan latihan, kesiapan, rencana minggu ini, mini try out. */
import { buatId, sekarangIso } from '../data/alat';
import type { Anak, KemajuanTopik, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import type { Butir, PaketTka, Topik } from '../isi/tka/jenis';
import { buatMiniTryOut, latihanRumah, penyebabSalah, periksaJawaban, soalBerjenjang, type JawabanAnak, type SoalMiniTryOut } from '../isi/tka/pemuat';
import { paketTka as paketTkaBawaan_ } from '../isi/tka/paket';
import { perbaruiInti } from './hari-ini';
import { seninDari } from './rapor';

const paketTkaBawaan = () => paketTkaBawaan_;

export const MAPEL_TKA = 'tka';
const HARI_MS = 86_400_000;

/** Tiga tahap kunci berjenjang: 1/3 pertanyaan pancingan, 2/3 separuh langkah, 3/3 langkah lengkap. */
export function petunjukBertahap(b: Butir): string[] {
  const langkah = (b.pembahasan ?? '').trim();
  const kalimat = langkah
    .replace(/([.;→])\s+/g, '$1\n')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const pertama = b.petunjuk?.[0] ?? kalimat[0] ?? 'Baca lagi pertanyaannya pelan-pelan. Kata mana yang paling penting?';
  const separuh = kalimat.length > 1 ? kalimat.slice(0, Math.ceil(kalimat.length / 2)).join(' ') : 'Tulis dulu apa yang diketahui, lalu apa yang ditanya.';
  const lengkap = langkah || separuh;
  return [pertama, separuh === pertama ? lengkap : separuh, lengkap];
}

/** Topik kemajuan untuk satu butir: kode topik TKA bila sah, kalau tidak topik halamannya. */
export function topikButir(b: Butir, halaman?: string): string {
  return /^[MB]\d{2}$/.test(b.topik) ? b.topik : (halaman ?? b.sumber);
}

export interface JawabanTka {
  butir: Butir;
  jawaban: JawabanAnak;
  detik: number;
  petunjuk: number;
  /** jawaban percobaan pertama (Jalur Mandiri boleh mencoba lagi setelah petunjuk) */
  benarPertama?: boolean;
}

export function teksJawaban(j: JawabanAnak): string {
  return typeof j === 'string' ? j : j.join(',');
}

export function teksKunci(b: Butir): string {
  return typeof b.kunci === 'string' ? b.kunci : b.kunci.join(',');
}

export async function simpanLatihanTka(
  repo: Repositori,
  anak: Anak,
  opsi: { jenis: 'tka' | 'simulasi' | 'mini_tryout'; rujukan: string; mode: 'sendiri' | 'dampingi'; mulai: number; halaman?: string; tambahan?: Record<string, string | number | boolean | null> },
  daftar: JawabanTka[],
): Promise<Sesi> {
  const benar = daftar.filter((d) => (d.benarPertama ?? periksaJawaban(d.butir, d.jawaban))).length;
  const sesi = await repo.simpanSesi(
    {
      id: buatId(),
      anak_id: anak.id,
      jenis: opsi.jenis,
      mode: opsi.mode,
      kelas: anak.kelas,
      rujukan: opsi.rujukan,
      mulai: new Date(opsi.mulai).toISOString(),
      selesai: sekarangIso(),
      durasiDetik: Math.round((Date.now() - opsi.mulai) / 1000),
      benar,
      jumlah: daftar.length,
      tambahan: opsi.tambahan,
    },
    daftar.map((d, i) => {
      const ok = d.benarPertama ?? periksaJawaban(d.butir, d.jawaban);
      const sebab = ok ? [] : penyebabSalah(d.butir, d.jawaban);
      const kosong = teksJawaban(d.jawaban).replace(/,/g, '') === '';
      return {
        urutan: i + 1,
        soal: d.butir.pertanyaan.slice(0, 160),
        butirId: d.butir.id,
        kunci: teksKunci(d.butir),
        jawaban: teksJawaban(d.jawaban),
        benar: ok,
        detik: Math.round(d.detik),
        hapusN: 0,
        kodeSalah: ok ? undefined : kosong ? 'W' : (sebab.find((s) => s.kode)?.kode ?? undefined),
        topik: topikButir(d.butir, opsi.halaman),
        petunjukDipakai: d.petunjuk,
      };
    }),
  );
  if (opsi.mode === 'sendiri') {
    const perTopik = new Map<string, { b: number; s: number; p: number }>();
    for (const d of daftar) {
      const t = topikButir(d.butir, opsi.halaman);
      const v = perTopik.get(t) ?? { b: 0, s: 0, p: 0 };
      if (d.benarPertama ?? periksaJawaban(d.butir, d.jawaban)) v.b += 1;
      else v.s += 1;
      v.p += d.petunjuk > 0 ? 1 : 0;
      perTopik.set(t, v);
    }
    for (const [t, v] of perTopik) await repo.catatTopik(anak.id, MAPEL_TKA, t, v.b, v.s, v.p);
  }
  await perbaruiInti(repo, anak);
  return sesi;
}

// ---------- kesiapan dan rencana ----------

export type StatusPeta = 'belum' | 'latihan' | 'kuasai';

export function statusTopik(k: KemajuanTopik | undefined): StatusPeta {
  if (!k) return 'belum';
  return k.status === 'kuasai' ? 'kuasai' : k.benar + k.salah > 0 ? 'latihan' : 'belum';
}

export function persenTopik(k: KemajuanTopik | undefined): number | null {
  if (!k || k.benar + k.salah === 0) return null;
  return Math.round((k.benar / (k.benar + k.salah)) * 100);
}

/** Minggu program (1–12) sejak latihan TKA pertama anak. */
export function mingguProgram(sesiTka: Sesi[], sekarang: Date): number {
  if (sesiTka.length === 0) return 1;
  const awal = seninDari(new Date(sesiTka[0].mulai)).getTime();
  return Math.max(1, Math.min(12, Math.floor((seninDari(sekarang).getTime() - awal) / (7 * HARI_MS)) + 1));
}

export function mingguSimulasi(paket: PaketTka, minggu: number): boolean {
  return paket.topik.some((t) => t.simulasi && t.minggu === minggu);
}

export interface RencanaMinggu {
  minggu: number;
  topikBaru: Topik | null;
  lemah: { topik: Topik; persen: number }[];
  ulang: Topik | null;
  hariMini: string | null;
  simulasi: boolean;
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Rencana minggu ini (06-persiapan-tka.md 6b): 1 topik baru, 1–2 topik lemah, 1 ulang uji tunda, hari mini try out. */
export function rencanaMinggu(paket: PaketTka, kemajuan: KemajuanTopik[], sesiTka: Sesi[], sekarang: Date, hariMini = 6): RencanaMinggu {
  const peta = new Map(kemajuan.filter((k) => k.mapel === MAPEL_TKA).map((k) => [k.topik, k]));
  const urut = [...paket.topik].filter((t) => !t.simulasi).sort((a, b) => a.minggu - b.minggu || a.id.localeCompare(b.id));
  const minggu = mingguProgram(sesiTka, sekarang);
  const topikBaru = urut.find((t) => !peta.has(t.id)) ?? null;
  const lemah = urut
    .map((t) => ({ topik: t, k: peta.get(t.id) }))
    .filter((x): x is { topik: Topik; k: KemajuanTopik } => !!x.k && x.k.status !== 'kuasai' && (persenTopik(x.k) ?? 100) < 80)
    .sort((a, b) => (persenTopik(a.k) ?? 0) - (persenTopik(b.k) ?? 0))
    .slice(0, 2)
    .map((x) => ({ topik: x.topik, persen: persenTopik(x.k) ?? 0 }));
  const batasTunda = sekarang.getTime() - 21 * HARI_MS;
  const ulang =
    urut.find((t) => {
      const k = peta.get(t.id);
      return k && k.status === 'kuasai' && new Date(k.terakhir).getTime() <= batasTunda;
    }) ?? null;
  const simulasi = mingguSimulasi(paket, minggu);
  return { minggu, topikBaru, lemah, ulang, hariMini: simulasi ? null : NAMA_HARI[hariMini], simulasi };
}

export function kalimatRencana(r: RencanaMinggu): string[] {
  const b: string[] = [];
  if (r.topikBaru) b.push(`Topik baru: ${r.topikBaru.judul}`);
  for (const l of r.lemah) b.push(`Masih lemah: ${l.topik.judul} (${l.persen}%)`);
  if (r.ulang) b.push(`Ulang: ${r.ulang.judul}`);
  b.push(r.simulasi ? 'Minggu simulasi: kerjakan simulasi penuh, tanpa mini try out' : `Mini try out hari ${r.hariMini}`);
  return b;
}

/** Topik untuk mini try out: baru = dilatih 1–2 minggu terakhir, lama = terakhir ≥ 3 minggu lalu. */
export function topikMini(paket: PaketTka, kemajuan: KemajuanTopik[], sekarang: Date): { baru: string[]; lama: string[] } {
  const tka = kemajuan.filter((k) => k.mapel === MAPEL_TKA && /^[MB]\d{2}$/.test(k.topik));
  const umur = (k: KemajuanTopik) => (sekarang.getTime() - new Date(k.terakhir).getTime()) / HARI_MS;
  let baru = tka.filter((k) => umur(k) <= 14).map((k) => k.topik);
  let lama = tka.filter((k) => umur(k) >= 21).map((k) => k.topik);
  const urut = paket.topik.filter((t) => !t.simulasi).sort((a, b) => a.minggu - b.minggu).map((t) => t.id);
  // Belum cukup riwayat: ambil topik awal program supaya mini try out tetap bisa dicoba.
  if (baru.length === 0) baru = urut.slice(2, 6);
  if (lama.length === 0) lama = urut.slice(0, 2);
  return { baru, lama };
}

export function soalMiniTryOut(paket: PaketTka, kemajuan: KemajuanTopik[], sekarang: Date, benih: string, kecuali: string[] = []): SoalMiniTryOut[] {
  const t = topikMini(paket, kemajuan, sekarang);
  return buatMiniTryOut(paket, { benih, topikBaru: t.baru, topikLama: t.lama, kecuali }).soal;
}

/** Mini try out sudah dikerjakan minggu ini? */
export function miniMingguIni(sesi: Sesi[], sekarang: Date): boolean {
  const senin = seninDari(sekarang).getTime();
  return sesi.some((s) => s.jenis === 'mini_tryout' && new Date(s.mulai).getTime() >= senin);
}

/** Soal satu sesi Jalur Mandiri (≤ 10, ringan → berat) atau latihan rumah topik itu. */
export function soalSesi(idTopik: string, rumah: boolean, paket: PaketTka = paketTkaBawaan()): Butir[] {
  const sah = (b: Butir) => b.status !== 'perlu_dicek';
  if (rumah) return latihanRumah(paket, idTopik).filter(sah);
  const s = soalBerjenjang(paket, idTopik);
  return [...s.terbimbing.filter(sah).slice(0, 3), ...s.kelas.filter(sah).slice(0, 5), ...s.cadangan.filter(sah).slice(0, 2)].slice(0, 10);
}
