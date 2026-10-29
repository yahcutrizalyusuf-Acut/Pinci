/**
 * Membuat efek bunyi pendek (WAV 16-bit mono 22.050 Hz) dengan rumus, tanpa berkas berlisensi.
 * Jalankan: npm run bunyi
 */
import { Buffer } from 'node:buffer';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LAJU = 22050;

function wav(sampel) {
  const data = Buffer.alloc(sampel.length * 2);
  sampel.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767 * 0.8, i * 2));
  const kepala = Buffer.alloc(44);
  kepala.write('RIFF', 0);
  kepala.writeUInt32LE(36 + data.length, 4);
  kepala.write('WAVE', 8);
  kepala.write('fmt ', 12);
  kepala.writeUInt32LE(16, 16);
  kepala.writeUInt16LE(1, 20);
  kepala.writeUInt16LE(1, 22);
  kepala.writeUInt32LE(LAJU, 24);
  kepala.writeUInt32LE(LAJU * 2, 28);
  kepala.writeUInt16LE(2, 32);
  kepala.writeUInt16LE(16, 34);
  kepala.write('data', 36);
  kepala.writeUInt32LE(data.length, 40);
  return Buffer.concat([kepala, data]);
}

/** Nada dengan selubung naik cepat dan turun eksponensial. */
function nada(frek, detik, { geser = 0, peluruhan = 6, harmonik = 0.3 } = {}) {
  const n = Math.floor(LAJU * detik);
  const keluar = new Array(n);
  let fase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / LAJU;
    const f = frek + geser * (t / detik);
    fase += (2 * Math.PI * f) / LAJU;
    const sel = Math.min(1, t / 0.005) * Math.exp(-peluruhan * t);
    keluar[i] = sel * (Math.sin(fase) + harmonik * Math.sin(2 * fase));
  }
  return keluar;
}

function gabung(...bagian) {
  return bagian.flat();
}

function campur(a, b, mulaiB) {
  const n = Math.max(a.length, mulaiB + b.length);
  const k = new Array(n).fill(0);
  a.forEach((s, i) => (k[i] += s));
  b.forEach((s, i) => (k[i + mulaiB] += s));
  const maks = Math.max(...k.map(Math.abs), 1);
  return k.map((s) => s / maks);
}

const folder = join(process.cwd(), 'assets', 'bunyi');
// plop: nada rendah turun cepat (benda diletakkan / memantul)
writeFileSync(join(folder, 'plop.wav'), wav(nada(420, 0.12, { geser: -260, peluruhan: 30, harmonik: 0.1 })));
// ting: dua nada tinggi berurutan (benar)
writeFileSync(join(folder, 'ting.wav'), wav(gabung(nada(1046, 0.09, { peluruhan: 18 }), nada(1568, 0.22, { peluruhan: 10 }))));
// pesta kecil: arpeggio naik ≤ 1,5 detik
const C = [523, 659, 784, 1046];
let pesta = [];
C.forEach((f, i) => {
  pesta = campur(pesta, nada(f, 0.5, { peluruhan: 5 }), Math.floor(i * 0.11 * LAJU));
});
pesta = campur(pesta, nada(1318, 0.7, { peluruhan: 4 }), Math.floor(0.5 * LAJU));
writeFileSync(join(folder, 'pesta.wav'), wav(pesta));
console.log('Bunyi dibuat di assets/bunyi: plop.wav, ting.wav, pesta.wav');
