/**
 * Logika Tebak Kata (G06). TypeScript murni, tanpa React.
 *
 * Gambar (emoji) + suara 🔊, anak mengetuk potongan kata ke kotak secara berurutan.
 * - Kelas 1–2: susun kata dari suku kata (Santai 2 suku kata, Seru 3 suku kata).
 * - Kelas 3–4: susun kata berimbuhan dari imbuhan + bentuk dasar (mis. "me" + "nulis").
 * - Kelas 5–6: pilih kata baku (Santai 2 pilihan, Seru 3 pilihan), atau — bila daftar kata
 *   Inggris diberikan lewat `kataInggris` — pilih kata Inggris yang sesuai gambar.
 * Pilihan yang belum tepat memantul. Setelah 2 kali, Pinci memberi petunjuk dan potongan yang
 * benar disorot. Pilihan tidak diredupkan (seperti desain G06); potongan yang benar selalu
 * ada di pilihan, jadi tidak pernah buntu.
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
import { BANK_KELAS_12, BANK_KELAS_34, BANK_KELAS_56, type KataInggris, type KataPotong } from './bank';

export interface OpsiBabakTebakKata extends OpsiBabakDasar {
  /** Kelas 5–6: bila diisi (≥ 3 kata), babak memakai kosakata Inggris, bukan kata baku. */
  kataInggris?: readonly KataInggris[];
}

export type JenisSoalKata = 'suku_kata' | 'imbuhan' | 'baku' | 'inggris';

export interface SoalKata {
  id: string;
  jenis: JenisSoalKata;
  emoji: string;
  /** Teks yang dibacakan tombol 🔊. */
  ucapan: string;
  bahasaUcapan: 'id-ID' | 'en-US';
  /** Potongan jawaban berurutan (satu unsur untuk jenis baku/inggris). */
  jawaban: readonly string[];
  /** Pilihan di layar (paling banyak 4). */
  pilihan: readonly string[];
  /** Teks bantu kecil, mis. arti kata Inggris. */
  teksBantu: string | null;
  petunjuk: string;
}

/** menebak → benar (menunggu "lanjut") → … → selesai. */
export type FaseTebakKata = 'menebak' | 'benar' | 'selesai';

export interface KeadaanTebakKata {
  game: 'tebak_kata';
  kelas: Kelas;
  tingkat: Tingkat;
  jenis: JenisSoalKata;
  daftarSoal: readonly SoalKata[];
  indeks: number;
  /** Potongan yang sudah masuk kotak. */
  terisi: readonly string[];
  fase: FaseTebakKata;
  salah: number;
  petunjuk: string | null;
  /** Potongan yang disorot setelah petunjuk muncul. */
  sorotan: string | null;
  pantul: string | null;
  pesan: string;
  kejutan: Kejutan | null;
  benihAcak: number;
  perkiraanDetik: number;
  catatan: { kataSelesai: number; petunjuk: number };
}

export type AksiTebakKata = { jenis: 'pilih'; teks: string } | { jenis: 'lanjut' };

export const DETIK_TEBAK_KATA = {
  /** Melihat gambar dan mendengar suara. */
  amati: 4,
  /** Membaca pilihan kata utuh (baku/inggris), per pilihan. */
  bacaPilihan: 2,
  pilih: 2.5,
  pantul: 1.5,
  lanjut: 2,
} as const;

/** Banyak soal per babak. */
export function jumlahSoalUntuk(kelas: Kelas, tingkat: Tingkat): number {
  const kelompok = kelompokKelas(kelas);
  if (kelompok === 'awal') return tingkat === 'seru' ? 10 : 12;
  if (kelompok === 'tengah') return tingkat === 'seru' ? 12 : 13;
  return 12;
}

const VOKAL = ['a', 'i', 'u', 'e', 'o'] as const;

