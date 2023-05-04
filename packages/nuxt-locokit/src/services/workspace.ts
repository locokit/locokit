import { sdkClient } from './api'
import { ITEMS_PER_PAGE_GROUPS } from './group'

const ITEMS_PER_PAGE = 10

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getWorkspace(id: string, params: null | any = null) {
  try {
    return await sdkClient.service('workspace').get(id, params)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}

export async function findWorkspaces(
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
    return await sdkClient.service('workspace').find({
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

export async function createWorkspace(data: {
  name: string
  documentation: string | null
  public: boolean
  settings?: {
    color: string | null
    backgroundColor: string | null
    icon: string | null
  }
}) {
  try {
    return await sdkClient.service('workspace').create(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return err as Error
  }
}
