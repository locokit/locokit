import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'
import { ref, useCookie } from '#imports'

export const useStoreAuth = defineStore('auth', () => {
  const loading = ref(false)
  const isAuthenticated = ref(false)
  const error = ref<Error | null>(null)
  const user = ref()

  async function authenticate(data: { email: string; password: string }) {
    loading.value = true
    error.value = null
    try {
      const result = await sdkClient.authenticate({
        strategy: 'local',
        email: data.email,
        password: data.password,
      })
      const token = useCookie('token') // useCookie new hook in nuxt 3
      token.value = result.accessToken
      user.value = result.user
      // if (result.user.rules) lckAbilities.update(result.user.rules)
      isAuthenticated.value = true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      isAuthenticated.value = false
      error.value = err as Error
    }
    loading.value = false
  }

  async function reAuthenticate() {
    loading.value = true
    error.value = null
    const result = await sdkClient.reAuthenticate()
    const token = useCookie('token') // useCookie new hook in nuxt 3

    if (result.user) {
      user.value = result.user
      token.value = result.accessToken
      // if (result.user.rules) lckAbilities.update(result.user.rules)
      isAuthenticated.value = true
    } else {
      token.value = null
      isAuthenticated.value = false
    }
    loading.value = false
  }

  async function sendLinkToResetPassword(data: { email: string }) {
    loading.value = true
    error.value = null
    try {
      await sdkClient.service('auth-management').create({
        action: 'sendResetPwd',
        value: data,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function resetPasswordLong(data: { token: string; password: string }) {
    loading.value = true
    error.value = null
    try {
      await sdkClient.service('auth-management').create({
        action: 'resetPwdLong',
        value: data,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function verifySignupAndSetPassword(data: {
    token: string
    password: string
  }) {
    loading.value = true
    error.value = null
    try {
      await sdkClient.service('auth-management').create({
        action: 'verifySignupSetPasswordLong',
        value: data,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function signUp(data: { username: string; email: string }) {
    loading.value = true
    error.value = null
    try {
      await sdkClient.service('signup').create(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function logout() {
    loading.value = true
    await sdkClient.logout()
    const token = useCookie('token') // useCookie new hook in nuxt 3
    isAuthenticated.value = false
    token.value = null // clear the token cookie
    user.value = null
    loading.value = false
  }

  return {
    loading,
    isAuthenticated,
    error,
    user,
    authenticate,
    reAuthenticate,
    sendLinkToResetPassword,
    resetPasswordLong,
    verifySignupAndSetPassword,
    signUp,
    logout,
  }
})
