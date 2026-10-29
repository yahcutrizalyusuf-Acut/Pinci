/**
 * P09 Kelola guru (R3). Dibangun tetapi disembunyikan lewat saklar EXPO_PUBLIC_FITUR_GURU.
 * Mode lokal belum bisa mengirim undangan (butuh server); daftar disimpan di HP.
 */
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { FITUR_GURU } from '@/fitur/konfig';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';

interface Guru {
  email: string;
  jenis: 'sekolah' | 'les';
  status: 'menunggu' | 'diizinkan' | 'dicabut';
}

export default function KelolaGuru() {
  const { repo } = useData();
  const [email, setEmail] = useState('');
  const [jenis, setJenis] = useState<Guru['jenis']>('sekolah');
  const daftar = useMuat(async (r) => (await r.nilai<Guru[]>('guru')) ?? [], [] as Guru[]);
  const simpan = (d: Guru[]) => repo.aturNilai('guru', d);
  if (!FITUR_GURU) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <KepalaLayar judul="Kelola guru" ortu />
        <TeksOrtu>Fitur ini dibuka di Rilis 3.</TeksOrtu>
      </SafeAreaView>
    );
  }
  const emailSah = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Kelola guru" ortu />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 12 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Undang guru</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email guru"
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email guru"
            style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: warna.abuGaris, paddingHorizontal: 14, fontFamily: huruf.ortu, fontSize: 16 }}
          />
          <Text style={{ fontFamily: huruf.ortuSedang }}>Jenis akses</Text>
          {(
            [
              ['sekolah', 'Guru sekolah', 'Bisa melihat rapor dan memberi komentar'],
              ['les', 'Guru les', 'Bisa memberi tugas dan catatan'],
            ] as const
          ).map(([k, j, d]) => (
            <Pressable
              key={k}
              accessibilityRole="radio"
              accessibilityState={{ checked: jenis === k }}
              onPress={() => setJenis(k)}
              style={{ padding: 12, borderRadius: 14, borderWidth: 2, borderColor: jenis === k ? warna.hijauDaun : warna.abuGaris, backgroundColor: jenis === k ? warna.hijauMuda : warna.putih }}
            >
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16 }}>{j}</Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>{d}</Text>
            </Pressable>
          ))}
          <Tombol
            label="Kirim undangan"
            ortu
            nonaktif={!emailSah}
            onPress={async () => {
              await simpan([...daftar, { email: email.trim().toLowerCase(), jenis, status: 'menunggu' }]);
              setEmail('');
            }}
          />
          <TeksOrtu style={{ fontSize: 13, color: warna.teksKedua }}>Undangan baru terkirim setelah aplikasi tersambung ke server (mode Supabase).</TeksOrtu>
        </View>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Guru yang terhubung</Text>
        {daftar.map((g, i) => (
          <View key={g.email} style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 8 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16 }}>{g.email}</Text>
            <Text style={{ fontFamily: huruf.ortu, color: warna.teksKedua }}>
              {g.jenis === 'sekolah' ? 'Guru sekolah' : 'Guru les'} · {g.status === 'diizinkan' ? 'Diizinkan' : g.status === 'menunggu' ? 'Menunggu' : 'Dicabut'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Tombol label="Izinkan" ortu varian="utama" onPress={() => simpan(daftar.map((x, k) => (k === i ? { ...x, status: 'diizinkan' } : x)))} />
              <Tombol label="Cabut" ortu varian="garis" onPress={() => simpan(daftar.map((x, k) => (k === i ? { ...x, status: 'dicabut' } : x)))} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
