/** Pesta kecil ≤ 1,5 detik: serpihan warna jatuh dari atas lalu hilang. */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

const WARNA = ['#3BB273', '#FF9F1C', '#3A86FF', '#E85D5D', '#8E6CCF', '#FFC93C'];

function Serpih({ i, jalan }: { i: number; jalan: SharedValue<number> }) {
  const kiri = (i * 37) % 100;
  const geser = ((i * 53) % 40) - 20;
  const gaya = useAnimatedStyle(() => ({
    opacity: jalan.value < 0.85 ? 1 : (1 - jalan.value) / 0.15,
    transform: [{ translateY: jalan.value * (420 + (i % 5) * 40) - 40 }, { translateX: jalan.value * geser }, { rotate: `${jalan.value * (180 + i * 30)}deg` }],
  }));
  return <Animated.View style={[{ position: 'absolute', top: 0, left: `${kiri}%`, width: 10, height: 14, borderRadius: 3, backgroundColor: WARNA[i % WARNA.length] }, gaya]} />;
}

export function PestaKecil({ tampil }: { tampil: boolean }) {
  const jalan = useSharedValue(0);
  useEffect(() => {
    if (tampil) {
      jalan.value = 0;
      jalan.value = withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) });
    }
  }, [tampil, jalan]);
  if (!tampil) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 28 }, (_, i) => (
        <Serpih key={i} i={i} jalan={jalan} />
      ))}
    </View>
  );
}
