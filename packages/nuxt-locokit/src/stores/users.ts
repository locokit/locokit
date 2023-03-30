import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'
import { getCurrentFilters } from '../helpers/filter'
import { Filter } from '../interfaces/toMigrate'
import { ref } from '#imports'

export const useStoreUsers = defineStore('users', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const users = ref()
  const suggestedUsers = ref()
  const ITEMS_PER_PAGE = 10

  async function getUser(id: string) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service('user').get(id)
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function createUser(data = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service('user').create(data)
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function patchUser(id: string, data = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service('user').patch(id, data)
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function findUsers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>,
    sort = {
      createdAt: -1,
    },
  ) {
    loading.value = true
    error.value = null
    try {
      users.value = await sdkClient.service('user').find({
        query: {
          params,
          // $sort: sort,
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function searchUsers({
    query,
    filters,
    pageIndex = 0,
    limit = ITEMS_PER_PAGE,
    sort = {
      createdAt: -1,
    },
  }: {
    query?: string | null
    filters?: Filter[] | null
    pageIndex?: number
    limit?: number
    sort?: Record<string, number> | null
  }) {
    loading.value = true
    error.value = null
    try {
      let result = null
      if (filters && query) {
        result = await sdkClient.service('user').find({
          query: {
            username: {
              $ilike: `%${query}%`,
            },
            ...getCurrentFilters(filters),
            $limit: limit,
            $skip: pageIndex * limit,
            // $sort: sort,
          },
        })
      } else if (query) {
        result = await sdkClient.service('user').find({
          query: {
            username: {
              $ilike: `%${query}%`,
            },
            $limit: limit,
            $skip: pageIndex * limit,
            // $sort: sort,
          },
        })
      } else if (filters) {
        result = await sdkClient.service('user').find({
          query: {
            ...getCurrentFilters(filters),
            $limit: limit,
            $skip: pageIndex * limit,
            // $sort: sort,
          },
        })
      }
      loading.value = false
      return result
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function blockAccountUser(id: string, blocked: boolean) {
    loading.value = true
    error.value = null
    try {
      const res = await sdkClient.service('user').patch(id, {
        blocked: !blocked,
      })
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  function squashUsers(data: {
    id: string
    username: string
    lastName: string | null
    firstName: string | null
  }) {
    if (users.value.total > 0) {
      const userFound = users.value.data.findIndex(
        ({ id }: { id: string }) => id === data.id,
      )
      if (userFound > -1) {
        users.value = findUsers({})
      }
    }
  }

  return {
    loading,
    error,
    users,
    suggestedUsers,
    getUser,
    createUser,
    patchUser,
    findUsers,
    searchUsers,
    blockAccountUser,
    squashUsers,
  }
})
