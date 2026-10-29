/** Papan PIN 4 angka (dipakai saat membuat PIN dan membuka mode orang tua). */
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../desain/token';
import { Ikon } from './Ikon';

export function TitikPin({ panjang, salah }: { panjang: number; salah?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 18, justifyContent: 'center' }} accessibilityLabel={`${panjang} dari 4 angka`}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: salah ? warna.koral : warna.hijauTua,
            backgroundColor: i < panjang ? (salah ? warna.koral : warna.hijauTua) : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

export function PapanPin({ onAngka, onHapus }: { onAngka: (a: string) => void; onHapus: () => void }) {
  const t = (a: string) => (
    <Pressable
      key={a}
      accessibilityRole="button"
      accessibilityLabel={a}
      onPress={() => onAngka(a)}
      style={({ pressed }) => ({
        flex: 1,
        height: 60,
        borderRadius: 14,
        backgroundColor: pressed ? warna.abuGaris : warna.putih,
        borderWidth: 1,
        borderColor: warna.abuGaris,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24, color: warna.teks }}>{a}</Text>
    </Pressable>
  );
  return (
    <View style={{ gap: 10 }}>
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ].map((b) => (
        <View key={b.join()} style={{ flexDirection: 'row', gap: 10 }}>
          {b.map(t)}
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }} />
        {t('0')}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hapus"
          onPress={onHapus}
          style={{ flex: 1, height: 60, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ikon nama="hapus" ukuran={26} />
        </Pressable>
      </View>
    </View>
  );
}
