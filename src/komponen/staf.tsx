/** Komponen kecil untuk layar staf (pengawas, admin, mitra). Gaya mode orang tua: Nunito, latar abu. */
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { huruf, warna } from '../desain/token';
import { GalatStaf } from '../data/staf';
import { KepalaLayar } from './dasar';

export function LatarStaf({ judul, children, kanan, onKembali }: { judul: string; children: ReactNode; kanan?: ReactNode; onKembali?: () => void }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center' }}>
          <KepalaLayar judul={judul} ortu kanan={kanan} onKembali={onKembali} />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 720, width: '100%', alignSelf: 'center' }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function KotakStaf({ children, garis }: { children: ReactNode; garis?: string }) {
  return <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10, borderWidth: garis ? 2 : 0, borderColor: garis }}>{children}</View>;
}

export function JudulKotak({ children }: { children: ReactNode }) {
  return <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.teks }}>{children}</Text>;
}

export function TeksStaf({ children, redup, tebal }: { children: ReactNode; redup?: boolean; tebal?: boolean }) {
  return <Text style={{ fontFamily: tebal ? huruf.ortuTebal : huruf.ortu, fontSize: 15, lineHeight: 21, color: redup ? warna.teksKedua : warna.teks }}>{children}</Text>;
}

export function IsianStaf(props: TextInputProps & { label: string }) {
  const { label, style, ...lain } = props;
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: warna.teksKedua }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={warna.teksRedup}
        {...lain}
        style={[
          { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: warna.abuGaris, backgroundColor: warna.putih, paddingHorizontal: 12, paddingVertical: 10, fontFamily: huruf.ortu, fontSize: 16, color: warna.teks },
          props.multiline ? { minHeight: 110, textAlignVertical: 'top' } : null,
          style,
        ]}
      />
    </View>
  );
}

export function Pil({ label, aktif, onPress, warnaAktif = warna.hijauTua }: { label: string; aktif?: boolean; onPress: () => void; warnaAktif?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!aktif }}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: aktif ? warnaAktif : warna.abuGaris,
        backgroundColor: aktif ? warnaAktif : pressed ? warna.abuTerang : warna.putih,
      })}
    >
      <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: aktif ? warna.putih : warna.teks }}>{label}</Text>
    </Pressable>
  );
}

export function Penanda({ label, warnaTeks, latar }: { label: string; warnaTeks: string; latar: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: latar }}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warnaTeks }}>{label}</Text>
    </View>
  );
}

export function PesanGalat({ teks }: { teks: string }) {
  if (!teks) return null;
  return <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 15, color: '#C0392B' }}>{teks}</Text>;
}

/** Ubah galat dari server menjadi kalimat sederhana. */
export function pesanGalatStaf(e: unknown): string {
  if (e instanceof GalatStaf) {
    if (e.alasan === 'belum_masuk') return 'Sesi masuk sudah habis. Masuk lagi dengan email.';
    if (e.alasan === 'tidak_boleh') return 'Akun Anda tidak punya hak untuk tindakan ini.';
    if (e.alasan === 'jaringan') return 'Belum tersambung ke server. Periksa internet.';
    if (e.message === 'pengawas_tidak_cocok') return 'Pengawas ini bukan dari lembaga yang sama dengan kelasnya.';
    if (e.message === 'mitra_kosong') return 'Pilih les mitra lebih dulu.';
  }
  return 'Belum berhasil. Coba lagi sebentar lagi.';
}
