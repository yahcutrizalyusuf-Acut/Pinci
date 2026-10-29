/** Kartu gambar kosakata (emoji besar) untuk dengar-lalu-pilih dan permainan kata. */
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../desain/token';

export function KartuGambar({
  emoji,
  label,
  onPress,
  keadaan = 'biasa',
  kecil = false,
  aksesLabel,
}: {
  emoji: string;
  label?: string;
  onPress?: () => void;
  keadaan?: 'biasa' | 'benar' | 'keliru' | 'redup' | 'dipilih';
  kecil?: boolean;
  aksesLabel?: string;
}) {
  const garis = keadaan === 'benar' ? warna.hijauSegar : keadaan === 'keliru' ? warna.oranye : keadaan === 'dipilih' ? '#8E6CCF' : warna.kremBatang;
  const latar = keadaan === 'benar' ? warna.hijauMuda : keadaan === 'keliru' ? '#FFF4E5' : keadaan === 'dipilih' ? '#F1ECFA' : warna.putih;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={aksesLabel ?? label ?? 'Gambar'}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: kecil ? 84 : 128,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: garis,
        backgroundColor: latar,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        opacity: keadaan === 'redup' ? 0.35 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <Text style={{ fontSize: kecil ? 36 : 56 }}>{emoji}</Text>
      {label ? (
        <View>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: kecil ? 15 : 18, color: warna.teks, textAlign: 'center' }}>{label}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
