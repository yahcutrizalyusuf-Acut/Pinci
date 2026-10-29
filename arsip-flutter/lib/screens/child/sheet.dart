import 'dart:async';

import 'package:flutter/material.dart';

import '../../data/curriculum.dart';
import '../../data/models.dart';
import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import '../../widgets/pinci.dart';
import '../../widgets/pm_widgets.dart';
import 'sheet_end.dart';

/// Layar 5 — Lembar Lancar. Satu soal per layar, tanpa jam berjalan.
class SheetScreen extends StatefulWidget {
  final Child child;
  const SheetScreen({required this.child});

  @override
  State<SheetScreen> createState() => _SheetScreenState();
}

enum _Phase { answer, right, wrong }

class _SheetScreenState extends State<SheetScreen> {
  late final MathLevel level = Curriculum.level(widget.child.level);
  late final List<Question> questions = level.sheet(count: 20);
  final Stopwatch _watch = Stopwatch();

  int _idx = 0;
  int _correct = 0;
  String _input = '';
  _Phase _phase = _Phase.answer;
  int _shake = 0;
  bool _showHint = false;
  Timer? _next;

  Question get _q => questions[_idx];
  GradeSizes get _sz => GradeSizes(widget.child.grade);

  @override
  void initState() {
    super.initState();
    _watch.start();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      StoreScope.read(context).log('lembar_mulai', {'level': level.no});
    });
  }

  @override
  void dispose() {
    _next?.cancel();
    super.dispose();
  }

  void _press(String d) {
    if (_phase != _Phase.answer) return;
    if (_input.length >= 3) return;
    setState(() => _input += d);
  }

  void _backspace() {
    if (_phase != _Phase.answer || _input.isEmpty) return;
    setState(() => _input = _input.substring(0, _input.length - 1));
  }

  void _check() {
    if (_phase != _Phase.answer || _input.isEmpty) return;
    final ok = int.tryParse(_input) == _q.answer;
    if (ok) {
      setState(() {
        _correct++;
        _phase = _Phase.right;
      });
      _next = Timer(const Duration(milliseconds: 550), _advance);
    } else {
      setState(() {
        _phase = _Phase.wrong;
        _shake++;
      });
    }
  }

  void _advance() {
    if (!mounted) return;
    if (_idx + 1 >= questions.length) {
      _finish();
      return;
    }
    setState(() {
      _idx++;
      _input = '';
      _phase = _Phase.answer;
      _showHint = false;
    });
  }

  void _finish() {
    _watch.stop();
    final store = StoreScope.read(context);
    final prevBest = store.bestSeconds(widget.child.id, level.no);
    final r = store.addResult(
      childId: widget.child.id,
      level: level.no,
      topic: level.topic,
      correct: _correct,
      total: questions.length,
      seconds: _watch.elapsed.inSeconds,
    );
    Navigator.of(context).pushReplacement(MaterialPageRoute(
        builder: (_) => SheetEndScreen(child: widget.child, result: r, previousBest: prevBest)));
  }

  Future<void> _pause() async {
    _watch.stop();
    StoreScope.read(context).log('jeda');
    final leave = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: PM.krem,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Pinci(size: 96, mood: PinciMood.empati),
            const SizedBox(height: 12),
            Text('Kita jeda dulu.', style: PMFont.baloo(24)),
            const SizedBox(height: 16),
            PmButton('Lanjut latihan', onPressed: () => Navigator.of(ctx).pop(false)),
            const SizedBox(height: 10),
            PmButton('Berhenti dulu', outline: true, onPressed: () => Navigator.of(ctx).pop(true)),
          ],
        ),
      ),
    );
    if (!mounted) return;
    if (leave == true) {
      Navigator.of(context).pop();
    } else {
      _watch.start();
    }
  }

  @override
  Widget build(BuildContext context) {
    final sz = _sz;
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _pause();
      },
      child: Scaffold(
        backgroundColor: PM.krem,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
            child: Column(
              children: [
                Row(
                  children: [
                    _SmallButton(icon: Icons.pause_rounded, label: 'Jeda', onTap: _pause),
                    const Spacer(),
                    _SmallButton(
                      icon: Icons.lightbulb_outline_rounded,
                      label: 'Petunjuk',
                      onTap: () {
                        setState(() => _showHint = !_showHint);
                        StoreScope.read(context).log('petunjuk');
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SheetProgress(_idx + 1, questions.length),
                Expanded(
                  child: Stack(
                    children: [
                      Center(
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('${_q.text} =',
                                  style: PMFont.andika(sz.soal + 12)),
                              const SizedBox(height: 16),
                              ShakeBox(trigger: _shake, child: _answerBox(sz)),
                              const SizedBox(height: 14),
                              if (_phase == _Phase.wrong)
                                ShakeBox(
                                  trigger: _shake,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16, vertical: 12),
                                    decoration: BoxDecoration(
                                      color: PM.koralBg,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: PM.koral, width: 2),
                                    ),
                                    child: Text('Hampir! Jawabannya ${_q.answer}.',
                                        style: PMFont.andika(sz.petunjuk + 2)),
                                  ),
                                )
                              else if (_showHint)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: PM.langitBg,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      SpeakerButton(level.hint,
                                          size: 36, bg: Colors.white, fg: PM.tinta),
                                      const SizedBox(width: 10),
                                      Flexible(
                                          child: Text(level.hint,
                                              style: PMFont.andika(sz.petunjuk))),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                      const Positioned(
                        right: 0,
                        bottom: 0,
                        child: Pinci(size: 48, mood: PinciMood.kecil),
                      ),
                    ],
                  ),
                ),
                if (_phase == _Phase.wrong)
                  PmButton('Lanjut', height: sz.tombolUtama, onPressed: _advance)
                else
                  _NumberPad(
                    keyHeight: sz.kecil ? 72 : 64,
                    gap: sz.jarakTombol + 2,
                    onDigit: _press,
                    onBackspace: _backspace,
                    onCheck: _input.isEmpty ? null : _check,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _answerBox(GradeSizes sz) {
    final right = _phase == _Phase.right;
    final wrong = _phase == _Phase.wrong;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      constraints: const BoxConstraints(minWidth: 150),
      height: 88,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: right ? PM.gudangBg : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
            color: right ? PM.benar : (wrong ? PM.koral : PM.hijauDaun), width: 3),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(_input.isEmpty ? '?' : _input,
              style: PMFont.andika(sz.soal + 12,
                  color: _input.isEmpty ? const Color(0xFFC9C0AE) : PM.tinta)),
          if (right) ...[
            const SizedBox(width: 8),
            const Icon(Icons.check_rounded, color: PM.benar, size: 40),
          ],
        ],
      ),
    );
  }
}

class _SmallButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _SmallButton({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: SizedBox(
          height: 48,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 20, color: PM.tinta),
                const SizedBox(width: 6),
                Text(label, style: PMFont.andika(16)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Papan angka 3 × 4: 1–9, Hapus, 0, Cek.
class _NumberPad extends StatelessWidget {
  final double keyHeight;
  final double gap;
  final ValueChanged<String> onDigit;
  final VoidCallback onBackspace;
  final VoidCallback? onCheck;

  const _NumberPad({
    required this.keyHeight,
    required this.gap,
    required this.onDigit,
    required this.onBackspace,
    required this.onCheck,
  });

  @override
  Widget build(BuildContext context) {
    Widget key(String label, {VoidCallback? onTap, Color bg = Colors.white, Widget? child}) {
      return Expanded(
        child: Semantics(
          button: true,
          label: label,
          excludeSemantics: true,
          child: Material(
            color: bg,
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: onTap,
              child: Container(
                height: keyHeight,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: bg == Colors.white
                      ? Border.all(color: const Color(0xFFEDE3CF))
                      : null,
                ),
                child: child ?? Text(label, style: PMFont.andika(30)),
              ),
            ),
          ),
        ),
      );
    }

    Widget row(List<Widget> keys) => Padding(
          padding: EdgeInsets.only(top: gap),
          child: Row(children: [keys[0], SizedBox(width: gap), keys[1], SizedBox(width: gap), keys[2]]),
        );

    Widget digit(int n) => key('$n', onTap: () => onDigit('$n'));

    return Column(
      children: [
        row([digit(1), digit(2), digit(3)]),
        row([digit(4), digit(5), digit(6)]),
        row([digit(7), digit(8), digit(9)]),
        row([
          key('Hapus',
              onTap: onBackspace,
              bg: const Color(0xFFF1E9D8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.backspace_outlined, color: PM.tinta, size: 22),
                  const SizedBox(width: 6),
                  Text('Hapus', style: PMFont.andika(17)),
                ],
              )),
          digit(0),
          key('Cek',
              onTap: onCheck,
              bg: onCheck == null ? PM.nonaktif : PM.hijauDaun,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_rounded,
                      color: onCheck == null ? PM.nonaktifTeks : PM.tinta, size: 26),
                  const SizedBox(width: 4),
                  Text('Cek',
                      style: PMFont.andika(18,
                          weight: FontWeight.w700,
                          color: onCheck == null ? PM.nonaktifTeks : PM.tinta)),
                ],
              )),
        ]),
      ],
    );
  }
}
