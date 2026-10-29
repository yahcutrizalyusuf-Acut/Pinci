/** Kejutan lucu acak: rangkong lewat, ikan melompat, Pinci bersin. Muncul sebentar lalu pergi. */
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Pinci } from '../../../komponen/Pinci';
import type { Kejutan } from '../kejutan';

export function KejutanLucu({ kejutan, kunci }: { kejutan: Kejutan | null; kunci: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!kejutan) return;
    t.value = 0;
    t.value = withTiming(1, { duration: kejutan === 'rangkong_lewat' ? 2200 : 1400, easing: Easing.inOut(Easing.quad) });
  }, [kejutan, kunci, t]);
  const terbang = useAnimatedStyle(() => ({ transform: [{ translateX: -80 + t.value * 520 }, { translateY: Math.sin(t.value * 12) * 8 }] }));
  const lompat = useAnimatedStyle(() => ({ transform: [{ translateY: -Math.sin(t.value * Math.PI) * 120 }, { rotate: `${-30 + t.value * 60}deg` }], opacity: t.value < 0.98 ? 1 : 0 }));
  const bersin = useAnimatedStyle(() => ({ opacity: t.value < 0.9 ? 1 : 0, transform: [{ scale: 1 + Math.sin(t.value * Math.PI) * 0.1 }] }));
  if (!kejutan) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {kejutan === 'rangkong_lewat' ? (
        <Animated.View style={[{ position: 'absolute', top: 90 }, terbang]}>
          <Text style={{ fontSize: 40 }} accessibilityLabel="Burung rangkong lewat">
            🐦
          </Text>
        </Animated.View>
      ) : kejutan === 'ikan_melompat' ? (
        <Animated.View style={[{ position: 'absolute', bottom: 120, left: '42%' }, lompat]}>
          <Text style={{ fontSize: 40 }} accessibilityLabel="Ikan melompat">
            🐟
          </Text>
        </Animated.View>
      ) : (
        <Animated.View style={[{ position: 'absolute', bottom: 100, right: 16 }, bersin]}>
          <Pinci ekspresi="bersin" ukuran={72} tenang />
          <Text style={{ position: 'absolute', top: -6, left: -24, fontSize: 18, fontWeight: '800', color: '#4EA8DE' }}>Hatchi!</Text>
        </Animated.View>
      )}
    </View>
  );
}
