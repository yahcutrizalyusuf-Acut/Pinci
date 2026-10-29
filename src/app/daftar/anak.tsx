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
        Anak kelas 6 mendapat paket lengkap. Anak kelas lain mendapat Lancar Matematika, Bahasa Inggris, dan game. Paket kelas lain sedang disiapkan.
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
