import { Stack } from 'expo-router';

import { warna } from '@/desain/token';

export default function TataLetakOrtu() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.abuTerang } }} />;
}
