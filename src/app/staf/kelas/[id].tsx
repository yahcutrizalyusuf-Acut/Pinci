/**
 * Papan kelas (pengawas): siapa yang belum latihan, topik yang lemah, siapa yang perlu dipuji.
 * Senin/Rabu/Jumat: periksa, tulis catatan dan tugas per anak, lalu tekan "Pantauan selesai".
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { HEWAN, type HewanProfil } from '@/data/jenis';
import { catatPantauan, opsiStaf, papanKelas, type PapanKelas } from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { NAMA_PENANDA, PAKET, formatKodeKelas, penandaAnak, sisaHariCoba, urutkanPapan } from '@/fitur/kelas';
import { namaTopik } from '@/fitur/nama-topik';
import { hariPantau, lamaHari } from '@/fitur/staf';
import { Tombol } from '@/komponen/dasar';
import { JudulKotak, KotakStaf, LatarStaf, Penanda, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

export default function PapanKelasLayar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { repo } = useData();
  const [papan, setPapan] = useState<PapanKelas | null>(null);
  const [pesan, setPesan] = useState('');
  const [memuat, setMemuat] = useState(false);

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !id) return;
    try {
      setPapan(await papanKelas(opsi, id));
      setPesan('');
    } catch (e) {
      setPesan(pesanGalatStaf(e));
    }
  }, [repo, id]);

  // Muat lewat pewaktu: data datang dari server (sistem luar), bukan diturunkan dari keadaan layar.
  useEffect(() => {
    const t = setTimeout(muat, 0);
    return () => clearTimeout(t);
  }, [muat]);

  const selesai = async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !id) return;
    setMemuat(true);
    try {
      await catatPantauan(opsi, id);
      await muat();
    } catch (e) {
      setPesan(pesanGalatStaf(e));
    }
    setMemuat(false);
  };

  const sekarang = new Date();
  const anak = papan ? urutkanPapan(papan.anak, sekarang) : [];
  const pantau = hariPantau(sekarang);

  return (
    <LatarStaf judul={papan?.kelas.nama ?? 'Papan kelas'}>
      {papan ? (
        <KotakStaf>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 2 }}>
              <TeksStaf redup>Kode kelas untuk orang tua</TeksStaf>
              <Text selectable style={{ fontFamily: huruf.judulTebal, fontSize: 30, letterSpacing: 3, color: warna.teks }}>
                {formatKodeKelas(papan.kelas.kode)}
              </Text>
            </View>
            <TeksStaf redup>
              {papan.anak.length} dari {papan.kelas.kapasitas} anak
            </TeksStaf>
          </View>
          {papan.pantauanHariIni ? (
            <TeksStaf tebal>Pantauan hari ini sudah selesai ✓</TeksStaf>
          ) : (
            <>
              <TeksStaf redup>{pantau ? 'Hari ini hari pantauan (Senin, Rabu, Jumat).' : 'Hari ini bukan hari pantauan, tetapi pantauan tetap boleh dicatat.'}</TeksStaf>
              <Tombol label="Pantauan selesai" ortu memuat={memuat} onPress={selesai} />
            </>
          )}
        </KotakStaf>
      ) : null}

      {papan && anak.length === 0 ? (
        <KotakStaf>
          <TeksStaf>Belum ada anak di kelas ini. Bagikan kode kelas di atas kepada orang tua.</TeksStaf>
        </KotakStaf>
      ) : null}

      {anak.map((a) => {
        const penanda = penandaAnak(a, sekarang);
        const hewan = HEWAN[a.hewan as HewanProfil];
        const sisa = sisaHariCoba(a.cobaSampai, sekarang);
        return (
          <Pressable
            key={a.anakId}
            accessibilityRole="button"
            accessibilityLabel={`Catatan dan tugas untuk ${a.nama}`}
            onPress={() => router.push({ pathname: '/staf/anak', params: { kelas: id, anak: a.anakId } })}
          >
            <KotakStaf>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 26 }}>{hewan?.emoji ?? '🙂'}</Text>
                <View style={{ flex: 1 }}>
                  <JudulKotak>
                    {a.nama} · Kelas {a.kelas}
                  </JudulKotak>
                  <TeksStaf redup>
                    Paket {PAKET[a.paket].nama}
                    {sisa > 0 ? ` · Masa coba ${sisa} hari lagi` : ''}
                  </TeksStaf>
                </View>
              </View>
              {penanda.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {penanda.map((p) => (
                    <Penanda key={p} label={NAMA_PENANDA[p].label} warnaTeks={NAMA_PENANDA[p].warna} latar={NAMA_PENANDA[p].latar} />
                  ))}
                </View>
              ) : null}
              <TeksStaf>
                Latihan {a.hariLatihan7} dari 7 hari terakhir · terakhir {lamaHari(a.terakhirLatihan, sekarang)}
              </TeksStaf>
              {a.topikLemah.length ? <TeksStaf>Topik lemah: {a.topikLemah.map((t) => `${namaTopik(t.mapel, t.topik)} (${t.persen}%)`).join(', ')}</TeksStaf> : null}
              <TeksStaf redup>
                Catatan terakhir {lamaHari(a.catatanTerakhir, sekarang)} · {a.tugasTerbuka} tugas belum selesai
              </TeksStaf>
            </KotakStaf>
          </Pressable>
        );
      })}
      <PesanGalat teks={pesan} />
      <Tombol label="Muat ulang" ortu varian="garis" onPress={muat} />
    </LatarStaf>
  );
}
