/**
 * Logika Susun Kubus (G05). TypeScript murni, tanpa React.
 *
 * Petak = kisi tinggi tumpukan: `petak[baris][kolom]` = banyak kubus.
 * Arah: baris 0 = baris paling BELAKANG (atas pada denah), baris terakhir = paling depan.
 * Kolom 0 = paling kiri bila dilihat dari depan.
 *
 * - Tampak depan: tinggi tertinggi tiap kolom (indeks = kolom, kiri → kanan).
 * - Tampak samping (dilihat dari KANAN): tinggi tertinggi tiap baris, urut kiri → kanan
 *   seperti yang terlihat dari kanan, yaitu baris paling depan dulu.
 * - Tampak atas: petak mana yang berisi kubus (denah, sama arah dengan `petak`).
 *
 * Teka-teki dibangkitkan dari susunan jawaban, jadi selalu bisa diselesaikan.
 * Kubus yang membuat suatu kartu terlampaui memantul (tidak ditaruh) dan dihitung belum tepat.
 * Karena setiap petak punya batas tinggi `batasTinggi`, susunan "isi semua sampai batas" selalu
 * cocok, sehingga tidak pernah ada keadaan buntu. Kelas 1–2 cukup mengetuk petak.
 */
import { buatAcak, type PembangkitAcak } from '../bersama/acak';
import {
  BATAS_SALAH_PETUNJUK,
  kelompokKelas,
  type Kelas,
  type OpsiBabakDasar,
  type Tingkat,
} from '../bersama/jenis';
import { pilihKejutan, type Kejutan } from '../bersama/kejutan';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';

export type Petak = readonly (readonly number[])[];
export type Denah = readonly (readonly boolean[])[];
export type JenisKartu = 'depan' | 'samping' | 'atas';

/** Kartu yang harus dicocokkan. `depan` selalu ada. */
export interface KartuTarget {
  depan: readonly number[];
  samping?: readonly number[];
  atas?: Denah;
}

export interface TekaTeki {
  id: string;
  baris: number;
  kolom: number;
  tinggiMaks: number;
  target: KartuTarget;
  /** Satu susunan jawaban (bukan satu-satunya). */
  contohJawaban: Petak;
}

export type OpsiBabakSusunKubus = OpsiBabakDasar;

/** menyusun → cocok (menunggu "lanjut") → … → selesai. */
export type FaseSusunKubus = 'menyusun' | 'cocok' | 'selesai';

export interface BelumCocok {
  /** Kolom tampak depan yang belum cocok. */
  kolomDepan: number[];
  /** Indeks baris (seperti `petak`) yang tampak sampingnya belum cocok. */
  barisSamping: number[];
  /** Petak denah yang belum cocok: [baris, kolom]. */
  petakAtas: [number, number][];
}

export interface KeadaanSusunKubus {
  game: 'susun_kubus';
  kelas: Kelas;
  tingkat: Tingkat;
  daftarTekaTeki: readonly TekaTeki[];
  indeks: number;
  petak: Petak;
  /** Riwayat petak yang ditambah, untuk urung: [baris, kolom]. */
  riwayat: readonly (readonly [number, number])[];
  fase: FaseSusunKubus;
  salah: number;
  petunjuk: string | null;
  /** Petak tempat kubus memantul. */
  pantul: readonly [number, number] | null;
  /** Bagian yang belum cocok (untuk garis putus-putus), selalu terbaru. */
  belumCocok: BelumCocok;
  pesan: string;
  kejutan: Kejutan | null;
  benihAcak: number;
  perkiraanDetik: number;
  catatan: { tekaTekiSelesai: number; kubusDitaruh: number; petunjuk: number };
}

export type AksiSusunKubus =
  | { jenis: 'tambah'; baris: number; kolom: number }
  | { jenis: 'urung' }
  | { jenis: 'lanjut' };

export const DETIK_SUSUN_KUBUS = {
  /** Mengamati kartu sebelum mulai, per jenis kartu. */
  amatiPerKartu: 6,
  tambah: 2,
  urung: 2,
  pantul: 1,
  lanjut: 3,
} as const;

// ---------- Fungsi tampak ----------

export function petakKosong(baris: number, kolom: number): number[][] {
  return Array.from({ length: baris }, () => Array.from({ length: kolom }, () => 0));
}

