/**
 * Tampilan game G06 Tebak Kata. Desain: desain/dari-claude-design/G06-Tebak-Kata.dc.html.
 * Gambar besar (emoji) + 🔊, kotak kata, dan ubin pilihan besar. Ubin yang tepat terbang ke kotak,
 * yang belum tepat memantul kembali. Tanpa skor, tanpa nyawa, tanpa hitung mundur.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';

import { huruf, warna } from '../../desain/token';
import { TombolSuara } from '../../komponen/dasar';
import { Pinci } from '../../komponen/Pinci';
import { ucapkan } from '../../layanan/suara';
import { kelompokKelas } from '../bersama/jenis';
import type { Kejutan } from '../bersama/kejutan';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { buatBabak, langkah, potonganBerikut, ringkasan, selesai, soalSekarang, type KeadaanTebakKata, type SoalKata } from './logika';
import { kataInggrisUntuk } from './tampilan/kosakataInggris';
import { KotakKata, UbinPilihan, UbinTerbang, type Kotak } from './tampilan/Ubin';

/** Pesta di akhir babak ≤ 1,5 detik. */
const MS_PESTA = 1400;
/** Ubin mendarat di kotak. */
const MS_MENDARAT = 300;
/** Kata lengkap → otomatis ke kata berikutnya (tombol Lanjut bisa lebih cepat). */
const MS_LANJUT_OTOMATIS = 2600;

function ucapkanSoal(s: SoalKata) {
  ucapkan(s.ucapan, s.bahasaUcapan);
}

