import { render } from '@testing-library/react-native';

import { PAKET_KOMIK, PAKET_TOKOH, teksTokoh } from '../../../isi/inggris/paketKomik';
import { GambarPanel, tataTokoh } from '../GambarPanel';
import { SEMUA_LATAR } from '../LatarKomik';
import { POSE_KOMIK, TokohKomik } from '../TokohKomik';

const semuaPanel = Object.values(PAKET_KOMIK).flatMap((p) => p?.komik.flatMap((k) => k.panel) ?? []);

describe('gambar sementara komik', () => {
  it('setiap tokoh di tokoh.json bisa digambar dalam 6 pose dan 3 varian', async () => {
    for (const t of PAKET_TOKOH.tokoh.filter((x) => x.peran !== 'narator')) {
      for (const pose of POSE_KOMIK) {
        for (const varian of [undefined, 'super', 'kotor', 'sedih'] as const) {
          const r = await render(<TokohKomik tokoh={t.id} pose={pose} varian={varian} tinggi={100} />);
          await r.unmount();
        }
      }
    }
  });

  it('8 latar tersedia dan semua latar di naskah dikenal', () => {
    expect(SEMUA_LATAR).toHaveLength(8);
    for (const p of semuaPanel) expect(SEMUA_LATAR).toContain(p.latar);
  });

  it('semua panel masih ditandai gambar sementara dan tokoh tidak keluar panel', () => {
    for (const p of semuaPanel) {
      expect(p.gambar_sementara).toBe(true);
      for (const t of tataTokoh(p, 300)) {
        expect(t.kiri).toBeGreaterThanOrEqual(0);
        expect(t.kiri + t.tinggi * 0.75).toBeLessThanOrEqual(300.01);
        expect(t.atas).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('panel memakai label adegan untuk pembaca layar dan tidak menulis teks gelembung', async () => {
    const p = semuaPanel[0];
    const r = await render(<GambarPanel panel={p} lebar={300} />);
    expect(r.getByLabelText(teksTokoh(p.adegan))).toBeTruthy();
    for (const g of p.gelembung) expect(r.queryByText(g.teks)).toBeNull();
  });
});
