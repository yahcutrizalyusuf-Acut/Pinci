/**
 * Tombol rekam suara anak (CLAUDE.md aturan 12). HANYA dipasang oleh layar kalau Izin 8 menyala.
 *
 * - Izin mikrofon diminta saat tombol rekam PERTAMA KALI ditekan, bukan saat aplikasi dibuka.
 * - Mikrofon hanya menyala selama merekam. Tanda jelas: lingkaran merah berdenyut + waktu berjalan.
 * - Berhenti sendiri di batas waktu: 20 detik per kalimat, 2 menit per cerita utuh.
 * - Hasil disimpan lewat GudangRekaman (folder pribadi aplikasi). Tanpa penilaian ucapan oleh mesin.
 */
import { createAudioPlayer, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, type AudioPlayer, type RecordingOptions } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { huruf, warna } from '../../desain/token';
import { batasDetik, formatDetik, type CatatanRekaman, type JenisRekaman } from '../../fitur/rekaman';
import { gudangRekaman } from '../../layanan/rekaman';

const MERAH = '#E5484D';

/** Suara 64 kbps satu saluran (± 0,5 MB per menit, rancangan 13 bagian 4.2). */
export const PRESET_REKAM: RecordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  sampleRate: 22050,
  numberOfChannels: 1,
  bitRate: 64000,
  web: { mimeType: 'audio/webm', bitsPerSecond: 64000 },
};

let pemutar: AudioPlayer | null = null;

/** Putar satu rekaman (hanya di dalam aplikasi; tidak ada bagikan atau ekspor). */
export function putarRekaman(berkas: string) {
  try {
    pemutar?.remove();
  } catch {
    /* abaikan */
  }
  try {
    pemutar = createAudioPlayer(berkas);
    pemutar.play();
  } catch {
    pemutar = null;
  }
}

export interface PropsPerekam {
  anakId: string;
  komikId: string;
  panelId: string | null;
  jenis: JenisRekaman;
  label?: string;
  /** langsung mulai merekam saat dipasang (tombol "Coba lagi" di Dengar Bedanya) */
  mulaiOtomatis?: boolean;
  onSelesai?: (c: CatatanRekaman) => void;
}

export function Perekam({ anakId, komikId, panelId, jenis, label, mulaiOtomatis, onSelesai }: PropsPerekam) {
  const perekam = useAudioRecorder(PRESET_REKAM);
  const [keadaan, setKeadaan] = useState<'siap' | 'merekam' | 'ditolak' | 'galat'>('siap');
  const [detik, setDetik] = useState(0);
  const mulai = useRef(0);
  const jam = useRef<ReturnType<typeof setInterval> | null>(null);
  const batas = batasDetik(jenis);
  const denyut = useSharedValue(1);
  const gayaDenyut = useAnimatedStyle(() => ({ transform: [{ scale: denyut.value }], opacity: 2 - denyut.value }));

  useEffect(
    () => () => {
      if (jam.current) clearInterval(jam.current);
      cancelAnimation(denyut);
    },
    [denyut],
  );

  const berhenti = async () => {
    if (jam.current) clearInterval(jam.current);
    jam.current = null;
    cancelAnimation(denyut);
    denyut.set(1);
    const lama = Math.min(batas, (Date.now() - mulai.current) / 1000);
    try {
      await perekam.stop();
      await setAudioModeAsync({ allowsRecording: false });
      const alamat = perekam.uri;
      setKeadaan('siap');
      setDetik(0);
      if (alamat) {
        const c = await gudangRekaman().tambah({ anak_id: anakId, komikId, panelId, jenis, alamatSementara: alamat, detik: lama });
        onSelesai?.(c);
      }
    } catch {
      setKeadaan('galat');
    }
  };

  const rekam = async () => {
    try {
      const izin = await requestRecordingPermissionsAsync();
      if (!izin.granted) {
        setKeadaan('ditolak');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await perekam.prepareToRecordAsync();
      perekam.record({ forDuration: batas });
      mulai.current = Date.now();
      setDetik(0);
      setKeadaan('merekam');
      denyut.set(withRepeat(withTiming(1.35, { duration: 700 }), -1, true));
      jam.current = setInterval(() => {
        const d = (Date.now() - mulai.current) / 1000;
        setDetik(d);
        if (d >= batas) void berhenti();
      }, 250);
    } catch {
      setKeadaan('galat');
    }
  };

  const sudahOtomatis = useRef(false);
  useEffect(() => {
    if (mulaiOtomatis && !sudahOtomatis.current) {
      sudahOtomatis.current = true;
      void rekam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mulaiOtomatis]);

  const merekam = keadaan === 'merekam';
  return (
    <View style={{ gap: 6, alignItems: 'center' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={merekam ? `Berhenti merekam. Sudah ${Math.floor(detik)} detik dari ${batas} detik` : (label ?? (jenis === 'utuh' ? 'Rekam cerita utuh' : 'Rekam suaraku'))}
        onPress={merekam ? () => void berhenti() : () => void rekam()}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 18, borderRadius: 26, backgroundColor: merekam ? '#FDECEC' : warna.putih, borderWidth: 2, borderColor: MERAH, opacity: pressed ? 0.85 : 1 })}
      >
        <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
          {merekam ? <Animated.View style={[{ position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: MERAH }, gayaDenyut]} /> : null}
          <View style={{ width: merekam ? 14 : 18, height: merekam ? 14 : 18, borderRadius: merekam ? 3 : 9, backgroundColor: MERAH }} />
        </View>
        <Text style={{ fontFamily: huruf.anakTebal, fontSize: 17, color: warna.teks }}>{merekam ? `Merekam… ${formatDetik(detik)} / ${formatDetik(batas)}` : `🎙 ${label ?? (jenis === 'utuh' ? 'Rekam cerita utuh' : 'Suaraku')}`}</Text>
      </Pressable>
      {merekam ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua }}>Mikrofon menyala. Ketuk sekali lagi untuk berhenti.</Text> : null}
      {keadaan === 'ditolak' ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua, textAlign: 'center' }}>Izin mikrofon belum diberikan. Ceritakan Lagi tetap bisa dipakai tanpa merekam.</Text> : null}
      {keadaan === 'galat' ? <Text style={{ fontFamily: huruf.ortu, fontSize: 13, color: warna.teksKedua, textAlign: 'center' }}>Rekaman belum berhasil. Coba sekali lagi.</Text> : null}
    </View>
  );
}
