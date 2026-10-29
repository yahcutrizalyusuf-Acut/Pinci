/** Kartu target 2D kecil: tampak depan, tampak samping (dari kanan), tampak atas. */
import { Text, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';

import { bayangan, huruf, warna } from '../../../desain/token';
import type { BelumCocok, KartuTarget as Target } from '../logika';
import { KAYU } from './Kubus';

const LEBAR = 92;
const TINGGI = 76;
const JEDA = 3;

/** Kartu batang: tiap kolom setinggi angkanya. `tandai` = indeks kolom yang belum cocok. */
function KartuBatang({ tinggi, tinggiMaks, tandai, label }: { tinggi: readonly number[]; tinggiMaks: number; tandai: readonly number[]; label: string }) {
  const n = tinggi.length;
  const sel = Math.min(22, (LEBAR - 12 - JEDA * (n - 1)) / n, (TINGGI - 12 - JEDA * (tinggiMaks - 1)) / tinggiMaks);
  const lebarIsi = n * sel + (n - 1) * JEDA;
  const x0 = (LEBAR - lebarIsi) / 2;
  const dasar = TINGGI - 6;
  return (
    <Svg width={LEBAR} height={TINGGI} accessibilityLabel={label}>
      <Rect x={0} y={0} width={LEBAR} height={TINGGI} rx={12} fill={KAYU.latarKartu} />
      {tinggi.map((t, i) => {
        const x = x0 + i * (sel + JEDA);
        const kotak = Array.from({ length: t }, (_, z) => (
          <Rect
            key={z}
            x={x}
            y={dasar - (z + 1) * sel - z * JEDA}
            width={sel}
            height={sel}
            rx={3}
            fill={KAYU.sedang}
            stroke={KAYU.garis}
            strokeWidth={2}
          />
        ));
        const tinggiBingkai = Math.max(1, t) * sel + (Math.max(1, t) - 1) * JEDA + 4;
        return (
          <G key={i}>
            {kotak}
            {tandai.includes(i) ? (
              <Rect
                x={x - 2}
                y={dasar - tinggiBingkai + 2}
                width={sel + 4}
                height={tinggiBingkai}
                rx={4}
                fill="none"
                stroke={KAYU.putus}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            ) : null}
          </G>
        );
      })}
    </Svg>
  );
}

function KartuAtas({ denah, tandai, label }: { denah: readonly (readonly boolean[])[]; tandai: readonly [number, number][]; label: string }) {
  const baris = denah.length;
  const kolom = denah[0]?.length ?? 0;
  const sel = Math.min(22, (LEBAR - 12 - JEDA * (kolom - 1)) / kolom, (TINGGI - 12 - JEDA * (baris - 1)) / baris);
  const x0 = (LEBAR - (kolom * sel + (kolom - 1) * JEDA)) / 2;
  const y0 = (TINGGI - (baris * sel + (baris - 1) * JEDA)) / 2;
  return (
    <Svg width={LEBAR} height={TINGGI} accessibilityLabel={label}>
      <Rect x={0} y={0} width={LEBAR} height={TINGGI} rx={12} fill={KAYU.latarKartu} />
      {denah.map((barisD, b) =>
        barisD.map((isi, k) => {
          const x = x0 + k * (sel + JEDA);
          const y = y0 + b * (sel + JEDA);
          const ditandai = tandai.some(([tb, tk]) => tb === b && tk === k);
          return (
            <Rect
              key={`${b}-${k}`}
              x={x}
              y={y}
              width={sel}
              height={sel}
              rx={3}
              fill={isi ? KAYU.terang : 'rgba(255,255,255,0.7)'}
              stroke={ditandai ? KAYU.putus : isi ? KAYU.garis : KAYU.ubinGaris}
              strokeWidth={2}
              strokeDasharray={ditandai ? '4 3' : undefined}
            />
          );
        }),
      )}
    </Svg>
  );
}

function Label({ children }: { children: string }) {
  return <Text style={{ fontFamily: huruf.anakTebal, fontSize: 13, color: KAYU.garis, textAlign: 'center' }}>{children}</Text>;
}

export function KartuTarget({
  target,
  baris,
  tinggiMaks,
  belumCocok,
}: {
  target: Target;
  baris: number;
  tinggiMaks: number;
  belumCocok: BelumCocok;
}) {
  const depan = (
    <KartuBatang tinggi={target.depan} tinggiMaks={tinggiMaks} tandai={belumCocok.kolomDepan} label={`Kartu tampak depan: ${target.depan.join(', ')} kubus`} />
  );
  const banyak = Boolean(target.samping || target.atas);
  if (!banyak) {
    return (
      <View style={[gayaPanel, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
        {depan}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: huruf.anakTebal, fontSize: 14, color: KAYU.garis }}>Kartu tampak depan</Text>
          <Text style={{ fontFamily: huruf.anak, fontSize: 18, lineHeight: 24, color: warna.teks }}>Susun kubus supaya sama seperti kartu.</Text>
        </View>
      </View>
    );
  }
  // Indeks tampak samping: kiri = baris paling depan.
  const tandaiSamping = belumCocok.barisSamping.map((b) => baris - 1 - b);
  return (
    <View style={[gayaPanel, { gap: 6 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center', gap: 2 }}>
          {depan}
          <Label>Depan</Label>
        </View>
        {target.samping ? (
          <View style={{ alignItems: 'center', gap: 2 }}>
            <KartuBatang
              tinggi={target.samping}
              tinggiMaks={tinggiMaks}
              tandai={tandaiSamping}
              label={`Kartu tampak samping kanan: ${target.samping.join(', ')} kubus`}
            />
            <Label>Samping kanan</Label>
          </View>
        ) : null}
        {target.atas ? (
          <View style={{ alignItems: 'center', gap: 2 }}>
            <KartuAtas denah={target.atas} tandai={belumCocok.petakAtas} label="Kartu tampak atas" />
            <Label>Atas</Label>
          </View>
        ) : null}
      </View>
      <Text style={{ fontFamily: huruf.anak, fontSize: 16, lineHeight: 21, color: warna.teks, textAlign: 'center' }}>
        Susun kubus supaya sama seperti semua kartu.
      </Text>
    </View>
  );
}

const gayaPanel = {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: warna.putih,
  ...bayangan.ringan,
} as const;
