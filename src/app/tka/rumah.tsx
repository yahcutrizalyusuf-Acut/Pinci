/** Latihan rumah digital: soal ○ tiap topik dengan petunjuk bertahap. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { paketTka } from '@/isi/tka/paket';
import { KepalaLayar } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';

export default function LatihanRumah() {
  const router = useRouter();
  const { anakAktif } = useData();
  const selesai = useMuat(async (r) => new Set((await r.daftarSesi(anakAktif!.id, 'tka')).map((s) => s.rujukan)), new Set<string | undefined>(), [anakAktif?.id]);
  const topik = paketTka.topik.filter((t) => t.latihanRumah.length > 0);
  return (
    <Layar>
      <KepalaLayar judul="Latihan rumah" />
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 16 }}>
        {topik.map((t) => {
          const sudah = selesai.has(`${t.id}-rumah`);
          return (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/tka/latihan', params: { topik: t.id, rumah: '1' } })}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: warna.putih, opacity: pressed ? 0.8 : 1 })}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: warnaMapel[t.mapel].muda, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warnaMapel[t.mapel].teks }}>{t.id}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{t.judul}</Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua }}>
                  {t.latihanRumah.length} soal · minggu {t.minggu}
                </Text>
              </View>
              {sudah ? <Ikon nama="centang" ukuran={22} warna={warna.hijauTua} /> : <Ikon nama="kanan" ukuran={22} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </Layar>
  );
}
