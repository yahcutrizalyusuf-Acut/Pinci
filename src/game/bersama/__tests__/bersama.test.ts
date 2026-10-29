import { buatAcak } from '../acak';
import { formatRupiah } from '../jenis';
import { DAFTAR_KEJUTAN, pilihKejutan } from '../kejutan';
import { buatRingkasan } from '../ringkasan';
import {
  batasBawaanMenit,
  batasMenitDipakai,
  bolehMulaiBabakBaru,
  harusBerhentiSetelahBabak,
  langitSenja,
  posisiMatahari,
  sisaDetikWaktuMain,
  suasanaLangit,
} from '../waktu';

describe('acak berbenih', () => {
  it('benih sama → deret sama, benih beda → deret beda', () => {
    const a = buatAcak(42);
    const b = buatAcak(42);
    const c = buatAcak(43);
    const da = Array.from({ length: 10 }, () => a.berikut());
    const db = Array.from({ length: 10 }, () => b.berikut());
    const dc = Array.from({ length: 10 }, () => c.berikut());
    expect(da).toEqual(db);
    expect(da).not.toEqual(dc);
    da.forEach((x) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    });
  });

  it('bisa dilanjutkan dari keadaan yang disimpan', () => {
    const a = buatAcak(7);
    a.berikut();
    const lanjut = buatAcak(a.keadaan);
    expect(lanjut.berikut()).toBe(a.berikut());
  });

  it('bulat() dalam rentang dan semua nilai muncul', () => {
    const a = buatAcak(1);
    const lihat = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const n = a.bulat(1, 6);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(6);
      lihat.add(n);
    }
    expect(lihat.size).toBe(6);
  });

  it('acakUrutan tidak menghilangkan unsur', () => {
    const a = buatAcak(9);
    expect(a.acakUrutan([1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(a.ambilBeberapa([1, 2, 3, 4, 5], 3)).size).toBe(3);
  });
});

describe('kejutan lucu', () => {
  it('peluang kecil, ketiga jenis muncul, tidak sama berturut-turut', () => {
    const a = buatAcak(5);
    let sebelumnya: ReturnType<typeof pilihKejutan> = null;
    let muncul = 0;
    const jenis = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      const k = pilihKejutan(a, sebelumnya);
      if (k !== null) {
        muncul++;
        jenis.add(k);
        expect(k).not.toBe(sebelumnya);
      }
      sebelumnya = k ?? sebelumnya;
    }
    expect(muncul / 5000).toBeGreaterThan(0.03);
    expect(muncul / 5000).toBeLessThan(0.1);
    expect(jenis.size).toBe(DAFTAR_KEJUTAN.length);
  });

  it('berbenih: benih sama → kejutan sama', () => {
    const urut = (b: number) => {
      const a = buatAcak(b);
      return Array.from({ length: 300 }, () => pilihKejutan(a));
    };
    expect(urut(11)).toEqual(urut(11));
  });
});

describe('waktu main', () => {
  it('batas bawaan dan batas atas mutlak', () => {
    expect(batasBawaanMenit(1)).toBe(20);
    expect(batasBawaanMenit(2)).toBe(20);
    expect(batasBawaanMenit(3)).toBe(30);
    expect(batasBawaanMenit(6)).toBe(30);
    expect(batasMenitDipakai(4)).toBe(30);
    expect(batasMenitDipakai(4, 90)).toBe(60);
    expect(batasMenitDipakai(4, -5)).toBe(0);
    expect(batasMenitDipakai(1, 45)).toBe(45);
    expect(sisaDetikWaktuMain(20, 1300)).toBe(0);
    expect(sisaDetikWaktuMain(20, 600)).toBe(600);
  });

  it('matahari bergerak dari 0 ke 100 persen', () => {
    expect(posisiMatahari(1800, 1800)).toBe(0);
    expect(posisiMatahari(900, 1800)).toBe(50);
    expect(posisiMatahari(0, 1800)).toBe(100);
    expect(posisiMatahari(-30, 1800)).toBe(100);
    expect(posisiMatahari(5000, 1800)).toBe(0);
    let lalu = -1;
    for (let sisa = 1800; sisa >= 0; sisa -= 60) {
      const p = posisiMatahari(sisa, 1800);
      expect(p).toBeGreaterThan(lalu);
      lalu = p;
    }
  });

  it('langit senja hanya di 2 menit terakhir, malam saat habis', () => {
    expect(langitSenja(121)).toBe(false);
    expect(langitSenja(120)).toBe(true);
    expect(langitSenja(1)).toBe(true);
    expect(langitSenja(0)).toBe(false);
    expect(suasanaLangit(600)).toBe('siang');
    expect(suasanaLangit(90)).toBe('senja');
    expect(suasanaLangit(0)).toBe('malam');
  });

  it('babak yang berjalan diselesaikan dulu; babak baru hanya bila sisa ≥ 60 detik', () => {
    expect(bolehMulaiBabakBaru(300)).toBe(true);
    expect(bolehMulaiBabakBaru(60)).toBe(true);
    expect(bolehMulaiBabakBaru(59)).toBe(false);
    expect(bolehMulaiBabakBaru(0)).toBe(false);
    expect(harusBerhentiSetelahBabak(0)).toBe(true);
    expect(harusBerhentiSetelahBabak(30)).toBe(true);
    expect(harusBerhentiSetelahBabak(200)).toBe(false);
  });
});

describe('ringkasan dan format', () => {
  it('ringkasan tanpa skor, dengan pilihan Main lagi dan Ganti game', () => {
    const r = buatRingkasan('pasar', 3, 'seru', ['Melayani 6 pembeli']);
    expect(r.judul).toBe('Hore, selesai!');
    expect(r.pilihan).toEqual(['main_lagi', 'ganti_game']);
    expect(Object.keys(r)).not.toContain('skor');
  });

  it('format rupiah gaya layar', () => {
    expect(formatRupiah(3000)).toBe('Rp3.000');
    expect(formatRupiah(500)).toBe('Rp500');
    expect(formatRupiah(125000)).toBe('Rp125.000');
  });
});
