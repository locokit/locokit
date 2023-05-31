import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { target: 'esnext' },
  plugins: [
    tsconfigPaths({
      root: './',
    }),
  ],
  test: {
    exclude: [...configDefaults.exclude, 'test/**', 'src/configure.test.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      enabled: true,
      include: ['./src/**'],
    },
    singleThread: true,
  },
})
