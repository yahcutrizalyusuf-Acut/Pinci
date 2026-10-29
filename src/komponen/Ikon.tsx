/** Ikon garis sederhana dari berkas desain (viewBox 24 × 24). */
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type NamaIkon =
  | 'rumah'
  | 'buku'
  | 'dadu'
  | 'pesan'
  | 'gembok'
  | 'suara'
  | 'kanan'
  | 'kiri'
  | 'jeda'
  | 'lampu'
  | 'hapus'
  | 'centang'
  | 'rapor'
  | 'orang'
  | 'atur'
  | 'tambah'
  | 'hitung'
  | 'bacaan'
  | 'inggris'
  | 'awan'
  | 'tutup'
  | 'jam'
  | 'bintang'
  | 'putar'
  | 'urung'
  | 'perisai'
  | 'slider'
  | 'kirim'
  | 'hati'
  | 'tanya'
  | 'bagikan'
  | 'dua_orang'
  | 'grafik';

interface Props {
  nama: NamaIkon;
  ukuran?: number;
  warna?: string;
  isi?: boolean;
}

export function Ikon({ nama, ukuran = 24, warna = '#2D3142', isi = false }: Props) {
  const g = { stroke: warna, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  let badan: React.ReactNode;
  switch (nama) {
    case 'rumah':
      badan = isi ? (
        <Path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill={warna} />
      ) : (
        <Path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" {...g} />
      );
      break;
    case 'buku':
      badan = <Path d="M5 19.5V5a2 2 0 0 1 2-2h12v14H7a2 2 0 0 0-2 2.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19" {...g} />;
      break;
    case 'dadu':
      badan = (
        <>
          <Rect x={4} y={4} width={16} height={16} rx={4} {...g} />
          <Circle cx={9} cy={9} r={1.4} fill={warna} />
          <Circle cx={15} cy={15} r={1.4} fill={warna} />
          <Circle cx={12} cy={12} r={1.4} fill={warna} />
        </>
      );
      break;
    case 'pesan':
      badan = isi ? <Path d="M4 5h16v11H9l-5 4z" fill={warna} /> : <Path d="M4 5h16v11H9l-5 4z" {...g} />;
      break;
    case 'gembok':
      badan = (
        <>
          <Rect x={5} y={10} width={14} height={10} rx={2.5} {...g} />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3" {...g} />
        </>
      );
      break;
    case 'suara':
      badan = (
        <>
          <Path d="M4 9v6h4l5 4V5L8 9H4z" fill={warna} />
          <Path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" {...g} />
        </>
      );
      break;
    case 'kanan':
      badan = <Path d="M9 6l6 6-6 6" {...g} strokeWidth={2.2} />;
      break;
    case 'kiri':
      badan = <Path d="M15 6l-6 6 6 6" {...g} strokeWidth={2.2} />;
      break;
    case 'jeda':
      badan = (
        <>
          <Rect x={7} y={5} width={3} height={14} rx={1.2} fill={warna} />
          <Rect x={14} y={5} width={3} height={14} rx={1.2} fill={warna} />
        </>
      );
      break;
    case 'lampu':
      badan = (
        <>
          <Path d="M9 18h6M10 21h4" {...g} />
          <Path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" {...g} />
        </>
      );
      break;
    case 'hapus':
      badan = (
        <>
          <Path d="M21 5H9l-6 7 6 7h12z" {...g} />
          <Path d="M13 9l5 6M18 9l-5 6" {...g} />
        </>
      );
      break;
    case 'centang':
      badan = <Path d="M5 12.5l4.5 4.5L19 7" {...g} strokeWidth={2.6} />;
      break;
    case 'rapor':
      badan = (
        <>
          <Rect x={5} y={4} width={14} height={17} rx={2} {...g} />
          <Path d="M8 9h8M8 13h8M8 17h5" {...g} />
        </>
      );
      break;
    case 'orang':
      badan = (
        <>
          <Circle cx={12} cy={8} r={4} {...g} />
          <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...g} />
        </>
      );
      break;
    case 'atur':
      badan = (
        <>
          <Circle cx={12} cy={12} r={3} {...g} />
          <Path d="M12 3v3M12 18v3M4.2 7.8l2.5 1.5M17.3 14.7l2.5 1.5M4.2 16.2l2.5-1.5M17.3 9.3l2.5-1.5" {...g} />
        </>
      );
      break;
    case 'tambah':
      badan = <Path d="M12 5v14M5 12h14" {...g} strokeWidth={2.4} />;
      break;
    case 'hitung':
      badan = <Path d="M7 4v6M4 7h6M14 7h6M5 15l4 4M9 15l-4 4M14 16h6M14 19h6" {...g} strokeWidth={2.2} />;
      break;
    case 'bacaan':
      badan = (
        <>
          <Path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5V19c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5z" {...g} />
          <Path d="M12 6v13.5" {...g} />
        </>
      );
      break;
    case 'inggris':
      badan = (
        <>
          <Path d="M4 5h16v11H9l-5 4z" {...g} />
          <Path d="M9 13l2-6 2 6M9.7 11h2.6" {...g} strokeWidth={1.8} />
        </>
      );
      break;
    case 'awan':
      badan = <Path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 10.5 3.75 3.75 0 0 0 7 18z" {...g} />;
      break;
    case 'tutup':
      badan = <Path d="M6 6l12 12M18 6L6 18" {...g} strokeWidth={2.4} />;
      break;
    case 'jam':
      badan = (
        <>
          <Circle cx={12} cy={12} r={8} {...g} />
          <Path d="M12 8v4l3 2" {...g} />
        </>
      );
      break;
    case 'bintang':
      badan = (
        <Path
          d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"
          fill={isi ? warna : 'none'}
          stroke={warna}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      );
      break;
    case 'putar':
      badan = (
        <>
          <Path d="M20 12a8 8 0 1 1-2.3-5.6" {...g} />
          <Path d="M20 4v5h-5" {...g} />
        </>
      );
      break;
    case 'urung':
      badan = (
        <>
          <Path d="M9 14L4 9l5-5" {...g} />
          <Path d="M4 9h10a6 6 0 0 1 0 12h-3" {...g} />
        </>
      );
      break;
    case 'perisai':
      badan = isi ? (
        <>
          <Path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" fill={warna} />
          <Path d="M8.5 12l2.5 2.5 4.5-5" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <Path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" {...g} />
          <Path d="M8.5 12l2.5 2.5 4.5-5" {...g} />
        </>
      );
      break;
    case 'slider':
      badan = (
        <>
          <Path d="M4 8h16M4 16h16" {...g} />
          <Circle cx={15} cy={8} r={2.2} fill={isi ? warna : '#FFFFFF'} stroke={warna} strokeWidth={2} />
          <Circle cx={9} cy={16} r={2.2} fill={isi ? warna : '#FFFFFF'} stroke={warna} strokeWidth={2} />
        </>
      );
      break;
    case 'kirim':
      badan = <Path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" fill={warna} stroke={warna} strokeWidth={1.5} strokeLinejoin="round" />;
      break;
    case 'hati':
      badan = <Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={warna} />;
      break;
    case 'tanya':
      badan = (
        <>
          <Circle cx={12} cy={12} r={9} {...g} />
          <Path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" {...g} />
          <Circle cx={12} cy={17} r={1.1} fill={warna} />
        </>
      );
      break;
    case 'bagikan':
      badan = (
        <>
          <Circle cx={18} cy={5} r={2.5} {...g} />
          <Circle cx={6} cy={12} r={2.5} {...g} />
          <Circle cx={18} cy={19} r={2.5} {...g} />
          <Path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" {...g} />
        </>
      );
      break;
    case 'dua_orang':
      badan = (
        <>
          <Circle cx={9} cy={8} r={3} {...g} />
          <Circle cx={17} cy={9} r={2.4} {...g} />
          <Path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M15 14.5c2.8 0 5 1.6 5 4.5" {...g} />
        </>
      );
      break;
    case 'grafik':
      badan = isi ? (
        <>
          <Rect x={5} y={3} width={14} height={18} rx={2} fill={warna} />
          <Path d="M9 16v-4M12 16V8M15 16v-6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Rect x={5} y={3} width={14} height={18} rx={2} {...g} />
          <Path d="M9 16v-4M12 16V8M15 16v-6" {...g} />
        </>
      );
      break;
  }
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 24 24">
      {badan}
    </Svg>
  );
}
