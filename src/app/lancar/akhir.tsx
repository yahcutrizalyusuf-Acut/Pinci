/** A06 Akhir lembar: benar, waktu, rekor sendiri, status simpan, pilihan perasaan hewan. Turun level tidak diumumkan. */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { huruf, warna } from '@/desain/token';
import type { HasilSimpan } from '@/fitur/lancar';
import { ambilTitipan } from '@/fitur/sementara';
import { mainkanBunyi } from '@/layanan/bunyi';
import { Tombol } from '@/komponen/dasar';
import { Ikon } from '@/komponen/Ikon';
import { Layar } from '@/komponen/Layar';
import { Pinci } from '@/komponen/Pinci';

export const PERASAAN = [
  { kode: 'burung', emoji: '🐦', label: 'Burung terbang' },
  { kode: 'rusa', emoji: '🦌', label: 'Rusa lincah' },
  { kode: 'penyu', emoji: '🐢', label: 'Penyu pelan' },
  { kode: 'gajah', emoji: '🐘', label: 'Gajah ngantuk' },
];

export function formatDurasi(detik: number) {
  const m = Math.floor(detik / 60);
  const d = detik % 60;
  return m > 0 ? `${m} menit ${d} detik` : `${d} detik`;
}
const mmss = (detik: number) => `${Math.floor(detik / 60)}:${String(detik % 60).padStart(2, '0')}`;

export default function AkhirLembar() {
  const router = useRouter();
  const { repo, anakAktif } = useData();
  const hasil = ambilTitipan<HasilSimpan>('akhir-lembar');
  const [perasaan, setPerasaan] = useState<string | null>(null);
  const status = useMuat((r) => (hasil ? r.statusBaris(hasil.sesi.id) : Promise.resolve('tersimpan' as const)), 'tersimpan', [hasil?.sesi.id]);
  useEffect(() => {
    if (hasil?.naik || hasil?.rekorBaru) mainkanBunyi(repo, anakAktif?.id, 'pesta');
    else mainkanBunyi(repo, anakAktif?.id, 'ting');
  }, [hasil, repo, anakAktif?.id]);
  if (!hasil) {
    return (
      <Layar>
        <Tombol label="Kembali ke beranda" onPress={() => router.replace('/anak')} />
      </Layar>
    );
  }
  const penempatan = hasil.sesi.jenis === 'penempatan';
  return (
    <Layar
      bawah={
        <View style={{ padding: 16 }}>
          <Tombol label="Kembali ke beranda" besar onPress={() => router.replace('/anak')} />
        </View>
      }
    >
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 8 }}>
          <Pinci ekspresi="merayakan" ukuran={104} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: huruf.judul, fontSize: 40, color: warna.hijauTua }}>{hasil.naik ? 'Naik level!' : 'Selesai!'}</Text>
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>
              {penempatan ? 'Tes singkat Lancar' : `Lancar Matematika · Level ${hasil.sesi.level}`}
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: warna.putih, borderRadius: 24, padding: 20, gap: 10 }}>
          <Text style={{ fontFamily: huruf.anak, color: warna.teks }}>
            <Text style={{ fontFamily: huruf.judul, fontSize: 48 }}>{hasil.benar}</Text>
            <Text style={{ fontSize: 22 }}>  dari {hasil.jumlah} benar</Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ikon nama="jam" ukuran={22} />
            <Text style={{ fontFamily: huruf.anak, fontSize: 18, color: warna.teks }}>{formatDurasi(hasil.detik)}</Text>
          </View>
          {hasil.rekorBaru ? (
            <View style={{ alignSelf: 'flex-start', backgroundColor: warna.oranyeMuda, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
              <Text style={{ fontFamily: huruf.anakTebal, fontSize: 16, color: warna.teks }}>
                Rekor baru!{hasil.rekorLama !== null ? ` (tadi ${mmss(hasil.rekorLama)})` : ''}
              </Text>
            </View>
          ) : null}
          {penempatan ? (
            <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teksKedua }}>Kamu mulai dari Level {hasil.levelSesudah}.</Text>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.hijauTua }}>Tersimpan ✓</Text>
            {status === 'terkirim' ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 15, color: warna.hijauTua }}>Terkirim ✓✓</Text> : null}
          </View>
        </View>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 20, color: warna.teks }}>Latihan tadi rasanya seperti hewan apa?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {PERASAAN.map((p) => (
            <Pressable
              key={p.kode}
              accessibilityRole="button"
              accessibilityLabel={p.label}
              accessibilityState={{ selected: perasaan === p.kode }}
              onPress={async () => {
                setPerasaan(p.kode);
                await repo.aturPerasaan(hasil.sesi.id, p.kode);
              }}
              style={{
                width: '47%',
                height: 88,
                borderRadius: 16,
                backgroundColor: perasaan === p.kode ? warna.hijauPil : warna.putih,
                borderWidth: 2,
                borderColor: perasaan === p.kode ? warna.hijauDaun : warna.kremGaris,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 34 }}>{p.emoji}</Text>
              <Text style={{ fontFamily: huruf.anak, fontSize: 15, color: warna.teks }}>{p.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Layar>
  );
}
