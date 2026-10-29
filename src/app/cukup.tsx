/** A07b Cukup belajar hari ini (batas harian) — juga dipakai untuk jam tenang. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { huruf, warna } from '@/desain/token';
import { Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function CukupBelajar() {
  const router = useRouter();
  const { alasan } = useLocalSearchParams<{ alasan?: string }>();
  const malam = alasan === 'jam_tenang';
  return (
    <Layar
      latar={malam ? '#2E3558' : warna.kremLembut}
      bawah={
        <View style={{ padding: 16 }}>
          <Tombol label="Kembali ke beranda" besar varian={malam ? 'putih' : 'utama'} onPress={() => router.replace('/anak')} />
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Pinci ekspresi={malam ? 'menguap' : 'melambai'} penuh={!malam} ukuran={malam ? 190 : 200} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 30, textAlign: 'center', color: malam ? '#FFF3C4' : warna.teks }}>
          {malam ? 'Sudah malam.' : 'Cukup belajar hari ini.'}
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, lineHeight: 26, textAlign: 'center', color: malam ? '#E6E9F0' : warna.teksKedua }}>
          {malam ? 'Pinci mau tidur dulu.\nBesok kita belajar dan main lagi, ya!' : 'Kamu hebat sudah mencoba.\nBesok kita lanjut lagi, ya!'}
        </Text>
      </View>
    </Layar>
  );
}
