/**
 * Pratinjau gambar sementara komik untuk desainer dan guru: semua tokoh × 6 pose, varian, 8 latar, lalu semua panel.
 * Tidak ada tautan dari layar anak. Dibuka lewat alamat /pratinjau/komik (build web) untuk tangkapan layar.
 */
import { ScrollView, Text, View } from 'react-native';

import { PAKET_KOMIK, PAKET_TOKOH, teksTokoh } from '../../isi/inggris/paketKomik';
import { GambarPanel } from '../../komponen/komik/GambarPanel';
import { LatarKomik, SEMUA_LATAR } from '../../komponen/komik/LatarKomik';
import { POSE_KOMIK, TokohKomik } from '../../komponen/komik/TokohKomik';

const judul = { fontSize: 18, fontWeight: '700' as const, color: '#6B4423', marginTop: 16, marginBottom: 8 };

export default function PratinjauKomik() {
  const tokoh = PAKET_TOKOH.tokoh.filter((t) => t.peran !== 'narator');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF6E5' }} contentContainerStyle={{ padding: 12 }}>
      <Text style={judul}>Tokoh × pose (gambar sementara)</Text>
      {tokoh.map((t) => (
        <View key={t.id} style={{ marginBottom: 6 }}>
          <Text style={{ color: '#2D3142' }}>{t.nama}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {POSE_KOMIK.map((p) => (
              <TokohKomik key={p} tokoh={t.id} pose={p} tinggi={72} />
            ))}
          </View>
        </View>
      ))}
      <Text style={judul}>Varian</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <TokohKomik tokoh="robi" pose="gembira" varian="super" tinggi={90} />
        <TokohKomik tokoh="robi" pose="berdiri" varian="kotor" tinggi={90} />
        <TokohKomik tokoh="fathan" pose="berdiri" varian="sedih" tinggi={90} />
        <TokohKomik tokoh="dafi" pose="jongkok" varian="kotor" tinggi={90} />
        <TokohKomik tokoh="kabut" pose="kaget" varian="sedih" tinggi={90} />
      </View>
      <Text style={judul}>8 latar</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {SEMUA_LATAR.map((l) => (
          <View key={l}>
            <LatarKomik latar={l} lebar={160} />
            <Text style={{ color: '#2D3142' }}>{l}</Text>
          </View>
        ))}
      </View>
      <Text style={judul}>Semua panel</Text>
      {Object.values(PAKET_KOMIK).flatMap((p) =>
        (p?.komik ?? []).map((k) => (
          <View key={k.id} style={{ marginBottom: 12 }}>
            <Text style={{ color: '#2D3142', fontWeight: '700' }}>
              {k.id}: {teksTokoh(k.judul)}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {k.panel.map((pn) => (
                <GambarPanel key={pn.id} panel={pn} lebar={160} />
              ))}
            </View>
          </View>
        )),
      )}
    </ScrollView>
  );
}
