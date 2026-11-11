/**
 * Membuat docs/DAFTAR-PERIKSA-GURU.md dari paket isi: semua isi berstatus belum_diperiksa / perlu_dicek.
 * Pakai: node scripts/buat-daftar-guru.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const akar = process.cwd();
const baca = (f) => JSON.parse(fs.readFileSync(path.join(akar, 'assets/paket', f), 'utf8'));

function hitung(o, hasil = { semua: 0, perlu: [] }) {
  if (Array.isArray(o)) o.forEach((x) => hitung(x, hasil));
  else if (o && typeof o === 'object') {
    if (o.id && o.kunci !== undefined) {
      hasil.semua++;
      if (o.status === 'perlu_dicek') hasil.perlu.push(o.id);
    }
    Object.values(o).forEach((x) => hitung(x, hasil));
  }
  return hasil;
}

const b = [];
b.push('# Daftar Periksa Guru', '');
b.push('Semua isi di aplikasi masih berstatus **belum diperiksa**. Daftar ini dibuat otomatis oleh `scripts/buat-daftar-guru.cjs`.', '');
b.push('Cara memeriksa:', '');
b.push('1. Centang kotak setelah satu kelompok selesai diperiksa.');
b.push('2. Tulis nomor butir dan perbaikannya di kolom catatan atau di berkas terpisah.');
b.push('3. Kunci Matematika sudah dihitung ulang oleh kode. Yang perlu dilihat guru: bahasa, kesesuaian kelas, dan pengecoh.');
b.push('4. Tanda ⚠ berarti **perlu dicek**: ada catatan dari pemeriksa kunci. Butir ini belum dipakai di latihan harian.', '');

// TKA
const tka = baca('tka-k6.json');
const semuaTka = hitung(tka);
b.push(`## 1. Persiapan TKA (\`tka-k6.json\`): ${tka.topik.length} topik, ${tka.simulasi.length} simulasi, ${tka.teks.length} teks, ${semuaTka.semua} butir`, '');
b.push('Sumber: bahan kursus TKA milik Acut (`bahan/kursus-tka-sd`).', '');
b.push('Catatan dari pemeriksa materi: T35-q2 (kutipan tidak sama dengan teks), M17-k10 (petunjuk denah di kolom pertanyaan), M12-k07 dan M12-tb2 (kongruen dan sudut pelurus, cocokkan dengan kisi-kisi TKA SD).', '');
b.push('| ✓ | Topik | Judul | Butir | Perlu dicek | Catatan |', '|---|---|---|---|---|---|');
for (const t of tka.topik) {
  const h = hitung(t);
  b.push(`| ☐ | ${t.id} | ${t.judul} | ${h.semua} | ${h.perlu.length ? '⚠ ' + h.perlu.join(', ') : '-'} | |`);
}
b.push('', '| ✓ | Simulasi | Judul | Butir | Perlu dicek | Catatan |', '|---|---|---|---|---|---|');
for (const s of tka.simulasi) {
  const h = hitung(s);
  b.push(`| ☐ | ${s.id} | ${s.judul} | ${h.semua} | ${h.perlu.length ? '⚠ ' + h.perlu.join(', ') : '-'} | |`);
}
b.push('', '| ✓ | Teks | Judul | Pertanyaan | Status | Catatan |', '|---|---|---|---|---|---|');
for (const t of tka.teks) {
  b.push(`| ☐ | ${t.id} | ${t.judul} | ${(t.pertanyaan || []).length} | ${t.status === 'perlu_dicek' ? '⚠ perlu dicek' : 'belum diperiksa'} | |`);
}

// Gudang
const g = baca('gudang-k6.json');
b.push('', `## 2. Gudang Ilmu kelas 6 (\`gudang-k6.json\`)`, '');
b.push('Buatan sendiri (disusun dari modul TKA). Tiap kartu: penjelasan, contoh jadi, dan soal dengan 3 tahap petunjuk.', '');
for (const m of g.mapel) {
  const kartu = m.topik.filter((t) => t.kartu);
  b.push(`### ${m.kode === 'mat' ? 'Matematika' : 'Bahasa Indonesia'}: ${kartu.length} kartu`, '');
  b.push('| ✓ | Kartu | Judul | Soal | Catatan |', '|---|---|---|---|---|');
  for (const t of kartu) b.push(`| ☐ | ${t.id} | ${t.judul} | ${t.kartu.soal.length} | |`);
  b.push('');
}

// Inggris
b.push('## 3. Bahasa Inggris tingkat 3–6 (`inggris-t3.json` … `inggris-t6.json`)', '');
b.push('Buatan sendiri. Periksa kosakata, arti, pola kalimat, soal dengar, dan susun kalimat.', '');
b.push('| ✓ | Unit | Judul | Kosakata | Pola | Dengar | Susun | Catatan |', '|---|---|---|---|---|---|---|---|');
for (const n of [3, 4, 5, 6]) {
  for (const u of baca(`inggris-t${n}.json`).unit) {
    b.push(`| ☐ | ${u.id} | ${u.judul} | ${u.kosakata.length} | ${u.pola.length} | ${u.dengar.length} | ${u.susun.length} | |`);
  }
}

// Lancar dan teks lain
b.push('', '## 4. Lancar Matematika', '');
b.push('- ☐ **36 jurus** (kelas 1–6, level 1–6) di `src/isi/lancar/jurus.ts`: inti, contoh, dan kalimat ingat.');
b.push('- ☐ **Soal lembar** dibangkitkan mesin (`src/mesin/lancar/`). Kuncinya dihitung kode dan diuji 8.100 lembar. Guru cukup memeriksa contoh lembar per level, terutama apakah tingkat kesulitannya sesuai kelas.', '');
b.push('## 5. Teks lain buatan sendiri', '');
b.push('- ☐ 30 kartu tips orang tua (`src/fitur/tips.ts`)');
b.push('- ☐ Stiker anak dan pesan siap kirim orang tua (`src/fitur/pesan.ts`)');
b.push('- ☐ Kalimat untuk anak saat jawaban belum tepat (`src/fitur/teks-anak.ts`)');
b.push('- ☐ Kalimat Mode Dampingi untuk orang tua (`src/fitur/dampingi.ts`)');
b.push('- ☐ Kata-kata game: Pasar Gampong, Ular Tangga Lurus, Susun Kubus, Tebak Kata (`src/game/*/`)', '');

// Lanjutan komik (11 Nov 2026)
b.push('## 6. Cerita Komik Bahasa Inggris (`komik-t3.json`, `komik-t4.json`)', '');
b.push('Naskah lengkap per panel untuk guru: `docs/NASKAH-KOMIK-UNTUK-GURU.md`. Periksa Bahasa Inggris, arti, tips bunyi, Cek Paham, dan pesan akhlak (tidak menggurui). Nama tokoh diganti di satu tempat: `assets/paket/tokoh.json`.', '');
b.push('| ✓ | Komik | Judul | Panel | Gelembung | Cek Paham | Status | Catatan |', '|---|---|---|---|---|---|---|---|');
const namaTokoh = Object.fromEntries(baca('tokoh.json').tokoh.map((t) => [t.id, t.nama]));
const isiNama = (t) => t.replace(/\{([a-z_]+)\}/g, (_, id) => namaTokoh[id] ?? id);
for (const n of [3, 4]) {
  for (const k of baca(`komik-t${n}.json`).komik) {
    const gel = k.panel.reduce((a, p) => a + p.gelembung.length, 0);
    b.push(`| ☐ | ${k.id} | ${isiNama(k.judul)} | ${k.panel.length} | ${gel} | ${k.cekPaham.length} | ${k.status} | |`);
  }
}
b.push('', '## 7. Bunyi Hari Ini, tips bunyi, dan Tebak Gerak', '');
let bunyi = 0;
for (const n of [3, 4, 5, 6]) bunyi += baca(`inggris-t${n}.json`).unit.filter((u) => u.bunyiHariIni).length;
b.push(`- ☐ **Bunyi Hari Ini** di ${bunyi} unit (tabel di akhir \`docs/NASKAH-KOMIK-UNTUK-GURU.md\`). Status: belum diperiksa.`);
b.push('- ☐ **Tips bunyi per panel** (1–2 per panel, dipakai di Dengar Bedanya). Status: belum diperiksa.');
b.push('- ☐ **Perintah Tebak Gerak** (20 perintah dasar, `src/isi/inggris/perintahGerak.ts`). Status: belum diperiksa.', '');
b.push('## 8. Soal cerita dan "Coba dengan benda" kartu Matematika kelas 6 (`gudang-k6.json`)', '');
b.push('Satu soal cerita berlatar Aceh atau sehari-hari per kartu. Kuncinya dihitung kode. Periksa bahasa, kewajaran cerita, dan model batang.', '');
b.push('| ✓ | Soal | Pertanyaan | Kunci | Benda | Status | Catatan |', '|---|---|---|---|---|---|---|');
for (const m of baca('gudang-k6.json').mapel) {
  for (const t of m.topik) {
    const s = t.kartu?.soal.find((x) => x.cerita);
    if (!s) continue;
    b.push(`| ☐ | ${s.id} | ${s.pertanyaan.replace(/\|/g, '/')} | ${s.kunci} | ${t.kartu.cobaBenda ? t.kartu.cobaBenda.benda.jenis : '-'} | ${s.status} | |`);
  }
}
b.push('');

fs.writeFileSync(path.join(akar, 'docs/DAFTAR-PERIKSA-GURU.md'), b.join('\n'));
console.log('docs/DAFTAR-PERIKSA-GURU.md ditulis.');
