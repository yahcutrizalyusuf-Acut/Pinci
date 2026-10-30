/**
 * Tombol pilihan angka untuk game berjenjang. Pilihan yang belum tepat bergoyang lalu kembali
 * (tanpa warna merah, tanpa kata "salah").
 */
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../../../desain/token';
import { formatAngka } from '../jenis';

interface Props {
  pilihan: readonly number[];
  /** pilihan yang baru memantul */
  pantul: number | null;
  /** berubah setiap kali ada pantulan baru (memicu goyang) */
  kunciPantul: number;
  onPilih: (n: number) => void;
  nonaktif?: boolean;
  /** hiasan kecil di depan angka, mis. 💧 */
  hiasan?: string;
  latar?: string;
  garis?: string;
}

function TombolSatu({ n, goyang, onPilih, nonaktif, hiasan, latar, garis }: { n: number; goyang: number; onPilih: (n: number) => void; nonaktif?: boolean; hiasan?: string; latar: string; garis: string }) {
  const [geser] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (goyang === 0) return;
    Animated.sequence([
      Animated.timing(geser, { toValue: 1, duration: 70, useNativeDriver: true }),
      Animated.timing(geser, { toValue: -1, duration: 70, useNativeDriver: true }),
      Animated.timing(geser, { toValue: 0.6, duration: 70, useNativeDriver: true }),
      Animated.timing(geser, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  }, [goyang, geser]);
  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: geser.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Pilih ${n}`}
        disabled={nonaktif}
        onPress={() => onPilih(n)}
        style={({ pressed }) => ({
          minHeight: 72,
          borderRadius: 20,
          backgroundColor: latar,
          borderWidth: 3,
          borderColor: garis,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        {hiasan ? <Text style={{ fontSize: 22 }}>{hiasan}</Text> : null}
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 30, color: warna.teks }}>{formatAngka(n)}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function PilihanAngka({ pilihan, pantul, kunciPantul, onPilih, nonaktif, hiasan, latar = warna.putih, garis = warna.hijauDaun }: Props) {
  // Dua baris bila pilihan 4, supaya tombol tetap besar untuk jari anak.
  const baris = pilihan.length === 4 ? [pilihan.slice(0, 2), pilihan.slice(2)] : [pilihan];
  return (
    <View style={{ gap: 10 }}>
      {baris.map((isi, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          {isi.map((n) => (
            <TombolSatu key={n} n={n} goyang={n === pantul ? kunciPantul : 0} onPilih={onPilih} nonaktif={nonaktif} hiasan={hiasan} latar={latar} garis={garis} />
          ))}
        </View>
      ))}
    </View>
  );
}
