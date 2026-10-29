import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'data/store.dart';
import 'screens/child/child_shell.dart';
import 'screens/child/welcome.dart';
import 'theme/pm_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  final store = AppStore();
  await store.load();
  store.log('buka_aplikasi');
  runApp(PintarMainApp(store: store));
}

class PintarMainApp extends StatelessWidget {
  final AppStore store;
  const PintarMainApp({required this.store});

  @override
  Widget build(BuildContext context) {
    return StoreScope(
      store: store,
      child: MaterialApp(
        title: 'Pintar Main',
        debugShowCheckedModeBanner: false,
        theme: buildTheme(),
        home: store.currentChild == null
            ? const WelcomeScreen()
            : const ChildShell(),
      ),
    );
  }
}
