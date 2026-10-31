/** B01/K22 Gudang Ilmu: peta topik kelas 6 per mapel (belum · belajar · kuasai · segera) sebagai jalan berliku. */
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { petaKemajuan } from '@/fitur/gudang';
import { TEKS_TERKUNCI, useAkses } from '@/fitur/akses';
import { paketGudangKelas } from '@/isi/gudang/paket';
import { petaTopik, type TopikPeta } from '@/isi/gudang/pemuat';
import { GelembungPinci } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';

const JARAK = 150;
const KIRI = 0.3;
const KANAN = 0.72;

function Simpul({ t, lanjut, onPress }: { t: TopikPeta; lanjut: boolean; onPress: () => void }) {
  const ukuran = lanjut ? 92 : 80;
  const gaya =
    t.status === 'kuasai'
      ? { latar: warna.hijauSegar, garis: '#24804A', putus: false }
      : t.status === 'belajar'
        ? { latar: warna.putih, garis: '#3A86FF', putus: false }
        : t.status === 'segera'
          ? { latar: '#E6DDCF', garis: '#E6DDCF', putus: false }
          : { latar: warna.putih, garis: '#9A8F7C', putus: true };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t.judul}. ${t.status === 'kuasai' ? 'Sudah dikuasai' : t.status === 'belajar' ? 'Sedang dipelajari' : t.status === 'segera' ? 'Segera hadir' : 'Belum dibuka'}`}
      disabled={t.status === 'segera'}
      onPress={onPress}
      style={({ pressed }) => ({ alignItems: 'center', width: 150, gap: 4, transform: [{ scale: pressed ? 0.95 : 1 }] })}
    >
      <View
        style={{
          width: ukuran,
          height: ukuran,
          borderRadius: ukuran / 2,
          backgroundColor: gaya.latar,
          borderWidth: lanjut ? 7 : 3,
          borderColor: gaya.garis,
          borderStyle: gaya.putus ? 'dashed' : 'solid',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {t.status === 'kuasai' ? <Ikon nama="centang" ukuran={36} warna="#FFFFFF" /> : t.status === 'segera' ? <Ikon nama="jam" ukuran={30} warna="#8A8060" /> : t.status === 'belajar' ? <Text style={{ fontSize: 30, color: '#3A86FF' }}>◐</Text> : null}
        {t.bersamaOrtu && t.status !== 'segera' ? (
          <View style={{ position: 'absolute', top: -6, right: -6, width: 28, height: 28, borderRadius: 14, backgroundColor: warna.oranye, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Lebih seru bersama Ayah atau Bunda">
            <Ikon nama="dua_orang" ukuran={16} warna={warna.biruTinta} />
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={{ fontFamily: huruf.judulTebal, fontSize: 16, lineHeight: 19, color: t.status === 'segera' ? warna.teksKedua : warna.teks, textAlign: 'center' }}>
        {t.status === 'segera' ? `${t.judul} · segera` : t.judul}
      </Text>
      {lanjut ? <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: '#2A5DB0' }}>Lanjutkan</Text> : null}
    </Pressable>
  );
}

export default function GudangIlmu() {
  const router = useRouter();
  const { anakAktif, keluarga } = useData();
  const anak = anakAktif!;
  const [mapel, setMapel] = useState<'mat' | 'bi'>('mat');
  const [lebar, setLebar] = useState(360);
  const gulir = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const sudahGulir = useRef(false);
  const akses = useAkses();
  const kemajuan = useMuat(async (r) => petaKemajuan(await r.kemajuanTopik(anak.id, 'gudang')), {}, [anak.id]);

  const paket = paketGudangKelas(anak.kelas);
  if (paket && !akses.gudang) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: warna.kremLembut, padding: 16 }} edges={['top', 'left', 'right']}>
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks, marginBottom: 24 }}>Gudang Ilmu</Text>
        <GelembungPinci judul="Gudang Ilmu" teks={`${TEKS_TERKUNCI} Sambil menunggu, ada Lancar Matematika, Baca Ulang, dan game.`} />
      </SafeAreaView>
    );
  }
  if (!paket) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: warna.kremLembut, padding: 16 }} edges={['top', 'left', 'right']}>
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks, marginBottom: 24 }}>Gudang Ilmu</Text>
        <GelembungPinci ekspresi="semangat" judul="Segera hadir!" teks={`Kartu ilmu kelas ${anak.kelas} sedang disiapkan. Sambil menunggu, ada Lancar Matematika dan Bahasa Inggris.`} />
      </SafeAreaView>
    );
  }
  const peta = petaTopik(paket, kemajuan).find((p) => p.kode === mapel)!;
  // Jalan dari bawah ke atas: topik pertama di bawah, seperti desain B01.
  const urut = peta.topik;
  const tinggi = urut.length * JARAK + 120;
  const titik = urut.map((_, i) => ({ x: (i % 2 === 0 ? KIRI : KANAN) * lebar, y: tinggi - 90 - i * JARAK }));
  const jalan = titik.reduce((d, p, i) => (i === 0 ? `M${p.x} ${p.y}` : `${d} C ${titik[i - 1].x} ${p.y + JARAK / 2}, ${p.x} ${titik[i - 1].y - JARAK / 2}, ${p.x} ${p.y}`), '');
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.kremLembut }} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>Gudang Ilmu</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['mat', 'bi'] as const).map((m) => (
            <Pressable
              key={m}
              accessibilityRole="tab"
              accessibilityState={{ selected: mapel === m }}
              onPress={() => setMapel(m)}
              style={{ flex: 1, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: mapel === m ? warnaMapel[m].utama : warna.putih, borderWidth: 2, borderColor: mapel === m ? warnaMapel[m].utama : warnaMapel[m].muda }}
            >
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: mapel === m ? '#FFFFFF' : warnaMapel[m].teks }}>{m === 'mat' ? 'Matematika' : 'B. Indonesia'}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>
          Kuasai {peta.jumlah.kuasai} · Belajar {peta.jumlah.belajar} · Belum {peta.jumlah.belum} · Segera {peta.jumlah.segera} · 👨‍👧 = lebih seru bersama {sapaan}
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ height: tinggi, maxWidth: 480, width: '100%', alignSelf: 'center' }}
        onLayout={(e) => setLebar(Math.min(480, e.nativeEvent.layout.width))}
        ref={gulir}
        onContentSizeChange={() => {
          if (!sudahGulir.current) {
            sudahGulir.current = true;
            gulir.current?.scrollToEnd({ animated: false });
          }
        }}
      >
        <Svg width={lebar} height={tinggi} style={{ position: 'absolute' }}>
          <Path d={jalan} stroke="#EAD9B6" strokeWidth={40} fill="none" strokeLinecap="round" />
          <Path d={jalan} stroke="#FFF6E5" strokeWidth={3} strokeDasharray="8 10" fill="none" strokeLinecap="round" />
        </Svg>
        {urut.map((t, i) => (
          <View key={t.id} style={{ position: 'absolute', left: titik[i].x - 75, top: titik[i].y - 46 }}>
            <Simpul t={t} lanjut={peta.lanjutkan === t.id} onPress={() => router.push(`/gudang/${t.id}`)} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
