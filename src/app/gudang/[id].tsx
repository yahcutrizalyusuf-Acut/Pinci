/** B02/K23 Kartu ilmu: Kenali (bergambar, bersuara) → 2 contoh jadi → 5–10 soal berjenjang dengan kunci bertahap. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { buatId, kiniMs, sekarangIso } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { cocokIsian, MAPEL_GUDANG } from '@/fitur/gudang';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import { paketGudang } from '@/isi/gudang/paket';
import { ambilKartu } from '@/isi/gudang/pemuat';
import { mainkanBunyi } from '@/layanan/bunyi';
import { GambarIlmu } from '@/komponen/GambarIlmu';
import { KepalaLayar, KotakPetunjuk, PapanAngka, Tombol, TombolSuara } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';
import { TeksKaya } from '@/komponen/tka/TeksKaya';

type Tahap = 'kenali' | 'contoh' | 'latihan' | 'selesai';

export default function KartuIlmuLayar() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const dampingi = mode === 'dampingi';
  const router = useRouter();
  const { repo, anakAktif, keluarga } = useData();
  const ambil = ambilKartu(paketGudang, id);
  const [tahap, setTahap] = useState<Tahap>('kenali');
  const [bagianKe, setBagianKe] = useState(0);
  const [contohKe, setContohKe] = useState(0);
  const [soalKe, setSoalKe] = useState(0);
  const [jawab, setJawab] = useState('');
  const [petunjuk, setPetunjuk] = useState(0);
  const [hasilSoal, setHasilSoal] = useState<null | 'benar' | 'salah'>(null);
  const [coba, setCoba] = useState(0);
  const [skor, setSkor] = useState({ benar: 0, salah: 0, petunjuk: 0 });
  const jawaban = useRef<{ soal: string; kunci: string; jawaban: string; benar: boolean; petunjuk: number }[]>([]);
  const mulai = useRef(0);
  useHitungWaktu('belajar', false, dampingi ? 'dampingi' : 'sendiri');

  useEffect(() => {
    mulai.current = kiniMs();
    if (anakAktif && !dampingi)
      cekBelajar(repo, anakAktif).then((s) => {
        const r = ruteHalangan(s);
        if (r) router.replace(r);
      });
  }, [repo, anakAktif, dampingi, router]);

  if (!ambil || !anakAktif) return null;
  const { kartu, topik, mapel } = ambil;
  const w = warnaMapel[mapel];
  const langkahKe = ['kenali', 'contoh', 'latihan'].indexOf(tahap);
  const soal = kartu.soal[soalKe];

  const periksa = (j: string) => {
    if (!soal || hasilSoal) return;
    const ok = cocokIsian(soal, j);
    if (ok) {
      mainkanBunyi(repo, anakAktif.id, 'ting');
      jawaban.current.push({ soal: soal.pertanyaan, kunci: soal.kunci, jawaban: j, benar: coba === 0, petunjuk });
      setHasilSoal('benar');
      return;
    }
    if (coba === 0) {
      setCoba(1);
      setPetunjuk(Math.max(1, petunjuk));
      setJawab('');
      return;
    }
    jawaban.current.push({ soal: soal.pertanyaan, kunci: soal.kunci, jawaban: j, benar: false, petunjuk: Math.max(petunjuk, 1) });
    setHasilSoal('salah');
  };

  const soalBerikut = async () => {
    if (soalKe + 1 < kartu.soal.length) {
      setSoalKe(soalKe + 1);
      setJawab('');
      setPetunjuk(0);
      setHasilSoal(null);
      setCoba(0);
      return;
    }
    const benar = jawaban.current.filter((x) => x.benar).length;
    const salah = jawaban.current.length - benar;
    const pakaiPetunjuk = jawaban.current.filter((x) => x.petunjuk > 0).length;
    setSkor({ benar, salah, petunjuk: pakaiPetunjuk });
    await repo.simpanSesi(
      { id: buatId(), anak_id: anakAktif.id, jenis: 'kartu', mode: dampingi ? 'dampingi' : 'sendiri', kelas: anakAktif.kelas, rujukan: topik.id, mulai: new Date(mulai.current).toISOString(), selesai: sekarangIso(), durasiDetik: Math.round((kiniMs() - mulai.current) / 1000), benar, jumlah: jawaban.current.length },
      jawaban.current.map((x, k) => ({ urutan: k + 1, soal: x.soal.slice(0, 160), kunci: x.kunci, jawaban: x.jawaban, benar: x.benar, detik: 0, hapusN: 0, topik: topik.id, petunjukDipakai: x.petunjuk })),
    );
    if (!dampingi) await repo.catatTopik(anakAktif.id, MAPEL_GUDANG, topik.id, benar, salah, pakaiPetunjuk);
    mainkanBunyi(repo, anakAktif.id, 'pesta');
    setTahap('selesai');
  };

  let isi: React.ReactNode;
  let tombol: React.ReactNode;
  if (tahap === 'kenali') {
    const b = kartu.penjelasan[bagianKe];
    isi = (
      <View style={{ backgroundColor: warna.putih, borderRadius: 24, padding: 18, gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TeksKaya teks={b.teks} ukuran={20} />
          </View>
          <TombolSuara teks={b.teks} />
        </View>
        {b.gambar ? <GambarIlmu g={b.gambar} /> : null}
        <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>
          {bagianKe + 1} dari {kartu.penjelasan.length}
        </Text>
      </View>
    );
    tombol = (
      <Tombol
        label="Lanjut"
        besar
        onPress={() => {
          if (bagianKe + 1 < kartu.penjelasan.length) setBagianKe(bagianKe + 1);
          else setTahap('contoh');
        }}
      />
    );
  } else if (tahap === 'contoh') {
    const c = kartu.contohJadi[contohKe];
    isi = (
      <View style={{ backgroundColor: warna.putih, borderRadius: 24, padding: 18, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 17, color: w.teks }}>
            Contoh {contohKe + 1} dari {kartu.contohJadi.length}
          </Text>
          <TombolSuara teks={`${c.soal}. ${c.langkah.join('. ')}. Jawabannya ${c.jawaban}.`} ukuran={38} />
        </View>
        <TeksKaya teks={c.soal} ukuran={18} />
        {c.langkah.map((l, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: w.muda, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: w.teks }}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TeksKaya teks={l} ukuran={17} />
            </View>
          </View>
        ))}
        <View style={{ backgroundColor: warna.hijauMuda, borderRadius: 12, padding: 10 }}>
          <TeksKaya teks={`Jawaban: ${c.jawaban}`} ukuran={17} warnaTeks={warna.hijauTua} />
        </View>
      </View>
    );
    tombol = (
      <Tombol
        label={contohKe + 1 < kartu.contohJadi.length ? 'Contoh berikutnya' : 'Mulai latihan'}
        besar
        onPress={() => {
          if (contohKe + 1 < kartu.contohJadi.length) setContohKe(contohKe + 1);
          else setTahap('latihan');
        }}
      />
    );
  } else if (tahap === 'latihan' && soal) {
    isi = (
      <View style={{ gap: 12 }}>
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: w.teks }}>
          Soal {soalKe + 1} dari {kartu.soal.length} · {soal.tingkat}
        </Text>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 10 }}>
          {soal.bacaan ? <TeksKaya teks={soal.bacaan} ukuran={16} warnaTeks={warna.teksKedua} /> : null}
          {soal.gambar ? <GambarIlmu g={soal.gambar} /> : null}
          <TeksKaya teks={soal.pertanyaan} ukuran={19} />
        </View>
        {soal.bentuk === 'pg' ? (
          <View style={{ gap: 10 }}>
            {(soal.pilihan ?? []).map((p) => {
              const kunciIni = hasilSoal && p === soal.kunci;
              const dipilih = jawab === p;
              return (
                <Pressable
                  key={p}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: dipilih }}
                  disabled={!!hasilSoal}
                  onPress={() => {
                    setJawab(p);
                    periksa(p);
                  }}
                  style={{ minHeight: 56, borderRadius: 16, borderWidth: 2, padding: 12, justifyContent: 'center', borderColor: kunciIni ? warna.hijauSegar : dipilih ? (hasilSoal ? warna.oranye : '#3A86FF') : warna.kremBatang, backgroundColor: kunciIni ? warna.hijauMuda : warna.putih }}
                >
                  <TeksKaya teks={p} ukuran={18} />
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <View style={{ minWidth: 160, height: 72, borderRadius: 18, borderWidth: 3, borderColor: hasilSoal === 'salah' ? warna.oranye : warna.hijauDaun, backgroundColor: warna.putih, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
              <Text style={{ fontFamily: huruf.anak, fontSize: 36, color: hasilSoal === 'salah' ? warna.hijauTua : jawab ? warna.teks : '#C9C0AE' }}>{hasilSoal === 'salah' ? soal.kunci : jawab || '?'}</Text>
            </View>
          </View>
        )}
        {coba > 0 && !hasilSoal ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: '#B86E00' }}>Belum tepat. Lihat petunjuknya, lalu coba lagi.</Text> : null}
        {!hasilSoal ? soal.petunjuk.slice(0, petunjuk).map((p, k) => <KotakPetunjuk key={k} teks={`${k + 1}/3 · ${p}`} />) : null}
        {hasilSoal ? (
          <View style={{ backgroundColor: hasilSoal === 'benar' ? warna.hijauMuda : '#FFF4E5', borderRadius: 16, padding: 14, gap: 4 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: hasilSoal === 'benar' ? warna.hijauTua : '#B86E00' }}>{hasilSoal === 'benar' ? 'Betul! ✓' : `Hampir! Jawabannya ${soal.kunci}.`}</Text>
            <TeksKaya teks={soal.pembahasan} ukuran={15} />
          </View>
        ) : null}
      </View>
    );
    tombol = hasilSoal ? (
      <Tombol label={soalKe + 1 < kartu.soal.length ? 'Soal berikutnya' : 'Selesai'} besar onPress={soalBerikut} />
    ) : soal.bentuk === 'isian' ? (
      <View style={{ gap: 10 }}>
        <Tombol label={`Petunjuk ${Math.min(petunjuk + 1, 3)}/3`} ikon="lampu" varian="putih" ortu nonaktif={petunjuk >= 3} onPress={() => setPetunjuk(Math.min(3, petunjuk + 1))} />
        <PapanAngka tombolTambahan={[',', '/']} cekNonaktif={!jawab} onAngka={(a) => jawab.length < 9 && setJawab(jawab + a)} onHapus={() => setJawab(jawab.slice(0, -1))} onCek={() => periksa(jawab)} />
      </View>
    ) : (
      <Tombol label={`Petunjuk ${Math.min(petunjuk + 1, 3)}/3`} ikon="lampu" varian="putih" besar nonaktif={petunjuk >= 3} onPress={() => setPetunjuk(Math.min(3, petunjuk + 1))} />
    );
  } else {
    isi = (
      <View style={{ alignItems: 'center', gap: 14, paddingTop: 24 }}>
        <Pinci ekspresi="merayakan" ukuran={130} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 32, color: warna.hijauTua }}>Kartu selesai!</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks, textAlign: 'center' }}>
          Langsung tepat {skor.benar} dari {skor.benar + skor.salah} soal.
        </Text>
        {topik.bersamaOrtu && kartu.petunjukOrtu ? (
          <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14, alignSelf: 'stretch' }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: '#B86E00' }}>Lebih seru bersama {keluarga?.sapaanOrtu ?? 'Ayah'}</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>{kartu.petunjukOrtu}</Text>
          </View>
        ) : null}
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Tersimpan ✓</Text>
      </View>
    );
    tombol = <Tombol label="Kembali ke Gudang Ilmu" besar onPress={() => router.replace('/anak/gudang')} />;
  }

  return (
    <Layar bawah={<View style={{ padding: 16 }}>{tombol}</View>}>
      <KepalaLayar judul={topik.judul} />
      {tahap !== 'selesai' ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Kenali', 'Contoh', 'Latihan'].map((l, n) => (
            <View key={l} style={{ flex: 1, gap: 4 }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: n <= langkahKe ? w.utama : warna.kremBatang }} />
              <Text style={{ fontFamily: huruf.anak, fontSize: 13, color: warna.teksKedua, textAlign: 'center' }}>{l}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>{isi}</ScrollView>
    </Layar>
  );
}
