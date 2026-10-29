import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../data/store.dart';
import '../../theme/pm_theme.dart';

/// Catatan pengembang: ringkasan pemakaian untuk pengembangan sistem.
/// Nanti data yang sama dikirim ke Firebase supaya bisa dipantau dari jauh.
class DevLogScreen extends StatelessWidget {
  const DevLogScreen();

  @override
  Widget build(BuildContext context) {
    final store = StoreScope.of(context);
    final counts = <String, int>{};
    for (final e in store.events) {
      counts[e.name] = (counts[e.name] ?? 0) + 1;
    }
    final sorted = counts.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final recent = store.events.reversed.take(100).toList();

    return Scaffold(
      backgroundColor: PM.abu,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        title: Text('Catatan pengembang', style: PMFont.baloo(22, weight: FontWeight.w700)),
        actions: [
          IconButton(
            tooltip: 'Salin semua catatan',
            icon: const Icon(Icons.copy_rounded),
            onPressed: () async {
              final text = store.events.map((e) => e.toString()).join('\n');
              await Clipboard.setData(ClipboardData(text: text));
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Catatan disalin. Tempel ke WhatsApp atau Claude.')));
              }
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('${store.events.length} kejadian tercatat · ${store.results.length} lembar selesai',
              style: PMFont.nunito(15, weight: FontWeight.w700)),
          const SizedBox(height: 12),
          Container(
            decoration:
                BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                for (final e in sorted)
                  ListTile(
                    dense: true,
                    title: Text(e.key, style: PMFont.nunito(14)),
                    trailing: Text('${e.value}',
                        style: PMFont.nunito(14, weight: FontWeight.w800)),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text('Terbaru', style: PMFont.nunito(15, weight: FontWeight.w700)),
          const SizedBox(height: 8),
          for (final e in recent)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(e.toString(),
                  style: PMFont.nunito(12, color: PM.teksPudar)),
            ),
          const SizedBox(height: 24),
          OutlinedButton(
            onPressed: () async {
              final ok = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Hapus semua data?'),
                  content: const Text(
                      'Semua anak, hasil latihan, pesan, dan catatan akan dihapus dan diganti data contoh.'),
                  actions: [
                    TextButton(
                        onPressed: () => Navigator.of(ctx).pop(false),
                        child: const Text('Batal')),
                    TextButton(
                        onPressed: () => Navigator.of(ctx).pop(true),
                        child: const Text('Hapus')),
                  ],
                ),
              );
              if (ok == true) await store.resetAll();
            },
            child: const Text('Hapus semua data (untuk uji coba)'),
          ),
        ],
      ),
    );
  }
}
