/** Dadu besar (desain G04): diketuk → berguling singkat (≤ 600 ms), lalu angka tampil. */
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { gerak, warna } from '../../../desain/token';
import { WAKTU } from './rencana';

const WAJAH: Record<number, readonly number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};
const SEL = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function Dadu({
  angka,
  kunciPutar,
  bisaDiketuk,
  onKetuk,
  ukuran = 112,
}: {
  angka: number;
  /** naik setiap kali dadu dilempar (oleh anak atau Pinci) */
  kunciPutar: number;
  bisaDiketuk: boolean;
  onKetuk: () => void;
  ukuran?: number;
}) {
  const putar = useSharedValue(0);
  const skala = useSharedValue(1);
  const redup = useSharedValue(1);

  useEffect(() => {
    if (kunciPutar === 0) return;
    putar.value = 0;
    putar.value = withTiming(1, { duration: WAKTU.putarDadu, easing: Easing.out(Easing.cubic) });
    skala.value = withSequence(withTiming(0.85, { duration: 120 }), withSpring(1, gerak.pegas));
    redup.value = withSequence(withTiming(0.15, { duration: 80 }), withTiming(0.15, { duration: WAKTU.putarDadu - 160 }), withTiming(1, { duration: 80 }));
  }, [kunciPutar, putar, skala, redup]);

  const gayaDadu = useAnimatedStyle(() => ({
    transform: [
      { translateY: -Math.sin(putar.value * Math.PI) * 18 },
      { rotate: `${putar.value * 360}deg` },
      { scale: skala.value },
    ],
  }));
  const gayaTitik = useAnimatedStyle(() => ({ opacity: redup.value }));

  const nyala = WAJAH[angka] ?? WAJAH[1];
  const titik = Math.round(ukuran * 0.16);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Lempar dadu, sekarang ${angka}`}
      accessibilityState={{ disabled: !bisaDiketuk }}
      disabled={!bisaDiketuk}
      onPress={onKetuk}
      testID="dadu"
    >
      <Animated.View
        style={[
          {
            width: ukuran,
            height: ukuran,
            borderWidth: 4,
            borderColor: warna.biruTinta,
            borderRadius: 24,
            backgroundColor: warna.putih,
            padding: ukuran * 0.11,
            flexDirection: 'row',
            flexWrap: 'wrap',
            shadowColor: warna.biruTinta,
            shadowOpacity: 1,
            shadowRadius: 0,
            shadowOffset: { width: 0, height: 5 },
            elevation: 4,
            opacity: bisaDiketuk ? 1 : 0.85,
          },
          gayaDadu,
        ]}
      >
        <Animated.View style={[{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }, gayaTitik]}>
          {SEL.map((i) => (
            <View key={i} style={{ width: '33.33%', height: '33.33%', alignItems: 'center', justifyContent: 'center' }}>
              {nyala.includes(i) ? <View style={{ width: titik, height: titik, borderRadius: titik / 2, backgroundColor: warna.biruTinta }} /> : null}
            </View>
          ))}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
