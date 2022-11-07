import { App } from 'vue'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons

import ConfirmationService from 'primevue/confirmationservice'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice' // theme

export function definePluginPrimeHistoire(app: App): void {
  app.use(PrimeVue, { ripple: true })
  app.use(ToastService)
  app.use(ConfirmationService)
}
