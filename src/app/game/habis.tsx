/** G08 Waktu main selesai (babak yang berjalan sudah diselesaikan dulu). */
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { huruf } from '@/desain/token';
import { KALIMAT_WAKTU_HABIS } from '@/game/bersama/waktu';
import { Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function WaktuHabis() {
  const router = useRouter();
  return (
    <Layar
      latar="#F3C9A8"
      bawah={
        <View style={{ padding: 16 }}>
          <Tombol label="Kembali ke beranda" besar onPress={() => router.replace('/anak')} />
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <View style={{ width: 240, height: 240, borderRadius: 120, backgroundColor: '#2E3558', alignItems: 'center', justifyContent: 'center' }}>
          <Pinci ekspresi="menguap" ukuran={190} />
        </View>
        <Text style={{ fontFamily: huruf.judul, fontSize: 30, color: '#2D3142', textAlign: 'center' }}>Waktu main selesai</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: '#5B4636', textAlign: 'center' }}>{KALIMAT_WAKTU_HABIS}</Text>
      </View>
    </Layar>
  );
}
