/**
 * Logika Pasar Gampong (G03). TypeScript murni, tanpa React.
 *
 * Anak melayani beberapa pembeli. Setiap pembeli menyebut pesanan; anak mengetuk uang
 * (bergaya sederhana, logika hanya memakai nilai) sampai cukup, lalu "Berikan".
 * - Bayar kurang → nampan memantul, uang tetap di nampan, anak tinggal menambah.
 * - Kelas 1–2 Seru: harus pas (seperti desain G03): uang yang membuat total lewat harga memantul.
 * - Tingkat Santai: bayar lebih diterima, kembalian dihitung Pinci.
 * - Kelas 3–6 Seru: bayar lebih → anak memilih kembalian dari 3 pilihan.
 * - Setelah 2 kali belum tepat pada langkah yang sama, `petunjuk` berisi kalimat Pinci.
 */
import { buatAcak, type PembangkitAcak } from '../bersama/acak';
import {
  BATAS_SALAH_PETUNJUK,
  formatAngka,
  formatRupiah,
  kelompokKelas,
  type Kelas,
  type OpsiBabakDasar,
  type Tingkat,
} from '../bersama/jenis';
import { pilihKejutan, type Kejutan } from '../bersama/kejutan';
import { buatRingkasan, type RingkasanBabak } from '../bersama/ringkasan';
import { DAFTAR_BARANG, DAFTAR_PEMBELI, type Barang, type Pembeli } from './barang';

export type NilaiUang = 500 | 1000 | 2000 | 5000 | 10000 | 20000 | 50000;
export const SEMUA_UANG: readonly NilaiUang[] = [500, 1000, 2000, 5000, 10000, 20000, 50000];

export type OpsiBabakPasar = OpsiBabakDasar;

