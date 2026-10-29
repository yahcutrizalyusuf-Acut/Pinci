# Keputusan Pembangunan

Keputusan yang diambil sendiri selama pembangunan, beserta alasannya. Rancangan (`docs/rancangan/keputusan.md`) dan `CLAUDE.md` tetap berlaku di atas berkas ini.

| # | Keputusan | Alasan |
|---|---|---|
| 1 | Expo SDK 58 (terbaru stabil per 29 Okt 2026), React Native 0.88, expo-router 58 | `CLAUDE.md`: SDK stabil terbaru |
| 2 | Rute ada di `src/app/`, bukan `app/` | Susunan bawaan Expo SDK 58. Isinya sama dengan yang diminta prompt |
| 3 | Pustaka dipasang dengan versi dari `expo/bundledNativeModules.json`, bukan `npx expo install` | Layanan versi Expo diblokir dari sesi cloud. Hasilnya sama: versi yang cocok dengan SDK 58 |
| 4 | Izin Android: rekaman suara, kamera, lokasi, kontak, dan ID iklan diblokir di `app.json` | Kebijakan Keluarga dan data anak seminim mungkin |
