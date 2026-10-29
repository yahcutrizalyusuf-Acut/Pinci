/**
 * Repositori: satu-satunya pintu aplikasi ke data. Layar tidak pernah menyentuh
 * SQLite atau Supabase langsung (CLAUDE.md: lapisan data).
 *
 * Aturan dari 04-tahan-putus-sinyal.md:
 * - Simpan dulu di HP, kirim kemudian. Lembar selesai = tersimpan di HP.
 * - Setiap baris yang perlu dikirim masuk antrean; pengirim mencoba lagi dengan jeda 1-2-5-15 menit.
 * - Sesi dan jawaban hanya ditambah, tidak pernah diubah.
 */
import { buatId, sekarangIso, sha256, tanggalLokal } from './alat';
import type { Gudang } from './gudang';
import {
  TABEL_SINKRON,
  type Anak,
  type ItemAntrean,
  type Jawaban,
  type Keluarga,
  type KemajuanTopik,
  type NamaTabel,
  type Pemakaian,
  type PengaturanWaktu,
  type Pesan,
  type PetaTabel,
  type Sesi,
} from './jenis';

/** Pengirim ke server. Mode lokal tidak punya pengirim. */
export interface PengirimSinkron {
  /** kirim sekumpulan baris; kembalikan id antrean yang diterima server */
  kirim(item: { antrean: ItemAntrean; baris: object }[]): Promise<string[]>;
}

export type StatusSimpan = 'tersimpan' | 'terkirim';

const JEDA_MENIT = [1, 2, 5, 15];

export function batasBelajarBawaan(kelas: number) {
  return Math.min(10 * kelas, 60);
}

export function gameBawaan(kelas: number) {
  return kelas <= 2 ? 20 : 30;
}

export class Repositori {
  private urutan = 0;
  private pendengar = new Set<() => void>();

  constructor(
    private gudang: Gudang,
    private pengirim: PengirimSinkron | null = null,
  ) {}

  async siapkan() {
    await this.gudang.siapkan();
    const u = await this.nilai<number>('urutan_hp');
    this.urutan = u ?? 0;
  }

  /** Beri tahu layar bahwa data berubah. */
  dengar(f: () => void) {
    this.pendengar.add(f);
    return () => {
      this.pendengar.delete(f);
    };
  }

  private ubah() {
    for (const f of this.pendengar) f();
  }

  // ---------- nilai bebas (kunci → JSON) ----------

  async nilai<T>(kunci: string): Promise<T | null> {
    const b = await this.gudang.ambil('nilai', kunci);
    return b ? (JSON.parse(b.isi) as T) : null;
  }

  async aturNilai<T>(kunci: string, isi: T, anakId?: string) {
    await this.gudang.pasang('nilai', { id: kunci, anak_id: anakId, isi: JSON.stringify(isi) });
    this.ubah();
  }

  /** Semua nilai milik satu anak yang kuncinya diawali `awalan`. */
  async nilaiAnak<T>(anakId: string, awalan: string): Promise<T[]> {
    const semua = await this.gudang.cari('nilai', { anak_id: anakId });
    return semua.filter((n) => n.id.startsWith(awalan)).map((n) => JSON.parse(n.isi) as T);
  }

  // ---------- antrean ----------

