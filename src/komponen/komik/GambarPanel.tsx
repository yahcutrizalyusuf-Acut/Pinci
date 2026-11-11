/**
 * Gambar satu panel komik TANPA teks (gelembung digambar terpisah oleh layar, CLAUDE.md aturan 13).
 * Antarmuka tetap: dipakai K30 Cerita Komik, K31 Cek Paham, D10 Ceritakan Lagi, D11 Dengar Bedanya.
 * Kalau `panel.gambar` terdaftar di GAMBAR_ASLI, memakai gambar asli; kalau tidak, merakit latar + tokoh SVG sementara.
 */
import { Image, View } from 'react-native';

import type { PanelKomik, PosisiTokoh } from '../../isi/inggris/komik';
import { teksTokoh } from '../../isi/inggris/paketKomik';
import { GAMBAR_ASLI } from './gambarAsli';
import { LatarKomik } from './LatarKomik';
import { TokohKomik } from './TokohKomik';

export interface PropsGambarPanel {
  panel: PanelKomik;
  /** lebar dalam piksel; panel selalu persegi (1:1) */
  lebar: number;
  /** label pembaca layar; bawaan dari `panel.adegan` */
  aksesLabel?: string;
}

/** Titik tengah tokoh sebagai bagian lebar panel. */
export const TENGAH_POSISI: Record<PosisiTokoh, number> = {
  kiri: 0.2,
  tengah_kiri: 0.35,
  tengah: 0.5,
  tengah_kanan: 0.65,
  kanan: 0.8,
};

/** Perbedaan tinggi antartokoh (Nisa paling kecil, Bima paling besar, orang dewasa lebih tinggi). */
export const SKALA_TOKOH: Record<string, number> = {
  nisa: 0.82,
  dafi: 0.92,
  fathan: 0.95,
  lina: 0.95,
  bima: 1.02,
  robi: 0.88,
  kabut: 1.05,
  nek_ijah: 1.0,
  kak_fajar: 1.1,
};

/** Hitung kotak tiap tokoh (dalam piksel) supaya tokoh tidak keluar panel. Diekspor untuk diuji. */
export function tataTokoh(panel: PanelKomik, lebar: number) {
  const banyak = panel.tokoh.length;
  const dasar = lebar * (banyak >= 3 ? 0.5 : 0.58);
  return panel.tokoh.map((t) => {
    const tinggi = dasar * (SKALA_TOKOH[t.tokoh] ?? 1);
    const lebarTokoh = tinggi * 0.75;
    const tengah = TENGAH_POSISI[t.posisi] * lebar;
    const kiri = Math.max(0, Math.min(lebar - lebarTokoh, tengah - lebarTokoh / 2));
    const atas = lebar * 0.97 - tinggi;
    return { ...t, tinggi, kiri, atas };
  });
}

export function GambarPanel({ panel, lebar, aksesLabel }: PropsGambarPanel) {
  const asli = panel.gambar ? GAMBAR_ASLI[panel.gambar] : undefined;
  const bingkai = { width: lebar, height: lebar, borderRadius: 16, borderWidth: 3, borderColor: '#6B4423', overflow: 'hidden' as const, backgroundColor: '#FFF6E5' };
  if (asli) {
    return <Image accessibilityRole="image" accessibilityLabel={aksesLabel ?? teksTokoh(panel.adegan)} source={asli} style={bingkai} resizeMode="cover" />;
  }
  const dalam = lebar - 6;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={aksesLabel ?? teksTokoh(panel.adegan)} style={bingkai}>
      <LatarKomik latar={panel.latar} lebar={dalam} />
      {tataTokoh(panel, dalam).map((t, i) => (
        <View key={`${t.tokoh}-${i}`} pointerEvents="none" style={{ position: 'absolute', left: t.kiri, top: t.atas }}>
          <TokohKomik tokoh={t.tokoh} pose={t.pose} balik={t.balik} varian={t.varian} tinggi={t.tinggi} />
        </View>
      ))}
    </View>
  );
}
