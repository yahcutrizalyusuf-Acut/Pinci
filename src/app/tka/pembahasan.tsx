/** Pembahasan simulasi / mini try out: per butir, jawaban anak, kunci, alasan pengecoh, langkah. */
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { alasanUntukAnak, SARAN_ANAK } from '@/fitur/teks-anak';
import { cariButir, penyebabSalah } from '@/isi/tka/pemuat';
import { paketTka } from '@/isi/tka/paket';
import { KepalaLayar } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { TeksKaya } from '@/komponen/tka/TeksKaya';

export default function Pembahasan() {
  const { sesi } = useLocalSearchParams<{ sesi: string }>();
  const jawaban = useMuat((r) => r.jawabanSesi(sesi), [], [sesi]);
  return (
    <Layar>
      <KepalaLayar judul="Pembahasan" />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
        {jawaban.map((j) => {
          const b = j.butirId ? cariButir(paketTka, j.butirId) : undefined;
          if (!b) return null;
          const jaw = b.bentuk === 'pg' ? j.jawaban : j.jawaban.split(',');
          const sebab = j.benar ? [] : penyebabSalah(b, jaw);
          return (
            <View key={j.id} style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 6, borderLeftWidth: 5, borderLeftColor: j.benar ? warna.hijauDaun : warna.oranye }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.teksKedua }}>
                Soal {j.urutan} · {j.benar ? 'Tepat ✓' : j.jawaban.replace(/,/g, '') === '' ? 'Belum dijawab' : 'Belum tepat'}
              </Text>
              <TeksKaya teks={b.pertanyaan} ukuran={16} />
              <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>
                Jawabanmu: {j.jawaban || '–'} · Kunci: {j.kunci}
              </Text>
              {sebab.map((s) => (
                <TeksKaya key={s.pilihan} teks={`${s.pilihan}: ${alasanUntukAnak(s.alasan)}`} ukuran={14} warnaTeks={warna.teksKedua} />
              ))}
              {j.kodeSalah && SARAN_ANAK[j.kodeSalah] ? <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: '#B86E00' }}>{SARAN_ANAK[j.kodeSalah]}</Text> : null}
              {b.pembahasan ? <TeksKaya teks={`Langkah: ${b.pembahasan}`} ukuran={14} /> : null}
            </View>
          );
        })}
      </ScrollView>
    </Layar>
  );
}
