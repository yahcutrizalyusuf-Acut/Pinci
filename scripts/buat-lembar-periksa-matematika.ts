/**
 * Lembar periksa soal Matematika kelas 6 (Gudang Ilmu) untuk guru, bisa dicetak A4.
 * Isi per kartu: penjelasan singkat, contoh jadi, "Coba dengan benda" (benda → gambar → angka), semua soal dengan kunci,
 * soal cerita berlatar Aceh (baru, kunci dihitung kode) dengan model batangnya, dan pancingan orang tua.
 *
 *   npx tsx scripts/buat-lembar-periksa-matematika.ts
 * Hasil: docs/periksa-isi/Lembar-Periksa-Matematika-Kelas-6.pdf
 */
import * as fs from 'fs';
import * as path from 'path';

import { tandaGaris, tulisTanda } from '../src/isi/gudang/benda';
import type { BendaInteraktif, GambarSederhana, GarisBilanganData, ModelBatangData } from '../src/isi/gudang/jenis';
import { paketGudang } from '../src/isi/gudang/paket';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const akar = path.join(__dirname, '..');
const keluar = path.join(akar, 'docs', 'periksa-isi');
fs.mkdirSync(keluar, { recursive: true });

const WARNA = ['#CDEFD9', '#D6ECFA', '#FFE1C7', '#E6DCF7', '#FBDCE6'];

function tulisNilai(m: ModelBatangData, n: number): string {
  if (m.penyebut) {
    const f = (x: number, y: number): number => (y ? f(y, x % y) : x);
    const g = f(Math.round(n), m.penyebut);
    const a = Math.round(n) / g;
    const b = m.penyebut / g;
    return b === 1 ? String(a) : `${a}/${b}`;
  }
  return `${m.depan ?? ''}${n.toLocaleString('id-ID')}${m.satuan ? ` ${m.satuan}` : ''}`;
}

/** Model batang sebagai HTML (lebar ruas sebanding nilai). */
function batangHtml(m: ModelBatangData): string {
  const total = Math.max(...m.baris.map((b) => b.ruas.reduce((a, s) => a + s.nilai, 0)), m.keseluruhan?.nilai ?? 0);
  const label = m.baris.some((b) => b.label);
  const h: string[] = ['<div class="batang">'];
  if (m.keseluruhan) h.push(`<div class="baris">${label ? '<span class="lb"></span>' : ''}<div class="kurung" style="width:${(m.keseluruhan.nilai / total) * 100}%">${m.keseluruhan.dicari ? '?' : esc(m.keseluruhan.label ?? tulisNilai(m, m.keseluruhan.nilai))}</div></div>`);
  m.baris.forEach((b, bi) => {
    h.push(`<div class="baris">${label ? `<span class="lb">${esc(b.label ?? '')}</span>` : ''}<div class="ruas-wadah">`);
    b.ruas.forEach((s, si) => h.push(`<div class="ruas${s.dicari ? ' dicari' : ''}" style="width:${(s.nilai / total) * 100}%;background:${s.dicari ? '#FFF0D9' : WARNA[(bi * 2 + si) % WARNA.length]}">${s.dicari ? '?' : esc(s.label ?? tulisNilai(m, s.nilai))}</div>`));
    h.push('</div></div>');
  });
  h.push('</div>');
  return h.join('');
}

function garisHtml(g: GarisBilanganData): string {
  const t = tandaGaris(g).map((n) => tulisTanda(n, g.penyebut)).join(' · ');
  const l = g.lompatan?.length ? ` · ${g.lompatan.length} lompatan` : '';
  const p = g.titik?.length ? ` · titik: ${g.titik.map((x) => x.label ?? tulisTanda(x.nilai, g.penyebut)).join(', ')}` : '';
  return `<p class="kecil">Garis bilangan: ${esc(t)}${g.satuan ? ` (${esc(g.satuan)})` : ''}${esc(l)}${esc(p)}</p>`;
}

