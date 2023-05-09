import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    build: { target: 'esnext' },
    plugins: [tsconfigPaths()],
    test: {
      exclude: [...configDefaults.exclude, 'test/**', 'src/configure.test.ts'],
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
      singleThread: true,
    },
  }
})
