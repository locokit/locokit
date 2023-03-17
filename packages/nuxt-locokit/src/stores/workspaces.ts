import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'
import { ref } from '#imports'

export const useStoreWorkspaces = defineStore('workspace', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const workspaces = ref([])

  async function findWorkspaces(params = {}) {
    loading.value = true
    error.value = null
    try {
      const result = await sdkClient.service('workspace').find(params)
      workspaces.value = result.data
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function createWorkspace(data: {
    name: string
    documentation: string | null
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
      const res = await sdkClient.service('workspace').create(data)
      workspaces.value.push(res)
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
    createWorkspace,
  }
})
