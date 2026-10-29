/** A01 Selamat datang. */
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { modeData } from '@/data/sinkron';
import { Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';
import { huruf, warna } from '@/desain/token';

function Pemandangan() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 360 400" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute' }}>
      <Circle cx={290} cy={80} r={34} fill="#FFD27A" />
      <Path d="M0 300 Q90 230 180 280 T360 260 V400 H0 Z" fill="#CDEBD8" />
      <Path d="M0 340 Q120 290 220 330 T360 320 V400 H0 Z" fill="#9FD8B4" />
      <Rect x={34} y={200} width={12} height={90} rx={6} fill="#8A5A33" />
      <Circle cx={40} cy={190} r={34} fill="#3BB273" />
      <Circle cx={18} cy={214} r={22} fill="#2E9E5B" />
      <Rect x={312} y={216} width={10} height={76} rx={5} fill="#8A5A33" />
      <Circle cx={317} cy={206} r={28} fill="#3BB273" />
      <Circle cx={70} cy={330} r={6} fill="#FF9F1C" />
      <Circle cx={300} cy={346} r={6} fill="#E85D5D" />
      <Circle cx={250} cy={330} r={5} fill="#FFFFFF" />
    </Svg>
  );
}

export default function SelamatDatang() {
  const router = useRouter();
  return (
    <Layar tanpaPadding>
      <View style={{ height: 400, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Pemandangan />
        <Pinci ekspresi="melambai" penuh ukuran={190} style={{ marginBottom: 60 }} />
      </View>
      <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 16 }}>
        <Text style={{ fontFamily: huruf.judul, fontSize: 40 }}>
          <Text style={{ color: warna.hijauTua }}>Pintar</Text> <Text style={{ color: '#E08600' }}>Main</Text>
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua, textAlign: 'center' }}>
          Halo! Aku Pinci. Pintar itu seru!
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ gap: 12, paddingHorizontal: 16, paddingBottom: 24 }}>
        <Tombol label="Ini HP anak" besar onPress={() => router.push({ pathname: '/daftar/pin', params: { dari: 'anak' } })} />
        <Tombol label="Saya orang tua" varian="garis" besar ikon="orang" onPress={() => router.push(modeData() === 'supabase' ? '/masuk' : '/daftar/pin')} />
      </View>
    </Layar>
  );
}
