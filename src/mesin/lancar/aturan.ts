/**
 * Aturan naik–tetap–turun Metode LANCAR (fungsi murni).
 *
 * Level TIDAK disimpan sebagai angka: `hitungKemajuan` mengurutkan riwayat
 * sesi menurut waktu mulai lalu memutar aturan dari awal.
 *
 * Aturan (04-mesin-lancar.md bagian 3; keputusan.md B3 no. 5):
 * - kilat  : salah 0 dan detik ≤ 66% target → langsung naik.
 * - tepat  : salah ≤ 1 dan detik ≤ target. Naik setelah 2 lembar tepat
 *            berturut-turut dari dua sesi berjeda ≥ 1 jam (dihitung dari
 *            selesainya lembar tepat pertama sampai mulainya lembar kedua).
 *            Lembar tepat yang jedanya kurang dari 1 jam tidak dihitung
 *            (tidak memutus dan tidak menambah rangkaian).
 * - turun  : salah ≥ 6 → turun satu level (tidak di bawah Level 1).
 * - tetap  : selain itu (salah 2–5, atau salah ≤ 1 tetapi lewat target);
 *            memutus rangkaian tepat.
 * - Lembar mode `dampingi` tidak dihitung untuk naik maupun turun, dan tidak
 *   memutus rangkaian; soal salahnya tetap masuk pengulangan.
 * - Lembar ke-3 dan seterusnya di hari yang sama (WIB) tidak dihitung untuk
 *   naik level, tetapi aturan turun tetap berlaku.
 * - Lembar yang tidak selesai tidak dihitung.
 * - Waktu lembar = jumlah detik per soal (waktu jeda tidak ikut).
 * - Benar/salah dihitung ulang dengan `cocokJawaban`.
 * - Daya tahan: 21 hari setelah lulus level, 6 soal level itu diuji; ingat
 *   bila salah ≤ 1. Bila belum ingat: soal salahnya masuk pengulangan dan
 *   diuji ulang 7 hari kemudian (celah #7).
 * - Pengulangan: sampai 4 soal yang salah, lalu yang > 2× target, muncul lagi
 *   di lembar berikutnya (kosong bila naik level).
 */
import { cocokJawaban } from './jawaban';
import type { HasilLembar, JawabanLancar, SesiLancar, SoalLancar } from './jenis';
import { LEVEL_PER_KELAS } from './level';
import { MAKS_SOAL_ULANG, type OpsiLembar } from './lembar';
import { tentukanLevelAwal } from './penempatan';

export const BATAS_SALAH_TEPAT = 1;
export const BATAS_SALAH_TURUN = 6;
export const RASIO_KILAT = 0.66;
export const RASIO_LAMBAT = 2;
export const JEDA_MINIMUM_MS = 60 * 60 * 1000;
export const HARI_MS = 24 * 60 * 60 * 1000;
export const HARI_DAYA_TAHAN = 21;
export const HARI_UJI_ULANG_DAYA_TAHAN = 7;
export const BATAS_SALAH_DAYA_TAHAN = 1;
export const LEMBAR_DIHITUNG_PER_HARI = 2;
/** Zona waktu untuk menghitung "hari yang sama": WIB (UTC+7). */
export const SELISIH_ZONA_MS = 7 * 60 * 60 * 1000;

export interface NilaiLembar {
  jumlahSoal: number;
  terjawab: number;
  benar: number;
  salah: number;
  detik: number;
  targetDetik: number;
  selesai: boolean;
  hasil: HasilLembar;
}

/** Hasil dari jumlah salah, detik, dan target. */
export function tentukanHasil(salah: number, detik: number, targetDetik: number): HasilLembar {
  if (salah === 0 && detik <= targetDetik * RASIO_KILAT) return 'kilat';
  if (salah <= BATAS_SALAH_TEPAT && detik <= targetDetik) return 'tepat';
  if (salah >= BATAS_SALAH_TURUN) return 'turun';
  return 'tetap';
}

