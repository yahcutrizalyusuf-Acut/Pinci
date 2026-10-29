/** Daftar game: rute → komponen tampilan dan nama logika. */
import type { ComponentType } from 'react';

import type { NamaGame } from './bersama/ringkasan';
import type { PropsLayarGame } from './bersama/tampilan/kontrak';
import LayarPasar from './pasar/LayarGame';
import LayarSusunKubus from './susun-kubus/LayarGame';
import LayarTebakKata from './tebak-kata/LayarGame';
import LayarUlarTangga from './ular-tangga/LayarGame';

export const GAME: Record<string, { nama: NamaGame; Layar: ComponentType<PropsLayarGame> }> = {
  pasar: { nama: 'pasar', Layar: LayarPasar },
  'ular-tangga': { nama: 'ular_tangga', Layar: LayarUlarTangga },
  'susun-kubus': { nama: 'susun_kubus', Layar: LayarSusunKubus },
  'tebak-kata': { nama: 'tebak_kata', Layar: LayarTebakKata },
};
