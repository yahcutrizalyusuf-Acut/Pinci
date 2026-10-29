import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { RingkasanBabak } from '../../bersama/ringkasan';
import type { PropsLayarGame } from '../../bersama/tampilan/kontrak';
import LayarGame from '../LayarGame';
import { buatBabak, langkah, type AksiUlarTangga } from '../logika';
import { rencanaAksi, WAKTU } from '../tampilan/rencana';

// Tiruan reanimated sederhana: animasi langsung ke nilai akhir (mock bawaan butuh modul asli worklets).
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const akhir = (...a: unknown[]) => a[a.length - 1];
  const nilaiAkhir = (v: unknown) => v;
  const kurva = () => (t: number) => t;
  const Easing = new Proxy({}, { get: () => (...a: unknown[]) => (a.length ? kurva() : (t: number) => t) });
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (k: unknown) => k },
    Easing,
    useSharedValue: (v: unknown) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    withTiming: nilaiAkhir,
    withSpring: nilaiAkhir,
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: nilaiAkhir,
    withSequence: akhir,
  };
});
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('../../bersama/tampilan/bunyi', () => ({ bunyiGame: jest.fn() }));

const KATA_TERLARANG = /salah|kalah|game over/i;

function propsContoh(ubah: Partial<Omit<PropsLayarGame, 'onSelesai' | 'onKeluar'>> = {}) {
  return {
    kelas: 3 as const,
    tingkat: 'santai' as const,
    benih: 42,
    sisaDetikAwal: Infinity,
    totalDetik: 1800,
    bunyi: false,
    onSelesai: jest.fn<void, [RingkasanBabak]>(),
    onKeluar: jest.fn(),
    ...ubah,
  };
}

function tidakAdaKataTerlarang() {
  expect(screen.queryByText(KATA_TERLARANG)).toBeNull();
  expect(screen.queryByLabelText(KATA_TERLARANG)).toBeNull();
}

async function maju(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('G04 LayarGame', () => {
  it('santai: ketuk dadu → pion maju, Pinci main sendiri, tanpa kata yang menghukum', async () => {
    const props = propsContoh();
    await render(<LayarGame {...props} />);
    expect(screen.getByText('Ular Tangga Lurus')).toBeTruthy();
    expect(screen.getByText('Ketuk dadu')).toBeTruthy();
    tidakAdaKataTerlarang();

    await fireEvent.press(screen.getByTestId('dadu'));
    await maju(WAKTU.tampilDadu + 50);
    expect(screen.getByText(/^Kamu (maju|naik sulur)/)).toBeTruthy();
    await maju(8000);
    expect(screen.getByText(/^Pinci (maju|naik sulur)/)).toBeTruthy();
    expect(screen.getByText('Giliran: Kamu')).toBeTruthy();
    tidakAdaKataTerlarang();
  });

  it('santai: babak berjalan sampai selesai lalu onSelesai dipanggil dengan ringkasan ramah', async () => {
    const props = propsContoh({ benih: 7 });
    await render(<LayarGame {...props} />);
    for (let i = 0; i < 40 && props.onSelesai.mock.calls.length === 0; i++) {
      const dadu = screen.queryByTestId('dadu');
      if (dadu) await fireEvent.press(dadu);
      await maju(10000);
      tidakAdaKataTerlarang();
    }
    expect(props.onSelesai).toHaveBeenCalledTimes(1);
    const r = props.onSelesai.mock.calls[0][0];
    expect(JSON.stringify(r)).not.toMatch(KATA_TERLARANG);
  });

  it('seru: soal muncul, jawaban belum tepat memantul tanpa kata "salah", lalu petunjuk muncul', async () => {
    const props = propsContoh({ tingkat: 'seru', kelas: 2 });
    const awal = buatBabak({ kelas: 2, tingkat: 'seru', benih: props.benih });
    const denganSoal = langkah(awal, { jenis: 'lempar_dadu' });
    const soal = denganSoal.soal!;
    const keliru = soal.pilihan.filter((n) => n !== soal.jawaban);

    await render(<LayarGame {...props} />);
    await fireEvent.press(screen.getByTestId('dadu'));
    await maju(WAKTU.tampilDadu + 50);
    expect(screen.getByText(soal.teks)).toBeTruthy();

    await fireEvent.press(screen.getByLabelText(`Jawaban ${keliru[0]}`));
    tidakAdaKataTerlarang();
    await fireEvent.press(screen.getByLabelText(`Jawaban ${keliru[1]}`));
    expect(screen.getByText(soal.petunjuk)).toBeTruthy();
    tidakAdaKataTerlarang();

    await fireEvent.press(screen.getByLabelText(`Jawaban ${soal.jawaban}`));
    await maju(10000);
    expect(screen.queryByText(soal.teks)).toBeNull();
    tidakAdaKataTerlarang();
  });
});

describe('rencanaAksi', () => {
  it('santai: lempar → gerak anak → giliran Pinci → anak bebas lagi', () => {
    const k = buatBabak({ kelas: 4, tingkat: 'santai', benih: 3 });
    const r = rencanaAksi(k, { jenis: 'lempar_dadu' });
    const jenis = r.map((x) => x.peristiwa.jenis);
    expect(jenis[0]).toBe('putar_dadu');
    expect(jenis).toContain('pinci_bicara');
    expect(jenis[jenis.length - 1]).toBe('bebas');
    // urut waktu
    for (let i = 1; i < r.length; i++) expect(r[i].pada).toBeGreaterThanOrEqual(r[i - 1].pada);
  });

  it('aksi tidak sah tidak menghasilkan rencana', () => {
    const k = buatBabak({ kelas: 4, tingkat: 'santai', benih: 3 });
    const aksi: AksiUlarTangga = { jenis: 'giliran_pinci' };
    expect(rencanaAksi(k, aksi)).toEqual([]);
  });
});
