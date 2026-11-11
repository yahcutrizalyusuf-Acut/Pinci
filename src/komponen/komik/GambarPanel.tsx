/**
 * Gambar satu panel komik TANPA teks (gelembung digambar terpisah oleh layar, CLAUDE.md aturan 13).
 * Antarmuka tetap: dipakai K30 Cerita Komik, K31 Cek Paham, D10 Ceritakan Lagi, D11 Dengar Bedanya.
 * Isi sementara: kerangka. Diganti rakitan SVG latar + tokoh (tahap 3); kalau `panel.gambar` ada, memakai berkas itu.
 */
import { View, Text } from 'react-native';

import type { PanelKomik } from '../../isi/inggris/komik';

export interface PropsGambarPanel {
  panel: PanelKomik;
  /** lebar dalam piksel; panel selalu persegi (1:1) */
  lebar: number;
  /** label pembaca layar; bawaan dari `panel.adegan` */
  aksesLabel?: string;
}

export function GambarPanel({ panel, lebar, aksesLabel }: PropsGambarPanel) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={aksesLabel ?? panel.adegan} style={{ width: lebar, height: lebar, borderRadius: 16, backgroundColor: '#FFF6E5', borderWidth: 3, borderColor: '#6B4423', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#6B4423' }}>{panel.nomor}</Text>
    </View>
  );
}
