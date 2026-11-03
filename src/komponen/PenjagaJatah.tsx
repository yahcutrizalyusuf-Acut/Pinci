/**
 * Pembungkus layar kegiatan: bila anak memakai Gratis dan jatahnya habis, tampilkan "Latihan hari ini selesai!".
 * Diperiksa sekali saat layar dibuka, supaya menyimpan sesi tidak memotong layar yang sedang berjalan.
 * Tanpa harga dan tanpa ajakan membeli (CLAUDE.md, kebijakan Keluarga Google Play).
 */
import { useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { useData } from '../data/konteks';
import { cekJatahHabis, teksJatahHabis, JATAH_GRATIS } from '../fitur/jatah';
import { Layar } from './Layar';
import { GelembungPinci, KepalaLayar, Tombol } from './dasar';

type Bagian = keyof typeof JATAH_GRATIS;

export function PenjagaJatah({ bagian, children }: { bagian: Bagian; children: ReactNode }) {
  const { repo, anakAktif } = useData();
  const [habis, setHabis] = useState<boolean | null>(anakAktif ? null : false);
  useEffect(() => {
    let batal = false;
    if (!anakAktif) return;
    cekJatahHabis(repo, anakAktif, bagian)
      .then((h) => !batal && setHabis(h))
      .catch(() => !batal && setHabis(false));
    return () => {
      batal = true;
    };
    // Sengaja hanya sekali saat dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (habis === null) return <View style={{ flex: 1 }} />;
  if (habis) return <LayarJatahHabis bagian={bagian} />;
  return <>{children}</>;
}

export function LayarJatahHabis({ bagian }: { bagian: Bagian }) {
  const router = useRouter();
  const t = teksJatahHabis(bagian);
  return (
    <Layar>
      <KepalaLayar judul={t.judul} />
      <GelembungPinci judul={t.judul} teks={t.teks} />
      <Tombol label="Kembali ke beranda" onPress={() => router.navigate('/anak')} />
    </Layar>
  );
}
