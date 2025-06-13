import { ref, watch } from 'vue'
import { sdkClient } from '@/services/sdk'
import { useDebounceFn } from '@vueuse/core'
import type { Query } from '@feathersjs/feathers'

/**
 * Composable to work with workspace policies
 * Fetch, create, patch and remove policies.
 *
 * @param workspaceSlug slug of the current workspace
 */
export function useWorkspacePolicies(workspaceSlug: string) {
  const state = ref<{
    loading: boolean
    search: string
    policies: any[]
    error: Error | null

    loadingSingle: boolean
    policy: any | null
  }>({
    loading: false,
    search: '',
    policies: [],
    error: null,

    loadingSingle: false,
    policy: null,
  })

  async function fetchPolicies() {
    state.value.loading = true
    try {
      const query: Query = {
        $limit: 50,
      }
      if (state.value.search) {
        query.name = {
          $ilike: '%' + state.value.search + '%',
        }
      }
      const policies = await sdkClient.service('/workspace/' + workspaceSlug + '/policy').find({
        query,
      })
      state.value.policies = policies.data
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loading = false
  }

  const debouncedFetchPolicies = useDebounceFn(() => {
    // do something
    fetchPolicies()
  }, 1000)

  async function fetchPolicy(id: string) {
    state.value.loadingSingle = true
    try {
      state.value.policy = await sdkClient
        .service('/workspace/' + workspaceSlug + '/policy')
        .get(id)
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loadingSingle = false
  }

  async function createPolicy() {}

  async function patchPolicy(id: string) {}

  async function removePolicy(id: string) {}

  watch(
    () => state.value.search,
    () => {
      debouncedFetchPolicies()
    },
    { immediate: true },
  )

  return {
    state,
    fetchPolicies,
    fetchPolicy,
    createPolicy,
    patchPolicy,
    removePolicy,
  }
}
