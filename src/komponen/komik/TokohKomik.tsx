/**
 * Gambar SEMENTARA tokoh Cerita Komik (rancangan 13 bagian 2.1 dan 5, PROMPT-LANJUTAN-KOMIK tahap 3).
 *
 * - Flat 2D membulat, garis tepi cokelat tua, bayangan satu tingkat, warna lembut (identitas merek bagian 1).
 * - Wajah anak khas Indonesia: kulit sawo matang, rambut hitam. Tidak meniru tokoh kartun mana pun.
 * - Tanpa teks di dalam gambar (CLAUDE.md aturan 13). Diam, tanpa animasi.
 * - Semua tokoh digambar di kotak 120 × 160 (kaki di y ≈ 152). Ukuran sebenarnya diatur lewat `tinggi`;
 *   perbedaan tinggi antartokoh (Nisa kecil, Bima besar) diatur perakit panel (`skalaTokoh`).
 */
import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { Pose } from '../../isi/inggris/komik';

export const GARIS = '#6B4423';
const RAMBUT = '#2B211C';
const TINTA = '#2D3142';
const PUTIH = '#FFFFFF';
const PIPI = '#E8836B';
const LUMPUR = '#8B5E3C';
const CX = 60;

export type VarianTokoh = 'super' | 'kotor' | 'sedih';

export const POSE_KOMIK: Pose[] = ['berdiri', 'melambai', 'menunjuk', 'kaget', 'gembira', 'jongkok'];
export const TOKOH_KOMIK = ['fathan', 'nisa', 'dafi', 'lina', 'bima', 'robi', 'kabut', 'nek_ijah', 'kak_fajar'] as const;

export interface PropsTokohKomik {
  /** id tokoh dari tokoh.json */
  tokoh: string;
  pose: Pose;
  /** menghadap ke kiri (cermin) */
  balik?: boolean;
  varian?: VarianTokoh;
  /** tinggi gambar dalam piksel (lebar = tinggi × 0,75) */
  tinggi: number;
}

// ---------- geometri lengan ----------

type Titik = [number, number];

/** Sudut lengan [atas, bawah] dalam derajat dari arah bawah; positif = menjauhi badan. */
const SUDUT: Record<Pose, { kiri: [number, number]; kanan: [number, number] }> = {
  berdiri: { kiri: [14, 4], kanan: [14, 4] },
  melambai: { kiri: [14, 4], kanan: [135, 172] },
  menunjuk: { kiri: [14, 4], kanan: [86, 92] },
  kaget: { kiri: [112, 150], kanan: [112, 150] },
  gembira: { kiri: [148, 172], kanan: [148, 172] },
  jongkok: { kiri: [32, -12], kanan: [32, -12] },
};

function titikLengan(bahu: Titik, sisi: -1 | 1, sudut: [number, number], panjang: [number, number]): Titik[] {
  const rad = (d: number) => (d * Math.PI) / 180;
  const siku: Titik = [bahu[0] + sisi * panjang[0] * Math.sin(rad(sudut[0])), bahu[1] + panjang[0] * Math.cos(rad(sudut[0]))];
  const tangan: Titik = [siku[0] + sisi * panjang[1] * Math.sin(rad(sudut[1])), siku[1] + panjang[1] * Math.cos(rad(sudut[1]))];
  return [bahu, siku, tangan];
}

