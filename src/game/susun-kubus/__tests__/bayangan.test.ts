import { batasTinggi, bagianBelumCocok, jenjangUntuk, kartuDari, petakKosong, type TekaTeki } from '../logika';
import { bayanganDiTitik, buatGeometri, sisiKubus } from '../tampilan/geometri';
import { daftarTanda } from '../tampilan/Panggung';

jest.mock('react-native-reanimated', () => ({ __esModule: true, default: { View: 'View' }, Easing: {}, useAnimatedStyle: () => ({}), useSharedValue: (v: number) => ({ value: v }), withSequence: jest.fn(), withTiming: jest.fn() }));

const jawaban = [[1, 2, 0, 1]];
const teka: TekaTeki = { id: 'u', baris: 1, kolom: 4, tinggiMaks: 3, target: kartuDari(jawaban, ['depan']), contohJawaban: jawaban };

test('mengetuk kubus putus-putus menaruh kubus di petak yang ditunjuk', () => {
  const g = buatGeometri(320, 300, 1, 4, 3);
  const petak = petakKosong(1, 4);
  const tanda = daftarTanda(g, petak, teka.target, bagianBelumCocok(petak, teka.target), batasTinggi(teka));
  expect(tanda.map((t) => t.k).sort()).toEqual([0, 1, 1, 3]);
  const t = tanda.find((x) => x.k === 3 && x.z === 0)!;
  const depan = sisiKubus(g, t.b, t.k, t.z).depan;
  const pusat = [depan.reduce((n, p) => n + p[0], 0) / depan.length, depan.reduce((n, p) => n + p[1], 0) / depan.length] as const;
  expect(bayanganDiTitik(g, tanda, pusat)).toEqual([0, 3]);
});

test('ketukan jauh dari bayangan tidak memilih apa pun', () => {
  const g = buatGeometri(320, 300, 1, 4, 3);
  const petak = petakKosong(1, 4);
  const tanda = daftarTanda(g, petak, teka.target, bagianBelumCocok(petak, teka.target), batasTinggi(teka));
  expect(bayanganDiTitik(g, tanda, [-500, -500])).toBeNull();
});

test('Santai hanya memakai kartu tampak depan di semua kelas', () => {
  for (const kelas of [1, 2, 3, 4, 5, 6] as const) {
    for (const j of jenjangUntuk(kelas, 'santai')) expect(j.kartu).toEqual(['depan']);
  }
});
