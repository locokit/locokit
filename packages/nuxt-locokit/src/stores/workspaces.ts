import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'
import { ref } from '#imports'

export const useStoreWorkspaces = defineStore('workspaces', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const workspaces = ref([])

  async function findWorkspaces(params = {}) {
    loading.value = true
    error.value = null
    try {
      const result = await sdkClient.service('w').find(params)
      workspaces.value = result.data
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function createWorkspaces(data: {
    name: string
    summary: string | null
    public: boolean
    settings?: {
      color: string | null
      backgroundColor: string | null
      icon: string | null
    }
  }) {
    loading.value = true
    error.value = null
    try {
      const result = await sdkClient.service('w').create({
        value: data,
      })
      workspaces.value = result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  return {
    loading,
    error,
    workspaces,
    findWorkspaces,
    createWorkspaces,
  }
})
