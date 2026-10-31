/**
 * Kelola kelas dan staf (super admin, admin, mitra les). Hak tiap peran dijaga di server;
 * layar ini hanya menampilkan pilihan yang masuk akal untuk peran yang sedang masuk.
 */
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import {
  KUNCI_PROFIL_STAF,
  NAMA_PERAN,
  aturStafAktif,
  buatKelas,
  buatMitra,
  daftarKelasSaya,
  daftarMitra,
  daftarStaf,
  opsiStaf,
  ubahKelas,
  undangStaf,
  type Mitra,
  type PeranStaf,
  type ProfilStaf,
  type RingkasKelas,
  type Staf,
} from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { formatKodeKelas } from '@/fitur/kelas';
import { Tombol } from '@/komponen/dasar';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

/** Peran yang boleh diundang oleh peran yang sedang masuk. */
function peranUndangan(peran: PeranStaf): PeranStaf[] {
  return peran === 'super_admin' ? ['pengawas', 'admin', 'mitra', 'super_admin'] : ['pengawas'];
}

export default function KelolaStaf() {
  const { repo } = useData();
  const [profil, setProfil] = useState<ProfilStaf | null>(null);
  const [sayaId, setSayaId] = useState<string | null>(null);
  const [staf, setStaf] = useState<Staf[]>([]);
  const [mitra, setMitra] = useState<Mitra[]>([]);
  const [kelas, setKelas] = useState<RingkasKelas[]>([]);
  const [galat, setGalat] = useState('');
  const [berhasil, setBerhasil] = useState('');
  const [memuat, setMemuat] = useState<string | null>(null);

  // buat kelas
  const [namaKelas, setNamaKelas] = useState('');
  const [pengawasKelas, setPengawasKelas] = useState<string | null>(null);
  const [mitraKelas, setMitraKelas] = useState<string | null>(null);
  // undang staf
  const [email, setEmail] = useState('');
  const [namaStaf, setNamaStaf] = useState('');
  const [peran, setPeran] = useState<PeranStaf>('pengawas');
  const [mitraStaf, setMitraStaf] = useState<string | null>(null);
  // mitra baru
  const [namaMitra, setNamaMitra] = useState('');
  const [kotaMitra, setKotaMitra] = useState('');
  // ubah kelas
  const [ubah, setUbah] = useState<string | null>(null);

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      const p = await repo.nilai<ProfilStaf>(KUNCI_PROFIL_STAF);
      setProfil(p);
      setSayaId((await opsi.ambilPenggunaId?.()) ?? null);
      const [s, k] = await Promise.all([daftarStaf(opsi), daftarKelasSaya(opsi)]);
      setStaf(s);
      setKelas(k);
      if (p && p.peran !== 'pengawas') setMitra(await daftarMitra(opsi));
      setGalat('');
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  }, [repo]);

  // Muat lewat pewaktu: data datang dari server (sistem luar), bukan diturunkan dari keadaan layar.
  useEffect(() => {
    const t = setTimeout(muat, 0);
    return () => clearTimeout(t);
  }, [muat]);

  const jalankan = async (kunci: string, kerja: () => Promise<string>) => {
    setMemuat(kunci);
    setBerhasil('');
    setGalat('');
    try {
      setBerhasil(await kerja());
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
    setMemuat(null);
  };

  if (!profil) return <LatarStaf judul="Kelola kelas dan staf">{galat ? <PesanGalat teks={galat} /> : null}</LatarStaf>;
  if (profil.peran === 'pengawas') {
    return (
      <LatarStaf judul="Kelola kelas dan staf">
        <TeksStaf>Halaman ini untuk admin dan mitra les.</TeksStaf>
      </LatarStaf>
    );
  }

  const opsi = opsiStaf(repo);
  // Pengawas yang cocok untuk kelas: dari lembaga yang sama (Pintar Main atau les yang sama).
  const mitraTujuan = profil.peran === 'mitra' ? profil.mitraId : mitraKelas;
  const calonPengawas = (m: string | null) => staf.filter((s) => s.aktif && s.mitraId === m);
  const namaMitraDari = (id: string | null) => (id ? (mitra.find((m) => m.id === id)?.nama ?? 'Les mitra') : 'Pintar Main');

  return (
    <LatarStaf judul="Kelola kelas dan staf">
      {berhasil ? (
        <KotakStaf garis={warna.hijauDaun}>
          <TeksStaf tebal>{berhasil}</TeksStaf>
        </KotakStaf>
      ) : null}
      <PesanGalat teks={galat} />

      <KotakStaf>
        <JudulKotak>Buat kelas baru</JudulKotak>
        <IsianStaf label="Nama kelas" value={namaKelas} onChangeText={(t) => setNamaKelas(t.slice(0, 40))} placeholder="Contoh: Kancil Senin" />
        {profil.peran === 'super_admin' && mitra.length ? (
          <>
            <TeksStaf redup>Milik</TeksStaf>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              <Pil label="Pintar Main" aktif={mitraKelas === null} onPress={() => { setMitraKelas(null); setPengawasKelas(null); }} />
              {mitra.map((m) => (
                <Pil key={m.id} label={m.nama} aktif={mitraKelas === m.id} onPress={() => { setMitraKelas(m.id); setPengawasKelas(null); }} />
              ))}
            </View>
          </>
        ) : null}
        <TeksStaf redup>Pengawas</TeksStaf>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {calonPengawas(mitraTujuan ?? null).map((s) => (
            <Pil key={s.id} label={s.nama} aktif={pengawasKelas === s.id} onPress={() => setPengawasKelas(s.id)} />
          ))}
          {calonPengawas(mitraTujuan ?? null).length === 0 ? <TeksStaf redup>Belum ada staf. Undang pengawas di bawah.</TeksStaf> : null}
        </View>
        <Tombol
          label="Buat kelas"
          ortu
          memuat={memuat === 'kelas'}
          nonaktif={!opsi || namaKelas.trim().length < 2}
          onPress={() =>
            jalankan('kelas', async () => {
              const h = await buatKelas(opsi!, { nama: namaKelas, pengawasId: pengawasKelas, mitraId: mitraTujuan ?? null });
              setNamaKelas('');
              return `Kelas dibuat. Kode kelas: ${formatKodeKelas(h.kode)}. Bagikan kode ini kepada orang tua.`;
            })
          }
        />
      </KotakStaf>

      <KotakStaf>
        <JudulKotak>Undang staf</JudulKotak>
        <TeksStaf redup>Staf masuk di halaman staf dengan email ini. Pengawas Pintar Main: lulusan D3 atau S1.</TeksStaf>
        <IsianStaf label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="nama@contoh.com" />
        <IsianStaf label="Nama panggilan (dilihat orang tua)" value={namaStaf} onChangeText={(t) => setNamaStaf(t.slice(0, 40))} placeholder="Contoh: Kak Nisa" />
        {peranUndangan(profil.peran).length > 1 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {peranUndangan(profil.peran).map((p) => (
              <Pil key={p} label={NAMA_PERAN[p]} aktif={peran === p} onPress={() => setPeran(p)} />
            ))}
          </View>
        ) : null}
        {profil.peran === 'super_admin' && (peran === 'mitra' || peran === 'pengawas') && mitra.length ? (
          <>
            <TeksStaf redup>{peran === 'mitra' ? 'Les mitra' : 'Pengawas untuk'}</TeksStaf>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {peran === 'pengawas' ? <Pil label="Pintar Main" aktif={mitraStaf === null} onPress={() => setMitraStaf(null)} /> : null}
              {mitra.map((m) => (
                <Pil key={m.id} label={m.nama} aktif={mitraStaf === m.id} onPress={() => setMitraStaf(m.id)} />
              ))}
            </View>
          </>
        ) : null}
        <Tombol
          label="Kirim undangan"
          ortu
          memuat={memuat === 'undang'}
          nonaktif={!opsi || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || namaStaf.trim().length < 2 || (peran === 'mitra' && !mitraStaf)}
          onPress={() =>
            jalankan('undang', async () => {
              const tujuan = profil.peran === 'super_admin' ? peran : 'pengawas';
              await undangStaf(opsi!, { email, nama: namaStaf, peran: tujuan, mitraId: tujuan === 'mitra' || tujuan === 'pengawas' ? mitraStaf : null });
              setEmail('');
              setNamaStaf('');
              return `Undangan tersimpan. Minta ${namaStaf.trim()} membuka halaman staf dan masuk dengan email itu.`;
            })
          }
        />
      </KotakStaf>

      {profil.peran === 'super_admin' ? (
        <KotakStaf>
          <JudulKotak>Tambah les mitra</JudulKotak>
          <IsianStaf label="Nama les" value={namaMitra} onChangeText={(t) => setNamaMitra(t.slice(0, 60))} />
          <IsianStaf label="Kota" value={kotaMitra} onChangeText={(t) => setKotaMitra(t.slice(0, 40))} placeholder="Banda Aceh" />
          <Tombol
            label="Tambah mitra"
            ortu
            memuat={memuat === 'mitra'}
            nonaktif={!opsi || namaMitra.trim().length < 2}
            onPress={() =>
              jalankan('mitra', async () => {
                await buatMitra(opsi!, namaMitra, kotaMitra);
                setNamaMitra('');
                setKotaMitra('');
                return 'Mitra ditambahkan. Sekarang undang pemilik lesnya dengan peran Mitra les.';
              })
            }
          />
        </KotakStaf>
      ) : null}

      <KotakStaf>
        <JudulKotak>Kelas</JudulKotak>
        {kelas.map((k) => (
          <View key={k.id} style={{ gap: 6, paddingVertical: 8, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <TeksStaf tebal>
              {k.nama} · {formatKodeKelas(k.kode)}
              {k.aktif ? '' : ' · tidak aktif'}
            </TeksStaf>
            <TeksStaf redup>
              {namaMitraDari(k.mitraId)} · {k.jumlahAnak} anak · Pengawas {k.pengawasNama ?? 'belum ada'}
            </TeksStaf>
            {ubah === k.id ? (
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {calonPengawas(k.mitraId).map((s) => (
                    <Pil
                      key={s.id}
                      label={s.nama}
                      aktif={k.pengawasId === s.id}
                      onPress={() => jalankan(`ubah-${k.id}`, async () => {
                        await ubahKelas(opsi!, { id: k.id, nama: k.nama, pengawasId: s.id, aktif: k.aktif });
                        return `Pengawas kelas ${k.nama} sekarang ${s.nama}.`;
                      })}
                    />
                  ))}
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => jalankan(`ubah-${k.id}`, async () => {
                    await ubahKelas(opsi!, { id: k.id, nama: k.nama, pengawasId: k.pengawasId, aktif: !k.aktif });
                    return k.aktif ? `Kelas ${k.nama} dinonaktifkan. Kode kelas tidak bisa dipakai lagi.` : `Kelas ${k.nama} aktif lagi.`;
                  })}
                  style={{ paddingVertical: 4 }}
                >
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: k.aktif ? '#C0392B' : warna.hijauTua }}>{k.aktif ? 'Nonaktifkan kelas' : 'Aktifkan kelas'}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setUbah(k.id)} style={{ paddingVertical: 4 }}>
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.hijauTua }}>Ganti pengawas atau status</Text>
              </Pressable>
            )}
          </View>
        ))}
      </KotakStaf>

      <KotakStaf>
        <JudulKotak>Staf</JudulKotak>
        {staf.map((s) => (
          <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <View style={{ flex: 1 }}>
              <TeksStaf tebal>{s.nama}</TeksStaf>
              <TeksStaf redup>
                {NAMA_PERAN[s.peran]} · {namaMitraDari(s.mitraId)}
                {s.aktif ? '' : ' · dihentikan'}
              </TeksStaf>
            </View>
            {s.id !== sayaId && (s.peran === 'pengawas' || profil.peran === 'super_admin') ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => jalankan(`staf-${s.id}`, async () => {
                  await aturStafAktif(opsi!, s.id, !s.aktif);
                  return s.aktif ? `${s.nama} dihentikan. Ia tidak bisa lagi membuka kelas.` : `${s.nama} aktif lagi.`;
                })}
                style={{ padding: 8 }}
              >
                <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: s.aktif ? '#C0392B' : warna.hijauTua }}>{s.aktif ? 'Hentikan' : 'Aktifkan'}</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </KotakStaf>
    </LatarStaf>
  );
}
