import 'dart:math';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../data/curriculum.dart';
import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pm_widgets.dart';
import '../child/child_shell.dart';
import '../child/welcome.dart';
import 'child_room.dart';
import 'dev_log.dart';
import 'time_settings.dart';

/// Mode orang tua: Kabar · Rapor · Bimbingan · Atur.
class ParentShell extends StatefulWidget {
  const ParentShell();
  @override
  State<ParentShell> createState() => _ParentShellState();
}

class _ParentShellState extends State<ParentShell> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final titles = ['Kabar', 'Rapor', 'Bimbingan', 'Atur'];
    final pages = [const KabarTab(), const RaporTab(), const BimbinganTab(), const AturTab()];
    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        automaticallyImplyLeading: false,
        title: Text(titles[_tab], style: PMFont.baloo(22, weight: FontWeight.w700)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: TextButton.icon(
              onPressed: () => backToChildMode(context),
              icon: const Icon(Icons.child_care_rounded, color: PM.hijauTua),
              label: Text('Mode anak',
                  style: PMFont.nunito(14, weight: FontWeight.w700, color: PM.hijauTua)),
            ),
          ),
        ],
      ),
      body: pages[_tab],
      floatingActionButton: _tab == 0
          ? FloatingActionButton.extended(
              backgroundColor: PM.hijauTua,
              foregroundColor: Colors.white,
              onPressed: () => _pickChildThenRoom(context),
              icon: const Icon(Icons.favorite_rounded),
              label: Text('Kirim semangat',
                  style: PMFont.nunito(15, weight: FontWeight.w700, color: Colors.white)),
            )
          : null,
      bottomNavigationBar: PmTabBar(
        child: false,
        index: _tab,
        onTap: (i) {
          setState(() => _tab = i);
          StoreScope.read(context).log('buka_tab_ortu', {'tab': titles[i]});
        },
        items: const [
          TabItem('Kabar', Icons.chat_bubble_outline_rounded, Icons.chat_bubble_rounded),
          TabItem('Rapor', Icons.bar_chart_outlined, Icons.bar_chart_rounded),
          TabItem('Bimbingan', Icons.shield_outlined, Icons.shield_rounded),
          TabItem('Atur', Icons.tune_outlined, Icons.tune_rounded),
        ],
      ),
    );
  }

  void _pickChildThenRoom(BuildContext context) {
    final store = StoreScope.read(context);
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text('Kirim semangat untuk siapa?',
                  style: PMFont.nunito(17, weight: FontWeight.w700)),
            ),
            for (final c in store.children)
              ListTile(
                leading: ChildAvatar(c, size: 40),
                title: Text(c.name, style: PMFont.nunito(16, weight: FontWeight.w700)),
                onTap: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => ChildRoomScreen(childId: c.id)));
                },
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

void backToChildMode(BuildContext context) {
  final store = StoreScope.read(context);
  store.markParentSeen();
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(
        builder: (_) =>
            store.currentChild == null ? const WelcomeScreen() : const ChildShell()),
    (_) => false,
  );
}

// ---------------------------------------------------------------------------
// Layar 9 — Kabar
// ---------------------------------------------------------------------------

class KabarTab extends StatefulWidget {
  const KabarTab();
  @override
  State<KabarTab> createState() => _KabarTabState();
}

class _KabarTabState extends State<KabarTab> {
  bool _questionDone = false;

  // Pertanyaan singkat bergilir untuk orang tua (bahan pengembangan).
  static const questions = [
    'Minggu ini, apakah anak tampak senang saat latihan?',
    'Apakah anak meminta latihan sendiri tanpa disuruh?',
    'Apakah soal latihan terasa terlalu mudah untuk anak?',
    'Apakah anak memakai tombol suara 🔊?',
  ];

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final weekNo = DateTime.now().difference(DateTime(2026, 1, 1)).inDays ~/ 7;
    final question = questions[weekNo % questions.length];

