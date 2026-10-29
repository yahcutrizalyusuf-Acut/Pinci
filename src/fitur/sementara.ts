/** Titipan hasil antar-layar (di memori), mis. hasil lembar untuk layar Akhir lembar. */
const titipan = new Map<string, unknown>();

export function titip<T>(kunci: string, isi: T) {
  titipan.set(kunci, isi);
}

export function ambilTitipan<T>(kunci: string): T | undefined {
  return titipan.get(kunci) as T | undefined;
}
