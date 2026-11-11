/**
 * Langkah "Coba dengan benda" di kartu ilmu (M1): 1 layar benda interaktif → 1 layar gambar (batang/garis) → angka.
 */
import { useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import type { CobaBenda } from '../../isi/gudang/jenis';
import { Tombol, TombolSuara } from '../dasar';
import { Benda } from './BendaInteraktif';
import { GarisBilangan } from './GarisBilangan';
import { ModelBatang } from './ModelBatang';

export function CobaDenganBenda({ coba, onSelesai }: { coba: CobaBenda; onSelesai: () => void }) {
  const { width } = useWindowDimensions();
  const lebar = Math.min(width - 64, 420);
  const [layar, setLayar] = useState<'benda' | 'gambar' | 'angka'>('benda');
  const [pas, setPas] = useState(false);
  const kartu = { backgroundColor: warna.putih, borderRadius: 24, padding: 16, gap: 12 } as const;
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
        {(['benda', 'gambar', 'angka'] as const).map((l) => (
          <Text key={l} style={{ fontFamily: huruf.anakTebal, fontSize: 14, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', backgroundColor: l === layar ? warna.oranyeMuda : 'transparent', color: l === layar ? '#B86E00' : warna.teksRedup }}>
            {l === 'benda' ? '1 Benda' : l === 'gambar' ? '2 Gambar' : '3 Angka'}
          </Text>
        ))}
      </View>
      {layar === 'benda' ? (
        <View style={kartu}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>{coba.soal}</Text>
            <TombolSuara teks={`${coba.soal} ${coba.perintah}`} ukuran={36} />
          </View>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua }}>{coba.perintah}</Text>
          <Benda benda={coba.benda} lebar={lebar} onSelesai={() => setPas(true)} />
        </View>
      ) : layar === 'gambar' ? (
        <View style={kartu}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>{coba.teksGambar}</Text>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>{coba.gambar.jenis === 'batang' ? <ModelBatang data={coba.gambar.data} lebar={lebar} /> : <GarisBilangan data={coba.gambar.data} lebar={lebar} />}</View>
        </View>
      ) : (
        <View style={[kartu, { alignItems: 'center' }]}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Sekarang dengan angka:</Text>
          <Text style={{ fontFamily: huruf.judul, fontSize: 30, color: warna.teks, textAlign: 'center' }}>{coba.kalimat}</Text>
          <TombolSuara teks={coba.kalimat.replace(/×/g, 'kali').replace(/:/g, 'dibagi')} ukuran={40} />
        </View>
      )}
      {layar === 'benda' ? (
        <Tombol label={pas ? 'Lanjut: gambar' : 'Lewati benda'} varian={pas ? 'utama' : 'garis'} besar onPress={() => setLayar('gambar')} />
      ) : layar === 'gambar' ? (
        <Tombol label="Lanjut: angka" besar onPress={() => setLayar('angka')} />
      ) : (
        <Tombol label="Lanjut: contoh" besar onPress={onSelesai} />
      )}
    </View>
  );
}
