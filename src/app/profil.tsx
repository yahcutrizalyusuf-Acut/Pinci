/** A02 Pilih profil. */
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { bayangan, huruf, warna } from '@/desain/token';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function PilihProfil() {
  const router = useRouter();
  const { daftarAnak, pilihAnak } = useData();
  return (
    <Layar gulir>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 24 }}>
        <Pinci ukuran={64} />
        <Text style={{ flex: 1, fontFamily: huruf.judul, fontSize: 26, lineHeight: 30, color: warna.teks }}>Siapa yang mau belajar?</Text>
      </View>
      <View style={{ gap: 16 }}>
        {daftarAnak.map((a) => (
          <Pressable
            key={a.id}
            accessibilityRole="button"
            accessibilityLabel={`${a.nama}, kelas ${a.kelas}`}
            onPress={() => {
              pilihAnak(a.id);
              router.replace('/anak');
            }}
            style={({ pressed }) => [
              {
                height: 112,
                borderRadius: 24,
                backgroundColor: warna.putih,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                paddingHorizontal: 20,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
              bayangan.ringan,
            ]}
          >
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: HEWAN[a.hewan].latar, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 44 }}>{HEWAN[a.hewan].emoji}</Text>
            </View>
            <View>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: warna.teks }}>{a.nama}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Kelas {a.kelas}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua, textAlign: 'center' }}>Ketuk gambarmu untuk mulai.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mode orang tua"
        onPress={() => router.push('/ortu/pin')}
        style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, opacity: 0.55 }}
      >
        <Ikon nama="gembok" ukuran={16} warna={warna.teksKedua} />
        <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Orang tua</Text>
      </Pressable>
    </Layar>
  );
}
