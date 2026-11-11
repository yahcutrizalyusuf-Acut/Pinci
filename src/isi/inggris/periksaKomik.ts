/**
 * Pemeriksa naskah komik otomatis (PROMPT-LANJUTAN-KOMIK tahap 1.4). Dipakai `scripts/periksa-komik.ts` dan uji Jest.
 * Mengembalikan daftar masalah; kosong = lulus.
 */
import type { PaketInggris, UnitInggris } from './jenis';
import type { Komik, PaketKomik, PaketTokoh } from './komik';

/** Batas per tingkat (`13` bagian 2). */
export const BATAS_TINGKAT: Record<3 | 4 | 5 | 6, { panelMin: number; panelMaks: number; kataPerGelembung: number }> = {
  3: { panelMin: 4, panelMaks: 5, kataPerGelembung: 6 },
  4: { panelMin: 5, panelMaks: 6, kataPerGelembung: 8 },
  5: { panelMin: 6, panelMaks: 6, kataPerGelembung: 10 },
  6: { panelMin: 6, panelMaks: 8, kataPerGelembung: 12 },
};

/** Paling banyak kata baru di luar daftar per komik (`13` bagian 2: "paling banyak 2 kata baru, jelas dari gambar"). */
export const BATAS_KATA_LUAR = 2;

/** Kata seru: tidak dihitung sebagai kata di luar daftar. */
export const KATA_SERU = new Set(['oh', 'wow', 'yay', 'hooray', 'oops', 'uh', 'um', 'hmm', 'ha', 'haha', 'ah', 'aha', 'shh', 'ouch', 'whoa', 'yum', 'yummy', 'beep', 'boop', 'ok', 'okay']);

/**
 * Kata fungsi dasar yang dianggap sudah dikenal anak tingkat 3 (penghubung kalimat, bukan kosakata tema).
 * Keputusan pembangunan: tanpa daftar ini hampir semua kalimat gagal, padahal rancangan mengukur kosakata tema.
 */
export const KATA_FUNGSI = new Set([
  'a', 'an', 'the', 'is', 'am', 'are', 'i', "i'm", 'you', 'it', "it's", 'this', 'that', 'my', 'your', 'and', 'to', 'in', 'on', 'at', 'of',
  'yes', 'no', 'not', 'we', 'they', 'he', 'she', 'me', 'us', 'let', "let's", 'do', 'can', 'look', 'here', 'there', 'what', 'who', 'too', 'very',
  'with', 'for', 'is', 'go', 'come', 'see', 'like', 'have', 'has',
]);

/** Kata terlarang: kekerasan atau adegan menakutkan (CLAUDE.md aturan 13). */
export const KATA_TERLARANG = ['senjata', 'darah', 'bunuh', 'mati', 'pistol', 'pisau', 'pedang', 'bom', 'tembak', 'pukul', 'hantu', 'setan', 'gun', 'knife', 'blood', 'kill', 'dead', 'die', 'sword', 'bomb', 'shoot', 'punch', 'ghost', 'monster', 'devil'];

/** Nama tokoh kartun yang sudah ada (tidak boleh ditiru). */
export const NAMA_KARTUN = ['upin', 'ipin', 'doraemon', 'nobita', 'shizuka', 'giant', 'suneo', 'spongebob', 'patrick', 'pikachu', 'naruto', 'elsa', 'mickey', 'boboiboy', 'adit', 'sopo', 'jarwo', 'shiva', 'masha', 'peppa', 'dora', 'tayo', 'pororo', 'baymax', 'wall-e', 'astro'];

