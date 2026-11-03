/** Menambah profil anak (A5 rancangan). */
import { useRouter } from 'expo-router';

import { useData } from '@/data/konteks';
import { warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu } from '@/komponen/dasar';
import { FormAnak } from '@/komponen/FormAnak';
import { Layar } from '@/komponen/Layar';

export default function TambahAnak() {
  const router = useRouter();
  const { repo, daftarAnak } = useData();
  return (
    <Layar gulir latar={warna.abuTerang}>
      <KepalaLayar judul={daftarAnak.length ? 'Tambah anak' : 'Profil anak'} ortu />
      <TeksOrtu style={{ color: warna.teksKedua }}>
        Satu profil untuk satu anak. Kalau anak sudah punya profil, tidak perlu dibuat lagi.
      </TeksOrtu>
      <FormAnak
        label="Simpan profil"
        onSimpan={async (d) => {
          await repo.tambahAnak(d);
          router.replace('/profil');
        }}
      />
    </Layar>
  );
}
