# Catatan Kejadian untuk Mengukur

**Ringkas:** (1) Sebagian besar ukuran dihitung dari tabel yang sudah ada (sesi, jawaban, bacaan, jawaban masukan). Tabel `kejadian` hanya mencatat hal yang **tidak** tercatat di tempat lain: aplikasi dibuka, rapor dibuka, pesan dibaca, pertanyaan dilewati, dan kegagalan sinkron. (2) Setiap kejadian terhubung ke **ukuran keberhasilan atau ukuran gerbang** yang sudah ditetapkan di Tahap 2. Kejadian yang tidak dipakai untuk satu ukuran pun tidak dicatat. (3) Catatan dibuat sendiri di basis data kita, **tanpa analitik pihak ketiga dan tanpa pengenal perangkat**, sesuai Kebijakan Keluarga Google Play, dan dipakai dalam bentuk jumlah, bukan untuk membuat profil anak.

Tahap 3, butir 11. Disusun 19 Oktober 2026.

---

## 1. Daftar kejadian

| Kejadian | Data tambahan | Dicatat di | Untuk ukuran |
|---|---|---|---|
| `aplikasi_dibuka` | mode (anak/orang tua/dampingi) | `kejadian` | Kembali setelah 7 dan 30 hari |
| `profil_dipilih` | — | `kejadian` | Saudara satu HP |
| `tes_penempatan_selesai` | level hasil | `sesi` (jenis tes) | Titik mulai |
| `jurus_dibuka` | kelas-level, dari mana (sebelum level / saat macet) | `kejadian` | Jurus menolong (K12) |
| `lembar_mulai` / `lembar_selesai` | `dimulai_oleh` | `sesi` | **Dimulai anak sendiri** (gerbang janji 2), lembar per minggu |
| `lembar_ditinggalkan` | soal ke berapa | `kejadian` | Penjaga "ditinggalkan", kewalahan (G6) |
| `jeda_dipakai` | lama | `sesi.jeda_n` | Memisahkan lambat dan terganggu |
| `naik_level` / `turun_level` | dari–ke | turunan `sesi` | Kecepatan naik level, macet |
| `daya_tahan_diuji` | ingat / lupa | `jawaban.daya_tahan` | Daya tahan 3 minggu |
| `baca_selesai` | detik dingin/panas, cara ukur | `bacaan` | Janji 1b |
| `dengar_bacaan_selesai` | kata benar per menit | `bacaan` (cara ukur orang tua) | Janji 1b; orang tua mendengar ≥ 2×/bulan |
| `dampingi_dibuka` / `kegiatan_dampingi_selesai` | jenis kegiatan | `kejadian` + `sesi` (mode dampingi) | Kegiatan Dampingi per minggu (K14) |
| `simulasi_selesai` | persen benar, kode B/H/S/W | `sesi` + `jawaban` | Janji 1c |
| `pesan_dikirim` / `pesan_dibaca` | jenis | `pesan` | Keterlibatan [J] |
| `bantu_aku` | soal yang macet | `pesan` | Kewalahan; saran Dampingi |
| `ajakan_dibuat` / `ajakan_selesai` | jenis | `ajakan` | Ajakan berguna atau tidak |
| `kartu_didapat` | kartu | `kartu_milik` | Membandingkan latihan mandiri dengan dan tanpa kartu (kesenjangan data hadiah maya) |
| `game_mulai` / `game_selesai` | lama, mode kunci (terbuka/setelah latihan) | `kejadian` | Batas waktu; perbandingan pilihan C (`01-produk/07` 3.4) — R4 |
| `rapor_dibuka` | dari aplikasi / link | `kejadian` | Orang tua melihat kemajuan; tanda orang tua mengontrol (> 5×/hari) |
| `link_dibuat` / `link_dicabut` | — | `link_rapor` | Pemakaian [L] |
| `pertanyaan_tampil` / `dijawab` / `dilewati` | kode, lama menjawab | `jawaban_masukan` + `kejadian` | Tanggapan putaran; mutu jawaban |
| `kami_dengar_dibuka` | edisi | `kejadian` | Apakah pesan tutup lingkaran dibaca |
| `kabar_terkirim` / `kabar_dibuka` | jenis kabar | `kejadian` | Kabar berguna atau mengganggu (K15) |
| `sinkron_gagal` | jenis kesalahan | `kejadian` | Peringatan antrean dan kesalahan |
| `antrean_lama` | jam sejak terkirim terakhir | `perangkat.antrean_belum_kirim` | Tanda 24/48 jam |
| `persetujuan_diubah` | tujuan, setuju/tidak | `persetujuan` | Bukti persetujuan |
| `akun_dihapus` | alasan (O18) | `jawaban_masukan` | Alasan berhenti |

