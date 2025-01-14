// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      provider: 'v8',
    },
  },
})
