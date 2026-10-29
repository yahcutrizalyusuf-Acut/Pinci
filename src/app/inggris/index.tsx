/** Daftar 12 unit di tingkat yang dipilih, dengan tanda selesai dan kata yang perlu diulang. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { jatuhTempo, type KataUlang } from '@/fitur/inggris';
import { PAKET_INGGRIS } from '@/isi/inggris/paket';
import { KepalaLayar } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';

export default function DaftarUnit() {
  const router = useRouter();
  const { anakAktif } = useData();
  const anak = anakAktif!;
  const tingkat = anak.tingkatInggris ?? 3;
  const paket = PAKET_INGGRIS[tingkat];
  const data = useMuat(
    async (r) => {
      const selesai = new Set((await r.daftarSesi(anak.id, 'inggris')).map((s) => s.rujukan));
      const antre = (await r.nilai<KataUlang[]>(`inggris_ulang:${anak.id}`)) ?? [];
      return { selesai, ulang: jatuhTempo(antre, Date.now()).length };
    },
    { selesai: new Set<string | undefined>(), ulang: 0 },
    [anak.id],
  );
  const berikut = paket.unit.find((u) => !data.selesai.has(u.id)) ?? paket.unit[0];
  return (
    <Layar>
      <KepalaLayar
        judul={`Bahasa Inggris · Tingkat ${tingkat}`}
        kanan={
          <Pressable accessibilityRole="button" onPress={() => router.push('/inggris/tingkat')} style={{ padding: 8 }}>
            <Text style={{ fontFamily: huruf.anakTebal, color: warnaMapel.ing.teks }}>Ganti</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 16 }}>
        {data.ulang > 0 ? (
          <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 12 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>🔁 Ada {data.ulang} kata untuk diulang. Kata itu muncul lagi di unit berikutnya.</Text>
          </View>
        ) : null}
        {paket.unit.map((u) => {
          const sudah = data.selesai.has(u.id);
          const ini = u.id === berikut.id;
          return (
            <Pressable
              key={u.id}
              accessibilityRole="button"
              accessibilityLabel={`Unit ${u.nomor}. ${u.tema}`}
              onPress={() => router.push(`/inggris/${u.id}`)}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, backgroundColor: ini ? warnaMapel.ing.muda : warna.putih, borderWidth: ini ? 2 : 0, borderColor: warnaMapel.ing.utama, opacity: pressed ? 0.85 : 1 })}
            >
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: warnaMapel.ing.muda, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 28 }}>{u.kosakata[0]?.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warnaMapel.ing.teks }}>Unit {u.nomor} · {u.judul}</Text>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>{u.tema}</Text>
              </View>
              {sudah ? <Ikon nama="bintang" ukuran={24} warna={warna.oranye} isi /> : <Ikon nama="kanan" ukuran={22} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </Layar>
  );
}