export function tampakDepan(petak: Petak): number[] {
  const kolom = petak[0]?.length ?? 0;
  return Array.from({ length: kolom }, (_, k) => Math.max(0, ...petak.map((b) => b[k])));
}

/** Dilihat dari kanan: baris paling depan di kiri. */
export function tampakSamping(petak: Petak): number[] {
  return petak.map((b) => Math.max(0, ...b)).reverse();
}

export function tampakAtas(petak: Petak): boolean[][] {
  return petak.map((b) => b.map((t) => t > 0));
}

function samaDaftar(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** Membuat kartu target dari sebuah susunan. */
export function kartuDari(petak: Petak, kartu: readonly JenisKartu[]): KartuTarget {
  const target: KartuTarget = { depan: tampakDepan(petak) };
  return {
    ...target,
    ...(kartu.includes('samping') ? { samping: tampakSamping(petak) } : {}),
    ...(kartu.includes('atas') ? { atas: tampakAtas(petak) } : {}),
  };
}

export function bagianBelumCocok(petak: Petak, target: KartuTarget): BelumCocok {
  const depan = tampakDepan(petak);
  const kolomDepan = target.depan.map((t, i) => (depan[i] === t ? -1 : i)).filter((i) => i >= 0);
  const barisSamping: number[] = [];
  if (target.samping) {
    const samping = tampakSamping(petak);
    const n = petak.length;
    target.samping.forEach((t, i) => {
      if (samping[i] !== t) barisSamping.push(n - 1 - i);
    });
    barisSamping.sort((a, b) => a - b);
  }
  const petakAtas: [number, number][] = [];
  if (target.atas) {
    const atas = tampakAtas(petak);
    target.atas.forEach((barisT, b) =>
      barisT.forEach((isi, k) => {
        if (atas[b][k] !== isi) petakAtas.push([b, k]);
      }),
    );
  }
  return { kolomDepan, barisSamping, petakAtas };
}

/** `true` bila semua kartu yang diberikan cocok dengan petak. */
export function cocok(petak: Petak, target: KartuTarget): boolean {
  if (!samaDaftar(tampakDepan(petak), target.depan)) return false;
  if (target.samping && !samaDaftar(tampakSamping(petak), target.samping)) return false;
  if (target.atas) {
    const atas = tampakAtas(petak);
    if (!target.atas.every((b, i) => b.every((x, j) => x === atas[i][j]))) return false;
  }
  return true;
}

/**
 * Tinggi paling banyak di tiap petak tanpa melampaui kartu mana pun.
 * Susunan setinggi batas ini selalu cocok dengan kartu (dasar "tidak pernah buntu").
 */
export function batasTinggi(t: TekaTeki): number[][] {
  const { target } = t;
  return Array.from({ length: t.baris }, (_, b) =>
    Array.from({ length: t.kolom }, (_, k) => {
      if (target.atas && !target.atas[b][k]) return 0;
      const dariDepan = target.depan[k];
      const dariSamping = target.samping ? target.samping[t.baris - 1 - b] : t.tinggiMaks;
      return Math.min(t.tinggiMaks, dariDepan, dariSamping);
    }),
  );
}

// ---------- Pembangkit teka-teki ----------

interface JenjangTekaTeki {
  baris: number;
  kolom: number;
  tinggiMaks: number;
  kubusMin: number;
  kubusMaks: number;
  kartu: readonly JenisKartu[];
}

const D: readonly JenisKartu[] = ['depan'];
const DA: readonly JenisKartu[] = ['depan', 'atas'];
const DSA: readonly JenisKartu[] = ['depan', 'samping', 'atas'];
const DS: readonly JenisKartu[] = ['depan', 'samping'];

/** Urutan teka-teki per babak, dari mudah ke sulit. Santai hanya memakai kartu tampak depan; Seru memakai kartu lain. */
export function jenjangUntuk(kelas: Kelas, tingkat: Tingkat): readonly JenjangTekaTeki[] {
  const kelompok = kelompokKelas(kelas);
  const seru = tingkat === 'seru';
  const j = (baris: number, kolom: number, tinggiMaks: number, kubusMin: number, kubusMaks: number, kartu: readonly JenisKartu[]): JenjangTekaTeki => ({
    baris,
    kolom,
    tinggiMaks,
    kubusMin,
    kubusMaks,
    kartu,
  });
  if (kelompok === 'awal') {
    return seru
      ? [j(1, 3, 3, 4, 6, D), j(1, 4, 3, 5, 7, D), j(1, 4, 3, 6, 8, D), j(1, 5, 3, 7, 9, D), j(1, 5, 3, 8, 10, D), j(2, 2, 2, 4, 6, DA)]
      : [j(1, 3, 2, 3, 4, D), j(1, 3, 2, 4, 5, D), j(1, 4, 2, 4, 6, D), j(1, 4, 3, 5, 7, D), j(1, 4, 3, 6, 8, D), j(1, 5, 3, 6, 8, D), j(1, 5, 3, 7, 9, D)];
  }
  if (kelompok === 'tengah') {
    return seru
      ? [j(2, 2, 3, 4, 7, DSA), j(2, 3, 3, 5, 8, DSA), j(2, 3, 3, 6, 9, DSA), j(3, 3, 2, 6, 9, DSA), j(3, 3, 3, 7, 10, DSA)]
      : [j(1, 3, 2, 3, 5, D), j(1, 4, 3, 5, 7, D), j(1, 5, 3, 6, 9, D), j(2, 3, 2, 4, 6, D), j(2, 3, 3, 5, 8, D), j(2, 4, 3, 6, 9, D)];
  }
  return seru
    ? [j(2, 3, 3, 6, 9, DSA), j(3, 3, 2, 6, 9, DSA), j(3, 3, 3, 7, 11, DSA), j(3, 3, 3, 8, 12, DSA), j(3, 3, 3, 6, 10, DS)]
    : [j(1, 4, 3, 5, 7, D), j(1, 5, 3, 6, 9, D), j(2, 3, 3, 5, 8, D), j(2, 4, 3, 6, 10, D), j(3, 3, 3, 7, 10, D)];
}

function tandaTarget(t: KartuTarget): string {
  return JSON.stringify(t);
}

function cobaSusunan(acak: PembangkitAcak, j: JenjangTekaTeki): number[][] | null {
  const petak = petakKosong(j.baris, j.kolom);
  const total = acak.bulat(j.kubusMin, j.kubusMaks);
  const sel = j.baris * j.kolom;
  if (total > sel * j.tinggiMaks) return null;
  // Setiap kolom tampak depan minimal 1 kubus supaya kartu tidak berlubang.
  for (let k = 0; k < j.kolom; k++) petak[acak.bulat(0, j.baris - 1)][k] += 1;
  let sisa = total - j.kolom;
  if (sisa < 0) return null;
  let jaga = 0;
  while (sisa > 0 && jaga++ < 1000) {
    const b = acak.bulat(0, j.baris - 1);
    const k = acak.bulat(0, j.kolom - 1);
    // Tambah satu kubus di petak acak yang belum setinggi batas.
    if (petak[b][k] < j.tinggiMaks) {
      petak[b][k] += 1;
      sisa -= 1;
    }
  }
  return sisa === 0 ? petak : null;
}

function buatDaftarTekaTeki(acak: PembangkitAcak, kelas: Kelas, tingkat: Tingkat): TekaTeki[] {
  const tanda = new Set<string>();
  return jenjangUntuk(kelas, tingkat).map((j, i) => {
    for (let coba = 0; coba < 1000; coba++) {
      const susunan = cobaSusunan(acak, j);
      if (susunan === null) continue;
      const target = kartuDari(susunan, j.kartu);
      // Kartu yang terlalu "datar" (semua kolom sama) kurang menarik; boleh bila sudah sering gagal.
      const datar = new Set(target.depan).size === 1 && coba < 200;
      const t = tandaTarget(target);
      if (datar || tanda.has(t)) continue;
      tanda.add(t);
      return {
        id: `kubus-${i + 1}`,
        baris: j.baris,
        kolom: j.kolom,
        tinggiMaks: j.tinggiMaks,
        target,
        contohJawaban: susunan,
      };
    }
    throw new Error('Gagal membuat teka-teki kubus.');
  });
}

// ---------- Babak ----------

function pesanAwal(t: TekaTeki): string {
  if (t.target.samping || t.target.atas) return 'Susun kubus supaya sama seperti semua kartu.';
  return 'Susun kubus supaya sama seperti kartu.';
}

function detikAmati(t: TekaTeki): number {
  const n = 1 + (t.target.samping ? 1 : 0) + (t.target.atas ? 1 : 0);
  return n * DETIK_SUSUN_KUBUS.amatiPerKartu;
}

export function buatBabak(opsi: OpsiBabakSusunKubus): KeadaanSusunKubus {
  const acak = buatAcak(opsi.benih);
  const daftarTekaTeki = buatDaftarTekaTeki(acak, opsi.kelas, opsi.tingkat);
  const t = daftarTekaTeki[0];
  const petak = petakKosong(t.baris, t.kolom);
  return {
    game: 'susun_kubus',
    kelas: opsi.kelas,
    tingkat: opsi.tingkat,
    daftarTekaTeki,
    indeks: 0,
    petak,
    riwayat: [],
    fase: 'menyusun',
    salah: 0,
    petunjuk: null,
    pantul: null,
    belumCocok: bagianBelumCocok(petak, t.target),
    pesan: pesanAwal(t),
    kejutan: null,
    benihAcak: acak.keadaan,
    perkiraanDetik: detikAmati(t),
    catatan: { tekaTekiSelesai: 0, kubusDitaruh: 0, petunjuk: 0 },
  };
}

export function tekaTekiSekarang(k: KeadaanSusunKubus): TekaTeki {
  return k.daftarTekaTeki[Math.min(k.indeks, k.daftarTekaTeki.length - 1)];
}

export function selesai(k: KeadaanSusunKubus): boolean {
  return k.fase === 'selesai';
}

/** Kalimat petunjuk Pinci: menunjuk satu bagian yang masih kurang. */
export function kalimatPetunjuk(petak: Petak, t: TekaTeki): string {
  const batas = batasTinggi(t);
  const bc = bagianBelumCocok(petak, t.target);
  if (bc.kolomDepan.length > 0) {
    const k = bc.kolomDepan[0];
    return `Lihat kartu tampak depan. Kolom ke-${k + 1} dari kiri perlu ${t.target.depan[k]} kubus tingginya.`;
  }
  if (bc.barisSamping.length > 0) {
    const b = bc.barisSamping[0];
    return `Lihat kartu tampak samping. Baris ke-${t.baris - b} dari depan masih kurang tinggi.`;
  }
  if (bc.petakAtas.length > 0) {
    const [b, k] = bc.petakAtas[0];
    return `Lihat kartu tampak atas. Petak baris ke-${t.baris - b} dari depan, kolom ke-${k + 1} perlu kubus.`;
  }
  const penuh = petak.every((barisP, b) => barisP.every((x, k) => x >= batas[b][k]));
  return penuh ? 'Sudah cocok!' : 'Garis putus-putus menunjukkan yang belum cocok.';
}

function akhiriLangkah(k: KeadaanSusunKubus, acak: PembangkitAcak, detik: number): KeadaanSusunKubus {
  return { ...k, kejutan: pilihKejutan(acak, k.kejutan), benihAcak: acak.keadaan, perkiraanDetik: k.perkiraanDetik + detik };
}

function setelahUbah(k: KeadaanSusunKubus, petak: Petak, riwayat: KeadaanSusunKubus['riwayat']): KeadaanSusunKubus {
  const t = tekaTekiSekarang(k);
  const jadi = cocok(petak, t.target);
  return {
    ...k,
    petak,
    riwayat,
    pantul: null,
    belumCocok: bagianBelumCocok(petak, t.target),
    fase: jadi ? 'cocok' : 'menyusun',
    salah: jadi ? 0 : k.salah,
    petunjuk: jadi ? null : k.petunjuk === null ? null : kalimatPetunjuk(petak, t),
    pesan: jadi ? 'Cocok! Persis seperti kartu.' : k.pesan,
    catatan: jadi ? { ...k.catatan, tekaTekiSelesai: k.catatan.tekaTekiSelesai + 1 } : k.catatan,
  };
}

export function langkah(k: KeadaanSusunKubus, aksi: AksiSusunKubus): KeadaanSusunKubus {
  if (!aksiSahKah(k, aksi)) return k;
  const acak = buatAcak(k.benihAcak);
  const t = tekaTekiSekarang(k);
  switch (aksi.jenis) {
    case 'tambah': {
      const { baris, kolom } = aksi;
      const batas = batasTinggi(t)[baris][kolom];
      if (k.petak[baris][kolom] + 1 > batas) {
        const salah = k.salah + 1;
        const muncul = salah >= BATAS_SALAH_PETUNJUK;
        const hasil: KeadaanSusunKubus = {
          ...k,
          salah,
          pantul: [baris, kolom],
          petunjuk: muncul ? kalimatPetunjuk(k.petak, t) : k.petunjuk,
          pesan: batas === 0 ? 'Petak itu kosong di kartu. Coba petak lain, ya.' : 'Di situ sudah cukup tinggi. Coba petak lain, ya.',
          catatan: muncul && k.petunjuk === null ? { ...k.catatan, petunjuk: k.catatan.petunjuk + 1 } : k.catatan,
        };
        return akhiriLangkah(hasil, acak, DETIK_SUSUN_KUBUS.tambah + DETIK_SUSUN_KUBUS.pantul);
      }
      const petak = k.petak.map((b, i) => (i === baris ? b.map((x, j) => (j === kolom ? x + 1 : x)) : b));
      const hasil = setelahUbah(
        { ...k, catatan: { ...k.catatan, kubusDitaruh: k.catatan.kubusDitaruh + 1 } },
        petak,
        [...k.riwayat, [baris, kolom] as const],
      );
      return akhiriLangkah(hasil, acak, DETIK_SUSUN_KUBUS.tambah);
    }
    case 'urung': {
      const terakhir = k.riwayat[k.riwayat.length - 1];
      const [baris, kolom] = terakhir;
      const petak = k.petak.map((b, i) => (i === baris ? b.map((x, j) => (j === kolom ? Math.max(0, x - 1) : x)) : b));
      return akhiriLangkah(setelahUbah(k, petak, k.riwayat.slice(0, -1)), acak, DETIK_SUSUN_KUBUS.urung);
    }
    case 'lanjut': {
      const indeks = k.indeks + 1;
      if (indeks >= k.daftarTekaTeki.length) {
        return akhiriLangkah({ ...k, fase: 'selesai', pantul: null, pesan: 'Semua bangunan jadi. Hore!' }, acak, 0);
      }
      const baru = k.daftarTekaTeki[indeks];
      const petak = petakKosong(baru.baris, baru.kolom);
      const hasil: KeadaanSusunKubus = {
        ...k,
        indeks,
        petak,
        riwayat: [],
        fase: 'menyusun',
        salah: 0,
        petunjuk: null,
        pantul: null,
        belumCocok: bagianBelumCocok(petak, baru.target),
        pesan: pesanAwal(baru),
      };
      return akhiriLangkah(hasil, acak, DETIK_SUSUN_KUBUS.lanjut + detikAmati(baru));
    }
  }
}

function aksiSahKah(k: KeadaanSusunKubus, aksi: AksiSusunKubus): boolean {
  switch (aksi.jenis) {
    case 'tambah': {
      const t = tekaTekiSekarang(k);
      return (
        k.fase === 'menyusun' &&
        Number.isInteger(aksi.baris) &&
        Number.isInteger(aksi.kolom) &&
        aksi.baris >= 0 &&
        aksi.baris < t.baris &&
        aksi.kolom >= 0 &&
        aksi.kolom < t.kolom
      );
    }
    case 'urung':
      return k.fase === 'menyusun' && k.riwayat.length > 0;
    case 'lanjut':
      return k.fase === 'cocok';
  }
}

export function aksiSah(k: KeadaanSusunKubus): AksiSusunKubus[] {
  const t = tekaTekiSekarang(k);
  const semua: AksiSusunKubus[] = [];
  for (let b = 0; b < t.baris; b++) for (let kol = 0; kol < t.kolom; kol++) semua.push({ jenis: 'tambah', baris: b, kolom: kol });
  semua.push({ jenis: 'urung' }, { jenis: 'lanjut' });
  return semua.filter((a) => aksiSahKah(k, a));
}

/** Petak yang masih bisa menerima kubus tanpa memantul (tidak pernah kosong saat belum cocok). */
export function petakBisaDitambah(k: KeadaanSusunKubus): [number, number][] {
  const batas = batasTinggi(tekaTekiSekarang(k));
  const hasil: [number, number][] = [];
  k.petak.forEach((b, i) => b.forEach((x, j) => {
    if (x < batas[i][j]) hasil.push([i, j]);
  }));
  return hasil;
}

export function ringkasan(k: KeadaanSusunKubus): RingkasanBabak {
  const hal = [`Menyusun ${k.catatan.tekaTekiSelesai} bangunan kubus`, `Menaruh ${k.catatan.kubusDitaruh} kubus`];
  return buatRingkasan('susun_kubus', k.kelas, k.tingkat, hal, 'Bangunanmu rapi sekali.');
}
