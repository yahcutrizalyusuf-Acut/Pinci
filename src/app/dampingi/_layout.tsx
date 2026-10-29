/**
 * Mode Dampingi: dibuka dengan PIN orang tua, kepala oranye "Sedang didampingi", tombol Selesai.
 * Keluar sendiri ke beranda anak setelah 15 menit tanpa sentuhan (D2 rancangan).
 */
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { Ikon } from '@/komponen/Ikon';

const DIAM_MS = 15 * 60 * 1000;

export default function TataLetakDampingi() {
  const router = useRouter();
  const { ortuTerbuka, keluarga, anakAktif, daftarAnak, pilihAnak, kunciOrtu } = useData();
  const sentuhTerakhir = useRef(0);
  const [, setDetak] = useState(0);

  useEffect(() => {
    sentuhTerakhir.current = kiniMs();
    const t = setInterval(() => {
      if (kiniMs() - sentuhTerakhir.current > DIAM_MS) {
        kunciOrtu();
        router.replace('/anak');
      }
      setDetak((d) => d + 1);
    }, 30_000);
    return () => clearInterval(t);
  }, [router, kunciOrtu]);

  useEffect(() => {
    if (!anakAktif && daftarAnak[0]) pilihAnak(daftarAnak[0].id);
  }, [anakAktif, daftarAnak, pilihAnak]);

  if (!ortuTerbuka) return <Redirect href={{ pathname: '/ortu/pin', params: { tujuan: '/dampingi' } }} />;
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  return (
    <View style={{ flex: 1, backgroundColor: warna.oranye }} onTouchStart={() => (sentuhTerakhir.current = kiniMs())}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: warna.oranye }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 64 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: warna.kremLembut, alignItems: 'center', justifyContent: 'center' }}>
            <Ikon nama="dua_orang" ukuran={22} />
          </View>
          <Text numberOfLines={2} style={{ flex: 1, fontFamily: huruf.judulTebal, fontSize: 18, lineHeight: 21, color: warna.teks }}>
            Sedang didampingi {sapaan}
            {anakAktif ? ` · ${anakAktif.nama}` : ''}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              kunciOrtu();
              router.replace('/anak');
            }}
            style={{ height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: warna.kremLembut, justifyContent: 'center' }}
          >
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.teks }}>Selesai</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <View style={{ flex: 1, marginHorizontal: 6, marginBottom: 6, borderRadius: 4, overflow: 'hidden' }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.kremLembut } }} />
      </View>
    </View>
  );
}
