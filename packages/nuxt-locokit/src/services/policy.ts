import { sdkClient } from './api'

const ITEMS_PER_PAGE = 10

export async function getPolicy(id: string) {
  try {
    return await sdkClient.service('role').get(id)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
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
    return await sdkClient.service('role').find({
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
