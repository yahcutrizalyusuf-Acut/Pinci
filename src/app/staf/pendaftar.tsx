/** Pendaftar dari halaman penjelasan (super admin dan admin): hubungi, tempatkan di kelas, catat statusnya. */
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { antreanTatapMuka, daftarPendaftar, opsiStaf, ubahPendaftar, type Pendaftar, type StatusPendaftar } from '@/data/staf';
import { PERTANYAAN_PENGENALAN, PILIHAN_PELAJARAN, WAKTU_TELEPON } from '@/fitur/pengenalan';
import { huruf, warna } from '@/desain/token';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

/** Jawaban pengenalan dalam kalimat, untuk pengawas. */
function teksPengenalan(j: Record<string, string>) {
  return PERTANYAAN_PENGENALAN.filter((q) => j[q.kode])
    .map((q) => `${q.tanya.replace(/[…?]$/, '')}: ${q.pilihan.find((p) => p.kode === j[q.kode])?.teks ?? j[q.kode]}`)
    .join('\n');
}

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
  const [antrean, setAntrean] = useState<{ kota: string; jumlah: number }[]>([]);

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      setDaftar(await daftarPendaftar(opsi));
      setAntrean(await antreanTatapMuka(opsi));
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
      <TeksStaf redup>Orang tua dan les yang mendaftar dari website atau aplikasi. Hubungi lewat WhatsApp atau email, lalu kirim kode kelas.</TeksStaf>
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
        {[...STATUS, { kode: 'semua' as const, label: 'Semua' }].map((s) => (
          <Pil key={s.kode} label={`${s.label}${daftar && s.kode !== 'semua' ? ` (${daftar.filter((p) => p.status === s.kode).length})` : ''}`} aktif={saring === s.kode} onPress={() => setSaring(s.kode)} />
        ))}
      </View>
      <PesanGalat teks={galat} />
      {antrean.length > 0 ? (
        <KotakStaf>
          <JudulKotak>Antrean kelas tatap muka</JudulKotak>
          <TeksStaf>{antrean.map((a) => `${a.kota}: ${a.jumlah} anak`).join(' · ')}</TeksStaf>
        </KotakStaf>
      ) : null}
      {daftar && tampil.length === 0 ? <TeksStaf redup>Belum ada.</TeksStaf> : null}
      {tampil.map((p) => (
        <KotakStaf key={p.id}>
          <JudulKotak>
            {p.jenis === 'mitra' ? `Les: ${p.nama_les ?? '-'}` : `${p.nama_lengkap_anak ?? p.nama_anak ?? 'Anak'} · Kelas ${p.kelas_anak ?? '-'}`}
          </JudulKotak>
          <Text selectable style={{ fontFamily: huruf.ortu, fontSize: 15, color: warna.teks }}>
            {p.nama_ortu}
            {p.email ? ` · ${p.email}` : ''}
            {p.wa ? ` · WA ${p.wa}` : ''}
          </Text>
          <TeksStaf redup>
            {new Date(p.waktu).toLocaleString('id-ID')} · dari {p.asal === 'aplikasi' ? 'aplikasi' : (p.sumber ?? 'langsung')}
          </TeksStaf>
          {p.cara ? (
            <TeksStaf>
              {p.cara === 'antre_tatap_muka' ? `Antre tatap muka (${p.kota ?? '-'}) + kelas online` : 'Kelas online'} · Pelajaran: inti
              {(p.pelajaran ?? []).map((k) => `, ${PILIHAN_PELAJARAN.find((x) => x.kode === k)?.judul ?? k}`).join('')}
            </TeksStaf>
          ) : null}
          {p.tujuan ? <TeksStaf>Harapan orang tua: {p.tujuan}</TeksStaf> : null}
          {p.minta_telepon ? (
            <TeksStaf>📞 Minta ditelepon{p.waktu_telepon ? `: ${WAKTU_TELEPON.find((w) => w.kode === p.waktu_telepon)?.teks ?? p.waktu_telepon}` : ''}</TeksStaf>
          ) : null}
          {p.pengenalan && Object.keys(p.pengenalan).length > 0 ? <TeksStaf redup>{teksPengenalan(p.pengenalan)}</TeksStaf> : null}
          {p.cara ? <TeksStaf redup>{p.izin_pengembangan ? 'Mengizinkan data untuk pengembangan.' : 'Tidak mengizinkan data untuk pengembangan.'}</TeksStaf> : null}
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
