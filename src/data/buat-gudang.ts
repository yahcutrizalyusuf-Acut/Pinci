/** Pratinjau web: gudang memori yang disimpan ke localStorage. */
import { GudangMemori, type Gudang } from './gudang';

export function buatGudang(): Gudang {
  const ls = typeof globalThis !== 'undefined' ? (globalThis as { localStorage?: Storage }).localStorage : undefined;
  return new GudangMemori(
    ls
      ? {
          baca: (k) => ls.getItem(k),
          tulis: (k, v) => ls.setItem(k, v),
        }
      : undefined,
  );
}
