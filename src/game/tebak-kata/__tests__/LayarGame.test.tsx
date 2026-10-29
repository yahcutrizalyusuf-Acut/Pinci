import { act, fireEvent, render, screen } from '@testing-library/react-native';

import LayarGame from '../LayarGame';
import { buatBabak, langkah, potonganBerikut, soalSekarang } from '../logika';
import { kataInggrisUntuk, kosakataDariPaket } from '../tampilan/kosakataInggris';

jest.mock('expo-speech', () => ({ speak: jest.fn(), stop: jest.fn() }));
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => ({ seekTo: jest.fn(), play: jest.fn() })) }));
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

const Speech = jest.requireMock('expo-speech') as { speak: jest.Mock };

const BENIH = 4242;

async function tampilkan(onSelesai = jest.fn()) {
  await render(
    <LayarGame kelas={1} tingkat="santai" benih={BENIH} sisaDetikAwal={Infinity} totalDetik={1200} bunyi onSelesai={onSelesai} onKeluar={jest.fn()} />,
  );
  return onSelesai;
}

function tidakAdaKataKalah() {
  expect(screen.queryByText(/salah|kalah|game over/i)).toBeNull();
}

beforeEach(() => {
  jest.useFakeTimers();
  Speech.speak.mockClear();
});
afterEach(() => {
  jest.useRealTimers();
});

describe('LayarGame Tebak Kata', () => {
  it('menyusun satu kata lengkap dengan ketukan, lalu lanjut ke kata berikutnya', async () => {
    await tampilkan();
    let k = buatBabak({ kelas: 1, tingkat: 'santai', benih: BENIH });
    const soal = soalSekarang(k);
    expect(screen.getByText(soal.emoji)).toBeTruthy();
    // kata pertama dibacakan saat dibuka
    expect(Speech.speak).toHaveBeenCalledWith(soal.ucapan, expect.objectContaining({ language: 'id-ID' }));
    tidakAdaKataKalah();

    while (potonganBerikut(k) !== null) {
      const teks = potonganBerikut(k)!;
      await fireEvent.press(screen.getByLabelText(`Ubin ${teks}`));
      k = langkah(k, { jenis: 'pilih', teks });
      tidakAdaKataKalah();
    }
    expect(k.fase).toBe('benar');
    await act(() => jest.advanceTimersByTime(600));
    const kata = soal.ucapan.charAt(0).toUpperCase() + soal.ucapan.slice(1);
    expect(screen.getByText(`${kata}!`)).toBeTruthy();
    expect(screen.getByLabelText('Lanjut')).toBeTruthy();
    tidakAdaKataKalah();

    await fireEvent.press(screen.getByLabelText('Lanjut'));
    k = langkah(k, { jenis: 'lanjut' });
    expect(screen.getByText(soalSekarang(k).emoji)).toBeTruthy();
  });

  it('pilihan belum tepat tidak memakai kata "salah", dan petunjuk muncul setelah 2 kali', async () => {
    await tampilkan();
    const k = buatBabak({ kelas: 1, tingkat: 'santai', benih: BENIH });
    const keliru = soalSekarang(k).pilihan.find((p) => p !== potonganBerikut(k))!;
    await fireEvent.press(screen.getByLabelText(`Ubin ${keliru}`));
    tidakAdaKataKalah();
    await fireEvent.press(screen.getByLabelText(`Ubin ${keliru}`));
    expect(screen.getByText(soalSekarang(k).petunjuk)).toBeTruthy();
    tidakAdaKataKalah();
  });

  it('babak selesai → onSelesai dengan ringkasan setelah pesta singkat', async () => {
    const onSelesai = await tampilkan();
    let k = buatBabak({ kelas: 1, tingkat: 'santai', benih: BENIH });
    while (k.fase !== 'selesai') {
      const teks = potonganBerikut(k);
      if (teks) {
        await fireEvent.press(screen.getByLabelText(`Ubin ${teks}`));
        k = langkah(k, { jenis: 'pilih', teks });
      } else {
        await fireEvent.press(screen.getByLabelText('Lanjut'));
        k = langkah(k, { jenis: 'lanjut' });
      }
    }
    expect(onSelesai).not.toHaveBeenCalled();
    await act(() => jest.advanceTimersByTime(1500));
    expect(onSelesai).toHaveBeenCalledTimes(1);
    expect(onSelesai.mock.calls[0][0]).toMatchObject({ game: 'tebak_kata', kelas: 1 });
    tidakAdaKataKalah();
  });

  it('kosakata Inggris dari paket hanya dipakai kelas 5–6 tingkat Seru', async () => {
    expect(kataInggrisUntuk(1, 'seru')).toBeUndefined();
    expect(kataInggrisUntuk(5, 'santai')).toBeUndefined();
    const daftar = kataInggrisUntuk(6, 'seru')!;
    expect(daftar.length).toBeGreaterThanOrEqual(3);
    expect(daftar.every((k) => k.emoji !== '' && /^[a-z]+$/.test(k.inggris))).toBe(true);
    expect(kosakataDariPaket({ unit: [{ kosakata: [{ kata: 'one o\'clock', arti: 'pukul satu', emoji: '🕐' }] }] })).toEqual([]);
    const babak = buatBabak({ kelas: 5, tingkat: 'seru', benih: 1, kataInggris: kataInggrisUntuk(5, 'seru') });
    expect(babak.jenis).toBe('inggris');
  });
});
