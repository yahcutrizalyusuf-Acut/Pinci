/** Pilihan jawaban TKA: PG (satu), PG kompleks (beberapa), PG kategori (Benar/Salah per pernyataan). */
import { Pressable, Text, View } from 'react-native';

import { huruf, warna } from '../../desain/token';
import type { Butir } from '../../isi/tka/jenis';
import type { JawabanAnak } from '../../isi/tka/pemuat';
import { TeksKaya } from './TeksKaya';

export function jawabanKosong(b: Butir): JawabanAnak {
  return b.bentuk === 'pg' ? '' : b.bentuk === 'pgk' ? [] : b.pilihan.map(() => '');
}

export function jawabanLengkap(b: Butir, j: JawabanAnak): boolean {
  if (b.bentuk === 'pg') return typeof j === 'string' && j !== '';
  if (b.bentuk === 'pgk') return Array.isArray(j) && j.length > 0;
  return Array.isArray(j) && j.every((x) => x !== '');
}

interface Props {
  butir: Butir;
  jawaban: JawabanAnak;
  onUbah: (j: JawabanAnak) => void;
  /** setelah diperiksa: tampilkan benar (hijau) dan pilihan anak yang keliru (oranye lembut) */
  tampilKunci?: boolean;
  warnaUtama?: string;
}

function warnaPilihan(benar: boolean, dipilih: boolean, kunci: boolean | undefined) {
  if (kunci && benar) return { latar: warna.hijauMuda, garis: warna.hijauSegar };
  if (kunci && dipilih) return { latar: '#FFF4E5', garis: warna.oranye };
  if (dipilih) return { latar: '#EAF2FF', garis: '#3A86FF' };
  return { latar: warna.putih, garis: warna.kremBatang };
}

export function PilihJawaban({ butir, jawaban, onUbah, tampilKunci, warnaUtama = '#2A5DB0' }: Props) {
  if (butir.bentuk === 'pgkat') {
    const j = Array.isArray(jawaban) ? jawaban : [];
    return (
      <View style={{ gap: 10 }}>
        {butir.pilihan.map((p, i) => (
          <View key={p.huruf} style={{ backgroundColor: warna.putih, borderRadius: 16, borderWidth: 1, borderColor: warna.kremBatang, padding: 12, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warnaUtama }}>{p.huruf}.</Text>
              <View style={{ flex: 1 }}>
                <TeksKaya teks={p.teks} ukuran={16} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {butir.kategori.map((kat, k) => {
                const nilai = k === 0 ? 'B' : 'S';
                const dipilih = j[i] === nilai;
                const benar = butir.kunci[i] === nilai;
                const w = warnaPilihan(benar, dipilih, tampilKunci);
                return (
                  <Pressable
                    key={kat}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: dipilih }}
                    accessibilityLabel={`Pernyataan ${p.huruf}: ${kat}`}
                    disabled={tampilKunci}
                    onPress={() => {
                      const baru = [...butir.pilihan.map((_, x) => j[x] ?? '')];
                      baru[i] = nilai;
                      onUbah(baru);
                    }}
                    style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 2, borderColor: w.garis, backgroundColor: w.latar, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{kat}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  }
  const banyak = butir.bentuk === 'pgk';
  const dipilihSet = new Set(typeof jawaban === 'string' ? [jawaban] : jawaban);
  const kunciSet = new Set(typeof butir.kunci === 'string' ? [butir.kunci] : butir.kunci);
  return (
    <View style={{ gap: 10 }}>
      {banyak ? <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Pilih semua jawaban yang benar.</Text> : null}
      {butir.pilihan.map((p) => {
        const dipilih = dipilihSet.has(p.huruf);
        const w = warnaPilihan(kunciSet.has(p.huruf), dipilih, tampilKunci);
        return (
          <Pressable
            key={p.huruf}
            accessibilityRole={banyak ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: dipilih }}
            accessibilityLabel={`Pilihan ${p.huruf}`}
            disabled={tampilKunci}
            onPress={() => {
              if (!banyak) onUbah(p.huruf);
              else {
                const s = new Set(dipilihSet);
                if (s.has(p.huruf)) s.delete(p.huruf);
                else s.add(p.huruf);
                onUbah([...s].filter(Boolean).sort());
              }
            }}
            style={({ pressed }) => ({
              minHeight: 56,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: w.garis,
              backgroundColor: w.latar,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            <View style={{ width: 32, height: 32, borderRadius: banyak ? 8 : 16, backgroundColor: dipilih ? '#3A86FF' : '#EAF2FF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: dipilih ? '#FFFFFF' : warnaUtama }}>{p.huruf}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TeksKaya teks={p.teks} ukuran={17} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
