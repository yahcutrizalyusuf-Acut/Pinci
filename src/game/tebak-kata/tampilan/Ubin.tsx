/** Ubin pilihan (memantul lembut bila belum tepat), kotak kata, dan ubin yang terbang ke kotak. */
import { useEffect } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { huruf, warna } from '../../../desain/token';

export interface Kotak {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BATAS_UBIN = '#EDE3CF';
const GARIS_KOSONG = '#C9B48F';

export function UbinPilihan({
  teks,
  lebar,
  tinggi,
  ukuranHuruf,
  sorot,
  pantulKunci,
  onPress,
  onLayout,
}: {
  teks: string;
  lebar: `${number}%`;
  tinggi: number;
  ukuranHuruf: number;
  sorot: boolean;
  /** berubah setiap kali ubin ini belum tepat; 0 = diam */
  pantulKunci: number;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const y = useSharedValue(0);
  useEffect(() => {
    if (pantulKunci === 0) return;
    // Melompat sedikit lalu kembali lembut ke tempatnya (≈ 400 ms).
    y.value = withSequence(withTiming(-26, { duration: 120 }), withSpring(0, { duration: 300, dampingRatio: 0.45 }));
  }, [pantulKunci, y]);
  const gerak = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View onLayout={onLayout} style={[{ width: lebar }, gerak]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ubin ${teks}`}
        onPress={onPress}
        style={({ pressed }) => ({
          height: tinggi,
          borderRadius: 22,
          borderWidth: 3,
          borderBottomWidth: 7,
          borderColor: sorot ? warna.hijauDaun : BATAS_UBIN,
          backgroundColor: sorot ? warna.hijauMuda : warna.putih,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
          transform: [{ scale: pressed ? 0.93 : 1 }],
        })}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: huruf.anakTebal, fontSize: ukuranHuruf, color: warna.teks }}>
          {teks}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function KotakKata({
  teks,
  ukuranHuruf,
  lebarMaks,
  onLayout,
}: {
  teks: string | null;
  ukuranHuruf: number;
  lebarMaks?: number;
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const s = useSharedValue(teks ? 1 : 0);
  useEffect(() => {
    if (!teks) {
      s.value = 0;
      return;
    }
    // Muncul saat ubin yang terbang mendarat.
    s.value = withDelay(200, withSpring(1, { duration: 300, dampingRatio: 0.6 }));
  }, [teks, s]);
  const masuk = useAnimatedStyle(() => ({ opacity: s.value > 0.05 ? 1 : 0, transform: [{ scale: 0.4 + s.value * 0.6 }] }));
  return (
    <View
      onLayout={onLayout}
      style={{
        flex: 1,
        maxWidth: lebarMaks,
        height: 80,
        borderRadius: 18,
        borderWidth: 3,
        borderStyle: teks ? 'solid' : 'dashed',
        borderColor: teks ? warna.hijauSegar : GARIS_KOSONG,
        backgroundColor: teks ? warna.hijauMuda : warna.putih,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
      }}
    >
      {teks ? (
        <Animated.View style={masuk}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: huruf.anakTebal, fontSize: ukuranHuruf, color: warna.teks }}>
            {teks}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Salinan ubin yang terbang dari tempatnya ke kotak kata dengan pegas (≈ 300 ms). */
export function UbinTerbang({ teks, dari, ke, ukuranHuruf }: { teks: string; dari: Kotak; ke: Kotak; ukuranHuruf: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withSpring(1, { duration: 300, dampingRatio: 0.8 });
  }, [p]);
  const gaya = useAnimatedStyle(() => ({
    left: dari.x + (ke.x - dari.x) * p.value,
    top: dari.y + (ke.y - dari.y) * p.value - Math.sin(Math.min(p.value, 1) * Math.PI) * 30,
    width: dari.w + (ke.w - dari.w) * p.value,
    height: dari.h + (ke.h - dari.h) * p.value,
    opacity: p.value > 0.92 ? 0 : 1,
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          borderRadius: 20,
          borderWidth: 3,
          borderColor: warna.hijauSegar,
          backgroundColor: warna.putih,
          alignItems: 'center',
          justifyContent: 'center',
        },
        gaya,
      ]}
    >
      <Text numberOfLines={1} style={{ fontFamily: huruf.anakTebal, fontSize: ukuranHuruf, color: warna.teks }}>
        {teks}
      </Text>
    </Animated.View>
  );
}