/** Pengecoh suku kata: ganti vokal pertama (mis. "ba" → "bu", "bi"). */
export function pengecohSukuKata(potongan: readonly string[]): string[] {
  const hasil = new Set<string>();
  for (const s of potongan) {
    const i = s.search(/[aiueo]/);
    if (i < 0) continue;
    for (const v of VOKAL) {
      const calon = s.slice(0, i) + v + s.slice(i + 1);
      if (!potongan.includes(calon)) hasil.add(calon);
    }
  }
  return Array.from(hasil);
}

/** Pengecoh imbuhan: bentuk imbuhan yang mirip tetapi keliru untuk kata itu. */
const PENGECOH_IMBUHAN: Readonly<Record<string, readonly string[]>> = {
  ber: ['be', 'per'],
  me: ['mem', 'meng'],
  mem: ['men', 'meng'],
  men: ['mem', 'meng'],
  meng: ['men', 'mem'],
  pe: ['per', 'pen'],
  pem: ['pen', 'peng'],
  pen: ['pem', 'peng'],
  per: ['pe', 'ber'],
  ke: ['ter', 'se'],
  an: ['i', 'in'],
};

export function pengecohImbuhan(potongan: readonly string[]): string[] {
  const awal = PENGECOH_IMBUHAN[potongan[0]];
  const akhir = PENGECOH_IMBUHAN[potongan[potongan.length - 1]];
  const calon = [...(awal ?? []), ...(awal ? [] : (akhir ?? []))];
  return calon.filter((c) => !potongan.includes(c));
}

function pilihanPotong(acak: PembangkitAcak, kata: KataPotong, jenis: 'suku_kata' | 'imbuhan'): string[] {
  const unik = Array.from(new Set(kata.potongan));
  const totalPilihan = kata.potongan.length === 2 ? 3 : 4;
  const butuh = Math.max(1, totalPilihan - unik.length);
  const calon = jenis === 'suku_kata' ? pengecohSukuKata(kata.potongan) : pengecohImbuhan(kata.potongan);
  return acak.acakUrutan([...unik, ...acak.ambilBeberapa(calon, butuh)]);
}

function soalPotong(acak: PembangkitAcak, kata: KataPotong, jenis: 'suku_kata' | 'imbuhan'): SoalKata {
  const utuh = kata.potongan.join('');
  return {
    id: kata.id,
    jenis,
    emoji: kata.emoji,
    ucapan: utuh,
    bahasaUcapan: 'id-ID',
    jawaban: kata.potongan,
    pilihan: pilihanPotong(acak, kata, jenis),
    teksBantu: null,
    petunjuk: `Dengar pelan-pelan: ${kata.potongan.join('… ')}… ${utuh.charAt(0).toUpperCase()}${utuh.slice(1)}!`,
  };
}

