/**
 * Membuat dua PDF riset dari halaman/riset/sumber.html:
 *   - halaman/unduh/Riset-Belajar-Pintar-Main-HP.pdf      (110 × 196 mm, dibuka dari aplikasi)
 *   - halaman/unduh/Riset-Belajar-Pintar-Main-Laptop.pdf  (A4, diunduh dari website)
 *
 *   node scripts/buat-riset-pdf.cjs
 */
const path = require('path');
const fs = require('fs');

const akar = path.join(__dirname, '..');
const sumber = path.join(akar, 'halaman', 'riset', 'sumber.html');
const keluar = path.join(akar, 'halaman', 'unduh');
fs.mkdirSync(keluar, { recursive: true });

const UKURAN = {
  hp: { css: '110mm 196mm', margin: '8mm 6mm 10mm', berkas: 'Riset-Belajar-Pintar-Main-HP.pdf' },
  laptop: { css: 'A4', margin: '14mm 16mm 16mm', berkas: 'Riset-Belajar-Pintar-Main-Laptop.pdf' },
};

(async () => {
  const namaModul = 'playwright';
  const { chromium } = require(namaModul);
  const peramban = await chromium.launch();
  for (const [jenis, u] of Object.entries(UKURAN)) {
    const hal = await peramban.newPage();
    await hal.goto('file://' + sumber);
    await hal.evaluate(
      ({ jenis, css, margin }) => {
        document.body.className = jenis;
        const s = document.createElement('style');
        s.textContent = `@page { size: ${css}; margin: ${margin}; }`;
        document.head.appendChild(s);
      },
      { jenis, css: u.css, margin: u.margin },
    );
    await hal.evaluate(() => document.fonts.ready);
    await hal.pdf({
      path: path.join(keluar, u.berkas),
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate:
        '<div style="width:100%;font-size:7px;color:#868C9E;text-align:center;font-family:sans-serif">Pintar Main · Cara Belajar yang Menyenangkan · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
    });
    await hal.close();
    console.log('Tersimpan:', u.berkas);
  }
  await peramban.close();
})();
