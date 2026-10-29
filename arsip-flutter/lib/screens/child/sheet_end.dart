import 'package:flutter/material.dart';

import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';
import 'rest.dart';

/// Layar 6 — Akhir lembar.
class SheetEndScreen extends StatefulWidget {
  final Child child;
  final SheetResult result;
  final int? previousBest;
  const SheetEndScreen({required this.child, required this.result, this.previousBest});

  @override
  State<SheetEndScreen> createState() => _SheetEndScreenState();
}

class _SheetEndScreenState extends State<SheetEndScreen> {
  String? _mood;

  static const moods = [
    ('burung', '🐦', 'Burung terbang'),
    ('rusa', '🦌', 'Rusa lincah'),
    ('penyu', '🐢', 'Penyu pelan'),
    ('gajah', '🐘', 'Gajah ngantuk'),
  ];

  @override
  Widget build(BuildContext context) {
    final r = widget.result;
    final best = widget.previousBest;
    final isRecord = best != null && r.seconds < best;
    final sz = GradeSizes(widget.child.grade);

    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  children: [
                    Row(
                      children: [
                        const Pinci(size: 104, mood: PinciMood.merayakan),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Selesai!',
                                  style: PMFont.baloo(36, color: PM.hijauTua)),
                              Text('Lancar Matematika · Level ${r.level}',
                                  style: PMFont.andika(16, color: PM.teksPudar)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    PmCard(
                      radius: 24,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text.rich(TextSpan(children: [
                            TextSpan(
                                text: '${r.correct}',
                                style: PMFont.andika(40, weight: FontWeight.w700)),
                            TextSpan(
                                text: ' dari ${r.total} benar',
                                style: PMFont.andika(20)),
                          ])),
                          const SizedBox(height: 6),
                          Row(children: [
                            const Icon(Icons.timer_outlined, size: 20, color: PM.tinta),
                            const SizedBox(width: 8),
                            Text(fmtDuration(r.seconds), style: PMFont.andika(18)),
                          ]),
                          if (isRecord) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                  color: PM.dampingiBg,
                                  borderRadius: BorderRadius.circular(999)),
                              child: Text('Rekor baru! (tadi ${fmtClock(best!)})',
                                  style: PMFont.andika(16, weight: FontWeight.w700)),
                            ),
                          ],
                          const SizedBox(height: 10),
                          Text('Tersimpan ✓   Terkirim ✓✓',
                              style: PMFont.andika(14,
                                  weight: FontWeight.w700, color: PM.hijauTua)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text('Latihan tadi rasanya seperti hewan apa?',
                        style: PMFont.andika(sz.petunjuk, weight: FontWeight.w700)),
                    const SizedBox(height: 10),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 1.8,
                      children: [
                        for (final m in moods)
                          Semantics(
                            button: true,
                            selected: _mood == m.$1,
                            label: m.$3,
                            excludeSemantics: true,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(16),
                              onTap: () {
                                setState(() => _mood = m.$1);
                                StoreScope.read(context).setMood(r, m.$1);
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 180),
                                decoration: BoxDecoration(
                                  color: _mood == m.$1 ? PM.gudangBg : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                      color: _mood == m.$1
                                          ? PM.hijauDaun
                                          : const Color(0xFFEDE3CF),
                                      width: _mood == m.$1 ? 3 : 1),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(m.$2, style: const TextStyle(fontSize: 32)),
                                    Text(m.$3, style: PMFont.andika(15)),
                                  ],
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              PmButton(
                'Kembali ke beranda',
                height: sz.tombolUtama,
                onPressed: () {
                  final store = StoreScope.read(context);
                  final limit = store.reachedDailyLimit(widget.child.id);
                  final sheetsToday = store.todayResults(widget.child.id).length;
                  if (limit) {
                    Navigator.of(context).pushReplacement(MaterialPageRoute(
                        builder: (_) => const RestScreen(done: true)));
                  } else if (sheetsToday % 2 == 0) {
                    Navigator.of(context).pushReplacement(MaterialPageRoute(
                        builder: (_) => const RestScreen(done: false)));
                  } else {
                    Navigator.of(context).pop();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
