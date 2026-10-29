import 'dart:convert';
import 'dart:math';

import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'curriculum.dart';
import 'models.dart';

/// Penyimpanan utama aplikasi. Semua data disimpan di HP (shared_preferences).
/// Tahap berikutnya: data yang sama dikirim ke Firebase saat ada internet.
class AppStore extends ChangeNotifier {
  static const _key = 'pm_state_v1';

  final List<Child> children = [];
  final List<ChatMessage> messages = [];
  final List<SheetResult> results = [];
  final Map<String, TimeSettings> settings = {};
  final List<AppEvent> events = [];

  String? currentChildId;
  String? parentPin;
  String parentName = 'Ayah';
  DateTime parentLastSeen = DateTime.fromMillisecondsSinceEpoch(0);
  DateTime childLastSeenMessages = DateTime.fromMillisecondsSinceEpoch(0);
  bool loaded = false;

  SharedPreferences? _prefs;
  final _rand = Random();

  // ---------- Muat & simpan ----------

  Future<void> load() async {
    _prefs = await SharedPreferences.getInstance();
    final raw = _prefs!.getString(_key);
    if (raw == null) {
      _seed();
      await _save();
    } else {
      try {
        _fromJson(jsonDecode(raw));
      } catch (_) {
        _seed();
      }
    }
    loaded = true;
    notifyListeners();
  }

  void _seed() {
    children
      ..clear()
      ..addAll([
        Child(id: 'c1', name: 'Aisyah', animal: 'gajah', grade: 4, level: 3),
        Child(id: 'c2', name: 'Rafli', animal: 'harimau', grade: 6, level: 4),
        Child(id: 'c3', name: 'Nisa', animal: 'penyu', grade: 1, level: 1),
      ]);
    for (final c in children) {
      settings[c.id] = TimeSettings(studyMinutes: c.grade <= 2 ? 20 : 40);
    }
    messages.add(ChatMessage(
      id: _id(),
      childId: 'c1',
      from: 'parent',
      text: 'Ayah bangga kamu tidak menyerah di ×8',
      at: DateTime.now().subtract(const Duration(hours: 2)),
    ));
  }

  Map<String, dynamic> _toJson() => {
        'children': children.map((c) => c.toJson()).toList(),
        'messages': messages.map((m) => m.toJson()).toList(),
        'results': results.map((r) => r.toJson()).toList(),
        'settings': settings.map((k, v) => MapEntry(k, v.toJson())),
        'events': events.map((e) => e.toJson()).toList(),
        'currentChildId': currentChildId,
        'parentPin': parentPin,
        'parentName': parentName,
        'parentLastSeen': parentLastSeen.toIso8601String(),
        'childLastSeenMessages': childLastSeenMessages.toIso8601String(),
      };

  void _fromJson(Map<String, dynamic> j) {
    children
      ..clear()
      ..addAll((j['children'] as List).map((e) => Child.fromJson(e)));
    messages
      ..clear()
      ..addAll((j['messages'] as List).map((e) => ChatMessage.fromJson(e)));
    results
      ..clear()
      ..addAll((j['results'] as List).map((e) => SheetResult.fromJson(e)));
    settings
      ..clear()
      ..addAll((j['settings'] as Map<String, dynamic>)
          .map((k, v) => MapEntry(k, TimeSettings.fromJson(v))));
    events
      ..clear()
      ..addAll(((j['events'] as List?) ?? []).map((e) => AppEvent.fromJson(e)));
    currentChildId = j['currentChildId'];
    parentPin = j['parentPin'];
    parentName = j['parentName'] ?? 'Ayah';
    parentLastSeen = DateTime.tryParse(j['parentLastSeen'] ?? '') ??
        DateTime.fromMillisecondsSinceEpoch(0);
    childLastSeenMessages = DateTime.tryParse(j['childLastSeenMessages'] ?? '') ??
        DateTime.fromMillisecondsSinceEpoch(0);
  }

  Future<void> _save() async {
    await _prefs?.setString(_key, jsonEncode(_toJson()));
  }

  void _changed() {
    notifyListeners();
    _save();
  }

  String _id() =>
      '${DateTime.now().microsecondsSinceEpoch}${_rand.nextInt(999)}';

  // ---------- Catatan pemakaian ----------

  void log(String name, [Map<String, dynamic> data = const {}]) {
    events.add(AppEvent(name, DateTime.now(), {
      if (currentChildId != null) 'child': currentChildId,
      ...data,
    }));
    if (events.length > 2000) events.removeRange(0, events.length - 2000);
    _save();
  }

