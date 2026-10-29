import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Warna Pintar Main, sesuai sistem desain Tahap 1.
class PM {
  static const hijauDaun = Color(0xFF3BB273);
  static const hijauTua = Color(0xFF1F7A4D);
  static const oranye = Color(0xFFFF9F1C);
  static const tinta = Color(0xFF2D3142);
  static const krem = Color(0xFFFFF6E5);
  static const abu = Color(0xFFF5F7FA);
  static const benar = Color(0xFF2E9E5B);
  static const koral = Color(0xFFFF6B6B);
  static const koralBg = Color(0xFFFFF0F0);
  static const langit = Color(0xFF4EA8DE);
  static const langitBg = Color(0xFFE8F4FC);
  static const kancil = Color(0xFFA0673A);
  static const kancilGaris = Color(0xFF6B4423);

  static const teksPudar = Color(0xFF5B6072);
  static const garisKrem = Color(0xFFF1E6CF);
  static const garisAbu = Color(0xFFE6E9F0);
  static const kapsul = Color(0xFFD9F0E2);
  static const nonaktif = Color(0xFFD9DDE6);
  static const nonaktifTeks = Color(0xFF6B7080);
  static const kuning = Color(0xFFF4C542);

  static const math = Color(0xFF3A86FF);
  static const mathBg = Color(0xFFE6F0FF);
  static const mathTeks = Color(0xFF2A5DB0);
  static const bi = Color(0xFFE85D5D);
  static const biBg = Color(0xFFFDECEC);
  static const biTeks = Color(0xFFB03C3C);
  static const en = Color(0xFF8E6CCF);
  static const enBg = Color(0xFFF1ECFA);
  static const enTeks = Color(0xFF6A4BA8);
  static const dampingiBg = Color(0xFFFFF0D9);
  static const gudangBg = Color(0xFFE4F4EB);
}

/// Huruf: Baloo 2 (judul), Andika (soal & bacaan), Nunito (orang tua).
class PMFont {
  static TextStyle baloo(double size,
          {FontWeight weight = FontWeight.w800, Color color = PM.tinta}) =>
      GoogleFonts.getFont('Baloo 2',
          fontSize: size, fontWeight: weight, color: color, height: 1.15);

  static TextStyle andika(double size,
          {FontWeight weight = FontWeight.w400, Color color = PM.tinta}) =>
      GoogleFonts.getFont('Andika',
          fontSize: size, fontWeight: weight, color: color, height: 1.35);

  static TextStyle nunito(double size,
          {FontWeight weight = FontWeight.w400, Color color = PM.tinta}) =>
      GoogleFonts.getFont('Nunito',
          fontSize: size, fontWeight: weight, color: color, height: 1.35);
}

/// Ukuran yang menyesuaikan kelas anak (tabel Huruf & Tombol di brief).
class GradeSizes {
  final int grade;
  const GradeSizes(this.grade);

  bool get kecil => grade <= 2;
  bool get tengah => grade == 3 || grade == 4;

  double get judul => kecil ? 28 : (tengah ? 26 : 24);
  double get soal => kecil ? 44 : (tengah ? 40 : 36);
  double get bacaan => kecil ? 26 : (tengah ? 22 : 20);
  double get petunjuk => kecil ? 20 : (tengah ? 18 : 16);
  double get tombolUtama => kecil ? 72 : 64;
  double get jarakTombol => kecil ? 12 : 8;
}

ThemeData buildTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: PM.hijauDaun,
      primary: PM.hijauTua,
      surface: Colors.white,
    ),
    scaffoldBackgroundColor: PM.krem,
  );
  return base.copyWith(
    textTheme: GoogleFonts.getTextTheme('Andika', base.textTheme)
        .apply(bodyColor: PM.tinta, displayColor: PM.tinta),
    splashFactory: NoSplash.splashFactory,
  );
}
