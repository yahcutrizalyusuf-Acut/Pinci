/**
 * Benda interaktif untuk "Coba dengan benda" (rancangan 12 bagian 2, M1). Semua bisa dipakai dengan sentuhan
 * dan dengan pembaca layar (tombol berlabel, nilai sekarang diumumkan). `onSelesai` dipanggil saat target tercapai.
 * Jawaban belum tepat tidak dihukum: anak bisa terus mengubah sampai pas.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { huruf, warna } from '../../desain/token';
import type { NilaiUang } from '../../game/pasar/logika';
import { GambarUang } from '../../game/pasar/tampilan/Uang';
import type { BendaInteraktif as DataBenda } from '../../isi/gudang/jenis';
import { GarisBilangan } from './GarisBilangan';

function TombolKecil({ label, aksesLabel, onPress, nonaktif }: { label: string; aksesLabel: string; onPress: () => void; nonaktif?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={aksesLabel} disabled={nonaktif} onPress={onPress} style={({ pressed }) => ({ minWidth: 48, minHeight: 48, paddingHorizontal: 12, borderRadius: 24, borderWidth: 2, borderColor: warna.hijauDaun, backgroundColor: pressed ? warna.hijauMuda : warna.putih, alignItems: 'center', justifyContent: 'center', opacity: nonaktif ? 0.4 : 1 })}>
      <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: warna.teks }}>{label}</Text>
    </Pressable>
  );
}

function Nilai({ teks, pas }: { teks: string; pas: boolean }) {
  return (
    <Text accessibilityLiveRegion="polite" style={{ fontFamily: huruf.judul, fontSize: 30, color: pas ? warna.hijauTua : warna.teks, textAlign: 'center' }}>
      {teks}
      {pas ? ' ✓' : ''}
    </Text>
  );
}

// ---------- Blok Puluhan ----------

export function BlokPuluhan({ target, onSelesai }: { target: number; onSelesai: () => void }) {
  const [n, setN] = useState({ r: 0, p: 0, s: 0 });
  const nilai = n.r * 100 + n.p * 10 + n.s;
  const ubah = (b: typeof n) => {
    setN(b);
    if (b.r * 100 + b.p * 10 + b.s === target) onSelesai();
  };
  const kelompok = (dari: 's' | 'p') => {
    if (dari === 's' && n.s >= 10) ubah({ ...n, s: n.s - 10, p: n.p + 1 });
    if (dari === 'p' && n.p >= 10) ubah({ ...n, p: n.p - 10, r: n.r + 1 });
  };
  const kolom: { k: 'r' | 'p' | 's'; nama: string; nilaiSatu: number }[] = [
    { k: 'r', nama: 'Ratusan', nilaiSatu: 100 },
    { k: 'p', nama: 'Puluhan', nilaiSatu: 10 },
    { k: 's', nama: 'Satuan', nilaiSatu: 1 },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Nilai teks={String(nilai)} pas={nilai === target} />
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {kolom.map(({ k, nama }) => (
          <View key={k} style={{ flex: 1, alignItems: 'center', gap: 6, backgroundColor: warna.putih, borderRadius: 14, padding: 8 }}>
            <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: warna.teksKedua }}>{nama}</Text>
            <View accessible accessibilityLabel={`${n[k]} ${nama.toLowerCase()}`} style={{ minHeight: 96, flexDirection: 'row', flexWrap: 'wrap', gap: 3, justifyContent: 'center', alignContent: 'flex-end' }}>
              {Array.from({ length: n[k] }, (_, i) =>
                k === 'r' ? (
                  <Svg key={i} width={30} height={30}>
                    <Rect x={1} y={1} width={28} height={28} fill="#FFE08A" stroke="#D4A72C" strokeWidth={2} />
                    <Path d="M1 10.3 H29 M1 19.6 H29 M10.3 1 V29 M19.6 1 V29" stroke="#D4A72C" strokeWidth={0.8} />
                  </Svg>
                ) : k === 'p' ? (
                  <View key={i} style={{ width: 9, height: 40, backgroundColor: '#9BD6F2', borderWidth: 1.5, borderColor: '#4EA8DE' }} />
                ) : (
                  <View key={i} style={{ width: 11, height: 11, backgroundColor: '#B5E3C5', borderWidth: 1.5, borderColor: '#3BB273' }} />
                ),
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TombolKecil label="−" aksesLabel={`Kurangi satu ${nama.toLowerCase()}`} nonaktif={n[k] === 0} onPress={() => ubah({ ...n, [k]: n[k] - 1 })} />
              <TombolKecil label="+" aksesLabel={`Tambah satu ${nama.toLowerCase()}`} nonaktif={n[k] >= 19} onPress={() => ubah({ ...n, [k]: n[k] + 1 })} />
            </View>
          </View>
        ))}
      </View>
      {n.s >= 10 || n.p >= 10 ? (
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {n.s >= 10 ? <TombolKecil label="Kelompokkan 10 satuan" aksesLabel="Kelompokkan 10 satuan menjadi 1 puluhan" onPress={() => kelompok('s')} /> : null}
          {n.p >= 10 ? <TombolKecil label="Kelompokkan 10 puluhan" aksesLabel="Kelompokkan 10 puluhan menjadi 1 ratusan" onPress={() => kelompok('p')} /> : null}
        </View>
      ) : null}
    </View>
  );
}

// ---------- Potongan Pecahan ----------

function busur(cx: number, cy: number, r: number, a0: number, a1: number) {
  const t = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = t(a0);
  const [x1, y1] = t(a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`;
}

export function PotonganPecahan({ bentuk, bagian, target, onSelesai, lebar = 260 }: { bentuk: 'lingkaran' | 'batang'; bagian: number; target: number; onSelesai: () => void; lebar?: number }) {
  const [warnai, setWarnai] = useState<boolean[]>(() => Array.from({ length: bagian }, () => false));
  const jumlah = warnai.filter(Boolean).length;
  const ketuk = (i: number) => {
    const b = warnai.map((x, k) => (k === i ? !x : x));
    setWarnai(b);
    if (b.filter(Boolean).length === target) onSelesai();
  };
  const tombol = (i: number) => ({ accessibilityRole: 'checkbox' as const, accessibilityState: { checked: warnai[i] }, accessibilityLabel: `Potong ke-${i + 1} dari ${bagian}`, onPress: () => ketuk(i) });
  return (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <Nilai teks={`${jumlah}/${bagian}`} pas={jumlah === target} />
      {bentuk === 'lingkaran' ? (
        <View style={{ width: lebar * 0.8, height: lebar * 0.8 }}>
          <Svg width={lebar * 0.8} height={lebar * 0.8} pointerEvents="none">
            {warnai.map((w, i) => (
              <Path key={i} d={busur(lebar * 0.4, lebar * 0.4, lebar * 0.38, (i / bagian) * 2 * Math.PI, ((i + 1) / bagian) * 2 * Math.PI)} fill={w ? '#FFB84D' : '#FFF6E5'} stroke={warna.biruTinta} strokeWidth={2} />
            ))}
          </Svg>
          {/* tombol tak terlihat di atas tiap potong supaya bisa diketuk dan dibaca pembaca layar */}
          {warnai.map((_, i) => {
            const a = ((i + 0.5) / bagian) * 2 * Math.PI;
            const r = lebar * 0.24;
            return <Pressable key={i} {...tombol(i)} style={{ position: 'absolute', left: lebar * 0.4 + r * Math.sin(a) - 24, top: lebar * 0.4 - r * Math.cos(a) - 24, width: 48, height: 48, borderRadius: 24 }} />;
          })}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', width: lebar }}>
          {warnai.map((w, i) => (
            <Pressable key={i} {...tombol(i)} style={{ flex: 1, height: 64, marginLeft: i ? -2 : 0, backgroundColor: w ? '#FFB84D' : '#FFF6E5', borderWidth: 2, borderColor: warna.biruTinta }} />
          ))}
        </View>
      )}
      <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua }}>Ketuk potongan untuk mewarnai atau menghapus warnanya.</Text>
    </View>
  );
}

