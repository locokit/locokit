import { defineStore } from 'pinia'
import { sdk } from '../services/api'

export const useStoreWorkspaces = defineStore('workspaces', {
  state: () => ({
    loading: false,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    error: null as Error | null,
    workspaces: [],
  }),
  actions: {
    async getWorkspaces(params) {
      this.loading = true
      this.error = null
      try {
        const result = await sdk.services.workspace.find(params)
        this.workspaces = result
      } catch (error) {
        console.error(error)
        this.error = error as Error
      }
      this.loading = false
    },
    async createWorkspaces(data: {
      name: string
      slug: string
      summary: string | null
      public: boolean
      activeSQL: boolean
      settings: null | Array<{ icon?: string | null; color?: string | null }>
    }) {
      this.loading = true
      this.error = null
      try {
        const result = await sdk.services.workspace.create(data)
        this.workspaces = result
      } catch (error) {
        console.error(error)
        this.error = error as Error
      }
      this.loading = false
    },
  },
})
