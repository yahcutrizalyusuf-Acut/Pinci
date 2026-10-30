/**
 * Balap Perahu — tampilan. Jawaban tepat membuat perahu Pinci maju satu kayuhan.
 * Perahu Rangkong berlayar santai dan sampai bersama di akhir. Tidak ada yang kalah, tanpa hitung mundur.
 */
import { useEffect, useState } from 'react';
import { Animated, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { huruf, warna } from '../../desain/token';
import { Pinci } from '../../komponen/Pinci';
import { soalSekarang } from '../bersama/babak-soal';
import { rapikanLevel } from '../bersama/level';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import { useLewatDetik, useSelesaiBabak } from '../bersama/tampilan/kait';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { PilihanAngka } from '../bersama/tampilan/PilihanAngka';
import { buatBabak, langkah, posisiPinci, posisiTeman, ringkasan, type KeadaanPerahu } from './logika';

const LEBAR_PERAHU = 84;

function Perahu({ warnaBadan, children }: { warnaBadan: string; children: React.ReactNode }) {
  return (
    <View style={{ width: LEBAR_PERAHU, alignItems: 'center' }}>
      <View style={{ height: 44, justifyContent: 'flex-end' }}>{children}</View>
      <Svg width={LEBAR_PERAHU} height={28} viewBox="0 0 84 28">
        <Path d="M2 4 H82 L70 26 H14 Z" fill={warnaBadan} stroke="#5B3A1E" strokeWidth={3} strokeLinejoin="round" />
        <Rect x={10} y={8} width={64} height={4} rx={2} fill="#FFFFFF" opacity={0.6} />
      </Svg>
    </View>
  );
}

function Lajur({ posisi, lebar, children }: { posisi: number; lebar: number; children: React.ReactNode }) {
  const [x] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(x, { toValue: Math.max(0, (lebar - LEBAR_PERAHU) * posisi), duration: 600, useNativeDriver: true }).start();
  }, [posisi, lebar, x]);
  return (
    <View style={{ height: 86, justifyContent: 'flex-end', borderBottomWidth: 2, borderColor: '#FFFFFF66', borderStyle: 'dashed' }}>
      <Animated.View style={{ transform: [{ translateX: x }] }}>{children}</Animated.View>
    </View>
  );
}

export default function LayarGame({ kelas, level, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar }: PropsLayarGame) {
  const [keadaan, setKeadaan] = useState<KeadaanPerahu>(() => buatBabak({ kelas, level: rapikanLevel(level), benih }));
  const [kunciPantul, setKunciPantul] = useState(0);
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const [lebar, setLebar] = useState(0);
  const lewat = useLewatDetik();
  useSelesaiBabak(keadaan.fase === 'selesai', () => ringkasan(keadaan), onSelesai);

  const pilih = (nilai: number) => {
    const baru = langkah(keadaan, { jenis: 'jawab', nilai });
    if (baru === keadaan) return;
    setKeadaan(baru);
    if (baru.kejutan) setKunciKejutan((n) => n + 1);
    if (baru.pantul !== null) setKunciPantul((n) => n + 1);
    else bunyiGame(baru.fase === 'selesai' ? 'pesta' : 'plop', bunyi);
  };

  const s = soalSekarang(keadaan);
  const selesai = keadaan.fase === 'selesai';
  return (
    <BingkaiGame
      judul="Balap Perahu"
      sisaDetik={sisaDetikAwal - lewat}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={selesai ? null : keadaan.petunjuk}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={selesai}
      latarAtas="#BFE6F5"
    >
      <View style={{ flex: 1, backgroundColor: '#BFE6F5', paddingBottom: 20, gap: 12 }}>
        <View style={{ alignSelf: 'center', backgroundColor: warna.putih, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3, marginTop: 6 }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 15, color: warna.oranyeTua }}>Level {keadaan.level}</Text>
        </View>
        <View style={{ marginHorizontal: 16, backgroundColor: '#4EA8DE', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 6 }} onLayout={(e: LayoutChangeEvent) => setLebar(e.nativeEvent.layout.width - 16)}>
          <View style={{ position: 'absolute', right: 10, top: 6, bottom: 6, width: 8, backgroundColor: '#FFFFFF', borderRadius: 4 }} accessibilityLabel="Garis akhir" />
          <Lajur posisi={posisiTeman(keadaan)} lebar={lebar}>
            <Perahu warnaBadan="#E9A23B">
              <Text style={{ fontSize: 34 }}>🦜</Text>
            </Perahu>
          </Lajur>
          <Lajur posisi={posisiPinci(keadaan)} lebar={lebar}>
            <Perahu warnaBadan="#C8553D">
              <Pinci ekspresi={selesai ? 'merayakan' : 'semangat'} ukuran={48} tenang />
            </Perahu>
          </Lajur>
        </View>
        <Text style={{ textAlign: 'center', fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>
          {selesai ? 'Sampai bersama Rangkong!' : `Kayuhan ${keadaan.indeks + 1} dari ${keadaan.soal.length}`}
        </Text>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16, gap: 14 }}>
          {selesai ? (
            <View style={{ alignItems: 'center' }}>
              <Pinci ekspresi="merayakan" ukuran={120} />
            </View>
          ) : (
            <>
              <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 14, alignItems: 'center' }}>
                <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Jawab untuk mendayung:</Text>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 38, color: warna.teks }}>{s.teks}</Text>
              </View>
              <PilihanAngka pilihan={s.pilihan} pantul={keadaan.pantul} kunciPantul={kunciPantul} onPilih={pilih} hiasan="🛶" garis={warna.biruLangit} />
            </>
          )}
        </View>
      </View>
    </BingkaiGame>
  );
}
