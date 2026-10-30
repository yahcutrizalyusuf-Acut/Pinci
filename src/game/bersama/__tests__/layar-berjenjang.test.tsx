import { act, fireEvent, render, screen } from '@testing-library/react-native';
import type { ComponentType } from 'react';

import { PAKET_INGGRIS } from '../../../isi/inggris/paket';
import { soalSekarang } from '../babak-soal';
import type { Level } from '../level';
import type { PropsLayarGame } from '../tampilan/kontrak';
import LayarKebun from '../../kebun/LayarGame';
import * as kebun from '../../kebun/logika';
import LayarLompat from '../../lompat-batu/LayarGame';
import * as lompat from '../../lompat-batu/logika';
import LayarPasangan from '../../pasangan/LayarGame';
import * as pasangan from '../../pasangan/logika';
import LayarPerahu from '../../perahu/LayarGame';
import * as perahu from '../../perahu/logika';

jest.mock('expo-speech', () => ({ speak: jest.fn(), stop: jest.fn(), getAvailableVoicesAsync: jest.fn(async () => []) }));
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => ({ seekTo: jest.fn(), play: jest.fn(), remove: jest.fn(), addListener: jest.fn() })) }));
// Tiruan kecil reanimated: animasi langsung ke nilai akhir.
jest.mock('react-native-reanimated', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const akhir = (v: unknown) => v;
  const ease = () => (t: number) => t;
  const Animated = { View, createAnimatedComponent: (C: unknown) => C };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing: { linear: ease(), quad: ease(), sin: ease(), inOut: ease, in: ease, out: ease, bezier: ease },
    useSharedValue: (v: unknown) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    withTiming: akhir,
    withSpring: akhir,
    withDelay: (_ms: number, v: unknown) => v,
    withRepeat: akhir,
    withSequence: (...a: unknown[]) => a[a.length - 1],
    cancelAnimation: () => undefined,
  };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { SafeAreaView: View, SafeAreaProvider: View, useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
});

const BENIH = 2026;
const LEVEL: Level = 2;

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function tampilkan(Layar: ComponentType<PropsLayarGame>, kelas: 1 | 3 | 6 = 3) {
  const onSelesai = jest.fn();
  await render(<Layar kelas={kelas} tingkat="santai" level={LEVEL} benih={BENIH} sisaDetikAwal={Infinity} totalDetik={1800} bunyi={false} onSelesai={onSelesai} onKeluar={jest.fn()} />);
  return onSelesai;
}

function tanpaKataKalah() {
  expect(screen.queryByText(/salah|kalah|game over|nyawa/i)).toBeNull();
}

const GAME_SOAL = [
  { nama: 'Kebun Pinci', Layar: LayarKebun, buat: kebun.buatBabak, label: (n: number) => `Pilih ${n}` },
  { nama: 'Balap Perahu', Layar: LayarPerahu, buat: perahu.buatBabak, label: (n: number) => `Pilih ${n}` },
  { nama: 'Lompat Batu', Layar: LayarLompat, buat: lompat.buatBabak, label: (n: number) => `Batu ${n}` },
];

describe.each(GAME_SOAL)('$nama', ({ Layar, buat, label }) => {
  it('pilihan belum tepat tidak memajukan; jawaban tepat sampai babak selesai dan level tercatat', async () => {
    const onSelesai = await tampilkan(Layar);
    let k = buat({ kelas: 3, level: LEVEL, benih: BENIH });
    expect(screen.getByText(new RegExp(`Level ${LEVEL}`))).toBeTruthy();
    const s0 = soalSekarang(k);
    const keliru = s0.pilihan.find((p) => p !== s0.jawaban)!;
    await fireEvent.press(screen.getAllByLabelText(label(keliru))[0]);
    await fireEvent.press(screen.getAllByLabelText(label(keliru))[0]);
    expect(screen.getByText(s0.petunjuk)).toBeTruthy();
    tanpaKataKalah();
    while (k.fase !== 'selesai') {
      const s = soalSekarang(k);
      await fireEvent.press(screen.getAllByLabelText(label(s.jawaban))[0]);
      k = { ...k, ...(buat === lompat.buatBabak ? lompat.langkah(k as never, { jenis: 'jawab', nilai: s.jawaban }) : buat === perahu.buatBabak ? perahu.langkah(k as never, { jenis: 'jawab', nilai: s.jawaban }) : kebun.langkah(k as never, { jenis: 'jawab', nilai: s.jawaban })) };
    }
    tanpaKataKalah();
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(onSelesai).toHaveBeenCalledTimes(1);
    expect(onSelesai.mock.calls[0][0].level).toBe(LEVEL);
  });
});

describe('Pasangkan Kartu', () => {
  it('membuka semua pasangan sampai selesai; kartu belum cocok menutup lagi', async () => {
    const onSelesai = await tampilkan(LayarPasangan, 3);
    const k = pasangan.buatBabak({ kelas: 3, level: LEVEL, benih: BENIH, paketInggris: PAKET_INGGRIS });
    const kartuTertutup = () => screen.getAllByLabelText('Kartu tertutup');
    expect(kartuTertutup()).toHaveLength(k.kartu.length);
    // dua kartu yang bukan pasangan: menutup lagi setelah jeda
    const a = k.kartu[0];
    const b = k.kartu.find((c) => c.pasangan !== a.pasangan)!;
    await fireEvent.press(kartuTertutup()[a.id]);
    await fireEvent.press(screen.getAllByRole('button').filter((x) => x.props.accessibilityLabel !== 'Kembali')[b.id]);
    await act(async () => {
      jest.advanceTimersByTime(1100);
    });
    expect(kartuTertutup()).toHaveLength(k.kartu.length);
    tanpaKataKalah();
    // buka semua pasangan dengan benar
    const kelompok = new Map<string, number[]>();
    k.kartu.forEach((c) => kelompok.set(c.pasangan, [...(kelompok.get(c.pasangan) ?? []), c.id]));
    const tombolKartu = () => screen.getAllByRole('button').filter((x) => x.props.accessibilityLabel !== 'Kembali');
    for (const [x, y] of kelompok.values()) {
      await fireEvent.press(tombolKartu()[x]);
      await fireEvent.press(tombolKartu()[y]);
    }
    expect(screen.getByText('Semua pasangan ketemu!')).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(onSelesai).toHaveBeenCalledTimes(1);
    expect(onSelesai.mock.calls[0][0].level).toBe(LEVEL);
  });
});
