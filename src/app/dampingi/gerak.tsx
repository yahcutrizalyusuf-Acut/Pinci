/**
 * Tebak Gerak (PROMPT-LANJUTAN-KOMIK tahap 6 butir 6): aplikasi membacakan perintah Bahasa Inggris, anak bergerak,
 * orang tua mengetuk "Sudah". Lalu bergantian: anak memilih perintah untuk orang tua. Tanpa kamera, tanpa rekaman, tanpa skor.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { buatAcak } from '@/mesin/lancar';
import { acak } from '@/fitur/inggris';
import { daftarPerintah, type PerintahGerak } from '@/isi/inggris/perintahGerak';
import { Tombol } from '@/komponen/dasar';
import { GerakPinci } from '@/komponen/GerakPinci';
import { ucapkan } from '@/layanan/suara';

const PER_GILIRAN = 5;

export default function TebakGerak() {
  const { anakAktif, keluarga } = useData();
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const semua = useMemo(() => daftarPerintah(anakAktif?.tingkatInggris ?? 3), [anakAktif?.tingkatInggris]);
  const [benih] = useState(() => String(Math.random()));
  const urutan = useMemo(() => acak(semua, buatAcak(benih)), [semua, benih]);
  const [giliran, setGiliran] = useState<'anak' | 'ortu'>('anak');
  const [ke, setKe] = useState(0);
  const [pilihanAnak, setPilihanAnak] = useState<PerintahGerak | null>(null);
  const [ulang, setUlang] = useState(0);
  if (!anakAktif) return null;

  const sekarang = giliran === 'anak' ? urutan[ke % urutan.length] : pilihanAnak;
  const bacakan = (p: PerintahGerak) => {
    ucapkan(p.inggris, 'en-US');
    setUlang((x) => x + 1);
  };
  const sudah = () => {
    if (giliran === 'anak') {
      const n = ke + 1;
      setKe(n);
      if (n % PER_GILIRAN === 0) setGiliran('ortu');
    } else {
      setPilihanAnak(null);
      const n = ke + 1;
      setKe(n);
      if (n % PER_GILIRAN === 0) setGiliran('anak');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, alignItems: 'center' }}>
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>Tebak Gerak</Text>
      <View style={{ alignSelf: 'stretch', backgroundColor: giliran === 'anak' ? warna.hijauMuda : warna.oranyeMuda, borderRadius: 16, padding: 12 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks, textAlign: 'center' }}>
          {giliran === 'anak' ? `Giliran ${anakAktif.nama} bergerak. ${sapaan} mengetuk "Sudah".` : `Giliran ${anakAktif.nama} memberi perintah untuk ${sapaan}.`}
        </Text>
      </View>
      {giliran === 'ortu' && !pilihanAnak ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {semua.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              onPress={() => {
                setPilihanAnak(p);
                bacakan(p);
              }}
              style={({ pressed }) => ({ paddingHorizontal: 14, minHeight: 48, justifyContent: 'center', borderRadius: 24, backgroundColor: pressed ? warna.oranyeMuda : warna.putih, borderWidth: 2, borderColor: warna.oranye })}
            >
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: warna.teks }}>{p.inggris}</Text>
            </Pressable>
          ))}
        </View>
      ) : sekarang ? (
        <>
          <GerakPinci gerakan={{ kata: sekarang.id, jenis: sekarang.jenis, petunjuk: sekarang.arti }} ulang={ulang} ukuran={120} />
          <Pressable accessibilityRole="button" accessibilityLabel={`Dengar lagi: ${sekarang.inggris}`} onPress={() => bacakan(sekarang)}>
            <Text style={{ fontFamily: huruf.judul, fontSize: 34, color: warna.teks, textAlign: 'center' }}>🔊 {sekarang.inggris}</Text>
          </Pressable>
          <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teksKedua }}>{sekarang.arti}</Text>
          <Tombol label="Sudah" besar style={{ alignSelf: 'stretch' }} onPress={sudah} />
          {giliran === 'anak' && ke % PER_GILIRAN === 0 ? <Tombol label="Bacakan perintah" varian="garis" onPress={() => bacakan(sekarang)} /> : null}
        </>
      ) : null}
      <Text style={{ fontFamily: huruf.ortu, fontSize: 12, color: warna.teksRedup, textAlign: 'center' }}>Tanpa kamera dan tanpa rekaman. Daftar perintah belum diperiksa guru.</Text>
    </ScrollView>
  );
}
