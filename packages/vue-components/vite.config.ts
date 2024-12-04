import { defineConfig } from 'vite'

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
      },
      name: '@locokit/vue-components',
    },
    rollupOptions: {
      // disable the fact that these libraries are transpiled inside the package
      external: [
        '@locokit/definitions',
        '@locokit/locales',
        '@primevue/forms',
        '@primevue/themes',
        'bootstrap-icons',
        'primeicons',
        /**
         * All components used in the vue-components package
         * have to be here, to avoid to be transpiled in the build
         */
        'primevue',
        'primevue/button',
        'primevue/card',
        'primevue/inputtext',
        'primevue/message',
        'primevue/password',
        'tailwindcss',
        'tailwindcss-primeui',
        'vue',
        'vue-i18n',
      ],

      output: {
        globals: {
          vue: 'Vue',
          // primevue: 'PrimeVue',
          'primevue/button': 'PrimeButton',
          'primevue/inputtext': 'PrimeInputText',
          'primevue/password': 'PrimePassword',
          'primevue/message': 'PrimeMessage',
        },
      },
    },
  },
})