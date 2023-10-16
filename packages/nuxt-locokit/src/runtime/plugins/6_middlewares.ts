import { RouteLocationNormalized } from 'vue-router'
import { Pinia, storeToRefs } from 'pinia'
import { usePrimeVue } from 'primevue/config'
import { useI18n } from 'vue-i18n'
import { useStoreAuth } from '../stores/auth'
import { checkPathAvailable } from '../middleware/global'
import { ROUTES_PATH } from '../locokit-paths'
import {
  addRouteMiddleware,
  defineNuxtPlugin,
  useCookie,
  useNuxtApp,
} from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    const authStore = useStoreAuth(nuxtApp.$pinia as Pinia)
    const { isAuthenticated } = storeToRefs(authStore)

    if (isAuthenticated.value) {
      // Check if current user is still connected
      await authStore.reAuthenticate()
    }

    const primevue = usePrimeVue()
    const { t } = useI18n({ useScope: 'global' })

    console.log(t('localePrime'))
    primevue.config.locale.firstDayOfWeek = t('localePrime.firstDayOfWeek')
  })

  addRouteMiddleware(
    'lck-global',
    (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
      const nuxtApp = useNuxtApp()
      const token = useCookie('token') // get token from cookies
      const authStore = useStoreAuth(nuxtApp.$pinia as Pinia)
      const { isAuthenticated } = storeToRefs(authStore)
      // console.log(import.meta.env.SSR)

      // To handle children routes (to get meta from parents), Nuxt recommend to use to.matched

      const needAuthentication: boolean = to.matched.some(
        (m) => m.meta.protected,
      )
      const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)

      if (token.value) {
        isAuthenticated.value = true
      }

      if (
        checkPathAvailable(
          needAuthentication,
          needAnonymous,
          isAuthenticated.value,
        )
      ) {
        return
      }

      return { path: ROUTES_PATH.AUTH.SIGN_IN }
    },
    {
      global: true,
    },
  )
})
