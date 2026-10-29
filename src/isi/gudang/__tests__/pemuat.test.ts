import type { PaketGudang } from '../jenis';
import { ambilKartu, petaTopik } from '../pemuat';
import { bangunPaketGudang } from '../sumber/peta';

const paket: PaketGudang = bangunPaketGudang();

describe('petaTopik', () => {
  test('tanpa kemajuan: topik berkartu belum, sisanya segera', () => {
    const peta = petaTopik(paket, {});
    expect(peta.map((m) => m.kode)).toEqual(['mat', 'bi']);
    const mat = peta[0];
    expect(mat.judul).toBe('Matematika');
    expect(mat.topik.find((t) => t.id === 'mat6-lingkaran')?.status).toBe('segera');
    expect(mat.topik.find((t) => t.id === 'mat6-kpk-fpb')?.status).toBe('belum');
    expect(mat.jumlah.belum + mat.jumlah.segera).toBe(mat.topik.length);
    expect(mat.lanjutkan).toBe('mat6-urutan-hitung');
  });

  test('status dari kemajuan; segera tidak bisa ditimpa', () => {
    const peta = petaTopik(paket, {
      'mat6-urutan-hitung': 'kuasai',
      'mat6-kpk-fpb': 'belajar',
      'mat6-lingkaran': 'kuasai',
      'bi6-ide-pokok': 'belajar',
    });
    const mat = peta[0];
    expect(mat.topik.find((t) => t.id === 'mat6-urutan-hitung')?.status).toBe('kuasai');
    expect(mat.topik.find((t) => t.id === 'mat6-lingkaran')?.status).toBe('segera');
    expect(mat.jumlah.kuasai).toBe(1);
    expect(mat.jumlah.belajar).toBe(1);
    expect(mat.lanjutkan).toBe('mat6-kpk-fpb');
    expect(peta[1].lanjutkan).toBe('bi6-ide-pokok');
  });

  test('lanjutkan memilih topik yang prasyaratnya sudah dikuasai', () => {
    const peta = petaTopik(paket, { 'mat6-urutan-hitung': 'kuasai' });
    // mat6-bilangan-bulat masih segera, jadi topik berikutnya yang siap adalah faktor-kelipatan
    expect(peta[0].lanjutkan).toBe('mat6-faktor-kelipatan');
    const kpk = peta[0].topik.find((t) => t.id === 'mat6-kpk-fpb');
    expect(kpk?.prasyaratBelumKuasai).toEqual(['mat6-faktor-kelipatan']);
  });

  test('topik urut menurut urutan dan membawa tanda bersama Ayah/Bunda', () => {
    const mat = petaTopik(paket, {})[0];
    expect(mat.topik.map((t) => t.urutan)).toEqual(mat.topik.map((_, i) => i + 1));
    expect(mat.topik.find((t) => t.id === 'mat6-skala')?.bersamaOrtu).toBe(true);
  });

  test('fungsi murni: tidak mengubah paket', () => {
    const salinan = JSON.stringify(paket);
    petaTopik(paket, { 'mat6-urutan-hitung': 'kuasai' });
    expect(JSON.stringify(paket)).toBe(salinan);
  });
});

describe('ambilKartu', () => {
  test('menurut id topik atau id kartu', () => {
    const a = ambilKartu(paket, 'mat6-kpk-fpb');
    const b = ambilKartu(paket, 'kartu-mat6-kpk-fpb');
    expect(a?.kartu.id).toBe('kartu-mat6-kpk-fpb');
    expect(a?.mapel).toBe('mat');
    expect(b?.topik.id).toBe('mat6-kpk-fpb');
    expect(ambilKartu(paket, 'bi6-puisi')?.mapel).toBe('bi');
  });

  test('null untuk topik segera atau id tak dikenal', () => {
    expect(ambilKartu(paket, 'mat6-lingkaran')).toBeNull();
    expect(ambilKartu(paket, 'tidak-ada')).toBeNull();
  });
});
