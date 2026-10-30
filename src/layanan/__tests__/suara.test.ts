const voices = [
  { identifier: 'en-gb-default', name: 'GB', language: 'en-GB', quality: 'Default' },
  { identifier: 'en-us-default', name: 'US', language: 'en_US', quality: 'Default' },
  { identifier: 'en-us-enhanced', name: 'US+', language: 'en-US', quality: 'Enhanced' },
];

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  VoiceQuality: { Default: 'Default', Enhanced: 'Enhanced' },
  getAvailableVoicesAsync: jest.fn(),
}));

type TiruanSuara = { speak: jest.Mock; getAvailableVoicesAsync: jest.Mock };

/** Muat modul suara baru (ingatan pilihan suara kosong) beserta tiruan mesin suaranya. */
function muat() {
  let hasil!: { Speech: TiruanSuara; ucapkan: typeof import('../suara').ucapkan };
  jest.isolateModules(() => {
    const Speech = jest.requireMock('expo-speech') as TiruanSuara;
    const { ucapkan } = jest.requireActual('../suara') as typeof import('../suara');
    hasil = { Speech, ucapkan };
  });
  return hasil;
}

const tunggu = () => new Promise((r) => setTimeout(r, 0));

test('Inggris memakai suara en-US berkualitas tinggi', async () => {
  const { Speech, ucapkan } = muat();
  Speech.getAvailableVoicesAsync.mockResolvedValue(voices);
  ucapkan('Hello', 'en-US');
  await tunggu();
  expect(Speech.speak).toHaveBeenCalledWith('Hello', expect.objectContaining({ language: 'en-US', voice: 'en-us-enhanced' }));
});

test('tanpa suara yang cocok, mesin bawaan HP dipakai', async () => {
  const { Speech, ucapkan } = muat();
  Speech.getAvailableVoicesAsync.mockResolvedValue([]);
  ucapkan('Hello', 'en-US');
  await tunggu();
  const opsi = Speech.speak.mock.calls[0][1] as Record<string, unknown>;
  expect(opsi.language).toBe('en-US');
  expect(opsi).not.toHaveProperty('voice');
});

test('daftar suara gagal dibaca: tetap bicara', async () => {
  const { Speech, ucapkan } = muat();
  Speech.getAvailableVoicesAsync.mockRejectedValue(new Error('tidak ada'));
  ucapkan('Halo', 'id-ID');
  await tunggu();
  expect(Speech.speak).toHaveBeenCalledTimes(1);
});
