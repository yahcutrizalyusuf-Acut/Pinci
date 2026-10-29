/**
 * Paket TKA bawaan aplikasi. Modul inti (pemuat, pemeriksa kunci) tidak meng-import JSON ini
 * supaya bisa diuji dengan paket buatan; layar memakai `paketTka` dari sini.
 */
import data from '../../../assets/paket/tka-k6.json';

import type { PaketTka } from './jenis';

export const paketTka: PaketTka = data as unknown as PaketTka;
