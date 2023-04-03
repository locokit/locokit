import { Filter } from '../interfaces/toMigrate'
import { getCurrentFilters } from '../helpers/filter'
import { sdkClient } from './api'

const ITEMS_PER_PAGE = 10

export async function getUser(id: string) {
  try {
    return await sdkClient.service('user').get(id)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function createUser(data = {}) {
  try {
    return await sdkClient.service('user').create(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function patchUser(id: string, data = {}) {
  try {
    return await sdkClient.service('user').patch(id, data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function findUsers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
  sort = {
    createdAt: -1,
  },
) {
  try {
    return await sdkClient.service('user').find({
      query: {
        params,
        // $sort: sort,
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function searchUsers({
  query,
  filters,
  params = {},
  pageIndex = 0,
  limit = ITEMS_PER_PAGE,
  sort = {
    createdAt: -1,
  },
}: {
  query?: string | null
  filters?: Filter[] | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
  pageIndex?: number
  limit?: number
  sort?: Record<string, number> | null
}) {
  try {
    let parameters: Record<string, any> = {
      $limit: limit,
      $skip: pageIndex * limit,
      // $sort: sort,
      ...params,
    }
    if (filters && query) {
      parameters = {
        ...parameters,
        username: {
          $ilike: `%${query}%`,
        },
        ...getCurrentFilters(filters),
      }
    } else if (query) {
      parameters = {
        ...parameters,
        username: {
          $ilike: `%${query}%`,
        },
      }
    } else if (filters) {
      parameters = {
        ...parameters,
        ...getCurrentFilters(filters),
      }
    }
    return await sdkClient.service('user').find({
      query: parameters,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}
