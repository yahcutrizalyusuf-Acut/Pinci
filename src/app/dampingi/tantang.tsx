/** D3 Tantang Ayah: anak dan orang tua bergantian menjawab soal dari level yang sudah lulus. Tanpa skor kalah. */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { useData, useMuat } from '@/data/konteks';
import { HEWAN } from '@/data/jenis';
import { huruf, warna } from '@/desain/token';
import { kemajuanLancar } from '@/fitur/lancar';
import { mainkanBunyi } from '@/layanan/bunyi';
import { buatLembar, cocokJawaban, tombolTambahan } from '@/mesin/lancar';
import { PapanAngka, Tombol } from '@/komponen/dasar';
import { Pinci } from '@/komponen/Pinci';

export default function TantangAyah() {
  const router = useRouter();
  const { repo, anakAktif, keluarga } = useData();
  const anak = anakAktif!;
  const sapaan = keluarga?.sapaanOrtu ?? 'Ayah';
  const kemajuan = useMuat((r) => kemajuanLancar(r, anak), null, [anak.id]);
  const soal = useMemo(() => {
    if (!kemajuan) return [];
    const level = Math.max(1, kemajuan.level - 1);
    return buatLembar({ kelas: anak.kelas, level, benih: `tantang|${anak.id}|${new Date().toDateString()}` }).soal.slice(0, 10);
  }, [kemajuan, anak]);
  const [i, setI] = useState(0);
  const [isian, setIsian] = useState('');
  const [tampil, setTampil] = useState<null | boolean>(null);
  const [bintang, setBintang] = useState({ anak: 0, ortu: 0 });
  if (!soal.length) return null;
  const selesai = i >= soal.length;
  const giliranAnak = i % 2 === 0;
  if (selesai) {
    return (
      <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Pinci ekspresi="merayakan" ukuran={130} />
        <Text style={{ fontFamily: huruf.judul, fontSize: 30, color: warna.hijauTua }}>Seru sekali!</Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 20, color: warna.teks }}>
          {HEWAN[anak.hewan].emoji} {anak.nama}: {'⭐'.repeat(bintang.anak)}
        </Text>
        <Text style={{ fontFamily: huruf.anak, fontSize: 20, color: warna.teks }}>
          🧑 {sapaan}: {'⭐'.repeat(bintang.ortu)}
        </Text>
        <Tombol label="Kembali ke menu" besar style={{ alignSelf: 'stretch' }} onPress={() => router.replace('/dampingi')} />
      </View>
    );
  }
  const s = soal[i];
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ alignSelf: 'center', backgroundColor: giliranAnak ? warna.hijauPil : warna.oranyeMuda, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 }}>
        <Text style={{ fontFamily: huruf.judulTebal, fontSize: 18, color: warna.teks }}>
          Giliran {giliranAnak ? anak.nama : sapaan} · {i + 1}/{soal.length}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text style={{ fontFamily: huruf.anak, fontSize: 48, color: warna.teks }}>{s.teks} =</Text>
        <View style={{ minWidth: 140, height: 76, borderRadius: 18, borderWidth: 3, borderColor: tampil === false ? warna.oranye : warna.hijauDaun, backgroundColor: warna.putih, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: huruf.anak, fontSize: 40, color: tampil === false ? warna.hijauTua : warna.teks }}>{tampil === false ? s.kunci : isian || '?'}</Text>
        </View>
        {tampil !== null ? <Text style={{ fontFamily: huruf.anakTebal, fontSize: 18, color: tampil ? warna.hijauTua : '#B86E00' }}>{tampil ? 'Betul! ⭐' : `Jawabannya ${s.kunci}.`}</Text> : null}
      </View>
      {tampil === null ? (
        <PapanAngka
          tombolTambahan={[...tombolTambahan(s.bentukJawaban)]}
          cekNonaktif={!isian}
          onAngka={(a) => isian.length < 7 && setIsian(isian + a)}
          onHapus={() => setIsian(isian.slice(0, -1))}
          onCek={() => {
            const ok = cocokJawaban(s, isian);
            setTampil(ok);
            if (ok) {
              mainkanBunyi(repo, anak.id, 'ting');
              setBintang((b) => (giliranAnak ? { ...b, anak: b.anak + 1 } : { ...b, ortu: b.ortu + 1 }));
            }
          }}
        />
      ) : (
        <Tombol
          label="Giliran berikutnya"
          besar
          onPress={() => {
            setI(i + 1);
            setIsian('');
            setTampil(null);
          }}
        />
      )}
    </View>
  );
}
