// Membuat PDF cetak biru dari docs/rancangan/08-model-usaha/cetak-biru.html (ukuran layar HP).
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const dir = path.join(process.cwd(), 'docs', 'rancangan', '08-model-usaha');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, 'cetak-biru.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(dir, 'Cetak-Biru-Pintar-Main.pdf'),
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;font-size:7px;color:#868C9E;text-align:center;font-family:sans-serif">Cetak Biru Pintar Main · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
  });
  await browser.close();
})();
