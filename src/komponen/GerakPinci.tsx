/**
 * Gerak Bersama (TPR, rancangan `12` E2): Pinci memperagakan gerakan kata kerja atau perintah pelan, ≤ 1,5 detik,
 * lalu anak menirukan. Tanpa kamera, tanpa rekaman.
 */
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { huruf, warna } from '../desain/token';
import type { Gerakan, JenisGerak } from '../isi/inggris/komik';
import { Pinci } from './Pinci';

/** Satu langkah gerak: geser vertikal (y), putar (derajat), dan skala. Total semua langkah ≤ 1,5 detik. */
type Langkah = { y?: number; r?: number; s?: number; ms: number };

export const POLA_GERAK: Record<JenisGerak, Langkah[]> = {
  lambai: [{ r: -12, ms: 250 }, { r: 12, ms: 250 }, { r: -12, ms: 250 }, { r: 0, ms: 250 }],
  tepuk: [{ s: 0.92, ms: 180 }, { s: 1.04, ms: 180 }, { s: 0.92, ms: 180 }, { s: 1, ms: 180 }],
  lompat: [{ y: -36, ms: 300 }, { y: 0, ms: 300 }, { y: -36, ms: 300 }, { y: 0, ms: 300 }],
  duduk: [{ y: 24, s: 0.94, ms: 600 }, { y: 0, s: 1, ms: 600 }],
  berdiri: [{ y: 18, ms: 300 }, { y: -12, ms: 450 }, { y: 0, ms: 300 }],
  tunjuk: [{ r: 10, ms: 400 }, { r: 10, ms: 400 }, { r: 0, ms: 300 }],
  sentuh: [{ s: 1.06, ms: 400 }, { s: 1, ms: 400 }],
  angguk: [{ y: 8, ms: 220 }, { y: 0, ms: 220 }, { y: 8, ms: 220 }, { y: 0, ms: 220 }],
  makan: [{ y: -6, s: 1.03, ms: 250 }, { y: 0, s: 1, ms: 250 }, { y: -6, s: 1.03, ms: 250 }, { y: 0, s: 1, ms: 250 }],
  minum: [{ r: -15, ms: 500 }, { r: 0, ms: 500 }],
  tidur: [{ r: 20, y: 10, ms: 700 }, { r: 0, y: 0, ms: 600 }],
  sikat: [{ r: -6, ms: 150 }, { r: 6, ms: 150 }, { r: -6, ms: 150 }, { r: 6, ms: 150 }, { r: 0, ms: 150 }],
  cuci: [{ s: 0.96, r: -5, ms: 200 }, { s: 1, r: 5, ms: 200 }, { s: 0.96, r: -5, ms: 200 }, { s: 1, r: 0, ms: 200 }],
  baca: [{ y: 6, ms: 500 }, { y: 0, ms: 500 }],
  tulis: [{ r: -4, ms: 200 }, { r: 4, ms: 200 }, { r: -4, ms: 200 }, { r: 0, ms: 200 }],
  lari: [{ y: -10, ms: 160 }, { y: 0, ms: 160 }, { y: -10, ms: 160 }, { y: 0, ms: 160 }, { y: -10, ms: 160 }, { y: 0, ms: 160 }],
  putar: [{ r: 180, ms: 600 }, { r: 360, ms: 600 }],
  buka: [{ s: 1.1, ms: 500 }, { s: 1, ms: 500 }],
};

/** Lama total satu gerakan (ms). */
export function lamaGerak(jenis: JenisGerak): number {
  return POLA_GERAK[jenis].reduce((a, l) => a + l.ms, 0);
}

export function GerakPinci({ gerakan, ulang, ukuran = 96 }: { gerakan: Gerakan; ulang: number; ukuran?: number }) {
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const s = useSharedValue(1);
  useEffect(() => {
    if (ulang === 0) return;
    const pola = POLA_GERAK[gerakan.jenis];
    y.set(withSequence(...pola.map((l) => withTiming(l.y ?? 0, { duration: l.ms }))));
    r.set(withSequence(...pola.map((l) => withTiming(l.r ?? 0, { duration: l.ms }))));
    s.set(withSequence(...pola.map((l) => withTiming(l.s ?? 1, { duration: l.ms }))));
  }, [ulang, gerakan.jenis, y, r, s]);
  const gaya = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }, { scale: s.value }] }));
  return (
    <Animated.View style={gaya}>
      <Pinci ukuran={ukuran} tenang />
    </Animated.View>
  );
}

/** Tombol kecil "Tirukan gerakan" di Kenal Kata. */
export function TombolGerak({ gerakan, onPress }: { gerakan: Gerakan; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Tirukan gerakan: ${gerakan.petunjuk}`} onPress={onPress} style={{ paddingHorizontal: 10, height: 36, borderRadius: 18, backgroundColor: warna.oranyeMuda, justifyContent: 'center', alignSelf: 'flex-start' }}>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>🙆</Text>
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.teks }}>Tirukan</Text>
      </View>
    </Pressable>
  );
}
