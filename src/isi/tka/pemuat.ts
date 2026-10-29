/**
 * Pemuat paket TKA: fungsi murni di atas objek `PaketTka`.
 * Paket diterima sebagai parameter (bukan di-import di sini) supaya mudah diuji;
 * paket bawaan aplikasi ada di `paket.ts`.
 */
import type { Butir, KodePenyebab, Mapel, PaketTka, Simulasi, Teks, Topik } from './jenis';

// ───────────────────────────── ambil isi ─────────────────────────────

export function daftarTopik(paket: PaketTka, mapel?: Mapel): Topik[] {
  return mapel ? paket.topik.filter((t) => t.mapel === mapel) : paket.topik;
}

export function ambilTopik(paket: PaketTka, id: string): Topik | undefined {
  return paket.topik.find((t) => t.id === id);
}

export interface SoalBerjenjang {
  /** jenjang 1: latihan terbimbing (kembaran contoh jadi) */
  terbimbing: Butir[];
  /** jenjang 2: soal kelas ● (pendek, ±45 detik) */
  kelas: Butir[];
  /** jenjang 3: soal cadangan ○ (bertempo TKA, ±2,5 menit) */
  cadangan: Butir[];
}

/** Soal satu topik dari yang paling ringan ke yang paling berat. Kosong kalau topik tidak ada. */
export function soalBerjenjang(paket: PaketTka, idTopik: string): SoalBerjenjang {
  const t = ambilTopik(paket, idTopik);
  return { terbimbing: t?.terbimbing ?? [], kelas: t?.soalKelas ?? [], cadangan: t?.soalCadangan ?? [] };
}

/** Butir latihan rumah satu topik (soal ○ halaman 5), urut sesuai bahan. */
export function latihanRumah(paket: PaketTka, idTopik: string): Butir[] {
  const t = ambilTopik(paket, idTopik);
  if (!t) return [];
  return t.latihanRumah.map((id) => t.soalCadangan.find((b) => b.id === id)).filter((b): b is Butir => b !== undefined);
}

export function daftarSimulasi(paket: PaketTka, mapel?: Mapel): Simulasi[] {
  return mapel ? paket.simulasi.filter((s) => s.mapel === mapel) : paket.simulasi;
}

export function ambilSimulasi(paket: PaketTka, id: string): Simulasi | undefined {
  return paket.simulasi.find((s) => s.id === id);
}

export function daftarTeks(paket: PaketTka): Teks[] {
  return paket.teks;
}

export function ambilTeks(paket: PaketTka, id: string): Teks | undefined {
  return paket.teks.find((t) => t.id === id);
}

/** Semua butir di paket (topik, simulasi, teks), urutan tetap. */
export function semuaButir(paket: PaketTka): Butir[] {
  return [
    ...paket.topik.flatMap((t) => [...t.diagnostik, ...t.kuis, ...t.terbimbing, ...t.soalKelas, ...t.soalCadangan, ...t.tiket]),
    ...paket.simulasi.flatMap((s) => s.butir),
    ...paket.teks.flatMap((t) => t.pertanyaan),
  ];
}

export function cariButir(paket: PaketTka, id: string): Butir | undefined {
  return semuaButir(paket).find((b) => b.id === id);
}

// ───────────────────────────── mini try out ─────────────────────────────

export interface OpsiMiniTryOut {
  /** benih acak; benih sama + masukan sama → soal sama */
  benih: number | string;
  /** topik 1–2 minggu terakhir */
  topikBaru: string[];
  /** topik ≥ 3 minggu lalu (uji tunda) */
  topikLama: string[];
  /** id butir yang keluar di mini try out 4 minggu terakhir (tidak dipakai lagi) */
  kecuali?: string[];
}

export interface SoalMiniTryOut {
  butir: Butir;
  asal: 'baru' | 'lama';
}

export interface MiniTryOut {
  soal: SoalMiniTryOut[];
  /** 2,5 menit per soal (patokan TKA) */
  waktuMenit: number;
}

