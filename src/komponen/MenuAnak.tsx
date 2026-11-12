/**
 * Menu titik tiga (⋮) di beranda anak. Menggantikan ikon gembok.
 * Daftar pilihan ada di satu tempat (`pilihanMenuAnak`): menambah pilihan baru cukup menambah satu baris.
 *
 * - Ganti anak: langsung, TANPA PIN (anak boleh berganti profil sendiri; datanya tidak ikut terbuka).
 * - Pengaturan: lewat PIN orang tua (mode orang tua).
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { huruf, warna } from '../desain/token';
import { Ikon, type NamaIkon } from './Ikon';

export interface PilihanMenuAnak {
  id: string;
  label: string;
  ikon: NamaIkon;
  /** keterangan kecil di bawah label */
  sub?: string;
  onPilih: () => void;
}

/** Semua pilihan menu. Tambah pilihan baru di sini. */
export function pilihanMenuAnak(router: ReturnType<typeof useRouter>): PilihanMenuAnak[] {
  return [
    { id: 'ganti-anak', label: 'Ganti anak', ikon: 'dua_orang', sub: 'Pilih profil lain', onPilih: () => router.replace('/profil') },
    { id: 'pengaturan', label: 'Pengaturan', ikon: 'gembok', sub: 'Pakai PIN orang tua', onPilih: () => router.push('/ortu/pin') },
  ];
}

export function MenuAnak() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [buka, setBuka] = useState(false);
  const pilihan = pilihanMenuAnak(router);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Menu"
        accessibilityState={{ expanded: buka }}
        onPress={() => setBuka(true)}
        style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}
      >
        <Ikon nama="titik_tiga" ukuran={22} warna={warna.teksKedua} />
      </Pressable>
      <Modal visible={buka} transparent animationType="fade" onRequestClose={() => setBuka(false)} statusBarTranslucent>
        <Pressable accessibilityLabel="Tutup menu" onPress={() => setBuka(false)} style={{ flex: 1, backgroundColor: 'rgba(45,49,66,0.25)' }}>
          <View
            accessibilityRole="menu"
            style={{ position: 'absolute', top: insets.top + 52, right: 16, minWidth: 230, backgroundColor: warna.putih, borderRadius: 18, paddingVertical: 6, elevation: 8, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
          >
            {pilihan.map((p, i) => (
              <Pressable
                key={p.id}
                accessibilityRole="menuitem"
                accessibilityLabel={p.label}
                onPress={() => {
                  setBuka(false);
                  p.onPilih();
                }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 16, backgroundColor: pressed ? warna.kremLembut : 'transparent', borderTopWidth: i ? 1 : 0, borderTopColor: warna.kremGaris })}
              >
                <Ikon nama={p.ikon} ukuran={22} warna={warna.teks} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: warna.teks }}>{p.label}</Text>
                  {p.sub ? <Text style={{ fontFamily: huruf.anak, fontSize: 12, color: warna.teksKedua }}>{p.sub}</Text> : null}
                </View>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
