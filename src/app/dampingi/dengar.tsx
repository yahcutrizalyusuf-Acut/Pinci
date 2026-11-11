/**
 * D11 Dengar Bedanya (rancangan 13 bagian 4.1). Per panel: 🔊 Contoh dan 🎙 Suaraku bersebelahan, 1–2 tips bunyi,
 * lalu "Sudah mirip" / "Coba lagi" (Coba lagi langsung membuka perekam). TANPA skor mesin (CLAUDE.md aturan 12).
 * Tanpa Izin 8: contoh dan tips tetap tampil, tombol rekam tidak ada.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import type { Komik } from '@/isi/inggris/komik';
import { teksTokoh } from '@/isi/inggris/paketKomik';
import { Tombol } from '@/komponen/dasar';
import { dengarPanel, komikUntukAnak, PilihKomik } from '@/komponen/komik/alatDampingi';
import { GambarPanel } from '@/komponen/komik/GambarPanel';
import { Perekam, putarRekaman } from '@/komponen/rekam/Perekam';
import { gudangRekaman, izin8Nyala } from '@/layanan/rekaman';
import { hentikanSuara } from '@/layanan/suara';

export default function DengarBedanya() {
  const router = useRouter();
  const { anakAktif } = useData();
  const [komik, setKomik] = useState<Komik | null>(null);
  const izin8 = useMuat(async (r) => izin8Nyala(r), false);
  if (!anakAktif) return null;
  if (!komik)
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>Dengar Bedanya</Text>
        {!izin8 ? (
          <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14, gap: 8 }}>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teks }}>Tombol rekam belum tampil karena Izin 8 (rekaman suara di HP) mati. Contoh suara dan tips bunyi tetap bisa dipakai.</Text>
            <Tombol label="Buka pengaturan Izin 8" varian="garis" ortu onPress={() => router.push('/ortu/rekaman')} />
          </View>
        ) : null}
        <PilihKomik daftar={komikUntukAnak(anakAktif)} dibaca={new Set()} onPilih={setKomik} judul="Pilih komik. Anak mendengar contoh, merekam suaranya, lalu membandingkan sendiri." />
      </ScrollView>
    );
  return <PerPanel key={komik.id} komik={komik} anakId={anakAktif.id} izin8={izin8} onSelesai={() => setKomik(null)} />;
}

function PerPanel({ komik, anakId, izin8, onSelesai }: { komik: Komik; anakId: string; izin8: boolean; onSelesai: () => void }) {
  const { width } = useWindowDimensions();
  const [ke, setKe] = useState(0);
  const [suaraku, setSuaraku] = useState<Record<string, string>>({});
  const [ulang, setUlang] = useState(0);
  const [mirip, setMirip] = useState<Record<string, boolean>>({});
  const panel = komik.panel[ke];
  const akhir = ke === komik.panel.length - 1;
  const terakhir = suaraku[panel.id];

  const pindah = (n: number) => {
    hentikanSuara();
    setKe(n);
    setUlang(0);
    // ambil rekaman lama panel ini (milik anak ini saja)
    const id = komik.panel[n].id;
    void gudangRekaman()
      .daftarAnak(anakId)
      .then((d) => {
        const r = d.find((c) => c.panelId === id);
        if (r) setSuaraku((x) => ({ ...x, [id]: r.berkas }));
      });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, alignItems: 'center' }}>
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks }}>
        {teksTokoh(komik.judul)} · panel {ke + 1} dari {komik.panel.length}
      </Text>
      <GambarPanel panel={panel} lebar={Math.min(width - 32, 300)} />
      <View style={{ alignSelf: 'stretch', backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 4 }}>
        {panel.gelembung.map((g) => (
          <Text key={g.id} style={{ fontFamily: huruf.anakTebal, fontSize: 20, color: warna.teks }}>
            {teksTokoh(g.teks)}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
        <Tombol label="🔊 Contoh" varian="garis" style={{ flex: 1 }} onPress={() => dengarPanel(panel, komik.tingkat)} />
        {izin8 ? <Tombol label="▶ Suaraku" varian="garis" style={{ flex: 1 }} nonaktif={!terakhir} onPress={() => terakhir && putarRekaman(terakhir)} /> : null}
      </View>
      {izin8 ? (
        <Perekam
          key={`${panel.id}-${ulang}`}
          anakId={anakId}
          komikId={komik.id}
          panelId={panel.id}
          jenis="kalimat"
          label="Rekam suaraku"
          mulaiOtomatis={ulang > 0}
          onSelesai={(c) => setSuaraku((x) => ({ ...x, [panel.id]: c.berkas }))}
        />
      ) : null}
      <View style={{ alignSelf: 'stretch', backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14, gap: 6 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: '#B86E00' }}>Tips bunyi</Text>
        {panel.tipsBunyi.map((t) => (
          <Text key={t} style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>
            • {teksTokoh(t)}
          </Text>
        ))}
      </View>
      {izin8 && terakhir ? (
        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
          <Tombol label={mirip[panel.id] ? '✓ Sudah mirip' : 'Sudah mirip'} varian={mirip[panel.id] ? 'utama' : 'garis'} style={{ flex: 1 }} onPress={() => setMirip((x) => ({ ...x, [panel.id]: true }))} />
          <Tombol label="Coba lagi" varian="garis" style={{ flex: 1 }} onPress={() => setUlang((x) => x + 1)} />
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 4 }}>
        <Tombol label="Sebelumnya" varian="garis" nonaktif={ke === 0} style={{ flex: 1 }} onPress={() => pindah(ke - 1)} />
        <Tombol label={akhir ? 'Selesai' : 'Panel berikut'} style={{ flex: 1 }} onPress={() => (akhir ? onSelesai() : pindah(ke + 1))} />
      </View>
    </ScrollView>
  );
}
