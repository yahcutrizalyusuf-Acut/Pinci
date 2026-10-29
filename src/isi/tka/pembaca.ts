/**
 * Pembaca format baku bahan Paket Siap TKA SD (`00-berkas-induk/04-standar-soal.md`).
 * Fungsi murni: menerima isi berkas Markdown (string), mengembalikan data + daftar masalah.
 * Logika `blokSoal` meniru `blok_soal` di `_alat/periksa.py`.
 */
import type {
  AsalButir,
  Bagian,
  Butir,
  ContohJadi,
  KodePenyebab,
  Mapel,
  Pengecoh,
  Pilihan,
  SalahPaham,
  Simulasi,
  Teks,
  Topik,
} from './jenis';

// ───────────────────────────── jenis bantu ─────────────────────────────

export interface MasalahBaca {
  berkas: string;
  baris: number;
  /** "gagal" = butir tidak dimasukkan ke paket; "peringatan" = dimasukkan dengan catatan */
  tingkat: 'gagal' | 'peringatan';
  alasan: string;
}

export interface SoalMentah {
  jenis: string;
  nomor: number;
  lambang: '●' | '○' | null;
  bentuk: 'PG' | 'PG kompleks' | 'PG kategori';
  badan: string;
  kunci: Record<string, string>;
  periksa: string[];
  /** nomor baris judul (mulai 1) */
  baris: number;
}

const JUDUL_SOAL =
  /^####\s+(Soal|Tiket|Kuis|Terbimbing|Contoh|Pertanyaan|Butir|Diagnostik)\s+(\d+)\s*([●○])?\s*·\s*(PG kompleks|PG kategori|PG)\s*$/;
const MIRIP_JUDUL_SOAL = /^####\s+(Soal|Tiket|Kuis|Terbimbing|Pertanyaan|Butir|Diagnostik)\b/;

/** CRLF → LF, spasi tak putus → spasi biasa, spasi di ujung baris dibuang. */
export function rapikanTeks(teks: string): string {
  return teks
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .split('\n')
    .map((b) => b.replace(/\s+$/, ''))
    .join('\n');
}

