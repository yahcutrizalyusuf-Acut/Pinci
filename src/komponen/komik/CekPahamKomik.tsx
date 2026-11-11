/**
 * K31 Cek Paham Komik (rancangan `13` bagian 3.2): urutkan panel (seret untuk kelas 3–6, ketuk berurutan untuk
 * kelas 1–2), "siapa yang bilang?" (pilih wajah tokoh), dengar lalu pilih panel, lengkapi gelembung (tingkat 4–6).
 * Jawaban belum tepat: yang benar bergetar pelan dan ditunjukkan tempatnya, lalu anak lanjut. Tanpa skor merah.
 */
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { huruf, warna, warnaMapel } from '../../desain/token';
import { acakPanel, pindahkan } from '../../fitur/komik';
import { acak } from '../../fitur/inggris';
import type { Komik, PanelKomik, SoalCekPaham } from '../../isi/inggris/komik';
import { cariTokoh, suaraTokoh, teksTokoh } from '../../isi/inggris/paketKomik';
import { buatAcak } from '../../mesin/lancar';
import { ucapkanTokoh } from '../../layanan/suara';
import { Tombol } from '../dasar';
import { GambarPanel } from './GambarPanel';

const UNGU = warnaMapel.ing;

export interface HasilCekPaham {
  soalId: string;
  benar: boolean;
}

/** Getar pelan untuk menunjukkan jawaban yang benar. */
function useGetar(nyala: boolean) {
  const x = useSharedValue(0);
  useEffect(() => {
    if (nyala) x.set(withSequence(withTiming(-6, { duration: 70 }), withTiming(6, { duration: 70 }), withTiming(-4, { duration: 70 }), withTiming(0, { duration: 70 })));
  }, [nyala, x]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
}

function Getar({ nyala, children }: { nyala: boolean; children: React.ReactNode }) {
  const gaya = useGetar(nyala);
  return <Animated.View style={gaya}>{children}</Animated.View>;
}

/** Tombol 🔊 besar untuk memutar ulang kalimat soal dengan suara tokohnya. */
function TombolDengar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Dengar lagi" onPress={onPress} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: UNGU.utama, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>🔊</Text>
    </Pressable>
  );
}

/** Wajah tokoh sederhana untuk pilihan "siapa yang bilang?" (lingkaran warna tokoh + nama). */
function WajahTokoh({ id, keadaan, onPress }: { id: string; keadaan: 'biasa' | 'benar' | 'tunjuk'; onPress?: () => void }) {
  const t = cariTokoh(id);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={t?.nama ?? id} onPress={onPress} style={{ alignItems: 'center', gap: 6, padding: 8, borderRadius: 18, borderWidth: 3, borderColor: keadaan === 'biasa' ? 'transparent' : warna.hijauSegar, backgroundColor: keadaan === 'benar' ? warna.hijauMuda : warna.putih }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t?.warna ?? '#ccc', borderWidth: 3, borderColor: '#6B4423', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 28, color: warna.putih }}>{(t?.nama ?? id).slice(0, 1)}</Text>
      </View>
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{t?.nama ?? id}</Text>
    </Pressable>
  );
}

