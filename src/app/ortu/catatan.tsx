/** Catatan pengembang: ringkasan pemakaian yang bisa disalin dan dikirim ke Acut (seperti "Salin hasil" versi 4). */
import { ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { KepalaLayar, Tombol } from '@/komponen/dasar';

export default function CatatanPengembang() {
  const { daftarAnak } = useData();
  const teks = useMuat(
    async (r) => {
      const baris: string[] = [`Pintar Main 0.2.0 · ${new Date().toLocaleString('id-ID')}`];
      for (const a of daftarAnak) {
        const sesi = await r.daftarSesi(a.id);
        const pakai = await r.riwayatPemakaian(a.id);
        baris.push('', `${a.nama} (kelas ${a.kelas})`);
        const jenis = new Map<string, number>();
        for (const s of sesi) jenis.set(s.jenis, (jenis.get(s.jenis) ?? 0) + 1);
        baris.push(`Sesi: ${[...jenis.entries()].map(([k, v]) => `${k} ${v}`).join(', ') || 'belum ada'}`);
        for (const p of pakai.slice(-7)) baris.push(`${p.tanggal}: belajar ${Math.round(p.belajarDetik / 60)} mnt, main ${Math.round(p.mainDetik / 60)} mnt${p.intiSelesai ? ', inti selesai' : ''}`);
        for (const s of sesi.slice(-10)) baris.push(`- ${s.mulai.slice(0, 16).replace('T', ' ')} ${s.jenis}${s.level ? ` L${s.level}` : ''} ${s.benar}/${s.jumlah} ${s.durasiDetik} dtk ${s.mode}`);
      }
      baris.push('', `Antrean belum terkirim: ${(await r.antreanBelumTerkirim()).length}`);
      return baris.join('\n');
    },
    '',
    [daftarAnak.length],
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Catatan pengembang" ortu />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14 }}>
          <Text selectable style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teks }}>
            {teks}
          </Text>
        </View>
        <Tombol label="Salin / bagikan" ikon="bagikan" ortu onPress={() => Share.share({ message: teks }).catch(() => undefined)} />
      </ScrollView>
    </SafeAreaView>
  );
}