function bendaTeks(b: BendaInteraktif): string {
  if (b.jenis === 'blok') return `Blok puluhan: susun bilangan ${b.target} dari ratusan, puluhan, dan satuan.`;
  if (b.jenis === 'potongan') return `Potongan pecahan (${b.bentuk}, ${b.bagian} potong): warnai ${b.target} potong.`;
  if (b.jenis === 'uang') return `Uang sederhana (pilihan ${b.pilihan.map((x) => x.toLocaleString('id-ID')).join(', ')}): kumpulkan ${b.target.toLocaleString('id-ID')}.`;
  return `Lompat di garis bilangan: lompat ${tulisTanda(b.lompat, b.garis.penyebut)} sampai ${tulisTanda(b.target, b.garis.penyebut)}.`;
}

function gambarTeks(g: GambarSederhana): string {
  if (g.jenis === 'pecahan') return `[gambar pecahan ${g.a}/${g.b}]`;
  if (g.jenis === 'batang') return `[diagram batang: ${g.nilai.map((n, i) => `${g.label?.[i] ?? ''} ${n}`.trim()).join(', ')}]`;
  if (g.jenis === 'petak') return `[petak ${g.baris} × ${g.kolom}, terisi ${g.terisi}]`;
  return `[gambar: ${g.isi}]`;
}

const mat = paketGudang.mapel.find((m) => m.kode === 'mat');
const topik = (mat?.topik ?? []).filter((t) => t.kartu);
const jumlahSoal = topik.reduce((a, t) => a + (t.kartu?.soal.length ?? 0), 0);
const denganBenda = topik.filter((t) => t.kartu?.cobaBenda).length;

const b: string[] = [];
b.push(`<section class="sampul">
<h1>Lembar Periksa Soal Matematika</h1>
<p class="sub">Pintar Main · Gudang Ilmu kelas 6 · ${topik.length} kartu · ${jumlahSoal} soal · ${denganBenda} langkah "Coba dengan benda"</p>
<table class="isian"><tr><td>Nama guru</td><td></td></tr><tr><td>Sekolah</td><td></td></tr><tr><td>Tanggal periksa</td><td></td></tr></table>
<div class="kotak"><p><b>Terima kasih sudah membantu memeriksa.</b> Semua soal masih berstatus <b>belum diperiksa</b>.</p>
<p><b>Kunci jawaban sudah dihitung ulang oleh komputer</b>, jadi angkanya tidak perlu dihitung lagi. Yang perlu dilihat guru:</p>
<ol>
<li>Bahasa soal: jelas, pendek, dan cocok untuk kelas 6.</li>
<li>Kewajaran cerita dan angka (harga, jarak, waktu) untuk kehidupan di Aceh.</li>
<li>Pilihan jawaban (pengecoh) masuk akal, dan hanya ada satu yang benar.</li>
<li>Petunjuk dan pembahasan membantu anak memahami cara, tidak hanya memberi jawaban.</li>
<li>Langkah "Coba dengan benda" dan model batang cocok dengan soalnya.</li>
</ol>
<p>Centang <b>☐</b> kalau sudah tepat. Kalau perlu diubah, tulis usulan di kolom <b>Catatan</b> beserta nomor soalnya (misalnya <b>mat6-persen-s7</b>).</p></div>
<div class="kotak hijau"><p><b>Tanda <span class="baru">BARU</span></b> = soal cerita berlatar Aceh yang ditambahkan 11 November 2026, satu per kartu. Mohon diperiksa lebih teliti.</p>
<p><b>Urutan di aplikasi:</b> Kenali (penjelasan) → Coba dengan benda (benda → gambar → angka) → 2 contoh jadi → latihan soal dari mudah ke sulit, dengan 3 petunjuk bertahap.</p></div>
</section>`);

