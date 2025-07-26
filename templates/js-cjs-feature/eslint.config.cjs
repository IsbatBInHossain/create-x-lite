const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    ignores: ['dist/', 'node_modules/'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
  },
  eslintConfigPrettier,
]);