/** Tiruan `blok_soal` periksa.py, ditambah laporan judul yang mirip soal tetapi tidak sesuai format. */
export function blokSoal(teks: string): { soal: SoalMentah[]; judulRusak: { baris: number; isi: string }[] } {
  const baris = teks.split('\n');
  const soal: SoalMentah[] = [];
  const judulRusak: { baris: number; isi: string }[] = [];
  let i = 0;
  while (i < baris.length) {
    const m = JUDUL_SOAL.exec(baris[i]);
    if (!m) {
      if (MIRIP_JUDUL_SOAL.test(baris[i])) judulRusak.push({ baris: i + 1, isi: baris[i] });
      i++;
      continue;
    }
    let j = i + 1;
    const badan: string[] = [];
    const kunciBaris: string[] = [];
    while (j < baris.length && !/^(#### |### |## )/.test(baris[j])) {
      if (baris[j].startsWith('>')) kunciBaris.push(baris[j].slice(1).trim());
      else if (kunciBaris.length === 0) badan.push(baris[j]);
      j++;
    }
    const kunci: Record<string, string> = {};
    const periksa: string[] = [];
    for (const kb of kunciBaris) {
      const mm = /^\*\*(.+?):\*\*\s*(.*)$/.exec(kb);
      if (!mm) continue;
      const k = mm[1].trim();
      const v = mm[2].trim();
      if (k === 'Periksa') periksa.push(v);
      else kunci[k] = v;
    }
    soal.push({
      jenis: m[1],
      nomor: Number(m[2]),
      lambang: (m[3] as '●' | '○' | undefined) ?? null,
      bentuk: m[4] as SoalMentah['bentuk'],
      badan: badan.join('\n').trim(),
      kunci,
      periksa,
      baris: i + 1,
    });
    i = j;
  }
  return { soal, judulRusak };
}

// ───────────────────────────── teks dan bagian ─────────────────────────────

/** Ubah pecahan "3/4" → "{3/4}" dan pecahan campuran "1 1/2" → "{1 1/2}" (konvensi jenis.ts). */
export function tandaiPecahan(s: string): string {
  return s.replace(/(?<![\d.,/{])(?:(\d+) )?(\d+)\/(\d+)(?![\d/}])/g, (_m, bulat: string | undefined, a: string, b: string) =>
    bulat ? `{${bulat} ${a}/${b}}` : `{${a}/${b}}`,
  );
}

function selTabel(baris: string): string[] {
  let t = baris.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((s) => s.trim());
}

const BARIS_PEMISAH = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;

/** Baca blok kode bergaris kotak. Denah kalau setiap baris bersel berisi angka saja. */
function bagianKode(isi: string[]): Bagian {
  const baris = isi.filter((b) => b.trim() !== '');
  const barisSel = baris.filter((b) => b.includes('│'));
  if (barisSel.length > 0) {
    const petak: number[][] = [];
    let cocok = true;
    for (const b of barisSel) {
      const sel = b
        .split('│')
        .slice(1, -1)
        .map((s) => s.trim());
      if (sel.length === 0 || !sel.every((s) => /^\d+$/.test(s))) {
        cocok = false;
        break;
      }
      petak.push(sel.map(Number));
    }
    if (cocok && petak.every((r) => r.length === petak[0].length)) {
      const kotak = (b: string): boolean => /[│┌┐└┘├┤┬┴┼─]/.test(b);
      const iAwal = baris.findIndex(kotak);
      let iAkhir = baris.length - 1;
      while (iAkhir >= 0 && !kotak(baris[iAkhir])) iAkhir--;
      const atas = baris.slice(0, iAwal).map((b) => b.trim()).join(' ');
      const bawah = baris.slice(iAkhir + 1).map((b) => b.trim()).join(' ');
      const d: Bagian = { jenis: 'denah', petak };
      if (atas) d.atas = atas;
      if (bawah) d.bawah = bawah;
      return d;
    }
  }
  // gambar teks: buang baris kosong di ujung saja, spasi di dalam dipertahankan
  let awal = 0;
  let akhir = isi.length;
  while (awal < akhir && isi[awal].trim() === '') awal++;
  while (akhir > awal && isi[akhir - 1].trim() === '') akhir--;
  return { jenis: 'gambar_teks', baris: isi.slice(awal, akhir).map((b) => b.replace(/\s+$/, '')) };
}

const LABEL_DENAH = /^(belakang|tengah|depan)$/i;

function bagianTabel(barisTabel: string[]): Bagian {
  const baris = barisTabel.filter((b) => !BARIS_PEMISAH.test(b.trim())).map((b) => selTabel(b).map(tandaiPecahan));
  // Tabel denah: kolom pertama Belakang/Tengah/Depan, sisanya angka bulat
  if (baris.length >= 2) {
    const [kepala, ...isi] = baris;
    if (
      isi.every((r) => r.length === kepala.length && LABEL_DENAH.test(r[0]) && r.slice(1).every((s) => /^\d+$/.test(s)))
    ) {
      return {
        jenis: 'denah',
        petak: isi.map((r) => r.slice(1).map(Number)),
        kolom: kepala.slice(1),
        labelBaris: isi.map((r) => r[0]),
      };
    }
  }
  return { jenis: 'tabel', baris };
}

/** Pecah baris-baris Markdown menjadi bagian: paragraf, tabel, blok kode. */
export function uraiBagian(baris: string[]): Bagian[] {
  const hasil: Bagian[] = [];
  let i = 0;
  while (i < baris.length) {
    const b = baris[i];
    if (b.trim() === '') {
      i++;
      continue;
    }
    if (b.trim().startsWith('```')) {
      const isi: string[] = [];
      i++;
      while (i < baris.length && !baris[i].trim().startsWith('```')) isi.push(baris[i++]);
      i++; // penutup
      hasil.push(bagianKode(isi));
      continue;
    }
    if (b.trim().startsWith('|')) {
      const tbl: string[] = [];
      while (i < baris.length && baris[i].trim().startsWith('|')) tbl.push(baris[i++]);
      hasil.push(bagianTabel(tbl));
      continue;
    }
    const par: string[] = [];
    while (i < baris.length && baris[i].trim() !== '' && !baris[i].trim().startsWith('|') && !baris[i].trim().startsWith('```')) {
      par.push(baris[i++].trim());
    }
    hasil.push({ jenis: 'teks', isi: tandaiPecahan(par.join('\n')) });
  }
  return hasil;
}

// ───────────────────────────── kunci dan pengecoh ─────────────────────────────

/** Tebak kode penyebab salah dari kata kunci alasan pengecoh (belum diperiksa guru). */
export function tebakKodePenyebab(alasan: string): KodePenyebab | undefined {
  const a = alasan.toLowerCase();
  if (/salah paham \d/.test(a)) return 'S';
  if (
    /salah baca|salah membaca|membaca (baris|kolom|tabel|soal|sekilas)|baris (tabel )?yang salah|yang ditanya|ditanya|terlewat|tidak dibaca|tidak membaca|lupa (membagi|mengurangkan|menjumlahkan|mengalikan|langkah)|berhenti (setelah|sebelum)|pengetahuan (sendiri|umum)|tidak ada di (teks|paragraf|cerita)|di luar (teks|paragraf|cerita)|tidak (dibicarakan|disebut|tertulis)|menambah (hal|alasan)|mencocokkan kata|kata yang sama|hanya (melihat|membaca)/.test(
      a,
    )
  )
    return 'B';
  if (/salah fakta|fakta (keliru|tetangga|perkalian)|salah hitung|keliru menghitung|salah menghitung|meleset|selisih satu|salah simpan|lupa menyimpan|salah menjumlah|terburu-buru/.test(a))
    return 'H';
  if (/dikira|mengira|seolah|tertukar|dianggap|memakai (kpk|fpb)|langsung (dijumlah|dikali|dikurang|dibagi)|dijumlahkan|dikalikan|dikurangkan|urut dari kiri/.test(a))
    return 'S';
  return undefined;
}

/**
 * "A — alasan; B dan C — alasan; D — alasan." → { A: …, B: …, C: …, D: … }.
 * Untuk PG kategori kuncinya nomor pernyataan ("3 — alasan").
 */
export function uraiPengecoh(teks: string): Record<string, Pengecoh> {
  const hasil: Record<string, Pengecoh> = {};
  const pola = /(?:^|;\s*|\.\s+)((?:[A-E]|\d)(?:\s*(?:,|dan)\s*(?:[A-E]|\d))*)\s+—\s+/g;
  const temu: { label: string[]; mulai: number; akhir: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = pola.exec(teks)) !== null) {
    temu.push({ label: m[1].split(/\s*(?:,|dan)\s*/).map((s) => s.trim()), mulai: m.index, akhir: m.index + m[0].length });
  }
  temu.forEach((t, i) => {
    const ujung = i + 1 < temu.length ? temu[i + 1].mulai : teks.length;
    const alasan = tandaiPecahan(teks.slice(t.akhir, ujung).trim().replace(/[;.]\s*$/, ''));
    for (const label of t.label) {
      const p: Pengecoh = { alasan };
      const kode = tebakKodePenyebab(alasan);
      if (kode) p.kode = kode;
      const sp = /salah paham (\d)/i.exec(alasan);
      if (sp) p.salahPaham = Number(sp[1]);
      hasil[label] = p;
    }
  });
  return hasil;
}

