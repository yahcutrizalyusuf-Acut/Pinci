import 'package:flutter/material.dart';

import '../../data/store.dart';
import '../../theme/pm_theme.dart';
import 'parent_shell.dart';

/// Masuk ke mode orang tua lewat PIN 4 angka. Pertama kali: buat PIN.
void openParentMode(BuildContext context) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PinScreen()));
}

class PinScreen extends StatefulWidget {
  const PinScreen();
  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen> {
  String _pin = '';
  String? _first; // untuk konfirmasi saat membuat PIN
  String? _message;

  void _tap(String d) {
    if (_pin.length >= 4) return;
    setState(() {
      _pin += d;
      _message = null;
    });
    if (_pin.length == 4) _done();
  }

  void _done() {
    final store = StoreScope.read(context);
    if (store.parentPin == null) {
      if (_first == null) {
        setState(() {
          _first = _pin;
          _pin = '';
        });
      } else if (_first == _pin) {
        store.setPin(_pin);
        _enter();
      } else {
        setState(() {
          _first = null;
          _pin = '';
          _message = 'PIN tidak sama. Coba buat lagi.';
        });
      }
    } else if (store.parentPin == _pin) {
      _enter();
    } else {
      setState(() {
        _pin = '';
        _message = 'PIN belum cocok. Coba lagi.';
      });
    }
  }

  void _enter() {
    StoreScope.read(context).log('masuk_mode_ortu');
    Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const ParentShell()));
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final creating = store.parentPin == null;
    final title = creating
        ? (_first == null ? 'Buat PIN orang tua' : 'Ulangi PIN')
        : 'Masukkan PIN orang tua';

    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        title: Text('Mode orang tua', style: PMFont.baloo(22, weight: FontWeight.w700)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 24),
              Text(title, style: PMFont.nunito(20, weight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(
                creating
                    ? 'PIN ini menjaga supaya anak tidak masuk ke mode orang tua.'
                    : '4 angka',
                textAlign: TextAlign.center,
                style: PMFont.nunito(15, color: PM.teksPudar),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  4,
                  (i) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 10),
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: i < _pin.length ? PM.hijauTua : Colors.transparent,
                      border: Border.all(color: PM.hijauTua, width: 2),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 24,
                child: _message == null
                    ? null
                    : Text(_message!, style: PMFont.nunito(15, color: PM.biTeks)),
              ),
              const Spacer(),
              for (final row in [
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['', '0', '<']
              ])
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: [
                      for (final k in row)
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 5),
                            child: k.isEmpty
                                ? const SizedBox(height: 56)
                                : Material(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                    child: InkWell(
                                      borderRadius: BorderRadius.circular(14),
                                      onTap: () {
                                        if (k == '<') {
                                          if (_pin.isNotEmpty) {
                                            setState(() => _pin =
                                                _pin.substring(0, _pin.length - 1));
                                          }
                                        } else {
                                          _tap(k);
                                        }
                                      },
                                      child: SizedBox(
                                        height: 56,
                                        child: Center(
                                          child: k == '<'
                                              ? Semantics(
                                                  label: 'Hapus',
                                                  child: const Icon(Icons.backspace_outlined))
                                              : Text(k, style: PMFont.nunito(24)),
                                        ),
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
