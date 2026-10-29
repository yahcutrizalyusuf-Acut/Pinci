/** A03 Beranda Belajar. Dari sini ke soal pertama ≤ 2 ketukan. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { modeData } from '@/data/sinkron';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { hariIni } from '@/fitur/hari-ini';
import { paketLengkap, tkaTerbuka } from '@/fitur/konfig';
import { infoLancarAnak } from '@/fitur/lancar';
import { GelembungPinci, Logo, TombolSuara } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { KartuMapel } from '@/komponen/KartuMapel';

export default function BerandaBelajar() {
  const router = useRouter();
  const { anakAktif, keluarga } = useData();
  const anak = anakAktif!;
  const data = useMuat(
    async (repo) => {
      const pesan = (await repo.daftarPesan(anak.id)).filter((p) => p.dari === 'orang_tua');
      const terakhir = pesan[pesan.length - 1] ?? null;
      const antre = (await repo.antreanBelumTerkirim()).length;
      const h = await hariIni(repo, anak);
      const lancar = await infoLancarAnak(repo, anak);
      return { terakhir, antre, h, lancar };
    },
    null,
    [anak.id],
  );
  const lengkap = paketLengkap(anak.kelas);
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const sudah = (j: string) => (data?.h.sesi ?? []).some((s) => s.jenis === j);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.kremLembut }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 12, gap: 16, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
          <Logo />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {data && data.antre > 0 && modeData() === 'supabase' ? (
              <View accessibilityLabel="Ada hasil yang belum terkirim" style={{ padding: 8, opacity: 0.6 }}>
                <Ikon nama="awan" ukuran={20} warna={warna.teksKedua} />
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mode Dampingi"
              onPress={() => router.push({ pathname: '/ortu/pin', params: { tujuan: '/dampingi' } })}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', opacity: 0.45 }}
            >
              <Ikon nama="dua_orang" ukuran={20} warna={warna.teksKedua} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mode orang tua"
              onPress={() => router.push('/ortu/pin')}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', opacity: 0.45 }}
            >
              <Ikon nama="gembok" ukuran={20} warna={warna.teksKedua} />
            </Pressable>
          </View>
        </View>

        <GelembungPinci
          judul={`Halo, ${anak.nama}!`}
          teks={data?.h.inti ? 'Inti hari ini sudah selesai. Pintar itu seru!' : 'Yuk, kita cari tahu hari ini.'}
        />

        {data?.terakhir ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.navigate('/anak/pesan')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: warna.putih, borderWidth: 1, borderColor: warna.kremGaris }}
          >
            <TombolSuara teks={`Dari ${sapaan}. ${data.terakhir.isi}`} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Dari {sapaan}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, lineHeight: 21, color: warna.teks }}>{data.terakhir.isi}</Text>
            </View>
          </Pressable>
        ) : null}

        <View style={{ gap: 12 }}>
          <KartuMapel
            judul="Lancar Matematika"
            sub={data ? data.lancar.keterangan : 'Memuat…'}
            ikon="hitung"
            {...warnaMapel.mat}
            selesai={sudah('lancar')}
            onPress={() => router.push(data?.lancar.perluPenempatan ? '/lancar/penempatan' : data?.lancar.perluJurus ? '/lancar/jurus' : '/lancar/lembar')}
          />
          {lengkap ? (
            <KartuMapel
              judul="Baca Ulang"
              sub="Baca, dengar, baca lagi"
              ikon="bacaan"
              {...warnaMapel.bi}
              selesai={sudah('baca')}
              onPress={() => router.push('/baca')}
            />
          ) : null}
          {lengkap ? (
            <KartuMapel
              judul="Siap TKA"
              sub={tkaTerbuka() ? 'Matematika dan Bahasa Indonesia' : 'Dibuka 4 Januari'}
              ikon="rapor"
              utama={warnaMapel.mat.utama}
              muda="#EAF2FF"
              teks={warnaMapel.mat.teks}
              lencana="TKA"
              selesai={sudah('tka') || sudah('mini_tryout') || sudah('simulasi')}
              onPress={() => router.push('/tka')}
            />
          ) : null}
          <KartuMapel
            judul="Bahasa Inggris"
            sub={anak.tingkatInggris ? `Tingkat ${anak.tingkatInggris}` : 'Pilih tingkatmu'}
            ikon="inggris"
            {...warnaMapel.ing}
            selesai={sudah('inggris')}
            onPress={() => router.push(anak.tingkatInggris ? '/inggris' : '/inggris/tingkat')}
          />
          {!lengkap ? (
            <View style={{ padding: 16, borderRadius: 20, backgroundColor: warna.putih, borderWidth: 1, borderColor: warna.kremGaris, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>📦</Text>
              <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
                Paket kelasmu sedang disiapkan. Sambil menunggu, ada Lancar, Bahasa Inggris, dan game.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
