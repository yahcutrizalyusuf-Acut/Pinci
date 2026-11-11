/** Daftar 12 unit di tingkat yang dipilih, dengan tanda selesai dan kata yang perlu diulang. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { jatuhTempo, type KataUlang } from '@/fitur/inggris';
import { cekDengarTerbuka, rujukanCekDengar } from '@/fitur/komik';
import { komikUnit } from '@/isi/inggris/paketKomik';
import { PAKET_INGGRIS } from '@/isi/inggris/paket';
import { KepalaLayar } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';
import { useAkses } from '@/fitur/akses';
import { LayarTerkunci } from '@/komponen/LayarTerkunci';

function DaftarUnit() {
  const router = useRouter();
  const { anakAktif } = useData();
  const anak = anakAktif!;
  const tingkat = anak.tingkatInggris ?? 3;
  const paket = PAKET_INGGRIS[tingkat];
  const data = useMuat(
    async (r) => {
      const sesi = await r.daftarSesi(anak.id, 'inggris');
      // Unit selesai = Sesi B (atau sesi lama sebelum ada Sesi A/B); Sesi A saja ditandai "A".
      const selesai = new Set(sesi.filter((s) => s.tambahan?.sesi !== 'a' && !s.tambahan?.cekDengar).map((s) => s.rujukan));
      const sesiA = new Set(sesi.filter((s) => s.tambahan?.sesi === 'a').map((s) => s.rujukan));
      const cek = new Set(sesi.filter((s) => s.tambahan?.cekDengar).map((s) => s.rujukan));
      const antre = (await r.nilai<KataUlang[]>(`inggris_ulang:${anak.id}`)) ?? [];
      return { selesai, sesiA, cek, ulang: jatuhTempo(antre, Date.now()).length };
    },
    { selesai: new Set<string | undefined>(), sesiA: new Set<string | undefined>(), cek: new Set<string | undefined>(), ulang: 0 },
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
          const adaA = data.sesiA.has(u.id);
          const ini = u.id === berikut.id;
          const keCek = u.nomor % 4 === 0 ? u.nomor / 4 : 0;
          const rujukCek = rujukanCekDengar(tingkat, keCek);
          const kartuCek = keCek ? (
            <Pressable
              key={rujukCek}
              accessibilityRole="button"
              accessibilityLabel={`Cek Dengar ${keCek}`}
              disabled={!cekDengarTerbuka(paket, keCek, data.selesai)}
              onPress={() => router.push({ pathname: '/inggris/cek-dengar', params: { ke: String(keCek) } })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, backgroundColor: warna.putih, borderWidth: 2, borderStyle: 'dashed', borderColor: warnaMapel.ing.utama, opacity: cekDengarTerbuka(paket, keCek, data.selesai) ? 1 : 0.5 }}
            >
              <Text style={{ fontSize: 26 }}>👂</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: warna.teks }}>Cek Dengar {keCek}</Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>
                  {cekDengarTerbuka(paket, keCek, data.selesai) ? '8 soal dengar dari 4 unit terakhir' : `Terbuka setelah unit ${u.nomor - 3}–${u.nomor} selesai`}
                </Text>
              </View>
              {data.cek.has(rujukCek) ? <Ikon nama="bintang" ukuran={22} warna={warna.oranye} isi /> : null}
            </Pressable>
          ) : null;
          return [
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
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warnaMapel.ing.teks }}>
                  Unit {u.nomor} · {u.judul}
                  {komikUnit(u.id) ? ' · 📖 komik' : ''}
                </Text>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>{u.tema}</Text>
              </View>
              {sudah ? (
                <Ikon nama="bintang" ukuran={24} warna={warna.oranye} isi />
              ) : adaA ? (
                <Pressable accessibilityRole="button" accessibilityLabel={`Lanjut Sesi B unit ${u.nomor}`} onPress={() => router.push(`/inggris/${u.id}?sesi=b`)} style={{ paddingHorizontal: 10, height: 34, borderRadius: 17, backgroundColor: warnaMapel.ing.utama, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.putih }}>Sesi B</Text>
                </Pressable>
              ) : (
                <Ikon nama="kanan" ukuran={22} />
              )}
            </Pressable>,
            kartuCek,
          ];
        })}
      </ScrollView>
    </Layar>
  );
}

export default function DaftarUnitTerjaga() {
  const akses = useAkses();
  return akses.inggris ? <DaftarUnit /> : <LayarTerkunci judul="Bahasa Inggris" />;
}
