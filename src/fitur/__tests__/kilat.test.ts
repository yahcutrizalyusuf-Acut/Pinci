import { GudangMemori } from '../../data/gudang';
import { Repositori } from '../../data/repositori';
import { buatLembarKilat } from '../../mesin/kilat';
import { raporKilat } from '../rapor';
import { riwayatKilat, simpanLembarKilat } from '../kilat';

async function siap() {
  const r = new Repositori(new GudangMemori(), null);
  await r.siapkan();
  await r.buatKeluarga('1234', 'Bunda');
  const a = await r.tambahAnak({ nama: 'Yusuf', kelas: 4, hewan: 'kucing' });
  return { r, a };
}

describe('Hitung Kilat tersimpan dan tercatat', () => {
  it('menyimpan sesi kilat + jawaban per soal, benar dihitung ulang, naik tahap setelah 2 lembar lulus', async () => {
    const { r, a } = await siap();
    const kerjakan = async (tahap: number, salah: number, detik: number) => {
      const soal = buatLembarKilat(tahap, a.kelas, `b${Math.random()}`);
      const jawaban = soal.map((s, i) => ({ soal: s, jawaban: i < salah ? '99' : s.kunci, benar: true, detik, hapusN: 0 }));
      return simpanLembarKilat(r, a, { tahap, benih: 'x', mulai: Date.now() - 60000, mode: 'sendiri' }, jawaban);
    };
    const satu = await kerjakan(1, 2, 2.5);
    expect(satu.hasil).toMatchObject({ tahap: 1, benar: 48, jumlah: 50, detik: 125 });
    expect(satu.belumTepat).toHaveLength(2);
    expect(satu.naikKe).toBeNull();
    const dua = await kerjakan(1, 0, 2);
    expect(dua.naikKe).toBe(2);
    const sesi = (await r.daftarSesi(a.id)).filter((s) => s.jenis === 'kilat');
    expect(sesi).toHaveLength(2);
    expect(sesi[0].rujukan).toBe('kilat-t1');
    const jaw = await r.jawabanAnak(a.id);
    expect(jaw.filter((j) => j.sesi_id === sesi[0].id)).toHaveLength(50);
    expect(await riwayatKilat(r, a.id)).toHaveLength(2);
    // sinkron: sesi kilat ikut antrean kirim
    expect((await r.antreanBelumTerkirim()).some((x) => x.tabel === 'sesi')).toBe(true);
  });

  it('rapor: kalimat kemajuan dan grafik detik per soal', () => {
    const senin = new Date(2026, 10, 9);
    const s = (hari: number, detik: number, benar: number) => ({ id: String(hari), anak_id: 'a', jenis: 'kilat', mode: 'sendiri', kelas: 4, level: 1, mulai: new Date(2026, 10, hari, 10).toISOString(), selesai: '', durasiDetik: detik, benar, jumlah: 50 }) as never;
    const r = raporKilat('Yusuf', [s(3, 175, 47), s(10, 150, 48), s(11, 125, 50)], senin);
    expect(r.lembarMingguIni).toBe(2);
    expect(r.detikIni).toBe(2.8);
    expect(r.detikLalu).toBe(3.5);
    expect(r.persenBenar).toBe(98);
    expect(r.grafik).toEqual([3.5, 3, 2.5]);
    expect(r.kalimat).toBe('Yusuf mengerjakan 2 lembar Hitung Kilat, rata-rata 2,8 detik per soal, 98% tepat. Lebih cepat dari minggu lalu (3,5 detik).');
    expect(raporKilat('Yusuf', [], senin).kalimat).toBeNull();
  });
});