    return ListView(
      padding: const EdgeInsets.only(top: 8, bottom: 96),
      children: [
        Container(
          color: Colors.white,
          child: Column(
            children: [
              for (var i = 0; i < store.children.length; i++) ...[
                if (i > 0) const Divider(height: 1, indent: 82, color: Color(0xFFEEF0F4)),
                _KabarRow(child: store.children[i]),
              ],
            ],
          ),
        ),
        if (!_questionDone)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: PmCard(
              radius: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    const Icon(Icons.help_outline_rounded, color: PM.hijauTua, size: 20),
                    const SizedBox(width: 8),
                    Text('1 pertanyaan, 30 detik',
                        style: PMFont.nunito(15, weight: FontWeight.w700, color: PM.hijauTua)),
                  ]),
                  const SizedBox(height: 10),
                  Text(question, style: PMFont.nunito(16)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final a in ['Ya', 'Kadang', 'Tidak'])
                        PmButton(a,
                            height: 44,
                            expand: false,
                            textStyle: PMFont.nunito(15, weight: FontWeight.w800),
                            onPressed: () {
                              store.log('jawab_pertanyaan_ortu',
                                  {'pertanyaan': question, 'jawaban': a});
                              setState(() => _questionDone = true);
                              ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Terima kasih! Jawaban tersimpan.')));
                            }),
                      PmButton('Nanti',
                          height: 44,
                          expand: false,
                          outline: true,
                          color: PM.nonaktif,
                          textStyle: PMFont.nunito(15, weight: FontWeight.w700),
                          onPressed: () => setState(() => _questionDone = true)),
                    ],
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _KabarRow extends StatelessWidget {
  final Child child;
  const _KabarRow({required this.child});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final today = store.todayResults(child.id);
    final last = store.lastActivity(child.id);
    final unread = store.parentUnread(child.id);

    String preview;
    if (today.isEmpty) {
      preview = 'Belum latihan hari ini';
    } else {
      final r = today.last;
      final prevBest = store.bestSeconds(child.id, r.level, excludeId: r.id);
      final record = prevBest != null && r.seconds < prevBest;
      preview = '${today.length} lembar hari ini'
          '${record ? ' · rekor baru di Level ${r.level}' : ' · ${r.correct}/${r.total} benar'}';
    }

    return InkWell(
      onTap: () => Navigator.of(context)
          .push(MaterialPageRoute(builder: (_) => ChildRoomScreen(childId: child.id))),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            ChildAvatar(child, size: 52),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text('${child.name} · Kelas ${child.grade}',
                            style: PMFont.nunito(17, weight: FontWeight.w700)),
                      ),
                      if (last != null)
                        Text(fmtRelativeDay(last),
                            style: PMFont.nunito(13,
                                weight: unread > 0 ? FontWeight.w700 : FontWeight.w400,
                                color: unread > 0 ? PM.hijauTua : PM.teksPudar)),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Expanded(
                        child: Text(preview,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: PMFont.nunito(15, color: PM.teksPudar)),
                      ),
                      if (unread > 0)
                        Container(
                          constraints: const BoxConstraints(minWidth: 22),
                          height: 22,
                          padding: const EdgeInsets.symmetric(horizontal: 6),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                              color: PM.hijauDaun, borderRadius: BorderRadius.circular(999)),
                          child: Text('$unread',
                              style: PMFont.nunito(12, weight: FontWeight.w800)),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Layar 11 — Rapor mingguan
// ---------------------------------------------------------------------------

class RaporTab extends StatefulWidget {
  const RaporTab();
  @override
  State<RaporTab> createState() => _RaporTabState();
}

class _RaporTabState extends State<RaporTab> {
  String? _childId;

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    if (store.children.isEmpty) return const SizedBox();
    final child = store.children.firstWhere((c) => c.id == _childId,
        orElse: () => store.children.first);
    final w = store.weekStats(child.id);
    final speeds = store.speedLast8Weeks(child.id);
    final level = Curriculum.level(child.level);

    final progress = w.sheets == 0
        ? '${child.name} belum latihan minggu ini.'
        : (w.prevSecPerQ > 0 && w.secPerQ < w.prevSecPerQ
            ? '${child.name} makin cepat di ${level.topic}: ${fmtNum(w.secPerQ)} detik per soal.'
            : '${child.name} latihan ${w.sheets} lembar minggu ini, ${(w.accuracy * 100).round()}% benar.');
    final nextLevel = Curriculum.levels.any((l) => l.no == level.no + 1);
    final nextStep = w.accuracy >= 0.9 && w.sheets >= 3 && nextLevel
        ? 'Siap naik ke Level ${level.no + 1}: ${Curriculum.level(level.no + 1).title}.'
        : 'Lanjut latihan Level ${level.no} (${level.title}) sampai 90% benar.';

    final report = 'Rapor mingguan Pintar Main\n'
        '${child.name} · Kelas ${child.grade} · ${fmtShortDate(w.start)}–${fmtShortDate(w.end)}\n'
        '- ${w.days} hari latihan\n'
        '- ${fmtNum(w.secPerQ)} detik per soal\n'
        '- ${(w.accuracy * 100).round()}% benar\n'
        'Kemajuan: $progress\n'
        'Langkah berikutnya: $nextStep\n'
        'Cara membantu: ${level.parentTip}';

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: [
        Row(
          children: [
            Expanded(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    for (final c in store.children)
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text('${c.avatar.emoji} ${c.name}',
                              style: PMFont.nunito(14, weight: FontWeight.w700)),
                          selected: c.id == child.id,
                          selectedColor: PM.kapsul,
                          backgroundColor: Colors.white,
                          showCheckmark: false,
                          onSelected: (_) => setState(() => _childId = c.id),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            Text('${fmtShortDate(w.start)}–${fmtShortDate(w.end)}',
                style: PMFont.nunito(13, color: PM.teksPudar)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _Stat(value: '${w.days}', label: 'hari latihan'),
            const SizedBox(width: 8),
            _Stat(
              value: w.sheets == 0 ? '–' : fmtNum(w.secPerQ),
              unit: ' dtk',
              label: 'per soal',
              change: w.prevSecPerQ > 0 && w.sheets > 0
                  ? '${w.secPerQ <= w.prevSecPerQ ? '↓' : '↑'} dari ${fmtNum(w.prevSecPerQ)}'
                  : null,
              good: w.secPerQ <= w.prevSecPerQ,
            ),
            const SizedBox(width: 8),
            _Stat(
              value: w.sheets == 0 ? '–' : '${(w.accuracy * 100).round()}%',
              label: 'benar',
              change: w.prevAccuracy > 0 && w.sheets > 0
                  ? '${w.accuracy >= w.prevAccuracy ? '↑' : '↓'} dari ${(w.prevAccuracy * 100).round()}%'
                  : null,
              good: w.accuracy >= w.prevAccuracy,
            ),
          ],
        ),
        const SizedBox(height: 12),
        PmCard(
          radius: 16,
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Expanded(
                    child: Text('Kecepatan, 8 minggu',
                        style: PMFont.nunito(15, weight: FontWeight.w700))),
                Text('detik per soal', style: PMFont.nunito(12, color: PM.teksPudar)),
              ]),
              const SizedBox(height: 8),
              SizedBox(
                height: 120,
                width: double.infinity,
                child: CustomPaint(painter: _SpeedChart(speeds)),
              ),
              const SizedBox(height: 4),
              Text('Makin rendah, makin cepat.',
                  style: PMFont.nunito(12, color: PM.teksPudar)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        PmCard(
          radius: 16,
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _ReportLine('KEMAJUAN', progress),
              const SizedBox(height: 10),
              _ReportLine('LANGKAH BERIKUTNYA', nextStep),
              const SizedBox(height: 10),
              _ReportLine('CARA MEMBANTU', level.parentTip),
            ],
          ),
        ),
        const SizedBox(height: 12),
        PmButton(
          'Kirim ke WhatsApp',
          icon: Icons.share_rounded,
          height: 48,
          textStyle: PMFont.nunito(16, weight: FontWeight.w800),
          onPressed: () async {
            store.log('kirim_rapor_wa', {'child': child.id});
            final uri = Uri.parse('https://wa.me/?text=${Uri.encodeComponent(report)}');
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          },
        ),
      ],
    );
  }
}

