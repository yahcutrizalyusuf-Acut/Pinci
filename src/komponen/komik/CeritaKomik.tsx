/**
 * K30 Cerita Komik (rancangan `13` bagian 3.1): Tonton → Baca → kartu Pesan Hari Ini.
 * - Tonton: panel muncul satu per satu, tiap gelembung dibacakan dengan suara tokohnya, kata disorot saat diucapkan.
 *   Panel berikut muncul setelah suara selesai, atau anak menggeser.
 * - Baca: tanpa putar otomatis; ketuk gelembung untuk mendengar, ketuk kata untuk mendengar kata + arti.
 *   Tombol "Artinya?" menampilkan terjemahan (tidak otomatis). Kelas 1–2: tombol 🔊 besar di gelembung.
 * Panel diam tanpa animasi; yang bergerak hanya sorotan kata.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { huruf, warna, warnaMapel } from '../../desain/token';
import { artiKata, buatKamus, indeksDariHuruf, kepingKalimat, perkiraanWaktuKata } from '../../fitur/komik';
import type { Gelembung, Komik } from '../../isi/inggris/komik';
import { PAKET_INGGRIS } from '../../isi/inggris/paket';
import { suaraTokoh, teksTokoh } from '../../isi/inggris/paketKomik';
import { hentikanSuara, ucapkan, ucapkanTokoh } from '../../layanan/suara';
import { Tombol } from '../dasar';
import { Pinci } from '../Pinci';
import { GambarPanel } from './GambarPanel';
import { GelembungKomik } from './GelembungKomik';

type Tahap = 'tonton' | 'baca' | 'pesan';
const UNGU = warnaMapel.ing;

export interface PropsCeritaKomik {
  komik: Komik;
  kelas: number;
  onSelesai: () => void;
  /** tombol ajakan "Ceritakan ke Ayah/Bunda" di kartu akhir */
  onCeritakan?: () => void;
  sapaan?: string;
}

