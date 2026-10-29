/**
 * Nampan uang: total yang naik sambil dihitung, uang yang baru masuk terbang dari bawah,
 * dan nampan memantul lembut bila uangnya belum cukup (tanpa warna merah).
 */
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { gerak, huruf, warna } from '../../../desain/token';
import { formatRupiah } from '../../bersama/jenis';
import type { NilaiUang } from '../logika';
import { GambarUang } from './Uang';

const LAMA_HITUNG = 320;

/** Angka yang berjalan pelan ke nilai baru (±300 ms). */
function useAngkaBerjalan(tujuan: number): number {
  const [tampil, setTampil] = useState(tujuan);
  const kini = useRef(tujuan);
  useEffect(() => {
    const awal = kini.current;
    if (awal === tujuan) return;
    let mulai: number | null = null;
    let id = 0;
    const jalan = (t: number) => {
      if (mulai === null) mulai = t;
      const p = Math.min(1, (t - mulai) / LAMA_HITUNG);
      const halus = 1 - (1 - p) * (1 - p);
      // dibulatkan ke 100 supaya angka tetap rapi saat berjalan
      const n = p >= 1 ? tujuan : Math.round((awal + (tujuan - awal) * halus) / 100) * 100;
      kini.current = n;
      setTampil(n);
      if (p < 1) id = requestAnimationFrame(jalan);
    };
    id = requestAnimationFrame(jalan);
    return () => {
      cancelAnimationFrame(id);
      kini.current = tujuan;
      setTampil(tujuan);
    };
  }, [tujuan]);
  return tampil;
}

/** Satu kelompok uang yang sama di nampan; meletup kecil setiap jumlahnya bertambah. */
function KelompokUang({ nilai, banyak }: { nilai: NilaiUang; banyak: number }) {
  const s = useSharedValue(0.4);
  useEffect(() => {
    s.set(0.75);
    s.set(withSpring(1, gerak.pegas));
  }, [banyak, s]);
  const gaya = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 2 }, gaya]}>
      <GambarUang nilai={nilai} skala={0.62} />
      {banyak > 1 ? (
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 16, color: '#6E5A3A' }}>×{banyak}</Text>
      ) : null}
    </Animated.View>
  );
}

/** Uang yang baru masuk: terbang dari arah tumpukan uang (bawah) ke nampan, lalu menyatu. */
function UangTerbang({ nilai }: { nilai: NilaiUang }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withTiming(1, { duration: 300 }));
  }, [t]);
  const gaya = useAnimatedStyle(() => ({
    opacity: t.value < 0.85 ? 1 : (1 - t.value) / 0.15,
    transform: [{ translateY: (1 - t.value) * 150 }, { scale: 1 - t.value * 0.38 }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', right: 16, top: 40 }, gaya]}>
      <GambarUang nilai={nilai} />
    </Animated.View>
  );
}

export function Nampan({
  nampan,
  total,
  harga,
  tampilkanHarga,
  kunciPantul,
  uangMasuk,
}: {
  /** uang yang baru diletakkan (kunci naik setiap kali) untuk gerak terbang */
  uangMasuk: { nilai: NilaiUang; kunci: number } | null;
  nampan: readonly NilaiUang[];
  total: number;
  harga: number;
  tampilkanHarga: boolean;
  kunciPantul: number;
}) {
  const angka = useAngkaBerjalan(total);
  const naik = useSharedValue(0);
  const geser = useSharedValue(0);

  useEffect(() => {
    if (kunciPantul === 0) return;
    naik.set(withSequence(withTiming(-14, { duration: 110 }), withSpring(0, { damping: 7, stiffness: 240 })));
    geser.set(withSequence(
      withTiming(-6, { duration: 70 }),
      withTiming(6, { duration: 90 }),
      withSpring(0, { damping: 8, stiffness: 260 }),
    ));
  }, [kunciPantul, naik, geser]);

  const gaya = useAnimatedStyle(() => ({ transform: [{ translateY: naik.value }, { translateX: geser.value }] }));

  // kelompokkan uang yang sama supaya nampan tetap rapi walau isinya banyak
  const kelompok: { nilai: NilaiUang; banyak: number }[] = [];
  for (const n of nampan) {
    const ada = kelompok.find((k) => k.nilai === n);
    if (ada) ada.banyak += 1;
    else kelompok.push({ nilai: n, banyak: 1 });
  }

  return (
    <Animated.View
      accessibilityLabel={`Uang di nampan ${formatRupiah(total)}`}
      style={[{ backgroundColor: '#EAD9B6', borderRadius: 20, padding: 12, gap: 8 }, gaya]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: '#6E5A3A' }}>Uang di nampan</Text>
        <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.biruTinta }}>
          {formatRupiah(angka)}
          <Text style={{ fontFamily: huruf.judulSedang, fontSize: 16, color: '#6E5A3A' }}>
            {tampilkanHarga ? ` / ${formatRupiah(harga)}` : ' / ?'}
          </Text>
        </Text>
      </View>
      <View style={{ minHeight: 44, flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {kelompok.length === 0 ? (
          <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: '#8A7A5A' }}>Ketuk uang di bawah</Text>
        ) : (
          kelompok.map((k) => <KelompokUang key={k.nilai} nilai={k.nilai} banyak={k.banyak} />)
        )}
      </View>
      {uangMasuk !== null ? <UangTerbang key={uangMasuk.kunci} nilai={uangMasuk.nilai} /> : null}
    </Animated.View>
  );
}
