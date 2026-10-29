/** Panel fase kembalian (anak memilih) dan fase terima (pesanan beres). */
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Tombol } from '../../../komponen/dasar';
import { gerak, huruf, warna } from '../../../desain/token';
import { formatRupiah } from '../../bersama/jenis';
import { pecahUang, SEMUA_UANG } from '../logika';
import { GambarUang } from './Uang';

function PilihanKembalian({
  nilai,
  redup,
  kunciPantul,
  onPilih,
}: {
  nilai: number;
  redup: boolean;
  kunciPantul: number;
  onPilih: (n: number) => void;
}) {
  const naik = useSharedValue(0);
  const tekan = useSharedValue(1);
  useEffect(() => {
    if (kunciPantul === 0) return;
    naik.set(withSequence(withTiming(-16, { duration: 110 }), withSpring(0, { damping: 6, stiffness: 240 })));
  }, [kunciPantul, naik]);
  const gaya = useAnimatedStyle(() => ({ transform: [{ translateY: naik.value }, { scale: tekan.value }] }));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Kembalian ${formatRupiah(nilai)}`}
      accessibilityState={{ disabled: redup }}
      disabled={redup}
      onPressIn={() => {
        tekan.set(withTiming(0.94, { duration: 80 }));
      }}
      onPressOut={() => {
        tekan.set(withSpring(1, gerak.pegas));
      }}
      onPress={() => onPilih(nilai)}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          {
            height: 72,
            borderRadius: 16,
            backgroundColor: warna.putih,
            borderWidth: 3,
            borderColor: redup ? warna.abuGaris : warna.oranye,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: redup ? 0.45 : 1,
          },
          gaya,
        ]}
      >
        <Text style={{ fontFamily: huruf.judul, fontSize: 20, color: warna.biruTinta }}>{formatRupiah(nilai)}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function PanelKembalian({
  pilihan,
  dicoba,
  pantulNilai,
  kunciPantul,
  pesan,
  onPilih,
}: {
  pilihan: readonly number[];
  dicoba: readonly number[];
  pantulNilai: number | null;
  kunciPantul: number;
  pesan: string;
  onPilih: (n: number) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 19, color: warna.teks, textAlign: 'center' }}>{pesan}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {pilihan.map((n) => (
          <PilihanKembalian
            key={n}
            nilai={n}
            redup={dicoba.includes(n)}
            kunciPantul={pantulNilai === n ? kunciPantul : 0}
            onPilih={onPilih}
          />
        ))}
      </View>
    </View>
  );
}

export function PanelTerima({
  kembalian,
  terakhir,
  onLanjut,
}: {
  kembalian: number;
  terakhir: boolean;
  onLanjut: () => void;
}) {
  const muncul = useSharedValue(0.6);
  useEffect(() => {
    muncul.set(withSpring(1, gerak.pegas));
  }, [muncul]);
  const gaya = useAnimatedStyle(() => ({ transform: [{ scale: muncul.value }], opacity: Math.min(1, muncul.value) }));
  const uangKembali = kembalian > 0 ? pecahUang(kembalian, SEMUA_UANG) : [];
  return (
    <View style={{ gap: 12 }}>
      <Animated.View
        style={[{ backgroundColor: warna.hijauMuda, borderRadius: 20, padding: 14, alignItems: 'center', gap: 8 }, gaya]}
      >
        <Text style={{ fontFamily: huruf.judul, fontSize: 24, color: warna.hijauTua }}>✓ Pesanan beres!</Text>
        {uangKembali.length > 0 ? (
          <>
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>Kembalian {formatRupiah(kembalian)}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {uangKembali.map((u, i) => (
                <GambarUang key={i} nilai={u} skala={0.6} />
              ))}
            </View>
          </>
        ) : null}
      </Animated.View>
      <Tombol label={terakhir ? 'Tutup warung' : 'Pembeli berikutnya'} ikon="kanan" besar onPress={onLanjut} />
    </View>
  );
}
