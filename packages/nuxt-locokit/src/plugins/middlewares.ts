import { RouteLocationNormalized } from 'vue-router'
import { addRouteMiddleware, defineNuxtPlugin } from '#app'
import { checkPathAvailable } from '../middleware/global'
import { useStoreAuth } from '../stores/auth'
import { ROUTES_PATH } from '../paths'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    const authStore = useStoreAuth()

    if (!authStore.isAuthenticated) {
      // Check if current user is still connected
      await authStore.reAuthenticate()
    }
  })

  addRouteMiddleware(
    'lck-global',
    (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const authStore = useStoreAuth()

      // To handle children routes (to get meta from parents), Nuxt recommend to use to.matched
      const needAuthentication: boolean = to.matched.some(
        (m) => m.meta.protected,
      )
      const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)

      // Todo: Waiting for resolution https://github.com/vuejs/pinia/discussions/1212
      // If issue resolved, uncomment below
      // if (!authStore.isAuthenticated) {
      //   // Check if current user is still connected
      //   await authStore.reAuthenticate()
      // }
      // const isAuthenticated = authStore.isAuthenticated
      const isAuthenticated = true // manual method to confirm auth

      if (
        checkPathAvailable(needAuthentication, needAnonymous, isAuthenticated)
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
