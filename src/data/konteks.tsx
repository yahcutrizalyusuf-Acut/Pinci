/**
 * Konteks aplikasi: repositori data, anak yang sedang aktif, dan kunci mode orang tua.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { kiniMs } from './alat';
import { buatGudang } from './buat-gudang';
import type { Anak, Keluarga } from './jenis';
import { Repositori } from './repositori';
import { opsiServer, opsiSupabase } from './sinkron';
import { buatPengirimSupabase, segarkanSesi, type OpsiSupabase, type Sesimasuk } from './supabase';

interface NilaiKonteks {
  repo: Repositori;
  siap: boolean;
  keluarga: Keluarga | null;
  daftarAnak: Anak[];
  anakAktif: Anak | null;
  pilihAnak: (id: string | null) => void;
  /** mode orang tua terbuka sampai waktu ini (PIN) */
  ortuTerbuka: boolean;
  bukaOrtu: () => void;
  kunciOrtu: () => void;
  /** pengaturan bicara dengan server (token, keluarga, peran); null bila mode lokal */
  server: OpsiSupabase | null;
  /** naik setiap data berubah — dipakai layar untuk memuat ulang */
  versi: number;
  segarkan: () => Promise<void>;
}

const Konteks = createContext<NilaiKonteks | null>(null);

/** Mode orang tua tertutup sendiri setelah 15 menit. */
const LAMA_ORTU_MS = 15 * 60 * 1000;

export function PenyediaData({ children, repoUji }: { children: ReactNode; repoUji?: Repositori }) {
  const { repo, server } = useMemo(() => {
    if (repoUji) return { repo: repoUji, server: null };
    const server = opsiServer({
      ambilToken: async () => {
        const sesi = await r.nilai<Sesimasuk>('sesi_masuk');
        if (!sesi) return null;
        if (sesi.berakhir - kiniMs() > 60_000) return sesi.tokenAkses;
        const o = opsiSupabase();
        const baru = o ? await segarkanSesi(o, sesi.tokenSegar).catch(() => null) : null;
        if (!baru) return null;
        await r.aturNilai('sesi_masuk', baru);
        return baru.tokenAkses;
      },
      ambilKeluargaId: async () => (await r.keluarga())?.id ?? null,
      ambilPeran: async () => ((await r.keluarga())?.hp === 'anak' ? 'anak' : 'ortu'),
      ambilPenggunaId: async () => (await r.nilai<Sesimasuk>('sesi_masuk'))?.penggunaId ?? null,
    });
    const r: Repositori = new Repositori(buatGudang(), server ? buatPengirimSupabase(server) : null);
    return { repo: r, server };
  }, [repoUji]);
  const [siap, setSiap] = useState(false);
  const [keluarga, setKeluarga] = useState<Keluarga | null>(null);
  const [daftarAnak, setDaftarAnak] = useState<Anak[]>([]);
  const [anakAktifId, setAnakAktifId] = useState<string | null>(null);
  const [ortuSampai, setOrtuSampai] = useState(0);
  const [versi, setVersi] = useState(0);
  const [detak, setDetak] = useState(() => kiniMs());
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const segarkan = useCallback(async () => {
    setKeluarga(await repo.keluarga());
    setDaftarAnak(await repo.daftarAnak());
    setVersi((v) => v + 1);
  }, [repo]);

  useEffect(() => {
    let batal = false;
    (async () => {
      await repo.siapkan();
      const aktif = await repo.nilai<string>('anak_aktif');
      if (batal) return;
      setAnakAktifId(aktif);
      await segarkan();
      setSiap(true);
      repo.sinkronDuaArah().catch(() => undefined);
    })();
    const lepas = repo.dengar(() => {
      segarkan().catch(() => undefined);
    });
    // Kirim antrean dan tarik data baru tiap menit selama aplikasi terbuka (yang gagal dicoba lagi dengan jeda sendiri).
    timer.current = setInterval(() => {
      repo.sinkronDuaArah().catch(() => undefined);
      setDetak(kiniMs());
    }, 60_000);
    // Saat aplikasi dibuka kembali, langsung sinkron supaya pesan dan hasil terbaru tampil.
    const langgan = AppState.addEventListener('change', (status) => {
      if (status === 'active') repo.sinkronDuaArah().catch(() => undefined);
    });
    return () => {
      batal = true;
      lepas();
      langgan.remove();
      if (timer.current) clearInterval(timer.current);
    };
  }, [repo, segarkan]);

  const pilihAnak = useCallback(
    (id: string | null) => {
      setAnakAktifId(id);
      repo.aturNilai('anak_aktif', id).catch(() => undefined);
    },
    [repo],
  );

  const nilai: NilaiKonteks = {
    repo,
    siap,
    keluarga,
    daftarAnak,
    anakAktif: daftarAnak.find((a) => a.id === anakAktifId) ?? null,
    pilihAnak,
    ortuTerbuka: detak < ortuSampai,
    bukaOrtu: () => {
      const kini = kiniMs();
      setDetak(kini);
      setOrtuSampai(kini + LAMA_ORTU_MS);
    },
    kunciOrtu: () => setOrtuSampai(0),
    server,
    versi,
    segarkan,
  };
  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useData(): NilaiKonteks {
  const k = useContext(Konteks);
  if (!k) throw new Error('useData dipakai di luar PenyediaData');
  return k;
}

/** Muat data async yang dimuat ulang setiap repositori berubah. */
export function useMuat<T>(muat: (repo: Repositori) => Promise<T>, awal: T, deps: unknown[] = []): T {
  const { repo, versi } = useData();
  const [hasil, setHasil] = useState<T>(awal);
  useEffect(() => {
    let batal = false;
    muat(repo)
      .then((h) => {
        if (!batal) setHasil(h);
      })
      .catch(() => undefined);
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, versi, ...deps]);
  return hasil;
}
