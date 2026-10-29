/** A2–A3 Masuk orang tua dengan email + kode 6 angka (hanya mode Supabase). */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import { useData } from '@/data/konteks';
import { opsiSupabase } from '@/data/sinkron';
import { daftarkanKeluarga, mintaKodeEmail, verifikasiKode } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';

const gayaIsian = { height: 52, borderRadius: 14, borderWidth: 1, borderColor: warna.abuGaris, backgroundColor: warna.putih, paddingHorizontal: 14, fontFamily: huruf.ortu, fontSize: 17, color: warna.teks } as const;

export default function Masuk() {
  const router = useRouter();
  const { repo, keluarga } = useData();
  const [email, setEmail] = useState('');
  const [kode, setKode] = useState('');
  const [tahap, setTahap] = useState<'email' | 'kode'>('email');
  const [pesan, setPesan] = useState('');
  const [tunggu, setTunggu] = useState(0);
  const [memuat, setMemuat] = useState(false);
  const opsi = opsiSupabase();

  useEffect(() => {
    if (tunggu <= 0) return;
    const t = setTimeout(() => setTunggu(tunggu - 1), 1000);
    return () => clearTimeout(t);
  }, [tunggu]);

  if (!opsi) {
    return (
      <Layar latar={warna.abuTerang}>
        <KepalaLayar judul="Masuk" ortu />
        <TeksOrtu>Mode server belum dinyalakan. Aplikasi berjalan di HP ini saja.</TeksOrtu>
      </Layar>
    );
  }
  const kirim = async () => {
    setMemuat(true);
    setPesan('');
    const ok = await mintaKodeEmail(opsi, email).catch(() => false);
    setMemuat(false);
    if (ok) {
      setTahap('kode');
      setTunggu(60);
    } else setPesan('Kode belum terkirim. Periksa alamat email dan sambungan internet.');
  };
  const periksa = async () => {
    setMemuat(true);
    const sesi = await verifikasiKode(opsi, email, kode).catch(() => null);
    if (!sesi) {
      setMemuat(false);
      setPesan('Kode belum tepat atau sudah lewat 10 menit.');
      return;
    }
    await repo.aturNilai('sesi_masuk', sesi);
    if (keluarga) await daftarkanKeluarga(opsi, sesi, keluarga).catch(() => false);
    setMemuat(false);
    router.replace(keluarga ? '/ortu' : '/daftar/pin');
  };
  return (
    <Layar latar={warna.abuTerang} gulir>
      <KepalaLayar judul="Masuk orang tua" ortu />
      {tahap === 'email' ? (
        <View style={{ gap: 12 }}>
          <TeksOrtu>Masukkan alamat email. Kami kirim kode 6 angka.</TeksOrtu>
          <TextInput value={email} onChangeText={setEmail} placeholder="nama@contoh.com" keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Alamat email" style={gayaIsian} />
          <Tombol label="Kirim kode" ortu memuat={memuat} nonaktif={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())} onPress={kirim} />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <TeksOrtu>Kode sudah dikirim ke {email}. Periksa juga folder Spam atau Promosi.</TeksOrtu>
          <TextInput value={kode} onChangeText={(t) => setKode(t.replace(/\D/g, '').slice(0, 6))} placeholder="6 angka" keyboardType="number-pad" accessibilityLabel="Kode 6 angka" style={[gayaIsian, { letterSpacing: 6, fontSize: 24 }]} />
          <Tombol label="Masuk" ortu memuat={memuat} nonaktif={kode.length !== 6} onPress={periksa} />
          <Tombol label={tunggu > 0 ? `Kirim ulang (${tunggu})` : 'Kirim ulang kode'} varian="garis" ortu nonaktif={tunggu > 0} onPress={kirim} />
        </View>
      )}
      {pesan ? <TeksOrtu style={{ color: '#C0392B' }}>{pesan}</TeksOrtu> : null}
    </Layar>
  );
}
