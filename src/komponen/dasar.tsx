/**
 * Komponen dasar sistem desain (Main.dc.html bagian 3–4).
 * Aturan wajib: teks di tombol Hijau Daun dan Oranye Jeruk berwarna Biru Tinta, bukan putih.
 */
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated as RNAnimated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';

import { bayangan, huruf, radius, warna } from '../desain/token';
import { ucapkan } from '../layanan/suara';
import { Ikon, type NamaIkon } from './Ikon';
import { Pinci, type EkspresiPinci } from './Pinci';

// ---------- Teks ----------

type PropsTeks = { children: ReactNode; style?: StyleProp<TextStyle>; baris?: number };

export function Judul({ children, style, baris }: PropsTeks) {
  return (
    <Text numberOfLines={baris} style={[gaya.judul, style]}>
      {children}
    </Text>
  );
}

/** Teks anak (Andika). */
export function TeksAnak({ children, style, baris }: PropsTeks) {
  return (
    <Text numberOfLines={baris} style={[gaya.teksAnak, style]}>
      {children}
    </Text>
  );
}

/** Teks orang tua (Nunito). */
export function TeksOrtu({ children, style, baris }: PropsTeks) {
  return (
    <Text numberOfLines={baris} style={[gaya.teksOrtu, style]}>
      {children}
    </Text>
  );
}

export function Logo({ ukuran = 22 }: { ukuran?: number }) {
  return (
    <Text style={{ fontFamily: huruf.judul, fontSize: ukuran }}>
      <Text style={{ color: warna.hijauTua }}>Pintar</Text> <Text style={{ color: warna.oranye }}>Main</Text>
    </Text>
  );
}

// ---------- Tombol ----------

export type VarianTombol = 'utama' | 'oranye' | 'garis' | 'putih' | 'abu' | 'hijauTua';

interface PropsTombol {
  label: string;
  onPress?: () => void;
  varian?: VarianTombol;
  ikon?: NamaIkon;
  besar?: boolean;
  nonaktif?: boolean;
  memuat?: boolean;
  ortu?: boolean;
  style?: StyleProp<ViewStyle>;
  aksesLabel?: string;
}

const LATAR: Record<VarianTombol, string> = {
  utama: warna.hijauDaun,
  oranye: warna.oranye,
  garis: 'transparent',
  putih: warna.putih,
  abu: '#F1E9D8',
  hijauTua: warna.hijauTua,
};

export function Tombol({
  label,
  onPress,
  varian = 'utama',
  ikon,
  besar = false,
  nonaktif = false,
  memuat = false,
  ortu = false,
  style,
  aksesLabel,
}: PropsTombol) {
  const [skala] = useState(() => new RNAnimated.Value(1));
  const tekan = (v: number) =>
    RNAnimated.spring(skala, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const warnaTeks = varian === 'hijauTua' ? warna.putih : varian === 'garis' ? warna.hijauTua : warna.biruTinta;
  const mati = nonaktif || memuat;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={aksesLabel ?? label}
      accessibilityState={{ disabled: mati }}
      disabled={mati}
      onPress={onPress}
      onPressIn={() => tekan(0.96)}
      onPressOut={() => tekan(1)}
      style={style}
    >
      <RNAnimated.View
        style={[
          gaya.tombol,
          {
            height: besar ? 72 : ortu ? 48 : 56,
            backgroundColor: nonaktif ? warna.nonaktif : LATAR[varian],
            borderWidth: varian === 'garis' ? 2 : varian === 'putih' ? 1 : 0,
            borderColor: varian === 'garis' ? warna.hijauDaun : warna.kremGaris,
            transform: [{ scale: skala }],
          },
        ]}
      >
        {memuat ? (
          <ActivityIndicator color={warna.biruTinta} />
        ) : (
          <>
            {ikon && <Ikon nama={ikon} ukuran={besar ? 26 : 22} warna={nonaktif ? warna.teksRedup : warnaTeks} />}
            <Text
              style={{
                fontFamily: ortu ? huruf.ortuTebal : huruf.judulTebal,
                fontSize: besar ? 22 : ortu ? 16 : 19,
                color: nonaktif ? warna.teksRedup : warnaTeks,
              }}
            >
              {label}
            </Text>
          </>
        )}
      </RNAnimated.View>
    </Pressable>
  );
}

