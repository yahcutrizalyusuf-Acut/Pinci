import 'package:flutter/material.dart';

import '../theme/pm_theme.dart';

enum PinciMood { senang, semangat, berpikir, empati, merayakan, menguap, minum, kecil }

/// Pinci, Si Kancil Pintar — digambar dengan kode (flat 2D), mengikuti Tahap 1.
/// [full] = dengan badan, ransel oranye, dan syal hijau.
class Pinci extends StatelessWidget {
  final double size;
  final PinciMood mood;
  final bool full;
  final bool waving;

  const Pinci({
    this.size = 96,
    this.mood = PinciMood.senang,
    this.full = false,
    this.waving = false,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Pinci',
      image: true,
      child: CustomPaint(
        size: full ? Size(size * 0.8, size) : Size.square(size),
        painter: _PinciPainter(mood, full, waving),
      ),
    );
  }
}

class _PinciPainter extends CustomPainter {
  final PinciMood mood;
  final bool full;
  final bool waving;
  _PinciPainter(this.mood, this.full, this.waving);

  Paint _fill(Color c) => Paint()..color = c;
  Paint _stroke(Color c, double w) => Paint()
    ..color = c
    ..style = PaintingStyle.stroke
    ..strokeWidth = w
    ..strokeCap = StrokeCap.round
    ..strokeJoin = StrokeJoin.round;

  @override
  void paint(Canvas canvas, Size size) {
    if (full) {
      // Koordinat 160 × 200 (sama dengan SVG di desain).
      final s = size.height / 200;
      canvas.save();
      canvas.scale(s, s);
      _body(canvas);
      canvas.translate(20, 12);
      _head(canvas);
      canvas.restore();
    } else {
      final s = size.width / 120;
      canvas.save();
      canvas.scale(s, s);
      _head(canvas);
      canvas.restore();
    }
  }

  void _body(Canvas c) {
    final line = _stroke(PM.kancilGaris, 3);
    c.drawOval(Rect.fromCenter(center: const Offset(80, 150), width: 92, height: 76),
        _fill(PM.kancil));
    c.drawOval(Rect.fromCenter(center: const Offset(80, 150), width: 92, height: 76), line);
    c.drawOval(Rect.fromCenter(center: const Offset(80, 160), width: 52, height: 44),
        _fill(PM.krem));
    // ransel oranye
    final bag = RRect.fromRectAndRadius(const Rect.fromLTWH(112, 124, 24, 32),
        const Radius.circular(8));
    c.drawRRect(bag, _fill(PM.oranye));
    c.drawRRect(bag, _stroke(const Color(0xFFD97F10), 2));
    // tangan
    if (waving) {
      final arm = Path()
        ..moveTo(42, 140)
        ..quadraticBezierTo(20, 118, 22, 92);
      c.drawPath(arm, _stroke(PM.kancil, 12));
      c.drawCircle(const Offset(22, 88), 9, _fill(PM.kancil));
      c.drawCircle(const Offset(22, 88), 9, line);
    }
    final leg = Path()
      ..moveTo(118, 150)
      ..quadraticBezierTo(132, 160, 124, 176);
    c.drawPath(leg, line);
    // syal hijau
    final scarf = Path()
      ..moveTo(58, 120)
      ..quadraticBezierTo(80, 136, 102, 120);
    c.drawPath(scarf, _stroke(PM.hijauDaun, 10));
  }