function buatDaftarSoal(acak: PembangkitAcak, opsi: OpsiBabakTebakKata): { jenis: JenisSoalKata; soal: SoalKata[] } {
  const kelompok = kelompokKelas(opsi.kelas);
  const n = jumlahSoalUntuk(opsi.kelas, opsi.tingkat);
  if (kelompok === 'awal' || kelompok === 'tengah') {
    const jenis = kelompok === 'awal' ? 'suku_kata' : 'imbuhan';
    const bank = (kelompok === 'awal' ? BANK_KELAS_12 : BANK_KELAS_34).filter((k) => k.tingkat === opsi.tingkat);
    return { jenis, soal: acak.ambilBeberapa(bank, n).map((k) => soalPotong(acak, k, jenis)) };
  }
  const inggris = opsi.kataInggris ? unikInggris(opsi.kataInggris) : [];
  if (inggris.length >= 3) {
    const dipilih = acak.ambilBeberapa(inggris, Math.min(n, inggris.length));
    const soal = dipilih.map((k): SoalKata => {
      const lain = acak.ambilBeberapa(
        inggris.filter((x) => x.inggris !== k.inggris).map((x) => x.inggris),
        2,
      );
      return {
        id: `inggris-${k.inggris}`,
        jenis: 'inggris',
        emoji: k.emoji,
        ucapan: k.inggris,
        bahasaUcapan: 'en-US',
        jawaban: [k.inggris],
        pilihan: acak.acakUrutan([k.inggris, ...lain]),
        teksBantu: k.indonesia,
        petunjuk: `Dengar lagi baik-baik. Artinya ${k.indonesia}.`,
      };
    });
    return { jenis: 'inggris', soal };
  }
  const dipilih = acak.ambilBeberapa(BANK_KELAS_56, n);
  const soal = dipilih.map((k): SoalKata => {
    const salah = opsi.tingkat === 'seru' ? [k.tidakBaku[0], k.tidakBaku[1]] : [k.tidakBaku[0]];
    return {
      id: k.id,
      jenis: 'baku',
      emoji: k.emoji,
      ucapan: k.baku,
      bahasaUcapan: 'id-ID',
      jawaban: [k.baku],
      pilihan: acak.acakUrutan([k.baku, ...salah]),
      teksBantu: null,
      petunjuk: `Kata baku ditulis seperti di kamus. Dengar: ${k.baku}.`,
    };
  });
  return { jenis: 'baku', soal };
}

function unikInggris(daftar: readonly KataInggris[]): KataInggris[] {
  const lihat = new Set<string>();
  return daftar.filter((k) => {
    const kunci = k.inggris.trim().toLowerCase();
    if (kunci === '' || lihat.has(kunci)) return false;
    lihat.add(kunci);
    return true;
  });
}

function pesanAwal(s: SoalKata): string {
  if (s.jenis === 'baku') return 'Mana kata yang baku?';
  if (s.jenis === 'inggris') return 'Mana kata Inggrisnya?';
  return 'Dengar, lalu ketuk potongannya berurutan.';
}

function detikAmati(s: SoalKata): number {
  const satuKotak = s.jenis === 'baku' || s.jenis === 'inggris';
  return DETIK_TEBAK_KATA.amati + (satuKotak ? s.pilihan.length * DETIK_TEBAK_KATA.bacaPilihan : 0);
}

export function buatBabak(opsi: OpsiBabakTebakKata): KeadaanTebakKata {
  const acak = buatAcak(opsi.benih);
  const { jenis, soal } = buatDaftarSoal(acak, opsi);
  return {
    game: 'tebak_kata',
    kelas: opsi.kelas,
    tingkat: opsi.tingkat,
    jenis,
    daftarSoal: soal,
    indeks: 0,
    terisi: [],
    fase: 'menebak',
    salah: 0,
    petunjuk: null,
    sorotan: null,
    pantul: null,
    pesan: pesanAwal(soal[0]),
    kejutan: null,
    benihAcak: acak.keadaan,
    perkiraanDetik: detikAmati(soal[0]),
    catatan: { kataSelesai: 0, petunjuk: 0 },
  };
}

export function soalSekarang(k: KeadaanTebakKata): SoalKata {
  return k.daftarSoal[Math.min(k.indeks, k.daftarSoal.length - 1)];
}

/** Potongan yang harus diketuk berikutnya. */
export function potonganBerikut(k: KeadaanTebakKata): string | null {
  const s = soalSekarang(k);
  return k.terisi.length < s.jawaban.length ? s.jawaban[k.terisi.length] : null;
}

export function selesai(k: KeadaanTebakKata): boolean {
  return k.fase === 'selesai';
}

function akhiriLangkah(k: KeadaanTebakKata, acak: PembangkitAcak, detik: number): KeadaanTebakKata {
  return { ...k, kejutan: pilihKejutan(acak, k.kejutan), benihAcak: acak.keadaan, perkiraanDetik: k.perkiraanDetik + detik };
}