/** Tombol kecil putih di pojok (Jeda, Petunjuk, Kembali). */
export function TombolKecil({
  label,
  ikon,
  onPress,
  aksesLabel,
}: {
  label?: string;
  ikon?: NamaIkon;
  onPress?: () => void;
  aksesLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={aksesLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [gaya.tombolKecil, pressed && { opacity: 0.7 }]}
    >
      {ikon && <Ikon nama={ikon} ukuran={18} />}
      {label ? <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>{label}</Text> : null}
    </Pressable>
  );
}

/** Tombol 🔊 bulat: membacakan teks dengan mesin suara HP. */
export function TombolSuara({
  teks,
  bahasa = 'id-ID',
  ukuran = 44,
  latar = warna.hijauMuda,
  warnaIkon = warna.hijauTua,
}: {
  teks: string;
  bahasa?: 'id-ID' | 'en-US';
  ukuran?: number;
  latar?: string;
  warnaIkon?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dengarkan"
      onPress={() => ucapkan(teks, bahasa)}
      style={({ pressed }) => ({
        width: ukuran,
        height: ukuran,
        borderRadius: ukuran / 2,
        backgroundColor: latar,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ikon nama="suara" ukuran={ukuran * 0.5} warna={warnaIkon} />
    </Pressable>
  );
}

// ---------- Kartu, gelembung, bilah ----------

export function Kartu({
  children,
  style,
  onPress,
  aksesLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  aksesLabel?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={aksesLabel}
        onPress={onPress}
        style={({ pressed }) => [gaya.kartu, style, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[gaya.kartu, style]}>{children}</View>;
}

/** Pinci dengan gelembung bicara (A03, A04). */
export function GelembungPinci({
  judul,
  teks,
  ekspresi = 'menyapa',
  ukuranPinci = 96,
  suara,
}: {
  judul?: string;
  teks?: string;
  ekspresi?: EkspresiPinci;
  ukuranPinci?: number;
  suara?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
      <Pinci ekspresi={ekspresi} ukuran={ukuranPinci} />
      <View style={gaya.gelembung}>
        {judul ? <Text style={[gaya.judul, { fontFamily: huruf.judulTebal, fontSize: 22 }]}>{judul}</Text> : null}
        {teks ? <Text style={[gaya.teksAnak, { fontSize: 17, lineHeight: 23 }]}>{teks}</Text> : null}
        {suara && (teks || judul) ? (
          <View style={{ position: 'absolute', right: 8, top: 8 }}>
            <TombolSuara teks={`${judul ?? ''}. ${teks ?? ''}`} ukuran={32} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function BilahKemajuan({
  nilai,
  maks,
  label,
  warnaIsi = warna.hijauDaun,
  tinggi = 14,
}: {
  nilai: number;
  maks: number;
  label?: string;
  warnaIsi?: string;
  tinggi?: number;
}) {
  const persen = maks > 0 ? Math.max(0, Math.min(1, nilai / maks)) : 0;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ now: nilai, min: 0, max: maks }}
        style={{ flex: 1, height: tinggi, borderRadius: 999, backgroundColor: warna.kremBatang, overflow: 'hidden' }}
      >
        <View style={{ width: `${persen * 100}%`, height: '100%', borderRadius: 999, backgroundColor: warnaIsi }} />
      </View>
      {label ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{label}</Text> : null}
    </View>
  );
}

export function Lencana({ teks, latar = warna.hijauMuda, warnaTeks = warna.hijauTua }: { teks: string; latar?: string; warnaTeks?: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: latar, alignSelf: 'flex-start' }}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 12, color: warnaTeks }}>{teks}</Text>
    </View>
  );
}

/** Kotak petunjuk biru muda dengan 🔊 (Main.dc.html). */
export function KotakPetunjuk({ teks }: { teks: string }) {
  return (
    <View style={gaya.petunjuk}>
      <TombolSuara teks={teks} ukuran={36} latar="#FFFFFF" warnaIkon="#2A86C6" />
      <Text style={[gaya.teksAnak, { flex: 1, fontSize: 16 }]}>{teks}</Text>
    </View>
  );
}

// ---------- Papan angka ----------

export function PapanAngka({
  onAngka,
  onHapus,
  onCek,
  tombolTambahan,
  cekNonaktif,
}: {
  onAngka: (a: string) => void;
  onHapus: () => void;
  onCek: () => void;
  /** tombol tambahan (mis. "/" dan ",") untuk soal pecahan/desimal */
  tombolTambahan?: string[];
  cekNonaktif?: boolean;
}) {
  const tombolAngka = (a: string) => (
    <Pressable
      key={a}
      accessibilityRole="button"
      accessibilityLabel={a}
      onPress={() => onAngka(a)}
      style={({ pressed }) => [gaya.tombolAngka, pressed && { backgroundColor: '#F7F1E4', transform: [{ translateY: 2 }] }]}
    >
      <Text style={{ fontFamily: huruf.anak, fontSize: 30, color: warna.teks }}>{a}</Text>
    </Pressable>
  );
  return (
    <View style={{ gap: 10 }}>
      {tombolTambahan && tombolTambahan.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>{tombolTambahan.map((t) => <View key={t} style={{ flex: 1 }}>{tombolAngka(t)}</View>)}</View>
      ) : null}
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ].map((baris) => (
        <View key={baris.join()} style={{ flexDirection: 'row', gap: 10 }}>
          {baris.map((a) => (
            <View key={a} style={{ flex: 1 }}>
              {tombolAngka(a)}
            </View>
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hapus"
          onPress={onHapus}
          style={({ pressed }) => [gaya.tombolAngka, { flex: 1, backgroundColor: '#F1E9D8', borderWidth: 0, flexDirection: 'row', gap: 6 }, pressed && { opacity: 0.7 }]}
        >
          <Ikon nama="hapus" ukuran={22} />
          <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>Hapus</Text>
        </Pressable>
        <View style={{ flex: 1 }}>{tombolAngka('0')}</View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cek"
          disabled={cekNonaktif}
          onPress={onCek}
          style={({ pressed }) => [
            gaya.tombolAngka,
            { flex: 1, backgroundColor: cekNonaktif ? warna.nonaktif : warna.hijauDaun, borderWidth: 0, flexDirection: 'row', gap: 6 },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ikon nama="centang" ukuran={24} />
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.biruTinta }}>Cek</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------- Kepala layar ----------

export function KepalaLayar({
  judul,
  onKembali,
  kanan,
  ortu = false,
  warnaJudul = warna.teks,
}: {
  judul: string;
  onKembali?: () => void;
  kanan?: ReactNode;
  ortu?: boolean;
  warnaJudul?: string;
}) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 52, gap: 8 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        onPress={onKembali ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        style={({ pressed }) => [gaya.tombolKembali, ortu && { backgroundColor: warna.putih }, pressed && { opacity: 0.6 }]}
      >
        <Ikon nama="kiri" ukuran={24} />
      </Pressable>
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: ortu ? huruf.ortuTebal : huruf.judul,
          fontSize: ortu ? 20 : 22,
          color: warnaJudul,
        }}
      >
        {judul}
      </Text>
      {kanan}
    </View>
  );
}

export const gaya = StyleSheet.create({
  judul: { fontFamily: huruf.judul, fontSize: 24, color: warna.teks },
  teksAnak: { fontFamily: huruf.anak, fontSize: 17, color: warna.teks },
  teksOrtu: { fontFamily: huruf.ortu, fontSize: 16, color: warna.teks },
  tombol: {
    borderRadius: radius.tombol,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tombolKecil: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: warna.putih,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tombolKembali: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kartu: {
    backgroundColor: warna.putih,
    borderRadius: radius.kartu,
    padding: 16,
    ...bayangan.kartu,
  },
  gelembung: {
    flex: 1,
    backgroundColor: warna.putih,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...bayangan.ringan,
  },
  petunjuk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: warna.biruMuda,
  },
  tombolAngka: {
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: warna.kremBatang,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: warna.kremBatang,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
