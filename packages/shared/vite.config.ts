import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({})],
  build: {
    sourcemap: true,
    lib: {
      entry: ['src/index.ts'],
      name: '@locokit/shared',
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
    rollupOptions: {
      external: ['@feathersjs/typebox', '@primevue/forms'],
    },
    target: 'node22',
  },
})
