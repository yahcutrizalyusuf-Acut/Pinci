/** Baca Ulang: buka teks berikutnya langsung (≤ 2 ketukan dari beranda), atau pilih teks lain. */
import { Redirect } from 'expo-router';

import { useData, useMuat } from '@/data/konteks';
import { teksBerikut } from '@/fitur/baca';
import { teksBacaKelas } from '@/isi/baca/paket';

export default function BacaUlang() {
  const { anakAktif } = useData();
  const t = useMuat(async (r) => teksBerikut(teksBacaKelas(anakAktif!.kelas), await r.daftarSesi(anakAktif!.id, 'baca')), null, [anakAktif?.id]);
  if (!t) return null;
  return <Redirect href={`/baca/${t.id}`} />;
}
