/**
 * Logika Ular Tangga Lurus 1–100 (G04). TypeScript murni, tanpa React.
 *
 * - Papan 10 × 10, angka berurutan kiri → kanan di SETIAP baris (bukan zig-zag):
 *   petak n ada di baris floor((n−1)/10), kolom (n−1) % 10, baris 0 di bawah.
 * - Hanya sulur ramah yang membawa NAIK (seperti desain G04). Tidak ada ular dan tidak ada
 *   petak turun: desain tidak punya, dan turun terasa seperti hukuman.
 * - Anak melawan Pinci, giliran bergantian. Pinci main otomatis lewat aksi `giliran_pinci`
 *   (tampilan memicunya setelah gerak bidak anak selesai).
 * - Santai: ketuk dadu → maju. Seru: ketuk dadu → jawab satu soal singkat (3 pilihan) → maju.
 *   Keputusan: pilihan yang belum tepat memantul dan meredup; setelah 2 kali, Pinci memberi
 *   petunjuk dan tinggal satu pilihan (yang benar). Jadi anak selalu tetap melangkah, tanpa hukuman.
 * - Babak selesai saat salah satu sampai 100 (lewat 100 dihitung 100) atau batas putaran
 *   tercapai (supaya babak 2–4 menit). Anak tidak pernah "kalah".
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

export const PETAK_AKHIR = 100;

export type PetaSulur = Readonly<Record<number, number>>;

/**
 * Sulur ramah: petak bawah → petak atas. Hanya naik.
 * Seru memakai keempat sulur desain G04 ditambah lima sulur lagi, sebab giliran Seru lebih lama
 * (ada soal) dan anak tetap perlu peluang sampai 100 dalam 4 menit. Santai memakai sulur
 * yang lebih pendek supaya babak tidak selesai terlalu cepat (< 2 menit).
 */
export const SULUR_SANTAI: PetaSulur = { 4: 14, 21: 38, 33: 47, 52: 69, 66: 79, 78: 92 };
export const SULUR_SERU: PetaSulur = { 3: 22, 8: 30, 17: 56, 28: 44, 45: 84, 50: 67, 62: 91, 71: 88, 79: 95 };

export function sulurUntuk(tingkat: Tingkat): PetaSulur {
  return tingkat === 'seru' ? SULUR_SERU : SULUR_SANTAI;
}

export interface OpsiBabakUlarTangga extends OpsiBabakDasar {
  /** Nama anak untuk kalimat di layar. Bawaan "Kamu". */
  namaAnak?: string;
}

export type Pemain = 'anak' | 'pinci';

export interface SoalSingkat {
  id: string;
  teks: string;
  pilihan: readonly number[];
  jawaban: number;
  /** Kalimat petunjuk Pinci (muncul setelah 2 kali belum tepat). */
  petunjuk: string;
}

/** lempar (giliran anak) → soal (Seru) → giliran_pinci → lempar … → selesai. */
export type FaseUlarTangga = 'lempar' | 'soal' | 'giliran_pinci' | 'selesai';

export interface GerakTerakhir {
  siapa: Pemain;
  dadu: number;
  dari: number;
  /** Petak setelah maju dadu (sebelum sulur). */
  sampai: number;
  /** Petak akhir (setelah sulur bila ada). */
  ke: number;
  naikSulur: boolean;
}

export interface KeadaanUlarTangga {
  game: 'ular_tangga';
  kelas: Kelas;
  tingkat: Tingkat;
  namaAnak: string;
  /** Sulur di papan (untuk digambar). */
  sulur: PetaSulur;
  posisi: Readonly<Record<Pemain, number>>;
  fase: FaseUlarTangga;
  /** Angka dadu terakhir (1–6), untuk wajah dadu. */
  dadu: number;
  soal: SoalSingkat | null;
  /** Pilihan soal yang sudah dicoba dan belum tepat (redup). */
  pilihanDicoba: readonly number[];
  salah: number;
  petunjuk: string | null;
  pantul: number | null;
  gerakTerakhir: GerakTerakhir | null;
  pesan: string;
  /** Banyak giliran anak yang sudah dimainkan. */
  putaran: number;
  batasPutaran: number;
  /** Yang sampai 100 lebih dulu; `null` bila babak berakhir karena batas putaran. */
  pemenang: Pemain | null;
  idSoalTerpakai: readonly string[];
  kejutan: Kejutan | null;
  benihAcak: number;
  perkiraanDetik: number;
  catatan: { soalTerjawab: number; sulurAnak: number; petunjuk: number };
}

