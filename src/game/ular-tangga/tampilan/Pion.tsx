/**
 * Pion anak (bulat biru + ⭐) dan pion Pinci (kepala kecil). Melompat petak demi petak,
 * lalu naik mengikuti sulur dengan lembut bila mendarat di pangkalnya.
 */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { KepalaLogo } from '../../../komponen/Pinci';
import type { GerakTerakhir, Pemain } from '../logika';
import { GESER_PION, kurvaSulur, pusatPetak, titikKurva, type KurvaSulur } from './geometri';
import { WAKTU } from './rencana';

const KURVA_KOSONG: KurvaSulur = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };

export function Pion({
  siapa,
  petak,
  posisiAwal,
  gerak,
}: {
  siapa: Pemain;
  /** lebar satu petak (dp) */
  petak: number;
  posisiAwal: number;
  /** gerak terakhir milik pion ini (null bila bukan) */
  gerak: GerakTerakhir | null;
}) {
  const geser = GESER_PION[siapa];
  const awal = pusatPetak(posisiAwal);
  const x = useSharedValue(awal.x);
  const y = useSharedValue(awal.y);
  const lompat = useSharedValue(0);
  const naik = useSharedValue(0);
  const kurva = useSharedValue<KurvaSulur>(KURVA_KOSONG);

  useEffect(() => {
    if (!gerak || gerak.siapa !== siapa) return;
    const petakDilewati: number[] = [];
    for (let n = gerak.dari + 1; n <= gerak.sampai; n++) petakDilewati.push(n);
    if (petakDilewati.length === 0) return;
    naik.value = 0;
    const lama = WAKTU.perPetak;
    const gayaJalan = { duration: lama, easing: Easing.out(Easing.quad) };
    const langkahX = petakDilewati.map((n) => withTiming(pusatPetak(n).x, gayaJalan));
    const langkahY = petakDilewati.map((n) => withTiming(pusatPetak(n).y, gayaJalan));
    const loncat = petakDilewati.flatMap(() => [
      withTiming(1, { duration: lama * 0.45, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: lama * 0.55, easing: Easing.out(Easing.back(2.2)) }),
    ]);
    lompat.value = withSequence(...loncat);
    if (gerak.naikSulur) {
      const atas = pusatPetak(gerak.ke);
      const tunda = WAKTU.jedaSulur + WAKTU.naikSulur;
      kurva.value = kurvaSulur(gerak.sampai, gerak.ke);
      naik.value = withDelay(
        petakDilewati.length * lama + WAKTU.jedaSulur,
        withTiming(1, { duration: WAKTU.naikSulur, easing: Easing.inOut(Easing.cubic) }),
      );
      x.value = withSequence(...langkahX, withDelay(tunda, withTiming(atas.x, { duration: 0 })));
      y.value = withSequence(...langkahY, withDelay(tunda, withTiming(atas.y, { duration: 0 })));
    } else {
      x.value = withSequence(...langkahX);
      y.value = withSequence(...langkahY);
    }
  }, [gerak, siapa, x, y, lompat, naik, kurva]);

  const ukuran = Math.round(petak * (siapa === 'anak' ? 0.6 : 0.56));
  const gaya = useAnimatedStyle(() => {
    const n = naik.value;
    const t = n > 0 && n < 1 ? titikKurva(kurva.value, n) : { x: x.value, y: y.value };
    return {
      transform: [
        { translateX: (t.x + geser.x) * petak - ukuran / 2 },
        { translateY: (t.y + geser.y) * petak - ukuran / 2 - lompat.value * petak * 0.35 },
        { scale: 1 + lompat.value * 0.15 + (n > 0 && n < 1 ? 0.12 : 0) },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: 0, top: 0, width: ukuran, height: ukuran, zIndex: siapa === 'anak' ? 3 : 2 }, gaya]}
    >
      {siapa === 'anak' ? (
        <View
          accessibilityLabel="Pion kamu"
          style={{
            width: ukuran,
            height: ukuran,
            borderRadius: ukuran / 2,
            backgroundColor: '#E6F0FF',
            borderWidth: 2,
            borderColor: '#3A86FF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: Math.round(ukuran * 0.5), lineHeight: Math.round(ukuran * 0.62) }}>⭐</Text>
        </View>
      ) : (
        <View accessibilityLabel="Pion Pinci">
          <KepalaLogo ukuran={ukuran} />
        </View>
      )}
    </Animated.View>
  );
}
