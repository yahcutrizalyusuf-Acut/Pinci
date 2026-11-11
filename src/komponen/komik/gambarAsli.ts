/**
 * Daftar panel komik ASLI (dari desainer atau alat gambar), kunci = nilai `panel.gambar` di paket komik.
 * Kosong sampai gambar asli ada. Cara mengganti gambar sementara tanpa mengubah layar:
 *   1. taruh berkas di assets/komik/<id-panel>.webp (tanpa teks di dalam gambar, CLAUDE.md aturan 13);
 *   2. tambahkan baris `'t3-u01-p1': require('../../../assets/komik/t3-u01-p1.webp'),` di bawah;
 *   3. di paket komik isi `"gambar": "t3-u01-p1"` dan `"gambar_sementara": false`.
 */
import type { ImageSourcePropType } from 'react-native';

export const GAMBAR_ASLI: Record<string, ImageSourcePropType> = {};