const benarDihitung = (j: JawabanLancar): boolean => cocokJawaban(j.soal, j.jawaban);

/** Penilai satu lembar. Lembar yang belum selesai selalu `tetap`. */
export function nilaiLembar(jawaban: readonly JawabanLancar[], jumlahSoal: number = jawaban.length): NilaiLembar {
  const benar = jawaban.filter(benarDihitung).length;
  const salah = jawaban.length - benar;
  const detik = jawaban.reduce((t, j) => t + j.detik, 0);
  const targetDetik = jawaban.reduce((t, j) => t + j.soal.targetDetik, 0);
  const selesai = jawaban.length >= jumlahSoal && jawaban.length > 0;
  return {
    jumlahSoal,
    terjawab: jawaban.length,
    benar,
    salah,
    detik,
    targetDetik,
    selesai,
    hasil: selesai ? tentukanHasil(salah, detik, targetDetik) : 'tetap',
  };
}

export const nilaiSesi = (sesi: SesiLancar): NilaiLembar => nilaiLembar(sesi.jawaban, sesi.jumlahSoal);

export type StatusDayaTahan = 'menunggu' | 'ingat' | 'perlu_ulang';

export interface DayaTahanLevel {
  status: StatusDayaTahan;
  /** Kapan uji daya tahan berikutnya jatuh tempo (ms). */
  jatuhTempo: number;
  terakhirDiuji: number | null;
}

export type AlasanTidakDihitung = 'dampingi' | 'belum_selesai' | 'lembar_ke3_hari_ini' | 'jeda_kurang_1_jam' | 'level_tidak_cocok';

export interface CatatanSesi {
  sesiId: string;
  jenis: SesiLancar['jenis'];
  hasil: HasilLembar | null;
  /** Apakah lembar ini ikut menentukan naik/turun. */
  dihitung: boolean;
  alasan: AlasanTidakDihitung | null;
  levelSebelum: number;
  levelSesudah: number;
  arah: 'naik' | 'turun' | 'tetap' | 'penempatan';
  dayaTahan: { level: number; ingat: boolean } | null;
}

export interface KemajuanLancar {
  kelas: number;
  level: number;
  sudahPenempatan: boolean;
  /** Lembar tepat pertama yang menunggu pasangannya, atau `null`. */
  tepatTertunda: { sesiId: string; selesai: number } | null;
  /** Level → waktu lulus terakhir (ms). */
  lulus: Record<number, number>;
  dayaTahan: Record<number, DayaTahanLevel>;
  /** Soal untuk diselipkan ulang di lembar berikutnya (≤ 4). */
  soalUlang: SoalLancar[];
  /** Level 6 sudah lulus. */
  tamat: boolean;
  /** Banyak lembar latihan yang sudah dikerjakan di level sekarang. */
  lembarDiLevel: number;
  catatan: CatatanSesi[];
}

const kunciHari = (ms: number): number => Math.floor((ms + SELISIH_ZONA_MS) / HARI_MS);

