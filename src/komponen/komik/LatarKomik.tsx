/**
 * Gambar SEMENTARA 8 latar Cerita Komik (rancangan 13 bagian 5, PROMPT-LANJUTAN-KOMIK tahap 3).
 * Suasana kampung di Aceh: sawah, sungai, lapangan, kedai, rumah panggung, kelas, jalan kampung, sore hari.
 * Flat 2D, warna lembut, tanpa teks di dalam gambar (CLAUDE.md aturan 13). Kotak 300 × 300; tanah di y ≈ 230.
 */
import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';

import type { Latar } from '../../isi/inggris/komik';

const GARIS = '#6B4423';
export const TANAH_Y = 232;

function Awan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G opacity={0.95}>
      <Ellipse cx={x} cy={y} rx={22 * s} ry={11 * s} fill="#FFFFFF" />
      <Ellipse cx={x + 16 * s} cy={y - 6 * s} rx={15 * s} ry={11 * s} fill="#FFFFFF" />
      <Ellipse cx={x - 14 * s} cy={y - 3 * s} rx={12 * s} ry={9 * s} fill="#FFFFFF" />
    </G>
  );
}

function Kelapa({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const daun = '#5E9C4F';
  return (
    <G>
      <Path d={`M${x} ${y} Q${x + 6 * s} ${y - 50 * s} ${x + 2 * s} ${y - 92 * s}`} stroke="#8B6A45" strokeWidth={6 * s} fill="none" strokeLinecap="round" />
      {[-150, -110, -70, -30, 10].map((a) => {
        const r = (a * Math.PI) / 180;
        const tx = x + 2 * s + Math.cos(r) * 34 * s;
        const ty = y - 92 * s + Math.sin(r) * 20 * s + 14 * s;
        return <Path key={a} d={`M${x + 2 * s} ${y - 92 * s} Q${(x + 2 * s + tx) / 2} ${y - 104 * s} ${tx} ${ty}`} stroke={daun} strokeWidth={6 * s} fill="none" strokeLinecap="round" />;
      })}
      <Circle cx={x} cy={y - 88 * s} r={3.5 * s} fill="#7A5A35" />
      <Circle cx={x + 6 * s} cy={y - 87 * s} r={3.5 * s} fill="#7A5A35" />
    </G>
  );
}

function Gunung() {
  return (
    <G>
      <Path d="M0 170 L60 110 L105 150 L160 92 L230 160 L270 128 L300 150 L300 200 L0 200 Z" fill="#A9C7B5" />
      <Path d="M140 112 L160 92 L178 110 L168 106 L160 112 L150 106 Z" fill="#E8F1EC" />
    </G>
  );
}

function RumahPanggung({ x, y, s = 1, warna = '#C98F5A' }: { x: number; y: number; s?: number; warna?: string }) {
  return (
    <G>
      {[0, 30, 60, 90].map((dx) => (
        <Rect key={dx} x={x + dx * s} y={y - 26 * s} width={6 * s} height={26 * s} fill="#7A5A35" />
      ))}
      <Rect x={x - 6 * s} y={y - 70 * s} width={108 * s} height={46 * s} rx={3 * s} fill={warna} stroke={GARIS} strokeWidth={2} />
      <Polygon points={`${x - 16 * s},${y - 68 * s} ${x + 48 * s},${y - 110 * s} ${x + 112 * s},${y - 68 * s}`} fill="#9C4A3A" stroke={GARIS} strokeWidth={2} strokeLinejoin="round" />
      <Rect x={x + 10 * s} y={y - 60 * s} width={20 * s} height={20 * s} fill="#F6E3B4" stroke={GARIS} strokeWidth={1.5} />
      <Rect x={x + 62 * s} y={y - 60 * s} width={20 * s} height={20 * s} fill="#F6E3B4" stroke={GARIS} strokeWidth={1.5} />
      <Path d={`M${x + 36 * s} ${y - 24 * s} L${x + 30 * s} ${y} M${x + 50 * s} ${y - 24 * s} L${x + 44 * s} ${y} M${x + 31 * s} ${y - 8 * s} L${x + 46 * s} ${y - 8 * s} M${x + 34 * s} ${y - 16 * s} L${x + 48 * s} ${y - 16 * s}`} stroke="#7A5A35" strokeWidth={2.5 * s} />
    </G>
  );
}

function Langit({ atas, bawah }: { atas: string; bawah: string }) {
  return (
    <G>
      <Rect x={0} y={0} width={300} height={150} fill={atas} />
      <Rect x={0} y={120} width={300} height={120} fill={bawah} />
    </G>
  );
}

function Sawah(): ReactNode {
  return (
    <G>
      <Langit atas="#BFE3F2" bawah="#D9EEF5" />
      <Gunung />
      <Awan x={60} y={45} />
      <Awan x={230} y={65} s={0.8} />
      <Rect x={0} y={190} width={300} height={110} fill="#9CCB6B" />
      {[0, 1, 2, 3].map((i) => (
        <Path key={i} d={`M0 ${200 + i * 24} Q150 ${194 + i * 24} 300 ${200 + i * 24}`} stroke="#7FB356" strokeWidth={3} fill="none" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <Path key={i} d={`M${10 + i * 21} 210 l-3 -9 M${10 + i * 21} 210 l0 -11 M${10 + i * 21} 210 l3 -9`} stroke="#5E9C4F" strokeWidth={2} />
      ))}
      <Kelapa x={268} y={196} s={0.8} />
      <RumahPanggung x={20} y={192} s={0.45} />
    </G>
  );
}

function Sungai(): ReactNode {
  return (
    <G>
      <Langit atas="#BFE3F2" bawah="#D9EEF5" />
      <Gunung />
      <Awan x={200} y={40} />
      <Rect x={0} y={185} width={300} height={115} fill="#A7D17A" />
      <Path d="M0 230 Q80 214 150 228 T300 222 L300 300 L0 300 Z" fill="#7EC3DE" />
      <Path d="M30 252 q12 -5 24 0 M150 262 q12 -5 24 0 M230 248 q12 -5 24 0" stroke="#FFFFFF" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Ellipse cx={60} cy={228} rx={16} ry={7} fill="#B8A88F" stroke={GARIS} strokeWidth={1.5} />
      <Ellipse cx={250} cy={226} rx={12} ry={6} fill="#B8A88F" stroke={GARIS} strokeWidth={1.5} />
      <Kelapa x={40} y={200} s={0.9} />
    </G>
  );
}

function Lapangan(): ReactNode {
  return (
    <G>
      <Langit atas="#BFE3F2" bawah="#DCF0F6" />
      <Awan x={70} y={50} />
      <Awan x={220} y={35} s={0.9} />
      <Rect x={0} y={170} width={300} height={130} fill="#A7D17A" />
      <Path d="M0 186 L300 186" stroke="#C7E3A3" strokeWidth={4} />
      <Ellipse cx={150} cy={250} rx={60} ry={18} fill="none" stroke="#C7E3A3" strokeWidth={4} />
      {/* gawang sederhana */}
      <Path d="M228 186 L228 146 L288 146 L288 186" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinejoin="round" />
      <Path d="M236 150 L236 186 M248 150 L248 186 M260 150 L260 186 M272 150 L272 186 M284 150 L284 186 M230 160 L286 160 M230 172 L286 172" stroke="#E6E6E6" strokeWidth={1} />
      <Kelapa x={30} y={180} s={0.85} />
      <Kelapa x={60} y={176} s={0.7} />
    </G>
  );
}

function Kedai(): ReactNode {
  return (
    <G>
      <Langit atas="#CDE8F2" bawah="#E3F2F7" />
      <Rect x={0} y={200} width={300} height={100} fill="#E7D3AE" />
      {/* bangunan kedai kayu */}
      <Rect x={20} y={70} width={260} height={130} fill="#D9A86C" stroke={GARIS} strokeWidth={2.5} />
      <Path d="M8 76 L150 30 L292 76 Z" fill="#9C4A3A" stroke={GARIS} strokeWidth={2.5} strokeLinejoin="round" />
      {/* tenda garis */}
      <Path d="M20 92 L280 92 L270 112 L30 112 Z" fill="#F4C76B" stroke={GARIS} strokeWidth={2} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Rect key={i} x={36 + i * 40} y={93} width={20} height={18} fill="#E8836B" />
      ))}
      {/* meja dan toples */}
      <Rect x={40} y={160} width={220} height={14} rx={3} fill="#8B6A45" stroke={GARIS} strokeWidth={2} />
      <Rect x={52} y={174} width={8} height={26} fill="#7A5A35" />
      <Rect x={240} y={174} width={8} height={26} fill="#7A5A35" />
      {[70, 110, 150, 190, 226].map((x, i) => (
        <G key={x}>
          <Rect x={x} y={134} width={22} height={26} rx={5} fill="#E8F4F8" stroke={GARIS} strokeWidth={1.5} />
          <Circle cx={x + 11} cy={150} r={6} fill={['#F4C76B', '#E8836B', '#9CCB6B', '#C98F5A', '#F2A3A3'][i]} />
        </G>
      ))}
      <Circle cx={150} cy={126} r={0} />
    </G>
  );
}

