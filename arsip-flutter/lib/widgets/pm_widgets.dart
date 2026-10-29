import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../data/models.dart';
import '../theme/pm_theme.dart';

// ---------------------------------------------------------------------------
// Suara (tombol 🔊)
// ---------------------------------------------------------------------------

class Voice {
  static final FlutterTts _tts = FlutterTts();
  static bool _ready = false;

  static Future<void> say(String text) async {
    try {
      if (!_ready) {
        await _tts.setLanguage('id-ID');
        await _tts.setSpeechRate(0.45);
        _ready = true;
      }
      await _tts.stop();
      await _tts.speak(text);
    } catch (_) {
      // Suara tidak tersedia di HP ini; abaikan dengan tenang.
    }
  }
}

class SpeakerButton extends StatelessWidget {
  final String text;
  final double size;
  final Color bg;
  final Color fg;
  const SpeakerButton(this.text,
      {this.size = 44, this.bg = PM.gudangBg, this.fg = PM.hijauTua});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Dengarkan',
      child: InkResponse(
        onTap: () => Voice.say(text),
        radius: size / 2 + 4,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
          child: Icon(Icons.volume_up_rounded, color: fg, size: size * 0.52),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Tombol: biasa · ditekan (mengecil 96% + lebih gelap) · nonaktif · memuat
// Teks di atas hijau dan oranye SELALU Biru Tinta.
// ---------------------------------------------------------------------------

class PmButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final Color color;
  final double height;
  final IconData? icon;
  final bool outline;
  final bool loading;
  final TextStyle? textStyle;
  final bool expand;

  const PmButton(
    this.label, {
    this.onPressed,
    this.color = PM.hijauDaun,
    this.height = 64,
    this.icon,
    this.outline = false,
    this.loading = false,
    this.textStyle,
    this.expand = true,
  });

  @override
  State<PmButton> createState() => _PmButtonState();
}

class _PmButtonState extends State<PmButton> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final disabled = widget.onPressed == null;
    final pressedColor = Color.lerp(widget.color, Colors.black, 0.12)!;
    final bg = widget.outline
        ? Colors.white
        : disabled
            ? PM.nonaktif
            : (_down ? pressedColor : widget.color);
    final fg = widget.outline
        ? (disabled ? PM.nonaktifTeks : PM.hijauTua)
        : (disabled ? PM.nonaktifTeks : PM.tinta);
    final style = (widget.textStyle ?? PMFont.andika(20, weight: FontWeight.w700))
        .copyWith(color: fg);

    Widget content = widget.loading
        ? const _LoadingDots()
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.icon != null) ...[
                Icon(widget.icon, color: fg, size: style.fontSize! + 4),
                const SizedBox(width: 10),
              ],
              Flexible(
                child: Text(widget.label,
                    style: style, textAlign: TextAlign.center, maxLines: 2),
              ),
            ],
          );

    return Semantics(
      button: true,
      enabled: !disabled,
      label: widget.label,
      excludeSemantics: true,
      child: GestureDetector(
        onTapDown: disabled ? null : (_) => setState(() => _down = true),
        onTapCancel: () => setState(() => _down = false),
        onTapUp: disabled ? null : (_) => setState(() => _down = false),
        onTap: widget.loading ? null : widget.onPressed,
        child: AnimatedScale(
          scale: _down ? 0.96 : 1,
          duration: const Duration(milliseconds: 120),
          child: Container(
            height: widget.height,
            width: widget.expand ? double.infinity : null,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(16),
              border: widget.outline
                  ? Border.all(
                      color: disabled ? PM.nonaktif : widget.color, width: 2)
                  : null,
              boxShadow: widget.outline || disabled
                  ? null
                  : [
                      BoxShadow(
                          color: PM.tinta.withValues(alpha: 0.12),
                          blurRadius: 6,
                          offset: const Offset(0, 2))
                    ],
            ),
            child: content,
          ),
        ),
      ),
    );
  }
}

class _LoadingDots extends StatefulWidget {
  const _LoadingDots();
  @override
  State<_LoadingDots> createState() => _LoadingDotsState();
}

class _LoadingDotsState extends State<_LoadingDots>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 900))
        ..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, __) => Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(3, (i) {
          final t = (_c.value - i * 0.2) % 1.0;
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            width: 9,
            height: 9,
            decoration: BoxDecoration(
              color: PM.tinta.withValues(alpha: 0.3 + 0.7 * (1 - t)),
              shape: BoxShape.circle,
            ),
          );
        }),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Kotak bergetar halus (jawaban belum tepat) — tanpa kata "salah".
// ---------------------------------------------------------------------------

class ShakeBox extends StatefulWidget {
  final Widget child;
  final int trigger; // ubah angkanya untuk memicu getaran
  const ShakeBox({required this.child, required this.trigger});

  @override
  State<ShakeBox> createState() => _ShakeBoxState();
}

