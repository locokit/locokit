// import 'primevue/resources/primevue.min.css' // core css
// import 'primeicons/primeicons.css' // icons
// import 'primeflex/primeflex.css'
// import Tooltip from 'primevue/tooltip'
// import ConfirmationService from 'primevue/confirmationservice'
// import '@/styles/index.scss'

import PrimeVue from 'primevue/config'
// import ToastService from 'primevue/toastservice' // theme

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('[nuxt-locokit][plugin-primevue] Registering primevue design system...')
  nuxtApp.vueApp.use(PrimeVue, { ripple: true })
  console.log('[nuxt-locokit][plugin-primevue] Registering primevue design system ok.')
  // nuxtApp.use(ToastService)
  // nuxtApp.use(ConfirmationService)
  // nuxtApp.directive('tooltip', Tooltip)
})
