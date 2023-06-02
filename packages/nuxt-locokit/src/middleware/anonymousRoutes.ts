import { Pinia, storeToRefs } from 'pinia'
import { ROUTES_NAMES } from '../runtime/paths'
import { useStoreAuth } from '../runtime/stores/auth'
import { defineNuxtRouteMiddleware, useNuxtApp } from '#app'

// Check if user is already authenticated
export default defineNuxtRouteMiddleware((to, _from) => {
  const nuxtApp = useNuxtApp()
  const authStore = useStoreAuth(nuxtApp.$pinia as Pinia)
  const { isAuthenticated } = storeToRefs(authStore)

  const needAnonymous: boolean = to.matched.some((m) => m.meta.anonymous)

  if (needAnonymous && isAuthenticated.value) {
    return { name: ROUTES_NAMES.AUTH.ALREADY_AUTHENTICATED }
  }
})
