/**
 * Penyimpanan rekaman suara anak — HANYA di folder pribadi aplikasi (CLAUDE.md aturan 12).
 *
 * - Berkas rekaman dan daftar catatannya (`daftar.json`) ada di `<dokumen aplikasi>/rekaman/`. Tidak ada di tabel data,
 *   jadi tidak pernah masuk antrean sinkron dan tidak pernah dikirim ke server.
 * - Tidak ada fungsi bagikan atau ekspor.
 * - Cadangan Android mati lewat `android.allowBackup: false` di app.json.
 * - Di web (hanya untuk tangkapan layar) dan di uji: disimpan di memori, hilang saat halaman ditutup.
 */
import { Platform } from 'react-native';

import { buatId } from '../data/alat';
import { bisaSematkan, rapikanRekaman, rekamanAnak, type CatatanRekaman, type JenisRekaman } from '../fitur/rekaman';

export interface PenyimpanRekaman {
  bacaDaftar(): Promise<CatatanRekaman[]>;
  tulisDaftar(daftar: CatatanRekaman[]): Promise<void>;
  /** pindahkan berkas sementara dari perekam ke folder rekaman; kembalikan alamat baru dan ukurannya */
  simpanBerkas(alamatSementara: string, id: string): Promise<{ berkas: string; ukuran: number }>;
  hapusBerkas(berkas: string): Promise<void>;
  /** hapus seluruh folder rekaman (dipakai saat Izin 8 dicabut) */
  hapusFolder(): Promise<void>;
  /** hapus berkas sementara perekam yang tertinggal (rekaman yang terputus) */
  bersihkanSementara(): Promise<void>;
}

/** Penyimpan di memori: untuk uji dan web. */
export class PenyimpanMemori implements PenyimpanRekaman {
  daftar: CatatanRekaman[] = [];
  berkas = new Map<string, number>();
  constructor(private ukuranBawaan = 160_000) {}
  async bacaDaftar() {
    return this.daftar.map((c) => ({ ...c }));
  }
  async tulisDaftar(d: CatatanRekaman[]) {
    this.daftar = d.map((c) => ({ ...c }));
  }
  async simpanBerkas(alamatSementara: string, id: string) {
    const berkas = `memori://rekaman/${id}`;
    this.berkas.set(berkas, this.ukuranBawaan);
    return { berkas: alamatSementara.startsWith('blob:') ? alamatSementara : berkas, ukuran: this.ukuranBawaan };
  }
  async hapusBerkas(berkas: string) {
    this.berkas.delete(berkas);
  }
  async hapusFolder() {
    this.berkas.clear();
    this.daftar = [];
  }
  sementaraDibersihkan = 0;
  async bersihkanSementara() {
    this.sementaraDibersihkan += 1;
  }
}

/** Penyimpan berkas di HP (expo-file-system, folder dokumen pribadi aplikasi). */
function buatPenyimpanBerkas(): PenyimpanRekaman {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Directory, File, Paths } = require('expo-file-system') as typeof import('expo-file-system');
  const folder = () => {
    const d = new Directory(Paths.document, 'rekaman');
    if (!d.exists) d.create({ intermediates: true, idempotent: true });
    return d;
  };
  const berkasDaftar = () => new File(folder(), 'daftar.json');
  return {
    async bacaDaftar() {
      const f = berkasDaftar();
      if (!f.exists) return [];
      try {
        return JSON.parse(await f.text()) as CatatanRekaman[];
      } catch {
        return [];
      }
    },
    async tulisDaftar(d) {
      const f = berkasDaftar();
      if (!f.exists) f.create();
      f.write(JSON.stringify(d));
    },
    async simpanBerkas(alamatSementara, id) {
      const asal = new File(alamatSementara);
      const tujuan = new File(folder(), `${id}${asal.extension || '.m4a'}`);
      asal.move(tujuan);
      return { berkas: tujuan.uri, ukuran: tujuan.size ?? 0 };
    },
    async hapusBerkas(berkas) {
      const f = new File(berkas);
      if (f.exists) f.delete();
    },
    async hapusFolder() {
      const d = new Directory(Paths.document, 'rekaman');
      if (d.exists) d.delete();
    },
    async bersihkanSementara() {
      // expo-audio menulis rekaman lebih dulu ke folder cache "Audio"; sisa rekaman yang terputus dihapus di sini.
      for (const nama of ['Audio', 'ExpoAudio']) {
        const d = new Directory(Paths.cache, nama);
        if (d.exists) d.delete();
      }
    },
  };
}

export class GudangRekaman {
  private antre: Promise<unknown> = Promise.resolve();
  constructor(private penyimpan: PenyimpanRekaman) {}

  /** jalankan berurutan supaya daftar tidak saling menimpa */
  private urut<T>(f: () => Promise<T>): Promise<T> {
    const p = this.antre.then(f, f);
    this.antre = p.catch(() => undefined);
    return p;
  }

  async daftarAnak(anakId: string) {
    return rekamanAnak(await this.penyimpan.bacaDaftar(), anakId);
  }

  async semua() {
    return this.penyimpan.bacaDaftar();
  }