  private async antrekan<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]) {
    if (!TABEL_SINKRON.includes(tabel)) return;
    const item: ItemAntrean = { id: buatId(), tabel, barisId: baris.id, dibuat: sekarangIso(), coba: 0 };
    await this.gudang.pasang('antrean', { ...item, ...{ tabel } });
  }

  private async simpan<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]) {
    await this.gudang.pasang(tabel, baris);
    await this.antrekan(tabel, baris);
  }

  async antreanBelumTerkirim(): Promise<ItemAntrean[]> {
    const semua = await this.gudang.cari('antrean');
    return semua.filter((a) => !a.terkirim).sort((a, b) => a.dibuat.localeCompare(b.dibuat));
  }

  /** Status satu baris: tersimpan ✓ atau terkirim ✓✓. */
  async statusBaris(barisId: string): Promise<StatusSimpan> {
    const semua = await this.gudang.cari('antrean');
    const milik = semua.filter((a) => a.barisId === barisId);
    return milik.length > 0 && milik.every((a) => a.terkirim) ? 'terkirim' : 'tersimpan';
  }

  /**
   * Kirim isi antrean (paling banyak `batas` sekali kirim). Aman dipanggil kapan saja:
   * gagal = tetap di antrean dengan jeda makin lama.
   */
  async sinkron(batas = 200, sekarang = new Date()): Promise<{ terkirim: number; sisa: number }> {
    const antre = (await this.antreanBelumTerkirim()).filter(
      (a) => !a.berikutnya || new Date(a.berikutnya).getTime() <= sekarang.getTime(),
    );
    if (!this.pengirim || antre.length === 0) {
      return { terkirim: 0, sisa: (await this.antreanBelumTerkirim()).length };
    }
    const kumpulan = antre.slice(0, batas);
    const isi: { antrean: ItemAntrean; baris: object }[] = [];
    for (const a of kumpulan) {
      const baris = await this.gudang.ambil(a.tabel, a.barisId);
      if (baris) isi.push({ antrean: a, baris });
    }
    let diterima: string[] = [];
    try {
      diterima = await this.pengirim.kirim(isi);
    } catch {
      diterima = [];
    }
    const terima = new Set(diterima);
    const waktu = sekarangIso();
    for (const a of kumpulan) {
      if (terima.has(a.id)) {
        await this.gudang.pasang('antrean', { ...a, terkirim: waktu });
      } else {
        const jeda = JEDA_MENIT[Math.min(a.coba, JEDA_MENIT.length - 1)];
        await this.gudang.pasang('antrean', {
          ...a,
          coba: a.coba + 1,
          berikutnya: new Date(sekarang.getTime() + jeda * 60_000).toISOString(),
        });
      }
    }
    this.ubah();
    return { terkirim: terima.size, sisa: (await this.antreanBelumTerkirim()).length };
  }

  // ---------- keluarga dan PIN ----------

  async keluarga(): Promise<Keluarga | null> {
    const k = await this.gudang.cari('keluarga');
    return k[0] ?? null;
  }

  async buatKeluarga(pin: string, sapaanOrtu = 'Ayah'): Promise<Keluarga> {
    const garam = buatId();
    const kel: Keluarga = {
      id: buatId(),
      dibuat: sekarangIso(),
      pinHash: sha256(`${garam}:${pin}`),
      garam,
      sapaanOrtu,
      modeData: 'lokal',
    };
    await this.gudang.pasang('keluarga', kel);
    this.ubah();
    return kel;
  }

  async periksaPin(pin: string): Promise<boolean> {
    const kel = await this.keluarga();
    if (!kel) return false;
    return sha256(`${kel.garam}:${pin}`) === kel.pinHash;
  }

  async gantiPin(pinBaru: string) {
    const kel = await this.keluarga();
    if (!kel) return;
    const garam = buatId();
    await this.gudang.pasang('keluarga', { ...kel, garam, pinHash: sha256(`${garam}:${pinBaru}`) });
    this.ubah();
  }

  async aturSapaan(sapaan: string) {
    const kel = await this.keluarga();
    if (!kel) return;
    await this.gudang.pasang('keluarga', { ...kel, sapaanOrtu: sapaan });
    this.ubah();
  }

  // ---------- anak ----------

  async daftarAnak(): Promise<Anak[]> {
    const a = await this.gudang.cari('anak');
    return a.sort((x, y) => x.dibuat.localeCompare(y.dibuat));
  }

  async anak(id: string) {
    return this.gudang.ambil('anak', id);
  }

  async tambahAnak(data: Pick<Anak, 'nama' | 'kelas' | 'hewan'>): Promise<Anak> {
    const kel = await this.keluarga();
    if (!kel) throw new Error('Keluarga belum dibuat');
    const anak: Anak = {
      id: buatId(),
      keluarga_id: kel.id,
      nama: data.nama.trim(),
      kelas: data.kelas,
      hewan: data.hewan,
      dibuat: sekarangIso(),
    };
    await this.simpan('anak', anak);
    await this.simpan('pengaturan_waktu', this.pengaturanBawaan(anak));
    this.ubah();
    return anak;
  }

  async ubahAnak(anak: Anak) {
    await this.simpan('anak', anak);
    this.ubah();
  }

  async hapusAnak(id: string) {
    await this.gudang.hapus('anak', id);
    this.ubah();
  }

  // ---------- pengaturan waktu ----------

  pengaturanBawaan(anak: Anak): PengaturanWaktu {
    return {
      id: anak.id,
      anak_id: anak.id,
      belajarMenit: batasBelajarBawaan(anak.kelas),
      gameMenit: gameBawaan(anak.kelas),
      gameSetelahInti: true,
      jamTenang: '21:00',
      jamBangun: '06:00',
      bunyi: true,
    };
  }

  async pengaturan(anakId: string): Promise<PengaturanWaktu> {
    const p = await this.gudang.ambil('pengaturan_waktu', anakId);
    const anak = await this.anak(anakId);
    if (!anak) throw new Error('Anak tidak ditemukan');
    if (!p) return this.pengaturanBawaan(anak);
    // Batas 10 menit × kelas tetap berlaku walau kelas anak diubah setelah pengaturan disimpan.
    return { ...p, belajarMenit: Math.min(p.belajarMenit, batasBelajarBawaan(anak.kelas)) };
  }

  async aturPengaturan(p: PengaturanWaktu) {
    const anak = await this.anak(p.anak_id);
    const batas = anak ? batasBelajarBawaan(anak.kelas) : 60;
    const aman: PengaturanWaktu = {
      ...p,
      belajarMenit: Math.max(5, Math.min(batas, Math.round(p.belajarMenit))),
      gameMenit: Math.max(0, Math.min(60, Math.round(p.gameMenit))),
    };
    await this.simpan('pengaturan_waktu', aman);
    this.ubah();
  }

  // ---------- pemakaian waktu ----------

  async pemakaian(anakId: string, tanggal = tanggalLokal()): Promise<Pemakaian> {
    const id = `${anakId}:${tanggal}`;
    const p = await this.gudang.ambil('pemakaian', id);
    return p ?? { id, anak_id: anakId, tanggal, belajarDetik: 0, mainDetik: 0, blokDetik: 0, intiSelesai: false };
  }

  async simpanPemakaian(p: Pemakaian) {
    await this.simpan('pemakaian', p);
    this.ubah();
  }

  async riwayatPemakaian(anakId: string): Promise<Pemakaian[]> {
    const semua = await this.gudang.cari('pemakaian', { anak_id: anakId });
    return semua.sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  }

  // ---------- sesi dan jawaban ----------

  /** Simpan sesi utuh beserta semua jawabannya. Mengembalikan sesi tersimpan. */
  async simpanSesi(
    sesi: Omit<Sesi, 'id' | 'urutanHp'> & { id?: string },
    jawaban: Omit<Jawaban, 'id' | 'sesi_id' | 'anak_id'>[],
  ): Promise<Sesi> {
    this.urutan += 1;
    const s: Sesi = { ...sesi, id: sesi.id ?? buatId(), urutanHp: this.urutan };
    const daftar: Jawaban[] = jawaban.map((j) => ({ ...j, id: buatId(), sesi_id: s.id, anak_id: s.anak_id }));
    await this.gudang.pasang('nilai', { id: 'urutan_hp', isi: JSON.stringify(this.urutan) });
    await this.gudang.pasangBanyak('jawaban', daftar);
    await this.gudang.pasang('sesi', s);
    for (const j of daftar) await this.antrekan('jawaban', j);
    await this.antrekan('sesi', s);
    this.ubah();
    return s;
  }

  async daftarSesi(anakId: string, jenis?: Sesi['jenis']): Promise<Sesi[]> {
    const semua = await this.gudang.cari('sesi', jenis ? { anak_id: anakId, jenis } : { anak_id: anakId });
    return semua.sort((a, b) => a.mulai.localeCompare(b.mulai) || a.urutanHp - b.urutanHp);
  }

  async jawabanSesi(sesiId: string): Promise<Jawaban[]> {
    const j = await this.gudang.cari('jawaban', { sesi_id: sesiId });
    return j.sort((a, b) => a.urutan - b.urutan);
  }

  async jawabanAnak(anakId: string): Promise<Jawaban[]> {
    return this.gudang.cari('jawaban', { anak_id: anakId });
  }

  async aturPerasaan(sesiId: string, perasaan: string) {
    // Perasaan dicatat sebagai nilai terpisah, karena sesi tidak pernah diubah.
    await this.aturNilai(`perasaan:${sesiId}`, perasaan);
  }

  // ---------- kemajuan topik (TKA, kartu ilmu, Inggris) ----------

  async kemajuanTopik(anakId: string, mapel?: string): Promise<KemajuanTopik[]> {
    const semua = await this.gudang.cari('kemajuan_topik', { anak_id: anakId });
    return mapel ? semua.filter((k) => k.mapel === mapel) : semua;
  }

  /**
   * Catat hasil latihan satu topik dan perbarui status + tanda bimbingan
   * (10-gudang-ilmu-bimbingan-dan-waktu.md bagian 3).
   */
  async catatTopik(anakId: string, mapel: string, topik: string, benar: number, salah: number, petunjuk = 0) {
    const id = `${anakId}:${mapel}:${topik}`;
    const lama = await this.gudang.ambil('kemajuan_topik', id);
    const b = (lama?.benar ?? 0) + benar;
    const s = (lama?.salah ?? 0) + salah;
    const p = (lama?.petunjuk ?? 0) + petunjuk;
    const total = b + s;
    const rasio = total > 0 ? b / total : 0;
    const status = total >= 8 && rasio >= 0.8 ? 'kuasai' : total > 0 ? 'belajar' : 'belum';
    let tanda: KemajuanTopik['tanda'] = 'hijau';
    let alasan: string | undefined;
    if (total >= 6 && rasio < 0.5) {
      tanda = 'merah';
      alasan = `Benar ${b} dari ${total} soal. Perlu dijelaskan ulang bersama.`;
    } else if (total >= 4 && (rasio < 0.7 || p >= total)) {
      tanda = 'kuning';
      alasan = p >= total ? 'Sering memakai petunjuk.' : `Benar ${b} dari ${total} soal.`;
    }
    const k: KemajuanTopik = {
      id,
      anak_id: anakId,
      mapel,
      topik,
      status,
      benar: b,
      salah: s,
      petunjuk: p,
      terakhir: sekarangIso(),
      tanda,
      alasan,
    };
    await this.simpan('kemajuan_topik', k);
    this.ubah();
    return k;
  }

  // ---------- pesan ----------

  async daftarPesan(anakId: string): Promise<Pesan[]> {
    const p = await this.gudang.cari('pesan', { anak_id: anakId });
    return p.sort((a, b) => a.waktu.localeCompare(b.waktu));
  }

  async kirimPesan(data: Pick<Pesan, 'anak_id' | 'dari' | 'jenis' | 'isi'>): Promise<Pesan> {
    const kel = await this.keluarga();
    if (!kel) throw new Error('Keluarga belum dibuat');
    const p: Pesan = { ...data, id: buatId(), keluarga_id: kel.id, waktu: sekarangIso() };
    await this.simpan('pesan', p);
    this.ubah();
    return p;
  }

  async tandaiDibaca(anakId: string, dari: Pesan['dari']) {
    const daftar = await this.daftarPesan(anakId);
    const waktu = sekarangIso();
    for (const p of daftar) {
      if (p.dari === dari && !p.dibaca) await this.simpan('pesan', { ...p, dibaca: waktu });
    }
    this.ubah();
  }

  // ---------- hapus semua ----------

  async hapusSemua() {
    await this.gudang.kosongkan();
    this.urutan = 0;
    this.ubah();
  }
}
