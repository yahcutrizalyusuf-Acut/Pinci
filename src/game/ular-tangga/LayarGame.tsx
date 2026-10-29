/**
 * G04 Ular Tangga Lurus 1–100. Anak melawan Pinci; sulur ramah hanya membawa naik.
 * Santai: ketuk dadu → maju. Seru: ketuk dadu → jawab soal singkat → maju. Tanpa kalah, tanpa skor.
 */
import { useEffect, useRef, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { huruf, ukuranKelas, warna } from '../../desain/token';
import { KepalaLogo } from '../../komponen/Pinci';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { buatBabak, type AksiUlarTangga, type KeadaanUlarTangga } from './logika';
import { Dadu } from './tampilan/Dadu';
import { UKURAN_PAPAN_MAKS } from './tampilan/geometri';
import { KartuSoal } from './tampilan/KartuSoal';
import { Papan } from './tampilan/Papan';
import { rencanaAksi, type Peristiwa } from './tampilan/rencana';

export default function LayarGame(props: PropsLayarGame) {
  const { kelas, tingkat, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar } = props;
  const { width } = useWindowDimensions();
  const ukuranPapan = Math.max(240, Math.min(UKURAN_PAPAN_MAKS, Math.min(width, 480) - 32));

  const [keadaan, setKeadaan] = useState<KeadaanUlarTangga>(() => buatBabak({ kelas, tingkat, benih }));
  const [sibuk, setSibuk] = useState(false);
  const [kunciPutar, setKunciPutar] = useState(0);
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const [pinciBicara, setPinciBicara] = useState(false);
  const [pesta, setPesta] = useState(false);
  const [posisiTampil, setPosisiTampil] = useState(keadaan.posisi);
  const [berlalu, setBerlalu] = useState(0);

  const pengatur = useRef<ReturnType<typeof setTimeout>[]>([]);
  const terkunci = useRef(false);
  const sudahSelesai = useRef(false);
  const panggilSelesai = useRef(onSelesai);

  useEffect(() => {
    panggilSelesai.current = onSelesai;
  }, [onSelesai]);

  // Hapus semua jadwal saat layar ditutup.
  useEffect(() => {
    const daftar = pengatur.current;
    return () => {
      daftar.forEach(clearTimeout);
      daftar.length = 0;
    };
  }, []);

  // Matahari waktu: hitung detik berlalu (tanpa hitung mundur di layar).
  useEffect(() => {
    if (!Number.isFinite(sisaDetikAwal)) return;
    const id = setInterval(() => setBerlalu((b) => b + 1), 1000);
    return () => clearInterval(id);
  }, [sisaDetikAwal]);

  function terapkan(p: Peristiwa) {
    switch (p.jenis) {
      case 'putar_dadu':
        setKunciPutar((n) => n + 1);
        break;
      case 'keadaan':
        setKeadaan(p.keadaan);
        if (p.keadaan.kejutan) setKunciKejutan((n) => n + 1);
        break;
      case 'mendarat':
        setPosisiTampil(p.keadaan.posisi);
        bunyiGame('plop', bunyi);
        break;
      case 'ting':
        bunyiGame('ting', bunyi);
        break;
      case 'pinci_bicara':
        setPinciBicara(p.nyala);
        break;
      case 'pesta':
        setPesta(true);
        bunyiGame('pesta', bunyi);
        break;
      case 'selesai':
        if (!sudahSelesai.current) {
          sudahSelesai.current = true;
          panggilSelesai.current(p.ringkasan);
        }
        break;
      case 'bebas':
        terkunci.current = false;
        setSibuk(false);
        break;
    }
  }

  function jalankan(aksi: AksiUlarTangga) {
    if (terkunci.current) return;
    const rencana = rencanaAksi(keadaan, aksi);
    if (rencana.length === 0) return;
    terkunci.current = true;
    setSibuk(true);
    for (const { pada, peristiwa } of rencana) {
      if (pada <= 0) terapkan(peristiwa);
      else pengatur.current.push(setTimeout(() => terapkan(peristiwa), pada));
    }
  }

  const sisaDetik = Number.isFinite(sisaDetikAwal) ? Math.max(0, sisaDetikAwal - berlalu) : sisaDetikAwal;
  const giliranAnak = keadaan.fase === 'lempar' || keadaan.fase === 'soal';
  const bisaLempar = keadaan.fase === 'lempar' && !sibuk;
  const namaGiliran = giliranAnak ? keadaan.namaAnak : 'Pinci';
  const ukuran = ukuranKelas(kelas);

  return (
    <BingkaiGame
      judul="Ular Tangga Lurus"
      sisaDetik={sisaDetik}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={keadaan.fase === 'soal' ? keadaan.petunjuk : null}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={pesta}
      latarAtas="#CDEBD8"
    >
      <View style={{ flex: 1, paddingHorizontal: 16, gap: 10 }}>
        <Papan ukuran={ukuranPapan} sulur={keadaan.sulur} posisiAwal={keadaan.posisi} gerak={keadaan.gerakTerakhir} />
        <View style={{ minHeight: 48, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, backgroundColor: warna.putih, justifyContent: 'center' }}>
          <Text accessibilityLiveRegion="polite" style={{ fontFamily: huruf.anak, fontSize: 17, lineHeight: 23, color: warna.teks }}>
            {keadaan.pesan}
          </Text>
        </View>

        <View style={{ flex: 1, minHeight: 130, alignItems: 'center', justifyContent: 'center' }}>
          {keadaan.fase === 'soal' && keadaan.soal ? (
            <KartuSoal
              soal={keadaan.soal}
              dicoba={keadaan.pilihanDicoba}
              pantul={keadaan.pantul}
              kunciPantul={keadaan.salah}
              ukuranSoal={ukuran.soal}
              onPilih={(pilihan) => jalankan({ jenis: 'jawab', pilihan })}
            />
          ) : keadaan.fase === 'selesai' ? (
            <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.hijauTua, textAlign: 'center' }}>
              {keadaan.pemenang ? 'Sampai di 100!' : 'Seru sekali!'}
            </Text>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <Dadu angka={keadaan.dadu} kunciPutar={kunciPutar} bisaDiketuk={bisaLempar} onKetuk={() => jalankan({ jenis: 'lempar_dadu' })} />
              <View style={{ gap: 6, flexShrink: 1 }}>
                {giliranAnak ? (
                  <Text style={{ fontFamily: huruf.judul, fontSize: 22, lineHeight: 26, color: warna.teks }}>Ketuk dadu</Text>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                    <KepalaLogo ukuran={36} />
                    {pinciBicara ? (
                      <View style={{ backgroundColor: warna.putih, borderRadius: 14, borderBottomLeftRadius: 4, paddingVertical: 6, paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 16, color: warna.teks }}>Giliranku, ya!</Text>
                      </View>
                    ) : null}
                  </View>
                )}
                <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: '#2E6B4A' }}>Giliran: {namaGiliran}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: '#E6F0FF',
                borderWidth: 2,
                borderColor: '#3A86FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 11, lineHeight: 14 }}>⭐</Text>
            </View>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>
              {keadaan.namaAnak} · {posisiTampil.anak}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <KepalaLogo ukuran={22} />
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>Pinci · {posisiTampil.pinci}</Text>
          </View>
        </View>
      </View>
    </BingkaiGame>
  );
}
