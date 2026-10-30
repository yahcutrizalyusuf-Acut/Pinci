/** G02 Pilih tingkat: Santai atau Seru. Game berjenjang memakai layar Pilih level (1–5). */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { berjenjang, JUMLAH_LEVEL, KEMAJUAN_AWAL, kunciKemajuan, tingkatDariLevel, type KemajuanLevel, type Level } from '@/game/bersama/level';
import { GambarTempat, TEMPAT } from '@/game/peta/GambarTempat';
import { KepalaLayar } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';

const KETERANGAN_LEVEL: Record<Level, string> = {
  1: 'Pemanasan, pelan-pelan',
  2: 'Sedikit lebih banyak',
  3: 'Angka lebih besar',
  4: 'Makin seru',
  5: 'Paling seru',
};

function PilihLevel({ t }: { t: (typeof TEMPAT)[number] }) {
  const router = useRouter();
  const { anakAktif } = useData();
  const kemajuan = useMuat<KemajuanLevel>(
    async (r) => (anakAktif ? ((await r.nilai<KemajuanLevel>(kunciKemajuan(anakAktif.id, t.game))) ?? KEMAJUAN_AWAL) : KEMAJUAN_AWAL),
    KEMAJUAN_AWAL,
    [anakAktif?.id, t.game],
  );
  const levels = Array.from({ length: JUMLAH_LEVEL }, (_, i) => (i + 1) as Level);
  return (
    <Layar latar="#CFEBDC">
      <KepalaLayar judul="Pilih level" />
      <View style={{ alignItems: 'center', gap: 4 }}>
        <GambarTempat game={t.game} lebar={120} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>{t.judul}</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Selesaikan satu level untuk membuka level berikutnya.</Text>
      </View>
      <View style={{ gap: 10 }}>
        {levels.map((l, i) => {
          const terbuka = l <= kemajuan.terbuka;
          const selesai = kemajuan.selesai.includes(l);
          return (
            <Pressable
              key={l}
              accessibilityRole="button"
              accessibilityLabel={`Level ${l}. ${KETERANGAN_LEVEL[l]}${selesai ? '. Sudah selesai' : ''}${terbuka ? '' : '. Belum terbuka'}`}
              disabled={!terbuka}
              onPress={() => router.replace({ pathname: '/game/main', params: { nama: t.rute, tingkat: tingkatDariLevel(l), level: String(l) } })}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 12,
                marginLeft: i % 2 === 0 ? 0 : 36,
                marginRight: i % 2 === 0 ? 36 : 0,
                borderRadius: 22,
                backgroundColor: terbuka ? warna.putih : '#E6EFE9',
                borderWidth: 3,
                borderColor: l === kemajuan.terbuka && terbuka ? warna.oranye : terbuka ? warna.hijauDaun : '#C9D6CE',
                opacity: terbuka ? 1 : 0.7,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: terbuka ? warna.hijauDaun : '#C9D6CE', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: '#FFFFFF' }}>{terbuka ? l : '🔒'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>Level {l}</Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>{KETERANGAN_LEVEL[l]}</Text>
              </View>
              {selesai ? <Text style={{ fontSize: 26 }} accessibilityLabel="Sudah selesai">⭐</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </Layar>
  );
}

export default function PilihTingkat() {
  const { nama } = useLocalSearchParams<{ nama: string }>();
  const router = useRouter();
  const t = TEMPAT.find((x) => x.rute === nama) ?? TEMPAT[0];
  if (berjenjang(t.game)) return <PilihLevel t={t} />;
  const pilihan = [
    { tingkat: 'santai', judul: 'Santai', sub: 'Pelan-pelan, angka kecil', emoji: '🐢', latar: '#E4F4EB', garis: warna.hijauDaun },
    { tingkat: 'seru', judul: 'Seru', sub: 'Lebih banyak, angka besar', emoji: '🚀', latar: '#FFF0D9', garis: warna.oranye },
  ] as const;
  return (
    <Layar latar="#CFEBDC">
      <KepalaLayar judul="Pilih tingkat game" />
      <View style={{ alignItems: 'center', gap: 6 }}>
        <GambarTempat game={t.game} lebar={140} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 28, color: warna.teks }}>{t.judul}</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua }}>Mau main yang mana?</Text>
      </View>
      <View style={{ gap: 14 }}>
        {pilihan.map((p) => (
          <Pressable
            key={p.tingkat}
            accessibilityRole="button"
            accessibilityLabel={`${p.judul}. ${p.sub}`}
            onPress={() => router.replace({ pathname: '/game/main', params: { nama: t.rute, tingkat: p.tingkat } })}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 24, backgroundColor: p.latar, borderWidth: 3, borderColor: p.garis, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <Text style={{ fontSize: 44 }}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.teks }}>{p.judul}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>{p.sub}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua, textAlign: 'center' }}>Bisa ganti kapan saja.</Text>
    </Layar>
  );
}
