/** Menu titik tiga di beranda anak: Ganti anak (tanpa PIN) dan Pengaturan (lewat PIN). */
import { fireEvent, render } from '@testing-library/react-native';

import { MenuAnak, pilihanMenuAnak } from '../MenuAnak';

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace, push: mockPush }) }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 24, bottom: 0, left: 0, right: 0 }) }));

beforeEach(() => {
  mockReplace.mockClear();
  mockPush.mockClear();
});

describe('MenuAnak', () => {
  it('tertutup di awal; titik tiga membuka dua pilihan', async () => {
    const r = await render(<MenuAnak />);
    expect(r.queryByLabelText('Ganti anak')).toBeNull();
    await fireEvent.press(r.getByLabelText('Menu'));
    expect(r.getByLabelText('Ganti anak')).toBeTruthy();
    expect(r.getByLabelText('Pengaturan')).toBeTruthy();
  });

  it('Ganti anak langsung ke pilih profil, tanpa PIN', async () => {
    const r = await render(<MenuAnak />);
    await fireEvent.press(r.getByLabelText('Menu'));
    await fireEvent.press(r.getByLabelText('Ganti anak'));
    expect(mockReplace).toHaveBeenCalledWith('/profil');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('Pengaturan lewat layar PIN orang tua', async () => {
    const r = await render(<MenuAnak />);
    await fireEvent.press(r.getByLabelText('Menu'));
    await fireEvent.press(r.getByLabelText('Pengaturan'));
    expect(mockPush).toHaveBeenCalledWith('/ortu/pin');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('daftar pilihan berurutan: Ganti anak lebih dulu, id unik', () => {
    const p = pilihanMenuAnak({ replace: jest.fn(), push: jest.fn() } as never);
    expect(p.map((x) => x.label)).toEqual(['Ganti anak', 'Pengaturan']);
    expect(new Set(p.map((x) => x.id)).size).toBe(p.length);
  });
});
