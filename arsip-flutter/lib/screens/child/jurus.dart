import 'package:flutter/material.dart';

import '../../data/curriculum.dart';
import '../../data/models.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';
import 'sheet.dart';

/// Layar 4 — Jurus Pinci sebelum lembar latihan.
class JurusScreen extends StatelessWidget {
  final Child child;
  const JurusScreen({required this.child});

  @override
  Widget build(BuildContext context) {
    final level = Curriculum.level(child.level);
    final sz = GradeSizes(child.grade);

    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            children: [
              Row(
                children: [
                  const RoundBack(),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text('Lancar Matematika · Level ${level.no}',
                        style: PMFont.andika(16, weight: FontWeight.w700, color: PM.mathTeks)),
                  ),
                ],
              ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.only(top: 16, bottom: 16),
                  children: [
              const Center(child: Pinci(size: 112, mood: PinciMood.semangat)),
              const SizedBox(height: 12),
              PmCard(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                child: Row(
                  children: [
                    Expanded(
                      child: Text.rich(
                        TextSpan(children: [
                          TextSpan(text: 'Pinci punya jurus: ', style: PMFont.andika(20)),
                          TextSpan(
                              text: level.jurus,
                              style: PMFont.andika(20,
                                  weight: FontWeight.w700, color: PM.hijauTua)),
                        ]),
                      ),
                    ),
                    const SizedBox(width: 8),
                    SpeakerButton('Pinci punya jurus: ${level.jurus} ${level.note}'),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              PmCard(
                radius: 24,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var i = 0; i < level.steps.length; i++) ...[
                      Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            alignment: Alignment.center,
                            decoration:
                                const BoxDecoration(color: PM.mathBg, shape: BoxShape.circle),
                            child: Text('${i + 1}',
                                style: PMFont.andika(18,
                                    weight: FontWeight.w700, color: PM.mathTeks)),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(level.steps[i].text,
                                style: PMFont.andika(sz.soal - 8)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                    ],
                    Padding(
                      padding: const EdgeInsets.only(left: 50),
                      child: Text(level.note,
                          style: PMFont.andika(16, color: PM.teksPudar)),
                    ),
                  ],
                ),
              ),
                  ],
                ),
              ),
              PmButton(
                'Aku siap!',
                height: sz.tombolUtama,
                onPressed: () => Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => SheetScreen(child: child))),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
