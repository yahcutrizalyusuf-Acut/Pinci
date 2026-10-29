/** O10 Ruang anak: riwayat latihan dan pesan dua arah dalam satu linimasa gaya WhatsApp. */
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN, type Pesan, type Sesi } from '@/data/jenis';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { jam, waktuRelatif } from '@/fitur/kabar';
import { STIKER_ANAK } from '@/fitur/pesan';
import { KepalaLayar } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';

const JUDUL: Record<Sesi['jenis'], { judul: string; w: string }> = {
  penempatan: { judul: 'Tes singkat Lancar', w: warnaMapel.mat.utama },
  lancar: { judul: 'Lancar Matematika', w: warnaMapel.mat.utama },
  tka: { judul: 'Siap TKA', w: warnaMapel.mat.utama },
  simulasi: { judul: 'Simulasi TKA', w: warnaMapel.mat.utama },
  mini_tryout: { judul: 'Mini try out', w: warnaMapel.mat.utama },
  baca: { judul: 'Baca Ulang', w: warnaMapel.bi.utama },
  inggris: { judul: 'Bahasa Inggris', w: warnaMapel.ing.utama },
  kartu: { judul: 'Kartu ilmu', w: warnaMapel.gudang.utama },
  game: { judul: 'Waktu main', w: warnaMapel.dampingi.utama },
};

const BALASAN_CEPAT = ['Wah, hebat! {s} bangga.', 'Terus semangat, ya!', 'Nanti kita latihan bersama.'];

type Item = { jenis: 'sesi'; waktu: string; sesi: Sesi } | { jenis: 'pesan'; waktu: string; pesan: Pesan };

function KartuSesi({ s }: { s: Sesi }) {
  const j = JUDUL[s.jenis];
  const det = Number(s.tambahan?.detikLembar ?? s.durasiDetik);
  const kpm = s.tambahan?.kpm;
  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: '82%', backgroundColor: warna.putih, borderRadius: 20, borderTopLeftRadius: 6, overflow: 'hidden' }}>
      <View style={{ height: 6, backgroundColor: j.w }} />
      <View style={{ padding: 14, gap: 4 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warnaMapel.mat.teks }}>
          {j.judul}
          {s.level ? ` · ${s.jenis === 'inggris' ? 'Unit' : 'Level'} ${s.level}` : ''}
          {s.mode === 'dampingi' ? ' · didampingi' : ''}
        </Text>
        <Text style={{ fontFamily: huruf.ortu, color: warna.teks }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 30 }}>
            {s.benar}/{s.jumlah}
          </Text>
          <Text style={{ fontSize: 16 }}> benar</Text>
        </Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
          {Math.floor(det / 60)} menit {det % 60} detik{kpm ? ` · ${kpm} kata per menit` : ''}
        </Text>
        {s.tambahan?.rekorBaru ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: warna.oranyeMuda, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13 }}>Rekor baru!</Text>
          </View>
        ) : null}
        <Text style={{ alignSelf: 'flex-end', fontFamily: huruf.ortu, fontSize: 12, color: warna.teksRedup }}>{jam(s.selesai)}</Text>
      </View>
    </View>
  );
}

