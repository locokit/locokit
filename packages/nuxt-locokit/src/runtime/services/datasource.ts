import { SERVICES } from '@locokit/definitions'
import { sdkClient } from './api'

const ITEMS_PER_PAGE = 10

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDatasource(id: string, params: null | any = null) {
  return await sdkClient.service(SERVICES.WORKSPACE_DATASOURCE).get(id, params)
}

export async function findDatasources(
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
  workspaceSlug: string,
) {
  try {
    return await sdkClient
      .service(`/workspace/${workspaceSlug}/datasource`)
      .find({
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

export async function createDatasource(
  data: {
    name: string
    documentation: string | null
    client: string
    connection: string
    type?: string
    workspaceId: string
  },
  workspaceSlug: string,
) {
  return await sdkClient
    .service(`/workspace/${workspaceSlug}/datasource`)
    .create(data)
}

export async function patchDatasource(
  id: string,
  data: {
    documentation: string | null
    client: string
    type: string
    connection: string
    createdAt: string
  },
  workspaceSlug: string,
) {
  return await sdkClient
    .service(`/workspace/${workspaceSlug}/datasource`)
    .patch(id, data)
}
