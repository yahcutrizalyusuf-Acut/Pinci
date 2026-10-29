/** Mode orang tua: Kabar · Rapor · Bimbingan · Atur. Terkunci PIN. */
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { useData } from '@/data/konteks';
import { warna } from '@/desain/token';
import { NavBawah, type PropsBilahTab } from '@/komponen/NavBawah';

export default function TabOrtu() {
  const { ortuTerbuka } = useData();
  if (!ortuTerbuka) return <Redirect href="/ortu/pin" />;
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: warna.abuTerang } }}
      tabBar={(p) => (
        <NavBawah
          ortu
          props={p as unknown as PropsBilahTab}
          item={[
            { nama: 'index', label: 'Kabar', ikon: 'pesan' },
            { nama: 'rapor', label: 'Rapor', ikon: 'grafik' },
            { nama: 'bimbingan', label: 'Bimbingan', ikon: 'perisai' },
            { nama: 'atur', label: 'Atur', ikon: 'slider' },
          ]}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rapor" />
      <Tabs.Screen name="bimbingan" />
      <Tabs.Screen name="atur" />
    </Tabs>
  );
}
