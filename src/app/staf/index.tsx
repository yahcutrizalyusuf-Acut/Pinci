/**
 * Pintu staf: masuk dengan email + kode, lalu daftar kelas. Dipakai pengawas, admin, mitra les, dan super admin,
 * di HP maupun di laptop (build web yang sama).
 */
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { opsiSupabase } from '@/data/sinkron';
import { KUNCI_PROFIL_STAF, KUNCI_SESI_STAF, NAMA_PERAN, daftarKelasSaya, opsiStaf, terimaUndangan, type ProfilStaf, type RingkasKelas } from '@/data/staf';
import { mintaKodeEmail, verifikasiKode, type Sesimasuk } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import { formatKodeKelas } from '@/fitur/kelas';
import { hariPantau } from '@/fitur/staf';
import { Tombol } from '@/komponen/dasar';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

export default function PintuStaf() {
  const router = useRouter();
  const { repo } = useData();
  const opsi = opsiStaf(repo);
  const [profil, setProfil] = useState<ProfilStaf | null | undefined>(undefined);
  const [kelas, setKelas] = useState<RingkasKelas[] | null>(null);
  const [pesan, setPesan] = useState('');

  const muatKelas = useCallback(async () => {
    if (!opsi) return;
    try {
      setKelas(await daftarKelasSaya(opsi));
      setPesan('');
    } catch (e) {
      setPesan(pesanGalatStaf(e));
    }
    // opsi dibuat ulang tiap render; cukup bergantung pada repo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  useEffect(() => {
    (async () => {
      const sesi = await repo.nilai<Sesimasuk>(KUNCI_SESI_STAF);
      const p = sesi ? await repo.nilai<ProfilStaf>(KUNCI_PROFIL_STAF) : null;
      setProfil(p);
      if (p) await muatKelas();
    })();
  }, [repo, muatKelas]);

  if (!opsi) {
    return (
      <LatarStaf judul="Staf Pintar Main">
        <TeksStaf>Mode server belum dinyalakan. Halaman staf butuh sambungan ke server.</TeksStaf>
      </LatarStaf>
    );
  }
  if (profil === undefined) return <LatarStaf judul="Staf Pintar Main">{null}</LatarStaf>;
  if (!profil) {
    return (
      <MasukStaf
        onMasuk={async (p) => {
          setProfil(p);
          await muatKelas();
        }}
      />
    );
  }

  const keluar = async () => {
    await repo.aturNilai(KUNCI_SESI_STAF, null);
    await repo.aturNilai(KUNCI_PROFIL_STAF, null);
    setProfil(null);
    setKelas(null);
  };
  const bolehKelola = profil.peran !== 'pengawas';
  const pantau = hariPantau();

  return (
    <LatarStaf
      judul="Kelas saya"
      kanan={
        <Pressable accessibilityRole="button" onPress={keluar} style={{ padding: 8 }}>
          <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teksKedua }}>Keluar</Text>
        </Pressable>
      }
    >
      <TeksStaf redup>
        {profil.nama} · {NAMA_PERAN[profil.peran]}
        {pantau ? ' · Hari ini hari pantauan' : ''}
      </TeksStaf>
      {kelas === null ? <TeksStaf redup>Memuat kelas…</TeksStaf> : null}
      {kelas && kelas.length === 0 ? (
        <KotakStaf>
          <TeksStaf>Belum ada kelas.{bolehKelola ? ' Buat kelas di Kelola kelas dan staf.' : ' Minta admin menambahkan Anda sebagai pengawas kelas.'}</TeksStaf>
        </KotakStaf>
      ) : null}
      {(kelas ?? []).map((k) => {
        const sudahHariIni = k.pantauanTerakhir === pantau?.tanggal;
        return (
          <Pressable key={k.id} accessibilityRole="button" accessibilityLabel={`Buka papan kelas ${k.nama}`} onPress={() => router.push(`/staf/kelas/${k.id}`)}>
            <KotakStaf garis={pantau && !sudahHariIni && k.aktif && k.jumlahAnak > 0 ? warna.oranye : undefined}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <JudulKotak>{k.nama}</JudulKotak>
                <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, letterSpacing: 2, color: warna.teksKedua }}>{formatKodeKelas(k.kode)}</Text>
              </View>
              <TeksStaf redup>
                {k.jumlahAnak} dari {k.kapasitas} anak · Pengawas {k.pengawasNama ?? 'belum ada'}
                {k.aktif ? '' : ' · Tidak aktif'}
              </TeksStaf>
              <TeksStaf redup>
                {sudahHariIni ? 'Pantauan hari ini sudah selesai ✓' : k.pantauanTerakhir ? `Pantauan terakhir ${k.pantauanTerakhir}` : 'Belum pernah dipantau'}
              </TeksStaf>
            </KotakStaf>
          </Pressable>
        );
      })}
      <PesanGalat teks={pesan} />
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        <Tombol label="Muat ulang" ortu varian="garis" onPress={muatKelas} style={{ flex: 1 }} />
        {bolehKelola ? <Tombol label="Kelola kelas dan staf" ortu onPress={() => router.push('/staf/kelola')} style={{ flex: 1 }} /> : null}
      </View>
    </LatarStaf>
  );
}

