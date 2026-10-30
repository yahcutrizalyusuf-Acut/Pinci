/**
 * Lompat Batu — tampilan. Pinci menyeberangi sungai: ketuk batu yang tepat, Pinci melompat ke sana.
 * Batu yang belum tepat bergoyang; Pinci tidak pernah jatuh ke air. Tanpa hitung mundur.
 */
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { huruf, warna } from '../../desain/token';
import { Pinci } from '../../komponen/Pinci';
import { soalSekarang } from '../bersama/babak-soal';
import { formatAngka } from '../bersama/jenis';
import { rapikanLevel } from '../bersama/level';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import { useLewatDetik, useSelesaiBabak } from '../bersama/tampilan/kait';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { buatBabak, langkah, ringkasan, type KeadaanLompatBatu } from './logika';

const AIR = '#7CC6EE';

function Batu({ n, goyang, onPilih }: { n: number; goyang: number; onPilih: (n: number) => void }) {
  const [putar] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (goyang === 0) return;
    Animated.sequence([
      Animated.timing(putar, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(putar, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(putar, { toValue: 0.5, duration: 80, useNativeDriver: true }),
      Animated.timing(putar, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [goyang, putar]);
  return (
    <Animated.View style={{ flex: 1, maxWidth: 110, transform: [{ rotate: putar.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] }) }] }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Batu ${n}`} onPress={() => onPilih(n)} style={({ pressed }) => ({ alignItems: 'center', transform: [{ scale: pressed ? 0.94 : 1 }] })}>
        <Svg width="100%" height={70} viewBox="0 0 110 70">
          <Ellipse cx={55} cy={44} rx={52} ry={22} fill="#5C9DBF" opacity={0.5} />
          <Ellipse cx={55} cy={36} rx={50} ry={26} fill="#A7A39A" stroke="#6E6A62" strokeWidth={3} />
          <Path d="M24 30 Q40 22 56 26" stroke="#C9C5BC" strokeWidth={4} fill="none" strokeLinecap="round" />
        </Svg>
        <Text style={{ position: 'absolute', top: 16, fontFamily: huruf.judulTebal, fontSize: 26, color: warna.teks }}>{formatAngka(n)}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function LayarGame({ kelas, level, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar }: PropsLayarGame) {
  const [keadaan, setKeadaan] = useState<KeadaanLompatBatu>(() => buatBabak({ kelas, level: rapikanLevel(level), benih }));
  const [kunciPantul, setKunciPantul] = useState(0);
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const [lompat] = useState(() => new Animated.Value(0));
  const lewat = useLewatDetik();
  useSelesaiBabak(keadaan.fase === 'selesai', () => ringkasan(keadaan), onSelesai);

  const pilih = (nilai: number) => {
    const baru = langkah(keadaan, { jenis: 'jawab', nilai });
    if (baru === keadaan) return;
    setKeadaan(baru);
    if (baru.kejutan) setKunciKejutan((n) => n + 1);
    if (baru.pantul !== null) {
      setKunciPantul((n) => n + 1);
      return;
    }
    bunyiGame(baru.fase === 'selesai' ? 'pesta' : 'plop', bunyi);
    lompat.setValue(0);
    Animated.sequence([
      Animated.timing(lompat, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(lompat, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const s = soalSekarang(keadaan);
  const selesai = keadaan.fase === 'selesai';
  const total = keadaan.soal.length;
  return (
    <BingkaiGame
      judul="Lompat Batu"
      sisaDetik={sisaDetikAwal - lewat}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={selesai ? null : keadaan.petunjuk}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={selesai}
      latarAtas="#9ED98F"
    >
      <View style={{ flex: 1, backgroundColor: AIR }}>
        {/* Seberang sungai */}
        <View style={{ backgroundColor: '#9ED98F', paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.hijauTua }}>Seberang 🌴</Text>
          <View style={{ backgroundColor: warna.putih, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 2 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 15, color: warna.oranyeTua }}>Level {keadaan.level}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }} accessibilityLabel={`Batu ${keadaan.indeks} dari ${total}`}>
            {Array.from({ length: total }, (_, i) => (
              <View key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: i < keadaan.indeks ? warna.hijauTua : '#FFFFFF', opacity: i < keadaan.indeks ? 1 : 0.7 }} />
            ))}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'space-around', padding: 16 }}>
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 14, alignItems: 'center' }}>
            {selesai ? (
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: warna.hijauTua }}>Sampai di seberang!</Text>
            ) : /^\d/.test(s.teks) || /^(KPK|FPB)/.test(s.teks) ? (
              <>
                <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Lompat ke batu hasil dari:</Text>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 36, color: warna.teks }}>{s.teks}</Text>
              </>
            ) : (
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: warna.teks, textAlign: 'center' }}>{s.teks}</Text>
            )}
          </View>

          {!selesai ? (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
              {s.pilihan.map((n) => (
                <Batu key={`${keadaan.indeks}-${n}`} n={n} goyang={n === keadaan.pantul ? kunciPantul : 0} onPilih={pilih} />
              ))}
            </View>
          ) : null}

          <Animated.View
            style={{
              alignItems: 'center',
              transform: [
                { translateY: lompat.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
                { scale: lompat.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
              ],
            }}
          >
            <Pinci ekspresi={selesai ? 'merayakan' : keadaan.pantul !== null ? 'berpikir' : 'semangat'} ukuran={92} />
            <Svg width={120} height={26} viewBox="0 0 120 26" style={{ marginTop: -10 }}>
              <Ellipse cx={60} cy={13} rx={56} ry={11} fill="#A7A39A" stroke="#6E6A62" strokeWidth={2} />
            </Svg>
          </Animated.View>
        </View>
      </View>
    </BingkaiGame>
  );
}
