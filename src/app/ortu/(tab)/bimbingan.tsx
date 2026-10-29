/** P08 Bimbingan: tanda hijau/kuning/merah beserta alasan, tombol "Mulai Dampingi". */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN, type Anak, type KemajuanTopik } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { FITUR_GURU } from '@/fitur/konfig';
import { namaTopik } from '@/fitur/nama-topik';
import { Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';

type Baris = { anak: Anak; k: KemajuanTopik };

const MAPEL: Record<string, string> = { tka: 'Siap TKA', mat: 'Matematika', bi: 'Bahasa Indonesia', ing: 'Bahasa Inggris', lancar: 'Lancar' };

function KartuTanda({ b, onDampingi }: { b: Baris; onDampingi: () => void }) {
  const merah = b.k.tanda === 'merah';
  return (
    <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: HEWAN[b.anak.hewan].latar, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 26 }}>{HEWAN[b.anak.hewan].emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 18, color: warna.teks }}>{namaTopik(b.k.mapel, b.k.topik)}</Text>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
            {b.anak.nama} · {MAPEL[b.k.mapel] ?? b.k.mapel}
          </Text>
        </View>
        <View style={{ backgroundColor: merah ? '#FDE2E2' : '#FFF3C4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: merah ? '#B03C3C' : '#7A5B00' }}>{merah ? 'Merah' : 'Kuning'}</Text>
        </View>
      </View>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 16, color: warna.teks }}>
        {b.k.alasan}
        {merah ? ' Coba jelaskan dengan cara lain atau benda nyata.' : ' Biasanya terbantu bila dikerjakan bersama.'}
      </Text>
      <Tombol label="Mulai Dampingi" ikon="dua_orang" varian="oranye" ortu style={{ alignSelf: 'flex-start' }} onPress={onDampingi} />
    </View>
  );
}

export default function Bimbingan() {
  const router = useRouter();
  const { daftarAnak, pilihAnak } = useData();
  const daftar = useMuat(
    async (r) => {
      const hasil: Baris[] = [];
      for (const a of daftarAnak) for (const k of await r.kemajuanTopik(a.id)) if (k.tanda !== 'hijau') hasil.push({ anak: a, k });
      return hasil;
    },
    [] as Baris[],
    [daftarAnak.length],
  );
  const kuning = daftar.filter((b) => b.k.tanda === 'kuning');
  const merah = daftar.filter((b) => b.k.tanda === 'merah');
  const dampingi = (b: Baris) => {
    pilihAnak(b.anak.id);
    router.push({ pathname: '/dampingi', params: { mapel: b.k.mapel, topik: b.k.topik } });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 16, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: warna.putih }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24, color: warna.teks }}>Bimbingan</Text>
        {FITUR_GURU ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/ortu/guru')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ikon nama="orang" ukuran={20} warna={warna.hijauTua} />
            <Text style={{ fontFamily: huruf.ortuTebal, color: warna.hijauTua }}>Kelola guru</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        {daftar.length === 0 ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 20, gap: 8 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Semua hijau 🌿</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teksKedua }}>
              Belum ada topik yang perlu dibantu. Tanda kuning muncul bila anak sering belum tepat atau sering memakai petunjuk; tanda merah bila masih sulit setelah beberapa kali.
            </Text>
            <Tombol label="Buka Mode Dampingi" ikon="dua_orang" varian="oranye" ortu style={{ alignSelf: 'flex-start' }} onPress={() => router.push('/dampingi')} />
          </View>
        ) : null}
        {kuning.length ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#F4C542' }} />
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Perlu bimbingan orang tua</Text>
          </View>
        ) : null}
        {kuning.map((b) => (
          <KartuTanda key={b.k.id} b={b} onDampingi={() => dampingi(b)} />
        ))}
        {merah.length ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: warna.koral }} />
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Perlu bimbingan lebih</Text>
          </View>
        ) : null}
        {merah.map((b) => (
          <KartuTanda key={b.k.id} b={b} onDampingi={() => dampingi(b)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
