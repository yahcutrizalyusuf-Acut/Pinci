import type { PaketInggris, UnitInggris } from '../jenis';
import { isiNama, type Komik, type PaketTokoh } from '../komik';
import { PAKET_INGGRIS } from '../paket';
import { NAMA_TOKOH, PAKET_KOMIK, PAKET_TOKOH, komikUnit, teksTokoh } from '../paketKomik';
import { pecahKata, periksaPaketKomik, periksaSatuKomik } from '../periksaKomik';

const semua = Object.values(PAKET_INGGRIS) as PaketInggris[];

const unitUji: UnitInggris = {
  id: 't3-u01',
  nomor: 1,
  judul: 'Hello!',
  tema: 'Salam',
  kosakata: ['hello', 'hi', 'fine', 'please', 'thank you', 'goodbye'].map((kata, i) => ({ id: `t3-u01-x${i}`, kata, arti: kata, emoji: '🙂', status: 'belum_diperiksa' as const })),
  pola: [],
  dengar: [],
  susun: [],
  permainan: [],
};
const paketUji: PaketInggris[] = [{ id: 'inggris-t3', versi: '1', tingkat: 3, fase: 'B', unit: [unitUji] }];
const tokohUji: PaketTokoh = {
  versi: '1',
  latarCerita: 'Gampong',
  tokoh: [
    { id: 'robi', nama: 'Robi', peran: 'robot', sifat: '', warna: '#999', suara: { bahasa: 'en-US', nada: 1, kecepatan: 1 } },
    { id: 'dafi', nama: 'Dafi', peran: 'anak', sifat: '', warna: '#00f', suara: { bahasa: 'en-US', nada: 1, kecepatan: 1 } },
  ],
};

function panel(n: number, teks: string, tokoh = 'robi') {
  return {
    id: `p${n}`,
    nomor: n,
    adegan: 'Sawah pagi',
    latar: 'sawah' as const,
    tokoh: [{ tokoh, pose: 'berdiri' as const, posisi: 'tengah' as const }],
    gambar_sementara: true,
    gelembung: [{ id: `p${n}-g1`, tokoh, teks, arti: 'arti', posisi: 'kiri_atas' as const, ekor: 'kiri' as const }],
    kataBantu: ['hello'],
    tipsBunyi: ['tips'],
  };
}

function komikDasar(): Komik {
  return {
    id: 'k1',
    unit: 't3-u01',
    tingkat: 3,
    nomor: 1,
    judul: 'Hello, {robi}!',
    pesanAkhlak: 'Ramah',
    pesanHariIni: { inggris: 'Be kind.', arti: 'Baik' },
    kataTarget: ['hello', 'hi', 'please', 'goodbye'],
    panel: [panel(1, 'Hello! I am {robi}.'), panel(2, 'Hi, {robi}!', 'dafi'), panel(3, 'Help, please.'), panel(4, 'Goodbye, {robi}!', 'dafi')],
    cekPaham: [
      { id: 'c1', jenis: 'urutkan', panel: ['p1', 'p3', 'p4'] },
      { id: 'c2', jenis: 'siapa', gelembung: 'p3-g1', pilihan: ['robi', 'dafi'], kunci: 'robi' },
      { id: 'c3', jenis: 'dengar_panel', gelembung: 'p4-g1', pilihan: ['p1', 'p4'], kunci: 'p4' },
    ],
    naskahOrangTua: { langkah: ['Tunjuk panel 1'], renungan: 'Apa yang kamu lakukan?', pancingan: 'Siapa tokohnya?' },
    perbuatanBaik: 'Sapa tetangga',
    status: 'belum_diperiksa',
  };
}

