/** Gambar kubus kayu 3 sisi (atas terang, depan sedang, kanan gelap) dan kubus bayangan bergaris putus-putus. */
import { G, Polygon } from 'react-native-svg';

import { keTeksTitik, sisiKubus, type Geometri } from './geometri';

export const KAYU = {
  terang: '#EBC48F',
  sedang: '#D9A46B',
  gelap: '#B57E48',
  garis: '#8A5A33',
  putus: '#B98B5A',
  papan: '#A9733F',
  papanGelap: '#8A5A33',
  ubin: '#EEDBB8',
  ubinGaris: '#C9A46A',
  latarKartu: '#FBF3E4',
} as const;

export function GambarKubus({ g, b, k, z }: { g: Geometri; b: number; k: number; z: number }) {
  const sisi = sisiKubus(g, b, k, z);
  const lebarGaris = Math.max(1.5, g.s * 0.045);
  return (
    <G>
      <Polygon points={keTeksTitik(sisi.depan)} fill={KAYU.sedang} stroke={KAYU.garis} strokeWidth={lebarGaris} strokeLinejoin="round" />
      <Polygon points={keTeksTitik(sisi.atas)} fill={KAYU.terang} stroke={KAYU.garis} strokeWidth={lebarGaris} strokeLinejoin="round" />
      <Polygon points={keTeksTitik(sisi.kanan)} fill={KAYU.gelap} stroke={KAYU.garis} strokeWidth={lebarGaris} strokeLinejoin="round" />
    </G>
  );
}

/**
 * Kubus yang masih dibutuhkan, bergaris putus-putus (seperti desain).
 * `arah = 'depan'`: untuk kartu tampak depan; `'kanan'`: untuk kartu tampak samping (dilihat dari kanan).
 */
export function KubusPerlu({ g, b, k, z, arah = 'depan' }: { g: Geometri; b: number; k: number; z: number; arah?: 'depan' | 'kanan' }) {
  const sisi = sisiKubus(g, b, k, z);
  const lebar = Math.max(2, g.s * 0.05);
  const putus = `${(g.s * 0.12).toFixed(1)} ${(g.s * 0.09).toFixed(1)}`;
  if (arah === 'kanan') {
    return (
      <Polygon points={keTeksTitik(sisi.kanan)} fill="rgba(255,255,255,0.55)" stroke={KAYU.putus} strokeWidth={lebar} strokeDasharray={putus} strokeLinejoin="round" />
    );
  }
  return (
    <G>
      <Polygon points={keTeksTitik(sisi.depan)} fill="rgba(255,255,255,0.55)" stroke={KAYU.putus} strokeWidth={lebar} strokeDasharray={putus} strokeLinejoin="round" />
      <Polygon points={keTeksTitik(sisi.atas)} fill="none" stroke={KAYU.putus} strokeWidth={lebar * 0.8} strokeDasharray={putus} strokeLinejoin="round" />
    </G>
  );
}
