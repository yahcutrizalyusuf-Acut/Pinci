/** HP Android/iOS: SQLite. */
import type { Gudang } from './gudang';
import { GudangSqlite } from './gudang-sqlite';

export function buatGudang(): Gudang {
  return new GudangSqlite();
}