for (const t of topik) {
  const k = t.kartu!;
  b.push(`<section class="kartu"><div class="kepala"><span class="kode">${esc(t.id)}</span><h2>${esc(t.judul)}</h2></div>
<p class="sub">${esc(t.ringkas)} · ${k.soal.length} soal · sumber modul ${esc(k.sumber)}</p>
<div class="dua"><div><h3>Penjelasan</h3>${k.penjelasan.map((p) => `<p>${esc(p.teks)}</p>`).join('')}</div>
<div><h3>Contoh jadi</h3>${k.contohJadi.map((c) => `<p><b>${esc(c.soal)}</b><br><span class="kecil">${esc(c.langkah.join(' '))}</span> → <b>${esc(c.jawaban)}</b></p>`).join('')}</div></div>
<p class="kecil">☐ Penjelasan dan contoh jadi sudah tepat</p>`);
  if (k.cobaBenda) {
    const c = k.cobaBenda;
    b.push(`<div class="benda"><h3>Coba dengan benda</h3>
<p><b>1 Benda:</b> ${esc(c.soal)} <i>${esc(c.perintah)}</i><br><span class="kecil">${esc(bendaTeks(c.benda))}</span></p>
<p><b>2 Gambar:</b> ${esc(c.teksGambar)}</p>${c.gambar.jenis === 'batang' ? batangHtml(c.gambar.data) : garisHtml(c.gambar.data)}
<p><b>3 Angka:</b> ${esc(c.kalimat)} &nbsp; <span class="kecil">(jawaban dihitung kode: ${esc(c.jawaban)})</span></p>
<p class="kecil">☐ Langkah benda → gambar → angka sudah tepat &nbsp; Catatan: ____________________________</p></div>`);
  }
  b.push('<h3>Soal latihan</h3><table class="soal"><tr><th>No</th><th>Soal</th><th>Kunci</th><th class="c">✓</th><th>Catatan</th></tr>');
  k.soal.forEach((s, i) => {
    const pilihan = s.pilihan ? `<br><span class="kecil">Pilihan: ${s.pilihan.map((p) => (p === s.kunci ? `<b>${esc(p)}</b>` : esc(p))).join(' · ')}</span>` : '';
    const tambahan = [s.bacaan ? `<i>${esc(s.bacaan)}</i> ` : '', s.gambar ? `<span class="kecil">${esc(gambarTeks(s.gambar))}</span> ` : ''].join('');
    const batang = s.modelBatang ? batangHtml(s.modelBatang) : '';
    const petunjuk = `<br><span class="kecil">Petunjuk: ${s.petunjuk.map((p, n) => `${n + 1}) ${esc(p)}`).join(' ')}<br>Pembahasan: ${esc(s.pembahasan)}</span>`;
    b.push(`<tr${s.cerita ? ' class="cerita"' : ''}><td>${i + 1}<br><span class="kecil">${s.tingkat}</span></td><td>${s.cerita ? '<span class="baru">BARU</span> ' : ''}${tambahan}${esc(s.pertanyaan)}${pilihan}${batang}${petunjuk}</td><td><b>${esc(s.kunci)}</b>${s.hitung ? '<br><span class="kecil">dihitung kode</span>' : ''}</td><td class="c">☐</td><td class="kosong"></td></tr>`);
  });
  b.push('</table>');
  if (k.pancingan) b.push(`<p class="kecil"><b>Pancingan untuk orang tua (Mode Dampingi):</b> ${esc(k.pancingan)} ☐ sesuai</p>`);
  b.push('<p class="kecil"><b>Penilaian kartu:</b> ☐ Siap dipakai &nbsp; ☐ Siap setelah perbaikan kecil &nbsp; ☐ Perlu ditulis ulang</p></section>');
}

