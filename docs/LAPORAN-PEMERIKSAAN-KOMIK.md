# Laporan Pemeriksaan Lanjutan Komik (Tahap 25.8)

Tanggal: 11 November 2026. Dua pemeriksa bebas (bukan pembuat kode) memeriksa naskah komik dan privasi rekaman. Laporan lengkap ada di `docs/pemeriksaan/naskah-komik.md` dan `docs/pemeriksaan/privasi-rekaman.md`.

## 1. Naskah komik (12 komik)

Yang sudah benar: semua berstatus `belum_diperiksa`, batas panel dan kata dipatuhi, kata target muncul, kunci Cek Paham cocok, tanpa kekerasan, senjata, kata ibadah, atau tiruan tokoh kartun.

| Temuan | Tingkat | Tindakan |
|---|---|---|
| Kata *kenduri* di adegan t4-u01 dan t4-u02 (di Aceh biasanya disertai doa, aturan 9) | Penting | **Diganti "pesta panen".** Kalau Acut ingin memakai *kenduri*, tinggal dikembalikan |
| Pengecoh "sofa" (t4-u06) dan "milk" (t4-u02) di soal Lengkapi bisa juga benar | Penting/sedang | **Diganti** dengan kata yang jelas tidak cocok |
| Bahasa Inggris kurang wajar: *no help* → *don't help*; *It is me* → *It was me*; Robi *I love my family too* → *I love your family too*; *Please, please!* dan *No… I sleep* diganti kalimat yang sesuai arti | Sedang | **Diperbaiki** |
| Tips bunyi gaya Britania (r tidak dibunyikan) untuk *more*, *party*, *are you*, padahal suara contoh en-US | Sedang | **Diperbaiki** ke gaya Amerika (r dibunyikan lembut) |
| "Lima sahabat" padahal yang tampil empat tokoh (t3-u02) | Kecil | **Diperbaiki** |
| Tema pesta ulang tahun (t4-u03) dan kata *magic* (t4-u04) | Pertanyaan | **Ditanyakan ke Acut** (lihat LAPORAN-LANJUTAN-KOMIK.md) |
| Mister Kabut berbisik di jendela saat anak tidur terasa seram; kesalahan anak selalu "karena dibisiki kabut" | Sedang | **Belum diubah.** Dicatat untuk guru dan desainer saat menggambar panel asli; usulan: Mister Kabut tampil lucu dan siang hari, dan anak mengakui kesalahannya sendiri |
| Arti kecil (*foot*, *evening*, *at night*), kata baru > 2 di beberapa komik | Kecil | Dibiarkan untuk pemeriksaan guru (daftar di laporan lengkap) |

## 2. Privasi rekaman suara (aturan 12)

Yang sudah benar: rekaman dan alamat berkasnya tidak pernah masuk tabel data, antrean sinkron, server, atau halaman staf. Yang terkirim hanya `ada_rekaman` ya/tidak. Tombol rekam hanya tampil dengan Izin 8, izin mikrofon diminta saat pertama menekan rekam, batas 20 detik dan 2 menit, tanpa tombol bagikan, tanpa penilaian mesin. expo-audio dan expo-file-system adalah modul resmi Expo tanpa pelacak.

| Temuan | Tingkat | Tindakan |
|---|---|---|
| Rekaman yang terputus (pindah panel saat merekam) tertinggal di folder sementara | Penting | **Diperbaiki:** perekam dihentikan dan berkas sementara dibuang saat layar ditinggal; folder sementara juga dibersihkan saat aplikasi dibuka dan saat "Hapus semua" |
| Hapus profil anak tidak menghapus rekamannya | Penting | **Diperbaiki** + uji |
| `allowBackup: false` tidak menghentikan pindah data antar-HP di Android 12+ | Sedang | **Diperbaiki:** plugin `plugins/tanpa-cadangan.js` menambah `dataExtractionRules` dan `fullBackupContent="false"` |
| Batas kenangan dihitung 5 per anak, padahal aturan "paling banyak 5" | Sedang | **Diperbaiki:** 5 untuk seluruh HP, teks layar disesuaikan |
| Rekaman milik profil yang sudah tidak ada tidak pernah dibersihkan | Sedang | **Diperbaiki:** dibuang saat aplikasi dibuka |
| Temuan kecil (K1–K8): galat tanpa `.catch`, perekam ganda di panel terakhir, dan lain-lain | Kecil | Dicatat; tidak menyentuh server atau data orang lain |

## 3. Uji lain

- `npm run periksa`: tsc + eslint + 64 berkas uji (588 uji) lulus.
- Uji SQL semua migrasi (termasuk `cerita_ulang`) lulus di Postgres lokal.
- **Tanpa sinyal:** tangkapan layar komik (K30, K31) dan Dampingi (D10, D11, Izin 8, Tebak Gerak, rapor, kartu benda) dijalankan dengan semua permintaan ke luar diblokir: tidak ada permintaan ke luar, tanpa galat halaman.
- Tangkapan layar: `docs/tangkapan/komik/` (1–10 komik, 20–36 Dampingi dan kartu benda).
