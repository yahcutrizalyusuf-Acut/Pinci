import type { Pemakaian, PengaturanWaktu } from '../../data/jenis';
import {
  BLOK_DETIK,
  diJamTenang,
  intiSelesai,
  sisaInti,
  statusBelajar,
  statusMain,
  tambahBelajar,
  tambahMain,
} from '../penjaga-waktu';

const atur = (ubah: Partial<PengaturanWaktu> = {}): PengaturanWaktu => ({
  id: 'a',
  anak_id: 'a',
  belajarMenit: 60,
  gameMenit: 30,
  gameSetelahInti: true,
  jamTenang: '21:00',
  jamBangun: '06:00',
  bunyi: true,
  ...ubah,
});
const pakai = (ubah: Partial<Pemakaian> = {}): Pemakaian => ({
  id: 'a:2026-11-02',
  anak_id: 'a',
  tanggal: '2026-11-02',
  belajarDetik: 0,
  mainDetik: 0,
  blokDetik: 0,
  intiSelesai: false,
  ...ubah,
});
const jam = (h: number, m = 0) => new Date(2026, 10, 2, h, m);

describe('jam tenang', () => {
  test('21.00–06.00 tenang', () => {
    expect(diJamTenang(atur(), jam(21))).toBe(true);
    expect(diJamTenang(atur(), jam(23, 30))).toBe(true);
    expect(diJamTenang(atur(), jam(5, 59))).toBe(true);
    expect(diJamTenang(atur(), jam(6))).toBe(false);
    expect(diJamTenang(atur(), jam(20, 59))).toBe(false);
  });
  test('belajar dan main berhenti di jam tenang', () => {
    expect(statusBelajar(pakai(), atur(), jam(22)).jenis).toBe('jam_tenang');
    expect(statusMain(pakai({ intiSelesai: true }), atur(), jam(22)).jenis).toBe('jam_tenang');
  });
});

describe('belajar', () => {
  test('blok 15 menit → istirahat 2 menit', () => {
    const t = jam(16);
    let p = tambahBelajar(pakai(), BLOK_DETIK - 1, t);
    expect(statusBelajar(p, atur(), t).jenis).toBe('boleh');
    p = tambahBelajar(p, 1, t);
    const s = statusBelajar(p, atur(), t);
    expect(s.jenis).toBe('istirahat');
    expect(statusBelajar(p, atur(), new Date(t.getTime() + 121_000)).jenis).toBe('boleh');
  });
  test('batas harian 10 menit × kelas', () => {
    const p = pakai({ belajarDetik: 60 * 60 });
    expect(statusBelajar(p, atur(), jam(16)).jenis).toBe('cukup');
    expect(statusBelajar(pakai({ belajarDetik: 59 * 60 }), atur(), jam(16)).jenis).toBe('boleh');
  });
});

describe('main', () => {
  test('bawaan: tunggu inti harian', () => {
    expect(statusMain(pakai(), atur(), jam(16)).jenis).toBe('tunggu_inti');
    expect(statusMain(pakai({ intiSelesai: true }), atur(), jam(16))).toEqual({ jenis: 'boleh', sisaDetik: 1800 });
  });
  test('selalu terbuka', () => {
    expect(statusMain(pakai(), atur({ gameSetelahInti: false }), jam(16)).jenis).toBe('boleh');
  });
  test('habis dan mati', () => {
    expect(statusMain(tambahMain(pakai({ intiSelesai: true }), 1800), atur(), jam(16)).jenis).toBe('habis');
    expect(statusMain(pakai({ intiSelesai: true }), atur({ gameMenit: 0 }), jam(16)).jenis).toBe('mati');
  });
  test('batas mutlak 60 menit', () => {
    const s = statusMain(pakai({ intiSelesai: true }), atur({ gameMenit: 90 }), jam(16));
    expect(s).toEqual({ jenis: 'boleh', sisaDetik: 3600 });
  });
});

describe('inti harian', () => {
  test('kelas 4: cukup 1 lembar Lancar', () => {
    expect(intiSelesai({ kelas: 4, lancarHariIni: 0, bacaHariIni: 0, tkaHariIni: 0, tkaTerbuka: true })).toBe(false);
    expect(intiSelesai({ kelas: 4, lancarHariIni: 1, bacaHariIni: 0, tkaHariIni: 0, tkaTerbuka: true })).toBe(true);
  });
  test('kelas 6: Lancar + Baca Ulang + TKA bila terbuka', () => {
    const dasar = { kelas: 6, lancarHariIni: 1, bacaHariIni: 1, tkaHariIni: 0 };
    expect(intiSelesai({ ...dasar, tkaTerbuka: true })).toBe(false);
    expect(intiSelesai({ ...dasar, tkaTerbuka: false })).toBe(true);
    expect(sisaInti({ ...dasar, tkaTerbuka: true })).toEqual(['Siap TKA']);
  });
});
