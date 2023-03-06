import { defineStore } from 'pinia'
import { sdkClient } from '../services/api'
import { Filter, getCurrentFilters } from '../helpers/filter'
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
      const res = await sdkClient.service('users').get(id)
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
      const res = await sdkClient.service('users').create(data)
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
      const res = await sdkClient.service('users').patch(id, data)
      loading.value = false
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      error.value = err as Error
    }
    loading.value = false
  }

  async function findUsers(params = {}) {
    loading.value = true
    error.value = null
    try {
      users.value = await sdkClient.service('users').find(params)
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
      username: 1,
      // createdAt: 1,
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
        result = await sdkClient.service('users').find({
          query: {
            username: {
              $like: `%${query}%`,
            },
            ...getCurrentFilters(filters),
            $limit: limit,
            $skip: pageIndex * limit,
            $sort: sort,
          },
        })
      } else if (query) {
        result = await sdkClient.service('users').find({
          query: {
            username: {
              $like: `%${query}%`,
            },
            $limit: limit,
            $skip: pageIndex * limit,
            $sort: sort,
          },
        })
      } else if (filters) {
        result = await sdkClient.service('users').find({
          query: {
            ...getCurrentFilters(filters),
            $limit: limit,
            $skip: pageIndex * limit,
            $sort: sort,
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
      const res = await sdkClient.service('users').patch(id, {
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
  }
})
