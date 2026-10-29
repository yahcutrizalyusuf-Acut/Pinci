/** Membuat keluarga di HP dan PIN orang tua 4 angka (A7 rancangan, mode lokal). */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { PapanPin, TitikPin } from '@/komponen/PapanPin';

const SAPAAN = ['Ayah', 'Bunda', 'Ibu', 'Bapak'];

export default function BuatPin() {
  const router = useRouter();
  const { dari } = useLocalSearchParams<{ dari?: string }>();
  const { repo, bukaOrtu } = useData();
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [tahap, setTahap] = useState<1 | 2>(1);
  const [salah, setSalah] = useState(false);
  const [sapaan, setSapaan] = useState('Ayah');

  const tekan = async (a: string) => {
    setSalah(false);
    if (tahap === 1) {
      const p = (pin1 + a).slice(0, 4);
      setPin1(p);
      if (p.length === 4) setTimeout(() => setTahap(2), 150);
    } else {
      const p = (pin2 + a).slice(0, 4);
      setPin2(p);
      if (p.length === 4) {
        if (p !== pin1) {
          setSalah(true);
          setTimeout(() => setPin2(''), 600);
          return;
        }
        await repo.buatKeluarga(p, sapaan);
        bukaOrtu();
        router.replace('/daftar/anak');
      }
    }
  };
  const hapus = () => (tahap === 1 ? setPin1(pin1.slice(0, -1)) : setPin2(pin2.slice(0, -1)));

  return (
    <Layar latar={warna.abuTerang}>
      <KepalaLayar judul="PIN orang tua" ortu />
      {dari === 'anak' ? (
        <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 14, padding: 12 }}>
          <TeksOrtu>Minta Ayah atau Bunda menyiapkan HP ini dulu. Setelah itu kamu bisa langsung belajar.</TeksOrtu>
        </View>
      ) : null}
      <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>
        {tahap === 1 ? 'Buat PIN 4 angka' : 'Ulangi PIN'}
      </TeksOrtu>
      <TeksOrtu style={{ color: warna.teksKedua }}>
        PIN ini mengunci mode orang tua, supaya anak tidak masuk ke pengaturan. Data keluarga disimpan di HP ini.
      </TeksOrtu>
      {tahap === 1 ? (
        <View style={{ gap: 8 }}>
          <TeksOrtu style={{ fontFamily: huruf.ortuSedang }}>Anak memanggil Anda:</TeksOrtu>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {SAPAAN.map((s) => (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityState={{ selected: sapaan === s }}
                onPress={() => setSapaan(s)}
                style={{
                  paddingHorizontal: 16,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  backgroundColor: sapaan === s ? warna.hijauPil : warna.putih,
                  borderWidth: 1,
                  borderColor: sapaan === s ? warna.hijauDaun : warna.abuGaris,
                }}
              >
                <Text style={{ fontFamily: huruf.ortuSedang, color: sapaan === s ? warna.hijauTua : warna.teks }}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        <TitikPin panjang={tahap === 1 ? pin1.length : pin2.length} salah={salah} />
        {salah ? (
          <TeksOrtu style={{ textAlign: 'center', color: '#C0392B' }}>PIN tidak sama. Coba ulangi.</TeksOrtu>
        ) : null}
      </View>
      <PapanPin onAngka={tekan} onHapus={hapus} />
    </Layar>
  );
}