describe('pemeriksa naskah komik', () => {
  test('komik yang benar lulus', () => {
    expect(periksaSatuKomik(komikDasar(), unitUji, paketUji, tokohUji)).toEqual([]);
  });

  test('jumlah panel di luar batas tingkat', () => {
    const k = komikDasar();
    k.panel = k.panel.slice(0, 3);
    expect(periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n')).toMatch(/jumlah panel 3/);
  });

  test('kata per gelembung melebihi batas', () => {
    const k = komikDasar();
    k.panel[0].gelembung[0].teks = 'Hello hello hello hello hello hello hello!';
    expect(periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n')).toMatch(/7 kata \(maks 6\)/);
  });

  test('kata target tidak muncul atau bukan kosakata unit', () => {
    const k = komikDasar();
    k.kataTarget = ['hello', 'hi', 'please', 'fine'];
    expect(periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n')).toMatch(/"fine" tidak muncul/);
    k.kataTarget = ['hello', 'hi', 'please', 'banana'];
    expect(periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n')).toMatch(/"banana" bukan kosakata/);
  });

  test('lebih dari 2 kata di luar daftar', () => {
    const k = komikDasar();
    k.panel[0].gelembung[0].teks = 'Hello! Robot river mango.';
    expect(periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n')).toMatch(/4 kata di luar daftar \(maks 2\): robot, river, mango, help/);
  });

  test('panel tanpa kata bantu, komik tanpa pesan akhlak', () => {
    const k = komikDasar();
    k.panel[1].kataBantu = [];
    k.pesanAkhlak = '';
    const m = periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n');
    expect(m).toMatch(/panel 2 tanpa kata bantu/);
    expect(m).toMatch(/tanpa pesan akhlak/);
  });

  test('Cek Paham yang tidak cocok dengan isi komik', () => {
    const k = komikDasar();
    k.cekPaham[1] = { id: 'c2', jenis: 'siapa', gelembung: 'p3-g1', pilihan: ['robi', 'dafi'], kunci: 'dafi' };
    k.cekPaham[2] = { id: 'c3', jenis: 'dengar_panel', gelembung: 'p4-g1', pilihan: ['p1', 'p4'], kunci: 'p1' };
    k.cekPaham[0] = { id: 'c1', jenis: 'urutkan', panel: ['p3', 'p1', 'p4'] };
    const m = periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n');
    expect(m).toMatch(/c2: kunci "dafi" padahal yang bilang "robi"/);
    expect(m).toMatch(/c3: kunci panel p1/);
    expect(m).toMatch(/c1: urutan kunci/);
  });

  test('kata terlarang, nama kartun, dan nama tokoh yang ditulis langsung', () => {
    const k = komikDasar();
    k.panel[0].adegan = 'Robot membawa pedang seperti Doraemon';
    k.panel[1].gelembung[0].teks = 'Hi, Robi!';
    const m = periksaSatuKomik(k, unitUji, paketUji, tokohUji).join('\n');
    expect(m).toMatch(/kata terlarang "pedang"/);
    expect(m).toMatch(/nama tokoh kartun "doraemon"/);
    expect(m).toMatch(/nama "Robi" ditulis langsung/);
  });

  test('pecahKata membuang penanda nama dan tanda baca', () => {
    expect(pecahKata("Hi, {robi}! I'm fine.")).toEqual(['hi', "i'm", 'fine']);
  });
});

describe('paket komik dan tokoh', () => {
  test('nama tokoh hanya dari tokoh.json', () => {
    expect(NAMA_TOKOH.robi).toBe(PAKET_TOKOH.tokoh.find((t) => t.id === 'robi')?.nama);
    expect(teksTokoh('Hi, {robi}! I am {dafi}.')).toBe(`Hi, ${NAMA_TOKOH.robi}! I am ${NAMA_TOKOH.dafi}.`);
    // Mengganti nama di data mengganti nama di teks.
    expect(isiNama('Hi, {robi}!', { ...NAMA_TOKOH, robi: 'Robo' })).toBe('Hi, Robo!');
  });

  test('semua paket komik lulus periksa-komik', () => {
    for (const p of Object.values(PAKET_KOMIK)) {
      if (!p) continue;
      expect(periksaPaketKomik(p, semua, PAKET_TOKOH)).toEqual([]);
    }
  });

  test('komikUnit mencari komik per unit', () => {
    const k3 = PAKET_KOMIK[3]?.komik[0];
    if (k3) expect(komikUnit(k3.unit)?.id).toBe(k3.id);
    expect(komikUnit('t6-u12')).toBeUndefined();
  });
});
