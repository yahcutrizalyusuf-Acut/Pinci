import { PAKET_INGGRIS } from '../../../isi/inggris/paket';
import { SEMUA_KELAS } from '../../bersama/jenis';
import { JUMLAH_LEVEL, type Level } from '../../bersama/level';
import { buatBabak, langkah, PASANGAN_PER_LEVEL, ringkasan, terlihat, type KeadaanPasangan } from '../logika';

function mainSempurna(k: KeadaanPasangan): KeadaanPasangan {
  const kelompok = new Map<string, number[]>();
  k.kartu.forEach((c) => kelompok.set(c.pasangan, [...(kelompok.get(c.pasangan) ?? []), c.id]));
  for (const [a, b] of kelompok.values()) {
    k = langkah(k, { jenis: 'buka', id: a });
    k = langkah(k, { jenis: 'buka', id: b });
  }
  return k;
}

test('semua kelas dan level bisa diselesaikan; jumlah pasangan naik per level', () => {
  for (const kelas of SEMUA_KELAS) {
    for (let level = 1 as Level; level <= JUMLAH_LEVEL; level = (level + 1) as Level) {
      const k0 = buatBabak({ kelas, level, benih: 11, paketInggris: PAKET_INGGRIS });
      expect(k0.kartu).toHaveLength(PASANGAN_PER_LEVEL[level] * 2);
      expect(k0.tema).toBe(level % 2 === 0 ? 'inggris' : 'hitung');
      // setiap kunci pasangan muncul tepat dua kali
      const hitung = new Map<string, number>();
      k0.kartu.forEach((c) => hitung.set(c.pasangan, (hitung.get(c.pasangan) ?? 0) + 1));
      expect([...hitung.values()].every((n) => n === 2)).toBe(true);
      const k = mainSempurna(k0);
      expect(k.fase).toBe('selesai');
      expect(ringkasan(k).halDikerjakan[0]).toBe(`Menemukan ${PASANGAN_PER_LEVEL[level]} pasangan`);
    }
  }
});

test('kartu hitung: hasil sama dengan soal yang dihitung', () => {
  const k = buatBabak({ kelas: 4, level: 3, benih: 2 });
  for (const c of k.kartu.filter((x) => x.jenis === 'soal')) {
    const hasil = k.kartu.find((x) => x.jenis === 'hasil' && x.pasangan === c.pasangan)!;
    const [a, op, b] = c.isi.split(' ');
    const n = op === '+' ? +a + +b : op === '−' ? +a - +b : op === '×' ? +a * +b : op === ':' ? +a / +b : NaN;
    if (!Number.isNaN(n)) expect(String(n)).toBe(hasil.isi);
  }
});

test('belum cocok menutup lagi; petunjuk menyorot kartu yang pasangannya pernah dibuka', () => {
  let k = buatBabak({ kelas: 3, level: 2, benih: 4, paketInggris: PAKET_INGGRIS });
  const [x0, x1, x2] = [0, 1, 2].map((i) => k.kartu[i]);
  // cari dua kartu yang bukan pasangan
  const bukan = (a: number) => k.kartu.find((c) => c.id !== a && c.pasangan !== k.kartu[a].pasangan)!.id;
  k = langkah(k, { jenis: 'buka', id: x0.id });
  const b1 = bukan(x0.id);
  k = langkah(k, { jenis: 'buka', id: b1 });
  expect(k.fase).toBe('tunggu_tutup');
  expect(langkah(k, { jenis: 'buka', id: x2.id })).toBe(k); // tidak bisa membuka saat menunggu
  k = langkah(k, { jenis: 'tutup' });
  expect(terlihat(k, x0.id)).toBe(false);
  expect(k.petunjuk).toBeNull();
  // buka pasangan dari x0 bersama kartu lain → sekarang pasangan x0 pernah terlihat
  const pasanganX0 = k.kartu.find((c) => c.id !== x0.id && c.pasangan === x0.pasangan)!.id;
  const lain = k.kartu.find((c) => ![x0.id, pasanganX0].includes(c.id) && c.pasangan !== x0.pasangan && c.pasangan !== k.kartu[pasanganX0].pasangan)!.id;
  k = langkah(k, { jenis: 'buka', id: pasanganX0 });
  k = langkah(k, { jenis: 'buka', id: lain === pasanganX0 ? x1.id : lain });
  expect(k.salahBeruntun).toBe(2);
  expect(k.sorot).not.toBeNull();
  expect(k.petunjuk).toMatch(/bersinar/);
});