b.push(`<section class="kartu"><h2>Ringkasan untuk Acut</h2>
<table class="soal"><tr><th>Kartu</th><th>Judul</th><th class="c">Siap</th><th class="c">Perbaikan kecil</th><th class="c">Tulis ulang</th></tr>
${topik.map((t) => `<tr><td>${esc(t.id)}</td><td>${esc(t.judul)}</td><td class="c">☐</td><td class="c">☐</td><td class="c">☐</td></tr>`).join('')}</table>
<p><b>Apakah tingkat kesulitan cocok untuk kelas 6?</b> ☐ terlalu mudah ☐ pas ☐ terlalu sulit</p>
<p><b>Apakah soal cerita berlatar Aceh terasa wajar (harga, tempat, kegiatan)?</b> ☐ ya ☐ sebagian ☐ tidak</p>
<p><b>Topik yang belum punya "Coba dengan benda"</b> (bangun datar, bangun ruang, sudut, kekongruenan, diagram): usulan benda yang cocok?</p><div class="catatan tinggi"></div>
<p><b>Saran umum:</b></p><div class="catatan tinggi"></div>
<table class="isian ttd"><tr><td>Tanda tangan guru</td><td></td></tr><tr><td>Nama jelas</td><td></td></tr></table></section>`);

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Lembar Periksa Soal Matematika</title><style>
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf); }
@font-face { font-family: Nunito; src: url(../../node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf); font-weight: 700; }
@page { size: A4; margin: 12mm 12mm 14mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Nunito, sans-serif; font-size: 9.3pt; line-height: 1.35; color: #2D3142; }
section { break-before: page; } section.sampul { break-before: auto; }
h1 { color: #1F7A4D; font-size: 24pt; margin: 0 0 1mm; } h2 { color: #1F7A4D; font-size: 15pt; margin: 0; }
h3 { color: #6B4423; font-size: 10.5pt; margin: 2.5mm 0 1mm; }
p { margin: 0 0 1.3mm; } ol { margin: 0 0 2mm; padding-left: 5mm; }
.sub { color: #5B6072; font-size: 9pt; margin-bottom: 2mm; } .kecil { font-size: 8.3pt; color: #5B6072; }
.kotak { background: #FFF6E5; border-left: 4px solid #FF9F1C; padding: 3mm; margin: 3mm 0; } .kotak.hijau { background: #E4F4EB; border-color: #3BB273; }
.kepala { display: flex; align-items: center; gap: 3mm; } .kode { background: #3BB273; color: #fff; font-weight: 700; border-radius: 3px; padding: 1mm 2mm; font-size: 8.5pt; }
.dua { display: flex; gap: 4mm; } .dua > div { flex: 1; }
.benda { border: 1.5px dashed #FF9F1C; border-radius: 4px; padding: 2mm 3mm; margin: 2mm 0; break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin-bottom: 1.5mm; } th, td { border: 1px solid #D5D9E2; padding: 1mm 1.5mm; text-align: left; vertical-align: top; }
th { background: #F3F5F9; font-size: 8.5pt; } tr { break-inside: avoid; } .c { text-align: center; width: 8mm; } td.kosong { width: 34mm; }
.soal td:first-child { width: 9mm; text-align: center; } .soal td:nth-child(3) { width: 20mm; }
tr.cerita td { background: #FFFBF2; } .baru { background: #FF9F1C; color: #fff; font-weight: 700; font-size: 7.5pt; border-radius: 2px; padding: 0 1.2mm; }
.batang { margin: 1.5mm 0; max-width: 110mm; } .baris { display: flex; align-items: center; margin-bottom: 1mm; } .lb { width: 16mm; font-size: 8pt; font-weight: 700; flex: none; }
.ruas-wadah { flex: 1; display: flex; } .ruas { border: 1.2px solid #2D3142; margin-left: -1.2px; text-align: center; font-size: 8pt; padding: 1mm 0; font-weight: 700; } .ruas.dicari { border-style: dashed; border-color: #FF9F1C; color: #D97F10; }
.kurung { border: 1.2px solid #2D3142; border-bottom: none; text-align: center; font-size: 8pt; font-weight: 700; height: 4mm; line-height: 1; }
.catatan { border: 1px solid #D5D9E2; border-radius: 3px; min-height: 14mm; margin-bottom: 2mm; } .catatan.tinggi { min-height: 26mm; }
.isian td:first-child { width: 40mm; font-weight: 700; } .isian td { height: 8mm; } .ttd td { height: 14mm; }
</style></head><body>${b.join('\n')}</body></html>`;

const berkasHtml = path.join(keluar, 'lembar-periksa-matematika-kelas-6.html');
fs.writeFileSync(berkasHtml, html, 'utf8');

(async () => {
  const namaModul = 'playwright';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { chromium } = require(namaModul) as { chromium: { launch: () => Promise<any> } };
  const peramban = await chromium.launch();
  const hal = await peramban.newPage();
  await hal.goto('file://' + berkasHtml);
  await hal.waitForTimeout(800);
  await hal.pdf({ path: path.join(keluar, 'Lembar-Periksa-Matematika-Kelas-6.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await peramban.close();
  fs.unlinkSync(berkasHtml);
  console.log('Tersimpan: docs/periksa-isi/Lembar-Periksa-Matematika-Kelas-6.pdf');
})();
