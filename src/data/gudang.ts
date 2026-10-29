/**
 * Gudang: penyimpanan baris per tabel di HP. Dua pelaksana:
 * - GudangSqlite (HP Android, expo-sqlite) — aktif di aplikasi.
 * - GudangMemori (uji dan pratinjau web; bisa disimpan ke localStorage).
 * Lapisan di atasnya (Repositori) tidak tahu pelaksana mana yang dipakai.
 */
import type { NamaTabel, PetaTabel } from './jenis';

/** Kolom yang bisa dipakai menyaring. Kolom lain disimpan di dalam data JSON. */
export const KOLOM_SARING = ['keluarga_id', 'anak_id', 'sesi_id', 'jenis', 'tanggal', 'tabel'] as const;
export type KolomSaring = (typeof KOLOM_SARING)[number];
export type Saring = Partial<Record<KolomSaring, string>>;

export interface Gudang {
  siapkan(): Promise<void>;
  pasang<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]): Promise<void>;
  pasangBanyak<T extends NamaTabel>(tabel: T, baris: PetaTabel[T][]): Promise<void>;
  ambil<T extends NamaTabel>(tabel: T, id: string): Promise<PetaTabel[T] | null>;
  cari<T extends NamaTabel>(tabel: T, saring?: Saring): Promise<PetaTabel[T][]>;
  hapus(tabel: NamaTabel, id: string): Promise<void>;
  kosongkan(): Promise<void>;
}

export function nilaiKolom(baris: object, kolom: KolomSaring): string | null {
  const v = (baris as Record<string, unknown>)[kolom];
  return typeof v === 'string' ? v : null;
}

export function cocok(baris: object, saring?: Saring): boolean {
  if (!saring) return true;
  return (Object.keys(saring) as KolomSaring[]).every((k) => nilaiKolom(baris, k) === saring[k]);
}

/** Penyimpan sederhana untuk pratinjau web (localStorage) — opsional. */
export interface PenyimpanTeks {
  baca(kunci: string): string | null;
  tulis(kunci: string, isi: string): void;
}

export class GudangMemori implements Gudang {
  private data = new Map<NamaTabel, Map<string, object>>();
  private tundaSimpan: ReturnType<typeof setTimeout> | null = null;

  constructor(private penyimpan?: PenyimpanTeks, private kunci = 'pintar-main-v1') {}

  async siapkan() {
    if (!this.penyimpan) return;
    const teks = this.penyimpan.baca(this.kunci);
    if (!teks) return;
    try {
      const obj = JSON.parse(teks) as Record<string, Record<string, object>>;
      for (const [tabel, isi] of Object.entries(obj)) {
        this.data.set(tabel as NamaTabel, new Map(Object.entries(isi)));
      }
    } catch {
      // data rusak: mulai kosong
    }
  }

  private tabel(t: NamaTabel) {
    let m = this.data.get(t);
    if (!m) {
      m = new Map();
      this.data.set(t, m);
    }
    return m;
  }

  private simpan() {
    if (!this.penyimpan) return;
    if (this.tundaSimpan) clearTimeout(this.tundaSimpan);
    this.tundaSimpan = setTimeout(() => {
      const obj: Record<string, Record<string, object>> = {};
      for (const [t, m] of this.data) obj[t] = Object.fromEntries(m);
      this.penyimpan?.tulis(this.kunci, JSON.stringify(obj));
    }, 50);
  }

  async pasang<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]) {
    this.tabel(tabel).set(baris.id, JSON.parse(JSON.stringify(baris)));
    this.simpan();
  }

  async pasangBanyak<T extends NamaTabel>(tabel: T, baris: PetaTabel[T][]) {
    const m = this.tabel(tabel);
    for (const b of baris) m.set(b.id, JSON.parse(JSON.stringify(b)));
    this.simpan();
  }

  async ambil<T extends NamaTabel>(tabel: T, id: string) {
    const b = this.tabel(tabel).get(id);
    return b ? (JSON.parse(JSON.stringify(b)) as PetaTabel[T]) : null;
  }

  async cari<T extends NamaTabel>(tabel: T, saring?: Saring) {
    const hasil: PetaTabel[T][] = [];
    for (const b of this.tabel(tabel).values()) {
      if (cocok(b, saring)) hasil.push(JSON.parse(JSON.stringify(b)) as PetaTabel[T]);
    }
    return hasil;
  }

  async hapus(tabel: NamaTabel, id: string) {
    this.tabel(tabel).delete(id);
    this.simpan();
  }

  async kosongkan() {
    this.data.clear();
    this.simpan();
  }
}
