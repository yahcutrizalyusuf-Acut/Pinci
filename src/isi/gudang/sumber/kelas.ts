import { SUMBER_K2 } from './k2';
import { SUMBER_K3 } from './k3';
import { SUMBER_K4 } from './k4';
import { SUMBER_K5 } from './k5';
import type { SumberKelas } from './peta';
import { T2_K2, T2_K3 } from './tahap2-k2-k3';
import { T2_K4, T2_K5 } from './tahap2-k4-k5';

/** Gabungkan tahap 1 (k2.ts … k5.ts) dan tahap 2 (tahap2-*.ts). Versi naik setiap tahap. */
function gabung(s: SumberKelas, t2: { mat: SumberKelas['kartuMat']; bi: SumberKelas['kartuBi'] }): SumberKelas {
  return { ...s, versi: '0.2.0', dibuat: '2026-10-31', kartuMat: [...s.kartuMat, ...t2.mat], kartuBi: [...s.kartuBi, ...t2.bi] };
}

/** Sumber Gudang Ilmu kelas 2–5 (kelas 6 memakai bangunPaketGudang di peta.ts). */
export const SUMBER_KELAS: SumberKelas[] = [gabung(SUMBER_K2, T2_K2), gabung(SUMBER_K3, T2_K3), gabung(SUMBER_K4, T2_K4), gabung(SUMBER_K5, T2_K5)];
