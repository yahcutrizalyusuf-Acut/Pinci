/**
 * Kelas dan pengawas (orang tua): masukkan kode kelas, pilih paket, setujui, lalu anak masuk kelas
 * dengan masa coba 14 hari. Bisa keluar kapan saja. Tanpa harga di aplikasi (aturan Google Play).
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN, type Anak, type PaketKelas } from '@/data/jenis';
import { aturPersetujuanPemakaian, gabungKelas, gantiPaket, keluarKelas, type Sesimasuk } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import {
  PAKET,
  SETUJU_KELAS,
  SETUJU_PEMAKAIAN,
  VERSI_PERSETUJUAN,
  formatKodeKelas,
  paketUntukKelas,
  pesanGabung,
  rapikanKodeKelas,
  teksStatus,
  teksPersetujuan,
} from '@/fitur/kelas';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';

function Kotak({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10 }}>{children}</View>;
}

function Centang({ nyala, label, onPress }: { nyala: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: nyala }} accessibilityLabel={label} onPress={onPress} style={{ flexDirection: 'row', gap: 12, paddingVertical: 6, alignItems: 'flex-start' }}>
      <View style={{ width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: nyala ? warna.hijauTua : warna.ikonRedup, backgroundColor: nyala ? warna.hijauTua : warna.putih, alignItems: 'center', justifyContent: 'center' }}>
        {nyala ? <Text style={{ color: warna.putih, fontFamily: huruf.ortuTebal }}>✓</Text> : null}
      </View>
      <Text style={{ flex: 1, fontFamily: huruf.ortu, fontSize: 15, lineHeight: 21, color: warna.teks }}>{label}</Text>
    </Pressable>
  );
}

interface Alur {
  anak: Anak;
  /** hanya ganti paket (anak sudah di kelas) */
  ganti?: boolean;
  tahap: 'kode' | 'paket' | 'setuju';
  kode: string;
  paket: PaketKelas | null;
  setujuKelas: boolean;
  setujuPemakaian: boolean;
}

