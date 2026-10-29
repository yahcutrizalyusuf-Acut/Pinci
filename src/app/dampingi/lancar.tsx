/** D4 Lembar didampingi: soal Lancar dengan kalimat untuk diucapkan orang tua (desain B07). Tidak dihitung naik level. */
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { kalimatOrtu, pilihanSoal } from '@/fitur/dampingi';
import { lembarBerikut, simpanLembarLancar } from '@/fitur/lancar';
import { titip } from '@/fitur/sementara';
import { mainkanBunyi } from '@/layanan/bunyi';
import { cocokJawaban, type JawabanLancar, type LembarLancar } from '@/mesin/lancar';
import { Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';

export default function LembarDidampingi() {
  const router = useRouter();
  const { repo, anakAktif, keluarga } = useData();
  const [lembar, setLembar] = useState<LembarLancar | null>(null);
  const [i, setI] = useState(0);
  const [pilih, setPilih] = useState<string | null>(null);
  const jawaban = useRef<JawabanLancar[]>([]);
  const mulai = useRef(0);
  const mulaiSoal = useRef(0);
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';

  useEffect(() => {
    if (!anakAktif) return;
    mulai.current = kiniMs();
    mulaiSoal.current = kiniMs();
    lembarBerikut(repo, anakAktif).then((l) => setLembar({ ...l, soal: l.soal.filter((s) => s.bentukJawaban === 'bilangan').slice(0, 10) }));
  }, [repo, anakAktif]);

  if (!lembar || !anakAktif) return null;
  const s = lembar.soal[i];
  if (!s) return null;
  const pilihan = pilihanSoal(s, `${lembar.benih}|${i}`);
  const benar = pilih !== null && cocokJawaban(s, pilih);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        <View style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5A54A', backgroundColor: '#FFF1DA', borderRadius: 22, padding: 16, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ikon nama="pesan" ukuran={20} warna="#8A5200" />
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: '#8A5200' }}>Untuk {sapaan}, ucapkan:</Text>
          </View>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 19, lineHeight: 26, color: warna.teks }}>{kalimatOrtu(s)}</Text>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: '#6B5B45' }}>Tunggu anak menjawab. Kalau ragu, tunjuk langkah jurusnya satu per satu.</Text>
        </View>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: warnaMapel.mat.teks, textAlign: 'center' }}>
          Lancar Matematika · Level {lembar.level} · {i + 1}/{lembar.soal.length}
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 52, color: warna.teks, textAlign: 'center' }}>{s.teks} = ?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {pilihan.map((p) => {
            const kunci = pilih !== null && p === s.kunci;
            const keliru = pilih === p && !benar;
            return (
              <Pressable
                key={p}
                accessibilityRole="button"
                disabled={benar}
                onPress={() => {
                  if (pilih === null) {
                    jawaban.current.push({ soal: s, jawaban: p, benar: cocokJawaban(s, p), detik: (kiniMs() - mulaiSoal.current) / 1000, hapusN: 0 });
                  }
                  setPilih(p);
                  if (cocokJawaban(s, p)) mainkanBunyi(repo, anakAktif.id, 'ting');
                }}
                style={{ width: '47%', height: 72, borderRadius: 18, borderWidth: 2, borderColor: kunci ? warna.hijauSegar : keliru ? warna.oranye : warna.kremBatang, backgroundColor: kunci ? warna.hijauMuda : warna.putih, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontFamily: huruf.anak, fontSize: 32, color: warna.teks }}>{p}</Text>
              </Pressable>
            );
          })}
        </View>
        {benar ? (
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua, textAlign: 'center' }}>Betul! ✓ {sapaan}, beri tos untuk si kecil.</Text>
        ) : pilih !== null ? (
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: '#B86E00', textAlign: 'center' }}>Hampir! Coba pakai jurusnya lagi bersama.</Text>
        ) : null}
      </ScrollView>
      <View style={{ padding: 16 }}>
        <Tombol
          label={i + 1 < lembar.soal.length ? 'Soal berikutnya' : 'Selesai'}
          besar
          nonaktif={!benar}
          onPress={async () => {
            if (i + 1 < lembar.soal.length) {
              setI(i + 1);
              setPilih(null);
              mulaiSoal.current = kiniMs();
              return;
            }
            const h = await simpanLembarLancar(repo, anakAktif, { kelas: lembar.kelas, level: lembar.level, benih: lembar.benih, levelDayaTahan: null, jumlahSoal: jawaban.current.length }, jawaban.current, mulai.current, 'dampingi');
            titip('akhir-lembar', h);
            router.replace('/lancar/akhir');
          }}
        />
      </View>
    </View>
  );
}
