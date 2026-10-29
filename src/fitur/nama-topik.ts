/** Nama topik yang mudah dibaca orang tua (diisi dari paket isi bila ada). */
const daftar = new Map<string, string>();

export function daftarkanNamaTopik(mapel: string, topik: string, nama: string) {
  daftar.set(`${mapel}:${topik}`, nama);
}

export function namaTopik(mapel: string, topik: string): string {
  return daftar.get(`${mapel}:${topik}`) ?? topik;
}
