/**
 * Periksa isi TKA oleh orang tua atau guru sebelum dibuka untuk anak.
 * Hasil periksa disimpan per butir (bukan per anak) dan tidak mengubah kemajuan atau rapor anak.
 */
import type { Butir, PaketTka, Teks } from "../isi/tka/jenis";

export interface HasilPeriksa {
  status: "layak" | "perlu_diperbaiki";
  catatan?: string;
  /** waktu ISO saat ditandai */
  waktu: string;
}

export const AWALAN_PERIKSA = "periksa-tka:";

export function kunciPeriksa(id: string): string {
  return AWALAN_PERIKSA + id;
}

export interface KelompokPeriksa {
  /** id topik ("M01"), simulasi ("S1"), atau teks ("T01") */
  id: string;
  jenis: "topik" | "simulasi" | "teks";
  judul: string;
  mapel?: "mat" | "bi";
  /** teks bacaan (untuk kelompok teks), ikut diperiksa dengan id teksnya */
  teks?: Teks;
  butir: { b: Butir; bagian: string }[];
}

const NAMA_BAGIAN = {
  soalKelas: "Soal latihan",
  soalCadangan: "Soal cadangan / latihan rumah",
  terbimbing: "Latihan terbimbing",
  kuis: "Kuis pembuka",
  diagnostik: "Tes awal",
  tiket: "Tiket keluar",
} as const;

export function daftarKelompok(paket: PaketTka): KelompokPeriksa[] {
  const topik: KelompokPeriksa[] = paket.topik.map((t) => ({
    id: t.id,
    jenis: "topik",
    judul: t.judul,
    mapel: t.mapel,
    butir: (Object.keys(NAMA_BAGIAN) as (keyof typeof NAMA_BAGIAN)[]).flatMap(
      (k) => t[k].map((b) => ({ b, bagian: NAMA_BAGIAN[k] })),
    ),
  }));
  const simulasi: KelompokPeriksa[] = paket.simulasi.map((s) => ({
    id: s.id,
    jenis: "simulasi",
    judul: s.judul,
    mapel: s.mapel,
    butir: s.butir.map((b) => ({ b, bagian: b.judulStimulus ?? "Simulasi" })),
  }));
  const teks: KelompokPeriksa[] = paket.teks.map((t) => ({
    id: t.id,
    jenis: "teks",
    judul: t.judul,
    teks: t,
    butir: t.pertanyaan.map((b) => ({ b, bagian: "Pertanyaan bacaan" })),
  }));
  return [...topik, ...simulasi, ...teks];
}

/** Semua id yang diperiksa di satu kelompok (butir, ditambah teks bacaan). */
export function idPeriksa(k: KelompokPeriksa): string[] {
  return [...(k.teks ? [k.teks.id] : []), ...k.butir.map((x) => x.b.id)];
}

export function ringkasPeriksa(
  k: KelompokPeriksa,
  hasil: ReadonlyMap<string, HasilPeriksa>,
) {
  const id = idPeriksa(k);
  const layak = id.filter((x) => hasil.get(x)?.status === "layak").length;
  const perlu = id.filter(
    (x) => hasil.get(x)?.status === "perlu_diperbaiki",
  ).length;
  return { total: id.length, layak, perlu, belum: id.length - layak - perlu };
}

/** Kunci dalam kalimat sederhana untuk pemeriksa. */
export function teksKunci(b: Butir): string {
  if (b.bentuk === "pg") return b.kunci;
  if (b.bentuk === "pgk") return b.kunci.join(", ");
  return b.kunci
    .map(
      (k, i) =>
        `${b.pilihan[i]?.huruf ?? i + 1}: ${k === "B" ? (b.kategori[0] ?? "Benar") : (b.kategori[1] ?? "Salah")}`,
    )
    .join(" · ");
}

/** Pilihan ini termasuk kunci? (PG dan PG kompleks) */
export function pilihanKunci(b: Butir, huruf: string): boolean {
  if (b.bentuk === "pg") return b.kunci === huruf;
  if (b.bentuk === "pgk") return b.kunci.includes(huruf);
  return false;
}

/** Laporan teks untuk dibagikan (WhatsApp/email): ringkasan dan daftar yang perlu diperbaiki. */
export function laporanPeriksa(
  kelompok: readonly KelompokPeriksa[],
  hasil: ReadonlyMap<string, HasilPeriksa>,
): string {
  const total = kelompok.reduce(
    (n, k) => n + ringkasPeriksa(k, hasil).total,
    0,
  );
  const layak = kelompok.reduce(
    (n, k) => n + ringkasPeriksa(k, hasil).layak,
    0,
  );
  const perlu: string[] = [];
  for (const k of kelompok) {
    for (const id of idPeriksa(k)) {
      const h = hasil.get(id);
      if (h?.status === "perlu_diperbaiki")
        perlu.push(
          `- ${id} (${k.id} ${k.judul})${h.catatan ? `: ${h.catatan}` : ""}`,
        );
    }
  }
  return [
    "Hasil periksa isi TKA Pintar Main",
    `Sudah benar: ${layak} dari ${total}`,
    `Perlu diperbaiki: ${perlu.length}`,
    `Belum diperiksa: ${total - layak - perlu.length}`,
    "",
    ...(perlu.length
      ? ["Perlu diperbaiki:", ...perlu]
      : ["Belum ada yang ditandai perlu diperbaiki."]),
  ].join("\n");
}
