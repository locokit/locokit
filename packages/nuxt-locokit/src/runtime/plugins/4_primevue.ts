import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log(
    '[nuxt-locokit][plugin-primevue] Registering primevue design system...',
  )
  nuxtApp.vueApp.use(PrimeVue, { ripple: true })
  nuxtApp.vueApp.use(ConfirmationService)
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
  console.log(
    '[nuxt-locokit][plugin-primevue] Registering primevue design system ok.',
  )
  return {
    provide: {
      toast: nuxtApp.vueApp.config.globalProperties.$toast,
    },
  }
})
