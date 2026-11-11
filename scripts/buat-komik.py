"""
Membangun 12 naskah komik (tingkat 3 dan 4, unit 1–6), menambah kosakata komik, Bunyi Hari Ini, dan gerakan per unit.
Sumber naskah ada di berkas ini (data tertulis tangan, status belum_diperiksa). Jalankan: python3 scripts/buat-komik.py
Lalu periksa: npx tsx scripts/periksa-komik.ts
"""
import json
import os
import re

AKAR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PAKET = os.path.join(AKAR, 'assets', 'paket')
BP = 'belum_diperiksa'


def baca(nama):
    with open(os.path.join(PAKET, nama), encoding='utf-8') as f:
        return json.load(f)


def tulis(nama, data):
    with open(os.path.join(PAKET, nama), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


# ---------- kata komik (kolom terpisah `kataKomik`; kosakata inti 8–10 kata tidak diubah) ----------
TAMBAH_KOSAKATA = {
    't3-u01': [
        ('hi', 'hai', '👋'), ('I am', 'aku, saya', '🙋'), ('how are you', 'apa kabar', '🙂'), ('fine', 'baik', '👍'),
        ('please', 'tolong, silakan', '🤝'), ('thank you', 'terima kasih', '💐'), ('sorry', 'maaf', '😔'),
        ('goodbye', 'sampai jumpa', '🚶'), ('robot', 'robot', '🤖'), ('help', 'bantu, tolong', '🆘'),
    ],
}

# ---------- naskah ----------
def tk(tokoh, pose='berdiri', posisi='tengah', **x):
    d = {'tokoh': tokoh, 'pose': pose, 'posisi': posisi}
    d.update(x)
    return d


def g(tokoh, teks, arti, posisi='kiri_atas', ekor='kiri'):
    return {'tokoh': tokoh, 'teks': teks, 'arti': arti, 'posisi': posisi, 'ekor': ekor}


def panel(adegan, latar, tokoh, gelembung, kataBantu, tipsBunyi):
    return {'adegan': adegan, 'latar': latar, 'tokoh': tokoh, 'gelembung': gelembung, 'kataBantu': kataBantu, 'tipsBunyi': tipsBunyi}


KOMIK = [
    # ===================== TINGKAT 3: Halo, Robi! =====================
    {
        'unit': 't3-u01', 'judul': 'Hello, {robi}!',
        'pesanAkhlak': 'Ramah dan menolong yang baru dikenal; berani walau takut.',
        'pesanHariIni': {'inggris': 'Be kind to new friends.', 'arti': 'Bersikaplah ramah pada teman baru.'},
        'kataTarget': ['hello', 'hi', 'I am', 'how are you', 'fine', 'please', 'thank you', 'goodbye'],
        'panel': [
            panel('Pagi setelah badai, daun berserakan di pematang sawah. Nisa (memeluk boneka kancil) menunjuk robot kecil berlumpur di bawah pohon kelapa. Fathan dan Dafi berlari mendekat.', 'sawah',
                  [tk('nisa', 'menunjuk', 'kiri'), tk('robi', 'jongkok', 'kanan', varian='kotor'), tk('fathan', 'kaget', 'tengah')],
                  [g('nisa', 'A robot!', 'Sebuah robot!')], ['robot'], ['robot dibaca ro-bot, tekanan di depan.']),
            panel('Mata layar robot menyala biru. Anak-anak kaget dan mundur; Fathan bersembunyi di belakang Dafi.', 'sawah',
                  [tk('robi', 'berdiri', 'kiri', varian='kotor'), tk('dafi', 'kaget', 'tengah_kanan'), tk('fathan', 'kaget', 'kanan')],
                  [g('robi', 'Hello! I am {robi}.', 'Halo! Aku {robi}.', 'kiri_atas', 'kiri')], ['Hello', 'I am…'], ['I am dibaca ai em.']),
            panel('Dafi melangkah maju dengan senyum malu, melambai. Nisa mengintip dari sampingnya.', 'sawah',
                  [tk('robi', 'berdiri', 'kiri', varian='kotor'), tk('dafi', 'melambai', 'tengah'), tk('nisa', 'berdiri', 'kanan')],
                  [g('dafi', 'Hi, {robi}! I am {dafi}.', 'Hai, {robi}! Aku {dafi}.', 'tengah_atas', 'tengah'), g('nisa', 'How are you?', 'Apa kabar?', 'kanan_bawah', 'kanan')],
                  ['Hi', 'How are you?'], ['How are you dibaca hau ar yu.']),
            panel('Layar Robi menampilkan wajah sedih, kabel kecil di lengannya putus. Anak-anak berjongkok membersihkan lumpur dengan daun pisang; Fathan ikut membantu.', 'sawah',
                  [tk('robi', 'berdiri', 'kiri', varian='sedih'), tk('fathan', 'jongkok', 'tengah'), tk('nisa', 'jongkok', 'kanan')],
                  [g('robi', 'Help, please.', 'Tolong, ya.', 'kiri_atas', 'kiri')], ['help', 'please'], ['please: "i" panjang, pliiz; huruf p di akhir help tetap diucapkan.']),
            panel('Sore, langit jingga. Robi bersih, dadanya menyala terang, tersenyum. Anak-anak melambai sambil berjalan pulang ke rumah panggung.', 'sore',
                  [tk('robi', 'gembira', 'kiri'), tk('fathan', 'melambai', 'tengah'), tk('nisa', 'melambai', 'kanan')],
                  [g('robi', 'I am fine! Thank you!', 'Aku baik! Terima kasih!', 'kiri_atas', 'kiri'), g('fathan', 'Goodbye, {robi}!', 'Sampai jumpa, {robi}!', 'kanan_atas', 'kanan')],
                  ['fine', 'thank you', 'goodbye'], ['fine dibaca fain (e bisu).', 'thank: lidah keluar sedikit; goodbye dibaca gud-bai.']),
        ],
        'cek': [('urutkan', [2, 4, 5]), ('siapa', (4, 1), ['robi', 'dafi', 'nisa']), ('dengar_panel', (5, 2), [1, 3, 5])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: What is this? (Apa ini?) Harapan: A robot!',
            'Tunjuk panel 2 dan 3. Tanyakan: What do they say? (Mereka bilang apa?) Harapan: Hello, I am {robi}. Hi, I am {dafi}.',
            'Coba main peran: Ayah/Bunda jadi {robi} dan bilang Help, please. Anak menjawab sebagai {dafi}.',
            'Tutup dengan melambai bersama: Goodbye, {robi}!',
            'Kalau ia memakai Bahasa Indonesia, tidak apa-apa. Ketuk kata bantu untuk mendengar contohnya, lalu minta ia menirukan.',
        ],
        'renungan': '{fathan} awalnya takut, tapi {dafi} berani menyapa dan semua mau menolong. Kalau ada anak baru di kelasmu, apa yang akan kamu lakukan?',
        'pancingan': 'Tanyakan: Who is in the story? (Siapa saja tokohnya?) Biarkan ia menyebut nama dalam Bahasa Inggris.',
        'perbuatanBaik': 'Ajak anak menyapa tetangga atau teman baru dengan "Hello!" minggu ini.',
    },
    {
        'unit': 't3-u02', 'judul': 'One, Two, Three!',
        'pesanAkhlak': 'Berbagi dengan teman walau milik sendiri sedikit.',
        'pesanHariIni': {'inggris': "Let's share!", 'arti': 'Mari berbagi!'},
        'kataTarget': ['one', 'two', 'three', 'four', 'five'],
        'panel': [
            panel('Jalan gampong pagi. Nisa menunjuk tiga anak kucing di dekat pagar. Robi berdiri di sampingnya, layarnya berkedip.', 'jalan',
                  [tk('nisa', 'menunjuk', 'kiri'), tk('robi', 'berdiri', 'kanan')],
                  [g('nisa', 'Look! How many cats?', 'Lihat! Ada berapa kucing?'), g('robi', 'One, two, three!', 'Satu, dua, tiga!', 'kanan_atas', 'kanan')],
                  ['how many', 'cats', 'three'], ['three: ujung lidah keluar sedikit di antara gigi (th).']),
            panel('Bima datang membawa lima buah mangga di keranjang kecil. Fathan terkagum-kagum.', 'jalan',
                  [tk('bima', 'gembira', 'kiri'), tk('fathan', 'kaget', 'kanan')],
                  [g('bima', 'I have five mangoes.', 'Aku punya lima mangga.'), g('fathan', 'Five? Wow!', 'Lima? Wah!', 'kanan_atas', 'kanan')],
                  ['I have', 'five'], ['five: gigi atas menyentuh bibir bawah untuk bunyi v di akhir.']),
            panel('Nisa memandang tangannya yang kosong, wajahnya sedikit sedih. Bima memperhatikannya.', 'jalan',
                  [tk('nisa', 'berdiri', 'kiri', varian='sedih'), tk('bima', 'berdiri', 'kanan')],
                  [g('nisa', 'I have no mangoes.', 'Aku tidak punya mangga.')], ['I have', 'no'], ['have: huruf e di akhir tidak dibunyikan, hev.']),
            panel('Bima tersenyum lalu membagikan mangga kepada Nisa, Fathan, dan Robi.', 'jalan',
                  [tk('bima', 'gembira', 'kiri'), tk('nisa', 'gembira', 'tengah'), tk('robi', 'gembira', 'kanan')],
                  [g('bima', 'One for you, one for you!', 'Satu untukmu, satu untukmu!'), g('robi', 'Thank you, friend!', 'Terima kasih, teman!', 'kanan_atas', 'kanan')],
                  ['one', 'for you', 'thank you'], ['one dibaca wan.']),
            panel('Sore di tepi sawah. Para sahabat duduk makan mangga bersama sambil tertawa. Nisa menghitung teman-temannya.', 'sore',
                  [tk('nisa', 'menunjuk', 'kiri'), tk('fathan', 'gembira', 'tengah_kiri'), tk('bima', 'gembira', 'tengah_kanan'), tk('robi', 'gembira', 'kanan')],
                  [g('nisa', 'One, two, three, four, five!', 'Satu, dua, tiga, empat, lima!'), g('robi', 'Five friends!', 'Lima sahabat!', 'kanan_atas', 'kanan')],
                  ['four', 'five', 'friends'], ['friends: bunyi s kecil di akhir tetap diucapkan.']),
        ],
        'cek': [('urutkan', [1, 2, 4]), ('siapa', (4, 1), ['bima', 'nisa', 'robi']), ('dengar_panel', (5, 2), [1, 3, 5])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: How many cats? (Berapa kucing?) Biarkan ia menghitung dalam Bahasa Inggris.',
            'Tunjuk panel 2. Tanyakan: How many mangoes? Harapan: Five!',
            'Tunjuk panel 4. Tanyakan: What does {bima} say? (Apa kata {bima}?) Harapan: One for you!',
            'Hitung bersama sahabat di panel 5: One, two, three, four, five!',
            'Kalau ia lupa angkanya, ketuk kata bantu lalu tirukan bersama.',
        ],
        'renungan': '{bima} membagi mangganya walau tinggal sedikit. Kalau kamu punya makanan dan temanmu tidak punya, apa yang akan kamu lakukan?',
        'pancingan': 'Minta ia menghitung benda di rumah dalam Bahasa Inggris. Tanyakan: How many?',
        'perbuatanBaik': 'Ajak anak berbagi makanan kecil dengan saudara atau teman minggu ini.',
    },
    {
        'unit': 't3-u03', 'judul': 'Count to Twenty',
        'pesanAkhlak': 'Bekerja sama membantu guru dan tetap sabar saat ada yang salah.',
        'pesanHariIni': {'inggris': "Let's work together!", 'arti': 'Ayo bekerja sama!'},
        'kataTarget': ['eleven', 'twelve', 'fourteen', 'fifteen', 'nineteen', 'twenty'],
        'panel': [
            panel('Ruang kelas sepulang sekolah. Buku berserakan di meja. Lina dan Fathan mulai merapikan.', 'kelas',
                  [tk('lina', 'menunjuk', 'kiri'), tk('fathan', 'berdiri', 'kanan')],
                  [g('lina', 'How many books?', 'Ada berapa buku?'), g('fathan', 'Eleven, twelve…', 'Sebelas, dua belas…', 'kanan_atas', 'kanan')],
                  ['how many', 'books', 'eleven'], ['books: oo dibaca pendek, buks.']),
            panel('Fathan terburu-buru dan tumpukan bukunya jatuh. Ia kaget, lalu memungutnya lagi.', 'kelas',
                  [tk('fathan', 'kaget', 'tengah')],
                  [g('fathan', 'Oops! Thirteen, fourteen…', 'Ups! Tiga belas, empat belas…')], ['thirteen', 'fourteen'], ['thirteen: lidah keluar sedikit untuk th.']),
            panel('Robi datang membantu menghitung dengan cepat; lampu dadanya berkedip.', 'kelas',
                  [tk('robi', 'gembira', 'kiri'), tk('fathan', 'jongkok', 'kanan')],
                  [g('robi', 'Fifteen, sixteen, seventeen!', 'Lima belas, enam belas, tujuh belas!')], ['fifteen', 'sixteen'], ['fifteen: tekanan di akhir, fif-TIIN.']),
            panel('Dafi dan Nisa ikut menyusun buku di rak sampai rapi.', 'kelas',
                  [tk('dafi', 'menunjuk', 'kiri'), tk('nisa', 'gembira', 'kanan')],
                  [g('dafi', 'Eighteen, nineteen, twenty!', 'Delapan belas, sembilan belas, dua puluh!'), g('nisa', 'I can count to twenty!', 'Aku bisa menghitung sampai dua puluh!', 'kanan_bawah', 'kanan')],
                  ['nineteen', 'twenty', 'I can count'], ['twenty: w dengan bibir membulat dulu.']),
            panel('Kak Fajar mampir ke kelas dan tersenyum melihat rak buku yang rapi.', 'kelas',
                  [tk('kak_fajar', 'gembira', 'kiri'), tk('lina', 'melambai', 'kanan')],
                  [g('kak_fajar', 'Thank you, students!', 'Terima kasih, anak-anak!'), g('lina', 'You are welcome!', 'Sama-sama!', 'kanan_atas', 'kanan')],
                  ['thank you', 'students'], ['students: huruf t di akhir tetap diucapkan.']),
        ],
        'cek': [('urutkan', [1, 3, 5]), ('siapa', (4, 2), ['nisa', 'dafi', 'lina']), ('dengar_panel', (3, 1), [2, 3, 5])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: How many books? Biarkan ia menebak angkanya.',
            'Tunjuk panel 2. Tanyakan: What happens? (Apa yang terjadi?) Bantu dengan kata Oops!',
            'Hitung bersama dari eleven sampai twenty sambil menunjuk panel 3 dan 4.',
            'Panel 5: Ayah/Bunda jadi Kak Fajar dan bilang Thank you! Anak menjawab You are welcome!',
            'Kalau angkanya tertukar, ketuk kata bantu dan hitung pelan bersama.',
        ],
        'renungan': '{fathan} menjatuhkan buku, tapi teman-temannya tidak marah dan malah membantu. Apa yang kamu lakukan kalau temanmu membuat kesalahan?',
        'pancingan': 'Minta ia menghitung dari 11 sampai 20 dalam Bahasa Inggris saat merapikan mainan.',
        'perbuatanBaik': 'Ajak anak membantu merapikan satu sudut rumah bersama minggu ini.',
    },
    {
        'unit': 't3-u04', 'judul': "{lina}'s Colors",
        'pesanAkhlak': 'Jujur mengakui kesalahan dan berani minta maaf.',
        'pesanHariIni': {'inggris': 'Say sorry and be honest.', 'arti': 'Katakan maaf dan jujurlah.'},
        'kataTarget': ['red', 'blue', 'yellow', 'green', 'brown', 'pink', 'purple'],
        'panel': [
            panel('Teras rumah panggung. Lina menggambar Robi di buku gambarnya. Robi duduk diam seperti model.', 'rumah',
                  [tk('lina', 'menunjuk', 'kiri'), tk('robi', 'berdiri', 'kanan')],
                  [g('lina', '{robi}, I like blue.', '{robi}, aku suka biru.'), g('robi', 'My eyes are blue!', 'Mataku biru!', 'kanan_atas', 'kanan')],
                  ['I like', 'blue'], ['blue: bibir maju membulat di akhir, bluu.']),
            panel('Lina mewarnai gambar dengan banyak warna; gambar Robi makin ceria.', 'rumah',
                  [tk('lina', 'gembira', 'tengah')],
                  [g('lina', 'Red, yellow, and green!', 'Merah, kuning, dan hijau!')], ['red', 'yellow', 'green'], ['red: lidah tidak bergetar untuk r.', 'green: ee dibaca i panjang.']),
            panel('Bima ingin membantu, tetapi tangannya menyenggol cat cokelat. Gambar Lina ternoda.', 'rumah',
                  [tk('bima', 'kaget', 'kiri'), tk('lina', 'kaget', 'kanan')],
                  [g('bima', 'Oh no! Brown!', 'Aduh! Cokelat!')], ['brown'], ['brown dibaca braun.']),
            panel('Bima menunduk dan berterus terang. Lina tersenyum memaafkan.', 'rumah',
                  [tk('bima', 'berdiri', 'kiri', varian='sedih'), tk('lina', 'berdiri', 'kanan')],
                  [g('bima', 'Sorry, {lina}. It was me.', 'Maaf, {lina}. Itu aku.'), g('lina', 'It is okay.', 'Tidak apa-apa.', 'kanan_atas', 'kanan')],
                  ['sorry', 'it was me'], ['sorry: r tidak bergetar, sori.']),
            panel('Sore hari. Noda cokelat diubah menjadi topi Robi. Semua tertawa melihat hasilnya.', 'sore',
                  [tk('robi', 'gembira', 'kiri'), tk('lina', 'gembira', 'tengah'), tk('bima', 'gembira', 'kanan')],
                  [g('robi', 'I like brown!', 'Aku suka cokelat!'), g('lina', 'Pink and purple too!', 'Merah muda dan ungu juga!', 'kanan_atas', 'kanan')],
                  ['pink', 'purple', 'too'], ['purple: dua huruf p, per-pel.']),
        ],
        'cek': [('urutkan', [1, 3, 4]), ('siapa', (4, 1), ['bima', 'fathan', 'lina']), ('dengar_panel', (5, 1), [1, 3, 5])],
        'naskah': [
            'Tunjuk panel 1 dan 2. Tanyakan: What colors? (Warna apa saja?) Biarkan ia menyebut warnanya.',
            'Tunjuk panel 3. Tanyakan: What color is it? Harapan: Brown!',
            'Tunjuk panel 4. Tanyakan: What does {bima} say? Harapan: Sorry, {lina}.',
            'Panel 5: sebutkan bersama semua warna yang terlihat.',
            'Ketuk kata bantu kalau ia lupa nama warnanya.',
        ],
        'renungan': '{bima} berani berkata jujur walaupun takut. Pernahkah kamu tidak sengaja merusak sesuatu? Apa yang sebaiknya dilakukan?',
        'pancingan': 'Tanyakan warna benda di sekitar rumah: What color is it?',
        'perbuatanBaik': 'Kalau ada yang tidak sengaja rusak minggu ini, ajak anak berkata jujur dan meminta maaf.',
    },
    {
        'unit': 't3-u05', 'judul': 'Meet My Family',
        'pesanAkhlak': 'Bersikap sopan dan hormat kepada orang tua dan nenek.',
        'pesanHariIni': {'inggris': 'Be polite to parents.', 'arti': 'Bersikap sopanlah kepada orang tua.'},
        'kataTarget': ['mother', 'father', 'grandmother', 'family'],
        'panel': [
            panel('Halaman rumah panggung. Nisa mengajak Robi bertemu ibunya yang sedang menjemur kain.', 'rumah',
                  [tk('nisa', 'menunjuk', 'kiri'), tk('robi', 'melambai', 'kanan')],
                  [g('nisa', '{robi}, this is my mother.', '{robi}, ini ibuku.'), g('robi', 'Hello! Good morning!', 'Halo! Selamat pagi!', 'kanan_atas', 'kanan')],
                  ['this is', 'mother'], ['mother: th dengan lidah di antara gigi.']),
            panel('Fathan mengenalkan ayahnya yang baru pulang dari sawah. Robi membungkuk sopan.', 'rumah',
                  [tk('fathan', 'menunjuk', 'kiri'), tk('robi', 'berdiri', 'kanan')],
                  [g('fathan', 'This is my father.', 'Ini ayahku.'), g('robi', 'Nice to meet you.', 'Senang bertemu Bapak.', 'kanan_atas', 'kanan')],
                  ['father', 'nice to meet you'], ['father: a panjang, faa-der.']),
            panel('Robi hampir masuk rumah dengan kaki berlumpur. Fathan mengingatkannya; Robi segera berhenti.', 'rumah',
                  [tk('fathan', 'menunjuk', 'kiri'), tk('robi', 'kaget', 'kanan', varian='kotor')],
                  [g('fathan', '{robi}, please!', '{robi}, tolong!'), g('robi', 'Oh! Sorry!', 'Oh! Maaf!', 'kanan_atas', 'kanan')],
                  ['please', 'sorry'], ['please: ea dibaca i panjang.']),
            panel('Di dalam rumah, nenek duduk di tikar. Nisa mengenalkan neneknya dan Robi menyapa dengan sopan.', 'rumah',
                  [tk('nisa', 'gembira', 'kiri'), tk('robi', 'melambai', 'kanan')],
                  [g('nisa', 'She is my grandmother.', 'Dia nenekku.'), g('robi', 'Hello, grandmother!', 'Halo, Nenek!', 'kanan_atas', 'kanan')],
                  ['she is', 'grandmother'], ['grandmother: huruf d hampir tidak terdengar, gran-ma-der.']),
            panel('Sore, keluarga makan bersama di rumah panggung. Robi ikut duduk sopan dengan lampu dada menyala hangat.', 'sore',
                  [tk('fathan', 'gembira', 'kiri'), tk('nisa', 'gembira', 'tengah'), tk('robi', 'gembira', 'kanan')],
                  [g('fathan', 'I love my family.', 'Aku sayang keluargaku.'), g('robi', 'I love your family too!', 'Aku juga sayang keluargamu!', 'kanan_atas', 'kanan')],
                  ['I love', 'family'], ['love: o dibaca seperti a pendek, lav.']),
        ],
        'cek': [('urutkan', [1, 2, 5]), ('siapa', (3, 2), ['robi', 'fathan', 'nisa']), ('dengar_panel', (4, 1), [2, 4, 5])],
        'naskah': [
            'Tunjuk panel 1, 2, dan 4. Tanyakan: Who is this? (Siapa ini?) Harapan: mother, father, grandmother.',
            'Tunjuk panel 3. Tanyakan: What does {robi} say? Harapan: Sorry!',
            'Main peran: anak mengenalkan Ayah/Bunda kepada boneka: This is my mother/father.',
            'Tutup dengan kalimat panel 5: I love my family.',
            'Kalau ia diam, ketuk kata bantu dan ucapkan bersama.',
        ],
        'renungan': '{robi} lupa membersihkan kakinya, lalu segera minta maaf. Bagaimana caramu bersikap sopan saat bertemu orang tua teman?',
        'pancingan': 'Minta ia mengenalkan anggota keluarga dalam Bahasa Inggris: This is my…',
        'perbuatanBaik': 'Ajak anak menyapa kakek, nenek, atau orang tua lain dengan sopan minggu ini.',
    },
    {
        'unit': 't3-u06', 'judul': 'My Red Pencil',
        'pesanAkhlak': 'Jujur mengembalikan barang milik orang lain.',
        'pesanHariIni': {'inggris': 'Give it back. Be honest.', 'arti': 'Kembalikan. Jujurlah.'},
        'kataTarget': ['pencil', 'ruler', 'bag', 'notebook', 'crayon', 'book'],
        'panel': [
            panel('Kelas pagi. Dafi membongkar tasnya, wajahnya bingung mencari pensil merah kesayangannya.', 'kelas',
                  [tk('dafi', 'kaget', 'tengah')],
                  [g('dafi', 'My pencil! Where is it?', 'Pensilku! Di mana ya?')], ['my pencil', 'where'], ['pencil dibaca pen-sel.']),
            panel('Robi mengangkat sebuah penggaris dengan wajah polos. Dafi tertawa kecil.', 'kelas',
                  [tk('robi', 'menunjuk', 'kiri'), tk('dafi', 'gembira', 'kanan')],
                  [g('robi', 'Is this a pencil?', 'Apakah ini pensil?'), g('dafi', 'No, it is a ruler.', 'Bukan, ini penggaris.', 'kanan_atas', 'kanan')],
                  ['is this', 'ruler'], ['ruler: r tidak bergetar, ruu-ler.']),
            panel('Di dekat kursinya, Bima menemukan pensil merah. Ia memandanginya sebentar, ragu-ragu.', 'kelas',
                  [tk('bima', 'jongkok', 'tengah')],
                  [g('bima', 'A red pencil…', 'Pensil merah…')], ['red', 'pencil'], ['red: lidah ditarik ke belakang, tidak bergetar.']),
            panel('Bima berjalan ke meja Dafi dan mengembalikan pensil itu. Dafi tersenyum lega.', 'kelas',
                  [tk('bima', 'gembira', 'kiri'), tk('dafi', 'gembira', 'kanan')],
                  [g('bima', '{dafi}, this is your pencil.', '{dafi}, ini pensilmu.'), g('dafi', 'Thank you, {bima}!', 'Terima kasih, {bima}!', 'kanan_atas', 'kanan')],
                  ['this is', 'your pencil'], ['this: th dengan lidah di antara gigi.']),
            panel('Lina dan Robi merapikan meja. Buku, krayon, dan buku tulis masuk ke tas dengan rapi.', 'kelas',
                  [tk('lina', 'menunjuk', 'kiri'), tk('robi', 'gembira', 'kanan')],
                  [g('lina', 'Book, crayon, notebook in my bag.', 'Buku, krayon, buku tulis di tasku.'), g('robi', 'Good, good!', 'Bagus, bagus!', 'kanan_atas', 'kanan')],
                  ['book', 'crayon', 'notebook', 'bag'], ['book: oo pendek, buk.', 'bag: a pendek dengan mulut terbuka lebar.']),
        ],
        'cek': [('urutkan', [1, 3, 4]), ('siapa', (4, 1), ['bima', 'lina', 'robi']), ('dengar_panel', (2, 2), [2, 4, 5])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: What is {dafi} looking for? (Apa yang dicari {dafi}?) Harapan: pencil.',
            'Tunjuk panel 2. Tanyakan: Is it a pencil? Harapan: No, it is a ruler.',
            'Tunjuk panel 4. Tanyakan: What does {bima} say? Harapan: This is your pencil.',
            'Panel 5: sebutkan bersama benda yang masuk ke tas.',
            'Ketuk kata bantu untuk mendengar contoh kalau ia lupa.',
        ],
        'renungan': '{bima} menemukan pensil temannya dan memilih mengembalikannya. Kalau kamu menemukan barang milik orang lain, apa yang akan kamu lakukan?',
        'pancingan': 'Tunjuk benda sekolah di rumah dan tanyakan: What is this?',
        'perbuatanBaik': 'Ajak anak mengembalikan barang pinjaman tepat waktu minggu ini.',
    },
    # ===================== TINGKAT 4: Kabut Misterius =====================
    {
        'unit': 't4-u01', 'judul': 'Touch Your Nose!',
        'pesanAkhlak': 'Tolong-menolong saat teman sedang kesusahan.',
        'pesanHariIni': {'inggris': 'Help your friends.', 'arti': 'Tolonglah temanmu.'},
        'kataTarget': ['ear', 'nose', 'eye', 'leg', 'foot', 'hand', 'arm'],
        'panel': [
            panel('Lapangan bola sore hari menjelang kenduri panen. Kak Fajar mengajak anak-anak bermain tebak tubuh.', 'lapangan',
                  [tk('kak_fajar', 'menunjuk', 'kiri'), tk('nisa', 'gembira', 'kanan')],
                  [g('kak_fajar', 'Touch your ears! Touch your nose!', 'Sentuh telingamu! Sentuh hidungmu!'), g('nisa', 'This is my nose!', 'Ini hidungku!', 'kanan_atas', 'kanan')],
                  ['touch', 'ears', 'nose'], ['touch: ou dibaca a pendek, tach.']),
            panel('Bima menunjuk matanya dan telinganya sambil bercanda; teman-teman tertawa.', 'lapangan',
                  [tk('bima', 'gembira', 'tengah')],
                  [g('bima', 'I have two eyes and big ears!', 'Aku punya dua mata dan telinga besar!')], ['two eyes', 'big ears'], ['eyes dibaca ais, bunyi z kecil di akhir.']),
            panel('Malam turun. Kabut kelabu datang perlahan ke jalan gampong; Mister Kabut menggerutu lucu.', 'jalan',
                  [tk('kabut', 'berdiri', 'tengah')],
                  [g('kabut', 'Hmm… don\'t help, don\'t help!', 'Hmm… jangan menolong, jangan menolong!')], ["don't help"], ['help: huruf p di akhir tetap diucapkan.']),
            panel('Pagi berkabut. Bima tersandung batu dan memegangi kakinya. Robi bergegas mendekat.', 'lapangan',
                  [tk('bima', 'jongkok', 'kiri', varian='sedih'), tk('robi', 'kaget', 'kanan')],
                  [g('bima', 'Ouch! My leg! My foot!', 'Aduh! Kakiku! Telapak kakiku!'), g('robi', 'Your leg? Let me help!', 'Kakimu? Biar kubantu!', 'kanan_atas', 'kanan')],
                  ['leg', 'foot', 'help'], ['foot: oo pendek, fut.']),
            panel('Dafi dan Fathan memapah Bima berdiri. Dafi mengulurkan tangan, Fathan memberi lengannya.', 'lapangan',
                  [tk('dafi', 'menunjuk', 'kiri'), tk('bima', 'berdiri', 'tengah'), tk('fathan', 'berdiri', 'kanan')],
                  [g('dafi', 'Give me your hand, {bima}.', 'Berikan tanganmu, {bima}.'), g('fathan', 'My arm! Here!', 'Lenganku! Sini!', 'kanan_atas', 'kanan')],
                  ['hand', 'arm'], ['hand: huruf d di akhir jangan dibuang.']),
            panel('Bima berterima kasih; dada Robi menyala terang dan kabut di sekitar mereka menipis.', 'sore',
                  [tk('bima', 'gembira', 'kiri'), tk('robi', 'gembira', 'kanan')],
                  [g('bima', 'Thank you, friends!', 'Terima kasih, teman-teman!'), g('robi', 'Good! Good!', 'Bagus! Bagus!', 'kanan_atas', 'kanan')],
                  ['thank you', 'friends'], ['thank: lidah keluar sedikit untuk th.']),
        ],
        'cek': [('urutkan', [1, 4, 6]), ('siapa', (4, 2), ['robi', 'dafi', 'fathan']), ('dengar_panel', (1, 2), [1, 3, 5]), ('lengkapi', (5, 1), 'hand', ['hand', 'nose', 'ear'])],
        'naskah': [
            'Main dulu: Ayah/Bunda bilang Touch your nose! dan anak menyentuh hidungnya.',
            'Tunjuk panel 4. Tanyakan: What happens to {bima}? Bantu dengan First… (Pertama…).',
            'Tunjuk panel 5. Tanyakan: What do they do? Bantu dengan Then… (Lalu…).',
            'Tunjuk panel 6. Ajak menutup cerita dengan Finally… (Akhirnya…) Thank you, friends!',
            'Kalau ia macet, ketuk kata bantu lalu tirukan.',
        ],
        'renungan': 'Kabut ingin anak-anak tidak saling menolong, tapi mereka tetap membantu {bima}. Apa yang kamu lakukan kalau temanmu jatuh?',
        'pancingan': 'Mainkan Touch your… bersama dan minta ia memberi perintah juga.',
        'perbuatanBaik': 'Ajak anak membantu satu orang di rumah atau sekolah tanpa diminta minggu ini.',
    },
    {
        'unit': 't4-u02', 'judul': 'Yummy Food',
        'pesanAkhlak': 'Mengambil makanan secukupnya dan tidak membuangnya.',
        'pesanHariIni': {'inggris': 'Take only what you can eat.', 'arti': 'Ambil makanan secukupnya saja.'},
        'kataTarget': ['rice', 'chicken', 'egg', 'tea', 'milk', 'juice', 'water'],
        'panel': [
            panel('Kedai Nek Ijah menjelang kenduri. Meja penuh nasi, ayam, dan telur. Nek Ijah tersenyum.', 'kedai',
                  [tk('nek_ijah', 'gembira', 'kiri'), tk('bima', 'kaget', 'kanan')],
                  [g('nek_ijah', 'Rice, chicken, and egg! Yummy!', 'Nasi, ayam, dan telur! Lezat!')], ['rice', 'chicken', 'egg'], ['rice: r tidak bergetar; ice dibaca ais.']),
            panel('Bima menunjuk makanan dengan gembira; Nisa menolak teh dengan menggeleng.', 'kedai',
                  [tk('bima', 'menunjuk', 'kiri'), tk('nisa', 'berdiri', 'kanan')],
                  [g('bima', 'I like rice! I like chicken!', 'Aku suka nasi! Aku suka ayam!'), g('nisa', "I don't like tea.", 'Aku tidak suka teh.', 'kanan_atas', 'kanan')],
                  ['I like', "I don't like", 'tea'], ['chicken: ch dibaca seperti c Indonesia.']),
            panel('Kabut kelabu masuk lewat jendela kedai. Mister Kabut berbisik pada Bima.', 'kedai',
                  [tk('kabut', 'menunjuk', 'kiri'), tk('bima', 'berdiri', 'kanan')],
                  [g('kabut', 'Hmm… more rice, more!', 'Hmm… nasi lagi, lagi!')], ['more', 'rice'], ['more: o panjang, lalu r dibunyikan lembut, mor.']),
            panel('Piring Bima penuh sekali. Ia duduk lemas dan bingung.', 'kedai',
                  [tk('bima', 'jongkok', 'tengah', varian='sedih')],
                  [g('bima', 'Oh no… too much rice.', 'Aduh… nasinya terlalu banyak.')], ['too much'], ['much: u dibaca a pendek, mach.']),
            panel('Robi dan Lina datang. Robi meminta dengan sopan, Lina membagi nasi Bima ke piring lain.', 'kedai',
                  [tk('robi', 'berdiri', 'kiri'), tk('lina', 'gembira', 'kanan')],
                  [g('robi', 'Can I have some, please?', 'Boleh aku minta sedikit?'), g('lina', 'Some for you, some for me!', 'Sebagian untukmu, sebagian untukku!', 'kanan_atas', 'kanan')],
                  ['can I have', 'some', 'please'], ['some: o dibaca a pendek, sam.']),
            panel('Sore, mereka makan sampai habis dan minum bersama. Dada Robi menyala; kabut menghilang.', 'sore',
                  [tk('robi', 'gembira', 'kiri'), tk('nek_ijah', 'gembira', 'tengah'), tk('bima', 'gembira', 'kanan')],
                  [g('robi', 'Milk, juice, water! Thank you!', 'Susu, jus, air! Terima kasih!'), g('nek_ijah', 'Good, good!', 'Bagus, bagus!', 'kanan_atas', 'kanan')],
                  ['milk', 'juice', 'water'], ['water: w dengan bibir membulat.', 'juice: ui dibaca u panjang, juus.']),
        ],
        'cek': [('urutkan', [1, 4, 6]), ('siapa', (5, 1), ['robi', 'bima', 'lina']), ('dengar_panel', (2, 2), [2, 3, 6]), ('lengkapi', (2, 1), 'chicken', ['chicken', 'window', 'happy'])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: What food? (Makanan apa saja?) Biarkan ia menyebut nama makanan.',
            'Tunjuk panel 2. Tanyakan: What does {nisa} not like? Harapan: tea.',
            'Tunjuk panel 4–5. Ajak bercerita: First… Then… (Pertama… Lalu…).',
            'Panel 6: sebutkan minuman bersama: milk, juice, water.',
            'Kalau ia macet, ketuk kata bantu dan dengarkan contohnya.',
        ],
        'renungan': '{bima} mengambil terlalu banyak nasi, lalu membaginya agar tidak terbuang. Bagaimana caramu supaya makanan di piring tidak tersisa?',
        'pancingan': 'Saat makan, tanyakan: What do you like? Biarkan ia menjawab I like…',
        'perbuatanBaik': 'Ajak anak mengambil makanan secukupnya dan menghabiskannya minggu ini.',
    },
    {
        'unit': 't4-u03', 'judul': "{nisa}'s Birthday",
        'pesanAkhlak': 'Sabar dan tidak marah-marah walau keadaan tidak sesuai harapan.',
        'pesanHariIni': {'inggris': 'Be patient, not angry.', 'arti': 'Bersabarlah, jangan marah.'},
        'kataTarget': ['calendar', 'birthday', 'party', 'afternoon', 'evening', 'night', 'morning'],
        'panel': [
            panel('Ruang tengah rumah panggung. Nisa menunjuk kalender di dinding; Fathan membaca tanggalnya.', 'rumah',
                  [tk('nisa', 'menunjuk', 'kiri'), tk('fathan', 'berdiri', 'kanan')],
                  [g('nisa', 'Look at the calendar!', 'Lihat kalendernya!'), g('fathan', 'Today is Monday.', 'Hari ini hari Senin.', 'kanan_atas', 'kanan')],
                  ['calendar', 'today'], ['calendar: tekanan di depan, KE-len-der.']),
            panel('Nisa melompat gembira menunjuk tanggal yang dilingkari.', 'rumah',
                  [tk('nisa', 'gembira', 'tengah')],
                  [g('nisa', 'My birthday is in May!', 'Ulang tahunku bulan Mei!')], ['birthday'], ['birthday: th dengan lidah keluar sedikit.']),
            panel('Lina dan Dafi merencanakan pesta kecil di kedai.', 'kedai',
                  [tk('lina', 'menunjuk', 'kiri'), tk('dafi', 'berdiri', 'kanan')],
                  [g('lina', 'A party in the afternoon!', 'Pesta di siang hari!'), g('dafi', 'In the evening, please!', 'Di sore hari saja!', 'kanan_atas', 'kanan')],
                  ['party', 'afternoon', 'evening'], ['party: a panjang, r dibunyikan lembut, par-ti.']),
            panel('Malam, kabut kelabu turun menutupi kedai. Mister Kabut menggerutu.', 'jalan',
                  [tk('kabut', 'berdiri', 'tengah')],
                  [g('kabut', 'Hmm… no party at night!', 'Hmm… tidak ada pesta malam ini!')], ['night'], ['night: gh tidak dibunyikan, nait.']),
            panel('Fathan kesal dan menghentakkan kaki; Robi menenangkannya dengan sopan.', 'jalan',
                  [tk('fathan', 'kaget', 'kiri'), tk('robi', 'berdiri', 'kanan')],
                  [g('fathan', 'No! I want the party!', 'Tidak! Aku mau pestanya!'), g('robi', 'Please, {fathan}!', 'Ayolah, {fathan}, sabar!', 'kanan_atas', 'kanan')],
                  ['I want', 'please'], ['want: a dibaca seperti o pendek, wont.']),
            panel('Pagi cerah, kabut pergi. Semua merayakan ulang tahun Nisa dengan sederhana di kedai.', 'kedai',
                  [tk('fathan', 'gembira', 'kiri'), tk('nisa', 'gembira', 'tengah'), tk('robi', 'gembira', 'kanan')],
                  [g('fathan', 'Happy birthday, {nisa}!', 'Selamat ulang tahun, {nisa}!'), g('nisa', 'Thank you! Good morning!', 'Terima kasih! Selamat pagi!', 'kanan_atas', 'kanan')],
                  ['happy birthday', 'morning'], ['happy: h diucapkan jelas, a pendek.']),
        ],
        'cek': [('urutkan', [1, 3, 6]), ('siapa', (2, 1), ['nisa', 'lina', 'fathan']), ('dengar_panel', (4, 1), [1, 4, 6]), ('lengkapi', (1, 2), 'Monday', ['Monday', 'May', 'night'])],
        'naskah': [
            'Tunjuk panel 1. Tanyakan: What day is it? (Hari apa?) Harapan: Monday.',
            'Tunjuk panel 2. Tanyakan: When is the birthday? Harapan: in May.',
            'Tunjuk panel 4–5. Ajak bercerita: Then… the fog comes. (Lalu… kabut datang.)',
            'Panel 6: ucapkan bersama Happy birthday!',
            'Kalau ia lupa, ketuk kata bantu dan tirukan.',
        ],
        'renungan': '{fathan} marah karena pesta tertunda, lalu {robi} menenangkannya. Apa yang bisa kamu lakukan saat sedang kesal?',
        'pancingan': 'Tunjuk kalender dan tanyakan: When is your birthday?',
        'perbuatanBaik': 'Ajak anak menarik napas panjang dan berbicara pelan saat sedang kesal minggu ini.',
    },
    {
        'unit': 't4-u04', 'judul': 'Super {robi}!',
        'pesanAkhlak': 'Disiplin bangun pagi dan bertanggung jawab pada tugas sendiri.',
        'pesanHariIni': {'inggris': 'Wake up and be ready!', 'arti': 'Bangun dan bersiaplah!'},
        'kataTarget': ['wake up', 'brush teeth', 'wash hands', 'eat breakfast', 'go to school', 'study', 'sleep'],
        'panel': [
            panel('Pagi yang berkabut di rumah panggung. Mister Kabut berbisik di jendela; semua masih tidur.', 'rumah',
                  [tk('kabut', 'menunjuk', 'kiri'), tk('fathan', 'jongkok', 'kanan')],
                  [g('kabut', 'Sleep, sleep… no school!', 'Tidur, tidur… tidak usah sekolah!')], ['sleep', 'school'], ['sleep: ee dibaca i panjang.']),
            panel('Robi membangunkan Fathan dengan sopan; Fathan masih mengantuk dan menarik selimut.', 'rumah',
                  [tk('robi', 'menunjuk', 'kiri'), tk('fathan', 'jongkok', 'kanan')],
                  [g('robi', '{fathan}, wake up, please!', '{fathan}, bangun, ya!'), g('fathan', 'No, no… sleep!', 'Tidak, tidak… mau tidur!', 'kanan_atas', 'kanan')],
                  ['wake up', 'please'], ['wake: e di akhir bisu, weik.']),
            panel('Nisa sudah bangun, menunjuk jam dinding: jam enam pagi.', 'rumah',
                  [tk('nisa', 'gembira', 'tengah')],
                  [g('nisa', 'I wake up at six!', 'Aku bangun jam enam!')], ['I wake up', 'six'], ['six: huruf x dibaca ks.']),
            panel('Dafi dan Nisa bersiap: menggosok gigi, mencuci tangan, lalu sarapan.', 'rumah',
                  [tk('dafi', 'menunjuk', 'kiri'), tk('nisa', 'gembira', 'kanan')],
                  [g('dafi', 'Brush teeth, wash hands, eat breakfast!', 'Gosok gigi, cuci tangan, sarapan!')], ['brush teeth', 'wash hands', 'eat breakfast'], ['brush: sh dibaca sy panjang.']),
            panel('Fathan bangun dan malu. Ia berterima kasih; dada Robi menyala dan Robi berubah menjadi Super Robi bersayap cahaya.', 'rumah',
                  [tk('fathan', 'berdiri', 'kiri'), tk('robi', 'gembira', 'kanan', varian='super')],
                  [g('fathan', 'Sorry, {robi}. Thank you!', 'Maaf, {robi}. Terima kasih!'), g('robi', 'You are welcome! Super {robi}!', 'Sama-sama! Super {robi}!', 'kanan_atas', 'kanan')],
                  ['sorry', 'thank you'], ['welcome: w dengan bibir membulat, wel-kam.']),
            panel('Super Robi mengusir kabut dengan perisai cahaya. Anak-anak berangkat sekolah dengan semangat.', 'jalan',
                  [tk('robi', 'gembira', 'kiri', varian='super'), tk('fathan', 'melambai', 'tengah'), tk('nisa', 'gembira', 'kanan')],
                  [g('fathan', "Let's go to school!", 'Ayo berangkat sekolah!'), g('robi', 'Study, study!', 'Belajar, belajar!', 'kanan_atas', 'kanan')],
                  ['go to school', 'study'], ['school: oo panjang, skuul.']),
        ],
        'cek': [('urutkan', [1, 4, 6]), ('siapa', (3, 1), ['nisa', 'lina', 'robi']), ('dengar_panel', (4, 1), [2, 4, 6]), ('lengkapi', (6, 1), 'school', ['school', 'bed', 'house'])],
        'naskah': [
            'Tunjuk panel 1–2. Tanyakan: What does {robi} say? Harapan: Wake up, please!',
            'Tunjuk panel 4. Minta ia memeragakan sambil berkata: Brush teeth, wash hands, eat breakfast!',
            'Tunjuk panel 5–6. Ajak bercerita: Then {robi} is Super {robi}! Finally… go to school!',
            'Tanyakan: What time do you wake up? Harapan: I wake up at…',
            'Kalau ia macet, ketuk kata bantu dan tirukan gerakannya.',
        ],
        'renungan': 'Kabut ingin semua malas, tapi {nisa} dan {dafi} tetap bersiap sendiri. Apa saja yang bisa kamu siapkan sendiri setiap pagi?',
        'pancingan': 'Pagi hari, tanyakan: What do you do in the morning? dan biarkan ia menyebut kegiatannya.',
        'perbuatanBaik': 'Ajak anak menyiapkan tas sekolahnya sendiri setiap malam minggu ini.',
    },
    {
        'unit': 't4-u05', 'judul': 'How Do You Feel?',
        'pesanAkhlak': 'Tidak mengejek teman, dan berani minta maaf kalau salah.',
        'pesanHariIni': {'inggris': 'Kind words, happy friends.', 'arti': 'Kata-kata baik membuat teman bahagia.'},
        'kataTarget': ['happy', 'sad', 'angry', 'excited'],
        'panel': [
            panel('Lapangan bola. Dafi memamerkan tangan robot kecil buatannya dari barang bekas.', 'lapangan',
                  [tk('dafi', 'gembira', 'tengah')],
                  [g('dafi', 'Look! I am happy!', 'Lihat! Aku senang!')], ['happy'], ['happy: h diucapkan jelas.']),
            panel('Kabut kelabu menyelimuti lapangan. Mister Kabut berbisik kepada Bima.', 'lapangan',
                  [tk('kabut', 'menunjuk', 'kiri'), tk('bima', 'berdiri', 'kanan')],
                  [g('kabut', 'Hmm… be angry, be angry…', 'Hmm… marahlah, marahlah…')], ['angry'], ['angry: a pendek dengan mulut terbuka lebar.']),
            panel('Bima menertawakan robot buatan Dafi.', 'lapangan',
                  [tk('bima', 'menunjuk', 'kiri'), tk('dafi', 'kaget', 'kanan')],
                  [g('bima', 'Ha! Your robot is bad!', 'Ha! Robotmu jelek!')], ['robot', 'bad'], ['bad: huruf d di akhir jangan dibuang.']),
            panel('Dafi menunduk sedih. Lina mendekat dan bertanya dengan lembut.', 'lapangan',
                  [tk('lina', 'berdiri', 'kiri'), tk('dafi', 'berdiri', 'kanan', varian='sedih')],
                  [g('lina', 'How do you feel, {dafi}?', 'Bagaimana perasaanmu, {dafi}?'), g('dafi', 'I feel sad.', 'Aku merasa sedih.', 'kanan_atas', 'kanan')],
                  ['how do you feel', 'sad'], ['feel: ee dibaca i panjang.']),
            panel('Super Robi datang dengan cahaya lembut dan bertanya kepada Bima. Bima tersadar dan meminta maaf.', 'lapangan',
                  [tk('robi', 'berdiri', 'kiri', varian='super'), tk('bima', 'berdiri', 'kanan', varian='sedih')],
                  [g('robi', '{bima}, are you angry?', '{bima}, apakah kamu marah?'), g('bima', 'Yes… sorry, {dafi}.', 'Iya… maaf, {dafi}.', 'kanan_atas', 'kanan')],
                  ['are you angry', 'sorry'], ['are you: r dibunyikan lembut, ar yu.']),
            panel('Sore. Kabut pergi. Dafi dan Bima tertawa bersama memperbaiki tangan robot.', 'sore',
                  [tk('dafi', 'gembira', 'kiri'), tk('bima', 'gembira', 'kanan')],
                  [g('dafi', 'Thank you! I am happy!', 'Terima kasih! Aku senang!'), g('bima', 'Me too! I am excited!', 'Aku juga! Aku bersemangat!', 'kanan_atas', 'kanan')],
                  ['happy', 'excited'], ['excited: akhiran -ed dibaca id, ek-sai-tid.']),
        ],
        'cek': [('urutkan', [1, 3, 6]), ('siapa', (3, 1), ['bima', 'fathan', 'robi']), ('dengar_panel', (4, 2), [1, 4, 6]), ('lengkapi', (4, 1), 'feel', ['feel', 'like', 'have'])],
        'naskah': [
            'Tunjuk panel 1 dan 4. Tanyakan: How does {dafi} feel? Harapan: happy, sad.',
            'Tunjuk panel 3. Tanyakan: Is it kind? (Apakah itu baik?) Biarkan ia menjawab.',
            'Tunjuk panel 5. Tanyakan: What does {bima} say? Harapan: Sorry.',
            'Ajak menebak perasaan dari wajah: Ayah/Bunda membuat wajah, anak bilang happy, sad, angry.',
            'Kalau ia macet, ketuk kata bantu.',
        ],
        'renungan': '{bima} mengejek karena terbawa kabut, lalu sadar dan minta maaf. Bagaimana perasaanmu kalau diejek? Apa yang sebaiknya kita katakan kepada teman?',
        'pancingan': 'Tanyakan setiap hari: How do you feel today?',
        'perbuatanBaik': 'Ajak anak memuji satu teman dengan kata-kata baik minggu ini.',
    },
    {
        'unit': 't4-u06', 'judul': 'Light in the House',
        'pesanAkhlak': 'Menjaga rumah tetap bersih dan rapi bersama-sama.',
        'pesanHariIni': {'inggris': 'A clean house is a happy house.', 'arti': 'Rumah yang bersih adalah rumah yang bahagia.'},
        'kataTarget': ['house', 'key', 'bed', 'sofa', 'mirror', 'window', 'door', 'light'],
        'panel': [
            panel('Malam di rumah panggung. Lampu padam dan rumah gelap. Nisa memeluk boneka kancilnya.', 'rumah',
                  [tk('nisa', 'kaget', 'tengah')],
                  [g('nisa', 'This is my house. No light!', 'Ini rumahku. Tidak ada lampu!')], ['house', 'light'], ['house: ou dibaca au, haus.']),
            panel('Fathan mencari kunci lemari tempat senter. Ia meraba-raba di dekat tempat tidur.', 'rumah',
                  [tk('fathan', 'menunjuk', 'tengah')],
                  [g('fathan', 'The key? Is it on the bed?', 'Kuncinya? Apakah di atas tempat tidur?')], ['key', 'bed'], ['key dibaca ki panjang.']),
            panel('Mister Kabut duduk di sofa sambil menebarkan debu kelabu; ruangan jadi berantakan.', 'rumah',
                  [tk('kabut', 'gembira', 'tengah')],
                  [g('kabut', 'Hmm… dirty sofa, dirty house!', 'Hmm… sofa kotor, rumah kotor!')], ['sofa', 'dirty'], ['sofa: o panjang, sou-fa.']),
            panel('Lina mengajak semua bersih-bersih: mengelap cermin dan jendela.', 'rumah',
                  [tk('lina', 'menunjuk', 'kiri'), tk('dafi', 'berdiri', 'kanan')],
                  [g('lina', 'Clean the mirror and the window!', 'Bersihkan cermin dan jendela!')], ['mirror', 'window', 'clean'], ['window: w dengan bibir membulat dulu.']),
            panel('Dafi membuka pintu agar udara segar masuk. Super Robi menyalakan cahayanya.', 'rumah',
                  [tk('dafi', 'menunjuk', 'kiri'), tk('robi', 'gembira', 'kanan', varian='super')],
                  [g('dafi', 'Open the door, please!', 'Tolong buka pintunya!'), g('robi', 'Thank you! Light on!', 'Terima kasih! Lampu menyala!', 'kanan_atas', 'kanan')],
                  ['open the door', 'light'], ['door: oo dibaca o panjang, door.']),
            panel('Rumah terang dan bersih. Mister Kabut berlari kecil keluar sambil menggerutu; Nisa melambai.', 'sore',
                  [tk('kabut', 'kaget', 'kiri'), tk('nisa', 'melambai', 'kanan')],
                  [g('kabut', 'Oh no! A clean house!', 'Aduh! Rumahnya bersih!'), g('nisa', 'Goodbye!', 'Sampai jumpa!', 'kanan_atas', 'kanan')],
                  ['clean house', 'goodbye'], ['clean: ea dibaca i panjang, kliin.']),
        ],
        'cek': [('urutkan', [1, 4, 6]), ('siapa', (5, 1), ['dafi', 'lina', 'nisa']), ('dengar_panel', (2, 1), [2, 3, 5]), ('lengkapi', (4, 1), 'mirror', ['mirror', 'happy', 'rice'])],
        'naskah': [
            'Tunjuk panel 1–2. Tanyakan: Where is the key? (Di mana kuncinya?) Harapan: on the bed?',
            'Tunjuk panel 3. Tanyakan: Is the house clean? Biarkan ia menjawab no.',
            'Tunjuk panel 4–5. Ajak bercerita: Then they clean the mirror and the window. Finally… light on!',
            'Keliling rumah bersama: tunjuk pintu, jendela, cermin dan sebutkan dalam Bahasa Inggris.',
            'Kalau ia lupa, ketuk kata bantu.',
        ],
        'renungan': 'Anak-anak membersihkan rumah bersama sampai kabut pergi. Bagian rumah mana yang bisa kamu bantu rapikan?',
        'pancingan': 'Tunjuk benda di rumah dan tanyakan: What is this? Is it clean?',
        'perbuatanBaik': 'Ajak anak merapikan tempat tidurnya sendiri setiap pagi minggu ini.',
    },
]


TOKOH = json.load(open(os.path.join(PAKET, 'tokoh.json'), encoding='utf-8'))['tokoh']


def penanda(teks):
    """Ganti nama tokoh yang ditulis langsung dengan penanda {id} (nama hanya di tokoh.json)."""
    for t in sorted(TOKOH, key=lambda x: -len(x['nama'])):
        if t['peran'] == 'narator':
            continue
        teks = re.sub(r'\b' + re.escape(t['nama']) + r'\b', '{' + t['id'] + '}', teks)
    return teks


def bangun_komik(k, nomor):
    unit = k['unit']
    t = int(unit[1])
    panel_jadi = []
    for i, p in enumerate(k['panel'], 1):
        pid = f'{unit}-p{i}'
        gel = []
        for j, x in enumerate(p['gelembung'], 1):
            gel.append({'id': f'{pid}-g{j}', **x})
        panel_jadi.append({'id': pid, 'nomor': i, 'adegan': penanda(p['adegan']), 'latar': p['latar'], 'tokoh': p['tokoh'], 'gambar_sementara': True,
                           'gelembung': gel, 'kataBantu': p['kataBantu'], 'tipsBunyi': p['tipsBunyi']})
    cek = []
    for n, c in enumerate(k['cek'], 1):
        sid = f'{unit}-c{n}'
        if c[0] == 'urutkan':
            cek.append({'id': sid, 'jenis': 'urutkan', 'panel': [f'{unit}-p{x}' for x in c[1]]})
        elif c[0] == 'siapa':
            pn, gn = c[1]
            gid = f'{unit}-p{pn}-g{gn}'
            kunci = k['panel'][pn - 1]['gelembung'][gn - 1]['tokoh']
            cek.append({'id': sid, 'jenis': 'siapa', 'gelembung': gid, 'pilihan': c[2], 'kunci': kunci})
        elif c[0] == 'dengar_panel':
            pn, gn = c[1]
            cek.append({'id': sid, 'jenis': 'dengar_panel', 'gelembung': f'{unit}-p{pn}-g{gn}', 'pilihan': [f'{unit}-p{x}' for x in c[2]], 'kunci': f'{unit}-p{pn}'})
        elif c[0] == 'lengkapi':
            pn, gn = c[1]
            cek.append({'id': sid, 'jenis': 'lengkapi', 'gelembung': f'{unit}-p{pn}-g{gn}', 'kataHilang': c[2], 'pilihan': c[3]})
    return {
        'id': f'{unit}-komik', 'unit': unit, 'tingkat': t, 'nomor': nomor, 'judul': k['judul'],
        'pesanAkhlak': k['pesanAkhlak'], 'pesanHariIni': k['pesanHariIni'], 'kataTarget': k['kataTarget'],
        'panel': panel_jadi, 'cekPaham': cek,
        'naskahOrangTua': {'langkah': [penanda(x) for x in k['naskah']], 'renungan': penanda(k['renungan']), 'pancingan': penanda(k['pancingan'])},
        'perbuatanBaik': penanda(k['perbuatanBaik']), 'pesanAkhlak': penanda(k['pesanAkhlak']), 'status': BP,
    }


# ---------- Bunyi Hari Ini ----------
JEBAKAN = [
    # (nomor, nama, tips, mulai tingkat, fungsi cocok)
    (1, 'huruf e bisu di akhir', 'Huruf e di akhir kata diam dan membuat huruf vokal sebelumnya "menyebut namanya": cake dibaca keik, fine dibaca fain.', 3, lambda w: ' ' not in w and re.search(r'(^|[^aeiou])[aeiou][^aeiouwyr]e$', w) is not None and len(w) <= 6),
    (2, 'a pendek', 'Mulut terbuka lebar seperti mau bilang "e" sambil tersenyum: cat, bag, apple.', 3, lambda w: ' ' not in w and (w in ('apple', 'happy', 'angry', 'black', 'rabbit', 'basket') or re.fullmatch(r'[^aeiou]*a[^aeiouwyrl]{1,2}s?', w) is not None)),
    (3, 'bunyi th', 'Ujung lidah keluar sedikit di antara gigi: thank, three, this, mother.', 3, lambda w: 'th' in w),
    (4, 'bunyi sh dan ch', 'sh dibaca "sy" panjang; ch dibaca seperti "c" Indonesia: fish, shoe, chair, lunch.', 3, lambda w: 'sh' in w or 'ch' in w),
    (5, 'ee dan ea', 'Dibaca "i" panjang: see, tree, eat.', 3, lambda w: 'ee' in w or ('ea' in w and 'ear' not in w)),
    (6, 'bunyi oo', 'Bibir maju membulat: book, school, food.', 4, lambda w: 'oo' in w),
    (7, 'v lawan f', 'Untuk v, gigi atas menyentuh bibir bawah sambil bersuara: very, five.', 4, lambda w: 'v' in w),
    (8, 'akhiran -s', 'Bunyi "s" atau "z" kecil di akhir tetap diucapkan: cats, dogs, likes.', 4, lambda w: w.endswith('s') and len(w) > 3),
    (9, 'huruf mati di akhir kata', 'Jangan buang huruf terakhir: hand, milk, big.', 4, lambda w: ' ' not in w and w[-1] in 'dkgtp' and len(w) > 2 and not w.endswith('ing') and not w.endswith('ed')),
    (10, 'r Inggris', 'Lidah tidak bergetar, sedikit ditarik ke belakang: red, rice.', 5, lambda w: w.startswith('r')),
    (11, 'akhiran -ed', 'Ada tiga bunyi: played (pleid), wanted (wan-tid), walked (wokt).', 6, lambda w: w.endswith('ed')),
    (12, 'bunyi w', 'Bibir membulat dulu, seperti "u" cepat: water, window.', 4, lambda w: w.startswith('w')),
    (13, 'suku kata lemah', 'Satu suku kata dibaca keras, yang lain pelan: banana, teacher.', 5, lambda w: len(w) >= 7 and ' ' not in w),
]

# Pilihan tangan untuk tingkat 3 dan 4 (sesuai tema), sisanya otomatis.
BUNYI_PILIH = {
    't3-u01': 1, 't3-u02': 3, 't3-u03': 5, 't3-u04': 2, 't3-u05': 3, 't3-u06': 4,
    't4-u01': 9, 't4-u02': 4, 't4-u03': 3, 't4-u04': 6, 't4-u05': 2, 't4-u06': 12,
}


def bunyi_unit(u, tingkat, terakhir):
    kata = [k['kata'] for k in u['kosakata'] + u.get('kataKomik', [])]
    urutan = [j for j in JEBAKAN if j[3] <= tingkat]
    pilih = BUNYI_PILIH.get(u['id'])
    calon = [j for j in urutan if j[0] == pilih] if pilih else []
    # otomatis: jebakan yang punya ≥ 2 kata contoh, bukan yang sama dengan unit sebelumnya
    if not calon:
        calon = sorted(urutan, key=lambda j: (j[0] == terakhir, -sum(1 for w in kata if j[4](w.lower()))))
    for j in calon:
        contoh = [w for w in kata if j[4](w.lower())][:4]
        if len(contoh) >= 2 or (pilih and contoh):
            return {'jebakan': j[0], 'bunyi': j[1], 'kata': contoh, 'tips': j[2], 'status': BP}
    j = calon[0]
    contoh = [w for w in kata if j[4](w.lower())][:4] or kata[:2]
    return {'jebakan': j[0], 'bunyi': j[1], 'kata': contoh, 'tips': j[2], 'status': BP}


# ---------- gerakan ----------
GERAK_KATA = [
    # (potongan kata, jenis, petunjuk)
    ('hello', 'lambai', 'Lambaikan tangan!'), ('goodbye', 'lambai', 'Lambaikan tangan untuk berpisah!'), ('hi', 'lambai', 'Lambaikan tangan!'),
    ('wake up', 'berdiri', 'Bangun dan regangkan badan!'), ('brush', 'sikat', 'Pura-pura menggosok gigi!'), ('bath', 'cuci', 'Pura-pura mandi!'),
    ('shower', 'cuci', 'Pura-pura mandi di bawah pancuran!'), ('wash', 'cuci', 'Pura-pura mencuci tangan!'), ('breakfast', 'makan', 'Pura-pura makan!'),
    ('go to school', 'lari', 'Jalan di tempat!'), ('study', 'baca', 'Pura-pura membaca buku!'), ('watch', 'duduk', 'Duduk manis seperti menonton!'),
    ('sleep', 'tidur', 'Pura-pura tidur!'), ('sleepy', 'tidur', 'Menguap dan pura-pura mengantuk!'), ('door', 'buka', 'Pura-pura membuka pintu!'),
    ('window', 'buka', 'Pura-pura membuka jendela!'), ('sofa', 'duduk', 'Duduk di sofa!'), ('chair', 'duduk', 'Duduk di kursi!'),
    ('eye', 'sentuh', 'Sentuh matamu pelan-pelan!'), ('ear', 'sentuh', 'Sentuh telingamu!'), ('nose', 'sentuh', 'Sentuh hidungmu!'),
    ('mouth', 'sentuh', 'Sentuh mulutmu!'), ('hair', 'sentuh', 'Sentuh rambutmu!'), ('hand', 'tepuk', 'Tepuk tanganmu!'),
    ('foot', 'lompat', 'Hentakkan kakimu!'), ('leg', 'lompat', 'Angkat kakimu!'), ('arm', 'putar', 'Putar lenganmu!'),
    ('happy', 'lompat', 'Tersenyum lebar dan melompat!'), ('excited', 'lompat', 'Melompat dengan semangat!'), ('surprised', 'buka', 'Buka mata lebar-lebar!'),
    ('milk', 'minum', 'Pura-pura minum!'), ('water', 'minum', 'Pura-pura minum!'), ('juice', 'minum', 'Pura-pura minum!'), ('tea', 'minum', 'Pura-pura minum!'),
    ('rice', 'makan', 'Pura-pura makan!'), ('bread', 'makan', 'Pura-pura makan roti!'), ('noodles', 'makan', 'Pura-pura makan mi!'), ('cake', 'makan', 'Pura-pura makan kue!'),
    ('run', 'lari', 'Lari di tempat!'), ('jump', 'lompat', 'Lompat di tempat!'), ('swim', 'putar', 'Pura-pura berenang!'), ('read', 'baca', 'Pura-pura membaca!'),
    ('write', 'tulis', 'Pura-pura menulis!'), ('draw', 'tulis', 'Pura-pura menggambar!'), ('sing', 'angguk', 'Bernyanyi sambil mengangguk!'), ('dance', 'putar', 'Menari berputar!'),
    ('walk', 'lari', 'Jalan di tempat!'), ('sit', 'duduk', 'Duduk!'), ('stand', 'berdiri', 'Berdiri tegak!'), ('cook', 'cuci', 'Pura-pura memasak!'),
    ('play', 'lompat', 'Pura-pura bermain bola!'), ('clap', 'tepuk', 'Tepuk tangan!'), ('turn', 'putar', 'Berputar!'), ('open', 'buka', 'Pura-pura membuka!'),
    ('ride', 'lari', 'Pura-pura bersepeda!'), ('climb', 'berdiri', 'Pura-pura memanjat!'), ('kick', 'lompat', 'Pura-pura menendang bola!'),
]


def gerakan_unit(u):
    hasil = []
    for k in u['kosakata']:
        w = k['kata'].lower()
        for pot, jenis, pet in GERAK_KATA:
            if (pot == w) or (' ' in pot and pot in w) or (' ' not in pot and (w == pot or w.startswith(pot + ' ') or w.endswith(' ' + pot) or (len(pot) >= 4 and w.startswith(pot)))):
                hasil.append({'kata': k['id'], 'jenis': jenis, 'petunjuk': pet})
                break
    return hasil


def main():
    for t in (3, 4, 5, 6):
        nama = f'inggris-t{t}.json'
        p = baca(nama)
        terakhir = None
        for u in p['unit']:
            tambah = TAMBAH_KOSAKATA.get(u['id'], [])
            ada = {k['kata'].lower() for k in u['kosakata']}
            kk = [x for x in tambah if x[0].lower() not in ada]
            if kk:
                u['kataKomik'] = [{'id': f"{u['id']}-kk{i:02d}", 'kata': kata, 'arti': arti, 'emoji': emoji, 'status': BP} for i, (kata, arti, emoji) in enumerate(kk, 1)]
            u['bunyiHariIni'] = bunyi_unit(u, t, terakhir)
            terakhir = u['bunyiHariIni']['jebakan']
            u['gerakan'] = gerakan_unit(u)
        tulis(nama, p)
    for t, petualangan in ((3, 'Halo, Robi!'), (4, 'Kabut Misterius')):
        daftar = [bangun_komik(k, i + 1) for i, k in enumerate([x for x in KOMIK if x['unit'].startswith(f't{t}-')])]
        tulis(f'komik-t{t}.json', {'id': f'komik-t{t}', 'versi': '2026.11.11', 'tingkat': t, 'petualangan': petualangan, 'komik': daftar})
    print('selesai: 12 komik, bunyi dan gerakan 48 unit')


if __name__ == '__main__':
    main()