---

## 2. Definisi ukuran utama

| Ukuran | Cara hitung | Dipakai di |
|---|---|---|
| **Kembali setelah 7 / 30 hari** | Anak dengan ≥ 1 lembar pada hari 7–13 (atau 30–36) sejak lembar pertama ÷ semua anak yang mulai | Tahap 5 angka keberhasilan; gerbang |
| **Lembar per minggu** | Jumlah sesi `lancar` + `baca` per anak per minggu (minggu Ramadan ditandai) | Ukuran harian |
| **Dimulai anak sendiri** | Sesi dengan `dimulai_oleh = anak`: tidak ada ajakan, pengingat, atau kabar ke keluarga itu dalam 2 jam sebelumnya | Gerbang janji 2 |
| **Kenaikan kecepatan dan ketepatan** | Tes tetap minggu ke-8 dibanding tes awal (detik per soal, % benar) | Gerbang janji 1a |
| **Daya tahan 3 minggu** | Uji daya tahan "ingat" ÷ semua uji | Janji 1a |
| **Tanggapan putaran** | Dijawab ÷ ditampilkan, hanya keluarga aktif | Sistem masukan |
| **Kewalahan** | Anak dengan tanda macet/ditinggalkan dalam minggu itu ÷ anak aktif | G6 |
| **Keluarga terpenuhi** | Minimal satu janji tercapai menurut aturan per keluarga (`01-produk/09` bagian 1) | G3 |

**Batas ukuran "dimulai sendiri":** aplikasi tidak tahu kalau orang tua menyuruh anak secara lisan. Karena itu ukuran ini selalu dibaca bersama jawaban O06 (`01-produk/08` bagian 3).

---

## 3. Aturan pencatatan

| Aturan | Sebab |
|---|---|
| Kejadian dicatat di HP, masuk antrean yang sama dengan hasil latihan | Tanpa sinyal tetap tercatat |
| Tanpa pengenal iklan, IMEI, MAC, lokasi, atau pengenal perangkat lain | Kebijakan Keluarga Google Play **[FAKTA]** |
| Tanpa analitik pihak ketiga | Sama; dan data tidak keluar ke pihak lain |
| Dipakai dalam bentuk jumlah untuk keputusan produk, dan untuk fungsi aplikasi (misal penjaga level) — **tidak** untuk membuat profil anak atau menawarkan sesuatu | Larangan profiling anak di PP Tunas **[FAKTA — `riset-penguat.md` bagian 9]** |
| Hanya untuk keluarga yang menyetujui tujuan "data pemakaian"; tanpa persetujuan itu, hanya data yang dibutuhkan fungsi inti yang disimpan (sesi, jawaban) | Persetujuan terpisah per tujuan |
| Rinci 12 bulan, lalu dirangkum per minggu | Ukuran dan prinsip data minimal |

**Batas yang diterima:** keluarga yang tidak menyetujui data pemakaian tetap mendapat rapor penuh dari sesi dan jawabannya sendiri, tetapi **tidak masuk hitungan ukuran mana pun**, termasuk ukuran gerbang. Sebab memakai data untuk keputusan pengembangan adalah tujuan yang berbeda dari layanan inti. **[ASUMSI — dikonfirmasi ahli hukum]** Akibatnya, kalau banyak keluarga menolak, jumlah untuk gerbang (G2) bisa kurang; angka penolakan dipantau di panel.
