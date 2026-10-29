/** Ganti PIN orang tua. */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, TeksOrtu } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { PapanPin, TitikPin } from '@/komponen/PapanPin';

export default function GantiPin() {
  const router = useRouter();
  const { repo } = useData();
  const [tahap, setTahap] = useState<'lama' | 'baru' | 'ulang'>('lama');
  const [pin, setPin] = useState('');
  const [baru, setBaru] = useState('');
  const [salah, setSalah] = useState(false);
  const judul = { lama: 'Masukkan PIN lama', baru: 'PIN baru (4 angka)', ulang: 'Ulangi PIN baru' }[tahap];
  const tekan = async (a: string) => {
    setSalah(false);
    const p = (pin + a).slice(0, 4);
    setPin(p);
    if (p.length < 4) return;
    setTimeout(() => setPin(''), 200);
    if (tahap === 'lama') {
      const v = (await repo.nilai<{ n: number; sampai: number }>('pin_salah')) ?? { n: 0, sampai: 0 };
      if (v.sampai > kiniMs()) {
        setSalah(true);
        return;
      }
      if (await repo.periksaPin(p)) {
        await repo.aturNilai('pin_salah', { n: 0, sampai: 0 });
        setTahap('baru');
      } else {
        const n = v.n + 1;
        await repo.aturNilai('pin_salah', { n: n >= 5 ? 0 : n, sampai: n >= 5 ? kiniMs() + 5 * 60_000 : 0 });
        setSalah(true);
      }
    } else if (tahap === 'baru') {
      setBaru(p);
      setTahap('ulang');
    } else if (p === baru) {
      await repo.gantiPin(p);
      router.back();
    } else {
      setSalah(true);
      setTahap('baru');
    }
  };
  return (
    <Layar latar={warna.abuTerang}>
      <KepalaLayar judul="Ganti PIN" ortu />
      <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>{judul}</TeksOrtu>
      <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        <TitikPin panjang={pin.length} salah={salah} />
        {salah ? <TeksOrtu style={{ textAlign: 'center', color: '#C0392B' }}>Belum tepat, coba lagi.</TeksOrtu> : null}
      </View>
      <PapanPin onAngka={tekan} onHapus={() => setPin(pin.slice(0, -1))} />
    </Layar>
  );
}
