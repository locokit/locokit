import { RouteLocationNormalized } from 'vue-router'
import {
  abortNavigation,
  addRouteMiddleware,
  defineNuxtPlugin,
  navigateTo,
  callWithNuxt,
} from '#app'
import { checkPathAvailable, checkUserLogIn } from '../middleware/global'
import { useStoreAuth } from '../stores/auth'
import { ROUTES_NAMES, ROUTES_PATH } from '../paths'

export default defineNuxtPlugin((nuxt) => {
  // console.log(nuxt)
  // const authStore = useStoreAuth()

  addRouteMiddleware(
    'lck-global',
    async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
      const authStore = useStoreAuth()
      console.log('Bouh')
      if (!authStore.isAuthenticated) {
        // Check if current user is still connected
        await authStore.reAuthenticate()
      }
      // To handle children routes (to get meta from parents), Nuxt recommend to use to.matched
      const needAuthentication: boolean = to.matched.some(
        (m) => m.meta.protected,
      )
      const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)

      const isAuthenticated = true
      if (
        checkPathAvailable(needAuthentication, needAnonymous, isAuthenticated)
      ) {
        return
      }

      // return await navigateTo({
      //   path: 'auth/signin',
      //   query: {
      //     baz: 'programmatic-navigation',
      //   },
      // })

      return { path: ROUTES_PATH.AUTH.SIGN_IN }
    },
    {
      global: true,
    },
  )
})