/** Pecah teks Inggris menjadi kata huruf kecil; penanda `{id}` (nama tokoh) dibuang. */
export function pecahKata(teks: string): string[] {
  return teks
    .replace(/\{[a-z_]+\}/g, ' ')
    .toLowerCase()
    .replace(/[^a-z' -]/g, ' ')
    .split(/\s+/)
    .map((k) => k.replace(/^'+|'+$/g, ''))
    .filter(Boolean);
}

/** Kata yang sudah dipelajari sampai unit ini: kosakata dan pola kalimat unit ini dan unit sebelumnya (tingkat ini dan tingkat di bawahnya). */
export function daftarKataSampai(paketSemua: PaketInggris[], unitId: string): Set<string> {
  const kata = new Set<string>();
  const tingkat = Number(unitId.slice(1, 2));
  const nomor = Number(unitId.slice(-2));
  for (const p of paketSemua) {
    for (const u of p.unit) {
      if (p.tingkat < tingkat || (p.tingkat === tingkat && u.nomor <= nomor)) {
        for (const k of [...u.kosakata, ...(u.kataKomik ?? [])]) for (const w of pecahKata(k.kata)) kata.add(w);
        for (const pl of u.pola) for (const w of pecahKata(pl.kalimat)) kata.add(w);
      }
    }
  }
  return kata;
}

/** Bentuk dasar sederhana untuk mencocokkan jamak dan kata kerja (+s, +es). */
function cocokDaftar(w: string, daftar: Set<string>): boolean {
  if (daftar.has(w) || KATA_FUNGSI.has(w) || KATA_SERU.has(w)) return true;
  if (w.endsWith('es') && daftar.has(w.slice(0, -2))) return true;
  if (w.endsWith('s') && daftar.has(w.slice(0, -1))) return true;
  if (w.endsWith("'s") && daftar.has(w.slice(0, -2))) return true;
  return false;
}

export function semuaTeksKomik(k: Komik): string[] {
  return k.panel.flatMap((p) => p.gelembung.map((g) => g.teks));
}

/** Periksa satu komik. `unit` = unit paket yang dirujuk; `paketSemua` = paket inggris untuk daftar kata. */
export function periksaSatuKomik(k: Komik, unit: UnitInggris | undefined, paketSemua: PaketInggris[], tokoh: PaketTokoh): string[] {
  const m: string[] = [];
  const awal = `${k.id}:`;
  if (!unit) return [`${awal} unit ${k.unit} tidak ada di paket inggris`];
  const batas = BATAS_TINGKAT[k.tingkat];
  const idTokoh = new Set(tokoh.tokoh.map((t) => t.id));

  // jumlah panel
  if (k.panel.length < batas.panelMin || k.panel.length > batas.panelMaks)
    m.push(`${awal} jumlah panel ${k.panel.length}, harus ${batas.panelMin}–${batas.panelMaks} untuk tingkat ${k.tingkat}`);

  // isi wajib
  if (!k.pesanAkhlak?.trim()) m.push(`${awal} tanpa pesan akhlak`);
  if (!k.pesanHariIni?.inggris?.trim() || !k.pesanHariIni?.arti?.trim()) m.push(`${awal} tanpa Pesan Hari Ini lengkap`);
  if (!k.naskahOrangTua?.renungan?.trim()) m.push(`${awal} tanpa pertanyaan renungan`);
  if (!k.naskahOrangTua?.pancingan?.trim()) m.push(`${awal} tanpa pertanyaan pancingan`);
  if (!k.naskahOrangTua?.langkah?.length) m.push(`${awal} tanpa langkah naskah orang tua`);
  if (!k.perbuatanBaik?.trim()) m.push(`${awal} tanpa ajakan perbuatan baik`);
  if (!['belum_diperiksa', 'perlu_dicek', 'layak'].includes(k.status)) m.push(`${awal} status tidak dikenal`);

  // panel dan gelembung
  const idPanel = new Set<string>();
  const gelembung = new Map<string, { tokoh: string; teks: string; panel: string }>();
  k.panel.forEach((p, n) => {
    idPanel.add(p.id);
    if (p.nomor !== n + 1) m.push(`${awal} panel ${p.id} bernomor ${p.nomor}, seharusnya ${n + 1}`);
    if (!p.kataBantu?.length) m.push(`${awal} panel ${p.nomor} tanpa kata bantu`);
    if (!p.tipsBunyi?.length) m.push(`${awal} panel ${p.nomor} tanpa tips bunyi`);
    if (!p.gelembung.length) m.push(`${awal} panel ${p.nomor} tanpa gelembung`);
    if (p.gelembung.length > 2 && k.tingkat <= 4) m.push(`${awal} panel ${p.nomor} punya ${p.gelembung.length} gelembung (maks 2)`);
    for (const t of p.tokoh) if (!idTokoh.has(t.tokoh)) m.push(`${awal} panel ${p.nomor} memakai tokoh tak dikenal "${t.tokoh}"`);
    for (const g of p.gelembung) {
      if (gelembung.has(g.id)) m.push(`${awal} id gelembung ganda ${g.id}`);
      gelembung.set(g.id, { tokoh: g.tokoh, teks: g.teks, panel: p.id });
      if (!idTokoh.has(g.tokoh) && g.tokoh !== 'semua') m.push(`${awal} gelembung ${g.id} diucapkan tokoh tak dikenal "${g.tokoh}"`);
      const n2 = pecahKata(g.teks).length;
      if (n2 > batas.kataPerGelembung) m.push(`${awal} gelembung ${g.id} berisi ${n2} kata (maks ${batas.kataPerGelembung})`);
      if (!g.arti?.trim()) m.push(`${awal} gelembung ${g.id} tanpa arti`);
      for (const id of [...g.teks.matchAll(/\{([a-z_]+)\}/g)].map((x) => x[1]))
        if (!idTokoh.has(id)) m.push(`${awal} gelembung ${g.id} memakai penanda nama tak dikenal {${id}}`);
    }
  });

  // nama tokoh tidak boleh ditulis langsung (harus lewat penanda `{id}`)
  const semua = semuaTeksKomik(k);
  const semuaArti = k.panel.flatMap((p) => p.gelembung.map((g) => g.arti));
  for (const t of tokoh.tokoh) {
    if (t.peran === 'narator') continue;
    const pola = new RegExp(`\\b${t.nama.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const naskah = [...k.panel.map((p) => p.adegan), ...k.naskahOrangTua.langkah, k.naskahOrangTua.renungan, k.naskahOrangTua.pancingan, k.perbuatanBaik, k.pesanAkhlak];
    for (const teks of [...semua, ...semuaArti, k.judul, ...naskah]) if (pola.test(teks.replace(/\{[a-z_]+\}/g, ' '))) m.push(`${awal} nama "${t.nama}" ditulis langsung; pakai {${t.id}}`);
  }

  // kata target: harus kosakata unit dan muncul di komik
  const kosakata = new Set([...unit.kosakata, ...(unit.kataKomik ?? [])].map((x) => x.kata.toLowerCase()));
  const teksKecil = ` ${semua.map((t) => pecahKata(t).join(' ')).join(' | ')} `;
  if (k.kataTarget.length < 4 || k.kataTarget.length > 8) m.push(`${awal} kata target ${k.kataTarget.length}, harus 4–8`);
  for (const kt of k.kataTarget) {
    if (!kosakata.has(kt.toLowerCase())) m.push(`${awal} kata target "${kt}" bukan kosakata unit ${unit.id}`);
    const frasa = pecahKata(kt).join(' ');
    if (!teksKecil.includes(` ${frasa} `) && !teksKecil.includes(` ${frasa}s `)) m.push(`${awal} kata target "${kt}" tidak muncul di komik`);
  }

  // kata di luar daftar
  const daftar = daftarKataSampai(paketSemua, unit.id);
  const luar = new Set<string>();
  for (const t of semua) for (const w of pecahKata(t)) if (!cocokDaftar(w, daftar)) luar.add(w);
  if (luar.size > BATAS_KATA_LUAR) m.push(`${awal} ${luar.size} kata di luar daftar (maks ${BATAS_KATA_LUAR}): ${[...luar].join(', ')}`);

  // kata terlarang dan nama kartun (di semua teks, termasuk adegan dan naskah)
  const semuaTeks = [k.judul, k.pesanAkhlak, k.pesanHariIni.inggris, k.pesanHariIni.arti, ...semua, ...semuaArti, ...k.panel.map((p) => p.adegan), ...k.naskahOrangTua.langkah, k.naskahOrangTua.renungan]
    .join(' ')
    .toLowerCase();
  for (const w of KATA_TERLARANG) if (new RegExp(`\\b${w}\\b`).test(semuaTeks)) m.push(`${awal} memuat kata terlarang "${w}"`);
  for (const w of NAMA_KARTUN) if (new RegExp(`\\b${w}\\b`).test(semuaTeks)) m.push(`${awal} memuat nama tokoh kartun "${w}"`);

  // Cek Paham cocok dengan isi komik
  if (k.cekPaham.length < 3) m.push(`${awal} Cek Paham kurang dari 3 soal`);
  const jenisAda = new Set(k.cekPaham.map((s) => s.jenis));
  for (const j of ['urutkan', 'siapa', 'dengar_panel'] as const) if (!jenisAda.has(j)) m.push(`${awal} Cek Paham tanpa soal "${j}"`);
  for (const s of k.cekPaham) {
    if (s.jenis === 'urutkan') {
      if (s.panel.length < 3 || s.panel.length > 4) m.push(`${awal} ${s.id}: urutkan harus 3–4 panel`);
      const nomor = s.panel.map((id) => k.panel.find((p) => p.id === id)?.nomor ?? -1);
      if (nomor.some((x) => x < 0)) m.push(`${awal} ${s.id}: panel tidak ada`);
      else if (nomor.some((x, i) => i > 0 && x <= nomor[i - 1])) m.push(`${awal} ${s.id}: urutan kunci tidak sesuai urutan panel`);
    } else {
      const g = gelembung.get(s.gelembung);
      if (!g) {
        m.push(`${awal} ${s.id}: gelembung ${s.gelembung} tidak ada`);
        continue;
      }
      if (s.jenis === 'siapa') {
        if (g.tokoh !== s.kunci) m.push(`${awal} ${s.id}: kunci "${s.kunci}" padahal yang bilang "${g.tokoh}"`);
        if (!s.pilihan.includes(s.kunci) || s.pilihan.length < 2) m.push(`${awal} ${s.id}: pilihan tidak memuat kunci`);
        for (const t of s.pilihan) if (!idTokoh.has(t)) m.push(`${awal} ${s.id}: pilihan tokoh tak dikenal "${t}"`);
      } else if (s.jenis === 'dengar_panel') {
        if (g.panel !== s.kunci) m.push(`${awal} ${s.id}: kunci panel ${s.kunci} padahal gelembung ada di ${g.panel}`);
        if (!s.pilihan.includes(s.kunci) || s.pilihan.length < 2) m.push(`${awal} ${s.id}: pilihan tidak memuat kunci`);
        for (const p of s.pilihan) if (!idPanel.has(p)) m.push(`${awal} ${s.id}: pilihan panel tak ada ${p}`);
      } else if (s.jenis === 'lengkapi') {
        if (!pecahKata(g.teks).includes(s.kataHilang.toLowerCase())) m.push(`${awal} ${s.id}: kata "${s.kataHilang}" tidak ada di gelembung`);
        if (!s.pilihan.includes(s.kataHilang) || s.pilihan.length !== 3) m.push(`${awal} ${s.id}: pilihan harus 3 dan memuat jawaban`);
      }
    }
  }
  return m;
}

/** Periksa paket komik: setiap komik, id unik, dan unit tidak ganda. */
export function periksaPaketKomik(paket: PaketKomik, paketSemua: PaketInggris[], tokoh: PaketTokoh): string[] {
  const m: string[] = [];
  const pk = paketSemua.find((p) => p.tingkat === paket.tingkat);
  const ids = new Set<string>();
  const unit = new Set<string>();
  for (const k of paket.komik) {
    if (ids.has(k.id)) m.push(`${k.id}: id komik ganda`);
    if (unit.has(k.unit)) m.push(`${k.id}: unit ${k.unit} sudah punya komik`);
    ids.add(k.id);
    unit.add(k.unit);
    if (k.tingkat !== paket.tingkat) m.push(`${k.id}: tingkat ${k.tingkat} tidak sama dengan paket ${paket.tingkat}`);
    m.push(...periksaSatuKomik(k, pk?.unit.find((u) => u.id === k.unit), paketSemua, tokoh));
  }
  return m;
}
