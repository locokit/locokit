import { defineStore } from 'pinia'
import { SERVICES } from '@locokit/definitions'
import { ref } from 'vue'
import { useSDK } from '@/composables/useSDK'
import { type UserData } from '@locokit/sdk'

export const useStoreAuth = defineStore('auth', () => {
  const authState = ref({
    loading: false,
    isAuthenticated: false,
    error: null as Error | null,
    user: {} as UserData,
  })

  const { sdkClient } = useSDK()

  async function authenticate(data: { email: string; password: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const res = await sdkClient.authenticate({
        strategy: 'local',
        email: data.email,
        password: data.password,
      })
      // const token = useCookie('token') // useCookie new hook in nuxt 3
      // token.value = res.accessToken
      authState.value.user = res.user
      // if (result.user.rules) lckAbilities.update(result.user.rules)
      authState.value.isAuthenticated = true
    } catch (err) {
      console.error(err)
      authState.value.isAuthenticated = false
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function reAuthenticate() {
    authState.value.loading = true
    authState.value.error = null
    try {
      // Todo: Not working, impossible to send a request
      const res = await sdkClient.reAuthenticate()
      // // const token = useCookie('token') // useCookie new hook in nuxt 3

      if (res.user) {
        authState.value.user = res.user
        // token.value = res.accessToken
        // if (result.user.rules) lckAbilities.update(result.user.rules)
        authState.value.isAuthenticated = true
      } else {
        // token.value = null
        authState.value.isAuthenticated = false
      }
    } catch (err) {
      console.error(err)
      authState.value.isAuthenticated = false
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function sendLinkToResetPassword(data: { email: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'sendResetPwd',
        value: data,
      })
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function resetPasswordLong(data: { token: string; password: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'resetPwdLong',
        value: data,
      })
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function verifySignupAndSetPassword(data: { token: string; password: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      await sdkClient.service(SERVICES.AUTH_AUTHENTICATION).create({
        action: 'verifySignupSetPasswordLong',
        value: data,
      })
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function signUp(data: { username: string; email: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      await sdkClient.service(SERVICES.AUTH_SIGNUP).create(data)
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function logout() {
    authState.value.loading = true
    await sdkClient.logout()
    // // const token = useCookie('token') // useCookie new hook in nuxt 3
    authState.value.isAuthenticated = false
    // token.value = null // clear the token cookie
    authState.value.user = null
    authState.value.loading = false
  }

  async function sendEmailVerifySignup(userEmail: string) {
    authState.value.loading = true
    authState.value.error = null
    try {
      await sdkClient.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'resendVerifySignup',
        value: { email: userEmail },
      })
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function patchCurrentUser(id: string, data = {}) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const res = await sdkClient.service(SERVICES.CORE_USER).patch(id, data)
      authState.value.user = res
      authState.value.loading = false
      return res
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function updateEmail(user: { email: string; password: string; newEmail: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'identityChange',
        value: {
          user: { email: user.email },
          password: user.password,
          changes: { email: user.newEmail },
        },
      })
      authState.value.loading = false
      return res
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function confirmUpdateEmail(token: string) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'verifySignupLong',
        value: token,
      })
      authState.value.loading = false
      return res
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  async function updatePassword(user: { email: string; password: string; newPassword: string }) {
    authState.value.loading = true
    authState.value.error = null
    try {
      const res = await sdkClient.service(SERVICES.AUTH_MANAGEMENT).create({
        action: 'passwordChange',
        value: {
          user: { email: user.email },
          oldPassword: user.password,
          password: user.newPassword,
        },
      })
      authState.value.loading = false
      return res
    } catch (err) {
      console.error(err)
      authState.value.error = err as Error
    }
    authState.value.loading = false
  }

  return {
    authState,
    authenticate,
    reAuthenticate,
    sendLinkToResetPassword,
    resetPasswordLong,
    verifySignupAndSetPassword,
    signUp,
    logout,
    sendEmailVerifySignup,
    patchCurrentUser,
    updateEmail,
    confirmUpdateEmail,
    updatePassword,
  }
})
