/**
 * Tambahan kartu Matematika kelas 6 (PROMPT-LANJUTAN-KOMIK tahap 7, rancangan 12 bagian 2: M1, M2, M4, L1).
 *
 * - `cobaBenda`: langkah "Coba dengan benda" (benda → gambar → angka) untuk topik yang cocok.
 * - `cerita`: satu soal cerita berlatar Aceh atau kehidupan sehari-hari. KUNCI TIDAK DITULIS TANGAN: dihitung
 *   pembangkit dari `hitung` (CLAUDE.md aturan 10). Status `belum_diperiksa`.
 * - `pancingan`: pertanyaan untuk orang tua, tampil di Mode Dampingi.
 *
 * Topik tanpa `cobaBenda` (geometri ruang dan bangun, diagram) dicatat di LAPORAN-LANJUTAN-KOMIK.md.
 */
import type { CobaBenda, GambarSederhana, ModelBatangData, PetunjukBertahap } from '../jenis';

export interface CeritaMentah {
  pertanyaan: string;
  hitung: string;
  petunjuk: PetunjukBertahap;
  pembahasan: string;
  modelBatang?: ModelBatangData;
  gambar?: GambarSederhana;
  /** tulisan kunci untuk hasil bukan bilangan bulat; bawaan pecahan */
  bentuk?: 'pecahan' | 'desimal';
}

export interface TambahanKartu {
  pancingan: string;
  cerita: CeritaMentah;
  /** `jawaban` diisi pembangkit dari `hitung` */
  cobaBenda?: Omit<CobaBenda, 'jawaban'>;
}

