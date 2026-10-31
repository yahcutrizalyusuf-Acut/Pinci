/** Satu anak di papan kelas: tulis catatan untuk orang tua dan beri tugas latihan untuk anak. */
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import type { JenisTugas } from '@/data/jenis';
import {
  batalkanTugas,
  beriTugas,
  daftarCatatanAnak,
  daftarTugasAnak,
  kirimCatatan,
  opsiStaf,
  papanKelas,
  type AnakPapan,
  type CatatanStaf,
  type TugasStaf,
} from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { MAPEL_TUGAS, NAMA_TUGAS, contohCatatan } from '@/fitur/kelas';
import { namaTopik } from '@/fitur/nama-topik';
import { lamaHari } from '@/fitur/staf';
import { Tombol } from '@/komponen/dasar';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

const BATAS_CATATAN = 600;

export default function AnakStaf() {
  const { kelas, anak } = useLocalSearchParams<{ kelas: string; anak: string }>();
  const { repo } = useData();
  const [info, setInfo] = useState<AnakPapan | null>(null);
  const [catatan, setCatatan] = useState<CatatanStaf[]>([]);
  const [tugas, setTugas] = useState<TugasStaf[]>([]);
  const [isi, setIsi] = useState('');
  const [jenis, setJenis] = useState<JenisTugas>('lancar');
  const [judul, setJudul] = useState(`Latihan ${NAMA_TUGAS.lancar}`);
  const [rujukan, setRujukan] = useState('');
  const [pesanTugas, setPesanTugas] = useState('');
  const [galat, setGalat] = useState('');
  const [berhasil, setBerhasil] = useState('');
  const [memuat, setMemuat] = useState<'catatan' | 'tugas' | null>(null);

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !kelas || !anak) return;
    try {
      const [p, c, t] = await Promise.all([papanKelas(opsi, kelas), daftarCatatanAnak(opsi, kelas, anak), daftarTugasAnak(opsi, kelas, anak)]);
      setInfo(p.anak.find((a) => a.anakId === anak) ?? null);
      setCatatan(c);
      setTugas(t);
      setGalat('');
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  }, [repo, kelas, anak]);

  // Muat lewat pewaktu: data datang dari server (sistem luar), bukan diturunkan dari keadaan layar.
  useEffect(() => {
    const t = setTimeout(muat, 0);
    return () => clearTimeout(t);
  }, [muat]);

  const kirimIsi = async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !kelas || !anak) return;
    setMemuat('catatan');
    setBerhasil('');
    try {
      await kirimCatatan(opsi, { kelasId: kelas, anakId: anak, isi });
      setIsi('');
      setBerhasil('Catatan terkirim ke orang tua.');
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
    setMemuat(null);
  };

  const kirimTugas = async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !kelas || !anak) return;
    setMemuat('tugas');
    setBerhasil('');
    try {
      await beriTugas(opsi, { kelasId: kelas, anakId: anak, jenis, judul, rujukan, pesan: pesanTugas });
      setPesanTugas('');
      setRujukan('');
      setBerhasil('Tugas terkirim. Anak melihatnya di beranda.');
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
    setMemuat(null);
  };

  const batal = async (id: string) => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      await batalkanTugas(opsi, id);
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  };

  const pilihJenis = (j: JenisTugas) => {
    setJenis(j);
    setRujukan('');
    setJudul(`Latihan ${NAMA_TUGAS[j]}`);
  };
  const topikJenis = (info?.topikLemah ?? []).filter((t) => t.mapel === MAPEL_TUGAS[jenis]);
  const jenisBoleh: JenisTugas[] = info?.paket === 'siap_tka' ? ['lancar', 'baca', 'tka', 'kartu', 'inggris'] : info?.paket === 'lengkap' ? ['lancar', 'baca', 'kartu', 'inggris'] : ['lancar', 'baca'];

  return (
    <LatarStaf judul={info ? `${info.nama} · Kelas ${info.kelas}` : 'Anak'}>
      {info ? (
        <KotakStaf>
          <TeksStaf>
            Latihan {info.hariLatihan7} dari 7 hari terakhir · terakhir {lamaHari(info.terakhirLatihan)}
          </TeksStaf>
          {info.topikLemah.length ? <TeksStaf>Topik lemah: {info.topikLemah.map((t) => `${namaTopik(t.mapel, t.topik)} (${t.persen}%)`).join(', ')}</TeksStaf> : <TeksStaf redup>Belum ada topik lemah.</TeksStaf>}
        </KotakStaf>
      ) : null}

      <KotakStaf>
        <JudulKotak>Catatan untuk orang tua</JudulKotak>
        <TeksStaf redup>Isi: yang sudah baik, yang perlu dibantu, dan satu saran. Pilih contoh lalu sesuaikan.</TeksStaf>
        {info ? (
          <View style={{ gap: 6 }}>
            {contohCatatan(info).map((c) => (
              <Pressable key={c} accessibilityRole="button" onPress={() => setIsi((x) => (x ? `${x} ${c}` : c).slice(0, BATAS_CATATAN))} style={{ padding: 10, borderRadius: 12, backgroundColor: warna.abuTerang }}>
                <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teks }}>+ {c}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <IsianStaf label={`Catatan (${isi.length}/${BATAS_CATATAN})`} value={isi} onChangeText={(t) => setIsi(t.slice(0, BATAS_CATATAN))} multiline />
        <Tombol label="Kirim catatan" ortu memuat={memuat === 'catatan'} nonaktif={isi.trim().length < 5} onPress={kirimIsi} />
      </KotakStaf>

      <KotakStaf>
        <JudulKotak>Tugas untuk anak</JudulKotak>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {jenisBoleh.map((j) => (
            <Pil key={j} label={NAMA_TUGAS[j]} aktif={jenis === j} onPress={() => pilihJenis(j)} />
          ))}
        </View>
        {topikJenis.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {topikJenis.map((t) => (
              <Pil
                key={t.topik}
                label={`Ulang ${namaTopik(t.mapel, t.topik)}`}
                aktif={rujukan === t.topik}
                warnaAktif={warna.oranyeTua}
                onPress={() => {
                  setRujukan(t.topik);
                  setJudul(`Ulang ${namaTopik(t.mapel, t.topik)}`.slice(0, 80));
                }}
              />
            ))}
          </View>
        ) : null}
        <IsianStaf label="Judul tugas (dibaca anak)" value={judul} onChangeText={(t) => setJudul(t.slice(0, 80))} />
        <IsianStaf label="Pesan singkat untuk anak (boleh kosong)" value={pesanTugas} onChangeText={(t) => setPesanTugas(t.slice(0, 200))} placeholder="Contoh: Pelan-pelan saja, ya." />
        <TeksStaf redup>Tugas selesai otomatis saat anak mengerjakan latihan yang cocok.</TeksStaf>
        <Tombol label="Kirim tugas" ortu memuat={memuat === 'tugas'} nonaktif={judul.trim().length < 3} onPress={kirimTugas} />
      </KotakStaf>

      {berhasil ? <TeksStaf tebal>{berhasil}</TeksStaf> : null}
      <PesanGalat teks={galat} />

      <KotakStaf>
        <JudulKotak>Tugas yang sudah diberi</JudulKotak>
        {tugas.length === 0 ? <TeksStaf redup>Belum ada.</TeksStaf> : null}
        {tugas.map((t) => (
          <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <View style={{ flex: 1 }}>
              <TeksStaf tebal>{t.judul}</TeksStaf>
              <TeksStaf redup>{t.selesai ? `Selesai ${lamaHari(t.selesai)} ✓` : `Diberi ${lamaHari(t.dibuat)} · belum selesai`}</TeksStaf>
            </View>
            {!t.selesai ? (
              <Pressable accessibilityRole="button" accessibilityLabel={`Batalkan tugas ${t.judul}`} onPress={() => batal(t.id)} style={{ padding: 8 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: '#C0392B' }}>Batalkan</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </KotakStaf>

      <KotakStaf>
        <JudulKotak>Catatan yang sudah dikirim</JudulKotak>
        {catatan.length === 0 ? <TeksStaf redup>Belum ada.</TeksStaf> : null}
        {catatan.map((c) => (
          <View key={c.id} style={{ gap: 2, paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <TeksStaf redup>
              {lamaHari(c.waktu)} · {c.dibaca ? 'sudah dibaca orang tua ✓' : 'belum dibaca'}
            </TeksStaf>
            <TeksStaf>{c.isi}</TeksStaf>
          </View>
        ))}
      </KotakStaf>
    </LatarStaf>
  );
}
