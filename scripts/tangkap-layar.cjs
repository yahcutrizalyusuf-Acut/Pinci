/**
 * Tangkapan layar semua layar desain (360 × 800) dari build web, untuk docs/BANDING-DESAIN.md.
 *
 * Pakai:
 *   EXPO_PUBLIC_TKA_BUKA=mati EXPO_PUBLIC_FITUR_GURU=nyala npx expo export -p web --output-dir dist
 *   node scripts/sajikan-web.cjs dist 8081 &
 *   node scripts/tangkap-layar.cjs
 */
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const DASAR = process.env.ALAMAT || 'http://localhost:8081';
const KELUAR = path.join(process.cwd(), 'docs', 'tangkapan');
fs.mkdirSync(KELUAR, { recursive: true });

(async () => {
  const peramban = await chromium.launch();
  const p = await peramban.newPage({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 });
  const galat = [];
  p.on('pageerror', (e) => galat.push(`pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (m.type() === 'error') galat.push(`console: ${m.text().slice(0, 200)}`);
  });
  const tunggu = (ms = 600) => p.waitForTimeout(ms);
  const ketuk = async (label, urutan = 'first') => {
    await p.getByLabel(label, { exact: true })[urutan]().click();
    await tunggu(200);
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
  const buka = async (url, nama, ms = 1600) => {
    await p.goto(DASAR + url);
    await foto(nama, ms);
  };
  const ubahData = async (fn, arg) => {
    await p.evaluate(
      ([kode, a]) => {
        const k = 'pintar-main-v1';
        const d = JSON.parse(localStorage.getItem(k));
        new Function('d', 'a', kode)(d, a);
        localStorage.setItem(k, JSON.stringify(d));
      },
      [fn, arg],
    );
  };

  // A01
  await buka('/', 'A01-Selamat-Datang', 2500);
  // Daftar: PIN + dua anak
  await teks('Saya orang tua');
  for (const d of '12341234') await ketuk(d);
  await tunggu(900);
  await p.getByLabel('Nama panggilan anak').fill('Rafli');
  await ketuk('Kelas 6');
  await ketuk('Harimau');
  await teks('Simpan profil');
  await p.goto(`${DASAR}/daftar/anak`);
  await tunggu(1500);
  await p.getByLabel('Nama panggilan anak').fill('Aisyah');
  await ketuk('Kelas 4');
  await ketuk('Gajah');
  await teks('Simpan profil');
  await tunggu(800);

  // Isi data contoh: pesan orang tua, kemajuan topik bertanda, game selalu terbuka (untuk peta Waktu main).
  await ubahData(
    `
    const anak = Object.values(d.anak);
    const rafli = anak.find((x) => x.nama === 'Rafli');
    const aisyah = anak.find((x) => x.nama === 'Aisyah');
    const kel = Object.values(d.keluarga)[0];
    const kini = new Date();
    const iso = (m) => new Date(kini.getTime() - m * 60000).toISOString();
    d.pesan = d.pesan || {};
    d.pesan.p1 = { id: 'p1', keluarga_id: kel.id, anak_id: rafli.id, dari: 'orang_tua', jenis: 'teks', isi: 'Ayah bangga kamu tidak menyerah di pecahan.', waktu: iso(30) };
    d.pesan.p2 = { id: 'p2', keluarga_id: kel.id, anak_id: rafli.id, dari: 'anak', jenis: 'stiker', isi: 'rekor', waktu: iso(20) };
    d.kemajuan_topik = d.kemajuan_topik || {};
    const kt = (an, mapel, topik, benar, salah, tanda, alasan) => ({ id: an.id + ':' + mapel + ':' + topik, anak_id: an.id, mapel, topik, status: 'belajar', benar, salah, petunjuk: 1, terakhir: iso(60), tanda, alasan });
    d.kemajuan_topik.a = kt(rafli, 'tka', 'M03', 3, 3, 'kuning', 'Benar 3 dari 6 soal.');
    d.kemajuan_topik.b = kt(rafli, 'tka', 'B04', 2, 2, 'kuning', 'Sering memakai petunjuk.');
    d.kemajuan_topik.c = kt(rafli, 'gudang', 'mat6-kpk-fpb', 1, 6, 'merah', 'Benar 1 dari 7 soal. Perlu dijelaskan ulang bersama.');
    for (const id of Object.keys(d.pengaturan_waktu)) d.pengaturan_waktu[id].gameSetelahInti = false;
    `,
  );

  // A02, lalu masuk sebagai Rafli
  await buka('/profil', 'A02-Pilih-Profil', 1800);
  await teks('Rafli', 'first');
  await foto('A03-Beranda-Belajar', 1500);

  // K4 tes penempatan → A06 (hasil tes), A04 jurus, A05 lembar
  await teks('Lancar Matematika');
  await teks('Mulai');
  for (let i = 0; i < 30; i++) {
    if (!(await p.getByLabel('Cek', { exact: true }).count())) break;
    await ketuk('7');
    await ketuk('Cek');
    await tunggu(1800);
  }
  await tunggu(1200);
  await teks('Kembali ke beranda');
  await teks('Lancar Matematika');
  await foto('A04-Jurus');
  await teks('Aku siap!');
  await ketuk('1');
  await ketuk('2');
  await foto('A05-Lembar-Lancar', 400);
  await ketuk('Hapus');
  await ketuk('Hapus');
  for (let i = 0; i < 20; i++) {
    if (!(await p.getByLabel('Cek', { exact: true }).count())) break;
    await ketuk('4');
    await ketuk('Cek');
    await tunggu(1800);
  }
  await foto('A06-Akhir-Lembar', 1500);

  await buka('/istirahat', 'A07-Istirahat');
  await buka('/cukup', 'A07b-Cukup-Belajar');
  await buka('/anak/pesan', 'A08-Pesan', 1800);
  await buka('/anak/gudang', 'B01-Gudang-Ilmu', 2000);
  await buka('/gudang/mat6-pecahan-senilai', 'B02-Kartu-Ilmu');
  await p.goto(`${DASAR}/baca/T01`);
  await tunggu(1500);
  await teks('Mulai membaca');
  await teks('Selesai');
  await foto('B03-Baca-Ulang', 1800);
  await buka('/inggris/tingkat', 'B04-Inggris-Tingkat');
  await buka('/inggris/t3-u07', 'B05-Inggris-Unit');
  await buka('/tka', 'B06a-Siap-TKA-Peta', 1800);
  await buka('/tka/latihan?topik=M01', 'B06-Siap-TKA', 1800);
  await buka('/tka/simulasi?id=S1', 'K15-Simulasi-Pengantar');

  // Game
  await buka('/anak/main', 'G01-Waktu-Main', 1800);
  await buka('/game/pasar', 'G02-Pilih-Tingkat');
  await buka('/game/main?nama=pasar&tingkat=santai', 'G03-Pasar-Gampong', 2500);
  await buka('/game/main?nama=ular-tangga&tingkat=santai', 'G04-Ular-Tangga', 2500);
  await buka('/game/main?nama=susun-kubus&tingkat=santai', 'G05-Susun-Kubus', 2500);
  await buka('/game/main?nama=tebak-kata&tingkat=santai', 'G06-Tebak-Kata', 2500);
  await buka('/game/akhir', 'G07-Akhir-Babak');
  await buka('/game/habis', 'G08-Waktu-Habis');

  // Mode orang tua (navigasi di dalam aplikasi supaya PIN tetap terbuka)
  await p.goto(`${DASAR}/ortu/pin`);
  await tunggu(1500);
  for (const d of '1234') await ketuk(d);
  await foto('O09-Kabar', 1800);
  await p.getByLabel(/^Rafli,/).first().click();
  await foto('O10-Ruang-Anak', 1800);
  await p.evaluate(() => history.back());
  await tunggu(1200);
  await p.getByRole('tab', { name: 'Rapor' }).click();
  await foto('O11-Rapor-Mingguan', 1800);
  await p.getByRole('tab', { name: 'Bimbingan' }).click();
  await foto('P08-Bimbingan', 1500);
  await teks('Kelola guru');
  await foto('P09-Kelola-Guru');
  await p.evaluate(() => history.back());
  await tunggu(1200);
  await p.getByRole('tab', { name: 'Atur' }).click();
  await foto('O-Atur');
  await p.getByText(/Rafli · Kelas 6/).last().click();
  await foto('O12-Pengaturan-Waktu', 1500);
  await p.evaluate(() => history.back());
  await tunggu(1200);
  await teks('Mode Dampingi');
  await foto('D2-Menu-Dampingi', 1200);
  await teks('Lembar didampingi');
  await foto('B07-Mode-Dampingi', 1800);

  // Tanpa sinyal: semua isi dibawa di aplikasi, data di HP.
  await p.context().setOffline(true);
  await p.goto(`${DASAR}/anak`).catch(() => undefined);
  await tunggu(1500);
  await p.context().setOffline(false);

  fs.writeFileSync(path.join(KELUAR, 'galat.txt'), galat.join('\n') || 'Tidak ada galat di konsol.\n');
  console.log(galat.length ? `Galat konsol: ${galat.length} (lihat docs/tangkapan/galat.txt)` : 'Tanpa galat konsol.');
  await peramban.close();
})();
