/**
 * Membuat docs/NASKAH-KOMIK-UNTUK-GURU.md dari paket komik dan paket Bahasa Inggris (nama tokoh dari tokoh.json).
 *   npx tsx scripts/buat-naskah-guru.ts
 */
import * as fs from 'fs';
import * as path from 'path';

import { PAKET_INGGRIS } from '../src/isi/inggris/paket';
import { PAKET_KOMIK, PAKET_TOKOH, teksTokoh } from '../src/isi/inggris/paketKomik';

const nama = (id: string) => PAKET_TOKOH.tokoh.find((t) => t.id === id)?.nama ?? id;
const sel = (s: string) => s.replace(/\|/g, '\\|');
const b: string[] = [];

b.push('# Naskah Cerita Komik untuk Guru Bahasa Inggris');
b.push('');
b.push(`Dibuat otomatis dari paket isi (${new Date().toISOString().slice(0, 10)}). **Semua naskah berstatus belum diperiksa.**`);
b.push('');
b.push('**Cara memeriksa:** baca setiap gelembung. Tandai Bahasa Inggris yang salah atau tidak wajar, kata yang terlalu sulit untuk tingkatnya, arti yang kurang tepat, tips bunyi yang keliru, dan pesan akhlak yang terasa menggurui. Tulis nomor komik dan panel (misalnya **t3-u02 panel 4**) lalu kirim ke Acut.');
b.push('');
b.push(`**Tokoh** (nama masih sementara, diganti di satu tempat: \`assets/paket/tokoh.json\`): ${PAKET_TOKOH.tokoh.filter((t) => t.peran !== 'narator').map((t) => `${t.nama} (${t.sifat.split(';')[0]})`).join('; ')}.`);
b.push('');
b.push('Aturan naskah: tingkat 3 berisi 4–5 panel dan paling banyak 6 kata per gelembung; tingkat 4 berisi 5–6 panel dan paling banyak 8 kata. Paling banyak 2 kata di luar daftar kata unit. Tanpa isi agama dan tanpa adegan menakutkan.');

for (const p of Object.values(PAKET_KOMIK)) {
  if (!p) continue;
  b.push('');
  b.push(`## Tingkat ${p.tingkat}: ${p.petualangan}`);
  for (const k of p.komik) {
    const unit = PAKET_INGGRIS[k.tingkat].unit.find((u) => u.id === k.unit);
    b.push('');
    b.push(`### ${k.id}: ${teksTokoh(k.judul)} (unit ${unit?.nomor}, ${unit?.tema})`);
    b.push('');
    b.push(`- **Pesan akhlak:** ${teksTokoh(k.pesanAkhlak)}`);
    b.push(`- **Pesan Hari Ini:** *${teksTokoh(k.pesanHariIni.inggris)}* — ${teksTokoh(k.pesanHariIni.arti)}`);
    b.push(`- **Kata target:** ${k.kataTarget.join(', ')}`);
    if (unit?.kataKomik?.length) b.push(`- **Kata baru dari komik:** ${unit.kataKomik.map((x) => `${x.kata} (${x.arti})`).join(', ')}`);
    b.push('');
    b.push('| Panel | Adegan | Tokoh | Gelembung Inggris | Arti | Tips bunyi |');
    b.push('|---|---|---|---|---|---|');
    for (const pn of k.panel) {
      pn.gelembung.forEach((g, i) => {
        b.push(`| ${i === 0 ? pn.nomor : ''} | ${i === 0 ? sel(teksTokoh(pn.adegan)) : ''} | ${nama(g.tokoh)} | ${sel(teksTokoh(g.teks))} | ${sel(teksTokoh(g.arti))} | ${i === 0 ? sel(pn.tipsBunyi.join(' ')) : ''} |`);
      });
    }
    b.push('');
    b.push('**Cek Paham:**');
    b.push('');
    for (const s of k.cekPaham) {
      const g = (gid: string) => k.panel.flatMap((x) => x.gelembung).find((x) => x.id === gid);
      if (s.jenis === 'urutkan') b.push(`- Urutkan panel → kunci: ${s.panel.map((x) => x.split('-p')[1]).join(' → ')}`);
      else if (s.jenis === 'siapa') b.push(`- Siapa yang bilang *${teksTokoh(g(s.gelembung)?.teks ?? '')}* (pilihan: ${s.pilihan.map(nama).join(' / ')}) → kunci: **${nama(s.kunci)}**`);
      else if (s.jenis === 'dengar_panel') b.push(`- Dengar *${teksTokoh(g(s.gelembung)?.teks ?? '')}*, pilih panel (${s.pilihan.map((x) => x.split('-p')[1]).join(' / ')}) → kunci: **panel ${s.kunci.split('-p')[1]}**`);
      else b.push(`- Lengkapi *${teksTokoh(g(s.gelembung)?.teks ?? '')}* (pilihan: ${s.pilihan.join(' / ')}) → kunci: **${s.kataHilang}**`);
    }
    b.push('');
    b.push(`**Renungan untuk orang tua:** ${teksTokoh(k.naskahOrangTua.renungan)}`);
    b.push('');
    b.push(`**Perbuatan baik minggu ini:** ${teksTokoh(k.perbuatanBaik)}`);
  }
}

b.push('');
b.push('## Bunyi Hari Ini (48 unit)');
b.push('');
b.push('| Unit | Tema | Bunyi | Kata contoh | Tips |');
b.push('|---|---|---|---|---|');
for (const p of Object.values(PAKET_INGGRIS)) {
  for (const u of p.unit) {
    if (!u.bunyiHariIni) continue;
    b.push(`| ${u.id} | ${u.tema} | ${u.bunyiHariIni.bunyi} | ${u.bunyiHariIni.kata.join(', ')} | ${sel(u.bunyiHariIni.tips)} |`);
  }
}
b.push('');

fs.writeFileSync(path.join(__dirname, '..', 'docs', 'NASKAH-KOMIK-UNTUK-GURU.md'), b.join('\n'), 'utf8');
console.log('Tersimpan: docs/NASKAH-KOMIK-UNTUK-GURU.md');
