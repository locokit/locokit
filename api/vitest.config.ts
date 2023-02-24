import { defineConfig } from 'vitest/config'

export default defineConfig(() => {
  return {
    build: { target: 'esnext' },
  }
})
