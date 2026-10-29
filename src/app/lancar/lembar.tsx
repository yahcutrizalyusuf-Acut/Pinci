/** A05 Lembar Lancar (mode sendiri atau dampingi). */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { ambilJurusAman } from '@/fitur/jurus';
import { lembarBerikut, simpanLembarLancar } from '@/fitur/lancar';
import { titip } from '@/fitur/sementara';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import { LembarSoal } from '@/komponen/LembarSoal';
import type { LembarLancar } from '@/mesin/lancar';

export default function LayarLembar() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const dampingi = mode === 'dampingi';
  const { repo, anakAktif } = useData();
  const [lembar, setLembar] = useState<LembarLancar | null>(null);
  const [jeda, setJeda] = useState(false);
  const mulai = useRef(0);
  useHitungWaktu('belajar', jeda, dampingi ? 'dampingi' : 'sendiri');

  useEffect(() => {
    if (!anakAktif) return;
    (async () => {
      if (!dampingi) {
        const halangan = ruteHalangan(await cekBelajar(repo, anakAktif));
        if (halangan) {
          router.replace(halangan);
          return;
        }
      }
      mulai.current = kiniMs();
      setLembar(await lembarBerikut(repo, anakAktif));
    })();
  }, [repo, anakAktif, dampingi, router]);

  if (!lembar || !anakAktif) return null;
  return (
    <LembarSoal
      soal={lembar.soal}
      kelas={anakAktif.kelas}
      tampilKunci={dampingi}
      petunjukUntuk={(s) => ambilJurusAman(s.kelas, s.level).petunjuk}
      onJedaBerubah={setJeda}
      onKeluar={() => router.back()}
      onSelesai={async (jawaban) => {
        const hasil = await simpanLembarLancar(
          repo,
          anakAktif,
          { kelas: lembar.kelas, level: lembar.level, benih: lembar.benih, levelDayaTahan: lembar.levelDayaTahan, jumlahSoal: lembar.soal.length },
          jawaban,
          mulai.current,
          dampingi ? 'dampingi' : 'sendiri',
        );
        titip('akhir-lembar', hasil);
        router.replace('/lancar/akhir');
      }}
    />
  );
}
