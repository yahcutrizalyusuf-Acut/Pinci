/** Atur: anak dan profil, pengaturan waktu, PIN, data keluarga. */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { modeData } from '@/data/sinkron';
import { huruf, warna } from '@/desain/token';
import { FITUR_GURU, TKA_BUKA } from '@/fitur/konfig';
import { Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';

function Baris({ judul, sub, onPress }: { judul: string; sub?: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, backgroundColor: pressed ? warna.abuTerang : warna.putih })}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>{judul}</Text>
        {sub ? <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>{sub}</Text> : null}
      </View>
      <Ikon nama="kanan" ukuran={20} warna={warna.teksRedup} />
    </Pressable>
  );
}

function Kelompok({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warna.teksKedua, marginLeft: 4 }}>{judul}</Text>
      <View style={{ backgroundColor: warna.putih, borderRadius: 16, overflow: 'hidden' }}>{children}</View>
    </View>
  );
}

function konfirmasi(judul: string, pesan: string, ya: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${judul}\n\n${pesan}`)) ya();
    return;
  }
  Alert.alert(judul, pesan, [
    { text: 'Batal', style: 'cancel' },
    { text: 'Ya', style: 'destructive', onPress: ya },
  ]);
}

export default function Atur() {
  const router = useRouter();
  const { repo, daftarAnak, kunciOrtu } = useData();
  const [disalin, setDisalin] = useState('');
  const antre = useMuat(async (r) => (await r.antreanBelumTerkirim()).length, 0);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 16, height: 56, justifyContent: 'center', backgroundColor: warna.putih }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24, color: warna.teks }}>Atur</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <Kelompok judul="ANAK DAN WAKTU">
          {daftarAnak.map((a) => (
            <Baris key={a.id} judul={`${HEWAN[a.hewan].emoji}  ${a.nama} · Kelas ${a.kelas}`} sub="Pengaturan waktu, profil" onPress={() => router.push(`/ortu/waktu/${a.id}`)} />
          ))}
          <Baris judul="Tambah anak" onPress={() => router.push('/daftar/anak')} />
        </Kelompok>
        <Kelompok judul="BANTUAN">
          <Baris judul="Mode Dampingi" sub="Latihan bersama anak" onPress={() => router.push('/dampingi')} />
          <Baris judul="Ganti PIN orang tua" onPress={() => router.push('/ortu/ganti-pin')} />
          {FITUR_GURU ? <Baris judul="Kelola guru" onPress={() => router.push('/ortu/guru')} /> : null}
          <Baris judul="Catatan pengembang" sub="Ringkasan pemakaian, bisa disalin" onPress={() => router.push('/ortu/catatan')} />
        </Kelompok>
        <Kelompok judul="DATA">
          <View style={{ padding: 16, gap: 4 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16 }}>Penyimpanan: {modeData() === 'lokal' ? 'di HP ini saja' : 'HP + server Singapura'}</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
              {modeData() === 'lokal'
                ? 'Data anak tidak dikirim ke mana pun. Kalau aplikasi dihapus, data ikut terhapus.'
                : `${antre} catatan menunggu dikirim.`}
            </Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksRedup }}>Isi TKA dibuka: {TKA_BUKA === 'mati' ? 'sekarang (uji)' : TKA_BUKA}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              konfirmasi('Hapus semua data?', 'Semua profil anak, hasil latihan, dan pesan di HP ini akan dihapus. Tindakan ini tidak bisa dibatalkan.', async () => {
                await repo.hapusSemua();
                kunciOrtu();
                router.replace('/selamat-datang');
              })
            }
            style={{ padding: 16, borderTopWidth: 1, borderTopColor: warna.abuGaris }}
          >
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: '#C0392B' }}>Hapus semua data keluarga</Text>
          </Pressable>
        </Kelompok>
        {disalin ? <Text style={{ fontFamily: huruf.ortu, color: warna.hijauTua }}>{disalin}</Text> : null}
        <Tombol
          label="Selesai, serahkan ke anak"
          ortu
          onPress={() => {
            setDisalin('');
            kunciOrtu();
            router.replace('/profil');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
