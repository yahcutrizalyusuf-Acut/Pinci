/** Impor ulang seluruh bahan TKA harus menghasilkan paket yang sama persis dengan assets/paket/tka-k6.json. */
import * as fs from 'fs';
import * as path from 'path';

import { utama } from '../impor-tka';

test('impor bahan → paket sama dengan yang tersimpan (kecuali tanggal)', () => {
  const baru = utama({ tulis: false });
  const lama = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/paket/tka-k6.json'), 'utf8'));
  expect({ ...baru, dibuat: '' }).toEqual({ ...lama, dibuat: '' });
}, 60_000);