export type KunciTerurai =
  | { bentuk: 'pg'; kunci: string }
  | { bentuk: 'pgk'; kunci: string[] }
  | { bentuk: 'pgkat'; kunci: ('B' | 'S')[] };

/** Urai baris Kunci sesuai bentuk; null kalau tidak sah (aturan sama dengan cek_kunci_bentuk). */
export function uraiKunci(teks: string, bentuk: SoalMentah['bentuk']): KunciTerurai | null {
  const k = teks.trim().replace(/\.$/, '');
  if (bentuk === 'PG') return /^[A-D]$/.test(k) ? { bentuk: 'pg', kunci: k } : null;
  if (bentuk === 'PG kompleks') {
    const hs = k.split(',').map((h) => h.trim());
    return hs.length >= 2 && hs.every((h) => /^[A-E]$/.test(h)) ? { bentuk: 'pgk', kunci: hs } : null;
  }
  const pasang = [...k.matchAll(/(\d+)-([BS])/g)];
  if (pasang.length < 2) return null;
  const urut = [...pasang].sort((a, b) => Number(a[1]) - Number(b[1]));
  if (urut.some((p, i) => Number(p[1]) !== i + 1)) return null;
  return { bentuk: 'pgkat', kunci: urut.map((p) => p[2] as 'B' | 'S') };
}

// ───────────────────────────── badan soal ─────────────────────────────

export interface BadanTerurai {
  stimulus: Bagian[];
  pertanyaan: string;
  pilihan: Pilihan[];
}

/** Pisahkan badan soal menjadi stimulus, pertanyaan, dan pilihan/pernyataan. */
export function uraiBadan(badan: string, bentuk: SoalMentah['bentuk']): BadanTerurai | string {
  const baris = badan.split('\n');
  const sisa: string[] = [];
  const pilihan: Pilihan[] = [];
  let dalamKode = false;
  let i = 0;
  while (i < baris.length) {
    const b = baris[i];
    if (b.trim().startsWith('```')) dalamKode = !dalamKode;
    if (!dalamKode && bentuk === 'PG kategori' && /^\|\s*Pernyataan\s*\|/.test(b.trim())) {
      i++;
      while (i < baris.length && baris[i].trim().startsWith('|')) {
        const t = baris[i].trim();
        i++;
        if (BARIS_PEMISAH.test(t)) continue;
        const sel = selTabel(t);
        const m = /^(\d+)\.\s*(.*)$/.exec(sel[0]);
        if (m) pilihan.push({ huruf: m[1], teks: tandaiPecahan(m[2]) });
      }
      continue;
    }
    const mp = !dalamKode && bentuk !== 'PG kategori' ? /^([A-E])\.\s+(.*)$/.exec(b.trim()) : null;
    if (mp) pilihan.push({ huruf: mp[1], teks: tandaiPecahan(mp[2].trim()) });
    else sisa.push(b);
    i++;
  }
  const bagian = uraiBagian(sisa);
  let iTanya = -1;
  for (let k = bagian.length - 1; k >= 0; k--) {
    if (bagian[k].jenis === 'teks') {
      iTanya = k;
      break;
    }
  }
  if (iTanya < 0) return 'badan soal tanpa kalimat pertanyaan';
  if (pilihan.length === 0) return bentuk === 'PG kategori' ? 'tabel pernyataan tidak ditemukan' : 'pilihan A–E tidak ditemukan';
  const tanya = bagian[iTanya];
  const stimulus = bagian.filter((_, k) => k !== iTanya);
  return { stimulus, pertanyaan: tanya.jenis === 'teks' ? tanya.isi : '', pilihan };
}

// ───────────────────────────── susun butir ─────────────────────────────

export interface KonteksButir {
  berkas: string;
  sumber: string;
  id: string;
  asal: AsalButir;
  topik: string;
  masalah: MasalahBaca[];
}

function kelompokDari(teks: string | undefined): { kelompok?: Butir['kelompok']; topik?: string } {
  if (!teks) return {};
  const t = teks.toLowerCase();
  const kelompok: Butir['kelompok'] = t.startsWith('hari ini')
    ? 'hari_ini'
    : t.startsWith('minggu lalu')
      ? 'minggu_lalu'
      : t.startsWith('bulan lalu')
        ? 'bulan_lalu'
        : undefined;
  const m = /(PR-[MB]\d+|[MB]\d{2})/.exec(teks);
  const hasil: { kelompok?: Butir['kelompok']; topik?: string } = {};
  if (kelompok) hasil.kelompok = kelompok;
  if (m) hasil.topik = m[1];
  return hasil;
}

