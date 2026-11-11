/**
 * Tangkapan layar Mode Dampingi baru dan kartu benda (360 × 800), PROMPT-LANJUTAN-KOMIK tahap 8:
 * D10 Ceritakan Lagi, D11 Dengar Bedanya, Izin 8, Tebak Gerak, rapor, dan kartu ilmu "Coba dengan benda".
 *
 *   EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist
 *   node scripts/sajikan-web.cjs dist 8081 &
 *   node scripts/tangkap-dampingi.cjs
 *
 * Disimpan di docs/tangkapan/komik/. Mode lokal (tanpa server, jalan tanpa sinyal).
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
  p.on('dialog', (d) => d.accept());
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
    if (m.type() === 'error' && !/Failed to load resource|net::ERR|NotAllowedError|getUserMedia|NotFoundError|Requested device/.test(m.text())) galat.push(`console: ${m.text().slice(0, 200)}`);
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
  const foto = async (nama, ms = 900, penuh = false) => {
    await tunggu(ms);
    await p.screenshot({ path: path.join(KELUAR, `${nama}.png`), fullPage: penuh });
    console.log('✓', nama);
  };
  const pin = async (tujuan) => {
    await p.goto(`${DASAR}/ortu/pin?tujuan=${encodeURIComponent(tujuan)}`);
    await tunggu(1500);
    for (const d of '1234') await ketuk(d);
    await tunggu(1500);
  };

  await p.goto(DASAR + '/');
  await tunggu(2500);
  await teks('Saya orang tua');
  for (const d of '12341234') await ketuk(d);
  await tunggu(900);
  await p.getByLabel('Nama panggilan anak').fill('Rani');
  await ketuk('Kelas 6');
  await ketuk('Kucing');
  await teks('Simpan profil');
  await tunggu(800);
  await p.evaluate(() => {
    const k = 'pintar-main-v1';
    const d = JSON.parse(localStorage.getItem(k));
    for (const a of Object.values(d.anak)) a.tingkatInggris = 3;
    localStorage.setItem(k, JSON.stringify(d));
  });

  // Izin 8: bawaan mati, lalu dinyalakan
  await pin('/ortu/rekaman');
  await foto('20-izin8-mati', 900, true);
  await p.getByRole('switch').first().click();
  await tunggu(800);
  await foto('21-izin8-nyala');

  // Menu Dampingi dan D10 Ceritakan Lagi
  await pin('/dampingi');
  await foto('22-menu-dampingi', 900, true);
  await teks('Ceritakan Lagi', 'first');
  await foto('23-ceritakan-pilih');
  await teks('Hello, Robi!', 'first');
  await foto('24-ceritakan-panel', 1200);
  await teks('Sembunyikan', 'first').catch(() => undefined);
  for (let i = 0; i < 6; i++) {
    const b = p.getByText('Berikutnya', { exact: true });
    if (!(await b.count())) break;
    await b.last().click();
    await tunggu(400);
  }
  await foto('25-ceritakan-panel-akhir', 900, true);
  await teks('Selesai bercerita');
  await ketuk('Menyebut tokoh');
  await ketuk('Berani bercerita sampai selesai');
  await ketuk('hello').catch(() => undefined);
  await foto('26-ceritakan-centang', 900, true);
  await teks('Lanjut');
  await foto('27-ceritakan-renungan');
  await teks('Selesai');
  await foto('28-ceritakan-selesai', 1200);

  // D11 Dengar Bedanya (Izin 8 menyala)
  await pin('/dampingi/dengar');
  await teks('Hello, Robi!', 'first');
  await foto('29-dengar-bedanya', 1200, true);

  // Tebak Gerak
  await pin('/dampingi/gerak');
  await foto('30-tebak-gerak', 1500);

  // Rapor dengan kalimat Bahasa Inggris
  await pin('/ortu/rapor');
  await foto('31-rapor-inggris', 1200, true);

  // Kartu ilmu kelas 6: Coba dengan benda
  await p.goto(DASAR + '/profil');
  await tunggu(1500);
  await teks('Rani', 'first');
  await tunggu(1200);
  await p.goto(`${DASAR}/gudang/mat6-kali-pecahan`);
  await tunggu(2000);
  for (let i = 0; i < 6; i++) {
    const b = p.getByText('Lanjut', { exact: true });
    if (!(await b.count()) || (await p.getByText('1 Benda', { exact: true }).count())) break;
    await b.last().click();
    await tunggu(500);
  }
  await foto('32-benda-potongan', 900);
  for (let i = 1; i <= 3; i++) await ketuk(`Potong ke-${i} dari 4`);
  await foto('33-benda-pas', 600);
  await teks('Lanjut: gambar');
  await foto('34-benda-gambar-batang');
  await teks('Lanjut: angka');
  await foto('35-benda-angka');
  await p.goto(`${DASAR}/gudang/mat6-urutan-hitung`);
  await tunggu(2000);
  for (let i = 0; i < 6; i++) {
    if (await p.getByText('1 Benda', { exact: true }).count()) break;
    await p.getByText('Lanjut', { exact: true }).last().click();
    await tunggu(500);
  }
  await ketuk('Ambil uang 5.000');
  await ketuk('Ambil uang 2.000');
  await ketuk('Ambil uang 2.000');
  await foto('36-benda-uang', 600, true);

  console.log(galat.length ? `GALAT:\n${galat.join('\n')}` : 'tanpa galat halaman');
  console.log(keLuar.length ? `Permintaan ke luar (diblokir): ${[...new Set(keLuar)].join(', ')}` : 'tanpa permintaan ke luar: jalan penuh tanpa sinyal');
  await peramban.close();
})();
