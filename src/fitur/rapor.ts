/** Hitungan rapor mingguan dari sesi dan jawaban (fungsi murni). */
import { tanggalLokal } from '../data/alat';
import type { CeritaUlang, Jawaban, KemajuanTopik, Pemakaian, Sesi } from '../data/jenis';
import type { Komik } from '../isi/inggris/komik';

export interface RingkasMinggu {
  mulai: string; // YYYY-MM-DD (Senin)
  selesai: string;
  hariLatihan: number;
  lembarLancar: number;
  detikPerSoal: number | null;
  persenBenar: number | null;
  menitBelajar: number;
  menitMain: number;
}

/** Senin dari minggu yang memuat tanggal d. */
export function seninDari(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hari = (x.getDay() + 6) % 7; // 0 = Senin
  x.setDate(x.getDate() - hari);
  return x;
}

export function ringkasMinggu(sesi: Sesi[], jawaban: Jawaban[], pemakaian: Pemakaian[], senin: Date): RingkasMinggu {
  const akhir = new Date(senin);
  akhir.setDate(akhir.getDate() + 7);
  const dalam = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= senin.getTime() && t < akhir.getTime();
  };
  const sesiMinggu = sesi.filter((s) => s.jenis !== 'game' && dalam(s.mulai));
  const hari = new Set(sesiMinggu.map((s) => tanggalLokal(new Date(s.mulai))));
  const lancar = sesiMinggu.filter((s) => s.jenis === 'lancar' && s.mode === 'sendiri');
  const idLancar = new Set(lancar.map((s) => s.id));
  const jLancar = jawaban.filter((j) => idLancar.has(j.sesi_id));
  const semuaJ = jawaban.filter((j) => sesiMinggu.some((s) => s.id === j.sesi_id));
  const pakai = pemakaian.filter((p) => {
    const t = new Date(`${p.tanggal}T12:00:00`).getTime();
    return t >= senin.getTime() && t < akhir.getTime();
  });
  const selesai = new Date(akhir);
  selesai.setDate(selesai.getDate() - 1);
  return {
    mulai: tanggalLokal(senin),
    selesai: tanggalLokal(selesai),
    hariLatihan: hari.size,
    lembarLancar: lancar.length,
    detikPerSoal: jLancar.length ? Math.round((jLancar.reduce((a, j) => a + j.detik, 0) / jLancar.length) * 10) / 10 : null,
    persenBenar: semuaJ.length ? Math.round((semuaJ.filter((j) => j.benar).length / semuaJ.length) * 100) : null,
    menitBelajar: Math.round(pakai.reduce((a, p) => a + p.belajarDetik, 0) / 60),
    menitMain: Math.round(pakai.reduce((a, p) => a + p.mainDetik, 0) / 60),
  };
}

/** Rata-rata detik per soal Lancar, 8 minggu terakhir (null = tidak latihan). */
export function grafikKecepatan(sesi: Sesi[], jawaban: Jawaban[], sekarang = new Date(), minggu = 8): (number | null)[] {
  const hasil: (number | null)[] = [];
  const iniSenin = seninDari(sekarang);
  for (let i = minggu - 1; i >= 0; i--) {
    const s = new Date(iniSenin);
    s.setDate(s.getDate() - 7 * i);
    hasil.push(ringkasMinggu(sesi, jawaban, [], s).detikPerSoal);
  }
  return hasil;
}

/** Keluarga fakta yang paling sering salah (peta jenis salah Lancar). */
export function salahTerbanyak(jawaban: Jawaban[], batas = 3): { topik: string; salah: number; total: number }[] {
  const peta = new Map<string, { salah: number; total: number }>();
  for (const j of jawaban) {
    const k = j.topik ?? j.kodeSalah;
    if (!k) continue;
    const v = peta.get(k) ?? { salah: 0, total: 0 };
    v.total += 1;
    if (!j.benar) v.salah += 1;
    peta.set(k, v);
  }
  return [...peta.entries()]
    .map(([topik, v]) => ({ topik, ...v }))
    .filter((x) => x.salah > 0)
    .sort((a, b) => b.salah - a.salah || b.total - a.total)
    .slice(0, batas);
}