function Lengan({ titik, atas, bawah, tangan, tebal }: { titik: Titik[]; atas: string; bawah: string; tangan: string; tebal: number }) {
  const [a, b, c] = titik as [Titik, Titik, Titik];
  return (
    <G>
      <Path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`} stroke={GARIS} strokeWidth={tebal + 3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d={`M${b[0]} ${b[1]} L${c[0]} ${c[1]}`} stroke={bawah} strokeWidth={tebal} strokeLinecap="round" fill="none" />
      <Path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={atas} strokeWidth={tebal} strokeLinecap="round" fill="none" />
      <Circle cx={c[0]} cy={c[1]} r={tebal * 0.68} fill={tangan} stroke={GARIS} strokeWidth={1.7} />
    </G>
  );
}

/** Jari telunjuk kecil yang keluar dari tangan, searah lengan bawah. */
function Telunjuk({ titik, kulit }: { titik: Titik[]; kulit: string }) {
  const [, b, c] = titik as [Titik, Titik, Titik];
  const dx = c[0] - b[0];
  const dy = c[1] - b[1];
  const p = Math.hypot(dx, dy) || 1;
  const ujung: Titik = [c[0] + (dx / p) * 7, c[1] + (dy / p) * 7];
  const d = `M${c[0]} ${c[1]} L${ujung[0]} ${ujung[1]}`;
  return (
    <G>
      <Path d={d} stroke={GARIS} strokeWidth={5.4} strokeLinecap="round" />
      <Path d={d} stroke={kulit} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  );
}

/** Garis tambahan kecil: lambaian, kaget, dan kilau gembira. */
function Efek({ pose, tangan, kepala }: { pose: Pose; tangan: { kiri: Titik; kanan: Titik }; kepala: Titik }) {
  if (pose === 'melambai') {
    const [x, y] = tangan.kanan;
    return (
      <G stroke={GARIS} strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.7}>
        <Path d={`M${x + 8} ${y - 6} Q${x + 12} ${y} ${x + 8} ${y + 6}`} />
        <Path d={`M${x + 12} ${y - 9} Q${x + 18} ${y} ${x + 12} ${y + 9}`} />
      </G>
    );
  }
  if (pose === 'kaget') {
    const [x, y] = kepala;
    return (
      <G stroke={GARIS} strokeWidth={2} strokeLinecap="round">
        <Path d={`M${x} ${y - 6} L${x} ${y - 13}`} />
        <Path d={`M${x - 9} ${y - 4} L${x - 13} ${y - 10}`} />
        <Path d={`M${x + 9} ${y - 4} L${x + 13} ${y - 10}`} />
      </G>
    );
  }
  if (pose === 'gembira') {
    const kilau = (x: number, y: number, s: number) => (
      <Path
        d={`M${x} ${y - s} Q${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} Q${x + s * 0.2} ${y + s * 0.2} ${x} ${y + s} Q${x - s * 0.2} ${y + s * 0.2} ${x - s} ${y} Q${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s} Z`}
        fill="#FFD447"
        stroke={GARIS}
        strokeWidth={1}
      />
    );
    return (
      <G>
        {kilau(tangan.kiri[0] - 9, tangan.kiri[1] + 4, 4.5)}
        {kilau(tangan.kanan[0] + 9, tangan.kanan[1] + 2, 5)}
      </G>
    );
  }
  return null;
}

// ---------- wajah ----------

type Ekspresi = 'biasa' | 'senyum' | 'kaget' | 'gembira' | 'lirik' | 'penasaran' | 'sedih';

const EKSPRESI_POSE: Record<Pose, Ekspresi> = {
  berdiri: 'biasa',
  melambai: 'senyum',
  menunjuk: 'lirik',
  kaget: 'kaget',
  gembira: 'gembira',
  jongkok: 'penasaran',
};

function Wajah({ cx, cy, s, e, alis, kerut }: { cx: number; cy: number; s: number; e: Ekspresi; alis: string; kerut?: boolean }) {
  const mx = 8 * s;
  const my = cy + 1 * s;
  const mulut = '#8C3B2E';
  const mataTitik = (dx = 0, dy = 0) => (
    <>
      <Ellipse cx={cx - mx + dx} cy={my + dy} rx={2.6 * s} ry={3.3 * s} fill={TINTA} />
      <Ellipse cx={cx + mx + dx} cy={my + dy} rx={2.6 * s} ry={3.3 * s} fill={TINTA} />
      <Circle cx={cx - mx + dx + 0.9 * s} cy={my + dy - 1.2 * s} r={0.9 * s} fill={PUTIH} />
      <Circle cx={cx + mx + dx + 0.9 * s} cy={my + dy - 1.2 * s} r={0.9 * s} fill={PUTIH} />
    </>
  );
  const alisBiasa = (naik = 0, miring = 0) => (
    <G stroke={alis} strokeWidth={1.9 * s} strokeLinecap="round">
      <Path d={`M${cx - mx - 3.5 * s} ${my - 6.5 * s - naik + miring} L${cx - mx + 3 * s} ${my - 7 * s - naik - miring}`} />
      <Path d={`M${cx + mx - 3 * s} ${my - 7 * s - naik - miring} L${cx + mx + 3.5 * s} ${my - 6.5 * s - naik + miring}`} />
    </G>
  );
  const pipi = (
    <>
      <Ellipse cx={cx - 12 * s} cy={cy + 7 * s} rx={3.6 * s} ry={2.2 * s} fill={PIPI} opacity={0.38} />
      <Ellipse cx={cx + 12 * s} cy={cy + 7 * s} rx={3.6 * s} ry={2.2 * s} fill={PIPI} opacity={0.38} />
    </>
  );
  const hidung = <Path d={`M${cx - 1.6 * s} ${cy + 5.2 * s} Q${cx} ${cy + 6.8 * s} ${cx + 1.6 * s} ${cy + 5.2 * s}`} stroke={GARIS} strokeWidth={1.4 * s} strokeLinecap="round" fill="none" opacity={0.7} />;
  const kerutan = kerut ? (
    <G stroke={GARIS} strokeWidth={1 * s} strokeLinecap="round" opacity={0.45} fill="none">
      <Path d={`M${cx - mx - 5.5 * s} ${my - 1 * s} l${-2 * s} ${-1.4 * s} M${cx - mx - 5.5 * s} ${my + 1.4 * s} l${-2.2 * s} ${0.6 * s}`} />
      <Path d={`M${cx + mx + 5.5 * s} ${my - 1 * s} l${2 * s} ${-1.4 * s} M${cx + mx + 5.5 * s} ${my + 1.4 * s} l${2.2 * s} ${0.6 * s}`} />
    </G>
  ) : null;

  let isi: ReactNode;
  switch (e) {
    case 'senyum':
      isi = (
        <>
          {alisBiasa(0.5)}
          {mataTitik()}
          <Path d={`M${cx - 5.5 * s} ${cy + 9 * s} Q${cx} ${cy + 16 * s} ${cx + 5.5 * s} ${cy + 9 * s} Z`} fill={mulut} stroke={GARIS} strokeWidth={1.2 * s} strokeLinejoin="round" />
        </>
      );
      break;
    case 'kaget':
      isi = (
        <>
          {alisBiasa(2.6)}
          <Circle cx={cx - mx} cy={my} r={4 * s} fill={PUTIH} stroke={GARIS} strokeWidth={1.3 * s} />
          <Circle cx={cx + mx} cy={my} r={4 * s} fill={PUTIH} stroke={GARIS} strokeWidth={1.3 * s} />
          <Circle cx={cx - mx} cy={my} r={2 * s} fill={TINTA} />
          <Circle cx={cx + mx} cy={my} r={2 * s} fill={TINTA} />
          <Ellipse cx={cx} cy={cy + 12 * s} rx={2.8 * s} ry={3.6 * s} fill={mulut} stroke={GARIS} strokeWidth={1.2 * s} />
        </>
      );
      break;
    case 'gembira':
      isi = (
        <>
          {alisBiasa(1.5)}
          <G stroke={TINTA} strokeWidth={2.2 * s} strokeLinecap="round" fill="none">
            <Path d={`M${cx - mx - 3.2 * s} ${my + 1 * s} Q${cx - mx} ${my - 3.5 * s} ${cx - mx + 3.2 * s} ${my + 1 * s}`} />
            <Path d={`M${cx + mx - 3.2 * s} ${my + 1 * s} Q${cx + mx} ${my - 3.5 * s} ${cx + mx + 3.2 * s} ${my + 1 * s}`} />
          </G>
          <Path d={`M${cx - 7 * s} ${cy + 8.5 * s} Q${cx} ${cy + 19 * s} ${cx + 7 * s} ${cy + 8.5 * s} Z`} fill={mulut} stroke={GARIS} strokeWidth={1.2 * s} strokeLinejoin="round" />
          <Path d={`M${cx - 3.4 * s} ${cy + 13.2 * s} Q${cx} ${cy + 11 * s} ${cx + 3.4 * s} ${cy + 13.2 * s} Q${cx} ${cy + 16 * s} ${cx - 3.4 * s} ${cy + 13.2 * s} Z`} fill="#E77B7B" />
        </>
      );
      break;
    case 'lirik':
      isi = (
        <>
          {alisBiasa(1)}
          {mataTitik(1.6 * s, 0)}
          <Path d={`M${cx - 3 * s} ${cy + 10.5 * s} Q${cx + 1 * s} ${cy + 14 * s} ${cx + 5 * s} ${cy + 10 * s}`} stroke={GARIS} strokeWidth={1.8 * s} strokeLinecap="round" fill="none" />
        </>
      );
      break;
    case 'penasaran':
      isi = (
        <>
          <G stroke={alis} strokeWidth={1.9 * s} strokeLinecap="round">
            <Path d={`M${cx - mx - 3.5 * s} ${my - 6 * s} L${cx - mx + 3 * s} ${my - 6.5 * s}`} />
            <Path d={`M${cx + mx - 3 * s} ${my - 9 * s} Q${cx + mx} ${my - 10.5 * s} ${cx + mx + 3.5 * s} ${my - 8.5 * s}`} />
          </G>
          {mataTitik(0, 1.4 * s)}
          <Circle cx={cx + 1 * s} cy={cy + 11.5 * s} r={1.8 * s} fill={mulut} />
        </>
      );
      break;
    case 'sedih':
      isi = (
        <>
          <G stroke={alis} strokeWidth={1.9 * s} strokeLinecap="round">
            <Path d={`M${cx - mx - 3.5 * s} ${my - 5 * s} L${cx - mx + 3 * s} ${my - 7.5 * s}`} />
            <Path d={`M${cx + mx - 3 * s} ${my - 7.5 * s} L${cx + mx + 3.5 * s} ${my - 5 * s}`} />
          </G>
          {mataTitik(0, 0.8 * s)}
          <Path d={`M${cx - 4.5 * s} ${cy + 13 * s} Q${cx} ${cy + 9.5 * s} ${cx + 4.5 * s} ${cy + 13 * s}`} stroke={GARIS} strokeWidth={1.8 * s} strokeLinecap="round" fill="none" />
        </>
      );
      break;
    default:
      isi = (
        <>
          {alisBiasa()}
          {mataTitik()}
          <Path d={`M${cx - 4.5 * s} ${cy + 10 * s} Q${cx} ${cy + 14 * s} ${cx + 4.5 * s} ${cy + 10 * s}`} stroke={GARIS} strokeWidth={1.8 * s} strokeLinecap="round" fill="none" />
        </>
      );
  }
  return (
    <G>
      {pipi}
      {hidung}
      {kerutan}
      {isi}
    </G>
  );
}

// ---------- manusia ----------

interface Geometri {
  kepalaR: number;
  kepalaY: number;
  bahuY: number;
  badanAtas: number;
  pinggang: number;
  setengah: number;
  kaki: number;
  lengan: [number, number];
  tebal: number;
  turunJongkok: number;
}

const BADAN_ANAK: Geometri = { kepalaR: 23, kepalaY: 44, bahuY: 77, badanAtas: 70, pinggang: 111, setengah: 16, kaki: 152, lengan: [15, 14], tebal: 7, turunJongkok: 20 };
const BADAN_BESAR: Geometri = { kepalaR: 24, kepalaY: 42, bahuY: 77, badanAtas: 69, pinggang: 115, setengah: 22, kaki: 152, lengan: [16, 15], tebal: 8.6, turunJongkok: 19 };
const BADAN_DEWASA: Geometri = { kepalaR: 18.5, kepalaY: 30, bahuY: 56, badanAtas: 50, pinggang: 101, setengah: 17, kaki: 152, lengan: [21, 19], tebal: 7, turunJongkok: 27 };

interface Manusia {
  g: Geometri;
  kulit: string;
  baju: string;
  /** warna lengan bawah bila lengan panjang (bawaan: kulit) */
  lenganBawah?: string;
  bawah: 'celana_pendek' | 'celana' | 'rok';
  warnaBawah: string;
  sepatu: string;
  rambut?: 'belah' | 'cepak' | 'rapi' | 'samping';
  warnaRambut?: string;
  kerudung?: string;
  kerudungDalam?: string;
  kacamata?: 'bulat' | 'ujung';
  kerut?: boolean;
  /** bentuk yang digambar di belakang badan */
  belakang?: (k: Kerangka) => ReactNode;
  /** bentuk di atas badan (sebelum kepala) */
  atasBadan?: (k: Kerangka) => ReactNode;
  /** bentuk di atas kepala */
  atasKepala?: (k: Kerangka) => ReactNode;
  /** bentuk paling depan (benda di tangan) */
  depan?: (k: Kerangka) => ReactNode;
  /** ganti sudut lengan untuk pose tertentu */
  sudutKhusus?: Partial<Record<Pose, { kiri?: [number, number]; kanan?: [number, number] }>>;
}

interface Kerangka {
  pose: Pose;
  dy: number;
  g: Geometri;
  kepala: Titik;
  lenganKiri: Titik[];
  lenganKanan: Titik[];
  tanganKiri: Titik;
  tanganKanan: Titik;
  lututKiri: Titik;
  atas: number;
  bawah: number;
}

function badanPath(sa: number, atas: number, bawah: number, lebih = 2) {
  return `M${CX - sa} ${atas + 8} Q${CX - sa} ${atas} ${CX - sa + 9} ${atas} L${CX + sa - 9} ${atas} Q${CX + sa} ${atas} ${CX + sa} ${atas + 8} L${CX + sa + lebih} ${bawah - 4} Q${CX + sa + lebih} ${bawah} ${CX + sa + lebih - 4} ${bawah} L${CX - sa - lebih + 4} ${bawah} Q${CX - sa - lebih} ${bawah} ${CX - sa - lebih} ${bawah - 4} Z`;
}

function Kaki({ m, k }: { m: Manusia; k: Kerangka }) {
  const { g } = m;
  const pinggul = g.pinggang + k.dy;
  const warnaBetis = m.bawah === 'celana' ? m.warnaBawah : m.kulit;
  const tebal = g.tebal + 2;
  const garis = (d: string, w: string) => (
    <>
      <Path d={d} stroke={GARIS} strokeWidth={tebal + 3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d={d} stroke={w} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );
  const telapak = (x: number) => <Ellipse cx={x} cy={g.kaki - 1.5} rx={7.2} ry={3.8} fill={m.sepatu} stroke={GARIS} strokeWidth={1.8} />;

  if (m.bawah === 'rok') {
    if (k.pose === 'jongkok') {
      const py = pinggul - 6;
      const sa = g.setengah;
      return (
        <G>
          {telapak(CX - 13)}
          {telapak(CX + 13)}
          <Path d={`M${CX - sa} ${py} L${CX + sa} ${py} Q${CX + sa + 15} ${py + 6} ${CX + sa + 12} ${g.kaki - 4} L${CX - sa - 12} ${g.kaki - 4} Q${CX - sa - 15} ${py + 6} ${CX - sa} ${py} Z`} fill={m.warnaBawah} stroke={GARIS} strokeWidth={2.4} strokeLinejoin="round" />
        </G>
      );
    }
    const sa = g.setengah;
    return (
      <G>
        {telapak(CX - 7)}
        {telapak(CX + 7)}
        <Path d={`M${CX - sa + 1} ${pinggul - 6} L${CX + sa - 1} ${pinggul - 6} L${CX + sa + 6} ${g.kaki - 5} Q${CX} ${g.kaki - 2} ${CX - sa - 6} ${g.kaki - 5} Z`} fill={m.warnaBawah} stroke={GARIS} strokeWidth={2.4} strokeLinejoin="round" />
      </G>
    );
  }

  if (k.pose === 'jongkok') {
    const lutut = (s: -1 | 1): Titik => [CX + s * 21, pinggul - 3];
    const paha = (s: -1 | 1) => `M${CX + s * 6} ${pinggul} L${lutut(s)[0]} ${lutut(s)[1]}`;
    const betis = (s: -1 | 1) => `M${lutut(s)[0]} ${lutut(s)[1]} L${CX + s * 16} ${g.kaki - 4}`;
    return (
      <G>
        {garis(betis(-1), warnaBetis)}
        {garis(betis(1), warnaBetis)}
        {telapak(CX - 17)}
        {telapak(CX + 17)}
        {garis(paha(-1), m.warnaBawah)}
        {garis(paha(1), m.warnaBawah)}
        {m.bawah === 'celana_pendek' && (
          <>
            <Circle cx={lutut(-1)[0]} cy={lutut(-1)[1]} r={tebal / 2} fill={m.kulit} />
            <Circle cx={lutut(1)[0]} cy={lutut(1)[1]} r={tebal / 2} fill={m.kulit} />
          </>
        )}
      </G>
    );
  }

  const kaki = (s: -1 | 1) => `M${CX + s * 7} ${pinggul - 2} L${CX + s * 7.5} ${g.kaki - 5}`;
  return (
    <G>
      {garis(kaki(-1), warnaBetis)}
      {garis(kaki(1), warnaBetis)}
      {telapak(CX - 9)}
      {telapak(CX + 9)}
      {m.bawah === 'celana_pendek' && (
        <Path d={`M${CX - g.setengah} ${pinggul - 4} L${CX + g.setengah} ${pinggul - 4} L${CX + g.setengah + 1} ${pinggul + 14} L${CX + 1.5} ${pinggul + 14} L${CX} ${pinggul + 6} L${CX - 1.5} ${pinggul + 14} L${CX - g.setengah - 1} ${pinggul + 14} Z`} fill={m.warnaBawah} stroke={GARIS} strokeWidth={2.2} strokeLinejoin="round" />
      )}
    </G>
  );
}

function Rambut({ m, cx, cy, r }: { m: Manusia; cx: number; cy: number; r: number }) {
  const w = m.warnaRambut ?? RAMBUT;
  const kubah = `M${cx - r - 1} ${cy + 2} C${cx - r - 1} ${cy - r - 7} ${cx + r + 1} ${cy - r - 7} ${cx + r + 1} ${cy + 2}`;
  let poni: string;
  switch (m.rambut) {
    case 'cepak':
      poni = `Q${cx + r - 3} ${cy - 11} ${cx} ${cy - 12} Q${cx - r + 3} ${cy - 11} ${cx - r - 1} ${cy + 2} Z`;
      break;
    case 'rapi':
      poni = `Q${cx + r - 2} ${cy - 10} ${cx + 6} ${cy - 11} Q${cx - 6} ${cy - 12} ${cx - 10} ${cy - 6} Q${cx - r + 1} ${cy - 4} ${cx - r - 1} ${cy + 2} Z`;
      break;
    case 'samping':
      poni = `L${cx + r - 3} ${cy - 2} Q${cx + r - 6} ${cy - 10} ${cx + 4} ${cy - 13} Q${cx - 8} ${cy - 13} ${cx - r + 3} ${cy - 2} Z`;
      break;
    default:
      // belah: poni berjumbai
      poni = `Q${cx + r - 3} ${cy - 8} ${cx + 9} ${cy - 10} Q${cx + 4} ${cy - 6} ${cx - 1} ${cy - 11} Q${cx - 6} ${cy - 6} ${cx - 11} ${cy - 9} Q${cx - r + 2} ${cy - 6} ${cx - r - 1} ${cy + 2} Z`;
  }
  return <Path d={kubah + poni} fill={w} stroke={GARIS} strokeWidth={2} strokeLinejoin="round" />;
}

function Kacamata({ jenis, cx, cy, s }: { jenis: 'bulat' | 'ujung'; cx: number; cy: number; s: number }) {
  if (jenis === 'bulat') {
    const y = cy + 1 * s;
    return (
      <G>
        <Circle cx={cx - 8 * s} cy={y} r={5.8 * s} fill="#DDF0FF" opacity={0.35} />
        <Circle cx={cx + 8 * s} cy={y} r={5.8 * s} fill="#DDF0FF" opacity={0.35} />
        <G stroke={GARIS} strokeWidth={1.8 * s} fill="none">
          <Circle cx={cx - 8 * s} cy={y} r={5.8 * s} />
          <Circle cx={cx + 8 * s} cy={y} r={5.8 * s} />
          <Path d={`M${cx - 2.2 * s} ${y - 0.5 * s} Q${cx} ${y - 2 * s} ${cx + 2.2 * s} ${y - 0.5 * s}`} />
        </G>
      </G>
    );
  }
  // kacamata kecil melorot ke ujung hidung
  const y = cy + 5 * s;
  return (
    <G stroke={GARIS} strokeWidth={1.5 * s} fill="#EEF6FF" fillOpacity={0.35}>
      <Path d={`M${cx - 12 * s} ${y - 2 * s} L${cx - 3 * s} ${y - 2 * s} Q${cx - 3 * s} ${y + 3.5 * s} ${cx - 7.5 * s} ${y + 3.5 * s} Q${cx - 12 * s} ${y + 3.5 * s} ${cx - 12 * s} ${y - 2 * s} Z`} />
      <Path d={`M${cx + 3 * s} ${y - 2 * s} L${cx + 12 * s} ${y - 2 * s} Q${cx + 12 * s} ${y + 3.5 * s} ${cx + 7.5 * s} ${y + 3.5 * s} Q${cx + 3 * s} ${y + 3.5 * s} ${cx + 3 * s} ${y - 2 * s} Z`} />
      <Path d={`M${cx - 3 * s} ${y - 1.5 * s} L${cx + 3 * s} ${y - 1.5 * s}`} fill="none" />
    </G>
  );
}

function Lumpur({ titik }: { titik: [number, number, number][] }) {
  return (
    <G>
      {titik.map(([x, y, s], i) => (
        <Path
          key={i}
          d={`M${x - s} ${y} Q${x - s} ${y - s * 0.9} ${x} ${y - s * 0.8} Q${x + s * 1.1} ${y - s} ${x + s} ${y} Q${x + s * 1.3} ${y + s * 0.8} ${x + s * 0.2} ${y + s * 0.7} Q${x - s * 0.4} ${y + s * 1.2} ${x - s * 0.6} ${y + s * 0.5} Q${x - s * 1.3} ${y + s * 0.4} ${x - s} ${y} Z`}
          fill={LUMPUR}
          opacity={0.85}
        />
      ))}
    </G>
  );
}

function GambarManusia({ m, pose, varian }: { m: Manusia; pose: Pose; varian?: VarianTokoh }) {
  const { g } = m;
  const dy = pose === 'jongkok' ? g.turunJongkok : 0;
  const sudut = { ...SUDUT[pose], ...(m.sudutKhusus?.[pose] ?? {}) };
  const bahuX = g.setengah - 1;
  const lenganKiri = titikLengan([CX - bahuX, g.bahuY + dy], -1, sudut.kiri, g.lengan);
  const lenganKanan = titikLengan([CX + bahuX, g.bahuY + dy], 1, sudut.kanan, g.lengan);
  const kepala: Titik = [CX, g.kepalaY + dy];
  const atas = g.badanAtas + dy;
  const bawah = g.pinggang + dy;
  const k: Kerangka = {
    pose,
    dy,
    g,
    kepala,
    lenganKiri,
    lenganKanan,
    tanganKiri: lenganKiri[2] as Titik,
    tanganKanan: lenganKanan[2] as Titik,
    lututKiri: pose === 'jongkok' ? [CX - 21, bawah - 3] : [CX - 7.2, g.pinggang + (g.kaki - g.pinggang) * 0.55],
    atas,
    bawah,
  };
  const ekspresi: Ekspresi = varian === 'sedih' ? 'sedih' : EKSPRESI_POSE[pose];
  const [kx, ky] = kepala;
  const r = g.kepalaR;
  const s = r / 23;
  const lb = m.lenganBawah ?? m.kulit;

  return (
    <G>
      <Ellipse cx={CX} cy={g.kaki + 1} rx={g.setengah + (pose === 'jongkok' ? 24 : 18)} ry={4.5} fill={GARIS} opacity={0.18} />
      {m.belakang?.(k)}
      <Kaki m={m} k={k} />
      <Lengan titik={lenganKiri} atas={m.baju} bawah={lb} tangan={m.kulit} tebal={g.tebal} />
      <Lengan titik={lenganKanan} atas={m.baju} bawah={lb} tangan={m.kulit} tebal={g.tebal} />
      {pose === 'menunjuk' && <Telunjuk titik={lenganKanan} kulit={m.kulit} />}
      <Path d={badanPath(g.setengah, atas, bawah)} fill={m.baju} stroke={GARIS} strokeWidth={2.4} strokeLinejoin="round" />
      {/* bayangan satu tingkat di sisi kanan badan dan di bawah dagu */}
      <Path d={`M${CX + g.setengah - 5} ${atas + 5} L${CX + g.setengah - 1} ${atas + 6} L${CX + g.setengah + 0.5} ${bawah - 3} L${CX + g.setengah - 6} ${bawah - 2} Z`} fill={GARIS} opacity={0.13} />
      <Ellipse cx={CX} cy={atas + 2} rx={9} ry={3} fill={GARIS} opacity={0.15} />
      {m.atasBadan?.(k)}
      {m.kerudung ? (
        <G>
          <Path
            d={`M${kx} ${ky - r - 5} C${kx + r + 10} ${ky - r - 5} ${kx + r + 10} ${ky + 6} ${kx + r + 6} ${ky + 15} L${CX + g.setengah + 5} ${g.bahuY + dy + 9} Q${CX} ${g.bahuY + dy + 19} ${CX - g.setengah - 5} ${g.bahuY + dy + 9} L${kx - r - 6} ${ky + 15} C${kx - r - 10} ${ky + 6} ${kx - r - 10} ${ky - r - 5} ${kx} ${ky - r - 5} Z`}
            fill={m.kerudung}
            stroke={GARIS}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <Path d={`M${kx + r + 2} ${ky + 12} Q${kx + r + 6} ${ky + 18} ${CX + g.setengah + 2} ${g.bahuY + dy + 8}`} stroke={GARIS} strokeWidth={1.2} opacity={0.35} fill="none" />
          <Ellipse cx={kx} cy={ky + 3} rx={r - 3} ry={r - 2} fill={m.kerudungDalam ?? m.kerudung} stroke={GARIS} strokeWidth={1.4} opacity={0.9} />
          <Ellipse cx={kx} cy={ky + 4.5} rx={r - 5} ry={r - 4.5} fill={m.kulit} stroke={GARIS} strokeWidth={1.8} />
        </G>
      ) : (
        <G>
          <Circle cx={kx - r + 0.5} cy={ky + 3} r={5 * s} fill={m.kulit} stroke={GARIS} strokeWidth={2} />
          <Circle cx={kx + r - 0.5} cy={ky + 3} r={5 * s} fill={m.kulit} stroke={GARIS} strokeWidth={2} />
          <Ellipse cx={kx} cy={ky} rx={r} ry={r * 0.97} fill={m.kulit} stroke={GARIS} strokeWidth={2.4} />
          <Rambut m={m} cx={kx} cy={ky} r={r} />
        </G>
      )}
      <Wajah cx={kx} cy={m.kerudung ? ky + 3 : ky} s={m.kerudung ? s * 0.92 : s} e={ekspresi} alis={m.kerut ? '#8E8E8E' : RAMBUT} kerut={m.kerut} />
      {m.kacamata && <Kacamata jenis={m.kacamata} cx={kx} cy={m.kerudung ? ky + 3 : ky} s={m.kerudung ? s * 0.92 : s} />}
      {m.atasKepala?.(k)}
      {m.depan?.(k)}
      {varian === 'kotor' && (
        <Lumpur
          titik={[
            [CX - 8, bawah - 10, 4],
            [CX + 9, atas + 14, 3],
            [CX - 6, g.kaki - 8, 3.5],
            [kx + 10, ky + 10, 2.5],
          ]}
        />
      )}
      <Efek pose={pose} tangan={{ kiri: k.tanganKiri, kanan: k.tanganKanan }} kepala={[kx, ky - r - 4]} />
    </G>
  );
}

// ---------- benda kecil ----------

function BonekaKancil({ x, y }: { x: number; y: number }) {
  const c = '#A0673A';
  return (
    <G>
      <Ellipse cx={x - 4.5} cy={y - 14} rx={2.6} ry={4.2} fill={c} stroke={GARIS} strokeWidth={1.3} />
      <Ellipse cx={x + 4.5} cy={y - 14} rx={2.6} ry={4.2} fill={c} stroke={GARIS} strokeWidth={1.3} />
      <Ellipse cx={x} cy={y + 2} rx={7} ry={8} fill={c} stroke={GARIS} strokeWidth={1.5} />
      <Ellipse cx={x} cy={y + 3.5} rx={4} ry={5} fill="#FFF6E5" />
      <Circle cx={x} cy={y - 8} r={6.5} fill={c} stroke={GARIS} strokeWidth={1.5} />
      <Ellipse cx={x} cy={y - 5.5} rx={3.5} ry={2.6} fill="#FFF6E5" />
      <Circle cx={x - 2.4} cy={y - 9} r={1.2} fill={TINTA} />
      <Circle cx={x + 2.4} cy={y - 9} r={1.2} fill={TINTA} />
      <Circle cx={x} cy={y - 6} r={0.9} fill={GARIS} />
      <Path d={`M${x - 5} ${y - 2} Q${x} ${y + 0.5} ${x + 5} ${y - 2}`} stroke="#3BB273" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </G>
  );
}

function BukuGambar({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Rect x={x - 8} y={y - 13} width={16} height={20} rx={2} fill="#F7A8B8" stroke={GARIS} strokeWidth={1.6} />
      <Rect x={x - 5} y={y - 8} width={10} height={9} rx={1.5} fill={PUTIH} opacity={0.85} />
      <Path d={`M${x - 3.5} ${y - 1} L${x - 0.5} ${y - 5} L${x + 1.5} ${y - 2.5} L${x + 3.5} ${y - 4.5}`} stroke="#3BB273" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[-5, -1.7, 1.6, 4.9].map((d) => (
        <Circle key={d} cx={x + d} cy={y - 13} r={1.2} fill="none" stroke={GARIS} strokeWidth={1} />
      ))}
    </G>
  );
}

function PisangGoreng({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Path d={`M${x - 3} ${y + 4} Q${x - 6} ${y - 6} ${x + 2} ${y - 12} Q${x + 8} ${y - 8} ${x + 5} ${y + 1} Q${x + 2} ${y + 6} ${x - 3} ${y + 4} Z`} fill="#E0A63E" stroke={GARIS} strokeWidth={1.5} strokeLinejoin="round" />
      <Circle cx={x + 1} cy={y - 6} r={0.9} fill="#B97A2A" />
      <Circle cx={x + 3} cy={y - 2} r={0.9} fill="#B97A2A" />
      <Circle cx={x - 1} cy={y} r={0.8} fill="#B97A2A" />
    </G>
  );
}

// ---------- daftar tokoh manusia ----------

const MANUSIA: Record<string, Manusia> = {
  fathan: {
    g: BADAN_ANAK,
    kulit: '#B97A4E',
    baju: '#E2463B',
    bawah: 'celana_pendek',
    warnaBawah: '#34506E',
    sepatu: '#5A4636',
    rambut: 'samping',
    belakang: (k) => {
      // pinggir topi terbalik yang mencuat di belakang kepala
      const [x, y] = k.kepala;
      return <Path d={`M${x + 6} ${y - 18} Q${x + 22} ${y - 30} ${x + 31} ${y - 21} Q${x + 24} ${y - 15} ${x + 10} ${y - 13} Z`} fill="#2D5DA8" stroke={GARIS} strokeWidth={2} strokeLinejoin="round" />;
    },
    atasKepala: (k) => {
      const [x, y] = k.kepala;
      const r = k.g.kepalaR;
      return (
        <G>
          <Path d={`M${x - r - 1} ${y - 4} C${x - r - 1} ${y - r - 9} ${x + r + 1} ${y - r - 9} ${x + r + 1} ${y - 4} Q${x} ${y - 10} ${x - r - 1} ${y - 4} Z`} fill="#3A6FC4" stroke={GARIS} strokeWidth={2.2} strokeLinejoin="round" />
          {/* celah tali topi di dahi */}
          <Path d={`M${x - 5} ${y - 7.5} Q${x} ${y - 14} ${x + 5} ${y - 7.5} Z`} fill={RAMBUT} stroke={GARIS} strokeWidth={1.3} />
          <Path d={`M${x - r + 4} ${y - 12} Q${x - 4} ${y - 26} ${x + r - 4} ${y - 12}`} stroke={PUTIH} strokeWidth={1.4} opacity={0.35} fill="none" />
        </G>
      );
    },
    depan: (k) => {
      // lutut lecet + plester
      const [x, y] = k.lututKiri;
      return (
        <G>
          <Rect x={x - 3.6} y={y - 2.2} width={7.2} height={4.4} rx={1.6} fill="#F2D3A8" stroke={GARIS} strokeWidth={1} transform={`rotate(-20 ${x} ${y})`} />
          <Circle cx={x + 3.2} cy={y + 4.4} r={1.3} fill="#E06B5B" opacity={0.8} />
        </G>
      );
    },
  },
  nisa: {
    g: BADAN_ANAK,
    kulit: '#C98D5E',
    baju: '#FFB27A',
    lenganBawah: '#FFB27A',
    bawah: 'rok',
    warnaBawah: '#E98B6D',
    sepatu: '#C0574A',
    kerudung: '#F4C430',
    kerudungDalam: '#FBE38A',
    sudutKhusus: { berdiri: { kiri: [8, -72] }, menunjuk: { kiri: [8, -72] }, melambai: { kiri: [8, -72] } },
    depan: (k) => {
      const memeluk = k.pose === 'berdiri' || k.pose === 'menunjuk' || k.pose === 'melambai';
      const [x, y] = k.tanganKiri;
      return <BonekaKancil x={memeluk ? x + 1 : x} y={memeluk ? y - 2 : y - 4} />;
    },
  },
  dafi: {
    g: BADAN_ANAK,
    kulit: '#BE8257',
    baju: '#3A86FF',
    bawah: 'celana',
    warnaBawah: '#B49A6E',
    sepatu: '#4B3A2E',
    rambut: 'belah',
    kacamata: 'bulat',
    belakang: (k) => {
      const sa = k.g.setengah;
      const t = k.atas;
      return (
        <G>
          {/* obeng dan kabel menyembul dari tas */}
          <Path d={`M${CX + sa - 2} ${t + 2} q6 -12 2 -18 q-4 -6 3 -10`} stroke="#E8743B" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Rect x={CX + sa + 3} y={t - 14} width={3} height={14} fill="#B8BFC9" stroke={GARIS} strokeWidth={1} />
          <Rect x={CX + sa + 1.5} y={t - 3} width={6} height={9} rx={2} fill="#F4C430" stroke={GARIS} strokeWidth={1.3} />
          <Rect x={CX - sa - 3} y={t + 2} width={2 * sa + 6} height={34} rx={7} fill="#7A8B4F" stroke={GARIS} strokeWidth={2} />
        </G>
      );
    },
    atasBadan: (k) => {
      const sa = k.g.setengah;
      const t = k.atas;
      return (
        <G stroke="#58663A" strokeWidth={3} strokeLinecap="round">
          <Path d={`M${CX - sa + 5} ${t + 1} L${CX - sa + 6} ${t + 26}`} />
          <Path d={`M${CX + sa - 5} ${t + 1} L${CX + sa - 6} ${t + 26}`} />
        </G>
      );
    },
  },
  lina: {
    g: BADAN_ANAK,
    kulit: '#CF9668',
    baju: '#FFFFFF',
    lenganBawah: '#FFFFFF',
    bawah: 'rok',
    warnaBawah: '#6C8FCB',
    sepatu: '#3E3A4F',
    kerudung: '#8FD3F4',
    kerudungDalam: '#C4E9FA',
    sudutKhusus: { berdiri: { kiri: [6, -40] } },
    depan: (k) => {
      const [x, y] = k.tanganKiri;
      return <BukuGambar x={x + (k.pose === 'berdiri' ? 2 : 0)} y={y} />;
    },
  },
  bima: {
    g: BADAN_BESAR,
    kulit: '#A96E45',
    baju: '#2E9E5B',
    lenganBawah: '#2E9E5B',
    bawah: 'celana_pendek',
    warnaBawah: '#2D3142',
    sepatu: '#E6E6E6',
    rambut: 'cepak',
    atasBadan: (k) => {
      const sa = k.g.setengah;
      const t = k.atas;
      const b = k.bawah;
      return (
        <G>
          {/* kaus bola kebesaran: kerah V dan garis putih */}
          <Path d={`M${CX - 8} ${t} L${CX} ${t + 10} L${CX + 8} ${t}`} fill="none" stroke={PUTIH} strokeWidth={3} strokeLinejoin="round" />
          <Path d={`M${CX - sa - 1} ${b - 9} L${CX + sa + 1} ${b - 9}`} stroke={PUTIH} strokeWidth={3} />
          <Path d={`M${CX - 6} ${t + 18} L${CX + 6} ${t + 18} L${CX + 4} ${t + 30} L${CX - 4} ${t + 30} Z`} fill={PUTIH} opacity={0.35} />
        </G>
      );
    },
    depan: (k) => {
      const [x, y] = k.tanganKiri;
      return <PisangGoreng x={x - 1} y={y - 3} />;
    },
  },
  nek_ijah: {
    g: BADAN_DEWASA,
    kulit: '#B98563',
    baju: '#E3A86B',
    lenganBawah: '#E3A86B',
    bawah: 'rok',
    warnaBawah: '#B5651D',
    sepatu: '#6B4A33',
    kerudung: '#F3EBDD',
    kerudungDalam: '#FFFFFF',
    kacamata: 'ujung',
    kerut: true,
    atasBadan: () => null,
    depan: (k) => {
      // corak kotak-kotak kain sarung
      if (k.pose === 'jongkok') return null;
      const atas = k.g.pinggang - 6;
      const bawah = k.g.kaki - 6;
      return (
        <G stroke="#8A4A14" strokeWidth={1.6} opacity={0.6}>
          {[0.25, 0.5, 0.75].map((f) => (
            <Path key={f} d={`M${CX - k.g.setengah - 6 * f} ${atas + (bawah - atas) * f} L${CX + k.g.setengah + 6 * f} ${atas + (bawah - atas) * f}`} />
          ))}
          {[-9, 0, 9].map((x) => (
            <Path key={x} d={`M${CX + x} ${atas + 1} L${CX + x * 1.35} ${bawah}`} />
          ))}
        </G>
      );
    },
  },
  kak_fajar: {
    g: BADAN_DEWASA,
    kulit: '#B07850',
    baju: '#4A7BB7',
    bawah: 'celana',
    warnaBawah: '#3B3F4A',
    sepatu: '#3A2C22',
    rambut: 'rapi',
    atasBadan: (k) => {
      const sa = k.g.setengah;
      const t = k.atas;
      const b = k.bawah;
      const garisV = [-10, -3, 4, 11];
      const garisH = [12, 24, 36];
      return (
        <G>
          <G stroke="#A9C8EE" strokeWidth={2.4} opacity={0.75}>
            {garisV.map((x) => (
              <Path key={x} d={`M${CX + x} ${t + 2} L${CX + x} ${b - 2}`} />
            ))}
            {garisH.map((y) => (
              <Path key={y} d={`M${CX - sa + 1} ${t + y} L${CX + sa + 1} ${t + y}`} />
            ))}
          </G>
          <G stroke="#2F5A8F" strokeWidth={1} opacity={0.6}>
            {garisV.map((x) => (
              <Path key={x} d={`M${CX + x + 2.5} ${t + 2} L${CX + x + 2.5} ${b - 2}`} />
            ))}
          </G>
          {/* kerah */}
          <Path d={`M${CX - 8} ${t} L${CX - 1} ${t + 7} L${CX - 4} ${t + 9} Z M${CX + 8} ${t} L${CX + 1} ${t + 7} L${CX + 4} ${t + 9} Z`} fill="#EAF2FB" stroke={GARIS} strokeWidth={1.3} strokeLinejoin="round" />
        </G>
      );
    },
  },
};

/** Tokoh yang tidak dikenal digambar sebagai anak umum (supaya panel tidak rusak). */
const MANUSIA_CADANGAN: Manusia = { g: BADAN_ANAK, kulit: '#C08458', baju: '#9AA7B8', bawah: 'celana', warnaBawah: '#5B6577', sepatu: '#4B3A2E', rambut: 'belah' };

// ---------- Robi ----------

function LayarWajahRobi({ e, dy }: { e: Ekspresi; dy: number }) {
  const biru = '#5BC0F8';
  const y = 60 + dy;
  const xl = 51;
  const xr = 69;
  const gores = { stroke: biru, strokeWidth: 2.6, strokeLinecap: 'round' as const, fill: 'none' };
  switch (e) {
    case 'gembira':
      return (
        <G>
          <Path d={`M${xl - 4} ${y + 1} Q${xl} ${y - 5} ${xl + 4} ${y + 1}`} {...gores} />
          <Path d={`M${xr - 4} ${y + 1} Q${xr} ${y - 5} ${xr + 4} ${y + 1}`} {...gores} />
          <Path d={`M54 ${y + 6} Q60 ${y + 12} 66 ${y + 6}`} {...gores} />
        </G>
      );
    case 'kaget':
      return (
        <G>
          <Circle cx={xl} cy={y} r={5.4} stroke={biru} strokeWidth={2} fill="none" />
          <Circle cx={xr} cy={y} r={5.4} stroke={biru} strokeWidth={2} fill="none" />
          <Circle cx={xl} cy={y} r={2} fill={biru} />
          <Circle cx={xr} cy={y} r={2} fill={biru} />
          <Circle cx={60} cy={y + 9} r={2.4} stroke={biru} strokeWidth={1.8} fill="none" />
        </G>
      );
    case 'sedih':
      return (
        <G>
          <Path d={`M${xl - 4} ${y - 1} Q${xl} ${y + 3} ${xl + 4} ${y - 1}`} {...gores} />
          <Path d={`M${xr - 4} ${y - 1} Q${xr} ${y + 3} ${xr + 4} ${y - 1}`} {...gores} />
          <Path d={`M55 ${y + 10} Q60 ${y + 6} 65 ${y + 10}`} {...gores} />
          <Path d={`M${xl + 1} ${y + 4} q-2 3 0 4.5 q2 -1.5 0 -4.5 Z`} fill="#A9E4FF" />
        </G>
      );
    default: {
      const dx = e === 'lirik' ? 3 : 0;
      const ty = e === 'penasaran' ? 2 : 0;
      return (
        <G>
          <Rect x={xl - 3.6 + dx} y={y - 4.6 + ty} width={7.2} height={9.2} rx={3.6} fill={biru} />
          <Rect x={xr - 3.6 + dx} y={y - 4.6 + ty} width={7.2} height={9.2} rx={3.6} fill={biru} />
          <Circle cx={xl + 1.2 + dx} cy={y - 2 + ty} r={1.2} fill={PUTIH} />
          <Circle cx={xr + 1.2 + dx} cy={y - 2 + ty} r={1.2} fill={PUTIH} />
          {e === 'penasaran' ? (
            <Circle cx={61} cy={y + 9} r={1.6} fill={biru} />
          ) : (
            <Path d={e === 'senyum' ? `M53 ${y + 7} Q60 ${y + 13} 67 ${y + 7}` : `M55 ${y + 8} Q60 ${y + 11} 65 ${y + 8}`} {...gores} />
          )}
        </G>
      );
    }
  }
}

function GambarRobi({ pose, varian }: { pose: Pose; varian?: VarianTokoh }) {
  const tubuh = '#9AA7B8';
  const terang = '#C9D3E0';
  const gelap = '#6E7A8A';
  const dy = pose === 'jongkok' ? 10 : 0;
  const sup = varian === 'super';
  const sudut = SUDUT[pose];
  const lk = titikLengan([36, 102 + dy], -1, sudut.kiri, [13, 11]);
  const lr = titikLengan([84, 102 + dy], 1, sudut.kanan, [13, 11]);
  const ekspresi: Ekspresi = varian === 'sedih' ? 'sedih' : EKSPRESI_POSE[pose];
  const tk = lk[2] as Titik;
  const tr = lr[2] as Titik;
  const kakiX = pose === 'jongkok' ? 16 : 9;

  return (
    <G>
      <Ellipse cx={CX} cy={153} rx={sup ? 40 : 30} ry={4.5} fill={GARIS} opacity={0.18} />
      {sup && (
        <G>
          {/* sayap cahaya */}
          {[-1, 1].map((s) => (
            <G key={s}>
              <Path
                d={`M${CX + s * 18} ${98 + dy} Q${CX + s * 44} ${60 + dy} ${CX + s * 58} ${66 + dy} Q${CX + s * 52} ${82 + dy} ${CX + s * 56} ${92 + dy} Q${CX + s * 46} ${100 + dy} ${CX + s * 50} ${112 + dy} Q${CX + s * 34} ${114 + dy} ${CX + s * 20} ${110 + dy} Z`}
                fill="#FFF3B0"
                opacity={0.85}
                stroke="#F2C230"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              <Path d={`M${CX + s * 24} ${100 + dy} Q${CX + s * 40} ${80 + dy} ${CX + s * 52} ${72 + dy} M${CX + s * 24} ${104 + dy} Q${CX + s * 40} ${98 + dy} ${CX + s * 50} ${96 + dy}`} stroke="#F2C230" strokeWidth={1.2} fill="none" opacity={0.8} />
            </G>
          ))}
        </G>
      )}
      {/* kaki pendek */}
      <G>
        <Path d={`M${CX - kakiX + 2} ${128 + dy * 0.5} L${CX - kakiX} 147`} stroke={GARIS} strokeWidth={9.4} strokeLinecap="round" />
        <Path d={`M${CX + kakiX - 2} ${128 + dy * 0.5} L${CX + kakiX} 147`} stroke={GARIS} strokeWidth={9.4} strokeLinecap="round" />
        <Path d={`M${CX - kakiX + 2} ${128 + dy * 0.5} L${CX - kakiX} 147`} stroke={gelap} strokeWidth={6} strokeLinecap="round" />
        <Path d={`M${CX + kakiX - 2} ${128 + dy * 0.5} L${CX + kakiX} 147`} stroke={gelap} strokeWidth={6} strokeLinecap="round" />
        <Ellipse cx={CX - kakiX - 1} cy={150} rx={8.5} ry={4.2} fill={terang} stroke={GARIS} strokeWidth={1.8} />
        <Ellipse cx={CX + kakiX + 1} cy={150} rx={8.5} ry={4.2} fill={terang} stroke={GARIS} strokeWidth={1.8} />
      </G>
      <Lengan titik={lk} atas={tubuh} bawah={tubuh} tangan={terang} tebal={6.5} />
      <Lengan titik={lr} atas={tubuh} bawah={tubuh} tangan={terang} tebal={6.5} />
      {/* badan bundar */}
      <Circle cx={CX} cy={108 + dy} r={27} fill={tubuh} stroke={GARIS} strokeWidth={2.4} />
      <Path d={`M${CX + 14} ${86 + dy} A27 27 0 0 1 ${CX + 14} ${131 + dy} A30 30 0 0 0 ${CX + 14} ${86 + dy} Z`} fill={GARIS} opacity={0.14} />
      <Ellipse cx={CX} cy={112 + dy} rx={16} ry={14} fill={terang} opacity={0.6} />
      {/* lampu dada */}
      <Circle cx={CX} cy={106 + dy} r={sup ? 15 : 11} fill="#FFE066" opacity={sup ? 0.5 : 0.35} />
      {sup && (
        <G stroke="#F2C230" strokeWidth={1.8} strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r1 = 16;
            const r2 = 21;
            const t = (a * Math.PI) / 180;
            return <Path key={a} d={`M${CX + r1 * Math.cos(t)} ${106 + dy + r1 * Math.sin(t)} L${CX + r2 * Math.cos(t)} ${106 + dy + r2 * Math.sin(t)}`} />;
          })}
        </G>
      )}
      <Circle cx={CX} cy={106 + dy} r={7} fill="#FFE066" stroke={GARIS} strokeWidth={1.8} />
      <Circle cx={CX - 2} cy={104 + dy} r={2} fill={PUTIH} opacity={0.8} />
      {/* kepala layar */}
      <Path d={`M${CX} ${42 + dy} L${CX} ${30 + dy}`} stroke={GARIS} strokeWidth={2.4} />
      <Circle cx={CX} cy={27 + dy} r={4.6} fill="#FF9F1C" stroke={GARIS} strokeWidth={1.8} />
      <Circle cx={34} cy={61 + dy} r={4.5} fill={gelap} stroke={GARIS} strokeWidth={1.8} />
      <Circle cx={86} cy={61 + dy} r={4.5} fill={gelap} stroke={GARIS} strokeWidth={1.8} />
      <Rect x={35} y={41 + dy} width={50} height={40} rx={15} fill={terang} stroke={GARIS} strokeWidth={2.4} />
      <Rect x={41} y={47 + dy} width={38} height={28} rx={10} fill={TINTA} stroke={GARIS} strokeWidth={1.5} />
      <LayarWajahRobi e={ekspresi} dy={dy} />
      {varian === 'kotor' && (
        <Lumpur
          titik={[
            [46, 118 + dy, 5],
            [72, 96 + dy, 3.5],
            [78, 47 + dy, 3],
            [52, 146, 3.5],
            [70, 124 + dy, 3],
          ]}
        />
      )}
      {sup && (
        // perisai cahaya di tangan kiri (melindungi, bukan senjata)
        <G>
          <Path d={`M${tk[0]} ${tk[1] - 16} Q${tk[0] + 11} ${tk[1] - 13} ${tk[0] + 12} ${tk[1] - 10} Q${tk[0] + 12} ${tk[1] + 8} ${tk[0]} ${tk[1] + 16} Q${tk[0] - 12} ${tk[1] + 8} ${tk[0] - 12} ${tk[1] - 10} Q${tk[0] - 11} ${tk[1] - 13} ${tk[0]} ${tk[1] - 16} Z`} fill="#9FE3FF" opacity={0.6} stroke="#4EA8DE" strokeWidth={2} strokeLinejoin="round" />
          <Path d={`M${tk[0] - 5} ${tk[1] - 6} Q${tk[0]} ${tk[1] - 10} ${tk[0] + 5} ${tk[1] - 6}`} stroke={PUTIH} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        </G>
      )}
      <Efek pose={pose} tangan={{ kiri: tk, kanan: tr }} kepala={[CX + 14, 26 + dy]} />
    </G>
  );
}

// ---------- Mister Kabut ----------

function GambarKabut({ pose, varian }: { pose: Pose; varian?: VarianTokoh }) {
  const jubah = '#8A8F98';
  const gelap = '#6F747D';
  const t = pose === 'jongkok' ? 16 : 0;
  const bahuY = 88 + t * 0.7;
  const sudut = SUDUT[pose];
  const lk = titikLengan([39, bahuY], -1, sudut.kiri, [15, 13]);
  const lr = titikLengan([81, bahuY], 1, sudut.kanan, [15, 13]);
  const e: Ekspresi = varian === 'sedih' ? 'sedih' : EKSPRESI_POSE[pose];
  const fy = 58 + t;
  const putih = '#F4F5F7';
  let mata: ReactNode;
  if (e === 'gembira') {
    mata = (
      <G stroke={putih} strokeWidth={2.4} strokeLinecap="round" fill="none">
        <Path d={`M50 ${fy + 1} Q53.5 ${fy - 4} 57 ${fy + 1}`} />
        <Path d={`M63 ${fy + 1} Q66.5 ${fy - 4} 70 ${fy + 1}`} />
        <Path d={`M55 ${fy + 7} Q60 ${fy + 11} 65 ${fy + 7}`} />
      </G>
    );
  } else {
    const r = e === 'kaget' ? 6 : 4.6;
    const px = e === 'lirik' ? 1.6 : 0;
    const py = e === 'penasaran' ? 1.6 : e === 'sedih' ? 1 : 0;
    mata = (
      <G>
        <Circle cx={53.5} cy={fy} r={r} fill={putih} stroke={GARIS} strokeWidth={1.2} />
        <Circle cx={66.5} cy={fy} r={r} fill={putih} stroke={GARIS} strokeWidth={1.2} />
        <Circle cx={53.5 + px} cy={fy + py} r={2.1} fill={TINTA} />
        <Circle cx={66.5 + px} cy={fy + py} r={2.1} fill={TINTA} />
        {e === 'biasa' && (
          // alis menggerutu (lucu, tidak seram)
          <G stroke={putih} strokeWidth={1.8} strokeLinecap="round">
            <Path d={`M49 ${fy - 7.5} L56 ${fy - 5.5}`} />
            <Path d={`M71 ${fy - 7.5} L64 ${fy - 5.5}`} />
          </G>
        )}
        {e === 'sedih' && (
          <G stroke={putih} strokeWidth={1.8} strokeLinecap="round">
            <Path d={`M49 ${fy - 5} L56 ${fy - 7.5}`} />
            <Path d={`M71 ${fy - 5} L64 ${fy - 7.5}`} />
          </G>
        )}
        {e === 'kaget' ? (
          <Ellipse cx={60} cy={fy + 10} rx={2.4} ry={3} fill={putih} />
        ) : e === 'senyum' ? (
          <Path d={`M55 ${fy + 8} Q60 ${fy + 12} 65 ${fy + 8}`} stroke={putih} strokeWidth={2} strokeLinecap="round" fill="none" />
        ) : (
          <Path d={`M55 ${fy + 9} q2.5 -2 5 0 q2.5 2 5 0`} stroke={putih} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        )}
      </G>
    );
  }
  const kabutKecil = (x: number, y: number, r: number) => <Circle cx={x} cy={y} r={r} fill="#DDE0E5" opacity={0.85} />;

  return (
    <G>
      <Ellipse cx={CX} cy={153} rx={40} ry={4.5} fill={GARIS} opacity={0.18} />
      <Lengan titik={lk} atas={jubah} bawah={jubah} tangan="#B9BDC4" tebal={8} />
      <Lengan titik={lr} atas={jubah} bawah={jubah} tangan="#B9BDC4" tebal={8} />
      {/* ujung tudung yang terkulai */}
      <Path d={`M66 ${30 + t} Q80 ${18 + t} 88 ${30 + t} Q90 ${36 + t} 84 ${37 + t} Q80 ${30 + t} 70 ${38 + t} Z`} fill={jubah} stroke={GARIS} strokeWidth={2} strokeLinejoin="round" />
      <Circle cx={87} cy={35 + t} r={3.4} fill="#DDE0E5" stroke={GARIS} strokeWidth={1.4} />
      {/* jubah */}
      <Path
        d={`M60 ${26 + t} C29 ${26 + t} 28 ${58 + t} 34 ${84 + t * 0.6} L24 141 Q32 151 40 144 Q48 152 56 145 Q64 152 72 145 Q80 152 88 144 Q95 150 96 141 L86 ${84 + t * 0.6} C92 ${58 + t} 91 ${26 + t} 60 ${26 + t} Z`}
        fill={jubah}
        stroke={GARIS}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <Path d={`M80 ${86 + t * 0.6} L88 141 Q92 146 95 141 L86 ${84 + t * 0.6} Z`} fill={gelap} opacity={0.6} />
      <Path d={`M60 ${92 + t * 0.6} L60 140`} stroke={gelap} strokeWidth={1.6} opacity={0.6} />
      {/* lubang wajah gelap dengan mata bulat kecil */}
      <Ellipse cx={60} cy={fy + 1} rx={17} ry={14.5} fill="#4B5059" stroke={GARIS} strokeWidth={1.8} />
      <Ellipse cx={47.5} cy={fy + 8} rx={3} ry={1.8} fill="#F2A3A3" opacity={0.5} />
      <Ellipse cx={72.5} cy={fy + 8} rx={3} ry={1.8} fill="#F2A3A3" opacity={0.5} />
      {mata}
      {kabutKecil(20, 146, 7)}
      {kabutKecil(31, 150, 5.5)}
      {kabutKecil(92, 150, 6)}
      {kabutKecil(102, 144, 5)}
      {varian === 'kotor' && (
        <Lumpur
          titik={[
            [44, 128, 4],
            [74, 112, 3],
          ]}
        />
      )}
      <Efek pose={pose} tangan={{ kiri: lk[2] as Titik, kanan: lr[2] as Titik }} kepala={[60, 22 + t]} />
    </G>
  );
}

// ---------- komponen utama ----------

export function TokohKomik({ tokoh, pose, balik, varian, tinggi }: PropsTokohKomik) {
  let isi: ReactNode;
  if (tokoh === 'robi') isi = <GambarRobi pose={pose} varian={varian} />;
  else if (tokoh === 'kabut') isi = <GambarKabut pose={pose} varian={varian} />;
  else isi = <GambarManusia m={MANUSIA[tokoh] ?? MANUSIA_CADANGAN} pose={pose} varian={varian === 'super' ? undefined : varian} />;
  return (
    <Svg width={tinggi * 0.75} height={tinggi} viewBox="0 0 120 160" style={balik ? { transform: [{ scaleX: -1 }] } : undefined}>
      {isi}
    </Svg>
  );
}