class _Stat extends StatelessWidget {
  final String value;
  final String unit;
  final String label;
  final String? change;
  final bool good;
  const _Stat(
      {required this.value, required this.label, this.unit = '', this.change, this.good = true});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
        decoration:
            BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text.rich(TextSpan(children: [
              TextSpan(text: value, style: PMFont.baloo(28)),
              if (unit.isNotEmpty)
                TextSpan(text: unit, style: PMFont.baloo(14, weight: FontWeight.w700)),
            ])),
            Text(label, style: PMFont.nunito(13)),
            if (change != null)
              Text(change!,
                  style: PMFont.nunito(12,
                      weight: FontWeight.w800, color: good ? PM.hijauTua : PM.teksPudar)),
          ],
        ),
      ),
    );
  }
}

class _ReportLine extends StatelessWidget {
  final String label;
  final String text;
  const _ReportLine(this.label, this.text);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: PMFont.nunito(12, weight: FontWeight.w800, color: PM.hijauTua)),
        const SizedBox(height: 2),
        Text(text, style: PMFont.nunito(15)),
      ],
    );
  }
}

class _SpeedChart extends CustomPainter {
  final List<double?> values;
  _SpeedChart(this.values);

  @override
  void paint(Canvas canvas, Size size) {
    final grid = Paint()
      ..color = const Color(0xFFEEF0F4)
      ..strokeWidth = 1;
    for (var i = 0; i < 3; i++) {
      final y = 10 + i * (size.height - 20) / 2;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), grid);
    }
    final pts = <Offset>[];
    final present = values.whereType<double>().toList();
    if (present.isEmpty) {
      final tp = TextPainter(
        text: TextSpan(
            text: 'Belum ada data', style: PMFont.nunito(13, color: PM.teksPudar)),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset((size.width - tp.width) / 2, (size.height - tp.height) / 2));
      return;
    }
    final maxV = present.reduce(max) * 1.1;
    final minV = max(0.0, present.reduce(min) * 0.8);
    final double range = (maxV - minV) == 0 ? 1.0 : (maxV - minV);
    for (var i = 0; i < values.length; i++) {
      final v = values[i];
      if (v == null) continue;
      final x = 8 + i * (size.width - 16) / (values.length - 1);
      final y = 10 + (maxV - v) / range * (size.height - 20);
      pts.add(Offset(x, y));
    }
    final line = Paint()
      ..color = PM.hijauDaun
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final path = Path();
    for (var i = 0; i < pts.length; i++) {
      if (i == 0) {
        path.moveTo(pts[i].dx, pts[i].dy);
      } else {
        path.lineTo(pts[i].dx, pts[i].dy);
      }
    }
    canvas.drawPath(path, line);
    for (var i = 0; i < pts.length; i++) {
      final last = i == pts.length - 1;
      canvas.drawCircle(pts[i], last ? 5 : 3, Paint()..color = last ? PM.hijauTua : PM.hijauDaun);
    }
    final tp = TextPainter(
      text: TextSpan(
          text: fmtNum(present.last),
          style: PMFont.nunito(12, weight: FontWeight.w800, color: PM.hijauTua)),
      textDirection: TextDirection.ltr,
    )..layout();
    final lp = pts.last;
    tp.paint(canvas, Offset(min(lp.dx - tp.width / 2, size.width - tp.width), max(0.0, lp.dy - 22)));
  }

  @override
  bool shouldRepaint(covariant _SpeedChart old) => true;
}