function hurufBesar(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

interface Terbang {
  kunci: number;
  teks: string;
  dari: Kotak;
  ke: Kotak;
}

export default function LayarGame(props: PropsLayarGame) {
  const { kelas, tingkat, benih, bunyi, onSelesai, onKeluar, sisaDetikAwal, totalDetik } = props;
  const [keadaan, setKeadaan] = useState<KeadaanTebakKata>(() =>
    buatBabak({ kelas, tingkat, benih, kataInggris: kataInggrisUntuk(kelas, tingkat) }),
  );
  const keadaanRef = useRef(keadaan);
  const [pantul, setPantul] = useState<{ teks: string; n: number }>({ teks: '', n: 0 });
  const [terbang, setTerbang] = useState<Terbang | null>(null);
  const [kejutan, setKejutan] = useState<Kejutan | null>(null);
  const [kunciKejutan, setKunciKejutan] = useState(0);
  const [pesta, setPesta] = useState(false);
  const [lewatDetik, setLewatDetik] = useState(0);

  // Tata letak (dibaca hanya di pengendali ketukan).
  const tata = useRef({ badanY: 0, barisKotakY: 0, gridY: 0, kotak: [] as Kotak[], ubin: {} as Record<string, Kotak> });
  const pewaktu = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sudahSelesai = useRef(false);

  const nanti = useCallback((fn: () => void, ms: number) => {
    pewaktu.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const daftar = pewaktu.current;
    return () => daftar.forEach(clearTimeout);
  }, []);

  // Jam waktu main (matahari) — diperbarui pelan, tanpa angka hitung mundur.
  useEffect(() => {
    const mulai = Date.now();
    const id = setInterval(() => setLewatDetik(Math.floor((Date.now() - mulai) / 1000)), 5000);
    return () => clearInterval(id);
  }, []);

  // Kata pertama dibacakan saat babak dimulai.
  useEffect(() => {
    if (bunyi) ucapkanSoal(soalSekarang(keadaanRef.current));
    // hanya sekali saat layar dibuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const terapkan = useCallback((baru: KeadaanTebakKata) => {
    keadaanRef.current = baru;
    setKeadaan(baru);
    if (baru.kejutan) {
      setKejutan(baru.kejutan);
      setKunciKejutan((n) => n + 1);
    }
  }, []);

  /** `indeks`: bila diisi (lanjut otomatis), hanya berlaku untuk kata itu. */
  const lanjutkan = useCallback((indeks?: number) => {
    const k = keadaanRef.current;
    if (k.fase !== 'benar' || sudahSelesai.current) return;
    if (indeks !== undefined && indeks !== k.indeks) return;
    const baru = langkah(k, { jenis: 'lanjut' });
    terapkan(baru);
    setTerbang(null);
    if (selesai(baru)) {
      sudahSelesai.current = true;
      setPesta(true);
      bunyiGame('pesta', bunyi);
      nanti(() => onSelesai(ringkasan(baru)), MS_PESTA);
      return;
    }
    if (bunyi) ucapkanSoal(soalSekarang(baru));
  }, [bunyi, nanti, onSelesai, terapkan]);

  const pilih = useCallback(
    (teks: string) => {
      const k = keadaanRef.current;
      if (k.fase !== 'menebak') return;
      const tepat = potonganBerikut(k) === teks;
      const baru = langkah(k, { jenis: 'pilih', teks });
      if (baru === k) return;
      terapkan(baru);
      if (!tepat) {
        setPantul((p) => ({ teks, n: p.n + 1 }));
        return;
      }
      const t = tata.current;
      const dari = t.ubin[teks];
      const ke = t.kotak[k.terisi.length];
      if (dari && ke) {
        setTerbang((lama) => ({
          kunci: (lama?.kunci ?? 0) + 1,
          teks,
          dari: { ...dari, y: t.badanY + t.gridY + dari.y },
          ke: { ...ke, y: t.badanY + t.barisKotakY + ke.y },
        }));
      }
      nanti(() => bunyiGame('plop', bunyi), MS_MENDARAT);
      if (baru.fase === 'benar') {
        const s = soalSekarang(baru);
        nanti(() => {
          bunyiGame('ting', bunyi);
          ucapkanSoal(s);
        }, MS_MENDARAT + 200);
        nanti(() => lanjutkan(baru.indeks), MS_LANJUT_OTOMATIS);
      }
    },
    [bunyi, lanjutkan, nanti, terapkan],
  );

  const soal = soalSekarang(keadaan);
  const satuKotak = soal.jenis === 'baku' || soal.jenis === 'inggris';
  const kecil = kelompokKelas(kelas) === 'awal';
  const hurufKotak = satuKotak ? 30 : soal.jenis === 'imbuhan' ? 30 : soal.jawaban.length > 2 ? 32 : 40;
  const hurufUbin = satuKotak ? 28 : soal.jenis === 'imbuhan' ? 30 : 40;
  const kolom = satuKotak ? 1 : soal.pilihan.length === 4 ? 2 : 3;
  const lebarUbin: `${number}%` = kolom === 1 ? '100%' : kolom === 2 ? '48%' : '31%';
  const tinggiUbin = satuKotak ? 72 : 96;
  const sisaDetik = Number.isFinite(sisaDetikAwal) ? Math.max(0, sisaDetikAwal - lewatDetik) : sisaDetikAwal;
  const benar = keadaan.fase === 'benar' || keadaan.fase === 'selesai';

  const catatKotak = (i: number) => (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    tata.current.kotak[i] = { x, y, w: width, h: height };
  };
  const catatUbin = (teks: string) => (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    tata.current.ubin[teks] = { x, y, w: width, h: height };
  };

  return (
    <BingkaiGame
      judul="Tebak Kata"
      sisaDetik={sisaDetik}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={keadaan.petunjuk}
      kejutan={kejutan}
      kunciKejutan={kunciKejutan}
      pesta={pesta}
    >
      <View style={{ flex: 1 }}>
        {/* Gambar besar di atas pemandangan bukit */}
        <View style={{ height: 220, alignItems: 'center', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: -40, right: -40, bottom: -60, height: 120, borderRadius: 200, backgroundColor: '#B8DDB0' }} />
          <View style={{ position: 'absolute', left: 28, top: 96, width: 48, height: 48, borderRadius: 24, backgroundColor: '#5E9E6E' }} />
          <View style={{ position: 'absolute', left: 48, top: 136, width: 8, height: 34, backgroundColor: '#8A5A33' }} />
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel="Gambar kata"
            style={{
              marginTop: 18,
              width: 176,
              height: 176,
              borderRadius: 32,
              backgroundColor: warna.putih,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomWidth: 5,
              borderBottomColor: 'rgba(45,49,66,0.12)',
            }}
          >
            <Text style={{ fontSize: 104, lineHeight: 124 }}>{soal.emoji}</Text>
            {soal.teksBantu ? (
              <Text numberOfLines={1} style={{ position: 'absolute', bottom: 6, fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>
                {soal.teksBantu}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          onLayout={(e) => {
            tata.current.badanY = e.nativeEvent.layout.y;
          }}
          style={{ flex: 1, backgroundColor: warna.kremLembut, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 24, gap: 16 }}
        >
          <View
            onLayout={(e) => {
              tata.current.barisKotakY = e.nativeEvent.layout.y;
            }}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <TombolSuara teks={soal.ucapan} bahasa={soal.bahasaUcapan} ukuran={64} latar={warna.hijauDaun} warnaIkon={warna.biruTinta} />
            {soal.jawaban.map((_, i) => (
              <KotakKata
                key={`${soal.id}-${i}`}
                teks={keadaan.terisi[i] ?? null}
                ukuranHuruf={hurufKotak}
                lebarMaks={satuKotak ? undefined : 104}
                onLayout={catatKotak(i)}
              />
            ))}
          </View>

          {!kecil && !benar ? (
            <Text style={{ textAlign: 'center', fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>{keadaan.pesan}</Text>
          ) : null}

          {benar ? (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Pinci ekspresi="merayakan" ukuran={80} />
                <Text style={{ fontFamily: huruf.judul, fontSize: 36, color: warna.hijauTua }}>{hurufBesar(soal.ucapan)}!</Text>
              </View>
              {keadaan.fase === 'benar' ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Lanjut"
                  onPress={() => lanjutkan()}
                  style={({ pressed }) => ({
                    height: 72,
                    borderRadius: 18,
                    backgroundColor: warna.hijauDaun,
                    borderBottomWidth: 5,
                    borderBottomColor: warna.hijauTua,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  })}
                >
                  <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.biruTinta }}>Lanjut</Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View
              onLayout={(e) => {
                tata.current.gridY = e.nativeEvent.layout.y;
              }}
              style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}
            >
              {soal.pilihan.map((teks) => (
                <UbinPilihan
                  key={`${soal.id}-${teks}`}
                  teks={teks}
                  lebar={lebarUbin}
                  tinggi={tinggiUbin}
                  ukuranHuruf={hurufUbin}
                  sorot={keadaan.sorotan === teks}
                  pantulKunci={pantul.teks === teks ? pantul.n : 0}
                  onPress={() => pilih(teks)}
                  onLayout={catatUbin(teks)}
                />
              ))}
            </View>
          )}
        </View>

        {terbang ? <UbinTerbang key={terbang.kunci} teks={terbang.teks} dari={terbang.dari} ke={terbang.ke} ukuranHuruf={hurufUbin} /> : null}
      </View>
    </BingkaiGame>
  );
}
