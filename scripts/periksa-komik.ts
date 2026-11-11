/**
 * Pemeriksa naskah komik: jalankan `npx tsx scripts/periksa-komik.ts`. Keluar dengan kode 1 bila ada masalah.
 * Aturan: src/isi/inggris/periksaKomik.ts (PROMPT-LANJUTAN-KOMIK tahap 1.4).
 */
import { PAKET_INGGRIS } from '../src/isi/inggris/paket';
import { PAKET_KOMIK, PAKET_TOKOH } from '../src/isi/inggris/paketKomik';
import { periksaPaketKomik } from '../src/isi/inggris/periksaKomik';

const semua = Object.values(PAKET_INGGRIS);
let masalah: string[] = [];
let jumlah = 0;
for (const p of Object.values(PAKET_KOMIK)) {
  if (!p) continue;
  jumlah += p.komik.length;
  masalah = masalah.concat(periksaPaketKomik(p, semua, PAKET_TOKOH));
}
if (masalah.length) {
  console.log(`✗ ${masalah.length} masalah di ${jumlah} komik:`);
  for (const x of masalah) console.log('  -', x);
  process.exit(1);
}
console.log(`✓ ${jumlah} komik lulus periksa-komik.`);
