/**
 * Bingkai semua game: kepala (kembali, judul, matahari waktu), langit yang menjadi senja di 2 menit terakhir,
 * gelembung petunjuk Pinci, kejutan lucu, dan pesta kecil.
 */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { huruf, warna } from '../../../desain/token';
import { Ikon } from '../../../komponen/Ikon';
import { Pinci } from '../../../komponen/Pinci';
import type { Kejutan } from '../kejutan';
import { suasanaLangit } from '../waktu';
import { KejutanLucu } from './KejutanLucu';
import { MatahariWaktu } from './MatahariWaktu';
import { PestaKecil } from './PestaKecil';

const LANGIT = { siang: '#CFEBDC', senja: '#F8D9B8', malam: '#2E3558' } as const;

export function BingkaiGame({
  judul,
  sisaDetik,
  totalDetik,
  onKeluar,
  petunjuk,
  kejutan = null,
  kunciKejutan = 0,
  pesta = false,
  latarAtas,
  children,
}: {
  judul: string;
  sisaDetik: number;
  totalDetik: number;
  onKeluar: () => void;
  /** teks petunjuk Pinci (muncul setelah 2 kali belum tepat) */
  petunjuk?: string | null;
  kejutan?: Kejutan | null;
  kunciKejutan?: number;
  pesta?: boolean;
  /** warna latar bagian atas bila game punya pemandangan sendiri */
  latarAtas?: string;
  children: ReactNode;
}) {
  const suasana = Number.isFinite(sisaDetik) ? suasanaLangit(sisaDetik) : 'siang';
  const langit = latarAtas && suasana === 'siang' ? latarAtas : LANGIT[suasana === 'malam' ? 'senja' : suasana];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: langit }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, height: 64, gap: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={onKeluar}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: warna.putih, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ikon nama="kiri" ukuran={24} />
          </Pressable>
          <Text numberOfLines={1} style={{ flex: 1, fontFamily: huruf.judul, fontSize: 24, color: warna.teks }}>
            {judul}
          </Text>
          <MatahariWaktu sisaDetik={sisaDetik} totalDetik={totalDetik} />
        </View>
        <View style={{ flex: 1 }}>{children}</View>
        {petunjuk ? (
          <View pointerEvents="none" style={{ position: 'absolute', left: 12, right: 12, bottom: 92, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <Pinci ekspresi="berpikir" ukuran={64} tenang />
            <View style={{ flex: 1, backgroundColor: warna.putih, borderRadius: 18, borderBottomLeftRadius: 6, padding: 12, borderWidth: 2, borderColor: '#BFE3F7' }}>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>{petunjuk}</Text>
            </View>
          </View>
        ) : null}
        <KejutanLucu kejutan={kejutan} kunci={kunciKejutan} />
        <PestaKecil tampil={pesta} />
      </View>
    </SafeAreaView>
  );
}
