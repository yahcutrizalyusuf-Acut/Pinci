/* eslint-disable @typescript-eslint/no-require-imports -- jest.mock butuh require di dalam pabriknya */
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import LayarGame from '../LayarGame';
import { buatBabak, ringkasan, type TekaTeki } from '../logika';
import { buatGeometri, pusatAtas } from '../tampilan/geometri';

// Tiruan reanimated sederhana: animasi langsung ke nilai akhir.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const akhir = (...a: unknown[]) => a[a.length - 1];
  const nilaiAkhir = (v: unknown) => v;
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (k: unknown) => k },
    useSharedValue: (v: unknown) => {
      const sv = {
        value: v,
        get: () => sv.value,
        set: (n: unknown) => {
          sv.value = n;
        },
      };
      return sv;
    },
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    withRepeat: nilaiAkhir,
    withTiming: nilaiAkhir,
    withSpring: nilaiAkhir,
    withDelay: (_d: number, v: unknown) => v,
    withSequence: akhir,
    Easing: new Proxy({}, { get: () => () => (t: number) => t }),
  };
});
jest.mock('react-native-worklets', () => ({ scheduleOnRN: (f: (...a: unknown[]) => void, ...a: unknown[]) => f(...a) }));
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  const pan: Record<string, unknown> = {};
  for (const n of ['runOnJS', 'enabled', 'minDistance', 'onUpdate', 'onEnd', 'onBegin', 'onStart', 'onFinalize']) pan[n] = () => pan;
  return {
    Gesture: { Pan: () => pan },
    GestureDetector: ({ children }: { children: unknown }) => children,
    GestureHandlerRootView: View,
  };
});
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('../../bersama/tampilan/bunyi', () => ({ bunyiGame: jest.fn() }));

const KATA_TERLARANG = /salah|kalah|game over/i;
const LEBAR = 328;
const TINGGI = 340;

function propsContoh(ubah: Partial<Parameters<typeof LayarGame>[0]> = {}) {
  return {
    kelas: 1 as const,
    tingkat: 'santai' as const,
    benih: 7,
    sisaDetikAwal: Infinity,
    totalDetik: 1200,
    bunyi: false,
    onSelesai: jest.fn(),
    onKeluar: jest.fn(),
    ...ubah,
  };
}

function semuaTeks(): string {
  return JSON.stringify(screen.toJSON());
}

async function siapkanPanggung() {
  const panggung = screen.getByTestId('panggung-kubus');
  await fireEvent.layout(panggung, { x: 0, y: 0, width: LEBAR, height: TINGGI });
  return panggung;
}

async function ketukPetak(t: TekaTeki, b: number, k: number, tinggiSekarang: number) {
  const g = buatGeometri(LEBAR, TINGGI, t.baris, t.kolom, t.tinggiMaks);
  const [x, y] = pusatAtas(g, b, k, tinggiSekarang);
  // ketuk sedikit di bawah pusat atas: tepat di sisi depan tumpukan / di ubin
  await fireEvent.press(screen.getByTestId('panggung-kubus'), { nativeEvent: { locationX: x, locationY: y + 2 } });
}