// ---------------------------------------------------------------------------
// Bimbingan (versi awal: dihitung dari hasil latihan)
// ---------------------------------------------------------------------------

class BimbinganTab extends StatelessWidget {
  const BimbinganTab();

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final items = store.guidance();
    final yellow = items.where((g) => !g.teacher).toList();
    final red = items.where((g) => g.teacher).toList();

    if (items.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text(
            'Belum ada topik yang perlu bimbingan.\nTopik muncul di sini kalau beberapa lembar terakhir kurang dari 70% benar.',
            textAlign: TextAlign.center,
            style: PMFont.nunito(15, color: PM.teksPudar),
          ),
        ),
      );
    }

    Widget section(String title, Color dot, List<GuidanceItem> list) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Container(
                  width: 14, height: 14, decoration: BoxDecoration(color: dot, shape: BoxShape.circle)),
              const SizedBox(width: 8),
              Text(title, style: PMFont.nunito(15, weight: FontWeight.w800)),
            ]),
            const SizedBox(height: 10),
            for (final g in list) ...[
              PmCard(
                radius: 16,
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      ChildAvatar(g.child, size: 36),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(Curriculum.level(g.level).title,
                                style: PMFont.nunito(16, weight: FontWeight.w700)),
                            Text('${g.child.name} · Matematika',
                                style: PMFont.nunito(13, color: PM.teksPudar)),
                          ],
                        ),
                      ),
                    ]),
                    const SizedBox(height: 8),
                    Text(
                        'Rata-rata ${(g.accuracy * 100).round()}% benar di lembar terakhir.',
                        style: PMFont.nunito(15)),
                  ],
                ),
              ),
              const SizedBox(height: 10),
            ],
            const SizedBox(height: 8),
          ],
        );

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (yellow.isNotEmpty) section('Perlu bimbingan orang tua', PM.kuning, yellow),
        if (red.isNotEmpty) section('Perlu bimbingan guru', PM.koral, red),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// Atur
