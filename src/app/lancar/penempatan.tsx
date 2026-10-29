/** K4 Tes penempatan Lancar: 4 soal per level, berhenti di level yang belum lancar. */
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { simpanLembarLancar } from '@/fitur/lancar';
import { titip } from '@/fitur/sementara';
import { useHitungWaktu } from '@/fitur/waktu';
import { GelembungPinci, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { LembarSoal } from '@/komponen/LembarSoal';
import { buatTesPenempatan, tesSelesai } from '@/mesin/lancar';

export default function Penempatan() {
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const [mulaiTes, setMulaiTes] = useState(false);
  const [jeda, setJeda] = useState(false);
  const soal = useMemo(() => buatTesPenempatan({ kelas: anak.kelas, benih: `${anak.id}|tes` }), [anak.id, anak.kelas]);
  const mulai = useRef(0);
  useHitungWaktu('belajar', jeda || !mulaiTes);

  if (!mulaiTes) {
    return (
      <Layar
        bawah={
          <View style={{ padding: 16 }}>
            <Tombol
              label="Mulai"
              besar
              onPress={() => {
                mulai.current = kiniMs();
                setMulaiTes(true);
              }}
            />
          </View>
        }
      >
        <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
          <GelembungPinci judul="Tes singkat dulu, yuk!" teks="Jawab sebisamu. Tidak apa-apa kalau belum bisa. Pinci mencari level yang pas untukmu." suara />
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua, textAlign: 'center' }}>Kira-kira 2–4 menit.</Text>
        </View>
      </Layar>
    );
  }
  return (
    <LembarSoal
      soal={soal}
      kelas={anak.kelas}
      petunjukUntuk={() => 'Kerjakan sebisamu. Kalau belum tahu, coba tebak saja.'}
      setelahJawab={(j) => tesSelesai(j)}
      onJedaBerubah={setJeda}
      onKeluar={() => router.back()}
      onSelesai={async (jawaban) => {
        const hasil = await simpanLembarLancar(
          repo,
          anak,
          { kelas: anak.kelas, level: 1, benih: `${anak.id}|tes`, levelDayaTahan: null, jumlahSoal: jawaban.length },
          jawaban,
          mulai.current,
          'sendiri',
          'penempatan',
        );
        titip('akhir-lembar', hasil);
        router.replace('/lancar/akhir');
      }}
    />
  );
}
