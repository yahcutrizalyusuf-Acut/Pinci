/**
 * Pemandangan warung (dari desain G03): atap oranye bergaris, tiang, meja kayu, pisang,
 * pembeli di balik meja, dan gelembung pesanan.
 */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { gerak, huruf, warna } from '../../../desain/token';
import { formatAngka, formatRupiah } from '../../bersama/jenis';
import type { Pesanan } from '../logika';

export const LATAR_WARUNG = '#CDEBD8';

function LatarWarung() {
  return (
    <Svg width={360} height={250} viewBox="0 0 360 250" style={{ position: 'absolute', left: 0, top: 0 }}>
      <Circle cx={30} cy={60} r={26} fill="#3BB273" />
      <Circle cx={336} cy={40} r={22} fill="#3BB273" />
      <Path d="M40 70 L60 30 H300 L320 70 Z" fill="#FF9F1C" stroke="#6B4423" strokeWidth={3} strokeLinejoin="round" />
      <Path d="M100 30 L92 70 M140 30 L136 70 M180 30 V70 M220 30 L224 70 M260 30 L268 70" stroke="#FFF0D9" strokeWidth={8} />
      <Rect x={54} y={70} width={8} height={120} fill="#8A5A33" />
      <Rect x={298} y={70} width={8} height={120} fill="#8A5A33" />
    </Svg>
  );
}

function MejaWarung() {
  return (
    <Svg width={360} height={250} viewBox="0 0 360 250" style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Rect x={40} y={186} width={280} height={64} fill="#C98B55" stroke="#6B4423" strokeWidth={3} />
      <Rect x={40} y={176} width={280} height={14} rx={4} fill="#8A5A33" />
      <Path d="M232 172 q10 -26 30 -26 q-12 10 -10 26 z" fill="#FFD23F" stroke="#C99A00" strokeWidth={2} />
      <Path d="M252 172 q10 -26 30 -26 q-12 10 -10 26 z" fill="#FFD23F" stroke="#C99A00" strokeWidth={2} />
      <Path d="M272 172 q10 -26 30 -26 q-12 10 -10 26 z" fill="#FFD23F" stroke="#C99A00" strokeWidth={2} />
    </Svg>
  );
}

/** Bu Rusa digambar seperti desain; pembeli lain memakai badan yang sama dengan wajah emoji. */
function GambarPembeli({ id, emoji, senang }: { id: string; emoji: string; senang: boolean }) {
  if (id === 'rusa') {
    return (
      <Svg width={100} height={130} viewBox="78 60 100 130">
        <Ellipse cx={128} cy={160} rx={36} ry={24} fill="#C98B55" stroke="#6B4423" strokeWidth={3} />
        <Circle cx={128} cy={118} r={30} fill="#C98B55" stroke="#6B4423" strokeWidth={3} />
        <Path d="M110 92 L100 66 M146 92 L156 66 M104 76 L94 72 M152 76 L162 72" stroke="#6B4423" strokeWidth={3} strokeLinecap="round" />
        <Ellipse cx={128} cy={130} rx={16} ry={11} fill="#F2DEC4" />
        <Circle cx={116} cy={112} r={4} fill="#2D3142" />
        <Circle cx={140} cy={112} r={4} fill="#2D3142" />
        <Path
          d={senang ? 'M118 132 Q128 144 138 132' : 'M120 134 Q128 141 136 134'}
          stroke="#6B4423"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={108} cy={124} r={4} fill="#F4A6A6" opacity={0.7} />
        <Circle cx={148} cy={124} r={4} fill="#F4A6A6" opacity={0.7} />
      </Svg>
    );
  }
  return (
    <View style={{ width: 100, height: 130, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: 6, width: 72, height: 48, borderRadius: 36, backgroundColor: '#F2DEC4', borderWidth: 3, borderColor: '#6B4423' }} />
      <Text style={{ fontSize: 60, lineHeight: 76, marginBottom: 26 }}>{emoji}</Text>
    </View>
  );
}

function GelembungPesanan({ pesanan, pesan, terima }: { pesanan: Pesanan; pesan: string; terima: boolean }) {
  const satuBaris = pesanan.baris.length === 1;
  return (
    <View
      style={{
        position: 'absolute',
        left: 168,
        right: 8,
        top: 12,
        backgroundColor: warna.putih,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 12,
        shadowColor: '#2D3142',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        gap: 6,
      }}
    >
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 15, color: warna.hijauTua }}>{pesanan.pembeli.nama}</Text>
      <Text style={{ fontFamily: huruf.anak, fontSize: satuBaris ? 17 : 15, lineHeight: satuBaris ? 22 : 20, color: warna.teks }}>
        {terima ? pesan : pesanan.kalimat}
      </Text>
      {terima ? null : (
        <>
          {satuBaris ? (
            <Text accessibilityElementsHidden style={{ fontSize: 20 }}>
              {pesanan.baris[0].emoji.repeat(Math.min(pesanan.baris[0].jumlah, 5))}
            </Text>
          ) : (
            <Text style={{ fontFamily: huruf.anak, fontSize: 14, lineHeight: 19, color: warna.teksKedua }}>
              {pesanan.baris.map((b) => `${b.emoji} ${b.jumlah} × ${formatAngka(b.hargaSatuan)}`).join('   ')}
            </Text>
          )}
          <View style={{ alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 8, backgroundColor: warna.oranyeMuda }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>
              {pesanan.tampilkanHarga ? formatRupiah(pesanan.harga) : 'Hitung sendiri, ya'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export function Warung({
  pesanan,
  pesan,
  terima,
  tinggi,
}: {
  pesanan: Pesanan;
  pesan: string;
  terima: boolean;
  tinggi: number;
}) {
  // pembeli baru masuk dari kanan; pembeli melompat kecil saat pesanan beres
  const masuk = useSharedValue(220);
  const lompat = useSharedValue(0);
  useEffect(() => {
    masuk.set(220);
    masuk.set(withSpring(0, gerak.pegas));
  }, [pesanan.id, masuk]);
  useEffect(() => {
    if (!terima) return;
    lompat.set(withSequence(withTiming(-18, { duration: 150 }), withSpring(0, { damping: 6, stiffness: 220 })));
  }, [terima, lompat]);
  const gayaPembeli = useAnimatedStyle(() => ({ transform: [{ translateX: masuk.value }, { translateY: lompat.value }] }));

  return (
    <View style={{ height: tinggi, backgroundColor: LATAR_WARUNG, overflow: 'hidden' }}>
      <LatarWarung />
      <Animated.View style={[{ position: 'absolute', left: 78, top: 60 }, gayaPembeli]}>
        <GambarPembeli id={pesanan.pembeli.id} emoji={pesanan.pembeli.emoji} senang={terima} />
      </Animated.View>
      <MejaWarung />
      <GelembungPesanan pesanan={pesanan} pesan={pesan} terima={terima} />
    </View>
  );
}
