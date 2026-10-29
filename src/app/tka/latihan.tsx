/**
 * K14 Soal TKA dengan petunjuk bertahap 1/3, 2/3, 3/3 dan penjelasan pengecoh sesudah menjawab.
 * Salah pertama → petunjuk, coba lagi. Salah kedua → jawaban dan langkah ditampilkan (06-persiapan-tka.md bagian 5).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { titip } from '@/fitur/sementara';
import { alasanUntukAnak } from '@/fitur/teks-anak';
import { petunjukBertahap, simpanLatihanTka, soalSesi, type JawabanTka } from '@/fitur/tka';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import { ambilTopik, penyebabSalah, periksaJawaban, type JawabanAnak } from '@/isi/tka/pemuat';
import { paketTka } from '@/isi/tka/paket';
import { mainkanBunyi } from '@/layanan/bunyi';
import { BilahKemajuan, KotakPetunjuk, TombolKecil, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { jawabanKosong, jawabanLengkap, PilihJawaban } from '@/komponen/tka/PilihJawaban';
import { Stimulus } from '@/komponen/tka/Stimulus';
import { TeksKaya, teksBaca } from '@/komponen/tka/TeksKaya';

export default function LatihanTka() {
  const { topik: idTopik, rumah, mode } = useLocalSearchParams<{ topik: string; rumah?: string; mode?: string }>();
  const dampingi = mode === 'dampingi';
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const topik = ambilTopik(paketTka, idTopik);
  const soal = useMemo(() => soalSesi(idTopik, rumah === '1'), [idTopik, rumah]);
  const [i, setI] = useState(0);
  const [jawab, setJawab] = useState<JawabanAnak>(() => (soal[0] ? jawabanKosong(soal[0]) : ''));
  const [percobaan, setPercobaan] = useState(0);
  const [tahap, setTahap] = useState(0);
  const [selesaiSoal, setSelesaiSoal] = useState<null | 'benar' | 'salah'>(null);
  const [coba, setCoba] = useState(false);
  const hasil = useRef<JawabanTka[]>([]);
  const mulai = useRef(0);
  const mulaiSoal = useRef(0);
  useHitungWaktu('belajar', false, dampingi ? 'dampingi' : 'sendiri');

  useEffect(() => {
    mulai.current = kiniMs();
    mulaiSoal.current = kiniMs();
    if (anakAktif && !dampingi) cekBelajar(repo, anakAktif).then((s) => {
      const r = ruteHalangan(s);
      if (r) router.replace(r);
    });
  }, [repo, anakAktif, dampingi, router]);

  const b = soal[i];
  if (!topik || !anakAktif) return null;
  if (!b) {
    return (
      <Layar>
        <Text style={{ fontFamily: huruf.anak }}>Belum ada soal untuk topik ini.</Text>
        <Tombol label="Kembali" onPress={() => router.back()} />
      </Layar>
    );
  }
  const w = warnaMapel[topik.mapel];
  const petunjuk = petunjukBertahap(b);
  const sebab = selesaiSoal === 'salah' ? penyebabSalah(b, jawab) : [];

  const cek = (j: JawabanAnak = jawab) => {
    if (!jawabanLengkap(b, j) || selesaiSoal) return;
    const ok = periksaJawaban(b, j);
    if (ok) {
      mainkanBunyi(repo, anakAktif.id, 'ting');
      hasil.current.push({ butir: b, jawaban: j, detik: (kiniMs() - mulaiSoal.current) / 1000, petunjuk: tahap, benarPertama: percobaan === 0 });
      setSelesaiSoal('benar');
      return;
    }
    if (percobaan === 0) {
      setPercobaan(1);
      setTahap(Math.max(tahap, 1));
      setCoba(true);
      return;
    }
    hasil.current.push({ butir: b, jawaban: j, detik: (kiniMs() - mulaiSoal.current) / 1000, petunjuk: Math.max(tahap, 1), benarPertama: false });
    setSelesaiSoal('salah');
  };

  const berikut = async () => {
    if (i + 1 >= soal.length) {
      const sesi = await simpanLatihanTka(
        repo,
        anakAktif,
        { jenis: 'tka', rujukan: topik.id + (rumah === '1' ? '-rumah' : ''), mode: dampingi ? 'dampingi' : 'sendiri', mulai: mulai.current, halaman: topik.id },
        hasil.current,
      );
      titip('akhir-tka', { sesi, judul: topik.judul, mapel: topik.mapel });
      router.replace('/tka/akhir');
      return;
    }
    setI(i + 1);
    setJawab(jawabanKosong(soal[i + 1]));
    setPercobaan(0);
    setTahap(0);
    setSelesaiSoal(null);
    setCoba(false);
    mulaiSoal.current = kiniMs();
  };

  return (
    <Layar
      bawah={
        <View style={{ flexDirection: 'row', gap: 10, padding: 16 }}>
          {!selesaiSoal ? (
            <>
              <Tombol
                label={`Petunjuk ${Math.min(tahap + 1, 3)}/3`}
                ikon="lampu"
                varian="putih"
                nonaktif={tahap >= 3}
                style={{ flex: 1 }}
                onPress={() => setTahap(Math.min(3, tahap + 1))}
              />
              {b.bentuk !== 'pg' ? <Tombol label="Cek" style={{ flex: 1 }} nonaktif={!jawabanLengkap(b, jawab)} onPress={() => cek()} /> : null}
            </>
          ) : (
            <Tombol label={i + 1 >= soal.length ? 'Selesai' : 'Soal berikutnya'} style={{ flex: 1 }} onPress={berikut} />
          )}
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TombolKecil label="Jeda" ikon="jeda" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ backgroundColor: '#3A86FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontFamily: huruf.anakTebal, color: '#FFFFFF' }}>TKA</Text>
          </View>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: w.teks }}>{w.nama}</Text>
        </View>
      </View>
      <BilahKemajuan nilai={i} maks={soal.length} label={`${i + 1} / ${soal.length}`} />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        <View style={{ backgroundColor: warna.putih, borderRadius: 20, overflow: 'hidden' }}>
          <View style={{ height: 6, backgroundColor: w.utama }} />
          <View style={{ padding: 16, gap: 12 }}>
            {b.stimulus ? <Stimulus bagian={b.stimulus} /> : null}
            <TeksKaya teks={b.pertanyaan} ukuran={19} />
          </View>
        </View>
        <PilihJawaban
          butir={b}
          jawaban={jawab}
          tampilKunci={selesaiSoal !== null}
          onUbah={(j) => {
            setJawab(j);
            setCoba(false);
            if (b.bentuk === 'pg') cek(j);
          }}
        />
        {coba && !selesaiSoal ? (
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: '#B86E00' }}>Belum tepat. Baca petunjuknya, lalu coba lagi.</Text>
        ) : null}
        {!selesaiSoal && tahap > 0 ? petunjuk.slice(0, tahap).map((p, k) => <KotakPetunjuk key={k} teks={`${k + 1}/3 · ${teksBaca(p)}`} />) : null}
        {selesaiSoal === 'benar' ? (
          <View style={{ backgroundColor: warna.hijauMuda, borderRadius: 16, padding: 14, gap: 4 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.hijauTua }}>Betul! ✓</Text>
            {b.pembahasan ? <TeksKaya teks={b.pembahasan} ukuran={15} /> : null}
          </View>
        ) : null}
        {selesaiSoal === 'salah' ? (
          <View style={{ backgroundColor: '#FFF4E5', borderRadius: 16, padding: 14, gap: 6 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: '#B86E00' }}>Hampir! Jawabannya {typeof b.kunci === 'string' ? b.kunci : b.bentuk === 'pgk' ? b.kunci.join(', ') : 'yang ditandai hijau'}.</Text>
            {sebab.map((s) => (
              <TeksKaya key={s.pilihan} teks={`${s.pilihan}: ${alasanUntukAnak(s.alasan)}`} ukuran={15} warnaTeks={warna.teksKedua} />
            ))}
            {b.pembahasan ? <TeksKaya teks={`Langkah: ${b.pembahasan}`} ukuran={15} /> : null}
          </View>
        ) : null}
      </ScrollView>
    </Layar>
  );
}
