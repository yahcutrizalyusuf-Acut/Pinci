/** Benda bisa dipakai dengan sentuhan dan dengan pembaca layar (label tombol), dan memanggil onSelesai saat pas. */
import { fireEvent, render } from '@testing-library/react-native';

import { BlokPuluhan, LompatGaris, PotonganPecahan, UangSederhana } from '../BendaInteraktif';
import { ModelBatang } from '../ModelBatang';

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const v = (x: unknown) => x;
  return { __esModule: true, default: { View, createAnimatedComponent: (k: unknown) => k }, useSharedValue: (x: unknown) => ({ value: x, set: () => undefined }), useAnimatedStyle: (f: () => unknown) => f(), withSpring: v, withTiming: v, withSequence: (...a: unknown[]) => a[a.length - 1], withRepeat: v };
});
jest.mock('react-native-worklets', () => ({ scheduleOnRN: (f: (...a: unknown[]) => void, ...a: unknown[]) => f(...a) }));
jest.mock('react-native-gesture-handler', () => ({ Gesture: { Pan: () => ({ onBegin: () => ({}) }) }, GestureDetector: ({ children }: { children: unknown }) => children }));

describe('benda interaktif', () => {
  it('Blok Puluhan: susun 21 dengan tombol berlabel', async () => {
    const selesai = jest.fn();
    const r = await render(<BlokPuluhan target={21} onSelesai={selesai} />);
    await fireEvent.press(r.getByLabelText('Tambah satu puluhan'));
    await fireEvent.press(r.getByLabelText('Tambah satu puluhan'));
    await fireEvent.press(r.getByLabelText('Tambah satu satuan'));
    expect(selesai).toHaveBeenCalledTimes(1);
    expect(r.getByLabelText('2 puluhan')).toBeTruthy();
  });

  it('Blok Puluhan: 10 satuan bisa dikelompokkan menjadi 1 puluhan', async () => {
    const r = await render(<BlokPuluhan target={10} onSelesai={jest.fn()} />);
    for (let i = 0; i < 10; i++) await fireEvent.press(r.getByLabelText('Tambah satu satuan'));
    await fireEvent.press(r.getByLabelText('Kelompokkan 10 satuan menjadi 1 puluhan'));
    expect(r.getByLabelText('1 puluhan')).toBeTruthy();
    expect(r.getByLabelText('0 satuan')).toBeTruthy();
  });

  it('Potongan Pecahan: ketuk potong (checkbox) sampai target', async () => {
    const selesai = jest.fn();
    const r = await render(<PotonganPecahan bentuk="lingkaran" bagian={8} target={4} onSelesai={selesai} />);
    for (let i = 1; i <= 4; i++) await fireEvent.press(r.getByLabelText(`Potong ke-${i} dari 8`));
    expect(selesai).toHaveBeenCalledTimes(1);
    expect(r.getAllByRole('checkbox')).toHaveLength(8);
  });

  it('Uang Sederhana: ambil dan kembalikan uang', async () => {
    const selesai = jest.fn();
    const r = await render(<UangSederhana pilihan={[1000, 2000, 5000]} target={9000} onSelesai={selesai} />);
    await fireEvent.press(r.getByLabelText('Ambil uang 5.000'));
    await fireEvent.press(r.getByLabelText('Ambil uang 5.000'));
    await fireEvent.press(r.getAllByLabelText('Kembalikan 5.000')[0]);
    await fireEvent.press(r.getByLabelText('Ambil uang 2.000'));
    await fireEvent.press(r.getByLabelText('Ambil uang 2.000'));
    expect(selesai).toHaveBeenCalledTimes(1);
  });

  it('Lompat di garis bilangan sampai target', async () => {
    const selesai = jest.fn();
    const r = await render(<LompatGaris lebar={300} data={{ jenis: 'lompat', garis: { mulai: 0, akhir: 24, langkah: 4 }, lompat: 4, target: 24 }} onSelesai={selesai} />);
    for (let i = 0; i < 6; i++) await fireEvent.press(r.getByLabelText('Lompat 4'));
    expect(selesai).toHaveBeenCalledTimes(1);
  });

  it('Model Batang: uraian untuk pembaca layar memakai tanda tanya', async () => {
    const r = await render(<ModelBatang lebar={280} data={{ baris: [{ ruas: [{ nilai: 20, dicari: true }, { nilai: 20, dicari: true }, { nilai: 20 }] }], keseluruhan: { nilai: 60 }, satuan: 'karung' }} />);
    expect(r.getByLabelText('Model batang. tanda tanya, tanda tanya, 20 karung. Keseluruhan 60 karung.')).toBeTruthy();
  });
});
