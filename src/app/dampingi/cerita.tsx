/**
 * D10 Ceritakan Lagi (rancangan 13 bagian 3.3–3.4, PROMPT-LANJUTAN-KOMIK tahap 6).
 * Panel tanpa teks + kata bantu, naskah orang tua di atas, "Dengar contoh panel ini", bantuan bertingkat,
 * daftar centang, pertanyaan renungan, lalu Pinci merayakan usaha. Hasil TIDAK menjadi nilai.
 * Tombol rekam hanya tampil kalau Izin 8 menyala (CLAUDE.md aturan 12); yang disimpan di data hanya `adaRekaman` ya/tidak.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { kiniMs } from '@/data/alat';
import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { perbaruiUlang, type KataUlang } from '@/fitur/inggris';
import type { Komik } from '@/isi/inggris/komik';
import { PAKET_INGGRIS } from '@/isi/inggris/paket';
import { cariKomik, teksTokoh } from '@/isi/inggris/paketKomik';
import { Tombol } from '@/komponen/dasar';
import { bantuanTingkat, dengarPanel, KataBantu, komikUntukAnak, PilihKomik } from '@/komponen/komik/alatDampingi';
import { GambarPanel } from '@/komponen/komik/GambarPanel';
import { Pinci } from '@/komponen/Pinci';
import { Perekam, putarRekaman } from '@/komponen/rekam/Perekam';
import { izin8Nyala } from '@/layanan/rekaman';
import { hentikanSuara, ucapkan } from '@/layanan/suara';

type Tahap = 'cerita' | 'centang' | 'renungan' | 'selesai';

const CENTANG = [
  { kunci: 'centangTokoh', label: 'Menyebut tokoh', cara: 'Nama tokoh sama dalam dua bahasa.' },
  { kunci: 'centangUrutan', label: 'Bercerita sesuai urutan panel', cara: 'Lihat panel yang ditunjuk anak.' },
  { kunci: 'centangInggris', label: 'Sebagian besar dalam Bahasa Inggris', cara: 'Boleh campur Bahasa Indonesia. Itu wajar di awal.' },
  { kunci: 'centangSelesai', label: 'Berani bercerita sampai selesai', cara: 'Usaha dihargai, bukan hanya ketepatan.' },
] as const;

type KunciCentang = (typeof CENTANG)[number]['kunci'];

function Kotak({ ya, label, cara, onPress }: { ya: boolean; label: string; cara?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: ya }} accessibilityLabel={label} onPress={onPress} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: ya ? warna.hijauMuda : warna.putih, borderWidth: 2, borderColor: ya ? warna.hijauDaun : warna.kremGaris }}>
      <View style={{ width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: warna.hijauDaun, backgroundColor: ya ? warna.hijauDaun : warna.putih, alignItems: 'center', justifyContent: 'center' }}>
        {ya ? <Text style={{ color: warna.putih, fontSize: 18, fontWeight: '800' }}>✓</Text> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>{label}</Text>
        {cara ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>{cara}</Text> : null}
      </View>
    </Pressable>
  );
}

export default function CeritakanLagi() {
  const router = useRouter();
  const { komik: komikParam } = useLocalSearchParams<{ komik?: string }>();
  const { anakAktif, repo, keluarga } = useData();
  const [pilihan, setPilihan] = useState<Komik | null>(null);
  const komik = pilihan ?? (komikParam ? (cariKomik(komikParam) ?? null) : null);
  const izin8 = useMuat(async (r) => izin8Nyala(r), false);
  const dibaca = useMuat(
    async (r) => (anakAktif ? new Set((await r.daftarSesi(anakAktif.id)).map((s) => (s.tambahan as { komik?: string } | undefined)?.komik).filter((x): x is string => !!x)) : new Set<string>()),
    new Set<string>(),
    [anakAktif?.id],
  );
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  if (!anakAktif) return null;
  if (!komik)
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>Ceritakan Lagi</Text>
        <PilihKomik daftar={komikUntukAnak(anakAktif)} dibaca={dibaca} onPilih={setPilihan} judul={`Pilih komik yang sudah dibaca ${anakAktif.nama}. Ia menceritakannya kembali ke ${sapaan} dalam Bahasa Inggris.`} />
      </ScrollView>
    );
  return <Alur key={komik.id} komik={komik} izin8={izin8} anakId={anakAktif.id} nama={anakAktif.nama} sapaan={sapaan} repo={repo} onKembali={() => router.back()} />;
}

function Alur({ komik, izin8, anakId, nama, sapaan, repo, onKembali }: { komik: Komik; izin8: boolean; anakId: string; nama: string; sapaan: string; repo: ReturnType<typeof useData>['repo']; onKembali: () => void }) {
  const { width } = useWindowDimensions();
  const lebar = Math.min(width - 32, 420);
  const [tahap, setTahap] = useState<Tahap>('cerita');
  const [ke, setKe] = useState(0);
  const [naskahBuka, setNaskahBuka] = useState(true);
  const [bantuBuka, setBantuBuka] = useState(false);
  const [centang, setCentang] = useState<Record<KunciCentang, boolean>>({ centangTokoh: false, centangUrutan: false, centangInggris: false, centangSelesai: false });
  const [kataDicentang, setKataDicentang] = useState<string[]>([]);
  const [rekamanTerakhir, setRekamanTerakhir] = useState<Record<string, string>>({});
  const adaRekaman = useRef(false);
  const bantuan = bantuanTingkat(komik.tingkat);
  const panel = komik.panel[ke];
  const akhir = ke === komik.panel.length - 1;
  const unit = useMemo(() => PAKET_INGGRIS[komik.tingkat].unit.find((u) => u.id === komik.unit), [komik]);

  const simpan = async () => {
    await repo.simpanCeritaUlang({ anak_id: anakId, komikId: komik.id, ...centang, kataTargetDicentang: kataDicentang, adaRekaman: adaRekaman.current });
    // Kata target yang tidak dicentang masuk antrean ulang berjarak (rancangan 13 bagian 3.4).
    if (unit) {
      let a = (await repo.nilai<KataUlang[]>(`inggris_ulang:${anakId}`)) ?? [];
      for (const kata of komik.kataTarget) {
        if (kataDicentang.includes(kata)) continue;
        const k = unit.kosakata.find((x) => x.kata.toLowerCase() === kata.toLowerCase());
        if (k) a = perbaruiUlang(a, k.id, unit.id, false, kiniMs());
      }
      await repo.aturNilai(`inggris_ulang:${anakId}`, a, anakId);
    }
  };

  if (tahap === 'cerita')
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, alignItems: 'center' }}>
        <Pressable accessibilityRole="button" onPress={() => setNaskahBuka((x) => !x)} style={{ alignSelf: 'stretch', backgroundColor: warna.oranyeMuda, borderRadius: 16, padding: 14, gap: 6 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: '#B86E00' }}>
            Untuk {sapaan} {naskahBuka ? '▲' : '▼'}
          </Text>
          {naskahBuka
            ? komik.naskahOrangTua.langkah.map((l, i) => (
                <Text key={i} style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teks }}>
                  {i + 1}. {teksTokoh(l)}
                </Text>
              ))
            : null}
          {naskahBuka ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Biarkan ia menjawab dulu. Jangan langsung membetulkan.</Text> : null}
        </Pressable>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>
          {teksTokoh(komik.judul)} · panel {ke + 1} dari {komik.panel.length}
        </Text>
        <GambarPanel panel={panel} lebar={lebar} />
        <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teksKedua, textAlign: 'center' }}>{bantuan.kalimat}</Text>
        {bantuan.kataBantuTampil === 'selalu' || bantuBuka ? <KataBantu kata={panel.kataBantu} /> : null}
        {bantuan.kataBantuTampil === 'ketuk' && !bantuBuka ? <Tombol label="Tampilkan kata bantu" varian="garis" onPress={() => setBantuBuka(true)} /> : null}
        <Tombol label="🔊 Dengar contoh panel ini" varian="garis" onPress={() => dengarPanel(panel, komik.tingkat)} />
        {izin8 ? (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Perekam
              key={panel.id}
              anakId={anakId}
              komikId={komik.id}
              panelId={panel.id}
              jenis="kalimat"
              onSelesai={(c) => {
                adaRekaman.current = true;
                setRekamanTerakhir((r) => ({ ...r, [panel.id]: c.berkas }));
              }}
            />
            {rekamanTerakhir[panel.id] ? <Tombol label="▶ Dengar suaraku" varian="garis" onPress={() => putarRekaman(rekamanTerakhir[panel.id])} /> : null}
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
          <Tombol label="Sebelumnya" varian="garis" nonaktif={ke === 0} style={{ flex: 1 }} onPress={() => setKe((x) => Math.max(0, x - 1))} />
          <Tombol
            label={akhir ? 'Selesai bercerita' : 'Berikutnya'}
            style={{ flex: 1 }}
            onPress={() => {
              hentikanSuara();
              if (akhir) setTahap('centang');
              else {
                setKe((x) => x + 1);
                setBantuBuka(false);
              }
            }}
          />
        </View>
        {izin8 && akhir ? (
          <View style={{ alignItems: 'center', gap: 6, paddingTop: 6 }}>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Atau rekam seluruh cerita sekaligus (paling lama 2 menit):</Text>
            <Perekam anakId={anakId} komikId={komik.id} panelId={null} jenis="utuh" onSelesai={() => (adaRekaman.current = true)} />
          </View>
        ) : null}
      </ScrollView>
    );

  if (tahap === 'centang')
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>Daftar centang {sapaan}</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Bukan nilai. Centang yang Anda lihat atau dengar.</Text>
        {CENTANG.map((c) => (
          <Kotak key={c.kunci} ya={centang[c.kunci]} label={c.label} cara={c.cara} onPress={() => setCentang((x) => ({ ...x, [c.kunci]: !x[c.kunci] }))} />
        ))}
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks, marginTop: 6 }}>Memakai kata baru</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Ketuk 🔊 untuk mendengar kata. Ketuk kata yang Anda dengar diucapkan {nama}.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {komik.kataTarget.map((k) => {
            const ya = kataDicentang.includes(k);
            return (
              <View key={k} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 22, borderWidth: 2, borderColor: ya ? warna.hijauDaun : warna.kremGaris, backgroundColor: ya ? warna.hijauMuda : warna.putih, overflow: 'hidden' }}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Dengar ${k}`} onPress={() => ucapkan(k, 'en-US', { pelan: true })} style={{ paddingLeft: 12, paddingRight: 6, height: 44, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16 }}>🔊</Text>
                </Pressable>
                <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: ya }} accessibilityLabel={k} onPress={() => setKataDicentang((x) => (ya ? x.filter((y) => y !== k) : [...x, k]))} style={{ paddingRight: 14, paddingLeft: 4, height: 44, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: warna.teks }}>
                    {ya ? '✓ ' : ''}
                    {k}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <Tombol label="Lanjut" style={{ marginTop: 10 }} onPress={() => setTahap('renungan')} />
      </ScrollView>
    );

  if (tahap === 'renungan')
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 22, color: warna.teks }}>Pertanyaan renungan</Text>
        <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Tanyakan dalam Bahasa Indonesia. Tidak ada jawaban benar atau salah, dan tidak dinilai.</Text>
        <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 19, lineHeight: 28, color: warna.teks }}>{teksTokoh(komik.naskahOrangTua.renungan)}</Text>
        </View>
        <Tombol
          label="Selesai"
          onPress={async () => {
            await simpan();
            setTahap('selesai');
            ucapkan(`${nama}, kamu bercerita dalam Bahasa Inggris! Hebat.`, 'id-ID');
          }}
        />
      </ScrollView>
    );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, alignItems: 'center' }}>
      <Pinci ekspresi="merayakan" ukuran={140} />
      <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.teks, textAlign: 'center' }}>Kamu bercerita dalam Bahasa Inggris! Hebat.</Text>
      <Text style={{ fontSize: 36 }}>⭐</Text>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua, textAlign: 'center' }}>Tersimpan untuk rapor mingguan. Bukan nilai.</Text>
      <Tombol label="Kembali ke menu Dampingi" onPress={onKembali} style={{ alignSelf: 'stretch' }} />
    </ScrollView>
  );
}
