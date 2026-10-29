/**
 * Tampilan G03 Pasar Gampong. Logika murni ada di `logika.ts`; berkas ini hanya menampilkan
 * keadaan dan meneruskan sentuhan anak sebagai aksi.
 *
 * Rasa main: uang diketuk (atau diseret di kelas 3–6) terbang ke nampan, total naik sambil
 * dihitung, uang/nampan memantul lembut bila belum tepat, petunjuk Pinci setelah 2 kali.
 * Tanpa skor, tanpa nyawa, tanpa hitung mundur.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { Tombol } from '../../komponen/dasar';
import { huruf, warna } from '../../desain/token';
import { bolehSeret } from '../bersama/jenis';
import type { Kejutan } from '../bersama/kejutan';
import { BingkaiGame } from '../bersama/tampilan/BingkaiGame';
import { bunyiGame } from '../bersama/tampilan/bunyi';
import type { PropsLayarGame } from '../bersama/tampilan/kontrak';
import { buatBabak, langkah, pesananSekarang, ringkasan, type AksiPasar, type KeadaanPasar, type NilaiUang } from './logika';
import { Nampan } from './tampilan/Nampan';
import { PanelKembalian, PanelTerima } from './tampilan/Panel';
import { TombolUang } from './tampilan/Uang';
import { LATAR_WARUNG, Warung } from './tampilan/Warung';

/** Lama pesta kecil sebelum pindah ke layar Akhir babak (≤ 1,5 detik). */
const LAMA_PESTA = 1400;

interface KeadaanLayar {
  k: KeadaanPasar;
  kejutan: Kejutan | null;
  kunciKejutan: number;
  /** naik setiap kali sesuatu memantul (supaya pantulan yang sama berturut-turut tetap bergerak) */
  kunciPantul: number;
  uangMasuk: { nilai: NilaiUang; kunci: number } | null;
}

function bagiBaris<T>(daftar: readonly T[], per: number): T[][] {
  const hasil: T[][] = [];
  for (let i = 0; i < daftar.length; i += per) hasil.push(daftar.slice(i, i + per));
  return hasil;
}