export default function KelasPengawas() {
  const router = useRouter();
  const { repo, server, daftarAnak } = useData();
  const [masuk, setMasuk] = useState<boolean | null>(null);
  const [alur, setAlur] = useState<Alur | null>(null);
  const [pesan, setPesan] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [yakinKeluar, setYakinKeluar] = useState<string | null>(null);
  const kelas = useMuat(async (r) => r.daftarKelasAnak(), []);

  useEffect(() => {
    repo.nilai<Sesimasuk>('sesi_masuk').then((s) => setMasuk(!!s));
  }, [repo]);
  useEffect(() => {
    repo.tarikKelas().catch(() => undefined);
  }, [repo]);

  if (!server) {
    return (
      <Latar>
        <TeksOrtu>Mode server belum dinyalakan. Kelas dengan pengawas butuh sambungan ke server.</TeksOrtu>
      </Latar>
    );
  }
  if (masuk === null) return <Latar>{null}</Latar>;
  if (!masuk) {
    return (
      <Latar>
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Masuk dulu</TeksOrtu>
          <TeksOrtu>Supaya pengawas bisa melihat hasil latihan anak, HP ini perlu masuk dengan email Anda lebih dulu.</TeksOrtu>
          <Tombol label="Masuk dengan email" ortu onPress={() => router.push('/masuk')} />
        </Kotak>
      </Latar>
    );
  }

  const mulai = (anak: Anak) => {
    setPesan('');
    setAlur({ anak, tahap: 'kode', kode: '', paket: paketUntukKelas(anak.kelas).length === 3 ? 'siap_tka' : 'lengkap', setujuKelas: false, setujuPemakaian: false });
  };

  const kirim = async () => {
    if (!alur?.paket) return;
    setMemuat(true);
    setPesan('');
    // Pastikan profil anak sudah sampai ke server lebih dulu.
    await repo.sinkron().catch(() => undefined);
    const h = await gabungKelas(server, { kode: alur.kode, anakId: alur.anak.id, paket: alur.paket, versiTeks: VERSI_PERSETUJUAN, setujuPemakaian: alur.setujuPemakaian });
    setMemuat(false);
    if (!h.ok) {
      setPesan(pesanGabung(h.alasan));
      if (h.alasan === 'kode_salah' || h.alasan === 'penuh' || h.alasan === 'terlalu_sering') setAlur({ ...alur, tahap: 'kode' });
      return;
    }
    await repo.pasangAnggotaKelas(h.anggota);
    await repo.aturNilai(`catatan_pemakaian:${alur.anak.id}`, alur.setujuPemakaian);
    setAlur(null);
    repo.sinkronDuaArah().catch(() => undefined);
  };

  const simpanPaket = async () => {
    if (!alur?.paket) return;
    setMemuat(true);
    setPesan('');
    const ok = await gantiPaket(server, alur.anak.id, alur.paket);
    setMemuat(false);
    if (!ok) {
      setPesan('Paket belum bisa diganti. Periksa internet, lalu coba lagi.');
      return;
    }
    setAlur(null);
    await repo.tarikKelas().catch(() => undefined);
  };

  const ubahPemakaian = async (anakId: string, setuju: boolean) => {
    setPesan('');
    const ok = await aturPersetujuanPemakaian(server, anakId, setuju, VERSI_PERSETUJUAN);
    if (!ok) {
      setPesan('Belum tersimpan. Periksa internet, lalu coba lagi.');
      return;
    }
    await repo.tarikKelas().catch(() => undefined);
  };

  const keluar = async (anakId: string) => {
    setYakinKeluar(null);
    setMemuat(true);
    const ok = await keluarKelas(server, anakId);
    setMemuat(false);
    if (ok) await repo.hapusAnggotaKelas(anakId);
    else setPesan('Belum bisa keluar kelas. Periksa internet, lalu coba lagi.');
  };

  if (alur) {
    const pilihan = paketUntukKelas(alur.anak.kelas);
    return (
      <Latar onKembali={() => (alur.tahap === 'kode' || alur.ganti ? setAlur(null) : setAlur({ ...alur, tahap: alur.tahap === 'setuju' ? 'paket' : 'kode' }))}>
        <TeksOrtu style={{ color: warna.teksKedua }}>
          {HEWAN[alur.anak.hewan].emoji} {alur.anak.nama} · Kelas {alur.anak.kelas}
          {alur.ganti ? '' : ` · Langkah ${alur.tahap === 'kode' ? 1 : alur.tahap === 'paket' ? 2 : 3} dari 3`}
        </TeksOrtu>
        {alur.tahap === 'kode' ? (
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Masukkan kode kelas</TeksOrtu>
            <TeksOrtu style={{ color: warna.teksKedua }}>Kode 6 huruf dan angka dari admin Pintar Main atau dari tempat les Anda.</TeksOrtu>
            <TextInput
              value={formatKodeKelas(alur.kode)}
              onChangeText={(t) => {
                setPesan('');
                setAlur({ ...alur, kode: rapikanKodeKelas(t).slice(0, 6) });
              }}
              placeholder="ABC 234"
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel="Kode kelas"
              style={{ height: 60, borderRadius: 14, borderWidth: 1, borderColor: warna.abuGaris, paddingHorizontal: 14, fontFamily: huruf.judulTebal, fontSize: 30, letterSpacing: 4, color: warna.teks, textAlign: 'center' }}
            />
            <Tombol
              label="Lanjut"
              ortu
              nonaktif={alur.kode.length !== 6}
              onPress={() => {
                setPesan('');
                setAlur({ ...alur, tahap: 'paket' });
              }}
            />
          </Kotak>
        ) : null}
        {alur.tahap === 'paket' ? (
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Pilih paket</TeksOrtu>
            <TeksOrtu style={{ color: warna.teksKedua }}>Semua paket memakai pengawas. Paket bisa diganti nanti.</TeksOrtu>
            {pilihan.map((p) => {
              const aktif = alur.paket === p;
              return (
                <Pressable
                  key={p}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: aktif }}
                  onPress={() => setAlur({ ...alur, paket: p })}
                  style={{ padding: 14, borderRadius: 14, borderWidth: 2, borderColor: aktif ? warna.hijauTua : warna.abuGaris, backgroundColor: aktif ? warna.hijauMuda : warna.putih, gap: 2 }}
                >
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 16, color: warna.teks }}>{PAKET[p].nama}</Text>
                  <Text style={{ fontFamily: huruf.ortu, fontSize: 14, color: warna.teksKedua }}>{PAKET[p].isi}</Text>
                </Pressable>
              );
            })}
            {alur.ganti ? (
              <Tombol label="Simpan paket" ortu memuat={memuat} nonaktif={!alur.paket} onPress={simpanPaket} />
            ) : (
              <Tombol label="Lanjut" ortu nonaktif={!alur.paket} onPress={() => setAlur({ ...alur, tahap: 'setuju' })} />
            )}
          </Kotak>
        ) : null}
        {alur.tahap === 'setuju' ? (
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 17 }}>Sebelum mulai</TeksOrtu>
            {teksPersetujuan(null, null).map((t) => (
              <TeksOrtu key={t}>{t}</TeksOrtu>
            ))}
            <Centang nyala={alur.setujuKelas} label={SETUJU_KELAS} onPress={() => setAlur({ ...alur, setujuKelas: !alur.setujuKelas })} />
            <Centang nyala={alur.setujuPemakaian} label={SETUJU_PEMAKAIAN} onPress={() => setAlur({ ...alur, setujuPemakaian: !alur.setujuPemakaian })} />
            <Tombol label="Setuju dan mulai" ortu memuat={memuat} nonaktif={!alur.setujuKelas} onPress={kirim} />
          </Kotak>
        ) : null}
        {pesan ? <TeksOrtu style={{ color: '#C0392B' }}>{pesan}</TeksOrtu> : null}
      </Latar>
    );
  }

  return (
    <Latar>
      <TeksOrtu style={{ color: warna.teksKedua }}>
        Pengawas memantau setiap Senin, Rabu, dan Jumat, mengirim catatan untuk Anda, dan memberi tugas latihan untuk anak.
      </TeksOrtu>
      {daftarAnak.map((a) => {
        const k = kelas.find((x) => x.anak_id === a.id);
        return (
          <Kotak key={a.id}>
            <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 17, color: warna.teks }}>
              {HEWAN[a.hewan].emoji} {a.nama} · Kelas {a.kelas}
            </Text>
            {k ? (
              <>
                <TeksOrtu>
                  Kelas <Text style={{ fontFamily: huruf.ortuTebal }}>{k.kelasNama}</Text>
                  {k.pengawasNama ? ` · Pengawas ${k.pengawasNama}` : ''}
                </TeksOrtu>
                <TeksOrtu style={{ color: warna.teksKedua }}>
                  Paket {PAKET[k.paket].nama} · {teksStatus(k)}
                </TeksOrtu>
                {k.status !== 'mitra' && k.status !== 'aktif' ? <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>Biaya dan cara bayar dikirim ke email Anda.</TeksOrtu> : null}
                <Centang
                  nyala={k.setujuPemakaian === true}
                  label="Kirim catatan pemakaian aplikasi untuk memperbaiki Pintar Main (boleh dimatikan kapan saja)"
                  onPress={() => ubahPemakaian(a.id, !(k.setujuPemakaian === true))}
                />
                {yakinKeluar === a.id ? (
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontFamily: huruf.ortu, fontSize: 14, flex: 1, color: warna.teks }}>Pantauan pengawas berhenti. Riwayat belajar tidak dihapus. Yakin?</Text>
                    <Pressable accessibilityRole="button" onPress={() => keluar(a.id)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#C0392B' }}>
                      <Text style={{ fontFamily: huruf.ortuTebal, color: warna.putih }}>Ya, keluar</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" onPress={() => setYakinKeluar(null)} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                      <Text style={{ fontFamily: huruf.ortuSedang, color: warna.teks }}>Batal</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <Pressable accessibilityRole="button" onPress={() => setAlur({ anak: a, ganti: true, tahap: 'paket', kode: '', paket: k.paket, setujuKelas: false, setujuPemakaian: false })} style={{ paddingVertical: 6 }}>
                      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.hijauTua }}>Ganti paket</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Keluarkan ${a.nama} dari kelas`} onPress={() => setYakinKeluar(a.id)} style={{ paddingVertical: 6 }}>
                      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: '#C0392B' }}>Keluar kelas</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : (
              <>
                <TeksOrtu style={{ color: warna.teksKedua }}>Belum ikut kelas.</TeksOrtu>
                <Tombol label="Masukkan kode kelas" ortu varian="garis" onPress={() => mulai(a)} />
              </>
            )}
          </Kotak>
        );
      })}
      {pesan ? <TeksOrtu style={{ color: '#C0392B' }}>{pesan}</TeksOrtu> : null}
    </Latar>
  );
}

function Latar({ children, onKembali }: { children: React.ReactNode; onKembali?: () => void }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Kelas dan pengawas" ortu onKembali={onKembali} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>{children}</ScrollView>
    </SafeAreaView>
  );
}
