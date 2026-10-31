/**
 * Repositori: satu-satunya pintu aplikasi ke data. Layar tidak pernah menyentuh
 * SQLite atau Supabase langsung (CLAUDE.md: lapisan data).
 *
 * Aturan dari 04-tahan-putus-sinyal.md:
 * - Simpan dulu di HP, kirim kemudian. Lembar selesai = tersimpan di HP.
 * - Setiap baris yang perlu dikirim masuk antrean; pengirim mencoba lagi dengan jeda 1-2-5-15 menit.
 * - Sesi dan jawaban hanya ditambah, tidak pernah diubah.
 */
import { buatId, kiniMs, sekarangIso, sha256, tanggalLokal } from './alat';
import type { Gudang } from './gudang';
import {
  TABEL_SINKRON,
  type AnggotaKelas,
  type Anak,
  type CatatanPemakaian,
  type CatatanPengawas,
  type CatatanTeknis,
  type ItemAntrean,
  type Jawaban,
  type Keluarga,
  type KemajuanTopik,
  type NamaTabel,
  type Pemakaian,
  type Masukan,
  type PengaturanWaktu,
  type Pesan,
  type PetaTabel,
  type Sesi,
  type Tugas,
} from './jenis';

/** Pengirim ke server. Mode lokal tidak punya pengirim. */
export interface PengirimSinkron {
  /** kirim sekumpulan baris; kembalikan id antrean yang diterima server */
  kirim(item: { antrean: ItemAntrean; baris: object }[]): Promise<string[]>;
  /** tarik baris yang berubah sejak `sejak` (null = dari awal), satu halaman; melempar galat bila gagal */
  tarik?(tabel: NamaTabel, opsi: { sejak: string | null; offset: number; batas: number }): Promise<{ baris: object[]; kursorMaks: string | null }>;
  /** jawaban milik sesi-sesi ini (sesi baru ditarik bersama jawabannya) */
  jawabanUntuk?(sesiIds: string[]): Promise<object[]>;
  /** HP anak: laporkan waktu sinkron dan sisa antrean ke HP orang tua */
  catatSinkron?(sisaAntrean: number): Promise<void>;
  /** HP anak: sudah diputus oleh orang tua? */
  perangkatDiputus?(): Promise<boolean>;
  /** keanggotaan kelas pengawas yang aktif untuk anak-anak di HP ini (selalu daftar lengkap) */
  kelasKeluarga?(): Promise<AnggotaKelas[]>;
}

export type StatusSimpan = 'tersimpan' | 'terkirim';

const JEDA_MENIT = [1, 2, 5, 15];

/** Tabel yang ditarik dari server, urut: sesi terakhir karena ikut menarik jawabannya. */
const TABEL_TARIK: NamaTabel[] = ['anak', 'pengaturan_waktu', 'pesan', 'kemajuan_topik', 'pemakaian', 'catatan_pengawas', 'tugas', 'sesi'];

/** Jenis sesi yang menyelesaikan tugas pengawas berjenis tertentu. */
const SESI_UNTUK_TUGAS: Record<Tugas['jenis'], Sesi['jenis'][]> = {
  lancar: ['lancar'],
  baca: ['baca'],
  tka: ['tka', 'mini_tryout', 'simulasi'],
  inggris: ['inggris'],
  kartu: ['kartu'],
  game: ['game'],
};

/** Sesi ini menyelesaikan tugas ini? Jenis harus cocok; kalau tugas menyebut rujukan (topik, teks, level), rujukan juga harus cocok. */
export function sesiMenyelesaikan(tugas: Tugas, sesi: Sesi): boolean {
  if (tugas.selesai || tugas.dibatalkan || tugas.anak_id !== sesi.anak_id) return false;
  if (!SESI_UNTUK_TUGAS[tugas.jenis].includes(sesi.jenis)) return false;
  if (Date.parse(sesi.selesai) < Date.parse(tugas.dibuat)) return false;
  if (!tugas.rujukan) return true;
  // Latihan rumah TKA memakai rujukan "<topik>-rumah"; game memakai "<game>:L<level>".
  const r = sesi.rujukan ?? '';
  return r === tugas.rujukan || r.startsWith(`${tugas.rujukan}-`) || r.startsWith(`${tugas.rujukan}:`) || (sesi.level !== undefined && String(sesi.level) === tugas.rujukan);
}
/** Kursor mundur 5 menit tiap tarik: baris yang baru terkirim dengan jam lebih awal tetap tertangkap. Aman karena penggabungan idempoten. */
const TUMPANG_TARIK_MS = 5 * 60_000;
const HALAMAN_TARIK = 500;

