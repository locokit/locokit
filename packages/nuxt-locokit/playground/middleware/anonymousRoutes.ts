import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { useStoreAuth } from '../../src/stores/auth'
import { ROUTES_NAMES } from '../../src/paths'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  // const nuxtApp = useNuxtApp()
  const authStore = useStoreAuth()
  const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)
  await authStore.reAuthenticate()

  const isAuthenticated = authStore.isAuthenticated
  if (needAnonymous && isAuthenticated) {
    // eslint-disable-next-line @typescript-eslint/return-await
    return { name: ROUTES_NAMES.AUTH.ALREADY_AUTHENTICATED }
  }
})
