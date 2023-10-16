import { SERVICES } from '@locokit/definitions'
import { GroupData } from '@locokit/sdk'
import { ApiUserGroup, Filter } from '../../interfaces/toMigrate'
import { getCurrentFilters } from '../../helpers/filter'
import { sdkClient } from '../api'
import { findUserGroups } from './usergroup'

export const ITEMS_PER_PAGE_GROUPS = 20

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGroup(id: string, params: null | any = null) {
  return await sdkClient.service(SERVICES.CORE_GROUP).get(id, params)
}

export async function createGroup(data: GroupData) {
  return await sdkClient.service(SERVICES.CORE_GROUP).create(data)
}

export async function patchGroup(id: string, data = {}) {
  return await sdkClient.service(SERVICES.CORE_GROUP).patch(id, data)
}

export async function findGroups(
  {
    params = {},
    pageIndex = 0,
    limit = ITEMS_PER_PAGE_GROUPS,
    sort = {
      createdAt: -1,
    },
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>
    pageIndex?: number
    limit?: number
    sort?: Record<string, number>
  } = {
    params: {},
    pageIndex: 0,
    limit: ITEMS_PER_PAGE_GROUPS,
    sort: {
      createdAt: -1,
    },
  },
) {
  return await sdkClient.service(SERVICES.CORE_GROUP).find({
    query: {
      $limit: limit,
      $skip: pageIndex * limit,
      ...params,
      // $sort: sort,
    },
  })
}

export async function searchGroups({
  query,
  filters,
  params = {},
  pageIndex = 0,
  limit = ITEMS_PER_PAGE_GROUPS,
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
      name: {
        $ilike: `%${query}%`,
      },
      ...getCurrentFilters(filters),
    }
  } else if (query) {
    parameters = {
      ...parameters,
      name: {
        $ilike: `%${query}%`,
      },
    }
  } else if (filters) {
    parameters = {
      ...parameters,
      ...getCurrentFilters(filters),
    }
  }
  return await sdkClient.service(SERVICES.CORE_GROUP).find({
    query: parameters,
  })
}

export async function findGroupsFomUser(userId: string) {
  const usergroups: ApiUserGroup = await findUserGroups({ userId })
  if (usergroups && usergroups.total > 0) {
    const userGroupsIds = usergroups.data.reduce((acc: string[], usergroup) => {
      acc.push(usergroup.groupId)
      return acc
    }, [])
    const foundGroups = await findGroups({
      params: { id: { $in: userGroupsIds }, $eager: 'workspace' },
    })
    if (foundGroups?.total) {
      return foundGroups
    }
    return { total: 0, data: [] }
  }
  return { total: 0, data: [] }
}
