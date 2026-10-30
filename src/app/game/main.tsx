/**
 * Pemutar satu babak game. Menghitung menit main, memastikan waktu masih ada saat babak dimulai,
 * dan membiarkan babak yang berjalan selesai walau waktu habis (G08 setelahnya).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { buatId, kiniMs, sekarangIso } from '@/data/alat';
import { useData } from '@/data/konteks';
import { titip } from '@/fitur/sementara';
import { cekMain, useHitungWaktu } from '@/fitur/waktu';
import type { Kelas, Tingkat } from '@/game/bersama/jenis';
import { KEMAJUAN_AWAL, kunciKemajuan, rapikanLevel, setelahSelesai, type KemajuanLevel } from '@/game/bersama/level';
import { bolehMulaiBabakBaru } from '@/game/bersama/waktu';
import { GAME } from '@/game/daftar';
import { batasGameDetik } from '@/layanan/penjaga-waktu';

export default function PemutarGame() {
  const { nama, tingkat, level } = useLocalSearchParams<{ nama: string; tingkat: Tingkat; level?: string }>();
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const [siap, setSiap] = useState<{ sisa: number; total: number; bunyi: boolean; benih: number; mulai: number } | null>(null);
  const game = GAME[nama];
  useHitungWaktu('main', !siap);

  useEffect(() => {
    if (!anakAktif || !game) return;
    (async () => {
      const s = await cekMain(repo, anakAktif);
      const atur = await repo.pengaturan(anakAktif.id);
      if (s.jenis !== 'boleh' || !bolehMulaiBabakBaru(s.sisaDetik)) {
        router.replace(s.jenis === 'jam_tenang' ? '/cukup?alasan=jam_tenang' : s.jenis === 'tunggu_inti' || s.jenis === 'mati' ? '/anak/main' : '/game/habis');
        return;
      }
      setSiap({ sisa: s.sisaDetik, total: batasGameDetik(atur), bunyi: atur.bunyi, benih: Math.floor(kiniMs() % 2_000_000_000), mulai: kiniMs() });
    })();
  }, [repo, anakAktif, game, router]);

  if (!game || !anakAktif || !siap) return null;
  const { Layar } = game;
  return (
    <Layar
      kelas={Math.max(1, Math.min(6, anakAktif.kelas)) as Kelas}
      tingkat={tingkat === 'seru' ? 'seru' : 'santai'}
      level={level ? rapikanLevel(level) : undefined}
      benih={siap.benih}
      sisaDetikAwal={siap.sisa}
      totalDetik={siap.total}
      bunyi={siap.bunyi}
      onKeluar={() => router.replace('/anak/main')}
      onSelesai={async (r) => {
        const durasi = Math.round((kiniMs() - siap.mulai) / 1000);
        await repo.simpanSesi(
          { id: buatId(), anak_id: anakAktif.id, jenis: 'game', mode: 'sendiri', kelas: anakAktif.kelas, rujukan: r.level ? `${game.nama}:L${r.level}` : `${game.nama}:${r.tingkat}`, mulai: new Date(siap.mulai).toISOString(), selesai: sekarangIso(), durasiDetik: durasi, benar: r.halDikerjakan.length, jumlah: r.halDikerjakan.length },
          [],
        );
        if (r.level) {
          // Level selesai: diberi tanda, level berikutnya terbuka.
          const kunci = kunciKemajuan(anakAktif.id, game.nama);
          const lama = (await repo.nilai<KemajuanLevel>(kunci)) ?? KEMAJUAN_AWAL;
          await repo.aturNilai(kunci, setelahSelesai(lama, rapikanLevel(r.level)), anakAktif.id);
        }
        const s = await cekMain(repo, anakAktif);
        titip('akhir-babak', { r, rute: nama, bolehLagi: s.jenis === 'boleh' && bolehMulaiBabakBaru(s.sisaDetik) });
        router.replace('/game/akhir');
      }}
    />
  );
}
