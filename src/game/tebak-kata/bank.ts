/**
 * Bank kata Tebak Kata (G06). Buatan sendiri, Bahasa Indonesia baku, bisa digambar dengan emoji.
 * Semua isi berstatus `belum_diperiksa` sampai diperiksa guru.
 *
 * - Kelas 1–2: kata dipenggal menjadi suku kata (penggalan mengikuti KBBI; "ng" satu bunyi).
 *   Santai = 2 suku kata, Seru = 3 suku kata.
 * - Kelas 3–4: kata berimbuhan dipotong menjadi imbuhan + bentuk dasar yang tertulis
 *   (mis. "me-nulis", "mem-baca"). Santai = awalan ber-/me-, Seru = pe-, -an, ke-…-an, per-…-an.
 * - Kelas 5–6: kata baku dengan dua bentuk tidak baku sebagai pengecoh.
 */
import type { Tingkat } from '../bersama/jenis';

export type StatusIsi = 'belum_diperiksa' | 'sudah_diperiksa';

export interface KataPotong {
  id: string;
  /** Potongan berurutan, mis. ["ba", "ju"]. Digabung = kata utuh. */
  potongan: readonly string[];
  emoji: string;
  tingkat: Tingkat;
  status: StatusIsi;
}

export interface KataBaku {
  id: string;
  baku: string;
  /** Dua bentuk tidak baku yang masuk akal. Santai memakai yang pertama saja. */
  tidakBaku: readonly [string, string];
  emoji: string;
  status: StatusIsi;
}

/** Kata Bahasa Inggris dari luar (mis. dari paket Belajar Bahasa Inggris). */
export interface KataInggris {
  inggris: string;
  indonesia: string;
  emoji: string;
}

const B = 'belum_diperiksa' as const;

function potong(daftar: readonly (readonly [string, string])[], tingkat: Tingkat, awalan: string): KataPotong[] {
  return daftar.map(([tulisan, emoji]) => {
    const potongan = tulisan.split('-');
    return { id: `${awalan}-${potongan.join('')}`, potongan, emoji, tingkat, status: B };
  });
}

/** Kelas 1–2, 2 suku kata. */
const SUKU_DUA: readonly (readonly [string, string])[] = [
  ['bu-ku', '📖'], ['ba-ju', '👕'], ['sa-pi', '🐄'], ['ku-da', '🐎'], ['bo-la', '⚽'],
  ['ro-ti', '🍞'], ['ma-ta', '👁️'], ['ka-ki', '🦶'], ['gi-gi', '🦷'], ['to-pi', '🧢'],
  ['ku-cing', '🐈'], ['i-kan', '🐟'], ['pi-sang', '🍌'], ['ja-gung', '🌽'], ['bu-lan', '🌙'],
  ['bin-tang', '⭐'], ['ru-mah', '🏠'], ['pa-yung', '☂️'], ['ka-pal', '🚢'], ['ma-du', '🍯'],
  ['se-mut', '🐜'], ['a-pel', '🍎'], ['ja-ket', '🧥'], ['gu-nung', '⛰️'], ['da-un', '🍃'],
  ['a-pi', '🔥'], ['lam-pu', '💡'], ['bu-rung', '🐦'], ['ke-ju', '🧀'], ['su-su', '🥛'],
  ['a-yam', '🐔'], ['be-bek', '🦆'], ['ka-tak', '🐸'], ['si-put', '🐌'], ['ru-sa', '🦌'],
  ['ga-jah', '🐘'], ['to-mat', '🍅'], ['je-ruk', '🍊'], ['wor-tel', '🥕'], ['ja-mur', '🍄'],
  ['un-ta', '🐫'], ['bu-nga', '🌸'], ['hi-dung', '👃'], ['gi-tar', '🎸'],
];

/** Kelas 1–2, 3 suku kata. */
const SUKU_TIGA: readonly (readonly [string, string])[] = [
  ['ke-lin-ci', '🐇'], ['ha-ri-mau', '🐅'], ['ke-pi-ting', '🦀'], ['se-pe-da', '🚲'], ['se-pa-tu', '👟'],
  ['ke-la-pa', '🥥'], ['pe-ra-hu', '⛵'], ['bo-ne-ka', '🧸'], ['se-mang-ka', '🍉'], ['pe-sa-wat', '✈️'],
  ['ke-re-ta', '🚆'], ['bu-a-ya', '🐊'], ['ka-me-ra', '📷'], ['te-le-pon', '☎️'], ['ke-ran-jang', '🧺'],
  ['ke-me-ja', '👔'], ['ce-la-na', '👖'], ['al-pu-kat', '🥑'], ['bro-ko-li', '🥦'], ['ka-ngu-ru', '🦘'],
  ['pe-ngu-in', '🐧'], ['ko-a-la', '🐨'], ['pe-la-ngi', '🌈'], ['te-li-nga', '👂'], ['pa-ra-sut', '🪂'],
  ['gu-ri-ta', '🐙'], ['go-ri-la', '🦍'],
];

/** Kelas 3–4 Santai: awalan ber- dan me- (dengan bentuk tertulisnya). */
const IMBUHAN_SANTAI: readonly (readonly [string, string])[] = [
  ['ber-main', '🤹'], ['ber-lari', '🏃'], ['ber-nyanyi', '🎤'], ['ber-sepeda', '🚴'], ['ber-jalan', '🚶'],
  ['ber-kuda', '🏇'], ['ber-kemah', '⛺'], ['ber-layar', '⛵'], ['ber-kebun', '🧑‍🌾'], ['ber-cermin', '🪞'],
  ['ber-payung', '☂️'], ['ber-sepatu', '👟'], ['me-nulis', '✍️'], ['me-masak', '🍳'], ['mem-baca', '📖'],
  ['me-nari', '💃'], ['me-nanam', '🌱'], ['me-nyapu', '🧹'], ['me-mancing', '🎣'], ['men-dengar', '👂'],
  ['men-jahit', '🧵'], ['meng-gambar', '🎨'], ['me-lompat', '🦘'], ['me-motret', '📷'], ['me-nyelam', '🤿'],
];

