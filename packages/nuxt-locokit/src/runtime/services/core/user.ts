import { SERVICES } from '@locokit/definitions'
import { UserData } from '@locokit/sdk'
import { ApiUserGroup, Filter } from '../../interfaces/toMigrate'
import { getCurrentFilters } from '../../helpers/filter'
import { sdkClient } from '../api'
import { findUserGroups } from './usergroup'

const ITEMS_PER_PAGE = 10

export async function getUser(id: string) {
  try {
    return await sdkClient.service(SERVICES.CORE_USER).get(id)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function createUser(data: UserData) {
  try {
    return await sdkClient.service(SERVICES.CORE_USER).create(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function patchUser(id: string, data: Partial<UserData> = {}) {
  try {
    return await sdkClient.service(SERVICES.CORE_USER).patch(id, data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function findUsers(
  {
    params = {},
    pageIndex = 0,
    limit = ITEMS_PER_PAGE,
    sort = {
      createdAt: -1,
    },
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>
    pageIndex?: number
    limit?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sort?: Record<string, any>
  } = {
    params: {},
    pageIndex: 0,
    limit: ITEMS_PER_PAGE,
    sort: {
      createdAt: -1,
    },
  },
) {
  try {
    return await sdkClient.service(SERVICES.CORE_USER).find({
      query: {
        $limit: limit,
        $skip: pageIndex * limit,
        ...params,
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
  sort?: Record<string, number>
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return await sdkClient.service(SERVICES.CORE_USER).find({
    query: parameters,
  })
}

export async function findMembersFomGroup(groupId: string) {
  const usergroups: ApiUserGroup = await findUserGroups({ groupId })
  if (usergroups && usergroups.total > 0) {
    const userIds = usergroups.data.reduce((acc: string[], usergroup) => {
      acc.push(usergroup.userId)
      return acc
    }, [])
    return await findUsers({
      params: { id: { $in: userIds } },
    })
  }
  return { total: 0, data: [] }
}
