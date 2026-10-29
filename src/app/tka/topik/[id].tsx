/** Jalur Mandiri per topik: sasaran → salah paham → contoh jadi → latihan berjenjang. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { huruf, warna, warnaMapel } from '@/desain/token';
import { ambilTopik } from '@/isi/tka/pemuat';
import { paketTka } from '@/isi/tka/paket';
import { KepalaLayar, TombolSuara, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';
import { Stimulus } from '@/komponen/tka/Stimulus';
import { TeksKaya, teksBaca } from '@/komponen/tka/TeksKaya';

export default function TopikTka() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const topik = ambilTopik(paketTka, id);
  const [contoh, setContoh] = useState(0);
  if (!topik) return null;
  const w = warnaMapel[topik.mapel];
  const c = topik.contohJadi[contoh];
  return (
    <Layar
      bawah={
        <View style={{ padding: 16, gap: 10 }}>
          <Tombol label="Mulai latihan" besar onPress={() => router.replace({ pathname: '/tka/latihan', params: { topik: topik.id } })} />
        </View>
      }
    >
      <KepalaLayar judul={`${topik.id} · ${topik.judul}`} warnaJudul={w.teks} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
          <Pinci ekspresi="semangat" ukuran={72} />
          <View style={{ flex: 1, backgroundColor: warna.putih, borderRadius: 18, borderBottomLeftRadius: 6, padding: 14, gap: 4 }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: w.teks }}>Hari ini kita belajar</Text>
            <TeksKaya teks={topik.sasaran.replace(/^Di akhir pertemuan, anak bisa /, 'Kamu bisa ')} ukuran={16} />
          </View>
        </View>
        {topik.salahPaham.length ? (
          <View style={{ backgroundColor: '#FFF6D6', borderRadius: 18, padding: 14, gap: 8 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: '#7A5B00' }}>Hati-hati, sering keliru</Text>
            {topik.salahPaham.map((s, i) => (
              <View key={i} style={{ gap: 2 }}>
                <TeksKaya teks={`⚠️ ${s.teks}`} ukuran={16} />
                {s.contoh ? <TeksKaya teks={`Contoh: ${s.contoh}`} ukuran={14} warnaTeks={warna.teksKedua} /> : null}
              </View>
            ))}
          </View>
        ) : null}
        {c ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: w.teks }}>
                Contoh jadi {contoh + 1} dari {topik.contohJadi.length}
              </Text>
              <TombolSuara teks={teksBaca(c.penjelasan.join(' '))} ukuran={38} />
            </View>
            <Stimulus bagian={c.soal} ukuran={16} />
            {c.langkah.map((l, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: w.muda, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: w.teks }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TeksKaya teks={l} ukuran={16} />
                </View>
              </View>
            ))}
            <View style={{ backgroundColor: warna.hijauMuda, borderRadius: 12, padding: 10 }}>
              <TeksKaya teks={`Jawaban: ${c.jawaban}`} ukuran={16} warnaTeks={warna.hijauTua} />
            </View>
            {contoh + 1 < topik.contohJadi.length ? <Tombol label="Contoh berikutnya" varian="garis" onPress={() => setContoh(contoh + 1)} /> : null}
          </View>
        ) : null}
      </ScrollView>
    </Layar>
  );
}
