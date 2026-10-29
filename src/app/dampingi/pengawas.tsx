/** D7 Pengawas simulasi: orang tua memulai simulasi dan mengawasi tanpa membantu. Simulasi berjalan di luar batas 15 menit diam. */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { huruf, warna } from '@/desain/token';
import { paketTka } from '@/isi/tka/paket';
import { Tombol } from '@/komponen/dasar';

export default function PengawasSimulasi() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ backgroundColor: warna.putih, borderRadius: 18, padding: 16, gap: 6 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Peran pengawas</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>• Pastikan suasana tenang, televisi mati.</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>• Jangan membantu menjawab. Simulasi untuk mengetahui topik yang perlu diulang.</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>• S4 dan S5 tanpa jeda, seperti ujian sebenarnya (75 menit).</Text>
      </View>
      {paketTka.simulasi.map((s) => (
        <Tombol key={s.id} label={`Mulai ${s.id} · ${s.mapel === 'mat' ? 'Matematika' : 'Bahasa Indonesia'}`} ortu varian="putih" onPress={() => router.replace({ pathname: '/tka/simulasi', params: { id: s.id } })} />
      ))}
    </ScrollView>
  );
}