export type AksiUlarTangga =
  | { jenis: 'lempar_dadu' }
  | { jenis: 'jawab'; pilihan: number }
  | { jenis: 'giliran_pinci' };

/** Perkiraan detik per aksi (lempar + bidak melompat per petak + membaca pesan). */
export const DETIK_ULAR_TANGGA = {
  lemparAnak: 3,
  giliranPinci: 3,
  perPetak: 0.4,
  naikSulur: 1.5,
  bacaSoal: 5,
  jawab: 2.5,
  pantul: 1,
} as const;

/** Batas putaran anak per babak (menjaga babak ≤ 4 menit). */
export function batasPutaranUntuk(tingkat: Tingkat): number {
  return tingkat === 'seru' ? 13 : 26;
}

export function koordinatPetak(n: number): { baris: number; kolom: number } {
  return { baris: Math.floor((n - 1) / 10), kolom: (n - 1) % 10 };
}

export function buatBabak(opsi: OpsiBabakUlarTangga): KeadaanUlarTangga {
  const acak = buatAcak(opsi.benih);
  const namaAnak = opsi.namaAnak ?? 'Kamu';
  return {
    game: 'ular_tangga',
    kelas: opsi.kelas,
    tingkat: opsi.tingkat,
    namaAnak,
    sulur: sulurUntuk(opsi.tingkat),
    posisi: { anak: 1, pinci: 1 },
    fase: 'lempar',
    dadu: 5,
    soal: null,
    pilihanDicoba: [],
    salah: 0,
    petunjuk: null,
    pantul: null,
    gerakTerakhir: null,
    pesan: 'Sulur hijau itu jalan pintas. Ayo mulai!',
    putaran: 0,
    batasPutaran: batasPutaranUntuk(opsi.tingkat),
    pemenang: null,
    idSoalTerpakai: [],
    kejutan: null,
    benihAcak: acak.keadaan,
    perkiraanDetik: 4,
    catatan: { soalTerjawab: 0, sulurAnak: 0, petunjuk: 0 },
  };
}

export function selesai(k: KeadaanUlarTangga): boolean {
  return k.fase === 'selesai';
}

// ---------- Soal singkat (tingkat Seru) ----------

function pengecoh(acak: PembangkitAcak, jawaban: number, langkahBesar: boolean): number[] {
  const geser = langkahBesar ? [-10, -2, -1, 1, 2, 10] : [-2, -1, 1, 2];
  const calon = Array.from(new Set(geser.map((g) => jawaban + g).filter((n) => n >= 0 && n !== jawaban)));
  return acak.ambilBeberapa(calon, 2);
}

function rakitSoal(acak: PembangkitAcak, id: string, teks: string, jawaban: number, petunjuk: string, besar: boolean): SoalSingkat {
  const pilihan = acak.acakUrutan([jawaban, ...pengecoh(acak, jawaban, besar)]);
  return { id, teks, pilihan, jawaban, petunjuk };
}

/** Soal sesuai kelas. Kunci dihitung kode. */
export function buatSoal(acak: PembangkitAcak, kelas: Kelas, posisiAnak: number, dadu: number): SoalSingkat {
  const kelompok = kelompokKelas(kelas);
  if (kelompok === 'awal') {
    // Kelas 1–2: hitung maju dari petak sendiri.
    const a = posisiAnak + dadu <= PETAK_AKHIR ? posisiAnak : acak.bulat(1, 20);
    const b = dadu;
    const deret = Array.from({ length: b }, (_, i) => a + i + 1).join(', ');
    return rakitSoal(acak, `tambah-${a}-${b}`, `${a} + ${b} = …`, a + b, `Hitung maju dari ${a}: ${deret}.`, false);
  }
  if (kelompok === 'tengah') {
    const a = acak.bulat(2, 9);
    const b = acak.bulat(2, 10);
    const ulang = Array.from({ length: Math.min(a, b) }, () => Math.max(a, b)).join(' + ');
    return rakitSoal(acak, `kali-${a}-${b}`, `${a} × ${b} = …`, a * b, `${a} × ${b} sama dengan ${ulang}.`, true);
  }
  const jenis = acak.bulat(0, 4);
  if (jenis === 0) {
    const a = acak.bulat(11, 15);
    const b = acak.bulat(2, 9);
    return rakitSoal(acak, `kali-${a}-${b}`, `${a} × ${b} = …`, a * b, `Pecah dulu: 10 × ${b} lalu tambah ${a - 10} × ${b}.`, true);
  }
  if (jenis === 1) {
    const n = acak.bulat(5, 50) * 2;
    return rakitSoal(acak, `setengah-${n}`, `Setengah dari ${n} = …`, n / 2, `Setengah berarti dibagi 2. ${n} : 2.`, true);
  }
  if (jenis === 2) {
    const n = acak.bulat(2, 20) * 10;
    return rakitSoal(acak, `persen10-${n}`, `10% dari ${n} = …`, n / 10, `10% berarti dibagi 10. ${n} : 10.`, true);
  }
  if (jenis === 3) {
    const n = acak.bulat(2, 25) * 4;
    return rakitSoal(acak, `persen25-${n}`, `25% dari ${n} = …`, n / 4, `25% sama dengan seperempat. ${n} : 4.`, true);
  }
  const n = acak.bulat(2, 12);
  return rakitSoal(acak, `kuadrat-${n}`, `${n}² = …`, n * n, `${n}² berarti ${n} × ${n}.`, true);
}

