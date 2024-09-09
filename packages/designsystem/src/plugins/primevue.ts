import { type App } from 'vue'
import Aura from '@primevue/themes/aura'
// import Aura from '@/presets/aura'

import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice' // theme
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'

/**
 * from https://uicolors.app/create with #005767 and fic input color to 500 shade
 */
const primary = {
  '50': '#d9feff',
  '100': '#9efbff',
  '200': '#47f8ff',
  '300': '#00c1c8',
  '400': '#006367',
  '500': '#005767',
  '600': '#00445c',
  '700': '#003549',
  '800': '#002a3a',
  '900': '#001d2a',
  '950': '#001622',
}

/**
 * from https://uicolors.app/create with #ff8d00 and fic input color to 500 shade
 */
const secondary = {
  '50': '#fff9eb',
  '100': '#fff2d1',
  '200': '#ffe2a2',
  '300': '#ffcb67',
  '400': '#ffa82a',
  '500': '#ff8d00',
  '600': '#f57400',
  '700': '#c45402',
  '800': '#9b420b',
  '900': '#7d380c',
  '950': '#431a04',
}

export function definePluginPrime(app: App): void {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: definePreset(Aura, {
        semantic: {
          primary,
          secondary
        }
      }),
    },
    pt: {
      password: {
        pcInput: {
          root: 'w-full'
        },
      }
    }
  })
  app.use(ToastService)
  app.use(ConfirmationService)
}
