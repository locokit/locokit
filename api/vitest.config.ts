import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
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
        reporter: ['text', 'json', 'html'],
        enabled: true,
        include: 'src/**',
      },
      singleThread: true,
    },
  }
})
