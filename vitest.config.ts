import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/api',
      VITE_APP_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
      exclude: [
        'src/mocks/**',
        'src/main.tsx',
        'src/instrumentation.ts',
        'src/observability/**',
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'tests/**',
        'src/components/ui/**',
      ],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
