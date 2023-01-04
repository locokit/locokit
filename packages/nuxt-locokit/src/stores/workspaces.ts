import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'

export const useStoreWorkspaces = defineStore('workspaces', {
  state: () => ({
    loading: false,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    error: null as Error | null,
    workspaces: [],
  }),
  actions: {
    async findWorkspaces(params = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await sdkClient.service('w').find(params)
        this.workspaces = result.data
      } catch (error) {
        console.error(error)
        this.error = error as Error
      }
      this.loading = false
    },
    async createWorkspaces(data: {
      name: string
      summary: string | null
      public: boolean
      settings?: {
        color: string | null
        backgroundColor: string | null
        icon: string | null
      }
    }) {
      this.loading = true
      this.error = null
      try {
        const result = await sdkClient.service('w').create({
          value: data,
        })
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