function MasukStaf({ onMasuk }: { onMasuk: (p: ProfilStaf) => void }) {
  const { repo } = useData();
  const [email, setEmail] = useState('');
  const [kode, setKode] = useState('');
  const [tahap, setTahap] = useState<'email' | 'kode'>('email');
  const [pesan, setPesan] = useState('');
  const [memuat, setMemuat] = useState(false);
  const dasar = opsiSupabase();
  if (!dasar) return null;

  const kirim = async () => {
    setMemuat(true);
    setPesan('');
    const ok = await mintaKodeEmail(dasar, email).catch(() => false);
    setMemuat(false);
    if (ok) setTahap('kode');
    else setPesan('Kode belum terkirim. Periksa alamat email dan internet.');
  };
  const periksa = async () => {
    setMemuat(true);
    setPesan('');
    const sesi = await verifikasiKode(dasar, email, kode).catch(() => null);
    if (!sesi) {
      setMemuat(false);
      setPesan('Kode belum tepat atau sudah lewat 10 menit.');
      return;
    }
    await repo.aturNilai(KUNCI_SESI_STAF, sesi);
    const opsi = opsiStaf(repo);
    try {
      const p = opsi ? await terimaUndangan(opsi) : null;
      setMemuat(false);
      if (!p) {
        await repo.aturNilai(KUNCI_SESI_STAF, null);
        setTahap('email');
        setKode('');
        setPesan('Email ini belum terdaftar sebagai staf. Minta super admin mengundang email ini lebih dulu.');
        return;
      }
      await repo.aturNilai(KUNCI_PROFIL_STAF, p);
      onMasuk(p);
    } catch (e) {
      setMemuat(false);
      setPesan(pesanGalatStaf(e));
    }
  };

  return (
    <LatarStaf judul="Masuk staf">
      <KotakStaf>
        <JudulKotak>Untuk pengawas, admin, dan mitra les</JudulKotak>
        {tahap === 'email' ? (
          <>
            <TeksStaf redup>Masukkan email yang diundang. Kami kirim kode 6 angka.</TeksStaf>
            <IsianStaf label="Email" value={email} onChangeText={setEmail} placeholder="nama@contoh.com" keyboardType="email-address" autoCapitalize="none" />
            <Tombol label="Kirim kode" ortu memuat={memuat} nonaktif={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())} onPress={kirim} />
          </>
        ) : (
          <>
            <TeksStaf redup>Kode sudah dikirim ke {email}. Periksa juga folder Spam.</TeksStaf>
            <IsianStaf label="Kode 6 angka" value={kode} onChangeText={(t) => setKode(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" style={{ letterSpacing: 6, fontSize: 22 }} />
            <Tombol label="Masuk" ortu memuat={memuat} nonaktif={kode.length !== 6} onPress={periksa} />
            <Tombol label="Ganti email" ortu varian="garis" onPress={() => setTahap('email')} />
          </>
        )}
        <PesanGalat teks={pesan} />
      </KotakStaf>
    </LatarStaf>
  );
}
