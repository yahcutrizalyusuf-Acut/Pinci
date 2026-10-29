/** Bagian stimulus TKA: teks, tabel yang bisa digeser, denah kubus sebagai petak, gambar teks sama lebar. */
import { Platform, ScrollView, Text, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import type { Bagian } from '../../isi/tka/jenis';
import { TeksKaya } from './TeksKaya';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

function Tabel({ baris }: { baris: string[][] }) {
  // Lebar kolom sama di semua baris: diperkirakan dari teks terpanjang tiap kolom.
  const nKolom = Math.max(...baris.map((b) => b.length));
  const lebar = Array.from({ length: nKolom }, (_, k) =>
    Math.max(64, Math.min(200, Math.max(...baris.map((b) => (b[k] ?? '').replace(/[{}*]/g, '').length)) * 8.6 + 22)),
  );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingBottom: 4 }}>
      <View style={{ borderWidth: 1, borderColor: '#D9CDB4', borderRadius: 10, overflow: 'hidden' }}>
        {baris.map((b, i) => (
          <View key={i} style={{ flexDirection: 'row', backgroundColor: i === 0 ? '#F1E6CF' : i % 2 ? warna.putih : '#FFFBF3' }}>
            {b.map((sel, k) => (
              <View key={k} style={{ width: lebar[k], paddingHorizontal: 10, paddingVertical: 8, borderLeftWidth: k ? 1 : 0, borderColor: '#E8DCC4', justifyContent: 'center' }}>
                <TeksKaya teks={sel} ukuran={15} style={i === 0 ? { fontFamily: huruf.anakTebal } : undefined} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Denah({ b }: { b: Extract<Bagian, { jenis: 'denah' }> }) {
  const ukuranPetak = 44;
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      {b.atas ? <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>{b.atas}</Text> : null}
      {b.kolom ? (
        <View style={{ flexDirection: 'row', marginLeft: b.labelBaris ? 72 : 0 }}>
          {b.kolom.map((k) => (
            <Text key={k} style={{ width: ukuranPetak, textAlign: 'center', fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>
              {k}
            </Text>
          ))}
        </View>
      ) : null}
      {b.petak.map((baris, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {b.labelBaris ? <Text style={{ width: 72, fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>{b.labelBaris[i]}</Text> : null}
          {baris.map((n, k) => (
            <View
              key={k}
              style={{
                width: ukuranPetak,
                height: ukuranPetak,
                borderWidth: 1.5,
                borderColor: '#6B8BC8',
                marginLeft: k ? -1.5 : 0,
                marginTop: i ? -1.5 : 0,
                backgroundColor: n > 0 ? `rgba(58,134,255,${Math.min(0.15 + n * 0.15, 0.7)})` : warna.putih,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 20, color: warna.teks }}>{n > 0 ? n : ''}</Text>
            </View>
          ))}
        </View>
      ))}
      {b.bawah ? <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>{b.bawah}</Text> : null}
    </View>
  );
}

export function Stimulus({ bagian, ukuran = 17 }: { bagian: Bagian[]; ukuran?: number }) {
  return (
    <View style={{ gap: 12 }}>
      {bagian.map((b, i) => {
        switch (b.jenis) {
          case 'teks':
            return <TeksKaya key={i} teks={b.isi} ukuran={ukuran} />;
          case 'tabel':
            return <Tabel key={i} baris={b.baris} />;
          case 'denah':
            return <Denah key={i} b={b} />;
          case 'gambar_teks':
            return (
              <ScrollView key={i} horizontal>
                <Text style={{ fontFamily: MONO, fontSize: 14, lineHeight: 17, color: warna.teks }}>{b.baris.join('\n')}</Text>
              </ScrollView>
            );
        }
        return null;
      })}
    </View>
  );
}
