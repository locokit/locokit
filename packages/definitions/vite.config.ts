import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({})],
  build: {
    sourcemap: true,
    lib: {
      entry: ['src/index.ts'],
      name: '@locokit/definitions',
      formats: ['cjs', 'es'],
      fileName(format, entry) {
        switch (format) {
          case 'es':
            return entry + '.mjs'
          case 'cjs':
          default:
            return entry + '.js'
        }
      },
    },
    target: 'node18',
  },
})
