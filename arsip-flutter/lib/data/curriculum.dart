import 'dart:math';

/// Satu soal hitung.
class Question {
  final String text; // contoh: "7 × 8"
  final int answer;
  const Question(this.text, this.answer);
}

/// Satu langkah contoh di layar Jurus.
class JurusStep {
  final String text;
  final String? highlight;
  const JurusStep(this.text, {this.highlight});
}

/// Level Lancar Matematika. Isi ini contoh awal — sesuaikan dengan kurikulum.
class MathLevel {
  final int no;
  final String title;
  final String topic;
  final String jurus;
  final List<JurusStep> steps;
  final String note;
  final String hint;
  final String parentTip;
  final Question Function(Random r) make;

  const MathLevel({
    required this.no,
    required this.title,
    required this.topic,
    required this.jurus,
    required this.steps,
    required this.note,
    required this.hint,
    required this.parentTip,
    required this.make,
  });

  List<Question> sheet({int count = 20, int? seed}) {
    final r = Random(seed);
    final out = <Question>[];
    final seen = <String>{};
    var guard = 0;
    while (out.length < count && guard < 500) {
      guard++;
      final q = make(r);
      if (seen.contains(q.text) && guard < 400) continue;
      seen.add(q.text);
      out.add(q);
    }
    return out;
  }
}

class Curriculum {
  static final levels = <MathLevel>[
    MathLevel(
      no: 1,
      title: 'Penjumlahan sampai 20',
      topic: 'penjumlahan',
      jurus: 'genapkan ke 10 dulu.',
      steps: const [
        JurusStep('8 + 5'),
        JurusStep('8 + 2 = 10', highlight: '2'),
        JurusStep('10 + 3 = 13', highlight: '13'),
      ],
      note: '5 dipecah jadi 2 dan 3.',
      hint: 'Genapkan dulu ke 10, baru tambahkan sisanya.',
      parentTip: 'Saat belanja, ajak anak menggenapkan harga ke puluhan terdekat.',
      make: (r) {
        final a = 6 + r.nextInt(4); // 6..9
        final b = 3 + r.nextInt(7); // 3..9
        return Question('$a + $b', a + b);
      },
    ),
    MathLevel(
      no: 2,
      title: 'Pengurangan sampai 20',
      topic: 'pengurangan',
      jurus: 'turun ke 10 dulu.',
      steps: const [
        JurusStep('14 − 6'),
        JurusStep('14 − 4 = 10', highlight: '4'),
        JurusStep('10 − 2 = 8', highlight: '8'),
      ],
      note: '6 dipecah jadi 4 dan 2.',
      hint: 'Kurangi dulu sampai 10, lalu kurangi sisanya.',
      parentTip: 'Tanyakan kembalian saat belanja kecil, misalnya 15 ribu dikurangi 7 ribu.',
      make: (r) {
        final a = 11 + r.nextInt(8); // 11..18
        final b = 3 + r.nextInt(7);
        final bb = b >= a ? a - 2 : b;
        return Question('$a − $bb', a - bb);
      },
    ),
    MathLevel(
      no: 3,
      title: 'Perkalian 6 sampai 9',
      topic: 'perkalian',
      jurus: 'pecah jadi 5 dan sisanya.',
      steps: const [
        JurusStep('7 × 8'),
        JurusStep('5 × 8 = 40', highlight: '5'),
        JurusStep('2 × 8 = 16', highlight: '2'),
        JurusStep('40 + 16 = 56', highlight: '56'),
      ],
      note: '7 dipecah jadi 5 dan 2.',
      hint: 'Kalikan 5 dulu, lalu tambahkan sisanya.',
      parentTip: 'Tanyakan perkalian ringan saat di jalan, misalnya jumlah roda 7 becak.',
      make: (r) {
        final a = 6 + r.nextInt(4);
        final b = 2 + r.nextInt(8);
        return Question('$a × $b', a * b);
      },
    ),
    MathLevel(
      no: 4,
      title: 'Perkalian campur 2 sampai 10',
      topic: 'perkalian',
      jurus: 'balik urutannya kalau lebih mudah.',
      steps: const [
        JurusStep('9 × 3'),
        JurusStep('3 × 9 sama dengan 9 × 3', highlight: '3 × 9'),
        JurusStep('9 + 9 + 9 = 27', highlight: '27'),
      ],
      note: 'Urutan perkalian boleh dibalik.',
      hint: 'Pilih urutan yang paling mudah kamu hitung.',
      parentTip: 'Main tebak cepat perkalian 5 soal sebelum tidur.',
      make: (r) {
        final a = 2 + r.nextInt(9);
        final b = 2 + r.nextInt(9);
        return Question('$a × $b', a * b);
      },
    ),
    MathLevel(
      no: 5,
      title: 'Pembagian dasar',
      topic: 'pembagian',
      jurus: 'ingat perkaliannya.',
      steps: const [
        JurusStep('56 : 8'),
        JurusStep('8 × ? = 56', highlight: '?'),
        JurusStep('8 × 7 = 56, jadi 7', highlight: '7'),
      ],
      note: 'Pembagian adalah perkalian yang dibalik.',
      hint: 'Cari angka yang dikali pembaginya jadi hasil itu.',
      parentTip: 'Bagi kue atau buah sama rata, lalu tanyakan masing-masing dapat berapa.',
      make: (r) {
        final b = 2 + r.nextInt(8);
        final c = 2 + r.nextInt(8);
        return Question('${b * c} : $b', c);
      },
    ),
  ];

  static MathLevel level(int no) =>
      levels.firstWhere((l) => l.no == no, orElse: () => levels.first);

  static int defaultLevelForGrade(int grade) {
    if (grade <= 2) return 1;
    if (grade == 3) return 2;
    if (grade == 4) return 3;
    return 4;
  }
}
