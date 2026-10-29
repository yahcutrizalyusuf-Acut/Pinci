/**
 * Teks soal TKA: "{3/4}" digambar sebagai pecahan bertumpuk, "{1 1/2}" pecahan campuran,
 * "**kata**" tebal, "*kata*" miring, baris baru dipertahankan.
 */
import { Fragment } from 'react';
import { Platform, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { huruf, warna } from '../../desain/token';

type Potong = { jenis: 'teks'; isi: string; tebal?: boolean; miring?: boolean } | { jenis: 'pecahan'; utuh?: string; atas: string; bawah: string };

export function uraiTeks(s: string): Potong[] {
  const hasil: Potong[] = [];
  const pola = /\{(?:(\d+) )?([^{}/]+)\/([^{}]+)\}|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let akhir = 0;
  let m: RegExpExecArray | null;
  while ((m = pola.exec(s))) {
    if (m.index > akhir) hasil.push({ jenis: 'teks', isi: s.slice(akhir, m.index) });
    if (m[3] !== undefined) hasil.push({ jenis: 'pecahan', utuh: m[1], atas: m[2], bawah: m[3] });
    else if (m[4] !== undefined) hasil.push({ jenis: 'teks', isi: m[4], tebal: true });
    else if (m[5] !== undefined) hasil.push({ jenis: 'teks', isi: m[5], miring: true });
    akhir = pola.lastIndex;
  }
  if (akhir < s.length) hasil.push({ jenis: 'teks', isi: s.slice(akhir) });
  return hasil;
}

/** Teks polos untuk dibacakan mesin suara. */
export function teksBaca(s: string): string {
  return s
    .replace(/\{(\d+) (\d+)\/(\d+)\}/g, '$1 $2 per $3')
    .replace(/\{([^{}/]+)\/([^{}]+)\}/g, '$1 per $2')
    .replace(/\*+/g, '');
}

function Pecahan({ atas, bawah, utuh, ukuran, gaya }: { atas: string; bawah: string; utuh?: string; ukuran: number; gaya: TextStyle }) {
  const kecil = Math.round(ukuran * 0.82);
  // Web menyejajarkan baris pertama dengan garis teks; HP menyejajarkan bagian bawah. Geser supaya garis pecahan setinggi tengah huruf.
  const geser = Platform.OS === 'web' ? -kecil * 0.62 : kecil * 0.55;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 2, transform: [{ translateY: geser }] }} accessibilityLabel={`${utuh ? `${utuh} ` : ''}${atas} per ${bawah}`}>
      {utuh ? <Text style={[gaya, { fontSize: ukuran, marginRight: 2 }]}>{utuh}</Text> : null}
      <View style={{ alignItems: 'center' }}>
        <Text style={[gaya, { fontSize: kecil, lineHeight: kecil * 1.1 }]}>{atas}</Text>
        <View style={{ alignSelf: 'stretch', height: 1.5, backgroundColor: (gaya.color as string) ?? warna.teks, marginVertical: 1 }} />
        <Text style={[gaya, { fontSize: kecil, lineHeight: kecil * 1.1 }]}>{bawah}</Text>
      </View>
    </View>
  );
}

export function TeksKaya({ teks, ukuran = 18, style, warnaTeks = warna.teks }: { teks: string; ukuran?: number; style?: StyleProp<TextStyle>; warnaTeks?: string }) {
  const potong = uraiTeks(teks);
  const gaya: TextStyle = { fontFamily: huruf.anak, fontSize: ukuran, color: warnaTeks, lineHeight: ukuran * 1.45 };
  const adaPecahan = potong.some((p) => p.jenis === 'pecahan');
  return (
    <Text style={[gaya, adaPecahan && { lineHeight: ukuran * 2.1 }, style]}>
      {potong.map((p, i) =>
        p.jenis === 'pecahan' ? (
          <Pecahan key={i} atas={p.atas} bawah={p.bawah} utuh={p.utuh} ukuran={ukuran} gaya={gaya} />
        ) : (
          <Fragment key={i}>
            <Text style={[p.tebal && { fontFamily: huruf.anakTebal }, p.miring && { fontStyle: 'italic' }]}>{p.isi}</Text>
          </Fragment>
        ),
      )}
    </Text>
  );
}
