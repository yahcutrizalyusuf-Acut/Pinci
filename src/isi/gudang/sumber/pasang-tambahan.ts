/**
 * Memasang tambahan kartu kelas 6 (benda, soal cerita, pancingan) ke paket. Kunci soal cerita dan jawaban
 * "Coba dengan benda" DIHITUNG dari ekspresi `hitung` (CLAUDE.md aturan 10), tidak ditulis tangan.
 */
import { hitungEkspresi, type Rasional } from '../hitung';
import type { MapelGudang, SoalKartu } from '../jenis';
import type { TambahanKartu } from './tambahan-k6';

function ribuan(n: bigint): string {
  const neg = n < 0n;
  const s = (neg ? -n : n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return neg ? `-${s}` : s;
}

/** Tulisan bilangan Indonesia: bulat bertitik ribuan, desimal berkoma, atau pecahan sederhana. */
export function tulisBilangan(r: Rasional, bentuk: 'pecahan' | 'desimal' = 'pecahan'): string {
  if (r.q === 1n) return ribuan(r.p);
  if (bentuk === 'desimal') {
    for (let k = 1; k <= 6; k++) {
      const pangkat = 10n ** BigInt(k);
      if (pangkat % r.q === 0n) {
        const n = (r.p * pangkat) / r.q;
        const bulat = n / pangkat;
        const sisa = (n < 0n ? -n : n) % pangkat;
        return `${ribuan(bulat)},${sisa.toString().padStart(k, '0').replace(/0+$/, '')}`;
      }
    }
  }
  return `${r.p}/${r.q}`;
}

export function pasangTambahan(mapel: MapelGudang, tambahan: Record<string, TambahanKartu>): MapelGudang {
  for (const id of Object.keys(tambahan)) if (!mapel.topik.some((t) => t.id === id && t.kartu)) throw new Error(`Tambahan untuk topik tanpa kartu: ${id}`);
  return {
    ...mapel,
    topik: mapel.topik.map((t) => {
      const tb = tambahan[t.id];
      if (!t.kartu || !tb) return t;
      const c = tb.cerita;
      const soalCerita: SoalKartu = {
        id: `${t.id}-s${t.kartu.soal.length + 1}`,
        ...(c.gambar ? { gambar: c.gambar } : {}),
        pertanyaan: c.pertanyaan,
        bentuk: 'isian',
        kunci: tulisBilangan(hitungEkspresi(c.hitung), c.bentuk),
        hitung: c.hitung,
        petunjuk: c.petunjuk,
        pembahasan: c.pembahasan,
        tingkat: 'sulit',
        cerita: true,
        ...(c.modelBatang ? { modelBatang: c.modelBatang } : {}),
        status: 'belum_diperiksa',
      };
      return {
        ...t,
        kartu: {
          ...t.kartu,
          soal: [...t.kartu.soal, soalCerita],
          ...(tb.cobaBenda ? { cobaBenda: { ...tb.cobaBenda, jawaban: tulisBilangan(hitungEkspresi(tb.cobaBenda.hitung)) } } : {}),
          pancingan: tb.pancingan,
        },
      };
    }),
  };
}