export default function RuangAnak() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo, daftarAnak, keluarga } = useData();
  const anak = daftarAnak.find((a) => a.id === id);
  const [teks, setTeks] = useState('');
  const gulir = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const item = useMuat(
    async (r) => {
      if (!anak) return [] as Item[];
      const sesi = (await r.daftarSesi(anak.id)).filter((s) => s.jenis !== 'game');
      const pesan = await r.daftarPesan(anak.id);
      await r.tandaiDibaca(anak.id, 'anak');
      const semua: Item[] = [
        ...sesi.map((s) => ({ jenis: 'sesi' as const, waktu: s.selesai, sesi: s })),
        ...pesan.map((p) => ({ jenis: 'pesan' as const, waktu: p.waktu, pesan: p })),
      ];
      return semua.sort((a, b) => a.waktu.localeCompare(b.waktu)).slice(-80);
    },
    [] as Item[],
    [anak?.id],
  );
  if (!anak) return null;
  const terakhir = [...item].reverse().find((x) => x.jenis === 'sesi');
  const kirim = async (isi: string) => {
    const t = isi.trim();
    if (!t) return;
    await repo.kirimPesan({ anak_id: anak.id, dari: 'orang_tua', jenis: 'teks', isi: t.slice(0, 200) });
    setTeks('');
    setTimeout(() => gulir.current?.scrollToEnd({ animated: true }), 80);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.putih }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: warna.abuGaris }}>
          <KepalaLayar
            ortu
            judul=""
            kanan={
              <View style={{ position: 'absolute', left: 52, right: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: HEWAN[anak.hewan].latar, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{HEWAN[anak.hewan].emoji}</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>
                    {anak.nama} · Kelas {anak.kelas}
                  </Text>
                  <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
                    {terakhir ? `Terakhir latihan ${waktuRelatif(terakhir.waktu)}` : 'Belum ada latihan'}
                  </Text>
                </View>
              </View>
            }
          />
        </View>
        <ScrollView
          ref={gulir}
          style={{ flex: 1, backgroundColor: warna.abuTerang }}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          onContentSizeChange={() => gulir.current?.scrollToEnd({ animated: false })}
        >
          {item.length === 0 ? (
            <Text style={{ fontFamily: huruf.ortu, color: warna.teksKedua, textAlign: 'center', marginTop: 32 }}>Belum ada kegiatan. Hasil latihan akan muncul di sini.</Text>
          ) : null}
          {item.map((x, k) => {
            const label = (w: string) => (waktuRelatif(w).includes('.') ? 'Hari ini' : waktuRelatif(w));
            const h = label(x.waktu);
            const tampil = k === 0 || h !== label(item[k - 1].waktu);
            return (
              <View key={x.jenis === 'sesi' ? x.sesi.id : x.pesan.id} style={{ gap: 10 }}>
                {tampil ? (
                  <View style={{ alignSelf: 'center', backgroundColor: warna.abuGaris, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warna.teksKedua }}>{h}</Text>
                  </View>
                ) : null}
                {x.jenis === 'sesi' ? (
                  <KartuSesi s={x.sesi} />
                ) : x.pesan.dari === 'orang_tua' ? (
                  <View style={{ alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: warna.hijauMuda, borderRadius: 20, borderTopRightRadius: 6, padding: 12, gap: 4 }}>
                    <Text style={{ fontFamily: huruf.ortu, fontSize: 16, color: warna.teks }}>{x.pesan.isi}</Text>
                    <Text style={{ alignSelf: 'flex-end', fontFamily: huruf.ortu, fontSize: 12, color: warna.hijauTua }}>
                      {jam(x.pesan.waktu)} {x.pesan.dibaca ? '✓✓' : '✓'}
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignSelf: 'flex-start', backgroundColor: warna.putih, borderRadius: 20, borderTopLeftRadius: 6, padding: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>{STIKER_ANAK.find((s) => s.kode === x.pesan.isi)?.emoji ?? '💬'}</Text>
                    <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15 }}>
                      {(STIKER_ANAK.find((s) => s.kode === x.pesan.isi)?.label ?? '').replace('{ortu}', sapaan)}
                    </Text>
                    <Text style={{ fontFamily: huruf.ortu, fontSize: 12, color: warna.teksRedup }}>{jam(x.pesan.waktu)}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, backgroundColor: warna.abuTerang }} contentContainerStyle={{ gap: 8, padding: 10 }}>
          {BALASAN_CEPAT.map((b) => (
            <Pressable
              key={b}
              accessibilityRole="button"
              onPress={() => kirim(b.replace('{s}', sapaan))}
              style={{ paddingHorizontal: 14, height: 40, borderRadius: 20, justifyContent: 'center', borderWidth: 1, borderColor: '#B9E2C8', backgroundColor: warna.putih }}
            >
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.hijauTua }}>{b.replace('{s}', sapaan)}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 10, padding: 10, alignItems: 'center', backgroundColor: warna.abuTerang }}>
          <TextInput
            value={teks}
            onChangeText={setTeks}
            placeholder="Tulis pesan…"
            placeholderTextColor={warna.teksRedup}
            accessibilityLabel="Tulis pesan untuk anak"
            maxLength={200}
            style={{ flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: warna.abuGaris, backgroundColor: warna.putih, paddingHorizontal: 18, fontFamily: huruf.ortu, fontSize: 16 }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kirim"
            onPress={() => kirim(teks)}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: warna.hijauTua, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ikon nama="kirim" ukuran={20} warna="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
