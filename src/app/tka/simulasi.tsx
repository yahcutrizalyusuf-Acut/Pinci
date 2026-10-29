/**
 * K15 Simulasi bertempo (S1–S5, 30 butir, 75 menit) dan mini try out mingguan (6 soal, 15 menit).
 * Tempo tampil tenang (sisa menit, warna netral), tanpa hitung mundur merah. Tab Teks/Soal untuk stimulus panjang,
 * daftar soal + tanda ragu, kumpulkan, lalu pembahasan.
 * S1–S3: boleh jeda 3 kali. S4–S5 dan mini try out: tanpa jeda (Mode Ujian).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData, useMuat } from '@/data/konteks';
import { huruf, warna, warnaMapel } from '@/desain/token';
import { titip } from '@/fitur/sementara';
import { simpanLatihanTka, soalMiniTryOut, MAPEL_TKA } from '@/fitur/tka';
import { useHitungWaktu } from '@/fitur/waktu';
import type { Butir } from '@/isi/tka/jenis';
import { ambilSimulasi, type JawabanAnak } from '@/isi/tka/pemuat';
import { paketTka } from '@/isi/tka/paket';
import { GelembungPinci, KepalaLayar, Tombol } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { jawabanKosong, jawabanLengkap, PilihJawaban } from '@/komponen/tka/PilihJawaban';
import { Stimulus } from '@/komponen/tka/Stimulus';
import { TeksKaya } from '@/komponen/tka/TeksKaya';

function panjangStimulus(b: Butir) {
  return (b.stimulus ?? []).reduce((n, s) => n + (s.jenis === 'teks' ? s.isi.length : 200), 0);
}

export default function Simulasi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const anak = anakAktif!;
  const mini = id === 'mini';
  const sim = mini ? undefined : ambilSimulasi(paketTka, id);
  const kemajuan = useMuat((r) => r.kemajuanTopik(anak.id, MAPEL_TKA), null, [anak.id]);
  const benihMini = useMemo(() => `${anak.id}|${new Date().toDateString()}`, [anak.id]);
  const soal: Butir[] = useMemo(() => {
    if (!mini) return sim?.butir ?? [];
    if (!kemajuan) return [];
    return soalMiniTryOut(paketTka, kemajuan, new Date(), benihMini).map((s) => s.butir);
  }, [mini, sim, kemajuan, benihMini]);
  const totalDetik = (mini ? 15 : (sim?.waktuMenit ?? 75)) * 60;
  const bolehJeda = !mini && (id === 'S1' || id === 'S2' || id === 'S3');

  const [mulai, setMulai] = useState(false);
  const [jawaban, setJawaban] = useState<JawabanAnak[]>([]);
  const [ragu, setRagu] = useState<Set<number>>(new Set());
  const [i, setI] = useState(0);
  const [tab, setTab] = useState<'soal' | 'teks'>('teks');
  const [daftar, setDaftar] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [jeda, setJeda] = useState(false);
  const [jedaDipakai, setJedaDipakai] = useState(0);
  const [terpakai, setTerpakai] = useState(0);
  const waktuMulai = useRef(0);
  const detikPerSoal = useRef<number[]>([]);
  const masukSoal = useRef(0);
  const sudahKumpul = useRef(false);
  useHitungWaktu('belajar', !mulai || jeda);


  const kumpulkan = async () => {
    if (sudahKumpul.current) return;
    sudahKumpul.current = true;
    detikPerSoal.current[i] = (detikPerSoal.current[i] ?? 0) + (kiniMs() - masukSoal.current) / 1000;
    const sesi = await simpanLatihanTka(
      repo,
      anak,
      { jenis: mini ? 'mini_tryout' : 'simulasi', rujukan: mini ? 'mini' : id, mode: 'sendiri', mulai: waktuMulai.current, tambahan: { menitTerpakai: Math.round(terpakai / 60) } },
      soal.map((b, k) => ({ butir: b, jawaban: jawaban[k] ?? jawabanKosong(b), detik: detikPerSoal.current[k] ?? 0, petunjuk: 0 })),
    );
    titip('akhir-tka', { sesi, judul: mini ? 'Mini try out minggu ini' : `${id} · ${sim?.judul ?? ''}`, catatan: `Waktu terpakai ${Math.round(terpakai / 60)} menit.` });
    router.replace('/tka/akhir');
  };

  // Tempo: tidak berjalan saat jeda; waktu habis → kumpulkan otomatis dengan tenang.
  useEffect(() => {
    if (!mulai || jeda) return;
    const t = setInterval(() => setTerpakai((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [mulai, jeda]);
  useEffect(() => {
    if (mulai && terpakai >= totalDetik) kumpulkan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terpakai, mulai, totalDetik]);

  const pindah = (k: number) => {
    detikPerSoal.current[i] = (detikPerSoal.current[i] ?? 0) + (kiniMs() - masukSoal.current) / 1000;
    masukSoal.current = kiniMs();
    setI(k);
    setTab(soal[k]?.grupStimulus && soal[k]?.grupStimulus !== soal[i]?.grupStimulus ? 'teks' : 'soal');
    setDaftar(false);
  };

  if (!mini && !sim) return null;
  if (!mulai) {
    return (
      <Layar
        bawah={
          <View style={{ padding: 16 }}>
            <Tombol
              label="Mulai"
              besar
              nonaktif={soal.length === 0}
              onPress={() => {
                waktuMulai.current = kiniMs();
                masukSoal.current = kiniMs();
                setMulai(true);
              }}
            />
          </View>
        }
      >
        <KepalaLayar judul={mini ? 'Mini try out' : `Simulasi ${id}`} />
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <GelembungPinci
            ekspresi="semangat"
            judul={mini ? '6 soal, 15 menit' : `${soal.length} soal, ${sim?.waktuMenit} menit`}
            teks={
              mini
                ? 'Soal campuran dari topik yang sudah kamu pelajari. Kerjakan dengan tenang.'
                : `${sim?.mapel === 'mat' ? 'Matematika' : 'Bahasa Indonesia'}. Seperti ujian di komputer: boleh lompat soal dan menandai ragu.`
            }
          />
          <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 6 }}>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>• Ada tiga bentuk soal: pilihan ganda, pilih beberapa jawaban, dan Benar/Salah.</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>• {bolehJeda ? 'Boleh jeda paling banyak 3 kali.' : 'Tanpa jeda, seperti ujian sebenarnya. Minta Ayah atau Bunda menemani.'}</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>• Pembahasan muncul setelah dikumpulkan.</Text>
          </View>
          {mini && soal.length === 0 ? <Text style={{ fontFamily: huruf.anak, color: warna.teksKedua }}>Menyiapkan soal…</Text> : null}
        </View>
      </Layar>
    );
  }

  const b = soal[i];
  if (!b) return null;
  const sisaMenit = Math.max(0, Math.ceil((totalDetik - terpakai) / 60));
  const pakaiTab = panjangStimulus(b) > 350;
  const terjawab = soal.filter((s, k) => jawaban[k] !== undefined && jawabanLengkap(s, jawaban[k])).length;
  const w = warnaMapel[sim?.mapel ?? 'mat'];

  return (
    <Layar latar="#F7F3EA">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable accessibilityRole="button" onPress={() => setDaftar(true)} style={{ height: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: warna.putih, justifyContent: 'center' }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.teks }}>
            Soal {i + 1}/{soal.length} ▾
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <View accessibilityLabel={`Sisa waktu sekitar ${sisaMenit} menit`} style={{ height: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#EEF1F6', justifyContent: 'center' }}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua }}>Sisa ± {sisaMenit} menit</Text>
        </View>
        {bolehJeda ? (
          <Pressable
            accessibilityRole="button"
            disabled={jedaDipakai >= 3}
            onPress={() => {
              setJeda(true);
              setJedaDipakai(jedaDipakai + 1);
            }}
            style={{ height: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: warna.putih, justifyContent: 'center', opacity: jedaDipakai >= 3 ? 0.4 : 1 }}
          >
            <Text style={{ fontFamily: huruf.anak, fontSize: 15 }}>Jeda</Text>
          </Pressable>
        ) : null}
      </View>
      {pakaiTab ? (
        <View style={{ flexDirection: 'row', backgroundColor: '#E8E1D2', borderRadius: 12, padding: 3 }}>
          {(['teks', 'soal'] as const).map((t) => (
            <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: tab === t }} onPress={() => setTab(t)} style={{ flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === t ? warna.putih : 'transparent' }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.teks }}>{t === 'teks' ? 'Teks' : 'Soal'}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        {(!pakaiTab || tab === 'teks') && b.stimulus ? (
          <View style={{ backgroundColor: warna.putih, borderRadius: 14, padding: 14, gap: 8 }}>
            {b.judulStimulus ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: w.teks }}>{b.judulStimulus}</Text> : null}
            <Stimulus bagian={b.stimulus} ukuran={16} />
          </View>
        ) : null}
        {!pakaiTab || tab === 'soal' ? (
          <>
            <View style={{ backgroundColor: warna.putih, borderRadius: 14, padding: 14 }}>
              <TeksKaya teks={b.pertanyaan} ukuran={18} />
            </View>
            <PilihJawaban butir={b} jawaban={jawaban[i] ?? jawabanKosong(b)} onUbah={(j) => setJawaban((lama) => { const baru = [...lama]; baru[i] = j; return baru; })} />
          </>
        ) : null}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Tombol label="‹" varian="putih" nonaktif={i === 0} onPress={() => pindah(i - 1)} aksesLabel="Soal sebelumnya" />
        <Tombol
          label={ragu.has(i) ? 'Ragu ✓' : 'Ragu'}
          varian={ragu.has(i) ? 'oranye' : 'putih'}
          style={{ flex: 1 }}
          onPress={() => {
            const r = new Set(ragu);
            if (r.has(i)) r.delete(i);
            else r.add(i);
            setRagu(r);
          }}
        />
        {i + 1 < soal.length ? <Tombol label="›" onPress={() => pindah(i + 1)} aksesLabel="Soal berikutnya" /> : <Tombol label="Kumpulkan" style={{ flex: 1 }} onPress={() => setKonfirmasi(true)} />}
      </View>

      <Modal visible={daftar} transparent animationType="slide" onRequestClose={() => setDaftar(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setDaftar(false)} />
        <View style={{ backgroundColor: warna.putih, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 }}>
          <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18 }}>
            Daftar soal · terjawab {terjawab}/{soal.length}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {soal.map((s, k) => {
              const isi = jawabanLengkap(s, jawaban[k] ?? '');
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Soal ${k + 1}${isi ? ', terjawab' : ''}${ragu.has(k) ? ', ragu' : ''}`}
                  onPress={() => pindah(k)}
                  style={{ width: 46, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: ragu.has(k) ? warna.oranye : isi ? warna.hijauDaun : warna.abuTerang, borderWidth: k === i ? 3 : 1, borderColor: k === i ? warna.biruTinta : warna.abuGaris }}
                >
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>{k + 1}</Text>
                </Pressable>
              );
            })}
          </View>
          <Tombol label="Kumpulkan" onPress={() => { setDaftar(false); setKonfirmasi(true); }} />
        </View>
      </Modal>

      <Modal visible={konfirmasi} transparent animationType="fade" onRequestClose={() => setKonfirmasi(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 20, gap: 12 }}>
            <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20 }}>Kumpulkan sekarang?</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
              Terjawab {terjawab} dari {soal.length}.{ragu.size ? ` Ada ${ragu.size} soal bertanda ragu.` : ''}
            </Text>
            <Tombol label="Ya, kumpulkan" onPress={kumpulkan} />
            <Tombol label="Periksa lagi" varian="garis" onPress={() => setKonfirmasi(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={jeda} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(45,49,66,0.94)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: warna.kremLembut, borderRadius: 20, padding: 20, gap: 12, alignItems: 'center' }}>
            <Text style={{ fontFamily: huruf.judul, fontSize: 24 }}>Jeda</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua, textAlign: 'center' }}>Waktu berhenti. Jeda tersisa {3 - jedaDipakai} kali.</Text>
            <Tombol label="Lanjut" style={{ alignSelf: 'stretch' }} onPress={() => setJeda(false)} />
          </View>
        </View>
      </Modal>
    </Layar>
  );
}
