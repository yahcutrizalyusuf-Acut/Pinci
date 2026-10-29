/** TKA bersama: pilih topik; soal tampil dengan kunci bertahap untuk orang tua. Tidak dihitung ke kesiapan. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';

import { huruf, warna, warnaMapel } from '@/desain/token';
import { paketTka } from '@/isi/tka/paket';

export default function PilihTopikDampingi() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {paketTka.topik
        .filter((t) => !t.simulasi)
        .map((t) => (
          <Pressable key={t.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/tka/latihan', params: { topik: t.id, mode: 'dampingi' } })} style={{ padding: 14, borderRadius: 16, backgroundColor: warna.putih }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warnaMapel[t.mapel].teks }}>{t.id}</Text>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{t.judul}</Text>
          </Pressable>
        ))}
    </ScrollView>
  );
}
