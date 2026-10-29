import 'package:flutter/material.dart';

import '../../data/curriculum.dart';
import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';
import '../parent/parent_gate.dart';
import 'jurus.dart';
import 'welcome.dart';

/// Mode anak: Belajar · Gudang Ilmu · Main · Pesan.
class ChildShell extends StatefulWidget {
  final int initialTab;
  const ChildShell({this.initialTab = 0});

  @override
  State<ChildShell> createState() => _ChildShellState();
}

class _ChildShellState extends State<ChildShell> {
  late int _tab = widget.initialTab;

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final child = store.currentChild;
    if (child == null) return const WelcomeScreen();

    final pages = [
      BerandaTab(child: child, onOpenMessages: () => _go(3)),
      const ComingSoon(
          title: 'Gudang Ilmu',
          text: 'Peta topik sedang disiapkan Pinci. Sebentar lagi, ya!'),
      const ComingSoon(
          title: 'Main',
          text: 'Album satwa dan game akan terbuka setelah latihan hari ini.'),
      PesanTab(child: child),
    ];

    return Scaffold(
      backgroundColor: PM.krem,
      body: SafeArea(bottom: false, child: IndexedStack(index: _tab, children: pages)),
      bottomNavigationBar: PmTabBar(
        index: _tab,
        onTap: _go,
        items: [
          const TabItem('Belajar', Icons.home_outlined, Icons.home_rounded),
          const TabItem('Gudang Ilmu', Icons.menu_book_outlined, Icons.menu_book_rounded),
          const TabItem('Main', Icons.casino_outlined, Icons.casino_rounded),
          TabItem('Pesan', Icons.chat_bubble_outline_rounded, Icons.chat_bubble_rounded,
              dot: store.childHasUnread(child.id)),
        ],
      ),
    );
  }

  void _go(int i) {
    setState(() => _tab = i);
    final store = StoreScope.read(context);
    store.log('buka_tab_anak', {'tab': i});
    if (i == 3) store.markChildSeenMessages();
  }
}

// ---------------------------------------------------------------------------
// Layar 3 — Beranda Belajar
// ---------------------------------------------------------------------------

class BerandaTab extends StatelessWidget {
  final Child child;
  final VoidCallback onOpenMessages;
  const BerandaTab({required this.child, required this.onOpenMessages});

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final sz = GradeSizes(child.grade);
    final msg = store.latestParentMessage(child.id);
    final level = Curriculum.level(child.level);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      children: [
        Row(
          children: [
            const PmLogo(size: 22),
            const Spacer(),
            Semantics(
              button: true,
              label: 'Ganti profil',
              child: InkResponse(
                onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ProfilePickerScreen())),
                child: ChildAvatar(child, size: 40),
              ),
            ),
            const SizedBox(width: 4),
            Semantics(
              button: true,
              label: 'Mode orang tua',
              child: InkResponse(
                onTap: () => openParentMode(context),
                child: const Opacity(
                  opacity: 0.45,
                  child: SizedBox(
                    width: 44,
                    height: 44,
                    child: Icon(Icons.lock_outline_rounded, size: 20, color: PM.teksPudar),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            const Pinci(size: 96, mood: PinciMood.senang),
            const SizedBox(width: 10),
            Expanded(
              child: PmCard(
                radius: 20,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Halo, ${child.name}!', style: PMFont.baloo(22, weight: FontWeight.w700)),
                    Text('Yuk, kita cari tahu hari ini.', style: PMFont.andika(17)),
                  ],
                ),
              ),
            ),
          ],
        ),
        if (msg != null) ...[
          const SizedBox(height: 16),
          PmCard(
            radius: 16,
            padding: const EdgeInsets.all(12),
            onTap: onOpenMessages,
            child: Row(
              children: [
                SpeakerButton('Dari ${store.parentName}: ${msg.text}'),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Dari ${store.parentName}',
                          style: PMFont.andika(14, weight: FontWeight.w700, color: PM.hijauTua)),
                      Text(msg.text, style: PMFont.andika(16)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 16),
        _PathCard(
          title: 'Lancar Matematika',
          subtitle: 'Level ${level.no} · ${level.topic}',
          color: PM.math,
          bg: PM.mathBg,
          sub: PM.mathTeks,
          icon: Icons.calculate_rounded,
          height: sz.kecil ? 104 : 96,
          onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => JurusScreen(child: child))),
        ),
        SizedBox(height: sz.jarakTombol + 4),
        _PathCard(
          title: 'Baca Ulang',
          subtitle: 'Cerita pendek',
          color: PM.bi,
          bg: PM.biBg,
          sub: PM.biTeks,
          icon: Icons.auto_stories_rounded,
          height: sz.kecil ? 104 : 96,
          onTap: () => _soon(context, 'Baca Ulang'),
        ),
        SizedBox(height: sz.jarakTombol + 4),
        _PathCard(
          title: 'Bahasa Inggris',
          subtitle: 'Kenal kata',
          color: PM.en,
          bg: PM.enBg,
          sub: PM.enTeks,
          icon: Icons.translate_rounded,
          height: sz.kecil ? 104 : 96,
          onTap: () => _soon(context, 'Bahasa Inggris'),
        ),
        if (child.grade == 6) ...[
          SizedBox(height: sz.jarakTombol + 4),
          _PathCard(
            title: 'Siap TKA',
            subtitle: 'Latihan soal kelas 6',
            color: PM.math,
            bg: PM.mathBg,
            sub: PM.mathTeks,
            icon: Icons.school_rounded,
            badge: 'TKA',
            height: 96,
            onTap: () => _soon(context, 'Siap TKA'),
          ),
        ],
      ],
    );
  }

  void _soon(BuildContext context, String title) {
    Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => Scaffold(
              backgroundColor: PM.krem,
              body: SafeArea(
                child: Column(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(12),
                      child: Align(alignment: Alignment.centerLeft, child: RoundBack()),
                    ),
                    Expanded(
                        child: ComingSoon(
                            title: title,
                            text: 'Bagian ini sedang disiapkan Pinci. Sebentar lagi, ya!')),
                  ],
                ),
              ),
            )));
  }
}

