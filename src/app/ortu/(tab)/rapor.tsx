/** O11 Rapor mingguan: per mapel, penyebab salah, rekor, menit belajar. */
import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { grafikKecepatan, kalimatRapor, ringkasMinggu, salahTerbanyak, seninDari } from '@/fitur/rapor';
import { raporTka } from '@/fitur/tka-rapor';
import { Tombol } from '@/komponen/dasar';
import { GrafikGaris } from '@/komponen/GrafikGaris';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function rentang(mulai: string, selesai: string) {
  const a = new Date(`${mulai}T12:00:00`);
  const b = new Date(`${selesai}T12:00:00`);
  return a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${BULAN[b.getMonth()]}` : `${a.getDate()} ${BULAN[a.getMonth()]} – ${b.getDate()} ${BULAN[b.getMonth()]}`;
}
const koma = (n: number) => String(n).replace('.', ',');

function Angka({ besar, satuan, label, bawah, naik }: { besar: string; satuan?: string; label: string; bawah?: string; naik?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: warna.putih, borderRadius: 20, padding: 14, gap: 2 }}>
      <Text style={{ fontFamily: huruf.ortuTebal, color: warna.teks }}>
        <Text style={{ fontSize: 28 }}>{besar}</Text>
        {satuan ? <Text style={{ fontSize: 14 }}> {satuan}</Text> : null}
      </Text>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teks }}>{label}</Text>
      {bawah ? <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: naik === false ? '#B86E00' : warna.hijauTua }}>{bawah}</Text> : null}
    </View>
  );
}

export default function Rapor() {
  const { daftarAnak } = useData();
  const [pilih, setPilih] = useState(daftarAnak[0]?.id ?? '');
  const anak = daftarAnak.find((a) => a.id === pilih) ?? daftarAnak[0];
  const data = useMuat(
    async (r) => {
      if (!anak) return null;
      const sesi = await r.daftarSesi(anak.id);
      const jawaban = await r.jawabanAnak(anak.id);
      const pakai = await r.riwayatPemakaian(anak.id);
      const topik = await r.kemajuanTopik(anak.id);
      const senin = seninDari(new Date());
      const lalu = new Date(senin);
      lalu.setDate(lalu.getDate() - 7);
      const ini = ringkasMinggu(sesi, jawaban, pakai, senin);
      const kemarin = ringkasMinggu(sesi, jawaban, pakai, lalu);
      const idLancar = new Set(sesi.filter((s) => s.jenis === 'lancar').map((s) => s.id));
      const salah = salahTerbanyak(jawaban.filter((j) => idLancar.has(j.sesi_id)));
      const rekor = sesi.filter((s) => s.tambahan?.rekorBaru && new Date(s.mulai) >= senin).length;
      const tka = anak.kelas === 6 ? await raporTka(r, anak) : null;
      return { ini, kemarin, grafik: grafikKecepatan(sesi, jawaban), salah, rekor, kalimat: kalimatRapor(anak.nama, ini, kemarin, topik, salah), tka };
    },
    null,
    [anak?.id],
  );
  if (!anak) return null;
  const bagikan = () => {
    if (!data) return;
    const t = [
      `Rapor ${anak.nama} (kelas ${anak.kelas}) · ${rentang(data.ini.mulai, data.ini.selesai)}`,
      `Hari latihan: ${data.ini.hariLatihan}`,
      data.ini.detikPerSoal !== null ? `Kecepatan: ${koma(data.ini.detikPerSoal)} detik per soal` : '',
      data.ini.persenBenar !== null ? `Benar: ${data.ini.persenBenar}%` : '',
      `Menit belajar: ${data.ini.menitBelajar}`,
      '',
      `Kemajuan: ${data.kalimat.kemajuan}`,
      `Langkah berikutnya: ${data.kalimat.langkah}`,
      '— Pintar Main',
    ]
      .filter(Boolean)
      .join('\n');
    Share.share({ message: t }).catch(() => undefined);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 16, height: 56, justifyContent: 'center', backgroundColor: warna.putih }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24, color: warna.teks }}>Rapor</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {daftarAnak.map((a) => (
            <Pressable
              key={a.id}
              accessibilityRole="button"
              accessibilityState={{ selected: a.id === anak.id }}
              onPress={() => setPilih(a.id)}
              style={{
                paddingHorizontal: 14,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                backgroundColor: a.id === anak.id ? warna.hijauPil : warna.putih,
                borderWidth: 1,
                borderColor: a.id === anak.id ? warna.hijauPil : warna.abuGaris,
              }}
            >
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: a.id === anak.id ? warna.hijauTua : warna.teksKedua }}>
                {HEWAN[a.hewan].emoji} {a.nama}
              </Text>
            </Pressable>
          ))}
          <View style={{ flex: 1 }} />
          {data ? <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>{rentang(data.ini.mulai, data.ini.selesai)}</Text> : null}
        </View>
        {data ? (
          <>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Angka besar={String(data.ini.hariLatihan)} label="hari latihan" />
              <Angka
                besar={data.ini.detikPerSoal !== null ? koma(data.ini.detikPerSoal) : '–'}
                satuan="dtk"
                label="per soal"
                bawah={data.ini.detikPerSoal !== null && data.kemarin.detikPerSoal !== null ? `${data.ini.detikPerSoal <= data.kemarin.detikPerSoal ? '↓' : '↑'} dari ${koma(data.kemarin.detikPerSoal)}` : undefined}
                naik={data.ini.detikPerSoal !== null && data.kemarin.detikPerSoal !== null ? data.ini.detikPerSoal <= data.kemarin.detikPerSoal : undefined}
              />
              <Angka
                besar={data.ini.persenBenar !== null ? `${data.ini.persenBenar}%` : '–'}
                label="benar"
                bawah={data.ini.persenBenar !== null && data.kemarin.persenBenar !== null ? (data.ini.persenBenar >= data.kemarin.persenBenar ? '↑ naik' : '↓ turun') : undefined}
                naik={data.ini.persenBenar !== null && data.kemarin.persenBenar !== null ? data.ini.persenBenar >= data.kemarin.persenBenar : undefined}
              />
            </View>
            <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Kecepatan, 8 minggu</Text>
                <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>detik per soal</Text>
              </View>
              <GrafikGaris nilai={data.grafik} />
              <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Makin rendah, makin cepat.</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Angka besar={String(data.ini.menitBelajar)} satuan="mnt" label="belajar" />
              <Angka besar={String(data.ini.menitMain)} satuan="mnt" label="main" />
              <Angka besar={String(data.rekor)} label="rekor baru" />
            </View>
            {data.salah.length > 0 ? (
              <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 6 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Yang masih sering belum tepat</Text>
                {data.salah.map((s) => (
                  <Text key={s.topik} style={{ fontFamily: huruf.ortu, fontSize: 15 }}>
                    • {s.topik}: {s.salah} dari {s.total} soal
                  </Text>
                ))}
              </View>
            ) : null}
            {data.tka ? (
              <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 8 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Kesiapan TKA</Text>
                <Text style={{ fontFamily: huruf.ortu, fontSize: 15 }}>
                  Topik dikuasai: {data.tka.kuasai} dari {data.tka.jumlahTopik} · sedang dilatih: {data.tka.belajar}
                </Text>
                {data.tka.miniTryout.length > 0 ? (
                  <>
                    <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: warna.teksKedua }}>Hasil mini try out (tepat dari 6 soal)</Text>
                    <GrafikGaris nilai={data.tka.miniTryout} tinggi={110} format={(n) => String(n)} />
                  </>
                ) : null}
                {data.tka.penyebab.length > 0 ? (
                  <>
                    <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: warna.teksKedua }}>Penyebab salah terbanyak</Text>
                    {data.tka.penyebab.map((p) => (
                      <Text key={p.kode} style={{ fontFamily: huruf.ortu, fontSize: 15 }}>
                        • {p.teks} ({p.jumlah} kali)
                      </Text>
                    ))}
                  </>
                ) : (
                  <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Belum ada data penyebab salah.</Text>
                )}
                {data.tka.rencana ? (
                  <>
                    <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.hijauTua, marginTop: 6 }}>RENCANA MINGGU INI</Text>
                    {data.tka.rencana.map((b) => (
                      <Text key={b} style={{ fontFamily: huruf.ortu, fontSize: 15 }}>
                        • {b}
                      </Text>
                    ))}
                  </>
                ) : null}
              </View>
            ) : null}
            <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 12 }}>
              {[
                ['KEMAJUAN', data.kalimat.kemajuan],
                ['LANGKAH BERIKUTNYA', data.kalimat.langkah],
                ['CARA MEMBANTU', data.kalimat.membantu],
              ].map(([j, t]) => (
                <View key={j} style={{ gap: 2 }}>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warna.hijauTua, letterSpacing: 0.3 }}>{j}</Text>
                  <Text style={{ fontFamily: huruf.ortu, fontSize: 16, color: warna.teks }}>{t}</Text>
                </View>
              ))}
            </View>
            <Tombol label="Kirim ke WhatsApp" ikon="bagikan" onPress={bagikan} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
