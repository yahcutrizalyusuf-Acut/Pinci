/**
 * Lembar periksa Cerita Komik untuk guru Bahasa Inggris (bisa dicetak A4). Isi per komik: gambar panel (sementara),
 * setiap gelembung Inggris + arti dengan kotak centang dan ruang catatan, tips bunyi, Cek Paham + kunci, pesan akhlak,
 * renungan, perbuatan baik. Di akhir: Bunyi Hari Ini tingkat 3–4, ringkasan, dan tanda tangan guru.
 *
 * Gambar panel diambil dari build web (layar /pratinjau/komik), jadi jalankan dulu:
 *   EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist
 *   node scripts/sajikan-web.cjs dist 8081 &
 *   npx tsx scripts/buat-lembar-periksa-komik.ts
 * Hasil: docs/periksa-isi/Lembar-Periksa-Komik-Guru.pdf (berkas .html bantu boleh dihapus).
 */
import * as fs from 'fs';
import * as path from 'path';

import { PAKET_INGGRIS } from '../src/isi/inggris/paket';
import { PAKET_KOMIK, PAKET_TOKOH, teksTokoh } from '../src/isi/inggris/paketKomik';

const DASAR = process.env.ALAMAT || 'http://localhost:8081';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nama = (id: string) => PAKET_TOKOH.tokoh.find((t) => t.id === id)?.nama ?? id;
const akar = path.join(__dirname, '..');
const keluar = path.join(akar, 'docs', 'periksa-isi');
fs.mkdirSync(keluar, { recursive: true });

const semuaKomik = Object.values(PAKET_KOMIK).flatMap((p) => p?.komik ?? []);

