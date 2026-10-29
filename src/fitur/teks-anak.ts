/**
 * Teks untuk layar anak: alasan pengecoh di bahan ditulis untuk guru ("salah paham 3", "Anak yang …").
 * Untuk anak: buang rujukan guru, hindari kata "salah", kalimat pendek.
 */

/** Ubah alasan pengecoh menjadi kalimat ramah anak. */
export function alasanUntukAnak(alasan: string): string {
  let t = alasan
    .replace(/\(?\s*salah paham\s*\d+\s*\)?/gi, '')
    .replace(/\s*[,;]?\s*kode\s*[BHS]\b/g, '');
  // Buang kalimat yang membicarakan "anak" sebagai orang ketiga (catatan untuk pengajar).
  t = t
    .replace(/([.!?])\s+/g, '$1\n')
    .split('\n')
    .filter((k) => !/^(anak|murid|siswa)\b/i.test(k.trim()))
    .join(' ');
  t = t.replace(/\bsalah\b/gi, 'keliru').replace(/\s{2,}/g, ' ').replace(/\s+([.,;])/g, '$1').replace(/[,;]+\./g, '.').replace(/[,;]\s*$/, '.').trim();
  if (!t) return 'Pilihan ini belum tepat.';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Saran penyebab untuk anak (pengganti kode B/H/S/W yang ditujukan ke orang tua). */
export const SARAN_ANAK: Record<string, string> = {
  B: 'Baca soalnya pelan-pelan, lalu tunjuk kata yang penting.',
  H: 'Caramu sudah benar. Periksa lagi hitungannya.',
  S: 'Coba lihat lagi contoh jadinya, ya.',
  W: 'Lain kali, lompati soal sulit dulu, lalu kembali.',
};
