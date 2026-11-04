/**
 * Daftar masa coba 14 hari bersama pengawas (mode orang tua, di balik PIN). Keputusan Acut 3 Nov 2026.
 * Langkah: anak dan pelajaran → online atau tatap muka → kontak → kenali anak (boleh dilewati) → telepon → izin.
 * Tanpa harga dan tanpa cara bayar di aplikasi: pengawas menghubungi orang tua di luar aplikasi
 * (aturan pembayaran Google Play, laporan Play Console 3 Nov 2026).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData } from '@/data/konteks';
import type { Pelajaran } from '@/data/jenis';
import { daftarCoba, type DataDaftarCoba } from '@/data/supabase';
import { huruf, warna } from '@/desain/token';
import {
  CONTOH_TUJUAN,
  IZIN_KONTAK,
  IZIN_PENGEMBANGAN,
  PERTANYAAN_PENGENALAN,
  TEKS_TATAP_MUKA,
  VERSI_DAFTAR,
  WAKTU_TELEPON,
  emailSah,
  kunciDaftarCoba,
  type CatatanDaftarCoba,
  pelajaranUntukKelas,
  waSah,
} from '@/fitur/pengenalan';
import { KepalaLayar, TeksOrtu, Tombol } from '@/komponen/dasar';

type Tahap = 'memuat' | 'sudah' | 'anak' | 'cara' | 'tatap_muka' | 'kontak' | 'kenali' | 'telepon' | 'izin' | 'selesai';
const URUTAN: Tahap[] = ['anak', 'cara', 'kontak', 'kenali', 'telepon', 'izin'];

const PESAN_GALAT: Record<string, string> = {
  isian_tidak_lengkap: 'Ada isian yang belum lengkap. Periksa nama, kelas, dan nomor WhatsApp atau email.',
  isian_tidak_valid: 'Ada isian yang belum sesuai. Periksa lagi, lalu kirim ulang.',
  belum_setuju: 'Centang persetujuan dihubungi pengawas dulu.',
  kota_kosong: 'Tulis kota untuk antrean kelas tatap muka.',
  terlalu_sering: 'Pendaftaran dari kontak ini sudah terlalu banyak hari ini. Coba lagi besok, atau isi email yang berbeda.',
  jaringan: 'Belum terkirim. Periksa internet, lalu coba lagi.',
};

function Kotak({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: warna.putih, borderRadius: 16, padding: 16, gap: 10 }}>{children}</View>;
}

function Pilih({ nyala, label, isi, onPress, bulat = false }: { nyala: boolean; label: string; isi?: string; onPress: () => void; bulat?: boolean }) {
  return (
    <Pressable
      accessibilityRole={bulat ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: nyala }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{ flexDirection: 'row', gap: 12, padding: 12, borderRadius: 12, borderWidth: 2, borderColor: nyala ? warna.hijauTua : warna.kremGaris, backgroundColor: nyala ? '#EAF6EF' : warna.putih }}
    >
      <View style={{ width: 24, height: 24, borderRadius: bulat ? 12 : 7, borderWidth: 2, borderColor: nyala ? warna.hijauTua : warna.ikonRedup, backgroundColor: nyala ? warna.hijauTua : warna.putih, alignItems: 'center', justifyContent: 'center' }}>
        {nyala ? <Text style={{ color: warna.putih, fontFamily: huruf.ortuTebal, fontSize: 13 }}>✓</Text> : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 15, color: warna.teks }}>{label}</Text>
        {isi ? <Text style={{ fontFamily: huruf.ortu, fontSize: 14, lineHeight: 20, color: warna.teksKedua }}>{isi}</Text> : null}
      </View>
    </Pressable>
  );
}

function Isian({ label, nilai, ubah, contoh, jenis }: { label: string; nilai: string; ubah: (t: string) => void; contoh?: string; jenis?: 'telepon' | 'email' }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: huruf.ortuTebal, fontSize: 14, color: warna.teks }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={nilai}
        onChangeText={ubah}
        placeholder={contoh}
        placeholderTextColor={warna.ikonRedup}
        keyboardType={jenis === 'telepon' ? 'phone-pad' : jenis === 'email' ? 'email-address' : 'default'}
        autoCapitalize={jenis ? 'none' : 'words'}
        style={{ fontFamily: huruf.ortu, fontSize: 16, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: warna.kremGaris, color: warna.teks, backgroundColor: warna.putih }}
      />
    </View>
  );
}

export default function DaftarCobaLayar() {
  const router = useRouter();
  const { anak: anakId } = useLocalSearchParams<{ anak?: string }>();
  const { repo, server, daftarAnak, keluarga } = useData();
  const anak = daftarAnak.find((a) => a.id === anakId) ?? daftarAnak[0];
  const [tahap, setTahap] = useState<Tahap>('memuat');
  const [catatan, setCatatan] = useState<CatatanDaftarCoba | null>(null);
  const [d, setD] = useState({
    namaOrtu: keluarga?.sapaanOrtu && keluarga.sapaanOrtu !== 'Ayah' && keluarga.sapaanOrtu !== 'Bunda' ? keluarga.sapaanOrtu : '',
    namaAnak: '',
    pelajaran: [] as Pelajaran[],
    tujuan: '',
    cara: 'online' as 'online' | 'antre_tatap_muka',
    kota: '',
    wa: '',
    email: '',
    pengenalan: {} as Record<string, string>,
    mintaTelepon: false,
    waktuTelepon: '',
    izinKontak: false,
    izinPengembangan: false,
  });
  const [pesan, setPesan] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [antrean, setAntrean] = useState<number | null>(null);
  const ubah = (lain: Partial<typeof d>) => setD((x) => ({ ...x, ...lain }));

  // Pendaftaran yang sudah terkirim ditampilkan lagi (bukan formulir kosong), dan bisa diubah lalu dikirim ulang.
  useEffect(() => {
    if (!anak) return;
    let batal = false;
    repo
      .nilai<CatatanDaftarCoba>(kunciDaftarCoba(anak.id))
      .then((c) => {
        if (batal) return;
        // Hanya saat layar baru dibuka; menyimpan pendaftaran tidak boleh memindahkan layar yang sedang berjalan.
        if (c) {
          setCatatan(c);
          setD((x) => ({ ...x, ...c, izinKontak: false }));
        }
        setTahap((t) => (t === 'memuat' ? (c ? 'sudah' : 'anak') : t));
      })
      .catch(() => !batal && setTahap((t) => (t === 'memuat' ? 'anak' : t)));
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, anak?.id]);

  if (!anak) return <Latar><TeksOrtu>Tambahkan profil anak lebih dulu.</TeksOrtu></Latar>;
  if (!server) return <Latar><TeksOrtu>Pendaftaran butuh sambungan ke server.</TeksOrtu></Latar>;

  const pilihan = pelajaranUntukKelas(anak.kelas);
  const nomor = URUTAN.indexOf(tahap === 'tatap_muka' ? 'cara' : tahap) + 1;
  const kembali = () => {
    setPesan('');
    if (tahap === 'anak' && catatan) return setTahap('sudah');
    if (tahap === 'anak' || tahap === 'selesai' || tahap === 'sudah' || tahap === 'memuat') return router.back();
    if (tahap === 'tatap_muka') return setTahap('cara');
    setTahap(URUTAN[Math.max(0, URUTAN.indexOf(tahap) - 1)]);
  };
  const lanjut = (ke: Tahap, cek?: () => string | null) => {
    const g = cek?.() ?? null;
    setPesan(g ?? '');
    if (!g) setTahap(ke);
  };

  const kirim = async () => {
    if (!d.izinKontak) return setPesan(PESAN_GALAT.belum_setuju);
    setMemuat(true);
    setPesan('');
    const data: DataDaftarCoba = {
      nama_ortu: d.namaOrtu.trim(),
      ...(d.wa.trim() ? { wa: d.wa.trim() } : {}),
      ...(d.email.trim() ? { email: d.email.trim() } : {}),
      nama_lengkap_anak: d.namaAnak.trim(),
      kelas: anak.kelas,
      pelajaran: d.pelajaran,
      ...(d.tujuan.trim() ? { tujuan: d.tujuan.trim() } : {}),
      cara: d.cara,
      ...(d.cara === 'antre_tatap_muka' ? { kota: d.kota.trim() } : {}),
      ...(Object.keys(d.pengenalan).length ? { pengenalan: d.pengenalan } : {}),
      minta_telepon: d.mintaTelepon,
      ...(d.mintaTelepon && d.waktuTelepon ? { waktu_telepon: d.waktuTelepon } : {}),
      izin_kontak: true,
      izin_pengembangan: d.izinPengembangan,
      versi_teks: VERSI_DAFTAR,
    };
    const h = await daftarCoba(server, data);
    setMemuat(false);
    if (!h.ok) return setPesan(PESAN_GALAT[h.alasan] ?? PESAN_GALAT.isian_tidak_valid);
    const nomorAntrean = h.ok && h.nomorAntrean ? h.nomorAntrean : undefined;
    const baru: CatatanDaftarCoba = {
      waktu: new Date().toISOString(),
      namaOrtu: d.namaOrtu.trim(),
      namaAnak: d.namaAnak.trim(),
      pelajaran: d.pelajaran,
      tujuan: d.tujuan.trim(),
      cara: d.cara,
      kota: d.kota.trim(),
      wa: d.wa.trim(),
      email: d.email.trim(),
      pengenalan: d.pengenalan,
      mintaTelepon: d.mintaTelepon,
      waktuTelepon: d.waktuTelepon,
      izinPengembangan: d.izinPengembangan,
      ...(nomorAntrean ? { nomorAntrean } : {}),
    };
    await repo.aturNilai(kunciDaftarCoba(anak.id), baru, anak.id);
    setCatatan(baru);
    setAntrean(nomorAntrean ?? null);
    setTahap('selesai');
  };

  return (
    <Latar onKembali={kembali} langkah={tahap === 'selesai' || tahap === 'sudah' || tahap === 'memuat' ? undefined : `Langkah ${nomor} dari ${URUTAN.length}`}>
      {tahap === 'sudah' && catatan ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Pendaftaran sudah terkirim</TeksOrtu>
          <TeksOrtu>
            {catatan.namaAnak} · Kelas {anak.kelas} · dikirim {new Date(catatan.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </TeksOrtu>
          <TeksOrtu style={{ color: warna.teksKedua }}>
            Pelajaran tambahan: {catatan.pelajaran.length ? pilihan.filter((p) => catatan.pelajaran.includes(p.kode)).map((p) => p.judul).join(', ') : 'belum dipilih'}
            {catatan.cara === 'antre_tatap_muka' ? ` · Antre tatap muka ${catatan.kota}${catatan.nomorAntrean ? `, nomor ${catatan.nomorAntrean}` : ''}` : ' · Kelas online'}
          </TeksOrtu>
          <TeksOrtu>
            Pengawas akan menghubungi {catatan.wa ? `WhatsApp ${catatan.wa}` : catatan.email} untuk memberikan kode kelas. Setelah dapat kodenya, masukkan lewat tombol Sudah punya kode kelas.
          </TeksOrtu>
          <Tombol label="Kembali" ortu onPress={() => router.back()} />
          <Tombol label="Ubah dan kirim ulang" ortu varian="garis" onPress={() => setTahap('anak')} />
        </Kotak>
      ) : null}
      {tahap === 'anak' ? (
        <>
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Coba 14 hari bersama pengawas</TeksOrtu>
            <TeksOrtu style={{ color: warna.teksKedua }}>Gratis. Pengawas memantau latihan {anak.nama} setiap Senin, Rabu, dan Jumat, lalu mengirim catatan untuk Anda.</TeksOrtu>
            <Isian label="Nama Anda" nilai={d.namaOrtu} ubah={(t) => ubah({ namaOrtu: t })} contoh="Contoh: Bu Ani" />
            <Isian label="Nama lengkap anak" nilai={d.namaAnak} ubah={(t) => ubah({ namaAnak: t })} contoh={`Contoh: ${anak.nama} …`} />
            <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>Kelas {anak.kelas} (dari profil anak)</TeksOrtu>
          </Kotak>
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>Pelajaran yang Anda inginkan</TeksOrtu>
            <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>Lancar Matematika, Baca Ulang, dan game selalu ada. Pilih tambahan: satu, beberapa, atau semua.</TeksOrtu>
            {pilihan.map((p) => (
              <Pilih
                key={p.kode}
                nyala={d.pelajaran.includes(p.kode)}
                label={p.judul}
                isi={p.isi}
                onPress={() => ubah({ pelajaran: d.pelajaran.includes(p.kode) ? d.pelajaran.filter((x) => x !== p.kode) : [...d.pelajaran, p.kode] })}
              />
            ))}
          </Kotak>
          <Kotak>
            <Isian label="Apa harapan Anda untuk anak? (boleh dikosongkan)" nilai={d.tujuan} ubah={(t) => ubah({ tujuan: t })} contoh="Contoh: lancar membaca" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CONTOH_TUJUAN.map((t) => (
                <Pressable key={t} accessibilityRole="button" onPress={() => ubah({ tujuan: t })} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: warna.kremLembut }}>
                  <Text style={{ fontFamily: huruf.ortuSedang, fontSize: 14, color: warna.teks }}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </Kotak>
          <Tombol
            label="Lanjut"
            ortu
            onPress={() => lanjut('cara', () => (!d.namaOrtu.trim() || !d.namaAnak.trim() ? 'Isi nama Anda dan nama lengkap anak.' : null))}
          />
        </>
      ) : null}

      {tahap === 'cara' ? (
        <>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Cara belajar</TeksOrtu>
          <Pilih bulat nyala={d.cara === 'online'} label="Kelas online" isi={TEKS_TATAP_MUKA.onlineIsi} onPress={() => ubah({ cara: 'online' })} />
          <Pilih bulat nyala={d.cara === 'antre_tatap_muka'} label="Kelas tatap muka" isi="Belajar langsung bersama guru di kota Anda." onPress={() => setTahap('tatap_muka')} />
          <Tombol label="Lanjut" ortu onPress={() => lanjut('kontak')} />
        </>
      ) : null}

      {tahap === 'tatap_muka' ? (
        <>
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>{TEKS_TATAP_MUKA.judul}</TeksOrtu>
            <TeksOrtu>{TEKS_TATAP_MUKA.isi}</TeksOrtu>
          </Kotak>
          <Pilih bulat nyala={d.cara === 'antre_tatap_muka'} label={TEKS_TATAP_MUKA.antre} isi={TEKS_TATAP_MUKA.antreIsi} onPress={() => ubah({ cara: 'antre_tatap_muka' })} />
          {d.cara === 'antre_tatap_muka' ? <Isian label="Kota Anda" nilai={d.kota} ubah={(t) => ubah({ kota: t })} contoh="Contoh: Banda Aceh" /> : null}
          <Pilih bulat nyala={d.cara === 'online'} label={TEKS_TATAP_MUKA.online} isi={TEKS_TATAP_MUKA.onlineIsi} onPress={() => ubah({ cara: 'online' })} />
          <Tombol label="Lanjut" ortu onPress={() => lanjut('kontak', () => (d.cara === 'antre_tatap_muka' && !d.kota.trim() ? PESAN_GALAT.kota_kosong : null))} />
        </>
      ) : null}

      {tahap === 'kontak' ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Ke mana pengawas menghubungi Anda?</TeksOrtu>
          <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>Isi salah satu atau keduanya. Kode kelas dan catatan pengawas dikirim ke sini.</TeksOrtu>
          <Isian label="Nomor WhatsApp" nilai={d.wa} ubah={(t) => ubah({ wa: t })} contoh="08…" jenis="telepon" />
          <Isian label="Email" nilai={d.email} ubah={(t) => ubah({ email: t })} contoh="nama@contoh.com" jenis="email" />
          <Tombol
            label="Lanjut"
            ortu
            onPress={() =>
              lanjut('kenali', () => {
                if (!d.wa.trim() && !d.email.trim()) return 'Isi nomor WhatsApp atau email.';
                if (d.wa.trim() && !waSah(d.wa)) return 'Nomor WhatsApp belum sesuai. Contoh: 0812 3456 7890.';
                if (d.email.trim() && !emailSah(d.email)) return 'Email belum sesuai.';
                return null;
              })
            }
          />
        </Kotak>
      ) : null}

      {tahap === 'kenali' ? (
        <>
          <Kotak>
            <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Kenali {anak.nama} lebih dekat</TeksOrtu>
            <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>
              8 pertanyaan singkat supaya pengawas bisa mengajar dengan cara yang paling cocok. Semuanya boleh dilewati.
            </TeksOrtu>
          </Kotak>
          {PERTANYAAN_PENGENALAN.map((q, i) => (
            <Kotak key={q.kode}>
              <TeksOrtu style={{ fontFamily: huruf.ortuTebal }}>
                {i + 1}. {q.tanya}
              </TeksOrtu>
              {q.pilihan.map((p) => (
                <Pilih
                  key={p.kode}
                  bulat
                  nyala={d.pengenalan[q.kode] === p.kode}
                  label={p.teks}
                  onPress={() => {
                    const baru = { ...d.pengenalan };
                    if (baru[q.kode] === p.kode) delete baru[q.kode];
                    else baru[q.kode] = p.kode;
                    ubah({ pengenalan: baru });
                  }}
                />
              ))}
            </Kotak>
          ))}
          <Tombol label="Lanjut" ortu onPress={() => lanjut('telepon')} />
          <Tombol label="Lewati pertanyaan" ortu varian="garis" onPress={() => lanjut('telepon')} />
        </>
      ) : null}

      {tahap === 'telepon' ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Mau ditelepon pengawas?</TeksOrtu>
          <TeksOrtu style={{ color: warna.teksKedua, fontSize: 14 }}>
            Obrolan singkat ± 10 menit lewat telepon atau WhatsApp, supaya pengawas mengenal {anak.nama} dan harapan Anda. Tidak wajib.
          </TeksOrtu>
          <Pilih bulat nyala={d.mintaTelepon} label="Ya, saya mau ditelepon" onPress={() => ubah({ mintaTelepon: true })} />
          <Pilih bulat nyala={!d.mintaTelepon} label="Tidak perlu" onPress={() => ubah({ mintaTelepon: false, waktuTelepon: '' })} />
          {d.mintaTelepon ? (
            <>
              <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 14 }}>Waktu yang paling cocok</TeksOrtu>
              {WAKTU_TELEPON.map((w) => (
                <Pilih key={w.kode} bulat nyala={d.waktuTelepon === w.kode} label={w.teks} onPress={() => ubah({ waktuTelepon: w.kode })} />
              ))}
            </>
          ) : null}
          <Tombol label="Lanjut" ortu onPress={() => lanjut('izin')} />
        </Kotak>
      ) : null}

      {tahap === 'izin' ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Persetujuan</TeksOrtu>
          <Pilih nyala={d.izinKontak} label="Dihubungi pengawas (wajib)" isi={IZIN_KONTAK} onPress={() => ubah({ izinKontak: !d.izinKontak })} />
          <Pilih nyala={d.izinPengembangan} label="Membantu pengembangan (boleh tidak)" isi={IZIN_PENGEMBANGAN} onPress={() => ubah({ izinPengembangan: !d.izinPengembangan })} />
          <Tombol label={memuat ? 'Mengirim…' : 'Kirim pendaftaran'} ortu nonaktif={memuat} onPress={kirim} />
        </Kotak>
      ) : null}

      {tahap === 'selesai' ? (
        <Kotak>
          <TeksOrtu style={{ fontFamily: huruf.ortuTebal, fontSize: 18 }}>Terima kasih, pendaftaran terkirim</TeksOrtu>
          <TeksOrtu>Pengawas akan menghubungi Anda dalam 1 hari kerja untuk memberikan kode kelas. Sambil menunggu, {anak.nama} tetap bisa berlatih setiap hari.</TeksOrtu>
          {antrean ? (
            <TeksOrtu>
              {anak.nama} tercatat di antrean kelas tatap muka {d.kota.trim()}, nomor <Text style={{ fontFamily: huruf.ortuTebal }}>{antrean}</Text>. Kami kabari saat kelasnya siap dibuka.
            </TeksOrtu>
          ) : null}
          <Tombol label="Selesai" ortu onPress={() => router.back()} />
        </Kotak>
      ) : null}

      {pesan ? <TeksOrtu style={{ color: '#C0392B' }}>{pesan}</TeksOrtu> : null}
    </Latar>
  );
}

function Latar({ children, onKembali, langkah }: { children: React.ReactNode; onKembali?: () => void; langkah?: string }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.abuTerang }}>
      <View style={{ paddingHorizontal: 8, backgroundColor: warna.putih }}>
        <KepalaLayar judul="Coba 14 hari" ortu onKembali={onKembali} />
        {langkah ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua, paddingHorizontal: 8, paddingBottom: 8 }}>{langkah}</Text> : null}
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center' }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