/** Ubah satu SoalMentah menjadi Butir. Mengembalikan null (dan mencatat masalah) kalau gagal. */
export function susunButir(s: SoalMentah, kx: KonteksButir): Butir | null {
  const gagal = (alasan: string): null => {
    kx.masalah.push({ berkas: kx.berkas, baris: s.baris, tingkat: 'gagal', alasan: `${s.jenis} ${s.nomor}: ${alasan}` });
    return null;
  };
  const peringatan = (alasan: string): void => {
    kx.masalah.push({ berkas: kx.berkas, baris: s.baris, tingkat: 'peringatan', alasan: `${s.jenis} ${s.nomor}: ${alasan}` });
  };
  const kunciTeks = s.kunci['Kunci'];
  if (!kunciTeks) return gagal('tanpa baris Kunci');
  const kunci = uraiKunci(kunciTeks, s.bentuk);
  if (!kunci) return gagal(`kunci tidak sah untuk ${s.bentuk}: "${kunciTeks}"`);
  const badan = uraiBadan(s.badan, s.bentuk);
  if (typeof badan === 'string') return gagal(badan);

  const huruf = badan.pilihan.map((p) => p.huruf);
  if (new Set(huruf).size !== huruf.length) return gagal(`pilihan kembar: ${huruf.join(', ')}`);
  if (kunci.bentuk === 'pg') {
    if (!huruf.includes(kunci.kunci)) return gagal(`kunci ${kunci.kunci} tidak ada di pilihan`);
    if (huruf.join('') !== 'ABCD') peringatan(`pilihan PG bukan A–D: ${huruf.join(', ')}`);
  } else if (kunci.bentuk === 'pgk') {
    const hilang = kunci.kunci.filter((h) => !huruf.includes(h));
    if (hilang.length > 0) return gagal(`kunci ${hilang.join(', ')} tidak ada di pilihan`);
    if (kunci.kunci.length >= huruf.length) return gagal('PG kompleks: semua pilihan menjadi kunci');
  } else {
    if (kunci.kunci.length !== badan.pilihan.length)
      return gagal(`jumlah pernyataan (${badan.pilihan.length}) ≠ jumlah kunci (${kunci.kunci.length})`);
    if (new Set(kunci.kunci).size < 2) peringatan('PG kategori tanpa campuran Benar dan Salah');
  }

  const kenapaKey = Object.keys(s.kunci).find((k) => k.startsWith('Kenapa'));
  const pengecoh = kenapaKey ? uraiPengecoh(s.kunci[kenapaKey]) : {};
  if (!kenapaKey) peringatan('tanpa alasan pengecoh');
  if (!s.kunci['Petunjuk']) peringatan('tanpa Petunjuk');
  if (!s.kunci['Langkah']) peringatan('tanpa Langkah');

  // hanya pilihan yang salah yang boleh punya alasan pengecoh
  const salah =
    kunci.bentuk === 'pg'
      ? huruf.filter((h) => h !== kunci.kunci)
      : kunci.bentuk === 'pgk'
        ? huruf.filter((h) => !kunci.kunci.includes(h))
        : huruf.filter((_, i) => kunci.kunci[i] === 'S');
  for (const k of Object.keys(pengecoh)) if (!salah.includes(k)) delete pengecoh[k];
  if (kenapaKey && kunci.bentuk === 'pg') {
    const tanpa = salah.filter((h) => !pengecoh[h]);
    if (tanpa.length > 0) peringatan(`alasan pengecoh tidak ditemukan untuk ${tanpa.join(', ')}`);
  }

  const kel = kelompokDari(s.kunci['Kelompok']);
  const dasar = {
    id: kx.id,
    asal: kx.asal,
    sumber: kx.sumber,
    baris: s.baris,
    topik: kel.topik ?? kx.topik,
    ...(kel.kelompok ? { kelompok: kel.kelompok } : {}),
    ...(badan.stimulus.length > 0 ? { stimulus: badan.stimulus } : {}),
    pertanyaan: badan.pertanyaan,
    pilihan: badan.pilihan,
    pengecoh,
    ...(s.kunci['Petunjuk'] ? { petunjuk: [tandaiPecahan(s.kunci['Petunjuk'])] } : {}),
    ...(s.kunci['Langkah'] ? { pembahasan: tandaiPecahan(s.kunci['Langkah']) } : {}),
    ...(s.periksa.length > 0 ? { periksa: s.periksa } : {}),
    status: 'belum_diperiksa' as const,
  };
  if (kunci.bentuk === 'pg') return { ...dasar, bentuk: 'pg', kunci: kunci.kunci };
  if (kunci.bentuk === 'pgk') return { ...dasar, bentuk: 'pgk', kunci: kunci.kunci };
  return { ...dasar, bentuk: 'pgkat', kategori: ['Benar', 'Salah'], kunci: kunci.kunci };
}

// ───────────────────────────── stimulus bersama ─────────────────────────────

const LABEL_TEKS = /^\*\*Teks ([A-Z])\*\*$/;

/**
 * Lengkapi stimulus butir yang merujuk teks di soal lain:
 * - "**Teks A**" ditulis di badan satu soal, soal berikutnya hanya menulis "teks A";
 * - "Berdasarkan cerita di soal nomor 4" / "di soal Diagnostik 1".
 */
export function lengkapiStimulusRujukan(butir: { b: Butir; jenis: string; nomor: number }[]): string[] {
  const catatan: string[] = [];
  const definisi = new Map<string, Bagian[]>();
  for (const { b } of butir) {
    const st = b.stimulus ?? [];
    const i = st.findIndex((x) => x.jenis === 'teks' && LABEL_TEKS.test(x.isi));
    if (i >= 0) {
      const bg = st[i];
      const huruf = bg.jenis === 'teks' ? (LABEL_TEKS.exec(bg.isi)?.[1] ?? '') : '';
      definisi.set(huruf, st.slice(i));
    }
  }
  for (const item of butir) {
    const { b } = item;
    if (b.stimulus && b.stimulus.length > 0) continue;
    const rujukSoal = /di soal (?:nomor |Diagnostik )?(\d+)/i.exec(b.pertanyaan);
    if (rujukSoal) {
      const asal = butir.find((x) => x.jenis === item.jenis && x.nomor === Number(rujukSoal[1]));
      if (asal?.b.stimulus) {
        b.stimulus = asal.b.stimulus;
        catatan.push(`${b.id}: stimulus diambil dari ${asal.b.id}`);
        continue;
      }
    }
    const rujukTeks = /\b[Tt]eks ([A-Z])\b/.exec(b.pertanyaan);
    if (rujukTeks && definisi.has(rujukTeks[1])) {
      b.stimulus = definisi.get(rujukTeks[1]);
      catatan.push(`${b.id}: stimulus Teks ${rujukTeks[1]} disalin`);
    }
  }
  return catatan;
}

