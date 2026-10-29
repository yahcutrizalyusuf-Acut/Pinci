/** Logika Belajar Bahasa Inggris: tes singkat penyaran tingkat, pengulangan berjarak kata yang salah, susun kata. */
import { buatAcak } from '../mesin/lancar';
import type { Kosakata, PaketInggris, SoalDengar, UnitInggris } from '../isi/inggris/jenis';

export type Tingkat = 3 | 4 | 5 | 6;
const HARI = 86_400_000;
/** Jarak ulang (hari) setelah salah, lalu setiap kali benar saat diulang. */
export const JARAK_ULANG = [1, 3, 7];

export interface KataUlang {
  kataId: string;
  unitId: string;
  tahap: number;
  jatuhTempo: number;
}

/** Catat hasil satu kata: salah → masuk antrean (1 hari); benar saat diulang → jarak naik; lulus setelah 3 kali. */
export function perbaruiUlang(antre: KataUlang[], kataId: string, unitId: string, benar: boolean, sekarang: number): KataUlang[] {
  const ada = antre.find((k) => k.kataId === kataId);
  const lain = antre.filter((k) => k.kataId !== kataId);
  if (!benar) return [...lain, { kataId, unitId, tahap: 0, jatuhTempo: sekarang + JARAK_ULANG[0] * HARI }];
  if (!ada) return antre;
  const tahap = ada.tahap + 1;
  if (tahap >= JARAK_ULANG.length) return lain;
  return [...lain, { ...ada, tahap, jatuhTempo: sekarang + JARAK_ULANG[tahap] * HARI }];
}

export function jatuhTempo(antre: KataUlang[], sekarang: number): KataUlang[] {
  return antre.filter((k) => k.jatuhTempo <= sekarang);
}

export interface SoalTes {
  tingkat: Tingkat;
  ucapan: string;
  kunci: Kosakata;
  pilihan: Kosakata[];
}

/** Tes singkat ± 2 menit: 2 soal dengar per tingkat (3→6), berhenti menyarankan tingkat pertama yang belum lancar. */
export function buatTesTingkat(paket: Record<Tingkat, PaketInggris>, benih: string): SoalTes[] {
  const r = buatAcak(benih);
  const hasil: SoalTes[] = [];
  for (const t of [3, 4, 5, 6] as Tingkat[]) {
    const unit = paket[t].unit;
    const dipakai = new Set<number>();
    while (hasil.filter((h) => h.tingkat === t).length < 2) {
      const u = r.bulat(0, unit.length - 1);
      if (dipakai.has(u)) continue;
      dipakai.add(u);
      const d = unit[u].dengar[r.bulat(0, unit[u].dengar.length - 1)];
      const kunci = unit[u].kosakata.find((k) => k.id === d.kunci);
      if (!kunci) continue;
      const pilihan = acak([kunci, ...d.pengecoh.slice(0, 2).map((p) => unit[u].kosakata.find((k) => k.id === p)).filter((k): k is Kosakata => !!k)], r);
      hasil.push({ tingkat: t, ucapan: d.ucapan, kunci, pilihan });
    }
  }
  return hasil;
}

/** Saran tingkat: tingkat pertama yang belum lancar (dua soalnya belum benar semua); semua lancar → 6. Anak tetap bebas memilih. */
export function saranTingkat(benarPerTingkat: Partial<Record<Tingkat, number>>): Tingkat {
  for (const t of [3, 4, 5, 6] as Tingkat[]) if ((benarPerTingkat[t] ?? 0) < 2) return t;
  return 6;
}

export interface Acak {
  bulat(min: number, maks: number): number;
}

export function acak<T>(daftar: T[], r: Acak): T[] {
  const a = [...daftar];
  for (let i = a.length - 1; i > 0; i--) {
    const j = r.bulat(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Kata acak untuk susun kata; dijamin tidak sama urutannya dengan kalimat asli bila > 1 kata. */
export function acakSusun(kalimat: string, benih: string): string[] {
  const kata = kalimat.split(' ');
  const r = buatAcak(benih);
  for (let coba = 0; coba < 10; coba++) {
    const a = acak(kata, r);
    if (a.join(' ') !== kalimat || kata.length < 2) return a;
  }
  return [...kata].reverse();
}

/** Soal dengar unit + kata ulang yang jatuh tempo (dari unit mana pun di tingkat ini, paling banyak 3). */
export function soalDengarSesi(unit: UnitInggris, paket: PaketInggris, antreJatuh: KataUlang[]): SoalDengar[] {
  const tambahan: SoalDengar[] = [];
  for (const k of antreJatuh.slice(0, 3)) {
    const u = paket.unit.find((x) => x.id === k.unitId);
    const d = u?.dengar.find((x) => x.kunci === k.kataId);
    if (d && !unit.dengar.some((x) => x.id === d.id)) tambahan.push(d);
  }
  return [...tambahan, ...unit.dengar];
}

export function cariKata(paket: PaketInggris, id: string): Kosakata | undefined {
  for (const u of paket.unit) {
    const k = u.kosakata.find((x) => x.id === id);
    if (k) return k;
  }
  return undefined;
}
