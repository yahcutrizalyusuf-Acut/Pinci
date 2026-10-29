import { Andika_400Regular, Andika_700Bold } from '@expo-google-fonts/andika';
import { Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PenyediaData, useData } from '@/data/konteks';
import { warna } from '@/desain/token';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function Isi() {
  const { siap } = useData();
  const [hurufSiap] = useFonts({
    Andika_400Regular,
    Andika_700Bold,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const semua = siap && hurufSiap;
  useEffect(() => {
    if (semua) SplashScreen.hideAsync().catch(() => undefined);
  }, [semua]);
  if (!semua) return null;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: warna.kremLembut },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="lancar/lembar" options={{ gestureEnabled: false }} />
      <Stack.Screen name="tka/simulasi" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function TataLetakAkar() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PenyediaData>
          <StatusBar style="dark" />
          <Isi />
        </PenyediaData>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
