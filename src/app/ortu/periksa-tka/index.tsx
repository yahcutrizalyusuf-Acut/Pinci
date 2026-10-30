/** Periksa isi TKA (orang tua/guru): daftar topik, simulasi, dan teks beserta kemajuan pemeriksaan. */
import { useRouter } from 'expo-router';
import { Pressable, Share, Text, View } from 'react-native';

import { useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { TKA_BUKA } from '@/fitur/konfig';
import { AWALAN_PERIKSA, daftarKelompok, laporanPeriksa, ringkasPeriksa, type HasilPeriksa, type KelompokPeriksa } from '@/fitur/periksa-tka';
import { paketTka } from '@/isi/tka/paket';
import { KepalaLayar, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';

const KELOMPOK = daftarKelompok(paketTka);

function idKeHasil(daftar: [string, HasilPeriksa][]): Map<string, HasilPeriksa> {
  return new Map(daftar.map(([k, v]) => [k.slice(AWALAN_PERIKSA.length), v]));
}

export default function PeriksaTka() {
  const router = useRouter();
  const hasil = useMuat(async (r) => idKeHasil(await r.nilaiAwalan<HasilPeriksa>(AWALAN_PERIKSA)), new Map<string, HasilPeriksa>());
  const semua = KELOMPOK.map((k) => ringkasPeriksa(k, hasil));
  const total = semua.reduce((n, x) => n + x.total, 0);
  const layak = semua.reduce((n, x) => n + x.layak, 0);
  const perlu = semua.reduce((n, x) => n + x.perlu, 0);
  const tanggal = new Date(`${TKA_BUKA}T00:00:00`);
  const tanggalBuka = Number.isNaN(tanggal.getTime()) ? 'sudah dibuka' : tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const bagian = (judul: string, daftar: KelompokPeriksa[], warnaJudul: string) => (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warnaJudul }}>{judul}</Text>
      {daftar.map((k) => {
        const r = ringkasPeriksa(k, hasil);
        return (
          <Pressable
            key={k.id}
            accessibilityRole="button"
            accessibilityLabel={`${k.id} ${k.judul}. ${r.layak} sudah benar, ${r.perlu} perlu diperbaiki, dari ${r.total}`}
            onPress={() => router.push(`/ortu/periksa-tka/${k.id}`)}
            style={({ pressed }) => ({ backgroundColor: warna.putih, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: pressed ? 0.8 : 1 })}
          >
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.teks, width: 38 }}>{k.id}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 15, color: warna.teks }} numberOfLines={1}>
                {k.judul}
              </Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
                {r.layak}/{r.total} sudah benar{r.perlu ? ` · ${r.perlu} perlu diperbaiki` : ''}
              </Text>
            </View>
            <Text style={{ fontSize: 18 }}>{r.belum === 0 ? (r.perlu ? '✏️' : '✅') : '›'}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Layar gulir latar={warna.abuTerang}>
      <KepalaLayar judul="Periksa isi TKA" />
      <View style={{ backgroundColor: '#FFF6D6', borderRadius: 16, padding: 14, gap: 6 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.teks }}>Untuk orang tua dan guru</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teks }}>
          Anak baru bisa membuka latihan TKA pada {tanggalBuka}. Sebelum itu, periksa setiap soal di sini, lalu tandai Sudah benar atau Perlu diperbaiki. Pemeriksaan ini tidak mengubah rapor anak.
        </Text>
      </View>
      <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 4 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.teks }}>
          {layak} dari {total} sudah benar
        </Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
          {perlu} perlu diperbaiki · {total - layak - perlu} belum diperiksa
        </Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Isi: {total - paketTka.teks.length} soal dan {paketTka.teks.length} teks bacaan</Text>
      </View>
      <Tombol label="Bagikan hasil periksa" varian="garis" onPress={() => Share.share({ message: laporanPeriksa(KELOMPOK, hasil) })} />
      {bagian('Matematika', KELOMPOK.filter((k) => k.jenis === 'topik' && k.mapel === 'mat'), warnaMapel.mat.teks)}
      {bagian('Bahasa Indonesia', KELOMPOK.filter((k) => k.jenis === 'topik' && k.mapel === 'bi'), warnaMapel.bi.teks)}
      {bagian('Simulasi', KELOMPOK.filter((k) => k.jenis === 'simulasi'), warna.teks)}
      {bagian('Teks bacaan', KELOMPOK.filter((k) => k.jenis === 'teks'), warna.teks)}
    </Layar>
  );
}
