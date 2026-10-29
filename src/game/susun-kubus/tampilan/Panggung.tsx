/**
 * Panggung Susun Kubus: papan kayu dengan petak, tumpukan kubus 3 sisi, kubus yang jatuh dengan pegas,
 * kubus yang memantul kembali, dan garis putus-putus untuk bagian yang belum cocok.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { G, Polygon, Rect } from 'react-native-svg';

import type { BelumCocok, KartuTarget, Petak } from '../logika';
import { keTeksTitik, petakDiTitik, ubinPetak, urutanGambar, type Geometri } from './geometri';
import { GambarKubus, KAYU, KubusPerlu } from './Kubus';

export interface PenandaKubus {
  b: number;
  k: number;
  z: number;
  kunci: number;
}

interface Props {
  g: Geometri | null;
  petak: Petak;
  target: KartuTarget;
  belumCocok: BelumCocok;
  batas: readonly (readonly number[])[];
  jatuh: PenandaKubus | null;
  pantul: PenandaKubus | null;
  bisaDiketuk: boolean;
  onKetuk: (b: number, k: number) => void;
  onLayout: (e: LayoutChangeEvent) => void;
}

interface Sel {
  b: number;
  k: number;
  z: number;
  urut: number;
}

function daftarKubus(g: Geometri, petak: Petak): Sel[] {
  const hasil: Sel[] = [];
  petak.forEach((barisP, b) =>
    barisP.forEach((t, k) => {
      for (let z = 0; z < t; z++) hasil.push({ b, k, z, urut: urutanGambar(g, b, k, z) });
    }),
  );
  return hasil.sort((a, c) => a.urut - c.urut);
}

function dalamPetak(p: PenandaKubus | null, petak: Petak): p is PenandaKubus {
  return p !== null && p.b < petak.length && p.k < (petak[0]?.length ?? 0);
}

function Papan({ g, belumCocok }: { g: Geometri; belumCocok: BelumCocok }) {
  const { ox, oy, s, dx, dy, tebal, baris, kolom } = g;
  const kanan = ox + kolom * s;
  return (
    <G>
      <Rect x={ox} y={oy} width={kolom * s} height={tebal} rx={3} fill={KAYU.papan} stroke={KAYU.papanGelap} strokeWidth={2} />
      <Polygon
        points={keTeksTitik([
          [kanan, oy],
          [kanan + baris * dx, oy - baris * dy],
          [kanan + baris * dx, oy - baris * dy + tebal],
          [kanan, oy + tebal],
        ])}
        fill={KAYU.papanGelap}
        stroke={KAYU.papanGelap}
        strokeWidth={2}
      />
      {Array.from({ length: baris }, (_, b) =>
        Array.from({ length: kolom }, (_, k) => {
          const perlu = belumCocok.petakAtas.some(([pb, pk]) => pb === b && pk === k);
          return (
            <Polygon
              key={`${b}-${k}`}
              points={keTeksTitik(ubinPetak(g, b, k))}
              fill={perlu ? '#FFF8EC' : KAYU.ubin}
              stroke={perlu ? KAYU.putus : KAYU.ubinGaris}
              strokeWidth={perlu ? 2.5 : 1.5}
              strokeDasharray={perlu ? `${(s * 0.12).toFixed(1)} ${(s * 0.09).toFixed(1)}` : undefined}
              strokeLinejoin="round"
            />
          );
        }),
      )}
    </G>
  );
}

interface PropsTanda {
  g: Geometri;
  petak: Petak;
  target: KartuTarget;
  belumCocok: BelumCocok;
  /** batas tinggi tiap petak (dari logika `batasTinggi`) */
  batas: readonly (readonly number[])[];
}

/** Kubus bayangan bergaris putus-putus: tinggi yang masih kurang menurut kartu depan dan samping. */
function TandaBelumCocok({ g, petak, target, belumCocok, batas }: PropsTanda) {
  const tanda: { kunci: string; b: number; k: number; z: number; arah: 'depan' | 'kanan' }[] = [];
  for (const k of belumCocok.kolomDepan) {
    const ingin = target.depan[k] ?? 0;
    const sekarang = Math.max(0, ...petak.map((barisP) => barisP[k] ?? 0));
    // Baris paling depan yang boleh setinggi itu (tidak pernah menunjuk petak yang kosong di kartu atas).
    let b = g.baris - 1;
    while (b > 0 && (batas[b]?.[k] ?? 0) < ingin) b--;
    for (let z = sekarang; z < ingin; z++) tanda.push({ kunci: `d${k}-${z}`, b, k, z, arah: 'depan' });
  }
  if (target.samping) {
    for (const b of belumCocok.barisSamping) {
      const ingin = target.samping[g.baris - 1 - b] ?? 0;
      const sekarang = Math.max(0, ...(petak[b] ?? []));
      let k = g.kolom - 1;
      while (k > 0 && (batas[b]?.[k] ?? 0) < ingin) k--;
      for (let z = sekarang; z < ingin; z++) tanda.push({ kunci: `s${b}-${z}`, b, k, z, arah: 'kanan' });
    }
  }
  return (
    <G>
      {tanda.map((t) => (
        <KubusPerlu key={t.kunci} g={g} b={t.b} k={t.k} z={t.z} arah={t.arah} />
      ))}
    </G>
  );
}