export function CeritaKomik({ komik, kelas, onSelesai, onCeritakan, sapaan = 'Ayah/Bunda' }: PropsCeritaKomik) {
  const { width } = useWindowDimensions();
  const lebar = Math.min(width - 32, 440);
  const [tahap, setTahap] = useState<Tahap>('tonton');
  const [panelKe, setPanelKe] = useState(0);
  const [bicara, setBicara] = useState<{ gid: string; sorot: number | null } | null>(null);
  const [artiTampil, setArtiTampil] = useState(false);
  const [kotakArti, setKotakArti] = useState<{ kata: string; arti: string } | null>(null);
  const pewaktu = useRef<ReturnType<typeof setTimeout>[]>([]);
  const putarOtomatis = useRef(true);
  const kamus = useMemo(() => buatKamus(Object.values(PAKET_INGGRIS), komik.tingkat), [komik.tingkat]);
  const kecil = kelas <= 2;

  const bersihkanPewaktu = () => {
    for (const t of pewaktu.current) clearTimeout(t);
    pewaktu.current = [];
  };
  useEffect(
    () => () => {
      bersihkanPewaktu();
      hentikanSuara();
    },
    [],
  );

  /** Ucapkan satu gelembung dengan suara tokohnya; sorotan memakai onBoundary bila ada, kalau tidak perkiraan waktu. */
  const ucapkanGelembung = (g: Gelembung, selesai?: () => void) => {
    bersihkanPewaktu();
    const teks = teksTokoh(g.teks);
    const keping = kepingKalimat(teks);
    const suara = suaraTokoh(g.tokoh, komik.tingkat);
    let dariHp = false;
    setBicara({ gid: g.id, sorot: 0 });
    perkiraanWaktuKata(keping, suara.kecepatan).forEach((t, i) => {
      pewaktu.current.push(
        setTimeout(() => {
          if (!dariHp) setBicara({ gid: g.id, sorot: i });
        }, t),
      );
    });
    ucapkanTokoh(teks, suara, {
      batas: (h) => {
        dariHp = true;
        setBicara({ gid: g.id, sorot: indeksDariHuruf(keping, h) });
      },
      selesai: () => {
        bersihkanPewaktu();
        setBicara(null);
        selesai?.();
      },
    });
  };

  /** Tonton: bacakan gelembung panel ke-n berurutan, lalu pindah panel. */
  const tontonPanel = (n: number) => {
    if (n >= komik.panel.length) {
      pewaktu.current.push(setTimeout(() => keBaca(), 700));
      return;
    }
    setPanelKe(n);
    const gel = komik.panel[n].gelembung;
    const ucapKe = (j: number) => {
      if (!putarOtomatis.current) return;
      if (j >= gel.length) {
        pewaktu.current.push(setTimeout(() => putarOtomatis.current && tontonPanel(n + 1), 600));
        return;
      }
      ucapkanGelembung(gel[j], () => pewaktu.current.push(setTimeout(() => ucapKe(j + 1), 350)));
    };
    pewaktu.current.push(setTimeout(() => ucapKe(0), 500));
  };

  useEffect(() => {
    if (tahap === 'tonton') {
      putarOtomatis.current = true;
      tontonPanel(0);
    }
    // Hanya saat tahap berganti.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tahap]);

  const keBaca = () => {
    putarOtomatis.current = false;
    bersihkanPewaktu();
    hentikanSuara();
    setBicara(null);
    setPanelKe(0);
    setArtiTampil(false);
    setTahap('baca');
  };

  /** Pindah panel karena anak menggeser (atau menekan tombol). */
  const pindahPanel = (n: number) => {
    if (n < 0 || n >= komik.panel.length || n === panelKe) return;
    setArtiTampil(false);
    setKotakArti(null);
    if (tahap === 'tonton') {
      // Anak menggeser saat menonton: lanjutkan dari panel itu.
      bersihkanPewaktu();
      hentikanSuara();
      tontonPanel(n);
    } else setPanelKe(n);
  };
  // Gestur memanggil fungsi terbaru lewat ref (dipanggil di luar render, saat jari dilepas).
  const pindahTerbaru = useRef<(arah: 1 | -1) => void>(() => undefined);
  useEffect(() => {
    pindahTerbaru.current = (arah) => pindahPanel(panelKe + arah);
  });
  // Gestur dibuat sekali; ref hanya dibaca di dalam onEnd (saat jari dilepas), tidak saat render.
  /* eslint-disable react-hooks/refs */
  const usap = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-24, 24])
        .onEnd((e) => {
          const arah = e.translationX < -50 ? 1 : e.translationX > 50 ? -1 : 0;
          if (arah) pindahTerbaru.current(arah);
        }),
    [],
  );
  /* eslint-enable react-hooks/refs */

  if (tahap === 'pesan') {
    return (
      <View style={{ gap: 16, alignItems: 'center' }}>
        <Pinci ukuran={120} />
        <View style={{ backgroundColor: warna.putih, borderRadius: 24, padding: 20, gap: 8, width: '100%', borderWidth: 3, borderColor: UNGU.utama }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: UNGU.teks }}>Pesan Hari Ini</Text>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: warna.teks }}>{teksTokoh(komik.pesanHariIni.inggris)}</Text>
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teksKedua }}>{teksTokoh(komik.pesanHariIni.arti)}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Dengar pesan" onPress={() => ucapkan(teksTokoh(komik.pesanHariIni.inggris), 'en-US')} style={{ alignSelf: 'flex-start', paddingVertical: 6 }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: UNGU.teks }}>🔊 Dengar lagi</Text>
          </Pressable>
        </View>
        <View style={{ width: '100%', gap: 10 }}>
          {onCeritakan ? <Tombol label={`Ceritakan ke ${sapaan}, yuk!`} varian="garis" onPress={onCeritakan} /> : null}
          <Tombol label="Lanjut" besar onPress={onSelesai} />
        </View>
      </View>
    );
  }

  const panel = komik.panel[panelKe];
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: UNGU.teks }}>
          {tahap === 'tonton' ? '👀 Tonton' : '📖 Baca'} · {teksTokoh(komik.judul)}
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>
          {panelKe + 1}/{komik.panel.length}
        </Text>
      </View>
      <GestureDetector gesture={usap}>
        <View key={panel.id} accessibilityHint="Geser ke kiri atau kanan untuk pindah panel" style={{ width: lebar, height: lebar, alignSelf: 'center' }}>
          <GambarPanel panel={panel} lebar={lebar} />
          {panel.gelembung.map((g) => (
            <GelembungKomik
              key={g.id}
              gelembung={g}
              lebarPanel={lebar}
              aktif={bicara?.gid === g.id}
              sorot={bicara?.gid === g.id ? bicara.sorot : null}
              tombolSuara={tahap === 'baca' && kecil}
              onKetukGelembung={tahap === 'baca' ? () => ucapkanGelembung(g) : undefined}
              onKetukKata={
                tahap === 'baca'
                  ? (kata, tampil) => {
                      const k = artiKata(kamus, kata);
                      setKotakArti({ kata: tampil.replace(/[.,!?]+$/, ''), arti: k?.arti ?? '' });
                      ucapkan(kata, 'en-US');
                    }
                  : undefined
              }
            />
          ))}
        </View>
      </GestureDetector>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {komik.panel.map((p, n) => (
          <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Panel ${n + 1}`} onPress={() => pindahPanel(n)} hitSlop={8} style={{ width: n === panelKe ? 22 : 10, height: 10, borderRadius: 5, backgroundColor: n === panelKe ? UNGU.utama : '#D9CFF2' }} />
        ))}
      </View>

      {tahap === 'baca' ? (
        <View style={{ gap: 8 }}>
          {kotakArti ? (
            <View style={{ backgroundColor: UNGU.muda, borderRadius: 14, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>{kotakArti.kata}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teksKedua, flex: 1 }}>{kotakArti.arti ? `= ${kotakArti.arti}` : '(dengarkan saja)'}</Text>
            </View>
          ) : (
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Ketuk gelembung untuk mendengar. Ketuk satu kata untuk tahu artinya.</Text>
          )}
          {artiTampil ? (
            <View style={{ backgroundColor: warna.putih, borderRadius: 14, padding: 12, gap: 4 }}>
              {panel.gelembung.map((g) => (
                <Text key={g.id} style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>
                  {teksTokoh(g.arti)}
                </Text>
              ))}
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Tombol label={artiTampil ? 'Tutup arti' : 'Artinya?'} varian="garis" onPress={() => setArtiTampil(!artiTampil)} />
            </View>
            <View style={{ flex: 1 }}>
              {panelKe + 1 < komik.panel.length ? (
                <Tombol
                  label="Panel berikut"
                  onPress={() => pindahPanel(panelKe + 1)}
                />
              ) : (
                <Tombol
                  label="Selesai membaca"
                  onPress={() => {
                    hentikanSuara();
                    setTahap('pesan');
                    setTimeout(() => ucapkan(teksTokoh(komik.pesanHariIni.inggris), 'en-US'), 400);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Tombol label="Tonton ulang" varian="garis" onPress={() => { bersihkanPewaktu(); hentikanSuara(); putarOtomatis.current = true; tontonPanel(0); }} />
          </View>
          <View style={{ flex: 1 }}>
            <Tombol label="Lanjut: baca" onPress={keBaca} />
          </View>
        </View>
      )}
    </View>
  );
}
