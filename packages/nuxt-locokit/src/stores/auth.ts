import { defineStore } from 'pinia'
import { sdk } from '../services/api'

export const useStoreAuth = defineStore('auth', {
  state: () => ({
    loading: false,
    isAuthenticated: false,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    error: {
      code: null,
      content: null,
    } as Error | null | { code: string | null; content: string | null },
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
        console.log(result)
        this.user = result.user
        // if (result.user.rules) lckAbilities.update(result.user.rules)
        this.isAuthenticated = true
      } catch (error) {
        console.error(error)
        this.isAuthenticated = false
        this.error = error as Error
      }
      this.loading = false
    },
  },
})