// ───────────────────────────── bagian berkas ─────────────────────────────

/** Potong berkas per judul "## …". */
export function potongHalaman(teks: string): { judul: string; mulai: number; isi: string[] }[] {
  const baris = teks.split('\n');
  const hasil: { judul: string; mulai: number; isi: string[] }[] = [];
  baris.forEach((b, i) => {
    const m = /^## (.+)$/.exec(b);
    if (m) hasil.push({ judul: m[1].trim(), mulai: i + 1, isi: [] });
    else if (hasil.length > 0) hasil[hasil.length - 1].isi.push(b);
  });
  return hasil;
}

/** Ambil isi subjudul "### <judul>" sampai judul berikutnya (###, ##, atau ####). */
export function ambilSub(isi: string[], judul: string | RegExp): string[] | null {
  const i = isi.findIndex((b) => {
    const m = /^### (.+)$/.exec(b);
    return !!m && (typeof judul === 'string' ? m[1].trim() === judul : judul.test(m[1].trim()));
  });
  if (i < 0) return null;
  const hasil: string[] = [];
  for (let j = i + 1; j < isi.length; j++) {
    if (/^(#### |### |## )/.test(isi[j])) break;
    hasil.push(isi[j]);
  }
  return hasil;
}

function bacaTabel(baris: string[]): string[][] {
  return baris.filter((b) => b.trim().startsWith('|') && !BARIS_PEMISAH.test(b.trim())).map(selTabel);
}

const hapusTebal = (s: string): string => s.replace(/\*\*(.+?)\*\*/g, '$1');

function judulBerkas(teks: string): string {
  const m = /^# (.+)$/m.exec(teks);
  return m ? m[1].trim() : '';
}

/** "M02 — Faktor, Kelipatan" → "Faktor, Kelipatan" */
function judulSesudahTanda(judul: string): string {
  const i = judul.indexOf('—');
  return i >= 0 ? judul.slice(i + 1).trim() : judul;
}

// ───────────────────────────── modul ─────────────────────────────

const KODE_SIMULASI = new Set(['M08', 'M14', 'M20', 'M24', 'B12']);

function uraiContohJadi(isi: string[], berkas: string, mulaiBaris: number, masalah: MasalahBaca[]): ContohJadi[] {
  const hasil: ContohJadi[] = [];
  for (let n = 1; n <= 9; n++) {
    const sub = ambilSub(isi, `Contoh jadi ${n}`);
    if (!sub) break;
    const iSoal = sub.findIndex((b) => b.startsWith('**Soal:**'));
    const iTabel = sub.findIndex((b) => /^\|\s*Langkah\s*\|/.test(b.trim()));
    const iJawab = sub.findIndex((b) => b.startsWith('**Jawaban:**'));
    if (iSoal < 0 || iTabel < 0 || iJawab < 0) {
      masalah.push({
        berkas,
        baris: mulaiBaris,
        tingkat: 'peringatan',
        alasan: `Contoh jadi ${n}: ${iSoal < 0 ? 'tanpa **Soal:**' : iTabel < 0 ? 'tanpa tabel Langkah' : 'tanpa **Jawaban:**'} — dilewati`,
      });
      continue;
    }
    const soalBaris = [sub[iSoal].replace('**Soal:**', '').trim(), ...sub.slice(iSoal + 1, iTabel)];
    const tabel: string[] = [];
    for (let j = iTabel; j < sub.length && sub[j].trim().startsWith('|'); j++) tabel.push(sub[j]);
    const rows = bacaTabel(tabel);
    const kepala = rows[0] ?? [];
    const iPapan = kepala.findIndex((k) => /ditulis di papan|ditunjuk|papan/i.test(k));
    const iUcap = kepala.findIndex((k) => /diucapkan/i.test(k));
    const langkah: string[] = [];
    const penjelasan: string[] = [];
    for (const r of rows.slice(1)) {
      langkah.push(tandaiPecahan(r[iPapan >= 0 ? iPapan : 1] ?? ''));
      const u = (r[iUcap >= 0 ? iUcap : 2] ?? '').replace(/^\*"?|"?\*$/g, '').replace(/^"|"$/g, '');
      penjelasan.push(tandaiPecahan(u));
    }
    hasil.push({
      soal: uraiBagian(soalBaris),
      langkah,
      penjelasan,
      jawaban: tandaiPecahan(sub[iJawab].replace('**Jawaban:**', '').trim()),
    });
  }
  return hasil;
}

/** Peta "Kuis 1–2 dari M01, Kuis 3 dari PR-M1" → {1: M01, 2: M01, 3: PR-M1} */
function petaKuis(isi: string[]): Map<number, string> {
  const peta = new Map<number, string>();
  const sub = ambilSub(isi, 'Kuis pembuka');
  if (!sub) return peta;
  const teks = sub.join(' ');
  for (const m of teks.matchAll(/Kuis (\d+)(?:\s*[–-]\s*(\d+))? dari (PR-[MB]\d+|[MB]\d{2})/g)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let k = a; k <= b; k++) peta.set(k, m[3]);
  }
  return peta;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

export interface HasilModul {
  topik: Topik;
  masalah: MasalahBaca[];
  catatan: string[];
  /** isi tabel "Peta soal" halaman 5: nomor → [lambang, kelompok, topik, bentuk] */
  petaSoal: Map<number, string[]>;
}

export function bacaModul(teksMentah: string, berkas: string): HasilModul {
  const teks = rapikanTeks(teksMentah);
  const masalah: MasalahBaca[] = [];
  const judulLengkap = judulBerkas(teks);
  const kode = /^([MB]\d{2})/.exec(judulLengkap)?.[1] ?? berkas.slice(0, 3);
  const mapel: Mapel = kode.startsWith('M') ? 'mat' : 'bi';
  const halaman = potongHalaman(teks);
  const awalBerkas = teks.split('\n');
  const iHal1 = awalBerkas.findIndex((b) => b.startsWith('## '));
  const kepala = bacaTabel(awalBerkas.slice(0, iHal1 < 0 ? 20 : iHal1));
  const barisKode = kepala.find((r) => r[0] === kode) ?? [];
  const pertemuan = barisKode[1] ?? '';
  const minggu = Number(/^(\d+)/.exec(barisKode[2] ?? '')?.[1] ?? 0);
  const teksBacaCepat = /T\d{2}/.exec(barisKode[5] ?? '')?.[0];

  const hal = (awalan: string): { isi: string[]; mulai: number } => {
    const h = halaman.find((x) => x.judul.startsWith(awalan));
    return h ? { isi: h.isi, mulai: h.mulai } : { isi: [], mulai: 0 };
  };
  const h1 = hal('Halaman 1');
  const h2 = hal('Halaman 2');
  const h3 = hal('Halaman 3');
  const h5 = hal('Halaman 5');

  const sasaranBaris = ambilSub(h1.isi, 'Sasaran') ?? [];
  const sasaran = tandaiPecahan(
    uraiBagian(sasaranBaris)
      .map((b) => (b.jenis === 'teks' ? b.isi : ''))
      .filter(Boolean)
      .join('\n\n'),
  );
  if (!sasaran) masalah.push({ berkas, baris: h1.mulai, tingkat: 'peringatan', alasan: 'tanpa ### Sasaran' });

  const spBaris = ambilSub(h1.isi, 'Tiga salah paham') ?? [];
  const salahPaham: SalahPaham[] = bacaTabel(spBaris)
    .filter((r) => /^\d+$/.test(r[0]))
    .map((r) => {
      const sp: SalahPaham = { kode: r[0], teks: tandaiPecahan(hapusTebal(r[1] ?? '')) };
      if (r[2]) sp.contoh = tandaiPecahan(r[2]);
      return sp;
    });
  if (salahPaham.length !== 3)
    masalah.push({ berkas, baris: h1.mulai, tingkat: 'peringatan', alasan: `salah paham terbaca ${salahPaham.length} (harus 3)` });

  const contohJadi = uraiContohJadi(h3.isi, berkas, h3.mulai, masalah);

  // peta soal halaman 5
  const petaSoal = new Map<number, string[]>();
  for (const r of bacaTabel(ambilSub(h5.isi, 'Peta soal') ?? [])) {
    if (/^\d+$/.test(r[0])) petaSoal.set(Number(r[0]), r.slice(1));
  }

  const { soal, judulRusak } = blokSoal(teks);
  for (const j of judulRusak) masalah.push({ berkas, baris: j.baris, tingkat: 'gagal', alasan: `judul soal tidak sesuai format: "${j.isi}"` });
  const kuisTopik = petaKuis(h2.isi);
  const awalH5 = h5.mulai;
  const akhirH5 = halaman.find((x) => x.judul.startsWith('Halaman 6'))?.mulai ?? Number.MAX_SAFE_INTEGER;

  const topik: Topik = {
    id: kode,
    mapel,
    judul: judulSesudahTanda(judulLengkap),
    pertemuan,
    minggu,
    ...(teksBacaCepat ? { teksBacaCepat } : {}),
    simulasi: KODE_SIMULASI.has(kode),
    sasaran,
    salahPaham,
    contohJadi,
    soalKelas: [],
    soalCadangan: [],
    latihanRumah: [],
    terbimbing: [],
    kuis: [],
    tiket: [],
    diagnostik: [],
  };

  const semua: { b: Butir; jenis: string; nomor: number }[] = [];
  for (const s of soal) {
    if (s.jenis === 'Contoh') continue;
    let asal: AsalButir;
    let id: string;
    let topikButir = kode;
    switch (s.jenis) {
      case 'Soal':
        if (s.baris < awalH5 || s.baris > akhirH5) {
          masalah.push({ berkas, baris: s.baris, tingkat: 'peringatan', alasan: `Soal ${s.nomor} di luar Halaman 5` });
        }
        asal = s.lambang === '○' ? 'soal_cadangan' : 'soal_kelas';
        id = `${kode}-k${pad2(s.nomor)}`;
        break;
      case 'Kuis':
        asal = 'kuis';
        id = `${kode}-kz${s.nomor}`;
        topikButir = kuisTopik.get(s.nomor) ?? kode;
        break;
      case 'Terbimbing':
        asal = 'terbimbing';
        id = `${kode}-tb${s.nomor}`;
        break;
      case 'Tiket':
        asal = 'tiket';
        id = `${kode}-tk${s.nomor}`;
        break;
      case 'Diagnostik':
        asal = 'diagnostik';
        id = `${kode}-d${pad2(s.nomor)}`;
        break;
      default:
        masalah.push({ berkas, baris: s.baris, tingkat: 'gagal', alasan: `jenis soal "${s.jenis}" tidak dikenal di modul` });
        continue;
    }
    if (s.jenis === 'Soal' && !s.lambang) {
      masalah.push({ berkas, baris: s.baris, tingkat: 'gagal', alasan: `Soal ${s.nomor} tanpa lambang ● atau ○` });
      continue;
    }
    const b = susunButir(s, { berkas, sumber: kode, id, asal, topik: topikButir, masalah });
    if (!b) continue;
    semua.push({ b, jenis: s.jenis, nomor: s.nomor });
    // cocokkan dengan Peta soal
    if (s.jenis === 'Soal') {
      const peta = petaSoal.get(s.nomor);
      if (!peta) {
        masalah.push({ berkas, baris: s.baris, tingkat: 'peringatan', alasan: `Soal ${s.nomor} tidak ada di Peta soal` });
      } else {
        const [lambang, , topikPeta, bentukPeta] = peta;
        const kodePeta = /(PR-[MB]\d+|[MB]\d{2})/.exec(topikPeta ?? '')?.[1];
        if (lambang !== s.lambang || kodePeta !== b.topik || bentukPeta !== s.bentuk) {
          masalah.push({
            berkas,
            baris: s.baris,
            tingkat: 'peringatan',
            alasan: `Soal ${s.nomor} tidak sama dengan Peta soal (peta: ${peta.join(' · ')}; soal: ${s.lambang} · ${b.topik} · ${s.bentuk})`,
          });
        }
      }
    }
  }
  const catatan = lengkapiStimulusRujukan(semua);
  for (const { b, jenis } of semua) {
    switch (jenis) {
      case 'Soal':
        (b.asal === 'soal_kelas' ? topik.soalKelas : topik.soalCadangan).push(b);
        break;
      case 'Kuis':
        topik.kuis.push(b);
        break;
      case 'Terbimbing':
        topik.terbimbing.push(b);
        break;
      case 'Tiket':
        topik.tiket.push(b);
        break;
      case 'Diagnostik':
        topik.diagnostik.push(b);
        break;
    }
  }
  if (kode !== 'M01' && kode !== 'B01' && !topik.simulasi) topik.latihanRumah = topik.soalCadangan.map((b) => b.id);
  return { topik, masalah, catatan, petaSoal };
}

// ───────────────────────────── simulasi ─────────────────────────────

export interface HasilSimulasi {
  simulasi: Simulasi;
  masalah: MasalahBaca[];
  /** isi tabel Kunci ringkas: nomor → [kunci, topik, bentuk] */
  kunciRingkas: Map<number, string[]>;
}

export function bacaSimulasi(teksMentah: string, berkas: string): HasilSimulasi {
  const teks = rapikanTeks(teksMentah);
  const masalah: MasalahBaca[] = [];
  const judulLengkap = judulBerkas(teks);
  const id = /^(S\d)/.exec(judulLengkap)?.[1] ?? berkas.slice(0, 2);
  const baris = teks.split('\n');
  const iNaskah = baris.findIndex((b) => b.startsWith('## '));
  const kepala = bacaTabel(baris.slice(0, iNaskah < 0 ? 20 : iNaskah));
  const nilai = (nama: RegExp): string => kepala.find((r) => nama.test(r[0]))?.[1] ?? '';
  const waktuMenit = Number(/(\d+)\s*menit/.exec(nilai(/^Waktu$/))?.[1] ?? 0);
  if (!waktuMenit) masalah.push({ berkas, baris: 1, tingkat: 'peringatan', alasan: 'waktu simulasi tidak terbaca' });
  const dipakaiDi = /([MB]\d{2})/.exec(nilai(/^Dipakai di$/) || judulLengkap)?.[1] ?? '';
  const mapel: Mapel = dipakaiDi.startsWith('B') ? 'bi' : 'mat';

  // rentang stimulus bergrup dari kepala berkas, misal "A: butir 1–3 · B: butir 9–12"
  const rentang = new Map<string, [number, number]>();
  for (const m of nilai(/^Stimulus bergrup$/).matchAll(/([A-Z]):\s*butir\s*(\d+)\s*[–-]\s*(\d+)/g)) {
    rentang.set(m[1], [Number(m[2]), Number(m[3])]);
  }

  // stimulus bersama: "### Stimulus A: judul"
  const stimulus = new Map<string, { judul: string; bagian: Bagian[]; baris: number }>();
  const judul3: { baris: number; huruf: string | null }[] = [];
  baris.forEach((b, i) => {
    const m = /^### (.+)$/.exec(b);
    if (!m) return;
    const ms = /^Stimulus ([A-Z]):\s*(.+)$/.exec(m[1].trim());
    judul3.push({ baris: i + 1, huruf: ms ? ms[1] : null });
    if (ms) {
      const isi: string[] = [];
      for (let j = i + 1; j < baris.length && !/^(#### |### |## )/.test(baris[j]); j++) isi.push(baris[j]);
      stimulus.set(ms[1], { judul: `Teks ${ms[1]}: ${ms[2].trim()}`, bagian: uraiBagian(isi), baris: i + 1 });
    }
  });

  const kunciRingkas = new Map<number, string[]>();
  const hKunci = potongHalaman(teks).find((h) => h.judul.startsWith('Kunci ringkas'));
  for (const r of bacaTabel(hKunci?.isi ?? [])) if (/^\d+$/.test(r[0])) kunciRingkas.set(Number(r[0]), r.slice(1));

  const { soal, judulRusak } = blokSoal(teks);
  for (const j of judulRusak) masalah.push({ berkas, baris: j.baris, tingkat: 'gagal', alasan: `judul soal tidak sesuai format: "${j.isi}"` });
  const butir: Butir[] = [];
  for (const s of soal) {
    if (s.jenis !== 'Butir') {
      masalah.push({ berkas, baris: s.baris, tingkat: 'peringatan', alasan: `${s.jenis} ${s.nomor} di berkas simulasi diabaikan` });
      continue;
    }
    const b = susunButir(s, { berkas, sumber: id, id: `${id}-${pad2(s.nomor)}`, asal: 'simulasi', topik: dipakaiDi, masalah });
    if (!b) continue;
    // stimulus bersama
    let huruf: string | null = null;
    if (rentang.size > 0) {
      for (const [h, [a, z]] of rentang) if (s.nomor >= a && s.nomor <= z) huruf = h;
    } else {
      const sebelum = judul3.filter((j) => j.baris < s.baris).pop();
      huruf = sebelum?.huruf ?? null;
    }
    const rujuk = /\b[Tt]eks ([A-Z])\b/.exec(b.pertanyaan);
    if (rujuk && stimulus.has(rujuk[1]) && rujuk[1] !== huruf) {
      masalah.push({
        berkas,
        baris: s.baris,
        tingkat: 'peringatan',
        alasan: `Butir ${s.nomor} menyebut teks ${rujuk[1]} tetapi letaknya di stimulus ${huruf ?? '-'}; dipakai teks ${rujuk[1]}`,
      });
      huruf = rujuk[1];
    }
    if (huruf) {
      const st = stimulus.get(huruf);
      if (st) {
        b.stimulus = [...st.bagian, ...(b.stimulus ?? [])];
        b.judulStimulus = st.judul;
        b.grupStimulus = `${id}-${huruf}`;
      }
    }
    // cocokkan dengan Kunci ringkas
    const kr = kunciRingkas.get(s.nomor);
    if (kr) {
      const kunciBaku = (x: string): string => x.replace(/\s+/g, '');
      if (kunciBaku(kr[0]) !== kunciBaku(s.kunci['Kunci'] ?? '') || kr[1] !== b.topik) {
        masalah.push({
          berkas,
          baris: s.baris,
          tingkat: 'peringatan',
          alasan: `Butir ${s.nomor} tidak sama dengan Kunci ringkas (ringkas: ${kr.join(' · ')}; butir: ${s.kunci['Kunci']} · ${b.topik})`,
        });
      }
    }
    butir.push(b);
  }
  return {
    simulasi: { id, mapel, judul: judulSesudahTanda(judulLengkap), dipakaiDi, waktuMenit, butir },
    masalah,
    kunciRingkas,
  };
}

// ───────────────────────────── teks baca cepat ─────────────────────────────

/** Cara menghitung kata yang sama dengan `kata()` di periksa.py. */
export function hitungKata(s: string): number {
  return (s.match(/[0-9A-Za-zÀ-ÿ][0-9A-Za-zÀ-ÿ.,%/'’-]*/g) ?? []).length;
}

export function bacaTeks(teksMentah: string, berkas: string): { teks: Teks; masalah: MasalahBaca[]; kataTerhitung: number } {
  const teks = rapikanTeks(teksMentah);
  const masalah: MasalahBaca[] = [];
  const judulLengkap = judulBerkas(teks);
  const id = /^(T\d{2})/.exec(judulLengkap)?.[1] ?? berkas.slice(0, 3);
  const baris = teks.split('\n');
  const iPertama = baris.findIndex((b) => b.startsWith('## '));
  const kepala = bacaTabel(baris.slice(0, iPertama < 0 ? 10 : iPertama));
  const judulKolom = kepala[0] ?? [];
  const isiKolom = kepala[1] ?? [];
  const kolom = (nama: RegExp): string => {
    const i = judulKolom.findIndex((k) => nama.test(k));
    return i >= 0 ? (isiKolom[i] ?? '') : '';
  };
  const jumlahKata = Number(kolom(/^Jumlah kata$/).replace(/\D/g, '') || 0);
  const sw = /(\d+)\s*menit(?:\s*(\d+)\s*detik)?/.exec(kolom(/^Sasaran waktu baca$/));
  const melatih = /([MB]\d{2})/.exec(kolom(/Pertanyaan 2 melatih/))?.[1];
  const halaman = potongHalaman(teks);
  const hTeks = halaman.find((h) => h.judul === 'Teks');
  if (!hTeks) masalah.push({ berkas, baris: 1, tingkat: 'gagal', alasan: 'tanpa bagian ## Teks' });
  const isi = uraiBagian(hTeks?.isi ?? []);
  const polos = (hTeks?.isi ?? []).filter((b) => !/^(\||```|#)/.test(b)).join('\n');
  const kataTerhitung = hitungKata(polos);

  const { soal, judulRusak } = blokSoal(teks);
  for (const j of judulRusak) masalah.push({ berkas, baris: j.baris, tingkat: 'gagal', alasan: `judul soal tidak sesuai format: "${j.isi}"` });
  const pertanyaan: Butir[] = [];
  for (const s of soal) {
    if (s.jenis !== 'Pertanyaan') {
      masalah.push({ berkas, baris: s.baris, tingkat: 'peringatan', alasan: `${s.jenis} ${s.nomor} di berkas teks diabaikan` });
      continue;
    }
    // Pertanyaan 2 melatih topik tertentu (kolom kepala berkas); Pertanyaan 1 umum → kode teks
    const topik = s.nomor === 2 && melatih ? melatih : id;
    const b = susunButir(s, { berkas, sumber: id, id: `${id}-q${s.nomor}`, asal: 'baca_cepat', topik, masalah });
    if (b) pertanyaan.push(b);
  }
  const mapelHari: Mapel = /matematika/i.test(kolom(/^Mapel/)) ? 'mat' : 'bi';
  const t: Teks = {
    id,
    judul: judulSesudahTanda(judulLengkap),
    jenis: kolom(/^Jenis teks$/),
    pertemuan: kolom(/^Pertemuan$/),
    mapelHari,
    isi,
    jumlahKata,
    ...(sw ? { sasaranDetik: Number(sw[1]) * 60 + Number(sw[2] ?? 0) } : {}),
    ...(melatih ? { melatih } : {}),
    pertanyaan,
  };
  return { teks: t, masalah, kataTerhitung };
}
