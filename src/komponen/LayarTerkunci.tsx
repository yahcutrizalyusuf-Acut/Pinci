/** Layar anak untuk bagian di luar paket kelasnya. Netral, tanpa ajakan membeli. */
import { Layar } from './Layar';
import { GelembungPinci, KepalaLayar } from './dasar';
import { TEKS_TERKUNCI } from '../fitur/akses';

export function LayarTerkunci({ judul }: { judul: string }) {
  return (
    <Layar>
      <KepalaLayar judul={judul} />
      <GelembungPinci judul={judul} teks={`${TEKS_TERKUNCI} Sambil menunggu, ada Lancar Matematika, Baca Ulang, dan game.`} />
    </Layar>
  );
}
