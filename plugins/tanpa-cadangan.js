/**
 * Plugin konfigurasi Expo: data aplikasi TIDAK ikut cadangan awan Android dan TIDAK ikut pindah data antar-HP
 * (Android 12 ke atas memakai dataExtractionRules; allowBackup=false saja tidak cukup). CLAUDE.md aturan 12:
 * rekaman suara anak hanya di HP ini.
 */
const fs = require('node:fs');
const path = require('node:path');
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const ATURAN = `<?xml version="1.0" encoding="utf-8"?>
<!-- Semua data aplikasi dikecualikan dari cadangan awan dan pindah data antar-HP. -->
<data-extraction-rules>
  <cloud-backup>
    <exclude domain="root" path="." />
    <exclude domain="file" path="." />
    <exclude domain="database" path="." />
    <exclude domain="sharedpref" path="." />
    <exclude domain="external" path="." />
  </cloud-backup>
  <device-transfer>
    <exclude domain="root" path="." />
    <exclude domain="file" path="." />
    <exclude domain="database" path="." />
    <exclude domain="sharedpref" path="." />
    <exclude domain="external" path="." />
  </device-transfer>
</data-extraction-rules>
`;

module.exports = function tanpaCadangan(config) {
  config = withDangerousMod(config, [
    'android',
    async (c) => {
      const folder = path.join(c.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res', 'xml');
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, 'aturan_tanpa_cadangan.xml'), ATURAN);
      return c;
    },
  ]);
  return withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application?.[0];
    if (app) {
      app.$['android:allowBackup'] = 'false';
      app.$['android:fullBackupContent'] = 'false';
      app.$['android:dataExtractionRules'] = '@xml/aturan_tanpa_cadangan';
    }
    return c;
  });
};
