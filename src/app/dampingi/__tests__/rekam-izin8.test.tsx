/**
 * Tombol rekam hanya tampil kalau Izin 8 menyala (CLAUDE.md aturan 12).
 */
import { render } from '@testing-library/react-native';

let mockIzin = false;

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const nilaiAkhir = (v: unknown) => v;
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (k: unknown) => k },
    useSharedValue: (v: unknown) => {
      const sv = { value: v, get: () => sv.value, set: (n: unknown) => (sv.value = n) };
      return sv;
    },
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    cancelAnimation: () => undefined,
    withRepeat: nilaiAkhir,
    withTiming: nilaiAkhir,
    withSpring: nilaiAkhir,
    withDelay: (_d: number, v: unknown) => v,
    withSequence: (...a: unknown[]) => a[a.length - 1],
    Easing: new Proxy({}, { get: () => () => (t: number) => t }),
  };
});
jest.mock('react-native-worklets', () => ({ scheduleOnRN: (f: (...a: unknown[]) => void, ...a: unknown[]) => f(...a) }));
jest.mock('expo-audio', () => ({
  RecordingPresets: { HIGH_QUALITY: {} },
  useAudioRecorder: () => ({ prepareToRecordAsync: jest.fn(), record: jest.fn(), stop: jest.fn(), uri: null }),
  requestRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setAudioModeAsync: jest.fn(async () => undefined),
  createAudioPlayer: jest.fn(() => ({ play: jest.fn(), remove: jest.fn() })),
}));
jest.mock('expo-speech', () => ({ speak: jest.fn(), stop: jest.fn(), getAvailableVoicesAsync: jest.fn(async () => []) }));
jest.mock('expo-router', () => ({ useRouter: () => ({ back: jest.fn(), push: jest.fn() }), useLocalSearchParams: () => ({ komik: 't3-u01-komik' }) }));
jest.mock('@/layanan/rekaman', () => ({ izin8Nyala: async () => mockIzin, gudangRekaman: () => ({ daftarAnak: async () => [], tambah: jest.fn() }) }));
jest.mock('@/data/konteks', () => ({
  useData: () => ({ anakAktif: { id: 'a1', nama: 'Rani', kelas: 4, hewan: 'kucing', tingkatInggris: 3 }, repo: {}, keluarga: { sapaanOrtu: 'Bunda' } }),
  useMuat: <T,>(f: (r: unknown) => Promise<T>, awal: T) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useEffect, useState } = require('react') as typeof import('react');
    const [v, setV] = useState(awal);
    useEffect(() => {
      void f({ daftarSesi: async () => [] }).then(setV);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return v;
  },
}));

// eslint-disable-next-line import/first
import CeritakanLagi from '../cerita';

describe('Ceritakan Lagi dan Izin 8', () => {
  it('tanpa Izin 8: Ceritakan Lagi tetap jalan, tombol rekam tidak ada', async () => {
    mockIzin = false;
    const r = await render(<CeritakanLagi />);
    expect(await r.findByText(/Dengar contoh panel ini/)).toBeTruthy();
    expect(r.queryByLabelText(/Rekam/)).toBeNull();
    expect(r.queryByText(/🎙/)).toBeNull();
  });

  it('dengan Izin 8: tombol rekam tampil', async () => {
    mockIzin = true;
    const r = await render(<CeritakanLagi />);
    expect(await r.findByLabelText('Rekam suaraku')).toBeTruthy();
  });
});
