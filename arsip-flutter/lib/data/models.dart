import 'dart:convert';

/// Hewan avatar anak (brief: gajah, harimau, penyu, rangkong).
class Animal {
  final String id;
  final String emoji;
  final String nama;
  final int bg; // warna latar lembut (ARGB)
  const Animal(this.id, this.emoji, this.nama, this.bg);

  static const all = [
    Animal('gajah', '🐘', 'Gajah', 0xFFE6F0FF),
    Animal('harimau', '🐯', 'Harimau', 0xFFFFF0D9),
    Animal('penyu', '🐢', 'Penyu', 0xFFE4F4EB),
    Animal('rangkong', '🐦', 'Rangkong', 0xFFF1ECFA),
  ];

  static Animal byId(String id) =>
      all.firstWhere((a) => a.id == id, orElse: () => all.first);
}

class Child {
  final String id;
  String name;
  String animal;
  int grade;
  int level;

  Child({
    required this.id,
    required this.name,
    required this.animal,
    required this.grade,
    required this.level,
  });

  Animal get avatar => Animal.byId(animal);

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'animal': animal, 'grade': grade, 'level': level};

  factory Child.fromJson(Map<String, dynamic> j) => Child(
        id: j['id'],
        name: j['name'],
        animal: j['animal'],
        grade: j['grade'],
        level: j['level'] ?? 1,
      );
}

/// Pesan di Ruang anak. from: 'parent' | 'child' | 'system'.
class ChatMessage {
  final String id;
  final String childId;
  final String from;
  final String text;
  final String? sticker;
  final DateTime at;
  final String? resultId;

  ChatMessage({
    required this.id,
    required this.childId,
    required this.from,
    required this.text,
    this.sticker,
    required this.at,
    this.resultId,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'childId': childId,
        'from': from,
        'text': text,
        'sticker': sticker,
        'at': at.toIso8601String(),
        'resultId': resultId,
      };

  factory ChatMessage.fromJson(Map<String, dynamic> j) => ChatMessage(
        id: j['id'],
        childId: j['childId'],
        from: j['from'],
        text: j['text'] ?? '',
        sticker: j['sticker'],
        at: DateTime.parse(j['at']),
        resultId: j['resultId'],
      );
}

/// Hasil satu lembar latihan.
class SheetResult {
  final String id;
  final String childId;
  final DateTime at;
  final int level;
  final String topic;
  final int correct;
  final int total;
  final int seconds;
  String? mood;

  SheetResult({
    required this.id,
    required this.childId,
    required this.at,
    required this.level,
    required this.topic,
    required this.correct,
    required this.total,
    required this.seconds,
    this.mood,
  });

  double get secondsPerQuestion => total == 0 ? 0 : seconds / total;
  double get accuracy => total == 0 ? 0 : correct / total;

  Map<String, dynamic> toJson() => {
        'id': id,
        'childId': childId,
        'at': at.toIso8601String(),
        'level': level,
        'topic': topic,
        'correct': correct,
        'total': total,
        'seconds': seconds,
        'mood': mood,
      };

  factory SheetResult.fromJson(Map<String, dynamic> j) => SheetResult(
        id: j['id'],
        childId: j['childId'],
        at: DateTime.parse(j['at']),
        level: j['level'],
        topic: j['topic'] ?? '',
        correct: j['correct'],
        total: j['total'],
        seconds: j['seconds'],
        mood: j['mood'],
      );
}

class TimeSettings {
  int studyMinutes;
  int gameMinutes;
  bool gameAfterPractice;
  bool quietEnabled;
  int quietHour;

  TimeSettings({
    this.studyMinutes = 40,
    this.gameMinutes = 30,
    this.gameAfterPractice = true,
    this.quietEnabled = true,
    this.quietHour = 21,
  });

  Map<String, dynamic> toJson() => {
        'studyMinutes': studyMinutes,
        'gameMinutes': gameMinutes,
        'gameAfterPractice': gameAfterPractice,
        'quietEnabled': quietEnabled,
        'quietHour': quietHour,
      };

  factory TimeSettings.fromJson(Map<String, dynamic> j) => TimeSettings(
        studyMinutes: j['studyMinutes'] ?? 40,
        gameMinutes: j['gameMinutes'] ?? 30,
        gameAfterPractice: j['gameAfterPractice'] ?? true,
        quietEnabled: j['quietEnabled'] ?? true,
        quietHour: j['quietHour'] ?? 21,
      );
}

/// Catatan kejadian untuk memantau pemakaian (nanti dikirim ke Firebase).
class AppEvent {
  final String name;
  final DateTime at;
  final Map<String, dynamic> data;
  AppEvent(this.name, this.at, this.data);

  Map<String, dynamic> toJson() =>
      {'name': name, 'at': at.toIso8601String(), 'data': data};

  factory AppEvent.fromJson(Map<String, dynamic> j) => AppEvent(
      j['name'], DateTime.parse(j['at']), Map<String, dynamic>.from(j['data'] ?? {}));

  @override
  String toString() => '${at.toIso8601String()}  $name  ${jsonEncode(data)}';
}