function Rumah(): ReactNode {
  return (
    <G>
      <Rect x={0} y={0} width={300} height={300} fill="#F6E7CF" />
      {/* dinding kayu */}
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={`M${i * 30 + 15} 0 L${i * 30 + 15} 205`} stroke="#E9D2AF" strokeWidth={2} />
      ))}
      <Rect x={0} y={205} width={300} height={95} fill="#C99A68" />
      {Array.from({ length: 6 }, (_, i) => (
        <Path key={i} d={`M0 ${215 + i * 16} L300 ${215 + i * 16}`} stroke="#B8875A" strokeWidth={1.5} />
      ))}
      {/* jendela terbuka dengan pemandangan */}
      <Rect x={180} y={40} width={90} height={80} fill="#BFE3F2" stroke={GARIS} strokeWidth={3} />
      <Path d="M180 100 Q225 86 270 100 L270 120 L180 120 Z" fill="#9CCB6B" />
      <Path d="M225 40 L225 120" stroke={GARIS} strokeWidth={2.5} />
      <Rect x={174} y={118} width={102} height={8} fill="#8B6A45" />
      {/* tikar dan lemari kecil */}
      <Ellipse cx={120} cy={258} rx={90} ry={22} fill="#E8B04C" opacity={0.75} />
      <Rect x={20} y={130} width={60} height={75} rx={4} fill="#A8714A" stroke={GARIS} strokeWidth={2} />
      <Path d="M50 134 L50 200" stroke={GARIS} strokeWidth={1.5} />
      <Circle cx={45} cy={168} r={2.5} fill="#F4C76B" />
      <Circle cx={55} cy={168} r={2.5} fill="#F4C76B" />
      {/* pot bunga */}
      <Rect x={98} y={176} width={24} height={20} rx={4} fill="#C1694F" />
      <Circle cx={104} cy={168} r={7} fill="#F2A3A3" />
      <Circle cx={116} cy={164} r={7} fill="#F4C76B" />
      <Circle cx={110} cy={172} r={6} fill="#5E9C4F" />
    </G>
  );
}

