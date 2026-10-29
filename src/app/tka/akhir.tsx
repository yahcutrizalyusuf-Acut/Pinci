/** Akhir latihan/simulasi TKA: hasil tanpa nilai merah, tersimpan, kembali. */
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import type { Sesi } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { ambilTitipan } from '@/fitur/sementara';
import { Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function AkhirTka() {
  const router = useRouter();
  const h = ambilTitipan<{ sesi: Sesi; judul: string; catatan?: string }>('akhir-tka');
  return (
    <Layar
      bawah={
        <View style={{ padding: 16, gap: 10 }}>
          {h?.sesi.jenis !== 'tka' ? <Tombol label="Lihat pembahasan" varian="garis" onPress={() => router.replace({ pathname: '/tka/pembahasan', params: { sesi: h?.sesi.id ?? '' } })} /> : null}
          <Tombol label="Kembali ke Siap TKA" besar onPress={() => router.replace('/tka')} />
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <Pinci ekspresi="merayakan" ukuran={140} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 34, color: warna.hijauTua }}>Selesai!</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teksKedua, textAlign: 'center' }}>{h?.judul}</Text>
        {h ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 18, alignSelf: 'stretch', gap: 6 }}>
            <Text style={{ fontFamily: huruf.anak, color: warna.teks }}>
              <Text style={{ fontFamily: huruf.judul, fontSize: 40 }}>{h.sesi.benar}</Text>
              <Text style={{ fontSize: 20 }}> dari {h.sesi.jumlah} tepat</Text>
            </Text>
            {h.sesi.jenis !== 'tka' ? <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>Ini persen benar latihan, bukan nilai TKA.</Text> : null}
            {h.catatan ? <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>{h.catatan}</Text> : null}
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Tersimpan ✓</Text>
          </View>
        ) : null}
      </View>
    </Layar>
  );
}
