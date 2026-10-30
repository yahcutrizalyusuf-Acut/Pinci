/** Periksa satu topik/simulasi/teks TKA: soal, pilihan, kunci, pembahasan, lalu tanda periksa. */
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { sekarangIso } from '@/data/alat';
import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import { AWALAN_PERIKSA, daftarKelompok, kunciPeriksa, pilihanKunci, ringkasPeriksa, teksKunci, type HasilPeriksa } from '@/fitur/periksa-tka';
import type { Butir } from '@/isi/tka/jenis';
import { paketTka } from '@/isi/tka/paket';
import { KepalaLayar } from '@/komponen/dasar';
import { Layar } from '@/komponen/Layar';
import { Stimulus } from '@/komponen/tka/Stimulus';
import { TeksKaya } from '@/komponen/tka/TeksKaya';

const KELOMPOK = daftarKelompok(paketTka);
const BENTUK = { pg: 'Pilihan ganda', pgk: 'Pilihan ganda kompleks', pgkat: 'Benar atau salah' } as const;

function Tanda({ id, hasil, onSimpan }: { id: string; hasil?: HasilPeriksa; onSimpan: (h: HasilPeriksa) => void }) {
  const [catatan, setCatatan] = useState(hasil?.catatan ?? '');
  const [tulis, setTulis] = useState(false);
  const tombol = (label: string, aktif: boolean, latar: string, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} untuk ${id}`}
      accessibilityState={{ selected: aktif }}
      onPress={onPress}
      style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: aktif ? latar : warna.putih, borderWidth: 2, borderColor: latar }}
    >
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teks }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {tombol('✓ Sudah benar', hasil?.status === 'layak', '#BDE8CF', () => {
          setTulis(false);
          onSimpan({ status: 'layak', waktu: sekarangIso() });
        })}
        {tombol('✏️ Perlu diperbaiki', hasil?.status === 'perlu_diperbaiki', '#FFE1B3', () => setTulis(true))}
      </View>
      {tulis || hasil?.status === 'perlu_diperbaiki' ? (
        <View style={{ gap: 6 }}>
          <TextInput
            accessibilityLabel={`Catatan perbaikan ${id}`}
            value={catatan}
            onChangeText={setCatatan}
            placeholder="Apa yang perlu diperbaiki? (boleh dikosongkan)"
            multiline
            style={{ fontFamily: huruf.ortu, fontSize: 14, minHeight: 60, borderWidth: 1, borderColor: '#D5D9E0', borderRadius: 10, padding: 10, backgroundColor: warna.putih, textAlignVertical: 'top' }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Simpan catatan ${id}`}
            onPress={() => {
              setTulis(false);
              onSimpan({ status: 'perlu_diperbaiki', catatan: catatan.trim() || undefined, waktu: sekarangIso() });
            }}
            style={{ alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, backgroundColor: warna.oranye }}
          >
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.biruTinta }}>Simpan catatan</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function KartuButir({ b, bagian, hasil, onSimpan }: { b: Butir; bagian: string; hasil?: HasilPeriksa; onSimpan: (h: HasilPeriksa) => void }) {
  return (
    <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 10 }}>
      <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 13, color: warna.teksKedua }}>
        {b.id} · {bagian} · {BENTUK[b.bentuk]}
      </Text>
      {b.stimulus?.length ? (
        <View style={{ backgroundColor: '#F6F7F9', borderRadius: 12, padding: 10 }}>
          <Stimulus bagian={b.stimulus} ukuran={15} />
        </View>
      ) : null}
      <TeksKaya teks={b.pertanyaan} ukuran={16} />
      <View style={{ gap: 6 }}>
        {b.pilihan.map((p, i) => {
          const benar = pilihanKunci(b, p.huruf);
          const kat = b.bentuk === 'pgkat' ? (b.kunci[i] === 'B' ? b.kategori[0] : b.kategori[1]) : null;
          return (
            <View key={p.huruf} style={{ flexDirection: 'row', gap: 8, padding: 8, borderRadius: 10, backgroundColor: benar ? '#E2F5EA' : '#F6F7F9', borderWidth: benar ? 2 : 0, borderColor: warna.hijauDaun }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.teks, width: 20 }}>{p.huruf}</Text>
              <View style={{ flex: 1 }}>
                <TeksKaya teks={p.teks} ukuran={15} />
                {b.pengecoh[p.huruf] ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Alasan pengecoh: {b.pengecoh[p.huruf].alasan}</Text> : null}
              </View>
              {benar ? <Text style={{ fontFamily: huruf.ortuTebal, color: warna.hijauTua }}>✓</Text> : null}
              {kat ? <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 13, color: warna.teks }}>{kat}</Text> : null}
            </View>
          );
        })}
      </View>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.hijauTua }}>Kunci: {teksKunci(b)}</Text>
      {b.petunjuk?.length ? (
        <View>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teks }}>Petunjuk</Text>
          <TeksKaya teks={b.petunjuk.join(' ')} ukuran={14} />
        </View>
      ) : null}
      {b.pembahasan ? (
        <View>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teks }}>Pembahasan</Text>
          <TeksKaya teks={b.pembahasan} ukuran={14} />
        </View>
      ) : null}
      {b.catatan?.length ? (
        <View style={{ backgroundColor: '#FFF6D6', borderRadius: 10, padding: 8 }}>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teks }}>Catatan pemeriksaan: {b.catatan.join(' · ')}</Text>
        </View>
      ) : null}
      <Tanda id={b.id} hasil={hasil} onSimpan={onSimpan} />
    </View>
  );
}

export default function PeriksaKelompok() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { repo } = useData();
  const k = KELOMPOK.find((x) => x.id === id);
  const muat = useMuat(
    async (r) => new Map((await r.nilaiAwalan<HasilPeriksa>(AWALAN_PERIKSA)).map(([kunci, v]) => [kunci.slice(AWALAN_PERIKSA.length), v])),
    new Map<string, HasilPeriksa>(),
    [id],
  );
  const [ubahan, setUbahan] = useState<Map<string, HasilPeriksa>>(new Map());
  const hasil = new Map([...muat, ...ubahan]);
  if (!k) return null;
  const simpan = (butirId: string) => (h: HasilPeriksa) => {
    setUbahan((u) => new Map(u).set(butirId, h));
    void repo.aturNilai(kunciPeriksa(butirId), h);
  };
  const r = ringkasPeriksa(k, hasil);
  return (
    <Layar gulir latar={warna.abuTerang}>
      <KepalaLayar judul={`${k.id} · ${k.judul}`} />
      <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: warna.teksKedua }}>
        {r.layak} sudah benar · {r.perlu} perlu diperbaiki · {r.belum} belum diperiksa
      </Text>
      {k.teks ? (
        <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 14, gap: 10 }}>
          <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 13, color: warna.teksKedua }}>
            {k.teks.id} · Teks bacaan · {k.teks.jumlahKata} kata
          </Text>
          <Stimulus bagian={k.teks.isi} ukuran={15} />
          <Tanda id={k.teks.id} hasil={hasil.get(k.teks.id)} onSimpan={simpan(k.teks.id)} />
        </View>
      ) : null}
      {k.butir.map(({ b, bagian }) => (
        <KartuButir key={b.id} b={b} bagian={bagian} hasil={hasil.get(b.id)} onSimpan={simpan(b.id)} />
      ))}
    </Layar>
  );
}
