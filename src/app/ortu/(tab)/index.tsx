/** O09 Kabar: kabar harian tiap anak dalam satu layar gaya WhatsApp. */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { kabarAnak } from '@/fitur/kabar';
import { pertanyaanMingguIni } from '@/fitur/pertanyaan';
import { PESAN_SIAP } from '@/fitur/pesan';
import { tipsHariIni } from '@/fitur/tips';
import { Logo, TeksOrtu, Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';


export default function Kabar() {
  const router = useRouter();
  const { repo, daftarAnak, keluarga, kunciOrtu } = useData();
  const [kirimUntuk, setKirimUntuk] = useState<string | null>(null);
  const [pilihSemangat, setPilihSemangat] = useState(false);
  const PERTANYAAN = pertanyaanMingguIni();
  const data = useMuat(
    async (r) => {
      const kabar = await Promise.all(daftarAnak.map((a) => kabarAnak(r, a)));
      const dijawab = await r.nilai<string>(`masukan:${PERTANYAAN.kodeJawab}`);
      const nanti = await r.nilai<string>(`masukan_nanti:${PERTANYAAN.kodeJawab}`);
      const antre = (await r.antreanBelumTerkirim()).length;
      const catatan = (await r.catatanPengawas()).slice(0, 3);
      const kelas = await r.daftarKelasAnak();
      return { kabar, tampilTanya: !dijawab && nanti !== new Date().toDateString(), antre, catatan, kelas };
    },
    { kabar: [], tampilTanya: false, antre: 0, catatan: [], kelas: [] },
    [daftarAnak.length],
  );
  const tips = tipsHariIni();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }} edges={['top', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 64, backgroundColor: warna.putih }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24, color: warna.teks }}>Kabar</Text>
        <Logo ukuran={18} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <View style={{ backgroundColor: warna.putih, marginTop: 8 }}>
          {data.kabar.map((k, i) => (
            <Pressable
              key={k.anak.id}
              accessibilityRole="button"
              accessibilityLabel={`${k.anak.nama}, ${k.baris}`}
              onPress={() => router.push(`/ortu/anak/${k.anak.id}`)}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 16, backgroundColor: pressed ? warna.abuTerang : warna.putih })}
            >
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: HEWAN[k.anak.hewan].latar, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 28 }}>{HEWAN[k.anak.hewan].emoji}</Text>
              </View>
              <View style={{ flex: 1, paddingVertical: 14, paddingRight: 16, borderBottomWidth: i < data.kabar.length - 1 ? 1 : 0, borderBottomColor: warna.abuGaris, gap: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.teks }}>
                    {k.anak.nama} · Kelas {k.anak.kelas}
                  </Text>
                  <Text style={{ fontFamily: k.baru ? huruf.ortuTebal : huruf.ortu, fontSize: 13, color: k.baru ? warna.hijauTua : warna.teksKedua }}>{k.waktu}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Text numberOfLines={1} style={{ flex: 1, fontFamily: huruf.ortu, fontSize: 15, color: warna.teksKedua }}>
                    {k.baris}
                  </Text>
                  {k.baru ? (
                    <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: warna.hijauDaun, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 12, color: warna.teks }}>{k.baru}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {data.catatan.length > 0 ? (
          <View style={{ marginHorizontal: 16, padding: 16, borderRadius: 20, backgroundColor: warna.putih, gap: 10 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warna.hijauTua }}>CATATAN DARI PENGAWAS</Text>
            {data.catatan.map((c) => {
              const a = daftarAnak.find((x) => x.id === c.anak_id);
              const pengawas = data.kelas.find((k) => k.anak_id === c.anak_id)?.pengawasNama;
              return (
                <View key={c.id} style={{ gap: 2, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: warna.abuGaris }}>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: c.dibaca ? warna.teksKedua : warna.teks }}>
                    {a ? `${a.nama} · ` : ''}
                    {pengawas ?? 'Pengawas'} · {new Date(c.waktu).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </Text>
                  <TeksOrtu style={{ fontSize: 15, fontFamily: c.dibaca ? huruf.ortu : huruf.ortuSedang }}>{c.isi}</TeksOrtu>
                </View>
              );
            })}
            {data.catatan.some((c) => !c.dibaca) ? (
              <Pressable accessibilityRole="button" onPress={() => repo.tandaiCatatanDibaca()} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.hijauTua }}>Sudah saya baca</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {data.antre > 0 ? (
          <View style={{ marginHorizontal: 16, padding: 12, borderRadius: 14, backgroundColor: warna.putih, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ikon nama="awan" ukuran={20} warna={warna.teksKedua} />
            <TeksOrtu style={{ flex: 1, fontSize: 14, color: warna.teksKedua }}>
              {keluarga?.modeData === 'supabase'
                ? `${data.antre} catatan menunggu dikirim. Sambungkan HP ke internet sebentar.`
                : 'Semua hasil tersimpan di HP ini.'}
            </TeksOrtu>
          </View>
        ) : null}

        {data.tampilTanya ? (
          <View style={{ marginHorizontal: 16, padding: 16, borderRadius: 20, backgroundColor: warna.putih, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Ikon nama="tanya" ukuran={20} warna={warna.hijauTua} />
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.hijauTua }}>1 pertanyaan, 30 detik</Text>
            </View>
            <TeksOrtu style={{ fontSize: 17 }}>{PERTANYAAN.teks}</TeksOrtu>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PERTANYAAN.pilihan.map((p) => (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={() => repo.jawabPertanyaan(PERTANYAAN.kodeJawab, p)}
                  style={{ paddingHorizontal: 14, height: 40, borderRadius: 20, justifyContent: 'center', borderWidth: 1, borderColor: warna.hijauDaun }}
                >
                  <Text style={{ fontFamily: huruf.ortuSedang, color: warna.hijauTua }}>{p}</Text>
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => repo.aturNilai(`masukan_nanti:${PERTANYAAN.kodeJawab}`, new Date().toDateString())}
                style={{ paddingHorizontal: 14, height: 40, borderRadius: 20, justifyContent: 'center', borderWidth: 1, borderColor: warna.abuGaris }}
              >
                <Text style={{ fontFamily: huruf.ortuSedang, color: warna.teksKedua }}>Nanti</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={{ marginHorizontal: 16, padding: 16, borderRadius: 20, backgroundColor: warna.oranyeMuda, gap: 6 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: '#B86E00' }}>TIPS AYAH BUNDA</Text>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>{tips.judul}</Text>
          <TeksOrtu style={{ fontSize: 15 }}>{tips.isi}</TeksOrtu>
        </View>

        <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 10 }}>
          <Tombol label="Serahkan ke anak" ortu varian="putih" style={{ flex: 1 }} onPress={() => { kunciOrtu(); router.replace('/profil'); }} />
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kirim semangat"
        onPress={() => (daftarAnak.length === 1 ? setKirimUntuk(daftarAnak[0].id) : setPilihSemangat(true))}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 16,
          bottom: 16,
          height: 56,
          paddingHorizontal: 20,
          borderRadius: 28,
          backgroundColor: warna.hijauTua,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          opacity: pressed ? 0.85 : 1,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 4,
        })}
      >
        <Ikon nama="hati" ukuran={22} warna="#FFFFFF" />
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: '#FFFFFF' }}>Kirim semangat</Text>
      </Pressable>

      <Modal visible={pilihSemangat || kirimUntuk !== null} transparent animationType="slide" onRequestClose={() => { setPilihSemangat(false); setKirimUntuk(null); }}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => { setPilihSemangat(false); setKirimUntuk(null); }} />
        <View style={{ backgroundColor: warna.putih, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 }}>
          {kirimUntuk === null ? (
            <>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Kirim semangat untuk siapa?</Text>
              {daftarAnak.map((a) => (
                <Tombol key={a.id} ortu varian="putih" label={`${HEWAN[a.hewan].emoji}  ${a.nama}`} onPress={() => setKirimUntuk(a.id)} />
              ))}
            </>
          ) : (
            <>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Pilih pesan</Text>
              {PESAN_SIAP.map((p) => (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={async () => {
                    await repo.kirimPesan({ anak_id: kirimUntuk, dari: 'orang_tua', jenis: 'siap_pakai', isi: p });
                    setKirimUntuk(null);
                    setPilihSemangat(false);
                  }}
                  style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: warna.hijauPil, backgroundColor: warna.hijauMuda }}
                >
                  <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 16, color: warna.hijauTua }}>{p}</Text>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
