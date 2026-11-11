/**
 * Cek Dengar setiap 4 unit (rancangan `12` E7): 8 soal dengar-lalu-pilih dari kata 4 unit terakhir, susunan tetap,
 * hasilnya masuk rapor. Disimpan sebagai sesi `inggris` dengan tambahan.cekDengar = true. Tanpa skor merah.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { buatId, kiniMs, sekarangIso } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { acak, cariKata } from '@/fitur/inggris';
import { rujukanCekDengar, soalCekDengar } from '@/fitur/komik';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import type { Kosakata } from '@/isi/inggris/jenis';
import { PAKET_INGGRIS } from '@/isi/inggris/paket';
import { mainkanBunyi } from '@/layanan/bunyi';
import { ucapkan } from '@/layanan/suara';
import { buatAcak } from '@/mesin/lancar';
import { KepalaLayar, Tombol, TombolSuara } from '@/komponen/dasar';
import { KartuGambar } from '@/komponen/KartuGambar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

const UNGU = warnaMapel.ing;

export default function CekDengar() {
  const { ke: keParam } = useLocalSearchParams<{ ke?: string }>();
  const ke = Math.max(1, Math.min(3, Number(keParam) || 1));
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const tingkat = anak.tingkatInggris ?? 3;
  const paket = PAKET_INGGRIS[tingkat];
  const soal = useMemo(() => soalCekDengar(paket, ke), [paket, ke]);
  const [i, setI] = useState(0);
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [salahKe, setSalahKe] = useState(0);
  const [selesai, setSelesai] = useState<{ benar: number; jumlah: number } | null>(null);
  const hasil = useRef<{ kataId: string; benar: boolean }[]>([]);
  const mulai = useRef(0);
  useHitungWaktu('belajar');

  useEffect(() => {
    mulai.current = kiniMs();
    cekBelajar(repo, anak).then((s) => {
      const r = ruteHalangan(s);
      if (r) router.replace(r);
    });
    if (soal[0]) setTimeout(() => ucapkan(soal[0].ucapan, 'en-US'), 400);
  }, [repo, anak, router, soal]);

  const simpan = async () => {
    const benar = hasil.current.filter((h) => h.benar).length;
    setSelesai({ benar, jumlah: hasil.current.length });
    await repo.simpanSesi(
      { id: buatId(), anak_id: anak.id, jenis: 'inggris', mode: 'sendiri', kelas: anak.kelas, level: ke, rujukan: rujukanCekDengar(tingkat, ke), mulai: new Date(mulai.current).toISOString(), selesai: sekarangIso(), durasiDetik: Math.round((kiniMs() - mulai.current) / 1000), benar, jumlah: hasil.current.length, tambahan: { tingkat, cekDengar: true, ke } },
      hasil.current.map((h, k) => ({ urutan: k + 1, soal: cariKata(paket, h.kataId)?.kata ?? h.kataId, butirId: h.kataId, kunci: cariKata(paket, h.kataId)?.kata ?? '', jawaban: '', benar: h.benar, detik: 0, hapusN: 0, topik: rujukanCekDengar(tingkat, ke) })),
    );
    mainkanBunyi(repo, anak.id, 'pesta');
  };

  if (selesai) {
    return (
      <Layar bawah={<View style={{ padding: 16 }}><Tombol label="Kembali ke daftar unit" besar onPress={() => router.replace('/inggris')} /></View>}>
        <KepalaLayar judul={`Cek Dengar ${ke}`} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Pinci ekspresi="merayakan" ukuran={120} />
          <Text style={{ fontFamily: huruf.judul, fontSize: 30, color: warna.hijauTua }}>Selesai!</Text>
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks, textAlign: 'center' }}>Telingamu makin terlatih. Langsung tepat: {selesai.benar} dari {selesai.jumlah}.</Text>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Tersimpan ✓</Text>
        </View>
      </Layar>
    );
  }

  const d = soal[i];
  if (!d) return null;
  const kunci = cariKata(paket, d.kunci);
  const pilihanKata = acak([d.kunci, ...d.pengecoh], buatAcak(`cek-${d.id}`))
    .map((id) => cariKata(paket, id))
    .filter((k): k is Kosakata => !!k);
  const sudahBenar = pilihan === d.kunci;
  return (
    <Layar
      bawah={
        <View style={{ padding: 16 }}>
          <Tombol
            label={i + 1 < soal.length ? 'Soal berikutnya' : 'Selesai'}
            besar
            nonaktif={!sudahBenar}
            onPress={() => {
              if (i + 1 < soal.length) {
                setI(i + 1);
                setPilihan(null);
                setSalahKe(0);
                setTimeout(() => ucapkan(soal[i + 1].ucapan, 'en-US'), 250);
              } else simpan();
            }}
          />
        </View>
      }
    >
      <KepalaLayar judul={`Cek Dengar ${ke}`} />
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: UNGU.teks, marginTop: -14, marginLeft: 52 }}>
        Soal {i + 1} dari {soal.length} · Tingkat {tingkat}
      </Text>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <TombolSuara teks={d.ucapan} bahasa="en-US" ukuran={84} latar={UNGU.utama} warnaIkon="#FFFFFF" />
        <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teksKedua }}>Dengar, lalu pilih gambarnya.</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {pilihanKata.map((k) => (
          <View key={k.id} style={{ width: pilihanKata.length > 3 ? '47%' : '30%' }}>
            <KartuGambar
              emoji={k.emoji}
              aksesLabel={k.arti}
              keadaan={sudahBenar && k.id === d.kunci ? 'benar' : pilihan === k.id && !sudahBenar ? 'keliru' : 'biasa'}
              onPress={
                sudahBenar
                  ? undefined
                  : () => {
                      setPilihan(k.id);
                      if (k.id === d.kunci) {
                        mainkanBunyi(repo, anak.id, 'ting');
                        hasil.current.push({ kataId: d.kunci, benar: salahKe === 0 });
                      } else {
                        setSalahKe(salahKe + 1);
                        setTimeout(() => ucapkan(d.ucapan, 'en-US'), 500);
                      }
                    }
              }
            />
          </View>
        ))}
      </View>
      {sudahBenar && kunci ? (
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua }}>
          Betul! ✓ {kunci.kata} = {kunci.arti}.
        </Text>
      ) : pilihan && kunci ? (
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: '#B86E00' }}>{salahKe >= 2 ? `Petunjuk: carilah gambar ${kunci.arti}.` : 'Hampir! Dengar sekali lagi, yuk.'}</Text>
      ) : null}
    </Layar>
  );
}
