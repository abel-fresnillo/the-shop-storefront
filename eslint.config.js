import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Security rules
      'no-eval': 'error',
      'no-new-func': 'error',
      'no-implied-eval': 'error',
      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Disable React Compiler memoization warnings — we don't use the React Compiler
      'react-hooks/incompatible-library': 'off',
    },
  },
  // Test files — relax strict rules
  {
    files: [
      'src/**/*.test.{ts,tsx}',
      'src/test-utils.tsx',
      'src/setupTests.ts',
      'tests/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-console': 'off',
    },
  },
  // Non-component utility files that legitimately export non-components
  {
    files: ['src/components/ui/*.tsx', 'src/routes/index.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
