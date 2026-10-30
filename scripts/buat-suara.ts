/**
 * Rekaman suara Inggris untuk 🔊 (tanpa bergantung pada mesin suara HP).
 *
 *   npm run suara
 *
 * 1. Mendaftar semua ucapan Inggris dari assets/paket/inggris-t3..t6.json.
 * 2. Membuat rekaman yang belum ada lewat scripts/buat-suara.py (Kokoro, berjalan offline di komputer ini).
 * 3. Menulis src/isi/suara/peta-en.ts (kunci → berkas) supaya ikut dibundel.
 *
 * Rekaman manusia (guru/penutur asli) cukup menimpa berkas assets/suara/en/<kunci>.mp3 dengan nama yang sama.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { PAKET_INGGRIS } from '../src/isi/inggris/paket';
import { daftarUcapan } from '../src/isi/suara/kunci';

const akar = process.cwd();
const FOLDER = path.join(akar, 'assets/suara/en');
const DAFTAR = path.join(akar, 'assets/suara/daftar-en.json');
const PETA = path.join(akar, 'src/isi/suara/peta-en.ts');

export function tulisPeta(): number {
  const ada = existsSync(FOLDER) ? readdirSync(FOLDER).filter((f) => f.endsWith('.mp3')).sort() : [];
  const baris = ada.map((f) => `  '${f.replace('.mp3', '')}': require('../../../assets/suara/en/${f}'),`);
  writeFileSync(
    PETA,
    [
      '/** DIBUAT OTOMATIS oleh scripts/buat-suara.ts — jangan diubah tangan. Kunci → rekaman suara Inggris. */',
      `export const PETA_SUARA_EN: Record<string, number> = {${baris.length ? '\n' + baris.join('\n') + '\n' : ''}};`,
      '',
    ].join('\n'),
  );
  return ada.length;
}

function utama() {
  mkdirSync(FOLDER, { recursive: true });
  const daftar = daftarUcapan(Object.values(PAKET_INGGRIS));
  writeFileSync(DAFTAR, `${JSON.stringify(daftar, null, 1)}\n`);
  const kurang = daftar.filter((d) => !existsSync(path.join(FOLDER, `${d.kunci}.mp3`)));
  console.log(`Ucapan: ${daftar.length}, belum ada rekaman: ${kurang.length}`);
  if (kurang.length && !process.argv.includes('--peta-saja')) {
    execFileSync('python3', [path.join(akar, 'scripts/buat-suara.py'), DAFTAR, FOLDER], { stdio: 'inherit' });
  }
  console.log(`Peta ditulis: ${tulisPeta()} rekaman.`);
}

if (require.main === module) utama();
