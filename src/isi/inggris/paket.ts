/** Empat paket Belajar Bahasa Inggris yang dibawa di aplikasi (tanpa unduhan, jalan tanpa sinyal). */
import t3 from '../../../assets/paket/inggris-t3.json';
import t4 from '../../../assets/paket/inggris-t4.json';
import t5 from '../../../assets/paket/inggris-t5.json';
import t6 from '../../../assets/paket/inggris-t6.json';
import type { PaketInggris } from './jenis';

export const PAKET_INGGRIS: Record<3 | 4 | 5 | 6, PaketInggris> = {
  3: t3 as unknown as PaketInggris,
  4: t4 as unknown as PaketInggris,
  5: t5 as unknown as PaketInggris,
  6: t6 as unknown as PaketInggris,
};
