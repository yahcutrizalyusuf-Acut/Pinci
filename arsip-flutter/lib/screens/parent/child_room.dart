import 'package:flutter/material.dart';

import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pm_widgets.dart';

/// Layar 10 — Ruang anak: linimasa hasil, pesan, dan stiker.
class ChildRoomScreen extends StatefulWidget {
  final String childId;
  const ChildRoomScreen({required this.childId});

  @override
  State<ChildRoomScreen> createState() => _ChildRoomScreenState();
}

class _ChildRoomScreenState extends State<ChildRoomScreen> {
  final _text = TextEditingController();

  static const quick = [
    'Wah, rekor baru! Ayah bangga.',
    'Terus semangat, Nak!',
    'Istirahat dulu, ya.',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      StoreScope.read(context).markParentSeen();
    });
  }

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  void _send(String t) {
    final s = t.trim();
    if (s.isEmpty) return;
    StoreScope.read(context).sendParentMessage(widget.childId, s);
    _text.clear();
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final child = store.childById(widget.childId);
    final list = store.messagesFor(child.id);
    final last = store.lastActivity(child.id);

    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        titleSpacing: 0,
        title: Row(
          children: [
            ChildAvatar(child, size: 40),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${child.name} · Kelas ${child.grade}',
                    style: PMFont.nunito(17, weight: FontWeight.w700)),
                Text(last == null ? 'Belum ada kegiatan' : 'Terakhir ${fmtRelativeDay(last)}',
                    style: PMFont.nunito(13, color: PM.teksPudar)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: list.isEmpty
                ? Center(
                    child: Text('Belum ada kegiatan.',
                        style: PMFont.nunito(15, color: PM.teksPudar)))
                : ListView.separated(
                    reverse: true,
                    padding: const EdgeInsets.all(12),
                    itemCount: list.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (_, i) {
                      final m = list[list.length - 1 - i];
                      if (m.from == 'system') {
                        final r = store.resultById(m.resultId);
                        if (r == null) return const SizedBox();
                        return _ResultBubble(result: r, store: store);
                      }
                      if (m.from == 'parent') return _OwnBubble(m);
                      return _StickerBubble(m);
                    },
                  ),
          ),
          SizedBox(
            height: 52,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              children: [
                for (final q in quick)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      backgroundColor: Colors.white,
                      side: const BorderSide(color: Color(0xFFBFE3CC)),
                      label: Text(q,
                          style: PMFont.nunito(14,
                              weight: FontWeight.w700, color: PM.hijauTua)),
                      onPressed: () => _send(q),
                    ),
                  ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _text,
                      textInputAction: TextInputAction.send,
                      onSubmitted: _send,
                      style: PMFont.nunito(16),
                      decoration: InputDecoration(
                        hintText: 'Tulis pesan untuk ${child.name}…',
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding:
                            const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(999),
                          borderSide: const BorderSide(color: PM.garisAbu),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(999),
                          borderSide: const BorderSide(color: PM.garisAbu),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Semantics(
                    button: true,
                    label: 'Kirim',
                    child: InkResponse(
                      onTap: () => _send(_text.text),
                      child: Container(
                        width: 48,
                        height: 48,
                        decoration:
                            const BoxDecoration(color: PM.hijauTua, shape: BoxShape.circle),
                        child: const Icon(Icons.send_rounded, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultBubble extends StatelessWidget {
  final SheetResult result;
  final AppStore store;
  const _ResultBubble({required this.result, required this.store});

  @override
  Widget build(BuildContext context) {
    final r = result;
    final prev = store.bestSeconds(r.childId, r.level, excludeId: r.id);
    final record = prev != null && r.seconds < prev;
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        width: 260,
        clipBehavior: Clip.antiAlias,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomRight: Radius.circular(16),
            bottomLeft: Radius.circular(4),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(height: 6, color: PM.math),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Lancar Matematika · Level ${r.level}',
                      style: PMFont.nunito(13, weight: FontWeight.w700, color: PM.mathTeks)),
                  const SizedBox(height: 4),
                  Text.rich(TextSpan(children: [
                    TextSpan(text: '${r.correct}/${r.total}', style: PMFont.baloo(30)),
                    TextSpan(text: ' benar', style: PMFont.nunito(15)),
                  ])),
                  Text(fmtDuration(r.seconds), style: PMFont.nunito(14, color: PM.teksPudar)),
                  if (record)
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                          color: PM.dampingiBg, borderRadius: BorderRadius.circular(999)),
                      child: Text('Rekor baru! (tadi ${fmtClock(prev!)})',
                          style: PMFont.nunito(13, weight: FontWeight.w700)),
                    ),
                  if (r.mood != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Text('Rasanya: ${_mood(r.mood!)}',
                          style: PMFont.nunito(13, color: PM.teksPudar)),
                    ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text(fmtTime(r.at),
                        style: PMFont.nunito(12, color: const Color(0xFF868C9E))),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _mood(String m) => switch (m) {
        'burung' => '🐦 burung terbang',
        'rusa' => '🦌 rusa lincah',
        'penyu' => '🐢 penyu pelan',
        'gajah' => '🐘 gajah ngantuk',
        _ => m,
      };
}

class _OwnBubble extends StatelessWidget {
  final ChatMessage m;
  const _OwnBubble(this.m);

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 270),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 10, 14, 8),
          decoration: const BoxDecoration(
            color: PM.gudangBg,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(16),
              topRight: Radius.circular(16),
              bottomLeft: Radius.circular(16),
              bottomRight: Radius.circular(4),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(m.text, style: PMFont.nunito(16)),
              Text('${fmtTime(m.at)} ✓✓',
                  style: PMFont.nunito(12, color: PM.hijauTua)),
            ],
          ),
        ),
      ),
    );
  }
}

class _StickerBubble extends StatelessWidget {
  final ChatMessage m;
  const _StickerBubble(this.m);

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomRight: Radius.circular(16),
            bottomLeft: Radius.circular(4),
          ),
        ),
        child: Column(
          children: [
            Text(m.sticker ?? '💬', style: const TextStyle(fontSize: 40)),
            Text(m.text, style: PMFont.nunito(14, weight: FontWeight.w700)),
            Text(fmtTime(m.at), style: PMFont.nunito(12, color: const Color(0xFF868C9E))),
          ],
        ),
      ),
    );
  }
}
