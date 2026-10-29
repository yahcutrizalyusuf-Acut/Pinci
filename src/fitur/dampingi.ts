/** Pilihan jawaban dan kalimat untuk orang tua di Lembar didampingi (B07). */
import { buatAcak, type SoalLancar } from '../mesin/lancar';
import { ambilJurusAman } from './jurus';

/** 4 pilihan untuk soal berjawaban bilangan: kunci + pengecoh dekat (±1, ±2, ±10), tanpa bilangan negatif. */
export function pilihanSoal(s: SoalLancar, benih: string): string[] {
  const k = Number(s.kunci);
  if (s.bentukJawaban !== 'bilangan' || !Number.isFinite(k)) return [s.kunci];
  const r = buatAcak(benih);
  const calon = [k + 1, k - 1, k + 2, k - 2, k + 10, k - 10].filter((x) => x >= 0 && x !== k);
  const pilih = new Set<number>([k]);
  while (pilih.size < 4 && calon.length) pilih.add(calon.splice(r.bulat(0, calon.length - 1), 1)[0]);
  return [...pilih].sort((a, b) => a - b).map(String);
}

export function kalimatOrtu(s: SoalLancar): string {
  const { jurus, nama } = ambilJurusAman(s.kelas, s.level);
  return jurus ? `"Kita pakai jurus Pinci, ya: ${jurus.inti.replace(/\.$/, '')}. Coba, ${s.teks} berapa?"` : `"Ini latihan ${nama.toLowerCase()}. Coba, ${s.teks} berapa?"`;
}
