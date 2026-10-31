/** Hubungkan HP anak (orang tua): buat kode 6 angka, lihat dan putuskan HP anak yang terhubung. */
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { kiniMs } from '@/data/alat';
import { useData } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { buatKodeHubung, daftarPerangkat, putuskanPerangkat, type PerangkatAnak, type Sesimasuk } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import { formatKode, lamaLalu, namaAnak, pesanBuatKode, sisaMenit } from '@/fitur/hubungkan';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';

function Kotak({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10 }}>{children}</View>;
}

export default function HubungkanHpAnak() {
  const router = useRouter();
  const { repo, server, daftarAnak } = useData();
  const [masuk, setMasuk] = useState<boolean | null>(null);
  const [dipilih, setDipilih] = useState<string[]>(() => daftarAnak.map((a) => a.id));
  const [kode, setKode] = useState<{ kode: string; berlakuSampai: string } | null>(null);
  const [pesan, setPesan] = useState('');
  const [membuat, setMembuat] = useState(false);
  const [perangkat, setPerangkat] = useState<PerangkatAnak[] | null>(null);
  const [yakinPutus, setYakinPutus] = useState<string | null>(null);
  const [kini, setKini] = useState(() => kiniMs());

  const [versiMuat, setVersiMuat] = useState(0);
  const muatUlang = useCallback(() => setVersiMuat((v) => v + 1), []);

  useEffect(() => {
    repo.nilai<Sesimasuk>('sesi_masuk').then((s) => setMasuk(!!s));
  }, [repo]);
  useEffect(() => {
    if (!masuk || !server) return;
    let batal = false;
    daftarPerangkat(server).then((d) => {
      if (batal) return;
      setPerangkat(d);
      setKini(kiniMs());
    });
    return () => {
      batal = true;
    };
  }, [masuk, server, versiMuat]);
  // Menit tersisa pada kode ikut berjalan.
  useEffect(() => {
    if (!kode) return;
    const id = setInterval(() => setKini(kiniMs()), 15_000);
    return () => clearInterval(id);
  }, [kode]);

  const nama = new Map(daftarAnak.map((a) => [a.id, a.nama]));

  if (!server) {
    return (
      <Latar>
        <TeksOrtu>Mode server belum dinyalakan, jadi HP anak belum bisa dihubungkan. Aplikasi berjalan di HP ini saja.</TeksOrtu>
      </Latar>
    );
  }
  if (masuk === null) return <Latar>{null}</Latar>;
  if (!masuk) {
    return (
      <Latar>
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Masuk dulu</TeksOrtu>
          <TeksOrtu>Supaya hasil anak bisa dilihat dari HP lain, HP ini perlu masuk dengan email Anda lebih dulu.</TeksOrtu>
          <Tombol label="Masuk dengan email" ortu onPress={() => router.push('/masuk')} />
        </Kotak>
      </Latar>
    );
  }

  const buat = async () => {
    setMembuat(true);
    setPesan('');
    setKode(null);
    // Pastikan profil anak sudah sampai ke server sebelum kode dibuat.
    await repo.sinkron().catch(() => undefined);
    const h = await buatKodeHubung(server, dipilih);
    setMembuat(false);
    setKini(kiniMs());
    if (h.ok) setKode({ kode: h.kode, berlakuSampai: h.berlakuSampai });
    else setPesan(pesanBuatKode(h.alasan));
  };
  const putuskan = async (id: string) => {
    setYakinPutus(null);
    if (await putuskanPerangkat(server, id)) muatUlang();
    else setPesan('HP belum bisa diputus. Periksa internet, lalu coba lagi.');
  };
  const menit = kode ? sisaMenit(kode.berlakuSampai, kini) : 0;

  return (
    <Latar>
      <Kotak>
        <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>1. Pilih anak untuk HP itu</TeksOrtu>
        {daftarAnak.map((a) => {
          const aktif = dipilih.includes(a.id);
          return (
            <Pressable
              key={a.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: aktif }}
              onPress={() => setDipilih(aktif ? dipilih.filter((x) => x !== a.id) : [...dipilih, a.id])}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}
            >
              <View style={{ width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: aktif ? warna.hijauTua : '#6B6F80', backgroundColor: aktif ? warna.hijauTua : warna.putih, alignItems: 'center', justifyContent: 'center' }}>
                {aktif ? <Text style={{ color: '#FFFFFF', fontFamily: huruf.ortuTebal }}>✓</Text> : null}
              </View>
              <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 16, color: warna.teks }}>
                {HEWAN[a.hewan].emoji} {a.nama} · Kelas {a.kelas}
              </Text>
            </Pressable>
          );
        })}
        <Tombol label={kode ? 'Buat kode baru' : 'Buat kode'} ortu memuat={membuat} nonaktif={dipilih.length === 0} onPress={buat} />
      </Kotak>

      {kode ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>2. Ketik kode ini di HP anak</TeksOrtu>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text accessibilityLabel={`Kode ${kode.kode.split('').join(' ')}`} selectable style={{ fontFamily: huruf.judulTebal, fontSize: 48, letterSpacing: 4, color: warna.teks }}>
              {formatKode(kode.kode)}
            </Text>
            <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: menit > 0 ? warna.teksKedua : '#C0392B' }}>
              {menit > 0 ? `Berlaku ${menit} menit lagi.` : 'Kode sudah lewat. Buat kode baru.'}
            </Text>
          </View>
          <TeksOrtu style={{ color: warna.teksKedua }}>
            Di HP anak: pasang Pintar Main, ketuk <Text style={{ fontFamily: huruf.ortuTebal }}>Ini HP anak</Text>, lalu ketik kode. HP anak butuh internet saat menghubungkan.
          </TeksOrtu>
        </Kotak>
      ) : null}

      {pesan ? <TeksOrtu style={{ color: '#C0392B' }}>{pesan}</TeksOrtu> : null}

      <Kotak>
        <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>HP anak yang terhubung</TeksOrtu>
        {perangkat === null ? (
          <TeksOrtu style={{ color: warna.teksKedua }}>Belum bisa memuat daftar. Periksa internet.</TeksOrtu>
        ) : perangkat.length === 0 ? (
          <TeksOrtu style={{ color: warna.teksKedua }}>Belum ada. Buat kode di atas untuk menghubungkan HP anak.</TeksOrtu>
        ) : (
          perangkat.map((p) => (
            <View key={p.id} style={{ gap: 4, paddingVertical: 8, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>HP {namaAnak(p, nama)}</Text>
              <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>
                {p.diputus ? 'Sudah diputus.' : `Terakhir sinkron ${lamaLalu(p.terakhirSinkron, kini)}${p.antreanBelumKirim > 0 ? ` · ${p.antreanBelumKirim} catatan belum terkirim` : ''}`}
              </Text>
              {!p.diputus ? (
                yakinPutus === p.id ? (
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontFamily: huruf.ortu, fontSize: 14, flex: 1 }}>HP ini tidak bisa lagi mengirim dan menerima data. Yakin?</Text>
                    <Pressable accessibilityRole="button" onPress={() => putuskan(p.id)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#C0392B' }}>
                      <Text style={{ fontFamily: huruf.ortuTebal, color: '#FFFFFF' }}>Ya, putuskan</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => setYakinPutus(null)} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                      <Text style={{ fontFamily: huruf.ortuSedang, color: warna.teks }}>Batal</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Putuskan HP ${namaAnak(p, nama)}`} onPress={() => setYakinPutus(p.id)} style={{ alignSelf: 'flex-start', paddingVertical: 6 }}>
                    <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: '#C0392B' }}>Putuskan</Text>
                  </Pressable>
                )
              ) : null}
            </View>
          ))
        )}
        <Tombol
          label="Perbarui sekarang"
          varian="garis"
          ortu
          onPress={async () => {
            await repo.sinkronDuaArah().catch(() => undefined);
            muatUlang();
          }}
        />
      </Kotak>
    </Latar>
  );
}

function Latar({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Hubungkan HP anak" ortu />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>{children}</ScrollView>
    </SafeAreaView>
  );
}