async function main() {
  const namaModul = 'playwright';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { chromium } = require(namaModul) as { chromium: { launch: () => Promise<any> } };
  const peramban = await chromium.launch();

  // 1. Ambil gambar setiap panel dari layar pratinjau.
  const gambar = new Map<string, string>();
  const hal = await peramban.newPage({ viewport: { width: 700, height: 900 }, deviceScaleFactor: 2 });
  await hal.goto(`${DASAR}/pratinjau/komik`);
  await hal.waitForTimeout(3000);
  for (const k of semuaKomik) {
    for (const p of k.panel) {
      const el = hal.locator(`[aria-label="${teksTokoh(p.adegan).replace(/"/g, '\\"')}"]`).first();
      if (!(await el.count())) continue;
      await el.scrollIntoViewIfNeeded();
      const png: Buffer = await el.screenshot();
      gambar.set(p.id, `data:image/png;base64,${png.toString('base64')}`);
    }
  }
  await hal.close();
  console.log(`Gambar panel: ${gambar.size}`);

  // 2. Susun lembar.
  const b: string[] = [];
  b.push(`<section class="sampul">
<h1>Lembar Periksa Cerita Komik</h1>
<p class="sub">Pintar Main · Bahasa Inggris tingkat 3–4 · 12 komik</p>
<table class="isian"><tr><td>Nama guru</td><td></td></tr><tr><td>Sekolah</td><td></td></tr><tr><td>Tanggal periksa</td><td></td></tr></table>
<div class="kotak"><p><b>Terima kasih sudah membantu memeriksa.</b> Komik ini dibaca anak kelas 3–6 di aplikasi. Semua naskah masih berstatus <b>belum diperiksa</b>.</p>
<p><b>Cara memeriksa:</b></p>
<ol>
<li>Baca setiap gelembung. Centang <b>☐ Benar</b> kalau Bahasa Inggris dan artinya sudah tepat dan wajar untuk anak.</li>
<li>Kalau ada yang perlu diubah, tulis usulan di kolom <b>Catatan</b>. Contoh: <i>"lebih wajar: It was me."</i></li>
<li>Periksa juga: tips bunyi, kunci Cek Paham, dan apakah pesan akhlaknya terasa menggurui.</li>
<li>Isi lembar <b>Ringkasan</b> di halaman terakhir, lalu kirim foto atau berkasnya ke Acut.</li>
</ol>
<p class="kecil">Gambar panel masih <b>sementara</b> (akan diganti gambar dari desainer). Teks gelembung ditulis aplikasi di atas gambar, tidak ada di dalam gambar. Yang dinilai adalah naskahnya, bukan gambarnya.</p></div>
<div class="kotak hijau"><p><b>Aturan naskah yang dipakai:</b> tingkat 3 berisi 4–5 panel dan paling banyak 6 kata per gelembung; tingkat 4 berisi 5–6 panel dan paling banyak 8 kata. Paling banyak 2 kata di luar daftar kata unit. Tanpa isi agama, tanpa adegan menakutkan atau kekerasan. Suara contoh di aplikasi memakai logat Amerika (en-US).</p></div>
<h3>Tokoh</h3>
<ul class="tokoh">${PAKET_TOKOH.tokoh
    .filter((t) => t.peran !== 'narator')
    .map((t) => `<li><b>${esc(t.nama)}</b>: ${esc(t.sifat)}</li>`)
    .join('')}</ul>
</section>`);

  for (const k of semuaKomik) {
    const unit = PAKET_INGGRIS[k.tingkat].unit.find((u) => u.id === k.unit);
    const gel = (gid: string) => k.panel.flatMap((x) => x.gelembung).find((x) => x.id === gid);
    b.push(`<section class="komik">
<div class="kepala"><span class="kode">${k.id.replace('-komik', '').toUpperCase()}</span><h2>${esc(teksTokoh(k.judul))}</h2></div>
<p class="sub">Tingkat ${k.tingkat} · Unit ${unit?.nomor}: ${esc(unit?.tema ?? '')} · Kata target: <b>${esc(k.kataTarget.join(', '))}</b>${unit?.kataKomik?.length ? ` · Kata baru dari komik: ${esc(unit.kataKomik.map((x) => `${x.kata} (${x.arti})`).join(', '))}` : ''}</p>`);
    for (const p of k.panel) {
      b.push(`<div class="panel"><div class="gambar">${gambar.has(p.id) ? `<img src="${gambar.get(p.id)}">` : ''}<p class="no">Panel ${p.nomor}</p></div><div class="isi">
<p class="adegan">${esc(teksTokoh(p.adegan))}</p>
<table class="gel"><tr><th>Tokoh</th><th>Bahasa Inggris</th><th>Arti</th><th class="c">Benar</th><th>Catatan</th></tr>
${p.gelembung.map((g) => `<tr><td>${esc(nama(g.tokoh))}</td><td class="en">${esc(teksTokoh(g.teks))}</td><td>${esc(teksTokoh(g.arti))}</td><td class="c">☐</td><td class="kosong"></td></tr>`).join('')}
</table>
<p class="kecil"><b>Tips bunyi:</b> ${esc(p.tipsBunyi.join(' '))} ☐ benar &nbsp; <b>Kata bantu:</b> ${esc(p.kataBantu.map(teksTokoh).join(', '))}</p>
</div></div>`);
    }
    b.push('<div class="bawah"><h3>Cek Paham (kunci ditebalkan)</h3><table class="cek"><tr><th>Soal</th><th>Kunci</th><th class="c">Benar</th><th>Catatan</th></tr>');
    for (const s of k.cekPaham) {
      let soal = '';
      let kunci = '';
      if (s.jenis === 'urutkan') {
        soal = 'Urutkan panel';
        kunci = s.panel.map((x) => x.split('-p')[1]).join(' → ');
      } else if (s.jenis === 'siapa') {
        soal = `Siapa yang bilang <i>${esc(teksTokoh(gel(s.gelembung)?.teks ?? ''))}</i>? (${s.pilihan.map(nama).join(' / ')})`;
        kunci = nama(s.kunci);
      } else if (s.jenis === 'dengar_panel') {
        soal = `Dengar <i>${esc(teksTokoh(gel(s.gelembung)?.teks ?? ''))}</i>, pilih panel (${s.pilihan.map((x) => x.split('-p')[1]).join(' / ')})`;
        kunci = `panel ${s.kunci.split('-p')[1]}`;
      } else {
        soal = `Lengkapi <i>${esc(teksTokoh(gel(s.gelembung)?.teks ?? ''))}</i> (${s.pilihan.join(' / ')})`;
        kunci = s.kataHilang;
      }
      b.push(`<tr><td>${soal}</td><td><b>${esc(kunci)}</b></td><td class="c">☐</td><td class="kosong"></td></tr>`);
    }
    b.push('</table>');
    b.push(`<table class="akhlak">
<tr><td>Pesan akhlak</td><td>${esc(teksTokoh(k.pesanAkhlak))}</td><td class="c">☐ tidak menggurui</td></tr>
<tr><td>Pesan Hari Ini</td><td><i>${esc(teksTokoh(k.pesanHariIni.inggris))}</i> = ${esc(teksTokoh(k.pesanHariIni.arti))}</td><td class="c">☐ benar</td></tr>
<tr><td>Renungan (orang tua)</td><td>${esc(teksTokoh(k.naskahOrangTua.renungan))}</td><td class="c">☐ sesuai</td></tr>
<tr><td>Perbuatan baik</td><td>${esc(teksTokoh(k.perbuatanBaik))}</td><td class="c">☐ sesuai</td></tr>
</table>
<p class="kecil"><b>Penilaian komik ini:</b> ☐ Siap dipakai &nbsp; ☐ Siap setelah perbaikan kecil &nbsp; ☐ Perlu ditulis ulang</p>
<div class="catatan">Catatan lain:</div></div></section>`);
  }

  // Bunyi Hari Ini tingkat 3–4
  b.push('<section class="komik"><h2>Bunyi Hari Ini (tingkat 3–4)</h2><p class="sub">Satu bunyi per unit, ditampilkan sebelum pola kalimat. Periksa contoh kata dan tipsnya.</p><table class="cek"><tr><th>Unit</th><th>Bunyi</th><th>Kata contoh</th><th>Tips</th><th class="c">Benar</th><th>Catatan</th></tr>');
  for (const t of [3, 4] as const) {
    for (const u of PAKET_INGGRIS[t].unit) {
      if (!u.bunyiHariIni) continue;
      b.push(`<tr><td>${u.id}</td><td>${esc(u.bunyiHariIni.bunyi)}</td><td>${esc(u.bunyiHariIni.kata.join(', '))}</td><td>${esc(u.bunyiHariIni.tips)}</td><td class="c">☐</td><td class="kosong"></td></tr>`);
    }
  }
  b.push('</table></section>');

  // Ringkasan
  b.push(`<section class="komik"><h2>Ringkasan untuk Acut</h2>
<table class="cek"><tr><th>Komik</th><th>Judul</th><th class="c">Siap</th><th class="c">Perbaikan kecil</th><th class="c">Tulis ulang</th></tr>
${semuaKomik.map((k) => `<tr><td>${k.id.replace('-komik', '').toUpperCase()}</td><td>${esc(teksTokoh(k.judul))}</td><td class="c">☐</td><td class="c">☐</td><td class="c">☐</td></tr>`).join('')}</table>
<p><b>Apakah tingkat kesulitan cocok?</b> Tingkat 3: ☐ mudah ☐ pas ☐ sulit &nbsp; Tingkat 4: ☐ mudah ☐ pas ☐ sulit</p>
<p><b>Apakah ada kata atau adegan yang kurang pantas untuk anak SD di Aceh?</b></p><div class="catatan tinggi"></div>
<p><b>Saran umum:</b></p><div class="catatan tinggi"></div>
<table class="isian ttd"><tr><td>Tanda tangan guru</td><td></td></tr><tr><td>Nama jelas</td><td></td></tr></table>
</section>`);

  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Lembar Periksa Cerita Komik</title><style>
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf); }
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf); font-weight: 700; }
@font-face { font-family: Andika; src: url(../../node_modules/@expo-google-fonts/andika/400Regular/Andika_400Regular.ttf); }
@page { size: A4; margin: 12mm 12mm 14mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Nunito, sans-serif; font-size: 9.5pt; line-height: 1.35; color: #2D3142; }
section { break-before: page; } section.sampul { break-before: auto; }
h1 { color: #6B4423; font-size: 24pt; margin: 0 0 1mm; } h2 { color: #6B4423; font-size: 16pt; margin: 0; }
h3 { color: #1F7A4D; font-size: 11pt; margin: 3mm 0 1.5mm; }
p { margin: 0 0 1.5mm; } ol, ul { margin: 0 0 2mm; padding-left: 5mm; }
.sub { color: #5B6072; font-size: 9pt; margin-bottom: 3mm; }
.kecil { font-size: 8.5pt; color: #5B6072; }
.kotak { background: #FFF6E5; border-left: 4px solid #FF9F1C; padding: 3mm; margin: 3mm 0; } .kotak.hijau { background: #E4F4EB; border-color: #3BB273; }
.kepala { display: flex; align-items: center; gap: 3mm; } .kode { background: #FF9F1C; color: #fff; font-weight: 700; border-radius: 3px; padding: 1mm 2mm; }
.panel { display: flex; gap: 3mm; border: 1px solid #E6E9F0; border-radius: 4px; padding: 2mm; margin-bottom: 2.5mm; break-inside: avoid; }
.gambar { width: 34mm; flex: none; } .gambar img { width: 34mm; height: 34mm; border-radius: 3px; } .no { font-weight: 700; color: #B86E00; text-align: center; margin: 1mm 0 0; }
.isi { flex: 1; } .adegan { font-size: 8.5pt; color: #5B6072; font-style: italic; }
table { width: 100%; border-collapse: collapse; margin-bottom: 1.5mm; } th, td { border: 1px solid #D5D9E2; padding: 1mm 1.5mm; text-align: left; vertical-align: top; }
th { background: #F3F5F9; font-size: 8.5pt; } .c { text-align: center; white-space: nowrap; width: 12mm; }
td.en { font-family: Andika, sans-serif; font-size: 10.5pt; } td.kosong { width: 38mm; }
.bawah { break-inside: avoid; } .akhlak td:first-child { width: 30mm; font-weight: 700; } .akhlak td.c { width: 28mm; }
.catatan { border: 1px solid #D5D9E2; border-radius: 3px; min-height: 14mm; padding: 1.5mm; color: #868C9E; font-size: 8.5pt; margin-bottom: 2mm; } .catatan.tinggi { min-height: 28mm; }
.isian td:first-child { width: 40mm; font-weight: 700; } .isian td { height: 8mm; } .ttd td { height: 14mm; }
.tokoh li { margin-bottom: 1mm; }
</style></head><body>${b.join('\n')}</body></html>`;

  const berkasHtml = path.join(keluar, 'lembar-periksa-komik-guru.html');
  fs.writeFileSync(berkasHtml, html, 'utf8');
  const cetak = await peramban.newPage();
  await cetak.goto('file://' + berkasHtml);
  await cetak.waitForTimeout(800);
  await cetak.pdf({ path: path.join(keluar, 'Lembar-Periksa-Komik-Guru.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await peramban.close();
  console.log('Tersimpan: docs/periksa-isi/Lembar-Periksa-Komik-Guru.pdf');
}

void main();