// ---------------------------------------------------------------------------

class AturTab extends StatelessWidget {
  const AturTab();

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);

    Widget tile(IconData icon, String title, String sub, VoidCallback onTap) => ListTile(
          leading: Icon(icon, color: PM.hijauTua),
          title: Text(title, style: PMFont.nunito(16, weight: FontWeight.w700)),
          subtitle: Text(sub, style: PMFont.nunito(13, color: PM.teksPudar)),
          trailing: const Icon(Icons.chevron_right_rounded),
          onTap: onTap,
        );

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 8),
      children: [
        Container(
          color: Colors.white,
          child: Column(children: [
            tile(Icons.people_alt_outlined, 'Anak dan profil',
                '${store.children.length} anak', () => _editChildren(context)),
            tile(Icons.schedule_rounded, 'Pengaturan waktu', 'Batas belajar, game, jam tenang',
                () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const TimeSettingsScreen()))),
            tile(Icons.pin_outlined, 'Ganti PIN', 'PIN masuk mode orang tua', () {
              store.parentPin = null;
              store.markParentSeen();
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('PIN dihapus. Buat PIN baru saat masuk berikutnya.')));
            }),
            tile(Icons.devices_other_rounded, 'HP terhubung',
                'Pantau dari HP orang tua — segera hadir', () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Fitur ini menyusul setelah Firebase tersambung.')));
            }),
            tile(Icons.privacy_tip_outlined, 'Izin data',
                'Data tersimpan di HP ini', () => _privacy(context)),
            tile(Icons.insights_rounded, 'Catatan pengembang',
                'Pemakaian aplikasi untuk pengembangan', () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const DevLogScreen()))),
          ]),
        ),
      ],
    );
  }

  void _privacy(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Izin data', style: PMFont.nunito(18, weight: FontWeight.w800)),
        content: Text(
            'Saat ini semua data (nama anak, hasil latihan, pesan) hanya tersimpan di HP ini. '
            'Nanti, data akan dikirim ke server Pintar Main supaya orang tua bisa memantau dari HP lain. '
            'Kami tidak menampilkan iklan dan tidak menjual data.',
            style: PMFont.nunito(15)),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Mengerti')),
        ],
      ),
    );
  }

  void _editChildren(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ChildrenEditor()));
  }
}