function bandingSesi(a: SesiLancar, b: SesiLancar): number {
  if (a.mulai !== b.mulai) return a.mulai - b.mulai;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** Soal salah dulu, lalu soal benar yang > 2× target (paling lambat dulu). */
export function pilihSoalUlang(jawaban: readonly JawabanLancar[], didahulukan: readonly SoalLancar[] = []): SoalLancar[] {
  const salah = jawaban.filter((j) => !benarDihitung(j)).map((j) => j.soal);
  const lambat = jawaban
    .filter((j) => benarDihitung(j) && j.detik > RASIO_LAMBAT * j.soal.targetDetik)
    .sort((x, y) => y.detik / y.soal.targetDetik - x.detik / x.soal.targetDetik)
    .map((j) => j.soal);
  const keluar: SoalLancar[] = [];
  const ada = new Set<string>();
  for (const s of [...didahulukan, ...salah, ...lambat]) {
    if (keluar.length >= MAKS_SOAL_ULANG) break;
    if (ada.has(s.teks)) continue;
    ada.add(s.teks);
    keluar.push(s);
  }
  return keluar;
}

export interface OpsiKemajuan {
  /** Kelas yang dihitung. Bawaan: kelas sesi terakhir (atau 1 bila kosong). */
  kelas?: number;
}

export function hitungKemajuan(riwayatSesi: readonly SesiLancar[], opsi: OpsiKemajuan = {}): KemajuanLancar {
  const urut = [...riwayatSesi].sort(bandingSesi);
  const terakhir = urut[urut.length - 1];
  const kelas = opsi.kelas ?? terakhir?.kelas ?? 1;

  let level = 1;
  let sudahPenempatan = false;
  let tepatTertunda: KemajuanLancar['tepatTertunda'] = null;
  let soalUlang: SoalLancar[] = [];
  let tamat = false;
  let lembarDiLevel = 0;
  const lulus: Record<number, number> = {};
  const dayaTahan: Record<number, DayaTahanLevel> = {};
  const catatan: CatatanSesi[] = [];
  const lembarPerHari = new Map<number, number>();

  const catatLulus = (lv: number, waktu: number): void => {
    lulus[lv] = waktu;
    dayaTahan[lv] = { status: 'menunggu', jatuhTempo: waktu + HARI_DAYA_TAHAN * HARI_MS, terakhirDiuji: null };
  };
  const gantiLevel = (baru: number): void => {
    level = baru;
    tepatTertunda = null;
    lembarDiLevel = 0;
  };

  for (const sesi of urut) {
    if (sesi.kelas !== kelas) continue;
    const levelSebelum = level;

    if (sesi.jenis === 'penempatan') {
      const hasil = tentukanLevelAwal(sesi.jawaban);
      gantiLevel(hasil.levelAwal);
      sudahPenempatan = true;
      soalUlang = [];
      tamat = false;
      for (const lv of hasil.levelLancar) if (lulus[lv] === undefined) catatLulus(lv, sesi.selesai);
      catatan.push({ sesiId: sesi.id, jenis: sesi.jenis, hasil: null, dihitung: true, alasan: null, levelSebelum, levelSesudah: level, arah: 'penempatan', dayaTahan: null });
      continue;
    }

    const nilai = nilaiSesi(sesi);
    const cocokLevel = sesi.level === level;
    if (cocokLevel) lembarDiLevel++;

    let alasan: AlasanTidakDihitung | null = null;
    if (!cocokLevel) alasan = 'level_tidak_cocok';
    else if (sesi.mode === 'dampingi') alasan = 'dampingi';
    else if (!nilai.selesai) alasan = 'belum_selesai';

    let bolehNaik = alasan === null;
    if (alasan === null) {
      const hari = kunciHari(sesi.mulai);
      const ke = (lembarPerHari.get(hari) ?? 0) + 1;
      lembarPerHari.set(hari, ke);
      if (ke > LEMBAR_DIHITUNG_PER_HARI) {
        bolehNaik = false;
        alasan = 'lembar_ke3_hari_ini';
      }
    }
    const bolehTurun = alasan === null || alasan === 'lembar_ke3_hari_ini';

    // Uji daya tahan (hanya lembar sendiri yang selesai dan levelnya cocok).
    let hasilDayaTahan: CatatanSesi['dayaTahan'] = null;
    let soalDayaTahanSalah: SoalLancar[] = [];
    const lvDT = sesi.levelDayaTahan;
    if (lvDT !== null && bolehTurun && lulus[lvDT] !== undefined) {
      const item = sesi.jawaban.filter((j) => j.soal.asal === 'daya_tahan');
      const salahDT = item.filter((j) => !benarDihitung(j));
      const ingat = item.length > 0 && salahDT.length <= BATAS_SALAH_DAYA_TAHAN;
      dayaTahan[lvDT] = ingat
        ? { status: 'ingat', jatuhTempo: dayaTahan[lvDT]?.jatuhTempo ?? sesi.selesai, terakhirDiuji: sesi.selesai }
        : { status: 'perlu_ulang', jatuhTempo: sesi.selesai + HARI_UJI_ULANG_DAYA_TAHAN * HARI_MS, terakhirDiuji: sesi.selesai };
      if (!ingat) soalDayaTahanSalah = salahDT.map((j) => j.soal);
      hasilDayaTahan = { level: lvDT, ingat };
    }

    let arah: CatatanSesi['arah'] = 'tetap';
    const naik = (): 'naik' => {
      catatLulus(level, sesi.selesai);
      if (level < LEVEL_PER_KELAS) gantiLevel(level + 1);
      else {
        tamat = true;
        tepatTertunda = null;
      }
      return 'naik';
    };

    if (cocokLevel && nilai.selesai) {
      const h = nilai.hasil;
      if (h === 'kilat' && bolehNaik) arah = naik();
      else if (h === 'kilat' || h === 'tepat') {
        if (bolehNaik) {
          if (tepatTertunda === null) tepatTertunda = { sesiId: sesi.id, selesai: sesi.selesai };
          else if (sesi.mulai - tepatTertunda.selesai >= JEDA_MINIMUM_MS) arah = naik();
          else {
            bolehNaik = false;
            alasan = 'jeda_kurang_1_jam';
          }
        }
      } else if (h === 'turun' && bolehTurun) {
        if (level > 1) gantiLevel(level - 1);
        else tepatTertunda = null;
        tamat = false;
        arah = 'turun';
      } else if (h === 'tetap' && bolehNaik) {
        tepatTertunda = null;
      }
    }

    // Pengulangan: dari lembar ini (juga lembar dampingi), kecuali bila naik level.
    if (arah === 'naik') soalUlang = [];
    else if (cocokLevel) {
      const levelKini = level;
      soalUlang = pilihSoalUlang(sesi.jawaban, soalDayaTahanSalah).filter(
        (s) => s.kelas < kelas || (s.kelas === kelas && s.level <= levelKini),
      );
    }

    catatan.push({
      sesiId: sesi.id,
      jenis: sesi.jenis,
      hasil: nilai.selesai ? nilai.hasil : null,
      dihitung: alasan === null || (alasan === 'lembar_ke3_hari_ini' && arah === 'turun'),
      alasan,
      levelSebelum,
      levelSesudah: level,
      arah,
      dayaTahan: hasilDayaTahan,
    });
  }

  return { kelas, level, sudahPenempatan, tepatTertunda, lulus, dayaTahan, soalUlang, tamat, lembarDiLevel, catatan };
}

/**
 * Level yang perlu diuji daya tahannya sekarang (yang paling kecil), atau `null`.
 * Hanya level di bawah level sekarang (atau semua level bila sudah tamat).
 */
export function levelDayaTahanBerikut(kemajuan: KemajuanLancar, sekarang: number): number | null {
  const batas = kemajuan.tamat ? LEVEL_PER_KELAS : kemajuan.level - 1;
  for (let lv = 1; lv <= batas; lv++) {
    const d = kemajuan.dayaTahan[lv];
    if (d && d.status !== 'ingat' && d.jatuhTempo <= sekarang) return lv;
  }
  return null;
}

/** Opsi `buatLembar` untuk lembar berikutnya, dari kemajuan yang sudah dihitung. */
export function opsiLembarBerikut(kemajuan: KemajuanLancar, benih: string | number, sekarang: number): OpsiLembar {
  return {
    kelas: kemajuan.kelas,
    level: kemajuan.level,
    benih,
    soalUlang: kemajuan.soalUlang,
    levelDayaTahan: levelDayaTahanBerikut(kemajuan, sekarang),
    lembarKe: kemajuan.lembarDiLevel + 1,
  };
}
