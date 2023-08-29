import { defineStore } from 'pinia'
import { findWorkspaces, getWorkspace } from '../services/core/workspace'
import { ApiWorkspace, Workspace } from '../interfaces/toMigrate'
import { ref } from '#imports'

export const useStoreWorkspaces = defineStore('workspace', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const workspaces = ref<ApiWorkspace | undefined>()
  const currentWorkspace = ref<Workspace>()

  async function updateCurrentWorkspace(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>,
  ) {
    loading.value = true
    error.value = null
    const res = await getWorkspace(id, params)
    if (res instanceof Error) {
      error.value = res
    } else {
      currentWorkspace.value = res
    }
    loading.value = false
  }

  async function updateWorkspaces(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>,
    sort = {
      createdAt: -1,
    },
  ) {
    loading.value = true
    error.value = null
    const res = await findWorkspaces({ params, sort })
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
    currentWorkspace,
    updateWorkspaces,
    updateCurrentWorkspace,
  }
})
