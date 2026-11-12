/**
 * Hitung Kilat: latihan cepat hitung dasar di bawah 10 (keputusan Acut 12 Nov 2026).
 * Anak memilih tahap yang sudah terbuka, melihat riwayat dan rekor waktunya, lalu mulai lembar.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { riwayatKilat, WARNA_KILAT } from '@/fitur/kilat';
import { Ikon } from '@/komponen/Ikon';
import { KepalaLayar, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { detikPerSoal, jumlahSoal, persenBenar, rekorTahap, TAHAP_KILAT, tahapMaks, tahapSekarang, targetDetik, tulisWaktu } from '@/mesin/kilat';

export default function HitungKilat() {
  const router = useRouter();
  const { anakAktif } = useData();
  const riwayat = useMuat(async (r) => (anakAktif ? riwayatKilat(r, anakAktif.id) : []), [], [anakAktif?.id]);
  const [pilihan, setPilihan] = useState<number | null>(null);
  if (!anakAktif) return null;
  const kelas = anakAktif.kelas;
  const sekarang = tahapSekarang(riwayat, kelas);
  const tahap = pilihan ?? sekarang;
  const rekor = rekorTahap(riwayat, tahap);
  const terakhir = [...riwayat].reverse().slice(0, 5);
  return (
    <Layar bawah={<View style={{ padding: 16 }}><Tombol label={`Mulai: ${TAHAP_KILAT[tahap - 1].nama}`} besar onPress={() => router.push({ pathname: '/kilat/lembar', params: { tahap: String(tahap) } })} /></View>}>
      <KepalaLayar judul="Hitung Kilat" />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 12 }}>
        <View style={{ backgroundColor: WARNA_KILAT.muda, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: WARNA_KILAT.utama, alignItems: 'center', justifyContent: 'center' }}>
            <Ikon nama="kilat" ukuran={30} warna={warna.putih} />
          </View>
          <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>
            {jumlahSoal(kelas)} soal hitung dasar. Jawab dengan tepat dan secepat yang kamu bisa. Waktunya berjalan dan dicatat.
          </Text>
        </View>

        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>Tahap</Text>
        <View style={{ gap: 8 }}>
          {TAHAP_KILAT.slice(0, tahapMaks(kelas)).map((t) => {
            const terbuka = t.no <= sekarang;
            const dipilih = t.no === tahap;
            return (
              <Pressable
                key={t.no}
                accessibilityRole="radio"
                accessibilityState={{ checked: dipilih, disabled: !terbuka }}
                accessibilityLabel={`Tahap ${t.no}: ${t.nama}${terbuka ? '' : ', belum terbuka'}`}
                disabled={!terbuka}
                onPress={() => setPilihan(t.no)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 2, borderColor: dipilih ? WARNA_KILAT.utama : warna.kremGaris, backgroundColor: dipilih ? WARNA_KILAT.muda : warna.putih, opacity: terbuka ? 1 : 0.45 }}
              >
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: terbuka ? WARNA_KILAT.utama : warna.kremGaris, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: warna.putih }}>{t.no}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: huruf.anakTebal, fontSize: 17, color: warna.teks }}>{t.nama}</Text>
                {t.no < sekarang ? <Text style={{ fontSize: 18 }}>⭐</Text> : t.no === sekarang ? <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: WARNA_KILAT.teks }}>sedang dilatih</Text> : <Ikon nama="gembok" ukuran={18} warna={warna.teksRedup} />}
              </Pressable>
            );
          })}
        </View>
        <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>
          Tahap berikutnya terbuka setelah 2 lembar hampir semua tepat dan rata-rata {targetDetik(kelas)} detik per soal.
        </Text>

        {rekor !== null ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Waktu tercepatmu di tahap ini</Text>
            <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>⏱ {tulisWaktu(rekor)}</Text>
          </View>
        ) : null}

        {terakhir.length ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 6 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 16, color: warna.teks }}>Lembar terakhir</Text>
            {terakhir.map((h) => (
              <View key={h.mulai} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>
                  {new Date(h.mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · tahap {h.tahap}
                </Text>
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.teks }}>
                  {tulisWaktu(h.detik)} · {h.benar}/{h.jumlah} · {String(detikPerSoal(h)).replace('.', ',')} dtk/soal
                </Text>
              </View>
            ))}
            <Text style={{ fontFamily: huruf.anak, fontSize: 12, color: warna.teksRedup }}>Tepat rata-rata {Math.round(terakhir.reduce((a, h) => a + persenBenar(h), 0) / terakhir.length)}%</Text>
          </View>
        ) : null}
      </ScrollView>
    </Layar>
  );
}