export default function LayarGame(props: PropsLayarGame) {
  const { kelas, tingkat, benih, sisaDetikAwal, totalDetik, bunyi, onSelesai, onKeluar } = props;
  const [layar, setLayar] = useState<KeadaanLayar>(() => ({
    k: buatBabak({ kelas, tingkat, benih }),
    kejutan: null,
    kunciKejutan: 0,
    kunciPantul: 0,
    uangMasuk: null,
  }));
  const [terpakai, setTerpakai] = useState(0);
  const terbaru = useRef<KeadaanLayar | null>(null);

  // Matahari waktu bergerak pelan (bukan hitung mundur di dalam babak).
  const adaBatas = Number.isFinite(sisaDetikAwal);
  useEffect(() => {
    if (!adaBatas) return;
    const id = setInterval(() => setTerpakai((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [adaBatas]);
  const sisaDetik = adaBatas ? Math.max(0, sisaDetikAwal - terpakai) : sisaDetikAwal;

  const jalankan = useCallback(
    (aksi: AksiPasar) => {
      const kini = terbaru.current ?? layar;
      const lama = kini.k;
      const baru = langkah(lama, aksi);
      if (baru === lama) return;
      let { kejutan, kunciKejutan, kunciPantul, uangMasuk } = kini;
      if (baru.kejutan !== null) {
        kejutan = baru.kejutan;
        kunciKejutan += 1;
      }
      if (baru.pantul !== null) kunciPantul += 1;
      if (aksi.jenis === 'ketuk_uang' && baru.nampan.length > lama.nampan.length) {
        uangMasuk = { nilai: aksi.nilai, kunci: (uangMasuk?.kunci ?? 0) + 1 };
        bunyiGame('plop', bunyi);
      }
      if (aksi.jenis === 'lanjut') uangMasuk = null;
      if (baru.fase === 'terima' && lama.fase !== 'terima') bunyiGame('ting', bunyi);
      if (baru.fase === 'selesai' && lama.fase !== 'selesai') bunyiGame('pesta', bunyi);
      const berikut: KeadaanLayar = { k: baru, kejutan, kunciKejutan, kunciPantul, uangMasuk };
      terbaru.current = berikut;
      setLayar(berikut);
    },
    [layar, bunyi],
  );

  // Pegangan tetap untuk gerak seret (dipanggil dari UI thread) supaya tidak memakai keadaan lama.
  const pegangan = useRef(jalankan);
  useEffect(() => {
    pegangan.current = jalankan;
  });
  const ketukUang = useCallback((nilai: NilaiUang) => pegangan.current({ jenis: 'ketuk_uang', nilai }), []);

  const { k } = layar;
  const babakSelesai = k.fase === 'selesai';
  const refSelesai = useRef(onSelesai);
  useEffect(() => {
    refSelesai.current = onSelesai;
  });
  useEffect(() => {
    if (!babakSelesai) return;
    const id = setTimeout(() => refSelesai.current(ringkasan(k)), LAMA_PESTA);
    return () => clearTimeout(id);
  }, [babakSelesai, k]);

  const pesanan = pesananSekarang(k);
  const seret = bolehSeret(kelas);
  const duaBaris = k.uangTersedia.length > 4;
  const pantul = k.pantul;
  const pantulUang = pantul?.jenis === 'uang' ? pantul.nilai : null;
  const pantulKembalian = pantul?.jenis === 'kembalian' ? pantul.nilai : null;
  const cukup = k.total >= pesanan.harga;
  // Kalimat Pinci yang pendek: setelah memantul, atau saat uangnya pas (bila harga terlihat).
  const tampilPesan =
    k.fase === 'bayar' && k.petunjuk === null && (pantul !== null || (cukup && pesanan.tampilkanHarga && k.nampan.length > 0));
  const pesanBayar = pantul !== null ? k.pesan : 'Pas! Ketuk Berikan, ya.';

  return (
    <BingkaiGame
      judul="Pasar Gampong"
      sisaDetik={sisaDetik}
      totalDetik={totalDetik}
      onKeluar={onKeluar}
      petunjuk={k.petunjuk}
      kejutan={layar.kejutan}
      kunciKejutan={layar.kunciKejutan}
      pesta={babakSelesai}
      latarAtas={LATAR_WARUNG}
    >
      <View style={{ flex: 1, backgroundColor: warna.kremLembut }}>
        <Warung pesanan={pesanan} pesan={k.pesan} terima={k.fase === 'terima' || babakSelesai} tinggi={duaBaris ? 210 : 250} />
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 12 }}>
          <Nampan
            nampan={k.nampan}
            total={k.total}
            harga={pesanan.harga}
            tampilkanHarga={pesanan.tampilkanHarga}
            kunciPantul={pantul?.jenis === 'nampan' ? layar.kunciPantul : 0}
            uangMasuk={layar.uangMasuk}
          />

          {k.fase === 'bayar' ? (
            <>
              {tampilPesan ? (
                <View style={{ backgroundColor: warna.biruMuda, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 }}>
                  <Text style={{ fontFamily: huruf.anak, fontSize: 16, color: warna.teks }}>{pesanBayar}</Text>
                </View>
              ) : null}
              <View style={{ gap: 8 }}>
                {bagiBaris(k.uangTersedia, 4).map((baris, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                    {baris.map((nilai) => (
                      <TombolUang
                        key={nilai}
                        nilai={nilai}
                        onMasuk={ketukUang}
                        bolehSeret={seret}
                        kunciPantul={pantulUang === nilai ? layar.kunciPantul : 0}
                        tinggi={duaBaris ? 72 : 84}
                      />
                    ))}
                    {Array.from({ length: 4 - baris.length }, (_, j) => (
                      <View key={`kosong-${j}`} style={{ flex: 1 }} />
                    ))}
                  </View>
                ))}
              </View>
              {seret && k.nampan.length === 0 ? (
                <Text style={{ fontFamily: huruf.anak, fontSize: 14, color: warna.teksKedua, textAlign: 'center' }}>
                  Ketuk uang, atau seret ke nampan.
                </Text>
              ) : null}
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Tombol
                  label="Ambil lagi"
                  ikon="urung"
                  varian="putih"
                  nonaktif={k.nampan.length === 0}
                  onPress={() => jalankan({ jenis: 'ambil_lagi' })}
                  style={{ flex: 1 }}
                />
                <Tombol
                  label="Berikan"
                  ikon="kanan"
                  nonaktif={k.nampan.length === 0}
                  onPress={() => jalankan({ jenis: 'serahkan' })}
                  aksesLabel={`Berikan ke ${pesanan.pembeli.nama}`}
                  style={{ flex: 1.3 }}
                />
              </View>
            </>
          ) : null}

          {k.fase === 'kembalian' ? (
            <PanelKembalian
              pilihan={k.pilihanKembalian}
              dicoba={k.kembalianDicoba}
              pantulNilai={pantulKembalian}
              kunciPantul={layar.kunciPantul}
              pesan="Berapa kembaliannya?"
              onPilih={(nilai) => jalankan({ jenis: 'pilih_kembalian', nilai })}
            />
          ) : null}

          {k.fase === 'terima' ? (
            <PanelTerima
              key={pesanan.id}
              kembalian={k.kembalian}
              terakhir={k.indeks >= k.daftarPesanan.length - 1}
              onLanjut={() => jalankan({ jenis: 'lanjut' })}
            />
          ) : null}

          {babakSelesai ? (
            <Text style={{ fontFamily: huruf.judul, fontSize: 26, color: warna.hijauTua, textAlign: 'center', marginTop: 12 }}>
              {k.pesan}
            </Text>
          ) : null}
        </View>
      </View>
    </BingkaiGame>
  );
}
