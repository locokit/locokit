import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      // include: [path.resolve(__dirname, './lib.ts')],
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        lib: path.resolve(__dirname, './lib.ts'),
      }, // fichier d'entrée
      name: '@locokit/vue-components', // nom de la bibliothèque
    },
    rollupOptions: {
      external: [
        '@locokit/definitions',
        '@locokit/locales',
        '@primevue/forms',
        '@primevue/themes',
        'bootstrap-icons',
        'primeicons',
        'primevue',
        'tailwindcss',
        'tailwindcss-primeui',
        'vue',
        'vue-i18n',
      ], // empêcher Vue d'être inclus dans le bundle
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
