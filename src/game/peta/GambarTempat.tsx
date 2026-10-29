/** Gambar empat tempat di peta Gampong (dari G01-Waktu-Main.dc.html). */
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { NamaGame } from '../bersama/ringkasan';

export function GambarTempat({ game, lebar = 128 }: { game: NamaGame; lebar?: number }) {
  const tinggi = (lebar * 104) / 128;
  return (
    <Svg width={lebar} height={tinggi} viewBox="0 0 128 104">
      {game === 'pasar' ? (
        <>
          <Rect x={16} y={44} width={96} height={54} rx={6} fill="#C98B55" stroke="#6B4423" strokeWidth={3} />
          <Path d="M8 44 L20 14 H108 L120 44 Z" fill="#FF9F1C" stroke="#6B4423" strokeWidth={3} strokeLinejoin="round" />
          <Path d="M38 14 L32 44 M64 14 V44 M90 14 L96 44" stroke="#FFF0D9" strokeWidth={7} />
          <Rect x={22} y={60} width={84} height={12} rx={3} fill="#8A5A33" />
          <Circle cx={40} cy={58} r={6} fill="#FFD23F" />
          <Circle cx={54} cy={58} r={6} fill="#3BB273" />
          <Circle cx={76} cy={58} r={6} fill="#E85D5D" />
        </>
      ) : game === 'ular_tangga' ? (
        <>
          <Rect x={10} y={14} width={108} height={80} rx={10} fill="#6CC28E" stroke="#2E7A4F" strokeWidth={3} />
          <Path d="M64 14 V94 M10 54 H118" stroke="#FFFFFF" strokeWidth={3} />
          <Circle cx={64} cy={54} r={14} stroke="#FFFFFF" strokeWidth={3} fill="none" />
          <Rect x={84} y={26} width={22} height={22} rx={5} fill="#FFFFFF" stroke="#2D3142" strokeWidth={2} />
          <Circle cx={90} cy={32} r={2.2} fill="#2D3142" />
          <Circle cx={100} cy={42} r={2.2} fill="#2D3142" />
          <Circle cx={95} cy={37} r={2.2} fill="#2D3142" />
        </>
      ) : game === 'susun_kubus' ? (
        <>
          <Path d="M14 46 L64 14 L114 46 Z" fill="#8A5A33" stroke="#6B4423" strokeWidth={3} strokeLinejoin="round" />
          <Rect x={22} y={46} width={84} height={52} fill="#D9A46B" stroke="#6B4423" strokeWidth={3} />
          <Rect x={34} y={66} width={18} height={18} rx={2} fill="#F2C48D" stroke="#6B4423" strokeWidth={2} />
          <Rect x={54} y={66} width={18} height={18} rx={2} fill="#F2C48D" stroke="#6B4423" strokeWidth={2} />
          <Rect x={44} y={48} width={18} height={18} rx={2} fill="#F2C48D" stroke="#6B4423" strokeWidth={2} />
          <Rect x={80} y={62} width={16} height={36} fill="#6B4423" />
        </>
      ) : (
        <>
          <Path d="M14 44 L64 10 L114 44 Z" fill="#E85D5D" stroke="#6B4423" strokeWidth={3} strokeLinejoin="round" />
          <Rect x={24} y={44} width={80} height={36} fill="#F2C48D" stroke="#6B4423" strokeWidth={3} />
          <Path d="M30 80 V100 M98 80 V100 M64 80 V100" stroke="#6B4423" strokeWidth={5} strokeLinecap="round" />
          <Path d="M48 56 q8 -4 16 0 q8 -4 16 0 v16 q-8 -4 -16 0 q-8 -4 -16 0 z" fill="#FFFFFF" stroke="#3A86FF" strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M64 56 V72" stroke="#3A86FF" strokeWidth={2} />
        </>
      )}
    </Svg>
  );
}

export const TEMPAT: { game: NamaGame; judul: string; sub: string; rute: string }[] = [
  { game: 'pasar', judul: 'Pasar Gampong', sub: 'Warung', rute: 'pasar' },
  { game: 'ular_tangga', judul: 'Ular Tangga', sub: 'Lapangan', rute: 'ular-tangga' },
  { game: 'susun_kubus', judul: 'Susun Kubus', sub: 'Bengkel kayu', rute: 'susun-kubus' },
  { game: 'tebak_kata', judul: 'Tebak Kata', sub: 'Pondok baca', rute: 'tebak-kata' },
];
