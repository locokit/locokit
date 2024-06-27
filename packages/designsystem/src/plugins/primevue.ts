import { type App } from 'vue'
import Aura from '@primevue/themes/aura'
// import Aura from '@/presets/aura'

import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice' // theme
import PrimeVue from 'primevue/config'

export function definePluginPrime(app: App): void {
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: Aura,
    },
    // unstyled: true,
    // pt: {
    //   ...Aura,
    // },
  })
  app.use(ToastService)
  app.use(ConfirmationService)
}
