/** D1/O PIN orang tua. Salah 5 kali → terkunci 5 menit. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { PapanPin, TitikPin } from '@/komponen/PapanPin';

export default function PinOrtu() {
  const router = useRouter();
  const { tujuan } = useLocalSearchParams<{ tujuan?: string }>();
  const { repo, bukaOrtu } = useData();
  const [pin, setPin] = useState('');
  const [salah, setSalah] = useState(false);
  const [kunciSampai, setKunciSampai] = useState(0);
  const [kini, setKini] = useState(kiniMs);

  useEffect(() => {
    repo.nilai<{ n: number; sampai: number }>('pin_salah').then((v) => setKunciSampai(v?.sampai ?? 0));
    const t = setInterval(() => setKini(kiniMs()), 1000);
    return () => clearInterval(t);
  }, [repo]);

  const terkunci = kunciSampai > kini;
  const tekan = async (a: string) => {
    if (terkunci) return;
    setSalah(false);
    const p = (pin + a).slice(0, 4);
    setPin(p);
    if (p.length < 4) return;
    if (await repo.periksaPin(p)) {
      await repo.aturNilai('pin_salah', { n: 0, sampai: 0 });
      bukaOrtu();
      router.replace((tujuan as '/ortu') || '/ortu');
      return;
    }
    const v = (await repo.nilai<{ n: number; sampai: number }>('pin_salah')) ?? { n: 0, sampai: 0 };
    const n = v.n + 1;
    const sampai = n >= 5 ? kiniMs() + 5 * 60_000 : 0;
    await repo.aturNilai('pin_salah', { n: n >= 5 ? 0 : n, sampai });
    setKunciSampai(sampai);
    setSalah(true);
    setTimeout(() => setPin(''), 500);
  };

  const sisaDetik = Math.max(0, Math.ceil((kunciSampai - kini) / 1000));
  return (
    <Layar latar={warna.abuTerang}>
      <KepalaLayar judul="Mode orang tua" ortu />
      <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Masukkan PIN orang tua</TeksOrtu>
      <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        <TitikPin panjang={pin.length} salah={salah} />
        {terkunci ? (
          <TeksOrtu style={{ textAlign: 'center', color: '#C0392B' }}>
            Terlalu banyak percobaan. Coba lagi dalam {Math.floor(sisaDetik / 60)}:{String(sisaDetik % 60).padStart(2, '0')}.
          </TeksOrtu>
        ) : salah ? (
          <TeksOrtu style={{ textAlign: 'center', color: '#C0392B' }}>PIN belum tepat.</TeksOrtu>
        ) : null}
      </View>
      <PapanPin onAngka={tekan} onHapus={() => setPin(pin.slice(0, -1))} />
    </Layar>
  );
}
