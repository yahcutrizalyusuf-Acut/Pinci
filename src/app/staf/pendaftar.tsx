/** Pendaftar dari halaman penjelasan (super admin dan admin): hubungi, tempatkan di kelas, catat statusnya. */
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { daftarPendaftar, opsiStaf, ubahPendaftar, type Pendaftar, type StatusPendaftar } from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

const STATUS: { kode: StatusPendaftar; label: string }[] = [
  { kode: 'baru', label: 'Baru' },
  { kode: 'dihubungi', label: 'Dihubungi' },
  { kode: 'masuk_kelas', label: 'Masuk kelas' },
  { kode: 'batal', label: 'Batal' },
];

export default function PendaftarStaf() {
  const { repo } = useData();
  const [daftar, setDaftar] = useState<Pendaftar[] | null>(null);
  const [saring, setSaring] = useState<StatusPendaftar | 'semua'>('baru');
  const [catatan, setCatatan] = useState<Record<string, string>>({});
  const [galat, setGalat] = useState('');

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      setDaftar(await daftarPendaftar(opsi));
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

  const ubah = async (p: Pendaftar, status: StatusPendaftar) => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      await ubahPendaftar(opsi, p.id, status, catatan[p.id] ?? p.catatan ?? '');
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  };

  const tampil = (daftar ?? []).filter((p) => saring === 'semua' || p.status === saring);
  return (
    <LatarStaf judul="Pendaftar">
      <TeksStaf redup>Orang tua dan les yang mengisi formulir di halaman penjelasan. Hubungi lewat email atau WhatsApp, lalu kirim kode kelas.</TeksStaf>
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {[...STATUS, { kode: 'semua' as const, label: 'Semua' }].map((s) => (
          <Pil key={s.kode} label={`${s.label}${daftar && s.kode !== 'semua' ? ` (${daftar.filter((p) => p.status === s.kode).length})` : ''}`} aktif={saring === s.kode} onPress={() => setSaring(s.kode)} />
        ))}
      </View>
      <PesanGalat teks={galat} />
      {daftar && tampil.length === 0 ? <TeksStaf redup>Belum ada.</TeksStaf> : null}
      {tampil.map((p) => (
        <KotakStaf key={p.id}>
          <JudulKotak>
            {p.jenis === 'mitra' ? `Les: ${p.nama_les ?? '-'}` : `${p.nama_anak ?? 'Anak'} · Kelas ${p.kelas_anak ?? '-'}`}
          </JudulKotak>
          <Text selectable style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>
            {p.nama_ortu} · {p.email}
            {p.wa ? ` · WA ${p.wa}` : ''}
          </Text>
          <TeksStaf redup>
            {new Date(p.waktu).toLocaleString('id-ID')} · dari {p.sumber ?? 'langsung'}
          </TeksStaf>
          <IsianStaf label="Catatan" value={catatan[p.id] ?? p.catatan ?? ''} onChangeText={(t) => setCatatan({ ...catatan, [p.id]: t.slice(0, 200) })} placeholder="Contoh: sudah kirim kode kelas Kancil" />
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {STATUS.map((s) => (
              <Pil key={s.kode} label={s.label} aktif={p.status === s.kode} onPress={() => ubah(p, s.kode)} />
            ))}
          </View>
        </KotakStaf>
      ))}
    </LatarStaf>
  );
}
