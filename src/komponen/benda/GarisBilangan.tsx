/** Garis Bilangan: tanda, titik, dan lompatan (busur). Dipakai sebagai gambar dan untuk benda "lompat". */
import { Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { huruf, warna } from '../../desain/token';
import { tandaGaris, tulisTanda } from '../../isi/gudang/benda';
import type { GarisBilanganData } from '../../isi/gudang/jenis';

export function uraianGaris(g: GarisBilanganData): string {
  const t = `Garis bilangan dari ${tulisTanda(g.mulai, g.penyebut)} sampai ${tulisTanda(g.akhir, g.penyebut)}${g.satuan ? ` ${g.satuan}` : ''}.`;
  const l = g.lompatan?.length ? ` ${g.lompatan.length} lompatan.` : '';
  const p = g.titik?.length ? ` Titik di ${g.titik.map((x) => x.label ?? tulisTanda(x.nilai, g.penyebut)).join(', ')}.` : '';
  return t + l + p;
}

export function GarisBilangan({ data, lebar }: { data: GarisBilanganData; lebar: number }) {
  const tanda = tandaGaris(data);
  const tepi = 18;
  const x = (n: number) => tepi + ((n - data.mulai) / (data.akhir - data.mulai)) * (lebar - 2 * tepi);
  const y = 70;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={uraianGaris(data)} style={{ width: lebar }}>
      <Svg width={lebar} height={92}>
        <Line x1={6} y1={y} x2={lebar - 6} y2={y} stroke={warna.biruTinta} strokeWidth={3} strokeLinecap="round" />
        {tanda.map((n) => (
          <Line key={n} x1={x(n)} y1={y - 8} x2={x(n)} y2={y + 8} stroke={warna.biruTinta} strokeWidth={2} />
        ))}
        {(data.lompatan ?? []).map((l, i) => {
          const a = x(l.dari);
          const b = x(l.ke);
          const t = Math.min(46, Math.abs(b - a) * 0.6 + 10);
          return <Path key={i} d={`M${a} ${y - 4} Q${(a + b) / 2} ${y - 4 - t} ${b} ${y - 4}`} stroke={warna.oranye} strokeWidth={3} fill="none" />;
        })}
        {(data.titik ?? []).map((p, i) => (
          <Circle key={i} cx={x(p.nilai)} cy={y} r={7} fill={warna.hijauDaun} stroke={warna.putih} strokeWidth={2} />
        ))}
      </Svg>
      <View style={{ height: 22 }}>
        {tanda.map((n, i) =>
          tanda.length <= 7 || i % 2 === 0 || i === tanda.length - 1 ? (
            <Text key={n} style={{ position: 'absolute', left: x(n) - 30, width: 60, textAlign: 'center', fontFamily: huruf.anak, fontSize: 13, color: warna.teks }}>
              {tulisTanda(n, data.penyebut)}
            </Text>
          ) : null,
        )}
      </View>
      {data.satuan ? <Text style={{ alignSelf: 'flex-end', fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>{data.satuan}</Text> : null}
    </View>
  );
}
