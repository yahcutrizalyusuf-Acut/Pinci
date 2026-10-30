/* eslint-disable @typescript-eslint/no-require-imports -- jest.mock butuh require di dalam pabriknya */
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { formatAngka, formatRupiah } from '../../bersama/jenis';
import type { RingkasanBabak } from '../../bersama/ringkasan';
import LayarGame from '../LayarGame';
import { buatBabak, langkah, pecahUang, pesananSekarang, type KeadaanPasar } from '../logika';

// Tiruan reanimated sederhana: animasi langsung ke nilai akhir (mock bawaan butuh modul asli worklets).
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(() => ({ seekTo: jest.fn(), play: jest.fn(), remove: jest.fn(), addListener: jest.fn() })) }));
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
  for (const n of ['enabled', 'minDistance', 'onUpdate', 'onEnd', 'onBegin', 'onStart']) pan[n] = () => pan;
  return {
    Gesture: { Pan: () => pan },
    GestureDetector: ({ children }: { children: unknown }) => children,
    GestureHandlerRootView: View,
  };
});
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('../../bersama/tampilan/bunyi', () => ({ bunyiGame: jest.fn() }));

const KATA_TERLARANG = /salah|kalah|game over/i;

function propsContoh(ubah: Partial<Parameters<typeof LayarGame>[0]> = {}) {
  return {
    kelas: 1 as const,
    tingkat: 'seru' as const,
    benih: 42,
    sisaDetikAwal: Infinity,
    totalDetik: 1200,
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

async function ketuk(label: string | RegExp) {
  await fireEvent.press(screen.getByLabelText(label));
}

/** Membayar pesanan sekarang dengan uang pas (serakah) lewat ketukan, lalu "Berikan". */
async function bayarPas(k: KeadaanPasar): Promise<KeadaanPasar> {
  const p = pesananSekarang(k);
  let kini = k;
  for (const u of pecahUang(p.harga, k.uangTersedia)) {
    await ketuk(`Uang ${formatAngka(u)}`);
    kini = langkah(kini, { jenis: 'ketuk_uang', nilai: u });
  }
  await ketuk(`Berikan ke ${p.pembeli.nama}`);
  return langkah(kini, { jenis: 'serahkan' });
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('ketuk uang sampai pesanan pertama beres', async () => {
  const props = propsContoh();
  const k = buatBabak(props);
  const p = pesananSekarang(k);
  await render(<LayarGame {...props} />);

  expect(screen.getByText('Pasar Gampong')).toBeTruthy();
  expect(screen.getByText(p.kalimat)).toBeTruthy();
  expect(screen.getByText(formatRupiah(p.harga))).toBeTruthy();
  tidakAdaKataTerlarang();

  const sesudah = await bayarPas(k);
  expect(sesudah.fase).toBe('terima');
  expect(screen.getByText('✓ Pesanan beres!')).toBeTruthy();
  expect(screen.getByLabelText('Pembeli berikutnya')).toBeTruthy();
  tidakAdaKataTerlarang();

  // pembeli kedua datang
  await ketuk('Pembeli berikutnya');
  expect(screen.getByText(pesananSekarang(langkah(sesudah, { jenis: 'lanjut' })).kalimat)).toBeTruthy();
});

test('uang kebanyakan memantul, lalu Pinci memberi petunjuk setelah 2 kali', async () => {
  const props = propsContoh();
  const k = buatBabak(props);
  const p = pesananSekarang(k);
  const besar = k.uangTersedia.find((u) => u > p.harga) ?? 10000;
  await render(<LayarGame {...props} />);
  expect(besar).toBeGreaterThan(p.harga);

  await ketuk(`Uang ${formatAngka(besar)}`);
  expect(screen.getByLabelText(`Uang di nampan ${formatRupiah(0)}`)).toBeTruthy();
  expect(screen.getByText('Uangnya kebanyakan. Coba yang lebih kecil, ya.')).toBeTruthy();
  await ketuk(`Uang ${formatAngka(besar)}`);
  // petunjuk dari logika tampil di gelembung Pinci
  expect(screen.getByText(/Masih kurang/)).toBeTruthy();
  tidakAdaKataTerlarang();
});

test('bayar kurang membuat nampan memantul tanpa kata salah', async () => {
  const props = propsContoh({ benih: 9 });
  const k = buatBabak(props);
  const p = pesananSekarang(k);
  await render(<LayarGame {...props} />);
  expect(p.harga).toBeGreaterThan(500);
  await ketuk('Uang 500');
  await ketuk(`Berikan ke ${p.pembeli.nama}`);
  expect(screen.getByText('Uangnya masih kurang. Tambah lagi, ya.')).toBeTruthy();
  expect(screen.getByLabelText(`Uang di nampan ${formatRupiah(500)}`)).toBeTruthy();
  tidakAdaKataTerlarang();
});

test('satu babak penuh: pesta lalu onSelesai dengan ringkasan', async () => {
  const onSelesai = jest.fn<void, [RingkasanBabak]>();
  const props = propsContoh({ kelas: 3, tingkat: 'santai', benih: 5, onSelesai });
  let k = buatBabak(props);
  await render(<LayarGame {...props} />);
  while (k.fase !== 'selesai') {
    k = await bayarPas(k);
    await ketuk(k.indeks >= k.daftarPesanan.length - 1 ? 'Tutup warung' : 'Pembeli berikutnya');
    k = langkah(k, { jenis: 'lanjut' });
    tidakAdaKataTerlarang();
  }
  expect(onSelesai).not.toHaveBeenCalled();
  await act(async () => {
    jest.advanceTimersByTime(1500);
  });
  expect(onSelesai).toHaveBeenCalledTimes(1);
  expect(onSelesai.mock.calls[0][0].game).toBe('pasar');
});

test('kelas 5–6 Seru: anak memilih kembalian', async () => {
  const props = propsContoh({ kelas: 5, tingkat: 'seru', benih: 3 });
  let k = buatBabak(props);
  const p = pesananSekarang(k);
  await render(<LayarGame {...props} />);
  expect(screen.getByText('Hitung sendiri, ya')).toBeTruthy();
  // bayar dengan satu lembar yang lebih besar dari harga
  const lembar = k.uangTersedia.find((u) => u > p.harga) ?? 50000;
  await ketuk(`Uang ${formatAngka(lembar)}`);
  k = langkah(k, { jenis: 'ketuk_uang', nilai: lembar });
  await ketuk(`Berikan ke ${p.pembeli.nama}`);
  k = langkah(k, { jenis: 'serahkan' });
  expect(k.fase).toBe('kembalian');
  expect(screen.getByText('Berapa kembaliannya?')).toBeTruthy();
  await ketuk(`Kembalian ${formatRupiah(k.total - p.harga)}`);
  expect(screen.getByText('✓ Pesanan beres!')).toBeTruthy();
  tidakAdaKataTerlarang();
});
