/**
 * Impor bahan Paket Siap TKA SD menjadi paket isi aplikasi.
 *
 *   npx tsx scripts/impor-tka.ts
 *
 * Membaca  bahan/kursus-tka-sd/{01-modul-matematika,02-modul-bahasa-indonesia,03-bank-teks-baca-cepat}
 * Menulis  assets/paket/tka-k6.json dan docs/LAPORAN-IMPOR-TKA.md
 *
 * Butir yang gagal dibaca tidak dibuang diam-diam: semuanya tercatat di laporan (berkas, baris, alasan).
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import type { Butir, PaketTka, Simulasi, Teks, Topik } from '../src/isi/tka/jenis';
import { bacaModul, bacaSimulasi, bacaTeks, type MasalahBaca } from '../src/isi/tka/pembaca';
import { butirMatematika, periksaKunci, type HasilPeriksaKunci } from '../src/isi/tka/periksa-kunci';

const AKAR = join(__dirname, '..');
const BAHAN = join(AKAR, 'bahan', 'kursus-tka-sd');
const KELUAR_JSON = join(AKAR, 'assets', 'paket', 'tka-k6.json');
const KELUAR_LAPORAN = join(AKAR, 'docs', 'LAPORAN-IMPOR-TKA.md');
const VERSI = '1.0.0';

/** Temuan yang sudah dicatat pemeriksa (05-pemeriksaan) dan sengaja tidak diperbaiki penyusun. */
const TEMUAN_TERCATAT: Record<string, string> = {
  'S3-24': 'verifikasi-akhir 3.7: urutan rasio pada pilihan belum kecil → besar; sengaja tidak diperbaiki, kunci benar',
  'S3-22': 'laporan-mutu: S3 Butir 22–23 berbagi satu stimulus dan saling memberi petunjuk (wajar untuk soal bergrup)',
  'S3-23': 'laporan-mutu: S3 Butir 22–23 berbagi satu stimulus dan saling memberi petunjuk (wajar untuk soal bergrup)',
  'S5-22': 'verifikasi-akhir 5.9: kunci jelas pilihan paling panjang; sengaja tidak diperbaiki',
  'S5-24': 'verifikasi-akhir 5.9: kunci jelas pilihan paling panjang; sengaja tidak diperbaiki',
  'B11-tk1': 'verifikasi-akhir 5.10: urutan pilihan belum pendek → panjang; sengaja tidak diperbaiki',
  'B03-k02': 'verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki',
  'B04-kz4': 'verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki',
  'B06-k11': 'verifikasi-akhir 4.7: urutan/panjang pilihan belum ideal; sengaja tidak diperbaiki',
  'B01-d09': 'verifikasi-akhir 4.5: teks B tidak diubah, jawaban tetap dapat disimpulkan (diperbaiki sebagian)',
  'B01-d05': 'laporan-mutu: sebagian bisa dijawab dari pengetahuan adat (diagnostik, bukan butir rapor)',
};

function daftarBerkas(folder: string, awalan: RegExp): string[] {
  return readdirSync(folder)
    .filter((n) => n.endsWith('.md') && awalan.test(n))
    .sort()
    .map((n) => join(folder, n));
}

const relatif = (p: string): string => relative(BAHAN, p).split('\\').join('/');

