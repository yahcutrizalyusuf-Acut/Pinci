/**
 * Bagian bersama D10 Ceritakan Lagi dan D11 Dengar Bedanya: pilih komik, kata bantu, dengar contoh panel.
 */
import { Pressable, Text, View } from 'react-native';

import type { Anak } from '../../data/jenis';
import { huruf, warna } from '../../desain/token';
import type { Komik, PanelKomik } from '../../isi/inggris/komik';
import { PAKET_KOMIK, suaraTokoh, teksTokoh } from '../../isi/inggris/paketKomik';
import { ucapkan, ucapkanTokoh } from '../../layanan/suara';

/** Komik yang boleh dipilih untuk anak ini: tingkat ≤ tingkat Bahasa Inggris anak (bawaan 3). */
export function komikUntukAnak(anak: Pick<Anak, 'tingkatInggris'>): Komik[] {
  const t = anak.tingkatInggris ?? 3;
  return Object.values(PAKET_KOMIK).flatMap((p) => (p && p.tingkat <= t ? p.komik : []));
}

/** Bacakan semua gelembung satu panel berurutan dengan suara tokohnya. */
export function dengarPanel(panel: PanelKomik, tingkat: number, selesai?: () => void) {
  const g = panel.gelembung;
  const ke = (i: number) => {
    if (i >= g.length) {
      selesai?.();
      return;
    }
    ucapkanTokoh(teksTokoh(g[i].teks), suaraTokoh(g[i].tokoh, tingkat), { selesai: () => setTimeout(() => ke(i + 1), 250) });
  };
  ke(0);
}

/** Kepingan kata bantu yang bisa diketuk untuk mendengar contohnya. */
export function KataBantu({ kata }: { kata: string[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
      {kata.map((k) => (
        <Pressable
          key={k}
          accessibilityRole="button"
          accessibilityLabel={`Dengar kata ${teksTokoh(k)}`}
          onPress={() => ucapkan(teksTokoh(k), 'en-US', { pelan: true })}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: pressed ? warna.oranyeMuda : warna.putih, borderWidth: 2, borderColor: warna.oranye })}
        >
          <Text style={{ fontSize: 15 }}>🔊</Text>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.teks }}>{teksTokoh(k)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function PilihKomik({ daftar, dibaca, onPilih, judul }: { daftar: Komik[]; dibaca: Set<string>; onPilih: (k: Komik) => void; judul: string }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teksKedua }}>{judul}</Text>
      {daftar.map((k) => (
        <Pressable
          key={k.id}
          accessibilityRole="button"
          onPress={() => onPilih(k)}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: warna.putih, opacity: pressed ? 0.85 : 1 })}
        >
          <Text style={{ fontSize: 28 }}>📖</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>{teksTokoh(k.judul)}</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>
              Tingkat {k.tingkat} · unit {Number(k.unit.slice(-2))}
              {dibaca.has(k.id) ? ' · sudah dibaca' : ''}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

/** Bantuan bertingkat Ceritakan Lagi (rancangan 13 bagian 3.3). */
export function bantuanTingkat(tingkat: number): { kalimat: string; kataBantuTampil: 'selalu' | 'ketuk' | 'tidak' } {
  if (tingkat <= 3) return { kalimat: 'Kalimat awal: This is…  I am…', kataBantuTampil: 'selalu' };
  if (tingkat === 4) return { kalimat: 'Kata sambung: First…  Then…  Finally…', kataBantuTampil: 'selalu' };
  if (tingkat === 5) return { kalimat: 'Ceritakan utuh. Panel boleh digabung.', kataBantuTampil: 'ketuk' };
  return { kalimat: 'Tambahkan pendapat: I like the story because…', kataBantuTampil: 'tidak' };
}
