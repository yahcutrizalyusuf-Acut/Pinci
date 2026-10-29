/** A08 Pesan: pesan dari orang tua; anak membalas dengan stiker (tanpa papan ketik). */
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { TombolSuara } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { STIKER_ANAK } from '@/fitur/pesan';

function labelHari(iso: string) {
  const d = new Date(iso);
  const h = new Date();
  const kemarin = new Date(h.getFullYear(), h.getMonth(), h.getDate() - 1);
  if (d.toDateString() === h.toDateString()) return 'Hari ini';
  if (d.toDateString() === kemarin.toDateString()) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
}

export default function PesanAnak() {
  const { repo, anakAktif, keluarga } = useData();
  const anak = anakAktif!;
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const pesan = useMuat((r) => r.daftarPesan(anak.id), [], [anak.id]);
  const gulir = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (pesan.some((p) => p.dari === 'orang_tua' && !p.dibaca)) repo.tandaiDibaca(anak.id, 'orang_tua').catch(() => undefined);
    setTimeout(() => gulir.current?.scrollToEnd({ animated: true }), 50);
  }, [pesan, repo, anak.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.putih }} edges={['top', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, height: 64, borderBottomWidth: 1, borderBottomColor: warna.kremGaris }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6F0FF', alignItems: 'center', justifyContent: 'center' }}>
          <Ikon nama="orang" ukuran={22} warna="#2A5DB0" />
        </View>
        <Text style={{ fontFamily: huruf.judul, fontSize: 24, color: warna.teks }}>{sapaan}</Text>
      </View>
      <ScrollView ref={gulir} style={{ flex: 1, backgroundColor: warna.kremLembut }} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {pesan.length === 0 ? (
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua, textAlign: 'center', marginTop: 40 }}>
            Belum ada pesan. Kirim stiker ke {sapaan}, yuk!
          </Text>
        ) : null}
        {pesan.map((p, k) => {
          const hari = labelHari(p.waktu);
          const tampilHari = k === 0 || hari !== labelHari(pesan[k - 1].waktu);
          const dariOrtu = p.dari === 'orang_tua';
          return (
            <View key={p.id} style={{ gap: 10 }}>
              {tampilHari ? (
                <View style={{ alignSelf: 'center', backgroundColor: '#F1E9D8', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>{hari}</Text>
                </View>
              ) : null}
              {dariOrtu ? (
                <View style={{ alignSelf: 'flex-start', maxWidth: '88%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: warna.putih, borderRadius: 20, borderTopLeftRadius: 6, padding: 12 }}>
                  <TombolSuara teks={p.isi} />
                  <Text style={{ flexShrink: 1, fontFamily: huruf.anak, fontSize: 18, lineHeight: 24, color: warna.teks }}>{p.isi}</Text>
                </View>
              ) : (
                <View style={{ alignSelf: 'flex-end', backgroundColor: warna.hijauPil, borderRadius: 20, borderTopRightRadius: 6, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>{STIKER_ANAK.find((s) => s.kode === p.isi)?.emoji ?? '💬'}</Text>
                  <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.hijauTua }}>{STIKER_ANAK.find((s) => s.kode === p.isi)?.label ?? ''}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10, borderTopWidth: 1, borderTopColor: warna.kremGaris }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Balas dengan stiker</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 }}>
          {STIKER_ANAK.map((s) => (
            <Pressable
              key={s.kode}
              accessibilityRole="button"
              accessibilityLabel={s.label}
              onPress={() => repo.kirimPesan({ anak_id: anak.id, dari: 'anak', jenis: s.kode === 'bantu' ? 'bantu_aku' : 'stiker', isi: s.kode })}
              style={({ pressed }) => ({ width: '33.33%', alignItems: 'center', gap: 4, opacity: pressed ? 0.6 : 1 })}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF6E5', borderWidth: 2, borderColor: '#F1E6CF', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30 }}>{s.emoji}</Text>
              </View>
              <Text numberOfLines={2} style={{ fontFamily: huruf.anak, fontSize: 13, textAlign: 'center', color: warna.teks }}>
                {s.label.replace('{ortu}', sapaan)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
