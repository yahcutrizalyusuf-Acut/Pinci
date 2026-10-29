/** Gambar sederhana kartu ilmu: emoji, pecahan bertumpuk, model batang, petak arsir. */
import { Text, View } from 'react-native';

import { huruf, warna } from '../desain/token';
import type { GambarSederhana } from '../isi/gudang/jenis';

const BIRU = '#3A86FF';
const BIRU_MUDA = '#E6F0FF';

function Batang({ potong, isi, tinggi = 40 }: { potong: number; isi: number; tinggi?: number }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', height: tinggi, borderRadius: 10, overflow: 'hidden', gap: 3 }}>
      {Array.from({ length: potong }, (_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: i < isi ? BIRU : BIRU_MUDA }} />
      ))}
    </View>
  );
}

export function GambarIlmu({ g }: { g: GambarSederhana }) {
  switch (g.jenis) {
    case 'emoji':
      return <Text style={{ fontSize: 48, textAlign: 'center' }}>{g.isi}</Text>;
    case 'pecahan':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }} accessibilityLabel={`${g.a} per ${g.b}`}>
          <View style={{ alignItems: 'center', width: 44 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 24, color: warna.teks }}>{g.a}</Text>
            <View style={{ alignSelf: 'stretch', height: 3, backgroundColor: warna.teks }} />
            <Text style={{ fontFamily: huruf.anak, fontSize: 24, color: warna.teks }}>{g.b}</Text>
          </View>
          {g.b <= 24 && g.a <= g.b ? <Batang potong={g.b} isi={g.a} /> : null}
        </View>
      );
    case 'batang': {
      const maks = Math.max(1, ...g.nilai);
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 140, paddingTop: 8 }}>
          {g.nilai.map((n, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: warna.teks }}>{n}</Text>
              <View style={{ width: '70%', height: Math.max(4, (n / maks) * 90), borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: BIRU }} />
              {g.label?.[i] ? (
                <Text numberOfLines={1} style={{ fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>
                  {g.label[i]}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      );
    }
    case 'petak':
      return (
        <View style={{ alignSelf: 'center', gap: 2 }} accessibilityLabel={`${g.terisi} dari ${g.baris * g.kolom} petak diarsir`}>
          {Array.from({ length: g.baris }, (_, b) => (
            <View key={b} style={{ flexDirection: 'row', gap: 2 }}>
              {Array.from({ length: g.kolom }, (_, k) => (
                <View key={k} style={{ width: 26, height: 26, borderRadius: 4, backgroundColor: b * g.kolom + k < g.terisi ? BIRU : BIRU_MUDA }} />
              ))}
            </View>
          ))}
        </View>
      );
  }
}
