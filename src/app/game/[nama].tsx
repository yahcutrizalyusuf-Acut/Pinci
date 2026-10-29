/** G02 Pilih tingkat: Santai atau Seru. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '@/desain/token';
import { GambarTempat, TEMPAT } from '@/game/peta/GambarTempat';
import { KepalaLayar } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';

export default function PilihTingkat() {
  const { nama } = useLocalSearchParams<{ nama: string }>();
  const router = useRouter();
  const t = TEMPAT.find((x) => x.rute === nama) ?? TEMPAT[0];
  const pilihan = [
    { tingkat: 'santai', judul: 'Santai', sub: 'Pelan-pelan, angka kecil', emoji: '🐢', latar: '#E4F4EB', garis: warna.hijauDaun },
    { tingkat: 'seru', judul: 'Seru', sub: 'Lebih banyak, angka besar', emoji: '🚀', latar: '#FFF0D9', garis: warna.oranye },
  ] as const;
  return (
    <Layar latar="#CFEBDC">
      <KepalaLayar judul="Pilih tingkat game" />
      <View style={{ alignItems: 'center', gap: 6 }}>
        <GambarTempat game={t.game} lebar={140} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>{t.judul}</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua }}>Mau main yang mana?</Text>
      </View>
      <View style={{ gap: 14 }}>
        {pilihan.map((p) => (
          <Pressable
            key={p.tingkat}
            accessibilityRole="button"
            accessibilityLabel={`${p.judul}. ${p.sub}`}
            onPress={() => router.replace({ pathname: '/game/main', params: { nama: t.rute, tingkat: p.tingkat } })}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 24, backgroundColor: p.latar, borderWidth: 3, borderColor: p.garis, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <Text style={{ fontSize: 44 }}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.teks }}>{p.judul}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>{p.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua, textAlign: 'center' }}>Bisa ganti kapan saja.</Text>
    </Layar>
  );
}