function urutkanKunci(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(urutkanKunci);
  if (x && typeof x === 'object') {
    return Object.fromEntries(
      Object.entries(x as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, urutkanKunci(v)]),
    );
  }
  return x;
}

/** Dua baris sama isinya (tidak peka urutan kunci dan kolom kosong). */
export function samaIsi(a: object, b: object): boolean {
  return JSON.stringify(urutkanKunci(a)) === JSON.stringify(urutkanKunci(b));
}

/**
 * Gabungkan catatan pemakaian satu hari dari dua HP: angka terbesar menang, tanda selesai bila salah satu selesai.
 * Hasilnya sama di kedua HP, berapa kali pun digabung.
 */
export function gabungPemakaian(a: Pemakaian, b: Pemakaian): Pemakaian {
  const terlambat = (x?: string, y?: string) => (!x ? y : !y ? x : Date.parse(x) >= Date.parse(y) ? x : y);
  return {
    id: a.id,
    anak_id: a.anak_id,
    tanggal: a.tanggal,
    belajarDetik: Math.max(a.belajarDetik, b.belajarDetik),
    mainDetik: Math.max(a.mainDetik, b.mainDetik),
    blokDetik: Math.max(a.blokDetik, b.blokDetik),
    istirahatSampai: terlambat(a.istirahatSampai, b.istirahatSampai),
    intiSelesai: a.intiSelesai || b.intiSelesai,
  };
}

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

  /** Semua nilai (milik siapa pun) yang kuncinya diawali `awalan`, sebagai [kunci, isi]. */
  async nilaiAwalan<T>(awalan: string): Promise<[string, T][]> {
    const semua = await this.gudang.cari('nilai');
    return semua.filter((n) => n.id.startsWith(awalan)).map((n) => [n.id, JSON.parse(n.isi) as T]);
  }

  // ---------- antrean ----------

  private async antrekan<T extends NamaTabel>(tabel: T, baris: PetaTabel[T]) {
    if (!TABEL_SINKRON.includes(tabel)) return;
    const item: ItemAntrean = { id: buatId(), tabel, barisId: baris.id, dibuat: sekarangIso(), coba: 0 };
    await this.gudang.pasang('antrean', { ...item, ...{ tabel } });
    this.jadwalkanKirim();
  }

  private kirimOtomatis = false;
  private tundaKirim: ReturnType<typeof setTimeout> | null = null;

  /**
   * Aplikasi menyalakan ini: setiap ada yang disimpan, kirim dan tarik sekitar 1,5 detik kemudian
   * (banyak simpanan beruntun jadi satu kali), tidak menunggu putaran sinkron tiap menit.
   * Mati secara bawaan supaya uji tetap bisa mengatur sendiri kapan mengirim.
   */
  aturKirimOtomatis(nyala: boolean) {
    this.kirimOtomatis = nyala;
    if (!nyala && this.tundaKirim) {
      clearTimeout(this.tundaKirim);
      this.tundaKirim = null;
    }
  }

  private jadwalkanKirim() {
    if (!this.kirimOtomatis || !this.pengirim || this.tundaKirim) return;
    this.tundaKirim = setTimeout(() => {
      this.tundaKirim = null;
      this.sinkronDuaArah().catch(() => undefined);
    }, 1500);
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

  /** Kirim lalu tarik. Aman dipanggil kapan saja: yang gagal dicoba lagi pada putaran berikutnya. */
  async sinkronDuaArah(): Promise<{ terkirim: number; sisa: number; ditarik: number }> {
    // HP anak yang diputus orang tua berhenti sinkron; aplikasi tetap bisa dipakai di HP ini.
    if (await this.hpDiputus()) return { terkirim: 0, sisa: (await this.antreanBelumTerkirim()).length, ditarik: 0 };
    const kirim = await this.sinkron().catch(() => ({ terkirim: 0, sisa: 0 }));
    const ditarik = (await this.tarik().catch(() => 0)) + (await this.tarikKelas().catch(() => 0));
    await this.laporHp(kirim.sisa);
    return { ...kirim, ditarik };
  }

  private terakhirLapor = 0;

  /** HP anak: tiap 5 menit laporkan sinkron ke HP orang tua dan periksa apakah HP ini diputus. */
  private async laporHp(sisa: number) {
    const p = this.pengirim;
    if (!p?.catatSinkron || kiniMs() - this.terakhirLapor < 5 * 60_000) return;
    this.terakhirLapor = kiniMs();
    try {
      if (await p.perangkatDiputus?.()) {
        await this.gudang.pasang('nilai', { id: 'hp_diputus', isi: JSON.stringify(true) });
        this.ubah();
        return;
      }
      await p.catatSinkron(sisa);
    } catch {
      // dicoba lagi 5 menit kemudian
    }
  }

  /**
   * Tarik baris yang berubah di server, lalu gabungkan ke HP ini. Aturan penggabungan:
   * - sesi dan jawaban hanya ditambah (tidak pernah diubah);
   * - baris yang masih menunggu dikirim dari HP ini TIDAK ditimpa (HP ini menang, nanti terkirim);
   * - pemakaian: angka terbesar menang; kemajuan topik: yang `terakhir`-nya lebih baru menang;
   * - anak, pengaturan waktu, pesan: server menang.
   * Mengembalikan jumlah baris yang berubah di HP ini.
   */
  async tarik(): Promise<number> {
    const p = this.pengirim;
    if (!p?.tarik) return 0;
    const belumKirim = await this.antreanBelumTerkirim();
    let berubah = 0;
    for (const tabel of TABEL_TARIK) {
      const kunciKursor = `tarik:${tabel}`;
      const kursor = await this.nilai<string>(kunciKursor);
      const sejak = kursor ? new Date(Date.parse(kursor) - TUMPANG_TARIK_MS).toISOString() : null;
      const antre = new Set(belumKirim.filter((a) => a.tabel === tabel).map((a) => a.barisId));
      let maks = kursor;
      try {
        for (let offset = 0; ; offset += HALAMAN_TARIK) {
          const h = await p.tarik(tabel, { sejak, offset, batas: HALAMAN_TARIK });
          berubah += await this.gabung(tabel, h.baris, antre);
          if (h.kursorMaks && (!maks || Date.parse(h.kursorMaks) > Date.parse(maks))) maks = h.kursorMaks;
          if (h.baris.length < HALAMAN_TARIK) break;
        }
        // Kursor maju hanya bila seluruh tabel berhasil ditarik; kalau gagal, putaran berikut mengulang dari kursor lama.
        if (maks && maks !== kursor) await this.gudang.pasang('nilai', { id: kunciKursor, isi: JSON.stringify(maks) });
      } catch {
        // tabel ini dicoba lagi pada putaran berikutnya
      }
    }
    if (berubah > 0) this.ubah();
    return berubah;
  }

  private async gabung(tabel: NamaTabel, baris: object[], antre: Set<string>): Promise<number> {
    let berubah = 0;
    if (tabel === 'sesi') {
      const baru: Sesi[] = [];
      for (const b of baris as Sesi[]) if (!(await this.gudang.ambil('sesi', b.id))) baru.push(b);
      if (baru.length === 0) return 0;
      // Jawaban dipasang lebih dulu: kalau gagal, sesinya belum ada di HP ini sehingga putaran berikut mengulang.
      const jawaban = (await this.pengirim?.jawabanUntuk?.(baru.map((s) => s.id))) ?? [];
      await this.gudang.pasangBanyak('jawaban', jawaban as Jawaban[]);
      await this.gudang.pasangBanyak('sesi', baru);
      return baru.length;
    }
    if (tabel === 'catatan_pengawas' || tabel === 'tugas') {
      // Tanda "dibaca"/"selesai" hanya maju: kalau HP ini sudah menandai tetapi server belum, tanda HP dipertahankan dan dikirim ulang.
      const kolom = tabel === 'tugas' ? 'selesai' : 'dibaca';
      for (const b of baris as (CatatanPengawas | Tugas)[]) {
        const lokal = (await this.gudang.ambil(tabel, b.id)) as (CatatanPengawas | Tugas) | null;
        const tandaLokal = (lokal as Record<string, unknown> | null)?.[kolom];
        const tandaServer = (b as unknown as Record<string, unknown>)[kolom];
        const gabungan = { ...b, ...(tandaLokal && !tandaServer ? { [kolom]: tandaLokal } : {}) } as CatatanPengawas & Tugas;
        if (lokal && samaIsi(lokal, gabungan)) continue;
        await this.gudang.pasang(tabel, gabungan);
        if (tandaLokal && !tandaServer && !antre.has(b.id)) await this.antrekan(tabel, gabungan);
        berubah++;
      }
      return berubah;
    }
    for (const b of baris as ({ id: string } & object)[]) {
      const t = tabel as 'anak' | 'pengaturan_waktu' | 'pesan' | 'kemajuan_topik' | 'pemakaian';
      const lokal = (await this.gudang.ambil(t, b.id)) as object | null;
      if (t === 'pemakaian') {
        const server = b as Pemakaian;
        const gabungan = lokal ? gabungPemakaian(lokal as Pemakaian, server) : server;
        if (lokal && samaIsi(lokal, gabungan)) {
          // HP ini sudah lebih besar atau sama; kalau lebih besar dari server, kirim ke server.
          if (!samaIsi(server, gabungan) && !antre.has(b.id)) await this.antrekan('pemakaian', gabungan);
          continue;
        }
        await this.gudang.pasang('pemakaian', gabungan);
        if (!samaIsi(server, gabungan) && !antre.has(b.id)) await this.antrekan('pemakaian', gabungan);
        berubah++;
        continue;
      }
      if (antre.has(b.id)) continue; // HP ini punya perubahan yang belum terkirim
      if (lokal && samaIsi(lokal, b)) continue;
      if (t === 'kemajuan_topik' && lokal && Date.parse((lokal as KemajuanTopik).terakhir) > Date.parse((b as KemajuanTopik).terakhir)) continue;
      await this.gudang.pasang(t, b as never);
      berubah++;
    }
    return berubah;
  }

  /**
   * Tarik daftar kelas anak-anak di HP ini. Server selalu mengirim daftar lengkap yang aktif,
   * jadi keanggotaan yang tidak ada lagi (anak keluar kelas) dihapus dari HP.
   */
  async tarikKelas(): Promise<number> {
    const p = this.pengirim;
    if (!p?.kelasKeluarga) return 0;
    const server = await p.kelasKeluarga();
    const lokal = await this.gudang.cari('anggota_kelas');
    const ada = new Set(server.map((a) => a.id));
    let berubah = 0;
    for (const a of lokal) {
      if (!ada.has(a.id)) {
        await this.gudang.hapus('anggota_kelas', a.id);
        berubah++;
      }
    }
    for (const a of server) {
      // Persetujuan catatan pemakaian ikut disalin (HP anak tidak punya layar persetujuan sendiri).
      if (a.setujuPemakaian !== undefined && (await this.nilai<boolean>(`catatan_pemakaian:${a.anak_id}`)) !== a.setujuPemakaian) {
        await this.gudang.pasang('nilai', { id: `catatan_pemakaian:${a.anak_id}`, anak_id: a.anak_id, isi: JSON.stringify(a.setujuPemakaian) });
      }
      const l = lokal.find((x) => x.id === a.id);
      if (l && samaIsi(l, a)) continue;
      await this.gudang.pasang('anggota_kelas', a);
      berubah++;
    }
    if (berubah > 0) this.ubah();
    return berubah;
  }

  /** Simpan satu keanggotaan kelas yang baru saja dibuat di server (supaya layar langsung berubah). */
  async pasangAnggotaKelas(a: AnggotaKelas) {
    for (const lama of await this.gudang.cari('anggota_kelas', { anak_id: a.anak_id })) {
      if (lama.id !== a.id) await this.gudang.hapus('anggota_kelas', lama.id);
    }
    await this.gudang.pasang('anggota_kelas', a);
    this.ubah();
  }

  async hapusAnggotaKelas(anakId: string) {
    for (const a of await this.gudang.cari('anggota_kelas', { anak_id: anakId })) await this.gudang.hapus('anggota_kelas', a.id);
    this.ubah();
  }

  /** Kelas aktif seorang anak, atau null. */
  async kelasAnak(anakId: string): Promise<AnggotaKelas | null> {
    const a = await this.gudang.cari('anggota_kelas', { anak_id: anakId });
    return a[0] ?? null;
  }

  async daftarKelasAnak(): Promise<AnggotaKelas[]> {
    return this.gudang.cari('anggota_kelas');
  }

  /** Catatan pengawas, terbaru dulu. Tanpa anakId = semua anak. */
  async catatanPengawas(anakId?: string): Promise<CatatanPengawas[]> {
    const c = await this.gudang.cari('catatan_pengawas', anakId ? { anak_id: anakId } : undefined);
    return c.sort((a, b) => b.waktu.localeCompare(a.waktu));
  }

  async tandaiCatatanDibaca(anakId?: string) {
    const waktu = sekarangIso();
    let berubah = false;
    for (const c of await this.catatanPengawas(anakId)) {
      if (!c.dibaca) {
        await this.simpan('catatan_pengawas', { ...c, dibaca: waktu });
        berubah = true;
      }
    }
    // Sama seperti pesan: hanya beri tahu layar bila ada yang berubah, supaya tidak memuat tanpa henti.
    if (berubah) this.ubah();
  }

  /** Tugas pengawas yang belum selesai, terlama dulu. */
  async tugasTerbuka(anakId: string): Promise<Tugas[]> {
    const t = await this.gudang.cari('tugas', { anak_id: anakId });
    return t.filter((x) => !x.selesai && !x.dibatalkan).sort((a, b) => a.dibuat.localeCompare(b.dibuat));
  }

  async semuaTugas(anakId: string): Promise<Tugas[]> {
    const t = await this.gudang.cari('tugas', { anak_id: anakId });
    return t.filter((x) => !x.dibatalkan).sort((a, b) => b.dibuat.localeCompare(a.dibuat));
  }

  /** Tandai tugas yang cocok dengan sesi ini sebagai selesai. */
  private async cocokkanTugas(sesi: Sesi) {
    for (const t of await this.tugasTerbuka(sesi.anak_id)) {
      if (sesiMenyelesaikan(t, sesi)) await this.simpan('tugas', { ...t, selesai: sesi.selesai });
    }
  }

  // ---------- masukan dan catatan (hanya dikirim ke server) ----------

  /** Orang tua mengirim masukan (masalah, saran, atau pujian). Tersimpan dulu, terkirim saat ada sinyal. */
  async kirimMasukan(jenis: Masukan['jenis'], isi: string, versiAplikasi?: string): Promise<Masukan> {
    const kel = await this.keluarga();
    if (!kel) throw new Error('Keluarga belum dibuat');
    const m: Masukan = { id: buatId(), keluarga_id: kel.id, jenis, isi: isi.trim().slice(0, 1000), waktu: sekarangIso(), ...(versiAplikasi ? { versiAplikasi } : {}) };
    await this.simpan('masukan', m);
    this.ubah();
    return m;
  }

  async daftarMasukan(): Promise<Masukan[]> {
    const m = await this.gudang.cari('masukan');
    return m.sort((a, b) => b.waktu.localeCompare(a.waktu));
  }

  /** Jawaban pertanyaan pilihan untuk orang tua (dicatat di HP dan dikirim). */
  async jawabPertanyaan(kode: string, jawaban: string) {
    const kel = await this.keluarga();
    await this.aturNilai(`masukan:${kode}`, jawaban);
    if (!kel) return;
    await this.simpan('jawaban_pertanyaan', { id: buatId(), keluarga_id: kel.id, kode, jawaban, waktu: sekarangIso() });
  }

  /** Catatan pemakaian hanya dibuat bila orang tua menyetujuinya untuk anak ini. */
  async catatPemakaian(anakId: string, kejadian: CatatanPemakaian['kejadian'], layar: string, detik?: number): Promise<boolean> {
    if (!this.pengirim || (await this.nilai<boolean>(`catatan_pemakaian:${anakId}`)) !== true) return false;
    const kel = await this.keluarga();
    if (!kel) return false;
    const c: CatatanPemakaian = { id: buatId(), keluarga_id: kel.id, anak_id: anakId, kejadian, layar: layar.slice(0, 40), waktu: sekarangIso() };
    if (detik !== undefined) c.detik = Math.max(0, Math.min(86_400, Math.round(detik)));
    await this.simpan('catatan_pemakaian', c);
    return true;
  }

  /** "Aplikasi dibuka" dicatat paling banyak sekali sehari per anak. */
  async bukaAplikasi(anakId: string) {
    const kunci = `buka:${anakId}`;
    const hari = tanggalLokal();
    if ((await this.nilai<string>(kunci)) === hari) return;
    // Tanda hari hanya dipasang bila benar-benar tercatat (persetujuan bisa datang belakangan hari itu).
    if (await this.catatPemakaian(anakId, 'buka_aplikasi', 'beranda')) await this.gudang.pasang('nilai', { id: kunci, anak_id: anakId, isi: JSON.stringify(hari) });
  }

  private teknisTerakhir = new Map<string, number>();

  /** Catatan masalah teknis (tanpa data pribadi). Pesan yang sama paling banyak sekali per 10 menit. */
  async catatTeknis(pesan: string, tempat?: string, versiAplikasi?: string, perangkat?: string) {
    if (!this.pengirim) return;
    const ringkas = pesan.replace(/\s+/g, ' ').trim().slice(0, 500);
    if (!ringkas) return;
    const lalu = this.teknisTerakhir.get(ringkas) ?? 0;
    if (kiniMs() - lalu < 10 * 60_000) return;
    this.teknisTerakhir.set(ringkas, kiniMs());
    const kel = await this.keluarga();
    const c: CatatanTeknis = { id: buatId(), pesan: ringkas, waktu: sekarangIso() };
    if (kel) c.keluarga_id = kel.id;
    if (tempat) c.tempat = tempat.slice(0, 80);
    if (versiAplikasi) c.versiAplikasi = versiAplikasi.slice(0, 40);
    if (perangkat) c.perangkat = perangkat.slice(0, 60);
    await this.simpan('catatan_teknis', c);
  }

  /** HP anak: pasang keluarga dari server (tanpa PIN) setelah kode hubung dipakai. */
  async pasangKeluargaHpAnak(keluargaId: string, sapaanOrtu: string): Promise<Keluarga> {
    const kel: Keluarga = { id: keluargaId, dibuat: sekarangIso(), pinHash: '', garam: '', sapaanOrtu, modeData: 'supabase', hp: 'anak' };
    await this.gudang.pasang('keluarga', kel);
    this.ubah();
    return kel;
  }

  /** HP anak: orang tua sudah memutus HP ini? (dicatat saat sinkron) */
  async hpDiputus(): Promise<boolean> {
    return (await this.nilai<boolean>('hp_diputus')) === true;
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
    await this.cocokkanTugas(s);
    await this.catatPemakaian(s.anak_id, 'selesai', s.jenis, s.durasiDetik);
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
    let berubah = false;
    for (const p of daftar) {
      if (p.dari === dari && !p.dibaca) {
        await this.simpan('pesan', { ...p, dibaca: waktu });
        berubah = true;
      }
    }
    // Hanya memberi tahu layar bila ada yang berubah. Layar memanggil ini saat memuat; tanpa syarat ini
    // pemuatan memicu pemberitahuan, yang memicu pemuatan lagi, tanpa henti.
    if (berubah) this.ubah();
  }

  // ---------- hapus semua ----------

  async hapusSemua() {
    await this.gudang.kosongkan();
    this.urutan = 0;
    this.ubah();
  }
}