function tanggalHariIni(): string {
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function semuaButirTopik(t: Topik): Butir[] {
  return [...t.diagnostik, ...t.kuis, ...t.terbimbing, ...t.soalKelas, ...t.soalCadangan, ...t.tiket];
}

function utama(): void {
  const masalah: MasalahBaca[] = [];
  const catatanStimulus: string[] = [];
  const sumberIsi: string[] = [];
  const baca = (p: string): string => {
    const isi = readFileSync(p, 'utf8');
    sumberIsi.push(`${relatif(p)}\n${isi}`);
    return isi;
  };

  // ── modul ──
  const berkasModul = [
    ...daftarBerkas(join(BAHAN, '01-modul-matematika'), /^M\d{2}-/),
    ...daftarBerkas(join(BAHAN, '02-modul-bahasa-indonesia'), /^B\d{2}-/),
  ];
  const topik: Topik[] = [];
  for (const p of berkasModul) {
    const h = bacaModul(baca(p), relatif(p));
    topik.push(h.topik);
    masalah.push(...h.masalah);
    catatanStimulus.push(...h.catatan);
  }

  // ── simulasi ──
  const berkasSimulasi = [
    ...daftarBerkas(join(BAHAN, '01-modul-matematika', 'simulasi'), /^S\d/),
    ...daftarBerkas(join(BAHAN, '02-modul-bahasa-indonesia', 'simulasi'), /^S\d/),
  ].sort((a, b) => relatif(a).split('/').pop()!.localeCompare(relatif(b).split('/').pop()!));
  const simulasi: Simulasi[] = [];
  const klaimSebaran = new Map<string, string>();
  for (const p of berkasSimulasi) {
    const isi = baca(p);
    const h = bacaSimulasi(isi, relatif(p));
    simulasi.push(h.simulasi);
    masalah.push(...h.masalah);
    const klaim = /Sebaran kunci[^:]*:\s*([^\n]+)/.exec(isi);
    if (klaim) klaimSebaran.set(h.simulasi.id, klaim[1].replace(/\*\*/g, '').trim());
  }

  // ── teks ──
  const berkasTeks = daftarBerkas(join(BAHAN, '03-bank-teks-baca-cepat'), /^T\d{2}-/);
  const teks: Teks[] = [];
  const selisihKata: string[] = [];
  for (const p of berkasTeks) {
    const h = bacaTeks(baca(p), relatif(p));
    teks.push(h.teks);
    masalah.push(...h.masalah);
    if (Math.abs(h.kataTerhitung - h.teks.jumlahKata) > 3) {
      selisihKata.push(`${h.teks.id}: kepala berkas ${h.teks.jumlahKata} kata, dihitung ulang ${h.kataTerhitung}`);
    }
  }

  // ── catatan temuan tercatat ──
  const semuaButir: Butir[] = [
    ...topik.flatMap(semuaButirTopik),
    ...simulasi.flatMap((s) => s.butir),
    ...teks.flatMap((t) => t.pertanyaan),
  ];
  for (const b of semuaButir) {
    const t = TEMUAN_TERCATAT[b.id];
    if (t) b.catatan = [...(b.catatan ?? []), t];
  }
  const tercatatTidakKetemu = Object.keys(TEMUAN_TERCATAT).filter((id) => !semuaButir.some((b) => b.id === id));

  // ── pemeriksa kunci ──
  const hasilKunci: { b: Butir; h: HasilPeriksaKunci }[] = [];
  for (const b of semuaButir) {
    if (!butirMatematika(b) && !(b.periksa ?? []).some((e) => !e.toLowerCase().startsWith('tidak ada'))) continue;
    const h = periksaKunci(b);
    hasilKunci.push({ b, h });
    if (h.temuan.length > 0) {
      b.status = 'perlu_dicek';
      b.catatan = [...(b.catatan ?? []), ...h.temuan.map((t) => `pemeriksa kunci: ${t}`)];
    }
  }

  // ── paket ──
  const sidikJari = createHash('sha256').update(sumberIsi.join('\n\u0000\n')).digest('hex').slice(0, 16);
  const paket: PaketTka = {
    id: 'tka-k6',
    versi: VERSI,
    dibuat: tanggalHariIni(),
    sidikJari,
    sumber: 'bahan/kursus-tka-sd (Paket Siap TKA SD, 17 September 2026)',
    topik,
    simulasi,
    teks,
  };
  mkdirSync(join(AKAR, 'assets', 'paket'), { recursive: true });
  writeFileSync(KELUAR_JSON, `${JSON.stringify(paket, null, 2)}\n`, 'utf8');

  // ── laporan ──
  const L: string[] = [];
  const tulis = (...s: string[]): void => {
    L.push(...s);
  };
  const gagal = masalah.filter((m) => m.tingkat === 'gagal');
  const peringatan = masalah.filter((m) => m.tingkat === 'peringatan');
  const hitungBentuk = (bs: Butir[]): Record<string, number> => {
    const r: Record<string, number> = { pg: 0, pgk: 0, pgkat: 0 };
    for (const b of bs) r[b.bentuk]++;
    return r;
  };
  const bentukSemua = hitungBentuk(semuaButir);

  tulis(
    '# Laporan Impor Bahan TKA',
    '',
    `Dibuat otomatis oleh \`npx tsx scripts/impor-tka.ts\` pada ${paket.dibuat}. Jangan disunting tangan; jalankan ulang skripnya.`,
    '',
    `- Paket: \`assets/paket/tka-k6.json\` · versi ${VERSI} · sidik jari bahan \`${sidikJari}\``,
    `- Berkas dibaca: ${berkasModul.length} modul, ${berkasSimulasi.length} paket simulasi, ${berkasTeks.length} teks baca cepat`,
    `- Semua butir berstatus \`belum_diperiksa\` (CLAUDE.md aturan 10), kecuali yang ditandai pemeriksa kunci menjadi \`perlu_dicek\`.`,
    '',
    '## 1. Ringkasan jumlah',
    '',
    '| Isi | Jumlah |',
    '|---|---|',
    `| Topik | ${topik.length} (${topik.filter((t) => t.mapel === 'mat').length} Matematika + ${topik.filter((t) => t.mapel === 'bi').length} Bahasa Indonesia) |`,
    `| Simulasi | ${simulasi.length} (${simulasi.map((s) => `${s.id}: ${s.butir.length}`).join(' · ')} butir) |`,
    `| Teks baca cepat | ${teks.length} (${teks.reduce((a, t) => a + t.pertanyaan.length, 0)} pertanyaan) |`,
    `| Butir seluruhnya | ${semuaButir.length} — PG ${bentukSemua.pg} · PG kompleks ${bentukSemua.pgk} · PG kategori ${bentukSemua.pgkat} |`,
    `| Soal kelas ● / cadangan ○ | ${topik.reduce((a, t) => a + t.soalKelas.length, 0)} / ${topik.reduce((a, t) => a + t.soalCadangan.length, 0)} |`,
    `| Latihan rumah (id soal ○) | ${topik.reduce((a, t) => a + t.latihanRumah.length, 0)} butir di ${topik.filter((t) => t.latihanRumah.length > 0).length} topik |`,
    `| Terbimbing · kuis · tiket · diagnostik | ${topik.reduce((a, t) => a + t.terbimbing.length, 0)} · ${topik.reduce((a, t) => a + t.kuis.length, 0)} · ${topik.reduce((a, t) => a + t.tiket.length, 0)} · ${topik.reduce((a, t) => a + t.diagnostik.length, 0)} |`,
    `| Contoh jadi | ${topik.reduce((a, t) => a + t.contohJadi.length, 0)} |`,
    `| Butir gagal dibaca (tidak masuk paket) | **${gagal.length}** |`,
    `| Peringatan (masuk paket) | ${peringatan.length} |`,
    '',
    '### Per topik',
    '',
    '| Topik | Judul | ● | ○ | Rumah | Terbimbing | Kuis | Tiket | Diag. | Contoh jadi | Salah paham | PG/PGK/PGKat |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
  );
  for (const t of topik) {
    const bt = hitungBentuk(semuaButirTopik(t));
    tulis(
      `| ${t.id} | ${t.judul} | ${t.soalKelas.length} | ${t.soalCadangan.length} | ${t.latihanRumah.length} | ${t.terbimbing.length} | ${t.kuis.length} | ${t.tiket.length} | ${t.diagnostik.length} | ${t.contohJadi.length} | ${t.salahPaham.length} | ${bt.pg}/${bt.pgk}/${bt.pgkat} |`,
    );
  }
  tulis('', '### Per simulasi', '', '| Simulasi | Judul | Dipakai di | Waktu | Butir | PG/PGK/PGKat | Butir berstimulus bersama |', '|---|---|---|---|---|---|---|');
  for (const s of simulasi) {
    const bt = hitungBentuk(s.butir);
    tulis(
      `| ${s.id} | ${s.judul} | ${s.dipakaiDi} | ${s.waktuMenit} menit | ${s.butir.length} | ${bt.pg}/${bt.pgk}/${bt.pgkat} | ${s.butir.filter((b) => b.grupStimulus).length} |`,
    );
  }
  tulis(
    '',
    '### Teks baca cepat',
    '',
    `${teks.length} teks, ${teks.reduce((a, t) => a + t.pertanyaan.length, 0)} pertanyaan; jumlah kata ${Math.min(...teks.map((t) => t.jumlahKata))}–${Math.max(...teks.map((t) => t.jumlahKata))} menurut kepala berkas.`,
    '',
  );
  if (selisihKata.length > 0) {
    tulis('Jumlah kata di kepala berkas berbeda > 3 dari hitungan ulang (cara `kata()` periksa.py):', '', ...selisihKata.map((s) => `- ${s}`), '');
  } else {
    tulis('Jumlah kata di kepala berkas cocok (selisih ≤ 3) dengan hitungan ulang untuk semua teks.', '');
  }

  // butir gagal
  tulis('## 2. Butir yang gagal dibaca', '');
  if (gagal.length === 0) tulis('Tidak ada. Semua judul soal berformat baku terbaca menjadi butir yang sah.', '');
  else {
    tulis('| Berkas | Baris | Alasan |', '|---|---|---|');
    for (const m of gagal) tulis(`| ${m.berkas} | ${m.baris} | ${m.alasan.replace(/\|/g, '/')} |`);
    tulis('');
  }
  tulis('### Peringatan (butir tetap masuk paket)', '');
  if (peringatan.length === 0) tulis('Tidak ada.', '');
  else {
    tulis('| Berkas | Baris | Peringatan |', '|---|---|---|');
    for (const m of peringatan) tulis(`| ${m.berkas} | ${m.baris} | ${m.alasan.replace(/\|/g, '/')} |`);
    tulis('');
  }
  if (catatanStimulus.length > 0) {
    tulis('### Stimulus yang disalin dari soal lain', '', 'Butir yang hanya menulis "teks A" atau "di soal nomor 4" diberi salinan teks yang dirujuk, supaya setiap butir bisa tampil sendiri.', '');
    tulis(...catatanStimulus.map((c) => `- ${c}`), '');
  }

  // sebaran kunci
  tulis(
    '## 3. Sebaran kunci PG',
    '',
    'Standar (`04-standar-soal.md` bagian 2 aturan 8): dari soal PG halaman 5 satu modul, **tidak ada huruf yang menjadi kunci lebih dari 4 kali**. Untuk simulasi, sebaran dibandingkan dengan klaim di berkas.',
    '',
  );
  const sebaran = (bs: Butir[]): Record<string, number> => {
    const r: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const b of bs) if (b.bentuk === 'pg') r[b.kunci] = (r[b.kunci] ?? 0) + 1;
    return r;
  };
  const tulisSebaran = (r: Record<string, number>): string => ['A', 'B', 'C', 'D'].map((h) => `${h} ${r[h] ?? 0}`).join(' · ');
  const timpang: string[] = [];
  tulis('| Topik | Sebaran PG halaman 5 | Sesuai standar |', '|---|---|---|');
  for (const t of topik) {
    const r = sebaran([...t.soalKelas, ...t.soalCadangan]);
    const ok = Math.max(...Object.values(r)) <= 4;
    if (!ok) timpang.push(t.id);
    tulis(`| ${t.id} | ${tulisSebaran(r)} | ${ok ? 'ya' : '**tidak**'} |`);
  }
  tulis('', timpang.length === 0 ? 'Semua 36 topik sesuai standar.' : `Tidak sesuai standar: ${timpang.join(', ')}.`, '');
  tulis('| Simulasi | Sebaran PG (dihitung) | Klaim di berkas | Cocok |', '|---|---|---|---|');
  for (const s of simulasi) {
    const r = sebaran(s.butir);
    const klaim = klaimSebaran.get(s.id) ?? '—';
    const ok = klaim.replace(/\s|\./g, '').includes(tulisSebaran(r).replace(/\s|\./g, ''));
    tulis(`| ${s.id} | ${tulisSebaran(r)} | ${klaim} | ${klaim === '—' ? '—' : ok ? 'ya' : '**tidak**'} |`);
  }
  const rSemua = sebaran(semuaButir);
  const nPg = Object.values(rSemua).reduce((a, c) => a + c, 0);
  tulis(
    '',
    `Seluruh paket (${nPg} butir PG): ${['A', 'B', 'C', 'D'].map((h) => `${h} ${rSemua[h]} (${Math.round((100 * rSemua[h]) / nPg)}%)`).join(' · ')}. Sebaran ideal ±25% per huruf.`,
    '',
  );

  // pemeriksa kunci
  const mat = hasilKunci.filter((x) => butirMatematika(x.b));
  const lain = hasilKunci.filter((x) => !butirMatematika(x.b));
  const ekspr = hasilKunci.flatMap((x) => x.h.ekspresi);
  const hitungE = (h: string): number => ekspr.filter((e) => e.hasil === h).length;
  const temuanSemua = hasilKunci.filter((x) => x.h.temuan.length > 0);
  const viaMandiri = mat.filter((x) => x.h.hitungMandiri?.hasil === 'cocok').length;
  const viaKaitan = mat.filter((x) => x.h.dihitungUlang && x.h.hitungMandiri?.hasil !== 'cocok' && x.h.kaitan === 'cocok').length;
  const viaEkspresi = mat.filter((x) => x.h.dihitungUlang && x.h.hitungMandiri?.hasil !== 'cocok' && x.h.kaitan !== 'cocok').length;
  const berhasil = mat.filter((x) => x.h.dihitungUlang).length;
  const polaMandiri = new Map<string, number>();
  for (const x of mat) {
    const m = x.h.hitungMandiri;
    if (m && m.hasil === 'cocok') {
      const k = m.pola.startsWith('konversi') ? 'konversi satuan' : m.pola.startsWith('PG kompleks') ? 'PG kompleks dinilai per pilihan' : m.pola;
      polaMandiri.set(k, (polaMandiri.get(k) ?? 0) + 1);
    }
  }
  tulis(
    '## 4. Pemeriksa kunci Matematika (`src/isi/tka/periksa-kunci.ts`)',
    '',
    'Tiga lapis: (1) setiap baris `Periksa` bahan dihitung ulang dengan bilangan rasional tepat; (2) untuk PG, nilai `… == …` dicocokkan ke angka pada pilihan dan harus menunjuk huruf kunci; (3) untuk PG yang polanya dikenali, kunci dihitung langsung dari kalimat soal tanpa memakai baris Periksa.',
    '',
    '| Ukuran | Jumlah |',
    '|---|---|',
    `| Butir Matematika diperiksa | ${mat.length} |`,
    `| **Berhasil dihitung ulang** | **${berhasil}** |`,
    `| — lewat hitung mandiri dari kalimat soal (PG, PG kompleks) | ${viaMandiri} |`,
    `| — lewat kaitan nilai Periksa ↔ pilihan kunci (PG) | ${viaKaitan} |`,
    `| — lewat semua ekspresi Periksa benar (PG kompleks/kategori; ekspresi penulis dihitung ulang, belum dikaitkan langsung ke huruf kunci) | ${viaEkspresi} |`,
    `| **Tidak bisa dihitung ulang** (tanpa hitungan, gambar/tampak, jam, rasio, kalimat) | **${mat.length - berhasil - temuanSemua.filter((x) => butirMatematika(x.b)).length}** |`,
    `| Butir non-Matematika berbaris Periksa (teks baca cepat) | ${lain.length} |`,
    `| Ekspresi Periksa dijalankan | ${ekspr.length}: benar ${hitungE('benar')} · salah ${hitungE('salah')} · galat ${hitungE('galat')} · format ${hitungE('format')} · tanpa hitungan ${hitungE('lewati')} |`,
    `| **Temuan (status → perlu_dicek)** | **${temuanSemua.length}** |`,
    '',
    `Pola hitung mandiri yang cocok: ${[...polaMandiri.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}.`,
    '',
  );
  const tidakAdaPilihan = mat.filter((x) => x.h.hitungMandiri?.hasil === 'tidak_ada_pilihan');
  if (temuanSemua.length === 0) tulis('**Temuan:** tidak ada. Tidak satu pun kunci bertentangan dengan hitungan ulang kode.', '');
  else {
    tulis('**Temuan:**', '', '| Butir | Berkas · baris | Temuan |', '|---|---|---|');
    for (const x of temuanSemua) tulis(`| ${x.b.id} | ${x.b.sumber} · ${x.b.baris} | ${x.h.temuan.join('; ').replace(/\|/g, '/')} |`);
    tulis('');
  }
  if (tidakAdaPilihan.length > 0) {
    tulis(
      'Hitung mandiri menghasilkan nilai yang tidak ada di pilihan mana pun (bukan temuan; biasanya pola soal lebih rumit dari yang dikenali kode):',
      '',
      ...tidakAdaPilihan.map((x) => `- ${x.b.id}: ${x.h.hitungMandiri?.pola} = ${x.h.hitungMandiri?.nilai}`),
      '',
    );
  }

  // temuan tercatat
  tulis(
    '## 5. Temuan yang sudah dicatat di `05-pemeriksaan/`',
    '',
    'Laporan mutu menyatakan **0 kunci salah** dari ±620 soal Matematika dan ±372 soal Bahasa Indonesia. Temuan ringan yang sengaja tidak diperbaiki penyusun dibawa ke paket sebagai `catatan` pada butirnya (status tetap `belum_diperiksa`, sebab kuncinya benar):',
    '',
    ...Object.entries(TEMUAN_TERCATAT).map(([id, t]) => `- **${id}** — ${t}`),
    '',
  );
  if (tercatatTidakKetemu.length > 0) tulis(`Tidak ditemukan di paket: ${tercatatTidakKetemu.join(', ')}.`, '');
  tulis(
    'Di luar butir: bantahan guru SD untuk M02 (`bantahan-M02-guru-sd.md`) — perubahan **waktu** kelas masih menunggu kelas uji coba. Ini menyangkut tabel menit pengajar, bukan isi soal, jadi tidak memengaruhi paket.',
    '',
  );

  // kode penyebab
  const kode: Record<string, number> = { B: 0, H: 0, S: 0, kosong: 0 };
  for (const b of semuaButir) for (const p of Object.values(b.pengecoh)) kode[p.kode ?? 'kosong']++;
  const nPengecoh = Object.values(kode).reduce((a, c) => a + c, 0);
  tulis(
    '## 6. Kode penyebab salah pada pengecoh',
    '',
    `${nPengecoh} alasan pengecoh terbaca. Kode **ditebak mesin** dari kata kunci alasan (belum diperiksa guru; rancangan meminta sampel 20% diperiksa guru): B (baca) ${kode.B} · H (hitung) ${kode.H} · S (salah paham) ${kode.S} · tanpa kode ${kode.kosong}.`,
    '',
    '## 7. Keputusan impor',
    '',
    '- **Id tetap:** `M02-k07` Soal 7 halaman 5 (● dan ○ memakai awalan sama supaya id tidak berubah kalau lambang diganti) · `M02-kz1` Kuis · `M02-tb1` Terbimbing · `M02-tk1` Tiket · `M01-d05` Diagnostik · `S1-05` Butir simulasi · `T05-q2` Pertanyaan teks.',
    '- **Topik butir** diambil dari baris `Kelompok` (topik yang benar-benar diuji, mis. soal "minggu lalu (M01)" di modul M02 bertopik M01; prasyarat `PR-M2` tetap `PR-M2`). Kuis memakai kalimat "Kuis 1–2 dari M01…". Pertanyaan 2 teks memakai kolom "Pertanyaan 2 melatih"; Pertanyaan 1 bertopik kode teksnya.',
    '- **Latihan rumah** = id soal ○ halaman 5, kecuali M01, B01, dan pertemuan simulasi (sama dengan lembar kerja anak bagian D).',
    '- **Petunjuk** berisi satu tahap (baris Petunjuk bahan); baris Langkah menjadi `pembahasan`. Bahan tidak memuat tahap ketiga, jadi tidak dikarang.',
    '- **Stimulus bersama simulasi** disalin ke setiap butirnya (`grupStimulus` menandai butir yang berbagi teks), supaya butir bisa dipakai sendiri.',
    '- Kuis, terbimbing, tiket, dan diagnostik ikut diimpor (terpisah dari soal halaman 5); rancangan menyatakan tiket tetap di kertas, jadi aplikasi boleh tidak menampilkannya.',
    '',
  );
  writeFileSync(KELUAR_LAPORAN, `${L.join('\n')}\n`, 'utf8');

  console.log(
    `Selesai: ${topik.length} topik, ${simulasi.length} simulasi, ${teks.length} teks, ${semuaButir.length} butir ` +
      `(gagal ${gagal.length}, peringatan ${peringatan.length}); kunci dihitung ulang ${berhasil}/${mat.length}, temuan ${temuanSemua.length}.`,
  );
}

utama();