export function langkah(k: KeadaanTebakKata, aksi: AksiTebakKata): KeadaanTebakKata {
  if (!aksiSahKah(k, aksi)) return k;
  const acak = buatAcak(k.benihAcak);
  const s = soalSekarang(k);
  if (aksi.jenis === 'pilih') {
    const harap = potonganBerikut(k);
    if (aksi.teks === harap) {
      const terisi = [...k.terisi, aksi.teks];
      const jadi = terisi.length === s.jawaban.length;
      const hasil: KeadaanTebakKata = {
        ...k,
        terisi,
        pantul: null,
        fase: jadi ? 'benar' : 'menebak',
        // Langkah berikutnya (kotak berikutnya) dimulai tanpa hitungan salah.
        salah: 0,
        petunjuk: null,
        sorotan: null,
            pesan: jadi ? `${s.ucapan.charAt(0).toUpperCase()}${s.ucapan.slice(1)}!` : k.pesan,
        catatan: jadi ? { ...k.catatan, kataSelesai: k.catatan.kataSelesai + 1 } : k.catatan,
      };
      return akhiriLangkah(hasil, acak, DETIK_TEBAK_KATA.pilih);
    }
    const salah = k.salah + 1;
    const muncul = salah >= BATAS_SALAH_PETUNJUK;
    const hasil: KeadaanTebakKata = {
      ...k,
      salah,
      pantul: aksi.teks,
      petunjuk: muncul ? s.petunjuk : k.petunjuk,
      sorotan: muncul ? harap : k.sorotan,
      pesan: 'Hmm, belum tepat. Coba lagi, ya.',
      catatan: muncul && k.petunjuk === null ? { ...k.catatan, petunjuk: k.catatan.petunjuk + 1 } : k.catatan,
    };
    return akhiriLangkah(hasil, acak, DETIK_TEBAK_KATA.pilih + DETIK_TEBAK_KATA.pantul);
  }
  const indeks = k.indeks + 1;
  if (indeks >= k.daftarSoal.length) {
    return akhiriLangkah({ ...k, fase: 'selesai', pantul: null, pesan: 'Semua kata sudah tertebak. Hore!' }, acak, 0);
  }
  const baru = k.daftarSoal[indeks];
  const hasil: KeadaanTebakKata = {
    ...k,
    indeks,
    terisi: [],
    fase: 'menebak',
    salah: 0,
    petunjuk: null,
    sorotan: null,
    pantul: null,
    pesan: pesanAwal(baru),
  };
  return akhiriLangkah(hasil, acak, DETIK_TEBAK_KATA.lanjut + detikAmati(baru));
}

function aksiSahKah(k: KeadaanTebakKata, aksi: AksiTebakKata): boolean {
  if (aksi.jenis === 'lanjut') return k.fase === 'benar';
  if (k.fase !== 'menebak') return false;
  const s = soalSekarang(k);
  return s.pilihan.includes(aksi.teks);
}

export function aksiSah(k: KeadaanTebakKata): AksiTebakKata[] {
  const s = soalSekarang(k);
  const semua: AksiTebakKata[] = [...s.pilihan.map((teks): AksiTebakKata => ({ jenis: 'pilih', teks })), { jenis: 'lanjut' }];
  return semua.filter((a) => aksiSahKah(k, a));
}

export function ringkasan(k: KeadaanTebakKata): RingkasanBabak {
  const n = k.catatan.kataSelesai;
  const hal: string[] = [];
  if (k.jenis === 'suku_kata') hal.push(`Menyusun ${n} kata dari suku kata`);
  else if (k.jenis === 'imbuhan') hal.push(`Menyusun ${n} kata berimbuhan`);
  else if (k.jenis === 'baku') hal.push(`Menemukan ${n} kata baku`);
  else hal.push(`Menebak ${n} kata Inggris`);
  return buatRingkasan('tebak_kata', k.kelas, k.tingkat, hal, 'Pintar itu seru!');
}
