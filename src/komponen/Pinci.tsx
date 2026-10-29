/**
 * Pinci, Si Kancil Pintar — digambar ulang dari SVG di desain/dari-claude-design
 * (Main.dc.html bagian 5, A01, A07, A07b, G08).
 *
 * Gerak kecil berulang (reanimated): berkedip dan telinga bergoyang.
 */
import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

const COKELAT = '#A0673A';
const GARIS = '#6B4423';
const KREM = '#FFF6E5';
const TINTA = '#2D3142';

export type EkspresiPinci =
  | 'senang'
  | 'menyapa'
  | 'melambai'
  | 'semangat'
  | 'merayakan'
  | 'berpikir'
  | 'empati'
  | 'minum'
  | 'menguap'
  | 'bersin'
  | 'diam';

interface Props {
  ekspresi?: EkspresiPinci;
  /** lebar dalam dp */
  ukuran?: number;
  /** tampilkan tubuh (ukuran penuh) */
  penuh?: boolean;
  /** matikan gerak (untuk uji dan layar soal) */
  tenang?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AEllipse = Animated.createAnimatedComponent(Ellipse);

/** Kelopak mata: ellipse krem yang menutup mata sebentar setiap ± 4 detik. */
function Kelopak({ cx, cy, r, tenang }: { cx: number; cy: number; r: number; tenang: boolean }) {
  const tutup = useSharedValue(0);
  useEffect(() => {
    if (tenang) return;
    tutup.value = withRepeat(
      withSequence(
        withDelay(3600, withTiming(1, { duration: 90 })),
        withTiming(0, { duration: 110 }),
      ),
      -1,
    );
  }, [tenang, tutup]);
  const props = useAnimatedProps(() => ({ ry: r * tutup.value, opacity: tutup.value > 0.05 ? 1 : 0 }));
  return <AEllipse cx={cx} cy={cy} rx={r + 1} fill={COKELAT} animatedProps={props} />;
}

function Telinga({ penuh }: { penuh: boolean }) {
  if (penuh) {
    return (
      <>
        <Ellipse cx={50} cy={38} rx={17} ry={24} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
        <Ellipse cx={110} cy={38} rx={17} ry={24} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
        <Ellipse cx={50} cy={40} rx={9} ry={13} fill={KREM} />
        <Ellipse cx={110} cy={40} rx={9} ry={13} fill={KREM} />
      </>
    );
  }
  return (
    <>
      <Ellipse cx={30} cy={28} rx={16} ry={22} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Ellipse cx={90} cy={28} rx={16} ry={22} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Ellipse cx={30} cy={30} rx={8} ry={12} fill={KREM} />
      <Ellipse cx={90} cy={30} rx={8} ry={12} fill={KREM} />
    </>
  );
}

/** Wajah dalam koordinat kepala 120 × 120 (pusat kepala 60,68). */
function Wajah({ ekspresi, tenang }: { ekspresi: EkspresiPinci; tenang: boolean }) {
  const mataBuka = (r = 11, pupil = 5, dx = 2, dy = 2) => (
    <>
      <Circle cx={46} cy={64} r={r} fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
      <Circle cx={74} cy={64} r={r} fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
      <Circle cx={46 + dx} cy={64 + dy} r={pupil} fill={TINTA} />
      <Circle cx={74 + dx} cy={64 + dy} r={pupil} fill={TINTA} />
      <Kelopak cx={46} cy={64} r={r} tenang={tenang} />
      <Kelopak cx={74} cy={64} r={r} tenang={tenang} />
    </>
  );
  const hidung = <Ellipse cx={60} cy={82} rx={5} ry={4} fill={GARIS} />;
  const senyum = (
    <Path d="M48 92 Q60 102 72 92" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
  );
  const mataSenyum = (
    <>
      <Path d="M40 62 Q46 54 52 62" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M68 62 Q74 54 80 62" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  );

  switch (ekspresi) {
    case 'semangat':
      return (
        <>
          <Path d="M38 52 L48 58" stroke={GARIS} strokeWidth={3} strokeLinecap="round" />
          <Path d="M82 52 L72 58" stroke={GARIS} strokeWidth={3} strokeLinecap="round" />
          {mataBuka(12, 6, 2, 0)}
          <Path d="M44 88 Q60 110 76 88 Q60 96 44 88 Z" fill={GARIS} />
        </>
      );
    case 'merayakan':
      return (
        <>
          <Path d="M40 54 L48 48" stroke={GARIS} strokeWidth={3} strokeLinecap="round" />
          <Path d="M80 54 L72 48" stroke={GARIS} strokeWidth={3} strokeLinecap="round" />
          <Path d="M40 60 Q46 50 52 60" fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
          <Path d="M68 60 Q74 50 80 60" fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
          <Path d="M44 86 Q60 112 76 86 Q60 100 44 86 Z" fill={GARIS} />
          <Path d="M18 20 l4 10 l-10 -2 z" fill="#F4C542" />
          <Path d="M102 18 l-4 10 l10 -2 z" fill="#F4C542" />
        </>
      );
    case 'berpikir':
      return (
        <>
          <Path d="M68 50 Q78 46 86 52" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          {mataBuka(10, 5, 4, 2)}
          {hidung}
          <Circle cx={61} cy={94} r={3} fill={GARIS} />
          <Circle cx={90} cy={40} r={4} fill="#CBD2E0" />
          <Circle cx={98} cy={30} r={3} fill="#CBD2E0" />
        </>
      );
    case 'empati':
      return (
        <>
          <Path d="M40 58 Q46 52 52 58" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M68 58 Q74 52 80 58" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M40 64 A10 8 0 0 1 52 64" fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
          <Path d="M68 64 A10 8 0 0 1 80 64" fill="#FFFFFF" stroke={GARIS} strokeWidth={2} />
          {hidung}
          <Path d="M50 92 Q60 98 70 92" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      );
    case 'minum':
    case 'melambai':
      return (
        <>
          {mataSenyum}
          {hidung}
          {ekspresi === 'melambai' && (
            <Path d="M46 92 Q60 104 74 92" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          )}
        </>
      );
    case 'menguap':
      return (
        <>
          <Path d="M38 62 Q46 68 54 62" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M66 62 Q74 68 82 62" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Ellipse cx={60} cy={92} rx={9} ry={11} fill={GARIS} />
          <Ellipse cx={60} cy={96} rx={5} ry={4} fill="#E88A8A" />
          <SvgText x={92} y={22} fontSize={14} fontWeight="800" fill="#C9A227">
            z
          </SvgText>
          <SvgText x={102} y={10} fontSize={10} fontWeight="800" fill="#C9A227">
            z
          </SvgText>
        </>
      );
    case 'bersin':
      return (
        <>
          <Path d="M38 60 L52 66 L38 70" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M82 60 L68 66 L82 70" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Ellipse cx={60} cy={82} rx={6} ry={5} fill="#C9604A" />
          <Ellipse cx={60} cy={95} rx={7} ry={5} fill={GARIS} />
          <Circle cx={92} cy={86} r={3} fill="#BFE3F7" />
          <Circle cx={100} cy={80} r={2.5} fill="#BFE3F7" />
          <Circle cx={98} cy={92} r={2} fill="#BFE3F7" />
        </>
      );
    case 'diam':
      return (
        <>
          <Circle cx={46} cy={64} r={9} fill="#FFFFFF" />
          <Circle cx={74} cy={64} r={9} fill="#FFFFFF" />
          <Circle cx={48} cy={66} r={4.5} fill={TINTA} />
          <Circle cx={76} cy={66} r={4.5} fill={TINTA} />
        </>
      );
    case 'menyapa':
      return (
        <>
          {mataBuka()}
          {hidung}
          <Path d="M46 90 Q60 104 74 90" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      );
    case 'senang':
    default:
      return (
        <>
          {mataBuka()}
          {hidung}
          {senyum}
        </>
      );
  }
}

/** Tubuh untuk ukuran penuh (viewBox 160 × 200). */
function Tubuh({ ekspresi }: { ekspresi: EkspresiPinci }) {
  return (
    <>
      <Ellipse cx={80} cy={150} rx={46} ry={38} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Ellipse cx={80} cy={160} rx={26} ry={22} fill={KREM} />
      {ekspresi === 'melambai' ? (
        <>
          <Path d="M118 150 Q132 160 124 176" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M42 140 Q20 118 22 92" stroke={COKELAT} strokeWidth={12} fill="none" strokeLinecap="round" />
          <Circle cx={22} cy={88} r={9} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
          <Rect x={112} y={124} width={24} height={32} rx={8} fill="#FF9F1C" stroke="#D97F10" strokeWidth={2} />
        </>
      ) : ekspresi === 'minum' ? (
        <Rect x={18} y={126} width={24} height={32} rx={8} fill="#FF9F1C" stroke="#D97F10" strokeWidth={2} />
      ) : (
        <>
          <Path d="M40 170 Q30 150 44 138" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M120 170 Q130 150 116 138" stroke={GARIS} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Rect x={96} y={128} width={26} height={34} rx={8} fill="#FF9F1C" stroke="#D97F10" strokeWidth={2} />
        </>
      )}
      {/* Syal hijau */}
      <Path d="M58 120 Q80 136 102 120" stroke="#3BB273" strokeWidth={10} fill="none" strokeLinecap="round" />
    </>
  );
}

function GelasMinum() {
  return (
    <>
      <Path
        d="M98 100 L132 92 L136 130 L104 134 Z"
        fill="#BFE3F7"
        stroke="#4EA8DE"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <Path d="M104 112 L134 106" stroke="#4EA8DE" strokeWidth={2} />
      <Path d="M118 140 Q130 150 124 168" stroke={COKELAT} strokeWidth={12} fill="none" strokeLinecap="round" />
    </>
  );
}

const LABEL: Record<EkspresiPinci, string> = {
  senang: 'Pinci senang',
  menyapa: 'Pinci menyapa',
  melambai: 'Pinci melambai',
  semangat: 'Pinci semangat',
  merayakan: 'Pinci merayakan',
  berpikir: 'Pinci berpikir',
  empati: 'Pinci menemani',
  minum: 'Pinci minum air',
  menguap: 'Pinci menguap',
  bersin: 'Pinci bersin',
  diam: 'Pinci menemani',
};

export function Pinci({ ekspresi = 'senang', ukuran = 96, penuh = false, tenang = false, style }: Props) {
  // Telinga bergoyang pelan: seluruh gambar berayun ±2°.
  const ayun = useSharedValue(0);
  useEffect(() => {
    if (tenang) return;
    ayun.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [tenang, ayun]);
  const gayaAyun = useAnimatedStyle(() => ({ transform: [{ rotate: `${ayun.value * 2}deg` }] }));

  const tinggi = penuh ? (ukuran * 200) / 160 : ukuran;
  // Ekspresi "diam" adalah versi kecil untuk pojok layar soal.
  const kecil = ekspresi === 'diam';

  return (
    <View style={[{ width: ukuran, height: tinggi }, style]} accessibilityRole="image" accessibilityLabel={LABEL[ekspresi]}>
      <Animated.View style={[{ width: ukuran, height: tinggi }, gayaAyun]}>
        <Svg width={ukuran} height={tinggi} viewBox={penuh ? '0 0 160 200' : '0 0 120 120'}>
          {penuh && <Tubuh ekspresi={ekspresi} />}
          <G transform={penuh ? 'translate(20 12)' : undefined}>
            {kecil ? (
              <>
                <Ellipse cx={34} cy={30} rx={15} ry={20} fill={COKELAT} stroke={GARIS} strokeWidth={4} />
                <Ellipse cx={86} cy={30} rx={15} ry={20} fill={COKELAT} stroke={GARIS} strokeWidth={4} />
                <Circle cx={60} cy={68} r={44} fill={COKELAT} stroke={GARIS} strokeWidth={4} />
              </>
            ) : (
              <>
                <Telinga penuh={false} />
                <Circle cx={60} cy={68} r={46} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
                <Circle cx={80} cy={42} r={3} fill="#FFFFFF" opacity={0.6} />
                <Ellipse cx={60} cy={86} rx={30} ry={22} fill={KREM} />
              </>
            )}
            <Wajah ekspresi={ekspresi} tenang={tenang} />
          </G>
          {penuh && ekspresi === 'minum' && <GelasMinum />}
        </Svg>
      </Animated.View>
    </View>
  );
}

/** Ikon kepala Pinci untuk logo (kecil, tanpa gerak). */
export function KepalaLogo({ ukuran = 36 }: { ukuran?: number }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 120 120">
      <Ellipse cx={30} cy={28} rx={16} ry={22} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Ellipse cx={90} cy={28} rx={16} ry={22} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Circle cx={60} cy={68} r={46} fill={COKELAT} stroke={GARIS} strokeWidth={3} />
      <Ellipse cx={60} cy={86} rx={30} ry={22} fill={KREM} />
      <Circle cx={46} cy={64} r={10} fill="#FFFFFF" />
      <Circle cx={74} cy={64} r={10} fill="#FFFFFF" />
      <Circle cx={48} cy={66} r={4.5} fill={TINTA} />
      <Circle cx={76} cy={66} r={4.5} fill={TINTA} />
    </Svg>
  );
}