  // ---------- Anak ----------

  Child? get currentChild {
    for (final c in children) {
      if (c.id == currentChildId) return c;
    }
    return null;
  }

  Child childById(String id) => children.firstWhere((c) => c.id == id);

  void selectChild(String id) {
    currentChildId = id;
    log('pilih_profil');
    _changed();
  }

  void updateChild(Child c) {
    _changed();
    log('ubah_anak', {'id': c.id});
  }

  void addChild(String name, String animal, int grade) {
    final c = Child(
        id: _id(),
        name: name,
        animal: animal,
        grade: grade,
        level: Curriculum.defaultLevelForGrade(grade));
    children.add(c);
    settings[c.id] = TimeSettings(studyMinutes: grade <= 2 ? 20 : 40);
    _changed();
  }

  TimeSettings settingsFor(String childId) =>
      settings.putIfAbsent(childId, () => TimeSettings());

  void saveSettings(String childId, TimeSettings s) {
    settings[childId] = s;
    log('atur_waktu', {'child': childId, ...s.toJson()});
    _changed();
  }

  // ---------- PIN orang tua ----------

  void setPin(String pin) {
    parentPin = pin;
    _changed();
  }

  void markParentSeen() {
    parentLastSeen = DateTime.now();
    _changed();
  }

  // ---------- Pesan ----------

  List<ChatMessage> messagesFor(String childId) =>
      messages.where((m) => m.childId == childId).toList()
        ..sort((a, b) => a.at.compareTo(b.at));

  ChatMessage? latestParentMessage(String childId) {
    final list = messagesFor(childId).where((m) => m.from == 'parent').toList();
    return list.isEmpty ? null : list.last;
  }

  bool childHasUnread(String childId) => messagesFor(childId)
      .any((m) => m.from == 'parent' && m.at.isAfter(childLastSeenMessages));

  void markChildSeenMessages() {
    childLastSeenMessages = DateTime.now();
    _changed();
  }

  int parentUnread(String childId) => messagesFor(childId)
      .where((m) => m.from != 'parent' && m.at.isAfter(parentLastSeen))
      .length;

  void sendParentMessage(String childId, String text) {
    messages.add(ChatMessage(
        id: _id(), childId: childId, from: 'parent', text: text, at: DateTime.now()));
    log('pesan_ortu', {'child': childId});
    _changed();
  }

  void sendSticker(String childId, String emoji, String label) {
    messages.add(ChatMessage(
        id: _id(),
        childId: childId,
        from: 'child',
        text: label,
        sticker: emoji,
        at: DateTime.now()));
    log('stiker_anak', {'label': label});
    _changed();
  }

  // ---------- Hasil latihan ----------

  SheetResult? resultById(String? id) {
    if (id == null) return null;
    for (final r in results) {
      if (r.id == id) return r;
    }
    return null;
  }

  List<SheetResult> resultsFor(String childId) =>
      results.where((r) => r.childId == childId).toList()
        ..sort((a, b) => a.at.compareTo(b.at));

  /// Waktu terbaik sebelumnya (detik) untuk level yang sama.
  int? bestSeconds(String childId, int level, {String? excludeId}) {
    int? best;
    for (final r in results) {
      if (r.childId != childId || r.level != level || r.id == excludeId) continue;
      if (best == null || r.seconds < best) best = r.seconds;
    }
    return best;
  }

  SheetResult addResult({
    required String childId,
    required int level,
    required String topic,
    required int correct,
    required int total,
    required int seconds,
  }) {
    final r = SheetResult(
      id: _id(),
      childId: childId,
      at: DateTime.now(),
      level: level,
      topic: topic,
      correct: correct,
      total: total,
      seconds: seconds,
    );
    results.add(r);
    messages.add(ChatMessage(
      id: _id(),
      childId: childId,
      from: 'system',
      text: 'Lembar selesai',
      at: r.at,
      resultId: r.id,
    ));
    log('lembar_selesai', {
      'level': level,
      'benar': correct,
      'total': total,
      'detik': seconds,
    });
    _changed();
    return r;
  }

  void setMood(SheetResult r, String mood) {
    r.mood = mood;
    log('perasaan', {'mood': mood});
    _changed();
  }

