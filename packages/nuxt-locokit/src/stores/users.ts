import { defineStore } from 'pinia'
import { findUsers, patchUser } from '../services/user'
import { ApiUser } from '../interfaces/toMigrate'
import { ref } from '#imports'

export const useStoreUsers = defineStore('users', () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const users = ref<ApiUser | undefined>()

  async function updateUsers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>,
    sort = {
      createdAt: -1,
    },
  ) {
    loading.value = true
    error.value = null
    const res = await findUsers({ params, sort })
    if (res instanceof Error) {
      error.value = res
    } else {
      users.value = res
    }
    loading.value = false
  }

  async function toggleBlockAccountUser(id: string, blocked: boolean) {
    loading.value = true
    error.value = null
    const res = await patchUser(id, {
      blocked: !blocked,
    })
    if (res instanceof Error) {
      error.value = res
    } else {
      users.value = res
    }
    loading.value = false
  }

  async function squashUsers(data: {
    id: string
    username: string
    lastName: string | null
    firstName: string | null
  }) {
    if (users.value && users.value.total > 0) {
      const userFound = users.value.data.findIndex(
        ({ id }: { id: string }) => id === data.id,
      )
      if (userFound > -1) {
        const res = await findUsers()
        if (res instanceof Error) {
          error.value = res
        } else {
          users.value = res
        }
      }
    }
  }

  return {
    loading,
    error,
    users,
    updateUsers,
    toggleBlockAccountUser,
    squashUsers,
  }
})
