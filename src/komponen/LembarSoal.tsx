/**
 * A05 Lembar Lancar: papan angka besar, tanpa jam berjalan, hanya batang kemajuan.
 * Jawaban belum tepat: kotak bergetar halus dan jawaban benar tampil, tanpa kata "salah".
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Modal, Text, View } from 'react-native';

import { huruf, ukuranKelas, warna } from '../desain/token';
import { kiniMs } from '../data/alat';
import { cocokJawaban, rapikanJawaban, tombolTambahan, type JawabanLancar, type SoalLancar } from '../mesin/lancar';
import { BilahKemajuan, KotakPetunjuk, PapanAngka, TombolKecil, Tombol } from './dasar';
import { Layar } from './Layar';
import { Pinci } from './Pinci';

interface Props {
  soal: SoalLancar[];
  kelas: number;
  petunjukUntuk: (s: SoalLancar) => string;
  /** dipanggil setiap soal dijawab; kembalikan true untuk berhenti lebih awal (tes penempatan) */
  setelahJawab?: (semua: JawabanLancar[]) => boolean;
  onSelesai: (jawaban: JawabanLancar[]) => void;
  onKeluar: () => void;
  onJedaBerubah?: (jeda: boolean) => void;
  /** Mode Dampingi: tampilkan kunci untuk orang tua */
  tampilKunci?: boolean;
}

export function LembarSoal({ soal, kelas, petunjukUntuk, setelahJawab, onSelesai, onKeluar, onJedaBerubah, tampilKunci }: Props) {
  const [i, setI] = useState(0);
  const [isian, setIsian] = useState('');
  const [hapusN, setHapusN] = useState(0);
  const [tampilBenar, setTampilBenar] = useState<string | null>(null);
  const [petunjuk, setPetunjuk] = useState(false);
  const [jeda, setJeda] = useState(false);
  const jawaban = useRef<JawabanLancar[]>([]);
  const mulaiSoal = useRef(0);
  const detikJeda = useRef(0);
  const mulaiJeda = useRef(0);
  const [getar] = useState(() => new Animated.Value(0));
  const [muncul] = useState(() => new Animated.Value(1));
  const s = soal[i];
  const uk = ukuranKelas(kelas);

  const aturJeda = (v: boolean) => {
    if (v) mulaiJeda.current = kiniMs();
    else detikJeda.current += (kiniMs() - mulaiJeda.current) / 1000;
    setJeda(v);
    onJedaBerubah?.(v);
  };
  const aturJedaRef = useRef(aturJeda);
  useEffect(() => {
    aturJedaRef.current = aturJeda;
  });

  useEffect(() => {
    mulaiSoal.current = kiniMs();
    const b = BackHandler.addEventListener('hardwareBackPress', () => {
      aturJedaRef.current(true);
      return true;
    });
    return () => b.remove();
  }, []);

  const lanjut = () => {
    setTampilBenar(null);
    setIsian('');
    setHapusN(0);
    setPetunjuk(false);
    detikJeda.current = 0;
    mulaiSoal.current = kiniMs();
    const berhenti = setelahJawab?.(jawaban.current) ?? false;
    if (berhenti || i + 1 >= soal.length) {
      onSelesai(jawaban.current);
      return;
    }
    muncul.setValue(0);
    Animated.timing(muncul, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setI(i + 1);
  };

  const cek = () => {
    if (!s || tampilBenar !== null || isian === '') return;
    const detik = Math.max(0.3, (kiniMs() - mulaiSoal.current) / 1000 - detikJeda.current);
    const benar = cocokJawaban(s, isian);
    jawaban.current = [...jawaban.current, { soal: s, jawaban: rapikanJawaban(isian), benar, detik, hapusN }];
    if (benar) {
      lanjut();
      return;
    }
    setTampilBenar(s.kunci);
    Animated.sequence([
      Animated.timing(getar, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(getar, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(getar, { toValue: 0.6, duration: 60, useNativeDriver: true }),
      Animated.timing(getar, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    setTimeout(lanjut, 1600);
  };

  if (!s) return null;
  const tambahan = [...tombolTambahan(s.bentukJawaban)];
  const teksSoal = s.teks.includes('…') || s.teks.includes('?') ? s.teks : `${s.teks} =`;
  const panjang = teksSoal.length;
  const ukuranSoal = panjang > 18 ? uk.soal * 0.6 : panjang > 12 ? uk.soal * 0.8 : uk.soal * 1.4;

  return (
    <Layar>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TombolKecil label="Jeda" ikon="jeda" onPress={() => aturJeda(true)} />
        <TombolKecil label="Petunjuk" ikon="lampu" onPress={() => setPetunjuk(true)} />
      </View>
      <BilahKemajuan nilai={i} maks={soal.length} label={`${i + 1} / ${soal.length}`} />
      <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, opacity: muncul }}>
        <Text
          accessibilityLabel={`Soal: ${s.teks}`}
          style={{ fontFamily: huruf.anak, fontSize: ukuranSoal, textAlign: 'center', color: warna.teks }}
        >
          {teksSoal}
        </Text>
        <Animated.View
          style={{
            minWidth: 150,
            height: 88,
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: warna.putih,
            borderWidth: 3,
            borderColor: tampilBenar !== null ? warna.oranye : warna.hijauDaun,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX: getar.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) }],
          }}
        >
          {tampilBenar !== null ? (
            <Text style={{ fontFamily: huruf.anak, fontSize: 48, color: warna.hijauTua }}>{tampilBenar}</Text>
          ) : (
            <Text style={{ fontFamily: huruf.anak, fontSize: 52, color: isian ? warna.teks : '#C9C0AE' }}>{isian || '?'}</Text>
          )}
        </Animated.View>
        {tampilBenar !== null ? (
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua }}>Jawabannya {tampilBenar}. Kita lanjut, ya.</Text>
        ) : null}
        {tampilKunci ? (
          <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 15, color: '#B86E00' }}>Kunci (untuk orang tua): {s.kunci}</Text>
        ) : null}
        {petunjuk ? <KotakPetunjuk teks={petunjukUntuk(s)} /> : null}
        <Pinci ekspresi="diam" ukuran={48} tenang style={{ position: 'absolute', right: 0, bottom: 0 }} />
      </Animated.View>
      <PapanAngka
        tombolTambahan={tambahan}
        cekNonaktif={isian === '' || tampilBenar !== null}
        onAngka={(a) => {
          if (tampilBenar !== null || isian.length >= 7) return;
          if ((a === ',' || a === '/') && (isian.includes(',') || isian.includes('/'))) return;
          setIsian(isian + a);
        }}
        onHapus={() => {
          if (!isian) return;
          setIsian(isian.slice(0, -1));
          setHapusN(hapusN + 1);
        }}
        onCek={cek}
      />
      <Modal visible={jeda} transparent animationType="fade" onRequestClose={() => aturJeda(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(45,49,66,0.94)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: warna.kremLembut, borderRadius: 24, padding: 24, gap: 16, alignItems: 'center' }}>
            <Pinci ekspresi="senang" ukuran={96} />
            <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.teks }}>Jeda dulu</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teksKedua, textAlign: 'center' }}>
              Soal ditutup dan waktu berhenti.
            </Text>
            <Tombol label="Lanjut" besar style={{ alignSelf: 'stretch' }} onPress={() => aturJeda(false)} />
            <Tombol label="Lanjut nanti" varian="garis" style={{ alignSelf: 'stretch' }} onPress={onKeluar} />
          </View>
        </View>
      </Modal>
    </Layar>
  );
}