export const JUMLAH_MINI_BARU = 4;
export const JUMLAH_MINI_LAMA = 2;

/** Ubah benih menjadi bilangan 32 bit (FNV-1a untuk teks). */
function benihAngka(benih: number | string): number {
  if (typeof benih === 'number') return benih >>> 0;
  let h = 0x811c9dc5;
  for (let i = 0; i < benih.length; i++) {
    h ^= benih.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pembangkit acak mulberry32: hasil sama untuk benih sama. */
function pembangkitAcak(benih: number): () => number {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function acak<T>(xs: T[], rnd: () => number): T[] {
  const ys = [...xs];
  for (let i = ys.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [ys[i], ys[j]] = [ys[j], ys[i]];
  }
  return ys;
}

/**
 * Bank mini try out: soal kelas, soal cadangan, dan latihan terbimbing yang topiknya (baris Kelompok)
 * termasuk `topik`. Butir simulasi tidak dipakai supaya simulasi tetap baru; butir 'perlu_dicek' dilewati.
 */
function bankMini(paket: PaketTka, topik: string[], kecuali: Set<string>): Butir[] {
  const ingin = new Set(topik);
  const hasil: Butir[] = [];
  const sudah = new Set<string>();
  for (const t of paket.topik) {
    for (const b of [...t.soalKelas, ...t.soalCadangan, ...t.terbimbing]) {
      if (!ingin.has(b.topik) || b.status === 'perlu_dicek' || kecuali.has(b.id) || sudah.has(b.id)) continue;
      sudah.add(b.id);
      hasil.push(b);
    }
  }
  return hasil;
}

/** Ambil n butir dari bank: diacak, lalu bergiliran per topik supaya topik tersebar. */
function ambilTersebar(bank: Butir[], n: number, rnd: () => number, terpakai: Set<string>): Butir[] {
  const perTopik = new Map<string, Butir[]>();
  for (const b of acak(bank, rnd)) {
    if (terpakai.has(b.id)) continue;
    const xs = perTopik.get(b.topik) ?? [];
    xs.push(b);
    perTopik.set(b.topik, xs);
  }
  const urutTopik = acak([...perTopik.keys()].sort(), rnd);
  const hasil: Butir[] = [];
  while (hasil.length < n) {
    let ada = false;
    for (const tp of urutTopik) {
      const xs = perTopik.get(tp);
      const b = xs?.shift();
      if (!b) continue;
      ada = true;
      hasil.push(b);
      terpakai.add(b.id);
      if (hasil.length === n) break;
    }
    if (!ada) break;
  }
  return hasil;
}

/**
 * Mini try out mingguan (06-persiapan-tka.md bagian 6a): 6 soal campuran, 4 dari topik 1–2 minggu
 * terakhir dan 2 dari topik ≥ 3 minggu lalu, 15 menit. Topik yang ada di kedua daftar dianggap baru.
 * Kalau bank satu kelompok kurang, hasilnya lebih sedikit dari 6 (tidak diisi dari kelompok lain).
 * Urutan akhir diacak supaya soal lama tidak selalu di belakang.
 */
export function buatMiniTryOut(paket: PaketTka, opsi: OpsiMiniTryOut): MiniTryOut {
  const rnd = pembangkitAcak(benihAngka(opsi.benih));
  const kecuali = new Set(opsi.kecuali ?? []);
  const baruSet = new Set(opsi.topikBaru);
  const lama = opsi.topikLama.filter((t) => !baruSet.has(t));
  const terpakai = new Set<string>();
  const baru = ambilTersebar(bankMini(paket, opsi.topikBaru, kecuali), JUMLAH_MINI_BARU, rnd, terpakai);
  const ulang = ambilTersebar(bankMini(paket, lama, kecuali), JUMLAH_MINI_LAMA, rnd, terpakai);
  const soal = acak<SoalMiniTryOut>(
    [...baru.map((butir) => ({ butir, asal: 'baru' as const })), ...ulang.map((butir) => ({ butir, asal: 'lama' as const }))],
    rnd,
  );
  return { soal, waktuMenit: Math.round(soal.length * 2.5) };
}

// ───────────────────────────── jawaban anak ─────────────────────────────

/**
 * Jawaban anak:
 * - PG: satu huruf ("B")
 * - PG kompleks: daftar huruf yang dipilih (["A", "C"])
 * - PG kategori: satu nilai per pernyataan, urut sama dengan `pilihan` (["B", "S", "B"]); kosong = "".
 */
export type JawabanAnak = string | string[];

function daftarJawaban(j: JawabanAnak): string[] {
  return typeof j === 'string' ? [j] : j;
}

/** Benar semua-atau-tidak, seperti penilaian TKA. */
export function periksaJawaban(butir: Butir, jawaban: JawabanAnak): boolean {
  const j = daftarJawaban(jawaban);
  switch (butir.bentuk) {
    case 'pg':
      return j.length === 1 && j[0] === butir.kunci;
    case 'pgk': {
      const pilih = new Set(j);
      return pilih.size === butir.kunci.length && butir.kunci.every((h) => pilih.has(h));
    }
    case 'pgkat':
      return j.length === butir.kunci.length && butir.kunci.every((k, i) => j[i] === k);
  }
}

export interface PenyebabSalah {
  /** huruf pilihan atau nomor pernyataan yang keliru */
  pilihan: string;
  alasan: string;
  kode?: KodePenyebab;
  salahPaham?: number;
}

/** Alasan baku untuk kekeliruan yang tidak punya baris pengecoh di bahan. */
export const ALASAN_TERLEWAT = 'Ada jawaban benar yang belum dipilih: berhenti setelah menemukan satu jawaban.';
export const ALASAN_PERNYATAAN_BENAR = 'Pernyataan ini benar, tetapi dinilai Salah.';

/**
 * Penyebab salah dari data pengecoh. Kosong kalau jawaban benar.
 * - PG: alasan pengecoh pilihan anak.
 * - PG kompleks: alasan setiap pilihan salah yang dipilih, ditambah "berhenti setelah satu jawaban"
 *   (salah paham utama PG kompleks, 04-standar-soal.md bagian 5) bila ada kunci yang terlewat.
 * - PG kategori: alasan setiap pernyataan Salah yang dinilai Benar; pernyataan Benar yang dinilai
 *   Salah tidak punya alasan di bahan, jadi diberi alasan umum tanpa kode.
 */
export function penyebabSalah(butir: Butir, pilihanAnak: JawabanAnak): PenyebabSalah[] {
  if (periksaJawaban(butir, pilihanAnak)) return [];
  const dariPengecoh = (kunci: string): PenyebabSalah => {
    const p = butir.pengecoh[kunci];
    const hasil: PenyebabSalah = { pilihan: kunci, alasan: p?.alasan ?? 'Pilihan ini belum tepat.' };
    if (p?.kode) hasil.kode = p.kode;
    if (p?.salahPaham !== undefined) hasil.salahPaham = p.salahPaham;
    return hasil;
  };
  const j = daftarJawaban(pilihanAnak);
  switch (butir.bentuk) {
    case 'pg':
      return j.filter((h) => h !== '').map(dariPengecoh);
    case 'pgk': {
      const hasil = j.filter((h) => !butir.kunci.includes(h)).map(dariPengecoh);
      const terlewat = butir.kunci.filter((h) => !j.includes(h));
      if (terlewat.length > 0) hasil.push({ pilihan: terlewat.join(', '), alasan: ALASAN_TERLEWAT, kode: 'S' });
      return hasil;
    }
    case 'pgkat': {
      const hasil: PenyebabSalah[] = [];
      butir.kunci.forEach((k, i) => {
        const nomor = butir.pilihan[i]?.huruf ?? String(i + 1);
        const jawab = j[i] ?? '';
        if (jawab === k || jawab === '') return;
        if (k === 'S') hasil.push(dariPengecoh(nomor));
        else hasil.push({ pilihan: nomor, alasan: ALASAN_PERNYATAAN_BENAR });
      });
      return hasil;
    }
  }
}
