/** Kait bersama untuk tampilan game berjenjang. */
import { useEffect, useRef, useState } from 'react';

import { kiniMs } from '../../../data/alat';
import type { RingkasanBabak } from '../ringkasan';

/** Detik yang sudah lewat sejak babak dibuka (diperbarui tiap 5 detik, untuk matahari waktu). */
export function useLewatDetik(): number {
  const [lewat, setLewat] = useState(0);
  useEffect(() => {
    const mulai = kiniMs();
    const id = setInterval(() => setLewat(Math.floor((kiniMs() - mulai) / 1000)), 5000);
    return () => clearInterval(id);
  }, []);
  return lewat;
}

/** Pesta kecil ≤ 1,5 detik. */
export const JEDA_PESTA_MS = 1400;

/** Saat babak selesai: tunggu pesta kecil, lalu kirim ringkasan ke layar Akhir babak. */
export function useSelesaiBabak(selesai: boolean, buatRingkasan: () => RingkasanBabak, onSelesai: (r: RingkasanBabak) => void) {
  const ref = useRef({ buatRingkasan, onSelesai });
  useEffect(() => {
    ref.current = { buatRingkasan, onSelesai };
  });
  useEffect(() => {
    if (!selesai) return;
    const r = ref.current.buatRingkasan();
    const id = setTimeout(() => ref.current.onSelesai(r), JEDA_PESTA_MS);
    return () => clearTimeout(id);
  }, [selesai]);
}
