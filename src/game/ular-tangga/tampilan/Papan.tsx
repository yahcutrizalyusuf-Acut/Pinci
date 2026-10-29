/** Papan 10 × 10 (desain G04): petak berselang hijau muda, sulur ramah, pion anak dan Pinci. */
import { memo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { huruf } from '../../../desain/token';
import type { GerakTerakhir, PetaSulur } from '../logika';
import { jalurSvg, kurvaSulur, titikKurva } from './geometri';
import { Pion } from './Pion';

const BARIS = Array.from({ length: 10 }, (_, i) => i);

const Petak = memo(function Petak({ n, petak, terang }: { n: number; petak: number; terang: boolean }) {
  return (
    <View style={{ width: petak, height: petak, backgroundColor: terang ? '#F1F9F3' : '#DDF1E4' }}>
      <Text
        style={{
          fontFamily: huruf.anak,
          fontSize: petak >= 30 ? 11 : 9,
          lineHeight: petak >= 30 ? 13 : 11,
          color: '#3F5E4B',
          paddingLeft: 2,
          paddingTop: 1,
        }}
      >
        {n}
      </Text>
    </View>
  );
});

const Sulur = memo(function Sulur({ sulur, petak }: { sulur: PetaSulur; petak: number }) {
  const daftar = Object.entries(sulur).map(([bawah, atas]) => ({ bawah: Number(bawah), atas, kurva: kurvaSulur(Number(bawah), atas) }));
  const ukuran = petak * 10;
  return (
    <Svg width={ukuran} height={ukuran} viewBox={`0 0 ${ukuran} ${ukuran}`} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {daftar.flatMap(({ bawah, kurva }, i) => {
        const daun = titikKurva(kurva, 0.45);
        return [
          <Path key={`s${bawah}`} d={jalurSvg(kurva, petak)} stroke="#3BB273" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />,
          <Ellipse
            key={`d${bawah}`}
            cx={daun.x * petak}
            cy={daun.y * petak}
            rx={6}
            ry={3}
            fill="#2E9E5B"
            transform={`rotate(${i % 2 === 0 ? -30 : 30} ${daun.x * petak} ${daun.y * petak})`}
          />,
          <Circle key={`p${bawah}`} cx={kurva.x0 * petak} cy={kurva.y0 * petak} r={3} fill="#2E9E5B" />,
          <Circle key={`u${bawah}`} cx={kurva.x3 * petak} cy={kurva.y3 * petak} r={4} fill="#FF9F1C" />,
        ];
      })}
    </Svg>
  );
});

export function Papan({
  ukuran,
  sulur,
  posisiAwal,
  gerak,
}: {
  ukuran: number;
  sulur: PetaSulur;
  posisiAwal: { anak: number; pinci: number };
  gerak: GerakTerakhir | null;
}) {
  const petak = ukuran / 10;
  return (
    <View
      accessibilityLabel="Papan ular tangga 1 sampai 100"
      style={{
        width: ukuran,
        height: ukuran,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        shadowColor: '#8FC5A2',
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      {BARIS.map((baris) => (
        <View key={baris} style={{ flexDirection: 'row' }}>
          {BARIS.map((kolom) => (
            <Petak key={kolom} n={baris * 10 + kolom + 1} petak={petak} terang={(baris + kolom) % 2 === 0} />
          ))}
        </View>
      ))}
      <Sulur sulur={sulur} petak={petak} />
      <Pion siapa="pinci" petak={petak} posisiAwal={posisiAwal.pinci} gerak={gerak?.siapa === 'pinci' ? gerak : null} />
      <Pion siapa="anak" petak={petak} posisiAwal={posisiAwal.anak} gerak={gerak?.siapa === 'anak' ? gerak : null} />
    </View>
  );
}
