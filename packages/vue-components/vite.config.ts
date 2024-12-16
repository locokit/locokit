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
        'primevue/autocomplete',
        'primevue/button',
        'primevue/card',
        'primevue/inputtext',
        'primevue/inputnumber',
        'primevue/message',
        'primevue/password',
        'primevue/datepicker',
        'primevue/select',
        'primevue/toggleswitch',

        'tailwindcss',
        'tailwindcss-primeui',
        'vue',
        'vue-i18n',
      ],

      output: {
        globals: {
          vue: 'Vue',
          primevue: 'PrimeVue',
          'primevue/autocomplete': 'PrimeAutocomplete',
          'primevue/button': 'PrimeButton',
          'primevue/card': 'PrimeCard',
          'primevue/inputtext': 'PrimeInputText',
          'primevue/inputnumber': 'PrimeInputNumber',
          'primevue/message': 'PrimeMessage',
          'primevue/password': 'PrimePassword',
          'primevue/datepicker': 'PrimeDatePicker',
          'primevue/select': 'PrimeSelect',
          'primevue/toggleswitch': 'PrimeToggleSwitch',
        },
      },
    },
  },
})
