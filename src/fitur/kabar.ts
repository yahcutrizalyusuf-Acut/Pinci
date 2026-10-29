/** Kalimat kabar harian per anak (O09). */
import { tanggalLokal } from '../data/alat';
import type { Anak, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';

export interface KabarAnak {
  anak: Anak;
  waktu: string; // "19.40" atau "Kemarin" atau ""
  baris: string;
  baru: number; // stiker anak yang belum dibaca
  terakhir: Sesi | null;
}

const NAMA_JENIS: Record<Sesi['jenis'], string> = {
  penempatan: 'tes penempatan',
  lancar: 'lembar',
  tka: 'latihan TKA',
  simulasi: 'simulasi TKA',
  mini_tryout: 'mini try out',
  baca: 'Baca Ulang',
  inggris: 'unit Bahasa Inggris',
  kartu: 'kartu ilmu',
  game: 'babak game',
};

export function jam(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
}

export function waktuRelatif(iso: string, sekarang = new Date()) {
  const d = new Date(iso);
  if (tanggalLokal(d) === tanggalLokal(sekarang)) return jam(iso);
  const kemarin = new Date(sekarang);
  kemarin.setDate(kemarin.getDate() - 1);
  if (tanggalLokal(d) === tanggalLokal(kemarin)) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export async function kabarAnak(repo: Repositori, anak: Anak, sekarang = new Date()): Promise<KabarAnak> {
  const sesi = (await repo.daftarSesi(anak.id)).filter((s) => s.jenis !== 'game');
  const hari = tanggalLokal(sekarang);
  const hariIni = sesi.filter((s) => tanggalLokal(new Date(s.mulai)) === hari);
  const terakhir = sesi[sesi.length - 1] ?? null;
  const pesan = await repo.daftarPesan(anak.id);
  const baru = pesan.filter((p) => p.dari === 'anak' && !p.dibaca).length;
  let baris: string;
  if (hariIni.length === 0) baris = 'Belum latihan hari ini';
  else {
    const hitung = new Map<string, number>();
    for (const s of hariIni) hitung.set(NAMA_JENIS[s.jenis], (hitung.get(NAMA_JENIS[s.jenis]) ?? 0) + 1);
    baris = [...hitung.entries()].map(([n, j]) => `${j} ${n}`).join(' · ') + ' hari ini';
    const rekor = hariIni.find((s) => s.tambahan?.rekorBaru);
    if (rekor) baris += ' · rekor baru';
  }
  return { anak, waktu: terakhir ? waktuRelatif(terakhir.selesai, sekarang) : '', baris, baru, terakhir };
}
