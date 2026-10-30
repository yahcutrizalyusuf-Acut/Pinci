/** G07 Akhir babak: hal yang dikerjakan (tanpa skor), "Main lagi" / "Ganti game". */
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { huruf, warna } from '@/desain/token';
import { ambilTitipan } from '@/fitur/sementara';
import { JUMLAH_LEVEL, tingkatDariLevel, type Level } from '@/game/bersama/level';
import type { RingkasanBabak } from '@/game/bersama/ringkasan';
import { Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export default function AkhirBabak() {
  const router = useRouter();
  const t = ambilTitipan<{ r: RingkasanBabak; rute: string; bolehLagi: boolean }>('akhir-babak');
  const level = t?.r.level as Level | undefined;
  const main = (l?: Level) =>
    router.replace({ pathname: '/game/main', params: l ? { nama: t!.rute, tingkat: tingkatDariLevel(l), level: String(l) } : { nama: t!.rute, tingkat: t!.r.tingkat } });
  return (
    <Layar
      latar="#CFEBDC"
      bawah={
        <View style={{ padding: 16, gap: 10 }}>
          {t?.bolehLagi && level && level < JUMLAH_LEVEL ? <Tombol label={`Lanjut ke Level ${level + 1}`} besar onPress={() => main((level + 1) as Level)} /> : null}
          {t?.bolehLagi ? <Tombol label={level ? `Main lagi Level ${level}` : 'Main lagi'} besar={!level || level >= JUMLAH_LEVEL} varian={level && level < JUMLAH_LEVEL ? 'putih' : undefined} ikon="putar" onPress={() => main(level)} /> : null}
          <Tombol label={t?.bolehLagi ? 'Ganti game' : 'Selesai'} varian="putih" besar onPress={() => router.replace(t?.bolehLagi ? '/anak/main' : '/game/habis')} />
        </View>
      }
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Pinci ekspresi="merayakan" ukuran={150} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 36, color: warna.hijauTua }}>{t?.r.judul ?? 'Hore, selesai!'}</Text>
        {level ? (
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.oranyeTua }}>
            ⭐ Level {level} selesai{level < JUMLAH_LEVEL ? ` · Level ${level + 1} terbuka` : ''}
          </Text>
        ) : null}
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks, textAlign: 'center' }}>{t?.r.kalimat ?? 'Seru sekali tadi.'}</Text>
        {t?.r.halDikerjakan.length ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 8, alignSelf: 'stretch' }}>
            {t.r.halDikerjakan.map((h) => (
              <View key={h} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ikon nama="bintang" ukuran={22} warna={warna.oranye} isi />
                <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>{h}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Layar>
  );
}
