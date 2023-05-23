import { defineStore } from 'pinia'
import { findGroups } from '../services/group'
import { ApiGroup } from '../interfaces/toMigrate'
import { ref } from '#imports'

export const useStoreGroups = defineStore('groups', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const groups = ref<ApiGroup | undefined>()

  async function updateGroups(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>,
    sort = {
      createdAt: -1,
    },
  ) {
    loading.value = true
    error.value = null
    const res = await findGroups({ params, sort })
    if (res instanceof Error) {
      error.value = res
    } else {
      groups.value = res
    }
    loading.value = false
  }

  async function squashGroups(data: { id: string; name: string }) {
    if (groups.value && groups.value.total > 0) {
      const userFound = groups.value.data.findIndex(
        ({ id }: { id: string }) => id === data.id,
      )
      if (userFound > -1) {
        const res = await findGroups()
        if (res instanceof Error) {
          error.value = res
        } else {
          groups.value = res
        }
      }
    }
  }

  return {
    loading,
    error,
    groups,
    updateGroups,
    squashGroups,
  }
})
