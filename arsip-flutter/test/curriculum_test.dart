import 'package:flutter_test/flutter_test.dart';
import 'package:pintar_main/data/curriculum.dart';
import 'package:pintar_main/data/store.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  test('setiap level membuat 20 soal dengan jawaban benar', () {
    for (final level in Curriculum.levels) {
      final sheet = level.sheet(count: 20, seed: 1);
      expect(sheet.length, 20, reason: 'Level ${level.no}');
      for (final q in sheet) {
        expect(q.answer, greaterThanOrEqualTo(0), reason: q.text);
      }
    }
  });

  test('perkalian level 3 benar', () {
    final q = Curriculum.level(3).sheet(count: 5, seed: 2);
    for (final x in q) {
      final parts = x.text.split(' × ').map(int.parse).toList();
      expect(x.answer, parts[0] * parts[1]);
    }
  });

  test('hasil latihan tersimpan dan rekor terbaca', () async {
    SharedPreferences.setMockInitialValues({});
    final store = AppStore();
    await store.load();
    expect(store.children.length, 3);

    store.addResult(
        childId: 'c1', level: 3, topic: 'perkalian', correct: 18, total: 20, seconds: 91);
    final r2 = store.addResult(
        childId: 'c1', level: 3, topic: 'perkalian', correct: 19, total: 20, seconds: 72);

    expect(store.bestSeconds('c1', 3, excludeId: r2.id), 91);
    expect(store.todayResults('c1').length, 2);
    final w = store.weekStats('c1');
    expect(w.days, 1);
    expect(w.sheets, 2);
  });
}