// ---------- Uang Sederhana (gaya Pasar Gampong, bukan tiruan Rupiah) ----------

export function UangSederhana({ pilihan, target, onSelesai }: { pilihan: number[]; target: number; onSelesai: () => void }) {
  const [ambil, setAmbil] = useState<number[]>([]);
  const jumlah = ambil.reduce((a, b) => a + b, 0);
  const ubah = (b: number[]) => {
    setAmbil(b);
    if (b.reduce((a, x) => a + x, 0) === target) onSelesai();
  };
  return (
    <View style={{ gap: 12 }}>
      <Nilai teks={jumlah.toLocaleString('id-ID')} pas={jumlah === target} />
      <View accessible accessibilityLabel={`Uang terkumpul ${jumlah.toLocaleString('id-ID')}`} style={{ minHeight: 70, flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', backgroundColor: warna.putih, borderRadius: 16, padding: 8 }}>
        {ambil.map((u, i) => (
          <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Kembalikan ${u.toLocaleString('id-ID')}`} onPress={() => ubah(ambil.filter((_, k) => k !== i))}>
            <GambarUang nilai={u as NilaiUang} skala={0.7} />
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {pilihan.map((u) => (
          <Pressable key={u} accessibilityRole="button" accessibilityLabel={`Ambil uang ${u.toLocaleString('id-ID')}`} onPress={() => ubah([...ambil, u])}>
            <GambarUang nilai={u as NilaiUang} />
          </Pressable>
        ))}
      </View>
      <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua, textAlign: 'center' }}>Ketuk uang untuk mengambil. Ketuk uang di atas untuk mengembalikan.</Text>
    </View>
  );
}

// ---------- Lompat di Garis Bilangan ----------

export function LompatGaris({ data, onSelesai, lebar }: { data: Extract<DataBenda, { jenis: 'lompat' }>; onSelesai: () => void; lebar: number }) {
  const [lompat, setLompat] = useState(0);
  const posisi = Math.round((data.garis.mulai + lompat * data.lompat) * 1e6) / 1e6;
  const ubah = (k: number) => {
    setLompat(k);
    if (Math.abs(data.garis.mulai + k * data.lompat - data.target) < 1e-9) onSelesai();
  };
  const tulis = (n: number) => (data.garis.penyebut && !Number.isInteger(n) ? `${Math.round(n * data.garis.penyebut)}/${data.garis.penyebut}` : n.toLocaleString('id-ID'));
  return (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <Nilai teks={`${lompat} lompatan · ${tulis(posisi)}`} pas={Math.abs(posisi - data.target) < 1e-9} />
      <GarisBilangan
        lebar={lebar}
        data={{
          ...data.garis,
          titik: [...(data.garis.titik ?? []), { nilai: posisi, label: 'Pinci' }],
          lompatan: Array.from({ length: lompat }, (_, i) => ({ dari: data.garis.mulai + i * data.lompat, ke: data.garis.mulai + (i + 1) * data.lompat })),
        }}
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TombolKecil label="Mundur" aksesLabel="Mundur satu lompatan" nonaktif={lompat === 0} onPress={() => ubah(lompat - 1)} />
        <TombolKecil label={`Lompat ${tulis(data.lompat)}`} aksesLabel={`Lompat ${tulis(data.lompat)}`} nonaktif={posisi + data.lompat > data.garis.akhir + 1e-9} onPress={() => ubah(lompat + 1)} />
      </View>
    </View>
  );
}

/** Pilih benda sesuai jenis. */
export function Benda({ benda, onSelesai, lebar }: { benda: DataBenda; onSelesai: () => void; lebar: number }) {
  if (benda.jenis === 'blok') return <BlokPuluhan target={benda.target} onSelesai={onSelesai} />;
  if (benda.jenis === 'potongan') return <PotonganPecahan bentuk={benda.bentuk} bagian={benda.bagian} target={benda.target} onSelesai={onSelesai} lebar={Math.min(lebar, 320)} />;
  if (benda.jenis === 'uang') return <UangSederhana pilihan={benda.pilihan} target={benda.target} onSelesai={onSelesai} />;
  return <LompatGaris data={benda} onSelesai={onSelesai} lebar={lebar} />;
}