function Kelas(): ReactNode {
  return (
    <G>
      <Rect x={0} y={0} width={300} height={300} fill="#F3EEDC" />
      <Rect x={0} y={215} width={300} height={85} fill="#D8C6A2" />
      {/* papan tulis hijau tanpa tulisan */}
      <Rect x={40} y={30} width={170} height={96} rx={4} fill="#4F7B5C" stroke="#8B6A45" strokeWidth={6} />
      <Path d="M60 60 q20 -10 40 0 M60 86 l50 0" stroke="#A8C7B0" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.6} />
      <Rect x={70} y={126} width={110} height={6} fill="#8B6A45" />
      {/* jendela */}
      <Rect x={234} y={36} width={50} height={70} fill="#BFE3F2" stroke={GARIS} strokeWidth={3} />
      <Path d="M259 36 L259 106 M234 71 L284 71" stroke={GARIS} strokeWidth={2} />
      {/* rak buku */}
      <Rect x={234} y={140} width={56} height={75} fill="#A8714A" stroke={GARIS} strokeWidth={2} />
      {[150, 176, 202].map((y) => (
        <G key={y}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Rect key={i} x={238 + i * 10} y={y - 6} width={8} height={18} fill={['#E8836B', '#7EC3DE', '#F4C76B', '#9CCB6B', '#F2A3A3'][(i + y) % 5]} />
          ))}
        </G>
      ))}
      {/* meja murid di depan */}
      <Rect x={10} y={250} width={110} height={10} rx={3} fill="#B8875A" stroke={GARIS} strokeWidth={2} />
      <Rect x={20} y={260} width={6} height={30} fill="#8B6A45" />
      <Rect x={104} y={260} width={6} height={30} fill="#8B6A45" />
    </G>
  );
}