export const TAMBAHAN_K6: Record<string, TambahanKartu> = {
  'mat6-urutan-hitung': {
    pancingan: 'Minta ia menunjukkan uang yang dipakai, lalu tanyakan: "Mana yang dihitung dulu, kali atau tambah?"',
    cobaBenda: {
      soal: 'Fathan membeli 3 kue timphan. Harganya 2.000 per buah. Ia juga membeli teh 3.000.',
      perintah: 'Ambil uang sampai cukup untuk membayar semuanya.',
      benda: { jenis: 'uang', pilihan: [500, 1000, 2000, 5000], target: 9000 },
      teksGambar: 'Tiga ruas kue sama panjang, lalu satu ruas teh.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 2000 }, { nilai: 2000 }, { nilai: 2000 }, { nilai: 3000, label: 'teh' }] }], keseluruhan: { nilai: 9000, dicari: true }, depan: 'Rp' } },
      kalimat: '3 × 2.000 + 3.000 = 9.000',
      hitung: '3*2000+3000',
    },
    cerita: {
      pertanyaan: 'Di kedai, Fathan membeli 3 kue timphan seharga Rp2.000 per buah dan segelas teh Rp3.000. Berapa rupiah yang ia bayar?',
      hitung: '3*2000+3000',
      petunjuk: ['Hitung harga kue dulu.', '3 × 2.000 = 6.000.', '6.000 + 3.000 = …'],
      pembahasan: 'Perkalian dikerjakan dulu: 3 × 2.000 = 6.000. Lalu 6.000 + 3.000 = 9.000.',
      modelBatang: { baris: [{ ruas: [{ nilai: 2000 }, { nilai: 2000 }, { nilai: 2000 }, { nilai: 3000, label: 'teh' }] }], keseluruhan: { nilai: 9000, dicari: true }, depan: 'Rp' },
    },
  },
  'mat6-faktor-kelipatan': {
    pancingan: 'Hitung lompatannya bersama dengan suara keras: "4, 8, 12, …". Tanyakan: "Kenapa berhenti di sini?"',
    cobaBenda: {
      soal: 'Pinci melompat 4 langkah setiap kali, mulai dari 0.',
      perintah: 'Lompat sampai angka 24.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 24, langkah: 4 }, lompat: 4, target: 24 },
      teksGambar: 'Setiap lompatan sama panjang. Hitung banyak lompatan.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 24, langkah: 4, lompatan: [0, 4, 8, 12, 16, 20].map((d) => ({ dari: d, ke: d + 4 })) } },
      kalimat: '24 : 4 = 6 lompatan',
      hitung: '24/4',
    },
    cerita: {
      pertanyaan: 'Labi-labi berangkat dari terminal setiap 15 menit, mulai pukul 07.00. Berapa kali labi-labi berangkat dari pukul 07.00 sampai pukul 08.00?',
      hitung: '60/15+1',
      petunjuk: ['Tulis jam berangkatnya satu per satu.', '07.00, 07.15, 07.30, …', 'Jangan lupa pukul 07.00 dan 08.00 ikut dihitung.'],
      pembahasan: '07.00, 07.15, 07.30, 07.45, 08.00. Ada 60 : 15 = 4 jarak, jadi 5 kali berangkat.',
    },
  },
  'mat6-kpk-fpb': {
    pancingan: 'Minta ia menjelaskan: "Kapan kita pakai KPK dan kapan FPB?" Biarkan ia memberi contoh sendiri.',
    cobaBenda: {
      soal: 'Nisa melompat 3 langkah, Dafi melompat 4 langkah. Keduanya mulai dari 0.',
      perintah: 'Lompat 3 langkah sampai bertemu titik Dafi yang pertama.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 12, langkah: 1, titik: [{ nilai: 4, label: 'D' }, { nilai: 8, label: 'D' }, { nilai: 12, label: 'D' }] }, lompat: 3, target: 12 },
      teksGambar: 'Lompatan 3 dan lompatan 4 bertemu pertama kali di 12.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 12, langkah: 1, titik: [{ nilai: 12, label: 'bertemu' }], lompatan: [0, 3, 6, 9].map((d) => ({ dari: d, ke: d + 3 })) } },
      kalimat: 'KPK dari 3 dan 4 = 12',
      hitung: 'kpk(3,4)',
    },
    cerita: {
      pertanyaan: 'Nek Ijah punya 24 pisang dan 36 jeruk. Semua dimasukkan ke kantong dengan isi sama, tanpa sisa, dan kantongnya sebanyak mungkin. Berapa kantong yang dibutuhkan?',
      hitung: 'fpb(24,36)',
      petunjuk: ['Dibagi sama rata dan sebanyak mungkin: cari FPB.', 'Faktor 24 dan 36 yang sama: 1, 2, 3, 4, 6, 12.', 'Yang terbesar adalah …'],
      pembahasan: 'FPB dari 24 dan 36 adalah 12. Jadi 12 kantong, tiap kantong 2 pisang dan 3 jeruk.',
    },
  },
  'mat6-pecahan-senilai': {
    pancingan: 'Potong kue atau roti sungguhan bersama. Tanyakan: "Setengah itu sama dengan berapa potong kecil?"',
    cobaBenda: {
      soal: 'Kue bhoi dipotong menjadi 8 bagian sama besar.',
      perintah: 'Warnai setengah kue.',
      benda: { jenis: 'potongan', bentuk: 'lingkaran', bagian: 8, target: 4 },
      teksGambar: '4 dari 8 ruas sama panjang dengan setengah batang.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 4, dicari: true }, { nilai: 4 }] }], keseluruhan: { nilai: 8, label: '1 kue' }, penyebut: 8 } },
      kalimat: '4/8 = 1/2',
      hitung: '4/8',
    },
    cerita: {
      pertanyaan: 'Bima memotong kue bhoi menjadi 12 potong sama besar dan memakan 3 potong. Tulis bagian kue yang dimakan dalam pecahan paling sederhana.',
      hitung: '3/12',
      petunjuk: ['Bagian yang dimakan: 3 dari 12.', 'Bagi pembilang dan penyebut dengan bilangan yang sama.', '3/12 dibagi 3 menjadi …'],
      pembahasan: '3/12 = 1/4 (pembilang dan penyebut dibagi 3).',
      modelBatang: { baris: [{ ruas: [{ nilai: 3, dicari: true }, { nilai: 9, label: 'sisa' }] }], keseluruhan: { nilai: 12, label: '1 kue' }, penyebut: 12 },
    },
  },
  'mat6-banding-pecahan': {
    pancingan: 'Gambar dua batang sama panjang di kertas. Minta ia mewarnai 2/3 dan 3/4, lalu menunjuk mana yang lebih panjang.',
    cobaBenda: {
      soal: 'Batang cokelat dibagi menjadi 12 kotak kecil.',
      perintah: 'Warnai 3/4 batang (berapa kotak?).',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 12, target: 9 },
      teksGambar: '3/4 = 9 kotak, 2/3 = 8 kotak. Batang 3/4 lebih panjang.',
      gambar: { jenis: 'batang', data: { baris: [{ label: '3/4', ruas: [{ nilai: 9, dicari: true }, { nilai: 3 }] }, { label: '2/3', ruas: [{ nilai: 8 }, { nilai: 4 }] }], penyebut: 12 } },
      kalimat: '3/4 = 9/12 lebih besar dari 2/3 = 8/12',
      hitung: '9/12',
    },
    cerita: {
      pertanyaan: 'Lina menanam cabai di 2/3 kebunnya. Dafi menanam cabai di 3/4 kebun yang sama besar. Berapa selisih bagian kebun yang ditanami?',
      hitung: '3/4-2/3',
      petunjuk: ['Samakan penyebutnya.', '2/3 = 8/12 dan 3/4 = 9/12.', '9/12 − 8/12 = …'],
      pembahasan: '3/4 − 2/3 = 9/12 − 8/12 = 1/12.',
      modelBatang: { baris: [{ label: 'Dafi', ruas: [{ nilai: 8 }, { nilai: 1, dicari: true }] }, { label: 'Lina', ruas: [{ nilai: 8 }] }], penyebut: 12 },
    },
  },
  'mat6-pecahan-desimal': {
    pancingan: 'Tanyakan: "Kalau satu batang dibagi 10, tiap potong namanya apa?" Ajak ia menyebut "nol koma …".',
    cobaBenda: {
      soal: 'Satu batang dibagi menjadi 10 bagian sama besar.',
      perintah: 'Warnai 7 bagian.',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 10, target: 7 },
      teksGambar: '7 dari 10 bagian. Tiap bagian adalah 0,1.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 1, langkah: 0.1, penyebut: 10, titik: [{ nilai: 0.7, label: '7/10' }] } },
      kalimat: '7/10 = 0,7',
      hitung: '7/10',
    },
    cerita: {
      pertanyaan: 'Panjang tali layang-layang Fathan 3/4 meter. Tulis panjang tali itu dalam bentuk desimal.',
      hitung: '3/4',
      bentuk: 'desimal',
      petunjuk: ['Ubah penyebut menjadi 100.', '3/4 = 75/100.', '75/100 ditulis …'],
      pembahasan: '3/4 = 75/100 = 0,75 meter.',
      modelBatang: { baris: [{ ruas: [{ nilai: 75, dicari: true }, { nilai: 25 }] }], keseluruhan: { nilai: 100, label: '1 m' }, penyebut: 100 },
    },
  },
  'mat6-persen': {
    pancingan: 'Saat belanja, tunjukkan tulisan potongan harga. Tanyakan: "Kalau potongannya 10%, berapa rupiah?"',
    cobaBenda: {
      soal: 'Satu batang dibagi 10 bagian. Tiap bagian 10%.',
      perintah: 'Warnai 30%.',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 10, target: 3 },
      teksGambar: '3 bagian dari 10 = 30 dari 100.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 30, dicari: true }, { nilai: 70 }] }], keseluruhan: { nilai: 100, label: '100%' }, satuan: '%' } },
      kalimat: '3/10 = 30/100 = 30%',
      hitung: '3/10*100',
    },
    cerita: {
      pertanyaan: 'Harga sandal di Pasar Aceh Rp40.000. Ada potongan harga 25%. Berapa rupiah potongannya?',
      hitung: '25/100*40000',
      petunjuk: ['25% sama dengan 1/4.', 'Bagi 40.000 menjadi 4 bagian.', '40.000 : 4 = …'],
      pembahasan: '25% × 40.000 = 1/4 × 40.000 = 10.000.',
      modelBatang: { baris: [{ ruas: [{ nilai: 10000, dicari: true, label: '25%' }, { nilai: 30000 }] }], keseluruhan: { nilai: 40000 }, depan: 'Rp' },
    },
  },
  'mat6-tambah-kurang-pecahan': {
    pancingan: 'Minta ia menjelaskan kenapa penyebut harus disamakan dulu, memakai gambar potongan kue.',
    cobaBenda: {
      soal: 'Kue lapis dipotong 8 sama besar. Rani makan 1/4, Nisa makan 3/8.',
      perintah: 'Warnai bagian yang dimakan keduanya.',
      benda: { jenis: 'potongan', bentuk: 'lingkaran', bagian: 8, target: 5 },
      teksGambar: '1/4 = 2 potong, 3/8 = 3 potong.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 2, dicari: true, label: 'Rani' }, { nilai: 3, dicari: true, label: 'Nisa' }, { nilai: 3 }] }], keseluruhan: { nilai: 8, label: '1 kue' }, penyebut: 8 } },
      kalimat: '1/4 + 3/8 = 2/8 + 3/8 = 5/8',
      hitung: '1/4+3/8',
    },
    cerita: {
      pertanyaan: 'Ayah mengecat 1/3 pagar pada pagi hari dan 1/2 pagar pada sore hari. Berapa bagian pagar yang sudah dicat?',
      hitung: '1/3+1/2',
      petunjuk: ['Samakan penyebut: 6.', '1/3 = 2/6 dan 1/2 = 3/6.', '2/6 + 3/6 = …'],
      pembahasan: '1/3 + 1/2 = 2/6 + 3/6 = 5/6 pagar.',
      modelBatang: { baris: [{ ruas: [{ nilai: 2, dicari: true, label: 'pagi' }, { nilai: 3, dicari: true, label: 'sore' }, { nilai: 1 }] }], keseluruhan: { nilai: 6, label: 'pagar' }, penyebut: 6 },
    },
  },
  'mat6-kali-pecahan': {
    pancingan: 'Pakai 12 butir telur atau kelereng. Minta ia membagi menjadi 4 kelompok, lalu ambil 3 kelompok.',
    cobaBenda: {
      soal: 'Ada 12 telur. Ibu memakai 3/4 bagian untuk kue.',
      perintah: 'Bagi batang menjadi 4, lalu warnai 3 bagian.',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 4, target: 3 },
      teksGambar: 'Batang 12 dibagi 4: tiap ruas 3 telur.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 3, dicari: true }, { nilai: 3, dicari: true }, { nilai: 3, dicari: true }, { nilai: 3 }] }], keseluruhan: { nilai: 12, label: '12 telur' } } },
      kalimat: '3/4 × 12 = 9',
      hitung: '3/4*12',
    },
    cerita: {
      pertanyaan: 'Panen padi Pak Hasan 60 karung. Sebanyak 2/3 dijual ke kilang padi. Berapa karung yang dijual?',
      hitung: '2/3*60',
      petunjuk: ['Bagi 60 menjadi 3 bagian sama.', 'Tiap bagian 20 karung.', 'Ambil 2 bagian: …'],
      pembahasan: '60 : 3 = 20. Jadi 2/3 × 60 = 2 × 20 = 40 karung.',
      modelBatang: { baris: [{ ruas: [{ nilai: 20, dicari: true }, { nilai: 20, dicari: true }, { nilai: 20 }] }], keseluruhan: { nilai: 60 }, satuan: 'karung' },
    },
  },
  'mat6-bagi-pecahan': {
    pancingan: 'Tanyakan: "Ada berapa setengah di dalam 3?" Biarkan ia menghitung dengan menggambar.',
    cobaBenda: {
      soal: 'Ada 3 roti. Setiap anak mendapat 1/2 roti.',
      perintah: 'Lompat 1/2 sampai angka 3.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 3, langkah: 0.5, penyebut: 2 }, lompat: 0.5, target: 3 },
      teksGambar: 'Hitung lompatan 1/2 dari 0 sampai 3.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 3, langkah: 0.5, penyebut: 2, lompatan: [0, 0.5, 1, 1.5, 2, 2.5].map((d) => ({ dari: d, ke: d + 0.5 })) } },
      kalimat: '3 : 1/2 = 6 anak',
      hitung: '3/(1/2)',
    },
    cerita: {
      pertanyaan: 'Kak Fajar punya 6 liter air tebu. Air itu dituang ke botol yang masing-masing berisi 3/4 liter. Berapa botol yang terisi penuh?',
      hitung: '6/(3/4)',
      petunjuk: ['Membagi dengan pecahan = mengali dengan kebalikannya.', '6 : 3/4 = 6 × 4/3.', '24 : 3 = …'],
      pembahasan: '6 : 3/4 = 6 × 4/3 = 24/3 = 8 botol.',
    },
  },
  'mat6-hitung-campuran-bentuk': {
    pancingan: 'Minta ia mengubah semua ke bentuk yang sama dulu (semua pecahan atau semua persen), lalu menjelaskan pilihannya.',
    cobaBenda: {
      soal: 'Uang jajan 20.000. Sebanyak 75% ditabung.',
      perintah: 'Ambil uang sebanyak yang ditabung.',
      benda: { jenis: 'uang', pilihan: [1000, 2000, 5000, 10000], target: 15000 },
      teksGambar: '100% dibagi 4. Tiga ruas = 75%.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 5000, dicari: true }, { nilai: 5000, dicari: true }, { nilai: 5000, dicari: true }, { nilai: 5000 }] }], keseluruhan: { nilai: 20000 }, depan: 'Rp' } },
      kalimat: '75% × 20.000 = 15.000',
      hitung: '75/100*20000',
    },
    cerita: {
      pertanyaan: 'Uang Nisa Rp50.000. Ia memakai 20% untuk membeli buku dan 1/2 untuk membeli tas. Berapa rupiah sisa uangnya?',
      hitung: '50000-20/100*50000-1/2*50000',
      petunjuk: ['Hitung harga buku: 20% dari 50.000.', 'Buku 10.000, tas 25.000.', '50.000 − 10.000 − 25.000 = …'],
      pembahasan: 'Buku 10.000 dan tas 25.000. Sisa 50.000 − 35.000 = 15.000.',
      modelBatang: { baris: [{ ruas: [{ nilai: 10000, label: 'buku' }, { nilai: 25000, label: 'tas' }, { nilai: 15000, dicari: true }] }], keseluruhan: { nilai: 50000 }, depan: 'Rp' },
    },
  },
  'mat6-satuan-panjang-berat': {
    pancingan: 'Saat berjalan atau naik motor, tanyakan: "Kira-kira berapa meter lagi sampai?"',
    cobaBenda: {
      soal: 'Rumah Dafi ke sekolah 3 km.',
      perintah: 'Lompat 1.000 meter setiap kali sampai 3 km.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 3000, langkah: 500, satuan: 'm' }, lompat: 1000, target: 3000 },
      teksGambar: 'Setiap 1 km = 1.000 m.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 3000, langkah: 500, satuan: 'm', lompatan: [0, 1000, 2000].map((d) => ({ dari: d, ke: d + 1000, label: '1 km' })) } },
      kalimat: '3 km = 3 × 1.000 = 3.000 m',
      hitung: '3*1000',
    },
    cerita: {
      pertanyaan: 'Jarak rumah Dafi ke Pantai Ulee Lheue 2,5 km. Berapa meter jaraknya?',
      hitung: '2.5*1000',
      petunjuk: ['1 km = 1.000 m.', '2 km = 2.000 m, setengah km = 500 m.', '2.000 + 500 = …'],
      pembahasan: '2,5 × 1.000 = 2.500 meter.',
    },
  },
  'mat6-satuan-volume': {
    pancingan: 'Pakai gelas ukur atau botol air di dapur. Minta ia menebak dulu, lalu menuang untuk membuktikan.',
    cobaBenda: {
      soal: 'Satu gelas berisi 250 mililiter.',
      perintah: 'Warnai gelas sampai 1 liter penuh.',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 4, target: 4 },
      teksGambar: '4 gelas × 250 ml = 1.000 ml = 1 liter.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 250 }, { nilai: 250 }, { nilai: 250 }, { nilai: 250 }] }], keseluruhan: { nilai: 1000, dicari: true }, satuan: 'ml' } },
      kalimat: '4 × 250 = 1.000 ml',
      hitung: '4*250',
    },
    cerita: {
      pertanyaan: 'Ibu membeli 3 botol minyak goreng. Isi setiap botol 1,5 liter. Berapa mililiter isi semuanya?',
      hitung: '3*1.5*1000',
      petunjuk: ['Hitung liternya dulu.', '3 × 1,5 = 4,5 liter.', '1 liter = 1.000 ml, jadi 4,5 liter = …'],
      pembahasan: '3 × 1,5 = 4,5 liter = 4.500 mililiter.',
    },
  },
  'mat6-lama-waktu': {
    pancingan: 'Pakai jam dinding di rumah. Tanyakan: "Dari jam ini sampai jam makan siang, berapa menit lagi?"',
    cobaBenda: {
      soal: 'Belajar mulai pukul 08.00 dan selesai pukul 10.30.',
      perintah: 'Lompat 30 menit setiap kali sampai selesai.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 150, langkah: 30, satuan: 'mnt' }, lompat: 30, target: 150 },
      teksGambar: '5 lompatan 30 menit.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 150, langkah: 30, satuan: 'mnt', lompatan: [0, 30, 60, 90, 120].map((d) => ({ dari: d, ke: d + 30 })) } },
      kalimat: '2 jam 30 menit = 2 × 60 + 30 = 150 menit',
      hitung: '2*60+30',
    },
    cerita: {
      pertanyaan: 'Labi-labi berangkat dari Lambaro pukul 07.45 dan tiba di Peunayong pukul 08.20. Berapa menit perjalanannya?',
      hitung: '60-45+20',
      petunjuk: ['Hitung dari 07.45 sampai 08.00 dulu.', '07.45 sampai 08.00 = 15 menit.', '15 + 20 = …'],
      pembahasan: '07.45 → 08.00 = 15 menit, 08.00 → 08.20 = 20 menit. Jumlah 35 menit.',
    },
  },
  'mat6-kecepatan': {
    pancingan: 'Saat bepergian, lihat papan jarak di jalan. Tanyakan: "Kalau 40 km per jam, sampai dalam berapa jam?"',
    cobaBenda: {
      soal: 'Labi-labi melaju 30 km setiap jam.',
      perintah: 'Lompat 30 km setiap jam sampai 3 jam.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 90, langkah: 30, satuan: 'km' }, lompat: 30, target: 90 },
      teksGambar: 'Setiap lompatan = 1 jam.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 90, langkah: 30, satuan: 'km', lompatan: [0, 30, 60].map((d) => ({ dari: d, ke: d + 30, label: '1 jam' })) } },
      kalimat: 'jarak = 30 × 3 = 90 km',
      hitung: '30*3',
    },
    cerita: {
      pertanyaan: 'Bus dari Banda Aceh ke Sigli melaju rata-rata 40 km per jam selama 3 jam. Berapa km jarak yang ditempuh?',
      hitung: '40*3',
      petunjuk: ['Jarak = kecepatan × waktu.', 'Kecepatan 40, waktu 3.', '40 × 3 = …'],
      pembahasan: 'Jarak = 40 × 3 = 120 km.',
    },
  },
  'mat6-keliling-luas': {
    pancingan: 'Ukur meja atau lantai kamar bersama dengan meteran. Minta ia menghitung luasnya.',
    cerita: {
      pertanyaan: 'Sawah Pak Hasan berbentuk persegi panjang, panjangnya 25 m dan lebarnya 12 m. Berapa meter persegi luasnya?',
      hitung: '25*12',
      petunjuk: ['Luas persegi panjang = panjang × lebar.', '25 × 12.', '25 × 12 = 25 × 10 + 25 × 2 = …'],
      pembahasan: 'Luas = 25 × 12 = 300 meter persegi.',
    },
  },
  'mat6-luas-segitiga-segi4': {
    pancingan: 'Gunting kertas berbentuk persegi panjang menjadi dua segitiga. Tanyakan: "Luas segitiga berapa bagian dari persegi panjangnya?"',
    cerita: {
      pertanyaan: 'Layang-layang Bima berbentuk segitiga dengan alas 40 cm dan tinggi 30 cm. Berapa cm persegi luasnya?',
      hitung: '40*30/2',
      petunjuk: ['Luas segitiga = alas × tinggi : 2.', '40 × 30 = 1.200.', '1.200 : 2 = …'],
      pembahasan: 'Luas = 40 × 30 : 2 = 600 cm persegi.',
    },
  },
  'mat6-sudut': {
    pancingan: 'Pakai jam dinding. Tanyakan: "Jam berapa jarumnya membentuk sudut siku-siku?"',
    cerita: {
      pertanyaan: 'Jam dinding di kelas menunjukkan pukul 03.00. Berapa derajat sudut antara jarum pendek dan jarum panjang?',
      hitung: '3*30',
      petunjuk: ['Satu putaran 360 derajat dibagi 12 angka.', 'Jarak satu angka = 30 derajat.', 'Dari 12 ke 3 ada 3 angka: …'],
      pembahasan: '360 : 12 = 30 derajat per angka. 3 × 30 = 90 derajat.',
    },
  },
  'mat6-kekongruenan': {
    pancingan: 'Cari dua benda yang bentuk dan ukurannya sama persis di rumah (ubin, piring). Minta ia membuktikan dengan menumpuknya.',
    cerita: {
      pertanyaan: 'Dua ubin lantai di rumah Lina kongruen. Panjang sisi ubin pertama 30 cm. Berapa cm panjang sisi ubin kedua yang bersesuaian?',
      hitung: '30',
      petunjuk: ['Kongruen artinya bentuk dan ukurannya sama.', 'Sisi yang bersesuaian sama panjang.', 'Jadi sisinya …'],
      pembahasan: 'Bangun yang kongruen punya sisi bersesuaian yang sama panjang: 30 cm.',
    },
  },
  'mat6-pembulatan': {
    pancingan: 'Saat belanja, minta ia menaksir total belanja dengan membulatkan harga ke ribuan terdekat.',
    cobaBenda: {
      soal: 'Ada 268 butir jagung.',
      perintah: 'Susun 268 dengan balok ratusan, puluhan, dan satuan.',
      benda: { jenis: 'blok', target: 268 },
      teksGambar: '268 lebih dekat ke 300 daripada ke 200.',
      gambar: { jenis: 'garis', data: { mulai: 200, akhir: 300, langkah: 10, titik: [{ nilai: 268, label: '268' }] } },
      kalimat: '268 dibulatkan ke ratusan terdekat = 300',
      hitung: 'bulat(268,100)',
    },
    cerita: {
      pertanyaan: 'Pengunjung Pantai Lampuuk pada hari Minggu ada 1.468 orang. Bulatkan ke ratusan terdekat.',
      hitung: 'bulat(1468,100)',
      petunjuk: ['Lihat angka puluhan: 6.', '6 lebih dari 5, jadi dibulatkan ke atas.', '1.468 menjadi …'],
      pembahasan: 'Angka puluhan 6 ≥ 5, jadi 1.468 dibulatkan menjadi 1.500.',
    },
  },
  'mat6-volume-kubus-balok': {
    pancingan: 'Pakai kotak kecil (kotak susu, kardus). Minta ia menebak berapa kubus kecil yang muat di dalamnya.',
    cerita: {
      pertanyaan: 'Bak air di rumah berbentuk balok dengan panjang 80 cm, lebar 50 cm, dan tinggi 60 cm. Berapa liter isinya kalau penuh? (1 liter = 1.000 cm kubik)',
      hitung: '80*50*60/1000',
      petunjuk: ['Volume balok = panjang × lebar × tinggi.', '80 × 50 × 60 = 240.000 cm kubik.', '240.000 : 1.000 = …'],
      pembahasan: '80 × 50 × 60 = 240.000 cm kubik = 240 liter.',
    },
  },
  'mat6-luas-permukaan': {
    pancingan: 'Buka sebuah kotak kardus menjadi jaring-jaring. Minta ia menghitung ada berapa sisi.',
    cerita: {
      pertanyaan: 'Kotak kado berbentuk kubus dengan sisi 20 cm akan dibungkus kertas. Berapa cm persegi kertas paling sedikit yang dibutuhkan?',
      hitung: '6*20*20',
      petunjuk: ['Kubus punya 6 sisi persegi.', 'Luas satu sisi = 20 × 20 = 400.', '6 × 400 = …'],
      pembahasan: 'Luas permukaan = 6 × 20 × 20 = 2.400 cm persegi.',
    },
  },
  'mat6-tampak-kubus': {
    pancingan: 'Susun balok mainan atau kotak korek api bersama. Tanyakan: "Kalau dilihat dari atas, bentuknya seperti apa?"',
    cerita: {
      pertanyaan: 'Lina menyusun kubus kecil menjadi balok: panjang 3 kubus, lebar 2 kubus, dan tinggi 2 kubus. Berapa kubus kecil yang dipakai?',
      hitung: '3*2*2',
      petunjuk: ['Hitung kubus di lapisan bawah dulu.', 'Lapisan bawah 3 × 2 = 6 kubus.', 'Ada 2 lapisan: …'],
      pembahasan: '3 × 2 = 6 kubus per lapisan, 2 lapisan = 12 kubus.',
    },
  },
  'mat6-rasio': {
    pancingan: 'Minta ia menggambar batangnya sendiri di kertas dan menjelaskan arti setiap ruas.',
    cobaBenda: {
      soal: 'Perbandingan kelereng Nisa dan Dafi 2 : 3. Jumlahnya 20.',
      perintah: 'Bagi batang menjadi 5 ruas, lalu warnai bagian Nisa.',
      benda: { jenis: 'potongan', bentuk: 'batang', bagian: 5, target: 2 },
      teksGambar: '5 ruas = 20 kelereng, jadi 1 ruas = 4.',
      gambar: { jenis: 'batang', data: { baris: [{ label: 'Nisa', ruas: [{ nilai: 4, dicari: true }, { nilai: 4, dicari: true }] }, { label: 'Dafi', ruas: [{ nilai: 4 }, { nilai: 4 }, { nilai: 4 }] }], keseluruhan: { nilai: 20 } } },
      kalimat: 'Nisa = 2 × 4 = 8 kelereng',
      hitung: '2/5*20',
    },
    cerita: {
      pertanyaan: 'Perbandingan kelereng Fathan dan Dafi 3 : 5. Jumlah kelereng mereka 40. Berapa kelereng Dafi?',
      hitung: '5/8*40',
      petunjuk: ['Jumlah bagian: 3 + 5 = 8.', '1 bagian = 40 : 8 = 5 kelereng.', 'Dafi punya 5 bagian: …'],
      pembahasan: '40 : 8 = 5. Dafi = 5 × 5 = 25 kelereng.',
      modelBatang: {
        baris: [
          { label: 'Fathan', ruas: [{ nilai: 5 }, { nilai: 5 }, { nilai: 5 }] },
          { label: 'Dafi', ruas: [{ nilai: 5, dicari: true }, { nilai: 5, dicari: true }, { nilai: 5, dicari: true }, { nilai: 5, dicari: true }, { nilai: 5, dicari: true }] },
        ],
        keseluruhan: { nilai: 40 },
      },
    },
  },
  'mat6-senilai-berbalik': {
    pancingan: 'Tanyakan: "Kalau yang bekerja makin banyak, waktunya makin lama atau makin cepat?" Minta alasannya.',
    cobaBenda: {
      soal: '2 kg beras harganya 30.000.',
      perintah: 'Ambil uang untuk membeli 5 kg.',
      benda: { jenis: 'uang', pilihan: [5000, 10000, 20000, 50000], target: 75000 },
      teksGambar: '1 kg = 15.000. Lima ruas 15.000.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [15000, 15000, 15000, 15000, 15000].map((n) => ({ nilai: n })) }], keseluruhan: { nilai: 75000, dicari: true }, depan: 'Rp' } },
      kalimat: '30.000 : 2 × 5 = 75.000',
      hitung: '30000/2*5',
    },
    cerita: {
      pertanyaan: 'Untuk memanen sawah, 4 orang membutuhkan 6 hari. Kalau dikerjakan 8 orang dengan kecepatan yang sama, berapa hari yang dibutuhkan?',
      hitung: '4*6/8',
      petunjuk: ['Makin banyak orang, makin sedikit hari: berbalik nilai.', 'Pekerjaan = 4 × 6 = 24 hari-orang.', '24 : 8 = …'],
      pembahasan: '4 × 6 = 24. Dibagi 8 orang: 24 : 8 = 3 hari.',
      modelBatang: { baris: [{ label: '8 orang', ruas: [{ nilai: 3, dicari: true }] }, { label: '4 orang', ruas: [{ nilai: 6 }] }], satuan: 'hari' },
    },
  },
  'mat6-skala': {
    pancingan: 'Buka peta di HP atau buku. Minta ia mengukur jarak dua kota dengan penggaris, lalu menghitung jarak sebenarnya.',
    cobaBenda: {
      soal: 'Pada peta, 1 cm sama dengan 1 km.',
      perintah: 'Lompat 1 cm setiap kali sampai 3 cm.',
      benda: { jenis: 'lompat', garis: { mulai: 0, akhir: 5, langkah: 1, satuan: 'cm' }, lompat: 1, target: 3 },
      teksGambar: 'Setiap 1 cm di peta = 1 km sebenarnya.',
      gambar: { jenis: 'garis', data: { mulai: 0, akhir: 5, langkah: 1, satuan: 'km', lompatan: [0, 1, 2].map((d) => ({ dari: d, ke: d + 1 })) } },
      kalimat: '3 cm di peta = 3 km',
      hitung: '3*100000/100000',
    },
    cerita: {
      pertanyaan: 'Pada peta berskala 1 : 500.000, jarak Banda Aceh ke Sigli 22 cm. Berapa km jarak sebenarnya?',
      hitung: '22*500000/100000',
      petunjuk: ['Jarak sebenarnya = jarak peta × 500.000.', '22 × 500.000 = 11.000.000 cm.', '1 km = 100.000 cm, jadi …'],
      pembahasan: '22 × 500.000 = 11.000.000 cm = 110 km.',
    },
  },
  'mat6-diagram': {
    pancingan: 'Catat bersama suhu atau jumlah telur ayam selama seminggu, lalu gambar diagram batangnya.',
    cerita: {
      pertanyaan: 'Panen cabai Lina: Senin 30 kg, Selasa 45 kg, Rabu 25 kg. Berapa kg selisih panen terbanyak dan tersedikit?',
      hitung: '45-25',
      petunjuk: ['Cari batang tertinggi dan terendah.', 'Terbanyak 45 kg, tersedikit 25 kg.', '45 − 25 = …'],
      pembahasan: 'Selisih = 45 − 25 = 20 kg.',
      gambar: { jenis: 'batang', nilai: [30, 45, 25], label: ['Sen', 'Sel', 'Rab'] },
    },
  },
  'mat6-rata-rata': {
    pancingan: 'Minta ia "meratakan" tumpukan kelereng atau batu: pindahkan dari tumpukan tinggi ke yang rendah sampai sama.',
    cobaBenda: {
      soal: 'Tiga tumpukan kelereng: 6, 8, dan 7.',
      perintah: 'Susun jumlah semua kelereng dengan balok.',
      benda: { jenis: 'blok', target: 21 },
      teksGambar: '21 dibagi rata ke 3 tumpukan.',
      gambar: { jenis: 'batang', data: { baris: [{ ruas: [{ nilai: 7, dicari: true }, { nilai: 7 }, { nilai: 7 }] }], keseluruhan: { nilai: 21, label: '6 + 8 + 7' } } },
      kalimat: '(6 + 8 + 7) : 3 = 7',
      hitung: '(6+8+7)/3',
    },
    cerita: {
      pertanyaan: 'Nilai ulangan Nisa minggu ini 80, 75, dan 85. Berapa rata-rata nilainya?',
      hitung: '(80+75+85)/3',
      petunjuk: ['Jumlahkan semua nilai.', '80 + 75 + 85 = 240.', '240 : 3 = …'],
      pembahasan: '(80 + 75 + 85) : 3 = 240 : 3 = 80.',
    },
  },
};