class _PathCard extends StatelessWidget {
  final String title, subtitle;
  final Color color, bg, sub;
  final IconData icon;
  final double height;
  final String? badge;
  final VoidCallback onTap;

  const _PathCard({
    required this.title,
    required this.subtitle,
    required this.color,
    required this.bg,
    required this.sub,
    required this.icon,
    required this.height,
    required this.onTap,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '$title, $subtitle',
      excludeSemantics: true,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(24),
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: onTap,
          child: SizedBox(
            height: height,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration:
                        BoxDecoration(color: color, borderRadius: BorderRadius.circular(18)),
                    child: Icon(icon, color: Colors.white, size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(children: [
                          Flexible(
                              child: Text(title,
                                  style: PMFont.baloo(21, weight: FontWeight.w700))),
                          if (badge != null) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                  color: color, borderRadius: BorderRadius.circular(6)),
                              child: Text(badge!,
                                  style: PMFont.nunito(11,
                                      weight: FontWeight.w800, color: Colors.white)),
                            ),
                          ],
                        ]),
                        Text(subtitle, style: PMFont.andika(15, color: sub)),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded, color: PM.tinta, size: 28),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Layar 8 — Pesan (tanpa papan ketik)
// ---------------------------------------------------------------------------

class PesanTab extends StatelessWidget {
  final Child child;
  const PesanTab({required this.child});

  static const stickers = [
    ('🏅', 'Aku lulus level'),
    ('🚀', 'Lihat rekorku'),
    ('🙋', 'Bantu aku dong'),
    ('💚', 'Terima kasih'),
    ('😴', 'Aku capek hari ini'),
    ('💪', 'Ayo Tantang Ayah'),
  ];

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final list =
        store.messagesFor(child.id).where((m) => m.from != 'system').toList();

    return Column(
      children: [
        Container(
          height: 64,
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(color: PM.mathBg, shape: BoxShape.circle),
                child: const Icon(Icons.person_rounded, color: PM.mathTeks),
              ),
              const SizedBox(width: 12),
              Text(store.parentName, style: PMFont.baloo(24, weight: FontWeight.w700)),
            ],
          ),
        ),
        Expanded(
          child: list.isEmpty
              ? Center(
                  child: Text('Belum ada pesan.',
                      style: PMFont.andika(18, color: PM.teksPudar)))
              : ListView.separated(
                  reverse: true,
                  padding: const EdgeInsets.all(16),
                  itemCount: list.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final m = list[list.length - 1 - i];
                    return m.from == 'parent'
                        ? _ParentBubble(text: m.text, name: store.parentName)
                        : _StickerBubble(emoji: m.sticker ?? '💬', label: m.text);
                  },
                ),
        ),
        Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Balas dengan stiker',
                  style: PMFont.andika(15, color: PM.teksPudar)),
              const SizedBox(height: 10),
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 8,
                crossAxisSpacing: 12,
                childAspectRatio: 1.05,
                children: [
                  for (final s in stickers)
                    Semantics(
                      button: true,
                      label: s.$2,
                      excludeSemantics: true,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () {
                          store.sendSticker(child.id, s.$1, s.$2);
                          Voice.say(s.$2);
                        },
                        child: Column(
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: PM.krem,
                                shape: BoxShape.circle,
                                border: Border.all(color: PM.garisKrem, width: 2),
                              ),
                              child: Text(s.$1, style: const TextStyle(fontSize: 30)),
                            ),
                            const SizedBox(height: 4),
                            Text(s.$2,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                style: PMFont.andika(13)),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ParentBubble extends StatelessWidget {
  final String text;
  final String name;
  const _ParentBubble({required this.text, required this.name});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 290),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
              bottomRight: Radius.circular(20),
              bottomLeft: Radius.circular(6),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SpeakerButton('Dari $name: $text'),
              const SizedBox(width: 10),
              Flexible(child: Text(text, style: PMFont.andika(18))),
            ],
          ),
        ),
      ),
    );
  }
}

class _StickerBubble extends StatelessWidget {
  final String emoji;
  final String label;
  const _StickerBubble({required this.emoji, required this.label});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: const BoxDecoration(
          color: PM.gudangBg,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
            bottomLeft: Radius.circular(20),
            bottomRight: Radius.circular(6),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 40)),
            Text(label, style: PMFont.andika(15)),
          ],
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Penanda bagian yang belum jadi
// ---------------------------------------------------------------------------

class ComingSoon extends StatelessWidget {
  final String title;
  final String text;
  const ComingSoon({required this.title, required this.text});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Pinci(size: 120, mood: PinciMood.berpikir),
            const SizedBox(height: 16),
            Text(title, style: PMFont.baloo(26)),
            const SizedBox(height: 8),
            Text(text,
                textAlign: TextAlign.center,
                style: PMFont.andika(18, color: PM.teksPudar)),
          ],
        ),
      ),
    );
  }
}
