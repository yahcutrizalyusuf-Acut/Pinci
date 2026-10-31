/**
 * Gudang di atas expo-sqlite. Satu tabel SQL per tabel rancangan, dengan kolom
 * saring terindeks (keluarga_id, anak_id, sesi_id, jenis, tanggal, tabel) dan
 * kolom `data` berisi baris lengkap dalam JSON.
 */
import * as SQLite from 'expo-sqlite';

import { KOLOM_SARING, nilaiKolom, type Gudang, type Saring } from './gudang';
import type { NamaTabel, PetaTabel } from './jenis';

const SEMUA_TABEL: NamaTabel[] = [
  'keluarga',
  'anak',
  'sesi',
  'jawaban',
  'pesan',
  'pengaturan_waktu',
  'pemakaian',
  'kemajuan_topik',
  'anggota_kelas',
  'catatan_pengawas',
  'tugas',
  'antrean',
  'nilai',
];

export class GudangSqlite implements Gudang {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor(private namaBerkas = 'pintar-main.db') {}

  private get basis(): SQLite.SQLiteDatabase {
    if (!this.db) throw new Error('Gudang belum disiapkan');
    return this.db;
  }

  async siapkan() {
    this.db = await SQLite.openDatabaseAsync(this.namaBerkas);
    const kolom = KOLOM_SARING.map((k) => `${k} TEXT`).join(', ');
    let sql = 'PRAGMA journal_mode = WAL;';
    for (const t of SEMUA_TABEL) {
      sql += `CREATE TABLE IF NOT EXISTS ${t} (id TEXT PRIMARY KEY NOT NULL, ${kolom}, data TEXT NOT NULL);`;
      sql += `CREATE INDEX IF NOT EXISTS ${t}_anak ON ${t}(anak_id);`;
    }
    sql += 'CREATE INDEX IF NOT EXISTS jawaban_sesi ON jawaban(sesi_id);';
    await this.basis.execAsync(sql);
  }

  private nilaiBaris(baris: object): (string | null)[] {
    return [(baris as { id: string }).id, ...KOLOM_SARING.map((k) => nilaiKolom(baris, k)), JSON.stringify(baris)];
  }

  async pasang<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]) {
    const tanda = ['?', ...KOLOM_SARING.map(() => '?'), '?'].join(', ');
    await this.basis.runAsync(
      `INSERT OR REPLACE INTO ${tabel} (id, ${KOLOM_SARING.join(', ')}, data) VALUES (${tanda})`,
      this.nilaiBaris(baris),
    );
  }

  async pasangBanyak<T extends NamaTabel>(tabel: T, baris: PetaTabel[T][]) {
    await this.basis.withTransactionAsync(async () => {
      for (const b of baris) await this.pasang(tabel, b);
    });
  }

  async ambil<T extends NamaTabel>(tabel: T, id: string) {
    const r = await this.basis.getFirstAsync<{ data: string }>(`SELECT data FROM ${tabel} WHERE id = ?`, [id]);
    return r ? (JSON.parse(r.data) as PetaTabel[T]) : null;
  }

  async cari<T extends NamaTabel>(tabel: T, saring?: Saring) {
    const kunci = saring ? (Object.keys(saring) as (keyof Saring)[]) : [];
    const where = kunci.length ? ` WHERE ${kunci.map((k) => `${k} = ?`).join(' AND ')}` : '';
    const nilai = kunci.map((k) => saring?.[k] ?? null);
    const baris = await this.basis.getAllAsync<{ data: string }>(`SELECT data FROM ${tabel}${where}`, nilai);
    return baris.map((r) => JSON.parse(r.data) as PetaTabel[T]);
  }

  async hapus(tabel: NamaTabel, id: string) {
    await this.basis.runAsync(`DELETE FROM ${tabel} WHERE id = ?`, [id]);
  }

  async kosongkan() {
    for (const t of SEMUA_TABEL) await this.basis.runAsync(`DELETE FROM ${t}`);
  }
}
