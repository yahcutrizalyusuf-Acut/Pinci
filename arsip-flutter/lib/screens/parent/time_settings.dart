import 'package:flutter/material.dart';

import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pm_widgets.dart';

/// Layar 12 — Pengaturan waktu (per anak).
class TimeSettingsScreen extends StatefulWidget {
  const TimeSettingsScreen();
  @override
  State<TimeSettingsScreen> createState() => _TimeSettingsScreenState();
}

class _TimeSettingsScreenState extends State<TimeSettingsScreen> {
  String? _childId;
  TimeSettings? _s;

  void _load(AppStore store, String id) {
    final cur = store.settingsFor(id);
    _childId = id;
    _s = TimeSettings.fromJson(cur.toJson()); // salinan untuk diubah
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    if (_childId == null) _load(store, store.children.first.id);
    final s = _s!;
    final child = store.childById(_childId!);

    Widget card(Widget child) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: PmCard(radius: 16, child: child),
        );

    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        title: Text('Pengaturan waktu', style: PMFont.baloo(22, weight: FontWeight.w700)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 8,
            children: [
              for (final c in store.children)
                ChoiceChip(
                  label: Text('${c.avatar.emoji} ${c.name}',
                      style: PMFont.nunito(14, weight: FontWeight.w700)),
                  selected: c.id == _childId,
                  selectedColor: PM.kapsul,
                  backgroundColor: Colors.white,
                  showCheckmark: false,
                  onSelected: (_) => setState(() => _load(store, c.id)),
                ),
            ],
          ),
          const SizedBox(height: 12),
          card(Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Batas belajar per hari', style: PMFont.nunito(16, weight: FontWeight.w700)),
              const SizedBox(height: 8),
              Row(
                children: [
                  IconButton.outlined(
                    tooltip: 'Kurangi 5 menit',
                    onPressed: () => setState(
                        () => s.studyMinutes = (s.studyMinutes - 5).clamp(10, 90)),
                    icon: const Icon(Icons.remove),
                  ),
                  Expanded(
                    child: Center(
                      child: Text.rich(TextSpan(children: [
                        TextSpan(text: '${s.studyMinutes}', style: PMFont.baloo(32)),
                        TextSpan(text: ' menit', style: PMFont.nunito(15)),
                      ])),
                    ),
                  ),
                  IconButton.outlined(
                    tooltip: 'Tambah 5 menit',
                    onPressed: () => setState(
                        () => s.studyMinutes = (s.studyMinutes + 5).clamp(10, 90)),
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),
              Text('Saran untuk kelas ${child.grade}: ${child.grade <= 2 ? 20 : 40} menit.',
                  style: PMFont.nunito(13, color: PM.teksPudar)),
            ],
          )),
          card(Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Expanded(
                    child: Text('Waktu game per hari',
                        style: PMFont.nunito(16, weight: FontWeight.w700))),
                Text('${s.gameMinutes} menit',
                    style: PMFont.nunito(16, weight: FontWeight.w800, color: PM.hijauTua)),
              ]),
              Slider(
                value: s.gameMinutes.toDouble(),
                min: 0,
                max: 60,
                divisions: 12,
                activeColor: PM.hijauTua,
                label: '${s.gameMinutes} menit',
                onChanged: (v) => setState(() => s.gameMinutes = v.round()),
              ),
              Text('Bawaan 30 menit', style: PMFont.nunito(12, color: PM.teksPudar)),
            ],
          )),
          card(Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Kapan game terbuka?', style: PMFont.nunito(16, weight: FontWeight.w700)),
              RadioListTile<bool>(
                contentPadding: EdgeInsets.zero,
                value: true,
                groupValue: s.gameAfterPractice,
                activeColor: PM.hijauTua,
                title: Text('Game setelah latihan hari ini', style: PMFont.nunito(15)),
                onChanged: (v) => setState(() => s.gameAfterPractice = true),
              ),
              RadioListTile<bool>(
                contentPadding: EdgeInsets.zero,
                value: false,
                groupValue: s.gameAfterPractice,
                activeColor: PM.hijauTua,
                title: Text('Selalu terbuka', style: PMFont.nunito(15)),
                onChanged: (v) => setState(() => s.gameAfterPractice = false),
              ),
            ],
          )),
          card(Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Jam tenang', style: PMFont.nunito(16, weight: FontWeight.w700)),
                    Text('Mulai pukul ${s.quietHour.toString().padLeft(2, '0')}.00',
                        style: PMFont.nunito(14, color: PM.teksPudar)),
                  ],
                ),
              ),
              Switch(
                value: s.quietEnabled,
                activeTrackColor: PM.hijauTua,
                onChanged: (v) => setState(() => s.quietEnabled = v),
              ),
            ],
          )),
          const SizedBox(height: 4),
          PmButton(
            'Simpan',
            height: 48,
            textStyle: PMFont.nunito(16, weight: FontWeight.w800),
            onPressed: () {
              store.saveSettings(_childId!, s);
              ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Pengaturan ${child.name} tersimpan.')));
            },
          ),
        ],
      ),
    );
  }
}
