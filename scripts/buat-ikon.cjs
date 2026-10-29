const { chromium } = require('playwright');
const kepala = (isi, garis, mata) => `
<ellipse cx="30" cy="28" rx="16" ry="22" fill="${isi}" stroke="${garis}" stroke-width="3"/>
<ellipse cx="90" cy="28" rx="16" ry="22" fill="${isi}" stroke="${garis}" stroke-width="3"/>
<circle cx="60" cy="68" r="46" fill="${isi}" stroke="${garis}" stroke-width="3"/>
<circle cx="46" cy="64" r="10" fill="${mata}"/><circle cx="74" cy="64" r="10" fill="${mata}"/>
<circle cx="48.5" cy="61.5" r="3" fill="#FFFFFF"/><circle cx="76.5" cy="61.5" r="3" fill="#FFFFFF"/>
<path d="M46 88 Q60 100 74 88" stroke="${mata}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const svg = (ukuran, latar, isiKepala, skala) => `<svg xmlns="http://www.w3.org/2000/svg" width="${ukuran}" height="${ukuran}" viewBox="0 0 120 120">
${latar ? `<rect width="120" height="120" fill="${latar}"/>` : ''}
<g transform="translate(${60 - 60 * skala} ${62 - 62 * skala}) scale(${skala})">${isiKepala}</g></svg>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const simpan = async (berkas, s, ukuran, transparan) => {
    await p.setViewportSize({ width: ukuran, height: ukuran });
    await p.setContent(`<html><body style="margin:0;background:transparent">${s}</body></html>`);
    await p.screenshot({ path: berkas, omitBackground: transparan });
  };
  const dir = process.argv[2];
  await simpan(`${dir}/ikon.png`, svg(1024, '#3BB273', kepala('#FFF6E5', '#FFFFFF', '#2D3142'), 0.7), 1024, false);
  await simpan(`${dir}/ikon-depan.png`, svg(1024, null, kepala('#FFF6E5', '#FFFFFF', '#2D3142'), 0.5), 1024, true);
  await simpan(`${dir}/pembuka.png`, svg(512, null, kepala('#A0673A', '#6B4423', '#2D3142'), 0.9), 512, true);
  await b.close();
})();
