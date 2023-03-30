import { ApiUserGroup } from '../interfaces/toMigrate'
import { sdkClient } from './api'
import { findUserGroups } from './usergroups'

export const ITEMS_PER_PAGE_GROUPS = 20

export async function findGroups({
  params = {},
  pageIndex = 0,
  limit = ITEMS_PER_PAGE_GROUPS,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
  pageIndex?: number
  limit?: number
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
  params = {},
  pageIndex = 0,
  limit = ITEMS_PER_PAGE_GROUPS,
}: {
  query: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
  pageIndex?: number
  limit?: number
}) {
  try {
    return await sdkClient.service('group').find({
      query: {
        name: {
          $ilike: `%${query}%`,
        },
        ...params,
        $limit: limit,
        $skip: pageIndex * limit,
        // $sort: sort,
      },
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
  return []
}