function soalBaru(acak: PembangkitAcak, k: KeadaanUlarTangga, dadu: number): SoalSingkat {
  let soal = buatSoal(acak, k.kelas, k.posisi.anak, dadu);
  for (let coba = 0; coba < 200 && k.idSoalTerpakai.includes(soal.id); coba++) {
    soal = buatSoal(acak, k.kelas, acak.bulat(1, 90), dadu);
  }
  return soal;
}

// ---------- Gerak ----------

function gerak(sulur: PetaSulur, siapa: Pemain, dari: number, dadu: number): GerakTerakhir {
  const sampai = Math.min(PETAK_AKHIR, dari + dadu);
  const atas = sulur[sampai];
  return { siapa, dadu, dari, sampai, ke: atas ?? sampai, naikSulur: atas !== undefined };
}

function nama(k: KeadaanUlarTangga, siapa: Pemain): string {
  return siapa === 'anak' ? k.namaAnak : 'Pinci';
}

function kalimatGerak(k: KeadaanUlarTangga, g: GerakTerakhir): string {
  const n = nama(k, g.siapa);
  if (g.naikSulur) return `${n} naik sulur dari ${g.sampai} ke ${g.ke}!`;
  return `${n} maju ${g.dadu} ke ${g.ke}.`;
}

function detikGerak(g: GerakTerakhir): number {
  return (g.sampai - g.dari) * DETIK_ULAR_TANGGA.perPetak + (g.naikSulur ? DETIK_ULAR_TANGGA.naikSulur : 0);
}

/** Menerapkan gerak lalu memeriksa akhir babak. */
function terapkanGerak(k: KeadaanUlarTangga, g: GerakTerakhir): KeadaanUlarTangga {
  const posisi = { ...k.posisi, [g.siapa]: g.ke };
  const putaran = g.siapa === 'anak' ? k.putaran + 1 : k.putaran;
  const catatan = g.siapa === 'anak' && g.naikSulur ? { ...k.catatan, sulurAnak: k.catatan.sulurAnak + 1 } : k.catatan;
  const dasar: KeadaanUlarTangga = {
    ...k,
    posisi,
    putaran,
    catatan,
    gerakTerakhir: g,
    soal: null,
    pilihanDicoba: [],
    salah: 0,
    petunjuk: null,
    pantul: null,
    pesan: kalimatGerak(k, g),
  };
  if (g.ke >= PETAK_AKHIR) {
    return { ...dasar, fase: 'selesai', pemenang: g.siapa, pesan: `${nama(k, g.siapa)} sampai di 100!` };
  }
  // Batas putaran dicek setelah Pinci main, supaya giliran keduanya sama banyak.
  if (g.siapa === 'pinci' && putaran >= k.batasPutaran) {
    return { ...dasar, fase: 'selesai', pemenang: null };
  }
  return { ...dasar, fase: g.siapa === 'anak' ? 'giliran_pinci' : 'lempar' };
}

function akhiriLangkah(k: KeadaanUlarTangga, acak: PembangkitAcak, detik: number): KeadaanUlarTangga {
  return { ...k, kejutan: pilihKejutan(acak, k.kejutan), benihAcak: acak.keadaan, perkiraanDetik: k.perkiraanDetik + detik };
}

