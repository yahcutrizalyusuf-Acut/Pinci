/**
 * Membuat lembar periksa isi kelas 2–5 untuk Acut (dan guru): semua teks Baca Ulang dan kartu Gudang Ilmu
 * dengan kunci jawabannya. Hasil: docs/periksa-isi/periksa-isi-kelas-2-5.html dan PDF ukuran HP.
 *
 *   npx tsx scripts/buat-periksa-isi.ts
 */
import * as fs from 'fs';
import * as path from 'path';

import { TEKS_BACA } from '../src/isi/baca/paket';
import { PAKET_GUDANG } from '../src/isi/gudang/paket';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const akar = path.join(__dirname, '..');
const keluar = path.join(akar, 'docs', 'periksa-isi');
fs.mkdirSync(keluar, { recursive: true });

const b: string[] = [];
b.push(`<h1>Periksa Isi Kelas 2–5</h1>
<p class="kecil">Tahap 1 dan 2, dibuat ${new Date().toISOString().slice(0, 10)}. Semua isi berstatus <b>belum diperiksa</b>.</p>
<div class="kotak"><p><b>Cara memeriksa:</b> baca tiap teks dan soal. Kalau ada yang salah, kurang jelas, atau tidak cocok untuk kelasnya, catat nomornya (misalnya <b>K3-T02 soal 1</b> atau <b>mat4-pembulatan-s3</b>) lalu kirim ke Claude.</p>
<p>Kunci Matematika sudah dihitung ulang oleh kode. Yang perlu dilihat: bahasa, kesesuaian kelas, pilihan jawaban, dan kata yang berhubungan dengan agama.</p></div>`);

for (const kelas of [2, 3, 4, 5]) {
  b.push(`<h2>Kelas ${kelas}</h2>`);
  b.push('<h3>Baca Ulang</h3>');
  for (const t of TEKS_BACA[kelas]) {
    b.push(`<div class="butir"><p class="id">${t.id} · ${esc(t.judul)} · ${t.jumlahKata} kata · ☐ sudah diperiksa</p>`);
    for (const bg of t.isi) if (bg.jenis === 'teks') b.push(`<p>${esc(bg.isi)}</p>`);
    t.pertanyaan.forEach((q, i) => {
      b.push(`<p><b>Soal ${i + 1}.</b> ${esc(q.pertanyaan)}</p><ul>`);
      for (const p of q.pilihan) b.push(`<li${p.huruf === q.kunci ? ' class="kunci"' : ''}>${p.huruf}. ${esc(p.teks)}${p.huruf === q.kunci ? ' ✓' : ''}</li>`);
      b.push('</ul>');
    });
    b.push('</div>');
  }
  const paket = PAKET_GUDANG[kelas];
  for (const m of paket.mapel) {
    b.push(`<h3>Gudang Ilmu · ${m.kode === 'mat' ? 'Matematika' : 'Bahasa Indonesia'}</h3>`);
    for (const top of m.topik) {
      if (!top.kartu) continue;
      const k = top.kartu;
      b.push(`<div class="butir"><p class="id">${top.id} · ${esc(top.judul)} · ☐ sudah diperiksa</p>`);
      for (const p of k.penjelasan) b.push(`<p>${esc(p.teks)}</p>`);
      for (const c of k.contohJadi) b.push(`<p class="kecil"><b>Contoh:</b> ${esc(c.soal)} → ${esc(c.langkah.join(' '))} <b>${esc(c.jawaban)}</b></p>`);
      k.soal.forEach((s, i) => {
        b.push(`<p><b>${i + 1}.</b> ${s.bacaan ? `<i>${esc(s.bacaan)}</i> ` : ''}${esc(s.pertanyaan)}${s.gambar?.jenis === 'pecahan' ? ` [gambar ${s.gambar.a}/${s.gambar.b}]` : ''}</p>`);
        if (s.pilihan) b.push(`<p class="kecil">Pilihan: ${s.pilihan.map((p) => (p === s.kunci ? `<b>${esc(p)} ✓</b>` : esc(p))).join(' · ')}</p>`);
        else b.push(`<p class="kecil">Kunci: <b>${esc(s.kunci)}</b></p>`);
      });
      b.push('</div>');
    }
  }
}

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Periksa Isi Kelas 2–5</title><style>
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf); }
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf); font-weight: 700; }
@page { size: 110mm 196mm; margin: 8mm 6mm 10mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Nunito, sans-serif; font-size: 9.5pt; line-height: 1.4; color: #2D3142; }
h1 { color: #6B4423; font-size: 20pt; margin: 0 0 2mm; } h2 { color: #6B4423; font-size: 16pt; break-before: page; margin: 0 0 2mm; }
h3 { color: #1F7A4D; font-size: 12pt; margin: 4mm 0 2mm; }
p { margin: 0 0 1.5mm; } ul { margin: 0 0 2mm; padding-left: 5mm; } .kunci { color: #1F7A4D; font-weight: 700; }
.butir { border: 1px solid #E6E9F0; border-radius: 4px; padding: 2.5mm; margin-bottom: 3mm; break-inside: avoid; }
.id { font-weight: 700; color: #B86E00; } .kecil { font-size: 8.5pt; color: #5B6072; }
.kotak { background: #FFF6E5; border-left: 4px solid #FF9F1C; padding: 2.5mm; margin: 2mm 0; }
</style></head><body>${b.join('\n')}</body></html>`;

const berkasHtml = path.join(keluar, 'periksa-isi-kelas-2-5.html');
fs.writeFileSync(berkasHtml, html, 'utf8');

(async () => {
  // Playwright terpasang di mesin pengembang, bukan dependensi proyek: dimuat saat skrip dijalankan
  // supaya pemeriksa kode di server (tanpa Playwright) tidak gagal.
  const namaModul = 'playwright';
  // require (bukan import) supaya Playwright yang terpasang global (NODE_PATH) ikut ditemukan.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { chromium } = require(namaModul) as { chromium: { launch: () => Promise<{ newPage: () => Promise<any>; close: () => Promise<void> }> } };
  const peramban = await chromium.launch();
  const hal = await peramban.newPage();
  await hal.goto('file://' + berkasHtml);
  await hal.evaluate(() => document.fonts.ready);
  await hal.pdf({
    path: path.join(keluar, 'Periksa-Isi-Kelas-2-5.pdf'),
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font-size:7px;color:#868C9E;text-align:center">Periksa Isi Kelas 2–5 · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
  });
  await peramban.close();
  console.log('Tersimpan di docs/periksa-isi/');
})();
