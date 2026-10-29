/** Penggeser sederhana (tanpa pustaka luar): ketuk atau geser di jalurnya. */
import { useRef, useState } from 'react';
import { View, type LayoutChangeEvent, type GestureResponderEvent } from 'react-native';

import { warna } from '../desain/token';

export function Geser({
  nilai,
  min,
  maks,
  langkah = 5,
  onUbah,
  label,
}: {
  nilai: number;
  min: number;
  maks: number;
  langkah?: number;
  onUbah: (n: number) => void;
  label: string;
}) {
  const [lebar, setLebar] = useState(1);
  const awalX = useRef(0);
  const hitung = (x: number) => {
    const f = Math.max(0, Math.min(1, x / lebar));
    return Math.round((min + f * (maks - min)) / langkah) * langkah;
  };
  const f = (nilai - min) / (maks - min);
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max: maks, now: nilai }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onUbah(Math.max(min, Math.min(maks, nilai + (e.nativeEvent.actionName === 'increment' ? langkah : -langkah))))}
      onLayout={(e: LayoutChangeEvent) => setLebar(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e: GestureResponderEvent) => {
        awalX.current = e.nativeEvent.locationX;
        onUbah(hitung(e.nativeEvent.locationX));
      }}
      onResponderMove={(e: GestureResponderEvent) => onUbah(hitung(e.nativeEvent.locationX))}
      style={{ height: 40, justifyContent: 'center' }}
    >
      <View style={{ height: 8, borderRadius: 4, backgroundColor: warna.abuGaris, borderWidth: 1, borderColor: '#D9DDE6' }}>
        <View style={{ width: `${f * 100}%`, height: '100%', borderRadius: 4, backgroundColor: warna.hijauTua }} />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: Math.max(0, f * lebar - 14), width: 28, height: 28, borderRadius: 14, backgroundColor: warna.hijauTua, borderWidth: 3, borderColor: warna.putih }}
      />
    </View>
  );
}