class ChildrenEditor extends StatelessWidget {
  const ChildrenEditor();

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        title: Text('Anak dan profil', style: PMFont.baloo(22, weight: FontWeight.w700)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: PM.hijauTua,
        foregroundColor: Colors.white,
        onPressed: () => _edit(context, null),
        icon: const Icon(Icons.add),
        label: const Text('Tambah anak'),
      ),
      body: ListView(
        children: [
          for (final c in store.children)
            ListTile(
              tileColor: Colors.white,
              leading: ChildAvatar(c, size: 44),
              title: Text(c.name, style: PMFont.nunito(16, weight: FontWeight.w700)),
              subtitle: Text('Kelas ${c.grade} · Level ${c.level}',
                  style: PMFont.nunito(13, color: PM.teksPudar)),
              trailing: const Icon(Icons.edit_outlined),
              onTap: () => _edit(context, c),
            ),
        ],
      ),
    );
  }

  void _edit(BuildContext context, Child? c) {
    final store = StoreScope.read(context);
    final name = TextEditingController(text: c?.name ?? '');
    var grade = c?.grade ?? 1;
    var animal = c?.animal ?? 'gajah';
    var level = c?.level ?? 1;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, set) => AlertDialog(
          title: Text(c == null ? 'Tambah anak' : 'Ubah ${c.name}',
              style: PMFont.nunito(18, weight: FontWeight.w800)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: name,
                  decoration: const InputDecoration(labelText: 'Nama panggilan'),
                ),
                const SizedBox(height: 12),
                Text('Kelas', style: PMFont.nunito(14, weight: FontWeight.w700)),
                Wrap(
                  spacing: 6,
                  children: [
                    for (var g = 1; g <= 6; g++)
                      ChoiceChip(
                        label: Text('$g'),
                        selected: grade == g,
                        onSelected: (_) => set(() => grade = g),
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                Text('Avatar', style: PMFont.nunito(14, weight: FontWeight.w700)),
                Wrap(
                  spacing: 6,
                  children: [
                    for (final a in Animal.all)
                      ChoiceChip(
                        label: Text('${a.emoji} ${a.nama}'),
                        selected: animal == a.id,
                        onSelected: (_) => set(() => animal = a.id),
                      ),
                  ],
                ),
                if (c != null) ...[
                  const SizedBox(height: 12),
                  Text('Level Lancar Matematika',
                      style: PMFont.nunito(14, weight: FontWeight.w700)),
                  Wrap(
                    spacing: 6,
                    children: [
                      for (final l in Curriculum.levels)
                        ChoiceChip(
                          label: Text('${l.no}'),
                          selected: level == l.no,
                          onSelected: (_) => set(() => level = l.no),
                        ),
                    ],
                  ),
                  Text(Curriculum.level(level).title,
                      style: PMFont.nunito(13, color: PM.teksPudar)),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Batal')),
            FilledButton(
              onPressed: () {
                final n = name.text.trim();
                if (n.isEmpty) return;
                if (c == null) {
                  store.addChild(n, animal, grade);
                } else {
                  c
                    ..name = n
                    ..grade = grade
                    ..animal = animal
                    ..level = level;
                  store.updateChild(c);
                }
                Navigator.of(ctx).pop();
              },
              child: const Text('Simpan'),
            ),
          ],
        ),
      ),
    );
  }
}
