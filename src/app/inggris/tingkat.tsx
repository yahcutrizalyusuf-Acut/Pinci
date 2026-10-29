/** B04/K27 Bahasa Inggris — pilih tingkat: tes singkat ± 2 menit menyarankan tingkat; semua tingkat bebas dipilih. */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { acak, buatTesTingkat, saranTingkat, type Tingkat } from '@/fitur/inggris';
import { PAKET_INGGRIS } from '@/isi/inggris/paket';
import { ucapkan } from '@/layanan/suara';
import { buatAcak } from '@/mesin/lancar';
import { GelembungPinci, KepalaLayar, Tombol, TombolSuara } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { KartuGambar } from '@/komponen/KartuGambar';
import { Layar } from '@/komponen/Layar';

const KETERANGAN: Record<Tingkat, string> = { 3: 'Kenal kata sehari-hari', 4: 'Kalimat pendek', 5: 'Cerita pendek', 6: 'Percakapan sederhana' };

export default function PilihTingkatInggris() {
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const soal = useMemo(() => buatTesTingkat(PAKET_INGGRIS, `${anak.id}|tes-inggris`), [anak.id]);
  const urutPilihan = useMemo(() => soal.map((s, i) => acak(s.pilihan, buatAcak(`${anak.id}|${i}`))), [soal, anak.id]);
  const [tahap, setTahap] = useState<'awal' | 'tes' | 'pilih'>(anak.tingkatInggris ? 'pilih' : 'awal');
  const [i, setI] = useState(0);
  const [benar, setBenar] = useState<Partial<Record<Tingkat, number>>>({});
  const [saran, setSaran] = useState<Tingkat | null>(null);
  const [pilih, setPilih] = useState<Tingkat>(anak.tingkatInggris ?? 3);

  const jawab = (id: string) => {
    const s = soal[i];
    const b = { ...benar, [s.tingkat]: (benar[s.tingkat] ?? 0) + (id === s.kunci.id ? 1 : 0) };
    setBenar(b);
    // Berhenti lebih awal bila satu tingkat sudah jelas belum lancar.
    const tingkatSelesai = i % 2 === 1;
    if (i + 1 >= soal.length || (tingkatSelesai && (b[s.tingkat] ?? 0) < 2)) {
      const sr = saranTingkat(b);
      setSaran(sr);
      setPilih(sr);
      setTahap('pilih');
      return;
    }
    setI(i + 1);
    setTimeout(() => ucapkan(soal[i + 1].ucapan, 'en-US'), 250);
  };

  if (tahap === 'awal') {
    return (
      <Layar
        bawah={
          <View style={{ padding: 16, gap: 10 }}>
            <Tombol
              label="Mulai tes singkat"
              besar
              onPress={() => {
                setTahap('tes');
                ucapkan(soal[0].ucapan, 'en-US');
              }}
            />
            <Tombol label="Langsung pilih tingkat" varian="garis" onPress={() => setTahap('pilih')} />
          </View>
        }
      >
        <KepalaLayar judul="Bahasa Inggris" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <GelembungPinci judul="Tes singkat, yuk!" teks="Dengarkan kata dalam Bahasa Inggris, lalu ketuk gambarnya. Kira-kira 2 menit." suara />
        </View>
      </Layar>
    );
  }

  if (tahap === 'tes') {
    const s = soal[i];
    return (
      <Layar>
        <KepalaLayar judul="Tes singkat" />
        <View style={{ height: 10, borderRadius: 5, backgroundColor: warna.kremBatang, overflow: 'hidden' }}>
          <View style={{ width: `${(i / soal.length) * 100}%`, height: '100%', backgroundColor: warnaMapel.ing.utama }} />
        </View>
        <View style={{ alignItems: 'center', gap: 10, marginTop: 12 }}>
          <TombolSuara teks={s.ucapan} bahasa="en-US" ukuran={88} latar={warnaMapel.ing.utama} warnaIkon="#FFFFFF" />
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua }}>Dengar, lalu pilih gambarnya.</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {urutPilihan[i].map((p) => (
            <KartuGambar key={p.id} emoji={p.emoji} aksesLabel={p.arti} onPress={() => jawab(p.id)} />
          ))}
        </View>
      </Layar>
    );
  }

  return (
    <Layar
      bawah={
        <View style={{ padding: 16 }}>
          <Tombol
            label={`Mulai Tingkat ${pilih}`}
            besar
            onPress={async () => {
              await repo.ubahAnak({ ...anak, tingkatInggris: pilih });
              router.replace('/inggris');
            }}
          />
        </View>
      }
    >
      <KepalaLayar judul="Bahasa Inggris" />
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        <GelembungPinci
          judul={saran ? `Pinci menyarankan Tingkat ${saran}` : 'Pilih tingkatmu'}
          teks={saran ? 'Kamu boleh pilih yang lain.' : 'Semua tingkat boleh dipilih. Mulai dari Tingkat 3 kalau baru belajar.'}
        />
        {([3, 4, 5, 6] as Tingkat[]).map((t) => {
          const aktif = pilih === t;
          return (
            <Pressable
              key={t}
              accessibilityRole="radio"
              accessibilityState={{ checked: aktif }}
              accessibilityLabel={`Tingkat ${t}. ${KETERANGAN[t]}`}
              onPress={() => setPilih(t)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 24, borderWidth: 3, borderColor: aktif ? warnaMapel.ing.utama : '#E6DDF5', backgroundColor: aktif ? warnaMapel.ing.muda : warna.putih }}
            >
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: aktif ? warnaMapel.ing.utama : warnaMapel.ing.muda, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: aktif ? '#FFFFFF' : warnaMapel.ing.teks }}>{t}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 21, color: warna.teks }}>Tingkat {t}</Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>{KETERANGAN[t]}</Text>
              </View>
              {aktif ? (
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: warnaMapel.ing.utama, alignItems: 'center', justifyContent: 'center' }}>
                  <Ikon nama="centang" ukuran={16} warna="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </Layar>
  );
}