export function langkah(k: KeadaanUlarTangga, aksi: AksiUlarTangga): KeadaanUlarTangga {
  if (!aksiSahKah(k, aksi)) return k;
  const acak = buatAcak(k.benihAcak);
  switch (aksi.jenis) {
    case 'lempar_dadu': {
      const dadu = acak.bulat(1, 6);
      if (k.tingkat === 'seru') {
        const soal = soalBaru(acak, k, dadu);
        const hasil: KeadaanUlarTangga = {
          ...k,
          dadu,
          fase: 'soal',
          soal,
          pilihanDicoba: [],
          salah: 0,
          petunjuk: null,
          pantul: null,
          idSoalTerpakai: [...k.idSoalTerpakai, soal.id],
          pesan: `Dadu ${dadu}. Jawab dulu, lalu maju!`,
        };
        return akhiriLangkah(hasil, acak, DETIK_ULAR_TANGGA.lemparAnak + DETIK_ULAR_TANGGA.bacaSoal);
      }
      const g = gerak(k.sulur, 'anak', k.posisi.anak, dadu);
      return akhiriLangkah(terapkanGerak({ ...k, dadu }, g), acak, DETIK_ULAR_TANGGA.lemparAnak + detikGerak(g));
    }
    case 'jawab': {
      const soal = k.soal;
      if (soal === null) return k;
      if (aksi.pilihan === soal.jawaban) {
        const g = gerak(k.sulur, 'anak', k.posisi.anak, k.dadu);
        const dijawab = { ...k, catatan: { ...k.catatan, soalTerjawab: k.catatan.soalTerjawab + 1 } };
        return akhiriLangkah(terapkanGerak(dijawab, g), acak, DETIK_ULAR_TANGGA.jawab + detikGerak(g));
      }
      const salah = k.salah + 1;
      const munculPetunjuk = salah >= BATAS_SALAH_PETUNJUK;
      const hasil: KeadaanUlarTangga = {
        ...k,
        salah,
        pantul: aksi.pilihan,
        pilihanDicoba: [...k.pilihanDicoba, aksi.pilihan],
        petunjuk: munculPetunjuk ? soal.petunjuk : k.petunjuk,
        pesan: 'Hmm, belum tepat. Coba lagi, ya.',
        catatan:
          munculPetunjuk && k.petunjuk === null ? { ...k.catatan, petunjuk: k.catatan.petunjuk + 1 } : k.catatan,
      };
      return akhiriLangkah(hasil, acak, DETIK_ULAR_TANGGA.jawab + DETIK_ULAR_TANGGA.pantul);
    }
    case 'giliran_pinci': {
      const dadu = acak.bulat(1, 6);
      const g = gerak(k.sulur, 'pinci', k.posisi.pinci, dadu);
      return akhiriLangkah(terapkanGerak({ ...k, dadu }, g), acak, DETIK_ULAR_TANGGA.giliranPinci + detikGerak(g));
    }
  }
}

function aksiSahKah(k: KeadaanUlarTangga, aksi: AksiUlarTangga): boolean {
  switch (aksi.jenis) {
    case 'lempar_dadu':
      return k.fase === 'lempar';
    case 'jawab':
      return k.fase === 'soal' && k.soal !== null && k.soal.pilihan.includes(aksi.pilihan) && !k.pilihanDicoba.includes(aksi.pilihan);
    case 'giliran_pinci':
      return k.fase === 'giliran_pinci';
  }
}

export function aksiSah(k: KeadaanUlarTangga): AksiUlarTangga[] {
  const semua: AksiUlarTangga[] = [
    { jenis: 'lempar_dadu' },
    ...(k.soal ? k.soal.pilihan.map((pilihan): AksiUlarTangga => ({ jenis: 'jawab', pilihan })) : []),
    { jenis: 'giliran_pinci' },
  ];
  return semua.filter((a) => aksiSahKah(k, a));
}

export function ringkasan(k: KeadaanUlarTangga): RingkasanBabak {
  const hal = [`Melempar dadu ${k.putaran} kali`, `Sampai di petak ${k.posisi.anak}`];
  if (k.catatan.soalTerjawab > 0) hal.push(`Menjawab ${k.catatan.soalTerjawab} soal`);
  if (k.catatan.sulurAnak > 0) hal.push(`Naik sulur ${k.catatan.sulurAnak} kali`);
  let kalimat: string;
  if (k.pemenang === 'anak') {
    kalimat = `${k.namaAnak === 'Kamu' ? 'Kamu' : k.namaAnak} sampai di 100 duluan. Hebat!`;
  } else if (k.pemenang === 'pinci') {
    kalimat = `Pinci sampai duluan kali ini. Kamu sudah sampai petak ${k.posisi.anak}, hebat! Ayo main lagi.`;
  } else {
    kalimat = `Kamu sampai petak ${k.posisi.anak}, Pinci petak ${k.posisi.pinci}. Seru sekali, kita lanjut lain kali!`;
  }
  return buatRingkasan('ular_tangga', k.kelas, k.tingkat, hal, kalimat);
}