/** Penyebab salah TKA: hitung kode penyebab dari pengecoh yang dipilih. */
export function penyebabSalah(jawaban: Jawaban[]): { kode: string; jumlah: number }[] {
  const peta = new Map<string, number>();
  for (const j of jawaban) {
    if (j.benar || !j.kodeSalah) continue;
    peta.set(j.kodeSalah, (peta.get(j.kodeSalah) ?? 0) + 1);
  }
  return [...peta.entries()].map(([kode, jumlah]) => ({ kode, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
}

/** Kalimat rapor sederhana: kemajuan, langkah berikutnya, cara membantu. */
export function kalimatRapor(
  nama: string,
  ini: RingkasMinggu,
  lalu: RingkasMinggu,
  topikLemah: KemajuanTopik[],
  salah: { topik: string }[],
): { kemajuan: string; langkah: string; membantu: string } {
  let kemajuan: string;
  if (ini.hariLatihan === 0) kemajuan = `${nama} belum latihan minggu ini.`;
  else if (ini.detikPerSoal !== null && lalu.detikPerSoal !== null && ini.detikPerSoal < lalu.detikPerSoal)
    kemajuan = `${nama} makin cepat: ${String(ini.detikPerSoal).replace('.', ',')} detik per soal, dari ${String(lalu.detikPerSoal).replace('.', ',')} minggu lalu.`;
  else kemajuan = `${nama} latihan ${ini.hariLatihan} hari minggu ini, ${ini.lembarLancar} lembar Lancar.`;
  const lemah = topikLemah.find((t) => t.tanda !== 'hijau');
  const langkah = lemah
    ? `Ulangi topik ${lemah.topik} bersama, pelan-pelan.`
    : salah[0]
      ? `Latih lagi ${salah[0].topik}, yang paling sering belum tepat.`
      : ini.hariLatihan < 4
        ? 'Usahakan latihan singkat 4–5 hari seminggu.'
        : 'Pertahankan latihan singkat setiap hari.';
  const membantu = lemah
    ? 'Buka Mode Dampingi dan kerjakan 3 soal bersama. Tanyakan "bagaimana caramu?", jangan langsung memberi jawaban.'
    : 'Puji usahanya, bukan nilainya. Contoh: "Ayah lihat kamu tidak menyerah."';
  return { kemajuan, langkah, membantu };
}

export interface RaporInggris {
  /** "Minggu ini Rani menceritakan 2 komik dan memakai 5 kata baru: …" atau null bila belum ada */
  cerita: string | null;
  /** hasil Cek Dengar terakhir minggu ini */
  cekDengar: string | null;
  /** satu cara membantu dari pertanyaan pancingan komik terakhir yang dibaca */
  membantu: string | null;
  /** ajakan perbuatan baik dari komik terakhir (pilihan, tanpa nilai atau hadiah) */
  perbuatanBaik: string | null;
}

/**
 * Kalimat kemajuan Bahasa Inggris untuk rapor mingguan (PROMPT-LANJUTAN-KOMIK tahap 6 butir 7, rancangan 13 bagian 3.4).
 * Ceritakan Lagi dan Cek Dengar TIDAK menjadi nilai: hanya kalimat kemajuan. `cariKomik` disuntikkan supaya mudah diuji.
 */
export function raporInggris(nama: string, cerita: CeritaUlang[], sesi: Sesi[], senin: Date, cariKomik: (id: string) => Komik | undefined, isiNama: (t: string) => string = (t) => t): RaporInggris {
  const awal = tanggalLokal(senin);
  const akhirD = new Date(senin);
  akhirD.setDate(akhirD.getDate() + 6);
  const akhir = tanggalLokal(akhirD);
  const dalam = (tgl: string) => tgl >= awal && tgl <= akhir;
  const ceritaIni = cerita.filter((c) => dalam(c.tanggal));
  let teksCerita: string | null = null;
  if (ceritaIni.length) {
    const komik = new Set(ceritaIni.map((c) => c.komikId));
    const kata = [...new Set(ceritaIni.flatMap((c) => c.kataTargetDicentang))];
    teksCerita = `Minggu ini ${nama} menceritakan ${komik.size} komik${kata.length ? ` dan memakai ${kata.length} kata baru: ${kata.slice(0, 8).join(', ')}` : ''}.`;
  }
  const inggrisIni = sesi.filter((s) => s.jenis === 'inggris' && dalam(tanggalLokal(new Date(s.mulai))));
  const cek = inggrisIni.filter((s) => (s.tambahan as { cekDengar?: boolean } | undefined)?.cekDengar).sort((a, b) => a.mulai.localeCompare(b.mulai)).pop();
  const teksCek = cek ? `Cek Dengar ${cek.level ?? ''}: ${nama} mengenali ${cek.benar} dari ${cek.jumlah} kata yang didengar.`.replace('  ', ' ') : null;
  const komikTerakhir = [...sesi]
    .filter((s) => s.jenis === 'inggris' && (s.tambahan as { komik?: string } | undefined)?.komik)
    .sort((a, b) => a.mulai.localeCompare(b.mulai))
    .map((s) => cariKomik((s.tambahan as { komik: string }).komik))
    .filter((k): k is Komik => !!k)
    .pop();
  return {
    cerita: teksCerita,
    cekDengar: teksCek,
    membantu: komikTerakhir ? isiNama(komikTerakhir.naskahOrangTua.pancingan) : null,
    perbuatanBaik: komikTerakhir ? isiNama(komikTerakhir.perbuatanBaik) : null,
  };
}
