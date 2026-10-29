import 'package:flutter/material.dart';

import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';
import '../parent/parent_gate.dart';
import 'child_shell.dart';

/// Layar 1 — Selamat datang.
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              flex: 5,
              child: Stack(
                children: [
                  Positioned.fill(child: CustomPaint(painter: _ForestPainter())),
                  const Align(
                    alignment: Alignment(0, 0.6),
                    child: Pinci(size: 220, full: true, waving: true),
                  ),
                ],
              ),
            ),
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                child: Column(
                  children: [
                    const PmLogo(size: 36),
                    const SizedBox(height: 4),
                    Text('Halo! Aku Pinci. Pintar itu seru!',
                        style: PMFont.andika(18, color: PM.teksPudar)),
                    const Spacer(),
                    PmButton(
                      'Ini HP anak',
                      icon: Icons.smartphone_rounded,
                      height: 72,
                      onPressed: () => Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const ProfilePickerScreen())),
                    ),
                    const SizedBox(height: 12),
                    PmButton(
                      'Saya orang tua',
                      icon: Icons.person_outline_rounded,
                      outline: true,
                      onPressed: () => openParentMode(context),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Layar 2 — Pilih profil.
class ProfilePickerScreen extends StatelessWidget {
  const ProfilePickerScreen();

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
          children: [
            Row(
              children: [
                const Pinci(size: 64),
                const SizedBox(width: 12),
                Expanded(
                  child: Text('Siapa yang mau belajar?', style: PMFont.baloo(26)),
                ),
              ],
            ),
            const SizedBox(height: 24),
            for (final c in store.children) ...[
              PmCard(
                radius: 24,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                onTap: () {
                  store.selectChild(c.id);
                  Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const ChildShell()), (_) => false);
                },
                child: Row(
                  children: [
                    ChildAvatar(c, size: 80),
                    const SizedBox(width: 20),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(c.name, style: PMFont.baloo(26, weight: FontWeight.w700)),
                        Text('Kelas ${c.grade}',
                            style: PMFont.andika(16, color: PM.teksPudar)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
            const SizedBox(height: 8),
            Center(
              child: Text('Ketuk gambarmu untuk mulai.',
                  style: PMFont.andika(16, color: PM.teksPudar)),
            ),
          ],
        ),
      ),
    );
  }
}

class PmLogo extends StatelessWidget {
  final double size;
  const PmLogo({this.size = 22});

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(children: [
        TextSpan(text: 'Pintar ', style: PMFont.baloo(size, color: PM.hijauTua)),
        TextSpan(text: 'Main', style: PMFont.baloo(size, color: PM.oranye)),
      ]),
      semanticsLabel: 'Pintar Main',
    );
  }
}

class _ForestPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size s) {
    final w = s.width, h = s.height;
    canvas.drawCircle(Offset(w * 0.8, h * 0.18), 34, Paint()..color = const Color(0xFFFFD27A));
    final hill1 = Path()
      ..moveTo(0, h * 0.75)
      ..quadraticBezierTo(w * 0.25, h * 0.58, w * 0.5, h * 0.7)
      ..quadraticBezierTo(w * 0.75, h * 0.8, w, h * 0.65)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(hill1, Paint()..color = const Color(0xFFCDEBD8));
    final hill2 = Path()
      ..moveTo(0, h * 0.85)
      ..quadraticBezierTo(w * 0.33, h * 0.72, w * 0.6, h * 0.82)
      ..quadraticBezierTo(w * 0.8, h * 0.88, w, h * 0.8)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(hill2, Paint()..color = const Color(0xFF9FD8B4));
    final trunk = Paint()..color = const Color(0xFF8A5A33);
    canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.09, h * 0.5, 12, h * 0.22),
            const Radius.circular(6)),
        trunk);
    canvas.drawCircle(Offset(w * 0.11, h * 0.48), 34, Paint()..color = PM.hijauDaun);
    canvas.drawCircle(Offset(w * 0.05, h * 0.53), 22, Paint()..color = PM.benar);
    canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.87, h * 0.54, 10, h * 0.19),
            const Radius.circular(5)),
        trunk);
    canvas.drawCircle(Offset(w * 0.88, h * 0.52), 28, Paint()..color = PM.hijauDaun);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
