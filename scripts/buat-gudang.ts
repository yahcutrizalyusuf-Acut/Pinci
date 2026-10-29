/**
 * Membangkitkan assets/paket/gudang-k6.json dari sumber bertipe di src/isi/gudang/sumber/.
 * Jalankan: npx tsx scripts/buat-gudang.ts
 * Sesudah itu: npx jest src/isi/gudang (memeriksa isi dan menghitung ulang kunci Matematika).
 */
import * as fs from 'fs';
import * as path from 'path';
import { bangunPaketGudang } from '../src/isi/gudang/sumber/peta';

const paket = bangunPaketGudang();
const tujuan = path.join(__dirname, '..', 'assets', 'paket', 'gudang-k6.json');
fs.mkdirSync(path.dirname(tujuan), { recursive: true });
fs.writeFileSync(tujuan, JSON.stringify(paket, null, 2) + '\n', 'utf8');

for (const m of paket.mapel) {
  const kartu = m.topik.filter((t) => t.kartu).length;
  const soal = m.topik.reduce((n, t) => n + (t.kartu?.soal.length ?? 0), 0);
  console.log(`${m.kode}: ${m.topik.length} topik, ${kartu} kartu, ${soal} soal`);
}
console.log(`Tersimpan di ${path.relative(process.cwd(), tujuan)}`);
