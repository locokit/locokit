import { defineStore } from 'pinia'
import { sdk } from '../services/api'

export const useStoreAuth = defineStore('auth', {
  state: () => ({
    loading: false,
    isAuthenticated: false,
    error: null as Error | null,
    user: null,
  }),
  actions: {
    async authenticate(data: { email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const result = await sdk.client.authenticate({
          strategy: 'local',
          email: data.email,
          password: data.password,
        })
        this.user = result.user
        // if (result.user.rules) lckAbilities.update(result.user.rules)
        this.isAuthenticated = true
      } catch (error) {
        console.error(error)
        this.isAuthenticated = false
        this.error = error
      }
      this.loading = false
    },
    async sendLinkToResetPassword(data: { email: string }) {
      this.loading = true
      this.error = null
      try {
        await sdk.client.service('auth-management').create({
          action: 'sendResetPwd',
          value: data,
        })
      } catch (error) {
        console.error(error)
        this.error = error
      }
      this.loading = false
    },
    async resetPasswordLong(data: { token: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        await sdk.client.service('auth-management').create({
          action: 'resetPwdLong',
          value: data,
        })
      } catch (error) {
        console.error(error)
        this.error = error
      }
      this.loading = false
    },
    async verifySignupAndSetPassword(data: {
      token: string
      password: string
    }) {
      this.loading = true
      this.error = null
      try {
        await sdk.client.service('auth-management').create({
          action: 'verifySignupSetPasswordLong',
          value: data,
        })
      } catch (error) {
        console.error(error)
        this.error = error
      }
      this.loading = false
    },
    async signUp(data: { name: string; email: string }) {
      this.loading = true
      this.error = null
      try {
        await sdk.client.service('signup').create(data)
      } catch (error) {
        console.error(error)
        this.error = error
      }
      this.loading = false
    },
  },
})