export interface BarisPesanan {
  barangId: string;
  nama: string;
  emoji: string;
  satuan: string;
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface Pesanan {
  id: string;
  pembeli: Pembeli;
  baris: readonly BarisPesanan[];
  /** 0 bila tanpa diskon. */
  diskonPersen: number;
  hargaSebelumDiskon: number;
  potongan: number;
  /** Yang harus dibayar (dihitung kode). Selalu kelipatan 500. */
  harga: number;
  /** `false` di kelas 5–6 Seru: anak menghitung sendiri harga setelah diskon. */
  tampilkanHarga: boolean;
  /** Kalimat pembeli, mis. "Aku mau 2 pisang, ya." */
  kalimat: string;
}

export type AturanBayar = 'harus_pas' | 'boleh_lebih';

/** bayar → (kembalian) → terima (pesanan beres, menunggu "lanjut") → … → selesai. */
export type FasePasar = 'bayar' | 'kembalian' | 'terima' | 'selesai';

export type PantulPasar =
  | { jenis: 'uang'; nilai: NilaiUang }
  | { jenis: 'nampan' }
  | { jenis: 'kembalian'; nilai: number };

export interface KeadaanPasar {
  game: 'pasar';
  kelas: Kelas;
  tingkat: Tingkat;
  daftarPesanan: readonly Pesanan[];
  /** Indeks pesanan yang sedang dilayani. */
  indeks: number;
  /** Uang yang bisa diketuk di layar. */
  uangTersedia: readonly NilaiUang[];
  aturanBayar: AturanBayar;
  /** Kelas 3–6 Seru: anak memilih kembalian. */
  anakPilihKembalian: boolean;
  nampan: readonly NilaiUang[];
  total: number;
  fase: FasePasar;
  /** Tiga pilihan kembalian (urut naik) saat fase `kembalian`. */
  pilihanKembalian: readonly number[];
  /** Pilihan kembalian yang sudah dicoba dan belum tepat (redup, tidak bisa diketuk lagi). */
  kembalianDicoba: readonly number[];
  /** Kembalian pesanan yang baru beres (0 bila pas). */
  kembalian: number;
  kembalianOlehPinci: boolean;
  /** Banyak "belum tepat" pada langkah ini. */
  salah: number;
  petunjuk: string | null;
  pantul: PantulPasar | null;
  /** Kalimat pendek Pinci/pembeli untuk layar. */
  pesan: string;
  kejutan: Kejutan | null;
  benihAcak: number;
  /** Perkiraan lama main sejauh ini (detik), untuk uji panjang babak. */
  perkiraanDetik: number;
  catatan: {
    pesananSelesai: number;
    bayarPas: number;
    kembalianAnak: number;
    kembalianPinci: number;
    petunjuk: number;
  };
}

export type AksiPasar =
  | { jenis: 'ketuk_uang'; nilai: NilaiUang }
  | { jenis: 'ambil_lagi' }
  | { jenis: 'serahkan' }
  | { jenis: 'pilih_kembalian'; nilai: number }
  | { jenis: 'lanjut' };

interface AturanTingkat {
  jumlahPesanan: number;
  barisMin: number;
  barisMaks: number;
  jumlahMaks: number;
  hargaMaks: number;
  diskon: readonly number[];
  uang: readonly NilaiUang[];
  aturanBayar: AturanBayar;
  anakPilihKembalian: boolean;
  tampilkanHarga: boolean;
  /** Detik membaca/mendengar pesanan. */
  detikBaca: number;
}

/** Perkiraan detik per aksi (anak SD, termasuk gerak dan bunyi). */
export const DETIK_PASAR = {
  ketukUang: 3,
  ambilLagi: 2,
  serahkan: 2.5,
  pilihKembalian: 5,
  lanjut: 2.5,
  pantul: 1.5,
} as const;

function aturanUntuk(kelas: Kelas, tingkat: Tingkat): AturanTingkat {
  const kelompok = kelompokKelas(kelas);
  const seru = tingkat === 'seru';
  if (kelompok === 'awal') {
    return {
      jumlahPesanan: seru ? 7 : 8,
      barisMin: 1,
      barisMaks: 1,
      jumlahMaks: seru ? 3 : 2,
      hargaMaks: seru ? 10000 : 5000,
      diskon: [0],
      uang: seru ? [500, 1000, 2000, 5000, 10000] : [500, 1000, 2000, 5000],
      aturanBayar: seru ? 'harus_pas' : 'boleh_lebih',
      anakPilihKembalian: false,
      tampilkanHarga: true,
      detikBaca: 8,
    };
  }
  if (kelompok === 'tengah') {
    return {
      jumlahPesanan: 7,
      barisMin: 1,
      barisMaks: 1,
      jumlahMaks: seru ? 5 : 4,
      hargaMaks: seru ? 50000 : 25000,
      diskon: [0],
      uang: seru ? SEMUA_UANG : [500, 1000, 2000, 5000, 10000, 20000],
      aturanBayar: 'boleh_lebih',
      anakPilihKembalian: seru,
      tampilkanHarga: true,
      detikBaca: 9,
    };
  }
  return {
    jumlahPesanan: seru ? 5 : 6,
    barisMin: 2,
    barisMaks: seru ? 3 : 2,
    jumlahMaks: 3,
    hargaMaks: seru ? 100000 : 50000,
    diskon: seru ? [10, 20, 25, 50] : [0],
    uang: SEMUA_UANG,
    aturanBayar: 'boleh_lebih',
    anakPilihKembalian: seru,
    tampilkanHarga: !seru,
    detikBaca: seru ? 18 : 12,
  };
}

function hargaAcak(acak: PembangkitAcak, barang: Barang): number {
  return acak.bulat(barang.hargaMin / 500, barang.hargaMaks / 500) * 500;
}

function kalimatPesanan(baris: readonly BarisPesanan[], diskon: number): string {
  const bagian = baris.map((b) => `${b.jumlah} ${b.nama}`);
  const daftar =
    bagian.length === 1 ? bagian[0] : `${bagian.slice(0, -1).join(', ')} dan ${bagian[bagian.length - 1]}`;
  const dasar = `Aku mau ${daftar}, ya.`;
  return diskon > 0 ? `${dasar} Hari ini diskon ${diskon}%.` : dasar;
}

/** Membuat satu pesanan acak yang memenuhi aturan, atau `null` bila gagal. */
function cobaPesanan(acak: PembangkitAcak, aturan: AturanTingkat, bolehDipakai: readonly Barang[]): Omit<Pesanan, 'id' | 'pembeli'> | null {
  const nBaris = acak.bulat(aturan.barisMin, aturan.barisMaks);
  const calon = bolehDipakai.filter((b) => b.hargaMin <= aturan.hargaMaks / nBaris);
  if (calon.length < nBaris) return null;
  const dipilih = acak.ambilBeberapa(calon, nBaris);
  const baris: BarisPesanan[] = dipilih.map((b) => {
    const hargaSatuan = hargaAcak(acak, b);
    const jumlah = acak.bulat(1, aturan.jumlahMaks);
    return {
      barangId: b.id,
      nama: b.nama,
      emoji: b.emoji,
      satuan: b.satuan,
      jumlah,
      hargaSatuan,
      subtotal: hargaSatuan * jumlah,
    };
  });
  const hargaSebelumDiskon = baris.reduce((a, b) => a + b.subtotal, 0);
  const diskonPersen = acak.pilih(aturan.diskon);
  const potongan = (hargaSebelumDiskon * diskonPersen) / 100;
  const harga = hargaSebelumDiskon - potongan;
  if (harga > aturan.hargaMaks || harga <= 0) return null;
  if (!Number.isInteger(potongan) || harga % 500 !== 0) return null;
  return {
    baris,
    diskonPersen,
    hargaSebelumDiskon,
    potongan,
    harga,
    tampilkanHarga: aturan.tampilkanHarga,
    kalimat: kalimatPesanan(baris, diskonPersen),
  };
}

function tandaPesanan(baris: readonly BarisPesanan[]): string {
  return baris
    .map((b) => `${b.barangId}×${b.jumlah}`)
    .sort()
    .join('+');
}

function buatDaftarPesanan(acak: PembangkitAcak, aturan: AturanTingkat): Pesanan[] {
  const pembeli = acak.ambilBeberapa(DAFTAR_PEMBELI, aturan.jumlahPesanan);
  const hasil: Pesanan[] = [];
  const tanda = new Set<string>();
  const barangTerpakai = new Set<string>();
  for (let i = 0; i < aturan.jumlahPesanan; i++) {
    let pesanan: Omit<Pesanan, 'id' | 'pembeli'> | null = null;
    for (let coba = 0; coba < 500 && pesanan === null; coba++) {
      // Pesanan satu barang: barangnya tidak berulang dalam satu babak.
      const bolehDipakai =
        aturan.barisMaks === 1 ? DAFTAR_BARANG.filter((b) => !barangTerpakai.has(b.id)) : DAFTAR_BARANG;
      const p = cobaPesanan(acak, aturan, bolehDipakai);
      if (p && !tanda.has(tandaPesanan(p.baris))) pesanan = p;
    }
    if (pesanan === null) throw new Error('Gagal membuat pesanan pasar.');
    tanda.add(tandaPesanan(pesanan.baris));
    pesanan.baris.forEach((b) => barangTerpakai.add(b.barangId));
    hasil.push({ ...pesanan, id: `pesanan-${i + 1}`, pembeli: pembeli[i] });
  }
  return hasil;
}

export function buatBabak(opsi: OpsiBabakPasar): KeadaanPasar {
  const acak = buatAcak(opsi.benih);
  const aturan = aturanUntuk(opsi.kelas, opsi.tingkat);
  const daftarPesanan = buatDaftarPesanan(acak, aturan);
  return {
    game: 'pasar',
    kelas: opsi.kelas,
    tingkat: opsi.tingkat,
    daftarPesanan,
    indeks: 0,
    uangTersedia: aturan.uang,
    aturanBayar: aturan.aturanBayar,
    anakPilihKembalian: aturan.anakPilihKembalian,
    nampan: [],
    total: 0,
    fase: 'bayar',
    pilihanKembalian: [],
    kembalianDicoba: [],
    kembalian: 0,
    kembalianOlehPinci: false,
    salah: 0,
    petunjuk: null,
    pantul: null,
    pesan: daftarPesanan[0].kalimat,
    kejutan: null,
    benihAcak: acak.keadaan,
    perkiraanDetik: aturan.detikBaca,
    catatan: { pesananSelesai: 0, bayarPas: 0, kembalianAnak: 0, kembalianPinci: 0, petunjuk: 0 },
  };
}

export function pesananSekarang(k: KeadaanPasar): Pesanan {
  return k.daftarPesanan[Math.min(k.indeks, k.daftarPesanan.length - 1)];
}

export function selesai(k: KeadaanPasar): boolean {
  return k.fase === 'selesai';
}

/** Pecah jumlah menjadi uang (serakah, dari yang terbesar). */
export function pecahUang(jumlah: number, uang: readonly NilaiUang[]): NilaiUang[] {
  const urut = uang.slice().sort((a, b) => b - a);
  const hasil: NilaiUang[] = [];
  let sisa = jumlah;
  for (const u of urut) {
    while (sisa >= u) {
      hasil.push(u);
      sisa -= u;
    }
  }
  return hasil;
}

function kalimatHarga(p: Pesanan): string {
  if (p.diskonPersen > 0) {
    return `Harga ${formatRupiah(p.hargaSebelumDiskon)}, diskon ${p.diskonPersen}% = ${formatRupiah(p.potongan)}. Jadi bayar ${formatRupiah(p.harga)}.`;
  }
  return `Harganya ${formatRupiah(p.harga)}.`;
}

function petunjukBayar(k: KeadaanPasar, total: number): string {
  const p = pesananSekarang(k);
  if (total >= p.harga) return 'Uangnya sudah cukup. Ketuk Berikan, ya.';
  const sisa = p.harga - total;
  const saran = pecahUang(sisa, k.uangTersedia).map((u) => formatAngka(u));
  const daftar = saran.length === 1 ? saran[0] : `${saran.slice(0, -1).join(', ')} dan ${saran[saran.length - 1]}`;
  return `${kalimatHarga(p)} Masih kurang ${formatRupiah(sisa)}. Coba ketuk ${daftar}.`;
}

function petunjukKembalian(k: KeadaanPasar): string {
  const p = pesananSekarang(k);
  return `Uangmu ${formatRupiah(k.total)}, harganya ${formatRupiah(p.harga)}. Hitung ${formatAngka(k.total)} − ${formatAngka(p.harga)}.`;
}

function buatPilihanKembalian(acak: PembangkitAcak, benar: number): number[] {
  const calon = [benar - 1000, benar - 500, benar + 500, benar + 1000, benar + 5000, benar * 2].filter(
    (n) => n > 0 && n !== benar,
  );
  const unik = Array.from(new Set(calon));
  const pengecoh = acak.ambilBeberapa(unik, 2);
  return [benar, ...pengecoh].sort((a, b) => a - b);
}

/** Menambah kejutan acak dan waktu; dipanggil di setiap langkah yang sah. */
function akhiriLangkah(k: KeadaanPasar, acak: PembangkitAcak, detik: number): KeadaanPasar {
  const kejutan = pilihKejutan(acak, k.kejutan);
  return { ...k, kejutan, benihAcak: acak.keadaan, perkiraanDetik: k.perkiraanDetik + detik };
}

/** Langkah belum tepat: benda memantul; setelah 2 kali, petunjuk muncul. */
function belumTepat(k: KeadaanPasar, pantul: PantulPasar, pesan: string, petunjuk: () => string): KeadaanPasar {
  const salah = k.salah + 1;
  const munculPetunjuk = salah >= BATAS_SALAH_PETUNJUK;
  const petunjukBaru = munculPetunjuk ? petunjuk() : k.petunjuk;
  const baruMuncul = munculPetunjuk && k.petunjuk === null;
  return {
    ...k,
    salah,
    pantul,
    pesan,
    petunjuk: petunjukBaru,
    catatan: baruMuncul ? { ...k.catatan, petunjuk: k.catatan.petunjuk + 1 } : k.catatan,
  };
}

function pesananBeres(k: KeadaanPasar, kembalian: number, olehPinci: boolean): KeadaanPasar {
  const pesan =
    kembalian === 0
      ? 'Pas! Terima kasih, ya.'
      : olehPinci
        ? `Kembaliannya ${formatRupiah(kembalian)}. Pinci yang hitung. Terima kasih, ya.`
        : `Betul, kembaliannya ${formatRupiah(kembalian)}. Terima kasih, ya.`;
  return {
    ...k,
    fase: 'terima',
    kembalian,
    kembalianOlehPinci: olehPinci,
    salah: 0,
    petunjuk: null,
    pantul: null,
    pilihanKembalian: [],
    kembalianDicoba: [],
    pesan,
    catatan: {
      ...k.catatan,
      pesananSelesai: k.catatan.pesananSelesai + 1,
      bayarPas: k.catatan.bayarPas + (kembalian === 0 ? 1 : 0),
      kembalianAnak: k.catatan.kembalianAnak + (kembalian > 0 && !olehPinci ? 1 : 0),
      kembalianPinci: k.catatan.kembalianPinci + (kembalian > 0 && olehPinci ? 1 : 0),
    },
  };
}

/** Fungsi murni: keadaan lama tidak diubah. Aksi yang tidak sah mengembalikan keadaan yang sama. */
export function langkah(k: KeadaanPasar, aksi: AksiPasar): KeadaanPasar {
  if (!aksiSahKah(k, aksi)) return k;
  const acak = buatAcak(k.benihAcak);
  const p = pesananSekarang(k);
  const dasar: KeadaanPasar = { ...k, pantul: null };

  switch (aksi.jenis) {
    case 'ketuk_uang': {
      const totalBaru = k.total + aksi.nilai;
      if (k.aturanBayar === 'harus_pas' && totalBaru > p.harga) {
        const hasil = belumTepat(dasar, { jenis: 'uang', nilai: aksi.nilai }, 'Uangnya kebanyakan. Coba yang lebih kecil, ya.', () =>
          petunjukBayar(k, k.total),
        );
        return akhiriLangkah(hasil, acak, DETIK_PASAR.ketukUang + DETIK_PASAR.pantul);
      }
      if (k.aturanBayar === 'boleh_lebih' && k.total >= p.harga) {
        const hasil = belumTepat(dasar, { jenis: 'uang', nilai: aksi.nilai }, 'Uangnya sudah cukup. Ketuk Berikan, ya.', () =>
          petunjukBayar(k, k.total),
        );
        return akhiriLangkah(hasil, acak, DETIK_PASAR.ketukUang + DETIK_PASAR.pantul);
      }
      const hasil: KeadaanPasar = {
        ...dasar,
        nampan: [...k.nampan, aksi.nilai],
        total: totalBaru,
        pesan: totalBaru === p.harga ? `Pas! Berikan ke ${p.pembeli.nama}.` : k.pesan,
        // Petunjuk yang sudah tampil diperbarui supaya tetap sesuai sisa uang.
        petunjuk: k.petunjuk === null ? null : petunjukBayar(k, totalBaru),
      };
      return akhiriLangkah(hasil, acak, DETIK_PASAR.ketukUang);
    }
    case 'ambil_lagi': {
      const nampan = k.nampan.slice(0, -1);
      const total = nampan.reduce<number>((a, b) => a + b, 0);
      const hasil: KeadaanPasar = {
        ...dasar,
        nampan,
        total,
        petunjuk: k.petunjuk === null ? null : petunjukBayar(k, total),
      };
      return akhiriLangkah(hasil, acak, DETIK_PASAR.ambilLagi);
    }
    case 'serahkan': {
      if (k.total < p.harga) {
        const hasil = belumTepat(dasar, { jenis: 'nampan' }, 'Uangnya masih kurang. Tambah lagi, ya.', () =>
          petunjukBayar(k, k.total),
        );
        return akhiriLangkah(hasil, acak, DETIK_PASAR.serahkan + DETIK_PASAR.pantul);
      }
      const lebih = k.total - p.harga;
      if (lebih === 0) return akhiriLangkah(pesananBeres(dasar, 0, false), acak, DETIK_PASAR.serahkan);
      if (!k.anakPilihKembalian) return akhiriLangkah(pesananBeres(dasar, lebih, true), acak, DETIK_PASAR.serahkan);
      const hasil: KeadaanPasar = {
        ...dasar,
        fase: 'kembalian',
        salah: 0,
        petunjuk: null,
        pilihanKembalian: buatPilihanKembalian(acak, lebih),
        kembalianDicoba: [],
        pesan: `Uangnya ${formatRupiah(k.total)}. Berapa kembaliannya?`,
      };
      return akhiriLangkah(hasil, acak, DETIK_PASAR.serahkan);
    }
    case 'pilih_kembalian': {
      const benar = k.total - p.harga;
      if (aksi.nilai === benar) {
        return akhiriLangkah(pesananBeres(dasar, benar, false), acak, DETIK_PASAR.pilihKembalian);
      }
      const hasil = belumTepat(
        { ...dasar, kembalianDicoba: [...k.kembalianDicoba, aksi.nilai] },
        { jenis: 'kembalian', nilai: aksi.nilai },
        'Hmm, belum tepat. Coba lagi, ya.',
        () => petunjukKembalian(k),
      );
      return akhiriLangkah(hasil, acak, DETIK_PASAR.pilihKembalian + DETIK_PASAR.pantul);
    }
    case 'lanjut': {
      const indeks = k.indeks + 1;
      if (indeks >= k.daftarPesanan.length) {
        return akhiriLangkah({ ...dasar, fase: 'selesai', pesan: 'Warung tutup. Hore, selesai!' }, acak, 0);
      }
      const berikut = k.daftarPesanan[indeks];
      const hasil: KeadaanPasar = {
        ...dasar,
        indeks,
        fase: 'bayar',
        nampan: [],
        total: 0,
        kembalian: 0,
        kembalianOlehPinci: false,
        salah: 0,
        petunjuk: null,
        pesan: berikut.kalimat,
      };
      return akhiriLangkah(hasil, acak, DETIK_PASAR.lanjut + aturanUntuk(k.kelas, k.tingkat).detikBaca);
    }
  }
}

function aksiSahKah(k: KeadaanPasar, aksi: AksiPasar): boolean {
  switch (aksi.jenis) {
    case 'ketuk_uang':
      return k.fase === 'bayar' && k.uangTersedia.includes(aksi.nilai);
    case 'ambil_lagi':
      return k.fase === 'bayar' && k.nampan.length > 0;
    case 'serahkan':
      return k.fase === 'bayar' && k.nampan.length > 0;
    case 'pilih_kembalian':
      return k.fase === 'kembalian' && k.pilihanKembalian.includes(aksi.nilai) && !k.kembalianDicoba.includes(aksi.nilai);
    case 'lanjut':
      return k.fase === 'terima';
  }
}

/** Semua aksi yang sah pada keadaan ini (kosong hanya bila babak selesai). */
export function aksiSah(k: KeadaanPasar): AksiPasar[] {
  const semua: AksiPasar[] = [
    ...k.uangTersedia.map((nilai): AksiPasar => ({ jenis: 'ketuk_uang', nilai })),
    { jenis: 'ambil_lagi' },
    { jenis: 'serahkan' },
    ...k.pilihanKembalian.map((nilai): AksiPasar => ({ jenis: 'pilih_kembalian', nilai })),
    { jenis: 'lanjut' },
  ];
  return semua.filter((a) => aksiSahKah(k, a));
}

export function ringkasan(k: KeadaanPasar): RingkasanBabak {
  const c = k.catatan;
  const hal = [`Melayani ${c.pesananSelesai} pembeli`];
  if (c.bayarPas > 0) hal.push(`Membayar uang pas ${c.bayarPas} kali`);
  if (c.kembalianAnak > 0) hal.push(`Menghitung kembalian ${c.kembalianAnak} kali`);
  if (c.kembalianPinci > 0) hal.push(`Pinci membantu kembalian ${c.kembalianPinci} kali`);
  return buatRingkasan('pasar', k.kelas, k.tingkat, hal, 'Warungnya ramai sekali tadi.');
}
