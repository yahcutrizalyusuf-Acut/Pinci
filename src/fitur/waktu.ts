/** Kait penjaga waktu untuk layar: menghitung detik belajar/main dan memeriksa izin. */
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { kiniMs } from '../data/alat';
import type { Anak } from '../data/jenis';
import type { Repositori } from '../data/repositori';
import { useData } from '../data/konteks';
import { statusBelajar, statusMain, tambahBelajar, tambahMain, type StatusBelajar, type StatusMain } from '../layanan/penjaga-waktu';

export async function cekBelajar(repo: Repositori, anak: Anak, sekarang = new Date()): Promise<StatusBelajar> {
  return statusBelajar(await repo.pemakaian(anak.id), await repo.pengaturan(anak.id), sekarang);
}

export async function cekMain(repo: Repositori, anak: Anak, sekarang = new Date()): Promise<StatusMain> {
  return statusMain(await repo.pemakaian(anak.id), await repo.pengaturan(anak.id), sekarang);
}

/** Rute yang harus dibuka bila belajar tidak boleh sekarang, atau null. */
export function ruteHalangan(s: StatusBelajar): '/istirahat' | '/cukup' | '/cukup?alasan=jam_tenang' | null {
  if (s.jenis === 'istirahat') return '/istirahat';
  if (s.jenis === 'cukup') return '/cukup';
  if (s.jenis === 'jam_tenang') return '/cukup?alasan=jam_tenang';
  return null;
}

/**
 * Hitung detik selama layar terbuka dan aplikasi aktif. `jenis` = 'belajar' atau 'main'.
 * `jeda` menghentikan hitungan (layar Jeda). Disimpan tiap 10 detik dan saat layar ditutup.
 */
export function useHitungWaktu(jenis: 'belajar' | 'main', jeda = false, mode: 'sendiri' | 'dampingi' = 'sendiri', penjaga = true) {
  const router = useRouter();
  const sudahDihalangi = useRef(false);
  const { repo, anakAktif } = useData();
  const tertunda = useRef(0);
  const terakhir = useRef(0);
  const aktif = useRef(AppState.currentState === 'active');

  useEffect(() => {
    if (!anakAktif || mode === 'dampingi') return;
    const id = anakAktif.id;
    const simpan = async () => {
      const d = Math.round(tertunda.current);
      if (d <= 0) return;
      tertunda.current -= d;
      const p = await repo.pemakaian(id);
      const baru = jenis === 'belajar' ? tambahBelajar(p, d, new Date()) : tambahMain(p, d);
      await repo.simpanPemakaian(baru);
      // Blok 15 menit habis atau batas harian tercapai di tengah layar: buka Istirahat/Cukup.
      // Istirahat dibuka di atas layar ini, jadi setelah istirahat anak kembali ke soal yang sama.
      if (jenis === 'belajar' && penjaga && !sudahDihalangi.current) {
        const r = ruteHalangan(statusBelajar(baru, await repo.pengaturan(id), new Date()));
        if (r) {
          sudahDihalangi.current = true;
          router.push(r);
          setTimeout(() => (sudahDihalangi.current = false), 5000);
        }
      }
    };
    terakhir.current = kiniMs();
    const detak = setInterval(() => {
      const kini = kiniMs();
      if (!jeda && aktif.current) tertunda.current += (kini - terakhir.current) / 1000;
      terakhir.current = kini;
      if (tertunda.current >= 10) simpan().catch(() => undefined);
    }, 1000);
    const lang = AppState.addEventListener('change', (st) => {
      aktif.current = st === 'active';
      terakhir.current = kiniMs();
    });
    return () => {
      clearInterval(detak);
      lang.remove();
      tertunda.current += !jeda && aktif.current ? (kiniMs() - terakhir.current) / 1000 : 0;
      simpan().catch(() => undefined);
    };
  }, [repo, anakAktif, jenis, jeda, mode, penjaga, router]);
}
