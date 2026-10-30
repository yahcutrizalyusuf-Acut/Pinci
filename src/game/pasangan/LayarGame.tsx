/**
 * Pasangkan Kartu — tampilan. Buka dua kartu; pasangan cocok tetap terbuka, yang belum cocok
 * menutup lagi tanpa hukuman. Kata Inggris dibacakan dengan rekaman suara bawaan.
 */
import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { PAKET_INGGRIS } from '../../isi/inggris/paket';
import { huruf, warna } from '../../desain/token';
import { ucapkan } from '../../layanan/suara';
import { rapikanLevel } from '../bersama/level';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import { useLewatDetik, useSelesaiBabak } from '../bersama/tampilan/kait';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { buatBabak, langkah, ringkasan, terlihat, type KartuMemori, type KeadaanPasangan } from './logika';

/** Jeda sebelum dua kartu yang belum cocok menutup lagi. */
const JEDA_TUTUP_MS = 1000;

function Kartu({ k, tampak, cocok, sorot, kecil, onBuka }: { k: KartuMemori; tampak: boolean; cocok: boolean; sorot: boolean; kecil: boolean; onBuka: () => void }) {
  const [balik] = useState(() => new Animated.Value(tampak ? 1 : 0));
  useEffect(() => {
    Animated.timing(balik, { toValue: tampak ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [tampak, balik]);
  const ukuranIsi = k.jenis === 'gambar' ? (kecil ? 34 : 44) : k.isi.length > 9 ? (kecil ? 14 : 17) : k.isi.length > 5 ? (kecil ? 17 : 21) : kecil ? 22 : 28;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tampak ? `Kartu ${k.isi}` : 'Kartu tertutup'}
      onPress={onBuka}
      style={{ width: kecil ? '23%' : '30%', aspectRatio: 0.8 }}
    >
      <Animated.View
        style={{
          flex: 1,
          borderRadius: 16,
          borderWidth: sorot ? 4 : 3,
          borderColor: sorot ? warna.kuning : cocok ? warna.hijauDaun : tampak ? '#BFE3F7' : '#2E9E5B',
          backgroundColor: tampak ? warna.putih : '#3BB273',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          transform: [{ scaleX: balik.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.05, 1] }) }],
        }}
      >
        {tampak ? (
          <Text style={{ fontFamily: k.jenis === 'kata' ? huruf.anakTebal : huruf.judulTebal, fontSize: ukuranIsi, color: warna.teks, textAlign: 'center' }}>{k.isi}</Text>
        ) : (
          <Text style={{ fontSize: kecil ? 22 : 28, color: '#FFFFFF', fontFamily: huruf.judulTebal }}>?</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function LayarGame({ kelas, level, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar }: PropsLayarGame) {
  const [keadaan, setKeadaan] = useState<KeadaanPasangan>(() => buatBabak({ kelas, level: rapikanLevel(level), benih, paketInggris: PAKET_INGGRIS }));
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const lewat = useLewatDetik();
  useSelesaiBabak(keadaan.fase === 'selesai', () => ringkasan(keadaan), onSelesai);

  // Dua kartu belum cocok: biarkan terlihat sebentar, lalu tutup lagi.
  useEffect(() => {
    if (keadaan.fase !== 'tunggu_tutup') return;
    const id = setTimeout(() => setKeadaan((k) => langkah(k, { jenis: 'tutup' })), JEDA_TUTUP_MS);
    return () => clearTimeout(id);
  }, [keadaan.fase]);

  const buka = (id: number) => {
    const baru = langkah(keadaan, { jenis: 'buka', id });
    if (baru === keadaan) return;
    setKeadaan(baru);
    if (baru.kejutan) setKunciKejutan((n) => n + 1);
    const kartu = keadaan.kartu[id];
    if (kartu.ucapan) ucapkan(kartu.ucapan, 'en-US');
    if (baru.ditemukan.length > keadaan.ditemukan.length) bunyiGame(baru.fase === 'selesai' ? 'pesta' : 'ting', bunyi);
    else bunyiGame('plop', bunyi);
  };

  const selesai = keadaan.fase === 'selesai';
  const kecil = keadaan.kartu.length > 12;
  const jumlahPasangan = keadaan.kartu.length / 2;
  return (
    <BingkaiGame
      judul={`Pasangkan Kartu · Level ${keadaan.level}`}
      sisaDetik={sisaDetikAwal - lewat}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={selesai ? null : keadaan.petunjuk}
      kejutan={keadaan.kejutan}
      kunciKejutan={kunciKejutan}
      pesta={selesai}
      latarAtas="#FFF0D9"
    >
      <View style={{ flex: 1, backgroundColor: '#FFF0D9', paddingHorizontal: 12, paddingBottom: 20, gap: 12 }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 18, padding: 12, alignItems: 'center' }}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks, textAlign: 'center' }}>
            {selesai
              ? 'Semua pasangan ketemu!'
              : keadaan.tema === 'inggris'
                ? 'Cari pasangan kata Inggris dan gambarnya.'
                : 'Cari pasangan soal dan hasilnya.'}
          </Text>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.hijauTua }}>
            {keadaan.ditemukan.length} dari {jumlahPasangan} pasangan
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 8 }}>
          {keadaan.kartu.map((k) => (
            <Kartu
              key={k.id}
              k={k}
              tampak={terlihat(keadaan, k.id)}
              cocok={keadaan.ditemukan.includes(k.pasangan)}
              sorot={keadaan.sorot === k.id}
              kecil={kecil}
              onBuka={() => buka(k.id)}
            />
          ))}
        </View>
      </View>
    </BingkaiGame>
  );
}
