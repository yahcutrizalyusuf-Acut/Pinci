import { hitungKunci, periksaKunci } from '../periksa-kunci';

describe('periksaKunci', () => {
  it('menghitung ulang berbagai bentuk soal', () => {
    expect(hitungKunci('7 × 8', 'bilangan')).toBe('56');
    expect(hitungKunci('56 : 7', 'bilangan')).toBe('8');
    expect(hitungKunci('15 − 7', 'bilangan')).toBe('8');
    expect(hitungKunci('3 + 4 × 5', 'bilangan')).toBe('23');
    expect(hitungKunci('(2 + 3) × 4', 'bilangan')).toBe('20');
    expect(hitungKunci('42 : 6 + 5', 'bilangan')).toBe('12');
    expect(hitungKunci('13²', 'bilangan')).toBe('169');
    expect(hitungKunci('√144', 'bilangan')).toBe('12');
    expect(hitungKunci('3/4 dari 24', 'bilangan')).toBe('18');
    expect(hitungKunci('25% dari 80', 'bilangan')).toBe('20');
    expect(hitungKunci('KPK 4 dan 6', 'bilangan')).toBe('12');
    expect(hitungKunci('FPB 12 dan 18', 'bilangan')).toBe('6');
    expect(hitungKunci('3/4 = … %', 'bilangan')).toBe('75');
    expect(hitungKunci('0,4 = … %', 'bilangan')).toBe('40');
    expect(hitungKunci('25% = … (desimal)', 'desimal')).toBe('0,25');
    expect(hitungKunci('1/2 = … (desimal)', 'desimal')).toBe('0,5');
    expect(hitungKunci('0,75 = … (pecahan paling sederhana)', 'pecahan')).toBe('3/4');
    expect(hitungKunci('40% = … (pecahan paling sederhana)', 'pecahan')).toBe('2/5');
  });

  it('menolak kunci salah, kunci tidak baku, dan lambang ÷', () => {
    expect(periksaKunci({ teks: '7 × 8', kunci: '54', bentukJawaban: 'bilangan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '1/2 = … (desimal)', kunci: '0,50', bentukJawaban: 'desimal' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '0,5 = … (pecahan paling sederhana)', kunci: '2/4', bentukJawaban: 'pecahan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '56 ÷ 7', kunci: '8', bentukJawaban: 'bilangan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '7 : 2', kunci: '3', bentukJawaban: 'bilangan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '3 − 5', kunci: '0', bentukJawaban: 'bilangan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '√50', kunci: '7', bentukJawaban: 'bilangan' }).lulus).toBe(false);
    expect(periksaKunci({ teks: '7 × 8', kunci: '56', bentukJawaban: 'bilangan' })).toEqual({ lulus: true, kunciHitung: '56', alasan: null });
  });
});
