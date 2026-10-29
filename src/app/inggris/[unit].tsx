/**
 * B05/K28 Unit Bahasa Inggris: kenal kata (🔊) → pola kalimat → dengar lalu pilih → susun kata (tingkat 4–6) → permainan kata.
 * Kata yang belum tepat masuk antrean ulang berjarak (1, 3, 7 hari).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { buatId, kiniMs, sekarangIso } from '@/data/alat';
import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { perbaruiInti } from '@/fitur/hari-ini';
import { acak, acakSusun, cariKata, jatuhTempo, perbaruiUlang, soalDengarSesi, type KataUlang } from '@/fitur/inggris';
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

type Bagian = 'kenal' | 'pola' | 'dengar' | 'susun' | 'main' | 'hasil';
const UNGU = warnaMapel.ing;

export default function UnitInggris() {
  const { unit: idUnit } = useLocalSearchParams<{ unit: string }>();
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const tingkat = (Number(idUnit.slice(1, 2)) || anak.tingkatInggris || 3) as 3 | 4 | 5 | 6;
  const paket = PAKET_INGGRIS[tingkat];
  const unit = paket.unit.find((u) => u.id === idUnit);
  const antreAwal = useMuat(async (r) => (await r.nilai<KataUlang[]>(`inggris_ulang:${anak.id}`)) ?? [], null, [anak.id]);
  const urutan: Bagian[] = useMemo(() => ['kenal', 'pola', 'dengar', ...(unit && unit.susun.length ? (['susun'] as Bagian[]) : []), 'main', 'hasil'], [unit]);
  const [bagian, setBagian] = useState<Bagian>('kenal');
  const [i, setI] = useState(0);
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [salahKe, setSalahKe] = useState(0);
  const [susunan, setSusunan] = useState<number[]>([]);
  const [cocokPilih, setCocokPilih] = useState<string | null>(null);
  const [cocokSelesai, setCocokSelesai] = useState<Set<string>>(new Set());
  const [cocokGetar, setCocokGetar] = useState<string | null>(null);
  const hasil = useRef<{ kataId: string; benar: boolean }[]>([]);
  const [ringkas, setRingkas] = useState({ benar: 0, jumlah: 0 });
  const mulai = useRef(0);
  useHitungWaktu('belajar');

  useEffect(() => {
    mulai.current = kiniMs();
    cekBelajar(repo, anak).then((s) => {
      const r = ruteHalangan(s);
      if (r) router.replace(r);
    });
  }, [repo, anak, router]);

  const dengar = useMemo(() => (unit && antreAwal ? soalDengarSesi(unit, paket, jatuhTempo(antreAwal, kiniMs())) : []), [unit, paket, antreAwal]);
  const permainan = unit?.permainan[0];
  const kataMain = useMemo(() => (permainan && unit ? permainan.kata.map((id) => unit.kosakata.find((k) => k.id === id)).filter((k): k is Kosakata => !!k) : []), [permainan, unit]);
  const kananMain = useMemo(() => acak(kataMain, buatAcak(`${idUnit}|main`)), [kataMain, idUnit]);

  if (!unit) return null;
  const langkahKe = urutan.indexOf(bagian);
  const lanjutBagian = () => {
    const b = urutan[langkahKe + 1];
    setBagian(b);
    setI(0);
    setPilihan(null);
    setSalahKe(0);
    setSusunan([]);
    if (b === 'dengar' && dengar[0]) setTimeout(() => ucapkan(dengar[0].ucapan, 'en-US'), 300);
    if (b === 'hasil') simpan();
  };
  const simpan = async () => {
    const antre = (await repo.nilai<KataUlang[]>(`inggris_ulang:${anak.id}`)) ?? [];
    let a = antre;
    for (const h of hasil.current) {
      const asal = paket.unit.find((u) => u.kosakata.some((k) => k.id === h.kataId));
      a = perbaruiUlang(a, h.kataId, asal?.id ?? unit.id, h.benar, kiniMs());
    }
    await repo.aturNilai(`inggris_ulang:${anak.id}`, a, anak.id);
    const benar = hasil.current.filter((h) => h.benar).length;
    setRingkas({ benar, jumlah: hasil.current.length });
    await repo.simpanSesi(
      { id: buatId(), anak_id: anak.id, jenis: 'inggris', mode: 'sendiri', kelas: anak.kelas, level: unit.nomor, rujukan: unit.id, mulai: new Date(mulai.current).toISOString(), selesai: sekarangIso(), durasiDetik: Math.round((kiniMs() - mulai.current) / 1000), benar, jumlah: hasil.current.length, tambahan: { tingkat } },
      hasil.current.map((h, k) => ({ urutan: k + 1, soal: cariKata(paket, h.kataId)?.kata ?? h.kataId, butirId: h.kataId, kunci: cariKata(paket, h.kataId)?.kata ?? '', jawaban: '', benar: h.benar, detik: 0, hapusN: 0, topik: unit.id })),
    );
    await repo.catatTopik(anak.id, 'ing', unit.id, benar, hasil.current.length - benar);
    await perbaruiInti(repo, anak);
    mainkanBunyi(repo, anak.id, 'pesta');
  };

  // ---------- isi tiap bagian ----------
  let isi: React.ReactNode = null;
  let tombol: React.ReactNode = null;

  if (bagian === 'kenal') {
    isi = (
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        {unit.kosakata.map((k) => (
          <Pressable key={k.id} accessibilityRole="button" accessibilityLabel={`${k.kata}, ${k.arti}`} onPress={() => ucapkan(k.kata, 'en-US')} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 12, borderRadius: 24, backgroundColor: warna.putih }}>
            <View style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: UNGU.muda, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 42 }}>{k.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 26, color: warna.teks }}>{k.kata}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>{k.arti}</Text>
            </View>
            <TombolSuara teks={k.kata} bahasa="en-US" ukuran={52} latar={UNGU.utama} warnaIkon="#FFFFFF" />
          </Pressable>
        ))}
      </ScrollView>
    );
    tombol = <Tombol label="Lanjut: pola kalimat" besar onPress={lanjutBagian} />;
  } else if (bagian === 'pola') {
    isi = (
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        {unit.pola.map((p) => (
          <View key={p.id} style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>{p.kalimat}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>{p.arti}</Text>
            </View>
            <TombolSuara teks={p.kalimat} bahasa="en-US" ukuran={52} latar={UNGU.utama} warnaIkon="#FFFFFF" />
          </View>
        ))}
      </ScrollView>
    );
    tombol = <Tombol label="Lanjut: dengar lalu pilih" besar onPress={lanjutBagian} />;
  } else if (bagian === 'dengar') {
    const d = dengar[i];
    const kunci = d ? cariKata(paket, d.kunci) : undefined;
    const pilihanKata = d ? acak([d.kunci, ...d.pengecoh], buatAcak(d.id)).map((id) => cariKata(paket, id)).filter((k): k is Kosakata => !!k) : [];
    const sudahBenar = pilihan === d?.kunci;
    isi = d && kunci ? (
      <View style={{ gap: 16 }}>
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
        {sudahBenar ? (
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua }}>
            Betul! ✓ {kunci.kata} = {kunci.arti}.
          </Text>
        ) : pilihan ? (
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: '#B86E00' }}>
            {salahKe >= 2 ? `Petunjuk: carilah gambar ${kunci.arti}.` : 'Hampir! Dengar sekali lagi, yuk.'}
          </Text>
        ) : null}
      </View>
    ) : null;
    tombol = (
      <Tombol
        label={i + 1 < dengar.length ? 'Soal berikutnya' : 'Lanjut'}
        besar
        nonaktif={!sudahBenar}
        onPress={() => {
          if (i + 1 < dengar.length) {
            setI(i + 1);
            setPilihan(null);
            setSalahKe(0);
            setTimeout(() => ucapkan(dengar[i + 1].ucapan, 'en-US'), 250);
          } else lanjutBagian();
        }}
      />
    );
  } else if (bagian === 'susun') {
    const s = unit.susun[i];
    const kata = acakSusun(s.kalimat, s.id);
    const tersusun = susunan.map((k) => kata[k]).join(' ');
    const lengkap = susunan.length === kata.length;
    const tepat = lengkap && tersusun === s.kalimat;
    isi = (
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TombolSuara teks={s.kalimat} bahasa="en-US" ukuran={52} latar={UNGU.utama} warnaIkon="#FFFFFF" />
          <Text style={{ flex: 1, fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>Susun kalimat: {s.arti}</Text>
        </View>
        <View style={{ minHeight: 80, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: tepat ? warna.hijauSegar : lengkap ? warna.oranye : '#CDBFEA', backgroundColor: warna.putih, padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {susunan.map((k, n) => (
            <Pressable key={`${k}-${n}`} accessibilityRole="button" onPress={() => !tepat && setSusunan(susunan.filter((_, x) => x !== n))} style={{ paddingHorizontal: 14, height: 46, borderRadius: 12, backgroundColor: UNGU.muda, justifyContent: 'center' }}>
              <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks }}>{kata[k]}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {kata.map((k, n) =>
            susunan.includes(n) ? null : (
              <Pressable key={n} accessibilityRole="button" accessibilityLabel={k} onPress={() => setSusunan([...susunan, n])} style={{ paddingHorizontal: 14, height: 50, borderRadius: 12, backgroundColor: warna.putih, borderWidth: 2, borderColor: '#CDBFEA', justifyContent: 'center' }}>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 19, color: warna.teks }}>{k}</Text>
              </Pressable>
            ),
          )}
        </View>
        {tepat ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua }}>Betul! ✓ {s.kalimat}</Text> : lengkap ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: '#B86E00' }}>Hampir! Ketuk kata untuk mengembalikannya, lalu coba lagi. Dengar contohnya juga boleh.</Text> : null}
      </View>
    );
    tombol = (
      <Tombol
        label={i + 1 < unit.susun.length ? 'Kalimat berikutnya' : 'Lanjut: permainan'}
        besar
        nonaktif={!tepat}
        onPress={() => {
          mainkanBunyi(repo, anak.id, 'ting');
          if (i + 1 < unit.susun.length) {
            setI(i + 1);
            setSusunan([]);
          } else lanjutBagian();
        }}
      />
    );
  } else if (bagian === 'main') {
    const semuaCocok = cocokSelesai.size === kataMain.length;
    isi = (
      <View style={{ gap: 12 }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 17, color: warna.teks }}>Cocokkan kata dengan gambarnya. Ketuk kata, lalu ketuk gambar.</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, gap: 10 }}>
            {kataMain.map((k) => (
              <Pressable
                key={k.id}
                accessibilityRole="button"
                accessibilityLabel={k.kata}
                disabled={cocokSelesai.has(k.id)}
                onPress={() => {
                  setCocokPilih(k.id);
                  ucapkan(k.kata, 'en-US');
                }}
                style={{ height: 64, borderRadius: 16, borderWidth: 3, borderColor: cocokSelesai.has(k.id) ? warna.hijauSegar : cocokPilih === k.id ? UNGU.utama : warna.kremBatang, backgroundColor: cocokSelesai.has(k.id) ? warna.hijauMuda : warna.putih, justifyContent: 'center', alignItems: 'center', opacity: cocokSelesai.has(k.id) ? 0.6 : 1 }}
              >
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>{k.kata}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            {kananMain.map((k) => (
              <View key={k.id} style={{ height: 64 }}>
                <KartuGambar
                  kecil
                  emoji={k.emoji}
                  aksesLabel={k.arti}
                  keadaan={cocokSelesai.has(k.id) ? 'benar' : cocokGetar === k.id ? 'keliru' : 'biasa'}
                  onPress={
                    cocokSelesai.has(k.id) || !cocokPilih
                      ? undefined
                      : () => {
                          if (cocokPilih === k.id) {
                            setCocokSelesai(new Set([...cocokSelesai, k.id]));
                            setCocokPilih(null);
                            mainkanBunyi(repo, anak.id, 'plop');
                          } else {
                            setCocokGetar(k.id);
                            hasil.current.push({ kataId: cocokPilih, benar: false });
                            setTimeout(() => setCocokGetar(null), 500);
                          }
                        }
                  }
                />
              </View>
            ))}
          </View>
        </View>
        {semuaCocok ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.hijauTua }}>Semua cocok! ✓</Text> : null}
      </View>
    );
    tombol = <Tombol label="Selesai" besar nonaktif={!semuaCocok} onPress={lanjutBagian} />;
  } else {
    isi = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Pinci ekspresi="merayakan" ukuran={130} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 32, color: warna.hijauTua }}>Great job!</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks, textAlign: 'center' }}>
          Unit {unit.nomor} selesai. Kamu kenal {unit.kosakata.length} kata baru.
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Langsung tepat: {ringkas.benar} dari {ringkas.jumlah}</Text>
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.hijauTua }}>Tersimpan ✓</Text>
      </View>
    );
    tombol = <Tombol label="Kembali ke daftar unit" besar onPress={() => router.replace('/inggris')} />;
  }

  const labelBagian: Record<Bagian, string> = { kenal: 'Kenal kata', pola: 'Pola kalimat', dengar: 'Dengar lalu pilih', susun: 'Susun kata', main: 'Permainan', hasil: 'Selesai' };
  return (
    <Layar bawah={<View style={{ padding: 16 }}>{tombol}</View>}>
      <KepalaLayar judul={unit.tema} />
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: UNGU.teks, marginTop: -14, marginLeft: 52 }}>
        Tingkat {tingkat} · Unit {unit.nomor} · {unit.judul}
      </Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {urutan.slice(0, -1).map((b, n) => (
          <View key={b} style={{ flex: 1, gap: 4 }}>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: n <= langkahKe ? UNGU.utama : warna.kremBatang }} />
            <Text numberOfLines={1} style={{ fontFamily: huruf.anak, fontSize: 11, color: warna.teksKedua, textAlign: 'center' }}>
              {labelBagian[b]}
            </Text>
          </View>
        ))}
      </View>
      {isi}
    </Layar>
  );
}
