import { Redirect } from 'expo-router';

import { useData } from '@/data/konteks';

/** Pintu masuk: HP baru → Selamat datang; sudah ada keluarga → Pilih profil. */
export default function Pintu() {
  const { keluarga, daftarAnak } = useData();
  if (!keluarga) return <Redirect href="/selamat-datang" />;
  if (daftarAnak.length === 0) return <Redirect href="/daftar/anak" />;
  return <Redirect href="/profil" />;
}
