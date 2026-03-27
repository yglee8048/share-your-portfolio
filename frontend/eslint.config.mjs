import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── TypeScript 강화 ────────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint },
    languageOptions: { parser: tsParser },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // ── Import 순서 및 순환 의존 ───────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { import: importPlugin },
    rules: {
      'import/no-cycle': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  },

  // ── 레이어 경계 (FSD-lite) ────────────────────────────────────────────────
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'features', pattern: 'src/features/**', capture: ['domain'] },
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'theme', pattern: 'src/theme/**' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app → 모두 허용
            { from: 'app', allow: ['app', 'features', 'shared', 'theme'] },
            // features → shared, theme만 허용 (다른 feature 슬라이스 교차 금지)
            { from: 'features', allow: ['shared', 'theme'] },
            // shared → shared, theme만 허용 (features import 금지)
            { from: 'shared', allow: ['shared', 'theme'] },
            // theme → theme만 허용
            { from: 'theme', allow: ['theme'] },
          ],
        },
      ],
    },
  },

  // ── 글로벌 무시 ───────────────────────────────────────────────────────────
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
