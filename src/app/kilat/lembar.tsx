/** Lembar Hitung Kilat: jam berjalan maju, cek otomatis, lalu ringkasan dan latihan ulang soal yang belum tepat. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { simpanLembarKilat, type RingkasKilat } from '@/fitur/kilat';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import { Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { LembarSoal } from '@/komponen/LembarSoal';
import { Pinci } from '@/komponen/Pinci';
import { buatLembarKilat, detikPerSoal, persenBenar, tahapKilat, tulisWaktu } from '@/mesin/kilat';
import type { SoalLancar } from '@/mesin/lancar';

export default function LembarKilat() {
  const router = useRouter();
  const { tahap: tahapParam } = useLocalSearchParams<{ tahap?: string }>();
  const tahap = Math.max(1, Number(tahapParam) || 1);
  const { repo, anakAktif } = useData();
  const [soal, setSoal] = useState<SoalLancar[] | null>(null);
  const [ulang, setUlang] = useState<SoalLancar[] | null>(null);
  const [ringkas, setRingkas] = useState<RingkasKilat | null>(null);
  const [putaran, setPutaran] = useState(0);
  const [jeda, setJeda] = useState(false);
  const mulai = useRef(0);
  const benih = useRef('');
  useHitungWaktu('belajar', jeda || !!ringkas, 'sendiri');

  // Hanya bergantung pada id anak: data anak dimuat ulang setelah lembar tersimpan, dan itu tidak boleh memulai lembar baru.
  const anakRef = useRef(anakAktif);
  useEffect(() => {
    anakRef.current = anakAktif;
  });
  const anakId = anakAktif?.id;
  useEffect(() => {
    const anak = anakRef.current;
    if (!anak) return;
    (async () => {
      const halangan = ruteHalangan(await cekBelajar(repo, anak));
      if (halangan) {
        router.replace(halangan);
        return;
      }
      benih.current = String(kiniMs());
      mulai.current = kiniMs();
      setRingkas(null);
      setUlang(null);
      setSoal(buatLembarKilat(tahap, anak.kelas, benih.current));
    })();
  }, [repo, anakId, router, tahap, putaran]);

  if (!anakAktif) return null;

  // Latihan ulang soal yang belum tepat: tidak dicatat, tanpa jam.
  if (ulang)
    return (
      <LembarSoal
        key={`ulang-${putaran}`}
        soal={ulang}
        kelas={anakAktif.kelas}
        cekOtomatis
        onKeluar={() => setUlang(null)}
        onSelesai={() => setUlang(null)}
      />
    );

  if (ringkas) {
    const h = ringkas.hasil;
    return (
      <Layar
        bawah={
          <View style={{ padding: 16, gap: 10 }}>
            {ringkas.belumTepat.length ? <Tombol label={`Latih lagi ${ringkas.belumTepat.length} soal yang belum tepat`} varian="garis" onPress={() => setUlang(ringkas.belumTepat.map((j) => j.soal))} /> : null}
            <Tombol label="Lembar lagi" besar onPress={() => setPutaran((p) => p + 1)} />
            <Tombol label="Selesai" varian="garis" onPress={() => router.replace('/kilat')} />
          </View>
        }
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 12, paddingTop: 12 }}>
          <Pinci ekspresi="merayakan" ukuran={110} />
          <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>Lembar selesai!</Text>
          {ringkas.naikKe ? (
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua, textAlign: 'center' }}>Tahap {ringkas.naikKe} terbuka: {tahapKilat(ringkas.naikKe).nama} ⭐</Text>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
            {[
              ['waktu', tulisWaktu(h.detik)],
              ['tepat', `${h.benar}/${h.jumlah}`],
              ['dtk/soal', String(detikPerSoal(h)).replace('.', ',')],
            ].map(([l, n]) => (
              <View key={l} style={{ flex: 1, backgroundColor: warna.putih, borderRadius: 16, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: huruf.judul, fontSize: 24, color: warna.teks }}>{n}</Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua }}>{l}</Text>
              </View>
            ))}
          </View>
          {ringkas.rekorBaru ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: warna.hijauTua }}>Waktu tercepatmu sejauh ini!</Text> : null}
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua, textAlign: 'center' }}>
            {persenBenar(h) >= 95 ? 'Tepat dan fokus sampai akhir. Hebat!' : 'Kamu bertahan sampai soal terakhir. Itu latihan fokus yang bagus.'}
          </Text>
          {ringkas.belumTepat.length ? (
            <View style={{ alignSelf: 'stretch', backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 4 }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: '#B86E00' }}>Yang perlu dilatih lagi</Text>
              {ringkas.belumTepat.map((j, i) => (
                <Text key={i} style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>
                  {j.soal.teks} = {j.soal.kunci}
                </Text>
              ))}
            </View>
          ) : null}
          <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksRedup }}>Tersimpan ✓</Text>
        </ScrollView>
      </Layar>
    );
  }

  if (!soal) return null;
  return (
    <LembarSoal
      key={`lembar-${putaran}`}
      soal={soal}
      kelas={anakAktif.kelas}
      jam
      cekOtomatis
      lamaTampilBenar={1000}
      onJedaBerubah={setJeda}
      onKeluar={() => router.back()}
      onSelesai={async (jawaban) => setRingkas(await simpanLembarKilat(repo, anakAktif, { tahap, benih: benih.current, mulai: mulai.current, mode: 'sendiri' }, jawaban))}
    />
  );
}
