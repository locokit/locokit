import type { WorkspaceResult } from '@locokit/sdk'
import { ref } from 'vue'
import { sdkClient } from '@/services/sdk'

export function useWorkspace() {
  const state = ref<{ loading: boolean; error: Error | null; workspace: WorkspaceResult | null }>({
    loading: false,
    error: null,
    workspace: null,
  })

  async function fetchWorkspace(workspaceSlug: string) {
    state.value.loading = true
    try {
      const workspaceResponse = await sdkClient.service('/core/workspace').find({
        query: {
          slug: workspaceSlug,
        },
      })
      if (workspaceResponse.total !== 1) {
        throw new Error(`Workspace not found (${workspaceResponse.total} item-s found)`)
      }
      const currentWorkspace: WorkspaceResult = workspaceResponse.data[0] as WorkspaceResult
      // fetch all datasources related resources
      const datasourceTables = await sdkClient
        .service('/workspace/' + currentWorkspace.slug + '/datasource')
        .find({
          query: {
            $eager: '[tables.[fields]]',
          },
        })
      currentWorkspace.datasources = datasourceTables.data
      state.value.workspace = currentWorkspace
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loading = false
  }

  function resetWorkspace() {
    state.value.loading = false
    state.value.error = null
    state.value.workspace = null
  }

  return {
    state,
    resetWorkspace,
    fetchWorkspace,
  }
}