describe('LayarGame Susun Kubus', () => {
  it('kelas 1 santai: ketuk petak menambah kubus, Urung mengembalikannya', async () => {
    await render(<LayarGame {...propsContoh()} />);
    expect(screen.getByText('Susun Kubus')).toBeTruthy();
    expect(screen.getByText('Kartu tampak depan')).toBeTruthy();
    expect(screen.getByText('Ketuk kubus putus-putus untuk menaruh kubus di sana.')).toBeTruthy();
    // kelas 1–2 hanya ketuk: tidak ada rak seret
    expect(screen.queryByLabelText('Kubus kayu, seret ke petak')).toBeNull();

    const panggung = await siapkanPanggung();
    const teka = buatBabak({ kelas: 1, tingkat: 'santai', benih: 7 }).daftarTekaTeki[0];
    expect(panggung.props.accessibilityLabel).toBe('Petak kayu, ada 0 kubus');

    await ketukPetak(teka, 0, 0, 0);
    expect(screen.getByTestId('panggung-kubus').props.accessibilityLabel).toBe('Petak kayu, ada 1 kubus');

    await fireEvent.press(screen.getByRole('button', { name: 'Urung' }));
    expect(screen.getByTestId('panggung-kubus').props.accessibilityLabel).toBe('Petak kayu, ada 0 kubus');

    expect(semuaTeks()).not.toMatch(KATA_TERLARANG);
  });

  it('kubus berlebih memantul, setelah 2 kali muncul petunjuk; tanpa kata menakutkan', async () => {
    await render(<LayarGame {...propsContoh()} />);
    await siapkanPanggung();
    const teka = buatBabak({ kelas: 1, tingkat: 'santai', benih: 7 }).daftarTekaTeki[0];
    const batas = teka.target.depan[0];
    for (let i = 0; i < batas; i++) await ketukPetak(teka, 0, 0, i);
    await ketukPetak(teka, 0, 0, batas);
    expect(screen.getByText('Di situ sudah cukup tinggi. Coba petak lain, ya.')).toBeTruthy();
    expect(screen.queryByText(/^Lihat kartu/)).toBeNull();
    await ketukPetak(teka, 0, 0, batas);
    expect(screen.getByText(/^Lihat kartu tampak depan/)).toBeTruthy();
    expect(screen.getByTestId('panggung-kubus').props.accessibilityLabel).toBe(`Petak kayu, ada ${batas} kubus`);
    expect(semuaTeks()).not.toMatch(KATA_TERLARANG);
  });

  it('menyelesaikan semua teka-teki → pesta → onSelesai(ringkasan)', async () => {
    jest.useFakeTimers();
    try {
      const props = propsContoh();
      await render(<LayarGame {...props} />);
      await siapkanPanggung();
      const k = buatBabak({ kelas: 1, tingkat: 'santai', benih: 7 });
      for (const t of k.daftarTekaTeki) {
        const tinggi = t.contohJawaban.map((b) => b.map(() => 0));
        for (let b = 0; b < t.baris; b++) {
          for (let kol = 0; kol < t.kolom; kol++) {
            while (tinggi[b][kol] < t.contohJawaban[b][kol]) {
              await ketukPetak(t, b, kol, tinggi[b][kol]);
              tinggi[b][kol] += 1;
            }
          }
        }
        expect(screen.getByText('Cocok!')).toBeTruthy();
        await act(async () => {
          jest.advanceTimersByTime(1300);
        });
      }
      expect(props.onSelesai).not.toHaveBeenCalled();
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      expect(props.onSelesai).toHaveBeenCalledTimes(1);
      const kubus = k.daftarTekaTeki.reduce((n, t) => n + t.contohJawaban.flat().reduce((a, x) => a + x, 0), 0);
      const harapan = ringkasan({ ...k, catatan: { tekaTekiSelesai: k.daftarTekaTeki.length, kubusDitaruh: kubus, petunjuk: 0 } });
      expect(props.onSelesai).toHaveBeenCalledWith(harapan);
      expect(semuaTeks()).not.toMatch(KATA_TERLARANG);
    } finally {
      jest.useRealTimers();
    }
  });

  it('kelas 4 menampilkan rak kubus untuk diseret, ketuk tetap berfungsi', async () => {
    await render(<LayarGame {...propsContoh({ kelas: 4, tingkat: 'seru', benih: 3 })} />);
    expect(screen.getByLabelText('Kubus kayu, seret ke petak')).toBeTruthy();
    await siapkanPanggung();
    const teka = buatBabak({ kelas: 4, tingkat: 'seru', benih: 3 }).daftarTekaTeki[0];
    // petak depan-kiri yang boleh diisi
    const b = teka.contohJawaban.findIndex((baris) => baris.some((x) => x > 0));
    const kol = teka.contohJawaban[b].findIndex((x) => x > 0);
    await ketukPetak(teka, b, kol, 0);
    expect(screen.getByTestId('panggung-kubus').props.accessibilityLabel).toBe('Petak kayu, ada 1 kubus');
    expect(semuaTeks()).not.toMatch(KATA_TERLARANG);
  });
});
