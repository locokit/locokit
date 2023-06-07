import { defineStore } from 'pinia'
import { SERVICES } from '@locokit/definitions'
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
      const res = await sdkClient.authenticate({
        strategy: 'local',
        email: data.email,
        password: data.password,
      })
      const token = useCookie('token') // useCookie new hook in nuxt 3
      token.value = res.accessToken
      user.value = res.user
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
    // Todo: Not working, impossible to send a request
    const res = await sdkClient.reAuthenticate()
    const token = useCookie('token') // useCookie new hook in nuxt 3

    if (res.user) {
      user.value = res.user
      token.value = res.accessToken
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
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
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
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
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
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
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

  async function sendEmailVerifySignup(userEmail: string) {
    loading.value = true
    error.value = null
    try {
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'resendVerifySignup',
        value: { email: userEmail },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function patchCurrentUser(id: string, data = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service('user').patch(id, data)
      user.value = res
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function updateEmail(user: {
    email: string
    password: string
    newEmail: string
  }) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'identityChange',
        value: {
          user: { email: user.email },
          password: user.password,
          changes: { email: user.newEmail },
        },
      })
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function confirmUpdateEmail(token: string) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'verifySignupLong',
        value: token,
      })
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function updatePassword(user: {
    email: string
    password: string
    newPassword: string
  }) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'passwordChange',
        value: {
          user: { email: user.email },
          oldPassword: user.password,
          password: user.newPassword,
        },
      })
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
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
    sendEmailVerifySignup,
    updateEmail,
    confirmUpdateEmail,
    updatePassword,
    patchCurrentUser,
  }
})
