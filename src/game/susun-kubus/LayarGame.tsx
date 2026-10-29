/**
 * G05 Susun Kubus — tampilan.
 * Anak menyusun kubus kayu di petak supaya sama seperti kartu tampak depan (dan samping/atas).
 * Tanpa skor, tanpa nyawa, tanpa hitung mundur. Kubus yang melampaui kartu memantul kembali lembut.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent, type LayoutRectangle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { huruf, warna } from '../../desain/token';
import { Ikon } from '../../komponen/Ikon';
import { Pinci } from '../../komponen/Pinci';
import { bolehSeret } from '../bersama/jenis';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { batasTinggi, buatBabak, langkah, ringkasan, tekaTekiSekarang, type AksiSusunKubus, type KeadaanSusunKubus } from './logika';
import { buatGeometri, petakDiTitik, RASIO_DX, RASIO_DY, type Geometri } from './tampilan/geometri';
import { KartuTarget } from './tampilan/KartuTarget';
import { GambarKubus, KAYU } from './tampilan/Kubus';
import { Panggung, type PenandaKubus } from './tampilan/Panggung';

/** Jeda setelah teka-teki cocok sebelum teka-teki berikutnya (ting + Pinci senang). */
const JEDA_LANJUT_MS = 1200;
/** Pesta kecil ≤ 1,5 detik. */
const JEDA_PESTA_MS = 1400;

/** Geometri untuk satu kubus lepas (di rak atau sedang diseret). */
function geometriSatu(s: number): Geometri {
  const dx = s * RASIO_DX;
  const dy = s * RASIO_DY;
  return { s, dx, dy, ox: 2, oy: s + dy + 2, tebal: 0, baris: 1, kolom: 1 };
}

function KubusLepas({ s }: { s: number }) {
  const g = geometriSatu(s);
  return (
    <Svg width={s + g.dx + 4} height={s + g.dy + 4}>
      <GambarKubus g={g} b={0} k={0} z={0} />
    </Svg>
  );
}

