/** B06/K13 Siap TKA: peta 36 topik dan kesiapan per topik, rencana minggu ini, mini try out, simulasi. */
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { tkaTerbukaUntuk, TKA_BUKA } from '@/fitur/konfig';
import { miniMingguIni, persenTopik, rencanaMinggu, statusTopik, MAPEL_TKA } from '@/fitur/tka';
import { paketTka } from '@/isi/tka/paket';
import { GelembungPinci, KepalaLayar } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';

const WARNA_STATUS = { belum: { latar: warna.putih, garis: warna.kremBatang }, latihan: { latar: '#FFF6D6', garis: '#F4C542' }, kuasai: { latar: warna.hijauMuda, garis: warna.hijauDaun } };

export default function SiapTka() {
  const router = useRouter();
  const { anakAktif } = useData();
  const anak = anakAktif!;
  const data = useMuat(
    async (r) => {
      const kemajuan = await r.kemajuanTopik(anak.id, MAPEL_TKA);
      const sesi = await r.daftarSesi(anak.id);
      const sesiTka = sesi.filter((s) => ['tka', 'simulasi', 'mini_tryout'].includes(s.jenis));
      return { buka: await tkaTerbukaUntuk(r, anak.id), kemajuan, rencana: rencanaMinggu(paketTka, kemajuan, sesiTka, new Date()), miniSelesai: miniMingguIni(sesi, new Date()), simSelesai: new Set(sesi.filter((s) => s.jenis === 'simulasi').map((s) => s.rujukan)) };
    },
    null,
    [anak.id],
  );
  if (!data) {
    return (
      <Layar>
        <KepalaLayar judul="Siap TKA" />
      </Layar>
    );
  }
  if (!data.buka) {
    const t = new Date(`${TKA_BUKA}T00:00:00`);
    return (
      <Layar>
        <KepalaLayar judul="Siap TKA" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <GelembungPinci ekspresi="semangat" judul="Segera dibuka!" teks={`Latihan TKA dibuka ${t.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}. Sambil menunggu, latihan Lancar dan Baca Ulang, ya.`} />
        </View>
      </Layar>
    );
  }
  const peta = new Map((data?.kemajuan ?? []).map((k) => [k.topik, k]));
  const mingguIni = new Set([data?.rencana.topikBaru?.id, data?.rencana.ulang?.id, ...(data?.rencana.lemah.map((l) => l.topik.id) ?? [])].filter(Boolean));
  const kuasai = paketTka.topik.filter((t) => statusTopik(peta.get(t.id)) === 'kuasai').length;

  const grup = (mapel: 'mat' | 'bi') => (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warnaMapel[mapel].teks }}>{warnaMapel[mapel].nama}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {paketTka.topik
          .filter((t) => t.mapel === mapel)
          .map((t) => {
            const k = peta.get(t.id);
            const st = statusTopik(k);
            const p = persenTopik(k);
            const w = WARNA_STATUS[st];
            return (
              <Pressable
                key={t.id}
                accessibilityRole="button"
                accessibilityLabel={`${t.id} ${t.judul}. ${st === 'kuasai' ? 'Dikuasai' : st === 'latihan' ? `Latihan ${p}%` : 'Belum'}`}
                onPress={() => router.push(t.simulasi ? { pathname: '/tka/simulasi', params: { id: paketTka.simulasi.find((s) => s.dipakaiDi === t.id)?.id ?? 'S1' } } : `/tka/topik/${t.id}`)}
                style={({ pressed }) => ({ width: '31.5%', minHeight: 84, borderRadius: 14, borderWidth: 2, borderColor: w.garis, backgroundColor: w.latar, padding: 8, gap: 2, opacity: pressed ? 0.8 : 1 })}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warnaMapel[mapel].teks }}>{t.id}</Text>
                  {st === 'kuasai' ? <Ikon nama="centang" ukuran={14} warna={warna.hijauTua} /> : p !== null ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 11, color: '#7A5B00' }}>{p}%</Text> : null}
                </View>
                <Text numberOfLines={3} style={{ fontFamily: huruf.anak, fontSize: 12, lineHeight: 15, color: warna.teks }}>
                  {t.simulasi ? `Simulasi · ${t.judul}` : t.judul}
                </Text>
                {mingguIni.has(t.id) ? (
                  <View style={{ alignSelf: 'flex-start', backgroundColor: warna.oranye, borderRadius: 999, paddingHorizontal: 6 }}>
                    <Text style={{ fontFamily: huruf.anakTebal, fontSize: 10, color: warna.teks }}>minggu ini</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
      </View>
    </View>
  );

  return (
    <Layar tanpaPadding>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <KepalaLayar
          judul="Siap TKA"
          kanan={
            <View style={{ backgroundColor: '#3A86FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
              <Text style={{ fontFamily: huruf.anakTebal, color: '#FFFFFF' }}>TKA</Text>
            </View>
          }
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 16 }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 8 }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>
            Topik dikuasai: {kuasai} dari {paketTka.topik.length}
          </Text>
          <View style={{ height: 10, borderRadius: 5, backgroundColor: warna.kremBatang, overflow: 'hidden' }}>
            <View style={{ width: `${(kuasai / paketTka.topik.length) * 100}%`, height: '100%', backgroundColor: warna.hijauDaun }} />
          </View>
          {data ? (
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>
              Minggu {data.rencana.minggu}
              {data.rencana.topikBaru ? ` · topik baru: ${data.rencana.topikBaru.judul}` : ''}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            accessibilityRole="button"
            disabled={!data || data.miniSelesai || data.rencana.simulasi}
            onPress={() => router.push({ pathname: '/tka/simulasi', params: { id: 'mini' } })}
            style={{ flex: 1, borderRadius: 18, padding: 14, backgroundColor: data && !data.miniSelesai && !data.rencana.simulasi ? warna.oranyeMuda : warna.abuGaris, gap: 4 }}
          >
            <Text style={{ fontSize: 24 }}>⏱️</Text>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 16, color: warna.teks }}>Mini try out</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua }}>
              {data?.rencana.simulasi ? 'Minggu ini simulasi' : data?.miniSelesai ? 'Sudah minggu ini ✓' : `6 soal · 15 menit${data?.rencana.hariMini ? ` · ${data.rencana.hariMini}` : ''}`}
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/tka/rumah')} style={{ flex: 1, borderRadius: 18, padding: 14, backgroundColor: '#EAF2FF', gap: 4 }}>
            <Text style={{ fontSize: 24 }}>🏠</Text>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 16, color: warna.teks }}>Latihan rumah</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua }}>Dengan petunjuk bertahap</Text>
          </Pressable>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks }}>Simulasi 30 soal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {paketTka.simulasi.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/tka/simulasi', params: { id: s.id } })}
                style={{ width: 132, borderRadius: 16, padding: 12, backgroundColor: warna.putih, borderWidth: 2, borderColor: data?.simSelesai.has(s.id) ? warna.hijauDaun : warna.kremBatang, gap: 2 }}
              >
                <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warnaMapel[s.mapel].teks }}>{s.id}</Text>
                <Text numberOfLines={2} style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teks }}>
                  {s.mapel === 'mat' ? 'Matematika' : 'Bahasa Indonesia'}
                </Text>
                <Text style={{ fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>
                  {s.waktuMenit} menit{data?.simSelesai.has(s.id) ? ' · ✓' : ''}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        {grup('mat')}
        {grup('bi')}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          {(
            [
              ['belum', 'Belum'],
              ['latihan', 'Latihan'],
              ['kuasai', 'Kuasai'],
            ] as const
          ).map(([k, l]) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 14, height: 14, borderRadius: 4, borderWidth: 2, borderColor: WARNA_STATUS[k].garis, backgroundColor: WARNA_STATUS[k].latar }} />
              <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua }}>{l}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Layar>
  );
}
