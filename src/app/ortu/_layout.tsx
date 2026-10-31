import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';

/** HP anak yang dihubungkan dengan kode tidak punya mode orang tua: pengaturan dilakukan dari HP orang tua. */
function HpAnak() {
  const router = useRouter();
  return (
    <Layar latar={warna.abuTerang}>
      <KepalaLayar judul="Ini HP anak" ortu />
      <View style={{ gap: 12 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 18, color: warna.teks }}>Pengaturan lewat HP orang tua</Text>
        <TeksOrtu>Rapor, pesan, pengaturan waktu, dan Mode Dampingi dibuka dari HP orang tua. Hasil belajar di HP ini sudah terkirim ke sana.</TeksOrtu>
        <Tombol label="Kembali" ortu onPress={() => router.replace('/anak')} />
      </View>
    </Layar>
  );
}

/** Semua layar orang tua terkunci PIN, kecuali layar PIN itu sendiri. */
export default function TataLetakOrtu() {
  const { ortuTerbuka, keluarga } = useData();
  const segmen = useSegments() as string[];
  if (keluarga?.hp === 'anak') return <HpAnak />;
  if (!ortuTerbuka && segmen[segmen.length - 1] !== 'pin') return <Redirect href="/ortu/pin" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.abuTerang } }} />;
}
