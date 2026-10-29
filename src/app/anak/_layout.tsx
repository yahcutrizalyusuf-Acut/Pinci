/** Mode anak: navigasi bawah Belajar · Gudang Ilmu · Main · Pesan. */
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { useData, useMuat } from '@/data/konteks';
import { warna } from '@/desain/token';
import { NavBawah } from '@/komponen/NavBawah';

export default function TataLetakAnak() {
  const { anakAktif } = useData();
  const adaPesanBaru = useMuat(
    async (repo) => (anakAktif ? (await repo.daftarPesan(anakAktif.id)).some((p) => p.dari === 'orang_tua' && !p.dibaca) : false),
    false,
    [anakAktif?.id],
  );
  if (!anakAktif) return <Redirect href="/profil" />;
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: warna.kremLembut } }}
      tabBar={(p) => (
        <NavBawah
          props={p}
          item={[
            { nama: 'index', label: 'Belajar', ikon: 'rumah' },
            { nama: 'gudang', label: 'Gudang Ilmu', ikon: 'buku' },
            { nama: 'main', label: 'Main', ikon: 'dadu' },
            { nama: 'pesan', label: 'Pesan', ikon: 'pesan', titik: adaPesanBaru },
          ]}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="gudang" />
      <Tabs.Screen name="main" />
      <Tabs.Screen name="pesan" />
    </Tabs>
  );
}
