/**
 * Gelembung komik yang ditulis APLIKASI di atas panel (tidak pernah dicetak di gambar, CLAUDE.md aturan 13).
 * Setiap kata bisa disorot (saat diucapkan) dan diketuk (dengar kata + arti). Huruf Andika ≥ 20sp.
 */
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import type { Gelembung } from '../../isi/inggris/komik';
import { cariTokoh, teksTokoh } from '../../isi/inggris/paketKomik';
import { kepingKalimat } from '../../fitur/komik';

export interface PropsGelembung {
  gelembung: Gelembung;
  /** lebar panel (piksel) untuk menempatkan gelembung */
  lebarPanel: number;
  /** indeks kata yang sedang disorot, atau null */
  sorot?: number | null;
  /** gelembung yang sedang berbicara diberi garis tebal */
  aktif?: boolean;
  onKetukKata?: (kata: string, tampil: string) => void;
  onKetukGelembung?: () => void;
  /** tombol 🔊 besar di gelembung (kelas 1–2 saat Baca) */
  tombolSuara?: boolean;
}

const POSISI: Record<Gelembung['posisi'], { top?: number; bottom?: number; left?: number; right?: number; alignSelf?: 'center' }> = {
  kiri_atas: { top: 0.03, left: 0.03 },
  tengah_atas: { top: 0.03, left: 0.2 },
  kanan_atas: { top: 0.03, right: 0.03 },
  kiri_bawah: { bottom: 0.35, left: 0.03 },
  kanan_bawah: { bottom: 0.35, right: 0.03 },
};

export function GelembungKomik({ gelembung, lebarPanel, sorot = null, aktif = false, onKetukKata, onKetukGelembung, tombolSuara = false }: PropsGelembung) {
  const p = POSISI[gelembung.posisi];
  const teks = teksTokoh(gelembung.teks);
  const keping = kepingKalimat(teks);
  const narasi = gelembung.tokoh === 'narator';
  const tokoh = cariTokoh(gelembung.tokoh);
  const posisi = {
    position: 'absolute' as const,
    maxWidth: lebarPanel * 0.62,
    ...(p.top !== undefined ? { top: p.top * lebarPanel } : {}),
    ...(p.bottom !== undefined ? { bottom: p.bottom * lebarPanel } : {}),
    ...(p.left !== undefined ? { left: p.left * lebarPanel } : {}),
    ...(p.right !== undefined ? { right: p.right * lebarPanel } : {}),
  };
  const ekorKiri = gelembung.ekor === 'kiri' ? 18 : gelembung.ekor === 'tengah' ? undefined : undefined;
  return (
    <View style={posisi} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${tokoh?.nama ?? ''}: ${teks}`}
        onPress={onKetukGelembung}
        style={{
          backgroundColor: narasi ? '#FFF1C9' : warna.putih,
          borderRadius: narasi ? 8 : 18,
          borderWidth: aktif ? 3 : 2,
          borderColor: aktif ? (tokoh?.warna ?? '#6B4423') : '#6B4423',
          paddingHorizontal: 10,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ flexShrink: 1, fontFamily: huruf.anak, fontSize: 20, lineHeight: 27, color: warna.teks }}>
          {keping.map((k, i) => (
            <Text
              key={i}
              accessibilityRole="button"
              suppressHighlighting
              onPress={onKetukKata && k.kata ? () => onKetukKata(k.kata, k.tampil) : undefined}
              style={sorot === i ? { backgroundColor: '#FFD966', borderRadius: 4 } : undefined}
            >
              {k.tampil}
              {i < keping.length - 1 ? ' ' : ''}
            </Text>
          ))}
        </Text>
        {tombolSuara ? (
          <Text accessibilityElementsHidden style={{ fontSize: 26 }}>
            🔊
          </Text>
        ) : null}
      </Pressable>
      {!narasi ? (
        <View
          pointerEvents="none"
          style={{
            width: 14,
            height: 14,
            backgroundColor: warna.putih,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: aktif ? (tokoh?.warna ?? '#6B4423') : '#6B4423',
            transform: [{ rotate: '45deg' }],
            marginTop: -8,
            ...(gelembung.ekor === 'kanan' ? { alignSelf: 'flex-end', marginRight: 18 } : gelembung.ekor === 'tengah' ? { alignSelf: 'center' } : { marginLeft: ekorKiri ?? 18 }),
          }}
        />
      ) : null}
    </View>
  );
}
