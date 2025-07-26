import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  js.configs.recommended,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/**/*.ts'],
    extends: tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: ['src/**/*.ts'],
    })),
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },
  eslintConfigPrettier,
]);
