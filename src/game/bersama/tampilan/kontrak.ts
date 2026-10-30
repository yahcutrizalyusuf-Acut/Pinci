/** Kontrak tampilan game: setiap game punya `src/game/<nama>/LayarGame.tsx` dengan props ini. */
import type { Kelas, Tingkat } from '../jenis';
import type { Level } from '../level';
import type { RingkasanBabak } from '../ringkasan';

export interface PropsLayarGame {
  kelas: Kelas;
  tingkat: Tingkat;
  /** level 1–5 untuk game berjenjang (game lama memakai `tingkat`) */
  level?: Level;
  benih: number;
  /** sisa waktu main hari ini (detik) saat babak dimulai; Infinity bila tanpa batas (mis. uji) */
  sisaDetikAwal: number;
  /** batas waktu main hari ini (detik), untuk posisi matahari */
  totalDetik: number;
  /** bunyi boleh dimainkan (pengaturan orang tua) */
  bunyi: boolean;
  /** babak selesai → layar Akhir babak (G07) */
  onSelesai: (r: RingkasanBabak) => void;
  /** tombol kembali di kepala layar */
  onKeluar: () => void;
}