  void _head(Canvas c) {
    final line = _stroke(PM.kancilGaris, mood == PinciMood.kecil ? 4 : 3);
    final earUp = mood == PinciMood.semangat || mood == PinciMood.merayakan ? -4.0 : 0.0;

    // telinga
    for (final x in [30.0, 90.0]) {
      final r = Rect.fromCenter(center: Offset(x, 28 + earUp), width: 32, height: 44);
      c.drawOval(r, _fill(PM.kancil));
      c.drawOval(r, line);
      if (mood != PinciMood.kecil) {
        c.drawOval(Rect.fromCenter(center: Offset(x, 30 + earUp), width: 16, height: 24),
            _fill(PM.krem));
      }
    }
    // kepala
    c.drawCircle(const Offset(60, 68), 46, _fill(PM.kancil));
    c.drawCircle(const Offset(60, 68), 46, line);
    if (mood != PinciMood.kecil) {
      c.drawCircle(const Offset(44, 46), 4, _fill(Colors.white.withValues(alpha: 0.6)));
      c.drawCircle(const Offset(78, 42), 3, _fill(Colors.white.withValues(alpha: 0.6)));
      c.drawOval(Rect.fromCenter(center: const Offset(60, 86), width: 60, height: 44),
          _fill(PM.krem));
    }

    final eyeLine = _stroke(PM.kancilGaris, 2);
    final ink = _fill(PM.tinta);
    final mouth = _stroke(PM.kancilGaris, 3);

    switch (mood) {
      case PinciMood.kecil:
        c.drawCircle(const Offset(46, 64), 9, _fill(Colors.white));
        c.drawCircle(const Offset(74, 64), 9, _fill(Colors.white));
        c.drawCircle(const Offset(48, 66), 4.5, ink);
        c.drawCircle(const Offset(76, 66), 4.5, ink);
        return;
      case PinciMood.menguap:
        c.drawPath(_arc(38, 62, 54), mouth);
        c.drawPath(_arc(66, 62, 82), mouth);
        c.drawOval(Rect.fromCenter(center: const Offset(60, 92), width: 18, height: 22),
            _fill(PM.kancilGaris));
        return;
      case PinciMood.minum:
      case PinciMood.empati:
        c.drawPath(
            Path()
              ..moveTo(40, 58)
              ..quadraticBezierTo(46, 52, 52, 58),
            mouth);
        c.drawPath(
            Path()
              ..moveTo(68, 58)
              ..quadraticBezierTo(74, 52, 80, 58),
            mouth);
        c.drawPath(_arc(40, 66, 52), mouth);
        c.drawPath(_arc(68, 66, 80), mouth);
        break;
      case PinciMood.merayakan:
        c.drawLine(const Offset(40, 54), const Offset(48, 48), mouth);
        c.drawLine(const Offset(80, 54), const Offset(72, 48), mouth);
        c.drawPath(
            Path()
              ..moveTo(40, 62)
              ..quadraticBezierTo(46, 52, 52, 62),
            mouth);
        c.drawPath(
            Path()
              ..moveTo(68, 62)
              ..quadraticBezierTo(74, 52, 80, 62),
            mouth);
        break;
      case PinciMood.semangat:
        c.drawLine(const Offset(38, 52), const Offset(48, 58), mouth);
        c.drawLine(const Offset(82, 52), const Offset(72, 58), mouth);
        _eyes(c, eyeLine, ink, r: 12, pupil: 6, dx: 2, dy: 0);
        break;
      case PinciMood.berpikir:
        c.drawPath(
            Path()
              ..moveTo(68, 50)
              ..quadraticBezierTo(78, 46, 86, 52),
            mouth);
        _eyes(c, eyeLine, ink, r: 10, pupil: 5, dx: 4, dy: 2);
        break;
      case PinciMood.senang:
        _eyes(c, eyeLine, ink, r: 11, pupil: 5, dx: 2, dy: 2);
        break;
    }

    // hidung
    c.drawOval(Rect.fromCenter(center: const Offset(60, 82), width: 10, height: 8),
        _fill(PM.kancilGaris));

    // mulut
    switch (mood) {
      case PinciMood.semangat:
      case PinciMood.merayakan:
        final p = Path()
          ..moveTo(44, 88)
          ..quadraticBezierTo(60, 110, 76, 88)
          ..quadraticBezierTo(60, 96, 44, 88)
          ..close();
        c.drawPath(p, _fill(PM.kancilGaris));
        break;
      case PinciMood.berpikir:
        c.drawCircle(const Offset(61, 94), 3, _fill(PM.kancilGaris));
        break;
      case PinciMood.minum:
        // gelas air
        final cup = Path()
          ..moveTo(78, 88)
          ..lineTo(104, 82)
          ..lineTo(108, 112)
          ..lineTo(84, 116)
          ..close();
        c.drawPath(cup, _fill(const Color(0xFFBFE3F7)));
        c.drawPath(cup, _stroke(PM.langit, 3));
        break;
      default:
        c.drawPath(
            Path()
              ..moveTo(48, 92)
              ..quadraticBezierTo(60, 102, 72, 92),
            mouth);
    }

    if (mood == PinciMood.merayakan) {
      final star = _fill(PM.oranye);
      c.drawPath(
          Path()
            ..moveTo(14, 20)
            ..lineTo(18, 30)
            ..lineTo(8, 28)
            ..close(),
          star);
      c.drawPath(
          Path()
            ..moveTo(106, 18)
            ..lineTo(102, 28)
            ..lineTo(112, 26)
            ..close(),
          _fill(PM.hijauDaun));
    }
  }

  Path _arc(double x1, double y, double x2) => Path()
    ..moveTo(x1, y)
    ..quadraticBezierTo((x1 + x2) / 2, y + 6, x2, y);

  void _eyes(Canvas c, Paint line, Paint ink,
      {required double r, required double pupil, required double dx, required double dy}) {
    for (final x in [46.0, 74.0]) {
      c.drawCircle(Offset(x, 64), r, Paint()..color = Colors.white);
      c.drawCircle(Offset(x, 64), r, line);
      c.drawCircle(Offset(x + dx, 64 + dy), pupil, ink);
    }
  }

  @override
  bool shouldRepaint(covariant _PinciPainter old) =>
      old.mood != mood || old.full != full || old.waving != waving;
}
