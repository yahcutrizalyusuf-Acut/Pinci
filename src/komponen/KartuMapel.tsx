/** Kartu jalur belajar besar di beranda (A03). */
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../desain/token';
import { Ikon, type NamaIkon } from './Ikon';

export function KartuMapel({
  judul,
  sub,
  ikon,
  utama,
  muda,
  teks,
  onPress,
  lencana,
  selesai,
}: {
  judul: string;
  sub: string;
  ikon: NamaIkon;
  utama: string;
  muda: string;
  teks: string;
  onPress: () => void;
  lencana?: string;
  selesai?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${judul}. ${sub}`}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 96,
        borderRadius: 24,
        backgroundColor: muda,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: utama, alignItems: 'center', justifyContent: 'center' }}>
        <Ikon nama={ikon} ukuran={32} warna="#FFFFFF" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        {lencana ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: utama, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 11, color: '#FFFFFF' }}>{lencana}</Text>
          </View>
        ) : null}
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 21, lineHeight: 25, color: warna.teks }}>{judul}</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: teks }}>{sub}</Text>
      </View>
      {selesai ? (
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: warna.hijauDaun, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Sudah hari ini">
          <Ikon nama="centang" ukuran={18} />
        </View>
      ) : (
        <Ikon nama="kanan" ukuran={24} />
      )}
    </Pressable>
  );
}
