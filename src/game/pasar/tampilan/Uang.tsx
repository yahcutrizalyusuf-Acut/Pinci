/**
 * Uang Pasar Gampong: bergaya sederhana, BUKAN tiruan Rupiah asli.
 * Koin bulat dan lembar persegi berwarna lembut dengan angka besar (seperti desain G03).
 * Tanpa gambar tokoh, tanpa lambang negara, tanpa tulisan bank.
 */
import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { gerak, huruf, warna } from '../../../desain/token';
import { formatAngka } from '../../bersama/jenis';
import type { NilaiUang } from '../logika';

interface GayaUang {
  koin: boolean;
  isi: string;
  tepi: string;
}

export const GAYA_UANG: Record<NilaiUang, GayaUang> = {
  500: { koin: true, isi: '#E9EDF2', tepi: '#9AA3B2' },
  1000: { koin: true, isi: '#FFE08A', tepi: '#D4A72C' },
  2000: { koin: false, isi: '#CDEFD9', tepi: '#5BAF7E' },
  5000: { koin: false, isi: '#E6DCF7', tepi: '#9A7FD1' },
  10000: { koin: false, isi: '#FFE1C7', tepi: '#E59A5B' },
  20000: { koin: false, isi: '#D6ECFA', tepi: '#6FAFD8' },
  50000: { koin: false, isi: '#FBDCE6', tepi: '#D98AA3' },
};

/** Gambar uang saja (tanpa sentuhan). `skala` 1 = ukuran tombol di layar. */
export function GambarUang({ nilai, skala = 1 }: { nilai: NilaiUang; skala?: number }) {
  const g = GAYA_UANG[nilai];
  const lebar = (g.koin ? 64 : 76) * skala;
  const tinggi = (g.koin ? 64 : 48) * skala;
  return (
    <View
      style={{
        width: lebar,
        height: tinggi,
        borderRadius: g.koin ? lebar / 2 : 8 * skala,
        backgroundColor: g.isi,
        borderWidth: Math.max(2, 3 * skala),
        borderColor: g.tepi,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {g.koin ? null : (
        // hiasan sederhana: dua bulatan kecil di pojok supaya terasa "lembar"
        <>
          <View style={{ position: 'absolute', left: 4 * skala, top: 4 * skala, width: 6 * skala, height: 6 * skala, borderRadius: 3 * skala, backgroundColor: g.tepi, opacity: 0.5 }} />
          <View style={{ position: 'absolute', right: 4 * skala, bottom: 4 * skala, width: 6 * skala, height: 6 * skala, borderRadius: 3 * skala, backgroundColor: g.tepi, opacity: 0.5 }} />
        </>
      )}
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17 * skala, color: warna.biruTinta }}>{formatAngka(nilai)}</Text>
    </View>
  );
}

/** Jarak seret ke atas (dp) yang dianggap sudah sampai nampan (magnet). */
const AMBANG_NAMPAN = 56;

/**
 * Tombol uang: ketuk (semua kelas) atau seret ke atas ke nampan (kelas 3–6, dengan magnet).
 * `kunciPantul` berubah (≠ 0) → uang memantul lembut (belum tepat).
 */
export function TombolUang({
  nilai,
  onMasuk,
  bolehSeret,
  kunciPantul,
  tinggi = 80,
}: {
  nilai: NilaiUang;
  onMasuk: (nilai: NilaiUang) => void;
  bolehSeret: boolean;
  kunciPantul: number;
  tinggi?: number;
}) {
  const tekan = useSharedValue(1);
  const naik = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const dekat = useSharedValue(0);

  useEffect(() => {
    if (kunciPantul === 0) return;
    // memantul seperti desain: naik 26 dp, turun, naik sedikit, diam (±400 ms)
    naik.set(withSequence(
      withTiming(-26, { duration: 120 }),
      withSpring(0, { damping: 6, stiffness: 260, mass: 0.6 }),
    ));
  }, [kunciPantul, naik]);

  const seret = useMemo(
    () =>
      Gesture.Pan()
        .enabled(bolehSeret)
        .minDistance(8)
        .onUpdate((e) => {
          'worklet';
          x.set(e.translationX);
          y.set(e.translationY);
          dekat.set(withTiming(e.translationY < -AMBANG_NAMPAN ? 1 : 0, { duration: 120 }));
        })
        .onEnd((e) => {
          'worklet';
          if (e.translationY < -AMBANG_NAMPAN) {
            // magnet: uang "tersedot" ke nampan, lalu tombol muncul lagi di tempatnya
            x.set(0);
            y.set(0);
            tekan.set(0.4);
            tekan.set(withSpring(1, gerak.pegas));
            scheduleOnRN(onMasuk, nilai);
          } else {
            x.set(withSpring(0, gerak.pegas));
            y.set(withSpring(0, gerak.pegas));
          }
          dekat.set(withTiming(0, { duration: 150 }));
        }),
    [bolehSeret, onMasuk, nilai, x, y, dekat, tekan],
  );

  const gayaGerak = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value + naik.value - dekat.value * 18 },
      { scale: tekan.value * (1 - dekat.value * 0.12) },
    ],
    zIndex: x.value !== 0 || y.value !== 0 ? 10 : 0,
  }));

  const tombol = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Uang ${formatAngka(nilai)}`}
      onPressIn={() => {
        tekan.set(withTiming(0.9, { duration: 80 }));
      }}
      onPressOut={() => {
        tekan.set(withSpring(1, gerak.pegas));
      }}
      onPress={() => onMasuk(nilai)}
      style={{ height: tinggi, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={gayaGerak}>
        <GambarUang nilai={nilai} />
      </Animated.View>
    </Pressable>
  );

  if (!bolehSeret) return <View style={{ flex: 1 }}>{tombol}</View>;
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={seret}>{tombol}</GestureDetector>
    </View>
  );
}
