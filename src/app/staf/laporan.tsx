/**
 * Laporan mingguan (super admin dan admin): keluarga aktif, status langganan, pendaftar, masukan, masalah teknis,
 * dan kelas yang belum dipantau. Juga masukan orang tua dan masalah teknis terbanyak.
 */
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useData } from '@/data/konteks';
import { daftarMasukanStaf, laporanMingguan, opsiStaf, tandaiMasukanDibaca, type LaporanMingguan, type MasukanStaf } from '@/data/staf';
import { huruf, warna } from '@/desain/token';
import { NAMA_STATUS } from '@/fitur/kelas';
import { Tombol } from '@/komponen/dasar';
import { JudulKotak, KotakStaf, LatarStaf, PesanGalat, TeksStaf, pesanGalatStaf } from '@/komponen/staf';

const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

function Angka({ label, nilai }: { label: string; nilai: string | number }) {
  return (
    <View style={{ minWidth: 140, flexGrow: 1, padding: 12, borderRadius: 12, backgroundColor: warna.abuTerang, gap: 2 }}>
      <Text style={{ fontFamily: huruf.judulTebal, fontSize: 24, color: warna.teks }}>{nilai}</Text>
      <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>{label}</Text>
    </View>
  );
}

export default function LaporanStaf() {
  const { repo } = useData();
  const [lap, setLap] = useState<LaporanMingguan | null>(null);
  const [mas, setMas] = useState<MasukanStaf | null>(null);
  const [galat, setGalat] = useState('');

  const muat = useCallback(async () => {
    const opsi = opsiStaf(repo);
    if (!opsi) return;
    try {
      const [l, m] = await Promise.all([laporanMingguan(opsi), daftarMasukanStaf(opsi)]);
      setLap(l);
      setMas(m);
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

  const baca = async () => {
    const opsi = opsiStaf(repo);
    if (!opsi || !mas) return;
    try {
      await tandaiMasukanDibaca(opsi, mas.masukan.filter((m) => !m.dibaca).map((m) => m.id));
      await muat();
    } catch (e) {
      setGalat(pesanGalatStaf(e));
    }
  };

  return (
    <LatarStaf judul="Laporan mingguan">
      <PesanGalat teks={galat} />
      {lap ? (
        <>
          <TeksStaf redup>7 hari terakhir, sejak {new Date(lap.sejak).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}.</TeksStaf>
          <KotakStaf>
            <JudulKotak>Belajar</JudulKotak>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Angka label="keluarga aktif" nilai={lap.keluarga_aktif} />
              <Angka label="anak latihan" nilai={lap.anak_aktif} />
              <Angka label="rata-rata hari latihan" nilai={lap.rata_hari_latihan ?? '-'} />
              <Angka label="anak di kelas tanpa latihan" nilai={lap.anak_berhenti_latihan} />
            </View>
          </KotakStaf>
          <KotakStaf>
            <JudulKotak>Kelas dan langganan</JudulKotak>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(Object.keys(NAMA_STATUS) as (keyof typeof NAMA_STATUS)[]).map((s) => (
                <Angka key={s} label={NAMA_STATUS[s].toLowerCase()} nilai={lap.status[s] ?? 0} />
              ))}
              <Angka label="masuk kelas" nilai={lap.masuk_kelas} />
              <Angka label="keluar kelas" nilai={lap.keluar_kelas} />
              <Angka label="pembayaran dicatat" nilai={lap.bayar_minggu_ini} />
              {lap.uang_minggu_ini !== null ? <Angka label="uang masuk" nilai={rupiah(lap.uang_minggu_ini)} /> : null}
            </View>
          </KotakStaf>
          <KotakStaf garis={lap.kelas_tanpa_pantauan.length ? warna.oranye : undefined}>
            <JudulKotak>Pantauan pengawas</JudulKotak>
            <TeksStaf>{lap.pantauan_minggu_ini} pantauan tercatat minggu ini.</TeksStaf>
            <TeksStaf>{lap.kelas_tanpa_pantauan.length ? `Belum dipantau 7 hari: ${lap.kelas_tanpa_pantauan.join(', ')}.` : 'Semua kelas berisi sudah dipantau.'}</TeksStaf>
          </KotakStaf>
          <KotakStaf>
            <JudulKotak>Pendaftar dan masukan</JudulKotak>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Angka label="pendaftar baru" nilai={lap.pendaftar_baru} />
              <Angka label="masukan baru" nilai={lap.masukan_baru} />
              <Angka label="masalah teknis" nilai={lap.masalah_teknis} />
            </View>
            {Object.keys(lap.pendaftar_per_sumber).length ? (
              <TeksStaf redup>
                Asal pendaftar:{' '}
                {Object.entries(lap.pendaftar_per_sumber)
                  .map(([s, n]) => `${s} (${n})`)
                  .join(', ')}
              </TeksStaf>
            ) : null}
          </KotakStaf>
        </>
      ) : null}
      {mas ? (
        <>
          <KotakStaf>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <JudulKotak>Masukan orang tua</JudulKotak>
              {mas.masukan.some((m) => !m.dibaca) ? (
                <Pressable accessibilityRole="button" onPress={baca} style={{ padding: 6 }}>
                  <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.hijauTua }}>Tandai sudah dibaca</Text>
                </Pressable>
              ) : null}
            </View>
            {mas.masukan.length === 0 ? <TeksStaf redup>Belum ada.</TeksStaf> : null}
            {mas.masukan.slice(0, 30).map((m) => (
              <View key={m.id} style={{ gap: 2, paddingVertical: 6, borderTopWidth: 1, borderTopColor: warna.abuGaris }}>
                <TeksStaf redup>
                  {new Date(m.waktu).toLocaleDateString('id-ID')} · {m.jenis} · {m.sapaan ?? '-'}
                  {m.dibaca ? '' : ' · baru'}
                </TeksStaf>
                <TeksStaf tebal={!m.dibaca}>{m.isi}</TeksStaf>
              </View>
            ))}
          </KotakStaf>
          <KotakStaf>
            <JudulKotak>Masalah teknis terbanyak (30 hari)</JudulKotak>
            {mas.teknis.length === 0 ? <TeksStaf redup>Tidak ada.</TeksStaf> : null}
            {mas.teknis.map((t) => (
              <TeksStaf key={t.pesan}>
                {t.jumlah}× {t.pesan}
              </TeksStaf>
            ))}
          </KotakStaf>
        </>
      ) : null}
      <Tombol label="Muat ulang" ortu varian="garis" onPress={muat} />
    </LatarStaf>
  );
}
