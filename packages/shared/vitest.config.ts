import dotenv from 'dotenv-flow'
dotenv.config()

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: { target: 'esnext' },
  plugins: [
    tsconfigPaths({
      root: './',
    }),
  ],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      enabled: true,
      include: ['./src/**'],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
