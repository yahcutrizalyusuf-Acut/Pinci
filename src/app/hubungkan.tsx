/** HP anak: ketik kode 6 angka dari HP orang tua untuk menghubungkan HP ini (mode server). */
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useData } from '@/data/konteks';
import { opsiSupabase } from '@/data/sinkron';
import { masukAnonim, tukarKodeHubung, type Sesimasuk } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import { pesanTukarKode } from '@/fitur/hubungkan';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function HubungkanHp() {
  const router = useRouter();
  const { repo, server, pilihAnak, segarkan } = useData();
  const [kode, setKode] = useState('');
  const [pesan, setPesan] = useState('');
  const [memuat, setMemuat] = useState(false);

  const hubungkan = async () => {
    const o = opsiSupabase();
    if (!server || !o) {
      setPesan('Mode server belum dinyalakan.');
      return;
    }
    setMemuat(true);
    setPesan('');
    try {
      // HP anak masuk tanpa email; hak aksesnya baru ada setelah kode dari orang tua dipakai.
      let sesi = await repo.nilai<Sesimasuk>('sesi_masuk');
      if (!sesi) {
        sesi = await masukAnonim(o).catch(() => null);
        if (!sesi) {
          setPesan('Belum tersambung. Periksa internet. Kalau tetap gagal, minta orang tua memeriksa pengaturan server.');
          return;
        }
        await repo.aturNilai('sesi_masuk', sesi);
      }
      const hasil = await tukarKodeHubung(server, kode, `v${Constants.expoConfig?.version ?? '?'}`);
      if (!hasil.ok) {
        setPesan(pesanTukarKode(hasil.alasan));
        return;
      }
      await repo.pasangKeluargaHpAnak(hasil.keluargaId, hasil.sapaan);
      await repo.tarik();
      const anak = await repo.daftarAnak();
      if (anak.length === 0) {
        setPesan('HP sudah terhubung, tetapi data anak belum sampai. Periksa internet, lalu buka ulang aplikasi.');
        return;
      }
      pilihAnak(anak.length === 1 ? anak[0].id : null);
      await segarkan();
      router.replace(anak.length === 1 ? '/anak' : '/profil');
    } finally {
      setMemuat(false);
    }
  };

  return (
    <Layar gulir latar={warna.abuTerang}>
      <KepalaLayar judul="Hubungkan HP anak" ortu />
      <View style={{ alignItems: 'center' }}>
        <Pinci ekspresi="menyapa" ukuran={110} />
      </View>
      <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Ketik kode dari HP orang tua</TeksOrtu>
      <TeksOrtu style={{ color: warna.teksKedua }}>
        Di HP orang tua: buka Pintar Main, mode orang tua (gembok), lalu Atur, lalu Hubungkan HP anak. Kode berlaku 10 menit. HP ini butuh internet saat menghubungkan.
      </TeksOrtu>
      <TextInput
        value={kode}
        onChangeText={(t) => setKode(t.replace(/\D/g, '').slice(0, 6))}
        placeholder="6 angka"
        keyboardType="number-pad"
        accessibilityLabel="Kode 6 angka dari HP orang tua"
        style={{ height: 64, borderRadius: 14, borderWidth: 1, borderColor: warna.abuGaris, backgroundColor: warna.putih, paddingHorizontal: 14, fontFamily: huruf.judulTebal, fontSize: 32, letterSpacing: 8, textAlign: 'center', color: warna.teks }}
      />
      <Tombol label="Hubungkan" ortu memuat={memuat} nonaktif={kode.length !== 6} onPress={hubungkan} />
      {pesan ? <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: '#C0392B' }}>{pesan}</Text> : null}
    </Layar>
  );
}