class _ShakeBoxState extends State<ShakeBox> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 320));

  @override
  void didUpdateWidget(covariant ShakeBox old) {
    super.didUpdateWidget(old);
    if (old.trigger != widget.trigger) _c.forward(from: 0);
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, child) => Transform.translate(
        offset: Offset(sin(_c.value * pi * 4) * 6 * (1 - _c.value), 0),
        child: child,
      ),
      child: widget.child,
    );
  }
}

// ---------------------------------------------------------------------------
// Batang kemajuan soal (bukan jam)
// ---------------------------------------------------------------------------

class SheetProgress extends StatelessWidget {
  final int done;
  final int total;
  const SheetProgress(this.done, this.total);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Soal $done dari $total',
      child: Row(
        children: [
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: total == 0 ? 0 : done / total,
                minHeight: 14,
                backgroundColor: const Color(0xFFEDE3CF),
                color: PM.hijauDaun,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text('$done / $total', style: PMFont.andika(16, weight: FontWeight.w700)),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Avatar anak
// ---------------------------------------------------------------------------

class ChildAvatar extends StatelessWidget {
  final Child child;
  final double size;
  const ChildAvatar(this.child, {this.size = 52});

  @override
  Widget build(BuildContext context) {
    final a = child.avatar;
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: Color(a.bg), shape: BoxShape.circle),
      child: Text(a.emoji, style: TextStyle(fontSize: size * 0.54)),
    );
  }
}

// ---------------------------------------------------------------------------
// Kartu putih membulat
// ---------------------------------------------------------------------------

class PmCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final Color color;
  final double radius;
  final VoidCallback? onTap;
  const PmCard({
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.color = Colors.white,
    this.radius = 20,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final box = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(
              color: PM.tinta.withValues(alpha: 0.07),
              blurRadius: 6,
              offset: const Offset(0, 2))
        ],
      ),
      child: child,
    );
    if (onTap == null) return box;
    return Material(
      color: Colors.transparent,
      child: InkWell(
          borderRadius: BorderRadius.circular(radius), onTap: onTap, child: box),
    );
  }
}

// ---------------------------------------------------------------------------
// Tab bawah
// ---------------------------------------------------------------------------

class TabItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  final bool dot;
  const TabItem(this.label, this.icon, this.activeIcon, {this.dot = false});
}

class PmTabBar extends StatelessWidget {
  final List<TabItem> items;
  final int index;
  final ValueChanged<int> onTap;
  final bool child; // true = mode anak (Andika, lebih besar)

  const PmTabBar(
      {required this.items, required this.index, required this.onTap, this.child = true});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: child ? PM.garisKrem : PM.garisAbu)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            children: List.generate(items.length, (i) {
              final it = items[i];
              final active = i == index;
              final color = active ? PM.hijauTua : PM.teksPudar;
              final label = child
                  ? PMFont.andika(13, weight: active ? FontWeight.w700 : FontWeight.w400, color: color)
                  : PMFont.nunito(12, weight: active ? FontWeight.w800 : FontWeight.w400, color: color);
              return Expanded(
                child: Semantics(
                  selected: active,
                  button: true,
                  label: it.label,
                  excludeSemantics: true,
                  child: InkWell(
                    onTap: () => onTap(i),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                              decoration: BoxDecoration(
                                color: active ? PM.kapsul : Colors.transparent,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Icon(active ? it.activeIcon : it.icon,
                                  color: color, size: child ? 28 : 24),
                            ),
                            if (it.dot)
                              Positioned(
                                right: 10,
                                top: 0,
                                child: Container(
                                  width: 9,
                                  height: 9,
                                  decoration: const BoxDecoration(
                                      color: PM.oranye, shape: BoxShape.circle),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(it.label, style: label),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Tombol kembali bulat
// ---------------------------------------------------------------------------

class RoundBack extends StatelessWidget {
  final VoidCallback? onTap;
  final String label;
  const RoundBack({this.onTap, this.label = 'Kembali'});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: InkResponse(
        onTap: onTap ?? () => Navigator.of(context).maybePop(),
        child: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
          child: const Icon(Icons.chevron_left_rounded, size: 30, color: PM.tinta),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Bantuan format
// ---------------------------------------------------------------------------

String fmtDuration(int seconds) {
  final m = seconds ~/ 60;
  final s = seconds % 60;
  if (m == 0) return '$s detik';
  return s == 0 ? '$m menit' : '$m menit $s detik';
}

String fmtClock(int seconds) {
  final m = seconds ~/ 60;
  final s = (seconds % 60).toString().padLeft(2, '0');
  return '$m:$s';
}

String fmtTime(DateTime t) =>
    '${t.hour.toString().padLeft(2, '0')}.${t.minute.toString().padLeft(2, '0')}';

String fmtNum(double v, {int digits = 1}) =>
    v.toStringAsFixed(digits).replaceAll('.', ',');

const bulan = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

String fmtShortDate(DateTime d) => '${d.day} ${bulan[d.month - 1]}';

String fmtRelativeDay(DateTime t) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final day = DateTime(t.year, t.month, t.day);
  final diff = today.difference(day).inDays;
  if (diff == 0) return fmtTime(t);
  if (diff == 1) return 'Kemarin';
  return fmtShortDate(t);
}