  // ---------- Ringkasan ----------

  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);

  List<SheetResult> todayResults(String childId) {
    final today = _day(DateTime.now());
    return resultsFor(childId).where((r) => _day(r.at) == today).toList();
  }

  int studiedSecondsToday(String childId) =>
      todayResults(childId).fold(0, (a, r) => a + r.seconds);

  bool practicedToday(String childId) => todayResults(childId).isNotEmpty;

  bool reachedDailyLimit(String childId) =>
      studiedSecondsToday(childId) >= settingsFor(childId).studyMinutes * 60;

  DateTime? lastActivity(String childId) {
    final m = messagesFor(childId);
    return m.isEmpty ? null : m.last.at;
  }

  /// Ringkasan 7 hari terakhir dibanding 7 hari sebelumnya.
  WeekStats weekStats(String childId) {
    final now = DateTime.now();
    final start = _day(now).subtract(const Duration(days: 6));
    final prevStart = start.subtract(const Duration(days: 7));
    final all = resultsFor(childId);
    final week = all.where((r) => !r.at.isBefore(start)).toList();
    final prev =
        all.where((r) => !r.at.isBefore(prevStart) && r.at.isBefore(start)).toList();

    double spq(List<SheetResult> l) {
      final q = l.fold<int>(0, (a, r) => a + r.total);
      final s = l.fold<int>(0, (a, r) => a + r.seconds);
      return q == 0 ? 0 : s / q;
    }

    double acc(List<SheetResult> l) {
      final q = l.fold<int>(0, (a, r) => a + r.total);
      final c = l.fold<int>(0, (a, r) => a + r.correct);
      return q == 0 ? 0 : c / q;
    }

    final days = week.map((r) => _day(r.at)).toSet().length;
    return WeekStats(
      start: start,
      end: _day(now),
      days: days,
      sheets: week.length,
      secPerQ: spq(week),
      prevSecPerQ: spq(prev),
      accuracy: acc(week),
      prevAccuracy: acc(prev),
    );
  }

  /// Detik per soal untuk 8 minggu terakhir (paling lama dulu). null = tidak latihan.
  List<double?> speedLast8Weeks(String childId) {
    final now = _day(DateTime.now());
    final all = resultsFor(childId);
    final out = <double?>[];
    for (var w = 7; w >= 0; w--) {
      final end = now.subtract(Duration(days: 7 * w));
      final start = end.subtract(const Duration(days: 6));
      final l = all
          .where((r) => !_day(r.at).isBefore(start) && !_day(r.at).isAfter(end))
          .toList();
      final q = l.fold<int>(0, (a, r) => a + r.total);
      final s = l.fold<int>(0, (a, r) => a + r.seconds);
      out.add(q == 0 ? null : s / q);
    }
    return out;
  }

  /// Topik yang perlu bimbingan: 3 lembar terakhir di satu level rata-rata < 70% benar.
  List<GuidanceItem> guidance() {
    final out = <GuidanceItem>[];
    for (final c in children) {
      final byLevel = <int, List<SheetResult>>{};
      for (final r in resultsFor(c.id)) {
        byLevel.putIfAbsent(r.level, () => []).add(r);
      }
      byLevel.forEach((level, list) {
        final last = list.length > 3 ? list.sublist(list.length - 3) : list;
        if (last.length < 2) return;
        final acc = last.fold<double>(0, (a, r) => a + r.accuracy) / last.length;
        if (acc < 0.5) {
          out.add(GuidanceItem(c, level, acc, teacher: true));
        } else if (acc < 0.7) {
          out.add(GuidanceItem(c, level, acc, teacher: false));
        }
      });
    }
    return out;
  }

  /// Hapus semua data (untuk pengujian).
  Future<void> resetAll() async {
    children.clear();
    messages.clear();
    results.clear();
    settings.clear();
    events.clear();
    currentChildId = null;
    parentPin = null;
    _seed();
    _changed();
  }
}

class WeekStats {
  final DateTime start;
  final DateTime end;
  final int days;
  final int sheets;
  final double secPerQ;
  final double prevSecPerQ;
  final double accuracy;
  final double prevAccuracy;

  WeekStats({
    required this.start,
    required this.end,
    required this.days,
    required this.sheets,
    required this.secPerQ,
    required this.prevSecPerQ,
    required this.accuracy,
    required this.prevAccuracy,
  });
}

class GuidanceItem {
  final Child child;
  final int level;
  final double accuracy;
  final bool teacher;
  GuidanceItem(this.child, this.level, this.accuracy, {required this.teacher});
}

/// Memberi akses AppStore ke seluruh layar.
class StoreScope extends InheritedNotifier<AppStore> {
  const StoreScope({super.key, required AppStore store, required super.child})
      : super(notifier: store);

  static AppStore of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<StoreScope>()!.notifier!;

  static AppStore read(BuildContext context) =>
      context.getInheritedWidgetOfExactType<StoreScope>()!.notifier!;
}
