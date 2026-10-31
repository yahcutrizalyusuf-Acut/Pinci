/**
 * Langganan keluarga (super admin dan admin): cocokkan pembayaran QRIS/transfer, lalu tekan Aktifkan.
 * Perpanjangan dihitung dari akhir masa coba atau akhir langganan sebelumnya. Semua tercatat.
 */
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { aktifkanLangganan, daftarLangganan, opsiStaf, type CaraBayar, type Langganan } from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { NAMA_STATUS, PAKET } from '@/fitur/kelas';
import { Tombol } from '@/komponen/dasar';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

const CARA: { kode: CaraBayar; label: string }[] = [
  { kode: 'qris', label: 'QRIS' },
  { kode: 'transfer', label: 'Transfer' },
  { kode: 'tunai', label: 'Tunai' },
];
const URUT_STATUS: Record<string, number> = { tenggang: 0, coba: 1, berhenti: 2, aktif: 3, mitra: 4 };
const tgl = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-');

export default function LanggananStaf() {
  const { repo } = useData();
  const [daftar, setDaftar] = useState<Langganan[] | null>(null);
  const [pilih, setPilih] = useState<string | null>(null);
  const [bulan, setBulan] = useState(1);
  const [jumlah, setJumlah] = useState('');
  const [cara, setCara] = useState<CaraBayar>('qris');
  const [catatan, setCatatan] = useState('');
  const [galat, setGalat] = useState('');
  const [berhasil, setBerhasil] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [saring, setSaring] = useState<'perlu' | 'semua'>('perlu');

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      setDaftar(await daftarLangganan(opsi));
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

  const aktifkan = async (l: Langganan) => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    setMemuat(true);
    setBerhasil('');
    try {
      const sampai = await aktifkanLangganan(opsi, { anakId: l.anakId, bulan, jumlah: Number(jumlah.replace(/\D/g, '')) || 0, cara, catatan });
      setBerhasil(`Langganan ${l.anakNama} aktif sampai ${tgl(sampai)}.`);
      setPilih(null);
      setJumlah('');
      setCatatan('');
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
    setMemuat(false);
  };

  const tampil = (daftar ?? [])
    .filter((l) => saring === 'semua' || l.status !== 'aktif')
    .sort((a, b) => (URUT_STATUS[a.status] ?? 9) - (URUT_STATUS[b.status] ?? 9) || a.cobaSampai.localeCompare(b.cobaSampai));

  return (
    <LatarStaf judul="Langganan">
      <TeksStaf redup>Cocokkan pembayaran di aplikasi bank atau QRIS lebih dulu. Setelah itu tekan Aktifkan. Kirim cara bayar ke email orang tua pada hari ke-10 masa coba.</TeksStaf>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Pil label="Perlu ditindak" aktif={saring === 'perlu'} onPress={() => setSaring('perlu')} />
        <Pil label="Semua" aktif={saring === 'semua'} onPress={() => setSaring('semua')} />
      </View>
      {berhasil ? (
        <KotakStaf garis={warna.hijauDaun}>
          <TeksStaf tebal>{berhasil}</TeksStaf>
        </KotakStaf>
      ) : null}
      <PesanGalat teks={galat} />
      {daftar && tampil.length === 0 ? <TeksStaf redup>Tidak ada yang perlu ditindak.</TeksStaf> : null}
      {tampil.map((l) => (
        <KotakStaf key={l.anakId} garis={l.status === 'tenggang' ? warna.oranye : undefined}>
          <JudulKotak>
            {l.anakNama} · Kelas {l.kelas}
          </JudulKotak>
          <TeksStaf redup>
            {l.kelasNama} · Paket {PAKET[l.paket].nama} · {NAMA_STATUS[l.status]}
          </TeksStaf>
          <TeksStaf redup>
            Masa coba sampai {tgl(l.cobaSampai)}
            {l.berlakuSampai ? ` · Aktif sampai ${tgl(l.berlakuSampai)}` : ''}
          </TeksStaf>
          {l.emailOrtu ? (
            <Text selectable style={{ fontFamily: huruf.ortuSedang, fontSize: 15, color: warna.teks }}>
              {l.sapaan ?? 'Orang tua'}: {l.emailOrtu}
            </Text>
          ) : null}
          {pilih === l.anakId ? (
            <View style={{ gap: 8 }}>
              <TeksStaf redup>Lama langganan yang dibayar</TeksStaf>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {[1, 3, 6, 12].map((b) => (
                  <Pil key={b} label={`${b} bulan`} aktif={bulan === b} onPress={() => setBulan(b)} />
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {CARA.map((c) => (
                  <Pil key={c.kode} label={c.label} aktif={cara === c.kode} onPress={() => setCara(c.kode)} />
                ))}
              </View>
              <IsianStaf label="Jumlah yang diterima (Rp)" value={jumlah} onChangeText={(t) => setJumlah(t.replace(/\D/g, '').slice(0, 9))} keyboardType="number-pad" placeholder="Contoh: 60000" />
              <IsianStaf label="Catatan (boleh kosong)" value={catatan} onChangeText={(t) => setCatatan(t.slice(0, 200))} placeholder="Contoh: QRIS 2 Jan, ref 123" />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Tombol label="Aktifkan" ortu memuat={memuat} nonaktif={!jumlah} onPress={() => aktifkan(l)} style={{ flex: 1 }} />
                <Tombol label="Batal" ortu varian="garis" onPress={() => setPilih(null)} style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel={`Catat pembayaran ${l.anakNama}`} onPress={() => setPilih(l.anakId)} style={{ paddingVertical: 4 }}>
              <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.hijauTua }}>Catat pembayaran</Text>
            </Pressable>
          )}
        </KotakStaf>
      ))}
      <Tombol label="Muat ulang" ortu varian="garis" onPress={muat} />
    </LatarStaf>
  );
}
