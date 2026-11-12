/**
 * Hitung Kilat di atas lapisan data: riwayat lembar dan penyimpanan (sesi jenis `kilat` + jawaban per soal).
 * Lembar Mode Dampingi tidak dihitung untuk naik tahap.
 */
import { buatId, kiniMs, sekarangIso } from '../data/alat';
import type { Anak, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import type { JawabanLancar } from '../mesin/lancar';
import { cocokJawaban } from '../mesin/lancar';
import { lembarLulus, rekorTahap, tahapSekarang, type HasilLembarKilat } from '../mesin/kilat';

/** Warna kartu Hitung Kilat (oranye hangat, beda dari Lancar biru). */
export const WARNA_KILAT = { utama: '#F2994A', muda: '#FEF0E3', teks: '#A3540C' };

export function hasilDariSesi(s: Sesi): HasilLembarKilat {
  return { tahap: s.level ?? 1, benar: s.benar, jumlah: s.jumlah, detik: s.durasiDetik, mulai: s.mulai };
}

/** Riwayat lembar Hitung Kilat anak (mode sendiri), urut waktu. */
export async function riwayatKilat(repo: Repositori, anakId: string): Promise<HasilLembarKilat[]> {
  return (await repo.daftarSesi(anakId))
    .filter((s) => s.jenis === 'kilat' && s.mode === 'sendiri')
    .map(hasilDariSesi)
    .sort((a, b) => a.mulai.localeCompare(b.mulai));
}

export interface RingkasKilat {
  hasil: HasilLembarKilat;
  lulus: boolean;
  rekorBaru: boolean;
  naikKe: number | null;
  belumTepat: JawabanLancar[];
}

/** Simpan satu lembar. Benar/salah dihitung ulang dengan `cocokJawaban`. */
export async function simpanLembarKilat(
  repo: Repositori,
  anak: Anak,
  opsi: { tahap: number; benih: string; mulai: number; mode: 'sendiri' | 'dampingi' },
  jawaban: JawabanLancar[],
): Promise<RingkasKilat> {
  const sebelum = await riwayatKilat(repo, anak.id);
  const tahapLama = tahapSekarang(sebelum, anak.kelas);
  const rekorLama = rekorTahap(sebelum, opsi.tahap);
  const dinilai = jawaban.map((j) => ({ ...j, benar: j.jawaban !== null && cocokJawaban(j.soal, j.jawaban) }));
  const benar = dinilai.filter((j) => j.benar).length;
  const detik = Math.round(dinilai.reduce((a, j) => a + j.detik, 0));
  const mulaiIso = new Date(opsi.mulai).toISOString();
  await repo.simpanSesi(
    {
      id: buatId(),
      anak_id: anak.id,
      jenis: 'kilat',
      mode: opsi.mode,
      kelas: anak.kelas,
      level: opsi.tahap,
      rujukan: `kilat-t${opsi.tahap}`,
      benih: opsi.benih,
      mulai: mulaiIso,
      selesai: sekarangIso(),
      durasiDetik: detik,
      benar,
      jumlah: dinilai.length,
      tambahan: { tahap: opsi.tahap, detikPerSoal: dinilai.length ? Math.round((detik / dinilai.length) * 10) / 10 : 0, waktuLayarDetik: Math.round((kiniMs() - opsi.mulai) / 1000) },
    },
    dinilai.map((j, k) => ({ urutan: k + 1, soal: j.soal.teks, butirId: j.soal.id, kunci: j.soal.kunci, jawaban: j.jawaban ?? '', benar: j.benar, detik: Math.round(j.detik * 10) / 10, hapusN: j.hapusN, topik: j.soal.keluarga })),
  );
  const hasil: HasilLembarKilat = { tahap: opsi.tahap, benar, jumlah: dinilai.length, detik, mulai: mulaiIso };
  const sesudah = opsi.mode === 'sendiri' ? [...sebelum, hasil] : sebelum;
  const tahapBaru = tahapSekarang(sesudah, anak.kelas);
  const rekorBaru = opsi.mode === 'sendiri' && rekorLama !== null && rekorTahap(sesudah, opsi.tahap) === detik && detik < rekorLama;
  return { hasil, lulus: lembarLulus(hasil, anak.kelas), rekorBaru, naikKe: tahapBaru > tahapLama ? tahapBaru : null, belumTepat: dinilai.filter((j) => !j.benar) };
}
