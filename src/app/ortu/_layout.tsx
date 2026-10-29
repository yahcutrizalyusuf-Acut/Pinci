import { Redirect, Stack, useSegments } from 'expo-router';

import { useData } from '@/data/konteks';
import { warna } from '@/desain/token';

/** Semua layar orang tua terkunci PIN, kecuali layar PIN itu sendiri. */
export default function TataLetakOrtu() {
  const { ortuTerbuka } = useData();
  const segmen = useSegments() as string[];
  if (!ortuTerbuka && segmen[segmen.length - 1] !== 'pin') return <Redirect href="/ortu/pin" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.abuTerang } }} />;
}
