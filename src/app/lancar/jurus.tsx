/** A04 Jurus: satu jurus per level (inti, contoh jadi, catatan ingat). */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { ambilJurusAman } from '@/fitur/jurus';
import { infoLancarAnak, tandaiJurusDilihat } from '@/fitur/lancar';
import { KepalaLayar, TombolSuara, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';
import type { LangkahJurus } from '@/isi/lancar/jurus';

/** Posisi terakhir `cari` di `teks` yang tidak menempel pada angka lain (−1 bila tidak ada). */
function cariUtuh(teks: string, cari: string): number {
  for (let k = teks.lastIndexOf(cari); k >= 0; k = k > 0 ? teks.lastIndexOf(cari, k - 1) : -1) {
    const kiri = teks[k - 1];
    const kanan = teks[k + cari.length];
    if (!(kiri && /[0-9,]/.test(kiri)) && !(kanan && /[0-9,]/.test(kanan))) return k;
  }
  return teks.lastIndexOf(cari);
}

function BarisLangkah({ l }: { l: LangkahJurus }) {
  // Pecah teks agar bagian `sorot` biru dan `hasil` hijau.
  const bagian: { t: string; w?: string }[] = [];
  let sisa = l.teks;
  const tanda = [l.sorot ? { s: l.sorot, w: '#2A5DB0' } : null, l.hasil ? { s: l.hasil, w: warna.hijauTua } : null].filter(
    (x): x is { s: string; w: string } => x !== null,
  );
  for (const t of tanda) {
    const k = cariUtuh(sisa, t.s);
    if (k < 0) continue;
    bagian.push({ t: sisa.slice(0, k) }, { t: t.s, w: t.w });
    sisa = sisa.slice(k + t.s.length);
  }
  bagian.push({ t: sisa });
  return (
    <Text style={{ fontFamily: huruf.anak, fontSize: 30, color: warna.teks, flexShrink: 1 }}>
      {bagian.map((b, i) => (
        <Text key={i} style={b.w ? { color: b.w, fontFamily: huruf.anakTebal } : undefined}>
          {b.t}
        </Text>
      ))}
    </Text>
  );
}

export default function LayarJurus() {
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const info = useMuat((r) => infoLancarAnak(r, anak), null, [anak.id]);
  const [contohKe, setContohKe] = useState(0);
  if (!info) return null;
  const { jurus, nama } = ambilJurusAman(anak.kelas, info.level);
  const contoh = jurus?.contoh[contohKe];
  const bacaan = jurus ? `Pinci punya jurus: ${jurus.inti}` : nama;
  return (
    <Layar
      bawah={
        <View style={{ padding: 16, gap: 10 }}>
          {jurus && contohKe + 1 < jurus.contoh.length ? (
            <Tombol label="Contoh lain" varian="garis" onPress={() => setContohKe(contohKe + 1)} />
          ) : null}
          <Tombol
            label="Aku siap!"
            besar
            onPress={async () => {
              await tandaiJurusDilihat(repo, anak, info.level);
              router.replace('/lancar/lembar');
            }}
          />
        </View>
      }
    >
      <KepalaLayar judul={`Lancar Matematika · Level ${info.level}`} warnaJudul={warnaMapel.mat.teks} />
      <ScrollView contentContainerStyle={{ gap: 16, alignItems: 'stretch' }}>
        <View style={{ alignItems: 'center' }}>
          <Pinci ekspresi="semangat" ukuran={112} />
        </View>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 19, color: warna.teks }}>Pinci punya jurus:</Text>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 20, color: warna.hijauTua }}>{jurus?.inti ?? nama}</Text>
          </View>
          <TombolSuara teks={bacaan} />
        </View>
        {contoh ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 24, padding: 20, gap: 14 }}>
            {contoh.langkah.map((l, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: warnaMapel.mat.muda, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warnaMapel.mat.teks }}>{i + 1}</Text>
                </View>
                <BarisLangkah l={l} />
              </View>
            ))}
            {contoh.catatan ? (
              <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua, marginLeft: 50 }}>{contoh.catatan}</Text>
            ) : null}
          </View>
        ) : null}
        {jurus ? (
          <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>💡 {jurus.ingat}</Text>
          </View>
        ) : null}
      </ScrollView>
    </Layar>
  );
}
