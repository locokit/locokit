import type { GroupResult } from '@locokit/sdk'
import { ref, watch } from 'vue'
import { sdkClient } from '@/services/sdk'
import type { Paginated, Query } from '@feathersjs/feathers'

export function useGroups(workspaceSlug: string) {
  const state = ref<{
    loading: boolean
    search: string | null
    error: Error | null
    groups: GroupResult[] | null
  }>({
    loading: false,
    search: null,
    groups: [],
    error: null,
  })

  async function fetchGroups() {
    state.value.loading = true
    try {
      const query: Query = {
        $sort: { name: 1 },
      }
      if (state.value.search) query.name = { $ilike: `%${state.value.search}%` }
      const groups = (await sdkClient
        .service('/workspace/' + workspaceSlug + '/group')
        .find({ query })) as Paginated<GroupResult>
      state.value.groups = groups.data
    } catch (error) {
      state.value.error = error as Error
      console.error(error)
    }
    state.value.loading = false
  }

  watch(
    () => state.value.search,
    async (search: string | null) => {
      fetchGroups()
    },
    {
      immediate: true,
    },
  )

  return {
    state,
    fetchGroups,
  }
}
