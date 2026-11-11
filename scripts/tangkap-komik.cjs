/**
 * Tangkapan layar Cerita Komik dan unit Bahasa Inggris bentuk baru (360 × 800), untuk PROMPT-LANJUTAN-KOMIK tahap 8.
 *
 *   EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist
 *   node scripts/sajikan-web.cjs dist 8081 &
 *   node scripts/tangkap-komik.cjs
 *
 * Disimpan di docs/tangkapan/komik/. Mode lokal (tanpa server), jalan tanpa sinyal.
 */
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const DASAR = process.env.ALAMAT || 'http://localhost:8081';
const KELUAR = path.join(process.cwd(), 'docs', 'tangkapan', 'komik');
fs.mkdirSync(KELUAR, { recursive: true });

(async () => {
  const peramban = await chromium.launch();
  const konteks = await peramban.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 });
  const p = await konteks.newPage();
  const galat = [];
  // Uji tanpa sinyal: semua permintaan ke luar server lokal diblokir dan dicatat.
  const keLuar = [];
  await p.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.host === new URL(DASAR).host || u.protocol === 'data:' || u.protocol === 'blob:') return r.continue();
    keLuar.push(u.host);
    return r.abort();
  });
  p.on('pageerror', (e) => galat.push(`pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) galat.push(`console: ${m.text().slice(0, 200)}`);
  });
  const tunggu = (ms = 600) => p.waitForTimeout(ms);
  const ketuk = async (label, urutan = 'first') => {
    await p.getByLabel(label, { exact: true })[urutan]().click();
    await tunggu(250);
  };
  const teks = async (t, urutan = 'last') => {
    await p.getByText(t, { exact: true })[urutan]().click();
    await tunggu(700);
  };
  const foto = async (nama, ms = 900) => {
    await tunggu(ms);
    await p.screenshot({ path: path.join(KELUAR, `${nama}.png`) });
    console.log('✓', nama);
  };
  const ubahData = async (kode) => {
    await p.evaluate((k) => {
      const kunci = 'pintar-main-v1';
      const d = JSON.parse(localStorage.getItem(kunci));
      new Function('d', k)(d);
      localStorage.setItem(kunci, JSON.stringify(d));
    }, kode);
  };

  await p.goto(DASAR + '/');
  await tunggu(2500);
  await teks('Saya orang tua');
  for (const d of '12341234') await ketuk(d);
  await tunggu(900);
  await p.getByLabel('Nama panggilan anak').fill(process.env.KELAS === '2' ? 'Nisa' : 'Rani');
  await ketuk(`Kelas ${process.env.KELAS || '4'}`);
  await ketuk('Kucing');
  await teks('Simpan profil');
  await tunggu(800);
  await ubahData(`for (const a of Object.values(d.anak)) a.tingkatInggris = Number(${JSON.stringify(process.env.TINGKAT || '3')});`);
  await p.goto(DASAR + '/profil');
  await tunggu(1500);
  await teks(process.env.KELAS === '2' ? 'Nisa' : 'Rani', 'first');
  await tunggu(1200);

  const unit = process.env.UNIT || 't3-u01';
  await p.goto(`${DASAR}/inggris/${unit}`);
  await tunggu(2000);
  await foto('1-kenal-kata');
  const tirukan = p.getByLabel(/^Tirukan gerakan/).first();
  if (await tirukan.count()) {
    await tirukan.click();
    await foto('1b-gerak-pinci', 700);
  }
  await teks('Lanjut: Bunyi Hari Ini');
  await foto('2-bunyi-hari-ini');
  await teks('Lanjut: pola kalimat');
  await foto('3-pola-kalimat');
  await teks('Lanjut: Cerita Komik');
  await foto('4-komik-tonton', 2500);
  await teks('Lanjut: baca');
  await tunggu(800);
  // ketuk satu kata untuk arti
  const kata = p.getByText(/^(Hello!|One,|How|Touch|Rice,|Look)/).first();
  if (await kata.count()) await kata.click();
  await foto('5-komik-baca');
  await teks('Artinya?');
  await foto('6-komik-arti');
  // geser ke panel terakhir dan selesai
  for (let i = 0; i < 6; i++) {
    const b = p.getByText('Panel berikut', { exact: true });
    if (!(await b.count())) break;
    await b.last().click();
    await tunggu(500);
  }
  await foto('7-komik-panel-akhir');
  await teks('Selesai membaca');
  await foto('8-pesan-hari-ini', 1200);
  await teks('Lanjut');
  await foto('9-sesi-a-selesai');
  await teks('Lanjut ke Sesi B');
  await tunggu(1500);
  await foto('10-cek-paham-urutkan', 1200);

  console.log(galat.length ? `GALAT:\n${galat.join('\n')}` : 'tanpa galat halaman');
  console.log(keLuar.length ? `Permintaan ke luar (diblokir): ${[...new Set(keLuar)].join(', ')}` : 'tanpa permintaan ke luar: jalan penuh tanpa sinyal');
  await peramban.close();
})();
