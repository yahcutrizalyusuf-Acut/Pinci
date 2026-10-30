/**
 * Kebun Pinci — tampilan. Setiap petak tanah punya satu soal; kaleng air berangka yang tepat
 * membuat tanaman tumbuh. Tanpa skor, tanpa nyawa, tanpa hitung mundur.
 */
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import { Pinci } from '../../komponen/Pinci';
import { soalSekarang } from '../bersama/babak-soal';
import { rapikanLevel } from '../bersama/level';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import { useLewatDetik, useSelesaiBabak } from '../bersama/tampilan/kait';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { PilihanAngka } from '../bersama/tampilan/PilihanAngka';
import { buatBabak, langkah, ringkasan, type KeadaanKebun } from './logika';

function Petak({ tanaman, tumbuh, aktif, besar }: { tanaman: string; tumbuh: boolean; aktif: boolean; besar: boolean }) {
  const [skala] = useState(() => new Animated.Value(tumbuh ? 1 : 0));
  useEffect(() => {
    if (tumbuh) Animated.spring(skala, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
  }, [tumbuh, skala]);
  return (
    <View
      accessibilityLabel={tumbuh ? `Petak berisi ${tanaman}` : aktif ? 'Petak yang sedang disiram' : 'Petak tanah'}
      style={{
        width: besar ? '30%' : '23%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: aktif ? '#B98555' : '#A0703F',
        borderWidth: aktif ? 4 : 2,
        borderColor: aktif ? warna.kuning : '#6B4423',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {tumbuh ? (
        <Animated.Text style={{ fontSize: besar ? 44 : 34, transform: [{ scale: skala }] }}>{tanaman}</Animated.Text>
      ) : (
        <Text style={{ fontSize: aktif ? 26 : 16, opacity: aktif ? 1 : 0.6 }}>{aktif ? '💧' : '🌰'}</Text>
      )}
    </View>
  );
}

export default function LayarGame({ kelas, level, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar }: PropsLayarGame) {
  const [keadaan, setKeadaan] = useState<KeadaanKebun>(() => buatBabak({ kelas, level: rapikanLevel(level), benih }));
  const [kunciPantul, setKunciPantul] = useState(0);
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const lewat = useLewatDetik();
  useSelesaiBabak(keadaan.fase === 'selesai', () => ringkasan(keadaan), onSelesai);

  const pilih = (nilai: number) => {
    const baru = langkah(keadaan, { jenis: 'jawab', nilai });
    if (baru === keadaan) return;
    setKeadaan(baru);
    if (baru.kejutan) setKunciKejutan((n) => n + 1);
    if (baru.pantul !== null) setKunciPantul((n) => n + 1);
    else bunyiGame(baru.fase === 'selesai' ? 'pesta' : 'ting', bunyi);
  };

  const s = soalSekarang(keadaan);
  const selesai = keadaan.fase === 'selesai';
  return (
    <BingkaiGame
      judul="Kebun Pinci"
      sisaDetik={sisaDetikAwal - lewat}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={selesai ? null : keadaan.petunjuk}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={selesai}
      latarAtas="#DDF1D2"
    >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 20, gap: 14, backgroundColor: '#DDF1D2' }}>
        <View style={{ alignSelf: 'center', backgroundColor: warna.putih, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3, marginTop: 6 }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 15, color: warna.oranyeTua }}>Level {keadaan.level}</Text>
        </View>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 14, alignItems: 'center', gap: 4 }}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
            {selesai ? 'Semua tanaman tumbuh!' : `Siram petak ${keadaan.indeks + 1} dari ${keadaan.soal.length} dengan air sebanyak:`}
          </Text>
          {!selesai ? <Text style={{ fontFamily: huruf.judulTebal, fontSize: 40, color: warna.teks }}>{s.teks}</Text> : null}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 10 }}>
          {keadaan.tanaman.map((t, i) => (
            <Petak key={i} tanaman={t} tumbuh={i < keadaan.indeks} aktif={!selesai && i === keadaan.indeks} besar={keadaan.tanaman.length <= 6} />
          ))}
        </View>
        {selesai ? (
          <View style={{ alignItems: 'center' }}>
            <Pinci ekspresi="merayakan" ukuran={110} />
          </View>
        ) : (
          <PilihanAngka pilihan={s.pilihan} pantul={keadaan.pantul} kunciPantul={kunciPantul} onPilih={pilih} hiasan="💧" latar="#E3F2FD" garis="#3A86FF" />
        )}
      </View>
    </BingkaiGame>
  );
}
