import { defineStore } from 'pinia'
import { findWorkspaces } from '../services/workspace'
import { ApiWorkspace } from '../interfaces/toMigrate'
import { ref } from '#imports'

export const useStoreWorkspaces = defineStore('workspace', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const workspaces = ref<ApiWorkspace | undefined>()

  async function updateWorkspaces(params = {}) {
    loading.value = true
    error.value = null
    const res = await findWorkspaces()
    if (res instanceof Error) {
      error.value = res
    } else {
      workspaces.value = res
    }
    loading.value = false
  }

  return {
    loading,
    error,
    workspaces,
    updateWorkspaces,
  }
})
