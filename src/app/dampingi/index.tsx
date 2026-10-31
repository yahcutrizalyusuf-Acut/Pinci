/** D2 Menu kegiatan Mode Dampingi. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { adaBacaGudang, paketLengkap, tkaTerbukaUntuk } from '@/fitur/konfig';
import { namaTopik } from '@/fitur/nama-topik';

function Kegiatan({ emoji, judul, sub, onPress, nonaktif }: { emoji: string; judul: string; sub: string; onPress: () => void; nonaktif?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${judul}. ${sub}`}
      disabled={nonaktif}
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, backgroundColor: warna.putih, opacity: nonaktif ? 0.45 : pressed ? 0.85 : 1 })}
    >
      <Text style={{ fontSize: 34 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks }}>{judul}</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>{sub}</Text>
      </View>
    </Pressable>
  );
}

export default function MenuDampingi() {
  const router = useRouter();
  const { mapel, topik } = useLocalSearchParams<{ mapel?: string; topik?: string }>();
  const { anakAktif, daftarAnak, pilihAnak, keluarga } = useData();
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const tkaBuka = useMuat(async (r) => (anakAktif ? tkaTerbukaUntuk(r, anakAktif.id) : false), false, [anakAktif?.id]);
  if (!anakAktif) return null;
  const k6 = paketLengkap(anakAktif.kelas);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {daftarAnak.length > 1 ? (
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {daftarAnak.map((a) => (
            <Pressable key={a.id} onPress={() => pilihAnak(a.id)} style={{ paddingHorizontal: 14, height: 40, borderRadius: 20, justifyContent: 'center', backgroundColor: a.id === anakAktif.id ? warna.oranyeMuda : warna.putih, borderWidth: 2, borderColor: a.id === anakAktif.id ? warna.oranye : warna.kremGaris }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15 }}>
                {HEWAN[a.hewan].emoji} {a.nama}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {topik ? (
        <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14, gap: 8 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: '#B86E00' }}>Topik yang perlu dibantu</Text>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18 }}>{namaTopik(mapel ?? '', topik)}</Text>
          <Kegiatan
            emoji="🤝"
            judul="Kerjakan bersama"
            sub="Soal dengan kunci untuk orang tua"
            onPress={() =>
              router.push(
                mapel === 'tka'
                  ? { pathname: '/tka/latihan', params: { topik, mode: 'dampingi' } }
                  : mapel === 'gudang'
                    ? { pathname: '/gudang/[id]', params: { id: topik, mode: 'dampingi' } }
                    : mapel === 'ing'
                      ? `/inggris/${topik}`
                      : '/dampingi/lancar',
              )
            }
          />
        </View>
      ) : null}
      <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teksKedua }}>
        Pilih kegiatan. {sapaan} membimbing, aplikasi menjadi alat bantu. Lembar yang didampingi tidak dihitung untuk naik level.
      </Text>
      <Kegiatan emoji="💪" judul={`Tantang ${sapaan}`} sub="Bergantian menjawab 10 soal Lancar" onPress={() => router.push('/dampingi/tantang')} />
      <Kegiatan emoji="🧮" judul="Lembar didampingi" sub="Soal Lancar + kalimat untuk diucapkan orang tua" onPress={() => router.push('/dampingi/lancar')} />
      <Kegiatan emoji="👂" judul="Dengar Bacaan" sub="Anak membaca nyaring, orang tua menandai kata yang tersandung" nonaktif={!adaBacaGudang(anakAktif.kelas)} onPress={() => router.push('/dampingi/baca')} />
      <Kegiatan emoji="📘" judul="TKA bersama" sub="Pilih topik di peta Siap TKA, kunci tampil untuk orang tua" nonaktif={!k6 || !tkaBuka} onPress={() => router.push('/dampingi/tka')} />
      <Kegiatan emoji="⏱️" judul="Pengawas simulasi" sub="Orang tua mengawasi simulasi 75 menit tanpa membantu" nonaktif={!k6 || !tkaBuka} onPress={() => router.push('/dampingi/pengawas')} />
    </ScrollView>
  );
}
