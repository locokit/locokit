import type { Paginated } from '@feathersjs/feathers'
import { SERVICES } from '@locokit/shared'
import type { UserData } from '@locokit/sdk'
import type { Filter } from '@locokit/vue-components'
import { getCurrentFilters } from '@/helpers/filter'
import { sdkClient } from '../sdk'

const ITEMS_PER_PAGE = 10

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
  return await sdkClient.service(SERVICES.CORE_USER).find({
    query: {
      $limit: limit,
      $skip: pageIndex * limit,
      // $sort: sort,
      ...params,
    },
  })
}

export async function searchUsers({
  search,
  filters,
  params = {},
  pageIndex = 0,
  limit = ITEMS_PER_PAGE,
  sort = {
    createdAt: -1,
  },
}: {
  search?: string | null
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
    $sort: sort,
    ...params,
  }

  if (search) {
    parameters.$or = [{ username: { $ilike: `%${search}%` } }]
  }

  if (filters) {
    parameters = {
      ...parameters,
      ...getCurrentFilters(filters),
    }
  }

  return await sdkClient.service(SERVICES.CORE_USER).find({
    query: parameters,
  })
}
