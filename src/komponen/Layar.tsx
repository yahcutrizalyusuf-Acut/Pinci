/** Bingkai layar: area aman, latar, dan pilihan gulir. Lebar konten dibatasi 480 dp untuk tablet/web. */
import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { warna } from '../desain/token';

export function Layar({
  children,
  gulir = false,
  latar = warna.kremLembut,
  isiGaya,
  bawah,
  tanpaPadding = false,
}: {
  children: ReactNode;
  gulir?: boolean;
  latar?: string;
  isiGaya?: StyleProp<ViewStyle>;
  /** bagian yang menempel di bawah (tombol utama, nav) */
  bawah?: ReactNode;
  tanpaPadding?: boolean;
}) {
  const pad: ViewStyle = tanpaPadding ? {} : { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: latar }} edges={['top', 'left', 'right', ...(bawah ? [] : (['bottom'] as const))]}>
      <View style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' }}>
        {gulir ? (
          <ScrollView contentContainerStyle={[pad, { gap: 16, flexGrow: 1 }, isiGaya]} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1, gap: 16 }, pad, isiGaya]}>{children}</View>
        )}
      </View>
      {bawah ? (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: latar }}>
          <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center' }}>{bawah}</View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}
