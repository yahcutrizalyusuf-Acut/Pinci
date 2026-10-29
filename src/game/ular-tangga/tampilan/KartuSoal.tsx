/**
 * Kartu soal singkat tingkat Seru: 3 pilihan besar. Pilihan yang belum tepat memantul lembut lalu meredup
 * (tanpa merah, tanpa kata yang menghukum).
 */
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { bayangan, gerak, huruf, warna } from '../../../desain/token';
import type { SoalSingkat } from '../logika';

function Pilihan({
  nilai,
  dicoba,
  kunciPantul,
  memantul,
  onPilih,
}: {
  nilai: number;
  dicoba: boolean;
  kunciPantul: number;
  memantul: boolean;
  onPilih: (n: number) => void;
}) {
  const geser = useSharedValue(0);
  const skala = useSharedValue(1);
  useEffect(() => {
    if (!memantul || kunciPantul === 0) return;
    geser.value = withSequence(
      withTiming(-10, { duration: 70 }),
      withTiming(10, { duration: 90 }),
      withTiming(-6, { duration: 80 }),
      withSpring(0, gerak.pegas),
    );
    skala.value = withSequence(withTiming(0.92, { duration: 90 }), withSpring(1, gerak.pegas));
  }, [memantul, kunciPantul, geser, skala]);
  const gaya = useAnimatedStyle(() => ({ transform: [{ translateX: geser.value }, { scale: skala.value }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Jawaban ${nilai}`}
      accessibilityState={{ disabled: dicoba }}
      disabled={dicoba}
      onPress={() => onPilih(nilai)}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          {
            height: 72,
            borderRadius: 18,
            backgroundColor: dicoba ? warna.abuTerang : warna.putih,
            borderWidth: 3,
            borderColor: dicoba ? warna.abuGaris : '#BFE3F7',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: dicoba ? 0.45 : 1,
          },
          bayangan.ringan,
          gaya,
        ]}
      >
        <Text style={{ fontFamily: huruf.judul, fontSize: 30, color: warna.biruTinta }}>{nilai}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function KartuSoal({
  soal,
  dicoba,
  pantul,
  kunciPantul,
  ukuranSoal,
  onPilih,
}: {
  soal: SoalSingkat;
  dicoba: readonly number[];
  pantul: number | null;
  /** naik setiap kali ada pilihan yang memantul */
  kunciPantul: number;
  ukuranSoal: number;
  onPilih: (n: number) => void;
}) {
  return (
    <View style={[{ width: '100%', backgroundColor: warna.kremLembut, borderRadius: 20, padding: 14, gap: 12, borderWidth: 2, borderColor: warna.kremGaris }, bayangan.kartu]}>
      <Text style={{ fontFamily: huruf.anak, fontSize: Math.min(ukuranSoal, 36), color: warna.teks, textAlign: 'center' }}>{soal.teks}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {soal.pilihan.map((n) => (
          <Pilihan
            key={`${soal.id}-${n}`}
            nilai={n}
            dicoba={dicoba.includes(n)}
            memantul={pantul === n}
            kunciPantul={kunciPantul}
            onPilih={onPilih}
          />
        ))}
      </View>
    </View>
  );
}
