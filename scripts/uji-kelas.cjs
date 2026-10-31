/**
 * Uji menyeluruh kelas dengan pengawas lewat browser: staf (super admin) dan HP orang tua bicara ke server tiruan.
 *
 *   node scripts/server-tiruan.cjs &                       # port 9999
 *   EXPO_PUBLIC_DATA_MODE=supabase EXPO_PUBLIC_SUPABASE_URL=http://localhost:9999 EXPO_PUBLIC_SUPABASE_ANON_KEY=anon \
 *     EXPO_PUBLIC_TKA_BUKA=mati npx expo export -p web --output-dir dist-uji
 *   node scripts/sajikan-web.cjs dist-uji 8082 &
 *   node scripts/uji-kelas.cjs
 *
 * Tangkapan layar disimpan di KELUAR (bawaan docs/tangkapan/kelas).
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const D = process.env.ALAMAT || 'http://localhost:8082';
const KELUAR = process.env.KELUAR || path.join(process.cwd(), 'docs', 'tangkapan', 'kelas');
fs.mkdirSync(KELUAR, { recursive: true });

let gagal = 0;
const cek = (kondisi, pesan) => {
  console.log(kondisi ? '✓' : '✗', pesan);
  if (!kondisi) gagal++;
};

async function layar(peramban, lebar = 360, tinggi = 800) {
  const c = await peramban.newContext({ viewport: { width: lebar, height: tinggi }, deviceScaleFactor: 2, timezoneId: 'Asia/Jakarta' });
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
  const staf = await layar(peramban);
  const ortu = await layar(peramban);
  const t = (ms = 700) => new Promise((r) => setTimeout(r, ms));
  const foto = async (hp, nama, penuh = false) => {
    await t(500);
    await hp.p.screenshot({ path: path.join(KELUAR, `${nama}.png`), fullPage: penuh });
  };
  const ketuk = async (hp, label) => {
    await hp.p.getByLabel(label, { exact: true }).first().click();
    await t(250);
  };
  const teks = async (hp, label) => {
    await hp.p.getByText(label, { exact: true }).last().click();
    await t(700);
  };
  const ada = async (hp, label) => (await hp.p.getByText(label, { exact: false }).count()) > 0;
  const tunggu = (hp, label, ms = 15000) => hp.p.getByText(label, { exact: false }).first().waitFor({ timeout: ms });

  // ---------- staf: masuk sebagai super admin ----------
  await staf.p.goto(D + '/staf');
  await t(2500);
  await foto(staf, '1-staf-masuk');
  await staf.p.getByLabel('Email').fill('super@contoh.id');
  await ketuk(staf, 'Kirim kode');
  await staf.p.getByLabel('Kode 6 angka').fill('123456');
  await ketuk(staf, 'Masuk');
  await tunggu(staf, 'Acut · Super admin');
  cek(true, 'staf: super admin masuk dengan email dan kode');

  // email yang tidak diundang ditolak
  const asing = await layar(peramban);
  await asing.p.goto(D + '/staf');
  await t(2500);
  await asing.p.getByLabel('Email').fill('orang@contoh.id');
  await ketuk(asing, 'Kirim kode');
  await asing.p.getByLabel('Kode 6 angka').fill('123456');
  await ketuk(asing, 'Masuk');
  await tunggu(asing, 'belum terdaftar sebagai staf');
  cek(true, 'staf: email yang tidak diundang ditolak');
  await asing.p.context().close();

  // ---------- staf: buat kelas, undang pengawas ----------
  await teks(staf, 'Kelola kelas dan staf');
  await t(1500);
  await staf.p.getByLabel('Nama kelas').fill('Kancil');
  await staf.p.getByRole('button', { name: 'Acut', exact: true }).first().click();
  await ketuk(staf, 'Buat kelas');
  await tunggu(staf, 'Kode kelas:');
  const pesanKode = await staf.p.getByText(/Kode kelas: [A-Z0-9]{3} [A-Z0-9]{3}/).first().textContent();
  const kode = /Kode kelas: ([A-Z0-9]{3} [A-Z0-9]{3})/.exec(pesanKode)[1].replace(' ', '');
  cek(/^[A-HJKMNP-Z2-9]{6}$/.test(kode), `staf: kelas dibuat dengan kode ${kode}`);
  await staf.p.getByLabel('Email').fill('nisa@contoh.id');
  await staf.p.getByLabel('Nama panggilan (dilihat orang tua)').fill('Kak Nisa');
  await ketuk(staf, 'Kirim undangan');
  await tunggu(staf, 'Undangan tersimpan');
  cek(true, 'staf: undangan pengawas tersimpan');
  await foto(staf, '2-staf-kelola', true);

  // ---------- orang tua: daftar, lalu masuk kelas dengan kode ----------
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
  await ortu.p.goto(D + '/ortu/pin');
  await t(1500);
  for (const d of '1234') await ketuk(ortu, d);
  await t(1200);
  await ortu.p.getByRole('tab', { name: 'Atur' }).click();
  await t(800);
  cek(await ada(ortu, 'Kelas dan pengawas'), 'orang tua: menu Kelas dan pengawas ada di Atur');
  await teks(ortu, 'Kelas dan pengawas');
  await t(1200);
  await foto(ortu, '3-ortu-kelas-awal');
  await teks(ortu, 'Masukkan kode kelas');
  await ortu.p.getByLabel('Kode kelas').fill('zzz zzz');
  await teks(ortu, 'Lanjut');
  await teks(ortu, 'Lanjut');
  await ketuk(ortu, 'Saya setuju anak saya ikut kelas ini.');
  await teks(ortu, 'Setuju dan mulai');
  await tunggu(ortu, 'Kode kelas tidak ditemukan');
  cek(true, 'orang tua: kode kelas salah ditolak dengan pesan jelas');
  await ortu.p.getByLabel('Kode kelas').fill(kode.toLowerCase());
  await foto(ortu, '4-ortu-kode');
  await teks(ortu, 'Lanjut');
  cek(await ada(ortu, 'Siap TKA'), 'orang tua: paket Siap TKA tersedia untuk kelas 6');
  await foto(ortu, '5-ortu-paket');
  await teks(ortu, 'Lanjut');
  cek((await ortu.p.getByText(/Rp\s?\d/).count()) === 0, 'orang tua: tidak ada harga di layar persetujuan');
  await foto(ortu, '6-ortu-setuju');
  await teks(ortu, 'Setuju dan mulai');
  await tunggu(ortu, 'Masa coba tinggal 14 hari');
  cek(await ada(ortu, 'Kancil'), 'orang tua: Rani masuk kelas Kancil, masa coba 14 hari');
  await foto(ortu, '7-ortu-di-kelas');

  // ---------- pengawas: papan kelas, catatan, tugas, pantauan ----------
  await staf.p.goto(D + '/staf');
  await tunggu(staf, '1 dari 8 anak');
  cek(true, 'staf: kelas berisi 1 anak');
  await teks(staf, 'Kancil');
  await tunggu(staf, 'Rani · Kelas 6');
  cek(await ada(staf, 'Belum latihan 2 hari'), 'papan: Rani ditandai belum latihan');
  await foto(staf, '8-papan-kelas');
  await staf.p.getByLabel('Catatan dan tugas untuk Rani').click();
  await tunggu(staf, 'Catatan untuk orang tua');
  await staf.p.getByText(/^\+ /).first().click();
  await ketuk(staf, 'Kirim catatan');
  await tunggu(staf, 'Catatan terkirim ke orang tua');
  await teks(staf, 'Lancar Matematika');
  await staf.p.getByLabel('Pesan singkat untuk anak (boleh kosong)').fill('Pelan-pelan saja, ya.');
  await ketuk(staf, 'Kirim tugas');
  await tunggu(staf, 'Tugas terkirim');
  cek(await ada(staf, 'belum dibaca'), 'staf: catatan terkirim, belum dibaca');
  await foto(staf, '9-staf-anak', true);
  await staf.p.goBack();
  await t(1500);
  await ketuk(staf, 'Pantauan selesai');
  await tunggu(staf, 'Pantauan hari ini sudah selesai');
  cek(true, 'staf: pantauan hari ini tercatat');

  // ---------- orang tua: catatan di Kabar, tugas di beranda anak ----------
  await ortu.p.goto(D + '/ortu/pin');
  await t(2500);
  for (const d of '1234') await ketuk(ortu, d);
  await tunggu(ortu, 'CATATAN DARI PENGAWAS');
  cek(await ada(ortu, 'Acut ·'), 'orang tua: catatan pengawas tampil di Kabar dengan nama pengawas');
  await foto(ortu, '10-ortu-kabar-catatan');
  await teks(ortu, 'Sudah saya baca');
  await t(2500); // terkirim otomatis 1,5 detik setelah disimpan
  await teks(ortu, 'Serahkan ke anak');
  await t(1200);
  await ortu.p.getByText('Rani', { exact: true }).first().click();
  await tunggu(ortu, 'Tugas dari Kak Pengawas');
  cek(await ada(ortu, 'Pelan-pelan saja, ya.'), 'anak: tugas dari pengawas tampil di beranda dengan pesannya');
  await foto(ortu, '11-anak-tugas');

  // ---------- staf melihat catatan sudah dibaca ----------
  await staf.p.getByLabel('Catatan dan tugas untuk Rani').click();
  await tunggu(staf, 'sudah dibaca orang tua');
  cek(true, 'staf: tanda dibaca dari orang tua sampai');

  // tampilan laptop papan kelas
  const laptop = await layar(peramban, 1100, 760);
  await laptop.p.goto(D + '/staf');
  await t(2500);
  await laptop.p.getByLabel('Email').fill('super@contoh.id');
  await ketuk(laptop, 'Kirim kode');
  await laptop.p.getByLabel('Kode 6 angka').fill('123456');
  await ketuk(laptop, 'Masuk');
  await tunggu(laptop, 'Kancil');
  await laptop.p.getByText('Kancil', { exact: true }).first().click();
  await tunggu(laptop, 'Rani · Kelas 6');
  await foto(laptop, '12-papan-laptop');

  for (const [nama, hp] of [['staf', staf], ['orang tua', ortu], ['laptop', laptop]]) {
    cek(hp.galat.length === 0, `${nama}: tanpa galat konsol${hp.galat.length ? ' → ' + hp.galat.join(' | ') : ''}`);
  }
  await peramban.close();
  console.log(gagal ? `${gagal} pemeriksaan gagal` : 'Semua pemeriksaan lulus');
  process.exit(gagal ? 1 : 0);
})();
