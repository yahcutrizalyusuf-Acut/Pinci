/** Gambar tempat di peta Gampong (empat pertama dari G01-Waktu-Main.dc.html, empat tempat baru digambar sendiri). */
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

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
      ) : game === 'kebun' ? (
        <>
          <Rect x={10} y={56} width={108} height={40} rx={8} fill="#A0703F" stroke="#6B4423" strokeWidth={3} />
          <Path d="M30 56 V36 M64 56 V30 M98 56 V36" stroke="#2E9E5B" strokeWidth={4} strokeLinecap="round" />
          <Circle cx={30} cy={30} r={9} fill="#FFC93C" stroke="#D97F10" strokeWidth={2} />
          <Circle cx={64} cy={24} r={10} fill="#E85D5D" stroke="#B23A3A" strokeWidth={2} />
          <Circle cx={98} cy={30} r={9} fill="#FF9F1C" stroke="#D97F10" strokeWidth={2} />
          <Path d="M22 74 H106 M22 86 H106" stroke="#8A5A33" strokeWidth={2} />
          <Path d="M108 14 q6 8 0 14 q-6 -6 0 -14 Z" fill="#4EA8DE" />
        </>
      ) : game === 'lompat_batu' ? (
        <>
          <Rect x={6} y={18} width={116} height={78} rx={14} fill="#7CC6EE" stroke="#3A86FF" strokeWidth={3} />
          <Path d="M16 40 q8 -5 16 0 M86 34 q8 -5 16 0 M50 84 q8 -5 16 0" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Ellipse cx={32} cy={78} rx={16} ry={9} fill="#A7A39A" stroke="#6E6A62" strokeWidth={2.5} />
          <Ellipse cx={64} cy={58} rx={16} ry={9} fill="#A7A39A" stroke="#6E6A62" strokeWidth={2.5} />
          <Ellipse cx={96} cy={40} rx={16} ry={9} fill="#A7A39A" stroke="#6E6A62" strokeWidth={2.5} />
        </>
      ) : game === 'pasangan' ? (
        <>
          <Rect x={14} y={20} width={44} height={60} rx={8} fill="#3BB273" stroke="#2E7A4F" strokeWidth={3} transform="rotate(-8 36 50)" />
          <Rect x={70} y={20} width={44} height={60} rx={8} fill="#FFFFFF" stroke="#BFE3F7" strokeWidth={3} transform="rotate(8 92 50)" />
          <Path d="M30 46 q6 -10 12 0 q-6 10 -12 0 Z" fill="#FFFFFF" />
          <Circle cx={92} cy={50} r={11} fill="#FFC93C" stroke="#D97F10" strokeWidth={2.5} />
          <Rect x={40} y={86} width={48} height={10} rx={5} fill="#FF9F1C" />
        </>
      ) : game === 'perahu' ? (
        <>
          <Rect x={6} y={50} width={116} height={46} rx={12} fill="#4EA8DE" />
          <Path d="M18 66 q8 -5 16 0 M70 82 q8 -5 16 0" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M20 56 H108 L94 78 H34 Z" fill="#C8553D" stroke="#5B3A1E" strokeWidth={3} strokeLinejoin="round" />
          <Path d="M64 56 V12 L96 44 H64" fill="#FFF0D9" stroke="#5B3A1E" strokeWidth={3} strokeLinejoin="round" />
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
  { game: 'kebun', judul: 'Kebun Pinci', sub: 'Menyiram tanaman', rute: 'kebun' },
  { game: 'lompat_batu', judul: 'Lompat Batu', sub: 'Sungai', rute: 'lompat-batu' },
  { game: 'pasangan', judul: 'Pasangkan Kartu', sub: 'Meja kartu', rute: 'pasangan' },
  { game: 'perahu', judul: 'Balap Perahu', sub: 'Dermaga', rute: 'perahu' },
];
