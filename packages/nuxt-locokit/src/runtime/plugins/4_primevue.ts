import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import en from '@locokit/i18n/en.json'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  console.log(
    '[nuxt-locokit][plugin-primevue] Registering primevue design system...',
  )

  // Todo see locokit/packages/nuxt-locokit/src/runtime/plugins/3_i18n.ts:9
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    locale: Object.assign({}, en.localePrime),
  })
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
