/**
 * Model Batang (M2): batang keseluruhan dan bagian, label nilai, tanda tanya untuk yang dicari.
 * Gambar saja (tanpa sentuhan); pembaca layar membaca uraian lengkapnya.
 */
import { Text, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import type { ModelBatangData } from '../../isi/gudang/jenis';

const WARNA_RUAS = ['#CDEFD9', '#D6ECFA', '#FFE1C7', '#E6DCF7', '#FBDCE6'];

export function tulisNilai(m: ModelBatangData, n: number): string {
  if (m.penyebut) {
    let a = Math.round(n);
    let b = m.penyebut;
    const f = (x: number, y: number): number => (y ? f(y, x % y) : x);
    const g = f(a, b);
    a /= g;
    b /= g;
    return b === 1 ? String(a) : `${a}/${b}`;
  }
  const t = Number.isInteger(n) ? n.toLocaleString('id-ID') : String(n).replace('.', ',');
  return `${m.depan ?? ''}${t}${m.satuan ? ` ${m.satuan}` : ''}`;
}

export function uraianBatang(m: ModelBatangData): string {
  const baris = m.baris.map((b) => `${b.label ? `${b.label}: ` : ''}${b.ruas.map((s) => (s.dicari ? 'tanda tanya' : (s.label ?? tulisNilai(m, s.nilai)))).join(', ')}`).join('. ');
  const ks = m.keseluruhan ? ` Keseluruhan ${m.keseluruhan.dicari ? 'tanda tanya' : (m.keseluruhan.label ?? tulisNilai(m, m.keseluruhan.nilai))}.` : '';
  return `Model batang. ${baris}.${ks}`;
}

export function ModelBatang({ data, lebar }: { data: ModelBatangData; lebar: number }) {
  const total = Math.max(...data.baris.map((b) => b.ruas.reduce((a, s) => a + s.nilai, 0)), data.keseluruhan?.nilai ?? 0);
  const adaLabelBaris = data.baris.some((b) => b.label);
  const lebarLabel = adaLabelBaris ? 64 : 0;
  const lebarBatang = lebar - lebarLabel;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={uraianBatang(data)} style={{ width: lebar, gap: 8 }}>
      {data.keseluruhan ? (
        <View style={{ marginLeft: lebarLabel, width: (data.keseluruhan.nilai / total) * lebarBatang, alignItems: 'center' }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: data.keseluruhan.dicari ? warna.oranyeTua : warna.teks }}>{data.keseluruhan.dicari ? '?' : (data.keseluruhan.label ?? tulisNilai(data, data.keseluruhan.nilai))}</Text>
          <View style={{ alignSelf: 'stretch', height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: warna.biruTinta, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        </View>
      ) : null}
      {data.baris.map((b, bi) => (
        <View key={bi} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {adaLabelBaris ? (
            <Text numberOfLines={1} style={{ width: lebarLabel, fontFamily: huruf.anakTebal, fontSize: 14, color: warna.teks }}>
              {b.label ?? ''}
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', width: lebarBatang }}>
            {b.ruas.map((s, si) => (
              <View
                key={si}
                style={{
                  width: (s.nilai / total) * lebarBatang,
                  height: 44,
                  backgroundColor: s.dicari ? '#FFF0D9' : WARNA_RUAS[(bi * 2 + si) % WARNA_RUAS.length],
                  borderWidth: 2,
                  borderColor: s.dicari ? warna.oranye : warna.biruTinta,
                  marginLeft: si ? -2 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: s.dicari ? 'dashed' : 'solid',
                }}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.teks, paddingHorizontal: 2 }}>
                  {s.dicari ? '?' : (s.label ?? tulisNilai(data, s.nilai))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
