/** Daftar game: rute → komponen tampilan dan nama logika. */
import type { ComponentType } from 'react';

import type { NamaGame } from './bersama/ringkasan';
import type { PropsLayarGame } from './bersama/tampilan/kontrak';
import LayarKebun from './kebun/LayarGame';
import LayarLompatBatu from './lompat-batu/LayarGame';
import LayarPasangan from './pasangan/LayarGame';
import LayarPasar from './pasar/LayarGame';
import LayarPerahu from './perahu/LayarGame';
import LayarSusunKubus from './susun-kubus/LayarGame';
import LayarTebakKata from './tebak-kata/LayarGame';
import LayarUlarTangga from './ular-tangga/LayarGame';

export const GAME: Record<string, { nama: NamaGame; Layar: ComponentType<PropsLayarGame> }> = {
  pasar: { nama: 'pasar', Layar: LayarPasar },
  'ular-tangga': { nama: 'ular_tangga', Layar: LayarUlarTangga },
  'susun-kubus': { nama: 'susun_kubus', Layar: LayarSusunKubus },
  'tebak-kata': { nama: 'tebak_kata', Layar: LayarTebakKata },
  kebun: { nama: 'kebun', Layar: LayarKebun },
  'lompat-batu': { nama: 'lompat_batu', Layar: LayarLompatBatu },
  pasangan: { nama: 'pasangan', Layar: LayarPasangan },
  perahu: { nama: 'perahu', Layar: LayarPerahu },
};
