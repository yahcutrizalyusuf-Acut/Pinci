/** D6 Dengar Bacaan: pilih teks, anak membaca nyaring, orang tua menandai kata yang tersandung. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';

import { huruf, warna } from '@/desain/token';
import { paketTka } from '@/isi/tka/paket';

export default function PilihTeksDengar() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teksKedua }}>Pilih teks yang belum pernah dibaca anak supaya hasilnya menunjukkan kemampuan sebenarnya.</Text>
      {paketTka.teks.map((t) => (
        <Pressable key={t.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/baca/[id]', params: { id: t.id, mode: 'dampingi' } })} style={{ padding: 14, borderRadius: 16, backgroundColor: warna.putih }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>
            {t.id} · {t.judul}
          </Text>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
            {t.jumlahKata} kata · {t.jenis}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
