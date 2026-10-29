/** O12 Pengaturan waktu: batas belajar, waktu game 0–60, kapan game terbuka, jam tenang, bunyi, profil anak. */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData } from '@/data/konteks';
import { HEWAN, type PengaturanWaktu } from '@/data/jenis';
import { batasBelajarBawaan, gameBawaan } from '@/data/repositori';
import { huruf, warna } from '@/desain/token';
import { FormAnak } from '@/komponen/FormAnak';
import { Geser } from '@/komponen/Geser';
import { KepalaLayar, Tombol } from '@/komponen/dasar';

function Kotak({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 16, gap: 12 }}>{children}</View>;
}

function TombolBulat({ label, teks, onPress }: { label: string; teks: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: warna.abuGaris, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 24 }}>{teks}</Text>
    </Pressable>
  );
}

function Radio({ pilih, label, onPress }: { pilih: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: pilih }} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: pilih ? warna.hijauTua : '#6B6F80', alignItems: 'center', justifyContent: 'center' }}>
        {pilih ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: warna.hijauTua }} /> : null}
      </View>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 16, color: warna.teks }}>{label}</Text>
    </Pressable>
  );
}

export default function PengaturanWaktuLayar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { repo, daftarAnak } = useData();
  const anak = daftarAnak.find((a) => a.id === id);
  const [p, setP] = useState<PengaturanWaktu | null>(null);
  const [ubahProfil, setUbahProfil] = useState(false);
  useEffect(() => {
    if (anak) repo.pengaturan(anak.id).then(setP);
  }, [repo, anak]);
  if (!anak || !p) return null;
  const batas = batasBelajarBawaan(anak.kelas);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Pengaturan waktu" ortu />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        <Pressable onPress={() => setUbahProfil(!ubahProfil)} style={{ backgroundColor: warna.putih, borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: HEWAN[anak.hewan].latar, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26 }}>{HEWAN[anak.hewan].emoji}</Text>
          </View>
          <Text style={{ flex: 1, fontFamily: huruf.ortuTebal, fontSize: 18 }}>
            {anak.nama} · Kelas {anak.kelas}
          </Text>
          <Text style={{ fontFamily: huruf.ortuSedang, color: warna.hijauTua }}>{ubahProfil ? 'Tutup' : 'Ubah'}</Text>
        </Pressable>
        {ubahProfil ? (
          <Kotak>
            <FormAnak
              awal={anak}
              label="Simpan profil"
              onSimpan={async (d) => {
                await repo.ubahAnak({ ...anak, ...d });
                setUbahProfil(false);
              }}
            />
          </Kotak>
        ) : null}
        <Kotak>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Batas belajar per hari</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TombolBulat label="Kurangi" teks="−" onPress={() => setP({ ...p, belajarMenit: Math.max(5, p.belajarMenit - 5) })} />
            <Text style={{ fontFamily: huruf.ortuTebal, color: warna.teks }}>
              <Text style={{ fontSize: 34 }}>{p.belajarMenit}</Text>
              <Text style={{ fontSize: 16, fontFamily: huruf.ortu }}> menit</Text>
            </Text>
            <TombolBulat label="Tambah" teks="+" onPress={() => setP({ ...p, belajarMenit: Math.min(batas, p.belajarMenit + 5) })} />
          </View>
          <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
            Saran untuk kelas {anak.kelas}: {batas} menit (paling banyak 10 menit × kelas). Dibagi blok 15 menit dengan istirahat.
          </Text>
        </Kotak>
        <Kotak>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Waktu game per hari</Text>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.hijauTua }}>{p.gameMenit} menit</Text>
          </View>
          <Geser label="Waktu game per hari" nilai={p.gameMenit} min={0} maks={60} onUbah={(n) => setP({ ...p, gameMenit: n })} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>0</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Bawaan {gameBawaan(anak.kelas)}</Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>60</Text>
          </View>
        </Kotak>
        <Kotak>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Kapan game terbuka?</Text>
          <Radio pilih={p.gameSetelahInti} label="Game setelah latihan hari ini" onPress={() => setP({ ...p, gameSetelahInti: true })} />
          <Radio pilih={!p.gameSetelahInti} label="Selalu terbuka" onPress={() => setP({ ...p, gameSetelahInti: false })} />
        </Kotak>
        <Kotak>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Jam tenang</Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Mulai pukul {p.jamTenang.replace(':', '.')} sampai {p.jamBangun.replace(':', '.')}</Text>
            </View>
            <Switch
              accessibilityLabel="Jam tenang"
              value={p.jamTenang !== p.jamBangun}
              onValueChange={(v) => setP({ ...p, jamTenang: v ? '21:00' : p.jamBangun })}
              trackColor={{ true: warna.hijauTua, false: warna.abuGaris }}
              thumbColor={warna.putih}
            />
          </View>
          {p.jamTenang !== p.jamBangun ? (
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {['19:30', '20:00', '20:30', '21:00'].map((j) => (
                <Pressable key={j} onPress={() => setP({ ...p, jamTenang: j })} style={{ paddingHorizontal: 12, height: 36, borderRadius: 18, justifyContent: 'center', backgroundColor: p.jamTenang === j ? warna.hijauPil : warna.abuTerang }}>
                  <Text style={{ fontFamily: huruf.ortuSedang, color: p.jamTenang === j ? warna.hijauTua : warna.teks }}>{j.replace(':', '.')}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </Kotak>
        <Kotak>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Efek bunyi</Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>Bunyi pendek saat benar dan selesai</Text>
            </View>
            <Switch accessibilityLabel="Efek bunyi" value={p.bunyi} onValueChange={(v) => setP({ ...p, bunyi: v })} trackColor={{ true: warna.hijauTua, false: warna.abuGaris }} thumbColor={warna.putih} />
          </View>
        </Kotak>
        <Tombol
          label="Simpan"
          onPress={async () => {
            await repo.aturPengaturan(p);
            router.back();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
