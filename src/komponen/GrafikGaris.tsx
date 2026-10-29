/** Grafik garis sederhana (O11 Kecepatan 8 minggu). Nilai null = tidak latihan (titik dilewati). */
import { Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { huruf, warna } from '../desain/token';

export function GrafikGaris({
  nilai,
  lebar = 300,
  tinggi = 150,
  warnaGaris = warna.hijauDaun,
  format = (n: number) => String(n).replace('.', ','),
}: {
  nilai: (number | null)[];
  lebar?: number;
  tinggi?: number;
  warnaGaris?: string;
  format?: (n: number) => string;
}) {
  const ada = nilai.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v !== null);
  if (ada.length === 0) {
    return (
      <View style={{ height: tinggi, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: huruf.ortu, color: warna.teksKedua }}>Belum ada data.</Text>
      </View>
    );
  }
  const maks = Math.max(...ada.map((x) => x.v)) * 1.1 || 1;
  const min = Math.min(0, ...ada.map((x) => x.v));
  const pad = 16;
  const x = (i: number) => pad + (i * (lebar - pad * 2)) / Math.max(1, nilai.length - 1);
  const y = (v: number) => pad + (1 - (v - min) / (maks - min)) * (tinggi - pad * 2);
  const titik = ada.map((p) => `${x(p.i)},${y(p.v)}`).join(' ');
  const akhir = ada[ada.length - 1];
  return (
    <Svg width="100%" height={tinggi} viewBox={`0 0 ${lebar} ${tinggi}`}>
      {[0.25, 0.5, 0.75].map((f) => (
        <Line key={f} x1={pad} x2={lebar - pad} y1={pad + f * (tinggi - pad * 2)} y2={pad + f * (tinggi - pad * 2)} stroke={warna.abuGaris} strokeWidth={1} />
      ))}
      <Polyline points={titik} fill="none" stroke={warnaGaris} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {ada.map((p, k) => (
        <Circle key={p.i} cx={x(p.i)} cy={y(p.v)} r={k === ada.length - 1 ? 6 : 4} fill={k === ada.length - 1 ? warna.hijauTua : warnaGaris} />
      ))}
      <SvgText x={x(ada[0].i)} y={y(ada[0].v) - 8} fontSize={11} fill={warna.teksKedua}>
        {format(ada[0].v)}
      </SvgText>
      {ada.length > 1 ? (
        <SvgText x={x(akhir.i) - 6} y={y(akhir.v) - 10} fontSize={12} fontWeight="700" textAnchor="end" fill={warna.hijauTua}>
          {format(akhir.v)}
        </SvgText>
      ) : null}
    </Svg>
  );
}