  tambah(data: { anak_id: string; komikId: string; panelId: string | null; jenis: JenisRekaman; alamatSementara: string; detik: number }, kini = new Date()) {
    return this.urut(async () => {
      const id = buatId();
      const { berkas, ukuran } = await this.penyimpan.simpanBerkas(data.alamatSementara, id);
      const c: CatatanRekaman = { id, anak_id: data.anak_id, komikId: data.komikId, panelId: data.panelId, jenis: data.jenis, berkas, ukuran, detik: Math.round(data.detik), dibuat: kini.toISOString(), disematkan: false };
      await this.penyimpan.tulisDaftar([...(await this.penyimpan.bacaDaftar()), c]);
      await this.rapikanDalam(kini);
      return c;
    });
  }

  hapus(id: string) {
    return this.urut(async () => {
      const d = await this.penyimpan.bacaDaftar();
      const c = d.find((x) => x.id === id);
      if (c) await this.penyimpan.hapusBerkas(c.berkas);
      await this.penyimpan.tulisDaftar(d.filter((x) => x.id !== id));
    });
  }

  /** Hapus semua rekaman semua anak di HP ini (tombol "Hapus semua rekaman" dan saat Izin 8 dicabut). */
  hapusSemua() {
    return this.urut(async () => {
      for (const c of await this.penyimpan.bacaDaftar()) await this.penyimpan.hapusBerkas(c.berkas);
      await this.penyimpan.hapusFolder();
      await this.penyimpan.bersihkanSementara();
      await this.penyimpan.tulisDaftar([]);
    });
  }

  /** Buang berkas sementara perekam (rekaman yang terputus sebelum disimpan). */
  buangSementara() {
    return this.urut(() => this.penyimpan.bersihkanSementara());
  }

  /** Hapus semua rekaman satu anak (saat profil anak dihapus). */
  hapusAnak(anakId: string) {
    return this.urut(async () => {
      const d = await this.penyimpan.bacaDaftar();
      for (const c of d.filter((x) => x.anak_id === anakId)) await this.penyimpan.hapusBerkas(c.berkas);
      await this.penyimpan.tulisDaftar(d.filter((x) => x.anak_id !== anakId));
    });
  }

  /** Sematkan sebagai kenangan (maks 5 cerita utuh per anak) atau lepas sematan. Mengembalikan false kalau ditolak. */
  sematkan(id: string, ya: boolean) {
    return this.urut(async () => {
      const d = await this.penyimpan.bacaDaftar();
      if (ya && !bisaSematkan(d, id)) return false;
      await this.penyimpan.tulisDaftar(d.map((x) => (x.id === id ? { ...x, disematkan: ya } : x)));
      return true;
    });
  }

  private async rapikanDalam(kini: Date, anakAda?: string[]) {
    const semua = await this.penyimpan.bacaDaftar();
    // rekaman milik profil anak yang sudah dihapus ikut dibuang
    const yatim = anakAda ? semua.filter((c) => !anakAda.includes(c.anak_id)) : [];
    const { simpan, hapus: lewat } = rapikanRekaman(semua.filter((c) => !yatim.includes(c)), kini);
    const hapus = [...yatim, ...lewat];
    for (const c of hapus) await this.penyimpan.hapusBerkas(c.berkas);
    if (hapus.length) await this.penyimpan.tulisDaftar(simpan);
    return hapus.length;
  }

  /**
   * Penghapusan otomatis 30 hari dan batas 50 MB; dipanggil saat aplikasi dibuka. Dengan `anakAda`, rekaman milik
   * profil yang sudah tidak ada juga dihapus. Berkas sementara perekam yang tertinggal ikut dibersihkan.
   */
  rapikan(kini = new Date(), anakAda?: string[]) {
    return this.urut(async () => {
      await this.penyimpan.bersihkanSementara();
      return this.rapikanDalam(kini, anakAda);
    });
  }
}

let tunggal: GudangRekaman | null = null;

export function gudangRekaman(): GudangRekaman {
  if (!tunggal) tunggal = new GudangRekaman(Platform.OS === 'web' || process.env.NODE_ENV === 'test' ? new PenyimpanMemori() : buatPenyimpanBerkas());
  return tunggal;
}

/** Untuk uji: ganti penyimpan. */
export function pasangGudangRekaman(g: GudangRekaman | null) {
  tunggal = g;
}

// ---------- Izin 8 ----------

export const KUNCI_IZIN_8 = 'izin8_rekaman';

interface RepoNilai {
  nilai<T>(kunci: string): Promise<T | null>;
  aturNilai<T>(kunci: string, isi: T): Promise<void>;
}

/** Izin 8 berlaku untuk HP ini (disimpan lokal di tabel nilai yang tidak pernah disinkron). Bawaan: mati. */
export async function izin8Nyala(repo: RepoNilai): Promise<boolean> {
  return (await repo.nilai<boolean>(KUNCI_IZIN_8)) === true;
}

/** Nyalakan atau cabut Izin 8. Mencabut = semua rekaman langsung dihapus. */
export async function aturIzin8(repo: RepoNilai, nyala: boolean, gudang = gudangRekaman()) {
  await repo.aturNilai(KUNCI_IZIN_8, nyala);
  if (!nyala) await gudang.hapusSemua();
}
