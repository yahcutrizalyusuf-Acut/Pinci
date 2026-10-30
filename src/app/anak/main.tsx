/** G01 Waktu main: peta Gampong 4 tempat, ditambah 4 tempat baru yang berjenjang (level 1–5). Terbuka setelah inti harian (bawaan) atau selalu (pilihan orang tua). */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { hariIni } from '@/fitur/hari-ini';
import { cekMain } from '@/fitur/waktu';
import { MatahariWaktu } from '@/game/bersama/tampilan/MatahariWaktu';
import { GambarTempat, TEMPAT } from '@/game/peta/GambarTempat';
import { batasGameDetik } from '@/layanan/penjaga-waktu';
import { GelembungPinci } from '@/komponen/dasar';
import { Pinci } from '@/komponen/Pinci';

function Latar() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 360 800" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
      <Path d="M-10 380 C 60 360, 90 420, 180 400 S 300 350, 370 380 V 430 C 300 400, 260 450, 180 452 S 60 412, -10 432 Z" fill="#9FD3F0" />
      <Path d="M30 420 q10 -6 20 0 M240 400 q10 -6 20 0 M120 432 q10 -6 20 0" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M180 410 L90 250 M180 410 L270 250 M180 410 L90 560 M180 410 L270 560" stroke="#EAD9B6" strokeWidth={22} strokeLinecap="round" />
      <Rect x={150} y={398} width={60} height={26} rx={6} fill="#B07A4A" />
      <Path d="M154 404 H206 M154 411 H206 M154 418 H206" stroke="#8A5A33" strokeWidth={2} />
      <Circle cx={30} cy={110} r={22} fill="#3BB273" />
      <Circle cx={52} cy={124} r={16} fill="#2E9E5B" />
      <Circle cx={336} cy={300} r={20} fill="#3BB273" />
      <Circle cx={24} cy={660} r={20} fill="#3BB273" />
      <Circle cx={330} cy={700} r={24} fill="#2E9E5B" />
      <Circle cx={300} cy={120} r={5} fill="#FF9F1C" />
      <Circle cx={60} cy={320} r={5} fill="#E85D5D" />
      <Circle cx={310} cy={640} r={5} fill="#FFFFFF" />
    </Svg>
  );
}

export default function WaktuMain() {
  const router = useRouter();
  const { anakAktif, keluarga } = useData();
  const anak = anakAktif!;
  const data = useMuat(
    async (r) => {
      const status = await cekMain(r, anak);
      const atur = await r.pengaturan(anak.id);
      const pakai = await r.pemakaian(anak.id);
      const h = await hariIni(r, anak);
      return { status, total: batasGameDetik(atur), sisa: status.jenis === 'boleh' ? status.sisaDetik : 0, terpakai: pakai.mainDetik, h };
    },
    null,
    [anak.id],
  );
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const boleh = data?.status.jenis === 'boleh';

  const pesan = (() => {
    if (!data) return null;
    switch (data.status.jenis) {
      case 'tunggu_inti':
        return { judul: 'Sebentar lagi, ya', teks: 'Waktu main datang sesudah belajar hari ini, seperti istirahat di sekolah.' };
      case 'habis':
        return { judul: 'Waktu main hari ini sudah selesai', teks: 'Sampai besok, ya!' };
      case 'mati':
        return { judul: 'Waktu main sedang libur', teks: `${sapaan} mengatur waktu main hari ini. Yuk, lihat Gudang Ilmu!` };
      case 'jam_tenang':
        return { judul: 'Sudah malam', teks: 'Pinci mau tidur dulu. Besok kita main lagi, ya!' };
      default:
        return null;
    }
  })();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CFEBDC' }} edges={['top', 'left', 'right']}>
      <Latar />
      <ScrollView contentContainerStyle={{ flexGrow: 1, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, height: 72 }}>
          <Text style={{ flex: 1, fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>Waktu main</Text>
          {data && data.total > 0 ? <MatahariWaktu sisaDetik={data.sisa} totalDetik={data.total} /> : null}
        </View>
        {pesan ? (
          <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <GelembungPinci ekspresi={data?.status.jenis === 'jam_tenang' || data?.status.jenis === 'habis' ? 'melambai' : 'semangat'} judul={pesan.judul} teks={pesan.teks} />
          </View>
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 12, paddingBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {TEMPAT.slice(0, 2).map((t) => (
                <KartuTempat key={t.game} t={t} boleh={boleh} onPress={() => router.push(`/game/${t.rute}`)} />
              ))}
            </View>
            <View style={{ alignItems: 'center', marginVertical: 8 }}>
              <Pinci ukuran={96} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {TEMPAT.slice(2, 4).map((t) => (
                <KartuTempat key={t.game} t={t} boleh={boleh} onPress={() => router.push(`/game/${t.rute}`)} />
              ))}
            </View>
            <View style={{ marginTop: 20, marginBottom: 8, backgroundColor: warna.putih, borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'center' }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.hijauTua }}>Tempat baru · naik level 1 sampai 5</Text>
            </View>
            {[TEMPAT.slice(4, 6), TEMPAT.slice(6, 8)].map((baris, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                {baris.map((t) => (
                  <KartuTempat key={t.game} t={t} boleh={boleh} onPress={() => router.push(`/game/${t.rute}`)} />
                ))}
              </View>
            ))}
            <View style={{ marginTop: 16, backgroundColor: warna.putih, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>👆</Text>
              <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>Ketuk satu tempat untuk bermain.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function KartuTempat({ t, boleh, onPress }: { t: (typeof TEMPAT)[number]; boleh: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t.judul}, ${t.sub}`}
      disabled={!boleh}
      onPress={onPress}
      style={({ pressed }) => ({ width: '48%', alignItems: 'center', gap: 6, transform: [{ scale: pressed ? 0.96 : 1 }] })}
    >
      <GambarTempat game={t.game} lebar={120} />
      <View style={{ backgroundColor: warna.putih, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', alignSelf: 'stretch' }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks, textAlign: 'center' }}>{t.judul}</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>{t.sub}</Text>
      </View>
    </Pressable>
  );
}
