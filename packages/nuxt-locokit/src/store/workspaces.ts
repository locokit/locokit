import { defineStore } from 'pinia'
import { sdk } from '../services/api'

export const useStoreWorkspaces = defineStore('workspaces', {
  state: () => ({
    loading: false,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    error: {
      code: null,
      content: null,
    } as Error | null | { code: string | null, content: string | null },
    workspaces: [],
  }),
  actions: {
    async fetch (params?) {
      this.loading = true
      this.error = null
      try {
        const result = await sdk.services.workspace.find(params)
        console.log(result)
        this.workspaces = result
      } catch (error) {
        console.error(error)
        this.error = error as Error
      }
      this.loading = false
    },
  },
})