export default function LayarGame({ kelas, tingkat, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar }: PropsLayarGame) {
  const [keadaan, setKeadaan] = useState<KeadaanSusunKubus>(() => buatBabak({ kelas, tingkat, benih }));
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const [jatuh, setJatuh] = useState<PenandaKubus | null>(null);
  const [pantul, setPantul] = useState<PenandaKubus | null>(null);
  const [lewatDetik, setLewatDetik] = useState(0);
  const [tataPanggung, setTataPanggung] = useState<LayoutRectangle | null>(null);
  const [tataBawah, setTataBawah] = useState<LayoutRectangle | null>(null);
  const [tataRak, setTataRak] = useState<LayoutRectangle | null>(null);

  const onSelesaiRef = useRef(onSelesai);
  useEffect(() => {
    onSelesaiRef.current = onSelesai;
  }, [onSelesai]);

  // Matahari waktu bergerak pelan (tanpa hitung mundur di layar).
  useEffect(() => {
    const mulai = Date.now();
    const id = setInterval(() => setLewatDetik(Math.floor((Date.now() - mulai) / 1000)), 5000);
    return () => clearInterval(id);
  }, []);

  const jalankan = useCallback(
    (aksi: AksiSusunKubus) => {
      const kini = keadaan;
      const baru = langkah(kini, aksi);
      if (baru === kini) return;
      setKeadaan(baru);
      if (baru.kejutan) setKunciKejutan((n) => n + 1);
      if (aksi.jenis === 'tambah') {
        // perkiraanDetik selalu bertambah tiap langkah, jadi aman sebagai kunci gerak.
        const kunci = baru.perkiraanDetik;
        if (baru.catatan.kubusDitaruh > kini.catatan.kubusDitaruh) {
          setJatuh({ b: aksi.baris, k: aksi.kolom, z: baru.petak[aksi.baris][aksi.kolom] - 1, kunci });
          bunyiGame('plop', bunyi);
        } else if (baru.pantul) {
          setPantul({ b: aksi.baris, k: aksi.kolom, z: kini.petak[aksi.baris][aksi.kolom], kunci });
        }
      }
      if (baru.fase === 'cocok' && kini.fase !== 'cocok') bunyiGame('ting', bunyi);
      if (baru.fase === 'selesai' && kini.fase !== 'selesai') bunyiGame('pesta', bunyi);
    },
    [keadaan, bunyi],
  );

  // Cocok → sebentar bergembira → teka-teki berikutnya.
  useEffect(() => {
    if (keadaan.fase !== 'cocok') return;
    const id = setTimeout(() => jalankan({ jenis: 'lanjut' }), JEDA_LANJUT_MS);
    return () => clearTimeout(id);
  }, [keadaan.fase, keadaan.indeks, jalankan]);

  // Babak selesai → pesta kecil → layar akhir babak.
  useEffect(() => {
    if (keadaan.fase !== 'selesai') return;
    const hasil = ringkasan(keadaan);
    const id = setTimeout(() => onSelesaiRef.current(hasil), JEDA_PESTA_MS);
    return () => clearTimeout(id);
  }, [keadaan]);

  const teka = tekaTekiSekarang(keadaan);
  const g = useMemo(
    () => (tataPanggung && tataPanggung.width > 0 ? buatGeometri(tataPanggung.width, tataPanggung.height, teka.baris, teka.kolom, teka.tinggiMaks) : null),
    [tataPanggung, teka.baris, teka.kolom, teka.tinggiMaks],
  );

  const batas = useMemo(() => batasTinggi(teka), [teka]);
  const menyusun = keadaan.fase === 'menyusun';
  const bisaUrung = menyusun && keadaan.riwayat.length > 0;
  const seret = bolehSeret(kelas);

  // ---------- Seret dari rak (kelas 3–6) ----------
  const seretX = useSharedValue(0);
  const seretY = useSharedValue(0);
  const seretTampak = useSharedValue(0);
  const ukuranSeret = g ? Math.min(64, g.s) : 48;
  const lebarSeret = ukuranSeret * (1 + RASIO_DX) + 4;
  const tinggiSeret = ukuranSeret * (1 + RASIO_DY) + 4;

  const pusatRak = useMemo(
    () => (tataBawah && tataRak ? { x: tataBawah.x + tataRak.x + tataRak.width / 2, y: tataBawah.y + tataRak.y + tataRak.height / 2 } : null),
    [tataBawah, tataRak],
  );

  const geser = useMemo(() => {
    const kembali = () => {
      if (!pusatRak) return;
      seretX.set(withSpring(pusatRak.x, { damping: 14, stiffness: 180, mass: 0.8 }));
      seretY.set(withSpring(pusatRak.y, { damping: 14, stiffness: 180, mass: 0.8 }));
      seretTampak.set(withDelay(320, withTiming(0, { duration: 80 })));
    };
    return Gesture.Pan()
      .runOnJS(true)
      .enabled(seret && menyusun)
      .minDistance(4)
      .onStart(() => {
        if (!pusatRak) return;
        seretX.set(pusatRak.x);
        seretY.set(pusatRak.y);
        seretTampak.set(1);
      })
      .onUpdate((e) => {
        if (!pusatRak) return;
        seretX.set(pusatRak.x + e.translationX);
        seretY.set(pusatRak.y + e.translationY);
      })
      .onEnd((e) => {
        if (!pusatRak || !tataPanggung || !g) return kembali();
        const titik = [pusatRak.x + e.translationX - tataPanggung.x, pusatRak.y + e.translationY - tataPanggung.y] as const;
        // Magnet: menempel ke petak terdekat bila dilepas cukup dekat.
        const sel = petakDiTitik(g, keadaan.petak, titik, g.s * 1.4);
        if (!sel) return kembali();
        seretTampak.set(0);
        jalankan({ jenis: 'tambah', baris: sel[0], kolom: sel[1] });
      });
  }, [seret, menyusun, pusatRak, tataPanggung, g, keadaan.petak, jalankan, seretX, seretY, seretTampak]);

  const gayaSeret = useAnimatedStyle(() => ({
    opacity: seretTampak.value,
    transform: [{ translateX: seretX.value - lebarSeret / 2 }, { translateY: seretY.value - tinggiSeret / 2 }],
  }));

  const ambilTata = (atur: (t: LayoutRectangle) => void) => (e: LayoutChangeEvent) => atur(e.nativeEvent.layout);

  const sisaDetik = sisaDetikAwal - lewatDetik;
  const cocokAtauSelesai = keadaan.fase !== 'menyusun';
  const ajakan = seret
    ? 'Ketuk petak, atau seret kubus ke petak. Garis putus-putus = belum cocok.'
    : 'Ketuk petak untuk menaruh kubus. Garis putus-putus = belum cocok.';

  return (
    <BingkaiGame
      judul="Susun Kubus"
      sisaDetik={sisaDetik}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={menyusun ? keadaan.petunjuk : null}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={keadaan.fase === 'selesai'}
      latarAtas="#F2DFC2"
    >
      <View style={{ flex: 1, backgroundColor: warna.kremLembut, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 12 }}>
        <KartuTarget target={teka.target} baris={teka.baris} tinggiMaks={teka.tinggiMaks} belumCocok={keadaan.belumCocok} />

        <Panggung
          g={g}
          petak={keadaan.petak}
          target={teka.target}
          belumCocok={keadaan.belumCocok}
          batas={batas}
          jatuh={jatuh}
          pantul={pantul}
          bisaDiketuk={menyusun}
          onKetuk={(b, k) => jalankan({ jenis: 'tambah', baris: b, kolom: k })}
          onLayout={ambilTata(setTataPanggung)}
        />

        <View
          style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, backgroundColor: warna.putih }}
        >
          {cocokAtauSelesai ? <Pinci ekspresi="merayakan" ukuran={44} /> : null}
          <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 17, lineHeight: 23, color: warna.teks }}>
            {keadaan.fase === 'cocok' ? (
              <>
                <Text style={{ fontFamily: huruf.anakTebal, color: warna.hijauTua }}>Cocok!</Text> Persis seperti kartu.
              </>
            ) : keadaan.fase === 'selesai' ? (
              <Text style={{ fontFamily: huruf.anakTebal, color: warna.hijauTua }}>{keadaan.pesan}</Text>
            ) : keadaan.pantul ? (
              keadaan.pesan
            ) : (
              ajakan
            )}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, height: 80 }} onLayout={ambilTata(setTataBawah)}>
          {seret ? (
            <GestureDetector gesture={geser}>
              <View
                onLayout={ambilTata(setTataRak)}
                accessibilityLabel="Kubus kayu, seret ke petak"
                style={{
                  width: 112,
                  height: 80,
                  borderRadius: 18,
                  backgroundColor: '#F2DFC2',
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: KAYU.ubinGaris,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  opacity: menyusun ? 1 : 0.6,
                }}
              >
                <KubusLepas s={40} />
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"
                    stroke={KAYU.garis}
                    strokeWidth={2}
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>
              </View>
            </GestureDetector>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Urung"
            accessibilityState={{ disabled: !bisaUrung }}
            disabled={!bisaUrung}
            onPress={() => jalankan({ jenis: 'urung' })}
            style={({ pressed }) => ({
              flex: 1,
              height: 80,
              borderRadius: 18,
              borderWidth: 3,
              borderColor: KAYU.garis,
              backgroundColor: warna.putih,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: bisaUrung ? 1 : 0.5,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Ikon nama="urung" ukuran={26} warna={warna.biruTinta} />
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 20, color: warna.biruTinta }}>Urung</Text>
          </Pressable>
        </View>

        {seret ? (
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, top: 0 }, gayaSeret]}>
            <KubusLepas s={ukuranSeret} />
          </Animated.View>
        ) : null}
      </View>
    </BingkaiGame>
  );
}