/** Kelas 3–4 Seru: pe-, -an, ke-…-an, per-…-an, pe-…-an. */
const IMBUHAN_SERU: readonly (readonly [string, string])[] = [
  ['pe-nyanyi', '🎤'], ['pe-lari', '🏃'], ['pe-nari', '💃'], ['pe-nulis', '✍️'], ['pem-baca', '📖'],
  ['pe-tani', '🧑‍🌾'], ['pe-main', '⚽'], ['pen-jual', '🏪'], ['pe-mancing', '🎣'], ['pe-lukis', '🎨'],
  ['pen-jahit', '🧵'], ['pe-nyelam', '🤿'], ['pe-renang', '🏊'], ['main-an', '🧸'], ['makan-an', '🍱'],
  ['minum-an', '🥤'], ['tulis-an', '📝'], ['ayun-an', '🛝'], ['timbang-an', '⚖️'], ['ke-hujan-an', '🌧️'],
  ['ke-panas-an', '🥵'], ['ke-dingin-an', '🥶'], ['per-main-an', '🎲'], ['pe-mandang-an', '🏞️'],
];

export const BANK_KELAS_12: readonly KataPotong[] = [
  ...potong(SUKU_DUA, 'santai', 'k12'),
  ...potong(SUKU_TIGA, 'seru', 'k12'),
];

export const BANK_KELAS_34: readonly KataPotong[] = [
  ...potong(IMBUHAN_SANTAI, 'santai', 'k34'),
  ...potong(IMBUHAN_SERU, 'seru', 'k34'),
];

const BAKU: readonly (readonly [string, string, string, string])[] = [
  ['apotek', 'apotik', 'apotiek', '💊'],
  ['jadwal', 'jadual', 'jadwel', '📅'],
  ['telepon', 'telpon', 'tilpon', '☎️'],
  ['kuitansi', 'kwitansi', 'kuwitansi', '🧾'],
  ['cabai', 'cabe', 'cabay', '🌶️'],
  ['sistem', 'sistim', 'sestem', '⚙️'],
  ['teknik', 'tehnik', 'tekhnik', '🔧'],
  ['ijazah', 'ijasah', 'izasah', '📜'],
  ['nasihat', 'nasehat', 'nasihad', '🗣️'],
  ['antre', 'antri', 'antere', '🧍'],
  ['risiko', 'resiko', 'resikho', '⚠️'],
  ['izin', 'ijin', 'idzin', '✋'],
  ['zaman', 'jaman', 'djaman', '⏳'],
  ['lembap', 'lembab', 'lembep', '💧'],
  ['praktik', 'praktek', 'prakti', '🔬'],
  ['objek', 'obyek', 'objec', '📦'],
  ['kualitas', 'kwalitas', 'kualitet', '⭐'],
  ['nomor', 'nomer', 'nombor', '🔢'],
  ['atlet', 'atlit', 'atled', '🏃'],
  ['aktivitas', 'aktifitas', 'aktipitas', '🤸'],
  ['sopir', 'supir', 'sopier', '🚗'],
  ['mi', 'mie', 'mii', '🍜'],
  ['standar', 'standard', 'standart', '📏'],
  ['sertifikat', 'sertipikat', 'sertifikad', '🏅'],
  ['detail', 'detil', 'ditail', '🔍'],
  ['ekstrem', 'ekstrim', 'ekstreem', '🔥'],
  ['kategori', 'katagori', 'ketegori', '🗂️'],
  ['terampil', 'trampil', 'terampel', '🛠️'],
  ['cokelat', 'coklat', 'coklad', '🍫'],
  ['telur', 'telor', 'tellur', '🥚'],
  ['seprai', 'sprei', 'seprei', '🛏️'],
  ['paspor', 'pasport', 'paspot', '🛂'],
  ['film', 'filem', 'flim', '🎬'],
  ['kemarin', 'kemaren', 'kemarine', '📆'],
  ['ambulans', 'ambulan', 'ambulanse', '🚑'],
  ['napas', 'nafas', 'nafes', '😮‍💨'],
  ['miliar', 'milyar', 'miliard', '💰'],
  ['teknologi', 'tehnologi', 'teknolohi', '💻'],
  ['frekuensi', 'frekwensi', 'frekensi', '📻'],
  ['video', 'vidio', 'fideo', '📹'],
  ['kaus', 'kaos', 'kauss', '👕'],
  ['provinsi', 'propinsi', 'profinsi', '🗺️'],
  ['analisis', 'analisa', 'analisi', '📊'],
  ['karier', 'karir', 'kariir', '💼'],
  ['persen', 'prosen', 'persent', '💯'],
  ['jenderal', 'jendral', 'jenderral', '🎖️'],
  ['kreatif', 'kreatip', 'kreativ', '🎨'],
  ['bus', 'bis', 'buss', '🚌'],
  ['wortel', 'bortel', 'wortil', '🥕'],
  ['mengubah', 'merubah', 'mengobah', '🔄'],
];

export const BANK_KELAS_56: readonly KataBaku[] = BAKU.map(([baku, tb1, tb2, emoji]) => ({
  id: `k56-${baku}`,
  baku,
  tidakBaku: [tb1, tb2] as const,
  emoji,
  status: B,
}));
