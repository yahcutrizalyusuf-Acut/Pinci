/** Isian profil anak: nama panggilan, kelas, hewan profil (data seminim mungkin). */
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { HEWAN, type Anak, type HewanProfil } from '../data/jenis';
import { huruf, warna } from '../desain/token';
import { TeksOrtu, Tombol } from './dasar';

export function FormAnak({
  awal,
  label = 'Simpan',
  onSimpan,
}: {
  awal?: Partial<Pick<Anak, 'nama' | 'kelas' | 'hewan'>>;
  label?: string;
  onSimpan: (d: Pick<Anak, 'nama' | 'kelas' | 'hewan'>) => void | Promise<void>;
}) {
  const [nama, setNama] = useState(awal?.nama ?? '');
  const [kelas, setKelas] = useState<number>(awal?.kelas ?? 6);
  const [hewan, setHewan] = useState<HewanProfil>(awal?.hewan ?? 'gajah');
  const [simpan, setSimpan] = useState(false);
  const bersih = nama.trim();
  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Nama panggilan</TeksOrtu>
        <TextInput
          value={nama}
          onChangeText={(t) => setNama(t.slice(0, 16))}
          placeholder="mis. Aisyah"
          placeholderTextColor={warna.teksRedup}
          autoCapitalize="words"
          accessibilityLabel="Nama panggilan anak"
          style={{
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: warna.abuGaris,
            backgroundColor: warna.putih,
            paddingHorizontal: 14,
            fontFamily: huruf.ortu,
            fontSize: 17,
            color: warna.teks,
          }}
        />
        <TeksOrtu style={{ fontSize: 13, color: warna.teksKedua }}>Cukup nama panggilan. Tanpa nama lengkap, foto, atau nomor HP anak.</TeksOrtu>
      </View>
      <View style={{ gap: 6 }}>
        <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Kelas</TeksOrtu>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityLabel={`Kelas ${k}`}
              accessibilityState={{ selected: kelas === k }}
              onPress={() => setKelas(k)}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: kelas === k ? warna.hijauDaun : warna.putih,
                borderWidth: 1,
                borderColor: kelas === k ? warna.hijauDaun : warna.abuGaris,
              }}
            >
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 18, color: warna.teks }}>{k}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Hewan profil</TeksOrtu>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {(Object.keys(HEWAN) as HewanProfil[]).map((h) => (
            <Pressable
              key={h}
              accessibilityRole="button"
              accessibilityLabel={HEWAN[h].nama}
              accessibilityState={{ selected: hewan === h }}
              onPress={() => setHewan(h)}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: HEWAN[h].latar,
                borderWidth: 3,
                borderColor: hewan === h ? warna.hijauDaun : 'transparent',
              }}
            >
              <Text style={{ fontSize: 32 }}>{HEWAN[h].emoji}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Tombol
        label={label}
        ortu
        nonaktif={bersih.length < 2}
        memuat={simpan}
        onPress={async () => {
          setSimpan(true);
          try {
            await onSimpan({ nama: bersih, kelas, hewan });
          } finally {
            setSimpan(false);
          }
        }}
      />
    </View>
  );
}
