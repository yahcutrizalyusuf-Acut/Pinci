/**
 * Izin 8 — Rekaman suara di HP (PILIHAN). Teks dari rancangan 13 bagian 4.3, aturan dari CLAUDE.md aturan 12.
 * Saklar bawaan mati. Mencabut izin = semua rekaman langsung dihapus. Daftar rekaman: putar, hapus, sematkan (maks 5).
 * Tidak ada tombol bagikan atau ekspor.
 */
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { ATURAN_REKAMAN, formatDetik, sisaHari, type CatatanRekaman } from '@/fitur/rekaman';
import { cariKomik, teksTokoh } from '@/isi/inggris/paketKomik';
import { KepalaLayar } from '@/komponen/dasar';
import { putarRekaman } from '@/komponen/rekam/Perekam';
import { aturIzin8, gudangRekaman, izin8Nyala } from '@/layanan/rekaman';

export const TEKS_IZIN_8: [string, string][] = [
  ['Tujuan', 'Anak bisa merekam suaranya saat bercerita dalam Bahasa Inggris, lalu mendengarnya kembali untuk membandingkan dengan contoh.'],
  ['Data', 'Rekaman suara anak.'],
  ['Disimpan di mana', 'Hanya di HP ini. Rekaman tidak dikirim ke server kami dan tidak bisa kami dengar. Kalau HP hilang atau aplikasi dihapus, rekaman ikut hilang.'],
  ['Masa simpan', 'Terhapus otomatis setelah 30 hari, kecuali paling banyak 5 rekaman yang Anda simpan sebagai kenangan.'],
  ['Izin HP', 'Aplikasi meminta izin mikrofon. Mikrofon hanya menyala saat anak menekan tombol rekam.'],
  ['Kalau ditolak', 'Ceritakan Lagi tetap bisa dipakai tanpa merekam.'],
  ['Menarik izin', 'Kapan saja di halaman ini. Semua rekaman langsung dihapus.'],
];

function tanya(judul: string, pesan: string, ya: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${judul}\n\n${pesan}`)) ya();
    return;
  }
  Alert.alert(judul, pesan, [
    { text: 'Batal', style: 'cancel' },
    { text: 'Ya, hapus', style: 'destructive', onPress: ya },
  ]);
}

function namaRekaman(c: CatatanRekaman) {
  const k = cariKomik(c.komikId);
  const judul = k ? teksTokoh(k.judul) : c.komikId;
  if (c.jenis === 'utuh') return `${judul} · cerita utuh`;
  return `${judul} · panel ${c.panelId?.split('-p')[1] ?? ''}`;
}

export default function LayarIzinRekaman() {
  const { repo, daftarAnak } = useData();
  const [versi, setVersi] = useState(0);
  const { nyala, daftar } = useMuat(async (r) => ({ nyala: await izin8Nyala(r), daftar: await gudangRekaman().semua() }), { nyala: false, daftar: [] as CatatanRekaman[] }, [versi]);
  const [pesan, setPesan] = useState('');
  const muat = () => setVersi((v) => v + 1);

  const ubahIzin = (ya: boolean) => {
    if (ya) {
      void aturIzin8(repo, true).then(muat);
      return;
    }
    const lakukan = () => void aturIzin8(repo, false).then(muat);
    if (daftar.length === 0) lakukan();
    else tanya('Cabut Izin 8?', `Semua ${daftar.length} rekaman di HP ini akan langsung dihapus.`, lakukan);
  };

  const kini = new Date();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Rekaman suara (Izin 8)" ortu />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.teks }}>Rekaman suara di HP (pilihan)</Text>
          {TEKS_IZIN_8.map(([k, v]) => (
            <View key={k} style={{ gap: 2 }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teksKedua }}>{k}</Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>{v}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <Text style={{ flex: 1, fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>{nyala ? 'Izin 8 menyala' : 'Izin 8 mati'}</Text>
            <Switch accessibilityLabel="Izin 8 rekaman suara di HP" value={nyala} onValueChange={ubahIzin} trackColor={{ true: warna.hijauDaun, false: warna.abuGaris }} />
          </View>
        </View>

        {nyala ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10 }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>Rekaman tersimpan di HP ini</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
              Sematkan paling banyak {ATURAN_REKAMAN.sematan} cerita utuh per anak sebagai kenangan. Yang lain terhapus sendiri setelah {ATURAN_REKAMAN.hari} hari.
            </Text>
            {daftar.length === 0 ? <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teksRedup }}>Belum ada rekaman.</Text> : null}
            {daftarAnak.map((a) => {
              const milik = daftar.filter((c) => c.anak_id === a.id).sort((x, y) => y.dibuat.localeCompare(x.dibuat));
              if (!milik.length) return null;
              return (
                <View key={a.id} style={{ gap: 8 }}>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15 }}>
                    {HEWAN[a.hewan].emoji} {a.nama}
                  </Text>
                  {milik.map((c) => {
                    const sisa = sisaHari(c, kini);
                    return (
                      <View key={c.id} style={{ borderWidth: 1, borderColor: warna.abuGaris, borderRadius: 12, padding: 10, gap: 8 }}>
                        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teks }}>{namaRekaman(c)}</Text>
                        <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
                          {new Date(c.dibuat).toLocaleDateString('id-ID')} · {formatDetik(c.detik)} · {c.disematkan ? '📌 kenangan, tidak terhapus otomatis' : `terhapus dalam ${sisa} hari`}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                          <TombolKecil label="▶ Putar" onPress={() => putarRekaman(c.berkas)} />
                          {c.jenis === 'utuh' ? (
                            <TombolKecil
                              label={c.disematkan ? 'Lepas sematan' : '📌 Sematkan'}
                              onPress={async () => {
                                const ok = await gudangRekaman().sematkan(c.id, !c.disematkan);
                                setPesan(ok ? '' : `Sudah ada ${ATURAN_REKAMAN.sematan} kenangan untuk ${a.nama}. Lepas satu dulu.`);
                                void muat();
                              }}
                            />
                          ) : null}
                          <TombolKecil label="Hapus" bahaya onPress={() => void gudangRekaman().hapus(c.id).then(muat)} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
            {pesan ? <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.oranyeTua }}>{pesan}</Text> : null}
            {daftar.length > 0 ? (
              <Pressable accessibilityRole="button" onPress={() => tanya('Hapus semua rekaman?', 'Semua rekaman di HP ini akan dihapus, termasuk kenangan.', () => void gudangRekaman().hapusSemua().then(muat))} style={{ paddingVertical: 12 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: '#C0392B' }}>Hapus semua rekaman</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function TombolKecil({ label, onPress, bahaya }: { label: string; onPress: () => void; bahaya?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ paddingHorizontal: 12, minHeight: 40, justifyContent: 'center', borderRadius: 20, borderWidth: 1.5, borderColor: bahaya ? '#C0392B' : warna.abuGaris, opacity: pressed ? 0.8 : 1 })}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: bahaya ? '#C0392B' : warna.teks }}>{label}</Text>
    </Pressable>
  );
}