function Jalan(): ReactNode {
  return (
    <G>
      <Langit atas="#BFE3F2" bawah="#DCF0F6" />
      <Awan x={150} y={44} />
      <Rect x={0} y={170} width={300} height={130} fill="#A7D17A" />
      <Path d="M110 300 L135 170 L165 170 L190 300 Z" fill="#D8C6A2" />
      <Path d="M0 250 L300 250 L300 300 L0 300 Z" fill="#D8C6A2" />
      <Path d="M0 250 L300 250" stroke="#C4B08A" strokeWidth={2} />
      {/* pagar bambu */}
      {Array.from({ length: 9 }, (_, i) => (
        <Rect key={i} x={6 + i * 12} y={208} width={5} height={36} rx={2} fill="#D9B77A" stroke={GARIS} strokeWidth={1} />
      ))}
      <Path d="M4 218 L114 218 M4 232 L114 232" stroke="#B8875A" strokeWidth={3} />
      <RumahPanggung x={196} y={210} s={0.85} warna="#D9A86C" />
      <Kelapa x={90} y={200} s={0.8} />
    </G>
  );
}

function Sore(): ReactNode {
  return (
    <G>
      <Rect x={0} y={0} width={300} height={130} fill="#F7C59F" />
      <Rect x={0} y={110} width={300} height={100} fill="#F9DDB8" />
      <Circle cx={210} cy={140} r={34} fill="#F4A259" />
      <Path d="M0 170 L60 128 L110 160 L170 120 L240 168 L300 140 L300 210 L0 210 Z" fill="#C79A8A" />
      <Rect x={0} y={195} width={300} height={105} fill="#B5C77A" />
      {[0, 1, 2].map((i) => (
        <Path key={i} d={`M0 ${215 + i * 26} Q150 ${208 + i * 26} 300 ${215 + i * 26}`} stroke="#9FB466" strokeWidth={3} fill="none" />
      ))}
      <Path d="M40 60 q6 -6 12 0 q6 -6 12 0 M90 40 q5 -5 10 0 q5 -5 10 0" stroke="#7A5A35" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Kelapa x={40} y={202} s={0.9} />
      <RumahPanggung x={160} y={200} s={0.5} warna="#C98F5A" />
    </G>
  );
}

const PELUKIS: Record<Latar, () => ReactNode> = {
  sawah: Sawah,
  sungai: Sungai,
  lapangan: Lapangan,
  kedai: Kedai,
  rumah: Rumah,
  kelas: Kelas,
  jalan: Jalan,
  sore: Sore,
};

export const SEMUA_LATAR = Object.keys(PELUKIS) as Latar[];

export function LatarKomik({ latar, lebar }: { latar: Latar; lebar: number }) {
  const Pelukis = PELUKIS[latar] ?? Rumah;
  return (
    <Svg width={lebar} height={lebar} viewBox="0 0 300 300">
      <Pelukis />
    </Svg>
  );
}
