/** A07 Istirahat: muncul setelah blok belajar 15 menit. Tombol siap terbuka setelah 2 menit. */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { selesaiIstirahat } from '@/layanan/penjaga-waktu';
import { BilahKemajuan, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function Istirahat() {
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const [sampai, setSampai] = useState<number | null>(null);
  const [sekarang, setSekarang] = useState(kiniMs);

  useEffect(() => {
    if (!anakAktif) return;
    repo.pemakaian(anakAktif.id).then((p) => setSampai(p.istirahatSampai ? new Date(p.istirahatSampai).getTime() : kiniMs()));
    const t = setInterval(() => setSekarang(kiniMs()), 1000);
    return () => clearInterval(t);
  }, [repo, anakAktif]);

  const sisa = sampai ? Math.max(0, sampai - sekarang) : 120_000;
  const siap = sisa <= 0;
  return (
    <Layar
      bawah={
        <View style={{ padding: 16, gap: 12 }}>
          {!siap ? <BilahKemajuan nilai={120_000 - sisa} maks={120_000} warnaIsi={warna.biruLangit} tinggi={10} /> : null}
          <Tombol
            label="Aku sudah siap lagi"
            besar
            nonaktif={!siap}
            onPress={async () => {
              if (anakAktif) {
                const p = await repo.pemakaian(anakAktif.id);
                await repo.simpanPemakaian(selesaiIstirahat(p, new Date()));
              }
              if (router.canGoBack()) router.back();
              else router.replace('/anak');
            }}
          />
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <View style={{ width: 260, height: 260, borderRadius: 130, backgroundColor: warna.biruMuda, alignItems: 'center', justifyContent: 'center' }}>
          <Pinci ekspresi="minum" penuh ukuran={200} />
        </View>
        <Text style={{ fontFamily: huruf.judul, fontSize: 30, lineHeight: 34, textAlign: 'center', color: warna.teks }}>
          Istirahat 2 menit,{'\n'}minum dulu.
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 17, textAlign: 'center', color: warna.teksKedua }}>
          Regangkan tangan dan kakimu juga, ya.
        </Text>
      </View>
    </Layar>
  );
}
