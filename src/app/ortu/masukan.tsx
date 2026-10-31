/** Kirim masukan (orang tua): masalah, saran, atau pujian. Tersimpan di HP dulu, terkirim saat ada sinyal. */
import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import type { Masukan } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';

const JENIS: { kode: Masukan['jenis']; label: string; contoh: string }[] = [
  { kode: 'masalah', label: 'Ada masalah', contoh: 'Contoh: suara tidak keluar di layar Baca Ulang.' },
  { kode: 'saran', label: 'Saran', contoh: 'Contoh: tolong tambah soal cerita untuk kelas 3.' },
  { kode: 'pujian', label: 'Pujian', contoh: 'Contoh: anak saya jadi rajin latihan setiap sore.' },
];

export default function KirimMasukan() {
  const { repo, keluarga } = useData();
  const [jenis, setJenis] = useState<Masukan['jenis']>('saran');
  const [isi, setIsi] = useState('');
  const [terkirim, setTerkirim] = useState(false);
  const riwayat = useMuat(async (r) => (await r.daftarMasukan()).slice(0, 5), []);
  const kirim = async () => {
    await repo.kirimMasukan(jenis, isi, Constants.expoConfig?.version);
    setIsi('');
    setTerkirim(true);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Kirim masukan" ortu />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <TeksOrtu style={{ color: warna.teksKedua }}>Masukan Anda dibaca tim Pintar Main. Jangan tulis nomor HP atau alamat di sini.</TeksOrtu>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {JENIS.map((j) => (
            <Pressable
              key={j.kode}
              accessibilityRole="radio"
              accessibilityState={{ selected: jenis === j.kode }}
              onPress={() => setJenis(j.kode)}
              style={{ paddingHorizontal: 14, height: 40, borderRadius: 20, justifyContent: 'center', borderWidth: 1, borderColor: jenis === j.kode ? warna.hijauTua : warna.abuGaris, backgroundColor: jenis === j.kode ? warna.hijauTua : warna.putih }}
            >
              <Text style={{ fontFamily: huruf.ortuSedang, color: jenis === j.kode ? warna.putih : warna.teks }}>{j.label}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={isi}
          onChangeText={(t) => {
            setTerkirim(false);
            setIsi(t.slice(0, 1000));
          }}
          multiline
          accessibilityLabel="Isi masukan"
          placeholder={JENIS.find((j) => j.kode === jenis)?.contoh}
          placeholderTextColor={warna.teksRedup}
          style={{ minHeight: 140, borderRadius: 14, borderWidth: 1, borderColor: warna.abuGaris, backgroundColor: warna.putih, padding: 12, fontFamily: huruf.ortu, fontSize: 16, color: warna.teks, textAlignVertical: 'top' }}
        />
        <Tombol label="Kirim" ortu nonaktif={isi.trim().length < 3} onPress={kirim} />
        {terkirim ? (
          <TeksOrtu style={{ color: warna.hijauTua }}>
            Terima kasih, {keluarga?.sapaanOrtu ?? 'Ayah'}. Masukan tersimpan dan terkirim saat HP tersambung internet.
          </TeksOrtu>
        ) : null}
        {riwayat.length ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 8 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.teks }}>Masukan terakhir</Text>
            {riwayat.map((m) => (
              <Text key={m.id} style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
                {new Date(m.waktu).toLocaleDateString('id-ID')} · {JENIS.find((j) => j.kode === m.jenis)?.label}: {m.isi}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
