/**
 * Harga paket dan tagihan les mitra. Super admin: ubah harga, lihat tagihan semua mitra.
 * Mitra les: lihat tagihannya sendiri. Admin dan pengawas tidak melihat uang.
 */
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { useData } from '@/data/konteks';
import type { PaketKelas } from '@/data/jenis';
import { KUNCI_PROFIL_STAF, aturHarga, daftarHarga, opsiStaf, tagihanMitra, type HargaPaket, type ProfilStaf, type TagihanMitra } from '@/data/staf';
import { warna } from '@/desain/token';
import { PAKET } from '@/fitur/kelas';
import { Tombol } from '@/komponen/dasar';
import { IsianStaf, JudulKotak, KotakStaf, LatarStaf, Pil, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

/** Awal bulan ini dan dua bulan sebelumnya (YYYY-MM-01). */
function daftarBulan(sekarang = new Date()): { kode: string; label: string }[] {
  return [0, 1, 2].map((i) => {
    const d = new Date(sekarang.getFullYear(), sekarang.getMonth() - i, 1);
    const kode = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    return { kode, label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) };
  });
}

export default function UangStaf() {
  const { repo } = useData();
  const [profil, setProfil] = useState<ProfilStaf | null>(null);
  const [harga, setHarga] = useState<HargaPaket>({});
  const [ubah, setUbah] = useState<Partial<Record<PaketKelas | 'mitra', string>>>({});
  const bulanPilihan = daftarBulan();
  const [bulan, setBulan] = useState(bulanPilihan[0].kode);
  const [tagihan, setTagihan] = useState<TagihanMitra[] | null>(null);
  const [galat, setGalat] = useState('');
  const [berhasil, setBerhasil] = useState('');

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      const p = await repo.nilai<ProfilStaf>(KUNCI_PROFIL_STAF);
      setProfil(p);
      if (p?.peran === 'super_admin') setHarga(await daftarHarga(opsi));
      setTagihan(await tagihanMitra(opsi, bulan));
      setGalat('');
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  }, [repo, bulan]);
  // Muat lewat pewaktu: data datang dari server (sistem luar), bukan diturunkan dari keadaan layar.
  useEffect(() => {
    const t = setTimeout(muat, 0);
    return () => clearTimeout(t);
  }, [muat]);

  const simpanHarga = async (paket: PaketKelas | 'mitra') => {
    const opsi = opsiStaf(repo);
    const nilai = Number((ubah[paket] ?? '').replace(/\D/g, ''));
    if (!opsi || !nilai) return;
    try {
      await aturHarga(opsi, paket, nilai);
      setBerhasil(`Harga ${paket === 'mitra' ? 'mitra per murid' : PAKET[paket].nama} sekarang ${rupiah(nilai)}.`);
      setUbah({ ...ubah, [paket]: '' });
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  };

  return (
    <LatarStaf judul="Harga dan tagihan">
      {berhasil ? (
        <KotakStaf garis={warna.hijauDaun}>
          <TeksStaf tebal>{berhasil}</TeksStaf>
        </KotakStaf>
      ) : null}
      <PesanGalat teks={galat} />
      {profil?.peran === 'super_admin' ? (
        <KotakStaf>
          <JudulKotak>Harga per bulan</JudulKotak>
          <TeksStaf redup>Harga hanya tampil di halaman penjelasan, email, dan WhatsApp. Tidak pernah di dalam aplikasi.</TeksStaf>
          {(['dasar', 'lengkap', 'siap_tka', 'mitra'] as const).map((p) => (
            <View key={p} style={{ gap: 6, paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
              <TeksStaf tebal>
                {p === 'mitra' ? 'Tagihan les mitra per murid aktif' : `Paket ${PAKET[p].nama}`}: {harga[p] !== undefined ? rupiah(harga[p] ?? 0) : '-'}
              </TeksStaf>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
                <View style={{ flex: 1 }}>
                  <IsianStaf label="Harga baru (Rp)" value={ubah[p] ?? ''} onChangeText={(t) => setUbah({ ...ubah, [p]: t.replace(/\D/g, '').slice(0, 8) })} keyboardType="number-pad" />
                </View>
                <Tombol label="Simpan" ortu nonaktif={!ubah[p]} onPress={() => simpanHarga(p)} />
              </View>
            </View>
          ))}
        </KotakStaf>
      ) : null}
      <KotakStaf>
        <JudulKotak>Tagihan les mitra</JudulKotak>
        <TeksStaf redup>Murid aktif: latihan minimal 1 hari di bulan itu. Tagihan dikirim tanggal 1, dibayar paling lambat tanggal 10.</TeksStaf>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {bulanPilihan.map((b) => (
            <Pil key={b.kode} label={b.label} aktif={bulan === b.kode} onPress={() => setBulan(b.kode)} />
          ))}
        </View>
        {tagihan && tagihan.length === 0 ? <TeksStaf redup>Belum ada les mitra.</TeksStaf> : null}
        {(tagihan ?? []).map((t) => (
          <View key={t.mitraId} style={{ paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
            <TeksStaf tebal>{t.nama}</TeksStaf>
            <TeksStaf>
              {t.muridAktif} murid aktif × {rupiah(t.tarif)} = {rupiah(t.total)}
            </TeksStaf>
          </View>
        ))}
      </KotakStaf>
    </LatarStaf>
  );
}
