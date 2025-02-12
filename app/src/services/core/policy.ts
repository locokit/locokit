import { SERVICES } from '@locokit/definitions'
import { sdkClient } from '../sdk'

const ITEMS_PER_PAGE = 10

export async function getPolicy(id: string) {
  return await sdkClient.service(SERVICES.CORE_POLICY).get(id)
}

export async function findPolicies(
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
    sort?: Record<string, number>
  } = {
    params: {},
    pageIndex: 0,
    limit: ITEMS_PER_PAGE,
    sort: {
      createdAt: -1,
    },
  },
) {
  return await sdkClient.service(SERVICES.CORE_POLICY).find({
    query: {
      $limit: limit,
      $skip: pageIndex * limit,
      $sort: sort,
      ...params,
    },
  })
}
