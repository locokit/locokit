import { ApiUserGroup, Filter } from '../interfaces/toMigrate'
import { getCurrentFilters } from '../helpers/filter'
import { sdkClient } from './api'
import { findUserGroups } from './usergroup'

export const ITEMS_PER_PAGE_GROUPS = 20

export async function findGroups({
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort?: Record<string, any>
}) {
  try {
    return await sdkClient.service('group').find({
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
  sort?: Record<string, number> | null
}) {
  try {
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
    return await sdkClient.service('group').find({
      query: parameters,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function findGroupsFomUser(userId: string) {
  const usergroups: ApiUserGroup = await findUserGroups({ userId })
  if (usergroups && usergroups.total > 0) {
    const userGroupsIds = usergroups.data.reduce((acc: string[], usergroup) => {
      acc.push(usergroup.groupId)
      return acc
    }, [])
    return await findGroups({
      params: { id: { $in: userGroupsIds }, $eager: 'workspace' },
    })
  }
  return { total: 0, data: [] }
}