/** Kartu panel yang bisa diseret ke atas/bawah untuk mengurutkan (kelas 3–6). */
function PanelSeret({ panel, indeks, jumlah, tinggi, lebar, onPindah, keadaan }: { panel: PanelKomik; indeks: number; jumlah: number; tinggi: number; lebar: number; onPindah: (dari: number, ke: number) => void; keadaan: 'biasa' | 'getar' }) {
  const y = useSharedValue(0);
  const tarik = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .minDistance(6)
        .onUpdate((e) => y.set(e.translationY))
        .onEnd((e) => {
          const geser = Math.round(e.translationY / tinggi);
          y.set(withTiming(0, { duration: 120 }));
          if (geser !== 0) onPindah(indeks, indeks + geser);
        }),
    [indeks, tinggi, onPindah, y],
  );
  const gaya = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], zIndex: y.value !== 0 ? 10 : 0 }));
  return (
    <GestureDetector gesture={tarik}>
      <Animated.View style={gaya}>
        <Getar nyala={keadaan === 'getar'}>
          <View
            accessible
            accessibilityLabel={`Panel ${indeks + 1} dari ${jumlah}. ${panel.adegan}`}
            accessibilityActions={[
              { name: 'increment', label: 'Pindah ke bawah' },
              { name: 'decrement', label: 'Pindah ke atas' },
            ]}
            onAccessibilityAction={(e) => onPindah(indeks, indeks + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: warna.putih, borderRadius: 16, padding: 6, height: tinggi - 8 }}
          >
            <GambarPanel panel={panel} lebar={tinggi - 20} />
            <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Seret ke atas atau bawah</Text>
            <View style={{ gap: 4, width: lebar > 0 ? 44 : 44 }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Naik" onPress={() => onPindah(indeks, indeks - 1)} style={{ height: 36, borderRadius: 10, backgroundColor: UNGU.muda, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>▲</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Turun" onPress={() => onPindah(indeks, indeks + 1)} style={{ height: 36, borderRadius: 10, backgroundColor: UNGU.muda, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>▼</Text>
              </Pressable>
            </View>
          </View>
        </Getar>
      </Animated.View>
    </GestureDetector>
  );
}

export function CekPahamKomik({ komik, kelas, onSelesai }: { komik: Komik; kelas: number; onSelesai: (hasil: HasilCekPaham[]) => void }) {
  const { width } = useWindowDimensions();
  const lebar = Math.min(width - 32, 440);
  const soalSemua = useMemo(() => komik.cekPaham.filter((s) => s.jenis !== 'lengkapi' || komik.tingkat >= 4), [komik]);
  const [ke, setKe] = useState(0);
  const [hasil, setHasil] = useState<HasilCekPaham[]>([]);
  const [salah, setSalah] = useState(false);
  const [selesaiSoal, setSelesaiSoal] = useState(false);
  const soal = soalSemua[ke];

  const gelembung = (gid: string) => komik.panel.flatMap((p) => p.gelembung).find((g) => g.id === gid);
  const dengarkan = (gid: string) => {
    const g = gelembung(gid);
    if (g) ucapkanTokoh(teksTokoh(g.teks), suaraTokoh(g.tokoh, komik.tingkat));
  };
  const catat = (benar: boolean) => {
    if (selesaiSoal) return;
    if (benar) {
      setHasil((h) => [...h, { soalId: soal.id, benar: !salah }]);
      setSelesaiSoal(true);
    } else setSalah(true);
  };
  const lanjut = () => {
    const h = salah && !selesaiSoal ? [...hasil, { soalId: soal.id, benar: false }] : hasil;
    if (ke + 1 >= soalSemua.length) onSelesai(h);
    else {
      setHasil(h);
      setKe(ke + 1);
      setSalah(false);
      setSelesaiSoal(false);
    }
  };

  useEffect(() => {
    if (soal && soal.jenis !== 'urutkan' && soal.jenis !== 'lengkapi') setTimeout(() => dengarkan(soal.gelembung), 400);
    // Hanya saat soal berganti.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ke]);

  if (!soal) return null;
  const selesai = selesaiSoal || salah;
  const pesan = selesaiSoal && !salah ? 'Betul! ✓' : salah ? 'Hampir! Lihat jawaban yang bergetar, lalu lanjut.' : null;

  return (
    <View style={{ gap: 14 }}>
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: UNGU.teks }}>
        Cek Paham · {ke + 1}/{soalSemua.length}
      </Text>
      {soal.jenis === 'urutkan' ? (
        <SoalUrutkan key={soal.id} komik={komik} soal={soal} kelas={kelas} lebar={lebar} onJawab={(b) => catat(b)} selesai={selesai} />
      ) : soal.jenis === 'siapa' ? (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TombolDengar onPress={() => dengarkan(soal.gelembung)} />
            <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Siapa yang bilang ini?</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {acak(soal.pilihan, buatAcak(soal.id)).map((id) => (
              <Getar key={id} nyala={salah && id === soal.kunci}>
                <WajahTokoh id={id} keadaan={(selesaiSoal || salah) && id === soal.kunci ? 'benar' : 'biasa'} onPress={() => catat(id === soal.kunci)} />
              </Getar>
            ))}
          </View>
        </View>
      ) : soal.jenis === 'dengar_panel' ? (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TombolDengar onPress={() => dengarkan(soal.gelembung)} />
            <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Dengar, lalu pilih panelnya.</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {acak(soal.pilihan, buatAcak(soal.id)).map((pid) => {
              const p = komik.panel.find((x) => x.id === pid);
              if (!p) return null;
              const benar = (selesaiSoal || salah) && pid === soal.kunci;
              return (
                <Getar key={pid} nyala={salah && pid === soal.kunci}>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Panel ${p.nomor}`} onPress={() => catat(pid === soal.kunci)} style={{ borderRadius: 18, borderWidth: 4, borderColor: benar ? warna.hijauSegar : 'transparent' }}>
                    <GambarPanel panel={p} lebar={Math.min(140, (lebar - 40) / Math.min(3, soal.pilihan.length))} />
                  </Pressable>
                </Getar>
              );
            })}
          </View>
        </View>
      ) : (
        <SoalLengkapi komik={komik} soal={soal} salah={salah} selesai={selesaiSoal} onJawab={(b) => catat(b)} />
      )}
      {pesan ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: selesaiSoal && !salah ? warna.hijauTua : '#B86E00' }}>{pesan}</Text> : null}
      <Tombol label={ke + 1 < soalSemua.length ? 'Soal berikutnya' : 'Selesai'} besar nonaktif={!selesai} onPress={lanjut} />
    </View>
  );
}

function SoalUrutkan({ komik, soal, kelas, lebar, onJawab, selesai }: { komik: Komik; soal: Extract<SoalCekPaham, { jenis: 'urutkan' }>; kelas: number; lebar: number; onJawab: (benar: boolean) => void; selesai: boolean }) {
  const [urutan, setUrutan] = useState(() => acakPanel(soal, soal.id));
  const [ketuk, setKetuk] = useState<string[]>([]);
  const [diperiksa, setDiperiksa] = useState(false);
  const tinggi = 104;
  const panel = (id: string) => komik.panel.find((p) => p.id === id);
  const keclass = kelas <= 2;
  const susunanAkhir = diperiksa ? soal.panel : keclass ? ketuk : urutan;
  const tepat = susunanAkhir.join() === soal.panel.join();

  const periksa = (susunan: string[]) => {
    setDiperiksa(true);
    onJawab(susunan.join() === soal.panel.join());
  };

  if (keclass) {
    return (
      <View style={{ gap: 10 }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Ketuk panel sesuai urutan cerita.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {(diperiksa ? soal.panel : urutan).map((id) => {
            const p = panel(id);
            if (!p) return null;
            const nomor = diperiksa ? soal.panel.indexOf(id) + 1 : ketuk.indexOf(id) + 1;
            return (
              <Getar key={id} nyala={diperiksa && !tepat}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Panel. ${p.adegan}`}
                  disabled={diperiksa || ketuk.includes(id)}
                  onPress={() => {
                    const baru = [...ketuk, id];
                    setKetuk(baru);
                    if (baru.length === soal.panel.length) periksa(baru);
                  }}
                  style={{ borderRadius: 18 }}
                >
                  <GambarPanel panel={p} lebar={Math.min(130, (lebar - 30) / 3)} />
                  {nomor > 0 ? (
                    <View style={{ position: 'absolute', top: 6, left: 6, width: 34, height: 34, borderRadius: 17, backgroundColor: UNGU.utama, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.putih }}>{nomor}</Text>
                    </View>
                  ) : null}
                </Pressable>
              </Getar>
            );
          })}
        </View>
        {!diperiksa && ketuk.length > 0 ? <Tombol label="Ulangi" varian="garis" onPress={() => setKetuk([])} /> : null}
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Seret panel sampai urutan ceritanya benar.</Text>
      {(diperiksa ? soal.panel : urutan).map((id, i) => {
        const p = panel(id);
        if (!p) return null;
        return (
          <PanelSeret
            key={id}
            panel={p}
            indeks={i}
            jumlah={urutan.length}
            tinggi={tinggi}
            lebar={lebar}
            keadaan={diperiksa && !tepat ? 'getar' : 'biasa'}
            onPindah={(dari, ke) => !diperiksa && setUrutan((u) => pindahkan(u, dari, Math.max(0, Math.min(u.length - 1, ke))))}
          />
        );
      })}
      {!diperiksa && !selesai ? <Tombol label="Periksa urutan" onPress={() => periksa(urutan)} /> : null}
    </View>
  );
}

function SoalLengkapi({ komik, soal, salah, selesai, onJawab }: { komik: Komik; soal: Extract<SoalCekPaham, { jenis: 'lengkapi' }>; salah: boolean; selesai: boolean; onJawab: (benar: boolean) => void }) {
  const g = komik.panel.flatMap((p) => p.gelembung).find((x) => x.id === soal.gelembung);
  const teks = g ? teksTokoh(g.teks) : '';
  const kosong = teks.replace(new RegExp(`\\b${soal.kataHilang}\\b`, 'i'), selesai || salah ? `[${soal.kataHilang}]` : '____');
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>Kata apa yang hilang?</Text>
      <View style={{ backgroundColor: warna.putih, borderRadius: 18, borderWidth: 2, borderColor: '#6B4423', padding: 14 }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 22, color: warna.teks }}>{kosong}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {acak(soal.pilihan, buatAcak(soal.id)).map((p) => (
          <View key={p} style={{ flex: 1 }}>
            <Getar nyala={salah && p === soal.kataHilang}>
              <Pressable accessibilityRole="button" accessibilityLabel={p} onPress={() => onJawab(p === soal.kataHilang)} style={{ height: 56, borderRadius: 14, borderWidth: 3, borderColor: (selesai || salah) && p === soal.kataHilang ? warna.hijauSegar : '#CDBFEA', backgroundColor: warna.putih, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>{p}</Text>
              </Pressable>
            </Getar>
          </View>
        ))}
      </View>
    </View>
  );
}
