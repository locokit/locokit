import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// import vueDevTools from 'vite-plugin-vue-devtools'

import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      // include: [path.resolve(__dirname, './lib.ts')],
      tsconfigPath: './tsconfig.app.json',
    }),
    // vueDevTools(),
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
        '@locokit/shared',
        '@locokit/locales',
        '@primevue/forms',
        '@primeuix/themes',
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
        'primevue/datepicker',
        'primevue/inputnumber',
        'primevue/inputtext',
        'primevue/menu',
        'primevue/message',
        'primevue/multiselect',
        'primevue/password',
        'primevue/popover',
        'primevue/select',
        'primevue/textarea',
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
          'primevue/datepicker': 'PrimeDatePicker',
          'primevue/inputnumber': 'PrimeInputNumber',
          'primevue/inputtext': 'PrimeInputText',
          'primevue/message': 'PrimeMessage',
          'primevue/password': 'PrimePassword',
          'primevue/popover': 'PrimePopover',
          'primevue/select': 'PrimeSelect',
          'primevue/multiselect': 'PrimeMultiSelect',
          'primevue/textarea': 'PrimeTextarea',
          'primevue/toggleswitch': 'PrimeToggleSwitch',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
})
