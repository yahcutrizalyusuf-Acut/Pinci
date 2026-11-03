/**
 * Uji menyeluruh pendaftaran masa coba 14 hari dari mode orang tua (tatap muka → antre + online),
 * lalu staf melihatnya di halaman Pendaftar. Persiapan sama dengan scripts/uji-kelas.cjs.
 *
 *   node scripts/uji-coba.cjs
 *
 * Tangkapan layar disimpan di KELUAR (bawaan docs/tangkapan/coba).
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const D = process.env.ALAMAT || 'http://localhost:8082';
const KELUAR = process.env.KELUAR || path.join(process.cwd(), 'docs', 'tangkapan', 'coba');
fs.mkdirSync(KELUAR, { recursive: true });

let gagal = 0;
const cek = (kondisi, pesan) => {
  console.log(kondisi ? '✓' : '✗', pesan);
  if (!kondisi) gagal++;
};

(async () => {
  const peramban = await chromium.launch();
  const buka = async () => {
    const c = await peramban.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, timezoneId: 'Asia/Jakarta' });
    const p = await c.newPage();
    const galat = [];
    p.on('pageerror', (e) => galat.push(e.message));
    return { p, galat };
  };
  const t = (ms = 700) => new Promise((r) => setTimeout(r, ms));
  const ortu = await buka();
  const p = ortu.p;
  const ketuk = async (label) => {
    await p.getByLabel(label, { exact: true }).first().click();
    await t(250);
  };
  const teks = async (label) => {
    await p.getByText(label, { exact: true }).last().click();
    await t(600);
  };
  const ada = async (hp, label) => (await hp.getByText(label, { exact: false }).count()) > 0;
  const foto = async (nama) => {
    await t(400);
    await p.screenshot({ path: path.join(KELUAR, `${nama}.png`), fullPage: true });
  };

  await p.goto(D + '/');
  await t(2500);
  await teks('Saya orang tua');
  await p.getByLabel('Alamat email').fill('ani@contoh.id');
  await ketuk('Kirim kode');
  await p.getByLabel('Kode 6 angka').fill('123456');
  await ketuk('Masuk');
  await t(1500);
  for (const d of '12341234') await ketuk(d);
  await t(1200);
  await p.getByLabel('Nama panggilan anak').fill('Rani');
  await ketuk('Kelas 6');
  await ketuk('Kucing');
  await teks('Simpan profil');
  await t(1500);
  await p.goto(D + '/ortu/pin');
  await t(1500);
  for (const d of '1234') await ketuk(d);
  await t(1200);
  await p.getByRole('tab', { name: 'Atur' }).click();
  await t(800);
  await teks('Kelas dan pengawas');
  await t(1200);
  cek(await ada(p, 'Coba 14 hari bersama pengawas'), 'kelas: tombol Coba 14 hari ada untuk anak tanpa kelas');
  await teks('Coba 14 hari bersama pengawas');
  await t(1000);

  // Langkah 1: anak dan pelajaran
  await teks('Lanjut');
  cek(await ada(p, 'Isi nama Anda dan nama lengkap anak'), 'langkah 1: nama wajib diisi');
  await p.getByLabel('Nama Anda').fill('Bu Ani');
  await p.getByLabel('Nama lengkap anak').fill('Rani Putri Aceh');
  await ketuk('Persiapan TKA');
  await ketuk('Bahasa Inggris');
  await teks('Siap TKA');
  await foto('1-anak-pelajaran');
  cek((await p.getByText(/Rp\s?\d/).count()) === 0, 'langkah 1: tidak ada harga di aplikasi');
  await teks('Lanjut');

  // Langkah 2: tatap muka → belum tersedia → antre + online
  await foto('2-cara');
  await ketuk('Kelas tatap muka');
  await t(500);
  cek(await ada(p, 'Kelas tatap muka belum tersedia'), 'tatap muka: dijelaskan belum tersedia');
  cek(await ada(p, 'Antre kelas tatap muka dan daftar kelas online') && (await ada(p, 'Daftar kelas online saja')), 'tatap muka: dua pilihan muncul');
  await ketuk('Antre kelas tatap muka dan daftar kelas online');
  await teks('Lanjut');
  cek(await ada(p, 'Tulis kota'), 'tatap muka: kota wajib untuk antrean');
  await p.getByLabel('Kota Anda').fill('Banda Aceh');
  await foto('3-tatap-muka');
  await teks('Lanjut');

  // Langkah 3: kontak
  await p.getByLabel('Nomor WhatsApp').fill('123');
  await teks('Lanjut');
  cek(await ada(p, 'Nomor WhatsApp belum sesuai'), 'kontak: nomor salah ditolak');
  await p.getByLabel('Nomor WhatsApp').fill('0812 3456 7890');
  await foto('4-kontak');
  await teks('Lanjut');

  // Langkah 4: kenali anak (sebagian dijawab)
  cek(await ada(p, '8 pertanyaan singkat'), 'kenali: 8 pertanyaan pengenalan');
  await ketuk('Melihat gambar atau contoh');
  await ketuk('5 sampai 15 menit');
  await ketuk('Belajar sambil bermain');
  await foto('5-kenali');
  await teks('Lanjut');

  // Langkah 5: telepon
  await ketuk('Ya, saya mau ditelepon');
  await ketuk('Sore (15.00–18.00)');
  await foto('6-telepon');
  await teks('Lanjut');

  // Langkah 6: izin
  await teks('Kirim pendaftaran');
  cek(await ada(p, 'Centang persetujuan dihubungi pengawas'), 'izin: izin kontak wajib');
  await ketuk('Dihubungi pengawas (wajib)');
  await ketuk('Membantu pengembangan (boleh tidak)');
  await foto('7-izin');
  await teks('Kirim pendaftaran');
  await t(1500);
  cek(await ada(p, 'pendaftaran terkirim'), 'selesai: pendaftaran terkirim');
  cek(await ada(p, 'antrean kelas tatap muka Banda Aceh, nomor'), 'selesai: nomor antrean tatap muka tampil');
  await foto('8-selesai');

  // Staf melihat pendaftar
  const staf = await buka();
  await staf.p.goto(D + '/staf');
  await t(2500);
  await staf.p.getByLabel('Email').fill('super@contoh.id');
  await staf.p.getByLabel('Kirim kode', { exact: true }).click();
  await t(300);
  await staf.p.getByLabel('Kode 6 angka').fill('123456');
  await staf.p.getByLabel('Masuk', { exact: true }).click();
  await staf.p.getByText('Acut · Super admin').first().waitFor({ timeout: 15000 });
  await staf.p.getByText('Pendaftar', { exact: false }).first().click();
  await t(2500);
  cek(await ada(staf.p, 'Rani Putri Aceh · Kelas 6'), 'staf: nama lengkap anak dan kelas');
  cek(await ada(staf.p, 'Antre tatap muka (Banda Aceh) + kelas online'), 'staf: cara belajar dan kota');
  cek(await ada(staf.p, 'Persiapan TKA'), 'staf: pelajaran pilihan');
  cek(await ada(staf.p, 'Harapan orang tua: Siap TKA'), 'staf: tujuan orang tua');
  cek(await ada(staf.p, 'Minta ditelepon: Sore'), 'staf: permintaan telepon');
  cek(await ada(staf.p, 'Banda Aceh: 1 anak'), 'staf: antrean tatap muka per kota');
  await staf.p.screenshot({ path: path.join(KELUAR, '9-staf-pendaftar.png'), fullPage: true });

  const semuaGalat = [...ortu.galat, ...staf.galat];
  cek(semuaGalat.length === 0, `tanpa galat halaman${semuaGalat.length ? ': ' + semuaGalat.join(' | ') : ''}`);
  await peramban.close();
  console.log(gagal ? `GAGAL ${gagal}` : 'SEMUA LULUS');
  process.exit(gagal ? 1 : 0);
})();
