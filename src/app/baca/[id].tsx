/**
 * B03 / K16–K18 Baca Ulang: baca dingin (tombol mulai–selesai) → dengar contoh (kata disorot) → baca lagi → jawab pertanyaan.
 * Mode Dampingi (D6 Dengar Bacaan): orang tua mengetuk kata yang tersandung saat anak membaca nyaring.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { buatId, kiniMs, sekarangIso } from '@/data/alat';
import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { hitungKpm, patokanKpm, pecahKata, rekorKpm, terlaluCepat } from '@/fitur/baca';
import { perbaruiInti } from '@/fitur/hari-ini';
import { cekBelajar, ruteHalangan, useHitungWaktu } from '@/fitur/waktu';
import { ambilTeks, periksaJawaban, type JawabanAnak } from '@/isi/tka/pemuat';
import { paketTka } from '@/isi/tka/paket';
import { mainkanBunyi } from '@/layanan/bunyi';
import { hentikanSuara, ucapkan } from '@/layanan/suara';
import { Ikon } from '@/komponen/Ikon';
import { KepalaLayar, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';
import { jawabanKosong, jawabanLengkap, PilihJawaban } from '@/komponen/tka/PilihJawaban';
import { Stimulus } from '@/komponen/tka/Stimulus';
import { TeksKaya } from '@/komponen/tka/TeksKaya';

type Tahap = 'siap_dingin' | 'dingin' | 'dengar' | 'siap_panas' | 'panas' | 'soal' | 'hasil';

export default function BacaTeks() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const dampingi = mode === 'dampingi';
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const teks = ambilTeks(paketTka, id);
  const [tahap, setTahap] = useState<Tahap>('siap_dingin');
  const [detikDingin, setDetikDingin] = useState(0);
  const [detikPanas, setDetikPanas] = useState(0);
  const [sorot, setSorot] = useState(-1);
  const [tersandung, setTersandung] = useState<Set<number>>(new Set());
  const [curang, setCurang] = useState(false);
  const [sudahDiulang, setSudahDiulang] = useState(false);
  const [jawab, setJawab] = useState<JawabanAnak[]>([]);
  const [noSoal, setNoSoal] = useState(0);
  const [dicek, setDicek] = useState(false);
  const [simpan, setSimpan] = useState<{ kpmDingin: number; kpmPanas: number; benar: number } | null>(null);
  const mulai = useRef(0);
  const mulaiSesi = useRef(0);
  const pewaktuSorot = useRef<ReturnType<typeof setInterval> | null>(null);
  const rekor = useMuat(async (r) => (anakAktif ? rekorKpm(await r.daftarSesi(anakAktif.id, 'baca')) : null), null, [anakAktif?.id]);
  useHitungWaktu('belajar', false, dampingi ? 'dampingi' : 'sendiri');

  const kataPerBagian = useMemo(() => (teks?.isi ?? []).map((b) => (b.jenis === 'teks' ? pecahKata(b.isi) : [])), [teks]);
  const semuaKata = useMemo(() => kataPerBagian.flat(), [kataPerBagian]);
  const awalBagian = useMemo(() => kataPerBagian.map((_, i) => kataPerBagian.slice(0, i).reduce((n, k) => n + k.length, 0)), [kataPerBagian]);

  useEffect(() => {
    mulaiSesi.current = kiniMs();
    if (anakAktif && !dampingi)
      cekBelajar(repo, anakAktif).then((s) => {
        const r = ruteHalangan(s);
        if (r) router.replace(r);
      });
    return () => {
      hentikanSuara();
      if (pewaktuSorot.current) clearInterval(pewaktuSorot.current);
    };
  }, [repo, anakAktif, dampingi, router]);

  if (!teks || !anakAktif) return null;
  const w = warnaMapel.bi;
  const patokan = patokanKpm(teks);
  const tampilTeks = tahap !== 'siap_dingin' && tahap !== 'siap_panas' && tahap !== 'soal' && tahap !== 'hasil';

  const mulaiBaca = (t: 'dingin' | 'panas') => {
    mulai.current = kiniMs();
    setTahap(t);
  };
  const selesaiDingin = () => {
    const d = (kiniMs() - mulai.current) / 1000;
    const kpm = hitungKpm(teks.jumlahKata, d);
    if (!dampingi && terlaluCepat(kpm, patokan) && !sudahDiulang) {
      setSudahDiulang(true);
      setCurang(true);
      setTahap('siap_dingin');
      return;
    }
    setCurang(!dampingi && terlaluCepat(kpm, patokan));
    setDetikDingin(d);
    setTahap('dengar');
    dengarkan();
  };
  const dengarkan = () => {
    // Sorot kata satu per satu kira-kira seirama mesin suara (± 2,2 kata per detik).
    if (pewaktuSorot.current) clearInterval(pewaktuSorot.current);
    setSorot(0);
    let k = 0;
    pewaktuSorot.current = setInterval(() => {
      k += 1;
      setSorot(k);
      if (k >= semuaKata.length && pewaktuSorot.current) clearInterval(pewaktuSorot.current);
    }, 450);
    const isi = teks.isi.map((b) => (b.jenis === 'teks' ? b.isi : '')).join(' ');
    ucapkan(isi, 'id-ID', { pelan: true, selesai: () => setSorot(semuaKata.length) });
  };
  const selesaiPanas = () => {
    setDetikPanas((kiniMs() - mulai.current) / 1000);
    setJawab(teks.pertanyaan.map(jawabanKosong));
    setTahap('soal');
  };
  const simpanSesi = async () => {
    const kpmDingin = hitungKpm(teks.jumlahKata, detikDingin);
    const kpmPanas = hitungKpm(teks.jumlahKata, detikPanas);
    const benarKata = Math.max(0, teks.jumlahKata - tersandung.size);
    const benar = teks.pertanyaan.filter((b, k) => periksaJawaban(b, jawab[k] ?? '')).length;
    await repo.simpanSesi(
      {
        id: buatId(),
        anak_id: anakAktif.id,
        jenis: 'baca',
        mode: dampingi ? 'dampingi' : 'sendiri',
        kelas: anakAktif.kelas,
        rujukan: teks.id,
        mulai: new Date(mulaiSesi.current).toISOString(),
        selesai: sekarangIso(),
        durasiDetik: Math.round((kiniMs() - mulaiSesi.current) / 1000),
        benar,
        jumlah: teks.pertanyaan.length,
        tambahan: {
          kpmDingin: curang ? 0 : kpmDingin,
          kpmPanas,
          kpm: curang ? kpmPanas : kpmDingin,
          curang,
          detikDingin: Math.round(detikDingin),
          detikPanas: Math.round(detikPanas),
          ...(dampingi ? { kataBenarPerMenit: hitungKpm(benarKata, detikDingin), tersandung: tersandung.size, caraUkur: 'orang_tua' } : { caraUkur: 'tombol' }),
        },
      },
      teks.pertanyaan.map((b, k) => ({
        urutan: k + 1,
        soal: b.pertanyaan.slice(0, 160),
        butirId: b.id,
        kunci: typeof b.kunci === 'string' ? b.kunci : b.kunci.join(','),
        jawaban: typeof jawab[k] === 'string' ? (jawab[k] as string) : (jawab[k] as string[]).join(','),
        benar: periksaJawaban(b, jawab[k] ?? ''),
        detik: 0,
        hapusN: 0,
        topik: b.topik,
      })),
    );
    for (const b of teks.pertanyaan) if (/^B\d{2}$/.test(b.topik)) await repo.catatTopik(anakAktif.id, 'tka', b.topik, periksaJawaban(b, jawab[teks.pertanyaan.indexOf(b)] ?? '') ? 1 : 0, periksaJawaban(b, jawab[teks.pertanyaan.indexOf(b)] ?? '') ? 0 : 1);
    await perbaruiInti(repo, anakAktif);
    mainkanBunyi(repo, anakAktif.id, 'pesta');
    setSimpan({ kpmDingin, kpmPanas, benar });
    setTahap('hasil');
  };

  const isiTeks = (
    <View style={{ gap: 14 }}>
      {teks.isi.map((b, bi) => {
        if (b.jenis !== 'teks') return <Stimulus key={bi} bagian={[b]} ukuran={18} />;
        const kata = kataPerBagian[bi];
        const awal = awalBagian[bi];
        return (
          <Text key={bi} style={{ fontFamily: huruf.anak, fontSize: 20, lineHeight: 36, color: warna.teks }}>
            {kata.map((k, i) => {
              const n = awal + i;
              const disorot = tahap === 'dengar' && n === sorot;
              const sandung = tersandung.has(n);
              return (
                <Text
                  key={i}
                  onPress={
                    dampingi && tahap === 'dingin'
                      ? () => {
                          const s = new Set(tersandung);
                          if (s.has(n)) s.delete(n);
                          else s.add(n);
                          setTersandung(s);
                        }
                      : undefined
                  }
                  style={[
                    disorot && { backgroundColor: '#FFE29A', fontFamily: huruf.anakTebal },
                    sandung && { textDecorationLine: 'underline', textDecorationColor: warna.oranye, color: '#B86E00' },
                  ]}
                >
                  {k}{' '}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </View>
  );

  const bawah = (() => {
    switch (tahap) {
      case 'siap_dingin':
        return <Tombol label="Mulai membaca" ikon="kanan" besar onPress={() => mulaiBaca('dingin')} />;
      case 'dingin':
        return <Tombol label="Selesai" besar onPress={selesaiDingin} />;
      case 'dengar':
        return (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tombol label="Dengar lagi" varian="putih" ikon="suara" style={{ flex: 1 }} onPress={dengarkan} />
            <Tombol
              label="Baca lagi"
              style={{ flex: 1 }}
              onPress={() => {
                hentikanSuara();
                if (pewaktuSorot.current) clearInterval(pewaktuSorot.current);
                setTahap('siap_panas');
              }}
            />
          </View>
        );
      case 'siap_panas':
        return <Tombol label="Mulai baca lagi" ikon="kanan" besar onPress={() => mulaiBaca('panas')} />;
      case 'panas':
        return <Tombol label="Selesai" besar onPress={selesaiPanas} />;
      case 'soal': {
        const b = teks.pertanyaan[noSoal];
        return !dicek ? (
          <Tombol label="Cek" besar nonaktif={!jawabanLengkap(b, jawab[noSoal] ?? '')} onPress={() => setDicek(true)} />
        ) : (
          <Tombol
            label={noSoal + 1 < teks.pertanyaan.length ? 'Pertanyaan berikutnya' : 'Lihat hasil'}
            besar
            onPress={() => {
              setDicek(false);
              if (noSoal + 1 < teks.pertanyaan.length) setNoSoal(noSoal + 1);
              else simpanSesi();
            }}
          />
        );
      }
      case 'hasil':
        return <Tombol label="Kembali ke beranda" besar onPress={() => router.replace('/anak')} />;
    }
  })();

  return (
    <Layar bawah={<View style={{ padding: 16 }}>{bawah}</View>}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View style={{ flex: 1 }}>
          <KepalaLayar judul={teks.judul} />
        </View>
      </View>
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: w.teks, marginTop: -14, marginLeft: 52 }}>
        Baca Ulang · {teks.id}
        {dampingi ? ' · Dengar Bacaan' : ''}
      </Text>
      {tampilTeks ? (
        <ScrollView style={{ backgroundColor: warna.putih, borderRadius: 24 }} contentContainerStyle={{ padding: 20 }}>
          {isiTeks}
        </ScrollView>
      ) : null}
      {tahap === 'dengar' ? (
        <View style={{ backgroundColor: warna.biruMuda, borderRadius: 16, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Ikon nama="suara" ukuran={20} warna="#2A86C6" />
          <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>Dengarkan, lalu baca ikut kata yang kuning.</Text>
        </View>
      ) : null}
      {dampingi && tahap === 'dingin' ? (
        <View style={{ backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 12 }}>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>Untuk orang tua: ketuk kata yang tersandung saat anak membaca nyaring. Ketuk lagi untuk membatalkan.</Text>
        </View>
      ) : null}
      {tahap === 'siap_dingin' || tahap === 'siap_panas' ? (
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
            <Pinci ekspresi="semangat" ukuran={96} />
            <View style={{ flex: 1, backgroundColor: warna.putih, borderRadius: 20, borderBottomLeftRadius: 6, padding: 14 }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>
                {tahap === 'siap_dingin' ? (curang ? 'Coba baca lagi pelan-pelan, ya.' : 'Baca sendiri dulu') : 'Sekarang baca lagi'}
              </Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
                {tahap === 'siap_dingin'
                  ? `Tekan Mulai, baca sampai habis, lalu tekan Selesai. Kira-kira ${teks.jumlahKata} kata.`
                  : 'Setelah mendengar contoh, bacaanmu biasanya lebih lancar.'}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {tahap === 'soal' ? (
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: w.teks }}>
            Pertanyaan {noSoal + 1} dari {teks.pertanyaan.length}
          </Text>
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14 }}>
            <TeksKaya teks={teks.pertanyaan[noSoal].pertanyaan} ukuran={18} />
          </View>
          <PilihJawaban
            butir={teks.pertanyaan[noSoal]}
            jawaban={jawab[noSoal] ?? jawabanKosong(teks.pertanyaan[noSoal])}
            tampilKunci={dicek}
            onUbah={(j) => setJawab((l) => l.map((x, k) => (k === noSoal ? j : x)))}
          />
          <Pressable onPress={() => setTahap('panas')} accessibilityRole="button">
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.hijauTua, textAlign: 'center' }}>Lihat teks lagi</Text>
          </Pressable>
        </ScrollView>
      ) : null}
      {tahap === 'hasil' && simpan ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <Pinci ekspresi="merayakan" ukuran={120} />
          <Text style={{ fontFamily: huruf.judul, fontSize: 32, color: warna.hijauTua }}>Hebat!</Text>
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 18, alignSelf: 'stretch', gap: 8 }}>
            {curang ? (
              <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Bacaan keduamu {simpan.kpmPanas} kata per menit.</Text>
            ) : (
              <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>
                Tadi <Text style={{ fontFamily: huruf.judul, fontSize: 26 }}>{simpan.kpmDingin}</Text>, sekarang{' '}
                <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.hijauTua }}>{simpan.kpmPanas}</Text> kata per menit.
              </Text>
            )}
            {rekor !== null && !curang && simpan.kpmDingin > rekor ? (
              <View style={{ alignSelf: 'flex-start', backgroundColor: warna.oranyeMuda, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontFamily: huruf.anakTebal }}>Rekor baru!</Text>
              </View>
            ) : null}
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
              Pertanyaan tepat: {simpan.benar} dari {teks.pertanyaan.length}
            </Text>
            {dampingi ? (
              <Text style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>
                Kata benar per menit (Dengar Bacaan): {hitungKpm(Math.max(0, teks.jumlahKata - tersandung.size), detikDingin)} · tersandung {tersandung.size} kata
              </Text>
            ) : null}
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Tersimpan ✓</Text>
          </View>
        </View>
      ) : null}
      {tahap === 'soal' && dicek ? (
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: periksaJawaban(teks.pertanyaan[noSoal], jawab[noSoal] ?? '') ? warna.hijauTua : '#B86E00' }}>
          {periksaJawaban(teks.pertanyaan[noSoal], jawab[noSoal] ?? '') ? 'Betul! ✓' : 'Hampir! Jawaban yang tepat ditandai hijau.'}
        </Text>
      ) : null}
    </Layar>
  );
}
