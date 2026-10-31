/**
 * Uji menyeluruh hubungkan HP anak lewat browser: dua "HP" (orang tua dan anak) bicara ke server tiruan.
 *
 *   node scripts/server-tiruan.cjs &                       # port 9999
 *   EXPO_PUBLIC_DATA_MODE=supabase EXPO_PUBLIC_SUPABASE_URL=http://localhost:9999 EXPO_PUBLIC_SUPABASE_ANON_KEY=anon \
 *     EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist-uji
 *   node scripts/sajikan-web.cjs dist-uji 8082 &
 *   node scripts/uji-hubungkan.cjs
 *
 * Tangkapan layar disimpan di KELUAR (bawaan docs/tangkapan/hubungkan).
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const D = process.env.ALAMAT || 'http://localhost:8082';
const KELUAR = process.env.KELUAR || path.join(process.cwd(), 'docs', 'tangkapan', 'hubungkan');
fs.mkdirSync(KELUAR, { recursive: true });

let gagal = 0;
const cek = (kondisi, pesan) => {
  console.log(kondisi ? '✓' : '✗', pesan);
  if (!kondisi) gagal++;
};

async function telepon(peramban) {
  const c = await peramban.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, timezoneId: 'Asia/Jakarta' });
  const p = await c.newPage();
  const galat = [];
  p.on('pageerror', (e) => galat.push(`pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) galat.push(`console: ${m.text().slice(0, 160)}`);
  });
  return { p, galat };
}

(async () => {
  const peramban = await chromium.launch();
  const ortu = await telepon(peramban);
  const anak = await telepon(peramban);
  const t = (ms = 700) => new Promise((r) => setTimeout(r, ms));
  const foto = async (hp, nama) => {
    await t(500);
    await hp.p.screenshot({ path: path.join(KELUAR, `${nama}.png`) });
  };
  const ketuk = async (hp, label) => {
    await hp.p.getByLabel(label, { exact: true }).first().click();
    await t(200);
  };
  const teks = async (hp, label) => {
    await hp.p.getByText(label, { exact: true }).last().click();
    await t(700);
  };
  const ada = async (hp, label) => (await hp.p.getByText(label, { exact: false }).count()) > 0;
  const lokal = (hp) => hp.p.evaluate(() => JSON.parse(localStorage.getItem('pintar-main-v1') || '{}'));

  // ---------- HP orang tua: masuk, PIN, anak ----------
  await ortu.p.goto(D + '/');
  await t(2500);
  await teks(ortu, 'Saya orang tua');
  await ortu.p.getByLabel('Alamat email').fill('ibu@contoh.id');
  await ketuk(ortu, 'Kirim kode');
  await ortu.p.getByLabel('Kode 6 angka').fill('123456');
  await ketuk(ortu, 'Masuk');
  await t(1500);
  for (const d of '12341234') await ketuk(ortu, d);
  await t(1200);
  await ortu.p.getByLabel('Nama panggilan anak').fill('Rani');
  await ketuk(ortu, 'Kelas 6');
  await ketuk(ortu, 'Kucing');
  await teks(ortu, 'Simpan profil');
  await t(1500);
  cek((await lokal(ortu)).anak && Object.keys((await lokal(ortu)).anak).length === 1, 'orang tua: profil Rani tersimpan');

  // ---------- Atur → Hubungkan HP anak → kode ----------
  await ortu.p.goto(D + '/ortu/pin');
  await t(1500);
  for (const d of '1234') await ketuk(ortu, d);
  await t(1200);
  await ortu.p.getByRole('tab', { name: 'Atur' }).click();
  await t(800);
  cek(await ada(ortu, 'Hubungkan HP anak'), 'orang tua: menu Hubungkan HP anak ada di Atur');
  await foto(ortu, '1-atur');
  await teks(ortu, 'Hubungkan HP anak');
  await t(1000);
  await foto(ortu, '2-hubungkan-awal');
  await ketuk(ortu, 'Buat kode');
  await ortu.p.getByLabel(/^Kode \d( \d){5}$/).waitFor({ timeout: 15000 });
  const kode = (await ortu.p.getByLabel(/^Kode \d( \d){5}$/).getAttribute('aria-label')).replace(/\D/g, '');
  cek(/^\d{6}$/.test(kode), `orang tua: kode 6 angka dibuat (${kode})`);
  await foto(ortu, '3-kode');

  // ---------- HP anak: kode salah, lalu benar ----------
  await anak.p.goto(D + '/');
  await t(2500);
  await foto(anak, '4-anak-selamat-datang');
  await teks(anak, 'Ini HP anak');
  await anak.p.getByLabel('Kode 6 angka dari HP orang tua').fill(kode === '000000' ? '111111' : '000000');
  await ketuk(anak, 'Hubungkan');
  await anak.p.getByText(/Kode belum tepat/).waitFor({ timeout: 15000 });
  cek(true, 'anak: kode salah ditolak dengan pesan ramah');
  await foto(anak, '5-anak-kode-salah');
  await anak.p.getByLabel('Kode 6 angka dari HP orang tua').fill(kode);
  await ketuk(anak, 'Hubungkan');
  await anak.p.getByText('Halo, Rani!').waitFor({ timeout: 20000 });
  cek(true, 'anak: terhubung dan langsung melihat profil Rani');
  await foto(anak, '6-anak-beranda');
  const dataAnak = await lokal(anak);
  const kel = Object.values(dataAnak.keluarga)[0];
  cek(kel.hp === 'anak' && kel.pinHash === '', 'anak: keluarga dipasang sebagai HP anak tanpa PIN');

  // kode tidak bisa dipakai dua kali
  const anak2 = await telepon(peramban);
  await anak2.p.goto(D + '/');
  await t(2500);
  await teks(anak2, 'Ini HP anak');
  await anak2.p.getByLabel('Kode 6 angka dari HP orang tua').fill(kode);
  await ketuk(anak2, 'Hubungkan');
  await anak2.p.getByText(/Kode belum tepat/).waitFor({ timeout: 15000 });
  cek(true, 'kode yang sudah dipakai tidak bisa dipakai HP lain');
  const galatAnak2 = [...anak2.galat];
  await anak2.p.context().close();

  // mode orang tua di HP anak diarahkan ke HP orang tua
  await anak.p.getByLabel('Mode orang tua').click();
  await anak.p.getByText('Pengaturan lewat HP orang tua').waitFor({ timeout: 10000 });
  cek(true, 'anak: mode orang tua tidak bisa dibuka di HP anak');
  await foto(anak, '7-anak-tanpa-mode-ortu');
  await anak.p.goto(D + '/anak');
  await t(2000);

  // ---------- anak mengerjakan tes → orang tua melihat ----------
  await teks(anak, 'Lancar Matematika');
  await teks(anak, 'Mulai');
  for (let i = 0; i < 30; i++) {
    if (!(await anak.p.getByLabel('Cek', { exact: true }).count())) break;
    await ketuk(anak, '7');
    await ketuk(anak, 'Cek');
    await t(1800);
  }
  await t(1200);
  const sesiAnak = Object.keys((await lokal(anak)).sesi || {}).length;
  cek(sesiAnak >= 1, `anak: ${sesiAnak} sesi tersimpan di HP anak`);
  await anak.p.goto(D + '/anak'); // buka ulang = sinkron
  await t(3500);

  await ortu.p.goto(D + '/ortu/pin');
  await t(2500);
  for (const d of '1234') await ketuk(ortu, d);
  await t(2500);
  const sesiOrtu = Object.keys((await lokal(ortu)).sesi || {}).length;
  const jawabanOrtu = Object.keys((await lokal(ortu)).jawaban || {}).length;
  cek(sesiOrtu === sesiAnak && jawabanOrtu > 0, `orang tua: menerima ${sesiOrtu} sesi dan ${jawabanOrtu} jawaban dari HP anak`);
  await foto(ortu, '8-ortu-kabar');

  // ---------- orang tua mengirim pesan → anak menerima ----------
  await ortu.p.getByLabel(/^Rani,/).first().click();
  await t(1200);
  await ortu.p.getByLabel('Tulis pesan untuk anak').last().fill('Ayah bangga sama kamu', { timeout: 8000 });
  await ortu.p.getByLabel('Kirim', { exact: true }).last().click();
  await t(1500);
  await anak.p.goto(D + '/anak');
  await t(3500);
  await anak.p.getByText('Ayah bangga sama kamu').first().waitFor({ timeout: 10000 }).catch(() => undefined);
  cek(await ada(anak, 'Ayah bangga sama kamu'), 'anak: menerima pesan dari orang tua');
  await foto(anak, '9-anak-pesan');

  // ---------- daftar HP + putuskan ----------
  await ortu.p.goto(D + '/ortu/pin');
  await t(1500);
  for (const d of '1234') await ketuk(ortu, d);
  await t(1200);
  await ortu.p.getByRole('tab', { name: 'Atur' }).click();
  await t(800);
  await teks(ortu, 'Hubungkan HP anak');
  await t(2000);
  cek(await ada(ortu, 'HP Rani'), 'orang tua: HP Rani terdaftar sebagai terhubung');
  await foto(ortu, '10-daftar-hp');
  await ketuk(ortu, 'Putuskan HP Rani');
  await t(400);
  await teks(ortu, 'Ya, putuskan');
  await t(2000);
  cek(await ada(ortu, 'Sudah diputus.'), 'orang tua: HP Rani berhasil diputus');
  await foto(ortu, '11-diputus');

  await anak.p.goto(D + '/anak');
  await t(4000);
  cek(await ada(anak, 'HP ini tidak lagi terhubung'), 'anak: melihat pemberitahuan HP tidak lagi terhubung');
  await foto(anak, '12-anak-diputus');

  for (const [nama, hp] of [['orang tua', ortu], ['anak', anak], ['anak 2', { galat: galatAnak2 }]]) {
    cek(hp.galat.length === 0, `${nama}: tanpa galat konsol${hp.galat.length ? ' → ' + hp.galat.join(' | ') : ''}`);
  }
  await peramban.close();
  console.log(gagal ? `${gagal} pemeriksaan gagal` : 'Semua pemeriksaan lulus');
  process.exit(gagal ? 1 : 0);
})();