export function Panggung({ g, petak, target, belumCocok, batas, jatuh, pantul, bisaDiketuk, onKetuk, onLayout }: Props) {
  // 0 = sudah mendarat, 1 = di atas
  const jatuhT = useSharedValue(0);
  // 0 → 1 turun, 1 → 2 memantul naik dan menghilang
  const pantulT = useSharedValue(2);
  const kunciJatuh = jatuh?.kunci ?? 0;
  const kunciPantul = pantul?.kunci ?? 0;

  useEffect(() => {
    if (kunciJatuh === 0) return;
    jatuhT.value = 1;
    jatuhT.value = withTiming(0, { duration: 320, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  }, [kunciJatuh, jatuhT]);

  useEffect(() => {
    if (kunciPantul === 0) return;
    pantulT.value = 0;
    pantulT.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(2, { duration: 250, easing: Easing.out(Easing.cubic) }),
    );
  }, [kunciPantul, pantulT]);

  const s = g?.s ?? 0;
  const gayaJatuh = useAnimatedStyle(() => ({
    opacity: 1 - jatuhT.value * 0.5,
    transform: [{ translateY: -jatuhT.value * s * 1.6 }],
  }));
  const gayaPantul = useAnimatedStyle(() => {
    const t = pantulT.value;
    return {
      opacity: t <= 1 ? 0.95 : Math.max(0, 2 - t),
      transform: [{ translateY: t <= 1 ? -(1 - t) * s * 0.9 : -(t - 1) * s * 1.1 }],
    };
  });

  const total = petak.reduce((n, barisP) => n + barisP.reduce((m, x) => m + x, 0), 0);
  const tekan = (e: GestureResponderEvent) => {
    if (!g || !bisaDiketuk) return;
    const sel = petakDiTitik(g, petak, [e.nativeEvent.locationX, e.nativeEvent.locationY]);
    if (sel) onKetuk(sel[0], sel[1]);
  };

  let isi = null;
  if (g) {
    const semua = daftarKubus(g, petak);
    const adaJatuh = dalamPetak(jatuh, petak) && (petak[jatuh.b]?.[jatuh.k] ?? 0) > jatuh.z;
    const urutJatuh = adaJatuh ? urutanGambar(g, jatuh.b, jatuh.k, jatuh.z) : Infinity;
    const belakang = semua.filter((c) => c.urut !== urutJatuh);
    const depan = semua.filter((c) => c.urut > urutJatuh);
    const adaPantul = dalamPetak(pantul, petak);
    isi = (
      <>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <Papan g={g} belumCocok={belumCocok} />
            {belakang.map((c) => (
              <GambarKubus key={c.urut} g={g} b={c.b} k={c.k} z={c.z} />
            ))}
          </Svg>
        </View>
        {adaJatuh ? (
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, gayaJatuh]}>
            <Svg width="100%" height="100%">
              <GambarKubus g={g} b={jatuh.b} k={jatuh.k} z={jatuh.z} />
            </Svg>
          </Animated.View>
        ) : null}
        {depan.length > 0 ? (
          // Kubus di depan kubus yang jatuh digambar ulang di atasnya supaya urutan tetap benar.
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%">
              {depan.map((c) => (
                <GambarKubus key={c.urut} g={g} b={c.b} k={c.k} z={c.z} />
              ))}
            </Svg>
          </View>
        ) : null}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <TandaBelumCocok g={g} petak={petak} target={target} belumCocok={belumCocok} batas={batas} />
          </Svg>
        </View>
        {adaPantul ? (
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, gayaPantul]}>
            <Svg width="100%" height="100%">
              <GambarKubus g={g} b={pantul.b} k={pantul.k} z={pantul.z} />
            </Svg>
          </Animated.View>
        ) : null}
      </>
    );
  }

  return (
    <Pressable
      testID="panggung-kubus"
      accessibilityRole="button"
      accessibilityLabel={`Petak kayu, ada ${total} kubus`}
      accessibilityHint="Ketuk petak untuk menaruh kubus"
      onLayout={onLayout}
      onPress={tekan}
      style={{ flex: 1 }}
    >
      {isi}
    </Pressable>
  );
}
