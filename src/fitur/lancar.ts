/** Jembatan antara mesin Lancar (TypeScript murni) dan data aplikasi. */
import { buatId, sekarangIso } from '../data/alat';
import type { Anak, Sesi } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import {
  ambilLevel,
  buatLembar,
  hitungKemajuan,
  nilaiLembar,
  opsiLembarBerikut,
  type HasilLembar,
  type JawabanLancar,
  type KemajuanLancar,
  type LembarLancar,
  type ModeLembar,
  type SesiLancar,
} from '../mesin/lancar';
import { perbaruiInti } from './hari-ini';

const AWALAN = 'lancar:';

export async function riwayatLancar(repo: Repositori, anakId: string): Promise<SesiLancar[]> {
  return repo.nilaiAnak<SesiLancar>(anakId, AWALAN);
}

export async function kemajuanLancar(repo: Repositori, anak: Anak): Promise<KemajuanLancar> {
  return hitungKemajuan(await riwayatLancar(repo, anak.id), { kelas: anak.kelas });
}

export interface InfoLancar {
  kemajuan: KemajuanLancar;
  level: number;
  keterangan: string;
  perluPenempatan: boolean;
  perluJurus: boolean;
}

export async function infoLancarAnak(repo: Repositori, anak: Anak): Promise<InfoLancar> {
  const kemajuan = await kemajuanLancar(repo, anak);
  const def = ambilLevel(anak.kelas, kemajuan.level);
  const dilihat = await repo.nilai<boolean>(`jurus_dilihat:${anak.id}:${anak.kelas}-${kemajuan.level}`);
  return {
    kemajuan,
    level: kemajuan.level,
    keterangan: kemajuan.sudahPenempatan ? `Level ${kemajuan.level} · ${def.nama.toLowerCase()}` : 'Mulai dengan tes singkat',
    perluPenempatan: !kemajuan.sudahPenempatan,
    perluJurus: kemajuan.sudahPenempatan && !dilihat,
  };
}

export async function tandaiJurusDilihat(repo: Repositori, anak: Anak, level: number) {
  await repo.aturNilai(`jurus_dilihat:${anak.id}:${anak.kelas}-${level}`, true, anak.id);
}

export async function lembarBerikut(repo: Repositori, anak: Anak, sekarang = Date.now()): Promise<LembarLancar> {
  const kemajuan = await kemajuanLancar(repo, anak);
  const benih = `${anak.id}|${kemajuan.catatan.length}|${sekarang}`;
  return buatLembar(opsiLembarBerikut(kemajuan, benih, sekarang));
}

export interface HasilSimpan {
  sesi: Sesi;
  hasil: HasilLembar | null;
  benar: number;
  jumlah: number;
  detik: number;
  rekorBaru: boolean;
  rekorLama: number | null;
  naik: boolean;
  levelSesudah: number;
}

/** Rekor sendiri: detik tercepat lembar dengan salah ≤ 1 di kelas-level yang sama. */
async function rekor(repo: Repositori, anakId: string, kunci: string) {
  return repo.nilai<number>(`rekor:${anakId}:${kunci}`);
}

export async function simpanLembarLancar(
  repo: Repositori,
  anak: Anak,
  lembar: { kelas: number; level: number; benih: string; levelDayaTahan: number | null; jumlahSoal: number },
  jawaban: JawabanLancar[],
  mulai: number,
  mode: ModeLembar,
  jenis: 'latihan' | 'penempatan' = 'latihan',
): Promise<HasilSimpan> {
  const selesai = Date.now();
  const sebelum = await kemajuanLancar(repo, anak);
  const id = buatId();
  const sl: SesiLancar = {
    id,
    jenis,
    kelas: lembar.kelas,
    level: lembar.level,
    mode,
    mulai,
    selesai,
    jumlahSoal: lembar.jumlahSoal,
    levelDayaTahan: lembar.levelDayaTahan,
    jawaban,
  };
  const n = nilaiLembar(jawaban, lembar.jumlahSoal);
  const detik = Math.round(jawaban.reduce((a, j) => a + j.detik, 0));
  const kunciRekor = `${lembar.kelas}-${lembar.level}`;
  const lama = jenis === 'latihan' ? await rekor(repo, anak.id, kunciRekor) : null;
  const layakRekor = jenis === 'latihan' && mode === 'sendiri' && n.salah <= 1 && jawaban.length === lembar.jumlahSoal;
  const rekorBaru = layakRekor && (lama === null || detik < lama);
  if (rekorBaru) await repo.aturNilai(`rekor:${anak.id}:${kunciRekor}`, detik, anak.id);

  await repo.aturNilai(`${AWALAN}${id}`, sl, anak.id);
  const sesi = await repo.simpanSesi(
    {
      id,
      anak_id: anak.id,
      jenis: jenis === 'penempatan' ? 'penempatan' : 'lancar',
      mode,
      kelas: lembar.kelas,
      level: lembar.level,
      mulai: new Date(mulai).toISOString(),
      selesai: sekarangIso(),
      durasiDetik: Math.round((selesai - mulai) / 1000),
      benih: lembar.benih,
      hasil: n.hasil ?? undefined,
      benar: n.benar,
      jumlah: jawaban.length,
      tambahan: { rekorBaru, detikLembar: detik },
    },
    jawaban.map((j, i) => ({
      urutan: i + 1,
      soal: j.soal.teks,
      kunci: j.soal.kunci,
      jawaban: j.jawaban ?? '',
      benar: j.benar,
      detik: Math.round(j.detik * 10) / 10,
      hapusN: j.hapusN,
      ulang: j.soal.asal === 'ulang',
      topik: j.soal.keluarga,
    })),
  );
  const sesudah = await kemajuanLancar(repo, anak);
  await perbaruiInti(repo, anak);
  return {
    sesi,
    hasil: n.hasil,
    benar: n.benar,
    jumlah: jawaban.length,
    detik,
    rekorBaru,
    rekorLama: lama,
    naik: sesudah.level > sebelum.level,
    levelSesudah: sesudah.level,
  };
}
