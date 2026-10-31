// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'dist-uji/*', 'node_modules/*', 'arsip-flutter/*', 'bahan/*', 'desain/*', 'docs/*', 'coverage/*', 'android/*', 'ios/*'],
  },
]);
