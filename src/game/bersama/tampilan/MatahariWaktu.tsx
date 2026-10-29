/** Matahari kecil di busur putus-putus: makin ke kanan bawah = waktu main makin sedikit (tanpa angka hitung mundur). */
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { posisiMatahari } from '../waktu';

export function MatahariWaktu({ sisaDetik, totalDetik, ukuran = 64 }: { sisaDetik: number; totalDetik: number; ukuran?: number }) {
  const f = Number.isFinite(sisaDetik) && totalDetik > 0 ? posisiMatahari(sisaDetik, totalDetik) : 0;
  // busur dari kiri bawah (8,44) lewat puncak ke kanan bawah (56,44)
  const sudut = Math.PI * (1 - f);
  const cx = 32 + 24 * Math.cos(sudut);
  const cy = 44 - 30 * Math.sin(sudut);
  return (
    <View accessibilityLabel={f >= 0.8 ? 'Waktu main hampir selesai' : 'Matahari waktu main'} style={{ width: ukuran, height: (ukuran * 52) / 64 }}>
      <Svg width={ukuran} height={(ukuran * 52) / 64} viewBox="0 0 64 52">
        <Path d="M8 46 Q8 8 32 8 Q56 8 56 46" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="5 5" fill="none" strokeLinecap="round" />
        <Circle cx={cx} cy={cy} r={8} fill={f >= 0.8 ? '#FF9F1C' : '#FFC93C'} stroke="#E0A800" strokeWidth={2} />
      </Svg>
    </View>
  );
}
