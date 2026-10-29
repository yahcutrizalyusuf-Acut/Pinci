import 'package:flutter/material.dart';

import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';

/// Layar 7 — Istirahat (done = false) atau Cukup belajar hari ini (done = true).
class RestScreen extends StatelessWidget {
  final bool done;
  const RestScreen({required this.done});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 48, 16, 24),
          child: Column(
            children: [
              Container(
                width: 260,
                height: 260,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: done ? const Color(0xFFFFE9C7) : PM.langitBg,
                  shape: BoxShape.circle,
                ),
                child: done
                    ? const Pinci(size: 220, full: true, waving: true)
                    : const Pinci(size: 200, mood: PinciMood.minum),
              ),
              const SizedBox(height: 24),
              Text(
                done ? 'Cukup belajar hari ini.' : 'Istirahat 2 menit,\nminum dulu.',
                textAlign: TextAlign.center,
                style: PMFont.baloo(28),
              ),
              const SizedBox(height: 8),
              Text(
                done
                    ? 'Kamu hebat sudah mencoba.\nBesok kita lanjut lagi, ya!'
                    : 'Regangkan tangan dan kakimu juga, ya.',
                textAlign: TextAlign.center,
                style: PMFont.andika(18, color: PM.teksPudar),
              ),
              const Spacer(),
              PmButton(
                done ? 'Kembali ke beranda' : 'Aku sudah siap lagi',
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
