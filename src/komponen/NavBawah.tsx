/** Navigasi bawah gaya WhatsApp (Main.dc.html "Tab bawah"). */
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { huruf, warna } from '../desain/token';
import { Ikon, type NamaIkon } from './Ikon';

export interface ItemNav {
  nama: string;
  label: string;
  ikon: NamaIkon;
  titik?: boolean;
}

/** Bagian kecil dari props tabBar expo-router 58 (BottomTabBarProps) yang kita pakai. */
export interface PropsBilahTab {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
}

export function NavBawah({ props, item, ortu = false }: { props: PropsBilahTab; item: ItemNav[]; ortu?: boolean }) {
  const sisi = useSafeAreaInsets();
  const aktif = props.state.routes[props.state.index]?.name;
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        height: (ortu ? 64 : 64) + sisi.bottom,
        paddingBottom: sisi.bottom,
        backgroundColor: warna.putih,
        borderTopWidth: 1,
        borderTopColor: ortu ? warna.abuGaris : warna.kremGaris,
      }}
    >
      {item.map((it) => {
        const terpilih = aktif === it.nama;
        const warnaIkon = terpilih ? warna.hijauTua : ortu ? '#9AA0B2' : warna.ikonRedup;
        return (
          <Pressable
            key={it.nama}
            accessibilityRole="tab"
            accessibilityState={{ selected: terpilih }}
            accessibilityLabel={it.label}
            onPress={() => {
              const route = props.state.routes.find((r) => r.name === it.nama);
              if (route && !terpilih) props.navigateToTab(route.key);
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: terpilih ? warna.hijauPil : 'transparent',
              }}
            >
              <Ikon nama={it.ikon} ukuran={ortu ? 22 : 28} warna={warnaIkon} isi={terpilih} />
              {it.titik ? (
                <View style={{ position: 'absolute', top: 0, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: warna.oranye }} />
              ) : null}
            </View>
            <Text
              style={{
                fontFamily: ortu ? (terpilih ? huruf.ortuTebal : huruf.ortu) : terpilih ? huruf.anakTebal : huruf.anak,
                fontSize: ortu ? 12 : 13,
                color: terpilih ? warna.hijauTua : ortu ? '#9AA0B2' : warna.teksKedua,
              }}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
