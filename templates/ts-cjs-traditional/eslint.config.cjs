const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  js.configs.recommended,
  { ignores: ['dist/', 'node_modules/'] },
  {
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },
  {
    files: ['src/**/*.ts'],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintConfigPrettier,
]);
